import React from 'react';
import SectionBadge from './SectionBadge';
import projects, { Project } from '../data/projects';
import '../styles/styles.scss';

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

interface CaseStudyPageProps {
  slug: string;
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug }) => {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    return (
      <div className="cs">
        <div className="cs__container">
          <p>Project not found.</p>
          <a href="/#projects" className="cs__back">&larr; Back to all work</a>
        </div>
      </div>
    );
  }

  const nextProject: Project | undefined = projects[(projectIndex + 1) % projects.length];

  return (
    <article className="cs">
      {/* Fixed nav */}
      <nav className="cs__nav">
        <a href="/" className="cs__nav-logo">Ryan DeBoer</a>
        <a href="/#projects" className="cs__nav-back">&larr; All Projects</a>
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

              if (img.layout === 'full') {
                elements.push(
                  <figure key={i} className={`cs__figure cs__figure--full${img.mobile ? ' cs__figure--mobile' : ''}`}>
                    {img.mobile ? (
                      <div className="cs__phone-frame">
                        <div className="cs__phone-notch" />
                        <img src={img.src} alt={img.alt} />
                      </div>
                    ) : (
                      <img src={img.src} alt={img.alt} />
                    )}
                    {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                  </figure>
                );
                i++;
              } else {
                // Pair consecutive half images
                const next = project.images[i + 1];
                if (next && next.layout === 'half') {
                  elements.push(
                    <div key={i} className="cs__image-pair">
                      <figure className={`cs__figure cs__figure--half${img.mobile ? ' cs__figure--mobile' : ''}`}>
                        {img.mobile ? (
                          <div className="cs__phone-frame">
                            <div className="cs__phone-notch" />
                            <img src={img.src} alt={img.alt} />
                          </div>
                        ) : (
                          <img src={img.src} alt={img.alt} />
                        )}
                        {img.caption && <figcaption className="cs__caption">{img.caption}</figcaption>}
                      </figure>
                      <figure className={`cs__figure cs__figure--half${next.mobile ? ' cs__figure--mobile' : ''}`}>
                        {next.mobile ? (
                          <div className="cs__phone-frame">
                            <div className="cs__phone-notch" />
                            <img src={next.src} alt={next.alt} />
                          </div>
                        ) : (
                          <img src={next.src} alt={next.alt} />
                        )}
                        {next.caption && <figcaption className="cs__caption">{next.caption}</figcaption>}
                      </figure>
                    </div>
                  );
                  i += 2;
                } else {
                  elements.push(
                    <figure key={i} className={`cs__figure cs__figure--half cs__figure--solo${img.mobile ? ' cs__figure--mobile' : ''}`}>
                      {img.mobile ? (
                        <div className="cs__phone-frame">
                          <div className="cs__phone-notch" />
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ) : (
                        <img src={img.src} alt={img.alt} />
                      )}
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
    </article>
  );
};

export default CaseStudyPage;
