import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const CONTACT = {
  firstName: 'Ryan',
  lastName: 'DeBoer',
  email: SITE.email,
  city: 'Granger, IN',
  title: 'Product Designer · Systems · UI Engineering',
  portfolioUrl: SITE.portfolioUrl,
  linkedinUrl: SITE.linkedinUrl,
};

const ResumePage: React.FC = () => {
  usePageMeta({
    title: 'Résumé — Ryan DeBoer, Product Designer',
    description: 'Product designer connecting product design, design systems, and implementation across ecommerce, dealer platforms, and independent products.',
    canonical: `${SITE.portfolioUrl}/resume/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
  });

  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0', `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
      `FN:${CONTACT.firstName} ${CONTACT.lastName}`, `TITLE:${CONTACT.title}`,
      `EMAIL;TYPE=INTERNET,PREF:${CONTACT.email}`, `URL:${CONTACT.portfolioUrl}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${CONTACT.linkedinUrl}`, `ADR;TYPE=HOME:;;;${CONTACT.city};;;;`, 'END:VCARD',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ryan_DeBoer.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="resume-page">
      <nav className="resume-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="resume-page__nav-logo">Ryan DeBoer</Link>
        <div className="resume-page__nav-actions">
          <button className="btn btn--secondary btn--md resume-page__vcard-btn" onClick={handleDownloadVCard}>Save contact</button>
          <a className="btn btn--primary btn--md resume-page__download-btn" href="/Ryan-DeBoer-Resume.pdf" download="Ryan_DeBoer_Product_Design_Generalist.pdf">Download résumé</a>
          <Link to={getHomeHref()} className="resume-page__nav-back">&larr; Back to Portfolio</Link>
        </div>
      </nav>

      <div className="resume-page__canvas" role="region" aria-label="Letter-size resume" tabIndex={0}>
        <article className="resume-page__paper">
          <header className="resume-page__header">
            <h1 className="resume-page__name">Ryan DeBoer</h1>
            <p className="resume-page__role">{CONTACT.title}</p>
            <p className="resume-page__contact">
              <span>Portfolio: <a href={CONTACT.portfolioUrl}>{CONTACT.portfolioUrl.replace(/^https?:\/\//, '')}</a> | Pass: #showWork</span>
              <span>{CONTACT.city} · US Remote · Eastern Time · <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
              <a href={CONTACT.linkedinUrl}>{CONTACT.linkedinUrl.replace(/^https?:\/\//, '')}</a>
            </p>
          </header>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Summary</h2>
            <p>I connect product design, design systems, and implementation to carry complex experiences from first decision through production. More than a decade at Tire Rack spans ecommerce and dealer journeys, reusable systems, accessible interaction patterns, and hands-on web implementation. In independent mobile work, I direct agent-assisted builds and review the resulting behavior, design, and release quality.</p>
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Skills</h2>
            <p><strong>Product and experience design:</strong> Product strategy, UX/UI, interaction design, information architecture, user flows, prototyping, responsive design, accessibility.</p>
            <p><strong>Design systems:</strong> Tokens, semantic naming, component contracts, variants and states, governance, documentation, adoption, contribution guidance.</p>
            <p><strong>Implementation and delivery:</strong> HTML, CSS, Sass, AEM, Figma, Storybook collaboration, React Native/Expo/TypeScript agent-assisted builds, implementation QA.</p>
            <p><strong>Evidence and workflow:</strong> Adobe Analytics, WebPageTest, stakeholder collaboration, SEO-informed structure, Claude Code, Figma MCP, Git/GitHub.</p>
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Experience</h2>
            <div className="resume-page__job">
              <h3>Tire Rack · Senior Web Designer · South Bend, IN <span>May 2021 – Present</span></h3>
              <p>Lead product and interface design across ecommerce, dealer workflows, reusable content systems, and internal tools, partnering with UX, engineering, analytics, SEO, and content teams.</p>
              <ul>
                <li>Co-founded and led an internal professional development program for approximately 90 digital team members, creating structured learning across technical, product, and leadership disciplines.</li>
                <li>Redesigned 30+ tire category pages around shared comparison, icon, and content patterns; first-month results included up to 50% conversion lift on top pages and up to 400% category-entry growth.</li>
                <li>Led the WheelRack dealer journey from vehicle selection through checkout and built its first design system: 200+ tokens and 50+ Storybook-integrated components. Partnered with a senior React developer; the framework later extended into Wholesale.</li>
                <li>Designed and built 50+ landing pages, then established governed AEM templates that moved complex-page delivery from about a month to 1–2 weeks. Partnered on 10+ reusable AEM components; WebPageTest measured 60% faster loads on pages using them.</li>
                <li>Built three AI-assisted internal tools used by Design, UX, and Photography; shipped accessible comparison charts and a two-tier icon system that grew beyond 100 icons.</li>
              </ul>
            </div>
            <div className="resume-page__job">
              <h3>Tire Rack · Web Designer · South Bend, IN <span>2014 – 2021</span></h3>
              <p>Owned responsive ecommerce UI from visual design through HTML/CSS/Sass implementation. Created reusable AEM page and component patterns with engineering, SEO, content, and analytics partners.</p>
            </div>
            <div className="resume-page__job">
              <h3>Round 2 Corp. · Designer <span>2013 – 2014</span></h3>
              <p>Created brand, packaging, and product graphics with an emphasis on typography, composition, and production accuracy.</p>
            </div>
          </section>

          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Selected Independent Projects</h2>
            <div className="resume-page__job">
              <h3>PlayDraft · Independent Product Designer &amp; Agent-Assisted Builder <span>2026 – Present</span></h3>
              <p>Led product direction, brand, UX/UI, game rules, and release QA for an iPhone social drafting game; reached TestFlight in 12 weeks and released on the App Store. Play feedback led me to replace next-day community voting with instant scoring for a satisfying single-session result. Directed agent-assisted React Native/Expo/TypeScript implementation. <a href={`${SITE.portfolioUrl}/work/playdraft/`}>Case study</a></p>
            </div>
            <div className="resume-page__job">
              <h3>LoopStack · Independent Product Designer &amp; Agent-Assisted Builder <span>2026 – Present</span></h3>
              <p>Designed an iOS pattern-review experience using real HealthKit CGM history, making evidence strength visible and keeping developing patterns within review and care-team discussion boundaries. <a href={`${SITE.portfolioUrl}/work/loopstack/`}>Case study</a></p>
            </div>
          </section>

          <section className="resume-page__section resume-page__education">
            <h2 className="resume-page__section-title">Education</h2>
            <p><strong>BFA, Graphic Design</strong> · Kendall College of Art and Design · Minor in Web Animation</p>
          </section>
          <p className="resume-page__note">Selected work: WheelRack · Tire categories · Systems overview. Employer-work case studies use the portfolio password above.</p>
        </article>
      </div>
    </div>
  );
};

export default ResumePage;
