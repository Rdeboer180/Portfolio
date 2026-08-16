import React, { useState, useEffect, useRef } from 'react';
import { verifyPassword } from '../utils/unlock';

type Variant = 'case-study' | 'site';

interface PasswordModalProps {
  onUnlock: () => void;
  /** Cancel: close and stay put. Wired to the X and to Escape. */
  onDismiss: () => void;
  /**
   * Declining on purpose, via the secondary button. Distinct from onDismiss
   * because continuing to the locked page is a choice, not a cancel.
   * Falls back to onDismiss when the caller doesn't need the distinction.
   */
  onContinue?: () => void;
  /**
   * 'case-study' — raised from a locked overlay inside one case study.
   * 'site'       — raised once on first load; covers every protected surface.
   */
  variant?: Variant;
}

const COPY: Record<Variant, {
  title: string; body: string; primary: string; secondary: string;
}> = {
  'case-study': {
    title: 'Protected Case Study Images',
    body: 'Some images in this case study are restricted due to proprietary work. Enter the password to view them, or continue reading without images. We won’t ask again unless you choose to open a hidden image.',
    primary: 'Unlock Images',
    secondary: 'No Thanks, View Without Images',
  },
  site: {
    title: 'See the full case studies',
    body: 'Parts of this work are client- and employer-confidential, so the protected images and product demos stay locked by default. Enter the password to unlock them on this device — you’ll only be asked once. Everything else on the site is open either way.',
    primary: 'Unlock the work',
    secondary: 'Keep browsing without it',
  },
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const PasswordModal: React.FC<PasswordModalProps> = ({
  onUnlock, onDismiss, onContinue, variant = 'case-study',
}) => {
  const decline = onContinue ?? onDismiss;
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const copy = COPY[variant];

  // Store the element that had focus before the modal opened so we can restore it
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Ref for the primary button in the initial (two-button) state
  const unlockBtnRef = useRef<HTMLButtonElement>(null);
  // Container ref for Tab trapping
  const contentRef = useRef<HTMLDivElement>(null);

  // Capture return target, set initial focus, and install Tab trap
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    // Initial state: focus the "Unlock" button
    if (!showPassword) {
      unlockBtnRef.current?.focus();
    }
    return () => {
      returnFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll lock. Without it the page keeps scrolling under the overlay — on
  // iOS especially, a flick on the dimmed area moves the article behind a modal
  // that isn't going anywhere, which reads as the modal being broken.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  // Escape at the document level, not just inside the dialog. The React
  // onKeyDown below only fires while focus is within the modal — click the
  // dimmed backdrop and focus lands on <body>, after which Escape did nothing
  // and the only way out was finding the small X.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onDismiss(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  // Tab-trap keydown handler. Escape is handled at the document level above.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const el = contentRef.current;
    if (!el) return;
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => !node.closest('[aria-hidden="true"]'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (await verifyPassword(password)) {
        setError('');
        onUnlock();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="password-modal">
      {/* Dismiss on backdrop click — the gesture every visitor already tries
          first. Not a focusable control: the X button and Escape are the
          keyboard paths, so exposing this as a second tab stop would only add
          an unlabelled one. */}
      <div className="password-modal__overlay" onClick={onDismiss} />
      <div
        className="password-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwd-modal-title"
        ref={contentRef}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          className="password-modal__close"
          onClick={onDismiss}
          aria-label="Close and keep browsing without the protected work"
        >
          <CloseIcon />
        </button>

        <h2 id="pwd-modal-title">{copy.title}</h2>
        <p>{copy.body}</p>

        {!showPassword ? (
          <div className="password-modal__buttons">
            <button
              ref={unlockBtnRef}
              className="password-modal__button password-modal__button--primary"
              onClick={() => setShowPassword(true)}
            >
              {copy.primary}
            </button>
            <button
              className="password-modal__button password-modal__button--secondary"
              onClick={decline}
            >
              {copy.secondary}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="password-modal__form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              aria-label="Password"
              autoFocus
            />
            <button type="submit" className="password-modal__button password-modal__button--primary">
              Unlock
            </button>
            <button
              type="button"
              className="password-modal__button password-modal__button--secondary"
              onClick={() => setShowPassword(false)}
            >
              Back
            </button>
            {error && <p className="password-modal__error" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordModal;
