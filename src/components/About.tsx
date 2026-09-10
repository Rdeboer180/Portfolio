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
              {/* Ryan's own copy. The bolded phrases carry the highlight sweep,
                  so the emphasis he wrote and the emphasis the page animates are
                  the same claims. The source's one em dash became a colon, per
                  the site-wide sweep; the 8-10 en dash is a range and stays. */}
              <p className="about__body">
                I&rsquo;m a designer at my core, proficient in front-end code, and most at home in the systems that connect the two. <span className="animated-bold">Brand and design systems have always been my specialty</span>: the rules, components, patterns, and decisions that help good work hold together after it leaves my hands.
              </p>

              <p className="about__body">
                I&rsquo;ve spent 16+ years <span className="animated-bold">deliberately moving closer to how the work gets built</span>. Visual design led me into HTML and CSS. Front-end constraints pushed me toward reusable systems. Figma, tokens, and Storybook gave design and engineering a shared language. Now AI is shrinking that distance again, letting me move from an idea through UX, system decisions, working software, QA, and refinement <a href="#systems" className="about__inline-link">without treating handoff as the finish line</a>.
              </p>

              <p className="about__body">
                I&rsquo;ve never waited for a new workflow to become standard before learning it. I was early to get AI tools approved and into my daily work, I&rsquo;ve spent close to a year building deeply with Claude, and I still put 8&ndash;10 hours a week outside work into learning by making things, lately with Codex, Figma agent exploration, and bridging the gap of knowledge between the systems I build and the React Native output that results. The tools keep moving. <span className="animated-bold">My responsibility stays the same: bring the judgment, protect the craft, understand the system, and care about what actually ships.</span>
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
