// ============================================
// Talent tree: Ryan's own tree (v7.1, 2026-11-08)
// 89 points: 4 per year for sixteen years, the bachelor's in graphic design
// (16, locked to Design and systems), the web minor (4, locked to Code), and
// 5 for the hours outside the day job. Scored by the same rules the tree has
// always used; nothing here is hand-set except the card lines in
// RYAN_OVERRIDES and the notes in RYAN_NODE_NOTES.
//
// v7 reworked the Technical lane into five pairs, each crown grown out of its
// foundation (see trees.ts). v7.1 gives the code its due: Git 4 (twelve
// years), Automation 2, JavaScript 2, TypeScript 3, React 3 (WheelRack's
// foundation), React Native 3 and Production ownership 2. TypeScript and
// React Native are agent-built, and their notes say so. Research is 2 for the
// A/B tests and user studies run with the research team. The budget moved from
// 63 to 89 to hold it (economy.ts), and Prototyping, QA, Layout, HTML and CSS
// went back up rather than paying for the code.
// ============================================

import type { Allocation, Intake } from './types';

export const RYAN_INTAKE: Intake = {
  name: 'Ryan DeBoer',
  degree: 'bachelors',
  major: 'graphic',
  minor: 'web',
  years: 16,
  hours: 5,
};

/**
 * Design and systems (28): Typography 5 / Layout 4 · Interaction 1 / Motion 0 ·
 * Tokens 5 / Components 4 · Accessibility 4 / Governance 3 · Research 2 / IA 0
 * Technical (34): Figma 5 / Prototyping 5 · Handoff 3 / Storybook 3 ·
 * Documentation 3 / Skills and plugins 3 · CMS 3 / QA and analytics 3 ·
 * AI tools 3 / Internal tools 3
 * Code (27): HTML 5 / CSS 3 · Git 4 / Automation 2 · JavaScript 2 /
 * Performance 0 · TypeScript 3 / React 3 · React Native 3 / Production
 * ownership 2
 */
export const RYAN_ALLOCATION: Allocation = {
  // Design and systems
  typography: 5,
  layout: 4,
  interaction: 1,
  motion: 0,
  tokens: 5,
  components: 4,
  accessibility: 4,
  governance: 3,
  research: 2,
  'information-architecture': 0,
  // Technical
  figma: 5,
  prototyping: 5,
  handoff: 3,
  storybook: 3,
  documentation: 3,
  'skills-and-plugins': 3,
  cms: 3,
  'qa-and-analytics': 3,
  'ai-tools': 3,
  'internal-tools': 3,
  // Code
  html: 5,
  css: 3,
  git: 4,
  automation: 2,
  javascript: 2,
  performance: 0,
  typescript: 3,
  react: 3,
  'react-native': 3,
  'production-ownership': 2,
};

/**
 * Ryan's own word on a skill, printed in the Forge's panel when the skill is
 * hovered or picked. `agent` marks code agents write while he directs and
 * reads it; the node draws a dashed ring for it, the homepage's directed key.
 */
export const RYAN_NODE_NOTES: Record<string, { note: string; agent?: boolean }> = {
  research: { note: 'I work with our research team on A/B tests and user studies for real customer feedback: building the questions, then tracking the feedback all the way through the build.' },
  git: { note: 'Twelve years of it, from my own repos to the pull requests I open at Tire Rack every week.' },
  automation: { note: 'My pull request to our design-system skill automates new components and changes.' },
  javascript: { note: 'Thirteen years designing alongside engineers on platforms built largely in JavaScript.' },
  typescript: { agent: true, note: 'Agents write the TypeScript while I direct them, and I have learned to read the output.' },
  react: { note: 'React was the foundation of WheelRack. I learned the terminology and the codebase well enough to design, direct, and build within the system.' },
  'react-native': { agent: true, note: 'Agents wrote PlayDraft’s React Native while I directed them, and I have learned to read the output.' },
  'production-ownership': { note: 'PlayDraft, this portfolio, and Heatherwood went to production from my own builds, and I work through pull requests at Tire Rack every week.' },
};

/**
 * The v5 allocation (2026-09-12), kept as history: the Forge's Dev mode prints
 * the v5 to v7 diff beside each node. It names the two nodes v7 retired, so
 * read it with that in mind; it is never scored.
 */
export const RYAN_V5_ALLOCATION: Allocation = {
  typography: 5, layout: 3, interaction: 2, motion: 0, tokens: 5, components: 3,
  accessibility: 4, governance: 3, research: 0, 'information-architecture': 0,
  figma: 5, prototyping: 1, storybook: 3, documentation: 3, handoff: 3, 'state-modeling': 1,
  cms: 3, 'qa-and-analytics': 2, 'ai-tools': 4, 'agent-context': 1,
  html: 5, css: 3, git: 0, automation: 0, javascript: 0, performance: 0,
  typescript: 2, react: 0, 'react-native': 2, 'production-ownership': 0,
};

/** The two authored card lines. Everyone else gets their primary ability's. */
export const RYAN_OVERRIDES = {
  passive: 'Turns complex workflows into clear product experiences and shared patterns teams can build on.',
  quest: 'Strengthen the connection between discovery, product priorities, and measurable outcomes.',
};

/**
 * The class as the hero chip and the section 05 title read it. Authored here
 * so the hero can print it without importing the scorer; ryan.test.ts holds
 * these equal to what buildResult computes from the allocation above.
 */
export const RYAN_CLASS_LABEL = 'Visual Problem Solver / Component Crafter';
export const RYAN_CLASS_SHORT = 'Visual Problem Solver';
