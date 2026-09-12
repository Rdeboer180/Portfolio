// ============================================
// Talent console: the instrument
// One dark panel used by both routes. In ryan mode (/talent-tree/) it is the
// front door: the status rail, the story rail, Ryan's three trees lit, the
// inspector, the legend and rules, the masteries and card drawers, and one
// link out to the build path. In build mode (/talent-tree/build/) the story
// rail becomes the intake strip, the trees start empty and dormant, the
// status rail counts what is unspent, each column can be reset, and the card
// assembles when the last point lands or on "Finish with points left".
//
// Two rules the file is shaped around (see App.tsx on error #418):
//
// 1. The first client render is what the prerender serialised: Ryan's tree
//    on the front door, the empty intake with its defaults on the build
//    route. Nothing that could differ per visit is read during render. The
//    share state in the URL hash is decoded in an effect after mount, the
//    viewport is read in an effect, and the two client-only classes that run
//    the motion (is-cascade, is-assembled) are set in effects and never
//    under reduced motion, so the prerender (which runs reduced) never
//    carries them and no animation plays on the static first paint.
//
// 2. The board's geometry is data (geometry.ts); the SCSS decides the layout
//    and nothing is measured.
//
// Share state lives in the build route's hash as #s=<encodeState>, so the
// canonical stays clean and nginx never sees it. The older ?t= form is still
// decoded for links already shared, and is rewritten to the hash form.
// ============================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../data/site';
import { getProjectsHref } from '../../utils/homeSession';
import { prefersReducedMotion, scrollBehavior } from '../../utils/motion';
import { useReveal } from '../../hooks/useReveal';
import type { Allocation, Intake, TalentNode, TalentTree, TreeId } from '../../data/talent/types';
import { TREES } from '../../data/talent/trees';
import { ARCHETYPES } from '../../data/talent/archetypes';
import {
  CROWN_UNLOCK_AT,
  canSpend,
  clampToPools,
  computePools,
  isLocked,
  remaining,
  spend,
} from '../../data/talent/economy';
import { RYAN_ALLOCATION, RYAN_INTAKE, RYAN_OVERRIDES } from '../../data/talent/ryan';
import { buildResult, decodeState, encodeState } from '../../data/talent/score';
import Glyph from './Glyph';
import TalentNodeButton, { cascadeDelay } from './TalentNodeButton';
import TalentIntakeStrip, {
  ALL_ANSWERED,
  NOTHING_ANSWERED,
  effectiveIntake,
  intakeComplete,
} from './TalentIntakeStrip';
import type { Answered, IntakeQuestion } from './TalentIntakeStrip';
import { InspectorRail, InspectorSheet, Legend } from './TalentInspector';
import type { InspectorNode } from './TalentInspector';
import { CardDrawer, MasteriesDrawer } from './TalentDrawers';
import type { CopyState } from './TalentDrawers';
import { COLUMN, ROW, nodeVars } from './geometry';
import type { LayoutSpec } from './geometry';
import { pointsAt, receiptText, shortTreeName, treeStats } from './consoleData';
import { useMediaQuery } from './useMediaQuery';

export type ConsoleMode = 'ryan' | 'build';

export const FRONT_ROUTE = '/talent-tree/';
export const BUILD_ROUTE = '/talent-tree/build/';
export const HASH_KEY = 's';
export const LEGACY_PARAM = 't';
/** How long the front-door cascade and the card's assembling run, per _talent-tree.scss. */
const CASCADE_MS = 1400;
const ASSEMBLE_MS = 2600;

/** The build route's defaults: what the static HTML carries before anything is answered. */
export const OWN_DEFAULT_INTAKE: Intake = {
  name: '',
  degree: 'bachelors',
  major: 'graphic',
  minor: 'none',
  years: 5,
  hours: 0,
};

export const STORY = [
  "I've never been sure what to call myself.",
  'Product Designer, Design Engineer, UX Engineer, Systems Designer: the job descriptions overlap and none of them agree on what the title means.',
  'So instead of picking one, I built a talent tree and put sixteen years of points where they actually went.',
  "Here's where my strengths lie.",
].join(' ');

/** "/talent-tree/build/#s=..." for a state. */
export function buildShareUrl(intake: Intake, allocation: Allocation): string {
  return `${SITE.portfolioUrl}${BUILD_ROUTE}#${HASH_KEY}=${encodeState(intake, allocation)}`;
}

/** The state carried by a location: the hash form first, then the older ?t= form. */
export function readShareState(search: string, hash: string): { raw: string; legacy: boolean } | null {
  const h = hash.startsWith('#') ? hash.slice(1) : hash;
  const hashParams = new URLSearchParams(h);
  const fromHash = hashParams.get(HASH_KEY);
  if (fromHash) return { raw: fromHash, legacy: false };
  const fromQuery = new URLSearchParams(search).get(LEGACY_PARAM);
  if (fromQuery) return { raw: fromQuery, legacy: true };
  return null;
}

// ── Wires ────────────────────────────────────────────────────────────────────

/** The lit level a wire takes: the node it leads to, 0 when that node is locked. */
function wireLevel(allocation: Allocation, node: TalentNode): number {
  return isLocked(allocation, node.id) ? 0 : pointsAt(allocation, node.id);
}

const Wires: React.FC<{ tree: TalentTree; treeIndex: number; allocation: Allocation }> = ({ tree, treeIndex, allocation }) => {
  // One entry per path, drawn dimmest first so a brighter branch is never
  // painted under a duller one where two share a stretch. Both layouts are in
  // the markup and the SCSS shows one: the phone's board is its own geometry
  // (318 × 436), not the desktop column squeezed, so the wires cannot be a
  // single stretched svg.
  const levels = tree.areas.map((area, i) => ({
    i,
    key: area.id,
    rootLevel: wireLevel(allocation, area.nodes[0]),
    crownLevel: wireLevel(allocation, area.nodes[1]),
    rootDelay: cascadeDelay('foundation', treeIndex, i),
    crownDelay: cascadeDelay('crown', treeIndex, i),
  }));

  const set = (layout: LayoutSpec) => {
    const paths = levels.reduce<{ key: string; d: string; level: number; delay: number }[]>((acc, b) => {
      acc.push({ key: `${b.key}:root`, d: layout.rootPath(b.i), level: b.rootLevel, delay: b.rootDelay });
      acc.push({ key: `${b.key}:crown`, d: layout.crownPath(b.i), level: b.crownLevel, delay: b.crownDelay });
      return acc;
    }, []);
    paths.sort((a, b) => a.level - b.level);
    return paths;
  };

  const svg = (layout: LayoutSpec, mod: string) => (
    <svg
      className={`tt-wires tt-wires--${mod}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {set(layout).map((p) => (
        <path
          key={p.key}
          className={`tt-wire tt-wire--l${p.level}`}
          d={p.d}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{ '--tt-delay': `${p.delay}ms` } as React.CSSProperties}
        />
      ))}
    </svg>
  );

  return (
    <>
      {svg(COLUMN, 'column')}
      {svg(ROW, 'row')}
    </>
  );
};

// ── The console ──────────────────────────────────────────────────────────────

export interface TalentConsoleProps {
  mode: ConsoleMode;
}

const TalentConsole: React.FC<TalentConsoleProps> = ({ mode }) => {
  const own = mode === 'build';

  // ── State ──────────────────────────────────────────────────────────────
  const [intake, setIntake] = useState<Intake>(own ? OWN_DEFAULT_INTAKE : RYAN_INTAKE);
  const [answered, setAnswered] = useState<Answered>(own ? NOTHING_ANSWERED : ALL_ANSWERED);
  const [allocation, setAllocation] = useState<Allocation>(own ? {} : RYAN_ALLOCATION);
  const [revealed, setRevealed] = useState(false);
  const [calloutDismissed, setCalloutDismissed] = useState(false);
  const [tab, setTab] = useState(0);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linkState, setLinkState] = useState<CopyState>('idle');
  const [receiptState, setReceiptState] = useState<CopyState>('idle');
  const [cascade, setCascade] = useState(false);
  const [assembled, setAssembled] = useState(false);
  const interacted = useRef(false);
  const pinnedEl = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingScroll = useRef(false);
  // True when the static HTML already painted this console revealed (a
  // prerendered load): the lit tree was on screen before the script ran, so
  // the cascade would only blank it and light it again. It plays on a
  // client-side navigation, where the console arrives fresh.
  const paintedLit = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // The card assembles once per result; "Reset all" arms it again.
  const assembledOnce = useRef(false);

  const isPhone = useMediaQuery('(max-width: 767px)');
  const [consoleRef, consoleVisible] = useReveal<HTMLElement>(0.05);

  // ── Derived ────────────────────────────────────────────────────────────
  const effIntake = useMemo(() => (own ? effectiveIntake(intake, answered) : RYAN_INTAKE), [own, intake, answered]);
  const pools = useMemo(() => computePools(effIntake), [effIntake]);
  const live = !own || intakeComplete(answered);
  const dormant = own && !live;
  const stats = useMemo(() => treeStats(allocation), [allocation]);
  const left = useMemo(() => remaining(allocation, pools, TREES), [allocation, pools]);
  const unspent = left.craftLocked + left.systemsLocked + left.free + left.core;
  const spentTotal = stats.craft.spent + stats.systems.spent + stats.core.spent;
  const anySpent = spentTotal > 0;
  const showCard = !own || revealed || (live && unspent === 0 && anySpent);
  const result = useMemo(
    () => buildResult(effIntake, allocation, TREES, ARCHETYPES, own ? undefined : RYAN_OVERRIDES),
    [effIntake, allocation, own],
  );
  const shareUrl = useMemo(() => buildShareUrl(effIntake, allocation), [effIntake, allocation]);
  const classLabel = `${result.primary.name} / ${result.secondary.name}`;

  const selected: InspectorNode | null = useMemo(() => {
    const id = hoverId || pinnedId;
    if (!id) return null;
    for (let t = 0; t < TREES.length; t += 1) {
      const tree = TREES[t];
      for (let a = 0; a < tree.areas.length; a += 1) {
        const node = tree.areas[a].nodes.find((n) => n.id === id);
        if (node) return { node, tree };
      }
    }
    return null;
  }, [hoverId, pinnedId]);

  // ── Share state: read after mount, write after interaction ─────────────
  useEffect(() => {
    if (!own) return;
    const found = readShareState(window.location.search, window.location.hash);
    if (!found) return;
    const decoded = decodeState(found.raw);
    if (!decoded) return;
    interacted.current = true;
    setIntake(decoded.intake);
    setAnswered(ALL_ANSWERED);
    setAllocation(decoded.allocation);
    setRevealed(true);
    if (found.legacy) {
      // The older ?t= link: move it to the hash so the canonical stays clean.
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = `${HASH_KEY}=${encodeState(decoded.intake, decoded.allocation)}`;
      window.history.replaceState(window.history.state, '', url.toString());
    }
  }, [own]);

  useEffect(() => {
    if (!own || !interacted.current) return;
    const url = new URL(window.location.href);
    const next = live ? `#${HASH_KEY}=${encodeState(intake, allocation)}` : '';
    if (url.hash === next) return;
    url.hash = next;
    window.history.replaceState(window.history.state, '', url.toString());
  }, [own, live, intake, allocation]);

  // ── Motion: two client-only classes, never under reduced motion ────────
  // React leaves a mismatched className alone on hydration, so at mount the
  // DOM still says whether the static HTML carried the reveal class.
  useEffect(() => {
    const el = consoleRef.current;
    if (el && el.classList.contains('is-visible')) paintedLit.current = true;
  }, [consoleRef]);

  // Each moment plays once: the class comes off again after the animation
  // has run, so a tree that is hidden and shown again (a tab on the phone, a
  // resize across the tab breakpoint) does not replay it. The base state of
  // every animated property is the final state, so removing the class
  // changes nothing on screen.
  useEffect(() => {
    if (own || !consoleVisible || paintedLit.current || prefersReducedMotion()) return;
    setCascade(true);
    const t = window.setTimeout(() => setCascade(false), CASCADE_MS);
    return () => window.clearTimeout(t);
  }, [own, consoleVisible]);

  // The card assembles once it is in view. Its own observer rather than
  // useReveal, because in build mode the drawer mounts long after the console.
  useEffect(() => {
    if (!showCard || assembledOnce.current) return;
    const el = cardRef.current;
    if (!el || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === 'undefined') return;
    let t = 0;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        assembledOnce.current = true;
        setAssembled(true);
        io.disconnect();
        t = window.setTimeout(() => setAssembled(false), ASSEMBLE_MS);
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) window.clearTimeout(t);
    };
  }, [showCard]);

  // The card, once assembled, gets the scroll that "Finish" asked for.
  useEffect(() => {
    if (!pendingScroll.current || !showCard || !cardRef.current) return;
    pendingScroll.current = false;
    const el = cardRef.current;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    });
  }, [showCard, cardRef]);

  // ── Selection ──────────────────────────────────────────────────────────
  const onHover = useCallback((id: string | null) => {
    setHoverId(id);
  }, []);

  const onPin = useCallback((id: string, el: HTMLButtonElement) => {
    pinnedEl.current = el;
    setPinnedId(id);
    if (isPhone) setSheetOpen(true);
  }, [isPhone]);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setPinnedId(null);
    setHoverId(null);
    const el = pinnedEl.current;
    if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
  }, []);

  const onKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !sheetOpen) {
      setPinnedId(null);
      setHoverId(null);
    }
  }, [sheetOpen]);

  // ── Tabs (one tree at a time under 1024) ───────────────────────────────
  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % TREES.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + TREES.length) % TREES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TREES.length - 1;
    else return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  // ── Intake ─────────────────────────────────────────────────────────────
  // An answer changed after points were spent can shrink a pool or move a
  // lock from one tree to the other; clampToPools takes off exactly the
  // overdraw so every addition stays payable.
  const changeIntake = useCallback((patch: Partial<Intake>, answers?: IntakeQuestion) => {
    interacted.current = true;
    const nextIntake: Intake = { ...intake, ...patch };
    if (nextIntake.minor !== 'none' && nextIntake.minor === nextIntake.major) nextIntake.minor = 'none';
    if (nextIntake.split === undefined) delete nextIntake.split;
    const nextAnswered = answers ? { ...answered, [answers]: true } : answered;
    setIntake(nextIntake);
    if (answers) setAnswered(nextAnswered);
    const nextPools = computePools(effectiveIntake(nextIntake, nextAnswered));
    setAllocation((alloc) => clampToPools(alloc, nextPools, TREES));
  }, [intake, answered]);

  const setName = useCallback((name: string) => {
    interacted.current = true;
    setIntake((cur) => ({ ...cur, name }));
  }, []);

  // ── Spending ───────────────────────────────────────────────────────────
  const canAdd = useCallback(
    (nodeId: string) => live && canSpend(allocation, nodeId, TREES, pools),
    [live, allocation, pools],
  );

  const addPoint = useCallback((nodeId: string) => {
    if (!own || !live) return;
    interacted.current = true;
    setAllocation((cur) => (canSpend(cur, nodeId, TREES, pools) ? spend(cur, nodeId, 1, pools, TREES) : cur));
  }, [own, live, pools]);

  const removePoint = useCallback((nodeId: string) => {
    if (!own || !live) return;
    interacted.current = true;
    setAllocation((cur) => spend(cur, nodeId, -1));
  }, [own, live]);

  const resetTree = useCallback((treeId: TreeId) => {
    interacted.current = true;
    const tree = TREES.find((t) => t.id === treeId);
    if (!tree) return;
    const ids = new Set<string>();
    tree.areas.forEach((a) => a.nodes.forEach((n) => ids.add(n.id)));
    setAllocation((cur) => {
      const out: Allocation = {};
      Object.keys(cur).forEach((id) => {
        if (!ids.has(id)) out[id] = cur[id];
      });
      return out;
    });
  }, []);

  const resetAll = useCallback(() => {
    interacted.current = true;
    setAllocation({});
    setRevealed(false);
    setAssembled(false);
    assembledOnce.current = false;
  }, []);

  const finish = useCallback(() => {
    if (!live || !anySpent) return;
    pendingScroll.current = true;
    setRevealed(true);
  }, [live, anySpent]);

  // ── Sharing ────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const mod = await import('./cardImage');
      await mod.downloadCard(result);
    } catch {
      // The canvas or the download was refused; the card is still on screen.
    } finally {
      setSaving(false);
    }
  }, [result, saving]);

  const copyText = useCallback(async (text: string, set: (s: CopyState) => void) => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('no clipboard');
      await navigator.clipboard.writeText(text);
      set('copied');
      window.setTimeout(() => set('idle'), 2400);
    } catch {
      set('failed');
    }
  }, []);

  const copyLink = useCallback(() => copyText(shareUrl, setLinkState), [copyText, shareUrl]);
  const copyReceipt = useCallback(
    () => copyText(receiptText(result, shareUrl), setReceiptState),
    [copyText, result, shareUrl],
  );

  // ── Strings ────────────────────────────────────────────────────────────
  // The locked parts still to spend, shown beside a lock until they are.
  const lockedLine = (() => {
    const parts: string[] = [];
    if (left.craftLocked > 0) parts.push(`${left.craftLocked} craft`);
    if (left.systemsLocked > 0) parts.push(`${left.systemsLocked} systems`);
    return parts.join(' · ');
  })();

  const treeMeta = (tree: TalentTree): string => {
    const s = stats[tree.id];
    if (!own) {
      return tree.pool === 'core'
        ? `Root ${tree.root.name} · ${s.spent} core points · ${s.mastered} mastered`
        : `Root ${tree.root.name} · ${s.spent} points · ${s.mastered} mastered`;
    }
    if (tree.pool === 'core') {
      return `Root ${tree.root.name} · ${s.spent} of ${pools.core} core spent · ${s.mastered} mastered`;
    }
    const lockedHere = tree.id === 'craft' ? left.craftLocked : tree.id === 'systems' ? left.systemsLocked : 0;
    const base = `Root ${tree.root.name} · ${s.spent} spent · ${s.mastered} mastered`;
    return lockedHere > 0 ? `${base} · ${lockedHere} locked here` : base;
  };

  const consoleClasses = [
    'tt-console',
    `tt-console--${mode}`,
    consoleVisible ? 'is-visible' : '',
    cascade ? 'is-cascade' : '',
    live ? 'is-live' : 'is-dormant',
  ].filter(Boolean).join(' ');

  const primaryLabel = showCard ? (saving ? 'Rendering' : 'Save as image') : 'Finish with points left';

  return (
    <section className={consoleClasses} ref={consoleRef} aria-label={own ? 'Build your talent tree' : "Ryan's talent tree"} onKeyDownCapture={onKeyDownCapture}>
      {/* ── Status rail ──────────────────────────────────────────────────── */}
      <div className="tt-status">
        <div className="tt-status__row">
          <span className="tt-status__id">
            <span className="tt-status__glyph" aria-hidden="true"><Glyph name="branch" size={14} /></span>
            <span className="tt-status__name">{own ? 'Build your own' : 'Talent tree'}</span>
            {!own && <span className="tt-status__name-sub">{" · Ryan's tree"}</span>}
          </span>
          <ul className="tt-status__trees" aria-label="Points per tree">
            {TREES.map((tree) => (
              <li key={tree.id} className="tt-status__tree">
                <span className="tt-status__tree-name">{shortTreeName(tree.id)}</span>
                <span className="tt-status__n">{stats[tree.id].spent}</span>
                <span className="tt-status__sub">{`· ${stats[tree.id].mastered} mastered`}</span>
              </li>
            ))}
          </ul>
          <p className="tt-status__pools" role="status" aria-label="Points">
            {own ? (
              live ? (
                <>
                  <span className="tt-status__sub">Unspent</span>
                  <span className="tt-status__n">{left.craftLocked + left.systemsLocked + left.free}</span>
                  <span className="tt-status__sub">craft</span>
                  {lockedLine && (
                    <span className="tt-status__lock">
                      <span className="tt-status__lock-glyph" aria-hidden="true" />
                      <span className="sr-only">locked: </span>
                      {lockedLine}
                    </span>
                  )}
                  <span className="tt-status__sub">·</span>
                  <span className="tt-status__n">{left.core}</span>
                  <span className="tt-status__sub">core</span>
                </>
              ) : (
                <span className="tt-status__sub">Unspent · after the intake</span>
              )
            ) : (
              <>
                <span className="tt-status__n">{`${spentTotal} / ${pools.craft + pools.core}`}</span>
                <span className="tt-status__sub">{`spent · ${unspent} unspent`}</span>
              </>
            )}
          </p>
          {own ? (
            <Link to={FRONT_ROUTE} className="tt-status__cross">{"See Ryan's tree →"}</Link>
          ) : (
            <Link to={BUILD_ROUTE} className="tt-status__cross">{'Build your own →'}</Link>
          )}
        </div>
        <div className="tt-tabs" role="tablist" aria-label="Trees">
          {TREES.map((tree, i) => (
            <button
              key={tree.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`tt-tab-${tree.id}`}
              className={`tt-tabs__tab${tab === i ? ' is-selected' : ''}`}
              aria-selected={tab === i}
              aria-controls={`tt-tree-${tree.id}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <span className="tt-tabs__name">{shortTreeName(tree.id)}</span>
              <span className="tt-tabs__count">{`${stats[tree.id].spent} · ${stats[tree.id].mastered} mastered`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Story rail or intake strip ────────────────────────────────────── */}
      {own ? (
        <div className="tt-header tt-header--intake">
          <TalentIntakeStrip
            intake={intake}
            answered={answered}
            craft={pools.craft}
            core={pools.core}
            level={pools.level}
            onChange={changeIntake}
          />
        </div>
      ) : (
        <div className="tt-header tt-story">
          <div className="tt-story__id">
            <h1 className="tt-story__title">{"Ryan's tree"}</h1>
            <p className="tt-story__meta">{`Level ${pools.level} Designer · ${pools.craft} craft · ${pools.core} core`}</p>
            <p className="tt-story__class">{classLabel}</p>
          </div>
          <div className="tt-story__text">
            <p className="tt-story__body">{STORY}</p>
            <p className="tt-story__line">
              <span>Earned by time, not self-rated ·</span>
              <a href="#tt-rules" className="tt-story__anchor">How the points work ↓</a>
            </p>
          </div>
        </div>
      )}

      {own && live && !calloutDismissed && (
        <div className="tt-callout" role="note">
          <span className="tt-callout__bar" aria-hidden="true" />
          <p className="tt-callout__text">
            <strong>The panel is live.</strong>
            {` Tap a node to spend a point, up to five. Crowns unlock once the foundation holds ${CROWN_UNLOCK_AT}. Degree points spend first, on their own tree.`}
          </p>
          <span className="tt-callout__tag">One callout, not a tutorial</span>
          <button type="button" className="tt-callout__close" aria-label="Dismiss" onClick={() => setCalloutDismissed(true)}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}

      {/* ── The trees ─────────────────────────────────────────────────────── */}
      <div className="tt-trees">
        {TREES.map((tree, ti) => (
          <div
            key={tree.id}
            id={`tt-tree-${tree.id}`}
            role="tabpanel"
            aria-labelledby={`tt-tab-${tree.id}`}
            className={`tt-tree-panel${tab === ti ? '' : ' is-inactive'}`}
          >
            <div className="tt-tree-head">
              <div className="tt-tree-head__row">
                <h2 className="tt-tree-head__name">{tree.name}</h2>
                {own && (
                  <button
                    type="button"
                    className="tt-tree-head__reset"
                    onClick={() => resetTree(tree.id)}
                    disabled={!live || stats[tree.id].spent === 0}
                  >
                    Reset tree
                  </button>
                )}
              </div>
              <p className="tt-tree-head__meta">{treeMeta(tree)}</p>
            </div>
            <div className="tt-tree">
              <Wires tree={tree} treeIndex={ti} allocation={allocation} />
              {tree.areas.map((area, i) => {
                const [foundation, crown] = area.nodes;
                const fp = pointsAt(allocation, foundation.id);
                const activeId = hoverId || pinnedId;
                return (
                  <React.Fragment key={area.id}>
                    <TalentNodeButton
                      node={foundation}
                      index={i}
                      treeIndex={ti}
                      points={fp}
                      locked={false}
                      editable={own}
                      dormant={dormant}
                      active={activeId === foundation.id}
                      tapOpens={isPhone}
                      onAdd={addPoint}
                      onRemove={removePoint}
                      onHover={onHover}
                      onPin={onPin}
                    />
                    <TalentNodeButton
                      node={crown}
                      index={i}
                      treeIndex={ti}
                      points={pointsAt(allocation, crown.id)}
                      locked={isLocked(allocation, crown.id)}
                      foundationName={foundation.name}
                      editable={own}
                      dormant={dormant}
                      active={activeId === crown.id}
                      tapOpens={isPhone}
                      onAdd={addPoint}
                      onRemove={removePoint}
                      onHover={onHover}
                      onPin={onPin}
                    />
                  </React.Fragment>
                );
              })}
              <div
                className="tt-root"
                style={{ ...nodeVars('root', 0), '--tt-delay': `${cascadeDelay('root', ti, 0)}ms` } as React.CSSProperties}
              >
                <span className="tt-root__circle">
                  <Glyph name={tree.root.glyph} size={24} />
                </span>
                <span className="tt-root__text">
                  <span className="tt-root__label">{tree.root.name}</span>
                  <span className="tt-root__tag">Root</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Inspector rail ────────────────────────────────────────────────── */}
      <InspectorRail
        selected={selected}
        pinned={!!pinnedId && !hoverId}
        allocation={allocation}
        spends={own && live}
        dormant={dormant}
        canAdd={canAdd}
        onAdd={addPoint}
        onRemove={removePoint}
        touch={isPhone}
      />

      {/* ── Legend and rules rail ─────────────────────────────────────────── */}
      <div className="tt-legend" id="tt-rules">
        <div className="tt-legend__row">
          <Legend />
          <p className="tt-legend__note">
            {own
              ? `Crown unlocks at foundation ${CROWN_UNLOCK_AT} · Shift-click or Backspace takes a point back · earned by time, not self-rated`
              : `Crown unlocks at foundation ${CROWN_UNLOCK_AT} · hover prints the gate in the inspector rail`}
          </p>
        </div>
        <p className="tt-legend__rules">
          <span className="tt-legend__rules-key">How the points work</span>
          {' · degree 4 a year, locked to its tree · years 4 a year to three, then 2 · hours 1 per 40, cap 5 · core 2 a year to five, then 1 · level = years'}
        </p>
      </div>

      {/* ── Drawers ───────────────────────────────────────────────────────── */}
      {(!own || live) && <MasteriesDrawer allocation={allocation} trees={TREES} own={own} />}
      {showCard && (
        <div ref={cardRef} className="tt-card-anchor">
          <CardDrawer
            result={result}
            own={own}
            assembled={assembled}
            name={intake.name}
            onName={own ? setName : undefined}
            saving={saving}
            onSave={save}
            linkState={linkState}
            onCopyLink={copyLink}
            receiptState={receiptState}
            onCopyReceipt={copyReceipt}
            shareUrl={shareUrl}
          />
        </div>
      )}

      {/* ── Bottom rail ───────────────────────────────────────────────────── */}
      <div className="tt-bottom">
        {own ? (
          <>
            <button
              type="button"
              className="tt-primary"
              onClick={showCard ? save : finish}
              aria-disabled={(!showCard && (!live || !anySpent)) || undefined}
              disabled={showCard && saving}
            >
              {primaryLabel}
            </button>
            <p className="tt-bottom__line">
              <button type="button" className="tt-bottom__reset" onClick={resetAll} disabled={!anySpent}>Reset all</button>
              <span>{' · free, never confirmed · state lives in the link · #s= one digit per node · nothing stored'}</span>
            </p>
            <Link to={FRONT_ROUTE} className="tt-bottom__quiet">{"See Ryan's tree →"}</Link>
          </>
        ) : (
          <>
            <Link to={BUILD_ROUTE} className="tt-primary">Build your own →</Link>
            <p className="tt-bottom__line">Three questions, then the fun · your tree gets its own address at /talent-tree/build/ · nothing is stored</p>
            <Link to={getProjectsHref()} className="tt-bottom__quiet">{"Explore Ryan's work →"}</Link>
          </>
        )}
      </div>

      <InspectorSheet
        open={sheetOpen && isPhone}
        selected={selected}
        pinned
        allocation={allocation}
        spends={own && live}
        dormant={dormant}
        canAdd={canAdd}
        onAdd={addPoint}
        onRemove={removePoint}
        onClose={closeSheet}
      />
    </section>
  );
};

export default TalentConsole;
