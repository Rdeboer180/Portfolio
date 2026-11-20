// Headless check of the hero's settled stickers (20 November 2026):
// - the hand-off from the intro to the stylesheet doesn't move them,
// - on every width they sit clear of the copy, the Roles panel, the nav,
//   the screen edge and each other, and nothing scrolls sideways,
// - their offset from the ring depends only on the breakpoint (CSS anchors
//   them, so a resize moves them on the same frame as the portrait).
// usage: npm start, then  node scripts/checks/hero-stickers.cjs [url]
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:3000/';

const geometry = () => {
  const r = (e) => e && e.getBoundingClientRect();
  const hit = (a, b) => a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const ring = r(document.querySelector('.hero__intro-ring'));
  const copy = r(document.querySelector('.hero-intro__copy'));
  const pe = document.querySelector('.hero-intro__roles');
  const panel = pe && getComputedStyle(pe).display !== 'none' ? r(pe) : null;
  const nav = r(document.querySelector('.hero__nav'));
  const st = [...document.querySelectorAll('.hero-bubbles__word--sticker')].map((e) => ({ t: e.textContent, b: r(e) }));
  const W = innerWidth;
  return {
    W,
    anchored: !!document.querySelector('.hero-bubbles--anchored'),
    ring: { x: (ring.left + ring.right) / 2, y: (ring.top + ring.bottom) / 2 },
    centres: st.map((s) => [Math.round((s.b.left + s.b.right) / 2), Math.round((s.b.top + s.b.bottom) / 2)]),
    offscreen: st.filter((s) => s.b.left < 0 || s.b.right > W).map((s) => s.t),
    underNav: st.filter((s) => s.b.top < nav.bottom - 2).map((s) => s.t),
    onCopy: W >= 1024 ? st.filter((s) => hit(s.b, copy)).map((s) => s.t) : [],
    onPanel: panel ? st.filter((s) => hit(s.b, panel)).map((s) => s.t) : [],
    overlap: st.some((a, i) => st.some((b, j) => i < j && hit(a.b, b.b))),
    hscroll: document.documentElement.scrollWidth > W,
  };
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });

  // 1. the hand-off: last frame before the stylesheet takes over vs the first after
  const handoff = await page.evaluate(() => new Promise((res) => {
    const pos = () => [...document.querySelectorAll('.hero-bubbles__word--sticker')].map((e) => { const b = e.getBoundingClientRect(); return [(b.left + b.right) / 2, (b.top + b.bottom) / 2]; });
    let before = null; const t0 = performance.now();
    const tick = () => {
      if (!document.querySelector('.hero-bubbles--anchored')) before = pos();
      else { const after = pos(); return res({ ms: Math.round(performance.now() - t0), supports: CSS.supports('position-anchor: --hero-ring'), jump: before ? before.map((p, i) => Math.round(Math.hypot(p[0] - after[i][0], p[1] - after[i][1]) * 10) / 10) : null }); }
      if (performance.now() - t0 < 9000) requestAnimationFrame(tick); else res({ timeout: true });
    };
    tick();
  }));
  console.log('handoff', JSON.stringify(handoff));
  await page.waitForTimeout(600);

  // 2. resize: are the stickers in step with the ring on the very next frame?
  const widths = [1920, 1440, 1280, 1180, 1100, 1024, 900, 768, 600, 414, 375, 320];
  let prev = await page.evaluate(geometry);
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: w < 768 ? 812 : 900 });
    const now = await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => res(null))).then(() => null));
    const g = await page.evaluate(geometry);
    // offsets from the ring centre should depend only on the breakpoint, never lag
    const offs = g.centres.map((c) => [Math.round(c[0] - g.ring.x), Math.round(c[1] - g.ring.y)]);
    const bad = [g.offscreen.length && `offscreen ${g.offscreen}`, g.underNav.length && `under nav ${g.underNav}`, g.onCopy.length && `on copy ${g.onCopy}`, g.onPanel.length && `on panel ${g.onPanel}`, g.overlap && 'overlap', g.hscroll && 'h-scroll'].filter(Boolean);
    console.log(String(w).padStart(4), g.anchored ? 'css ' : 'js  ', bad.length ? 'FAIL ' + bad.join('; ') : 'ok', JSON.stringify(offs));
    prev = g;
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
