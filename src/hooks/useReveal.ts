import { useEffect, useRef, useState } from 'react';

// ============================================
// useReveal — one-time, in-view reveal trigger
// Adds visibility once the element scrolls into view; pairs with the
// `.reveal-mask` / `.reveal-fade` / `.reveal-draw` CSS utilities + an
// `is-visible` class on the container. Under prefers-reduced-motion it reports
// visible immediately, so all content renders in its final state (the CSS also
// disables the transitions). Visual only — content is always in the DOM.
// ============================================

export function useReveal<T extends HTMLElement = HTMLDivElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, visible]);

  return [ref, visible] as const;
}
