import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import UserIcon from './icons/UserIcon';
import { useHighlightSweep } from '../hooks/useHighlightSweep';

const About: React.FC = () => {
  // Brush sweeps across → brief wet hold → highlight fades while text settles to
  // bold. settleOffset = sweep(650) + wetHold(200); cycleTime adds fade(900) + gap(150).
  const sectionRef = useHighlightSweep<HTMLElement>({
    selector: '.animated-bold',
    activeClass: 'animated-bold--active',
    settledClass: 'animated-bold--settled',
    settleOffset: 850,
    cycleTime: 1900,
  });

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__container">
        <div className="about__content">
          <div className="about__text">
            <SectionBadge icon={<UserIcon />} label="About Me" index="01" />
            <h2 className="about__title">The craft keeps evolving. The process never settles.</h2>
              {/* Ryan's own copy (2026-09-11). The bolded phrases carry the
                  highlight sweep, so the emphasis he wrote and the emphasis the
                  page animates are the same claims. The one link in the bio goes
                  to the talent tree; it carries the branch glyph as a pseudo
                  element so it reads as a door, not a footnote. */}
              <p className="about__body">
                I&rsquo;m a designer at my core, proficient in front-end code, and most at home in the systems that connect the two. <span className="animated-bold">Brand and design systems have always been my specialty.</span> The rules, components, patterns, and decisions that help good work stay consistent long after it leaves my hands.
              </p>

              <p className="about__body">
                I&rsquo;ve spent 16+ years deliberately getting closer to how the work actually gets built. Visual design pulled me into HTML and CSS. Front-end constraints pushed me toward reusable systems. Figma, tokens, and Storybook gave design and engineering a shared language. Now AI is closing that gap again and letting me move from an idea through UX, system decisions, working software, QA, and refinement without seeing handoff as the finish line.
              </p>

              <p className="about__body">
                I don&rsquo;t sit still for long. I&rsquo;m always learning, building, and changing how I work. That makes me a little hard to fit into one box, but really strong across a few: <span className="animated-bold">craft, UI, systems, and technical fluency.</span> I built a <Link to="/talent-tree/" className="about__tree-link">Design Talent Tree</Link> to make that easier to see. What I&rsquo;ve mastered, where I&rsquo;m strongest, and what I&rsquo;m still leveling up.
              </p>
            <div className="about__cta-links">
              <Link to="/about" className="about__read-more">Go deeper on my approach &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
