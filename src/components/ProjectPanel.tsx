import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import '../styles/components/_project-panel.scss';
import { useUnlock } from '../context/UnlockContext';
import { getHomeHref, HOME_TOP_STATE } from '../utils/homeSession';
import ReadingErrorBoundary from './ReadingErrorBoundary';

const readingPositions = new Map<string, number>();

// The way back: one solid arrow pointing left to the page behind, white with
// an ink edge so it holds on both the homepage and the backdrop over it
// (Ryan, 21 October: the black disc with a sketched arrow was jarring, and
// then one arrow, not a chevron and an arrow).
const ReturnArrow = () => (
  <svg viewBox="0 0 29 28" aria-hidden="true" focusable="false">
    <path d="M2 14 L11 5 V10 H27 V18 H11 V23 Z" />
  </svg>
);

// The exposed homepage strip left of the open drawer, made an explicit exit.
//
// The dialog already closed on a click left of its bounds, but nothing said
// so, and keyboard and screen-reader users had no equivalent. This is a real
// button covering the strip (CSS shows it only above 850px, where the strip
// is wide enough to aim at), plus a 32px custom cursor that follows the
// pointer while it is over the strip, after claire.io's case-study layer.
//
// It is its own component on purpose. Hover state changes on every strip
// entry; held in ProjectPanel, each change would re-render the reading
// Suspense boundary beside it, and an update that reaches a still-dehydrated
// boundary makes React 19 throw the prerendered article away. Here the
// re-renders stop at this subtree.
function DismissStrip({ label, open, onDismiss }: { label: string; open: boolean; onDismiss: () => void }) {
  // Pointer-driven UI must not exist in the first client render, which has
  // to equal the prerendered HTML (see the mounted gates in
  // CaseStudyPlayground.tsx). Hover can only begin after mount anyway; the
  // gate makes that a guarantee instead of a timing accident.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [hovering, setHovering] = useState(false);
  const point = useRef({ x: 0, y: 0 });
  const cursor = useRef<HTMLSpanElement | null>(null);
  // Position is written straight to the element: a pointermove per frame is
  // no reason to re-render React.
  const place = (x: number, y: number) => {
    point.current = { x, y };
    if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  // Touch and hoverless devices never get the custom cursor. A finger has no
  // pointer to replace, and a tap on the strip simply closes.
  const canHover = (event: React.PointerEvent) => event.pointerType !== 'touch' && window.matchMedia('(hover: hover)').matches;
  const track = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!mounted || !canHover(event)) return;
    place(event.clientX, event.clientY);
    if (!hovering) setHovering(true);
  };
  // Only while the drawer is settled open: during the slide in or out the
  // strip is moving with the dialog and the native cursor should come back.
  const showCursor = mounted && hovering && open;
  return <>
    <button
      type="button"
      className="project-panel__dismiss"
      aria-label={label}
      data-cursor={showCursor ? 'return' : undefined}
      onClick={onDismiss}
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Keyboard focus parks the same mark in the strip, so a focused exit
          looks like the hovered one. */}
      <span className="project-panel__dismiss-mark" aria-hidden="true"><ReturnArrow /></span>
    </button>
    {showCursor && <span
      className="project-panel__cursor"
      aria-hidden="true"
      ref={el => { cursor.current = el; if (el) el.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0)`; }}
    ><ReturnArrow /></span>}
  </>;
}

export default function ProjectPanel({ children, overlay, fromNavigation = false }: { children: React.ReactNode; overlay?: React.ReactNode; fromNavigation?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const initialDirect = useRef(!fromNavigation);
  const [phase, setPhase] = useState<'opening' | 'open' | 'closing'>(initialDirect.current ? 'open' : 'opening');
  const navigationType = useNavigationType();
  const [announcement, setAnnouncement] = useState('');
  const closing = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finishExit = useRef<(() => void) | null>(null);
  const navigate = useNavigate();
  const { dismissPrompt } = useUnlock();
  const location = useLocation();
  const article = location.pathname.startsWith('/notes/');
  const [stateReady, setStateReady] = useState(fromNavigation);
  const panelState = stateReady ? location.state : null;
  const close = () => {
    if (closing.current) return;
    // Mid-slide the panel is not a target: a second click of a double-click
    // landed on the backdrop beside the arriving panel and shut it at once.
    if (phase === 'opening') return;
    closing.current = true;
    const finish = () => {
      if (!finishExit.current) return;
      finishExit.current = null;
      clearTimeout(exitTimer.current);
      if (location.state?.backgroundLocation) navigate(-((location.state?.readingDepth ?? 0) + 1));
      else navigate(location.state?.readingOrigin ?? (article ? '/notes' : '/#projects'), { replace: true });
    };
    finishExit.current = finish;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    // Anything in the panel can ask it to wait before it slides away: the
    // homepage binder's study top (BinderTop) folds its reel and takes its
    // card out of the sleeve first, then flies the card home as the panel goes.
    const waits: Promise<unknown>[] = [];
    document.dispatchEvent(new CustomEvent('portfolio:panel-closing', { detail: { wait: (p: Promise<unknown>) => waits.push(p) } }));
    const slide = () => { setPhase('closing'); exitTimer.current = setTimeout(finish, 280); };
    if (waits.length) Promise.all(waits).then(slide, slide); else slide();
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const positionKey = `${location.pathname}:${location.key}`;
    let saved = navigationType === 'POP' ? readingPositions.get(positionKey) : undefined;
    if (navigationType === 'POP' && saved === undefined) {
      try { const stored = sessionStorage.getItem(`reading-scroll:${positionKey}`); if (stored !== null) saved = Number(stored); } catch { /* Storage can be unavailable in private browsing. */ }
    }
    if (saved !== undefined) readingPositions.set(positionKey, saved);
    const settle = () => {
      const heading = el.querySelector<HTMLElement>('h1');
      if (!heading) return false;
      if (!document.querySelector('.password-modal')) {
        // Focusing an off-screen title can pull Safari away from the restored position.
        const focusTarget = saved ? el : heading;
        focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }
      setAnnouncement(heading.textContent ?? '');
      if (saved !== undefined) el.scrollTop = saved;
      else if (location.hash) el.querySelector(`[id="${CSS.escape(location.hash.slice(1))}"]`)?.scrollIntoView({ block: 'start' });
      else el.scrollTop = 0;
      return true;
    };
    const observer = new MutationObserver(() => { if (settle()) observer.disconnect(); });
    const frame = requestAnimationFrame(() => { if (!settle()) observer.observe(el, { childList: true, subtree: true }); });
    const save = () => readingPositions.set(positionKey, el.scrollTop);
    const persist = () => {
      try { sessionStorage.setItem(`reading-scroll:${positionKey}`, String(readingPositions.get(positionKey) ?? el.scrollTop)); } catch { /* In-memory restoration still works. */ }
    };
    el.addEventListener('scroll', save, { passive: true });
    window.addEventListener('pagehide', persist);
    return () => { persist(); cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('scroll', save); window.removeEventListener('pagehide', persist); };
    // Hash navigation scrolls within the current reading page without replaying it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.key]);
  useEffect(() => {
    const el = dialog.current!;
    // The element that had focus, through any shadow root: the homepage
    // binder's card is inside one, and its host div can't take focus back.
    let target = document.activeElement as HTMLElement | null;
    while (target?.shadowRoot?.activeElement) target = target.shadowRoot.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    const scroll = location.state?.returnScroll ?? window.scrollY;
    const backgroundPath = location.state?.backgroundLocation?.pathname;
    const returnHref = location.state?.returnFocusHref;
    const returnClass = location.state?.returnFocusClass;
    const returnMeta = location.state?.returnMeta;
    closing.current = false;
    if (!(window as Window & { __PORTFOLIO_PRERENDER__?: boolean }).__PORTFOLIO_PRERENDER__) setStateReady(true);
    setPhase(initialDirect.current ? 'open' : 'opening');
    if (el.open) el.close();
    el.showModal();
    document.documentElement.classList.add('reading-panel-open');
    const backgroundAnimations = document.querySelector('#main-content')?.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running') ?? [];
    backgroundAnimations.forEach(animation => animation.pause());
    document.dispatchEvent(new CustomEvent('portfolio:reading-panel', { detail: true }));
    void el.offsetWidth;
    const frame = requestAnimationFrame(() => { if (!closing.current) setPhase('open'); });
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer.current);
      finishExit.current = null;
      dismissPrompt();
      el.close();
      document.documentElement.classList.remove('reading-panel-open');
      backgroundAnimations.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
      document.dispatchEvent(new CustomEvent('portfolio:reading-panel', { detail: false }));
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        // A home link (HOME_TOP_STATE) asked for the top, not the reader's old
        // position. Its state is the home entry's for good, so only the first
        // return after it honours the flag; later ones restore as usual.
        const toTop = Boolean(window.history.state?.usr?.toTop);
        if (toTop) {
          try { window.history.replaceState({ ...window.history.state, usr: { ...window.history.state.usr, toTop: false } }, ''); } catch { /* the position is restored next time */ }
        }
        // Opened by its address (no page behind it), the close lands on the
        // homepage's work section: focus goes to the study's own card there,
        // where the reader would pick up, instead of being dropped on the body.
        if (!backgroundPath && !toTop) {
          const slug = window.location.pathname === '/' && location.pathname.match(/^\/work\/([^/]+)/)?.[1];
          const card = slug ? document.querySelector('.case-binder__host')?.shadowRoot?.querySelector<HTMLElement>(`.pocket[data-slug="${slug}"] .card`) : null;
          (card ?? document.querySelector<HTMLElement>('#main-content'))?.focus({ preventScroll: true });
        }
        if (window.location.pathname === backgroundPath && !toTop) {
          if (returnMeta) {
            document.title = returnMeta.title;
            document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => meta.remove());
            returnMeta.tags.forEach((tag: { name: string; property: string | null; content: string }) => {
              const meta = document.createElement('meta');
              if (tag.property) meta.setAttribute('property', tag.property); else meta.name = tag.name;
              meta.content = tag.content;
              document.head.appendChild(meta);
            });
            const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
            if (canonical && returnMeta.canonical) canonical.href = returnMeta.canonical;
          }
          window.scrollTo({ top: scroll, behavior: 'instant' as ScrollBehavior });
          // The link that opened the study, or the binder card for it; never a
          // link that merely matches by address (an unclassed link in another
          // section took focus thousands of pixels away after a reload).
          const slug = backgroundPath && returnHref?.match(/^\/work\/([^/]+)/)?.[1];
          const card = slug ? document.querySelector('.case-binder__host')?.shadowRoot?.querySelector<HTMLElement>(`.pocket[data-slug="${slug}"] .card`) : null;
          const returnTarget = target?.isConnected ? target
            : card ?? (returnClass ? Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find(anchor => anchor.getAttribute('href') === returnHref && anchor.className === returnClass) : null);
          (returnTarget || document.querySelector<HTMLElement>('#main-content'))?.focus({ preventScroll: true });
        }
      }));
    };
    // One panel lifetime; section hash changes must not reset focus or scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const trapFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.defaultPrevented || event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, video[controls], [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.getClientRects().length && !el.closest('[inert], [hidden], [aria-hidden="true"]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); event.currentTarget.focus(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  // Same rule the header button uses to decide between "All notes" and "All work".
  const notesExit = panelState?.readingOrigin === '/notes' || (!panelState?.readingOrigin && article);
  return <dialog open={initialDirect.current} onKeyDown={trapFocus} ref={dialog} className="project-panel" data-phase={phase} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform' && closing.current) finishExit.current?.(); }} aria-label={article ? 'Article' : 'Project case study'} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left) close(); } }}>
    {/* First in DOM order because it sits first visually, left of everything. The
        backdrop click above stays as the fallback below 850px, where the strip
        button is not shown, and during the slide in or out. */}
    <DismissStrip label={notesExit ? 'All notes' : 'Back to all work'} open={phase === 'open'} onDismiss={close} />
    <header className="project-panel__header">
      <div className="project-panel__identity">
        <Link to={getHomeHref()} state={HOME_TOP_STATE} className="project-panel__name">Ryan DeBoer</Link>
        {panelState?.previousReading && <button className="project-panel__back" onClick={() => navigate(-1)}>← Previous {panelState.previousReading}</button>}
      </div>
      <button type="button" className="project-panel__close" onClick={close} aria-label={panelState?.backgroundLocation ? (article ? 'Close article' : 'Close case study') : (notesExit ? 'All notes' : 'All work')}>{panelState?.backgroundLocation ? 'Close' : (notesExit ? 'All notes' : 'All work')} <span aria-hidden="true">×</span></button>
    </header>
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    <div ref={scroller} className="project-panel__article"><ReadingErrorBoundary key={location.pathname}><Suspense fallback={<p className="project-panel__loading" role="status">Loading {article ? 'article' : 'case study'}…</p>}><div key={location.pathname} className="project-panel__content">{children}</div></Suspense></ReadingErrorBoundary></div>
    {overlay}
  </dialog>;
}
