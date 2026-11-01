// The hybrid's drawing pencil: a free layer over the whole page. It starts
// resting across the Forge sketch on the mat. Pick it up anywhere and it lifts
// toward the light, leans into the way it is carried, and goes wherever the
// pointer goes; let go and it falls the last few millimetres, lands with a
// small bounce, and rolls on with the speed it was let go at, flickering over
// its facets the way a hexagonal pencil does, before it settles.
// (find-animation-opportunities, 28 Oct: rare, gesture feedback, physical.)
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as Pencil } from '../../assets/desk/objects/pencil.svg';
import { facetLight } from './deskMotion';

const W = 556;
const H = 31;
const TURN = -18;
/** where it rests on the sketch, from the sketch's top left (the mat's own layout) */
const ON_SKETCH = { x: -42, y: 232 };
const FALL = 'cubic-bezier(0.55, 0, 1, 0.45)';
const OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const SETTLE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** measure: Hybrid C's instrument readout, how far the pencil has been carried, in millimetres */
export const FreePencil: React.FC<{ root: React.RefObject<HTMLElement | null>; scale: number; measure?: boolean }> = ({ root, scale, measure }) => {
  const [carried, setCarried] = useState<number | null>(null);
  const readout = useRef(0);
  const el = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [held, setHeld] = useState(false);
  const moved = useRef(false); // once the reader has moved it, it no longer follows the sketch
  const resting = useRef(true); // still lying on the sketch
  const drag = useRef<{ sx: number; sy: number; x: number; y: number; lx: number; ly: number; lt: number; vx: number; vy: number; cx: number; cy: number } | null>(null);
  const frame = useRef(0);

  // until it is moved, it lies on the sketch, wherever the sketch is laid out
  const home = useCallback(() => {
    const r = root.current;
    const sketch = document.getElementById('t-sketch');
    if (!r || !sketch) return null;
    const R = r.getBoundingClientRect();
    const S = sketch.getBoundingClientRect();
    return { x: S.left - R.left + ON_SKETCH.x * scale, y: S.top - R.top + ON_SKETCH.y * scale };
  }, [root, scale]);
  useLayoutEffect(() => {
    const place = () => { if (!moved.current) { const h = home(); if (h) setPos(h); } };
    place();
    const t = window.setTimeout(place, 400);
    window.addEventListener('resize', place);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', place); };
  }, [home]);

  const bounds = () => {
    const r = root.current;
    return { w: (r?.offsetWidth ?? window.innerWidth) - 120, h: (r?.offsetHeight ?? 4000) - 60 };
  };

  /** the landing: a short fall, a small bounce, then a roll on the release speed */
  const land = (sx: number, sy: number, vx: number, vy: number) => {
    const b = body.current;
    const start = { x: sx, y: sy };
    if (!b || reduced()) { setPos(start); return; }
    b.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(0.985)' }], { duration: 160, easing: FALL })
      .finished.then(() => b.animate([{ transform: 'scale(0.985)' }, { transform: 'scale(1.012)' }, { transform: 'scale(1)' }], { duration: 240, easing: OUT }))
      .catch(() => {});
    // the lean comes back to how it lies, with a little overshoot
    b.animate([{ rotate: `${clamp(vx * 8, -10, 10)}deg` }, { rotate: '0deg' }], { duration: 420, easing: SETTLE });
    let x = start.x, y = start.y;
    let ux = clamp(vx, -0.8, 0.8), uy = clamp(vy, -0.8, 0.8);
    if (Math.hypot(ux, uy) < 0.05) {
      // dropped still: it rolls a hair across its own width, as a hexagon does
      const a = (TURN * Math.PI) / 180;
      ux = -Math.sin(a) * 0.12; uy = Math.cos(a) * 0.12;
    }
    const svg = b.querySelector<SVGElement>('svg');
    let last = performance.now();
    let rolled = 0;
    const bd = bounds();
    // it rolls by transform from where it landed, and only takes its new place when it stops
    const node = el.current;
    const rest = () => {
      if (node) { node.style.left = `${Math.round(x)}px`; node.style.top = `${Math.round(y)}px`; node.style.transform = ''; }
      if (svg) svg.style.filter = '';
      setPos({ x, y });
      frame.current = 0;
    };
    const step = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      const nx = clamp(x + ux * dt, 0, bd.w), ny = clamp(y + uy * dt, 60, bd.h);
      const ds = Math.hypot(nx - x, ny - y);
      x = nx; y = ny; rolled += ds;
      if (node) node.style.transform = `translate(${(x - start.x).toFixed(2)}px, ${(y - start.y).toFixed(2)}px)`;
      // its facets flash as they turn to the light, blurred while they pass fast (r = 11px: a 7mm pencil)
      if (svg) svg.style.filter = `brightness(${facetLight(rolled, ds, 11).toFixed(3)})`;
      // a pencil on a desk stops quickly: a flick rolls it about 110px at most
      const f = Math.pow(0.88, dt / 16.7);
      ux *= f; uy *= f;
      if (Math.hypot(ux, uy) < 0.01) { rest(); return; }
      frame.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(step);
  };

  const down = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || !pos) return;
    cancelAnimationFrame(frame.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    // page coordinates, so a scroll while holding it carries it along
    drag.current = { sx: e.clientX + window.scrollX, sy: e.clientY + window.scrollY, x: pos.x, y: pos.y, lx: e.clientX, ly: e.clientY, lt: now, vx: 0, vy: 0, cx: e.clientX, cy: e.clientY };
    setHeld(true);
  };
  /** put the held pencil under the pointer, in page coordinates */
  const follow = (clientX: number, clientY: number) => {
    const d = drag.current;
    if (!d) return;
    const bd = bounds();
    const x = clamp(d.x + clientX + window.scrollX - d.sx, 0, bd.w);
    const y = clamp(d.y + clientY + window.scrollY - d.sy, 60, bd.h);
    moved.current = true;
    resting.current = false;
    const node = el.current;
    if (node) { node.style.left = `${Math.round(x)}px`; node.style.top = `${Math.round(y)}px`; }
  };
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lt);
    d.vx = d.vx * 0.6 + ((e.clientX - d.lx) / dt) * 0.4;
    d.vy = d.vy * 0.6 + ((e.clientY - d.ly) / dt) * 0.4;
    d.lx = e.clientX; d.ly = e.clientY; d.lt = now; d.cx = e.clientX; d.cy = e.clientY;
    follow(e.clientX, e.clientY);
    if (measure) {
      const dx = e.clientX + window.scrollX - d.sx, dy = e.clientY + window.scrollY - d.sy;
      setCarried(Math.round(Math.hypot(dx, dy) / (3.175 * scale)));
    }
    // carried by the middle, it leans into the way it is moving
    if (body.current) body.current.style.rotate = `${clamp(d.vx * 8, -10, 10).toFixed(2)}deg`;
  };
  // scrolling while holding it: the pencil stays in the hand
  useEffect(() => {
    if (!held) return undefined;
    const onScroll = () => { const d = drag.current; if (d) follow(d.cx, d.cy); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held]);
  const up = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setHeld(false);
    const node = el.current;
    const x = node ? parseFloat(node.style.left) : 0;
    const y = node ? parseFloat(node.style.top) : 0;
    setPos({ x, y });
    if (body.current) body.current.style.rotate = '';
    const fresh = performance.now() - d.lt < 90;
    window.clearTimeout(readout.current);
    readout.current = window.setTimeout(() => setCarried(null), 1600);
    land(x, y, fresh ? d.vx : 0, fresh ? d.vy : 0);
  };

  // clicking the sketch rolls the pencil off it, if it is still lying there
  useEffect(() => {
    const sketch = document.getElementById('t-sketch');
    if (!sketch) return undefined;
    const roll = () => {
      if (!resting.current) return;
      resting.current = false;
      moved.current = true;
      const a = (TURN * Math.PI) / 180;
      const node = el.current;
      land(node ? parseFloat(node.style.left) : 0, node ? parseFloat(node.style.top) : 0, -Math.sin(a) * 0.55, Math.cos(a) * 0.55);
    };
    sketch.addEventListener('click', roll);
    return () => sketch.removeEventListener('click', roll);
  });

  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 12;
    const v = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, [number, number]>)[e.key];
    if (!v || !pos) return;
    e.preventDefault();
    moved.current = true;
    resting.current = false;
    setPos({ x: pos.x + v[0], y: pos.y + v[1] });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  if (!pos) return null;
  return (
    <button
      type="button"
      ref={el}
      id="t-pencil"
      className={`free-pencil${held ? ' is-held' : ''}`}
      style={{ left: pos.x, top: pos.y, width: W * scale, height: H * scale }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
      aria-label="Drawing pencil, 8H. Pick it up and drop it anywhere on the page, or move it with the arrow keys."
    >
      {measure && carried !== null && <span className="free-pencil__readout" aria-hidden="true">carried {carried} mm</span>}
      <span className="free-pencil__body" ref={body}>
        <span className="free-pencil__turn" style={{ rotate: `${TURN}deg` }}>
          <Pencil className="s" style={{ width: W * scale, height: H * scale }} aria-hidden="true" focusable="false" />
        </span>
      </span>
    </button>
  );
};
