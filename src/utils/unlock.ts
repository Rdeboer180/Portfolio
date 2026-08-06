// ============================================
// Site unlock — single source of truth
// ============================================
//
// One password unlocks every protected surface on the site: confidential
// case-study overlays and the homepage cover loops. The site itself is never
// gated — a locked visitor reads everything, they just don't see the footage.
//
// SCOPE OF PROTECTION — read before trusting this for anything:
// this is a client-side courtesy gate, not access control. The password hashes
// ship inside the JS bundle, and every "protected" asset is a plain public URL
// that anyone can fetch directly without ever seeing the modal. It raises the
// effort of stumbling onto restricted work; it does not prevent retrieval.
// Anything that genuinely must not be public has to be removed from the build,
// not covered up at runtime.

/** Unlock persists across browser sessions — enter it once per device. */
const UNLOCK_KEY = 'rd-unlocked';
/** Set when a visitor closes the prompt; suppresses the modal, shows the bar. */
const DISMISSED_KEY = 'rd-unlock-dismissed';
/** Legacy per-session key from the old case-study-only gate. Read for migration. */
const LEGACY_SESSION_KEY = 'cs-unlocked';

/**
 * Accepted passwords, as SHA-256. Two work:
 *   1. REACT_APP_PROJECT_PASSWORD_HASH — the private one, from .env.local
 *   2. the hash below — "#showWork", the shareable one Ryan hands to recruiters
 */
const SHOW_WORK_HASH =
  '5d475714a2748f755e10ae76ad5b2f2c7dcb1c43dbcbe8be60e9a063d9503f29';

const sha256 = async (value: string): Promise<string> => {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/** True when the supplied password matches either accepted secret. */
export const verifyPassword = async (password: string): Promise<boolean> => {
  const hash = await sha256(password);
  return hash === SHOW_WORK_HASH || hash === process.env.REACT_APP_PROJECT_PASSWORD_HASH;
};

// Storage access is wrapped — Safari private mode throws on write, and a
// portfolio should degrade to "locked but readable", never to a blank page.
const read = (store: Storage, key: string): boolean => {
  try {
    return store.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const write = (store: Storage, key: string) => {
  try {
    store.setItem(key, 'true');
  } catch {
    /* private mode — unlock simply won't survive the reload */
  }
};

export const isUnlocked = (): boolean =>
  read(localStorage, UNLOCK_KEY) || read(sessionStorage, LEGACY_SESSION_KEY);

export const persistUnlock = (): void => {
  write(localStorage, UNLOCK_KEY);
  // Keep the legacy key in step so a mid-session reload can't re-lock.
  write(sessionStorage, LEGACY_SESSION_KEY);
};

export const isPromptDismissed = (): boolean => read(localStorage, DISMISSED_KEY);

export const persistDismissal = (): void => write(localStorage, DISMISSED_KEY);
