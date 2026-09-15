/** Public case studies support the claim; these links do not imply a proficiency score. */
export interface ForgeEvidence { title: string; href: string; detail: string }
const wheelrack = { title: 'WheelRack', href: '/work/wheelrack/', detail: 'A shared token and component language carried from Figma through Storybook into the dealer journey.' };
const exploration = { title: 'Design enablement tools', href: '/work/design-enablement/', detail: 'A Figma plugin, responsive crop simulator, and presentation system built around the team’s daily work.' };
const visualCraft = { title: 'Heatherwood', href: '/work/heatherwood/', detail: 'A visual identity carried into a website the owner can maintain.' };
const content = { title: 'Tire category system', href: '/work/tire-categories/', detail: 'Category hierarchy, visual comparisons, and search content shaped into one reusable page system.' };
const production = { title: 'AEM component system', href: '/work/aem-component-system/', detail: 'Component specifications and production Sass developed alongside engineering.' };
export const PROFICIENCY_EVIDENCE: Record<string, ForgeEvidence> = {
  'guardrail-architect': wheelrack, 'system-sight': wheelrack, 'systemsmith': wheelrack,
  'component-combo': wheelrack, 'figma-force': wheelrack, 'token-tactics': production,
  'prototype-alchemist': exploration, 'prototype-pulse': exploration, 'agent-arsenal': exploration,
  'pixel-prowess': visualCraft, 'brand-barrage': visualCraft, 'vector-velocity': visualCraft,
  'cms-command': content, 'content-choreography': content, 'system-clarity': wheelrack,
  'handoff-harmony': production, 'lossless-handoff': wheelrack, 'front-end-flow': production,
  'shipwright': production,
};
export const TALENT_EVIDENCE: Record<string, ForgeEvidence> = {
  'systems-mapping': wheelrack, 'information-architecture': content,
  'production-ownership': production,
  react: { ...wheelrack, detail: 'I owned the system design, component logic, and responsive behavior. Cheryl Carpenter owned the React build.' },
};
