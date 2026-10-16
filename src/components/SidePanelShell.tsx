import React, { forwardRef } from 'react';

/**
 * The docked column both panels share: AEM's Side Panel chrome (header, title,
 * close) around whatever body the caller renders. The author's Asset Panel and
 * the public work navigator differ in what they list, not in how they dock,
 * so the dock lives once here and `_side-panel.scss` styles it once.
 */
const SidePanelShell = forwardRef<HTMLElement, {
  title: string;
  label: string;
  closeLabel: string;
  onClose: () => void;
  /** `author` hides below 1000px with the rest of the editor; `work` folds inline instead. */
  variant: 'author' | 'work';
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
