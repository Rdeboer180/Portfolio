import React, { useState, useEffect, useCallback } from 'react';
import SectionBadge from './SectionBadge';
import projects, { Project } from '../data/projects';
import { getHomeHref, getProjectsHref } from '../utils/homeSession';
import '../styles/styles.scss';

/* ─── Lightbox ─── */
interface LightboxState { src: string; alt: string; index: number; }

const Lightbox: React.FC<{
  images: { src: string; alt: string }[];
  current: LightboxState;
  onClose: () => void;
  onNav: (index: number) => void;
}> = ({ images, current, onClose, onNav }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav((current.index + 1) % images.length);
      if (e.key === 'ArrowLeft') onNav((current.index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [current.index, images.length, onClose, onNav]);

  return (
    <div className="cs-lightbox" onClick={onClose}>
      <button className="cs-lightbox__close" onClick={onClose} aria-label="Close">&#x2715;</button>
      <div className="cs-lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.alt} className="cs-lightbox__img" />
      </div>
      {images.length > 1 && (
        <>
          <button className="cs-lightbox__prev" onClick={(e) => { e.stopPropagation(); onNav((current.index - 1 + images.length) % images.length); }} aria-label="Previous">&#8592;</button>
          <button className="cs-lightbox__next" onClick={(e) => { e.stopPropagation(); onNav((current.index + 1) % images.length); }} aria-label="Next">&#8594;</button>
          <div className="cs-lightbox__counter">{current.index + 1} / {images.length}</div>
        </>
      )}
    </div>
  );
};

const BriefcaseIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" stroke="none">
    {/* Folder body with side panel */}
    <path d="M55.44,27.02c-.712-.237-15.402-.037-16.58-.1A3.601,3.601,0,0,1,36.29,25.84l-4.97-5.09a5.609,5.609,0,0,0-4-1.69H19.08a5.739,5.739,0,0,0-6.55,5.59v3.53H7.73A3.739,3.739,0,0,0,4,31.92V54.35a5.275,5.275,0,0,0,5.26,5.27H54.41A5.601,5.601,0,0,0,60,54.02V32.52A5.595,5.595,0,0,0,55.44,27.02ZM12.53,54.35A3.265,3.265,0,0,1,6,54.35V31.92a1.739,1.739,0,0,1,1.73-1.74H12.53Z" />
    {/* Document with lines and corner fold */}
    <path d="M27.32,17.06a7.613,7.613,0,0,1,5.43,2.29l4.97,5.09a1.639,1.639,0,0,0,1.14.48c1.215.049,15.812-.107,16.58.08-.044-.577.109-9.054-.11-9.32-1.228-.002-9.544.001-10.98,0a4.432,4.432,0,0,1-4.43-4.43V3.45a2.171,2.171,0,0,0-.36-.02H21.05A3.98,3.98,0,0,0,17.08,7.4V17.14C17.631,17.031,27.32,17.06,27.32,17.06ZM23.71,6.89H35.29a1,1,0,0,1,0,2H23.71A1,1,0,0,1,23.71,6.89Zm0,4.71H35.29a1,1,0,0,1,0,2H23.71A1,1,0,0,1,23.71,11.6Z" />
    {/* Corner fold triangle */}
    <path d="M44.35,13.68H54.42a4.425,4.425,0,0,0-.98-1L42.6,4.46a4.339,4.339,0,0,0-.68-.43v7.22A2.433,2.433,0,0,0,44.35,13.68Z" />
  </svg>
);

interface CaseStudyPageProps {
  slug: string;
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug }) => {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const openLightbox = useCallback((src: string, alt: string, index: number) => setLightbox({ src, alt, index }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const navLightbox = useCallback((index: number) => {
    if (!project) return;
    const img = project.images[index];
    setLightbox({ src: img.src, alt: img.alt, index });
  }, [project]);

  if (!project) {
    return (
      <div className="cs">
        <div className="cs__container">
          <p>Project not found.</p>
          <a href={getProjectsHref()} className="cs__back">&larr; Back to all work</a>
        </div>
      </div>
    );
  }

  const nextProject: Project | undefined = projects[(projectIndex + 1) % projects.length];

  return (
    <article className="cs">
      {/* Fixed nav */}
      <nav className="cs__nav">
        <a href={getHomeHref()} className="cs__nav-logo">Ryan DeBoer</a>
        <a href={getProjectsHref()} className="cs__nav-back">&larr; All Projects</a>
      </nav>

      <div className="cs__container">
        {/* ==================== Header ==================== */}
        <header className="cs__header">
          <div className="cs__header-badge">
            <SectionBadge icon={<BriefcaseIcon />} label="Case Study" />
          </div>
          <span className="cs__client">{project.client}</span>
          <h1 className="cs__title">{project.title}</h1>
          <div className="cs__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="cs__tag">{tag}</span>
            ))}
          </div>
          <span className="cs__year">{project.year}</span>
        </header>

        {/* ==================== Featured Image ==================== */}
        <div className="cs__featured-image">
          <img src={project.featured} alt={project.title} />
        </div>

        {/* ==================== Overview (2-col) ==================== */}
        <section className="cs__overview">
          <div className="cs__overview-text">
            <h2 className="cs__section-heading">The Brief</h2>
            <p>{project.brief}</p>
            <h2 className="cs__section-heading">The Challenge</h2>
            <p>{project.challenge}</p>
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

        {/* ==================== Project Images ==================== */}
        <section className="cs__images">
          {(() => {
            const elements: React.ReactNode[] = [];
            let i = 0;
            while (i < project.images.length) {
              const img = project.images[i];

              const renderImg = (img: typeof project.images[0], idx: number) => (
                img.mobile ? (
                  <div className="cs__phone-frame" onClick={() => openLightbox(img.src, img.alt, idx)}>
                    <div className="cs__phone-notch" />
                    <img src={img.src} alt={img.alt} />
                  </div>
                ) : (
                  <div className="cs__img-wrap" onClick={() => openLightbox(img.src, img.alt, idx)}>
                    <img src={img.src} alt={img.alt} />
                    <span className="cs__zoom-hint">&#x26F6; View full</span>
                  </div>
                )
              );

              if (img.layout === 'full') {
                elements.push(
                  <figure key={i} className={`cs__figure cs__figure--full${img.mobile ? ' cs__figure--mobile' : ''}`}>
                    {renderImg(img, i)}
                    {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                  </figure>
                );
                i++;
              } else {
                const next = project.images[i + 1];
                if (next && next.layout === 'half') {
                  elements.push(
                    <div key={i} className="cs__image-pair">
                      <figure className={`cs__figure cs__figure--half${img.mobile ? ' cs__figure--mobile' : ''}`}>
                        {renderImg(img, i)}
                        {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                      </figure>
                      <figure className={`cs__figure cs__figure--half${next.mobile ? ' cs__figure--mobile' : ''}`}>
                        {renderImg(next, i + 1)}
                        {next.caption && <figcaption className="cs__caption">{next.caption}</figcaption>}
                      </figure>
                    </div>
                  );
                  i += 2;
                } else {
                  elements.push(
                    <figure key={i} className={`cs__figure cs__figure--half cs__figure--solo${img.mobile ? ' cs__figure--mobile' : ''}`}>
                      {renderImg(img, i)}
                      {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                    </figure>
                  );
                  i++;
                }
              }
            }
            return elements;
          })()}
        </section>

        {/* ==================== Results ==================== */}
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

        {/* ==================== Next Project ==================== */}
        {nextProject && nextProject.slug !== project.slug && (
          <a href={`#/work/${nextProject.slug}`} className="cs__next">
            <span className="cs__next-label">Next Project</span>
            <div className="cs__next-card">
              <img src={nextProject.featured} alt={nextProject.title} className="cs__next-image" />
              <div className="cs__next-overlay">
                <span className="cs__next-client">{nextProject.client}</span>
                <span className="cs__next-title">{nextProject.title}</span>
                <span className="cs__next-arrow">
                  View project &rarr;
                </span>
              </div>
            </div>
          </a>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={project.images}
          current={lightbox}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </article>
  );
};

export default CaseStudyPage;
