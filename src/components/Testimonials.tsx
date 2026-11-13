import React, { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { EMAIL_HREF } from '../data/site';
import LinkedInLink from './LinkedInLink';

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="testimonials__highlight">{children}</span>
);

export interface Testimonial {
  title: string;
  quote: React.ReactNode;
  name: string;
  role: string;
  year: string;
  /** How they worked with Ryan, as their own recommendation says it; left out where it doesn't. */
  relation?: string;
}

// Preserve the existing recommendations verbatim.
// exported for the about page's channels (about-desk/Channels.tsx), so the two never drift
export const testimonials: Testimonial[] = [
  {
    title: 'Leadership & Delivery',
    quote: (
      <>
        <p>Ryan is <H>one of the most helpful, industrious, passionate and dependable designers</H> I&rsquo;ve had the luck of serving as a manager.</p>
        <p>He runs large projects from a design perspective, coordinates with leaders and ICs from corresponding teams on his own, and has a <H>strong record of delivering large bodies of work without issue</H>. He writes good, clean code and cares passionately about making sure the vision gets realized.</p>
        <p>A team or role that lets him lead projects across technical and nontechnical teams would truly flourish with him in the seat.</p>
      </>
    ),
    name: 'Adam Payne',
    role: 'Web Design Manager, Tire Rack',
    year: '2026',
    relation: 'Managed Ryan directly',
  },
  {
    title: 'Design–Engineering Partnership',
    quote: (
      <>
        <p>He owned the design side; I owned the build, and it was <H>one of the best collaborations I&rsquo;ve had</H>. Ryan doesn&rsquo;t just design screens. He <H>designs the whole experience</H>.</p>
        <p>WheelRack had no shared foundation when we started, so Ryan built one from scratch, a full token set for color, spacing, and typography that grew into a documented component library. That gave us <H>one vocabulary to work from instead of two</H>, and it made my half of the work a lot easier to do well.</p>
        <p><H>Any product team would be better with him on it.</H></p>
      </>
    ),
    name: 'Cheryl Carpenter',
    role: 'React Front-End Developer, Tire Rack',
    year: '2026',
    relation: 'Ryan’s build partner on WheelRack',
  },
  {
    title: 'Design-to-Development on AEM',
    quote: (
      <>
        <p>I&rsquo;ve had the pleasure of working with Ryan Deboer for <H>more than 10 years</H>. We first worked together as web designers. I later served as a lead web designer while Ryan was on the design team. For the past three years, I&rsquo;ve worked closely with him in my role as AEM Development Manager.</p>
        <p>Ryan is a talented senior designer with a <H>strong understanding of AEM, HTML, and CSS</H>. He has been an excellent partner throughout our transition and upgrade to AEM Core Components, helping ensure that designs are <H>both visually strong and technically effective</H>. Since I moved into development, he has played a key role in <H>bridging the gap between creative vision and technical execution</H>. He is a key asset to any team!</p>
        <p>Ryan is dependable, knowledgeable, detail-oriented, and genuinely a pleasure to work with. His collaboration and expertise have become such an important part of our work that I honestly <H>can&rsquo;t imagine working without him</H>. I highly recommend Ryan to any team looking for a skilled designer and strong cross-functional partner.</p>
      </>
    ),
    name: 'Patrick Stines',
    role: 'AEM Development Manager, Tire Rack',
    year: '2026',
    relation: 'Worked with Ryan 10+ years',
  },
  {
    title: 'Craft, Care, and Growth',
    quote: (
      <>
        <p>Ryan and I work closely together to support a professional development program that serves around 100 people within our department. The quality of the experience our participants receive is a <H>direct reflection of the effort and care he puts into it</H>.</p>
        <p>As a designer, he has an <H>exceptional eye for creating work that is clean, creative and visually engaging</H>.</p>
        <p>Most importantly, Ryan is one of the kindest and most professional people I&rsquo;ve worked with. He combines talent, humility and a genuine desire to help his teammates succeed.</p>
      </>
    ),
    name: 'Amanda Straup',
    role: 'Assistant Vice President, Digital Operations, Tire Rack',
    year: '2026',
    relation: 'Runs a development program with Ryan',
  },
  {
    title: 'Process Improvement & Shared Learning',
    quote: (
      <>
        <p>I worked with Ryan for <H>over 10 years</H> and got to know him quite well, both as a designer and as a person. He truly has a passion for improvement in both his professional and personal life. He is always looking for <H>better and more efficient ways to do things</H>. He loves trying new tools and <H>refining existing processes</H>.</p>
        <p>&hellip; He&rsquo;s always eager to ask questions, see what others have been working on, and find what knowledge he can glean from them. At the same time, he&rsquo;s <H>happy to share his own knowledge and what he has learned</H> from the work he&rsquo;s been doing.</p>
      </>
    ),
    name: 'Rob Oxley',
    role: 'Senior Web Designer, Tire Rack',
    year: '2026',
    relation: 'Design peer for 10+ years',
  },
  {
    title: 'Systems Knowledge & Cross-Team Trust',
    quote: (
      <>
        <p>Ryan has a lot of <H>institutional knowledge</H>. He understands what we&rsquo;ve done in the past, <H>what&rsquo;s worked, what hasn&rsquo;t, and why</H>. Combined with his technical skills, he has been very effective in project work.</p>
        <p>He consistently takes the initiative to engage relevant teams (including UX, UXR, Analytics, Imaging, and SEO) whenever needed. He excels at <H>building and maintaining strong relationships</H>, which significantly enhances his overall effectiveness. It&rsquo;s also evident that he genuinely <H>values and cares for his colleagues</H>.</p>
      </>
    ),
    name: 'Ryan Kokesh',
    role: 'Senior UX Manager, Tire Rack',
    year: '2024',
    relation: 'Direct manager, 2021–2025',   // Ryan, 21 October: his manager of design and UX
  },
  {
    title: 'Mentorship & Confidence',
    quote: (
      <>
        <p>Since I started at Tire Rack almost 5 years ago, Ryan has always been <H>a kind and thoughtful mentor</H> to me as a Senior Designer on the Web Design team.</p>
        <p>He is a very intuitive and collaborative teammate, and <H>always looks for ways that we can improve our design system and user experience</H> throughout our sites.</p>
        <p>He is a seasoned pro with Adobe Creative Suite and <H>took the time to teach me a few tricks</H> with Illustrator and Photoshop to improve my design output and workflow. He is also skilled with AEM and is <H>a great knowledge resource</H> for this platform as well.</p>
        <p>I know that whenever we are paired together on a project, Ryan will <H>go out of his way to ensure the junior designer (me in this case) has the confidence they need</H> in order to make the project a success.</p>
      </>
    ),
    name: 'Gina Saucedo',
    role: 'Web Designer, Tire Rack',
    year: '2026',
    relation: 'Mentored by Ryan',
  },
];

// The home row, in reading order: manager, build partner, the operations
// leader he runs the development program with, AEM partner, the UX manager
// who oversaw design, then the two design peers.
export const FEATURED = ['Adam Payne', 'Cheryl Carpenter', 'Amanda Straup', 'Patrick Stines', 'Ryan Kokesh', 'Rob Oxley', 'Gina Saucedo'];
const featured = FEATURED.map((name) => {
  const t = testimonials.find((item) => item.name === name);
  if (!t) throw new Error(`No testimonial for ${name}`);
  return t;
});

export const initials = (name: string) => name.split(' ').map((part) => part[0]).join('');
// First names on a phone's row; a Ryan who isn't this Ryan gets his initial
const shortName = (name: string) => {
  const [first, last] = name.split(' ');
  return first === 'Ryan' ? `${first} ${last[0]}.` : first;
};

export const FeaturedEndorsement: React.FC = () => (
  <figure className="featured-endorsement">
    <blockquote>“That gave us one vocabulary to work from instead of two, and it made my half of the work a lot easier to do well.”</blockquote>
    <figcaption><strong>Cheryl Carpenter</strong> · React Front-End Developer, Tire Rack · WheelRack build partner, on the token and component library, 2026. <a href="#testimonials" className="about__inline-link">Read the recommendations</a></figcaption>
  </figure>
);

// How many lines a recommendation marks: its highlighted phrases.
const countMarks = (node: React.ReactNode): number => {
  let n = 0;
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    const el = child as React.ReactElement<{ children?: React.ReactNode }>;
    if (el.type === H) n += 1;
    else n += countMarks(el.props.children);
  });
  return n;
};

// The recommendations as direct messages, on an iPad lying on the table
// (canvas F2's panel inside O2's tablet, Ryan, 11 Nov 2026). The wood band is
// the tabletop; the tablet is an object drawn with its own material (rim, side
// wall, black glass, a contact shadow and the binder's one light), so the app
// on its screen can stay flat. The people are a tablist (arrow keys, Home,
// End) with one selection frame that travels to the chosen person; each name
// is unread until opened, and the meter at the foot counts what has been read.
// The thread arrives a message at a time, each marked line is selected and
// underlined in turn, and a receipt says how many lines were marked. Across the
// top on a phone. The message box at the foot is the way to reach Ryan.
const Testimonials: React.FC = () => {
  const [sectionRef, revealed] = useReveal<HTMLElement>(0.15);
  const [active, setActive] = useState(0);
  const [read, setRead] = useState<ReadonlySet<number>>(() => new Set([0]));
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const pane = useRef<HTMLElement | null>(null);
  const t = featured[active];
  const last = featured.length - 1;
  const marks = countMarks(t.quote);
  // The list runs down the side, and across the top on a phone: it says so,
  // so a screen reader names the arrow keys that match (both pairs work).
  const [across, setAcross] = useState(false);
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 640px)');
    const sync = () => setAcross(phone.matches);
    sync();
    phone.addEventListener('change', sync);
    return () => phone.removeEventListener('change', sync);
  }, []);
  // a new thread starts at its top
  useEffect(() => { pane.current?.scrollTo?.({ top: 0 }); }, [active]);

  const show = (i: number, focus = false) => {
    setActive(i);
    setRead((r) => (r.has(i) ? r : new Set(r).add(i)));
    const tab = tabs.current[i];
    if (focus) tab?.focus();
    // on a phone the list scrolls sideways: bring the chosen person into view
    tab?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };
  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowRight: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    show(keys[event.key], true);
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`testimonials testimonials--concise testimonials--tablet ink-ground${revealed ? ' testimonials--revealed' : ''}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials__container">
        <div className="testimonials__nav">
          <h2 id="testimonials-heading" className="testimonials__lede">In their words</h2>
          <span className="testimonials__note" aria-hidden="true">
            tap a name, it opens
            <svg viewBox="0 0 64 64" fill="none"><path d="M6 6 C 30 4, 44 20, 34 54" /><path d="M26 46 L 34 55 L 41 45" /></svg>
          </span>
          <LinkedInLink
            label={`All ${featured.length} on LinkedIn`}
            surface="testimonial_source"
            to="recommendations"
            variant="inline"
            className="testimonials__all"
          />
        </div>

        <div className="testimonials__tablet">
          <span className="testimonials__buttons" aria-hidden="true"><i /><i /></span>
          <div className="testimonials__rim">
            <div className="testimonials__bezel">
              <span className="testimonials__camera" aria-hidden="true" />
              <div className="testimonials__screen">
                <div className="testimonials__status" aria-hidden="true">
                  <span>9:41</span>
                  <span className="testimonials__status-end">
                    <svg viewBox="0 0 16 12" width="16" height="12"><path d="M1.5 4.2a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0M6.6 9.6a2.2 2.2 0 0 1 2.8 0" /></svg>
                    <svg viewBox="0 0 26 12" width="26" height="12"><rect x="0.75" y="0.75" width="21.5" height="10.5" rx="3" /><rect x="2.5" y="2.5" width="18" height="7" rx="1.6" className="is-fill" /></svg>
                  </span>
                </div>

                <div className="testimonials__app">
                  <div className="testimonials__people">
                    {/* one selection frame for the list; it travels to the chosen person */}
                    <span className="testimonials__frame" aria-hidden="true" style={{ '--row': active } as React.CSSProperties}><i /><i /><i /><i /></span>
                    <div className="testimonials__list" role="tablist" aria-orientation={across ? 'horizontal' : 'vertical'} aria-label="Recommendations">
                      {featured.map((p, i) => (
                        <button
                          key={p.name}
                          ref={(el) => { tabs.current[i] = el; }}
                          type="button"
                          role="tab"
                          id={`recommendation-tab-${i}`}
                          aria-selected={i === active}
                          aria-controls="recommendation-panel"
                          tabIndex={i === active ? 0 : -1}
                          className={`testimonials__person${read.has(i) ? ' is-read' : ''}`}
                          onClick={() => show(i)}
                          onKeyDown={(event) => onKey(event, i)}
                        >
                          <span className="testimonials__avatar" aria-hidden="true">{initials(p.name)}</span>
                          <span className="testimonials__person-text">
                            <span className="testimonials__person-name">{p.name}</span>
                            <span className="testimonials__person-first" aria-hidden="true">{shortName(p.name)}</span>
                            <span className="testimonials__preview" aria-hidden="true">{p.relation ?? p.title}</span>
                          </span>
                          <span className="testimonials__unread" aria-hidden="true" />
                          {!read.has(i) && <span className="sr-only">, unread</span>}
                        </button>
                      ))}
                    </div>
                    <div className="testimonials__meter">
                      <span className="testimonials__ticks" aria-hidden="true">
                        {featured.map((p, i) => <i key={p.name} className={read.has(i) ? 'is-read' : undefined} />)}
                      </span>
                      <span>{read.size} of {featured.length} read</span>
                    </div>
                  </div>

                  <div className="testimonials__convo" role="tabpanel" id="recommendation-panel" aria-labelledby={`recommendation-tab-${active}`}>
                    <div className="testimonials__convo-head">
                      <span className="testimonials__avatar testimonials__avatar--sm" aria-hidden="true">{initials(t.name)}</span>
                      <span className="testimonials__who">
                        <span className="testimonials__name">{t.name}</span>
                        <span className="testimonials__role">{t.role}{t.relation ? ` · ${t.relation}` : ''}</span>
                      </span>
                    </div>
                    {/* the thread scrolls inside the screen, so it takes focus; keyed,
                        so a new person's thread arrives again */}
                    <figure key={t.name} ref={pane} className="testimonials__messages" tabIndex={0} aria-label={`${t.name}'s recommendation`}>
                      <figcaption className="testimonials__sender">
                        <span className="testimonials__name">{t.name}</span> <time dateTime={t.year}>{t.year}</time>
                      </figcaption>
                      <div className="testimonials__stack">
                        <span className="testimonials__avatar testimonials__avatar--active" aria-hidden="true">{initials(t.name)}</span>
                        <div className="testimonials__bubbles">
                          <blockquote className="testimonials__thread">{t.quote}</blockquote>
                          <p className="testimonials__receipt" style={{ '--paras': React.Children.count((t.quote as React.ReactElement<{ children?: React.ReactNode }>).props?.children) } as React.CSSProperties}>
                            <i aria-hidden="true" />{marks} {marks === 1 ? 'line' : 'lines'} marked
                          </p>
                        </div>
                      </div>
                    </figure>
                    {/* Drawn as a message box, but it's a link: it says what it does */}
                    <a href={EMAIL_HREF} className="testimonials__composer" aria-label="Get in touch: email Ryan about your team">
                      <span className="testimonials__composer-hint" aria-hidden="true">Message Ryan about your team…</span>
                      <span className="testimonials__send">Get in touch</span>
                    </a>
                  </div>
                </div>
                <span className="testimonials__shine" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
