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

    const highlights = section.querySelectorAll('.animated-bold');
    if (highlights.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Brush sweeps across → brief wet hold → highlight fades back to page
            // while text settles to bold black. CSS owns the actual transition
            // durations; these JS values are the handoff points between phases.
            const sweepDuration = 650;   // brush sweeps across the span
            const wetHold = 200;         // hold the wet vibrant ink briefly
            const fadeOutDuration = 900; // highlight fades + text settles to black
            const cycleGap = 150;
            const cycleTime = sweepDuration + wetHold + fadeOutDuration + cycleGap;
            highlights.forEach((el, i) => {
              const baseDelay = i * cycleTime;
              setTimeout(() => {
                el.classList.add('animated-bold--active');
              }, baseDelay);
              setTimeout(() => {
                el.classList.add('animated-bold--settled');
                el.classList.remove('animated-bold--active');
              }, baseDelay + sweepDuration + wetHold);
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
                Part designer, part front-end thinker, part systems builder&mdash;I do my best work where high-fidelity product design, design systems, and implementation strategy meet, with a strength for turning user needs and business constraints into experiences teams can confidently build.
              </p>

              <p className="about__body">
                <span className="animated-bold">That is why I can thrive under a few different titles&mdash;Product Designer, UX Engineer, Systems Designer, Design Strategist, or Senior Web Designer.</span>{' '}
                <span className="animated-bold">The title may shift depending on the team, but the through-line stays the same: I connect design, front-end logic, systems thinking, and practical implementation so complex ideas become clearer, more scalable, and easier for teams to ship.</span>
              </p>

              <p className="about__body">
                Over 12 years at Tire Rack, I&rsquo;ve worked closely across research, accessibility, SEO, UX leadership, and engineering&mdash;using user insights, WCAG standards, content strategy, and technical constraints to make clearer, more user-focused design decisions.
              </p>

              <p className="about__body">
                <span className="animated-bold">My strongest work happens in the systems behind the experience: designing polished interactive interfaces, defining scalable component patterns, and shaping the evolving process that governs how products are designed, documented, built, and improved.</span>
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
