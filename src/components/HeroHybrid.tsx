import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/styles.scss';
import uiPromptSvg from '../assets/ui/ui_prompt.svg';
import LayersPanel from './LayersPanel';
import ProficiencyDock from './ProficiencyDock';

const roles = [
  'Web Designer',
  'UI Designer',
  'Product Designer',
  'AI Workflow Designer',
  'Systems Designer',
];
const FINAL_INDEX = roles.length - 1;

// Subtle per-role tool action that maps to a CSS modifier on the bbox
const roleActions: Array<'nudge' | 'align' | 'rename' | null> = [
  'nudge', // Web Designer — gets selected and slightly nudged
  'align', // UI Designer — snaps to alignment guide
  null,    // Product Designer — clean selection (already familiar)
  'rename',// AI Workflow Designer — newer layer being renamed
  null,    // Systems Designer — leads into grouping
];

type Phase =
  | 'typing'
  | 'cycling'
  | 'typing-final'
  | 'paused-final'
  | 'cursor-backtrack'
  | 'editing-final'
  | 'gradient-final'
  | 'complete';

// Inserted between "Systems" and " Designer" to evolve the last role into the final title.
const FINAL_INSERTION = '-First Product';

const HeroHybrid: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [showBBox, setShowBBox] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [typedInsertion, setTypedInsertion] = useState('');

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((cb: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      cb();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Pause when out of view or tab hidden
  useEffect(() => {
    const updateVisibilityPause = (inView: boolean) => {
      const tabHidden = document.hidden;
      setIsPaused(!inView || tabHidden);
    };

    let inViewRef = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef = entry.isIntersecting;
        updateVisibilityPause(inViewRef);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleVisibilityChange = () => updateVisibilityPause(inViewRef);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setDisplayText(roles[FINAL_INDEX]);
      setActiveIndex(FINAL_INDEX);
      activeIndexRef.current = FINAL_INDEX;
      setPhase('complete');
      setShowBBox(false);
    }
  }, []);

  // Typing first role
  useEffect(() => {
    if (phase !== 'typing' || isPaused) return;
    const target = roles[0];

    if (displayText.length === target.length) {
      scheduleTimeout(() => setPhase('cycling'), 900);
      return () => clearAllTimeouts();
    }

    scheduleTimeout(() => {
      setDisplayText(target.substring(0, displayText.length + 1));
    }, 70);

    return () => clearAllTimeouts();
  }, [displayText, phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Cycle remaining roles once
  useEffect(() => {
    if (phase !== 'cycling' || isPaused) return;

    const advance = () => {
      const next = activeIndexRef.current + 1;
      activeIndexRef.current = next;
      setActiveIndex(next);
      setDisplayText(roles[next]);

      if (next >= FINAL_INDEX) {
        // Hold on "Systems Designer" briefly, then start typing the rename
        scheduleTimeout(() => {
          setShowBBox(false);
          setTypedInsertion('');
          setPhase('typing-final');
        }, 900);
        return;
      }

      scheduleTimeout(advance, 1000);
    };

    scheduleTimeout(advance, 1000);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Designer-renaming-a-layer moment: type "-First Product" between "Systems" and " Designer"
  useEffect(() => {
    if (phase !== 'typing-final' || isPaused) return;

    if (typedInsertion.length === FINAL_INSERTION.length) {
      // Typing done — hold briefly so the full title reads, then enter resolved state
      scheduleTimeout(() => setPhase('paused-final'), 450);
      return () => clearAllTimeouts();
    }

    scheduleTimeout(() => {
      setTypedInsertion(FINAL_INSERTION.substring(0, typedInsertion.length + 1));
    }, 70);

    return () => clearAllTimeouts();
  }, [phase, isPaused, typedInsertion, scheduleTimeout, clearAllTimeouts]);

  // Pause on final word, then show bbox and begin backtrack
  useEffect(() => {
    if (phase !== 'paused-final' || isPaused) return;

    // Move H1 to the resolved final title
    activeIndexRef.current = FINAL_INDEX;
    setActiveIndex(FINAL_INDEX);

    scheduleTimeout(() => {
      setShowBBox(true);
      setPhase('cursor-backtrack');
    }, 50);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Cursor moves to start of Strategist
  useEffect(() => {
    if (phase !== 'cursor-backtrack' || isPaused) return;

    scheduleTimeout(() => {
      setPhase('editing-final');
    }, 450);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Selection drag across Strategist
  useEffect(() => {
    if (phase !== 'editing-final' || isPaused) return;

    scheduleTimeout(() => {
      setShowBBox(false);
      setPhase('gradient-final');
    }, 1100);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Gradient reveal then complete
  useEffect(() => {
    if (phase !== 'gradient-final' || isPaused) return;

    scheduleTimeout(() => {
      setPhase('complete');
    }, 500);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // After H1 resolves, sweep + bold the highlight spans in the supporting paragraph one at a time
  useEffect(() => {
    if (phase !== 'complete') return;
    const body = bodyRef.current;
    if (!body) return;

    const highlights = body.querySelectorAll('.about__highlight');
    if (highlights.length === 0) return;

    // Match the About-section pacing (1.2s per highlight)
    const sweepDuration = 420;
    const holdDuration = 240;
    const fadeOut = 360;
    const cycleTime = sweepDuration + holdDuration + fadeOut + 180;
    // Small breathing room after the gradient lands before the first sweep starts
    const initialDelay = 250;

    const ids: number[] = [];
    highlights.forEach((el, i) => {
      const baseDelay = initialDelay + i * cycleTime;
      ids.push(
        window.setTimeout(() => {
          el.classList.add('about__highlight--active');
        }, baseDelay)
      );
      ids.push(
        window.setTimeout(() => {
          el.classList.add('about__highlight--bold');
          el.classList.remove('about__highlight--active');
        }, baseDelay + sweepDuration + holdDuration)
      );
    });

    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [phase]);

  const handleLayerClick = useCallback((index: number) => {
    if (phase === 'typing' || index === activeIndexRef.current) return;

    clearAllTimeouts();
    activeIndexRef.current = index;
    setActiveIndex(index);
    setDisplayText(roles[index]);
    setShowBBox(false);

    if (index === FINAL_INDEX) {
      // Replay the rename + highlight + gradient sequence
      setTypedInsertion('');
      setPhase('typing-final');
    } else {
      setTypedInsertion('');
      setPhase('cycling');
    }
  }, [phase, clearAllTimeouts]);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  const showResolved =
    phase === 'paused-final' ||
    phase === 'cursor-backtrack' ||
    phase === 'editing-final' ||
    phase === 'gradient-final' ||
    phase === 'complete';
  const showGradient = phase === 'gradient-final' || phase === 'complete';
  const isTypingFinal = phase === 'typing-final';
  const currentAction = isTypingFinal ? 'rename' : roleActions[activeIndex] || null;

  // Layer name in the panel evolves with the typed insertion so the rename reads as in-place editing.
  // Once typing completes, the layer "saves" the full final title — preserved across scroll/replay.
  const lastLayerName = `Systems${typedInsertion} Designer`;
  const dynamicRoles = [roles[0], roles[1], roles[2], roles[3], lastLayerName];

  return (
    <section className="hero-hybrid" ref={sectionRef}>
      <nav className="hero-hybrid__nav">
        <div className="hero-hybrid__nav-logo">Ryan DeBoer</div>
        <div className="hero-hybrid__nav-links">
          <a href="#/about">About Me</a>
          <a href="#projects">My Work</a>
          <a href="#/resume">Resume</a>
          <a href="mailto:rdeboer180@gmail.com" className="hero-hybrid__nav-cta">Get in touch</a>
        </div>
      </nav>

      <div className="hero-hybrid__content">
        <div className="hero-hybrid__grid">
          <div className="hero-hybrid__text">
            <p className="hero-hybrid__eyebrow hero-hybrid__reveal hero-hybrid__reveal--1">
              <span className="hero-hybrid__eyebrow-title">16+ years in </span>
              <span className="hero-hybrid__eyebrow-meta">
                design, ux, front end code & design systems
              </span>
            </p>

            <div
              className="hero-hybrid__typed-wrap hero-hybrid__reveal hero-hybrid__reveal--2"
              aria-live="polite"
            >
              <h1 className="hero-hybrid__h1-sr-only">
                Web Designer. UI Designer. Product Designer. AI Workflow Designer. Systems Designer. Systems-First Product Designer.
              </h1>

              <div className={`hero-hybrid__typed-group${isTypingFinal ? ' hero-hybrid__typed-group--renaming' : ''}`}>
                <span
                  key={phase === 'typing' ? 'typing' : `role-${activeIndex}-${phase}`}
                  className={`hero-hybrid__typed${
                    phase !== 'typing' && phase !== 'typing-final' ? ' hero-hybrid__typed--swap' : ''
                  }`}
                  aria-hidden="true"
                >
                  {showResolved ? (
                    <>
                      <span className="hero-hybrid__final-word-wrap">
                        <span
                          className={`hero-hybrid__selection${
                            phase === 'editing-final' ? ' hero-hybrid__selection--active' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={
                            showGradient
                              ? 'hero-hybrid__typed-final-gradient'
                              : 'hero-hybrid__typed-final-word'
                          }
                        >
                          Systems-First
                        </span>
                        <span
                          className={`hero-hybrid__cursor hero-hybrid__cursor--absolute${
                            phase === 'cursor-backtrack' ? ' hero-hybrid__cursor--backtrack' : ''
                          }${
                            phase === 'editing-final' ? ' hero-hybrid__cursor--selecting' : ''
                          }${
                            phase === 'complete' ? ' hero-hybrid__cursor--hide' : ''
                          }`}
                        />
                      </span>
                      {' '}Product Designer
                    </>
                  ) : isTypingFinal ? (
                    <>
                      Systems
                      <span className="hero-hybrid__typed-insert">{typedInsertion}</span>
                      <span className="hero-hybrid__cursor" />
                      {' Designer'}
                    </>
                  ) : (
                    <>
                      {displayText}
                      {phase === 'typing' && <span className="hero-hybrid__cursor" />}
                    </>
                  )}
                </span>

                <div className={`hero-hybrid__bbox${showBBox ? ' hero-hybrid__bbox--visible' : ''}${currentAction ? ` hero-hybrid__bbox--${currentAction}` : ''}`}>
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tl" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tr" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bl" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--br" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tm" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bm" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--ml" />
                  <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--mr" />
                </div>
              </div>
            </div>

            <p className="hero-hybrid__body hero-hybrid__reveal hero-hybrid__reveal--3" ref={bodyRef}>
            My systems thinking <span className="about__highlight">extends beyond the Figma artboard</span>. Over time, the layers of my career&mdash;web design, UI, product thinking, front-end logic, design systems, and AI-assisted workflows&mdash;have become the <span className="about__highlight">foundation of how I design and lead</span>: helping teams with different strengths move with a shared voice and turn complex ideas into scalable, production-ready experiences.
          </p>

            <div className="hero-hybrid__actions hero-hybrid__reveal hero-hybrid__reveal--4">
              <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero-hybrid__btn-icon" />
                rdeboer180@gmail.com
              </a>
              <a href="#projects" className="btn btn--secondary btn--lg">
                View my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-hybrid__visual">
            <div className="hero-hybrid__image-container">
              <div className="hero-hybrid__image-wrapper">
                <div className="hero-hybrid__orange-bg">
                  <div className="hero-hybrid__orange-bg-inner">
                    <img
                      src="/images/hero/orange-background.svg"
                      alt=""
                      className="hero-hybrid__orange-bg-img"
                    />
                  </div>
                </div>
                <div className="hero-hybrid__border-ring" />
                <div className="hero-hybrid__profile-circle">
                  <img
                    src="/images/hero/ryan-deboer.png"
                    alt="Ryan Deboer"
                    className="hero-hybrid__profile-img"
                  />
                </div>
              </div>

              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--prompt">
                <img src={uiPromptSvg} alt="" />
              </div>
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--layers">
                <LayersPanel
                  ref={panelRef}
                  activeIndex={activeIndex}
                  onLayerClick={handleLayerClick}
                  roles={dynamicRoles}
                  action={currentAction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-hybrid__proof-band">
        <div className="hero-hybrid__proof-inner">
          <ProficiencyDock testimonialsHref="#testimonials" />
        </div>
        <div className="hero-hybrid__proof-angle" />
      </div>
    </section>
  );
};

export default HeroHybrid;