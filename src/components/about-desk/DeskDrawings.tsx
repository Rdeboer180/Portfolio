// The desk drawings that have moving parts, drawn in React so the desk's
// physics can reach inside them: the Dragon Ball's stars turn as it rolls, the
// AirPods case opens on its seam, the trackpad answers a fingertip, and the
// notebook turns its pages. The still drawings stay SVG files.
import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Trackpad } from '../../assets/desk/objects/trackpad.svg';
import { ReactComponent as NotebookOpen } from '../../assets/desk/objects/notebook-open.svg';
import { NOTES_BY_DATE } from '../../data/notes';
import { FB_BACK_SEAM, FB_FRONT_SEAM, FB_LACES, FB_MARK, FB_NAVY, FB_OUTLINE, FB_STITCHES } from './footballArt';
// ── the Dragon Ball ─────────────────────────────────────────────────────────
// A 76 mm sphere of orange glass with four red stars set inside it, seen from
// above in the room's window light (upper left). Drawn from the close-ups in
// Battle of Gods (2013): the light that gets through the glass gathers on the
// far side, so the lower right is the brightest part of the ball; the rim is
// deeper where you look through the most glass; the stars are soft and a
// little orange because they are inside it.
//
// As it turns: everything inside the glass turns with it (the stars, a few
// specks of air), and the stars catch the window as they tip toward it. The
// glare on the surface belongs to the window, as on every real ball we studied
// (a billiard ball, cast and hand-made crystal replicas): it is never carried
// round with the turn. But a cast ball is not a perfect sphere, so the glare
// swims a little as the surface passes under it, is dragged along by the turn
// while the ball moves, stretched in that direction, and slides back to the
// window as the ball comes to rest.
const STAR = 'M0 -9l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7z';
const R = 59.5;
/** the four-star layout as it looks at rest (a square, turned a little): across the ball in radii, and how high in the glass (1 = its top) */
const STARS: [number, number, number][] = [[-0.213, -0.282, 0.44], [0.282, -0.213, 0.48], [-0.282, 0.213, 0.5], [0.213, 0.282, 0.42]];
/** specks of air caught in the glass when it was cast: across, height, radius in the drawing's units */
const BUBBLES: [number, number, number, number][] = [[0.06, -0.55, 0.28, 1.2], [-0.52, 0.02, 0.18, 0.8], [0.47, 0.36, 0.12, 1], [-0.08, 0.58, 0.3, 0.7], [0.58, -0.14, -0.1, 0.9], [0.1, 0.02, -0.35, 1.3]];
// The glass is a weak lens: something t radii above the centre looks LENS / (1 + (LENS - 1) t)
// times its size, so a star that rolls deeper into the ball looks larger, not smaller.
const LENS = 1.35;
const lens = (t: number) => LENS / (1 + (LENS - 1) * t);
/** each star and speck where it really is in the glass (the lens undone), at the size that looks right at rest */
const STAR_IN = STARS.map(([x, y, t]) => ({ p: [x / lens(t), y / lens(t), -t], k: 1.06 / lens(t) }));
const BUBBLE_IN = BUBBLES.map(([x, y, t, r]) => ({ p: [x / lens(t), y / lens(t), -t], r: r / lens(t) }));
/** half-way between the way to the window (up and to the upper left) and the way to the eye (straight up): a face turned this way throws the window back */
const HALF = (() => {
  const l = [-0.45, -0.55, -0.7], n = Math.hypot(l[0], l[1], l[2]);
  const h = [l[0] / n, l[1] / n, l[2] / n - 1], k = Math.hypot(h[0], h[1], h[2]);
  return h.map((v) => v / k);
})();
const n3 = (v: number) => v.toFixed(3);

/** the ball's turn: a rotation, row by row, from its own axes to the desk's (x right, y down, z down into the desk) */
export type BallTurn = number[];
export const BALL_REST: BallTurn = [1, 0, 0, 0, 1, 0, 0, 0, 1];
type Vec = { x: number; y: number };
const STILL: Vec = { x: 0, y: 0 };

/** roll dx, dy (px) without slipping: the ball turns distance / radius about the axis across its travel, and its top runs ahead */
export function rollTurn(m: BallTurn, dx: number, dy: number, radius: number): BallTurn {
  const d = Math.hypot(dx, dy);
  if (d < 1e-4) return m;
  const kx = dy / d, ky = -dx / d, th = d / radius;
  const c = Math.cos(th), s = Math.sin(th), t = 1 - c;
  const r = [t * kx * kx + c, t * kx * ky, s * ky, t * kx * ky, t * ky * ky + c, -s * kx, -s * ky, s * kx, c];
  const out = new Array(9).fill(0);
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) out[i * 3 + j] += r[i * 3 + k] * m[k * 3 + j];
  return out;
}

/** a point inside the glass for a turn of the ball: where it shows, how much the lens enlarges it, how high it now sits */
const inGlass = (m: BallTurn, p: number[]) => {
  const x = m[0] * p[0] + m[1] * p[1] + m[2] * p[2];
  const y = m[3] * p[0] + m[4] * p[1] + m[5] * p[2];
  const t = -(m[6] * p[0] + m[7] * p[1] + m[8] * p[2]);
  const g = lens(t);
  return { x: 60 + x * g * R, y: 60 + y * g * R, g, t };
};

/** one star: a flat star, foreshortened as it tips, sized by the lens, dimmer the deeper it sits, bright as its face turns to the window */
const starAt = (m: BallTurn, i: number) => {
  const { p, k } = STAR_IN[i];
  const { x, y, g, t } = inGlass(m, p);
  const s = g * k;
  // the face that shows: the star's own up, turned with the ball (or its back, once it has tipped past edge-on)
  let nx = -m[2], ny = -m[5], nz = -m[8];
  if (nz > 0) { nx = -nx; ny = -ny; nz = -nz; }
  const lit = Math.min(1, Math.max(0, (nx * HALF[0] + ny * HALF[1] + nz * HALF[2] - 0.9) / 0.06));
  return {
    transform: `matrix(${n3(m[0] * s)} ${n3(m[3] * s)} ${n3(m[1] * s)} ${n3(m[4] * s)} ${n3(x)} ${n3(y)})`,
    opacity: n3(Math.min(0.96, Math.max(0.35, 0.55 + 0.8 * t))),
    glint: n3(0.5 * lit * lit),
  };
};

const bubbleAt = (m: BallTurn, i: number) => {
  const { x, y, g, t } = inGlass(m, BUBBLE_IN[i].p);
  return { cx: n3(x), cy: n3(y), r: n3(BUBBLE_IN[i].r * g), opacity: n3(Math.min(0.9, Math.max(0.25, 0.55 + 0.6 * t))) };
};

/** how the window's glare sits on the ball's slightly uneven surface for a turn: offset (drawing units) and size */
const swimAt = (m: BallTurn) => {
  // where the glare falls on the ball's own surface, in the ball's own axes
  const lx = m[0] * HALF[0] + m[3] * HALF[1] + m[6] * HALF[2];
  const ly = m[1] * HALF[0] + m[4] * HALF[1] + m[7] * HALF[2];
  const lz = m[2] * HALF[0] + m[5] * HALF[1] + m[8] * HALF[2];
  return { x: 1.8 * Math.sin(2.3 * lx + 1.7 * lz + 0.4), y: 1.8 * Math.sin(2.9 * ly - 1.1 * lx + 1.2), k: 1 + 0.07 * Math.sin(3.3 * lz + 2.1 * ly) };
};
const SWIM_REST = swimAt(BALL_REST);
const WIN = { x: 38.5, y: 29 };

/** the glare for a turn of the ball and a drag (drawing units): where the surface's swim and the drag put it, stretched along the drag */
const glareAt = (m: BallTurn, drag: Vec) => {
  const w = swimAt(m);
  const ox = w.x - SWIM_REST.x + drag.x, oy = w.y - SWIM_REST.y + drag.y;
  const n = Math.hypot(drag.x, drag.y), a = (Math.atan2(drag.y, drag.x) * 180) / Math.PI, k = w.k / SWIM_REST.k;
  return {
    glare: `translate(${n3(WIN.x + ox)} ${n3(WIN.y + oy)}) rotate(${n3(a)}) scale(${n3(k * (1 + 0.036 * n))} ${n3(k * (1 - 0.015 * n))}) rotate(${n3(-a)}) translate(${-WIN.x} ${-WIN.y})`,
    sheen: `translate(${n3(ox * 0.5)} ${n3(oy * 0.5)})`,
  };
};

/** paint the ball for a turn (and, while it rolls, the glare's drag), straight on the drawing: the desk's drag and the click both write here */
export function paintStars(root: ParentNode, m: BallTurn, drag: Vec = STILL) {
  const part = (name: string) => root.querySelector<SVGElement>(`[data-part="${name}"]`);
  STAR_IN.forEach((_, i) => {
    const a = starAt(m, i);
    part(`star-${i}`)?.setAttribute('transform', a.transform);
    part(`star-${i}`)?.setAttribute('opacity', a.opacity);
    part(`glint-${i}`)?.setAttribute('opacity', a.glint);
  });
  BUBBLE_IN.forEach((_, i) => {
    const b = bubbleAt(m, i), el = part(`bubble-${i}`);
    if (!el) return;
    el.setAttribute('cx', b.cx);
    el.setAttribute('cy', b.cy);
    el.setAttribute('r', b.r);
    el.setAttribute('opacity', b.opacity);
  });
  const g = glareAt(m, drag);
  part('glare')?.setAttribute('transform', g.glare);
  part('sheen')?.setAttribute('transform', g.sheen);
}

export const DragonBall = React.memo<{ size: number }>(({ size }) => {
  const glare = glareAt(BALL_REST, STILL);
  return (
    <span className="db" style={{ width: size, height: size }}>
      {/* everything that travels when it rolls; nothing in here is set by React after the first render */}
      <span className="db__travel">
        {/* on the desk: a soft cast down and right, a tight dark line where it sits, and the light the glass focuses into its shadow */}
        <svg className="db__shadow" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <defs>
            <filter id="db-cast" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="db-sit" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3" /></filter>
            <filter id="db-focus" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>
          <circle cx="68.5" cy="73" r="56" fill="#3a2410" opacity=".32" filter="url(#db-cast)" />
          <circle cx="60.8" cy="61.6" r="59" fill="#2e2214" opacity=".42" filter="url(#db-sit)" />
          <path d="M114.6 91.5A63 63 0 0 1 79.5 119.9" fill="none" stroke="#ffb347" strokeWidth="5" strokeLinecap="round" opacity=".42" filter="url(#db-focus)" />
        </svg>
        {/* the summoning light outside the glass: a wide halo on the desk, a bright edge close to it (summonBall) */}
        <span className="db__halo" aria-hidden="true" />
        <span className="db__rim" aria-hidden="true" />
        <span className="db__ball">
          <svg className="s db__glass" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="db-body" cx=".63" cy=".69" r=".8"><stop offset="0" stopColor="#ffd66f" /><stop offset=".2" stopColor="#ffb83e" /><stop offset=".48" stopColor="#f9921d" /><stop offset=".76" stopColor="#ea700e" /><stop offset="1" stopColor="#cf560b" /></radialGradient>
              <radialGradient id="db-deep" cx=".5" cy=".5" r=".5"><stop offset=".6" stopColor="#e2650c" stopOpacity="0" /><stop offset=".9" stopColor="#c24a08" stopOpacity=".35" /><stop offset="1" stopColor="#8f3204" stopOpacity=".7" /></radialGradient>
              <radialGradient id="db-exit" cx=".5" cy=".5" r=".5"><stop offset=".8" stopColor="#ffe6a6" stopOpacity="0" /><stop offset=".92" stopColor="#ffe6a6" stopOpacity=".5" /><stop offset=".985" stopColor="#ffe6a6" stopOpacity="0" /></radialGradient>
              <linearGradient id="db-far" x1=".2" y1=".15" x2=".85" y2=".9"><stop offset=".45" stopColor="#000" /><stop offset="1" stopColor="#fff" /></linearGradient>
              <linearGradient id="db-star-glint" x1="0" y1="0" x2="1" y2="1"><stop offset=".08" stopColor="#fff8e6" stopOpacity="0" /><stop offset=".3" stopColor="#fff8e6" stopOpacity=".95" /><stop offset=".55" stopColor="#ffe2a0" stopOpacity=".25" /><stop offset=".75" stopColor="#ffd27a" stopOpacity="0" /></linearGradient>
              <mask id="db-far-side" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#db-far)" /></mask>
              <clipPath id="db-in"><circle cx="60" cy="60" r="58.5" /></clipPath>
              <filter id="db-inside" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".45" /></filter>
            </defs>
            <circle cx="60" cy="60" r={R} fill="url(#db-body)" />
            {/* inside the glass, placed by paintStars as the ball turns: specks of air, then the stars, each with the window caught on its face */}
            <g clipPath="url(#db-in)">
              <g fill="#fff4d6" fillOpacity=".55" stroke="#9c3a06" strokeOpacity=".3" strokeWidth=".35">
                {BUBBLES.map((_, i) => {
                  const b = bubbleAt(BALL_REST, i);
                  return <circle key={i} data-part={`bubble-${i}`} cx={b.cx} cy={b.cy} r={b.r} opacity={b.opacity} />;
                })}
              </g>
              <g fill="#c8361c" stroke="#c8361c" strokeWidth="1.1" strokeLinejoin="round" filter="url(#db-inside)">
                {STARS.map((_, i) => {
                  const a = starAt(BALL_REST, i);
                  return (
                    <g key={i} data-part={`star-${i}`} transform={a.transform} opacity={a.opacity}>
                      <path d={STAR} />
                      <path d={STAR} data-part={`glint-${i}`} fill="url(#db-star-glint)" stroke="none" opacity={a.glint} />
                    </g>
                  );
                })}
              </g>
            </g>
            {/* the edge, seen through the most glass; on the far side, the light leaving it */}
            <circle cx="60" cy="60" r={R} fill="url(#db-deep)" />
            <circle cx="60" cy="60" r={R} fill="url(#db-exit)" mask="url(#db-far-side)" />
          </svg>
          {/* the summoning light inside the glass (summonBall) */}
          <span className="db__core" aria-hidden="true" />
          <svg className="db__shine" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="db-sheen" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
              <radialGradient id="db-glint" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff2c4" stopOpacity=".62" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
              <filter id="db-soft-edge" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".3" /></filter>
            </defs>
            {/* a broad sheen on the lit side (it follows the glare at half the distance), a fine rim of light on its edge */}
            <g data-part="sheen" transform={glare.sheen}><ellipse cx="42" cy="37" rx="27" ry="18" fill="url(#db-sheen)" transform="rotate(-38 42 37)" /></g>
            <path d="M4.5 45.1A57.5 57.5 0 0 1 40.3 6" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.1" strokeLinecap="round" />
            {/* the window: two panes, bowed by the curve of the glass, drifting a little with the pointer as the room light does; the turn drags it (paintStars) */}
            <g className="glide" style={{ transform: 'translate(calc(var(--win-x, 0px) * .3), calc(var(--win-y, 0px) * .3))' }}>
              <g data-part="glare" transform={glare.glare}>
                <g transform={`translate(${WIN.x} ${WIN.y}) rotate(-36)`} fill="#fff" stroke="#fff" strokeWidth=".8" strokeLinejoin="round" filter="url(#db-soft-edge)">
                  <path d="M-6.2 -4.6Q-3.7 -5.3 -.7 -4.9L-.7 4.3Q-3.7 4.9 -6.4 4.1Q-7.2 0 -6.2 -4.6Z" fillOpacity=".94" strokeOpacity=".94" />
                  <path d="M.7 -4.9Q3.7 -5.3 6.2 -4.6Q7.2 0 6.4 4.1Q3.7 4.9 .7 4.3Z" fillOpacity=".86" strokeOpacity=".86" />
                </g>
              </g>
            </g>
            {/* and where the light comes back out, low on the far side */}
            <ellipse cx="85" cy="92" rx="8.5" ry="4" fill="url(#db-glint)" transform="rotate(-42 85 92)" />
          </svg>
        </span>
      </span>
    </span>
  );
});

// ── the click: a short roll, then the glass lights the way it does when the dragon is called
// The roll is a push: it travels PUSH px away from the pointer, slowing at a
// constant rate the way rolling friction slows a ball (distance 1 - (1 - t)²),
// turning distance / radius as it goes, then rocks back a hair and sits. The
// light is taken from the summonings (the 1986 first summoning, Battle of Gods,
// Kami restoring the balls) and from lit crystal replicas, which throb slowly
// and deeply: it starts inside, low in the glass, the stars go pale in it, a
// bright edge and a warm halo open on the desk, and it throbs, a quick rise and
// a slower fall about once every 1.3s (0.8 a second, far under the 3 a second
// flash limit), five times, then goes out.
interface BallState { turn: BallTurn; at: Vec; frame: number; timer: number; glow: Animation[] }
const balls = new WeakMap<Element, BallState>();
const PUSH = 44;
const REACH = 56;
const ROLL = 760;
const ROCK = [240, 220];
/** how long the turning surface carries the glare (ms of travel), and how quickly the glare slides back to the window */
const CARRY = 190;
const SLIP = 120;
const SWELL = 600;
const PULSE = 1300;
const PULSES = 4;
const FADE = 1100;
const GLOW = SWELL + PULSES * PULSE + FADE;
const TROUGH = 0.34;
const easeInOut = (x: number) => 0.5 - Math.cos(Math.PI * x) / 2;

/** the summoning's rhythm as a level (1 at a peak) at each offset, with the easing into the next: a swell, the throbs (quick up, slow down), out */
const RHYTHM: { offset: number; level: number; easing: string }[] = (() => {
  const at = (ms: number) => ms / GLOW;
  const out = [{ offset: 0, level: 0, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }];
  for (let i = 0; i < PULSES; i += 1) {
    const t = SWELL + i * PULSE;
    out.push({ offset: at(t), level: 1, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' });
    out.push({ offset: at(t + PULSE * 0.62), level: TROUGH, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' });
  }
  out.push({ offset: at(SWELL + PULSES * PULSE), level: 0.9, easing: 'cubic-bezier(0.4, 0, 0.7, 1)' });
  out.push({ offset: 1, level: 0, easing: 'linear' });
  return out;
})();
const throb = (frame: (level: number, i: number) => Keyframe) => RHYTHM.map(({ offset, level, easing }, i) => ({ ...frame(level, i), offset, easing }));

/** let any light still on go out quickly, from wherever it is */
const douse = (st: BallState) => {
  st.glow.forEach((a) => {
    const el = (a.effect as KeyframeEffect | null)?.target as HTMLElement | null;
    if (!el) { a.cancel(); return; }
    const cs = getComputedStyle(el);
    const from = { opacity: cs.opacity, transform: cs.transform === 'none' ? 'none' : cs.transform };
    a.cancel();
    const to = getComputedStyle(el);
    el.animate([from, { opacity: to.opacity, transform: to.transform }], { duration: 280, easing: 'ease-out' });
  });
  st.glow = [];
};

const light = (db: HTMLElement, st: BallState, reduced: boolean) => {
  const core = db.querySelector<HTMLElement>('.db__core');
  const halo = db.querySelector<HTMLElement>('.db__halo');
  const rim = db.querySelector<HTMLElement>('.db__rim');
  const shadow = db.querySelector<SVGElement>('.db__shadow');
  if (!core || !halo || !rim || !shadow) return;
  douse(st);
  if (reduced) {
    // reduced motion: no swell and no throb, a steady light that fades in, holds, and fades out
    const hold = (peak: number) => [{ opacity: 0 }, { opacity: peak, offset: 0.1 }, { opacity: peak, offset: 0.77 }, { opacity: 0 }];
    st.glow = [core.animate(hold(0.55), { duration: 3000, easing: 'ease-out' }), halo.animate(hold(0.5), { duration: 3000, easing: 'ease-out' }), rim.animate(hold(0.45), { duration: 3000, easing: 'ease-out' })];
    return;
  }
  st.glow = [
    // born small in the middle of the glass, then breathing between 92 and 100%
    core.animate(throb((l, i) => ({ opacity: 0.86 * l, transform: `scale(${i === 0 ? 0.5 : 0.9 + 0.1 * l})` })), { duration: GLOW }),
    // the light leaves the glass a moment later: the edge first, then the halo, which swells with each throb
    rim.animate(throb((l) => ({ opacity: 0.85 * l, transform: `scale(${0.97 + 0.05 * l})` })), { duration: GLOW, delay: 60 }),
    halo.animate(throb((l) => ({ opacity: 0.92 * l, transform: `scale(${0.86 + 0.2 * l})` })), { duration: GLOW, delay: 120 }),
    // and fills the ball's own shadow
    shadow.animate(throb((l) => ({ opacity: 1 - 0.55 * l })), { duration: GLOW }),
  ];
};

/**
 * A click on the Dragon Ball: a short roll away from the pointer (a key press
 * rolls it toward the page, then back home), then the light. Returns how long
 * until the ball is at rest and lit, in ms, for its note to follow.
 */
export function summonBall(root: HTMLElement, from: Vec | null, reduced: boolean): number {
  const db = root.querySelector<HTMLElement>('.db');
  const travel = db?.querySelector<HTMLElement>('.db__travel');
  const body = db?.querySelector<HTMLElement>('.db__ball');
  if (!db || !travel || !body) return 0;
  const st = balls.get(db) ?? { turn: BALL_REST, at: { x: 0, y: 0 }, frame: 0, timer: 0, glow: [] };
  balls.set(db, st);
  cancelAnimationFrame(st.frame);
  window.clearTimeout(st.timer);
  if (reduced) { light(db, st, true); return 0; }
  douse(st);

  // which way: away from the pointer; from a key, back toward home, or from home toward the page
  const r = db.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let u: Vec = { x: Math.abs(st.at.x) > 0.5 ? -Math.sign(st.at.x) : cx > window.innerWidth / 2 ? -1 : 1, y: 0 };
  if (from) {
    const x = cx - from.x, y = cy - from.y, n = Math.hypot(x, y);
    if (n > 2) u = { x: x / n, y: y / n };
  }
  // how far: a push, shortened to stay within REACH of home; pinned at the edge, it rolls back instead
  const a = st.at, au = a.x * u.x + a.y * u.y;
  let d = Math.min(PUSH, -au + Math.sqrt(Math.max(0, au * au - (a.x * a.x + a.y * a.y) + REACH * REACH)));
  if (d < 16) {
    const n = Math.hypot(a.x, a.y) || 1;
    u = { x: -a.x / n, y: -a.y / n };
    d = PUSH;
  }
  const back = Math.min(2.4, d * 0.055);
  const end = ROLL + ROCK[0] + ROCK[1];
  const along = (ms: number) => {
    if (ms < ROLL) return d * (1 - (1 - ms / ROLL) ** 2);
    if (ms < ROLL + ROCK[0]) return d - back * easeInOut((ms - ROLL) / ROCK[0]);
    if (ms < end) return d - back + back * 0.4 * easeInOut((ms - ROLL - ROCK[0]) / ROCK[1]);
    return d - back * 0.6;
  };
  const radius = db.offsetWidth / 2;
  const unit = db.offsetWidth / 120;
  const angle = Math.atan2(u.y, u.x);
  const a0 = { ...a };
  const t0 = performance.now();
  let done = 0;
  let last = t0;
  let drag = { ...STILL };
  const step = (now: number) => {
    const ms = Math.min(end, now - t0);
    const dt = Math.max(1, now - last);
    last = now;
    const s = along(ms);
    // the glare is carried by the turning surface (as far as CARRY ms of travel would take it) and slips back to the window
    const v = (s - done) / dt;
    const slip = 1 - Math.exp(-dt / SLIP);
    drag = { x: drag.x + ((u.x * v * CARRY) / unit - drag.x) * slip, y: drag.y + ((u.y * v * CARRY) / unit - drag.y) * slip };
    st.turn = rollTurn(st.turn, u.x * (s - done), u.y * (s - done), radius);
    done = s;
    paintStars(db, st.turn, drag);
    st.at = { x: a0.x + u.x * s, y: a0.y + u.y * s };
    travel.style.transform = `translate(${st.at.x.toFixed(2)}px, ${st.at.y.toFixed(2)}px)`;
    // the push: the glass gives a hair along the push for a moment, no more (it is hard)
    const q = ms < 140 ? Math.sin((Math.PI * ms) / 140) : 0;
    body.style.transform = q ? `rotate(${angle}rad) scale(${(1 - 0.014 * q).toFixed(4)}, ${(1 + 0.006 * q).toFixed(4)}) rotate(${-angle}rad)` : '';
    // keep going until the ball has sat and the glare is back at the window
    st.frame = ms < end || Math.hypot(drag.x, drag.y) > 0.02 ? requestAnimationFrame(step) : 0;
    if (!st.frame) paintStars(db, st.turn);
  };
  st.frame = requestAnimationFrame(step);
  // the light comes up as the ball slows to a stop
  st.timer = window.setTimeout(() => light(db, st, false), ROLL - 160);
  return ROLL + 60;
}

// ── the football ────────────────────────────────────────────────────────────
// The Notre Dame foam football, seen from above (footballArt.ts, from the SVG
// file), drawn in parts so it can roll like a football. Pushed, it rolls
// sideways about its long axis: the panel, seams, mark and laces turn over the
// top (pivoting on the tip that is in view, which stays put, as a tip on the
// axis does) and the laces' catch-lights go with them. Longer than it is round,
// it does not run straight: it yaws toward the end that was pushed, rocks end
// over end on its belly as it settles, and wobbles a little side to side. The
// light on the body stays where it is; the foam's satin sheen is dragged by the
// turn and slides back, as the Dragon Ball's glare does. Its shadow yaws with
// it but does not rock.
const FB_MID = { x: 257, y: 264 };
const FB_TIPS = [{ x: 60.3, y: 191.4 }, { x: 453.8, y: 337.3 }];
const FB_HALF = 210;
const FB_AXIS = { x: Math.cos((20.3 * Math.PI) / 180), y: Math.sin((20.3 * Math.PI) / 180) };
const FB_ACROSS = { x: -FB_AXIS.y, y: FB_AXIS.x };
const FB_SHEEN = { x: 176, y: 196 };

export const Football = React.memo<{ width: number; height: number }>(({ width, height }) => (
  <span className="fb" style={{ width, height }}>
    <span className="fb__travel">
      <svg className="s" viewBox="0 0 512 512" style={{ width, height }} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="fb-gold" cx=".3" cy=".22" r=".86"><stop stopColor="#fae4aa" /><stop offset=".4" stopColor="#d2b777" /><stop offset=".76" stopColor="#a27e3e" /><stop offset="1" stopColor="#624821" /></radialGradient>
          <radialGradient id="fb-navy" cx=".28" cy=".16" r=".95"><stop stopColor="#54748d" /><stop offset=".35" stopColor="#294b68" /><stop offset=".7" stopColor="#162f4b" /><stop offset="1" stopColor="#07172b" /></radialGradient>
          <radialGradient id="fb-shadow"><stop stopColor="#142332" stopOpacity=".36" /><stop offset=".5" stopColor="#142332" stopOpacity=".17" /><stop offset="1" stopColor="#142332" stopOpacity="0" /></radialGradient>
          <linearGradient id="fb-lace" x1="0" x2=".2" y1="0" y2="1"><stop stopColor="#62849b" /><stop offset=".4" stopColor="#31536c" /><stop offset="1" stopColor="#0a1d30" /></linearGradient>
          <radialGradient id="fb-sheen"><stop stopColor="#fff" stopOpacity=".26" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <clipPath id="fb-clip"><path d={FB_OUTLINE} /></clipPath>
          <pattern id="fb-grain" width="5.5" height="5" patternTransform="matrix(1 .25 -.2 .9 0 0)" patternUnits="userSpaceOnUse">
            <ellipse cx="1.7" cy="2.5" fill="#000" opacity=".34" rx="1.7" ry="1.5" />
            <path fill="none" stroke="#fff" strokeWidth=".5" d="M.3 2.3q1.4-1.6 2.8 0" opacity=".4" />
          </pattern>
        </defs>
        <g fill="url(#fb-shadow)" transform="rotate(21 256 285)">
          <ellipse cx="256" cy="289" rx="223" ry="129" />
          <ellipse cx="256" cy="294" opacity=".6" rx="192" ry="105" />
        </g>
        {/* the ball: rocks end over end (rollFootball); the body and its light stay, the surface turns over it */}
        <g data-part="fb-ball" strokeLinecap="round" strokeLinejoin="round">
          <path d={FB_OUTLINE} fill="url(#fb-gold)" />
          <g clipPath="url(#fb-clip)">
            <g data-part="fb-surface">
              <path fill="url(#fb-navy)" d={FB_NAVY} />
              <path fill="url(#fb-grain)" d={FB_OUTLINE} opacity=".18" />
              <path fill="none" stroke="#0c2233" strokeWidth="4" d={FB_BACK_SEAM} />
              <path fill="none" stroke="#8aabb3" strokeOpacity=".38" strokeWidth=".9" d={FB_BACK_SEAM} />
              <path fill="none" stroke="#1b2b39" strokeWidth="2.3" d={FB_FRONT_SEAM} />
              <path fill="none" stroke="#efd28f" strokeOpacity=".7" strokeWidth=".9" d={FB_FRONT_SEAM} />
              <path fill="#fff6df" stroke="#b99b4c" strokeWidth="3.6" d={FB_MARK} paintOrder="stroke fill" />
              <path fill="url(#fb-grain)" d={FB_MARK} opacity=".16" />
              {FB_STITCHES.map(([stroke, w, d], i) => <path key={i} fill="none" stroke={stroke} strokeWidth={w} d={d} opacity=".7" />)}
              {FB_LACES.map(([shade, lace, light], i) => (
                <g key={`l${i}`}>
                  <path fill="#061323" d={shade} opacity=".75" />
                  <path fill="url(#fb-lace)" stroke="#153248" strokeWidth=".6" d={lace} />
                  <path fill="none" stroke="#8baab8" strokeOpacity=".55" strokeWidth=".85" d={light} />
                </g>
              ))}
            </g>
            <ellipse data-part="fb-sheen" cx={FB_SHEEN.x} cy={FB_SHEEN.y} rx="80" ry="34" fill="url(#fb-sheen)" transform={`rotate(20.3 ${FB_SHEEN.x} ${FB_SHEEN.y})`} />
          </g>
        </g>
      </svg>
    </span>
  </span>
));

interface FootballState { at: Vec; yaw: number; roll: number; pivot: number; frame: number }
const footballs = new WeakMap<Element, FootballState>();
const FB_PUSH = 24;
const FB_REACH = 36;
const FB_ROLL = 700;
const FB_SETTLE = 1300;
/** how much of the travel the visible top of the ball turns through (its top runs ahead of its middle) */
const FB_TOP = 0.62;

/**
 * A click on the football: it rolls a little across its length, away from the
 * pointer (a key press rolls it toward you, then back), yawing toward the end
 * that was pushed, rocking end over end and wobbling as it settles. Returns how
 * long until it has rolled, in ms, for its note to follow.
 */
export function rollFootball(root: HTMLElement, from: Vec | null, reduced: boolean): number {
  const fb = root.querySelector<HTMLElement>('.fb');
  const travel = fb?.querySelector<HTMLElement>('.fb__travel');
  const ball = fb?.querySelector<SVGGElement>('[data-part="fb-ball"]');
  const surface = fb?.querySelector<SVGGElement>('[data-part="fb-surface"]');
  const sheen = fb?.querySelector<SVGElement>('[data-part="fb-sheen"]');
  if (!fb || !travel || !ball || !surface || !sheen || reduced) return 0;
  const unit = fb.offsetWidth / 512;
  const box = fb.getBoundingClientRect();
  const st = footballs.get(fb) ?? {
    at: { x: 0, y: 0 }, yaw: 0, roll: 0, frame: 0,
    // the surface turns about the tip that is in view; the other one is off the window's edge, if either is
    pivot: box.left + FB_TIPS[0].x * unit >= 0 && box.left + FB_TIPS[0].x * unit <= window.innerWidth ? 0 : 1,
  };
  footballs.set(fb, st);
  cancelAnimationFrame(st.frame);

  // which way: across its length, away from the pointer; and how far along its length it was pushed
  const mid = { x: box.left + st.at.x + FB_MID.x * unit, y: box.top + st.at.y + FB_MID.y * unit };
  const offset = st.at.x * FB_ACROSS.x + st.at.y * FB_ACROSS.y;
  let side = offset > 1 ? -1 : 1;
  let lever = 0;
  if (from) {
    const across = (mid.x - from.x) * FB_ACROSS.x + (mid.y - from.y) * FB_ACROSS.y;
    if (Math.abs(across) > 1) side = Math.sign(across);
    lever = Math.max(-1, Math.min(1, ((from.x - mid.x) * FB_AXIS.x + (from.y - mid.y) * FB_AXIS.y) / (FB_HALF * unit)));
  }
  // how far: a push, shortened to stay within FB_REACH of home; pinned at the edge, it rolls back
  let d = Math.min(FB_PUSH, FB_REACH - side * offset);
  if (d < 8) { side = -side; d = FB_PUSH; }
  const dir = { x: FB_ACROSS.x * side, y: FB_ACROSS.y * side };
  // a push off the middle turns it: the far end swings (torque = lever × push), at most 6°
  const yawBy = lever * side * 6;
  const pivot = FB_TIPS[st.pivot];
  // the pivot is the right tip: turning the same way about it moves the middle the other way
  const turnSign = st.pivot === 0 ? 1 : -1;
  const a0 = { ...st.at }, yaw0 = st.yaw, roll0 = st.roll;
  const t0 = performance.now();
  let last = t0, done = 0;
  let drag = { x: 0, y: 0 };
  const step = (now: number) => {
    const ms = now - t0;
    const dt = Math.max(1, now - last);
    last = now;
    const p = Math.min(1, ms / FB_ROLL);
    const s = d * (1 - (1 - p) ** 2);
    const v = (s - done) / dt;
    done = s;
    st.at = { x: a0.x + dir.x * s, y: a0.y + dir.y * s };
    // end over end: the ends seesaw on its round belly, dying away; side to side: a smaller, slower wobble
    const rock = side * 2.6 * Math.exp(-ms / 360) * Math.sin((2 * Math.PI * ms) / 430);
    const wobble = 1.4 * Math.exp(-ms / 420) * Math.sin((2 * Math.PI * ms) / 520);
    st.yaw = yaw0 + yawBy * (1 - (1 - p) ** 2);
    travel.style.transform = `translate(${st.at.x.toFixed(2)}px, ${st.at.y.toFixed(2)}px) rotate(${(st.yaw + wobble).toFixed(3)}deg)`;
    // foam gives a little where it was pushed, for a moment
    const q = ms < 160 ? Math.sin((Math.PI * ms) / 160) : 0;
    const ang = (Math.atan2(dir.y, dir.x) * 180) / Math.PI;
    ball.setAttribute('transform', `translate(${FB_MID.x} ${FB_MID.y}) rotate(${n3(rock)}) rotate(${n3(ang)}) scale(${n3(1 - 0.022 * q)} ${n3(1 + 0.01 * q)}) rotate(${n3(-ang)}) translate(${-FB_MID.x} ${-FB_MID.y})`);
    // the surface turns over the top: its middle moves FB_TOP of the travel, its tip in view stays
    st.roll = roll0 + (side * FB_TOP * s) / unit;
    surface.setAttribute('transform', `rotate(${n3(((turnSign * st.roll) / FB_HALF) * (180 / Math.PI))} ${pivot.x} ${pivot.y})`);
    // the sheen is carried by the turning surface and slips back
    const slip = 1 - Math.exp(-dt / SLIP);
    drag = { x: drag.x + ((dir.x * v * CARRY) / unit - drag.x) * slip, y: drag.y + ((dir.y * v * CARRY) / unit - drag.y) * slip };
    const n = Math.hypot(drag.x, drag.y), da = (Math.atan2(drag.y, drag.x) * 180) / Math.PI;
    sheen.setAttribute('transform', `translate(${n3(FB_SHEEN.x + drag.x)} ${n3(FB_SHEEN.y + drag.y)}) rotate(${n3(da)}) scale(${n3(1 + 0.03 * n)} 1) rotate(${n3(20.3 - da)}) translate(${-FB_SHEEN.x} ${-FB_SHEEN.y})`);
    st.frame = ms < FB_SETTLE || n > 0.05 ? requestAnimationFrame(step) : 0;
  };
  st.frame = requestAnimationFrame(step);
  return FB_ROLL - 140;
}

// ── the AirPods case ────────────────────────────────────────────────────────
// AirPods Pro (2nd generation), front on, at real size: 60.6 × 45.2 mm. Redrawn
// 29 Oct: a squircle shell, the lid's seam with its lip, the side lanyard loop,
// the status light. The single-bud silhouette and the open-case composition
// follow the Solar icon set by 480 Design (CC BY 4.0,
// https://www.figma.com/community/file/1166831539721848736); the drawing,
// shading and proportions here are this site's own, at true size.
//
// Opening is three beats, the way the real thing goes: the lid swings up on its
// hinge and the status light comes on; both buds rise straight out of their
// wells; then each tumbles over the rim, arcs onto the desk, turns over once
// and lands with a small bounce. They stay out: the case opens once.
const SHELL = 'M26 1H78C96 1 103 8 103 26V54C103 72 96 79 78 79H26C8 79 1 72 1 54V26C1 8 8 1 26 1Z';
const LID = 'M26 1H78C96 1 103 8 103 26V28H1V26C1 8 8 1 26 1Z';

/** one AirPod Pro, standing up: the bud, its silicone tip, the stem (69 × 98 px, 21.8 × 30.9 mm) */
const ProBud: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg viewBox="0 0 69 98" width="69" height="98" aria-hidden="true" focusable="false" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <defs>
      <radialGradient id="pb-head" cx=".42" cy=".34" r=".72"><stop offset="0" stopColor="#ffffff" /><stop offset=".62" stopColor="#f2f2f2" /><stop offset="1" stopColor="#d6d6d6" /></radialGradient>
      <linearGradient id="pb-stem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#dcdcdc" /><stop offset=".35" stopColor="#fbfbfb" /><stop offset="1" stopColor="#d2d2d2" /></linearGradient>
      <radialGradient id="pb-tip" cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#f4f4f4" /><stop offset="1" stopColor="#c9c9c9" /></radialGradient>
    </defs>
    {/* stem, short and flat-ended, with the force sensor and the mic at its foot */}
    <rect x="30" y="34" width="20" height="60" rx="10" fill="url(#pb-stem)" />
    <rect x="35" y="56" width="4" height="16" rx="2" fill="#000" fillOpacity=".08" />
    <rect x="34" y="88" width="12" height="4" rx="2" fill="#2b2b2b" fillOpacity=".55" />
    {/* the bud */}
    <path d="M40 4C56 4 66 15 66 29C66 42 57 50 44 50C30 50 22 43 22 30C22 15 28 4 40 4Z" fill="url(#pb-head)" />
    {/* silicone ear tip, angled out */}
    <ellipse cx="17" cy="27" rx="13" ry="15" fill="url(#pb-tip)" />
    <ellipse cx="15" cy="27" rx="6" ry="8" fill="#8a8a8a" fillOpacity=".5" />
    {/* the vent and a highlight */}
    <circle cx="51" cy="14" r="2.6" fill="#2b2b2b" fillOpacity=".55" />
    <path d="M36 10C44 8 54 10 58 17" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".9" />
    <path d="M40 4C56 4 66 15 66 29C66 42 57 50 44 50C30 50 22 43 22 30C22 15 28 4 40 4Z" fill="none" stroke="#000" strokeOpacity=".08" />
  </svg>
);

/** where each bud stands in the case, and where it lands on the desk, in px from the case's top left */
const BUDS = [
  // standing: each bud's head centred on its well (the case is 196px wide, 1.885px a unit)
  { stand: { x: 24, y: 18 }, land: { x: -58, y: 136, turn: -158 } },
  { stand: { x: 103, y: 18 }, land: { x: 96, y: 150, turn: 148 } },
];

export const AirPodsCase: React.FC<{ width: number; height: number; open: boolean }> = ({ width, height, open }) => {
  const box = useRef<HTMLDivElement>(null);
  // The buds come out once and stay out: the animation runs a single time, the
  // first time the case is opened, and nothing ever plays it in reverse. (An
  // earlier version also ran a close animation, which React's double-run of
  // effects in development set off on page load: buds flew in, then out again.)
  const played = useRef(false);
  useEffect(() => {
    const root = box.current;
    if (!root || !open || played.current) return;
    played.current = true;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // two layers per bud: the outer one falls in screen space (gravity is always down),
    // the inner one drifts sideways and turns over. Rotating the outer would turn "down" with it.
    Array.from(root.querySelectorAll<HTMLElement>('.pods__pro-bud')).forEach((fall, i) => {
      const tumble = fall.querySelector<HTMLElement>('.pods__pro-bud-y');
      const b = BUDS[i].land;
      const rest = () => {
        // settle: the landed place becomes the bud's own style, no animation left holding it
        fall.style.transform = `translateY(${b.y}px)`;
        fall.style.zIndex = '6';
        if (tumble) tumble.style.transform = `translateX(${b.x}px) rotate(${b.turn}deg)`;
        fall.getAnimations().forEach((a) => a.cancel());
        tumble?.getAnimations().forEach((a) => a.cancel());
      };
      if (rm || !tumble) { rest(); return; }
      const T = 1100;
      const d = 300 + i * 120;
      // up and down, with gravity: rise out of the well (still behind the shell), clear the rim
      // (now in front of it), hop to an apex, fall, one small bounce
      const fallAnim = fall.animate([
        { transform: 'translateY(0px)', zIndex: 2, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
        { transform: 'translateY(-52px)', zIndex: 2, offset: 0.265, easing: 'linear' },
        { transform: 'translateY(-53px)', zIndex: 6, offset: 0.27, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
        { transform: 'translateY(-94px)', zIndex: 6, offset: 0.47, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' },
        { transform: `translateY(${b.y}px)`, zIndex: 6, offset: 0.82, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
        { transform: `translateY(${b.y - 12}px)`, zIndex: 6, offset: 0.91, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' },
        { transform: `translateY(${b.y}px)`, zIndex: 6 },
      ], { duration: T, delay: d, fill: 'both' });
      // across and over: begins as it clears the rim
      tumble.animate([
        { transform: 'translateX(0px) rotate(0deg)', easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' },
        { transform: `translateX(${b.x}px) rotate(${b.turn}deg)`, offset: 0.75, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
        { transform: `translateX(${b.x * 1.02}px) rotate(${b.turn + 7}deg)`, offset: 0.87 },
        { transform: `translateX(${b.x}px) rotate(${b.turn}deg)` },
      ], { duration: T * 0.73, delay: d + T * 0.27, fill: 'both' });
      fallAnim.finished.then(rest).catch(() => {});
    });
  }, [open]);
  return (
    <div className={`pods${open ? ' is-open' : ''}`} ref={box} style={{ width, height }}>
      {/* the inside of the case, shown once the lid is up: the deck and its two wells */}
      <svg className="pods__inside" viewBox="0 0 104 80" aria-hidden="true" focusable="false">
        <path d="M8 30C8 20 14 13 30 13H74C90 13 96 20 96 30Z" fill="#e3e3e3" />
        <ellipse cx="34" cy="24" rx="14" ry="6.5" fill="#2e2f32" />
        <ellipse cx="70" cy="24" rx="14" ry="6.5" fill="#2e2f32" />
      </svg>
      {/* the buds stand in the wells behind the shell until they come out */}
      {BUDS.map((b, i) => (
        <span key={i} className="pods__pro-bud" style={{ left: b.stand.x, top: b.stand.y }}><span className="pods__pro-bud-y"><ProBud flip={i === 1} /></span></span>
      ))}
      {/* the shell: body, seam and lip, lanyard loop, status light */}
      <svg className="pods__shell" viewBox="0 0 104 80" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fdfdfd" /><stop offset=".6" stopColor="#f1f1f1" /><stop offset="1" stopColor="#dedede" /></linearGradient>
          <linearGradient id="pc-sides" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".1" /><stop offset=".16" stopColor="#000" stopOpacity="0" /><stop offset=".84" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".11" /></linearGradient>
          <radialGradient id="pc-led" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#b8f7cc" /><stop offset=".45" stopColor="#34d26c" /><stop offset="1" stopColor="#34d26c" stopOpacity="0" /></radialGradient>
          <clipPath id="pc-body-clip"><rect x="0" y="28" width="104" height="52" /></clipPath>
        </defs>
        <rect x="101.5" y="33" width="4" height="13" rx="2" fill="#cfcfcf" />
        <g clipPath="url(#pc-body-clip)">
          <path d={SHELL} fill="url(#pc-body)" />
          <path d={SHELL} fill="url(#pc-sides)" />
          <path d="M20 76.6Q52 79.4 84 76.6" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.2" />
          <path d={SHELL} fill="none" stroke="#000" strokeOpacity=".13" />
        </g>
        {/* the seam: a shadow line under the lid's lip, a catch-light below it */}
        <path d="M1.6 28.4H102.4" stroke="#000" strokeOpacity=".22" strokeWidth=".9" />
        <path d="M1.6 29.4H102.4" stroke="#fff" strokeOpacity=".95" strokeWidth=".9" />
        <circle className="pods__led-glow" cx="52" cy="45" r="5" fill="url(#pc-led)" />
        <circle className="pods__led" cx="52" cy="45" r="1.5" />
      </svg>
      {/* the lid: it swings up and over on its hinge, showing its inside */}
      <div className="pods__lid">
        <svg className="pods__lid-face" viewBox="0 0 104 28.6" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="pc-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fafafa" /><stop offset="1" stopColor="#f2f2f2" /></linearGradient>
          </defs>
          <path d={LID} fill="url(#pc-lid)" />
          <path d={LID} fill="url(#pc-sides)" />
          <path d="M22 4.4Q52 2.2 82 4.4" fill="none" stroke="#fff" strokeWidth="1.6" />
          <path d={LID} fill="none" stroke="#000" strokeOpacity=".13" />
        </svg>
        <svg className="pods__lid-under" viewBox="0 0 104 28.6" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={LID} fill="#d9d9d9" />
          <ellipse cx="34" cy="14" rx="15" ry="7" fill="#c4c4c4" />
          <ellipse cx="70" cy="14" rx="15" ry="7" fill="#c4c4c4" />
        </svg>
      </div>
    </div>
  );
};

/** one AirPod Pro, seen from above: the bud, its tip and the stem */
export const Bud: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <svg className="s" viewBox="0 0 98 69" style={{ width, height }} aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="bud-head" cx=".42" cy=".38" r=".7"><stop offset="0" stopColor="#fff" /><stop offset=".7" stopColor="#f1f1f1" /><stop offset="1" stopColor="#d9d9d9" /></radialGradient>
      <linearGradient id="bud-stem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fdfdfd" /><stop offset="1" stopColor="#dcdcdc" /></linearGradient>
    </defs>
    <rect x="40" y="27" width="56" height="15" rx="7.5" fill="url(#bud-stem)" />
    <rect x="86" y="29" width="8" height="11" rx="4" fill="#c9c9c9" />
    <circle cx="30" cy="34" r="27" fill="url(#bud-head)" />
    <ellipse cx="16" cy="38" rx="11" ry="13" fill="#e4e4e4" />
    <ellipse cx="14" cy="38" rx="6" ry="8" fill="#9a9a9a" fillOpacity=".55" />
    <circle cx="38" cy="22" r="3.2" fill="#2b2b2b" fillOpacity=".55" />
    <circle cx="30" cy="34" r="26.5" fill="none" stroke="#000" strokeOpacity=".08" />
  </svg>
);

// ── the trackpad ────────────────────────────────────────────────────────────
// A fingertip glows on the glass under the pointer; a click is a force click,
// a ring that runs out from where you pressed.
export const TrackpadSurface: React.FC<{ width: number; height: number; taps: number }> = ({ width, height, taps }) => {
  const box = useRef<HTMLDivElement>(null);
  const at = useRef({ x: 0.5, y: 0.5 });
  const [rings, setRings] = useState<{ n: number; x: number; y: number }[]>([]);
  useEffect(() => {
    if (!taps) return undefined;
    const ring = { n: taps, x: at.current.x, y: at.current.y };
    setRings((r) => [...r.slice(-2), ring]);
    const t = window.setTimeout(() => setRings((r) => r.filter((q) => q.n !== ring.n)), 420);
    return () => window.clearTimeout(t);
  }, [taps]);
  const track = (e: React.PointerEvent) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    at.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    el.style.setProperty('--fx', `${(at.current.x * 100).toFixed(1)}%`);
    el.style.setProperty('--fy', `${(at.current.y * 100).toFixed(1)}%`);
  };
  return (
    <div className="pad" ref={box} onPointerMove={track} style={{ width, height }}>
      <Trackpad className="s" style={{ width, height }} aria-hidden="true" focusable="false" />
      <span className="pad__finger" aria-hidden="true" />
      {rings.map((r) => <span key={r.n} className="pad__ring" style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }} aria-hidden="true" />)}
    </div>
  );
};

// ── the notebook ────────────────────────────────────────────────────────────
// Every click turns a leaf from right to left on the spine. The first spread is
// the notebook's own front: my newest notes on the left, the graph of this page
// on the right. After it come my notes, newest first, five a page. All of it
// is set in HTML on the drawing's paper, on its ruled lines, and every title
// is held to two lines, so nothing runs off a page.
const PER_PAGE = 5;
const PAGES = Math.ceil(NOTES_BY_DATE.length / PER_PAGE);
const SPREADS = 1 + Math.ceil(PAGES / 2);
const SCALE = 984 / 1120;
const PAGE = { top: 26 * SCALE, width: 530 * SCALE, height: 726 * SCALE, left: 22 * SCALE, right: 568 * SCALE };
type PageKey = 'intro' | 'graph' | number;

// the graph of this page: what the note links to, re-laid inside the page
const NODES: [label: string, x: number, y: number][] = [
  ['Kendall', 78, 128], ['Round 2', 172, 58], ['7 cards', 64, 40], ['Tire Rack', 284, 74], ['AEM', 350, 30],
  ['WheelRack', 334, 170], ['PlayDraft', 326, 282], ['LoopStack', 252, 356], ['skill tree', 140, 356], ['notes', 68, 290], ['Gremlins', 54, 208],
];
const HUB = { x: 200, y: 212 };
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 2], [3, 4], [3, 5], [6, 7], [8, 9], [10, 0]];
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = (x1 + x2) / 2 + (y2 - y1) * 0.14, cy = (y1 + y2) / 2 - (x2 - x1) * 0.14;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
};
const GRAPH_PATHS = [
  ...NODES.filter((_, i) => ![2, 4].includes(i)).map(([, x, y]) => curve(HUB.x, HUB.y, x, y)),
  ...EDGES.map(([a, b]) => curve(NODES[a][1], NODES[a][2], NODES[b][1], NODES[b][2])),
];

const Graph: React.FC = () => (
  <svg className="book__graph" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
    <g fill="none" stroke="#5a5d63" strokeWidth="1.4" strokeLinecap="round" opacity=".85">{GRAPH_PATHS.map((d) => <path key={d} d={d} />)}</g>
    <g fill="none" stroke="#7b7e85" strokeWidth=".8" strokeLinecap="round" opacity=".4" transform="translate(1.5 1)">{GRAPH_PATHS.map((d) => <path key={d} d={d} />)}</g>
    <circle cx={HUB.x} cy={HUB.y} r="13" fill="#c23001" stroke="#8a2200" />
    <text x={HUB.x} y={HUB.y + 34} textAnchor="middle" className="book__graph-hub">about</text>
    {NODES.map(([label, x, y]) => (
      <g key={label}>
        <circle cx={x} cy={y} r="7" fill="#f7f4ea" stroke="#5a5d63" strokeWidth="1.5" />
        <text x={x} y={y + 24} textAnchor="middle">{label}</text>
      </g>
    ))}
  </svg>
);

const NotesPage: React.FC<{ page: PageKey }> = ({ page }) => {
  if (page === 'intro') {
    return (
      <div className="book__page">
        <span className="book__folio">The notebook</span>
        <h4 className="book__title">Notes</h4>
        <p className="book__dek">Decisions, mistakes and open questions, as they happen.</p>
        <ol>
          {NOTES_BY_DATE.slice(0, 3).map((note) => (
            <li key={note.slug}><time>{note.date}</time><b>{note.title}</b></li>
          ))}
        </ol>
        <span className="book__more">Turn the page for all {NOTES_BY_DATE.length} →</span>
      </div>
    );
  }
  if (page === 'graph') {
    return (
      <div className="book__page">
        <span className="book__folio">Graph of about</span>
        <h4 className="book__title">Every link, by hand</h4>
        <Graph />
        <span className="book__more book__more--quiet">{NOTES_BY_DATE.length} notes. The rest is on the desk.</span>
      </div>
    );
  }
  const notes = NOTES_BY_DATE.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  return (
    <div className="book__page">
      <span className="book__folio">Notes · {page + 1} of {PAGES}</span>
      <ol>
        {notes.map((note) => (
          <li key={note.slug}><time>{note.date} · {note.read}</time><b>{note.title}</b></li>
        ))}
      </ol>
      {notes.length === 0 && <p className="book__dek">More soon.</p>}
    </div>
  );
};

/** a spread's two pages: the front, then notes pages 2s-2 and 2s-1 */
const pagesOf = (spread: number): [PageKey, PageKey] => (spread === 0 ? ['intro', 'graph'] : [2 * spread - 2, 2 * spread - 1]);

export const Notebook: React.FC<{ width: number; height: number; taps: number }> = ({ width, height, taps }) => {
  const spread = taps % SPREADS;
  const [shown, setShown] = useState(0);
  const [turning, setTurning] = useState<{ from: number; to: number } | null>(null);
  useEffect(() => {
    if (spread === shown) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(spread); return undefined; }
    setTurning({ from: shown, to: spread });
    const t = window.setTimeout(() => { setShown(spread); setTurning(null); }, 660);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spread]);
  const [l, r] = pagesOf(shown);
  const next = turning ? pagesOf(turning.to) : null;
  const k = width / 984;
  const box = (side: 'left' | 'right'): React.CSSProperties => ({ left: (side === 'left' ? PAGE.left : PAGE.right) * k, top: PAGE.top * k, width: PAGE.width * k, height: PAGE.height * k });
  return (
    <div className="book" style={{ width, height }}>
      <NotebookOpen className="s" style={{ width, height }} aria-hidden="true" focusable="false" />
      <div className="book__slot" style={box('left')}><NotesPage page={l} /></div>
      <div className="book__slot" style={box('right')}><NotesPage page={next ? next[1] : r} /></div>
      {turning && next && (
        <div className="book__leaf" style={box('right')}>
          <div className="book__leaf-front"><NotesPage page={r} /></div>
          <div className="book__leaf-back"><NotesPage page={next[0]} /></div>
        </div>
      )}
      <span className="book__hint" aria-hidden="true">{shown === 0 ? 'Click to turn the page' : `Spread ${shown + 1} of ${SPREADS}`}</span>
    </div>
  );
};
