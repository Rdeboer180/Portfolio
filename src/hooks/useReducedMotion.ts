import { useEffect, useState } from 'react';

// The visitor's reduced-motion setting, read on the first render (as
// framer-motion's useReducedMotion did, so hydration sees the same value the
// page was drawn with) and followed if it changes. Components that only
// asked framer-motion this question no longer pull its 120 KB into the
// homepage's bundle.
const QUERY = '(prefers-reduced-motion: reduce)';
const read = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(read);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(QUERY);
    const change = () => setReduced(mq.matches);
    mq.addEventListener?.('change', change);
    return () => mq.removeEventListener?.('change', change);
  }, []);
  return reduced;
}
