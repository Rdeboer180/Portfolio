// ============================================
// Talent console: the inspector
// Where a node is read. From 1024 up it is a card floating beside whatever
// is hovered, focused, or pinned: the name, the level as five dots, the
// tier and tree, the meaning, the gate in words, and the trait the node
// feeds; in build mode the minus and plus that spend on it. On a phone the
// same facts arrive as a bottom sheet (a dialog, opened by a tap, closed by
// the backdrop, the close control, or Escape; focus goes back to the node),
// with the legend folded in because the legend rail is hidden there.
//
// The node button already carries its own accessible name and description,
// so the card is the sighted reader's copy of the same facts (aria-hidden
// presentation; the node stays the focus target); the sheet is a real
// dialog because on a phone it is the only place the controls live.
// ============================================

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  size?: 'card' | 'sheet';
}> = ({ node, points, locked, canAdd, onAdd, onRemove, size = 'card' }) => (
  // On the card (aria-hidden presentation) the two controls are pointer-only:
  // the node button is the focus target and spends from the keyboard itself.
  <div className={`tt-spend tt-spend--${size}`}>
    <button
      type="button"
      className="tt-spend__btn"
      aria-label={`Remove a point from ${node.name}`}
      tabIndex={size === 'card' ? -1 : undefined}
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
      tabIndex={size === 'card' ? -1 : undefined}
      onClick={() => onAdd(node.id)}
      disabled={locked || !canAdd}
    >
      <PlusGlyph />
    </button>
  </div>
);

/** The legend's seven states, drawn as swatches, and (on the rail) the level mark that is always on the node. */
export const Legend: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <ul className={`tt-legend__scale${compact ? ' tt-legend__scale--compact' : ''}`} aria-label="Node scale">
    {['unspent', 'locked', '1', '2', '3', '4', 'mastered'].map((k) => (
      <li key={k} className={`tt-legend__item tt-legend__item--${k}`}>
        <span className="tt-legend__swatch" aria-hidden="true" />
        <span className="tt-legend__text">{k}</span>
      </li>
    ))}
    {!compact && (
      <li className="tt-legend__item tt-legend__item--count">
        <span className="tt-legend__divider" aria-hidden="true" />
        <span className="tt-legend__badge" aria-hidden="true">4</span>
        <span className="tt-legend__text">Points in the node, always on</span>
      </li>
    )}
  </ul>
);

// ── The node card ────────────────────────────────────────────────────────────
// A floating card anchored to the hovered, focused, or pinned node, from
// 1024 up. Its place is computed in a layout effect from the node's box
// relative to the console, so nothing is measured in render and the card is
// never in the prerendered HTML (nothing is hovered there). Rules: the card
// sits 34px to the right of the node's centre (22px of node, 12px of air),
// its caret level with the node; when its right edge would pass the
// console's, it flips to the left; when neither side fits, it drops below
// the node with the caret on top. Presentation only, aria-hidden: the node
// button already carries the name, the level, and the meaning.

export type CardPlace = 'right' | 'left' | 'below';

export interface CardPosition {
  left: number;
  top: number;
  place: CardPlace;
}

export const CARD_WIDTH = 280;
/** Node centre to the card's near edge: the 44px node's radius plus 12px of air. */
export const CARD_GAP = 34;
/** The caret's centre from the card's top edge (10px in, 12px wide). */
const CARET_Y = 16;
const EDGE = 8;

/** Where the card goes for a node box, both rects in the same frame. */
export function placeCard(node: DOMRect, host: DOMRect): CardPosition {
  const cx = node.left + node.width / 2 - host.left;
  const cy = node.top + node.height / 2 - host.top;
  const rightLeft = cx + CARD_GAP;
  if (rightLeft + CARD_WIDTH <= host.width - EDGE) {
    return { left: Math.round(rightLeft), top: Math.round(cy - CARET_Y), place: 'right' };
  }
  const leftLeft = cx - CARD_GAP - CARD_WIDTH;
  if (leftLeft >= EDGE) {
    return { left: Math.round(leftLeft), top: Math.round(cy - CARET_Y), place: 'left' };
  }
  const below = Math.max(EDGE, Math.min(cx - CARD_WIDTH / 2, host.width - EDGE - CARD_WIDTH));
  return { left: Math.round(below), top: Math.round(cy + CARD_GAP), place: 'below' };
}

export interface NodeCardProps extends Omit<InspectorProps, 'pinned' | 'touch'> {
  /** The console element the card is positioned in. */
  hostRef: React.RefObject<HTMLElement | null>;
  /** The DOM id of the node button the card is anchored to. */
  anchorId: string;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  selected, allocation, spends, canAdd, onAdd, onRemove, hostRef, anchorId,
}) => {
  const [pos, setPos] = useState<CardPosition | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const anchor = document.getElementById(anchorId);
    if (!host || !anchor) {
      setPos(null);
      return;
    }
    setPos(placeCard(anchor.getBoundingClientRect(), host.getBoundingClientRect()));
  }, [hostRef, anchorId]);

  if (!selected || !pos) return null;
  const { node, tree } = selected;
  const points = pointsAt(allocation, node.id);
  const locked = isLocked(allocation, node.id);
  const trait = nodeLeadTrait(node);
  const style = { left: `${pos.left}px`, top: `${pos.top}px`, width: `${CARD_WIDTH}px` } as React.CSSProperties;
  return (
    <div className={`tt-nodecard tt-nodecard--${pos.place}`} style={style} aria-hidden="true" data-testid="tt-nodecard">
      <span className="tt-nodecard__caret" />
      <div className="tt-nodecard__head">
        <span className="tt-nodecard__glyph"><Glyph name={node.glyph} size={18} /></span>
        <span className="tt-nodecard__name">{node.name}</span>
      </div>
      <div className="tt-nodecard__level">
        <span className="tt-nodecard__dots">
          {Array.from({ length: MAX_POINTS_PER_NODE }, (_, i) => (
            <span key={i} className={`tt-nodecard__dot${i < points ? ' is-on' : ''}`} />
          ))}
        </span>
        <span>
          <span className="tt-nodecard__n">{`${points} / ${MAX_POINTS_PER_NODE}`}</span>
          {` · ${node.tier} · ${shortTreeName(tree.id)}`}
        </span>
      </div>
      <p className="tt-nodecard__meaning">{node.meaning}</p>
      <p className="tt-nodecard__gate">
        {`${gateLine(allocation, node)} · feeds `}
        <span className="tt-nodecard__n">{TRAIT_LABEL[trait]}</span>
      </p>
      {spends && (
        <Spend
          node={node}
          points={points}
          locked={locked}
          canAdd={canAdd(node.id)}
          onAdd={onAdd}
          onRemove={onRemove}
          size="card"
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
