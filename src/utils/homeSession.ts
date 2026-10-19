import { isReviewPath } from './reviewRoutes';

const SESSION_KEY = 'homepage_variant';

/** Store the current homepage variant slug (e.g. "homepage_template") */
export function setHomeVariant(slug: string): void {
  sessionStorage.setItem(SESSION_KEY, slug);
}

/** Path to the visitor's session homepage (a targeted variant, or the default). */
export function getHomeHref(): string {
  const slug = isReviewPath() ? null : sessionStorage.getItem(SESSION_KEY);
  return slug ? `/${slug}` : '/';
}

/** Path to the projects section on the visitor's session homepage. */
export function getProjectsHref(): string {
  const slug = isReviewPath() ? null : sessionStorage.getItem(SESSION_KEY);
  return slug ? `/${slug}#projects` : '/#projects';
}

/**
 * Router state for a link that means "home, at the top": the logo or name.
 * Closing a study or pressing Back restores the reader's position; a home
 * link does not, so it carries this flag past both scroll restorers
 * (RouteEffects in App.tsx and the reading panel's exit in ProjectPanel.tsx).
 */
export const HOME_TOP_STATE = { toTop: true } as const;
