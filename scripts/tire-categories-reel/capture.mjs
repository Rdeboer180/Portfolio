// Capture the live tirerack.com pages the Tire Categories reel is cut from
// (headed Chrome, 1600x900): the Tire Categories & Types page, the
// Performance "Category Performance Averages" modal frame by frame, three
// category pages, and eight sub-category pages. Writes full-size PNGs to the
// folder given; scripts/tire-categories-reel/*.jpg are crops of those.
// Run: node scripts/tire-categories-reel/capture.mjs <out-dir>
import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ headless: false, channel: 'chrome', args: ['--disable-blink-features=AutomationControlled'] });
const p = await (await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })).newPage();
const go = async (path) => { await p.goto('https://www.tirerack.com' + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await p.waitForTimeout(7000);
  for (const sel of ['#onetrust-reject-all-handler', 'button:has-text("Reject All")', '[aria-label="Close"]']) { try { await p.locator(sel).first().click({ timeout: 800 }); } catch {} }
  for (let y = 0; y < 4000; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(250); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); };
// 1. the types page, then the Performance graph modal
await go('/tires/types');
await p.screenshot({ path: `${out}/types-full.png`, fullPage: true });
const link = p.locator('a:has-text("Category Performance Averages")').nth(1);
await link.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -200)); await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/modal/f000.png` });
console.log('modal link at', JSON.stringify(await link.boundingBox()));
await link.click();
for (let i = 1; i <= 24; i++) { await p.waitForTimeout(60); await p.screenshot({ path: `${out}/modal/f${String(i).padStart(3, '0')}.png` }); }
console.log('modal scrollY', await p.evaluate(() => scrollY));
// 2. the three category pages
for (const [name, path] of [['winter', '/tires/snow'], ['allterrain', '/tires/all-terrain'], ['performance', '/tires/summer']]) {
  await go(path); await p.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
}
// 3. child pages for the book: the top of each, through its Tire Features icons
const kids = [['studless', '/tires/snow/studless'], ['winter-perf', '/tires/snow/performance'], ['studdable', '/tires/snow/studdable'], ['at-onroad', '/tires/all-terrain/on-road'], ['at-offroad', '/tires/all-terrain/off-road'], ['mud', '/tires/mud-terrain'], ['rugged', '/tires/rugged-terrain'], ['max-perf', '/tires/summer/max-performance']];
for (const [name, path] of kids) {
  await go(path);
  const feat = await p.evaluate(() => { const h = [...document.querySelectorAll('h2,h3')].find(x => /Features/i.test(x.innerText)); return h ? Math.round(h.getBoundingClientRect().top + scrollY) : null; });
  await p.screenshot({ path: `${out}/kid-${name}.png`, fullPage: true });
  console.log(name, 'features at', feat);
}
await b.close();
