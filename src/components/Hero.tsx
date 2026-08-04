import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.scss';
import { EMAIL_HREF } from '../data/site';
import LayersPanel from './LayersPanel';
import ProficiencyDock from './ProficiencyDock';

// Animated H1 sequence — a craft arc that resolves on the final, static line.
// Each phrase is short (3–4 words) so it stays legible mid-swap on mobile.
const roles = [
  'Fluent in tools',
  'Grounded in craft',
  'Close to code',
  'Care for what ships',
];
const FINAL_INDEX = roles.length - 1;

// The final phrase resolves with an orange highlight on its lead words only.
// "Care for" gets the gradient treatment; " what ships" stays in normal H1 styling.
const FINAL_HIGHLIGHT = 'Care for';
const FINAL_TRAILING = ' what ships';

// Subtle per-role tool action that maps to a CSS modifier on the bbox
const roleActions: Array<'nudge' | 'align' | 'rename' | null> = [
  'nudge', // Fluent in tools — gets selected and slightly nudged
  'align', // Grounded in craft — snaps to alignment guide
  null,    // Close to code — clean swap
  null,    // Care for what ships — leads into the final highlight reveal
];

type Phase =
  | 'typing'
  | 'cycling'
  | 'paused-final'
  | 'cursor-backtrack'
  | 'editing-final'
  | 'gradient-final'
  | 'complete'
  | 'static'; // user clicked a non-final layer post-load — render text, no animation

// ── Intro stage conductor ───────────────────────────────────────────────────
// Single mount effect drives all stage advances from one t0, collected into
// one timeout array. The type machine is gated behind 'type' | 'done'.
// Stage order: scrawl → sketch → lowfi → cursor → final → panel → type → done
// Desktop: sketch@800, lowfi@1700, cursor@2400, final@3200, panel@3750, type via animationend + 4800ms fallback
// Mobile:  sketch@0 (initial), lowfi@400, final@800 (no cursor), type@1300
type IntroStage = 'scrawl' | 'sketch' | 'lowfi' | 'cursor' | 'final' | 'panel' | 'type' | 'done';

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // Pre-place "Designer" so the headline shows the role + cursor from page load.
  // When introStage reaches 'type' the cycling machine sees displayText.length === target.length
  // and schedules the hold → cycling transition automatically.
  const [displayText, setDisplayText] = useState(roles[0]);
  const [phase, setPhase] = useState<Phase>('typing');
  // (the old "-First" rename insertion state has been removed)
  const [showBBox, setShowBBox] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Mobile nav menu (inline links hide below $breakpoint-sm)
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);
  const isMobileInitial = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const [introStage, setIntroStage] = useState<IntroStage>(isMobileInitial ? 'sketch' : 'scrawl');

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const introTimeoutsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(0);
  const lastFlashedRef = useRef<string>('');
  const [flashKey, setFlashKey] = useState(0);
  const highlightsAppliedRef = useRef(false);
  const panelAnimEndRef = useRef<(() => void) | null>(null);

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

  // ── Intro conductor — single mount effect ──────────────────────────────
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      // Jump straight to done — everything renders as final frame immediately
      setIntroStage('done');
      return;
    }

    const ids: number[] = [];
    const schedule = (stage: IntroStage, at: number) => {
      const id = window.setTimeout(() => setIntroStage(stage), at);
      ids.push(id);
    };

    if (isMobile) {
      // Mobile: compact 3-beat build — no scrawl, no cursor stage, no menu, no
      // panel dock. Beats are long enough for the craft marks (crop corners,
      // notes, arrows) to pop + draw before they erase to remnants at 'final'.
      schedule('lowfi', 650);
      schedule('final', 1250);
      schedule('type', 1550);
    } else {
      // Desktop: scrawl@0, sketch@600, lowfi@1400, cursor@2000, final@2750, panel@3250.
      // Trimmed ~600ms vs the prior schedule so the resolved headline lands sooner;
      // the eyebrow (positioning) + pre-placed first phrase are readable from ~0.5s
      // regardless. cursor window = 750ms (2000→2750), covers the ~690ms cursor beat.
      // 'type' is triggered by animationend on the panel dock, with a 4200ms fallback.
      schedule('sketch', 600);
      schedule('lowfi', 1400);
      schedule('cursor', 2000);
      schedule('final', 2750);
      schedule('panel', 3250);

      const fallbackId = window.setTimeout(() => {
        setIntroStage((current) => {
          if (current === 'panel' || current === 'cursor') return 'type';
          return current;
        });
      }, 4200);
      ids.push(fallbackId);
    }

    introTimeoutsRef.current = ids;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Listen for the panel dock animationend to trigger the 'type' stage (desktop)
  useEffect(() => {
    if (introStage !== 'panel') return;
    const panelWrapper = document.querySelector('.hero__ui-element--layers') as HTMLElement | null;
    if (!panelWrapper) return;

    const handler = () => {
      setIntroStage('type');
    };
    panelWrapper.addEventListener('animationend', handler);
    panelAnimEndRef.current = handler;

    return () => {
      panelWrapper.removeEventListener('animationend', handler);
      panelAnimEndRef.current = null;
    };
  }, [introStage]);

  // Mark 'done' once type machine reaches 'complete'
  useEffect(() => {
    if (phase === 'complete' && introStage === 'type') {
      setIntroStage('done');
    }
  }, [phase, introStage]);

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

  // Reduced motion — jump type machine to complete and set intro to done
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setDisplayText(roles[FINAL_INDEX]);
      setActiveIndex(FINAL_INDEX);
      activeIndexRef.current = FINAL_INDEX;
      setPhase('complete');
      setShowBBox(false);
      setIntroStage('done');
    }
  }, []);

  // Flash an orange selection bbox whenever a new layer/role becomes active.
  // Mirrors Adobe/Figma's "I just clicked this layer" feedback before the cursor lands.
  // Gated behind 'type'/'done' so the first flash fires only when the intro completes.
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'typing' && phase !== 'cycling') return;
    const key = `${activeIndex}-sel`;
    if (key === lastFlashedRef.current) return;
    lastFlashedRef.current = key;
    setFlashKey((k) => k + 1);
  }, [activeIndex, phase, introStage]);

  // Typing first role — gated behind intro stage, first character delayed so flash plays first.
  // Timing compressed ~30% vs original (55ms per char, 200ms first-char delay).
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'typing' || isPaused) return;
    const target = roles[0];

    if (displayText.length === target.length) {
      scheduleTimeout(() => setPhase('cycling'), 600); // was 900ms
      return () => clearAllTimeouts();
    }

    const delay = displayText.length === 0 ? 200 : 55; // was 360 / 70ms
    scheduleTimeout(() => {
      setDisplayText(target.substring(0, displayText.length + 1));
    }, delay);

    return () => clearAllTimeouts();
  }, [displayText, phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Cycle remaining roles once
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'cycling' || isPaused) return;

    const advance = () => {
      const next = activeIndexRef.current + 1;
      activeIndexRef.current = next;
      setActiveIndex(next);
      setDisplayText(roles[next]);

      if (next >= FINAL_INDEX) {
        // Final phrase "Care for what ships" has landed plainly — hold a beat,
        // then resolve it (selection sweep + orange highlight on "Care for").
        scheduleTimeout(() => {
          setShowBBox(false);
          setPhase('paused-final');
        }, 600);
        return;
      }

      scheduleTimeout(advance, 750);
    };

    scheduleTimeout(advance, 750);

    return () => clearAllTimeouts();
  }, [phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Pause on final word, then show bbox and begin backtrack
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'paused-final' || isPaused) return;

    // Move H1 to the resolved final title
    activeIndexRef.current = FINAL_INDEX;
    setActiveIndex(FINAL_INDEX);

    scheduleTimeout(() => {
      setShowBBox(true);
      setPhase('cursor-backtrack');
    }, 50);

    return () => clearAllTimeouts();
  }, [phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Cursor moves to the start of "Care for" — compressed 350ms
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'cursor-backtrack' || isPaused) return;

    scheduleTimeout(() => {
      setPhase('editing-final');
    }, 350); // was 450ms

    return () => clearAllTimeouts();
  }, [phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Selection drag across "Care for" — compressed 850ms
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'editing-final' || isPaused) return;

    scheduleTimeout(() => {
      setShowBBox(false);
      setPhase('gradient-final');
    }, 850); // was 1100ms

    return () => clearAllTimeouts();
  }, [phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Gradient reveal then complete — compressed 400ms (was 500ms)
  useEffect(() => {
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase !== 'gradient-final' || isPaused) return;

    scheduleTimeout(() => {
      setPhase('complete');
    }, 400); // was 500ms

    return () => clearAllTimeouts();
  }, [phase, isPaused, introStage, scheduleTimeout, clearAllTimeouts]);

  // Brand-orange selection flash — fires when a new role layer becomes active
  useEffect(() => {
    const isCyclingNewRole = phase === 'cycling' && activeIndex > 0;
    if (!isCyclingNewRole) return;

    const key = `${phase}-${activeIndex}`;
    if (lastFlashedRef.current === key) return;
    lastFlashedRef.current = key;
    setFlashKey((k) => k + 1);
  }, [phase, activeIndex]);

  // After H1 resolves, sweep + bold the highlight spans in the supporting paragraph one at a time.
  // Runs only on the FIRST time phase reaches 'complete' so later clicks don't re-trigger the sweep.
  useEffect(() => {
    if (phase !== 'complete' || highlightsAppliedRef.current) return;
    const body = bodyRef.current;
    if (!body) return;

    const highlights = body.querySelectorAll('.animated-bold, .about__highlight');
    if (highlights.length === 0) return;

    highlightsAppliedRef.current = true;

    // Match the About-section pacing (1.2s per highlight)
    const sweepDuration = 420;
    const holdDuration = 240;
    const fadeOut = 360;
    const cycleTime = sweepDuration + holdDuration + fadeOut + 180;
    // Small breathing room after the gradient lands before the first sweep starts
    const initialDelay = 250;

    const ids: number[] = [];
    highlights.forEach((el, i) => {
      // Match modifier prefix to the element's base class so the shared
      // paintbrush rule fires correctly for either .animated-bold or
      // .about__highlight (BEM modifiers are class-name based).
      const base = el.classList.contains('animated-bold')
        ? 'animated-bold'
        : 'about__highlight';
      const baseDelay = initialDelay + i * cycleTime;
      ids.push(
        window.setTimeout(() => {
          el.classList.add(`${base}--active`);
        }, baseDelay)
      );
      ids.push(
        window.setTimeout(() => {
          el.classList.add(`${base}--bold`);
          el.classList.remove(`${base}--active`);
        }, baseDelay + sweepDuration + holdDuration)
      );
    });

    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [phase]);

  const handleLayerClick = useCallback((index: number) => {
    // Only allow clicks after the intro has handed control to the type machine
    if (introStage !== 'type' && introStage !== 'done') return;
    if (phase === 'typing' || index === activeIndexRef.current) return;

    clearAllTimeouts();
    activeIndexRef.current = index;
    setActiveIndex(index);
    setShowBBox(false);

    if (index === FINAL_INDEX) {
      // Final layer is permanent: jump straight to the resolved highlighted title.
      setDisplayText(roles[FINAL_INDEX]);
      setPhase('complete');
    } else {
      // Non-final click: just statically display the role text — no cycle, no flash, no action animation.
      setDisplayText(roles[index]);
      setPhase('static');
    }
  }, [phase, introStage, clearAllTimeouts]);

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
  // Only animate the per-role tool action during the automatic cycle — never on user clicks.
  const isAutoCycle = phase === 'cycling';
  const currentAction = isAutoCycle ? roleActions[activeIndex] || null : null;

  // Panel layer list mirrors the role list 1:1 — the four animated phrases.
  const dynamicRoles = roles;

  return (
    <section className="hero" ref={sectionRef} data-intro-stage={introStage}>
      <nav className="hero__nav" aria-label="Primary">
        <div className="hero__nav-logo">Ryan DeBoer</div>
        <div className="hero__nav-links">
          <Link to="/about">About Me</Link>
          <a href="#projects">My Work</a>
          <Link to="/notes">Notes</Link>
          <Link to="/resume">Resume</Link>
          <a href={EMAIL_HREF} className="hero__nav-cta">Get in touch</a>
          {/* Mobile-only menu toggle — three "layer rows" that morph to an X;
              the open state reads as selected (corner handles + orange), the
              same grammar as the selection-frame cards. */}
          <button
            type="button"
            className={`hero__nav-toggle${navOpen ? ' hero__nav-toggle--open' : ''}`}
            aria-expanded={navOpen}
            aria-controls="hero-nav-menu"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="hero__nav-toggle-box" aria-hidden="true">
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--tl" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--tr" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--bl" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--br" />
            </span>
          </button>
        </div>
        {navOpen && (
          <div id="hero-nav-menu" className="hero__nav-menu">
            <Link to="/about" onClick={() => setNavOpen(false)}>About Me</Link>
            <a href="#projects" onClick={() => setNavOpen(false)}>My Work</a>
            <Link to="/notes" onClick={() => setNavOpen(false)}>Notes</Link>
            <Link to="/resume" onClick={() => setNavOpen(false)}>Resume</Link>
            <a href={EMAIL_HREF} className="hero__nav-menu-cta" onClick={() => setNavOpen(false)}>
              Get in touch
            </a>
          </div>
        )}
      </nav>

      <div className="hero__content">
        <div className="hero__grid">
          <div className="hero__text">
            <p className="hero__eyebrow hero__reveal hero__reveal--1">
              <span className="hero__eyebrow-title">Product Design Engineer · Systems · Front-End</span>
            </p>

            <div className="hero__typed-wrap hero__reveal hero__reveal--2">
              {/* Full sequence is available to screen readers immediately via this
                  static h1; the visual animation below is decorative (aria-hidden),
                  so no noisy character-by-character live-region announcements. */}
              <h1 className="hero__h1-sr-only">
                Fluent in tools. Grounded in craft. Close to code. Care for what ships.
              </h1>

              {/* Invisible sizer — stacks every phrase in one grid cell so the
                  wrap reserves exactly the tallest phrase's rendered height at
                  the current width. Replaces the old fixed min-height, which
                  left a large empty band under the H1 on phones where the
                  final line didn't actually wrap. */}
              <span className="hero__typed-sizer" aria-hidden="true">
                {roles.slice(0, FINAL_INDEX).map((r) => (
                  <span key={r}>{r}</span>
                ))}
                <span>
                  <span className="hero__final-word-wrap">{FINAL_HIGHLIGHT}</span>
                  {FINAL_TRAILING}
                </span>
              </span>

              <div className="hero__typed-group">
                <span
                  key={phase === 'typing' ? 'typing' : `role-${activeIndex}-${phase}`}
                  className={`hero__typed${phase !== 'typing' ? ' hero__typed--swap' : ''}`}
                  aria-hidden="true"
                >
                  {showResolved ? (
                    <>
                      <span className="hero__final-word-wrap">
                        <span
                          className={`hero__selection${
                            phase === 'editing-final' ? ' hero__selection--active' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={
                            showGradient
                              ? 'hero__typed-final-gradient'
                              : 'hero__typed-final-word'
                          }
                        >
                          {FINAL_HIGHLIGHT}
                        </span>
                        <span
                          className={`hero__cursor hero__cursor--absolute${
                            phase === 'cursor-backtrack' ? ' hero__cursor--backtrack' : ''
                          }${
                            phase === 'editing-final' ? ' hero__cursor--selecting' : ''
                          }${
                            phase === 'complete' ? ' hero__cursor--hide' : ''
                          }`}
                        />
                      </span>
                      {FINAL_TRAILING}
                    </>
                  ) : (
                    <>
                      {displayText}
                      {phase === 'typing' && displayText.length > 0 && <span className="hero__cursor" />}
                    </>
                  )}
                </span>

                {(phase === 'typing' || phase === 'cycling') && (
                  <span
                    key={flashKey}
                    className="hero__bbox-flash"
                    aria-hidden="true"
                  />
                )}

                <div className={`hero__bbox${showBBox ? ' hero__bbox--visible' : ''}${currentAction ? ` hero__bbox--${currentAction}` : ''}`}>
                  <span className="hero__bbox-handle hero__bbox-handle--tl" />
                  <span className="hero__bbox-handle hero__bbox-handle--tr" />
                  <span className="hero__bbox-handle hero__bbox-handle--bl" />
                  <span className="hero__bbox-handle hero__bbox-handle--br" />
                  <span className="hero__bbox-handle hero__bbox-handle--tm" />
                  <span className="hero__bbox-handle hero__bbox-handle--bm" />
                  <span className="hero__bbox-handle hero__bbox-handle--ml" />
                  <span className="hero__bbox-handle hero__bbox-handle--mr" />
                </div>
              </div>
            </div>

            <p className="hero__body hero__reveal hero__reveal--3" ref={bodyRef}>
            I work across product strategy, UX/UI, design systems, and front-end implementation, bringing <span className="animated-bold">craft, care, and production-minded judgment</span> to every stage. My official title has been Senior Web Designer, but the work runs well past the web: my background in visual communication and code carries ideas beyond the artboard and into working products. AI speeds up exploration. <span className="animated-bold">I stay responsible for the decisions, details, and systems behind what ships.</span>
          </p>

            <div className="hero__actions hero__reveal hero__reveal--4">
              <a href={EMAIL_HREF} className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero__btn-icon" />
                Get in touch
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

          <div className="hero__visual">
            {/* ── Intro-only overlay elements — aria-hidden + pointer-events:none ── */}
            {/* Construction-line grid background */}
            <div className="hero__intro-grid" aria-hidden="true" />

            {/* Mono annotation notes — on .hero__visual, with per-note rotations */}
            <div className="hero__intro-note hero__intro-note--shell" aria-hidden="true">.hero__profile-shell</div>
            <div className="hero__intro-note hero__intro-note--radius" aria-hidden="true">--radius-full</div>
            <div className="hero__intro-note hero__intro-note--mask" aria-hidden="true">image-mask: circle</div>
            <div className="hero__intro-note hero__intro-note--motion" aria-hidden="true">motion: draw-in</div>

            {/* Hand-drawn curved arrows — from notes toward the circle/ring */}
            <svg
              className="hero__intro-arrow hero__intro-arrow--1"
              viewBox="0 0 40 40"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 8 C10 10, 20 12, 30 28"
                fill="none"
                stroke="rgba(0,0,0,0.30)"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={1}
              />
              <path
                d="M28 24 L30 28 L26 26"
                fill="none"
                stroke="rgba(0,0,0,0.30)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className="hero__intro-arrow hero__intro-arrow--2"
              viewBox="0 0 40 40"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M36 8 C28 12, 18 16, 8 28"
                fill="none"
                stroke="rgba(0,0,0,0.30)"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={1}
              />
              <path
                d="M10 24 L8 28 L12 26"
                fill="none"
                stroke="rgba(0,0,0,0.30)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Fake pointer cursor arc */}
            <svg
              className="hero__intro-cursor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 2L4 17L7.5 13.5L10.5 20L12.5 19L9.5 12.5L14 12.5Z"
                fill="#1a1a1a"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>

            {/* Right-click context menu — 5 rows, Paste highlighted */}
            <div className="hero__intro-menu" aria-hidden="true">
              <div className="hero__intro-menu__row">Cut<span>⌘X</span></div>
              <div className="hero__intro-menu__row">Copy<span>⌘C</span></div>
              <div className="hero__intro-menu__row hero__intro-menu__row--highlight">Paste<span>⌘V</span></div>
              <div className="hero__intro-menu__row">Duplicate<span>⌘D</span></div>
              <div className="hero__intro-menu__row">Delete<span>⌫</span></div>
            </div>

            <div className="hero__image-container">
              {/* Scrawl SVG — napkin-rough marker strokes, drawn during scrawl stage */}
              <svg
                className="hero__intro-scrawl"
                viewBox="0 0 420 420"
                aria-hidden="true"
                focusable="false"
                style={{ overflow: 'visible' }}
              >
                {/* Wobbly lumpy blob — one fast marker loop that overshoots */}
                <path
                  className="hero__intro-scrawl__blob"
                  d="M120,180 C95,155 95,120 120,100 C148,78 185,72 210,75 C248,78 285,90 305,118 C330,150 338,185 325,215 C312,245 288,268 258,278 C228,288 192,285 165,268 C135,250 118,225 115,198 C112,185 115,182 120,180 Z"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                />
                {/* Squiggle 1 — horizontal scribble below-left */}
                <path
                  className="hero__intro-scrawl__squiggle-1"
                  d="M88,318 C93,314 98,322 103,315 C108,308 113,320 118,313 C123,306 128,318 133,312 C138,306 143,317 148,312 C153,307 158,318 163,315 C168,312 173,316 178,314"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                />
                {/* Squiggle 2 — shorter scribble below squiggle 1 */}
                <path
                  className="hero__intro-scrawl__squiggle-2"
                  d="M100,338 C105,333 110,342 116,336 C122,330 127,340 133,334 C139,328 144,338 150,334 C156,330 160,337 164,334"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                />
                {/* Arrow — curved line from top-right toward blob edge, with arrowhead */}
                <path
                  className="hero__intro-scrawl__arrow"
                  d="M395,60 C375,72 355,90 338,108 C328,118 324,130 330,140 M322,134 L330,140 L335,130"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                />
              </svg>

              {/* Scrawl tick remnant — isolated SVG so mask never touches it */}
              <svg
                className="hero__intro-scrawl-remnant"
                viewBox="0 0 420 420"
                aria-hidden="true"
                focusable="false"
                style={{ overflow: 'visible' }}
              >
                {/* Tick — short stray stroke near blob's top-left */}
                <path
                  className="hero__intro-scrawl__tick"
                  d="M108,92 C112,88 117,94 122,90"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                />
              </svg>

              {/* Eraser block — sweeps across scrawl area at scrawl→sketch boundary */}
              <div className="hero__intro-eraser" aria-hidden="true" />

              {/* Sketch SVG INSIDE image-container — concentric with profile circle */}
              <svg
                className="hero__intro-sketch"
                viewBox="0 0 420 420"
                aria-hidden="true"
                focusable="false"
              >
                {/* Crosshair construction lines */}
                <line
                  x1="0" y1="210" x2="420" y2="210"
                  stroke="rgba(0,0,0,0.14)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                  className="hero__intro-sketch__hline"
                />
                <line
                  x1="210" y1="0" x2="210" y2="420"
                  stroke="rgba(0,0,0,0.14)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                  className="hero__intro-sketch__vline"
                />
                {/* Two wobbly sketch circles */}
                <circle cx="212" cy="208" r="205" pathLength={1} />
                <circle cx="208" cy="212" r="198" pathLength={1} />
                {/* Pencil placeholder silhouette: head arc + shoulder curve */}
                <path
                  className="hero__intro-sketch__silhouette"
                  d="M175 165 C175 135, 245 135, 245 165 C245 195, 230 210, 210 210 C190 210, 175 195, 175 165 Z M155 270 C160 235, 175 218, 210 215 C245 218, 260 235, 265 270"
                  fill="none"
                  stroke="rgba(0,0,0,0.18)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                />
              </svg>

              {/* Orange ring draw-in overlay — INSIDE image-container, inset:0 */}
              <svg
                className="hero__intro-ring"
                viewBox="0 0 420 420"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="210" cy="210" r="199" pathLength={1} />
              </svg>

              {/* Corner crop marks — INSIDE image-container */}
              <div className="hero__intro-crop" aria-hidden="true">
                <span className="hero__intro-crop__tl" />
                <span className="hero__intro-crop__tr" />
                <span className="hero__intro-crop__bl" />
                <span className="hero__intro-crop__br" />
              </div>
              <div className="hero__image-wrapper hero__profile">
                <div className="hero__profile-shell">
                  <div className="hero__profile-selection" aria-hidden="true">
                    <span className="hero__profile-handle hero__profile-handle--tl" />
                    <span className="hero__profile-handle hero__profile-handle--br" />
                  </div>
                  <div className="hero__profile-frame">
                    <img
                      src="/images/hero/ryan-deboer-2026.jpeg"
                      alt="Ryan Deboer"
                      className="hero__profile-img"
                      width={1600}
                      height={1600}
                      fetchPriority="high"
                    />
                  </div>
                </div>

                <div className="hero__profile-label hero__profile-label--layer" aria-hidden="true">
                  <span>layer</span> / 01 Portfolio image
                </div>
              </div>

              {/* DevTools-style tag indicator pointing at the portrait layer */}
              <div
                className="hero__ui-element hero__ui-element--tag-indicator"
                aria-hidden="true"
              >
                <div className="hero__tag-indicator">
                  <span className="hero__tag-indicator-selector">
                    <span className="hero__tag-indicator-tag">div</span>
                    <span className="hero__tag-indicator-class">.hero__profile-shell</span>
                  </span>
                  <span className="hero__tag-indicator-dims">480&thinsp;&times;&thinsp;480</span>
                </div>
              </div>
              <div className="hero__ui-element hero__ui-element--layers">
                <LayersPanel
                  ref={panelRef}
                  activeIndex={activeIndex}
                  onLayerClick={handleLayerClick}
                  roles={dynamicRoles}
                  action={currentAction}
                  showProfileGroup={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__proof-band">
        <div className="hero__proof-inner">
          <ProficiencyDock testimonialsHref="#testimonials" />
        </div>
        <div className="hero__proof-angle" />
      </div>
    </section>
  );
};

export default Hero;
