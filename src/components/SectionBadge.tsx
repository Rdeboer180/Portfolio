import React from 'react';

interface SectionBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ icon, label, className }) => (
  <div className={`section-badge ${className ?? ''}`}>
    <span className="section-badge__icon">{icon}</span>
    <span className="section-badge__label">{label}</span>
  </div>
);

export default SectionBadge;
