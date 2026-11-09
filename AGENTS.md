# Working on this site

The design system is the source for everything visual here. Read it before you build, and check against it before you finish.

- **The rules:** DESIGN.md (visual: tokens, type, components, named rules) and PRODUCT.md (who it's for, brand commitments, the process stated once). Neither is decoration; when code and these disagree, ask which one is wrong.
- **The MCP server:** `rdeboer-system` (registered in .mcp.json, `node scripts/system/mcp.mjs`). It reads this working tree live.
  - Before adding UI: `search_system`, then `get_component` on anything close. Reuse or extend first.
  - For colours: `find_tokens`. A raw hex outside `src/styles/_variables.scss` and `_tokens.scss` is drift.
  - Before finishing a change to styles or `className`: `check_source` on it, or `review_change` for the whole branch. Same rules as the pull-request review (scripts/system/core.mjs). They advise; Ryan decides.
- **Three sizes:** sketch, playground, production. `get_checklist` says how much to check at each. Don't govern a sketch like production, and don't ship a playground idea without the production checklist.
- **What blocks:** only the deploy gates in .github/workflows/deploy.yml (prerender, hydration on every route, Dive Club isolation, live bundles). The system review on a pull request is a comment, not a gate.
- **Generated, never edited by hand:** public/system/, public/llms.txt, src/data/system-snapshot.json, src/data/build.ts. `node scripts/system-catalog.mjs` rewrites them; start, build and test run it.
