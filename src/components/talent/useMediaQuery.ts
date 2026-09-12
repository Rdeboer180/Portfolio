import { useEffect, useState } from 'react';

// ============================================
// useMediaQuery: a media query as state, read after mount
// The first render always reports `false`, whatever the viewport, so the
// prerendered markup and the client's first render agree (the prerender
// serialises the live DOM; see the header of SystemsInPractice.tsx). The
// real answer lands in an effect and the component re-renders from there.
// Only behaviour should hang off this (which control a tap opens); layout
// stays with the SCSS, which reads the viewport directly.
// ============================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, [query]);

  return matches;
}
