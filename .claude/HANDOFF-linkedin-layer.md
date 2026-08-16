# HANDOFF — LinkedIn Connection Layer

**Status: plan approved by Ryan · ZERO code edits made yet. All file/line anchors below were
verified against the working tree on 2026-07-22.** Audit is done; your job is implementation only.

---

## 1. Mission + framing (why these placements)

Ryan's LinkedIn — `https://www.linkedin.com/in/ryandeboerdesigns/` — is his **only** social
presence and where his *in-progress* thinking lives; the portfolio is the *resolved* work. Add a
small, reusable, evidence-adjacent connection layer. Nothing promotional.

Non-negotiables:
- **Every link points at the profile root URL above.** No activity-feed or post deep links (they
  auth-wall logged-out visitors — the exact hiring-manager audience).
- `target="_blank" rel="noopener noreferrer"` on every LinkedIn link (site convention).
- **Use the approved copy verbatim (§4). Do not rewrite it.** It passed Ryan's humanizer standard
  (≤1 dash per passage, no rule-of-three lists, nothing that says "Let's connect / Follow me").
- Do NOT add LinkedIn to: global nav, homepage hero, case-study heroes/meta bars, sticky/floating
  chrome. No feed embeds. These were explicitly rejected in the audit.
- Existing LinkedIn surfaces stay untouched: `Footer.tsx:15-17`, `HomepageTargeted.tsx:493-495`
  ("Connect on LinkedIn" buttons) and the orphaned `ContactCTA.tsx` (dead code — leave it).

## 2. Repo ground rules

- Repo: `/Users/ryandeboer/Ryan's Folder/Claude/portfolio-site` — CRA (react-scripts), React 18 +
  TS, SCSS BEM, hash routing. SCSS entry: `src/styles/styles.scss` (there is NO main.scss).
- Verification ritual before declaring done: `npx tsc --noEmit` then `CI=true npm run build`
  (eslint warnings are ERRORS in CI build).
- **Do NOT commit or push unless Ryan asks. Plan requires local review first.**
- Working tree has pre-existing changes that are NOT yours — never stage them:
  modified `public/images/work/playdraft/{ASSETS.md, playdraft-howtoplay-poster.jpg,
  playdraft-howtoplay-reel.mp4}`; untracked `.agents/ .claude/ .codex/ skills-lock.json`
  (and this handoff file).
- Never put assets in `build/` (wiped by every build).
- Email used on-site: `rdeboer180@gmail.com`.
- No analytics stack exists. `data-li-surface` attributes are deliberately inert pre-wiring.

## 3. Build spec (in order)

### 3a. Shared atom — `LinkedInLink`

**New** `src/components/LinkedInLink.tsx`:

```tsx
import React from 'react';

export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/ryandeboerdesigns/';

interface LinkedInLinkProps {
  label: string;
  surface: string;          // analytics pre-wiring, emitted as data-li-surface
  className?: string;
}

const LinkedInLink: React.FC<LinkedInLinkProps> = ({ label, surface, className }) => (
  <a
    href={LINKEDIN_PROFILE_URL}
    className={className ? `linkedin-link ${className}` : 'linkedin-link'}
    target="_blank"
    rel="noopener noreferrer"
    data-li-surface={surface}
  >
    {label}
  </a>
);

export default LinkedInLink;
```

**New** `src/styles/components/_linkedin-link.scss` — extract the pattern that currently lives at
`src/styles/components/_testimonials.scss:451-487` (`&__source-link`): a `@mixin linkedin-glyph`
holding the 12×12 `::before` CSS-mask LinkedIn glyph (`background-color: currentColor`, the
Font Awesome data-URI mask, `mask-size: contain`) plus a `.linkedin-link` base class:
`inline-flex; align-items: center; gap: 4px; font-family: $font-family-primary;
font-size: $font-size-caption; font-weight: $font-weight-semibold; color: $color-primary;
text-decoration: none; width: fit-content;` hover/focus-visible underline; `:focus-visible`
outline `2px solid $color-primary; outline-offset: 2px; border-radius: 2px`. Copy the exact mask
data-URI from `_testimonials.scss:469-470` (both `-webkit-mask-image` and `mask-image`).

**Import order matters:** add `@import 'components/linkedin-link';` in `src/styles/styles.scss`
**before** line 45's `@import 'components/testimonials';` so the mixin exists when testimonials
compiles.

**Refactor testimonials (visual output must be pixel-identical):**
- `_testimonials.scss:451-487` `&__source-link` → keep the selector, replace its body with
  `@include linkedin-glyph;` plus whatever isn't in the mixin (it has one extra:
  `margin-top: $spacing-xs;` — keep that local).
- `src/components/Testimonials.tsx:269-278` currently:
  ```tsx
  {t.sourceUrl && (
    <a
      href={t.sourceUrl}
      className="testimonials__source-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t.source ?? 'View source'}
    </a>
  )}
  ```
  → swap to `<LinkedInLink label={t.source ?? 'View source'} surface="testimonial_source"
  className="testimonials__source-link" />` (import the component; `sourceUrl` on both
  testimonials already equals the profile URL, so hardcoding the canonical URL is a no-op; you may
  leave the `sourceUrl` data fields in place).

### 3b. P1 — Case-study close rail (renders on all 10 studies)

`src/components/CaseStudyPage.tsx` — the unlocked content fragment ends:
takeaways conditional at lines 828-837, then `</>` (L838) and `)}` (L839), then the
`{/* Next Project */}` block at 841-854 which is OUTSIDE the unlocked conditional.
**Insert the rail between L837 and L838** — after the takeaways conditional, still inside the
unlocked fragment (locked studies must not show it):

```tsx
<aside className="cs__continue">
  <span className="cs__continue-label">[ In Progress ]</span>
  <p className="cs__continue-body">
    Case studies show the resolved work. The thinking behind it lands on LinkedIn first.
  </p>
  <div className="cs__continue-actions">
    <a href="mailto:rdeboer180@gmail.com" className="cs__continue-mail">Get in touch</a>
    <LinkedInLink label="Follow the work in progress" surface="case_study_close" />
  </div>
</aside>
```

SCSS in `src/styles/components/_case-study-page.scss` — add a `&__continue` block between the
existing `&__takeaways` rule (L879) and `&__next` (L912). Quiet, editorial, NO card/background:
- hairline top border (`1px solid` the same hairline token neighbors use — check `&__takeaways`
  area for the token; the file uses existing `$color-neutral-*` borders), generous top
  margin/padding (`$spacing-2xl`-ish, match section rhythm).
- `&__continue-label`: mono micro-label — copy the styling approach of the About transition label
  (`_about-page.scss:121` `&__transition-label`) or the stream-chip mono style: caption size,
  letter-spacing, `$color-primary`. Keep the literal text `[ In Progress ]` — the bracket
  language matches `[ Bridge ]` / `[ Shipped ]`.
- `&__continue-body`: body-sm, `$color-neutral-dark`/muted, max-width ~60ch.
- `&__continue-actions`: flex row, `gap: $spacing-lg`, wrap on mobile.
- `&__continue-mail`: text link, same size/weight as `.linkedin-link` (caption, semibold),
  color `$color-neutral-dark` with hover → `$color-primary` + underline, matching focus-visible
  outline. Email is primary, LinkedIn secondary — order in DOM already encodes it.
- Static (no reveal animation) — the `cs__section` observer flow is NOT needed here.
- Check the responsive `&__next` overrides at L1031/L1058 region for the mobile spacing rhythm
  and mirror padding there if the rail looks cramped at `$breakpoint-md`.

### 3c. P1 — Resume contact row (PDF-safe: NO atom, NO glyph)

`src/components/ResumePage.tsx:57-65` currently:

```tsx
<div className="resume-page__contact">
  <span>South Bend, Indiana</span>
  <span className="resume-page__contact-sep">&bull;</span>
  <a href="mailto:rdeboer180@gmail.com">rdeboer180@gmail.com</a>
  <span className="resume-page__contact-sep">&bull;</span>
  <span className="resume-page__contact-portfolio">
    Portfolio Site: <a href="https://www.rdeboerdesigns.com" target="_blank" rel="noopener noreferrer">RDeboerDesigns.com</a>
  </span>
</div>
```

Append after the portfolio span:

```tsx
<span className="resume-page__contact-sep">&bull;</span>
<span className="resume-page__contact-linkedin">
  LinkedIn: <a href="https://www.linkedin.com/in/ryandeboerdesigns/" target="_blank" rel="noopener noreferrer">linkedin.com/in/ryandeboerdesigns</a>
</span>
```

- **Visible URL text, not a bare "LinkedIn" label** — this row feeds the html2pdf export
  (`handleExportPDF`, canvas-rendered): the address must survive on paper.
- **Do NOT use the `LinkedInLink` atom or glyph here** — html2pdf may drop CSS masks.
- Style inherits from the existing `.resume-page__contact a` rules in
  `src/styles/components/_resume-page.scss` — verify nothing extra is needed, and check the row
  wraps acceptably (it's bullet-separated; 4 items will wrap on mobile — check
  `resume-page__contact` flex-wrap in SCSS, add `flex-wrap: wrap` only if missing).
- After building, **run Save as PDF in the browser** and confirm the URL renders in the export.

### 3d. P2 — About bridge line

`src/components/AboutPage.tsx:34-50` — the orange dot-matrix transition card. After the second
`__transition-body` paragraph (ends "The tools change; the standard doesn&rsquo;t." L45-48),
inside `about-page__transition-inner`, add:

```tsx
<p className="about-page__transition-note">
  The finished version of that standard is this site. Between releases, I think out loud
  on LinkedIn.
</p>
<LinkedInLink
  label="Read along"
  surface="about_bridge"
  className="about-page__transition-link"
/>
```

⚠️ **CONTRAST — this card is white-on-orange** (`_about-page.scss:145-157`: transition-body is
`rgba(255,255,255,0.9)` on the orange dot-matrix bg). The atom's default `$color-primary` orange
would disappear. In `_about-page.scss` (after the `&__transition-body` block, ~L157) add:
- `&__transition-note`: same treatment as `&__transition-body` (it can literally share via a
  comma-selector or duplicate the few lines) + `margin-top: $spacing-lg;`.
- `&__transition-link`: `color: #fff;` (+ `margin-top: $spacing-sm; position: relative;
  z-index: 1;` — the inner children all carry `z-index: 1` over the dot-matrix) and
  `&:focus-visible { outline-color: #fff; }`. The glyph follows `currentColor` automatically.
- Check the responsive overrides at `_about-page.scss:168+` — the card paddings change at
  `$breakpoint-md`; the note/link need no special handling but verify visually.
- One LinkedIn moment per page: the Footer below keeps its "Connect on LinkedIn" button — that's
  fine, it's generic chrome; this is the contextual one. Add nothing else on About.

### 3e. P2 — FAQ Q6 inline link (build it; Ryan reviews in place)

`src/components/FAQ.tsx:35` — second `<p>` of "How was my portfolio built?". Link the phrase
"using Claude as a development partner" — NO. Correct target: link a workflow phrase to LinkedIn.
Use the sentence about iteration: wrap **"the same rigor I apply to client work"**? No — keep it
mechanical and honest: in the FIRST paragraph (L34) after the existing design-system link there
is already one link; put the LinkedIn link in the SECOND paragraph (L35). Rewrite the final
clause minimally:

Current L35 ends: `…brand alignment checks, and responsive refinement — the same rigor I
apply to client work, applied to my own.`

Append one new sentence inside that `<p>` (keep everything else byte-identical):
` I write about this workflow as it evolves on <a href="https://www.linkedin.com/in/ryandeboerdesigns/" target="_blank" rel="noopener noreferrer" data-li-surface="faq_build">LinkedIn</a>.`

(Plain `<a>` here, not the atom — the atom's glyph/caption styling would fight the FAQ answer
typography; an inline text link inherits the FAQ link styles like the existing design-system
link. Keep `data-li-surface` for parity.)

### 3f. Adjacent micro-fix — FAQ Q4

`FAQ.tsx:17-19` — Q4 answer is a plain string with typos:
`'Not at this current time but please reach out if you have an idea and id love to talk.'`
Convert to JSX and fix grammar (this exact copy is approved):

```tsx
answer: (
  <p>
    Not at this current time, but please{' '}
    <a href="mailto:rdeboer180@gmail.com">reach out</a> if you have an idea — I&rsquo;d
    love to talk.
  </p>
),
```

Note the renderer (`FAQ.tsx:71-77`) wraps ReactNode answers in `<div className="faq__answer">`,
so a `<p>` child matches Q5/Q6's existing shape. (mailto = email action; deliberately NOT a
LinkedIn link.)

## 4. Approved copy — verbatim, do not edit

| Surface | Context line | Link label |
|---|---|---|
| Case-study close | "Case studies show the resolved work. The thinking behind it lands on LinkedIn first." | "Follow the work in progress" (+ "Get in touch" mailto sibling) |
| About bridge | "The finished version of that standard is this site. Between releases, I think out loud on LinkedIn." | "Read along" |
| Resume | — (metadata row) | "linkedin.com/in/ryandeboerdesigns" prefixed "LinkedIn: " |
| FAQ Q6 | "I write about this workflow as it evolves on LinkedIn." | inline word "LinkedIn" |
| Testimonials | unchanged | unchanged ("See Full LinkedIn Recommendation") |

`data-li-surface` values: `testimonial_source`, `case_study_close`, `about_bridge`, `faq_build`.
(Resume link intentionally has none — different render path; footer buttons untouched.)

## 5. Verification checklist (run all)

1. `npx tsc --noEmit` → clean. `CI=true npm run build` → clean (warnings fail it).
2. `npm start` localhost:
   - Homepage testimonials: both source links pixel-identical to before (glyph, orange, hover
     underline, focus ring).
   - `#/work/wheelrack` (unlocked flow — some studies are password-locked; wheelrack/loopstack
     are safe checks): close rail sits between Key Takeaways and Next Project; email + LinkedIn
     row; keyboard focus rings on both.
   - A locked study URL: rail must NOT render pre-unlock.
   - `#/about`: orange card shows note + white "Read along" link with white glyph; focus ring
     visible against orange; mobile width OK.
   - `#/resume`: 4-item contact row wraps cleanly; **Save as PDF → URL legible in export**.
   - Homepage FAQ: Q4 mailto works; Q6 LinkedIn link works.
   - Reduced motion (macOS setting): nothing new animates anyway — sanity check only.
3. `grep -rn "linkedin.com" src/` → every href is the canonical profile URL (Footer/
   HomepageTargeted/ContactCTA literals were already canonical and stay as-is).
4. **STOP. Do not commit, do not push.** Report to Ryan for local review; he decides shipping.

## 6. Out of scope — do not touch

- TeamScore "4.9 / 5" sourcing (deferred by Ryan) · missing PNG re-exports + the two
  `TODO(Ryan)` blocks in `projects.ts` (design-enablement) · orphan cleanup
  (`ContactCTA.tsx`, `SelectedWork.tsx`, `HowIWork.tsx`) · analytics stack install (Plausible vs
  GA4 is Ryan's separate decision) · the modified playdraft asset files · apex-domain HTTPS cert
  (server-side) · any copy rewrites beyond §4.
