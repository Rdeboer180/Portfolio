import { CARDS, Coin, CoinPhase, coinVariants, coinVariantsReduced } from '../data/toolCoins';
import { FeaturedEndorsement } from './Testimonials';
// ============================================
// CaseStudyPlayground — "shadowbox + tool coin tray" case studies carousel
// All public case studies as shadowbox cards (preview / title and outcome /
// coin tray) in a scroll-snap carousel paged by hand-sketched arrows that draw
// in on scroll (same artistic language as the hero arrows). The work navigator
// (WorkNavigator.tsx) filters the row by discipline or client; without it the
// arrows page three at a time through the one WORK_ORDER.
// Coins: first hover/focus drops the card's real tool icons into its tray;
// un-hover lets them fall out the bottom and vanish — replayable every hover.
// A page turn and a pointed navigator row drop them too.
// framer-motion only. Reduced-motion → fade in/out, no physics.
// ============================================

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProjectLink from './ProjectLink';
import SectionBadge from './SectionBadge';
import { clientLabelFor, orderedProjects } from '../data/projects';
import { WORK_GROUPS, clientGroupLabel, studiesFor } from '../data/workGroups';
import { useReveal } from '../hooks/useReveal';
import { useUnlock } from '../context/UnlockContext';
import { useWorkNavigator } from '../context/WorkNavigatorContext';
import CoverSchematic, { hasSchematic } from './CoverSchematic';
import ProjectBrand from './ProjectBrand';
import WorkNavigator, { WORK_NAVIGATOR_ID } from './WorkNavigator';

const PreviewLockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

const BrowseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 12h10M4 18h7" />
  </svg>
);

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
  const [reading, setReading] = useState(() => Boolean(document.querySelector('dialog.project-panel[open]')));
  useEffect(() => {
    const update = (event: Event) => setReading(Boolean((event as CustomEvent<boolean>).detail));
    document.addEventListener('portfolio:reading-panel', update);
    return () => document.removeEventListener('portfolio:reading-panel', update);
  }, []);

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

  const shouldPlay = !reading && (primary ? inView : playing);

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
    <path d="M55.44,27.02c-.712-.237-15.402-.037-16.58-.1A3.601,3.601,0,0,1,36.29,25.84l-4.97-5.09a5.609,5.609,0,0,0-4-1.69H19.08a5.739,5.739,0,0,0-6.55,5.59v3.53H7.73A3.739,3.739,0,0,0,4,31.92V54.35a3.739,3.739,0,0,0,3.73,3.74H56.27A3.739,3.739,0,0,0,60,54.35V31.92A3.739,3.739,0,0,0,56.27,28.18H55.44Z" />
    <path d="M27.32,17.06a7.613,7.613,0,0,1,5.43,2.29l4.97,5.09a1.639,1.639,0,0,0,1.14.48c1.215.049,15.812-.107,16.58.08-.044-.577.109-9.054-.11-9.32-1.228-.002-9.544.001-10.98,0a4.432,4.432,0,0,1-4.43-4.43V4H15.4a3.73,3.73,0,0,0-3.73,3.73V17.06Z" />
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

// ── Card copy ────────────────────────────────────────────────────────────────
// A card is a title, an outcome and the tool tray. The one-line hooks that used
// to sit under these titles left with the work navigator, which now carries
// the discipline and client context a card was trying to compress into a
// sentence. The titles themselves are unchanged.
const CARD_TITLES: Record<string, string> = {
  'design-enablement': 'Tools that scale design',
  playdraft: 'PlayDraft: A social drafting game',
  loopstack: 'LoopStack: Patterns worth reviewing',
  'aem-component-system': 'AEM Component System',
  'tire-categories': 'Tire Category Redesign: Path to the right tire',
  'seasonal-content-system': 'Seasonal content, without rebuilds',
  'overscroll-tactics': 'Overscroll Tactics: A studio identity',
  heatherwood: 'Heatherwood: Built for its owner',
  'landing-pages': 'AEM: A governed landing-page system',
};

// ── Coin motion variants ──────────────────────────────────────────────────────
// idle: parked above the tray, invisible (teleport — no animation).
// in:   gravity drop to the resting pile pose (spring settle, left → right).
// out:  fall through the tray floor and vanish (clipped by the card).


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
const CARD_GAP = 24;       // $spacing-xl, the carousel's gap
const DEFAULT_PER_PAGE = 3; // the desktop row; measured after mount

const CaseStudyPlayground: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();
  const [sectionRef, revealed] = useReveal<HTMLElement>(0.15);
  const gridRef = useRef<HTMLDivElement>(null);
  const [phases, setPhases] = useState<Record<string, CoinPhase>>({});
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const resetTimers = useRef<Record<string, number>>({});
  const nav = useWorkNavigator();

  useEffect(() => {
    const timers = resetTimers.current;
    return () => Object.values(timers).forEach((t) => window.clearTimeout(t));
  }, []);

  const setPhase = useCallback((slug: string, phase: CoinPhase) =>
    setPhases((p) => (p[slug] === phase ? p : { ...p, [slug]: phase })), []);

  // Drop the coins without lifting the card: a page turn and a pointed
  // navigator row use this; hover and focus add the active state on top.
  const dropCoins = useCallback((slug: string) => {
    window.clearTimeout(resetTimers.current[slug]);
    setPhase(slug, 'in');
  }, [setPhase]);

  const releaseCoins = useCallback((slug: string) => {
    setPhase(slug, 'out');
    window.clearTimeout(resetTimers.current[slug]);
    // After the fall-out finishes, re-park the coins above for the next hover
    resetTimers.current[slug] = window.setTimeout(
      () => setPhase(slug, 'idle'),
      EXIT_RESET_MS
    );
  }, [setPhase]);

  const handleEnter = (slug: string) => {
    setActiveSlug(slug);
    dropCoins(slug);
  };

  const handleLeave = (slug: string) => {
    setActiveSlug((current) => (current === slug ? null : current));
    // A row still pointed at in the navigator keeps its coins.
    if (nav.pointedSlug !== slug) releaseCoins(slug);
  };

  // Join the one WORK_ORDER to each card's coins (toolCoins.ts keeps only the
  // coins now; the order left it for projects.ts). Module constants, so this
  // runs once — not on every hover re-render.
  const cards = useMemo(() => {
    const coinsBySlug = new Map(CARDS.map((card) => [card.slug, card.coins]));
    return orderedProjects().map((project) => {
      const video = project.featuredVideo;
      // For video cards the still IS the video's first frame (poster), so the
      // resting card matches what the loop shows; non-video cards keep `featured`.
      const still = video
        ? video.replace(/\.mp4$/, '-poster.jpg')
        : project.featured ?? '';
      // Copy comes from projects.ts, never from a local duplicate. The card
      // used to restate the metric by hand and had drifted: it showed
      // "+400%" where the case study says "Up to +400%", scoped to the month
      // prior. Deriving it means the hedge the case study was careful to
      // write survives onto the homepage.
      const headline = project.metrics?.[0];
      return {
        slug: project.slug,
        coins: coinsBySlug.get(project.slug) ?? ([] as Coin[]),
        title: CARD_TITLES[project.slug] ?? project.cardTitle ?? project.title,
        client: project.client,
        clientLabel: project.clientLabel,
        // "2023 to 2024 design · 2026 launch" is a sentence; the chip takes the
        // leading year or range and leaves the rest to the study.
        year: project.year.match(/^\d{4}(?:\s?[–-]\s?(?:\d{2,4}|Present))?/)?.[0] ?? project.year,
        metric: headline ? `${headline.value} ${headline.label}` : '',
        image: still,
        alt: project.title,
        stream: project.stream,
        video,
        videoPrimary: Boolean(video && project.featuredVideoPrimary),
        publicVideo: Boolean(video && project.featuredVideoPublic),
      };
    });
  }, []);

  // The navigator's selection narrows the row; no selection is the whole order.
  const visibleCards = useMemo(() => {
    const shown = new Set(studiesFor(nav.group, nav.clientKey).map((project) => project.slug));
    return cards.filter((card) => shown.has(card.slug));
  }, [cards, nav.group, nav.clientKey]);

  const { unlocked, resolving, openPrompt, lockedReady } = useUnlock();

  // Only the employer/client stream is treated as protected. The self-built work
  // and Heatherwood's live public site are Ryan's to show, so veiling them would
  // signal a restriction that isn't real — and the badge has to stay truthful.
  const isProtected = (stream?: string) => stream === 'professional';
  const isLocked = (stream?: string) => !unlocked && isProtected(stream);

  // Reaching for a locked case study is what raises the prompt — not arrival.
  // The href rides along so the unlock lands on the study they actually wanted.
  const variants = reduceMotion ? coinVariantsReduced : coinVariants;

  /**
   * Which media element a card renders is the one reduced-motion decision in
   * here that changes the DOM rather than the motion — and scripts/prerender.mjs
   * drives the build in a reduced-motion browser on purpose, so every static
   * file holds an <img> where a normal visitor's React renders a <video>. React
   * reads that as a structural hydration mismatch, throws error #418, and drops
   * the entire prerendered page to re-render it client-side.
   *
   * Same gate as UnlockChrome in App.tsx and the hero intro: render what the
   * static markup already has, then put the real thing in a beat later. The
   * <video> carries the same file as its poster, and the poster is already
   * decoded from the <img>, so the swap is invisible.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const posterOnly = !mounted || reduceMotion;

  /**
   * The lock line needs the same gate, facing the other way. It waits on
   * `lockedReady` so a returning visitor whose stored unlock hasn't been read
   * yet never sees "Password protected" appear and then vanish. The prerender
   * has no stored unlock, though, so by the time it serializes, `lockedReady`
   * is true and every static file carries the line on each protected card.
   * The client's first render can't know that yet, so it left the line out,
   * and React met a <p> it never rendered: error #418 on the homepage, /dive/
   * and every /work/ drawer, on every load and in both motion modes, with the
   * prerendered page thrown away.
   *
   * So until mount the line follows the static markup, and after mount it
   * follows the unlock state. A locked visitor keeps it from first paint; an
   * unlocked one loses it the moment storage is read, which is what the
   * client-side re-render was already doing.
   */
  const lockLineReady = !mounted || lockedReady;

  // ── Paging ────────────────────────────────────────────────────────────────
  // The row is still a scroll-snap carousel (touch swipes, keyboard scrolls),
  // so a "page" is measured from it rather than imposed on it: how many cards
  // fit the viewport of the grid, and which group of that many is in view. The
  // static file and the first render assume the desktop three; the measured
  // count arrives after mount, a post-mount update and never a mismatch.
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const pageCount = Math.max(1, Math.ceil(visibleCards.length / perPage));
  const page = Math.min(nav.page, pageCount - 1);

  const measure = useCallback(() => {
    const el = gridRef.current;
    const card = el?.querySelector<HTMLElement>('.case-playground__card');
    if (!el || !card) return { fit: DEFAULT_PER_PAGE, step: 0 };
    const fit = Math.max(1, Math.round((el.clientWidth + CARD_GAP) / (card.offsetWidth + CARD_GAP)));
    return { fit, step: fit * (card.offsetWidth + CARD_GAP) };
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;
    let frame = 0;
    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const { fit, step } = measure();
        setPerPage(fit);
        if (step > 0) nav.setPage(Math.round(el.scrollLeft / step));
      });
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
    // nav.setPage is stable; measure reads the DOM.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, visibleCards.length]);

  // jsdom has no element scrollTo; the browser always does.
  const scrollGrid = (left: number, behavior: ScrollBehavior) => {
    const el = gridRef.current;
    if (el && typeof el.scrollTo === 'function') el.scrollTo({ left, behavior });
  };

  const goToPage = (next: number) => {
    const { step } = measure();
    const target = Math.max(0, Math.min(pageCount - 1, next));
    scrollGrid(target * step, reduceMotion ? 'auto' : 'smooth');
  };

  // A new selection starts at its first page.
  useEffect(() => {
    scrollGrid(0, 'auto');
    // scrollGrid only reads the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.group, nav.clientKey]);

  // A page turn drops the incoming cards' coins (desktop only: touch drives
  // its own drop from visibility). The first page on arrival stays parked, so
  // the load has no flurry; the first hover still owns that moment.
  const lastDropPage = useRef<number | null>(null);
  useEffect(() => {
    if (isTouch) return;
    if (lastDropPage.current === null) { lastDropPage.current = page; return; }
    if (lastDropPage.current === page) return;
    lastDropPage.current = page;
    visibleCards.slice(page * perPage, page * perPage + perPage).forEach((card) => dropCoins(card.slug));
    // visibleCards and perPage are read at the moment of the turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isTouch, dropCoins]);

  // Pointing at a study in the navigator answers on its card: the coins drop
  // while the row is pointed and fall away when the pointer moves on.
  const lastPointed = useRef<string | null>(null);
  useEffect(() => {
    const previous = lastPointed.current;
    lastPointed.current = nav.pointedSlug;
    if (previous && previous !== nav.pointedSlug && previous !== activeSlug) releaseCoins(previous);
    if (nav.pointedSlug) dropCoins(nav.pointedSlug);
    // activeSlug is only consulted to avoid releasing a hovered card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.pointedSlug, dropCoins, releaseCoins]);

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
    // handleEnter/handleLeave are stable in behavior (setState + refs only);
    // the observed set changes with the selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch, visibleCards]);

  const activeFilter = nav.group
    ? nav.group === 'client' && nav.clientKey
      ? clientGroupLabel(nav.clientKey, !unlocked)
      : WORK_GROUPS.find((group) => group.id === nav.group)?.label ?? ''
    : '';

  return (
    <section
      id="projects"
      className={`case-playground ink-ground${revealed ? ' case-playground--revealed' : ''}${
        resolving ? ' case-playground--resolving' : ''
      }`}
      ref={sectionRef}
    >
      <div className="case-playground__container">
        {/* ── Intro ── */}
        <div className="case-playground__intro">
          <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" index="01" tone="accent" />
          <h2 className="case-playground__title">Systems, products, and tools I&rsquo;ve shipped</h2>
          {/* The unlock affordance lives here now — beside the locked objects —
              instead of as a site-wide bar above every page's nav. Same prompt,
              same password; only the address changed. */}
          {lockedReady && (
            <button
              type="button"
              className="case-playground__unlock"
              onClick={() => openPrompt()}
            >
              <span className="case-playground__unlock-icon"><PreviewLockIcon /></span>
              Unlock employer and client work
            </button>
          )}
        </div>

        <FeaturedEndorsement />

        {/* The threshold — stage line into the playground */}

        {/* Browse control, active filter, sketch arrows and the page count */}
        <div className="case-playground__nav">
          <div className="case-playground__nav-start">
            <button
              type="button"
              className="case-playground__browse"
              aria-expanded={nav.open}
              aria-controls={WORK_NAVIGATOR_ID}
              ref={nav.triggerRef}
              onClick={() => nav.setOpen(!nav.open)}
            >
              <span className="case-playground__browse-glyph"><BrowseIcon /></span>
              Browse by discipline or client
            </button>
            {activeFilter && (
              <>
                <span className="case-playground__filter" aria-live="polite">[ {activeFilter} ]</span>
                <button type="button" className="case-playground__filter-clear" onClick={() => nav.selectGroup(null)}>
                  Show all
                </button>
              </>
            )}
          </div>
          <div className="case-playground__nav-end">
            <button
              type="button"
              className="case-playground__nav-btn"
              onClick={() => goToPage(page - 1)}
              aria-label="Previous case studies"
              disabled={page === 0}
            >
              <SketchArrow direction="left" />
            </button>
            <span className="case-playground__pages" aria-live="polite">{page + 1} / {pageCount}</span>
            <button
              type="button"
              className="case-playground__nav-btn case-playground__nav-btn--next"
              onClick={() => goToPage(page + 1)}
              aria-label="Next case studies"
              disabled={page >= pageCount - 1}
            >
              <SketchArrow direction="right" />
            </button>
          </div>
        </div>

        {/* Docked beside the page from 1000px; folded in here below it. */}
        <WorkNavigator />

        {/* ── Carousel ── */}
        <div className="case-playground__grid" ref={gridRef}>
          {visibleCards.map((card, i) => {
            const phase: CoinPhase = phases[card.slug] ?? 'idle';
            const locked = isLocked(card.stream);
            // Drawn cover in place of the blur. The plate stays mounted for any
            // protected card that has one (like the scrim, so unlocking can
            // fade it rather than cut); --plated gates the hover grammar and
            // only applies while actually locked.
            const mediaLocked = locked && !card.publicVideo;
            const hasPlate = isProtected(card.stream) && !card.publicVideo && hasSchematic(card.slug);
            const plated = locked && hasPlate;
            // Hover and focus lift the card; on touch the in-view drop does.
            const active = activeSlug === card.slug || nav.pointedSlug === card.slug || (isTouch && phase === 'in');
            // The caption names the client only once it may be named: the
            // prerender is a locked visitor, and so is every first render.
            const caption = locked ? card.year : `${card.year} · ${clientLabelFor(card, false)}`;
            return (
              <article
                key={card.slug}
                className={`case-playground__card${active ? ' case-playground__card--active' : ''}${
                  plated ? ' case-playground__card--plated' : ''
                }`}
                data-slug={card.slug}
                onMouseEnter={isTouch ? undefined : () => handleEnter(card.slug)}
                onMouseLeave={isTouch ? undefined : () => handleLeave(card.slug)}
                onFocus={isTouch ? undefined : () => handleEnter(card.slug)}
                onBlur={isTouch ? undefined : () => handleLeave(card.slug)}
              >
                <ProjectLink
                  to={`/work/${card.slug}`}
                  className="case-playground__story-link"
                  aria-label={`View case study: ${card.title}`}
                  aria-describedby={locked ? `lock-${card.slug}` : undefined}
                >
                {/* Top — preview (cover loop plays while active; primary loops always) */}
                <div
                  className={`case-playground__preview${
                    mediaLocked ? ' case-playground__preview--locked' : ''
                  }${hasPlate ? ' case-playground__preview--plate' : ''}`}
                  style={{ ['--resolve-delay' as string]: `${i * 80}ms` }}
                >
                  {hasPlate && <CoverSchematic slug={card.slug} />}
                  <span className="case-playground__caption" aria-hidden="true">[ {caption} ]</span>
                  {lockLineReady && locked && (
                    <p
                      id={`lock-${card.slug}`}
                      className="case-playground__lock"
                      style={card.publicVideo && locked ? { opacity: 1 } : undefined}
                      aria-hidden={!locked}
                    >
                      <span className="case-playground__lock-icon"><PreviewLockIcon /></span>
                      Password protected
                    </p>
                  )}
                  {card.video && !posterOnly ? (
                    <CardVideo
                      src={card.video}
                      poster={card.image}
                      alt={card.alt}
                      playing={active || phase === 'in'}
                      primary={card.videoPrimary}
                    />
                  ) : (
                    <img src={card.image} alt={card.alt} loading="lazy" />
                  )}
                </div>

                {/* Middle — title and outcome */}
                <div className="case-playground__body">
                  <h3 className="case-playground__card-title">{card.title}</h3>
                  <p className="case-playground__metric">{card.metric}</p>
                  <div className="case-playground__footer">
                    <span className="case-playground__cta" aria-hidden="true">
                      View case study
                      <span className="case-playground__cta-arrow">
                        <CtaArrow />
                      </span>
                    </span>
                    <ProjectBrand project={card} locked={locked} />
                  </div>
                </div>

                </ProjectLink>

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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyPlayground;
