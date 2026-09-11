// ============================================
// Talent tree: fixed board geometry
// The three trees are laid out from data alone, so the page renders in one
// pass with nothing measured and nothing written to state after mount (the
// prerender serialises the live DOM, and the first client render has to match
// it exactly; see the header of SystemsInPractice.tsx for the failure this
// avoids). Two layouts, both lifted from the approved artboards:
//
//   column  Tree.dc.html, 336 × 796. The root sits at the foot, five
//           foundations fan out above it on two staggered rows, and each
//           crown sits above its foundation. Read on a desktop, three trees
//           side by side.
//   row     Mobile.dc.html, 330 × 284. Crowns across the top, foundations
//           beneath, the root at the foot on a bus. Read one tree at a time.
//
// x is expressed as a percentage of the tree box so the box can flex; y is a
// pixel offset because the box's height is fixed per layout (the vertical
// rhythm is what keeps a three-line label out of the next row's node).
// ============================================

import type { CSSProperties } from 'react';
import type { TalentTree } from '../../data/talent/types';

export type TreeLayout = 'column' | 'row';

export interface Point {
  x: number;
  y: number;
}

export interface LayoutSpec {
  width: number;
  height: number;
  /** Node diameter, px. */
  node: number;
  root: Point;
  foundation: Point[];
  crown: Point[];
  /** Path from the root to branch i's foundation. */
  rootPath: (i: number) => string;
  /** Path from branch i's foundation to its crown. */
  crownPath: (i: number) => string;
}

const COLUMN_ROOT: Point = { x: 168, y: 736 };
const COLUMN_FOUNDATION: Point[] = [
  { x: 64, y: 440 },
  { x: 116, y: 546 },
  { x: 168, y: 440 },
  { x: 220, y: 546 },
  { x: 272, y: 440 },
];
const COLUMN_CROWN: Point[] = [
  { x: 52, y: 162 },
  { x: 110, y: 274 },
  { x: 168, y: 162 },
  { x: 226, y: 274 },
  { x: 284, y: 162 },
];

export const COLUMN: LayoutSpec = {
  width: 336,
  height: 796,
  node: 44,
  root: COLUMN_ROOT,
  foundation: COLUMN_FOUNDATION,
  crown: COLUMN_CROWN,
  rootPath: (i) => {
    const f = COLUMN_FOUNDATION[i];
    const r = COLUMN_ROOT;
    return `M${r.x} ${r.y} C${r.x} ${r.y - 120}, ${f.x} ${f.y + 120}, ${f.x} ${f.y}`;
  },
  crownPath: (i) => {
    const f = COLUMN_FOUNDATION[i];
    const c = COLUMN_CROWN[i];
    return `M${f.x} ${f.y} L${c.x} ${c.y}`;
  },
};

const ROW_X = [33, 99, 165, 231, 297];
const ROW_ROOT: Point = { x: 165, y: 244 };
const ROW_FOUNDATION: Point[] = ROW_X.map((x) => ({ x, y: 131 }));
const ROW_CROWN: Point[] = ROW_X.map((x) => ({ x, y: 20 }));

export const ROW: LayoutSpec = {
  width: 330,
  height: 284,
  node: 40,
  root: ROW_ROOT,
  foundation: ROW_FOUNDATION,
  crown: ROW_CROWN,
  rootPath: (i) => {
    const f = ROW_FOUNDATION[i];
    const r = ROW_ROOT;
    // Up out of the root to the bus, across, then up into the foundation.
    return `M${r.x} ${r.y} V210 H${f.x} V${f.y}`;
  },
  crownPath: (i) => {
    const f = ROW_FOUNDATION[i];
    const c = ROW_CROWN[i];
    return `M${f.x} ${f.y} V${c.y}`;
  },
};

export const LAYOUTS: Record<TreeLayout, LayoutSpec> = { column: COLUMN, row: ROW };

/** Percentage of the box width, to four decimals, for a CSS custom property. */
export function pct(x: number, width: number): string {
  return `${Math.round((x / width) * 10000) / 100}%`;
}

/** The custom properties a node carries so the SCSS can place it in either layout. */
export function nodeVars(tier: 'foundation' | 'crown' | 'root', i: number): CSSProperties {
  const c = tier === 'root' ? COLUMN.root : COLUMN[tier][i];
  const r = tier === 'root' ? ROW.root : ROW[tier][i];
  return {
    '--tt-cx': pct(c.x, COLUMN.width),
    '--tt-cy': `${c.y}px`,
    '--tt-rx': pct(r.x, ROW.width),
    '--tt-ry': `${r.y}px`,
  } as CSSProperties;
}

/** Which side of the box a branch sits on, so a tooltip can hug the edge instead of overflowing it. */
export function edgeOf(i: number, tree: TalentTree): 'start' | 'end' | undefined {
  if (i === 0) return 'start';
  if (i === tree.areas.length - 1) return 'end';
  return undefined;
}
