import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import '../styles/components/_project-panel.scss';
import { useUnlock } from '../context/UnlockContext';
import { getHomeHref } from '../utils/homeSession';
import ReadingErrorBoundary from './ReadingErrorBoundary';

const readingPositions = new Map<string, number>();

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
    setPhase('closing');
    exitTimer.current = setTimeout(finish, 280);
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
    const target = document.activeElement as HTMLElement | null;
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
        if (window.location.pathname === backgroundPath) {
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
          const returnTarget = target?.isConnected ? target : Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find(anchor => anchor.getAttribute('href') === returnHref && anchor.className === returnClass);
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
  return <dialog open={initialDirect.current} onKeyDown={trapFocus} ref={dialog} className="project-panel" data-phase={phase} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform' && closing.current) finishExit.current?.(); }} aria-label={article ? 'Article' : 'Project case study'} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left) close(); } }}>
    <header className="project-panel__header">
      <div className="project-panel__identity">
        <Link to={getHomeHref()} className="project-panel__name">Ryan DeBoer</Link>
        {panelState?.previousReading && <button className="project-panel__back" onClick={() => navigate(-1)}>← Previous {panelState.previousReading}</button>}
      </div>
      <button type="button" className="project-panel__close" onClick={close} aria-label={panelState?.backgroundLocation ? (article ? 'Close article' : 'Close case study') : (panelState?.readingOrigin === '/notes' || (!panelState?.readingOrigin && article) ? 'All notes' : 'All work')}>{panelState?.backgroundLocation ? 'Close' : (panelState?.readingOrigin === '/notes' || (!panelState?.readingOrigin && article) ? 'All notes' : 'All work')} <span aria-hidden="true">×</span></button>
    </header>
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    <div ref={scroller} className="project-panel__article"><ReadingErrorBoundary key={location.pathname}><Suspense fallback={<p className="project-panel__loading" role="status">Loading {article ? 'article' : 'case study'}…</p>}><div key={location.pathname} className="project-panel__content">{children}</div></Suspense></ReadingErrorBoundary></div>
    {overlay}
  </dialog>;
}
