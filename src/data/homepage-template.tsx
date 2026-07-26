import React from 'react';
import type { TargetedHomepageContent } from './targetedHomepage';

/**
 * TEMPLATE — scaffold for a targeted homepage.
 *
 * This is a fill-in-the-blanks example, not a live deployment. To create a real
 * targeted homepage, copy this file (e.g. `homepage-acme.tsx`), replace every
 * [PLACEHOLDER], set a unique `meta.slug`, then wire a route in `src/App.tsx`.
 * See `targetedHomepage.ts` for the full field contract.
 *
 * Previewable (unlinked) at `#/homepage_template`.
 */
const templateContent: TargetedHomepageContent = {
  meta: {
    slug: 'homepage_template',
    company: '[Company]',
  },

  hero: {
    eyebrow: 'Senior Web Designer by title.',
    roles: ['Product Designer', 'Design Engineer', 'UX Engineer'],
    headline: '',
    body: (
      <>
        [Opening pitch — one or two sentences on who you are and the work you do,
        then a targeted closer that ties your experience to{' '}
        <span className="about__highlight">[Company] and why this role is the right fit.]</span>
      </>
    ),
  },

  about: {
    title: '[About headline]',
    // titleImage: '/images/[company]/logo.png', // optional
    paragraphs: [
      '[Paragraph 1 — your background and what sets you apart.]',
      '[Paragraph 2 — a story that connects you to this company or product.]',
      '[Paragraph 3 — why this role, why now.]',
    ],
    stats: [
      { value: '16+', label: 'Years designing professionally' },
      { value: '500+', label: 'Projects shipped to production' },
      { value: '[Stat]', label: '[Label]' },
      { value: '50+', label: 'Design system components built' },
    ],
  },

  whyCompany: {
    badgeLabel: 'Why [Company]',
    title: '[Why I’m the right fit]',
    subtitle: '[One-line subtitle framing the section.]',
    intro: '[Short intro sentence.]',
    points: [
      { title: '[Reason 1]', body: '[Supporting detail.]' },
      { title: '[Reason 2]', body: '[Supporting detail.]' },
      { title: '[Reason 3]', body: '[Supporting detail.]' },
    ],
  },

  skills: {
    title: '[Skills headline]',
    subtitle: '[One-line subtitle.]',
    intro: '[Short intro tying skills to the job description.]',
    categories: [
      {
        title: 'Product Design & UX',
        skills: ['[Skill]', '[Skill]', '[Skill]'],
      },
      {
        title: 'Design Systems',
        skills: ['[Skill]', '[Skill]', '[Skill]'],
      },
      {
        title: 'Front-End Fluency',
        skills: ['[Skill]', '[Skill]', '[Skill]'],
      },
    ],
  },

  faq: {
    title: '[FAQ headline]',
    intro: '[Short intro sentence.]',
    items: [
      { question: '[Question?]', answer: '[Answer.]' },
      { question: '[Question?]', answer: '[Answer.]' },
      { question: '[Question?]', answer: '[Answer.]' },
    ],
  },

  footer: {
    eyebrow: '[Closing CTA line]',
    tagline: '[Sign-off]',
  },
};

export default templateContent;
