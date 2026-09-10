// ============================================
// ProcessPrinciples — "How I work", drawn as a circuit
// The About page's version of the four-beat loop. Same beats and titles as
// the homepage rail under the How I work board (section 03); the mono triplets
// live only here now. Different form and depth. Form: a closed 2×2 circuit — 01 → 02 across the top,
// 02 ⇄ 03 down the right in Signal Orange (the one orange relation, the
// board's rule), 03 → 04 across the bottom, 04 → 01 back up the left under a
// RETURNS TO 01 tag — the return the rail cannot draw. Depth: a paragraph, the
// cost of skipping the beat, and one evidence link per beat.
//
// Semantics: one <ol> of four <li>. Wires, arrowheads, the tag and the hand
// mark are aria-hidden and hang off the card nearest each edge, so the list
// holds only items. Every relation is also stated in text (`__rel`) — screen-
// reader only where a wire draws it, visible under the card on the phone — so
// the loop never depends on a drawn line or a colour.
//
// Geometry is CSS: each wire is a box in the gap between two adjacent cards,
// sized from --gx / --gy, so there is no measuring pass. Wires draw once on
// reveal (useReveal); the SCSS renders the final state under
// prefers-reduced-motion. Layouts live in _process-principles.scss:
// 2×2 (≥1024) · 2×2 without the hand mark (768–1023) · stacked, with one
// rectangular wire around the stack (<768).
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { processBeats, processCloser } from '../data/about';
import { useReveal } from '../hooks/useReveal';

// Inline custom-property helpers: card stagger and wire stagger.
const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });
const w = (ms: number) => ({ ['--wire-delay' as string]: `${ms}ms` });

/** The board's open two-tick arrowhead. Drawn pointing right; rotated by class. */
const Head: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 10 10" focusable="false" aria-hidden="true">
    <path d="M2.5 1.5 6.5 5 2.5 8.5" />
  </svg>
);

/** Evidence-link glyph — the board's document icon, in the same hand. */
const DocIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5" />
  </svg>
);

// The wires and phone-only marks each cell hangs off its card. Indexed by beat
// number so the JSX below stays a single map.
//   01: 01 → 02 (right); the hand mark in the cross of the gaps; on the phone,
//       the arrowhead the return arrives on and the RETURNS TO 01 tag.
//   02: 02 ⇄ 03 (down, orange, two tracks); on the phone, the up-arrow on the
//       right-hand wire.
//   03: 03 → 04 (left); on the phone, the ⇄ glyph knocked out of the left wire.
//   04: 04 → 01 (up) with the RETURNS TO 01 tag; on the phone, the arrowhead on
//       the bottom wire.
const furniture: Record<string, React.ReactNode> = {
  '01': (
    <>
      <span className="process-principles__wire process-principles__wire--r" aria-hidden="true" style={w(0)}>
        <span className="process-principles__shaft" />
        <Head className="process-principles__head" />
      </span>
      <span className="process-principles__mark" aria-hidden="true">no finish line</span>
      <Head className="process-principles__ah process-principles__ah--in" />
      <span className="process-principles__ptag" aria-hidden="true">Returns to 01</span>
    </>
  ),
  '02': (
    <>
      <span
        className="process-principles__wire process-principles__wire--d process-principles__wire--pair"
        aria-hidden="true"
        style={w(200)}
      >
        <span className="process-principles__track process-principles__track--down">
          <span className="process-principles__shaft" />
          <Head className="process-principles__head process-principles__head--down" />
        </span>
        <span className="process-principles__track process-principles__track--up">
          <Head className="process-principles__head process-principles__head--up" />
          <span className="process-principles__shaft" />
        </span>
      </span>
      <Head className="process-principles__ah process-principles__ah--right" />
    </>
  ),
  '03': (
    <>
      <span className="process-principles__wire process-principles__wire--l" aria-hidden="true" style={w(400)}>
        <Head className="process-principles__head process-principles__head--left" />
        <span className="process-principles__shaft" />
      </span>
      <span className="process-principles__pair" aria-hidden="true">
        <svg viewBox="0 0 16 32" focusable="false">
          <path d="M8 4v24M4 8l4-4 4 4M4 24l4 4 4-4" />
        </svg>
      </span>
    </>
  ),
  '04': (
    <>
      <span className="process-principles__wire process-principles__wire--u" aria-hidden="true" style={w(600)}>
        <Head className="process-principles__head process-principles__head--up" />
        <span className="process-principles__shaft" />
        <span className="process-principles__tag">Returns to 01</span>
      </span>
      <Head className="process-principles__ah process-principles__ah--bottom" />
    </>
  ),
};

const ProcessPrinciples: React.FC = () => {
  const [circuitRef, circuitVisible] = useReveal<HTMLOListElement>(0.15);

  return (
    <section id="process" className="process-principles" aria-labelledby="process-heading">
      <div className="process-principles__inner">
        <p className="process-principles__section-label">[ Process ]</p>
        <h2 id="process-heading" className="process-principles__section-title">
          How I work
        </h2>
        <p className="process-principles__subtitle">A working loop</p>
        {/* The loop in one sentence, ending by saying the return in words. */}
        <p className="process-principles__core-line">
          Define the rules, explore across surfaces, learn from what becomes real, and feed it back
          into the system. Then start again from what the system now knows.
        </p>

        <ol
          ref={circuitRef}
          className={`process-principles__circuit${circuitVisible ? ' is-visible' : ''}`}
          aria-label="The loop, in four beats"
        >
          {processBeats.map((beat, i) => (
            <li
              key={beat.num}
              className={`process-principles__cell process-principles__cell--${i + 1} reveal-fade`}
              style={d(i * 80)}
            >
              <article className="process-principles__beat" aria-labelledby={`process-beat-${beat.num}`}>
                <div className="process-principles__beat-top">
                  <span className="process-principles__num">{beat.num}</span>
                  <h3 id={`process-beat-${beat.num}`} className="process-principles__beat-title">
                    {beat.title}
                  </h3>
                </div>
                <p className="process-principles__meta">{beat.meta}</p>
                <p className="process-principles__body">{beat.body}</p>
                {/* The space after the label is for the reading order: the <b> is a
                    block on screen, and without it the label and the cost read as
                    one word with styles off or in a screen reader. */}
                <p className="process-principles__cost">
                  <b>Cost of skipping it</b> {beat.cost}
                </p>
                {/* Icon and label are one inline run so they wrap as text; the
                    route sits on its own line under them at every width. */}
                <Link to={beat.evidence.to} className="process-principles__evidence">
                  <span className="process-principles__evidence-label">
                    <DocIcon />
                    {beat.evidence.label}
                  </span>{' '}
                  <small>{beat.evidence.to}</small>
                </Link>
                <p className="process-principles__rel">{beat.relation}</p>
              </article>
              {furniture[beat.num]}
            </li>
          ))}
        </ol>

        <div className="process-principles__closing">
          <p>
            {processCloser.lead}
            <b className="process-principles__closing-emphasis">{processCloser.emphasis}</b>.
          </p>
          <p>{processCloser.reps}</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessPrinciples;
