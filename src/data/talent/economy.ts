// ============================================
// Talent tree: the points economy (v5, one pool)
// Points are earned by time, not self-rated. The intake answers produce ONE
// pool, spent across all three lanes, with two locked parts inside it:
//
//   total = degree (+ minor) + years + hours
//   level = years of professional experience
//
// Degree: 4 per year of degree. Associate 8, bachelor's 16, master's 24. The
// MAJOR decides where those points are locked: a graphic or visual design
// major locks them to the Design and systems lane; a web or interactive major
// locks them to the Code lane. A degree in another field counts the same as
// self-taught. Self-taught is a flat 8, free on any lane. None is 0.
// Minor: a quarter of the degree's points, ADDED on top and locked to the
// minor's lane (bachelor's in graphic design with a minor in web: 16 design
// AND 4 code, 20 from the degree).
// Years: 4 per year for the first three, then 2 per year. 16 years = 38.
// Split (optional): the share of the years that went to design rather than
// code, in steps of ten. When answered, the years points lock across the two
// lanes by that share; unanswered, they stay free on any lane.
// Hours outside the day job in the last 12 months: one point per 40-hour step,
// capped at 5. Free.
// The separate core pool is RETIRED (v5).
//
// So the pool has three parts: designLocked, codeLocked, and free. The Design
// and Code lanes draw from their locked part first, then from free; the
// Technical lane draws from free only. Ryan: 63 = 16 design-locked + 4
// code-locked + 43 free, level 16.
// ============================================

import type {
  Allocation,
  Degree,
  HoursBand,
  Intake,
  Major,
  Minor,
  Pool,
  Pools,
  ReceiptLine,
  TalentNode,
  TalentTree,
  TreeId,
} from './types';
import { NODES, TREES, crownOf, foundationOf, treeOf } from './trees';

export const MAX_POINTS_PER_NODE = 5;
/** A crown unlocks once its foundation holds this many points. */
export const CROWN_UNLOCK_AT = 3;
/** Self-taught, and a degree outside a design craft, are worth this many free points. */
export const SELF_TAUGHT_POINTS = 8;
/** A minor is worth this fraction of the degree's points, added on top. */
export const MINOR_FRACTION = 0.25;
/** The split question moves in steps of this many percent. */
export const SPLIT_STEP = 10;

export interface DegreeOption {
  value: Degree;
  label: string;
  short: string;
  points: number;
  note: string;
  takesMajor: boolean;
  assumed?: boolean;
}

export const DEGREE_OPTIONS: DegreeOption[] = [
  { value: 'none', label: 'None', short: 'No degree', points: 0, note: 'No degree years to count', takesMajor: false, assumed: true },
  { value: 'self-taught', label: 'Self-taught', short: 'Self-taught', points: SELF_TAUGHT_POINTS, note: '8 to help catch up, spend on any lane', takesMajor: false },
  { value: 'associate', label: 'Associate', short: "Associate's", points: 8, note: '4 per year of degree, two years', takesMajor: true },
  { value: 'bachelors', label: "Bachelor's", short: "Bachelor's", points: 16, note: '4 per year of degree, four years', takesMajor: true },
  { value: 'masters', label: "Master's", short: "Master's", points: 24, note: '4 per year of degree, six years', takesMajor: true },
];

export interface MajorOption {
  value: Major;
  label: string;
  short: string;
  /** The lane the degree's points are locked to. Absent for a degree outside a design craft. */
  lockedTo?: 'design' | 'code';
  assumed?: boolean;
}

export const MAJOR_OPTIONS: MajorOption[] = [
  { value: 'graphic', label: 'Graphic or visual design', short: 'graphic design', lockedTo: 'design' },
  { value: 'web', label: 'Web or interactive design', short: 'web', lockedTo: 'code' },
  { value: 'other', label: 'Another field', short: 'other field', assumed: true },
];

export interface MinorOption {
  value: Minor;
  label: string;
  short: string;
  lockedTo?: 'design' | 'code';
}

export const MINOR_OPTIONS: MinorOption[] = [
  { value: 'none', label: 'No minor', short: 'No minor' },
  { value: 'graphic', label: 'Graphic or visual design', short: 'graphic design', lockedTo: 'design' },
  { value: 'web', label: 'Web or interactive design', short: 'web', lockedTo: 'code' },
];

export interface HoursOption {
  band: HoursBand;
  label: string;
  short: string;
}

export const HOURS_OPTIONS: HoursOption[] = [
  { band: 0, label: 'Under 40 hours', short: 'Under 40 hours' },
  { band: 1, label: '40 to 80 hours', short: '40 to 80 hours' },
  { band: 2, label: '80 to 120 hours', short: '80 to 120 hours' },
  { band: 3, label: '120 to 160 hours', short: '120 to 160 hours' },
  { band: 4, label: '160 to 200 hours', short: '160 to 200 hours' },
  { band: 5, label: 'More than 200 hours', short: '200+ hours' },
];

export interface SplitOption {
  value: number;
  label: string;
  short: string;
}

/** 0, 10, ... 100 percent design; the rest of each is code. */
export const SPLIT_OPTIONS: SplitOption[] = Array.from({ length: 100 / SPLIT_STEP + 1 }, (_, i) => {
  const design = i * SPLIT_STEP;
  return { value: design, label: `${design} design · ${100 - design} code`, short: `${design} / ${100 - design}` };
});

export const YEARS_NOTE = '4 per year for the first three years, then 2 per year';
export const HOURS_NOTE = '1 per 40 hours outside the day job in the last 12 months';
export const OTHER_FIELD_NOTE = 'A degree outside a design craft counts as self-taught, spend on any lane';
export const SPLIT_NOTE = 'The years points lock to the two lanes by this share: the design share to Design and systems, the rest to Code';

const TREE_NAME: Record<TreeId, string> = { design: 'Design and systems', technical: 'Technical', code: 'Code' };

/** The lane name as the receipt prints it. */
export function treeName(tree: TreeId): string {
  return TREE_NAME[tree];
}

function lockedLabel(tree: TreeId): string {
  return `locked to ${TREE_NAME[tree]}`;
}

export function degreeOption(degree: Degree): DegreeOption {
  return DEGREE_OPTIONS.find((o) => o.value === degree) || DEGREE_OPTIONS[0];
}

export function majorOption(major: Major): MajorOption {
  return MAJOR_OPTIONS.find((o) => o.value === major) || MAJOR_OPTIONS[MAJOR_OPTIONS.length - 1];
}

export function minorOption(minor: Minor): MinorOption {
  return MINOR_OPTIONS.find((o) => o.value === minor) || MINOR_OPTIONS[0];
}

export function splitOption(split: number): SplitOption {
  const v = sanitizeSplit(split);
  return SPLIT_OPTIONS.find((o) => o.value === v) || SPLIT_OPTIONS[0];
}

export function degreeTakesMajor(degree: Degree): boolean {
  return degreeOption(degree).takesMajor;
}

/** The degree's own points, before the minor. */
export function degreePoints(degree: Degree, major?: Major): number {
  const opt = degreeOption(degree);
  if (!opt.takesMajor || major === undefined) return opt.points;
  return majorOption(major).lockedTo ? opt.points : SELF_TAUGHT_POINTS;
}

/** The minor's points: a quarter of the degree's value, or 0 without a degree or a minor. */
export function minorPoints(degree: Degree, minor: Minor): number {
  const opt = degreeOption(degree);
  if (!opt.takesMajor || !minorOption(minor).lockedTo) return 0;
  return Math.round(opt.points * MINOR_FRACTION);
}

/** 4 per year for the first three years, then 2 per year. */
export function yearsPoints(years: number): number {
  const y = sanitizeYears(years);
  return Math.min(y, 3) * 4 + Math.max(y - 3, 0) * 2;
}

/**
 * The years points divided by the split: the design share, rounded, locks to
 * Design and systems and the remainder to Code, so the two always add up to
 * `yearsPoints(years)`.
 */
export function yearsSplit(years: number, split: number): { design: number; code: number } {
  const yp = yearsPoints(years);
  const share = sanitizeSplit(split);
  const design = Math.round((yp * share) / 100);
  return { design, code: yp - design };
}

/** One point per 40-hour band, 0..5. */
export function hoursPoints(hours: HoursBand): number {
  return sanitizeHours(hours);
}

export function sanitizeYears(years: number): number {
  if (typeof years !== 'number' || !isFinite(years)) return 0;
  return Math.max(0, Math.floor(years));
}

export function sanitizeHours(hours: number): HoursBand {
  if (typeof hours !== 'number' || !isFinite(hours)) return 0;
  const h = Math.max(0, Math.min(5, Math.floor(hours)));
  return h as HoursBand;
}

/** Clamp a split percent to 0..100 and round it to the nearest step of SPLIT_STEP. */
export function sanitizeSplit(split: number): number {
  if (typeof split !== 'number' || !isFinite(split)) return 0;
  const clamped = Math.max(0, Math.min(100, split));
  return Math.round(clamped / SPLIT_STEP) * SPLIT_STEP;
}

/** The intake's split, sanitized, or undefined when the intake leaves the years free. */
export function splitOf(intake: Pick<Intake, 'split'>): number | undefined {
  const raw = intake.split;
  if (typeof raw !== 'number' || !isFinite(raw)) return undefined;
  return sanitizeSplit(raw);
}

function yearsLabel(years: number): string {
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

/** Ryan's rules, applied. */
export function computePools(intake: Intake): Pools {
  const years = sanitizeYears(intake.years);
  const hours = sanitizeHours(intake.hours);
  const degreeOpt = degreeOption(intake.degree);
  const majorOpt = majorOption(intake.major);
  const minorOpt = minorOption(intake.minor);
  const hoursOpt = HOURS_OPTIONS[hours];

  const split = splitOf(intake);

  const dp = degreePoints(degreeOpt.value, majorOpt.value);
  const mp = minorPoints(degreeOpt.value, minorOpt.value);
  const yp = yearsPoints(years);
  const hp = hoursPoints(hours);

  let designLocked = 0;
  let codeLocked = 0;
  let free = hp;
  const receipt: ReceiptLine[] = [];

  if (!degreeOpt.takesMajor) {
    free += dp;
    receipt.push({ points: dp, label: `+${dp} · ${degreeOpt.short}`, note: degreeOpt.note, pool: 'points' });
  } else if (!majorOpt.lockedTo) {
    free += dp;
    receipt.push({ points: dp, label: `+${dp} · ${degreeOpt.short}, ${majorOpt.short}`, note: OTHER_FIELD_NOTE, pool: 'points' });
  } else {
    if (majorOpt.lockedTo === 'design') designLocked += dp;
    else codeLocked += dp;
    receipt.push({
      points: dp,
      label: `+${dp} · ${degreeOpt.short}, ${majorOpt.short} · ${lockedLabel(majorOpt.lockedTo)}`,
      note: degreeOpt.note,
      pool: 'points',
      lockedTo: majorOpt.lockedTo,
    });
  }

  if (mp > 0 && minorOpt.lockedTo) {
    if (minorOpt.lockedTo === 'design') designLocked += mp;
    else codeLocked += mp;
    receipt.push({
      points: mp,
      label: `+${mp} · Minor, ${minorOpt.short} · ${lockedLabel(minorOpt.lockedTo)}`,
      note: 'A quarter of the degree',
      pool: 'points',
      lockedTo: minorOpt.lockedTo,
    });
  }

  if (split === undefined) {
    free += yp;
    receipt.push({ points: yp, label: `+${yp} · ${yearsLabel(years)}`, note: YEARS_NOTE, pool: 'points' });
  } else {
    const ys = yearsSplit(years, split);
    designLocked += ys.design;
    codeLocked += ys.code;
    receipt.push(
      {
        points: ys.design,
        label: `+${ys.design} · ${yearsLabel(years)}, design · ${lockedLabel('design')}`,
        note: `${YEARS_NOTE} · ${split} percent`,
        pool: 'points',
        lockedTo: 'design',
      },
      {
        points: ys.code,
        label: `+${ys.code} · ${yearsLabel(years)}, code · ${lockedLabel('code')}`,
        note: `${YEARS_NOTE} · ${100 - split} percent`,
        pool: 'points',
        lockedTo: 'code',
      },
    );
  }

  receipt.push({ points: hp, label: `+${hp} · ${hoursOpt.short}`, note: HOURS_NOTE, pool: 'points' });

  const total = designLocked + codeLocked + free;
  return {
    total,
    designLocked,
    codeLocked,
    free,
    level: years,
    receipt,
  };
}

// ── Spending ────────────────────────────────────────────────────────────────

function pointsAt(allocation: Allocation, nodeId: string): number {
  const v = allocation[nodeId];
  if (typeof v !== 'number' || !isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v)));
}

/** True when the node is a crown whose foundation is below the unlock line. */
export function isLocked(allocation: Allocation, nodeId: string): boolean {
  const foundation = foundationOf(nodeId);
  if (!foundation) return false;
  return pointsAt(allocation, foundation.id) < CROWN_UNLOCK_AT;
}

/** Points spent, per pool. One pool now, so one number. */
export function poolsSpent(allocation: Allocation): Record<Pool, number> {
  const spent: Record<Pool, number> = { points: 0 };
  Object.keys(allocation).forEach((id) => {
    if (!treeOf(id)) return;
    spent.points += pointsAt(allocation, id);
  });
  return spent;
}

/** Points spent per lane. Unknown node ids are ignored. */
export function treeSpend(allocation: Allocation, trees: TalentTree[] = TREES): Record<TreeId, number> {
  const spent: Record<TreeId, number> = { design: 0, technical: 0, code: 0 };
  trees.forEach((tree) => {
    tree.areas.forEach((area) => {
      area.nodes.forEach((node) => {
        spent[tree.id] += pointsAt(allocation, node.id);
      });
    });
  });
  return spent;
}

export interface Remaining {
  designLocked: number;
  codeLocked: number;
  free: number;
}

/**
 * The working of the pool: how much of each locked lane's spend came out of
 * its locked part, and how much of the pool's free part is in use. The
 * Technical lane has no locked part, so all of it draws from free.
 */
function drawDown(allocation: Allocation, pools: Pools, trees: TalentTree[]) {
  const spent = treeSpend(allocation, trees);
  const designFromFree = Math.max(0, spent.design - pools.designLocked);
  const codeFromFree = Math.max(0, spent.code - pools.codeLocked);
  const freeUsed = designFromFree + codeFromFree + spent.technical;
  return { spent, designFromFree, codeFromFree, freeUsed };
}

/** True while the allocation can be paid for out of the pool. */
export function feasible(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): boolean {
  return drawDown(allocation, pools, trees).freeUsed <= pools.free;
}

/** What is left in each part of the pool, floored at zero. Use `feasible` to detect an overdraw. */
export function remaining(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): Remaining {
  const { spent, freeUsed } = drawDown(allocation, pools, trees);
  const designLocked = Math.max(0, pools.designLocked - spent.design);
  const codeLocked = Math.max(0, pools.codeLocked - spent.code);
  return {
    designLocked,
    codeLocked,
    free: Math.max(0, pools.free - freeUsed),
  };
}

/**
 * Can one more point go into this node? The node must exist in `trees`, sit
 * below 5, and if it is a crown its foundation must hold 3 or more. When
 * `pools` is given the point must also be payable.
 */
export function canSpend(
  allocation: Allocation,
  nodeId: string,
  trees: TalentTree[] = TREES,
  pools?: Pools,
): boolean {
  const tree = trees.find((t) => t.areas.some((a) => a.nodes.some((n) => n.id === nodeId)));
  if (!tree) return false;
  if (pointsAt(allocation, nodeId) >= MAX_POINTS_PER_NODE) return false;
  if (isLocked(allocation, nodeId)) return false;
  if (pools) {
    const next: Allocation = { ...allocation, [nodeId]: pointsAt(allocation, nodeId) + 1 };
    if (!feasible(next, pools, trees)) return false;
  }
  return true;
}

/**
 * Apply a delta to a node and return a new allocation. Points clamp to 0..5.
 * Adding to a locked crown is a no-op. When a foundation drops below 3, its
 * crown's points are refunded. Unknown ids return the input.
 */
export function spend(
  allocation: Allocation,
  nodeId: string,
  delta: number,
  pools?: Pools,
  trees: TalentTree[] = TREES,
): Allocation {
  if (!NODES[nodeId] || !isFinite(delta) || delta === 0) return allocation;
  const current = pointsAt(allocation, nodeId);
  if (delta > 0 && isLocked(allocation, nodeId)) return allocation;
  let next = Math.max(0, Math.min(MAX_POINTS_PER_NODE, current + Math.round(delta)));
  if (pools && next > current) {
    while (next > current && !feasible({ ...allocation, [nodeId]: next }, pools, trees)) next -= 1;
  }
  if (next === current) return allocation;

  const out: Allocation = { ...allocation, [nodeId]: next };
  const crown = crownOf(nodeId);
  if (crown && next < CROWN_UNLOCK_AT && pointsAt(out, crown.id) > 0) {
    out[crown.id] = 0;
  }
  return out;
}

/** Bring an arbitrary allocation into line with the rules: unknown ids dropped, points clamped, locked crowns zeroed. */
export function normalizeAllocation(allocation: Allocation): Allocation {
  const out: Allocation = {};
  Object.keys(NODES).forEach((id) => {
    const p = pointsAt(allocation, id);
    if (p > 0) out[id] = p;
  });
  Object.keys(out).forEach((id) => {
    if (isLocked(out, id)) delete out[id];
  });
  return out;
}

/** True when the allocation spends no more than the pool holds, locked parts respected. */
export function withinPools(allocation: Allocation, pools: Pools): boolean {
  return feasible(allocation, pools, TREES);
}

function isNormalized(allocation: Allocation): boolean {
  return Object.keys(allocation).every((id) => {
    if (!NODES[id]) return false;
    const v = allocation[id];
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > MAX_POINTS_PER_NODE) return false;
    return v === 0 || !isLocked(allocation, id);
  });
}

/** Take one point off a lane: from its last lit crown, or when no crown is lit, from its last lit foundation. */
function peelOne(allocation: Allocation, tree: TalentTree): boolean {
  const nodes = tree.areas.reduce<TalentNode[]>((acc, a) => acc.concat(a.nodes), []);
  const lit = (tier: TalentNode['tier']) =>
    nodes.filter((n) => n.tier === tier && pointsAt(allocation, n.id) > 0).pop();
  const target = lit('crown') || lit('foundation');
  if (!target) return false;
  const next = pointsAt(allocation, target.id) - 1;
  if (next > 0) allocation[target.id] = next;
  else delete allocation[target.id];
  return true;
}

/**
 * Bring an allocation inside a (new) set of pools by removing points, for
 * when the intake is edited after points were spent. The result is normalized
 * and feasible, and exactly the overdraw is removed, never more. Points come
 * off whichever lane is drawing most from the free part (ties go to Technical,
 * then Code, then Design, since the locked lanes can pay for some of theirs).
 */
export function clampToPools(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): Allocation {
  if (isNormalized(allocation) && feasible(allocation, pools, trees)) return allocation;

  const out = normalizeAllocation(allocation);
  const byId = (id: TreeId) => trees.find((t) => t.id === id);

  for (;;) {
    const { spent, designFromFree, codeFromFree, freeUsed } = drawDown(out, pools, trees);
    if (freeUsed <= pools.free) break;
    const draws: { tree: TalentTree | undefined; draw: number }[] = [
      { tree: byId('technical'), draw: spent.technical },
      { tree: byId('code'), draw: codeFromFree },
      { tree: byId('design'), draw: designFromFree },
    ];
    draws.sort((a, b) => b.draw - a.draw);
    const peeled = draws.some((d) => !!d.tree && d.draw > 0 && peelOne(out, d.tree));
    if (!peeled) break;
  }

  return out;
}
