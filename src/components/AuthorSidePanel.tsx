import React, { useId, useMemo, useState } from 'react';
import SidePanelShell from './SidePanelShell';
import { cardTitleFor, orderedProjects } from '../data/projects';
import { KIND_LABEL, NOTES_BY_DATE } from '../data/notes';
import { useAuthorMode } from '../context/AuthorModeContext';
import { useUnlock } from '../context/UnlockContext';
import { AUTHORED_COMPONENTS, AUTHORED_LIST } from '../data/authorChrome';
import WorkNavigator from './WorkNavigator';

type AssetKind = 'study' | 'note' | 'fragment';

interface Asset {
  kind: AssetKind;
  key: string;
  title: string;
  meta: string;
  /** Reading-panel route. The site-wide panel navigation handles the click. */
  href?: string;
  poster?: string;
  /** Employer or client work: locked until the session is unlocked. */
  protectedStream?: boolean;
  /** Cover footage reviewed and approved for display before unlock. */
  publicMedia?: boolean;
  /** Fragments live on this page; selecting one scrolls to it. */
  component?: string;
}

const FILTERS: { id: AssetKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'study', label: 'Case studies' },
  { id: 'note', label: 'Notes' },
  { id: 'fragment', label: 'Experience fragments' },
];

/**
 * The same rules the homepage cards use: the still is the loop's poster, and
 * nothing from the professional stream shows its media before unlock unless it
 * was explicitly approved. The finder may move public information forward; it
 * never discloses new information.
 */
const buildAssets = (): Asset[] => {
  const studies: Asset[] = orderedProjects().map((project) => {
    const video = project.featuredVideo;
    const poster = video ? video.split('?')[0].replace(/\.mp4$/, '-poster.jpg') : project.featured;
    const ext = video ? 'mp4' : (poster?.split('.').pop() ?? 'page');
    return {
      kind: 'study',
      key: project.slug,
      title: cardTitleFor(project),
      meta: `${project.slug} · ${project.year} · ${project.stream ?? 'public'} · ${ext}`,
      href: `/work/${project.slug}/`,
      poster,
      protectedStream: project.stream === 'professional',
      publicMedia: Boolean(video && project.featuredVideoPublic),
    };
  });
  const notes: Asset[] = NOTES_BY_DATE.map((note) => ({
    kind: 'note',
    key: note.slug,
    title: note.title,
    meta: `notes/${note.slug} · ${KIND_LABEL[note.kind]} · ${note.read}`,
    href: `/notes/${note.slug}/`,
  }));
  const fragments: Asset[] = [{
    kind: 'fragment',
    key: 'writing',
    title: AUTHORED_COMPONENTS.writing.label,
    meta: `${AUTHORED_COMPONENTS.writing.component} · the three newest notes`,
    component: AUTHORED_COMPONENTS.writing.component,
  }];
  return [...studies, ...notes, ...fragments];
};

const LockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const NoteGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" focusable="false">
    <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
    <path d="M14 3v4h4M10 12h5M10 16h5" strokeLinecap="round" />
  </svg>
);
const FragmentGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 10h16M10 10v10" />
  </svg>
);

/**
 * AEM's Side Panel in Author mode: the Assets finder (the DAM), with the work
 * navigator's folders under Case studies, and the Components browser, in the
 * docked column SidePanelShell provides. Desktop only, like the editor it quotes.
 */
const AuthorSidePanel: React.FC = () => {
  const { authoring, ui, update, selectComponent } = useAuthorMode();
  const { unlocked } = useUnlock();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AssetKind | 'all'>('all');
  const assets = useMemo(buildAssets, []);
  const baseId = useId();

  if (!authoring || !ui.panelOpen) return null;

  const needle = query.trim().toLowerCase();
  const visible = assets.filter((asset) =>
    (filter === 'all' || asset.kind === filter)
    && (!needle || asset.title.toLowerCase().includes(needle) || asset.meta.toLowerCase().includes(needle)));
  const counts = {
    study: assets.filter((a) => a.kind === 'study').length,
    note: assets.filter((a) => a.kind === 'note').length,
    fragment: assets.filter((a) => a.kind === 'fragment').length,
  };

  const renderThumb = (asset: Asset, mediaLocked: boolean) => {
    if (asset.kind === 'note') return <span className="dam__thumb dam__thumb--glyph"><NoteGlyph /></span>;
    if (asset.kind === 'fragment') return <span className="dam__thumb dam__thumb--glyph"><FragmentGlyph /></span>;
    if (mediaLocked || !asset.poster) return <span className="dam__thumb dam__thumb--glyph dam__thumb--locked"><LockGlyph /></span>;
    return (
      <span className="dam__thumb">
        <img src={asset.poster} alt="" loading="lazy" onError={(event) => { event.currentTarget.parentElement?.classList.add('dam__thumb--missing'); }} />
      </span>
    );
  };

  return (
    <SidePanelShell title="Asset Panel" label="Asset panel" closeLabel="Close asset panel" onClose={() => update({ panelOpen: false })} variant="author">

      <div className="side-panel__tabs" role="tablist" aria-label="Asset panel tabs">
        {(['assets', 'components'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab}`}
            aria-selected={ui.panelTab === tab}
            aria-controls={`${baseId}-panel-${tab}`}
            className="side-panel__tab"
            onClick={() => update({ panelTab: tab })}
          >
            {tab === 'assets' ? 'Assets' : 'Components'}
          </button>
        ))}
      </div>

      {ui.panelTab === 'assets' ? (
        <div id={`${baseId}-panel-assets`} role="tabpanel" aria-labelledby={`${baseId}-tab-assets`} className="side-panel__body dam">
          <label className="dam__search">
            <span className="sr-only">Search assets</span>
            <input type="search" value={query} placeholder="Search assets" onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="dam__filters" role="group" aria-label="Asset type">
            {FILTERS.map((option) => (
              <button key={option.id} type="button" className="dam__filter" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
                {option.label}
              </button>
            ))}
          </div>
          <p className="dam__count" aria-live="polite">
            {visible.length} of {assets.length} · {counts.study} case studies · {counts.note} notes · {counts.fragment} fragment
          </p>
          {/* The Case studies filter opens the work navigator's folders, the
              way AEM Assets files a collection: by discipline and by client,
              each folder filtering the work section on the page. A search
              falls back to the flat results. */}
          {filter === 'study' && !needle ? <WorkNavigator /> : (
          <ul className="dam__list">
            {visible.map((asset) => {
              const locked = Boolean(asset.protectedStream) && !unlocked;
              const mediaLocked = locked && !asset.publicMedia;
              const lockId = `${baseId}-lock-${asset.key}`;
              const body = (
                <>
                  {renderThumb(asset, mediaLocked)}
                  <span className="dam__name">{asset.title}</span>
                  <span className="dam__meta">{asset.meta}</span>
                  {locked && <span className="dam__permission" id={lockId}><LockGlyph />Permission required</span>}
                </>
              );
              return (
                <li key={`${asset.kind}-${asset.key}`}>
                  {asset.href ? (
                    // The drawer stays open underneath the reading panel, so
                    // closing the study returns the author to the finder they
                    // opened it from, focus included.
                    <a
                      className={`dam__item${locked ? ' dam__item--locked' : ''}`}
                      href={asset.href}
                      aria-describedby={locked ? lockId : undefined}
                    >
                      {body}
                    </a>
                  ) : (
                    <button type="button" className="dam__item" onClick={() => asset.component && selectComponent(asset.component)}>
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          )}
          {visible.length === 0 && <p className="dam__empty">No assets match.</p>}
        </div>
      ) : (
        <div id={`${baseId}-panel-components`} role="tabpanel" aria-labelledby={`${baseId}-tab-components`} className="side-panel__body">
          <ul className="side-panel__components">
            {AUTHORED_LIST.map((spec) => (
              <li key={spec.component}>
                <button
                  type="button"
                  className="side-panel__component"
                  aria-pressed={ui.selected === spec.component}
                  onClick={() => selectComponent(spec.component)}
                >
                  <span className="side-panel__component-label">
                    {spec.locked && <LockGlyph />}
                    {spec.label}
                  </span>
                  <span className="side-panel__component-type">{spec.component}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SidePanelShell>
  );
};

export default AuthorSidePanel;
