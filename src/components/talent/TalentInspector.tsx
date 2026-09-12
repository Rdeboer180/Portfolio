// ============================================
// Talent console: the inspector
// Where a node is read. On a desktop it is a rail under the trees that
// prints whatever is hovered, focused, or pinned: the name, the level, the
// tier and tree, the meaning, the gate in words, and the trait the node
// feeds; in build mode the minus and plus that spend on it. On a phone the
// same facts arrive as a bottom sheet (a dialog, opened by a tap, closed by
// the backdrop, the close control, or Escape; focus goes back to the node),
// with the legend folded in because the legend rail is hidden there.
//
// The node button already carries its own accessible name and description,
// so the rail is the sighted reader's copy of the same facts; the sheet is a
// real dialog because on a phone it is the only place the controls live.
// ============================================

import React, { useEffect, useRef } from 'react';
import type { Allocation, TalentNode, TalentTree } from '../../data/talent/types';
import { TRAIT_LABEL } from '../../data/talent/types';
import { CROWN_UNLOCK_AT, MAX_POINTS_PER_NODE, isLocked } from '../../data/talent/economy';
import Glyph from './Glyph';
import { gateLine, nodeLeadTrait, pointsAt, shortTreeName } from './consoleData';

export interface InspectorNode {
  node: TalentNode;
  tree: TalentTree;
}

export interface InspectorProps {
  selected: InspectorNode | null;
  /** True while the selection is pinned by a click or a tap rather than hover. */
  pinned: boolean;
  allocation: Allocation;
  /** Build mode with the intake answered: the minus and plus show. */
  spends: boolean;
  /** Build mode before the intake is answered. */
  dormant: boolean;
  canAdd: (nodeId: string) => boolean;
  onAdd: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
  /** A phone: the hint says tap rather than hover. */
  touch?: boolean;
}

const MinusGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 12h12" /></svg>
);
const PlusGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M12 6v12M6 12h12" /></svg>
);

const Spend: React.FC<{
  node: TalentNode;
  points: number;
  locked: boolean;
  canAdd: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  size?: 'rail' | 'sheet';
}> = ({ node, points, locked, canAdd, onAdd, onRemove, size = 'rail' }) => (
  <div className={`tt-spend tt-spend--${size}`}>
    <button
      type="button"
      className="tt-spend__btn"
      aria-label={`Remove a point from ${node.name}`}
      onClick={() => onRemove(node.id)}
      disabled={points <= 0}
    >
      <MinusGlyph />
    </button>
    <span className="tt-spend__count" aria-live="polite" aria-atomic="true">
      <span className="tt-spend__n">{points}</span>
      <span className="tt-spend__of" aria-hidden="true">{` / ${MAX_POINTS_PER_NODE}`}</span>
    </span>
    <button
      type="button"
      className="tt-spend__btn tt-spend__btn--add"
      aria-label={`Add a point to ${node.name}`}
      onClick={() => onAdd(node.id)}
      disabled={locked || !canAdd}
    >
      <PlusGlyph />
    </button>
  </div>
);

/** The legend's seven states, drawn as swatches. */
export const Legend: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <ul className={`tt-legend__scale${compact ? ' tt-legend__scale--compact' : ''}`} aria-label="Node scale">
    {['unspent', 'locked', '1', '2', '3', '4', 'mastered'].map((k) => (
      <li key={k} className={`tt-legend__item tt-legend__item--${k}`}>
        <span className="tt-legend__swatch" aria-hidden="true" />
        <span className="tt-legend__text">{k}</span>
      </li>
    ))}
  </ul>
);

// ── The rail ─────────────────────────────────────────────────────────────────

export const InspectorRail: React.FC<InspectorProps> = ({
  selected, pinned, allocation, spends, dormant, canAdd, onAdd, onRemove, touch,
}) => {
  if (!selected) {
    let hint: string;
    if (dormant) hint = 'Answer the three questions above and the trees power up';
    else if (touch) hint = 'Tap a node for its level and gate';
    else if (spends) hint = 'Hover a node for its level and gate · click to spend a point · Shift-click takes one back';
    else hint = 'Hover a node for its level and gate';
    return (
      <div className="tt-inspector" data-state="idle">
        <span className="tt-inspector__key">Inspector</span>
        <span className="tt-inspector__hint">{hint}</span>
      </div>
    );
  }
  const { node, tree } = selected;
  const points = pointsAt(allocation, node.id);
  const locked = isLocked(allocation, node.id);
  const trait = nodeLeadTrait(node);
  return (
    <div className="tt-inspector" data-state={pinned ? 'selected' : 'hover'}>
      <span className="tt-inspector__key">
        {`Inspector · ${pinned ? 'selected' : 'hover'}`}
      </span>
      <span className="tt-inspector__glyph" aria-hidden="true"><Glyph name={node.glyph} size={16} /></span>
      <span className="tt-inspector__name">{node.name}</span>
      <span className="tt-inspector__level">
        {`${points} / ${MAX_POINTS_PER_NODE} · ${node.tier} · ${tree.name}`}
      </span>
      <span className="tt-inspector__meaning">{node.meaning}</span>
      <span className="tt-inspector__gate">
        {`${gateLine(allocation, node)} · feeds ${TRAIT_LABEL[trait]}`}
      </span>
      {spends && (
        <Spend
          node={node}
          points={points}
          locked={locked}
          canAdd={canAdd(node.id)}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      )}
    </div>
  );
};

// ── The sheet ────────────────────────────────────────────────────────────────

export interface InspectorSheetProps extends InspectorProps {
  open: boolean;
  onClose: () => void;
}

export const InspectorSheet: React.FC<InspectorSheetProps> = ({
  open, selected, allocation, spends, canAdd, onAdd, onRemove, onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus lands on the sheet when it opens; the console returns it to the
  // node when the sheet closes (it knows which button opened it).
  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus({ preventScroll: true });
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !selected) return null;
  const { node, tree } = selected;
  const points = pointsAt(allocation, node.id);
  const locked = isLocked(allocation, node.id);
  const trait = nodeLeadTrait(node);
  const titleId = 'tt-sheet-title';

  return (
    <div className="tt-sheet" data-tree={tree.id}>
      <button type="button" className="tt-sheet__backdrop" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div
        ref={panelRef}
        className="tt-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="tt-sheet__head">
          <span className="tt-sheet__glyph" aria-hidden="true"><Glyph name={node.glyph} size={20} /></span>
          <div className="tt-sheet__title-wrap">
            <h2 className="tt-sheet__title" id={titleId}>{node.name}</h2>
            <p className="tt-sheet__level">
              {`${points} / ${MAX_POINTS_PER_NODE} · ${node.tier} · ${shortTreeName(tree.id)} · feeds ${TRAIT_LABEL[trait]}`}
            </p>
          </div>
          <button type="button" className="tt-sheet__close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <p className="tt-sheet__meaning">{node.meaning}</p>
        <p className="tt-sheet__gate">{gateLine(allocation, node)}</p>
        {spends && (
          <Spend
            node={node}
            points={points}
            locked={locked}
            canAdd={canAdd(node.id)}
            onAdd={onAdd}
            onRemove={onRemove}
            size="sheet"
          />
        )}
        <div className="tt-sheet__legend">
          <Legend compact />
          <p className="tt-sheet__rule">{`Crown unlocks at foundation ${CROWN_UNLOCK_AT} · earned by time, not self-rated`}</p>
        </div>
      </div>
    </div>
  );
};
