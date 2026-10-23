/** Record the seasonal content intro reel (scripts/seasonal-reel/reel.html) to
 *  public/images/work/seasonal-content-system/seasonal-swap-reel.mp4 and its
 *  poster, frame by frame through seek(t). The poster is the split: both
 *  seasons on the same three URLs. */
import path from 'node:path'; import { spawn } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'scripts/seasonal-reel/reel.html');
const out = path.join(root, process.env.OUT || 'public/images/work/seasonal-content-system/seasonal-swap-reel.mp4');
const FPS = 30, POSTER_AT = Number(process.env.POSTER_AT || 7.6);
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.addInitScript(() => { window.__record = true; });
await page.goto('file://' + src, { waitUntil: 'networkidle' });
await page.evaluate(() => window.__ready);
const T = await page.evaluate(() => window.T_END);
const ff = spawn('/opt/homebrew/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
const frames = Math.round(FPS * T);
for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.seek(t), i / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('exit', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
await page.evaluate(t => window.seek(t), POSTER_AT);
await page.screenshot({ type: 'jpeg', quality: 90, path: out.replace(/\.mp4$/, '-poster.jpg') });
await browser.close();
console.log(`wrote ${frames} frames (${T.toFixed(2)}s @ ${FPS}fps) + poster -> ${path.relative(root, out)}`);
