import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE } from '../data/site';
import { decodeAtlas, encodeAtlas } from '../data/talent/atlasState';
import { getHomeHref } from '../utils/homeSession';
import TalentAtlas from './talent/TalentAtlas';
import '../styles/styles.scss';

const TalentAtlasPage: React.FC<{ own?: boolean }> = ({ own }) => {
  const navigate = useNavigate();
  const route = own ? '/talent-tree/build/' : '/talent-tree/';
  usePageMeta({
    title: own ? 'Build your talent tree | The Forge' : 'The Forge | Ryan DeBoer’s talent tree',
    description: own
      ? 'Start with your experience, allocate talent points, and discover the proficiencies and class they unlock.'
      : 'See where Ryan DeBoer’s experience points landed across visual craft, systems, technical practice, and code.',
    canonical: `${SITE.portfolioUrl}${route}`,
    ogType: 'website',
  });
  useEffect(() => {
    if (own) return;
    const legacy = new URLSearchParams(window.location.search).get('t');
    const build = legacy ? decodeAtlas(legacy) : null;
    if (build) navigate(`/talent-tree/build/#${new URLSearchParams({ s: encodeAtlas(build) })}`, { replace: true });
  }, [navigate, own]);
  return <article className="tt"><nav className="tt__nav" aria-label="Primary"><Link to={getHomeHref()} className="tt__nav-logo">Ryan DeBoer</Link><Link to={getHomeHref()} className="tt__nav-back">← Back to Home</Link></nav><div className="tt__page"><TalentAtlas key={own ? 'build' : 'ryan'} own={own} baseRoute="/talent-tree" /></div><Footer /></article>;
};
export default TalentAtlasPage;
