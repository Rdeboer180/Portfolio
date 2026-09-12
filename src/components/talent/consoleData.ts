// ============================================
// Talent console: the derived lines the chrome prints
// Everything the rails say is computed here from an allocation and the
// economy, so the status rail, the inspector, the masteries drawer, and the
// copied receipt never disagree about a number. Pure functions, no DOM.
// ============================================

import type { Allocation, TalentNode, TalentResult, TalentTree, Trait, TreeId } from '../../data/talent/types';
import { TRAITS, TRAIT_LABEL } from '../../data/talent/types';
import { TREES, treeOf } from '../../data/talent/trees';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE, isLocked } from '../../data/talent/economy';

export function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v))) : 0;
}

export interface TreeStats {
  spent: number;
  mastered: number;
  capacity: number;
}

/** Points spent, nodes at 5, and the capacity, per tree id. */
export function treeStats(allocation: Allocation, trees: TalentTree[] = TREES): Record<TreeId, TreeStats> {
  const out = {} as Record<TreeId, TreeStats>;
  trees.forEach((tree) => {
    let spent = 0;
    let mastered = 0;
    tree.areas.forEach((a) => a.nodes.forEach((n) => {
      const p = pointsAt(allocation, n.id);
      spent += p;
      if (p >= MAX_POINTS_PER_NODE) mastered += 1;
    }));
    out[tree.id] = { spent, mastered, capacity: tree.areas.length * 2 * MAX_POINTS_PER_NODE };
  });
  return out;
}

/** The trait a node feeds most: its heaviest weight. */
export function nodeLeadTrait(node: TalentNode): Trait {
  let best: Trait = TRAITS[0];
  let bestW = -1;
  TRAITS.forEach((t) => {
    const w = node.weights[t] || 0;
    if (w > bestW) {
      bestW = w;
      best = t;
    }
  });
  return best;
}

/** "Unlocked at foundation 3 · foundation holds 5", the gate in words. */
export function gateLine(allocation: Allocation, node: TalentNode): string {
  const tree = treeOf(node.id);
  const area = tree ? tree.areas.find((a) => a.id === node.areaId) : undefined;
  if (!area) return '';
  const [foundation, crown] = area.nodes;
  const fp = pointsAt(allocation, foundation.id);
  if (node.tier === 'crown') {
    return isLocked(allocation, node.id)
      ? `Locked · foundation holds ${fp} of ${CROWN_UNLOCK_AT}`
      : `Unlocked at foundation ${CROWN_UNLOCK_AT} · foundation holds ${fp}`;
  }
  return fp >= CROWN_UNLOCK_AT
    ? `Unlocks ${crown.name}`
    : `${crown.name} unlocks at ${CROWN_UNLOCK_AT}`;
}

const SHORT_TREE: Record<TreeId, string> = { craft: 'Craft', systems: 'Systems', core: 'Core' };

/** "Craft", "Systems", "Core": the tree as the rails abbreviate it. */
export function shortTreeName(id: TreeId): string {
  return SHORT_TREE[id];
}

const WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

/** "Seven" for 7; digits past twenty. */
export function countWord(n: number, capitalize = false): string {
  const w = n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
  return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

/** Every node at 5, in tree order, with its tree. */
export function masteredNodes(allocation: Allocation, trees: TalentTree[] = TREES): { node: TalentNode; tree: TalentTree }[] {
  const out: { node: TalentNode; tree: TalentTree }[] = [];
  trees.forEach((tree) => tree.areas.forEach((a) => a.nodes.forEach((node) => {
    if (pointsAt(allocation, node.id) >= MAX_POINTS_PER_NODE) out.push({ node, tree });
  })));
  return out;
}

// ── The copied receipt ──────────────────────────────────────────────────────
// A monospace block for chat and LinkedIn comments: the class line, then one
// row per tree of marks, one per node in tree order (a filled mark at 5, a
// half mark for 1 to 4, an empty mark at 0), the tree's points and masteries,
// and the link. Plain characters so it survives any paste target.

const MARK_FULL = '●';
const MARK_PART = '◐';
const MARK_EMPTY = '○';

export function markFor(points: number): string {
  if (points >= MAX_POINTS_PER_NODE) return MARK_FULL;
  if (points > 0) return MARK_PART;
  return MARK_EMPTY;
}

export function treeMarks(allocation: Allocation, tree: TalentTree): string {
  return tree.areas.map((a) => a.nodes.map((n) => markFor(pointsAt(allocation, n.id))).join('')).join('');
}

export function receiptText(result: TalentResult, shareUrl: string, trees: TalentTree[] = TREES): string {
  const name = (result.intake.name || '').trim() || 'Designer';
  const stats = treeStats(result.allocation, trees);
  const width = Math.max(...trees.map((t) => t.name.length));
  const rows = trees.map((tree) => {
    const s = stats[tree.id];
    const label = tree.name.padEnd(width, ' ');
    return `${label}  ${treeMarks(result.allocation, tree)}  ${s.spent} · ${s.mastered} mastered`;
  });
  const stats4 = result.topTraits.map((t) => `${TRAIT_LABEL[t.trait]} ${t.score}`).join(' · ');
  return [
    `${name} · Level ${result.pools.level} Designer`,
    `${result.primary.name} / ${result.secondary.name}`,
    ...rows,
    stats4,
    shareUrl,
  ].join('\n');
}
