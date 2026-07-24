// ============================================
// CaseStudyPlayground — "shadowbox + tool coin tray" case studies carousel
// All public case studies as shadowbox cards (preview / minimal copy / coin
// tray) in a scroll-snap carousel paged by hand-sketched arrows that draw in
// on scroll (same artistic language as the hero arrows).
// Coins: first hover/focus drops the card's real tool icons into its tray;
// un-hover lets them fall out the bottom and vanish — replayable every hover.
// framer-motion only. Reduced-motion → fade in/out, no physics.
// ============================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionBadge from './SectionBadge';
import projects from '../data/projects';
import { useReveal } from '../hooks/useReveal';

// ── Stream chips — two-stream taxonomy ──────────────────────────────────────
// Treatment-based, both orange (no second hue): professional = solid filled
// pill, passion = dashed outline pill. Labels stay short; full stream names
// live in the section intro + case-study hero.

const STREAM_LABEL: Record<'professional' | 'passion', string> = {
  professional: '[ Shipped ]',
  passion: '[ Self-Built ]',
};

// ── Card cover video ─────────────────────────────────────────────────────────
// Default: plays only while its card is active — poster (the featured image)
// everywhere else, playback driven by the same phase machine as the coin tray
// (hover/focus on desktop, in-view on touch).
// Primary (`featuredVideoPrimary`): the loop IS the card's media — plays
// whenever the card is on screen, pauses off-screen (WCAG 2.2.2 / battery).
// Reduced-motion renders the plain poster image for both (handled by caller).

const CardVideo: React.FC<{
  src: string;
  poster: string;
  alt: string;
  playing: boolean;
  primary?: boolean;
}> = ({ src, poster, alt, playing, primary }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  // Primary loops drive themselves from visibility, not hover
  useEffect(() => {
    if (!primary) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [primary]);

  const shouldPlay = primary ? inView : playing;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldPlay) {
      const p = el.play();
      if (p) p.catch(() => {}); // autoplay guard — poster remains
    } else {
      el.pause();
    }
  }, [shouldPlay]);

  return (
    <video
      ref={ref}
      className={primary ? 'case-playground__video--primary' : undefined}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={primary ? 'auto' : 'metadata'}
      aria-label={alt}
    />
  );
};

const BriefcaseIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" stroke="none">
    <path d="M55.44,27.02c-.712-.237-15.402-.037-16.58-.1A3.601,3.601,0,0,1,36.29,25.84l-4.97-5.09a5.609,5.609,0,0,0-4-1.69H19.08a5.739,5.739,0,0,0-6.55,5.59v3.53H7.73A3.739,3.739,0,0,0,4,31.92V54.35a5.275,5.275,0,0,0,5.26,5.27H54.41A5.601,5.601,0,0,0,60,54.02V32.52A5.595,5.595,0,0,0,55.44,27.02ZM12.53,54.35A3.265,3.265,0,0,1,6,54.35V31.92a1.739,1.739,0,0,1,1.73-1.74H12.53Z" />
    <path d="M27.32,17.06a7.613,7.613,0,0,1,5.43,2.29l4.97,5.09a1.639,1.639,0,0,0,1.14.48c1.215.049,15.812-.107,16.58.08-.044-.577.109-9.054-.11-9.32-1.228-.002-9.544.001-10.98,0a4.432,4.432,0,0,1-4.43-4.43V3.45a2.171,2.171,0,0,0-.36-.02H21.05A3.98,3.98,0,0,0,17.08,7.4V17.14C17.631,17.031,27.32,17.06,27.32,17.06ZM23.71,6.89H35.29a1,1,0,0,1,0,2H23.71A1,1,0,0,1,23.71,6.89Zm0,4.71H35.29a1,1,0,0,1,0,2H23.71A1,1,0,0,1,23.71,11.6Z" />
    <path d="M44.35,13.68H54.42a4.425,4.425,0,0,0-.98-1L42.6,4.46a4.339,4.339,0,0,0-.68-.43v7.22A2.433,2.433,0,0,0,44.35,13.68Z" />
  </svg>
);

// Hand-sketched carousel arrows — same vocabulary as the hero intro arrows
// (wobbly cubic strokes, pathLength=1, drawn in via stroke-dashoffset on reveal)
const SketchArrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    className="case-playground__nav-svg"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    {direction === 'right' ? (
      <>
        <path d="M6 23 C 14 19, 26 19, 37 22" fill="none" strokeLinecap="round" pathLength={1} />
        <path d="M37 22 L29.5 15.5 M37 22 L30.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
      </>
    ) : (
      <>
        <path d="M38 23 C 30 19, 18 19, 7 22" fill="none" strokeLinecap="round" pathLength={1} />
        <path d="M7 22 L14.5 15.5 M7 22 L13.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
      </>
    )}
  </svg>
);

// CTA arrow — same hand-sketched vocabulary as SketchArrow, drawn in on card
// hover/focus (not on scroll reveal) via the `--active` class on the card.
const CtaArrow = () => (
  <svg
    className="case-playground__cta-arrow-svg"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 23 C 14 19, 26 19, 37 22" fill="none" strokeLinecap="round" pathLength={1} />
    <path d="M37 22 L29.5 15.5 M37 22 L30.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
  </svg>
);

// ── Coin + card data ─────────────────────────────────────────────────────────
// Deterministic resting poses (no randomness at render): left position in %,
// resting rotation in deg, small y lift so neighbors overlap like a loose pile.

interface Coin {
  icon: string;  // file in /images/proficiencies/
  name: string;  // tooltip only — coins are decorative to AT
  x: number;     // left, % of tray width
  rot: number;   // resting rotation, deg
  lift: number;  // px raised off the tray floor (overlap)
  z: number;
}

interface PlaygroundCard {
  slug: string;
  title: string;
  line: string;
  tags: string[];
  metric: string;
  coins: Coin[];
}

const CARDS: PlaygroundCard[] = [
  {
    slug: 'playdraft',
    title: 'PlayDraft',
    line: 'A social drafting game taken 0 → 1 solo — brand to TestFlight in 12 weeks.',
    tags: ['0 → 1 Product', 'Game Design', 'React Native', 'Design System'],
    metric: '12 weeks · solo build · TestFlight',
    coins: [
      { icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: -10, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 26, rot: 9, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 45, rot: -6, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 63, rot: 11, lift: 2, z: 2 },
    ],
  },
  {
    slug: 'wheelrack',
    title: 'WheelRack Design System',
    line: 'A scalable wholesale platform foundation built through tokens, components, and implementation.',
    tags: ['Design Systems', 'Tokens', 'Storybook', 'React'],
    metric: '200+ tokens · 50+ components',
    coins: [
      { icon: 'figma-dark.svg', name: 'Figma', x: 6, rot: -9, lift: 0, z: 2 },
      { icon: 'vscode.svg', name: 'VS Code', x: 22, rot: 7, lift: 3, z: 3 },
      { icon: 'github.svg', name: 'GitHub', x: 41, rot: -14, lift: 0, z: 1 },
      { icon: 'workfront.svg', name: 'Workfront', x: 57, rot: 11, lift: 5, z: 2 },
      { icon: 'slack.svg', name: 'Slack', x: 75, rot: -6, lift: 0, z: 1 },
    ],
  },
  {
    slug: 'aem-component-system',
    title: 'AEM Component System Rebuild',
    line: 'A rebuilt authoring foundation of reusable core components across the storefront.',
    tags: ['Design Systems', 'AEM', 'UX Engineering', 'CMS'],
    metric: '10+ live components · 60% faster loads',
    coins: [
      { icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 8, rot: -8, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 26, rot: 11, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 45, rot: -6, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 62, rot: 8, lift: 4, z: 2 },
      { icon: 'workfront.svg', name: 'Workfront', x: 79, rot: -12, lift: 0, z: 1 },
    ],
  },
  {
    slug: 'loopstack',
    title: 'LoopStack',
    line: 'A trends-first diabetes data product wired to real HealthKit data and live on TestFlight.',
    tags: ['Product Design', 'React', 'AI-Assisted Build', 'Health Data'],
    metric: '90 days of real CGM data · TestFlight',
    coins: [
      { icon: 'claude.svg', name: 'Claude', x: 7, rot: -11, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 24, rot: 8, lift: 4, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 43, rot: -5, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 59, rot: 13, lift: 2, z: 2 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 76, rot: -9, lift: 0, z: 1 },
    ],
  },
  {
    slug: 'design-enablement',
    title: 'Scaling Design Through Internal Tooling',
    line: 'A connected layer of internal plugins and web apps that removed friction for the teams building the work.',
    tags: ['Design Enablement', 'Figma Plugin', 'AI-Assisted Build', 'Automation'],
    metric: '3 connected tools · Design, UX & Photography',
    coins: [
      { icon: 'figma-dark.svg', name: 'Figma', x: 7, rot: 10, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 24, rot: -7, lift: 4, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 43, rot: 6, lift: 0, z: 1 },
      { icon: 'workfront.svg', name: 'Workfront', x: 59, rot: -12, lift: 2, z: 2 },
      { icon: 'github.svg', name: 'GitHub', x: 76, rot: 8, lift: 0, z: 1 },
    ],
  },
  {
    slug: 'tire-categories',
    title: 'Tire Category Redesign',
    line: 'A clearer shopping experience shaped through education, iconography, and reusable CMS patterns.',
    tags: ['UX/UI', 'CMS', 'Icon System', 'Conversion'],
    metric: '+400% category entries · +50% key conversion',
    coins: [
      { icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: 12, lift: 0, z: 1 },
      { icon: 'illustrator.svg', name: 'Adobe Illustrator', x: 25, rot: -8, lift: 4, z: 3 },
      { icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 44, rot: 6, lift: 0, z: 2 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 60, rot: -12, lift: 2, z: 1 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 77, rot: 9, lift: 0, z: 2 },
    ],
  },
  {
    slug: 'tire-rack-winter',
    title: 'Seasonal Content Swap',
    line: 'A scalable AEM system swapping 20+ components across the winter funnel every season.',
    tags: ['AEM', 'Content Strategy', 'Adobe Target', 'CMS'],
    metric: '20+ components · 6 landing pages per season',
    coins: [
      { icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 8, rot: -10, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 27, rot: 8, lift: 3, z: 3 },
      { icon: 'photoshop.svg', name: 'Photoshop', x: 47, rot: -7, lift: 0, z: 1 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 66, rot: 12, lift: 2, z: 2 },
    ],
  },
  {
    slug: 'heatherwood',
    title: 'Heatherwood Equestrian',
    line: 'An end-to-end rebrand and CMS rebuild for a family-owned equestrian academy.',
    tags: ['Brand Design', 'Web', 'SEO', 'CMS'],
    metric: '3–4 inquiries/mo → 4–5 per day',
    coins: [
      { icon: 'figma-dark.svg', name: 'Figma', x: 9, rot: 10, lift: 0, z: 1 },
      { icon: 'illustrator.svg', name: 'Adobe Illustrator', x: 28, rot: -9, lift: 4, z: 3 },
      { icon: 'photoshop.svg', name: 'Photoshop', x: 48, rot: 6, lift: 0, z: 2 },
      { icon: 'vscode.svg', name: 'VS Code', x: 67, rot: -12, lift: 2, z: 1 },
    ],
  },
  {
    slug: 'landing-pages',
    title: 'AEM Landing Page System',
    line: 'A governed template framework that turned month-long builds into week-long launches.',
    tags: ['UX/UI', 'Front-End', 'CMS', 'SEO'],
    metric: '50+ pages · ~1 month → 1–2 weeks',
    coins: [
      { icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 7, rot: 9, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 25, rot: -11, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 44, rot: 7, lift: 0, z: 1 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 61, rot: -6, lift: 4, z: 2 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 78, rot: 10, lift: 0, z: 1 },
    ],
  },
];

// ── Coin motion variants ──────────────────────────────────────────────────────
// idle: parked above the tray, invisible (teleport — no animation).
// in:   gravity drop to the resting pile pose (spring settle, left → right).
// out:  fall through the tray floor and vanish (clipped by the card).

type CoinPhase = 'idle' | 'in' | 'out';

const coinVariants = {
  idle: (c: Coin) => ({
    y: -130,
    x: 0,
    rotate: c.rot * 2.4,
    opacity: 0,
    transition: { duration: 0 },
  }),
  in: (c: Coin) => ({
    y: 0,
    x: 0,
    rotate: c.rot,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 22,
      mass: 0.9,
      delay: c.x * 0.005, // land left → right
      opacity: { duration: 0.15, delay: c.x * 0.005 },
    },
  }),
  out: (c: Coin) => ({
    y: 170,
    rotate: c.rot * 2,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeIn' as const,
      delay: c.lift * 0.03 + c.x * 0.002, // loose, uneven tumble
      opacity: { duration: 0.16, delay: 0.3 + c.x * 0.002 },
    },
  }),
};

// Reduced motion: opacity-only, coins stay in their resting pose
const coinVariantsReduced = {
  idle: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 0, transition: { duration: 0 } }),
  in: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 1, transition: { duration: 0.2 } }),
  out: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 0, transition: { duration: 0.2 } }),
};

// ── Touch detection ───────────────────────────────────────────────────────────
// `(hover: none)` = the primary input can't hover (phones/tablets). On those
// devices the coin drop is driven by scroll-into-view instead of hover.

function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: none)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isTouch;
}

// ── Component ─────────────────────────────────────────────────────────────────

const EXIT_RESET_MS = 750; // out-animation length before coins re-park above

const CaseStudyPlayground: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();
  const [sectionRef, revealed] = useReveal<HTMLElement>(0.15);
  const gridRef = useRef<HTMLDivElement>(null);
  const [phases, setPhases] = useState<Record<string, CoinPhase>>({});
  const resetTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    const timers = resetTimers.current;
    return () => Object.values(timers).forEach((t) => window.clearTimeout(t));
  }, []);

  const setPhase = (slug: string, phase: CoinPhase) =>
    setPhases((p) => (p[slug] === phase ? p : { ...p, [slug]: phase }));

  const handleEnter = (slug: string) => {
    window.clearTimeout(resetTimers.current[slug]);
    setPhase(slug, 'in');
  };

  const handleLeave = (slug: string) => {
    setPhase(slug, 'out');
    window.clearTimeout(resetTimers.current[slug]);
    // After the fall-out finishes, re-park the coins above for the next hover
    resetTimers.current[slug] = window.setTimeout(
      () => setPhase(slug, 'idle'),
      EXIT_RESET_MS
    );
  };

  // Touch devices: drive the coin drop from visibility instead of hover.
  // A card ≥60% in view drops its coins in; scrolling/swiping it out lets them
  // fall away — so the animation replays as you move through the carousel.
  useEffect(() => {
    if (!isTouch) return;
    const grid = gridRef.current;
    if (!grid) return;

    const cardEls = Array.from(
      grid.querySelectorAll<HTMLElement>('[data-slug]')
    );
    if (cardEls.length === 0) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slug = (entry.target as HTMLElement).dataset.slug;
          if (!slug) return;
          if (entry.isIntersecting) {
            seen.add(slug);
            handleEnter(slug);
          } else if (seen.has(slug)) {
            // Only fall out after having been seen (avoids a mount-time flurry)
            handleLeave(slug);
          }
        });
      },
      { threshold: 0.6 }
    );

    cardEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // handleEnter/handleLeave are stable in behavior (setState + refs only)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = gridRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.case-playground__card');
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  // Join playground config to the canonical projects data (image + route +
  // stream + optional cover-loop video). CARDS and projects are module
  // constants, so this only needs to run once — not on every hover re-render.
  const cards = useMemo(() => {
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return CARDS.map((card) => {
      const project = bySlug.get(card.slug);
      const video = project?.featuredVideo;
      // For video cards the still IS the video's first frame (poster), so the
      // resting card matches what the loop shows; non-video cards keep `featured`.
      const still = video
        ? video.replace(/\.mp4$/, '-poster.jpg')
        : project?.featured ?? '';
      return {
        ...card,
        image: still,
        alt: project?.title ?? card.title,
        stream: project?.stream,
        video,
        videoPrimary: Boolean(video && project?.featuredVideoPrimary),
      };
    });
  }, []);

  const variants = reduceMotion ? coinVariantsReduced : coinVariants;

  return (
    <section
      id="projects"
      className={`case-playground${revealed ? ' case-playground--revealed' : ''}`}
      ref={sectionRef}
    >
      <div className="case-playground__container">
        {/* ── Intro ── */}
        <div className="case-playground__intro">
          <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" />
          <h2 className="case-playground__title">What I've designed recently</h2>
          <p className="case-playground__lede">
            A closer look at the systems, interfaces, and product thinking I've shaped from
            concept through implementation.
          </p>
        </div>

        {/* The threshold — stage line into the playground */}

        {/* Sketch arrows — draw in on scroll, page the carousel */}
        <div className="case-playground__nav">
          <button
            type="button"
            className="case-playground__nav-btn"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous case studies"
          >
            <SketchArrow direction="left" />
          </button>
          <button
            type="button"
            className="case-playground__nav-btn case-playground__nav-btn--next"
            onClick={() => scrollByCard(1)}
            aria-label="Next case studies"
          >
            <SketchArrow direction="right" />
          </button>
        </div>

        {/* ── Carousel ── */}
        <div className="case-playground__grid" ref={gridRef}>
          {cards.map((card) => {
            const phase: CoinPhase = phases[card.slug] ?? 'idle';
            return (
              <a
                key={card.slug}
                href={`#/work/${card.slug}`}
                className={`case-playground__card${phase === 'in' ? ' case-playground__card--active' : ''}`}
                data-slug={card.slug}
                onMouseEnter={isTouch ? undefined : () => handleEnter(card.slug)}
                onMouseLeave={isTouch ? undefined : () => handleLeave(card.slug)}
                onFocus={isTouch ? undefined : () => handleEnter(card.slug)}
                onBlur={isTouch ? undefined : () => handleLeave(card.slug)}
              >
                {/* Top — preview (cover loop plays while active; primary loops always) */}
                <div className="case-playground__preview">
                  {card.stream && (
                    <span
                      className={`case-playground__stream case-playground__stream--${card.stream}`}
                    >
                      {STREAM_LABEL[card.stream]}
                    </span>
                  )}
                  {card.video && !reduceMotion ? (
                    <CardVideo
                      src={card.video}
                      poster={card.image}
                      alt={card.alt}
                      playing={phase === 'in'}
                      primary={card.videoPrimary}
                    />
                  ) : (
                    <img src={card.image} alt={card.alt} loading="lazy" />
                  )}
                </div>

                {/* Middle — minimal content */}
                <div className="case-playground__body">
                  <h3 className="case-playground__card-title">{card.title}</h3>
                  <p className="case-playground__card-line">{card.line}</p>
                  <div className="case-playground__tags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="case-playground__tag">{tag}</span>
                    ))}
                  </div>
                  <p className="case-playground__metric">{card.metric}</p>
                  <span className="case-playground__cta" aria-hidden="true">
                    View case study
                    <span className="case-playground__cta-arrow">
                      <CtaArrow />
                    </span>
                  </span>
                </div>

                {/* Bottom — tool coin tray (decorative) */}
                <div className="case-playground__tray" aria-hidden="true">
                  <span className="case-playground__tray-label">[ Made With ]</span>
                  {card.coins.map((coin) => (
                    <motion.span
                      key={coin.icon + coin.x}
                      className="case-playground__coin"
                      style={{ left: `${coin.x}%`, bottom: 8 + coin.lift, zIndex: coin.z }}
                      custom={coin}
                      variants={variants}
                      initial="idle"
                      animate={phase}
                      title={coin.name}
                    >
                      <img src={`/images/proficiencies/${coin.icon}`} alt="" />
                    </motion.span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyPlayground;
