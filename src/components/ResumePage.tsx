import React from 'react';

const ResumePage: React.FC = () => {
  const handlePrint = () => window.print();

  return (
    <div className="resume-page">
      {/* Screen-only nav */}
      <nav className="resume-page__nav">
        <a href="#/" className="resume-page__nav-logo">Ryan DeBoer</a>
        <div className="resume-page__nav-actions">
          <button className="resume-page__print-btn" onClick={handlePrint}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save PDF
          </button>
          <a href="#/" className="resume-page__nav-back">Back to Portfolio</a>
        </div>
      </nav>

      {/* Resume document */}
      <div className="resume-page__paper">
        {/* Header */}
        <header className="resume-page__header">
          <h1 className="resume-page__name">Ryan DeBoer</h1>
          <p className="resume-page__tagline">
            Design Systems &amp; Front-End Development &bull; Visual Communicator &bull; Senior Web Designer
          </p>
          <div className="resume-page__contact">
            <span>South Bend, Indiana</span>
            <span className="resume-page__contact-sep">&bull;</span>
            <a href="mailto:rdeboer180@gmail.com">rdeboer180@gmail.com</a>
            <span className="resume-page__contact-sep">&bull;</span>
            <span>574-261-7049</span>
            <span className="resume-page__contact-sep">&bull;</span>
            <a href="#/">Portfolio</a>
          </div>
        </header>

        <div className="resume-page__divider resume-page__divider--accent" />

        {/* Summary */}
        <section className="resume-page__section">
          <p className="resume-page__summary">
            Senior UI Engineer and Design Systems Specialist with 10+ years of experience designing and building
            scalable, component-driven web interfaces. I specialize in bridging design and engineering by translating
            complex product designs into reusable UI systems and production-ready front-end components. My work
            focuses on developing sustainable design frameworks in Figma, collaborating closely with engineering teams
            to ensure design-to-code parity, and creating scalable component libraries that support consistent user
            experiences across multiple platforms. I also partner with analytics, SEO, and A/B testing teams to ensure
            design decisions are informed by real user behavior rather than assumptions. With a strong foundation in
            HTML, CSS, and modern design systems, I bring a systems-thinking approach to UX/UI development that
            prioritizes performance, accessibility, and maintainable front-end architecture while fostering strong cross-team collaboration.
          </p>
        </section>

        {/* Two-column layout */}
        <div className="resume-page__columns">
          {/* Sidebar */}
          <aside className="resume-page__sidebar">
            {/* Skills */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Skills</h2>
              <ul className="resume-page__skill-list">
                <li>Figma Component Design</li>
                <li>Landing Page Design</li>
                <li>Design Psychology</li>
                <li>Responsive Web Design</li>
                <li>10+ years HTML/CSS</li>
                <li>SEO-Focused UI</li>
                <li>AI-Assisted Workflows</li>
                <li>Accessibility Best Practices</li>
                <li>Cross Functional Collaboration</li>
                <li>5+ years leading employee growth programs</li>
              </ul>
            </section>

            {/* Tools */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Tools</h2>
              <ul className="resume-page__tool-list">
                <li><strong>Figma</strong></li>
                <li>VS Code</li>
                <li>iTerm2</li>
                <li><strong>Adobe Experience Manager (AEM)</strong></li>
                <li>WordPress</li>
                <li>Adobe Photoshop</li>
                <li><strong>Adobe Illustrator</strong></li>
                <li>Adobe InDesign</li>
              </ul>
            </section>

            {/* Certifications */}
            <section className="resume-page__section">
              <h2 className="resume-page__section-title">Certifications</h2>
              <ul className="resume-page__cert-list">
                <li>AEM Authoring Essentials</li>
                <li>AI Toolkit for Web Development &amp; SEO</li>
                <li>Design Psychology Masterclass</li>
                <li>Fast &amp; Effective Landing Page Design</li>
                <li>Ultimate Figma &amp; UI Masterclass</li>
              </ul>
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
                    <span className="resume-page__job-role">Senior Web Designer — in Addition to my prior responsibilities</span>
                  </div>
                  <span className="resume-page__job-date">2021–Present</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Lead the design and integration of AEM core components, partnering with backend engineers to build scalable CMS-driven UI architecture.</li>
                  <li>Design and maintain reusable UI components and design systems in Figma, supporting multiple internal and customer-facing sites.</li>
                  <li>Translate complex product designs and UX wireframes into production-ready front-end components.</li>
                  <li>Partner with React developers to bring component systems from design into scalable front-end implementations.</li>
                  <li>Work closely with SEO, analytics, and A/B testing teams to optimize user experiences based on real customer behavior and performance insights.</li>
                  <li>Design and implement conversion-focused landing pages using SEO-informed UI patterns and accessibility best practices.</li>
                  <li>Introduced AI-assisted workflows to enhance SEO insights, accessibility validation, and design iteration efficiency.</li>
                  <li>Collaborate cross-functionally with design, engineering, and marketing teams to ensure consistency across digital products.</li>
                </ul>
              </div>

              {/* Tire Rack — Web Designer */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Tire Rack</h3>
                    <span className="resume-page__job-role">Web Designer</span>
                  </div>
                  <span className="resume-page__job-date">2014–2021</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Built and maintained responsive web experiences using HTML/CSS and enterprise CMS platforms.</li>
                  <li>Translated UX wireframes and product concepts into scalable front-end UI.</li>
                  <li>Managed AEM authoring workflows and collaborated with developers on site architecture improvements.</li>
                  <li>Contributed to ongoing UI consistency through reusable design patterns and shared component strategies.</li>
                </ul>
              </div>

              {/* Round 2 Corp */}
              <div className="resume-page__job">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Round 2 Corp</h3>
                    <span className="resume-page__job-role">Product Designer / Package Designer</span>
                  </div>
                  <span className="resume-page__job-date">2013–2014</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Designed action figures, model kits, and wood toy artwork and packaging for major brands including Veggietales, Rudolph, Peanuts, Star Trek, and Marvel.</li>
                </ul>
              </div>

              {/* Freelance */}
              <h3 className="resume-page__subsection-title">Freelance Work</h3>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Heatherwood Equestrian Academy</h3>
                  </div>
                  <span className="resume-page__job-date">2023–2024</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Built and maintained responsive WordPress customer-focused website.</li>
                  <li>Developed brand identity and logo design.</li>
                </ul>
              </div>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">Stompin Barley Wine Bar</h3>
                  </div>
                  <span className="resume-page__job-date">2017–2018</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Created logo and brand identity.</li>
                  <li>Built and maintained website for menu updates and special event promotions.</li>
                </ul>
              </div>

              <div className="resume-page__job resume-page__job--compact">
                <div className="resume-page__job-header">
                  <div>
                    <h3 className="resume-page__job-company">FitStop / Vitamin Giant</h3>
                  </div>
                  <span className="resume-page__job-date">2012–2013</span>
                </div>
                <ul className="resume-page__job-list">
                  <li>Restructured and coded Vitamin Giant website.</li>
                  <li>Created ads, business cards, and promotional materials.</li>
                </ul>
              </div>

              {/* Early Career */}
              <h3 className="resume-page__subsection-title">Early Career</h3>
              <div className="resume-page__early-career">
                <p>South Bend Tribune — Ad Designer (Summer 2011)</p>
                <p>Notre Dame Technology Dept. — Graphic Designer (Summer 2009)</p>
                <p>WSBT — Graphic Design Intern (Jan–May 2008)</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
