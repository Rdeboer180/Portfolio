import React, { useState } from 'react';
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
      { name: 'neutral-muted', value: '#7a7a7a', css: '--color-neutral-muted', light: true },
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
  { name: 'H1', size: '38px', leading: '45.6px', weight: 700, font: 'heading', sample: 'Design Strategist' },
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
      <div className="ds__a11y-grid">
        <div className="ds__a11y-card">
          <div className="ds__a11y-contrast" style={{ backgroundColor: '#1b1b1b', color: '#ffffff' }}>
            Aa
          </div>
          <span>Dark on White</span>
          <code>13.5:1 ✓</code>
        </div>
        <div className="ds__a11y-card">
          <div className="ds__a11y-contrast" style={{ backgroundColor: '#f03d01', color: '#ffffff' }}>
            Aa
          </div>
          <span>Primary on White</span>
          <code>4.6:1 ✓</code>
        </div>
        <div className="ds__a11y-card">
          <div className="ds__a11y-contrast" style={{ backgroundColor: '#4a4a4a', color: '#ffffff' }}>
            Aa
          </div>
          <span>Neutral on White</span>
          <code>7.2:1 ✓</code>
        </div>
        <div className="ds__a11y-card">
          <div className="ds__a11y-contrast" style={{ backgroundColor: '#ffffff', color: '#7a7a7a', border: '1px solid #e5e5e5' }}>
            Aa
          </div>
          <span>Muted on White</span>
          <code>4.5:1 ✓</code>
        </div>
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
                <code className="ds__spec-value">Inter · 18px / 28px · #7a7a7a · max-width: 600px</code>
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
                <code className="ds__spec-value">bg: white · border: 0.5px solid #7a7a7a · radius: 12px · padding: 4.5px</code>
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
            <TestimonialCard
              name="Paul Bennett"
              role="Founder"
              rating={5}
              quote="Michael's been a pleasure to work with. His attention to detail, UX design and design expertise has helped us push the limits on various mobile apps."
            />
            <TestimonialCard
              name="Fawn Rolands"
              role="Sr. Product Manager"
              company="Acme Corp"
              rating={5}
              quote="I've worked with Michael on a couple of projects now and really value his skills and abilities. He is confident and capable."
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
              <code className="ds__spec-value">Inter · 12px · #7a7a7a</code>
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
  avatarSrc="/images/avatar.jpg"
  name="Paul Bennett"
  role="Founder"
  company="Acme Corp"
  rating={5}
  quote="Great experience working together..."
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
          <CaseStudyCard
            company="Walmart"
            title="Empowering item discovery with Gen AI summaries"
            description="Enhancing user confidence with concise item and review summaries that reduce cognitive load and support faster, informed evaluation."
            tags={['0 to 1 Design', 'Gen AI', 'iOS & Android']}
            metrics={[
              { value: '+1.1%', label: 'ATC Conversion' },
              { value: '75%', label: 'Found Helpful' },
            ]}
            ctaPrimaryLabel="View Case Study"
            ctaSecondaryLabel="View Live (In App)"
            variant="horizontal"
          />
          <CaseStudyCard
            company="DemocracyOS"
            title="Turns representative SMS feedback into AI-synthesized insights"
            description="Helping governments make smarter, more trusted decisions."
            tags={['Product Leadership', 'UX Research', 'AI-Driven Insight']}
            role="Product Designer & Founder"
            year="2025"
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
              <code className="ds__spec-value">12px · uppercase · #7a7a7a · letter-spacing: 0.06em</code>
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
  company="Walmart"
  title="Empowering item discovery"
  description="Enhancing user confidence..."
  tags={['Gen AI', 'iOS & Android']}
  metrics={[{ value: '+1.1%', label: 'ATC Conversion' }]}
  imageSrc="/images/case-study.png"
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

const DesignSystem: React.FC = () => {
  const [activeSection, setActiveSection] = useState('atoms');

  return (
    <div className="ds">
      <header className="ds__header">
        <a href={getHomeHref()} className="ds__back">&larr; Back to Portfolio</a>
        <h1 className="ds__title">Design System</h1>
        <p className="ds__subtitle">
          Living reference of design tokens, typography, and component patterns.
          Sourced from the Figma design system file.
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
