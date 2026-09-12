// ============================================
// Talent tree — shared contract
// The one file the data module, the archetype copy, the scoring, the page,
// and the homepage section all import. Nothing here renders; it names the
// shapes so the four can be written apart and still agree.
// ============================================

/** The eight invisible tendencies a tree scores. Never shown as a percentage of a discipline. */
export type Trait =
  | 'craft' | 'systems' | 'exploration' | 'build'
  | 'research' | 'strategy' | 'collaboration' | 'ai';

export const TRAITS: Trait[] = [
  'craft', 'systems', 'exploration', 'build', 'research', 'strategy', 'collaboration', 'ai',
];

export const TRAIT_LABEL: Record<Trait, string> = {
  craft: 'Craft',
  systems: 'Systems',
  exploration: 'Exploration',
  build: 'Build',
  research: 'Research',
  strategy: 'Strategy',
  collaboration: 'Collaboration',
  ai: 'AI',
};

export type TreeId = 'design' | 'technical' | 'code';
/** One pool now. Every tree spends from it; the locks inside it decide where the points may land. */
export type Pool = 'points';
export type Tier = 'foundation' | 'crown';

export interface TalentNode {
  /** Stable id, kebab-case, unique across all trees (e.g. "tokens-and-variables"). */
  id: string;
  areaId: string;
  tier: Tier;
  /** Authored casing, as it renders under the node. */
  name: string;
  /** One sentence shown on hover: what a point here means. No em dashes. */
  meaning: string;
  /** Trait weights, each 0..1, summing to about 1. Points × weight feed the trait score. */
  weights: Partial<Record<Trait, number>>;
  /** Key into the glyph table. */
  glyph: string;
  /**
   * One sentence the masteries drawer prints when the node reaches 5 / 5: what
   * the mastery is, not what a point buys. Sentence case, 10 to 16 words, no
   * em dashes, no contractions.
   */
  masteryLine: string;
}

export interface TalentArea {
  id: string;
  treeId: TreeId;
  name: string;
  /** Exactly two: the foundation, then the crown. */
  nodes: [TalentNode, TalentNode];
}

export interface TalentTree {
  id: TreeId;
  name: string;
  pool: Pool;
  root: { name: string; glyph: string };
  areas: TalentArea[];
}

/** Points per node id, 0..5. Missing ids are 0. */
export type Allocation = Record<string, number>;

/**
 * The degree answer. 'self-taught' is worth a flat 8 points, free on either
 * tree; the three degrees are worth 4 per year and their points are locked
 * to the tree their major names (see `Major`).
 */
export type Degree = 'none' | 'self-taught' | 'associate' | 'bachelors' | 'masters';
/**
 * What the degree was in. 'graphic' (graphic or visual design) locks the
 * degree's points to the Design and systems tree; 'web' (web or interactive)
 * locks them to the Code tree; 'other' (a degree outside a design craft)
 * counts the same as self-taught: 8 points, free. Ignored when the degree
 * is 'none' or 'self-taught'.
 */
export type Major = 'graphic' | 'web' | 'other';
/**
 * A minor adds a quarter of the degree's points on top, locked to the
 * minor's tree. Ignored when the degree is 'none' or 'self-taught'.
 */
export type Minor = 'none' | 'graphic' | 'web';
/** 0 = under 40 hours, 1 = 40 to 80, ... 5 = more than 200. */
export type HoursBand = 0 | 1 | 2 | 3 | 4 | 5;

export interface Intake {
  name: string;
  degree: Degree;
  major: Major;
  minor: Minor;
  years: number;
  /**
   * Asked once the years are known: the share of those years that went to
   * design rather than code, as a percent, 0..100 in steps of 10 (Ryan's
   * rule, 2026-09-11). When set, the years points are locked across the two
   * locked trees by this share: the design share to Design and systems, the
   * rest to Code. When absent, the years points are free on any tree.
   */
  split?: number;
  hours: HoursBand;
}

export interface ReceiptLine {
  points: number;
  /** As it renders on the tally ("+16 · Bachelor's, graphic design"). */
  label: string;
  note: string;
  pool: Pool;
  /** Set when the line's points may only be spent on one tree. Absent means free. */
  lockedTo?: TreeId;
}

export interface Pools {
  /** The whole pool: designLocked + codeLocked + free. */
  total: number;
  /** The part that may only go on the Design and systems tree (a graphic design degree or minor, and the design share of the years). */
  designLocked: number;
  /** The part that may only go on the Code tree (a web degree or minor, and the code share of the years). */
  codeLocked: number;
  /** The part that may go on any tree (self-taught, another field, years without a split, hours). */
  free: number;
  /** Level is years of professional experience. */
  level: number;
  /** The receipt lines, in order, for the intake tally. */
  receipt: ReceiptLine[];
}

export type Family =
  | 'systems' | 'exploration' | 'craft' | 'product'
  | 'build' | 'ai' | 'research' | 'collaboration';

export const FAMILY_LABEL: Record<Family, string> = {
  systems: 'Systems / structure',
  exploration: 'Exploration / invention',
  craft: 'Visual craft',
  product: 'Product / UX',
  build: 'Design engineering / build',
  ai: 'AI / emerging tools',
  research: 'Research / strategy',
  collaboration: 'Collaboration / leadership',
};

export interface Archetype {
  /** kebab-case id, e.g. "guardrail-architect". */
  id: string;
  name: string;
  family: Family;
  /** One line under the name on the result: what the archetype is about. Sentence case, no period needed. */
  line: string;
  /**
   * Trait signature, each 0..1. The result picks the two archetypes with the
   * highest cosine similarity to the visitor's trait vector, from different families.
   */
  signature: Partial<Record<Trait, number>>;
  /** Second person, one sentence, ends with a period. Opens the pair description. */
  you: string;
  /** Completes "You care about ...". No leading capital, no period. */
  cares: string;
  /** Completes "but you're happiest ...". No leading capital, no period. */
  happiest: string;
  /** Card: PASSIVE ABILITY. Verb first, no pronoun, one sentence. */
  passive: string;
  /** Card: CURRENT QUEST. Imperative, one sentence. */
  quest: string;
}

/**
 * A recipe over node levels. Abilities are unlocked, never spent: the points
 * stay on the nodes and the ability reads them.
 */
export interface Ability {
  /** kebab-case id, unique across the forge. */
  id: string;
  /** The archetype the copy comes from (name, line, passive, quest live there). */
  archetypeId: string;
  /** The forge name, which may differ from the archetype name ("Lossless Handoff"). */
  name: string;
  family: Family;
  /** Every node that has to hold at least `min` points. */
  formula: { nodeId: string; min: number }[];
  /** One sentence. Falls back to the archetype's line when absent. */
  line?: string;
  /** Card: PASSIVE ABILITY. Falls back to the archetype's passive. */
  passive?: string;
  /** Card: CURRENT QUEST. Falls back to the archetype's quest. */
  quest?: string;
}

export interface AbilityState {
  ability: Ability;
  unlocked: boolean;
  /** Sum of (level over min) across the recipe, 0 when locked. */
  strength: number;
  /** Points away from unlocking, 0 when unlocked. */
  missing: number;
  levels: { nodeId: string; level: number; min: number }[];
}

export interface TalentResult {
  intake: Intake;
  pools: Pools;
  allocation: Allocation;
  pointsSpent: number;
  /** 0..100 per trait, computed, never hand-set. */
  traits: Record<Trait, number>;
  /** The four highest traits, descending, for the card's PRIMARY STATS. */
  topTraits: { trait: Trait; score: number }[];
  primary: Archetype;
  secondary: Archetype;
  /** "{primary.you} You care about {primary.cares}, but you're happiest {secondary.happiest}." */
  description: string;
  passive: string;
  quest: string;
  /** Node ids at 5 points. */
  mastered: string[];
  /** Every ability, sorted: unlocked first, then by strength, then by family order. */
  abilities: AbilityState[];
  /** True when fewer than two abilities are unlocked and the class is filled from the nearest. */
  provisional: boolean;
}
