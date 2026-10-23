// Card data for the binder specimen, from the real project data and the
// chosen hero set. A public card's back is its study's intro video, and the
// fly-out it opens into carries the study's own opening copy.
//
//   node docs/explorations/binder-specimen/build-cards.mjs [heroFolder]
//
// Writes cards.js (window.BINDER_CARDS) and puts each card's hero in heroes/.
// Order is orderedProjects(), i.e. WORK_ORDER. Protected studies carry their
// back and panel too, marked locked: the page keeps them shut until the
// site's shared password opens them, the way the site's own courtesy gate
// does, and the site already ships all of this in its bundle.
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
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

// Where each hero comes from, first match wins:
//   1. hero-overrides/<slug>.(webp|png|jpg), for a one-off file Ryan hands over;
//   2. the newest artwork/<slug>-preview-v<n>.png, the source Ryan named;
//   3. the manifest's web/ copy, which went stale for AEM and Seasonal content.
// PNGs become JPEGs through macOS sips to keep the page light; elsewhere the
// PNG is copied as it is.
const OVERRIDE_DIR = join(here, 'hero-overrides');
const overrideFor = (slug) => ['webp', 'png', 'jpg'].map((ext) => join(OVERRIDE_DIR, `${slug}.${ext}`)).find((p) => existsSync(p));
const artworkFor = (slug) => {
  const dir = join(heroDir, 'artwork');
  const versions = readdirSync(dir)
    .map((f) => ({ f, m: f.match(new RegExp(`^${slug}-preview-v(\\d+)\\.png$`)) }))
    .filter((x) => x.m)
    .sort((a, b) => Number(b.m[1]) - Number(a.m[1]));
  return versions.length ? { file: join(dir, versions[0].f), version: Number(versions[0].m[1]) } : null;
};
const placeHero = (src, slug) => {
  if (src.endsWith('.png')) {
    const out = join(here, 'heroes', `${slug}.jpg`);
    const run = spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', src, '--out', out], { encoding: 'utf8' });
    if (run.status === 0 && existsSync(out)) return `${slug}.jpg`;
  }
  const name = `${slug}${extname(src)}`;
  copyFileSync(src, join(here, 'heroes', name));
  return name;
};
// The manifest's alt text still describes the older AEM and Seasonal images.
const CURRENT_ALT = {
  'aem-component-system': 'An AEM page editor open on a homepage hero, with its style options, a site-structure map and the button component states.',
  'seasonal-content-system': 'Standard and winter phone homepages beside the AEM folder of winter hero fragments.',
  'design-enablement': 'A laptop open on a published Tire Rack tire test page, beside the tr-tire-tests MCP workflow (read documents, build in stage, independent QA, human review) and the Hero Crop Simulator at desktop and mobile widths.',
};

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
const stat = (metric) => {
  const [primary, secondary] = splitLabel(metric.label);
  return { value: joinValue(metric.value), size: valueSize(metric.value), primary, secondary };
};

// Card copy Ryan set for the binder (20 October), in place of what the study
// gives. A row is kept from the study's metrics (null) or set here; the
// study does not state these yet, so before this ships it should.
// PlayDraft's counts come from the app's own code at b95fd0b (24 August
// 2026): its live pack catalog (PACK_IDS less HIDDEN_PACK_IDS, Custom
// aside) and src/components/ui; "reviewed in Paper" is the PlayDraft note's
// nine artboards. The rest are Ryan's numbers.
const CARD_ROWS = {
  playdraft: [
    null,
    { value: '13', label: 'Pre-built packs in the catalog · Movies, GOAT Athletes, Sitcoms and more' },
    { value: '37', label: 'Components in the design system · React Native, reviewed in Paper' },
  ],
  wheelrack: [{ value: '+6', label: 'Dealer clients gained' }, null, null],
  'tire-categories': [
    { value: 'Up to +50%', label: 'Initial conversion lift' },
    { value: 'Up to +400%', label: 'Initial growth vs. month prior' },
    { value: '36', label: 'Icons scaled into a governed sitewide sprite library' },
  ],
  heatherwood: [{ value: '4+', label: 'Weekly hours saved' }, { value: '+600%', label: 'Service inquiry lift' }, null],
};
const rowsFor = (project) => {
  const own = (project.metrics ?? []).slice(0, 3);
  return (CARD_ROWS[project.slug] ?? own).map((row, k) => row ?? own[k]).filter(Boolean);
};
// and a card's name, where the study's card title says more than Ryan wants
const CARD_TITLE = { 'landing-pages': 'AEM Landing Governance' };
// and the spine's disciplines: WheelRack was a full design-system build, so
// it is filed under System Design too, where work order puts it first. The
// site's groups (src/data/projects.ts) still say product only.
const CARD_GROUPS = { wheelrack: ['product', 'systems'] };
const groupsFor = (project) => CARD_GROUPS[project.slug] ?? project.groups ?? [];

const SITE = 'https://www.rdeboerdesigns.com';
const playdraftJson = JSON.parse(readFileSync(join(repo, 'src/data/playdraft.json'), 'utf8'));

/** Pixel size of a local image, through macOS sips; null elsewhere. */
const imageSize = (file) => {
  const run = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const w = run.stdout?.match(/pixelWidth: (\d+)/); const h = run.stdout?.match(/pixelHeight: (\d+)/);
  return w && h ? { width: Number(w[1]), height: Number(h[1]) } : null;
};

// The card's back is a portrait window on the intro's first frame. focus is
// where that window sits across the frame (object-position x), chosen so the
// back shows the frame's subject rather than an empty middle.
const BACK_FOCUS = {
  playdraft: 0.93,            // the Packs phone, right of the title
  loopstack: 0.5,             // the logo
  'bolus-binder': 0.5,        // the middle phone
  'overscroll-tactics': 0.41, // the head
  heatherwood: 0.08,          // the WordPress sidebar beside the page list
  // the protected studies, shown once unlocked
  wheelrack: 0.75,            // the wheel visualizer and the car
  'aem-component-system': 0.5, // the Shop by Vehicle sheet
  'tire-categories': 0.3,     // the mega menu's panel
  'design-enablement': 0.55,  // the crop simulator's previews
  'figma-template-governance': 0.5, // the Tools panel
  'landing-pages': 0.5,       // the middle deal tile
  'seasonal-content-system': 0.25,  // the two phones in front of the laptop
};

// Where in its video each intro's poster was taken, in seconds. The fold is
// cut from the poster, so the video starts on that frame when it takes over
// rather than jumping back to its first. Found by comparing every frame with
// the poster (96×54 grayscale, least squared error); each lies inside a run of
// frames that match it, so a seek that lands a frame early or late still matches.
const POSTER_AT = {
  playdraft: 1.4,             // frames 38–102 of 60fps; its first frame is dark
  loopstack: 1.1,             // frames 30–46 of 30fps
  'overscroll-tactics': 2.56, // frames 58–92 of 25fps, the held last pose
  heatherwood: 0.6,           // frames 9–49 of 30fps
  // the protected studies' loops open from black; their posters are the
  // first lit frame (none matches exactly, nearest at 12 of 24fps)
  'tire-categories': 0.5,
  'design-enablement': 6.2,    // the tools reel; its poster is the frame at 6.2s, the plugin's finished QA state
  'landing-pages': 0.5,
};

/** The video the study's fly-out opens on: its reel, or the cover loop ProjectPreview plays;
 *  a study with neither opens on its overview's opening image, held still. */
const introFor = (project) => {
  const reel = project.featuredReel;
  const src = (reel?.src ?? project.featuredVideo ?? '').split('?')[0];
  if (!src) {
    const still = project.overview?.opening;
    if (!still?.src || still.isVideo) return null;
    const file = still.src.split('?')[0];
    if (!existsSync(join(repo, 'public', file))) throw new Error(`Missing intro image ${file}`);
    const size = imageSize(join(repo, 'public', file)) ?? { width: 16, height: 9 };
    return {
      src: null,
      poster: `../../../public${file}`,
      captions: null,
      caption: still.caption ?? '',
      alt: still.alt ?? `${project.title} preview`,
      frame: 'preview',
      focus: BACK_FOCUS[project.slug] ?? 0.5,
      posterAt: 0,
      width: size.width,
      height: size.height,
    };
  }
  const poster = reel?.poster ?? src.replace(/\.mp4$/, '-poster.jpg');
  for (const f of [src, poster]) if (!existsSync(join(repo, 'public', f))) throw new Error(`Missing intro media ${f}`);
  const size = imageSize(join(repo, 'public', poster)) ?? { width: 16, height: 9 };
  return {
    src: `../../../public${src}`,
    poster: `../../../public${poster}`,
    captions: reel?.captions ? `../../../public${reel.captions}` : null,
    caption: reel?.caption ?? '',
    alt: reel?.alt ?? `${project.title} preview`,
    // the reel plays square-cornered on dark; a cover loop sits in a 10px frame
    frame: reel ? 'reel' : 'preview',
    focus: BACK_FOCUS[project.slug] ?? 0.5,
    posterAt: POSTER_AT[project.slug] ?? 0,
    width: size.width,
    height: size.height,
  };
};

/** One of the study's own images or loops, as ProjectOverview's OverviewMedia shows it. */
const mediaFor = (img) => {
  if (!img?.src || img.isOverlay) return null;
  const file = (p) => join(repo, 'public', p.split('?')[0]);
  for (const p of [img.src, img.videoPoster, img.displaySrc].filter(Boolean)) {
    if (!existsSync(file(p))) throw new Error(`Missing study media ${p}`);
  }
  const sized = img.isVideo ? img.videoPoster : img.displaySrc ?? img.src;
  const size = sized ? imageSize(file(sized)) : null;
  const local = (p) => (p ? `../../../public${p}` : null);
  return {
    src: local(img.src),
    display: local(img.displaySrc),
    poster: local(img.videoPoster),
    video: Boolean(img.isVideo),
    frame: img.frame ?? null,
    crop: img.crop ?? null,
    alt: img.alt ?? '',
    caption: img.caption ?? '',
    width: size?.width ?? null,
    height: size?.height ?? null,
  };
};
const mediaList = (list) => (list ?? []).filter(Boolean).map(mediaFor).filter(Boolean);

/** The fly-out's opening, from the same fields ProjectOverview reads. */
const panelFor = (project) => {
  const o = project.overview;
  const walkthrough = project.featuredVideo || project.featuredReel || o.opening?.isVideo ? 'Walkthrough' : 'Project evidence';
  const links = project.slug === 'playdraft'
    ? [{ label: 'Get PlayDraft for iPhone', url: playdraftJson.appStoreUrl }]
    : (project.outcomeLiveLinks ?? []).slice(0, 2).map((l) => ({ label: l.label, url: l.url.startsWith('/') ? `${SITE}${l.url}` : l.url }));
  return {
    eyebrow: `${o.category ?? (project.stream === 'professional' ? 'Professional work' : 'Independent work')} · ${project.year}`,
    title: o.title,
    status: o.status,
    role: o.role ?? project.role,
    nav: [walkthrough, 'Decisions', 'Outcome'],
    links,
    tools: project.tools ?? [],
    context: project.context ?? '',
    // what the project set out to solve, as the full study's Problem section has it
    problemPunch: project.problemPunch ?? '',
    problem: project.problem ?? [],
    deck: o.deck ?? '',
    ownership: o.ownership ?? '',
    // the study's own media, where the live overview puts it
    evidence: mediaList(o.evidence),
    decisions: (o.decisions ?? []).map((d) => ({
      title: d.title,
      body: d.body,
      link: d.bodyLink ? { text: d.bodyLink.text, url: d.bodyLink.to.startsWith('/') ? `${SITE}${d.bodyLink.to}` : d.bodyLink.to } : null,
      image: mediaFor(d.image),
      images: mediaList(d.images),
      wide: mediaFor(d.wide),
      artboards: mediaList(d.artboards),
      points: d.points ?? [],
      quote: d.quote ?? null,
    })),
    outcomeMetric: o.outcomeMetric ?? null,
    outcome: o.outcome ?? '',
    outcomeImages: mediaList(o.outcomeImages),
    href: `${SITE}/work/${project.slug}/`,
  };
};

const GROUP_LABEL = { product: 'Product design', systems: 'System design', aem: 'AEM', client: 'Client site' };
// The badge at a card's top right names what kind of thing the work is, not
// its discipline (the spine's tabs file by discipline). Ryan's four types,
// 21 October 2026; every card must have one.
const TYPE = {
  wheelrack: 'web', playdraft: 'mobile', 'aem-component-system': 'aem', 'tire-categories': 'aem',
  loopstack: 'mobile', 'design-enablement': 'tools', 'figma-template-governance': 'tools',
  'landing-pages': 'aem', 'seasonal-content-system': 'aem', 'bolus-binder': 'mobile',
  'overscroll-tactics': 'web', heatherwood: 'web',
};
const TYPE_LABEL = { web: 'Web', mobile: 'Mobile app', aem: 'AEM', tools: 'Internal tools' };

// Each card's hue comes from its hero: the strongest saturated hue measured
// in the image, moved to the hero's second hue only where two neighbours on a
// page would otherwise match. s scales how much colour the silver takes.
const THEME = {
  wheelrack: { h: 35, s: 0.8 },                   // the amber and orange palette rows
  playdraft: { h: 310, s: 0.8 },                  // Psychic, after the Espeon card: pink to lilac (Ryan, 23 Oct)
  'aem-component-system': { h: 4, s: 0.9 },       // the header red
  'tire-categories': { h: 350, s: 0.9 },          // the category page's red
  loopstack: { h: 128, s: 0.85 },                 // the chart green
  'design-enablement': { h: 205, s: 0.8 },        // second hue; amber would repeat WheelRack
  'figma-template-governance': { h: 35, s: 0.35 }, // the same paper as Overscroll Tactics (Ryan, 23 Oct)
  'landing-pages': { h: 22, s: 1 },               // the sunset
  'seasonal-content-system': { h: 205, s: 0.85 }, // second hue, the snow; red would fill the row
  'bolus-binder': { h: 224, s: 0.8 },             // the nutrition rings
  'overscroll-tactics': { h: 35, s: 0.35 },       // the paper, nearly neutral
  heatherwood: { h: 85, s: 0.6 },                 // second hue, the sage ground
};

// heroes/ is generated; clear it so a renamed or retired file never lingers.
rmSync(join(here, 'heroes'), { recursive: true, force: true });
mkdirSync(join(here, 'heroes'), { recursive: true });

const cards = P.orderedProjects().map((project, i) => {
  const locked = project.stream === 'professional';
  const hero = heroBySlug.get(project.slug);
  if (!hero) throw new Error(`No hero in the manifest for ${project.slug}`);
  const override = overrideFor(project.slug);
  const artwork = override ? null : artworkFor(project.slug);
  const heroFile = override ?? artwork?.file ?? join(heroDir, hero.web);
  const heroName = placeHero(heroFile, project.slug);
  const heroSource = override ? 'supplied file' : artwork ? `artwork v${artwork.version}` : 'web copy';
  const alt = CURRENT_ALT[project.slug] ?? hero.alt;

  const [title, subtitle = ''] = (CARD_TITLE[project.slug] ?? P.cardTitleFor(project)).split(/:\s+/);
  const titleClass = titleSize(title, subtitle);
  const group = groupsFor(project)[0] ?? 'client';
  if (!TYPE[project.slug]) throw new Error(`build-cards: ${project.slug} has no project type (TYPE)`);
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
    type: TYPE[project.slug],
    typeLabel: TYPE_LABEL[TYPE[project.slug]],
    groups: groupsFor(project),   // the disciplines the spine's tabs filter by
    theme: THEME[project.slug] ?? { h: 215, s: 0 },
    hero: `heroes/${heroName}`,
    heroAlt,
    heroSource,
    stats: rowsFor(project).map(stat),
    year: P.yearSpanFor(project),
    category: project.overview?.category ?? project.clientLabel ?? '',
  };

  const intro = introFor(project);
  if (intro) card.back = { intro };
  card.panel = panelFor(project);
  return card;
});

// The site's courtesy gate, from its one source of truth (src/utils/unlock.ts):
// the SHA-256 of the shareable password and the storage keys the unlock is
// kept under. The page checks the password the way the site does; the
// private password's hash lives in .env.local and never comes here.
const unlockSource = readFileSync(join(repo, 'src/utils/unlock.ts'), 'utf8');
const field = (re, what) => { const m = unlockSource.match(re); if (!m) throw new Error(`unlock.ts: no ${what}`); return m[1]; };
const unlock = {
  hash: field(/SHOW_WORK_HASH\s*=\s*\n?\s*'([0-9a-f]{64})'/, 'shared password hash'),
  key: field(/UNLOCK_KEY = '([^']+)'/, 'unlock key'),
  legacyKey: field(/LEGACY_SESSION_KEY = '([^']+)'/, 'legacy unlock key'),
};

const banner = `// Generated by build-cards.mjs from src/data/projects.ts, src/utils/unlock.ts and the hero manifest. Do not edit by hand.\n`;
writeFileSync(join(here, 'cards.js'), `${banner}window.BINDER_CARDS = ${JSON.stringify(cards, null, 2)};\nwindow.BINDER_UNLOCK = ${JSON.stringify(unlock)};\n`);
console.log(`wrote ${cards.length} cards; ${cards.filter((c) => c.locked).length} locked, ${cards.filter((c) => c.back).length} with backs`);
