// Prerender the built SPA into static HTML per route.
//
// Serves build/ with an SPA fallback, then drives a modern headless Chromium
// (Playwright) to crawl internal links from "/" and serialize each route's fully
// rendered DOM — including the per-route <head> set by usePageMeta — back into
// build/<route>/index.html. Runs at build time; the client bundle hydrates.
import { chromium } from 'playwright';
import http from 'node:http';
import { createReadStream, existsSync, statSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';

const BUILD_DIR = join(process.cwd(), 'build');
const PORT = 45678;
const ORIGIN = `http://localhost:${PORT}`;

// Unlinked routes the crawler won't reach on its own but we still want covered.
// (homepage_template is intentionally excluded — it stays out of the index.)
// Hidden case studies live here too: `hidden: true` keeps them out of Selected
// Work and prev/next, which also keeps the crawler from ever finding them, so
// without an explicit entry a direct link would 404 on the host.
// Derived, not hand-listed: `photography-workflow-agent` was hidden but absent
// from this array, so it had no prerendered file and a direct link 404'd on any
// host without an SPA fallback — the exact failure the comment above warns of.
const HIDDEN_WORK_ROUTES = [...readFileSync(new URL('../src/data/projects.ts', import.meta.url), 'utf8')
  .matchAll(/slug: '([^']+)'[\s\S]{0,4000}?hidden: true/g)]
  .map((m) => `/work/${m[1]}`);
const EXTRA_ROUTES = ['/design-system', '/sitemap', ...new Set(HIDDEN_WORK_ROUTES)];

// Rendered so a direct link resolves, but kept out of the sitemap and marked
// noindex. Rendering a route and publishing it are two decisions, and hidden
// case studies need the first without the second: a real file on the host for
// anyone holding the link, and no invitation to index it.
//
// Sitemap exclusion on its own would not hold. The Overscroll Tactics note
// links to /work/bolus-binder/ from a public, indexed page, so a crawler
// reaches it regardless of what the sitemap lists — the meta tag is what
// actually carries the instruction.
//
// Derived from the same list that renders them, deliberately. When EXTRA_ROUTES
// learned to derive hidden studies but this set stayed hand-listed, the two
// drifted within one commit: `photography-workflow-agent` gained a prerendered
// file and went straight into the sitemap with no robots tag, because nobody
// added it here. A hidden study is now rendered and noindexed by the same
// derivation, so the pair cannot fall out of step again.
const NOINDEX_ROUTES = new Set(['/design-system', ...HIDDEN_WORK_ROUTES]);

// Content routes seeded deterministically from the data files so the sitemap
// never depends on link-discovery timing. The /notes children were occasionally
// missed by the crawler, truncating the sitemap between deploys; seeding them
// guarantees a complete, stable sitemap for search engines every build.
function contentRoutes() {
  try {
    const notesSrc = readFileSync(join(process.cwd(), 'src/data/notes.tsx'), 'utf8');
    const slugs = [...notesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
    if (slugs.length) return ['/notes', ...slugs.map((s) => `/notes/${s}`)];
  } catch {
    // Fall back to link discovery if the data file can't be read.
  }
  return [];
}

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
  // Standalone static apps hosted under public/ — they ship their own
  // index.html; prerendering would overwrite it with the portfolio shell.
  if (path.startsWith('/loopstack-demo')) return false;
  return true;
}

async function main() {
  // Preserve the un-prerendered shell so the SPA fallback always serves a clean root.
  const fs = await import('node:fs');
  fs.copyFileSync(join(BUILD_DIR, 'index.html'), join(BUILD_DIR, '__shell.html'));

  const server = await startServer();
  const browser = await chromium.launch();
  // Reduced motion makes Hero.tsx jump its intro straight to `done`, so the
  // serialized HTML captures the settled hero instead of freezing at
  // data-intro-stage="sketch" — which is what a JS-disabled visitor, and every
  // crawler, was being served.
  const context = await browser.newContext({ reducedMotion: 'reduce' });
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
  const queue = ['/', ...EXTRA_ROUTES, ...contentRoutes()];

  while (queue.length) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);

    await page.goto(ORIGIN + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500); // let usePageMeta / reveal effects settle

    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const href of links) {
      if (!isInternalRoute(href)) continue;
      // Normalize trailing slashes so /work/x and /work/x/ are one route (some
      // links use the slash form, some don't) — otherwise every page dupes.
      const clean = (href.split('#')[0].split('?')[0].replace(/\/+$/, '')) || '/';
      if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }

    let html = '<!doctype html>\n' + (await page.evaluate(() => {
      // The client's FIRST render omits the unlock bar (UnlockContext gates it
      // behind a `ready` flag set in an effect). Serializing it produced a
      // structural mismatch at the root of #root: on a matched route React
      // threw the prerender away, and on a fallback route it appended a whole
      // second copy of the page — leaving a dead, half-animated hero on top of
      // the live one. Stripping it here makes the static HTML match what the
      // client renders first.
      const clone = document.documentElement.cloneNode(true);
      clone.classList.remove('has-unlock-bar');
      clone.querySelectorAll('.unlock-bar, .password-modal, .password-modal__overlay')
        .forEach((el) => el.remove());
      return clone.outerHTML;
    }));
    if (NOINDEX_ROUTES.has(route)) {
      html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>');
    }
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

  // Emit sitemap.xml from the routes we actually rendered, minus the noindex
  // set. Keeps the sitemap in lockstep with the pages we want found.
  const ORIGIN_URL = 'https://www.rdeboerdesigns.com';
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...seen]
    .filter((r) => !NOINDEX_ROUTES.has(r))
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))
    .map((r) => {
      // Trailing slash = the URL nginx serves directly over https (slashless
      // paths 301 to the slash form and downgrade to http).
      const loc = r === '/' ? `${ORIGIN_URL}/` : `${ORIGIN_URL}${r}/`;
      const priority = r === '/' ? '1.0' : r.startsWith('/work/') ? '0.8' : '0.7';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(BUILD_DIR, 'sitemap.xml'), sitemap);
  console.log(`✓ wrote sitemap.xml (${[...seen].filter((r) => !NOINDEX_ROUTES.has(r)).length} urls)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
