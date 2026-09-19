# WheelRack update and remaining evidence

## Implemented

The page now has one context section, five decision subsections, and an outcome. Ownership appears in the opening. Selected views from four supplied boards support the copy; originals remain available in the existing lightbox. A keyboard-accessible, user-controlled comparison shows front/rear, quote, and unavailable configurations without autoplay. Cheryl’s existing testimonial supports the collaboration section. Launch language is separate from the ongoing-notes footer.

The original screenshots remain intact. CSS frames the selected regions, with source dimensions reserved to ensure correct lazy loading. The current boards are large; direct individual frame exports would reduce memory and transfer costs further.

## Copy review

Applied the available Ryan taste guidance and the repository humanizer skill. Draft review caught repeated context, generic lesson framing, and an unnecessarily defensive documentation caption. Final copy uses specific artifacts and decisions, preserves Cheryl’s React ownership, keeps the 40+ hour reconciliation cost, and qualifies partner growth. No em or en dashes were added to WheelRack’s copy. The testimonial remains verbatim from the existing site.

New documentation captures are described as library references, without claiming an original-delivery date. The original Tokens Studio timeline remains. Confirmation of whether the documentation was updated recently is still useful.

## Highest-value additions

1. **Actual product recording, 15 to 25 seconds.** Select a vehicle, change a finish or size, then show the purchase options updating. Capture the real prototype or live product at 1440px or wider, without browser chrome. MP4/WebM plus a strong still poster. Place near the opening.
2. **One implementation correction, two matched screenshots.** Show the same Figma component and React build before/after a real correction, with one sentence about the issue and decision. Place beside the reconciliation paragraph.
3. **Tablet capture, ideally with filters open.** Show the dealer task on its stated primary device. Capture portrait and landscape if the difference matters. Include the purchasing controls and use the actual breakpoint.
4. **Two partner views of the same component.** Show what remains shared and what changes: theme, type, cart, or quote behavior. Same viewport and state so comparison is meaningful.
5. **Individual frame exports.** Export the three compared component states, form-state matrix, and filter-state strip directly at 2x. These can replace the large full-board PNGs while preserving the same presentation.
6. **Optional documentation walkthrough, 10 to 15 seconds.** Show one component property change, then its usage guidance. Date the current documentation if it was revised after the original delivery.

Avoid adding more complete token boards or decorative device mockups. A real tablet-in-use photo is worthwhile only if it documents the dealer context and adds information beyond the screen capture.

## Asset mapping

See `wheelrack-assets.json`. The four source copies are in `public/images/work/wheelrack/evidence/`. Crop coordinates and captions live alongside the case-study content in `src/data/projects.ts`.


## Component library tour

Replaced the vehicle-selection wireframe with a 28-second camera tour of 16 original artifact windows. The first input view holds for about five seconds. Controls, filters, purchasing, and unavailable states follow. The final third introduces responsive screens and foundations more quickly, then holds the full library overview.

Six chapter buttons offer manual still views. Pause, play, and replay are available. Playback waits for images and pauses offscreen or in a hidden tab. Reduced motion presents the overview without autoplay and keeps chapter navigation. SVG windows clip the actual source images; no component UI was recreated. The tour remains inside the existing case-study gate.

Taste and humanizer review: kept annotations specific to the visible controls, removed the generic “each state has a place” line, and retained the existing orange handwritten-note treatment. Copy describes design artifacts without claiming that the animation is a recording of the live product.

Validation: desktop and 414px mobile visual checks, timeline and reduced-motion tests, gate regression test, TypeScript, and production prerender. Individual 2x frame exports remain the best next improvement for image decode/memory cost. A real product recording would add behavioral evidence beyond this library presentation.
