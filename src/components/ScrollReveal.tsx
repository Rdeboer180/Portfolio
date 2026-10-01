import React from 'react';
import { useReveal } from '../hooks/useReveal';

/** Shares the About page's once-in-view motion and reduced-motion behavior. */
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const [ref, visible] = useReveal<HTMLDivElement>(0.15);
  return <div ref={ref} className={`reveal-fade ${className}${visible ? ' is-visible' : ''}`}>{children}</div>;
};

export default ScrollReveal;
