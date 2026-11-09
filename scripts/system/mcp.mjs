#!/usr/bin/env node
// rdeboer-system: an MCP server for the design system behind rdeboerdesigns.com.
//
// Zero dependencies, stdio, read-only. Two ways to run it:
//
//   Inside a checkout of the repo (Claude Code picks it up from .mcp.json):
//     node scripts/system/mcp.mjs
//   It reads the working tree as it is right now, and review_change works.
//
//   Anywhere else, from the copy the site publishes:
//     curl -so ~/rdeboer-system.mjs https://www.rdeboerdesigns.com/system/mcp.mjs
//     claude mcp add rdeboer-system -- node ~/rdeboer-system.mjs
//   It reads the JSON the last deploy published under /system/ (override the
//   origin with RDEBOER_SYSTEM_URL).
//
// Every answer comes from the same generated files the /design-system page and
// the pull-request review read, through the same functions (core.mjs). Nothing
// is sent anywhere except the GET requests for those files.
import { CODES, checkSource, designColors, nearestToken, relatives, reviewCatalogs, searchSystem, splitSections } from './core.mjs';

const VERSION = '1.0.0';
const ORIGIN = process.env.RDEBOER_SYSTEM_URL || 'https://www.rdeboerdesigns.com';

// ---------------------------------------------------------------- data

let local = null;
async function findLocal() {
  // Only the copy inside the repo has these modules next to it; the published
  // single file falls through to the network.
  try {
    const [{ buildCatalog }, fs, path, url] = await Promise.all([
      import('./catalog.mjs'),
      import('node:fs'),
      import('node:path'),
      import('node:url'),
    ]);
    const root = process.env.RDEBOER_SYSTEM_ROOT || path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '../..');
    if (!fs.existsSync(path.join(root, 'DESIGN.md'))) return null;
    return { root, buildCatalog, fs, path };
  } catch {
    return null;
  }
}

async function loadSystem() {
  local = local === null ? (await findLocal()) || false : local;
  if (local) {
    const { root, buildCatalog, fs, path } = local;
    const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
    const catalog = buildCatalog(root);
    const design = read('DESIGN.md');
    return {
      source: `working tree at ${root}`,
      catalog,
      sections: [...splitSections(design, 'DESIGN.md'), ...splitSections(read('PRODUCT.md'), 'PRODUCT.md')],
      colors: designColors(design, catalog.tokens),
      agents: JSON.parse(read('src/data/system-agents.json')),
    };
  }
  const get = async (file) => {
    const res = await fetch(`${ORIGIN}/system/${file}`);
    if (!res.ok) throw new Error(`${ORIGIN}/system/${file} returned ${res.status}`);
    return res.json();
  };
  const [catalog, rules, agents] = await Promise.all([get('catalog.json'), get('rules.json'), get('agents.json')]);
  return { source: `${ORIGIN}/system/ (commit ${catalog.commit})`, catalog, sections: rules.sections, colors: rules.colors, agents };
}

// Re-read on every call in a checkout (it changes as you work); cache the
// published files for five minutes.
let cached = null;
async function system() {
  if (cached && !local && Date.now() - cached.at < 300_000) return cached.data;
  const data = await loadSystem();
  cached = { at: Date.now(), data };
  return data;
}

// ---------------------------------------------------------------- tools

const str = (description) => ({ type: 'string', description });
const SCHEMAS = {
  search_system: { type: 'object', properties: { query: str('Words to look for, e.g. "card", "orange", "motion"'), limit: { type: 'number', description: 'Max results (default 8)' } }, required: ['query'] },
  get_component: { type: 'object', properties: { name: str('Component name, e.g. "TestimonialCard"') }, required: ['name'] },
  find_tokens: { type: 'object', properties: { hex: str('Optional raw colour, e.g. "#f04a00", to match to a token') } },
  get_rules: { type: 'object', properties: { topic: str('Optional section heading, e.g. "Colors", "Motion", "Do\'s and Don\'ts"') } },
  get_checklist: { type: 'object', properties: { size: { type: 'string', enum: ['sketch', 'playground', 'production'], description: 'Which size the work is at' } }, required: ['size'] },
  check_source: { type: 'object', properties: { code: str('TSX or SCSS to check'), file: str('Optional file name, for the report') }, required: ['code'] },
  review_change: { type: 'object', properties: { base: str('Git ref to compare with (default origin/main)') } },
};

const HANDLERS = {
  async search_system({ query, limit }, s) {
    const hits = searchSystem(query, s, limit || 8);
    return hits.length ? hits : `Nothing in the system matches "${query}". If you're about to add it, get_checklist tells you what it needs.`;
  },

  async get_component({ name }, s) {
    const c = s.catalog.components.find((x) => x.name.toLowerCase() === String(name).toLowerCase());
    if (!c) {
      const near = searchSystem(name, s, 5).filter((h) => h.kind === 'component').map((h) => h.name);
      return `No component named "${name}".${near.length ? ` Closest: ${near.join(', ')}.` : ''}`;
    }
    const styles = s.catalog.styles.filter((st) => st.blocks.some((b) => c.blocks.includes(b))).map((st) => st.path);
    return {
      ...c,
      stylesheets: styles,
      rawColours: c.hex.map((hex) => ({ hex, token: nearestToken(hex, s.catalog.tokens) })),
      relatives: relatives(c, s.catalog.components),
    };
  },

  async find_tokens({ hex }, s) {
    if (hex) {
      if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return `"${hex}" isn't a hex colour.`;
      const t = nearestToken(hex, s.catalog.tokens);
      const role = s.colors.find((c) => c.token === t.name);
      return { hex: hex.toLowerCase(), token: `$${t.name}`, value: t.value, role: role ? role.name : null, distance: t.d, verdict: t.verdict };
    }
    const roles = new Map(s.colors.filter((c) => c.token).map((c) => [c.token, c.name]));
    return Object.entries(s.catalog.tokens).map(([token, value]) => ({ token: `$${token}`, value, role: roles.get(token) || null }));
  },

  async get_rules({ topic }, s) {
    if (!topic) return s.sections.map((x) => `${x.file} › ${x.heading}`).join('\n');
    const t = String(topic).toLowerCase();
    const found = s.sections.filter((x) => x.heading.toLowerCase() === t).concat(s.sections.filter((x) => x.heading.toLowerCase() !== t && x.heading.toLowerCase().includes(t)));
    if (!found.length) return `No section called "${topic}". Call get_rules with no topic for the list.`;
    return found.slice(0, 3).map((x) => `## ${x.heading} (${x.file})\n\n${x.text}`).join('\n\n');
  },

  async get_checklist({ size }, s) {
    const z = s.agents.sizes.find((x) => x.id === size);
    if (!z) return 'Size must be sketch, playground or production.';
    return [`# ${z.label}: ${z.who}`, `Fixed: ${z.fixed}. Loose: ${z.loose}.`, '', ...z.checks.map((c) => `- [ ] ${c}`)].join('\n');
  },

  async check_source({ code, file }, s) {
    const findings = checkSource(String(code), s.catalog);
    if (!findings.length) return `No findings${file ? ` in ${file}` : ''}: every colour is a token and every block has a stylesheet.`;
    return { file: file || null, findings, note: 'Advisory. The same rules run on the pull request; a person decides what the system takes.' };
  },

  async review_change({ base = 'origin/main' }, s) {
    if (!local) return 'review_change needs a checkout of the repo. From the published copy, use check_source on the code instead.';
    const { execFileSync } = await import('node:child_process');
    const { mkdtempSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const dir = mkdtempSync(join(tmpdir(), 'rdeboer-system-'));
    try {
      execFileSync('git', ['-C', local.root, 'worktree', 'add', '--detach', dir, base], { stdio: 'ignore' });
      const report = reviewCatalogs(local.buildCatalog(dir), s.catalog);
      return report.replace('<!-- system-review -->\n', '');
    } finally {
      try { execFileSync('git', ['-C', local.root, 'worktree', 'remove', '--force', dir], { stdio: 'ignore' }); } catch { rmSync(dir, { recursive: true, force: true }); }
    }
  },
};

// ---------------------------------------------------------------- protocol

const INSTRUCTIONS = [
  "This is the design system behind Ryan DeBoer's portfolio (rdeboerdesigns.com).",
  'Before building UI for it: search_system for what exists, get_component before adding a component, find_tokens for colours.',
  'Work comes in three sizes; get_checklist says how much to check at each.',
  'Before finishing a change to styles or className, run check_source on it. It uses the same rules as the pull-request review and only advises.',
  `Finding codes are stable: ${Object.entries(CODES).map(([k, v]) => `${k} ${v}`).join('; ')}.`,
].join(' ');

const send = (msg) => process.stdout.write(`${JSON.stringify(msg)}\n`);

async function handle(msg) {
  const { id, method, params = {} } = msg;
  if (method === 'initialize') {
    return send({ jsonrpc: '2.0', id, result: {
      protocolVersion: params.protocolVersion || '2025-06-18',
      capabilities: { tools: {} },
      serverInfo: { name: 'rdeboer-system', version: VERSION },
      instructions: INSTRUCTIONS,
    } });
  }
  if (method === 'ping') return send({ jsonrpc: '2.0', id, result: {} });
  if (method === 'tools/list') {
    const s = await system();
    return send({ jsonrpc: '2.0', id, result: { tools: s.agents.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: SCHEMAS[t.name],
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    })) } });
  }
  if (method === 'tools/call') {
    const handler = HANDLERS[params.name];
    if (!handler) return send({ jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown tool: ${params.name}` } });
    try {
      const s = await system();
      const out = await handler(params.arguments || {}, s);
      const text = typeof out === 'string' ? out : JSON.stringify(out, null, 2);
      return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: `${text}\n\n(source: ${s.source})` }] } });
    } catch (err) {
      return send({ jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text: String(err && err.message ? err.message : err) }] } });
    }
  }
  if (id !== undefined) send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }); continue; }
    handle(msg).catch((err) => msg.id !== undefined && send({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: String(err) } }));
  }
});
