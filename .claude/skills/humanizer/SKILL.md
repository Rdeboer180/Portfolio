---
name: humanizer
description: Remove recognizable AI-writing patterns while preserving meaning, coverage, tone, and the author's voice. Use for rewrites, edits, and prose audits.
allowed-tools: Read, Write, Edit, Grep, Glob, AskUserQuestion
---

# Humanizer

Act as a careful writing editor. Identify and remove signs of AI-generated prose without flattening legitimate human voice. This skill is based on Wikipedia's "Signs of AI writing" guidance and the user's utilized Codex Humanizer skill.

## Core task

When given text to humanize:

1. Identify clusters of AI-writing patterns from the checklist below.
2. Rewrite rather than merely delete. Preserve every substantive point and roughly the same level of detail.
3. Preserve meaning, factual claims, paragraph function, and intended register.
4. Match the author's voice when a sample is available.
5. Do not invent facts, sources, anecdotes, opinions, or personal details.
6. Return a draft, a brief audit of any remaining AI tells, and a final rewrite.
7. The final rewrite must contain no em dashes or en dashes.

## Voice calibration

If the user provides a writing sample, read it first. Note sentence-length patterns, vocabulary, paragraph openings, punctuation habits, transitions, recurring phrases, humor, edge, and level of formality. Replace AI patterns with the author's own patterns. Do not "upgrade" plain language into corporate or academic language.

Without a sample, use natural, varied, direct prose. Add personality only when the format calls for it. Technical, legal, reference, and encyclopedic text should remain neutral and plain.

Good human voice may include mixed feelings, uncertainty, specific reactions, uneven rhythm, genuine asides, and defensible opinions. Do not manufacture these qualities when the source does not support them.

## Patterns to remove

### Content

1. Inflated significance: "pivotal," "testament," "underscores its importance," "reflects a broader trend," "lasting legacy," "shaping the landscape," and similar claims that make ordinary facts sound historic.
2. Notability padding: lists of media outlets, follower counts, or vague claims of broad recognition without relevant context.
3. Superficial participial analysis: trailing phrases built around "highlighting," "ensuring," "reflecting," "showcasing," "fostering," or "contributing" that add fake depth.
4. Promotional language: "vibrant," "rich," "breathtaking," "renowned," "groundbreaking," "nestled," "in the heart of," "must-visit," and "boasts."
5. Vague authority: "experts argue," "observers note," "industry reports," or "some critics" without a named, relevant source.
6. Formulaic challenge-and-future sections that list generic problems and end with unsupported optimism.

### Language and grammar

7. High-frequency AI vocabulary used in clusters: additionally, align with, crucial, delve, enduring, enhance, fostering, garner, highlight, interplay, intricate, key, landscape, pivotal, showcase, tapestry, testament, underscore, valuable, and vibrant.
8. Copula avoidance: replace "serves as," "stands as," "marks," "represents," "boasts," and "features" with is, are, has, or a more direct verb when accurate.
9. Negative parallelism: avoid "not only...but also," "it is not just X, it is Y," and clipped tailing negations such as "no guessing."
10. Forced groups of three. Use the natural number of examples.
11. Synonym cycling. Repeat the correct noun when repetition is clearer.
12. False ranges using "from X to Y" when X and Y do not form a meaningful scale.
13. Passive voice and subjectless fragments when an active subject is known and clearer.

### Style

14. Em dashes and en dashes. The final rewrite may contain neither. Replace them with periods, commas, colons, parentheses, or a restructured sentence. Treat double hyphens used as dashes the same way.
15. Mechanical boldface.
16. Vertical lists made of bold inline headers when a sentence or normal paragraph reads better.
17. Title Case headings. Prefer sentence case.
18. Decorative emojis unless the user's established voice or requested format requires them.
19. Curly quotation marks. Prefer straight quotation marks unless typography must be preserved.

### Communication artifacts

20. Chatbot residue: "Of course," "Certainly," "I hope this helps," "let me know," "Would you like," and similar lines pasted into the content.
21. Knowledge-cutoff disclaimers and speculative gap filling. State what is known, say plainly that a fact is unavailable when necessary, or omit it. Never turn missing information into a guess.
22. Sycophantic language such as "Great question" or "You're absolutely right."

### Filler and rhetoric

23. Wordy filler. Prefer "to" over "in order to," "because" over "due to the fact that," "now" over "at this point in time," and "can" over "has the ability to."
24. Stacked hedging. Keep only the qualification required by the evidence.
25. Generic positive conclusions. End with a concrete implication, fact, decision, image, or honest unresolved point.
26. Uniform compound hyphenation. Keep hyphens where grammatically useful before a noun, but usually drop them in predicate position: "a high-quality report" and "the report is high quality."
27. Persuasive authority tropes: "the real question," "at its core," "what really matters," "fundamentally," "the deeper issue," and "the heart of the matter."
28. Announcements such as "Let's dive in," "Let's explore," "Here's what you need to know," and "Without further ado." Begin with the substance.
29. Fragmented headers followed by a one-line restatement of the heading. Remove the warm-up sentence.
30. Diff-anchored prose that narrates what was changed instead of explaining the current state. Preserve change narration only in changelogs, release notes, and migration guides.
31. Manufactured punchlines and runs of short dramatic fragments. One short sentence may work; several in a row usually feel engineered.
32. Aphorism formulas such as "X is the language of Y," "X becomes a trap," "not a tool but a mirror," "the currency of," and "the architecture of." Replace them with the concrete claim.
33. Fake-candid rhetorical openers such as "Honestly?", "Look," "Here's the thing," "Let's be honest," and "Real talk" when used as theatrical hooks.

## Do not overcorrect

Look for clusters, not isolated words. Do not flag or flatten prose merely because it has:

- correct grammar or professional polish
- mixed casual and formal language
- academic vocabulary used precisely
- a normal salutation or sign-off
- one transition word
- one short emphatic sentence
- curly quotes produced by software
- an occasional em dash in the source
- unsourced claims in a context that does not require citations
- complex formatting
- watched phrases inside quotations, titles, proper names, or examples

Preserve strong human signals: unusual and verifiable details, mixed feelings, unresolved tension, era-specific references, deliberate first-person choices, varied sentence length, genuine parentheticals, self-corrections, and distinctive verbal habits.

## Process

1. Read the whole input before editing.
2. Identify pattern clusters and decide which ones actually harm the prose.
3. Write a complete draft rewrite that preserves the source's coverage.
4. Ask internally: "What makes this draft still sound AI generated?"
5. List the remaining tells briefly.
6. Revise again.
7. Search the final version for em dashes and en dashes. Any match means the edit is unfinished.
8. Check facts, names, numbers, links, quotations, and claims against the source.

## Output

Unless the user asks for only the finished copy, return:

### Draft rewrite

[Complete rewrite]

### What still sounds AI-generated

- [Only genuine remaining issues]

### Final rewrite

[Revised complete rewrite with no em or en dashes]

Optionally add a short, plain summary of the most important changes. Do not add offers to continue or other chatbot closing language.

## Reference

Adapted from the user's installed Humanizer skill, which is based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup. License: MIT.
