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
                I&rsquo;ve spent 16+ years pushing digital design through craft, brand systems, front-end constraints, and production realities. The tools have changed, but the responsibility has not: <span className="animated-bold">know what to design, why it matters, and how to make the work hold up</span> once real teams and real users touch it.
              </p>

              <p className="about__body">
                AI-native workflows are making the opportunity cost of exploration cheaper and faster. More people can now express ideas in higher fidelity, which makes senior design judgment even more valuable&mdash;not less. Through personal and volunteer projects, I&rsquo;ve been <span className="animated-bold">expanding my ability to build end-to-end experiences</span> and exploring what becomes possible when old barriers around full-stack execution start to fall away. That shift has helped me rediscover my love of design by getting closer to the full arc of the work: shaping the idea, building the interface, testing the system, and learning from what actually ships.
              </p>

              <p className="about__body">
                Part of being senior is <span className="animated-bold">adding value beyond polished screens</span>. I care about the process around the work: the patterns, documentation, governance, accessibility, handoff, QA, and team clarity that help ideas survive past the first version. Design systems, to me, are not just the pixels on the page&mdash;they&rsquo;re the operating model that helps teams make better decisions and ship stronger work.
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
