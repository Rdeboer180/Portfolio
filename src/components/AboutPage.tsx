// ============================================
// AboutPage — editorial story-stack + process principles
// Route: #/about
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import AboutHero from './AboutHero';
import AboutStorySections from './AboutStorySections';
import ProcessPrinciples from './ProcessPrinciples';
import LinkedInLink from './LinkedInLink';
import CandidateSnapshot from './CandidateSnapshot';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import '../styles/styles.scss';

const AboutPage: React.FC = () => {
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

      {/* ── Hero — text-first editorial intro ─────────────────────────────── */}
      <AboutHero />

      {/* ── At a glance — factual candidate snapshot for recruiters + AI ───── */}
      <CandidateSnapshot variant="full" />

      {/* ── Story — six text-first beats (career evolution, not tabs) ─────── */}
      <AboutStorySections />

      {/* ── Transition — single orange dot-matrix card ─────────────────────── */}
      <div className="about-page__transition-card">
        <div className="about-page__transition-inner">
          <p className="about-page__transition-label">[ Bridge ]</p>
          <h2 className="about-page__transition-headline">
            How that shows up in the work
          </h2>
          <p className="about-page__transition-body">
            The path has changed over time, but the pattern has stayed consistent: understand the
            problem, shape the experience, build close to the system, ship with care, and use each
            release to make the next one stronger.
          </p>
          <p className="about-page__transition-body">
            That thread runs from visual design to front-end code to design systems to AI-assisted
            work. The tools change; the standard doesn&rsquo;t.
          </p>
          <p className="about-page__transition-note">
            The finished version of that standard is this site. Between releases, I think out loud
            on LinkedIn.
          </p>
          <LinkedInLink
            label="Read along"
            surface="about_bridge"
            className="about-page__transition-link"
          />
        </div>
      </div>

      {/* ── My Process — 5-row principles accordion ───────────────────────── */}
      <ProcessPrinciples />

      <Footer />
    </article>
  );
};

export default AboutPage;
