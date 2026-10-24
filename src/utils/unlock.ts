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
/** Legacy per-session key from the old case-study-only gate. Read for migration. */
const LEGACY_SESSION_KEY = 'cs-unlocked';

/**
 * The one accepted password, as SHA-256: the shareable one Ryan hands to
 * recruiters. Neither the password nor its hash lives in this repository. The
 * build reads the hash from REACT_APP_PROJECT_PASSWORD_HASH: the
 * PROJECT_PASSWORD_HASH repo secret in CI, .env.local on a laptop. Without it
 * nothing unlocks, so a build that lost the secret fails closed.
 *
 * It still ships inside the bundle, the way any client-side check must, so
 * keeping it out of the source keeps it out of reading view, not out of reach.
 */
const PASSWORD_HASH = process.env.REACT_APP_PROJECT_PASSWORD_HASH;

const sha256 = async (value: string): Promise<string> => {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/** True when the supplied password is the accepted one. */
export const verifyPassword = async (password: string): Promise<boolean> => {
  if (!PASSWORD_HASH) return false;
  return (await sha256(password)) === PASSWORD_HASH;
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

/** Remember an explicit choice to browse without automatic password prompts. */
const SKIP_PROMPT_KEY = 'rd-skip-password-prompt';
export const skipsPasswordPrompt = (): boolean => read(localStorage, SKIP_PROMPT_KEY);
export const persistSkipPasswordPrompt = (): void => write(localStorage, SKIP_PROMPT_KEY);
