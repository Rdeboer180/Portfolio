// ============================================
// SkillTreeCanvas — /talent-tree/
// Ryan's skill tree on the canvas: board 25 of the skill tree design canvas ("Technical ·
// Dev mode"), carried to every lane. A short story says what the page is,
// then a dot-grid canvas with a Layers panel on the left (Design and systems,
// Technical, Code, Abilities), one lane at a time on a white artboard, and a
// Design / Dev toggle on the right. Design reads a skill in words; Dev prints
// its id, gate, weights, the recipes that read it, and the ryan.ts lines
// behind the number. The page opens on Abilities, where the three lanes stack
// as sheets and a thread runs through the skills the class reads (LayerStack);
// a skill's panel links the work it shipped in (RYAN_NODE_PROOF). The class card and the next quest sit in the gutter as
// props, the way the /about canvas keeps its things.
//
// It is Ryan's tree only and read only: the build-your-own path was retired
// on 8 November 2026, so nothing here spends a point or writes the URL. Under
// 768 the canvas becomes a list per lane with a sheet per skill, the
// design canvas's phone board.
//
// Everything shown is computed by src/data/talent; this file holds page state.
// ============================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SITE } from '../../data/site';
import type { AbilityState, TalentNode, TreeId } from '../../data/talent/types';
import { NODES, TREES, foundationOf } from '../../data/talent/trees';
import { ARCHETYPES } from '../../data/talent/archetypes';
import { MAX_POINTS_PER_NODE, computePools } from '../../data/talent/economy';
import { pickClass } from '../../data/talent/abilities';
import { RYAN_ABILITY_PROOF, RYAN_ALLOCATION, RYAN_INTAKE, RYAN_NODE_NOTES, RYAN_NODE_PROOF, RYAN_OVERRIDES, RYAN_V5_ALLOCATION } from '../../data/talent/ryan';
import { PROTECTED_WORK } from '../../data/protectedWork';
import ProjectLink from '../ProjectLink';
import { buildResult } from '../../data/talent/score';
import ClassName, { ClassLabel } from './ClassName';
import Glyph from './Glyph';
import LayerStack from './LayerStack';
import { countWord, pointsAt, treeStats } from './consoleData';
import {
  ARTBOARD,
  DESK_LANES,
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
  recipeLanes,
  recipesReading,
  ryanDiff,
  treeById,
  weightRows,
} from './skillTreeData';
import type { Lane } from './skillTreeData';
import { useMediaQuery } from './useMediaQuery';

type View = 'design' | 'dev';

export const FRONT_ROUTE = '/talent-tree/';

/**
 * Ryan's own words for what the page is. On a desktop the first line is the
 * cover's headline (LANE_HEADING.cover) and the rest is its body; the phone
 * header prints it whole.
 */
const STORY_LINES = [
  "I've never been sure what to call myself.",
  'Product Designer, Design Engineer, UX Engineer, Systems Designer: the job descriptions overlap and none of them agree on what the title means.',
  'So instead of picking one, I built a skill tree and put sixteen years of points where they actually went.',
  'A node at zero means no points landed there, not that I have never touched it.',
  "Here's where my strengths lie.",
];
export const STORY = STORY_LINES.join(' ');
const STORY_BODY = STORY_LINES.slice(1).join(' ');

const PLAYGROUND_URL = `${SITE.portfolioUrl}/lab/playground/`;
const LAYER_ICON = 'M8 3v18M16 3v18M3 8h18M3 16h18';
// A Figma page icon: the cover is a page, the lanes are layers.
const COVER_ICON = 'M6 2h9l5 5v15H6zM15 2v5h5';
const ABILITY_ICON = 'M12 2l4 4-4 4-4-4zM6 8l4 4-4 4-4-4zM18 8l4 4-4 4-4-4zM12 14l4 4-4 4-4-4z';

function layerIcon(l: Lane): string {
  if (l === 'cover') return COVER_ICON;
  return l === 'abilities' ? ABILITY_ICON : LAYER_ICON;
}

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

const SkillTreeCanvas: React.FC = () => {
  const allocation = RYAN_ALLOCATION;
  // A desktop opens on the cover, the story the header used to float beside;
  // its one button goes to the thread (9 November 2026). The phone has no
  // cover, so there the same state opens on the thread.
  const [rawLane, setLane] = useState<Lane>('cover');
  // Dev first, as board 25 drew it; Design is one click away.
  const [view, setView] = useState<View>('dev');
  const [picked, setPicked] = useState<Partial<Record<TreeId, string>>>({});
  // Hovering a skill reads it in the panel; leaving falls back to the pick.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [abilityId, setAbilityId] = useState<string | null>(null);
  // Hovering or focusing an ability row previews its thread; the pick stays.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const sheetClose = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isPhone = useMediaQuery('(max-width: 767px)');
  const lane: Lane = isPhone && rawLane === 'cover' ? 'abilities' : rawLane;
  const tabLanes = isPhone ? LANES : DESK_LANES;

  // ── Derived ────────────────────────────────────────────────────────────
  const pools = useMemo(() => computePools(RYAN_INTAKE), []);
  const stats = useMemo(() => treeStats(allocation), [allocation]);
  const result = useMemo(() => buildResult(RYAN_INTAKE, allocation, TREES, ARCHETYPES, RYAN_OVERRIDES), [allocation]);
  const klass = useMemo(() => pickClass(result.abilities), [result.abilities]);
  const unlockedCount = result.abilities.filter((a) => a.unlocked).length;

  const treeLane: TreeId | null = lane === 'abilities' || lane === 'cover' ? null : lane;
  const selectedId: string | null = treeLane ? picked[treeLane] || strongestIn(treeLane) : null;
  const shownId = hoverId && treeLane && laneOf(hoverId) === treeLane ? hoverId : selectedId;
  const selectedNode = shownId ? NODES[shownId] : null;
  const selectedAbility: AbilityState | null = lane === 'abilities'
    ? result.abilities.find((a) => a.ability.id === abilityId) || klass.primary
    : null;
  const threadAbility: AbilityState | null = lane === 'abilities'
    ? result.abilities.find((a) => a.ability.id === previewId) || selectedAbility
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
    setPreviewId(null);
    setSheetOpen(false);
  }, []);

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabLanes.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabLanes.length) % tabLanes.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabLanes.length - 1;
    else return;
    e.preventDefault();
    chooseLane(tabLanes[next]);
    tabRefs.current[next]?.focus();
  };

  // ── Strings ────────────────────────────────────────────────────────────
  const layerMeta = (l: Lane) => {
    if (l === 'cover') return '';
    return l === 'abilities' ? `${unlockedCount}/${result.abilities.length}` : String(stats[l].spent);
  };
  let eyebrow: string;
  if (treeLane) eyebrow = `${LANE_NAME[treeLane]} · ${stats[treeLane].spent} points · ${stats[treeLane].mastered} mastered`;
  else if (lane === 'cover') eyebrow = 'Cover · read me first';
  else eyebrow = `Abilities · ${unlockedCount} of ${result.abilities.length} unlocked`;
  let subline: string | null;
  if (lane === 'cover') subline = null;
  else if (lane === 'abilities') subline = 'An ability is never spent. It is a thread through skills that already hold the points.';
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

  // Where the skill shipped: the claim, then the work (RYAN_NODE_PROOF).
  const workLink = (to: string, label: string, detail?: string) => {
    const slug = to.startsWith('/work/') ? to.split('/')[2] : '';
    return (
      <ProjectLink to={to} className="fc-proof__link">
        <span className="fc-proof__name">
          {label}
          {PROTECTED_WORK.has(slug) && <span className="fc-proof__lock">password</span>}
        </span>
        {detail && <span className="fc-proof__detail">{detail}</span>}
      </ProjectLink>
    );
  };

  const proofBlock = (node: TalentNode) => {
    const rows = RYAN_NODE_PROOF[node.id];
    if (!rows) return null;
    return (
      <div className="fc-proof">
        <span className="fc-label">Used in</span>
        <ul>
          {rows.map((r) => <li key={r.to}>{workLink(r.to, r.label, r.detail)}</li>)}
        </ul>
      </div>
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
            <span className="fc-inspect__name">{node.name}</span>
            <span className="fc-inspect__key">{node.id}</span>
            <span className="fc-chips">
              <span className="fc-chip">{tree.id}</span>
              <span className="fc-chip">{node.tier}</span>
              <span className="fc-chip">{`${level} / ${MAX_POINTS_PER_NODE}`}</span>
            </span>
          </div>
          {personalNote(node)}
          {proofBlock(node)}
          <dl className="fc-props">
            <div><dt>tier</dt><dd>{gateLine(node)}</dd></div>
            <div><dt>level</dt><dd>{levelLine}</dd></div>
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
            <span className="fc-label">abilities.ts · recipes reading it</span>
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
        {proofBlock(node)}
        {level >= MAX_POINTS_PER_NODE && <p className="fc-note__mastery">{node.masteryLine}</p>}
        <span className="fc-label">Feeds</span>
        {recipes.length ? (
          <ul className="fc-feeds">
            {recipes.map((r) => {
              const state = result.abilities.find((a) => a.ability.id === r.ability.id);
              return (
                <li key={r.ability.id}>
                  <span>{r.ability.name}</span>
                  <span className={`fc-feeds__state${state && state.unlocked ? ' is-unlocked' : ''}`}>{state ? abilityTag(state) : ''}</span>
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
      <span className="fc-note__level">{state.unlocked ? `unlocked · strength ${state.strength}` : `${state.missing} ${state.missing === 1 ? 'point' : 'points'} away`}</span>
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
      {isPhone && RYAN_ABILITY_PROOF[state.ability.id] && (
        <div className="fc-proof">{workLink(RYAN_ABILITY_PROOF[state.ability.id].to, RYAN_ABILITY_PROOF[state.ability.id].label)}</div>
      )}
      {view === 'dev' && (
        <pre className="fc-code" aria-label="abilities.ts recipe">
          <span className="fc-code__line fc-code__line--comment">{`// abilities.ts · ${state.ability.family}`}</span>
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

  // The thread: the lanes as sheets, the picked ability stitched through them.
  const threadStack = (flat: boolean) => {
    if (!threadAbility) return null;
    const { ability } = threadAbility;
    const lanes = recipeLanes(ability).map((l) => LANE_SHORT[l]);
    const through = lanes.length > 2 ? `${lanes.slice(0, -1).join(', ')} and ${lanes[lanes.length - 1]}` : lanes.join(' and ');
    const proof = RYAN_ABILITY_PROOF[ability.id];
    return (
      <div className="fc-threadwrap">
        <LayerStack flat={flat} allocation={allocation} stats={stats} state={threadAbility} onOpenLane={chooseLane} />
        <p className="fc-threadcap" aria-live="polite">
          <span>
            <strong>{ability.name}</strong>
            {threadAbility.unlocked
              ? ` runs through ${through}.`
              : ` is ${threadAbility.missing} ${threadAbility.missing === 1 ? 'point' : 'points'} short. The open knots are where.`}
          </span>
          {proof && !flat && <ProjectLink to={proof.to} className="fc-threadcap__link">{proof.label}</ProjectLink>}
        </p>
      </div>
    );
  };

  const abilityRows = (
    // The preview clears when the pointer or focus leaves the whole list, not
    // each row, so crossing the hairline between two rows never snaps the
    // thread back to the pick for a frame.
    <ul
      className="fc-abilities"
      aria-label="Abilities"
      onMouseLeave={() => setPreviewId(null)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPreviewId(null); }}
    >
      {result.abilities.map((state) => {
        const on = selectedAbility ? selectedAbility.ability.id === state.ability.id : false;
        return (
          <li key={state.ability.id}>
            <button type="button" className={`fc-abilities__row is-${abilityTone(state)}${on ? ' is-selected' : ''}`} aria-pressed={on} onClick={(e) => openAbility(state.ability.id, e)} onMouseEnter={() => setPreviewId(state.ability.id)} onFocus={() => setPreviewId(state.ability.id)}>
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
      <section className={`fc fc--phone fc--${view}`} aria-label="Ryan's skill tree">
        <header className="fc-phone__head">
          <h1 className="fc-phone__title">My skill tree</h1>
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
          {!treeLane ? <>{threadStack(true)}{abilityRows}</> : (
            <ul className="fc-list" aria-label={`${LANE_NAME[treeLane]} skills`}>
              {treeById(treeLane).areas.map((area) => area.nodes.map((node) => {
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
    <section className={`fc fc--${view}`} aria-label="Ryan's skill tree">
      <header className="fc-intro">
        <div className="fc-intro__title">
          <h1>My skill tree</h1>
          <p className="fc-intro__class"><ClassLabel primary={result.primary.name} secondary={result.secondary.name} /></p>
          <p className="fc-intro__facts">{facts}</p>
        </div>
      </header>

      <div className="fc__canvas">
        <div className="fc__gutter fc__gutter--left">
          <div className="fc-layers">
            <span className="fc-layers__title" id="fc-layers-title">Layers</span>
            <div role="tablist" aria-labelledby="fc-layers-title" aria-orientation="vertical" className="fc-layers__list">
              {DESK_LANES.map((l, i) => (
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d={layerIcon(l)} /></svg>
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
          <span className="fc__frame">{`Skill tree / ${LANE_SHORT[lane]}`}</span>
          <div className={`fc-artboard${lane === 'cover' ? ' fc-artboard--cover' : ''}`} id={panelId} role="tabpanel" aria-labelledby={tabId(lane)}>
            <header className="fc-artboard__head">
              <span className="fc-artboard__eyebrow">{eyebrow}</span>
              <h2 className="fc-artboard__title">{LANE_HEADING[lane]}</h2>
              {subline && <span className="fc-artboard__sub">{subline}</span>}
            </header>
            {lane === 'cover' && (
              <div className="fc-cover">
                <p className="fc-cover__story">{STORY_BODY}</p>
                <button type="button" className="fc-cover__go" onClick={() => chooseLane('abilities')}>
                  See what the points unlock
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            {treeLane && renderTree(treeLane)}
            {lane === 'abilities' && <>{threadStack(false)}{abilityRows}</>}
            {treeLane && playground}
          </div>
        </div>

        <div className="fc__gutter fc__gutter--right">
          {modeToggle}
          {/* The cover's question gets its answer beside it: the class. */}
          {lane === 'cover' && abilityPanel(klass.primary)}
          {lane === 'abilities'
            ? (selectedAbility ? abilityPanel(selectedAbility) : null)
            : (selectedNode ? nodePanel(selectedNode) : null)}
        </div>
      </div>
    </section>
  );
};

export default SkillTreeCanvas;
