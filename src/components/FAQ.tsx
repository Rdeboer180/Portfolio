import React, { useState } from 'react';

const faqItems: { question: string; answer: string | React.ReactNode }[] = [
  {
    question: 'Do you work with developers or hand off files?',
    answer: 'Both. I design with engineering handoff in mind \u2014 tokens, specs, and component documentation are built into my process. On many projects I also write production front-end code (HTML, CSS/SCSS, React), so the handoff is often the code itself.',
  },
  {
    question: 'Can you work within an existing design system?',
    answer: 'Absolutely. I\u2019ve contributed to and extended large-scale design systems at enterprise companies. I\u2019m comfortable working within existing token structures, component libraries, and governance models \u2014 or building them from scratch if none exist.',
  },
  {
    question: 'How do you handle projects that need both brand and UX work?',
    answer: 'I treat brand and UX as the same problem at different altitudes. The brand system establishes the visual language \u2014 color, type, tone \u2014 and the UX work applies it to real user flows. I scope both together so the system stays coherent from identity through interaction.',
  },
  {
    question: 'Do you take on freelance or contract work?',
    answer: 'Not at this current time but please reach out if you have an idea and id love to talk.',
  },
{
    question: 'What drives you outside of design?',
    answer: (
      <>
        <p>People first. I married my high school sweetheart Stephanie — we've now spent more than half our lives together — and our two kids are the center of everything. Weekends usually mean the park, the zoo, or wherever the next national park road trip takes us.</p>
        <p>Outside of family, a lot of what I do for fun still involves building things. I manage my Type 1 diabetes using a custom-coded branch of the Loop app — a closed-loop insulin delivery system I've configured and maintained myself. It's equal parts health management and engineering hobby, and it's given me a deep appreciation for how thoughtful software design can have real, daily impact on someone's quality of life.</p>
        <p>Football Sundays are sacred. I've run a dynasty fantasy football league — the Grandville Gremlins — for about a decade, and every team has a custom mascot and logo I designed. It keeps a tight group of high school and college friends connected year-round. And like most people, I unwind with good TV and film. Always watching something.</p>
      </>
    ),
  },
  {
    question: 'How was my portfolio built?',
    answer: (
      <>
        <p>This portfolio was built through an iterative design-to-code workflow combining Figma, Claude AI, and hands-on front-end development. I started by establishing a full design system in Figma defining color tokens, typography scales, spacing values, and component patterns then used that system as the single source of truth while building out each section in React and SCSS. You can explore the <a href="#/design-system">design system here</a>.</p>
        <p>The process was genuinely collaborative: I worked back and forth between Figma mockups and live code, using Claude as a development partner to scaffold components, refine styling logic, audit token consistency, and generate a complete Figma-ready specification from the finished codebase. Every section went through multiple rounds of visual review, brand alignment checks, and responsive refinement \u2014 the same rigor I apply to client work, applied to my own.</p>
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
          <h2 className="faq__title">Common questions</h2>
          <p className="faq__intro">
            Answers to the things clients and collaborators usually ask before we start working together.
          </p>
        </div>

        <div className="faq__right">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
            >
              <button className="faq__question" onClick={() => toggle(i)}>
                <span className="faq__question-text">{item.question}</span>
                <span className="faq__toggle">
                  {openIndex === i ? '\u00d7' : '+'}
                </span>
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
