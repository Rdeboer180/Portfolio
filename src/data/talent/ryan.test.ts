// The authored class labels stay honest: they must equal what the scorer
// computes from Ryan's allocation, and the level the hero chip prints must be
// the level the economy derives from the intake.
// Run: CI=true npx vitest run --globals src/data/talent/ryan.test.ts

import { ARCHETYPES } from './archetypes';
import { computePools } from './economy';
import { RYAN_ALLOCATION, RYAN_CLASS_LABEL, RYAN_CLASS_SHORT, RYAN_INTAKE, RYAN_OVERRIDES } from './ryan';
import { buildResult } from './score';
import { TREES } from './trees';

describe('ryan class labels', () => {
  const result = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);

  it('RYAN_CLASS_LABEL is the computed primary / secondary pair', () => {
    expect(RYAN_CLASS_LABEL).toBe(`${result.primary.name} / ${result.secondary.name}`);
  });

  it('RYAN_CLASS_SHORT is the computed primary archetype', () => {
    expect(RYAN_CLASS_SHORT).toBe(result.primary.name);
    expect(RYAN_CLASS_LABEL.startsWith(`${RYAN_CLASS_SHORT} / `)).toBe(true);
  });

  it('the level the hero chip prints is the level the economy computes', () => {
    const pools = computePools(RYAN_INTAKE);
    expect(pools.level).toBe(RYAN_INTAKE.years);
    expect(result.pools.level).toBe(pools.level);
  });

  it('carries no em dashes', () => {
    expect(RYAN_CLASS_LABEL).not.toContain('—');
    expect(RYAN_CLASS_SHORT).not.toContain('—');
  });
});
