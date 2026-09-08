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
              {/* Ryan's own copy. Its bolded phrases carry the highlight sweep,
                  so the emphasis he wrote and the emphasis the page animates are
                  the same claims. Two em dashes in the source became colons, per
                  the site-wide sweep.

                  P1's closing sentence ("The craft keeps evolving, and I want my
                  process to evolve with it") became the h2, so it is not repeated
                  here three lines below itself. The sweep moved to the line that
                  sentence was setting up. */}
              <p className="about__body">
                I&rsquo;ve spent 16+ years designing for the web, and <span className="animated-bold">the constant through all of it has been refinement</span>. As the tools have changed, I&rsquo;ve kept expanding how I work: learning more about code, systems, product, and implementation so I can follow an idea further and make better decisions about what actually ships.
              </p>

              <p className="about__body">
                I&rsquo;m a designer at my core, proficient in front-end code, and deeply fluent in the tools and workflows that marry the two. <span className="animated-bold">But brand and design systems have always been my specialty.</span> I gravitate toward the rules underneath the interface: the tokens, components, patterns, documentation, accessibility, and governance that turn individual decisions into something a whole team can build from. Increasingly, that means making sure the system holds together <a href="#systems" className="about__inline-link">across Figma, code, tooling, and whatever comes next</a>.
              </p>

              <p className="about__body">
                AI is the newest extension of that process, not a crutch for it. I use it aggressively to explore more directions, prototype faster, test ideas, and get to working software sooner. <span className="animated-bold">But faster output doesn&rsquo;t replace taste, judgment, or responsibility for the final decision.</span> I still want to be the person asking what belongs, what needs another pass, where the system breaks, and whether what we built actually holds up in production.
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
