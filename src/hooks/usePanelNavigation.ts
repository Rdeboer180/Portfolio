import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isPanelRoute } from '../utils/panelRoutes';

/** Preserve the source page for every internal reading link, including prose links. */
export function usePanelNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const open = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !isPanelRoute(url.pathname)) return;
      // Same-page anchors retain their own scrolling behavior.
      if (url.pathname === location.pathname) return;
      event.preventDefault();
      const state = isPanelRoute(location.pathname) ? location.state : {
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
      // Switching reading material keeps one panel and one return destination.
      navigate(url.pathname + url.search + url.hash, { state, replace: isPanelRoute(location.pathname) });
    };
    document.addEventListener('click', open, true);
    return () => document.removeEventListener('click', open, true);
  }, [location, navigate]);
}
