// ============================================
// AboutHero — text-first editorial hero ("Craft is the through-line.")
// The writing leads; loose craft marks (handwritten note, checklist, comment,
// tool-path, process words) live quietly in the margins. Calm load choreography
// via framer-motion, plays once, fully reduced-motion safe.
// ============================================

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Tool path — the craft → AI through-line
const TOOLS = ['Photoshop', 'Illustrator', 'Code', 'Figma', 'Systems', 'AI'];
const CARRY = ['fundamentals', 'implementation', 'systems', 'judgment', 'what ships'];

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
  const reduce = useReducedMotion();

  // Rise-in helper — final state immediately under reduced motion
  const rise = (delay: number, y = 12, duration = 0.56) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration, ease: EASE },
        };

  // Headline line — upward mask reveal
  const line = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { y: '110%' },
          animate: { y: '0%' },
          transition: { delay, duration: 0.52, ease: EASE },
        };

  return (
    <header className="about-hero">
      <div className="about-hero__inner">
        {/* Left margin — faint process words (decorative) */}
        <div className="about-hero__process" aria-hidden="true">
          DEFINE · SHAPE · BUILD · REFINE · SHIP
        </div>

        {/* Reading column */}
        <div className="about-hero__column">
          <motion.p className="about-hero__eyebrow" {...rise(0, 8, 0.24)}>
            Craft / Code / Systems / Care
          </motion.p>

          <h1 className="about-hero__headline">
            <span className="about-hero__line">
              <span className="about-hero__line-mask">
                <motion.span className="about-hero__line-inner" {...line(0.12)}>
                  Craft is the
                </motion.span>
              </span>
            </span>
            <span className="about-hero__line about-hero__line--mark">
              <span className="about-hero__line-mask">
                <motion.span className="about-hero__line-inner" {...line(0.21)}>
                  through-line.
                </motion.span>
              </span>
              {/* Hand-drawn underline draws L→R */}
              <svg
                className="about-hero__underline"
                width="320"
                height="16"
                viewBox="0 0 320 16"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M4 10 C 80 3, 220 3, 316 9"
                  stroke="var(--color-primary, #f03d01)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                  transition={reduce ? undefined : { delay: 0.82, duration: 0.42, ease: 'easeOut' }}
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
                <motion.span
                  className={`about-hero__tool${
                    tool === 'AI' ? ' about-hero__tool--accent' : ''
                  }`}
                  {...(reduce
                    ? { initial: false as const }
                    : {
                        initial: { opacity: 0, y: 6 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 1.1 + i * 0.04, duration: 0.32, ease: EASE },
                      })}
                >
                  {tool}
                </motion.span>
              </React.Fragment>
            ))}
          </div>

          <motion.div className="about-hero__intro" {...rise(1.0)}>
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
          </motion.div>
        </div>

        {/* Right margin — artifact cluster (decoration) */}
        <aside className="about-hero__artifacts" aria-label="Margin notes">
          <motion.div
            className="about-hero__note"
            {...(reduce
              ? { initial: false as const }
              : {
                  initial: { opacity: 0, y: 10, rotate: -1 },
                  animate: { opacity: 1, y: 0, rotate: -3.5 },
                  transition: { delay: 1.2, duration: 0.48, ease: EASE },
                })}
          >
            craft = care made visible
          </motion.div>

          <motion.div className="about-hero__checklist" {...rise(1.32, 10, 0.48)}>
            <div className="about-hero__checklist-label">What I carry</div>
            <ul className="about-hero__checklist-items">
              {CARRY.map((item) => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="about-hero__comment" {...rise(1.44, 10, 0.48)}>
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
          </motion.div>
        </aside>
      </div>
    </header>
  );
};

export default AboutHero;
