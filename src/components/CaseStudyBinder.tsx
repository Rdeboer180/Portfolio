import React, { useEffect, useRef } from 'react';
import SectionBadge from './SectionBadge';
import { BINDER_VERSION } from '../data/binderVersion';
import { useNavigate } from 'react-router-dom';
import { useUnlock } from '../context/UnlockContext';
import { isReviewPath } from '../utils/reviewRoutes';

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

const BriefcaseIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" stroke="none">
    <path d="M55.44,27.02c-.712-.237-15.402-.037-16.58-.1A3.601,3.601,0,0,1,36.29,25.84l-4.97-5.09a5.609,5.609,0,0,0-4-1.69H19.08a5.739,5.739,0,0,0-6.55,5.59v3.53H7.73A3.739,3.739,0,0,0,4,31.92V54.35a3.739,3.739,0,0,0,3.73,3.74H56.27A3.739,3.739,0,0,0,60,54.35V31.92A3.739,3.739,0,0,0,56.27,28.18H55.44Z" />
    <path d="M27.32,17.06a7.613,7.613,0,0,1,5.43,2.29l4.97,5.09a1.639,1.639,0,0,0,1.14.48c1.215.049,15.812-.107,16.58.08-.044-.577.109-9.054-.11-9.32-1.228-.002-9.544.001-10.98,0a4.432,4.432,0,0,1-4.43-4.43V4H15.4a3.73,3.73,0,0,0-3.73,3.73V17.06Z" />
    <path d="M44.35,13.68H54.42a4.425,4.425,0,0,0-.98-1L42.6,4.46a4.339,4.339,0,0,0-.68-.43v7.22A2.433,2.433,0,0,0,44.35,13.68Z" />
  </svg>
);

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

const build = (el: HTMLDivElement) => {
  const root = el.attachShadow({ mode: 'open' });
  Promise.all([
    fetch(`${BASE}/binder.css${VERSION}`).then((r) => r.text()),
    fetch(`${BASE}/binder.html${VERSION}`).then((r) => r.text()),
    loadScript(),
  ]).then(([css, markup]) => {
    root.innerHTML = `<style>${css}</style>${markup}`;
    window.__binderCss = css;
    window.__binderNavigate = openStudy;
    window.__binderOverview = openOverview;
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
  }).catch((err) => console.error('CaseStudyBinder:', err));
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
        <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" index="01" tone="accent" />
        <h2 id="case-binder-title" className="case-binder__title">Systems, products, and tools I&rsquo;ve shipped</h2>
      </div>
      <div ref={slot} className="case-binder__slot" />
    </section>
  );
};

export default CaseStudyBinder;
