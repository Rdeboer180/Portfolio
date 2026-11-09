// The system's judgment, as pure functions: no file system, no network. The
// PR review (scripts/system-review.mjs), the catalog build and the MCP server
// all import this one file, so an agent asking the MCP and the comment on a
// pull request can never disagree about what counts as drift.
//
// The catalog build also copies this file, with the server, into
// /system/mcp.mjs, so it must stay free of imports.

// Codes are append-only: an agent or a script may match on them, so a code is
// never reused for a different rule.
export const CODES = {
  SYS001: 'Raw colour outside the token files',
  SYS002: 'Class block with no stylesheet',
  SYS003: 'Inline style colour',
};

export const COMMON_BLOCKS = new Set(['reveal-fade', 'reveal-mask', 'sr-only', 'btn', 'animated-bold']);

// "PlayDraftClockPrototype" → playdraft, clock, prototype.
export const words = (name) =>
  name.split(/(?<=[a-z0-9])(?=[A-Z])/).map((w) => w.toLowerCase()).filter((w) => w.length > 2);

export const blockOf = (cls) => cls.split(/__|--/)[0];

export const rgb = (hex) => {
  const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/** The token a raw hex value should have been, with how far off it is. */
export const nearestToken = (hex, tokens) => {
  const [r, g, b] = rgb(hex.toLowerCase());
  let best = null;
  for (const [name, value] of Object.entries(tokens)) {
    const [r2, g2, b2] = rgb(value);
    const d = Math.hypot(r - r2, g - g2, b - b2);
    if (!best || d < best.d) best = { name, value, d: Math.round(d) };
  }
  if (!best) return null;
  best.verdict = best.d === 0 ? 'exact' : best.d < 24 ? 'close' : 'none';
  return best;
};

export const tokenLine = (hex, tokens) => {
  const t = nearestToken(hex, tokens);
  if (!t) return `\`${hex}\``;
  const how = t.verdict === 'exact' ? 'is exactly' : t.verdict === 'close' ? 'is close to' : 'has no close token; nearest is';
  return `\`${hex}\` ${how} \`$${t.name}\` (\`${t.value}\`)`;
};

/** The existing components a component most resembles, by name and blocks. */
export const relatives = (component, components, limit = 3) => {
  const mine = new Set(words(component.name));
  const myBlocks = new Set(component.blocks.filter((b) => !COMMON_BLOCKS.has(b)));
  return components
    .filter((other) => other.path !== component.path)
    .map((other) => {
      const sharedWords = words(other.name).filter((w) => mine.has(w));
      const sharedBlocks = other.blocks.filter((b) => myBlocks.has(b));
      return { name: other.name, path: other.path, score: sharedWords.length * 2 + sharedBlocks.length, sharedWords, sharedBlocks };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const definedBlocks = (catalog) => new Set(catalog.styles.flatMap((s) => s.mentions || s.blocks));

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
const CLASS_WORD = /^[a-z][a-z0-9-]*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$/;

/**
 * Deterministic check of a snippet of TSX or SCSS against the catalog: raw
 * colours get their token, class blocks with no stylesheet get flagged. The
 * same rules the pull-request review applies, run before the code is written.
 */
export const checkSource = (code, catalog) => {
  const findings = [];
  const lines = code.split('\n');
  const known = definedBlocks(catalog);
  lines.forEach((line, i) => {
    if (/^\s*(?:\/\/|\*|\/\*)/.test(line)) return;
    for (const m of line.matchAll(HEX)) {
      const hex = m[0].toLowerCase();
      const t = nearestToken(hex, catalog.tokens);
      const inStyle = /style=\{\{/.test(line);
      findings.push({
        code: inStyle ? 'SYS003' : 'SYS001',
        line: i + 1,
        found: hex,
        suggestion: t ? `$${t.name} (${t.value}), ${t.verdict === 'exact' ? 'an exact match' : t.verdict === 'close' ? 'a close match' : `the nearest, ${t.d} away`}` : null,
      });
    }
    for (const m of line.matchAll(/className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g)) {
      const text = (m[1] || m[2] || m[3] || '').replace(/\$\{[^}]*\}/g, ' ');
      for (const cls of text.split(/\s+/)) {
        if (!CLASS_WORD.test(cls) || /^(?:is|has)-/.test(cls)) continue;
        const block = blockOf(cls);
        if (!known.has(block)) findings.push({ code: 'SYS002', line: i + 1, found: cls, suggestion: `No stylesheet defines .${block}. Reuse an existing block or add src/styles/components/_${block}.scss.` });
      }
    }
  });
  return findings.map((f) => ({ ...f, rule: CODES[f.code] }));
};

/** Two catalogs in, the pull-request comment out. Suggestions, never a gate. */
export const reviewCatalogs = (base, head) => {
  const byPath = (list) => new Map(list.map((item) => [item.path, item]));
  const baseComponents = byPath(base.components);
  const headComponents = byPath(head.components);
  const baseStyles = byPath(base.styles);

  const added = head.components.filter((c) => !baseComponents.has(c.path));
  const removed = base.components.filter((c) => !headComponents.has(c.path));
  const newHex = [];
  for (const item of [...head.components, ...head.styles]) {
    const before = (baseComponents.get(item.path) || baseStyles.get(item.path) || { hex: [] }).hex;
    const fresh = item.hex.filter((h) => !before.includes(h));
    if (fresh.length) newHex.push({ path: item.path, fresh });
  }
  const known = definedBlocks(head);
  const unstyled = added.flatMap((c) => c.blocks.filter((b) => !known.has(b)).map((b) => ({ c, b })));

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
      const rel = relatives(c, base.components);
      lines.push(`- **${c.name}** \`${c.path}\``);
      if (rel.length) {
        const list = rel.map((r) => `${r.name}${r.sharedBlocks.length ? ` (shares ${r.sharedBlocks.map((b) => `\`${b}\``).join(', ')})` : ''}`).join(', ');
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
      fresh.forEach((hex) => lines.push(`  - ${tokenLine(hex, head.tokens)}`));
    }
    lines.push('');
  }
  if (unstyled.length) {
    lines.push('### Blocks with no stylesheet', '');
    unstyled.forEach(({ c, b }) => lines.push(`- \`${b}\` in ${c.name} isn't defined in src/styles. Use an existing block or add its stylesheet.`));
    lines.push('');
  }
  lines.push(`<sub>Catalog ${base.commit || 'base'} → ${head.commit || 'head'}. Everything that exists: /system/catalog.json and /design-system.</sub>`);
  return `${lines.join('\n')}\n`;
};

/** DESIGN.md / PRODUCT.md split into sections an agent can ask for by name. */
export const splitSections = (markdown, file) => {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const out = [];
  let current = null;
  for (const line of body.split('\n')) {
    const h = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (h) {
      current = { file, level: h[1].length, heading: h[2].replace(/:$/, ''), text: '' };
      out.push(current);
    } else if (current) {
      current.text += `${line}\n`;
    }
  }
  return out.map((s) => ({ ...s, text: s.text.trim() })).filter((s) => s.text);
};

/** Named colours from DESIGN.md's front matter, joined to the Sass tokens by value. */
export const designColors = (markdown, tokens) => {
  const front = (markdown.match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const block = (front.match(/^colors:\n((?: {2}.+\n?)+)/m) || [])[1] || '';
  return [...block.matchAll(/^ {2}([a-z0-9-]+):\s*"(#[0-9a-fA-F]{3,6})"/gm)].map((m) => {
    const value = m[2].toLowerCase();
    const token = Object.entries(tokens).find(([, v]) => v === value);
    return { name: m[1], value, token: token ? token[0] : null };
  });
};

const score = (haystack, terms) =>
  terms.reduce((n, t) => n + (haystack.includes(t) ? (haystack.startsWith(t) ? 3 : 1) : 0), 0);

/** One search over components, tokens and the written rules. */
export const searchSystem = (query, { catalog, sections, colors }, limit = 8) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = [
    ...catalog.components.map((c) => ({ kind: 'component', name: c.name, path: c.path, s: score(`${c.name.toLowerCase()} ${c.blocks.join(' ')}`, terms) * 2 })),
    ...colors.map((c) => ({ kind: 'token', name: c.name, value: c.value, token: c.token, s: score(`${c.name} ${c.token || ''} ${c.value}`, terms) * 2 })),
    ...sections.map((s) => ({ kind: 'rule', name: s.heading, file: s.file, excerpt: s.text.slice(0, 160), s: score(`${s.heading.toLowerCase()} ${s.text.toLowerCase()}`, terms) })),
  ];
  return hits.filter((h) => h.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map(({ s, ...h }) => h);
};
