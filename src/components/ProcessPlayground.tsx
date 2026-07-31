// ============================================
// ProcessPlayground — "From sketch to shipped" homepage process section
// Replaces the old HowIWork walkthrough with the playground language: five
// compact process beats whose CARDS RENDER AT INCREASING FIDELITY — 01 reads
// as a pencil sketch, 02 a wireframe, 03 lo-fi, 04 hi-fi, 05 shipped — so the
// section demonstrates the process it describes. Condensed from the About
// page's "My Process", with a link that anchors to the full version.
// Motion: staggered reveal + hand-drawn connector path drawing in on scroll
// (CSS-only, gated on the section's --revealed class). Reduced-motion safe.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from './SectionBadge';
import { useReveal } from '../hooks/useReveal';

const ProcessIcon = () => (
  <svg viewBox="0 0 1106 1139" fill="currentColor" stroke="none">
    <path d="M1008.71,81.34h-130.16c-53.83,0-97.62,43.79-97.62,97.62v130.16c0,53.83,43.79,97.62,97.62,97.62h130.16c53.83,0,97.61-43.79,97.61-97.62v-130.16c0-53.83-43.78-97.62-97.61-97.62Z" />
    <path d="M0,959.9c0,53.83,43.79,97.62,97.62,97.62h130.16c53.83,0,97.62-43.79,97.62-97.62v-130.16c0-53.83-43.79-97.61-97.62-97.61H97.62c-53.83,0-97.62,43.78-97.62,97.61v130.16Z" />
    <path d="M48.81,601.97c0,26.95,21.86,48.81,48.81,48.81s48.81-21.86,48.81-48.81v-325.39c0-44.87,36.48-81.35,81.35-81.35h305.18l-14.3,14.3c-19.06,19.06-19.06,49.95,0,69.02,19.06,19.06,49.94,19.06,69.02,0l97.61-97.62c18.72-18.71,19.17-49.86,0-69.02l-97.61-97.62c-19.07-19.06-49.95-19.06-69.02,0-19.07,19.06-19.06,49.95,0,69.02l14.3,14.3H227.77c-98.7,0-178.96,80.27-178.96,178.97v325.38Z" opacity="0.65" />
    <path d="M1057.42,862.29v-325.39c0-26.95-21.86-48.81-48.81-48.81s-48.81,21.86-48.81,48.81v325.39c0,44.86-36.48,81.35-81.35,81.35h-305.18l14.31-14.31c19.06-19.06,19.06-49.95,0-69.02-19.07-19.07-49.95-19.06-69.03,0l-97.62,97.62c-18.71,18.71-19.16,49.86,0,69.02l97.62,97.62c19.07,19.06,49.94,19.06,69.03,0,19.06-19.07,19.06-49.95,0-69.02l-14.31-14.31h305.18c98.7,0,178.97-80.26,178.97-178.95Z" opacity="0.65" />
  </svg>
);

// Hand-drawn CTA arrow — same vocabulary as the case-study playground
const SketchArrow = () => (
  <svg
    className="process-playground__cta-arrow"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 23 C 14 19, 26 19, 37 22" fill="none" strokeLinecap="round" pathLength={1} />
    <path d="M37 22 L29.5 15.5 M37 22 L30.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
  </svg>
);

// ── Fidelity artifacts ───────────────────────────────────────────────────────
// Small visual strips that carry each card's fidelity tier. Decorative.

const ArtifactSketch = () => (
  // Pencil scribble — wobbly circle + underline, hero-sketch style
  <svg viewBox="0 0 96 44" fill="none" aria-hidden="true">
    <path
      d="M30 22 C 30 12, 44 8, 52 13 C 61 18, 60 31, 50 34 C 40 37, 29 31, 31 21 C 33 13, 43 9, 50 12"
      stroke="rgba(0,0,0,0.4)" strokeWidth="1.6" strokeLinecap="round"
    />
    <path d="M14 40 C 34 36, 62 38, 84 39" stroke="rgba(0,0,0,0.3)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ArtifactWireframe = () => (
  <div className="process-playground__wf" aria-hidden="true">
    <span className="process-playground__wf-box" />
    <span className="process-playground__wf-bars">
      <span /><span />
    </span>
  </div>
);

const ArtifactLofi = () => (
  <div className="process-playground__lofi" aria-hidden="true">
    <span className="process-playground__lofi-box" />
    <span className="process-playground__lofi-bars">
      <span /><span />
    </span>
  </div>
);

const ArtifactHifi = () => (
  <div className="process-playground__hifi" aria-hidden="true">
    <span className="process-playground__hifi-box" />
    <span className="process-playground__hifi-bars">
      <span /><span /><span />
    </span>
  </div>
);

const ArtifactShipped = () => (
  <div className="process-playground__shipped" aria-hidden="true">
    <span className="process-playground__shipped-chrome">
      <span /><span /><span />
    </span>
    <span className="process-playground__shipped-hero" />
    <span className="process-playground__shipped-bars">
      <span /><span />
    </span>
  </div>
);

// ── Steps (condensed from the About page's "My Process") ─────────────────────

interface Step {
  num: string;
  title: string;
  line: string;
  note: string; // handwritten aside (Caveat)
  artifact: React.ReactNode;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Define & Align',
    line: 'Ask the right questions before a pixel moves.',
    note: 'start messy',
    artifact: <ArtifactSketch />,
  },
  {
    num: '02',
    title: 'Design With Intent',
    line: 'Every decision ships with a reason.',
    note: 'name the why',
    artifact: <ArtifactWireframe />,
  },
  {
    num: '03',
    title: 'Build For The Long Game',
    line: 'Systems that outlive the launch.',
    note: 'think in systems',
    artifact: <ArtifactLofi />,
  },
  {
    num: '04',
    title: 'Validate & Optimize',
    line: 'Ship, measure, and let results steer.',
    note: 'prove it',
    artifact: <ArtifactHifi />,
  },
  {
    num: '05',
    title: 'Put In The Reps',
    line: 'Keep evolving as the tools do.',
    note: 'stay curious',
    artifact: <ArtifactShipped />,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

const ProcessPlayground: React.FC = () => {
  const [sectionRef, revealed] = useReveal<HTMLElement>(0.2);

  return (
    <section
      id="how-i-work"
      className={`process-playground${revealed ? ' process-playground--revealed' : ''}`}
      ref={sectionRef}
    >
      <div className="process-playground__container">
        <div className="process-playground__intro">
          <SectionBadge icon={<ProcessIcon />} label="My Process" index="05" />
          <h2 className="process-playground__title">From sketch to shipped</h2>
          <p className="process-playground__lede">
            Five beats behind every project &mdash; the same craft arc, whether
            it&rsquo;s a component or a whole platform.
          </p>
        </div>

        <div className="process-playground__track">
          {/* Hand-drawn journey line — draws across the five beats on reveal */}
          <svg
            className="process-playground__path"
            viewBox="0 0 1100 32"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className="process-playground__path-line"
              d="M8 20 C 120 12, 200 26, 310 18 S 520 24, 640 16 S 860 24, 1052 14"
              fill="none"
              strokeLinecap="round"
              pathLength={1}
            />
            <path
              className="process-playground__path-head"
              d="M1052 14 L1040 8 M1052 14 L1042 23"
              fill="none"
              strokeLinecap="round"
              pathLength={1}
            />
          </svg>

          <ol className="process-playground__steps">
            {STEPS.map((step, i) => (
              <li
                key={step.num}
                className={`process-playground__step process-playground__step--f${i + 1}`}
                style={{ ['--pp-delay' as string]: `${i * 90}ms` }}
              >
                <div className="process-playground__artifact">{step.artifact}</div>
                <span className="process-playground__num">[ {step.num} ]</span>
                <h3 className="process-playground__step-title">{step.title}</h3>
                <p className="process-playground__step-line">{step.line}</p>
                <span className="process-playground__note" aria-hidden="true">
                  {step.note}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <Link className="process-playground__cta" to="/about#process">
          Read more about my process
          <SketchArrow />
        </Link>
      </div>
    </section>
  );
};

export default ProcessPlayground;
