#!/usr/bin/env node
// The system's inventory, written as JSON: every component under
// src/components, the style blocks it draws with, the stylesheets that define
// those blocks, the colour tokens, and every raw hex value outside the token
// files. People read it at /system/catalog.json; agents read it before they
// build; scripts/system-review.mjs diffs two of them on every pull request.
//
//   node scripts/system-catalog.mjs [repoRoot] [outFile]
//
// repoRoot defaults to this checkout, outFile to public/system/catalog.json
// (gitignored, rewritten before every start and build).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || join(here, '..'));
const out = resolve(process.argv[3] || join(root, 'public/system/catalog.json'));

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
// The token files are where raw values belong; everywhere else is drift.
const TOKEN_FILES = new Set(['src/styles/_variables.scss', 'src/styles/_tokens.scss']);

const walk = (dir, test) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path, test);
    return test(path) ? [path] : [];
  });

const rel = (path) => relative(root, path).split('\\').join('/');
const hexes = (text) => [...new Set((text.match(HEX) || []).map((h) => h.toLowerCase()))].sort();

// A BEM block is the part of a class before __ or --: sip__node--center → sip.
const blockOf = (cls) => cls.split(/__|--/)[0];
// State classes (is-lit, has-open) and halves of template strings (`is-${x}`)
// are not blocks.
const isClass = (word) =>
  /^[a-z][a-z0-9-]*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$/.test(word) && !/-$/.test(word) && !/^(?:is|has)-/.test(word);

const classesIn = (tsx) => {
  const found = new Set();
  const attr = /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{'([^']*)'\}|\{"([^"]*)"\})/g;
  for (const m of tsx.matchAll(attr)) {
    const text = (m[1] || m[2] || m[3] || m[4] || m[5] || '').replace(/\$\{[^}]*\}/g, ' ');
    text.split(/\s+/).filter(isClass).forEach((cls) => found.add(cls));
  }
  return found;
};

const exportsIn = (tsx) => {
  const names = new Set();
  for (const m of tsx.matchAll(/export\s+(?:const|function|class|interface|type|enum)\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  const fallback = tsx.match(/export\s+default\s+([A-Za-z0-9_]+)/);
  if (fallback) names.add(fallback[1]);
  return [...names].sort();
};

const components = walk(join(root, 'src/components'), (p) => /\.tsx$/.test(p) && !/\.test\.tsx$/.test(p)).map((path) => {
  const text = readFileSync(path, 'utf8');
  const blocks = [...new Set([...classesIn(text)].map(blockOf))].sort();
  return {
    name: basename(path, '.tsx'),
    path: rel(path),
    exports: exportsIn(text),
    blocks,
    hex: hexes(text),
  };
});

const styles = walk(join(root, 'src/styles'), (p) => p.endsWith('.scss')).map((path) => {
  const text = readFileSync(path, 'utf8');
  // Top-level selectors only: `.sip {`, `.sip--note {`. Nested &__ rules
  // belong to the block that opened them.
  const blocks = [...new Set([...text.matchAll(/^\.([a-z][a-z0-9-]*)(?=[\s{,:.])/gm)].map((m) => blockOf(m[1])))].sort();
  // Every block a selector mentions anywhere, `:not(.note-embed *)` included:
  // what the review checks a component's classes against.
  const selectors = text.split('\n').filter((line) => !/^\s*(?:\/\/|@import|@use)/.test(line)).join('\n');
  const mentions = [...new Set([...selectors.matchAll(/\.([a-z][a-z0-9_-]*)/g)].map((m) => blockOf(m[1])))].sort();
  const file = rel(path);
  return { path: file, blocks, mentions, hex: TOKEN_FILES.has(file) ? [] : hexes(text) };
});

const tokens = Object.fromEntries(
  [...readFileSync(join(root, 'src/styles/_variables.scss'), 'utf8').matchAll(/^\$(color-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\b/gm)]
    .map((m) => [m[1], m[2].toLowerCase()]),
);

let commit = null;
try {
  commit = execFileSync('git', ['-C', root, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
} catch {
  // Not a checkout; the catalog still stands without a commit.
}

const catalog = { commit, components, styles, tokens };
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`system catalog: ${components.length} components, ${styles.length} stylesheets, ${Object.keys(tokens).length} colour tokens → ${rel(out)}`);
