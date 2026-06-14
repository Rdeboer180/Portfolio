// ============================================
// AboutPage — editorial story-stack + process principles
// Route: #/about
// ============================================

import React from 'react';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import AboutHero from './AboutHero';
import AboutStorySections from './AboutStorySections';
import ProcessPrinciples from './ProcessPrinciples';
import '../styles/styles.scss';

const AboutPage: React.FC = () => {
  return (
    <article className="about-page">
      {/* Nav — fixed, logo + Back to Home */}
      <nav className="about-page__nav">
        <a href={getHomeHref()} className="about-page__nav-logo">
          Ryan DeBoer
        </a>
        <a href={getHomeHref()} className="about-page__nav-back">
          &larr; Back to Home
        </a>
      </nav>

      {/* ── Hero — text-first editorial intro ─────────────────────────────── */}
      <AboutHero />

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
            That is the through-line from visual design to front-end logic, from systems thinking
            to AI-assisted workflows. The tools keep changing. The standard does not.
          </p>
        </div>
      </div>

      {/* ── My Process — 5-row principles accordion ───────────────────────── */}
      <ProcessPrinciples />

      <Footer />
    </article>
  );
};

export default AboutPage;
