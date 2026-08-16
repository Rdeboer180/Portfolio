# Tabled — decisions that need Ryan

Last updated 2026-08-16. **All eight tabled items are answered and implemented.**
Kept as the record of what was decided and why, so none of it has to be
re-litigated later.

Open items, if any, are listed at the bottom under **Still open**.

---

## Answered 2026-08-16

### LoopStack

**L1 · TestFlight uploads — (a) keep using Organizer.**
No credential is stored on this machine and none will be. Each build is
archived, signed, validated, and staged into Xcode Organizer; you press
Distribute. Current staged build: **21**.

The consequence worth remembering: the terminal can take a build all the way to
a validated `.ipa` and no further. If that handoff ever becomes annoying,
L1(b) — an App Store Connect API key in `~/.appstoreconnect/private_keys/` —
is still the escape hatch, and nothing about (a) forecloses it.

**L2 · Inbox scope — both.**
Show everything; lead with the few that earned it. Implemented as a split in the
Fix Log rather than a filter, because a filter hides things and the point was
not to hide anything:

- **Staged** — items that clear the promotion bar. Settings and habit changes
  promote at the normal evidence bar (60). Code-surface changes need **75**,
  because each one is a request to edit Loop's source and rebuild, and the
  absorption engine can raise one for every curve mismatch it notices.
- **Worth a look** — everything else, rendered in full, one heading down, with
  the same Implement and Remove actions. Nothing is filtered away.

Verified in the browser: a code item at 81 and a settings item at 61 lead; a
code item at 64 sits under "Worth a look" with its card and actions intact.

**L3 · Provisional confidence tier — yes, with a hard rule.**
My call, per your "you decide". Three tiers now live in
`src/lib/loop/signalTier.ts`:

| Tier | Score | Visible | Can become a therapy change |
| --- | --- | --- | --- |
| Established | ≥ 60 | yes | **yes** |
| Early signal | 35–59 | yes, labelled provisional | **no** |
| Noise | < 35 | no | no |

The reasoning, since this is the one you delegated: the old single threshold was
deciding two unrelated questions at once — whether a finding is worth *showing*
and whether it is worth *acting on*. Those come apart. A pattern in three of the
last five weeks is exactly what you want to watch and nowhere near enough to
move a basal rate over. Collapsing them meant the only way to notice a pattern
forming was to already know it was there, which is backwards for absorption work
where watching the curve take shape across weeks *is* the work.

So the tiers separate visibility from permission, and the second tier's rule is
absolute: **an early signal informs, it never authorises.** `canStage()` is the
single predicate every stage/commit path consults — one bar, one file, so a new
surface added later cannot accidentally route around it. A test asserts the
invariant across the whole 35–59 range, and another asserts that nothing which
could be committed before became uncommittable.

The established bar is unchanged at 60. Nothing lost permission; some things
gained visibility.

### Portfolio

**P1 · Unreferenced assets — delete.** `public/` 330 MB → 108 MB, 177 files.

Worth recording how close this came to going wrong, because the same trap is
still there for anything similar. Two of three scans were unsafe:

1. Reading only `src/` missed `public/share/*/index.html` and the built
   `loopstack-demo` bundle — 33 live files would have been deleted.
2. A literal-string scan still missed paths the code *builds*: `/images/social/
   cs-${slug}.jpg` (every case study's OG image), `/images/qr/${qr}.svg`, and a
   poster derived by swapping `.mp4` for `-poster.jpg`. Deleting the social
   images would have broken every share card on the site while every page still
   looked perfectly fine.

The third pass resolves all three patterns against `projects.ts`. One poster
still slipped through and was caught by a 404 sweep. Final state verified across
17 routes: zero 404s, zero broken images.

**P2 · The metrics gate — an accident, so ungated.** Employer studies locked
sections 02–05 wholesale, which swept the metrics grid and outcome note along
with them. A visitor from LinkedIn saw a card advertising "+50% conversion lift",
clicked it, and hit a wall where the number should have been. `OutcomeMetrics`
now renders on both sides of the gate. Still gated: client imagery, process
detail, live URLs, and the client's name.

**P3 · `ownership` — deleted.** Declared, populated 0/11, and its only consumer
died with the legacy layout. Orphaned styles removed with it.

**P4 · Hero `<h1>` — (a), a real claim, animation untouched.** It now reads
"Ryan DeBoer — Product Design Engineer bridging ambitious UX and buildable
systems" instead of the four animated aphorisms verbatim. The phrases remain
available to assistive tech; the visual sequence is unchanged.

**P5 · Tailwind — removed.** `index.css` was never imported and everything in it
already lived in `styles.scss`. Config, postcss config, and all three packages
went with it.

---

## Still open

**Two case studies have no social image.** `cs-bolus-binder.jpg` and
`cs-photography-workflow-agent.jpg` do not exist, so those two fall back to no
OG image when shared. Found while resolving P1's dynamic paths. Needs artwork,
not a decision.

---

## Known and parked — not decisions

Recorded so they aren't rediscovered as new findings.

- **React #418 on all 27 prerendered portfolio routes.** A transient
  first-render mismatch; the prerendered `#root` is byte-identical to the
  settled client tree. Lazy chunks and unlock chrome were both ruled out by
  experiment. Costs a wasted hydration per page; nothing visibly broken, CLS
  stays good (0.031). Pinning it needs a development-React build served against
  prerendered HTML.
- **Deploy config must not blanket-rewrite to `/index.html`.** `serve -s` does,
  and it made every route return the homepage during testing. If the host is
  configured that way, all 27 prerendered pages are void and crawlers get the
  homepage for every URL. The fallback must apply only to paths with no
  prerendered file.
- **LoopStack has no git remote.** Committed locally only. Add one when you want
  it backed up off this machine.
