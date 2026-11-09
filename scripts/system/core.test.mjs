// The rules the MCP server, the catalog build and the pull-request review
// share. Run: node --test scripts/system/core.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSource, designColors, nearestToken, relatives, reviewCatalogs, searchSystem, splitSections } from './core.mjs';

const tokens = { 'color-primary': '#f03d01', 'color-neutral-dark': '#1b1b1b', 'color-white': '#ffffff' };
const catalog = {
  commit: 'abc',
  tokens,
  components: [
    { name: 'TestimonialCard', path: 'src/components/TestimonialCard.tsx', blocks: ['testimonial-card'], hex: [] },
    { name: 'ArchiveCard', path: 'src/components/ArchiveCard.tsx', blocks: ['archive-card'], hex: ['#f04a00'] },
  ],
  styles: [{ path: 'src/styles/components/_testimonial-card.scss', blocks: ['testimonial-card'], mentions: ['testimonial-card'], hex: [] }],
};

test('nearestToken says exact, close or none', () => {
  assert.equal(nearestToken('#f03d01', tokens).verdict, 'exact');
  assert.equal(nearestToken('#f04a00', tokens).verdict, 'close');
  assert.equal(nearestToken('#3fb950', tokens).verdict, 'none');
  assert.equal(nearestToken('#FFF', tokens).name, 'color-white');
});

test('checkSource flags raw colours, inline colours and unstyled blocks, with stable codes', () => {
  const found = checkSource('<div className="promo-tile testimonial-card is-open" style={{ color: "#f04a00" }} />\n.x { color: #1b1b1b; }\n// #ff0000 in a comment', catalog);
  assert.deepEqual(found.map((f) => f.code), ['SYS003', 'SYS002', 'SYS001']);
  assert.match(found[0].suggestion, /\$color-primary/);
  assert.equal(found[1].found, 'promo-tile');
  assert.equal(found[2].line, 2);
});

test('relatives finds the nearest existing component by name and blocks', () => {
  const rel = relatives({ name: 'QuoteCard', path: 'x', blocks: ['testimonial-card'] }, catalog.components);
  assert.equal(rel[0].name, 'TestimonialCard');
});

test('reviewCatalogs reports what a PR adds and stays quiet when nothing changed', () => {
  assert.match(reviewCatalogs(catalog, catalog), /Nothing for the system to absorb/);
  const head = { ...catalog, components: [...catalog.components, { name: 'QuoteCard', path: 'src/components/QuoteCard.tsx', blocks: ['quote-card'], hex: ['#ff0000'] }] };
  const report = reviewCatalogs(catalog, head);
  assert.match(report, /^<!-- system-review -->/);
  assert.match(report, /\*\*QuoteCard\*\*/);
  assert.match(report, /`quote-card` in QuoteCard isn't defined/);
  assert.match(report, /`#ff0000`/);
  const known = reviewCatalogs(catalog, head, { components: { QuoteCard: { size: 'production', documented: '/design-system' } } });
  assert.match(known, /In the registry at production size, documented on \/design-system/);
  assert.doesNotMatch(known, /If it is genuinely new/);
});

test('rules split into named sections and colours join their tokens', () => {
  const md = '---\ncolors:\n  signal-orange: "#f03d01"\n  steel: "#8f9daf"\n---\n## Colors\nOne voice.\n### Named Rules\nNo gradients.\n';
  const sections = splitSections(md, 'DESIGN.md');
  assert.deepEqual(sections.map((s) => s.heading), ['Colors', 'Named Rules']);
  assert.deepEqual(designColors(md, tokens), [
    { name: 'signal-orange', value: '#f03d01', token: 'color-primary' },
    { name: 'steel', value: '#8f9daf', token: null },
  ]);
  const hits = searchSystem('orange', { catalog, sections, colors: designColors(md, tokens) });
  assert.equal(hits[0].kind, 'token');
});

test('voice rules come from the ryan-taste skill and catch the never list', async () => {
  const { readFileSync } = await import('node:fs');
  const { checkCopy, parseVoice } = await import('./core.mjs');
  const voice = parseVoice(readFileSync(new URL('../../.claude/skills/ryan-taste/SKILL.md', import.meta.url), 'utf8'));
  assert.equal(voice.invariants.length, 10);
  assert.equal(voice.registers.length, 7);
  assert.deepEqual(voice.labelHeadings, ['Approach', 'Results', 'Takeaways']);
  const codes = checkCopy("<h2>Takeaways</h2>\nI'm humbled to share it.\nIt’s not just a library — it’s a habit.\nTen times better, not 10x more.", voice).map((f) => `${f.code}:${f.found}`);
  assert.deepEqual(codes, ['COPY002:takeaways', 'COPY001:humbled to share', 'COPY001:It’s not just a library — it’s ', 'COPY001:10x']);
  assert.equal(checkCopy('Show the decision, name the artifact.', voice).length, 0);
});

test('accessibility basics read whole elements, not lines, and skip comments', async () => {
  const { checkA11y, blocksMerge } = await import('./core.mjs');
  const found = checkA11y('// <img src="x">\n<a href="https://x.com"\n  target="_blank">x</a>\n<img src="y" />\n<div onClick={() => go(a > b)}>\n<span tabIndex={3} />');
  assert.deepEqual(found.map((f) => `${f.code}@${f.line}`), ['A11Y002@2', 'A11Y001@4', 'A11Y004@5', 'A11Y003@6']);
  assert.deepEqual(found.map(blocksMerge), [false, true, false, true]);
});
