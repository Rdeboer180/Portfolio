// ============================================
// The skill tree: the derived numbers the page prints
// Points per node, spend and masteries per lane, and number words, computed
// from an allocation so the Layers panel, the artboard and the intro never
// disagree about a number. Pure functions, no DOM.
// ============================================

import type { Allocation, TalentTree, TreeId } from '../../data/talent/types';
import { TREES } from '../../data/talent/trees';
import { MAX_POINTS_PER_NODE } from '../../data/talent/economy';

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

const WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

/** "Seven" for 7; digits past twenty. */
export function countWord(n: number, capitalize = false): string {
  const w = n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
  return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}
