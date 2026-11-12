// LabDemoPage: the Tire Fitment Prototype inside the site, under the homepage's
// nav and over its footer (Ryan, 1 Nov 2026). The trackpad on /about opens this
// page; the prototype itself stays a static lab page (/lab/fitment-confidence/)
// and runs in a same-origin frame that grows to its full height, so the site
// scrolls as one page. Inside a frame the lab's own dark nav stands down
// (nav.js), and its links leave the frame for the whole window.
// The prototype playground uses the same shell at /prototypingPlayground (12 Nov 2026);
// a hash on the page, such as #simplicity, is handed to the frame.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { EMAIL_HREF, SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import './labDemo.scss';

export const FITMENT_DEMO_PATH = '/demo/tire-fitment';
export const PLAYGROUND_DEMO_PATH = '/prototypingPlayground';

type Demo = { path: string; src: string; title: string; description: string };
const DEMOS: Record<'fitment' | 'playground', Demo> = {
  fitment: {
    path: FITMENT_DEMO_PATH,
    src: '/lab/fitment-confidence/',
    title: 'Tire Fitment Prototype',
    description: 'Pick a vehicle and the page narrows to the sizes that fit, confirms the match on the sidewall, and says so when a tire isn’t made for your car.',
  },
  playground: {
    path: PLAYGROUND_DEMO_PATH,
    src: '/lab/playground/',
    title: 'Prototype playground',
    description: 'A prototype playground between Figma and production, and a study in simplicity: what each tire option actually changes, on one car with four colors.',
  },
};

const LabDemoPage: React.FC<{ demo?: keyof typeof DEMOS }> = ({ demo = 'fitment' }) => {
  const D = DEMOS[demo];
  // the frame opens at the page's own hash, so /prototypingPlayground/#simplicity opens that tab
  const [src] = useState(() => D.src + (typeof window !== 'undefined' ? window.location.hash : ''));
  usePageMeta({
    title: `${D.title} | Ryan DeBoer`,
    description: D.description,
    canonical: `${SITE.portfolioUrl}${D.path}/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'website',
  });
  const frame = useRef<HTMLIFrameElement>(null);
  // the nav is fixed, as on the homepage; the page starts below whatever height it has at this width
  const nav = useRef<HTMLElement>(null);
  const [navH, setNavH] = useState(84);
  useEffect(() => {
    const el = nav.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setNavH(Math.round(el.getBoundingClientRect().height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [height, setHeight] = useState(1600);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  // the frame takes the prototype's height whenever its page changes size
  const observer = useRef<ResizeObserver | null>(null);
  const onLoad = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    const fit = () => setHeight(Math.ceil(doc.documentElement.scrollHeight));
    fit();
    observer.current?.disconnect();
    observer.current = new ResizeObserver(fit);
    observer.current.observe(doc.body);
    // a link that leaves the prototype opens in the window, not the frame
    doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      if (!a.getAttribute('href')!.startsWith('#') && !a.target) a.target = '_top';
    });
  }, []);
  useEffect(() => () => observer.current?.disconnect(), []);

  return (
    <div className="lab-demo" style={{ paddingTop: navH }}>
      <nav ref={nav} className="hero__nav" aria-label="Primary">
        <Link to="/" className="hero__nav-logo">Ryan DeBoer</Link>
        <div className="hero__nav-links">
          <Link to="/about">About</Link>
          <Link to="/#projects">Work</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/resume">Resume</Link>
          <a href={EMAIL_HREF} className="hero__nav-cta">Get in touch</a>
          <button
            type="button"
            className={`hero__nav-toggle${navOpen ? ' hero__nav-toggle--open' : ''}`}
            aria-expanded={navOpen}
            aria-controls="lab-demo-menu"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="hero__nav-toggle-box" aria-hidden="true">
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-line" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--tl" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--tr" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--bl" />
              <span className="hero__nav-toggle-handle hero__nav-toggle-handle--br" />
            </span>
          </button>
        </div>
        {navOpen && (
          <div id="lab-demo-menu" className="hero__nav-menu">
            <Link to="/about" onClick={() => setNavOpen(false)}>About</Link>
            <Link to="/#projects" onClick={() => setNavOpen(false)}>Work</Link>
            <Link to="/notes" onClick={() => setNavOpen(false)}>Notes</Link>
            <Link to="/resume" onClick={() => setNavOpen(false)}>Resume</Link>
            <a href={EMAIL_HREF} className="hero__nav-menu-cta" onClick={() => setNavOpen(false)}>Get in touch</a>
          </div>
        )}
      </nav>
      <iframe
        ref={frame}
        className="lab-demo__frame"
        src={src}
        title={D.title}
        onLoad={onLoad}
        style={{ height }}
      />
      <Footer />
    </div>
  );
};

export default LabDemoPage;
