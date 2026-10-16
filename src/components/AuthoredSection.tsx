import React, { useEffect, useId, useState } from 'react';
import { useAuthorMode } from '../context/AuthorModeContext';
import { annotationNumber, AuthoredComponentSpec } from '../data/authorChrome';

type AuthoredSectionProps = AuthoredComponentSpec & {
  /** Component-specific toolbar controls, such as a Style System choice. */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
};

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2.2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/**
 * Wraps a homepage section in the chrome AEM draws around an authorable
 * component: an outline, a resource-type chip that selects it, the inherited
 * policy when it is locked, a toolbar of the actions the page can honour, and
 * the section's annotation pin. Preview renders the children and nothing else.
 */
const AuthoredSection: React.FC<AuthoredSectionProps> = ({
  component, label, anchor, locked = false, policy, related, annotation, toolbar, children,
}) => {
  const { authoring, ui, update } = useAuthorMode();
  const selected = ui.selected === component;
  const pinOpen = ui.openPin === component;
  const pin = annotation ? annotationNumber(component) : null;
  const noteId = useId();

  // "Copied" is a one-beat confirmation, not a new resting state.
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#${anchor}`);
      setCopied(true);
    } catch {
      // Clipboard access can be refused; the link is still in the address bar.
    }
  };

  const className = [
    'authored',
    locked && 'authored--locked',
    selected && 'authored--selected',
    pinOpen && 'authored--pin-open',
  ].filter(Boolean).join(' ');

  return (
    <div className={className} data-component={component}>
      {children}
      {authoring && (
        <div className="authored__tag">
          <button
            type="button"
            className="authored__chip"
            aria-pressed={selected}
            title={locked ? `${label} (locked)` : label}
            onClick={() => update({ selected: selected ? null : component })}
          >
            {locked && <LockIcon />}
            {component}
          </button>
          {locked && policy && <span className="authored__policy">{policy}</span>}
          {selected && (
            <span className="authored__toolbar" role="group" aria-label={`${label} actions`}>
              {toolbar}
              <button type="button" className="authored__action" onClick={copyLink}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
              {related && <a className="authored__action" href={related.href}>{related.label}</a>}
            </span>
          )}
        </div>
      )}
      {authoring && ui.annotationsOn && annotation && pin !== null && (
        <div className="authored__annotation">
          <button
            type="button"
            className="authored__pin"
            aria-expanded={pinOpen}
            aria-controls={noteId}
            aria-label={`Annotation ${pin}, ${label}`}
            onClick={() => update({ openPin: pinOpen ? null : component })}
          >
            {pin}
          </button>
          {pinOpen && (
            <div id={noteId} className="authored__note" role="note">
              {(typeof annotation.text === 'string' ? [annotation.text] : annotation.text).map((paragraph) => (
                <p key={paragraph} className="authored__note-text">{paragraph}</p>
              ))}
              <p className="authored__note-source">{annotation.source}</p>
              {annotation.link && <a className="authored__note-link" href={annotation.link.href}>{annotation.link.label}</a>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthoredSection;
