// ============================================
// The skill tree, on the canvas: the numbers behind every panel
// Pure helpers for SkillTreeCanvas (board 25 of the skill tree design canvas, "Technical ·
// Dev mode", carried to all three lanes). Geometry for one lane on the 632 ×
// 682 artboard, the wires, the Inspect panel's data, the v5 to v7 diff, and
// the ability rows. Everything is read from src/data/talent;
// nothing here is typed by hand except the lane headings.
// ============================================

import type { Ability, AbilityState, Allocation, TalentNode, TalentTree, Trait, TreeId } from '../../data/talent/types';
import { TRAIT_LABEL } from '../../data/talent/types';
import { TREES, crownOf, foundationOf, treeOf } from '../../data/talent/trees';
import { ABILITIES, formulaLine } from '../../data/talent/abilities';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE, isLocked } from '../../data/talent/economy';
import { pointsAt } from './consoleData';

export type Lane = TreeId | 'abilities' | 'cover';
/** The phone's tabs. Its header already carries the story, so it has no cover. */
export const LANES: Lane[] = ['design', 'technical', 'code', 'abilities'];
/**
 * The desktop's Layers panel opens on the cover, the way a Figma file does,
 * with the thread second so the class is one step from the story.
 */
export const DESK_LANES: Lane[] = ['cover', 'abilities', 'design', 'technical', 'code'];

export const LANE_NAME: Record<Lane, string> = {
  design: 'Design and systems',
  technical: 'Technical',
  code: 'Code',
  abilities: 'Abilities',
  cover: 'Cover',
};

/** The frame label and the phone tabs use the short form. */
export const LANE_SHORT: Record<Lane, string> = {
  design: 'Design',
  technical: 'Technical',
  code: 'Code',
  abilities: 'Abilities',
  cover: 'Cover',
};

export const LANE_HEADING: Record<Lane, string> = {
  design: 'What I define',
  technical: 'How I connect the work',
  code: 'What I can express in the medium',
  abilities: 'What the points unlock',
  cover: "I've never been sure what to call myself.",
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

export type AbilityTone = 'unlocked' | 'near' | 'locked';

export function abilityTone(state: AbilityState): AbilityTone {
  if (state.unlocked) return 'unlocked';
  return state.missing <= 3 ? 'near' : 'locked';
}

export function abilityTag(state: AbilityState): string {
  if (state.unlocked) return 'unlocked';
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

// ── The layer stack and the thread ──────────────────────────────────────────
// The Abilities layer draws the three lanes as three sheets, one above the
// other, and stitches a thread through the skills an ability reads. A sheet is
// laid out flat (five columns, crowns behind foundations) and placed by one
// affine matrix, so a skill's place on the stage is arithmetic, not a
// measurement: the thread's knots land on the chips without reading the DOM.

export const STACK_ORDER: TreeId[] = ['design', 'technical', 'code'];

export interface StackGeo {
  width: number;
  height: number;
  /** The middle sheet's centre on the stage. */
  cx: number;
  cy: number;
  /** Stage pixels between one sheet's centre and the next. */
  gap: number;
  sheetW: number;
  sheetH: number;
  chip: number;
  colX0: number;
  colStep: number;
  crownY: number;
  foundationY: number;
  /** CSS matrix(a, b, c, d): x' = a·x + c·y, y' = b·x + d·y. */
  matrix: [number, number, number, number];
}

/** Desktop: rotateZ(-24deg) under rotateX(58deg), with no perspective. */
export const STACK_ISO: StackGeo = {
  width: 632, height: 440, cx: 316, cy: 222, gap: 124,
  sheetW: 440, sheetH: 160, chip: 34,
  colX0: 44, colStep: 88, crownY: 46, foundationY: 114,
  matrix: [0.9135, -0.2155, 0.4067, 0.4841],
};

/** Phone: three flat bands, the lane's name on the left of each. */
export const STACK_FLAT: StackGeo = {
  width: 272, height: 208, cx: 136, cy: 104, gap: 72,
  sheetW: 272, sheetH: 64, chip: 20,
  colX0: 96, colStep: 40, crownY: 18, foundationY: 46,
  matrix: [1, 0, 0, 1],
};

export interface StackChip {
  node: TalentNode;
  lane: TreeId;
  /** The chip's centre inside its sheet. */
  left: number;
  top: number;
}

export function stackChips(geo: StackGeo, lane: TreeId): StackChip[] {
  const out: StackChip[] = [];
  treeById(lane).areas.forEach((area, col) => area.nodes.forEach((node) => {
    out.push({ node, lane, left: geo.colX0 + col * geo.colStep, top: node.tier === 'crown' ? geo.crownY : geo.foundationY });
  }));
  return out;
}

/** A sheet-local point (from the sheet's top left) on the stage. */
export function stackProject(geo: StackGeo, lane: TreeId, left: number, top: number): { x: number; y: number } {
  const px = left - geo.sheetW / 2;
  const py = top - geo.sheetH / 2;
  const [a, b, c, d] = geo.matrix;
  const row = STACK_ORDER.indexOf(lane) - 1;
  return { x: geo.cx + a * px + c * py, y: geo.cy + row * geo.gap + b * px + d * py };
}

/**
 * Where the thread pins a skill's tile on the stage, or null for an id no lane
 * holds. The pin is the tile's back right corner, just inside it, so the knot
 * never sits on the glyph.
 */
export function stackPoint(geo: StackGeo, nodeId: string): { x: number; y: number } | null {
  const lane = laneOf(nodeId);
  if (!lane) return null;
  const chip = stackChips(geo, lane).find((c) => c.node.id === nodeId);
  const pin = geo.chip * 0.38;
  return chip ? stackProject(geo, lane, chip.left + pin, chip.top - pin) : null;
}

export interface ThreadEdge {
  from: string;
  to: string;
  x: number;
  y: number;
  length: number;
  /** Degrees, clockwise from the x axis, as CSS rotate() reads it. */
  angle: number;
}

/**
 * The shortest thread through a recipe's skills: a minimum spanning tree
 * grown from the first skill (Prim's), each edge drawn from the skill already
 * on the thread to the one it adds.
 */
export function threadEdges(geo: StackGeo, nodeIds: string[]): ThreadEdge[] {
  const pts = nodeIds
    .map((id) => ({ id, p: stackPoint(geo, id) }))
    .filter((n): n is { id: string; p: { x: number; y: number } } => !!n.p);
  if (pts.length < 2) return [];
  const on = [pts[0]];
  const off = pts.slice(1);
  const edges: ThreadEdge[] = [];
  while (off.length) {
    let best = { d: Infinity, i: 0, j: 0 };
    on.forEach((s, i) => off.forEach((t, j) => {
      const d = Math.hypot(t.p.x - s.p.x, t.p.y - s.p.y);
      if (d < best.d) best = { d, i, j };
    }));
    const s = on[best.i];
    const t = off.splice(best.j, 1)[0];
    edges.push({ from: s.id, to: t.id, x: s.p.x, y: s.p.y, length: best.d, angle: (Math.atan2(t.p.y - s.p.y, t.p.x - s.p.x) * 180) / Math.PI });
    on.push(t);
  }
  return edges;
}

/** "Technical + Code": the lanes a recipe runs through, top sheet first. */
export function recipeLanes(ability: Ability): TreeId[] {
  return STACK_ORDER.filter((lane) => ability.formula.some((s) => laneOf(s.nodeId) === lane));
}
