// ============================================
// VisualProblemSolver — the three figures in the "Visual Problem Solver"
// note: the first suggested layout beside a directed one, what craft and code
// bring to a prompt, and Derek Briggs's ease-out next to the browser default.
// Note-scale, in the site's vocabulary (paper cards, hairlines, Menlo tags,
// Signal Orange only where a decision was made). Stacks on phones.
// ============================================

import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

/** Figure 1: same content, first suggestion vs directed. */
export const FirstDraft: React.FC = () => (
  <figure className="note-embed vps vps--draft">
    <div className="vps__pair">
      <div className="vps__panel">
        <span className="vps__tag">[ first suggestion ]</span>
        <div className="vps__frame vps__frame--default" aria-hidden="true">
          <span className="vps__bar vps__bar--title" />
          <span className="vps__bar vps__bar--short" />
          <span className="vps__cards">
            <span /><span /><span />
          </span>
          <span className="vps__btn" />
        </div>
        <p className="vps__caption">Sensible. The middle of everything that already shipped.</p>
      </div>
      <span className="vps__arrow" aria-hidden="true">→</span>
      <div className="vps__panel">
        <span className="vps__tag vps__tag--mine">[ directed ]</span>
        <div className="vps__frame vps__frame--directed" aria-hidden="true">
          <span className="vps__lead"><span className="vps__lead-media" /><span className="vps__lead-copy"><span /><span /><span className="vps__btn vps__btn--primary" /></span></span>
          <span className="vps__rows"><span /><span /></span>
          <span className="vps__pin vps__pin--1">1</span>
          <span className="vps__pin vps__pin--2">2</span>
          <span className="vps__pin vps__pin--3">3</span>
        </div>
        <ol className="vps__notes">
          <li>One thing leads; the rest are rows, not equal cards.</li>
          <li>An ease that lands, not the browser default.</li>
          <li>The states the first draft never drew: empty, long, loading.</li>
        </ol>
      </div>
    </div>
  </figure>
);

/** Figure 2: what goes into directing the output. */
export const Inputs: React.FC = () => (
  <figure className="note-embed vps vps--inputs">
    <div className="vps__inputs">
      <ul className="vps__sources">
        <li><b>Craft</b><span>composition · type · hierarchy</span></li>
        <li><b>Code</b><span>HTML · CSS · motion · states</span></li>
        <li><b>What’s possible</b><span>what the browser can do today</span></li>
      </ul>
      <span className="vps__join" aria-hidden="true" />
      <div className="vps__out">
        <b>Direction</b>
        <span>the prompt · the review · the rule I write down</span>
      </div>
    </div>
  </figure>
);

/** Figure 3: the browser's ease beside Derek Briggs's soft-close ease-out. */
export const EaseDemo: React.FC = () => {
  const [run, setRun] = useState(0);
  // Plays when it scrolls into view; Replay remounts the tracks to play again.
  const [ref, visible] = useReveal<HTMLElement>(0.5);
  return (
    <figure className="note-embed vps vps--ease" ref={ref}>
      <div className={`vps__ease${visible ? ' is-run' : ''}`} key={run}>
        <div className="vps__track">
          <span className="vps__track-label">Browser <code>ease</code>, 200ms</span>
          <span className="vps__rail"><span className="vps__dot vps__dot--default" /></span>
        </div>
        <div className="vps__track">
          <span className="vps__track-label"><code>cubic-bezier(.2, .8, 0, 1)</code>, 400ms</span>
          <span className="vps__rail"><span className="vps__dot vps__dot--soft" /></span>
        </div>
      </div>
      <button type="button" className="vps__replay" onClick={() => setRun((n) => n + 1)}>Replay</button>
      <figcaption>
        Same distance, and both read as quick. The second spends its extra time on the landing.
        The curve is Derek Briggs’s, from his Dive Club episode.
      </figcaption>
    </figure>
  );
};
