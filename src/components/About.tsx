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
            <h2 className="about__title">I follow the work past the frame</h2>
              <p className="about__body">
                I&rsquo;ve spent 16+ years moving between visual craft, brand systems, front-end constraints, and production code. The tools changed, but the responsibility did not: <span className="animated-bold">know what to design, why it matters, and whether it still holds up</span> once a real team builds it and real people use it.
              </p>

              <p className="about__body">
                AI-assisted workflows let me test more directions and get to working software sooner. Personal, volunteer, and internal products have given me room to <span className="animated-bold">take ideas from the first sketch through the build</span>, including the parts that fail once they are real. <span className="animated-bold">The value I add with AI isn&rsquo;t volume</span>. It is choosing the direction, writing down the constraints, and rejecting plausible work that does not meet the bar.
              </p>

              <p className="about__body">
                The polished screen is only one artifact. I also care about the patterns, documentation, accessibility, handoff, QA, and governance that keep the idea intact after I step away. A design system has done its job when <span className="animated-bold">the team can make the next good decision without me in the room</span>.
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
