// ============================================
// TalentTreePage — /talent-tree
// A playable offshoot of the portfolio. The intro says why the page exists,
// the intake turns three answers into two pools of points, the board spends
// them across three trees, and the result names the class the points add up
// to. Everything shown is computed by src/data/talent; this file holds the
// page state and the copy the brief authored for the intro.
//
// Two rules the whole file is shaped around:
//
// 1. The first client render is Ryan's tree, fully lit, with his result
//    beneath it. That is what the prerender serialises and what a crawler
//    reads. Nothing that could differ per visit (the share state in the URL,
//    the viewport, a stored preference) is read during render; the URL is
//    decoded in an effect after mount, and the tree re-renders from there.
//    A mismatch on this route would break hydration for the whole app (the
//    #418 failure App.tsx documents).
//
// 2. The board's geometry is data (geometry.ts), so nothing is measured and
//    no layout effect writes to the DOM; the SCSS decides the layout.
// ============================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import SectionBadge from './SectionBadge';
import { getHomeHref } from '../utils/homeSession';
import { scrollBehavior } from '../utils/motion';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import type { Allocation, Intake, TalentResult as TalentResultData } from '../data/talent/types';
import { TREES } from '../data/talent/trees';
import { ARCHETYPES } from '../data/talent/archetypes';
import {
  MAX_POINTS_PER_NODE,
  canSpend,
  clampToPools,
  computePools,
  poolsSpent,
  remaining,
  spend,
} from '../data/talent/economy';
import { RYAN_ALLOCATION, RYAN_INTAKE, RYAN_OVERRIDES } from '../data/talent/ryan';
import { buildResult, decodeState, encodeState } from '../data/talent/score';
import Glyph from './talent/Glyph';
import TalentIntake from './talent/TalentIntake';
import TalentBoard from './talent/TalentBoard';
import TalentResult from './talent/TalentResult';
import type { CopyState } from './talent/TalentResult';
import { LEVEL_ALPHA } from './talent/cardData';
import '../styles/styles.scss';

// ── State ────────────────────────────────────────────────────────────────────

type Mode = 'ryan' | 'own';

const OWN_DEFAULT_INTAKE: Intake = {
  name: '',
  degree: 'bachelors',
  major: 'graphic',
  minor: 'none',
  years: 5,
  hours: 0,
};

const RYAN_STATE = encodeState(RYAN_INTAKE, RYAN_ALLOCATION);
const RYAN_POOLS = computePools(RYAN_INTAKE);
const RYAN_RESULT = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
const RYAN_CLASS = `${RYAN_RESULT.primary.name} / ${RYAN_RESULT.secondary.name}`;
const SHARE_PARAM = 't';
const ROUTE = '/talent-tree/';

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v))) : 0;
}

// ── Intro miniature ──────────────────────────────────────────────────────────
// Ryan's tree in miniature on the intro card (Intro.dc.html): three trees,
// 368 × 132, fixed geometry. Always Ryan's, whatever the page state, because
// it is part of the introduction rather than the board.

const MINI_ROOT_X = [62, 184, 306];
const MINI_F = [-44, -22, 0, 22, 44];
const MINI_C = [-52, -26, 0, 26, 52];

const IntroMini: React.FC = () => (
  <svg className="tt-intro__mini-svg" viewBox="0 0 368 132" aria-hidden="true" focusable="false">
    <defs>
      <filter id="tt-glow-mini" x="-70%" y="-70%" width="240%" height="240%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feComponentTransfer in="blur" result="soft">
          <feFuncA type="linear" slope="0.6" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="soft" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {TREES.map((tree, t) => {
      const rx = MINI_ROOT_X[t];
      return (
        <g key={tree.id}>
          {tree.areas.map((area, i) => {
            const fx = rx + MINI_F[i];
            const cx = rx + MINI_C[i];
            const fl = pointsAt(RYAN_ALLOCATION, area.nodes[0].id);
            const cl = fl >= 3 ? pointsAt(RYAN_ALLOCATION, area.nodes[1].id) : 0;
            return (
              <g key={area.id}>
                <path
                  d={`M${rx} 118 C${rx} 100, ${fx} 98, ${fx} 80`}
                  fill="none"
                  stroke={fl > 0 ? '#f03d01' : 'rgba(255,255,255,0.12)'}
                  strokeOpacity={fl > 0 ? LEVEL_ALPHA[fl] : 1}
                  strokeWidth={fl > 0 ? 1.2 : 1}
                />
                <path
                  d={`M${fx} 80 L${cx} 30`}
                  fill="none"
                  stroke={cl > 0 ? '#f03d01' : 'rgba(255,255,255,0.12)'}
                  strokeOpacity={cl > 0 ? LEVEL_ALPHA[cl] : 1}
                  strokeWidth={cl > 0 ? 1.2 : 1}
                />
                {fl >= MAX_POINTS_PER_NODE ? (
                  <g filter="url(#tt-glow-mini)"><circle cx={fx} cy="80" r="5" fill="#f03d01" /></g>
                ) : (
                  <circle
                    cx={fx}
                    cy="80"
                    r="5"
                    fill={fl > 0 ? '#f03d01' : '#1b1b1b'}
                    fillOpacity={fl > 0 ? LEVEL_ALPHA[fl] : 1}
                    stroke={fl > 0 ? 'none' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="1"
                  />
                )}
                {cl >= MAX_POINTS_PER_NODE ? (
                  <g filter="url(#tt-glow-mini)"><circle cx={cx} cy="30" r="4.5" fill="#f03d01" /></g>
                ) : (
                  <circle
                    cx={cx}
                    cy="30"
                    r="4.5"
                    fill={cl > 0 ? '#f03d01' : '#1b1b1b'}
                    fillOpacity={cl > 0 ? LEVEL_ALPHA[cl] : 1}
                    stroke={cl > 0 ? 'none' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="1"
                    strokeDasharray={fl < 3 ? '2 2' : undefined}
                  />
                )}
              </g>
            );
          })}
          <circle cx={rx} cy="118" r="5.5" fill="#1b1b1b" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </g>
      );
    })}
  </svg>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const TalentTreePage: React.FC = () => {
  usePageMeta({
    title: 'Talent tree — Ryan DeBoer',
    description:
      'I spent years putting points into my craft and could not name the class. So I built a talent tree. Spend yours and see where the time went.',
    canonical: `${SITE.portfolioUrl}${ROUTE}`,
    ogType: 'website',
  });

  const [mode, setMode] = useState<Mode>('ryan');
  const [intake, setIntake] = useState<Intake>(RYAN_INTAKE);
  const [allocation, setAllocation] = useState<Allocation>(RYAN_ALLOCATION);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  // True once the visitor has changed anything, so the URL is only ever
  // written in response to them and never on the first render.
  const interacted = useRef(false);
  // A scroll that has to wait for a render (the result mounting, a mode
  // change re-laying the board): the id to reach, plus a tick so the effect
  // runs even when nothing else changed.
  const pendingScroll = useRef<string | null>(null);
  const [scrollTick, setScrollTick] = useState(0);

  const [introRef, introVisible] = useReveal<HTMLElement>(0.2);
  const [intakeRef, intakeVisible] = useReveal<HTMLElement>(0.15);
  const [boardRef, boardVisible] = useReveal<HTMLElement>(0.1);
  const [resultRef, resultVisible] = useReveal<HTMLElement>(0.1);

  const isRyan = mode === 'ryan';
  const pools = useMemo(() => computePools(intake), [intake]);
  const spent = useMemo(() => poolsSpent(allocation), [allocation]);
  // What is left in each part of the pools: the craft pool's locked shares
  // (a design degree or minor), its free share, and core. The header counts
  // each one down.
  const left = useMemo(() => remaining(allocation, pools, TREES), [allocation, pools]);
  const unspent = left.craftLocked + left.systemsLocked + left.free + left.core;
  const anySpent = spent.craft + spent.core > 0;
  const showResult = isRyan || revealed || (unspent === 0 && anySpent);

  const result: TalentResultData = useMemo(
    () => buildResult(intake, allocation, TREES, ARCHETYPES, isRyan ? RYAN_OVERRIDES : undefined),
    [intake, allocation, isRyan],
  );

  const perTree = useMemo(() => {
    const out: Record<string, { spent: number; mastered: number }> = {};
    TREES.forEach((tree) => {
      let s = 0;
      let m = 0;
      tree.areas.forEach((a) => a.nodes.forEach((n) => {
        const p = pointsAt(allocation, n.id);
        s += p;
        if (p >= MAX_POINTS_PER_NODE) m += 1;
      }));
      out[tree.id] = { spent: s, mastered: m };
    });
    return out;
  }, [allocation]);

  const shareUrl = `${SITE.portfolioUrl}${ROUTE}?${SHARE_PARAM}=${encodeState(intake, allocation)}`;

  // ── Share state: read after mount, write after interaction ──────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(SHARE_PARAM);
    if (!raw) return;
    const decoded = decodeState(raw);
    if (!decoded) return;
    if (encodeState(decoded.intake, decoded.allocation) === RYAN_STATE) return;
    interacted.current = true;
    setMode('own');
    setIntake(decoded.intake);
    setAllocation(decoded.allocation);
    setRevealed(true);
  }, []);

  useEffect(() => {
    if (!interacted.current) return;
    const url = new URL(window.location.href);
    if (isRyan) {
      if (!url.searchParams.has(SHARE_PARAM)) return;
      url.searchParams.delete(SHARE_PARAM);
    } else {
      url.searchParams.set(SHARE_PARAM, encodeState(intake, allocation));
    }
    window.history.replaceState(window.history.state, '', url.toString());
  }, [isRyan, intake, allocation]);

  // ── Scrolling ───────────────────────────────────────────────────────────
  const scrollTo = useCallback((id: string, focus = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    if (focus) {
      const heading = el.querySelector<HTMLElement>('[data-tt-focus]');
      heading?.focus({ preventScroll: true });
    }
  }, []);

  const requestScroll = useCallback((id: string) => {
    pendingScroll.current = id;
    setScrollTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!scrollTick) return;
    const id = pendingScroll.current;
    if (!id || (id === 'tt-result' && !showResult)) return;
    pendingScroll.current = null;
    window.requestAnimationFrame(() => scrollTo(id, true));
  }, [scrollTick, showResult, scrollTo]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const startOwn = useCallback(() => {
    interacted.current = true;
    setMode('own');
    setIntake(OWN_DEFAULT_INTAKE);
    setAllocation({});
    setRevealed(false);
    setCopyState('idle');
    requestScroll('tt-intake');
  }, [requestScroll]);

  const seeRyan = useCallback(() => {
    interacted.current = true;
    setMode('ryan');
    setIntake(RYAN_INTAKE);
    setAllocation(RYAN_ALLOCATION);
    setRevealed(false);
    setCopyState('idle');
    requestScroll('tt-board');
  }, [requestScroll]);

  const viewRyanTree = useCallback(() => {
    if (isRyan) scrollTo('tt-board', true);
    else seeRyan();
  }, [isRyan, scrollTo, seeRyan]);

  // An answer changed after points were spent can shrink a pool or move a
  // lock from one tree to the other; clampToPools takes off exactly the
  // overdraw so every addition stays payable.
  const changeIntake = useCallback((patch: Partial<Intake>) => {
    interacted.current = true;
    const next: Intake = { ...intake, ...patch };
    // The minor cannot repeat the major; a major that lands on the current
    // minor clears it.
    if (next.minor !== 'none' && next.minor === next.major) next.minor = 'none';
    if (next.split === undefined) delete next.split;
    setIntake(next);
    setAllocation((alloc) => clampToPools(alloc, computePools(next), TREES));
  }, [intake]);

  const canAdd = useCallback(
    (nodeId: string) => canSpend(allocation, nodeId, TREES, pools),
    [allocation, pools],
  );

  const addPoint = useCallback((nodeId: string) => {
    if (isRyan) return;
    interacted.current = true;
    setAllocation((cur) => (canSpend(cur, nodeId, TREES, pools) ? spend(cur, nodeId, 1, pools, TREES) : cur));
  }, [isRyan, pools]);

  const removePoint = useCallback((nodeId: string) => {
    if (isRyan) return;
    interacted.current = true;
    setAllocation((cur) => spend(cur, nodeId, -1));
  }, [isRyan]);

  const getClass = useCallback(() => {
    if (!anySpent) return;
    setRevealed(true);
    requestScroll('tt-result');
  }, [anySpent, requestScroll]);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const mod = await import('./talent/cardImage');
      await mod.downloadCard(result);
    } catch {
      // The canvas or the download was refused; nothing to recover, the card is still on screen.
    } finally {
      setSaving(false);
    }
  }, [result, saving]);

  const copy = useCallback(async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('no clipboard');
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2400);
    } catch {
      setCopyState('failed');
    }
  }, [shareUrl]);

  // ── Header strings ──────────────────────────────────────────────────────
  const ownerName = isRyan ? 'Ryan' : (intake.name || '').trim();
  const boardTitle = isRyan ? "Ryan's tree" : ownerName ? `${ownerName}'s tree` : 'Your tree';
  const classTitle = `${result.primary.name} / ${result.secondary.name}`;

  return (
    <article className="tt">
      <nav className="tt__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="tt__nav-logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="tt__nav-back">&larr; Back to Home</Link>
      </nav>

      {/* ── 00 · Intro ────────────────────────────────────────────────────── */}
      <section
        id="tt-intro"
        className={`tt__section tt-intro${introVisible ? ' is-visible' : ''}`}
        ref={introRef}
        aria-labelledby="tt-intro-title"
      >
        <div className="tt__container">
          <SectionBadge icon={<Glyph name="branch" size={24} />} label="Talent tree" index="00" />
          <div className="tt-intro__card reveal-fade">
            <div className="tt-intro__text">
              <p className="tt-eyebrow">A playable offshoot of the portfolio · three trees · 30 nodes</p>
              <h1 className="tt-intro__title" id="tt-intro-title">
                I've spent a lot of time trying to figure out what to call myself.
              </h1>
              <div className="tt-intro__body">
                <p className="tt-intro__lead">Product Designer? Design Engineer? UX Engineer? Systems Designer?</p>
                <p>
                  The more job descriptions I read, the more obvious it became that the titles themselves
                  don't really have a shared definition.
                </p>
                <p>So instead of picking one, I built a talent tree.</p>
                <p>
                  See where you've been putting points into your craft and discover the weird little design
                  class you've become.
                </p>
              </div>
              <div className="tt-intro__actions">
                <button type="button" className="btn btn--primary btn--lg" onClick={startOwn}>
                  Build your talent tree
                </button>
                <button type="button" className="btn btn--secondary btn--lg" onClick={viewRyanTree}>
                  View Ryan's tree
                </button>
              </div>
            </div>
            <div className="tt-intro__aside">
              <div className="tt-intro__mini">
                <div className="tt-intro__mini-head">
                  <span className="tt-intro__mini-layer">
                    <span className="tt-intro__mini-key">layer</span>
                    <span>{" / Ryan's tree"}</span>
                  </span>
                  <span className="tt-intro__mini-meta">
                    {`LV ${RYAN_POOLS.level} · ${RYAN_POOLS.craft} CRAFT · ${RYAN_POOLS.core} CORE`}
                  </span>
                </div>
                <IntroMini />
                <div className="tt-intro__mini-foot">
                  <span className="tt-intro__mini-trees">{TREES.map((t) => t.name).join(' · ')}</span>
                  <span className="tt-intro__mini-class">{RYAN_CLASS}</span>
                </div>
              </div>
              <p className="tt-intro__hook" aria-hidden="true">
                You've spent years putting points into your craft. Where did they end up? Build your design class →
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 · Intake ───────────────────────────────────────────────────── */}
      <section
        id="tt-intake"
        className={`tt__section${intakeVisible ? ' is-visible' : ''}`}
        ref={intakeRef}
        aria-labelledby="tt-intake-title"
      >
        <div className="tt__container">
          <SectionBadge icon={<Glyph name="sliders" size={24} />} label="Intake" index="01" />
          <div className="tt-intake__frame reveal-fade">
            <TalentIntake
              intake={intake}
              pools={pools}
              editable={!isRyan}
              onChange={changeIntake}
              onSpend={() => scrollTo('tt-board', true)}
              onBuildOwn={startOwn}
            />
          </div>
        </div>
      </section>

      {/* ── 02 · The board ────────────────────────────────────────────────── */}
      <section
        id="tt-board"
        className={`tt__section tt-board${boardVisible ? ' is-visible' : ''}`}
        ref={boardRef}
        aria-labelledby="tt-board-title"
      >
        <div className="tt__container">
          <SectionBadge
            icon={<Glyph name="branch" size={24} />}
            label={isRyan ? "Ryan's tree" : 'Your tree'}
            index="02"
            tone={isRyan ? undefined : 'accent'}
          />
          <div className="tt-board__head reveal-fade">
            <div className="tt-board__heading">
              <h2 className="tt-board__title" id="tt-board-title" data-tt-focus tabIndex={-1}>
                {boardTitle}
              </h2>
              <p className="tt-board__meta">
                <span className="tt-board__meta-item">{`Level ${pools.level} Designer`}</span>
                <span className="tt-board__meta-dot" aria-hidden="true">·</span>
                <span className="tt-board__meta-item tt-board__meta-item--pools" aria-live="polite">
                  {`${spent.craft} / ${pools.craft} craft · ${spent.core} / ${pools.core} core`}
                </span>
                {showResult && (
                  <>
                    <span className="tt-board__meta-dot" aria-hidden="true">·</span>
                    <span className="tt-board__meta-item">{classTitle}</span>
                  </>
                )}
              </p>
            </div>
            <div className="tt-board__actions">
              {isRyan ? (
                <button type="button" className="btn btn--secondary btn--lg" onClick={startOwn}>
                  Build your own
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn--secondary btn--lg" onClick={seeRyan}>
                    See Ryan's tree
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    onClick={getClass}
                    aria-disabled={!anySpent || undefined}
                    title={anySpent ? undefined : 'Spend at least one point first'}
                  >
                    {revealed ? 'See my class ↓' : 'Get my class'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="tt-board__panel reveal-fade">
            <TalentBoard
              allocation={allocation}
              pools={pools}
              left={left}
              editable={!isRyan}
              onAdd={addPoint}
              onRemove={removePoint}
              canAdd={canAdd}
              perTree={perTree}
              unspent={unspent}
            />
          </div>
        </div>
      </section>

      {/* ── 03 · Result ───────────────────────────────────────────────────── */}
      {showResult && (
        <section
          id="tt-result"
          className={`tt__section${resultVisible ? ' is-visible' : ''}`}
          ref={resultRef}
          aria-labelledby="tt-result-title"
        >
          <div className="tt__container">
            <SectionBadge icon={<Glyph name="decision" size={24} />} label="Result" index="03" />
            <div className="reveal-fade">
              <TalentResult
                result={result}
                pools={pools}
                isRyan={isRyan}
                shareUrl={shareUrl}
                saving={saving}
                onSave={save}
                copyState={copyState}
                onCopy={copy}
                onSeeRyan={viewRyanTree}
              />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </article>
  );
};

export default TalentTreePage;
