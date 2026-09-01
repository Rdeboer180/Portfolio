// ============================================
// AboutPage — editorial story-stack + process principles
// Route: #/about
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import AboutHero from './AboutHero';
import AboutStorySections from './AboutStorySections';
import ProcessPrinciples from './ProcessPrinciples';
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
      '16+ years turning craft, front-end constraints, and production realities into design systems that ship. Ryan DeBoer is a Product Design Engineer in South Bend, Indiana, open to remote roles.',
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

      {activeMode === 'approach' ? (
        <div
          id="about-mode-panel-approach"
          role="tabpanel"
          aria-labelledby="about-mode-tab-approach"
          className="about-page__mode-panel"
        >
          {/* ── Hero — text-first editorial intro ─────────────────────────── */}
          <AboutHero />

          {/* ── At a glance — factual candidate snapshot for recruiters + AI ─ */}
          <CandidateSnapshot variant="full" />

          {/* ── Story — six text-first beats (career evolution, not tabs) ─── */}
          <AboutStorySections />

          {/* ── Transition — single orange dot-matrix card ─────────────────── */}
          <div className="about-page__transition-card">
            <div className="about-page__transition-inner">
              <p className="about-page__transition-label">[ Bridge ]</p>
              <h2 className="about-page__transition-headline">
                How that shows up in the work
              </h2>
              <p className="about-page__transition-body">
                The path changed, but one habit stayed: follow the decision past the frame. I want
                to see how it behaves in the system, what implementation exposes, and what the next
                release should learn from it.
              </p>
              <p className="about-page__transition-body">
                That habit connects the visual work, the front-end code, the design systems, and the
                AI-assisted products. The tools change. The responsibility stays mine.
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

          {/* ── My Process — 5-row principles accordion ───────────────────── */}
          <ProcessPrinciples />
        </div>
      ) : (
        <div
          id="about-mode-panel-studio"
          role="tabpanel"
          aria-labelledby="about-mode-tab-studio"
          className="about-page__mode-panel"
        >
          <AboutStudio />
        </div>
      )}

      <Footer />
    </article>
  );
};

export default AboutPage;
