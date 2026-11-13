/** Record the LoopStack case-study cover loop to
 *  public/assets/portfolio-safe/loopstack/cover-loop.mp4 and its poster.
 *
 *  Two stages, both with the playwright the prerender uses:
 *  1. Capture. Serve public/ locally and drive the two real builds:
 *     the phone app (public/loopstack-demo, sample data) at 390x844 @3x, and
 *     the desktop app (public/loopstack-desktop-demo, synthetic patient Sam)
 *     at 1440x900 @2x. The desktop beats are real interactions captured step
 *     by step: a tile dragged in edit layout, hours picked on What Loop did,
 *     and an option agreed on Sam's question in the care-team review. Each
 *     step records where the pointer was, so the reel can draw the cursor.
 *  2. Compose. A 1280x720 stage driven by seek(t) (no CSS animation, so every
 *     frame is exact), screenshotted frame by frame into ffmpeg, as the other
 *     reels do. The loop opens and closes on the side-by-side resolve, so the
 *     first and last frames join and the poster is that resolve.
 *
 *  Captures and the composed page go to a scratch folder (CAPTURE_DIR, default
 *  the OS temp dir), not the repo. Run: node scripts/render-loopstack-reel.mjs
 *  Env: RECAPTURE=1 to capture again, STILLS=t1,t2 to write preview stills
 *  instead of rendering, OUT to change the output path. */
import fs from 'node:fs'; import os from 'node:os'; import http from 'node:http';
import path from 'node:path'; import { spawn } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, process.env.OUT || 'public/assets/portfolio-safe/loopstack/cover-loop.mp4');
const work = process.env.CAPTURE_DIR || path.join(os.tmpdir(), 'loopstack-reel');
const FPS = 30;
fs.mkdirSync(work, { recursive: true });

// ---------------------------------------------------------------- static server for public/
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2' };
const pub = path.join(root, 'public');
const server = http.createServer((req, res) => {
  let f = path.join(pub, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(pub)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });

// ---------------------------------------------------------------- 1. capture
const manifestPath = path.join(work, 'manifest.json');
if (process.env.RECAPTURE || !fs.existsSync(manifestPath)) await capture();
const M = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

async function capture() {
  for (const f of fs.readdirSync(work)) if (/\.(jpg|png|json)$/.test(f)) fs.rmSync(path.join(work, f));
  const manifest = {};

  // Phone: the Trends tab. The page scrolls as one document; the tab bar is
  // fixed. Shoot the tab bar from the viewport, then the page without it, so
  // the reel can scroll the page under a still tab bar exactly as the app does.
  const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })).newPage();
  await phone.goto(BASE + '/loopstack-demo/', { waitUntil: 'networkidle' });
  await phone.evaluate(() => document.fonts.ready); await phone.waitForTimeout(2500);
  const tab = await phone.evaluate(() => {
    const el = [...document.querySelectorAll('nav, footer, div')].find((e) => getComputedStyle(e).position === 'fixed' && /Memories/.test(e.innerText) && e.getBoundingClientRect().top > 600);
    if (!el) return null; el.setAttribute('data-reel-tabbar', ''); const r = el.getBoundingClientRect(); return { y: r.top, h: r.height };
  });
  if (!tab) throw new Error('phone tab bar not found');
  await phone.screenshot({ path: path.join(work, 'phone-tabbar.png'), clip: { x: 0, y: tab.y, width: 390, height: tab.h } });
  await phone.addStyleTag({ content: '[data-reel-tabbar]{visibility:hidden!important}' });
  await phone.screenshot({ path: path.join(work, 'phone-page.jpg'), type: 'jpeg', quality: 92, fullPage: true, clip: { x: 0, y: 0, width: 390, height: 1700 } });
  manifest.phone = { tabY: tab.y, tabH: tab.h, pageH: 1700 };
  await phone.context().close();

  // Desktop
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const open = async (q) => { await p.goto(BASE + '/loopstack-desktop-demo/' + q, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(900); };
  let n = 0;
  const seq = (name) => {
    const steps = []; let last = null; let cur = { x: 1300, y: 860, down: false };
    return {
      steps,
      // shot: take a new screenshot; w: time weight of this step in the reel
      async step({ x = cur.x, y = cur.y, down = cur.down, shot = true, w = 1, settle = 120 } = {}) {
        cur = { x, y, down };
        if (shot || !last) { await p.waitForTimeout(settle); last = `${name}-${String(n++).padStart(3, '0')}.jpg`; await p.screenshot({ path: path.join(work, last), type: 'jpeg', quality: 90 }); }
        steps.push({ f: last, x, y, down, w });
      },
    };
  };
  const box = async (loc) => { const b = await loc.boundingBox(); if (!b) throw new Error('no box'); return { x: b.x + b.width / 2, y: b.y + b.height / 2, b }; };
  const glide = async (s, from, to, k, w) => { for (let i = 1; i <= k; i++) { const e = i / k; await s.step({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, shot: false, w: w / k }); } };

  // Beat 2: My dashboard in edit layout, library open. Drag Time in range to
  // the first slot by its handle (a real pointer drag), then let go.
  await open('?view=dashboard&edit=1&reset=1');
  const dash = seq('dash');
  const handle = await box(p.getByRole('button', { name: 'Drag to move Time in range' }));
  const target = await box(p.getByRole('button', { name: 'Drag to move Glucose now' }));
  await dash.step({ x: 1000, y: 620, w: 2 });
  await glide(dash, { x: 1000, y: 620 }, handle, 8, 3);
  await p.mouse.move(handle.x, handle.y); await p.mouse.down();
  await dash.step({ x: handle.x, y: handle.y, down: true, w: 1.2 });
  const K = 14;
  for (let i = 1; i <= K; i++) {
    const e = i / K, x = handle.x + (target.x + 40 - handle.x) * e, y = handle.y + 30 * Math.sin(Math.PI * e);
    await p.mouse.move(x, y, { steps: 2 });
    await dash.step({ x, y, down: true, w: 0.45 });
  }
  await p.mouse.up();
  await dash.step({ x: target.x + 40, y: handle.y, down: false, w: 1.2, settle: 400 });
  // finish editing: Done
  const done = await box(p.getByRole('button', { name: /^Done$/ }));
  await glide(dash, { x: target.x + 40, y: handle.y }, done, 8, 3);
  await dash.step({ x: done.x, y: done.y, down: true, shot: false, w: 0.4 });
  await p.mouse.click(done.x, done.y);
  await dash.step({ x: done.x, y: done.y, down: false, w: 3, settle: 600 });
  manifest.dash = dash.steps;
  // The finished, personal layout for the resolve (edit mode off, cursor away)
  await p.mouse.move(1430, 890);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(work, 'dash-final.jpg'), type: 'jpeg', quality: 90 });

  // Beat 3: What Loop did, hour by hour. Pick 3am, then 5am, then settle on 7am.
  await open('?view=dashboard&tile=what-loop-did&detail=1&sel=1');
  const wld = seq('wld');
  const cols = await p.evaluate(() => {
    const svg = [...document.querySelectorAll('.grid-fit svg')][0];
    const labels = [...svg.querySelectorAll('text')].filter((t) => /^(12a|3a|6a|9a|12p|3p|6p|9p)$/.test(t.textContent.trim()));
    return labels.map((t) => { const r = t.getBoundingClientRect(); return { t: t.textContent.trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  });
  const svgBox = await box(p.locator('.grid-fit svg').first());
  const at = (h) => { const a = cols.find((c) => c.t === '12a'), b = cols.find((c) => c.t === '6a'); return a.x + (b.x - a.x) * h / 6; };
  const rowY = svgBox.b.y + svgBox.b.height * 0.42;
  await wld.step({ x: 980, y: 760, w: 2.2 });
  let from = { x: 980, y: 760 };
  for (const h of [3, 5, 7]) {
    const to = { x: at(h), y: rowY };
    await glide(wld, from, to, 7, h === 3 ? 2.4 : 1.6);
    await wld.step({ x: to.x, y: to.y, down: true, shot: false, w: 0.35 });
    await p.mouse.click(to.x, to.y);
    await wld.step({ x: to.x, y: to.y, down: false, w: h === 7 ? 4 : 1.4, settle: 300 });
    from = to;
  }
  manifest.wld = wld.steps;
  manifest.wldCols = cols;

  // Beat 4: the care-team review for Sam, read top to bottom, then Sam's
  // question: pick option A and Agree.
  await open('?view=review&patient=sam');
  const rev = seq('rev');
  const scrollMax = await p.evaluate(() => { const c = document.querySelector('.content'); return c ? c.scrollHeight - c.clientHeight : 0; });
  await rev.step({ x: 700, y: 840, w: 2.5 });
  for (let i = 1; i <= 10; i++) {
    await p.evaluate((y) => { document.querySelector('.content').scrollTop = y; }, Math.round(scrollMax * (1 - Math.cos(Math.PI * i / 10)) / 2));
    await rev.step({ x: 700, y: 840, w: 0.32, settle: 60 });
  }
  await rev.step({ w: 1.6 });
  await p.evaluate(() => { document.querySelector('.content').scrollTop = 0; });
  await rev.step({ w: 0.8, settle: 200 });
  const optA = await box(p.getByText(/Exercise preset, Fridays/).first());
  await glide(rev, { x: 700, y: 840 }, { x: optA.b.x - 14, y: optA.y }, 8, 2.6);
  await rev.step({ x: optA.b.x - 14, y: optA.y, down: true, shot: false, w: 0.35 });
  await p.mouse.click(optA.b.x - 14, optA.y);
  await rev.step({ x: optA.b.x - 14, y: optA.y, down: false, w: 1.3, settle: 300 });
  const agree = await box(p.getByRole('button', { name: /^Agree$/ }));
  await glide(rev, { x: optA.b.x - 14, y: optA.y }, agree, 7, 1.8);
  await rev.step({ x: agree.x, y: agree.y, down: true, shot: false, w: 0.35 });
  await p.mouse.click(agree.x, agree.y);
  await rev.step({ x: agree.x, y: agree.y, down: false, w: 5, settle: 600 });
  manifest.rev = rev.steps;
  manifest.revBoxes = { optA: optA.b, agree: agree.b, scrollMax };
  await ctx.close();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log('captured ->', work);
}

// ---------------------------------------------------------------- 2. compose
fs.copyFileSync(path.join(pub, 'loopstack-demo/loopstack-mark.svg'), path.join(work, 'mark.svg'));
fs.writeFileSync(path.join(work, 'reel.html'), reelHtml(M));
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('file://' + path.join(work, 'reel.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.__ready);
const T = await page.evaluate(() => window.T_END);
const START = await page.evaluate(() => window.T_START);   // inside the resolve hold
const POSTER_AT = await page.evaluate(() => window.T_POSTER);

if (process.env.STILLS) {
  for (const s of process.env.STILLS.split(',')) {
    await page.evaluate((t) => window.seek(t), Number(s));
    await page.screenshot({ path: path.join(work, `still-${s}.png`) });
  }
  console.log('stills ->', work);
} else {
  const ff = spawn('/opt/homebrew/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  const frames = Math.round(FPS * T);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), (START + i / FPS) % T);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('exit', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  await page.evaluate((t) => window.seek(t), POSTER_AT);
  await page.screenshot({ type: 'jpeg', quality: 90, path: out.replace(/\.mp4$/, '-poster.jpg') });
  console.log(`wrote ${frames} frames (${T.toFixed(2)}s @ ${FPS}fps) + poster -> ${path.relative(root, out)}`);
}
await browser.close(); server.close();

// ---------------------------------------------------------------- the stage
function reelHtml(M) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap">
<style>
/* LoopStack cover loop. The phone glance, then the desktop app: My dashboard
   rearranged by hand, What Loop did hour by hour, the care-team review, and
   both surfaces side by side. Type and colour follow the earlier cover:
   Inter, a tracked green eyebrow over a bold dark title, on the app's own
   light grey. */
:root{--ink:#16181b;--paper:#f6f7f8;--mute:#8b919a;--green:#3fae4f;--hair:#e3e6ea}
*{box-sizing:border-box}html,body{margin:0;background:var(--paper)}
#stage{position:relative;width:1280px;height:720px;overflow:hidden;background:var(--paper);font-family:Inter,-apple-system,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.label{position:absolute;white-space:nowrap}
.label .eb{font:700 13px/1 Inter;letter-spacing:.16em;text-transform:uppercase;color:var(--green)}
.label .tt{margin-top:12px;font:700 38px/1.1 Inter;letter-spacing:-.02em}
/* desktop window */
#win{position:absolute;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(22,24,27,.08),0 30px 60px -24px rgba(22,24,27,.35)}
#win .bar{position:absolute;left:0;right:0;top:0;height:28px;background:#eceef1;border-bottom:1px solid var(--hair)}
#win .bar i{position:absolute;top:9px;width:10px;height:10px;border-radius:50%}
#win .view{position:absolute;left:0;right:0;top:28px;bottom:0;overflow:hidden}
#win .cam{position:absolute;left:0;top:0;width:1440px;height:900px;transform-origin:0 0}
#win .cam img{position:absolute;left:0;top:0;width:1440px;height:900px;opacity:0}
/* phone */
#phone{position:absolute;left:0;top:0;width:414px;height:868px;transform-origin:0 0;border-radius:62px;background:#111;box-shadow:0 30px 60px -24px rgba(22,24,27,.45)}
#phone .scr{position:absolute;left:12px;top:12px;width:390px;height:844px;border-radius:50px;overflow:hidden;background:#f6f7f8}
#phone .scr .pg{position:absolute;left:0;top:0;width:390px}
#phone .scr .tb{position:absolute;left:0;width:390px}
#phone .sb{position:absolute;left:12px;top:12px;width:390px;height:54px;border-radius:50px 50px 0 0;background:linear-gradient(#f6f7f8 80%,rgba(246,247,248,0))}
#phone .island{position:absolute;left:50%;top:22px;width:120px;height:34px;margin-left:-60px;border-radius:20px;background:#111}
/* cursor */
#cur{position:absolute;left:0;top:0;width:22px;height:30px;transform-origin:3px 2px;pointer-events:none}
#ring{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:2px solid var(--green);opacity:0}
/* wordmark */
#mark{position:absolute;display:flex;align-items:center;gap:14px}
#mark img{width:52px;height:52px}
#mark b{font:800 40px/1 Inter;letter-spacing:-.03em}#mark b span{color:var(--green)}
</style></head><body><div id="stage">
<div id="win"><div class="bar"><i style="left:12px;background:#ff5f57"></i><i style="left:28px;background:#febc2e"></i><i style="left:44px;background:#28c840"></i></div>
<div class="view"><div class="cam" id="cam"></div></div></div>
<div id="phone"><div class="scr"><img class="pg" src="phone-page.jpg" style="height:${M.phone.pageH}px"><img class="tb" src="phone-tabbar.png" style="top:${M.phone.tabY}px;height:${M.phone.tabH}px"></div><div class="sb"></div><div class="island"></div></div>
<div id="ring"></div>
<svg id="cur" viewBox="0 0 22 30"><path d="M3 2 L3 24 L8.6 18.8 L12.4 27.4 L16 25.8 L12.3 17.4 L19.6 17.4 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>
<div id="mark"><img src="mark.svg" alt=""><b><span>Loop</span>Stack</b></div>
<div class="label" id="l1"><div class="eb">Phone app</div><div class="tt">On the phone</div></div>
<div class="label" id="l2"><div class="eb">Desktop app</div><div class="tt">Your dashboard, your layout</div></div>
<div class="label" id="l3"><div class="eb">Desktop app</div><div class="tt">What Loop did, hour by hour</div></div>
<div class="label" id="l4"><div class="eb">Desktop app</div><div class="tt">The care-team review</div></div>
</div>
<script>
const M = ${JSON.stringify(M)};
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const ease = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const out = (p) => 1 - Math.pow(1 - p, 3);
const mix = (a, b, p) => a + (b - a) * p;
const $ = (s) => document.querySelector(s);

// timeline (s). The resolve is held across the loop seam (15.15..16, 0..0.8);
// the video starts at 0.25, so it opens on a beat of the resolve, then the phone.
const T = { r2p: 0.8, phone: 1.5, p2d: 3.9, dash: 4.6, d2w: 8.15, wld: 8.5, w2r: 11.05, rev: 11.4, toRes: 14.45, res: 15.15, end: 16 };
window.T_END = T.end; window.T_START = 0.25; window.T_POSTER = 15.6;

// image layers for the desktop sequences
const cam = $('#cam'); const imgs = {};
const files = new Set(['dash-final.jpg', ...M.dash.map(s => s.f), ...M.wld.map(s => s.f), ...M.rev.map(s => s.f)]);
for (const f of files) { const im = new Image(); im.src = f; cam.appendChild(im); imgs[f] = im; }
window.__ready = Promise.all([...Object.values(imgs), ...document.images].map(im => im.decode().catch(() => {})));

// A captured sequence played over [a, b]: steps take time by weight.
function play(steps, a, b, t) {
  const W = steps.reduce((s, x) => s + x.w, 0); const p = clamp((t - a) / (b - a)) * W;
  let acc = 0;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (p <= acc + s.w || i === steps.length - 1) {
      const prev = steps[Math.max(0, i - 1)], k = clamp((p - acc) / s.w);
      const e = ease(k);
      return { f: s.f, x: mix(prev.x, s.x, e), y: mix(prev.y, s.y, e), down: s.down, k };
    }
    acc += s.w;
  }
}
// camera keyframes: content point (cx, cy) at the view centre, zoom z
function camAt(keys, t) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i].t) { const a = keys[i - 1], b = keys[i], e = ease(ramp(t, a.t, b.t)); return { cx: mix(a.cx, b.cx, e), cy: mix(a.cy, b.cy, e), z: Math.exp(mix(Math.log(a.z), Math.log(b.z), e)) }; }
  return keys[keys.length - 1];
}
// window geometry: the big desktop frame and the small resolve frame
const BIG = { x: 64, y: 132, w: 1152, h: 600 }, SMALL = { x: 56, y: 150, w: 800, h: 528 };
// the main column without the sidebar (232px wide) fills the big frame
const MAIN = { z: BIG.w / (1440 - 232), cx: 232 + (1440 - 232) / 2 };

window.seek = (t) => {
  // ---- window geometry and presence
  const enter = out(ramp(t, T.p2d, T.dash));                 // rises in from below
  const toRes = ease(ramp(t, T.toRes, T.res));                 // shrinks to the resolve
  const leave = ease(ramp(t, T.r2p, T.phone));                 // resolve -> phone: slides out left
  let g;
  if (t < T.p2d) g = { ...SMALL, x: SMALL.x - 980 * leave };
  else if (t < T.toRes) g = { ...BIG, y: mix(760, BIG.y, enter) };
  else g = { x: mix(BIG.x, SMALL.x, toRes), y: mix(BIG.y, SMALL.y, toRes), w: mix(BIG.w, SMALL.w, toRes), h: mix(BIG.h, SMALL.h, toRes) };
  const win = $('#win');
  Object.assign(win.style, { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px' });
  win.style.opacity = String(t < T.p2d ? 1 - leave : 1);
  const vw = g.w, vh = g.h - 28, fz = g.w / 1440;

  // ---- which capture is showing, the camera, and the cursor
  let shot = 'dash-final.jpg', cur = null, keys;
  const fullTop = (z) => ({ cx: 720, cy: (vh / 2) / z });
  if (t >= T.dash - 0.7 && t < T.d2w + 0.18) {
    const s = play(M.dash, T.dash + 0.35, T.d2w - 0.2, t); shot = s.f; cur = s;
    keys = [{ t: T.dash, ...fullTop(fz), z: fz }, { t: T.dash + 1.0, cx: MAIN.cx, cy: 300, z: MAIN.z }];
  } else if (t >= T.d2w + 0.18 && t < T.w2r + 0.18) {
    const s = play(M.wld, T.wld + 0.1, T.w2r - 0.15, t); shot = s.f; cur = s;
    keys = [{ t: T.wld - .2, cx: MAIN.cx, cy: 300, z: MAIN.z }, { t: T.wld + 1.0, cx: MAIN.cx, cy: 398, z: MAIN.z }];
  } else if (t >= T.w2r + 0.18 && t < T.toRes + 0.25) {
    const s = play(M.rev, T.rev + 0.1, T.toRes - 0.2, t); shot = s.f; cur = s;
    // push in on the review's main column and Sam's question, from the tabs down to Agree / Modify / Discuss
    keys = [{ t: T.rev - .2, cx: MAIN.cx, cy: 300, z: MAIN.z }, { t: T.rev + 1.3, cx: MAIN.cx, cy: 300, z: MAIN.z }, { t: T.rev + 2.0, cx: 951, cy: 423, z: 1.18 }];
  }
  if (t >= T.toRes + 0.25 || t < T.dash - 0.7) { shot = 'dash-final.jpg'; cur = null; }
  for (const f in imgs) imgs[f].style.opacity = f === shot ? '1' : '0';
  let c = keys ? camAt(keys, t) : { ...fullTop(fz), z: fz };
  if (t >= T.toRes) { const e = toRes, full = { ...fullTop(fz), z: fz }; c = { cx: mix(c.cx, full.cx, e), cy: mix(c.cy, full.cy, e), z: Math.exp(mix(Math.log(c.z), Math.log(full.z), e)) }; }
  if (t < T.dash) { const full = { ...fullTop(fz), z: fz }; c = full; }
  const ox = clamp(c.cx - vw / 2 / c.z, 0, Math.max(0, 1440 - vw / c.z)), oy = clamp(c.cy - vh / 2 / c.z, 0, Math.max(0, 900 - vh / c.z));
  cam.style.transform = 'translate(' + (-ox * c.z) + 'px,' + (-oy * c.z) + 'px) scale(' + c.z + ')';
  // beat changes: a short dip of the content so cuts inside the window read as cuts
  const dip = Math.max(1 - Math.abs(t - (T.d2w + 0.18)) / 0.2, 1 - Math.abs(t - (T.w2r + 0.18)) / 0.2, 0);
  cam.style.opacity = String(1 - 0.85 * clamp(dip));
  const cu = $('#cur'), ring = $('#ring');
  const curVis = cur ? Math.min(ramp(t, T.dash + 0.2, T.dash + 0.5), 1 - ramp(t, T.toRes - 0.1, T.toRes + 0.2)) : 0;
  if (cur) {
    const sx = g.x + (cur.x - ox) * c.z, sy = g.y + 28 + (cur.y - oy) * c.z;
    cu.style.transform = 'translate(' + (sx - 3) + 'px,' + (sy - 2) + 'px) scale(' + (cur.down ? .9 : 1) + ')';
    ring.style.left = sx + 'px'; ring.style.top = sy + 'px';
    ring.style.opacity = String(cur.down ? .9 : 0);
  }
  cu.style.opacity = String(curVis); if (!curVis) ring.style.opacity = '0';

  // ---- phone
  const toPhone = ease(ramp(t, T.r2p, T.phone));               // resolve -> centre stage
  const exitP = ease(ramp(t, T.p2d, T.dash - 0.2));            // leaves right
  const backP = ease(ramp(t, T.toRes + 0.15, T.res));          // returns for the resolve
  const RES = { x: 902, y: 72, k: 0.66 }, HERO = { x: 724, y: 38, k: 0.742 };
  let ph;
  if (t < T.p2d) ph = { x: mix(RES.x, HERO.x, toPhone), y: mix(RES.y, HERO.y, toPhone), k: mix(RES.k, HERO.k, toPhone) };
  else if (t < T.toRes) ph = { x: mix(HERO.x, 1400, exitP), y: HERO.y, k: HERO.k };
  else ph = { x: mix(1400, RES.x, backP), y: RES.y, k: RES.k };
  $('#phone').style.transform = 'translate(' + ph.x + 'px,' + ph.y + 'px) scale(' + ph.k + ')';
  // the page scrolls past the current-glucose card, through Trend and time in range
  const scroll = 336 + 300 * ease(ramp(t, T.phone + 0.3, T.p2d - 0.3));
  const sc = (t > T.r2p && t < T.dash) ? scroll : 336;
  $('#phone .pg').style.transform = 'translateY(' + (-sc) + 'px)';

  // ---- wordmark (resolve only)
  const mk = $('#mark');
  const mkOn = Math.max(1 - ramp(t, T.r2p, T.r2p + 0.4), ramp(t, T.res - 0.3, T.res + 0.2));
  mk.style.opacity = String(mkOn); mk.style.left = '58px'; mk.style.top = (60 + 10 * (1 - mkOn)) + 'px';

  // ---- labels
  const lab = (id, a, b, x, y) => { const el = $(id); const o = Math.min(out(ramp(t, a, a + 0.45)), 1 - ramp(t, b - 0.3, b)); el.style.opacity = String(Math.max(0, o)); el.style.left = x + 'px'; el.style.top = (y + 14 * (1 - out(ramp(t, a, a + 0.5)))) + 'px'; };
  lab('#l1', T.r2p + 0.4, T.p2d + 0.1, 96, 300);
  lab('#l2', T.dash - 0.1, T.d2w + 0.1, 64, 38);
  lab('#l3', T.d2w + 0.2, T.w2r + 0.1, 64, 38);
  lab('#l4', T.w2r + 0.2, T.toRes + 0.1, 64, 38);
};
window.seek(0);
</script></body></html>`;
}
