import { SITE } from '../data/site';

export const REVIEW_BASE = '/dive';

export function isReviewPath(pathname = window.location.pathname): boolean {
  return pathname === REVIEW_BASE || pathname.startsWith(`${REVIEW_BASE}/`);
}

/** Scope page links only. Assets, fragments, email and other sites retain their URLs. */
export function reviewHref(href: string): string {
  if (!isReviewPath() || !href || href.startsWith('#')) return href;
  const url = new URL(href, window.location.href);
  if (![window.location.origin, SITE.portfolioUrl].includes(url.origin)) return href;
  if (isReviewPath(url.pathname) || (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith('.html'))) return href;
  return `${REVIEW_BASE}${url.pathname}${url.search}${url.hash}`;
}
