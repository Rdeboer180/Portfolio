// ============================================
// AboutStorySections — text-first story flow (NOT tabs/cards)
// Seven scannable beats: index · headline · paragraphs · one orange annotation.
// Each beat reveals on scroll with the Waabi-style masked reveal, once, and is
// fully reduced-motion safe (content always in the DOM).
// ============================================

import React from 'react';
import { storySections, StorySection } from '../data/about';
import { useReveal } from '../hooks/useReveal';

// Inline --reveal-delay helper
const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

const StoryBeat: React.FC<{ section: StorySection }> = ({ section: s }) => {
  const [ref, visible] = useReveal<HTMLElement>(0.25);

  return (
    <article
      ref={ref}
      className={`about-story__beat${visible ? ' is-visible' : ''}`}
    >
      <div className="about-story__index reveal-fade" style={d(0)} aria-hidden="true">
        {s.num}
      </div>

      <div className="about-story__copy">
        <div className="reveal-mask">
          <h2 className="about-story__heading reveal-mask__inner" style={d(110)}>
            {s.title}
          </h2>
        </div>
        {s.body.map((para, i) => (
          <p key={i} className="about-story__para reveal-fade" style={d(220 + i * 70)}>
            {para}
          </p>
        ))}
      </div>

      <div className="about-story__aside">
        <span
          className="about-story__annotation reveal-fade"
          style={d(220 + s.body.length * 70 + 80)}
        >
          {s.annotation}
        </span>
      </div>
    </article>
  );
};

const AboutStorySections: React.FC = () => (
  <section className="about-story" aria-label="Ryan’s story">
    <div className="about-story__inner">
      {storySections.map((s) => (
        <StoryBeat key={s.num} section={s} />
      ))}
    </div>
  </section>
);

export default AboutStorySections;
