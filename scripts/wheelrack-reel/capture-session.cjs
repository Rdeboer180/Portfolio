/**
 * Frame-stepped capture of a live WheelRack session for the cover reel (plans/005):
 * paint the car Red Mist, flip through wheel finishes in the visualizer and pick
 * one, then work a product tile (change its finish, View On Vehicle). Cursor and scroll are driven per frame, and each
 * page change is a short crossfade, so every frame is sharp and motion is smooth.
 * wheelrack.com sits behind bot protection: this needs real, headed Chrome.
 * Usage: NODE_PATH=node_modules node scripts/wheelrack-reel/capture-session.cjs
 * Writes scripts/wheelrack-reel/session/NNNN.jpg (1280x960, 24 fps) and rects.json.
 */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, 'session');
const URL = 'https://wheelrack.com/pitstop/wheels?autoMake=chevrolet&autoYear=2026&autoModel=corvette-coupe&autoTrim=standard-model&variantSlug=o-z-ultraleggera-hlt-green';
const ease = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const CURSOR = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 2l15 11.5-6.6.9 3.9 7.4-2.9 1.4-3.8-7.5L4 20z" fill="#1b1b1b" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  let n = 0; let cur = { x: 960, y: 720 }; let last = null;
  const settle = async () => { await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(500); };
  // The visualizer is ready when its car image has a source, is decoded, and no spinner shows.
  const carSrc = () => page.evaluate(() => { const v = document.querySelector('[class*=VehicleVizualizer]'); const i = v && v.querySelector('img'); return i && i.complete && i.naturalWidth > 0 ? i.currentSrc : null; }).catch(() => null);
  const spinning = () => page.evaluate(() => { const s = document.querySelector('[class*=embeddedSpi],[class*=spinnerWrappe]'); return !!(s && s.getBoundingClientRect().width); }).catch(() => true);
  const carReady = async (prev, timeout = 40000) => { const t0 = Date.now();
    while (Date.now() - t0 < timeout) { const src = await carSrc(); if (src && src !== prev && !(await spinning())) { await page.waitForTimeout(400); return src; } await page.waitForTimeout(250); }
    throw new Error('car never finished rendering'); };
  const center = (sel, text, nth = 0) => page.evaluate(([sel, text, nth]) => { const els = [...document.querySelectorAll(sel)].filter(e => !text || e.innerText.trim() === text).filter(e => e.getBoundingClientRect().width > 0); const e = els[nth]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) }; }, [sel, text, nth]);
  // Thumbnails in the visualizer's finish carousel, left to right.
  const thumbs = () => page.evaluate(() => { const v = [...document.querySelectorAll('h1,h2,h3')].find(h => h.innerText.trim() === 'Wheel Visualizer'); const top = v.getBoundingClientRect().bottom;
    return [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect()).filter(b => b.top > top && b.top < top + 140 && b.width > 50 && b.width < 120 && b.left > 400).sort((a, b) => a.left - b.left).map(b => ({ x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) })); });
  const prep = async () => {
    await page.evaluate((svg) => {
      document.documentElement.style.scrollBehavior = 'auto';
      if (!document.getElementById('__cursor')) {
        const c = document.createElement('div'); c.id = '__cursor'; c.innerHTML = svg;
        c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform-origin:4px 2px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))';
        const r = document.createElement('div'); r.id = '__ring';
        r.style.cssText = 'position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:2px solid #f03d01;border-radius:50%;z-index:2147483646;pointer-events:none;opacity:0';
        document.body.append(r, c);
      }
    }, CURSOR);
    // walk the page once so lazy images are loaded before the capture
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
  };
  const pose = (x, y, press = 0) => page.evaluate(([x, y, press]) => {
    const c = document.getElementById('__cursor'); c.style.transform = `translate(${x - 4}px,${y - 2}px) scale(${1 - .12 * press})`;
    const r = document.getElementById('__ring'); r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.opacity = press ? String(.9 * press) : '0'; r.style.transform = `scale(${.6 + .6 * press})`;
  }, [x, y, press]);
  const shot = async () => { last = await page.screenshot({ type: 'jpeg', quality: 92 }); fs.writeFileSync(path.join(OUT, String(n++).padStart(4, '0') + '.jpg'), last); };
  const hold = async f => { for (let i = 0; i < f; i++) await shot(); };
  const move = async (x, y, f) => { const a = { ...cur }; for (let i = 1; i <= f; i++) { const t = ease(i / f); await pose(a.x + (x - a.x) * t, a.y + (y - a.y) * t); await shot(); } cur = { x, y }; };
  const scroll = async (to, f, cursorTo) => {
    const from = await page.evaluate(() => scrollY); const a = { ...cur };
    for (let i = 1; i <= f; i++) { const t = ease(i / f); await page.evaluate(v => window.scrollTo(0, v), from + (to - from) * t);
      if (cursorTo) await pose(a.x + (cursorTo.x - a.x) * t, a.y + (cursorTo.y - a.y) * t); await shot(); }
    if (cursorTo) cur = cursorTo;
  };
  // A click: press, act, wait for the page to settle, then crossfade from the last frame.
  const click = async (act, fade, wait) => {
    await pose(cur.x, cur.y, 1); await shot(); await pose(cur.x, cur.y, .5);
    const before = last; await act(); if (wait) await wait(); else await settle();
    await pose(cur.x, cur.y, 0);
    await page.evaluate(() => { document.getElementById('__cursor') || null; });
    const after = await page.screenshot({ type: 'jpeg', quality: 92 });
    fs.writeFileSync(path.join(OUT, `fade-${n}-${fade}.json`), JSON.stringify({ at: n, frames: fade }));
    // placeholder frames; assemble.py blends `before` into `after` across them
    fs.writeFileSync(path.join(OUT, `before-${n}.jpg`), before);
    for (let i = 0; i < fade; i++) { fs.writeFileSync(path.join(OUT, String(n++).padStart(4, '0') + '.jpg'), after); }
    last = after;
  };

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // The page renders twice (a bot check, then the app); wait for the second, settled render.
  await page.waitForFunction(() => [...document.querySelectorAll('h1,h2,h3')].some(h => h.innerText.trim() === 'Wheel Visualizer') && document.querySelector('button[aria-label="opens color selector"]'), null, { timeout: 120000 });
  let car = await carReady(null, 90000); await settle(); await prep(); car = await carReady(null);
  await pose(cur.x, cur.y);
  await hold(8);
  // Red Mist
  const paint = await center('button[aria-label="opens color selector"]'); await move(paint.x, paint.y, 8);
  await click(() => page.mouse.click(paint.x, paint.y), 3, () => page.waitForSelector('li:has-text("Red Mist")', { timeout: 10000 }).then(() => page.waitForTimeout(300))); await hold(2);
  const red = await center('li', 'Red Mist'); await move(red.x, red.y, 6);
  await click(() => page.mouse.click(red.x, red.y), 4, async () => { car = await carReady(car); }); await hold(6);
  // Flip through finishes, then pick one
  let t = await thumbs();
  for (const i of [1, 2, 4]) { t = await thumbs(); await move(t[i].x, t[i].y, 4); await click(() => page.mouse.click(t[i].x, t[i].y), 3, async () => { car = await carReady(car); }); await hold(2); }
  t = await thumbs(); const pick = t[t.length - 1]; await move(pick.x, pick.y, 6);
  await click(() => page.mouse.click(pick.x, pick.y), 3, async () => { car = await carReady(car); }); await hold(8);
  // The RFX17 product tile: change its finish, then View On Vehicle
  const tile = await page.evaluate(() => { const a = [...document.querySelectorAll('a.textBox')].find(x => /RFX17/.test(x.innerText)); let c = a; while (c && !([...c.querySelectorAll('button')].some(b => b.innerText.trim() === 'View On Vehicle'))) c = c.parentElement;
    const top = a.getBoundingClientRect().top + scrollY; return { scroll: Math.round(top - 117) }; });
  const tileCtrls = () => page.evaluate(() => { const a = [...document.querySelectorAll('a.textBox')].find(x => /RFX17/.test(x.innerText)); let c = a; while (c && !([...c.querySelectorAll('button')].some(b => b.innerText.trim() === 'View On Vehicle'))) c = c.parentElement;
    const C = e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) }; };
    const sw = [...c.querySelectorAll('img')].filter(i => { const b = i.getBoundingClientRect(); return b.width > 20 && b.width < 60; }).sort((p, q) => p.getBoundingClientRect().left - q.getBoundingClientRect().left).map(C);
    const vov = C([...c.querySelectorAll('button')].find(b => b.innerText.trim() === 'View On Vehicle')); return { sw, vov }; });
  const after = await page.evaluate(v => { const r = document.documentElement.scrollHeight; return v; }, tile.scroll);
  const prevScroll = await page.evaluate(() => scrollY);
  await page.evaluate(v => window.scrollTo(0, v), tile.scroll); let ctl = await tileCtrls(); await page.evaluate(v => window.scrollTo(0, v), prevScroll);
  const swatch = ctl.sw[Math.min(2, ctl.sw.length - 1)];
  await scroll(tile.scroll, 18, swatch); await hold(2);
  await click(() => page.mouse.click(swatch.x, swatch.y), 3, () => page.waitForTimeout(1500)); await hold(4);
  ctl = await tileCtrls(); await move(ctl.vov.x, ctl.vov.y, 6); await hold(1);
  await click(() => page.mouse.click(ctl.vov.x, ctl.vov.y), 5, async () => { car = await carReady(car); await page.evaluate(() => window.scrollTo(0, 0)); });
  await hold(12);
  fs.writeFileSync(path.join(OUT, 'count.txt'), String(n));
  console.log('frames', n); await browser.close();
})();
