import React from 'react';
import SectionBadge from './SectionBadge';
import projects from '../data/projects';

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SelectedWork: React.FC = () => {
  return (
    <section id="projects" className="selected-work">
      <div className="selected-work__container">
        <div className="selected-work__header">
          <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" />
          <h2 className="selected-work__title">What I've designed recently</h2>
        </div>

        <div className="selected-work__list">
          {projects.map((project, index) => (
            <a
              key={project.slug}
              href={`#/work/${project.slug}`}
              className={`selected-work__card ${index % 2 !== 0 ? 'selected-work__card--reverse' : ''}`}
            >
              <div className="selected-work__card-body">
                <h3 className="selected-work__card-title">{project.title}</h3>
                <div className="selected-work__card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="selected-work__card-tag">{tag}</span>
                  ))}
                </div>
                {project.metrics.length > 0 && (
                  <div className="selected-work__card-stats">
                    {project.metrics.map((metric) => (
                      <span key={metric.label} className="selected-work__card-stat">
                        {metric.value} <span className="selected-work__card-stat-label">{metric.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="selected-work__card-visual">
                <img src={project.featured} alt={project.title} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
