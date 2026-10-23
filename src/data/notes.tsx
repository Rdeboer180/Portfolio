
// ============================================
// Notes — the writing stream. Craft is the through-line: field notes record a
// judgment, skill entries publish the actual artifact that encodes it, and
// system entries point at the running proof. Bodies are JSX so entries can
// link into the site (design system, case studies, demos) and reuse the
// site's own vocabulary. Newest first in the NOTES array.
//
// This file holds what lists and headers need (titles, dates, deks); each
// note's body lives in notesBodies.tsx, which only the note page loads, so
// the homepage's three titles don't ship every note's full text.
// ============================================

export type NoteKind = 'reflection' | 'exploration' | 'practice' | 'skill' | 'system';

export interface Note {
  slug: string;
  kind: NoteKind;
  /** Explorations published while decisions are still moving. */
  inProgress?: boolean;
  date: string;      // display date, e.g. 'July 2026'
  dateISO: string;   // for <time> + sorting, e.g. '2026-07'
  title: string;
  dek: string;       // one-line summary — index row + meta description
  read: string;      // estimated read time, e.g. '3 min' — index + article meta
  /** Original site notes do not imply a prior LinkedIn publication. */
  origin?: 'portfolio';
  /** Drafts remain visibly marked while the title and note are being refined. */
  status?: 'draft';
  /** Explicit relationship: current product updates can accompany dated notes. */
  relatedProject?: 'playdraft';
  /** Optional downloadable artifact shown in the note header. */
  artifact?: { label: string; href: string };
}

export const KIND_LABEL: Record<NoteKind, string> = {
  reflection: '[ Reflection ]',
  exploration: '[ Exploration ]',
  practice: '[ Practice ]',
  skill: '[ Agent Skill ]',
  system: '[ System ]',
};

export const NOTES: Note[] = [
  {
    slug: 'playdraft-pick-on-the-clock',
    kind: 'practice',
    origin: 'portfolio',
    status: 'draft',
    relatedProject: 'playdraft',
    date: 'October 23, 2026',
    dateISO: '2026-10-23',
    title: 'The clock drafted what the search box showed',
    dek: 'PlayDraft’s clock used to draft the top row of whatever the search box showed. A prototype of the pick on the clock runs the old rule beside the fix.',
    read: '4 min',
  },
  {
    slug: 'prototyping-wheelrack-fitment',
    kind: 'practice',
    origin: 'portfolio',
    status: 'draft',
    date: 'October 23, 2026',
    dateISO: '2026-10-23',
    title: 'The state WheelRack’s frames could not show',
    dek: 'WheelRack’s hardest state was one sentence in a spec frame. I rebuilt it as a code prototype, with its transitions, timings and reduced-motion version.',
    read: '4 min',
  },
  {
    slug: 'the-line-between-figma-and-the-codebase',
    kind: 'practice',
    origin: 'portfolio',
    status: 'draft',
    date: 'October 19, 2026',
    dateISO: '2026-10-19',
    title: 'The line between Figma and the AEM codebase is getting thinner',
    dek: 'With the MCP connection I now push between code and Figma in both directions, and the governance skill I built rides along.',
    read: '2 min',
  },
  {
    slug: 'steering-into-aem',
    kind: 'practice',
    origin: 'portfolio',
    status: 'draft',
    date: 'October 17, 2026',
    dateISO: '2026-10-17',
    title: 'Steering into AEM instead of away from it',
    dek: 'My strongest case studies sit behind a password, so the page has to show how I think. I gave it an AEM Author view the curious can open.',
    read: '5 min',
  },
  {
    slug: 'shared-language-better-product-decisions',
    relatedProject: 'playdraft',
    read: '4 min',
    kind: 'system',
    date: 'October 2026',
    dateISO: '2026-10-16',
    title: 'Shared language. Better product decisions.',
    dek: 'Shared context → design + code → validation → context for the next change. The board I work from, and the loop that runs through it.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'simplifying-playdraft-without-losing-the-game',
    kind: 'exploration',
    origin: 'portfolio',
    inProgress: true,
    relatedProject: 'playdraft',
    date: 'October 18, 2026',
    dateISO: '2026-10-18',
    title: 'I simplified PlayDraft until it stopped feeling like a game',
    dek: 'I overbuilt PlayDraft, then stripped it until it stopped feeling like a game. Working through the correction with multiple LLMs, then making the decisions visible across nine Paper artboards.',
    read: '6 min',
  },
  {
    slug: 'aem-meeting-authors-where-they-work',
    kind: 'practice',
    origin: 'portfolio',
    status: 'draft',
    date: 'October 7, 2026',
    dateISO: '2026-10-07',
    title: 'AEM is starting to meet authors where they work',
    dek: 'What I plan to test with Claude and AEM, and why I want our production component library to inform the work in Figma.',
    read: '5 min',
  },
  {
    slug: 'the-fundamentals-make-room-for-more',
    kind: 'reflection',
    origin: 'portfolio',
    status: 'draft',
    date: 'October 2026',
    dateISO: '2026-10-04',
    title: 'The fundamentals make room for more',
    dek: 'Sixteen years of design fundamentals, new workflows, and the ideas I now get to try.',
    read: '4 min',
  },
  {
    slug: 'exploring-my-portfolio-in-paper',
    kind: 'exploration',
    origin: 'portfolio',
    date: 'October 3, 2026',
    dateISO: '2026-10-03',
    title: 'Exploring my portfolio in Paper',
    dek: 'What changed when I used Paper to explore the story, then tested those decisions in the working site.',
    read: '3 min',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Adjacent to studying-the-tape, what-id-keep and photoshop-taught-me, all of
  // which touch "the tools changed". Scoped hard to what those do not have: the
  // dated arc from spectator to practitioner, and the day-job pitch. Links out
  // rather than re-arguing.
  {
    slug: 'a-system-to-maintain',
    relatedProject: 'playdraft',
    read: '4 min',
    kind: 'practice',
    date: 'August 2026',
    dateISO: '2026-08-31',
    title: 'I cannot learn a tool from a tutorial. I have to build something I will have to maintain.',
    dek: 'Late 2025 I was using LLMs as a better search box. The path to shipping internal tooling ran through one thing: picking a real product and being stuck with it.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  // Two live client engagements. Deliberately scoped to what is Ryan's to tell:
  // his own contributions and his own reasons. No agency partner, no internal
  // deliberation, no private design critique, no staging URLs, and T1D Hub is
  // marked unlaunched because it is. Promote to a case study once the practice
  // opens and the framing is signed off.
  {
    slug: 'already-the-audience',
    relatedProject: 'playdraft',
    read: '4 min',
    kind: 'exploration',
    inProgress: true,
    date: 'August 2026',
    dateISO: '2026-08-31',
    title: 'The brief came second: two projects where I was already the audience',
    dek: 'A Type 1 diabetes practice and an NFL analyst, both in progress. Each started from something I was already obsessed with, and each ended in a tool, not a file.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'nobody-clapped',
    relatedProject: 'playdraft',
    read: '5 min',
    kind: 'reflection',
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'Build the thing you would still care about if nobody clapped',
    dek: 'Four months inside PlayDraft: what building from an actual obsession costs when the system you want turns out not to be measurable yet.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-id-keep',
    relatedProject: 'playdraft',
    read: '5 min',
    kind: 'reflection',
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'I worried the new tools were taking me away from design. They made me specific about it.',
    dek: 'My work moved from Figma into code and AI at the same time one of my teachers did. Four parts of the craft I would keep if every tool changed tomorrow.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'eight-wrong-first-drafts',
    relatedProject: 'playdraft',
    read: '6 min',
    kind: 'exploration',
    inProgress: true,
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'Eight times my first idea was wrong. What changed was the cost of finding out.',
    dek: 'Eight PlayDraft decisions where the obvious answer lost to a number, from a five-minute simulation to a comment that had been lying for six days.',
    artifact: {
      label: 'Source notes: all eight, with the numbers',
      href: '/artifacts/eight-wrong-first-drafts.html',
    },
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'overscroll-tactics',
    relatedProject: 'playdraft',
    read: '6 min',
    kind: 'exploration',
    inProgress: true,
    date: 'August 2026',
    dateISO: '2026-08-12',
    title: 'I needed an LLC. I ended up naming my design practice.',
    dek: 'Six weeks naming an umbrella for PlayDraft: Playgrove, then Imaginefield, then Overscroll Tactics, including the branch I threw away and went back for.',
    artifact: { label: 'overscrolltactics.com', href: 'https://overscrolltactics.com/' },
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'governance-in-markdown',
    read: '2 min',
    kind: 'system',
    date: 'August 2026',
    dateISO: '2026-08-05',
    title: 'Two files keep the brand from drifting',
    dek: 'PRODUCT.md and DESIGN.md turn my design judgment into a record any agent or teammate builds from, so the site stays consistent when I move fast.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-this-site-works',
    read: '3 min',
    kind: 'system',
    date: 'July 2026',
    dateISO: '2026-07-30',
    title: 'How this site works',
    dek: 'The portfolio is its own case study: tokens, the selection vernacular, prerendering, and where AI actually sits in the process.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'ryan-design-taste-skill',
    relatedProject: 'playdraft',
    read: '4 min',
    kind: 'skill',
    date: 'July 2026',
    dateISO: '2026-07-28',
    title: 'A design-taste system an agent can follow',
    dek: 'My taste, written as an operational skill: modes, dials, anti-defaults, and a pre-flight check any agent (or designer) can run.',
    artifact: { label: 'Read the full skill (Markdown)', href: '/skills/ryan-design-taste.md' },
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'walking-in-with-the-question',
    read: '2 min',
    kind: 'reflection',
    date: 'July 2026',
    dateISO: '2026-07-23',
    title: 'I used to think being a good communicator meant walking in with the answer',
    dek: 'The design conversations that actually moved work forward started with a question I hadn’t resolved yet.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'where-is-my-role-moving',
    relatedProject: 'playdraft',
    read: '3 min',
    kind: 'reflection',
    date: 'July 2026',
    dateISO: '2026-07-21',
    title: 'Where the heck is my role moving forward?',
    dek: 'Six months of asking the same question in public, and the answer I keep landing on: the job is moving toward judgment, not away from craft.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'studying-the-tape',
    read: '2 min',
    kind: 'practice',
    date: 'July 2026',
    dateISO: '2026-07-19',
    title: 'Studying the tape',
    dek: 'I watch football breakdowns the way I watch design interviews: for the decision behind the play.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-doesnt-care-about-your-customers',
    relatedProject: 'playdraft',
    read: '2 min',
    kind: 'practice',
    date: 'July 2026',
    dateISO: '2026-07-15',
    title: 'AI doesn’t care about your customers',
    dek: 'Generation is trained on what already existed. Care for the user, the edge cases, and the consequences is the part that stays human.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'systems-that-make-better-decisions-easier',
    relatedProject: 'playdraft',
    read: '3 min',
    kind: 'practice',
    date: 'July 2026',
    dateISO: '2026-07-13',
    title: 'A good design system makes better decisions easier',
    dek: 'Success isn’t that I can explain the system. It’s that teams decide well without me, which is also the bar AI agents have to clear.',
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'photoshop-taught-me-composition',
    read: '2 min',
    kind: 'reflection',
    date: 'June 2026',
    dateISO: '2026-06-24',
    title: 'Photoshop taught me composition. The tools changed. The eye didn’t.',
    dek: 'Every tool I’ve learned taught me something that outlived it, and that lineage is what I bring to interfaces I now build in code.',
  },
];

// Newest first — ordering lives here, not in array position.
export const NOTES_BY_DATE: Note[] = [...NOTES].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO)
);

export const getNote = (slug: string): Note | undefined =>
  NOTES.find((n) => n.slug === slug);
