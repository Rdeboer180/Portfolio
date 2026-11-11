import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';

// Got questions? as five figures (canvas "Got questions: four takes", F2,
// 10 Nov 2026). The questions a hiring manager may still have after the
// homepage (role, place, code, AI; 11 Nov 2026) and the personal one, each
// answered at a glance by a small drawing and a two- or three-word verdict; picking one
// frames it, as a selected object on the canvas, and its full answer reads
// in the one line below. The work questions sit under one rail, the
// personal one under its own, because it is a different kind of answer.

type Figure = {
  verdict: string;
  question: string;
  group: 'work' | 'life';
  drawing: React.ReactNode;
  answer: React.ReactNode;
};

const Mono: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <text x={x} y={y} className="faq-fig__label">{children}</text>
);

const FIGURES: Figure[] = [
  {
    verdict: 'Design + build.',
    question: 'What kind of role are you looking for?',
    group: 'work',
    drawing: (
      <>
        <rect x="0.5" y="28.5" width="7" height="7" className="faq-fig__ink-fill" />
        <path d="M8 32 H30 C44 32 42 10 56 10 H70 M30 32 H70 M30 32 C44 32 42 54 56 54 H70" className="faq-fig__steel" />
        <Mono x={78} y={14}>product</Mono>
        <Mono x={78} y={36}>systems</Mono>
        <Mono x={78} y={58}>code</Mono>
      </>
    ),
    answer: (
      <p>
        Senior product design or design engineering, where design and the build sit close together: design
        systems, products, and the AI tooling around them.
      </p>
    ),
  },
  {
    verdict: 'Remote, Eastern time.',
    question: 'Where are you, and do you work remote?',
    group: 'work',
    drawing: (
      <>
        <path d="M14 46 C6 36 4 31 4 25 a10 10 0 0 1 20 0 c0 6 -2 11 -10 21 Z" className="faq-fig__ink" />
        <circle cx="14" cy="25" r="3" className="faq-fig__ink-fill" />
        <path d="M14 54 H176" className="faq-fig__faint faq-fig__hair" />
        <Mono x={36} y={22}>South Bend, IN</Mono>
        <Mono x={36} y={40}>ET · US remote</Mono>
      </>
    ),
    answer: (
      <p>South Bend, Indiana, on Eastern time. Remote anywhere in the US, from a dedicated home studio.</p>
    ),
  },
  {
    verdict: 'Yes, for 12 years.',
    question: 'Do you write production code?',
    group: 'work',
    drawing: (
      <>
        <path d="M14 14 L4 24 L14 34 M34 14 L44 24 L34 34 M27 10 L21 38" className="faq-fig__ink" />
        <circle cx="67" cy="16" r="3" className="faq-fig__ink" />
        <circle cx="67" cy="40" r="3" className="faq-fig__ink" />
        <circle cx="79" cy="16" r="3" className="faq-fig__ink" />
        <path d="M67 19 V37 M79 19 C79 30 72 28 69.5 37.5" className="faq-fig__ink" />
        <Mono x={92} y={22}>PRs</Mono>
        <Mono x={92} y={40}>gists</Mono>
        <path d="M0 56 H176" className="faq-fig__faint faq-fig__hair" />
      </>
    ),
    answer: (
      <p>
        Yes. For twelve-plus years at Tire Rack I&rsquo;ve written front-end code, HTML, CSS and AEM components,
        and shipped it to production myself: on our team, we&rsquo;re responsible for shipping our own pull
        requests. I know what good code looks like, and I hand engineering gists along the way. For the last two-plus years I&rsquo;ve also worked directly
        with our React developer, building <Link to="/work/wheelrack/">Figma systems with code layers and
        annotations</Link> for every state, prop and variant. <Link to="/work/playdraft/">PlayDraft</Link> I designed
        and built on my own in React Native, and launched on the App Store.
      </p>
    ),
  },
  {
    verdict: 'A starting point.',
    question: 'How do you use AI in your design work?',
    group: 'work',
    drawing: (
      <>
        <rect x="0.5" y="16.5" width="56" height="34" className="faq-fig__steel faq-fig__dash" />
        <Mono x={4} y={62}>draft</Mono>
        <path d="M64 34 H92 M86 28 L92 34 L86 40" className="faq-fig__ink" />
        <rect x="100.5" y="8.5" width="66" height="42" className="faq-fig__ink" />
        <rect x="97.5" y="5.5" width="6" height="6" className="faq-fig__handle" />
        <rect x="163.5" y="5.5" width="6" height="6" className="faq-fig__handle" />
        <rect x="97.5" y="47.5" width="6" height="6" className="faq-fig__handle" />
        <rect x="163.5" y="47.5" width="6" height="6" className="faq-fig__handle" />
        <Mono x={104} y={62}>better</Mono>
      </>
    ),
    answer: (
      <p>
        AI made the first draft cheap. It&rsquo;s a good starting point and a poor finish line, so the judgment
        stays with me. I build <Link to="/work/design-enablement/">agentic tools and skills</Link> that take
        repetitive work off my team, and{' '}
        <Link to="/design-system">my design system</Link> gives agents the same rules people use, read through an MCP
        server. The question I bring to every draft:{' '}
        <Link to="/notes/visual-problem-solver/">what does better look like?</Link>
      </p>
    ),
  },
  {
    verdict: 'People first.',
    question: 'What drives you outside of design?',
    group: 'life',
    drawing: (
      <>
        <path d="M0 38 H176" className="faq-fig__faint faq-fig__hair" />
        <circle cx="9" cy="28" r="8" className="faq-fig__ink faq-fig__paper" />
        <circle cx="28" cy="28" r="8" className="faq-fig__ink faq-fig__paper" />
        <circle cx="43.5" cy="31.5" r="4.5" className="faq-fig__ink faq-fig__paper" />
        <circle cx="55.5" cy="31.5" r="4.5" className="faq-fig__ink faq-fig__paper" />
        <rect x="80.5" y="30.5" width="6" height="6" className="faq-fig__handle" />
        <rect x="142.5" y="30.5" width="6" height="6" className="faq-fig__handle" />
        <Mono x={0} y={54}>people</Mono>
        <Mono x={73} y={54}>building</Mono>
        <Mono x={137} y={54}>sundays</Mono>
      </>
    ),
    answer: (
      <>
        <p>
          I&rsquo;m a husband and father first, married to my high school sweetheart, Stephanie, with two kids at the
          center of our lives. Downtime means family, longtime friends, national park trips, Survivor nights, and a
          fantasy football league with team mascots I designed.
        </p>
        <p>
          I like building things and improving them over time. My custom Loop setup for managing Type 1 diabetes
          inspired <Link to="/work/loopstack/">LoopStack</Link>. At Tire Rack, I helped found MPG to connect teams
          through shared learning. I value honest feedback, personal connections, and am always looking to learn from
          the people around me. My mentor at Tire Rack has led with the mantra{' '}
          <Link to="/notes/visual-problem-solver/">&ldquo;What does better look like?&rdquo;</Link> and I have taken
          that to heart both professionally and personally.
        </p>
        <p><Link to="/about">More about me</Link></p>
      </>
    ),
  },
];

const Rail: React.FC<{ label: string }> = ({ label }) => (
  <div className="faq-fig__rail" aria-hidden="true">
    <span className="faq-fig__rail-label">{label}</span>
    <span className="faq-fig__rail-handle" />
    <span className="faq-fig__rail-line" />
    <span className="faq-fig__rail-handle" />
  </div>
);

const FAQ: React.FC = () => {
  const [open, setOpen] = useState(0);
  const base = useId();
  const answerId = `${base}-answer`;
  const tile = (f: Figure, i: number) => (
    <li key={f.verdict} className={`faq-fig__item${open === i ? ' is-open' : ''}`}>
      <button
        type="button"
        className="faq-fig__tile"
        aria-expanded={open === i}
        aria-controls={answerId}
        onClick={() => setOpen(i)}
      >
        <span className="faq-fig__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <svg className="faq-fig__drawing" viewBox="0 0 176 64" fill="none" aria-hidden="true" focusable="false">{f.drawing}</svg>
        <span className="faq-fig__verdict">{f.verdict}</span>
        <span className="faq-fig__question">{f.question}</span>
      </button>
      <span className="faq-fig__frame" aria-hidden="true"><i /><i /><i /><i /></span>
    </li>
  );
  const current = FIGURES[open];
  return (
    <section id="faq" className="faq faq--figures" aria-labelledby="faq-title">
      <div className="faq__container">
        <h2 id="faq-title" className="faq__title">
          Got questions?
        </h2>
        <div className="faq-fig__groups">
          <div className="faq-fig__group faq-fig__group--work">
            <Rail label="Work" />
            <ul className="faq-fig__tiles">{FIGURES.map((f, i) => (f.group === 'work' ? tile(f, i) : null))}</ul>
          </div>
          <div className="faq-fig__group faq-fig__group--life">
            <Rail label="Outside design" />
            <ul className="faq-fig__tiles">{FIGURES.map((f, i) => (f.group === 'life' ? tile(f, i) : null))}</ul>
          </div>
        </div>
        <div id={answerId} className="faq-fig__answer" role="region" aria-live="polite" aria-label={current.question}>
          <span className="faq-fig__count" aria-hidden="true">{String(open + 1).padStart(2, '0')} / {String(FIGURES.length).padStart(2, '0')}</span>
          <div className="faq-fig__text">{current.answer}</div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
