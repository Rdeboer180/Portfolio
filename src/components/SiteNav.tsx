import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMAIL_HREF } from '../data/site';
import { getHomeHref } from '../utils/homeSession';

// ============================================
// SiteNav: the one primary header every page shares (11 November 2026), the
// homepage's bar: the wordmark home on the left; About, Work, Notes, Resume and
// "Get in touch" on the right; below 640px the links fold into the menu behind
// the layer-row toggle. It uses the homepage's own hero__nav styles, sticky
// rather than fixed so a page needs no spacer. `current` marks the page's own
// link. The homepage keeps its own copy inside the hero (its Work link scrolls
// to the binder without leaving the page).
// ============================================

type Section = 'about' | 'work' | 'notes' | 'resume' | null;

export default function SiteNav({ current = null }: { current?: Section }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const at = (s: Section) => (current === s ? ({ 'aria-current': 'page' } as const) : {});
  const close = () => setOpen(false);
  return (
    <nav className="hero__nav hero__nav--site" aria-label="Primary">
      <Link to={getHomeHref()} className="hero__nav-logo">Ryan DeBoer</Link>
      <div className="hero__nav-links">
        <Link to="/about" {...at('about')}>About</Link>
        <Link to="/#projects" {...at('work')}>Work</Link>
        <Link to="/notes" {...at('notes')}>Notes</Link>
        <Link to="/resume" {...at('resume')}>Resume</Link>
        <a href={EMAIL_HREF} className="hero__nav-cta">Get in touch</a>
        <button
          type="button"
          className={`hero__nav-toggle${open ? ' hero__nav-toggle--open' : ''}`}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
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
      {open && (
        <div id={menuId} className="hero__nav-menu">
          <Link to="/about" onClick={close} {...at('about')}>About</Link>
          <Link to="/#projects" onClick={close} {...at('work')}>Work</Link>
          <Link to="/notes" onClick={close} {...at('notes')}>Notes</Link>
          <Link to="/resume" onClick={close} {...at('resume')}>Resume</Link>
          <a href={EMAIL_HREF} className="hero__nav-menu-cta" onClick={close}>Get in touch</a>
        </div>
      )}
    </nav>
  );
}
