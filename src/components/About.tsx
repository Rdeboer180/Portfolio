import React, { useEffect, useRef } from 'react';
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

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const highlights = section.querySelectorAll('.about__highlight');
    if (highlights.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sweepDuration = 420;
            const holdDuration = 240;
            const fadeOut = 360;
            const cycleTime = sweepDuration + holdDuration + fadeOut + 180;
            highlights.forEach((el, i) => {
              const baseDelay = i * cycleTime;
              setTimeout(() => {
                el.classList.add('about__highlight--active');
              }, baseDelay);
              setTimeout(() => {
                el.classList.add('about__highlight--bold');
                el.classList.remove('about__highlight--active');
              }, baseDelay + sweepDuration + holdDuration);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__container">
        <div className="about__content">
          <div className="about__text">
            <SectionBadge icon={<UserIcon />} label="About Me" />
            <h2 className="about__title">Built for where design is heading</h2>
              <p className="about__body">
                Part designer, part front-end thinker, part systems builder&mdash;I do my best work where <span className="about__highlight">high-fidelity product design, design systems, and implementation strategy meet</span>, with a strength for turning user needs and business constraints into experiences teams can confidently build.
              </p>

              <p className="about__body">
                Over 12 years at Tire Rack, I&rsquo;ve worked closely across research, accessibility, SEO, UX leadership, and engineering&mdash;using user insights, WCAG standards, content strategy, and technical constraints to make <span className="about__highlight">clearer, more user-focused design decisions</span>.
              </p>

              <p className="about__body">
                My strongest work happens in the systems behind the experience: <span className="about__highlight">designing polished interactive interfaces, defining scalable component patterns, and shaping the evolving process that governs how products are designed, documented, built, and improved</span>.
              </p>

              <p className="about__body">
                More recently, that same systems mindset has pulled me into AI-native design operations&mdash;starting as the first designer involved in our corporate ChatGPT rollout in 2023 and evolving into leading practical workflow exploration across Claude Code, Claude Design, and connected tooling.
              </p>

              <p className="about__body">
                What that&rsquo;s become in practice is <span className="about__highlight">building a design harness: structuring prompts, workflows, and system constraints so AI outputs are consistent, scalable, and production-ready</span>. This includes personalized skills, MCP-connected workflows, design proof automation, Figma output cleanup, and design system documentation.
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
