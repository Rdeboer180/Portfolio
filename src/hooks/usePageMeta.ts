import { useEffect } from 'react';

// Per-route document metadata. Each route calls this with its own title,
// description, canonical, and social tags; the Playwright prerender step
// serializes the resulting <head> into that route's static HTML. Every route
// should call it so navigating between pages always sets a fresh, correct head.

export interface PageMeta {
  title: string;
  description?: string;
  /** Absolute canonical URL for this route. */
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Absolute image URL. */
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  /** Optional structured data (e.g. CreativeWork) injected as a JSON-LD script. */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function usePageMeta(meta: PageMeta): void {
  const jsonLdStr = meta.jsonLd ? JSON.stringify(meta.jsonLd) : '';
  useEffect(() => {
    if (meta.title) document.title = meta.title;

    const ogTitle = meta.ogTitle ?? meta.title;
    upsertMeta('property', 'og:title', ogTitle);
    upsertMeta('name', 'twitter:title', ogTitle);
    upsertMeta('property', 'og:type', meta.ogType ?? 'website');

    // Each branch clears its tags when the new route omits the field. Without
    // the else, tags are upserted but never removed, so a route with no image
    // keeps the *previous* route's og:image — share a link to /sitemap after
    // visiting a case study and the card shows the case study's cover.
    if (meta.description) {
      const ogDesc = meta.ogDescription ?? meta.description;
      upsertMeta('name', 'description', meta.description);
      upsertMeta('property', 'og:description', ogDesc);
      upsertMeta('name', 'twitter:description', ogDesc);
    } else {
      removeMeta('name', 'description');
      removeMeta('property', 'og:description');
      removeMeta('name', 'twitter:description');
    }

    if (meta.canonical) {
      upsertLink('canonical', meta.canonical);
      upsertMeta('property', 'og:url', meta.canonical);
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      removeMeta('property', 'og:url');
    }

    if (meta.ogImage) {
      upsertMeta('property', 'og:image', meta.ogImage);
      upsertMeta('name', 'twitter:image', meta.ogImage);
    } else {
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
    }

    // Page-specific JSON-LD (tagged so it can be removed on route change).
    let script: HTMLScriptElement | null = null;
    if (jsonLdStr) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-jsonld', '');
      script.textContent = jsonLdStr;
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    meta.title,
    meta.description,
    meta.canonical,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.ogType,
    jsonLdStr,
  ]);
}
