// ============================================
// HeroBubbles — the hero's intro (19 November 2026, "messy canvas").
// Ten trait words and the design system's own catalog (every component,
// style block and custom property in /system/catalog.json) start as a messy
// map around the portrait, tidy into rings, zoom out and pour into the photo.
// Four words stay behind as stickers around the ring.
//
// The canvas lives in the portrait column: it fades out before the copy, so
// the headline and paragraph read from the first frame. Hero owns the stage
// (data-intro-stage); this component owns the 2.4s timeline, the hub dot, the
// photo's growth and the stickers. One easing for every move (the house
// curve); the only overshoot is a word's first pop into empty space.
// Reduced motion, and any later visit in the same session, opens settled.
// ============================================
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Word = { text: string; to?: string; desktop?: number; mid?: number; midLift?: number; mobile?: number };

// The angle each sticker settles at (deg, 0 = right, clockwise), per width:
// desktop (1280 and up) spreads the four over the top of the ring; mid
// (1024–1279) stacks them in a staggered cluster above it, midLift raising a
// sticker into a second row; mobile puts them on the portrait's four corners.
// Each set was searched in a headless browser to stay clear of the copy, the
// Roles panel, the nav, the screen edge and each other at every width.
// Words without an angle pour into the portrait with the catalog.
const WORDS: Word[] = [
  { text: 'Ambitious', desktop: -145, mid: -118, midLift: 0, mobile: -125 },
  { text: 'Point of View' },
  { text: 'System Driven', to: '/design-system', desktop: -108, mid: -102, midLift: 30, mobile: -55 },
  { text: 'Craft' },
  { text: 'Ruthlessly Curious', to: '/talent-tree', desktop: -72, mid: -65, midLift: 50, mobile: 125 },
  { text: 'Committed', to: '/work/wheelrack/', desktop: -35, mid: -48, midLift: 0, mobile: 55 },
  { text: 'Care' },
  { text: 'Visual Problem Solver' },
  { text: 'Restless' },
  { text: 'Adaptive' },
];

// The timeline is authored at 2.4s and played at 3.4s (Ryan, 20 November):
// every beat stretches evenly, so the choreography keeps its proportions.
const AUTHORED = 2400;
export const BUBBLES_DURATION = 3400;
export const BUBBLES_STRETCH = BUBBLES_DURATION / AUTHORED;

// Settled stickers are placed by the browser, not by script: CSS anchor
// positioning ties each one to the portrait's ring (_hero-bubbles.scss), so a
// resize moves them on the same frame as the portrait, with nothing to
// recalculate or glide. The geometry here and in the stylesheet is the same:
// a radius of half the profile plus 30px on desktop (the sticker's near edge
// on that circle), and the sticker's centre at 1.02 of the radius on a phone.
// Browsers without anchor positioning keep the script placement below.
const anchorable = () => typeof CSS !== 'undefined' && CSS.supports('position-anchor: --hero-ring') && CSS.supports('left: anchor(center)');

type Mark = { kind: 'comp' | 'block' | 'prop'; prod: boolean; x: number; y: number; k: number; j: number; sz: number };
type Pt = { x: number; y: number };
type WordState = { w: number; h: number; ang: number; radial: Pt; messy: Pt & { rot: number; s: number }; fin: Pt; show: boolean; tilt: number; r: number[] };

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const popEase = (p: number) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
// the house curve, cubic-bezier(0.2, 0.8, 0, 1), solved for x
const ease = (p: number) => {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const bx = (u: number) => 3 * 0.2 * u * (1 - u) * (1 - u) + u * u * u;
  const by = (u: number) => 3 * 0.8 * u * (1 - u) * (1 - u) + 3 * u * u * (1 - u) + u * u * u;
  let lo = 0, hi = 1, u = p;
  for (let i = 0; i < 22; i++) { u = (lo + hi) / 2; if (bx(u) < p) lo = u; else hi = u; }
  return by(u);
};
const seeded = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};

type Catalog = { components: { name: string }[]; blocks: number; props: number; production: Set<string> };
// The marks are the real system: /system/catalog.json and the registry. In
// development the catalog may not be built yet; then the counts stand in.
const FALLBACK: Catalog = { components: Array.from({ length: 102 }, (_, i) => ({ name: `c${i}` })), blocks: 195, props: 260, production: new Set() };

interface HeroBubblesProps {
  /** The hero section: every position is measured relative to it. */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Set when the intro should start; Hero flips its stages on the same clock. */
  playing: boolean;
}

const HeroBubbles: React.FC<HeroBubblesProps> = ({ sectionRef, playing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRefs = useRef<(HTMLElement | null)[]>([]);
  const geo = useRef<{ C: Pt; R: number; mobile: boolean; W: number; H: number; words: WordState[]; marks: Mark[]; colours: Record<string, string> } | null>(null);
  const catalog = useRef<Catalog>(FALLBACK);
  const raf = useRef(0);
  const [placed, setPlaced] = useState(false);
  const [settled, setSettled] = useState(false);
  const [anchored, setAnchored] = useState(false);
  const [gliding, setGliding] = useState(false);

  // ---- measure: the portrait's ring, the copy, the Roles panel ----
  const measure = useCallback(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const sr = section.getBoundingClientRect();
    const rel = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x0: b.left - sr.left, y0: b.top - sr.top, x1: b.right - sr.left, y1: b.bottom - sr.top };
    };
    // the ring is never transformed, so it measures the circle at rest
    const ring = rel(section.querySelector('.hero__intro-ring'));
    const copy = rel(section.querySelector('.hero-intro__copy'));
    const panel = rel(section.querySelector('.hero-intro__roles'));
    if (!ring || !copy) return;
    const W = sr.width, H = sr.height;
    const mobile = W < 1024;
    const C = { x: (ring.x0 + ring.x1) / 2, y: (ring.y0 + ring.y1) / 2 };
    const R = (ring.x1 - ring.x0) / 2 / 1.055;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    // fade the canvas out before the copy (desktop) or below the portrait (stacked)
    const mask = mobile
      ? `linear-gradient(to bottom, black ${ring.y1 + 20}px, transparent ${ring.y1 + 80}px)`
      : `linear-gradient(to right, transparent ${copy.x1 + 18}px, black ${copy.x1 + 88}px)`;
    canvas.style.maskImage = mask;
    canvas.style.webkitMaskImage = mask;

    const css = getComputedStyle(section);
    const colours = {
      ink: css.getPropertyValue('--color-text-primary').trim() || 'black',
      steel: css.getPropertyValue('--color-secondary').trim() || 'gray',
      steelDark: css.getPropertyValue('--color-secondary-dark').trim() || 'gray',
      accent: css.getPropertyValue('--color-primary').trim() || 'orangered',
    };

    const rand = seeded(31);
    const words: WordState[] = WORDS.map((word, i) => {
      const el = wordRefs.current[i];
      const w = el?.offsetWidth ?? 100, h = el?.offsetHeight ?? 30;
      const r = [rand(), rand(), rand(), rand(), rand()];
      const ang = (i / WORDS.length) * Math.PI * 2 - Math.PI / 2 + 0.2;
      const rr = R * (mobile ? 0.86 : 1.18), sx = mobile ? 1 : 1.15;
      const x0 = mobile ? W * 0.1 : copy.x1 + 48, spanX = mobile ? W * 0.8 : (W - x0) * 0.8;
      const yTop = mobile ? ring.y0 : ring.y0 - 40, spanY = mobile ? ring.y1 - ring.y0 : ring.y1 - ring.y0 + 80;
      const deg = mobile ? word.mobile : word.desktop;
      return {
        w, h, ang, r, show: deg !== undefined, tilt: (r[0] - 0.5) * 9,
        // on desktop the map never crosses into the copy column
        radial: { x: mobile ? C.x + Math.cos(ang) * rr * sx : Math.max(copy.x1 + w / 2 + 12, C.x + Math.cos(ang) * rr * sx), y: C.y + Math.sin(ang) * rr },
        messy: { x: x0 + r[0] * spanX, y: yTop + r[1] * spanY, rot: (r[2] - 0.5) * 26, s: 0.92 + r[3] * 0.3 },
        fin: { ...C },
      };
    });
    // where the stickers settle: just outside the ring at their angle, then
    // pushed clear of each other, the copy, the panel and the section's edges
    const anchored = anchorable();
    words.forEach((s, i) => {
      const deg = mobile ? WORDS[i].mobile : WORDS[i].desktop;
      if (deg === undefined) return;
      const a = (deg * Math.PI) / 180;
      if (anchored) {
        // read the stylesheet's angle, lift and push for this width, so the
        // intro's last frame is exactly where CSS will hold the sticker
        const el = wordRefs.current[i];
        const cs = el ? getComputedStyle(el) : null;
        const ca = cs ? (parseFloat(cs.getPropertyValue('--a')) * Math.PI) / 180 : a;
        const lift = cs ? parseFloat(cs.getPropertyValue('--lift')) || 0 : 0;
        const push = cs ? parseFloat(cs.getPropertyValue('--push')) : mobile ? 0 : 1;
        const r = push ? R + 30 + lift : R * 1.02;
        s.fin = { x: C.x + Math.cos(ca) * r + push * Math.cos(ca) * s.w / 2, y: C.y + Math.sin(ca) * r + push * Math.sin(ca) * s.h / 2 };
        return;
      }
      if (mobile) {
        const r = R * 1.02;
        s.fin = { x: Math.max(14 + s.w / 2, Math.min(W - 14 - s.w / 2, C.x + Math.cos(a) * r)), y: C.y + Math.sin(a) * r };
        return;
      }
      const ext = Math.abs(Math.cos(a)) * s.w / 2 + Math.abs(Math.sin(a)) * s.h / 2;
      const r = R + 30 + ext;
      s.fin = { x: C.x + Math.cos(a) * r, y: C.y + Math.sin(a) * r };
    });
    if (!mobile && !anchored) {
      const shown = words.filter((s) => s.show).map((s) => ({ s, hw: s.w / 2 + 6, hh: s.h / 2 + 5 }));
      const rects = [{ x0: copy.x0 - 10, y0: copy.y0 - 10, x1: copy.x1 + 24, y1: copy.y1 + 10 }];
      if (panel) rects.push({ x0: panel.x0 - 10, y0: panel.y0 - 10, x1: panel.x1 + 10, y1: panel.y1 + 10 });
      const navBottom = section.querySelector('.hero__nav')?.getBoundingClientRect().bottom ?? sr.top;
      const top = navBottom - sr.top + 10;
      for (let n = 0; n < 90; n++) {
        for (let i = 0; i < shown.length; i++) for (let j = i + 1; j < shown.length; j++) {
          const a = shown[i], b = shown[j], dx = b.s.fin.x - a.s.fin.x, dy = b.s.fin.y - a.s.fin.y;
          const ox = a.hw + b.hw - Math.abs(dx), oy = a.hh + b.hh - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (ox < oy) { const m = (ox / 2) * Math.sign(dx || 1); a.s.fin.x -= m; b.s.fin.x += m; }
            else { const m = (oy / 2) * Math.sign(dy || 1); a.s.fin.y -= m; b.s.fin.y += m; }
          }
        }
        shown.forEach((o) => {
          const p = o.s.fin;
          const nx = Math.max(p.x - o.hw, Math.min(C.x, p.x + o.hw)), ny = Math.max(p.y - o.hh, Math.min(C.y, p.y + o.hh));
          const d = Math.hypot(nx - C.x, ny - C.y), need = R + 18;
          if (d < need) { const ux = p.x - C.x || 0.01, uy = p.y - C.y || 0.01, l = Math.hypot(ux, uy); p.x += (ux / l) * (need - d); p.y += (uy / l) * (need - d); }
          rects.forEach((q) => {
            if (p.x + o.hw > q.x0 && p.x - o.hw < q.x1 && p.y + o.hh > q.y0 && p.y - o.hh < q.y1) {
              const opts = [[q.x0 - (p.x + o.hw), 0], [q.x1 - (p.x - o.hw), 0], [0, q.y0 - (p.y + o.hh)], [0, q.y1 - (p.y - o.hh)]];
              opts.sort((u, v) => Math.abs(u[0] + u[1]) - Math.abs(v[0] + v[1]));
              p.x += opts[0][0]; p.y += opts[0][1];
            }
          });
          p.x = Math.max(12 + o.hw, Math.min(W - 12 - o.hw, p.x));
          p.y = Math.max(top + o.hh, Math.min(H - 10 - o.hh, p.y));
        });
      }
    }

    // the catalog as rings of bubbles around the hub
    const cat = catalog.current;
    const r2 = seeded(5);
    const marks: Mark[] = [];
    const sets: { kind: Mark['kind']; n: number; rings: number[]; prod: (i: number) => boolean }[] = [
      { kind: 'comp', n: cat.components.length, rings: [1], prod: (i) => cat.production.has(cat.components[i].name) },
      { kind: 'block', n: cat.blocks, rings: [2, 3], prod: () => false },
      { kind: 'prop', n: cat.props, rings: [4, 5], prod: () => false },
    ];
    sets.forEach((set) => {
      const per = Math.ceil(set.n / set.rings.length);
      set.rings.forEach((k, ri) => {
        const n = Math.min(per, set.n - ri * per), rad = R * (1.5 + k * 0.42);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + (r2() - 0.5) * 0.05 + k * 0.37, rr = rad * (1 + (r2() - 0.5) * 0.12);
          marks.push({ kind: set.kind, prod: set.prod(ri * per + i), x: C.x + Math.cos(a) * rr * (mobile ? 1 : 1.1), y: C.y + Math.sin(a) * rr, k, j: r2(), sz: 0.7 + r2() * 0.6 });
        }
      });
    });

    geo.current = { C, R, mobile, W, H, words, marks, colours };
  }, [sectionRef]);

  // ---- one frame of the timeline (played time in, authored time inside) ----
  const render = useCallback((played: number) => {
    const t = played / BUBBLES_STRETCH;
    const g = geo.current, canvas = canvasRef.current, section = sectionRef.current;
    if (!g || !canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { C, R, mobile, W, H, words, marks, colours } = g;
    ctx.clearRect(0, 0, W, H);
    const cam = lerp(1, mobile ? 0.45 : 0.4, ease(clamp((t - 760) / 640)));
    const toScreen = (p: Pt) => ({ x: C.x + (p.x - C.x) * cam, y: C.y + (p.y - C.y) * cam });
    const merge = (d: number) => ease(clamp((t - 1250 - d * 220) / 440));

    words.forEach((s, i) => {
      const el = wordRefs.current[i];
      if (!el) return;
      const pop = popEase(clamp((t - i * 28) / 220));
      const k = ease(clamp((t - 400 - i * 12) / 440));
      const f2 = ease(clamp((t - 1450 - i * 30) / 520));
      const wp = { x: lerp(s.messy.x, s.radial.x, k), y: lerp(s.messy.y, s.radial.y, k) };
      let sp: Pt, op = clamp(pop * 2), sc = pop * lerp(s.messy.s, 1, k);
      let rot = lerp(s.messy.rot, 0, k);
      if (s.show) { sp = { x: lerp(wp.x, s.fin.x, f2), y: lerp(wp.y, s.fin.y, f2) }; rot = lerp(rot, s.tilt, f2); }
      else { const m = merge(0.05); sp = { x: lerp(wp.x, C.x, m), y: lerp(wp.y, C.y, m) }; op *= 1 - m; sc *= 1 - m * 0.8; }
      el.style.transform = `translate(${sp.x - s.w / 2}px, ${sp.y - s.h / 2}px) rotate(${rot}deg) scale(${Math.max(sc, 0.001)})`;
      el.style.opacity = String(op);
      // spokes to the hub while the map is a map
      const sm = ease(clamp((t - 1200) / 300));
      if (sm < 1) {
        const off = (1 - k) * (s.r[4] - 0.5) * 240;
        ctx.globalAlpha = clamp(pop) * (1 - sm) * (0.3 + 0.2 * k);
        ctx.strokeStyle = colours.ink; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(C.x, C.y);
        ctx.quadraticCurveTo((C.x + sp.x) / 2 + off, (C.y + sp.y) / 2 - off * 0.6, sp.x, sp.y); ctx.stroke();
      }
    });

    marks.forEach((a) => {
      const ap = popEase(clamp((t - 740 - a.k * 80 - a.j * 70) / 170));
      if (ap <= 0) return;
      let p = toScreen(a);
      const m = merge((a.k / 5) * 0.85 + a.j * 0.15);
      p = { x: lerp(p.x, C.x, m), y: lerp(p.y, C.y, m) };
      const s = cam * ap * (1 - m * 0.6) * a.sz;
      ctx.globalAlpha = 1 - m * m;
      ctx.beginPath();
      if (a.kind === 'comp') {
        ctx.arc(p.x, p.y, Math.max(1.2, 6 * s), 0, Math.PI * 2);
        if (a.prod) { ctx.fillStyle = colours.accent; ctx.fill(); }
        else { ctx.strokeStyle = colours.ink; ctx.lineWidth = Math.max(0.6, s); ctx.stroke(); }
      } else {
        ctx.fillStyle = a.kind === 'block' ? colours.steel : colours.steelDark;
        ctx.arc(p.x, p.y, Math.max(0.7, (a.kind === 'block' ? 3.4 : 2.2) * s), 0, Math.PI * 2); ctx.fill();
      }
    });

    // the hub, then the photo growing out of it
    if (t < 1450) {
      const hub = clamp(t / 200) * (t < 900 ? 9 : lerp(9, 5, clamp((t - 900) / 400)));
      ctx.globalAlpha = 1; ctx.fillStyle = colours.ink;
      ctx.beginPath(); ctx.arc(C.x, C.y, hub, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const profile = section.querySelector<HTMLElement>('.hero__profile');
    if (profile) {
      const grow = ease(clamp((t - 1450) / 520));
      profile.style.transform = t >= AUTHORED ? '' : `scale(${t < 1450 ? 0.0001 : lerp(5 / R, 1, grow)})`;
      profile.style.opacity = t >= AUTHORED ? '' : String(clamp((t - 1450) / 200));
    }
  }, [sectionRef]);

  // Settled. Where the browser can anchor, hand each sticker to the stylesheet:
  // drop the script's transform and let CSS hold it to the ring. Elsewhere,
  // each sticker keeps its offset from the ring's centre and is re-anchored to
  // wherever the ring is now, every frame of a resize.
  const anchor = useCallback(() => {
    const g = geo.current, section = sectionRef.current;
    const ring = section?.querySelector('.hero__intro-ring');
    if (!g || !section || !ring) return;
    if (anchorable()) {
      g.words.forEach((s, i) => {
        const el = wordRefs.current[i];
        if (!el || !s.show) return;
        el.style.setProperty('--tilt', `${s.tilt}deg`);
        el.style.opacity = '1';
      });
      // the script's transform comes off in the layout effect below, after
      // the anchored class is on the page, so no frame shows neither
      setAnchored(true);
      return;
    }
    const sr = section.getBoundingClientRect(), rr = ring.getBoundingClientRect();
    const cx = (rr.left + rr.right) / 2 - sr.left, cy = (rr.top + rr.bottom) / 2 - sr.top;
    g.words.forEach((s, i) => {
      const el = wordRefs.current[i];
      if (!el || !s.show) return;
      el.style.transform = `translate(${cx + s.fin.x - g.C.x - s.w / 2}px, ${cy + s.fin.y - g.C.y - s.h / 2}px) rotate(${s.tilt}deg)`;
      el.style.opacity = '1';
    });
  }, [sectionRef]);

  const settle = useCallback(() => {
    measure();
    render(BUBBLES_DURATION);
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, geo.current?.W ?? 0, geo.current?.H ?? 0);
    anchor();
    setPlaced(true);
    setSettled(true);
  }, [measure, render, anchor]);

  // Hand the stickers to the stylesheet once the anchored class is committed,
  // before the browser paints: the script's last transform and the CSS spot
  // are the same place, so nothing moves.
  useLayoutEffect(() => {
    if (!anchored) return;
    geo.current?.words.forEach((s, i) => {
      const el = wordRefs.current[i];
      if (el && s.show) el.style.transform = '';
    });
  }, [anchored]);

  // the catalog: fetched once, quietly
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch('/system/catalog.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/system/registry.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([cat, reg]) => {
      if (!alive || !cat || !Array.isArray(cat.components)) return;
      const blocks = Array.isArray(cat.styles) ? new Set(cat.styles.flatMap((s: { blocks?: string[] }) => s.blocks ?? [])).size : FALLBACK.blocks;
      const props = cat.customProperties?.names?.length ?? FALLBACK.props;
      const production = new Set<string>(Object.entries(reg?.components ?? {}).filter(([, e]) => (e as { size?: string }).size === 'production').map(([n]) => n));
      catalog.current = { components: cat.components, blocks, props, production };
    });
    return () => { alive = false; };
  }, []);

  // play, or open settled
  useLayoutEffect(() => {
    if (!playing) return;
    // plays on every load; reduced motion opens settled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { settle(); return; }
    measure();
    setPlaced(true);
    setSettled(false);
    setAnchored(false);
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(BUBBLES_DURATION, now - start);
      render(t);
      if (t < BUBBLES_DURATION) raf.current = requestAnimationFrame(frame);
      else settle();
    };
    render(0);
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, measure, render, settle]);

  // Keep the stickers with the portrait as the layout changes. Every frame of a
  // resize re-anchors them to the ring; once the resize settles, the spots are
  // worked out again, and only if they moved (a breakpoint, a sticker that
  // would now touch the copy) do the stickers glide to them.
  useEffect(() => {
    if (!settled || anchored) return;   // anchored stickers need no script on resize
    let frame = 0, timer: ReturnType<typeof setTimeout>, glideTimer: ReturnType<typeof setTimeout>;
    const offsets = () => (geo.current?.words ?? []).map((s) => `${Math.round(s.fin.x - (geo.current?.C.x ?? 0))},${Math.round(s.fin.y - (geo.current?.C.y ?? 0))}`).join('|');
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(anchor);
      clearTimeout(timer);
      timer = setTimeout(() => {
        const before = offsets();
        measure();
        canvasRef.current?.getContext('2d')?.clearRect(0, 0, geo.current?.W ?? 0, geo.current?.H ?? 0);
        if (offsets() !== before) {
          setGliding(true);
          clearTimeout(glideTimer);
          glideTimer = setTimeout(() => setGliding(false), 460);
        }
        anchor();
      }, 160);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(frame); clearTimeout(timer); clearTimeout(glideTimer); };
  }, [settled, anchored, measure, anchor]);

  return (
    <div className={`hero-bubbles${placed ? ' hero-bubbles--placed' : ''}${gliding ? ' hero-bubbles--gliding' : ''}${anchored ? ' hero-bubbles--anchored' : ''}`}>
      <canvas ref={canvasRef} className="hero-bubbles__canvas" aria-hidden="true" />
      {WORDS.map((word, i) => {
        const shown = word.desktop !== undefined || word.mobile !== undefined;
        const className = `hero-bubbles__word${shown ? ' hero-bubbles__word--sticker' : ' hero-bubbles__word--pours'}${word.desktop === undefined ? ' hero-bubbles__word--phone-only' : ''}${word.mobile === undefined ? ' hero-bubbles__word--desktop-only' : ''}`;
        const ref = (el: HTMLElement | null) => { wordRefs.current[i] = el; };
        // each sticker's angle around the ring, read by the stylesheet
        const style = shown ? ({ '--a-desktop': `${word.desktop ?? 0}deg`, '--a-mid': `${word.mid ?? word.desktop ?? 0}deg`, '--lift-mid': `${word.midLift ?? 0}px`, '--a-phone': `${word.mobile ?? 0}deg` } as React.CSSProperties) : undefined;
        if (word.to) return <Link key={word.text} ref={ref as React.Ref<HTMLAnchorElement>} to={word.to} className={className} style={style}>{word.text}</Link>;
        return <span key={word.text} ref={ref} className={className} style={style} aria-hidden={shown ? undefined : true}>{word.text}</span>;
      })}
    </div>
  );
};

export default HeroBubbles;
