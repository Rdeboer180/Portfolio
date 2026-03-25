import React from 'react';
import SectionBadge from './SectionBadge';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* Outer circle ring */}
    <path d="M12,1C5.93,1,1,5.93,1,12s4.93,11,11,11,11-4.93,11-11S18.07,1,12,1ZM12,21.5c-5.25,0-9.5-4.25-9.5-9.5S6.75,2.5,12,2.5s9.5,4.25,9.5,9.5-4.25,9.5-9.5,9.5Z" />
    {/* Inner filled circle */}
    <circle cx="12" cy="12" r="8.8" />
    {/* Pen nib body — negative space */}
    <path d="M12,4.2l-3.8,9.6c-.3.7-.1,1.2.1,1.6.4.7,1.2,1.3,2.2,1.7h3c1-.4,1.8-1,2.2-1.7.2-.4.4-.9.1-1.6L12,4.2Z" fill="#fff" />
    {/* Nib slit line */}
    <line x1="12" y1="4.8" x2="12" y2="11.5" stroke="#fff" strokeWidth="0.5" />
    {/* Nib ink hole */}
    <circle cx="12" cy="12" r="0.7" />
    {/* Nib base rectangle */}
    <rect x="10.2" y="17.3" width="3.6" height="1.4" rx="0.2" fill="#fff" />
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
            <h2 className="about__title">Who I Am — and Why I'm Built for This Moment</h2>
            <p className="about__body">
              I'm a systems thinker first, designer second. Sixteen years in, my edge has never been just taste — it's been the ability to map a problem before touching a tool, build with the user and the data in mind, and actually understand the codebase my work lives in.
            </p>
            <p className="about__body">
             I'm a systems thinker first, designer second. Sixteen years in, my edge has never been just taste — it's been the ability to map a problem before touching a tool, build with the user and the data in mind, and actually understand the codebase my work lives in.

I came in fresh out of college into a design role that leaned on my strengths, but quickly exposed the gaps. I understood design better than most, but conversations around HTML tables, CSS variables, and flexbox often felt like a different language. I knew I wasn't at the level of the people around me yet. So I closed that gap the only way I knew how—by putting in the reps. Conferences, certifications, side projects, asking questions (and then asking more), and constantly refining. That process built something most designers don't have: the instinct to recognize when something is off, and the technical depth to actually fix it.
            </p>
            <p className="about__body">
              That background makes me feel unusually prepared for where the industry is right now. AI is generating code everywhere — its getting better, but its also making mistakes everywhere. The real skill isn't prompting. It's knowing how to build the guardrails before you start, review what comes out, and refine it against your brand standards, accessibility guidelines, and the actual framework your site runs on. That's what I do.
              </p>
            <p className="about__body">
              There’s more to who I am than what fits on a page—ask anything about my work, process, or what drives me.{' '}
              <a href="#/about" className="about__read-more">Dig Deeper with a few prompts →</a>
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
