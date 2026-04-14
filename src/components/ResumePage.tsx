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
            Design Strategist / Systems-Focused Product Designer
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
            Design systems–focused web and product designer with 10+ years of experience building scalable, token-driven
            systems across web and native platforms. Combines deep expertise in Figma variables, design tokens, and
            design-to-code workflows with strong engineering collaboration to deliver accessible, high-quality experiences
            that scale.
          </p>
          <p className="resume-page__summary">
            I bridge design, engineering, and business priorities to create systems that drive adoption, improve consistency,
            and accelerate delivery—turning complex ecosystems into cohesive products that ship.
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
                  <li>Led end-to-end design across ecommerce and acquisition flows, improving discovery, comparison, and conversion experiences across high-traffic customer journeys</li>
                  <li>Operated as the bridge between UX, product, and engineering—translating ambiguous concepts into scalable, production-ready solutions</li>
                  <li>Built and evolved component-driven systems within AEM, improving consistency, reusability, and implementation speed</li>
                  <li>Partnered closely with developers to ensure design-to-code alignment, grounding decisions in real technical constraints and long-term maintainability</li>
                  <li>Contributed to frontend implementation strategy by aligning component structure, states, and behaviors with scalable development patterns</li>
                  <li>Designed and optimized acquisition-focused experiences including landing pages, promotional surfaces, and conversion flows</li>
                  <li>Led rapid prototyping efforts to validate concepts early and accelerate stakeholder alignment</li>
                  <li>Introduced AI-assisted workflows (Claude, LLM tooling) to accelerate ideation, generate variations, and improve team efficiency</li>
                  <li>Collaborated with SEO and analytics teams to improve performance through A/B testing and experimentation</li>
                  <li>Optimized UI patterns for accessibility (WCAG), performance, and responsive behavior</li>
                  <li>Mentored teammates on design systems, component thinking, and design-to-code best practices</li>
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
                  <li>Designed and implemented responsive web experiences across ecommerce and marketing platforms</li>
                  <li>Translated UX concepts into production-ready front-end solutions using HTML/CSS and CMS systems</li>
                  <li>Collaborated with cross-functional teams to support campaign execution and iterative product improvements</li>
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
