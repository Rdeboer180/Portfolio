import React, { useEffect, useRef } from 'react';
import SectionBadge from './SectionBadge';

const LayersIcon = () => (
  <svg viewBox="0 0 449.81 688.24" fill="currentColor" stroke="none">
    {/* Star shape */}
    <path d="M252.1,416.74l-27.21-55.13-27.17,55.13c-1.9,3.83-5.58,6.47-9.81,7.1l-60.82,8.85,44.01,42.9c3.09,2.98,4.46,7.29,3.75,11.52l-10.41,60.56,54.42-28.59c1.89-1,3.98-1.52,6.02-1.52s4.16.52,6.06,1.52l54.42,28.59-10.41-60.56c-.71-4.24.67-8.55,3.76-11.52l44.01-42.9-60.82-8.85c-4.24-.63-7.92-3.27-9.81-7.1Z" opacity="0.35" />
    {/* Badge body with star cutout */}
    <path d="M421.1,353.59c-7.9-14.07-17.33-27.34-28.14-39.52-5.73-6.38-11.82-12.55-18.27-18.27-12.11-10.8-25.45-20.45-39.95-28.5-.29-.22-.51-.36-.8-.51-7.03-3.99-14.5-7.69-22.26-10.88-16.9-7.11-34.59-12.11-52.43-14.79-9.21-1.45-18.64-2.25-28.14-2.54-2.03-.07-4.14-.15-6.24-.15-18.34,0-36.26,2.17-53.73,6.53-11.24,2.68-22.26,6.38-33,10.88-1.38.58-2.83,1.23-4.21,1.88-6.24,2.76-12.4,5.8-18.13,8.99C44.38,306.52,0,381.87,0,463.38c0,53.88,19.07,103.41,50.76,142.2,9.57,11.67,20.3,22.41,31.98,31.91,38.79,31.69,88.25,50.76,142.13,50.76,91.66,0,170.7-55.11,205.66-133.94,5.36-11.89,9.65-24.29,12.76-37.2,4.28-17.19,6.53-35.24,6.53-53.73,0-39.09-10.23-76.8-28.72-109.79ZM334.08,457.86l-32.34,31.54,13.71,79.84c.87,4.86-1.16,9.86-5.15,12.76-2.32,1.59-4.93,2.46-7.61,2.46-2.1,0-4.21-.51-6.09-1.52l-71.72-37.64-71.64,37.64c-4.42,2.32-9.65,1.96-13.7-.94-3.99-2.9-6.02-7.9-5.22-12.76l13.78-79.84-58.01-56.49c-3.55-3.48-4.86-8.63-3.34-13.34,1.52-4.71,5.66-8.12,10.52-8.85l80.2-11.67,32.35-65.48,3.48-7.11c2.17-4.42,6.67-7.25,11.6-7.25s9.5,2.83,11.68,7.25l32.99,66.86,2.83,5.73,3.41.51,58.44,8.48,18.35,2.68c4.86.73,8.99,4.14,10.51,8.85,1.53,4.71.22,9.86-3.34,13.34l-.36.29-25.31,24.65Z" />
    {/* Top code brackets */}
    <path d="M243.15,216.82c-3.77-.29-7.62-.44-11.32-.58-2.24-.07-4.64-.07-6.96-.07-24.65,0-48.66,3.55-71.86,10.66-7.98,2.39-15.81,5.22-23.5,8.48-4.2,1.81-8.34,3.7-12.4,5.58-.44.22-.8.36-1.23.58l-1.38-3.19-37.56-87.53L18.85,15.45v-.07C15.74,8.05,21.03,0,29.01,0h39.23l.58,1.31,49.82,116.02c0,.07.07.15.07.22l13.85,32.2c2.1,4.86,6.89,7.83,11.96,7.83,1.67,0,3.48-.36,5.15-1.01,6.53-2.83,9.57-10.52,6.74-17.12l-13.92-32.41-24.15-56.13-8.55-20.01-6.24-14.58-2.97-6.89-3.99-9.43h46.19c.73,0,1.38.07,2.1.22,3.55.65,6.6,3.05,8.05,6.45l1.23,2.83,28.28,64.83h-.44l7.83,18.27,7.54,17.55,6.24,14.58,8.55,19.94,2.47,5.8,14.14,33,14.36,33.36Z" opacity="0.65" />
    <path d="M431.25,15.52l-18.71,43.15-6.82,15.66-56.13,130.6-14.21,33.21-1.45,3.34c-3.12-1.52-6.38-3.05-9.65-4.43-1.3-.58-2.61-1.16-3.99-1.74-3.34-1.38-6.67-2.75-10.08-3.99-5.59-2.03-11.24-3.92-16.9-5.51-8.12-2.39-16.25-4.28-24.51-5.73l-14.14-32.92-5.37-12.47-3.19-7.47-6.24-14.57-2.83-6.6,1.89-4.35,14.21-33.21,14.72-34.16h-.15l8.48-19.51,17.55-40.83c.15-.29.36-.51.51-.65l2.9-6.67c1.81-4.06,5.8-6.67,10.15-6.67h47.21l-.22.51-3.84,8.99-38.22,88.91-17.62,41.04c-1.52,3.56-1.3,7.47.22,10.74,1.23,2.61,3.34,4.78,6.09,6.09.15.15.36.22.51.29,1.67.65,3.41,1.01,5.15,1.01,5.07,0,9.86-2.97,11.96-7.83l17.62-41.04,37.93-88.4.22-.44,8.48-19.87h38.29c2.18,0,4.14.58,5.8,1.67,1.52.87,2.75,2.18,3.63,3.63,1.81,2.9,2.25,6.67.72,10.23Z" opacity="0.65" />
  </svg>
);

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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const highlights = section.querySelectorAll('.about__highlight');
    if (highlights.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sweepDuration = 600;
            const holdDuration = 400;
            const cycleTime = sweepDuration + holdDuration + 500 + 200;
            highlights.forEach((el, i) => {
              const baseDelay = i * cycleTime;
              setTimeout(() => el.classList.add('about__highlight--active'), baseDelay);
              setTimeout(() => {
                el.classList.add('about__highlight--bold');
                el.classList.remove('about__highlight--active');
              }, baseDelay + sweepDuration + holdDuration);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <div className="skills__container">
        <div className="skills__header">
          <SectionBadge icon={<LayersIcon />} label="Strengths" />
          <h2 className="skills__title">What I bring beyond the tools</h2>
          <p className="skills__subtitle">
            <span className="about__highlight">AI is changing how quickly ideas can be explored and shipped—but without strategy behind the work and the prompt, the product won’t stand out.</span> The real separation comes from designers who can think beyond the output—who know how to guide the tools, pressure test what they produce, and push the work further than expected.
          </p>
          <p className="skills__intro">
            That mindset shows up in how I approach the work day to day—across systems, collaboration, and execution.
          </p>
        </div>

        <div className="skills__grid">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="skills__card">
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
