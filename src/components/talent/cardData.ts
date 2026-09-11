// ============================================
// Talent tree: what the result card shows
// One view over a TalentResult that the DOM card (TalentCard.tsx) and the PNG
// renderer (cardImage.ts) both read, so the two never disagree about a
// number or a line. Everything is derived; nothing is authored here.
// ============================================

import type { Allocation, Archetype, TalentResult, Trait } from '../../data/talent/types';
import { TRAITS, TRAIT_LABEL } from '../../data/talent/types';
import { NODE_LIST, TREES } from '../../data/talent/trees';
import { MAX_POINTS_PER_NODE } from '../../data/talent/economy';
import { SITE } from '../../data/site';

/** The node scale's alpha per level, 0 unspent through 5 mastered (NodeStates.dc.html). */
export const LEVEL_ALPHA = [0, 0.4, 0.55, 0.7, 0.85, 1];

/** Twenty segments of five points each. */
export const BAR_SEGMENTS = 20;

export interface CardStat {
  trait: Trait;
  label: string;
  score: number;
  /** Fill per segment, 0..1, BAR_SEGMENTS long. */
  segments: number[];
}

export interface CardMiniTree {
  id: string;
  /** Foundation levels, in branch order. */
  levels: number[];
}

export interface CardData {
  name: string;
  level: number;
  primary: string;
  secondary: string;
  description: string;
  passive: string;
  quest: string;
  pointsSpent: number;
  stats: CardStat[];
  trees: CardMiniTree[];
  masteredCount: number;
  areaCount: number;
  /** "rdeboerdesigns.com/talent-tree" */
  url: string;
}

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v))) : 0;
}

export function segmentsFor(score: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < BAR_SEGMENTS; i += 1) {
    const lo = i * (100 / BAR_SEGMENTS);
    const fill = Math.max(0, Math.min(1, (score - lo) / (100 / BAR_SEGMENTS)));
    out.push(fill);
  }
  return out;
}

export function cardData(result: TalentResult): CardData {
  const name = (result.intake.name || '').trim() || 'Designer';
  return {
    name,
    level: result.pools.level,
    primary: result.primary.name,
    secondary: result.secondary.name,
    description: result.description,
    passive: result.passive,
    quest: result.quest,
    pointsSpent: result.pointsSpent,
    stats: result.topTraits.map((t) => ({
      trait: t.trait,
      label: TRAIT_LABEL[t.trait],
      score: t.score,
      segments: segmentsFor(t.score),
    })),
    trees: TREES.map((tree) => ({
      id: tree.id,
      levels: tree.areas.map((a) => pointsAt(result.allocation, a.nodes[0].id)),
    })),
    masteredCount: result.mastered.length,
    areaCount: TREES.reduce((n, t) => n + t.areas.length, 0),
    url: `${SITE.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}/talent-tree`,
  };
}

/** The archetype's home trait: the heaviest weight in its signature. */
export function leadTrait(archetype: Archetype): Trait {
  let best: Trait = TRAITS[0];
  let bestW = -1;
  TRAITS.forEach((t) => {
    const w = archetype.signature[t] || 0;
    if (w > bestW) {
      bestW = w;
      best = t;
    }
  });
  return best;
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five'];

/**
 * "Guardrail Architect comes from five points in Standards, accessibility,
 * and QA and four in Exceptions, contribution, and agent-readable rules."
 * The two nodes whose points weigh most toward the archetype's lead trait.
 */
export function explainArchetype(archetype: Archetype, allocation: Allocation): string {
  const trait = leadTrait(archetype);
  const ranked = NODE_LIST.map((n) => ({
    node: n,
    points: pointsAt(allocation, n.id),
    weight: n.weights[trait] || 0,
  }))
    .filter((r) => r.points > 0 && r.weight > 0)
    .sort((a, b) => b.points * b.weight - a.points * a.weight || b.points - a.points)
    .slice(0, 2);
  if (!ranked.length) {
    return `${archetype.name} is the closest signature to the shape of the points.`;
  }
  const parts = ranked.map((r, i) =>
    i === 0
      ? `${WORDS[r.points]} ${r.points === 1 ? 'point' : 'points'} in ${r.node.name}`
      : `${WORDS[r.points]} in ${r.node.name}`,
  );
  return `${archetype.name} comes from ${parts.join(' and ')}.`;
}
