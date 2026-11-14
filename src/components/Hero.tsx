import ProjectLink from './ProjectLink';
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMAIL_HREF } from '../data/site';
import LayersPanel from './LayersPanel';
import { progression } from './About';
import AuthoredSection from './AuthoredSection';
import { AUTHORED_COMPONENTS } from '../data/authorChrome';
import { useHighlightSweep } from '../hooks/useHighlightSweep';
import { useReveal } from '../hooks/useReveal';
import { useHeroRoleTransition } from '../hooks/useHeroRoleTransition';

const roles = ['Product Designer', 'System Designer', 'Design Engineer', 'UI/UX Designer', 'Brand Engineer'];
// Design Engineer leads (23 Oct 2026): the ContinuED Senior Design Engineer
// application is the priority going into the week of 26 Oct.
const defaultRole = 2;
// The dated career rule under the hero; off while Ryan tries the hero without it.
const SHOW_HISTORY = false;
const roleDescriptions: React.ReactNode[] = [
  <>I decide what a product needs and what it should leave out. I designed <ProjectLink to="/work/wheelrack/" className="about__inline-link">WheelRack</ProjectLink>&rsquo;s dealer journey from vehicle search through checkout, and I am now simplifying <ProjectLink to="/work/playdraft/" className="about__inline-link">PlayDraft</ProjectLink> after building too much around the core game.</>,
  <>I keep one set of rules in step across Figma, code, and AEM. My <strong><ProjectLink to="/work/wheelrack/" className="about__inline-link">WheelRack</ProjectLink></strong> Figma tokens and components became one React and Storybook library shared across its retail partners. For <strong><ProjectLink to="/work/aem-component-system/" className="about__inline-link">our AEM components</ProjectLink></strong>, I spec the variants in Figma, build them in production Sass, and document the rules, so SEO authors and agents can build pages without waiting on me.</>,
  <>When a static comp cannot answer the question, I prototype it in code, so engineers and agents build from the same decision. My <Link to="/prototypingPlayground/" className="about__inline-link">Prototyping Playground</Link> takes an idea past the canvas, and <Link to="/notes/prototyping-wheelrack-fitment/" className="about__inline-link">WheelRack&rsquo;s</Link> shows the states a spec frame missed.</>,
  <>I make complex choices easier to compare and act on. The <ProjectLink to="/work/tire-categories/" className="about__inline-link">tire-category redesign</ProjectLink> lifted conversion on its top pages in the first month. <ProjectLink to="/work/loopstack/" className="about__inline-link">LoopStack</ProjectLink>, my open-source SaaS for the Loop community, turns repeated meal responses into patterns worth reviewing with a care team, and it never gives dosing advice.</>,
  <>I put brand standards into the tools people already use: a <ProjectLink to="/work/figma-template-governance/" className="about__inline-link">Figma starter kit and internal plugins</ProjectLink> for the Web and UX designers I work with, and one mark and motion ident for <ProjectLink to="/work/overscroll-tactics/" className="about__inline-link">Overscroll Tactics</ProjectLink> that works on the web and in PlayDraft.</>,
];

const Hero: React.FC = () => {
  const [headlineRef, headlineVisible] = useReveal<HTMLHeadingElement>(0.3);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [introStage, setIntroStage] = useState('done');
  const [inkStarted, setInkStarted] = useState(false);
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { setInkStarted(true); return; }
    const mobile = window.matchMedia('(max-width: 1023px)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      setInkStarted(true);
      setIntroStage('sketch');
      // The fidelity pass (F1, 11 November 2026): pencil sketch, then a wireframe
      // placeholder ('lowfi'), then the photo wiping down in greyscale ('grey'),
      // then colour as the orange ring draws ('final'), while a hand drags the
      // Roles panel in by its title bar (from 1500ms, so it ends by 2180ms).
      const steps: [number, string][] = mobile
        ? [[600, 'lowfi'], [950, 'grey'], [1300, 'final'], [2050, 'done']]   // done after the panel's 680ms drag (tablets show it)
        : [[700, 'lowfi'], [1100, 'grey'], [1500, 'final'], [2000, 'panel'], [2250, 'done']];
      steps.forEach(([delay, stage]) => timers.push(setTimeout(() => setIntroStage(stage), delay)));
    };
    // Start the portrait construction when it enters view.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { play(); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (portraitRef.current) observer.observe(portraitRef.current);
    // Direct links below the hero still receive the settled section background.
    timers.push(setTimeout(() => setInkStarted(true), 3500));
    const settle = () => {
      if (motion.matches) { observer.disconnect(); timers.forEach(clearTimeout); setIntroStage('done'); setInkStarted(true); }
    };
    motion.addEventListener('change', settle);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); motion.removeEventListener('change', settle); };
  }, []);
  const { selectedRole, displayedRole, switching, input, selectRole } = useHeroRoleTransition(defaultRole);
  const roleStoryId = useId();
  const [navOpen, setNavOpen] = useState(false);
  // Work scrolls to the binder and asks nothing (canvas N1): a locked card
  // offers its overview first, so the nav no longer raises the password prompt.
  const handleWorkNav = () => setNavOpen(false);
  const sectionRef = useHighlightSweep<HTMLElement>({ selector: '.animated-bold', activeClass: 'animated-bold--active', settledClass: 'animated-bold--settled', settleOffset: 850, cycleTime: 1900, threshold: 0.15 });
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);
  return (
    <section id="intro" className="hero hero--contract" ref={sectionRef} data-intro-stage={introStage} data-ink-started={inkStarted}>
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
        <div className="hero-intro__grid">
          <div className="hero-intro__copy">
            <AuthoredSection {...AUTHORED_COMPONENTS.heroTitle} className="authored--above">
            <h1 ref={headlineRef} className={`hero__typed-wrap hero-intro__headline${headlineVisible ? ' is-visible' : ''}`}>
                <span className="hero-intro__headline-line"><span className="hero-intro__headline-text hero__typed-final-gradient">Passionate Designer</span></span>
                <span className="hero-intro__headline-line"><span className="hero-intro__headline-text">Curious Builder</span></span>
              </h1>
            </AuthoredSection>
            <AuthoredSection {...AUTHORED_COMPONENTS.heroText} className="authored--above">
              <p>I learn by building things I will have to maintain. I fight for consistency and simplicity because the tools can change.{' '}<br className="hero-intro__break" aria-hidden="true" /><strong className="animated-bold">Giving a damn does not.</strong></p>
              <p className="hero-intro__mobile-role">{roleDescriptions[defaultRole]}</p>
              <div className={`hero-intro__role-story${switching ? ' hero-intro__role-story--switching' : ''}`} data-role-input={input}>
                {/* Reserve the tallest paragraph at the current width so selections never move the controls. */}
                {roleDescriptions.map((description, index) => <p key={index} className="hero-intro__role-sizer" aria-hidden="true" inert>{description}</p>)}
                <div id={roleStoryId} className="hero-intro__role-live" aria-live="polite" aria-atomic="true" aria-busy={switching}>
                  <p className="hero-intro__role-paragraph">{roleDescriptions[displayedRole]}</p>
                </div>
                {switching && <span key={selectedRole} className="hero-intro__role-orb" aria-hidden="true"><span /></span>}
              </div>
            </AuthoredSection>
            <AuthoredSection {...AUTHORED_COMPONENTS.heroByline} className="authored--above hero-intro__byline-slot">
              {/* Status and place on one line (canvas L4); the name is in the nav. */}
              <p className="hero-intro__byline hero-intro__byline--inline">
                <a href={EMAIL_HREF} className="hero-intro__status">
                  <span className="hero-intro__status-dot" aria-hidden="true" />Open to new work
                </a>
                <span className="hero-intro__byline-place">South Bend, IN / Remote US, Eastern Time</span>
              </p>
            </AuthoredSection>
          </div>
          <AuthoredSection {...AUTHORED_COMPONENTS.heroPortrait} className="authored--above hero-intro__portrait-slot">
          <div className="hero-intro__portrait" ref={portraitRef}>
            {/* ── Intro-only overlay elements — aria-hidden + pointer-events:none ── */}
            {/* Construction-line grid background */}
            <div className="hero__intro-grid" aria-hidden="true" />

            <div className="hero__image-container">
              {/* Sketch SVG INSIDE image-container — concentric with profile circle */}
              <svg
                className="hero__intro-sketch"
                viewBox="0 0 420 420"
                aria-hidden="true"
                focusable="false"
              >
                {/* The pencil, in two passes: each crosshair line and the circle are drawn
                    twice, the second lighter and a little off, and the circle runs past
                    where it started, as a hand does. */}
                <path className="hero__intro-sketch__line hero__intro-sketch__line--h1" d="M4 211 L416 208" pathLength={1} />
                <path className="hero__intro-sketch__line hero__intro-sketch__line--h2 hero__intro-sketch__line--ghost" d="M12 207 L408 212" pathLength={1} />
                <path className="hero__intro-sketch__line hero__intro-sketch__line--v1" d="M209 4 L212 416" pathLength={1} />
                <path className="hero__intro-sketch__line hero__intro-sketch__line--v2 hero__intro-sketch__line--ghost" d="M213 12 L208 408" pathLength={1} />
                <path className="hero__intro-sketch__line hero__intro-sketch__line--c1" d="M175.9 9.7 L193.4 7.4 L211.0 6.7 L228.6 7.6 L246.1 10.1 L263.2 14.2 L279.8 19.9 L295.9 26.9 L311.3 35.3 L325.9 44.9 L339.6 55.7 L352.4 67.6 L364.1 80.5 L374.7 94.4 L384.2 109.0 L392.4 124.4 L399.4 140.4 L405.0 157.0 L409.1 174.1 L411.8 191.4 L412.9 209.0 L412.5 226.6 L410.5 244.2 L406.8 261.5 L401.6 278.4 L394.9 294.7 L386.6 310.4 L377.0 325.2 L366.0 339.1 L353.9 351.9 L340.7 363.5 L326.5 374.0 L311.5 383.1 L295.8 391.0 L279.6 397.4 L262.9 402.5 L245.8 406.2 L228.5 408.5 L211.0 409.4 L193.5 408.9 L176.1 406.9 L158.9 403.4 L142.0 398.5 L125.6 392.1 L109.8 384.3 L94.7 375.0 L80.5 364.5 L67.3 352.7 L55.3 339.7 L44.5 325.6 L35.0 310.6 L27.0 294.8 L20.4 278.4 L15.4 261.4 L11.9 244.1 L9.9 226.6 L9.5 209.0 L10.6 191.5 L13.1 174.1 L17.0 157.0 L22.4 140.3 L29.0 124.2 L37.0 108.6 L46.3 93.7 L56.7 79.6 L68.4 66.4 L81.1 54.2 L94.9 43.2 L109.6 33.3 L125.1 24.9 L141.4 17.8 L158.3 12.3 L175.6 8.4 L193.2 6.0 L211.0 5.3" pathLength={1} />
                <path className="hero__intro-sketch__line hero__intro-sketch__line--c2 hero__intro-sketch__line--ghost" d="M306.7 382.9 L291.3 390.7 L275.4 397.2 L259.0 402.3 L242.2 406.0 L225.2 408.2 L208.0 409.0 L190.8 408.3 L173.8 406.2 L156.9 402.6 L140.5 397.5 L124.5 391.1 L109.1 383.3 L94.4 374.2 L80.6 363.8 L67.7 352.3 L55.8 339.7 L45.1 326.0 L35.7 311.5 L27.5 296.2 L20.7 280.2 L15.4 263.6 L11.5 246.6 L9.2 229.4 L8.5 212.0 L9.2 194.6 L11.6 177.4 L15.4 160.4 L20.7 143.8 L27.5 127.8 L35.7 112.5 L45.1 98.0 L55.8 84.3 L67.6 71.6 L80.5 60.1 L94.3 49.7 L109.0 40.5 L124.4 32.6 L140.3 26.1 L156.8 21.0 L173.7 17.3 L190.8 15.1 L208.0 14.3 L225.2 15.0 L242.4 17.1 L259.2 20.8 L275.8 25.8 L291.8 32.3 L307.2 40.1 L322.0 49.2 L335.9 59.6 L348.8 71.2 L360.7 83.9 L371.4 97.6 L380.9 112.1 L389.1 127.5 L395.9 143.6 L401.3 160.2 L405.1 177.2 L407.5 194.5 L408.2 212.0 L407.5 229.5 L405.1 246.8 L401.3 263.8 L395.9 280.4 L389.1 296.5 L380.9 311.8 L371.4 326.4 L360.7 340.1 L348.8 352.8 L335.9 364.5 L322.1 374.9 L307.4 384.1 L291.9 392.0" pathLength={1} />
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
                    {/* The wireframe stage: the image placeholder every wireframe draws. */}
                    <span className="hero__profile-wire" aria-hidden="true">
                      <svg viewBox="0 0 400 400" focusable="false"><path d="M58.6 58.6 L341.4 341.4 M341.4 58.6 L58.6 341.4" /></svg>
                      <span>image</span>
                    </span>
                    <img
                      src="/images/hero/ryan-deboer-2026.jpeg"
                      srcSet="/images/hero/ryan-deboer-2026-800.webp 800w, /images/hero/ryan-deboer-2026-1200.webp 1200w, /images/hero/ryan-deboer-2026.jpeg 1600w"
                      sizes="(max-width: 1023px) 316px, 400px"
                      alt="Ryan DeBoer, product designer"
                      className="hero__profile-img"
                      width={1600}
                      height={1600}
                      fetchPriority="high"
                    />
                  </div>
                </div>

              </div>
            </div>
            <div className="hero-intro__roles hero__ui-element hero__ui-element--layers">
              {/* The hand that drags the panel into place as the intro ends, drawn the
                  way the cursor looks in Photoshop and Figma: a pointing finger on the
                  title bar, a gripping hand while it drags, the finger again on release.
                  Drawn, never the real cursor. */}
              <span className="hero-intro__grab" aria-hidden="true">
                <svg className="hero-intro__grab-point" viewBox="0 0 24 24" focusable="false">
                  <path d="M7.4 4.1A1.6 1.6 0 0 1 10.6 4.1V9.6A1.6 1.6 0 0 1 13.8 9.6V10.2A1.6 1.6 0 0 1 17 10.2V11.2A1.6 1.6 0 0 1 20.2 11.2V15.9C20.2 19 17.7 21.5 14.6 21.5H12.6C10.6 21.5 8.9 20.6 7.6 19.1L3.6 14.4A1.6 1.6 0 0 1 6 12.2L7.4 13.6Z" />
                  <path className="hero-intro__grab-crease" d="M10.6 9.6V13.2M13.8 10.2V13.4M17 11.2V13.6" />
                </svg>
                <svg className="hero-intro__grab-grip" viewBox="0 0 24 24" focusable="false">
                  <path d="M6.2 10.4A1.5 1.5 0 0 1 9.2 10.4A1.5 1.5 0 0 1 12.2 10.4A1.5 1.5 0 0 1 15.2 10.4A1.5 1.5 0 0 1 18.2 10.6V15.2C18.2 18.6 15.6 21 12.4 21H11.4C8.6 21 6.4 19 5.9 16.3L5.5 14.2C5.3 13.2 4.7 12.8 4.2 12.5A1.4 1.4 0 0 1 5.5 10.2C5.9 10.4 6.2 10.8 6.2 11.4Z" />
                  <path className="hero-intro__grab-crease" d="M9.2 10.4V12.6M12.2 10.4V12.6M15.2 10.4V12.6" />
                </svg>
              </span>
              <div className="hero-intro__roles-cast"><LayersPanel roles={roles} activeIndex={selectedRole} onLayerClick={selectRole} controlsId={roleStoryId} compact /></div></div>
          </div>
          </AuthoredSection>
        </div>
        {/* The career at a glance, from the About page's progression, so the two never drift.
            Hidden for now (Ryan, 10 Nov 2026): set SHOW_HISTORY to bring it back. */}
        {SHOW_HISTORY && <ol className="hero-history" aria-label="Career, by year">
          {progression.map((step, index) => {
            const now = index === progression.length - 1;
            return (
              <li key={step.date} className={`hero-history__step${now ? ' hero-history__step--now' : ''}`} aria-current={now ? 'step' : undefined}>
                <span className="hero-history__date">{step.date}</span>
                <strong className="hero-history__title">{step.title}</strong>
                <span className="hero-history__label">{step.short}</span>
                {now && <Link to="/about" className="hero-history__more">The fuller story <span aria-hidden="true">→</span></Link>}
              </li>
            );
          })}
        </ol>}
      </div>
    </section>
  );
};
export default Hero;
