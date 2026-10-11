import { SITE } from './site';

export const PERSON_ID = `${SITE.portfolioUrl}/#ryan-deboer`;
export const AUTHOR = { '@id': PERSON_ID, '@type': 'Person', name: SITE.name, url: `${SITE.portfolioUrl}/about/` };

export const SEARCH_META = {
  home: {
    title: 'Ryan DeBoer | Design Systems & AEM | Product Designer',
    description: 'Design systems and Adobe Experience Manager (AEM). 12+ years at Tire Rack, connecting Figma, production Sass and authoring governance. Open to remote US roles.',
  },
  about: {
    title: 'About Ryan DeBoer | Design Systems & AEM',
    description: '12+ years at Tire Rack building AEM components and authoring guardrails. Figma, production Sass, product design and UX/UI. Based in Indiana, open to remote US roles.',
  },
  resume: {
    title: 'Ryan DeBoer Resume | Design Systems, AEM & Product Design',
    description: 'Experience in design systems, Adobe Experience Manager, Figma and production Sass, with product design and UX/UI work. Open to remote US roles.',
  },
} as const;

// The prerender includes this shared identity alongside each page's own schema.
export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  url: `${SITE.portfolioUrl}/about/`,
  image: `${SITE.portfolioUrl}/images/hero/ryan-deboer-2026.jpeg`,
  jobTitle: 'Product Designer',
  description: 'Design systems and AEM practitioner with 12+ years at Tire Rack, connecting Figma, production Sass and governed content authoring. Product design and UX/UI. Based in South Bend, Indiana, and open to remote US roles.',
  email: `mailto:${SITE.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'South Bend',
    addressRegion: 'IN',
    addressCountry: 'US',
  },
  sameAs: [SITE.linkedinUrl, 'https://github.com/Rdeboer180'],
  knowsAbout: [
    'Design Systems', 'Adobe Experience Manager (AEM)', 'Design System Governance',
    'AEM Authoring', 'Component Libraries', 'Figma', 'Sass', 'Digital Asset Management',
    'Design Tokens', 'Storybook', 'Product Design', 'UX Design', 'UI Design',
    'Design Engineering', 'Accessibility', 'Ecommerce', 'Agent-Assisted Product Development',
  ],
};

export function profileJsonLd(url: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#webpage`,
    url,
    name,
    mainEntity: { '@id': PERSON_ID },
  };
}
