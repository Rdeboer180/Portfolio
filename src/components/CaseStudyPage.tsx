import React, { useState, useEffect, useCallback, useMemo } from 'react';
import projects, { Project, ProjectImage } from '../data/projects';
import { getHomeHref, getProjectsHref } from '../utils/homeSession';
import OverlayCard from './OverlayCard';
import PasswordModal from './PasswordModal';
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


/* ─── Helpers ─── */
const allLightboxImages = (project: Project): { src: string; alt: string }[] => {
  const imgs: { src: string; alt: string }[] = [];
  const addSection = (sectionImages?: ProjectImage[]) => {
    if (sectionImages) sectionImages.forEach((img) => {
      if (img.src) imgs.push({ src: img.src, alt: img.alt });
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
  // Legacy images
  if (project.images) project.images.forEach((img) => {
    if (img.src) imgs.push({ src: img.src, alt: img.alt });
  });
  return imgs;
};

const SECTION_LABELS = ['Problem', 'Gaps & Opportunity', 'Constraints', 'Approach', 'Outcome'];

/* ─── Section Image Renderer ─── */
const SectionImages: React.FC<{
  images: ProjectImage[];
  allImages: { src: string; alt: string }[];
  onOpen: (src: string, alt: string, index: number) => void;
  isUnlocked?: boolean;
  onOverlayClick?: () => void;
}> = ({ images, allImages, onOpen, isUnlocked, onOverlayClick }) => {
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
    // Render actual images
    return img.mobile ? (
      <div className="cs__phone-frame" onClick={() => onOpen(img.src!, img.alt, findGlobalIndex(img.src!))}>
        <div className="cs__phone-notch" />
        <img src={img.src} alt={img.alt} />
      </div>
    ) : (
      <div className="cs__img-wrap" onClick={() => onOpen(img.src!, img.alt, findGlobalIndex(img.src!))}>
        <img src={img.src} alt={img.alt} />
        <span className="cs__zoom-hint">&#x26F6; View full</span>
      </div>
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
      elements.push(
        <figure key={i} className={`cs__figure cs__figure--full${img.mobile ? ' cs__figure--mobile' : ''}`}>
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
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const hasOverlayImages = useCallback((proj: Project) => {
    const allImages = [
      ...(proj.problemImages || []),
      ...(proj.gapsImages || []),
      ...(proj.constraintsImages || []),
      ...(proj.outcomeImages || []),
      ...(proj.outcomeGridImages || []),
      ...(proj.images || []),
    ];
    if (proj.approachSubsections) {
      proj.approachSubsections.forEach((sub) => {
        if (sub.images) allImages.push(...sub.images);
      });
    }
    return allImages.some((img) => img.isOverlay);
  }, []);

  useEffect(() => {
    if (project) {
      const unlockedKey = `project-unlocked-${project.slug}`;
      const dismissedKey = `project-dismissed-${project.slug}`;
      const unlocked = localStorage.getItem(unlockedKey) === 'true';
      const dismissed = localStorage.getItem(dismissedKey) === 'true';

      setIsUnlocked(unlocked);

      const hasOverlay = hasOverlayImages(project);
      setShowPasswordModal(hasOverlay && !unlocked && !dismissed);
    }
  }, [project, hasOverlayImages]);

  const handleUnlock = () => {
    if (project) {
      localStorage.setItem(`project-unlocked-${project.slug}`, 'true');
      setIsUnlocked(true);
      setShowPasswordModal(false);
    }
  };

  const handleDismiss = () => {
    if (project) {
      localStorage.setItem(`project-dismissed-${project.slug}`, 'true');
      setShowPasswordModal(false);
    }
  };

  const handleOverlayClick = () => {
    if (!isUnlocked) {
      setShowPasswordModal(true);
    }
  };

  const lbImages = useMemo(() => project ? allLightboxImages(project) : [], [project]);
  const openLightbox = useCallback((src: string, alt: string, index: number) => setLightbox({ src, alt, index }), []);
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
          <a href={getProjectsHref()} className="cs__back">&larr; Back to all work</a>
        </div>
      </div>
    );
  }

  const nextProject: Project | undefined = projects[(projectIndex + 1) % projects.length];
  const hasNewFormat = !!(project.problem || project.gaps || project.constraints || project.approachSteps || project.approachSubsections);

  return (
    <article className="cs">
      {showPasswordModal && <PasswordModal onUnlock={handleUnlock} onDismiss={handleDismiss} />}
      {/* Fixed nav */}
      <nav className="cs__nav">
        <a href={getHomeHref()} className="cs__nav-logo">Ryan DeBoer</a>
        <a href={getProjectsHref()} className="cs__nav-back">&larr; All Projects</a>
      </nav>

      <div className="cs__container">
        {/* ==================== Header ==================== */}
        <header className="cs__header">
          <span className="cs__eyebrow">Case Study</span>
          <span className="cs__client">{project.client}</span>
          <h1 className="cs__title">{project.title}</h1>
          {project.summary && (
            <p className="cs__summary">{project.summary}</p>
          )}
          <div className="cs__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="cs__tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* ==================== Featured Image ==================== */}
        <div className="cs__featured-image">
          <img src={project.featured} alt={project.title} />
        </div>

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
                </div>
                {project.problemPunch && (
                  <p className="cs__punch">{project.problemPunch}</p>
                )}
                <ul className="cs__section-bullets">
                  {project.problem.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <SectionImages images={project.problemImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />
              </section>
            )}

            {/* --- 02 Gaps & Opportunity --- */}
            {project.gaps && project.gaps.length > 0 && (
              <section className="cs__section cs__section--alt">
                <div className="cs__section-header">
                  <span className="cs__section-number">02</span>
                  <span className="cs__micro-label">What Was Missing</span>
                  <h2 className="cs__section-heading">{SECTION_LABELS[1]}</h2>
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
                </div>
                <div className="cs__approach-subs">
                  {project.approachSubsections.map((sub) => (
                    <div key={sub.key} className="cs__approach-sub">
                      {sub.systemMarker && (
                        <span className="cs__system-marker">{sub.systemMarker}</span>
                      )}
                      <h3 className="cs__approach-sub-label">{sub.label}</h3>
                      <p className="cs__approach-sub-desc">{sub.description}</p>
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
              <SectionImages images={project.outcomeImages || []} allImages={lbImages} onOpen={openLightbox} isUnlocked={isUnlocked} onOverlayClick={handleOverlayClick} />

              {/* Outcome grid — scale wall */}
              {project.outcomeGridImages && project.outcomeGridImages.length > 0 && (
                <div className="cs__outcome-grid">
                  {project.outcomeGridImages.filter(img => img.src).map((img, i) => (
                    <figure key={i} className="cs__outcome-grid-item">
                      <div className="cs__img-wrap" onClick={() => openLightbox(img.src!, img.alt, lbImages.findIndex((lb) => lb.src === img.src))}>
                        <img src={img.src} alt={img.alt} />
                        <span className="cs__zoom-hint">&#x26F6; View full</span>
                      </div>
                      {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              )}

              {/* Live links */}
              {project.outcomeLiveLinks && project.outcomeLiveLinks.length > 0 && (
                <div className="cs__live-links">
                  <span className="cs__live-links-label">Select pages are live</span>
                  <div className="cs__live-links-list">
                    {project.outcomeLiveLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="cs__live-link">
                        {link.label} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

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

            {project.images && project.images.length > 0 && (
              <section className="cs__images">
                {(() => {
                  const elements: React.ReactNode[] = [];
                  let i = 0;
                  while (i < project.images.length) {
                    const img = project.images[i];
                    const renderImg = (img: ProjectImage, idx: number) => (
                      img.mobile ? (
                        <div className="cs__phone-frame" onClick={() => openLightbox(img.src!, img.alt, idx)}>
                          <div className="cs__phone-notch" />
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ) : (
                        <div className="cs__img-wrap" onClick={() => openLightbox(img.src!, img.alt, idx)}>
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

        {/* ==================== Next Project ==================== */}
        {nextProject && nextProject.slug !== project.slug && (
          <a href={`#/work/${nextProject.slug}`} className="cs__next">
            <span className="cs__next-label">Next Project</span>
            <div className="cs__next-card">
              <img src={nextProject.featured} alt={nextProject.title} className="cs__next-image" />
              <div className="cs__next-overlay">
                <span className="cs__next-client">{nextProject.client}</span>
                <span className="cs__next-title">{nextProject.title}</span>
                <span className="cs__next-arrow">View project &rarr;</span>
              </div>
            </div>
          </a>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={lbImages}
          current={lightbox}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </article>
  );
};

export default CaseStudyPage;
