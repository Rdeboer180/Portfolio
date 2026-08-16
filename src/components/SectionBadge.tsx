import React from 'react';

interface SectionBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  /**
   * Position on the page ("01"…) — when set, the badge seats on a full-width
   * hairline with selection handles at both ends and the label becomes
   * "NN / LABEL". Numbering encodes where the reader is on a long page.
   */
  index?: string;
  /** 'accent' reserves the orange rule for exactly one section (current work). */
  tone?: 'default' | 'accent';
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ icon, label, className, index, tone }) => {
  const badge = (
    <div className={`section-badge ${index ? '' : className ?? ''}`}>
      <span className="section-badge__icon" aria-hidden="true">{icon}</span>
      <span className="section-badge__label">
        {index ? `${index} / ${label}` : label}
      </span>
    </div>
  );

  if (!index) return badge;

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
