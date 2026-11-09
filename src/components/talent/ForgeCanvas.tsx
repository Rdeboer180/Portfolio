// ============================================
// ForgeCanvas — /talent-tree/
// Ryan's talent tree on the canvas: board 25 of the Forge canvas ("Technical ·
// Dev mode"), carried to every lane. A short story says what the page is,
// then a dot-grid canvas with a Layers panel on the left (Design and systems,
// Technical, Code, Abilities), one lane at a time on a white artboard, and a
// Design / Dev toggle on the right. Design reads a skill in words; Dev prints
// its id, gate, weights, the recipes that read it, and the ryan.ts lines
// behind the number. The class card and the next quest sit in the gutter as
// props, the way the /about canvas keeps its things.
//
// It is Ryan's tree only and read only: the build-your-own path was retired
// on 8 November 2026, so nothing here spends a point or writes the URL. Under
// 768 the canvas becomes a list per lane with a sheet per skill, the
// ForgeMobile board's pattern.
//
// Everything shown is computed by src/data/talent; this file holds page state.
// ============================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SITE } from '../../data/site';
import type { AbilityState, TalentNode, TreeId } from '../../data/talent/types';
import { NODES, TREES, foundationOf } from '../../data/talent/trees';
import { ARCHETYPES } from '../../data/talent/archetypes';
import { MAX_POINTS_PER_NODE, computePools } from '../../data/talent/economy';
import { pickClass } from '../../data/talent/forge';
import { RYAN_ALLOCATION, RYAN_INTAKE, RYAN_NODE_NOTES, RYAN_OVERRIDES, RYAN_V5_ALLOCATION } from '../../data/talent/ryan';
import { buildResult } from '../../data/talent/score';
import ClassName, { ClassLabel } from './ClassName';
import Glyph from './Glyph';
import { countWord, pointsAt, treeStats } from './consoleData';
import {
  ARTBOARD,
  LANES,
  LANE_HEADING,
  LANE_NAME,
  LANE_SHORT,
  ROOT,
  abilityRecipe,
  abilityTag,
  abilityTone,
  deltaFromV5,
  gateLine,
  laneNodes,
  laneOf,
  laneWires,
  nodeAria,
  recipesReading,
  ryanDiff,
  treeById,
  weightRows,
} from './forgeCanvasData';
import type { Lane } from './forgeCanvasData';
import { useMediaQuery } from './useMediaQuery';

type View = 'design' | 'dev';

export const FRONT_ROUTE = '/talent-tree/';

/** Ryan's own words for what the page is; it opens the page and the phone header. */
export const STORY = [
  "I've never been sure what to call myself.",
  'Product Designer, Design Engineer, UX Engineer, Systems Designer: the job descriptions overlap and none of them agree on what the title means.',
  'So instead of picking one, I built a talent tree and put sixteen years of points where they actually went.',
  'A node at zero means no points landed there, not that I have never touched it.',
  "Here's where my strengths lie.",
].join(' ');

const PLAYGROUND_URL = `${SITE.portfolioUrl}/lab/playground/`;
const LAYER_ICON = 'M8 3v18M16 3v18M3 8h18M3 16h18';
const ABILITY_ICON = 'M12 2l4 4-4 4-4-4zM6 8l4 4-4 4-4-4zM18 8l4 4-4 4-4-4zM12 14l4 4-4 4-4-4z';

/** The strongest node in a lane: what the panel opens on. */
function strongestIn(lane: TreeId): string {
  const tree = treeById(lane);
  let best = tree.areas[0].nodes[0].id;
  let top = -1;
  tree.areas.forEach((a) => a.nodes.forEach((n) => {
    const p = pointsAt(RYAN_ALLOCATION, n.id);
    if (p > top) { top = p; best = n.id; }
  }));
  return best;
}

const tabId = (lane: Lane) => `fc-tab-${lane}`;
const panelId = 'fc-artboard';

const Heat: React.FC<{ level: number }> = ({ level }) => (
  <span className={`fc-heat fc-heat--${Math.max(0, Math.min(5, level))}`} aria-hidden="true" />
);

const ForgeCanvas: React.FC = () => {
  const allocation = RYAN_ALLOCATION;
  const [lane, setLane] = useState<Lane>('technical');
  const [view, setView] = useState<View>('design');
  const [picked, setPicked] = useState<Partial<Record<TreeId, string>>>({});
  // Hovering a skill reads it in the panel; leaving falls back to the pick.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [abilityId, setAbilityId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const sheetClose = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isPhone = useMediaQuery('(max-width: 767px)');

  // ── Derived ────────────────────────────────────────────────────────────
  const pools = useMemo(() => computePools(RYAN_INTAKE), []);
  const stats = useMemo(() => treeStats(allocation), [allocation]);
  const result = useMemo(() => buildResult(RYAN_INTAKE, allocation, TREES, ARCHETYPES, RYAN_OVERRIDES), [allocation]);
  const klass = useMemo(() => pickClass(result.abilities), [result.abilities]);
  const unlockedCount = result.abilities.filter((a) => a.unlocked).length;

  const treeLane: TreeId | null = lane === 'abilities' ? null : lane;
  const selectedId: string | null = treeLane ? picked[treeLane] || strongestIn(treeLane) : null;
  const shownId = hoverId && treeLane && laneOf(hoverId) === treeLane ? hoverId : selectedId;
  const selectedNode = shownId ? NODES[shownId] : null;
  const selectedAbility: AbilityState | null = lane === 'abilities'
    ? result.abilities.find((a) => a.ability.id === abilityId) || klass.primary
    : null;

  // ── Selection ──────────────────────────────────────────────────────────
  const pick = useCallback((id: string) => {
    const t = laneOf(id);
    if (t) setPicked((cur) => ({ ...cur, [t]: id }));
  }, []);

  const onNodeClick = useCallback((id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    pick(id);
    if (isPhone) {
      lastTrigger.current = e.currentTarget;
      setSheetOpen(true);
    }
  }, [pick, isPhone]);

  const openAbility = useCallback((id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setAbilityId(id);
    if (isPhone) {
      lastTrigger.current = e.currentTarget;
      setSheetOpen(true);
    }
  }, [isPhone]);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    const el = lastTrigger.current;
    if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
  }, []);

  // The sheet takes focus when it opens; closeSheet hands it back.
  useEffect(() => {
    if (sheetOpen) sheetClose.current?.focus({ preventScroll: true });
  }, [sheetOpen]);

  // ── Lanes ──────────────────────────────────────────────────────────────
  const chooseLane = useCallback((next: Lane) => {
    setLane(next);
    setHoverId(null);
    setSheetOpen(false);
  }, []);

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % LANES.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + LANES.length) % LANES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = LANES.length - 1;
    else return;
    e.preventDefault();
    chooseLane(LANES[next]);
    tabRefs.current[next]?.focus();
  };

  // ── Strings ────────────────────────────────────────────────────────────
  const layerMeta = (l: Lane) => (l === 'abilities' ? `${unlockedCount}/${result.abilities.length}` : String(stats[l].spent));
  const eyebrow = treeLane
    ? `${LANE_NAME[treeLane]} · ${stats[treeLane].spent} points · ${stats[treeLane].mastered} mastered`
    : `Abilities · ${unlockedCount} of ${result.abilities.length} forged`;
  let subline: string;
  if (lane === 'abilities') subline = 'Abilities are never spent: each one reads the points already on the skills.';
  else if (view === 'dev') subline = 'Dev mode: ids, gates, and the data behind every number.';
  else subline = 'Pick a skill to read what a point here means.';

  // ── Panels ─────────────────────────────────────────────────────────────
  // Ryan's own word on a skill, where he has one (RYAN_NODE_NOTES).
  const personalNote = (node: TalentNode) => {
    const n = RYAN_NODE_NOTES[node.id];
    if (!n) return null;
    return (
      <p className={`fc-mine${n.agent ? ' is-agent' : ''}`}>
        <span className="fc-label">{n.agent ? 'Agent-built · how I work with it' : 'How I use it'}</span>
        {n.note}
      </p>
    );
  };

  const nodePanel = (node: TalentNode) => {
    const level = pointsAt(allocation, node.id);
    const recipes = recipesReading(node.id, allocation);
    const tree = treeById(laneOf(node.id) as TreeId);
    if (view === 'dev') {
      const delta = deltaFromV5(node.id, level, RYAN_V5_ALLOCATION);
      const levelLine = delta === 'new in v7'
        ? `${level} · new in v7`
        : `${level} · v5 ${pointsAt(RYAN_V5_ALLOCATION, node.id)}${delta ? ` · ${delta.replace(' from v5', '')}` : ''}`;
      return (
        <div className="fc-inspect" aria-label="Inspect">
          <div className="fc-inspect__id">
            <span className="fc-inspect__key">{node.id}</span>
            <span className="fc-chips">
              <span className="fc-chip">{tree.id}</span>
              <span className="fc-chip">{node.tier}</span>
              <span className="fc-chip">{`${level} / ${MAX_POINTS_PER_NODE}`}</span>
            </span>
          </div>
          {personalNote(node)}
          <dl className="fc-props">
            <div><dt>tier</dt><dd>{gateLine(node)}</dd></div>
            <div><dt>level</dt><dd>{levelLine}</dd></div>
            <div><dt>glyph</dt><dd>{node.glyph}</dd></div>
            <div><dt>max</dt><dd>5 · mastery at 5</dd></div>
          </dl>
          <div className="fc-weights">
            <span className="fc-label">Weights · sum 1.00</span>
            {weightRows(node).map((w) => (
              <div className="fc-weights__row" key={w.trait}>
                <span>{w.label}</span>
                <span className="fc-weights__bar" aria-hidden="true"><span style={{ width: `${w.pct}%` }} /></span>
                <span>{w.value}</span>
              </div>
            ))}
          </div>
          <div className="fc-block">
            <span className="fc-label">forge.ts · recipes reading it</span>
            <pre className="fc-code" aria-label="Recipes">
              {recipes.length ? recipes.map((r) => (
                <React.Fragment key={r.ability.id}>
                  <span className={`fc-code__line fc-code__line--${r.met ? 'add' : 'comment'}`}>{`// ${r.ability.name} · ${r.met ? 'met' : `short ${r.min - level}`}`}</span>
                  <span className="fc-code__line">{`{ nodeId: '${node.id}',`}</span>
                  <span className="fc-code__line">{`  min: ${r.min} },`}</span>
                </React.Fragment>
              )) : <span className="fc-code__line fc-code__line--comment">{`// no recipe reads ${node.id} yet`}</span>}
            </pre>
          </div>
          <div className="fc-block">
            <span className="fc-label">ryan.ts · v5 → v7</span>
            <pre className="fc-code" aria-label="ryan.ts diff">
              {ryanDiff(tree, allocation, RYAN_V5_ALLOCATION, node.id).map((l) => (
                <span key={l.key} className={`fc-code__line fc-code__line--${l.kind}${l.selected ? ' is-selected' : ''}`}>{l.text}</span>
              ))}
            </pre>
          </div>
        </div>
      );
    }
    return (
      <div className="fc-note" aria-label="Skill">
        <span className="fc-note__layer">{`layer / ${node.id}`}</span>
        <h3 className="fc-note__name">{node.name}</h3>
        <span className="fc-note__level">{`${level} of ${MAX_POINTS_PER_NODE} · ${node.tier === 'crown' ? `crown over ${foundationOf(node.id)?.name || 'its foundation'}` : 'foundation'}`}</span>
        {personalNote(node)}
        <p className="fc-note__meaning">{node.meaning}</p>
        {level >= MAX_POINTS_PER_NODE && <p className="fc-note__mastery">{node.masteryLine}</p>}
        <span className="fc-label">Feeds</span>
        {recipes.length ? (
          <ul className="fc-feeds">
            {recipes.map((r) => {
              const state = result.abilities.find((a) => a.ability.id === r.ability.id);
              return (
                <li key={r.ability.id}>
                  <span>{r.ability.name}</span>
                  <span className={`fc-feeds__state${state && state.unlocked ? ' is-forged' : ''}`}>{state ? abilityTag(state) : ''}</span>
                </li>
              );
            })}
          </ul>
        ) : <p className="fc-note__none">No ability recipe uses this skill yet.</p>}
      </div>
    );
  };

  const abilityPanel = (state: AbilityState) => (
    <div className="fc-note fc-note--ability" aria-label="Ability">
      <span className="fc-note__layer">{`ability / ${state.ability.id}`}</span>
      <h3 className="fc-note__name">{state.ability.name}</h3>
      <span className="fc-note__level">{state.unlocked ? `forged · strength ${state.strength}` : `${state.missing} ${state.missing === 1 ? 'point' : 'points'} away`}</span>
      <p className="fc-note__meaning">{`${state.ability.line}.`}</p>
      <ul className="fc-reqs" aria-label="Recipe">
        {state.levels.map((l) => (
          <li key={l.nodeId} className={l.level >= l.min ? 'is-met' : undefined}>
            <Heat level={l.level} />
            <span>{NODES[l.nodeId] ? NODES[l.nodeId].name : l.nodeId}</span>
            <span className="fc-reqs__n">{`${l.level} / ${l.min}${l.level >= l.min ? ' ✓' : ''}`}</span>
          </li>
        ))}
      </ul>
      {view === 'dev' && (
        <pre className="fc-code" aria-label="forge.ts recipe">
          <span className="fc-code__line fc-code__line--comment">{`// forge.ts · ${state.ability.family}`}</span>
          {state.ability.formula.map((s) => (
            <span key={s.nodeId} className="fc-code__line">{`{ nodeId: '${s.nodeId}', min: ${s.min} },`}</span>
          ))}
        </pre>
      )}
    </div>
  );

  // ── The class card and the next quest (gutter props) ───────────────────
  const classCard = (
    <div className="fc-classcard">
      <div className="fc-classcard__face">
        <span className="fc-classcard__eyebrow">{`${klass.primary.ability.family} · class lead`}</span>
        <span className="fc-classcard__name"><ClassName name={result.primary.name} /></span>
      </div>
      <p className="fc-classcard__line">{`${klass.primary.ability.line}.`}</p>
      <p className="fc-classcard__with">{`With ${result.secondary.name}`}</p>
    </div>
  );

  // The quest is Ryan's, in his words (RYAN_OVERRIDES), not the nearest recipe.
  const questSticky = (
    <div className="fc-sticky">
      <span className="fc-sticky__eyebrow">Next quest</span>
      <span className="fc-sticky__text">{RYAN_OVERRIDES.quest}</span>
    </div>
  );

  // ── The tree on the artboard ───────────────────────────────────────────
  const renderTree = (laneId: TreeId) => {
    const tree = treeById(laneId);
    const nodes = laneNodes(tree, allocation);
    const { wires, gates } = laneWires(tree, allocation, selectedId);
    return (
      <div className="fc-tree">
        <svg className="fc-tree__wires" width={ARTBOARD.width} height={ARTBOARD.height} viewBox={`0 0 ${ARTBOARD.width} ${ARTBOARD.height}`} aria-hidden="true" focusable="false">
          {wires.map((w) => (
            <line key={w.key} x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} className={`fc-wire${w.lit ? ' is-lit' : ''}${w.chain ? ' is-chain' : ''}`} />
          ))}
          {view === 'dev' && gates.map((g) => (
            <g key={g.key} className={`fc-gate${g.open ? ' is-open' : ''}`}>
              <rect x={g.x - 17} y={g.y - 8} width="34" height="16" rx="3" />
              <text x={g.x} y={g.y + 4} textAnchor="middle">≥3</text>
            </g>
          ))}
        </svg>
        {nodes.map((n) => {
          const delta = view === 'dev' ? deltaFromV5(n.node.id, n.level, RYAN_V5_ALLOCATION) : null;
          const on = n.node.id === selectedId;
          const agent = !!RYAN_NODE_NOTES[n.node.id]?.agent;
          return (
            <div key={n.node.id} className={`fc-node fc-node--l${n.level}${n.locked ? ' is-locked' : ''}${on ? ' is-selected' : ''}${agent ? ' is-agent' : ''}`} style={{ left: n.x - 60, top: n.y - 24 }}>
              <button
                type="button"
                className="fc-node__btn"
                aria-label={`${nodeAria(n.node, n.level)}${agent ? ', agent-built' : ''}`}
                aria-pressed={on}
                onClick={(e) => onNodeClick(n.node.id, e)}
                onFocus={() => pick(n.node.id)}
                onMouseEnter={() => setHoverId(n.node.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <Glyph name={n.node.glyph} size={22} />
                <span className="fc-node__badge" aria-hidden="true">{n.level}</span>
              </button>
              <span className="fc-node__label">
                <span className="fc-node__name">{n.node.name}</span>
                {agent && <span className="fc-node__agent">agent-built</span>}
                {view === 'dev' && <span className="fc-node__id">{n.node.id}</span>}
                {delta && <span className={`fc-node__delta${delta.startsWith('↓') ? ' is-down' : ''}`}>{delta}</span>}
              </span>
            </div>
          );
        })}
        <div className="fc-root" style={{ left: ROOT.x - 56, top: ROOT.y }}>
          <span className="fc-root__tile">
            <Glyph name={tree.root.glyph} size={26} />
            <span className="fc-root__badge">{stats[laneId].spent}</span>
          </span>
          <span className="fc-root__name">{tree.root.name}</span>
        </div>
      </div>
    );
  };

  const abilityRows = (
    <ul className="fc-abilities" aria-label="Abilities">
      {result.abilities.map((state) => {
        const on = selectedAbility ? selectedAbility.ability.id === state.ability.id : false;
        return (
          <li key={state.ability.id}>
            <button type="button" className={`fc-abilities__row is-${abilityTone(state)}${on ? ' is-selected' : ''}`} aria-pressed={on} onClick={(e) => openAbility(state.ability.id, e)}>
              <span className="fc-abilities__dot" aria-hidden="true" />
              <span className="fc-abilities__text">
                <span className="fc-abilities__name">{state.ability.name}</span>
                <span className="fc-abilities__recipe">{abilityRecipe(state)}</span>
              </span>
              <span className="fc-abilities__tag">{abilityTag(state)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const playground = (
    <div className="fc-playground">
      <span className="fc-label">Prototype playground</span>
      <a className="btn btn--primary btn--sm" href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer">
        Open the playground<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span className="fc-playground__note">No password. WheelRack and AEM carry employer work and ask for one.</span>
      {view === 'dev' && <span className="fc-node__id">href /lab/playground/</span>}
    </div>
  );

  const modeToggle = (
    <div className="fc-mode" role="group" aria-label="Mode">
      <button type="button" aria-pressed={view === 'design'} onClick={() => setView('design')}>Design</button>
      <button type="button" aria-pressed={view === 'dev'} onClick={() => setView('dev')}>Dev</button>
    </div>
  );

  const facts = `Level ${pools.level} · ${pools.total} points over ${countWord(pools.level)} years · ${countWord(result.mastered.length)} skills at 5 · ${unlockedCount} of ${result.abilities.length} abilities`;

  // ── Phone ──────────────────────────────────────────────────────────────
  if (isPhone) {
    const sheetBody = lane === 'abilities'
      ? (selectedAbility ? abilityPanel(selectedAbility) : null)
      : (selectedNode ? nodePanel(selectedNode) : null);
    return (
      <section className={`fc fc--phone fc--${view}`} aria-label="Ryan's talent tree">
        <header className="fc-phone__head">
          <span className="fc-label">The Forge</span>
          <h1 className="fc-phone__title">My talent tree</h1>
          <p className="fc-phone__story">{STORY}</p>
          <span className="fc-label">Class</span>
          <span className="fc-phone__class"><ClassLabel primary={result.primary.name} secondary={result.secondary.name} /></span>
          <span className="fc-phone__meta">{facts}</span>
          {questSticky}
          {modeToggle}
        </header>
        <div className="fc-phone__tabs" role="tablist" aria-label="Layers">
          {LANES.map((l, i) => (
            <button key={l} id={tabId(l)} ref={(el) => { tabRefs.current[i] = el; }} type="button" role="tab" aria-selected={lane === l} aria-controls={panelId} tabIndex={lane === l ? 0 : -1} onClick={() => chooseLane(l)} onKeyDown={(e) => onTabKey(e, i)}>
              <span>{LANE_SHORT[l]}</span>
              <span className="fc-phone__tabmeta">{layerMeta(l)}</span>
            </button>
          ))}
        </div>
        {/* The toggle has to change the list itself on a phone: the sheet only
            shows after a tap, so Dev prints ids, gates and ryan.ts here too. */}
        <p className="fc-phone__sub">{subline}</p>
        <div id={panelId} role="tabpanel" aria-labelledby={tabId(lane)} className="fc-phone__panel">
          {lane === 'abilities' ? abilityRows : (
            <ul className="fc-list" aria-label={`${LANE_NAME[lane]} skills`}>
              {treeById(lane).areas.map((area) => area.nodes.map((node) => {
                const level = pointsAt(allocation, node.id);
                const agent = !!RYAN_NODE_NOTES[node.id]?.agent;
                const delta = view === 'dev' ? deltaFromV5(node.id, level, RYAN_V5_ALLOCATION) : null;
                return (
                  <li key={node.id} className={`fc-list__item fc-list__item--${node.tier}`}>
                    <button type="button" className="fc-list__btn" aria-label={`${nodeAria(node, level)}${agent ? ', agent-built' : ''}`} aria-haspopup="dialog" onClick={(e) => onNodeClick(node.id, e)}>
                      <Heat level={level} />
                      <span className="fc-list__glyph" aria-hidden="true"><Glyph name={node.glyph} size={16} /></span>
                      <span className="fc-list__name">
                        {node.name}
                        {agent && <span className="fc-node__agent">agent-built</span>}
                        {view === 'dev' && <span className="fc-node__id">{node.id}</span>}
                        {view === 'dev' && <span className="fc-node__id">{gateLine(node)}</span>}
                        {delta && <span className={`fc-node__delta${delta.startsWith('↓') ? ' is-down' : ''}`}>{delta}</span>}
                      </span>
                      <span className="fc-list__level">{`${level} / ${MAX_POINTS_PER_NODE}`}</span>
                    </button>
                  </li>
                );
              }))}
            </ul>
          )}
          {view === 'dev' && treeLane && (
            <div className="fc-phone__code">
              <span className="fc-label">ryan.ts · v5 → v7</span>
              <pre className="fc-code" aria-label="ryan.ts diff">
                {ryanDiff(treeById(treeLane), allocation, RYAN_V5_ALLOCATION, null).map((l) => (
                  <span key={l.key} className={`fc-code__line fc-code__line--${l.kind}`}>{l.text}</span>
                ))}
              </pre>
            </div>
          )}
        </div>
        <div className="fc-phone__play">{playground}</div>
        {sheetOpen && sheetBody && (
          <div className="fc-sheet" onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); closeSheet(); } }}>
            <div className="fc-sheet__scrim" onClick={closeSheet} aria-hidden="true" />
            <div className="fc-sheet__panel" role="dialog" aria-modal="true" aria-label={lane === 'abilities' ? 'Ability' : selectedNode ? selectedNode.name : 'Skill'}>
              <div className="fc-sheet__handle" aria-hidden="true" />
              <button type="button" className="fc-sheet__close" aria-label="Close" onClick={closeSheet} ref={sheetClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              {sheetBody}
            </div>
          </div>
        )}
      </section>
    );
  }

  // ── Desktop and tablet ─────────────────────────────────────────────────
  return (
    <section className={`fc fc--${view}`} aria-label="Ryan's talent tree">
      <header className="fc-intro">
        <div className="fc-intro__title">
          <span className="fc-label">The Forge</span>
          <h1>My talent tree</h1>
          <p className="fc-intro__class"><ClassLabel primary={result.primary.name} secondary={result.secondary.name} /></p>
          <p className="fc-intro__facts">{facts}</p>
        </div>
        <p className="fc-intro__story">{STORY}</p>
      </header>

      <div className="fc__canvas">
        <div className="fc__gutter fc__gutter--left">
          <div className="fc-layers">
            <span className="fc-layers__title" id="fc-layers-title">Layers</span>
            <div role="tablist" aria-labelledby="fc-layers-title" aria-orientation="vertical" className="fc-layers__list">
              {LANES.map((l, i) => (
                <button
                  key={l}
                  id={tabId(l)}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={lane === l}
                  aria-controls={panelId}
                  tabIndex={lane === l ? 0 : -1}
                  className="fc-layers__row"
                  onClick={() => chooseLane(l)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d={l === 'abilities' ? ABILITY_ICON : LAYER_ICON} /></svg>
                  <span className="fc-layers__name">{LANE_NAME[l]}</span>
                  <span className="fc-layers__meta">{layerMeta(l)}</span>
                </button>
              ))}
            </div>
          </div>
          {classCard}
          {questSticky}
        </div>

        <div className="fc__stage">
          <span className="fc__frame">{`Forge / ${LANE_SHORT[lane]}`}</span>
          <div className="fc-artboard" id={panelId} role="tabpanel" aria-labelledby={tabId(lane)}>
            <header className="fc-artboard__head">
              <span className="fc-artboard__eyebrow">{eyebrow}</span>
              <h2 className="fc-artboard__title">{LANE_HEADING[lane]}</h2>
              <span className="fc-artboard__sub">{subline}</span>
            </header>
            {treeLane ? renderTree(treeLane) : abilityRows}
            {treeLane && playground}
          </div>
        </div>

        <div className="fc__gutter fc__gutter--right">
          {modeToggle}
          {lane === 'abilities'
            ? (selectedAbility ? abilityPanel(selectedAbility) : null)
            : (selectedNode ? nodePanel(selectedNode) : null)}
        </div>
      </div>
    </section>
  );
};

export default ForgeCanvas;
