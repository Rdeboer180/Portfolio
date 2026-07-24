import React from 'react';
import SectionBadge from './SectionBadge';
import UserIcon from './icons/UserIcon';
import CandidateSnapshot from './CandidateSnapshot';
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
            <SectionBadge icon={<UserIcon />} label="About Me" />
            {/* Tucked-away recruiter/AI snapshot, collapsed by default */}
            <CandidateSnapshot variant="compact" />
            <h2 className="about__title">Built For Where Design Is Heading</h2>
              <p className="about__body">
                I&rsquo;ve spent 16+ years pushing digital design through craft, brand systems, front-end constraints, and production realities. The tools have changed, but the responsibility has not: <span className="animated-bold">know what to design, why it matters, and how to make the work hold up</span> once real teams and real users touch it.
              </p>

              <p className="about__body">
                AI-assisted workflows are making exploration cheaper and faster. More people can now express ideas in higher fidelity, which makes senior design judgment more valuable, not less. Through personal and volunteer projects, I&rsquo;ve been <span className="animated-bold">expanding my ability to build full experiences end to end</span> and finding out what opens up when the old barriers around full-stack execution fall away. That shift got me closer to the whole arc of the work: shaping the idea, building the interface, testing the system, and learning from what ships. <span className="animated-bold">The value I add with AI isn&rsquo;t volume</span>. It&rsquo;s directing the work, encoding judgment, and keeping quality from slipping as output speeds up.
              </p>

              <p className="about__body">
                Part of being senior is <span className="animated-bold">adding value beyond polished screens</span>. I care about the process around the work: the patterns, documentation, governance, accessibility, handoff, QA, and team clarity that help ideas survive past the first version. Design systems, to me, aren&rsquo;t just the pixels on the page. They&rsquo;re the operating model that helps a team make better calls and ship stronger work.
              </p>
            <div className="about__cta-links">
              <a href="#/about" className="about__read-more">Go deeper on my approach &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
