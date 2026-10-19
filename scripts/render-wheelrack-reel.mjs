/** Record the WheelRack cover reel (scripts/wheelrack-reel/reel.html, plans/005) to
 *  public/images/work/wheelrack/wheelrack-system-to-product.mp4 and its poster. */
import path from 'node:path'; import { spawn } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'scripts/wheelrack-reel/reel.html');
const out = path.join(root, process.env.OUT || 'public/images/work/wheelrack/wheelrack-system-to-product.mp4');
// The loop opens on the finished product with its traces (t = 6.45), then
// resets into the deck, so the poster and the first frame are the product.
const FPS = 24, START = 5.95, POSTER_AT = START;
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
await page.addInitScript(() => { window.__record = true; });
await page.goto('file://' + src, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.__ready);
const T = await page.evaluate(() => window.T_END);
const ff = spawn('/opt/homebrew/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
for (let i = 0; i < Math.round(FPS * T); i++) {
  await page.evaluate(t => window.seek(t), (START + i / FPS) % T);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('exit', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
await page.evaluate(t => window.seek(t), POSTER_AT);
await page.screenshot({ type: 'jpeg', quality: 90, path: out.replace(/\.mp4$/, '-poster.jpg') });
await browser.close();
console.log(`wrote ${Math.round(FPS * T)} frames (${T.toFixed(2)}s) + poster -> ${path.relative(root, out)}`);
