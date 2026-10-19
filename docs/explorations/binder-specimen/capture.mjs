// Matched stills for the binder specimen.
//
//   node docs/explorations/binder-specimen/capture.mjs [baseUrl]
//
// Expects the static server from .claude/launch.json ("binder-specimen",
// python3 -m http.server 3100 at the repo root). Writes 2x JPEGs into
// ./captures: the seated page at desktop and phone widths, a close crop
// of the card and of an empty sleeve, every paused frame, the two proof
// toggles, and the live sequence at rest after each step.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'captures');
await mkdir(out, { recursive: true });
const base = process.argv[2] ?? 'http://127.0.0.1:3100/docs/explorations/binder-specimen/';

const browser = await chromium.launch();
const shoot = async (page, name, clip) => {
  await page.screenshot({ path: join(out, `${name}.jpg`), type: 'jpeg', quality: 88, clip, fullPage: !clip });
  console.log('wrote', name);
};
const rect = async (page, sel, pad = 0) => {
  const r = await page.locator(sel).first().boundingBox();
  return { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + pad * 2, height: r.height + pad * 2 };
};
// The light is fixed for stills so two captures of the same frame match.
const fixLight = (page) => page.check('#tLight');
const settle = (page, ms = 900) => page.waitForTimeout(ms);

// ---------- desktop ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await fixLight(page);
  await settle(page, 300);

  await shoot(page, 'desktop-seated', await rect(page, '.binder', 24));
  await shoot(page, 'desktop-card-closeup', await rect(page, '#pocket', 12));
  await shoot(page, 'desktop-empty-sleeve-closeup', await rect(page, '.pocket--empty-a', 12));

  // paused frames
  for (const pose of ['partly', 'clear', 'edge', 'back', 'returning']) {
    await page.click(`#poses button[data-pose="${pose}"]`);
    await settle(page, 200);
    await shoot(page, `desktop-pose-${pose}`, { x: 0, y: 0, width: 1440, height: 1000 });
  }
  await page.click('#poses button[data-pose="seated"]');
  await page.click('#poses button[data-pose="live"]');
  await settle(page, 200);

  // proof toggles
  await page.check('#tSleeve'); await settle(page, 400);
  await shoot(page, 'desktop-proof-no-sleeve', await rect(page, '.binder', 24));
  await page.uncheck('#tSleeve');
  await page.check('#tExplode'); await settle(page, 900);
  await shoot(page, 'desktop-proof-exploded', await rect(page, '.binder', 24));
  await page.uncheck('#tExplode'); await settle(page, 900);

  // the live sequence, at rest after each step
  await page.click('#bInspect'); await settle(page, 1600);
  await shoot(page, 'desktop-live-out-front', { x: 0, y: 0, width: 1440, height: 1000 });
  await page.click('#bTurn'); await settle(page, 1000);
  await shoot(page, 'desktop-live-out-back', { x: 0, y: 0, width: 1440, height: 1000 });
  // a frame mid-turn: edge-on-ish, caught by timing
  await page.click('#bTurn'); await settle(page, 330);
  await shoot(page, 'desktop-live-mid-turn', { x: 0, y: 0, width: 1440, height: 1000 });
  await settle(page, 700);
  await page.click('#bReturn'); await settle(page, 700);
  await shoot(page, 'desktop-live-returning', { x: 0, y: 0, width: 1440, height: 1000 });
  await settle(page, 1400);
  await shoot(page, 'desktop-live-seated-again', await rect(page, '.binder', 24));
  await page.close();
}

// ---------- phone ----------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await fixLight(page);
  await settle(page, 300);
  await page.locator('.binder').scrollIntoViewIfNeeded();
  await shoot(page, 'phone-seated', await rect(page, '.binder', 12));
  await page.locator('#card').tap(); await settle(page, 1600);
  await shoot(page, 'phone-live-out-front', { x: 0, y: 0, width: 390, height: 844 });
  await page.locator('#card').tap(); await settle(page, 1000);
  await shoot(page, 'phone-live-out-back', { x: 0, y: 0, width: 390, height: 844 });
  await page.keyboard.press('Escape'); await settle(page, 2400);
  await shoot(page, 'phone-seated-again', await rect(page, '.binder', 12));
  await page.close();
}

// ---------- reduced motion ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await settle(page, 300);
  await page.focus('#card');
  await page.keyboard.press('Enter'); await settle(page, 150);
  await shoot(page, 'desktop-reduced-motion-out', { x: 0, y: 0, width: 1440, height: 1000 });
  await page.keyboard.press('Space'); await settle(page, 150);
  await shoot(page, 'desktop-reduced-motion-back', { x: 0, y: 0, width: 1440, height: 1000 });
  await page.keyboard.press('Escape'); await settle(page, 300);
  const focused = await page.evaluate(() => document.activeElement?.id);
  console.log('focus after return:', focused);
  await page.close();
}

await browser.close();
