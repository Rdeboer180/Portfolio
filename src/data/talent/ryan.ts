// ============================================
// Talent tree: Ryan's own tree (v5, 2026-09-12)
// The intake is unchanged. The allocation is the v5 three-lane one: 63 points,
// 16 locked to Design and systems by the graphic design major, 4 locked to
// Code by the web minor, 43 free. Scored by the same rules as everyone else;
// nothing here is hand-set except the two card lines in RYAN_OVERRIDES.
//
// Balancing note (the spec delegated this): the spec's sketch of 31 / 21 / 11
// across the lanes cannot pay for the four abilities it also requires, because
// Lossless Handoff reads CMS and QA and analytics, which cost five points in
// the Technical lane alone. The lanes landed at 27 / 27 / 9.
//
// Retune (2026-09-12, after the site audit): a zero on React Native and
// TypeScript read as "never touched it", which is false. Both now hold 2,
// the agent-assisted builds, and the Code lane pairs them as foundations so
// neither hides behind a React gate. The four points come from CSS 4 to 3,
// Handoff 4 to 3, and the Interaction area (Interaction 3 to 2, which locks
// its Motion crown, so Motion 1 to 0); the lanes land at 25 / 26 / 12. Those
// were the only points free to move: every other foundation is a mastery, a
// recipe minimum, or holding a crown open at 3. Every recipe minimum is
// kept: the four abilities still unlock, Systemsmith is still one point away,
// and the masteries are still exactly four: Typography, Tokens, Figma, HTML.
// React and Production ownership stay at 0.
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
 * Design and systems (25): Typography 5 / Layout 3 · Interaction 2 / Motion 0 ·
 * Tokens 5 / Components 3 · Accessibility 4 / Governance 3 · Research 0 / IA 0
 * Technical (26): Figma 5 / Prototyping 1 · Storybook 3 / Documentation 3 ·
 * Handoff 3 / State modeling 1 · CMS 3 / QA and analytics 2 · AI tools 4 /
 * Agent context 1
 * Code (12): HTML 5 / CSS 3, TypeScript 2, React Native 2, everything else 0.
 * The React Native and TypeScript work is agent-assisted: two points each,
 * their crowns (React, Production ownership) still locked.
 */
export const RYAN_ALLOCATION: Allocation = {
  // Design and systems
  typography: 5,
  layout: 3,
  interaction: 2,
  motion: 0,
  tokens: 5,
  components: 3,
  accessibility: 4,
  governance: 3,
  research: 0,
  'information-architecture': 0,
  // Technical
  figma: 5,
  prototyping: 1,
  storybook: 3,
  documentation: 3,
  handoff: 3,
  'state-modeling': 1,
  cms: 3,
  'qa-and-analytics': 2,
  'ai-tools': 4,
  'agent-context': 1,
  // Code
  html: 5,
  css: 3,
  git: 0,
  automation: 0,
  javascript: 0,
  performance: 0,
  typescript: 2,
  react: 0,
  'react-native': 2,
  'production-ownership': 0,
};

/** The two authored card lines. Everyone else gets their primary ability's. */
export const RYAN_OVERRIDES = {
  passive: 'Designs systems that continue working when he leaves the room.',
  quest: 'Make designers and agents speak the same language.',
};

/**
 * The class as the hero chip and the section 05 title read it. Authored here
 * so the hero can print it without importing the scorer; ryan.test.ts holds
 * these equal to what buildResult computes from the allocation above.
 */
export const RYAN_CLASS_LABEL = 'Guardrail Architect / Prototype Alchemist';
export const RYAN_CLASS_SHORT = 'Guardrail Architect';
