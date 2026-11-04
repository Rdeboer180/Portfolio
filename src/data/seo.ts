import { SITE } from './site';

export const PERSON_ID = `${SITE.portfolioUrl}/#ryan-deboer`;
export const AUTHOR = { '@id': PERSON_ID, '@type': 'Person', name: SITE.name, url: `${SITE.portfolioUrl}/about/` };

export const SEARCH_META = {
  home: {
    title: 'Ryan DeBoer | Design Engineer · Agentic Prototyping · AEM',
    description: 'Design engineer and senior product designer. I prototype in code with agents (Claude Code, Figma MCP), then carry what works into design systems and AEM.',
  },
  about: {
    title: 'About Ryan DeBoer | Design Systems & AEM',
    description: 'Product design engineer: design systems carried from Figma into production code and AEM, plus agentic prototyping with Claude Code. 12+ years at Tire Rack.',
  },
  resume: {
    title: 'Ryan DeBoer Resume | Design Systems, AEM & Product Design',
    description: 'Design engineering, agentic prototyping, design systems and Adobe Experience Manager (AEM), with product design and UX/UI work. 12+ years at Tire Rack.',
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
  description: 'Design engineer and senior product designer who prototypes in code with agents and carries the results into design systems and AEM. 12+ years at Tire Rack. Based in South Bend, Indiana.',
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
