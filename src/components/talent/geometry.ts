// ============================================
// Talent tree: fixed board geometry
// The three trees are laid out from data alone, so the page renders in one
// pass with nothing measured and nothing written to state after mount (the
// prerender serialises the live DOM, and the first client render has to match
// it exactly; see the header of SystemsInPractice.tsx for the failure this
// avoids). Two layouts, both lifted from the approved artboards:
//
//   column  ConsoleFront.dc.html, 400 × 530 (the svg's 540 viewBox carries the
//           root's label below the last row). Crowns across the top on two
//           staggered rows at y 48 and 140, foundations beneath at 293 and
//           388, the root at 468. Read on a desktop, three columns side by
//           side inside the 1392 console.
//   row     ConsoleMobile.dc.html, 318 × 436: the same shape at the phone's
//           scale, crowns at 48 and 122, foundations at 222 and 300, the root
//           at 380. One tree at a time behind the segmented control.
//
// Branches 0, 2, and 4 take the tall row; 1 and 3 take the short one, which is
// what gives the board its staggered read and keeps a three-line label out of
// the next row's node.
//
// x is expressed as a percentage of the tree box so the box can flex; y is a
// pixel offset because the box's height is fixed per layout.
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
  /** The svg viewBox's height: the box plus the room the root's label needs. */
  viewHeight: number;
  /** Node diameter, px. */
  node: number;
  /** Root diameter, px. */
  root: number;
  rootAt: Point;
  foundation: Point[];
  crown: Point[];
  /** Path from the root to branch i's foundation. */
  rootPath: (i: number) => string;
  /** Path from branch i's foundation to its crown. */
  crownPath: (i: number) => string;
}

/** Branches 0, 2, 4 ride the tall row; 1 and 3 the short one. */
function isTall(i: number): boolean {
  return i % 2 === 0;
}

/**
 * Both artboards draw the root wire the same way: out of the root 80px, into
 * the foundation from 80px below it. One curve, two scales.
 */
function curve(root: Point, f: Point): string {
  return `M${root.x} ${root.y} C${root.x} ${root.y - 80}, ${f.x} ${f.y + 80}, ${f.x} ${f.y}`;
}

// ── Desktop: 400 × 530 (ConsoleFront.dc.html) ────────────────────────────────

const COLUMN_ROOT: Point = { x: 200, y: 468 };
const COLUMN_FOUNDATION_X = [64, 132, 200, 268, 336];
const COLUMN_CROWN_X = [52, 126, 200, 274, 348];
const COLUMN_FOUNDATION: Point[] = COLUMN_FOUNDATION_X.map((x, i) => ({ x, y: isTall(i) ? 293 : 388 }));
const COLUMN_CROWN: Point[] = COLUMN_CROWN_X.map((x, i) => ({ x, y: isTall(i) ? 48 : 140 }));

export const COLUMN: LayoutSpec = {
  width: 400,
  height: 530,
  viewHeight: 540,
  node: 44,
  root: 48,
  rootAt: COLUMN_ROOT,
  foundation: COLUMN_FOUNDATION,
  crown: COLUMN_CROWN,
  rootPath: (i) => curve(COLUMN_ROOT, COLUMN_FOUNDATION[i]),
  crownPath: (i) => {
    const f = COLUMN_FOUNDATION[i];
    const c = COLUMN_CROWN[i];
    return `M${f.x} ${f.y} L${c.x} ${c.y}`;
  },
};

// ── Phone: 318 × 436 (ConsoleMobile.dc.html) ─────────────────────────────────

const ROW_ROOT: Point = { x: 159, y: 380 };
const ROW_FOUNDATION_X = [40, 104, 159, 214, 278];
const ROW_CROWN_X = [32, 94, 159, 224, 286];
const ROW_FOUNDATION: Point[] = ROW_FOUNDATION_X.map((x, i) => ({ x, y: isTall(i) ? 222 : 300 }));
const ROW_CROWN: Point[] = ROW_CROWN_X.map((x, i) => ({ x, y: isTall(i) ? 48 : 122 }));

export const ROW: LayoutSpec = {
  width: 318,
  height: 436,
  viewHeight: 436,
  node: 40,
  root: 44,
  rootAt: ROW_ROOT,
  foundation: ROW_FOUNDATION,
  crown: ROW_CROWN,
  rootPath: (i) => curve(ROW_ROOT, ROW_FOUNDATION[i]),
  crownPath: (i) => {
    const f = ROW_FOUNDATION[i];
    const c = ROW_CROWN[i];
    return `M${f.x} ${f.y} L${c.x} ${c.y}`;
  },
};

export const LAYOUTS: Record<TreeLayout, LayoutSpec> = { column: COLUMN, row: ROW };

/** Percentage of the box width, to four decimals, for a CSS custom property. */
export function pct(x: number, width: number): string {
  return `${Math.round((x / width) * 10000) / 100}%`;
}

/** The custom properties a node carries so the SCSS can place it in either layout. */
export function nodeVars(tier: 'foundation' | 'crown' | 'root', i: number): CSSProperties {
  const c = tier === 'root' ? COLUMN.rootAt : COLUMN[tier][i];
  const r = tier === 'root' ? ROW.rootAt : ROW[tier][i];
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
