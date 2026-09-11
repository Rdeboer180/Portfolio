// ============================================
// Talent tree: scoring, archetype pairing, the result, and the share link
// Stats are computed for everyone by the same rules, never hand-set, so the
// numbers on the card are defensible (BRIEF-v3, "Traits and titles").
// ============================================

import type {
  Allocation,
  Archetype,
  Degree,
  HoursBand,
  Intake,
  Major,
  Minor,
  TalentNode,
  TalentResult,
  TalentTree,
  Trait,
} from './types';
import { TRAITS } from './types';
import { NODE_LIST, TREES } from './trees';
import { computePools, normalizeAllocation, sanitizeHours, sanitizeSplit, sanitizeYears, splitOf, withinPools } from './economy';

// ── Trait scores ────────────────────────────────────────────────────────────
//
// Normalization, in full:
//
// 1. Raw. For each trait t, raw[t] = Σ over nodes of points × weight[t]. Node
//    weights sum to 1, so Σ raw = points spent (P).
//
// 2. Capacity. cap[t] = Σ over nodes of 5 × weight[t]: what the trait would
//    read if every node were mastered. C = Σ cap = 150. Capacities are not
//    equal (systems is expressed by more nodes than ai), and that is the point
//    of the next step.
//
// 3. Relative fill. u[t] = (raw[t] / cap[t]) / (P / C). A trait's fill is
//    the share of its capacity the visitor has claimed; dividing by the overall
//    fill makes 1.0 mean "claimed at the same rate as the tree as a whole".
//    An allocation that spreads evenly over every node reads 1.0 on all eight
//    traits, whatever the pool size, so the shape of the profile is measured
//    and the size of the pool is not. Plain shares (raw / P) were rejected
//    because an even spread then reads as Systems 93, a bias of the tree, not
//    of the designer.
//
// 4. Ceiling. spread = sqrt(Σ (cap[t] / C) × (u[t] − 1)²), the capacity-weighted
//    standard deviation of u: 0 for an even spread, about 0.05 for a mild lean,
//    about 0.28 for a concentrated multiclass like Ryan's, 0.6 and up for a
//    single-trait focus. The ceiling is a logistic over spread,
//    100 / (1 + e^(−11.5 × (spread − 0.037))): an even spread tops out at 40, a
//    mild lean in the 50s, a distinct shape in the 90s, a single focus at 99+.
//    So a focused allocation reaches the 90s in its lead traits and a scattered
//    one sits in the 40s to 60s, by construction rather than by clamping.
//
// 5. Score. score[t] = round(ceiling × (u[t] / max u)^0.8). The lead trait sits
//    at the ceiling and the rest fall off by their ratio to it; the 0.8 power
//    keeps the drop gentle enough that a fourth trait at 80% of the lead still
//    reads as a strength, and a trait at half the lead reads near 50.
//
// No pool size, name, or archetype enters the calculation.

const CEILING_STEEPNESS = 11.5;
const CEILING_MIDPOINT = 0.037;
const RATIO_POWER = 0.8;

export interface TraitAnalysis {
  raw: Record<Trait, number>;
  cap: Record<Trait, number>;
  /** Relative fill: 1.0 means claimed at the same rate as the tree as a whole. */
  u: Record<Trait, number>;
  spread: number;
  ceiling: number;
  scores: Record<Trait, number>;
  pointsSpent: number;
}

function zeros(): Record<Trait, number> {
  const out = {} as Record<Trait, number>;
  TRAITS.forEach((t) => {
    out[t] = 0;
  });
  return out;
}

function nodesOf(trees: TalentTree[]): TalentNode[] {
  return trees.reduce<TalentNode[]>((acc, tree) => {
    tree.areas.forEach((a) => {
      acc.push(a.nodes[0], a.nodes[1]);
    });
    return acc;
  }, []);
}

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  if (typeof v !== 'number' || !isFinite(v)) return 0;
  return Math.max(0, Math.min(5, Math.floor(v)));
}

/** The full working of the score, for tests and for any UI that wants to show it. */
export function analyzeTraits(allocation: Allocation, trees: TalentTree[] = TREES): TraitAnalysis {
  const raw = zeros();
  const cap = zeros();
  let P = 0;
  let C = 0;

  nodesOf(trees).forEach((node) => {
    const p = pointsAt(allocation, node.id);
    TRAITS.forEach((t) => {
      const w = node.weights[t] || 0;
      raw[t] += p * w;
      cap[t] += 5 * w;
      P += p * w;
      C += 5 * w;
    });
  });

  const u = zeros();
  const scores = zeros();
  if (P <= 0 || C <= 0) {
    return { raw, cap, u, spread: 0, ceiling: 0, scores, pointsSpent: 0 };
  }

  const overall = P / C;
  let umax = 0;
  TRAITS.forEach((t) => {
    u[t] = cap[t] > 0 ? raw[t] / cap[t] / overall : 0;
    if (u[t] > umax) umax = u[t];
  });

  let variance = 0;
  TRAITS.forEach((t) => {
    variance += (cap[t] / C) * Math.pow(u[t] - 1, 2);
  });
  const spread = Math.sqrt(variance);
  const ceiling = 100 / (1 + Math.exp(-CEILING_STEEPNESS * (spread - CEILING_MIDPOINT)));

  TRAITS.forEach((t) => {
    scores[t] = umax > 0 ? Math.round(ceiling * Math.pow(u[t] / umax, RATIO_POWER)) : 0;
  });

  return { raw, cap, u, spread, ceiling, scores, pointsSpent: Math.round(P) };
}

/** 0..100 per trait. */
export function scoreTraits(allocation: Allocation, trees: TalentTree[] = TREES): Record<Trait, number> {
  return analyzeTraits(allocation, trees).scores;
}

/** The four highest traits, descending; ties break in TRAITS order. */
export function topTraits(traits: Record<Trait, number>, count = 4): { trait: Trait; score: number }[] {
  return TRAITS.map((trait) => ({ trait, score: traits[trait] || 0 }))
    .sort((a, b) => b.score - a.score || TRAITS.indexOf(a.trait) - TRAITS.indexOf(b.trait))
    .slice(0, count);
}

// ── Archetypes ──────────────────────────────────────────────────────────────
//
// Matching compares the visitor's trait vector with each archetype signature
// by cosine similarity. The vector that is compared is the part of each score
// that stands above the visitor's own mean, floored at zero ("what stands
// out"), not the raw 0..100 scores. Raw scores share a large floor (nothing
// below 40 for most people), and cosine on them bunches every archetype into
// a few hundredths of each other, so a class would flip on rounding. Above
// the mean, a research-only profile matches its home archetype at 0.98 and a
// multiclass profile still separates its top pair from the rest. When every
// trait is equal there is nothing above the mean, and the raw vector is used.

export function cosineSimilarity(traits: Record<Trait, number>, signature: Partial<Record<Trait, number>>): number {
  let dot = 0;
  let a2 = 0;
  let b2 = 0;
  TRAITS.forEach((t) => {
    const a = traits[t] || 0;
    const b = signature[t] || 0;
    dot += a * b;
    a2 += a * a;
    b2 += b * b;
  });
  if (a2 === 0 || b2 === 0) return 0;
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}

/** Each trait's score above the visitor's mean, floored at zero; the raw scores when nothing stands out. */
export function matchVector(traits: Record<Trait, number>): Record<Trait, number> {
  const mean = TRAITS.reduce((s, t) => s + (traits[t] || 0), 0) / TRAITS.length;
  const out = zeros();
  let any = false;
  TRAITS.forEach((t) => {
    out[t] = Math.max(0, (traits[t] || 0) - mean);
    if (out[t] > 0) any = true;
  });
  if (!any) {
    TRAITS.forEach((t) => {
      out[t] = traits[t] || 0;
    });
  }
  return out;
}

/**
 * Primary = the archetype whose signature is closest to what stands out in the
 * trait vector. Secondary = the closest from a different family. Ties keep the
 * earlier entry in the pool.
 */
export function pickArchetypes(
  traits: Record<Trait, number>,
  archetypes: Archetype[],
): { primary: Archetype; secondary: Archetype } {
  if (!archetypes.length) throw new Error('pickArchetypes: the archetype pool is empty');

  const vector = matchVector(traits);
  const ranked = archetypes
    .map((archetype, index) => ({ archetype, index, sim: cosineSimilarity(vector, archetype.signature) }))
    .sort((a, b) => b.sim - a.sim || a.index - b.index);

  const primary = ranked[0].archetype;
  const other = ranked.find((r) => r.archetype.family !== primary.family);
  const fallback = ranked.find((r) => r.archetype.id !== primary.id);
  const secondary = (other || fallback || ranked[0]).archetype;
  return { primary, secondary };
}

/** "{primary.you} You care about {primary.cares}, but you're happiest {secondary.happiest}." */
export function describe(primary: Archetype, secondary: Archetype): string {
  return `${primary.you} You care about ${primary.cares}, but you're happiest ${secondary.happiest}.`;
}

// ── Result ──────────────────────────────────────────────────────────────────

export interface ResultOverrides {
  passive?: string;
  quest?: string;
}

export function buildResult(
  intake: Intake,
  allocation: Allocation,
  trees: TalentTree[] = TREES,
  archetypes: Archetype[],
  overrides?: ResultOverrides,
): TalentResult {
  const pools = computePools(intake);
  const clean = normalizeAllocation(allocation);
  const analysis = analyzeTraits(clean, trees);
  const traits = analysis.scores;
  const { primary, secondary } = pickArchetypes(traits, archetypes);

  const mastered = nodesOf(trees)
    .filter((n) => pointsAt(clean, n.id) === 5)
    .map((n) => n.id);

  const cleanIntake: Intake = { ...intake, years: sanitizeYears(intake.years), hours: sanitizeHours(intake.hours) };
  const split = splitOf(intake);
  if (split === undefined) delete cleanIntake.split;
  else cleanIntake.split = split;

  return {
    intake: cleanIntake,
    pools,
    allocation: clean,
    pointsSpent: analysis.pointsSpent,
    traits,
    topTraits: topTraits(traits),
    primary,
    secondary,
    description: describe(primary, secondary),
    passive: (overrides && overrides.passive) || primary.passive,
    quest: (overrides && overrides.quest) || primary.quest,
    mastered,
  };
}

// ── Share link ──────────────────────────────────────────────────────────────
//
// Layout: <degree letter><major letter><minor letter><years>[d<split>].<hours
// band>.<one base-6 digit per node, in TREES order>.<name, URL-encoded>.
// Everything before the name is fixed-shape, so the name may contain any
// character. Example:
//   bgw16.5.533130205255545243424251403020.Ryan%20DeBoer
// The split token is optional and sits on the years: "16d70" is 16 years, 70
// percent design. A string without it decodes to an intake with no split
// (years free), so links made before the split rule still open.
//   bgw16d70.5.533130205255545243424251403020.Ryan%20DeBoer
// The format before the degree rule (b16.5.<digits>.<name>) has no major and
// minor letters and decodes to null.

const DEGREE_LETTER: Record<Degree, string> = {
  none: 'n',
  'self-taught': 's',
  associate: 'a',
  bachelors: 'b',
  masters: 'm',
};
const LETTER_DEGREE: Record<string, Degree> = { n: 'none', s: 'self-taught', a: 'associate', b: 'bachelors', m: 'masters' };
const MAJOR_LETTER: Record<Major, string> = { graphic: 'g', web: 'w', other: 'o' };
const LETTER_MAJOR: Record<string, Major> = { g: 'graphic', w: 'web', o: 'other' };
const MINOR_LETTER: Record<Minor, string> = { none: 'n', graphic: 'g', web: 'w' };
const LETTER_MINOR: Record<string, Minor> = { n: 'none', g: 'graphic', w: 'web' };
const NAME_MAX = 60;

export function encodeState(intake: Intake, allocation: Allocation): string {
  const degree = DEGREE_LETTER[intake.degree] || 'n';
  const major = MAJOR_LETTER[intake.major] || 'o';
  const minor = MINOR_LETTER[intake.minor] || 'n';
  const years = Math.min(99, sanitizeYears(intake.years));
  const split = splitOf(intake);
  const splitToken = split === undefined ? '' : `d${split}`;
  const hours = sanitizeHours(intake.hours);
  const digits = NODE_LIST.map((n) => String(pointsAt(allocation, n.id))).join('');
  const name = encodeURIComponent((intake.name || '').trim().slice(0, NAME_MAX));
  return `${degree}${major}${minor}${years}${splitToken}.${hours}.${digits}.${name}`;
}

/**
 * Inverse of encodeState. Returns null for anything that is not a state the
 * tree could have produced: wrong shape (including the pre-degree-rule
 * format), unknown degree, major, or minor letter, a split that is not a
 * step the intake offers (0..100 by tens), a crown lit under a foundation
 * below 3, or more points than the intake earns where they were spent.
 * A string without the split token decodes to an intake with no `split` key.
 */
export function decodeState(value: string): { intake: Intake; allocation: Allocation } | null {
  if (typeof value !== 'string') return null;
  const re = new RegExp(`^([nsabm])([gwo])([ngw])(\\d{1,2})(?:d(\\d{1,3}))?\\.([0-5])\\.([0-5]{${NODE_LIST.length}})\\.([\\s\\S]*)$`);
  const m = re.exec(value.trim());
  if (!m) return null;

  const degree = LETTER_DEGREE[m[1]];
  const major = LETTER_MAJOR[m[2]];
  const minor = LETTER_MINOR[m[3]];
  if (!degree || !major || !minor) return null;
  const years = parseInt(m[4], 10);
  let split: number | undefined;
  if (m[5] !== undefined) {
    split = parseInt(m[5], 10);
    // Only a split the intake can produce: 0..100 in steps of ten.
    if (sanitizeSplit(split) !== split) return null;
  }
  const hours = parseInt(m[6], 10) as HoursBand;

  let name = '';
  try {
    name = decodeURIComponent(m[8]).trim().slice(0, NAME_MAX);
  } catch (e) {
    return null;
  }

  const allocation: Allocation = {};
  const digits = m[7];
  NODE_LIST.forEach((n, i) => {
    const p = parseInt(digits.charAt(i), 10);
    if (p > 0) allocation[n.id] = p;
  });

  // A lit crown over a foundation below the unlock line is not a reachable state.
  const clean = normalizeAllocation(allocation);
  const sameShape =
    Object.keys(allocation).length === Object.keys(clean).length &&
    Object.keys(allocation).every((id) => clean[id] === allocation[id]);
  if (!sameShape) return null;

  const intake: Intake = { name, degree, major, minor, years, hours };
  if (split !== undefined) intake.split = split;
  if (!withinPools(clean, computePools(intake))) return null;

  return { intake, allocation: clean };
}
