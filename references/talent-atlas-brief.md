Here’s the Astra-ready handoff. I’ve written it so Astra has a clear hierarchy of **what to preserve, what to rebuild, what governs the mechanics, and which visual reference wins**.

:::writing{variant="document" id="58314" title="Astra Build Brief — Talent Atlas v2"}
# TALENT ATLAS V2
## Astra implementation brief

### Core objective

Rebuild `/talent-tree/` into a more exploratory **Talent Atlas** that feels like a designer career map crossed with a fighting-game skill system.

The page should no longer communicate:

> Spend points → unlock a handful of badges.

It should communicate:

> Every skill investment changes the shape of your build. Skills combine, combinations strengthen, secret abilities emerge, and your strongest intersections eventually define the kind of designer you are.

The experience should feel playful enough that another designer wants to build their own tree, but polished enough that it still belongs inside Ryan's professional portfolio.

---

# 1. IMPORTANT: SOURCES OF TRUTH

Before changing implementation, inspect:

- existing `/talent-tree/`
- `PRODUCT.md`
- `DESIGN.md`
- portfolio token/variable source
- `/design-system/`
- shared typography, color, spacing, radius, card, button, icon and interaction primitives
- existing Talent Tree data structures and point-spending logic
- existing Ryan's Tree / build-your-own functionality if currently implemented

Do not build a disconnected visual system specifically for Talent Tree.

## Visual north star

Use this supplied Talent Atlas concept as the **primary visual reference**:

https://chatgpt.com/s/m_6aa8acfac25081918be54071293bdb46

The Talent Atlas direction from that concept is the approved visual target.

### Specifically preserve from that visual:

- large explorable atlas rather than rigid skill columns
- three softly colored skill territories
- Design & Systems / Technical / Code
- vertical progression from foundational skills into deeper specialization
- branching and reconverging nodes
- abilities emerging between disciplines
- increasingly mysterious lower regions
- subtle fog-of-war / hidden discovery
- thin elegant connector lines
- large amounts of breathing room
- circular nodes
- subtle outer progress rings
- quiet, portfolio-quality UI rather than fantasy-game chrome
- abilities behaving like special landmarks inside the map

## Do NOT use this earlier HTML prototype as the visual reference

The prototype can be useful for interaction ideas only.

Do not recreate its:
- rigid card layout
- visual density
- typography hierarchy
- three-column dashboard feeling
- exact node spacing
- exact header structure

The shared Talent Atlas image wins visually.

---

# 2. DESIGN SYSTEM RULES

Use the existing portfolio design system first.

Existing direction includes:

- Hubot Sans for headings/buttons
- Inter for body/UI
- orange primary family
- neutral family
- blue-gray secondary family
- existing spacing scale
- existing radius scale
- existing shadows
- existing accessibility/contrast rules

Orange remains the **primary portfolio/action accent**.

Blue and green are semantic Talent Atlas category colors only.

Do not make the Talent Tree suddenly feel like a tri-color brand.

---

# 3. SEMANTIC TALENT COLORS

Create proper named tokens before using any new values in components.

## Design & Systems

Muted cool blue.

Suggested family:

```css
--talent-design-700
--talent-design-500
--talent-design-200
--talent-design-100
--talent-design-surface
```

## Technical

Use the existing portfolio orange family.

```css
--talent-technical-700: var(--color-primary-dark);
--talent-technical-500: var(--color-primary);
--talent-technical-100: var(--color-primary-light);
```

## Code

Muted sage/green.

Suggested family:

```css
--talent-code-700
--talent-code-500
--talent-code-200
--talent-code-100
--talent-code-surface
```

These should be:

- muted
- low saturation
- compatible with the existing orange
- accessible
- subtle enough that typography remains dominant

Document new semantic values on `/design-system/`.

Never hardcode them repeatedly inside components.

---

# 4. MAIN PAGE STRUCTURE

The final page should approximately follow this hierarchy.

## A. Intro / player identity

Preserve the existing Talent Tree intro and overall personality.

Show key stats such as:

- Level
- Talent points spent
- Mastered skills
- Abilities discovered
- Current class/archetype

Ryan's actual build should remain pre-populated.

If the existing page lets visitors build their own tree, preserve that functionality and make switching between:

**Ryan's Tree**
and
**Build Yours**

obvious.

---

# 5. FEATURED ABILITY / FORGE CARD

Above the Atlas, add the large ability-detail card inspired by the **Forge concept** from the previous exploration.

This card is important.

It becomes the inspection surface for the Atlas.

When an ability is selected, update this card.

Example:

## ADVANCED
# Guardrail Architect

Standards, accessibility and governance that hold when you leave the room.

Then show the recipe:

Tokens  
4 / 5

Accessibility  
4 / 5

Governance  
3 / 5

Documentation  
3 / 5

Also show:

- current ability charge
- current rank
- next rank requirement
- whether all recipe connections have been discovered
- which ingredient is currently limiting the next rank

Clicking abilities in the Atlas changes this card.

The card should remain visually tied to the rest of the portfolio, not become a videogame HUD.

---

# 6. THE TALENT ATLAS

This is the main experience.

Build one large top-to-bottom atlas.

Three vertical territories:

### Design & Systems
People × Structure × Craft

### Technical
Tools × Production × Translation

### Code
Logic × Extensibility × Shipping

Do not make these three rigid columns.

Their boundaries should feel organic and begin interacting more as the visitor moves downward.

Use very soft atmospheric/category backgrounds similar to the approved reference.

---

# 7. VERTICAL PROGRESSION

The Atlas should visually move through approximately five depths.

## 1. Core Essentials

Foundational skills.

## 2. Expanded Practice

Breadth begins developing.

## 3. Specialization

Branches become more specific.

## 4. Mastery / Intersections

Cross-discipline abilities become prominent.

## 5. Hidden Horizons

Rare combinations and undiscovered abilities.

The bottom of the Atlas should feel more mysterious than the top.

It should visually imply:

> There is more here than you have discovered.

---

# 8. SKILL NODE PROGRESS

Each skill remains a 0–5 point investment.

Use a **five-segment circular progress ring** around the skill icon.

Not a smooth percentage donut.

Examples:

0/5  
empty ring

1/5  
one segment

3/5  
three segments

5/5  
complete ring + very restrained mastery detail

This should make point investment readable without requiring the user to read every number.

Keep the numeric `3 / 5` available nearby or on interaction.

---

# 9. EXPAND CURRENT SKILL TREE

Preserve the existing skill taxonomy unless implementation review reveals obvious duplication.

Current tree should remain approximately 30 skills.

Add:

## Photoshop / Raster Craft

Represents:

- Photoshop
- photo manipulation
- compositing
- raster image craft
- visual polish
- production image work

Place under Design & Systems / visual craft.

## Vector Design

Represents:

- Illustrator/vector workflows
- iconography
- scalable illustration
- logo/symbol craft
- vector systems

Place under Design & Systems / visual craft.

This takes the system from approximately:

30 → 32 skills

CMS remains an important Technical skill.

Do not remove it.

Ryan has meaningful AEM/CMS experience and it should participate in several ability recipes.

---

# 10. ABILITY SYSTEM — MAJOR CHANGE

The existing ability model is too binary.

Abilities should now behave like **secret combinations that continuously strengthen**.

Every talent point spent should contribute to one or more potential abilities.

Think:

fighting-game combinations

+

RPG talent synergies

+

professional design disciplines

---

# 11. ABILITY MECHANIC

Each ability contains:

## Recipe

The skills that feed it.

Example:

Guardrail Architect

- Tokens
- Accessibility
- Governance
- Documentation

## Charge

Ability charge is based on total points invested across its ingredients.

Suggested calculation:

```text
abilityCharge =
sum(current recipe points)
/
sum(max recipe points)
```

All recipe skills have max 5 points.

Example:

Tokens 4  
Accessibility 4  
Governance 3  
Documentation 3

14 / 20 total charge

70% charged

Use this for the ability's outer progress treatment.

---

# 12. DISCOVERY LOGIC

An ability should have several visibility states.

## Completely hidden

No meaningful relationship has formed.

Show only:

???

or nothing at all.

---

## Resonating / hinted

At least two recipe ingredients contain investment.

Do NOT reveal the ability name yet.

Instead show something like:

### ???

2 connections detected

> Your system skills are beginning to resonate.

Or:

> Something is forming between visual craft and scalable assets.

The user should be able to sense that another point somewhere nearby might reveal something.

---

## Discovered

Every recipe ingredient has at least 1 point.

Now reveal:

- ability name
- icon
- description
- rank
- recipe
- charge

This turns discovery into a reward.

---

# 13. ABILITY RANKS

Abilities do not stop evolving once discovered.

Use five rank states:

### Unlocked
All recipe skills ≥ 1

### Strengthened
All recipe skills ≥ 2

### Advanced
All recipe skills ≥ 3

### Elite
All recipe skills ≥ 4

### Master
All recipe skills = 5

Important:

The rank is based on the **weakest skill in the recipe**.

Example:

Figma 5  
Components 5  
Tokens 2

The ability cannot be Master.

It remains:

**Strengthened**

This prevents one maxed-out skill from overpowering an otherwise undeveloped recipe.

Meanwhile total charge can still increase continuously.

---

# 14. TITLE PRESENTATION

Modifiers become part of the fun.

Examples:

System Sight

Strengthened System Sight

Advanced System Sight

Elite System Sight

Master System Sight

Use the modifier as a smaller eyebrow when needed:

ADVANCED

# System Sight

This keeps the underlying ability name memorable.

---

# 15. INITIAL 30 ABILITIES

Build the data architecture to support these.

Do not assume this list can never expand.

Ability definitions should live in structured data rather than JSX/markup.

---

# TIER A — STANCES

Mostly two-skill combinations.

These should appear earlier and make individual skill investments feel useful.

## 1. Figma Force

Figma + Components

Represents turning files into reusable systems.

---

## 2. Pixel Prowess

Photoshop / Raster Craft + Layout

Represents high-end raster craft, composition and visual polish.

---

## 3. Vector Velocity

Vector Design + Typography

Represents precise scalable graphic craft.

---

## 4. Token Tactics

Tokens + CSS

Represents design decisions translated directly into implementation.

---

## 5. Component Combo

Components + Storybook

Represents library thinking crossing into engineering implementation.

---

## 6. Motion Momentum

Motion + Interaction

Represents movement communicating state and intent.

---

## 7. Prototype Pulse

Figma + Prototyping

Represents making ideas tangible quickly.

---

## 8. State Sense

Interaction + State Modeling

Represents seeing all states behind a screen rather than only ideal-state UI.

---

## 9. Accessibility Armor

Accessibility + Components

Represents inclusive behavior built into primitives.

---

## 10. Handoff Harmony

Handoff + Documentation

Represents reducing translation loss between design and engineering.

---

## 11. CMS Command

CMS + Information Architecture

Represents authorable experiences with sound information architecture.

---

## 12. Template Tactics

CMS + HTML

Represents reusable page architecture instead of one-off pages.

---

## 13. Front-End Flow

HTML + CSS

Represents working directly in the browser's medium.

---

## 14. TypeScript Tempo

TypeScript + State Modeling

Represents increasingly intentional application logic and state contracts.

---

## 15. Agent Arsenal

AI Tools + Agent Context

Represents giving agents both capabilities and system context.

---

# TIER B — COMBOS

Three-skill recipes.

These represent stronger professional intersections.

## 16. System Sight

Tokens + Components + Governance

Represents seeing beyond individual UI into rules, variants, consumers and long-term system consequences.

---

## 17. Brand Barrage

Typography + Photoshop / Raster Craft + Vector Design

Represents visual language built across type, image, composition and scalable graphic assets.

---

## 18. Interface Instinct

Layout + Interaction + Prototyping

Represents strong UI judgment and the ability to prove ideas rapidly.

---

## 19. Lossless Handoff

Components + Storybook + Handoff

Represents designs surviving translation into engineering.

Keep this existing name.

---

## 20. Content Choreography

CMS + Information Architecture + Accessibility

Represents content architecture that works for users and content authors.

---

## 21. Front-End Mastery

HTML + CSS + TypeScript

Represents substantial command of the front-end medium without implying full application-engineering ownership.

---

## 22. Cross-Platform Craft

React + React Native + Components

Represents carrying component/system thinking across web and native products.

---

## 23. Automation Advantage

AI Tools + Agent Context + Automation

Represents eliminating repetitive work rather than simply performing it faster.

---

## 24. Signal Sense

Research + QA & Analytics + Information Architecture

Represents converting qualitative and quantitative signals into usable direction.

---

## 25. Design Diplomacy

Handoff + Governance + Research

Represents reconciling user needs, design-system rules and engineering constraints.

---

# TIER C — FINISHERS

Four-skill recipes.

Rare.

More visually important.

These should strongly influence final class/archetype calculation.

## 26. Guardrail Architect

Tokens + Accessibility + Governance + Documentation

Standards and constraints that keep quality intact when the original designer is no longer present.

Keep this name.

---

## 27. Prototype Alchemist

Figma + Prototyping + AI Tools + HTML

Turning ambiguity into something tangible enough to test, critique and improve quickly.

Keep this name.

---

## 28. Systemsmith

Tokens + Components + Storybook + CSS

Forging a system from design decisions into reusable implemented primitives.

Keep this name.

---

## 29. System Memory

Documentation + Governance + Agent Context + CMS

Creating a system where humans, authors and agents can understand not only what exists but why.

Keep this name.

---

## 30. Shipwright

Git + Performance + QA & Analytics + Production Ownership

The ability to stay responsible for the work once reality begins attacking it.

Keep this name.

---

# 16. ABILITY VISUALS IN THE ATLAS

Abilities should not simply be a card grid below the skills.

They belong **inside the Atlas**.

Skill branches should begin converging into ability landmarks.

As abilities involve skills from different territories, connector lines should visibly cross category boundaries.

Examples:

System Sight

Design & Systems-heavy intersection.

Token Tactics

Design & Systems ↔ Code.

Prototype Alchemist

Design & Systems ↔ Technical ↔ Code.

Guardrail Architect

Design & Systems ↔ Technical.

Cross-Platform Craft

Design & Systems ↔ Code.

---

# 17. COLOR OVERLAP

As the Atlas moves toward ability intersections, allow the three semantic regions to visually overlap slightly.

Do not literally create loud blended gradients.

Use subtle overlap/surface effects.

The conceptual goal:

Blue + orange territory interaction

Orange + green interaction

Blue + green interaction

All three become increasingly interconnected deeper in the tree.

This communicates the thesis:

> Your design identity is created by the intersections, not the lane you started in.

---

# 18. SELECTING AN ABILITY

Clicking an ability should:

1. select the ability node
2. animate/highlight all contributing skill paths
3. dim irrelevant connectors slightly
4. update the Forge detail card
5. display current rank
6. display total charge
7. show ingredient point values
8. identify the weakest ingredient
9. explain what point would advance it next

Example:

### ADVANCED
# System Sight

78% charged

Tokens  
5 / 5

Components  
4 / 5

Governance  
3 / 5

**Next rank: Elite**

Governance needs +1.

---

# 19. SELECTING A SKILL

Clicking or hovering a skill should reveal:

- skill name
- 0–5 point investment
- short human explanation
- abilities it currently contributes to
- undiscovered resonances where appropriate

Example:

# Tokens
5 / 5

You have invested deeply in naming decisions as reusable system variables.

Contributes to:

- Token Tactics
- System Sight
- Guardrail Architect
- Systemsmith

Possible hidden connections:

`2 undiscovered abilities`

Do not immediately reveal hidden recipes.

---

# 20. POINT SPENDING

If Build Yours currently exists, each point added to a skill should trigger:

- node ring update
- connected ability charge updates
- subtle connector response
- possible hidden-resonance hint
- ability discovery animation
- rank-up animation if applicable
- class recalculation

The user should receive feedback from nearly every point spent.

Avoid heavy celebratory animation.

Think subtle Nintendo/Zelda/Figma polish rather than arcade particles everywhere.

---

# 21. ABILITY DISCOVERY MOMENT

When an ability first becomes discoverable:

Briefly focus its location in the Atlas.

Example:

`NEW ABILITY DISCOVERED`

## Brand Barrage

Typography × Raster Craft × Vector Design

Then allow the user to inspect it.

The discovery should feel rewarding but still fit Ryan's portfolio.

No giant explosions.

No fantasy scroll textures.

No neon gamer interface.

---

# 22. MASTER RANK

When every recipe skill reaches 5:

Use a special but restrained mastery treatment.

Potential changes:

- fully completed outer ring
- tiny mastery glyph
- slightly stronger line weight
- subtle surface halo
- "MASTER" eyebrow

Do not dramatically change the node size.

---

# 23. CURRENT CLASS / ARCHETYPE

Use abilities rather than raw skill points to calculate the final class.

The strongest:

- finishers
- cross-discipline abilities
- high-rank abilities

should have the most weight.

Ryan's current class can still resolve toward combinations such as:

**Guardrail Architect**

**Prototype Alchemist**

Or hybrid class language derived from them.

Keep the current playful naming philosophy.

The class should communicate:

> This is what this particular combination of experience creates.

Not:

> This is your standardized industry job title.

---

# 24. OTHER DESIGNERS

This page should still function as an exploration of Ryan's background first.

But it should be compelling enough that another designer wants to make their own.

If Build Yours exists, make the invitation clear:

### Think your title doesn't quite fit either?

Build your own Talent Atlas.

Spend points based on your real experience and see what your intersections unlock.

Provide an obvious route back to:

**View Ryan's Tree**

---

# 25. MOBILE

Do not flatten the Atlas into a tiny impossible-to-read desktop diagram.

Design a deliberate mobile behavior.

Preferred options:

- horizontally pannable Atlas
- controlled zoom
- ability selection centers the relevant area
- territory headers remain understandable
- Forge card becomes a condensed drawer or stacked card
- skill labels remain readable
- no reliance on hover

Desktop should remain the most expansive version.

Mobile should feel intentionally explorable, not merely scaled down.

---

# 26. ACCESSIBILITY

Required:

- keyboard-navigable nodes
- visible focus states
- no interaction dependent solely on hover
- textual point values available
- semantic button controls for interactive nodes
- adequate contrast
- reduced-motion support
- screen-reader label for node state and points
- hidden ability state understandable without relying only on opacity/color

Example ARIA label:

`Tokens. 4 of 5 talent points invested. Contributes to four discovered abilities.`

---

# 27. MOTION

Use motion sparingly.

Appropriate:

- connectors illuminating when an ability is selected
- ring segment filling
- subtle region focus
- ability discovery reveal
- rank transition
- node hover/focus lift
- progressive line draw

Avoid:

- floating objects everywhere
- constant ambient animation
- particle systems
- dramatic pulsing
- excessive glowing

Craft > spectacle.

---

# 28. DATA ARCHITECTURE

Do not hardcode the tree individually into presentation markup.

Use structured configuration.

Something conceptually like:

```ts
type Skill = {
  id: string
  name: string
  family: "design" | "technical" | "code"
  maxPoints: 5
  currentPoints: number
  description: string
  dependencies?: string[]
}

type Ability = {
  id: string
  name: string
  type: "stance" | "combo" | "finisher"
  ingredients: string[]
  description: string
  icon: string
}
```

Calculate dynamically:

- charge
- discovery state
- rank
- limiting ingredient
- relevant paths
- class weighting

Do not manually store:

`isAdvanced: true`

when it can be derived from current skill points.

---

# 29. ABILITY STATE ALGORITHM

Suggested logic:

```ts
const recipePoints = ingredients.map(id => skills[id].currentPoints)

const totalPossible = ingredients.length * 5

const charge =
  sum(recipePoints) / totalPossible

const minimumIngredient =
  Math.min(...recipePoints)
```

Visibility:

```text
0–1 active ingredients
→ Hidden

2+ active ingredients but not every ingredient
→ Resonating / hinted

Every ingredient ≥ 1
→ Discovered
```

Rank:

```text
minimumIngredient === 1 → Unlocked

minimumIngredient === 2 → Strengthened

minimumIngredient === 3 → Advanced

minimumIngredient === 4 → Elite

minimumIngredient === 5 → Master
```

This is intentionally simple enough for visitors to understand implicitly.

---

# 30. VISUAL PRIORITIES

When deciding between visual complexity and clarity, prioritize in this order:

1. skill relationships
2. current investment
3. ability intersections
4. discovery
5. personality
6. decoration

This should still feel like a Ryan DeBoer portfolio page first.

---

# 31. DO NOT

Do not:

- recreate the earlier HTML prototype
- turn the page into a card dashboard
- introduce loud gaming visuals
- make all three category colors equally dominant brand colors
- place every ability in a uniform card grid
- show all secret ability recipes immediately
- make abilities binary unlocked/locked
- add dozens more skills just to make the tree seem bigger
- rate professional skill subjectively as percentages
- let a single maxed skill create a Master ability
- remove CMS
- remove the current class concept
- abandon the existing portfolio design system
- use arbitrary hex values directly inside components
- overstate React/React Native expertise through copy

---

# 32. DEFINITION OF DONE

The redesigned Talent Tree is successful when:

- the approved Talent Atlas visual is clearly recognizable in the implementation
- the page visually belongs to the existing portfolio
- Ryan's 32 skills are represented
- Photoshop / Raster Craft and Vector Design are added
- CMS remains represented
- every skill uses a five-segment 0–5 ring
- abilities live inside the Atlas
- all 30 initial abilities are data-driven
- abilities continuously strengthen as ingredients receive more points
- ability charge is visible
- abilities use Unlocked / Strengthened / Advanced / Elite / Master states
- hidden combinations provide subtle hints
- discovering an ability feels rewarding
- selecting an ability traces its ingredients across the Atlas
- the Forge inspection card updates dynamically
- final class is derived primarily from strong cross-disciplinary abilities
- Ryan's existing tree remains viewable
- visitors can still build their own tree if that functionality currently exists
- mobile has an intentional exploration model
- accessibility does not depend on color, hover or animation
- the result feels playful and memorable without compromising the professional portfolio

---

# PRODUCT THESIS

The page should ultimately communicate:

**A designer isn't the lane they started in. They're the intersections they've built over time.**

A point in Figma matters.

A point in CSS matters.

A point in Photoshop matters.

A point in CMS matters.

But the interesting part is what happens when those experiences begin connecting.

That is the Talent Atlas.
:::

I’d give **this brief + the visual reference URL directly to Astra**. The main thing I would not send along is the HTML prototype as a design reference; it could bias the build back toward the dashboard structure we already decided against.
