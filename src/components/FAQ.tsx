import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE, EMAIL_HREF } from '../data/site';

const faqItems: { question: string; answer: string | React.ReactNode }[] = [
  {
    question: 'Do you work with developers or hand off files?',
    answer: 'Both. I document tokens, states, and component behavior when engineering owns the build. On projects where I write the front-end code, the handoff may be a pull request instead of a file. At Tire Rack, I helped build and document the AEM templates and production styles the team now reuses.',
  },
  {
    question: 'Can you work within an existing design system?',
    answer: (
      <p>
        Yes. I have extended existing token and component systems, and I have built them from
        scratch when the product had no shared foundation. In either case, I start by learning
        which rules are doing useful work before I propose a new one. My bar is written up here:{' '}
        <Link to="/notes/systems-that-make-better-decisions-easier">
          a good design system makes better decisions easier
        </Link>.
      </p>
    ),
  },
  {
    question: 'How do you handle projects that need both brand and UX work?',
    answer: 'I treat the identity and the interface as one system. The brand sets the visual and verbal rules; the product tests those rules against real tasks, states, and content. I scope them together when separating the work would create two different answers.',
  },
  {
    question: 'Do you take on freelance or contract work?',
    answer: (
      <p>
        I am not taking on freelance work right now. You can still <a href={EMAIL_HREF}>send me the idea</a> if
        a future fit is possible.
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
        <p>I built the site in React and SCSS from a Figma token and component foundation. The live <Link to="/design-system">design system</Link> shows the color, type, spacing, and component rules the pages actually use.</p>
        <p>Claude helped scaffold components, inspect token drift, and work through implementation problems. I chose the references, set the direction, reviewed the responsive behavior, and made the final calls. The workflow moved back and forth between Figma and the browser until the built page held up on its own.</p>
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
            The questions that usually come up before the work starts.
          </p>
        </div>

        <div className="faq__right">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
            >
              {/* h3 so the six questions are reachable by heading navigation —
                  they were bare buttons, invisible to a screen-reader's
                  heading list. */}
              <h3 className="faq__question-heading">
                <button
                  type="button"
                  className="faq__question"
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span className="faq__question-text">{item.question}</span>
                  <span className="faq__toggle" aria-hidden="true">+</span>
                </button>
              </h3>
              {/* `inert` on the collapsed panel. It was hidden with
                  max-height:0 + overflow:hidden only, which does not remove
                  anything from the a11y tree or the tab order — so five links
                  inside the closed answers stayed focusable, and keyboard
                  focus landed in a zero-height box with the ring off-screen.
                  Same pattern CandidateSnapshot already uses. */}
              <div
                className="faq__answer-wrapper"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                inert={openIndex !== i ? true : undefined}
              >
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
