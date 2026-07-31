import React from 'react';
import SectionBadge from './SectionBadge';
import LayersIcon from './icons/LayersIcon';
import { useHighlightSweep } from '../hooks/useHighlightSweep';
import { useReveal } from '../hooks/useReveal';

const skillCategories = [
  {
    title: 'UX & Design Practice',
    skills: ['Accessibility-First Design (WCAG)', 'SEO-Driven Design', 'Design Systems & Governance', 'A/B Testing & Experimentation', 'Systems Thinking'],
  },
  {
    title: 'AI & Innovation',
    skills: ['AI-Augmented Design Workflows', 'Emerging Tool Adoption', 'Design Process Optimization'],
  },
  {
    title: 'Collaboration',
    skills: ['Engineering Partnership', 'Product Team Integration', 'Cross-Functional Facilitation', 'Framework & Template Development'],
  },
  {
    title: 'Communication',
    skills: ['Stakeholder Presentation & Storytelling', 'Written Documentation', 'Stakeholder Management'],
  },
  {
    title: 'Leadership & Strategy',
    skills: ['Design Leadership', 'Strategic Planning', 'Mentoring & Design Advocacy', 'Process Documentation', 'Stakeholder Alignment'],
  },
];

const Skills: React.FC = () => {
  // settleOffset = sweep(600) + hold(400); cycleTime adds fade(500) + gap(200).
  const sectionRef = useHighlightSweep<HTMLElement>({
    selector: '.about__highlight',
    activeClass: 'about__highlight--active',
    settledClass: 'about__highlight--bold',
    settleOffset: 1000,
    cycleTime: 1700,
    threshold: 0.3,
  });

  const [gridRef, gridVisible] = useReveal<HTMLDivElement>();

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="skills__container">
        <div className="skills__header">
          <SectionBadge icon={<LayersIcon />} label="Strengths" index="03" />
          <h2 className="skills__title">What I bring beyond the tools</h2>
          <p className="skills__subtitle">
            <span className="about__highlight">AI is changing how quickly ideas can be explored and shipped—but without strategy behind the work and the prompt, the product won’t stand out.</span> The real separation comes from designers who can think beyond the output—who know how to guide the tools, pressure test what they produce, and push the work further than expected.
          </p>
          <p className="skills__intro">
            That mindset shows up in how I approach the work day to day—across systems, collaboration, and execution.
          </p>
        </div>

        <div className={`skills__grid${gridVisible ? ' is-visible' : ''}`} ref={gridRef}>
          {skillCategories.map((cat, i) => (
            <div
              key={cat.title}
              className="skills__card"
              style={{ '--frame-delay': `${i * 60}ms` } as React.CSSProperties}
            >
              <h3 className="skills__card-title">{cat.title}</h3>
              <ul className="skills__card-list">
                {cat.skills.map((skill) => (
                  <li key={skill} className="skills__card-item">{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
