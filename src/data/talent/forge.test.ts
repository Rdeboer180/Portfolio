// The Ability Forge: the twelve recipes, the class picker, and the receipt.
// Run: CI=true npx vitest run --globals src/data/talent/forge.test.ts

import { ARCHETYPES } from './archetypes';
import { ABILITIES, FAMILY_ORDER, abilityReceiptLine, evaluateAbilities, formulaLine, pickClass } from './forge';
import { NODES, crownOf, foundationOf } from './trees';
import type { Ability, Allocation } from './types';

/** The cheapest allocation that satisfies a recipe, foundations included. */
function satisfy(ability: Ability): Allocation {
  const out: Allocation = {};
  ability.formula.forEach((step) => {
    out[step.nodeId] = Math.max(out[step.nodeId] || 0, step.min);
    const foundation = foundationOf(step.nodeId);
    if (foundation) out[foundation.id] = Math.max(out[foundation.id] || 0, 3);
  });
  return out;
}

describe('the recipes', () => {
  it('is twelve abilities, each pointing at an archetype that exists', () => {
    expect(ABILITIES.length).toBe(12);
    ABILITIES.forEach((a) => {
      expect(ARCHETYPES.some((x) => x.id === a.archetypeId)).toBe(true);
      expect(FAMILY_ORDER).toContain(a.family);
      expect(a.formula.length).toBeGreaterThanOrEqual(3);
      expect(`${a.name} ${a.line || ''}`).not.toContain('—');
    });
    const ids = ABILITIES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names the three renamed abilities against the right archetypes', () => {
    const by = (id: string) => ABILITIES.find((a) => a.id === id)!;
    expect(by('lossless-handoff').archetypeId).toBe('front-end-translator');
    expect(by('system-memory').archetypeId).toBe('context-carrier');
    expect(by('cross-platform-builder').archetypeId).toBe('component-crafter');
  });

  it('reads only nodes that exist, at reachable minimums', () => {
    ABILITIES.forEach((a) => {
      a.formula.forEach((step) => {
        expect(NODES[step.nodeId]).toBeTruthy();
        expect(step.min).toBeGreaterThan(0);
        expect(step.min).toBeLessThanOrEqual(5);
        // A crown at a minimum is only reachable while its foundation holds 3.
        if (crownOf(step.nodeId)) expect(step.min).toBeLessThanOrEqual(5);
      });
    });
  });

  it('every recipe is unlockable, and one point short is not', () => {
    ABILITIES.forEach((a) => {
      const states = evaluateAbilities(satisfy(a));
      const mine = states.find((s) => s.ability.id === a.id)!;
      expect(mine.unlocked).toBe(true);
      expect(mine.missing).toBe(0);

      const short = satisfy(a);
      const step = a.formula[a.formula.length - 1];
      short[step.nodeId] = step.min - 1;
      const shortState = evaluateAbilities(short).find((s) => s.ability.id === a.id)!;
      expect(shortState.unlocked).toBe(false);
      expect(shortState.missing).toBeGreaterThanOrEqual(1);
    });
  });

  it('counts strength as the overshoot and missing as the points away', () => {
    const a = ABILITIES.find((x) => x.id === 'systemsmith')!;
    const state = evaluateAbilities({ ...satisfy(a), tokens: 5, components: 5 })
      .find((s) => s.ability.id === 'systemsmith')!;
    expect(state.strength).toBe(2);
    const none = evaluateAbilities({}).find((s) => s.ability.id === 'systemsmith')!;
    expect(none.missing).toBe(4 + 4 + 3);
    expect(none.strength).toBe(0);
  });

  it('prints the recipe and the receipt the console shows', () => {
    expect(formulaLine(ABILITIES[0])).toBe('Tokens 4 · Accessibility 4 · Governance 3 · Documentation 3');
    const states = evaluateAbilities(satisfy(ABILITIES[0]));
    expect(abilityReceiptLine(states)).toContain('unlocked of 12');
    expect(abilityReceiptLine(evaluateAbilities({}))).toContain('0 unlocked of 12');
  });
});

describe('sorting and the class', () => {
  it('sorts unlocked first, then by strength, then by family order', () => {
    const states = evaluateAbilities({ tokens: 5, accessibility: 5, governance: 3, storybook: 3, documentation: 3 });
    const firstLocked = states.findIndex((s) => !s.unlocked);
    expect(states.slice(0, firstLocked).every((s) => s.unlocked)).toBe(true);
    for (let i = 1; i < firstLocked; i += 1) {
      expect(states[i - 1].strength).toBeGreaterThanOrEqual(states[i].strength);
    }
  });

  it('picks two unlocked abilities from different families', () => {
    const allocation: Allocation = {
      ...satisfy(ABILITIES.find((a) => a.id === 'guardrail-architect')!),
      ...satisfy(ABILITIES.find((a) => a.id === 'systemsmith')!),
      ...satisfy(ABILITIES.find((a) => a.id === 'sensemaker')!),
    };
    const picked = pickClass(evaluateAbilities(allocation));
    expect(picked.primary.unlocked).toBe(true);
    expect(picked.secondary.unlocked).toBe(true);
    expect(picked.primary.ability.family).not.toBe(picked.secondary.ability.family);
    expect(picked.provisional).toBe(false);
  });

  it('fills from the nearest and marks the pair provisional when fewer than two unlock', () => {
    const one = satisfy(ABILITIES.find((a) => a.id === 'system-memory')!);
    const picked = pickClass(evaluateAbilities(one));
    expect(picked.primary.ability.id).toBe('system-memory');
    expect(picked.secondary.unlocked).toBe(false);
    expect(picked.provisional).toBe(true);

    const empty = pickClass(evaluateAbilities({}));
    expect(empty.provisional).toBe(true);
    expect(empty.primary.ability.family).not.toBe(empty.secondary.ability.family);
  });
});

describe('the shapes the forge is meant to read', () => {
  it('a researcher lands Sensemaker', () => {
    const researcher: Allocation = {
      research: 5, 'information-architecture': 4, cms: 3, 'qa-and-analytics': 3, handoff: 3, documentation: 2, storybook: 3,
    };
    const picked = pickClass(evaluateAbilities(researcher));
    const names = [picked.primary.ability.id, picked.secondary.ability.id];
    expect(names).toContain('sensemaker');
  });

  it('a front-end person lands Shipwright or Cross-platform Builder', () => {
    const frontEnd: Allocation = {
      html: 5, css: 4, git: 4, automation: 3, javascript: 5, typescript: 4,
      react: 5, 'react-native': 4, 'production-ownership': 4, performance: 3, tokens: 3,
    };
    const picked = pickClass(evaluateAbilities(frontEnd));
    const ids = [picked.primary.ability.id, picked.secondary.ability.id];
    expect(ids.some((id) => id === 'shipwright' || id === 'cross-platform-builder')).toBe(true);
    expect(picked.provisional).toBe(false);
  });
});
