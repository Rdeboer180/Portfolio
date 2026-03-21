import React from 'react';

interface CaseStudyMetric {
  value: string;
  label: string;
}

interface CaseStudyCardProps {
  company: string;
  title: string;
  description: string;
  tags: string[];
  metrics?: CaseStudyMetric[];
  imageSrc?: string;
  imageAlt?: string;
  year?: string;
  role?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  variant?: 'horizontal' | 'stacked';
  className?: string;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  company,
  title,
  description,
  tags,
  metrics,
  imageSrc,
  imageAlt,
  year,
  role,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  variant = 'horizontal',
  className,
}) => (
  <div className={`case-study-card case-study-card--${variant} ${className ?? ''}`}>
    <div className="case-study-card__content">
      <div className="case-study-card__meta">
        <span className="case-study-card__company">{company}</span>
        {role && <span className="case-study-card__role">{role}</span>}
      </div>

      <h3 className="case-study-card__title">{title}</h3>
      <p className="case-study-card__description">{description}</p>

      {tags.length > 0 && (
        <div className="case-study-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="case-study-card__tag">{tag}</span>
          ))}
        </div>
      )}

      {metrics && metrics.length > 0 && (
        <div className="case-study-card__metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="case-study-card__metric">
              <span className="case-study-card__metric-value">{metric.value}</span>
              <span className="case-study-card__metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      )}

      {(ctaPrimaryLabel || ctaSecondaryLabel) && (
        <div className="case-study-card__cta">
          {ctaPrimaryLabel && (
            <a href={ctaPrimaryHref ?? '#'} className="case-study-card__cta-btn case-study-card__cta-btn--primary">
              {ctaPrimaryLabel}
            </a>
          )}
          {ctaSecondaryLabel && (
            <a href={ctaSecondaryHref ?? '#'} className="case-study-card__cta-btn case-study-card__cta-btn--secondary">
              {ctaSecondaryLabel}
            </a>
          )}
        </div>
      )}
    </div>

    {imageSrc && (
      <div className="case-study-card__image">
        <img src={imageSrc} alt={imageAlt ?? title} />
      </div>
    )}

    {year && <span className="case-study-card__year">{year}</span>}
  </div>
);

export default CaseStudyCard;
