# Binder specimen: twelve studies, one binder

19 October 2026. Fable's pass in the Astra → Fable → Opus sequence for the collectible binder. The first pass proved one PlayDraft card in one sleeve. This pass puts all twelve case studies in the binder, each carrying the hero art Ryan chose. Exploration only: nothing here touches `src/`, the published order, project facts, or the live site.

Brief and review criteria: `~/Ryan's Folder/Claude/portfolio-site/todo/astra-exploration/`. Hero art: `plans/new/CardConceptHeros/Ryan_DeBoer_Case_Study_Preview_Graphics_Final/` (untracked).

## Run it

From the repo root:

```bash
node docs/explorations/binder-specimen/build-cards.mjs
```

```bash
python3 -m http.server 3100 --bind 127.0.0.1
```

Then open <http://127.0.0.1:3100/docs/explorations/binder-specimen/>. The `.claude/launch.json` entry `binder-specimen` runs the same server. Back-face captures load from `public/`, so serve the repo root, not this folder.

`build-cards.mjs` reads `src/data/projects.ts` and the hero manifest, writes `cards.js`, and copies the 1280×800 WebP heroes into `heroes/`. In a worktree without `plans/new`, pass the hero folder as the first argument. `capture.mjs` clears `captures/` and renders every still with the repo's Playwright while the server runs.

## What stays out of git

`heroes/`, `captures/` and `reference.jpg` are ignored on purpose. The repository is public, the hero package marks its art as private review drafts, and five of the locked heroes show Tire Rack branding. The two scripts regenerate the first two on this machine. The first commit on this branch still holds `reference.jpg` and the first pass's PlayDraft stills, so squash or drop that commit before any push if they should stay private.

## What the page is

A gray binder page in work order: six pockets per page on desktop, four on a tablet, three on a phone, with a plain pager under it. Every pocket has the same four layers, back to front: the backing well, the card's shadow, the card, the sleeve. Light is two numbers on the stage, set by the pointer or a slow idle drift, and every sleeve, foil ring and light path reads them. The hero is a plain image in the art window; nothing optical is baked into it.

- **Public cards** lift behind the plastic, come forward over a scrim, turn to a back, and return to their own slot. A toolbar holds Turn over and Back in the sleeve. Focus moves to Turn over on the way out and back to the card on the way in. The rest of the page is inert while a card is in hand.
- **Locked cards** show a lock on the art window and have no back in the page at all. Selecting one opens a password stand-in, the card nudges in its sleeve, and it stays put. The stand-in checks nothing; real gating is the Opus pass.
- **The bench panel** picks a card, drives the sequence, holds paused frames for matched stills, and toggles the proofs: hide the sleeves, explode the layers, fix the light, force reduced motion.

## Where each card's content comes from

Everything comes from `src/data/projects.ts` through `build-cards.mjs`, except which real capture sits on each public back.

| Face | Element | Source |
|---|---|---|
| Front | index | position in `orderedProjects()`, i.e. `WORK_ORDER` |
| Front | title and subtitle | `cardTitleFor()`, split at the colon |
| Front | type badge | first of `groups`: product, systems or AEM; Heatherwood has none and shows a globe |
| Front | hero | the manifest's `web/` WebP; alt text from the manifest, with "Tire Rack" removed on locked cards |
| Front | lock | `stream === 'professional'`, the same rule the homepage uses |
| Front | rows | `metrics[0..2]`; the label splits at " · ", ":" or a closing parenthesis |
| Front | footer | `yearSpanFor()` and `overview.category` |
| Back | thesis, overview, meta | `thesis`, `context`, `overview.role`, `overview.status`, the first three `tools` |
| Back | What held | up to three of: `annotations.outcome`, `metrics[3]`, each takeaway's first sentence, the first sentence of `overview.outcome`, then of `summary` |
| Back | link | the live study at `/work/<slug>/` |

| Public back | Capture | Fit |
|---|---|---|
| PlayDraft | `playdraft/progression/screenshots/10-draft-recap.png` | crop on the Draft complete card |
| LoopStack | `loopstack/04_fix_log.png` | top of the screen |
| Bolus Binder | `bolus-binder/app/04-recipe-detail-hero.png` | top of the screen |
| Overscroll Tactics | `overscroll-tactics/board-complete.png` | centred on the finished board; the study has no phone capture |
| Heatherwood | `heatherwood/supporting/outcome/heatherwood-final-mobile-01.png` | the Event Hosting card, about 40 percent down |

Not on any card: HP, attack values, months, or numbers the study does not state.

## The hero package, as received

- **Two native PNGs do not match their web copies.** AEM Component System and Seasonal content differ between `artwork/` and `web/`. The AEM PNG is the older stress-test composition on a purple neon ground. In both cases the web copy matches the review sheets Ryan approved, so the specimen uses `web/`. Anyone integrating from `artwork/` would ship the wrong two.
- **Two files the handoff names are not in the folder.** `generation-records.json` is missing. The version-1 PNGs for Bolus Binder and Heatherwood are not in `artwork/`, though they still exist in the Codex outputs folder the manifest points to.
- Every other path in `manifest.json` and `prompts.json` resolves.

## Captures

All in `captures/`, JPEG at 2x (phone 3x), light fixed so frames match.

- `desktop-page-1`, `desktop-page-2`, `tablet-page-1`, `phone-page-1`, `phone-page-4`: the binder at each size.
- `card-01-wheelrack` through `card-12-heatherwood`: every card at slot size.
- `desktop-proof-no-sleeve`, `desktop-proof-exploded`: the plastic removed, and the layers separated.
- `desktop-pose-partly`, `-clear`, `-edge`, `-back`, `-returning`: paused frames on PlayDraft.
- `desktop-live-out-front`, `-out-back`, `-mid-turn`, `-returning`, `-seated-again`: the live sequence on PlayDraft.
- `desktop-back-loopstack`, `-bolus-binder`, `-overscroll-tactics`, `-heatherwood`: every other public back.
- `desktop-locked-challenge`: WheelRack's stand-in, with the card still seated.
- `phone-live-out-front`, `phone-live-out-back`: touch, 390px.
- `desktop-reduced-motion-out`, `-back`: no transitions, driven from the keyboard.

The capture script also checks behaviour and prints it: focus lands on Turn over after a pull and on the card after a return, a locked card never leaves its sleeve, and focus returns to it when the stand-in closes.

## What holds

1. Twelve real cards read as one collection, and every hero is legible at slot size, about 320px wide on desktop.
2. Art windows sit level across a row. Every header is the same height: a one-line title over its subtitle, or a title alone on up to two lines.
3. Rows share the space down to the footer, as the reference's do. Long values wrap between words, never inside "4–5/day".
4. The materials did not change with the art. Sleeve, foil and light still answer the pointer over every hero, light or dark.
5. Locked cards leak nothing a visitor could not already see. Their backs are absent from the page, not hidden.

## Decisions still open

| # | Decision | Why it matters | Owner |
|---|---|---|---|
| 1 | Publish the heroes | AI-generated; small text, charts and logos can differ from the real screens. The package marks them private drafts. | Ryan |
| 2 | Tire Rack branding on locked fronts | Five heroes show it and the AEM hero shows the headquarters. The site anonymizes the client while a study is locked. | Ryan |
| 3 | Uneven values | Real metrics replace the reference's numbers, so values range from "4" to "React Native + Expo". | Astra |
| 4 | Locked backs | Need real access control before any protected copy exists in a page. | Opus, running now |
| 5 | Collection navigation | The pager is a placeholder. | Ryan |
| 6 | Foil saturation and the edge-on still | Pastel foil and a painted 3px edge, unchanged from the first pass. | Ryan and Astra |

## Notes for Opus

- The cards are data, not markup. `cards.js` is the content model this page needs; a real `cardHero` field on each project, with alt text and a lock-aware public flag, would replace the manifest lookup.
- The materials are CSS transitions on custom properties plus about 250 lines of sequencing. No library.
- Motion variables live on the pocket so the card and its shadow read the same values. The card's travel and its turn sit on different elements, so each keeps its own clock.
- The free card stays a child of its pocket, offset by a delta measured from the pocket, which never moves. The active pocket lifts above the scrim, so the binder must not create a stacking context.
- `--cw` is set once on the grid from the first visible pocket, and every card scales its type from it.
- While a card is out, the header, pager, panel, notes and other pockets are `inert`, and the page stops scrolling. Paused frames skip both, so a reviewer can keep using the panel.
- The shadow thins with `scaleX(abs(cos(var(--ry))))`, which needs Chrome 120+, Safari 15.4+ or Firefox 118+.

## Not done here

No real password check, no protected backs, no access enforcement, no Author/Publisher mode work, and no integration into `CaseStudyPlayground`. The Opus pass covers the first and last of those on its own branch.
