// The binder's four noise fields, baked once to WebP in textures/. Drawn live
// as SVG feTurbulence they cost nothing to ship, but Safari painted them on
// the processor on every hover and page turn: 50 to 77 slow frames a sweep,
// 4 to 14 fps turns (the performance review, 21 October). Baked, they are
// about 140KB, loaded with the binder. Run it after changing a field:
//
//   node docs/explorations/binder-specimen/bake-textures.mjs
//
// Chromium renders each field (tiles at 2x, the streak field at a third of
// its 2000 x 1300 px size, which its soft streaks allow), and Pillow writes
// the WebP. build-home.mjs copies textures/ to the homepage.
import { chromium } from 'playwright';
import { mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'textures');
// the page's paper grain (160px tile), the cover's leatherette (180px tile),
// the cards' glitter (140px tile)
const GRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
const SPINE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='1.05' numOctaves='2' seed='11' stitchTiles='stitch'/><feDiffuseLighting surfaceScale='2.2' lighting-color='%23fff'><feDistantLight azimuth='235' elevation='50'/></feDiffuseLighting><feComponentTransfer><feFuncR type='linear' slope='.34' intercept='.25'/><feFuncG type='linear' slope='.34' intercept='.25'/><feFuncB type='linear' slope='.34' intercept='.25'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>";
const GLINT = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='1' seed='11' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 12 0 0 0 -8.6'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>";
// the streaks of the cards' holographic film: one field over the whole binder
const W = 2000, H = 1300;
const BLANKET = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><filter id='s' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.0035 .034' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3.8 0 0 0 -1.25'/></filter><rect x='${-Math.round(W * .6)}' y='${-Math.round(H * .6)}' width='${Math.round(W * 2.2)}' height='${Math.round(H * 2.2)}' filter='url(%23s)' transform='rotate(-32 ${W / 2} ${H / 2})'/></svg>`;
// name, field, rendered size, how Pillow saves it (alpha: the colour the
// see-through pixels keep; webp: Pillow's save options)
const FIELDS = [
  ['grain', GRAIN, 320, 320, { alpha: 255, webp: { quality: 70, alpha_quality: 70 } }],
  ['spine-grain', SPINE, 360, 360, { webp: { quality: 72 } }],
  ['glint', GLINT, 280, 280, { webp: { lossless: true } }],
  ['blanket', BLANKET, Math.round(W / 3), Math.round(H / 3), { alpha: 0, webp: { quality: 60, alpha_quality: 60 } }],
];
const SAVE = `import json, sys
from PIL import Image
src, dst, opts = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
im = Image.open(src)
if 'alpha' in opts:
    a = im.getchannel('A')
    im = Image.merge('RGBA', (Image.new('L', im.size, opts['alpha']),) * 3 + (a,))
im.save(dst, 'WEBP', method=6, **opts['webp'])`;

const tmp = mkdtempSync(join(tmpdir(), 'binder-bake-'));
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [name, field, w, h, opts] of FIELDS) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<style>html,body{margin:0;background:transparent}img{display:block;width:${w}px;height:${h}px}</style><img src="${field}">`);
  await page.waitForFunction(() => document.querySelector('img').complete);
  await page.screenshot({ path: join(tmp, `${name}.png`), omitBackground: true });
  // run from the temporary folder, which holds no Python, so nothing local shadows Pillow
  const run = spawnSync('python3', ['-c', SAVE, join(tmp, `${name}.png`), join(out, `${name}.webp`), JSON.stringify(opts)], { encoding: 'utf8', cwd: tmp });
  if (run.status !== 0) throw new Error(`bake-textures: ${name}: ${run.stderr}`);
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`baked ${FIELDS.map(([n]) => n).join(', ')} into ${out}`);
