import React, { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import Tabs from './Tabs';
import SectionBadge from './SectionBadge';
import PageHeader from './PageHeader';
import TestimonialCard from './TestimonialCard';
import CaseStudyCard from './CaseStudyCard';
import '../styles/styles.scss';

// ============================================
// Data
// ============================================

const colorGroups = [
  {
    title: 'Primary (Orange)',
    colors: [
      { name: 'primary-light', value: '#fdede9', css: '--color-primary-light' },
      { name: 'primary-muted', value: '#f07654', css: '--color-primary-muted' },
      { name: 'primary', value: '#f03d01', css: '--color-primary', light: true },
      { name: 'primary-dark', value: '#c23001', css: '--color-primary-dark', light: true },
    ],
  },
  {
    title: 'Neutral',
    colors: [
      { name: 'neutral-lightest', value: '#f5f5f5', css: '--color-neutral-lightest' },
      { name: 'neutral-light', value: '#e5e5e5', css: '--color-neutral-light' },
      { name: 'neutral-muted', value: '#707070', css: '--color-neutral-muted', light: true },
      { name: 'neutral-standard', value: '#4a4a4a', css: '--color-neutral-standard', light: true },
      { name: 'neutral-dark', value: '#1b1b1b', css: '--color-neutral-dark', light: true },
    ],
  },
  {
    title: 'Secondary (Blue-Gray)',
    colors: [
      { name: 'secondary-light', value: '#f4f6f7', css: '--color-secondary-light' },
      { name: 'secondary-muted', value: '#d6dce4', css: '--color-secondary-muted' },
      { name: 'secondary', value: '#8f9daf', css: '--color-secondary', light: true },
      { name: 'secondary-dark', value: '#5e6c7c', css: '--color-secondary-dark', light: true },
    ],
  },
];

const typeScale = [
  { name: 'H1', size: '38px', leading: '45.6px', weight: 700, font: 'heading', sample: 'Product Design Engineer' },
  { name: 'H2', size: '34px', leading: '40.8px', weight: 700, font: 'heading', sample: 'Section Heading' },
  { name: 'H3', size: '30px', leading: '36px', weight: 700, font: 'heading', sample: 'Card Title' },
  { name: 'H4', size: '26px', leading: '31.2px', weight: 700, font: 'heading', sample: 'Subsection' },
  { name: 'H5', size: '22px', leading: '26.4px', weight: 700, font: 'heading', sample: 'Small Heading' },
  { name: 'Body LG', size: '18px', leading: '28px', weight: 400, font: 'body', sample: 'Large body text for introductions and lead paragraphs.' },
  { name: 'Body', size: '16px', leading: '25.6px', weight: 400, font: 'body', sample: 'Standard body text used throughout the site for readable content.' },
  { name: 'Body SM', size: '14px', leading: '20px', weight: 400, font: 'body', sample: 'Smaller body text for secondary information and labels.' },
  { name: 'Caption', size: '12px', leading: '16px', weight: 400, font: 'body', sample: 'Caption text for metadata and fine print.' },
];

const spacingScale = [
  { name: 'xs', value: '6px' },
  { name: 'sm', value: '8px' },
  { name: 'md', value: '12px' },
  { name: 'lg', value: '16px' },
  { name: 'xl', value: '24px' },
  { name: '2xl', value: '32px' },
  { name: '3xl', value: '48px' },
  { name: '4xl', value: '64px' },
];

const radiusScale = [
  { name: 'sm', value: '6px' },
  { name: 'md', value: '8px' },
  { name: 'lg / btn', value: '10px' },
  { name: 'xl / card', value: '12px' },
  { name: '2xl / card-lg', value: '16px' },
  { name: 'full', value: '9999px' },
];

const iconSizes = [
  { name: 'sm', value: '16px' },
  { name: 'md', value: '24px' },
  { name: 'lg', value: '32px' },
  { name: 'xl', value: '48px' },
];

const mainTabs = [
  { label: 'Atoms', value: 'atoms' },
  { label: 'Molecules', value: 'molecules' },
];

const demoTabs = [
  { label: 'Featured', value: 'featured' },
  { label: 'UX / UI', value: 'ux-ui' },
  { label: 'Design Systems', value: 'design-systems' },
  { label: 'Brand Identity', value: 'brand-identity' },
  { label: 'Icon Design', value: 'icon-design' },
  { label: 'Leadership Incentives', value: 'leadership' },
];

// ============================================
// Sub-sections
// ============================================

const AtomsContent: React.FC = () => (
  <>
    {/* ======================== COLORS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Colors</h2>
      {colorGroups.map((group) => (
        <div key={group.title} className="ds__color-group">
          <h3 className="ds__color-group-title">{group.title}</h3>
          <div className="ds__color-row">
            {group.colors.map((color) => (
              <div key={color.name} className="ds__color-card">
                <div
                  className="ds__color-swatch"
                  style={{ backgroundColor: color.value }}
                >
                  <span className={`ds__color-hex ${color.light ? 'ds__color-hex--light' : ''}`}>
                    {color.value}
                  </span>
                </div>
                <div className="ds__color-info">
                  <span className="ds__color-name">{color.name}</span>
                  <code className="ds__color-var">{color.css}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>

    {/* ======================== TYPOGRAPHY ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Typography</h2>
      <div className="ds__type-info">
        <div className="ds__type-family">
          <h4 className="ds__type-family-name" style={{ fontFamily: 'var(--font-heading)' }}>
            Hubot Sans
          </h4>
          <p className="ds__type-family-role">Headings &amp; Buttons</p>
        </div>
        <div className="ds__type-family">
          <h4 className="ds__type-family-name" style={{ fontFamily: 'var(--font-body)' }}>
            Inter
          </h4>
          <p className="ds__type-family-role">Body &amp; UI Text</p>
        </div>
      </div>
      <div className="ds__type-scale">
        {typeScale.map((item) => (
          <div key={item.name} className="ds__type-row">
            <div className="ds__type-meta">
              <span className="ds__type-label">{item.name}</span>
              <span className="ds__type-specs">
                {item.size} / {item.leading} · {item.weight}
              </span>
            </div>
            <p
              className="ds__type-sample"
              style={{
                fontSize: item.size,
                lineHeight: item.leading,
                fontWeight: item.weight,
                fontFamily: item.font === 'heading' ? 'var(--font-heading)' : 'var(--font-body)',
              }}
            >
              {item.sample}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== FONT WEIGHTS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Font Weights</h2>
      <div className="ds__weight-grid">
        {[
          { name: 'Regular', value: 400 },
          { name: 'Medium', value: 500 },
          { name: 'SemiBold', value: 600 },
          { name: 'Bold', value: 700 },
          { name: 'ExtraBold', value: 800 },
        ].map((w) => (
          <div key={w.value} className="ds__weight-card">
            <span className="ds__weight-sample" style={{ fontWeight: w.value, fontFamily: 'var(--font-heading)' }}>
              Aa
            </span>
            <span className="ds__weight-name">{w.name}</span>
            <code className="ds__weight-value">{w.value}</code>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== SPACING ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Spacing</h2>
      <div className="ds__spacing-scale">
        {spacingScale.map((s) => (
          <div key={s.name} className="ds__spacing-row">
            <code className="ds__spacing-label">--space-{s.name}</code>
            <div className="ds__spacing-bar" style={{ width: s.value }} />
            <span className="ds__spacing-value">{s.value}</span>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== BORDER RADIUS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Border Radius</h2>
      <div className="ds__radius-grid">
        {radiusScale.map((r) => (
          <div key={r.name} className="ds__radius-card">
            <div className="ds__radius-preview" style={{ borderRadius: r.value }} />
            <span className="ds__radius-name">{r.name}</span>
            <code className="ds__radius-value">{r.value}</code>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== ICONS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Icon Sizes</h2>
      <div className="ds__icon-grid">
        {iconSizes.map((icon) => (
          <div key={icon.name} className="ds__icon-card">
            <div
              className="ds__icon-preview"
              style={{ width: icon.value, height: icon.value }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="ds__icon-name">--icon-{icon.name}</span>
            <code className="ds__icon-value">{icon.value}</code>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== SHADOWS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Shadows</h2>
      <div className="ds__shadow-grid">
        {['sm', 'md', 'lg', 'xl'].map((size) => (
          <div key={size} className="ds__shadow-card" style={{ boxShadow: `var(--shadow-${size})` }}>
            <span className="ds__shadow-name">--shadow-{size}</span>
          </div>
        ))}
      </div>
    </section>

    {/* ======================== ACCESSIBILITY ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Accessibility</h2>
      {/* Ratios are computed from the token values at render time, not typed
          in. Two of these were previously hand-written and wrong — "Primary on
          White" published 4.6:1 for a pair that measures 3.91:1, and "Muted on
          White" published 4.5:1 against a #7a7a7a that isn't even a token
          (the real one, #707070, passes at 4.95:1). A design-system page that
          certifies a failing ratio is worse than one that says nothing. */}
      <div className="ds__a11y-grid">
        {A11Y_PAIRS.map((pair) => {
          const ratio = contrastRatio(pair.fg, pair.bg);
          const passes = ratio >= (pair.large ? 3 : 4.5);
          return (
            <div className="ds__a11y-card" key={pair.label}>
              <div
                className="ds__a11y-contrast"
                style={{
                  backgroundColor: pair.bg,
                  color: pair.fg,
                  border: pair.bg === '#ffffff' ? '1px solid #e5e5e5' : undefined,
                }}
              >
                Aa
              </div>
              <span>{pair.label}</span>
              <code>
                {ratio.toFixed(2)}:1 {passes ? '✓' : '✗'}
              </code>
            </div>
          );
        })}
      </div>
      <p className="ds__a11y-note">Minimum contrast ratio: 4.5:1 (WCAG AA)</p>
    </section>
  </>
);

const moleculeTabs = [
  { label: 'Navigation', value: 'navigation' },
  { label: 'Cards', value: 'cards' },
];

// --- SVG Icons for SectionBadge demos ---
const ThumbsUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" /><path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

// --- Navigation Sub-tab Content ---
const NavigationContent: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('featured');

  return (
    <>
      {/* ======================== SECTION BADGE ======================== */}
      <section className="ds__section">
        <h2 className="ds__section-title">Section Badge</h2>
        <div className="ds__component-showcase">
          <div className="ds__component-preview" style={{ gap: '16px' }}>
            <SectionBadge icon={<ThumbsUpIcon />} label="References" />
            <SectionBadge icon={<CheckCircleIcon />} label="Why Me?" />
            <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" />
          </div>
          <div className="ds__component-meta">
            <h4 className="ds__subsection-title">Specs</h4>
            <div className="ds__spec-table">
              <div className="ds__spec-row">
                <span className="ds__spec-label">Container</span>
                <code className="ds__spec-value">bg: #f5f5f5 · radius: 9999px · padding: 8px 24px</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Icon</span>
                <code className="ds__spec-value">24px · color: #1b1b1b</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Label</span>
                <code className="ds__spec-value">Hubot Sans Bold · 14px · uppercase · letter-spacing: 0.08em</code>
              </div>
            </div>
          </div>
          <div className="ds__component-usage">
            <h4 className="ds__subsection-title">Usage</h4>
            <pre className="ds__code-block">
{`import SectionBadge from './components/SectionBadge';

<SectionBadge
  icon={<BriefcaseIcon />}
  label="Case Studies"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* ======================== PAGE HEADER ======================== */}
      <section className="ds__section">
        <h2 className="ds__section-title">Page Header</h2>
        <div className="ds__component-showcase">
          <div className="ds__component-preview">
            <PageHeader
              title="About"
              subtitle="Hey there! I'm the face behind the designs. Get to know me, my journey, and what makes me tick."
              backLink={{ label: 'Back to Portfolio', href: '#' }}
            />
          </div>
          <div className="ds__component-meta">
            <h4 className="ds__subsection-title">Specs</h4>
            <div className="ds__spec-table">
              <div className="ds__spec-row">
                <span className="ds__spec-label">Title</span>
                <code className="ds__spec-value">Hubot Sans Bold · 38px / 45.6px · #1b1b1b</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Subtitle</span>
                <code className="ds__spec-value">Inter · 18px / 28px · #707070 · max-width: 600px</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Back link</span>
                <code className="ds__spec-value">Inter · 14px · #f03d01</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Divider</span>
                <code className="ds__spec-value">1px solid #e5e5e5 · margin-bottom: 48px</code>
              </div>
            </div>
          </div>
          <div className="ds__component-usage">
            <h4 className="ds__subsection-title">Usage</h4>
            <pre className="ds__code-block">
{`import PageHeader from './components/PageHeader';

<PageHeader
  title="About"
  subtitle="A brief introduction..."
  backLink={{ label: 'Back to Portfolio', href: '/' }}
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* ======================== TABS ======================== */}
      <section className="ds__section">
        <h2 className="ds__section-title">Tabs</h2>
        <div className="ds__component-showcase">
          <div className="ds__component-preview">
            <Tabs tabs={demoTabs} activeTab={activeDemo} onChange={setActiveDemo} />
          </div>
          <div className="ds__component-meta">
            <h4 className="ds__subsection-title">Specs</h4>
            <div className="ds__spec-table">
              <div className="ds__spec-row">
                <span className="ds__spec-label">Container</span>
                <code className="ds__spec-value">bg: white · border: 0.5px solid #707070 · radius: 12px · padding: 4.5px</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Tab</span>
                <code className="ds__spec-value">height: 36px · px: 24px · py: 8px · radius: 8px</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Font</span>
                <code className="ds__spec-value">Hubot Sans Medium · 14px / 20px</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Active</span>
                <code className="ds__spec-value">bg: #f03d01 · color: white</code>
              </div>
              <div className="ds__spec-row">
                <span className="ds__spec-label">Inactive</span>
                <code className="ds__spec-value">bg: transparent · color: #4a4a4a</code>
              </div>
            </div>
          </div>
          <div className="ds__component-usage">
            <h4 className="ds__subsection-title">Usage</h4>
            <pre className="ds__code-block">
{`import Tabs from './components/Tabs';

<Tabs
  tabs={[
    { label: 'Featured', value: 'featured' },
    { label: 'UX / UI', value: 'ux-ui' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>`}
            </pre>
          </div>
        </div>
      </section>
    </>
  );
};

// --- Cards Sub-tab Content ---
const CardsContent: React.FC = () => (
  <>
    {/* ======================== TESTIMONIAL CARD ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Testimonial Card</h2>
      <div className="ds__component-showcase">
        <div className="ds__component-preview">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            {/* Placeholder content, deliberately generic. This page is a
                component gallery, not a portfolio surface — inventing a named
                reviewer or a real employer here would read as an endorsement
                or as employment history, which PRODUCT.md forbids outright.
                The real, attributed testimonials live in Testimonials.tsx. */}
            <TestimonialCard
              name="Reviewer Name"
              role="Job Title"
              rating={5}
              quote="Placeholder quote text showing how a testimonial wraps across two or three lines inside the card at its default width."
            />
            <TestimonialCard
              name="Reviewer Name"
              role="Job Title"
              company="Company Name"
              rating={4}
              quote="Shorter placeholder quote, included so the card's vertical rhythm can be checked against an uneven pair."
            />
          </div>
        </div>
        <div className="ds__component-meta">
          <h4 className="ds__subsection-title">Specs</h4>
          <div className="ds__spec-table">
            <div className="ds__spec-row">
              <span className="ds__spec-label">Container</span>
              <code className="ds__spec-value">bg: white · border: 1px solid rgba(27,27,27,0.1) · radius: 12px · padding: 24px</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Avatar</span>
              <code className="ds__spec-value">48px circle · fallback: initial letter on #f5f5f5</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Name</span>
              <code className="ds__spec-value">Inter SemiBold · 14px · #1b1b1b</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Role</span>
              <code className="ds__spec-value">Inter · 12px · #707070</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Rating</span>
              <code className="ds__spec-value">14px filled stars · color: #f03d01</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Quote</span>
              <code className="ds__spec-value">Inter · 14px / 20px · #4a4a4a</code>
            </div>
          </div>
        </div>
        <div className="ds__component-usage">
          <h4 className="ds__subsection-title">Usage</h4>
          <pre className="ds__code-block">
{`import TestimonialCard from './components/TestimonialCard';

<TestimonialCard
  avatarSrc={author.avatar}
  name={author.name}
  role={author.role}
  company={author.company}
  rating={author.rating}
  quote={author.quote}
/>`}
          </pre>
        </div>
      </div>
    </section>

    {/* ======================== CASE STUDY CARD ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Case Study Card</h2>
      <div className="ds__component-showcase">
        <div className="ds__component-preview" style={{ flexDirection: 'column', gap: '24px' }}>
          {/* Placeholder content. A real company name with real-looking
              metrics on a public page reads as employment history — see the
              note above the testimonial previews. Actual case studies are
              driven from src/data/projects.ts. */}
          <CaseStudyCard
            company="Company Name"
            title="Case study title, long enough to wrap onto a second line"
            description="Placeholder description showing how supporting copy sits under the title in the horizontal variant."
            tags={['Tag One', 'Tag Two', 'Tag Three']}
            metrics={[
              { value: '00%', label: 'Metric Label' },
              { value: '000', label: 'Metric Label' },
            ]}
            ctaPrimaryLabel="View Case Study"
            ctaSecondaryLabel="View Live"
            variant="horizontal"
          />
          <CaseStudyCard
            company="Company Name"
            title="Stacked variant title, shown for comparison"
            description="Placeholder description for the stacked layout."
            tags={['Tag One', 'Tag Two', 'Tag Three']}
            role="Role Title"
            year="Year"
            variant="stacked"
          />
        </div>
        <div className="ds__component-meta">
          <h4 className="ds__subsection-title">Specs</h4>
          <div className="ds__spec-table">
            <div className="ds__spec-row">
              <span className="ds__spec-label">Container</span>
              <code className="ds__spec-value">bg: #f4f6f7 · radius: 16px · overflow: hidden</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Layout</span>
              <code className="ds__spec-value">CSS Grid · horizontal: 1fr 1fr · stacked: 1fr 1.2fr</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Company</span>
              <code className="ds__spec-value">12px · uppercase · #707070 · letter-spacing: 0.06em</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Title</span>
              <code className="ds__spec-value">Hubot Sans Bold · 26px / 31.2px · #1b1b1b</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Tags</span>
              <code className="ds__spec-value">12px · pill: border 1px #e5e5e5 · radius: 9999px · padding: 4px 12px</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">CTA Primary</span>
              <code className="ds__spec-value">Hubot Sans ExtraBold · bg: #f03d01 · radius: 10px</code>
            </div>
            <div className="ds__spec-row">
              <span className="ds__spec-label">Responsive</span>
              <code className="ds__spec-value">Collapses to single column at 768px</code>
            </div>
          </div>
        </div>
        <div className="ds__component-usage">
          <h4 className="ds__subsection-title">Usage</h4>
          <pre className="ds__code-block">
{`import CaseStudyCard from './components/CaseStudyCard';

<CaseStudyCard
  company={project.company}
  title={project.title}
  description={project.summary}
  tags={project.tags}
  metrics={project.metrics}
  imageSrc={project.coverImage}
  ctaPrimaryLabel="View Case Study"
  variant="horizontal"
/>`}
          </pre>
        </div>
      </div>
    </section>

    {/* ======================== BUTTONS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Buttons</h2>
      <div className="ds__btn-group">
        <h3 className="ds__subsection-title">Primary</h3>
        <div className="ds__btn-row">
          <button className="ds__btn ds__btn--primary ds__btn--sm">Small</button>
          <button className="ds__btn ds__btn--primary ds__btn--md">Medium</button>
          <button className="ds__btn ds__btn--primary ds__btn--lg">Large</button>
        </div>
        <div className="ds__btn-specs">
          <code>font-weight: 800 (ExtraBold) · border-radius: 10px · font: Hubot Sans</code>
        </div>
      </div>
      <div className="ds__btn-group">
        <h3 className="ds__subsection-title">Secondary</h3>
        <div className="ds__btn-row">
          <button className="ds__btn ds__btn--secondary ds__btn--sm">Small</button>
          <button className="ds__btn ds__btn--secondary ds__btn--md">Medium</button>
          <button className="ds__btn ds__btn--secondary ds__btn--lg">Large</button>
        </div>
        <div className="ds__btn-specs">
          <code>bg: white · border: #5e6c7c · text: #5e6c7c</code>
        </div>
      </div>
    </section>

    {/* ======================== CARD VARIANTS ======================== */}
    <section className="ds__section">
      <h2 className="ds__section-title">Card Variants</h2>
      <div className="ds__card-grid">
        <div className="ds__example-card ds__example-card--guideline">
          <h4>Guideline Card</h4>
          <p>border-radius: 12px</p>
          <code>$card-border-radius / --radius-xl</code>
        </div>
        <div className="ds__example-card ds__example-card--project">
          <h4>Project Card</h4>
          <p>border-radius: 16px</p>
          <code>$card-border-radius-lg / --radius-2xl</code>
        </div>
      </div>
    </section>
  </>
);

const MoleculesContent: React.FC = () => {
  const [activeMoleculeTab, setActiveMoleculeTab] = useState('navigation');

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <Tabs tabs={moleculeTabs} activeTab={activeMoleculeTab} onChange={setActiveMoleculeTab} />
      </div>
      {activeMoleculeTab === 'navigation' ? <NavigationContent /> : <CardsContent />}
    </>
  );
};

// ============================================
// Main Component
// ============================================

// WCAG relative luminance, so the page cannot drift from the tokens it shows.
function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const A11Y_PAIRS: { label: string; fg: string; bg: string; large?: boolean }[] = [
  { label: 'Ink on White', fg: '#1b1b1b', bg: '#ffffff' },
  { label: 'Neutral on White', fg: '#4a4a4a', bg: '#ffffff' },
  { label: 'Muted on White', fg: '#707070', bg: '#ffffff' },
  { label: 'Link accent on White', fg: '#c23001', bg: '#ffffff' },
  { label: 'White on Brand Orange (display only)', fg: '#ffffff', bg: '#f03d01', large: true },
];

const DesignSystem: React.FC = () => {
  // The only page component that never set its own meta, so the built file
  // shipped the homepage's <title> and a canonical pointing at "/".
  usePageMeta({
    title: 'Design system — Ryan DeBoer',
    description:
      'The tokens, type scale, colour roles, and components this site is actually built on.',
    canonical: 'https://www.rdeboerdesigns.com/design-system/',
  });
  const [activeSection, setActiveSection] = useState('atoms');

  return (
    <div className="ds">
      <header className="ds__header">
        <Link to={getHomeHref()} className="ds__back">&larr; Back to Portfolio</Link>
        <h1 className="ds__title">Design System</h1>
        <p className="ds__subtitle">
          Every token, type role, and component pattern this site currently ships. Figma is the
          source; this page is the check.
        </p>
        <p className="ds__subtitle">
          Documented for people and agents in two files at the repo root.{' '}
          <Link to="/notes/governance-in-markdown">Why the brand lives in PRODUCT.md and DESIGN.md &rarr;</Link>
        </p>
      </header>

      <div className="ds__nav">
        <Tabs tabs={mainTabs} activeTab={activeSection} onChange={setActiveSection} />
      </div>

      {activeSection === 'atoms' ? <AtomsContent /> : <MoleculesContent />}
    </div>
  );
};

export default DesignSystem;
