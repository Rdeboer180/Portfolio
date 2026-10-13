import React from 'react';
import { Project } from '../data/projects';
import '../styles/components/_project-brand.scss';

type Brand = { name: string; src?: string; wordmark?: boolean };

const BRANDS: Record<string, Brand> = {
  wheelrack: { name: 'WheelRack' },
  playdraft: { name: 'PlayDraft', src: '/images/brands/playdraft-on-white.svg' },
  heatherwood: { name: 'Heatherwood Equestrian Academy', src: '/images/brands/heatherwood.svg', wordmark: true },
  loopstack: { name: 'LoopStack', src: '/images/brands/loopstack.svg' },
  'bolus-binder': { name: 'Bolus Binder', src: '/images/brands/bolus-binder.png' },
  'overscroll-tactics': { name: 'Overscroll Tactics', src: '/images/brands/overscroll-tactics.svg' },
};

const resolveBrand = (project: Pick<Project, 'slug' | 'client'>, locked: boolean): Brand | undefined => {
  const tireRack = project.client.startsWith('Tire Rack') && project.slug !== 'wheelrack';
  // Employer identity follows the same disclosure as the company introduction.
  if (locked && tireRack) return undefined;
  return tireRack ? { name: 'Tire Rack', src: '/images/brands/tire-rack.png', wordmark: true } : BRANDS[project.slug];
};

/**
 * The company introduction as one plate: the mark and its description share a
 * surface, so the wordmark reads as a label beside the copy instead of a
 * heading above it. Without a brand (locked employer work, neutral clients)
 * the paragraph renders alone with the same class.
 */
export function ProjectContext({ project, locked = false, className, children }: {
  project: Pick<Project, 'slug' | 'client'>;
  locked?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const brand = resolveBrand(project, locked);
  if (!brand) return <p className={className}>{children}</p>;
  return <div className={`project-context${brand.wordmark ? ' project-context--wordmark' : ''}`}>
    <ProjectBrand project={project} locked={locked} placement="context" />
    <p className={className}>{children}</p>
  </div>;
}

/** One brand treatment for cards and company introductions; dealer branding stays neutral. */
export default function ProjectBrand({ project, locked = false, placement = 'card' }: {
  project: Pick<Project, 'slug' | 'client'>;
  locked?: boolean;
  placement?: 'card' | 'context';
}) {
  const tireRack = project.client.startsWith('Tire Rack') && project.slug !== 'wheelrack';
  const brand = resolveBrand(project, locked);
  if (!brand) return null;

  return <div className={`project-brand project-brand--${placement}${brand.wordmark ? ' project-brand--wordmark' : ''}${tireRack ? ' project-brand--tire-rack' : ''}`}>
    {brand.src && <img src={brand.src} alt={brand.wordmark ? brand.name : ''}
      width={brand.wordmark ? (tireRack ? 148 : 160) : 40}
      height={brand.wordmark ? (tireRack ? 31 : 49) : 40}
      loading={placement === 'card' ? 'lazy' : 'eager'} />}
    {!brand.wordmark && <span>{brand.name}</span>}
  </div>;
}
