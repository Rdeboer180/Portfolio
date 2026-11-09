// Ryan's own tree, read by the same rules as everyone else: the pools, the
// allocation, the masteries, the abilities, and the authored class labels.
// Run: CI=true npx vitest run --globals src/data/talent/ryan.test.ts

import { ARCHETYPES } from './archetypes';
import { computePools, feasible, remaining, treeSpend } from './economy';
import { evaluateAbilities, pickClass } from './abilities';
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

  it('holds Ryan\'s v7.2 levels, and the code pays for them around its gates', () => {
    const want: Record<string, number> = {
      figma: 5, prototyping: 5, handoff: 4, storybook: 2, 'skills-and-plugins': 4, cms: 5,
      'qa-and-analytics': 2, 'internal-tools': 4, governance: 4, research: 3, interaction: 3, motion: 1,
      git: 3, automation: 1, javascript: 1, css: 2, typescript: 3, react: 1, 'react-native': 3,
      'production-ownership': 0,
    };
    Object.entries(want).forEach(([id, level]) => expect([id, RYAN_ALLOCATION[id]]).toEqual([id, level]));
    // Nothing is gated out: every point counts.
    expect(RESULT.allocation).toEqual(Object.fromEntries(Object.entries(RYAN_ALLOCATION).filter(([, v]) => v > 0)));
  });

  it('lands the lanes at 33 / 37 / 19', () => {
    expect(treeSpend(RYAN_ALLOCATION)).toEqual({ design: 33, technical: 37, code: 19 });
  });

  it('masters six nodes: Typography, Tokens, Figma, Prototyping, CMS, HTML', () => {
    expect(RESULT.mastered).toEqual(['typography', 'tokens', 'figma', 'prototyping', 'cms', 'html']);
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

  it('unlocks four abilities, strongest first', () => {
    expect(unlocked).toEqual(['visual-problem-solver', 'system-memory', 'guardrail-architect', 'agent-wrangler']);
  });

  it('pairs React Native and TypeScript as foundations, so neither waits on a React gate', () => {
    expect(NODES['react-native'].tier).toBe('foundation');
    expect(NODES.typescript.tier).toBe('foundation');
    expect(NODES.react.tier).toBe('crown');
    expect(NODES['production-ownership'].tier).toBe('crown');
  });

  it('leaves four abilities a point away: Systemsmith, Pixel Sculptor, Lossless Handoff, Design Diplomat', () => {
    const away = (id: string) => states.find((s) => s.ability.id === id)!.missing;
    ['systemsmith', 'pixel-sculptor', 'lossless-handoff', 'design-diplomat'].forEach((id) => expect([id, away(id)]).toEqual([id, 1]));
    expect(away('shipwright')).toBe(7);
  });

  it('picks Visual Problem Solver and System Memory, and is not provisional', () => {
    const picked = pickClass(states);
    expect(picked.primary.ability.id).toBe('visual-problem-solver');
    expect(picked.secondary.ability.id).toBe('system-memory');
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
