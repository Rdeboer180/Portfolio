# Drawer and case-study validation — 2026-10-03

## Verified changes

- Native reading drawer remains mounted across article/project switches. Enter 250ms and exit 200ms, cubic-bezier(.32,.72,0,1); reduced motion exits immediately. A guarded completion callback and fallback prevent duplicate or stuck navigation.
- Header is outside the article scroller. Close target is at least 88×48px. Password overlay remains outside the scroller and inside the modal.
- Nine existing homepage preview videos are reused unchanged, silent and looping, with controls, visibility pause, and reduced-motion support. The three studies without card videos retain their existing media rather than introducing substitute videos.
- WheelRack's full library tour is immediately below its preview. Its 16 display crops come from the exact original pixel windows, with regeneration scripts and source hashes. Decoded source-pixel estimate fell from 622.1 MB to 37.9 MB, excluding GPU overhead. Original assets remain intact.
- Six overview crop files avoid decoding entire evidence boards. AEM hero and teaser crops remove surrounding blank page area; links still open original files.
- Reading errors are contained below the header with retry and exit available.
- Systems diagram geometry updates are deferred out of ResizeObserver delivery and unchanged SVG paths are not rewritten.

## Evidence

- 12 studies × Chromium/WebKit × 390px/1440px: expected drawer width, preview source/playback/loop boundary, image fit, pinned header, and single-action dismissal passed.
- All 12 studies: all displayed images loaded; no media request failures.
- 16 article routes at 390px: rendering, horizontal fit, and dismissal passed.
- Both browser engines, reduced/normal motion: persistent drawer across article navigation, source title restoration, touch close, password Escape isolation, and repeated dismissal passed.
- WheelRack natural completion, replay, final chapter, and exit passed in Chromium and WebKit.
- Error-event regression sweep: all 12 studies in both engines, resizing through 390/768/1440px, scrolling, and closing; no window errors, unhandled rejections, or development error overlay.
- 26 focused tests passed, covering controlled/gated study media, tour finish/replay, resize callback batching/cleanup, and reading-error recovery. TypeScript, scoped lint, and diff checks passed.

## Provenance audit

Compared compact selections with commit 0a73424, before the compact study migration. Thirty image references came directly from the prior project definitions. Two PlayDraft captures (results ceremony and live draft room) were existing assets selected in the previously reviewed compact edition; both existed before that migration. No original image/video files were replaced. All nine card video sources match.

## Limits

The exact user-reported playback crash was not reproduced. A development ResizeObserver error overlay was observed during visual review and the synchronous geometry callbacks were corrected. Tour memory reduction addresses an additional concrete browser resource risk; it is not proof of the original failure's cause. Mobile verification uses browser touch emulation and WebKit, not a physical iPhone. AEM originals are 428px wide; the crops improve composition without claiming additional source resolution.
