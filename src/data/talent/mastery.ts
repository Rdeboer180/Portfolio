import type { AtlasAbilityState } from './atlas';

export type MasteryId = 'form' | 'meaning' | 'behavior' | 'structure' | 'realization' | 'stewardship';
interface Facet { name: string; abilities: string[] }
export interface MasteryDomain { id: MasteryId; name: string; title: string; description: string; facets: Facet[] }
export const MASTERY_DOMAINS: MasteryDomain[] = [
  { id: 'form', name: 'Form', title: 'Formshaper', description: 'You give ideas a visual language through type, imagery, space, and rhythm.', facets: [
    { name: 'Image composition', abilities: ['pixel-prowess'] }, { name: 'Graphic precision', abilities: ['vector-velocity'] }, { name: 'Visual language', abilities: ['brand-barrage'] }] },
  { id: 'meaning', name: 'Meaning', title: 'Sensemaker', description: 'You turn evidence and complex information into direction people can understand.', facets: [
    { name: 'Evidence', abilities: ['signal-sense', 'evidence-loop'] }, { name: 'Information clarity', abilities: ['cms-command', 'content-choreography'] }, { name: 'Shared understanding', abilities: ['design-diplomacy'] }] },
  { id: 'behavior', name: 'Behavior', title: 'Flowshaper', description: 'You make actions, feedback, transitions, and states feel coherent.', facets: [
    { name: 'State and feedback', abilities: ['state-sense', 'motion-momentum', 'system-clarity'] }, { name: 'Interaction judgment', abilities: ['interface-instinct'] }, { name: 'Working behavior', abilities: ['script-spark', 'typescript-tempo'] }] },
  { id: 'structure', name: 'Structure', title: 'Systemsmith', description: 'You turn individual design decisions into a reusable language that holds together.', facets: [
    { name: 'Foundations', abilities: ['token-tactics'] }, { name: 'Reusable parts', abilities: ['figma-force', 'component-combo', 'systemsmith'] }, { name: 'System coherence', abilities: ['system-sight', 'cross-platform-craft'] }] },
  { id: 'realization', name: 'Realization', title: 'Bridgewright', description: 'You carry ideas into working artifacts without losing the intent along the way.', facets: [
    { name: 'Tangible exploration', abilities: ['prototype-pulse', 'prototype-alchemist', 'agent-arsenal'] }, { name: 'Construction', abilities: ['front-end-flow', 'front-end-mastery', 'template-tactics', 'automation-advantage', 'connected-interfaces'] }, { name: 'Design continuity', abilities: ['handoff-harmony', 'lossless-handoff'] }] },
  { id: 'stewardship', name: 'Stewardship', title: 'Steward', description: 'You keep work accessible, understandable, and useful as people and systems change.', facets: [
    { name: 'Inclusive foundations', abilities: ['accessibility-armor'] }, { name: 'Durable standards', abilities: ['guardrail-architect'] }, { name: 'Continuity', abilities: ['system-memory', 'shipwright', 'reliable-components'] }] },
];
export const CLASS_LEVELS = ['Initiate', 'Apprentice', 'Adept', 'Expert', 'Master'] as const;
export const PROFICIENCY_NAMES: Record<string, string> = {
  'systemsmith': 'Component Continuity', 'guardrail-architect': 'Durable Standards',
  'prototype-alchemist': 'Tangible Exploration', 'shipwright': 'Production Stewardship',
};
export function proficiencyName(state: AtlasAbilityState) { return PROFICIENCY_NAMES[state.ability.id] || state.ability.name; }

export function evaluateMastery(states: AtlasAbilityState[]) {
  const byId = new Map(states.map(state => [state.ability.id, state]));
  return MASTERY_DOMAINS.map(domain => {
    // Alternatives in one facet never stack. Inactive remembered discoveries score zero.
    const facets = domain.facets.map(facet => {
      const candidates = facet.abilities.map(id => byId.get(id)).filter((s): s is AtlasAbilityState => Boolean(s && s.rank > 0));
      const strongest = candidates.sort((a, b) => b.rank - a.rank || a.ability.id.localeCompare(b.ability.id))[0];
      return { ...facet, rank: strongest?.rank || 0, strongest };
    });
    const strength = facets.reduce((sum, facet) => sum + facet.rank, 0);
    const coverage = facets.filter(facet => facet.rank > 0).length;
    // A single facet stays Initiate; Master requires all three facets at rank five.
    const level = strength === 15 ? 5 : Math.min(coverage === 3 ? 4 : coverage === 2 ? 2 : 1, Math.max(1, Math.floor(strength / 3)));
    return { ...domain, facets, strength, coverage, level, levelName: CLASS_LEVELS[level - 1] };
  });
}
export function resolveMastery(states: AtlasAbilityState[]) {
  const domains = evaluateMastery(states);
  // Catalog order is the stable final tie-breaker: independent of click/history order.
  const primary = [...domains].sort((a, b) => b.strength - a.strength || b.coverage - a.coverage)[0];
  return { domains, primary: primary.strength ? primary : null, title: primary.strength ? `${primary.levelName} ${primary.title}` : 'Initiate Maker' };
}

/** Strongest first; recipe progress breaks rank ties, then the visible name. */
export function rankProficiencies(states: AtlasAbilityState[]) {
  return [...states].sort((a, b) => b.rank - a.rank || b.charge - a.charge || proficiencyName(a).localeCompare(proficiencyName(b)));
}
