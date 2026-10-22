import React, { useEffect, useRef, useState } from 'react';
import SectionBadge from './SectionBadge';
import { useReveal } from '../hooks/useReveal';
import { EMAIL_HREF, SITE } from '../data/site';

const QuoteIcon = () => (
  <svg viewBox="0 0 180 169.8" fill="currentColor" stroke="none">
    {/* Back bubble */}
    <path d="M19.09,125.13h-3.06c-8.82,0-16.03-7.22-16.03-16.03V40.25c0-12.58,10.27-22.85,22.85-22.85h.68V5.47c0-2.07,1.07-3.85,2.91-4.82,1.82-.96,3.89-.85,5.59.3l24.11,16.45h80.56c8.82,0,16.03,7.22,16.03,16.03v3.06H43.31c-13.33,0-24.21,10.88-24.21,24.21v64.42h0Z" opacity="0.4" />
    {/* Middle bubble */}
    <path d="M152.73,44.68v64.42c0,8.82-7.22,16.03-16.03,16.03H27.27V60.71c0-8.82,7.22-16.03,16.03-16.03h109.42Z" opacity="0.7" />
    {/* Front bubble */}
    <path d="M160.91,44.68h3.06c8.82,0,16.03,7.22,16.03,16.03v68.84c0,12.58-10.27,22.85-22.85,22.85h-.68v11.93c0,2.07-1.07,3.85-2.91,4.82-1.82.96-3.88.85-5.59-.3l-24.11-16.45H43.31c-8.82,0-16.03-7.22-16.03-16.03v-3.06h109.42c13.33,0,24.21-10.88,24.21-24.21V44.68h0Z" opacity="0.55" />
    {/* Dots in middle bubble */}
    <circle cx="57.6" cy="84.9" r="10.2" fill="#fff" />
    <circle cx="90" cy="84.9" r="10.2" fill="#fff" />
    <circle cx="122.4" cy="84.9" r="10.2" fill="#fff" />
  </svg>
);

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="testimonials__highlight">{children}</span>
);

interface Testimonial {
  title: string;
  quote: React.ReactNode;
  name: string;
  role: string;
  year: string;
  /** How they worked with Ryan, as their own recommendation says it; left out where it doesn't. */
  relation?: string;
}

// Preserve the existing recommendations verbatim.
const testimonials: Testimonial[] = [
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
const FEATURED = ['Adam Payne', 'Cheryl Carpenter', 'Amanda Straup', 'Patrick Stines', 'Ryan Kokesh', 'Rob Oxley', 'Gina Saucedo'];
const featured = FEATURED.map((name) => {
  const t = testimonials.find((item) => item.name === name);
  if (!t) throw new Error(`No testimonial for ${name}`);
  return t;
});

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('');
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

// One recommendation as a conversation: the sender, each paragraph as its own
// message, and the through-line tag. A sizer copy is hidden and inert; it only
// holds the space (see the slot below).
const Thread: React.FC<{ t: Testimonial; sizer?: boolean }> = ({ t, sizer }) => (
  <figure
    className={`testimonials__messages${sizer ? ' testimonials__messages--sizer' : ''}`}
    aria-hidden={sizer || undefined}
    inert={sizer || undefined}
  >
    <figcaption className="testimonials__sender">
      <span className="testimonials__name">{t.name}</span> <time dateTime={t.year}>{t.year}</time>
    </figcaption>
    <div className="testimonials__stack">
      <span className="testimonials__avatar testimonials__avatar--active" aria-hidden="true">{initials(t.name)}</span>
      <blockquote className="testimonials__thread">{t.quote}</blockquote>
    </div>
    <div className="testimonials__foot">
      <span className="testimonials__tag">{t.title}</span>
      <a href={SITE.linkedinRecommendationsUrl} className="testimonials__more" target="_blank" rel="noopener noreferrer">
        On LinkedIn <span aria-hidden="true">↗</span><span className="sr-only"> {t.name}&rsquo;s recommendation (opens in a new tab)</span>
      </a>
    </div>
  </figure>
);

// The recommendations as direct messages (concept D2, Ryan's pick, 21
// October): the people down one side, and the open conversation beside them,
// where each recommendation arrives as its own paragraphs, a message at a
// time, with the lines that matter marked. The list is a tablist (arrow keys,
// Home, End), the conversation its panel; on a phone the list runs across
// the top. The message box at the foot is the way to reach Ryan.
const Testimonials: React.FC = () => {
  const [sectionRef, revealed] = useReveal<HTMLElement>(0.15);
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const t = featured[active];
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

  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = featured.length - 1;
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
    setActive(keys[event.key]);
    tabs.current[keys[event.key]]?.focus();
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`testimonials testimonials--concise ink-ground${revealed ? ' testimonials--revealed' : ''}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials__container">
        <SectionBadge icon={<QuoteIcon />} label="Peer recommendations" index="04" />
        <div className="testimonials__nav">
          <h2 id="testimonials-heading" className="testimonials__lede">From the people I build with</h2>
        </div>

        <div className="testimonials__app">
          <div className="testimonials__people">
            <span className="testimonials__people-head" id="testimonials-people">Direct messages</span>
            <div className="testimonials__list" role="tablist" aria-orientation={across ? 'horizontal' : 'vertical'} aria-labelledby="testimonials-people">
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
                  className="testimonials__person"
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => onKey(event, i)}
                >
                  <span className="testimonials__avatar" aria-hidden="true">{initials(p.name)}</span>
                  <span className="testimonials__person-text">
                    <span className="testimonials__person-top">
                      <span className="testimonials__person-name">{p.name}</span>
                      <span className="testimonials__person-first" aria-hidden="true">{shortName(p.name)}</span>
                      <span className="testimonials__year" aria-hidden="true">{p.year}</span>
                    </span>
                    {/* The thread's through-line, the way the old cards named each
                        recommendation's core value: Ryan's own label, so the
                        quotes themselves stay verbatim. Desktop only. */}
                    <span className="testimonials__preview" aria-hidden="true">{p.title}</span>
                  </span>
                </button>
              ))}
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
            {/* Every thread is drawn once more in the same cell, unseen and
                inert, so the cell is always as tall as the longest one and the
                window holds its height from person to person on desktop. */}
            <div className="testimonials__slot">
              {featured.map((p) => <Thread key={p.name} t={p} sizer />)}
              <Thread key={t.name} t={t} />
            </div>
            {/* Drawn as a message box, but it's a link: it says what it does */}
            <a href={EMAIL_HREF} className="testimonials__composer" aria-label="Email Ryan about your team">
              <span className="testimonials__composer-hint" aria-hidden="true">Message Ryan about your team…</span>
              <span className="testimonials__send">Get in touch</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
