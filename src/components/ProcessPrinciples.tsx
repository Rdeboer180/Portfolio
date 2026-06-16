// ============================================
// ProcessPrinciples — "My Process" sticky stacking cards
// Daydream-Method-style: each principle is a card whose title bar pins and
// stacks at the top as you scroll; the active card shows its breakdown, the
// next card slides up and covers it (pure-CSS sticky stack — opaque cards).
// Mobile / reduced-motion → a plain readable list (no pinning).
// ============================================

import React from 'react';
import { principles } from '../data/about';

const ProcessPrinciples: React.FC = () => {
  return (
    <section className="process-principles" aria-labelledby="process-heading">
      <div className="process-principles__inner">
        {/* Section header */}
        <div className="process-principles__section-label">[ Process ]</div>
        <h2 id="process-heading" className="process-principles__section-title">
          My Process
        </h2>
        <p className="process-principles__subtitle">Ever Evolving</p>
        <p className="process-principles__core-line">
          I start by defining the problem and aligning early, design with intent, ship
          confidently, and refine through reflection to make the next iteration better.
        </p>
      </div>

      {/* Stacking deck */}
      <div className="process-principles__deck" role="list">
        {principles.map((p, i) => (
          <article
            key={p.num}
            className="process-principles__card"
            role="listitem"
            style={{ ['--i' as string]: i }}
          >
            <header className="process-principles__bar">
              <span className="process-principles__num" aria-hidden="true">
                {p.num}
              </span>
              <h3 className="process-principles__bar-title">{p.title}</h3>
            </header>

            <div className="process-principles__breakdown">
              <div className="process-principles__tile" aria-hidden="true">
                {p.num}
              </div>
              <div className="process-principles__breakdown-text">
                <span className="process-principles__breakdown-label">[ {p.label} ]</span>
                <div className="process-principles__breakdown-body">{p.body}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="process-principles__inner">
        {/* Closing statement */}
        <p className="process-principles__closing">
          The tools will keep changing. The expectations will keep rising. My process is built
          to keep evolving with them — without losing the fundamentals that got me here. In the
          end, the job is simple to say and hard to do:{' '}
          <span className="process-principles__closing-emphasis">care for what ships</span>.
        </p>
      </div>
    </section>
  );
};

export default ProcessPrinciples;
