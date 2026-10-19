/** Render the portfolio-owned homepage-plan drawings (scripts/aem-component-system/homepage-plan/*.html) to JPG at 2x. */
import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'scripts/aem-component-system/homepage-plan');
const out = path.join(root, 'public/images/work/aem-component-system/homepage-plan');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1500, height: 900 } });
for (const file of fs.readdirSync(src).filter(f => f.endsWith('.html'))) {
  await page.goto('file://' + path.join(src, file), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const board = await page.$('.board');
  await board.screenshot({ path: path.join(out, file.replace('.html', '.jpg')), type: 'jpeg', quality: 90 });
  console.log('rendered', file);
}
await browser.close();
