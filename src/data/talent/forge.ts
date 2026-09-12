// ============================================
// The Ability Forge (v5, 2026-09-12)
// Abilities are unlocked by RECIPES over node levels, never spent: the points
// stay on the nodes and an ability reads them. Each ability points at an
// archetype id, so the copy (name, line, you, cares, happiest, passive, quest)
// stays in archetypes.ts and is never duplicated here.
//
// Strength is the overshoot: the sum of (level over min) across the recipe.
// Ties break by family order (systems, exploration, craft, build, product, ai,
// research, collaboration), then by the order the abilities are authored in.
//
// Thresholds are the tuning surface. The four Ryan unlocks (Guardrail
// Architect, Prototype Alchemist, Lossless Handoff, System Memory) were tuned
// against his allocation in ryan.ts; every change from the spec's starting
// numbers is noted on the recipe.
// ============================================

import type { Ability, AbilityState, Allocation, Family, TalentTree } from './types';
import { NODES, TREES } from './trees';
import { MAX_POINTS_PER_NODE } from './economy';

/** The tie-break order for equal strength. */
export const FAMILY_ORDER: Family[] = [
  'systems', 'exploration', 'craft', 'build', 'product', 'ai', 'research', 'collaboration',
];

export const ABILITIES: Ability[] = [
  {
    id: 'guardrail-architect',
    archetypeId: 'guardrail-architect',
    name: 'Guardrail Architect',
    family: 'systems',
    formula: [
      { nodeId: 'tokens', min: 4 },
      { nodeId: 'accessibility', min: 4 },
      { nodeId: 'governance', min: 3 },
      { nodeId: 'documentation', min: 3 },
    ],
    line: 'Standards, accessibility, and governance that hold when you leave the room',
  },
  {
    id: 'prototype-alchemist',
    archetypeId: 'prototype-alchemist',
    name: 'Prototype Alchemist',
    family: 'exploration',
    // Tuned: Prototyping 3 to 1, AI tools 3 to 4, HTML 3 to 5. The alchemy is
    // the tool mastery, not the hours in the prototype file.
    formula: [
      { nodeId: 'figma', min: 5 },
      { nodeId: 'prototyping', min: 1 },
      { nodeId: 'ai-tools', min: 4 },
      { nodeId: 'html', min: 5 },
    ],
    line: 'Ideas made real enough to argue with, in whichever medium answers fastest',
  },
  {
    id: 'lossless-handoff',
    archetypeId: 'front-end-translator',
    name: 'Lossless Handoff',
    family: 'build',
    // Tuned: State modeling 3 to 1. The handoff is carried by the component
    // contract and the QA pass; the state map only has to exist.
    formula: [
      { nodeId: 'components', min: 3 },
      { nodeId: 'storybook', min: 3 },
      { nodeId: 'state-modeling', min: 1 },
      { nodeId: 'qa-and-analytics', min: 2 },
    ],
    line: 'What was designed is what gets built, states and all',
  },
  {
    id: 'system-memory',
    archetypeId: 'context-carrier',
    name: 'System Memory',
    family: 'collaboration',
    // Tuned: Agent context 3 to 1. The memory lives in the documents and the
    // governance; the agent-readable layer is the smaller half.
    formula: [
      { nodeId: 'documentation', min: 3 },
      { nodeId: 'governance', min: 3 },
      { nodeId: 'agent-context', min: 1 },
    ],
    line: 'The reasoning outlives the project, for the next person and the next agent',
  },
  {
    id: 'pixel-sculptor',
    archetypeId: 'pixel-sculptor',
    name: 'Pixel Sculptor',
    family: 'craft',
    // Tuned: Layout 3 to 4. Sculpting is the composition, not only the type.
    formula: [
      { nodeId: 'typography', min: 5 },
      { nodeId: 'layout', min: 4 },
      { nodeId: 'css', min: 3 },
    ],
    line: 'Type, space, and the last ten percent, carried into the medium',
  },
  {
    id: 'interaction-inventor',
    archetypeId: 'interaction-inventor',
    name: 'Interaction Inventor',
    family: 'exploration',
    formula: [
      { nodeId: 'interaction', min: 4 },
      { nodeId: 'motion', min: 3 },
      { nodeId: 'prototyping', min: 3 },
    ],
    line: 'New behavior invented, then proved before anyone builds it',
  },
  {
    id: 'systemsmith',
    archetypeId: 'systemsmith',
    name: 'Systemsmith',
    family: 'systems',
    formula: [
      { nodeId: 'tokens', min: 4 },
      { nodeId: 'components', min: 4 },
      { nodeId: 'storybook', min: 3 },
    ],
    line: 'Tokens and components that make the next screen start half built',
  },
  {
    id: 'agent-wrangler',
    archetypeId: 'agent-wrangler',
    name: 'Agent Wrangler',
    family: 'ai',
    formula: [
      { nodeId: 'ai-tools', min: 4 },
      { nodeId: 'agent-context', min: 3 },
      { nodeId: 'automation', min: 2 },
    ],
    line: 'Agents pointed at the work with enough context to be useful',
  },
  {
    id: 'sensemaker',
    archetypeId: 'sensemaker',
    name: 'Sensemaker',
    family: 'research',
    formula: [
      { nodeId: 'research', min: 4 },
      { nodeId: 'information-architecture', min: 3 },
      { nodeId: 'qa-and-analytics', min: 2 },
    ],
    line: 'Noise turned into the few findings a team can act on',
  },
  {
    id: 'design-diplomat',
    archetypeId: 'design-diplomat',
    name: 'Design Diplomat',
    family: 'collaboration',
    // Tuned: Handoff 4 to 5. Diplomacy is a mastery of the handoff itself.
    formula: [
      { nodeId: 'handoff', min: 5 },
      { nodeId: 'documentation', min: 2 },
      { nodeId: 'governance', min: 2 },
    ],
    line: 'The engineering conversation joined early enough to change the outcome',
  },
  {
    id: 'shipwright',
    archetypeId: 'shipwright',
    name: 'Shipwright',
    family: 'build',
    formula: [
      { nodeId: 'react', min: 3 },
      { nodeId: 'production-ownership', min: 3 },
      { nodeId: 'performance', min: 2 },
      { nodeId: 'git', min: 2 },
    ],
    line: 'Owned in production, where the work finally becomes visible',
  },
  {
    id: 'cross-platform-builder',
    archetypeId: 'component-crafter',
    name: 'Cross-platform Builder',
    family: 'build',
    formula: [
      { nodeId: 'react', min: 3 },
      { nodeId: 'react-native', min: 3 },
      { nodeId: 'tokens', min: 3 },
      { nodeId: 'typescript', min: 2 },
    ],
    line: 'One component vocabulary carried from the browser to the phone',
  },
];

export const ABILITY_BY_ID: Record<string, Ability> = ABILITIES.reduce<Record<string, Ability>>((acc, a) => {
  acc[a.id] = a;
  return acc;
}, {});

function pointsAt(allocation: Allocation, id: string): number {
  const v = allocation[id];
  if (typeof v !== 'number' || !isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_POINTS_PER_NODE, Math.floor(v)));
}

function familyRank(family: Family): number {
  const i = FAMILY_ORDER.indexOf(family);
  return i < 0 ? FAMILY_ORDER.length : i;
}

/** One ability read against an allocation. */
export function evaluateAbility(ability: Ability, allocation: Allocation): AbilityState {
  const levels = ability.formula.map((step) => ({
    nodeId: step.nodeId,
    level: pointsAt(allocation, step.nodeId),
    min: step.min,
  }));
  const missing = levels.reduce((sum, l) => sum + Math.max(0, l.min - l.level), 0);
  const unlocked = missing === 0;
  const strength = unlocked ? levels.reduce((sum, l) => sum + (l.level - l.min), 0) : 0;
  return { ability, unlocked, strength, missing, levels };
}

/**
 * Every ability read against an allocation, sorted: unlocked first, then by
 * strength (descending), then by family order, then by the authored order.
 * Locked abilities sort by how few points they are away, so the head of the
 * locked run is what the console labels "next".
 */
export function evaluateAbilities(
  allocation: Allocation,
  abilities: Ability[] = ABILITIES,
  trees: TalentTree[] = TREES,
): AbilityState[] {
  const known = abilities.filter((a) => a.formula.every((s) => nodeExists(s.nodeId, trees)));
  const index = new Map(known.map((a, i) => [a.id, i]));
  return known
    .map((a) => evaluateAbility(a, allocation))
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      if (a.unlocked) {
        if (b.strength !== a.strength) return b.strength - a.strength;
      } else if (a.missing !== b.missing) {
        return a.missing - b.missing;
      }
      const fam = familyRank(a.ability.family) - familyRank(b.ability.family);
      if (fam !== 0) return fam;
      return (index.get(a.ability.id) || 0) - (index.get(b.ability.id) || 0);
    });
}

function nodeExists(nodeId: string, trees: TalentTree[]): boolean {
  if (trees === TREES) return !!NODES[nodeId];
  return trees.some((t) => t.areas.some((a) => a.nodes.some((n) => n.id === nodeId)));
}

export interface ForgeClass {
  primary: AbilityState;
  secondary: AbilityState;
  /** True when fewer than two abilities are unlocked and the pair is filled from the nearest. */
  provisional: boolean;
}

/**
 * The class: the two strongest UNLOCKED abilities from different families.
 * With fewer than two of those, the nearest locked abilities fill in and the
 * pair is provisional.
 */
export function pickClass(states: AbilityState[]): ForgeClass {
  if (!states.length) throw new Error('pickClass: the ability list is empty');

  const unlocked = states.filter((s) => s.unlocked);
  const primary = unlocked[0] || states[0];
  const sameRun = primary.unlocked ? unlocked : states;
  const other =
    sameRun.find((s) => s !== primary && s.ability.family !== primary.ability.family) ||
    states.find((s) => s !== primary && s.ability.family !== primary.ability.family) ||
    states.find((s) => s !== primary) ||
    primary;
  return { primary, secondary: other, provisional: unlocked.length < 2 };
}

/** "4 unlocked of 12 · Guardrail Architect, Prototype Alchemist, Lossless Handoff, System Memory". */
export function abilityReceiptLine(states: AbilityState[]): string {
  const unlocked = states.filter((s) => s.unlocked);
  const head = `${unlocked.length} unlocked of ${states.length}`;
  if (!unlocked.length) {
    const next = states[0];
    return next ? `${head} · next, ${next.ability.name}, ${next.missing} away` : head;
  }
  return `${head} · ${unlocked.map((s) => s.ability.name).join(', ')}`;
}

/** The recipe as the console prints it ("Tokens 4 · Accessibility 4 · Governance 3 · Documentation 3"). */
export function formulaLine(ability: Ability): string {
  return ability.formula
    .map((step) => `${NODES[step.nodeId] ? NODES[step.nodeId].name : step.nodeId} ${step.min}`)
    .join(' · ');
}
