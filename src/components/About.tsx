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
            <h2 className="about__title">Built For Where Design Is Heading</h2>
              <p className="about__body">
                Part designer, part front-end thinker, part systems builder&mdash;I do my best work where high-fidelity product design, design systems, front-end implementation, and creative strategy meet.
              </p>

              <p className="about__body">
                The title may change depending on the team&mdash;Product Designer, UX Engineer, Systems Designer, Design Strategist, or Senior Web Designer&mdash;but the through-line is the same: <span className="animated-bold">I connect design, front-end logic, systems thinking, and practical implementation</span> so complex ideas become clearer, more scalable, and easier for teams to ship.
              </p>

              <p className="about__body">
                Over 12 years at Tire Rack, I&rsquo;ve worked across research, accessibility, SEO, UX leadership, analytics, content, and engineering&mdash;using user insights, WCAG standards, content strategy, and technical constraints to make clearer, more user-focused decisions.
              </p>

              <p className="about__body">
                My strongest work happens in the systems behind the experience: designing polished interfaces, defining scalable component patterns, and improving the process that governs how products are designed, documented, built, and improved. In a world where more people can build faster than ever, my edge is <span className="animated-bold">knowing what to design, why it matters, and how to make it hold up in the real world.</span>
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
