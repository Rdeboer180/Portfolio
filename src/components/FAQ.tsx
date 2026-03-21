import React, { useState } from 'react';

const faqItems: { question: string; answer: string | React.ReactNode }[] = [
  {
    question: 'What types of projects do you take on?',
    answer: 'I work across brand identity, UX/UI design, design systems, and front-end development. Most of my projects involve translating complex product requirements into scalable, component-driven interfaces \u2014 whether that\u2019s a full e-commerce redesign, a design system build, or a brand-to-web project for a smaller business.',
  },
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
    answer: 'Yes. I take on freelance and contract engagements depending on scope and timing. I\u2019m open to project-based work, embedded team contracts, and advisory roles. Reach out with your timeline and I\u2019ll let you know if it\u2019s a fit.',
  },
  {
    question: 'What does your process look like from kickoff to delivery?',
    answer: 'I start with alignment \u2014 understanding the business problem, user needs, and constraints. From there I move through information architecture, wireframes, visual design, and into high-fidelity prototypes or production code. Every phase includes documented decisions and stakeholder checkpoints so nothing is a surprise at handoff.',
  },
  {
    question: 'How was this portfolio built?',
    answer: (
      <>
        <p>This portfolio was built through an iterative design-to-code workflow combining Figma, Claude AI, and hands-on front-end development. I started by establishing a full design system in Figma \u2014 defining color tokens, typography scales, spacing values, and component patterns \u2014 then used that system as the single source of truth while building out each section in React and SCSS. You can explore the <a href="#/design-system">design system here</a>.</p>
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
    <section className="faq">
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
