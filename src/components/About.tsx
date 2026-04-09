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
            const sweepDuration = 600;
            const holdDuration = 400;
            const fadeOut = 500;
            const cycleTime = sweepDuration + holdDuration + fadeOut + 200;
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
              <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what&rsquo;s set me apart hasn&rsquo;t been just visual taste&mdash;it&rsquo;s been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span>
            </p>
            <p className="about__body">
             A big part of that perspective comes from the environment I’ve worked in. Over 12 years at Tire Rack, I’ve operated closely across research, accessibility, SEO, and UX leadership—not in silos, but in the actual work. Running user studies alongside research, designing against WCAG standards from the start, and pressure-testing decisions against how search engines surface and prioritize content. I spent years working directly under our Head of UX, trusted to take on complex flows and help shape how problems were approached. <span className="about__highlight">That kind of cross-functional exposure is what grounded my work in reality—and pushed it beyond surface-level design.</span></p>

            <p className="about__body">Early in my career, I was hired for design instinct, visual craft, and strategic thinking. But I knew that if I wanted to build the kind of work I admired, I needed deeper technical fluency. So I closed that gap the same way I approach everything else: reps, curiosity, experimentation, and a lot of time spent learning by doing. Over time, that turned me into the <span className="about__highlight">kind of designer who can spot what feels off, understand why, and help fix it at the system level.</span>
            </p>
            <div className="about__cta-links">
              <a href="#/about" className="about__read-more">Go deeper on my approach &rarr;</a>
              <span className="about__link-separator">or</span>
              <a href="#testimonials" className="about__read-more">see what it&rsquo;s like to work with me &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
