#!/usr/bin/env node
// The system's inventory and every surface agents read, written from one pass
// over the checkout before each start and build:
//
//   public/system/catalog.json   components, blocks, stylesheets, tokens, raw colours
//   public/system/rules.json     DESIGN.md + PRODUCT.md as named sections, colour roles
//   public/system/agents.json    the three sizes, the MCP tools, the gates
//   public/system/design.md      markdown twins of the two source files
//   public/system/product.md
//   public/system/drift.json     every raw colour, where it is, and the token it should be
//   public/system/mcp.mjs        the MCP server as one file anyone can run
//   public/llms.txt              the index an agent reads first
//   src/data/system-snapshot.json  counts the /design-system page renders
//
// All of it is gitignored and rebuilt, so none of it can fall behind the code.
// scripts/system-review.mjs diffs two catalogs on every pull request.
//
//   node scripts/system-catalog.mjs [repoRoot] [outFile]
//
// With an outFile (the PR workflow), only the catalog is written there.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalog } from './system/catalog.mjs';
import { designColors, nearestToken, splitSections } from './system/core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || join(here, '..'));
const outArg = process.argv[3];

const catalog = buildCatalog(root);
const json = (data) => `${JSON.stringify(data, null, 2)}\n`;
const write = (file, text) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};

if (outArg) {
  write(resolve(outArg), json(catalog));
  console.log(`system catalog: ${catalog.components.length} components → ${outArg}`);
  process.exit(0);
}

const pub = join(root, 'public/system');
const design = readFileSync(join(root, 'DESIGN.md'), 'utf8');
const product = readFileSync(join(root, 'PRODUCT.md'), 'utf8');
const agents = JSON.parse(readFileSync(join(root, 'src/data/system-agents.json'), 'utf8'));
const colors = designColors(design, catalog.tokens);
const sections = [...splitSections(design, 'DESIGN.md'), ...splitSections(product, 'PRODUCT.md')];

write(join(pub, 'catalog.json'), json(catalog));
write(join(pub, 'rules.json'), json({ commit: catalog.commit, colors, sections }));
write(join(pub, 'agents.json'), json(agents));
copyFileSync(join(root, 'DESIGN.md'), join(pub, 'design.md'));
copyFileSync(join(root, 'PRODUCT.md'), join(pub, 'product.md'));

// One runnable file: core.mjs inlined above the server, its import removed.
const core = readFileSync(join(here, 'system/core.mjs'), 'utf8');
const server = readFileSync(join(here, 'system/mcp.mjs'), 'utf8');
const [shebang, ...rest] = server.split('\n');
const bundled = [
  shebang,
  `// Built from scripts/system/core.mjs + scripts/system/mcp.mjs at ${catalog.commit || 'a local build'}.`,
  core,
  rest.join('\n').replace(/^import \{[^}]+\} from '\.\/core\.mjs';\n/m, ''),
].join('\n');
write(join(pub, 'mcp.mjs'), bundled);

// Drift the page can show: components carrying raw colours, worst first.
const drift = catalog.components.filter((c) => c.hex.length).sort((a, b) => b.hex.length - a.hex.length);
write(join(pub, 'drift.json'), json([...catalog.components, ...catalog.styles].filter((x) => x.hex.length).map((x) => ({
  name: x.name || x.path.split('/').pop(),
  path: x.path,
  colours: x.hex.map((hex) => {
    const t = nearestToken(hex, catalog.tokens);
    return { hex, token: t.name, value: t.value, verdict: t.verdict };
  }),
})).sort((a, b) => b.colours.length - a.colours.length)));
const rawTotal = new Set([...catalog.components, ...catalog.styles].flatMap((x) => x.hex)).size;
const snapshot = {
  commit: catalog.commit,
  components: catalog.components.length,
  stylesheets: catalog.styles.length,
  tokens: Object.keys(catalog.tokens).length,
  rawColours: rawTotal,
  componentsWithRawColours: drift.length,
  drift: drift.slice(0, 5).map((c) => ({ name: c.name, count: c.hex.length })),
  colors,
  sections: sections.length,
};
write(join(root, 'src/data/system-snapshot.json'), json(snapshot));

const site = 'https://www.rdeboerdesigns.com';
const llms = `# Ryan DeBoer — design engineer

> Portfolio of Ryan DeBoer: case studies, notes and the design system the site is built on. The system is written in DESIGN.md and PRODUCT.md, inventoried from the code on every build, and served to agents over MCP.

Snapshot: commit ${catalog.commit}, ${catalog.components.length} components, ${Object.keys(catalog.tokens).length} colour tokens, ${rawTotal} raw colours still outside the tokens.

## The design system
- [Design system](${site}/design-system/): how the system works, the foundations and the components, for people
- [DESIGN.md](${site}/system/design.md): visual rules, tokens and named rules (markdown)
- [PRODUCT.md](${site}/system/product.md): who it's for, brand commitments, the process stated once (markdown)
- [Catalog](${site}/system/catalog.json): every component, class block, stylesheet, token and raw colour (JSON)
- [Rules](${site}/system/rules.json): DESIGN.md and PRODUCT.md as named sections, plus colour roles (JSON)
- [Sizes, tools and gates](${site}/system/agents.json): what gets checked at sketch, playground and production (JSON)

## MCP
- [rdeboer-system](${site}/system/mcp.mjs): a zero-dependency stdio MCP server over the files above. Tools: ${agents.tools.map((t) => t.name).join(', ')}.
  Install: \`curl -so ~/rdeboer-system.mjs ${site}/system/mcp.mjs && claude mcp add rdeboer-system -- node ~/rdeboer-system.mjs\`

## Questions agents ask
- Is there an npm package? No. The MCP server is one file served from the site.
- Is there a hosted MCP endpoint? Not yet. Run the file locally; it reads the published JSON.
- Is Figma the source? No. DESIGN.md and PRODUCT.md are the source; Figma and the code follow them.
- Can I use the tokens in my own project? They're published to read. The brand (Signal Orange, the bench aesthetic) is Ryan's.

## Notes
- [A design system in more than one size](${site}/notes/a-design-system-in-more-than-one-size/): three sizes, drift, and the review on every pull request
- [Governance in markdown](${site}/notes/governance-in-markdown/): why the brand lives in PRODUCT.md and DESIGN.md
`;
write(join(root, 'public/llms.txt'), llms);

console.log(
  `system: ${catalog.components.length} components, ${catalog.styles.length} stylesheets, ${Object.keys(catalog.tokens).length} tokens, ${rawTotal} raw colours, ${sections.length} rule sections → ${relative(root, pub)}/, public/llms.txt`,
);
