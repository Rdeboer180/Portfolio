import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scrollBehavior } from '../utils/motion';

interface Proficiency {
  id: string;
  label: string;
  headline: string;
  copy: (ctx: { testimonialsHref: string }) => React.ReactNode;
  icon: React.ReactNode;
}

// Shared inline CTA arrow link used across panel copy
const InlineCTA: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <Link to={href} className="proficiency-dock__panel-inline-cta">
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
  </Link>
);

const proficienciesByIdRaw: Proficiency[] = [
  {
    id: 'slack',
    label: 'Slack',
    headline: 'Give the team the missing context',
    copy: ({ testimonialsHref }) => (
      <>
        I keep UX, engineering, analytics, SEO, and leadership close to the same decision. The work
        moves faster when nobody has to reconstruct the reason behind it.{' '}
        <InlineCTA href={testimonialsHref} label="View Testimonials" />
      </>
    ),
    icon: <img src="/images/proficiencies/slack.svg" alt="" />,
  },
  {
    id: 'figma',
    label: 'Figma',
    headline: 'Turn repeated decisions into a system',
    copy: () => (
      <>
        I use tokens and components to settle the decisions a team should not have to remake on
        every screen.{' '}
        <InlineCTA href="/work/wheelrack" label="See my Figma Design System" />
      </>
    ),
    icon: <img src="/images/proficiencies/figma-dark.svg" alt="" />,
  },
  {
    id: 'workfront',
    label: 'Workfront',
    headline: 'Make loose direction buildable',
    copy: () =>
      'I turn a loose brief into decisions the team can act on, with the research, copy, search needs, owners, and open questions visible.',
    icon: <img src="/images/proficiencies/workfront.svg" alt="" />,
  },
  {
    id: 'claude',
    label: 'Claude / Agentic Coding',
    headline: 'Explore more, keep the final call',
    copy: () => (
      <>
        I use AI to prototype and compare directions sooner. I still choose the references, set the
        constraints, test the result, and decide what earns its way into the product.{' '}
        <InlineCTA href="/work/wheelrack" label="See how I built this portfolio" />
      </>
    ),
    icon: <img src="/images/proficiencies/claude.svg" alt="" />,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    headline: 'Use language tools for real production work',
    copy: () => (
      <>
        I use ChatGPT for first passes on SEO support, alt text, presentations, and system
        documentation, then check each draft against the source and the people who will use it.{' '}
        <InlineCTA href="/about" label="Read how I think about AI" />
      </>
    ),
    icon: <img src="/images/proficiencies/openai-chatgpt.svg" alt="" />,
  },
  {
    id: 'vscode',
    label: 'VS Code',
    headline: 'Test the idea in its real medium',
    copy: () => (
      <>
        I validate interface decisions in code because the browser exposes things a static frame
        cannot: wrapping, state, performance, accessibility, and real content.{' '}
        <InlineCTA href="/work/aem-component-system" label="AEM Core" />{' '}
        <InlineCTA href="/work/tire-categories" label="Tire Categories" />
      </>
    ),
    icon: <img src="/images/proficiencies/vscode.svg" alt="" />,
  },
  {
    id: 'aem',
    label: 'Adobe Experience Manager',
    headline: 'Give authors a system they can reuse',
    copy: () => (
      <>
        I helped build the AEM patterns behind more than 80% of Tire Rack landing pages, including
        the component rules and documentation authors use to make the next page.{' '}
        <InlineCTA href="/work/aem-component-system" label="View AEM Core rebuild" />
      </>
    ),
    icon: <img src="/images/proficiencies/experience-manager.svg" alt="" />,
  },
  {
    id: 'adobe-cc',
    label: 'Adobe Creative Cloud',
    headline: 'The tools that trained my eye',
    copy: () => (
      <>
        Illustrator still feels like home, especially for SVG, iconography, and identity work. The
        construction habits I learned there still shape how I judge an interface at 16 pixels and at
        full scale.{' '}
        <InlineCTA href="/work/tire-categories" label="View the tire category page" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe cc.svg" alt="" />,
  },
  {
    id: 'analytics',
    label: 'Adobe Analytics',
    headline: 'Read what people actually did',
    copy: () => (
      <>
        Analytics gives the assumption something to answer to. On Tire Rack&rsquo;s winterization work,
        seasonal behavior helped shape which regional experiences were worth serving.{' '}
        <InlineCTA href="/work/seasonal-content-system" label="View the winterization case study" />
      </>
    ),
    icon: <img src="/images/proficiencies/adobe-analytics.svg" alt="" />,
  },
  {
    id: 'github',
    label: 'GitHub',
    headline: 'Work in the same place as the build',
    copy: () => (
      <>
        I work in shared repositories, review the implementation, and contribute directly when
        that is the clearest way to keep a design decision intact.{' '}
        <InlineCTA href="/work/aem-component-system" label="Explore implementation" />
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

    row.scrollTo({ left: clamped, behavior: scrollBehavior() });
  }, [activeId]);

  // Roving tabindex: arrow/Home/End move focus and selection across the tablist
  // (WAI-ARIA tabs pattern) so keyboard users don't Tab through every proficiency.
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = proficiencies.length;
    let nextIndex: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + count) % count;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = count - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const next = proficiencies[nextIndex];
    setActiveId(next.id);
    itemRefs.current[next.id]?.focus();
  };

  return (
    <div className="proficiency-dock">
      <div className="proficiency-dock__left">
        <p className="proficiency-dock__intro">
          <span className="proficiency-dock__intro-highlight">
            From decision to implementation
          </span>{' '}
          These tools matter because of the work they let me inspect, change, and ship.
        </p>

        <div className="proficiency-dock__row-wrap">
          <div
            className="proficiency-dock__row"
            role="tablist"
            aria-label="Select a proficiency"
            ref={rowRef}
          >
            {proficiencies.map((p, index) => {
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
                  tabIndex={isActive ? 0 : -1}
                  className={`proficiency-dock__item${isActive ? ' proficiency-dock__item--active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
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
          <p className="proficiency-dock__panel-headline">{active.headline}</p>
          <p className="proficiency-dock__panel-copy">
            {active.copy({ testimonialsHref })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProficiencyDock;
