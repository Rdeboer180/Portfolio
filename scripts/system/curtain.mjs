// The steel curtain: every check a change passes before it can merge, run on
// what the change adds (never on the debt it inherits). The name is Brad
// Frost's, from AI & Design Systems; the split is mine: deterministic rules
// block, everything else is reported for a person to answer.
//
// Brad Frost's skills (.agents/skills, from bradfrost/skills) feed it two ways.
// The deterministic part of ds-token-architecture's check 8 is a rule here:
// ghost tokens, a var() nothing defines (SYS004). The rest of the skills need
// judgment, so the report only points at them: "Brad Frost lenses" names the
// skill a person should run next, and only when the diff gave a reason.
//
// Used by scripts/steel-curtain.mjs (the pull-request workflow and local runs)
// and by the MCP server's review_change, so an agent gets the same verdict
// before the pull request that the pull request gets.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCatalog } from './catalog.mjs';
import { CODES, blocksMerge, checkA11y, checkCopy, checkCustomProperties, checkSource, parseVoice, relatives, reviewCatalogs } from './core.mjs';

const REGISTRY = 'src/data/system-registry.json';
const SKILL = '.claude/skills/ryan-taste/SKILL.md';
const TOKEN_FILES = new Set(['src/styles/_variables.scss', 'src/styles/_tokens.scss']);

const isBlocking = blocksMerge;

const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });

/** Added line numbers per file, from a zero-context diff against the merge base. */
const addedLines = (root, base) => {
  const diff = git(root, ['diff', '--unified=0', '--no-color', '--no-renames', base, '--', 'src', 'DESIGN.md', 'PRODUCT.md']);
  const files = new Map();
  let file = null;
  for (const line of diff.split('\n')) {
    const f = line.match(/^\+\+\+ b\/(.+)$/);
    if (f) { file = f[1]; files.set(file, new Set()); continue; }
    if (line.startsWith('+++ /dev/null')) { file = null; continue; }
    const h = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
    if (h && file) {
      const start = Number(h[1]);
      const count = h[2] === undefined ? 1 : Number(h[2]);
      for (let i = 0; i < count; i += 1) files.get(file).add(start + i);
    }
  }
  // A local run (review_change) also sees files not yet added to git: every line is new.
  for (const file of git(root, ['ls-files', '--others', '--exclude-standard', '--', 'src']).split('\n').filter(Boolean)) {
    const n = readFileSync(join(root, file), 'utf8').split('\n').length;
    files.set(file, new Set(Array.from({ length: n }, (_, i) => i + 1)));
  }
  return files;
};

/** Every path the branch touches, anywhere in the repo, for the lenses. */
const changedPaths = (root, base) => [...new Set([
  ...git(root, ['diff', '--name-only', '--no-renames', base]).split('\n'),
  ...git(root, ['ls-files', '--others', '--exclude-standard']).split('\n'),
].filter(Boolean))];

export function runCurtain({ root, base = 'origin/main', pr = null }) {
  const mergeBase = git(root, ['merge-base', base, 'HEAD']).trim();
  const dir = mkdtempSync(join(tmpdir(), 'steel-curtain-'));
  let baseCatalog;
  try {
    git(root, ['worktree', 'add', '--detach', dir, mergeBase]);
    baseCatalog = buildCatalog(dir);
  } finally {
    try { git(root, ['worktree', 'remove', '--force', dir]); } catch { rmSync(dir, { recursive: true, force: true }); }
  }
  const head = buildCatalog(root);
  const voice = parseVoice(readFileSync(join(root, SKILL), 'utf8'));
  const added = addedLines(root, mergeBase);

  // ---- rules on added lines
  const findings = [];
  for (const [file, lines] of added) {
    if (!lines.size || !existsSync(join(root, file))) continue;
    const text = readFileSync(join(root, file), 'utf8');
    const keep = (list, area) => list.filter((f) => lines.has(f.line)).forEach((f) => findings.push({ ...f, file, area, blocking: isBlocking(f) }));
    if (/\.(tsx|scss)$/.test(file) && !TOKEN_FILES.has(file) && !/\.test\.tsx$/.test(file)) keep(checkSource(text, head), 'system');
    // Raw values belong in the token files; a ghost reference doesn't.
    if (TOKEN_FILES.has(file)) keep(checkCustomProperties(text, head), 'system');
    if (/\.tsx$/.test(file) && !/\.test\.tsx$/.test(file)) keep(checkA11y(text), 'accessibility');
    if (/\.(tsx|ts|md)$/.test(file) && !/\.test\.tsx?$/.test(file)) keep(checkCopy(text, voice), 'copy');
  }

  // ---- what the system should take on
  const registryPath = join(root, REGISTRY);
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const baseComponents = new Set(baseCatalog.components.map((c) => c.path));
  const headComponents = new Set(head.components.map((c) => c.path));
  const newComponents = head.components.filter((c) => !baseComponents.has(c.path));
  const removedComponents = baseCatalog.components.filter((c) => !headComponents.has(c.path));
  const baseBlocks = new Set(baseCatalog.styles.flatMap((s) => s.blocks));
  const newPatterns = head.styles.flatMap((s) => s.blocks.filter((b) => !baseBlocks.has(b)).map((b) => ({ block: b, stylesheet: s.path })));
  const origin = pr ? `PR #${pr}` : 'this branch';

  const proposals = [];
  for (const c of newComponents) {
    if (registry.components[c.name]) continue;
    registry.components[c.name] = {
      size: 'playground',
      documented: null,
      status: 'proposed',
      introduced: origin,
      path: c.path,
      blocks: c.blocks,
      relatives: relatives(c, baseCatalog.components).map((r) => r.name),
    };
    proposals.push({ kind: 'component', name: c.name });
    findings.push({ code: 'REG001', rule: CODES.REG001, area: 'registry', file: c.path, line: null, found: c.name, blocking: false,
      suggestion: `Proposed as a playground component. Promote it (size, where it's documented) or say it's a sketch.` });
  }
  for (const p of newPatterns) {
    if (registry.patterns[p.block]) continue;
    registry.patterns[p.block] = { status: 'proposed', introduced: origin, stylesheet: p.stylesheet };
    proposals.push({ kind: 'pattern', name: p.block });
  }
  const removedNames = [];
  for (const c of removedComponents) {
    if (registry.components[c.name]) { delete registry.components[c.name]; removedNames.push(c.name); }
  }
  for (const [name, entry] of Object.entries(registry.components)) {
    if (entry.size === 'production' && !entry.documented && headComponents.has(entry.path || `src/components/${name}.tsx`)) {
      findings.push({ code: 'REG002', rule: CODES.REG002, area: 'registry', file: REGISTRY, line: null, found: name, blocking: false,
        suggestion: 'Production components are documented. Add it to /design-system and set "documented".' });
    }
  }
  const registryChanged = proposals.length > 0 || removedNames.length > 0;

  return {
    base: mergeBase.slice(0, 7),
    head: head.commit,
    findings,
    blocking: findings.filter((f) => f.blocking),
    proposals,
    removedNames,
    registry,
    registryPath,
    registryChanged,
    review: reviewCatalogs(baseCatalog, head, registry),
    lenses: lensesFor({ findings, proposals, changed: changedPaths(root, mergeBase), newComponents }),
  };
}

// ---------------------------------------------------------------- Brad Frost lenses
// Which installed skill a person should run next, from signals in the diff.
// Pointers only: nothing here blocks, and a lens only shows when its signal fired.
const MANY_SYSTEM = 5;
const MANY_RAW = 3;
const AI_CONFIG = /^(?:AGENTS\.md|CLAUDE\.md|\.mcp\.json|skills-lock\.json|\.claude\/|\.agents\/|scripts\/system\/mcp\.mjs$|src\/data\/system-agents\.json$)/;

export function lensesFor({ findings, proposals, changed, newComponents }) {
  const lenses = [];
  const add = (skill, why) => lenses.push({ skill, why });
  const tokenFiles = changed.filter((f) => TOKEN_FILES.has(f));
  const ghosts = findings.filter((f) => f.code === 'SYS004');
  if (tokenFiles.length || ghosts.length) {
    const why = [
      tokenFiles.length ? `touches ${tokenFiles.map((f) => `\`${f}\``).join(' and ')}` : null,
      ghosts.length ? `adds ${ghosts.length} ghost token${ghosts.length === 1 ? '' : 's'}` : null,
    ].filter(Boolean).join(' and ');
    add('ds-token-architecture', `This PR ${why}. Check the tiers still hold: what's a definition, what's usage, what components read.`);
  }
  const proposed = proposals.filter((p) => p.kind === 'component').map((p) => p.name);
  if (proposed.length) {
    add('ds-inspection', `${proposed.length} new component${proposed.length === 1 ? '' : 's'} proposed to the registry (${proposed.join(', ')}). Run station 1, coverage and gaps, before promoting ${proposed.length === 1 ? 'it' : 'them'}.`);
  }
  const raw = (path) => findings.filter((f) => f.file === path && (f.code === 'SYS001' || f.code === 'SYS003')).length;
  const rawNew = newComponents.map((c) => ({ name: c.name, n: raw(c.path) })).filter((c) => c.n >= MANY_RAW);
  const system = findings.filter((f) => f.area === 'system');
  if (rawNew.length || system.length >= MANY_SYSTEM) {
    const why = rawNew.length
      ? `${rawNew.map((c) => `${c.name} carries ${c.n} raw colours`).join(', ')}`
      : `${system.length} system findings in one PR`;
    add('vibe-killer', `${why}. Rebuild it from components and tokens that exist before fixing values one at a time.`);
  }
  // A skill is one change, not one per file: .agents/skills/x/** reads as .agents/skills/x/.
  const ai = [...new Set(changed.filter((f) => AI_CONFIG.test(f)).map((f) => {
    const m = f.match(/^(\.(?:agents|claude)\/[^/]+\/[^/]+)\//);
    return m ? `${m[1]}/` : f;
  }))];
  if (ai.length) {
    const shown = ai.slice(0, 4).map((f) => `\`${f}\``).join(', ');
    add('ds-ai-rails', `Agent config changed (${shown}${ai.length > 4 ? `, ${ai.length - 4} more` : ''}). Check agents still reach the system: the MCP, the rules, the reuse policy.`);
  }
  return lenses;
}

export const writeRegistry = (result) => writeFileSync(result.registryPath, `${JSON.stringify(result.registry, null, 2)}\n`);

const AREA = { system: 'System', accessibility: 'Accessibility', copy: 'Copy (ryan-taste)', registry: 'Registry' };
const where = (f) => (f.line ? `\`${f.file}:${f.line}\`` : `\`${f.file}\``);

/** The pull-request comment. */
export function curtainReport(r, { build = null } = {}) {
  const lines = ['<!-- steel-curtain -->', '## Steel curtain', ''];
  const toAddress = r.findings.filter((f) => !f.blocking);
  lines.push(r.blocking.length
    ? `**Stopped.** ${r.blocking.length} blocking, ${toAddress.length} to address. Blocking findings are deterministic: a raw colour that has a token, a class with no stylesheet, a var() nothing defines, an image with no alt, a positive tabIndex.`
    : `**Holds.** Nothing blocking${toAddress.length ? `; ${toAddress.length} to address before merging` : ''}.`);
  lines.push('', `<sub>Checks what this PR adds against \`${r.base}\`. Inherited debt isn't counted here; it's on /design-system under Drift.</sub>`, '');

  const table = (list) => {
    const out = ['| | Where | Rule | Found | Do this |', '|---|---|---|---|---|'];
    list.forEach((f) => out.push(`| \`${f.code}\` | ${where(f)} | ${f.rule} | \`${String(f.found).replace(/\|/g, '\\|')}\` | ${(f.suggestion || '').replace(/\|/g, '\\|')} |`));
    return out;
  };
  if (r.blocking.length) lines.push('### Blocking', '', ...table(r.blocking), '');
  for (const area of Object.keys(AREA)) {
    const list = toAddress.filter((f) => f.area === area);
    if (list.length) lines.push(`### To address: ${AREA[area]}`, '', ...table(list), '');
  }

  if (r.registryChanged) {
    lines.push('### Rules updated in this PR', '');
    lines.push(`The curtain committed \`src/data/system-registry.json\` to this branch, so the MCP server knows about these as soon as it merges. Review it like any other change.`, '');
    r.proposals.forEach((p) => lines.push(`- Proposed ${p.kind}: \`${p.name}\``));
    r.removedNames.forEach((n) => lines.push(`- Removed from the registry: \`${n}\``));
    lines.push('');
  }

  if (r.lenses && r.lenses.length) {
    lines.push('### Brad Frost lenses', '', 'Not blocking. The skill to run next, and why this PR points at it.', '');
    r.lenses.forEach((l) => lines.push(`- \`${l.skill}\`: ${l.why}`));
    lines.push('');
  }

  if (build) lines.push('### Build', '', build, '');
  const review = r.review.replace('<!-- system-review -->\n', '').replace('## System review', '### What the system should absorb');
  lines.push(review.trim(), '');
  lines.push('<sub>Rules: scripts/system/core.mjs · voice: .claude/skills/ryan-taste/SKILL.md · lenses: .agents/skills (bradfrost/skills) · the same checks run in the MCP server (`check_source`, `check_copy`, `review_change`).</sub>');
  return `${lines.join('\n')}\n`;
}
