// Card data for the binder specimen, from the real project data and the
// chosen hero set. Nothing here is written by hand except which real image
// each public card shows on its back.
//
//   node docs/explorations/binder-specimen/build-cards.mjs [heroFolder]
//
// Writes cards.js (window.BINDER_CARDS) and copies the 1280x800 hero WebPs
// into heroes/. Order is orderedProjects(), i.e. WORK_ORDER. Protected
// studies get no back: the specimen ships nothing a locked card would hide.
import { createRequire } from 'node:module';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../..');
const require = createRequire(import.meta.url);
const ts = require(join(repo, 'node_modules/typescript'));

const heroDir = process.argv[2]
  ?? join(repo, 'plans/new/CardConceptHeros/Ryan_DeBoer_Case_Study_Preview_Graphics_Final');

// projects.ts has no imports, so it transpiles and evaluates on its own.
const source = readFileSync(join(repo, 'src/data/projects.ts'), 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
}).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', js)(mod, mod.exports, require);
const P = mod.exports;

const manifest = JSON.parse(readFileSync(join(heroDir, 'manifest.json'), 'utf8'));
const heroBySlug = new Map(manifest.map((entry) => [entry.slug, entry]));

// Heroes Ryan supplied after the package (19 October). A file in
// hero-overrides/ wins over the package's web copy. Where the image changed,
// its alt text lives here, because the manifest describes the older one.
const OVERRIDE_DIR = join(here, 'hero-overrides');
const OVERRIDE_ALT = {
  'aem-component-system': 'An AEM page editor open on a homepage hero, with its style options, a site-structure map and the button component states.',
  'seasonal-content-system': 'Standard and winter phone homepages beside the AEM folder of winter hero fragments.',
};
const overrideFor = (slug) => ['webp', 'png', 'jpg'].map((ext) => join(OVERRIDE_DIR, `${slug}.${ext}`)).find((p) => existsSync(p));

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** "Label: detail" style metric labels become a bold line and a muted line. */
const splitLabel = (label) => {
  for (const sep of [' · ', ': ', '; ']) {
    const i = label.indexOf(sep);
    if (i > 0) return [cap(label.slice(0, i)), cap(label.slice(i + sep.length))];
  }
  const paren = label.match(/^(.*?)\s*\((.+)\)$/);
  if (paren) return [cap(paren[1]), cap(paren[2])];
  const comma = label.indexOf(', ');
  if (comma > 0 && label.length > 42) return [cap(label.slice(0, comma)), cap(label.slice(comma + 2))];
  return [cap(label), ''];
};

const valueSize = (value) => (value.length <= 5 ? 'l' : value.length <= 10 ? 'm' : 's');
// Every header holds two lines: a one-line title over its subtitle, or a
// title alone that may wrap. That keeps the art windows level across a row.
const titleSize = (title, subtitle) => {
  if (!subtitle) return 'w';
  return title.length <= 12 ? 'l' : title.length <= 18 ? 'm' : 'n';
};
// A value may wrap between words, never inside "4–5/day" or "Owner-managed".
const joinValue = (value) => value.replace(/(\S)([–\-/])(?=\S)/g, '$1⁠$2⁠');
const firstSentence = (text) => {
  const match = text.match(/^(.+?[.!?])(?=\s+[A-Z“"]|$)/);
  return match ? match[1] : text;
};

const stat = (metric) => {
  const [primary, secondary] = splitLabel(metric.label);
  return { value: joinValue(metric.value), size: valueSize(metric.value), primary, secondary };
};

/** Find an image object anywhere in a project by part of its src. */
const findImage = (node, needle) => {
  if (!node || typeof node !== 'object') return null;
  if (typeof node.src === 'string' && node.src.includes(needle) && node.alt) return node;
  for (const value of Object.values(node)) {
    const hit = findImage(value, needle);
    if (hit) return hit;
  }
  return null;
};

// The one hand choice: which real capture sits on each public card's back.
// A shot either fills its window from an object-position, or takes an exact
// crop as percentages of the window (width, left, top).
const BACK_SHOTS = {
  playdraft: {
    src: '/images/work/playdraft/progression/screenshots/10-draft-recap.png',
    alt: 'Draft complete screen for The Candy Showdown, with three lineups and nine picks recorded.',
    shape: 'portrait', crop: [111, -5.5, -27],
  },
  loopstack: { src: '/images/work/loopstack/04_fix_log.png', shape: 'portrait', position: '50% 0%' },
  'bolus-binder': {
    src: '/images/work/bolus-binder/app/04-recipe-detail-hero.png',
    alt: 'Bolus Binder recipe detail with a food photograph, saved versions, a portion selector and ingredient tabs.',
    shape: 'portrait', position: '50% 0%',
  },
  // Overscroll has no phone capture; the finished board is the material the mark is cut from.
  'overscroll-tactics': { src: '/images/work/overscroll-tactics/board-complete.png', shape: 'portrait', position: '46% 50%' },
  // The capture starts mid-page; the Event Hosting card sits about 40 percent down.
  heatherwood: { src: 'heatherwood-final-mobile-01', shape: 'portrait', position: '50% 42%' },
};

const GROUP_LABEL = { product: 'Product design', systems: 'System design', aem: 'AEM', client: 'Client site' };

mkdirSync(join(here, 'heroes'), { recursive: true });

const cards = P.orderedProjects().map((project, i) => {
  const locked = project.stream === 'professional';
  const hero = heroBySlug.get(project.slug);
  if (!hero) throw new Error(`No hero in the manifest for ${project.slug}`);
  const override = overrideFor(project.slug);
  const heroFile = override ?? join(heroDir, hero.web);
  const heroName = `${project.slug}${extname(heroFile)}`;
  copyFileSync(heroFile, join(here, 'heroes', heroName));
  const alt = (override && OVERRIDE_ALT[project.slug]) || hero.alt;

  const [title, subtitle = ''] = P.cardTitleFor(project).split(/:\s+/);
  const titleClass = titleSize(title, subtitle);
  const group = project.groups?.[0] ?? 'client';
  // Locked studies never name the client; the manifest's alt text sometimes does.
  const heroAlt = locked ? alt.replace(/Tire Rack('s)?\s/g, '') : alt;

  const card = {
    slug: project.slug,
    index: String(i + 1).padStart(2, '0'),
    title,
    subtitle,
    titleSize: titleClass,
    locked,
    group,
    groupLabel: GROUP_LABEL[group],
    hero: `heroes/${heroName}`,
    heroAlt,
    heroSource: override ? 'supplied' : 'package',
    stats: (project.metrics ?? []).slice(0, 3).map(stat),
    year: P.yearSpanFor(project),
    category: project.overview?.category ?? project.clientLabel ?? '',
  };

  if (!locked) {
    const shotSpec = BACK_SHOTS[project.slug];
    const found = shotSpec && findImage(project, shotSpec.src);
    const shotSrc = found?.src ?? shotSpec?.src;
    if (shotSrc && !existsSync(join(repo, 'public', shotSrc))) throw new Error(`Missing back shot ${shotSrc}`);
    // What held, in order of preference: the outcome note, the fourth metric,
    // the takeaways, then the first line of the outcome and the summary.
    const rows = [];
    if (project.annotations?.outcome) rows.push({ kind: 'line', text: project.annotations.outcome });
    if (project.metrics?.[3]) rows.push({ kind: 'stat', ...stat(project.metrics[3]) });
    for (const takeaway of project.takeaways ?? []) rows.push({ kind: 'line', text: firstSentence(takeaway) });
    for (const text of [project.overview?.outcome, project.summary]) if (text) rows.push({ kind: 'line', text: firstSentence(text) });
    const meta = [];
    if (project.overview?.role) meta.push(['Role', project.overview.role]);
    if (project.overview?.status) meta.push(['Status', project.overview.status]);
    if (project.tools?.length) meta.push(['Tools', project.tools.slice(0, 3).join(' · ')]);
    card.back = {
      thesis: project.thesis ?? '',
      overview: project.context ?? '',
      meta,
      rows: rows.slice(0, 3),
      shot: shotSrc ? {
        src: `../../../public${shotSrc}`, alt: found?.alt ?? shotSpec.alt, shape: shotSpec.shape,
        ...(shotSpec.crop ? { crop: shotSpec.crop } : { position: shotSpec.position ?? '50% 50%' }),
      } : null,
      href: `https://www.rdeboerdesigns.com/work/${project.slug}/`,
    };
  }
  return card;
});

const banner = `// Generated by build-cards.mjs from src/data/projects.ts and the hero manifest. Do not edit by hand.\n`;
writeFileSync(join(here, 'cards.js'), `${banner}window.BINDER_CARDS = ${JSON.stringify(cards, null, 2)};\n`);
console.log(`wrote ${cards.length} cards; ${cards.filter((c) => c.locked).length} locked, ${cards.filter((c) => c.back).length} with backs`);
