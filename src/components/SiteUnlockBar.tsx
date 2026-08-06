import React from 'react';
import { useUnlock } from '../context/UnlockContext';

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

/**
 * Persistent unlock bar, pinned above every page's fixed nav.
 *
 * Shown only to a visitor who closed the password prompt: the site stays fully
 * readable, so this is a standing offer rather than a barrier. It never
 * self-dismisses — it is the only remaining way back to the prompt.
 */
const SiteUnlockBar: React.FC = () => {
  const { barVisible, openPrompt } = useUnlock();

  if (!barVisible) return null;

  return (
    <div className="unlock-bar" role="region" aria-label="Protected content">
      <p className="unlock-bar__text">
        <span className="unlock-bar__icon"><LockIcon /></span>
        Unlock full case studies by entering the site password
      </p>
      <button type="button" className="unlock-bar__action" onClick={openPrompt}>
        Enter password
      </button>
    </div>
  );
};

export default SiteUnlockBar;
