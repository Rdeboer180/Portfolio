import React from 'react';
import SectionBadge from './SectionBadge';

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

interface Skill {
  name: string;
  proficiency?: boolean;
}

const abilities: { category: string; skills: Skill[] }[] = [
  {
    category: 'Design & Prototyping',
    skills: [
      { name: 'Figma', proficiency: true },
      { name: 'Adobe Illustrator', proficiency: true },
      { name: 'Adobe Photoshop' },
      { name: 'Adobe InDesign' },
      { name: 'Token Studio' },
      { name: 'FigmaMake' },
    ],
  },
  {
    category: 'Front-End Development',
    skills: [
      { name: 'SCSS/SASS & BEM', proficiency: true },
      { name: 'AEM', proficiency: true },
      { name: 'HTML5 & CSS3' },
      { name: 'Responsive Design' },
      { name: 'WordPress' },
      { name: 'Visual Studio Code' },
      { name: 'Git' },
    ],
  },
  {
    category: 'Design Systems',
    skills: [
      { name: 'Atomic Design', proficiency: true },
      { name: 'Component Libraries' },
      { name: 'Design Tokens' },
      { name: 'Figma Variables & Styles' },
      { name: 'Token Studio' },
      { name: 'Storybook' },
      { name: 'Documentation & Governance' },
    ],
  },
  {
    category: 'UX & Research',
    skills: [
      { name: 'High-Fidelity Prototyping', proficiency: true },
      { name: 'Wireframing' },
      { name: 'UX Specs & Annotation' },
      { name: 'A/B Testing' },
      { name: 'Adobe Target' },
    ],
  },
  {
    category: 'SEO & Accessibility',
    skills: [
      { name: 'SEO-Informed Design', proficiency: true },
      { name: 'WCAG Accessibility' },
      { name: 'Performance Analysis' },
      { name: 'Data-Informed Design' },
    ],
  },
  {
    category: 'AI-Assisted Workflow',
    skills: [
      { name: 'Claude' },
      { name: 'ChatGPT' },
      { name: 'FigmaMake' },
    ],
  },
];

const TechnicalAbilities: React.FC = () => {
  return (
    <section className="technical">
      <div className="technical__container">
        <div className="technical__header">
          <SectionBadge icon={<CodeIcon />} label="Technical" />
          <h2 className="technical__title">Tools and technologies</h2>
          <p className="technical__subtitle">
            A toolkit built over 16+ years of hands-on work across design, front-end development, and systems thinking.
          </p>
        </div>

        <div className="technical__grid">
          {abilities.map(({ category, skills }) => (
            <div key={category} className="technical__column">
              <h3 className="technical__column-title">{category}</h3>
              <ul className="technical__list">
                {skills.map((skill) => (
                  <li key={skill.name} className={`technical__item${skill.proficiency ? ' technical__item--proficient' : ''}`}>
                    <span className="technical__bullet">&#9656;</span>
                    {skill.name}
                    {skill.proficiency && <span className="technical__proficiency">&#10038;</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="technical__legend">
          <span className="technical__proficiency">&#10038;</span>
          <span className="technical__legend-text">Core proficiency</span>
        </div>
      </div>
    </section>
  );
};

export default TechnicalAbilities;
