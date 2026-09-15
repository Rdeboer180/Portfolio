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
import { glyph } from '../data/talent/glyphs';
import { ATLAS_SKILLS, atlasPoints, evaluateAtlas } from '../data/talent/atlas';
import { RYAN_ATLAS, atlasPools, atlasSpent } from '../data/talent/atlasState';
import { resolveMastery } from '../data/talent/mastery';

const FORGE_STATES = evaluateAtlas(RYAN_ATLAS.allocation);
const FORGE_MASTERY = resolveMastery(FORGE_STATES);
const FORGE_POOLS = atlasPools(RYAN_ATLAS.intake, RYAN_ATLAS.craftCredit);
const FORGE_SPENT = atlasSpent(RYAN_ATLAS.allocation);
const FORGE_TOTAL_SPENT = Object.values(FORGE_SPENT).reduce((sum, points) => sum + points, 0);
const FORGE_EARNED = FORGE_STATES.filter((state) => state.rank > 0).length;
const FORGE_MASTERED = ATLAS_SKILLS.filter((skill) => atlasPoints(RYAN_ATLAS.allocation, skill.id) === 5);
const FORGE_TREES = [
  { id: 'design', name: 'Design & Systems' },
  { id: 'technical', name: 'Technical' },
  { id: 'code', name: 'Code' },
] as const;

// ── Copy (Section05 artboard, approved) ─────────────────────────────────────

const EXPLANATION =
  'I spent sixteen years of points where the work actually went. Talents unlock proficiencies, and those proficiencies shape the class. A zero means no points landed there. It does not mean I have never used the skill.';

const BEATS: { title: string; body: string }[] = [
  { title: 'Visual design', body: 'Type, hierarchy, and composition still decide if a screen holds up.' },
  { title: 'Web', body: 'Layout stopped being fixed and became states, breakpoints, and behavior.' },
  { title: 'Systems', body: 'One page at a time did not scale. Tokens and components did.' },
  { title: 'Design to code', body: 'HTML, CSS, and state definitions, so the rule survived the build.' },
  { title: 'Governance', body: 'Standards, accessibility, and QA that hold when I am not in the room.' },
  { title: 'Agentic workflows', body: 'Agents build to my rules. PlayDraft and LoopStack are on TestFlight.' },
];

const CAVEAT = 'points come from experience and education';
const MESSAGE =
  'A job title leaves out too much. The Forge shows the visual craft, systems work, technical practice, and code that make up how I work.';
const CTA = 'Explore my Forge build';
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

  const masteries = FORGE_MASTERED.map((skill) => skill.name).join(' · ');

  return (
    <section id="mastery" className="sm">
      <div className="sm__container">
        <div className={`sm__head${headVisible ? ' is-visible' : ''}`} ref={headRef}>
          <div className="sm__rule">
            <SectionBadge icon={<BadgeGlyph k="branch" />} label="Mastery" index="05" />
          </div>

          <p className="sm__eyebrow reveal-fade" style={delay(0)}>
            {`An experiment · sixteen years allocated as talents · ${FORGE_TOTAL_SPENT} of ${FORGE_POOLS.total} points`}
          </p>
          <div className="sm__title-row reveal-fade" style={delay(80)}>
            <h2 className="sm__title">
              {FORGE_MASTERY.title}
            </h2>
            <span className="sm__level">{`[ ${FORGE_EARNED} proficiencies active ]`}</span>
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
              <span>{`Ryan's Forge · ${FORGE_TREES.length} lanes · ${ATLAS_SKILLS.length} talents`}</span>
              <span>{`${FORGE_TOTAL_SPENT} points spent · ${FORGE_EARNED} proficiencies active`}</span>
            </div>
            <div className="sm__mini-trees">
              {FORGE_TREES.map((tree) => {
                const skills = ATLAS_SKILLS.filter((skill) => skill.territory === tree.id);
                return <div className="sm__tree" key={tree.id}>
                  <div className="sm__tree-head"><span className="sm__tree-name">{tree.name}</span><span className="sm__tree-pts">{`${FORGE_SPENT[tree.id]} pts`}</span></div>
                  <div className="sm__forge-nodes" aria-label={`${tree.name}, ${skills.length} talents`}>
                    {skills.map((skill) => <span key={skill.id} aria-hidden="true" title={`${skill.name}: ${atlasPoints(RYAN_ATLAS.allocation, skill.id)} of 5`} data-points={atlasPoints(RYAN_ATLAS.allocation, skill.id)} />)}
                  </div>
                </div>;
              })}
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
