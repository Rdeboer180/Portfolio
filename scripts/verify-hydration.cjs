// Hydration check for every prerendered route. Run after npm run build.
//
// The prerender serializes a live, reduced-motion browser, so any component
// whose first client render differs from that DOM makes React discard the
// static page and redraw it (minified error #418): the prerender's whole
// benefit, gone on every load, with nothing visibly broken. The lock line in
// CaseStudyPlayground did exactly that on the homepage, /dive/ and every
// /work/ drawer from 2026-10-08, and nothing caught it. verify-dive.cjs loads
// those pages too, but as one reduced-motion visitor that navigates by
// clicking, and it had been told to tolerate #418 on the homepage as inherited.
//
// So this loads every prerendered route directly, as a fresh arrival, once
// per kind of visitor whose first render could plausibly differ, and fails on
// any page error. It also checks the stronger property the error only implies:
// the first node inside each Suspense boundary must still be the node the
// static file shipped, because React 19 can redraw a boundary without throwing.
//
// One silent redraw is known and only reported for now. A route whose
// component is lazy() loses a race with its own chunk: a post-mount update
// above the boundary (UnlockProvider's `ready`, AppRoutes' `readingReady`)
// reaches it before the chunk lands, so React swaps the static content for
// the Suspense fallback and renders fresh once the chunk arrives. That path
// shows the fallback on the way, which is how it is told apart from a
// mismatch. Fixing it is separate work; when it lands, drop the exemption.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const build = path.resolve('build');
const VISITORS = [
  { name: 'desktop, motion allowed', viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' },
  { name: 'desktop, reduced motion', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  { name: 'phone, motion allowed', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
  // Unlock state is read from storage after mount; reading it during render is
  // how the unlock chrome caused #418 on every route before. A returning,
  // unlocked visitor is the one who would see that regression.
  { name: 'returning visitor, unlocked', viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', storage: { 'rd-unlocked': 'true' } },
];
// The prerender wraps these in React's Suspense markers (see prerender.mjs),
// each paired with the fallback its boundary renders (PageShell, ProjectPanel).
const BOUNDARIES = {
  '#main-content': '#main-content > div[aria-hidden="true"][style*="min-height"]',
  '.project-panel__article': '.project-panel__article > .project-panel__loading',
};
// Pages checked at once. More than the runner has cores only adds contention.
const WORKERS = Math.max(2, Math.min(4, os.availableParallelism ? os.availableParallelism() : os.cpus().length));

// Hydrating pages only: the app's own entry bundle and server markup in #root.
// That leaves out the /share/ redirect stubs and the standalone demos. Pass
// routes as arguments to check only those (`node scripts/verify-hydration.cjs /about/`).
const only = process.argv.slice(2);
const routes = fs.readdirSync(build, { recursive: true })
  .filter(file => path.basename(file) === 'index.html')
  .filter(file => {
    const html = fs.readFileSync(path.join(build, file), 'utf8');
    return /<script[^>]+src="\/static\/js\/main\.[^"]+\.js"/.test(html) && /<div id="root"><[^/]/.test(html);
  })
  .map(file => `/${path.dirname(file) === '.' ? '' : `${path.dirname(file).split(path.sep).join('/')}/`}`)
  .filter(route => !only.length || only.includes(route))
  .sort();
if (only.length) assert.equal(routes.length, only.length, `Not prerendered: ${only.filter(route => !routes.includes(route)).join(', ')}`);
else assert(routes.includes('/') && routes.includes('/dive/') && routes.some(route => route.startsWith('/work/')), 'Expected prerendered routes are missing from build/');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file = path.join(build, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  // Video is only ever rendered after mount, so it cannot affect hydration,
  // and a homepage load is otherwise ~18 MB of it decoding in four pages at once.
  if (path.extname(file) === '.mp4') { res.writeHead(204); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

// Outcomes that mean "too slow to tell", which a starved runner can produce.
const NEVER_HYDRATED = 'React never hydrated the page';
const TIMED_OUT = 'Page did not settle within 60s';
// Resolves with the promise or after `ms`, whichever is first. For calls into
// a browser that may have stopped answering.
const atMost = (promise, ms) => Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);

async function inspect(context, origin, visitor, route) {
  // Nothing off this server can change what React renders, and the
  // stylesheet's Google Fonts @imports are render-blocking: a slow answer
  // from them stalled every page at once. Inflight's loader goes too.
  await context.route(url => url.origin !== origin, request => request.abort());
  if (visitor.storage) await context.addInitScript(entries => Object.entries(entries).forEach(([key, value]) => localStorage.setItem(key, value)), visitor.storage);
  // Note any boundary that passes through its fallback while the page loads.
  await context.addInitScript(fallbacks => {
    window.__fellBack = new Set();
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      Object.entries(fallbacks).forEach(([boundary, fallback]) => { if (node.nodeType === 1 && node.matches(fallback)) window.__fellBack.add(boundary); });
    }))).observe(document, { childList: true, subtree: true });
  }, BOUNDARIES);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message.split('\n')[0]));

  // Hold the entry bundle until the static DOM is parsed and marked, so the
  // marks are on the nodes the file shipped, before React can touch them.
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(/\/static\/js\/main\.[^/]+\.js$/, async request => { await held; await request.continue(); });
  await page.goto(origin + route, { waitUntil: 'commit' });
  // Polled on a timer, not on animation frames, which never come while
  // rendering is blocked.
  await page.waitForFunction(() => document.readyState !== 'loading', null, { polling: 100 });
  const marked = await page.evaluate(selectors => selectors.filter(selector => {
    const first = document.querySelector(selector)?.firstElementChild;
    if (first) first.__prerendered = true;
    return Boolean(first);
  }), Object.keys(BOUNDARIES));
  release();

  // Hydrated (or redrawn) means React has claimed the boundary's first node.
  // Lazy routes hydrate only once their chunk arrives, hence the generous wait.
  const claimed = await page.waitForFunction(selectors => selectors.every(selector => {
    const first = document.querySelector(selector)?.firstElementChild;
    return first && Object.keys(first).some(key => key.startsWith('__reactFiber$'));
  }), marked, { polling: 100, timeout: 30000 }).then(() => true, () => false);
  // Recoverable errors are reported as the commit lands; give them a beat.
  await page.waitForTimeout(300);
  const { redrawn, fellBack } = await page.evaluate(selectors => ({
    redrawn: selectors.filter(selector => !document.querySelector(selector)?.firstElementChild?.__prerendered),
    fellBack: [...window.__fellBack],
  }), marked);

  const problems = [...errors];
  if (!marked.length) problems.push('no Suspense boundary found in the static markup');
  if (!claimed) problems.push(NEVER_HYDRATED);
  const replaced = redrawn.filter(selector => !fellBack.includes(selector));
  if (claimed && replaced.length) problems.push(`prerendered markup replaced instead of hydrated: ${replaced.join(', ')}`);
  return { problems, lazyRedraws: redrawn.filter(selector => fellBack.includes(selector)) };
}

// page.evaluate has no timeout of its own, and a starved browser can stop
// answering altogether (it did, on an overloaded machine, for an hour). So the
// deadline is kept here in Node and never waits for the browser to agree.
async function check(browser, origin, visitor, route) {
  let context;
  let abandoned = false;
  const work = browser.newContext({ viewport: visitor.viewport, reducedMotion: visitor.reducedMotion }).then(created => {
    context = created;
    if (abandoned) { created.close().catch(() => {}); throw new Error(TIMED_OUT); }
    return inspect(context, origin, visitor, route);
  });
  let timer;
  const deadline = new Promise(resolve => { timer = setTimeout(() => resolve({ problems: [TIMED_OUT], lazyRedraws: [] }), 60000); });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    abandoned = true;
    clearTimeout(timer);
    work.catch(() => {}); // anything it throws after the deadline is already reported
    await atMost(context?.close().catch(() => {}), 5000);
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const failures = [];
  try {
    for (const visitor of VISITORS) {
      const queue = [...routes];
      const failed = [];
      let lazyRedraws = 0;
      await Promise.all(Array.from({ length: WORKERS }, async () => {
        for (let route = queue.shift(); route; route = queue.shift()) {
          let result = await check(browser, origin, visitor, route);
          // A starved runner can outlast the waits; a page that truly never
          // hydrates or settles fails the second time too.
          if (result.problems.length === 1 && [NEVER_HYDRATED, TIMED_OUT].includes(result.problems[0])) {
            console.log(`RETRY ${visitor.name}: ${route}: ${result.problems[0]}`);
            result = await check(browser, origin, visitor, route);
          }
          if (result.problems.length) failed.push(`${route}\n      ${result.problems.join('\n      ')}`);
          if (result.lazyRedraws.length) lazyRedraws++;
        }
      }));
      if (failed.length) {
        console.log(`FAIL ${visitor.name}: ${failed.length} of ${routes.length} routes`);
        failed.sort().forEach(line => console.log(`    ${line}`));
        failures.push(...failed);
      } else {
        console.log(`PASS ${visitor.name}: ${routes.length} routes, no page errors, no mismatched markup`);
      }
      if (lazyRedraws) console.log(`NOTE ${visitor.name}: ${lazyRedraws} lazy routes redrew through their Suspense fallback (known; see the header)`);
    }
  } finally {
    await atMost(browser.close(), 10000);
    server.close();
  }
  assert.equal(failures.length, 0, 'Hydration failed: the static HTML and the first client render disagree');
})()
  .catch(error => { console.error(error.message); server.close(); process.exitCode = 1; })
  // A browser that never closed would keep the process alive; the result is in.
  .finally(() => setTimeout(() => process.exit(), 2000).unref());
