# Tabled — decisions that need Ryan

Last updated 2026-08-16. Everything here is **parked, not blocked**: the work
around each item shipped, and each one is written so it can be picked up cold
months from now. Nothing in this file is waiting on more analysis — each is a
judgment call that is genuinely yours.

Answer any single item and the work behind it can proceed on its own.

---

## LoopStack

### L1 · TestFlight uploads need a credential path
**The only item here that is operational rather than a taste call.**

Build 20 is archived, signed, validated for the store, and staged in Xcode
Organizer. It is not uploaded, because this machine has no App Store Connect
credentials stored anywhere — no API key (`~/.appstoreconnect/private_keys/`
is empty), no app-specific password in the keychain, no Transporter config.
Earlier builds went up through Organizer's UI, which uses Xcode's own signed-in
account.

I can't authenticate as you, so every future build stops at the same place
unless you pick one:

- **(a) Keep using Organizer.** Two clicks per build, nothing to set up, and
  nothing changes. Fine if builds stay occasional.
- **(b) Create an App Store Connect API key** (App Store Connect → Users and
  Access → Integrations → Keys), drop the `.p8` in
  `~/.appstoreconnect/private_keys/`, and every future build can go end-to-end
  from the terminal with no password anywhere. **Recommended** — it is the
  option that removes you from the loop rather than adding a step.
- **(c) Store an app-specific password** once via `xcrun notarytool
  store-credentials`, same effect, slightly less clean than a key.

Under (b) or (c), a build becomes one command instead of a handoff.

### L2 · How much of Loop's settings surface should the inbox actually cover?
`changeSurface.ts` now sorts every suggestion into `settings` (type it into
Loop), `code` (for Loop's own repo), or `behaviour` (nothing to change, just
know). The engine can produce far more `code`-surface items than are worth
reading — every carb-absorption curve mismatch could become one.

Open question: should `code` items be **rare and high-confidence only**, or
should the inbox show everything and let you triage? This decides whether the
Claude handoff is a considered request or a firehose. My read is rare and
high-confidence, but the whole point of the hub is that you use it, so it's
your call how much noise is tolerable.

### L3 · What counts as "enough" evidence to surface a trend?
Confidence is currently computed with the **week as the unit of evidence**, not
the reading. That is the right unit, and it means a genuine pattern needs
several weeks before it surfaces. On a fast-changing month that may be too slow
to be useful; on a stable month it is exactly right.

Do you want a lower-confidence "early signal" tier that is clearly labelled as
provisional, or does anything below the current bar stay invisible? Adding a
tier is easy; deciding whether provisional information helps or misleads you is
not something I should decide.

---

## Portfolio

Full detail in `portfolio-site/AUDIT-TODO.md`. Summarised here so both projects'
open calls live in one place.

### P1 · 229.7 MB of images ship unreferenced — archive or delete?
**Biggest single win available, by an order of magnitude.** 205 of 316 image
files in `public/` are referenced by nothing; only 98.9 MB is live. Mostly exact
duplicates between `images/work/<slug>/` and `assets/portfolio-safe/<slug>/`,
and often *neither* copy is used. CRA copies `public/` wholesale, so all of it
deploys.

The real question before deleting anything: **is `assets/portfolio-safe/` a
deliberate archive?** If it is, it should move out of `public/` rather than be
deleted — it is only a problem because `public/` means "ship this". `public/` is
fully git-tracked either way, so nothing is unrecoverable.

### P2 · The metrics gate — deliberate, or an accident of `stream`?
`CaseStudyPage` locks on `stream === 'professional'` and swaps out the entire
outcome block **and metrics grid**. A cold visitor from LinkedIn sees title,
thesis, summary, Problem, then a password wall — while the homepage card for the
same project shows its metrics in the open. If a metric is safe on the card it
is safe in the outcome block. Proposed: ungate `metrics` and `outcomeNote`, keep
gating imagery and process detail. This changes your protection posture, so it
is yours.

### P3 · `ownership` — revive as a structured field, or delete?
Declared at `projects.ts:119`, populated 0/11. The dead layout that referenced
it is now gone, so the field is inert. Revive it as a "what I owned / what was
given" block — two audits called this the biggest process-clarity gap, and it
costs authoring across 11 case studies — or delete it and keep attribution in
prose. Doing neither is the current state and the worst of the three.

### P4 · The hero `<h1>` — how far to go?
The `<h1>` is visually hidden and reads as four subject-less aphorisms; the
actual positioning is a 12px eyebrow.

- **(a)** A real claim in the `<h1>`, animation untouched.
- **(b)** (a) plus cut the intro to ≤3s, final phrase as the initial render.
- **(c)** (b) plus move Work above the 330-word About.

The craft audit's view is that (c) is the highest-leverage change on the site.
It is also the most entangled with taste, which is why it is here.

### P5 · Tailwind — remove it?
`src/index.css` holds the `@tailwind` directives and is never imported;
`tailwind.config.js` sits beside it. The dead utility classes are already gone.
It is a third token system with zero live effect. **Recommend removing both
files** — this is the closest thing here to a formality.

---

## Not decisions — known and parked

Recorded so they aren't rediscovered as new findings.

- **React #418 on all 27 prerendered portfolio routes.** Transient first-render
  mismatch; the prerendered `#root` is byte-identical to the settled client
  tree. Ruled out lazy chunks and unlock chrome. Costs a wasted hydration per
  page; nothing visibly broken, CLS stays good. Pinning it needs a
  development-React build served against prerendered HTML.
- **Deploy config must not blanket-rewrite to `/index.html`.** `serve -s` does,
  and it made every route return the homepage. If the host is configured that
  way, all 27 prerendered pages are void and crawlers get the homepage for every
  URL. Fallback must apply only to paths with no prerendered file.
- **LoopStack has no git remote.** Committed locally only. Add one when you want
  it backed up off this machine.
