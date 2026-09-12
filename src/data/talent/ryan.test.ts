// Ryan's own tree, read by the same rules as everyone else: the pools, the
// allocation, the masteries, the abilities, and the authored class labels.
// Run: CI=true npx vitest run --globals src/data/talent/ryan.test.ts

import { ARCHETYPES } from './archetypes';
import { computePools, feasible, remaining, treeSpend } from './economy';
import { evaluateAbilities, pickClass } from './forge';
import { RYAN_ALLOCATION, RYAN_CLASS_LABEL, RYAN_CLASS_SHORT, RYAN_INTAKE, RYAN_OVERRIDES } from './ryan';
import { buildResult, decodeState, encodeState } from './score';
import { NODES, TREES } from './trees';

const POOLS = computePools(RYAN_INTAKE);
const RESULT = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);

describe('ryan pools and allocation', () => {
  it('earns 63 points: 16 design-locked, 4 code-locked, 43 free, level 16', () => {
    expect(POOLS.total).toBe(63);
    expect(POOLS.designLocked).toBe(16);
    expect(POOLS.codeLocked).toBe(4);
    expect(POOLS.free).toBe(43);
    expect(POOLS.level).toBe(16);
  });

  it('spends all 63, and the allocation is feasible and normalized', () => {
    const spend = treeSpend(RYAN_ALLOCATION);
    expect(spend.design + spend.technical + spend.code).toBe(63);
    expect(spend.design).toBeGreaterThanOrEqual(POOLS.designLocked);
    expect(spend.code).toBeGreaterThanOrEqual(POOLS.codeLocked);
    expect(feasible(RYAN_ALLOCATION, POOLS)).toBe(true);
    const left = remaining(RYAN_ALLOCATION, POOLS);
    expect(left.designLocked + left.codeLocked + left.free).toBe(0);
    expect(RESULT.pointsSpent).toBe(63);
    expect(Object.keys(RYAN_ALLOCATION).every((id) => !!NODES[id])).toBe(true);
  });

  it('keeps the must-have levels, holds React Native and TypeScript at 2, and keeps production ownership and React at zero', () => {
    expect(RYAN_ALLOCATION.typography).toBe(5);
    expect(RYAN_ALLOCATION.tokens).toBe(5);
    expect(RYAN_ALLOCATION.figma).toBe(5);
    expect(RYAN_ALLOCATION.html).toBe(5);
    expect(RYAN_ALLOCATION['ai-tools']).toBe(4);
    expect(RYAN_ALLOCATION.handoff).toBe(3);
    expect(RYAN_ALLOCATION.accessibility).toBe(4);
    expect(RYAN_ALLOCATION.css).toBe(3);
    expect(RYAN_ALLOCATION.storybook).toBe(3);
    expect(RYAN_ALLOCATION.documentation).toBe(3);
    expect(RYAN_ALLOCATION['production-ownership']).toBe(0);
    expect(RYAN_ALLOCATION.react).toBe(0);
    expect(RYAN_ALLOCATION['react-native']).toBe(2);
    expect(RYAN_ALLOCATION.typescript).toBe(2);
    expect(RYAN_ALLOCATION.javascript).toBe(0);
  });

  it('masters four nodes: Typography, Tokens, Figma, HTML', () => {
    expect(RESULT.mastered).toEqual(['typography', 'tokens', 'figma', 'html']);
  });
});

describe('ryan abilities and class', () => {
  const states = evaluateAbilities(RYAN_ALLOCATION);
  const unlocked = states.filter((s) => s.unlocked).map((s) => s.ability.id);

  it('unlocks exactly the four the spec names', () => {
    expect(unlocked).toEqual(['guardrail-architect', 'prototype-alchemist', 'lossless-handoff', 'system-memory']);
  });

  it('pairs React Native and TypeScript as foundations, so neither waits on a React gate', () => {
    expect(NODES['react-native'].tier).toBe('foundation');
    expect(NODES.typescript.tier).toBe('foundation');
    expect(NODES.react.tier).toBe('crown');
    expect(NODES['production-ownership'].tier).toBe('crown');
  });

  it('shows Cross-platform Builder as next, not as a claimed node', () => {
    const next = states.find((s) => s.ability.id === 'cross-platform-builder')!;
    expect(next.unlocked).toBe(false);
    expect(next.missing).toBeGreaterThan(0);
    expect(RESULT.abilities.some((s) => s.ability.id === 'cross-platform-builder' && !s.unlocked)).toBe(true);
  });

  it('picks Guardrail Architect and Prototype Alchemist, and is not provisional', () => {
    const picked = pickClass(states);
    expect(picked.primary.ability.id).toBe('guardrail-architect');
    expect(picked.secondary.ability.id).toBe('prototype-alchemist');
    expect(picked.provisional).toBe(false);
    expect(RESULT.provisional).toBe(false);
  });

  it('RYAN_CLASS_LABEL and RYAN_CLASS_SHORT are what the scorer computes', () => {
    expect(RYAN_CLASS_LABEL).toBe(`${RESULT.primary.name} / ${RESULT.secondary.name}`);
    expect(RYAN_CLASS_SHORT).toBe(RESULT.primary.name);
    expect(RYAN_CLASS_LABEL.startsWith(`${RYAN_CLASS_SHORT} / `)).toBe(true);
  });

  it('keeps the two authored card lines', () => {
    expect(RESULT.passive).toBe(RYAN_OVERRIDES.passive);
    expect(RESULT.quest).toBe(RYAN_OVERRIDES.quest);
  });

  it('leads on craft and systems in the stat bars', () => {
    const top = RESULT.topTraits.map((t) => t.trait);
    expect(top).toContain('systems');
    expect(top).toContain('craft');
    expect(RESULT.traits.research).toBeLessThan(RESULT.traits.systems);
  });
});

describe('ryan on the share link', () => {
  it('round-trips through the v5 link', () => {
    const link = encodeState(RYAN_INTAKE, RYAN_ALLOCATION);
    expect(link.startsWith('v5bgw16.5.')).toBe(true);
    const back = decodeState(link);
    expect(back).not.toBeNull();
    expect(back!.allocation).toEqual(RESULT.allocation);
    expect(back!.intake).toEqual(RYAN_INTAKE);
  });

  it('the level the hero chip prints is the level the economy computes', () => {
    expect(POOLS.level).toBe(RYAN_INTAKE.years);
    expect(RESULT.pools.level).toBe(POOLS.level);
  });

  it('carries no em dashes', () => {
    expect(RYAN_CLASS_LABEL).not.toContain('—');
    expect(RYAN_CLASS_SHORT).not.toContain('—');
    expect(`${RYAN_OVERRIDES.passive} ${RYAN_OVERRIDES.quest}`).not.toContain('—');
  });
});
