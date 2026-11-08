// ============================================
// Talent tree: Ryan's own tree (v7, 2026-11-08)
// The intake is unchanged: 63 points, 16 locked to Design and systems by the
// graphic design major, 4 locked to Code by the web minor, 43 free. Scored by
// the same rules as everyone else; nothing here is hand-set except the two
// card lines in RYAN_OVERRIDES.
//
// v7 puts the points where the work is. The Technical lane is five pairs, each
// crown grown out of its foundation (see trees.ts), and it now holds QA and
// analytics 2, Skills and plugins 3 and Internal tools 3. Prototyping rises to
// 4 and Components to 4. The points come from code that is directed rather
// than hand-written (TypeScript 2 to 0, React Native 2 to 0, HTML 5 to 4, CSS
// 3 to 2) and from Interaction 2 to 1. The lanes land at 25 / 32 / 6.
// Six abilities unlock, up from four (Systemsmith and Agent Wrangler join).
// The class pairs Visual Problem Solver with System Memory, and the class line
// names System Memory's archetype: Visual Problem Solver / Context Carrier.
// The cost: the
// agent-built React Native and TypeScript work now shows as directed rather
// than as points, and Pixel Sculptor stays out of reach (Layout 4, CSS 3).
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
 * Design and systems (25): Typography 5 / Layout 3 · Interaction 1 / Motion 0 ·
 * Tokens 5 / Components 4 · Accessibility 4 / Governance 3 · Research 0 / IA 0
 * Technical (32): Figma 5 / Prototyping 4 · Handoff 3 / Storybook 3 ·
 * Documentation 3 / Skills and plugins 3 · CMS 3 / QA and analytics 2 ·
 * AI tools 3 / Internal tools 3
 * Code (6): HTML 4 / CSS 2, everything else 0.
 */
export const RYAN_ALLOCATION: Allocation = {
  // Design and systems
  typography: 5,
  layout: 3,
  interaction: 1,
  motion: 0,
  tokens: 5,
  components: 4,
  accessibility: 4,
  governance: 3,
  research: 0,
  'information-architecture': 0,
  // Technical
  figma: 5,
  prototyping: 4,
  handoff: 3,
  storybook: 3,
  documentation: 3,
  'skills-and-plugins': 3,
  cms: 3,
  'qa-and-analytics': 2,
  'ai-tools': 3,
  'internal-tools': 3,
  // Code
  html: 4,
  css: 2,
  git: 0,
  automation: 0,
  javascript: 0,
  performance: 0,
  typescript: 0,
  react: 0,
  'react-native': 0,
  'production-ownership': 0,
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
export const RYAN_CLASS_LABEL = 'Visual Problem Solver / Context Carrier';
export const RYAN_CLASS_SHORT = 'Visual Problem Solver';
