---
name: ryan-design-taste
description: >
  Ryan DeBoer's personalized design-taste and product-quality skill. Use whenever
  designing, critiquing, prototyping, documenting, or implementing a page,
  product flow, component, design system, brand system, case study, or visual
  artifact—in HTML/CSS/React/React Native, Figma via MCP, or AI-assisted design
  tools. Encodes Ryan's observed taste across Tire Rack commerce, WheelRack,
  Tire Categories, Winter/AEM systems, LoopStack, PlayDraft, portfolio/editorial
  work, and identity systems. Ryan's work is systems-first, craft-led,
  implementation-aware, evidence-backed, responsive by default, and adapted to
  the product context rather than forced into one visual style.
---

# Ryan Design Taste

This skill is adapted from `leonxlnx/taste-skill` (MIT), but it is not a generic
anti-slop checklist and it is no longer limited to Tire Rack.

It encodes one designer's recurring judgment across several very different
product worlds:

- **Trust-first retail commerce:** Tire Rack category pages, search results,
  product configurators, seasonal journeys, landing pages, and promotional
  modules.
- **Enterprise and partner-facing systems:** WheelRack, its token architecture,
  reusable components, responsive behavior, Storybook alignment, documentation,
  adoption, and governance.
- **Data-heavy personal products:** LoopStack and other interfaces where users
  need to understand trends, timing, confidence, and next actions.
- **Mobile social products:** PlayDraft, including fast game loops, competitive
  states, pack discovery, timers, drafting, voting, results, and progression.
- **Portfolio and editorial storytelling:** Ryan's portfolio, case-study pages,
  about/process content, testimonials, metrics, and visual narrative.
- **Brand and sub-brand systems:** identity work where a strong core mark,
  typography, icon family, and application logic must scale across products.

The goal is not to make every project look like Tire Rack, PlayDraft, or Ryan's
portfolio. The goal is to make every project feel like Ryan made the decisions:
clear hierarchy, deliberate visual craft, strong systems, real implementation
logic, and no decoration without a job.

---

## 0. THE CORE READ

Before generating anything, state one concise design read:

> **Reading this as:** `<product or page type>` for `<primary audience and task>`,
> in `<visual mode>`, prioritizing `<two or three qualities>`.

Examples:

- "Reading this as: a purchase-decision landing page for drivers comparing tire
  categories, in the trust-first commerce mode, prioritizing clarity, evidence,
  and conversion."
- "Reading this as: a live mobile draft room for friends making fast picks, in
  the PlayDraft competitive mode, prioritizing turn state, speed, and delight."
- "Reading this as: a senior-design portfolio case study for hiring teams, in
  the portfolio/editorial mode, prioritizing narrative, proof, and craft."
- "Reading this as: a glucose-pattern review for a person managing Type 1
  diabetes, in the calm data-product mode, prioritizing comprehension,
  confidence, and safe next actions."

Ask at most **one** clarifying question, and only when the answer would materially
change the mode, architecture, or success criteria.

Good clarifying question:

> "Is this a preserve-the-existing-system iteration or permission to establish a
> new visual direction?"

Do not ask for decisions that can be responsibly inferred from the brief.

---

## 1. RYAN'S INVARIANT DESIGN PRINCIPLES

These apply in every visual mode.

### 1.1 Clarity before novelty

A user should understand what the interface is, what state it is in, and what
they can do next before noticing the styling.

Novelty is welcome when it improves:

- comprehension,
- emotional fit,
- product identity,
- interaction feedback,
- memorability,
- or storytelling.

Novelty is rejected when it adds:

- ambiguous controls,
- ornamental layout shifts,
- hidden navigation,
- gratuitous animation,
- fake depth,
- or visual noise.

### 1.2 Care must survive implementation

A polished Figma frame is not the finish line. The design must account for:

- component behavior,
- responsive behavior,
- content variability,
- empty states,
- loading states,
- disabled states,
- error states,
- long labels,
- truncation,
- localization pressure,
- accessibility,
- real data,
- and how the design will be built.

Ryan's visual standard is inseparable from implementation quality.

### 1.3 Systems are operational, not ornamental

A design system is not only a component library, variables file, or set of
screens.

A real system includes:

- shared principles,
- token architecture,
- reusable patterns,
- component contracts,
- adoption,
- ownership,
- governance,
- documentation,
- implementation parity,
- contribution rules,
- versioning,
- and judgment about when a reusable pattern is warranted.

Do not create a component just because two elements look similar. Create one
when they share purpose, structure, behavior, and likely future maintenance.

Do not force a system onto a one-off problem when the cost of abstraction is
higher than the value.

### 1.4 Evidence belongs near the claim

Ryan's strongest work repeatedly places proof next to persuasion.

Use the appropriate evidence for the product:

- ratings and performance averages,
- availability and fitment,
- counts and filters,
- verified testimonials,
- measurable outcomes,
- before/after comparisons,
- trend confidence,
- source context,
- completion status,
- live game state,
- or usage guidance.

Avoid marketing claims that require the user to trust the interface blindly.

### 1.5 Dense is acceptable; confusing is not

Ryan does not treat whitespace as a substitute for hierarchy.

Information-rich interfaces are appropriate when users need to compare,
configure, monitor, or decide. Density should be organized through:

- strong grouping,
- useful labels,
- consistent alignment,
- restrained dividers,
- typographic contrast,
- progressive disclosure,
- sticky context where appropriate,
- and predictable interaction patterns.

Do not solve complexity by hiding essential information.

### 1.6 Mobile is a product state, not a crop

Every responsive design must identify:

- what remains visible,
- what moves,
- what collapses,
- what becomes sticky,
- what changes interaction model,
- what becomes a sheet or disclosure,
- and what should not survive on the smaller viewport.

Mobile parity does not require visual sameness. It requires task parity.

### 1.7 Make the hierarchy do the work

Prefer hierarchy through:

1. scale,
2. weight,
3. spacing,
4. alignment,
5. grouping,
6. contrast,
7. then color.

Do not rely on color alone to communicate importance or state.

### 1.8 One strong idea per surface

A screen may be visually expressive, but it should have one dominant organizing
idea:

- a hero and evidence card,
- a live turn state,
- a trend summary,
- a process narrative,
- a comparison table,
- a product visualizer,
- or a strong identity lockup.

Do not stack multiple competing visual gimmicks.

Large whitespace is appropriate only when strong typography, imagery, composition,
or interaction focus gives the space purpose. Whitespace alone is not minimalism and
should never compensate for unresolved hierarchy.

### 1.9 Craft is visible in the edges

Inspect:

- optical alignment,
- text wrapping,
- icon weight,
- baseline relationships,
- corner consistency,
- divider logic,
- tap targets,
- image crops,
- state transitions,
- and spacing at actual breakpoints.

"Close enough" is not finished when the mismatch is visible.

### 1.10 AI accelerates exploration; it does not lower the bar

Use AI to:

- move from 0 to 80% faster,
- eliminate blank-canvas friction,
- generate structured alternatives,
- explore edge cases,
- audit consistency,
- test copy and hierarchy,
- prototype interactions,
- compare implementation against system rules,
- and act as a self-governance layer for the work.

Do not let AI:

- invent unsupported brand rules,
- flatten every project into the same visual style,
- introduce generic component patterns,
- ship unreviewed output,
- or substitute quantity for judgment.

---

## 2. THE FOUR DIALS

Set these before designing.

### 2.1 DESIGN_VARIANCE

How far the composition may depart from conventional grid and component
patterns.

- `1–3`: highly structured, operational, table- or form-heavy.
- `4–6`: controlled variation, expressive rhythm, clear system underneath.
- `7–9`: campaign, portfolio, identity, or experimental storytelling.

### 2.2 MOTION_INTENSITY

How central motion is to comprehension and brand expression.

- `1–2`: state changes, hover, disclosure, loading.
- `3–5`: purposeful transitions, staged content, lightweight delight.
- `6–8`: motion-led storytelling or game feedback.
- Never use motion that delays a primary action or obscures state.

### 2.3 VISUAL_DENSITY

How much information is visible at once.

- `3–4`: editorial, brand, focused acquisition.
- `5–6`: balanced product and commerce.
- `7–8`: configurators, dashboards, live game rooms, comparison tools.

### 2.4 SYSTEM_RIGOR

How strongly the output must map to tokens, components, documentation, and
production behavior.

- `4–5`: exploratory concept or single campaign.
- `6–7`: real product feature or portfolio page.
- `8–10`: design system, enterprise product, repeated CMS pattern, or code-bound
  implementation.

### Ryan's starting table

| Product context | Variance | Motion | Density | System rigor |
|---|---:|---:|---:|---:|
| Tire Rack category / landing page | 4 | 2 | 5 | 8 |
| Search results / configurator | 3 | 2 | 8 | 9 |
| Seasonal AEM journey | 4 | 3 | 6 | 9 |
| WheelRack enterprise flow | 3 | 2 | 7 | 10 |
| LoopStack / health-data product | 4 | 3 | 7 | 9 |
| PlayDraft live draft room | 6 | 6 | 7 | 9 |
| PlayDraft discovery / pack browsing | 6 | 4 | 6 | 8 |
| Portfolio homepage | 7 | 4 | 5 | 7 |
| Portfolio case study | 6 | 3 | 6 | 7 |
| Brand / sub-brand exploration | 8 | 3 | 4 | 7 |
| Marketing campaign concept | 7 | 5 | 4 | 6 |

Adjust the dials when the task requires it, but state the change.

---

## 3. SELECT THE VISUAL MODE

Do not use one universal palette or typography stack. Select the closest mode,
then use the project's existing tokens when available.

---

# MODE A — TRUST-FIRST RETAIL COMMERCE

Use for Tire Rack category pages, retail landing pages, product education,
search results, configurators, installers, promotions, and conversion journeys.

## A1. Intent

The audience has purchase intent but may lack category knowledge. The design
must help them:

- understand,
- compare,
- trust,
- configure,
- and act.

The aesthetic serves confidence and conversion, not spectacle.

## A2. Tire Rack tokens

Use existing file variables first. When building a standalone prototype, these
are the fallback values.

```css
:root {
  --color-red: #D70000;
  --color-blacktext: #19170D;
  --color-grey-23: #3C3837;
  --color-tundora: #4B4B4B;
  --color-blue: #2B7088;
  --color-blue-alt: #2E7993;
  --color-marzipan: #F7D18D;
  --color-green: #75C63B;
  --color-band-light: #F3F3F3;
  --color-white: #FFFFFF;
}
```

### Color rules

- Red is the action color and selected brand emphasis.
- Inline links use Calypso blue, not red.
- Marzipan is an accent or selected-state underline, never body text on white.
- Green communicates positive performance or availability.
- Dark bands are reserved for trust, service, footer, or high-contrast utility.
- Do not scatter red through decorative borders, icons, and headings.

## A3. Typography

- Primary family: **Gibson**.
- Fallback: `"Gibson", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif`.
- Editorial accent: **Aleo**, used sparingly.
- Body baseline: `16px / 22.4px`.
- Section headings: Gibson SemiBold, often uppercase.
- Link titles: SemiBold, usually `18px / 21.6px`.
- Buttons: SemiBold, direct labels.
- Numeric data must align cleanly and remain scannable.

## A4. Structure

- Desktop artboard: `1500px`.
- Centered content frame: approximately `1200px`.
- Mobile target: `424px`, with `16–24px` gutters.
- Use full-bleed bands to organize long content.
- Alternate white, light gray, white, then a dark trust/service band when the
  content supports it.
- Use 1px hairline dividers for dense rows.
- Long educational content is usually better as structured lists than a field
  of cards.

## A5. Pattern library

Reach for these first:

1. **Photo hero + content panel**
   - Full-width automotive or contextual photography.
   - Clear category heading.
   - Short educational introduction.
   - One primary red action.
   - Evidence or performance panel may overlap on desktop and restack below on
     mobile.

2. **Data-forward performance module**
   - Horizontal bars.
   - Labeled criteria.
   - Numeric score chips.
   - Light neutral tracks.
   - Color progression based on score.
   - Explain what the score means.

3. **Definition-list education**
   - Group labels in a stable column or header.
   - Blue link-style item title.
   - Plain-language description.
   - Relevant data link or category average.
   - Use rows and dividers, not unnecessary cards.

4. **Numbered process**
   - Usually three steps.
   - Literal title.
   - Consistent illustration language.
   - Short copy.
   - Clear progression.

5. **Promotion carousel**
   - Three-up desktop where space supports it.
   - Clear pricing or offer.
   - Previous/next controls.
   - Pagination state.
   - Do not let carousel chrome overpower the deal.

6. **Trust and service band**
   - Real staff or installation photography.
   - Service promise.
   - Phone/contact path.
   - Verified reviews, partner marks, or proof.
   - Avoid vague "we care" language without evidence.

7. **Filter rail + results canvas**
   - Filter groups with counts.
   - Disabled zero-count options remain visible.
   - Active state is unmistakable.
   - Range controls show current values.
   - Results preserve comparison context.
   - Product visualization and specification choices remain connected.
   - Price and primary action stay easy to locate.

8. **Seasonal guided journey**
   - Teach first, narrow choices second, convert third.
   - Reusable AEM sections.
   - Clear anchors and repeated CTA logic.
   - Avoid visually unique modules that cannot be authored or maintained.

## A6. Copy

- Plain.
- Confident.
- Service-oriented.
- Second person where natural.
- Literal headings.
- No clever copy that makes the customer decode the message.
- Use one emphasized word only when it improves scanning.

## A7. Retail anti-defaults

Never use:

- purple gradients,
- glassmorphism,
- excessive floating cards,
- equal three-card icon rows as a default,
- rounded-2xl on every container,
- decorative red,
- centered long-form copy,
- hidden zero-result filters,
- or desktop-only delivery.

---

# MODE B — ENTERPRISE DESIGN SYSTEM / WHEELRACK

Use for dealer tools, tablet products, partner portals, complex configuration,
design-system work, and cross-platform component architecture.

## B1. Intent

The interface exists inside operational constraints. It should help users make
high-confidence decisions quickly while helping teams build consistently.

WheelRack is the strongest reference for Ryan's system judgment:

- 200+ tokens,
- 50+ components,
- Figma variables,
- Token Studio,
- Storybook,
- React collaboration,
- responsive frameworks,
- partner scaling,
- and design-to-code parity.

## B2. Design priorities

1. Task state.
2. Data and fitment confidence.
3. Clear next action.
4. Error prevention.
5. Reuse.
6. Partner or theme scalability.
7. Documentation and governance.

## B3. Architecture

Use a layered token model:

```text
primitive
  → semantic
    → component
      → theme / partner override
```

Example:

```text
blue/700
  → color/action/primary
    → button/primary/background/default
      → partner/acme/action-primary
```

Never bind components directly to arbitrary primitive values when a semantic
role exists.

## B4. Component standards

Every reusable component should define:

- purpose,
- anatomy,
- variants,
- states,
- responsive behavior,
- content rules,
- accessibility,
- interaction contract,
- design token bindings,
- implementation notes,
- optional code mapping when the component is shared in production or mapped through
  a design-to-code workflow,
- edge cases,
- and when not to use it.

A Figma component is incomplete when engineering cannot infer its actual
behavior.

## B5. Interaction patterns

Prefer:

- guided steps for complex configuration,
- persistent progress,
- explicit validation,
- visible dependencies,
- inline explanation,
- disabled options with a reason,
- reversible choices,
- and summaries before commitment.

Do not remove unavailable options when seeing them helps users understand the
system or correct an earlier choice.

## B6. Visual language

- Strong grid.
- Moderate density.
- Restrained surface elevation.
- Clear status colors.
- High-fidelity product imagery where it supports selection.
- Selected states should use more than a thin color change.
- Avoid "dashboard decoration": charts, cards, or pills that do not improve a
  decision.

## B7. Governance requirement

For design-system requests, include:

- ownership model,
- contribution path,
- review criteria,
- release/version logic,
- documentation location,
- adoption plan,
- and design/code QA.

Do not call the result a design system if it only contains foundations and
components. Call it a **system foundation** until operations and governance are
defined.

---

# MODE C — CALM DATA PRODUCT / LOOPSTACK

Use for health, analytics, trend review, personal dashboards, decision support,
and any product where users must interpret time-series data.

## C1. Intent

The user should leave with a clearer mental model, not simply more metrics.

For LoopStack-style work:

- trends come before raw logs,
- summaries should connect data to time,
- uncertainty should be visible,
- and actions must not overstate confidence.

## C2. Hierarchy

Preferred order:

1. Current or most important state.
2. Meaningful trend.
3. Why it may be happening.
4. Supporting evidence.
5. Suggested review or next step.
6. Raw detail.

Do not begin with a wall of charts.

## C3. Data visualization

- Use the simplest chart that answers the question.
- Give the chart a sentence-level takeaway.
- Label thresholds and important events.
- Pair color with text, shape, or position.
- Preserve scale integrity.
- Avoid decorative gradients inside data marks.
- Use consistent time ranges.
- Show comparison periods when they provide context.
- Distinguish measured data, inferred patterns, and user-entered context.

## C4. Confidence and safety

Clearly separate:

- observation,
- correlation,
- inference,
- recommendation,
- and clinician-level decision.

Use language such as:

- "pattern detected,"
- "may be associated with,"
- "review,"
- "consider discussing,"
- or "insufficient data."

Never present an inferred explanation as certainty.

## C5. Visual language

- Calm surfaces.
- Strong typography.
- Limited semantic color.
- Clean chart framing.
- Minimal decorative motion.
- Dense detail available through drill-down.
- Summary cards only when each card answers a distinct question.

## C6. Mobile behavior

- Summaries first.
- Charts must remain legible without horizontal squeezing.
- Use segmented time ranges or full-screen detail.
- Keep primary context visible while scrolling.
- Do not reduce charts to unreadable thumbnails.

---

# MODE D — PLAYDRAFT MOBILE SOCIAL PRODUCT

Use for PlayDraft, social games, fantasy-adjacent products, live rooms, pack
discovery, voting, progression, and competitive mobile experiences.

## D1. Intent

PlayDraft should feel:

- fast,
- competitive,
- social,
- legible,
- premium,
- and playful without becoming juvenile.

The design must keep the current game state unmistakable.

## D2. Existing visual foundation

Use the active Figma system as the source of truth. For dark mobile products,
default to **quiet system chrome with expressive content**: navigation, controls,
and structural surfaces should remain dark and restrained while pack art, avatars,
team identity, live state, and selected moments provide most of the color and energy.
Do not make the surrounding chrome compete with the content.

The known foundation is:

- dark-mode first,
- warm-biased neutrals,
- primary blue,
- secondary gold,
- gold and blue gradient accents,
- custom geometric icons,
- Rajdhani for display, labels, stats, and timers,
- Inter for body and UI,
- and explicit gameplay states.

Fallback palette:

```css
:root {
  --pd-blue-500: #43587E;
  --pd-blue-700: #2D3D59;
  --pd-blue-800: #253959;
  --pd-blue-900: #1D2D47;

  --pd-gold-400: #F0C853;
  --pd-gold-500: #E0AB2C;
  --pd-gold-600: #C99520;
  --pd-gold-700: #B27F15;

  --pd-neutral-050: #1A1916;
  --pd-neutral-100: #2B2825;
  --pd-neutral-200: #3D3935;
  --pd-neutral-500: #857B6E;
  --pd-neutral-700: #C2B3A3;
  --pd-neutral-900: #F0EBE4;
}
```

Known brand gradients:

```css
--pd-gradient-gold:
  linear-gradient(135deg, #FFE160 0%, #FEC232 33%, #E0AB2C 66%, #B26B06 100%);

--pd-gradient-blue:
  linear-gradient(135deg, #43587E 0%, #34486B 50%, #253959 100%);
```

Reserve gradients almost entirely for:

- identity-defining moments,
- premium states,
- winner or celebration states,
- and rare controlled focal moments.

Do not use gradients as routine navigation, card, button, icon, or heading styling.
A flat semantic color should be the default.

## D3. Typography

- Display/H1: Rajdhani 700, compact, often uppercase.
- H2/H3: Rajdhani 600–700.
- Labels: Rajdhani 600 with tracked uppercase.
- Stats/timers: Rajdhani 700 with tabular numerals.
- Body/UI: Inter 400–600.
- Keep body copy plain; let the display family carry the competitive tone.

## D4. Gameplay state model

Every live draft surface must represent, at minimum:

- active,
- queued,
- picked,
- locked,
- eliminated,
- winner,
- waiting,
- paused,
- disconnected,
- and completed.

State must be communicated through a combination of:

- label,
- color,
- icon,
- placement,
- and action availability.

Never rely on glow alone.

## D5. Live draft hierarchy

Preferred hierarchy:

1. Whose turn / current state.
2. Time remaining.
3. Current pick requirement.
4. Available choices.
5. Queue or roster context.
6. Social activity.
7. Secondary controls.

The user's primary action should remain reachable with one thumb.

## D6. PlayDraft pattern library

1. **Turn-state header**
   - Player/avatar.
   - "Your Turn" or named player.
   - Timer.
   - Pick count.
   - Strong but compact visual emphasis.

2. **Draft board**
   - Clear available/picked distinction.
   - Picked options disappear when the mode requires board reduction.
   - Category structure remains understandable.
   - Selection feedback is immediate.

3. **Pick confirmation**
   - Item.
   - Category.
   - Roster impact.
   - Lock-in action.
   - Undo only when rules allow it.

4. **Queue**
   - Fast reorder.
   - Visible conflict/removal when another player drafts an item.
   - Empty state teaches the value.

5. **Pack discovery**
   - Strong cover art.
   - Literal pack title.
   - Quick metadata.
   - Social proof or activity where meaningful.
   - Avoid excessive badges.

6. **CrowdDraft / Board Pick**
   - Stratified board.
   - Clear pick count.
   - Immediate confidence/result feedback.
   - Vanished selections when that mechanic is intentional.
   - Explain scoring without interrupting the loop.

7. **Results**
   - Winner and score hierarchy.
   - Roster comparison.
   - Key moments.
   - Rematch/share paths.
   - Celebration should not obscure the result.

8. **Voting**
   - Anonymous team identity when required.
   - Visible close time.
   - One clear vote action.
   - Live result treatment only after voting when rules require it.
   - Shareable external presentation must still explain the product.

## D7. Motion

Motion may be more expressive here, but every animation must support:

- turn change,
- successful pick,
- invalid pick,
- timer urgency,
- winner reveal,
- queue movement,
- or progression.

Keep common interactions under roughly 300ms. Reserve longer sequences for a
single major moment such as a winner reveal.

Do not use constant pulsing, drifting particles, or ambient motion behind
decision-heavy screens.

## D8. PlayDraft anti-defaults

Never:

- make every surface glow,
- overuse neon,
- use generic esports UI,
- fill the screen with tiny badges,
- hide the turn state,
- place social chat above the primary game action,
- or sacrifice tap-target size for density.

---

# MODE E — PORTFOLIO / CASE-STUDY STORYTELLING

Use for Ryan's portfolio homepage, about page, case studies, testimonials,
project summaries, and professional positioning.

## E1. Intent

The portfolio should demonstrate how Ryan thinks and ships, not merely display
screens.

A hiring manager should quickly understand:

- the problem,
- Ryan's role,
- the system or product complexity,
- the decisions,
- the implementation relationship,
- the measurable outcome,
- and the quality of the final work.

## E2. Portfolio visual character

- Modern, editorial, and structured.
- Light neutral foundations.
- Warm orange/coral accent used selectively.
- Strong typographic hierarchy.
- Grid-first composition.
- Rounded containers are acceptable, but not universal.
- Process timelines, layered-paper concepts, section tabs, and structured
  diagrams may add personality.
- Motion should feel intentional and brief.
- Selected work is more important than a long tools list.

Use the portfolio's existing variables and styles rather than copying the Tire
Rack or PlayDraft palette.

## E3. Homepage hierarchy

Preferred order:

1. Hero and positioning.
2. Concise about / point of view.
3. Selected work.
4. What Ryan brings beyond the tools.
5. Testimonials.
6. Process.
7. Metrics or proof.
8. Tools, de-emphasized.
9. FAQ or closing context.

The portfolio should not introduce Ryan as "a designer who also uses AI."
Position him as a systems-first product designer and UX/design engineer whose
craft, implementation fluency, and AI-native workflow reinforce one another.

## E4. Case-study architecture

Use this narrative sequence:

1. **Context**
   - What product, audience, and constraint existed?

2. **Problem**
   - What was not working?
   - Why did it matter?

3. **Ryan's role**
   - What did he own?
   - Where did he collaborate?
   - What limitations were real?

4. **Signal**
   - Research, analytics, customer behavior, implementation constraints, or
     business evidence.

5. **Decision**
   - What design choices were made and why?

6. **System**
   - Components, tokens, CMS patterns, workflow, responsive model, or governance.

7. **Shipped experience**
   - High-fidelity views with annotations.
   - Show mobile and real states, not only hero mockups.

8. **Outcome**
   - Metrics, adoption, speed, consistency, conversion, traffic, partner growth,
     or qualitative feedback.

9. **Reflection**
   - What changed in Ryan's thinking?
   - What would be done next?

Do not bury the outcome at the bottom without an early preview.

## E5. Case-study-specific emphasis

### WheelRack

Emphasize:

- end-to-end dealer journey,
- partner-specific complexity,
- 200+ tokens,
- 50+ components,
- Storybook and React partnership,
- responsive behavior,
- design-to-code parity,
- adoption,
- documentation,
- and governance.

### Tire Categories

Emphasize:

- simplifying product education,
- icon and information system,
- evidence-backed comparison,
- increased category entry,
- conversion lift,
- CMS implementation,
- and scalable page patterns.

### Winter / Seasonal AEM

Emphasize:

- seasonal acquisition journey,
- modular AEM components,
- Experience Fragments,
- Adobe Target/testing,
- authoring flexibility,
- conversion and sales impact,
- and reuse across campaigns.

### Landing pages / AEM component system

Emphasize:

- moving from one-off pages to reusable authoring patterns,
- component constraints,
- content flexibility,
- design QA,
- faster production,
- and consistency across campaigns.

### LoopStack

Emphasize:

- personal problem insight,
- dense health data translated into understandable trends,
- 0→1 product thinking,
- React/TypeScript implementation,
- AI-assisted prototyping,
- and responsible confidence language.

### PlayDraft

Emphasize:

- mobile-first 0→1 product design,
- game mechanics,
- social drafting,
- design-system foundation,
- React Native/Expo/TestFlight implementation,
- state complexity,
- economy/progression,
- and rapid AI-assisted iteration without losing system discipline.

## E6. Portfolio motion

- Hero/load sequence should complete quickly, usually within 3–4 seconds.
- Motion may reveal process or evolution.
- Do not lock scrolling.
- Do not animate every case-study image.
- Respect reduced-motion settings.
- Use hover states to reveal useful context, not just visual effects.

## E7. Portfolio anti-defaults

Avoid:

- vague "I create meaningful experiences" copy,
- giant lists of tools,
- project galleries without context,
- device mockups replacing real interface detail,
- overlong one-line paragraph chains,
- generic AI imagery,
- and decorative metrics without explanation.

---

# MODE F — BRAND AND SUB-BRAND SYSTEMS

Use for identity explorations, product families, app icons, media brands,
sub-brands, iconography, and application systems.

## F1. Intent

The identity must work as a system, not only as one polished logo.

Evaluate:

- recognition,
- silhouette,
- typography,
- small-size behavior,
- one-color use,
- light/dark use,
- icon-only use,
- sub-brand logic,
- and application consistency.

## F2. Ryan's brand tendencies

- Strong central mark.
- Validate the identity in one color before exploring gradients, dimensional effects,
  texture, or motion.
- Wordmarks and icons should each remain useful independently at app-icon, favicon,
  avatar, social, and small one-color sizes.
- **Dive Club logo reference:** use as a benchmark for good logo-design principles,
  not as a style to reproduce. Ryan values its clean typographic foundation, single
  ownable structural intervention, strong negative space, one-color viability, and
  small-scale recognizability.
- Simple geometry with a memorable interruption.
- Typography is part of the identity, not an afterthought.
- Limited palette.
- One repeated device can connect sub-brands.
- Icon families should share stroke, corner, fill, and optical-weight logic.
- Avoid presenting five tiny variations of the same idea when the task calls for
  five directions.

## F3. Exploration requirement

When asked for multiple concepts, vary the underlying idea:

- symbol logic,
- typographic construction,
- shape language,
- composition,
- and brand personality.

Do not only change:

- color,
- corner radius,
- minor line angle,
- or placement.

## F4. System deliverables

A chosen direction should define:

- primary lockup,
- secondary lockup,
- emblem,
- one-color marks,
- light/dark marks,
- minimum size,
- clear space,
- typography,
- palette,
- icon rules,
- sub-brand template,
- sample applications,
- and Figma-ready source organization.

---

## 4. RYAN'S CROSS-PROJECT PATTERN LIBRARY

These patterns recur across modes, but they should inherit the active mode's
tokens.

### 4.1 Evidence panel

A compact panel that translates a claim into proof:

- performance average,
- KPI,
- score,
- completion state,
- confidence,
- partner count,
- or usage result.

Use when the evidence changes the user's interpretation.

### 4.2 Guided complexity

For complicated choices:

- introduce the task,
- show current context,
- narrow the decision,
- explain unavailable options,
- summarize,
- then commit.

### 4.3 Split narrative

One side carries the statement or task; the other carries:

- evidence,
- imagery,
- product state,
- process,
- or comparison.

Use asymmetry with a strong grid, not arbitrary offset.

### 4.4 Structured list over card grid

Use lists when items share one information hierarchy and need rapid comparison.

Use cards only when items:

- behave independently,
- need distinct imagery,
- have multiple actions,
- or require a contained state.

### 4.5 State-first header

For live, guided, or operational products, the header should answer:

- where am I,
- what is happening,
- and what do I do next?

### 4.6 System-in-context documentation

Do not document tokens and components only in isolation. Show them in:

- real flows,
- state matrices,
- responsive examples,
- and code-aligned usage.

### 4.7 Before / decision / after

For case studies and stakeholder communication:

- show the original problem,
- the design decision,
- and the resulting experience.

This is stronger than a gallery of final screens.

### 4.8 Dark trust or culmination band

A darker section can mark:

- trust,
- service,
- product culmination,
- winner state,
- testimonial proof,
- or closing action.

Use it as structural punctuation, not a random color break.

---

## 5. TYPOGRAPHY JUDGMENT

Typography changes by mode, but the standards remain.

### 5.1 Choose roles before sizes

Define:

- display,
- page title,
- section title,
- component title,
- body,
- supporting body,
- label,
- caption,
- numeric/stat,
- and action.

### 5.2 Limit type families

Use:

- one primary family,
- plus at most one purposeful accent family.

PlayDraft's Rajdhani + Inter and Tire Rack's Gibson + Aleo are examples of a
reasoned pairing.

### 5.3 Line length

- Long-form body: generally 55–75 characters.
- Product body: shorter where scanning matters.
- Do not center multi-line paragraphs unless they are brief and promotional.
- Avoid giant text that causes awkward wrapping without adding meaning.

### 5.4 Uppercase

Uppercase is useful for:

- labels,
- compact section headings,
- stats,
- and competitive UI.

Do not set long sentences or dense body content in uppercase.

### 5.5 Numeric content

Use tabular numerals for:

- timers,
- scores,
- prices in aligned lists,
- data columns,
- and changing measurements.

---

## 6. COLOR JUDGMENT

### 6.1 Use project tokens first

Before choosing color:

1. Inspect local variables.
2. Inspect semantic tokens.
3. Inspect component bindings.
4. Inspect existing contrast usage.
5. Only add a color when the current system cannot express a required role.

### 6.2 Semantic roles

Every important color should have a job:

- action,
- link,
- selected,
- success,
- warning,
- error,
- information,
- premium,
- inactive,
- or decorative accent.

Do not use one color for contradictory meanings.

### 6.3 Accent discipline

Ryan's work is often strongest when the accent is scarce.

The accent should guide attention toward:

- the primary action,
- active state,
- key proof,
- or brand moment.

### 6.4 Accessibility

- Meet WCAG contrast.
- Never rely on color alone.
- Test disabled text and muted labels.
- Test both light and dark modes when applicable.
- Avoid low-contrast text inside gradients.

---

## 7. SPACING, GRIDS, AND SHAPE

### 7.1 Grid first

Use a stable grid and let variation happen within it.

- Editorial/portfolio may use more asymmetry.
- Enterprise and commerce should remain tighter.
- Mobile uses fewer columns but preserves alignment logic.

### 7.2 Spacing scale

Use a consistent spacing scale. Favor a 4px foundation with meaningful steps,
for example:

```text
4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96
```

Do not create accidental values unless optical adjustment requires it.

### 7.3 Corner radii

Use a small set tied to purpose:

- small controls,
- standard surfaces,
- prominent media,
- pill/chip only when semantics require it.

Do not use pill shapes for every label or control.

### 7.4 Borders and elevation

Prefer:

- hairline borders,
- subtle surface shifts,
- and restrained shadows.

Use elevation to communicate stacking or interaction, not to decorate every
container.

---

## 8. RESPONSIVE AND ADAPTIVE DESIGN

For every full-page or product-flow request, define desktop and mobile behavior.

### 8.0 Platform conventions first

For mobile products, begin with native iOS or Android conventions before introducing
custom navigation or control patterns. Platform familiarity is a usability asset.
Depart from native expectations only when the product gains more than the user loses,
and document that reason.

Bottom navigation should include text labels by default. Icon-only navigation is
appropriate only when the icons are exceptionally familiar, repeatedly learned in
context, and still accessible. Selected state must remain unmistakable.

Search is a complete product state, not a generic input placed above a grid. Design
search entry, active query, suggestions, filters, result hierarchy, empty states,
recovery, and long-tail results as a coherent flow.

### 8.1 Required responsive questions

- What is the primary task at each viewport?
- What content must remain visible?
- What can collapse?
- What needs a bottom sheet?
- What becomes sticky?
- What changes from hover to tap?
- What needs larger touch targets?
- What changes ordering?
- What breaks with real content?

### 8.2 Breakpoint behavior

Do not merely scale.

Examples:

- Desktop filter rail → mobile filter sheet.
- Overlapping evidence card → stacked evidence block.
- Multi-column process → vertical sequence.
- Product comparison table → prioritized rows or horizontal detail view.
- PlayDraft side panel → bottom sheet or tab.
- Portfolio sticky project nav → compact jump menu.

### 8.3 Mobile review

Test at least:

- `320px`,
- `375px`,
- `424px`,
- and one tablet/desktop width appropriate to the product.

---

## 9. CONTENT AND COPY TASTE

### 9.1 Ryan's copy bias

- Specific over abstract.
- Human over corporate.
- Plain over clever.
- Confident without hype.
- Reflective only when there is a concrete point.
- Avoid empty design-industry language.

### 9.2 Product copy

Buttons should describe the action:

- "Choose This Tire"
- "Add to Queue"
- "Lock In Pick"
- "View Trend"
- "Compare Options"

Avoid:

- "Learn More" when a specific destination exists,
- "Submit" when a more descriptive verb is possible,
- and vague motivational microcopy.

### 9.3 Portfolio copy

Avoid:

- "sits at the intersection,"
- "stuck with me,"
- "I've been thinking a lot about,"
- "meaningful experiences,"
- and AI-generated-sounding transitions.

Show the work through concrete decisions and outcomes.

---

## 10. OUTPUT TARGET A — HTML / CSS / REACT

When implementing:

1. **Inspect before inventing**
   - Reuse the project's tokens and components.
   - Do not import Tire Rack or PlayDraft values into unrelated work.

2. **Declare semantic tokens**
   - Keep primitives separate from semantic roles.
   - Components should consume semantic tokens.

3. **Choose the appropriate artifact**
   - Single-file HTML for prototypes and side-by-side concepts.
   - React component for reusable UI.
   - React application structure for product flows.
   - React Native patterns for PlayDraft/mobile app work.

4. **Responsive behavior is included**
   - Do not deliver a desktop-only prototype.
   - Implement the mobile/adaptive state in the same artifact when practical.

5. **Use semantic markup**
   - Real buttons.
   - Real labels.
   - Real disabled states.
   - Correct heading hierarchy.
   - Lists and tables where semantically appropriate.

6. **Represent all states**
   - Default.
   - Hover/focus.
   - Active/selected.
   - Disabled.
   - Loading.
   - Empty.
   - Error.
   - Success.
   - Product-specific live states.

7. **Accessibility**
   - Keyboard support.
   - Visible focus.
   - Reduced motion.
   - Contrast.
   - Appropriate ARIA only when native semantics are insufficient.

8. **Data realism**
   - Use believable content lengths and edge cases.
   - Do not fill a finished prototype with "Lorem ipsum."

9. **Verify**
   - Open or screenshot the result.
   - Check actual wrapping.
   - Check mobile.
   - Check the selected visual mode.
   - Check accent discipline.
   - Check that the page still communicates without decorative effects.

10. **Design QA**
    - Compare implementation against the intended hierarchy, tokens, spacing,
      and state logic.
    - Fix visible drift before declaring completion.

---

## 11. OUTPUT TARGET B — FIGMA VIA MCP

When building in Figma:

1. Load the relevant Figma-use/generation skill.
2. Inspect the current file before creating new foundations.
3. Search existing variables, styles, and components.
4. Identify the active visual mode.
5. Reuse local libraries before drawing new primitives.
6. Create variables before repeated hardcoded values.
7. Bind fills, strokes, typography, spacing, and effects where the system
   supports them.
8. Use auto layout for real component behavior.
9. Define component properties and variants deliberately.
10. Create responsive frames or min/max behavior appropriate to the project.
11. Use real content.
12. Include edge/state frames.
13. Add annotations for behavior that cannot be inferred visually.
14. Screenshot and inspect the result.
15. Compare against the pre-flight checklist.

### Figma naming

Use the existing file's conventions first.

When no convention exists:

```text
Page / Feature / State / Breakpoint / Iteration
```

Examples:

```text
Category / Winter / Default / Desktop
Category / Winter / Default / Mobile
DraftRoom / ActiveTurn / iPhone
DraftRoom / Waiting / iPhone
CaseStudy / WheelRack / Desktop / v2
```

### Figma component documentation

For system work, document:

- purpose,
- anatomy,
- variants,
- behavior,
- content guidance,
- accessibility,
- responsive rules,
- implementation notes,
- and code mapping only when an approved production component or Code Connect-style
  relationship actually exists.

---

## 12. OUTPUT TARGET C — DESIGN CRITIQUE

When Ryan asks for critique, do not give generic praise followed by vague
suggestions.

Evaluate in this order:

1. Product and audience fit.
2. Visual mode fit.
3. Hierarchy.
4. Task clarity.
5. Content structure.
6. State clarity.
7. System consistency.
8. Responsive behavior.
9. Accessibility.
10. Visual craft.
11. Implementation risk.
12. Opportunities for a stronger idea.

Use direct language:

- "The primary action is competing with..."
- "This is visually polished, but the state model is incomplete because..."
- "These should be rows, not cards, because..."
- "The accent has lost meaning because it appears on..."
- "The mobile version preserves the layout but not the task priority..."
- "This pattern should become a component because..."
- "This should remain local because the reuse case is not established..."

Offer a specific correction, not only a diagnosis.

---

## 13. OUTPUT TARGET D — CASE-STUDY OR PORTFOLIO ARTIFACT

When creating or revising portfolio work:

1. State the case-study thesis in one sentence.
2. Identify the audience.
3. Lead with the strongest outcome or complexity signal.
4. Make Ryan's role explicit.
5. Show the problem before the gallery.
6. Connect visual decisions to evidence.
7. Show the system underneath the screens.
8. Show responsive and implementation detail.
9. Include metrics with context.
10. End with a credible reflection, not a victory lap.

Every featured project should answer:

> What did Ryan uniquely bring to this work that another designer might not?

Typical answers include:

- front-end fluency,
- component and token thinking,
- implementation realism,
- high-fidelity visual craft,
- cross-functional translation,
- data-informed optimization,
- AI-native prototyping,
- or governance.

---

## 14. AI-NATIVE SELF-GOVERNANCE

For larger tasks, use the skill as a review harness.

### 14.1 Before generating

Check:

- active mode,
- user task,
- system source of truth,
- constraints,
- success measure,
- and required states.

### 14.2 During generation

Audit:

- token drift,
- component duplication,
- spacing inconsistency,
- off-brand copy,
- missing mobile behavior,
- accessibility issues,
- and unsupported assumptions.

### 14.3 After generation

Run a self-review:

```text
1. Does the user know what this is within five seconds?
2. Is the primary action unmistakable?
3. Is evidence near the claim?
4. Does the interface expose the right amount of complexity?
5. Are states explicit?
6. Are repeated patterns truly reusable?
7. Does mobile preserve the task?
8. Does the accent still have meaning?
9. Does the implementation match the design intent?
10. Is there any element that exists only because AI commonly generates it?
```

Remove or revise anything that fails question 10.

---


## 15. CURRENT INDUSTRY PATTERN LAYER — RYAN'S SAVED REFERENCES

This section captures current interface patterns Ryan is actively drawn to from
saved Mobbin references. These are not permanent rules. They are a contemporary
pattern layer that should be used selectively when they improve clarity,
identity, product comprehension, or interaction.

The recurring signal across the saved references is not "trendiness" by itself.
It is **confident reduction**: fewer competing elements, clearer starting
points, stronger visual framing, and one dominant interaction or story per
surface.

### 15.1 Guided starting points instead of blank canvases

References: Jitter onboarding, Relevance AI onboarding.

Ryan is drawn to onboarding that helps users choose a path immediately rather
than dropping them into an empty workspace.

Use:

- one clear question at the top,
- two to four distinct starting paths,
- a short explanation of who each path is for,
- visual previews inside each option,
- a low-emphasis escape route for experienced users,
- and an explicit promise that the choice is reversible when true.

The cards should represent meaningfully different workflows, not the same
action with different artwork.

This pattern connects directly to Ryan's AI philosophy: good AI-assisted design
solves the blank-canvas problem without removing authorship. The interface
should help a user begin while preserving their ability to change direction.

Avoid generic setup wizards, cards that differ only by color, forcing a
permanent choice too early, or using "AI" as the only explanation of value.

### 15.2 One dominant action supported by one strong visual story

References: Bard landing page, MasterClass acquisition page.

Ryan responds to large, simple compositions where one side carries the value
proposition and the other side demonstrates the product or emotional outcome.

Use:

- a single dominant heading,
- one supporting paragraph,
- one primary action,
- one visual narrative,
- and generous unoccupied space.

The visual may be an authentic lifestyle image, a product flow, a collage of
real usage, or a live media composition.

Do not add secondary feature rows above the fold unless they are necessary for
trust or task completion.

The composition should feel decisive rather than empty. Large whitespace must
be supported by strong scale, crop, alignment, and typography.

### 15.3 Editorial asymmetry with controlled modularity

References: MasterClass, Portrait profile builder.

Ryan is drawn to layouts that feel composed rather than templated:

- staggered image fields,
- varied module sizes,
- strong vertical rhythm,
- deliberate negative space,
- and a stable underlying grid.

Use this in portfolio work, brand storytelling, discovery surfaces, editorial
landing pages, and creator/profile experiences.

The modules may vary in size, but their alignment, radii, gutters, and optical
weight must still feel systemic.

Do not turn this into a generic masonry feed. Each module should have a distinct
role in the narrative.

### 15.4 Workspace as canvas, controls as a light perimeter

References: Evernote drawing canvas, Portrait builder.

Ryan is drawn to creator tools where the content or artifact owns the center of
the screen and controls recede to the perimeter.

Use:

- a large uninterrupted work surface,
- compact tool groups,
- contextual controls,
- floating or edge-anchored actions,
- and clear separation between creation and publishing/commit actions.

Controls should be discoverable without visually competing with the work.

Use grouped floating controls only when the task is direct-manipulation-heavy,
the number of actions is limited, and their placement is stable.

Avoid floating chrome for dense enterprise tasks where persistent labels are
more useful than icon-only controls.

### 15.5 Split-pane operational tools

References: Adobe Express character editor, Expensify chat.

Ryan is drawn to interfaces that divide preview or working context from controls
without hiding either.

Use:

- preview or active content on one side,
- structured controls on the other,
- visible tabs or categories,
- direct manipulation where possible,
- and an anchored completion action.

This is especially appropriate for configurators, editors, character/avatar
builders, product customization, data setup, and AI-assisted generation.

The split should map to the task, not simply divide the page in half.

On smaller screens, convert the control side into a bottom sheet, stepped panel,
full-screen edit state, or progressive disclosure.

### 15.6 Softly immersive onboarding and empty states

Reference: Expensify Concierge.

Ryan is drawn to onboarding that adds warmth and product identity without
reducing utility.

Use:

- a branded illustration field,
- a clear human welcome,
- a visible first action,
- contextual guidance,
- and subtle personality.

Illustration should establish tone or explain the product world. It should not
become decorative wallpaper behind important controls.

The product should feel inhabited, but the next action must remain obvious.

### 15.7 Brand-forward product ecosystems

Reference: Fantasy Signal Desk identity family.

Ryan is drawn to sub-brands that share a strong parent system while allowing
each product to own a distinct name, icon, and use case.

Use:

- a common core mark or geometry,
- a shared typographic system,
- repeatable lockup rules,
- distinct product descriptors,
- and one controlled accent family.

Sub-brands should feel related at a glance without becoming clones.

For product families, define what remains fixed, what may vary, how names are
structured, how icons inherit geometry, and how the system behaves at app-icon
scale.

Avoid treating each sub-brand as a completely separate logo exercise.

### 15.8 Strong display typography paired with quiet UI text

References: MasterClass, Fantasy Signal Desk, Bard.

Ryan is drawn to systems where expressive display type carries identity while
the supporting UI remains restrained and readable.

Use:

- one strong display voice,
- a quieter body/UI family,
- disciplined role separation,
- and high contrast between statement and support.

Display typography may be condensed, geometric, wide-tracked, or editorial,
but it must fit the brand and remain legible at intended sizes.

Do not use expressive type for dense controls, forms, or long reading.

### 15.9 Bordered option cards with real previews

References: Relevance AI, Jitter.

For path selection and onboarding, Ryan prefers cards that show the actual
product or workflow rather than decorative illustration alone.

Each option card should include:

- a visual preview,
- a concise category label,
- a clear title,
- a plain-language description,
- and a distinct selected/focus state.

Keep the interaction model obvious. The entire card should usually be
selectable.

Use low-radius or moderate-radius containers, not oversized pills.

### 15.10 Restrained gradient use

References: Jitter, Relevance AI, PlayDraft.

Ryan is open to gradients when they serve one of three roles:

1. defining a branded product world,
2. separating pathways or modes,
3. creating a controlled focal moment.

Gradients should not replace hierarchy.

Use broad, quiet fields, soft preview backgrounds, premium or expressive
states, and limited branded transitions.

Avoid gradient text for routine headings, gradients on every button, rainbow
borders without semantic meaning, and high-saturation backgrounds behind dense
content.

### 15.11 Current radius and surface direction

Across these references, Ryan prefers a mixed-radius system rather than one
radius everywhere.

Use:

- modest radii for controls and operational panels,
- larger radii for photography, previews, and expressive modules,
- square or nearly square structures when a technical or editorial tone needs
  more authority,
- and pills only for compact status, tags, or segmented choices.

Surfaces should feel quiet and stable. Shadows are secondary to spacing,
contrast, and borders.

### 15.12 Current navigation direction

The saved references favor navigation that is:

- minimal at the top level,
- task-focused,
- contextual inside the product,
- and willing to use side rails when the information architecture benefits.

Use short global navigation, a clear persistent product identity, a visible
primary action, contextual side navigation for multi-workspace tools, and local
tabs for mode changes.

Do not overload the global header with every available destination.

---

## 16. RYAN'S LINKEDIN DESIGN PHILOSOPHY

These principles should influence design decisions, critique, implementation,
case studies, and AI-assisted generation.

### 16.1 Consideration is the work

Ryan's core belief is that consideration is what makes design matter.

Tools can infer steps, generate alternatives, and accelerate production, but
the designer remains responsible for:

- intent,
- context,
- judgment,
- sequencing,
- constraints,
- and the effect of what ships.

Do not skip a step simply because a prompt can.

When generating, ask:

- What did the tool infer?
- Was that inference appropriate?
- What context is missing?
- What decision still requires human judgment?
- What downstream effect will this create?

The quality of the outcome depends less on how much the tool can produce and
more on whether the designer maintained care through the process.

### 16.2 AI should solve the blank canvas, not remove authorship

Ryan uses AI to get from 0 to 80% in a fraction of the time.

That means creating a structured first pass, exposing options, accelerating
prototyping, building reusable starting points, and reducing low-value setup
work.

The remaining 20% is not polish alone. It includes judgment, simplification,
systems thinking, taste, edge cases, implementation quality, and responsibility
for the final decision.

AI-assisted output should feel authored, not accepted.

### 16.3 The designer's role is moving into the space between prompt and product

Ryan is increasingly focused on the in-between work that tools tend to infer:

- preference,
- framework choice,
- interaction logic,
- content structure,
- token use,
- accessibility,
- responsive behavior,
- and what "good" means for the specific brand.

The future design artifact may include reusable skills, design principles,
FigJam decision maps, code-framework preferences, machine-readable
documentation, design-system rules, and product-specific evaluation criteria.

Treat these artifacts as part of design practice, not supporting paperwork.

### 16.4 Governance should happen where work happens

A design system should not stop at a Figma canvas.

It should exist across Figma, code, Storybook, Markdown, documentation,
component APIs, content rules, QA processes, and AI-readable context.

The source of truth may be distributed, but the decisions must remain coherent.

Governance is not an audit performed after the work. It should guide decisions
inside the tools where work is created.

### 16.5 The quality of a system is the quality of its context

A capable component library can still produce poor work when the surrounding
context is weak.

A useful system must explain:

- why a pattern exists,
- when to use it,
- when not to use it,
- how it behaves,
- what tradeoffs it encodes,
- and how it should evolve.

For AI-assisted work, context is especially important. The tool needs more than
tokens and components; it needs principles, relationships, constraints, and
examples of judgment.

### 16.6 Adoption, ownership, and governance define whether a system is real

Do not describe a library as a complete design system unless it addresses:

- adoption,
- ownership,
- contribution,
- versioning,
- documentation,
- QA,
- and long-term maintenance.

A system is successful when teams trust it, use it, extend it responsibly, and
ship more coherent work because it exists.

### 16.7 Craft is not a personal performance

Ryan cares deeply about visual craft, but not as a solo display of taste.

Craft should help users understand the product, engineering implement it
accurately, teams align, brands remain coherent, and the final shipped
experience feel intentional.

The strongest designer is not the person who owns every decision. It is the
person who raises the quality of the system and the team around the work.

### 16.8 Design must hold up in production

A design is not successful because the mockup looks right.

It must hold up across real content, real data, real breakpoints, real states,
real performance constraints, real implementation, and real maintenance.

Design and implementation are one quality continuum.

### 16.9 Ideas can come from anywhere; systems determine whether they scale

As AI makes visual production more accessible, more people can contribute
ideas.

The designer's role increasingly includes creating principles, guardrails,
systems, evaluation standards, and reusable foundations that help good ideas
become coherent products.

Do not protect design quality by restricting participation. Protect it by making
the standards visible, usable, and embedded in the workflow.

### 16.10 Taste still matters more as tools become more capable

When tools can generate competent screens quickly, differentiation shifts
toward what is selected, removed, emphasized, consistent, appropriate, and
cared for through implementation.

Taste is not a visual preset. It is a pattern of judgment.

### 16.11 Design-system decisions should be legible to people and machines

When creating system guidance, write it so that both a designer and an AI tool
can understand:

- the principle,
- the trigger,
- the constraint,
- the preferred pattern,
- the exception,
- and the validation method.

Avoid vague rules such as "keep it clean" or "make it modern."

Prefer operational guidance such as:

> Use a split-pane editor when users need continuous preview while changing a
> structured set of controls. On mobile, move controls into a full-screen edit
> state or bottom sheet. Do not use a split pane when the preview is not needed
> to make the decision.

### 16.12 AI output requires a visible quality loop

Every AI-assisted design task should include:

1. generation,
2. comparison,
3. critique,
4. system check,
5. implementation check,
6. refinement,
7. final human approval.

Do not frame the first generated answer as the finished artifact.

---

## 17. REFERENCE-DRIVEN DESIGN RULES

When Ryan provides inspiration screenshots:

1. Identify the underlying pattern, not only the styling.
2. Name what the pattern is solving.
3. Separate durable principle from temporary visual trend.
4. Preserve the target product's own brand and system.
5. Combine no more than two dominant reference ideas on one surface.
6. Do not reproduce another product's distinctive identity, artwork, or exact
   composition.
7. Translate references into hierarchy, layout logic, interaction model,
   density, motion, and system rules.
8. State what should not be copied.
9. Validate the adapted pattern against the target audience and task.
10. Record approved patterns in the industry pattern layer rather than silently
    changing the permanent core principles.


## 18. COMMITTED SIMPLICITY, SYSTEM, AND CODE RULES

These decisions are permanent defaults unless a project brief provides a stronger
product-specific reason to depart from them.

### 18.1 Simplicity as resolved complexity

- Quiet system chrome with expressive content is the default for dark mobile products.
- Favor one dominant visual or interaction idea per screen, even when that means
  showing fewer secondary features.
- Large whitespace must be earned through strong typography, imagery, composition, or
  focus. It is never a substitute for hierarchy.
- Gradients are reserved primarily for identity, premium states, celebration, and
  major focal moments.
- Simplicity does not mean fewer elements by default. It means fewer unresolved
  decisions exposed to the user.
- Reveal complexity in the order it becomes useful.
- Keep product and system chrome quieter than the content it supports.

### 18.2 Platform-aware mobile design

- Start from native iOS or Android conventions before inventing custom patterns.
- Bottom navigation includes text labels by default.
- Search is designed as a complete state and flow, including entry, query, filters,
  ranking, recovery, empty states, and result-type differences.
- Custom navigation must demonstrate a measurable clarity, product, or brand benefit.

### 18.3 Brand-system defaults

- Prove every identity in one color before effects are explored.
- Validate wordmarks and icons independently at app-icon, favicon, avatar, and small
  one-color sizes.
- Treat the Dive Club wordmark only as a principle reference: simple type plus one
  memorable structural intervention. Do not imitate its exact letterforms or mark.

### 18.4 Shared system language

Names across Figma, code, documentation, and analytics must align whenever they refer
to the same concept. Avoid parallel vocabularies for the same component, state,
variant, property, or event.

A new component is justified by shared purpose, behavior, state, and maintenance—not
visual resemblance alone.

Every system rule must include:

1. when to use it,
2. when not to use it,
3. supported states,
4. responsive behavior,
5. and implementation notes.

Explicit code mapping is not mandatory for every reusable component. Add it when an
approved production component exists or when the mapping materially reduces ambiguity.

Prefer simple local code over premature shared abstraction when reuse has not been
demonstrated. Abstract after the repeated purpose and behavior are understood.

AI-generated code should inspect existing components and tokens first, but it is not
required to reuse them when they are a poor semantic or behavioral fit. Explain why a
new pattern is necessary.

### 18.5 Claude Code project reference structure

For every Claude Code project prompt, create or maintain an indexed project reference
folder so the system can inspect core UI decisions before generating new work.

Preferred structure:

```text
project-root/
  references/
    README.md
    core-ui-elements/
      README.md
      components/
      patterns/
      states/
      responsive/
      accessibility/
      code-snippets/
```

Requirements:

- `references/README.md` explains how the reference system is organized and what is
  authoritative.
- `core-ui-elements/README.md` indexes the foundational UI elements and links to the
  relevant files.
- `components/` documents shared component purpose, anatomy, variants, and states.
- `patterns/` documents larger interaction and layout patterns.
- `states/` contains loading, empty, error, success, disabled, and product-specific
  state examples.
- `responsive/` documents breakpoint and adaptive behavior.
- `accessibility/` records interaction, contrast, keyboard, focus, and reduced-motion
  requirements.
- `code-snippets/` contains approved implementation examples, usage patterns, and
  small code references. It is a reference library, not a dumping ground for generated
  fragments.

Index this folder before creating new UI. Update it when a decision becomes reusable.
Do not create documentation files that merely repeat source code without explaining
intent or usage.

### 18.6 Case-study quality

Every case study should connect:

- user behavior,
- product metric,
- business goal,
- and Ryan's specific contribution.

Visual craft remains a major quality bar, but evaluate it alongside adoption,
implementation quality, system integrity, measurable impact, and what actually shipped.

### 18.7 AI-assisted work is draft-first

The first AI-generated solution is a structured draft by definition, never the finished
answer.

Every AI-assisted task must use a visible quality loop:

```text
generation
  → critique
    → system check
      → implementation check
        → refinement
          → human approval
```

Before presenting the draft, state:

- what was inferred,
- which source-of-truth materials were used,
- which assumptions remain,
- and which decisions still require human judgment.

Do not hide uncertainty behind polished output.

---

## 19. GLOBAL ANTI-DEFAULTS

Never default to:

- purple-to-blue SaaS gradients,
- glassmorphism,
- Inter plus slate as an unexamined choice,
- a giant centered headline with three equal feature cards,
- icons inside decorative circles,
- pill-shaped everything,
- excessive rounded rectangles,
- fake testimonials,
- meaningless dashboard charts,
- ambient animated blobs,
- scroll hijacking,
- excessive one-line paragraph fragments,
- hidden complexity that users need to decide,
- or a polished desktop frame with no real mobile behavior.

Do not confuse "minimal" with unfinished.

Do not confuse "systematic" with visually generic.

Do not confuse "expressive" with inconsistent.

---

## 20. PRE-FLIGHT CHECK

### Design read

- [ ] Product/page kind identified.
- [ ] Audience and task identified.
- [ ] Visual mode selected.
- [ ] Dials set.

### Product clarity

- [ ] Primary state is clear.
- [ ] Primary action is clear.
- [ ] Content hierarchy supports the task.
- [ ] Evidence is near important claims.
- [ ] Empty, loading, disabled, error, and success states are considered.

### System quality

- [ ] Shared names align across Figma, code, documentation, and analytics.
- [ ] Every system rule states when to use, when not to use, states, responsive behavior, and implementation notes.
- [ ] Existing tokens/components were inspected.
- [ ] New tokens have semantic roles.
- [ ] Components are reused only where behavior and purpose align.
- [ ] Responsive behavior is defined.
- [ ] Documentation/governance is included when this is system work.
- [ ] Design-to-code implications are considered.

### Visual craft

- [ ] Typography roles are clear.
- [ ] Accent use is disciplined.
- [ ] Spacing follows a coherent scale.
- [ ] Corners, borders, and elevation are purposeful.
- [ ] Icons share optical weight.
- [ ] Image crops support the story.
- [ ] No generic AI defaults slipped in.

### Responsive and accessibility

- [ ] Mobile begins with native platform conventions unless a departure is justified.
- [ ] Bottom navigation uses text labels unless icon familiarity is exceptional.
- [ ] Search is treated as a complete state and flow when present.
- [ ] Mobile is designed, not cropped.
- [ ] Touch targets are appropriate.
- [ ] Focus and keyboard behavior are defined.
- [ ] Color is not the only state signal.
- [ ] Contrast is acceptable.
- [ ] Motion respects reduced-motion preferences.

### AI quality loop

- [ ] The first generated solution is treated as a structured draft.
- [ ] Inferences, source materials, assumptions, and human decisions are stated.
- [ ] Generation, critique, system check, implementation check, refinement, and human approval are represented.

### Mode-specific

- [ ] Tire Rack: red is reserved for action/brand emphasis.
- [ ] WheelRack/system: tokens, component contracts, adoption, and governance are
      addressed.
- [ ] LoopStack/data: trends and confidence are clearer than the raw data.
- [ ] PlayDraft: turn, timer, pick state, and availability are unmistakable.
- [ ] Portfolio: problem, role, decisions, system, shipped work, and outcome are
      all visible.
- [ ] Brand: the idea works as a scalable identity system, not only one logo.

---

## 21. DELIVERY FORMAT

Before delivering, include:

1. The one-line design read.
2. The selected visual mode.
3. The dial settings.
4. The artifact.
5. A brief validation summary covering:
   - hierarchy,
   - system use,
   - responsive behavior,
   - accessibility,
   - and mode-specific checks.

Do not over-explain routine choices. Show the quality in the artifact and use
the validation summary to surface only the decisions that matter.
