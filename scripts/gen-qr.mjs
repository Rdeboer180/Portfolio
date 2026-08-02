// ============================================
// gen-qr.mjs — emit static QR SVGs for case-study install links.
//
// QR targets are stable URLs, so they're generated once at author time and
// committed as SVG rather than encoded at runtime: no client dependency, no
// third-party image service, crisp at any size, and works offline.
//
// Usage:  node scripts/gen-qr.mjs
// Add or edit an entry below, run it, commit the SVG.
// ============================================

import QRCode from 'qrcode';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'public/images/qr';

// slug → URL. Set a TestFlight public link (App Store Connect → TestFlight →
// external group → Enable Public Link) and re-run to activate that code.
const TARGETS = {
  'loopstack-demo': 'https://www.rdeboerdesigns.com/loopstack-demo/',
  'playdraft-testflight': 'https://testflight.apple.com/join/swanYSs1',
  // 'loopstack-testflight': 'https://testflight.apple.com/join/XXXXXXXX',
};

// Rendered small (roughly 120px) — high error correction keeps it scannable
// even at that size and if the print/screen is imperfect.
const OPTS = {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 0,
  color: { dark: '#1b1b1b', light: '#0000' }, // transparent quiet zone
};

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, url] of Object.entries(TARGETS)) {
  let svg = await QRCode.toString(url, OPTS);
  // The library emits a viewBox-only SVG. Referenced through <img>, that has
  // no intrinsic size, which some engines rasterize inconsistently — give it
  // explicit square dimensions matching the rendered size.
  svg = svg.replace('<svg ', '<svg width="120" height="120" ');
  const file = path.join(OUT_DIR, `${slug}.svg`);
  await writeFile(file, svg, 'utf8');
  console.log(`✓ ${file}  →  ${url}`);
}

console.log(`\n${Object.keys(TARGETS).length} QR code(s) written to ${OUT_DIR}`);
