# WheelRack case-study polish proposal

Reviewed September 19, 2026. Recommendations and draft copy; no page implementation or publication changes.

Reading this as a senior product-design case study for hiring teams, prioritizing narrative, visible evidence, and credible ownership. Keep the existing portfolio typography, orange annotations, media framing, and responsive system.

## Editorial direction

**Show how one shared system handled the difficult parts of a dealer purchasing journey.**

The strongest argument connects product judgment, reusable component behavior, and collaboration through implementation. Token and component counts support that argument. Front/rear configurations, partner actions, responsive filters, and recovery states make it tangible.

The current page makes readers pass through Problem, Gaps & Opportunity, and eight Constraints before reaching detailed work. Problem and Gaps repeat the absence of a shared system. Later takeaways repeat the QA hours, fitment complexity, and timeline. Compress those repetitions and spend the recovered space explaining actual decisions.

## What the reference contributes

[Ness Grixti’s Wise onboarding study](https://nessgrixti.com/portfolio/wise-design-onboarding/) connects each intervention to the problem or feedback that prompted it. Large artifacts punctuate the explanation, and consistent text/image groupings make a substantial story feel manageable. Borrow that causal structure and predictable rhythm. WheelRack needs its own product and implementation evidence.

## Proposed opening

**WheelRack: A shared system for the dealer journey**

> WheelRack’s dealer experience had grown across six retail partners without a shared design system or responsive foundation. I built its first token and component library and redesigned the journey from vehicle selection through checkout, partnering with Cheryl Carpenter on the React implementation.

Ownership line: **I owned system design, component behavior, responsive rules, and edge cases. Cheryl owned the React build.**

Show a large, legible product view immediately after the opening. Keep the system cover as a supporting identity image or thumbnail. The existing hero puts a system collage inside a device, which makes the actual work smaller. The supplied Wheel Details thumbnail also spends considerable space on a laptop and version label. A direct product frame gives the reader more useful information.

Present the existing timeline as separate facts: design period 2023–2024; approximately four months of dedicated design across 12+ elapsed months; launch June 2026, as stated by the current case study. Confirm chronology before final publication. “Time to Live” currently mixes launch and rollout, while a generic “[ In Progress ]” footer can look like contradictory project status. Label that footer as ongoing notes instead.

## Proposed reading order

This is a story outline, not a new design-process methodology. Preserve the portfolio’s canonical process and its five Approach subsections.

### 1. Establish the problem once

Use roughly 70–100 words to explain the dealer/tablet context, fragmented partner experiences, and the need for a shared foundation. Give ownership beside the opening instead of hiding it under Gaps.

Remove the 80+ hour course from the main narrative. It can support a separate learning story, but here it delays evidence of senior judgment. Move methodology changes, scheduling interruptions, and photography logistics to optional context unless a specific decision depends on them.

If the shared shell retains separate Problem/Gaps/Constraints sections, keep each brief and give it a distinct purpose: user problem, missing shared rules, and the two or three product constraints. A later template refinement could support a combined context section for WheelRack without changing every study.

### 2. Five decision-and-evidence subsections

| Proposed subsection | Explanation to develop | Primary evidence |
|---|---|---|
| Define the journey around dealer tasks | Explain the relationship between vehicle selection, visualizer, results, details, and checkout. Describe why visualization and purchasing information needed distinct roles. | Existing annotated journey; one real tablet capture if available. |
| Give partner variations a shared foundation | Connect token roles and component rules to partner differences. Show a verified example rather than an entire palette. | Small primitive/token excerpt plus the corresponding control or product surface. |
| Resolve fitment inside the product component | Explain front/rear sizes, finishes, quantities, pricing, and Add to Cart versus Get Quote. Include unavailable combinations as part of the specification. | `productDetails.png` and `Front and Rear error states.png`, cropped to legible examples. |
| Make the rules usable by engineering | Explain what documentation specifies: states, sizes, usage boundaries, keyboard focus, and responsive behavior. Keep Cheryl’s implementation ownership explicit. | `Documentation_form-elements.png`; existing attributed Cheryl testimonial. |
| Check the implementation and feed corrections back | Retain the candid 40+ hour reconciliation detail once. Name one actual mismatch and how it was resolved if evidence exists. | Existing annotated proof; an actual Figma/build comparison if available. |

Target one claim, a short explanation, one primary visual, and one useful caption per subsection. Vary evidence scale: product view, component detail, documentation excerpt. Avoid turning every artifact into a same-sized card. Preserve readable text widths; use the existing wider media treatment where it improves legibility.

### 3. End on operational value

Lead with the shipped journey and the framework’s subsequent reuse in Wholesale, as reported in the existing case study. Then show 200+ tokens and 50+ components as scope. Keep partner growth from six to ten, with the existing attribution caveat nearby; do not imply that design alone caused adoption.

Bring Cheryl’s existing testimonial close to the collaboration claim. A useful verbatim excerpt already in `src/components/Testimonials.tsx` is: “That gave us one vocabulary to work from instead of two, and it made my half of the work a lot easier to do well.” Attribute it to Cheryl Carpenter, React Front-End Developer and WheelRack build partner.

Replace the four repeated takeaways with one specific lesson: the shared vocabulary still needed a reconciliation pass across design and implementation. If a concrete disagreement or correction can be documented, that example is stronger than hours alone.

## New screenshot placement manifest

Sources remain in `/Users/ryandeboer/Library/Mobile Documents/com~apple~CloudDocs/wheelrack/`. All supplied screenshots are evidence of designed/documented states; they do not independently verify shipped behavior. No derivatives have been created.

| Source | Recommended placement and treatment | What it proves / draft alt text |
|---|---|---|
| `Design System cover.png` | Supporting cover or thumbnail; use at most once. Prefer direct product imagery for the opening. | Overview of WheelRack typography, color, and component work. |
| `Thumbnail.png` | Secondary option; replace embedded version/date text and device-heavy framing with a direct product export in a later asset pass. | Wheel detail interface with size, finish, quantity, and purchase controls. |
| `Documentation_form-elements.png` | Highest-priority system artifact. Pair a readable usage-rule excerpt with a close view of input states. Keep the full board available in the lightbox. | Form documentation with input sizes, focus/error/disabled states, and usage guidance. |
| `productDetails.png` | Highest-priority component artifact. Extract two or three comparable variants; use the full board only as optional depth. | Product component variants for front/rear configurations and cart or quote actions. |
| `Front and Rear error states.png` | Highest-priority product artifact. Show one normal view and one recovery/availability state. Remove the large empty canvas from the presentation. | Dealer visualizer screens covering available configurations and unavailable results. |
| `Front/Rear Details Page and Error States.png` | Show one desktop/phone pair or a focused state sequence. Inspect and annotate the exact warning being discussed. | Responsive wheel detail screens with warning states. |
| `Accordion.png` | A focused supporting example of expanded, selected, and keyboard-focus states. Avoid fitting the whole board into the reading column. | Wheel filters with desktop/mobile variants and interaction states. |
| `Primatives_color.png` | Use one small excerpt tied to a real semantic role and component. Optional full board. | Documented primary, neutral, and feedback color scales. |
| `Primatives_text.png` | Use only if explaining a specific partner typography exception. Otherwise optional depth. | Typography documentation showing the default family and a partner-specific exception. |
| `Primatives_other.png` | Optional depth; low value as a standalone main-story image. | Spacing, radius, dimension, and icon-size variable documentation. |

Before using documentation crops, resolve the three placeholder “Badge” labels on the form board and confirm the capture chronology. The page says the original work predated Figma Variables, while these boards discuss variables. If recently updated, caption them as current documentation of the original system. Do not imply that all guidance shown was available at original delivery or that written accessibility guidance proves implementation compliance.

## Motion recommendation

Use one controlled, approximately 12–16 second sequence of related product-component states. Proposed order, subject to inspecting exact crops:

1. Standard configuration, held for 3–4 seconds.
2. Front/rear configuration, aligned to the same purchase-control area.
3. Quote-action variant, with a caption identifying the partner behavior.
4. Availability warning and the documented recovery information.

Label the sequence “Component variants” when assembled from screenshots. These frames compare states; they do not prove a user performed the transitions. Avoid simulated cursor movement or fabricated interaction. Keep labels as readable page text where possible and retain a still image that carries the core explanation.

For the website, prefer a controlled video or user-controlled sequence with a poster and reduced-motion fallback. The portfolio already has video, poster, and pause/play support, so a new media system is unnecessary. Use simple cuts or restrained crossfades. Do not cycle unrelated color, typography, accordion, and product boards as a general slideshow: the reader loses the opportunity to compare a stable subject.

If a real prototype/live recording is available, a separate short view of finish or size selection changing the product would be stronger interaction evidence. Only depict behavior actually recorded.

## Evidence ledger and remaining gaps

| Claim | Evidence inspected | Classification / limitation |
|---|---|---|
| Ryan owned design; Cheryl owned React implementation | Current study and named testimonial in the repository | Explicit existing authorship record; preserve it. |
| System contains 200+ tokens and 50+ integrated components | Current published study and source data | Existing reported counts; no underlying library inventory audited. |
| Product handles multiple fitment, purchase, and error states | Supplied design boards | Designed; live behavior not independently tested. |
| Form and variable guidance is documented | Supplied documentation boards | Documented; date and historical use need confirmation. |
| Launch June 4, 2026; six-to-ten partner growth; later Wholesale reuse | Current case-study copy | Existing reported outcomes; no analytics, launch record, or reuse repository audited. Preserve caveats. |

Highest-value additional evidence, in order:

1. **One real implementation correction:** matched Figma and React captures of the same component, same viewport and state, plus a sentence stating what changed. Direct exports, no device frame; aim for at least 1600px total width. This earns the QA and collaboration story.
2. **One tablet state:** the actual dealer view at a known tablet breakpoint/orientation, ideally filters open with purchasing controls visible. Export at 2× if available, no decorative device frame. The current narrative emphasizes tablets, while new complete-screen boards primarily show desktop and phone.
3. **One verified partner comparison:** same component and viewport, showing exactly what stays shared and what changes. Two direct exports with short annotations. The typography board suggests an exception but does not establish the complete theme architecture.

Do not delay the editorial cleanup for these captures; the supplied boards already support a much stronger story.

## Five credible hiring signals

- Product judgment: complex fitment and availability rules are visible in the component designs.
- Systems thinking: repeated behavior is specified across product, filter, and form variants.
- Implementation fluency: the existing narrative and testimonial describe shared terminology and design/build reconciliation.
- Cross-functional partnership: Cheryl’s named ownership and testimonial support the collaboration claim.
- Operational reach: the reported reuse in Wholesale suggests the framework mattered beyond its first delivery; retain the current evidence qualification.

## Review scope

Read the complete Wise reference text and inspected its desktop opening and section rhythm. Read the current WheelRack page in Chrome, the full WheelRack project record, relevant shared page/media rendering, portfolio rules, testimonial, and asset inventory. Visually reviewed the ten supplied boards. The taste skill’s referenced supplementary files are absent; its available core guidance and the repository’s design/product rules informed this proposal.

No production behavior, underlying Figma library, analytics, responsive implementation, or video encoding was tested. No source images, page code, access gates, or deployment state changed.
