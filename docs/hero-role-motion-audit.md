# Hero role text — motion opportunity pass

Reading this as a portfolio introduction for product-design hiring teams, prioritizing clear role selection, stable copy, and a small expressive interaction.

## Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | src/components/Hero.tsx:124 | Role copy remounts with an offset entrance and a transient outline. | Feedback; preventing a jarring content change | Occasional pointer selection in a marketing hero | Select the panel row immediately. Run a branded ring once for 400ms, rotating −35° → 265° linearly; presence opacity 0 → 1 → 0, scale .92 → 1 → .96, using the existing cubic-bezier(.2,.7,.2,1). Dim the old paragraph to .28 opacity, shift 4px and blur 4px over 90ms; replace copy at 400ms and clear over 90ms. Use existing orange, icon-size and radius tokens. Reserve the tallest paragraph's height. Keyboard and reduced-motion selections update immediately. |

The user explicitly requested the 400ms presentation beat and blur. Those are deliberate exceptions to this skill's default sub-300ms UI budget and transform/opacity-only recommendation. This is a bounded marketing interaction, not actual AI generation or fetching. Paper's active app indicator could not be observed; its published Pulsing Border contour is the visual reference: https://shaders.paper.design/pulsing-border.

## Rejected candidates

- Replaying on the already-selected role — rejected by purpose: no state change to explain.
- Delaying keyboard selection — rejected by frequency/function: navigation must remain immediate.
- Showing an orb on page load or keeping it running at rest — rejected by purpose: no user-triggered role change is underway.
- Adding hover motion to each layer row — rejected by function: the selected state already provides clear feedback.

## Verdict

Keep motion isolated to the paragraph change. Preserve the existing panel, portrait, typography, and mobile product-designer paragraph. Rapid selections cancel pending replacements; the latest title wins. The opportunity pass is read-only; the separate implementation follows the user's explicit request to build this interaction.

Approved October 5, 2026: halve the initial 800ms beat and publish. The ring now runs for 400ms; blur/reveal transitions run for 90ms.
