/** Individual articles and case studies share one reading panel. */
export const isPanelRoute = (pathname: string) => /^\/(work|notes)\/[^/]+\/?$/.test(pathname);
