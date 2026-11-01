import React, { useEffect, useRef, useState } from 'react';
import '../styles/components/_dismiss-strip.scss';

// The way back: Ryan's notched chevron pointing left to the page behind (25
// October, replacing the block arrow of 21 October), white with a 1px ink
// edge so it holds on both the homepage and the backdrop over it. Two 45°
// bars, mirror images about the middle: the upper one runs to the point and
// is cut square there, the lower one stops short of it, leaving the notch.
// Traced from his drawing at 96px (98% overlap) and set on a 57×94 box.
export const ReturnArrow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 57 94" aria-hidden="true" focusable="false">
    <path d="M2.25 47 L14 58.75 L55 17.75 V7.53 A5.5 5.5 0 0 0 45.61 3.64 Z M17.75 62.5 L29.5 50.75 L55 76.25 V86.47 A5.5 5.5 0 0 1 45.61 90.36 Z" />
  </svg>
);

// The exposed page beside an open slide-out, made an explicit exit: the
// homepage's case-study and notes drawer (ProjectPanel.tsx), and the about
// desk's notes and get-in-touch fly-out. `side` is the side the slide-out is
// on; the strip covers the rest of the window, `width` across from it (or
// --dismiss-width, as the drawer sets it), and the chevron points to it.
//
// On the homepage the dialog already closed on a click left of its bounds,
// but nothing said so, and keyboard and screen-reader users had no
// equivalent; the desk's scrim was the same. This is a real button covering
// the strip (CSS shows it only above 850px, where the strip is wide enough to
// aim at), plus a 32px custom cursor that follows the pointer while it is
// over the strip, after claire.io's case-study layer.
//
// It is its own component on purpose. Hover state changes on every strip
// entry; held in ProjectPanel, each change would re-render the reading
// Suspense boundary beside it, and an update that reaches a still-dehydrated
// boundary makes React 19 throw the prerendered article away. Here the
// re-renders stop at this subtree.
export default function DismissStrip({ label, open, onDismiss, side = 'right', width }: { label: string; open: boolean; onDismiss: () => void; side?: 'left' | 'right'; width?: string }) {
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
      className={`dismiss-strip${side === 'left' ? ' dismiss-strip--left' : ''}`}
      style={width ? ({ '--dismiss-width': width } as React.CSSProperties) : undefined}
      aria-label={label}
      data-cursor={showCursor ? 'return' : undefined}
      onClick={onDismiss}
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Keyboard focus parks the same mark in the strip, so a focused exit
          looks like the hovered one. */}
      <span className="dismiss-strip__mark" aria-hidden="true"><ReturnArrow /></span>
    </button>
    {showCursor && <span
      className={`dismiss-strip__cursor${side === 'left' ? ' dismiss-strip__cursor--left' : ''}`}
      aria-hidden="true"
      ref={el => { cursor.current = el; if (el) el.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0)`; }}
    ><ReturnArrow /></span>}
  </>;
}
