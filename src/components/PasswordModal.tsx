import React, { useState, useEffect, useRef } from 'react';

interface PasswordModalProps {
  onUnlock: () => void;
  onDismiss: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onUnlock, onDismiss }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Store the element that had focus before the modal opened so we can restore it
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Ref for the primary button in the initial (two-button) state
  const unlockBtnRef = useRef<HTMLButtonElement>(null);
  // Container ref for Tab trapping
  const contentRef = useRef<HTMLDivElement>(null);

  // Capture return target, set initial focus, and install Tab trap
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    // Initial state: focus the "Unlock Images" button
    if (!showPassword) {
      unlockBtnRef.current?.focus();
    }
    return () => {
      returnFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab-trap keydown handler
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

  const hashPassword = async (pwd: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hash = await hashPassword(password);
      const correctHash = process.env.REACT_APP_PROJECT_PASSWORD_HASH;

      if (hash === correctHash) {
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
      <div className="password-modal__overlay" />
      <div
        className="password-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwd-modal-title"
        ref={contentRef}
        onKeyDown={handleKeyDown}
      >
        <h2 id="pwd-modal-title">Protected Case Study Images</h2>
        <p>
          Some images in this case study are restricted due to proprietary work. Enter the password to view them, or continue reading without images. We won't ask again unless you choose to open a hidden image.
        </p>

        {!showPassword ? (
          <div className="password-modal__buttons">
            <button
              ref={unlockBtnRef}
              className="password-modal__button password-modal__button--primary"
              onClick={() => setShowPassword(true)}
            >
              Unlock Images
            </button>
            <button
              className="password-modal__button password-modal__button--secondary"
              onClick={onDismiss}
            >
              No Thanks, View Without Images
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="password-modal__form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            {error && <p className="password-modal__error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordModal;
