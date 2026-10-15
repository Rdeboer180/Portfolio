import React from 'react';
import { useAuthorMode } from '../context/AuthorModeContext';
import { ANNOTATION_COUNT } from '../data/authorChrome';

const RailIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
    <path d="M6 2.75v10.5" />
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 7.25v3.5M8 5.25v.01" strokeLinecap="round" />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <path d="M2.75 3.75h10.5v6.5H7.5L4.75 12.5v-2.25h-2z" strokeLinejoin="round" />
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="1.5" />
    <path d="M6 1.75v12.5M10 1.75v12.5" />
  </svg>
);

/**
 * AEM's editor bar, anchored to the bottom corner so it never fights the site
 * navigation. Preview shows only the mode switch; Author adds the side panel,
 * page properties, annotations and the layout grid. Every toggle is a real
 * pressed state, so the accent only ever marks something that is on.
 */
const AuthorBar: React.FC = () => {
  const { authoring, setAuthoring, ui, update } = useAuthorMode();
  return (
    <div className={`author-bar${authoring ? ' author-bar--authoring' : ''}`} role="group" aria-label="Author bar">
      {authoring && (
        <>
          <div className="author-bar__group">
            <button
              type="button"
              className="author-bar__tool author-bar__tool--desktop"
              aria-pressed={ui.panelOpen}
              onClick={() => update({ panelOpen: !ui.panelOpen })}
            >
              <RailIcon /><span>Side panel</span>
            </button>
            <button
              type="button"
              className="author-bar__tool"
              aria-haspopup="dialog"
              onClick={() => update({ pageInfoOpen: true })}
            >
              <InfoIcon /><span>Page properties</span>
            </button>
          </div>
          <div className="author-bar__group">
            <button
              type="button"
              className="author-bar__tool"
              aria-pressed={ui.annotationsOn}
              onClick={() => update({ annotationsOn: !ui.annotationsOn, openPin: null })}
            >
              <CommentIcon /><span>Annotations</span>
              <span className="author-bar__count" aria-label={`${ANNOTATION_COUNT} annotations`}>{ANNOTATION_COUNT}</span>
            </button>
            <button
              type="button"
              className="author-bar__tool author-bar__tool--desktop"
              aria-pressed={ui.layoutOn}
              onClick={() => update({ layoutOn: !ui.layoutOn })}
            >
              <GridIcon /><span>Layout</span>
            </button>
          </div>
        </>
      )}
      {/* The two AEM tiers. "Publisher" is what practitioners call the publish
          instance, and as a noun it cannot read as a publish action. */}
      <div className="author-switch" role="group" aria-label="Environment">
        <button type="button" className="author-switch__option" aria-pressed={!authoring} onClick={() => setAuthoring(false)}>
          Publisher
        </button>
        <button type="button" className="author-switch__option" aria-pressed={authoring} onClick={() => setAuthoring(true)}>
          Author
        </button>
        <span className="author-switch__hint" aria-hidden="true">&#8984;&#8679;M</span>
      </div>
    </div>
  );
};

export default AuthorBar;
