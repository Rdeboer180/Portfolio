// The binder for the site's own homepage (public/binder-home/), where it
// replaces the case-study section under the hero: lying open, no title or
// note, the work on its own.
//
//   node docs/explorations/binder-specimen/build-home.mjs public/binder-home
//
// The page goes in three parts that src/components/CaseStudyBinder.tsx mounts
// in a shadow root, so the specimen's styles and the site's never meet:
// binder.css (its :root and html rules moved onto the host), binder.html (its
// body, the bench still in it for the script, hidden) and binder.js (the cards
// and the script, as window.mountBinder(document), run against a document that
// answers from the shadow root). It also writes src/data/binderVersion.ts.
//
// The standalone page's other builds (the shared Artifact, the open-homepage
// mock and the /binder-demo/ page on the site) were parked on 21 October 2026
// with the tag parked/binder-standalone, where share-build.mjs still has them.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? '');
if (basename(out) !== 'binder-home') throw new Error('build-home: writes only to a folder named binder-home');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'heroes'), { recursive: true });
// the baked noise fields (bake-textures.mjs), asked for by the site's own path
cpSync(join(here, 'textures'), join(out, 'textures'), { recursive: true });

// card data, its media served from the site, which serves public/ at its root
const scope = {};
new Function('window', readFileSync(join(here, 'cards.js'), 'utf8'))(scope);
const cards = scope.BINDER_CARDS;
const fromSite = (from) => from && from.replace(/^(\.\.\/)+public\//, '/');
for (const c of cards) {
  if (c.panel) {
    const p = c.panel;
    [...(p.evidence ?? []), ...(p.outcomeImages ?? []), ...p.decisions.flatMap((d) => [d.image, ...(d.images ?? []), d.wide, ...(d.artboards ?? [])])]
      .forEach((m) => { if (m) for (const k of ['src', 'display', 'poster']) m[k] = fromSite(m[k]); });
  }
  if (c.back) for (const k of ['src', 'poster', 'captions']) if (c.back.intro[k]) c.back.intro[k] = fromSite(c.back.intro[k]);
}

const HOME_CSS = `
/* ---------- on the homepage: the binder alone, open under the hero ---------- */
.top, .panel, .notes, .home-hero, .flyout, .scrim { display: none !important; }
:host { background: transparent; }
.lab { padding-block: 0 72px; }
.fo-header { padding-top: max(12px, env(safe-area-inset-top, 0px)); }`;

const page = readFileSync(join(here, 'index.html'), 'utf8');
const between = (from, to) => {
  const i = page.indexOf(from), j = page.indexOf(to, i + from.length);
  if (i < 0 || j < 0) throw new Error(`build-home: index.html no longer has ${JSON.stringify(i < 0 ? from : to)}`);
  return page.slice(i + from.length, j);
};
// The card art, at the size it is seen: 800px across covers a card on a
// 2x screen; the 1586px drafts were six times the bytes (5.3 MB for twelve).
const WEBP = 'import sys\nfrom PIL import Image\nim = Image.open(sys.argv[1]).convert("RGB")\nw = int(sys.argv[3])\nim = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)\nim.save(sys.argv[2], "WEBP", quality=82, method=6)';
for (const c of cards) {
  const name = c.hero.replace(/\.(png|jpe?g)$/i, '.webp');
  // run from the output folder, which holds no Python, so nothing local shadows Pillow
  const run = spawnSync('python3', ['-c', WEBP, join(here, c.hero), join(out, name), '800'], { encoding: 'utf8', cwd: out });
  if (run.status !== 0) throw new Error(`build-home: could not make ${name}: ${run.stderr}`);
  c.hero = `/binder-home/${name}`;
}
const css = between('<style>', '</style>')
  .replace(/:root\b/g, ':host')
  .replace(/^html \{[^}]*\}\n/m, '')
  .replace(/^html\.is-reading \{[^}]*\}\n/m, '')   // the component locks the site's own scroll instead
  .replace(/\bhtml((?:\.[\w-]+|:not\([^)]*\))+)/g, ':host($1)')
  .replace(/^body \{/m, ':host {\n  display: block;')
  // the styles sit in a shadow root on the homepage, so their relative paths
  // would resolve against the page, not this folder
  .replace(/url\("textures\//g, 'url("/binder-home/textures/');
if (/(^|[\s,}])(html|body)[\s.:{,]/m.test(css.replace(/\/\*[\s\S]*?\*\//g, ''))) throw new Error('build-home: a page-level rule is left in the homepage CSS');
const script = between('<script src="cards.js"></script>\n<script>', '</script>\n</body>');
writeFileSync(join(out, 'binder.css'), `${css}${HOME_CSS}\n`);
// The site already has its <main>; the binder's is a plain block inside it.
const markup = between('<body>', '<script src="cards.js"></script>').trim().replace('<main class="wrap lab">', '<div class="wrap lab">').replace(/<\/main>(?![\s\S]*<\/main>)/, '</div>');
if (/<main\b/.test(markup)) throw new Error('build-home: a <main> is left in the homepage markup');
writeFileSync(join(out, 'binder.html'), markup + '\n');
writeFileSync(join(out, 'binder.js'), `// Generated by docs/explorations/binder-specimen/build-home.mjs. Do not edit by hand.
window.BINDER_SHARE = true; window.BINDER_OPEN = true; window.BINDER_HOME = true;
window.BINDER_CARDS = ${JSON.stringify(cards)};
window.BINDER_UNLOCK = ${JSON.stringify(scope.BINDER_UNLOCK)};
window.mountBinder = function (document) {
${script}
};
`);
// the three files' version, for the site to ask for them by (CaseStudyBinder)
const version = createHash('sha256').update(['binder.css', 'binder.html', 'binder.js'].map((f) => readFileSync(join(out, f), 'utf8')).join('\n')).digest('hex').slice(0, 10);
writeFileSync(resolve(here, '../../../src/data/binderVersion.ts'), `// Written by docs/explorations/binder-specimen/build-home.mjs. Do not edit by hand.\nexport const BINDER_VERSION = '${version}';\n`);
console.log(`wrote ${out} (${cards.length} cards, version ${version})`);
