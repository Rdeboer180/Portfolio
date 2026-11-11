import React from 'react';
import { Link } from 'react-router-dom';

// Why me, back on the homepage as one short section (canvas "Why me: five
// takes", B4a, 11 Nov 2026). The three values as a type specimen on one line,
// at the page's h2 size and ink like every other title, on steel cap-height
// and baseline guides; under them, the AI point from the
// "what does better look like?" note, and each value proved by the work.
const PROOF: { value: string; line: string; to: string; link: string }[] = [
  {
    value: 'Craft',
    line: 'I partner with engineers on our CMS framework.',
    to: '/work/aem-component-system/',
    link: 'AEM Component System',
  },
  {
    value: 'Care',
    line: 'I build internal agentic tools and skills to reduce repetitive work for my team and the teams we work with.',
    to: '/work/design-enablement/',
    link: 'Tools that scale design',
  },
  {
    value: 'Curiosity',
    line: 'My plans for agentic AEM authoring build on that same goal.',
    to: '/notes/aem-meeting-authors-where-they-work/',
    link: 'Read the plan',
  },
];

const WhyMe: React.FC = () => (
  <section id="about" className="why-me ink-ground" aria-labelledby="why-me-title">
    <div className="why-me__container">
      <h2 id="why-me-title" className="why-me__words">
        {/* the section's one orange: the full stops, each value set down like a type specimen */}
        <span>Craft<span className="why-me__stop">.</span></span>{' '}
        <span>Care<span className="why-me__stop">.</span></span>{' '}
        <span>Curiosity<span className="why-me__stop">.</span></span>
        <span className="why-me__guide why-me__guide--cap" aria-hidden="true">cap height</span>
        <span className="why-me__guide why-me__guide--base" aria-hidden="true">baseline</span>
      </h2>

      <div className="why-me__grid">
        <div className="why-me__lead">
          <p className="why-me__ai">AI made the first draft cheap. It&rsquo;s a good starting point and a poor finish line.</p>
          <p className="why-me__mentor">
            My mentor asks &ldquo;what does better look like?&rdquo; I take that question to everything I build.{' '}
            <Link to="/notes/visual-problem-solver/" className="why-me__link">Read the note <span aria-hidden="true">→</span></Link>
          </p>
          {/* The way to the About page, as a secondary button that says whose page it is:
              Ryan's face (the hero's photo, already loaded) and "More about me". */}
          <Link to="/about" className="btn btn--secondary btn--md why-me__more">
            <img className="why-me__more-face" src="/images/hero/ryan-deboer-2026-800.webp" alt="" width={24} height={24} loading="lazy" decoding="async" />
            More about me <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="why-me__proof" aria-label="Where it shows">
          {PROOF.map((p) => (
            <li key={p.value} className="why-me__row">
              <span className="why-me__value">{p.value}</span>
              <span className="why-me__line">
                {p.line}{' '}
                <Link to={p.to} className="why-me__link">{p.link} <span aria-hidden="true">→</span></Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default WhyMe;
