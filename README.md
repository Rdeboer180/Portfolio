# rdeboerdesigns.com

Ryan DeBoer's portfolio: case studies, notes, résumé, and the design system the
site is built on. React + TypeScript + SCSS, prerendered to static HTML.

## Quick start

```bash
npm install
npm start
```

Dev server on http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload. |
| `npm run build` | Production bundle, then prerender every route to static HTML and emit `sitemap.xml`. |
| `npm test` | Content-invariant suite (`src/data/content.test.ts`). |

`npm run build` is two steps, not one. After CRA emits the bundle,
`scripts/prerender.mjs` drives a headless browser over every route and writes
the resulting DOM to `build/<route>/index.html`. That is what makes the site
crawlable and what makes a shared link show the right title and preview image —
the client-side app alone would ship an empty `<div id="root">` to every crawler.

## How it fits together

```
src/
  data/          Content. projects.ts and notes.tsx are the source of truth —
                 pages read from them, nothing is hardcoded in components.
  components/    One file per surface. PageShell wraps every route with the
                 skip link, the <main> landmark, and route-change announcements.
  hooks/         usePageMeta sets each route's <head>; the prerender step
                 serializes whatever it produces.
  styles/        SCSS. _variables.scss holds every token; components/ mirrors
                 the component tree. All colour goes through a token.
scripts/
  prerender.mjs  Route discovery, static render, noindex handling, sitemap.
```

## Content rules

Two constraints that are easy to break and expensive to break:

1. **Real metrics and quotes only.** No fabricated numbers, testimonials, or
   endorsements; every quote stays attributable. Metrics carry a label that
   scopes them, so a page-level lift can't be read as a business-level one.
2. **Protected work stays protected.** Client- and employer-confidential images
   sit behind the unlock flow. Hidden case studies are prerendered so a direct
   link resolves, but are kept out of `sitemap.xml` and marked `noindex`.

`npm test` enforces the mechanical half of both. The judgment half is yours.

## Adding a case study

Add an entry to `src/data/projects.ts`. Required: `slug`, `title`, `summary`,
`year`, `tags`, `role`, `tools`, `timeline`, `metrics`, `timeToLive`. The build
picks it up automatically — route, prerendered page, and sitemap entry. Set
`hidden: true` to keep it off the index while leaving the URL live.

## Deploying

`npm run build` produces a fully static `build/`. Serve it from any static host;
the only server requirement is an SPA fallback to `index.html` for routes that
were not prerendered.
