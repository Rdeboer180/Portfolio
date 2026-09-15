// Homepage summary of the live Forge build. Scores and classification share its data.

import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { useReveal } from '../hooks/useReveal';
import { glyph } from '../data/talent/glyphs';
import { ATLAS_SKILLS, atlasPoints, evaluateAtlas } from '../data/talent/atlas';
import { RYAN_ATLAS, atlasPools, atlasSpent } from '../data/talent/atlasState';
import { ClassificationEmblem } from './talent/ForgeEmblem';
import { resolveMastery } from '../data/talent/mastery';

const FORGE_STATES = evaluateAtlas(RYAN_ATLAS.allocation);
const FORGE_MASTERY = resolveMastery(FORGE_STATES);
const FORGE_POOLS = atlasPools(RYAN_ATLAS.intake, RYAN_ATLAS.craftCredit, RYAN_ATLAS.priorPracticeYears);
const FORGE_SPENT = atlasSpent(RYAN_ATLAS.allocation);
const FORGE_TOTAL_SPENT = Object.values(FORGE_SPENT).reduce((sum, points) => sum + points, 0);
const FORGE_EARNED = FORGE_STATES.filter((state) => state.rank > 0).length;
const FORGE_MASTERED = ATLAS_SKILLS.filter((skill) => atlasPoints(RYAN_ATLAS.allocation, skill.id) === 5);
const FORGE_TREES = [
  { id: 'design', name: 'Design & Systems', focus: ['typography', 'vector-design', 'tokens', 'governance', 'components', 'accessibility'] },
  { id: 'technical', name: 'Technical', focus: ['figma', 'prototyping', 'storybook', 'handoff', 'ai-tools', 'agent-context'] },
  { id: 'code', name: 'Code', focus: ['css', 'html', 'typescript', 'react-native', 'automation', 'git'] },
] as const;

// ── Copy ─────────────────────────────────────

const EXPLANATION =
  'I put the most weight on visual craft, durable standards, and creative exploration. That means shaping the interface, testing ideas in working prototypes, and giving my teams rules they can build on.';

const BEATS: { title: string; body: string }[] = [
  { title: 'Visual design', body: 'Type, hierarchy, and composition still decide if a screen holds up.' },
  { title: 'Web', body: 'Layout stopped being fixed and became states, breakpoints, and behavior.' },
  { title: 'Systems', body: 'One page at a time did not scale. Tokens and components did.' },
  { title: 'Design to code', body: 'HTML, CSS, and state definitions, so the rule survived the build.' },
  { title: 'Governance', body: 'Standards, accessibility, and QA that hold when I am not in the room.' },
  { title: 'Agent workflows', body: 'Agents help build PlayDraft and LoopStack. I own the product decisions, review, and release.' },
];

const CAVEAT = 'the skills I keep coming back to';
const MESSAGE =
  'The Forge makes that mix visible. Follow the talents into proficiencies, see the work behind them, or build your own combination.';
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
            {`My current focus · ${FORGE_TOTAL_SPENT} of ${FORGE_POOLS.total} points`}
          </p>
          <div className="sm__title-row reveal-fade" style={delay(80)}>
            <ClassificationEmblem domain={FORGE_MASTERY.primary?.id} level={FORGE_MASTERY.primary?.level || 1} />
            <div><h2 className="sm__title">{FORGE_MASTERY.title}</h2>
              <span className="sm__level">{`Class level ${FORGE_MASTERY.primary?.level || 1}/5 · ${FORGE_EARNED} active proficiencies`}</span>
            </div>
          </div>
          <p className="sm__explanation reveal-fade" style={delay(160)}>{EXPLANATION}</p>
        </div>

        {/* ── How the tree grew ── */}
        <div className={`sm__growth${railVisible ? ' is-visible' : ''}`} ref={railRef}>
          <div className="sm__seam reveal-fade" style={delay(0)}>
            <h3 className="sm__seam-label">How the tree grew</h3>
            <span className="sm__seam-line" aria-hidden="true" />
            <p className="sm__seam-note">From visual craft to systems and working products.</p>
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
          {/* A named selection makes the allocation readable without opening the full tree. */}
          <div className="sm__mini reveal-fade" style={delay(0)}>
            <div className="sm__mini-head">
              <span>{`Selected talents · ${FORGE_TREES.length} trees`}</span>
              <span>{`${FORGE_TOTAL_SPENT} points spent · ${FORGE_EARNED} proficiencies active`}</span>
            </div>
            <div className="sm__mini-trees">
              {FORGE_TREES.map((tree) => {
                const skills = tree.focus.map(id => ATLAS_SKILLS.find(skill => skill.id === id)!);
                return <div className={`sm__tree sm__tree--${tree.id}`} key={tree.id}>
                  <div className="sm__tree-head"><span className="sm__tree-name">{tree.name}</span><span className="sm__tree-pts">{`${FORGE_SPENT[tree.id]} pts`}</span></div>
                  <ul className="sm__focus-talents" aria-label={`${tree.name}, selected talents`}>
                    {skills.map(skill => <li key={skill.id}><span>{skill.name}</span><strong>{`${atlasPoints(RYAN_ATLAS.allocation, skill.id)}/5`}</strong></li>)}
                  </ul>
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
            <p className="sm__receipt reveal-fade" style={delay(400)}>The budget includes fourteen professional years, two years of earlier practice, education, and recent practice. Points show where I chose to focus.</p>
            <p className="sm__tools reveal-fade" style={delay(440)}>{TOOLS}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillMastery;
