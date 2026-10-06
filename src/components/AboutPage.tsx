// ============================================
// AboutPage — editorial story-stack + the loop, drawn as a circuit
// Route: #/about
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import AboutHero from './AboutHero';
import { CareerTimeline } from './About';
import AboutStorySections from './AboutStorySections';
import ProcessPrinciples from './ProcessPrinciples';
import ProcessStrengths from './ProcessStrengths';
import LinkedInLink from './LinkedInLink';
import CandidateSnapshot from './CandidateSnapshot';
import AboutModeSwitcher, { AboutMode } from './AboutModeSwitcher';
import AboutStudio from './AboutStudio';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import '../styles/styles.scss';

const AboutPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AboutMode>('approach');

  usePageMeta({
    title: 'About — Ryan DeBoer, Product Design Engineer',
    description:
      'Product designer with a systems focus and deep roots in visual craft. The story behind my design systems, hands-on web work, and agent-assisted product builds. South Bend, Indiana. Open to remote US roles.',
    canonical: `${SITE.portfolioUrl}/about/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
  });
  return (
    <article className="about-page">
      {/* Nav — fixed, logo + Back to Home */}
      <nav className="about-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="about-page__nav-logo">
          Ryan DeBoer
        </Link>
        <Link to={getHomeHref()} className="about-page__nav-back">
          &larr; Back to Home
        </Link>
      </nav>

      <AboutModeSwitcher activeMode={activeMode} onChange={setActiveMode} />

      {/* Both panels are always in the DOM, and the inactive one carries the
          `hidden` attribute rather than being unmounted. A ternary here meant
          the prerendered HTML only ever contained whichever tab happened to be
          the default, so half of this page's claims — the four-beat loop, the
          attribution ledger, the studio — were invisible to crawlers and to
          anyone without JS. `hidden` keeps the markup in the source while the
          UA still pulls it out of the accessibility tree, which is what a
          tabpanel needs. See the `[hidden]` guard in _about-page.scss. */}
      <div
        id="about-mode-panel-approach"
        role="tabpanel"
        aria-labelledby="about-mode-tab-approach"
        className="about-page__mode-panel"
        hidden={activeMode !== 'approach'}
      >
        {/* ── Hero — text-first editorial intro ─────────────────────────── */}
        <AboutHero />

        {/* ── At a glance — factual candidate snapshot for recruiters + AI ─ */}
        <CandidateSnapshot variant="full" />

        {/* ── Story — six text-first beats (career evolution, not tabs) ─── */}
        <AboutStorySections />
        <CareerTimeline showMore={false} />

        {/* ── Bridge — editorial transition into the working process ─────── */}
        <section className="about-page__transition-card" aria-labelledby="about-work-bridge-heading">
          <div className="about-page__transition-inner">
            <h2 id="about-work-bridge-heading" className="about-page__transition-headline">
              How that shows up in the work
            </h2>
            <div className="about-page__transition-copy">
            <p className="about-page__transition-body">
              I keep working on a design after it leaves Figma. I check how it behaves in the
              product and use what implementation reveals to improve the next version.
            </p>
            <p className="about-page__transition-note">
              This site is one working example. The decisions behind it live in{' '}
              <Link to="/notes" className="about-page__transition-notes-link">the notes</Link>,
              alongside the systems, mistakes, and open questions that shaped the work.
            </p>
            <LinkedInLink
              label="Read along as it happens"
              surface="about_bridge"
              className="about-page__transition-link"
            />
            </div>
          </div>
        </section>

        {/* ── How I work — the four-beat loop, drawn as a closed circuit ── */}
        <ProcessPrinciples />

        {/* ── Strengths — the homepage list, relocated and vouched for ──── */}
        <ProcessStrengths />
      </div>

      <div
        id="about-mode-panel-studio"
        role="tabpanel"
        aria-labelledby="about-mode-tab-studio"
        className="about-page__mode-panel"
        hidden={activeMode !== 'studio'}
      >
        <AboutStudio />
      </div>

      <Footer />
    </article>
  );
};

export default AboutPage;
