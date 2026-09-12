// ============================================
// Talent console: the two drawers under the trees
// Masteries (every node at 5 / 5, as rows: glyph, name, masteryLine, tree and
// tier) and the card (the character card from the result, with the two
// archetype rows beneath it and, in build mode, the name field and the share
// actions). Both are native <details> that ship OPEN so every word is in the
// static HTML and a crawler reads it; a viewer can fold either one. The
// `open` attribute is identical on the server and the client by
// construction: it is never state.
// ============================================

import React from 'react';
import type { Allocation, TalentResult, TalentTree } from '../../data/talent/types';
import { FAMILY_LABEL, TRAIT_LABEL } from '../../data/talent/types';
import { MAX_POINTS_PER_NODE } from '../../data/talent/economy';
import { RYAN_CLASS_LABEL } from '../../data/talent/ryan';
import Glyph from './Glyph';
import TalentCard from './TalentCard';
import { cardData, explainArchetype, leadTrait } from './cardData';
import { countWord, masteredNodes, shortTreeName } from './consoleData';

// ── Masteries ────────────────────────────────────────────────────────────────

export const MasteriesDrawer: React.FC<{ allocation: Allocation; trees: TalentTree[]; own: boolean }> = ({
  allocation, trees, own,
}) => {
  const rows = masteredNodes(allocation, trees);
  const n = rows.length;
  const summary = n === 0
    ? 'No masteries yet'
    : `${countWord(n, true)} ${n === 1 ? 'node' : 'nodes'} at ${MAX_POINTS_PER_NODE} / ${MAX_POINTS_PER_NODE}`;
  return (
    <details className="tt-drawer tt-drawer--masteries" aria-label="Masteries" open>
      <summary className="tt-drawer__summary">
        <span className="tt-drawer__caret" aria-hidden="true" />
        <span className="tt-drawer__index">03 / Masteries</span>
        <span className="tt-drawer__line">{`${summary} · the rule is five points, nothing else`}</span>
        <span className="tt-drawer__tag">Drawer · open by default</span>
      </summary>
      <div className="tt-drawer__body">
        {n === 0 ? (
          <p className="tt-masteries__empty">
            {own
              ? 'Five points in one node is a mastery. The first one prints here.'
              : 'No node holds five points.'}
          </p>
        ) : (
          <ul className="tt-masteries">
            {rows.map(({ node, tree }) => (
              <li key={node.id} className="tt-masteries__row">
                <span className="tt-masteries__glyph" aria-hidden="true"><Glyph name={node.glyph} size={18} /></span>
                <span className="tt-masteries__text">
                  <span className="tt-masteries__name">{node.name}</span>
                  <span className="tt-masteries__meaning">{node.masteryLine}</span>
                </span>
                <span className="tt-masteries__meta">{`${shortTreeName(tree.id)} · ${node.tier}`}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
};

// ── The card ─────────────────────────────────────────────────────────────────

export type CopyState = 'idle' | 'copied' | 'failed';

export interface CardDrawerProps {
  result: TalentResult;
  own: boolean;
  /** Set once on the client after the card comes into view: runs the assembling motion. */
  assembled: boolean;
  name?: string;
  onName?: (name: string) => void;
  saving?: boolean;
  onSave?: () => void;
  linkState?: CopyState;
  onCopyLink?: () => void;
  receiptState?: CopyState;
  onCopyReceipt?: () => void;
  shareUrl?: string;
  /** Compare with Ryan: on when his allocation is drawn over the visitor's nodes. Build route only. */
  compare?: boolean;
  onCompare?: (on: boolean) => void;
}

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="M21 15.5l-4.5-4.5L8 19.5" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" />
    <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1" />
  </svg>
);

const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);

function copyLabel(state: CopyState | undefined, idle: string, done: string): string {
  if (state === 'copied') return done;
  if (state === 'failed') return 'Copy failed';
  return idle;
}

export const CardDrawer: React.FC<CardDrawerProps> = ({
  result, own, assembled, name, onName, saving, onSave, linkState, onCopyLink, receiptState, onCopyReceipt, shareUrl,
  compare, onCompare,
}) => {
  const data = cardData(result);
  const points = result.pools.craft + result.pools.core;
  const rows = [
    { a: result.primary, trait: leadTrait(result.primary) },
    { a: result.secondary, trait: leadTrait(result.secondary) },
  ];
  return (
    <details className={`tt-drawer tt-drawer--card${assembled ? ' is-assembled' : ''}`} aria-label="The card" open>
      <summary className="tt-drawer__summary">
        <span className="tt-drawer__caret" aria-hidden="true" />
        <span className="tt-drawer__index">04 / The card</span>
        <span className="tt-drawer__line">{`Computed from ${points} points, never hand-set`}</span>
        <span className="tt-drawer__tag">
          {own ? 'Drawer · open by default · 1200 × 630 on save' : 'Drawer · open by default · full card at 1200 × 630 on the build route'}
        </span>
      </summary>
      <div className="tt-drawer__body">
        {own && onName && (
          <div className="tt-cardname">
            <label htmlFor="tt-name" className="tt-cardname__label">Your name</label>
            <input
              id="tt-name"
              type="text"
              className="tt-cardname__input"
              value={name || ''}
              maxLength={60}
              autoComplete="name"
              placeholder="First and last, or a handle"
              onChange={(e) => onName(e.target.value)}
            />
            <span className="tt-cardname__note">Shows on the card and rides in the link · nothing is stored</span>
          </div>
        )}
        <div className="tt-cardframe">
          <TalentCard data={data} />
        </div>
        <div className="tt-cardside">
        {!own && <p className="tt-cardside__note" aria-hidden="true">the part people screenshot</p>}
        <ul className="tt-classes">
          {rows.map(({ a, trait }) => (
            <li key={a.id} className="tt-classes__row">
              <span className="tt-classes__name">{a.name}</span>
              <span className="tt-classes__family">{FAMILY_LABEL[a.family]}</span>
              <span className="tt-classes__line">{a.line}</span>
              <span className="tt-classes__led">{`led by ${TRAIT_LABEL[trait]} ${result.traits[trait]}`}</span>
            </li>
          ))}
        </ul>
        <p className="tt-classes__why">
          {`${explainArchetype(result.primary, result.allocation)} ${explainArchetype(result.secondary, result.allocation)}`}
        </p>
        {own && (
          <div className="tt-share">
            <button type="button" className="tt-share__btn tt-share__btn--primary" onClick={onSave} disabled={saving}>
              <ImageIcon />
              <span>{saving ? 'Rendering' : 'Save as image'}</span>
            </button>
            <button type="button" className="tt-share__btn" onClick={onCopyLink}>
              <LinkIcon />
              <span>{copyLabel(linkState, 'Copy link', 'Link copied')}</span>
            </button>
            <button type="button" className="tt-share__btn" onClick={onCopyReceipt}>
              <ReceiptIcon />
              <span>{copyLabel(receiptState, 'Copy receipt', 'Receipt copied')}</span>
            </button>
            <span className="tt-share__note" aria-live="polite">
              {linkState === 'failed' || receiptState === 'failed'
                ? 'The clipboard was refused · the link is in the address bar'
                : 'The link carries your points · the receipt is three rows of marks for a comment'}
            </span>
            {linkState === 'failed' && shareUrl && (
              <input readOnly className="tt-share__url" value={shareUrl} aria-label="Share link" onFocus={(e) => e.currentTarget.select()} />
            )}
            {onCompare && (
              <div className="tt-compare">
                <button
                  type="button"
                  role="switch"
                  className={`tt-compare__toggle${compare ? ' is-on' : ''}`}
                  aria-checked={!!compare}
                  aria-label="Compare with Ryan: draw his points as an outer arc on each node, a fifth of the ring per point"
                  onClick={() => onCompare(!compare)}
                >
                  <span className="tt-compare__label" aria-hidden="true">Compare with Ryan</span>
                  <span className="tt-compare__switch" aria-hidden="true"><span className="tt-compare__knob" /></span>
                  <span className="tt-compare__state" aria-hidden="true">{compare ? 'On' : 'Off'}</span>
                </button>
                <p className="tt-compare__line">
                  <span className="tt-compare__arc" aria-hidden="true" />
                  {`Outer arc = Ryan's points, a fifth per point · Ryan: ${RYAN_CLASS_LABEL}`}
                </p>
              </div>
            )}
          </div>
        )}
        {!own && (
          <ul className="tt-cardnotes">
            <li><span>The class</span> · the two strongest traits from different families, matched to an archetype signature</li>
            <li><span>The stats</span> · points × node weights, normalized 0 to 100 · the same rules score every tree, this one included</li>
            <li><span>On the build route</span> · Save image at 1200 × 630 · Copy link · Copy receipt</li>
          </ul>
        )}
        </div>
      </div>
    </details>
  );
};
