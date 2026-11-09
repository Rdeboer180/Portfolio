#!/usr/bin/env node
// Run the steel curtain on this checkout against a base ref.
//
//   node scripts/steel-curtain.mjs [--base origin/main] [--pr 12]
//        [--report curtain.md] [--json curtain.json] [--update-registry] [--strict]
//
// --update-registry writes the proposed registry entries into
// src/data/system-registry.json (the workflow commits them to the PR).
// --strict exits 1 when anything blocks; without it the report is the output.
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { curtainReport, runCurtain, writeRegistry } from './system/curtain.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const root = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'));

const result = runCurtain({ root, base: opt('base', 'origin/main'), pr: opt('pr') });
if (args.includes('--update-registry') && result.registryChanged) writeRegistry(result);

const report = curtainReport(result);
if (opt('report')) writeFileSync(opt('report'), report);
if (opt('json')) {
  const { registry, review, ...rest } = result;
  writeFileSync(opt('json'), `${JSON.stringify({ ...rest, blocking: result.blocking.length }, null, 2)}\n`);
}
process.stdout.write(report);
if (args.includes('--strict') && result.blocking.length) process.exit(1);
