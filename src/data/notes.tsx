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
    dateISO: '2026-07-30',
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
          the client-side app.
        </p>
        <Callout marker="Decision">
          Boring architecture, applied carefully, beats a rewrite.
        </Callout>
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
    dateISO: '2026-07-28',
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
        <Callout marker="Position">
          Taste is usually claimed, rarely shown. A skill file is taste in a verifiable form.
        </Callout>
        <p>
          You can read the rules, then look at{' '}
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
    slug: 'where-is-my-role-moving',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-21',
    title: 'Where the heck is my role moving forward?',
    dek: 'Six months of asking the same question in public — and the answer I keep landing on: the job is moving toward judgment, not away from craft.',
    body: (
      <>
        <p>
          I&rsquo;ve been asking one question out loud since spring, in a dozen different ways.
          Design feels more open-ended right now than at any point in my career. &ldquo;Everyone
          is a designer&rdquo; stopped being a punchline. And underneath all of it, the question
          most designers I talk to are actually sitting with: where the heck is my role moving
          forward?
        </p>
        <p>
          Six months ago I wasn&rsquo;t sure where the industry was heading. I&rsquo;m still not
          certain, but the fog has thinned enough to see the shape of it.
        </p>
        <h2>Being first to visualize stopped being the moat</h2>
        <p>
          For most of my career, a designer&rsquo;s leverage was partly speed of visualization —
          being the person who could show the thing before anyone else could describe it. That
          skill hasn&rsquo;t become worthless, but it has become common. Anyone with a prompt can
          get to a plausible screen now.
        </p>
        <p>
          What that shifts is where the value sits. Less on producing the first artifact, more on
          deciding which artifact deserves to exist, what it has to survive in production, and
          what happens at the edges nobody generated.
        </p>
        <Callout marker="The shift">
          The designer&rsquo;s job may become less about being first to visualize and more about
          being right about what should exist.
        </Callout>
        <h2>The through line isn&rsquo;t design</h2>
        <p>
          When I look back at sixteen years — visual design, front-end code, design systems,
          now AI-assisted product work — the constant was never a tool or even a discipline. It
          was refusing to hand off something I didn&rsquo;t understand. Learning the CMS well
          enough to author in it. Learning Sass well enough to ship it. Learning the token
          pipeline well enough to argue with it.
        </p>
        <p>
          That instinct is what makes this moment feel like an opening instead of a threat. The
          same curiosity that pulled me into code is what pulls me into agent workflows now.
        </p>
        <h2>What I&rsquo;m betting on</h2>
        <p>
          My official title has been Senior Web Designer for years. The work stopped fitting the
          label a long time ago: a 200-token design system a React team builds against, an AEM
          component rebuild where I shipped production Sass, two native apps taken from brand to
          TestFlight. Aesthetic execution was in all of it — it&rsquo;s the part I&rsquo;d never
          give up — but it was never the whole job.
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
    slug: 'ai-doesnt-care-about-your-customers',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-15',
    title: 'AI doesn’t care about your customers',
    dek: 'Generation is trained on what already existed. Care — for the user, the edge cases, the consequences — is the part that stays human.',
    body: (
      <>
        <p>
          The most exciting thing I keep finding with LLMs is how fast they close the distance
          between an idea and something you can actually look at. The blank canvas problem is
          mostly solved. That&rsquo;s real, and I use it every day.
        </p>
        <p>
          What they don&rsquo;t do is care. AI doesn&rsquo;t care about your customers. It
          doesn&rsquo;t know which edge case will hurt someone, which shortcut will erode trust,
          or which plausible-looking answer is quietly wrong for this particular product.
        </p>
        <Callout marker="Division of labor">
          AI can answer what could exist. It cannot decide what should exist. Someone still has
          to point it in the right direction.
        </Callout>
        <h2>Where I learned this the hard way</h2>
        <p>
          <Link to="/work/loopstack/">LoopStack</Link> is a Type 1 diabetes pattern-review app I
          built for myself. The models were happy to generate dosing calculators, prediction
          dashboards, and confident recommendations — all plausible, all wrong for this product.
          The defining constraint was what the app must never do: present itself as medical
          advice.
        </p>
        <p>
          No model proposed that constraint. It came from being the user and understanding the
          stakes. Every generated surface got rewritten until observations read as evidence
          rather than instruction, and a 39-test suite now guards the language the app is
          allowed to use. That&rsquo;s care, made operational.
        </p>
        <h2>Care is a practice, not a feeling</h2>
        <p>
          It shows up as the unglamorous work: the empty state nobody asked for, the reduced-motion
          path, the disclosure that says this number is sample data rather than letting you assume
          otherwise. On <Link to="/work/playdraft/">PlayDraft</Link> it looked like a legal-safety
          framework gating every pack, and a remote kill switch so any topic can be pulled without
          shipping a release.
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
    slug: 'photoshop-taught-me-composition',
    kind: 'essay',
    date: 'June 2026',
    dateISO: '2026-06-24',
    title: 'Photoshop taught me composition. The tools changed. The eye didn’t.',
    dek: 'Every tool I’ve learned taught me something that outlived it — and that lineage is what I bring to interfaces I now build in code.',
    body: (
      <>
        <p>
          Photoshop taught me composition. Illustrator taught me construction — that a mark has
          to hold up when you zoom to 4000% and when you shrink it to a favicon. Print taught me
          that you get one shot, so the details had better be right before it goes to press.
        </p>
        <p>
          None of those tools are where I spend my days now. All of those lessons are.
        </p>
        <h2>The same question, in a new medium</h2>
        <p>
          I keep asking myself the same question as I implement new UI: does this actually read?
          Not &ldquo;does it match the mock&rdquo; — does the hierarchy do its job, does the eye
          land where it should, does the thing I care about most look like the thing I care about
          most. That&rsquo;s a composition question. It predates every tool I&rsquo;ve used to
          answer it.
        </p>
        <Callout marker="What carries over">
          Tools expire. The judgment you built using them doesn&rsquo;t.
        </Callout>
        <h2>Making the same mistake twice</h2>
        <p>
          I already made this mistake once — treating a tool&rsquo;s output as the finish line
          instead of the starting point. Early in my career that meant shipping something because
          the file looked right, not because the built page held up. The AI version of that
          mistake is accepting a generated screen because it looks plausible.
        </p>
        <p>
          The correction is the same one it always was: build it, look at it in the real context,
          at the real size, with real content, and be honest about what you see. On this site
          that discipline is written down as{' '}
          <Link to="/notes/ryan-design-taste-skill">a skill my agents load</Link> — an
          anti-defaults list and a pre-flight check that exist specifically to stop plausible
          from passing for finished.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'studying-the-tape',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-19',
    title: 'Studying the tape',
    dek: 'I watch football breakdowns the way I watch design interviews — for the decision behind the play. Here’s how learning in public became a practice.',
    body: (
      <>
        <p>
          I spend a probably unreasonable amount of time listening to football breakdowns.
          Not highlights — film study. The kind where someone freezes the play and explains why
          the safety&rsquo;s two-step read decided the outcome before the throw.
        </p>
        <p>
          I eventually noticed I consume design the same way. Over the past few months I&rsquo;ve
          gone deep on Dive Club interviews, Config talks, and the small circle of design
          engineers publishing their actual working methods. Same instinct: skip the finished
          artifact, find the decision.
        </p>
        <h2>Consumption isn&rsquo;t the practice — extraction is</h2>
        <p>
          Watching a lot of design content is easy and mostly useless on its own. What made it
          useful was forcing every input to produce an output: a habit changed, a workflow tested,
          a rule written down. Some weeks that&rsquo;s six habits I&rsquo;m keeping. Some weeks
          it&rsquo;s one thing I tried and abandoned.
        </p>
        <Callout marker="The practice">
          If watching it doesn&rsquo;t change what you make on Monday, it was entertainment.
        </Callout>
        <h2>Cultural campfires</h2>
        <p>
          Tommy Geoco described the shared things we gather around as cultural campfires, and the
          phrase stuck with me. Design has fewer of them than it used to — the field is too big
          and too fast for everyone to be watching the same thing. So you build a smaller one:
          the handful of people whose work you study closely enough that their standards start
          arguing with yours.
        </p>
        <p>
          Mine assembled almost by accident — systems people, interaction people, a recruiter who
          says the quiet part out loud about what actually gets someone hired. It felt a little
          like an Avengers roster of people who have no idea they&rsquo;re on a team.
        </p>
        <p>
          The most useful thing that came out of it wasn&rsquo;t inspiration. It was a bar. Every
          note on this site, and the system underneath it, got measured against people whose work
          I&rsquo;d be embarrassed to hand something sloppy.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'systems-that-make-better-decisions-easier',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-13',
    title: 'A good design system makes better decisions easier',
    dek: 'Success isn’t that I can explain the system — it’s that teams decide well without me. Which is also the bar AI agents have to clear.',
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
          Adoption starts mattering more than visual polish alone.
        </p>
        <h2>Proof it worked</h2>
        <p>
          <Link to="/work/wheelrack/">WheelRack</Link> made this concrete. The token set and
          component library mattered less than what they enabled: a React developer and I working
          from one vocabulary instead of two, components specced and validated before
          implementation, and — the part I&rsquo;m proudest of — three or four additional
          designers onboarding into the workflow months later without me re-explaining it.
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
          <li>Code-level rules — no hex literals in components, tokens or nothing</li>
          <li>Copywriting standards that keep AI-drafted text in one voice</li>
          <li>Governance prompts and report-only audits that flag drift without touching code</li>
        </ul>
        <p>
          On PlayDraft, the pack registry carries its own decision history in source comments —
          why a color exists, why gold is reserved for winners, the legal posture of every
          third-party topic. The file the components read is also the file that explains itself.
          The same project&rsquo;s content risk runs through a framework written as a skill:
        </p>
        <pre>
          <code>{`name: playdraft-pack-legal-safety
description: Conservative product-risk framework for DraftPacks
  that reference real products, brands, shows, athletes, or
  franchises. Classifies each pack by content class + risk,
  decides monetization/artwork/promotion eligibility, and flags
  anything needing attorney review. Not legal advice — never
  call any third-party strategy "zero legal concern."`}</code>
        </pre>
        <p>
          A curator agent applies it on every content audit. That&rsquo;s the point: the framework
          works whether or not I&rsquo;m the one running it.
        </p>
        <h2>Agents are the ultimate not-in-the-room teammate</h2>
        <p>
          An agent has no context you didn&rsquo;t write down. It never absorbed the hallway
          conversation or the reason behind the exception. Which makes it the sharpest test of
          whether your system is real: if it only works when you personally steer every decision,
          you don&rsquo;t have a system. You have a dependency.
        </p>
        <p>
          Maybe the next evolution of design systems isn&rsquo;t another component library. Maybe
          it&rsquo;s making everything we&rsquo;ve learned portable —{' '}
          <Link to="/design-system">tokens on a live page</Link>,{' '}
          <Link to="/notes/ryan-design-taste-skill">judgment as an installable skill</Link>.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'walking-in-with-the-question',
    kind: 'essay',
    date: 'July 2026',
    dateISO: '2026-07-23',
    title: 'I used to think being a good communicator meant walking in with the answer',
    dek: 'The best design conversations I’ve had started with a question I hadn’t resolved — and the work got better for it.',
    body: (
      <>
        <p>
          I used to think being a good communicator meant walking into the room with the answer.
          Polished rationale, anticipated objections, everything resolved before anyone else saw
          it. It felt like preparation. It was often just armor.
        </p>
        <p>
          The conversations that actually moved work forward went the other way — walking in with
          a sharp question and the two or three directions I was genuinely torn between. People
          engage differently with an open decision than with a defended one.
        </p>
        <Callout marker="What changed">
          Certainty ends the conversation. A good question starts one.
        </Callout>
        <h2>It shows up in how the work gets made</h2>
        <p>
          On <Link to="/work/wheelrack/">WheelRack</Link>, the best outcomes came from bringing
          the developer in before the design was resolved — edge cases surfaced while they were
          still cheap to solve, and the components got specced against what could actually be
          built. That&rsquo;s not a process improvement. That&rsquo;s just being honest earlier.
        </p>
        <p>
          Remote work sharpened this for me. When you&rsquo;re not in the building, communication
          stops being incidental and becomes the medium the work travels through. Being clear
          about what you don&rsquo;t know is more useful, at distance, than performing confidence
          about what you do.
        </p>
        <h2>The fun part is not a distraction</h2>
        <p>
          Some of the best work I&rsquo;ve been part of happened when people were genuinely
          enjoying it. Not the manufactured-culture version — the specific kind of energy where a
          team is curious about the same problem at the same time and nobody&rsquo;s protecting
          their turf. That state produces better decisions than any process I&rsquo;ve run.
        </p>
        <p>
          Walking in with the question, instead of the verdict, is usually how it starts.
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
