import React, { useEffect, useState } from 'react';
import { useUnlock } from '../context/UnlockContext';

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

/** One sweep, then done. Long enough to notice, short enough to forget. */
const SWEEP_MS = 1700;

// Module scope, not a ref: the sweep is once per visit. A ref resets when the
// homepage remounts, so bouncing back from a case study would replay it — which
// is the difference between a cue and a nag.
let hasSwept = false;

/**
 * Persistent unlock bar, pinned above every page's fixed nav.
 *
 * Shown to any locked visitor: the site stays fully readable, so this is a
 * standing offer rather than a barrier. It never self-dismisses — it is the
 * visitor's way to the prompt.
 *
 * When the work section first scrolls into view it plays a single orange sweep.
 * Once per page load, never on a loop: the bar is persistent chrome, and
 * persistent chrome that keeps shimmering is the thing everyone hates.
 */
const SiteUnlockBar: React.FC = () => {
  const { barVisible, openPrompt } = useUnlock();
  const [sweeping, setSweeping] = useState(false);

  useEffect(() => {
    if (!barVisible || hasSwept) return;
    const work = document.getElementById('projects');
    if (!work) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasSwept) return;
        hasSwept = true;
        observer.disconnect();
        setSweeping(true);
        window.setTimeout(() => setSweeping(false), SWEEP_MS);
      },
      // The section is taller than the viewport, so a large threshold could
      // never be met — 12% is reached as soon as it's meaningfully on screen.
      { threshold: 0.12 }
    );
    observer.observe(work);
    return () => observer.disconnect();
  }, [barVisible]);

  if (!barVisible) return null;

  return (
    <div
      className={`unlock-bar${sweeping ? ' unlock-bar--sweep' : ''}`}
      role="region"
      aria-label="Protected content"
    >
      <p className="unlock-bar__text">
        <span className="unlock-bar__icon"><LockIcon /></span>
        Unlock full case studies by entering the site password
      </p>
      <button type="button" className="unlock-bar__action" onClick={() => openPrompt()}>
        Enter password
      </button>
    </div>
  );
};

export default SiteUnlockBar;
