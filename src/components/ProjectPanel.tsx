import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/_project-panel.scss';
import { useUnlock } from '../context/UnlockContext';
import { getHomeHref } from '../utils/homeSession';
import ReadingErrorBoundary from './ReadingErrorBoundary';

export default function ProjectPanel({ children, overlay }: { children: React.ReactNode; overlay?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'opening' | 'open' | 'closing'>('opening');
  const closing = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finishExit = useRef<(() => void) | null>(null);
  const navigate = useNavigate();
  const { dismissPrompt } = useUnlock();
  const location = useLocation();
  const article = location.pathname.startsWith('/notes/');
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const finish = () => {
      if (!finishExit.current) return;
      finishExit.current = null;
      clearTimeout(exitTimer.current);
      if (location.state?.backgroundLocation) navigate(-1);
      else navigate(article ? '/notes' : '/#projects', { replace: true });
    };
    finishExit.current = finish;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    setPhase('closing');
    exitTimer.current = setTimeout(finish, 280);
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = 0;
    if (!location.hash) return;
    const revealAnchor = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (!target || !el.contains(target)) return false;
      target.scrollIntoView({ block: 'start' });
      return true;
    };
    if (revealAnchor()) return;
    const observer = new MutationObserver(() => { if (revealAnchor()) observer.disconnect(); });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
    // Section links handle their own scrolling; reset only when reading material changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
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
    setPhase('opening');
    el.showModal();
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
  return <dialog onKeyDown={trapFocus} ref={dialog} className="project-panel" data-phase={phase} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform' && closing.current) finishExit.current?.(); }} aria-label={article ? 'Article' : 'Project case study'} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left) close(); } }}>
    <header className="project-panel__header">
      <Link to={getHomeHref()} className="project-panel__name">Ryan DeBoer</Link>
      <button type="button" className="project-panel__close" onClick={close} aria-label={article ? 'Close article' : 'Close case study'}>Close <span aria-hidden="true">×</span></button>
    </header>
    <div ref={scroller} className="project-panel__article"><ReadingErrorBoundary key={location.pathname}><Suspense fallback={<p className="project-panel__loading" role="status">Loading {article ? 'article' : 'case study'}…</p>}>{children}</Suspense></ReadingErrorBoundary></div>
    {overlay}
  </dialog>;
}
