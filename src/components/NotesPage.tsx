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
// Three streams, ordered by how settled the thinking is: raw thought (essays
// off LinkedIn), work still moving (build logs), then the resolved artifacts.
// ============================================

const NotesPage: React.FC = () => {
  const essays = NOTES_BY_DATE.filter((n) => n.kind === 'essay');
  const logs = NOTES_BY_DATE.filter((n) => n.kind === 'log');
  const resolved = NOTES_BY_DATE.filter((n) => n.kind === 'skill' || n.kind === 'system');
  // NOTES_BY_DATE is sorted newest first, so the head of it is the one entry
  // that gets the tint and the selection frame.
  const newestSlug = NOTES_BY_DATE[0]?.slug;
  usePageMeta({
    title: 'Notes — Ryan DeBoer on craft, systems, and care',
    description:
      'Writing from the work: design systems that outlive their designer, AI with human judgment, published agent skills, naming an LLC, and how this site is built.',
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

      {/* Intro is one two-column band on desktop: the page's own statement on
          the left, the way in on the right, so the first screen carries both
          instead of pushing Start Here below the fold. Collapses to a single
          column at the same breakpoint the stream rails do, header first. */}
      <div className="notes__intro">
      <header className="notes__header">
        <p className="notes__eyebrow">[ Notes ]</p>
        <h1 className="notes__title">Writing from the work</h1>
        <p className="notes__lede">
          Craft is the through-line. Essays argue a judgment, build logs follow a decision while
          it is still moving, and skill and system entries publish the artifact that encodes it.
        </p>
      </header>

      <section className="notes__pinned-wrap" aria-label="Start here">
        <div className="notes__pinned">
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
        </div>
      </section>
      </div>

      {/* Each stream is a rail plus its rows: the rail carries the number at
          display scale, the name, the count and one handwritten aside; the rows
          stay hairline-separated with a read-time and sketch-arrow. Stream 01
          alone takes the accent, so orange still means one thing on the page. */}
      <NoteStream
        index="01"
        label="Thinking Out Loud"
        ariaLabel="Notes from LinkedIn"
        sub="Blog-like thoughts that started as public LinkedIn posts. Lightly edited, still warm."
        aside="the rough cut is on LinkedIn"
        count={essays.length}
        notes={essays}
        accent
        newestSlug={newestSlug}
        rail={<LinkedInLink label="Read them as they land" surface="notes_stream" />}
      />
      <NoteStream
        index="02"
        label="In Progress"
        ariaLabel="Build logs"
        sub="Work that isn't settled. Published while the decisions are still moving, discarded directions included."
        aside="dated because they will age"
        count={logs.length}
        notes={logs}
        newestSlug={newestSlug}
      />
      <NoteStream
        index="03"
        label="Resolved"
        ariaLabel="Systems and skills"
        sub="The settled artifacts: how things work, and the skills that encode the judgment."
        aside="the artifact, not the argument"
        count={resolved.length}
        notes={resolved}
        newestSlug={newestSlug}
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
  aside: string;
  count: number;
  notes: typeof NOTES_BY_DATE;
  rail?: React.ReactNode;
  /** Exactly one stream carries the accent — see DESIGN.md's section-rule rule. */
  accent?: boolean;
  /** Slug of the newest note on the page; that row wears the selection frame. */
  newestSlug?: string;
}> = ({ index, label, ariaLabel, sub, aside, count, notes, rail, accent, newestSlug }) => (
  <section
    className={`notes__section${accent ? ' notes__section--accent' : ''}`}
    aria-label={ariaLabel}
  >
    {/* The rail delineates the stream, replacing the thin horizontal rule it
        used to carry: a stream number at display scale, its name, its count,
        and one handwritten aside, all in one column against a vertical edge.
        Only the first stream takes the accent — one section at a time. */}
    <div className="notes__section-grid">
      <div className="notes__section-rail">
        <span className="notes__stream-index" aria-hidden="true">{index}</span>
        <h2 className="notes__stream-label">{label}</h2>
        <span className="notes__section-count">
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
        {/* The aside lives in the rail rather than its own margin column, which
            is what lets it survive: the rail already stacks above the rows on
            narrow screens, so the note comes with it as a lead-in line. */}
        <span className="notes__stream-aside" aria-hidden="true">{aside}</span>
        <svg className="notes__stream-arrow" viewBox="0 0 120 22" aria-hidden="true" focusable="false">
          <path d="M6 14 C 40 14, 78 10, 112 8" fill="none" strokeLinecap="round" />
          <path d="M112 8 L 102 12 M112 8 L 104 3" fill="none" strokeLinecap="round" />
        </svg>
        <p className="notes__stream-sub">{sub}</p>
        {rail}
      </div>
      <div className="notes__section-rows">
        {notes.map((note) => (
          <Link
            key={note.slug}
            to={`/notes/${note.slug}/`}
            className={`notes__row${note.slug === newestSlug ? ' notes__row--newest' : ''}`}
          >
            <div className="notes__row-meta">
              <time className="notes__row-date" dateTime={note.dateISO}>{note.date}</time>
              <span className={`notes__row-kind notes__row-kind--${note.kind}`}>
                {KIND_LABEL[note.kind]}
              </span>
            </div>
            <div className="notes__row-main">
              <h3 className="notes__row-title">{note.title}</h3>
              <p className="notes__row-dek">{note.dek}</p>
            </div>
            {/* Marching-ants marquee — Photoshop's selection border, in Signal
                Orange. Its own element rather than a pseudo: the newest row
                already spends ::before and ::after on corner handles. */}
            <span className="notes__row-marquee" aria-hidden="true" />
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
