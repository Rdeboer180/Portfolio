import React, { useState, useRef, useEffect } from 'react';

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
    title: 'Slack → Communication & Collaboration',
    copy: ({ testimonialsHref }) => (
      <>
        I’m known for building trust across UX, engineering, analytics, SEO, and leadership—the kind
        of alignment that makes better work possible.{' '}
        <InlineCTA href={testimonialsHref} label="View Testimonials" />
      </>
    ),
    icon: <img src="/images/proficiencies/slack.svg" alt="" />,
  },
  {
    id: 'figma',
    label: 'Figma',
    title: 'Figma → From Idea to System',
    copy: () => (
      <>
        Figma is where I turn rough ideas into scalable systems—defining interaction patterns,
        component structure, and visual direction teams can actually build from.{' '}
        <InlineCTA href="#/work/wheelrack" label="View the Wheel Rack design system" />
      </>
    ),
    icon: <img src="/images/proficiencies/figma-dark.svg" alt="" />,
  },
  {
    id: 'workfront',
    label: 'Workfront',
    title: 'Workfront → Owning the Outcome',
    copy: () =>
      'Workfront reflects one of my strongest skills: taking loose goals, finding what’s missing, and driving projects forward across research, copy, SEO, and leadership until the work actually meets the objective.',
    icon: <img src="/images/proficiencies/workfront.svg" alt="" />,
  },
  {
    id: 'claude',
    label: 'Claude',
    title: 'Claude → Ideas Brought to Life',
    copy: () => (
      <>
        Claude has reinvigorated how I work—helping me move from idea to functioning interface in
        minutes, not days. I built this portfolio using that workflow.{' '}
        <InlineCTA href="#/design-system" label="View the design system" />
      </>
    ),
    icon: <img src="/images/proficiencies/claude.svg" alt="" />,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    title: 'ChatGPT → Documenting the Steps',
    copy: () => (
      <>
        I use ChatGPT to speed up SEO support, alt text, presentation drafts, and documentation that
        makes systems, components, and tokens easier for teams to use.{' '}
        <InlineCTA href="#/about" label="Read how I think about AI" />
      </>
    ),
    icon: <img src="/images/proficiencies/openai-chatgpt.svg" alt="" />,
  },
  {
    id: 'vscode',
    label: 'VS Code',
    title: 'VS Code → Understanding the Build',
    copy: () =>
      'VS Code is where design gets pressure-tested. After 10+ years building with HTML, CSS3, SCSS, BEM, and WCAG-minded patterns, I know how to refine UI where implementation actually happens.',
    icon: <img src="/images/proficiencies/vscode.svg" alt="" />,
  },
  {
    id: 'aem',
    label: 'Adobe Experience Manager',
    title: 'AEM → Thinking in Components',
    copy: () =>
      'AEM taught me to think beyond pages and into systems—building component patterns that stay flexible for authors, consistent across experiences, and maintainable over time.',
    icon: <img src="/images/proficiencies/experience-manager.svg" alt="" />,
  },
  {
    id: 'adobe-cc',
    label: 'Adobe Creative Cloud',
    title: 'Adobe CC → The Tools That Built My Eye',
    copy: () => (
      <>
        Adobe tools were the first applications that unlocked my craft. Illustrator still feels like
        home—especially in SVG, iconography, and brand systems—and that foundation still shapes how I
        think about polish and visual precision.{' '}
        <InlineCTA href="#/work/tire-categories" label="View the tire category page" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe cc.svg" alt="" />,
  },
  {
    id: 'analytics',
    label: 'Adobe Analytics',
    title: 'Adobe Analytics → Reading the Behavior',
    copy: () => (
      <>
        Analytics helps me understand what users are actually doing—not just what we assume. On Tire
        Rack’s winterization work, it helped shape region-specific experiences based on real seasonal
        behavior.{' '}
        <InlineCTA href="#/work/tire-rack-winter" label="View the winterization case study" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe-analytics.svg" alt="" />,
  },
  {
    id: 'github',
    label: 'GitHub',
    title: 'GitHub → Shipping Thoughtfully',
    copy: () => (
      <>
        GitHub is where ideas become real—helping me work close to versioned code, live implementation,
        and production-ready delivery.{' '}
        <InlineCTA href="#/work/heatherwood" label="View the case study" />
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
        <p className="proficiency-dock__label">How the Work Gets Made</p>
        <p className="proficiency-dock__intro">
          These aren’t just the apps I use—they’re the capabilities they unlock.
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
          <p className="proficiency-dock__panel-eyebrow">Tool in practice</p>
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