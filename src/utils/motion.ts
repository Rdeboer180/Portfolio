/**
 * Reduced-motion helpers for scripted scrolling.
 *
 * `_base.scss` sets `scroll-behavior: auto !important` under
 * prefers-reduced-motion, which covers CSS-driven and anchor-driven scrolling.
 * It does not cover this:
 *
 *     element.scrollIntoView({ behavior: 'smooth' })
 *
 * An explicit `behavior` passed to a scroll method wins over the CSS property —
 * that is the specified precedence, not a browser quirk — so the two scripted
 * scrolls on the site kept animating for exactly the visitors who asked them
 * not to. For someone with vestibular sensitivity a long smooth scroll is the
 * worst offender on a page, because it moves everything at once.
 *
 * Read at call time rather than cached: the preference can change mid-session
 * (macOS Reduce Motion is a toggle, not a boot flag).
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** `'auto'` when the visitor asked for reduced motion, otherwise `'smooth'`. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
