// How the desk's smaller things move when clicked, each by its own physics
// (plans/006-about-desk-motion.md; the Dragon Ball and the football have their
// own in DeskDrawings.tsx). Everything here moves by transform, opacity or
// filter, so it runs on the compositor, and each move picks up from where the
// thing is, so a second click never jumps it back to the start.

type Vec = { x: number; y: number };

/** slowing at a constant rate, as friction slows a thing: distance 1 - (1 - t)², exactly */
export const FRICTION = 'cubic-bezier(0.333, 0.667, 0.667, 1)';

/**
 * How bright a hexagonal pencil looks once it has rolled s px (radius r),
 * having rolled ds px in the last frame. Each facet flashes as it turns to the
 * light, six a turn; when they pass faster than a frame can hold, the flashes
 * blur together (a box average of the cosine over the frame: sin(w/2)/(w/2)).
 */
export const facetLight = (s: number, ds: number, r: number) => {
  const w = (6 * Math.abs(ds)) / r;
  const blur = w < 1e-3 ? 1 : Math.sin(w / 2) / (w / 2);
  return 1 + 0.2 * Math.cos((6 * s) / r) * blur;
};

/** the rotation a transform holds, in degrees */
const angleOf = (transform: string) => {
  if (!transform || transform === 'none') return 0;
  const m = transform.match(/matrix\(([^,]+),\s*([^,]+)/);
  return m ? (Math.atan2(parseFloat(m[2]), parseFloat(m[1])) * 180) / Math.PI : 0;
};

/**
 * The disc, spun flat on the desk: it turns at 1000°/s and slows at a constant
 * rate to a stop 900° on (1.8s). A second spin starts from wherever the first
 * has got to. The light on it stays put; only its label group turns.
 */
export function spinDisc(part: SVGElement) {
  const from = angleOf(getComputedStyle(part).transform);
  part.getAnimations().forEach((a) => a.cancel());
  const to = from + 900;
  const spin = part.animate([{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }], { duration: 1800, easing: FRICTION });
  spin.finished.then(() => { part.style.transform = `rotate(${to % 360}deg)`; spin.cancel(); }).catch(() => {});
}

/**
 * The pencil on the skill tree sketch, rolled off it: it rolls 215px across its own
 * length (it lies at -18°, so that is down and a little right), slowing at a
 * constant rate, its eraser end lagging so it swings 4°, and flashing over its
 * facets as it goes: fast and blurred at first, slower and distinct as it stops.
 * Sampled every frame, so the flashes are true to the distance rolled.
 */
export function rollPencilOff(pencil: HTMLElement) {
  const D = 215, R = 11, T = 760, N = Math.round(T / (1000 / 60));
  const dir = { x: 64 / D, y: 205 / D };
  const frames: Keyframe[] = [];
  let prev = 0;
  for (let i = 0; i <= N; i += 1) {
    const t = i / N, s = D * (1 - (1 - t) ** 2);
    frames.push({ transform: `translate(${(dir.x * s).toFixed(2)}px, ${(dir.y * s).toFixed(2)}px) rotate(${(-18 + (4 * s) / D).toFixed(3)}deg)`, filter: `brightness(${facetLight(s, s - prev, R).toFixed(3)})` });
    prev = s;
  }
  pencil.animate(frames, { duration: T, easing: 'linear', fill: 'forwards' });
}

const slid = new WeakMap<Element, { at: Vec; turn: number }>();

/**
 * A flat thing pushed across the desk. A finger pushes a flat thing along an
 * edge, so it goes along whichever axis the finger is furthest out on, and
 * turns by how far along that edge the finger was (a corner push turns it, a
 * push at the middle of the edge does not). Plastic and paper on wood are
 * high friction, so it stops quickly; a heavier thing gathers speed under the
 * finger before it goes (ramp). It stays where it stops, within reach px of
 * where it started; pinned at that edge, the next push sends it back.
 * Returns how long until it is still, in ms, for its note to follow.
 */
export function pushFlat(body: HTMLElement, from: Vec | null, { dist = 7, reach = 20, turn = 2, ms = 280, ramp = false } = {}) {
  const st = slid.get(body) ?? { at: { x: 0, y: 0 }, turn: 0 };
  const r = body.getBoundingClientRect();
  const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  let u: Vec = { x: 0, y: 1 };
  let lever = 0;
  if (from) {
    const x = c.x - from.x, y = c.y - from.y;
    u = Math.abs(x) > Math.abs(y) ? { x: Math.sign(x) || 1, y: 0 } : { x: 0, y: Math.sign(y) || 1 };
    // torque: how far along the pushed edge the finger is, against half that edge
    const half = u.x ? r.height / 2 : r.width / 2;
    lever = Math.max(-1, Math.min(1, ((from.x - c.x) * -u.y + (from.y - c.y) * u.x) / half));
  }
  // stay within reach; pinned at its edge, go back the whole push, never more
  let to = { x: st.at.x + u.x * dist, y: st.at.y + u.y * dist };
  const n = Math.hypot(to.x, to.y);
  if (n > reach) { const k = reach / n; to = { x: to.x * k, y: to.y * k }; }
  if (Math.hypot(to.x - st.at.x, to.y - st.at.y) < 1) {
    const m = Math.hypot(st.at.x, st.at.y) || 1;
    u = { x: -st.at.x / m, y: -st.at.y / m };
    to = { x: st.at.x + u.x * dist, y: st.at.y + u.y * dist };
  }
  const turnTo = Math.max(-4, Math.min(4, st.turn - lever * turn));
  const at = (k: number) => `translate(${(st.at.x + (to.x - st.at.x) * k).toFixed(2)}px, ${(st.at.y + (to.y - st.at.y) * k).toFixed(2)}px) rotate(${(st.turn + (turnTo - st.turn) * k).toFixed(2)}deg)`;
  slid.set(body, { at: to, turn: turnTo });
  body.getAnimations().forEach((x) => x.cancel());
  body.style.transform = at(1);
  body.animate(ramp
    ? [{ transform: at(0), easing: 'cubic-bezier(0.45, 0, 0.75, 0.6)' }, { transform: at(0.35), offset: 0.3, easing: FRICTION }, { transform: at(1) }]
    : [{ transform: at(0) }, { transform: at(1) }], { duration: ms, easing: ramp ? 'linear' : FRICTION });
  return ms + 120;
}

/**
 * Fabric pressed (the buff): it gives around the fingertip quickly and comes
 * back slowly, with no bounce, the way a rumpled cloth recovers.
 */
export function pressCloth(body: HTMLElement, from: Vec | null) {
  const r = body.getBoundingClientRect();
  const ox = from ? Math.max(0, Math.min(r.width, from.x - r.left)) : r.width / 2;
  const oy = from ? Math.max(0, Math.min(r.height, from.y - r.top)) : r.height / 2;
  body.style.transformOrigin = `${ox.toFixed(0)}px ${oy.toFixed(0)}px`;
  body.animate([
    { transform: 'scale(1)', easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
    { transform: 'scale(0.972)', offset: 0.2, easing: 'cubic-bezier(0.25, 0.6, 0.3, 1)' },
    { transform: 'scale(1)' },
  ], { duration: 520 });
}

/** Glass on a click switch (the trackpad): a short, firm press and a quick release */
export function pressGlass(body: HTMLElement) {
  body.animate([
    { transform: 'scale(1)', easing: 'cubic-bezier(0.3, 0, 0.6, 1)' },
    { transform: 'scale(0.988)', offset: 0.3, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
    { transform: 'scale(1)' },
  ], { duration: 220 });
}

/**
 * The iPod, pressed: the part under the finger gives (the button in
 * the middle, or the ring where it was pressed), the little aluminium body
 * dips, springs back and settles, and the mini's display catches a brief
 * backlight. A press straight down puts no
 * twist on it, so it does not turn. Reduced motion: nothing moves; the light
 * comes on once and fades. Returns how long until it has settled, in ms.
 */
export function pressShuffle(body: HTMLElement, reduced: boolean, from: Vec | null = null) {
  const press = body.querySelector<SVGCircleElement>('[data-part="ipod-press"]');
  const led = body.querySelector<SVGElement>('[data-part="ipod-led"]');
  const glow = body.querySelector<SVGElement>('[data-part="ipod-glow"]');
  const svg = press?.ownerSVGElement;
  // The click wheel declares its geometry so the same motion fits the mini.
  const centerX = Number(press?.dataset.centerX ?? 43.5);
  const centerY = Number(press?.dataset.centerY ?? 64);
  const radius = Number(press?.dataset.pressRadius ?? 12);
  const ringRadius = Number(press?.dataset.ringRadius ?? 33.5);
  if (reduced) {
    [led, glow].forEach((el) => el?.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 1100, easing: 'ease-out' }));
    return 0;
  }
  // where the finger went down, in the drawing's units: the button in the middle, or a spot on the ring
  if (press && svg && from) {
    const m = svg.getScreenCTM();
    const pt = m ? new DOMPoint(from.x, from.y).matrixTransform(m.inverse()) : null;
    const d = pt ? Math.hypot(pt.x - centerX, pt.y - centerY) : 0;
    if (pt && d > radius && d < ringRadius) { press.setAttribute('cx', pt.x.toFixed(1)); press.setAttribute('cy', pt.y.toFixed(1)); press.setAttribute('r', '8'); }
    else { press.setAttribute('cx', String(centerX)); press.setAttribute('cy', String(centerY)); press.setAttribute('r', String(radius)); }
  }
  press?.animate([{ opacity: 0 }, { opacity: 0.16, offset: 0.25 }, { opacity: 0 }], { duration: 240, easing: 'ease-out' });
  body.animate([
    { transform: 'none', easing: 'cubic-bezier(0.3, 0, 0.6, 1)' },
    { transform: 'translateY(1.2px) scale(0.982)', offset: 0.2, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
    { transform: 'translateY(-0.35px) scale(1.004)', offset: 0.55, easing: 'ease-in-out' },
    { transform: 'translateY(0.1px) scale(0.999)', offset: 0.8, easing: 'ease-in-out' },
    { transform: 'none' },
  ], { duration: 400 });
  [led, glow].forEach((el) => el?.animate([{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 480, delay: 120, easing: 'ease-out' }));
  return 480;
}
