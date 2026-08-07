import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { isUnlocked, persistUnlock } from '../utils/unlock';

interface UnlockValue {
  /** Protected media and case-study overlays are visible. */
  unlocked: boolean;
  /** The password modal is on screen. */
  promptOpen: boolean;
  /** Locked, hydrated, and not currently prompting — the top bar is showing. */
  barVisible: boolean;
  /**
   * True for one beat after a successful unlock, so the locked cards can play
   * their resolve instead of snapping. Cleared automatically.
   */
  resolving: boolean;
  /**
   * Open the prompt. Pass the route the visitor was reaching for and they'll be
   * taken there once they unlock — the click isn't wasted.
   */
  openPrompt: (pendingHref?: string) => void;
  unlock: () => void;
  dismissPrompt: () => void;
}

const UnlockContext = createContext<UnlockValue | null>(null);

/**
 * How long the --resolving class stays on. Must outlast the slowest card:
 * an 80ms stagger across 9 cards (640ms) plus the 1100ms media transition.
 */
const RESOLVE_MS = 2000;
/** Beat before honouring a pending navigation — long enough to watch the reveal land. */
const NAVIGATE_AFTER_MS = 1150;

/**
 * Site-wide unlock state.
 *
 * The site is fully readable while locked — this governs protected media and
 * the gated case-study routes. There is deliberately NO prompt on arrival: the
 * homepage hero is the best thing on the site and a modal over it on first
 * paint wastes it. The standing bar carries the offer instead, and the prompt
 * is raised only when a visitor reaches for something that's actually locked.
 *
 * Nothing renders until `ready`, so the build-time prerender captures neither
 * bar nor modal and hydration has nothing to correct.
 */
export const UnlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUnlocked()) setUnlocked(true);
    setReady(true);
  }, []);

  const openPrompt = useCallback((href?: string) => {
    pendingHref.current = href ?? null;
    setPromptOpen(true);
  }, []);

  const unlock = useCallback(() => {
    persistUnlock();
    setUnlocked(true);
    setPromptOpen(false);
    setResolving(true);
    window.setTimeout(() => setResolving(false), RESOLVE_MS);

    // Honour the click that raised the prompt, but let the resolve play first —
    // navigating instantly would throw away the moment the visitor just paid for.
    const href = pendingHref.current;
    pendingHref.current = null;
    if (href) window.setTimeout(() => navigate(href), NAVIGATE_AFTER_MS);
  }, [navigate]);

  const dismissPrompt = useCallback(() => {
    pendingHref.current = null;
    setPromptOpen(false);
  }, []);

  const barVisible = ready && !unlocked && !promptOpen;

  // The page navs are `position: fixed; top: 0`, so the bar can't simply sit
  // above them in flow — it publishes its height and they offset by it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('has-unlock-bar', barVisible);
    return () => root.classList.remove('has-unlock-bar');
  }, [barVisible]);

  const value = useMemo<UnlockValue>(
    () => ({ unlocked, promptOpen, barVisible, resolving, openPrompt, unlock, dismissPrompt }),
    [unlocked, promptOpen, barVisible, resolving, openPrompt, unlock, dismissPrompt]
  );

  return <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>;
};

export const useUnlock = (): UnlockValue => {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error('useUnlock must be used inside <UnlockProvider>');
  return ctx;
};
