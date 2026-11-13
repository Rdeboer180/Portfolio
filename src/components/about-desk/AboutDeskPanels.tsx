// The folder's three tabs, and the front it shows under every one of them.
// The copy is the About page's own, from the same data it reads: nothing is
// rewritten here. What this adds is the way into the desk: a [[link]] under a
// section draws a line to the thing it names.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { processBeats, processCloser, storySections } from '../../data/about';
import { Channels } from './Channels';
import { useOpenNote } from './noteOpener';
import { progression } from '../About';
import { TOOL_GROUPS } from '../AboutHero';
import { FACTS, STACK } from '../CandidateSnapshot';
import { STUDIO_POINTS } from '../AboutStudio';
import { EMAIL_HREF } from '../../data/site';
import LinkedInLink from '../LinkedInLink';
import { getHomeHref } from '../../utils/homeSession';
import { DeskTab } from './deskObjects';

export interface WikiLinkProps {
  /** the LINK_TO key */
  to: string;
  children: React.ReactNode;
  onOn: (key: string, e: React.SyntheticEvent<HTMLElement>) => void;
  onOff: () => void;
  href: string;
  /** a click on the link: the page opens the thing's note when the thing itself is not on screen */
  onPick?: (key: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** A [[link]]: the brackets faint, the name in the accent, a line to the thing on hover or focus. */
export const WikiLink: React.FC<WikiLinkProps> = ({ to, children, onOn, onOff, href, onPick }) => (
  <a
    className="wl"
    href={href}
    onClick={onPick ? (e) => onPick(to, e) : undefined}
    onPointerEnter={(e) => onOn(to, e)}
    onPointerLeave={onOff}
    onFocus={(e) => onOn(to, e)}
    onBlur={onOff}
  >
    {children}
  </a>
);

type Wiki = (to: string, label: React.ReactNode) => React.ReactNode;

/** every draft list on the desk, in the order the things sit on it, with the thing that opens it */
const DRAFT_LISTS: { note: string; label: string; from: string }[] = [
  { note: 'pokemon', label: 'My top 10 Pokémon', from: 'Pokémon Red' },
  { note: 'tv', label: 'My favorite TV series', from: 'The four-star ball' },
  { note: 'games', label: 'My top 10 games', from: 'Game Boy Color' },
  { note: 'designers', label: 'The designers I learn from', from: 'Illustrator CS disc' },
  { note: 'songs:0', label: 'My top 10 songs', from: 'iPod mini' },
  { note: 'podcasts', label: 'My top 10 podcasts', from: 'AirPods Pro' },
  { note: 'movies', label: 'My favorite movies', from: 'Grays Sports Almanac' },
  { note: 'goat', label: 'My GOAT athletes', from: 'Notre Dame football' },
];

/**
 * The way into the draft lists from the page itself, so a phone (where the
 * desk's things are not in the margins) reaches every one: a short intro, each
 * list as a row that opens its note, then the playground and the Loop build.
 */
const DraftLists: React.FC = () => {
  const open = useOpenNote();
  return (
    <aside className="draft-lists" aria-labelledby="draft-lists-title">
      <h3 id="draft-lists-title">Find out more about me in my draft lists</h3>
      <p>Every thing on this desk opens one of my top tens, drafted the way PlayDraft drafts: movies, podcasts, songs, games and the rest.</p>
      <ul>
        {DRAFT_LISTS.map((l) => (
          <li key={l.note}>
            <button type="button" id={`t-list-${l.note.replace(':', '-')}`} onClick={() => open(l.note, `list-${l.note.replace(':', '-')}`)}>
              <b>{l.label}</b><small>{l.from}</small><span aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="draft-lists__more">
        Also on the desk: <NoteLink note="pad" id="playground">my prototype playground</NoteLink> · <NoteLink note="loop" id="loop">my Loop build</NoteLink>
      </p>
    </aside>
  );
};

/** A plain link that says what it opens (my top 10 movies) and opens that note in the slide-out, wherever its thing is on the desk */
const NoteLink: React.FC<{ note: string; id: string; children: React.ReactNode }> = ({ note, id, children }) => {
  const open = useOpenNote();
  return <button type="button" id={`t-link-${id}`} className="note-link" onClick={() => open(note, `link-${id}`)}>{children}</button>;
};

// The facts recruiters and answer engines read first. Mirrors CandidateSnapshot,
// whose facts and stack it imports; the summary and evidence are its too.
const GLANCE_SUMMARY = 'I design systems and carry them into the build: tokens, components, states, and governance that hold up in production. Across 12+ years at Tire Rack that means Figma, production Sass, and AEM component variants with authoring guardrails, in partnership with engineering, SEO, and design teams. Outside work it means agent-assisted React Native builds on TestFlight. I am open to remote US roles in product design, design systems, and design engineering.';
const GLANCE_EVIDENCE = [
  { to: '/work/aem-component-system/', label: 'AEM component system', text: 'core-component variants, production Sass, and authoring defaults.' },
  { to: '/work/landing-pages/', label: 'Landing page system', text: 'reusable templates and governance for content authors.' },
  { to: '/work/wheelrack/', label: 'WheelRack', text: 'enterprise design systems, tokens, and Storybook components.' },
  { to: '/notes/aem-meeting-authors-where-they-work/', label: 'Agentic AEM authoring', text: 'evaluating Claude and MCP for content updates within our component rules.' },
];

// The live About hero's headline and its reveal, carried over as they are: the
// eyebrow fades up, each line of the headline rises out of its own mask, and
// the intro and the facts follow, on the hero's own timings (AboutHero.tsx,
// the .reveal-* utilities in _reveal.scss). Reduced motion shows it all at once.
const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` }) as React.CSSProperties;
/** the headline's letters, each its own key (Hybrid A presses them; elsewhere they are plain type) */
const Keys: React.FC<{ text: string }> = ({ text }) => (
  <>{Array.from(text).map((c, i) => (c === ' ' ? ' ' : <span key={i} className="ch" aria-hidden="true">{c}</span>))}</>
);

const FrontReveal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);
  return (
    <div className={`about-desk__hero${visible ? ' is-visible' : ''}`}>
      <p className="about-desk__eyebrow reveal-fade" style={delay(0)}>Craft / Code / Systems / Care</p>
      <h1 className="about-desk__title" aria-label="Craft is the through-line.">
        <span className="reveal-mask"><span className="reveal-mask__inner" style={delay(120)}><Keys text="Craft is the" /></span></span>
        <span className="reveal-mask"><span className="reveal-mask__inner front-line" style={delay(220)}><Keys text="through-line." />
          {/* Hybrid A draws a pencil line under the through-line; hidden elsewhere */}
          <svg className="front-underline" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M4 14C70 9 150 16 236 11S356 9 396 13" pathLength={1} />
            <path d="M18 19C110 15 210 20 300 16S370 15 388 18" pathLength={1} />
          </svg>
        </span></span>
      </h1>
      <p className="about-desk__dek reveal-fade" style={delay(1000)}>I’m a senior product designer who kept moving closer to how the work gets built.</p>
      {/* the old About hero's three paragraphs, kept in their place under the line (Ryan, 1 Nov) */}
      <div className="about-desk__intro reveal-fade" style={delay(1050)}>
        <p>My work spans UX, product design, and design systems for the web and React Native. I partner with engineers to carry interaction and brand decisions into reusable components and working products.</p>
        <p>At Tire Rack, that includes 12+ years of AEM front-end authoring, building component variants and guardrails, and contributing template and Sass code to our internal CMS framework. I also build internal agentic tools and reusable skills to reduce repetitive work and help my team and the teams we work with get from an idea to production sooner.</p>
        <p>Away from the desk, I’m a husband and dad in South Bend. Sunday dinners, Survivor nights with my mom and my oldest friend, and a dynasty fantasy football league that’s been running for a decade. I like sticking with things long enough to make them better, which is most of what a design system asks for.</p>
      </div>
      <dl className="about-desk__facts reveal-fade" style={delay(1100)} aria-label="Ryan DeBoer at a glance">
        {FACTS.map((f) => (
          <div key={f.label} className={f.label === 'Availability' ? 'fact fact--flip' : 'fact'}>
            <dt>{f.label}</dt>
            {f.label === 'Availability' ? (
              // Hybrid A flips this sign over to its other side; elsewhere the back stays out of sight
              <dd className="fact__sign"><span className="fact__front">{f.value}</span><a className="fact__back" href={EMAIL_HREF}>Yes, say hello →</a></dd>
            ) : <dd>{f.value}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
};

// The front of the folder: what every tab shares, kept short. The facts are
// CandidateSnapshot's; the line under the title is the live About hero's own.
export const DeskFront: React.FC<{ wiki: Wiki }> = ({ wiki }) => (
  <>
    <div className="section-badge">
      <span className="section-badge__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v1.5c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5V19c0-2.8-3.6-5-8-5z" /></svg>
      </span>
      <span className="section-badge__label">About</span>
    </div>
    <p className="about-desk__from">
      From {wiki('southbend', 'South Bend')}
      <span className="about-desk__tag">#product-design</span>
      <span className="about-desk__tag">#design-systems</span>
      <span className="about-desk__tag">#ui-engineering</span>
    </p>
    <FrontReveal />
  </>
);

/** At a glance: the facts recruiters and answer engines read first, at the top of How I work. */
const Glance: React.FC = () => (
  <section className="glance" aria-labelledby="about-desk-glance">
    <p className="glance__eyebrow">At a glance</p>
    <h2 id="about-desk-glance">Ryan DeBoer, Product Design Engineer</h2>
    <p>{GLANCE_SUMMARY}</p>
    <ul className="glance__evidence" aria-label="Selected project evidence">
      {GLANCE_EVIDENCE.map((e) => <li key={e.to}><Link to={e.to}>{e.label}</Link>: {e.text}</li>)}
    </ul>
    <div className="glance__stack">
      <span>Current working stack</span>
      {STACK.map((x) => <span key={x} className="glance__chip">{x}</span>)}
    </div>
    <div className="glance__links">
      <a className="btn btn--primary btn--md" href={EMAIL_HREF}>Email</a>
      <Link className="btn btn--secondary btn--md" to="/resume">Résumé</Link>
      <LinkedInLink label="LinkedIn" surface="candidate_snapshot" variant="button" />
    </div>
  </section>
);

const story = (num: string) => {
  const s = storySections.find((x) => x.num === num);
  if (!s) throw new Error(`about desk: no story beat ${num}`);
  return s;
};

const Story: React.FC<{ num: string; aside?: 'right' | 'left'; desk?: React.ReactNode }> = ({ num, aside = 'right', desk }) => {
  const s = story(num);
  const id = `about-desk-story-${num}`;
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{s.title}</h2>
      {s.annotation && <p className={`about-desk__aside${aside === 'left' ? ' about-desk__aside--left' : ''}`} aria-hidden="true">{s.annotation}</p>}
      {s.body.map((p, i) => <p key={i} className={i === 0 ? 'lead' : undefined}>{p}</p>)}
      {s.related && <Link className="more" to={s.related.to}>{s.related.label} →</Link>}
      {desk && <p className="about-desk__onthedesk">Open {desk}</p>}
    </section>
  );
};

export const WorkPanel: React.FC<{ wiki: Wiki }> = ({ wiki }) => (
  <>
    <Glance />
    <section aria-labelledby="about-desk-bridge">
      <h2 id="about-desk-bridge">How that shows up in the work</h2>
      <p className="lead">I keep working on a design after it leaves Figma. I check how it behaves in the product and use what implementation reveals to improve the next version.</p>
      <p>This site is one working example. The decisions behind it live in {wiki('notes', 'the notes')}, alongside the systems, mistakes, and open questions that shaped the work.</p>
      <LinkedInLink label="Read along as it happens" surface="about_bridge" className="more" />
    </section>
    <section id="process" aria-labelledby="about-desk-process">
      <p className="label">[ Process ]</p>
      <h2 id="about-desk-process">How I work</h2>
      <p className="about-desk__aside" aria-hidden="true">no finish line</p>
      <p className="lead"><b>A working loop.</b> Define the rules, explore across surfaces, learn from what becomes real, and feed it back into the system. Then start again from what the system now knows.</p>
      <ol className="beats" aria-label="The loop, in four beats">
        {processBeats.map((b) => (
          <li key={b.num} className="beat">
            <span className="beat__n">{b.num}</span>
            <div>
              <h3>{b.title}</h3>
              <p className="beat__meta">{b.meta}</p>
              <p>{b.body}</p>
              <p className="beat__cost"><b>Cost of skipping it</b><span>{b.cost}</span></p>
              <p className="beat__ev"><Link to={b.evidence.to}>{b.evidence.label}</Link><small>{b.evidence.to}</small></p>
              <p className="beat__rel">{b.relation}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="about-desk__closer">{processCloser.lead}<b>{processCloser.emphasis}</b>.</p>
      <p>{processCloser.reps}</p>
    </section>
    <section aria-labelledby="about-desk-carry">
      <h2 id="about-desk-carry">What I carry into the work</h2>
      <p>Visual fundamentals, reusable systems, and the judgment to check what actually ships.</p>
      <dl className="kv">
        {TOOL_GROUPS.map((g) => <div key={g.label}><dt>{g.label}</dt><dd>{g.tools}</dd></div>)}
      </dl>
      <a className="more" href={`${getHomeHref()}#mastery`}>Explore my capabilities and project evidence →</a>
      <p className="about-desk__onthedesk">Open <NoteLink note="tree" id="tree-tools">my skill tree</NoteLink></p>
    </section>
    <section aria-labelledby="about-desk-words">
      <p className="label">[ Strengths ]</p>
      <h2 id="about-desk-words">In other people’s words</h2>
      <p>A list of strengths is a claim. So each one is a channel, and the people who saw it left the message. The phrases are mine. The words are theirs.</p>
      <Channels />
      <p className="about-desk__fine">
        All seven recommendations, in full: <a href={`${getHomeHref()}#testimonials`}>on the homepage</a> or{' '}
        <LinkedInLink label="on LinkedIn" surface="testimonial_source" to="recommendations" variant="inline" />.
      </p>
    </section>
  </>
);

export const PathPanel: React.FC<{ wiki: Wiki }> = ({ wiki }) => (
  <>
    <Story num="01" desk={<><NoteLink note="card:grand-lan" id="kendall">my Grand LAN identity, from Kendall</NoteLink> · <NoteLink note="archive" id="archive">the early-work archive</NoteLink></>} />
    <Story num="02" />
    <Story num="03" />
    <Story num="04" desk={<><NoteLink note="loop" id="loop-path">my Loop build</NoteLink> · <NoteLink note="tree" id="tree-path">my skill tree</NoteLink></>} />
    <section aria-labelledby="about-desk-steps">
      <h2 id="about-desk-steps">The craft came first. The responsibility kept growing.</h2>
      <p>Each step brought me closer to the product, the implementation, and the people building it.</p>
      <ol className="steps" aria-label="Career progression">
        {progression.map((step) => (
          <li key={step.date}>
            <time>{step.date}</time>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.href && <Link className="more" to={step.href}>{step.link} →</Link>}
            {step.archive && <p className="about-desk__onthedesk">Seven pieces from then: open <NoteLink note="archive" id="archive-2013">the early-work archive</NoteLink></p>}
          </li>
        ))}
      </ol>
      <p>
        Alongside the team work, <Link to="/work/playdraft/">PlayDraft</Link> and {wiki('loop', 'LoopStack')} keep me close to the tradeoffs,
        edge cases, and maintenance decisions that only appear in a working product.
      </p>
    </section>
  </>
);

export const WhoPanel: React.FC<{ wiki: Wiki }> = ({ wiki }) => (
  <>
    {/* The human part, merged with the homepage FAQ's "What drives you outside of
        design?": both opened on Stephanie and the kids, so the family comes once,
        then the people, the league, Loop, and the line about traditions. */}
    <section aria-labelledby="about-desk-human">
      <h2 id="about-desk-human">{story('05').title}</h2>
      <p className="about-desk__aside" aria-hidden="true">{story('05').annotation}</p>
      <p className="lead">I’m a husband and father first. I married my high school sweetheart Stephanie, and we’ve now spent more than half our lives together. Our two kids are the center of everything, and the life we are building at home shapes the kind of work I want and the pace I can sustain.</p>
      <p>Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us. Outside work, I spend time with the people I’ve known longest: Survivor nights with my mom and childhood best friend, Sunday family dinners, and board games with cousins.</p>
      <p>Football Sundays are sacred. I’ve run a dynasty fantasy football league, the Grandville Gremlins, for about a decade, and every team has a custom mascot and logo I designed. It keeps a tight group of high school and college friends connected year-round. And like most people, I unwind with good TV and film. Always watching something.</p>
      <p>A lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app, a closed-loop insulin delivery system I’ve configured and maintained myself. It’s equal parts health management and engineering hobby, and it eventually became a product: <Link to="/work/loopstack/">LoopStack</Link>, a pattern-review app built on my own data.</p>
      <p>I like traditions and sticking with something long enough to make it better. That carries into my work too.</p>
      <DraftLists />
    </section>
    <Story num="06" />
    <Story num="07" aside="left" />
    <section aria-labelledby="about-desk-room">
      <p className="label">[ The room / where it happens ]</p>
      <h2 id="about-desk-room">The room behind the work.</h2>
      <p className="lead">Most of the work I care about happens between the obvious artifacts.</p>
      <p>This is where a Figma decision gets tested in code, a production edge case becomes a new system rule, an agent gets the same context as the team, and an idea gets enough drafts to become something other people can use.</p>
      <p>This is my room, but the habits carry into team projects. I check the build against the designs and update both when testing exposes a problem.</p>
      <dl className="kv">
        <div><dt>Base</dt><dd>South Bend, Indiana</dd></div>
        <div><dt>Time zone</dt><dd>Eastern · US remote</dd></div>
        <div><dt>Workspace</dt><dd>Dedicated home studio</dd></div>
        <div><dt>Working loop</dt><dd>Define → explore → learn → feed back</dd></div>
      </dl>
      <ol className="stops" aria-label="Five stops in the room">
        {STUDIO_POINTS.map((pt) => (
          <li key={pt.id}>
            <span className="n">{pt.number}</span>
            <div>
              <p className="label">{pt.label}</p>
              <h3>{pt.title}</h3>
              <p>{pt.body}</p>
              <p className="proof"><b>What it proves</b>{pt.proof}</p>
              {pt.id === 'monitor' && <p className="about-desk__onthedesk">Open <NoteLink note="loop" id="loop-studio">my Loop build, where LoopStack started</NoteLink></p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  </>
);

export const PANELS: Record<DeskTab, React.FC<{ wiki: Wiki }>> = { work: WorkPanel, path: PathPanel, who: WhoPanel };
