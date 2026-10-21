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
  /** The protected study whose link raised the prompt, by its short name: the prompt then speaks for it. */
  study?: string;
}

// The binder's lock dialog is the model (Ryan, 21 October): it names the
// study, says in one sentence why it is locked, and offers the two ways on.
type Copy = { title: string; body: string; primary: string; secondary: string };
const COPY: Record<Variant, Copy> = {
  'case-study': {
    title: 'These screens are password protected',
    body: 'They include employer or client work. Unlock them to see the screens, or keep reading without them.',
    primary: 'Unlock',
    secondary: 'Keep reading without them',
  },
  site: {
    title: 'See the full case studies',
    body: "Their screens include employer and client work, so the studies are password protected. Unlock them once and this device stays unlocked, or continue to the public overviews and you won't be asked again here.",
    primary: 'Unlock',
    secondary: 'Continue without a password',
  },
};
const studyCopy = (study: string): Copy => ({
  title: `${study} is password protected`,
  body: 'Its screens include employer work, so the study is password protected. Unlock it to see the whole study, or read the overview without the screens.',
  primary: 'Unlock',
  secondary: 'Read the overview',
});

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const PasswordModal: React.FC<PasswordModalProps> = ({
  onUnlock, onDismiss, onContinue, variant = 'case-study', study,
}) => {
  const decline = onContinue ?? onDismiss;
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const copy = study ? studyCopy(study) : COPY[variant];

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

        <span className="password-modal__icon"><LockIcon /></span>
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
            <div className="password-modal__buttons">
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
            </div>
            {error && <p className="password-modal__error" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordModal;
