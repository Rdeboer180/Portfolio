// Matched stills for the binder specimen.
//
//   node docs/explorations/binder-specimen/capture.mjs [baseUrl]
//
// Expects the static server from .claude/launch.json ("binder-specimen",
// python3 -m http.server 3100 at the repo root). Clears ./captures, then
// writes JPEGs: both desktop pages, a close crop of every card, the proof
// toggles, the paused frames and live sequence on PlayDraft, the back of
// every public card, the locked-card stand-in, phone and tablet pages, and
// the reduced-motion sequence driven from the keyboard.
import { chromium } from 'playwright';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'captures');
await mkdir(out, { recursive: true });
for (const f of await readdir(out)) if (/\.(jpe?g|png)$/.test(f)) await rm(join(out, f));
const base = process.argv[2] ?? 'http://127.0.0.1:3100/docs/explorations/binder-specimen/';

const browser = await chromium.launch();
const jpeg = (name) => ({ path: join(out, `${name}.jpg`), type: 'jpeg', quality: 86 });
const viewport = async (page, name) => { await page.screenshot(jpeg(name)); console.log('wrote', name); };
const element = async (page, sel, name) => { await page.locator(sel).first().screenshot(jpeg(name)); console.log('wrote', name); };
const settle = (page, ms = 900) => page.waitForTimeout(ms);
const images = (page) => page.evaluate(async () => {
  const imgs = [...document.querySelectorAll('.pocket:not([hidden]) img')];
  await Promise.all(imgs.map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))));
});
const open = async (page, { fixLight = true } = {}) => {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // The light is fixed for stills, so two captures of the same frame match.
  if (fixLight) await page.check('#tLight');
  await images(page);
  await settle(page, 300);
};
const toBinder = (page) => page.evaluate(() => window.scrollTo(0, document.querySelector('.binder').getBoundingClientRect().top + window.scrollY - 12));
const choose = async (page, slug) => {
  const i = await page.evaluate((s) => window.BINDER_CARDS.findIndex((c) => c.slug === s), slug);
  await page.selectOption('#pick', String(i));
  await images(page);
};
// Panel buttons can sit under a posed card, so they are pressed in script.
const press = (page, sel) => page.$eval(sel, (el) => el.click());
const card = (slug) => `.pocket[data-slug="${slug}"] .card`;
const visibleSlugs = (page) => page.$$eval('.pocket:not([hidden])', (els) => els.map((e) => e.dataset.slug));
const focusedSlug = (page) => page.evaluate(() => document.activeElement?.closest('.pocket')?.dataset.slug ?? document.activeElement?.id ?? null);

// ---------- desktop ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await open(page);

  for (const n of [1, 2]) {
    if (n === 2) { await page.click('#pgNext'); await images(page); await settle(page, 300); }
    await element(page, '.binder', `desktop-page-${n}`);
    for (const slug of await visibleSlugs(page)) {
      const index = await page.evaluate((s) => window.BINDER_CARDS.find((c) => c.slug === s).index, slug);
      await element(page, `.pocket[data-slug="${slug}"]`, `card-${index}-${slug}`);
    }
  }
  await page.click('#pgPrev'); await images(page);

  // proof toggles on page 1
  await page.check('#tSleeve'); await settle(page, 400);
  await element(page, '.binder', 'desktop-proof-no-sleeve');
  await page.uncheck('#tSleeve');
  await page.check('#tExplode'); await settle(page, 900);
  await element(page, '.binder', 'desktop-proof-exploded');
  await page.uncheck('#tExplode'); await settle(page, 900);

  // paused frames on PlayDraft
  await choose(page, 'playdraft');
  await toBinder(page);
  for (const pose of ['partly', 'clear', 'edge', 'back', 'returning']) {
    await press(page, `#poses button[data-pose="${pose}"]`);
    await settle(page, 250);
    await viewport(page, `desktop-pose-${pose}`);
  }
  await press(page, '#poses button[data-pose="seated"]');
  await press(page, '#poses button[data-pose="live"]');
  await settle(page, 200);

  // the live sequence on PlayDraft, at rest after each step
  await toBinder(page);
  await page.click(card('playdraft')); await settle(page, 1600);
  await viewport(page, 'desktop-live-out-front');
  console.log('  focus after pull:', await focusedSlug(page));
  await page.click('#ibTurn'); await settle(page, 1000);
  await viewport(page, 'desktop-live-out-back');
  await page.click('#ibTurn'); await settle(page, 330);
  await viewport(page, 'desktop-live-mid-turn');
  await settle(page, 700);
  await page.click('#ibReturn'); await settle(page, 700);
  await viewport(page, 'desktop-live-returning');
  await settle(page, 1500);
  await element(page, '.binder', 'desktop-live-seated-again');
  console.log('  focus after return:', await focusedSlug(page));

  // the back of every other public card
  for (const slug of ['loopstack', 'bolus-binder', 'overscroll-tactics', 'heatherwood']) {
    await choose(page, slug);
    await toBinder(page);
    await page.click(card(slug)); await settle(page, 1600);
    await page.click('#ibTurn'); await settle(page, 1000);
    await viewport(page, `desktop-back-${slug}`);
    await page.keyboard.press('Escape'); await settle(page, 2600);
  }

  // a locked card stops at the stand-in and stays in its sleeve
  await choose(page, 'wheelrack');
  await toBinder(page);
  await page.click(card('wheelrack')); await settle(page, 600);
  await viewport(page, 'desktop-locked-challenge');
  const lockedOut = await page.evaluate(() => document.querySelector('.pocket[data-slug="wheelrack"] .card').classList.contains('card--free'));
  await page.click('#lockDialog button'); await settle(page, 300);
  console.log('  locked card left its sleeve:', lockedOut, '| focus after close:', await focusedSlug(page));
  await page.close();
}

// ---------- tablet ----------
{
  const page = await browser.newPage({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 });
  await open(page);
  await element(page, '.binder', 'tablet-page-1');
  await page.close();
}

// ---------- phone ----------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await open(page);
  await element(page, '.binder', 'phone-page-1');
  await toBinder(page);
  await page.locator(card('playdraft')).tap(); await settle(page, 1600);
  await viewport(page, 'phone-live-out-front');
  await page.locator('#ibTurn').tap(); await settle(page, 1000);
  await viewport(page, 'phone-live-out-back');
  await page.locator('#ibReturn').tap(); await settle(page, 2600);
  for (let n = 0; n < 3; n++) { await page.locator('#pgNext').tap(); await images(page); }
  await settle(page, 300);
  await element(page, '.binder', 'phone-page-4');
  await page.close();
}

// ---------- reduced motion, from the keyboard ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await open(page, { fixLight: false });
  await toBinder(page);
  await page.focus(card('playdraft'));
  await page.keyboard.press('Enter'); await settle(page, 200);
  await viewport(page, 'desktop-reduced-motion-out');
  await page.keyboard.press('Space'); await settle(page, 200);
  await viewport(page, 'desktop-reduced-motion-back');
  await page.keyboard.press('Escape'); await settle(page, 300);
  console.log('  reduced motion, focus after return:', await focusedSlug(page));
  await page.close();
}

await browser.close();
