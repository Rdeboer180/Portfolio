import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import projects, { Project, ProjectImage } from '../data/projects';
import { getHomeHref, getProjectsHref } from '../utils/homeSession';
import OverlayCard from './OverlayCard';
import LinkedInLink from './LinkedInLink';
import { useUnlock } from '../context/UnlockContext';
import { SITE, EMAIL_HREF } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReveal } from '../hooks/useReveal';
import '../styles/styles.scss';

/* ─── Lightbox ─── */
interface LightboxState { src: string; alt: string; index: number; }

const Lightbox: React.FC<{
  images: { src: string; alt: string }[];
  current: LightboxState;
  onClose: () => void;
  onNav: (index: number) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}> = ({ images, current, onClose, onNav, triggerRef }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Move focus to close button on open; restore to trigger on close.
  // Capture the trigger element at mount (it's stable for the lightbox's life)
  // so the cleanup doesn't read a ref that may have changed.
  useEffect(() => {
    closeRef.current?.focus();
    const trigger = triggerRef?.current;
    return () => {
      trigger?.focus();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: Escape/Arrows + Tab trap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight') { onNav((current.index + 1) % images.length); return; }
      if (e.key === 'ArrowLeft') { onNav((current.index - 1 + images.length) % images.length); return; }

      if (e.key === 'Tab') {
        // Collect focusable buttons inside the dialog
        const focusable: HTMLButtonElement[] = [closeRef.current!].filter(Boolean);
        if (images.length > 1) {
          if (prevRef.current) focusable.push(prevRef.current);
          if (nextRef.current) focusable.push(nextRef.current);
        }
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [current.index, images.length, onClose, onNav]);

  return (
    <div
      className="cs-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <button ref={closeRef} className="cs-lightbox__close" onClick={onClose} aria-label="Close lightbox">&#x2715;</button>
      <div className="cs-lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.alt} className="cs-lightbox__img" />
      </div>
      {images.length > 1 && (
        <>
          <button ref={prevRef} className="cs-lightbox__prev" onClick={(e) => { e.stopPropagation(); onNav((current.index - 1 + images.length) % images.length); }} aria-label="Previous image">&#8592;</button>
          <button ref={nextRef} className="cs-lightbox__next" onClick={(e) => { e.stopPropagation(); onNav((current.index + 1) % images.length); }} aria-label="Next image">&#8594;</button>
          <div className="cs-lightbox__counter" aria-live="polite" aria-atomic="true">{current.index + 1} / {images.length}</div>
        </>
      )}
    </div>
  );
};


/* ─── Helpers ─── */
const allLightboxImages = (project: Project): { src: string; alt: string }[] => {
  const imgs: { src: string; alt: string }[] = [];
  const addSection = (sectionImages?: ProjectImage[]) => {
    if (sectionImages) sectionImages.forEach((img) => {
      // Skip videos — lightbox only handles images
      if (img.src && !img.isVideo) imgs.push({ src: img.src, alt: img.alt });
    });
  };
  addSection(project.problemImages);
  addSection(project.gapsImages);
  addSection(project.constraintsImages);
  // Approach: subsections or legacy flat images
  if (project.approachSubsections) {
    project.approachSubsections.forEach((sub) => addSection(sub.images));
  }
  addSection(project.approachImages);
  addSection(project.outcomeImages);
  addSection(project.outcomeGridImages);
  return imgs;
};

const SECTION_LABELS = ['Problem', 'Gaps & Opportunity', 'Constraints', 'Approach', 'Outcome'];

/**
 * Employer and product names, stripped from any copy still visible while locked.
 *
 * Gating the sections wasn't enough on its own — the problem statement and the
 * next/prev pager both name the client in their own prose. Rather than gate the
 * last readable section too (which would leave the page with nothing to index),
 * the name is swapped for a neutral stand-in and the narrative survives intact.
 */
// Only the employer's own name. "WheelRack" is deliberately NOT in here: it's a
// publicly launched product at wheelrack.com, so redacting it would mangle
// titles and page identity to hide something that isn't hidden.
const CLIENT_PATTERN = /\bTire\s?Rack(?:’s|'s)?/g;

/**
 * What stands in for the client on a locked page.
 *
 * A descriptor rather than a blackout bar or a bare "Confidential client". A bar
 * removes information without substituting any; a descriptor withholds the name
 * while still telling a reader what kind of company and what scale of problem
 * this was, which is what makes an anonymised case study credible instead of
 * evasive. Deliberately claims no ranking — nothing here needs substantiating.
 */
const ANON_CLIENT = 'A national US online tire & wheel retailer';

const redactClient = (text: string, locked: boolean): string => {
  if (!locked) return text;
  return text.replace(CLIENT_PATTERN, (match) =>
    /(’s|'s)$/.test(match) ? 'the client’s' : 'the client'
  );
};


/**
 * Stands in for the gated middle of a locked case study.
 *
 * The problem and the outcome stay readable — those are the parts worth finding
 * in search, and they say enough to be worth the click. What sits between them
 * is the process: how the constraints were read, what the approach was, the
 * component work. That's the employer's, not the portfolio's, so it's the part
 * that locks.
 *
 * Rendered identically at prerender time, so a crawler sees exactly what a
 * logged-out visitor sees. No cloaking.
 */
const CaseStudyLocked: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => (
  <section className="cs__section cs__locked">
    <div className="cs__locked-inner">
      <span className="cs__locked-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
             strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
          <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
        </svg>
      </span>
      <h2 className="cs__locked-heading">The rest is password protected</h2>
      <p className="cs__locked-body">
        This is client and employer work, so everything past the problem &mdash; the
        constraints, the approach, the results, and every screen &mdash; stays
        locked, along with who it was for. Enter the password to read it.
      </p>
      <button type="button" className="cs__locked-action" onClick={onUnlock}>
        Enter password
      </button>
    </div>
  </section>
);

/* ─── Section Image Renderer ─── */
// Muted autoplay loop clip with a pause/play control (WCAG 2.2.2).
const InlineVideo: React.FC<{ src: string; poster?: string; alt: string }> = ({ src, poster, alt }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
      <button
        type="button"
        className="cs__video-toggle"
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path d="M3.5 2.2v9.6a.6.6 0 0 0 .92.5l7.2-4.8a.6.6 0 0 0 0-1l-7.2-4.8a.6.6 0 0 0-.92.5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </>
  );
};

const SectionImages: React.FC<{
  images: ProjectImage[];
  allImages: { src: string; alt: string }[];
  onOpen: (src: string, alt: string, index: number, trigger?: HTMLElement | null) => void;
  isUnlocked?: boolean;
  onOverlayClick?: () => void;
  /** Whole study is gated — render no imagery at all, not even the safe frames. */
  locked?: boolean;
}> = ({ images, allImages, onOpen, isUnlocked, onOverlayClick, locked }) => {
  const reduceMotion = useReducedMotion();
  if (locked) return null;
  if (!images || images.length === 0) return null;

  const findGlobalIndex = (src: string) => allImages.findIndex((img) => img.src === src);

  const shouldSkipImage = (img: ProjectImage): boolean => {
    // Skip overlay images without src when unlocked
    return !!(img.isOverlay && !img.src && isUnlocked);
  };

  const renderImg = (img: ProjectImage) => {
    // Show overlay card if locked
    if (img.isOverlay && img.overlayText && !isUnlocked) {
      return <OverlayCard text={img.overlayText} altText={img.alt} onClick={onOverlayClick} />;
    }
    // Skip rendering overlay images that don't have a src (when unlocked)
    if (shouldSkipImage(img)) {
      return null;
    }
    // Inline video — short prototype clips, muted autoplay loop (NOT clickable)
    if (img.isVideo) {
      // Reduced motion: show the poster still instead of autoplaying motion
      if (reduceMotion && img.videoPoster) {
        const stillEl = <img src={img.videoPoster} alt={img.alt} />;
        return img.mobile ? (
          <div className="cs__phone-frame cs__phone-frame--video">
            <div className="cs__phone-notch" />
            {stillEl}
          </div>
        ) : (
          <div className="cs__img-wrap cs__img-wrap--video">{stillEl}</div>
        );
      }
      const videoEl = <InlineVideo src={img.src!} poster={img.videoPoster} alt={img.alt} />;
      return img.mobile ? (
        <div className="cs__phone-frame cs__phone-frame--video">
          <div className="cs__phone-notch" />
          {videoEl}
        </div>
      ) : (
        <div className="cs__img-wrap cs__img-wrap--video">{videoEl}</div>
      );
    }
    // Render actual images — wrapped in a button for keyboard accessibility
    if (img.mobile) {
      return (
        <button
          type="button"
          className="cs__phone-frame"
          aria-label={`Open ${img.alt} at full size`}
          onClick={(e) => onOpen(img.src!, img.alt, findGlobalIndex(img.src!), e.currentTarget)}
        >
          <div className="cs__phone-notch" />
          <img src={img.src} alt="" loading="lazy" />
        </button>
      );
    }
    return (
      <button
        type="button"
        className="cs__img-wrap"
        aria-label={`Open ${img.alt} at full size`}
        onClick={(e) => onOpen(img.src!, img.alt, findGlobalIndex(img.src!), e.currentTarget)}
      >
        <img src={img.src} alt="" loading="lazy" />
        <span className="cs__zoom-hint">&#x26F6; View full</span>
      </button>
    );
  };

  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < images.length) {
    const img = images[i];
    if (shouldSkipImage(img)) {
      i++;
      continue;
    }
    if (img.layout === 'full') {
      // Optional width constraint — small marks/icons that shouldn't fill the column
      const constrainedStyle = img.maxWidth ? { maxWidth: img.maxWidth, margin: '0 auto' } : undefined;
      elements.push(
        <figure
          key={i}
          className={`cs__figure cs__figure--full${img.mobile ? ' cs__figure--mobile' : ''}${img.maxWidth ? ' cs__figure--constrained' : ''}`}
          style={constrainedStyle}
        >
          {renderImg(img)}
          {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
        </figure>
      );
      i++;
    } else {
      const next = images[i + 1];
      if (next && next.layout === 'half' && !shouldSkipImage(next)) {
        elements.push(
          <div key={i} className="cs__image-pair">
            <figure className={`cs__figure cs__figure--half${img.mobile ? ' cs__figure--mobile' : ''}`}>
              {renderImg(img)}
              {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
            </figure>
            <figure className={`cs__figure cs__figure--half${next.mobile ? ' cs__figure--mobile' : ''}`}>
              {renderImg(next)}
              {next.caption && <figcaption className="cs__caption">{next.caption}</figcaption>}
            </figure>
          </div>
        );
        i += 2;
      } else {
        elements.push(
          <figure key={i} className={`cs__figure cs__figure--half cs__figure--solo${img.mobile ? ' cs__figure--mobile' : ''}`}>
            {renderImg(img)}
            {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
          </figure>
        );
        i++;
      }
    }
  }
  return <div className="cs__section-images">{elements}</div>;
};

/* ─── Main Component ─── */
interface CaseStudyPageProps {
  slug: string;
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug }) => {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  // Trailing slash matches the URL nginx serves directly over https (a slashless
  // /work/x 301-redirects and downgrades to http), so it's the clean canonical.
  const pageUrl = `${SITE.portfolioUrl}/work/${slug}/`;
  const socialImage = `${SITE.portfolioUrl}/images/social/cs-${slug}.jpg`;
  usePageMeta(
    project
      ? {
          title: `${project.seoTitle ?? project.title} — Ryan DeBoer`,
          description: project.summary,
          canonical: pageUrl,
          ogImage: socialImage,
          ogType: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.seoTitle ?? project.title,
            headline: project.title,
            description: project.summary,
            url: pageUrl,
            image: socialImage,
            temporalCoverage: project.year,
            keywords: project.tags,
            creator: { '@type': 'Person', name: 'Ryan DeBoer', url: `${SITE.portfolioUrl}/` },
            author: { '@type': 'Person', name: 'Ryan DeBoer', url: `${SITE.portfolioUrl}/` },
          },
        }
      : { title: 'Case study — Ryan DeBoer' }
  );

  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [thesisRef, thesisVisible] = useReveal<HTMLDivElement>(0.3);

  // One unlock covers every protected surface on the site — the password gates
  // the person, not the page. The prompt itself is raised once on first load by
  // UnlockChrome; here a locked overlay only needs to be able to re-open it.
  const { unlocked: isUnlocked, openPrompt } = useUnlock();

  // Employer/client studies gate their middle sections and all imagery. The
  // self-built work is Ryan's to publish, so it never locks.
  const locked = !isUnlocked && project?.stream === 'professional';

  // Scroll-reveal for content sections — extends the homepage's 520ms reveal
  // grammar to the case-study pages (they previously rendered flat). Each
  // section fades up once as it enters the viewport; reduced-motion renders
  // everything settled immediately. No markup changes — sections are queried.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.cs .cs__section')
    );
    if (sections.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach((s) => s.classList.add('cs__section--in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs__section--in');
            observer.unobserve(entry.target);
          }
        });
      },
      // Low threshold — sections are tall; a sliver entering should reveal them
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [slug, isUnlocked]);

  const handleOverlayClick = () => {
    if (!isUnlocked) openPrompt();
  };

  const lbTriggerRef = useRef<HTMLElement | null>(null);
  const lbImages = useMemo(() => project ? allLightboxImages(project) : [], [project]);
  const openLightbox = useCallback((src: string, alt: string, index: number, trigger?: HTMLElement | null) => {
    // Stash the triggering element so focus can return to it when the lightbox closes.
    lbTriggerRef.current = trigger ?? null;
    setLightbox({ src, alt, index });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const navLightbox = useCallback((index: number) => {
    const img = lbImages[index];
    if (img) setLightbox({ src: img.src, alt: img.alt, index });
  }, [lbImages]);

  if (!project) {
    return (
      <div className="cs">
        <div className="cs__container">
          <p>Project not found.</p>
          <Link to={getProjectsHref()} className="cs__back">&larr; Back to all work</Link>
        </div>
      </div>
    );
  }

  // "Next project" should cycle through visible projects only so a hidden,
  // direct-link-only case study (e.g. PlayDraft) is never surfaced via the
  // bottom nav of a public project.
  const visibleProjects = projects.filter((p) => !p.hidden);
  const visibleIndex = visibleProjects.findIndex((p) => p.slug === project.slug);
  const nextProject: Project | undefined =
    visibleIndex >= 0
      ? visibleProjects[(visibleIndex + 1) % visibleProjects.length]
      : undefined;
  const prevProject: Project | undefined =
    visibleIndex >= 0
      ? visibleProjects[(visibleIndex - 1 + visibleProjects.length) % visibleProjects.length]
      : undefined;
  const hasNewFormat = !!(project.problem || project.gaps || project.constraints || project.approachSteps || project.approachSubsections);

  return (
    <article className="cs">
      {/* Fixed nav */}
      <nav className="cs__nav" aria-label="Case study">
        <Link to={getHomeHref()} className="cs__nav-logo">Ryan DeBoer</Link>
        <Link to={getProjectsHref()} className="cs__nav-back">&larr; All Projects</Link>
      </nav>

      <div className="cs__container">
        {/* ==================== Header ==================== */}
        <header className="cs__header">
          <span className="cs__eyebrow">
            Case Study
            {project.stream && (
              <span className={`cs__stream-chip cs__stream-chip--${project.stream}`}>
                {project.stream === 'professional' ? '[ Shipped ]' : '[ Self-Built ]'}
              </span>
            )}
            {project.stream && (
              <span className="cs__stream-name">
                {project.stream === 'professional'
                  ? 'Professional & Published'
                  : 'Passion-Driven Self Creation'}
              </span>
            )}
          </span>
          {/* The client is the thing under NDA — withheld until unlock. Every
              seoTitle is already client-neutral, so nothing indexable is lost. */}
          <span className="cs__client">
            {locked ? ANON_CLIENT : project.client}
          </span>
          <h1 className="cs__title">{project.title}</h1>
          {project.thesis && (
            <div ref={thesisRef} className={`cs__thesis${thesisVisible ? ' is-visible' : ''}`}>
              <p className="cs__thesis-text">{redactClient(project.thesis, locked)}</p>
              <svg
                className="cs__thesis-underline"
                width="240"
                height="14"
                viewBox="0 0 240 14"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  className="reveal-draw"
                  style={{ ['--reveal-delay' as string]: '160ms' }}
                  d="M3 8 C 60 3, 180 3, 237 7"
                  stroke="var(--color-primary, #f03d01)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength={1}
                />
              </svg>
            </div>
          )}
          {project.summary && (
            <p className="cs__summary">{redactClient(project.summary, locked)}</p>
          )}
          <div className="cs__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="cs__tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* ==================== Featured Image (optional) ==================== */}
        {!locked && project.featured && (
          <div className="cs__featured-image">
            {/* Above-the-fold hero image — prioritize as the likely LCP element. */}
            <img src={project.featured} alt={project.title} fetchPriority="high" />
          </div>
        )}

        {/* ==================== Meta Bar (horizontal) ==================== */}
        <div className="cs__meta-bar">
          <div className="cs__meta-item">
            <span className="cs__meta-label">Role</span>
            <span className="cs__meta-value">{project.role}</span>
          </div>
          <div className="cs__meta-item">
            <span className="cs__meta-label">Tools</span>
            <span className="cs__meta-value">{project.tools.join(', ')}</span>
          </div>
          <div className="cs__meta-item">
            <span className="cs__meta-label">Timeline</span>
            <span className="cs__meta-value">{project.timeline}</span>
          </div>
          <div className="cs__meta-item">
            <span className="cs__meta-label">Year</span>
            <span className="cs__meta-value">{project.year}</span>
          </div>
        </div>

        {/* ==================== NEW SECTION LAYOUT ==================== */}
        {hasNewFormat ? (
          <>
            {/* --- 01 Problem --- */}
            {project.problem && project.problem.length > 0 && (
              <section className="cs__section">
                <div className="cs__section-header">
                  <span className="cs__section-number">01</span>
                  <span className="cs__micro-label">The Problem</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[0]}</h2>
                  {project.annotations?.problem && (
                    <p className="cs__section-aside">{project.annotations.problem}</p>
                  )}
                </div>
                {project.problemPunch && (
                  <p className="cs__punch">{redactClient(project.problemPunch, locked)}</p>
                )}
                <ul className="cs__section-bullets">
                  {project.problem.map((item, i) => (
                    <li key={i}>{redactClient(item, locked)}</li>
                  ))}
                </ul>
                <SectionImages images={project.problemImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} locked={locked} />
              </section>
            )}

            {/* --- 02–05: process AND outcome. Locked on employer/client studies.
                    The outcome carries live client URLs, partner-adoption figures,
                    and the metrics — the parts a client is least likely to want
                    public — so it locks with the rest. --- */}
            {locked ? <CaseStudyLocked onUnlock={openPrompt} /> : (<>

            {/* --- 02 Gaps & Opportunity --- */}
            {project.gaps && project.gaps.length > 0 && (
              <section className="cs__section cs__section--alt">
                <div className="cs__section-header">
                  <span className="cs__section-number">02</span>
                  <span className="cs__micro-label">What Was Missing</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[1]}</h2>
                  {project.annotations?.gaps && (
                    <p className="cs__section-aside">{project.annotations.gaps}</p>
                  )}
                </div>
                {project.gapsPunch && (
                  <p className="cs__punch">{project.gapsPunch}</p>
                )}
                <ul className="cs__section-bullets">
                  {project.gaps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <SectionImages images={project.gapsImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />
              </section>
            )}

            {/* --- 03 Constraints --- */}
            {project.constraints && project.constraints.length > 0 && (
              <section className="cs__section">
                <div className="cs__section-header">
                  <span className="cs__section-number">03</span>
                  <span className="cs__micro-label">Real-World Context</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[2]}</h2>
                  {project.annotations?.constraints && (
                    <p className="cs__section-aside">{project.annotations.constraints}</p>
                  )}
                </div>
                {project.constraintsPunch && (
                  <p className="cs__punch">{project.constraintsPunch}</p>
                )}
                <ul className="cs__section-bullets">
                  {project.constraints.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <SectionImages images={project.constraintsImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />
              </section>
            )}

            {/* --- Insight Callout (moment frame) --- */}
            {project.insightCallout && (
              <div className="cs__callout">
                <span className="cs__callout-marker">Key Insight</span>
                <p className="cs__callout-text">{project.insightCallout}</p>
              </div>
            )}

            {/* --- 04 Approach --- */}
            {project.approachSubsections && project.approachSubsections.length > 0 ? (
              <section className="cs__section cs__section--alt">
                <div className="cs__section-header">
                  <span className="cs__section-number">04</span>
                  <span className="cs__micro-label">How It Came Together</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[3]}</h2>
                  {project.annotations?.approach && (
                    <p className="cs__section-aside">{project.annotations.approach}</p>
                  )}
                </div>
                <div className="cs__approach-subs">
                  {project.approachSubsections.map((sub) => (
                    <div key={sub.key} className="cs__approach-sub">
                      {sub.systemMarker && (
                        <span className="cs__system-marker">{sub.systemMarker}</span>
                      )}
                      <h3 className="cs__approach-sub-label">{sub.label}</h3>
                      <p className="cs__approach-sub-desc">{sub.description}</p>
                      {sub.codeBlock && (
                        <figure className="cs__code-block">
                          {sub.codeBlock.filename && (
                            <div className="cs__code-filename">{sub.codeBlock.filename}</div>
                          )}
                          <pre className={`cs__code${sub.codeBlock.language ? ` language-${sub.codeBlock.language}` : ''}`}>
                            <code>{sub.codeBlock.code}</code>
                          </pre>
                          {sub.codeBlock.caption && (
                            <figcaption className="cs__caption">{sub.codeBlock.caption}</figcaption>
                          )}
                        </figure>
                      )}
                      {sub.images && sub.images.length > 0 && (
                        <div className={`cs__approach-sub-images${sub.gridColumns ? ` cs__approach-sub-images--col-${sub.gridColumns}` : ''}`}>
                          <SectionImages images={sub.images} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : project.approachSteps && project.approachSteps.length > 0 ? (
              <section className="cs__section cs__section--alt">
                <div className="cs__section-header">
                  <span className="cs__section-number">04</span>
                  <span className="cs__micro-label">How It Came Together</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[3]}</h2>
                  {project.annotations?.approach && (
                    <p className="cs__section-aside">{project.annotations.approach}</p>
                  )}
                </div>
                <ol className="cs__approach-steps">
                  {project.approachSteps.map((step, i) => (
                    <li key={i} className="cs__approach-step">
                      <span className="cs__approach-step-num">{String(i + 1).padStart(2, '0')}</span>
                      <div className="cs__approach-step-content">
                        <h4 className="cs__approach-step-label">{step.label}</h4>
                        <p className="cs__approach-step-desc">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <SectionImages images={project.approachImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />
              </section>
            ) : null}

            {/* --- 05 Outcome --- */}
            <section className="cs__section cs__section--outcome">
              <div className="cs__section-header">
                <span className="cs__section-number">05</span>
                <span className="cs__micro-label">What Changed</span>
                <h2 className="cs__section-heading">{SECTION_LABELS[4]}</h2>
                {project.annotations?.outcome && (
                  <p className="cs__section-aside">{project.annotations.outcome}</p>
                )}
              </div>
              <div className="cs__results-grid">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="cs__result-card">
                    <span className="cs__result-value">{metric.value}</span>
                    <span className="cs__result-label">{metric.label}</span>
                  </div>
                ))}
              </div>
              {(project.outcomeNote || project.resultsNote) && (
                <p className="cs__results-note">{project.outcomeNote || project.resultsNote}</p>
              )}
              <SectionImages images={project.outcomeImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} locked={locked} />

              {/* Outcome grid — scale wall */}
              {!locked && project.outcomeGridImages && project.outcomeGridImages.length > 0 && (
                <div className="cs__outcome-grid">
                  {project.outcomeGridImages.filter(img => img.src).map((img, i) => {
                    return (
                      <figure key={i} className="cs__outcome-grid-item">
                        <button
                          type="button"
                          className="cs__img-wrap"
                          aria-label={`Open ${img.alt} at full size`}
                          onClick={(e) => openLightbox(img.src!, img.alt, lbImages.findIndex((lb) => lb.src === img.src), e.currentTarget)}
                        >
                          <img src={img.src} alt="" loading="lazy" />
                          <span className="cs__zoom-hint">&#x26F6; View full</span>
                        </button>
                        {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                      </figure>
                    );
                  })}
                </div>
              )}

              {/* Live links */}
              {project.outcomeLiveLinks && project.outcomeLiveLinks.length > 0 && (
                <div className="cs__live-links">
                  <span className="cs__live-links-label">{project.outcomeLiveLinksLabel ?? 'Select pages are live'}</span>
                  <div className="cs__live-links-list">
                    {project.outcomeLiveLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="cs__live-link">
                        {link.label} &rarr;
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan to install — the QR is decorative to AT; the link
                  beside it carries the same destination for everyone else. */}
              {project.outcomeInstall && (
                <div className="cs__install">
                  <img
                    className="cs__install-qr"
                    src={`/images/qr/${project.outcomeInstall.qr}.svg`}
                    alt=""
                    aria-hidden="true"
                    width="120"
                    height="120"
                    loading="lazy"
                  />
                  <div className="cs__install-copy">
                    <span className="cs__install-label">{project.outcomeInstall.label}</span>
                    <a
                      href={project.outcomeInstall.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cs__install-link"
                    >
                      {project.outcomeInstall.linkText} &rarr;
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <p className="cs__install-caption">{project.outcomeInstall.caption}</p>
                  </div>
                </div>
              )}

              {/* Artifacts — internal work with nothing public to link */}
              {project.outcomeArtifacts && project.outcomeArtifacts.length > 0 && (
                <div className="cs__live-links">
                  <span className="cs__live-links-label">Artifacts</span>
                  <div className="cs__live-links-list">
                    {project.outcomeArtifacts.map((artifact) => (
                      <span key={artifact} className="cs__artifact-chip">
                        {artifact}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            </>)}

            {/* --- Time to Live --- */}
            {project.timeToLive && (
              <div className="cs__time-to-live">
                <span className="cs__time-to-live-label">Time to Live</span>
                <span className="cs__time-to-live-value">{project.timeToLive}</span>
              </div>
            )}
          </>
        ) : (
          /* ==================== LEGACY LAYOUT ==================== */
          <>
            <section className="cs__overview">
              <div className="cs__overview-text">
                <h2 className="cs__section-heading">The Brief</h2>
                <p>{project.brief}</p>
                <h2 className="cs__section-heading">The Challenge</h2>
                <p>{project.challenge}</p>
                {project.ownership && project.ownership.length > 0 && (
                  <>
                    <h2 className="cs__section-heading">What I Owned</h2>
                    <ul className="cs__ownership-list">
                      {project.ownership.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <aside className="cs__overview-meta">
                <div className="cs__meta-block">
                  <h4 className="cs__meta-label">Role</h4>
                  <p className="cs__meta-value">{project.role}</p>
                </div>
                <div className="cs__meta-block">
                  <h4 className="cs__meta-label">Tools</h4>
                  <p className="cs__meta-value">{project.tools.join(', ')}</p>
                </div>
                <div className="cs__meta-block">
                  <h4 className="cs__meta-label">Timeline</h4>
                  <p className="cs__meta-value">{project.timeline}</p>
                </div>
                <div className="cs__meta-block">
                  <h4 className="cs__meta-label">Year</h4>
                  <p className="cs__meta-value">{project.year}</p>
                </div>
              </aside>
            </section>

            {project.approach && (
              <section className="cs__approach">
                <h2 className="cs__section-heading">The Approach</h2>
                <p>{project.approach}</p>
              </section>
            )}

            {project.process && project.process.length > 0 && (
              <section className="cs__process">
                <h2 className="cs__section-heading">How I Work</h2>
                <ol className="cs__process-steps">
                  {project.process.map((step, i) => (
                    <li key={i} className="cs__process-step">
                      <span className="cs__process-number">{String(i + 1).padStart(2, '0')}</span>
                      <div className="cs__process-content">
                        <h4 className="cs__process-label">{step.label}</h4>
                        <p className="cs__process-desc">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="cs__results">
              <h2 className="cs__results-heading">Results</h2>
              <div className="cs__results-grid">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="cs__result-card">
                    <span className="cs__result-value">{metric.value}</span>
                    <span className="cs__result-label">{metric.label}</span>
                  </div>
                ))}
              </div>
              {project.resultsNote && (
                <p className="cs__results-note">{project.resultsNote}</p>
              )}
            </section>

            {project.takeaways && project.takeaways.length > 0 && (
              <section className="cs__takeaways">
                <h2 className="cs__section-heading">Key Takeaways</h2>
                <ul className="cs__ownership-list">
                  {project.takeaways.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

          </>
        )}

        {/* ==================== Continue — quiet close rail (every layout) ==================== */}
        <aside className="cs__continue">
          <span className="cs__continue-label">[ In Progress ]</span>
          <p className="cs__continue-body">
            Case studies show the resolved work. The thinking behind it lands on LinkedIn first.
          </p>
          <div className="cs__continue-actions">
            <a href={EMAIL_HREF} className="cs__continue-mail">Get in touch</a>
            <LinkedInLink label="Follow the work in progress" surface="case_study_close" />
            <Link to="/design-system" className="cs__continue-mail">
              See this site&rsquo;s own design system
            </Link>
          </div>
        </aside>

        {/* ==================== Keep exploring — prev/next pager ==================== */}
        {(prevProject || nextProject) && (
          <nav className="cs__pager" aria-label="More case studies">
            <p className="cs__pager-heading">Keep exploring the work</p>
            <div className="cs__pager-links">
              {prevProject && prevProject.slug !== project.slug && (
                <Link to={`/work/${prevProject.slug}/`} className="cs__pager-link cs__pager-link--prev">
                  <svg className="cs__pager-arrow" width="54" height="24" viewBox="0 0 54 24" fill="none" aria-hidden="true">
                    <path d="M51 13 C 36 10, 18 12, 5 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 11 L13 5 M5 11 L14 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="cs__pager-copy">
                    <span className="cs__pager-eyebrow">Previous</span>
                    <span className="cs__pager-name">{redactClient(prevProject.title, locked)}</span>
                  </span>
                </Link>
              )}
              {nextProject && nextProject.slug !== project.slug && (
                <Link to={`/work/${nextProject.slug}/`} className="cs__pager-link cs__pager-link--next">
                  <span className="cs__pager-copy">
                    <span className="cs__pager-eyebrow">Next</span>
                    <span className="cs__pager-name">{redactClient(nextProject.title, locked)}</span>
                  </span>
                  <svg className="cs__pager-arrow" width="54" height="24" viewBox="0 0 54 24" fill="none" aria-hidden="true">
                    <path d="M3 13 C 18 10, 36 12, 49 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M49 11 L41 5 M49 11 L40 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={lbImages}
          current={lightbox}
          onClose={closeLightbox}
          onNav={navLightbox}
          triggerRef={lbTriggerRef}
        />
      )}
    </article>
  );
};

export default CaseStudyPage;
