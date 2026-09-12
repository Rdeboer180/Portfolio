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
              {/* Cut to two paragraphs after the 2026-09-12 site audit: the
                  path into the browser, then the systems work and the products,
                  with Ryan's own specialty line kept verbatim. The bolded
                  phrases carry the highlight sweep, so the emphasis written and
                  the emphasis animated are the same claims. The one link in the
                  bio goes to the talent tree; it carries the branch glyph as a
                  pseudo element so it reads as a door, not a footnote. */}
              <p className="about__body">
                I started in graphic design and learned HTML and CSS as more of the work moved into the browser. At Tire Rack that grew into <span className="animated-bold">design systems, AEM templates, and the production styles the team now reuses</span>, built alongside engineering.
              </p>

              <p className="about__body">
                I also build my own products, PlayDraft and LoopStack, to work through the decisions that only appear once a design becomes software someone can use. <span className="animated-bold">Brand and design systems have always been my specialty.</span> Where sixteen years of points actually landed, and what I am still leveling up, is on my <Link to="/talent-tree/" className="about__tree-link">Design Talent Tree</Link>.
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
