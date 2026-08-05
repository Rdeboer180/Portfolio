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

// Moment frame — the case-study insight-callout vocabulary, carried into
// notes: one marked, quotable judgment per piece.
const Callout: React.FC<{ marker: string; children: React.ReactNode }> = ({ marker, children }) => (
  <aside className="notes__callout">
    <span className="notes__callout-marker">{marker}</span>
    <p className="notes__callout-text">{children}</p>
  </aside>
);

export interface Note {
  slug: string;
  kind: NoteKind;
  date: string;      // display date, e.g. 'July 2026'
  dateISO: string;   // for <time> + sorting, e.g. '2026-07'
  title: string;
  dek: string;       // one-line summary — index row + meta description
  read: string;      // estimated read time, e.g. '3 min' — index + article meta
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
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-this-site-works',
    read: '3 min',
    kind: 'system',
    date: 'July 2026',
    dateISO: '2026-07-30',
    title: 'How this site works',
    dek: 'The portfolio is its own case study: tokens, the selection vernacular, prerendering, and where AI actually sits in the process.',
    body: (
      <>
        <p>
          When someone asks how I work, this site is the thing I point at. Not the case studies
          on it. The site itself. It went through the same loop I use on product work: start from
          a reference, build tokens before components, add motion only when it carries meaning,
          and keep AI out of the final call.
        </p>
        <h2>One vocabulary, written down</h2>
        <p>
          The foundation is a small token system. A primary orange with light, muted, and dark
          roles. Two neutral ramps, an 8-step spacing scale, a radius set I actually stuck to.
          All of it lives on a page you can open right now:{' '}
          <Link to="/design-system">the design system</Link> renders every token the site
          consumes. If a value isn&rsquo;t on that page, the site doesn&rsquo;t use it. That rule
          has caught me more than once.
        </p>
        <h2>The selection vernacular</h2>
        <p>
          The homepage went on a motion diet. An orange comet used to run around every card
          border, ambient and always on. A paintbrush stroke swept across key phrases before they
          bolded. The always-on versions got cut, because motion that exists to be noticed competes
          with work that exists to be read.
        </p>
        <p>
          What came back is quieter and says more. Cards wear Figma-style selection frames, key
          copy gets selected the way a cursor drags across text before it bolds, and the comet
          earned its way back &mdash; but only as a single pass. It traces a card&rsquo;s border
          once as the card scrolls into view, staggered down the grid, then settles to a hairline.
          The interface speaks the language of the tools it was made in, and orange means one
          thing: selected.
        </p>
        <h2>Crawlable without a framework migration</h2>
        <p>
          This is a React single-page app, which search engines have historically read as an
          empty div. The obvious fix was migrating frameworks. I didn&rsquo;t want to spend the
          month. Instead the build opens every route in a real browser at deploy time and writes
          the finished HTML to disk, so each case study is a crawlable page with its own title,
          meta, and structured data while visitors still get the client-side app.
        </p>
        <Callout marker="Decision">
          Boring architecture, applied carefully, beats a rewrite.
        </Callout>
        <h2>Where AI sits</h2>
        <p>
          Agents audit this site constantly. Accessibility passes, copy passes against a
          hiring-manager lens, dead-link sweeps, image consistency checks. They draft, too. But
          every visual direction starts from a reference I picked, every finding gets verified
          before it ships, and the judgment layer is written down as{' '}
          <Link to="/notes/ryan-design-taste-skill">an installable skill</Link> so the tools
          inherit my standards instead of their defaults.
        </p>
        <p>
          AI speeds up exploration. I stay responsible for the decisions, the details, and the
          systems behind what ships. The rest of these notes go deeper on single decisions. This
          one is the map.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'ryan-design-taste-skill',
    read: '4 min',
    kind: 'skill',
    date: 'July 2026',
    dateISO: '2026-07-28',
    title: 'A design-taste system an agent can follow',
    dek: 'My taste, written as an operational skill: modes, dials, anti-defaults, and a pre-flight check any agent (or designer) can run.',
    artifact: { label: 'Read the full skill (Markdown)', href: '/skills/ryan-design-taste.md' },
    body: (
      <>
        <p>
          The most useful design document I own isn&rsquo;t a component library. It&rsquo;s a
          2,500-line Markdown file that teaches an AI agent how I make decisions. It works on
          people too, which I did not expect.
        </p>
        <p>
          When I started using agents for real design work, the failure was never effort. It was
          defaults. Purple gradients. Glassmorphism. Three equal feature cards. Motion because
          motion is available. Better prompting per task didn&rsquo;t fix it. Writing the
          judgment down once, as a skill the agent loads before any visual work, did.
        </p>
        <h2>What it encodes</h2>
        <p>
          Every task starts with a one-line design read: what the surface is, who it&rsquo;s for,
          which visual mode applies. Then four dials get set before anything is drawn.
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
          After that come the parts that do the real work: per-product visual modes with their
          own tokens and patterns, a global anti-defaults list, and a pre-flight check the agent
          has to pass before delivering anything. A sample of the rules that earn their keep:
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
        <Callout marker="Position">
          Taste is usually claimed, rarely shown. A skill file is taste in a verifiable form.
        </Callout>
        <p>
          You can read the rules, then look at{' '}
          <Link to="/design-system">the system this site runs on</Link> and the{' '}
          <Link to="/work/playdraft/">products built under it</Link>, and decide for yourself
          whether the output matches the standard. The selection-frame cards and the
          text-selection highlight both came out of this loop. An agent proposed directions, the
          skill constrained them, I made the call.
        </p>
        <p>
          The full file is linked above. It&rsquo;s written for agents, which turns out to be
          good discipline for writing systems for humans. Every rule has to say when to use it,
          when not to, and how to check whether it worked.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'walking-in-with-the-question',
    read: '2 min',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-23',
    title: 'I used to think being a good communicator meant walking in with the answer',
    dek: 'The design conversations that actually moved work forward started with a question I hadn’t resolved yet.',
    body: (
      <>
        <p>
          I used to think being a good communicator meant walking into the room with the answer.
          Polished rationale, objections anticipated, everything resolved before anyone else saw
          it. It felt like preparation. Most of the time it was armor.
        </p>
        <p>
          The conversations that actually moved work forward went the other way. I&rsquo;d walk
          in with a sharp question and the two directions I was genuinely torn between. People
          engage differently with an open decision than with a defended one. They tell you things
          they were going to keep to themselves.
        </p>
        <Callout marker="What changed">
          Certainty ends the conversation. A good question starts one.
        </Callout>
        <h2>It shows up in how the work gets made</h2>
        <p>
          On <Link to="/work/wheelrack/">WheelRack</Link>, the best outcomes came from bringing
          the developer in before the design was resolved. Edge cases surfaced while they were
          still cheap to solve. Components got specced against what could actually be built
          rather than what looked good in a frame. That isn&rsquo;t a process improvement so much
          as being honest earlier.
        </p>
        <p>
          Remote work sharpened this. When you&rsquo;re not in the building, communication stops
          being incidental and becomes the medium the work travels through. At distance, being
          clear about what you don&rsquo;t know is worth more than performing confidence about
          what you do.
        </p>
        <h2>The fun part is not a distraction</h2>
        <p>
          Some of the best work I&rsquo;ve been part of happened when people were enjoying
          themselves. Not the manufactured-culture version. The specific kind of energy where a
          team is curious about the same problem at the same time and nobody is protecting their
          turf. I&rsquo;ve never found a process that reliably produces it, but I know what
          usually starts it: walking in with the question instead of the verdict.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'where-is-my-role-moving',
    read: '3 min',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-21',
    title: 'Where the heck is my role moving forward?',
    dek: 'Six months of asking the same question in public, and the answer I keep landing on: the job is moving toward judgment, not away from craft.',
    body: (
      <>
        <p>
          I&rsquo;ve been asking one question out loud since spring, in about a dozen different
          ways. Design feels more open-ended right now than at any point in my career.
          &ldquo;Everyone is a designer&rdquo; stopped being a punchline. Underneath all of it
          sits the question most designers I talk to are actually sitting with: where the heck is
          my role moving forward?
        </p>
        <p>
          Six months ago I had no idea. I&rsquo;m still not certain, but the fog has thinned
          enough to see a shape.
        </p>
        <h2>Being first to visualize stopped being the moat</h2>
        <p>
          For most of my career, part of a designer&rsquo;s leverage was speed of visualization.
          Being the person who could show the thing before anyone else could describe it. That
          skill hasn&rsquo;t become worthless. It has become common. Anyone with a prompt can get
          to a plausible screen now.
        </p>
        <p>
          So the value moves. Less on producing the first artifact, more on deciding which
          artifact deserves to exist, what it has to survive in production, and what happens at
          the edges nobody bothered to generate.
        </p>
        <Callout marker="The shift">
          The designer&rsquo;s job may become less about being first to visualize and more about
          being right about what should exist.
        </Callout>
        <h2>The through line isn&rsquo;t design</h2>
        <p>
          Looking back at sixteen years of visual design, front-end code, design systems, and now
          AI-assisted product work, the constant was never a tool or even a discipline. It was
          refusing to hand off something I didn&rsquo;t understand. Learning the CMS well enough
          to author in it. Learning Sass well enough to ship it. Learning the token pipeline well
          enough to argue with it.
        </p>
        <p>
          That instinct is why this moment reads as an opening to me rather than a threat. The
          same curiosity that pulled me into code is pulling me into agent workflows now.
        </p>
        <h2>What I&rsquo;m betting on</h2>
        <p>
          My official title has been Senior Web Designer for years. The work stopped fitting the
          label a long time ago. A 200-token design system a React team builds against. An AEM
          component rebuild where I shipped production Sass. Two native apps taken from brand to
          TestFlight. Aesthetic execution ran through all of it, and it&rsquo;s the part
          I&rsquo;d never give up, but it was never the whole job.
        </p>
        <p>
          Titles lag reality. Portfolios don&rsquo;t have to. That&rsquo;s why this site leads
          with systems, implementation, and outcomes, and why the title on it now says what the
          work says: product design engineer.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'studying-the-tape',
    read: '2 min',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-19',
    title: 'Studying the tape',
    dek: 'I watch football breakdowns the way I watch design interviews: for the decision behind the play.',
    body: (
      <>
        <p>
          I spend a probably unreasonable amount of time listening to football breakdowns. Not
          highlights. Film study. The kind where someone freezes the play and explains why the
          safety&rsquo;s two-step read decided the outcome before the ball was thrown.
        </p>
        <p>
          It took me embarrassingly long to notice I consume design the same way. Over the past
          few months I went deep on Dive Club interviews, Config talks, and the small circle of
          design engineers who publish their actual working methods. Same instinct: skip past the
          finished artifact, find the decision.
        </p>
        <h2>Consumption isn&rsquo;t the practice</h2>
        <p>
          Watching a lot of design content is easy and mostly useless on its own. What made it
          useful was forcing every input to produce an output. A habit changed, a workflow
          tested, a rule written down. Some weeks that&rsquo;s six habits I&rsquo;m keeping. Some
          weeks it&rsquo;s one thing I tried and abandoned by Thursday.
        </p>
        <Callout marker="The practice">
          If watching it doesn&rsquo;t change what you make on Monday, it was entertainment.
        </Callout>
        <h2>Cultural campfires</h2>
        <p>
          Tommy Geoco described the shared things we gather around as cultural campfires, and the
          phrase stuck with me. Design has fewer of them than it used to. The field is too big
          and moving too fast for everyone to be watching the same thing. So you build a smaller
          one: the handful of people whose work you study closely enough that their standards
          start arguing with yours.
        </p>
        <p>
          Mine assembled mostly by accident. Systems people, interaction people, a recruiter who
          says the quiet part out loud about what actually gets someone hired. At some point I
          realized it felt like an Avengers roster of people who have no idea they&rsquo;re on a
          team.
        </p>
        <p>
          The useful thing that came out of it wasn&rsquo;t inspiration. It was a bar. Every note
          on this site, and the system underneath it, got measured against people I&rsquo;d be
          embarrassed to hand something sloppy.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-doesnt-care-about-your-customers',
    read: '2 min',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-15',
    title: 'AI doesn’t care about your customers',
    dek: 'Generation is trained on what already existed. Care for the user, the edge cases, and the consequences is the part that stays human.',
    body: (
      <>
        <p>
          The most exciting thing I keep finding with LLMs is how fast they close the distance
          between an idea and something you can actually look at. The blank canvas problem is
          mostly solved. That&rsquo;s real, and I use it every day.
        </p>
        <p>
          What they don&rsquo;t do is care. AI doesn&rsquo;t care about your customers. It has no
          idea which edge case will hurt someone, which shortcut erodes trust, or which
          plausible-looking answer is quietly wrong for this particular product.
        </p>
        <Callout marker="Division of labor">
          AI can answer what could exist. It cannot decide what should exist. Someone still has
          to point it in the right direction.
        </Callout>
        <h2>Where I learned this the hard way</h2>
        <p>
          <Link to="/work/loopstack/">LoopStack</Link> is a Type 1 diabetes pattern-review app I
          built for myself. The models were happy to generate dosing calculators, prediction
          dashboards, and confident recommendations. All plausible. All wrong for this product.
          The constraint that defined the whole thing was what the app must never do: present
          itself as medical advice.
        </p>
        <p>
          No model proposed that. It came from being the user and understanding the stakes. Every
          generated surface got rewritten until observations read as evidence rather than
          instruction, and a 39-test suite now guards the language the app is allowed to use.
          Care, made operational.
        </p>
        <h2>Care is a practice, not a feeling</h2>
        <p>
          It shows up as the unglamorous work. The empty state nobody asked for. The
          reduced-motion path. The disclosure that says this number is sample data instead of
          letting you assume otherwise. On <Link to="/work/playdraft/">PlayDraft</Link> it looked
          like a legal-safety framework gating every pack, and a remote kill switch so any topic
          can be pulled without shipping a release.
        </p>
        <p>
          None of that came from a prompt. All of it came from asking who gets hurt if
          I&rsquo;m wrong.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'systems-that-make-better-decisions-easier',
    read: '3 min',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-13',
    title: 'A good design system makes better decisions easier',
    dek: 'Success isn’t that I can explain the system. It’s that teams decide well without me, which is also the bar AI agents have to clear.',
    body: (
      <>
        <p>
          A design system is not successful because the original designer can explain it.
        </p>
        <Callout marker="The test">
          It&rsquo;s successful when teams make better decisions without that designer in the
          room.
        </Callout>
        <p>
          That test changes what you build. The best systems reduce ambiguity after handoff.
          Documentation stops being an afterthought and becomes part of the product. Governance
          stops being an audit you run later and becomes a design problem you solve up front.
          Adoption starts mattering more than visual polish.
        </p>
        <h2>Proof it worked</h2>
        <p>
          <Link to="/work/wheelrack/">WheelRack</Link> made this concrete. The token set and
          component library mattered less than what they enabled. A React developer and I worked
          from one vocabulary instead of two. Components got specced and validated before
          implementation. Months later, three or four additional designers onboarded into that
          workflow without me re-explaining it, which is the part I&rsquo;m proudest of.
        </p>
        <h2>The file is not the finish line</h2>
        <p>
          For most of my career the system lived in one place: the component library. That worked
          when the only consumers were designers looking at screens. That&rsquo;s no longer who
          consumes a design system. Mine now includes:
        </p>
        <ul>
          <li>Markdown that documents intent, not just anatomy</li>
          <li>Agent skills that encode taste and constraints</li>
          <li>Code-level rules, like no hex literals in components</li>
          <li>Copywriting standards that keep AI-drafted text in one voice</li>
          <li>Report-only audits that flag drift without touching code</li>
        </ul>
        <p>
          On PlayDraft, the pack registry carries its own decision history in source comments.
          Why a color exists. Why gold stays reserved for winners. The legal posture of every
          third-party topic. The file the components read is also the file that explains itself.
          That project&rsquo;s content risk runs through a framework written as a skill:
        </p>
        <pre>
          <code>{`name: playdraft-pack-legal-safety
description: Conservative product-risk framework for DraftPacks
  that reference real products, brands, shows, athletes, or
  franchises. Classifies each pack by content class + risk,
  decides monetization/artwork/promotion eligibility, and flags
  anything needing attorney review. Not legal advice. Never
  call any third-party strategy "zero legal concern."`}</code>
        </pre>
        <p>
          A curator agent applies it on every content audit. That&rsquo;s the point. The framework
          works whether or not I&rsquo;m the one running it.
        </p>
        <h2>Agents are the ultimate not-in-the-room teammate</h2>
        <p>
          An agent has no context you didn&rsquo;t write down. It never absorbed the hallway
          conversation or the reason behind the exception. Which makes it a blunt test of whether
          your system is real. If it only works when you personally steer every decision, you
          don&rsquo;t have a system. You have a dependency.
        </p>
        <p>
          Maybe the next evolution of design systems isn&rsquo;t another component library. Maybe
          it&rsquo;s making everything we&rsquo;ve learned portable:{' '}
          <Link to="/design-system">tokens on a live page</Link>,{' '}
          <Link to="/notes/ryan-design-taste-skill">judgment as an installable skill</Link>.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'photoshop-taught-me-composition',
    read: '2 min',
    kind: 'essay',
    date: 'June 2026',
    dateISO: '2026-06-24',
    title: 'Photoshop taught me composition. The tools changed. The eye didn’t.',
    dek: 'Every tool I’ve learned taught me something that outlived it, and that lineage is what I bring to interfaces I now build in code.',
    body: (
      <>
        <p>
          Photoshop taught me composition. Illustrator taught me construction, which is really
          the discipline of making a mark hold up at 4000% and at favicon size. Print taught me
          that you get one shot, so the details had better be right before it goes to press.
        </p>
        <p>
          None of those tools are where I spend my days now. All of those lessons are.
        </p>
        <h2>The same question, in a new medium</h2>
        <p>
          I keep asking myself one question as I implement new UI: does this actually read? Not
          whether it matches the mock. Whether the hierarchy does its job, whether the eye lands
          where it should, whether the thing I care about most looks like the thing I care about
          most. That&rsquo;s a composition question, and it predates every tool I&rsquo;ve used
          to answer it.
        </p>
        <Callout marker="What carries over">
          Tools expire. The judgment you built using them doesn&rsquo;t.
        </Callout>
        <h2>Making the same mistake twice</h2>
        <p>
          I already made this mistake once. Early in my career it meant shipping something
          because the file looked right, not because the built page held up. Treating the
          tool&rsquo;s output as the finish line instead of the starting point.
        </p>
        <p>
          The AI version of that mistake is accepting a generated screen because it looks
          plausible. The correction is the same one it always was. Build it, look at it in the
          real context at the real size with real content, and be honest about what you see. On
          this site that discipline is written down as{' '}
          <Link to="/notes/ryan-design-taste-skill">a skill my agents load</Link>, with an
          anti-defaults list and a pre-flight check that exist specifically to stop plausible
          from passing for finished.
        </p>
      </>
    ),
  },
];

// Newest first — ordering lives here, not in array position.
export const NOTES_BY_DATE: Note[] = [...NOTES].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO)
);

export const getNote = (slug: string): Note | undefined =>
  NOTES.find((n) => n.slug === slug);
