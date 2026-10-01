import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMAIL_HREF } from '../data/site';
import LayersPanel from './LayersPanel';
import { useUnlock } from '../context/UnlockContext';
import { useHighlightSweep } from '../hooks/useHighlightSweep';

const roles = ['Product Designer', 'Design Systems Designer', 'Design Engineer', 'UI/UX Designer'];
const roleDescriptions = [
  'In product design, I work through flows, states, and tradeoffs with the team, then test whether the experience solves the right problem.',
  'In design systems, I turn shared decisions into tokens, components, and guidance that help designers and engineers build consistently as the product grows.',
  'In design engineering, I build prototypes and tools to test behavior, catch edge cases, and make the decisions behind a product easier to carry through.',
  'In UI/UX design, I connect clear user flows with thoughtful hierarchy, interactions, and states, then test the details across screens and real tasks.',
];

const Hero: React.FC = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [introStage, setIntroStage] = useState('done');
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const mobile = window.matchMedia('(max-width: 850px)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      setIntroStage(mobile ? 'sketch' : 'scrawl');
      const steps: [number, string][] = mobile
        ? [[650, 'lowfi'], [1250, 'final'], [1850, 'done']]
        : [[700, 'sketch'], [1500, 'lowfi'], [2150, 'cursor'], [2900, 'final'], [3500, 'panel'], [4200, 'done']];
      steps.forEach(([delay, stage]) => timers.push(setTimeout(() => setIntroStage(stage), delay)));
    };
    // Start the portrait construction when it enters view.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { play(); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (portraitRef.current) observer.observe(portraitRef.current);
    const settle = () => {
      if (motion.matches) { observer.disconnect(); timers.forEach(clearTimeout); setIntroStage('done'); }
    };
    motion.addEventListener('change', settle);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); motion.removeEventListener('change', settle); };
  }, []);
  const [selectedRole, setSelectedRole] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const { unlocked, openPrompt } = useUnlock();
  const handleWorkNav = () => { setNavOpen(false); if (!unlocked) openPrompt(); };
  const sectionRef = useHighlightSweep<HTMLElement>({ selector: '.animated-bold', activeClass: 'animated-bold--active', settledClass: 'animated-bold--settled', settleOffset: 850, cycleTime: 1900, threshold: 0.15 });
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);
  return (
    <section className="hero hero--contract" ref={sectionRef} data-intro-stage={introStage}>
      <nav className="hero__nav" aria-label="Primary">
        <div className="hero__nav-logo">Ryan DeBoer</div>
        <div className="hero__nav-links">
          <Link to="/about">About</Link>
          <a href="#projects" onClick={handleWorkNav}>Work</a>
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
            <Link to="/about" onClick={() => setNavOpen(false)}>About</Link>
            <a href="#projects" onClick={handleWorkNav}>Work</a>
            <Link to="/notes" onClick={() => setNavOpen(false)}>Notes</Link>
            <Link to="/resume" onClick={() => setNavOpen(false)}>Resume</Link>
            <a href={EMAIL_HREF} className="hero__nav-menu-cta" onClick={() => setNavOpen(false)}>
              Get in touch
            </a>
          </div>
        )}
      </nav>

      <div className="hero-intro">
        <div className="hero-intro__meta"><span>Product design · Design systems · Design engineering</span><div className="hero-intro__location"><span>South Bend, IN / Remote US</span>
            <a href={EMAIL_HREF} className="hero-intro__availability">
              Open to new work opportunities
              <svg viewBox="0 0 240 24" fill="none" aria-hidden="true"><path d="M3 18 C70 18 155 8 230 7 M216 1 L233 7 L218 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
</div></div>
        <div className="hero-intro__grid">
          <div className="hero-intro__copy">
            <h1 className="hero__typed-wrap"><span className="hero__typed-final-gradient">Designer by foundation.</span><span>Builder by curiosity.</span></h1>
            <p>I’m a product designer with deep roots in visual craft and <a href="#systems" className="about__inline-link">design systems</a>. I turn complex workflows into clear interfaces, and use code, agents, and custom tools to carry those decisions into working products.</p>
            <p className="hero-intro__mobile-role">{roleDescriptions[0]}</p>
            <div className="hero-intro__role-story">
              {/* Reserve the tallest paragraph at the current width so selections never move the controls. */}
              {roleDescriptions.map((description, index) => <p key={index} className="hero-intro__role-sizer" aria-hidden="true">{description}</p>)}
              <div className="hero-intro__role-live" aria-live="polite" aria-atomic="true">
                <p key={selectedRole} className="hero-intro__role-paragraph">{roleDescriptions[selectedRole]}</p>
              </div>
            </div>
            <div className="hero-intro__actions"><a href="#projects" className="btn btn--primary btn--lg">Explore my work ↓</a></div>

          </div>
          <div className="hero-intro__portrait" ref={portraitRef}>
            <div className="hero-intro__token-map" aria-label="Portrait border radius token">
              <code>borderRadius: tokens.radius.full</code>
            </div>
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
                      alt="Ryan DeBoer, Product Design Engineer"
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


            </div>
            <div className="hero-intro__roles hero__ui-element hero__ui-element--layers"><LayersPanel roles={roles} activeIndex={selectedRole} onLayerClick={setSelectedRole} compact /></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
