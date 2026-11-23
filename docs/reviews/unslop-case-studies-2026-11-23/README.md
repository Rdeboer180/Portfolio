# Unslop pass: case studies, 23 Nov 2026

Every case study in `src/data/projects.ts`, read against the `unslop` / `humanizer` tells and rewritten to the `ryans-taste` voice. One file changed: `src/data/projects.ts`. 81 edits across all 13 studies (12 listed, plus the hidden Photography Workflow Agent). The homepage hero was out of scope.

## What I checked

- The full study (what a locked visitor reads) and the compact overview (what an unlocked visitor reads), including card hooks, theses, margin asides, punch lines, callouts, captions, metrics and outcome notes.
- Every rewritten field renders as visible text (`CaseStudyPage.tsx`, `ProjectOverview.tsx`). None is sr-only. The sr-only strings on these pages are "(opens in a new tab)" and were left alone.
- No facts, numbers, dates, names, tools or ship status were changed or added. Two numbers in the LoopStack outcome caption (54 mg/dL per unit, 18 meals) are copied from the same image’s alt text.
- No em dashes in any case-study copy, before or after. Earlier passes had already removed them.

## The patterns I removed

1. **Clipped-fragment punches.** "Manual seasonal updates. No scalable system. Winter and southern-states customers seeing the same content." Seven studies had problem, gaps or constraints lines built from three or four parallel fragments. Each became one sentence that states the problem.
2. **Taglines standing in for facts.** "A shared starting point. A clearer handoff." "Curves over entries. Confidence over recommendations." "Make landing pages a system, not a fire drill." Replaced with the concrete claim underneath them.
3. **Subject-less résumé lines.** "Authored, tested, and deployed…", "Coordinated across…", "Built on WordPress…", "Trained the owner…". Now first person, with the decision or the reason (for example "because the budget ruled out custom code").
4. **Closing triplets that restate the section.** "…once it has a rule, a class, and a picture." "…made seasonal swaps faster, kept…, and gave…". Cut, or cut to the one point that adds something.
5. **Caption filler.** "working together", "maintaining full functionality", "extending the identity into physical touchpoints", "The payoff:". Captions now say what is in the picture.
6. **Decorative metrics.** "1 → 2, One system, two experiences" (Bolus Binder). Four wordless metrics on the hidden photography study. Cut. "Weeks → Days" on Landing Pages overstated the stated result, so it now reads "~1 mo → 1–2 wk, complex pages" (see flags).
7. **Hype and consultant words.** "surgical", "Balancing data with intuition", "real product decisions", "receives the intended experience", "retain approval and responsibility".

## Left alone on purpose

- **PlayDraft and Overscroll Tactics** were already in Ryan’s voice. Each got one small fix.
- **Design Enablement, WheelRack’s body copy and the AEM Component System body** are specific and honest already. They got light edits only.
- **One negation-then-assertion line per study where it carries the point.** For example "the practice did not get a designer looking at a healthcare brief. It got a patient." This is one of Ryan’s own moves, not a tell, when it's used once.
- **Titles, card titles and SEO titles.** They feed search, the binder spine and the sitemap, and were tuned recently (ddaa3ec). See the flag on Design Enablement.
- **Tags and role strings.** These are search terms, not prose.
- **`/notes/*`.** These are Ryan’s own essays, and the voice skill was built from them. Rewriting them in a pass like this would be circular. If you want them covered, run them as a separate pass.

## Flagged claims, and how each was settled

Ryan reviewed the flags on 23 Nov 2026. He gave the scope of the AEM load claim and said to reconcile the rest.

| Study | Line | Settled as |
|---|---|---|
| AEM Component System | "WebPageTest reported 60% faster loads" | **Ryan supplied the scope.** It now reads "60% faster loads across the 120+ pages using them: category landing pages, tires, wheels, parts, research and delivery". The metric label became "Faster loads across 120+ pages (WebPageTest)". |
| WheelRack | Partners 6 → 10, credited to the designs | The hedge ("alongside other business factors") is restored in the summary, so every mention now carries it. |
| Tire Categories | Aside "People could not decide." | Replaced with "Forty categories, mostly text, and no way to compare them," taken from the problem section. |
| Landing Pages | Metric "Weeks → Days" | Now "~1 mo → 1–2 wk, complex pages on the templates", matching the outcome note. |
| Landing Pages | "<1 QA issues per page on average" | Kept. This is Ryan’s figure, and the two places it appears agree. |
| Seasonal Content | "Winter conversion has generally been stronger" | Kept. It is already hedged for weather, marketing and product, and it claims no number. |
| T1D Hub | "navy for stability, sky blue for hope" | Stays cut. No system doc with that language turned up outside the portfolio’s own copy. |
| T1D Hub | "an app … that people can cook with" | Stays cut to "a working app in TestFlight". |
| LoopStack | "clinician-safe" in the code caption | Stays removed, because the outcome note says the clinician review is still to come. |
| LoopStack | Reconstructed prompt | The caption says it isn’t verbatim, and the code block’s filename now reads "pattern-review prompt (representative)" rather than a file name that implied a real file. |
| Design Enablement | Title says "optimize and automate" | Kept. Titles feed search and were tuned in ddaa3ec. |
| Photography Workflow Agent | Claims of use with no evidence; overlaps the Hero Crop Simulator | The causal line is softened and the wordless metrics are cut. The study stays hidden (direct link only), and Design Enablement carries the public version. |

The résumé page (`src/data/resume.ts`) carries the same 120+ page scope. `public/Ryan-DeBoer-Resume.pdf` still has the old line; there is no generator for it in the repo, so it was left for the résumé system.

The homepage binder ships its own snapshot of this copy (`public/binder-home/binder.js`, built from `docs/explorations/binder-specimen/`). It was regenerated so the cards and fly-outs show the rewrites. The LoopStack hero was kept at the committed image: the local hero override had been changed today, outside this PR.

## Checks

- `node scripts/steel-curtain.mjs`: holds, nothing blocking.
- `npx tsc --noEmit`: clean.
- `react-scripts test` on `src/components/CaseStudyPage` and `src/data`: 10 suites, 117 tests pass.
- `npm run build`: compiled and prerendered.
- `node scripts/verify-hydration.cjs`: 101 routes pass in all four modes (desktop, reduced motion, phone, unlocked). There is no mismatched markup. The 99 lazy-route Suspense redraws were already known.

## Before and after, by study

The field names match `src/data/projects.ts`. "Tell" is the pattern that flagged the line.

## Figma Template Governance

**summary**. Tell: abstract noun + triplet ("carry the project brief through design, proofing, and handoff")

- Before: Together, they carry the project brief through design, proofing, and handoff.
- After: The brief, the proofs and the handoff checklist now live in the design file.

**thesis**. Tell: tagline (two fragments, no fact)

- Before: A shared starting point. A clearer handoff.
- After: Open the file and the brief is already on the cover.

**insightCallout**. Tell: generic hook ("without needing its original designer in the room")

- Before: The file should help the next person understand the work without needing its original designer in the room.
- After: Someone who wasn’t on the project should be able to open the file and see what was asked and what’s left.

**overview decision title**. Tell: abstract noun heading

- Before: Make handoff readiness explainable
- After: Say why a step was skipped


## WheelRack

**summary**. Tell: causal claim without its hedge; long chained sentence

- Before: I specified every state and edge case in the terms our React engineer built from, and the designs and the dealer experience helped the platform grow from six retail partners to ten.
- After: I specified every state and edge case in the terms our React engineer built from. Retail partners grew from six to ten during the build, and the designs helped win them, alongside other business factors.

**studyHero caption**. Tell: triplet + "one responsive experience"

- Before: The dealer view brings filters, a vehicle preview, and front/rear purchasing options into one responsive experience. Design artifact.
- After: Filters, the vehicle preview and front and rear purchasing on one dealer screen. Design artifact.

**journey description**. Tell: filler closing line

- Before: Those rules gave the team a shared starting point for each screen.
- After: *(cut)*


## Tire Categories

**annotation (problem)**. Tell: claim with no evidence ("People could not decide")

- Before: Too many choices, too much text. People could not decide.
- After: Forty categories, mostly text, and no way to compare them.

**annotation (approach)**. Tell: consultant phrase ("Balancing data with intuition")

- Before: Balancing data with intuition: eight core icons, not ninety.
- After: Eight core icons, not ninety.

**cardHook**. Tell: passive voice hides who did it

- Before: 30+ category pages were rebuilt into one guided system. Top pages lifted conversion up to +50% in the first month.
- After: I rebuilt 30+ category pages on one icon and comparison system. Top pages lifted conversion up to +50% in the first month.

**problem**. Tell: triplet adjectives + a third paragraph that restates the first

- Before: The experience was dense, inconsistent, and almost entirely verbal. More than 40 categories, many with 80 or more products, had no shared way to show how one choice differed from another.",
  "I needed to translate that knowledge into a comparison someone could use, even if this was the first Tire Rack page they had seen.
- After: The pages were dense and almost all text. More than 40 categories, many with 80 or more products, had no shared way to show how one choice differed from another.

**gapsPunch**. Tell: abstract restatement

- Before: No visual language existed. Design had to define both the system and the vocabulary.
- After: There was no visual language to start from. I had to build the system and its vocabulary.

**constraints**. Tell: generic design-speak ("clean, scannable design")

- Before: SEO content requirements had to coexist with clean, scannable design.
- After: SEO copy had to stay on the page without pushing the comparison down.

**insightCallout**. Tell: subject-less opener + "scalable system" + "governs"

- Before: Pushed back on 90 one-off icons in favor of a scalable system: 8 primary icons for broad strengths, 24 supporting icons for specific category distinctions. This framework now governs a 100+ icon sprite library used across the site.
- After: I pushed back on 90 one-off icons. We shipped two tiers instead: 8 primary icons for broad strengths and 24 supporting icons for category differences. The same tiers now organize a 100+ icon sprite library across the site.

**outcome caption**. Tell: "working together" caption that says nothing

- Before: Category page in context: performance data, icon system, and product discovery working together
- After: A category page with the performance chart, the icons and the product grid in place.

**outcome caption**. Tell: "maintaining full functionality"

- Before: Mobile category experience: responsive layout maintaining full functionality
- After: The Winter category page on a phone.

**overview deck**. Tell: triplet + generic benefit line

- Before: A shared icon, comparison, and content system helps shoppers choose a tire category without first becoming tire experts.
- After: One icon and comparison system across 30+ category pages, so a shopper can pick a category without learning our testing vocabulary first.


## T1D Hub + Bolus Binder

**summary**. Tell: meta opener ("This study has two parts. The first is...") and one long sentence per part

- Before: This study has two parts. The first is T1D Hub, the brand identity and design system I built with Dr. Brian Huber for his Type 1 practice, from the logo to the site his marketing team runs. The second is Bolus Binder, a React Native companion app on the same system, where scaling a recipe moves its nutrition and estimated absorption with it. A controlled diabetic already reads a CGM trace every day, so both use the trace and the colors they already know.
- After: T1D Hub is the brand identity and design system I built with Dr. Brian Huber for his Type 1 practice, from the logo to the site his marketing team runs. Bolus Binder is a React Native companion app on the same system: scale a recipe and its nutrition and estimated absorption move with it. A controlled diabetic already reads a CGM trace every day, so both use the trace and the colors they already know.

**metric**. Tell: decorative metric ("1 → 2, One system, two experiences")

- Before: { value: '1 → 2', label: 'One system, two experiences · The T1D Hub clinic brand and the Bolus Binder companion app' }
- After: *(cut)*

**approach label**. Tell: tagline label ("A real brand, built to be used")

- Before: A real brand, built to be used
- After: A mark built around the CGM trace

**design system description**. Tell: process inventory that buries the rule; brand-speak ("navy for stability, sky blue for hope")

- Before: It is built from the logo’s two-tone foundation: deep navy for stability, sky blue for hope and for data. Twelve color tokens carry clinical meaning, so green is in range, amber is above and red is an urgent low, the same colors a patient already trusts on a CGM. Four gradients stand for stages of the Type 1 journey. Sora carries the headings, Inter the body, and JetBrains Mono is reserved for numbers, so a glucose figure never reads as prose. The system also covers buttons, badges, inputs, alerts, cards and navigation, plus a CGM chart language with a time-in-range summary. Its motion rules keep things calm: entrances take 350ms, the CGM trace draws in 1000ms, and micro-interactions take 150ms. It closes on the brand in context: the website, an office wall, conference slides and business cards.
- After: It is built on the logo’s navy and sky blue. Twelve color tokens carry clinical meaning: green is in range, amber is above and red is an urgent low, the same colors a patient already trusts on a CGM, and none of them is used for decoration. Sora sets the headings, Inter the body, and JetBrains Mono only the numbers, so a glucose figure never reads as prose. Four gradients stand for stages of the Type 1 journey. It also covers buttons, badges, inputs, alerts, cards, navigation and a CGM chart language with a time-in-range summary. Motion stays calm: 350ms entrances, a 1000ms trace draw, 150ms micro-interactions. The last pages show the brand on the website, an office wall, conference slides and business cards.

**build description**. Tell: unsupported closing claim ("that people can cook with")

- Before: The result is a working app in TestFlight that people can cook with.
- After: The result is a working app in TestFlight.


## AEM Targeting & Seasonal Content

**summary**. Tell: triplet of abstract nouns ("documented authoring rules, junior-designer onboarding, and final review")

- Before: More than 20 seasonal fragments serve six landing pages, supported by documented authoring rules, junior-designer onboarding, and final review.
- After: More than 20 seasonal fragments serve six landing pages. I wrote the authoring rules, trained two junior designers to author them, and still do the final review.

**cardHook**. Tell: feature list with no decision; "within a shared review workflow"

- Before: Reusable AEM Experience Fragments support A/B testing and geographic targeting with Adobe Target. Authors update 20+ seasonal fragments across six pages within a shared review workflow.
- After: The page stays put and the fragments swap. 20+ AEM Experience Fragments, targeted by region through Adobe Target, change six pages each season without a rebuild.

**problemPunch**. Tell: three-fragment slogan ("No scalable system.")

- Before: Manual seasonal updates. No scalable system. Winter and southern-states customers seeing the same content.
- After: Seasonal swaps were manual, and winter-climate and southern-state customers saw the same page.

**gapsPunch**. Tell: "no X, no Y, no Z" triplet

- Before: No fragment library, no audience targeting, no way to serve different content to different regions without page duplication.
- After: There was no way to show two regions different content without duplicating the page.

**constraintsPunch**. Tell: three parallel "X must/needs" fragments

- Before: Google must not see duplicate pages. Analytics needs audience segmentation. Photography needs seasonal imagery on a schedule.
- After: Google could not see duplicate pages, and the audience split had to run through Analytics.

**constraints**. Tell: subject-less opener + triplet

- Before: Shaped the annual Sweden winter-shoot wishlist alongside Tire Rack’s tire-testing trips. The brief for composition and tone drew on marketing goals, AI-generated reference imagery, and design-system needs.
- After: I shape the shot wishlist for the annual winter shoot in Sweden, which runs alongside Tire Rack’s tire-testing trips. The brief draws on marketing goals, AI-generated reference images and the design system.

**constraints**. Tell: subject-less + "approvals, governance, and design-system alignment"

- Before: System needed to be documented clearly enough for two junior designers to author seasonally alongside me, with my oversight on approvals, governance, and design-system alignment.
- After: The system had to be written down well enough for two junior designers to author each season, with me approving the work.

**constraints**. Tell: "coordinated fixes across" abstraction

- Before: When breaks happen, they are usually tied to Experience Fragment / Adobe Target sync issues. Those get resolved through coordinated fixes across authoring, analytics, and targeting.
- After: When it breaks, it is usually an Experience Fragment out of sync with Adobe Target. Fixing that takes authoring, Analytics and targeting together.

**insightCallout**. Tell: triplet of benefits after the decision

- Before: That one decision made seasonal swaps faster, kept regional targeting out of duplicated URLs, and gave junior designers a system they could run.
- After: That one call kept regional targeting off duplicate URLs and made the swap something a junior designer can run.

**approach (team)**. Tell: subject-less parenthetical inventory

- Before: Coordinated across Analytics (audience segmentation rules), Photography (seasonal shoots I directed), SEO (variant indexing strategy), and junior designers (authoring onboarding).
- After: Analytics owned the audience split, Photography shot the seasonal images I directed, SEO decided how variants were indexed, and the junior designers had to learn the authoring. I coordinated all four.

**approach (system)**. Tell: subject-less fragment list

- Before: Built reusable fragment types: Hero, Teaser, Entertainment, Video Center, Category Bar. Each with content fields, link behavior, and CTA configuration authored directly in AEM.
- After: I built five fragment types: Hero, Teaser, Entertainment, Video Center and Category Bar. Authors set the content, links and buttons in AEM.

**approach (build)**. Tell: subject-less verb triplet ("Authored, tested, and deployed")

- Before: Authored, tested, and deployed seasonal content directly in AEM. Documented the system in Confluence and mentored junior designers through the authoring workflow.
- After: I authored and shipped the seasonal content in AEM myself, then wrote the system up in Confluence and walked the junior designers through authoring it.

**takeaways**. Tell: abstract restatement of a constraint

- Before: When Experience Fragments and Adobe Target fall out of sync, authoring, analytics and targeting work through the fix together.
- After: Most breaks are a fragment out of sync with Target, and I still own those fixes.

**overview decision**. Tell: "receives the intended experience"

- Before: I coordinate the regional audience split with Analytics so each page receives the intended experience.
- After: I coordinate the regional audience split with Analytics, so winter-climate visitors get the winter page.

**overview decision**. Tell: corporate register ("retain approval and responsibility")

- Before: I retain approval and responsibility for exceptions.
- After: I still approve the swaps and own the exceptions.


## Heatherwood

**gapsPunch**. Tell: hype contrast + "infrastructure"

- Before: An aging identity up against polished commercial programs, with none of the SEO or conversion infrastructure to compete.
- After: An old identity next to polished commercial programs, and no search presence or inquiry path to compete with them.

**gaps image caption**. Tell: "extending the identity into physical touchpoints"

- Before: Brand collateral: extending the identity into physical touchpoints
- After: The roadside sign, with a QR code to the site.

**constraintsPunch**. Tell: three clipped fragments

- Before: Non-technical owner. Real photography needed. Every page doubles as a search entry point.
- After: The owner had to run it herself, and every page had to work as a search landing page.

**approach (build)**. Tell: subject-less tool inventory

- Before: Built on WordPress with Elementor, WPForms for contact routing, and Yoast SEO for on-page optimization. Configured caching, analytics, and form notifications for the owner.
- After: WordPress with Elementor, because the budget ruled out custom code. WPForms routes the inquiries and Yoast handles on-page SEO. I set up caching, analytics and the form notifications before handing it over.

**approach (handover)**. Tell: subject-less one-liner

- Before: Trained the owner to manage content updates independently.
- After: I trained Deborah to update the content herself. She now adds services and checks form submissions and SEO scores on her own.

**approach captions**. Tell: label-colon captions in SEO jargon

- Before: Services hub: 10 SEO entry points with consistent card patterns
- After: Services: ten offerings, each a card that leads to its own page.

**approach captions**. Tell: label-colon caption

- Before: Service landing page: dedicated contact form on every page
- After: A service page, with its own contact form.

**outcome captions**. Tell: label-colon caption ("primary inquiry CTA")

- Before: Homepage: SEO-targeted headline with primary inquiry CTA
- After: Homepage: the headline families search for, and one inquiry button.

**outcome captions**. Tell: "Mobile experience" caption

- Before: Mobile experience: service cards and enrollment flow
- After: On a phone: service cards and the enrollment button.

**metric**. Tell: jargon label ("No agency dependency post-handoff")

- Before: No agency dependency post-handoff
- After: Deborah updates it herself, no agency

**overview decision**. Tell: abstract ("clear training", "ongoing developer relationship")

- Before: WordPress, Elementor, and clear training let Deborah update content independently. The site did not require an ongoing developer relationship to stay useful.
- After: I built on WordPress and Elementor and trained Deborah to update it herself. The site does not need a developer to stay current.


## Landing Page System

**thesis**. Tell: "not X" slogan

- Before: Make landing pages a system, not a fire drill.
- After: Stop solving the same landing page twice.

**annotation (approach)**. Tell: motivational slogan

- Before: Invest in the system, and speed stops costing quality.
- After: Put the repeated decisions in templates.

**problemPunch**. Tell: "no X, no Y, no scalable process" triplet

- Before: Every landing page started from scratch. No templates, no patterns, no scalable process.
- After: Every landing page started from an empty Figma file.

**gapsPunch**. Tell: three clipped fragments ("No component strategy.")

- Before: No reusable templates. No component strategy. Speed and quality treated as tradeoffs.
- After: Every request remade the same layout decisions, and fast meant rushed.

**constraintsPunch**. Tell: four clipped fragments

- Before: Minimal briefs. Two audiences (users + search engines). AEM component limitations. Speed is the expectation.
- After: Thin briefs, two readers (the shopper and the search engine) and AEM’s component limits, on a fast turnaround.

**metric**. Tell: overstated metric ("Weeks → Days" when complex pages went from ~1 month to 1–2 weeks)

- Before: { value: 'Weeks → Days', label: 'Turnaround via governed template system' }
- After: { value: '~1 mo → 1–2 wk', label: 'Complex pages, on the templates' }


## AEM Component System

**publicPlan lead**. Tell: "drawn in the portfolio’s own hand" flourish

- Before: The process, drawn in the portfolio’s own hand: how the homepage concepts were ordered, tested, explored section by section, and refined into one page. The boards themselves, from the exploration file, the reDesign file, and the component guide, open with the password.
- After: I redrew the process for the public page: how the homepage concepts were ordered, tested, explored section by section and refined into one page. The real boards, from the exploration file, the reDesign file and the component guide, open with the password.

**insightCallout**. Tell: closing triplet that restates the section

- Before: The guide documents all three, the branch fixes what it can, and the exploration file shows what the next option should be, with its test, before anyone builds it.
- After: *(cut)*

**approach label**. Tell: triplet heading

- Before: Show authors the result, keep the open items in writing, and draw where the options go next
- After: Show authors the result before they pick it

**approach (iteration)**. Tell: closing triplet ("a rule, a class, and a picture")

- Before: It is the direction the style options move toward, and the guide is where each option lands once it has a rule, a class, and a picture.
- After: *(cut)*

**overview decision**. Tell: same closing triplet

- Before: The guide is where each option lands once it has a rule, a class, and a picture.
- After: *(cut)*


## Design Enablement

**constraints**. Tell: hype word ("surgical")

- Before: Everything was built alongside normal production work, so scope stayed surgical.
- After: I built everything alongside normal production work, so I kept each tool small.


## LoopStack

**context**. Tell: third sentence restates the first two

- Before: It brings recurring patterns into view for personal review and care-team discussion.
- After: *(cut)*

**annotation (gaps)**. Tell: tagline ("X over Y. A over B.")

- Before: Curves over entries. Confidence over recommendations.
- After: Compare repeat meals by their curves, and say how sure the app is.

**annotation (approach)**. Tell: "X, not a feature" construction

- Before: Confidence is the safety mechanism, not a feature.
- After: A pattern needs repeats before the app calls it one.

**gapsPunch**. Tell: arrow slogan + repeated tagline

- Before: Static logs → pattern review. Curves over entries; confidence over recommendations.
- After: A log lists meals. I needed to compare them.

**constraintsPunch**. Tell: clipped fragments ("Solo 0 → 1. High-stakes domain.")

- Before: Solo 0 → 1. High-stakes domain. Pattern review and care-team discussion, never dosing advice.
- After: Just me, no clinical team, and health data. It reviews patterns and never gives dosing advice.

**approach (structure)**. Tell: subject-less opener + "Every surface has a single job"

- Before: Mapped the loop as Input → Compare → Cluster → Review → Refine. Every surface has a single job.
- After: I mapped the loop as Input → Compare → Cluster → Review → Refine and gave each screen one step.

**image caption**. Tell: "visibly and explainably"

- Before: Real sources in. Fitness load shifts the sensitivity baseline, visibly and explainably.
- After: Apple Health, Dexcom and Loop connected. Fitness load shows up as a visible multiplier on sensitivity.

**code caption**. Tell: unverified claim ("clinician-safe") the outcome note contradicts

- Before: Representative prompt used to keep every generated surface inside clinician-safe boundaries: pattern review and discussion points, not dosing directives.
- After: A representative prompt, not a verbatim one. It kept generated screens to pattern review and discussion points, with no dosing directives.

**outcome caption**. Tell: generic hook ("The payoff:")

- Before: The payoff: observed sensitivity earns its confidence tier next to what Loop is running, as evidence for a care-team conversation.
- After: Observed sensitivity beside the setting Loop is running: 54 mg/dL per unit across 18 meals, as evidence to bring to a care team.

**takeaways**. Tell: "not enthusiasm" quip

- Before: Tiers are gated by evidence, not enthusiasm: one odd meal stays an observation until the pattern holds.
- After: One odd meal stays an observation until the pattern repeats.

**metric**. Tell: ungrammatical label

- Before: Every output frames as evidence or discussion point
- After: Every output is evidence or a point to discuss

**overview deck**. Tell: long audience clause ("tighter control ... and the confidence to refine")

- Before: An open-source SaaS for the Loop community, for people who want tighter control of their glucose and the confidence to refine their settings with their care team. It follows repeat meals through their full glucose-response window and puts recurring patterns in front of you with the evidence beside them. On the phone it is the glance; on the desktop it is a dashboard you arrange yourself, with a care-team review in the same app.
- After: An open-source SaaS for the Loop community. It follows a repeat meal through its whole glucose response and shows recurring patterns with the evidence beside them, to review on your own or with a care team. The phone is the glance; the desktop is a dashboard you arrange, with a care-team review in the same app.

**overview decision**. Tell: "keeps those observations in review scope"

- Before: The app keeps those observations in review scope, without recommending changes.
- After: The app shows them for review and never recommends a change.


## PlayDraft

**constraints**. Tell: filler intensifier ("real product decisions")

- Before: App Store guidelines shaped real product decisions:
- After: App Store guidelines changed the product:


## Overscroll Tactics

**systemMarker**. Tell: hype marker ("THE PAYOFF")

- Before: THE PAYOFF
- After: DIE-CUT


## Photography Workflow Agent (hidden, direct link only)

**summary**. Tell: triplet ("run, preview, and check") + "packages ... into one interface"

- Before: A zero-install internal tool that packages a repetitive photography workflow into one interface the team can run, preview, and check themselves. I used Claude to accelerate the build, then tested it against the team’s real tasks.
- After: A zero-install internal tool for a repetitive photography workflow. The team runs it and checks the preview themselves. I used Claude to speed up the build, then tested it on the team’s real tasks.

**problemPunch**. Tell: abstract ("judgment-heavy image production steps") + "a real team"

- Before: Repetitive, judgment-heavy image production steps were slowing a real team down.
- After: The photography team repeated the same setup by hand, and mistakes showed up late.

**gapsPunch**. Tell: double "not X" tagline

- Before: A tool, not a deck. Built to be used, not presented.
- After: It had to follow the team’s steps, not add another image editor.

**constraintsPunch**. Tell: three clipped fragments

- Before: Self-started. Zero-install. Real users on day one.
- After: I started it alongside project work, and it had to run with no install.

**outcomeNote**. Tell: causal adoption claim with no evidence

- Before: Claude accelerated the build, but adoption came from matching the team’s real sequence and leaving the final judgment with them.
- After: Claude sped up the build. The design work was following the team’s own order of steps and leaving the final call with them.

**metrics**. Tell: decorative metrics with no number

- Before: { value: 'Self-started', label: 'Built alongside core work' },
      { value: 'Zero-install', label: 'Runs for non-technical users day one' },
      { value: 'In use', label: 'Adopted by a real internal team' },
      { value: 'AI-assisted', label: 'Claude accelerated the working build' }
- After: { value: 'Zero-install', label: 'No install and no technical onboarding' },
      { value: 'In use', label: 'By the internal photography team' }

