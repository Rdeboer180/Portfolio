# Talent Atlas v2 — working draft

Sources: [shared build brief](https://chatgpt.com/share/6aa8b05f-3d1c-83e9-96a9-ce3b262dc31a), [approved concept image](https://chatgpt.com/s/m_6aa8acfac25081918be54071293bdb46), `PRODUCT.md`, `DESIGN.md`, and existing talent data.

## Intent and visual reference

Use the right-hand concept's spacious, top-down, light atlas, organic territories, circular nodes, thin converging connectors, and quiet hidden landmarks. Add the middle concept's featured ability inspection card above the map. Do not inherit the earlier HTML prototype's rigid dashboard or the previous Ink-panel layout.

Hubot Sans, Inter, Menlo, existing spacing/radii, and orange actions remain portfolio-wide. Blue and sage are an expressly approved exception for Atlas territories; they do not become brand accents elsewhere. `--talent-*-700` is for text/icons, `-500` for diagram lines, `-200` for quiet rings, `-100` for territory fields, and `-surface` for backgrounds. All families are documented on `/design-system/`.

## Confirmed September 14

- Keep the existing 30 skills; add Raster Craft and Vector Design.
- Ryan: Raster Craft 3, Vector Design 5. Preserve all other allocations.
- Raise Ryan's budget 63 → 71 using an explicit eight-point visual-craft credit, recorded separately from years/degree/recent-hours awards.
- Preserve the brief's 30 recipes and add Script Spark (JavaScript + Interaction): 31 abilities, every skill represented.
- Charge = invested recipe points / recipe capacity.
- Rank = weakest ingredient; levels 1–5 are Unlocked, Strengthened, Advanced, Elite, Master.
- All ingredients at least 1 discovers the ability; otherwise at least two invested ingredients create a generic resonance hint. Names/recipes remain masked in visible content and accessible labels until discovered.
- Existing skill gates remain; neither added visual-craft skill is arbitrarily gated behind the other.

## Open decisions / draft assumptions

- Discovery memory: user was asked whether names/recipes stay discovered after points are removed. Pending reply, UI follows the written brief and recomputes visibility. The data model and v6 share format can carry remembered discoveries without preserving an unearned rank.
- Class weighting is a draft: rank × kind weight (stance 1 / combo 2 / finisher 3), plus 0.25 per additional territory and charge × 0.1. Choose the two strongest distinct families; do not disclose undiscovered abilities as provisional classes. Ryan's class is recalculated, not forced to the old pair.
- `Front-End Mastery` is the approved ability name. The description refers to command of the medium; no claim of production application-engineering ownership is added.

## First implementation

Review routes: `/talent-tree/atlas/` and `/talent-tree/atlas/build/`, both noindex. Current production tree routes remain in place until the replacement is reviewed.

The draft includes the map, 32 skill rings, 31 landmarks, top inspector, ingredient links, rank/charge updates, limiting ingredients, class computation, budget/gate enforcement, announcements, reset, and share links. New v6 shares use stable skill ids and preserve credit; v5 links still import. The old console/data remain untouched to keep existing links and tests stable during migration.

Mobile uses a fixed readable map with horizontal/vertical scrolling, territory jump controls, controlled zoom, and a persistent selection action returning to the top inspector. Keyboard users can Tab through nodes or navigate spatially with arrow keys. Numeric investment and hidden-state labels carry meaning independently of color. Motion is one-shot and disabled under Reduce Motion.

## Remaining quality work before replacing the live route

- Rendered desktop/mobile visual inspection against the concept image. Computer-use access was unavailable in this session; source/layout checks are not visual sign-off.
- Refine map geometry, contour shapes, progressive disclosure and dense connector areas after seeing the render.
- Bring discovery/rank-up moments beyond live text feedback into restrained map-local emphasis.
- Decide sticky discovery behavior and retest removals, reset, and share round trips.
- Migrate the existing image export / receipt / compare capabilities before replacing the original build route. They remain available there.
