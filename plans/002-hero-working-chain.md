# 002 — Hero working chain (sketch → token → component → shipped)

**Status: TABLED 2026-08-18.** Built, verified in the browser, then reverted
before commit. Everything needed to restore it is in this file.

## The finding

The hero paragraph spends eight lines describing a process a reader could watch
in three seconds, and its middle third is a job-title hedge ("My official title
has been Senior Web Designer, but the work runs well past the web…") that the
About hero already carries in better form — *"there's more to the story than a
title."*

Reference pattern: Oddfellows proves before claiming. The site's own process
playground already owns the sketch-to-shipped grammar, so the vocabulary exists.

## The move

Cut the paragraph to its two real claims. Beside them, one row ~60px tall: four
glyphs in the cover-plate linework (ink, steel, one orange), connected by short
orange lines that draw in just before the step they lead to. Resolves once at
1.5s — after the hero's staged reveal finishes at ~1.25s — and never loops.

Constraints that made it work, and would need to hold again:

- **One row, not a second playground.** Four glyphs, four labels, no scroll
  interaction, no replay.
- **Real text labels** (`01 sketch` … `04 shipped`) inside an `<ol>` with
  `aria-label="How the work moves: sketch, token, component, shipped"`, so the
  chain reads as an ordered list and the SVG stays decoration (`aria-hidden`).
- **Reduced motion**: the resting styles *are* the final state, so
  `animation: none` renders the finished chain with no draw.
- The hero's reveal mixin already has a `--5` stage; `.hero__actions` moves from
  `--4` to `--5` and the chain takes `--4`.

## Two bugs found while building it — don't reintroduce

1. **Connector delays were being zeroed.** The base connector rule is
   `.hero-chain__step + .hero-chain__step::before` (two classes). Per-step
   overrides written as a bare modifier (`.hero-chain__step--2::before`) lose on
   specificity, so every line fired at 0s and the chain arrived pre-assembled.
   The overrides must repeat the sibling combinator.
2. **Verify with computed values, not the eye.** Both this and the sibling
   opener bug (`--case-study-ease-out` undefined outside `.case-playground`)
   looked fine in a screenshot and were only caught by reading
   `getComputedStyle(...).animationDelay`.

## Restore

`src/components/Hero.tsx` — replace the `.hero__body` paragraph's middle third
(delete the "My official title…working products." sentence), change
`.hero__actions` from `hero__reveal--4` to `--5`, and insert this between them:

```jsx
{/* The working chain — the paragraph's remaining claim, drawn.
    One row, resolves once after the content reveals, never loops. */}
<ol
  className="hero-chain hero__reveal hero__reveal--4"
  aria-label="How the work moves: sketch, token, component, shipped"
>
  <li className="hero-chain__step hero-chain__step--1">
    <svg viewBox="0 0 44 38" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="38" height="28" className="hc-dash" />
      <path d="M 10 25 C 15 11, 20 21, 24 10 S 32 20, 35 9" className="hc-ink" />
    </svg>
    <span className="hero-chain__label">01 sketch</span>
  </li>
  <li className="hero-chain__step hero-chain__step--2">
    <svg viewBox="0 0 44 38" aria-hidden="true" focusable="false">
      <rect x="7" y="6" width="15" height="15" className="hc-orange-fill" />
      <rect x="27" y="8" width="12" height="3" className="hc-steel-fill" />
      <rect x="27" y="15" width="9" height="3" className="hc-steel-fill" />
      <rect x="7" y="27" width="32" height="3" className="hc-mist-fill" />
    </svg>
    <span className="hero-chain__label">02 token</span>
  </li>
  <li className="hero-chain__step hero-chain__step--3">
    <svg viewBox="0 0 44 38" aria-hidden="true" focusable="false">
      <rect x="7" y="11" width="30" height="15" rx="4" className="hc-orange-fill" />
      <rect x="15" y="17.5" width="14" height="2" fill="#ffffff" />
      <rect x="4.5" y="8.5" width="5" height="5" className="hc-steel-fill" />
      <rect x="34.5" y="23.5" width="5" height="5" className="hc-steel-fill" />
    </svg>
    <span className="hero-chain__label">03 component</span>
  </li>
  <li className="hero-chain__step hero-chain__step--4">
    <svg viewBox="0 0 44 38" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="36" height="28" className="hc-ink" />
      <rect x="4" y="4" width="36" height="8" className="hc-mist-fill" />
      <circle cx="8.5" cy="8" r="1.4" className="hc-steel-fill" />
      <circle cx="13" cy="8" r="1.4" className="hc-steel-fill" />
      <rect x="9" y="17" width="18" height="2.5" className="hc-steel-fill" />
      <rect x="9" y="24" width="10" height="5" rx="1.5" className="hc-orange-fill" />
    </svg>
    <span className="hero-chain__label">04 shipped</span>
  </li>
</ol>
```

`src/styles/components/_hero-chain.scss` — new file, and add
`@import 'components/hero-chain';` after the hero import in `styles.scss`:

```scss
.hero-chain {
  list-style: none;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: $spacing-sm $spacing-2xl;
  margin: $spacing-xl 0 0;
  padding: 0;
  min-height: 60px;
}

.hero-chain__step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: heroChainStep 300ms cubic-bezier(0.16, 1, 0.3, 1) both;

  svg { width: 44px; height: 38px; display: block; }
}

.hero-chain__label {
  font-family: $font-family-mono;
  font-size: 10px;
  font-weight: $font-weight-medium;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $color-neutral-muted;
}

.hero-chain__step + .hero-chain__step::before {
  content: '';
  position: absolute;
  left: -#{$spacing-2xl - 4px};
  top: 19px;
  width: #{$spacing-2xl - 8px};
  height: 1.5px;
  background: $color-primary;
  transform-origin: left center;
  animation: heroChainLine 250ms ease-out both;
}

// Connector overrides repeat the sibling combinator on purpose — see bug 1.
.hero-chain__step--1 { animation-delay: 1.5s; }
.hero-chain__step--2 { animation-delay: 1.9s; }
.hero-chain__step--3 { animation-delay: 2.3s; }
.hero-chain__step--4 { animation-delay: 2.7s; }
.hero-chain__step + .hero-chain__step--2::before { animation-delay: 1.75s; }
.hero-chain__step + .hero-chain__step--3::before { animation-delay: 2.15s; }
.hero-chain__step + .hero-chain__step--4::before { animation-delay: 2.55s; }

@keyframes heroChainStep {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}

@keyframes heroChainLine {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

// Glyph vocabulary — same inks as the cover plates.
.hc-ink { stroke: $color-neutral-dark; fill: none; stroke-width: 1.5; }
.hc-dash { stroke: $color-secondary; fill: none; stroke-width: 1; stroke-dasharray: 3 3; }
.hc-orange-fill { fill: $color-primary; stroke: none; }
.hc-steel-fill { fill: $color-secondary; stroke: none; }
.hc-mist-fill { fill: $color-neutral-lightest; stroke: none; }

@media (prefers-reduced-motion: reduce) {
  .hero-chain__step,
  .hero-chain__step + .hero-chain__step::before { animation: none; }
}

@media (max-width: $breakpoint-sm) {
  .hero-chain { gap: $spacing-sm $spacing-lg; }
  .hero-chain__step svg { width: 38px; height: 33px; }
  .hero-chain__step + .hero-chain__step::before {
    left: -#{$spacing-lg - 2px};
    width: #{$spacing-lg - 4px};
    top: 16px;
  }
}
```

## Open questions for the next pass

- Does the row belong under the paragraph, or beside it in the hero's right
  column? It was built under, which stacks cleanly on mobile but puts it below
  the CTAs' visual weight.
- Is `02 token` legible as an idea at 44px, or does the swatch need a label?
- Should the copy cut ship on its own? The hedge removal stands up without the
  diagram, and is a one-line change.
