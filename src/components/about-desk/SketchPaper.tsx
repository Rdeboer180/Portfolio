// SketchPaper: a crumpled sheet of concept sketches on the wood left of the cutting mat
// (Ryan, 12 Nov 2026). The scribbles are the install-day study from the prototyping
// playground: a car seen from above, the rears moving up, new tires on the rear, the
// stop getting shorter. The whole sheet is one link to the playground, for more of the work.
// It only shows when the left gutter has room for it; it never covers the mat.
import React from 'react';
import { Link } from 'react-router-dom';

export const SKETCH_MIN_GUTTER = 200;
export const PLAYGROUND_HREF = '/prototypingPlayground/';

// One pencil stroke, drawn twice a hair apart, the way a quick line doubles back on itself
const Scratch: React.FC<{ d: string; w?: number }> = ({ d, w = 1.6 }) => (
  <>
    <path d={d} strokeWidth={w} />
    <path d={d} strokeWidth={w * 0.55} transform="translate(0.8 0.6)" opacity="0.55" />
  </>
);

export const SketchPaper: React.FC<{ gutter: number }> = ({ gutter }) => {
  if (gutter < SKETCH_MIN_GUTTER) return null;
  const width = Math.min(300, gutter - 40);
  return (
    <Link
      to={PLAYGROUND_HREF}
      className="sketch-paper"
      style={{ width, right: `calc(100% + ${Math.max(16, Math.min(64, gutter - width - 12))}px)` }}
      aria-label="More of my work: the Prototyping Playground, with the install-day study these sketches are from"
    >
      <svg className="sketch-paper__sheet" viewBox="0 0 300 380" aria-hidden="true" focusable="false">
        <defs>
          {/* the crumple: a low noise lit from the top left, multiplied over the paper */}
          <filter id="sketch-crumple" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="3" seed="7" result="n" />
            <feDiffuseLighting in="n" surfaceScale="2.4" lightingColor="#fffdf7" result="lit">
              <feDistantLight azimuth="225" elevation="52" />
            </feDiffuseLighting>
            <feComposite in="lit" in2="SourceGraphic" operator="in" result="clip" />
            <feBlend in="SourceGraphic" in2="clip" mode="multiply" />
          </filter>
          <clipPath id="sketch-edge">
            <path d="M6 9 L72 4 L151 8 L229 3 L294 10 L297 92 L291 187 L296 281 L290 374 L208 369 L131 376 L57 370 L4 375 L9 281 L3 190 L8 96 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#sketch-edge)">
          <rect width="300" height="380" fill="#f8f4ea" filter="url(#sketch-crumple)" />
          {/* creases from being balled up and flattened again */}
          <g className="sketch-paper__creases">
            <path d="M0 132 L118 158 L300 118" />
            <path d="M162 0 L141 162 L176 380" />
            <path d="M0 268 L141 236 L300 292" />
            <path d="M58 0 L118 158" />
            <path d="M300 30 L176 236" />
          </g>
          <g className="sketch-paper__light">
            <path d="M0 132 L118 158 L162 0 L58 0 Z" />
            <path d="M141 236 L300 292 L300 380 L176 380 Z" />
          </g>
        </g>

        {/* the chicken scratch, in pencil */}
        <g className="sketch-paper__pencil">
          {/* a car from above, front at the top */}
          <Scratch d="M58 70 C58 52 72 46 88 46 C104 46 118 52 118 70 L118 156 C118 170 106 176 88 176 C70 176 58 170 58 156 Z" />
          <Scratch d="M66 92 C78 86 98 86 110 92 L106 108 C96 105 80 105 70 108 Z" w={1.1} />
          {/* tires: fronts struck out, rears with an arrow up, new ones filled on the rear */}
          <Scratch d="M47 74 h9 v24 h-9 Z" />
          <Scratch d="M120 74 h9 v24 h-9 Z" />
          <Scratch d="M43 72 L60 100 M116 72 L133 100" w={1.3} />
          <path d="M47 128 h9 v24 h-9 Z M120 128 h9 v24 h-9 Z" className="sketch-paper__fill" />
          <Scratch d="M38 150 C30 128 31 104 40 86 M35 92 L40 85 L45 92" w={1.3} />
          <Scratch d="M138 150 C146 128 145 104 136 86 M131 92 L136 85 L141 92" w={1.3} />

          {/* the stop, before and after: one long bar, one shorter */}
          <Scratch d="M150 74 h112" w={1.2} />
          <Scratch d="M150 96 h84" w={1.2} />
          <Scratch d="M150 70 v8 M262 70 v8 M150 92 v8 M234 92 v8" w={1} />
          <Scratch d="M238 96 C246 92 254 92 262 96" w={1} />

          {/* four little option boxes, one ticked */}
          <Scratch d="M150 126 h22 v20 h-22 Z M178 126 h22 v20 h-22 Z M206 126 h22 v20 h-22 Z M234 126 h22 v20 h-22 Z" w={1.1} />
          <Scratch d="M154 136 l5 6 l10 -13" w={1.6} />

          {/* a crossed-out idea and a circled one */}
          <Scratch d="M24 226 h104" w={1.2} />
          <Scratch d="M150 206 C150 192 274 190 276 208 C278 228 154 232 150 214" w={1.1} />
          {/* the arrow off the page, to the work */}
          <Scratch d="M34 318 C90 300 170 330 236 312 M224 304 L238 312 L226 322" w={1.7} />
        </g>
        <g className="sketch-paper__hand">
          <text x="58" y="34" transform="rotate(-3 58 34)">install day</text>
          <text x="150" y="60" className="sm">stop · wet 60</text>
          <text x="244" y="114" className="sm" transform="rotate(4 244 114)">−65 ft?</text>
          <text x="38" y="196" className="sm" transform="rotate(-2 38 196)">rears ↑ front, new on the rear</text>
          <text x="24" y="222" className="sm">just say “rotate”</text>
          <text x="156" y="216" className="sm" transform="rotate(-2 156 216)">4 colors, 1 meaning</text>
          <text x="24" y="262" className="sm" transform="rotate(-1 24 262)">simpler: one car, numbers in one place</text>
        </g>
        <text className="sketch-paper__go" x="30" y="352" transform="rotate(-3 30 352)">more of the work: the playground</text>
      </svg>
    </Link>
  );
};
