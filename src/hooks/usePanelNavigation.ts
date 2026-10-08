import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import projects from '../data/projects';
import { useUnlock } from '../context/UnlockContext';
import { isPanelRoute } from '../utils/panelRoutes';

/** Preserve the source page for every internal reading link, including prose links. */
export function usePanelNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unlocked, skipAutomaticPrompt, openPrompt } = useUnlock();
  useEffect(() => {
    const open = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !isPanelRoute(url.pathname)) return;
      // Same-page anchors retain their own scrolling behavior.
      if (url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) return;
      event.preventDefault();
      const state = isPanelRoute(location.pathname) ? {
        ...location.state,
        readingDepth: (location.state?.readingDepth ?? 0) + 1,
        previousReading: location.pathname.startsWith('/notes/') ? 'article' : 'project',
        readingOrigin: location.state?.readingOrigin ?? (location.pathname.startsWith('/notes/') ? '/notes' : '/#projects'),
      } : {
        readingDepth: 0,
        backgroundLocation: location,
        returnScroll: window.scrollY,
        returnFocusHref: anchor.getAttribute('href'),
        returnFocusClass: anchor.className,
        returnMeta: {
          title: document.title,
          canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
          tags: Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')).map(meta => ({ name: meta.name, property: meta.getAttribute('property'), content: meta.content })),
        },
      };
      // Preserve browser history while keeping one panel and one return destination.
      const href = url.pathname.replace(/\/$/, '') + '/' + url.search + url.hash;
      const slug = url.pathname.match(/^\/work\/([^/]+)/)?.[1];
      const protectedWork = projects.some(project => project.slug === slug && project.stream === 'professional');
      if (protectedWork && !unlocked && !skipAutomaticPrompt) {
        openPrompt(href, { state });
        return;
      }
      navigate(href, { state });
    };
    document.addEventListener('click', open, true);
    return () => document.removeEventListener('click', open, true);
  }, [location, navigate, unlocked, skipAutomaticPrompt, openPrompt]);
}
