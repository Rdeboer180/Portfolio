# PlayDraft case-study asset manifest

Page: `/work/playdraft/` · Data: `src/data/projects.ts` (slug `playdraft`) · Updated 2026-10-15

All files here are **web-ready copies**. Source originals live untouched in the
PlayDraft repo (`~/Ryan's Folder/Claude/PlayDraft`) at the paths noted below.

## Current case-study media (2026-10-15)

| File | Source original | Notes |
|---|---|---|
| `v2/playdraft-v2-walkthrough.mp4` | `demo-reel/v2-review/playdraft-v2-tutorial-act-v5.mp4` | **Case-study hero and homepage card loop.** The newest horizontal intro cut (v5, 1920×1080, 33 s), byte-identical to the review master. The room uses the earlier prototype and the lineups are sample data, as the caption says. |
| `v2/playdraft-v2-walkthrough.vtt` | `demo-reel/v2-review/act-captions.vtt` | v5 captions, including the "Send the full image, or every pick as text" cue. |
| `v2/playdraft-v2-walkthrough-poster.jpg` | v5 at 1.4 s | The "Pick a pack" chapter frame, the same moment as the earlier poster. |
| `progression/screenshots/01-home.png`, `02-packs.png`, `04-new-draft-setup.png`, `06-join-invite.png` | Simulator screenshots, 2026-10-14 | Decisions 01–03. Three-account staging test (Tester accounts, staging server, iPhone 17 / 17e simulators). |
| `progression/loops/room-fills-countdown.mp4` (+ `-poster.jpg`) | Same cut as `progression/gifs/06-room-fills-countdown.gif` | Decision 01 loop: last seat fills, PLAY · DRAFT · WIN, countdown. Silent H.264 via `LoopVideo`, so reduced motion shows the poster. |
| `progression/loops/recap-and-pick-order.mp4` (+ `-poster.jpg`) | Same cut as `progression/gifs/10-recap-and-pick-order.gif` | Behind the work, "I changed how a draft ends": last pick, recap, pick order. |

The rest of `progression/` (all ten screenshots, ten GIFs and its README) is the
portfolio asset set from the same test; only the files above are on the page.
Custom saving and the identity specimen keep their `v2/` native-preview captures.

## Video

| File | Source original | Notes |
|---|---|---|
| `playdraft-howtoplay-reel.mp4` | PlayDraft demo reel | 89-second narrated product reel from the original release. No longer the hero (superseded by the v2 walkthrough above); kept on disk. |
| `playdraft-howtoplay-poster.jpg` | PlayDraft demo reel poster | Poster frame shown before the hero reel plays. |
| `playdraft-draft-flow-demo.mp4` / `playdraft-voting-flow-demo.mp4` | earlier prototype clips | Legacy May-era clips. Retired from the page (superseded by the reel) but kept on disk. |

## Product screens (from raw simulator footage, `demo-reel/raw/`)

| File | Source | Shows |
|---|---|---|
| `playdraft-home-draft-leagues.png` | sim capture 2026-07-18 | Home (current): level/wallet header, Draft Leagues carousel, live-drafts row, stat tiles |
| `playdraft-home-goat-bundle.png` | root screenshot 2026-06-28 | Home (earlier state): featured GOAT bundle — superseded on page |
| `playdraft-packs-browse.png` | `beat2.mp4` @0:08 | Packs grid, filter tiles, favorites |
| `playdraft-packs-lobby.png` | sim capture 2026-07-18 | Pack lobby: full All Packs grid (Custom Draft, Fast Food, GOAT, Ice Cream, Movies, Musical Artists shields) — used in the cover |
| `playdraft-draft-room-live.png` | `pickcard-pizza.mp4` @0:30 | Live snake draft board, pick clock, browse sheet |
| `playdraft-draft-search.png` | `beat2.mp4` @1:10 | In-draft search ("lay" → every Lay's flavor) |
| `playdraft-custom-draft-writein.png` | `beat1.mp4` @1:00 | Custom Draft write-in pick landing on the board |
| `playdraft-results-ceremony.png` | `sharecap-cer.mp4` @0:22 | Winner ceremony: crown, winning board, XP |
| `playdraft-league-create.png` | `league.mp4` @0:08 | League creation (exported, not currently on page) |
| `playdraft-share-card.jpg` | `demo-reel/raw/export-card-winner.png` (2026-07-18 redesign) | Real exported ShareBoardCard — champion banner + 2-column challenger grid (Ryan-approved layout), 3× captureRef output |

## Brand & system boards

| File | Source | Shows |
|---|---|---|
| `playdraft-brand-draftpack-era.jpg` | `concepts/newIdeas.png` (2026-04-25) | "DraftPack" wolf-mark icon variants — the pre-pivot identity |
| `playdraft-brand-icon-explorations.jpg` | `concepts/final options.png` (2026-04-26) | PlayDraft icon color variations tested at small sizes vs competitors |
| `playdraft-brand-sheet.jpg` | `playDraftLogos/earlyConcepts/…png` | PlayDraft brand rationale one-pager (D + play cut + bolt) |
| `playdraft-design-system-v01-board.png` | `playDraftLogos/playDraft Design System.pdf` | v0.1 design-system one-pager sliced into a 3-column contact sheet |
| `playdraft-avatar-emblems.png` | `assets/profile_emblems/*.svg` (8 of 16) | Illustrated avatar emblem set (grayscale base, tinted in-app) |
| `playdraft-pack-shields.png` | `assets/icons/pack_icons/WebP/*` (10 of 20) | Pack shield artwork on navy |
| `playdraft-cover-v2.png` | composite (rebuilt 2026-07-18) | Homepage card thumbnail: wordmark + four top-aligned screens — current home / pack lobby / draft room / ceremony. No longer the case-study hero. |

## May-era boards still in use (unchanged)

`playdraft-token-reference-v02.png` (removed from page 2026-07-18, kept on disk),
`playdraft-component-primitives.png`,
`playdraft-status-navigation-system.png`, `playdraft-core-app-flows-overview.png`,
`playdraft-icon-pack-system.png`, `playdraft-app-icon-mark.png`,
`playdraft-login-onboarding-exploration.png`, `playdraft-mascot.png`,
`playdraft-draft-hub-screen.png` (early hub — now historical evidence).

## Figma captures

1. `playdraft-figma-product-screens.png` — ✅ FILLED 2026-07-18 (Ryan's working-canvas
   capture: screens, GOAT Bundle iterations, testing observations, avatar rarity tiers)
2. `playdraft-figma-pack-icons.png` — placeholder REMOVED from the page (Ryan, 2026-07-18);
   file kept on disk if ever wanted
3. `playdraft-figma-avatar-explorations.png` — exported placeholder, not on page

Export at ≥1600px wide, JPG/PNG. Same filename = zero code changes.
