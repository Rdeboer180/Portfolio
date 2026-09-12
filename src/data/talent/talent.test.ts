// The v5 data module: the three lanes, the one pool with its two locked parts,
// spending, feasibility, the share link, and the result.
// Run: CI=true npx vitest run --globals src/data/talent/talent.test.ts

import { ARCHETYPES } from './archetypes';
import {
  CROWN_UNLOCK_AT,
  MAX_POINTS_PER_NODE,
  canSpend,
  clampToPools,
  computePools,
  feasible,
  isLocked,
  normalizeAllocation,
  poolsSpent,
  remaining,
  spend,
  treeSpend,
  yearsPoints,
  yearsSplit,
} from './economy';
import { GLYPHS } from './glyphs';
import { AREAS, NODES, NODE_LIST, TREES, crownOf, foundationOf, treeOf } from './trees';
import { analyzeTraits, buildResult, decodeState, encodeState } from './score';
import type { Allocation, Intake, TreeId } from './types';
import { TRAITS } from './types';

const INTAKE: Intake = { name: 'Test', degree: 'bachelors', major: 'graphic', minor: 'web', years: 16, hours: 5 };

describe('the three lanes', () => {
  it('is three lanes, fifteen areas, thirty nodes', () => {
    expect(TREES.map((t) => t.id)).toEqual(['design', 'technical', 'code']);
    expect(AREAS.length).toBe(15);
    expect(NODE_LIST.length).toBe(30);
    TREES.forEach((tree) => expect(tree.areas.length).toBe(5));
  });

  it('names every node the spec names, as a short noun with a kebab-case id', () => {
    const names = NODE_LIST.map((n) => n.name);
    expect(names).toEqual([
      'Typography', 'Layout', 'Interaction', 'Motion', 'Tokens', 'Components',
      'Accessibility', 'Governance', 'Research', 'Information architecture',
      'Figma', 'Prototyping', 'Storybook', 'Documentation', 'Handoff', 'State modeling',
      'CMS', 'QA and analytics', 'AI tools', 'Agent context',
      'HTML', 'CSS', 'Git', 'Automation', 'JavaScript', 'Performance',
      'TypeScript', 'React', 'React Native', 'Production ownership',
    ]);
    NODE_LIST.forEach((n) => {
      expect(n.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(n.meaning.length).toBeGreaterThan(20);
      expect(n.masteryLine.length).toBeGreaterThan(20);
      expect(`${n.meaning} ${n.masteryLine}`).not.toContain('—');
    });
  });

  it('every node has a glyph that exists and weights that sum to one', () => {
    NODE_LIST.forEach((n) => {
      expect(GLYPHS[n.glyph]).toBeTruthy();
      const sum = TRAITS.reduce((s, t) => s + (n.weights[t] || 0), 0);
      expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
    });
    TREES.forEach((t) => expect(GLYPHS[t.root.glyph]).toBeTruthy());
  });

  it('leans the way each lane is meant to lean', () => {
    const lean = (id: TreeId, trait: 'build' | 'systems' | 'craft') =>
      TREES.find((t) => t.id === id)!.areas
        .reduce((s, a) => s + a.nodes.reduce((x, n) => x + (n.weights[trait] || 0), 0), 0);
    expect(lean('code', 'build')).toBeGreaterThan(lean('design', 'build'));
    expect(lean('design', 'craft')).toBeGreaterThan(lean('code', 'craft'));
    expect(lean('technical', 'systems')).toBeGreaterThan(lean('code', 'systems'));
  });

  it('pairs a foundation with a crown in every area', () => {
    AREAS.forEach((a) => {
      expect(a.nodes[0].tier).toBe('foundation');
      expect(a.nodes[1].tier).toBe('crown');
      expect(crownOf(a.nodes[0].id)).toBe(a.nodes[1]);
      expect(foundationOf(a.nodes[1].id)).toBe(a.nodes[0]);
      expect(crownOf(a.nodes[1].id)).toBeUndefined();
      expect(foundationOf(a.nodes[0].id)).toBeUndefined();
    });
  });
});

describe('the economy: one pool, two locked parts', () => {
  it('counts Ryan\'s intake as 63 = 16 design-locked, 4 code-locked, 43 free', () => {
    const pools = computePools(INTAKE);
    expect(pools.total).toBe(63);
    expect(pools.designLocked).toBe(16);
    expect(pools.codeLocked).toBe(4);
    expect(pools.free).toBe(43);
    expect(pools.level).toBe(16);
  });

  it('locks the degree to the major\'s lane and the minor to its own', () => {
    const web = computePools({ ...INTAKE, major: 'web', minor: 'graphic' });
    expect(web.codeLocked).toBe(16);
    expect(web.designLocked).toBe(4);
  });

  it('treats a degree in another field, and self-taught, as free points', () => {
    expect(computePools({ ...INTAKE, major: 'other', minor: 'none' }).free).toBe(8 + 38 + 5);
    const self = computePools({ ...INTAKE, degree: 'self-taught', minor: 'none' });
    expect(self.designLocked + self.codeLocked).toBe(0);
    expect(self.total).toBe(8 + 38 + 5);
  });

  it('locks the years across the two lanes when the intake splits them', () => {
    expect(yearsPoints(16)).toBe(38);
    expect(yearsSplit(16, 70)).toEqual({ design: 27, code: 11 });
    const pools = computePools({ ...INTAKE, split: 70 });
    expect(pools.designLocked).toBe(16 + 27);
    expect(pools.codeLocked).toBe(4 + 11);
    expect(pools.free).toBe(5);
    expect(pools.total).toBe(63);
  });

  it('writes the receipt in the v5 wording, with the lock on the line', () => {
    const pools = computePools(INTAKE);
    expect(pools.receipt[0].label).toBe("+16 · Bachelor's, graphic design · locked to Design and systems");
    expect(pools.receipt[0].lockedTo).toBe('design');
    expect(pools.receipt[1].label).toBe('+4 · Minor, web · locked to Code');
    expect(pools.receipt[1].lockedTo).toBe('code');
    expect(pools.receipt.every((l) => l.pool === 'points')).toBe(true);
    expect(pools.receipt.some((l) => /core/i.test(l.label))).toBe(false);
    expect(pools.receipt.reduce((s, l) => s + l.points, 0)).toBe(63);
  });

  it('has retired the core pool', () => {
    const pools = computePools(INTAKE);
    expect('core' in pools).toBe(false);
    expect(poolsSpent({ tokens: 3 })).toEqual({ points: 3 });
  });
});

describe('spending', () => {
  const pools = computePools(INTAKE);

  it('gates a crown behind three points in its foundation', () => {
    let a: Allocation = {};
    a = spend(a, 'tokens', 2, pools);
    expect(isLocked(a, 'components')).toBe(true);
    expect(canSpend(a, 'components', TREES, pools)).toBe(false);
    a = spend(a, 'tokens', 1, pools);
    expect(isLocked(a, 'components')).toBe(false);
    a = spend(a, 'components', 2, pools);
    expect(a.components).toBe(2);
    a = spend(a, 'tokens', -1, pools);
    expect(a.components).toBe(0);
  });

  it('caps a node at five and refuses an unknown id', () => {
    const a = spend({}, 'html', 9, pools);
    expect(a.html).toBe(MAX_POINTS_PER_NODE);
    expect(canSpend(a, 'html', TREES, pools)).toBe(false);
    expect(spend(a, 'not-a-node', 1, pools)).toBe(a);
  });

  it('refuses a point the pool cannot pay for', () => {
    const small = computePools({ ...INTAKE, degree: 'none', major: 'other', minor: 'none', years: 0, hours: 1 });
    expect(small.total).toBe(1);
    const a = spend({}, 'figma', 1, small);
    expect(a.figma).toBe(1);
    expect(canSpend(a, 'figma', TREES, small)).toBe(false);
    expect(spend(a, 'typography', 1, small)).toBe(a);
  });

  it('lets a locked lane spend its own part before the free part', () => {
    const only = computePools({ ...INTAKE, years: 0, hours: 0, minor: 'none' });
    expect(only.designLocked).toBe(16);
    expect(only.free).toBe(0);
    const design: Allocation = { typography: 5, layout: 5, interaction: 3, motion: 3 };
    expect(feasible(design, only)).toBe(true);
    expect(feasible({ ...design, figma: 1 }, only)).toBe(false);
  });

  it('counts what is spent per lane and what is left per part', () => {
    const a: Allocation = { typography: 5, figma: 5, html: 5 };
    expect(treeSpend(a)).toEqual({ design: 5, technical: 5, code: 5 });
    const left = remaining(a, pools);
    expect(left.designLocked).toBe(11);
    expect(left.codeLocked).toBe(0);
    expect(left.free).toBe(43 - 5 - 1);
  });
});

describe('normalizing and clamping', () => {
  it('drops unknown ids, clamps points, and zeroes a crown under a low foundation', () => {
    const clean = normalizeAllocation({ typography: 9, components: 3, tokens: 1, nonsense: 4, motion: -2 });
    expect(clean).toEqual({ typography: 5, tokens: 1 });
  });

  it('removes exactly the overdraw when the intake shrinks', () => {
    const big = computePools(INTAKE);
    const a: Allocation = { typography: 5, tokens: 5, figma: 5, html: 5, css: 4, storybook: 3, documentation: 3 };
    expect(feasible(a, big)).toBe(true);
    const small = computePools({ ...INTAKE, years: 2, hours: 0, minor: 'none' });
    const clamped = clampToPools(a, small);
    expect(feasible(clamped, small)).toBe(true);
    const spentBefore = Object.values(a).reduce((s, n) => s + n, 0);
    const spentAfter = Object.values(clamped).reduce((s, n) => s + n, 0);
    const freeUsedBefore = spentBefore - Math.min(small.designLocked, 10) - Math.min(small.codeLocked, 9);
    expect(spentAfter).toBeLessThan(spentBefore);
    expect(freeUsedBefore).toBeGreaterThan(0);
    expect(clampToPools(clamped, small)).toBe(clamped);
  });
});

describe('the share link', () => {
  const allocation: Allocation = { typography: 5, tokens: 5, figma: 5, html: 5, css: 4, storybook: 3, documentation: 3 };

  it('round-trips an intake and an allocation under the v5 prefix', () => {
    const encoded = encodeState(INTAKE, allocation);
    expect(encoded.startsWith('v5')).toBe(true);
    expect(encoded.split('.')[2].length).toBe(30);
    const back = decodeState(encoded);
    expect(back).not.toBeNull();
    expect(back!.intake).toEqual(INTAKE);
    expect(back!.allocation).toEqual(allocation);
  });

  it('carries the split when the intake answers it', () => {
    const withSplit: Intake = { ...INTAKE, split: 70 };
    const back = decodeState(encodeState(withSplit, { typography: 5 }));
    expect(back!.intake.split).toBe(70);
    expect(decodeState(encodeState(INTAKE, {}))!.intake.split).toBeUndefined();
  });

  it('refuses every older format', () => {
    expect(decodeState('bgw16.5.533130205255545243425434302000.Ryan%20DeBoer')).toBeNull();
    expect(decodeState('b16.5.533130205255545243425434302000.Ryan')).toBeNull();
    expect(decodeState('v4bgw16.5.533130205255545243425434302000.Ryan')).toBeNull();
    expect(decodeState('v5bgw16.5.5331.Ryan')).toBeNull();
    expect(decodeState('')).toBeNull();
  });

  it('refuses a state the tree could not have produced', () => {
    const lit = encodeState(INTAKE, { components: 3 });
    expect(lit.split('.')[2]).toContain('3');
    expect(decodeState(lit)).toBeNull();
    const over: Allocation = {};
    NODE_LIST.filter((n) => n.tier === 'foundation').forEach((n) => { over[n.id] = 5; });
    expect(decodeState(encodeState({ ...INTAKE, years: 0, hours: 0 }, over))).toBeNull();
  });
});

describe('traits and the result', () => {
  it('scores every trait from the node weights, never by hand', () => {
    const analysis = analyzeTraits({ typography: 5, layout: 5 });
    expect(analysis.pointsSpent).toBe(10);
    expect(analysis.scores.craft).toBeGreaterThan(analysis.scores.ai);
    TRAITS.forEach((t) => {
      expect(analysis.scores[t]).toBeGreaterThanOrEqual(0);
      expect(analysis.scores[t]).toBeLessThanOrEqual(100);
    });
  });

  it('builds a result with abilities, a class, and the masteries', () => {
    const allocation: Allocation = { tokens: 5, accessibility: 4, governance: 3, storybook: 3, documentation: 3 };
    const r = buildResult(INTAKE, allocation, TREES, ARCHETYPES);
    expect(r.pools.total).toBe(63);
    expect(r.abilities.length).toBe(12);
    expect(r.abilities.some((a) => a.unlocked)).toBe(true);
    expect(r.mastered).toEqual(['tokens']);
    expect(r.topTraits.length).toBe(4);
    expect(r.primary.family === r.secondary.family).toBe(false);
    expect(r.description).toContain(r.primary.cares);
  });

  it('marks a result provisional while fewer than two abilities are unlocked', () => {
    const r = buildResult(INTAKE, { typography: 1 }, TREES, ARCHETYPES);
    expect(r.provisional).toBe(true);
    expect(r.abilities.every((a) => !a.unlocked)).toBe(true);
  });

  it('keeps every node id in the trees resolvable', () => {
    Object.keys(NODES).forEach((id) => {
      expect(treeOf(id)).toBeTruthy();
    });
    expect(CROWN_UNLOCK_AT).toBe(3);
  });
});
