// ============================================
// The Forge, on the canvas: the numbers behind every panel
// Pure helpers for ForgeCanvas (board 25 of the Forge canvas, "Technical ·
// Dev mode", carried to all three lanes). Geometry for one lane on the 632 ×
// 682 artboard, the wires, the Inspect panel's data, the v5 to v7 diff, and
// the ability rows. Everything is read from src/data/talent;
// nothing here is typed by hand except the lane headings.
// ============================================

import type { Ability, AbilityState, Allocation, TalentNode, TalentTree, Trait, TreeId } from '../../data/talent/types';
import { TRAIT_LABEL } from '../../data/talent/types';
import { TREES, crownOf, foundationOf, treeOf } from '../../data/talent/trees';
import { ABILITIES, formulaLine } from '../../data/talent/forge';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE, isLocked } from '../../data/talent/economy';
import { pointsAt } from './consoleData';

export type Lane = TreeId | 'abilities';
export const LANES: Lane[] = ['design', 'technical', 'code', 'abilities'];

export const LANE_NAME: Record<Lane, string> = {
  design: 'Design and systems',
  technical: 'Technical',
  code: 'Code',
  abilities: 'Abilities',
};

/** The frame label and the phone tabs use the short form. */
export const LANE_SHORT: Record<Lane, string> = {
  design: 'Design',
  technical: 'Technical',
  code: 'Code',
  abilities: 'Abilities',
};

export const LANE_HEADING: Record<Lane, string> = {
  design: 'What I define',
  technical: 'How I connect the work',
  code: 'What I can express in the medium',
  abilities: 'What the points unlock',
};

export function treeById(id: TreeId): TalentTree {
  return TREES.find((t) => t.id === id) as TalentTree;
}

// ── Geometry (board 25) ─────────────────────────────────────────────────────
// Five columns of 120 from x 76; crowns on y 210, foundations on y 400; the
// root tile's top edge at (316, 590). Wires meet a node at its bottom edge.

export const ARTBOARD = { width: 632, height: 682 };
const COLUMN_X = (col: number) => 76 + col * 120;
const CROWN_Y = 210;
const FOUNDATION_Y = 400;
export const ROOT = { x: 316, y: 590 };
const NODE_R = 24;

export interface LaneNode {
  node: TalentNode;
  col: number;
  x: number;
  y: number;
  level: number;
  locked: boolean;
}

export function laneNodes(tree: TalentTree, allocation: Allocation): LaneNode[] {
  const out: LaneNode[] = [];
  tree.areas.forEach((area, col) => {
    area.nodes.forEach((node) => {
      const crown = node.tier === 'crown';
      out.push({
        node,
        col,
        x: COLUMN_X(col),
        y: crown ? CROWN_Y : FOUNDATION_Y,
        level: pointsAt(allocation, node.id),
        locked: isLocked(allocation, node.id),
      });
    });
  });
  return out;
}

export interface Wire {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lit: boolean;
  /** On the selected node's path from the root. */
  chain: boolean;
}

export interface Gate {
  key: string;
  x: number;
  y: number;
  open: boolean;
}

/** Root to each foundation, then each foundation to its crown. */
export function laneWires(tree: TalentTree, allocation: Allocation, selectedId: string | null): { wires: Wire[]; gates: Gate[] } {
  const wires: Wire[] = [];
  const gates: Gate[] = [];
  tree.areas.forEach((area, col) => {
    const [foundation, crown] = area.nodes;
    const x = COLUMN_X(col);
    const inArea = selectedId === foundation.id || selectedId === crown.id;
    const fLevel = pointsAt(allocation, foundation.id);
    const cLevel = pointsAt(allocation, crown.id);
    wires.push({
      key: `root-${foundation.id}`,
      x1: ROOT.x, y1: ROOT.y, x2: x, y2: FOUNDATION_Y + NODE_R,
      lit: fLevel > 0,
      chain: inArea,
    });
    wires.push({
      key: `${foundation.id}-${crown.id}`,
      x1: x, y1: FOUNDATION_Y - NODE_R, x2: x, y2: CROWN_Y + NODE_R,
      lit: cLevel > 0,
      chain: selectedId === crown.id,
    });
    gates.push({ key: crown.id, x, y: 318, open: fLevel >= CROWN_UNLOCK_AT });
  });
  return { wires, gates };
}

// ── Nodes, as words ─────────────────────────────────────────────────────────

export function nodeAria(node: TalentNode, level: number): string {
  return `${node.name}, ${node.tier}, ${level} of ${MAX_POINTS_PER_NODE} points`;
}

/** Quote a key the way it prints in ryan.ts. */
export function keyOf(id: string): string {
  return id.includes('-') ? `'${id}'` : id;
}

/** "↑3 from v5", "new in v7", or null when the level did not move. */
export function deltaFromV5(id: string, level: number, v5: Allocation): string | null {
  if (!(id in v5)) return 'new in v7';
  const d = level - (v5[id] || 0);
  if (d === 0) return null;
  return d > 0 ? `↑${d} from v5` : `↓${-d} from v5`;
}

export function gateLine(node: TalentNode): string {
  if (node.tier === 'crown') {
    const f = foundationOf(node.id);
    return `crown · gate ${f ? f.id : '?'} ≥ ${CROWN_UNLOCK_AT}`;
  }
  const c = crownOf(node.id);
  return `foundation · opens ${c ? c.id : '?'} at ${CROWN_UNLOCK_AT}`;
}

export interface Recipe {
  ability: Ability;
  min: number;
  met: boolean;
}

/** The abilities whose recipe reads this node. */
export function recipesReading(nodeId: string, allocation: Allocation): Recipe[] {
  const level = pointsAt(allocation, nodeId);
  return ABILITIES.reduce<Recipe[]>((acc, ability) => {
    const step = ability.formula.find((s) => s.nodeId === nodeId);
    if (step) acc.push({ ability, min: step.min, met: level >= step.min });
    return acc;
  }, []);
}

export function weightRows(node: TalentNode): { trait: Trait; label: string; value: string; pct: number }[] {
  return (Object.keys(node.weights) as Trait[])
    .map((trait) => ({ trait, label: TRAIT_LABEL[trait].toLowerCase(), value: (node.weights[trait] || 0).toFixed(2), pct: Math.round((node.weights[trait] || 0) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

// ── The ryan.ts diff, v5 to v7 ──────────────────────────────────────────────

/** Where a retired node's line prints: just above the node it folded into. */
const RETIRED_BEFORE: Record<string, string> = {
  'state-modeling': 'handoff',
  'agent-context': 'skills-and-plugins',
};

export interface CodeLine {
  key: string;
  text: string;
  kind: 'comment' | 'add' | 'remove' | 'same';
  selected: boolean;
}

export function ryanDiff(tree: TalentTree, allocation: Allocation, v5: Allocation, selectedId: string | null): CodeLine[] {
  const lines: CodeLine[] = [];
  const spent = tree.areas.reduce((s, a) => s + a.nodes.reduce((n, node) => n + pointsAt(allocation, node.id), 0), 0);
  lines.push({ key: 'head', text: `  // ${tree.name} (${spent})`, kind: 'comment', selected: false });
  let same = 0;
  tree.areas.forEach((area) => area.nodes.forEach((node) => {
    Object.keys(RETIRED_BEFORE).filter((old) => RETIRED_BEFORE[old] === node.id && old in v5).forEach((old) => {
      lines.push({ key: `gone-${old}`, text: `− ${keyOf(old)}: ${v5[old]},`, kind: 'remove', selected: false });
    });
    const id = node.id;
    const now = pointsAt(allocation, id);
    const on = id === selectedId;
    if (!(id in v5)) {
      lines.push({ key: `add-${id}`, text: `+ ${keyOf(id)}: ${now},`, kind: 'add', selected: on });
    } else if ((v5[id] || 0) !== now) {
      lines.push({ key: `rm-${id}`, text: `− ${keyOf(id)}: ${v5[id] || 0},`, kind: 'remove', selected: on });
      lines.push({ key: `add-${id}`, text: `+ ${keyOf(id)}: ${now},`, kind: 'add', selected: on });
    } else if (on) {
      lines.push({ key: `same-${id}`, text: `  ${keyOf(id)}: ${now},`, kind: 'same', selected: true });
    } else {
      same += 1;
    }
  }));
  lines.push({ key: 'foot', text: `  // ${same} more unchanged`, kind: 'comment', selected: false });
  return lines;
}

// ── Abilities ───────────────────────────────────────────────────────────────

export type AbilityTone = 'forged' | 'near' | 'locked';

export function abilityTone(state: AbilityState): AbilityTone {
  if (state.unlocked) return 'forged';
  return state.missing <= 3 ? 'near' : 'locked';
}

export function abilityTag(state: AbilityState): string {
  if (state.unlocked) return 'forged';
  return `${state.missing} away`;
}

export function abilityRecipe(state: AbilityState): string {
  return formulaLine(state.ability);
}

/** The lane a node lives in. */
export function laneOf(nodeId: string): TreeId | null {
  const t = treeOf(nodeId);
  return t ? t.id : null;
}
