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
// Spending: click, Enter, or Space adds a point. Shift+click, Backspace,
// Delete, or the minus key removes one, as does the small minus control
// that appears on hover for pointer users (phones get the same control in
// the detail block under the tree, at a full-size target).
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
  points: number;
  /** Crown whose foundation is still below the unlock line. */
  locked: boolean;
  /** The foundation's name, for the locked reason. */
  foundationName?: string;
  /** False on Ryan's tree: the node still answers hover and focus, but does not spend. */
  editable: boolean;
  /** The node is hovered, focused, or pinned; the board draws its detail. */
  active: boolean;
  onAdd: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
  /** Hover or focus landed (pinned = a click on a read-only tree, or a tap). */
  onActivate: (nodeId: string, pinned: boolean) => void;
  onDeactivate: (nodeId: string) => void;
}

export function meaningId(nodeId: string): string {
  return `tt-meaning-${nodeId}`;
}

/** "Tokens and variables, foundation, 3 of 5 points" (plus the lock reason on a locked crown). */
export function nodeLabel(node: TalentNode, points: number, locked: boolean, foundationName?: string): string {
  const base = `${node.name}, ${node.tier}, ${points} of ${MAX_POINTS_PER_NODE} points`;
  if (!locked) return base;
  return `${base}, locked until ${foundationName || 'its foundation'} holds ${CROWN_UNLOCK_AT}`;
}

const TalentNodeButton: React.FC<TalentNodeButtonProps> = ({
  node,
  index,
  points,
  locked,
  foundationName,
  editable,
  active,
  onAdd,
  onRemove,
  onActivate,
  onDeactivate,
}) => {
  const mastered = points >= MAX_POINTS_PER_NODE;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!editable) {
        // A read-only tree: a click pins the detail, a second click on the
        // same node lets it go (a tap has no hover to lean on).
        onActivate(node.id, true);
        return;
      }
      if (e.shiftKey) {
        onRemove(node.id);
      } else if (!locked) {
        onAdd(node.id);
      }
      onActivate(node.id, false);
    },
    [editable, locked, node.id, onAdd, onRemove, onActivate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!editable) return;
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '-') {
        e.preventDefault();
        onRemove(node.id);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        if (!locked) onAdd(node.id);
      }
    },
    [editable, locked, node.id, onAdd, onRemove],
  );

  const classes = [
    'tt-node',
    `tt-node--${node.tier}`,
    `tt-node--l${locked ? 0 : points}`,
    locked ? 'is-locked' : '',
    mastered ? 'is-mastered' : '',
    active ? 'is-active' : '',
    editable ? 'is-editable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={nodeVars(node.tier, index)}>
      <button
        type="button"
        className="tt-node__btn"
        aria-label={nodeLabel(node, points, locked, foundationName)}
        aria-describedby={meaningId(node.id)}
        aria-disabled={locked || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => onActivate(node.id, false)}
        onMouseLeave={() => onDeactivate(node.id)}
        onFocus={() => onActivate(node.id, false)}
        onBlur={() => onDeactivate(node.id)}
      >
        <Glyph name={node.glyph} className="tt-node__glyph" />
        {mastered && <span className="tt-node__mark" aria-hidden="true" />}
        {points > 0 && (
          <span className="tt-node__count" aria-hidden="true">{points}</span>
        )}
      </button>
      {editable && points > 0 && (
        <button
          type="button"
          className="tt-node__minus"
          tabIndex={-1}
          aria-label={`Remove a point from ${node.name}`}
          onClick={() => onRemove(node.id)}
        >
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <span className="tt-node__label" aria-hidden="true">
        <span className="tt-node__label-text">{node.name}</span>
        {mastered && <span className="tt-node__mastered">Mastered</span>}
      </span>
      <span id={meaningId(node.id)} className="sr-only">{node.meaning}</span>
    </div>
  );
};

export default TalentNodeButton;
