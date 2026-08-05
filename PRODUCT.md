# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary readers are hiring managers, design leaders, and recruiters evaluating Ryan DeBoer for senior Product Design and Design Engineering roles, remote and US-based. They arrive skeptical and time-constrained, often mid-search, and need to confirm seniority and the design-engineer edge quickly, then verify it for themselves. Secondary readers are the peers and design leaders whose standards Ryan measures the work against.

## Product Purpose

rdeboerdesigns.com is Ryan DeBoer's personal portfolio and its own case study: the design system it documents is the one it runs on. It exists to prove, with evidence a reader can check, that Ryan operates at a senior level as a product designer who also builds, and to convert that proof into interview conversations for senior Product Design / Design Engineering roles. Success is a hiring manager reaching "this person is past the title, and I can verify it" within the first screen, then going deeper into case studies, notes, and the live design system.

## Positioning

Ryan designs systems and then helps build them, the implementation half most design roles leave out, and increasingly encodes his judgment as installable agent skills and agent-readable documentation so the standard travels with the work instead of living in his head. The test he holds himself to: a system succeeds when a team, or an agent, decides well without him in the room. A neighboring "senior product designer" cannot truthfully copy the combination of production front-end depth, design-system governance, and judgment-as-portable-artifact.

## Operating Context

- Readers evaluate across surfaces: the homepage (hero, about, strengths, technical, how-i-work, testimonials, work, FAQ), an /about narrative, per-project case studies at /work/:slug, a /notes writing stream, a live /design-system token page, and a résumé.
- Case studies carry real employer (Tire Rack) and client work. Confidential ones are password-gated; only "portfolio-safe" assets are ever public.
- Evaluation extends off-site to LinkedIn (positioned as in-progress thinking) and to live product demos, e.g. WheelRack at wheelrack.com/pitstop/search.

## Capabilities and Constraints

- React single-page app, prerendered to static HTML at build time so every route is crawlable with its own title, meta, and structured data; trailing-slash canonical; sitemap generated from the prerender crawl. This SEO/crawlability architecture is a binding constraint future work must preserve. (Known issue to harden: the crawler sometimes under-discovers /notes links, so the sitemap can vary between deploys.)
- Confidential case-study gating: one password unlocks confidential artifacts for the browser session; overlay images stay hidden until unlocked. Employer/client-sensitive detail must never be exposed; only portfolio-safe assets are public.
- Deploy is push-to-main to CI to host, with a cache purge.
- Terminology the site owns: "notes" (the writing stream, tagged essay / agent-skill / system), "field notes" (per-section margin annotations on case studies), "portfolio-safe assets," the installable "design-taste skill."

## Brand Commitments

- Name/identity: Ryan DeBoer; rdeboerdesigns.com. Current title framing is Product Design Engineer, Systems, Front-End.
- Voice is governed by the ryan-design-taste / ryan-taste skill: systems-first, craft-led, implementation-aware, evidence-backed, plainly confident, honest about cost, and explicit about what AI accelerated versus what Ryan decided. Banned phrasing (e.g. "AI-native," corporate filler) is enforced.
- BINDING (user directive): all design work stays within the existing design system and the ryan-design-taste skill. Do not introduce a divergent visual world. Connect new UI to existing tokens and components via the apply-design-system skill. The existing implementation and the live /design-system page are the design authority; impeccable new-work must preserve and extend this world, never replace it.

## Evidence on Hand

- Nine case studies at /work/* (WheelRack, Tire Categories, AEM component system, Tire Rack Winter, Heatherwood, Landing Pages, Design Enablement, LoopStack, PlayDraft), several with real metrics (e.g. +400% category entry and +50% conversion; 200+ design tokens and 50+ Storybook components; partner adoption 6 to 10).
- Named, attributed testimonials from managers, peers, and a principal front-end developer.
- Eight published notes; a live /design-system token page; the ryan-design-taste skill published as a downloadable Markdown artifact.
- Real metrics and quotes only. Future work must never fabricate numbers, testimonials, or endorsements, and must keep every quote attributable.

## Product Principles

1. Evidence beside every claim: a reader can verify seniority (live token page, live demos, attributed quotes), never just take it on assertion.
2. Lead with the work, not the title; protect the "designs systems and helps build them" position.
3. Preserve confidentiality: portfolio-safe assets only; gate the rest.
4. Stay inside the established system and voice: ryan-design-taste plus apply-design-system govern; no divergent visual worlds.
5. Keep it crawlable and honest: SEO architecture preserved; AI accelerates, Ryan owns the decisions.

## Accessibility & Inclusion

Reduced motion is respected across the site's animation as a standing requirement; visible keyboard focus and WCAG-informed contrast are part of the craft floor future work must maintain.
