const SESSION_KEY = 'homepage_variant';

/** Store the current homepage variant slug (e.g. "homepage_t1d") */
export function setHomeVariant(slug: string): void {
  sessionStorage.setItem(SESSION_KEY, slug);
}

/** Get the hash route for the user's session homepage */
export function getHomeHref(): string {
  const slug = sessionStorage.getItem(SESSION_KEY);
  return slug ? `#/${slug}` : '#/';
}

/** Get the hash route for the projects section on the user's session homepage */
export function getProjectsHref(): string {
  const slug = sessionStorage.getItem(SESSION_KEY);
  return slug ? `#/${slug}#projects` : '#projects';
}
