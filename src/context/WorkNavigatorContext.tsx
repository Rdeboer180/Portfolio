import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ClientKey, NavigatorGroupId, isClientKey, isNavigatorGroup } from '../data/workGroups';
import { useAuthorMode } from './AuthorModeContext';

/**
 * How densely the work section lays out whatever the navigator selects. The
 * navigator decides what is shown; this decides how. Cards is the carousel
 * the static page ships; List and Grid exist only after mount.
 */
export type WorkView = 'cards' | 'list' | 'grid';

export const WORK_VIEWS: { id: WorkView; label: string }[] = [
  { id: 'cards', label: 'Cards' },
  { id: 'list', label: 'List' },
  { id: 'grid', label: 'Grid' },
];

export const isWorkView = (value: string | null | undefined): value is WorkView =>
  WORK_VIEWS.some((view) => view.id === value);

/**
 * What the work navigator has open and selected. The defaults are the static
 * page: rail closed, nothing selected, page one, cards. Every value here is
 * applied after mount, so the first client render always equals the prerender.
 */
export interface WorkNavigatorState {
  open: boolean;
  group: NavigatorGroupId | null;
  clientKey: ClientKey | null;
  /** Zero-based page of the work carousel, kept here so the rail and the arrows agree. */
  page: number;
  /** Study the visitor is pointing at in the rail; the card answers with its coins. */
  pointedSlug: string | null;
  /** The density the visitor chose; the rail's selection applies to every view. */
  view: WorkView;
}

interface WorkNavigatorValue extends WorkNavigatorState {
  /** True once the client has mounted; nothing below renders before then. */
  mounted: boolean;
  setOpen: (open: boolean) => void;
  selectGroup: (group: NavigatorGroupId | null) => void;
  selectClient: (key: ClientKey | null) => void;
  setPage: (page: number) => void;
  point: (slug: string | null) => void;
  setView: (view: WorkView) => void;
  /** The control that opened the rail, so closing it returns focus there. */
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const DEFAULT_STATE: WorkNavigatorState = { open: false, group: null, clientKey: null, page: 0, pointedSlug: null, view: 'cards' };

const WorkNavigatorContext = createContext<WorkNavigatorValue>({
  ...DEFAULT_STATE,
  mounted: false,
  setOpen: () => {},
  selectGroup: () => {},
  selectClient: () => {},
  setPage: () => {},
  point: () => {},
  setView: () => {},
  triggerRef: { current: null },
});

export const useWorkNavigator = () => useContext(WorkNavigatorContext);

/**
 * Deep links use the section's own anchor: `#projects/aem`, `#projects/client/personal`.
 * They are read once after mount and written back with replaceState rather
 * than through the router, because RouteEffects treats every hash as an
 * element id to scroll to and the reading panel keeps its own history.
 */
const HASH_PREFIX = '#projects/';

const readHash = (): Pick<WorkNavigatorState, 'group' | 'clientKey'> | null => {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const [group, client] = hash.slice(HASH_PREFIX.length).split('/');
  if (!isNavigatorGroup(group)) return null;
  return { group, clientKey: group === 'client' && isClientKey(client) ? client : null };
};

const writeHash = (group: NavigatorGroupId | null, clientKey: ClientKey | null) => {
  const next = group ? `${HASH_PREFIX}${group}${group === 'client' && clientKey ? `/${clientKey}` : ''}` : '#projects';
  const current = window.location.hash;
  // Only touch the address once the visitor has used the navigator; a plain
  // arrival keeps whatever anchor brought them here.
  if (current === next || (!group && !current.startsWith(HASH_PREFIX))) return;
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${next}`);
};

/**
 * The chosen density is a device preference rather than a link, so it lives
 * in localStorage (per device, like the unlock) and never in the hash. It is
 * read after mount for the same reason the deep link is: the prerender is
 * always Cards, and a stored List on the first render would be a hydration
 * mismatch. Storage can be absent or refused (private windows, blocked site
 * data), and the page must not care either way.
 */
const VIEW_KEY = 'rdeboer:work-view';

const readView = (): WorkView | null => {
  try {
    const stored = window.localStorage.getItem(VIEW_KEY);
    return isWorkView(stored) ? stored : null;
  } catch {
    return null;
  }
};

const writeView = (view: WorkView) => {
  try {
    if (view === DEFAULT_STATE.view) window.localStorage.removeItem(VIEW_KEY);
    else window.localStorage.setItem(VIEW_KEY, view);
  } catch {
    // Nothing to remember with; the choice still holds for this visit.
  }
};

export const WorkNavigatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authoring } = useAuthorMode();
  const [state, setState] = useState<WorkNavigatorState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Mount first, then read the deep link: the prerendered page has no
  // selection, and a selection on the first render would be a hydration
  // mismatch (#418), the same gate the author chrome and the hero use.
  useEffect(() => {
    setMounted(true);
    const linked = readHash();
    const view = readView();
    if (linked || view) setState((current) => ({ ...current, ...(linked ?? {}), ...(view ? { view } : {}), page: 0 }));
  }, []);

  const setOpen = useCallback((open: boolean) => setState((current) => (current.open === open ? current : { ...current, open, pointedSlug: open ? current.pointedSlug : null })), []);

  const selectGroup = useCallback((group: NavigatorGroupId | null) => {
    setState((current) => ({ ...current, group, clientKey: null, page: 0, pointedSlug: null }));
    writeHash(group, null);
  }, []);

  const selectClient = useCallback((key: ClientKey | null) => {
    setState((current) => ({ ...current, group: 'client', clientKey: key, page: 0, pointedSlug: null }));
    writeHash('client', key);
  }, []);

  const setPage = useCallback((page: number) => setState((current) => (current.page === page ? current : { ...current, page })), []);
  const point = useCallback((slug: string | null) => setState((current) => (current.pointedSlug === slug ? current : { ...current, pointedSlug: slug })), []);

  // Leaving Cards drops its page: the carousel is unmounted, and coming back
  // starts it at the first page the way a new selection does.
  const setView = useCallback((view: WorkView) => {
    setState((current) => (current.view === view ? current : { ...current, view, page: 0 }));
    writeView(view);
  }, []);

  // Author mode docks its own panel in the same column, so entering it closes
  // this one; the selection survives, because it is the page's state, not the rail's.
  useEffect(() => {
    if (authoring) setOpen(false);
  }, [authoring, setOpen]);

  // The open rail takes its own column: the stylesheet pads <body> by the
  // panel width under this flag, exactly as the author panel does, so the
  // page re-centres beside it instead of being covered.
  const docked = state.open && !authoring;
  useEffect(() => {
    if (!docked) return undefined;
    const root = document.documentElement;
    root.dataset.sidePanel = 'open';
    return () => { delete root.dataset.sidePanel; };
  }, [docked]);

  // Escape closes the rail and hands focus back to the control that opened
  // it. Capture phase, with the same guard as the author chrome: an open
  // dialog or the password prompt owns Escape, and the rail must still be
  // there when they close.
  useEffect(() => {
    if (!docked) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (document.querySelector('dialog[open], .password-modal')) return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [docked, setOpen]);

  const value = useMemo(
    () => ({ ...state, mounted, setOpen, selectGroup, selectClient, setPage, point, setView, triggerRef }),
    [state, mounted, setOpen, selectGroup, selectClient, setPage, point, setView],
  );
  return <WorkNavigatorContext.Provider value={value}>{children}</WorkNavigatorContext.Provider>;
};
