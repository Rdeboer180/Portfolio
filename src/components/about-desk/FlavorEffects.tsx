// The three motion directions built on the hybrid (impeccable animate pass,
// 28 Oct). Each one gives the same page its own physics:
//
//   A · Tactile     the desk is real material. Props sway with the speed of the
//                   scroll, tabs shuffle like paper, a pencil line is drawn under
//                   "through-line", a pulled card tilts toward the pointer, a
//                   [[link]] nudges the thing it names.
//   B · Ink         the page is printed as it is read. The headline settles like
//                   wet ink, margin notes write themselves on, headings take a
//                   highlighter swipe, the timeline inks in, cards snap into
//                   register.
//   C · Instrument  the page is a design tool. Hover any text for its real type
//                   spec in a selection frame (props are never framed); the
//                   pencil reports how far it has been carried;
//                   a [[link]] is drawn as a dimension line.
//
// Everything here is wired onto the rendered page, so the page itself stays the
// same component under all three. Reduced motion keeps the information (the
// spec labels, the sizes) and drops the movement.
import React, { useEffect, useRef, useState } from 'react';
import type { HybridFlavor } from './AboutDeskPage';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** which desk thing an element on the page is, if any */
const thingOf = (el: Element | null): { id: string; el: HTMLElement } | null => {
  const host = el?.closest<HTMLElement>('.prop, .loose, .free-pencil');
  if (!host?.id?.startsWith('t-')) return null;
  return { id: host.id.slice(2), el: host };
};

/** the spec of a piece of type, read from what the browser actually rendered */
const typeSpec = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const size = Math.round(parseFloat(cs.fontSize));
  const lh = cs.lineHeight === 'normal' ? 'normal' : `${Math.round(parseFloat(cs.lineHeight))}`;
  const tag = el.tagName.toLowerCase();
  return `${tag} · ${family} ${cs.fontWeight} · ${size}/${lh}`;
};

// the section headings (h2) are left out: in C they carry the highlighter, not a selection frame
export const INSPECTABLE = 'h1, h3, h4, p, li > b, dt, dd, q, cite, .btn, .glance__chip, time';

export const FlavorEffects: React.FC<{ flavor: HybridFlavor; tab: string; inspect: boolean }> = ({ flavor, tab, inspect }) => {
  const [frame, setFrame] = useState<{ x: number; y: number; w: number; h: number; label: string; kind: 'type' } | null>(null);
  const lastTab = useRef(tab);

  // ── shared: things scrolled into view get .is-in, once ───────────────────
  useEffect(() => {
    if (flavor !== 'b' && flavor !== 'c') return undefined;
    // B inks headings, notes, quotes and the timeline; C keeps only B's highlighter behind the headings
    const targets = document.querySelectorAll<HTMLElement>(flavor === 'c'
      ? '.about-desk__folder .panel h2'
      : '.about-desk__folder .panel h2, .about-desk__folder p.about-desk__aside, .about-desk__folder .words q, .about-desk__folder .steps > li');
    if (reduced() || !('IntersectionObserver' in window)) { targets.forEach((t) => t.classList.add('is-in')); return undefined; }
    document.querySelector('.about-desk')?.classList.add('is-ink-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [flavor, tab]);

  // ── tabs: which way the folder turned, for B's wipe and C's artboard slide ──
  useEffect(() => {
    const order = ['work', 'path', 'who'];
    const dir = order.indexOf(tab) >= order.indexOf(lastTab.current) ? 'next' : 'back';
    document.querySelector('.about-desk')?.setAttribute('data-turn', dir);
    lastTab.current = tab;
  }, [tab]);

  // ── A: the desk moves with the scroll ────────────────────────────────────
  useEffect(() => {
    if (flavor !== 'a' || reduced()) return undefined;
    const root = document.querySelector<HTMLElement>('.about-desk');
    if (!root) return undefined;
    let last = window.scrollY;
    let sway = 0;
    let target = 0;
    let raf = 0;
    const tick = () => {
      sway += (target - sway) * 0.12;
      target *= 0.9;
      root.style.setProperty('--sway', `${sway.toFixed(3)}deg`);
      if (Math.abs(sway) < 0.01 && Math.abs(target) < 0.01) { root.style.setProperty('--sway', '0deg'); raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const y = window.scrollY;
      // a quick scroll leans the props against it, a degree or three
      target = Math.max(-3.5, Math.min(3.5, -(y - last) * 0.06));
      last = y;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); root.style.removeProperty('--sway'); };
  }, [flavor]);

  // ── A: a pulled card tilts toward the pointer; a [[link]] nudges its thing ──
  useEffect(() => {
    if (flavor !== 'a') return undefined;
    const onMove = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      const card = e.target.closest<HTMLElement>('.loose--card');
      if (!card || reduced()) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--tilt-x', `${(x * 14).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(-y * 14).toFixed(2)}deg`);
    };
    const onOver = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      const a = e.target.closest<HTMLAnchorElement>('a.wl');
      if (!a || reduced()) return;
      const id = a.getAttribute('href')?.replace('#t-', '');
      const body = id ? document.querySelector<HTMLElement>(`#t-${id} .prop__body, #t-${id} .loose__body`) : null;
      body?.animate([{ rotate: '0deg' }, { rotate: '-4deg' }, { rotate: '3deg' }, { rotate: '-1.5deg' }, { rotate: '0deg' }], { duration: 460, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onOver);
    return () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerover', onOver); };
  }, [flavor]);

  // ── A: the pencil line under "through-line" redraws when the headline is pointed at ──
  useEffect(() => {
    if (flavor !== 'a') return undefined;
    const h1 = document.querySelector<HTMLElement>('.about-desk__title');
    const onEnter = () => {
      if (reduced()) return;
      h1?.querySelectorAll<SVGPathElement>('.front-underline path').forEach((p, i) => {
        p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 520, delay: i * 90, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'backwards' });
      });
    };
    h1?.addEventListener('pointerenter', onEnter);
    return () => h1?.removeEventListener('pointerenter', onEnter);
  }, [flavor]);

  // ── C: inspect. A selection frame and the real spec of whatever is pointed at ──
  useEffect(() => {
    if (flavor !== 'c' || !inspect) { setFrame(null); return undefined; }
    const onMove = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('.about-desk__nav, .about-desk__flyout, .free-pencil.is-held')) { setFrame(null); return; }
      // a studio stop is one card: one frame around the whole of it, whatever part is pointed at
      const card = t.closest<HTMLElement>('.about-desk__folder .stops > li');
      if (card) {
        const r = card.getBoundingClientRect();
        const n = card.querySelector('.n')?.textContent?.trim() ?? '';
        const label = card.querySelector('.label')?.textContent?.trim() ?? '';
        setFrame({ x: r.left, y: r.top, w: r.width, h: r.height, label: `card · ${n} ${label}`.trim(), kind: 'type' });
        return;
      }
      // a prop is never framed: no marquee on the desk's things, only on its type
      if (thingOf(t)) { setFrame(null); return; }
      const el = t.closest<HTMLElement>(INSPECTABLE);
      if (el && el.closest('.about-desk__folder')) {
        const r = el.getBoundingClientRect();
        setFrame({ x: r.left, y: r.top, w: r.width, h: r.height, label: typeSpec(el), kind: 'type' });
        return;
      }
      setFrame(null);
    };
    const clear = () => setFrame(null);
    document.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', clear, { passive: true });
    document.addEventListener('pointerleave', clear);
    return () => { document.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', clear); document.removeEventListener('pointerleave', clear); };
  }, [flavor, inspect]);

  if (flavor !== 'c' || !frame) return null;
  return (
    <div className={`inspect inspect--${frame.kind}`} style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }} aria-hidden="true">
      <span className="inspect__label">{frame.label}</span>
      {frame.kind === 'type' && <span className="inspect__size">{Math.round(frame.w)} × {Math.round(frame.h)}</span>}
    </div>
  );
};
