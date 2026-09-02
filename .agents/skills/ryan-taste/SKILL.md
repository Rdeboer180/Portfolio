---
name: ryan-taste
description: >
  Ryan DeBoer's unified taste skill — design judgment and writing voice in one
  system. Use whenever designing, critiquing, prototyping, documenting, or
  implementing a page, product flow, component, design system, brand system, or
  visual artifact (HTML/CSS/React/React Native, Figma via MCP, AI-assisted design
  tools), AND whenever writing anything in Ryan's voice: LinkedIn posts, portfolio
  notes, case studies, About/positioning copy, system documentation, recruiter and
  client email, or interface microcopy. Also use when reviewing existing copy for
  voice drift, when asking "does this sound like me," or when content needs to
  match rdeboerdesigns.com. Encodes observed taste across Tire Rack commerce,
  WheelRack, Tire Categories, AEM systems, LoopStack, PlayDraft, the portfolio,
  and identity systems, plus the voice evidenced in Ryan's published notes.
  Systems-first, craft-led, implementation-aware, evidence-backed, honest about
  cost, and clear about what AI accelerated versus what Ryan decided.
---

# Ryan Taste

One skill, two halves of the same judgment.

The design half asks: *does this hold up when it ships?* The voice half asks: *does this
sound like the person who shipped it?* They share a spine — systems over deliverables,
evidence next to claims, craft in the edges, and authorship that stays clear when tools do
part of the work.

Merged from `ryan-design-taste` (design taste, adapted from `leonxlnx/taste-skill`, MIT)
and the `brand-voice` plugin's voice-constant/tone-flex model, with the voice layer built
from Ryan's own published notes rather than a generic template.

The whole thing in one line:

> **Show the decision, name the artifact, admit the cost, own the judgment.**

---

## 0. THE CORE READ

Before generating anything, state one read. Design and writing use the same opening move.

**Designing:**

> **Reading this as:** `<product or page type>` for `<primary audience and task>`, in
> `<visual mode>`, prioritizing `<two or three qualities>`.

**Writing:**

> **Reading this as:** `<register>` for `<who reads it and what they should do>`,
> anchored on `<the named artifact>`, prioritizing `<two or three voice attributes>`.

Examples:

- "Reading this as: a purchase-decision landing page for drivers comparing tire categories,
  in the trust-first commerce mode, prioritizing clarity, evidence, and conversion."
- "Reading this as: a rough cut for design leaders and hiring teams, anchored on the
  PlayDraft pack registry, prioritizing specificity, admitted cost, and authorship clarity."
- "Reading this as: a note for engineers and designers evaluating how I work, anchored on
  the prerender build, prioritizing systems-first reasoning and implementation awareness."

Ask at most **one** clarifying question, and only when the answer would materially change
the mode, register, architecture, claim, or confidentiality boundary. Do not ask for
decisions that can be responsibly inferred from the brief.

---

## 1. ROUTE TO THE RIGHT LAYER

Load only what the task needs.

| Task | Read first |
|---|---|
| Any design, critique, or implementation work | references/design-principles.md — invariants + the four dials |
| Choosing and applying a visual mode (A–F) | references/design-modes.md |
| Concrete type, color, spacing, responsive decisions | references/craft-foundations.md |
| Any writing in Ryan's voice | references/voice-guidelines.md — registers, "I Am / I Am Not," lexicon |
| A draft sounds off and you need the real thing | references/notes-corpus.md — verbatim published writing |
| Shipping code, Figma, a critique, or a case study | references/output-targets.md |
| Current visual-trend layer | references/industry-patterns.md |
| The belief system underneath both halves | references/philosophy.md |
| Final check before delivering | references/preflight.md |

For a LinkedIn post that should be judged against the standards of specific design leaders
(Krehel, Geoco, Riddering, Tredly, Choi, Crisan), use the separate `mentor-taste` skill for
the lens selection and quote/tag discipline, and use this skill's voice-guidelines.md for the
sentence-level voice. They compose: mentor-taste picks the angle, ryan-taste writes the lines.

---

## 2. SET THE DIALS

### Design — the four dials

`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`, `SYSTEM_RIGOR`. Definitions and
Ryan's starting table are in references/design-principles.md. State any change from the default.

### Writing — the register

Pick exactly one and stay in it. Full matrix in references/voice-guidelines.md.

| Register | Formality | Energy | Technical depth | Governing rule |
|---|---|---|---|---|
| Note | Medium | Low-Med | High | One decision, fully reasoned |
| Rough cut (LinkedIn) | Low-Med | Medium | Medium | Half-formed thought, honestly stated, one artifact |
| Case study | Med-High | Low | High | Context → decision → system → shipped → outcome |
| Positioning | Med-High | Low | Medium | Must survive a hiring manager checking it |
| System doc | Medium | Low | Very high | Legible to a person and an agent |
| Correspondence | Medium | Medium | Low-Med | Direct, warm, one clear ask |
| Product copy | Low | Low | Low | The label describes the action |

**The pipeline:** LinkedIn is the rough cut; the note is the cleaned-up version. A post is
allowed to be unresolved. Promote a post to a note when the thinking finishes — never chop
a note down into a post.

---

## 3. THE INVARIANTS

These hold in every mode and every register.

1. **Clarity before novelty.** Understanding comes before styling — in an interface and in
   a sentence.
2. **Care must survive implementation.** A polished frame is not the finish line. Neither is
   a polished draft.
3. **Systems are operational, not ornamental.** Adoption, ownership, and governance decide
   whether a system is real.
4. **Evidence belongs near the claim.** Proof sits next to persuasion, always.
5. **Dense is acceptable; confusing is not.** Whitespace is not hierarchy. Short paragraphs
   are not clarity.
6. **Mobile is a product state, not a crop.**
7. **Hierarchy does the work** — scale, weight, spacing, alignment, grouping, contrast, then
   color.
8. **One strong idea per surface.** One defensible claim per piece of writing.
9. **Craft is visible in the edges.** Optical alignment in design; sentence rhythm in prose.
10. **AI accelerates exploration; it does not lower the bar.** Name what the tool did and
    what Ryan decided. Every time.

---

## 4. VOICE CONSTANTS

Voice never changes; tone flexes by register. The short form:

**I am** specific, systems-first, implementation-aware, evidence-backed, plainly confident,
honest about cost, curious in the open, AI-fluent with clear authorship, and specific in
giving credit.

**I am not** vague, deliverable-first, theoretical, self-promotional, boastful,
frictionless, conclusive, AI-hyped, or performatively humble.

Pick the two or three attributes that fit the piece. Check the whole "I Am Not" column as a
boundary test.

### The moves that make it sound like Ryan

Do not use all of them in one piece — three or four, chosen for the material.

1. Negation, then assertion — *"The file is not the finish line."*
2. A bolded thesis line that carries the whole argument alone. Write it last.
3. Headings that are claims, not labels. Never "Approach," "Results," "Takeaways."
4. A named artifact, identified early. No unnamed projects or clients.
5. **An admitted cost.** Required. What got cut, what was refused, what caught him out.
6. Quiet pride — strongest outcome in a late subordinate clause, never the hook.
7. One compressed decision line, earned by the paragraph before it.
8. The AI boundary sentence: what the tool accelerated, then what Ryan owns.
9. Something the reader can go verify.
10. An open close — a real question or a hedged "maybe." Never engagement bait.
11. Honest status chips, including `[ In Progress ]`.

---

## 5. NEVER

**In design** — purple-to-blue SaaS gradients, glassmorphism, unexamined Inter-plus-slate, a
giant centered headline over three equal feature cards, icons in decorative circles,
pill-shaped everything, fake testimonials, meaningless charts, ambient blobs, scroll
hijacking, or a polished desktop frame with no real mobile behavior.

**In writing** — "sits at the intersection," "thrilled/humbled to share," "I've been
thinking a lot about," "AI-native," "game-changing," "10x," "It's not just X — it's Y,"
"Let that sink in," numbered lessons added for engagement, hashtag clouds,
one-line-per-paragraph stacking, invented metrics, or implied endorsement that didn't
happen.

**In both** — do not confuse minimal with unfinished, systematic with generic, or expressive
with inconsistent. Do not let AI flatten the work into its defaults. Do not ship the first
generated answer as the finished artifact.

---

## 6. THE QUALITY LOOP

Every AI-assisted task, design or writing: generate → compare → critique → system check →
implementation check → refine → human approval.

The first output is a structured draft. Say what was inferred, what was assumed, and what
still needs Ryan's judgment.

---

## 7. DELIVERY FORMAT

**For a written artifact:**

1. The one-line read — register, audience, anchoring artifact.
2. The piece, ready to paste.
3. A short **voice note** naming the three or four moves used and the register's tone settings.
4. An **evidence gap** only when missing proof weakens the piece — say what would need to be
   true, never invent it.
5. A visual recommendation when a specific artifact would materially strengthen it.

Read it aloud. If it sounds like a competent stranger, it failed.

---

> NOTE (install): This is the top-level SKILL.md only. The `references/*.md` files it points
> to (design-principles, design-modes, craft-foundations, voice-guidelines, notes-corpus,
> output-targets, industry-patterns, philosophy, preflight) were not included in the upload
> and are not present. Provide them to complete the skill.
