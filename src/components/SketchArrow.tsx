import React from 'react';

// Hand-sketched carousel arrow — the hero intro arrows' vocabulary (wobbly
// cubic strokes, pathLength=1, drawn in via stroke-dashoffset on reveal).
// Shared by every scroll-snap row that pages with arrows; the owner passes its
// own BEM class so the draw-in timing lives with the row's styles.
const SketchArrow = ({ direction, className }: { direction: 'left' | 'right'; className: string }) => (
  <svg
    className={className}
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    {direction === 'right' ? (
      <>
        <path d="M6 23 C 14 19, 26 19, 37 22" fill="none" strokeLinecap="round" pathLength={1} />
        <path d="M37 22 L29.5 15.5 M37 22 L30.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
      </>
    ) : (
      <>
        <path d="M38 23 C 30 19, 18 19, 7 22" fill="none" strokeLinecap="round" pathLength={1} />
        <path d="M7 22 L14.5 15.5 M7 22 L13.5 28.5" fill="none" strokeLinecap="round" pathLength={1} />
      </>
    )}
  </svg>
);

export default SketchArrow;
