import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ClientKey, NavigatorGroupId, isClientKey, isNavigatorGroup } from '../data/workGroups';

/**
 * What the work section is filtered to. The visitor filters by discipline with
 * the chips in the section itself; an author can also file by client from the
 * Asset Panel's folders. The defaults are the static page: nothing selected.
 * Every value here is applied after mount, so the first client render always
 * equals the prerender.
 */
export interface WorkNavigatorState {
  group: NavigatorGroupId | null;
  clientKey: ClientKey | null;
  /** Study the author is pointing at in the Asset Panel; its card answers with its coins. */
  pointedSlug: string | null;
}

interface WorkNavigatorValue extends WorkNavigatorState {
  /** True once the client has mounted. */
  mounted: boolean;
  selectGroup: (group: NavigatorGroupId | null) => void;
  selectClient: (key: ClientKey | null) => void;
  point: (slug: string | null) => void;
}

const DEFAULT_STATE: WorkNavigatorState = { group: null, clientKey: null, pointedSlug: null };

const WorkNavigatorContext = createContext<WorkNavigatorValue>({
  ...DEFAULT_STATE,
  mounted: false,
  selectGroup: () => {},
  selectClient: () => {},
  point: () => {},
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

  const selectGroup = useCallback((group: NavigatorGroupId | null) => {
    setState((current) => ({ ...current, group, clientKey: null, pointedSlug: null }));
    writeHash(group, null);
  }, []);

  const selectClient = useCallback((key: ClientKey | null) => {
    setState((current) => ({ ...current, group: 'client', clientKey: key, pointedSlug: null }));
    writeHash('client', key);
  }, []);

  const point = useCallback((slug: string | null) => setState((current) => (current.pointedSlug === slug ? current : { ...current, pointedSlug: slug })), []);

  const value = useMemo(
    () => ({ ...state, mounted, selectGroup, selectClient, point }),
    [state, mounted, selectGroup, selectClient, point],
  );
  return <WorkNavigatorContext.Provider value={value}>{children}</WorkNavigatorContext.Provider>;
};
