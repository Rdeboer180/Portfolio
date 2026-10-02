import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import UserIcon from './icons/UserIcon';
import { useHighlightSweep } from '../hooks/useHighlightSweep';
import { useReveal } from '../hooks/useReveal';

// Dates follow the résumé and project histories; early roles are Ryan's account.
const progression = [
  { date: 'By 2013', title: 'Craft before the title.', body: 'Four-plus design jobs before and during college grounded me in Adobe Creative Suite and visual craft. At Kendall College of Art and Design, I earned a bachelor’s degree majoring in Visual Communications, with a minor and curriculum focus on UX and front-end development.' },
  { date: '2014', title: 'Into the browser.', body: 'Joining Tire Rack immersed me in web design. Questions, annual conferences, and hands-on HTML/CSS work brought graphic craft closer to UX, UI, and front-end engineering.' },
  { date: '2021', title: 'A wider responsibility.', body: 'Promoted to Senior Web Designer, I took on broader product, UX, systems, and implementation work. The responsibility grew from making the page to helping the team build consistently.' },
  { date: '2022', title: 'Collaboration and Leadership', body: 'Co-founded and led an internal professional development program serving approximately 90 digital team members, creating structured learning opportunities across technical, product, and leadership disciplines.' },
  { date: '2023–2024', title: 'One shared foundation.', body: 'For WheelRack, I built the first token and component library and redesigned the dealer journey. Figma and Tokens Studio connected to Storybook and a React build owned by engineering.', href: '/work/wheelrack/', link: 'The WheelRack system' },
  { date: '2025', title: 'Curiosity became working software.', body: 'I began exploring AI tools, then building products I wanted to use. Owning the working result pushed me further into behavior, testing, and the decisions beyond the canvas.' },
  { date: '2026', title: 'Make the whole team stronger.', body: 'I’m building design and UX standards, Figma plugins, and reusable agent skills. Internal tools reduce repeated setup, data entry, crop reviews, and checks for component drift.', href: '/work/design-enablement/', link: 'The tools in daily use' },
];

const CareerMilestone: React.FC<{ step: typeof progression[number] }> = ({ step }) => {
  const [ref, visible] = useReveal<HTMLLIElement>(0.15);
  return (
    <li ref={ref} className={`career-timeline__step${visible ? ' is-visible' : ''}`}>
      <span className="career-timeline__rail" aria-hidden="true" />
      <span className="career-timeline__marker" aria-hidden="true" />
      <span className="career-timeline__date">{step.date}</span>
      <h4 className="career-timeline__title">{step.title}</h4>
      <div className="career-timeline__detail">
        <p>{step.body}</p>
        {step.href && <Link to={step.href} className="about__read-more">{step.link} →</Link>}
      </div>
    </li>
  );
};

const About: React.FC = () => {
  const [signatureRef, signatureVisible] = useReveal<HTMLHeadingElement>(0.3);
  const introRef = useHighlightSweep<HTMLDivElement>({
    selector: '.animated-bold',
    activeClass: 'animated-bold--active',
    settledClass: 'animated-bold--settled',
    settleOffset: 850,
    cycleTime: 1900,
    threshold: 0.15,
  });

  return (
    <section id="about" className="about about--integrated" aria-labelledby="about-differentiator-title">
      <div className="about__differentiator" ref={introRef}>
        <div className="about__container">
          <SectionBadge icon={<UserIcon />} label="Why me?" index="01" />
          <div className="about__differentiator-grid">
            <h2 id="about-differentiator-title" ref={signatureRef} className={`about__signature${signatureVisible ? ' is-visible' : ''}`}>
              {['Curiosity.', 'Care.', 'Collaboration.'].map((word, index) => (
                <React.Fragment key={word}><span className="reveal-mask"><span className="reveal-mask__inner" style={{ '--reveal-delay': `${120 + index * 100}ms` } as React.CSSProperties}>{word}</span></span>{' '}</React.Fragment>
              ))}
              <svg className="about__signature-underline" viewBox="0 0 320 16" fill="none" aria-hidden="true"><path className="reveal-draw" pathLength={1} style={{ '--reveal-delay': '960ms' } as React.CSSProperties} d="M4 10 C 80 3, 220 3, 316 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
            </h2>
            <div className="about__differentiator-copy">
              <p className="about__body">Visual craft and design systems are my foundation. Curiosity takes me into unfamiliar problems and building products of my own. <Link to="/talent-tree/" className="about__inline-link">My Custom Built Designer Forge</Link> maps 16 years of growth—where I’ve invested my time, sharpened my skills, and developed the strategic perspective I bring to product design.</p>
              <p className="about__body">Care means making good decisions repeatable through components, documentation, and attention to detail. <span className="animated-bold">Relationships are central to my work.</span> When communication breaks down, design and implementation drift. <a href="#testimonials" className="about__inline-link">The people I build with</a> can speak to how I help keep them connected.</p>
              <p className="about__body">A system grows with its team. I want people to understand the decisions, challenge them, and help shape what comes next.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="about__background">
        <div className="about__container">
          <div className="about__timeline-heading">
            <h3 className="about__title">The craft came first.<br />The responsibility kept growing.</h3>
            <p className="about__body">Each step brought me closer to the product, the implementation, and the people building it.</p>
          </div>
          <ol className="career-timeline" aria-label="Career progression">
            {progression.map((step) => <CareerMilestone key={step.date} step={step} />)}
          </ol>
          <p className="about__body about__timeline-closing">Alongside the team work, <Link to="/work/playdraft/" className="about__inline-link">PlayDraft</Link> and <Link to="/work/loopstack/" className="about__inline-link">LoopStack</Link> keep me close to the tradeoffs, edge cases, and maintenance decisions that only appear in a working product.</p>
          <div className="about__cta-links">
            <Link to="/about" className="about__read-more">The fuller story behind the work →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
