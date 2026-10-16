import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ClientKey, NavigatorGroupId, isClientKey, isNavigatorGroup } from '../data/workGroups';

/**
 * How the work section lays out whatever is selected: Cards (the paged
 * carousel, and the static page), List (one finder row per study) or Grid
 * (compact tiles). The filter chooses what to show; this chooses how densely.
 */
export type WorkView = 'cards' | 'list' | 'grid';

export const WORK_VIEWS: { id: WorkView; label: string }[] = [
  { id: 'cards', label: 'Cards' },
  { id: 'list', label: 'List' },
  { id: 'grid', label: 'Grid' },
];

/**
 * What the work section shows and how. The visitor filters with the chips in
 * the section itself (no selection is All, opening on the featured studies)
 * and picks a layout beside them; an author can also file by client from the
 * Asset Panel's folders. The defaults are the static page: All, as cards;
 * on a phone the work opens as the List (applied after mount, below). A
 * layout the visitor picks is kept for the visit only, never stored, so a
 * returning visitor never inherits one. The deep link is applied after
 * mount too, so the first client render always equals the prerender.
 */
export interface WorkNavigatorState {
  group: NavigatorGroupId | null;
  clientKey: ClientKey | null;
  /** Study the author is pointing at in the Asset Panel; its card answers with its coins. */
  pointedSlug: string | null;
  view: WorkView;
}

interface WorkNavigatorValue extends WorkNavigatorState {
  /** True once the client has mounted. */
  mounted: boolean;
  selectGroup: (group: NavigatorGroupId | null) => void;
  selectClient: (key: ClientKey | null) => void;
  point: (slug: string | null) => void;
  setView: (view: WorkView) => void;
}

const DEFAULT_STATE: WorkNavigatorState = { group: null, clientKey: null, pointedSlug: null, view: 'cards' };

/**
 * Where the carousel shows one card at a time ($breakpoint-md, the same rule
 * that sizes a card to 82vw). There, paging card by card through twelve
 * studies is the slow way to scan, so the work opens as the List instead.
 */
const ONE_CARD_QUERY = '(max-width: 768px)';

const WorkNavigatorContext = createContext<WorkNavigatorValue>({
  ...DEFAULT_STATE,
  mounted: false,
  selectGroup: () => {},
  selectClient: () => {},
  point: () => {},
  setView: () => {},
});

export const useWorkNavigator = () => useContext(WorkNavigatorContext);

/**
 * Deep links use the section's own anchor: `#projects/aem`,
 * `#projects/client/personal`; plain `#projects` is All.
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
  // Only touch the address once a filter has been used; a plain arrival keeps
  // whatever anchor brought the visitor here.
  if (current === next || (!group && !current.startsWith(HASH_PREFIX))) return;
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${next}`);
};

export const WorkNavigatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkNavigatorState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  // Mount first, then read the deep link: the prerendered page has no
  // selection, and a selection on the first render would be a hydration
  // mismatch (#418), the same gate the author chrome and the hero use.
  useEffect(() => {
    setMounted(true);
    const linked = readHash();
    if (linked) setState((current) => ({ ...current, ...linked }));
  }, []);

  // On a phone the work opens as the List. The static page is Cards (the
  // prerender serializes at Playwright's 1280px default, so keep it at a
  // desktop width), and the first render must match it, so the phone default
  // is applied after mount, like the deep link. The section sits well below
  // the fold on a phone, so the swap lands before anyone scrolls to it. The
  // default follows the width (a rotation, a resized window) until the
  // visitor picks a layout; from then on their choice holds for the visit.
  const viewChosen = useRef(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(ONE_CARD_QUERY);
    const follow = () => {
      if (viewChosen.current) return;
      const view: WorkView = query.matches ? 'list' : 'cards';
      setState((current) => (current.view === view ? current : { ...current, view }));
    };
    follow();
    query.addEventListener?.('change', follow);
    return () => query.removeEventListener?.('change', follow);
  }, []);

  const selectGroup = useCallback((group: NavigatorGroupId | null) => {
    setState((current) => ({ ...current, group, clientKey: null, pointedSlug: null }));
    writeHash(group, null);
  }, []);

  const selectClient = useCallback((key: ClientKey | null) => {
    setState((current) => ({ ...current, group: 'client', clientKey: key, pointedSlug: null }));
    writeHash('client', key);
  }, []);

  const point = useCallback((slug: string | null) => setState((current) => (current.pointedSlug === slug ? current : { ...current, pointedSlug: slug })), []);
  const setView = useCallback((view: WorkView) => {
    viewChosen.current = true;
    setState((current) => (current.view === view ? current : { ...current, view }));
  }, []);

  const value = useMemo(
    () => ({ ...state, mounted, selectGroup, selectClient, point, setView }),
    [state, mounted, selectGroup, selectClient, point, setView],
  );
  return <WorkNavigatorContext.Provider value={value}>{children}</WorkNavigatorContext.Provider>;
};
