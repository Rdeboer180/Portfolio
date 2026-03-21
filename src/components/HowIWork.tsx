import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    label: 'Understand & Align',
    body: 'I ask the right questions first. Before anything is designed, I map business goals to user needs and make sure we\u2019re building the right thing.',
    image: '/images/process/placeholder-figma-design.png',
    imageLabel: 'Figma Design Still',
  },
  {
    label: 'Design with Intent',
    body: 'Every decision is documented. Layouts, tokens, components \u2014 built to be handed off cleanly and extended by a team.',
    image: '/images/process/placeholder-icon-design.png',
    imageLabel: 'Icon Design Still',
  },
  {
    label: 'Test & Iterate',
    body: 'I validate with real usage, not assumptions. A/B tests, usability checks, and post-launch reviews feed directly back into the system.',
    image: '/images/process/placeholder-inspector.png',
    imageLabel: 'Inspector View',
  },
  {
    label: 'Build to Last',
    body: 'Whether it\u2019s a design system or a CMS workflow, I build so the team can own it without me.',
    image: '/images/process/placeholder-cms.png',
    imageLabel: 'CMS Still',
  },
];

const CYCLE_DURATION = 6000;

const HowIWork: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());

  const resetCycle = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    startRef.current = Date.now();
  };

  useEffect(() => {
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / CYCLE_DURATION, 1);
      setProgress(pct);

      if (pct >= 1) {
        setActiveIndex((prev) => (prev + 1) % steps.length);
        setProgress(0);
        startRef.current = Date.now();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="how-i-work">
      {/* Geometric decorative elements */}
      <div className="how-i-work__decor how-i-work__decor--top-left" />
      <div className="how-i-work__decor how-i-work__decor--bottom-right" />
      <div className="how-i-work__decor how-i-work__decor--corner-bracket" />

      <div className="how-i-work__container">
        <div className="how-i-work__header">
          <span className="how-i-work__eyebrow">Process</span>
          <h2 className="how-i-work__title">How I Work</h2>
        </div>

        <div className="how-i-work__layout">
          {/* Left — overlapping image frame */}
          <div className="how-i-work__visual">
            <div className="how-i-work__image-frame">
              <div className="how-i-work__image-placeholder">
                <span className="how-i-work__image-label">
                  [{steps[activeIndex].imageLabel}]
                </span>
              </div>
            </div>
            {/* Step counter */}
            <div className="how-i-work__step-count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </div>
          </div>

          {/* Right — tabbed steps */}
          <div className="how-i-work__steps">
            {steps.map((step, i) => (
              <button
                key={step.label}
                className={`how-i-work__step ${i === activeIndex ? 'how-i-work__step--active' : ''}`}
                onClick={() => resetCycle(i)}
              >
                <div className="how-i-work__step-indicator">
                  <div
                    className="how-i-work__step-progress"
                    style={{ height: i === activeIndex ? `${progress * 100}%` : i < activeIndex ? '100%' : '0%' }}
                  />
                </div>
                <div className="how-i-work__step-content">
                  <h3 className="how-i-work__step-label">{step.label}</h3>
                  <p className={`how-i-work__step-body ${i === activeIndex ? 'how-i-work__step-body--visible' : ''}`}>
                    {step.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
