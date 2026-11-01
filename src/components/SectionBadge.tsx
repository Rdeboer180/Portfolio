import React from 'react';

interface SectionBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  /** Seats the badge on a full-width hairline with selection handles at both ends. */
  ruled?: boolean;
  /**
   * @deprecated Numbered sections ("02 / LABEL") were cut from the site in
   * November 2026; use `ruled`. Kept, still rendering its number, only so the
   * About desk draft builds unchanged until its own cleanup pass removes it.
   */
  index?: string;
  /** 'accent' reserves the orange rule for exactly one section (current work). */
  tone?: 'default' | 'accent';
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ icon, label, className, ruled: ruledProp = false, index, tone }) => {
  const ruled = ruledProp || Boolean(index);
  const badge = (
    <div className={`section-badge ${ruled ? '' : className ?? ''}`}>
      <span className="section-badge__icon" aria-hidden="true">{icon}</span>
      <span className="section-badge__label">{index ? `${index} / ${label}` : label}</span>
    </div>
  );

  if (!ruled) return badge;

  return (
    <div
      className={`section-rule${tone === 'accent' ? ' section-rule--accent' : ''} ${className ?? ''}`}
    >
      <span className="section-rule__handle" aria-hidden="true" />
      {badge}
      <span className="section-rule__line" aria-hidden="true" />
      <span className="section-rule__handle" aria-hidden="true" />
    </div>
  );
};

export default SectionBadge;
