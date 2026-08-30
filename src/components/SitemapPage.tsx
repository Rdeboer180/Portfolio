// ============================================
// SitemapPage — human-readable site index
// Route: /sitemap  (data-driven from projects.ts)
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import projects from '../data/projects';
import { getHomeHref } from '../utils/homeSession';
import { SITE, EMAIL_HREF } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import '../styles/styles.scss';

const PAGES = [
  { to: '/', title: 'Home', sub: 'Hero, selected work, and how the work gets made.' },
  { to: '/about/', title: 'About', sub: 'Career arc, point of view, and process principles.' },
  { to: '/resume/', title: 'Résumé', sub: 'Experience and skills, with a printable PDF and vCard.' },
  { to: '/notes/', title: 'Notes', sub: 'Writing from the work — essays, published agent skills, and how this site is built.' },
  { to: '/design-system/', title: 'Design System', sub: 'The tokens and components this site is built on.' },
];

const visible = projects.filter((p) => !p.hidden);
const clientWork = visible.filter((p) => p.stream === 'professional');
const selfWork = visible.filter((p) => p.stream !== 'professional');

interface RowProps {
  to: string;
  title: string;
  sub?: string;
  meta?: string;
  external?: boolean;
}

const Row: React.FC<RowProps> = ({ to, title, sub, meta, external }) => {
  const inner = (
    <>
      <span className="sitemap__row-main">
        <span className="sitemap__row-title">{title}</span>
        {sub && <span className="sitemap__row-sub">{sub}</span>}
      </span>
      {meta && <span className="sitemap__row-meta">{meta}</span>}
      <span className="sitemap__row-arrow" aria-hidden="true">&rarr;</span>
    </>
  );
  return (
    <li className="sitemap__row">
      {external ? (
        <a href={to} className="sitemap__row-link" target="_blank" rel="noopener noreferrer">
          {inner}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link to={to} className="sitemap__row-link">
          {inner}
        </Link>
      )}
    </li>
  );
};

const Section: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({ title, count, children }) => (
  <section className="sitemap__section">
    <h2 className="sitemap__section-title">
      {title}
      <span className="sitemap__section-count">{count}</span>
    </h2>
    <ul className="sitemap__list">{children}</ul>
  </section>
);

const SitemapPage: React.FC = () => {
  usePageMeta({
    title: 'Site Index — Ryan DeBoer',
    description:
      'Every page on rdeboerdesigns.com — main pages, client and employer case studies, and self-initiated products, in one place.',
    canonical: `${SITE.portfolioUrl}/sitemap/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'website',
  });

  return (
    <div className="sitemap-page">
      <nav className="sitemap-page__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="sitemap-page__nav-logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="sitemap-page__nav-back">&larr; Back to Home</Link>
      </nav>

      <div className="sitemap-page__inner">
        <header className="sitemap-page__header">
          <p className="sitemap-page__eyebrow">Site Index</p>
          <h1 className="sitemap-page__title">Every public page</h1>
          <p className="sitemap-page__lead">
            The main pages, client and employer work, self-initiated products, and notes on how
            they were made.
          </p>
        </header>

        <Section title="Pages" count={PAGES.length}>
          {PAGES.map((p) => (
            <Row key={p.to} to={p.to} title={p.title} sub={p.sub} />
          ))}
        </Section>

        <Section title="Client & Employer Work" count={clientWork.length}>
          {clientWork.map((p) => (
            <Row key={p.slug} to={`/work/${p.slug}/`} title={p.seoTitle ?? p.title} meta={p.year} />
          ))}
        </Section>

        <Section title="Self-Initiated Products" count={selfWork.length}>
          {selfWork.map((p) => (
            <Row key={p.slug} to={`/work/${p.slug}/`} title={p.seoTitle ?? p.title} meta={p.year} />
          ))}
        </Section>

        <Section title="Connect" count={2}>
          <Row to={EMAIL_HREF} title="Email" sub="rdeboer180@gmail.com" external />
          <Row to={SITE.linkedinUrl} title="LinkedIn" sub="linkedin.com/in/ryandeboerdesigns" external />
        </Section>
      </div>

      <Footer />
    </div>
  );
};

export default SitemapPage;
