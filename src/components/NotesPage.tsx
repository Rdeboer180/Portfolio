import React from 'react';
import { Link } from 'react-router-dom';
import { getHomeHref } from '../utils/homeSession';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { NOTES_BY_DATE, KIND_LABEL } from '../data/notes';
import Footer from './Footer';
import LinkedInLink from './LinkedInLink';
import '../styles/styles.scss';

// ============================================
// Notes index — the writing stream. Editorial list (rows, not cards):
// date · kind chip · title · dek. A pinned "start here" block wears the
// selection frame and puts the design system + taste skill front and center.
// ============================================

const NotesPage: React.FC = () => {
  const essays = NOTES_BY_DATE.filter((n) => n.kind === 'essay');
  const resolved = NOTES_BY_DATE.filter((n) => n.kind !== 'essay');
  usePageMeta({
    title: 'Notes — Ryan DeBoer on craft, systems, and care',
    description:
      'Writing from the work: design systems that outlive their designer, AI with human judgment, published agent skills, and how this site is built.',
    canonical: `${SITE.portfolioUrl}/notes/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
  });

  return (
    <article className="notes">
      <nav className="notes__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="notes__nav-logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="notes__nav-back">&larr; Back to Home</Link>
      </nav>

      <header className="notes__header">
        <p className="notes__eyebrow">[ Notes ]</p>
        <h1 className="notes__title">Writing from the work</h1>
        <p className="notes__lede">
          Craft is the through-line. Essays argue a judgment, skill entries publish the actual
          artifact that encodes it, and system entries point at the running proof.
        </p>
      </header>

      {/* Pinned — the system + the skill, front and center */}
      <section className="notes__pinned" aria-label="Start here">
        <span className="notes__pinned-label">[ Start Here ]</span>
        <div className="notes__pinned-links">
          <Link to="/notes/how-this-site-works" className="notes__pinned-link">
            <span className="notes__pinned-kind">{KIND_LABEL.system}</span>
            <span className="notes__pinned-title">How this site works</span>
          </Link>
          <Link to="/design-system" className="notes__pinned-link">
            <span className="notes__pinned-kind">{KIND_LABEL.system}</span>
            <span className="notes__pinned-title">The design system it runs on</span>
          </Link>
          <Link to="/notes/ryan-design-taste-skill" className="notes__pinned-link">
            <span className="notes__pinned-kind">{KIND_LABEL.skill}</span>
            <span className="notes__pinned-title">The taste skill my agents load</span>
          </Link>
        </div>
      </section>

      {/* Stream 1 — the LinkedIn-born thoughts: loose on purpose, the way
          design notes actually accumulate. Cards sit slightly askew and
          straighten when you reach for them. */}
      <section className="notes__list notes__list--stream" aria-label="Notes from LinkedIn">
        <div className="notes__stream-head">
          <span className="notes__stream-label">[ Thinking Out Loud ]</span>
          <p className="notes__stream-sub">
            Blog-like thoughts that started as public LinkedIn posts. Lightly edited, still warm.
          </p>
          <LinkedInLink label="Read them as they land" surface="notes_stream" />
        </div>
        {essays.map((note) => (
          <Link key={note.slug} to={`/notes/${note.slug}/`} className="notes__row notes__row--loose">
            <div className="notes__row-meta">
              <time className="notes__row-date" dateTime={note.dateISO}>{note.date}</time>
              <span className={`notes__row-kind notes__row-kind--${note.kind}`}>
                {KIND_LABEL[note.kind]}
              </span>
            </div>
            <h2 className="notes__row-title">{note.title}</h2>
            <p className="notes__row-dek">{note.dek}</p>
          </Link>
        ))}
      </section>

      {/* Stream 2 — the resolved artifacts, ruler-straight by contrast */}
      <section className="notes__list notes__list--resolved" aria-label="Systems and skills">
        <div className="notes__stream-head">
          <span className="notes__stream-label">[ Resolved ]</span>
          <p className="notes__stream-sub">
            The settled artifacts: how things work, and the skills that encode the judgment.
          </p>
        </div>
        {resolved.map((note) => (
          <Link key={note.slug} to={`/notes/${note.slug}/`} className="notes__row">
            <div className="notes__row-meta">
              <time className="notes__row-date" dateTime={note.dateISO}>{note.date}</time>
              <span className={`notes__row-kind notes__row-kind--${note.kind}`}>
                {KIND_LABEL[note.kind]}
              </span>
            </div>
            <h2 className="notes__row-title">{note.title}</h2>
            <p className="notes__row-dek">{note.dek}</p>
          </Link>
        ))}
      </section>

      <Footer />
    </article>
  );
};

export default NotesPage;
