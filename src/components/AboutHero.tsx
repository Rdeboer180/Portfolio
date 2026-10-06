// ============================================
// AboutHero — text-first editorial hero ("Craft is the through-line.")
// The writing leads; loose craft marks live quietly in the margins. Calm
// Waabi-style masked reveal on load (useReveal + .reveal-* utilities), plays
// once, fully reduced-motion safe.
// ============================================

import React from 'react';
import { useReveal } from '../hooks/useReveal';

const TOOL_GROUPS = [
  { label: 'Visual design', tools: 'Figma, Illustrator, Photoshop' },
  { label: 'Building and testing', tools: 'HTML, CSS, code and AI-assisted workflows' },
];

const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

const AboutHero: React.FC = () => {
  const [ref, visible] = useReveal<HTMLElement>(0.15);

  return (
    <header
      ref={ref}
      className={`about-hero${visible ? ' is-visible' : ''}`}
    >
      <div className="about-hero__inner">
        {/* Left margin — faint process words (decorative). These echo the four
            beats of the loop below rather than naming a separate five-step
            process, which is what they used to do. */}
        <div className="about-hero__process" aria-hidden="true">
          DEFINE · EXPLORE · LEARN · FEED BACK
        </div>

        {/* Reading column */}
        <div className="about-hero__column">
          <p className="about-hero__eyebrow reveal-fade" style={d(0)}>
            Craft / Code / Systems / Care
          </p>

          <h1 className="about-hero__headline">
            <span className="about-hero__line">
              <span className="about-hero__line-mask reveal-mask">
                <span className="about-hero__line-inner reveal-mask__inner" style={d(120)}>
                  Craft is the
                </span>
              </span>
            </span>
            <span className="about-hero__line about-hero__line--mark">
              <span className="about-hero__line-mask reveal-mask">
                <span className="about-hero__line-inner reveal-mask__inner" style={d(220)}>
                  through-line.
                </span>
              </span>
              {/* Hand-drawn underline draws L→R after the headline */}
              <svg
                className="about-hero__underline"
                width="320"
                height="16"
                viewBox="0 0 320 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="reveal-draw"
                  style={d(840)}
                  d="M4 10 C 80 3, 220 3, 316 9"
                  stroke="var(--color-primary, #f03d01)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                />
              </svg>
            </span>
          </h1>

          <div className="about-hero__intro reveal-fade" style={d(1000)}>
            <p>
              I'm a senior designer who kept moving closer to how the work gets built.
            </p>
            <p>
              I started in visual design, learned HTML and CSS because the browser
              kept exposing gaps in my files, then built systems that design and engineering could
              share. Now I use AI-assisted workflows to explore more directions and get working
              ideas in front of people sooner.
            </p>
          </div>

          <section className="about-hero__practice reveal-fade" style={d(1100)} aria-labelledby="about-practice-heading">
            <h2 id="about-practice-heading">What I carry into the work</h2>
            <p>Visual fundamentals, reusable systems, and the judgment to check what actually ships.</p>
            <dl className="about-hero__tools">
              {TOOL_GROUPS.map(({ label, tools }) => (
                <div className="about-hero__tool-group" key={label}>
                  <dt>{label}</dt>
                  <dd>{tools}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Right margin — artifact cluster (decoration), revealed last */}
        <aside className="about-hero__artifacts" aria-label="Margin notes">
          <div className="reveal-fade" style={d(1150)}>
            <div className="about-hero__note">the file is not the finish line</div>
          </div>

          <div className="about-hero__comment reveal-fade" style={d(1370)}>
            <svg
              className="about-hero__comment-arrow"
              width="46"
              height="30"
              viewBox="0 0 46 30"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 4 C 18 2, 38 8, 42 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M42 26 L36 18 M42 26 L33 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>not everything fits in a job title</span>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default AboutHero;
