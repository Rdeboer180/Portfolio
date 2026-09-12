// ============================================
// Talent tree: the summary sheet, on paper
// The console ends after its legend; what the points add up to is read on
// a sheet of Cool Paper pulled up over the console's bottom edge, the way a
// print comes out of the tray. Everything on it is computed from the
// allocation: the eyebrow's counts, the masteries as a two-column row list
// with its footer line, the dark character card (unchanged, in a white
// inset panel) with the two archetype rows and the "comes from" sentence
// beside it, and the foot with the one primary action per route.
//
// In build mode before the intake is answered the sheet is the eyebrow and
// one line; once points land the masteries fill in as they reach five and
// the card assembles at the end (or on "Finish with points left"), with the
// assembling motion, the compare switch, and the share actions as before.
//
// Pure from the props: nothing here is measured or read from the window, so
// the prerendered sheet and the first client render agree.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import type { Allocation, TalentResult, TalentTree } from '../../data/talent/types';
import type { AbilityState } from '../../data/talent/types';
import { FAMILY_LABEL, TRAIT_LABEL } from '../../data/talent/types';
import { formulaLine } from '../../data/talent/forge';
import { RYAN_CLASS_LABEL } from '../../data/talent/ryan';
import { getProjectsHref } from '../../utils/homeSession';
import Glyph from './Glyph';
import TalentCard from './TalentCard';
import { cardData, explainArchetype, leadTrait } from './cardData';
import { abilityGlyph, chipStates } from './TalentForge';
import { countWord, masteredNodes } from './consoleData';

export type CopyState = 'idle' | 'copied' | 'failed';

export interface TalentSummaryProps {
  own: boolean;
  /** Build mode with the intake answered (always true on the front door). */
  live: boolean;
  /** The card is on the sheet: the front door, or the build route once the points are spent or finished. */
  showCard: boolean;
  allocation: Allocation;
  trees: TalentTree[];
  result: TalentResult;
  /** Points in play: the whole pool. */
  points: number;
  /** Set once on the client after the card comes into view: runs the assembling motion. */
  assembled: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  frontRoute: string;
  buildRoute: string;
  name?: string;
  onName?: (name: string) => void;
  saving?: boolean;
  onSave?: () => void;
  linkState?: CopyState;
  onCopyLink?: () => void;
  receiptState?: CopyState;
  onCopyReceipt?: () => void;
  shareUrl?: string;
  compare?: boolean;
  onCompare?: (on: boolean) => void;
  /** Build mode: the foot's primary spends the rest or saves, and the quiet reset. */
  anySpent?: boolean;
  onFinish?: () => void;
  onResetAll?: () => void;
}

const Arrow: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

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

function plural(n: number, one: string, many: string): string {
  return `${countWord(n)} ${n === 1 ? one : many}`;
}

/** "six foundations and one crown", either half dropped at zero. */
export function tierLine(foundations: number, crowns: number): string {
  const parts: string[] = [];
  if (foundations > 0) parts.push(plural(foundations, 'foundation', 'foundations'));
  if (crowns > 0) parts.push(plural(crowns, 'crown', 'crowns'));
  return parts.join(' and ');
}

const TalentSummary: React.FC<TalentSummaryProps> = ({
  own, live, showCard, allocation, trees, result, points, assembled, cardRef, frontRoute, buildRoute,
  name, onName, saving, onSave, linkState, onCopyLink, receiptState, onCopyReceipt, shareUrl, compare, onCompare,
  anySpent, onFinish, onResetAll,
}) => {
  const rows = masteredNodes(allocation, trees);
  const n = rows.length;
  const nodeCount = trees.reduce((acc, t) => acc + t.areas.length * 2, 0);
  const foundations = rows.filter((r) => r.node.tier === 'foundation').length;
  const crowns = n - foundations;
  const half = Math.ceil(n / 2);
  const columns = [rows.slice(0, half), rows.slice(half)];

  const states = result.abilities;
  const unlockedStates = states.filter((a) => a.unlocked);
  const nextStates = chipStates(states).filter((c) => c.kind !== 'unlocked').slice(0, 2);
  const abilityColumns: AbilityState[][] = [
    unlockedStates.slice(0, Math.ceil(unlockedStates.length / 2)),
    unlockedStates.slice(Math.ceil(unlockedStates.length / 2)),
  ];

  const counts = [plural(unlockedStates.length, 'ability', 'abilities'), plural(n, 'mastery', 'masteries')];
  if (showCard) {
    counts.push(plural(result.topTraits.length, 'stat', 'stats'));
    counts.push('nothing hand-set');
  }

  const classes = [
    { a: result.primary, trait: leadTrait(result.primary), state: states.find((x) => x.ability.archetypeId === result.primary.id) },
    { a: result.secondary, trait: leadTrait(result.secondary), state: states.find((x) => x.ability.archetypeId === result.secondary.id) },
  ];

  const primaryLabel = showCard ? (saving ? 'Rendering' : 'Save as image') : 'Finish with points left';

  const masteryRow = ({ node, tree }: (typeof rows)[number]) => (
    <li key={node.id} className="tt-masteries__row">
      <span className="tt-masteries__glyph" aria-hidden="true"><Glyph name={node.glyph} size={20} /></span>
      <span className="tt-masteries__text">
        <span className="tt-masteries__name">{node.name}</span>
        <span className="tt-masteries__meaning">{node.masteryLine}</span>
      </span>
      <span className="tt-masteries__meta">{`${tree.name} · ${node.tier}`}</span>
    </li>
  );

  return (
    <section className="tt-summary" aria-label="Summary">
      <div className="tt-summary__eyebrow">
        <span className="tt-summary__key">
          <span className="tt-summary__square" aria-hidden="true" />
          {live ? `Summary · computed from ${points} points` : 'Summary · computed from your points'}
        </span>
        {live && <span className="tt-summary__counts">{counts.join(' · ')}</span>}
      </div>

      {!live ? (
        <p className="tt-summary__pending">Your summary assembles when the last point lands</p>
      ) : (
        <>
          {/* ── Abilities ─────────────────────────────────────────────────── */}
          <p className="tt-sheet-eyebrow">
            {`Abilities · ${unlockedStates.length} unlocked of ${states.length} · the top two are the class`}
          </p>
          <div className="tt-abilities">
            {abilityColumns.map((col, ci) => (
              <ul key={ci} className="tt-abilities__col">
                {col.map((a) => (
                  <li key={a.ability.id} className="tt-abilities__row">
                    <span className="tt-abilities__glyph" aria-hidden="true"><Glyph name={abilityGlyph(a)} size={20} /></span>
                    <span className="tt-abilities__text">
                      <span className="tt-abilities__head">
                        <span className="tt-abilities__name">{a.ability.name}</span>
                        <span className="tt-abilities__meta">{`${a.ability.family} · unlocked`}</span>
                      </span>
                      <span className="tt-abilities__formula">{formulaLine(a.ability)}</span>
                      <span className="tt-abilities__line">{a.ability.line}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ))}
            <ul className="tt-abilities__col tt-abilities__col--next">
              {nextStates.map(({ state: a, kind }) => (
                <li key={a.ability.id} className="tt-abilities__row is-next">
                  <span className="tt-abilities__glyph" aria-hidden="true"><Glyph name={abilityGlyph(a)} size={20} /></span>
                  <span className="tt-abilities__text">
                    <span className="tt-abilities__head">
                      <span className="tt-abilities__name">{a.ability.name}</span>
                      <span className="tt-abilities__meta">
                        {kind === 'next'
                          ? `${a.ability.family} · next · ${a.missing} ${a.missing === 1 ? 'point' : 'points'} away`
                          : `${a.ability.family} · next`}
                      </span>
                    </span>
                    <span className="tt-abilities__formula">{formulaLine(a.ability)}</span>
                    {kind === 'next' && <span className="tt-abilities__line">{a.ability.line}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Masteries ─────────────────────────────────────────────────── */}
          <p className="tt-sheet-eyebrow">
            {n === 0 ? 'Masteries · none yet' : `Masteries · ${plural(n, 'node', 'nodes')} at 5 / 5`}
          </p>
          <div className="tt-masteries" aria-label="Masteries">
            {n === 0 ? (
              <p className="tt-masteries__empty">
                {own
                  ? 'Five points in one node is a mastery. The first one prints here.'
                  : 'No node holds five points.'}
              </p>
            ) : (
              columns.map((col, ci) => (
                <ul key={ci} className="tt-masteries__col">
                  {col.map(masteryRow)}
                  {ci === columns.length - 1 && (
                    <li className="tt-masteries__foot">
                      <span className="tt-masteries__foot-key">{`${n} of ${nodeCount} nodes`}</span>
                      {` · ${tierLine(foundations, crowns)} · earned by time, not self-rated`}
                    </li>
                  )}
                </ul>
              ))
            )}
          </div>

          {/* ── The card ──────────────────────────────────────────────────── */}
          {showCard ? (
            <div className="tt-summary__cardrow">
              <div ref={cardRef} className={`tt-cardpanel${assembled ? ' is-assembled' : ''}`}>
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
                {result.provisional && (
                  <p className="tt-cardprov">Provisional · unlock two abilities to earn it</p>
                )}
                <div className="tt-cardframe">
                  <TalentCard data={cardData(result)} />
                </div>
              </div>
              <div className="tt-cardside">
                {!own && <p className="tt-cardside__note" aria-hidden="true">the part people screenshot</p>}
                <ul className="tt-classes">
                  {classes.map(({ a, trait, state }) => (
                    <li key={a.id} className="tt-classes__row">
                      <span className="tt-classes__name">{a.name}</span>
                      <span className="tt-classes__family">
                        {state && state.unlocked
                          ? `${FAMILY_LABEL[a.family]} · unlocked by recipe · strength ${state.strength}`
                          : `${FAMILY_LABEL[a.family]} · led by ${TRAIT_LABEL[trait]} ${result.traits[trait]}`}
                      </span>
                      <span className="tt-classes__line">{a.line}</span>
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
                    <li><span>The class</span> · the two strongest unlocked abilities from different families · strength is level over minimum, summed</li>
                    <li><span>The stats</span> · points × node weights, normalized 0 to 100 · the same rules score every lane</li>
                    <li><span>On the build route</span> · save image at 1200 × 630 · copy link · copy receipt with an abilities line</li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <p className="tt-summary__pending">The card assembles when the last point lands · or finish with the points left</p>
          )}
        </>
      )}

      {/* ── The foot ──────────────────────────────────────────────────────── */}
      <div className="tt-summary__foot">
        {own ? (
          <>
            <button
              type="button"
              className="tt-primary"
              onClick={showCard ? onSave : onFinish}
              aria-disabled={(!showCard && (!live || !anySpent)) || undefined}
              disabled={showCard && saving}
            >
              {primaryLabel}
            </button>
            <p className="tt-summary__line">
              <button type="button" className="tt-summary__reset" onClick={onResetAll} disabled={!anySpent}>Reset all</button>
              <span>{' · Free, never confirmed · State lives in the link · #s= one digit per node · Nothing is stored'}</span>
            </p>
            <Link to={frontRoute} className="tt-summary__quiet">{"See Ryan's tree"}<Arrow size={14} /></Link>
          </>
        ) : (
          <>
            <Link to={buildRoute} className="tt-primary">Build your own<Arrow /></Link>
            <p className="tt-summary__line">Three questions, then the fun · Your tree gets its own address at /talent-tree/build/ · Nothing is stored</p>
            <Link to={getProjectsHref()} className="tt-summary__quiet">{"Explore Ryan's work"}<Arrow size={14} /></Link>
          </>
        )}
      </div>
    </section>
  );
};

export default TalentSummary;
