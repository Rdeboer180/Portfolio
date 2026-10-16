import React, { forwardRef } from 'react';

/**
 * The docked column: AEM's Side Panel chrome (header, title, close) around
 * whatever body the caller renders, styled once in `_side-panel.scss`. The
 * Asset Panel is its one user since the work navigator moved inside it.
 */
const SidePanelShell = forwardRef<HTMLElement, {
  title: string;
  label: string;
  closeLabel: string;
  onClose: () => void;
  /** `author` hides below 1000px with the rest of the editor. */
  variant: 'author';
  id?: string;
  children: React.ReactNode;
}>(({ title, label, closeLabel, onClose, variant, id, children }, ref) => (
  <aside className={`side-panel side-panel--${variant}`} aria-label={label} id={id} ref={ref} tabIndex={-1}>
    <div className="side-panel__header">
      <span className="side-panel__title">{title}</span>
      <button type="button" className="side-panel__close" aria-label={closeLabel} onClick={onClose}>&times;</button>
    </div>
    {children}
  </aside>
));

SidePanelShell.displayName = 'SidePanelShell';

export default SidePanelShell;
