# 005 · WheelRack cover reel: the deck becomes the product

Status: DONE · Commit: 2b4c1cd · Owner surface: homepage WheelRack card, WheelRack overview walkthrough

## Why
The current reel (25s) and the AEM loop both end on the same move: a canvas that pulls back to show many boards. Seen twice in one card row it reads as a template. The WheelRack story is depth: tokens under controls under patterns under product states, all under one live product. The reel should make that stack physical and short.

## Target (8.0s, 1280x800, 24fps, loops)
Canvas #2c2c2c (shared with the AEM loop). Cards are white, 1px #d6dce4 hairline, 8px radius. One mono label per card, top-left, #4a4a4a. Signal orange (#f03d01) only for the active layer tick and the product outlines.

| Time | Beat | Motion |
| --- | --- | --- |
| 0.00–4.10 | Deck: 16 library cards flip into one fixed card slot, in four layers: Tokens (color, type, spacing, radius) → Controls (inputs, checks, dropdowns, buttons) → Patterns (filters, pricing, front+rear, partner) → Product states (availability, dealer desktop, dealer mobile, empty). | Each new card flips in on X from the top edge, rotateX 75°→0°, 160ms, cubic-bezier(0.23, 1, 0.32, 1). The card it covers drops into the stack: translateY +4px, scale −1.2%, brightness −4% per depth. Holds shorten from 520ms to 120ms (accelerando). Layer rail at left: four rows, the active row turns orange and its count ticks 0→4. |
| 4.10–5.10 | Depth reveal | The stack (16 cards) rotates to rotateX(58°) rotateZ(−32°) over 700ms, cubic-bezier(0.77, 0, 0.175, 1): sixteen sheets read as one solid system. Layer rail holds all four rows lit. |
| 5.10–5.90 | Product lands on top | The live PitStop frame drops onto the top of the stack (translateZ +120 → 0, opacity 0→1), then the whole stack rights itself to face-on over 600ms, same in-out curve, ending with the product filling the slot. |
| 5.90–7.60 | Trace back | Three orange 1.5px outlines draw on the product (filter rail, wheel row, front + rear selector), 180ms apart; each carries the library card name it came from. |
| 7.60–8.00 | Reset | Product dims to the canvas (opacity 1→0, 300ms ease-out); first token card is already in place at frame 0 of the loop, so the seam is a cut to the deck. |

## Rules
- Never animate the canvas or a camera zoom-out. All depth comes from the cards themselves.
- Easing tokens only: ease-out cubic-bezier(0.23, 1, 0.32, 1) for arrivals, in-out cubic-bezier(0.77, 0, 0.175, 1) for the stack rotation. No bounce.
- Sources are the existing tour-samples (public/images/work/wheelrack/tour-samples/01–16.webp) and the live product frame at 21.5s of the original reel. No new imagery.
- Poster: frame at 5.0s (the tilted stack), so a reduced-motion visitor still sees depth.

## Verification
Step through at 0.25x: every flip lands with no overshoot; the stack never clips the frame; outlines sit on the product edges within 2px. Compare the card row on the homepage: WheelRack, PlayDraft, and AEM should read as three different motions.

## Revision (same day)
- Frame is 1280x960 (4:3): locked cards draw the loop behind a plate that fills the 16:10 frame plus the 46px folder notch, about 4:3, so a 16:10 loop lost its sides under object-fit: cover. Content sits in the middle 16:10 band (y 80–880) so 16:10 grid and list tiles crop cleanly.
- The recording starts at t = 6.7 (the product with all three traces), so the poster and first frame are the finished product rather than the paper stack.
- After the traces, the product zooms to fill the 16:10 band (6.55–7.05s) and scrolls down the live page into the results list (6.95–7.75s). The page is stitched from the original reel's product frames (scripts/wheelrack-reel/product-tall.png). The recording now starts at 6.45s, with all three traces drawn.
