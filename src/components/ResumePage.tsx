import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

// Shared contact details come from data/site.ts; the resume adds its own
// display fields (name split for the vCard, address parts, link labels).
//
// `title` is the positioning string, not the job title. The job title is
// "Senior Web Designer" and lives on the Tire Rack entry below, where it
// belongs; the positioning string is what the header and the vCard carry.
//
// The site joins these three with a middle dot. The résumé joins them with a
// hyphen, per Ryan, which also keeps the vCard TITLE in ASCII: desktop Outlook
// has imported .vcf files as Windows-1252 and would render the dot as "Â·" on
// a recruiter's contact card. The pipe stays as furniture on the contact and
// job lines, so the title is visibly the title.
const TITLE_PARTS = ['Product Design Engineer', 'Design Systems', 'Agentic Workflows'];

const CONTACT = {
  firstName: 'Ryan',
  lastName: 'DeBoer',
  title: TITLE_PARTS.join(' - '),
  email: SITE.email,
  city: 'South Bend',
  region: 'Indiana',
  country: 'USA',
  portfolioUrl: SITE.portfolioUrl,
  portfolioLabel: 'rdeboerdesigns.com',
  linkedinUrl: SITE.linkedinUrl,
  linkedinLabel: 'linkedin.com/in/ryandeboerdesigns',
};

// Absolute links (not bare #hashes) so they stay clickable from an exported PDF.
const caseStudyUrl = (slug: string) => `${CONTACT.portfolioUrl}/work/${slug}/`;

// One line per entry. The numbers are the case studies' own (data/projects.ts);
// change them there first, then here.
const SELECTED_WORK: { name: string; slug: string; note: string }[] = [
  {
    name: 'WheelRack',
    slug: 'wheelrack',
    note: 'Designed a 200+ token system and 50+ Storybook components for a dealer journey spanning vehicle selection through checkout; partner adoption grew from six to ten.',
  },
  {
    name: 'PlayDraft',
    slug: 'playdraft',
    note: 'Took a social drafting game from its first identity sketch to TestFlight in 12 weeks, owning product design, the design system, and React Native implementation.',
  },
  {
    name: 'Internal Tooling',
    slug: 'design-enablement',
    note: 'Shipped a Figma metadata plugin, production-accurate crop simulator, and presentation system used across Design, UX, and Photography.',
  },
  {
    name: 'AEM Component System',
    slug: 'aem-component-system',
    note: 'Defined and shipped 10+ reusable components with Sass, responsive behavior, accessibility rules, and documentation; WebPageTest measured 60% faster loads.',
  },
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
  // The print block is tuned so the document is one US Letter page.
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
          {/* The site's own button pair (footer uses the same two at --md);
              the résumé classes only add the icon gap. */}
          <button className="btn btn--secondary btn--md resume-page__vcard-btn" onClick={handleDownloadVCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Save contact
          </button>
          <button className="btn btn--primary btn--md resume-page__print-btn" onClick={handleExportPDF}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Save as PDF
          </button>
          <Link to={getHomeHref()} className="resume-page__nav-back">&larr; Back to Portfolio</Link>
        </div>
      </nav>

      {/* Resume document — one column, in reading order, so the print and the
          screen are the same document and an ATS reads it top to bottom. */}
      <article className="resume-page__paper">
        {/* Header */}
        <header className="resume-page__header">
          <h1 className="resume-page__name">Ryan DeBoer</h1>
          {/* Same pipe-as-furniture treatment as the contact line below, so
              the separators read as steel on screen and as " | " in the text. */}
          <p className="resume-page__tagline">
            {TITLE_PARTS.map((part, i) => (
              <React.Fragment key={part}>
                {i > 0 && <>{' '}<span className="resume-page__job-sep" aria-hidden="true">-</span>{' '}</>}
                {part}
              </React.Fragment>
            ))}
          </p>
          {/* Full URLs shown as text so every link is also readable on paper.
              Each separator travels with the item after it, so if the line
              ever wraps it never leaves a pipe hanging at the end of a line. */}
          <p className="resume-page__contact">
            <span className="resume-page__contact-item">{CONTACT.city}, {CONTACT.region}</span>
            <span className="resume-page__contact-item">
              <span className="resume-page__contact-sep" aria-hidden="true">|</span>{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </span>
            <span className="resume-page__contact-item">
              <span className="resume-page__contact-sep" aria-hidden="true">|</span>{' '}
              <a href={CONTACT.portfolioUrl} target="_blank" rel="noopener noreferrer">{CONTACT.portfolioLabel}<span className="sr-only"> (opens in a new tab)</span></a>
            </span>
            <span className="resume-page__contact-item">
              <span className="resume-page__contact-sep" aria-hidden="true">|</span>{' '}
              <a href={CONTACT.linkedinUrl} target="_blank" rel="noopener noreferrer">{CONTACT.linkedinLabel}<span className="sr-only"> (opens in a new tab)</span></a>
            </span>
          </p>
        </header>

        <div className="resume-page__rule" role="presentation" />

        {/* Summary. The promotion was a bullet until it read as a standalone
            boast, and it is the one line on this page a recruiter cannot
            corroborate elsewhere on the site. As a subordinate clause it dates
            the scope instead of asking to be admired. */}
        <p className="resume-page__summary">
          Product design engineer with 12+ years at Tire Rack and 16+ years across visual design
          and responsive web. Since 2021, when I was one of two designers promoted to Senior, my
          scope has spanned product, UX, design systems, and front-end implementation. I build the
          systems connecting Figma, production code, documentation, and internal tooling so
          designers and engineers move faster without the work drifting. AI accelerates
          exploration. I remain responsible for the decisions and details behind what ships.
        </p>

        {/* Core capabilities */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Core capabilities</h2>
          <ul className="resume-page__capabilities">
            <li>
              <strong>Systems:</strong> Design systems, tokens, components, documentation, governance, accessibility
            </li>
            <li>
              <strong>Build:</strong> Figma, Storybook, React, React Native, TypeScript, HTML, CSS, Sass, AEM
            </li>
            <li>
              <strong>Workflow:</strong> Product design, prototyping, implementation QA, internal tooling, agentic workflows
            </li>
          </ul>
        </section>

        {/* Professional experience */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Professional experience</h2>

          <div className="resume-page__job">
            <div className="resume-page__job-header">
              <h3 className="resume-page__job-title">
                Tire Rack <span className="resume-page__job-sep" aria-hidden="true">|</span> Senior Web Designer
              </h3>
              <span className="resume-page__job-date">2021 to present</span>
            </div>
            <ul className="resume-page__job-list">
              <li>Turn product direction into responsive systems, component contracts, production styles, and implementation QA across React and AEM.</li>
              <li>Redesigned high-traffic category experiences; in the first month, top pages recorded up to a 50% conversion lift and category entry grew up to 400%, both measured against the month before launch.</li>
            </ul>
          </div>

          <div className="resume-page__job">
            <div className="resume-page__job-header">
              <h3 className="resume-page__job-title">
                Tire Rack <span className="resume-page__job-sep" aria-hidden="true">|</span> Web Designer
              </h3>
              <span className="resume-page__job-date">2014 to 2021</span>
            </div>
            <ul className="resume-page__job-list">
              <li>Designed and implemented responsive ecommerce and marketing experiences in HTML, CSS, and AEM, partnering with product, engineering, SEO, analytics, and brand through launch.</li>
            </ul>
          </div>
        </section>

        {/* Selected work */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Selected work</h2>
          <ul className="resume-page__work-list">
            {SELECTED_WORK.map((w) => (
              <li key={w.slug} className="resume-page__work-item">
                <a href={caseStudyUrl(w.slug)} className="resume-page__work-link">{w.name}</a>: {w.note}
              </li>
            ))}
          </ul>
        </section>

        {/* Additional experience and education. Label-then-gloss takes the
            colon the rest of the site uses; the site was swept of em dashes. */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Additional experience and education</h2>
          <ul className="resume-page__extra-list">
            <li>
              <strong>Independent design work</strong>
              {' '}<span className="resume-page__job-sep" aria-hidden="true">|</span>{' '}
              <span className="resume-page__extra-date">2009 to 2024</span>:{' '}
              Identity and responsive web work for small businesses and university communications.
            </li>
            <li>
              <strong>BFA, Graphic Design</strong>, Minor in Digital Media
              {' '}<span className="resume-page__job-sep" aria-hidden="true">|</span>{' '}
              <span className="resume-page__extra-date">Kendall College of Art and Design</span>
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default ResumePage;
