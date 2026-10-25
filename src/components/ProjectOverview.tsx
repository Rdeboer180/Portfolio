import { reviewHref } from '../utils/reviewRoutes';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ToolBucket from './ToolBucket';
import ProjectPreview from './ProjectPreview';
import LoopVideo from './LoopVideo';
import { Project, ProjectImage, ProjectOverview as ProjectOverviewData } from '../data/projects';
import { getHomeHref, getProjectsHref, HOME_TOP_STATE } from '../utils/homeSession';
import { PlayDraftStoreLink } from './PlayDraftRelease';
import '../styles/components/_project-overview.scss';
import { ProjectContext } from './ProjectBrand';
import FramedViewport from './FramedViewport';
import BinderTop from './BinderTop';
import BrandIntro from './BrandIntro';
import WheelRackFitmentPrototype from './WheelRackFitmentPrototype';

/** Live code prototypes a decision can embed (decision.prototype.id). Each also lives in its note. */
const PROTOTYPES: Record<NonNullable<ProjectOverviewData['decisions'][number]['prototype']>['id'], React.FC> = {
  'wheelrack-fitment': WheelRackFitmentPrototype,
};

/** The prototype itself, in place under its decision, with the way out to the note that explains it. */
const OverviewPrototype: React.FC<{ prototype: NonNullable<ProjectOverviewData['decisions'][number]['prototype']> }> = ({ prototype }) => {
  const Prototype = PROTOTYPES[prototype.id];
  const titleId = `prototype-${prototype.id}`;
  return <section className="project-overview__prototype" aria-labelledby={titleId}>
    <p className="project-overview__eyebrow">Code prototype</p>
    <h3 id={titleId}>{prototype.title}</h3>
    <p>{prototype.lead}</p>
    <Prototype />
    <Link to={prototype.href} className="project-overview__prototype-link">{prototype.label} →</Link>
  </section>;
};

/** Keep related work in the sentence, with the same route-backed drawer navigation. */
const DecisionCopy: React.FC<{ decision: ProjectOverviewData['decisions'][number] }> = ({ decision }) => {
  const link = decision.bodyLink;
  const index = link ? decision.body.indexOf(link.text) : -1;
  if (!link || index < 0) return <>{decision.body}</>;
  return <>{decision.body.slice(0, index)}<Link to={link.to}>{link.text}</Link>{decision.body.slice(index + link.text.length)}</>;
};

/** Overview media stops growing at this height. The stylesheet already holds
 *  the opening image, the loops and the preview to 620px; a cropped artifact
 *  reaches the same ceiling through its width (--overview-media-cap), so a
 *  portrait phone capture cannot grow into a column-wide tower, while a
 *  landscape board, whose capped width exceeds any column, never notices. */
const MEDIA_MAX_HEIGHT = 620;

/** Width at which a cropped artifact is MEDIA_MAX_HEIGHT tall, or undefined when its ratio is unknown. */
const cappedWidth = (image?: ProjectImage) => image?.crop ? MEDIA_MAX_HEIGHT * image.crop.width / image.crop.height : undefined;

/** A comparison row shares one cap. A loop carries no crop, so it takes the
 *  width of the stills beside it: the row already gives a loop the same column
 *  as a still, and the cap keeps that pairing once columns outgrow the still. */
const rowCaps = (images: ProjectImage[]) => {
  const own = images.map(cappedWidth);
  const shared = Math.min(...own.filter((cap): cap is number => cap !== undefined));
  return Number.isFinite(shared) ? own.map(cap => cap ?? shared) : own;
};

/** Original project artifacts retain their captions and crops. `cap` is the
 *  figure's widest useful size in px; the stylesheet applies it only where a
 *  column could exceed it. */
const OverviewMedia: React.FC<{ image: ProjectImage; opening?: boolean; cap?: number }> = ({ image, opening, cap }) => {
  if (!image.src || image.isOverlay) return null;
  const crop = image.crop;
  if (image.frame) return <figure className={`project-overview__framed project-overview__framed--${image.frame}`}>
    <FramedViewport kind={image.frame} src={image.src} alt={image.alt} />
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>;
  return <figure className={opening ? 'project-overview__opening' : undefined} style={cap ? { ['--overview-media-cap' as string]: `${Math.round(cap)}px` } : undefined}>
    {image.isVideo ? <LoopVideo src={image.src} poster={image.videoPoster} label={image.alt} /> :
      <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${image.alt} (opens in a new tab)`}>
        {image.displaySrc ? <img className="project-overview__cropped-evidence" src={image.displaySrc} alt={image.alt} loading={opening ? 'eager' : 'lazy'} /> : crop ? <span className="project-overview__crop" style={{ aspectRatio: `${crop.width} / ${crop.height}`, maxWidth: opening ? cappedWidth(image) : undefined, margin: '0 auto' }}>
          <img src={image.src} alt={image.alt} width={crop.sourceWidth} height={crop.sourceHeight} loading={opening ? 'eager' : 'lazy'}
            style={{ width: `${crop.sourceWidth / crop.width * 100}%`, maxWidth: 'none', height: 'auto', left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` }} />
        </span> : <img src={image.src} alt={image.alt} loading={opening ? 'eager' : 'lazy'} />}
      </a>}
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>;
};

/** Live variants side by side. Capped rows spread across the body instead of
 *  leaving each figure in half of it; see --overview-media-cap in the stylesheet. */
const ComparisonRow: React.FC<{ title: string; images: ProjectImage[] }> = ({ title, images }) => {
  const caps = rowCaps(images);
  return <div className={`project-overview__comparison${caps.every(Boolean) ? ' project-overview__comparison--capped' : ''}`} aria-label={`${title}: live variants`}>
    {images.map((image, index) => <OverviewMedia key={image.src} image={image} cap={caps[index]} />)}
  </div>;
};

/** A route-backed article: the rail is navigation, never a modal or a second main. */
const ProjectOverview: React.FC<{ project: Project }> = ({ project }) => {
  const location = useLocation();
  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    // The address only: the router's navigate gave the location a new key,
    // which replayed the panel's arrival (focus to the title, an instant jump
    // to the hash) over the smooth scroll and lost the reader's place.
    window.history.replaceState(window.history.state, '', `#${id}`);
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
    // Images above the target are lazy and unsized, so the page grows under
    // the scroll and the section lands short: once the page is still again,
    // or when it last changes size, the scroll is made good.
    const article = target.closest<HTMLElement>('.project-panel__article') ?? document.scrollingElement as HTMLElement;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const again = () => target.scrollIntoView({ behavior: 'auto', block: 'start' });
    const watcher = new ResizeObserver(() => { clearTimeout(settle); settle = setTimeout(again, 120); });
    watcher.observe(article.firstElementChild ?? article);
    setTimeout(() => { watcher.disconnect(); clearTimeout(settle); }, 2500);
  };
  const overview = project.overview!;
  const reel = project.featuredReel;
  const [introDone, setIntroDone] = React.useState(false);
  // Opened from the homepage binder: the study's top is the binder's (the
  // sleeve its card tucks into, the reel and the walkthrough video), first in
  // the article so a phone shows it before the rail.
  const fromBinder = location.state?.fromBinder === project.slug && typeof window !== 'undefined' && Boolean(window.binderHome);
  return (
    <article className={`project-overview${fromBinder ? ' project-overview--binder' : ''}`}>
      {fromBinder && <BinderTop slug={project.slug} id="project-walkthrough" />}
      <aside className="project-overview__rail">
        <Link to={getHomeHref()} state={HOME_TOP_STATE} className="project-overview__home">Ryan DeBoer</Link>
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
        </nav>
        {project.slug === 'playdraft' && <PlayDraftStoreLink>Get PlayDraft for iPhone</PlayDraftStoreLink>}
        {project.slug !== 'playdraft' && project.outcomeLiveLinks?.slice(0, 2).map(link =>
          <a key={link.url} href={reviewHref(link.url)} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span> ↗</a>
        )}
        <div className="project-overview__tools">
          <p className="project-overview__eyebrow">Tools used</p>
          <ToolBucket slug={project.slug} tools={project.tools} />
        </div>
      </aside>
      <div className="project-overview__body">
        <section id={fromBinder ? undefined : 'project-walkthrough'} aria-label={project.featuredVideo || reel || overview.opening?.isVideo ? 'Product walkthrough' : 'Project evidence'}>
          {!fromBinder && !reel && <ProjectPreview project={project} />}
          {!fromBinder && reel && <figure className="project-overview__reel">
            {/* A brand intro draws in over the reel's poster and holds the
                loop until its plate lifts (Bolus Binder opens on T1D Hub). */}
            <div className="project-overview__reel-frame">
              <LoopVideo src={reel.src} poster={reel.poster} label={reel.alt} captions={reel.captions} hold={Boolean(project.reelIntro) && !introDone} />
              {project.reelIntro && !introDone && <BrandIntro brand={project.reelIntro} onDone={() => setIntroDone(true)} />}
            </div>
            <figcaption>{reel.caption}</figcaption>
          </figure>}
          {!fromBinder && !project.featuredVideo && !reel && overview.opening && <OverviewMedia image={overview.opening} opening />}
          {project.context && <ProjectContext project={project} className="project-overview__context">{project.context}</ProjectContext>}
          <p className="project-overview__deck">{overview.deck}</p>
          <p className="project-overview__ownership">{overview.ownership}</p>
          {overview.evidence?.length ? (
            <div className="project-overview__evidence" aria-label="Starter template and internal tools">
              {overview.evidence.map(image => <OverviewMedia key={image.src} image={image} />)}
            </div>
          ) : project.publicPreview && <div style={{ maxWidth: project.publicPreview.maxWidth, margin: '24px auto' }}><OverviewMedia image={project.publicPreview} /></div>}
        </section>
        <section id="project-decisions" aria-labelledby="project-decisions-title">
          <h2 id="project-decisions-title" className="project-overview__eyebrow">Key decisions</h2>
          {overview.decisions.map((decision, index) => <React.Fragment key={decision.title}>
          {decision.part && decision.part !== overview.decisions[index - 1]?.part && <h3 className="project-overview__part">{decision.part}</h3>}
          <section className={`project-overview__decision${decision.images?.length ? ' project-overview__decision--comparison' : decision.image ? '' : ' project-overview__decision--text'}`}>
            <div>
              <span className="project-overview__number" aria-hidden="true">0{index + 1}</span>
              <h3>{decision.title}</h3>
              <p><DecisionCopy decision={decision} /></p>
            </div>
            {decision.images?.length ? <ComparisonRow title={decision.title} images={decision.images} /> : decision.image && <OverviewMedia image={decision.image} cap={cappedWidth(decision.image)} />}
            {(decision.wide || decision.artboards?.length || decision.gallery?.length || decision.sheet || decision.points?.length || decision.code || decision.quote) && <div className="project-overview__proof">
              {decision.wide && <OverviewMedia image={decision.wide} />}
              {decision.artboards?.length ? <div className="project-overview__artboards">{decision.artboards.map(image => <OverviewMedia key={image.src} image={image} />)}</div> : null}
              {decision.gallery?.length ? <div className="project-overview__gallery">{decision.gallery.map(image => <OverviewMedia key={image.src} image={image} />)}</div> : null}
              {decision.sheet && <div className="project-overview__sheet"><OverviewMedia image={decision.sheet} /></div>}
              {decision.points?.length ? <ul className="project-overview__points">{decision.points.map(point => <li key={point}>{point}</li>)}</ul> : null}
              {decision.code && <figure className="project-overview__code">
                {decision.code.filename && <div className="project-overview__code-file">{decision.code.filename}</div>}
                <pre><code>{decision.code.code}</code></pre>
                {decision.code.caption && <figcaption>{decision.code.caption}</figcaption>}
              </figure>}
              {decision.quote && <figure className="project-overview__quote">
                <blockquote><p>{decision.quote.text}</p></blockquote>
                <figcaption>{decision.quote.name}<span>{decision.quote.role}</span></figcaption>
              </figure>}
            </div>}
          </section>
          {decision.prototype && <OverviewPrototype prototype={decision.prototype} />}</React.Fragment>)}
        </section>
        <section id="project-outcome" className="project-overview__outcome">
          <h2>Outcome and current scope</h2>
          {overview.outcomeMetric && <p className="project-overview__metric">
            <span className="project-overview__metric-value">{overview.outcomeMetric.value}</span>
            {overview.outcomeMetric.label && <span className="project-overview__metric-label">{overview.outcomeMetric.label}</span>}
            {overview.outcomeMetric.context && <span className="project-overview__metric-context">{overview.outcomeMetric.context}</span>}
          </p>}
          <p>{overview.outcome}</p>
          {overview.outcomeImages?.filter(Boolean).length ? (overview.outcomeImages.length > 1
            ? <ComparisonRow title="Outcome" images={overview.outcomeImages} />
            : <OverviewMedia image={overview.outcomeImages[0]} />) : null}
        </section>
        <nav className="project-overview__close" aria-label="Continue exploring">
          {overview.relatedNote && <Link to={overview.relatedNote.href}>{overview.relatedNote.label} →</Link>}
          <Link to={getProjectsHref()}>Back to all work</Link>
        </nav>
      </div>
    </article>
  );
};

export default ProjectOverview;
