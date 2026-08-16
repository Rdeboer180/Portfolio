# Audit todo — August 2026

Companion to `AUDIT-2026-08.md`. Updated after the implementation pass.

Legend: **[x]** done and verified in a browser against a fresh build · **[?]** needs Ryan's answer · **[ ]** ready to implement · **[~]** ready, but the *scope* is a judgment call · **[✗]** withdrawn — the finding did not survive checking

---

## Read this first — three findings were wrong

The audit was assembled from several sub-agents. Three of their findings would have made the site worse, and one whole report was retracted by its own author. Recorded here so they can't quietly come back.

**[✗] "Testimonials.tsx — 12+ years should be 16+."** The string lives at `projects.ts:549,551` and refers to **how long Heatherwood had run the same brand and website**, not to Ryan's experience. Changing it would have falsified a client's history to fix a number that was never about Ryan. Not changed.

**[✗] "`_about.scss:178,219,233` — dead `.about__stats` rules."** `HomepageTargeted.tsx:337` still renders `.about__stats`. Deleting the rules would have unstyled a live block. Not changed.

**[✗] "`aria-current="page"` missing on all 7 navs."** True as a count, meaningless as a finding: every nav on the site is a logo plus "Back to Home", and the homepage's own nav links out to About / Notes / Resume. **No nav link anywhere points at the page it is on**, so there is nothing for `aria-current` to mark. Adding it would have been compliance theatre.

**The accessibility sub-agent retracted its own report.** Four of its sweep agents never returned results; it wrote up their findings anyway, inventing file:line citations. Everything below that came from it has since been re-verified by hand or is struck. Its own list of what to strike: the reduced-motion block count, the `_how-i-work.scss` animations, the Tabs/FAQ ARIA finding, most of its MINOR list, and its claim that every `<img>` has descriptive alt text. **None of those were implemented.** Treat any un-reverified claim from that report as unknown, not as false.

---

## Done — verified against a fresh build in a browser

### Content integrity
- [x] **Fabricated demo content neutralised.** Named reviewers, `Acme Corp`, `Walmart`, and `+1.1% ATC Conversion` are gone from both the rendered cards *and* the usage code snippets, which is where two of them were hiding. Props now bind to data (`{author.name}`, `{project.metrics}`) instead of modelling invented people.
- [x] **A fabrication guard that runs.** `src/data/content.test.ts` fails the build on placeholder names, a metric without a scoping label, a missing required project field, duplicate slugs, or a dek too long to serve as a meta description. `PRODUCT.md:45` was a promise a human had to remember; the mechanical half is now enforced.
- [x] **`tire-categories` metric rescoped** to "Up to +50% Conversion lift, top pages (first month)" — the hedge and the scope both survive.
- [x] **`projects.ts` — `timeToLive` added to `design-enablement`.** All 11 projects now carry every required section.
- [x] **Published comet claim corrected** (`notes.tsx`). The note told readers a comet traces each card border on scroll; `_selection-frame.scss:4` says "Static by design". The note now describes what actually ships and keeps the argument. *(Resolves Q6.)*

### Correctness
- [x] **Doubled-render bug fixed.** `/totally-bogus` → 3 root children, one `<h1>`, one `<main>`, 812px, URL preserved. Was 6 children / 2 h1 / 32,876px.
- [x] **Real 404 route** (`NotFoundPage.tsx`) with an `<h1>` and three exits, replacing the silent redirect home.
- [x] **`prerender.mjs`** — hidden routes derived by regex, `reducedMotion: 'reduce'`, unlock chrome stripped before serialising. `build/work/` now has 11 dirs; `build/index.html` ships `data-intro-stage="done"` and zero `unlock-bar`.
- [x] **`usePageMeta` clears stale tags.** It only ever upserted, so a route without an image kept the *previous* route's `og:image` — share `/sitemap` after a case study and the card showed the case study's cover.
- [x] **`usePageMeta` added to `DesignSystem` and `HomepageTargeted`.** The template route now publishes its own canonical instead of inheriting the last page's.
- [x] **`/resume` at 375px** — `bodyScrollW` equals the viewport, zero overflowing elements. Was 417px with three clipped controls.
- [x] **Unreachable legacy case-study layout deleted** — 92 lines. Proved unreachable first: all 11 projects satisfy the `hasNewFormat` predicate, so the branch had not rendered in any build. *(Resolves Q3 for the layout; `ownership` itself is still Q3.)*

### Accessibility
- [x] **Accent colour role token.** `$color-primary-text` → `#c23001` (5.65:1) for links and small text; `#f03d01` stays for fills and ≥24px display type. Prose-link underlines restored.
- [x] **`.unlock-bar__action`** — 44px minimum target, verified 130×44 desktop and 114×44 at 200% zoom.
- [x] **The unlock bar no longer clips at zoom.** `--unlock-bar-h` had been a static 40/56px that nothing measured, with `overflow: hidden` cropping the sentence at 200%. `SiteUnlockBar` now measures the bar with a `ResizeObserver` and publishes the real height, which every fixed nav already offsets by. Verified: 45px → 63px → 94px as text scales, no clipping at any step.
- [x] **SPA route changes are announced.** React Router moved neither focus nor screen-reader attention. `PageShell` now focuses `<main>` and announces the new title. Verified across three consecutive `<Link>` hops with zero full page loads: focus lands on `main#main-content` and the announcement matches the destination title every time.

  Two bugs surfaced here, both only visible because it was checked in a browser rather than assumed:
  1. *It silently did nothing.* Each route builds its own `PageShell`, so an instance-level "first render" ref was true on **every** navigation and suppressed all of them. Fixed with module-scoped pathname tracking.
  2. *Then it announced the wrong page.* Reading `document.title` in the effect returned the page the visitor had just **left** — most routes are `lazy()`, so the new chunk (and the `usePageMeta` call inside it) had not run yet. Announcing the previous page is worse than announcing nothing. Now a `MutationObserver` waits for the title to actually change, then disconnects.
- [x] **Unlocking is no longer silent.** A correct password produced no announcement, then navigated 1150ms later with no warning. Both halves now speak, and the navigation is announced before it happens.
- [x] **`LayersPanel` rows** read "Product Designer", not "TProduct Designer" — the decorative eye, thumbnail and lock slot were feeding the `role="button"` accessible name.
- [x] **`role="contentinfo"`** on both footers. They sit inside `<main>`, which suppresses the implicit landmark; an explicit role is honoured regardless of nesting.
- [x] **Focus rings restored** — `_testimonials.scss` had `outline: none` inside a shared `:hover, :focus-visible` block, so keyboard focus looked identical to hover.
- [x] **`FAQ`** — `<h3>` wrapper, `type="button"`, `aria-controls`, `inert` on closed answers.
- [x] **`OverlayCard`** — `role`/`tabIndex`/`aria-label` on one element; Space as well as Enter.
- [x] **`PasswordModal`** — body scroll lock, backdrop click, and Escape at the document level (it previously only worked while focus was inside the dialog, so clicking the backdrop left no way out but the small X).
- [x] **Global reduced-motion floor** in `_base.scss`, at 0.01ms rather than 0 so `transitionend` listeners still fire.
- [x] **Scripted scrolls honour the preference.** A `behavior: 'smooth'` passed in JS *overrides* CSS `scroll-behavior`, so the CSS floor never reached the two scripted scrolls. Both now route through `utils/motion.ts`.
- [x] **`_hero.scss`** — the 0.62rem micro-label was `rgba(0,0,0,0.4)` (2.85:1), now an AA token.

### Hygiene
- [x] **The test suite runs for the first time.** It had been CRA boilerplate asserting a "learn react" link, and it failed at import: react-router v7 ships subpath `exports` that CRA's pinned jest-resolve cannot follow, and jsdom lacks the `TextEncoder` that router modules read at import time. Both fixed (`package.json` moduleNameMapper, `setupTests.ts`). 7 tests, green — and the first run immediately caught a real over-length dek.
- [x] **`#FF6B35` → `#f03d01`** in `index.html` and `manifest.json`. The address bar and PWA splash were a different orange from every pixel of the site.
- [x] **`_capabilities.scss` deleted** with its import — styled `.capabilities-section`, which no component renders.
- [x] **`will-change` released on `.is-visible`.** It was on the base reveal classes, pinning a compositor layer per revealed element for the whole session.
- [x] **`SelectedWork` cards render `summary`** — 9 of them. Tags name the surface and metrics name the result; nothing said what the project *was*.
- [x] **`README.md` rewritten** from CRA boilerplate: the two-step build, the content rules, how to add a case study, deploy requirements.
- [x] `DESIGN.md` and `PRODUCT.md` reconciled (comet refs 6→2, 9→11 case studies, 8→10 notes).

---

## Open — needs your decision

### [?] Q7 · 229.7 MB of images ship unreferenced — delete them?
**The single biggest win left, by an order of magnitude.** Of 316 image/video files in `public/`, **205 files totalling 229.7 MB are referenced by nothing** in `src/` or `public/` (matched by basename, so template-literal paths are counted as referenced). Only 98.9 MB is live. CRA copies `public/` wholesale, so all of it deploys.

Most are exact duplicates — `public/images/work/<slug>/x.png` and `public/assets/portfolio-safe/<slug>/x.png` are byte-identical in 69 cases, and often *neither* copy is referenced. The largest single unreferenced file is 10.3 MB, twice.

I have not deleted anything: 205 asset files is not my call. `public/` is fully git-tracked, so this is recoverable. If you want it:

```bash
cd ~/"Ryan's Folder/Claude/portfolio-site" && git rm -r --cached public/assets/portfolio-safe && echo "review 'git status' before committing"
```

Better first step: tell me whether `assets/portfolio-safe/` is an archive you keep deliberately. If it is, it should move out of `public/` rather than be deleted — it is only a problem because `public/` means "ship this".

### [?] Q2 · The metrics gate — deliberate, or an accident of `stream`?
`CaseStudyPage.tsx` locks on `stream === 'professional'` and swaps out the entire outcome block and metrics grid. A cold visitor from LinkedIn sees title, thesis, summary, Problem, then a password wall — while the homepage card for the same project shows its metrics in the open. If a metric is safe on the card it is safe in the outcome block. Proposed: ungate `metrics` and `outcomeNote`, keep gating imagery and process detail. This changes the protection posture, so it is yours.

### [?] Q3 · `ownership` — revive as a structured field, or delete?
Declared at `projects.ts:119`, populated 0/11. The dead layout that referenced it is now gone, so the field is inert. Revive it as a "what I owned / what was given" block (costs authoring across 11 studies — two audits called this the biggest process-clarity gap), or delete the field and keep attribution in prose.

### [?] Q4 · The hero `<h1>` — how far to go?
The `<h1>` is visually hidden and reads as four subject-less aphorisms; the actual positioning is a 12px eyebrow. (a) real claim in the `<h1>`; (b) plus cut the intro to ≤3s with the final phrase as initial render; (c) plus move Work above the 330-word About. The craft audit's view is that (c) is the highest-leverage change on the site, and the most entangled with taste.

### [?] Q5 · Tailwind — remove it?
`src/index.css` holds the `@tailwind` directives and is never imported; `tailwind.config.js` sits alongside it. The two dead utility classes in `App.tsx` are already gone. It is a third token system with zero live effect. Recommend removing both files.

---

## Open — ready, no decision needed

- [ ] **React #418 on all 27 prerendered routes.** Diagnosed but not fixed. The prerendered `#root` is byte-identical to the client's settled tree, so the mismatch is **transient** — something differs on the *first* client render and converges after effects. Ruled out: lazy-route chunks (made `SitemapPage` eager, error persisted) and the unlock chrome (gated behind a post-mount flag, error persisted). Cost is a wasted hydration and a full client re-render per page; nothing is visibly broken and CLS stays good. Pinning it needs a development-React build served against the prerendered HTML, which prints the offending node.
- [ ] **Deploy config must not blanket-rewrite to `/index.html`.** Not a code bug, but it silently voids all 27 prerendered pages — `npx serve -s build` does exactly this, and every route served the homepage until I dropped `-s`. If the host rewrites everything to `index.html`, crawlers get the homepage for every URL. Fallback must apply only to paths with no prerendered file.
- [ ] **54 of 55 homepage `<img>` ship without `loading="lazy"`** (measured at runtime). Independent of the dimensions question below.
- [ ] `landing-pages` — move 2 of 3 `outcomeGridImages` into Approach; add the missing `build` subsection. The one case where imagery pads a result.
- [ ] Add `jest-axe` to the `@testing-library` setup now that the suite actually runs, plus a Lighthouse a11y budget in the deploy workflow.
- [ ] `MIGRATION.md` is stale (missing manifest + script, stale inventory).
- [~] `outcomeNote` → `string[]` rendered as a list. All 9 exceed 400 chars, longest 824. **Scope call:** mechanical split, or a rewrite pass per study?
- [~] PlayDraft's five approach descriptions (731–954 chars each) — same question.

---

## Withdrawn after measurement

- **[✗] "Add `width`/`height` to 27 `<img>`."** Measured CLS is **0.031 — GOOD** (threshold 0.1) on `/`, `/work/loopstack/`, `/notes/`, `/resume/`. Not one image contributes a shift; containers already reserve space via `aspect-ratio`. The only layout shift on any route was the unlock bar. Adding attributes to responsive images whose intrinsic sizes vary would risk making it worse for no measured gain.
- **[✗] "Drop the two `infinite` hero drifts."** The reduced-motion floor now caps every animation at one iteration for visitors who ask for it. For everyone else this is a taste decision about the hero, not a defect — it belongs with Q4, not in a bug list.
- **[✗] Banner landmark via a `<header>` wrapper.** Each page's primary nav is `sticky` (or `fixed` on home). Wrapping a sticky element in a header box caps its sticky range to that box's height and kills the behaviour. The nav landmark and skip link both survive; `banner` is a best-practice landmark, not a WCAG conformance requirement. Documented in `PageShell.tsx`.
- **[✗] "Under-illustration."** Per-section image counts are ceilings, not quotas. 0 images in a Problem section is not a defect; 46/46 captioned is restraint working. Only the `landing-pages` inversion survives.
- **[✗] Off-scale value sweep (521 instances).** Most are honest gaps in the scale. `_layers-panel.scss`'s off-palette hex are a deliberate Figma-UI simulation and want a documented sub-palette, not a find-and-replace.
- **[✗] Focus rings and the mobile nav.** Runtime pass cleared both: all six sampled controls return `solid 2px rgb(240,61,1)` at 2px offset, the first 14 tab stops match `:focus-visible` with no trap, and the mobile menu toggles `aria-expanded`, closes on Escape, and restores focus.

---

## Still needs a human

Screen-reader announcement order and real zoom behaviour need a person with assistive technology, not another agent. The announcements added above are verified as *present and correct in the DOM*; whether they land well in VoiceOver is a listening test.
