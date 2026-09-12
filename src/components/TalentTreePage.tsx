// ============================================
// TalentTreePage — /talent-tree/ and /talent-tree/build/
// Two routes, one instrument. The front door (mode "ryan") is Ryan only: no
// intake, no state in the URL, the story in the console's top rail, his
// three trees lit, the masteries and the card in drawers beneath. The build
// path (mode "build") puts the intake in the console's header rail, starts
// the trees empty, and keeps the share state in the URL hash (#s=), so a
// shared tree lands on a page that is not Ryan's.
//
// Everything shown is computed by src/data/talent; TalentConsole holds the
// page state. This file owns the route: the head metadata, the nav, the
// footer, and the one redirect that keeps older ?t= links working (they
// pointed at the front door, which now carries no state, so they go to the
// build path in the hash form).
// ============================================

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { decodeState, encodeState } from '../data/talent/score';
import TalentConsole, { BUILD_ROUTE, FRONT_ROUTE, HASH_KEY, LEGACY_PARAM } from './talent/TalentConsole';
import type { ConsoleMode } from './talent/TalentConsole';
import '../styles/styles.scss';

export interface TalentTreePageProps {
  mode?: ConsoleMode;
}

const META = {
  ryan: {
    title: 'Talent tree — Ryan DeBoer',
    description:
      'I could never pick one title, so I built a talent tree and put sixteen years of points where they went. Guardrail Architect / Prototype Alchemist, Lv 16.',
    canonical: `${SITE.portfolioUrl}${FRONT_ROUTE}`,
  },
  build: {
    title: 'Build your talent tree — Ryan DeBoer',
    description:
      'Three questions, then the fun. Points are earned by time, not self-rated: spend them across three trees and see the design class you have become.',
    canonical: `${SITE.portfolioUrl}${BUILD_ROUTE}`,
  },
};

const TalentTreePage: React.FC<TalentTreePageProps> = ({ mode = 'ryan' }) => {
  const meta = META[mode];
  usePageMeta({
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    ogType: 'website',
  });

  const navigate = useNavigate();

  // A link shared before the build route existed: /talent-tree/?t=<state>.
  // The front door carries no state now, so it hands the state to the build
  // path, in the hash form. Read after mount, never during render.
  useEffect(() => {
    if (mode !== 'ryan') return;
    const raw = new URLSearchParams(window.location.search).get(LEGACY_PARAM);
    if (!raw) return;
    const decoded = decodeState(raw);
    if (!decoded) return;
    navigate(`${BUILD_ROUTE}#${HASH_KEY}=${encodeState(decoded.intake, decoded.allocation)}`, { replace: true });
  }, [mode, navigate]);

  return (
    <article className={`tt tt--${mode}`}>
      <nav className="tt__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="tt__nav-logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="tt__nav-back">&larr; Back to Home</Link>
      </nav>
      <div className="tt__page">
        <TalentConsole mode={mode} />
      </div>
      <Footer />
    </article>
  );
};

export default TalentTreePage;
