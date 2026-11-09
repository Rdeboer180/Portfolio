#!/usr/bin/env node
// The pull-request half of the system: diff the catalog a PR produces against
// main's and write what changed as suggestions, never as a gate. The rules live
// in scripts/system/core.mjs, shared with the MCP server's check_source and
// review_change, so an agent hears the same thing before the PR as the PR
// comment says after. The workflow posts the result as one comment that
// updates on every push.
//
//   node scripts/system-review.mjs base.json head.json [report.md]
import { readFileSync, writeFileSync } from 'node:fs';
import { reviewCatalogs } from './system/core.mjs';

const [baseFile, headFile, outFile] = process.argv.slice(2);
if (!baseFile || !headFile) {
  console.error('usage: system-review.mjs base.json head.json [report.md]');
  process.exit(2);
}
const base = JSON.parse(readFileSync(baseFile, 'utf8'));
const head = JSON.parse(readFileSync(headFile, 'utf8'));
const report = reviewCatalogs(base, head);
if (outFile) writeFileSync(outFile, report);
process.stdout.write(report);
