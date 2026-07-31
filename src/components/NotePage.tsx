import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { getNote, KIND_LABEL } from '../data/notes';
import Footer from './Footer';
import '../styles/styles.scss';

// ============================================
// Single note — clean reading layout: mono meta, title, dek, ~68ch body.
// Skill entries surface their downloadable artifact in the header.
// ============================================

const NotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const note = slug ? getNote(slug) : undefined;

  usePageMeta(
    note
      ? {
          title: `${note.title} — Notes — Ryan DeBoer`,
          description: note.dek,
          canonical: `${SITE.portfolioUrl}/notes/${note.slug}/`,
          ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
          ogType: 'article',
        }
      : { title: 'Notes — Ryan DeBoer' }
  );

  if (!note) return <Navigate to="/notes" replace />;

  return (
    <article className="notes notes--single">
      <nav className="notes__nav" aria-label="Primary">
        <div className="notes__nav-inner">
        {/* Logo always goes home; "All notes" is the section breadcrumb */}
        <Link to={getHomeHref()} className="notes__nav-logo">Ryan DeBoer</Link>
        <Link to="/notes" className="notes__nav-back">&larr; All notes</Link>
        </div>
      </nav>

      <header className="notes__header notes__header--article">
        <p className="notes__meta">
          <span className={`notes__row-kind notes__row-kind--${note.kind}`}>
            {KIND_LABEL[note.kind]}
          </span>
          <time dateTime={note.dateISO}>{note.date}</time>
          <span>·</span>
          <span>{note.read} read</span>
          {note.kind === 'essay' && (
            <span className="notes__meta-source">· first thought out loud on LinkedIn</span>
          )}
        </p>
        <h1 className="notes__title">{note.title}</h1>
        <p className="notes__dek">{note.dek}</p>
        {note.artifact && (
          <a href={note.artifact.href} className="notes__artifact" target="_blank" rel="noopener noreferrer">
            {note.artifact.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </header>

      <div className="notes__body">{note.body}</div>

      {/* Close rail is a statement, not a nav. "All notes" lives in the header
          and contact lives in the shared footer below. */}
      <aside className="notes__close">
        <span className="notes__close-label">[ In Progress ]</span>
        <p className="notes__close-body">
          Most of these start as a half-formed thought on LinkedIn and get cleaned up on the way
          here. If you want the rough cut, that&rsquo;s where it shows up first.
        </p>
      </aside>

      <Footer />
    </article>
  );
};

export default NotePage;
