import React, { useId } from 'react';
import { glyph } from '../data/talent/glyphs';

// ============================================
// HoloSticker: one of the talent glyphs as a die-cut holographic sticker
// (trial, 11 November 2026). The same glyph markup is drawn six times, wide
// to narrow: a steel kiss-cut edge, the white die-cut that follows the shape
// (interiors filled), a narrow band of brand orange foil (metal: deep runs
// with short near-white glints), a
// second foil the hover crossfades to as if the light moved, a gloss from
// the upper left, then the ink line on top. The shadow falls down and right,
// from the same light. Decorative: give it a label only where it stands alone.
// ============================================

type Props = {
  name?: string;         // a key in GLYPHS
  markup?: string;       // or inner SVG markup on the same 24 grid (the exit arrow)
  size?: number;         // px, the sticker's box (the glyph sits inside its die-cut)
  label?: string;        // when set, the sticker is an image with this name
  className?: string;
  // stroke weights on the 24 grid; small stickers want a fatter die-cut and line to read
  weights?: { kiss?: number; cut?: number; foil?: number; ink?: number };
};

export default function HoloSticker({ name = 'branch', markup, size = 56, label, className, weights }: Props) {
  const { kiss = 7.9, cut = 7, foil = 3.4, ink = 1.8 } = weights ?? {};
  const id = useId().replace(/:/g, '');
  const g = markup ?? glyph(name);
  const layer = (stroke: string, width: number, extra: Record<string, string> = {}) => (
    <g stroke={stroke} strokeWidth={width} {...extra} dangerouslySetInnerHTML={{ __html: g }} />
  );
  return (
    <svg
      className={`holo-sticker${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="-5 -5 34 34"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b02c01" />
          <stop offset=".24" stopColor="#f03d01" />
          <stop offset=".36" stopColor="#f07654" />
          <stop offset=".42" stopColor="#fff4ee" />
          <stop offset=".48" stopColor="#f07654" />
          <stop offset=".66" stopColor="#c23001" />
          <stop offset=".86" stopColor="#f03d01" />
          <stop offset="1" stopColor="#b02c01" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c23001" />
          <stop offset=".3" stopColor="#f03d01" />
          <stop offset=".52" stopColor="#f07654" />
          <stop offset=".58" stopColor="#ffffff" />
          <stop offset=".64" stopColor="#f07654" />
          <stop offset="1" stopColor="#b02c01" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset=".18" stopColor="#fff" stopOpacity="0" />
          <stop offset=".34" stopColor="#fff" stopOpacity=".85" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {layer('var(--sticker-kiss-cut)', kiss, { fill: 'var(--sticker-kiss-cut)' })}
      {layer('var(--sticker-die-cut)', cut, { fill: 'var(--sticker-die-cut)' })}
      {layer(`url(#${id}a)`, foil)}
      {layer(`url(#${id}b)`, foil, { className: 'holo-sticker__foil-b' })}
      {layer(`url(#${id}g)`, foil)}
      {layer('#1b1b1b', ink)}
    </svg>
  );
}
