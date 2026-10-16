import React, { useEffect, useRef, useState } from 'react';
import { useAuthorMode } from '../context/AuthorModeContext';
import { BUILD } from '../data/build';
import { SEARCH_META } from '../data/seo';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const formatDate = (iso: string) => {
  const date = new Date(iso);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * AEM's Page Properties dialog with the properties this page can state
 * truthfully. "Last modified" is the git commit the build was made from,
 * written by scripts/write-build-stamp.mjs; nothing here is typed by hand.
 */
const PageProperties: React.FC = () => {
  const { authoring, ui, update } = useAuthorMode();
  const dialog = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (ui.pageInfoOpen && !element.open) {
      setTitle(document.title);
      element.showModal();
    } else if (!ui.pageInfoOpen && element.open) {
      element.close();
    }
  }, [ui.pageInfoOpen]);

  if (!authoring) return null;

  const close = () => update({ pageInfoOpen: false });

  return (
    <dialog
      ref={dialog}
      className="page-props"
      aria-labelledby="page-props-title"
      onClose={close}
      onClick={(event) => { if (event.target === dialog.current) close(); }}
    >
      {ui.pageInfoOpen && (
        <div className="page-props__body">
          <p className="page-props__eyebrow">Page properties</p>
          <h2 id="page-props-title" className="page-props__title">{title}</h2>
          <dl className="page-props__list">
            {/* Description is the search description the page already ships,
                so it cannot drift from what Google shows. */}
            <div className="page-props__row"><dt>Description</dt><dd>{SEARCH_META.home.description}</dd></div>
            <div className="page-props__row"><dt>Template</dt><dd>rdeboer/templates/homepage</dd></div>
            <div className="page-props__row"><dt>Resource type</dt><dd>rdeboer/components/page</dd></div>
            <div className="page-props__row"><dt>Tags</dt><dd>Product design · Design systems · Design engineering</dd></div>
            {/* Moved from the FAQ: how the page was made belongs to the page. */}
            <div className="page-props__row"><dt>Built with</dt><dd>React and SCSS, from a Figma token and component foundation</dd></div>
            <div className="page-props__row"><dt>Authorship</dt><dd>Claude helped scaffold components, inspect token drift, and work through implementation problems. I chose the references, set the direction, reviewed the responsive behavior, and made the final calls.</dd></div>
            <div className="page-props__row">
              <dt>Last modified</dt>
              <dd><time dateTime={BUILD.date}>{formatDate(BUILD.date)}</time> · {BUILD.author}</dd>
            </div>
            <div className="page-props__row"><dt>Build</dt><dd><code>{BUILD.shortSha}</code></dd></div>
          </dl>
          <nav className="page-props__links" aria-label="About this page">
            <a href="/notes/how-this-site-works/" onClick={close}>How this page was built</a>
            <a href="/design-system" onClick={close}>Design system</a>
            <a href="/sitemap" onClick={close}>Site index</a>
          </nav>
          <button type="button" className="page-props__close" onClick={close}>Close</button>
        </div>
      )}
    </dialog>
  );
};

export default PageProperties;
