// ============================================
// SystemsInPractice — "Good product work has to travel."
// Homepage section 03, badged "How I work". An ecosystem board of eight nodes —
// Shared Product Context at the centre, the Figma ⇄ Codebase working pair, and
// five extended surfaces — built as real HTML/CSS, with the connective linework in one SVG overlay
// whose geometry is measured from the live DOM. Beneath it, the loop: four
// beats that say how the board gets used, each claiming the nodes it works
// on, so the process and the ecosystem read as one argument rather than two
// sections.
//
// Layout modes are owned by _systems-in-practice.scss and announced to this
// file through custom properties:
//   --sip-layout on the board — network (≥1024) · tree (768–1023) · list (<768)
//   --sip-loop on the beats   — row (≥1024) · ring (768–1023) · list (<768)
//
// Wire geometry — the board's and the loop's alike — is written to the
// <path d> attributes imperatively rather than through state. The prerender
// serialises the drawn wires into the static HTML; a state-driven first render
// would start empty and mismatch that markup on hydration (the #418 failure
// App.tsx documents). Attributes React never owns are left alone, then
// re-measured on mount and on resize.
// ============================================

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { useReveal } from '../hooks/useReveal';
import { useHighlightSweep } from '../hooks/useHighlightSweep';

// ── Icons ────────────────────────────────────────────────────────────────────
// Stroke glyphs in the same hand as the site's other inline marks (1.8 stroke,
// round caps, currentColor). Decorative: every one is aria-hidden by its host.

const Glyph: React.FC<{ d: string; children?: React.ReactNode }> = ({ d, children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={d} />
    {children}
  </svg>
);

// Section-badge mark: a hub with three spokes — the board in miniature.
const NetworkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="5" r="2.4" />
    <circle cx="5" cy="19" r="2.4" />
    <circle cx="19" cy="19" r="2.4" />
    <path d="M12 7.4v3.4M12 10.8l-5.4 6.2M12 10.8l5.4 6.2" />
  </svg>
);

const ICON = {
  system: <Glyph d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />,
  figma: <Glyph d="M7 3v18M17 3v18M3 7h18M3 17h18" />,
  code: <Glyph d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  docs: <Glyph d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6" />,
  prompts: <Glyph d="M4 6l6 6-6 6M13 18h7" />,
  qa: <Glyph d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM8.5 12.5l2.5 2.5 4.5-5.5" />,
  people: (
    <Glyph d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  ),
  governance: <Glyph d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

// ── Nodes ────────────────────────────────────────────────────────────────────
// DOM order is the reading order: the hub first, then the working pair, then
// the five surfaces. Grid placement (per layout mode) lives in the SCSS, so
// the visual board and the narrative order never have to agree.

export type NodeId =
  | 'system' | 'figma' | 'code' | 'docs' | 'prompts' | 'qa' | 'people' | 'governance';

export interface SystemNodeData {
  id: NodeId;
  tier: 'center' | 'pair' | 'surface';
  title: string;
  /**
   * Mono marker under the title. A phrase on the hub, three verbs on the
   * working pair, and one role word on each of the five surfaces, so the
   * surfaces read as working notes rather than an institutional taxonomy.
   */
  meta: string;
  body: string;
  /** Centre node only: body set as separate lines. */
  lines?: string[];
  /**
   * The node's relationships in plain words. Visible in list mode, where there
   * are no wires; screen-reader only elsewhere. Arrows are supplemental — a
   * node's connections are never carried by a line alone.
   */
  relation: string;
  icon: React.ReactNode;
}

export const SYSTEM_NODES: SystemNodeData[] = [
  {
    id: 'system',
    tier: 'center',
    title: 'Shared Product Context',
    meta: 'System knowledge',
    // No `lines`: the sentence breaks on its own at every board width without
    // stranding a word, which the old three-line body could not do.
    body: 'Intent, decisions, and standards that can travel.',
    relation:
      'Two-way with every surface on the board: Figma, the codebase, documentation, agent workflows, QA, the team, and governance.',
    icon: ICON.system,
  },
  {
    id: 'figma',
    tier: 'pair',
    title: 'Figma / Canvas',
    meta: 'Design · Explore · Align',
    body: 'Figma still starts and steers the conversation.',
    relation: 'Two-way with the Codebase and with the Shared Product Context.',
    icon: ICON.figma,
  },
  {
    id: 'code',
    tier: 'pair',
    title: 'Codebase',
    meta: 'Implement · Maintain · Scale',
    body: 'Turn system decisions into real products. Feed what production teaches back into the system.',
    relation: 'Two-way with Figma and with the Shared Product Context.',
    icon: ICON.code,
  },
  {
    id: 'docs',
    tier: 'surface',
    title: 'Documentation',
    meta: 'Reference',
    body: 'Write the system down so people who never open the Figma file or the code can still use it.',
    relation: 'Two-way with the Shared Product Context.',
    icon: ICON.docs,
  },
  {
    id: 'prompts',
    tier: 'surface',
    title: 'Agent workflows',
    meta: 'Apply',
    body: 'Carry system context into AI workflows, prototypes, and implementation requests.',
    relation: 'Two-way with the Shared Product Context.',
    icon: ICON.prompts,
  },
  {
    id: 'qa',
    tier: 'surface',
    title: 'QA',
    meta: 'Validate',
    body: 'Catch drift, accessibility issues, and system mismatches before they ship.',
    relation: 'Two-way with the Shared Product Context.',
    icon: ICON.qa,
  },
  {
    id: 'people',
    tier: 'surface',
    title: 'Team',
    meta: 'Collaborate',
    body: 'Help specialists share context, challenge decisions, and evolve the system together.',
    relation: 'Two-way with the Shared Product Context.',
    icon: ICON.people,
  },
  {
    id: 'governance',
    tier: 'surface',
    title: 'Governance',
    meta: 'Guide',
    body: 'Define guardrails, handle exceptions, and decide when patterns should change.',
    relation: 'Two-way with the Shared Product Context.',
    icon: ICON.governance,
  },
];

/**
 * One node card. Exported so the design-system page can show the three tiers.
 * `lit` is the loop's claim on it: while a beat is active, its nodes carry the
 * same selected state a hover gives them and everything else recedes.
 */
export const SystemNode: React.FC<{ node: SystemNodeData; lit?: boolean }> = ({ node, lit }) => (
  <article
    className={`sip__node sip__node--${node.tier} sip__node--${node.id}${lit ? ' is-lit' : ''}`}
  >
    <span className="sip__node-icon" aria-hidden="true">{node.icon}</span>
    <h3 className="sip__node-title">{node.title}</h3>
    <p className="sip__node-meta">{node.meta}</p>
    <p className="sip__node-body">
      {node.lines
        ? node.lines.map((line) => (
            <span key={line} className="sip__node-line">{line}</span>
          ))
        : node.body}
    </p>
    <p className="sip__node-rel">{node.relation}</p>
  </article>
);

// ── The loop ─────────────────────────────────────────────────────────────────
// Four beats, in Ryan's words, beneath the board. Each beat claims the nodes
// it works on and every node is claimed exactly once — that is what makes the
// two halves one section. Hovering or focusing a beat lights its nodes and
// recedes the rest; with nothing active the whole board is lit, which is what
// the first paint, a thumbnail and a crawler get. The claim is also written
// into each beat's copy, so the meaning never depends on the interaction, a
// colour, or a wire.

export type BeatIndex = 1 | 2 | 3 | 4;

export interface BeatData {
  n: BeatIndex;
  title: string;
  /** Names the nodes the beat claims, in words. */
  body: React.ReactNode;
  nodes: NodeId[];
}

export const BEATS: BeatData[] = [
  {
    n: 1,
    title: 'Define the rules',
    body: (
      <>
        Starts at the <strong>Shared Product Context</strong>. Problem, people, constraints, and proof come
        before a tool picks the direction.
      </>
    ),
    nodes: ['system'],
  },
  {
    n: 2,
    title: 'Explore across surfaces',
    body: (
      <>
        <strong>Figma / Canvas</strong> and the <strong>Codebase</strong>, in whichever order
        answers fastest. Either is allowed to change the system. The Figma MCP server hands an
        agent the mapped component and its tokens rather than a screenshot of the frame.
      </>
    ),
    nodes: ['figma', 'code'],
  },
  {
    n: 3,
    title: 'Learn from what becomes real',
    body: (
      <>
        <strong>QA</strong> and the <strong>Team</strong> report back: edge cases, accessibility gaps,
        and what production actually did with the rule.
      </>
    ),
    nodes: ['qa', 'people'],
  },
  {
    n: 4,
    title: 'Feed it back into the system',
    body: (
      // No `{' '}` anywhere in these bodies: text either side of an expression
      // is two text nodes, and the prerender flattens them into one — the
      // hydration mismatch the header describes. Keep each run of text on
      // one side of an element, in one string.
      <>
        Into <strong>Documentation</strong>, <strong>Agent workflows</strong>, and <strong>Governance</strong>:
        the guidance the next designer, engineer, or agent starts from.
      </>
    ),
    nodes: ['docs', 'prompts', 'governance'],
  },
];

// ── The wire's label ─────────────────────────────────────────────────────────
// Code Connect is what makes the Figma ⇄ Codebase wire literally true: the
// Figma component is mapped to the code component and its props, so an agent
// reading the pair gets a contract rather than a screenshot. One chip, on the
// wire, and the only literal code on the board. The mapping is Figma's own
// Button example; it is a demonstration of the shape, not a claim about a
// specific library.
const CODE_CONNECT = {
  name: 'Code Connect',
  map: 'Button → <Button variant="primary">',
};

// ── Wires ────────────────────────────────────────────────────────────────────
// A fixed set of links so the SVG's structure never changes between layout
// modes; a link that a mode doesn't draw simply has an empty `d`.
// `pair` = the Figma ⇄ Codebase thesis, the one relationship in Signal Orange.

type LinkId =
  | 'pair-a' | 'pair-b'
  | 'figma-system' | 'code-system'
  | 'docs-system' | 'prompts-system' | 'qa-system' | 'people-system' | 'governance-system'
  | 'trunk';

interface LinkDef {
  id: LinkId;
  nodes: NodeId[];
  /** Draw-in delay (ms) after the board reveals; nodes fade first. */
  delay: number;
  pair?: boolean;
}

const LINKS: LinkDef[] = [
  { id: 'pair-a', nodes: ['figma', 'code'], delay: 420, pair: true },
  { id: 'pair-b', nodes: ['figma', 'code'], delay: 540, pair: true },
  { id: 'figma-system', nodes: ['figma', 'system'], delay: 640 },
  { id: 'code-system', nodes: ['code', 'system'], delay: 700 },
  { id: 'trunk', nodes: ['system'], delay: 720 },
  { id: 'docs-system', nodes: ['docs', 'system'], delay: 800 },
  { id: 'prompts-system', nodes: ['prompts', 'system'], delay: 860 },
  { id: 'qa-system', nodes: ['qa', 'system'], delay: 940 },
  { id: 'people-system', nodes: ['people', 'system'], delay: 1000 },
  { id: 'governance-system', nodes: ['governance', 'system'], delay: 1060 },
];

const SURFACES: NodeId[] = ['docs', 'prompts', 'qa', 'people', 'governance'];

// The loop's connectors: 1 → 2 ⇄ 3 → 4, and 4 back to 1. The 2 ⇄ 3 pair is two
// one-way shafts, the same shape as the board's thesis wire but in steel —
// orange stays spent on Figma ⇄ Codebase alone. `return` is the one the loop
// exists to draw: in row mode it leaves 04, runs back under the beats and
// arrives at 01; in ring mode it is the ring's fourth side.
type LoopLinkId = 'b12' | 'b23a' | 'b23b' | 'b34' | 'b41';

interface LoopLinkDef {
  id: LoopLinkId;
  beats: BeatIndex[];
  delay: number;
  isReturn?: boolean;
}

const LOOP_LINKS: LoopLinkDef[] = [
  { id: 'b12', beats: [1, 2], delay: 360 },
  { id: 'b23a', beats: [2, 3], delay: 460 },
  { id: 'b23b', beats: [2, 3], delay: 540 },
  { id: 'b34', beats: [3, 4], delay: 620 },
  { id: 'b41', beats: [4, 1], delay: 760, isReturn: true },
];

interface Box { x: number; y: number; w: number; h: number; r: number; b: number; cx: number; cy: number }
interface Wire { d: string; headA: string; headB: string }

const EMPTY: Wire = { d: '', headA: '', headB: '' };
const GAP = 7; // breathing room between a wire's end and the node border
const r1 = (n: number) => Math.round(n * 10) / 10;

// Measured where the element lands, not where it is: wires are drawn at
// mount, while .reveal-fade still holds every cell 12px low, and a resize can
// catch a cell mid-transition. The pending translate is subtracted, so the
// wire meets the settled border with its 7px gap instead of 12px later.
const toBox = (el: Element, origin: DOMRect): Box => {
  const r = el.getBoundingClientRect();
  const tf = getComputedStyle(el).transform;
  const parts = tf.slice(tf.indexOf('(') + 1, -1).split(',').map(parseFloat);
  const dy = tf.startsWith('matrix3d(') ? parts[13] || 0 : tf.startsWith('matrix(') ? parts[5] || 0 : 0;
  const x = r.left - origin.left;
  const y = r.top - origin.top - dy;
  return { x, y, w: r.width, h: r.height, r: x + r.width, b: y + r.height, cx: x + r.width / 2, cy: y + r.height / 2 };
};

// Open arrowhead — two ticks from the tip, the site's sketched-arrow hand.
// (dx, dy) is the unit direction of travel *into* the point.
const tick = (px: number, py: number, dx: number, dy: number): string => {
  const size = 7;
  const spread = 4.2;
  const nx = -dy;
  const ny = dx;
  const bx = px - dx * size;
  const by = py - dy * size;
  return (
    `M${r1(px)} ${r1(py)}L${r1(bx + nx * spread)} ${r1(by + ny * spread)}` +
    `M${r1(px)} ${r1(py)}L${r1(bx - nx * spread)} ${r1(by - ny * spread)}`
  );
};

// Two-way link between two boxes, shaped by where they sit relative to each
// other: side by side → horizontal; stacked with overlap → vertical; stacked
// and offset → an S-curve leaving from the quarter nearest the other box.
function connect(a: Box, b: Box): Wire {
  const vOverlap = Math.min(a.b, b.b) - Math.max(a.y, b.y);
  if (vOverlap > Math.min(a.h, b.h) * 0.5) {
    const left = a.cx < b.cx ? a : b;
    const right = left === a ? b : a;
    const y = (left.cy + right.cy) / 2;
    const x1 = left.r + GAP;
    const x2 = right.x - GAP;
    return { d: `M${r1(x1)} ${r1(y)}L${r1(x2)} ${r1(y)}`, headA: tick(x1, y, -1, 0), headB: tick(x2, y, 1, 0) };
  }
  const top = a.cy < b.cy ? a : b;
  const bottom = top === a ? b : a;
  const y1 = top.b + GAP;
  const y2 = bottom.y - GAP;
  const hOverlap = Math.min(top.r, bottom.r) - Math.max(top.x, bottom.x);
  if (hOverlap >= 40) {
    const x = (Math.max(top.x, bottom.x) + Math.min(top.r, bottom.r)) / 2;
    return { d: `M${r1(x)} ${r1(y1)}L${r1(x)} ${r1(y2)}`, headA: tick(x, y1, 0, -1), headB: tick(x, y2, 0, 1) };
  }
  const towardRight = bottom.cx > top.cx;
  const x1 = top.x + top.w * (towardRight ? 0.75 : 0.25);
  const x2 = bottom.x + bottom.w * (towardRight ? 0.25 : 0.75);
  const ym = (y1 + y2) / 2;
  return {
    d: `M${r1(x1)} ${r1(y1)}C${r1(x1)} ${r1(ym)} ${r1(x2)} ${r1(ym)} ${r1(x2)} ${r1(y2)}`,
    headA: tick(x1, y1, 0, -1),
    headB: tick(x2, y2, 0, 1),
  };
}

// The thesis: two stacked shafts, one each way, between the working pair.
function pairWires(figma: Box, code: Box): [Wire, Wire] {
  const left = figma.cx < code.cx ? figma : code;
  const right = left === figma ? code : figma;
  const mid = (left.cy + right.cy) / 2;
  const x1 = left.r + GAP;
  const x2 = right.x - GAP;
  const yA = mid - 8;
  const yB = mid + 8;
  return [
    { d: `M${r1(x1)} ${r1(yA)}L${r1(x2)} ${r1(yA)}`, headA: '', headB: tick(x2, yA, 1, 0) },
    { d: `M${r1(x2)} ${r1(yB)}L${r1(x1)} ${r1(yB)}`, headA: '', headB: tick(x1, yB, -1, 0) },
  ];
}

// One-way link between two adjacent beats, headed at `to`. Side by side →
// horizontal; stacked → vertical. `offset` shifts the shaft off the centre
// line (perpendicular to travel) so two of these can stack into a ⇄.
function oneWay(from: Box, to: Box, offset = 0): Wire {
  const vOverlap = Math.min(from.b, to.b) - Math.max(from.y, to.y);
  if (vOverlap > Math.min(from.h, to.h) * 0.5) {
    const dir = to.cx > from.cx ? 1 : -1;
    const y = (from.cy + to.cy) / 2 + offset;
    const x1 = dir > 0 ? from.r + GAP : from.x - GAP;
    const x2 = dir > 0 ? to.x - GAP : to.r + GAP;
    return { d: `M${r1(x1)} ${r1(y)}L${r1(x2)} ${r1(y)}`, headA: '', headB: tick(x2, y, dir, 0) };
  }
  const dir = to.cy > from.cy ? 1 : -1;
  const x = (Math.max(from.x, to.x) + Math.min(from.r, to.r)) / 2 + offset;
  const y1 = dir > 0 ? from.b + GAP : from.y - GAP;
  const y2 = dir > 0 ? to.y - GAP : to.b + GAP;
  return { d: `M${r1(x)} ${r1(y1)}L${r1(x)} ${r1(y2)}`, headA: '', headB: tick(x, y2, 0, dir) };
}

// The return, in row mode: down out of 04, along a rail beneath the beats,
// and up into 01 with an arrowhead — the loop closing where the eye can see
// it. `railY` is measured from the label that rides the rail, so the two can
// never disagree. Corners are quadratic so the line reads as one stroke.
function returnRail(from: Box, to: Box, railY: number): Wire {
  const R = 12;
  const xa = from.cx;
  const ya = from.b + GAP;
  const xb = to.cx;
  const yb = to.b + GAP;
  const d =
    `M${r1(xa)} ${r1(ya)}L${r1(xa)} ${r1(railY - R)}` +
    `Q${r1(xa)} ${r1(railY)} ${r1(xa - R)} ${r1(railY)}` +
    `L${r1(xb + R)} ${r1(railY)}` +
    `Q${r1(xb)} ${r1(railY)} ${r1(xb)} ${r1(railY - R)}` +
    `L${r1(xb)} ${r1(yb)}`;
  return { d, headA: '', headB: tick(xb, yb, 0, -1) };
}

// ── Component ────────────────────────────────────────────────────────────────

const SystemsInPractice: React.FC = () => {
  // The one sentence in this section that carries the argument gets the site's
  // selection-sweep: it highlights, then settles to bold. Same vocabulary as the
  // About section, same hook — the classes and the reduced-motion fallback are
  // global (see _about.scss), so nothing new is needed here but the ref.
  // Threshold is lower than About's default because this section is ~1,470px
  // tall; at 0.4 the sweep would not arm until the board had scrolled past.
  const sweepRef = useHighlightSweep<HTMLElement>({
    selector: '.animated-bold',
    activeClass: 'animated-bold--active',
    settledClass: 'animated-bold--settled',
    settleOffset: 850,
    cycleTime: 1900,
    threshold: 0.2,
  });
  const [introRef, introVisible] = useReveal<HTMLDivElement>(0.3);
  const [stageRef, stageVisible] = useReveal<HTMLDivElement>(0.2);
  const [loopRef, loopVisible] = useReveal<HTMLDivElement>(0.2);

  const boardRef = useRef<HTMLOListElement>(null);
  const cellRefs = useRef<Partial<Record<NodeId, HTMLLIElement | null>>>({});
  const wireRefs = useRef<Partial<Record<string, SVGPathElement | null>>>({});
  const [active, setActive] = useState<NodeId | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<HTMLOListElement>(null);
  const beatRefs = useRef<Partial<Record<BeatIndex, HTMLLIElement | null>>>({});
  const returnSlotRef = useRef<HTMLDivElement>(null);
  const loopWireRefs = useRef<Partial<Record<string, SVGPathElement | null>>>({});

  // Hover and focus are tracked apart so a mouse leaving a beat that also
  // holds focus (it was clicked, or tabbed to) keeps the board lit until the
  // focus moves on. The most recent input wins while both are set, so a
  // pointer parked on one beat never overrides the beat the keyboard is on.
  const [hoveredBeat, setHoveredBeat] = useState<BeatIndex | null>(null);
  const [focusedBeat, setFocusedBeat] = useState<BeatIndex | null>(null);
  const lastInput = useRef<'hover' | 'focus'>('hover');
  const activeBeat =
    lastInput.current === 'focus' ? (focusedBeat ?? hoveredBeat) : (hoveredBeat ?? focusedBeat);
  const litNodes = activeBeat ? BEATS[activeBeat - 1].nodes : null;

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const set = (key: string, d: string) => wireRefs.current[key]?.setAttribute('d', d);
    const write = (id: LinkId, wire: Wire) => {
      set(`${id}:shaft`, wire.d);
      set(`${id}:a`, wire.headA);
      set(`${id}:b`, wire.headB);
      set(`${id}:comet`, wire.d);
    };

    const draw = () => {
      const mode = getComputedStyle(board).getPropertyValue('--sip-layout').trim();
      const wires: Partial<Record<LinkId, Wire>> = {};

      if (mode !== 'list') {
        const origin = board.getBoundingClientRect();
        const box: Partial<Record<NodeId, Box>> = {};
        (Object.keys(cellRefs.current) as NodeId[]).forEach((id) => {
          const el = cellRefs.current[id];
          if (el) box[id] = toBox(el, origin);
        });
        const s = box.system;
        const fg = box.figma;
        const cd = box.code;

        if (s && fg && cd) {
          [wires['pair-a'], wires['pair-b']] = pairWires(fg, cd);
          wires['figma-system'] = connect(fg, s);
          wires['code-system'] = connect(cd, s);

          if (mode === 'tree') {
            // One trunk down from the hub, a stub across to each surface.
            const cards = SURFACES.map((id) => box[id]).filter((b): b is Box => !!b);
            const lowest = Math.max(...cards.map((c) => c.cy));
            const tx = s.cx;
            const ty = s.b + GAP;
            wires.trunk = { d: `M${r1(tx)} ${r1(ty)}L${r1(tx)} ${r1(lowest)}`, headA: tick(tx, ty, 0, -1), headB: '' };
            SURFACES.forEach((id) => {
              const c = box[id];
              if (!c) return;
              const toLeft = c.cx < tx;
              const xEnd = toLeft ? c.r + GAP : c.x - GAP;
              wires[`${id}-system` as LinkId] = {
                d: `M${r1(tx)} ${r1(c.cy)}L${r1(xEnd)} ${r1(c.cy)}`,
                headA: '',
                headB: tick(xEnd, c.cy, toLeft ? -1 : 1, 0),
              };
            });
          } else {
            SURFACES.forEach((id) => {
              const c = box[id];
              if (c) wires[`${id}-system` as LinkId] = connect(c, s);
            });
          }
        }
      }

      LINKS.forEach((link) => write(link.id, wires[link.id] ?? EMPTY));
    };

    draw();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }
    const ro = new ResizeObserver(draw);
    ro.observe(board);
    Object.values(cellRefs.current).forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  // The loop's wires: same mechanism as the board's, measured from the track.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const list = beatsRef.current;
    if (!track || !list) return;

    const set = (key: string, d: string) => loopWireRefs.current[key]?.setAttribute('d', d);
    const write = (id: LoopLinkId, wire: Wire) => {
      set(`${id}:shaft`, wire.d);
      set(`${id}:a`, wire.headA);
      set(`${id}:b`, wire.headB);
    };

    const draw = () => {
      const mode = getComputedStyle(list).getPropertyValue('--sip-loop').trim();
      const wires: Partial<Record<LoopLinkId, Wire>> = {};

      if (mode !== 'list') {
        const origin = track.getBoundingClientRect();
        const [b1, b2, b3, b4] = ([1, 2, 3, 4] as BeatIndex[]).map((n) => {
          const el = beatRefs.current[n];
          if (!el) return null;
          const box = toBox(el, origin);
          // A rail, not cards: a connector between two beats runs beside their
          // headings, so the row reads as a sequence of titles rather than a
          // line through the middle of four text blocks. Only the horizontal
          // connectors read cy; the stacked ones and the return rail measure
          // from the box edges.
          const title = el.querySelector('.sip__beat-title');
          if (title) {
            // Relative to the cell, so the cell's pending reveal translate
            // (already removed from `box`) is not counted twice.
            const li = el.getBoundingClientRect();
            const t = title.getBoundingClientRect();
            // The first line, not the box: one heading wraps at 1440 and the
            // rail should still read as one line.
            const line = parseFloat(getComputedStyle(title).lineHeight) || t.height;
            box.cy = box.y + (t.top - li.top) + line / 2;
          }
          return box;
        });

        if (b1 && b2 && b3 && b4) {
          wires.b12 = oneWay(b1, b2);
          wires.b23a = oneWay(b2, b3, -8);
          wires.b23b = oneWay(b3, b2, 8);
          wires.b34 = oneWay(b3, b4);
          if (mode === 'ring') {
            wires.b41 = oneWay(b4, b1);
          } else {
            // The slot, not the label: the label carries reveal-fade's
            // translate before the loop reveals, and the rail must land where
            // it ends up, not where it starts.
            const slot = returnSlotRef.current;
            const railY = slot ? toBox(slot, origin).cy : b4.b + 32;
            wires.b41 = returnRail(b4, b1, railY);
          }
        }
      }

      LOOP_LINKS.forEach((link) => write(link.id, wires[link.id] ?? EMPTY));
    };

    draw();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }
    const ro = new ResizeObserver(draw);
    ro.observe(track);
    ro.observe(list);
    Object.values(beatRefs.current).forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` } as React.CSSProperties);

  return (
    <section id="systems" className={`sip${activeBeat ? ' sip--beat-active' : ''}`} ref={sweepRef}>
      <div className="sip__container">
        {/* "How I work", not "Systems": the section is the process, and the
            board is how the process is drawn. Short enough to hold one line at
            375 inside the shared badge's fixed chrome. */}
        <SectionBadge icon={<NetworkIcon />} label="How I work" index="03" />

        <div className="sip__inner">
          {/* ── Editorial column ── */}
          <div className={`sip__intro${introVisible ? ' is-visible' : ''}`} ref={introRef}>
            <h2 className="sip__title">
              <span className="reveal-mask">
                <span className="sip__title-line reveal-mask__inner" style={delay(0)}>
                  Good product work has to travel.
                </span>
              </span>
            </h2>
            <p className="sip__body reveal-fade" style={delay(240)}>
              I don’t treat Figma, code, documentation, or a prompt as the finish line. They’re
              working surfaces for the same product decision. I move between them depending on
              what will answer the question fastest, and{' '}
              <span className="animated-bold">
                what I learn in one should be allowed to change the others.
              </span>
            </p>
            <p className="sip__body reveal-fade" style={delay(320)}>
              Design systems make that movement easier, but they aren’t the whole job. The work is
              defining the problem, making tradeoffs visible, testing what becomes real, and leaving
              enough context for the next designer, engineer, or agent to make a good decision
              without me in the room.
            </p>
            <div className="sip__actions reveal-fade" style={delay(420)}>
              {/* PlayDraft is the public study where the whole loop is visible:
                  Figma, a token-governed build, Maestro QA, and the live
                  /design-system screen. WheelRack is the deeper system study but
                  sits behind the gate, and a first click should land. */}
              <Link to="/work/playdraft/" className="btn btn--secondary btn--md sip__btn">
                See this in the work &rarr;
              </Link>
              <Link to="/design-system" className="sip__link">
                Explore the live system &rarr;
              </Link>
            </div>

            {/* The section's second hand mark, at the foot of the column — the
                approved reference carries two, one above the file and one under
                the CTAs, and this is the one that answers the space under the
                CTAs where the column is shorter than the board. Decorative, and
                hidden from AT: it names the move the board is for. Drawn
                only where the columns sit side by side (the SCSS hides it
                below 1280) — stacked, it would just be a second handwritten
                line above the board's own. */}
            <p className="sip__mark reveal-fade" aria-hidden="true" style={delay(560)}>
              <span className="sip__mark-line">Use the surface</span>
              <span className="sip__mark-line sip__mark-line--drawn">
                that answers fastest.
                <svg
                  className="sip__mark-underline"
                  viewBox="0 0 240 14"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <path
                    className="reveal-draw"
                    d="M3 8 C 60 3, 180 3, 237 7"
                    pathLength={1}
                    style={delay(980)}
                  />
                </svg>
              </span>
            </p>
          </div>

          {/* ── The board ── */}
          <div className={`sip__stage${stageVisible ? ' is-visible' : ''}`} ref={stageRef}>
            {/* The mark above the file: a craft note in the margin, pointing at it. Its
                quieter sibling sits at the foot of the editorial column. */}
            <p className="sip__note reveal-fade" style={delay(300)}>
              <span className="sip__note-text">The file is not the finish line.</span>
              <svg className="sip__note-arrow" viewBox="0 0 32 40" aria-hidden="true" focusable="false">
                <path d="M5 4 C 9 9, 16 16, 24 33" pathLength={1} className="reveal-draw" style={delay(700)} />
                <path d="M17.5 30.5 L24 33 L26.5 26.5" pathLength={1} className="reveal-draw" style={delay(1000)} />
              </svg>
            </p>

            <ol className="sip__board" ref={boardRef}>
              {SYSTEM_NODES.map((node, i) => (
                <React.Fragment key={node.id}>
                  <li
                    className={`sip__cell sip__cell--${node.id} reveal-fade`}
                    style={delay(i * 50)}
                    ref={(el) => { cellRefs.current[node.id] = el; }}
                    onMouseEnter={() => setActive(node.id)}
                    onMouseLeave={() => setActive((cur) => (cur === node.id ? null : cur))}
                  >
                    <SystemNode node={node} lit={!!litNodes && litNodes.includes(node.id)} />
                  </li>
                  {node.id === 'figma' && (
                    // The pair's label. Sits on the pair's top edge over the gap the
                    // wires cross (the gap is 56px; the label is not), lights with the
                    // pair when beat 02 claims it, and recedes with everything else
                    // otherwise. In list mode it stands between the two cards, under
                    // the ⇄ glyph that stands in for the wires there.
                    <li
                      role="presentation"
                      className={`sip__cell sip__cell--connect reveal-fade${
                        activeBeat === 2 ? ' is-lit' : ''
                      }${active === 'figma' || active === 'code' ? ' is-active' : ''}`}
                      style={delay(760)}
                    >
                      <span className="sip__pair-link" aria-hidden="true">
                        <svg viewBox="0 0 16 32" focusable="false">
                          <path d="M8 4v24M4 8l4-4 4 4M4 24l4 4 4-4" />
                        </svg>
                      </span>
                      <span className="sip__connect">
                        <span className="sip__connect-name">{CODE_CONNECT.name}</span>
                        <span className="sip__connect-dot" aria-hidden="true">·</span>
                        <code className="sip__connect-map">{CODE_CONNECT.map}</code>
                      </span>
                    </li>
                  )}
                </React.Fragment>
              ))}

              {/* Connective linework — supplemental to the relation text inside each node. */}
              <svg className="sip__wires" aria-hidden="true" focusable="false">
                {LINKS.map((link) => (
                  <g
                    key={link.id}
                    className={`sip__link${link.pair ? ' sip__link--pair' : ''}${
                      active && link.nodes.includes(active) ? ' is-active' : ''
                    }${link.pair && activeBeat === 2 ? ' is-lit' : ''}`}
                    style={delay(link.delay)}
                  >
                    <path
                      className="sip__wire"
                      pathLength={1}
                      suppressHydrationWarning
                      ref={(el) => { wireRefs.current[`${link.id}:shaft`] = el; }}
                    />
                    <path
                      className="sip__head"
                      pathLength={1}
                      suppressHydrationWarning
                      ref={(el) => { wireRefs.current[`${link.id}:a`] = el; }}
                    />
                    <path
                      className="sip__head"
                      pathLength={1}
                      suppressHydrationWarning
                      ref={(el) => { wireRefs.current[`${link.id}:b`] = el; }}
                    />
                    {link.pair && (
                      // Traces once along the shaft after it draws — the site's "comet", not a loop.
                      <path
                        className="sip__comet"
                        pathLength={1}
                        suppressHydrationWarning
                        ref={(el) => { wireRefs.current[`${link.id}:comet`] = el; }}
                      />
                    )}
                  </g>
                ))}
              </svg>
            </ol>
          </div>
        </div>

        {/* ── The loop ── */}
        <div className={`sip__loop${loopVisible ? ' is-visible' : ''}`} ref={loopRef}>
          {/* The seam: a hairline with a mono label, the quieter cousin of the
              section rule above — no handles, so the rule keeps its rank. The
              note says the return in words before any wire draws it. */}
          <div className="sip__seam reveal-fade" style={delay(0)}>
            <h3 className="sip__seam-label">The loop</h3>
            <span className="sip__seam-line" aria-hidden="true" />
            <p className="sip__seam-note">
              How the board gets used: four beats, and the fourth feeds the first.
            </p>
          </div>

          <div className="sip__track" ref={trackRef}>
            <ol className="sip__beats" ref={beatsRef} aria-label="The loop, in four beats">
              {BEATS.map((beat, i) => (
                <li
                  key={beat.n}
                  className={`sip__beat sip__beat--${beat.n} reveal-fade${
                    activeBeat === beat.n ? ' is-active' : ''
                  }`}
                  style={delay(80 + i * 80)}
                  ref={(el) => { beatRefs.current[beat.n] = el; }}
                  // Focusable so the keyboard can light the board the way a
                  // hover does. Nothing happens on activation — the highlight
                  // is a lens on the board, and the beat's text already says
                  // what it would show — so it carries no button role.
                  tabIndex={0}
                  onMouseEnter={() => { lastInput.current = 'hover'; setHoveredBeat(beat.n); }}
                  onMouseLeave={() => setHoveredBeat((cur) => (cur === beat.n ? null : cur))}
                  onFocus={() => { lastInput.current = 'focus'; setFocusedBeat(beat.n); }}
                  onBlur={() => setFocusedBeat((cur) => (cur === beat.n ? null : cur))}
                >
                  {beat.n > 1 && (
                    // List mode only: the connector from the beat above, where
                    // no wires are drawn — ⇅ into 03, ↓ into the others.
                    <span className="sip__beat-link" aria-hidden="true">
                      <svg viewBox="0 0 16 32" focusable="false">
                        {beat.n === 3 ? (
                          <path d="M5 4v24M2.5 8l2.5-4 2.5 4M11 28V4M8.5 24l2.5 4 2.5-4" />
                        ) : (
                          <path d="M8 4v24M4 24l4 4 4-4" />
                        )}
                      </svg>
                    </span>
                  )}
                  {/* One template string, not text around an expression: the
                      prerender serialises adjacent text nodes as one, and
                      hydration would then find "[ 01 ]" where React expects
                      "[ 0" — the #418 the header describes. */}
                  <span className="sip__beat-num">{`[ 0${beat.n} ]`}</span>
                  <h4 className="sip__beat-title">{beat.title}</h4>
                  <p className="sip__beat-body">{beat.body}</p>
                </li>
              ))}
            </ol>

            {/* The loop's linework — supplemental to the seam note and each
                beat's own copy. */}
            <svg className="sip__wires sip__wires--loop" aria-hidden="true" focusable="false">
              {LOOP_LINKS.map((link) => (
                <g
                  key={link.id}
                  className={`sip__link sip__link--loop${link.isReturn ? ' sip__link--return' : ''}${
                    activeBeat && link.beats.includes(activeBeat) ? ' is-active' : ''
                  }`}
                  style={delay(link.delay)}
                >
                  <path
                    className="sip__wire"
                    pathLength={1}
                    suppressHydrationWarning
                    ref={(el) => { loopWireRefs.current[`${link.id}:shaft`] = el; }}
                  />
                  <path
                    className="sip__head"
                    pathLength={1}
                    suppressHydrationWarning
                    ref={(el) => { loopWireRefs.current[`${link.id}:a`] = el; }}
                  />
                  <path
                    className="sip__head"
                    pathLength={1}
                    suppressHydrationWarning
                    ref={(el) => { loopWireRefs.current[`${link.id}:b`] = el; }}
                  />
                </g>
              ))}
            </svg>

            {/* The label that rides the return rail (row mode), and the
                return itself where there is no rail (list mode). The slot is
                what the rail is measured from; see the loop effect. */}
            <div className="sip__return-slot" ref={returnSlotRef}>
              <p className="sip__return reveal-fade" style={delay(1000)}>
                <svg className="sip__return-glyph" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path d="M14.5 12.5 A 5.5 5.5 0 1 1 10 4.5" />
                  <path d="M10 4.5 L12.6 2.4 M10 4.5 L12.4 6.8" />
                </svg>
                <span>Back to 01</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemsInPractice;
