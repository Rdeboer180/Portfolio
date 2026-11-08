#!/usr/bin/env node
// The pull-request half of the system: diff the catalog a PR produces against
// main's and write what changed as suggestions, never as a gate. New
// components get the existing ones they most resemble, so reuse is the first
// question; removed ones get a reminder to leave the docs; new raw hex values
// get the nearest colour token. The workflow posts the result as one comment
// that updates on every push.
//
//   node scripts/system-review.mjs base.json head.json [report.md]
import { readFileSync, writeFileSync } from 'node:fs';

const [baseFile, headFile, outFile] = process.argv.slice(2);
if (!baseFile || !headFile) {
  console.error('usage: system-review.mjs base.json head.json [report.md]');
  process.exit(2);
}
const base = JSON.parse(readFileSync(baseFile, 'utf8'));
const head = JSON.parse(readFileSync(headFile, 'utf8'));

const byPath = (list) => new Map(list.map((item) => [item.path, item]));
const baseComponents = byPath(base.components);
const headComponents = byPath(head.components);
const baseStyles = byPath(base.styles);

// "PlayDraftClockPrototype" → playdraft, clock, prototype.
const words = (name) => name.split(/(?<=[a-z0-9])(?=[A-Z])/).map((w) => w.toLowerCase()).filter((w) => w.length > 2);
const COMMON_BLOCKS = new Set(['reveal-fade', 'reveal-mask', 'sr-only', 'btn', 'animated-bold']);

const relatives = (component) => {
  const mine = new Set(words(component.name));
  const myBlocks = new Set(component.blocks.filter((b) => !COMMON_BLOCKS.has(b)));
  return base.components
    .map((other) => {
      const sharedWords = words(other.name).filter((w) => mine.has(w));
      const sharedBlocks = other.blocks.filter((b) => myBlocks.has(b));
      return { other, score: sharedWords.length * 2 + sharedBlocks.length, sharedWords, sharedBlocks };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const rgb = (hex) => {
  const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const nearestToken = (hex) => {
  const [r, g, b] = rgb(hex);
  let best = null;
  for (const [name, value] of Object.entries(head.tokens)) {
    const [r2, g2, b2] = rgb(value);
    const d = Math.hypot(r - r2, g - g2, b - b2);
    if (!best || d < best.d) best = { name, value, d };
  }
  return best;
};
const tokenLine = (hex) => {
  const t = nearestToken(hex);
  if (!t) return `\`${hex}\``;
  const how = t.d === 0 ? 'is exactly' : t.d < 24 ? 'is close to' : 'has no close token; nearest is';
  return `\`${hex}\` ${how} \`$${t.name}\` (\`${t.value}\`)`;
};

const added = head.components.filter((c) => !baseComponents.has(c.path));
const removed = base.components.filter((c) => !headComponents.has(c.path));
const newHex = [];
for (const item of [...head.components, ...head.styles]) {
  const before = (baseComponents.get(item.path) || baseStyles.get(item.path) || { hex: [] }).hex;
  const fresh = item.hex.filter((h) => !before.includes(h));
  if (fresh.length) newHex.push({ path: item.path, fresh });
}
const definedBlocks = new Set(head.styles.flatMap((s) => s.mentions || s.blocks));
const unstyled = added.flatMap((c) => c.blocks.filter((b) => !definedBlocks.has(b)).map((b) => ({ c, b })));

const lines = ['<!-- system-review -->', '## System review', ''];
const total = added.length + removed.length + newHex.length + unstyled.length;
if (!total) {
  lines.push('No new components, removals or raw colours. Nothing for the system to absorb from this PR.');
} else {
  lines.push(`${added.length} new, ${removed.length} removed, ${newHex.length} file${newHex.length === 1 ? '' : 's'} with new raw colours. Suggestions only; nothing here blocks the merge.`, '');
}

if (added.length) {
  lines.push('### New components', '');
  for (const c of added) {
    const rel = relatives(c);
    lines.push(`- **${c.name}** \`${c.path}\``);
    if (rel.length) {
      const list = rel.map((r) => `${r.other.name}${r.sharedBlocks.length ? ` (shares ${r.sharedBlocks.map((b) => `\`${b}\``).join(', ')})` : ''}`).join(', ');
      lines.push(`  - Looks related to ${list}. Reuse or extend one of those if it covers the job.`);
    }
    lines.push('  - If it is genuinely new, add it to /design-system so the next person finds it.');
  }
  lines.push('');
}

if (removed.length) {
  lines.push('### Removed components', '');
  removed.forEach((c) => lines.push(`- **${c.name}** \`${c.path}\`: take it off /design-system and out of any docs that still name it.`));
  lines.push('');
}

if (newHex.length) {
  lines.push('### New raw colours', '');
  for (const { path, fresh } of newHex) {
    lines.push(`- \`${path}\``);
    fresh.forEach((hex) => lines.push(`  - ${tokenLine(hex)}`));
  }
  lines.push('');
}

if (unstyled.length) {
  lines.push('### Blocks with no stylesheet', '');
  unstyled.forEach(({ c, b }) => lines.push(`- \`${b}\` in ${c.name} isn't defined in src/styles. Use an existing block or add its stylesheet.`));
  lines.push('');
}

lines.push(`<sub>Catalog ${base.commit || 'base'} → ${head.commit || 'head'}. Everything that exists: /system/catalog.json and /design-system.</sub>`);
const report = `${lines.join('\n')}\n`;
if (outFile) writeFileSync(outFile, report);
process.stdout.write(report);
