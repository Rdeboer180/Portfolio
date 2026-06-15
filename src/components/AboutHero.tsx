// ============================================
// AboutHero — text-first editorial hero ("Craft is the through-line.")
// The writing leads; loose craft marks live quietly in the margins. Calm
// Waabi-style masked reveal on load (useReveal + .reveal-* utilities), plays
// once, fully reduced-motion safe.
// ============================================

import React from 'react';
import { useReveal } from '../hooks/useReveal';

// Tool path — the craft → AI through-line
const TOOLS = ['Photoshop', 'Illustrator', 'Code', 'Figma', 'Systems', 'AI'];
const CARRY = ['fundamentals', 'implementation', 'systems', 'judgment', 'what ships'];

// Inline --reveal-delay helper
const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M2 7 L5 10 L11 2.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AboutHero: React.FC = () => {
  const [ref, visible] = useReveal<HTMLElement>(0.15);

  return (
    <header
      ref={ref}
      className={`about-hero${visible ? ' is-visible' : ''}`}
    >
      <div className="about-hero__inner">
        {/* Left margin — faint process words (decorative) */}
        <div className="about-hero__process" aria-hidden="true">
          DEFINE · SHAPE · BUILD · REFINE · SHIP
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

          {/* Tool path */}
          <div className="about-hero__tools" aria-label="Tools, from visual craft to AI">
            {TOOLS.map((tool, i) => (
              <React.Fragment key={tool}>
                {i > 0 && (
                  <span className="about-hero__tool-arrow" aria-hidden="true">→</span>
                )}
                <span
                  className={`about-hero__tool reveal-fade${
                    tool === 'AI' ? ' about-hero__tool--accent' : ''
                  }`}
                  style={d(900 + i * 50)}
                >
                  {tool}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="about-hero__intro reveal-fade" style={d(1000)}>
            <p>
              I’m a senior designer shaped by craft, code, systems, and care — but there’s more
              to the story than a title.
            </p>
            <p>
              I’ve spent 16+ years evolving through the tools, constraints, and expectations of
              digital design. I started with visual craft, moved closer to front-end
              implementation, built systems that help teams ship consistently, and now I’m
              exploring how AI-native workflows can make the path from idea to product faster,
              clearer, and more creative.
            </p>
            <p>
              At the center of all of it is the same standard: care about the idea, the interface,
              the system, the people building it, and what actually ships.
            </p>
          </div>
        </div>

        {/* Right margin — artifact cluster (decoration), revealed last */}
        <aside className="about-hero__artifacts" aria-label="Margin notes">
          <div className="reveal-fade" style={d(1150)}>
            <div className="about-hero__note">craft = care made visible</div>
          </div>

          <div className="reveal-fade" style={d(1260)}>
            <div className="about-hero__checklist">
              <div className="about-hero__checklist-label">What I carry</div>
              <ul className="about-hero__checklist-items">
                {CARRY.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
