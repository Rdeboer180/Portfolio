import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RYAN_ALLOCATION, RYAN_CLASS_LABEL, RYAN_CLASS_SHORT, RYAN_INTAKE } from '../data/talent/ryan';
import { treeOf } from '../data/talent/trees';
import { TALENT_SOURCES } from '../data/talent/provenance';
import { ClassLabel } from './talent/ClassName';
import Glyph from './talent/Glyph';

// ============================================
// The skill tree on the homepage, as paper (canvas P1, 10 Nov 2026), under
// the class's emblem. Each lane shows its top talents as rings; each ring
// opens a card that traces where its points came from, as a short thread of
// sources (provenance.ts) drawn in the career rule's language: a steel mark
// per source, the newest in ink.
//
// A source with a page of its own is a link (canvas N6), so a 5 of 5 is one
// click from its proof. Because it holds links, the card is a disclosure,
// not a tooltip: the button says whether it is open and what it controls.
//
// The card follows WCAG 1.4.13 and the toggletip pattern:
//  - hover waits 200ms, then neighbours open at once while the pointer moves
//    along a lane (a 400ms warm window), so scanning never stutters;
//  - the card sits inside the talent, so the pointer can move onto it;
//  - focus opens it, Tab walks into its links, Escape closes it, and it
//    stays until hover or focus leaves the talent;
//  - a tap or click pins it, for touch, until a second tap, Escape, or a tap
//    elsewhere (a tap on one of its links follows the link).
// The sources are also the button's description, so a screen reader reads
// them with the talent. Every number is read from RYAN_ALLOCATION and the trees.
// ============================================

const points = (id: string) => RYAN_ALLOCATION[id] || 0;
const TOTAL = Object.values(RYAN_ALLOCATION).reduce((sum, n) => sum + (n || 0), 0);
/** All points in the tree that holds this talent, not only the four shown. */
const laneTotal = (anchor: string) => {
  const tree = treeOf(anchor)?.id;
  return Object.entries(RYAN_ALLOCATION).reduce((sum, [id, n]) => sum + (treeOf(id)?.id === tree ? n || 0 : 0), 0);
};

const lanes: Array<{ name: string; talents: Array<{ id: string; name: string; directed?: boolean }> }> = [
  { name: 'Design', talents: [
    { id: 'typography', name: 'Typography' }, { id: 'tokens', name: 'Tokens' },
    { id: 'accessibility', name: 'Accessibility' }, { id: 'components', name: 'Components' },
  ] },
  { name: 'Technical', talents: [
    { id: 'figma', name: 'Figma' }, { id: 'prototyping', name: 'Prototyping' },
    { id: 'storybook', name: 'Storybook' }, { id: 'skills-and-plugins', name: 'Skills and plugins' },
  ] },
  { name: 'Code', talents: [
    { id: 'html', name: 'HTML' }, { id: 'git', name: 'Git' },
    { id: 'react', name: 'React' }, { id: 'typescript', name: 'TypeScript', directed: true },
  ] },
];

const OPEN_DELAY = 200;
const WARM_WINDOW = 400;
const GRACE = 140;
const RING = 2 * Math.PI * 19;

const Ring: React.FC<{ value: number; directed?: boolean }> = ({ value, directed }) => {
  const tone = directed ? 'directed' : value >= 5 ? 'max' : 'on';
  return (
    <svg className={`sm__ring sm__ring--${tone}`} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle className="sm__ring-track" cx="24" cy="24" r="19" />
      <circle className="sm__ring-fill" cx="24" cy="24" r="19" strokeDasharray={`${(RING * value) / 5} ${RING}`} transform="rotate(-90 24 24)" />
      <circle className="sm__ring-core" cx="24" cy="24" r={value >= 5 ? 6 : 5} />
    </svg>
  );
};

const SkillMastery: React.FC = () => {
  const uid = useId();
  const [open, setOpen] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastClose = useRef(0);

  const close = useCallback(() => {
    clearTimeout(openTimer.current);
    setOpen((cur) => { if (cur) lastClose.current = Date.now(); return null; });
    setPinned(false);
  }, []);

  // Escape closes. While pinned, a tap or click anywhere but the talent's own
  // button closes too: the card counts as outside, because on a phone it
  // covers the lane below and would swallow taps meant for those talents.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    const onDown = (event: PointerEvent) => {
      if (pinned && !(event.target as Element).closest?.(`[data-talent="${open}"] > button, [data-talent="${open}"] a`)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open, pinned, close]);

  useEffect(() => () => clearTimeout(openTimer.current), []);

  // One timer decides what the pointer means. Back onto the open talent (or
  // its card): keep it. Onto a neighbour while a card is open: switch after a
  // short grace, so a diagonal path up to the card never hands it to the
  // talent it crosses. Off everything: close after the same grace.
  const hoverIn = (id: string, event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || pinned) return;
    clearTimeout(openTimer.current);
    if (open === id) return;
    if (open !== null) openTimer.current = setTimeout(() => setOpen(id), GRACE);
    else if (Date.now() - lastClose.current < WARM_WINDOW) setOpen(id);
    else openTimer.current = setTimeout(() => setOpen(id), OPEN_DELAY);
  };

  const hoverOut = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || pinned) return;
    // A card the keyboard opened stays while its button holds focus.
    if (event.currentTarget.querySelector('.sm__talent-btn:focus-visible')) return;
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(close, GRACE);
  };

  return (
    <section id="mastery" className="sm sm--paper" aria-labelledby="capabilities-title">
      <div className="sm__container">
        <div className="sm__head">
          <div className="sm__head-copy">
            <p className="sm__class">
              <span className="sm__class-mark" aria-hidden="true"><Glyph name="branch" size={26} /></span>
              <span className="sm__class-name">
                <ClassLabel primary={RYAN_CLASS_SHORT} secondary={RYAN_CLASS_LABEL.slice(RYAN_CLASS_SHORT.length + 3)} linkClassName="sm__class-link" />
              </span>
            </p>
            <h2 id="capabilities-title" className="sm__title">Where {RYAN_INTAKE.years} years of practice went</h2>
            <p className="sm__sub">{TOTAL} points: four a year, plus my degree and the hours outside work.</p>
          </div>
          <Link to="/talent-tree/" className="sm__explore">See my skill tree <span aria-hidden="true">→</span></Link>
        </div>
        <div className="sm__lanes-grid">
          {lanes.map((lane) => (
            <div className="sm__lane" key={lane.name}>
              <p className="sm__lane-name">{lane.name} · {laneTotal(lane.talents[0].id)}</p>
              <ul aria-label={`${lane.name} talents`}>
                {lane.talents.map((t, index) => {
                  const value = points(t.id);
                  const sources = TALENT_SOURCES[t.id] ?? [];
                  const cardId = `${uid}-${t.id}`;
                  const isOpen = open === t.id;
                  const align = index === 0 ? 'start' : index === lane.talents.length - 1 ? 'end' : 'center';
                  return (
                    <li
                      key={t.id}
                      className={`sm__talent${isOpen ? ' is-open' : ''}`}
                      data-talent={t.id}
                      onPointerEnter={(event) => hoverIn(t.id, event)}
                      onPointerLeave={hoverOut}
                      // Focus leaving the talent (its button or the card's links) closes it.
                      onBlur={(event) => {
                        // only the open talent closes its own card; focus leaving another talent is not its business
                        if (pinned || !isOpen) return;
                        const item = event.currentTarget;
                        // A click on the talent's own card blurs the button with nowhere to go: keep it.
                        if (!event.relatedTarget && item.matches(':hover')) return;
                        if (!item.contains(event.relatedTarget as Node)) close();
                      }}
                    >
                      <button
                        type="button"
                        className="sm__talent-btn"
                        aria-describedby={sources.length ? cardId : undefined}
                        aria-expanded={sources.length ? isOpen : undefined}
                        aria-controls={sources.length ? `${cardId}-card` : undefined}
                        // Focus moves the card along, pinned or not: a pin
                        // belongs to the talent it was set on.
                        onFocus={() => {
                          if (pinned && isOpen) return;
                          clearTimeout(openTimer.current);
                          setOpen(t.id);
                          setPinned(false);
                        }}
                        onClick={() => {
                          if (pinned && isOpen) { close(); return; }
                          clearTimeout(openTimer.current);
                          setOpen(t.id);
                          setPinned(true);
                        }}
                      >
                        <Ring value={value} directed={t.directed} />
                        <span className="sm__talent-name">{t.name}</span>
                        <span className="sm__talent-score">
                          {value}/5{t.directed ? ' directed' : ''}<span className="sr-only"> points</span>
                        </span>
                      </button>
                      {sources.length > 0 && (
                        <div id={`${cardId}-card`} className={`sm__card sm__card--${align}`} data-open={isOpen || undefined}>
                          <span className="sm__card-head" aria-hidden="true">
                            <span className="sm__card-name">{t.name}</span>
                            <span className={`sm__card-pips${value >= 5 ? ' sm__card-pips--max' : ''}`}>
                              {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= value ? 'is-on' : undefined} />)}
                            </span>
                          </span>
                          {/* The button's description is this part only: the
                              sources, with separators a screen reader can hear. */}
                          <div id={cardId}>
                            <span className="sr-only">Where it came from: </span>
                            <ol className="sm__card-thread">
                              {sources.map((s, i) => (
                                <li key={s.label}>
                                  {s.to
                                    ? <Link to={s.to} className="sm__card-label sm__card-link" onClick={close}>{s.label}<span aria-hidden="true"> →</span></Link>
                                    : <span className="sm__card-label">{s.label}</span>}
                                  <span className="sr-only">, </span>
                                  <span className="sm__card-tag">{s.tag}</span>
                                  {i < sources.length - 1 && <span className="sr-only">; </span>}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillMastery;
