# 001 — Keep drawer dismissal available and animate its lifecycle

- **Status**: TODO
- **Commit**: af2d03b
- **Severity**: HIGH
- **Category**: Interruptibility; accessibility; physicality
- **Estimated scope**: ProjectPanel.tsx, _project-panel.scss, App.tsx, focused tests

## Problem

`src/components/ProjectPanel.tsx:13` removes the drawer on the same event that requests dismissal:

```tsx
const close = () => location.state?.backgroundLocation ? navigate(-1) : navigate(article ? '/notes' : '/#projects', { replace: true });
```

`src/styles/components/_project-panel.scss:17,56` provides only a non-retargetable entrance:

```scss
animation: projectPanelEnter 360ms cubic-bezier(.22, 1, .36, 1) both;
@keyframes projectPanelEnter { from { transform: translateX(100%); } to { transform: translateX(0); } }
```

The drawer therefore slides in and disappears on exit. Closing during entry cannot produce a continuous reverse transition.

The dialog is the scroll container (`overflow-y: auto`, line 12), with a sticky header (lines 20–23). This couples the principal dismissal affordance to long-content scrolling. At 390px the 95vw drawer leaves only a 19.5px backdrop strip, so backdrop dismissal cannot be the primary mobile affordance. This is a verified architectural weakness, not proof of a Safari sticky-position bug. The existing 44px minimum button height is already correct.

`src/App.tsx` renders `<ProjectPanel key={location.pathname}>`. Reading links deliberately replace the current panel route in `src/hooks/usePanelNavigation.ts`, yet that key remounts the shell on every new article: entrance replays, native modal closes/reopens, body lock is torn down and `dismissPrompt()` runs. Lazy children are already inside Suspense in ProjectPanel, so the header should remain stable during their loading.

## Target

Preserve right edge, 90vw desktop / 95vw at <=850px, shared name/Close chrome, existing routes and protected-work flow. Give the dialog a stable shell and use CSS transitions for transform and backdrop opacity. Use `cubic-bezier(0.32, 0.72, 0, 1)` (drawer curve from audit playbook), 250ms opening and 200ms closing. Motion starts at `translateX(100%)` and opens at `translateX(0)`. Reduced motion removes transforms and completes dismissal immediately; never wait 200ms for invisible motion.

Render header as the first fixed grid row with `position: relative`, `flex-shrink: 0`, `z-index: 20`. Dialog uses `display: grid` only when `[open]`, `grid-template-rows: auto minmax(0, 1fr)`, `overflow: hidden`, height 100dvh. Article uses `min-height: 0; overflow-y: auto; overscroll-behavior: contain`. Keep close minimum 44px and add minimum width 44px, `flex-shrink: 0`, and safe-area top/right padding using `max(existing spacing, env(safe-area-inset-*)))` where needed. Header must remain visible during content scrolling, including browser-bar changes.

Move UnlockChrome into a dedicated ProjectPanel overlay prop/slot outside the article scroller. Preserve its DOM descent from the native dialog to remain in the top layer. Do not put this overlay in an isolated or clipped article stacking context. Remove persistent `transform: translateX(0)` after the opening transition has settled (use `transform: none`) if required to preserve viewport positioning of the password overlay. Verify this explicitly.

## Repo conventions to follow

The native `<dialog>` with `showModal()` provides inert background and existing focus behavior. Retain it. `_project-panel.scss` uses Sass spacing variables from `_variables.scss`; retain those. Existing transition variables are generic shorthand values ($transition-fast/base/slow); avoid changing them globally. Define the exact drawer curve and duration locally as `--panel-ease`, `--panel-enter-duration`, `--panel-exit-duration`.

Keep location state captured at the start of a reading session for returnScroll, returnFocusHref/Class and returnMeta. Existing cleanup restores metadata, scroll and focus only when the route equals backgroundPath; preserve that logic.

## Steps

1. Remove the pathname key from ProjectPanel in App.tsx. Add an explicit overlay slot for UnlockChrome; keep lazy reading routes inside the article Suspense. Route changes update the article without recreating the dialog.
2. In ProjectPanel add `opening/open/closing` state and a synchronous ref guard for closing. Show the modal once, then schedule the open CSS state after initial styles are committed. Cancel pending frames on cleanup. Handle StrictMode effect setup/cleanup without duplicate navigation.
3. Replace close with a single requestClose function shared by button, native cancel and genuine backdrop click. It records the current close destination, starts closing once and navigates only after the dialog's own transform transition ends. Ignore bubbled child transitionend events. Add a 250ms fallback timer for missing transitionend, cancel it on cleanup, and ensure route navigation happens at most once. A reduced-motion preference completes navigation immediately. Native browser Back remains immediate and valid; do not intercept history.
4. Convert CSS keyframes into the transition values in Target. Ensure closing during opening starts from the currently rendered transform. Backdrop fades from opacity 0 to 1 and back over the same phase duration; base backdrop color stays rgba(0,0,0,.24). Keep the native modal open/inert until exit finishes.
5. Apply the stable-shell/article-scroll structure. Update any panel-local sticky rail offsets that assumed the header shares the scroll container: a rail inside article uses top `$spacing-xl`, with available height subtracting header height. Retain article section anchor spacing conservatively; verify anchors don't hide under chrome.
6. On pathname change reset only article scroll to top, then honor a valid hash after lazy content is available. Do not reset body scroll or replay entrance. Preserve the return destination and restore focus only when the reading session exits.
7. Keep the protected prompt above shared chrome, keyboard-trapped, independently dismissible, and responsive to Escape without accidentally closing the whole drawer. Do not add gestures or dependencies.

## Boundaries

Do not change drawer width, project/article content, homepage motion, protected image authorization, or underlying navigation semantics. Do not implement drag-to-dismiss. Do not remove native dialog or existing restoration. If source drift invalidates cited behavior, inspect and report the mismatch before making speculative changes.

## Verification

- **Mechanical:** `npx tsc --noEmit`; `CI=true npm test -- --watchAll=false` with focused lifecycle tests added if absent. Expect no new type errors or test regressions.
- **Focused tests:** mock native showModal/close; repeated close calls navigate once; transitionend on a child cannot complete exit; fallback finishes exit; reduced motion closes immediately; modal remains mounted across article route changes; unmount cancels pending completion; direct-link close uses correct /notes or /#projects fallback.
- **Feel check:** desktop 1440px and mobile 390px/320px; open drawer and dismiss midway through entry, check continuous reversal at 10% animation playback. Open from scrolled homepage, read deep into article and close once, checking original scroll and link focus restoration. Reopen and check no frozen state. Load uncached lazy article and ensure close remains available during loading.
- **Real/mobile browser:** long touch-scroll, momentum scroll then tap Close; portrait/landscape browser bars; close must stay visible and respond to one tap. Verify body does not move behind drawer. Run Chromium plus WebKit automation; real iOS Safari if available. Emulation alone is not proof of real-device behavior.
- **Protected flow:** open password prompt within drawer while scrolled, verify overlay covers header and stays in viewport; Escape closes prompt only; then Close dismisses drawer. Test prompt cancel/unlock and next reading route.
- **Accessibility:** Tab/Shift+Tab cycle correctly; Escape exits once; reduced-motion setting has no translation and no delayed navigation. Focus returns to original trigger. Verify refresh/direct-link fallback paths and browser Back.
- **Done when:** continuous entry/exit, no modal remount on article replacement, invariant visible mobile Close, all close paths return correctly, protected prompt remains usable.
