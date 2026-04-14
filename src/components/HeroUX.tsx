import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/styles.scss';
import uiPromptSvg from '../assets/ui/ui_prompt.svg';
import LayersPanel from './LayersPanel';
import ProficiencyDock from './ProficiencyDock';

const roles = [
  'Systems Thinker',
  'Design Engineer',
  'Designs What Ships',
];
const FINAL_INDEX = roles.length - 1;

type Phase =
  | 'typing'
  | 'cycling'
  | 'paused-final'
  | 'cursor-backtrack'
  | 'editing-final'
  | 'gradient-final'
  | 'complete';

const HeroUX: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [showBBox, setShowBBox] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
        scheduleTimeout(() => {
          setPhase('paused-final');
        }, 2000);
        return;
      }

      scheduleTimeout(advance, 1400);
    };

    scheduleTimeout(advance, 1400);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Pause on final word, then show bbox and begin backtrack
  useEffect(() => {
    if (phase !== 'paused-final' || isPaused) return;

    scheduleTimeout(() => {
      setShowBBox(true);
      setPhase('cursor-backtrack');
    }, 50);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Cursor moves to start of final word
  useEffect(() => {
    if (phase !== 'cursor-backtrack' || isPaused) return;

    scheduleTimeout(() => {
      setPhase('editing-final');
    }, 450);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // Selection drag across final word
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

  const handleLayerClick = useCallback((index: number) => {
    if (phase === 'typing' || index === activeIndexRef.current) return;

    clearAllTimeouts();
    activeIndexRef.current = index;
    setActiveIndex(index);
    setDisplayText(roles[index]);
    setShowBBox(false);

    if (index === FINAL_INDEX) {
      // Replay final sequence if clicking final role
      setPhase('paused-final');
    } else {
      setPhase('cycling');
    }
  }, [phase, clearAllTimeouts]);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  const isFinalRole = activeIndex === FINAL_INDEX;
  const showGradient = phase === 'gradient-final' || phase === 'complete';

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
              <span className="hero-hybrid__eyebrow-title">14+ years</span>
              <br />
              <span className="hero-hybrid__eyebrow-meta">
                bridging UX, design engineering, and systems thinking
              </span>
            </p>

            <div
              className="hero-hybrid__typed-wrap hero-hybrid__reveal hero-hybrid__reveal--2"
              aria-live="polite"
            >
              <h1 className="hero-hybrid__h1-sr-only">
                I bridge the gap between ambitious UX and buildable systems.
              </h1>

              <div className="hero-hybrid__typed-group">
                <span
                  key={phase === 'typing' ? 'typing' : `role-${activeIndex}-${phase}`}
                  className={`hero-hybrid__typed${
                    phase !== 'typing' ? ' hero-hybrid__typed--swap' : ''
                  }`}
                  aria-hidden="true"
                >
                  {isFinalRole ? (
                    <>
                      Designs What{' '}
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
                          Ships
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
                    </>
                  ) : (
                    <>
                      {displayText}
                      {phase === 'typing' && <span className="hero-hybrid__cursor" />}
                    </>
                  )}
                </span>

                <div className={`hero-hybrid__bbox${showBBox ? ' hero-hybrid__bbox--visible' : ''}`}>
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

            <p className="hero-hybrid__body hero-hybrid__reveal hero-hybrid__reveal--3">
              <strong className="hero-hybrid__body-lead">I solve ambiguous UX problems at the systems level.</strong>{' '}
              I translate between product vision and technical reality—designing solutions that engineers want to build and teams can ship confidently.
            </p>

            <div className="hero-hybrid__actions hero-hybrid__reveal hero-hybrid__reveal--4">
              <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero-hybrid__btn-icon" />
                rdeboer180@gmail.com
              </a>
              <a href="#projects" className="btn btn--secondary btn--lg">
                Problems I've Solved
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

export default HeroUX;
