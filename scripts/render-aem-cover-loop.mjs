/** Record the AEM cover loop (scripts/aem-component-system/cover-loop/loop.html) to the
 *  portfolio-safe 1280x960 (4:3) h264 loop plus its poster, frame by frame through seek(t). */
import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'scripts/aem-component-system/cover-loop/loop.html');
const outDir = path.join(root, 'public/assets/portfolio-safe/aem-component-system');
const FPS = 24, T = 8, POSTER_AT = Number(process.env.POSTER_AT || 0.8);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1 });
await page.addInitScript(() => { window.__record = true; });
await page.goto('file://' + src, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const ff = spawn('/opt/homebrew/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(outDir, 'cover-loop.mp4')]);
const frames = FPS * T;
for (let i = 0; i < frames; i++) {
  const t = i / FPS;
  await page.evaluate(t => window.seek(t), t);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (Math.abs(t - POSTER_AT) < 1 / FPS / 2) {
    await page.screenshot({ type: 'jpeg', quality: 90, path: path.join(outDir, 'cover-loop-poster.jpg') });
  }
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('exit', code => code === 0 ? res() : rej(new Error('ffmpeg ' + code))));
await browser.close();
console.log(`wrote ${frames} frames (${T}s @ ${FPS}fps) + poster`);
