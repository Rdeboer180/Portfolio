---
name: Ryan DeBoer Portfolio
description: A working designer's bench — flat, precise, and honest about the making, with Signal Orange as the one voice.
colors:
  signal-orange: "#f03d01"
  orange-deep: "#c23001"
  orange-muted: "#f07654"
  orange-soft: "#f9c4b0"
  orange-tint: "#fdede9"
  ink: "#1b1b1b"
  slate: "#4a4a4a"
  graphite: "#707070"
  hairline: "#e5e5e5"
  mist: "#f5f5f5"
  paper: "#ffffff"
  cool-paper: "#f4f6f7"
  steel: "#8f9daf"
  steel-dark: "#5e6c7c"
  steel-light: "#d6dce4"
  border-hairline: "rgba(27, 27, 27, 0.1)"
typography:
  display:
    fontFamily: "Hubot Sans, Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Hubot Sans, Inter, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hubot Sans, Inter, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Hubot Sans, Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  annotation:
    fontFamily: "Caveat, 'Segoe Script', cursive"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "0 32px"
    height: "48px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.orange-deep}"
    textColor: "{colors.orange-tint}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 32px"
    height: "48px"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "32px"
  card-alt:
    backgroundColor: "{colors.cool-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "32px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge-eyebrow:
    backgroundColor: "{colors.orange-tint}"
    textColor: "{colors.signal-orange}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    typography: "{typography.label}"
---

# Design System: Ryan DeBoer Portfolio

## Overview

**Creative North Star: "The Craft Workbench"**

The site looks like the surface of someone who builds, and it leaves the construction visible on purpose. Hand-drawn Caveat annotations sit in the margins, numbered section rules read like guides on a canvas, small selection handles bookend dividers, and cards wear Figma-style selection frames. Nothing pretends to be effortless. The seams are part of the argument, because the person the site is selling is a designer who also builds and is not afraid to show the working.

Underneath the marks, the system is disciplined and flat. Surfaces are paper-white or a cool off-white separated by hairline borders rather than shadows. Type carries the hierarchy: a tight, confident Hubot Sans for headings against a calm Inter for reading. Signal Orange is the one voice that carries emphasis and state. Depth is earned, not ambient. A card lifts, a border lights, a comet traces once, only when the reader touches it or scrolls it into view.

Density is editorial. Generous vertical rhythm (96px between sections), a 720px reading column, and an 1186px max width keep long pages calm and scannable. The result should feel like a working designer's bench: precise, legible, evidence-first, with just enough hand in it to prove a person made the calls.

**Key Characteristics:**
- Visible construction: Caveat annotations, numbered rules, selection handles, and tool-vernacular marks
- Flat by default; hairline borders carry structure, and shadow or motion appears only on state
- Hubot Sans headings over Inter body, with Signal Orange as the single accent
- Editorial rhythm: 96px section spacing, a 720px reading column, 1186px max width
- Evidence-first, calm, and honest about the making

## Colors

A near-monochrome bench (ink on paper, cool off-whites for depth) with a single warm-red-orange accent doing all the signaling. A blue-gray steel family plays the quiet supporting role for rules, handles, and muted UI.

### Primary
- **Signal Orange** (#f03d01): The one accent. Carries emphasis, calls-to-action, links, active/selected state, the marquee comet, and the highlight-sweep. Warm red-orange, not amber.
- **Orange Deep** (#c23001): Pressed and hover state for primary buttons; the deeper end of the accent.
- **Orange Muted** (#f07654): Softer accent for secondary emphasis and mid-tint marks.
- **Orange Soft** (#f9c4b0): Tint for gradient stops and gentle accent fills.
- **Orange Tint** (#fdede9): The lightest accent wash. Fills eyebrow badges and hover chips where orange should whisper.

### Secondary
- **Steel** (#8f9daf): Blue-gray for selection handles, muted supporting marks, and quiet UI furniture.
- **Steel Dark** (#5e6c7c): Deeper steel for secondary text on tinted grounds.
- **Steel Light** (#d6dce4): Faint steel for subtle dividers on cool grounds.
- **Cool Paper** (#f4f6f7): The alternate section background. Alternates with paper-white to band long pages without borders.

### Neutral
- **Ink** (#1b1b1b): Primary text and the strongest UI ink. Doubles as the "inverse" surface (dark buttons, dark bands).
- **Slate** (#4a4a4a): Secondary body text and standard prose.
- **Graphite** (#707070): Tertiary/muted text. AA-compliant on white (4.95:1) and on #f5f5f5 (4.54:1); do not use it smaller or lighter.
- **Hairline** (#e5e5e5): Divider and rule lines.
- **Mist** (#f5f5f5): The lightest neutral fill for subtle grounds.
- **Paper** (#ffffff): The default surface.
- **Border Hairline** (rgba(27,27,27,0.1)): The default card/element border. A 10%-ink line, not a solid gray, so it reads as structure without weight.

### Named Rules
**The Signal Orange Rule.** Orange is the only chromatic voice on the page. It may carry both emphasis and state, but it is the sole accent: never introduce a second hue to compete with it, and never let a screen turn orange-heavy. When orange appears, it should mean something (a link, an action, an active section, a selection).

**The Ink-on-Paper Rule.** Depth and grouping come from paper vs. cool-paper grounds and hairline borders, not from gray boxes or tinted panels. Reach for a background change or a hairline before a fill.

## Typography

**Display Font:** Hubot Sans (with Inter, then system-ui fallback)
**Body Font:** Inter (with system-ui fallback)
**Label/Mono Font:** Menlo (monospace, for system markers and code)
**Annotation Font:** Caveat (handwriting, for craft marks only)

**Character:** Hubot Sans is geometric, tight, and confident, set with negative tracking and Title Case so headings feel engineered rather than decorative. Inter keeps reading calm and neutral underneath it. The Caveat hand and the Menlo mono are the two "workbench" voices: one proves a person annotated the work, the other shows the system underneath it.

### Hierarchy
- **Display** (Hubot Sans, 800, 38px, line-height 1.25, tracking -0.02em): Page and hero headlines. The hero scales larger via clamp; 38px is the token ceiling for standard H1s.
- **Headline** (Hubot Sans, 700, 34px, line-height 1.25, tracking -0.02em): Section titles (H2).
- **Title** (Hubot Sans, 700, 22px-30px): Sub-section and card titles. Card titles often drop to 16px-17px semibold in dense grids.
- **Body** (Inter, 400, 16px, line-height 1.6): Reading text. Hold the reading column near 720px (roughly 65-75 characters).
- **Label** (Hubot Sans, 700, 14px, tracking 0.08em, UPPERCASE): Eyebrows, badges, and micro-labels. Buttons use the same face at weight 800.
- **Mono** (Menlo, 400, 14px): System markers (e.g. `CONTEXT LAYER`), status chips like `[ Essay ]`, and code blocks in notes.
- **Annotation** (Caveat, 600, ~20px): Handwritten margin marks only.

### Named Rules
**The Annotation Rule.** Caveat is reserved exclusively for hand-drawn craft marks (margin notes, the circled FAQ "?", underline flourishes). It never sets UI, labels, or body copy. Its rarity is what makes it read as a human mark rather than a font choice.

**The Title Case Rule.** Headings render in Title Case (a global `text-transform: capitalize`), which is intentional house style. Keep it consistent; do not mix sentence-case headings into the same hierarchy.

## Layout

A single centered column system. `max-width: 1186px` for full sections, a `720px` text column for reading (About narrative, notes, FAQ answers), and a `960px` wide column for case-study shells and proof blocks. Horizontal padding is 32px. Vertical rhythm between homepage sections is a uniform 96px (`$section-pad-y`), which is the primary device that keeps long pages calm.

Grids are a 12-column model with 24px-32px gutters. Card grids step down responsively: 3 columns to 2 (`≤1024px`) to 1 (`≤640px`). Breakpoints: 480 / 640 / 768 / 1024 / 1280 / 1536px. Mobile is treated as a real product state (stacked, static positioning replaces sticky, padding tightens), not a scaled crop.

## Elevation & Depth

Flat by default. Surfaces rest with no shadow; structure comes from hairline borders and from alternating paper / cool-paper grounds. Shadows exist but are a response to state, never ambient. The shadow scale climbs in opacity and offset for genuinely lifted moments (hover, modals, image lightbox), and most cards only ever use the smallest step on hover.

### Shadow Vocabulary
- **Shadow SM** (`box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15)`): The default hover lift for cards and buttons.
- **Shadow MD** (`0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.2)`): Raised UI, popovers.
- **Shadow LG** (`0 6px 8px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.25)`): Modals, floating panels.
- **Shadow XL** (`0 8px 10px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.3)`): The image lightbox and topmost layers.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow, a border-color shift, a lift (`translateY(-1px)`), or the marquee comet appears only in response to state (hover, focus, active, or scroll-into-view), and then settles back. Ambient shadows and floating cards are out of language.

## Shapes

A soft-but-tight radius language. Buttons and interactive pills round to 10px; cards to 12px (dense) or 16px (feature); inputs to 8px; eyebrow badges and status pills to full. Borders are the workhorse: a single 10%-ink hairline (`rgba(27,27,27,0.1)`) defines most cards and inputs.

The signature silhouette is the **selection frame**: 5px square handles that bookend section rules and sit at card corners, quoting a Figma bounding box. It is the geometric motif that ties the "workbench" world together and should recur wherever the interface wants to say "this is an object you can act on."

## Components

### Buttons
- **Shape:** 10px radius (`$button-radius`), inline-flex, Hubot Sans 800 / 14px label.
- **Primary:** Signal Orange fill, white text, 48px tall (`--lg`) with 32px horizontal padding. Hover deepens to Orange Deep, text warms to Orange Tint, and the button lifts 1px.
- **Secondary:** Paper fill, ink text, 1px ink border. Hover inverts to an ink fill with paper text, and lifts 1px.
- **Sizes:** `--lg` 48px, `--md` 40px, `--sm` 32px. Transition is `all 150ms ease-in-out`.

### Cards / Containers
- **Corner Style:** 12px (standard) or 16px (feature) radius.
- **Background:** Paper (#ffffff) or Cool Paper (#f4f6f7), usually matching or contrasting the section ground.
- **Border:** 1px Border Hairline (`rgba(27,27,27,0.1)`).
- **Shadow Strategy:** none at rest; Shadow SM on hover (see Elevation).
- **Internal Padding:** 24px-32px (`$spacing-xl` to `$spacing-2xl`).
- **Selection-frame variant:** on scroll-into-view, a Signal Orange comet traces the perimeter once (staggered across a grid) then settles back to the hairline; on hover the border warms to a 45%-orange tint. This is the card expression of the selection-frame vernacular.

### Inputs / Fields
- **Style:** Paper fill, 1px Border Hairline, 8px radius, 8px/12px padding, inherited body type.
- **Focus:** border shifts to Signal Orange (no glow).

### Section Badge (eyebrow)
- Pill with an icon and an uppercase label: Orange Tint fill, 1.5px Signal Orange border, full radius, 8px/24px padding. Icon 24px in Signal Orange; label Hubot Sans 700 / 14px, tracking 0.08em, uppercase, Signal Orange. Anchors the top of most sections.

### Section Rule (signature)
- A numbered badge seated on a full-width 1px hairline, with 5px square selection handles bookending it. Tells the reader where they are on a long page. The accent variant (orange) is reserved for exactly one section at a time (current work); handles and line ride on CSS custom properties so dark bands can re-tone them.

### Navigation
- Top bar: wordmark left ("Ryan DeBoer"), text links, and a primary "Get in touch" pill right. Links are ink, hover to Signal Orange. Mobile collapses to a toggle that animates a selection-frame box. Nav is quiet and lets the hero lead.

### Motion
- Purposeful and reduced-motion-safe. The vocabulary: a highlight-sweep that "selects" then bolds key phrases, masked reveal-ins, the one-time card comet, a hero typing/selection intro, and hand-drawn underline draws. Motion marks state or reveals once; it does not loop for attention.

## Do's and Don'ts

### Do:
- **Do** set headings in Hubot Sans (Title Case, negative tracking) over Inter body, and hold reading columns near 720px.
- **Do** keep surfaces flat and let hairline borders and paper/cool-paper grounds carry structure. Reach for a shadow only as a state response (Shadow SM on hover).
- **Do** treat Signal Orange as the single accent for both emphasis and state, and make each orange mean something.
- **Do** reserve Caveat for hand-drawn craft marks and Menlo for system markers and code.
- **Do** reuse the selection-frame vernacular (5px square handles, corner frames, the comet) when an element should read as an actionable object.
- **Do** respect reduced-motion and keep visible keyboard focus on every interactive element.

### Don't:
- **Don't** introduce a second accent hue, or let a screen become orange-heavy. One voice.
- **Don't** add ambient shadows, floating cards, or glassmorphism. Nothing lifts at rest.
- **Don't** use purple-to-blue SaaS gradients, icons inside decorative circles, pill-shaped everything, or ambient animated blobs (per ryan-design-taste).
- **Don't** add motion that exists only to be noticed; if it does not mark state or reveal once, cut it.
- **Don't** replace this visual world. All work extends the existing system and connects to its tokens/components (ryan-design-taste + apply-design-system are binding). A new surface preserves this language rather than inventing another.
