import React, { useState } from 'react';

interface Proficiency {
  id: string;
  label: string;
  title: string;
  copy: (ctx: { testimonialsHref: string }) => React.ReactNode;
  icon: React.ReactNode;
}

// Shared inline CTA arrow link used across panel copy
const InlineCTA: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} className="proficiency-dock__panel-inline-cta">
    {label}
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  </a>
);

const proficiencies: Proficiency[] = [
  {
    id: 'slack',
    label: 'Slack',
    title: 'Professional relationships',
    copy: ({ testimonialsHref }) => (
      <>
        The best signal of how I work isn&rsquo;t what I say&mdash;it&rsquo;s what the people I&rsquo;ve worked with say.{' '}
        <InlineCTA href={testimonialsHref} label="View Testimonials" />
      </>
    ),
    icon: <img src="/images/proficiencies/slack.svg" alt="" />,
  },
  {
    id: 'figma',
    label: 'Figma',
    title: 'Systems-first product design',
    copy: () => (
      <>
        I use Figma to define scalable UI, strong interaction patterns, and the structure teams need to ship consistently&mdash;from token architecture to full component libraries.{' '}
        <InlineCTA href="#/work/wheelrack" label="View the Wheel Rack design system" />
      </>
    ),
    icon: <img src="/images/proficiencies/figma-dark.svg" alt="" />,
  },
  {
    id: 'vscode',
    label: 'VS Code',
    title: 'Closer to the build',
    copy: () => 'VS Code lets me inspect, refine, and tighten experiences directly where implementation happens\u2014so design decisions survive the handoff intact.',
    icon: <img src="/images/proficiencies/vscode.svg" alt="" />,
  },
  {
    id: 'aem',
    label: 'Adobe Experience Manager',
    title: 'Enterprise component systems',
    copy: () => 'I\u2019ve built scalable component patterns inside AEM, where design decisions need to hold up across large content ecosystems and stay maintainable for the teams authoring inside them.',
    icon: <img src="/images/proficiencies/experience-manager.svg" alt="" />,
  },
  {
    id: 'claude',
    label: 'Claude',
    title: 'AI-native exploration',
    copy: () => (
      <>
        Claude has reinvigorated how I prototype, reason through complexity, and move from idea to real interface faster. I actually built this entire portfolio site using Claude&mdash;same workflow I cover in my FAQ.{' '}
        <InlineCTA href="#/design-system" label="View the design system" />
      </>
    ),
    icon: <img src="/images/proficiencies/claude.svg" alt="" />,
  },
  {
    id: 'illustrator',
    label: 'Illustrator',
    title: 'Sharp, custom iconography',
    copy: () => (
      <>
        I&rsquo;ve hand-crafted a library of 120+ custom icons deployed across the Tire Rack retail site, including 20+ built specifically for the new tire category experience.{' '}
        <InlineCTA href="#/work/tire-categories" label="View the tire category page" />
      </>
    ),
    icon: <img src="/images/proficiencies/illustrator.svg" alt="" />,
  },
  {
    id: 'photoshop',
    label: 'Photoshop',
    title: 'Image craft and visual exploration',
    copy: () => 'I bring 20+ years of experience in image editing, color correction, and asset refinement. Photoshop supports both precision work and rapid exploration\u2014using generative tools for mockups, concepting, and guiding photography direction when new assets are needed.',
    icon: <img src="/images/proficiencies/photoshop.svg" alt="" />,
  },
  {
    id: 'analytics',
    label: 'Adobe Analytics',
    title: 'Behavior-backed iteration',
    copy: () => (
      <>
        On the Tire Rack winterization project, we used Adobe Analytics to segment the customer base into two groups&mdash;serving distinct experiences to the northern and southern halves of the US based on real seasonal behavior.{' '}
        <InlineCTA href="#/work/tire-rack-winter" label="View the winterization case study" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe-analytics.svg" alt="" />,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    title: 'High-impact workflow acceleration',
    copy: () => (
      <>
        I use ChatGPT to streamline high-impact workflows&mdash;SEO optimization, alt text, structured documentation, and presentation development&mdash;rapidly producing clear, reusable artifacts that support design systems and cross-team alignment.{' '}
        <InlineCTA href="#/about" label="Read how I think about AI" />
      </>
    ),
    icon: <img src="/images/proficiencies/openai-chatgpt.svg" alt="" />,
  },
  {
    id: 'github',
    label: 'GitHub',
    title: 'Design-to-dev continuity',
    copy: () => (
      <>
        I work close to code and versioned systems&mdash;handing off clean, production-ready markup to dev teams or pushing directly to Git myself when the situation calls for it.{' '}
        <InlineCTA href="#/work/heatherwood" label="View the case study" />
      </>
    ),
    icon: <img src="/images/proficiencies/github.svg" alt="" />,
  },
];

interface ProficiencyDockProps {
  testimonialsHref?: string;
}

const ProficiencyDock: React.FC<ProficiencyDockProps> = ({
  testimonialsHref = '#testimonials',
}) => {
  const [activeId, setActiveId] = useState<string>('slack');
  const active = proficiencies.find((p) => p.id === activeId) ?? proficiencies[0];

  return (
    <div className="proficiency-dock">
      <div className="proficiency-dock__left">
        <p className="proficiency-dock__label">Core Proficiencies</p>
        <div
          className="proficiency-dock__row"
          role="tablist"
          aria-label="Select a proficiency"
        >
          {proficiencies.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="proficiency-dock-panel"
                id={`proficiency-dock-tab-${p.id}`}
                className={`proficiency-dock__item${isActive ? ' proficiency-dock__item--active' : ''}`}
                onClick={() => setActiveId(p.id)}
                title={p.label}
              >
                {p.icon}
              </button>
            );
          })}
        </div>
      </div>

      <div className="proficiency-dock__divider" aria-hidden="true" />

      <div
        className="proficiency-dock__panel"
        id="proficiency-dock-panel"
        role="tabpanel"
        aria-labelledby={`proficiency-dock-tab-${active.id}`}
        aria-live="polite"
      >
        <div className="proficiency-dock__panel-body" key={active.id}>
          <p className="proficiency-dock__panel-eyebrow">Active proficiency</p>
          <h3 className="proficiency-dock__panel-title">{active.title}</h3>
          <p className="proficiency-dock__panel-copy">
            {active.copy({ testimonialsHref })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProficiencyDock;
