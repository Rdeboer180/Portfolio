# Working on this site

The design system is the source for everything visual here. Read it before you build, and check against it before you finish.

- **The rules:** DESIGN.md (visual: tokens, type, components, named rules) and PRODUCT.md (who it's for, brand commitments, the process stated once). Neither is decoration; when code and these disagree, ask which one is wrong.
- **The MCP server:** `rdeboer-system` (registered in .mcp.json, `node scripts/system/mcp.mjs`). It reads this working tree live.
  - Before adding UI: `search_system`, then `get_component` on anything close. Reuse or extend first.
  - For colours: `find_tokens`. A raw hex outside `src/styles/_variables.scss` and `_tokens.scss` is drift.
  - Before finishing a change to styles, `className` or JSX: `check_source` on it. For copy: `check_copy`, and `get_voice` for how it should read (the rules come from .claude/skills/ryan-taste/SKILL.md).
  - Before opening a pull request: `review_change` runs the steel curtain on the branch, exactly as the PR will.
- **Three sizes:** sketch, playground, production. `get_checklist` says how much to check at each. Don't govern a sketch like production, and don't ship a playground idea without the production checklist.
- **What blocks:** the steel curtain on every pull request (.github/workflows/steel-curtain.yml). Deterministic findings stop the merge: a raw colour that has a token, a class with no stylesheet, an image without alt, a positive tabIndex, and a build that fails to prerender or hydrate. Copy, other accessibility and drift findings are reported for a person to answer. The deploy repeats the build gates.
- **The registry:** src/data/system-registry.json is what the system has taken on. The curtain commits a `proposed` entry to the PR for each new component or style block; promote it (size, where it's documented) or remove it in review.
- **Generated, never edited by hand:** public/system/, public/llms.txt, src/data/system-snapshot.json, src/data/build.ts. `node scripts/system-catalog.mjs` rewrites them; start, build and test run it.
