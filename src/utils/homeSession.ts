const SESSION_KEY = 'homepage_variant';

/** Store the current homepage variant slug (e.g. "homepage_template") */
export function setHomeVariant(slug: string): void {
  sessionStorage.setItem(SESSION_KEY, slug);
}

/** Path to the visitor's session homepage (a targeted variant, or the default). */
export function getHomeHref(): string {
  const slug = sessionStorage.getItem(SESSION_KEY);
  return slug ? `/${slug}` : '/';
}

/** Path to the projects section on the visitor's session homepage. */
export function getProjectsHref(): string {
  const slug = sessionStorage.getItem(SESSION_KEY);
  return slug ? `/${slug}#projects` : '/#projects';
}
