import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { scrollBehavior } from '../utils/motion';

export type PanelTab = 'assets' | 'components';

/** Everything the author chrome keeps open. Resets whenever Author mode ends. */
export interface AuthorUI {
  panelOpen: boolean;
  panelTab: PanelTab;
  /** Resource type of the component the author has selected on the page. */
  selected: string | null;
  annotationsOn: boolean;
  /** Resource type whose annotation pin is open. */
  openPin: string | null;
  layoutOn: boolean;
  pageInfoOpen: boolean;
}

interface AuthorModeValue {
  authoring: boolean;
  setAuthoring: (on: boolean) => void;
  ui: AuthorUI;
  update: (patch: Partial<AuthorUI>) => void;
  /** Select a component and bring it into view, the way the Components tab does. */
  selectComponent: (component: string) => void;
}

const DEFAULT_UI: AuthorUI = {
  panelOpen: false,
  panelTab: 'assets',
  selected: null,
  annotationsOn: false,
  openPin: null,
  layoutOn: false,
  pageInfoOpen: false,
};

/** Per tab, so Back from a full page lands on the author view the reader left. */
const STORAGE_KEY = 'rdeboer:author-mode';

const readSaved = (): AuthorUI | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<AuthorUI>;
    // A dialog is never restored open; it was closed by leaving the page.
    return { ...DEFAULT_UI, ...saved, pageInfoOpen: false };
  } catch {
    return null;
  }
};

const writeSaved = (ui: AuthorUI | null) => {
  try {
    if (ui) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...ui, pageInfoOpen: false }));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private windows, blocked site data). Author
    // mode still works; it just will not survive leaving the page.
  }
};

const AuthorModeContext = createContext<AuthorModeValue>({
  authoring: false,
  setAuthoring: () => {},
  ui: DEFAULT_UI,
  update: () => {},
  selectComponent: () => {},
});

export const useAuthorMode = () => useContext(AuthorModeContext);

/**
 * Author and Publisher, AEM's two tiers over the same page. Author is a state
 * the reader chooses, so the outlines it draws read as a response rather than
 * ambient decoration — the condition the selection-frame cards already meet.
 */
export const AuthorModeProvider: React.FC<{ enabled?: boolean; children: React.ReactNode }> = ({ enabled = true, children }) => {
  const [authoring, setAuthoringState] = useState(false);
  const [ui, setUi] = useState<AuthorUI>(DEFAULT_UI);
  const authoringRef = useRef(authoring);
  authoringRef.current = authoring;

  const update = useCallback((patch: Partial<AuthorUI>) => setUi((current) => ({ ...current, ...patch })), []);

  // Leaving Author mode closes everything it opened, and forgets it.
  const setAuthoring = useCallback((on: boolean) => {
    setAuthoringState(on);
    if (!on) {
      setUi(DEFAULT_UI);
      writeSaved(null);
    }
  }, []);

  const selectComponent = useCallback((component: string) => {
    setUi((current) => ({ ...current, selected: component, openPin: null }));
    document
      .querySelector<HTMLElement>(`[data-component="${component}"]`)
      ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }, []);

  // Restore after mount, never in the initializer: the prerendered page is the
  // Publisher view, and author chrome on the first client render would be a
  // hydration mismatch (#418) — the same gate UnlockChrome and the hero use.
  useEffect(() => {
    if (!enabled) return;
    const saved = readSaved();
    if (!saved) return;
    setAuthoringState(true);
    setUi(saved);
  }, [enabled]);

  // Remember the open chrome while authoring, so Back from a full page (the
  // design system, the site index) returns to the same panel, tab and pins.
  // Reading panels never unmount the homepage, so they need none of this.
  useEffect(() => {
    if (authoring) writeSaved(ui);
  }, [authoring, ui]);

  // The flag lives on <html> so a section can style its own author state
  // without the context being threaded through every component between.
  useEffect(() => {
    const root = document.documentElement;
    if (authoring) root.dataset.authorMode = 'true';
    else delete root.dataset.authorMode;
    return () => { delete root.dataset.authorMode; };
  }, [authoring]);

  // The open side panel takes its own column instead of covering the page:
  // the stylesheet pads <body> by the panel width, so every centred container
  // re-centres in the space that is left, with equal margins either side.
  const panelOpen = authoring && ui.panelOpen;
  useEffect(() => {
    const root = document.documentElement;
    if (panelOpen) root.dataset.sidePanel = 'open';
    else delete root.dataset.sidePanel;
    return () => { delete root.dataset.sidePanel; };
  }, [panelOpen]);

  // Ctrl/Cmd + Shift + M, the shortcut AEM uses for the same switch. Escape
  // closes the open pin first, then the side panel; the dialog handles itself.
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setAuthoring(!authoringRef.current);
        return;
      }
      if (event.key === 'Escape') {
        // Any open dialog (a reading panel, Page properties) or the password
        // prompt owns Escape; the author chrome underneath must still be there
        // when it closes.
        if (document.querySelector('dialog[open], .password-modal')) return;
        setUi((current) => {
          if (current.openPin) return { ...current, openPin: null };
          if (current.panelOpen) return { ...current, panelOpen: false };
          return current;
        });
      }
    };
    // Capture phase: React handles the password prompt's own Escape and removes
    // it before a bubbling window listener would run, which made the guard
    // above see no prompt and close the side panel along with it.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [enabled, setAuthoring]);

  const value = useMemo(
    () => ({ authoring, setAuthoring, ui, update, selectComponent }),
    [authoring, setAuthoring, ui, update, selectComponent],
  );
  return <AuthorModeContext.Provider value={value}>{children}</AuthorModeContext.Provider>;
};
