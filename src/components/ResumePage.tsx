import React, { useRef } from 'react';
// @ts-ignore — html2pdf.js has no type declarations
import html2pdf from 'html2pdf.js';
import { getHomeHref } from '../utils/homeSession';

const ResumePage: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!paperRef.current) return;
    const el = paperRef.current;
    // Measure the element to create a single-page PDF that fits the full content
    const widthIn = 8.5;
    const margin = 0.4;
    const contentWidthIn = widthIn - margin * 2;
    const contentWidthPx = el.scrollWidth;
    const contentHeightPx = el.scrollHeight;
    const scale = contentWidthIn / (contentWidthPx / 96); // 96px = 1in
    const heightIn = (contentHeightPx / 96) * scale + margin * 2;

    const opt = {
      margin: [margin, margin, margin, margin],
      filename: 'Ryan_DeBoer_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: [widthIn, heightIn] as any, orientation: 'portrait' },
    };
    (html2pdf() as any).set(opt).from(el).save();
  };

  return (
    <div className="resume-page">
      {/* Screen-only nav */}
      <nav className="resume-page__nav">
        <a href={getHomeHref()} className="resume-page__nav-logo">Ryan DeBoer</a>
        <div className="resume-page__nav-actions">
          <button className="resume-page__print-btn" onClick={handleExportPDF}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Save as PDF
          </button>
          <a href={getHomeHref()} className="resume-page__nav-back">Back to Portfolio</a>
        </div>
      </nav>

      {/* Resume document */}
      <div className="resume-page__paper" ref={paperRef}>
        {/* Header */}
        <header className="resume-page__header">
          <h1 className="resume-page__name">Ryan DeBoer</h1>
          <p className="resume-page__tagline">
            Senior Web Designer / Front End Web Developer / UX Engineer
          </p>
          <div className="resume-page__contact">
            <span>South Bend, Indiana</span>
            <span className="resume-page__contact-sep">&bull;</span>
            <a href="mailto:rdeboer180@gmail.com">rdeboer180@gmail.com</a>
            <span className="resume-page__contact-sep">&bull;</span>
            <span className="resume-page__contact-portfolio">
              Portfolio Site: <a href="https://rdeboerdesigns.com" target="_blank" rel="noopener noreferrer">RDeboerDesigns.com</a>
            </span>
          </div>
        </header>

        <div className="resume-page__divider resume-page__divider--accent" />

        {/* Summary */}
        <section className="resume-page__summary-section">
          <p className="resume-page__summary">
            Product-focused designer with 16+ years of experience bridging design and engineering to deliver scalable,
            production-ready experiences.
          </p>
          <p className="resume-page__summary">
            I specialize in systems thinking&mdash;defining problems clearly, designing within real constraints, and ensuring what
            ships holds up in production. My background in front-end development and design systems allows me to work
            fluidly across disciplines, aligning teams and turning complex product challenges into maintainable, reusable solutions.
          </p>
        </section>

        {/* Two-column layout */}
        <div className="resume-page__columns">
          {/* Sidebar */}
          <aside className="resume-page__sidebar">
            {/* Core Strengths */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Core Strengths</h2>
              <ul className="resume-page__skill-list">
                <li>Systems Thinking &amp; Design Systems</li>
                <li>Design &harr; Engineering Collaboration</li>
                <li>Scalable UI &amp; Component Architecture</li>
                <li>Product &amp; UX Strategy</li>
                <li>A/B Testing &amp; Data-Informed Design</li>
                <li>Accessibility &amp; Performance Optimization</li>
                <li>AI-Augmented Design Workflows</li>
              </ul>
            </section>

            {/* Technical Skills */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Technical Skills</h2>
              <div className="resume-page__skills-group">
                <h4 className="resume-page__skills-category">Core:</h4>
                <ul className="resume-page__skill-list">
                  <li>Figma</li>
                  <li>SCSS/CSS</li>
                  <li>Adobe Experience Manager (AEM)</li>
                  <li>Design Systems</li>
                  <li>Component Architecture</li>
                </ul>
              </div>
              <div className="resume-page__skills-group">
                <h4 className="resume-page__skills-category">Supporting:</h4>
                <ul className="resume-page__skill-list">
                  <li>HTML</li>
                  <li>WordPress</li>
                  <li>Git</li>
                  <li>Adobe Creative Suite</li>
                </ul>
              </div>
              <div className="resume-page__skills-group">
                <h4 className="resume-page__skills-category">AI Workflow:</h4>
                <ul className="resume-page__skill-list">
                  <li>Claude</li>
                  <li>ChatGPT</li>
                  <li>Figma Make</li>
                </ul>
              </div>
            </section>

            {/* Education */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Education</h2>
              <div className="resume-page__edu">
                <strong>Kendall College of Art &amp; Design</strong>
                <p>BFA Graphic Design</p>
                <p>Minor in Digital Media (Web)</p>
              </div>
            </section>
          </aside>

          {/* Main content */}
          <div className="resume-page__main">
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Professional Experience</h2>

              {/* Tire Rack — Senior */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Tire Rack</h3>
                    <span className="resume-page__job-role">Senior Web Designer - in Addition to my prior responsibilities</span>
                  </div>
                  <span className="resume-page__job-date">2021&ndash;Present</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Lead the design and evolution of scalable UI systems within a complex AEM architecture serving millions of users</li>
                  <li>Built and maintained reusable component libraries and design systems in Figma, improving consistency across product surfaces</li>
                  <li>Partner closely with engineering to ensure design-to-code parity and long-term maintainability</li>
                  <li>Work cross-functionally with SEO, analytics, and product teams to optimize user experience based on real customer behavior</li>
                  <li>Introduced AI-assisted workflows to improve iteration speed, accessibility validation, and design consistency</li>
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
                  <li>Designed and built responsive web experiences using HTML/CSS and enterprise CMS platforms</li>
                  <li>Translated complex UX concepts into production-ready front-end components</li>
                  <li>Collaborated with engineering on scalable CMS architecture and UI improvements</li>
                  <li>Contributed to system-level consistency through reusable design patterns and shared component strategies</li>
                </ul>
              </div>

              {/* Round 2 Corp */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Round 2 Corp</h3>
                    <span className="resume-page__job-role">Product Designer / Package Designer</span>
                  </div>
                  <span className="resume-page__job-date">2013&ndash;2014</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Designed physical and digital products for major brands including Marvel, Star Trek, Peanuts, and Rudolph</li>
                  <li>Developed visual systems and packaging that balanced brand identity with production constraints</li>
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
