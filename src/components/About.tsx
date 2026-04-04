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

const stats = [
  { value: '16+', label: 'Years designing professionally' },
  { value: '500+', label: 'Projects delivered' },
  { value: '4', label: 'Retail brands supported' },
  { value: '50+', label: 'Design system components shipped' },
];

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
            // Per phrase: highlight sweep (1s) → hold (1s) → bold + fade out → next starts
            const sweepDuration = 1000;
            const holdDuration = 1000;
            const fadeOut = 800;
            const cycleTime = sweepDuration + holdDuration + fadeOut + 400;
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
            <h2 className="about__title">Why I'm especially built for where design is heading</h2>
            <p className="about__body">
              <span className="about__highlight">Part designer, part front-end thinker, part systems builder</span>&mdash;I do my best work where craft, strategy, and implementation meet. For the last 16 years, what's set me apart hasn't been just visual taste&mdash;it's been the ability to <span className="about__highlight">define the real problem, work within real constraints, and understand how the final product actually gets made.</span>
            </p>
            <p className="about__body">
              Early in my career, I was hired for design instinct, visual craft, and strategic thinking. But I knew that if I wanted to build the kind of work I admired, I needed deeper technical fluency. So I closed that gap the same way I approach everything else: reps, curiosity, experimentation, and a lot of time spent learning by doing. Over time, that turned me into the kind of designer who can spot what feels off, understand why, and help fix it at the system level.
            </p>
            <p className="about__body">
              <span className="about__highlight">AI is changing how quickly ideas can be explored, designed, and shipped&mdash;but without strategy behind the work and the prompt, the product won’t stand out.</span> I've spent time getting ahead of that curve, actively using LLM workflows to explore faster and push ideas further. But I don't see that as a long-term edge&mdash;it's quickly becoming the expectation.
            </p>
            <p className="about__body">
              The real separation will come from designers who can think beyond the output&mdash;who know how to guide the tools, pressure test what they produce, and push the work further than expected. That's where I do my best work: bringing clear thinking, high standards, and uncommon care to the final product.
            </p>
            <p className="about__body">
              That's a big part of why I feel so well matched for where the industry is now&mdash;bringing together design taste, systems thinking, technical understanding, and a genuine love for making things better than they need to be.
            </p>
            <p className="about__body">
              There's more to how I think&mdash;and how I help teams do better work&mdash;than what fits here.
            </p>
            <div className="about__cta-links">
              <a href="#/about" className="about__read-more">Go deeper on my approach &rarr;</a>
              <span className="about__link-separator">or</span>
              <a href="#testimonials" className="about__read-more">see what it's like to work with me &rarr;</a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="about__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="about__stat">
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
