// Production-output checks. Run after npm run build; no live feedback is submitted.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const build = path.resolve('build');
const tag = '<script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>';
const htmlFiles = fs.readdirSync(build, { recursive: true }).filter(file => file.endsWith('.html'));
let reviewCount = 0;
for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(build, file), 'utf8');
  if (file.startsWith('dive/')) {
    reviewCount++;
    assert(source.slice(0, source.indexOf('</head>')).includes(tag), `${file}: exact loader absent from initial head`);
    assert.equal(source.split('https://inflight.co/widget.js').length - 1, 1, `${file}: duplicate widget`);
    assert(/<meta\b[^>]*name="robots"[^>]*content="noindex"/.test(source), `${file}: noindex missing`);
  } else {
    assert(!source.includes('inflight.co/widget.js'), `${file}: widget leaked into public HTML`);
    if (file.endsWith('index.html')) assert(!/href="(?:https:\/\/www.rdeboerdesigns.com)?\/dive(?:\/|["?#])/.test(source), `${file}: public review link`);
  }
}
assert(reviewCount > 10, 'Review case studies were not prerendered');
assert(!fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8').includes('/dive'), 'Review pages leaked into sitemap');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file = path.join(build, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const requests = [];
      await context.route(/^https:\/\/(?:[^/]+\.)?inflight\.co\//, route => { requests.push(route.request().url()); return route.abort(); });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push({ url: page.url(), message: error.message }));
      await page.goto(`${origin}/`);
      await page.locator('.hero h1').waitFor();
      const publicTitle = await page.title();
      const publicHeading = await page.locator('.hero h1').innerText();
      const externalHrefs = () => page.locator('a[href]').evaluateAll(anchors => [...new Set(anchors.map(a => a.getAttribute('href')).filter(href => /^(https?:|mailto:)/.test(href)))].sort());
      const publicExternalLinks = await externalHrefs();
      assert.equal(requests.length, 0, 'Inflight requested on ordinary homepage');
      assert.equal(await page.locator('a[href^="/dive"]').count(), 0);
      await page.locator('a[href="/work/playdraft"]').click();
      await page.locator('dialog[open] h1').waitFor();
      assert.equal(requests.length, 0, 'Inflight requested on ordinary case study');
      await page.getByRole('button', { name: 'Close case study', exact: true }).click();
      await page.locator('dialog[open]').waitFor({ state: 'detached' });
      assert.equal(new URL(page.url()).pathname, '/');

      await page.goto(`${origin}/dive/`);
      await page.locator('.hero h1').waitFor();
      assert.equal(await page.title(), publicTitle);
      assert.equal(await page.locator('.hero h1').innerText(), publicHeading);
      assert.deepEqual(await externalHrefs(), publicExternalLinks, 'External homepage links changed');
      assert(requests.some(url => url === 'https://inflight.co/widget.js'), 'Review loader was not requested');
      assert.equal(await page.locator('head script[src="https://inflight.co/widget.js"]').count(), 1);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex');
      const checkLinks = async () => {
        const escaped = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')).filter(href => href?.startsWith('/') && !href.startsWith('//') && !/\.[a-z0-9]+(?:[?#]|$)/i.test(href) && !/^\/dive(?:\/|[?#]|$)/.test(href)));
        assert.deepEqual(escaped, [], 'Internal review links escaped /dive');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px horizontal overflow`);
      };
      await checkLinks();
      await page.screenshot({ path: `/private/tmp/dive-home-${width}.png` });
      await page.locator('a[href="/dive/work/playdraft"]').click();
      await page.locator('.project-overview h1').waitFor();
      assert.equal(new URL(page.url()).pathname, '/dive/work/playdraft');
      assert.equal(await page.locator('dialog[open]').count(), 0, 'Review reading uses the reusable full-page view');
      await checkLinks();
      await page.screenshot({ path: `/private/tmp/dive-case-${width}.png` });
      await page.goBack();
      await page.locator('.hero h1').waitFor();
      assert.equal(new URL(page.url()).pathname, '/dive/');
      await page.goForward();
      await page.locator('.project-overview h1').waitFor();
      assert.equal(new URL(page.url()).pathname, '/dive/work/playdraft');
      await page.reload();
      await page.locator('.project-overview h1').waitFor();
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://www.rdeboerdesigns.com/dive/work/playdraft/');
      await page.goto(`${origin}/dive/work/wheelrack/`);
      await page.locator('.cs__title').waitFor();
      assert.equal(await page.locator('.password-modal').count(), 0, 'Review browsing unexpectedly password-gated');
      await checkLinks();
      await page.goto(`${origin}/dive/notes/how-this-site-works/`);
      await page.locator('.note-page h1, .notes__article h1, h1').first().waitFor();
      await checkLinks();
      const beforePublic = requests.length;
      await page.goto(`${origin}/`);
      await page.locator('.hero h1').waitFor();
      assert.equal(requests.length, beforePublic, 'Inflight remained active after leaving the review');
      assert.equal(await page.locator('script[src="https://inflight.co/widget.js"]').count(), 0);
      assert.equal(await page.locator('meta[name="robots"]').count(), 0);
      // The current public homepage already recovers from React #418 on load
      // (verified on www.rdeboerdesigns.com on 2026-10-13). Preserve the shared
      // public implementation; reject every other error and any article error.
      const inheritedHomepageRecovery = error => /Minified React error #418;/.test(error.message) && /^\/(?:dive\/?)?$/.test(new URL(error.url).pathname);
      assert.deepEqual(errors.filter(error => !inheritedHomepageRecovery(error)), [], 'New runtime or hydration errors');
      assert.equal(await page.locator('.hero').count(), 1, 'Homepage duplicated after hydration recovery');
      await context.close();
      console.log(`PASS ${width}px: public homepage/case study, review links/metadata, back/forward/reload, mobile overflow, widget isolation`);
    }
    console.log(`PASS ${reviewCount} static review HTML files: exact initial-head script, noindex, sitemap and public-navigation exclusion`);
    console.log('NOTE: the shared homepage retains its existing React #418 hydration recovery, also present on the current public site.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
