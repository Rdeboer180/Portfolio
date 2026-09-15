# Talent Forge — adaptation plan

Status: proposed implementation plan, September 15, 2026. No UI changes made by this plan.

## Direction and authority

Ryan's latest request replaces the Atlas visual direction with the Forge screenshot at `/Users/ryandeboer/Desktop/Screenshot 2026-09-14 at 11.00.11 PM.png`, also represented by the middle panel of `core-ui-elements/patterns/talent-atlas-reference.png`. The screenshot guides composition and hierarchy; its sample names, counts, prerequisites, and completion labels do not override the approved data model.

Apply `/Users/ryandeboer/.agents/skills/ryan-design-taste/SKILL.md`: portfolio typography and paper surfaces, restrained color, purposeful hierarchy, and icons that work in one color before dimensional treatment. Blue, orange, and green identify the three trees. Reserve the richest material treatment for the classification declaration.

The progression hierarchy, confirmed by Ryan, is: **talent allocation → unlocked passive proficiencies → assigned class → advancement within that class**. The class is always present, including before any proficiency unlocks. Proficiencies sit beneath the class and explain why it was assigned. Inspecting a proficiency reveals its talent requirements without requiring map navigation.

## Classification and proficiency model — confirmed clarification

Ryan's subsequent clarification: classes describe mastery within the medium, not job titles or career destinations. Use the [design mastery research](design-mastery-research.md) to evaluate cross-disciplinary capability domains. Its six-domain proposal and candidate names are research recommendations, not approved taxonomy. Do not create Graphic Designer / Web Designer / UX Designer / Product Designer / Systems Designer career tracks.

- Use **Talents** for the 32 investable nodes and **Proficiencies** for the 31 passive abilities in user-facing copy. Existing internal IDs can remain unchanged. Proficiencies are automatically active when earned; they are not equipped, cast, or manually selected to affect classification.
- Always assign one primary class. Before any proficiency unlocks, assign a starter class; proposed working label: **Initiate · Explorer**. The exact class vocabulary remains a naming decision, not an already approved taxonomy.
- Derive specialization from the currently earned proficiencies and their strength. Do not classify directly from raw tree totals or count remembered-but-inactive discoveries as earned proficiencies. When none are active, use the starter class.
- Display advancement separately from class identity. Proposed title ladder: **Initiate → Apprentice → Adept → Expert → Master**. A declaration might read **Adept Systemsmith**. These are naming examples; map the class taxonomy and thresholds explicitly before implementation.
- Calculate class advancement from the proficiencies supporting that class, not total spent points alone. Show which proficiency improvements advance it. Proficiency rank and class advancement are separate measures and must have distinct labels.
- Replace the current two-winning-abilities declaration with an explicit proficiency-to-class mapping. Several proficiencies should support a class; do not simply rename the strongest proficiency as the class. A secondary affinity can be subordinate information if useful, but the primary declaration stays singular.
- Use deterministic tie-breaking and test equal scores. Reallocating points can change class or advancement; browsing a proficiency cannot. Empty builds, reset, and removal of the last active proficiency must all retain a valid classification.

The reusable allocation, recipe, and sharing machinery remains in place. Classification resolution is an intentional logic change required by this clarification, not merely visual polish.

## Preserve the working structure

- Keep all 32 skills, 31 abilities, existing prerequisites, budget enforcement, and allocation normalization.
- Keep Raster Craft 3/5 and Vector Design 5/5 in Ryan's build, with 71 awarded points including the explicit eight-point craft credit.
- Keep Script Spark: JavaScript + Interaction.
- Preserve charge as total investment divided by capacity, and rank as the weakest ingredient. Charge is not an unlock threshold.
- Keep v6 share links and legacy v5 import, intake, reset, announcements, and existing calculation tests.
- Keep ability visibility rules pending the discovery-memory decision below.
- Reuse the territory tokens, typography, five-segment rank rings, and existing functional controls.

Replace the Atlas terrain, authored 1200×2840 coordinates, zoom/pan, simultaneous ability landmarks, and the interaction that sends users back to an offscreen inspector. Do not rewrite the data engine to accommodate a new layout.

## Page composition

1. **Compact page header and always-present class declaration.** Keep navigation and budget secondary. Show advancement title, assigned class, the page's most crafted crest, and a short explanation of the contributing proficiencies. Selecting a recipe does not change this identity; investment can. Preserve the crest's core silhouette across advancement tiers, adding restrained rank details rather than replacing its identity.
2. **Earned proficiencies beneath the class, then a selected proficiency inspector.** Present these as passive strengths supporting the classification. Follow the screenshot's clear title, status, short description, and ingredient strip for inspection. Show proficiency rank and the exact next-rank requirement. Use “4/4 ingredients active” rather than “complete” when all ingredients are present but not mastered. The class declaration and selected proficiency must have explicit, separate labels; the inspector does not displace the class hero.
3. **Three skill lanes.** Blue Design & Systems, orange Technical, green Code. Use aligned circular nodes with adjacent labels and numeric ranks. Default to the selected recipe's relevant skills, including any prerequisite needed to invest. Offer “All skills” to expose all 32 without changing selection. Empty lanes explain that the recipe uses no skills from that tree. Do not draw sequential chains between unrelated skills: only real prerequisites and ingredient relationships receive lines.
4. **Converging recipe diagram.** The selected ingredients feed one subordinate ability medallion beneath the lanes. Keep paths short and behind content; endpoints and labels explain the relationship even without color. Guardrail Architect uses three Design ingredients and one Technical ingredient in the actual model, so its Code lane has no contributing path.
5. **Related abilities and collection.** Show a small set of discovered or safely hinted nearby abilities, then a compact collection with discovered, resonating, and unknown states. Do not put 31 equal-weight landmarks back into the diagram. Undiscovered names and recipes remain masked, including accessible labels; inspecting a mystery gives only the permitted hint.

The screenshot shows far fewer skills than the real model. Focused recipe lanes are the deliberate density adjustment; “All skills” retains a complete build view. On Ryan's read-only page, investment controls are replaced by an invitation to create a build.

## Icon system

| Level | Construction | Role |
| --- | --- | --- |
| Utility | Existing consistent icon family, approximately 16–20px | Navigation and actions |
| Skill | Distinct one-color glyph around 20–24px inside a 44–48px rank control | Legible investment unit |
| Ability | Dedicated symbol in a restrained 48–56px medallion | Recognizable recipe/result |
| Classification | Bespoke 80–96px crest on desktop; composed silhouette, inset mark, controlled rim and depth | Highest craft and identity emphasis |

These sizes are starting points for optical review, not locked specifications. Skills remain round. Abilities can share a simplified hexagonal frame; the classification receives the fully developed version. No generic first-ingredient glyphs for ability identities, and Raster Craft and Vector Design need visibly different symbols.

Build a shared SVG grammar: consistent stroke weight, corner treatment, negative space, and optical scale. Each symbol must remain recognizable in one color and at its actual display size. Explore the five finisher symbols first because they establish the strongest identity language: a protected structural frame for Guardrail Architect, joined modules for Systemsmith, a transformation vessel for Prototype Alchemist, retained layers for System Memory, and an assembled structure for Shipwright. These are exploration prompts, not approved artwork.

Use ink and the brand orange for the premium crest, with blue/green details only where they convey actual class composition. Use blue/orange/green consistently for tree membership; rank and selection must also have numeric or shape cues. Avoid giving every node bevels, glows, gradients, or floating shadows. The classification's polish should come from its symbol and construction before surface effects.

Deliver a contact sheet showing skill, ability, and classification tiers together, with one-color and finished variants at actual sizes. Validate the large crest at small export sizes as well. Use the same identity in the declaration, My Build, and eventual exported card.

## Responsive behavior and states

- Desktop: three parallel lanes and one selected recipe, with the featured card immediately above them.
- Mobile: keep the selected ability and full ingredient summary visible in the reading order; use labeled tree tabs for skill controls. Do not require horizontal map panning or draw paths through hidden panels. Show per-tree ingredient counts so switching tabs does not hide the recipe's scope.
- Preserve selection when changing lane or collection filters. After an investment, update the ring, next requirement, ability rank, and declaration together.
- Distinguish locked prerequisite, uninvested, invested, selected, and mastered states. A locked skill explains its actual prerequisite.
- Provide keyboard-operable selection and spending controls, visible focus, at least 44px targets, text equivalents for diagram relationships, and reduced-motion support.
- Use brief local feedback for rank-up and classification changes. No idle pulsing. Selection alone must not trigger an earned-class celebration.

## Implementation sequence

1. **Define class resolution and build the Forge layout on the existing draft routes.** Document the class taxonomy, proficiency-to-class mapping, advancement thresholds, starter class, and tie rules. Replace the current classification resolver while preserving allocation/recipe/share APIs. Extract reusable selection/build state from `TalentAtlas.tsx`. Add focused components for the proficiency inspector, talent lanes, proficiency collection, and declaration. Leave the legacy `TalentForge.tsx` working during migration. Replace map styling with Forge composition using current tokens.
2. **Prove clarity with real data.** Render Ryan's 71-point build, an empty build, a partly unlocked recipe, and a mastered recipe on desktop and mobile. Check that the selected ability, limiting ingredient, and next action are apparent together. Resolve density before adding decorative finish.
3. **Develop the icon family and hero crest.** Review silhouettes first, then add the classification's premium finish. Implement an explicit icon registry keyed by stable skill/ability IDs. Review the classification beside ordinary ability icons to confirm the intended hierarchy.
4. **Complete interaction and discovery states.** Wire spending, prerequisite explanations, filtering, class changes, keyboard behavior, and announcements. Decide discovery memory before finalizing reset/share behavior.
5. **Restore production feature parity.** Bring image export, receipt, and compare into the new surface before replacing the existing live experience. Ensure the new crest survives exported-card scale.
6. **Validate and release.** Run the relevant engine/component tests and production build; add focused tests for selection versus classification, visibility, and mobile lane behavior. Inspect rendered desktop/mobile screens and keyboard flow against the Forge reference. Then replace the live route and push under the existing implementation authorization.

## Decisions to carry forward

- **Confirmed:** a class is always assigned, with advancement titles or levels. Passive proficiencies determine class; talent allocations unlock those proficiencies. The declaration is the primary identity and the proficiencies appear beneath it.
- **Open product decision:** after an ability has been discovered, should its name and recipe stay known when points are removed? Recommend keeping knowledge while recalculating earned rank; current behavior recomputes visibility. Do not silently change it as part of visual polish.
- **Superseded draft rule:** the current two-ability classification calculation is not the final model. A dedicated class mapping and advancement calculation must replace it. Exact class names and advancement thresholds remain to be designed.

## Acceptance criteria

- A user can identify the selected ability, its ingredients, and the next useful investment without navigating a large canvas.
- Every skill remains reachable; displayed connectors reflect real relationships.
- The three tree colors and portfolio typography read consistently on desktop and mobile.
- Classification is visually the most crafted icon and semantically distinct from selection.
- Every build has a class, including empty/reset builds. Earned passive proficiencies explain specialization and advancement; inactive discoveries do not contribute. Equal scores resolve consistently.
- Real ranks, budgets, visibility, prerequisites, and share links retain their existing correctness.
- The live route is replaced only after the Forge surface has been visually checked and existing export/compare functionality is carried over.

## First Forge implementation — September 15

The approved six mastery domains now have a dedicated resolver in `src/data/talent/mastery.ts`. Each domain has three named facets; the strongest active proficiency in each facet contributes its rank, with a maximum of 15 per domain. Alternatives never stack within a facet. Total strength selects the class, coverage breaks ties, then fixed catalog order. This is an initial transparent game rule, not a validated assessment of professional skill. Shared ingredients across different facets still create correlated support; equal maximum scores do not establish equal investment cost.

The advancement index is the floor of average facet strength, minimum one, capped at Initiate with one active facet and Apprentice with two. Three facets permit Adept/Expert; all three at five are required for Master. No active proficiencies yields Initiate Maker. Current approved Ryan allocation resolves to Adept Formshaper, without forcing a preferred identity.

The review routes now render the Forge instead of the Atlas map. They include the class crest, supporting passives, selected recipe, focused/all talent lanes, mobile tree selection, a six-card collection with expansion, receipt, sharing, export, and domain comparison. Existing recipe IDs, allocations, and link decoding remain intact. Four identity-like proficiency names have presentation aliases so they do not compete with the class declaration.

Discovery visibility still follows the original brief and recalculates when points are removed. No memory policy was silently introduced. The production route remains the legacy experience while this replacement is reviewed; the review route is noindex.


## Allocation and progression revision — September 15

Current Forge rules supersede the earlier draft: professional experience earns four points per year throughout. Ryan's budget is 89 (64 professional + 16 degree + 4 minor + 5 recent practice), with the special eight-point credit removed from his current build. Older shared builds retain their stored allocations and explicit credits while receiving the revised annual budget.

Ryan now invests 84 points with five available. Overrides: Governance 4, Figma 5, Storybook 3, Automation 2, Git 2, AI Tools 4, Agent Context 4, Handoff 4, Prototyping 3, State Modeling 3. Components remain 3, Accessibility 4, Typography 5; all other existing investments are preserved. Automation is independent. Every other prerequisite in the Forge unlocks at two points.

The proficiency collection is now explicitly “Your top proficiencies,” ordered by rank, then recipe progress, then name for deterministic ties. The six strongest active passives appear first; “Show all” exposes the complete catalog in one action, with discovery masking unchanged. No second hidden pagination step.

A 12/12/12 catalog remains a proposal, not an implemented change. Candidate additions: Technical — Systems Mapping and Validation; Code — APIs & Integrations and Testing & Quality. Expansion should add meaningful proficiency routes rather than act as a reason to grant budget. The current catalog remains 32 talents and 31 proficiencies.


## Styling emphasis — September 15

The Forge talent is now labeled CSS/SASS, retaining its stable `css` ID for existing shares and recipes. Ryan's styling allocation is 5/5 and HTML is 3/5, swapping their previous values without changing the 84/89 total. Token Tactics consequently reaches Master and appears among his top proficiencies.

Recommended additions to reach 12 talents per tree (pending selection):
- Technical: Systems Mapping — dependencies, flows, boundaries, and how a product fits together. Proposed passive: Systems Mapping + State Modeling → System Clarity.
- Technical: Validation — testing design assumptions through usability work and prototypes. Proposed passive: Validation + Prototyping → Evidence Loop.
- Code: APIs & Integrations — connecting data and services to interfaces. Proposed passive: APIs & Integrations + TypeScript → Connected Interfaces.
- Code: Testing & Quality — repeatable component and interaction checks in implementation. Proposed passive: Testing & Quality + Storybook → Reliable Components.

Keep Validation distinct from Research (understanding the problem), and Testing & Quality distinct from QA & Analytics (release review and observed product signals). These additions describe capabilities rather than additional tool brands. New talents start unallocated until Ryan supplies their levels; they do not require another budget increase.
