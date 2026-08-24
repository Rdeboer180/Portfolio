import React from 'react';
import { Link } from 'react-router-dom';
import LinkedInLink from '../components/LinkedInLink';

// ============================================
// Notes — the writing stream. Craft is the through-line: essays argue a
// judgment, skill entries publish the actual artifact that encodes it, and
// system entries point at the running proof. Bodies are JSX so entries can
// link into the site (design system, case studies, demos) and reuse the
// site's own vocabulary. Newest first in the NOTES array.
// ============================================

export type NoteKind = 'essay' | 'log' | 'skill' | 'system';

// Moment frame — the case-study insight-callout vocabulary, carried into
// notes: one marked, quotable judgment per piece.
const Callout: React.FC<{ marker: string; children: React.ReactNode }> = ({ marker, children }) => (
  <aside className="notes__callout">
    <span className="notes__callout-marker">{marker}</span>
    <p className="notes__callout-text">{children}</p>
  </aside>
);

// Naming graveyard — the exploration tree, left visible. Each branch is a
// theme that produced names; the verdict is why it died. Dead names are <s>,
// so the state survives without color. Only the surviving branch is orange.
const Branch: React.FC<{
  theme: string;
  names: string[];
  verdict: string;
  kept?: boolean;
}> = ({ theme, names, verdict, kept }) => (
  <li className={`notes__branch${kept ? ' notes__branch--kept' : ''}`}>
    <span className="notes__branch-theme">{theme}</span>
    <ul className="notes__branch-names">
      {names.map((name) => (
        <li key={name} className="notes__branch-name">
          {kept ? name : <s>{name}</s>}
        </li>
      ))}
    </ul>
    <p className="notes__branch-verdict">{verdict}</p>
  </li>
);

const Graveyard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="notes__graveyard">{children}</ul>
);

// Turn frame — two readings of the same problem side by side. Used once, at
// the point where the naming criteria changed.
const Turn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="notes__turn">{children}</div>
);

const TurnSide: React.FC<{
  label: string;
  question: string;
  kept?: boolean;
  children: React.ReactNode;
}> = ({ label, question, kept, children }) => (
  <div className={`notes__turn-side${kept ? ' notes__turn-side--kept' : ''}`}>
    <span className="notes__turn-label">{label}</span>
    <p className="notes__turn-q">{question}</p>
    <p className="notes__turn-body">{children}</p>
  </div>
);

// Term split — dictionary-entry treatment for a two-part name. The summation
// line is deliberately quieter than a Callout; a piece only gets one of those.
const Split: React.FC<{ sum: string; children: React.ReactNode }> = ({ sum, children }) => (
  <div className="notes__split">
    {children}
    <p className="notes__split-sum">
      <span className="notes__split-sum-marker" aria-hidden="true">=</span>
      <span>{sum}</span>
    </p>
  </div>
);

const Term: React.FC<{ word: string; gloss: string; children: React.ReactNode }> = ({
  word,
  gloss,
  children,
}) => (
  <div className="notes__term">
    <span className="notes__term-head">
      <span className="notes__term-word">{word}</span>
      <span className="notes__term-gloss">{gloss}</span>
    </span>
    <p className="notes__term-def">{children}</p>
  </div>
);

// Umbrella — parent identity over the products it attributes. Shares the
// graveyard's rail geometry on purpose: same relationship, drawn the same way.
// The open slot renders as a hollow node, an honest empty state rather than a
// tidier list of two.
const Umbrella: React.FC<{ parent: string; children: React.ReactNode }> = ({
  parent,
  children,
}) => (
  <div className="notes__umbrella">
    <p className="notes__umbrella-head">
      <span className="notes__umbrella-parent">{parent}</span>
      <span className="notes__umbrella-kind">[ Parent ]</span>
    </p>
    <ul className="notes__stack">{children}</ul>
  </div>
);

const StackItem: React.FC<{
  name: React.ReactNode;
  status: string;
  open?: boolean;
  children: React.ReactNode;
}> = ({ name, status, open, children }) => (
  <li className={`notes__stack-item${open ? ' notes__stack-item--open' : ''}`}>
    <span className="notes__stack-name">{name}</span>
    <span className="notes__stack-status">{status}</span>
    <p className="notes__stack-desc">{children}</p>
  </li>
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
  log: '[ Build Log ]',
  skill: '[ Agent Skill ]',
  system: '[ System ]',
};

export const NOTES: Note[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'nobody-clapped',
    read: '5 min',
    kind: 'essay',
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'Build the thing you would still care about if nobody clapped',
    dek: 'Four months inside PlayDraft: what happens when you build from an actual obsession instead of for an audience, and what it costs when the system you wanted turns out not to be measurable yet.',
    body: (
      <>
        <p>
          I love fantasy football. Not the games so much as everything around them: rankings, ADP
          movement, roster construction, the group chat arguing about a late round pick, and the
          specific feeling of having seen value before the rest of the room did.
        </p>
        <p>
          For about four months I have been trying to find out whether that feeling can exist
          outside of football. Could drafting be a social game about anything? Could friends draft
          pizza toppings, movie characters, snacks or superpowers and still get the ownership, the
          debate, the sense that their taste was on the line? Could it stay casual enough to play
          on a couch while the systems underneath actually held up?
        </p>
        <p>
          That became <Link to="/work/playdraft/">PlayDraft</Link>. At its simplest it may end up
          being a small game I play with my friends. As a design project it has turned into the
          most complete thing I have made: product strategy, visual design, systems, front end
          logic, game mechanics, scoring models, AI assisted iteration, and a long run of moments
          where my first idea lost to evidence.
        </p>

        <h2>The rabbit hole was the math</h2>
        <p>
          The clearest of those was a scoring rule I wanted badly. It was built to reward the gem
          finder, the player who reaches before consensus catches up, and it was exactly the kind
          of mechanic I thought the game should have. Then I ran 400 simulated drafts against it.
          It rewarded the safe pick 99 to 100 percent of the time, which is the precise inverse of
          its purpose. The obvious repair traded one problem for another: it handed the win to
          whoever drafted last, so a skill mechanic had quietly become a seat lottery.
        </p>
        <p>
          The lesson was not that my formula was miscalibrated. It was that the thing I wanted to
          reward is not measurable yet. With a static popularity list and no outcome data, &ldquo;did
          you find a gem&rdquo; has no evidence behind it, and you cannot detect a gem without
          proof that it was one. So I did not kill the idea. I deferred it to the unlock it
          actually needs, which is population data I am already collecting. That was one of{' '}
          <Link to="/notes/eight-wrong-first-drafts/">eight decisions I wrote up where the first
          idea lost to a number</Link>, sorted by how late each one surfaced.
        </p>
        <Callout marker="The rhythm">
          Build the thing I want to be true. Test whether the product can actually support it.
          Decide whether to ship it, simplify it, or shelve it until the system is ready.
        </Callout>

        <h2>The craft moved under the frame</h2>
        <p>
          The game is not the only place this happens. Over the same stretch of months I was cutting a studio mark
          out of a finished board of falling blocks for{' '}
          <Link to="/work/overscroll-tactics/">Overscroll Tactics</Link>, and the interesting
          questions there were underneath the frame too: whether the pieces obeyed real rules
          rather than decorative ones, whether the offcuts matched the cut exactly, whether the
          whole thing survived being ported to a second runtime without the geometry drifting.
        </p>
        <p>
          Design craft used to stop at the polished frame. Most of mine now lives below it, in the
          prompt, the component, the rule, the query, the simulation, the edge case, the code
          comment that turns out to be lying, and the thing I almost shipped before a number proved
          me wrong. That is the work I want more of: the overlap between product design, systems
          thinking, front end execution, and AI assisted workflows.
        </p>

        <h2>The part that has been harder than I expected</h2>
        <p>
          The hard part has not been the math. It is explainability. The interface has to feel fun, the scoring has to feel
          fair, the packs have to stay replayable, the room flow has to be obvious, and the winner
          has to feel earned. All of that is achievable. The one I keep failing is the last one:
          when the system makes a call, the player has to understand why.
        </p>
        <p>
          I shelved a finished bonus mechanic over exactly that. On its verification run it flipped
          second and third, which was the intent, and the test passed. I could not explain the
          result to the player who lost. A surprise you cannot explain afterwards is
          indistinguishable from a bug, so it went on the shelf. I still do not know whether that
          was judgment or nerves.
        </p>

        <h2>Why I keep going</h2>
        <p>
          None of this is finished and it is not a case study wrapped in a bow. It is a real
          artifact of someone trying to move from taste to system, system to prototype, prototype
          to evidence, and evidence back into better product judgment. I have written elsewhere
          about <Link to="/notes/what-id-keep/">which parts of the craft I would keep if every tool
          changed tomorrow</Link>. This is the other half of that answer: what I would build if
          nobody were watching.
        </p>
        <p>
          There is something worth defending in building from a genuine obsession rather than
          chasing a trend, polishing a fake app for a portfolio, or performing craft from a safe
          distance. The thing you would still care about if nobody clapped is also the thing that
          teaches you, because you want it to be better and you will argue with your own
          assumptions until it gets more honest.
        </p>
        <p>
          PlayDraft might stay a game I play with my friends. It might become the clearest signal
          in my portfolio of how I think across design, systems, code and iteration. Either way I
          would still be working on it, which is the only test I trust now: what would I build if I
          knew I was going to love it, even if no one else did?
        </p>
        <p className="notes__source">
          <LinkedInLink label="A shorter version of this started as a post" surface="note_source" />
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-id-keep',
    read: '5 min',
    kind: 'essay',
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'I worried the new tools were taking me away from design. They made me specific about it.',
    dek: 'Watching one of my Figma teachers turn toward AI and building, at the same time my own work did. Four parts of the craft I would keep if every tool changed tomorrow — and the work where each one is still happening.',
    body: (
      <>
        <p>
          Michael W. &mdash; Mizko &mdash; is one of the people who taught me how to think in
          Figma. Not shortcuts: how to structure a file, how to build a system, how to turn a
          visual decision into a rule other people could follow. Then he went quiet on YouTube for
          more than a year. When he came back, most of his attention had moved toward AI and
          building things.
        </p>
        <p>
          That caught me because my own week had drifted the same way at roughly the same time,
          without either of us telling the other. Figma is still in my process &mdash; I still care
          about the artboards, the component logic, the small decisions that make a product feel
          considered. It just isn&rsquo;t where all of the work lives anymore. More of my week now
          happens in Claude, in code, in Markdown files, in plugins and tests and products that
          actually run.
        </p>
        <p>
          For a while I read that as drift. If the file stopped being the deliverable, was I still
          doing the thing I signed up for?
        </p>
        <Callout marker="The turn">
          The shift didn&rsquo;t move me away from the parts of design I love. It forced me to say
          exactly which parts those were.
        </Callout>

        <h2>Four things I&rsquo;d keep if every tool changed tomorrow</h2>
        <p>
          I wrote these down as a gut list, then went looking for whether the work backed them up.
          It does, which is the only reason I trust the list.
        </p>
        <Split sum="none of these name a tool">
          <Term word="Building systems" gloss="the rule, not the screen">
            The part I&rsquo;d protect first. A 20-year-old dealer platform with no system behind
            it became{' '}
            <Link to="/work/wheelrack/">one built from scratch</Link>, and the argument that
            settled it was about tokens, not layouts.
          </Term>
          <Term word="The visual details" gloss="down to favicon size">
            Construction, really &mdash;{' '}
            <Link to="/work/overscroll-tactics/">making a mark hold up at 4000% and at 16px</Link>.
            The rules that keep a mark intact are the same discipline as the rules that keep an
            interface intact.
          </Term>
          <Term word="The rule that solves ten screens" gloss="instead of decorating one">
            I designed 50+ landing pages by hand before building{' '}
            <Link to="/work/landing-pages/">the governed template system two junior designers use
            now</Link>. The pages were the work; the system was the point.
          </Term>
          <Term word="Staying until it survives" gloss="past the point the screens look finished">
            The one that changed most. Stopping at a polished file used to be allowed. Now an idea
            isn&rsquo;t finished until{' '}
            <Link to="/work/playdraft/">it runs on a phone</Link> and I&rsquo;ve watched it fail
            against something real.
          </Term>
        </Split>

        <h2>What the tools actually changed</h2>
        <p>
          Not the judgment. The distance between deciding something and finding out whether the
          decision was any good. That gap used to be weeks and a handoff; now it is often an
          afternoon. Which sounds purely good, and mostly is, except that a shorter loop punishes
          a confident guess faster than it rewards one &mdash; something I&rsquo;ve now{' '}
          <Link to="/notes/eight-wrong-first-drafts/">written down eight times over</Link>.
        </p>
        <p>
          The honest part I keep circling: writing a throwaway simulation, a plugin, a governance
          file is fast now, and that speed is the reason I test ideas instead of arguing about
          them. What the tooling cannot do is distrust its own output. Deciding to go looking for
          the number that could prove me wrong is still mine, and it is most of the job.
        </p>

        <h2>The cost nobody warns you about</h2>
        <p>
          This work is harder to show. A Figma file is a portfolio piece &mdash; you open it and
          the craft is right there. A Markdown file that keeps a brand from drifting, an{' '}
          <Link to="/work/design-enablement/">internal plugin that removes a repetitive step</Link>,
          a test that catches a bug before a user does: all real, all close to invisible. Half of
          my strongest work now lives inside systems I can describe but can&rsquo;t open, which is
          why the independent products exist at all. That is a genuine trade, not a humblebrag.
        </p>

        <h2>Not a prescription</h2>
        <p>
          Watching someone who taught me one chapter of this career turn the same corner
          independently was reassuring, and reassurance is all it was. It doesn&rsquo;t mean every
          designer should follow the same path or chase every release. I&rsquo;ve{' '}
          <Link to="/notes/where-is-my-role-moving/">asked in public where the role is going</Link>{' '}
          for months without landing anywhere final, and I&rsquo;ve argued before that{' '}
          <Link to="/notes/photoshop-taught-me-composition/">tools expire while the judgment
          you built with them doesn&rsquo;t</Link>. This is the same argument, made specific: not
          which tools to keep, but which four things you&rsquo;d want to still be doing if all of
          them were gone by Monday.
        </p>
        <p>
          I don&rsquo;t think my four are anyone else&rsquo;s four. I do think naming them is
          worth an afternoon, because you can&rsquo;t protect a part of the craft you&rsquo;ve
          never said out loud. So: which part of design would you keep doing even if the tools
          changed completely?
        </p>
        <p className="notes__source">
          <LinkedInLink label="This started as a post — the conversation is there" surface="note_source" />
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'eight-wrong-first-drafts',
    read: '6 min',
    kind: 'log',
    date: 'August 2026',
    dateISO: '2026-08-24',
    title: 'Eight times my first idea was wrong. What changed was the cost of finding out.',
    dek: 'Eight PlayDraft decisions where the obvious answer lost to a number — ordered by how late each one was caught, from a simulation that ran in minutes to a comment that had been lying for six days.',
    artifact: {
      label: 'Source notes — all eight, with the numbers',
      href: '/artifacts/eight-wrong-first-drafts.html',
    },
    body: (
      <>
        <p>
          I keep a running file of decisions that went the wrong way first. Not bugs exactly &mdash;
          decisions: the moment where I had a clear, confident answer and something measurable
          disagreed with it. Eight of them came out of <Link to="/work/playdraft">PlayDraft</Link> in
          one stretch of build work. Six were caught before a player ever saw them. Two were not.
        </p>
        <p>
          What interests me now isn&rsquo;t that the first idea was wrong &mdash; that&rsquo;s
          ordinary. It&rsquo;s that the eight sort cleanly by <em>how</em> I found out, and that
          ordering turns out to be a cost ladder. The cheapest catches took minutes. The most
          expensive one had been sitting in the codebase for six days wearing a comment that said
          it was fixed.
        </p>

        <h2>The one that rewarded exactly what it punished</h2>
        <p>
          The clearest example first, because it&rsquo;s the one where the gap between the idea and
          the evidence was widest.
        </p>
        <Turn>
          <TurnSide label="First idea" question="Reward the gem-finder">
            Pay drafters for reaching &mdash; taking something later than the world takes it &mdash;
            so that chalk never settles into the solved meta. Coherent, popular, and the kind of
            rule you can explain in one sentence.
          </TurnSide>
          <TurnSide label="What 400 drafts said" question="It rewarded chalk 99–100% of the time" kept>
            The precise inverse of its purpose. The obvious repair &mdash; normalising across the
            whole pack &mdash; just moved the win to the last seat instead, at roughly 90&ndash;100%.
            A seat lottery wearing a skill mechanic.
          </TurnSide>
        </Turn>
        <p>
          What shipped was honest chalk scoring with a comment saying so out loud. The real finding
          wasn&rsquo;t that the formula was miscalibrated; it was that the thing I wanted to reward
          isn&rsquo;t measurable yet. With a static popularity list and no outcome data,
          &ldquo;did you find a gem&rdquo; has no evidence behind it &mdash; you cannot detect a gem
          without proof that it was one. That&rsquo;s not a rejection. It&rsquo;s a feature waiting
          on population data that&rsquo;s already being collected.
        </p>

        <h2>Four ways of finding out, cheapest first</h2>
        <p>
          Sorting the eight by their catch mechanism produced a ladder I didn&rsquo;t expect to be
          so tidy. Each rung costs more than the one above it.
        </p>
        <Split sum="the later the catch, the more it costs">
          <Term word="A simulation" gloss="minutes · nobody saw it">
            Two scoring ideas died here. The reach bonus above, and a rule locking each round to one
            category &mdash; which turned out to be safe in the deep packs where categories are
            nearly free, and broken in the shallow ones where it would actually have mattered. The
            smallest fast-food category is 14 items, about seven on a live board; at eight seats it
            is exhausted before the round completes.
          </Term>
          <Term word="A measurement" gloss="minutes · once I stopped guessing">
            I was certain untracked media was bloating a 650 MB build. I inspected the archive
            instead of reasoning about it: the ignore file was excluding all of that correctly, and
            624 MB of the 650 was <code>.git</code>, re-added by the build tool after the patterns
            were applied. 650 MB to 25 MB, verified by diffing both archives file by file. A
            diversity bonus died the same way &mdash; every major category in movies and music tops
            out at 98&ndash;100, so a five-pick roster spanning five categories costs about two
            points against pure chalk. Players were already drafting diverse rosters by accident.
            The lever was never variety. It was scarcity.
          </Term>
          <Term word="A real session" gloss="after it shipped">
            Two bugs survived mockups, fixtures, review and a full test suite, then died within
            minutes of a real board. One race bar announced &ldquo;kev is close behind &middot; 0
            picks&rdquo; on the opening pick &mdash; true by subtraction, nonsense as a sentence, and
            shown at the one moment nobody is chasing anyone. A fixture never contains a drafter
            with zero picks, and never contains someone losing.
          </Term>
          <Term word="A comment" gloss="six days, or never">
            The expensive rung. A celebration layout marked centred, commented, and marked fixed six
            days earlier still wasn&rsquo;t centred: the container said{' '}
            <code>justify-content: center</code> while its last child said{' '}
            <code>margin-top: auto</code>, and an auto margin eats the free space before
            justify-content ever sees it. The prose asserted something the code contradicted, and
            everyone downstream believed the prose.
          </Term>
        </Split>

        <Callout marker="The point">
          The first idea is a hypothesis. Testing it almost always costs less than shipping it.
        </Callout>

        <h2>The two that got out</h2>
        <p>
          Six of the eight never reached a player. The two that did are the ones worth writing down.
        </p>
        <p>
          A push notification told competitive players they had two minutes to pick. The competitive
          clock is 30 seconds. The number almost certainly came from a nearby constant &mdash; clock
          plus sweeper lag &mdash; but that lag is what an <em>abandoned</em> pick costs everyone
          else, not time the player ever had. On the one mode whose own code comment calls the alert
          &ldquo;the product,&rdquo; the notification was walking people into missed turns while
          telling them they had four times the time they did. It surfaced only because someone
          specifying an unrelated feature said &ldquo;since it&rsquo;s 30 second clocks&rdquo; and
          the number didn&rsquo;t match.
        </p>
        <p>
          The other was quieter and worse. Turn alerts were sent by the client that had just picked
          &mdash; simple, no server work, and correct right up until nobody picked. The timeout
          sweeper has no client, so a missed clock meant the next player was never told they were
          on it, and that cascades: one player times out, the next is never alerted, the next times
          out. A room can auto-draft itself to completion in total silence. The competitive mode had
          already fixed this exact failure and left a comment describing it word for word. Nobody
          noticed it applied to casual too.
        </p>

        <h2>What I actually changed</h2>
        <p>
          Not the ideas &mdash; the order of operations. Simulate before shipping, measure before
          diagnosing, and treat a confident explanation as the thing most in need of a number. Four
          of these eight were killed by a query or a loop that took minutes to write, and in every
          one of those four the confident explanation and the true one were different.
        </p>
        <p>
          The tooling half of that is worth naming honestly: writing a simulation harness or a
          throwaway query is fast now, and that speed is the reason eight of these got tested at all
          rather than argued about. What the tooling cannot do is distrust its own output. Every one
          of these was caught because someone went looking for a number capable of contradicting a
          belief, and deciding to go looking is still the job.
        </p>
        <p>
          There&rsquo;s a habit underneath the other three. Comments rot into lies, and the two
          worst-aged defects here were both places where prose asserted something the code did not
          do. So I write down <em>why</em> now, not <em>what</em>. A &ldquo;what&rdquo; comment
          agrees with you forever. A &ldquo;why&rdquo; is checkable, and a checkable claim is the
          only kind that can be caught being wrong.
        </p>
        <p>
          The part I&rsquo;m least sure about: one bonus mechanic was finished, verified, and proven
          to do exactly what it was designed to do &mdash; on its verification run it flipped second
          and third, which was the intent. I shelved it anyway, because I couldn&rsquo;t explain the
          result to the player who lost. A surprise you can&rsquo;t explain afterwards is
          indistinguishable from a bug. I still don&rsquo;t know whether that was good judgment or
          just nerves.
        </p>
      </>
    ),
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'overscroll-tactics',
    read: '6 min',
    kind: 'log',
    date: 'August 2026',
    dateISO: '2026-08-12',
    title: 'I needed an LLC. I ended up naming my design practice.',
    dek: 'Six weeks naming an umbrella for PlayDraft: Playgrove, then Imaginefield, then Overscroll Tactics — including the branch I threw away and went back for.',
    artifact: { label: 'overscrolltactics.com', href: 'https://overscrolltactics.com/' },
    body: (
      <>
        <p>
          I set out to name a company. Six weeks later I had a name for the way I work, which is
          not the same thing and turned out to be more useful.
        </p>
        <p>
          <Link to="/work/playdraft/">PlayDraft</Link> stopped being a portfolio mockup around the
          first TestFlight build, and a working product with a domain attached needs somewhere to
          legally live. The filing was the easy part. Deciding what name went on it took the rest
          of the summer.
        </p>

        <h2>PlayDraft could have been the company</h2>
        <p>
          It has its own brand, and naming the LLC after it would have taken ten minutes. It would
          also have been wrong for everything after it: a recipe tool for diabetics is not a
          PlayDraft spinoff. Product is not studio, and the parent had to hold PlayDraft without
          making the rest look like it came out of PlayDraft.
        </p>

        <h2>The naming graveyard</h2>
        <p>
          Everything that didn&rsquo;t make it, grouped the way the exploration actually branched.
        </p>
        <Graveyard>
          <Branch
            theme="Play"
            names={[
              'Playgrove Studios',
              'Playcraft Studios',
              'Playlab',
              'Field Play',
              'Field of Play',
              'PlayWard',
              'PlayTapir Studio',
              'Playmorrow Labs',
            ]}
            verdict="Every one turned the company into a game studio. PlayDraft is a game; the company holding it is not."
          />
          <Branch
            theme="Craft"
            names={['CraftGrove', 'Craft Labs', 'Craftmorrow Labs']}
            verdict="True and unownable at once. Craft is the most crowded word in design naming."
          />
          <Branch
            theme="Tactical"
            names={['Tactical Grove', 'Tactical Labs', 'Tactical Studios']}
            verdict="Killed early for sounding like a defense contractor. The call I got wrong, and I didn't find out for a month."
          />
          <Branch
            theme="Imagination"
            names={[
              'Imagine Apps',
              'Imaginefield',
              'Imaginefield Works',
              'Imaginefield Labs',
              'Imaginefield Foundry',
              'Imaginefield Collective',
              'Imaginefield Product Co.',
              'Imaginefield Games',
            ]}
            verdict="The best of the safe answers."
          />
          <Branch
            theme="Behavior"
            names={['Overscroll Tactics']}
            kept
            verdict="Kept. The only one that described the work instead of the output."
          />
        </Graveyard>
        <p>
          Imaginefield led for two weeks and got close enough that I pictured the letterhead. The
          problem was subtler than availability: it described where the ideas would happen and said
          nothing about what I do once they show up.
        </p>

        <h2>The paperwork was never the hard part</h2>
        <p>
          A single-member, member-managed Indiana LLC, filed online through INBiz. Roughly $95 to
          file, about $98 all-in, around $32 for the biennial report. Formation services were
          selling convenience I didn&rsquo;t need, and acting as my own registered agent trades a
          little address privacy for not paying someone yearly to receive mail. One evening for all
          of it, against six weeks on the name.
        </p>

        <h2>Every name answered the wrong question</h2>
        <p>
          Somewhere in the Imaginefield stretch the side projects stopped looking like unrelated
          apps. The same questions kept surfacing:
        </p>
        <ul>
          <li>How far into implementation can a designer actually go?</li>
          <li>How should a design system work when both people and agents read it?</li>
        </ul>
        <p>
          The projects were the lab. I had been trying to name the equipment.
        </p>
        <Callout marker="The turn">
          Every name on my list described what I make. Not one of them described how I work.
        </Callout>
        <Turn>
          <TurnSide label="Was asking" question="What do I build?">
            Produces studio names. Playgrove, Imaginefield Works. Category labels that age badly
            the moment I build outside the category.
          </TurnSide>
          <TurnSide label="Should ask" question="How do I work?" kept>
            Produces a name for a method, which survives a change of subject. What sits underneath
            can be anything, as long as it was made the same way.
          </TurnSide>
        </Turn>

        <h2>Overscroll. Tactics.</h2>
        <p>
          The definition arrived before I was sure about the name: thinking beyond conventional
          patterns and executing with precision.
        </p>
        <Split sum="Go past the expected stopping point. Have a reason.">
          <Term word="overscroll" gloss="[ the behavior ]">
            The part of an interface that keeps moving after it has technically hit its edge. Read
            as a working method, it&rsquo;s the decision not to stop where the discipline says
            you&rsquo;re finished. The design isn&rsquo;t the end. Neither is the prototype, or the
            system.
          </Term>
          <Term word="tactics" gloss="[ the constraint ]">
            The counterweight. Exploration that doesn&rsquo;t produce better decisions is a hobby
            with good taste. Go past the boundary because something on the other side is worth
            having.
          </Term>
        </Split>
        <p>
          Both halves are load-bearing. &ldquo;Overscroll&rdquo; alone is an art project;
          &ldquo;Tactics&rdquo; alone is the defense contractor I talked myself out of in July.
        </p>

        <h2>Negative space does the joining</h2>
        <p>
          One non-negotiable: an O and a T combined, where the gap between the letters carries the
          relationship instead of a third shape. A later pass pushed toward a cursor silhouette,
          which reads as digital interaction without the usual tells. Not purely design, not purely
          engineering, not a game studio, not an agency.
        </p>
        <pre>
          <code>{`OVERSCROLL TACTICS / IDENTITY BRIEF v0

mark        O + T combined. Negative space does the joining.
validate    One color first, before any gradient or texture.
scale       Emblem and wordmark each work alone, down to
            favicon size.
excluded    Angle brackets, pixel grids, terminal type,
            anything that reads "developer logo."`}</code>
        </pre>
        <p>
          The marks were one-color tests on a black artboard when I wrote this. They have since
          resolved and shipped &mdash; the emblem is now{' '}
          <Link to="/work/overscroll-tactics/">die-cut out of a played board in the studio ident</Link>,
          on the site and on every cold launch of PlayDraft. The deliverable was still never a
          logo. A parent with too much character turns every product underneath it into a variant
          of itself, which is{' '}
          <Link to="/work/wheelrack/">partner theming in a token architecture</Link> at a much
          smaller scale.
        </p>

        <h2>Two products and an empty slot</h2>
        <Umbrella parent="Overscroll Tactics">
          <StackItem name={<Link to="/work/playdraft/">PlayDraft</Link>} status="In TestFlight">
            Social drafting product with its own brand and design-system foundation, built in
            React Native and Expo.
          </StackItem>
          <StackItem
            name={<Link to="/work/bolus-binder/">Bolus Binder</Link>}
            status="In TestFlight"
          >
            Recipe storage where the nutrition leads: carbohydrate breakdown, ingredient
            composition, expected glucose behavior. Afterbite, Bolus and mealCurve lost to it.
          </StackItem>
          <StackItem name="The next one" status="Open" open>
            Whatever the next question turns out to be worth building.
          </StackItem>
        </Umbrella>
        <p>
          Bolus Binder is the clearest test of whether the umbrella works. It has nothing to do
          with PlayDraft, and under a name like Playgrove it would have needed an explanation.{' '}
          <Link to="/work/loopstack/">LoopStack</Link> predates all of this, and I haven&rsquo;t
          worked out whether it wants a parent.
        </p>

        <h2>Nothing here is finished</h2>
        <p>
          My strongest professional work lives inside proprietary enterprise systems. I can
          describe it and I can&rsquo;t open the repo, so independent products are the second proof
          layer: systems work and architecture decisions in public, nothing redacted.
        </p>
        <p>
          The mark has resolved since; the sub-brand rules still haven&rsquo;t been tested against
          a second product. I spent six weeks trying to name what I build. The answer was to name
          how I work, and it had been sitting in a branch I&rsquo;d already thrown away.
        </p>
      </>
    ),
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
    body: (
      <>
        <p>
          Two files sit at the root of this repo doing quiet work: PRODUCT.md and DESIGN.md. One
          records who the site is for and what it has to prove. The other records the visual
          system it runs on: the tokens, the single accent, the rule that surfaces stay flat until
          you touch them.
        </p>
        <p>
          They exist because I build fast, often with agents, and speed is where brand consistency
          usually breaks. A generated screen looks plausible and quietly reaches for a purple
          gradient, a floating card, a second accent color. These files are the guardrail. Before
          anything gets designed, the agent, or me, reads the rules and builds from my tokens
          instead of its defaults.
        </p>
        <Callout marker="The point">
          A style guide only governs if something reads it. These are built to be read, by a person
          and an agent.
        </Callout>
        <h2>Consistency you can verify</h2>
        <p>
          This is the same move as the rest of the site. The{' '}
          <Link to="/design-system">design system</Link> renders every token on a live page. The{' '}
          <Link to="/notes/ryan-design-taste-skill">design-taste skill</Link> encodes the judgment
          behind it. PRODUCT.md and DESIGN.md close the loop: the record a person reads and the
          record an agent reads are the same record. If a value isn&rsquo;t in them, new work
          doesn&rsquo;t get to use it.
        </p>
        <h2>The cost is keeping them true</h2>
        <p>
          A rulebook only helps if it stays current, and a stale DESIGN.md is worse than none
          because it lies with confidence. So I treat these like code. When the system changes, the
          file changes in the same commit, and an agent can audit the site against them without me
          in the room.
        </p>
        <p>
          None of this shows on the page, which is the point of governance. You feel it in what
          stays consistent, not in anything you can see.
        </p>
      </>
    ),
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
    body: (
      <>
        <p>
          When someone asks how I work, this site is the thing I point at. Not the case studies
          on it. The site itself. It went through{' '}
          <Link to="/work/wheelrack/">the same loop I use on product work</Link>: start from a
          reference, build tokens before components, add motion only when it carries meaning, and
          keep AI out of the final call.
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
          What came back is quieter and says more. Cards wear Figma-style selection frames and key
          copy gets selected the way a cursor drags across text before it bolds. The comet did not
          earn its way back: what ships is the frame itself, with four corner handles that fade in
          once as the grid reveals and then stay put. The border never animates. That was the
          right call &mdash; a perimeter tracing itself is exactly the kind of motion that competes
          with the work. The interface speaks the language of the tools it was made in, and orange
          means one thing: selected.
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
          inherit my standards instead of their defaults. The brand rules themselves live in{' '}
          <Link to="/notes/governance-in-markdown">two files an agent reads before it builds</Link>.
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
          to <Link to="/work/seasonal-content-system/">author a seasonal storefront in it</Link>.
          Learning Sass well enough to ship it. Learning the token pipeline well enough to{' '}
          <Link to="/work/wheelrack/">argue with it across a design system</Link>.
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
          instruction, and a 460-test suite now guards the language the app is allowed to use.
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
          the discipline of{' '}
          <Link to="/work/overscroll-tactics/">making a mark hold up at 4000% and at favicon size</Link>.
          Print taught me that you get one shot, so the details had better be right before it goes
          to press.
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
