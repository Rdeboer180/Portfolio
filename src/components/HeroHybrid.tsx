import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/styles.scss';
import uiCodeSvg from '../assets/ui/ui_code.svg';
import uiPromptSvg from '../assets/ui/ui_prompt.svg';
import LayersPanel from './LayersPanel';

const proficiencies = [
  { src: '/images/proficiencies/figma.svg', alt: 'Figma', bg: '#f3e8ff' },
  { src: '/images/proficiencies/scss.png', alt: 'SCSS' },
  { src: '/images/proficiencies/chakra.png', alt: 'Chakra UI' },
  { src: '/images/proficiencies/illustrator.png', alt: 'Illustrator' },
  { src: '/images/proficiencies/photoshop.png', alt: 'Photoshop' },
  { src: '/images/proficiencies/aem.png', alt: 'AEM' },
  { src: '/images/proficiencies/wordpress.png', alt: 'WordPress' },
  { src: '/images/proficiencies/css3.png', alt: 'CSS3' },
  { src: '/images/proficiencies/html5.png', alt: 'HTML5', bg: '#dcfce7' },
  { src: '/images/proficiencies/github.png', alt: 'GitHub' },
  { src: '/images/proficiencies/vscode.png', alt: 'VS Code' },
];

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

  // Refs
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<number>(0);

  // ===== TYPING PHASE (first load only) =====
  useEffect(() => {
    if (phase !== 'typing') return;
    const target = roles[0];

    if (displayText.length === target.length) {
      // Typing done — show bbox briefly, then start looping
      const t1 = window.setTimeout(() => setShowBBox(true), 400);
      const t2 = window.setTimeout(() => {
        setShowBBox(false);
        setPhase('looping');
      }, 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    const id = setTimeout(() => {
      setDisplayText(target.substring(0, displayText.length + 1));
    }, 80);
    return () => clearTimeout(id);
  }, [displayText, phase]);

  // ===== LOOPING SEQUENCE =====
  // Advances to next layer every ~3.5s, cycling 0→1→2→0→...
  // First run: layer 2 (UX Engineer) gets the stretch animation
  // Subsequent runs: instant swap with brief bbox flash only
  useEffect(() => {
    if (phase !== 'looping') return;

    const advance = () => {
      setActiveIndex(prev => {
        const next = (prev + 1) % roles.length;

        // Set the text instantly
        setDisplayText(roles[next]);

        // UX Engineer stretch — first run only
        if (next === 2 && isFirstRunRef.current) {
          setHeadlineScale(0.8);
          setShowBBox(true);

          const t1 = window.setTimeout(() => {
            setIsStretching(true);
            setHeadlineScale(1);
          }, 300);

          const t2 = window.setTimeout(() => {
            setShowBBox(false);
            setIsStretching(false);
          }, 2500);

          loopRef.current = window.setTimeout(advance, 4000);
          // Store timeouts for cleanup
          (loopRef as any)._subs = [t1, t2];
        } else {
          // Standard transition — brief bbox flash
          setHeadlineScale(1);
          setIsStretching(false);
          setShowBBox(true);

          const t1 = window.setTimeout(() => setShowBBox(false), 500);
          loopRef.current = window.setTimeout(advance, 3000);
          (loopRef as any)._subs = [t1];
        }

        // When we cycle back to 0 after completing all 3, first run is over
        if (next === 0 && prev === 2) {
          isFirstRunRef.current = false;
        }

        return next;
      });
    };

    // Initial delay before first advance (gives time to read current headline)
    loopRef.current = window.setTimeout(advance, 2500);

    return () => {
      window.clearTimeout(loopRef.current);
      const subs = (loopRef as any)._subs;
      if (subs) subs.forEach((id: number) => window.clearTimeout(id));
    };
  }, [phase]);

  // ===== INTERACTIVE LAYER CLICKS =====
  const handleLayerClick = useCallback((index: number) => {
    if (phase !== 'looping' || index === activeIndex) return;

    // Cancel the auto-advance loop
    window.clearTimeout(loopRef.current);
    const subs = (loopRef as any)._subs;
    if (subs) subs.forEach((id: number) => window.clearTimeout(id));

    // Apply immediately
    setActiveIndex(index);
    setDisplayText(roles[index]);
    setHeadlineScale(1);
    setIsStretching(false);
    setShowBBox(true);

    // Hide bbox after brief flash
    const t1 = window.setTimeout(() => setShowBBox(false), 500);

    // Restart the loop after a pause
    loopRef.current = window.setTimeout(() => {
      // Re-trigger the looping effect by toggling phase
      // But we can just schedule the next advance inline
      const advanceFromClick = () => {
        setActiveIndex(prev => {
          const next = (prev + 1) % roles.length;
          setDisplayText(roles[next]);
          setHeadlineScale(1);
          setIsStretching(false);
          setShowBBox(true);
          const hide = window.setTimeout(() => setShowBBox(false), 500);
          loopRef.current = window.setTimeout(advanceFromClick, 5000);
          (loopRef as any)._subs = [hide];
          return next;
        });
      };
      loopRef.current = window.setTimeout(advanceFromClick, 5000);
    }, 0);

    (loopRef as any)._subs = [t1];
  }, [phase, activeIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.clearTimeout(loopRef.current);
      const subs = (loopRef as any)._subs;
      if (subs) subs.forEach((id: number) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="hero-hybrid">
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
          <div className="hero-hybrid__proof-left">
            <p className="hero-hybrid__proof-label">Core Proficiencies</p>
            <div className="hero-hybrid__proof-icons">
              {proficiencies.map((icon, i) => (
                <div
                  key={i}
                  className="hero-hybrid__proof-icon"
                  title={icon.alt}
                >
                  <img src={icon.src} alt={icon.alt} />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-hybrid__proof-divider" />
          <div className="hero-hybrid__proof-right">
            <p className="hero-hybrid__proof-text">
              The best signal of how I work isn't what I say—it's what the people I've worked with say.
            </p>
            <a href="#testimonials" className="hero-hybrid__proof-cta">
              View Testimonials
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-hybrid__proof-angle" />
      </div>
    </section>
  );
};

export default HeroHybrid;
