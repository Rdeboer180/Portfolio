import type React from 'react';

/**
 * Content contract for a targeted homepage.
 *
 * A "targeted homepage" is a company/role-specific variant of the landing page,
 * rendered by the <HomepageTargeted content={...} /> component. Every text string
 * the component displays comes from an object implementing this interface.
 *
 * To spin up a new targeted deployment:
 *   1. Duplicate `src/data/homepage-template.tsx` (e.g. `homepage-acme.tsx`) and
 *      fill in the copy. Set a unique `meta.slug` (e.g. "homepage_acme").
 *   2. In `src/App.tsx`, import the new content and add a route branch that
 *      renders <HomepageTargeted content={acmeContent} /> for that slug.
 *
 * The `HomepageTargeted` renderer and this contract are intentionally kept in the
 * codebase as a reusable template even when no targeted homepages are live.
 */
export interface TargetedHomepageContent {
  meta: {
    slug: string;           // URL slug, e.g. "homepage_acme"
    company: string;        // Company name
  };
  hero: {
    eyebrow: string;
    roles: string[];        // Typing animation roles
    headline: string;
    body: string | React.ReactNode;
  };
  about: {
    title: string;
    titleImage?: string;    // Optional image/gif displayed next to the H2
    paragraphs: (string | React.ReactNode)[];
    stats: { value: string; label: string }[];
  };
  whyCompany: {
    badgeLabel: string;
    title: string;
    subtitle: string;
    intro: string;
    points: { title: string; body: string }[];
  };
  skills: {
    title: string;
    subtitle: string;
    intro: string;
    categories: { title: string; skills: string[] }[];
  };
  faq: {
    title: string;
    intro: string;
    items: { question: string; answer: string | React.ReactNode }[];
  };
  footer: {
    eyebrow: string;
    tagline: string;
  };
}
