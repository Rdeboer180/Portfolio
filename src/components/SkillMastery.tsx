import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { ClassificationEmblem } from './talent/ForgeEmblem';
import { evaluateAtlas } from '../data/talent/atlas';
import { RYAN_ATLAS } from '../data/talent/atlasState';
import { resolveMastery } from '../data/talent/mastery';

const mastery = resolveMastery(evaluateAtlas(RYAN_ATLAS.allocation));
const capabilities = [
  {
    name: 'Visual craft & prototyping',
    tools: [{ text: 'Figma · Illustrator · Photoshop · Figma Make' }],
    practice: 'Interface design, typography, brand expression, vector and raster craft, and high-fidelity prototypes.',
  },
  {
    name: 'Design systems & governance',
    tools: [{ text: 'Figma Variables · Tokens Studio · Storybook' }],
    practice: 'Enterprise web design systems at Tire Rack, with component contracts, states, tokens, documentation, and adoption support. React Native system design through PlayDraft, built with agents and validated in the working app.',
  },
  {
    name: 'AEM & content systems',
    tools: [{ text: 'Adobe Experience Manager · Adobe Target' }],
    practice: 'Core-component variants, reusable component libraries, and template permissions. Experience Fragments for A/B testing and geographic targeting, with authoring, approval, and publishing workflows the team can maintain.',
  },
  {
    name: 'Product implementation',
    tools: [
      { label: 'Direct', text: 'HTML · CSS/Sass · AEM · WordPress' },
      { label: 'Agent-assisted', text: 'React · React Native · Expo · TypeScript/TSX' },
    ],
    practice: 'Hands-on web and CMS delivery. I direct agent-assisted product builds, review the working output, test behavior, and own QA and release decisions.',
  },
  {
    name: 'Agentic systems & tooling',
    tools: [
      { label: 'Reasoning', text: 'Claude · ChatGPT' },
      { label: 'Build', text: 'Claude Code · Codex' },
      { label: 'Context', text: 'Figma MCP · MCP workflows' },
    ],
    practice: 'Agent-readable design-system governance, reusable skills, Figma plugins, internal tools, and codebase audits. Shared context for designers, engineers, and agents.',
  },
  {
    name: 'Product quality & evidence',
    tools: [{ text: 'Adobe Analytics · Adobe Target · A/B testing · Accessibility annotations' }],
    practice: 'Accessibility, SEO-informed structure, state modeling, and edge-case coverage. Design-to-code reconciliation, implementation QA, and decisions grounded in feedback and data.',
  },
];
const evidence = [
  { href: '/work/wheelrack/', label: 'React design system', project: 'WheelRack' },
  { href: '/work/playdraft/', label: 'React Native system', project: 'PlayDraft' },
  { href: '/work/design-enablement/', label: 'Agentic internal tooling', project: 'Design Enablement' },
  { href: '/work/aem-component-system/', label: 'Enterprise component system', project: 'AEM' },
];

/** Figma's instance diamond. Each capability is an instance, not a loose list row. */
const InstanceGlyph = () => (
  <svg className="sm__glyph" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 1.3 10.7 6 6 10.7 1.3 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
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
      </ScrollReveal>
      <div className="sm__capabilities">
        {capabilities.map(row => <ScrollReveal key={row.name}><section className="sm__capability" aria-label={row.name}>
          <h3><InstanceGlyph />{row.name}</h3>
          {/* The labelled entries were already variant properties in the data;
              the panel just stops hiding them inside a sentence. */}
          <div className="sm__stack"><p className="sm__label">Properties</p>
            <dl className="sm__props">
              {row.tools.map(tool => <div className="sm__prop" key={tool.text}>
                <dt>{'label' in tool ? tool.label : 'stack'}</dt>
                <dd>{tool.text}</dd>
              </div>)}
            </dl>
          </div>
          <div className="sm__practice"><p className="sm__label">In practice</p><p>{row.practice}</p></div>
        </section></ScrollReveal>)}
      </div>
      {/* Figma states an instance count before it lists the places. Four links, four places. */}
      <ScrollReveal><nav className="sm__evidence" aria-label="Capabilities in practice"><span className="sm__label">Used in {evidence.length} places</span><ul>{evidence.map(item => <li key={item.href}><Link to={item.href}>{item.label}<span>{item.project} <span aria-hidden="true">↗</span></span></Link></li>)}</ul></nav></ScrollReveal>
      <ScrollReveal><section className="sm__forge" aria-labelledby="forge-teaser-title">
        <ClassificationEmblem domain={mastery.primary?.id} level={mastery.primary?.level || 1} />
        <div><p className="sm__label">A different way to explore</p><h3 id="forge-teaser-title">How these skills connect.</h3><p>I built the Forge to map the mix behind my work. Explore my talent tree, or build your own.</p></div>
        <Link to="/talent-tree/">Explore the Forge <span aria-hidden="true">↗</span></Link>
      </section></ScrollReveal>
    </div>
  </section>
);

export default SkillMastery;
