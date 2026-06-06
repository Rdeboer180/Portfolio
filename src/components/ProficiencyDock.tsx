import React, { useState, useRef, useEffect } from 'react';

interface Proficiency {
  id: string;
  label: string;
  headline: string;
  copy: (ctx: { testimonialsHref: string }) => React.ReactNode;
  icon: React.ReactNode;
}

// Shared inline CTA arrow link used across panel copy
const InlineCTA: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} className="proficiency-dock__panel-inline-cta">
    {label}
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  </a>
);

const proficienciesByIdRaw: Proficiency[] = [
  {
    id: 'slack',
    label: 'Slack',
    headline: 'Communication & Collaboration',
    copy: ({ testimonialsHref }) => (
      <>
        A consistent thread across my work is building trust across UX, engineering, analytics, SEO,
        and leadership&mdash;the kind of alignment that makes better work possible.{' '}
        <InlineCTA href={testimonialsHref} label="View Testimonials" />
      </>
    ),
    icon: <img src="/images/proficiencies/slack.svg" alt="" />,
  },
  {
    id: 'figma',
    label: 'Figma',
    headline: 'Designing Systems, Not Screens',
    copy: () => (
      <>
        Building token-driven systems and component libraries that scale across teams, products,
        and platforms.{' '}
        <InlineCTA href="#/work/wheelrack" label="See my Figma Design System" />
      </>
    ),
    icon: <img src="/images/proficiencies/figma-dark.svg" alt="" />,
  },
  {
    id: 'workfront',
    label: 'Workfront',
    headline: 'Project Management',
    copy: () =>
      'Turning loose direction into structured execution\u2014connecting research, copy, SEO, and stakeholders to drive work from ambiguity to shipped.',
    icon: <img src="/images/proficiencies/workfront.svg" alt="" />,
  },
  {
    id: 'claude',
    label: 'Claude / Agentic Coding',
    headline: 'Accelerating Exploration',
    copy: () => (
      <>
        Using AI to rapidly prototype, test variations, and push ideas further&mdash;while
        applying judgment to shape what&rsquo;s worth shipping.{' '}
        <InlineCTA href="#/work/wheelrack" label="See how I built this portfolio" />
      </>
    ),
    icon: <img src="/images/proficiencies/claude.svg" alt="" />,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    headline: 'LLM Integration',
    copy: () => (
      <>
        Using ChatGPT to speed up SEO support, alt text, presentation drafts, and documentation
        that makes systems, components, and tokens easier for teams to understand and use.{' '}
        <InlineCTA href="#/about" label="Read how I think about AI" />
      </>
    ),
    icon: <img src="/images/proficiencies/openai-chatgpt.svg" alt="" />,
  },
  {
    id: 'vscode',
    label: 'VS Code',
    headline: 'Building What Ships',
    copy: () => (
      <>
        Not just designing interfaces, but validating them in code&mdash;bridging design and
        implementation to ensure ideas hold up in real environments.{' '}
        <InlineCTA href="#/work/aem-component-system" label="AEM Core" />{' '}
        <InlineCTA href="#/work/tire-categories" label="Tire Categories" />
      </>
    ),
    icon: <img src="/images/proficiencies/vscode.svg" alt="" />,
  },
  {
    id: 'aem',
    label: 'Adobe Experience Manager',
    headline: 'Scaling Through Systems',
    copy: () => (
      <>
        Led and contributed to design patterns powering 80%+ of Tire Rack landing pages&mdash;building
        reusable components that balance flexibility, performance, and consistency at scale.{' '}
        <InlineCTA href="#/work/aem-component-system" label="View AEM Core rebuild" />
      </>
    ),
    icon: <img src="/images/proficiencies/experience-manager.svg" alt="" />,
  },
  {
    id: 'adobe-cc',
    label: 'Adobe Creative Cloud',
    headline: 'The Tools That Built My Eye',
    copy: () => (
      <>
        Adobe tools were the first applications that unlocked my craft. Illustrator still feels like
        home&mdash;especially in SVG, iconography, and brand systems&mdash;and that foundation still shapes how I
        think about polish and visual precision.{' '}
        <InlineCTA href="#/work/tire-categories" label="View the tire category page" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe cc.svg" alt="" />,
  },
  {
    id: 'analytics',
    label: 'Adobe Analytics',
    headline: 'Reading the Behavior',
    copy: () => (
      <>
        Analytics helps me understand what users are actually doing&mdash;not just what we assume. On Tire
        Rack&rsquo;s winterization work, it helped shape region-specific experiences based on real seasonal
        behavior.{' '}
        <InlineCTA href="#/work/tire-rack-winter" label="View the winterization case study" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe-analytics.svg" alt="" />,
  },
  {
    id: 'github',
    label: 'GitHub',
    headline: 'Collaborating in Code',
    copy: () => (
      <>
        Comfortable working in shared repos, reviewing implementations, and contributing
        directly&mdash;ensuring design intent survives through development.{' '}
        <InlineCTA href="#/work/aem-component-system" label="Explore implementation" />
      </>
    ),
    icon: <img src="/images/proficiencies/github.svg" alt="" />,
  },
];

// Display order (source-of-truth)
const displayOrder = [
  'slack',
  'figma',
  'workfront',
  'claude',
  'chatgpt',
  'vscode',
  'aem',
  'adobe-cc',
  'analytics',
  'github',
];

const proficiencies: Proficiency[] = displayOrder
  .map((id) => proficienciesByIdRaw.find((p) => p.id === id))
  .filter((p): p is Proficiency => p !== undefined);

interface ProficiencyDockProps {
  testimonialsHref?: string;
}

const ProficiencyDock: React.FC<ProficiencyDockProps> = ({
  testimonialsHref = '#testimonials',
}) => {
  const [activeId, setActiveId] = useState<string>('slack');
  const active = proficiencies.find((p) => p.id === activeId) ?? proficiencies[0];

  const rowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const row = rowRef.current;
    const button = itemRefs.current[activeId];
    if (!row || !button) return;

    const rowRect = row.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();
    const btnCenter = btnRect.left - rowRect.left + row.scrollLeft + btnRect.width / 2;
    const targetScroll = btnCenter - rowRect.width / 2;
    const maxScroll = row.scrollWidth - row.clientWidth;
    const clamped = Math.max(0, Math.min(targetScroll, maxScroll));

    row.scrollTo({ left: clamped, behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="proficiency-dock">
      <div className="proficiency-dock__left">
        <p className="proficiency-dock__intro">
          <span className="proficiency-dock__intro-highlight">
            From systems to implementation
          </span>{' '}
          This is how the work actually gets made.
        </p>

        <div className="proficiency-dock__row-wrap">
          <div
            className="proficiency-dock__row"
            role="tablist"
            aria-label="Select a proficiency"
            ref={rowRef}
          >
            {proficiencies.map((p) => {
              const isActive = p.id === activeId;

              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    itemRefs.current[p.id] = el;
                  }}
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
                  <span className="sr-only">{p.label}</span>
                </button>
              );
            })}
          </div>
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
          <p className="proficiency-dock__panel-eyebrow">
            <span className="proficiency-dock__panel-eyebrow-tool">{active.label}</span>
            {' '}&rarr; Capability &rarr; Outcome
          </p>
          <h3 className="proficiency-dock__panel-headline">{active.headline}</h3>
          <p className="proficiency-dock__panel-copy">
            {active.copy({ testimonialsHref })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProficiencyDock;
