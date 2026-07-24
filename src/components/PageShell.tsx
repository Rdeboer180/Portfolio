import React, { Suspense } from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard route wrapper: a skip link plus the single <main> landmark, with a
 * Suspense boundary for lazily-loaded route components.
 *
 * Every route branch in App.tsx renders through this so keyboard/screen-reader
 * users always get a bypass and a landmark (WCAG 2.4.1 / 1.3.1) — new routes
 * can't forget it. The fallback is a quiet full-height spacer (not a spinner)
 * so switching to a not-yet-loaded chunk doesn't collapse the layout.
 */
const PageShell: React.FC<PageShellProps> = ({ children, className }) => (
  <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <main id="main-content" tabIndex={-1} className={className}>
      <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
        {children}
      </Suspense>
    </main>
  </>
);

export default PageShell;
