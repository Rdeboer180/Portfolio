import React from 'react';
import SectionBadge from './SectionBadge';
import projects from '../data/projects';

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

const SelectedWork: React.FC = () => {
  return (
    <section id="projects" className="selected-work">
      <div className="selected-work__container">
        <div className="selected-work__header">
          <SectionBadge icon={<BriefcaseIcon />} label="Case Studies" />
          <h2 className="selected-work__title">What I've designed recently</h2>
        </div>

        <div className="selected-work__list">
          {projects.filter(p => !p.hidden).map((project, index) => (
            <a
              key={project.slug}
              href={`#/work/${project.slug}`}
              className={`selected-work__card ${['wheelrack', 'tire-rack-winter', 'landing-pages'].includes(project.slug) ? 'selected-work__card--reverse' : ''}`}
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
                <div className="selected-work__card-visual-inner">
                  <img src={project.featured} alt={project.title} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
