import ProjectLink from './ProjectLink';
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMAIL_HREF } from '../data/site';
import LayersPanel from './LayersPanel';
import AuthoredSection from './AuthoredSection';
import { AUTHORED_COMPONENTS } from '../data/authorChrome';
import { useUnlock } from '../context/UnlockContext';
import { useHighlightSweep } from '../hooks/useHighlightSweep';
import { useReveal } from '../hooks/useReveal';
import { useHeroRoleTransition } from '../hooks/useHeroRoleTransition';

const roles = ['Product Designer', 'System Designer', 'Design Engineer', 'UI/UX Designer', 'Brand Engineer'];
// Design Engineer leads (23 Oct 2026): the ContinuED Senior Design Engineer
// application is the priority going into the week of 26 Oct.
const defaultRole = 2;
const roleDescriptions: React.ReactNode[] = [
  <>I decide what a product needs and what it should leave out. I designed <ProjectLink to="/work/wheelrack/" className="about__inline-link">WheelRack</ProjectLink>&rsquo;s dealer journey from vehicle search through checkout, and I am now simplifying <ProjectLink to="/work/playdraft/" className="about__inline-link">PlayDraft</ProjectLink> after building too much around the core game.</>,
  <>I keep one set of rules in step across Figma, code, and AEM. My <strong><ProjectLink to="/work/wheelrack/" className="about__inline-link">WheelRack</ProjectLink></strong> Figma tokens and components became one React and Storybook library shared across its retail partners. For <strong><ProjectLink to="/work/aem-component-system/" className="about__inline-link">our AEM components</ProjectLink></strong>, I spec the variants in Figma, build them in production Sass, and document the rules, so SEO authors and agents can build pages without waiting on me.</>,
  <>When a static comp cannot answer the question, I prototype it in code and write down what it settled, so engineers and agents build from the same decision. <Link to="/notes/prototyping-wheelrack-fitment/" className="about__inline-link">WheelRack&rsquo;s fitment prototype</Link> shows the states, transitions and reduced-motion version a spec frame could not, my <ProjectLink to="/work/design-enablement/" className="about__inline-link">responsive crop simulator</ProjectLink> checks images against production breakpoints before they reach AEM, and I built <ProjectLink to="/work/bolus-binder/" className="about__inline-link">Bolus Binder</ProjectLink>, a React Native app, with Claude Code working from a taste file I wrote.</>,
  <>I make complex choices easier to compare and act on. The <ProjectLink to="/work/tire-categories/" className="about__inline-link">tire-category redesign</ProjectLink> lifted conversion on its top pages in the first month. <ProjectLink to="/work/loopstack/" className="about__inline-link">LoopStack</ProjectLink> turns repeated meal responses into patterns worth reviewing with a care team, and it never gives dosing advice.</>,
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
    const mobile = window.matchMedia('(max-width: 850px)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      setInkStarted(true);
      setIntroStage('sketch');
      const steps: [number, string][] = mobile
        ? [[650, 'lowfi'], [1250, 'final'], [1850, 'done']]
        : [[800, 'lowfi'], [1450, 'cursor'], [2200, 'final'], [2800, 'panel'], [3500, 'done']];
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
              <p>I learn by building things I will have to maintain, and that taught me to write my judgment down. Professionally and in my own projects, that means Figma MCP prototypes, rules governance teams can follow, and taste files an agent can build from, so the work stays consistent when I am not in the room. I fight for consistency and simplicity because the tools can change. <strong className="animated-bold">Giving a damn does not.</strong></p>
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
              <p className="hero-intro__byline">
                <span className="hero-intro__byline-name">Ryan DeBoer</span>
                <span className="hero-intro__byline-place">South Bend, IN / Remote US, Eastern Time</span>
              </p>
              <a href={EMAIL_HREF} className="hero-intro__status hero-intro__status--stacked">
                <span className="hero-intro__status-dot" aria-hidden="true" />Open to new work
              </a>
            </AuthoredSection>
          </div>
          <AuthoredSection {...AUTHORED_COMPONENTS.heroPortrait} className="authored--above hero-intro__portrait-slot">
          <div className="hero-intro__portrait" ref={portraitRef}>
            <a href={EMAIL_HREF} className="hero-intro__status hero-intro__status--portrait">
              <span className="hero-intro__status-dot" aria-hidden="true" />Open to new work
            </a>
            <div className="hero-intro__token-map" aria-label="Portrait border radius token">
              <code>borderRadius: tokens.radius.full</code>
            </div>
            {/* ── Intro-only overlay elements — aria-hidden + pointer-events:none ── */}
            {/* Construction-line grid background */}
            <div className="hero__intro-grid" aria-hidden="true" />

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
                      srcSet="/images/hero/ryan-deboer-2026-800.webp 800w, /images/hero/ryan-deboer-2026-1200.webp 1200w, /images/hero/ryan-deboer-2026.jpeg 1600w"
                      sizes="(max-width: 850px) 300px, 400px"
                      alt="Ryan DeBoer, product designer"
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
            <div className="hero-intro__roles hero__ui-element hero__ui-element--layers"><div className="hero-intro__roles-cast"><LayersPanel roles={roles} activeIndex={selectedRole} onLayerClick={selectRole} controlsId={roleStoryId} compact /></div></div>
          </div>
          </AuthoredSection>
        </div>
      </div>
    </section>
  );
};
export default Hero;
