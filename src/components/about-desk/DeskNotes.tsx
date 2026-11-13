// The notes the desk's things open. A click on a thing plays its motion, then
// its note slides in from the side away from it, so the thing stays in view.
// Each archive card opens a very short case study; each prop in the gutters
// opens Ryan's top ten for it as a PlayDraft draft room (DraftRoom.tsx,
// deskDrafts.ts); the phone tells the Loop story.
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DismissStrip from '../DismissStrip';
import { ARCHIVE_CARDS } from '../../data/archiveCards';
import ArchiveCard from '../ArchiveCard';
import { KIND_LABEL, NOTES_BY_DATE } from '../../data/notes';
import { RYAN_CLASS_SHORT } from '../../data/talent/ryan';
import { DRAFTS } from './deskDrafts';
import { DraftRoom } from './DraftRoom';
import playdraft from '../../data/playdraft.json';
import { FEATURED, initials, testimonials } from '../Testimonials';
import { strengthRows } from '../../data/about';
import LinkedInLink from '../LinkedInLink';

/** the opening of every draft note: what PlayDraft is and why, then which board this is */
const PlayDraftIntro: React.FC<{ topic: string }> = ({ topic }) => (
  <>
    <p className="note__intro">PlayDraft is my passion project, built in the summer of 2026: a home for friends to draft and debate any content pack, from movies to GOAT athletes. Rankings are the best arguments my friends and I have, and they deserve a draft board, a clock and a winner, not a group chat that scrolls away.</p>
    <p className="note__dek">You discovered my personal draft board for my favorite {topic}.</p>
  </>
);

/** under every draft: the way in to PlayDraft, then where the room is from */
const FromPlayDraft = () => (
  <>
    <p className="note__cta"><a href={playdraft.appStoreUrl} target="_blank" rel="noopener noreferrer">Join PlayDraft and draft your own top 10 <span aria-hidden="true">↗</span><span className="sr-only"> (opens the App Store in a new tab)</span></a></p>
    <p className="note__fine">Drawn from PlayDraft, the app I am building. <Link to="/work/playdraft/">Read the PlayDraft case study</Link></p>
  </>
);

/** the playground's four prototypes, as its directory lists them (/lab/playground/) */
const PROTOTYPES = [
  { href: '/demo/tire-fitment/', label: 'Demo', title: 'Tire Fitment Prototype', what: 'Pick a vehicle and the page narrows to the sizes that fit, and says so when a tire isn’t made for your car. The method end to end, with the handoff attached.', go: 'Open the prototype' },
  { href: '/lab/wheelrack-handoff/', label: 'WheelRack · Tire Rack', title: 'A prototype as the handoff', what: 'Two product tiles rebuilt from the live site, the edge case as it ships next to the fix. Dev notes name the React state that owns each rule.', go: 'Open WheelRack' },
  { href: '/lab/binder/', label: 'Portfolio binder', title: 'Judgment over agent output', what: 'My homepage rebuilt as a binder of collectible cards with Claude agents, with the prompts that steered it and the calls I made against their advice.', go: 'Open the binder' },
  { href: '/lab/aem/', label: 'AEM QA · Tire Rack', title: 'One review entry per change', what: 'A skill builds the review doc for an AEM update: each change gets its rule, captures and diff, so design, engineering and QA read the same entry.', go: 'Open AEM' },
];

export interface NoteProps {
  open: (note: string) => void;
}

/** the note for one archive card: a case study in four lines */
const CardNote: React.FC<{ slug: string } & NoteProps> = ({ slug, open }) => {
  const i = ARCHIVE_CARDS.findIndex((c) => c.slug === slug);
  const card = ARCHIVE_CARDS[i];
  if (!card) return null;
  const next = ARCHIVE_CARDS[(i + 1) % ARCHIVE_CARDS.length];
  return (
    <>
      <h3>The archive · {card.index} of {ARCHIVE_CARDS.length}</h3>
      <h2 id="desk-note-title">{card.title}</h2>
      <p className="note__dek">{card.subtitle} · {card.year} · {card.category}</p>
      <img className="note__art" src={card.hero} alt={card.heroAlt} />
      <h4>The work</h4>
      <p>{card.heroAlt}</p>
      <h4>What I made</h4>
      <ul className="note__stats">
        {card.stats.map((s) => <li key={s.primary}><b>{s.value}</b><span>{s.primary}<small>{s.secondary}</small></span></li>)}
      </ul>
      <p className="note__fine">First edition, archived artwork. Work from before the case studies in the binder.</p>
      <button type="button" className="note__next" onClick={() => open(`card:${next.slug}`)}>Next card: {next.title} →</button>
    </>
  );
};

const NOTES: Record<string, (p: NoteProps) => React.ReactNode> = {
  games: () => (
    <>
      <h3>Game Boy Color, Atomic Purple</h3>
      <h2 id="desk-note-title">My top 10 games</h2>
      <PlayDraftIntro topic="video games" />
      <DraftRoom spec={DRAFTS.games} />
      <FromPlayDraft />
    </>
  ),
  pokemon: () => (
    <>
      <h3>Pokémon Red</h3>
      <h2 id="desk-note-title">My top 10 Pokémon</h2>
      <PlayDraftIntro topic="Pokémon" />
      <p>PlayDraft has no Pokémon pack, so this is a custom draft: every pick is a write-in.</p>
      <DraftRoom spec={DRAFTS.pokemon} />
      <FromPlayDraft />
    </>
  ),
  tv: () => (
    <>
      <h3>Four stars</h3>
      <h2 id="desk-note-title">My favorite TV series of all time</h2>
      <PlayDraftIntro topic="TV series" />
      <p>Of the seven, the four-star ball is the one Goku keeps from his grandfather, so it is the one on my desk. Dragon Ball Z and Super share one spot on my list.</p>
      <p>Drafted from All TV, the series pack I am building for PlayDraft now.</p>
      <DraftRoom spec={DRAFTS.tv} />
      <FromPlayDraft />
    </>
  ),
  movies: () => (
    <>
      <h3>Grays Sports Almanac</h3>
      <h2 id="desk-note-title">My favorite movies of all time</h2>
      <PlayDraftIntro topic="movies" />
      <p>Drafted from PlayDraft’s Movies pack.</p>
      <DraftRoom spec={DRAFTS.movies} />
      <FromPlayDraft />
    </>
  ),
  podcasts: () => (
    <>
      <h3>Always in my ears</h3>
      <h2 id="desk-note-title">My top 10 podcasts</h2>
      <PlayDraftIntro topic="podcasts" />
      <p>A custom draft: fantasy football, design, diabetes tech and the rest of my week.</p>
      <DraftRoom spec={DRAFTS.podcasts} />
      <FromPlayDraft />
    </>
  ),
  designers: () => (
    <>
      <h3>Where the tools started</h3>
      <h2 id="desk-note-title">The designers I learn from</h2>
      <PlayDraftIntro topic="designers and influences" />
      <p>Every tool I use now goes back to learning Illustrator from a disc like this one. Everything since, I have learned from people. This one is a custom draft.</p>
      <DraftRoom spec={DRAFTS.designers} />
      <FromPlayDraft />
    </>
  ),
  goat: () => (
    <>
      <h3>South Bend, Saturdays</h3>
      <h2 id="desk-note-title">My GOAT athletes</h2>
      <PlayDraftIntro topic="athletes" />
      <p>Home is South Bend, Indiana, and in the fall Saturdays belong to Notre Dame. Drafted from PlayDraft’s GOAT Athletes pack.</p>
      <DraftRoom spec={DRAFTS.goat} />
      <FromPlayDraft />
    </>
  ),
  loop: () => (
    <>
      <h3>The phone</h3>
      <h2 id="desk-note-title">I build the app that runs my insulin</h2>
      <p>I have Type 1 diabetes. For eight years I have been part of the DIY Loop community: I build Loop, the open-source app that reads my glucose sensor and adjusts my insulin pump on its own, and I maintain it myself.</p>
      <p>Now I am experimenting with custom builds. My fork adds parabolic carb absorption, an 8-hour curve for heavy meals and a 12-hour curve for dessert, past meals saved as favorites, and a rolling 24-hour carb history. Every patch is public in <a href="https://github.com/Rdeboer180/LoopWorkspace" target="_blank" rel="noopener noreferrer">my LoopWorkspace fork on GitHub <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span></a>. The screen on the desk is a working copy of it. Hover the reading.</p>
      <p>LoopStack builds on everything that accumulates while I loop. It compares what Loop predicted after a meal with what happened, then groups repeated curves into patterns worth reviewing with my care team.</p>
      <p>The same story runs through my other work for people with Type 1: T1D Hub, the brand and design system I built with Dr. Brian Huber for his practice, and Bolus Binder, the companion app that carries it into the kitchen.</p>
      <div className="note__links">
        <Link className="btn btn--primary btn--md" to="/work/loopstack/">Read the LoopStack case study</Link>
        <Link className="btn btn--secondary btn--md" to="/work/bolus-binder/">T1D Hub &amp; Bolus Binder</Link>
      </div>
      <p className="note__fine">My own setup, shared as a design story. Nothing here is medical advice.</p>
    </>
  ),
  tree: () => (
    <>
      <h3>The sketch under the pencil</h3>
      <h2 id="desk-note-title">The skill tree</h2>
      <p>My skill tree, drawn out: where my points sit across design, the technical work that connects it, and code. The class it computes is {RYAN_CLASS_SHORT}.</p>
      <div className="note__links">
        <Link className="btn btn--primary btn--md" to="/talent-tree/">Open the skill tree</Link>
      </div>
    </>
  ),
  notes: () => (
    <>
      <h3>The notebook</h3>
      <h2 id="desk-note-title">Notes</h2>
      <p>Decisions, mistakes and open questions, written while the work is still moving. Click the notebook again to turn its pages. The newest:</p>
      <ul className="note__list">
        {NOTES_BY_DATE.slice(0, 5).map((n) => (
          <li key={n.slug}>
            <small className="note__list-meta"><span className="bracketed">{KIND_LABEL[n.kind].replace(/^\[\s*|\s*\]$/g, '')}</span>{n.date} · {n.read}</small>
            <Link to={`/notes/${n.slug}/`}>{n.title}</Link>
          </li>
        ))}
      </ul>
      <div className="note__links"><Link className="btn btn--primary btn--md" to="/notes/">All notes</Link></div>
    </>
  ),
  archive: ({ open }) => (
    <>
      <h3>1st Edition · The Early Work</h3>
      <h2 id="desk-note-title">Seven cards that never made the binder</h2>
      <p>Work from before the case studies: identities, packaging, a storefront, toy graphics and a fantasy league crest. Pull any card for its short story.</p>
      {/* the seven, in a page of sleeves: each untucks a little when pointed at, as the binder's cards do */}
      <ul className="note__sleeves">
        {ARCHIVE_CARDS.map((c) => (
          <li key={c.slug}>
            <button type="button" className="note__sleeve" onClick={() => open(`card:${c.slug}`)}>
              <span className="note__sleeve-well" aria-hidden="true"><ArchiveCard card={c} total={ARCHIVE_CARDS.length} eager /></span>
              <b>{c.title}</b>
              <small>{c.subtitle} · {c.year}</small>
            </button>
          </li>
        ))}
      </ul>
    </>
  ),
  // the trackpad opens the playground: how the work starts now, and the four prototypes built there
  pad: () => (
    <>
      <h3>The trackpad · the prototype playground</h3>
      <h2 id="desk-note-title">The canvas isn’t where I start anymore</h2>
      <p className="note__dek">The way I work changes almost daily now. I used to open a Figma file first and hand engineering a picture of the work.</p>
      <p>Now I start in a sibling repo, next to production, and build from production’s own components. The prototype carries every state and its handoff notes, and design and engineering check it from both sides. Figma is still in the loop. It just isn’t the first step.</p>
      <h4>Built in the playground</h4>
      <ul className="note__protos">
        {PROTOTYPES.map((p) => (
          <li key={p.href}>
            <a href={p.href}>
              <small>{p.label}</small>
              <b>{p.title}</b>
              <span>{p.what}</span>
              <em>{p.go} →</em>
            </a>
          </li>
        ))}
      </ul>
      <div className="note__links">
        <a className="btn btn--primary btn--md" href="/lab/playground/">Open the playground</a>
        <a className="btn btn--secondary btn--md" href="/lab/how-i-work/">How I work</a>
      </div>
      <p className="note__fine">The lab is behind the password I share with hiring teams. Ask me for it.</p>
    </>
  ),
};

/** the iPod's note: its top ten songs */
// the shuffle belongs to the iPod itself (a press plays another of the ten on
// its screen); the note is a plain custom draft, like every other one
const SongsNote: React.FC = () => (
  <>
    <h3>iPod mini</h3>
    <h2 id="desk-note-title">My top 10 songs</h2>
    <PlayDraftIntro topic="songs" />
    <p>PlayDraft has no music pack yet, so this is a custom draft: every pick is a write-in.</p>
    <DraftRoom spec={DRAFTS.songs} />
    <FromPlayDraft />
  </>
);

/**
 * A channel's thread: the whole recommendation, as the homepage's DMs show it,
 * one paragraph a message, the lines that matter marked. The next person is
 * one click on, in the homepage's order, so the reader can go through all seven.
 */
const ThreadNote: React.FC<{ name: string } & NoteProps> = ({ name, open }) => {
  const t = testimonials.find((x) => x.name === name);
  if (!t) return null;
  const channel = strengthRows.find((r) => r.vouchers.some((v) => v.kind === 'person' && v.name === name))?.channel ?? 'recommendations';
  const i = FEATURED.indexOf(name);
  const next = FEATURED[(i + 1) % FEATURED.length];
  return (
    <>
      <h3>Thread · # {channel}</h3>
      <h2 id="desk-note-title">{t.name}</h2>
      <p className="note__dek">{t.role}{t.relation ? ` · ${t.relation}` : ''}</p>
      <div className="thread">
        <span className="thread__avatar" aria-hidden="true">{initials(t.name)}</span>
        <div>
          <p className="thread__sender"><b>{t.name}</b> <time dateTime={t.year}>{t.year}</time></p>
          <blockquote className="thread__quote">{t.quote}</blockquote>
          <span className="thread__tag">{t.title}</span>
        </div>
      </div>
      <p className="note__fine">
        <LinkedInLink label="On LinkedIn" surface="testimonial_source" to="recommendations" variant="inline" />
      </p>
      <button type="button" className="note__next" onClick={() => open(`thread:${next}`)}>Next: {next} →</button>
    </>
  );
};

export const noteExists = (key: string) => key.startsWith('card:') || key.startsWith('songs:') || key.startsWith('thread:') || key in NOTES;

/** the note fly-out: one panel, its side chosen away from the thing that opened it */
export const DeskNote: React.FC<{ note: string; side: 'left' | 'right'; onClose: () => void; open: (note: string) => void; back: React.ReactNode }> = ({ note, side, onClose, open, back }) => {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.querySelector<HTMLElement>('.about-desk__close')?.focus({ preventScroll: true });
    panel.current?.scrollTo({ top: 0 });
  }, [note]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  // the way back shows its cursor once the note has slid in (300ms; at once with reduced motion)
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
    return () => window.clearTimeout(t);
  }, []);
  const body = note.startsWith('card:') ? <CardNote slug={note.slice(5)} open={open} />
    : note.startsWith('songs:') ? <SongsNote />
    : note.startsWith('thread:') ? <ThreadNote name={note.slice(7)} open={open} />
    : NOTES[note]?.({ open });
  return (
    <>
      <button type="button" className="about-desk__scrim about-desk__scrim--note" onClick={onClose} aria-label="Close the note" tabIndex={-1} />
      <aside ref={panel} className={`about-desk__flyout note note--${side}`} role="dialog" aria-modal="false" aria-labelledby="desk-note-title" key={note}>
        <button type="button" className="btn btn--secondary btn--md about-desk__close" onClick={onClose}>{back}Back to the desk</button>
        {body}
      </aside>
      {/* the rest of the window is the way back, with the homepage drawer's return cursor */}
      <DismissStrip label="Back to the desk" open={settled} onDismiss={onClose} side={side} width="min(550px, 100vw)" />
    </>
  );
};
