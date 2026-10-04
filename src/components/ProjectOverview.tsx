import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToolBucket from './ToolBucket';
import ProjectPreview from './ProjectPreview';
import LoopVideo from './LoopVideo';
import { Project, ProjectImage } from '../data/projects';
import { getHomeHref, getProjectsHref } from '../utils/homeSession';
import { PlayDraftStoreLink } from './PlayDraftRelease';
import '../styles/components/_project-overview.scss';


/** Original project artifacts retain their captions and crops. */
const OverviewMedia: React.FC<{ image: ProjectImage; opening?: boolean }> = ({ image, opening }) => {
  if (!image.src || image.isOverlay) return null;
  const crop = image.crop;
  return <figure className={opening ? 'project-overview__opening' : undefined}>
    {image.isVideo ? <LoopVideo src={image.src} poster={image.videoPoster} label={image.alt} /> :
      <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${image.alt} (opens in a new tab)`}>
        {image.displaySrc ? <img className="project-overview__cropped-evidence" src={image.displaySrc} alt={image.alt} loading={opening ? 'eager' : 'lazy'} /> : crop ? <span className="project-overview__crop" style={{ aspectRatio: `${crop.width} / ${crop.height}`, maxWidth: opening ? 620 * crop.width / crop.height : undefined, margin: '0 auto' }}>
          <img src={image.src} alt={image.alt} width={crop.sourceWidth} height={crop.sourceHeight} loading={opening ? 'eager' : 'lazy'}
            style={{ width: `${crop.sourceWidth / crop.width * 100}%`, maxWidth: 'none', height: 'auto', left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` }} />
        </span> : <img src={image.src} alt={image.alt} loading={opening ? 'eager' : 'lazy'} />}
      </a>}
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>;
};

/** A route-backed article: the rail is navigation, never a modal or a second main. */
const ProjectOverview: React.FC<{ project: Project; depth: React.ReactNode }> = ({ project, depth }) => {
  const [depthOpen, setDepthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate({ pathname: location.pathname, hash: `#${id}` }, { replace: true, state: location.state });
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const overview = project.overview!;
  const reel = project.featuredReel;
  return (
    <article className="project-overview">
      <aside className="project-overview__rail">
        <Link to={getHomeHref()} className="project-overview__home">Ryan DeBoer</Link>
        <Link to={getProjectsHref()}>← All work</Link>
        <header>
          <p className="project-overview__eyebrow">{overview.category ?? (project.stream === 'professional' ? 'Professional work' : 'Independent work')} · {project.year}</p>
          <h1>{overview.title}</h1>
          <p>{overview.status}</p>
          <p>{overview.role ?? project.role}</p>
        </header>
        <nav aria-label="Project sections">
          <a href="#project-walkthrough" onClick={event => goToSection(event, 'project-walkthrough')}>{project.featuredVideo || reel || overview.opening?.isVideo ? 'Walkthrough' : 'Project evidence'}</a>
          <a href="#project-decisions" onClick={event => goToSection(event, 'project-decisions')}>Decisions</a>
          <a href="#project-outcome" onClick={event => goToSection(event, 'project-outcome')}>Outcome</a>
          <a href="#project-depth" onClick={event => goToSection(event, 'project-depth')}>Behind the work</a>
        </nav>
        {project.slug === 'playdraft' && <PlayDraftStoreLink>Get PlayDraft for iPhone</PlayDraftStoreLink>}
        {project.slug !== 'playdraft' && project.outcomeLiveLinks?.slice(0, 2).map(link =>
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span> ↗</a>
        )}
        <div className="project-overview__tools">
          <p className="project-overview__eyebrow">Tools used</p>
          <ToolBucket slug={project.slug} tools={project.tools} />
        </div>
      </aside>
      <div className="project-overview__body">
        <section id="project-walkthrough" aria-label={project.featuredVideo || reel || overview.opening?.isVideo ? 'Product walkthrough' : 'Project evidence'}>
          {!reel && <ProjectPreview project={project} />}
          {reel && <figure className="project-overview__reel">
            <LoopVideo src={reel.src} poster={reel.poster} label={reel.alt} />
            <figcaption>{reel.caption}</figcaption>
          </figure>}
          {!project.featuredVideo && !reel && overview.opening && <OverviewMedia image={overview.opening} opening />}
          <p className="project-overview__deck">{overview.deck}</p>
          <p className="project-overview__ownership">{overview.ownership}</p>
        </section>
        <section id="project-decisions" aria-labelledby="project-decisions-title">
          <h2 id="project-decisions-title" className="project-overview__eyebrow">Key decisions</h2>
          {overview.decisions.map((decision, index) => <section className={`project-overview__decision${decision.image ? '' : ' project-overview__decision--text'}`} key={decision.title}>
            <div>
              <span className="project-overview__number" aria-hidden="true">0{index + 1}</span>
              <h3>{decision.title}</h3>
              <p>{decision.body}</p>
            </div>
            {decision.image && <OverviewMedia image={decision.image} />}
          </section>)}
        </section>
        <section id="project-outcome" className="project-overview__outcome">
          <h2>Outcome and current scope</h2>
          <p>{overview.outcome}</p>
        </section>
        <details id="project-depth" className="project-overview__depth" onToggle={event => setDepthOpen(event.currentTarget.open)}>
          <summary>Behind the work: full project details</summary>
          {depthOpen && depth}
        </details>
        <nav className="project-overview__close" aria-label="Continue exploring">
          {overview.relatedNote && <Link to={overview.relatedNote.href}>{overview.relatedNote.label} →</Link>}
          <Link to={getProjectsHref()}>Back to all work</Link>
        </nav>
      </div>
    </article>
  );
};

export default ProjectOverview;
