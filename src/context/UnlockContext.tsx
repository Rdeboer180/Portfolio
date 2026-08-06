import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  isPromptDismissed, isUnlocked, persistDismissal, persistUnlock,
} from '../utils/unlock';

interface UnlockValue {
  /** Protected media and case-study overlays are visible. */
  unlocked: boolean;
  /** The password modal is on screen. */
  promptOpen: boolean;
  /** Locked, and the visitor has closed the prompt — the top bar is showing. */
  barVisible: boolean;
  openPrompt: () => void;
  unlock: () => void;
  dismissPrompt: () => void;
}

const UnlockContext = createContext<UnlockValue | null>(null);

/**
 * Site-wide unlock state.
 *
 * The site is fully readable while locked — this only governs protected media.
 * A first-time visitor gets the prompt once; closing it swaps in a persistent
 * bar above the nav rather than asking again. Unlocking is remembered per
 * device (localStorage), so it is asked for exactly once.
 *
 * Initial state is deliberately "locked, no prompt": that is what the build-time
 * prerender captures, so the static HTML never ships a modal and hydration has
 * nothing to correct. The real decision is made in the effect below, client-side.
 */
export const UnlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (isUnlocked()) {
      setUnlocked(true);
      return;
    }
    if (isPromptDismissed()) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
    setPromptOpen(true);
  }, []);

  const unlock = useCallback(() => {
    persistUnlock();
    setUnlocked(true);
    setPromptOpen(false);
  }, []);

  const dismissPrompt = useCallback(() => {
    persistDismissal();
    setDismissed(true);
    setPromptOpen(false);
  }, []);

  const openPrompt = useCallback(() => setPromptOpen(true), []);

  const barVisible = !unlocked && dismissed && !promptOpen;

  // The page navs are `position: fixed; top: 0`, so the bar can't simply sit
  // above them in flow — it publishes its height and they offset by it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('has-unlock-bar', barVisible);
    return () => root.classList.remove('has-unlock-bar');
  }, [barVisible]);

  const value = useMemo<UnlockValue>(
    () => ({ unlocked, promptOpen, barVisible, openPrompt, unlock, dismissPrompt }),
    [unlocked, promptOpen, barVisible, openPrompt, unlock, dismissPrompt]
  );

  return <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>;
};

export const useUnlock = (): UnlockValue => {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error('useUnlock must be used inside <UnlockProvider>');
  return ctx;
};
