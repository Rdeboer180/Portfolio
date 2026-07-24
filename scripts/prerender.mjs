// Prerender the built SPA into static HTML per route.
//
// Serves build/ with an SPA fallback, then drives a modern headless Chromium
// (Playwright) to crawl internal links from "/" and serialize each route's fully
// rendered DOM — including the per-route <head> set by usePageMeta — back into
// build/<route>/index.html. Runs at build time; the client bundle hydrates.
import { chromium } from 'playwright';
import http from 'node:http';
import { createReadStream, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';

const BUILD_DIR = join(process.cwd(), 'build');
const PORT = 45678;
const ORIGIN = `http://localhost:${PORT}`;

// Unlinked routes the crawler won't reach on its own but we still want covered.
// (homepage_template is intentionally excluded — it stays out of the index.)
const EXTRA_ROUTES = ['/design-system'];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
  '.map': 'application/json',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = join(BUILD_DIR, urlPath);
      if (urlPath !== '/' && existsSync(filePath) && statSync(filePath).isFile()) {
        res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream');
        createReadStream(filePath).pipe(res);
        return;
      }
      // SPA fallback → index.html (use the ORIGINAL shell, not a prerendered one)
      res.setHeader('Content-Type', 'text/html');
      createReadStream(join(BUILD_DIR, '__shell.html')).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });
}

function isInternalRoute(href) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return false;
  const path = href.split('#')[0].split('?')[0];
  if (!path || path === '/') return false;
  if (/\.[a-z0-9]+$/i.test(path)) return false; // skip files
  if (path.startsWith('/homepage_template')) return false;
  return true;
}

async function main() {
  // Preserve the un-prerendered shell so the SPA fallback always serves a clean root.
  const fs = await import('node:fs');
  fs.copyFileSync(join(BUILD_DIR, 'index.html'), join(BUILD_DIR, '__shell.html'));

  const server = await startServer();
  const browser = await chromium.launch();
  const context = await browser.newContext();
  // Prerender protected case studies as "dismissed" so the static HTML shows the
  // clean content (protected images stay as locked overlays, never revealed) with
  // no password modal on top. Real first-time visitors still get the modal after
  // hydration; initial render state matches, so hydration stays clean.
  await context.addInitScript(() => {
    const orig = localStorage.getItem.bind(localStorage);
    localStorage.getItem = (key) => (key.startsWith('project-dismissed-') ? 'true' : orig(key));
  });
  const page = await context.newPage();

  const seen = new Set();
  const queue = ['/', ...EXTRA_ROUTES];

  while (queue.length) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);

    await page.goto(ORIGIN + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500); // let usePageMeta / reveal effects settle

    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const href of links) {
      if (!isInternalRoute(href)) continue;
      const clean = href.split('#')[0].split('?')[0];
      if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }

    const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
    const outPath = route === '/' ? join(BUILD_DIR, 'index.html') : join(BUILD_DIR, route, 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    const title = await page.title();
    console.log(`prerendered ${route.padEnd(28)} → ${title}`);
  }

  await browser.close();
  server.close();
  fs.rmSync(join(BUILD_DIR, '__shell.html'));
  console.log(`\n✓ prerendered ${seen.size} routes`);

  // Emit sitemap.xml from the routes we actually rendered (excluding the
  // dev-facing design system). Keeps the sitemap in lockstep with real pages.
  const ORIGIN_URL = 'https://www.rdeboerdesigns.com';
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...seen]
    .filter((r) => r !== '/design-system')
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))
    .map((r) => {
      const loc = r === '/' ? `${ORIGIN_URL}/` : `${ORIGIN_URL}${r}`;
      const priority = r === '/' ? '1.0' : r.startsWith('/work/') ? '0.8' : '0.7';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(BUILD_DIR, 'sitemap.xml'), sitemap);
  console.log(`✓ wrote sitemap.xml (${[...seen].filter((r) => r !== '/design-system').length} urls)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
