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
        <div className="notes__nav-inner">
        <Link to={getHomeHref()} className="notes__nav-logo">Ryan DeBoer</Link>
        <Link to={getHomeHref()} className="notes__nav-back">&larr; Back to Home</Link>
        </div>
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

      {/* Two streams, both case-study grammar: a numbered rule opens the
          section, a rail carries its identity (ReadMe-style split), and the
          entries are hairline rows with a read-time + sketch-arrow aside. */}
      <NoteStream
        index="01"
        label="Thinking Out Loud"
        ariaLabel="Notes from LinkedIn"
        sub="Blog-like thoughts that started as public LinkedIn posts. Lightly edited, still warm."
        count={essays.length}
        notes={essays}
        rail={<LinkedInLink label="Read them as they land" surface="notes_stream" />}
      />
      <NoteStream
        index="02"
        label="Resolved"
        ariaLabel="Systems and skills"
        sub="The settled artifacts: how things work, and the skills that encode the judgment."
        count={resolved.length}
        notes={resolved}
      />

      <Footer />
    </article>
  );
};

// ── Stream section — numbered rule + identity rail + entry rows ─────────────
const NoteStream: React.FC<{
  index: string;
  label: string;
  ariaLabel: string;
  sub: string;
  count: number;
  notes: typeof NOTES_BY_DATE;
  rail?: React.ReactNode;
}> = ({ index, label, ariaLabel, sub, count, notes, rail }) => (
  <section className="notes__section" aria-label={ariaLabel}>
    <div className="notes__rule" aria-hidden="true">
      <span className="notes__rule-handle" />
      <span className="notes__rule-label">{index} / {label}</span>
      <span className="notes__rule-line" />
      <span className="notes__rule-handle" />
    </div>
    <div className="notes__section-grid">
      <div className="notes__section-rail">
        <p className="notes__stream-sub">{sub}</p>
        <span className="notes__section-count">
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
        {rail}
      </div>
      <div className="notes__section-rows">
        {notes.map((note) => (
          <Link key={note.slug} to={`/notes/${note.slug}/`} className="notes__row">
            <div className="notes__row-meta">
              <time className="notes__row-date" dateTime={note.dateISO}>{note.date}</time>
              <span className={`notes__row-kind notes__row-kind--${note.kind}`}>
                {KIND_LABEL[note.kind]}
              </span>
            </div>
            <div className="notes__row-main">
              <h2 className="notes__row-title">{note.title}</h2>
              <p className="notes__row-dek">{note.dek}</p>
            </div>
            <div className="notes__row-aside">
              <span className="notes__row-read">{note.read} read</span>
              {/* Hand-sketched arrow — the case-study CTA vocabulary, drawn in on row hover */}
              <svg className="notes__row-arrow" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
                <path d="M6 23 C 14 19, 26 19, 37 22" fill="none" strokeLinecap="round" pathLength={1} />
                <path d="M37 22 L29.5 15.5 M37 22 L30.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default NotesPage;
