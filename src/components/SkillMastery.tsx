// ============================================
// SkillMastery: homepage section 05, badged "Mastery"
// Replaces the tools list (TechnicalAbilities, which stays mounted on
// /homepage_template) with a positioning section: the class the talent tree
// computes for Ryan, how the tree grew, a miniature of the tree itself on Ink,
// and the door into /talent-tree/. The copy is the approved Section05
// artboard's, verbatim; every number on the surface is read from the talent
// data module (pools, points, masteries), never typed here.
//
// Hydration rules, same as SystemsInPractice: the prerender serialises the
// live DOM, so the first client render must produce the same element tree.
// Nothing here measures the DOM; the miniature is drawn at fixed geometry
// (three 204 × 156 stages, 20px nodes) as plain SVG from TREES and the
// allocation. Text that mixes copy and numbers is one template string, never
// text nodes around an expression, so the serialised text node matches.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { useReveal } from '../hooks/useReveal';
import type { Allocation, TalentArea, TalentNode, TalentTree } from '../data/talent/types';
import { TREES } from '../data/talent/trees';
import { glyph } from '../data/talent/glyphs';
import { MAX_POINTS_PER_NODE, computePools, isLocked, treeSpend } from '../data/talent/economy';
import { ARCHETYPES } from '../data/talent/archetypes';
import { RYAN_ALLOCATION, RYAN_INTAKE, RYAN_OVERRIDES } from '../data/talent/ryan';
import { buildResult } from '../data/talent/score';

// ── The result, computed once ────────────────────────────────────────────────

const RESULT = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
const POOLS = computePools(RYAN_INTAKE);
const TREE_POINTS = treeSpend(RESULT.allocation, TREES);

const UNLOCKED = RESULT.abilities.filter((a) => a.unlocked);

const NODE_NAMES: Record<string, string> = {};
TREES.forEach((tree) => tree.areas.forEach((a) => a.nodes.forEach((n) => { NODE_NAMES[n.id] = n.name; })));
const nameOf = (id: string) => NODE_NAMES[id] || id;

// ── Copy (Section05 artboard, approved) ─────────────────────────────────────

const EXPLANATION =
  'I build enough structure that experimentation can move fast without turning into chaos. I care about the system underneath the work, and I am happiest turning an uncertain idea into something real enough to test.';

const BEATS: { title: string; body: string }[] = [
  { title: 'Visual design', body: 'Type, hierarchy, and composition still decide if a screen holds up.' },
  { title: 'Web', body: 'Layout stopped being fixed and became states, breakpoints, and behavior.' },
  { title: 'Systems', body: 'One page at a time did not scale. Tokens and components did.' },
  { title: 'Design to code', body: 'HTML, CSS, and state definitions, so the rule survived the build.' },
  { title: 'Governance', body: 'Standards, accessibility, and QA that hold when I am not in the room.' },
  { title: 'Agentic workflows', body: 'Agents build to my rules. PlayDraft and LoopStack are on TestFlight.' },
];

const CAVEAT = 'earned by time, not self-rated';
const MESSAGE =
  'Tools turn over every few years, so instead of listing them I am showing where sixteen years of points went.';
const CTA = 'Explore the full talent tree';
const TOOLS = 'Figma · Illustrator · Storybook · React · React Native · TypeScript · Sass · AEM · Claude Code · MCP';

// ── Glyphs ───────────────────────────────────────────────────────────────────
// The node glyphs are authored as inner SVG markup in glyphs.ts; the renderer
// wraps them. Used at 24px in the badge and at 11px inside the miniature.

const GLYPH_ATTRS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  focusable: 'false' as const,
};

const BadgeGlyph: React.FC<{ k: string }> = ({ k }) => (
  <svg {...GLYPH_ATTRS} aria-hidden="true" dangerouslySetInnerHTML={{ __html: glyph(k) }} />
);

// ── The miniature: node states on Ink at 20px (NodeStates artboard) ─────────
// Percentages are alpha on the named colour. Ramp: 0 unspent · 1 40% · 2 55%
// · 3 70% · 4 85% · 5 100% plus fill, ring, and glow. Glyph and ring take the
// same value. Paths are unlit at 1.4px and lit at 1.6px at the upper node's
// opacity (a root has no points, so its paths take the foundation's).

const ORANGE = '#f03d01';
const INK = '#1b1b1b';
const COOL_PAPER = '#f4f6f7';
const RAMP = [0, 0.4, 0.55, 0.7, 0.85, 1];
const orange = (a: number) => `rgba(240,61,1,${a})`;
const white = (a: number) => `rgba(255,255,255,${a})`;
const steel = (a: number) => `rgba(143,157,175,${a})`;

const STAGE_W = 204;
const STAGE_H = 156;
const NODE_R = 10;
const GLYPH_PX = 11;
const COLUMN_X = [22, 62, 102, 142, 182];
const ROOT = { x: 102, y: 138 };
const FOUNDATION_Y = 72;
const CROWN_Y = 20;
const STEM_TOP = 118; // where the root's stem ends and the five curves begin

type NodeLook = {
  fill?: string;
  ring: string;
  dashed?: boolean;
  glyph: string;
  mastered?: boolean;
};

function lookOf(points: number, locked: boolean): NodeLook {
  if (locked) return { ring: white(0.14), dashed: true, glyph: steel(0.3) };
  if (points <= 0) return { ring: white(0.14), glyph: steel(0.55) };
  if (points >= MAX_POINTS_PER_NODE) return { fill: ORANGE, ring: ORANGE, glyph: INK, mastered: true };
  const a = RAMP[points];
  return { ring: orange(a), glyph: orange(a) };
}

const ROOT_LOOK: NodeLook = { fill: white(0.06), ring: white(0.24), glyph: COOL_PAPER };

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v))) : 0;
}

/**
 * The five columns of a tree stage. The area whose foundation holds the most
 * points takes the centre column, straight above the root, and the other four
 * keep tree order around it (ties go to the earlier area). For Ryan that puts
 * Visual craft, Design systems, and Communication on the stems, which is the
 * arrangement the artboard approved.
 */
function columnsOf(tree: TalentTree, allocation: Allocation): TalentArea[] {
  let centre = 0;
  tree.areas.forEach((area, i) => {
    if (pointsAt(allocation, area.nodes[0].id) > pointsAt(allocation, tree.areas[centre].nodes[0].id)) centre = i;
  });
  const rest = tree.areas.filter((_, i) => i !== centre);
  const mid = Math.floor(rest.length / 2);
  return [...rest.slice(0, mid), tree.areas[centre], ...rest.slice(mid)];
}

const MiniNode: React.FC<{ cx: number; cy: number; node: TalentNode | { glyph: string }; look: NodeLook; glowId: string }> = ({
  cx,
  cy,
  node,
  look,
  glowId,
}) => (
  <g>
    {look.mastered && (
      <>
        {/* glow 0 0 8px 2px at 45%, then the 1px orange ring outside a 1.5px ink gap */}
        <circle cx={cx} cy={cy} r={NODE_R + 2} fill={ORANGE} opacity={0.45} filter={`url(#${glowId})`} />
        <circle cx={cx} cy={cy} r={NODE_R + 2} fill="none" stroke={ORANGE} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={NODE_R + 0.75} fill="none" stroke={INK} strokeWidth={1.5} />
      </>
    )}
    {look.fill && <circle cx={cx} cy={cy} r={NODE_R} fill={look.fill} />}
    {!look.mastered && (
      <circle
        cx={cx}
        cy={cy}
        r={NODE_R - 0.5}
        fill="none"
        stroke={look.ring}
        strokeWidth={1}
        strokeDasharray={look.dashed ? '2.2 2.2' : undefined}
      />
    )}
    <svg
      {...GLYPH_ATTRS}
      x={cx - GLYPH_PX / 2}
      y={cy - GLYPH_PX / 2}
      width={GLYPH_PX}
      height={GLYPH_PX}
      style={{ color: look.glyph }}
      dangerouslySetInnerHTML={{ __html: glyph(node.glyph) }}
    />
  </g>
);

const MiniTree: React.FC<{ tree: TalentTree; allocation: Allocation }> = ({ tree, allocation }) => {
  const columns = columnsOf(tree, allocation);
  const glowId = `sm-glow-${tree.id}`;
  const pathGlowId = `sm-path-glow-${tree.id}`;

  return (
    <div className="sm__tree">
      <div className="sm__tree-head">
        <span className="sm__tree-name">{tree.name}</span>
        <span className="sm__tree-pts">{`${TREE_POINTS[tree.id]} pts`}</span>
      </div>
      <svg
        className="sm__tree-svg"
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        width={STAGE_W}
        height={STAGE_H}
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id={pathGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={ORANGE} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Paths first, so every node sits on top of its own wires. */}
        <path d={`M${ROOT.x} ${ROOT.y - NODE_R}V${STEM_TOP}`} stroke={white(0.24)} strokeWidth={1.4} />
        {columns.map((area, i) => {
          const x = COLUMN_X[i];
          const [foundation, crown] = area.nodes;
          const fp = pointsAt(allocation, foundation.id);
          const cp = isLocked(allocation, crown.id) ? 0 : pointsAt(allocation, crown.id);
          const toFoundation = `M${ROOT.x} ${STEM_TOP}C${ROOT.x} 98 ${x} 104 ${x} ${FOUNDATION_Y + NODE_R}`;
          const toCrown = `M${x} ${FOUNDATION_Y - NODE_R}V${CROWN_Y + NODE_R}`;
          return (
            <g key={area.id}>
              <path
                d={toFoundation}
                stroke={fp > 0 ? orange(RAMP[fp]) : white(0.12)}
                strokeWidth={fp > 0 ? 1.6 : 1.4}
              />
              <path
                d={toCrown}
                stroke={cp > 0 ? orange(RAMP[cp]) : white(0.12)}
                strokeWidth={cp > 0 ? 1.6 : 1.4}
                filter={cp >= MAX_POINTS_PER_NODE ? `url(#${pathGlowId})` : undefined}
              />
            </g>
          );
        })}

        <MiniNode cx={ROOT.x} cy={ROOT.y} node={tree.root} look={ROOT_LOOK} glowId={glowId} />
        <text
          x={ROOT.x + NODE_R + 6}
          y={ROOT.y + 3.5}
          className="sm__tree-root"
        >
          {tree.root.name.toUpperCase()}
        </text>
        {columns.map((area, i) => {
          const x = COLUMN_X[i];
          const [foundation, crown] = area.nodes;
          return (
            <g key={area.id}>
              <MiniNode
                cx={x}
                cy={FOUNDATION_Y}
                node={foundation}
                look={lookOf(pointsAt(allocation, foundation.id), false)}
                glowId={glowId}
              />
              <MiniNode
                cx={x}
                cy={CROWN_Y}
                node={crown}
                look={lookOf(pointsAt(allocation, crown.id), isLocked(allocation, crown.id))}
                glowId={glowId}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────────────────────

const RailArrow: React.FC = () => (
  <span className="sm__beat-link" aria-hidden="true">
    <svg viewBox="0 0 26 12" focusable="false">
      <path d="M4 6h17M17 2.5l4 3.5-4 3.5" />
    </svg>
  </span>
);

const SkillMastery: React.FC = () => {
  const [headRef, headVisible] = useReveal<HTMLDivElement>(0.3);
  const [railRef, railVisible] = useReveal<HTMLDivElement>(0.2);
  const [spreadRef, spreadVisible] = useReveal<HTMLDivElement>(0.15);

  const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` } as React.CSSProperties);

  const masteries = RESULT.mastered.map(nameOf).join(' · ');

  return (
    <section id="mastery" className="sm">
      <div className="sm__container">
        <div className={`sm__head${headVisible ? ' is-visible' : ''}`} ref={headRef}>
          <div className="sm__rule">
            <SectionBadge icon={<BadgeGlyph k="branch" />} label="Mastery" index="05" />
          </div>

          <p className="sm__eyebrow reveal-fade" style={delay(0)}>
            {`Current class · earned by recipe from ${POOLS.total} points`}
          </p>
          <div className="sm__title-row reveal-fade" style={delay(80)}>
            <h2 className="sm__title">
              {RESULT.primary.name}
              <span className="sm__title-slash"> / </span>
              {RESULT.secondary.name}
            </h2>
            <span className="sm__level">{`[ Level ${POOLS.level} Designer ]`}</span>
          </div>
          <p className="sm__explanation reveal-fade" style={delay(160)}>{EXPLANATION}</p>
        </div>

        {/* ── How the tree grew ── */}
        <div className={`sm__growth${railVisible ? ' is-visible' : ''}`} ref={railRef}>
          <div className="sm__seam reveal-fade" style={delay(0)}>
            <h3 className="sm__seam-label">How the tree grew</h3>
            <span className="sm__seam-line" aria-hidden="true" />
            <p className="sm__seam-note">Sixteen years, in the order the points landed.</p>
          </div>

          <ol className="sm__rail" aria-label="How the tree grew, in six beats">
            {BEATS.map((beat, i) => (
              <li key={beat.title} className="sm__beat reveal-fade" style={delay(120 + i * 80)}>
                {i > 0 && <RailArrow />}
                <span className="sm__beat-num">{`[ 0${i + 1} ]`}</span>
                <h4 className="sm__beat-title">{beat.title}</h4>
                <p className="sm__beat-body">{beat.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── The miniature and the door ── */}
        <div className={`sm__spread${spreadVisible ? ' is-visible' : ''}`} ref={spreadRef}>
          {/* The panel's own text (header, tree names and points, the mastered
              line) is the accessible account of the drawing; the SVGs are
              decorative and hidden. */}
          <div className="sm__mini reveal-fade" style={delay(0)}>
            <div className="sm__mini-head">
              <span>{`Ryan's tree · ${TREES.length} lanes · ${RESULT.pointsSpent} points spent`}</span>
              <span>{`${RESULT.mastered.length} masteries at ${MAX_POINTS_PER_NODE} points · ${UNLOCKED.length} abilities`}</span>
            </div>
            <div className="sm__mini-trees">
              {TREES.map((tree) => (
                <MiniTree key={tree.id} tree={tree} allocation={RESULT.allocation} />
              ))}
            </div>
            <div className="sm__mini-foot">
              <span className="sm__mini-dot" aria-hidden="true" />
              <span className="sm__mini-label">Mastered</span>
              <span className="sm__mini-list">{masteries}</span>
            </div>
          </div>

          <div className="sm__aside">
            <p className="sm__caveat reveal-fade" style={delay(200)} aria-hidden="true">
              <svg className="sm__caveat-arrow" viewBox="0 0 40 16" aria-hidden="true" focusable="false">
                <path d="M38 3c-8 8-19 10-33 8M9 7l-4 4 5 3" />
              </svg>
              <span className="sm__caveat-text">{CAVEAT}</span>
            </p>
            <p className="sm__message reveal-fade" style={delay(280)}>{MESSAGE}</p>
            <Link to="/talent-tree/" className="btn btn--primary btn--lg sm__cta reveal-fade" style={delay(360)}>
              {CTA}
              <svg className="sm__cta-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="sm__tools reveal-fade" style={delay(440)}>{TOOLS}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillMastery;
