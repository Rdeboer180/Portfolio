import { useEffect, useRef } from 'react';

// ============================================
// useHighlightSweep — staggered "brush sweep" highlight on scroll-in
// Watches a container; when it scrolls into view, each element matching
// `selector` gets `activeClass` (the wet sweep), then `settledClass` (bold,
// highlight faded) after `settleOffset` ms, staggered by `cycleTime` per span.
// Under prefers-reduced-motion every span jumps straight to settled. Timeouts
// are cleared on unmount. CSS owns the actual transition durations.
// ============================================

interface HighlightSweepOptions {
  /** CSS selector for the highlight spans within the container. */
  selector: string;
  /** Class applied when a span's sweep starts. */
  activeClass: string;
  /** Class applied once a span settles to bold (activeClass is removed). */
  settledClass: string;
  /** ms after a span's sweep starts before it settles. */
  settleOffset: number;
  /** ms between consecutive spans starting their sweep. */
  cycleTime: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
}

export function useHighlightSweep<T extends HTMLElement = HTMLElement>({
  selector,
  activeClass,
  settledClass,
  settleOffset,
  cycleTime,
  threshold = 0.4,
}: HighlightSweepOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const highlights = Array.from(section.querySelectorAll<HTMLElement>(selector));
    if (highlights.length === 0) return;

    // Reduced motion: skip the sweep, show every span in its final bold state.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      highlights.forEach((el) => el.classList.add(settledClass));
      return;
    }

    const timeouts: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        highlights.forEach((el, i) => {
          const baseDelay = i * cycleTime;
          timeouts.push(window.setTimeout(() => el.classList.add(activeClass), baseDelay));
          timeouts.push(
            window.setTimeout(() => {
              el.classList.add(settledClass);
              el.classList.remove(activeClass);
            }, baseDelay + settleOffset)
          );
        });
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [selector, activeClass, settledClass, settleOffset, cycleTime, threshold]);

  return ref;
}
