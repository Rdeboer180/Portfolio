import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: { label: string; href: string };
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backLink, className }) => (
  <header className={`page-header ${className ?? ''}`}>
    {backLink && (
      <a href={backLink.href} className="page-header__back">
        &larr; {backLink.label}
      </a>
    )}
    <h1 className="page-header__title">{title}</h1>
    {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
  </header>
);

export default PageHeader;
