// ============================================
// Talent tree: a node glyph, as React elements
// glyphs.ts holds each mark as inner SVG markup on a 24 grid. It is parsed
// into elements here rather than injected with dangerouslySetInnerHTML, so
// the prerendered markup and the client's first render are byte-for-byte the
// same tree (React does not reconcile injected HTML on hydration, and a
// serialised <path/> comes back as <path></path>). The markup is hand-authored
// and only ever holds path, rect, and circle elements with plain attributes.
// ============================================

import React from 'react';
import { glyph as glyphMarkup } from '../../data/talent/glyphs';

type Shape = { tag: 'path' | 'rect' | 'circle'; attrs: Record<string, string> };

const ELEMENT = /<(path|rect|circle)\b([^>]*?)\/?>/g;
const ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g;

const cache: Record<string, Shape[]> = {};

function parse(key: string): Shape[] {
  if (cache[key]) return cache[key];
  const out: Shape[] = [];
  const markup = glyphMarkup(key);
  let m: RegExpExecArray | null;
  ELEMENT.lastIndex = 0;
  while ((m = ELEMENT.exec(markup))) {
    const attrs: Record<string, string> = {};
    let a: RegExpExecArray | null;
    ATTR.lastIndex = 0;
    while ((a = ATTR.exec(m[2]))) attrs[a[1]] = a[2];
    out.push({ tag: m[1] as Shape['tag'], attrs });
  }
  cache[key] = out;
  return out;
}

interface GlyphProps {
  /** Key into GLYPHS (a node's `glyph`, a root's, or "branch"). */
  name: string;
  size?: number;
  className?: string;
}

/**
 * The renderer contract from glyphs.ts: a 24 viewBox, no fill, currentColor
 * stroke at 1.8 with round caps and joins. Decorative on every host, so it is
 * hidden from AT here once rather than at each call site.
 */
const Glyph: React.FC<GlyphProps> = ({ name, size = 22, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {parse(name).map((s, i) =>
      React.createElement(s.tag, { key: i, ...s.attrs }),
    )}
  </svg>
);

export default Glyph;
