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
              {/* The path into the browser, the systems work and products, then
                  Ryan's ongoing learning and building practice. The bolded
                  phrases carry the highlight sweep, so the emphasis written and
                  the emphasis animated are the same claims. The one link in the
                  bio goes to the talent tree; it carries the branch glyph as a
                  pseudo element so it reads as a door, not a footnote. */}
              <p className="about__body">
                I started in visual communications and followed the work into the browser, learning HTML and CSS because I wanted to understand what happened after a design left the canvas. At Tire Rack, that grew into <span className="animated-bold">design systems, AEM templates, and reusable components</span> shaped in close partnership with engineering.
              </p>

              <p className="about__body">
                Today, I’m pushing that same curiosity further. I build my own products from the first idea through a self-governed system and into working software, creating custom tools and workflows along the way to remove repetition, protect the rules, and shorten the distance between an idea and something production-ready.
              </p>
              <p className="about__body">
                I’m still a designer at my core, and <span className="animated-bold">brand and design systems are still my specialty.</span> My toolbelt has simply expanded around them.
              </p>

              <p className="about__body">
                I try not to let what I already know become the edge of what I can do. I’m constantly exploring new ways to bring AI into how I design, build, and maintain systems. That means improving internal tools and workflows at Tire Rack while building products like PlayDraft and LoopStack outside of it. Having something real to make, test, break, refine, and maintain is how I learn best.
              </p>

              <p className="about__body">
                I mapped where fourteen professional years and earlier practice actually landed, and what I am still leveling up, in <Link to="/talent-tree/" className="about__tree-link"><strong>The Forge</strong></Link>.
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
