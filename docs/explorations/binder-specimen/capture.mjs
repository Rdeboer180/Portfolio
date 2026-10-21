// Matched stills and motion for the binder specimen.
//
//   node docs/explorations/binder-specimen/capture.mjs [baseUrl]
//
// Expects the static server from .claude/launch.json ("binder-specimen",
// python3 -m http.server 3100 at the repo root). Clears ./captures, then
// writes JPEG stills (both desktop pages with the spine, a filtered page, the
// reflection in two places, the spine and a ring up close, every card, held
// frames of a page turning both ways, the proofs, hover, held frames of the
// open sequence in each panel layout, the live opens and a study's own media,
// the locked stand-in, tablet, phone with its gatefold and reduced motion)
// and three recordings of the live sequence. It prints the behaviour checks
// as it goes.
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'captures');
await mkdir(out, { recursive: true });
for (const f of await readdir(out)) if (/\.(jpe?g|png|webm|mp4)$/.test(f)) await rm(join(out, f));
const base = process.argv[2] ?? 'http://127.0.0.1:3100/docs/explorations/binder-specimen/';

// The GPU flags let headless Chromium composite on the Mac's GPU, as a real
// browser does. Without them it renders in software, the moving light drops
// to about 28fps and the heroes paint seconds late in the recordings.
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const errors = [];
const jpeg = (name) => ({ path: join(out, `${name}.jpg`), type: 'jpeg', quality: 86 });
const viewport = async (page, name) => { await page.screenshot(jpeg(name)); console.log('wrote', name); };
const element = async (page, sel, name) => { await page.locator(sel).first().screenshot(jpeg(name)); console.log('wrote', name); };
const settle = (page, ms = 900) => page.waitForTimeout(ms);
const check = (label, value) => console.log(`  check · ${label}:`, typeof value === 'string' ? value : JSON.stringify(value));
const images = (page) => page.evaluate(async () => {
  // decoded, not just loaded: a busy renderer can hold back an async decode
  const imgs = [...document.querySelectorAll('.pocket:not([hidden]) img')];
  await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
});
const newPage = async (opts) => {
  const page = await browser.newPage(opts);
  page.on('pageerror', (e) => errors.push(e.message));
  return page;
};
const open = async (page, { fixLight = true } = {}) => {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Stills hold the reflection still, so two captures of the same frame match.
  if (fixLight) await page.check('#tLight');
  await images(page);
  await settle(page, 300);
};
const toBinder = (page, above = 12) => page.evaluate((a) => window.scrollTo(0, document.querySelector('.binder').getBoundingClientRect().top + window.scrollY - a), above);
const choose = async (page, slug) => {
  const i = await page.evaluate((s) => window.BINDER_CARDS.findIndex((c) => c.slug === s), slug);
  await page.selectOption('#pick', String(i));
  await images(page);
};
const layoutTo = (page, mode) => page.selectOption('#layout', mode);
const card = (slug) => `.pocket[data-slug="${slug}"] .card`;
const pose = (page, at) => page.evaluate((p) => window.binder.applyPose(p), String(at));
const state = (page) => page.evaluate(() => window.binder.state);
// waits for the sequence to finish rather than guessing its length, then lets it settle
const until = async (page, want) => { await page.waitForFunction((w) => window.binder.state === w, want, { timeout: 15000 }); await settle(page, 250); };
// and for a page that is turning to land
const landed = async (page) => { await page.waitForFunction(() => !window.binder.turning, null, { timeout: 15000 }); await settle(page, 250); };
const reflection = (page, x, y) => page.evaluate(([lx, ly]) => window.binder.holdLight(lx, ly), [x, y]);
const shown = (page) => page.$$eval('.pocket:not([hidden])', (els) => els.map((e) => e.dataset.slug || 'empty'));
const focused = (page) => page.evaluate(() => {
  const el = document.activeElement;
  return {
    on: el?.closest('.pocket')?.dataset.slug ?? el?.id ?? el?.tagName ?? null,
    visible: Boolean(el?.matches(':focus-visible')),
    raised: Boolean(el?.closest('.pocket')?.classList.contains('pocket--raised')),
  };
});
// How far inside each sleeve the glare's mask runs, at its nearest and
// farthest edge, in CSS px: half a pixel at every edge, never outside.
const glareInset = (page) => page.evaluate(() => {
  const br = document.querySelector('.binder').getBoundingClientRect();
  const svg = decodeURIComponent(document.querySelector('.binder__glare').style.maskImage);
  const rects = [...svg.matchAll(/M([\d.]+) ([\d.]+)H([\d.]+)A([\d.]+) [\d.]+ 0 0 1 [\d.]+ [\d.]+V([\d.]+)/g)]
    .map((m) => { const r = +m[4]; return { l: +m[1] - r, t: +m[2], r: +m[3] + r, b: +m[5] + r }; });
  const insets = [...document.querySelectorAll('.pocket:not([hidden]), .pocket--empty:not([hidden])')].map((x) => {
    const q = x.getBoundingClientRect();
    const box = { l: q.left - br.left, t: q.top - br.top, r: q.right - br.left, b: q.bottom - br.top };
    const m = rects.reduce((best, c) => (Math.abs(c.l - box.l) + Math.abs(c.t - box.t) < Math.abs(best.l - box.l) + Math.abs(best.t - box.t) ? c : best), rects[0]);
    return [m.l - box.l, m.t - box.t, box.r - m.r, box.b - m.b];
  }).flat();
  return [Math.min(...insets), Math.max(...insets)].map((v) => +v.toFixed(2));
});
// Where the card in flight and what takes over from it cover the same box.
const mismatch = (page, slug, before, after, target) => page.evaluate(([s, a, b, sel]) => {
  window.binder.applyPose(String(a));
  const r1 = document.querySelector(`.pocket[data-slug="${s}"] .card`).getBoundingClientRect();
  window.binder.applyPose(String(b));
  const el = document.querySelector(sel);
  const r = el.getBoundingClientRect();
  const m = getComputedStyle(el).clipPath.match(/inset\(([-\d.]+)px ([-\d.]+)px ([-\d.]+)px ([-\d.]+)px/);
  const [t, rt, bt, l] = m ? m.slice(1).map(Number) : [0, 0, 0, 0];
  const r2 = { left: r.left + l, top: r.top + t, right: r.right - rt, bottom: r.bottom - bt };
  return Math.max(...['left', 'top', 'right', 'bottom'].map((k) => Math.abs(r1[k] - r2[k]))).toFixed(2);
}, [slug, before, after, target]);

// ---------- desktop ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await open(page);

  for (const n of [1, 2]) {
    if (n === 2) { await page.click('#pgNext'); await landed(page); await images(page); await settle(page, 300); }
    await element(page, '.binder', `desktop-page-${n}`);
    for (const slug of (await shown(page)).filter((s) => s !== 'empty')) {
      const index = await page.evaluate((s) => window.BINDER_CARDS.find((c) => c.slug === s).index, slug);
      await element(page, `.pocket[data-slug="${slug}"]`, `card-${index}-${slug}`);
    }
  }
  await page.click('#pgPrev'); await landed(page); await images(page);

  // a page turning on its rings, held: forward, then back
  await toBinder(page, 60);
  for (const [step, list] of [[1, [[0.2, 'lifting'], [0.45, 'over-the-rings'], [0.62, 'falling-away']]], [-1, [[0.45, 'coming-back'], [0.8, 'landing']]]]) {
    await page.evaluate((x) => window.binder.holdTurn(x, 0), step);
    for (const [at, name] of list) {
      await page.evaluate((a) => window.binder.seekTurn(a), at); await settle(page, 200);
      await viewport(page, `desktop-turn-${step > 0 ? 'next' : 'back'}-${String(Math.round(at * 100)).padStart(3, '0')}-${name}`);
    }
    await page.evaluate(() => window.binder.endTurn());
  }
  check('page after a turn forward and back', await page.$eval('#pgCount', (e) => e.textContent));

  // the spine's tabs file the work by discipline; a short page keeps its pockets
  await page.click('.spine__tab[data-filter="aem"]'); await images(page); await settle(page, 300);
  await element(page, '.binder', 'desktop-tab-aem');
  check('AEM tab shows', await shown(page));
  await page.selectOption('#pick', await page.evaluate(() => String(window.BINDER_CARDS.findIndex((c) => c.slug === 'playdraft'))));
  check('picking PlayDraft from the AEM tab returns to', await page.$eval('.spine__tab[aria-pressed="true"]', (e) => e.dataset.filter));
  check('and shows', await shown(page));
  await page.click('.spine__tab[data-filter="all"]'); await images(page);

  // one lamp: the same page with its reflection moved
  for (const [name, x, y] of [['top-left', 0.14, 0.18], ['bottom-right', 0.84, 0.74]]) {
    await reflection(page, x, y); await settle(page, 250);
    await element(page, '.binder', `desktop-page-1-reflection-${name}`);
  }
  await reflection(page, 0.5, 0.4); await settle(page, 250);

  // the glare keeps to the sleeves: the reflection parked over the spine
  await reflection(page, 0.08, 0.3); await settle(page, 250);
  await element(page, '.binder', 'desktop-spine-clear-of-glare');
  check('desktop: the glare inside each sleeve by, px (nearest, farthest edge)', await glareInset(page));
  await reflection(page, 0.5, 0.4); await settle(page, 250);

  // the spine and a ring up close: the stitched cover, the steel plate, a
  // ring's collar, loop, seam and punched hole
  await toBinder(page);
  await element(page, '.binder__spine', 'desktop-spine');
  const ring = await page.locator('.ring').nth(1).boundingBox();
  await page.screenshot({ ...jpeg('desktop-ring'), clip: { x: ring.x - 30, y: ring.y - 30, width: ring.width + 90, height: ring.height + 60 } });
  console.log('wrote', 'desktop-ring');

  // plain silver, for comparison with the holo themes
  await page.uncheck('#tHolo'); await settle(page, 300);
  await element(page, '.binder', 'desktop-page-1-silver');
  await page.check('#tHolo'); await settle(page, 300);

  // proof toggles
  await page.check('#tSleeve'); await settle(page, 400);
  await element(page, '.binder', 'desktop-proof-no-sleeve');
  await page.uncheck('#tSleeve');
  await page.check('#tExplode'); await settle(page, 900);
  await element(page, '.binder', 'desktop-proof-exploded');
  await page.uncheck('#tExplode'); await settle(page, 900);

  // hover: a card slips 15% out of its sleeve, over its neighbour's plastic
  await toBinder(page);
  await page.hover(card('loopstack')); await settle(page, 700);
  await element(page, '.binder', 'desktop-hover-loopstack');
  check('raised on hover', await page.$$eval('.pocket--raised', (els) => els.map((e) => e.dataset.slug)));
  await page.mouse.move(4, 4); await settle(page, 700);
  check('raised after the pointer leaves', await page.$$eval('.pocket--raised', (els) => els.length));

  // held frames of the open sequence on PlayDraft, with room above the top
  // row so the raised card is not cut off by the window
  await choose(page, 'playdraft');
  const frames = {
    beside: [[0.07, 'lifting'], [0.2, 'leaving'], [0.26, 'turned'], [0.41, 'arriving'], [0.5, 'tucking-in'], [0.6, 'insert-out'],
      [0.66, 'first-panel'], [0.74, 'second-panel'], [0.82, 'flat'], [1, 'open']],
    intro: [[0.6, 'arriving'], [0.67, 'tucking-in'], [0.84, 'intro-up'], [1, 'open']],
    video: [[0.66, 'landing'], [0.74, 'unfolding'], [1, 'open']],
  };
  for (const [mode, list] of Object.entries(frames)) {
    await layoutTo(page, mode);
    await toBinder(page, 96);
    for (const [at, name] of list) {
      await pose(page, at); await settle(page, 250);
      await viewport(page, `desktop-${mode}-${String(Math.round(at * 100)).padStart(3, '0')}-${name}`);
    }
    check(`${mode}: card and what takes over meet within, px`, mode === 'video'
      ? await mismatch(page, 'playdraft', 0.6895, 0.6912, '.fo-frame')
      : await mismatch(page, 'playdraft', 1, 1, '.fo-insert__card'));
    if (mode === 'beside') {
      check('beside: the flat insert covers the video within, px', await page.evaluate(() => {
        window.binder.applyPose('1');
        const f = document.querySelector('.fo-fold').getBoundingClientRect(), v = document.querySelector('.fo-frame').getBoundingClientRect();
        return Math.max(...['left', 'top', 'right', 'bottom'].map((k) => Math.abs(f[k] - v[k]))).toFixed(2);
      }));
    }
    await page.keyboard.press('Escape'); await settle(page, 300);
  }
  check('state after Esc on a held frame', await state(page));

  // the live sequence: PlayDraft beside its video, opened with the pointer
  await layoutTo(page, 'beside');
  await toBinder(page, 96);
  await page.hover(card('playdraft')); await settle(page, 500);
  await page.click(card('playdraft')); await until(page, 'open');
  await viewport(page, 'desktop-live-beside-playdraft');
  check('state after the open', await state(page));
  check('focus after the open', (await focused(page)).on);
  check('card seated in the panel sleeve', await page.evaluate(() => Boolean(document.querySelector('.fo-insert__card.is-seated'))));
  check('intro video playing', await page.evaluate(() => { const v = document.querySelector('.fo-frame video'); return Boolean(v && !v.paused); }));
  check('page behind is inert', await page.evaluate(() => document.querySelector('.binder').inert));
  // the study's own media, laid out as on the live site
  const media = await page.evaluate(async () => {
    const a = document.querySelector('.fo-article');
    for (let y = 0; y < a.scrollHeight; y += 400) { a.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    const imgs = [...a.querySelectorAll('.fo-body img')];
    await Promise.all(imgs.map((m) => m.decode().catch(() => {})));
    const top = document.getElementById('fo-decisions-title');
    a.scrollTo(0, top.getBoundingClientRect().top - a.getBoundingClientRect().top + a.scrollTop - 16);
    return { images: imgs.length, loops: a.querySelectorAll('.fo-body video').length, broken: imgs.filter((m) => !m.naturalWidth).length };
  });
  check('PlayDraft study media (images, loops, broken)', media);
  await settle(page, 400);
  await viewport(page, 'desktop-live-playdraft-decisions');
  await page.click('#foClose'); await until(page, 'seated');
  check('after a pointer close (focus, focus ring, raised)', await focused(page));

  // LoopStack, opened from the keyboard, with the card beside its intro
  await layoutTo(page, 'intro');
  await page.focus(card('loopstack'));
  await page.keyboard.press('Enter'); await until(page, 'open');
  await viewport(page, 'desktop-live-intro-loopstack');
  await page.keyboard.press('Escape'); await until(page, 'seated');
  check('after Esc (focus, focus ring, raised)', await focused(page));
  await layoutTo(page, 'beside');

  // a locked card stops at the stand-in and stays in its sleeve
  await choose(page, 'wheelrack');
  await toBinder(page);
  await page.click(card('wheelrack')); await settle(page, 600);
  await viewport(page, 'desktop-locked-challenge');
  check('locked prompt: focus starts on', await page.evaluate(() => document.activeElement?.id));
  // the ask and the password form each have an Unlock; only one may show at a time
  const unlocksShown = () => page.evaluate(() => [...document.querySelectorAll('#lockDialog button')]
    .filter((b) => b.textContent.trim() === 'Unlock' && b.getClientRects().length).length);
  check('locked prompt: Unlock buttons shown', await unlocksShown());
  const lockedOut = await page.evaluate(() => {
    const p = document.querySelector('.pocket[data-slug="wheelrack"]');
    return p.classList.contains('is-flying') || p.classList.contains('is-open') || window.binder.state !== 'seated';
  });
  await page.click('#lockUnlock'); await settle(page, 200);
  check('after Unlock, focus is on', await page.evaluate(() => document.activeElement?.id));
  check('after Unlock, Unlock buttons shown', await unlocksShown());
  await page.keyboard.type('anything'); await page.keyboard.press('Enter'); await settle(page, 200);
  await viewport(page, 'desktop-locked-password');
  check('after a password, the preview note shows', await page.evaluate(() => !document.getElementById('lockNote').hidden));
  await page.click('#lockBack'); await settle(page, 150);
  await page.click('#lockKeep'); await settle(page, 300);
  check('locked card left its sleeve', lockedOut);
  check('focus after Keep it in the sleeve', (await focused(page)).on);
  // the site's shared password (the one the résumé page prints) opens the
  // gate: the card flips into its study, the lock pills go, the backs that
  // waited unloaded load, and the unlock is kept under the site's own key
  await page.click(card('wheelrack')); await settle(page, 600);
  await page.click('#lockUnlock'); await settle(page, 150);
  await page.keyboard.type('#showWork'); await page.keyboard.press('Enter');
  await until(page, 'open');
  check('shared password: state after Enter', await state(page));
  check('shared password: lock pills shown, backs unloaded, site key kept', await page.evaluate(() => ({
    pills: [...document.querySelectorAll('.cf-lock')].filter((e) => e.getClientRects().length).length,
    unloaded: document.querySelectorAll('.face--back img[data-src]').length,
    key: localStorage.getItem('rd-unlocked'),
  })));
  check('shared password: WheelRack study media (images, loops, broken)', await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.fo-body img')];
    return { images: imgs.length, loops: document.querySelectorAll('.fo-body video').length, broken: imgs.filter((m) => m.complete && !m.naturalWidth).length };
  }));
  await viewport(page, 'desktop-unlocked-wheelrack');
  await page.keyboard.press('Escape'); await until(page, 'seated');
  await page.evaluate(() => window.binder.unlock(false));
  check('relocked: lock pills shown, site key', await page.evaluate(() => ({ pills: [...document.querySelectorAll('.cf-lock')].filter((e) => e.getClientRects().length).length, key: localStorage.getItem('rd-unlocked') })));
  await page.close();
}

// ---------- open on the homepage (a mock) ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto(`${base}?open`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.check('#tLight');
  await images(page);
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.home-hero').getBoundingClientRect().top + scrollY));
  await settle(page, 300);
  await viewport(page, 'desktop-open-homepage');
  await toBinder(page, 30); await settle(page, 300);
  await viewport(page, 'desktop-open-binder');
  check('open: binder left edge, first card, sideways scroll', await page.evaluate(() => ({
    binder: Math.round(document.querySelector('.binder').getBoundingClientRect().left),
    card: Math.round(document.querySelector('.pocket:not([hidden])').getBoundingClientRect().left),
    scrollsSideways: document.documentElement.scrollWidth > innerWidth,
  })));
  await page.click('#pgNext'); await landed(page);
  check('open: page after a turn', await page.$eval('#pgCount', (e) => e.textContent));
  await page.close();
}

// ---------- recordings ----------
const record = async (name, script) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page, { fixLight: false });
  await script(page);
  const video = page.video();
  await context.close();
  const webm = join(out, `${name}.webm`);
  await rename(await video.path(), webm);
  const mp4 = join(out, `${name}.mp4`);
  const run = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', mp4]);
  if (run.status === 0) { await rm(webm); console.log('wrote', `${name}.mp4`); } else console.log('wrote', `${name}.webm`, '(ffmpeg unavailable, kept WebM)');
};
const centre = async (page, sel) => {
  const r = await page.locator(sel).boundingBox();
  return [r.x + r.width / 2, r.y + r.height / 2];
};
const openAndClose = async (page, slug, holdMs, close = 'button') => {
  const [x, y] = await centre(page, `.pocket[data-slug="${slug}"]`);
  await page.mouse.move(x, y, { steps: 25 });
  await settle(page, 700);
  await page.mouse.click(x, y);
  await settle(page, holdMs);
  if (close === 'button') await page.click('#foClose'); else await page.keyboard.press('Escape');
};
await record('desktop-motion', async (page) => {
  await toBinder(page, 120);
  // the pointer tilts the page: the reflection crosses the binder the other way
  const [ax, ay] = await centre(page, '.pocket[data-slug="wheelrack"]');
  const [bx, by] = await centre(page, '.pocket[data-slug="design-enablement"]');
  await page.mouse.move(ax, ay, { steps: 1 });
  await settle(page, 600);
  await page.mouse.move(bx, by, { steps: 60 });
  await settle(page, 600);
  // a page turns on its rings, and back
  await toBinder(page, 120);
  const [nx, ny] = await centre(page, '#pgNext');
  await page.mouse.move(nx, ny, { steps: 20 }); await page.mouse.click(nx, ny); await settle(page, 1500);
  const [px, py] = await centre(page, '#pgPrev');
  await page.mouse.move(px, py, { steps: 12 }); await page.mouse.click(px, py); await settle(page, 1500);
  await toBinder(page, 120);
  // the spine files the work by discipline
  const [tx, ty] = await centre(page, '.spine__tab[data-filter="aem"]');
  await page.mouse.move(tx, ty, { steps: 20 }); await page.mouse.click(tx, ty); await settle(page, 1300);
  const [ux, uy] = await centre(page, '.spine__tab[data-filter="all"]');
  await page.mouse.move(ux, uy, { steps: 12 }); await page.mouse.click(ux, uy); await settle(page, 900);
  // card in a sleeve beside the video
  await openAndClose(page, 'playdraft', 3600);
  await settle(page, 2300);
  // card beside the intro, video below
  await layoutTo(page, 'intro');
  await toBinder(page, 120);
  await openAndClose(page, 'loopstack', 2800, 'escape');
  await settle(page, 1900);
});
for (const mode of ['beside', 'intro']) {
  await record(`desktop-motion-slow-${mode}`, async (page) => {
    await page.check('#tSlow');   // before the scroll: ticking it scrolls the bench into view
    await layoutTo(page, mode);
    await toBinder(page, 120);
    await openAndClose(page, 'playdraft', mode === 'beside' ? 9600 : 6600);
    await settle(page, mode === 'beside' ? 7400 : 5400);
  });
}

// ---------- tablet ----------
{
  const page = await newPage({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 });
  await open(page);
  await element(page, '.binder', 'tablet-page-1');
  await page.close();
}

// ---------- phone ----------
for (const mode of ['beside', 'intro']) {
  const page = await newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await open(page);
  await layoutTo(page, mode);
  if (mode === 'beside') {
    await element(page, '.binder', 'phone-page-1');
    check('phone: the glare inside each sleeve by, px (nearest, farthest edge)', await glareInset(page));
    // held: on a phone the card turns over in flight, slowly, and lands flush
    // left on the video, its back the left of the video's first frame; two
    // panels folded behind it unroll the frame to the right in turn, the
    // video takes over, and the card is filed as a chip
    await choose(page, 'playdraft');
    await toBinder(page, 200);
    for (const [at, name] of [[0.4, 'turning'], [0.6115, 'landed'], [0.69, 'first-panel'], [0.84, 'second-panel'], [1, 'open']]) {
      await pose(page, at); await settle(page, 250);
      await viewport(page, `phone-beside-${String(Math.round(at * 100)).padStart(3, '0')}-${name}`);
    }
    check('phone: the panel runs as', await page.evaluate(() => ({ video: !document.querySelector('.fo-hero--beside'), insert: Boolean(document.querySelector('.fo-insert')), chip: document.querySelector('.fo-chip')?.textContent.trim() ?? null })));
    check('phone: the card and the middle panel it lands as meet within, px', await mismatch(page, 'playdraft', 0.611, 0.6135, '.fo-gate__mid'));
    check('phone: the landed card sits flush left with the title, px', await page.evaluate(() => {
      window.binder.applyPose('0.62');
      return Math.abs(document.querySelector('.fo-gate__mid').getBoundingClientRect().left - document.getElementById('foTitle').getBoundingClientRect().left).toFixed(2);
    }));
    check('phone: the flat gate covers the video within, px', await page.evaluate(() => {
      window.binder.applyPose('0.92');
      const v = document.querySelector('.fo-frame').getBoundingClientRect();
      const parts = [...document.querySelectorAll('.fo-gate__mid, .fo-gate__flap')].map((e) => e.getBoundingClientRect());
      const u = { left: Math.min(...parts.map((r) => r.left)), top: Math.min(...parts.map((r) => r.top)), right: Math.max(...parts.map((r) => r.right)), bottom: Math.max(...parts.map((r) => r.bottom)) };
      return Math.max(...['left', 'top', 'right', 'bottom'].map((k) => Math.abs(u[k] - v[k]))).toFixed(2);
    }));
    await page.evaluate(() => window.binder.applyPose('live')); await settle(page, 200);
  }
  await toBinder(page, 200);
  await page.locator(card('playdraft')).tap(); await until(page, 'open');
  await viewport(page, `phone-live-${mode}`);
  check(`phone ${mode}, state after a tap`, await state(page));
  await page.locator('#foClose').tap(); await until(page, 'seated');
  check(`phone ${mode}, state after Close`, await state(page));
  if (mode === 'beside') {
    await toBinder(page, 200);
    await page.locator(card('playdraft')).tap(); await until(page, 'open');
    await page.locator('.fo-chip').tap(); await until(page, 'seated');
    check('phone: the chip puts the card back (state, focus)', { state: await state(page), on: await page.evaluate(() => document.activeElement?.closest('.pocket')?.dataset.slug) });
  }
  if (mode === 'beside') {
    // a sideways drag turns the page under the finger; let go short and it
    // falls back; a vertical drag still scrolls; none of them opens a card
    const cdp = await page.context().newCDPSession(page);
    const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
    const drag = async ([x0, y0], [x1, y1], ms) => {
      const steps = Math.max(4, Math.round(ms / 16));
      await touch('touchStart', x0, y0);
      for (let i = 1; i <= steps; i++) { await touch('touchMove', x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps); await page.waitForTimeout(ms / steps); }
      await touch('touchEnd');
      await settle(page, 60); await landed(page);
    };
    await toBinder(page, 12); await settle(page, 300);
    const g = await page.evaluate(() => { const r = document.querySelector('.pockets').getBoundingClientRect(); return { l: r.left, r: r.right, y: r.top + 150 }; });
    const where = () => page.evaluate(() => ({ page: document.getElementById('pgCount').textContent, state: window.binder.state, y: Math.round(scrollY) }));
    await drag([g.r - 30, g.y], [g.l + 20, g.y], 420);
    check('phone: after a drag right to left', await where());
    // back only from the left 35% of the screen (the spine and the cards
    // nearest it); to the right from further across, nothing
    const zone = await page.evaluate(() => innerWidth * .35);
    await drag([zone + 16, g.y], [g.r - 10, g.y], 420);
    check('phone: after a drag left to right from past the back zone (no turn)', await where());
    await drag([g.l - 24, g.y], [g.l + 40, g.y], 200);
    check('phone: after a short drag from the spine, falling back', await where());
    await drag([zone - 16, g.y], [g.r - 10, g.y], 420);
    check('phone: after a full drag from the cards inside the back zone', await where());
    await drag([g.r - 30, g.y], [g.l + 20, g.y], 420);
    await drag([g.l - 24, g.y], [g.r - 20, g.y], 420);
    check('phone: after a drag forward, then a full drag back from the spine', await where());
    await drag([(g.l + g.r) / 2, g.y + 120], [(g.l + g.r) / 2 + 6, g.y - 120], 300);
    check('phone: after a drag upward (scrolls, no turn)', await where());
    for (let n = 0; n < 3; n++) { await page.locator('#pgNext').tap(); await images(page); }
    await landed(page);
    await settle(page, 300);
    await element(page, '.binder', 'phone-page-4');
  }
  await page.close();
}

// ---------- reduced motion, from the keyboard ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await open(page, { fixLight: false });
  await toBinder(page);
  await page.focus(card('playdraft'));
  const t0 = Date.now();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => window.binder.state === 'open');
  check('reduced motion, ms from Enter to open (painting included)', Date.now() - t0);
  await viewport(page, 'desktop-reduced-motion-open');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.binder.state === 'seated');
  check('reduced motion, after Esc (focus, focus ring, raised)', await focused(page));
  await element(page, '.binder', 'desktop-reduced-motion-closed');
  await page.close();
}

check('page errors', errors);
await browser.close();
