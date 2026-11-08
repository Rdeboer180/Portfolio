// Ryan's own tree, read by the same rules as everyone else: the pools, the
// allocation, the masteries, the abilities, and the authored class labels.
// Run: CI=true npx vitest run --globals src/data/talent/ryan.test.ts

import { ARCHETYPES } from './archetypes';
import { computePools, feasible, remaining, treeSpend } from './economy';
import { evaluateAbilities, pickClass } from './forge';
import { RYAN_ALLOCATION, RYAN_CLASS_LABEL, RYAN_CLASS_SHORT, RYAN_INTAKE, RYAN_NODE_NOTES, RYAN_OVERRIDES } from './ryan';
import { buildResult } from './score';
import { NODES, TREES } from './trees';

const POOLS = computePools(RYAN_INTAKE);
const RESULT = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);

describe('ryan pools and allocation', () => {
  it('earns 89 points: 16 design-locked, 4 code-locked, 69 free, level 16', () => {
    expect(POOLS.total).toBe(89);
    expect(POOLS.designLocked).toBe(16);
    expect(POOLS.codeLocked).toBe(4);
    expect(POOLS.free).toBe(69);
    expect(POOLS.level).toBe(16);
  });

  it('spends all 89, and the allocation is feasible and normalized', () => {
    const spend = treeSpend(RYAN_ALLOCATION);
    expect(spend.design + spend.technical + spend.code).toBe(89);
    expect(spend.design).toBeGreaterThanOrEqual(POOLS.designLocked);
    expect(spend.code).toBeGreaterThanOrEqual(POOLS.codeLocked);
    expect(feasible(RYAN_ALLOCATION, POOLS)).toBe(true);
    const left = remaining(RYAN_ALLOCATION, POOLS);
    expect(left.designLocked + left.codeLocked + left.free).toBe(0);
    expect(RESULT.pointsSpent).toBe(89);
    expect(Object.keys(RYAN_ALLOCATION).every((id) => !!NODES[id])).toBe(true);
  });

  it('keeps the v7 Technical asks and gives the code its due (v7.1)', () => {
    expect(RYAN_ALLOCATION.figma).toBe(5);
    expect(RYAN_ALLOCATION.prototyping).toBe(5);
    expect(RYAN_ALLOCATION['qa-and-analytics']).toBe(3);
    expect(RYAN_ALLOCATION['internal-tools']).toBe(3);
    expect(RYAN_ALLOCATION['skills-and-plugins']).toBe(3);
    expect(RYAN_ALLOCATION.research).toBe(2);
    expect(RYAN_ALLOCATION.git).toBe(4);
    expect(RYAN_ALLOCATION.automation).toBe(2);
    expect(RYAN_ALLOCATION.javascript).toBe(2);
    expect(RYAN_ALLOCATION.typescript).toBe(3);
    expect(RYAN_ALLOCATION.react).toBe(3);
    expect(RYAN_ALLOCATION['react-native']).toBe(3);
    expect(RYAN_ALLOCATION['production-ownership']).toBe(2);
  });

  it('lands the lanes at 28 / 34 / 27', () => {
    expect(treeSpend(RYAN_ALLOCATION)).toEqual({ design: 28, technical: 34, code: 27 });
  });

  it('masters five nodes: Typography, Tokens, Figma, Prototyping, HTML', () => {
    expect(RESULT.mastered).toEqual(['typography', 'tokens', 'figma', 'prototyping', 'html']);
  });

  it('marks TypeScript and React Native, and only those, as agent-built, with a note on every coded skill', () => {
    const agent = Object.keys(RYAN_NODE_NOTES).filter((id) => RYAN_NODE_NOTES[id].agent);
    expect(agent.sort()).toEqual(['react-native', 'typescript']);
    ['git', 'automation', 'javascript', 'typescript', 'react', 'react-native', 'production-ownership', 'research']
      .forEach((id) => expect(RYAN_NODE_NOTES[id].note.length).toBeGreaterThan(20));
    Object.keys(RYAN_NODE_NOTES).forEach((id) => expect(NODES[id]).toBeTruthy());
  });
});

describe('ryan abilities and class', () => {
  const states = evaluateAbilities(RYAN_ALLOCATION);
  const unlocked = states.filter((s) => s.unlocked).map((s) => s.ability.id);

  it('unlocks eight abilities, strongest first', () => {
    expect(unlocked).toEqual([
      'visual-problem-solver', 'cross-platform-builder', 'lossless-handoff', 'system-memory',
      'guardrail-architect', 'systemsmith', 'pixel-sculptor', 'agent-wrangler',
    ]);
  });

  it('pairs React Native and TypeScript as foundations, so neither waits on a React gate', () => {
    expect(NODES['react-native'].tier).toBe('foundation');
    expect(NODES.typescript.tier).toBe('foundation');
    expect(NODES.react.tier).toBe('crown');
    expect(NODES['production-ownership'].tier).toBe('crown');
  });

  it('leaves Design Diplomat and Shipwright as the next ones', () => {
    const away = (id: string) => states.find((s) => s.ability.id === id)!.missing;
    expect(away('design-diplomat')).toBe(2);
    expect(away('shipwright')).toBe(3);
  });

  it('picks Visual Problem Solver and Cross-platform Builder, and is not provisional', () => {
    const picked = pickClass(states);
    expect(picked.primary.ability.id).toBe('visual-problem-solver');
    expect(picked.secondary.ability.id).toBe('cross-platform-builder');
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

describe('ryan on the page', () => {
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
