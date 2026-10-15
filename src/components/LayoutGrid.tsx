import React, { useEffect, useState } from 'react';
import { useAuthorMode } from '../context/AuthorModeContext';

const COLUMNS = 12;

/**
 * AEM's Layout mode, reduced to what is true of this page: the 1186px content
 * container, twelve columns, and the copy column read from --copy-max-width at
 * the moment the grid is switched on. No emulator buttons, because the page
 * cannot resize the viewport and a device toggle that does nothing is a prop.
 */
const LayoutGrid: React.FC = () => {
  const { authoring, ui } = useAuthorMode();
  const [copyWidth, setCopyWidth] = useState('');

  useEffect(() => {
    if (!ui.layoutOn) return;
    const read = (element: Element) => getComputedStyle(element).getPropertyValue('--copy-max-width').trim();
    setCopyWidth(read(document.documentElement) || read(document.body));
  }, [ui.layoutOn]);

  if (!authoring || !ui.layoutOn) return null;

  return (
    <div className="layout-grid" aria-hidden="true">
      <div className="layout-grid__container">
        {Array.from({ length: COLUMNS }, (_, index) => <span key={index} className="layout-grid__col" />)}
        {copyWidth && <span className="layout-grid__copy" style={{ width: copyWidth }} />}
        <span className="layout-grid__label">
          1186 container · {COLUMNS} col{copyWidth ? ` · copy ${copyWidth}` : ''}
        </span>
      </div>
    </div>
  );
};

export default LayoutGrid;
