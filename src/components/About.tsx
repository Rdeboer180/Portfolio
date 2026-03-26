import React from 'react';
import SectionBadge from './SectionBadge';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* Outer circle ring */}
    <path d="M12,1C5.93,1,1,5.93,1,12s4.93,11,11,11,11-4.93,11-11S18.07,1,12,1ZM12,21.5c-5.25,0-9.5-4.25-9.5-9.5S6.75,2.5,12,2.5s9.5,4.25,9.5,9.5-4.25,9.5-9.5,9.5Z" />
    {/* Inner filled circle */}
    <circle cx="12" cy="12" r="8.8" />
    {/* Pen nib body &mdash; negative space */}
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
  { value: '16+', label: 'Years designing professionally' },
  { value: '500+', label: 'Projects delivered' },
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
            <h2 className="about__title">Who I Am &mdash; and Why I'm Built for This Moment</h2>
            <p className="about__body">
              I'm a systems thinker first, designer second. Sixteen years in, my edge has never been just taste&mdash;it's been the ability to define the problem before touching a tool, design with real constraints in mind, and understand the codebase my work lives in.
            </p>
            <p className="about__body">
              Early in my career, I was hired for my design instincts, visual craft, and strategic thinking. But I knew that to become the kind of designer I wanted to be, I needed deeper technical fluency. So I closed that gap the only way I knew how: by putting in the reps. Through years of asking questions, self-exploration, certification courses, front-end conferences, and constant refinement, I built the technical depth to bring those ideas to life online. At Tire Rack, that meant owning the AEM template layer end-to-end&mdash;building and maintaining component templates, writing the SCSS that powered them, and documenting patterns so the broader team could ship consistently without bottlenecking through me. That process sharpened one of my biggest strengths&mdash;the ability to recognize when something is off, understand why, and actually fix it.
            </p>
            <p className="about__body">
              That's exactly why I feel so well matched for where the industry is now. AI can generate interfaces and code faster than ever&mdash;but it also introduces risk. The real skill isn't prompting. It's knowing how to set constraints, evaluate what's produced, and refine it against real-world standards&mdash;performance, accessibility, brand, and system integrity. That's where I do my best work.
            </p>
            <p className="about__body">
              There's more to how I think than what fits on a page&mdash;ask anything about my work, process, or approach.{' '}
              <a href="#/about" className="about__read-more">Dig deeper &rarr;</a>
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
