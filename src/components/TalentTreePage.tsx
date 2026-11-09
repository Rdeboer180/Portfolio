// ============================================
// TalentTreePage — /talent-tree/
// Ryan's skill tree, read only, in board 25's look (SkillTreeCanvas). The
// build-your-own route was retired on 8 November 2026: /talent-tree/build/ and
// every older share link now land here, on Ryan's tree, with no state.
//
// Everything shown is computed by src/data/talent; SkillTreeCanvas holds the page
// state. This file owns the route: the head metadata, the nav and the footer.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { RYAN_CLASS_LABEL } from '../data/talent/ryan';
import SkillTreeCanvas, { FRONT_ROUTE } from './talent/SkillTreeCanvas';
import '../styles/styles.scss';
// the skill tree's own styles, loaded with its page rather than with every page
import '../styles/components/_skill-tree.scss';

const TalentTreePage: React.FC = () => {
  usePageMeta({
    title: 'Skill tree | Ryan DeBoer',
    description: `I could never pick one title, so I built a skill tree and put sixteen years of points where they went. ${RYAN_CLASS_LABEL}, Lv 16.`,
    canonical: `${SITE.portfolioUrl}${FRONT_ROUTE}`,
    ogType: 'website',
  });

  return (
    <article className="fc-page">
      <nav className="fc-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="fc-page__logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="fc-page__back">&larr; Back to Home</Link>
      </nav>
      <div className="fc-page__body">
        <SkillTreeCanvas />
      </div>
      <Footer />
    </article>
  );
};

export default TalentTreePage;
