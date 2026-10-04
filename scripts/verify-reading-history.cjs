// Run against an active preview: READING_TEST_ORIGIN=http://localhost:3011 node scripts/verify-reading-history.cjs
const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const origin = process.env.READING_TEST_ORIGIN || 'http://127.0.0.1:3011';

async function verify(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/notes/`, { waitUntil: 'domcontentloaded' });
  await page.locator('a[href="/notes/how-this-site-works"]').first().click();
  const drawer = page.locator('dialog[open]');
  const scroller = drawer.locator('.project-panel__article');
  await drawer.waitFor();
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H1');
  await drawer.evaluate(element => { element.dataset.identity = 'retained'; });
  const related = drawer.locator('a[href="/notes/ryan-design-taste-skill"]').first();
  await related.scrollIntoViewIfNeeded();
  const previousScroll = await scroller.evaluate(element => element.scrollTop);
  await related.click();
  await page.waitForTimeout(500);
  assert.equal(await drawer.getAttribute('data-identity'), 'retained');
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H1');
  await drawer.getByRole('button', { name: 'Previous article' }).click();
  await page.waitForTimeout(500);
  assert(page.url().includes('how-this-site-works'));
  assert(Math.abs(await scroller.evaluate(element => element.scrollTop) - previousScroll) < 5);
  await page.goForward();
  await page.waitForTimeout(400);
  assert(page.url().includes('ryan-design-taste-skill'));
  await drawer.getByRole('button', { name: 'Close article' }).click();
  await drawer.waitFor({ state: 'detached' });
  assert.equal(new URL(page.url()).pathname, '/notes/');

  await page.goto(`${origin}/notes/exploring-my-portfolio-in-paper/`, { waitUntil: 'domcontentloaded' });
  await drawer.waitFor();
  await page.waitForTimeout(300);
  assert.equal(await drawer.getAttribute('data-phase'), 'open');
  await drawer.getByRole('button', { name: 'All notes', exact: true }).click();
  await drawer.waitFor({ state: 'detached' });
  assert.equal(new URL(page.url()).pathname, '/notes');
  // A direct refresh restores its own position, never another page's default history key.
  await page.goto(`${origin}/notes/how-this-site-works/`, { waitUntil: 'domcontentloaded' });
  await scroller.locator('h1').waitFor();
  await page.waitForTimeout(300);
  await scroller.evaluate(element => { element.scrollTop = 900; });
  await page.waitForTimeout(100);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await scroller.locator('h1').waitFor();
  await page.waitForTimeout(400);
  assert.equal(await scroller.evaluate(element => element.scrollTop), 900);
  await page.goto(`${origin}/notes/governance-in-markdown/`, { waitUntil: 'domcontentloaded' });
  await scroller.locator('h1').waitFor();
  await page.waitForTimeout(300);
  assert.equal(await scroller.evaluate(element => element.scrollTop), 0);
  assert.deepEqual(errors, []);
  await page.close();
}

(async () => {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch();
    try {
      for (const width of [390, 1440]) {
        await verify(browser, width);
        console.log(`${engine.name()} ${width}: history, scroll, focus, stable shell, session close, direct exit and isolated refresh positions passed`);
      }
    } finally {
      await browser.close();
    }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
