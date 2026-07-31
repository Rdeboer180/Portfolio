import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE, EMAIL_HREF } from '../data/site';

const faqItems: { question: string; answer: string | React.ReactNode }[] = [
  {
    question: 'Do you work with developers or hand off files?',
    answer: 'Both. I design with engineering handoff in mind \u2014 tokens, specs, and component documentation are built into my process. On many projects I also write production front-end code (HTML, CSS/SCSS, React), so the handoff is often the code itself. At Tire Rack, I led the effort to build and document our AEM component templates and their styles \u2014 creating a shared pattern library that the full team could use to ship consistently.',
  },
  {
    question: 'Can you work within an existing design system?',
    answer: (
      <p>
        Absolutely. I&rsquo;ve contributed to and extended large-scale design systems at
        enterprise companies. I&rsquo;m comfortable working within existing token structures,
        component libraries, and governance models &mdash; or building them from scratch if none
        exist. My bar for that work is written up in the notes:{' '}
        <Link to="/notes/systems-that-make-better-decisions-easier">
          a good design system makes better decisions easier
        </Link>.
      </p>
    ),
  },
  {
    question: 'How do you handle projects that need both brand and UX work?',
    answer: 'I treat brand and UX as the same problem at different altitudes. The brand system establishes the visual language \u2014 color, type, tone \u2014 and the UX work applies it to real user flows. I scope both together so the system stays coherent from identity through interaction.',
  },
  {
    question: 'Do you take on freelance or contract work?',
    answer: (
      <p>
        Not at this current time, but please <a href={EMAIL_HREF}>reach out</a> if
        you have an idea &mdash; I&rsquo;d love to talk.
      </p>
    ),
  },
{
    question: 'What drives you outside of design?',
    answer: (
      <>
        <p>People first. I married my high school sweetheart Stephanie — we've now spent more than half our lives together — and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us.</p>
        <p>Outside of family, a lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app — a closed-loop insulin delivery system I've configured and maintained myself. It's equal parts health management and engineering hobby, and it eventually became a product: <Link to="/work/loopstack/">LoopStack</Link>, a pattern-review app built on my own data.</p>
        <p>Football Sundays are sacred. I've run a dynasty fantasy football league — the Grandville Gremlins — for about a decade, and every team has a custom mascot and logo I designed. It keeps a tight group of high school and college friends connected year-round. And like most people, I unwind with good TV and film. Always watching something.</p>
      </>
    ),
  },
  {
    question: 'How was this portfolio built?',
    answer: (
      <>
        <p>This portfolio was built through an iterative design-to-code workflow combining Figma, Claude AI, and hands-on front-end development. I started by establishing a full design system in Figma defining color tokens, typography scales, spacing values, and component patterns then used that system as the single source of truth while building out each section in React and SCSS. You can explore the <Link to="/design-system">design system here</Link>.</p>
        <p>The process was genuinely collaborative: I worked back and forth between Figma mockups and live code, using Claude as a development partner to scaffold components, refine styling logic, audit token consistency, and generate a complete Figma-ready specification from the finished codebase. Every section went through multiple rounds of visual review, brand alignment checks, and responsive refinement &mdash; the same rigor I apply to client work, applied to my own.</p>
        <p>The full breakdown is a note of its own: <Link to="/notes/how-this-site-works">How this site works</Link>. The workflow keeps evolving, and that thinking lands first on <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" data-li-surface="faq_build">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>.</p>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="faq__container">
        <div className="faq__left">
          <span className="faq__eyebrow">FAQ</span>
          <h2 className="faq__title">
            Got{' '}
            <svg className="faq__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.75" />
              <text x="16" y="16" className="faq__mark-glyph">?</text>
            </svg>{' '}
            questions?
          </h2>
          <p className="faq__intro">
            Here&rsquo;s what collaborators usually want to know before we start working together.
          </p>
        </div>

        <div className="faq__right">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className="faq__question-text">{item.question}</span>
                <span className="faq__toggle" aria-hidden="true">+</span>
              </button>
              <div className="faq__answer-wrapper">
                {typeof item.answer === 'string' ? (
                  <p className="faq__answer">{item.answer}</p>
                ) : (
                  <div className="faq__answer">{item.answer}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
