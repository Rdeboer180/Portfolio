import React, { useEffect, useRef } from 'react';
import { BINDER_VERSION } from '../data/binderVersion';
import { useNavigate } from 'react-router-dom';
import { useUnlock } from '../context/UnlockContext';
import { isReviewPath } from '../utils/reviewRoutes';
import { EMAIL_HREF } from '../data/site';

// The case studies as the collectible binder, lying open under the hero
// (docs/explorations/binder-specimen). build-home.mjs writes the
// specimen to public/binder-home/ in three parts; this mounts them in a shadow
// root, so the binder's styles and the site's never meet, and runs its script
// against a document that answers from that root. The binder is built once a
// visit: coming back to the homepage moves the same element back in, so its
// listeners and its page are never set up twice.

declare global {
  interface Window {
    mountBinder?: (doc: Document) => void;
    __binderCss?: string;
    __binderNavigate?: (slug: string) => void;
    __binderOverview?: (slug: string) => void;
    __binderUnlocked?: () => void;
    /** Where a visitor without the password can write: a mailto href. */
    __binderEmail?: string;
    binder?: { unlock?: (on?: boolean) => void };
  }
}

// A study opens in the site's own panel, by a real /work/<slug>/ link clicked
// on the binder's behalf: the site's panel navigation (usePanelNavigation)
// handles it as any reading link, password prompt, return state and all,
// and data-from-binder tells the study its top is the binder's (BinderTop).
// A locked card asks for the password in the binder's own dialog, so the link
// for its public overview says not to ask again (data-skip-unlock).
const followLink = (slug: string, data: Record<string, string>) => {
  const link = document.createElement('a');
  link.href = `/work/${slug}/`;
  Object.assign(link.dataset, data);
  link.hidden = true;
  (document.querySelector('#projects') ?? document.body).appendChild(link);
  link.click();
  link.remove();
};
// Under /dive (the review mirror) a study is a full page inside it, reached
// through the router as the site's own links are (its basename adds /dive);
// a plain /work/ link would leave the review for the public site.
let routerNavigate: ((to: string) => void) | null = null;
const openStudy = (slug: string) => {
  if (isReviewPath() && routerNavigate) { routerNavigate(`/work/${slug}`); return; }
  followLink(slug, { fromBinder: slug });
};
const openOverview = (slug: string) => {
  if (isReviewPath() && routerNavigate) { routerNavigate(`/work/${slug}`); return; }
  followLink(slug, { skipUnlock: 'true' });
};

const BASE = `${process.env.PUBLIC_URL}/binder-home`;
// The three files change together; their version (build-home.mjs writes
// it) keeps a returning visitor from pairing a new binder.html with a
// cached binder.js, since the server caches scripts for a year.
const VERSION = `?v=${BINDER_VERSION}`;

// The margin note beside the title is in Ryan's hand (DESIGN.md, the
// Annotation Rule). Caveat is loaded only with the binder, subset to the
// note's own letters, so the homepage's first load carries none of it.
const NOTE = 'pick one, it flies out';
let noteFont = false;
const loadNoteFont = () => {
  if (noteFont) return;
  noteFont = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // the testimonials' note below shares the font, so its letters ride along
  link.href = `https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap&text=${encodeURIComponent(`${NOTE} tap a name, it opens`)}`;
  document.head.appendChild(link);
};

let host: HTMLDivElement | null = null;

// once a visit: a returning homepage (or a strict-mode remount) reuses it
let scriptLoad: Promise<void> | null = null;
const loadScript = () => {
  if (window.mountBinder) return Promise.resolve();
  if (!scriptLoad) scriptLoad = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `${BASE}/binder.js${VERSION}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptLoad = null; reject(new Error('binder.js did not load')); };
    document.head.appendChild(s);
  });
  return scriptLoad;
};

// A missing file is an error, not markup: a 404 page never lands in the binder.
const fetchText = (file: string) => fetch(`${BASE}/${file}${VERSION}`).then((r) => {
  if (!r.ok) throw new Error(`${file} answered ${r.status}`);
  return r.text();
});

const build = (el: HTMLDivElement, attempt = 0) => {
  const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  Promise.all([
    fetchText('binder.css'),
    fetchText('binder.html'),
    loadScript(),
  ]).then(([css, markup]) => {
    root.innerHTML = `<style>${css}</style>${markup}`;
    window.__binderCss = css;
    window.__binderNavigate = openStudy;
    window.__binderOverview = openOverview;
    window.__binderEmail = EMAIL_HREF;
    // The script's page is the shadow root, and its root element the host:
    // the classes it sets there (binder-open, is-unlocked) are :host() rules.
    const doc = new Proxy(document, {
      get(target, key) {
        if (key === 'documentElement') return el;
        if (key === 'getElementById') return (id: string) => root.getElementById(id);
        if (key === 'querySelector') return (s: string) => root.querySelector(s);
        if (key === 'querySelectorAll') return (s: string) => root.querySelectorAll(s);
        const value = Reflect.get(target, key, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
    window.mountBinder?.(doc);
    // Reading a study locks the page's scroll, which the script asks of its
    // root element; the site's own page is the one that scrolls.
    new MutationObserver(() => {
      document.documentElement.style.overflow = el.classList.contains('is-reading') ? 'hidden' : '';
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
  }).catch((err) => {
    console.error('CaseStudyBinder:', err);
    // One more try: a connection dropped on a slow, far network (the server is
    // in Virginia) shouldn't leave the binder empty for the rest of the visit.
    if (attempt < 1) window.setTimeout(() => build(el, attempt + 1), 2000);
  });
};

const CaseStudyBinder: React.FC = () => {
  const slot = useRef<HTMLDivElement>(null);
  // The binder's dialog checks the password itself; the site learns of it
  // here, so the nav, the studies and other pages unlock in the same moment.
  const { unlock, unlocked } = useUnlock();
  const navigate = useNavigate();
  useEffect(() => {
    routerNavigate = (to) => navigate(to);
    return () => { routerNavigate = null; };
  }, [navigate]);
  useEffect(() => {
    window.__binderUnlocked = unlock;
    return () => { if (window.__binderUnlocked === unlock) delete window.__binderUnlocked; };
  }, [unlock]);
  // and the other way: the site's own prompt unlocking tells the binder, which
  // only hears another tab's unlock (storage events skip the page that wrote),
  // so its cards drop "Password protected" in the same moment
  useEffect(() => {
    if (unlocked) window.binder?.unlock?.(true);
  }, [unlocked]);
  useEffect(() => {
    const at = slot.current;
    if (!at) return undefined;
    const place = () => {
      const fresh = !host;
      if (!host) {
        host = document.createElement('div');
        host.className = 'case-binder__host';
      }
      at.appendChild(host);
      if (fresh) build(host);
      if (window.matchMedia?.('(min-width: 1180px) and (hover: hover)').matches) loadNoteFont();
    };
    // Built once it is about to be seen (a screen early), so the hero and the
    // page's first paint never wait on it; at once when it is already built,
    // or when the visit is headed straight for the work (#projects, #showWork).
    let watch: IntersectionObserver | null = null;
    if (host || /^#(projects|showwork)/i.test(window.location.hash) || !('IntersectionObserver' in window)) place();
    else {
      watch = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        watch?.disconnect(); watch = null;
        place();
      }, { rootMargin: '100% 0px' });
      watch.observe(at);
    }
    return () => { watch?.disconnect(); host?.remove(); };
  }, []);
  return (
    <section id="projects" className="case-binder" aria-labelledby="case-binder-title">
      <div className="case-binder__intro">
        <div className="case-binder__head">
          <h2 id="case-binder-title" className="case-binder__title">Systems, products, and tools I&rsquo;ve shipped</h2>
          <span className="case-binder__note" aria-hidden="true">
            {NOTE}
            <svg viewBox="0 0 54 46" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6c18 2 34 12 42 34" /><path d="M38 34l8 7 3-10" /></svg>
          </span>
        </div>
      </div>
      <div ref={slot} className="case-binder__slot" />
    </section>
  );
};

export default CaseStudyBinder;
