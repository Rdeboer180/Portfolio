import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/styles.scss';
import uiCodeSvg from '../assets/ui/ui_code.svg';
import uiPromptSvg from '../assets/ui/ui_prompt.svg';
import LayersPanel from './LayersPanel';
import ProficiencyDock from './ProficiencyDock';

const roles = [
  'Design Strategist',
  'Product Designer',
  'UX Engineer',
];

// Phase: typing (first load only) → looping (cycles through layers forever)
// Interactive layer clicks work during 'looping' phase
type Phase = 'typing' | 'looping';

const HeroHybrid: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const isFirstRunRef = useRef(true);

  // Bounding box + transform (UX Engineer stretch, first run only)
  const [showBBox, setShowBBox] = useState(false);
  const [headlineScale, setHeadlineScale] = useState(1);
  const [isStretching, setIsStretching] = useState(false);

  // Pause state: true when hero is out of view OR tab is hidden
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(0);

  // Keep activeIndexRef in sync so advance() can read latest without being in deps
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Helper: clear all tracked timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((cb: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      // Remove self from tracking when it fires
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      cb();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // ===== PAUSE WHEN OUT OF VIEW / TAB HIDDEN =====
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

  // ===== TYPING PHASE (first load only) =====
  useEffect(() => {
    if (phase !== 'typing' || isPaused) return;
    const target = roles[0];

    if (displayText.length === target.length) {
      // Typing done — show bbox briefly, then start looping
      scheduleTimeout(() => setShowBBox(true), 400);
      scheduleTimeout(() => {
        setShowBBox(false);
        setPhase('looping');
      }, 1200);
      return () => clearAllTimeouts();
    }

    scheduleTimeout(() => {
      setDisplayText(target.substring(0, displayText.length + 1));
    }, 80);
    return () => clearAllTimeouts();
  }, [displayText, phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // ===== LOOPING SEQUENCE =====
  // Advances to next layer every ~3.5s, cycling 0→1→2→0→...
  // First run: layer 2 (UX Engineer) gets the stretch animation
  // Subsequent runs: instant swap with brief bbox flash only
  //
  // NOTE: advance() reads from activeIndexRef and calls setState directly
  // (NOT from inside a setState updater) to avoid StrictMode double-invocation
  // scheduling duplicate timeouts — which was causing exponential blow-up
  // and the "50x flash" when returning to a backgrounded tab.
  useEffect(() => {
    if (phase !== 'looping' || isPaused) return;

    const advance = () => {
      const prev = activeIndexRef.current;
      const next = (prev + 1) % roles.length;

      activeIndexRef.current = next;
      setActiveIndex(next);
      setDisplayText(roles[next]);

      // UX Engineer stretch — first run only
      if (next === 2 && isFirstRunRef.current) {
        setHeadlineScale(0.8);
        setShowBBox(true);

        scheduleTimeout(() => {
          setIsStretching(true);
          setHeadlineScale(1);
        }, 300);

        scheduleTimeout(() => {
          setShowBBox(false);
          setIsStretching(false);
        }, 2500);

        scheduleTimeout(advance, 4000);
      } else {
        // Standard transition — brief bbox flash
        setHeadlineScale(1);
        setIsStretching(false);
        setShowBBox(true);

        scheduleTimeout(() => setShowBBox(false), 500);
        scheduleTimeout(advance, 3000);
      }

      // When we cycle back to 0 after completing all 3, first run is over
      if (next === 0 && prev === 2) {
        isFirstRunRef.current = false;
      }
    };

    // Initial delay before first advance (gives time to read current headline)
    scheduleTimeout(advance, 2500);

    return () => clearAllTimeouts();
  }, [phase, isPaused, scheduleTimeout, clearAllTimeouts]);

  // ===== INTERACTIVE LAYER CLICKS =====
  const handleLayerClick = useCallback((index: number) => {
    if (phase !== 'looping' || index === activeIndex) return;

    // Cancel all pending timeouts
    clearAllTimeouts();

    // Apply immediately
    activeIndexRef.current = index;
    setActiveIndex(index);
    setDisplayText(roles[index]);
    setHeadlineScale(1);
    setIsStretching(false);
    setShowBBox(true);

    // Hide bbox after brief flash
    scheduleTimeout(() => setShowBBox(false), 500);

    // Restart the loop after a longer pause
    const advanceFromClick = () => {
      const prev = activeIndexRef.current;
      const next = (prev + 1) % roles.length;
      activeIndexRef.current = next;
      setActiveIndex(next);
      setDisplayText(roles[next]);
      setHeadlineScale(1);
      setIsStretching(false);
      setShowBBox(true);
      scheduleTimeout(() => setShowBBox(false), 500);
      scheduleTimeout(advanceFromClick, 5000);
    };
    scheduleTimeout(advanceFromClick, 5000);
  }, [phase, activeIndex, scheduleTimeout, clearAllTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  return (
    <section className="hero-hybrid" ref={sectionRef}>
      {/* Minimal fixed nav */}
      <nav className="hero-hybrid__nav">
        <div className="hero-hybrid__nav-logo">Ryan DeBoer</div>
        <div className="hero-hybrid__nav-links">
          <a href="#/about">About Me</a>
          <a href="#/work/heatherwood">My Work</a>
          <a href="#/resume">Resume</a>
          <a href="mailto:rdeboer180@gmail.com" className="hero-hybrid__nav-cta">Get in touch</a>
        </div>
      </nav>

      <div className="hero-hybrid__content">
        <div className="hero-hybrid__grid">
          {/* Left: Clean animated text */}
          <div className="hero-hybrid__text">
            <p className="hero-hybrid__eyebrow hero-hybrid__reveal hero-hybrid__reveal--1">
              Senior Web Designer by title. <span>Systems thinker with front-end depth. I operate as a</span>
            </p>

            <div
              className="hero-hybrid__typed-wrap hero-hybrid__reveal hero-hybrid__reveal--2"
              ref={headlineRef}
            >
              {/* Transform bounding box */}
              <div
                className={`hero-hybrid__bbox${showBBox ? ' hero-hybrid__bbox--visible' : ''}`}
                aria-hidden="true"
              >
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tl" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tr" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bl" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--br" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tm" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bm" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--ml" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--mr" />
              </div>

              <h1 className="hero-hybrid__h1-sr-only">
                Design Strategist, Product Designer, UX Engineer
              </h1>

              <span
                className={`hero-hybrid__typed${isStretching ? ' hero-hybrid__typed--stretching' : ''}`}
                style={headlineScale !== 1 ? { transform: `scaleX(${headlineScale})`, transformOrigin: 'left center' } : undefined}
                aria-hidden="true"
              >
                {displayText}
                <span className="hero-hybrid__cursor" />
              </span>
            </div>

            <p className="hero-hybrid__body hero-hybrid__reveal hero-hybrid__reveal--4">Job titles evolve, but the work doesn’t. For 16+ years, I’ve worked at the intersection of UX, front-end, and design systems—planning. Crafting experiences that don’t just look right, but hold up in production. I do my best work where high standards, real collaboration, and thoughtful execution all matter at the same time. My strength is connecting those pieces and turning complexity into something teams can ship and scale.</p>

            <div className="hero-hybrid__actions hero-hybrid__reveal hero-hybrid__reveal--5">
              <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero-hybrid__btn-icon" />
                rdeboer180@gmail.com
              </a>
              <a href="#projects" className="btn btn--secondary btn--lg">
                View my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Profile image with UI overlay elements */}
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

              {/* Floating UI toolkit overlays */}
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--code">
                <img src={uiCodeSvg} alt="" />
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

      {/* Social proof band — full-width separator */}
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
