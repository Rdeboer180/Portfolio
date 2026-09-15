import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import TalentAtlas from './talent/TalentAtlas';
import '../styles/styles.scss';

/** Review route while Atlas v2's visual and discovery decisions are being validated. */
const TalentAtlasPage: React.FC<{ own?: boolean }> = ({ own }) => {
  usePageMeta({ title: 'Talent Atlas preview — Ryan DeBoer', description: 'An interactive map of design experience and the abilities it creates.' });
  useEffect(() => {
    const previous = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const original = previous?.content;
    const tag = previous || document.createElement('meta');
    tag.name = 'robots'; tag.content = 'noindex';
    if (!previous) document.head.appendChild(tag);
    return () => { if (previous) tag.content = original || ''; else tag.remove(); };
  }, []);
  return <article className="tt"><nav className="tt__nav" aria-label="Primary"><Link to="/" className="tt__nav-logo">Ryan DeBoer</Link><Link to="/talent-tree/" className="tt__nav-back">Current talent tree ↗</Link></nav><div className="tt__page"><TalentAtlas own={own} /></div></article>;
};
export default TalentAtlasPage;
