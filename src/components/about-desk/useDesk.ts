// The desk's physics. Every thing can be picked up and put down anywhere,
// nudged with the arrow keys, and comes to the top when touched; past that,
// each kind of thing moves like itself (plans/006-about-desk-motion.md): the
// Dragon Ball rolls, the disc spins, the football rocks, the cards tilt, the
// trackpad drags like glass. A drag writes
// straight to the held thing's element, so the page does not re-render on
// every pointer move; React hears about it when the thing comes to rest.
//
// Where things sit never depends on which tab is open: the page hands in the
// height of the tallest tab, and the desk is laid out from that.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DESK_THINGS, DeskKind, DeskThing, FOLDER, LOWER_MIN_TOP } from './deskObjects';
import { BALL_REST, BallTurn, paintStars, rollTurn } from './DeskDrawings';

type Pos = [number, number, number, number];
type Vec = { x: number; y: number };

const DESK_START: Record<string, Pos> = Object.fromEntries(DESK_THINGS.map((t) => [t.id, [...t.start] as Pos]));
const BY_ID: Record<string, DeskThing> = Object.fromEntries(DESK_THINGS.map((t) => [t.id, t]));
const isLower = (id: string) => BY_ID[id]?.group === 'lower';
const kindOf = (id: string): DeskKind | undefined => BY_ID[id]?.kind;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const FRAME = 1000 / 60;

export interface DeskLink {
  key: string;
  to: string;
  x1: number;
  y1: number;
}

export interface DeskOptions {
  /** the folder's height under its tallest tab */
  folderHeight: number;
  /** a click on a thing that was not dragged: open its note */
  onNote: (note: string, id: string) => void;
  /**
   * The contained layout (/about-desk/contained): things live in boxes of
   * their own (a side tray, the mat below the folder), each placed from its own
   * top, nothing stretched; the archive cards stay put and only come forward.
   */
  contained?: { starts: Record<string, Pos>; rootFor: (id: string) => HTMLElement | null; fixed?: boolean };
}

export function useDesk(root: React.RefObject<HTMLElement | null>, { folderHeight, onNote, contained }: DeskOptions) {
  const flat = !!contained;
  const START = contained ? contained.starts : DESK_START;
  const box = useRef(contained?.rootFor);
  box.current = contained?.rootFor;
  const fixedRef = useRef(!!contained?.fixed);
  fixedRef.current = !!contained?.fixed;
  const [pos, setPos] = useState<Record<string, Pos>>(START);
  const [z, setZ] = useState<Record<string, number>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [link, setLink] = useState<DeskLink | null>(null);
  /** clicks per thing: the AirPods open on odd ones, the notebook turns a page on each */
  const [taps, setTaps] = useState<Record<string, number>>({});

  const live = useRef<Record<string, Pos>>(START);
  const els = useRef<Record<string, HTMLElement | null>>({});
  const top = useRef(20);
  const drag = useRef<{ id: string; sx: number; sy: number; x: number; y: number; k: number; st: number; lx: number; ly: number; lt: number; v: Vec } | null>(null);
  const moved = useRef(false);
  const frames = useRef<Record<string, number>>({});
  const spin = useRef<Record<string, number>>({});
  const tilt = useRef<Record<string, Vec>>({});
  const ball = useRef<BallTurn>(BALL_REST);
  const padTarget = useRef<Vec | null>(null);
  const lightFrame = useRef(0);
  const noteTimer = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => { reduced.current = mq.matches; };
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  const lowerTop = Math.max(LOWER_MIN_TOP, FOLDER.top + folderHeight + 90);
  const stretch = useCallback((id: string) => (flat || isLower(id) ? 1 : Math.max(1, (lowerTop - 80) / 1650)), [lowerTop, flat]);
  const geo = useRef({ lowerTop, stretch });
  geo.current = { lowerTop, stretch };

  /** a thing's top on the desk, from its unstretched position */
  const topOf = (id: string, y: number) => Math.round(y * geo.current.stretch(id)) + (!flat && isLower(id) ? geo.current.lowerTop : 0);

  // the page may show the desk scaled down; a drag moves in the desk's own pixels
  const scale = useCallback((id?: string) => {
    const el = (id && box.current?.(id)) || root.current;
    if (!el || !el.offsetWidth) return 1;
    return el.getBoundingClientRect().width / el.offsetWidth || 1;
  }, [root]);

  const register = useCallback((id: string) => (el: HTMLElement | null) => { els.current[id] = el; }, []);
  const body = (id: string) => els.current[id]?.querySelector<HTMLElement>('.loose__body') ?? null;
  const part = <T extends Element>(id: string, name: string) => els.current[id]?.querySelector<T>(`[data-part="${name}"]`) ?? null;

  /** write a thing's place straight to its element, without React */
  const paint = (id: string) => {
    const el = els.current[id];
    const p = live.current[id];
    if (!el || !p) return;
    el.style.left = `${Math.round(p[0])}px`;
    el.style.top = `${topOf(id, p[1])}px`;
  };
  const commit = () => setPos({ ...live.current });
  const stop = (id: string) => { cancelAnimationFrame(frames.current[id]); delete frames.current[id]; };

  // ── what each kind does with a movement ──────────────────────────────────
  // the Dragon Ball's stars turn with it (DeskDrawings: rollTurn, paintStars)
  const paintBall = () => { const el = els.current.ball; if (el) paintStars(el, ball.current); };
  const rollBall = (dx: number, dy: number) => {
    ball.current = rollTurn(ball.current, dx, dy, (BY_ID.ball?.width ?? 241) / 2);
    paintBall();
  };
  const paintSpin = (id: string) => {
    const g = part<SVGGElement>(id, 'spin');
    if (g) g.style.transform = `rotate(${(spin.current[id] || 0).toFixed(1)}deg)`;
  };
  const paintTilt = (id: string, kind: DeskKind) => {
    const b = body(id);
    const t = tilt.current[id] || { x: 0, y: 0 };
    if (!b) return;
    if (kind === 'card') b.style.transform = `perspective(900px) rotateX(${t.y.toFixed(2)}deg) rotateY(${t.x.toFixed(2)}deg)`;
    else b.style.transform = `rotate(${t.x.toFixed(2)}deg)`;
  };

  /** while held: everything a kind does on top of following the pointer */
  const onDragFrame = (id: string, dx: number, dy: number, v: Vec) => {
    const kind = kindOf(id);
    if (kind === 'ball') rollBall(dx, dy);
    if (kind === 'disc') { spin.current[id] = (spin.current[id] || 0) + Math.hypot(dx, dy) * 0.5 * Math.sign(dx || 1); paintSpin(id); }
    if (kind === 'card') { tilt.current[id] = { x: clamp(v.x * 9, -5, 5), y: clamp(-v.y * 9, -5, 5) }; paintTilt(id, kind); }
    if (kind === 'football') { tilt.current[id] = { x: clamp(v.x * 6, -8, 8), y: 0 }; paintTilt(id, kind); }
    if (kind === 'sketch') rollPencilOff();
  };

  /** let go: a rolling thing keeps rolling, a spun one keeps spinning */
  const glide = (id: string, v: Vec, decay: number, after?: () => void) => {
    stop(id);
    if (reduced.current) { commit(); after?.(); return; }
    let vx = clamp(v.x, -0.7, 0.7), vy = clamp(v.y, -0.7, 0.7);
    let last = performance.now();
    const st = geo.current.stretch(id);
    const step = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const dx = vx * dt, dy = vy * dt;
      const p = live.current[id];
      live.current = { ...live.current, [id]: [clamp(p[0] + dx, -400, 1700), p[1] + dy / st, p[2], p[3]] };
      paint(id);
      onDragFrame(id, dx, dy, { x: vx, y: vy });
      const f = Math.pow(decay, dt / FRAME);
      vx *= f; vy *= f;
      if (Math.hypot(vx, vy) < 0.015) { delete frames.current[id]; commit(); after?.(); return; }
      frames.current[id] = requestAnimationFrame(step);
    };
    frames.current[id] = requestAnimationFrame(step);
  };

  const spinDown = (id: string, w: number, decay: number) => {
    const key = `${id}:spin`;
    cancelAnimationFrame(frames.current[key]);
    if (reduced.current) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      spin.current[id] = (spin.current[id] || 0) + w * dt;
      paintSpin(id);
      w *= Math.pow(decay, dt / FRAME);
      if (Math.abs(w) < 0.01) { delete frames.current[key]; return; }
      frames.current[key] = requestAnimationFrame(step);
    };
    frames.current[key] = requestAnimationFrame(step);
  };

  const settleTilt = (id: string, kind: DeskKind) => {
    const b = body(id);
    if (!b) return;
    tilt.current[id] = { x: 0, y: 0 };
    b.style.transition = reduced.current ? 'none' : 'transform 420ms cubic-bezier(0.34, 1.4, 0.64, 1)';
    paintTilt(id, kind);
    window.setTimeout(() => { if (b) b.style.transition = ''; }, 440);
  };

  /** move a set of things to new places with an eased slide, then tell React */
  const settle = (moves: Record<string, Pos>, ms = 420, stagger = 0) => {
    const next = { ...live.current };
    Object.keys(moves).forEach((id, i) => {
      stop(id);
      next[id] = moves[id];
      const el = els.current[id];
      if (!el || reduced.current) return;
      el.style.transition = `left ${ms}ms cubic-bezier(0.23, 1, 0.32, 1) ${i * stagger}ms, top ${ms}ms cubic-bezier(0.23, 1, 0.32, 1) ${i * stagger}ms, transform ${ms}ms cubic-bezier(0.23, 1, 0.32, 1) ${i * stagger}ms`;
      window.setTimeout(() => { el.style.transition = ''; }, ms + i * stagger + 40);
    });
    live.current = next;
    commit();
  };

  // the pencil rests across the Forge sketch; move the sketch and it rolls off
  const pencilOn = useRef(true);
  const rollPencilOff = () => {
    if (!pencilOn.current) return;
    pencilOn.current = false;
    const p = live.current.pencil;
    const a = (p[2] * Math.PI) / 180;
    const nx = -Math.sin(a), ny = Math.cos(a);
    const to: Pos = [Math.round(p[0] + nx * 210), Math.round(p[1] + ny * 210), p[2] + 4, p[3]];
    settle({ pencil: to }, 760);
    const svg = els.current.pencil?.querySelector('svg');
    if (svg && !reduced.current) svg.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.5)' }, { filter: 'brightness(.8)' }, { filter: 'brightness(1.4)' }, { filter: 'brightness(.85)' }, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], { duration: 760, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  };

  // ── pointer handling ─────────────────────────────────────────────────────
  const grab = useCallback((id: string, e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest('[data-own-pointer]')) return;
    // the contained archive does not pick up; in the hybrid nothing on the lower page does
    if (flat && (kindOf(id) === 'card' || fixedRef.current)) return;
    stop(id);
    const p = live.current[id];
    const now = performance.now();
    drag.current = { id, sx: e.clientX, sy: e.clientY, x: p[0], y: p[1], k: scale(id), st: geo.current.stretch(id), lx: e.clientX, ly: e.clientY, lt: now, v: { x: 0, y: 0 } };
    moved.current = false;
    top.current += 1;
    setZ((prev) => ({ ...prev, [id]: top.current }));
    setHeld(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      // the room light follows the pointer, outside React
      const el = root.current;
      if (el && !lightFrame.current) {
        const cx = e.clientX, cy = e.clientY;
        lightFrame.current = requestAnimationFrame(() => {
          lightFrame.current = 0;
          const r = el.getBoundingClientRect();
          const lx = (cx - r.left) / r.width, ly = (cy - r.top) / r.height;
          el.style.setProperty('--streak-x', `${Math.round((lx - 0.5) * 160)}px`);
          el.style.setProperty('--streak-y', `${Math.round((ly - 0.5) * 60)}px`);
          el.style.setProperty('--win-x', `${Math.round((0.5 - lx) * 30)}px`);
          el.style.setProperty('--win-y', `${Math.round((0.3 - ly) * 16)}px`);
        });
      }
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.sx) / d.k;
      const dy = (e.clientY - d.sy) / d.k;
      if (!moved.current && Math.abs(dx) + Math.abs(dy) < 4) return;
      moved.current = true;
      const now = performance.now();
      const dt = Math.max(1, now - d.lt);
      const fx = (e.clientX - d.lx) / d.k, fy = (e.clientY - d.ly) / d.k;
      // release velocity: a short moving average, in desk pixels a millisecond
      d.v = { x: d.v.x * 0.6 + (fx / dt) * 0.4, y: d.v.y * 0.6 + (fy / dt) * 0.4 };
      d.lx = e.clientX; d.ly = e.clientY; d.lt = now;
      const p = live.current[d.id];
      const target: Pos = [d.x + dx, d.y + dy / d.st, p[2], p[3]];
      if (kindOf(d.id) === 'pad' && !reduced.current) {
        // glass on wood: the trackpad trails the pointer
        padTarget.current = { x: target[0], y: target[1] };
        if (!frames.current.pad) {
          const follow = () => {
            const t = padTarget.current;
            const q = live.current.pad;
            if (!t) { delete frames.current.pad; return; }
            const nx = q[0] + (t.x - q[0]) * 0.22, ny = q[1] + (t.y - q[1]) * 0.22;
            live.current = { ...live.current, pad: [nx, ny, q[2], q[3]] };
            paint('pad');
            if (!drag.current && Math.abs(t.x - nx) + Math.abs(t.y - ny) < 0.5) { padTarget.current = null; delete frames.current.pad; commit(); return; }
            frames.current.pad = requestAnimationFrame(follow);
          };
          frames.current.pad = requestAnimationFrame(follow);
        }
      } else {
        live.current = { ...live.current, [d.id]: target };
        paint(d.id);
      }
      onDragFrame(d.id, fx, fy, d.v);
    };
    const up = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setHeld(null);
      if (!moved.current) return;
      const kind = kindOf(d.id);
      const v = performance.now() - d.lt > 90 ? { x: 0, y: 0 } : d.v;
      if (kind === 'ball') glide(d.id, v, 0.955);
      else if (kind === 'football') { glide(d.id, v, 0.9); settleTilt(d.id, kind); }
      else if (kind === 'disc') { spinDown(d.id, Math.hypot(v.x, v.y) * 0.5 * Math.sign(v.x || 1), 0.975); commit(); }
      else if (kind === 'card') { settleTilt(d.id, kind); commit(); }
      else if (kind === 'pad') { /* the follow loop commits when it catches up */ }
      else commit();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);

  // ── a click: each kind does its own thing, then its note opens ──────────
  const tap = useCallback((id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    if (moved.current) { e.preventDefault(); moved.current = false; return; }
    const thing = BY_ID[id];
    const kind = thing.kind;
    const el = els.current[id];
    const b = body(id);
    const rm = reduced.current;
    const away = (): Vec => {
      // the direction from the pointer to the thing's middle; a key press pushes right
      if (!el || !('clientX' in e) || (e.clientX === 0 && e.clientY === 0)) return { x: 1, y: 0 };
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2 - e.clientX, y = r.top + r.height / 2 - e.clientY;
      const n = Math.hypot(x, y) || 1;
      return { x: x / n, y: y / n };
    };
    setTaps((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    // an archive card on the hybrid's mat keeps its place in the stack: a click only opens its note
    const still = flat && kind === 'card';
    if (!still) {
      top.current += 1;
      setZ((prev) => ({ ...prev, [id]: top.current }));
    }
    const p = live.current[id];
    if (kind === 'ball') { const a = away(); glide(id, { x: a.x * 0.32, y: a.y * 0.32 }, 0.94); }
    if (kind === 'disc') spinDown(id, 0.9, 0.982);
    if (kind === 'football') {
      const side = Math.random() < 0.5 ? -1 : 1;
      glide(id, { x: side * 0.156, y: 0.03 }, 0.9);
      if (b && !rm) b.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${10 * side}deg)` }, { transform: `rotate(${-5 * side}deg)` }, { transform: `rotate(${2 * side}deg)` }, { transform: 'rotate(0deg)' }], { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
    if (kind === 'card' && !flat) {
      const a = away();
      settle({ [id]: [p[0] + a.x * 6, p[1] + a.y * 6, p[2] + (a.x >= 0 ? 1.5 : -1.5), p[3]] }, 260);
    }
    if (kind === 'sketch') rollPencilOff();
    if ((kind === 'cart' || kind === 'console') && b && !rm) b.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(3px) rotate(-2deg)' }, { transform: 'translateY(1px) rotate(1.5deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    if ((kind === 'almanac' || kind === 'pack') && b && !rm) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.985)' }, { transform: 'scale(1)' }], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    if (kind === 'pad' && b && !rm) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.985)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    if (kind === 'pods') {
      // the buds land beside the case, wherever it is now
      const open = ((taps[id] || 0) + 1) % 2 === 1;
      if (open) {
        live.current = {
          ...live.current,
          'bud-l': [p[0] - 96, p[1] + 118, -24 + Math.round(Math.random() * 20), 6],
          'bud-r': [p[0] + 4, p[1] + 166, 152 + Math.round(Math.random() * 30), 6],
        };
        commit();
      }
    }
    window.clearTimeout(noteTimer.current);
    // the notebook opens its note on the first turn only; after that, a click just turns the page
    if (thing.note && !(kind === 'book' && (taps[id] || 0) > 0)) {
      const note = thing.note;
      noteTimer.current = window.setTimeout(() => onNote(note, id), rm || still ? 0 : 380);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taps, onNote]);

  const nudge = useCallback((id: string, e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 12;
    const v = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, [number, number]>)[e.key];
    if (!v) return;
    e.preventDefault();
    const p = live.current[id];
    live.current = { ...live.current, [id]: [p[0] + v[0], p[1] + v[1] / geo.current.stretch(id), p[2], p[3]] };
    if (kindOf(id) === 'ball') rollBall(v[0], v[1]);
    if (kindOf(id) === 'sketch') rollPencilOff();
    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Tidy the desk: everything slides home, the case closes, the pencil goes back on the sketch */
  const reset = useCallback(() => {
    Object.keys(frames.current).forEach((k) => cancelAnimationFrame(frames.current[k]));
    frames.current = {};
    pencilOn.current = true;
    ball.current = BALL_REST;
    paintBall();
    spin.current = {};
    ['cd'].forEach(paintSpin);
    setTaps({});
    setZ({});
    settle(Object.fromEntries(Object.keys(START).map((id) => [id, START[id]])), 520);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** a [[link]] in the note points at a thing: the line starts under the link */
  const linkOn = useCallback((key: string, to: string, e: React.SyntheticEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const R = el.getBoundingClientRect();
    const k = scale();
    setLink({ key, to, x1: Math.round((r.left + r.width / 2 - R.left) / k), y1: Math.round((r.bottom - R.top) / k) });
  }, [root, scale]);
  const linkOff = useCallback(() => setLink(null), []);

  useEffect(() => () => {
    Object.keys(frames.current).forEach((k) => cancelAnimationFrame(frames.current[k]));
    window.clearTimeout(noteTimer.current);
  }, []);

  const placed = useMemo(() => {
    const out: Record<string, { left: number; top: number; turn: number; z: number }> = {};
    for (const id of Object.keys(pos)) {
      const p = pos[id];
      out[id] = { left: Math.round(p[0]), top: Math.round(p[1] * stretch(id)) + (!flat && isLower(id) ? lowerTop : 0), turn: p[2], z: z[id] || p[3] || 1 };
    }
    return out;
  }, [pos, z, stretch, lowerTop, flat]);

  /** the AirPods are out while the case has been opened an odd number of times */
  const podsOpen = (taps.pods || 0) % 2 === 1;

  return { placed, held, link, lowerTop, taps, podsOpen, grab, tap, nudge, reset, linkOn, linkOff, register, paintBall };
}
