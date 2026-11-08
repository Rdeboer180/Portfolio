// ============================================
// SystemDoors — the How I work graphic (canvas "Graphic 6"): the four beats
// as a rail, with the PR review on beat 03, and under it three sizes of one
// system standing on one source. Sketch, playground and production each carry
// their own marker (dashed, outlined, filled), so the size reads before the
// label does.
//
// Motion is one sequence, played once when the graphic scrolls into view:
// the source draws, a riser climbs to each door, the doors settle, and the
// review lands under production. The default styles are the end frame. That
// is what the prerendered HTML, reduced motion, and a page loaded with the
// graphic already on screen get; only a graphic still below the fold is
// armed (set to the first frame) after mount and then played. The prerender
// strips `is-armed` and `is-visible` so the static file matches React's
// first render (see scripts/prerender.mjs).
// ============================================

import React, { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

export interface DoorBeat {
  n: number;
  title: string;
}

const SIZES = [
  { id: 'sketch', name: 'Sketch', who: 'anyone' },
  { id: 'playground', name: 'Playground', who: 'the team' },
  { id: 'production', name: 'Production', who: 'reviewed' },
] as const;

// Decorative thumbnails of what each size looks like; the labels carry the meaning.
const Picture: React.FC<{ size: (typeof SIZES)[number]['id'] }> = ({ size }) =>
  size === 'sketch' ? (
    <span className="sip-doors__pic sip-doors__pic--sketch" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  ) : (
    <span className={`sip-doors__pic sip-doors__pic--card sip-doors__pic--${size}`} aria-hidden="true">
      <span className="sip-doors__pic-media" />
      <span className="sip-doors__pic-lines">
        <span />
        <span />
        <span className="sip-doors__pic-action" />
      </span>
    </span>
  );

const SystemDoors: React.FC<{ beats: DoorBeat[] }> = ({ beats }) => {
  const [ref, visible] = useReveal<HTMLDivElement>(0.3);
  const [armed, setArmed] = useState(false);

  // Arm only a graphic that is still below the fold, so nothing on screen
  // ever jumps back to its first frame.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [ref]);

  const state = armed ? (visible ? ' is-visible' : ' is-armed') : '';

  return (
    <div className={`sip-doors${state}`} ref={ref}>
      <ol className="sip-doors__rail" aria-label="The loop, in four beats">
        {beats.map((beat) => (
          <li key={beat.n} className={`sip-doors__beat${beat.n === 3 ? ' sip-doors__beat--review' : ''}`}>
            <span className="sip-doors__beat-num">
              {beat.n === 3 ? '[ 03 ] PR review' : `[ 0${beat.n} ]`}
            </span>
            <span className="sip-doors__beat-title">{beat.title}</span>
          </li>
        ))}
      </ol>

      <div className="sip-doors__stage">
        <ol className="sip-doors__doors" aria-label="Three sizes of one system">
          {SIZES.map((size) => (
            <li key={size.id} className={`sip-doors__door sip-doors__door--${size.id}`}>
              <div className="sip-doors__card">
                <span className="sip-doors__label">
                  <span className="sip-doors__marker" aria-hidden="true" />
                  {`${size.name} · ${size.who}`}
                </span>
                <Picture size={size.id} />
              </div>
              {size.id === 'production' && (
                <p className="sip-doors__review">
                  <span className="sip-doors__review-tag">PR review · reuse first, nearest token</span>
                  <span className="sip-doors__review-line">The review suggests. A person decides.</span>
                </p>
              )}
              <span className="sip-doors__riser" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <p className="sip-doors__source">
          <strong>One source</strong>
          <span>DESIGN.md · tokens · components · catalog.json</span>
        </p>
      </div>
    </div>
  );
};

export default SystemDoors;
