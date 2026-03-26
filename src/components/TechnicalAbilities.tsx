import React from 'react';
import SectionBadge from './SectionBadge';

const CodeIcon = () => (
  <svg viewBox="0 0 22 26.7" fill="currentColor" stroke="none">
    {/* Monitor body */}
    <path d="M13.8,18.42c0-2.59,2.11-4.7,4.7-4.7,1.39,0,2.63.62,3.49,1.59V2.8c0-1.55-1.26-2.8-2.8-2.8H2.8C1.26,0,0,1.26,0,2.8v16.39c0,1.55,1.26,2.8,2.8,2.8h12.68c-1.02-.86-1.68-2.13-1.68-3.57Z" />
    {/* Code chevrons */}
    <path d="M6.72,10.13c-.21.14-.45.25-.71.33.27.08.5.19.71.33l1.75,1.28c.11.07.19.16.24.27.05.11.07.23.07.35v1.79l-4.98-3.52v-1.01l4.98-3.52v1.79c0,.13-.02.25-.07.35-.05.11-.13.2-.24.28l-1.75,1.27Z" fill="#fff" />
    <path d="M17.85,9.97v1.01l-4.98,3.52v-1.79c0-.13.02-.25.07-.35.05-.11.13-.2.24-.27l1.75-1.28c.21-.14.45-.25.71-.33-.27-.08-.5-.19-.71-.33l-1.75-1.27c-.11-.08-.19-.17-.24-.28-.05-.11-.07-.23-.07-.35v-1.79l4.98,3.52Z" fill="#fff" />
    {/* Certificate star badge */}
    <path d="M18.5,14.92c-1.93,0-3.5,1.57-3.5,3.5s1.57,3.5,3.5,3.5,3.5-1.57,3.5-3.5-1.57-3.5-3.5-3.5ZM19.81,20.45l-1.31-.69-1.31.69.25-1.46-1.06-1.04,1.47-.21.66-1.33.66,1.33,1.47.21-1.06,1.04.25,1.46Z" opacity="0.75" />
    {/* Badge ribbon */}
    <path d="M21,22.73v3.77c0,.17-.2.27-.33.16l-2.17-1.73-2.17,1.73c-.13.11-.33.01-.33-.16v-3.77c.74.43,1.58.7,2.5.7s1.76-.26,2.5-.7Z" opacity="0.6" />
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
    <section id="technical" className="technical">
      <div className="technical__container">
        <div className="technical__header">
          <SectionBadge icon={<CodeIcon />} label="Technical" />
          <h2 className="technical__title">Tools &amp; Technologies</h2>
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
