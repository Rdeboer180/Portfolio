import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

// Shared contact details come from data/site.ts; the resume adds its own
// display fields (name split for the vCard, address parts, link labels).
const CONTACT = {
  firstName: 'Ryan',
  lastName: 'DeBoer',
  title: 'Product Design Engineer · Systems · Front-End',
  email: SITE.email,
  city: 'South Bend',
  region: 'Indiana',
  country: 'USA',
  portfolioUrl: SITE.portfolioUrl,
  portfolioLabel: 'RDeboerDesigns.com',
  linkedinUrl: SITE.linkedinUrl,
  linkedinLabel: 'linkedin.com/in/ryandeboerdesigns',
};

// Absolute links (not bare #hashes) so they stay clickable from an exported PDF.
const caseStudyUrl = (slug: string) => `${CONTACT.portfolioUrl}/work/${slug}/`;

const SELECTED_WORK: { name: string; slug: string; note: string }[] = [
  { name: 'WheelRack Design System', slug: 'wheelrack', note: '200+ tokens, 50+ Storybook components; full customer-journey redesign' },
  { name: 'Tire Category Redesign', slug: 'tire-categories', note: 'Up to +50% conversion lift, +400% category-entry growth (first month)' },
  { name: 'AEM Landing Page System', slug: 'landing-pages', note: '50+ pages; turnaround cut from weeks to days, <1 QA issue per page' },
  { name: 'PlayDraft', slug: 'playdraft', note: '0→1 social drafting game — brand to TestFlight in 12 weeks (React Native)' },
];

const ResumePage: React.FC = () => {
  usePageMeta({
    title: 'Résumé — Ryan DeBoer, Product Design Engineer',
    description:
      'Ryan DeBoer is a product design engineer with 16+ years of experience building design systems, ecommerce experiences, and working products across web and native platforms.',
    canonical: `${SITE.portfolioUrl}/resume/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
  });

  // Native print produces a PDF with clickable links and selectable, ATS-readable
  // text (unlike a rasterized canvas export), using the @media print styles.
  const handleExportPDF = () => {
    window.print();
  };

  // Downloadable vCard so recruiters can add Ryan to their contacts in one click.
  const handleDownloadVCard = () => {
    const { firstName, lastName, title, email, city, region, country, portfolioUrl, linkedinUrl } = CONTACT;
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};;;`,
      `FN:${firstName} ${lastName}`,
      `TITLE:${title}`,
      `EMAIL;TYPE=INTERNET,PREF:${email}`,
      `URL:${portfolioUrl}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${linkedinUrl}`,
      `ADR;TYPE=HOME:;;;${city};${region};;${country}`,
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${firstName}_${lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="resume-page">
      {/* Screen-only nav */}
      <nav className="resume-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="resume-page__nav-logo">Ryan DeBoer</Link>
        <div className="resume-page__nav-actions">
          <button className="resume-page__vcard-btn" onClick={handleDownloadVCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Save contact
          </button>
          <button className="resume-page__print-btn" onClick={handleExportPDF}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Save as PDF
          </button>
          <Link to={getHomeHref()} className="resume-page__nav-back">Back to Portfolio</Link>
        </div>
      </nav>

      {/* Resume document */}
      <div className="resume-page__paper">
        {/* Header */}
        <header className="resume-page__header">
          <h1 className="resume-page__name">Ryan DeBoer</h1>
          <p className="resume-page__tagline">
            Product Design Engineer · Systems · Front-End
          </p>
          <div className="resume-page__contact">
            <span>{CONTACT.city}, {CONTACT.region}</span>
            <span className="resume-page__contact-sep">&bull;</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span className="resume-page__contact-sep">&bull;</span>
            <span className="resume-page__contact-portfolio">
              Portfolio Site: <a href={CONTACT.portfolioUrl} target="_blank" rel="noopener noreferrer">{CONTACT.portfolioLabel}<span className="sr-only"> (opens in a new tab)</span></a>
            </span>
            <span className="resume-page__contact-sep">&bull;</span>
            {/* Full URL shown as text so the link is also readable on a printed page. */}
            <span className="resume-page__contact-linkedin">
              LinkedIn: <a href={CONTACT.linkedinUrl} target="_blank" rel="noopener noreferrer">{CONTACT.linkedinLabel}<span className="sr-only"> (opens in a new tab)</span></a>
            </span>
          </div>
        </header>

        <div className="resume-page__divider resume-page__divider--accent" />

        {/* Summary */}
        <section className="resume-page__summary-section">
          <p className="resume-page__summary">
            Product design engineer with 16+ years across ecommerce, design systems, and working
            web and native products.
          </p>
          <p className="resume-page__summary">
            I own the decisions that connect Figma to the build: tokens, component behavior,
            production styles, documentation, and the checks that keep the system intact after launch.
          </p>
        </section>

        {/* Two-column layout */}
        <div className="resume-page__columns">
          {/* Sidebar */}
          <aside className="resume-page__sidebar">
            {/* Core Strengths */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Design Systems &amp; Visual Identity</h2>
              <ul className="resume-page__skill-list">
                <li>Design Systems Development</li>
                <li>Component Architecture &amp; Scalable UI Patterns</li>
                <li>Design Tokens (Figma Variables, Token Studio)</li>
                <li>System-Driven UX &amp; Interaction Models</li>
                <li>Brand-to-UI Translation</li>
              </ul>
            </section>

            {/* Product Design Experience */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Product Design Experience</h2>
              <ul className="resume-page__skill-list">
                <li>End-to-End Product Design (0→1 &amp; Iteration)</li>
                <li>UX Strategy &amp; Journey Mapping</li>
                <li>Interaction Design &amp; High-Fidelity Prototyping</li>
                <li>Information Architecture &amp; Content Structure</li>
                <li>Visual Design (Typography, Layout, Hierarchy)</li>
              </ul>
            </section>

            {/* Design Engineering & Frontend */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Design Engineering &amp; Frontend Collaboration</h2>
              <ul className="resume-page__skill-list">
                <li>Figma (Components, Variables, Auto Layout)</li>
                <li>HTML / CSS / SCSS (Design-to-Code Alignment)</li>
                <li>Adobe Experience Manager (AEM)</li>
                <li>Component-Based Development Collaboration</li>
                <li>Storybook &amp; Design System Integration</li>
              </ul>
            </section>

            {/* Growth, Performance & Optimization */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Growth, Performance &amp; Optimization</h2>
              <ul className="resume-page__skill-list">
                <li>A/B Testing &amp; Experimentation</li>
                <li>SEO &amp; Conversion Optimization</li>
                <li>Accessibility (WCAG)</li>
                <li>Performance &amp; Responsive Design</li>
              </ul>
            </section>

            {/* AI & Emerging Workflows */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">AI &amp; Emerging Workflows</h2>
              <ul className="resume-page__skill-list">
                <li>AI-Augmented Design Workflows (Claude, Cursor)</li>
                <li>Rapid Prototyping &amp; Iteration Systems</li>
                <li>AI Assisted Content &amp; UI Generation</li>
                <li>Workflow Optimization &amp; Automation</li>
              </ul>
            </section>

          </aside>

          {/* Main content */}
          <div className="resume-page__main">
            {/* Selected Work */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Selected Work</h2>
              <ul className="resume-page__work-list">
                {SELECTED_WORK.map((w) => (
                  <li key={w.slug} className="resume-page__work-item">
                    <a href={caseStudyUrl(w.slug)} className="resume-page__work-link">{w.name}</a>
                    <span className="resume-page__work-note">{w.note}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Education */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Education</h2>
              <div className="resume-page__edu">
                <strong>Bachelor of Fine Arts (BFA), Graphic Design</strong>
                <p>Kendall College of Art &amp; Design</p>
                <p>Minor in Digital Media (Web)</p>
                <p>Foundation in typography, grid systems, and modernist design principles</p>
              </div>
            </section>

            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Professional Experience</h2>

              {/* Tire Rack — Senior */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Tire Rack</h3>
                    <span className="resume-page__job-role">Senior Product Designer (Design Systems &amp; Frontend Collaboration)</span>
                  </div>
                  <span className="resume-page__job-date">2021&ndash;Present</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Built and shipped WheelRack, a token-driven design system—200+ design tokens and 50+ Storybook-integrated components—giving the React team one source of truth, and extended it into Tire Rack's Wholesale platform within 6 months</li>
                  <li>Redesigned high-traffic tire category pages, driving up to +50% conversion lift on top pages and up to +400% category-entry traffic growth in the first month, and scaled a 32→100+ characteristic-icon library governed sitewide</li>
                  <li>Turned one-off landing-page production into a governed AEM template system—50+ pages personally designed, turnaround cut from ~1 month to days, with under one QA issue per page on average</li>
                  <li>Turned early UX and product concepts into component states, behavior specs, and front-end patterns that engineering could build and reuse</li>
                  <li>Own a decade-long AEM Experience Fragment system—20+ swappable components across 6 high-traffic pages with geo-targeting via Adobe Target—now authored by 2 junior designers under my governance</li>
                  <li>Introduced Claude and other AI-assisted workflows for prototyping and internal tools, while mentoring teammates on design systems and design-to-code practice</li>
                </ul>
              </div>

              {/* Tire Rack — Web Designer */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Tire Rack</h3>
                    <span className="resume-page__job-role">Web Designer</span>
                  </div>
                  <span className="resume-page__job-date">2014&ndash;2021</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Designed and implemented responsive ecommerce and marketing experiences for Tire Rack</li>
                  <li>Moved UX concepts into production with HTML, CSS, and Adobe Experience Manager</li>
                  <li>Worked with product, engineering, SEO, analytics, and brand partners through launch and iteration</li>
                </ul>
              </div>

              {/* Freelance */}
              <h3 className="resume-page__subsection-title">Freelance Work</h3>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company resume-page__job-company--freelance">Heatherwood Equestrian Academy</h3>
                  </div>
                  <span className="resume-page__job-date">2023&ndash;2024</span>
                </div>
                <p className="resume-page__job-desc">Designed and built a responsive WordPress site and brand identity</p>
              </div>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company resume-page__job-company--freelance">Stompin Barley Wine Bar</h3>
                  </div>
                  <span className="resume-page__job-date">2017&ndash;2018</span>
                </div>
                <p className="resume-page__job-desc">Created brand identity and website supporting events and promotions</p>
              </div>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company resume-page__job-company--freelance">FitStop / Vitamin Giant</h3>
                  </div>
                  <span className="resume-page__job-date">2012&ndash;2013</span>
                </div>
                <p className="resume-page__job-desc">Restructured and rebuilt website and marketing materials</p>
              </div>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company resume-page__job-company--freelance">University of Notre Dame &mdash; Technology Department</h3>
                  </div>
                  <span className="resume-page__job-date">2009&ndash;2010</span>
                </div>
                <p className="resume-page__job-desc">Designed branded informational materials for internal communications</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
