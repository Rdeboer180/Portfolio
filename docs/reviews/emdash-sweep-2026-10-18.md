# Em dash sweep: every copy string changed

100 rendered em dashes removed across 28 files. Code comments and section-divider rules were left untouched. Nothing is committed; all changes are in the working tree.

Separator convention for page titles: ` | `, matching `public/index.html`, `src/data/seo.ts` and the existing expectation in `src/hooks/usePageMeta.test.tsx`.


## `src/components/CaseStudyPage.tsx`

1. **before** `${project.seoTitle ?? project.title} — Ryan DeBoer`
   **after**  `${project.seoTitle ?? project.title} | Ryan DeBoer`

2. **before** 'Case study — Ryan DeBoer'
   **after**  'Case study | Ryan DeBoer'


## `src/components/DesignSystem.tsx`

1. **before** 'Design system — Ryan DeBoer'
   **after**  'Design system | Ryan DeBoer'


## `src/components/HomepageTargeted.tsx`

1. **before** `Ryan DeBoer — Product Design Engineer for ${content.meta.company}`
   **after**  `Ryan DeBoer | Product Design Engineer for ${content.meta.company}`

2. **before** There's more to how I think—and how I help teams do better work—than what fits here.
   **after**  There's more to how I think (and how I help teams do better work) than what fits here.


## `src/components/NotFoundPage.tsx`

1. **before** 'Page not found — Ryan DeBoer'
   **after**  'Page not found | Ryan DeBoer'


## `src/components/NotePage.tsx`

1. **before** `${note.title} — Notes — Ryan DeBoer`
   **after**  `${note.title} | Notes | Ryan DeBoer`

2. **before** 'Notes — Ryan DeBoer'
   **after**  'Notes | Ryan DeBoer'


## `src/components/NotesPage.tsx`

1. **before** 'Notes — Ryan DeBoer on craft, systems, and care'
   **after**  'Notes | Ryan DeBoer on craft, systems, and care'


## `src/components/SitemapPage.tsx`

1. **before** 'Site Index — Ryan DeBoer'
   **after**  'Site Index | Ryan DeBoer'

2. **before** 'Writing from the work — field notes,
   **after**  'Writing from the work: field notes,

3. **before** 'Every page on rdeboerdesigns.com — main pages,
   **after**  'Every page on rdeboerdesigns.com: main pages,


## `src/components/TalentTreePage.tsx`

1. **before** 'Talent tree — Ryan DeBoer'
   **after**  'Talent tree | Ryan DeBoer'

2. **before** 'Build your talent tree — Ryan DeBoer'
   **after**  'Build your talent tree | Ryan DeBoer'


## `src/components/About.tsx`

1. **before** maps 16 years of growth—the skills I’ve sharpened
   **after**  maps 16 years of growth: the skills I’ve sharpened

2. **before** maps 16 years of growth—where I’ve invested my time
   **after**  maps 16 years of growth: where I’ve invested my time


## `src/components/FAQ.tsx`

1. **before** I married my high school sweetheart Stephanie — we've now spent more than half our lives together — and our two kids are the center of everything.
   **after**  I married my high school sweetheart Stephanie. We've now spent more than half our lives together, and our two kids are the center of everything.

2. **before** a custom-coded branch of the Loop app — a closed-loop insulin delivery system
   **after**  a custom-coded branch of the Loop app, a closed-loop insulin delivery system

3. **before** a dynasty fantasy football league — the Grandville Gremlins — for about a decade
   **after**  a dynasty fantasy football league, the Grandville Gremlins, for about a decade


## `src/components/Testimonials.tsx`

1. **before** Ryan doesn’t just design screens—he designs the
   **after**  Ryan doesn’t just design screens. He designs the

2. **before** Ryan doesn’t just design screens—he designs the whole experience.
   **after**  Ryan doesn’t just design screens. He designs the whole experience.

3. **before** built one from scratch—a full token set
   **after**  built one from scratch, a full token set

4. **before** engage relevant teams—including UX, UXR, Analytics, Imaging, and SEO—whenever needed.
   **after**  engage relevant teams (including UX, UXR, Analytics, Imaging, and SEO) whenever needed.

5. **before** engage relevant teams—including UX, UXR, Analytics, Imaging, and SEO—whenever needed.
   **after**  engage relevant teams (including UX, UXR, Analytics, Imaging, and SEO) whenever needed.


## `src/components/talent/TalentAtlas.tsx`

1. **before** product signals support—and what is still an assumption?
   **after**  product signals support, and what is still an assumption?


## `src/data/homepage-template.tsx`

1. **before** [Opening pitch — one or two sentences
   **after**  [Opening pitch: one or two sentences

2. **before** '[Paragraph 1 — your background and what sets you apart.]'
   **after**  '[Paragraph 1: your background and what sets you apart.]'

3. **before** '[Paragraph 2 — a story that connects you to this company or product.]'
   **after**  '[Paragraph 2: a story that connects you to this company or product.]'

4. **before** '[Paragraph 3 — why this role, why now.]'
   **after**  '[Paragraph 3: why this role, why now.]'


## `src/data/notes.tsx`

1. **before** label="This started as a post — the conversation is there"
   **after**  label="This started as a post: the conversation is there"

2. **before** 'Source notes — all eight, with the numbers'
   **after**  'Source notes: all eight, with the numbers'

3. **before** then Overscroll Tactics — including the branch I threw away
   **after**  then Overscroll Tactics, including the branch I threw away

4. **before** — Tommy Geoco and Michael Riddering especially — change their own workflows in
   **after**  (Tommy Geoco and Michael Riddering especially) change their own workflows in

5. **before** comparison could have manufactured — including
   **after**  comparison could have manufactured, including

6. **before** against reusable agent skills — some that remove repeat setup
   **after**  against reusable agent skills: some that remove repeat setup

7. **before** Michael W. — Mizko — is one of the people who taught me
   **after**  Michael W. (Mizko) is one of the people who taught me

8. **before** Figma is still in my process — I still care
   **after**  Figma is still in my process. I still care

9. **before** Construction, really —
   **after**  Construction, really:

10. **before** faster than it rewards one — something I’ve now
   **after**  faster than it rewards one, something I’ve now

11. **before** A Figma file is a portfolio piece — you open it and
   **after**  A Figma file is a portfolio piece: you open it and

12. **before** Not bugs exactly — decisions: the moment
   **after**  Not bugs exactly. Decisions: the moment

13. **before** isn’t that the first idea was wrong — that’s ordinary.
   **after**  isn’t that the first idea was wrong. That’s ordinary.

14. **before** Pay drafters for reaching — taking something later than the world takes it — so that chalk
   **after**  Pay drafters for reaching (taking something later than the world takes it) so that chalk

15. **before** The obvious repair — normalising across the whole pack — just moved the win
   **after**  The obvious repair, normalising across the whole pack, just moved the win

16. **before** has no evidence behind it — you cannot detect a gem
   **after**  has no evidence behind it. You cannot detect a gem

17. **before** category — which turned out to be safe in the deep packs
   **after**  category, which turned out to be safe in the deep packs

18. **before** A diversity bonus died the same way — every major category
   **after**  A diversity bonus died the same way: every major category

19. **before** on the opening pick — true by subtraction
   **after**  on the opening pick: true by subtraction

20. **before** came from a nearby constant — clock plus sweeper lag — but that lag
   **after**  came from a nearby constant (clock plus sweeper lag), but that lag

21. **before** sent by the client that had just picked — simple, no server work
   **after**  sent by the client that had just picked: simple, no server work

22. **before** Not the ideas — the order of operations.
   **after**  Not the ideas. The order of operations.

23. **before** to do exactly what it was designed to do — on its verification run it flipped second
   **after**  to do exactly what it was designed to do. On its verification run it flipped second

24. **before** resolved and shipped — the emblem is now
   **after**  resolved and shipped: the emblem is now

25. **before** right call — a perimeter tracing itself
   **after**  right call. A perimeter tracing itself


## `src/data/projects.ts`

1. **before** designed the complete dealer product—edge cases included.
   **after**  designed the complete dealer product, edge cases included.

2. **before** props, states, and reusable components—a foundation I later carried
   **after**  props, states, and reusable components: a foundation I later carried

3. **before** alt: 'AEM winter seasonal content — homepage project card'
   **after**  alt: 'AEM winter seasonal content, homepage project card'


## `public/manifest.json`

1. **before** "Ryan DeBoer — Product Design Engineer"
   **after**  "Ryan DeBoer | Product Design Engineer"


## `public/index.html`

1. **before** Ryan DeBoer, Product Designer — Design, Craft, Care. Know what to build. Know why. Know when to stop.
   **after**  Ryan DeBoer, Product Designer. Design, Craft, Care. Know what to build. Know why. Know when to stop.

2. **before** Ryan DeBoer, Product Designer — Design, Craft, Care."
   **after**  Ryan DeBoer, Product Designer. Design, Craft, Care."


## `public/talentTree/index.html`

1. **before** Talent tree — Ryan DeBoer
   **after**  Talent tree | Ryan DeBoer


## `public/share/aem-component-system/index.html`

1. **before** Production Sass — Ryan DeBoer
   **after**  Production Sass | Ryan DeBoer


## `public/share/design-enablement/index.html`

1. **before** Internal Tooling — Ryan DeBoer
   **after**  Internal Tooling | Ryan DeBoer

2. **before** Internal Tooling — case study by Ryan DeBoer
   **after**  Internal Tooling, case study by Ryan DeBoer


## `public/share/landing-pages/index.html`

1. **before** SEO Framework — Ryan DeBoer
   **after**  SEO Framework | Ryan DeBoer

2. **before** SEO Framework — case study by Ryan DeBoer
   **after**  SEO Framework, case study by Ryan DeBoer


## `public/share/loopstack/index.html`

1. **before** Timing Intelligence — Ryan DeBoer
   **after**  Timing Intelligence | Ryan DeBoer

2. **before** Timing Intelligence — case study by Ryan DeBoer
   **after**  Timing Intelligence, case study by Ryan DeBoer


## `public/share/playdraft/index.html`

1. **before** 12 Weeks — Ryan DeBoer
   **after**  12 Weeks | Ryan DeBoer

2. **before** 12 Weeks — case study by Ryan DeBoer
   **after**  12 Weeks, case study by Ryan DeBoer


## `public/share/tire-categories/index.html`

1. **before** Optimizations — Ryan DeBoer
   **after**  Optimizations | Ryan DeBoer

2. **before** Optimizations — case study by Ryan DeBoer
   **after**  Optimizations, case study by Ryan DeBoer


## `public/share/wheelrack/index.html`

1. **before** Journey Redesign — Ryan DeBoer
   **after**  Journey Redesign | Ryan DeBoer

2. **before** Journey Redesign — case study by Ryan DeBoer
   **after**  Journey Redesign, case study by Ryan DeBoer


## `public/share/heatherwood/index.html`

1. **before** Equestrian Academy — Ryan DeBoer
   **after**  Equestrian Academy | Ryan DeBoer

2. **before** Equestrian Academy — case study by Ryan DeBoer
   **after**  Equestrian Academy, case study by Ryan DeBoer

3. **before** family-owned equestrian academy — brand identity, IA, WordPress CMS, and SEO architecture.
   **after**  family-owned equestrian academy: brand identity, IA, WordPress CMS, and SEO architecture.


## `public/share/tire-rack-winter/index.html`

1. **before** Seasonal Content System — AEM & Adobe Target — Ryan DeBoer
   **after**  Seasonal Content System: AEM & Adobe Target | Ryan DeBoer

2. **before** content="Seasonal Content System — AEM & Adobe Target"
   **after**  content="Seasonal Content System: AEM & Adobe Target"

3. **before** Seasonal Content System — AEM & Adobe Target — case study by Ryan DeBoer
   **after**  Seasonal Content System: AEM & Adobe Target, case study by Ryan DeBoer


## `public/artifacts/eight-wrong-first-drafts.html`

1. **before** a post on product evolution — eight times the first idea lost to the data.
   **after**  a post on product evolution: eight times the first idea lost to the data.

2. **before** otherwise — with the numbers that said it.
   **after**  otherwise, with the numbers that said it.

3. **before** Pay drafters for reaching — taking something later than the world takes it.
   **after**  Pay drafters for reaching, taking something later than the world takes it.

4. **before** chalk 99–100% of the time — the precise inverse of its purpose.
   **after**  chalk 99–100% of the time. The precise inverse of its purpose.

5. **before** is not measurable — you cannot detect a gem without evidence that it was one.
   **after**  is not measurable. You cannot detect a gem without evidence that it was one.

6. **before** category is 14 items — about 7 on a live board,
   **after**  category is 14 items, about 7 on a live board,

7. **before** Nothing yet — narrowed to one locked round
   **after**  Nothing yet: narrowed to one locked round

8. **before** Untracked media directories — screenshots, demo reels, design references — are bloating every build.
   **after**  Untracked media directories (screenshots, demo reels, design references) are bloating every build.

9. **before** was .git — the one rule in the file that does nothing,
   **after**  was .git, the one rule in the file that does nothing,

10. **before** The lever was never variety — it was scarcity.
   **after**  The lever was never variety. It was scarcity.

11. **before** True by subtraction — 50 minus 0 is inside the threshold — and nonsense as a sentence,
   **after**  True by subtraction (50 minus 0 is inside the threshold) and nonsense as a sentence,

12. **before** timeout sweeper has no client — so when a casual player missed their clock,
   **after**  timeout sweeper has no client, so when a casual player missed their clock,

13. **before** The most expensive category — where a comment or a constant asserted
   **after**  The most expensive category: where a comment or a constant asserted

14. **before** and marked fixed — six days earlier, in response to the same complaint.
   **after**  and marked fixed six days earlier, in response to the same complaint.

15. **before** ever sees it — so the centring was a silent no-op,
   **after**  ever sees it, so the centring was a silent no-op,

16. **before** from a nearby constant — clock plus sweeper lag — but that lag is what
   **after**  from a nearby constant (clock plus sweeper lag), but that lag is what

17. **before** and proven to work — on its verification run it flipped 2nd and 3rd,
   **after**  and proven to work. On its verification run it flipped 2nd and 3rd,

18. **before** within minutes of a real board — because a fixture never has a drafter
   **after**  within minutes of a real board, because a fixture never has a drafter

19. **before** not just what — a why is checkable.
   **after**  not just what: a why is checkable.

20. **before** Source notes, not a draft post — angles and numbers to pull from.
   **after**  Source notes, not a draft post: angles and numbers to pull from.

## Wording judgment calls worth a second look

Everything else is pure punctuation. These five changed slightly more than the mark itself:

1. **`Testimonials.tsx`, both copies of the Dan quote.** "Ryan doesn't just design screens—he designs the whole experience." became "...design screens. He designs the whole experience." Splitting the sentence capitalizes "he". These are verbatim LinkedIn recommendations, so it is someone else's sentence being re-punctuated. No words added or removed.
2. **`Testimonials.tsx`, both copies of the Rachel quote.** The commas inside "UX, UXR, Analytics, Imaging, and SEO" made comma-bracketing ambiguous, so the aside became parentheses: "engage relevant teams (including UX, UXR, Analytics, Imaging, and SEO) whenever needed." Also a verbatim recommendation.
3. **`FAQ.tsx`, the Stephanie line.** Became two sentences: "I married my high school sweetheart Stephanie. We've now spent more than half our lives together, and our two kids are the center of everything." The original "and" now joins the second sentence's two clauses instead of resuming after the aside.
4. **`projects.ts`, the WheelRack compact decision.** "props, states, and reusable components: a foundation I later carried into building PlayDraft..." A comma there would have been the fourth in a row after the list, so the appositive takes a colon.
5. **`homepage-template.tsx`, four placeholders.** `[Opening pitch — one or two sentences...]` and the three paragraph placeholders. These only render on the unlinked `#/homepage_template` preview, but the file is the scaffold every targeted homepage is copied from, so fixing it stops future copies inheriting an em dash.

## Deliberately left in place

Each of these renders or ships, but changing it would be wrong or belongs elsewhere. Flagged for Ryan's call.

1. **`src/data/projects.ts:1943-1959` (4 em dashes).** Inside the PlayDraft `codeBlock`, whose `filename` reads `src/design-system/packs.ts (excerpt, real file)` and whose caption calls it "An excerpt from the original pack registry." The em dashes are in that file's own comments. Rewriting them here would make a displayed verbatim excerpt stop matching the source. The fix belongs in PlayDraft's repo, then re-copied.
2. **`src/data/talent/*.test.ts` and `archetypes.test.ts` (6).** These are the guardrails that already assert no em dash reaches talent-tree copy (`const EM_DASH = '—'`, `.not.toContain('—')`). Not rendered.
3. **`public/skills/ryan-design-taste.md` (13).** Served, and linked from the `ryan-design-taste-skill` note as "Read the full skill (Markdown)", so a reader can open it. 11 of the 13 are structural section-heading separators (`# MODE A — TRUST-FIRST RETAIL COMMERCE`, `## 10. OUTPUT TARGET A — HTML / CSS / REACT`); 2 are prose (line 7, line 2285). This is an agent instruction document maintained outside this repo, so editing only the published copy creates drift. Worth a decision: rewrite the headings in the source skill and re-publish, or exempt it as a spec rather than copy.
4. **`public/loopstack-demo/**` (222, of which 216 are in the minified `assets/index-bEiLjB0x.js`).** Vendored build output of the LoopStack app, including its own `<title>LoopStack — Understand. Adapt. Improve.</title>`. Fixing it means fixing LoopStack's source and re-running its build, not editing the bundle.
5. **`public/images/work/playdraft/ASSETS.md` (9) and `public/images/notes/paper-exploration/SOURCES.md` (1).** Asset documentation sitting in image folders. Nothing links to them and no page renders them.
6. **`public/artifacts/eight-wrong-first-drafts.html:92` (1).** A CSS comment inside `<style>`.
7. **Code comments across `src/` (265).** Untouched by design.

## Scope note

The task scope was `src/**/*.ts(x)` plus Markdown/JSON under `public/` served as copy. Beyond that I also fixed the hand-authored HTML under `public/` that the site serves directly, because it renders: `public/index.html` (2 OG/Twitter image-alt strings), the nine `public/share/<slug>/index.html` preview pages (titles, descriptions, image alts), `public/talentTree/index.html` (one title), and `public/artifacts/eight-wrong-first-drafts.html` (the source-notes page linked from the "Eight wrong first drafts" note). Those are listed in their own sections above so they can be reviewed as a separate batch.

## Verification

- `npx tsc --noEmit` exits 0.
- Classification script (`classify_emdash.py`) over `src/`: 275 em dashes total, 265 in comments, 10 rendered candidates, all 10 being the deliberate cases in items 1 and 2 above.
- `CI=true npx react-scripts test --watchAll=false`: 190 pass, 1 fails. That failure (`content.test.ts`, "every note has a dek short enough to serve as a meta description", `simplifying-playdraft-without-losing-the-game` at 191 chars) is pre-existing: it fails identically with `src/data/notes.tsx` stashed back to HEAD, and the set of over-length deks is unchanged by this sweep.
- Scripts and raw output kept in the scratchpad: `classify_emdash.py`, `apply_src.py`, `apply_public.py`, `emdash-pass1.txt`, `emdash-final-src.txt`, `emdash-final-public.txt`, `ledger-src.json`, `ledger-public.json`.
