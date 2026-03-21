import React from 'react';
import SectionBadge from './SectionBadge';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const stats = [
  { value: '16+', label: 'Years of Designing professionally' },
  { value: '500+', label: 'of Projects delivered' },
  { value: '4', label: 'Retail brands supported' },
  { value: '50+', label: 'Design system components shipped' },
];

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__content">
          <div className="about__text">
            <SectionBadge icon={<UserIcon />} label="About Me" />
            <h2 className="about__title">Bridging Design And Engineering Since Highschool</h2>
            <p className="about__body">
              I'm a Front-End Developer and UX Engineer with 16+ years of professional experience — and a design obsession that started well before that. I built my foundation intentionally: focused every high school elective on visual communication, interned at a local broadcast station, took early college courses while still in high school, and entered Kendall College of Art and Design's advanced track, where I majored in Graphic Design and minored in Web Animation. Summers in college meant real client work — Notre Dame, the South Bend Tribune, a fitness startup — before moving into product design full-time.
            </p>
            <p className="about__body">
              That path led to 10+ years at Tire Rack, where my role grew well beyond design. I've collaborated closely with UX teams, SEO strategists, and analytics leads — running A/B tests, digging into performance data, and learning enough about each discipline to contribute meaningfully rather than just hand work off. I've built design systems from the ground up, led UX redesigns for e-commerce experiences serving millions of users, and developed deep proficiency in HTML, SCSS/SASS with BEM, and AEM. When the company moved to Figma in 2022, I pursued full certification and took ownership of building scalable token-based design systems with Token Studio — working directly with React developers to ship those systems into production.
            </p>
            <p className="about__body">
              I'm as comfortable in the codebase as I am in the design file, and I stay current — right now that means getting the most out of AI-assisted tools like Claude and FigmaMake to move faster without cutting corners.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="about__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="about__stat">
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
