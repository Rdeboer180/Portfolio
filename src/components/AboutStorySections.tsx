// ============================================
// AboutStorySections — text-first story flow (NOT tabs/cards)
// Six scannable beats: index · headline · paragraph · one orange annotation.
// Calm fade-in on scroll, plays once, reduced-motion safe.
// ============================================

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { storySections } from '../data/about';

const EASE = [0.2, 0.7, 0.2, 1] as const;

const AboutStorySections: React.FC = () => {
  const reduce = useReducedMotion();

  const reveal = reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.5, ease: EASE },
      };

  return (
    <section className="about-story" aria-label="Ryan’s story">
      <div className="about-story__inner">
        {storySections.map((s) => (
          <motion.article key={s.num} className="about-story__beat" {...reveal}>
            <div className="about-story__index" aria-hidden="true">
              {s.num}
            </div>

            <div className="about-story__copy">
              <h2 className="about-story__heading">{s.title}</h2>
              {s.body.map((para, i) => (
                <p key={i} className="about-story__para">{para}</p>
              ))}
            </div>

            <div className="about-story__aside">
              <span className="about-story__annotation">{s.annotation}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default AboutStorySections;
