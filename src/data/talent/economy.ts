// ============================================
// Talent tree: the points economy
// Points are earned by time, not self-rated (BRIEF-v3, "Points are earned by
// time"). The intake answers produce two pools:
//
//   craft pool = degree (+ minor) + years + hours   (spent on the Craft and Systems trees)
//   core pool  = a slower count of the years        (spent on the Core tree)
//   level      = years of professional experience
//
// Degree: 4 per year of degree. Associate 8, bachelor's 16, master's 24. The
// MAJOR decides where those points are locked (Ryan's rule, 2026-09-11): a
// graphic or visual design major locks them to the Craft tree; a web or
// interactive major locks them to the Systems and build tree. A degree in
// another field counts the same as self-taught. Self-taught is a flat 8,
// free on either tree, "to help catch up". None is 0.
// Minor: a quarter of the degree's points, ADDED on top and locked to the
// minor's tree (bachelor's in graphic design with a minor in web: 16 craft
// AND 4 systems, 20 from the degree).
// Years: 4 per year for the first three, then 2 per year. 16 years = 12 + 26 = 38.
// Split (Ryan's rule, 2026-09-11, optional): once the years are known the
// intake asks what share of them went to design rather than code, as a
// percent in steps of 10. When answered, the years points are locked across
// the two trees by that share: round(points × design share) to the Craft
// tree, the rest to the Systems and build tree, so the two always add up to
// the years points (16 years at 70 design: 27 craft-locked, 11 systems-locked).
// Unanswered, the years stay free on either tree, as before the rule.
// Hours outside the day job in the last 12 months: one point per 40-hour step,
// capped at 5 for more than 200. Hours are free on either tree.
// Core: 2 per year for the first five years, then 1 per year. 16 years = 10 + 11 = 21.
//
// So the craft pool has three parts: craftLocked, systemsLocked, and free.
// A tree draws from its locked part first, then from free; the allocation is
// feasible while free is not overdrawn and core is not overflowed. Ryan:
// 63 craft = 16 craft-locked + 4 systems-locked + 43 free, core 21.
//
// The receipt is the tally the intake screen shows building as each answer
// lands: the degree line, the minor line when there is one, years (two lines,
// design and code, when the intake splits them), hours, then the core line.
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
  /** As it renders in the intake control. */
  label: string;
  /** As it renders on the receipt line, after the points. */
  short: string;
  /** Points for a design-craft major (or the flat value for none and self-taught). */
  points: number;
  /** The receipt note. No contractions. */
  note: string;
  /** True for the three degrees: the intake should then ask for a major and a minor. */
  takesMajor: boolean;
  /** True where the points are the orchestrator's assumption rather than Ryan's rule. */
  assumed?: boolean;
}

export const DEGREE_OPTIONS: DegreeOption[] = [
  { value: 'none', label: 'None', short: 'No degree', points: 0, note: 'No degree years to count', takesMajor: false, assumed: true },
  { value: 'self-taught', label: 'Self-taught', short: 'Self-taught', points: SELF_TAUGHT_POINTS, note: '8 to help catch up, spend on either tree', takesMajor: false },
  { value: 'associate', label: 'Associate', short: "Associate's", points: 8, note: '4 per year of degree, two years', takesMajor: true },
  { value: 'bachelors', label: "Bachelor's", short: "Bachelor's", points: 16, note: '4 per year of degree, four years', takesMajor: true },
  { value: 'masters', label: "Master's", short: "Master's", points: 24, note: '4 per year of degree, six years', takesMajor: true },
];

export interface MajorOption {
  value: Major;
  /** As it renders in the intake control. */
  label: string;
  /** As it renders on the receipt line, after the degree ("Bachelor's, graphic design"). */
  short: string;
  /** The tree the degree's points are locked to. Absent for a degree outside a design craft. */
  lockedTo?: TreeId;
  /** True where the treatment is the orchestrator's reading rather than Ryan's words. */
  assumed?: boolean;
}

export const MAJOR_OPTIONS: MajorOption[] = [
  { value: 'graphic', label: 'Graphic or visual design', short: 'graphic design', lockedTo: 'craft' },
  { value: 'web', label: 'Web or interactive design', short: 'web', lockedTo: 'systems' },
  { value: 'other', label: 'Another field', short: 'other field', assumed: true },
];

export interface MinorOption {
  value: Minor;
  /** As it renders in the intake control. */
  label: string;
  /** As it renders on the receipt line, after "Minor," ("Minor, web"). */
  short: string;
  /** The tree the minor's points are locked to. Absent for no minor. */
  lockedTo?: TreeId;
}

export const MINOR_OPTIONS: MinorOption[] = [
  { value: 'none', label: 'No minor', short: 'No minor' },
  { value: 'graphic', label: 'Graphic or visual design', short: 'graphic design', lockedTo: 'craft' },
  { value: 'web', label: 'Web or interactive design', short: 'web', lockedTo: 'systems' },
];

export interface HoursOption {
  band: HoursBand;
  /** As it renders in the intake control. */
  label: string;
  /** As it renders on the receipt line, after the points. */
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
  /** Percent of the years spent on design, 0..100 in steps of SPLIT_STEP. */
  value: number;
  /** As it renders in the intake control ("70 design · 30 code"). */
  label: string;
  /** Compact form ("70 / 30"). */
  short: string;
}

/** 0, 10, ... 100 percent design; the rest of each is code. */
export const SPLIT_OPTIONS: SplitOption[] = Array.from({ length: 100 / SPLIT_STEP + 1 }, (_, i) => {
  const design = i * SPLIT_STEP;
  return { value: design, label: `${design} design · ${100 - design} code`, short: `${design} / ${100 - design}` };
});

export const YEARS_NOTE = '4 per year for the first three years, then 2 per year';
export const HOURS_NOTE = '1 per 40 hours outside the day job in the last 12 months';
export const CORE_NOTE = '2 per year for the first five years, then 1 per year';
export const OTHER_FIELD_NOTE = 'A degree outside a design craft counts as self-taught, spend on either tree';
export const SPLIT_NOTE = 'The years points lock to the two trees by this share: the design share to the Craft tree, the rest to the Systems and build tree';

const TREE_NAME: Record<TreeId, string> = { craft: 'Craft', systems: 'Systems and build', core: 'Core' };

function lockedNote(tree: TreeId): string {
  return `locked to the ${TREE_NAME[tree]} tree`;
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

/** The option for a (sanitized) split percent. */
export function splitOption(split: number): SplitOption {
  const v = sanitizeSplit(split);
  return SPLIT_OPTIONS.find((o) => o.value === v) || SPLIT_OPTIONS[0];
}

/** True for the three degrees, which take a major and a minor; false for none and self-taught. */
export function degreeTakesMajor(degree: Degree): boolean {
  return degreeOption(degree).takesMajor;
}

/**
 * The degree's own points, before the minor. The full 4-per-year value for a
 * graphic or web major; the flat self-taught value for a degree in another
 * field; the option's value for none and self-taught.
 *
 * The major is optional. Without one, the degree's own value is returned
 * (bachelor's 16, master's 24), which is what an intake control prints beside
 * each degree before a major is chosen. Only an explicit 'other' major drops a
 * degree to the self-taught value.
 */
export function degreePoints(degree: Degree, major?: Major): number {
  const opt = degreeOption(degree);
  if (!opt.takesMajor || major === undefined) return opt.points;
  return majorOption(major).lockedTo ? opt.points : SELF_TAUGHT_POINTS;
}

/** The minor's points: a quarter of the degree's 4-per-year value, or 0 without a degree or a minor. */
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
 * The years points divided by the split: the design share, rounded to the
 * nearest point, goes to the Craft tree and the remainder to the Systems and
 * build tree, so `craft + systems` is always `yearsPoints(years)`. 16 years
 * (38 points) at 70 percent design: 27 craft, 11 systems.
 */
export function yearsSplit(years: number, split: number): { craft: number; systems: number } {
  const yp = yearsPoints(years);
  const design = sanitizeSplit(split);
  const craft = Math.round((yp * design) / 100);
  return { craft, systems: yp - craft };
}

/** One point per 40-hour band, 0..5. */
export function hoursPoints(hours: HoursBand): number {
  return sanitizeHours(hours);
}

/** 2 per year for the first five years, then 1 per year. */
export function corePoints(years: number): number {
  const y = sanitizeYears(years);
  return Math.min(y, 5) * 2 + Math.max(y - 5, 0);
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

/**
 * The intake's split, sanitized, or undefined when the intake leaves the
 * years free (no split answered, or not a finite number).
 */
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
  const cp = corePoints(years);

  let craftLocked = 0;
  let systemsLocked = 0;
  let free = hp;
  const receipt: ReceiptLine[] = [];

  if (!degreeOpt.takesMajor) {
    // None or self-taught: a flat value, free on either tree.
    free += dp;
    receipt.push({ points: dp, label: `+${dp} · ${degreeOpt.short}`, note: degreeOpt.note, pool: 'craft' });
  } else if (!majorOpt.lockedTo) {
    // A degree outside a design craft: the self-taught value, free.
    free += dp;
    receipt.push({ points: dp, label: `+${dp} · ${degreeOpt.short}, ${majorOpt.short}`, note: OTHER_FIELD_NOTE, pool: 'craft' });
  } else {
    // A degree in a design craft: locked to the major's tree.
    if (majorOpt.lockedTo === 'craft') craftLocked += dp;
    else systemsLocked += dp;
    receipt.push({
      points: dp,
      label: `+${dp} · ${degreeOpt.short}, ${majorOpt.short}`,
      note: `${degreeOpt.note}, ${lockedNote(majorOpt.lockedTo)}`,
      pool: 'craft',
      lockedTo: majorOpt.lockedTo,
    });
  }

  if (mp > 0 && minorOpt.lockedTo) {
    if (minorOpt.lockedTo === 'craft') craftLocked += mp;
    else systemsLocked += mp;
    receipt.push({
      points: mp,
      label: `+${mp} · Minor, ${minorOpt.short}`,
      note: `A quarter of the degree, ${lockedNote(minorOpt.lockedTo)}`,
      pool: 'craft',
      lockedTo: minorOpt.lockedTo,
    });
  }

  if (split === undefined) {
    // No split answered: the years are free on either tree.
    free += yp;
    receipt.push({ points: yp, label: `+${yp} · ${yearsLabel(years)}`, note: YEARS_NOTE, pool: 'craft' });
  } else {
    // The years, locked across the two trees by the design share.
    const ys = yearsSplit(years, split);
    craftLocked += ys.craft;
    systemsLocked += ys.systems;
    receipt.push(
      {
        points: ys.craft,
        label: `+${ys.craft} · ${yearsLabel(years)}, design`,
        note: `${YEARS_NOTE} · ${split} percent, ${lockedNote('craft')}`,
        pool: 'craft',
        lockedTo: 'craft',
      },
      {
        points: ys.systems,
        label: `+${ys.systems} · ${yearsLabel(years)}, code`,
        note: `${YEARS_NOTE} · ${100 - split} percent, ${lockedNote('systems')}`,
        pool: 'craft',
        lockedTo: 'systems',
      },
    );
  }

  receipt.push(
    { points: hp, label: `+${hp} · ${hoursOpt.short}`, note: HOURS_NOTE, pool: 'craft' },
    { points: cp, label: `+${cp} · Core, ${yearsLabel(years)}`, note: CORE_NOTE, pool: 'core' },
  );

  return {
    craft: craftLocked + systemsLocked + free,
    craftLocked,
    systemsLocked,
    free,
    core: cp,
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

/** Points spent per pool. Unknown node ids are ignored. */
export function poolsSpent(allocation: Allocation): Record<Pool, number> {
  const spent: Record<Pool, number> = { craft: 0, core: 0 };
  Object.keys(allocation).forEach((id) => {
    const tree = treeOf(id);
    if (!tree) return;
    spent[tree.pool] += pointsAt(allocation, id);
  });
  return spent;
}

/** Points spent per tree. Unknown node ids are ignored. */
export function treeSpend(allocation: Allocation, trees: TalentTree[] = TREES): Record<TreeId, number> {
  const spent: Record<TreeId, number> = { craft: 0, systems: 0, core: 0 };
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
  craftLocked: number;
  systemsLocked: number;
  free: number;
  core: number;
}

/**
 * The working of the craft pool: how much of each tree's spend came out of
 * its locked part, how much came out of free, and what is left. The Craft
 * and Systems trees draw from their locked part first, then from free.
 */
function drawDown(allocation: Allocation, pools: Pools, trees: TalentTree[]) {
  const spent = treeSpend(allocation, trees);
  const craftFromFree = Math.max(0, spent.craft - pools.craftLocked);
  const systemsFromFree = Math.max(0, spent.systems - pools.systemsLocked);
  const freeUsed = craftFromFree + systemsFromFree;
  return { spent, craftFromFree, systemsFromFree, freeUsed };
}

/**
 * True while the allocation can be paid for: the Craft tree's spend beyond
 * craftLocked plus the Systems tree's spend beyond systemsLocked fits in
 * free, and the Core tree's spend fits in core.
 */
export function feasible(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): boolean {
  const { spent, freeUsed } = drawDown(allocation, pools, trees);
  return freeUsed <= pools.free && spent.core <= pools.core;
}

/**
 * What is left to spend in each part of the pools, floored at zero, so the
 * header can count each down. Use `feasible` to detect an overdraw.
 */
export function remaining(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): Remaining {
  const { spent, freeUsed } = drawDown(allocation, pools, trees);
  return {
    craftLocked: Math.max(0, pools.craftLocked - spent.craft),
    systemsLocked: Math.max(0, pools.systemsLocked - spent.systems),
    free: Math.max(0, pools.free - freeUsed),
    core: Math.max(0, pools.core - spent.core),
  };
}

/**
 * Can one more point go into this node? The node must exist in `trees`, sit
 * below 5, and if it is a crown its foundation must hold 3 or more. When
 * `pools` is given the point must also be payable: from the tree's locked
 * part, then from free (or from core for the Core tree).
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
 * crown's points are refunded (set to 0). Unknown ids return the input.
 * When `pools` is given, an addition is clamped to what the pools can pay
 * for (a tree's locked part first, then free; core for the Core tree), and
 * is a no-op when nothing fits. Removals are always allowed.
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

/**
 * Bring an arbitrary allocation into line with the rules: unknown ids dropped,
 * points clamped to 0..5, locked crowns zeroed. Pool budgets are not enforced
 * here; see `withinPools` and `feasible`.
 */
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

/** True when the allocation spends no more than the pools hold, locked parts respected. Same as `feasible`. */
export function withinPools(allocation: Allocation, pools: Pools): boolean {
  return feasible(allocation, pools, TREES);
}

/** True when `normalizeAllocation` would return the same points: known ids, integers in 0..5, no lit crown under a low foundation. */
function isNormalized(allocation: Allocation): boolean {
  return Object.keys(allocation).every((id) => {
    if (!NODES[id]) return false;
    const v = allocation[id];
    if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > MAX_POINTS_PER_NODE) return false;
    return v === 0 || !isLocked(allocation, id);
  });
}

/**
 * Take one point off a tree, in place: from its last lit crown (in tree
 * order), or when no crown is lit, from its last lit foundation. Crowns go
 * first so a foundation is never lowered under a lit crown, which would
 * refund the crown and remove more than one point. Returns false when the
 * tree holds nothing.
 */
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
 * when the intake is edited after points were spent: a major that flips from
 * graphic design to web moves the degree's lock from the Craft tree to the
 * Systems tree, fewer years shrink the free and core parts, and so on. Once
 * an allocation overdraws, `canSpend` and `spend` refuse every addition, so
 * the page should clamp whenever the pools change.
 *
 * The result is normalized (see `normalizeAllocation`) and feasible, and
 * exactly the overdraw is removed, never more. Points come off crowns first,
 * then foundations, each from the end of the tree backwards. When the craft
 * pool is overdrawn the point comes off whichever of the Craft and Systems
 * trees is drawing more from the free part (a tie goes to the Systems tree),
 * so a tree never loses a point it could pay for from its locked part.
 * Returns the input itself when nothing needs to change.
 */
export function clampToPools(allocation: Allocation, pools: Pools, trees: TalentTree[] = TREES): Allocation {
  if (isNormalized(allocation) && feasible(allocation, pools, trees)) return allocation;

  const out = normalizeAllocation(allocation);
  const byId = (id: TreeId) => trees.find((t) => t.id === id);
  const core = byId('core');
  const craft = byId('craft');
  const systems = byId('systems');

  if (core) {
    while (treeSpend(out, trees).core > pools.core && peelOne(out, core)) { /* one point at a time */ }
  }

  for (;;) {
    const { craftFromFree, systemsFromFree, freeUsed } = drawDown(out, pools, trees);
    if (freeUsed <= pools.free) break;
    const order = systemsFromFree >= craftFromFree ? [systems, craft] : [craft, systems];
    const peeled = order.some((tree) => !!tree && peelFromFree(out, pools, trees, tree));
    if (!peeled) break;
  }

  return out;
}

/** Peel one point off `tree` only if that tree is drawing from the free part; otherwise leave it alone. */
function peelFromFree(allocation: Allocation, pools: Pools, trees: TalentTree[], tree: TalentTree): boolean {
  const { craftFromFree, systemsFromFree } = drawDown(allocation, pools, trees);
  const draw = tree.id === 'craft' ? craftFromFree : tree.id === 'systems' ? systemsFromFree : 0;
  if (draw <= 0) return false;
  return peelOne(allocation, tree);
}
