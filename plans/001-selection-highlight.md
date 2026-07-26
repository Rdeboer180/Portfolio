# Plan 001 — Replace brush-stroke highlight with browser text-selection effect

Commit: 85f5207 · Status: EXECUTING (same session)

## Intent

The `.animated-bold` / `.about__highlight` spans currently animate a textured,
angled "wet brush" gradient (orange-300 `#f9c4b0`, 97deg, multi-stop alpha)
across the copy while the text turns brand orange and bold, then settles to
bold black. Owner feedback: too loud alongside the rest of the homepage motion.

Replace the visual with a **browser text-selection metaphor**: a flat
`$color-primary-light` (`#fdede9`) band sweeps left→right across the copy the
way a cursor drags a selection, holds, then the "edit" lands — text snaps bold,
selection fades out. Reads as an editing gesture, not decoration. Pairs with
the Figma selection-frame card treatment shipped earlier (static tool
vernacular over ambient motion).

## Scope

- ONLY `src/styles/components/_about.scss` lines ~1–109 (the shared highlight
  block + reduced-motion block).
- Do NOT touch `useHighlightSweep.ts`, Hero.tsx scheduling, or any consumer —
  the two-phase class machinery (`--active` → `--bold`/`--settled`) and JS
  timings (settleOffset 1000 / cycleTime 1700; Hero's own timeouts) stay.

## Target values

- Highlight color: `$color-primary-light` (#fdede9), flat, full alpha during
  selection. No angled gradient, no texture stops, no orange text color.
- Sweep: `background-size` 0% → 100% (height 100%), anchored
  `background-position: left`, over **450ms cubic-bezier(0.25, 1, 0.5, 1)**
  (decelerating ease-out — selection is a quick human gesture).
- Selected hold: no extra CSS state — the JS settleOffset (1000ms) minus the
  450ms sweep provides the hold.
- Settle (`--bold`/`--settled`): `font-weight: 700` (snap — bold is an instant
  edit, and weight already snapped in the old version), `color:
  $color-neutral-dark`, selection fades via registered `@property
  --select-alpha` 1 → 0 over **500ms ease**; `background-size` pinned at 100%
  so the band never shrinks while fading.
- Box: `padding: 2px 3px; margin: 0 -3px; border-radius: 2px` — selection hugs
  text tighter than a marker stroke. Keep `box-decoration-break: clone` (the
  multi-line wrap fix must survive).
- Reduced motion: unchanged contract — no transitions, spans render settled
  (bold, dark, no highlight) immediately.

## Verification

- `npx tsc --noEmit` (should be untouched) + dev-server compile.
- CSSOM check: `.animated-bold--active` shows `background-size: 100% 100%`;
  base shows `0% 100%`; settled shows `--select-alpha: 0`.
- Feel-check in a visible browser: hero paragraph spans select→bold→release
  in sequence on scroll-in; About/Skills/HomepageTargeted spans (legacy
  `--bold` modifier) behave identically; multi-line spans on mobile widths
  highlight per line box, not one merged band.
