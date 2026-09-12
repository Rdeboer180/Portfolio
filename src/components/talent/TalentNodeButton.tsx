// ============================================
// Talent tree: one node on the board
// A 44px circle (40 on the phone) carrying the skill glyph, placed by the
// fixed geometry in geometry.ts and dressed by the node scale in
// _talent-tree.scss (NodeStates.dc.html is the spec: ring and glyph take the
// same value, 0 unspent through 5 mastered, a dashed ring while a crown is
// locked). The circle is a real <button>: its accessible name says where it
// is and how many points it holds, its description is the node's meaning,
// and a locked crown is aria-disabled with the reason rather than removed
// from the tab order.
//
// The node prints nothing of its own beyond the label and the level mark:
// hover and focus hand the node to the console's inspector rail (or, on a
// phone, a tap opens the sheet), which is where the meaning and the gate are
// read. Spending: click, Enter, or Space adds a point; Shift+click,
// Backspace, Delete, or the minus key removes one. On the phone a tap opens
// the sheet instead and the sheet's minus and plus do the spending.
// ============================================

import React, { useCallback } from 'react';
import type { TalentNode } from '../../data/talent/types';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE } from '../../data/talent/economy';
import Glyph from './Glyph';
import { nodeVars } from './geometry';

export interface TalentNodeButtonProps {
  node: TalentNode;
  /** Branch index within the tree, 0..4. */
  index: number;
  /** Tree index, 0..2, for the cascade's stagger. */
  treeIndex: number;
  points: number;
  /** Crown whose foundation is still below the unlock line. */
  locked: boolean;
  /** The foundation's name, for the locked reason. */
  foundationName?: string;
  /** False on Ryan's tree: the node still answers hover and focus, but does not spend. */
  editable: boolean;
  /** Build mode before the intake is answered: the node is shown but takes nothing. */
  dormant: boolean;
  /** The inspector is printing this node. */
  active: boolean;
  /** The phone: a tap opens the sheet rather than spending. */
  tapOpens: boolean;
  /** Compare with Ryan: his points here, drawn as an outer arc, a fifth of the circle per point. Undefined when off. */
  compare?: number;
  onAdd: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
  /** Pointer entered or left, keyboard focus landed or left. */
  onHover: (nodeId: string | null) => void;
  /** A click or a tap: the inspector keeps this node until the next pin or Escape. */
  onPin: (nodeId: string, el: HTMLButtonElement) => void;
}

export function meaningId(nodeId: string): string {
  return `tt-meaning-${nodeId}`;
}

export function nodeDomId(nodeId: string): string {
  return `tt-node-${nodeId}`;
}

/** "Tokens and variables, foundation, 3 of 5 points" (plus the lock reason on a locked crown). */
export function nodeLabel(node: TalentNode, points: number, locked: boolean, foundationName?: string): string {
  const base = `${node.name}, ${node.tier}, ${points} of ${MAX_POINTS_PER_NODE} points`;
  if (!locked) return base;
  return `${base}, locked until ${foundationName || 'its foundation'} holds ${CROWN_UNLOCK_AT}`;
}

/**
 * The cascade's delay for a node: root first, then the foundations, then the
 * crowns, each tier staggered across the three trees and along the branch, so
 * the whole board lights in about 900ms.
 */
export function cascadeDelay(tier: 'root' | 'foundation' | 'crown', treeIndex: number, index: number): number {
  if (tier === 'root') return treeIndex * 60;
  const base = tier === 'foundation' ? 140 : 460;
  return base + treeIndex * 70 + index * 40;
}

// The compare arc: a circle at r + 7 around the 44px node (the SVG scales
// with the node, so the phone's 40px keeps the proportion), 1.5px Signal
// Orange at 55%, drawn as a dash from twelve o'clock, a fifth of the
// circumference per point, the full ring at five. Decorative: the toggle's
// label carries the meaning. No motion, so nothing to reduce.
const ARC_R = 29;
const ARC_C = 2 * Math.PI * ARC_R;

export const CompareArc: React.FC<{ points: number }> = ({ points }) => {
  const p = Math.max(0, Math.min(MAX_POINTS_PER_NODE, points));
  const dash = p >= MAX_POINTS_PER_NODE ? ARC_C : (ARC_C * p) / MAX_POINTS_PER_NODE;
  return (
    <svg className="tt-node__compare" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle
        cx="32"
        cy="32"
        r={ARC_R}
        fill="none"
        strokeWidth="1.5"
        strokeDasharray={`${dash.toFixed(2)} ${ARC_C.toFixed(2)}`}
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
};

const TalentNodeButton: React.FC<TalentNodeButtonProps> = ({
  node,
  index,
  treeIndex,
  points,
  locked,
  foundationName,
  editable,
  dormant,
  active,
  tapOpens,
  compare,
  onAdd,
  onRemove,
  onHover,
  onPin,
}) => {
  const mastered = points >= MAX_POINTS_PER_NODE;
  const spends = editable && !dormant;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!spends || tapOpens) {
        // A read-only tree, a dormant one, or a phone: the click pins the
        // node in the inspector (or opens the sheet); nothing is spent.
        onPin(node.id, e.currentTarget);
        return;
      }
      if (e.shiftKey) {
        onRemove(node.id);
      } else if (!locked) {
        onAdd(node.id);
      }
      onPin(node.id, e.currentTarget);
    },
    [spends, tapOpens, locked, node.id, onAdd, onRemove, onPin],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!spends) return;
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '-') {
        e.preventDefault();
        onRemove(node.id);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        if (!locked) onAdd(node.id);
      }
    },
    [spends, locked, node.id, onAdd, onRemove],
  );

  const classes = [
    'tt-node',
    `tt-node--${node.tier}`,
    `tt-node--l${locked ? 0 : points}`,
    locked ? 'is-locked' : '',
    mastered ? 'is-mastered' : '',
    active ? 'is-active' : '',
    spends ? 'is-editable' : '',
    dormant ? 'is-dormant' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    ...nodeVars(node.tier, index),
    '--tt-delay': `${cascadeDelay(node.tier, treeIndex, index)}ms`,
  } as React.CSSProperties;

  return (
    <div className={classes} style={style}>
      {compare !== undefined && compare > 0 && <CompareArc points={compare} />}
      <button
        type="button"
        id={nodeDomId(node.id)}
        className="tt-node__btn"
        aria-label={nodeLabel(node, points, locked, foundationName)}
        aria-describedby={meaningId(node.id)}
        aria-disabled={locked || dormant || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(node.id)}
        onBlur={() => onHover(null)}
      >
        <Glyph name={node.glyph} className="tt-node__glyph" />
        {mastered && <span className="tt-node__mark" aria-hidden="true" />}
        {points > 0 && (
          <span className="tt-node__count" aria-hidden="true">{points}</span>
        )}
      </button>
      <span className="tt-node__label" aria-hidden="true">
        <span className="tt-node__label-text">{node.name}</span>
        {mastered && <span className="tt-node__mastered">Mastered</span>}
      </span>
      <span id={meaningId(node.id)} className="sr-only">{node.meaning}</span>
    </div>
  );
};

export default TalentNodeButton;
