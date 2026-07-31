import React from 'react';
import { Link } from 'react-router-dom';

// ============================================
// Notes — the writing stream. Craft is the through-line: essays argue a
// judgment, skill entries publish the actual artifact that encodes it, and
// system entries point at the running proof. Bodies are JSX so entries can
// link into the site (design system, case studies, demos) and reuse the
// site's own vocabulary. Newest first in the NOTES array.
// ============================================

export type NoteKind = 'essay' | 'skill' | 'system';

export interface Note {
  slug: string;
  kind: NoteKind;
  date: string;      // display date, e.g. 'July 2026'
  dateISO: string;   // for <time> + sorting, e.g. '2026-07'
  title: string;
  dek: string;       // one-line summary — index row + meta description
  body: React.ReactNode;
  /** Optional downloadable artifact shown in the note header. */
  artifact?: { label: string; href: string };
}

export const KIND_LABEL: Record<NoteKind, string> = {
  essay: '[ Essay ]',
  skill: '[ Agent Skill ]',
  system: '[ System ]',
};

export const NOTES: Note[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-this-site-works',
    kind: 'system',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'How this site works',
    dek: 'The portfolio is its own case study — tokens, selection vernacular, prerendering, and an AI workflow where judgment stays human.',
    body: (
      <>
        <p>
          This site is the artifact I point to when someone asks how I work. Not the case studies
          on it — the site itself. Every decision on it went through the same loop I use on
          product work: reference first, tokens before components, motion only when it means
          something, and AI in the loop without ever holding the pen at the end.
        </p>
        <h2>One vocabulary, written down</h2>
        <p>
          The foundation is a small token system — a primary orange with light, muted, and dark
          roles, two neutral ramps, an 8-step spacing scale, and a deliberate radius set. All of
          it is documented on a live page, not in a buried Figma file:{' '}
          <Link to="/design-system">the design system</Link> renders every token the site
          actually consumes. If a value isn&rsquo;t on that page, the site doesn&rsquo;t use it.
        </p>
        <h2>The selection vernacular</h2>
        <p>
          The homepage originally had more ambient motion — an orange comet that traced card
          borders, a paintbrush stroke that swept across key phrases. Both were built well and
          both got cut, because motion that exists to be noticed competes with work that exists
          to be read. What replaced them is quieter and says more: cards wear Figma-style
          selection frames with corner handles, and key copy gets selected the way a cursor
          drags across text, then bolded, then released. The interface speaks the language of
          the tools it was made in. If you hover a card on the homepage, orange means exactly
          one thing: selected.
        </p>
        <h2>Crawlable without a framework migration</h2>
        <p>
          The site is a React single-page app, which search engines historically read as an
          empty div. Instead of migrating frameworks, the build renders every route in a real
          browser at deploy time and writes the finished HTML to disk — each case study is a
          crawlable page with its own title, meta, and structured data, while visitors still get
          the client-side app. Boring architecture, applied carefully, beats a rewrite.
        </p>
        <h2>Where AI sits</h2>
        <p>
          Agents audit this site continuously — accessibility passes, copy passes against a
          hiring-manager lens, dead-link sweeps, image consistency checks. They also draft. But
          every visual direction starts from a reference I chose, every finding gets verified
          before it ships, and the judgment layer is written down as{' '}
          <Link to="/notes/ryan-design-taste-skill">an installable skill</Link> so the tools
          inherit my standards instead of their defaults. AI speeds up exploration. I remain
          responsible for the decisions, details, and systems behind what ships.
        </p>
        <p>
          The rest of these notes go deeper on single decisions. This one is the map.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'ryan-design-taste-skill',
    kind: 'skill',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'A design-taste system an agent can follow',
    dek: 'My taste, written as an operational skill — modes, dials, anti-defaults, and a pre-flight check any agent (or designer) can run.',
    artifact: { label: 'Read the full skill (Markdown)', href: '/skills/ryan-design-taste.md' },
    body: (
      <>
        <p>
          The most useful design document I own isn&rsquo;t a component library. It&rsquo;s a
          2,500-line Markdown file that teaches an AI agent how I make decisions — and it works
          on people too.
        </p>
        <p>
          When I started using agents for real design work, the failure mode was never effort.
          It was defaults: purple gradients, glassmorphism, three equal feature cards, motion
          for motion&rsquo;s sake. The fix wasn&rsquo;t better prompting per task. It was
          encoding the judgment once, as a skill the agent loads before any visual work.
        </p>
        <h2>What it encodes</h2>
        <p>
          The skill starts every task with a one-line design read — what the surface is, who
          it&rsquo;s for, which visual mode applies — then sets four dials before anything gets
          drawn:
        </p>
        <pre>
          <code>{`## 2. THE FOUR DIALS

DESIGN_VARIANCE   how far composition may depart from convention
MOTION_INTENSITY  how central motion is to comprehension
VISUAL_DENSITY    how much information is visible at once
SYSTEM_RIGOR      how strongly output maps to tokens + production

| Product context              | Var | Mot | Den | Rigor |
| Enterprise system flow       |  3  |  2  |  7  |  10   |
| Health-data product          |  4  |  3  |  7  |   9   |
| Portfolio homepage           |  7  |  4  |  5  |   7   |
| Live game room               |  6  |  6  |  7  |   9   |`}</code>
        </pre>
        <p>
          Then come the parts that do the real work: per-product visual modes with their own
          tokens and pattern libraries, a global anti-defaults list, and a pre-flight check the
          agent has to pass before delivering. A sample of the rules that earn their keep:
        </p>
        <pre>
          <code>{`- Clarity before novelty. Novelty is rejected when it adds
  ambiguous controls, ornamental layout shifts, or visual noise.
- Evidence belongs near the claim.
- Dense is acceptable; confusing is not.
- Mobile is a product state, not a crop.
- The accent should be scarce enough to mean something.
- Never default to: purple-to-blue SaaS gradients, glassmorphism,
  icons inside decorative circles, pill-shaped everything,
  ambient animated blobs, scroll hijacking.`}</code>
        </pre>
        <h2>Why publish it</h2>
        <p>
          Taste is usually claimed, rarely shown. A skill file is taste in a verifiable form:
          you can read the rules, then look at{' '}
          <Link to="/design-system">the system this site runs on</Link> and the{' '}
          <Link to="/work/playdraft/">products built under it</Link> and check whether the
          output matches the standard. The selection-frame cards and the text-selection
          highlight on the homepage both came out of this loop — an agent proposed directions,
          the skill constrained them, and I made the final call.
        </p>
        <p>
          The full file is linked above. It&rsquo;s written for agents, which turns out to be a
          good discipline for writing systems for humans: every rule states when to use it, when
          not to, and how to verify it.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'the-file-is-not-the-finish-line',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'The file is not the finish line',
    dek: 'Design work should survive beyond a Figma file — systems now live in Markdown, skills, code constraints, and governance prompts.',
    body: (
      <>
        <p>Design work should survive beyond a Figma file.</p>
        <p>
          For most of my career, the design system lived in one place: the component library.
          If you wanted to know how we did things, you opened the file. That worked when the
          only consumers of the system were designers looking at screens.
        </p>
        <p>That&rsquo;s no longer who consumes a design system. Mine now includes:</p>
        <ul>
          <li>Markdown files that document intent, not just anatomy</li>
          <li>Agent skills that encode taste and constraints</li>
          <li>Code-level rules — no hex literals in components, tokens or nothing</li>
          <li>Copywriting standards that keep AI-drafted text in one voice</li>
          <li>Governance prompts and report-only audits that flag drift without touching code</li>
        </ul>
        <p>
          On <Link to="/work/playdraft/">PlayDraft</Link>, the pack registry carries its own
          decision history in source comments — why a color exists, why gold is reserved for
          winners, the legal posture of every third-party topic. The file the components read
          is also the file that explains itself. On this site, the taste layer ships as{' '}
          <Link to="/notes/ryan-design-taste-skill">an installable skill</Link> and the token
          layer as <Link to="/design-system">a live page</Link>.
        </p>
        <p>
          Maybe the next evolution of design systems is not another component library. Maybe it
          is making everything we have learned portable.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'systems-when-im-not-in-the-room',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'Good systems help when I’m not in the room',
    dek: 'A design system succeeds when teams make better decisions without the original designer present.',
    body: (
      <>
        <p>
          A design system is not successful because the original designer can explain it. It is
          successful when teams can make better decisions without that designer present.
        </p>
        <p>
          That&rsquo;s the test I hold my own work to, and it changes what you build. The best
          systems reduce ambiguity after handoff. Documentation stops being an afterthought and
          becomes part of the product. Governance stops being an audit you run later and
          becomes a design problem you solve up front. Adoption starts mattering more than
          visual polish alone.
        </p>
        <p>
          <Link to="/work/wheelrack/">WheelRack</Link> made this concrete. The token set and
          component library mattered less than what they enabled: a React developer and I
          working from one vocabulary instead of two, components specced and validated before
          implementation, and — the part I&rsquo;m proudest of — three or four additional
          designers onboarding into the workflow months later without me re-explaining it.
          The system kept working when I wasn&rsquo;t in the room.
        </p>
        <p>
          The same standard now applies to AI tooling. An agent is the ultimate
          not-in-the-room teammate: it has no context you didn&rsquo;t write down. If your
          system only works when you personally steer every decision, you don&rsquo;t have a
          system yet. You have a dependency.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-could-exist-vs-what-should-exist',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'AI can answer what could exist. It cannot decide what should exist.',
    dek: 'Generation is trained on what already existed — product direction still requires a human to point it somewhere.',
    body: (
      <>
        <p>
          AI is trained on what has already existed. It can generate plausible possibilities
          faster than any team I&rsquo;ve worked on. What it cannot do is independently decide
          what deserves to exist. Someone still has to point it in the right direction.
        </p>
        <p>
          I felt this most sharply on <Link to="/work/loopstack/">LoopStack</Link>, a Type 1
          diabetes pattern-review app I built for myself. The models were happy to generate
          dosing calculators, prediction dashboards, and confident recommendations — all
          plausible, all wrong for the product. The defining decision was what the app must
          never do: present itself as medical advice. Every generated surface got rewritten
          until observations read as evidence, never instruction, and a test suite now guards
          the language the app is allowed to use.
        </p>
        <p>
          No model proposed that constraint. It came from being the user, understanding the
          stakes, and deciding what the product should be — then using AI to explore the space
          inside that boundary faster than I could alone.
        </p>
        <p>
          That&rsquo;s the division of labor I trust: AI widens the field of what could exist.
          Judgment narrows it to what should.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'legal-safety-as-a-design-artifact',
    kind: 'skill',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'Shipping content safely without a lawyer on retainer',
    dek: 'The conservative product-risk framework that gates every third-party topic in PlayDraft — written as a skill, applied on every audit.',
    body: (
      <>
        <p>
          PlayDraft lets friends draft anything — snacks, movies, GOAT athletes. That means
          real brands, real shows, and real people flow through the content pipeline of a solo
          project with no lawyer on retainer. The answer wasn&rsquo;t to avoid the content. It
          was to write the judgment down and gate every pack through it.
        </p>
        <pre>
          <code>{`name: playdraft-pack-legal-safety
description: Conservative product-risk framework for DraftPacks
  that reference real products, brands, shows, athletes, or
  franchises. Classifies each pack by content class + risk,
  decides monetization/artwork/promotion eligibility, and flags
  anything needing attorney review. Not legal advice — never
  call any third-party strategy "zero legal concern."

## Core principle
Names used as neutral identifiers inside a general-purpose
drafting game are materially safer than photos, likenesses,
logos, packaging, uniforms, title treatments, or trade dress.`}</code>
        </pre>
        <p>
          The framework classifies every pack, decides what may be monetized or promoted, and
          escalates anything ambiguous. It renamed one pack, scrubbed trademarked nicknames,
          made the riskiest content free-tier-only, and put a remote kill switch behind every
          pack so any topic can be disabled without an app release. A curator agent applies it
          on every content audit — which is the point. The framework works whether or not
          I&rsquo;m the one running it.
        </p>
        <p>
          The full story, including the App Store decisions it shaped, is in{' '}
          <Link to="/work/playdraft/">the PlayDraft case study</Link>. I treat this file the
          same way I treat a token system: it&rsquo;s design work. It just happens to be made
          of rules instead of rectangles.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'product-designer-vs-web-designer',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07',
    title: 'My title says web designer. The work stopped agreeing years ago.',
    dek: 'The industry is moving away from valuing designers for aesthetic execution alone — and what that means for how I describe my work.',
    body: (
      <>
        <p>
          My official title has been Senior Web Designer for years. The work stopped fitting
          the label a long time ago, and I think that mismatch is worth naming, because it
          isn&rsquo;t unique to me.
        </p>
        <p>
          The industry is moving away from valuing designers only for aesthetic execution.
          The skills that increasingly matter are product judgment, systems thinking,
          direction-setting, cross-functional communication, governance, and implementation
          awareness — knowing what should be built, not just how it should look.
        </p>
        <p>
          Under the web-designer title, the actual work was: a 200-token design system with a
          Storybook pipeline a React team builds against. An AEM component rebuild where I
          shipped production Sass. Two native apps taken from brand to TestFlight. An internal
          tooling layer that removed friction for the teams around me. Aesthetic execution was
          in all of it — it&rsquo;s the part I&rsquo;d never give up — but it was never the
          job. It was the surface of the job.
        </p>
        <p>
          Titles lag reality. Portfolios don&rsquo;t have to. That&rsquo;s why this site leads
          with systems, implementation, and outcomes, and why the title on it now says what
          the work says: product design engineer.
        </p>
      </>
    ),
  },
];

export const getNote = (slug: string): Note | undefined =>
  NOTES.find((n) => n.slug === slug);
