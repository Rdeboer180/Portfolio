# Product release announcements

The PlayDraft launch uses the portfolio/editorial mode: Hubot Sans, Inter, ink,
paper, and Signal Orange. Product branding stays in the existing app icon.
Design dials: variance 6, motion 1, density 5, system rigor 8. Release information
is stable and readable immediately; it does not pulse or animate into view.

## Placement and purpose

- **Case-study introduction:** a compact release row makes the shipped outcome
  verifiable before the long narrative. Its link opens the store listing.
- **Case-study close:** an ink culmination panel carries the product's own
  “Draft yours. Settle it.” line, a download action, and a desktop QR code.
- **Homepage card:** the preview's existing status chip announces availability.
  The case-study link and store link are separate siblings, never nested links.
- **Notes:** an explicitly declared `relatedProject` adds a dated product update
  beside relevant writing. Original publication dates and historical milestones
  remain meaningful. Unrelated notes do not carry product promotion. The notes
  index provides one current update rather than repeated badges on every row.

## Behavior and maintenance

All store links and the QR generator read `src/data/playdraft.json`. Regenerate
the static QR with `node scripts/gen-qr.mjs` if the destination changes. Never
infer release availability from a beta link or change the release claim based
on elapsed time alone.

Use clear link labels, a 44px minimum hit area, visible keyboard focus, and a
screen-reader notice for the new tab. The app icon and QR duplicate adjacent
text/actions and have empty alternative text. The QR retains a white quiet
zone and hides at phone widths; the direct download action remains full width.
No motion is needed for these controls, including hover or focus.

This pattern is for a verified, downloadable release. Do not use it for a
prototype, imply App Store endorsement, or add unsupported ratings or adoption
numbers. Preserve normal case-study navigation and protected-project behavior.
