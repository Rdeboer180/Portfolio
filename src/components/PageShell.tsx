import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Module scope, not a ref, and that distinction is the whole trick.
 *
 * Every <Route> builds its own <PageShell>, so navigating unmounts one instance
 * and mounts a fresh one. An instance-level "is this the first render?" ref is
 * therefore true on *every* navigation, and the guard meant to skip the initial
 * page load ends up skipping all of them — the announcement never fires and
 * focus never moves. A module-level record of the last pathname outlives the
 * instances and can actually tell a first load from a navigation.
 */
let lastPathname: string | null = null;

/** The last title announced, so a route that reuses a title isn't announced twice. */
let lastTitle = '';

/**
 * Standard route wrapper: a skip link plus the single <main> landmark, with a
 * Suspense boundary for lazily-loaded route components.
 *
 * Every route branch in App.tsx renders through this so keyboard/screen-reader
 * users always get a bypass and a landmark (WCAG 2.4.1 / 1.3.1) — new routes
 * can't forget it. The fallback is a quiet full-height spacer (not a spinner)
 * so switching to a not-yet-loaded chunk doesn't collapse the layout.
 *
 * It also owns the two things a client-side router silently drops: on a real
 * page load the browser announces the new document and resets focus, but a
 * <Link> click does neither. Focus stays on a link that no longer exists in
 * the new tree, and a screen reader says nothing at all — so a visitor can
 * activate "Read the notes" and have no evidence anything happened. The effect
 * below moves focus to <main> and announces the new title in a live region.
 *
 * Note on landmarks: each page renders its own bespoke primary nav (sticky on
 * notes/resume/sitemap, fixed on home), so there is no shared <header> to give
 * role="banner" — wrapping a sticky nav in a header box would cap its sticky
 * range to that box's height and kill the behaviour. The nav landmark and skip
 * link both survive as-is; banner is a best-practice landmark, not a WCAG
 * conformance requirement.
 */
const PageShell: React.FC<PageShellProps> = ({ children, className }) => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const isNavigation = lastPathname !== null && lastPathname !== pathname;
    lastPathname = pathname;

    // A real document load already announced itself and reset focus. Only a
    // client-side navigation needs the two put back.
    if (!isNavigation) {
      lastTitle = document.title;
      return;
    }

    // preventScroll: the focus move should not fight ScrollToTop for the scroll
    // position — this is about where the next Tab goes, not about the view.
    mainRef.current?.focus({ preventScroll: true });

    /**
     * Do not read document.title here and announce it.
     *
     * Most routes are `lazy()`, so at this point the new route's chunk has not
     * loaded, its component has not rendered, and the `usePageMeta` call that
     * sets the title has not run. document.title is still the *previous* page's
     * — announcing it tells the visitor they arrived at the page they just
     * left, which is worse than announcing nothing at all.
     *
     * So: announce the title when it actually changes. If the new route was
     * already loaded the change has happened by now and the first call catches
     * it; if the chunk is still in flight, the observer waits for it and then
     * disconnects. Either way the announcement matches the page.
     */
    const announce = () => {
      if (!document.title || document.title === lastTitle) return false;
      lastTitle = document.title;
      setAnnouncement(document.title);
      return true;
    };

    if (announce()) return;

    const titleEl = document.querySelector('title');
    if (!titleEl) return;
    const observer = new MutationObserver(() => {
      if (announce()) observer.disconnect();
    });
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" ref={mainRef} tabIndex={-1} className={className}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
          {children}
        </Suspense>
      </main>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
};

export default PageShell;
