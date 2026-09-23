import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const CONTACT = {
  firstName: 'Ryan',
  lastName: 'DeBoer',
  email: SITE.email,
  city: 'South Bend, Indiana',
  title: 'Product Design & Design Systems',
  portfolioUrl: SITE.portfolioUrl,
  linkedinUrl: SITE.linkedinUrl,
};

const caseStudyUrl = (slug: string) => `${CONTACT.portfolioUrl}/work/${slug}/`;

const ResumePage: React.FC = () => {
  usePageMeta({
    title: 'Résumé — Ryan DeBoer, Product Design Engineer',
    description:
      'Ryan DeBoer is a product design engineer with 12+ years at Tire Rack, shaping ecommerce, partner platforms, and internal design tools.',
    canonical: `${SITE.portfolioUrl}/resume/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
  });

  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
      `FN:${CONTACT.firstName} ${CONTACT.lastName}`,
      `TITLE:${CONTACT.title}`,
      `EMAIL;TYPE=INTERNET,PREF:${CONTACT.email}`,
      `URL:${CONTACT.portfolioUrl}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${CONTACT.linkedinUrl}`,
      `ADR;TYPE=HOME:;;;${CONTACT.city};;;;`,
      'END:VCARD',
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
          <button className="btn btn--secondary btn--md resume-page__vcard-btn" onClick={handleDownloadVCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Save contact
          </button>
          <a className="btn btn--primary btn--md resume-page__download-btn" href="/Ryan-DeBoer-Resume.pdf" download="Ryan-DeBoer-Resume.pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download résumé
          </a>
          <Link to={getHomeHref()} className="resume-page__nav-back">&larr; Back to Portfolio</Link>
        </div>
      </nav>

      <div className="resume-page__canvas" role="region" aria-label="Letter-size resume" tabIndex={0}>
      <article className="resume-page__paper">
        <header className="resume-page__header">
          <p className="resume-page__eyebrow">Product Design · Design Systems · Design Engineering</p>
          <div className="resume-page__masthead">
            <h1 className="resume-page__name">Ryan DeBoer</h1>
            <div className="resume-page__contact">
              <strong>{CONTACT.title}</strong>
              <div className="resume-page__contact-row"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><span>·</span><a href={CONTACT.portfolioUrl}>rdeboerdesigns.com</a></div>
              <a href={CONTACT.linkedinUrl}>linkedin.com/in/ryandeboerdesigns</a>
              <span>{CONTACT.city} · Remote</span>
            </div>
          </div>
        </header>

        <ul className="resume-page__skills-strip" aria-label="Core skills">
          {['Design Systems', 'Figma', 'UX/UI', 'Storybook', 'Design to Code', 'AEM'].map((skill) => <li key={skill}>{skill}</li>)}
        </ul>

        <p className="resume-page__summary">
          Senior web designer with 12+ years at Tire Rack shaping ecommerce, partner platforms, and internal tools. Combines visual craft, reusable design systems, and front-end fluency to carry work from concept through accessible production. Uses AI-assisted workflows for exploration, prototyping, and QA, with responsibility for the decisions and quality behind what ships.
        </p>

        <div className="resume-page__columns">
          <aside className="resume-page__sidebar">
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Design + Systems</h2>
              <div className="resume-page__skill-group"><h3>Design systems</h3><p>Tokens, components, governance, accessibility.</p></div>
              <div className="resume-page__skill-group"><h3>Product &amp; visual design</h3><p>Typography, responsive UX/UI, interaction, prototyping.</p></div>
              <div className="resume-page__skill-group"><h3>Technical fluency</h3><p>HTML, CSS/Sass, React, Storybook, AEM.</p></div>
              <div className="resume-page__skill-group"><h3>AI-assisted workflows</h3><p>Prototyping, documentation, design review, and QA.</p></div>
            </section>

            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Education</h2>
              <p><strong className="resume-page__education-name">Kendall College of<br />Art and Design</strong>BFA, Graphic Design<br />Minor in Digital Media (Web)</p>
            </section>

            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Selected outcomes</h2>
              <ul className="resume-page__outcomes">
                <li><strong>200+ tokens</strong><br />50+ Storybook components</li>
                <li><strong>60% faster page loads</strong><br />AEM · WebPageTest</li>
                <li><strong>1–2 week launch cycles</strong><br />Previously about one month</li>
              </ul>
            </section>
          </aside>

          <div className="resume-page__main">
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Experience</h2>
              <div className="resume-page__job">
                <div className="resume-page__job-header"><h3 className="resume-page__job-title">Tire Rack · Senior Web Designer</h3><span className="resume-page__job-date">2021–Present</span></div>
                <ul className="resume-page__job-list">
                  <li>Built WheelRack’s design system and dealer journey, from vehicle selection through checkout. Partner adoption grew from six to ten during the build.</li>
                  <li>Established governed AEM templates after designing 50+ landing pages, with reusable patterns used by two junior designers.</li>
                  <li>Redesigned 30+ tire-category experiences. Top pages recorded up to a 50% conversion lift in the first month.</li>
                  <li>Built three connected tools for Design, UX, and Photography; mentor designers through critique, accessibility reviews, and design-to-code QA.</li>
                </ul>
              </div>

              <div className="resume-page__job">
                <div className="resume-page__job-header"><h3 className="resume-page__job-title">Tire Rack · Web Designer</h3><span className="resume-page__job-date">2014–2021</span></div>
                <ul className="resume-page__job-list">
                  <li>Designed and implemented responsive ecommerce, editorial, and marketing experiences using HTML, CSS/Sass, and enterprise CMS platforms.</li>
                  <li>Built a seasonal content system using 20+ AEM Experience Fragments across six high-traffic pages.</li>
                </ul>
              </div>

              <div className="resume-page__job">
                <div className="resume-page__job-header"><h3 className="resume-page__job-title">Round 2 Corp. · Designer</h3><span className="resume-page__job-date">2013–2014</span></div>
                <p className="resume-page__job-description">Created product and packaging experiences for entertainment and toy brands, with a focus on typography, visual systems, and production craft.</p>
              </div>
            </section>

            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Selected work</h2>
              <div className="resume-page__work-grid">
                <a className="resume-page__work-card" href={caseStudyUrl('wheelrack')}><strong>WheelRack</strong><span>Design system and dealer journey across partner brands. Figma, tokens, Storybook, and React.</span></a>
                <a className="resume-page__work-card" href={caseStudyUrl('playdraft')}><strong>PlayDraft</strong><span>Ongoing personal project. Concept to TestFlight in 12 weeks: brand, UX/UI, React Native, and QA.</span></a>
              </div>
            </section>
          </div>
        </div>
      </article>
      </div>
    </div>
  );
};

export default ResumePage;
