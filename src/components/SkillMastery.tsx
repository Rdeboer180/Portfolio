import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { ClassificationEmblem } from './talent/ForgeEmblem';
import { evaluateAtlas, atlasPoints } from '../data/talent/atlas';
import { RYAN_ATLAS } from '../data/talent/atlasState';
import { resolveMastery } from '../data/talent/mastery';

// ============================================
// 05 / Capabilities (concept 11, Ryan's pick, 22 October; simplified after
// the audit the same day). One key says how the work was done: solid is
// hands-on, dashed is directed (agents built it; Ryan reviewed, tested and
// released), double is partnered (an engineer built it). It is drawn only
// where it carries information: after each project link (and on the one
// agent-built workflow step). The Forge numbers live in the
// lanes alone and are read from RYAN_ATLAS, never typed here.
// ============================================

type Mode = 'hands-on' | 'directed' | 'partnered';

/** A line drawn in the key's style. Decorative: the mode is also given as text. */
const KeyLine: React.FC<{ mode: Mode; accent?: boolean }> = ({ mode, accent }) => (
  <svg className={`sm__line${accent ? ' sm__line--accent' : ''}`} viewBox="0 0 28 10" aria-hidden="true" focusable="false">
    {mode === 'partnered'
      ? <path d="M1 2.5H27M1 7.5H27" />
      : <path d="M1 5H27" strokeDasharray={mode === 'directed' ? '5 3.5' : undefined} />}
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  craft: <path d="M5 7V4h14v3M12 4v16M9 20h6" />,
  systems: <><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" /><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" /><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" /><rect x="14" y="14" width="6.5" height="6.5" rx="1.5" /></>,
  aem: <><rect x="3" y="4" width="18" height="6.5" rx="1.5" /><rect x="3" y="13.5" width="18" height="6.5" rx="1.5" /><path d="M6.5 7.25h.01M6.5 16.75h.01" /></>,
  implementation: <path d="M10 3L8 21M16 3l-2 18M4 9h17M3 15h17" />,
  agentic: <path d="M12 3.5c0 4.7 3.8 8.5 8.5 8.5-4.7 0-8.5 3.8-8.5 8.5 0-4.7-3.8-8.5-8.5-8.5 4.7 0 8.5-3.8 8.5-8.5z" />,
};

const points = (id: string) => atlasPoints(RYAN_ATLAS.allocation, id);
const mastery = resolveMastery(evaluateAtlas(RYAN_ATLAS.allocation));

interface Use { title: string; href: string; mode?: Mode }
interface Capability {
  name: string;
  icon: string;
  /** One capability wears the accent, the way one section does. */
  accent?: boolean;
  used: Use[];
  props: Array<{ label: string; text: string }>;
  practice: string;
}

// Line styles come from evidence.ts and the copy itself: WheelRack's React
// build was Cheryl Carpenter's, PlayDraft was built with agents, the AEM Sass
// is Ryan's. A project whose split isn't on record carries no line yet.
const capabilities: Capability[] = [
  {
    name: 'Visual craft & prototyping',
    icon: 'craft',
    // The two prototype notes' components were built by Claude Code from
    // Ryan's spec and PlayDraft's own rules, so they carry the directed line.
    used: [
      { title: 'Heatherwood', href: '/work/heatherwood/', mode: 'hands-on' },
      { title: 'WheelRack prototype', href: '/notes/prototyping-wheelrack-fitment/', mode: 'directed' },
      { title: 'PlayDraft prototype', href: '/notes/playdraft-pick-on-the-clock/', mode: 'directed' },
    ],
    props: [{ label: 'Tools', text: 'Figma · Illustrator · Photoshop · Figma Make' }],
    practice: 'Identity, type and interface design, carried into a site the owner can maintain.',
  },
  {
    name: 'Design systems & governance',
    icon: 'systems',
    accent: true,
    used: [
      { title: 'WheelRack', href: '/work/wheelrack/', mode: 'partnered' },
      { title: 'PlayDraft', href: '/work/playdraft/', mode: 'directed' },
    ],
    props: [{ label: 'Tools', text: 'Figma Variables · Tokens Studio · Storybook' }],
    practice: 'Component contracts, states and tokens at Tire Rack, and a React Native system for PlayDraft.',
  },
  {
    name: 'AEM & content systems',
    icon: 'aem',
    used: [
      { title: 'AEM component system', href: '/work/aem-component-system/', mode: 'hands-on' },
      { title: 'Tire category system', href: '/work/tire-categories/' },
    ],
    props: [{ label: 'Tools', text: 'Adobe Experience Manager · Adobe Target' }],
    practice: 'Core-component variants, and Experience Fragments for A/B tests and geographic targeting.',
  },
  {
    name: 'Product implementation',
    icon: 'implementation',
    used: [],
    props: [
      { label: 'Direct', text: 'HTML · CSS/Sass · AEM · WordPress' },
      { label: 'Agent-assisted', text: 'React · React Native · Expo · TypeScript/TSX' },
      { label: 'Quality', text: 'Accessibility annotations · A/B testing · Adobe Analytics' },
    ],
    practice: 'Hands-on web and CMS work, agent builds I direct, and the QA and release decisions.',
  },
  {
    name: 'Agentic systems & tooling',
    icon: 'agentic',
    used: [{ title: 'Design enablement tools', href: '/work/design-enablement/' }],
    props: [
      { label: 'Reasoning', text: 'Claude · ChatGPT' },
      { label: 'Build', text: 'Claude Code · Codex' },
      { label: 'Context', text: 'Figma MCP · MCP workflows' },
    ],
    practice: 'Design-system rules agents can read, plus skills, Figma plugins and codebase audits.',
  },
];

// How a prototype becomes a rule. Only the agent-built step carries the key.
const workflow: Array<{ title: string; text: string; mode?: Mode }> = [
  { title: 'Shape it in Figma', text: 'Components, variants and tokens, kept in step with code.' },
  { title: 'Prototype it in code', text: 'When a static comp can’t answer the question, Figma MCP carries it into a working prototype.', mode: 'directed' },
  { title: 'Write down what it settled', text: 'One HTML file shows the rule and every state it has to handle.' },
  { title: 'Build and check against it', text: 'Engineers and agents build from that file, and QA checks against it.' },
];

// The Forge, drawn: each lane's top talents. Directed talents keep a dashed ring.
const lanes: Array<{ name: string; talents: Array<{ id: string; name: string; directed?: boolean }> }> = [
  { name: 'Design', talents: [
    { id: 'typography', name: 'Typography' }, { id: 'tokens', name: 'Tokens' },
    { id: 'vector-design', name: 'Vector Design' }, { id: 'governance', name: 'Governance' },
  ] },
  { name: 'Technical', talents: [
    { id: 'figma', name: 'Figma' }, { id: 'handoff', name: 'Handoff' },
    { id: 'ai-tools', name: 'AI tools' }, { id: 'agent-context', name: 'Agent context' },
  ] },
  { name: 'Code', talents: [
    { id: 'css', name: 'CSS/SASS' }, { id: 'html', name: 'HTML' },
    { id: 'typescript', name: 'TypeScript', directed: true }, { id: 'react-native', name: 'React Native', directed: true },
  ] },
];

const Pips: React.FC<{ value: number }> = ({ value }) => (
  <span className={`sm__pips${value >= 5 ? ' sm__pips--max' : ''}`}>
    {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= value ? 'is-on' : undefined} aria-hidden="true" />)}
    <span className="sr-only">{value} of 5 points</span>
  </span>
);

const SkillMastery: React.FC = () => (
  // Preserve existing homepage anchors while making capabilities the primary content.
  <section id="mastery" className="sm" aria-labelledby="capabilities-title">
    <div className="sm__container">
      <ScrollReveal>
      <div className="sm__rule">
        <SectionBadge index="05" label="Capabilities" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" /></svg>} />
      </div>
      <h2 id="capabilities-title" className="sm__title">What I bring to a product team.</h2>
      <p className="sm__intro">Visual craft and design systems are my strongest ground. I carry that work into products through hands-on web implementation and agent-assisted React and React Native builds.</p>
      {/* The key, in one line: short words, the meaning kept. */}
      <ul className="sm__key" aria-label="How the work was done">
        <li><KeyLine mode="hands-on" /><span><strong>Hands-on</strong></span></li>
        <li><KeyLine mode="directed" /><span><strong>Directed</strong>: agents built it, I reviewed and released it</span></li>
        <li><KeyLine mode="partnered" /><span><strong>Partnered</strong>: I designed it, an engineer built it</span></li>
      </ul>
      </ScrollReveal>

      <div className="sm__columns" aria-hidden="true">
        <span className="sm__label">Capability · used in</span>
        <span className="sm__label">Properties</span>
        <span className="sm__label">In practice</span>
      </div>
      <div className="sm__capabilities">
        {capabilities.map((row) => <ScrollReveal key={row.name}><section className="sm__capability" aria-label={row.name}>
          <div className="sm__name">
            <svg className={`sm__icon${row.accent ? ' sm__icon--accent' : ''}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[row.icon]}</svg>
            <h3>{row.name}</h3>
            {row.used.length > 0 && <ul className="sm__used">
              {row.used.map((use) => <li key={use.title}>
                <Link to={use.href}>{use.title} <span aria-hidden="true">↗</span></Link>
                {use.mode && <><KeyLine mode={use.mode} accent={row.accent} /><span className="sr-only"> ({use.mode})</span></>}
              </li>)}
            </ul>}
          </div>
          {/* One fixed label column in every row, so the values line up down the section. */}
          <dl className="sm__props">
            {row.props.map((prop) => <div className="sm__prop" key={prop.text}>
              <dt>{prop.label}</dt>
              <dd>{prop.text}</dd>
            </div>)}
          </dl>
          <p className="sm__practice">{row.practice}</p>
        </section></ScrollReveal>)}
      </div>

      {/* How a prototype becomes a rule: a true sequence, so it keeps its numerals. */}
      <ScrollReveal><section className="sm__workflow" aria-labelledby="workflow-title">
        <h3 id="workflow-title">How I prototype: from a Figma comp to a rule the team can build from.</h3>
        <ol>
          {workflow.map((step, i) => <li key={step.title}>
            <span className="sm__step-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h4>{step.title}</h4>
            <p>{step.text}</p>
            {step.mode && <span className="sm__step-mode"><KeyLine mode={step.mode} />agents build it, I review it</span>}
          </li>)}
        </ol>
      </section></ScrollReveal>

      <ScrollReveal><section className="sm__forge" aria-labelledby="forge-teaser-title">
        <div className="sm__forge-copy">
          <div className="sm__class">
            <ClassificationEmblem domain={mastery.primary?.id} level={mastery.primary?.level || 1} />
            <strong>{mastery.title}</strong>
          </div>
          <h3 id="forge-teaser-title">How these skills connect.</h3>
          <p>I built the Forge to map the mix behind my work. Explore my talent tree, or build your own.</p>
          <p className="sm__forge-links">
            <Link to="/talent-tree/">Explore the Forge <span aria-hidden="true">↗</span></Link>
            <Link to="/talent-tree/build/">Build your own <span aria-hidden="true">↗</span></Link>
          </p>
        </div>
        {/* Phones get the class, the line and the links; the lanes are desktop's. */}
        <figure className="sm__lanes" aria-labelledby="lanes-title">
          <figcaption id="lanes-title" className="sm__lanes-head">Top talents in my build, points of 5</figcaption>
          <div className="sm__lanes-body">
            {lanes.map((lane) => <div className="sm__lane" key={lane.name}>
              <p className="sm__lane-name">{lane.name}</p>
              <ul>
                {lane.talents.map((t) => {
                  const value = points(t.id);
                  return <li key={t.id} className={`sm__node${value >= 5 ? ' sm__node--max' : ''}${t.directed ? ' sm__node--directed' : ''}`}>
                    <span className="sm__node-ring" aria-hidden="true" />
                    <span className="sm__node-name">{t.name}{t.directed && <span className="sr-only"> (directed)</span>}</span>
                    <Pips value={value} />
                  </li>;
                })}
              </ul>
            </div>)}
          </div>
          <p className="sm__lanes-note">Orange is 5 of 5. Points come from years of practice; where they go is my call.</p>
        </figure>
      </section></ScrollReveal>
    </div>
  </section>
);

export default SkillMastery;
