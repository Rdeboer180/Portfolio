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
// the Technical lane alone. The lanes land at 27 / 27 / 9 instead. Every
// must-have level the spec named is kept (Typography 5, Tokens 5, Figma 5,
// HTML 5, AI tools 4, Handoff 4, Accessibility 4, Storybook 3, Documentation 3,
// CSS 4), Production ownership, React, and React Native stay at 0, and the
// masteries are still exactly four: Typography, Tokens, Figma, HTML.
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
 * Design and systems (27): Typography 5 / Layout 3 · Interaction 3 / Motion 1 ·
 * Tokens 5 / Components 3 · Accessibility 4 / Governance 3 · Research 0 / IA 0
 * Technical (27): Figma 5 / Prototyping 1 · Storybook 3 / Documentation 3 ·
 * Handoff 4 / State modeling 1 · CMS 3 / QA and analytics 2 · AI tools 4 /
 * Agent context 1
 * Code (9): HTML 5 / CSS 4, everything else 0. The React Native work is
 * agent-assisted, so it shows as a next ability rather than a claimed node.
 */
export const RYAN_ALLOCATION: Allocation = {
  // Design and systems
  typography: 5,
  layout: 3,
  interaction: 3,
  motion: 1,
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
  handoff: 4,
  'state-modeling': 1,
  cms: 3,
  'qa-and-analytics': 2,
  'ai-tools': 4,
  'agent-context': 1,
  // Code
  html: 5,
  css: 4,
  git: 0,
  automation: 0,
  javascript: 0,
  typescript: 0,
  react: 0,
  'react-native': 0,
  'production-ownership': 0,
  performance: 0,
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
