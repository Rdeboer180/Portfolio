// ============================================
// ProcessPrinciples — numbered accordion
// 5 rows, one open at a time, first open by default
// Full keyboard a11y + reduced-motion
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { principles } from '../data/about';

// ── Reduced-motion detection ─────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ── Animated expand/collapse using max-height ─────────────────────────────────
// When reduced-motion is off, we animate max-height 0 → scrollHeight.
// When reduced-motion is on, we rely on the `hidden` attribute for instant swap.

interface AccordionBodyProps {
  isOpen: boolean;
  reducedMotion: boolean;
  id: string;
  labelledBy: string;
  children: React.ReactNode;
}

const AccordionBody: React.FC<AccordionBodyProps> = ({
  isOpen,
  reducedMotion,
  id,
  labelledBy,
  children,
}) => {
  const innerRef = useRef<HTMLDivElement>(null);

  if (reducedMotion) {
    // Instant: use `hidden` attribute — browser removes from layout entirely
    return (
      <div
        id={id}
        role="region"
        aria-labelledby={labelledBy}
        className="process-principles__body"
        hidden={!isOpen}
      >
        <div className="process-principles__body-inner">{children}</div>
      </div>
    );
  }

  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`process-principles__body${isOpen ? ' process-principles__body--open' : ''}`}
    >
      <div ref={innerRef} className="process-principles__body-inner">
        {children}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const ProcessPrinciples: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(0); // first row open by default
  const reducedMotion = useReducedMotion();

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

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

        {/* Accordion rows */}
        <div className="process-principles__rows" role="list">
          {principles.map((p, i) => {
            const isOpen = openIndex === i;
            const headerId = `process-header-${p.num}`;
            const bodyId = `process-body-${p.num}`;
            return (
              <div
                key={p.num}
                className={`process-principles__row${isOpen ? ' process-principles__row--active' : ''}`}
                role="listitem"
                style={{ ['--stack-i' as string]: i }}
              >
                <button
                  id={headerId}
                  className="process-principles__row-header"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => toggle(i)}
                >
                  <span className="process-principles__row-num" aria-hidden="true">
                    {p.num}
                  </span>
                  <span className="process-principles__row-meta">
                    <span className="process-principles__row-label">[ {p.label} ]</span>
                    <span className="process-principles__row-title">{p.title}</span>
                  </span>
                  <span
                    className={`process-principles__row-chevron${isOpen ? ' process-principles__row-chevron--open' : ''}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <AccordionBody
                  id={bodyId}
                  labelledBy={headerId}
                  isOpen={isOpen}
                  reducedMotion={reducedMotion}
                >
                  {p.body}
                </AccordionBody>
              </div>
            );
          })}
        </div>

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
