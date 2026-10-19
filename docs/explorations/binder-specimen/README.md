# Binder specimen: one pocket, one card, three materials

19 October 2026. Fable's pass in the Astra → Fable → Opus sequence for the collectible binder. Exploration only. Nothing here touches `src/`, the published order, project facts, or the live site.

Brief and review criteria: `~/Ryan's Folder/Claude/portfolio-site/todo/astra-exploration/` (README, hero-art and binder-fidelity tracks). Approved visual target: `reference.jpg` in this folder, a copy of `APPROVED_RDB_BINDER_REFERENCE.jpg`.

## Run it

```bash
python3 -m http.server 3100 --bind 127.0.0.1
```

from the repo root, then open <http://127.0.0.1:3100/docs/explorations/binder-specimen/>. The `.claude/launch.json` entry `binder-specimen` does the same. Image paths are relative to `public/`, so the page needs the repo root served, not this folder alone.

Stills: `node docs/explorations/binder-specimen/capture.mjs` rewrites `captures/` with the server running. It uses the repo's Playwright.

## What the page is

A single filled pocket between two empty sleeves on a gray binder page, with PlayDraft as the card. PlayDraft was the hero track's recommendation for the first proof: public UI, dark artwork under clear plastic, no employer imagery.

Layers in every pocket, back to front: the backing well, the card's shadow, the card, the sleeve. Light is two numbers on the stage (`--lx`, `--ly`, 0..1) set by the pointer or a slow idle drift. The sleeve's specular, the card's foil ring and the face's light path all read them, so one pointer move answers on every material.

The sequence: click or Enter lifts the card straight up behind the plastic (the part still in the mouth stays glossed, the part above goes crisp), then once clear it comes forward, scales toward the viewer and the page recedes behind a scrim. Space or T turns it on a 3D axis with a painted edge; Escape, the Return button or the scrim bring it back above the mouth and down into the slot. Focus follows: the Turn button after the pull, the card after the return.

Panel controls give paused frames (seated, partly out, clear, edge-on, back, returning) with transitions off, for matched stills, and two proof toggles: hide the sleeve, and explode the layers.

## What is on the card, and where it comes from

Every string is from `src/data/projects.ts`, slug `playdraft`, as of this branch.

| Face | Element | Source |
|---|---|---|
| Front | `02` | position in `WORK_ORDER` |
| Front | PlayDraft / A social drafting game | `cardTitle` split at the colon |
| Front | app-icon roundel | `public/images/work/playdraft/playdraft-app-icon-mark.png` |
| Front | artwork, left pane | `v2/playdraft-v2-home-turn.png`, crop x 60..850 centred on y 760 (the turn card: Your turn, Recess Games, players, Make your pick) |
| Front | artwork, right pane | `v2/playdraft-v2-packs.png`, crop x 60..580, y 1220..1820 (the Candy shield). The fixture footer in that capture is outside the crop. |
| Front | three rows | `metrics[0..2]`: Launched · 4 destinations · 2 clock choices |
| Front | footer | `year` (2026) and the stream label (iOS · Personal product) |
| Back | overview | `context` |
| Back | role / stack / status | `overview.role`, `tools` (Expo / React Native, Supabase), `overview.status` |
| Back | three outcomes | `annotations.outcome`, `takeaways[0]`, `takeaways[1]` |
| Back | capture | `progression/screenshots/10-draft-recap.png`, the Draft complete card |
| Back | link | `/work/playdraft/` (absolute to the live site in the prototype) |

Not on the card: HP, attack values, a month, a lock (PlayDraft is a personal product and is public).

## Captures

All in `captures/`, JPEG at 2x (phone 3x), light fixed at 0.32, 0.22 so frames match.

- `desktop-seated`, `desktop-card-closeup`, `desktop-empty-sleeve-closeup`: rest state and the two materials alone.
- `desktop-pose-partly`, `-clear`, `-edge`, `-back`, `-returning`: the paused frames Astra asked for.
- `desktop-proof-no-sleeve`, `desktop-proof-exploded`: the plastic removed, and the three layers separated.
- `desktop-live-out-front`, `-out-back`, `-mid-turn`, `-returning`, `-seated-again`: the real sequence at rest after each step.
- `phone-seated`, `phone-live-out-front`, `phone-live-out-back`, `phone-seated-again`: 390px, touch.
- `desktop-reduced-motion-out`, `-back`: the same states with no transitions, driven by keyboard.

## What I think holds

1. The pocket reads as plastic in front of the card. The empty sleeves prove it: without a card the plastic alone shows the backing, with its weld, lip, wrinkles and a highlight that moves.
2. The card leaves its own slot. The partly-out frame shows the gloss boundary at the mouth, with neighbouring pockets unmoved.
3. Foil stays at the edges. A pale prismatic ring plus one moving light path. The face is silver, the type is dark, and the artwork is legible under it at the desktop slot size (about 300px wide).
4. The back is a second face, not the thumbnail again.
5. Phone keeps the desktop card proportions, because at 390px the card is wider than it is in the desktop page. Nothing had to be cut.

## Where it differs from the reference, and who decides

| # | Difference | Why | Owner |
|---|---|---|---|
| 1 | Foil is pastel, not a saturated rainbow | Keeps the artwork readable at slot size | Ryan, taste call |
| 2 | No HP or attack numbers; the right column is Launched / 4 / 2 | The reference's numbers are invented | Astra: is the uneven column acceptable, or do the rows need another shape |
| 3 | Footer is the year only | The study records 2026, no month | none, fact |
| 4 | Artwork is two panes (turn state + Candy shield) | Hero track's recommendation; not an approved composition | Astra / Ryan |
| 5 | Mobile card keeps desktop proportions | Larger than the desktop slot, nothing lost | Opus to confirm in the real three-card stack |
| 6 | No lock, no password challenge, no filters, no routing | Opus's half of the sequence | Opus |
| 7 | Edge-on is a 3px painted edge | Reads at speed, thin in a paused still | Astra: worth a thicker edge? |
| 8 | Binder page is one row of three, not 3 × 2 | Single-specimen proof by design | later, with the collection decision |

## Notes for Opus

- The whole thing is CSS transitions on custom properties plus about 150 lines of sequencing. No library. framer-motion could own the sequencing in the app if that is easier; the material layers are plain CSS either way.
- The motion variables (`--lift`, `--fx`, `--fy`, `--fs`, `--ry`) live on the pocket so the card and its shadow read the same values. The card's 2D travel and its 3D turn are on different elements (`.card` and `.card__body`) so each can transition on its own clock.
- The free card is still a child of its pocket, positioned by a FLIP-style delta measured at the moment it clears the mouth. The active pocket's `z-index` lifts above the scrim and the neighbouring pockets. The binder must not create a stacking context (no `isolation`) for that to work.
- The shadow thins with `scaleX(abs(cos(var(--ry))))` during the turn. `abs()` and `cos()` need Chrome 120+, Safari 15.4+, Firefox 118+; fall back to a constant if that matters.
- `prefers-reduced-motion` and the forced toggle remove every transition. States still change, the light holds still, nothing is withheld.
- Type on the card scales from the pocket width via `--cw`, set by a ResizeObserver. Container queries would do the same but create a stacking context on the pocket, which conflicts with the point above.
- Two real screenshots are cropped by CSS positioning, not re-exported. If the final artwork export dimensions are settled later, swap in the export and drop the crop numbers.

## Not done here

No password gate, no protected back, no access enforcement, no grid or page accounting, no Author/Publisher mode work, no integration into `CaseStudyPlayground`. Those are the binder-fidelity track's Opus experiments, and the first of them (real content withholding before authorization) is the blocker for any employer card's back.
