// ============================================
// Talent tree: Ryan's own tree
// The intake and allocation from BRIEF-v3 ("Ryan's allocation"), plus the
// four points Ryan's degree rule added on 2026-09-11: 63 craft points across
// the Craft and Systems trees (16 locked to Craft by the graphic design
// major, 4 locked to Systems and build by the web minor, 43 free), 21 core
// points on the Core tree. Scored by the same rules as everyone else; nothing
// here is hand-set except the two card lines in RYAN_OVERRIDES, which the
// brief authored.
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
 * Craft: Visual craft 5/3 · Interaction design 3/1 · Product thinking 3/0 ·
 * Research 2/0 · Prototyping 5/2 (24)
 * Systems and build: Design systems 5/5 · Governance 5/4 · Design-to-code 5/2
 * (Production ownership is deliberately low: he does not own production
 * front-end) · AI and agentic 4/3 · Systems thinking 4/2 (39)
 * Core: Collaboration 4/2 · Communication 5/1 · Leadership 4/0 · Problem
 * solving 3/0 · Strategy 2/0 (21)
 * The four points the degree rule added: Research foundation 1 to 2, Product
 * thinking foundation 2 to 3, Interaction design crown 0 to 1, Systems
 * thinking crown 1 to 2.
 */
export const RYAN_ALLOCATION: Allocation = {
  // Craft
  'typography-and-hierarchy': 5,
  'composition-brand-and-polish': 3,
  'states-and-behavior': 3,
  'motion-and-micro-interaction-systems': 1,
  'problem-framing': 3,
  'flows-edge-cases-and-decisions': 0,
  'discovery-and-synthesis': 2,
  'evidence-and-measurement': 0,
  'high-fidelity-in-figma': 5,
  'coded-prototypes-that-ship': 2,
  // Systems and build
  'tokens-and-variables': 5,
  'components-storybook-and-scaling': 5,
  'standards-accessibility-and-qa': 5,
  'exceptions-contribution-and-agent-readable-rules': 4,
  'html-css-and-state-definition': 5,
  'production-ownership': 2,
  'ai-assisted-exploration': 4,
  'systems-that-direct-agents': 3,
  'information-architecture': 4,
  'patterns-that-hold-across-surfaces': 2,
  // Core
  // Ryan's words: writing is not the strength, critiquing and context are.
  // One Core mastery, Working across disciplines; the crowns behind it are
  // Critique and consensus and Context that survives the room.
  'working-across-disciplines': 5,
  'critique-and-consensus': 4,
  'writing-and-presenting': 3,
  'context-that-survives-the-room': 4,
  mentoring: 3,
  'direction-and-advocacy': 0,
  reframing: 2,
  'deciding-under-constraint': 0,
  'user-business-and-technical-constraints': 0,
  'north-star-and-direction': 0,
};

/** The two authored card lines. Everyone else gets their primary archetype's. */
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
