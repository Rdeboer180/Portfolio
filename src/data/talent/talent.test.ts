// Talent tree data and scoring invariants.
// Run: CI=true npx vitest run --globals src/data/talent/talent.test.ts
//
// The archetype pool (./archetypes) is authored separately against the shared
// Archetype interface; the pairing assertions here run against the real pool.

import type { Allocation, Archetype, HoursBand, Intake, Trait, TreeId } from './types';
import { TRAITS } from './types';
import { AREAS, NODES, NODE_LIST, TREES, crownOf, foundationOf, nodeById, treeOf } from './trees';
import { GLYPHS } from './glyphs';
import {
  CORE_NOTE,
  DEGREE_OPTIONS,
  HOURS_NOTE,
  HOURS_OPTIONS,
  MAJOR_OPTIONS,
  MINOR_OPTIONS,
  OTHER_FIELD_NOTE,
  SPLIT_NOTE,
  SPLIT_OPTIONS,
  SPLIT_STEP,
  YEARS_NOTE,
  canSpend,
  clampToPools,
  computePools,
  degreePoints,
  degreeTakesMajor,
  feasible,
  isLocked,
  minorPoints,
  poolsSpent,
  remaining,
  sanitizeSplit,
  spend,
  splitOf,
  splitOption,
  treeSpend,
  withinPools,
  yearsPoints,
  yearsSplit,
} from './economy';
import { RYAN_ALLOCATION, RYAN_INTAKE, RYAN_OVERRIDES } from './ryan';
import { ARCHETYPES } from './archetypes';
import { analyzeTraits, buildResult, decodeState, describe as describePair, encodeState, pickArchetypes, scoreTraits, topTraits } from './score';

// ── The brief, verbatim ─────────────────────────────────────────────────────

const BRIEF_TREES: { name: string; root: string; areas: [string, string, string][] }[] = [
  {
    name: 'Craft',
    root: 'Visual craft',
    areas: [
      ['Visual craft', 'Typography and hierarchy', 'Composition, brand, and polish'],
      ['Interaction design', 'States and behavior', 'Motion and micro-interaction systems'],
      ['Product thinking', 'Problem framing', 'Flows, edge cases, and decisions'],
      ['Research', 'Discovery and synthesis', 'Evidence and measurement'],
      ['Prototyping', 'High-fidelity in Figma', 'Coded prototypes that ship'],
    ],
  },
  {
    name: 'Systems and build',
    root: 'Build',
    areas: [
      ['Design systems', 'Tokens and variables', 'Components, Storybook, and scaling'],
      ['Governance', 'Standards, accessibility, and QA', 'Exceptions, contribution, and agent-readable rules'],
      ['Design-to-code translation', 'HTML, CSS, and state definition', 'Production ownership'],
      ['AI and agentic workflows', 'AI-assisted exploration', 'Systems that direct agents'],
      ['Systems thinking', 'Information architecture', 'Patterns that hold across surfaces'],
    ],
  },
  {
    name: 'Core',
    root: 'Judgment',
    areas: [
      ['Collaboration', 'Working across disciplines', 'Critique and consensus'],
      ['Communication', 'Writing and presenting', 'Context that survives the room'],
      ['Leadership', 'Mentoring', 'Direction and advocacy'],
      ['Problem solving', 'Reframing', 'Deciding under constraint'],
      ['Strategy', 'User, business, and technical constraints', 'North star and direction'],
    ],
  },
];

const RYAN_MASTERED_NAMES = [
  'Typography and hierarchy',
  'High-fidelity in Figma',
  'Tokens and variables',
  'Components, Storybook, and scaling',
  'Standards, accessibility, and QA',
  'HTML, CSS, and state definition',
  'Writing and presenting',
];

const idOf = (name: string): string => {
  const node = NODE_LIST.find((n) => n.name === name);
  if (!node) throw new Error(`no node named "${name}"`);
  return node.id;
};

const treeNodes = (id: TreeId) => TREES.find((t) => t.id === id)!.areas.reduce<typeof NODE_LIST>((acc, a) => acc.concat(a.nodes), []);

const EM_DASH = '—';
const CONTRACTION = /\b\w+'(t|s|re|ll|ve|d|m)\b/i;

// ── Trees ───────────────────────────────────────────────────────────────────

describe('trees', () => {
  it('has three trees, fifteen areas, and thirty nodes named exactly as the brief', () => {
    expect(TREES.map((t) => t.name)).toEqual(BRIEF_TREES.map((t) => t.name));
    expect(TREES.map((t) => t.root.name)).toEqual(BRIEF_TREES.map((t) => t.root));
    expect(AREAS).toHaveLength(15);
    expect(NODE_LIST).toHaveLength(30);
    TREES.forEach((tree, ti) => {
      expect(tree.areas.map((a) => a.name)).toEqual(BRIEF_TREES[ti].areas.map((a) => a[0]));
      tree.areas.forEach((area, ai) => {
        const [, foundation, crown] = BRIEF_TREES[ti].areas[ai];
        expect(area.nodes[0].name).toBe(foundation);
        expect(area.nodes[1].name).toBe(crown);
        expect(area.nodes[0].tier).toBe('foundation');
        expect(area.nodes[1].tier).toBe('crown');
        expect(area.treeId).toBe(tree.id);
        area.nodes.forEach((n) => expect(n.areaId).toBe(area.id));
      });
    });
  });

  it('pools: craft points cover the Craft and Systems trees, core points cover Core', () => {
    expect(TREES.map((t) => t.pool)).toEqual(['craft', 'craft', 'core']);
  });

  it('node ids are unique, kebab-case, and resolvable', () => {
    const ids = NODE_LIST.map((n) => n.id);
    expect(new Set(ids).size).toBe(30);
    ids.forEach((id) => {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(nodeById(id)).toBe(NODES[id]);
      expect(treeOf(id)).toBeDefined();
    });
    expect(nodeById('nope')).toBeUndefined();
    expect(treeOf('nope')).toBeUndefined();
  });

  it('every node weighs its traits to 1 ± 0.02, each weight in 0..1, none sprinkled below 0.05', () => {
    NODE_LIST.forEach((n) => {
      const entries = Object.keys(n.weights) as Trait[];
      const sum = entries.reduce((s, t) => s + (n.weights[t] || 0), 0);
      expect(Math.abs(sum - 1)).toBeLessThanOrEqual(0.02);
      entries.forEach((t) => {
        expect(TRAITS).toContain(t);
        const w = n.weights[t] || 0;
        expect(w).toBeGreaterThanOrEqual(0.05);
        expect(w).toBeLessThanOrEqual(1);
      });
    });
  });

  it('every trait is reachable: some node leans on it', () => {
    TRAITS.forEach((t) => {
      const lead = NODE_LIST.filter((n) => (n.weights[t] || 0) >= 0.35);
      expect(lead.length).toBeGreaterThan(0);
    });
    const lean = (name: string, t: Trait) => NODES[idOf(name)].weights[t] || 0;
    expect(lean('Standards, accessibility, and QA', 'systems')).toBeGreaterThan(0.5);
    expect(lean('Standards, accessibility, and QA', 'build')).toBeGreaterThan(0);
    expect(lean('Coded prototypes that ship', 'exploration')).toBeGreaterThan(0.3);
    expect(lean('Coded prototypes that ship', 'build')).toBeGreaterThan(0.3);
    expect(lean('Discovery and synthesis', 'research')).toBeGreaterThan(0.5);
    expect(lean('North star and direction', 'strategy')).toBeGreaterThan(0.5);
    expect(lean('Systems that direct agents', 'ai')).toBeGreaterThan(0.4);
    expect(lean('Systems that direct agents', 'systems')).toBeGreaterThan(0.2);
  });

  it('meanings are one sentence each, with no em dashes and no contractions', () => {
    NODE_LIST.forEach((n) => {
      expect(n.meaning.trim().length).toBeGreaterThan(20);
      expect(n.meaning).not.toContain(EM_DASH);
      expect(n.meaning).not.toMatch(CONTRACTION);
      expect(n.meaning.trim().endsWith('.')).toBe(true);
      expect(n.meaning.trim().split(/[.!?](\s|$)/).filter((s) => s.trim().length > 0)).toHaveLength(1);
    });
  });

  // The masteries drawer prints masteryLine, so every node needs one and it has
  // to fit a 35px row: one sentence, sentence case, 10 to 16 words, no em dash.
  it('every node carries a mastery line: one sentence, under 17 words, no em dash', () => {
    NODE_LIST.forEach((n) => {
      expect(typeof n.masteryLine).toBe('string');
      expect(n.masteryLine.trim().length).toBeGreaterThan(20);
      expect(n.masteryLine).not.toContain(EM_DASH);
      expect(n.masteryLine).not.toContain('\u2013');
      expect(n.masteryLine.trim().endsWith('.')).toBe(true);
      expect(n.masteryLine.trim().split(/[.!?](\s|$)/).filter((s) => s.trim().length > 0)).toHaveLength(1);
      const words = n.masteryLine.trim().split(/\s+/);
      expect(words.length).toBeLessThan(17);
      expect(words.length).toBeGreaterThan(8);
      // Sentence case: only the first word may be capitalised without a reason.
      expect(n.masteryLine).not.toMatch(/^[a-z]/);
      // Distinct from the hover meaning, and never a duplicate of another node's.
      expect(n.masteryLine).not.toBe(n.meaning);
    });
    const all = NODE_LIST.map((n) => n.masteryLine);
    expect(new Set(all).size).toBe(all.length);
  });

  // The seven Ryan has mastered are the front-door artboard's lines, verbatim.
  it('the seven mastered nodes carry the artboard lines verbatim', () => {
    const expected: Record<string, string> = {
      'typography-and-hierarchy': 'Type does the structural work, so a screen reads in order before color lands.',
      'high-fidelity-in-figma': 'Prototypes real enough that a stakeholder forgets it is not the product.',
      'tokens-and-variables': 'Decisions named as variables, so a change made once lands everywhere.',
      'components-storybook-and-scaling': 'Parts with contracts, documented where engineers work, tested across surfaces.',
      'standards-accessibility-and-qa': 'Rules that hold when I am not in the room, from contrast to release checks.',
      'html-css-and-state-definition': "The design in the browser's own language, every state and breakpoint defined.",
      'writing-and-presenting': 'Reasoning that travels as far as the screens do, in writing and in the room.',
    };
    Object.keys(expected).forEach((id) => {
      expect(NODES[id].masteryLine).toBe(expected[id]);
    });
  });

  it('every glyph key resolves: 30 nodes, 3 roots, and the branch mark', () => {
    NODE_LIST.forEach((n) => expect(GLYPHS[n.glyph]).toBeTruthy());
    TREES.forEach((t) => expect(GLYPHS[t.root.glyph]).toBeTruthy());
    expect(GLYPHS.branch).toBeTruthy();
    expect(Object.keys(GLYPHS)).toHaveLength(34);
    Object.keys(GLYPHS).forEach((k) => {
      const markup = GLYPHS[k];
      // Inner markup only: the renderer supplies the svg element, size, and stroke.
      expect(markup).not.toMatch(/<svg|stroke=|stroke-width|style=/);
      expect(markup).toMatch(/^<(path|rect|circle|ellipse)/);
      expect(k === 'branch' || !markup.includes('fill=')).toBe(true);
    });
  });

  it('foundation and crown helpers agree with the area layout', () => {
    AREAS.forEach((a) => {
      expect(crownOf(a.nodes[0].id)).toBe(a.nodes[1]);
      expect(foundationOf(a.nodes[1].id)).toBe(a.nodes[0]);
      expect(crownOf(a.nodes[1].id)).toBeUndefined();
      expect(foundationOf(a.nodes[0].id)).toBeUndefined();
    });
  });
});

// ── Economy ─────────────────────────────────────────────────────────────────

/** An intake with the degree rule's fields defaulted, for the short cases below. */
const intake = (partial: Partial<Intake>): Intake => ({
  name: '',
  degree: 'none',
  major: 'other',
  minor: 'none',
  years: 0,
  hours: 0,
  ...partial,
});

describe('economy', () => {
  it('computes Ryan: 63 craft = 16 craft-locked + 4 systems-locked + 43 free, 21 core, level 16', () => {
    const pools = computePools(RYAN_INTAKE);
    expect(pools.craft).toBe(63);
    expect(pools.craftLocked).toBe(16);
    expect(pools.systemsLocked).toBe(4);
    expect(pools.free).toBe(43);
    expect(pools.craft).toBe(pools.craftLocked + pools.systemsLocked + pools.free);
    expect(pools.core).toBe(21);
    expect(pools.level).toBe(16);
    expect(pools.receipt.map((r) => r.points)).toEqual([16, 4, 38, 5, 21]);
    expect(pools.receipt.map((r) => r.label)).toEqual([
      "+16 · Bachelor's, graphic design",
      '+4 · Minor, web',
      '+38 · 16 years',
      '+5 · 200+ hours',
      '+21 · Core, 16 years',
    ]);
    expect(pools.receipt.map((r) => r.pool)).toEqual(['craft', 'craft', 'craft', 'craft', 'core']);
    expect(pools.receipt.map((r) => r.lockedTo)).toEqual(['craft', 'systems', undefined, undefined, undefined]);
    expect(pools.receipt[0].note).toBe('4 per year of degree, four years, locked to the Craft tree');
    expect(pools.receipt[1].note).toBe('A quarter of the degree, locked to the Systems and build tree');
    expect(pools.receipt.reduce((sum, r) => sum + (r.pool === 'craft' ? r.points : 0), 0)).toBe(63);
  });

  it('locks the degree to the tree its major names', () => {
    const graphic = computePools(intake({ degree: 'bachelors', major: 'graphic', years: 4, hours: 0 }));
    expect(graphic).toMatchObject({ craft: 30, craftLocked: 16, systemsLocked: 0, free: 14 });
    const web = computePools(intake({ degree: 'bachelors', major: 'web', years: 4, hours: 0 }));
    expect(web).toMatchObject({ craft: 30, craftLocked: 0, systemsLocked: 16, free: 14 });
    expect(web.receipt[0]).toMatchObject({
      points: 16,
      label: "+16 · Bachelor's, web",
      note: '4 per year of degree, four years, locked to the Systems and build tree',
      lockedTo: 'systems',
    });
    const masters = computePools(intake({ degree: 'masters', major: 'web', minor: 'graphic', years: 0, hours: 0 }));
    expect(masters).toMatchObject({ craft: 30, craftLocked: 6, systemsLocked: 24, free: 0 });
    const associate = computePools(intake({ degree: 'associate', major: 'graphic', minor: 'web', years: 0, hours: 0 }));
    expect(associate).toMatchObject({ craft: 10, craftLocked: 8, systemsLocked: 2, free: 0 });
  });

  it('adds the minor on top rather than splitting the degree: a quarter, locked to its tree', () => {
    const without = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'none' }));
    const withMinor = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'web' }));
    expect(without).toMatchObject({ craft: 16, craftLocked: 16, systemsLocked: 0, free: 0 });
    expect(withMinor).toMatchObject({ craft: 20, craftLocked: 16, systemsLocked: 4, free: 0 });
    expect(withMinor.receipt).toHaveLength(without.receipt.length + 1);
    expect(withMinor.receipt[1]).toMatchObject({ points: 4, label: '+4 · Minor, web', lockedTo: 'systems' });
    expect(withMinor.receipt[1].note).toContain('quarter of the degree');
    expect(withMinor.receipt[1].note).toContain('locked to');
  });

  it('gives self-taught 8 free points on either tree, and treats a degree in another field the same', () => {
    const self = computePools(intake({ degree: 'self-taught', major: 'graphic', minor: 'web' }));
    expect(self).toMatchObject({ craft: 8, craftLocked: 0, systemsLocked: 0, free: 8 });
    expect(self.receipt[0]).toMatchObject({ points: 8, label: '+8 · Self-taught', pool: 'craft' });
    expect(self.receipt[0].lockedTo).toBeUndefined();
    expect(self.receipt[0].note).toContain('spend on either tree');
    // The major and minor are ignored without a degree that takes them.
    expect(self.receipt.map((r) => r.label)).toEqual(['+8 · Self-taught', '+0 · 0 years', '+0 · Under 40 hours', '+0 · Core, 0 years']);

    const other = computePools(intake({ degree: 'bachelors', major: 'other' }));
    expect(other).toMatchObject({ craft: 8, craftLocked: 0, systemsLocked: 0, free: 8 });
    expect(other.receipt[0]).toMatchObject({ points: 8, label: "+8 · Bachelor's, other field", note: OTHER_FIELD_NOTE });
    expect(other.receipt[0].lockedTo).toBeUndefined();
    // A minor in a design craft still counts, a quarter of the degree, locked.
    const otherWithMinor = computePools(intake({ degree: 'bachelors', major: 'other', minor: 'graphic' }));
    expect(otherWithMinor).toMatchObject({ craft: 12, craftLocked: 4, systemsLocked: 0, free: 8 });

    const none = computePools(intake({ degree: 'none', major: 'graphic', minor: 'web' }));
    expect(none).toMatchObject({ craft: 0, craftLocked: 0, systemsLocked: 0, free: 0, core: 0, level: 0 });
    expect(none.receipt[0].label).toBe('+0 · No degree');
  });

  it('follows the years, hours, and core rules; years and hours are free', () => {
    expect(computePools(intake({ degree: 'self-taught', years: 1, hours: 1 }))).toMatchObject({ craft: 13, free: 13, core: 2, level: 1 });
    expect(computePools(intake({ degree: 'associate', major: 'graphic', years: 3, hours: 2 }))).toMatchObject({ craft: 22, craftLocked: 8, free: 14, core: 6, level: 3 });
    expect(computePools(intake({ degree: 'bachelors', major: 'web', years: 5, hours: 3 }))).toMatchObject({ craft: 35, systemsLocked: 16, free: 19, core: 10, level: 5 });
    expect(computePools(intake({ degree: 'masters', major: 'graphic', years: 6, hours: 5 }))).toMatchObject({ craft: 47, craftLocked: 24, free: 23, core: 11, level: 6 });
    expect(computePools(intake({ degree: 'bachelors', major: 'graphic', years: -3, hours: 9 as never }))).toMatchObject({ craft: 21, craftLocked: 16, free: 5, core: 0, level: 0 });
    expect(computePools(intake({ years: 1 })).receipt[1].label).toBe('+4 · 1 year');
  });

  it('exposes the intake options: every degree, major, minor, and hours band', () => {
    expect(DEGREE_OPTIONS.map((o) => o.value)).toEqual(['none', 'self-taught', 'associate', 'bachelors', 'masters']);
    expect(DEGREE_OPTIONS.map((o) => o.label)).toEqual(['None', 'Self-taught', 'Associate', "Bachelor's", "Master's"]);
    expect(DEGREE_OPTIONS.map((o) => o.points)).toEqual([0, 8, 8, 16, 24]);
    expect(DEGREE_OPTIONS.map((o) => o.takesMajor)).toEqual([false, false, true, true, true]);
    expect(DEGREE_OPTIONS.filter((o) => o.assumed).map((o) => o.value)).toEqual(['none']);
    expect(degreeTakesMajor('bachelors')).toBe(true);
    expect(degreeTakesMajor('self-taught')).toBe(false);
    expect(MAJOR_OPTIONS.map((o) => o.value)).toEqual(['graphic', 'web', 'other']);
    expect(MAJOR_OPTIONS.map((o) => o.lockedTo)).toEqual(['craft', 'systems', undefined]);
    expect(MINOR_OPTIONS.map((o) => o.value)).toEqual(['none', 'graphic', 'web']);
    expect(MINOR_OPTIONS.map((o) => o.lockedTo)).toEqual([undefined, 'craft', 'systems']);
    expect(HOURS_OPTIONS.map((o) => o.band)).toEqual([0, 1, 2, 3, 4, 5]);
    const notes = [
      YEARS_NOTE, HOURS_NOTE, CORE_NOTE, OTHER_FIELD_NOTE,
      ...DEGREE_OPTIONS.map((o) => o.note),
      ...computePools(RYAN_INTAKE).receipt.map((r) => r.note),
    ];
    notes.forEach((note) => {
      expect(note).not.toContain(EM_DASH);
      expect(note).not.toMatch(CONTRACTION);
    });
    // Labels may carry a possessive ("Bachelor's"); they must not carry an em dash.
    [...DEGREE_OPTIONS, ...MAJOR_OPTIONS, ...MINOR_OPTIONS, ...HOURS_OPTIONS].forEach((o) => {
      expect(o.label).not.toContain(EM_DASH);
      expect(o.short).not.toContain(EM_DASH);
    });
  });

  it('spends Ryan exactly: Craft 24, Systems 39, Core 21, every part of the pools to zero', () => {
    const pools = computePools(RYAN_INTAKE);
    expect(poolsSpent(RYAN_ALLOCATION)).toEqual({ craft: 63, core: 21 });
    expect(treeSpend(RYAN_ALLOCATION)).toEqual({ craft: 24, systems: 39, core: 21 });
    expect(feasible(RYAN_ALLOCATION, pools)).toBe(true);
    expect(withinPools(RYAN_ALLOCATION, pools)).toBe(true);
    expect(remaining(RYAN_ALLOCATION, pools)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 0 });
    NODE_LIST.forEach((n) => expect(canSpend(RYAN_ALLOCATION, n.id, TREES, pools)).toBe(false));
    Object.keys(RYAN_ALLOCATION).forEach((id) => {
      expect(NODES[id]).toBeDefined();
      const p = RYAN_ALLOCATION[id];
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(5);
      expect(p === 0 || !isLocked(RYAN_ALLOCATION, id)).toBe(true);
    });
  });

  it('enforces 0..5, the crown unlock at 3, and the refund when a foundation drops', () => {
    const f = idOf('Tokens and variables');
    const c = idOf('Components, Storybook, and scaling');
    let a: Allocation = {};
    expect(canSpend(a, c)).toBe(false);
    expect(spend(a, c, 1)).toBe(a);
    a = spend(a, f, 3);
    expect(a[f]).toBe(3);
    expect(canSpend(a, c)).toBe(true);
    a = spend(a, c, 2);
    expect(a[c]).toBe(2);
    a = spend(a, c, 9);
    expect(a[c]).toBe(5);
    expect(canSpend(a, c)).toBe(false);
    a = spend(a, f, -1);
    expect(a[f]).toBe(2);
    expect(a[c]).toBe(0);
    expect(spend(a, f, -5)[f]).toBe(0);
    expect(spend(a, 'nope', 1)).toBe(a);
    expect(canSpend(a, 'nope')).toBe(false);
  });

  it('honours the pool budget when pools are supplied', () => {
    const pools = computePools(intake({ years: 1 }));
    expect(pools).toMatchObject({ craft: 4, free: 4, core: 2 });
    const f = idOf('Tokens and variables');
    let a: Allocation = spend({}, f, 4, pools);
    expect(a[f]).toBe(4);
    expect(canSpend(a, f, TREES, pools)).toBe(false);
    expect(spend(a, f, 1, pools)).toBe(a);
    expect(canSpend(a, idOf('Mentoring'), TREES, pools)).toBe(true);
    a = spend(a, idOf('Mentoring'), 2, pools);
    expect(canSpend(a, idOf('Reframing'), TREES, pools)).toBe(false);
    // An addition larger than what is left clamps to what fits; removals always go through.
    expect(spend({}, f, 9, pools)[f]).toBe(4);
    expect(spend(a, f, -2, pools)[f]).toBe(2);
    expect(feasible({ ...a, [idOf('Reframing')]: 1 }, pools)).toBe(false);
  });

  it('keeps a craft-locked point off the Systems tree once free is exhausted', () => {
    // Bachelor's in graphic design, no minor, no years: 16 craft-locked, 0 free.
    const pools = computePools(intake({ degree: 'bachelors', major: 'graphic' }));
    expect(pools).toMatchObject({ craft: 16, craftLocked: 16, systemsLocked: 0, free: 0, core: 0 });
    const typo = idOf('Typography and hierarchy');
    const tokens = idOf('Tokens and variables');
    expect(canSpend({}, tokens, TREES, pools)).toBe(false);
    expect(spend({}, tokens, 1, pools)).toEqual({});
    expect(feasible({ [tokens]: 1 }, pools)).toBe(false);
    expect(canSpend({}, typo, TREES, pools)).toBe(true);
    const a = spend({}, typo, 5, pools);
    expect(a[typo]).toBe(5);
    expect(remaining(a, pools)).toEqual({ craftLocked: 11, systemsLocked: 0, free: 0, core: 0 });
    expect(canSpend(a, tokens, TREES, pools)).toBe(false);
    // With one free point (self-taught would give 8; here a year gives 4) the Systems tree opens up to that much.
    const withYear = computePools(intake({ degree: 'bachelors', major: 'graphic', years: 1 }));
    expect(withYear).toMatchObject({ craftLocked: 16, free: 4 });
    expect(spend({}, tokens, 5, withYear)[tokens]).toBe(4);
    expect(remaining({ [tokens]: 4 }, withYear)).toEqual({ craftLocked: 16, systemsLocked: 0, free: 0, core: 2 });
    expect(canSpend({ [tokens]: 4 }, typo, TREES, withYear)).toBe(true);
  });

  it('draws a Systems-tree spend from systemsLocked before free', () => {
    // Bachelor's in graphic design with a minor in web, plus one year: 16 / 4 / 4.
    const pools = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 1 }));
    expect(pools).toMatchObject({ craft: 24, craftLocked: 16, systemsLocked: 4, free: 4, core: 2 });
    const tokens = idOf('Tokens and variables');
    const standards = idOf('Standards, accessibility, and QA');
    let a: Allocation = spend({}, tokens, 3, pools);
    expect(remaining(a, pools)).toEqual({ craftLocked: 16, systemsLocked: 1, free: 4, core: 2 });
    a = spend(a, standards, 3, pools);
    expect(treeSpend(a).systems).toBe(6);
    expect(remaining(a, pools)).toEqual({ craftLocked: 16, systemsLocked: 0, free: 2, core: 2 });
    a = spend(a, standards, 5, pools);
    expect(a[standards]).toBe(5);
    expect(remaining(a, pools)).toEqual({ craftLocked: 16, systemsLocked: 0, free: 0, core: 2 });
    expect(canSpend(a, tokens, TREES, pools)).toBe(false);
    // The Craft tree still has its locked 16 to spend; the Core tree its 2.
    expect(canSpend(a, idOf('Typography and hierarchy'), TREES, pools)).toBe(true);
    expect(canSpend(a, idOf('Mentoring'), TREES, pools)).toBe(true);
    expect(spend(a, idOf('Mentoring'), 5, pools)[idOf('Mentoring')]).toBe(2);
    // Core never spills into the craft pool or back.
    expect(feasible({ [idOf('Mentoring')]: 3 }, pools)).toBe(false);
  });

  it('self-taught points go on either tree', () => {
    const pools = computePools(intake({ degree: 'self-taught' }));
    expect(pools).toMatchObject({ craft: 8, craftLocked: 0, systemsLocked: 0, free: 8 });
    const a = spend(spend({}, idOf('Typography and hierarchy'), 4, pools), idOf('Tokens and variables'), 4, pools);
    expect(treeSpend(a)).toEqual({ craft: 4, systems: 4, core: 0 });
    expect(remaining(a, pools)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 0 });
    expect(feasible(a, pools)).toBe(true);
    expect(canSpend(a, idOf('High-fidelity in Figma'), TREES, pools)).toBe(false);
  });

  it('degreePoints without a major is the degree\'s own value; only an explicit other-field major drops it to 8', () => {
    // The one-argument call is what an intake control prints beside each degree before a major is chosen.
    expect(degreePoints('none')).toBe(0);
    expect(degreePoints('self-taught')).toBe(8);
    expect(degreePoints('associate')).toBe(8);
    expect(degreePoints('bachelors')).toBe(16);
    expect(degreePoints('masters')).toBe(24);
    expect(degreePoints('bachelors', 'graphic')).toBe(16);
    expect(degreePoints('bachelors', 'web')).toBe(16);
    expect(degreePoints('bachelors', 'other')).toBe(8);
    expect(degreePoints('masters', 'other')).toBe(8);
    // Self-taught and none ignore the major either way.
    expect(degreePoints('self-taught', 'graphic')).toBe(8);
    expect(degreePoints('none', 'web')).toBe(0);
    // And the one-argument value is the option's own points, so a control can print either.
    DEGREE_OPTIONS.forEach((o) => expect(degreePoints(o.value)).toBe(o.points));
  });

  it('a minor is exactly a quarter: associate 2, bachelor\'s 4, master\'s 6, and nothing without a degree', () => {
    expect(minorPoints('associate', 'web')).toBe(2);
    expect(minorPoints('bachelors', 'web')).toBe(4);
    expect(minorPoints('masters', 'graphic')).toBe(6);
    expect(minorPoints('bachelors', 'none')).toBe(0);
    expect(minorPoints('self-taught', 'web')).toBe(0);
    expect(minorPoints('none', 'graphic')).toBe(0);
    // A minor in the same craft as the major stacks on the same lock.
    expect(computePools(intake({ degree: 'masters', major: 'graphic', minor: 'graphic' }))).toMatchObject({ craft: 30, craftLocked: 30, systemsLocked: 0, free: 0 });
    expect(computePools(intake({ degree: 'associate', major: 'web', minor: 'web' }))).toMatchObject({ craft: 10, craftLocked: 0, systemsLocked: 10, free: 0 });
  });

  it('the craft pool is always its three parts, and the receipt always adds up, for every intake', () => {
    DEGREE_OPTIONS.forEach((d) => {
      MAJOR_OPTIONS.forEach((mj) => {
        MINOR_OPTIONS.forEach((mn) => {
          [0, 1, 3, 4, 16, 40].forEach((years) => {
            HOURS_OPTIONS.forEach((h) => {
              const p = computePools(intake({ degree: d.value, major: mj.value, minor: mn.value, years, hours: h.band }));
              expect(p.craft).toBe(p.craftLocked + p.systemsLocked + p.free);
              expect(p.craftLocked).toBeGreaterThanOrEqual(0);
              expect(p.systemsLocked).toBeGreaterThanOrEqual(0);
              expect(p.free).toBeGreaterThanOrEqual(0);
              const sum = (pick: (r: (typeof p.receipt)[number]) => boolean) =>
                p.receipt.filter(pick).reduce((s, r) => s + r.points, 0);
              expect(sum((r) => r.pool === 'craft')).toBe(p.craft);
              expect(sum((r) => r.pool === 'core')).toBe(p.core);
              expect(sum((r) => r.lockedTo === 'craft')).toBe(p.craftLocked);
              expect(sum((r) => r.lockedTo === 'systems')).toBe(p.systemsLocked);
              expect(sum((r) => r.pool === 'craft' && !r.lockedTo)).toBe(p.free);
              // Locked parts never exceed what a tree can hold, even with every crown gated.
              expect(p.craftLocked).toBeLessThanOrEqual(30);
              expect(p.systemsLocked).toBeLessThanOrEqual(30);
            });
          });
        });
      });
    });
  });

  it('treats an intake that predates the major and minor fields as a degree in another field', () => {
    // A persisted intake from before the rule has no major or minor. It must not throw, and it
    // must not lock anything: the fallback is the other-field reading, 8 free.
    const legacy = { name: 'x', degree: 'bachelors', years: 4, hours: 1 } as unknown as Intake;
    const pools = computePools(legacy);
    expect(pools).toMatchObject({ craft: 23, craftLocked: 0, systemsLocked: 0, free: 23, core: 8 });
    expect(pools.receipt[0].label).toBe("+8 · Bachelor's, other field");
    expect(encodeState(legacy, {})).toMatch(/^bon4\.1\./);
  });

  it('the crown refund hands the points back to the part they came from', () => {
    // 16 craft-locked, 4 systems-locked, 4 free, core 2.
    const pools = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 1 }));
    const tokens = idOf('Tokens and variables');
    const components = idOf('Components, Storybook, and scaling');
    let a: Allocation = spend({}, tokens, 3, pools);
    a = spend(a, components, 5, pools);
    expect(treeSpend(a).systems).toBe(8);
    expect(remaining(a, pools)).toEqual({ craftLocked: 16, systemsLocked: 0, free: 0, core: 2 });
    expect(canSpend(a, idOf('Standards, accessibility, and QA'), TREES, pools)).toBe(false);
    // Dropping the foundation to 2 refunds the crown's 5: 1 back to systems-locked, 4 back to free.
    a = spend(a, tokens, -1, pools);
    expect(a[components]).toBe(0);
    expect(feasible(a, pools)).toBe(true);
    expect(remaining(a, pools)).toEqual({ craftLocked: 16, systemsLocked: 2, free: 4, core: 2 });
    expect(canSpend(a, idOf('Standards, accessibility, and QA'), TREES, pools)).toBe(true);
    // The refunded free points can go to the Craft tree now, on top of its locked 16.
    const typo = idOf('Typography and hierarchy');
    const b = spend(spend(spend(spend(a, typo, 5, pools), idOf('Composition, brand, and polish'), 5, pools), idOf('High-fidelity in Figma'), 5, pools), idOf('Coded prototypes that ship'), 5, pools);
    expect(treeSpend(b).craft).toBe(20);
    expect(remaining(b, pools)).toEqual({ craftLocked: 0, systemsLocked: 2, free: 0, core: 2 });
  });

  it('never strands a locked point: a random walk of adds and removes stays feasible and spendable', () => {
    // A small deterministic PRNG so a failure is reproducible.
    const prng = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const spendable = (a: Allocation, pools: ReturnType<typeof computePools>, tree: TreeId) =>
      treeNodes(tree).some((n) => canSpend(a, n.id, TREES, pools));
    const intakes: Intake[] = [
      intake({ degree: 'masters', major: 'graphic', minor: 'graphic' }), // 30 craft-locked, 0 free
      intake({ degree: 'masters', major: 'web', minor: 'web' }), // 30 systems-locked, 0 free
      intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 1, hours: 1 }), // 16 / 4 / 5
      intake({ degree: 'associate', major: 'web', minor: 'graphic', years: 3 }), // 2 / 8 / 12
      RYAN_INTAKE, // 16 / 4 / 43
    ];
    intakes.forEach((it, i) => {
      const pools = computePools(it);
      const rand = prng(17 + i);
      let a: Allocation = {};
      for (let step = 0; step < 400; step++) {
        const node = NODE_LIST[Math.floor(rand() * NODE_LIST.length)];
        const delta = rand() < 0.65 ? 1 : -1;
        const next = spend(a, node.id, delta, pools);
        // canSpend and spend agree on every addition.
        expect(delta < 0 || canSpend(a, node.id, TREES, pools) === (next !== a)).toBe(true);
        a = next;
        expect(feasible(a, pools)).toBe(true);
        expect(clampToPools(a, pools)).toBe(a);
        // Whatever is left in a part, some node in the tree it pays for can take a point.
        const left = remaining(a, pools);
        expect(left.craftLocked === 0 || spendable(a, pools, 'craft')).toBe(true);
        expect(left.systemsLocked === 0 || spendable(a, pools, 'systems')).toBe(true);
        expect(left.core === 0 || spendable(a, pools, 'core')).toBe(true);
        expect(left.free === 0 || spendable(a, pools, 'craft') || spendable(a, pools, 'systems')).toBe(true);
        const spent = treeSpend(a);
        expect(left.craftLocked + left.systemsLocked + left.free).toBe(pools.craft - spent.craft - spent.systems);
      }
    });
  });
});

// ── Editing the intake after points are spent ───────────────────────────────

describe('clampToPools', () => {
  it('returns the input untouched when it already fits', () => {
    const pools = computePools(intake({ degree: 'bachelors', major: 'graphic', years: 2 }));
    const a = spend(spend({}, idOf('Typography and hierarchy'), 5, pools), idOf('Tokens and variables'), 3, pools);
    expect(clampToPools(a, pools)).toBe(a);
    expect(clampToPools(RYAN_ALLOCATION, computePools(RYAN_INTAKE))).toBe(RYAN_ALLOCATION);
  });

  it('after the major flips from graphic to web, moves the Craft tree back inside the free pool', () => {
    const graphic = computePools(intake({ degree: 'bachelors', major: 'graphic' }));
    let a: Allocation = spend({}, idOf('Typography and hierarchy'), 5, graphic);
    a = spend(a, idOf('Composition, brand, and polish'), 5, graphic);
    a = spend(a, idOf('States and behavior'), 5, graphic);
    a = spend(a, idOf('Motion and micro-interaction systems'), 1, graphic);
    expect(treeSpend(a).craft).toBe(16);
    const web = computePools(intake({ degree: 'bachelors', major: 'web' }));
    expect(feasible(a, web)).toBe(false);
    // Overdrawn, the economy refuses every addition, even on the tree that now holds the lock.
    expect(canSpend(a, idOf('Tokens and variables'), TREES, web)).toBe(false);
    expect(spend(a, idOf('Tokens and variables'), 1, web)).toBe(a);
    const clamped = clampToPools(a, web);
    expect(feasible(clamped, web)).toBe(true);
    expect(treeSpend(clamped)).toEqual({ craft: 0, systems: 0, core: 0 });
    expect(canSpend(clamped, idOf('Tokens and variables'), TREES, web)).toBe(true);
    expect(remaining(clamped, web)).toEqual({ craftLocked: 0, systemsLocked: 16, free: 0, core: 0 });
  });

  it('removes exactly the overdraw, crowns first, then foundations, from the tree drawing most from free', () => {
    // 16 craft-locked, 4 systems-locked, 10 free (2 years, 2 hours), core 4.
    const before = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 2, hours: 2 }));
    expect(before).toMatchObject({ craftLocked: 16, systemsLocked: 4, free: 10, core: 4 });
    let a: Allocation = {};
    // Craft tree: 16 locked + 2 free = 18.
    a = spend(a, idOf('Typography and hierarchy'), 5, before);
    a = spend(a, idOf('Composition, brand, and polish'), 5, before);
    a = spend(a, idOf('High-fidelity in Figma'), 5, before);
    a = spend(a, idOf('Coded prototypes that ship'), 3, before);
    // Systems tree: 4 locked + 8 free = 12.
    a = spend(a, idOf('Tokens and variables'), 5, before);
    a = spend(a, idOf('Components, Storybook, and scaling'), 4, before);
    a = spend(a, idOf('Standards, accessibility, and QA'), 3, before);
    expect(treeSpend(a)).toEqual({ craft: 18, systems: 12, core: 0 });
    expect(remaining(a, before)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 4 });

    // Years drop to 0: free falls from 10 to 2, an overdraw of 8.
    const after = computePools(intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 0, hours: 2 }));
    expect(after).toMatchObject({ craftLocked: 16, systemsLocked: 4, free: 2, core: 0 });
    const clamped = clampToPools(a, after);
    expect(feasible(clamped, after)).toBe(true);
    expect(treeSpend(clamped).craft + treeSpend(clamped).systems).toBe(30 - 8);
    // Systems drew 8 from free against Craft's 2: seven come off Systems (Components, a crown,
    // 4 to 0, then Standards 3 to 0), one off Craft (Coded prototypes, a crown, 3 to 2).
    expect(treeSpend(clamped)).toEqual({ craft: 17, systems: 5, core: 0 });
    expect(clamped[idOf('Components, Storybook, and scaling')]).toBeUndefined();
    expect(clamped[idOf('Standards, accessibility, and QA')]).toBeUndefined();
    expect(clamped[idOf('Tokens and variables')]).toBe(5);
    expect(clamped[idOf('Coded prototypes that ship')]).toBe(2);
    expect(clamped[idOf('Typography and hierarchy')]).toBe(5);
    expect(remaining(clamped, after)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 0 });
  });

  it('clamps the Core tree too, and normalizes junk on the way', () => {
    const pools = computePools(intake({ years: 2 }));
    expect(pools).toMatchObject({ free: 8, core: 4 });
    const a: Allocation = {
      [idOf('Mentoring')]: 5,
      [idOf('Direction and advocacy')]: 2,
      [idOf('Reframing')]: 9,
      [idOf('Critique and consensus')]: 3, // a crown over a foundation at 0
      nope: 4,
    };
    const clamped = clampToPools(a, pools);
    expect(feasible(clamped, pools)).toBe(true);
    expect(clamped.nope).toBeUndefined();
    expect(clamped[idOf('Critique and consensus')]).toBeUndefined();
    expect(treeSpend(clamped).core).toBe(4);
    // Crowns first: Direction 2 to 0; then foundations from the end: Reframing 5 to 0, Mentoring 5 to 4.
    expect(clamped[idOf('Direction and advocacy')]).toBeUndefined();
    expect(clamped[idOf('Reframing')]).toBeUndefined();
    expect(clamped[idOf('Mentoring')]).toBe(4);
  });

  it('never leaves a crown lit over a foundation below 3', () => {
    const pools = computePools(intake({ degree: 'self-taught' }));
    const a: Allocation = {
      [idOf('Tokens and variables')]: 5,
      [idOf('Components, Storybook, and scaling')]: 5,
      [idOf('Standards, accessibility, and QA')]: 5,
      [idOf('Exceptions, contribution, and agent-readable rules')]: 5,
    };
    const clamped = clampToPools(a, pools);
    expect(feasible(clamped, pools)).toBe(true);
    expect(treeSpend(clamped).systems).toBe(8);
    expect(clamped).toEqual({ [idOf('Tokens and variables')]: 5, [idOf('Standards, accessibility, and QA')]: 3 });
    Object.keys(clamped).forEach((id) => expect(isLocked(clamped, id)).toBe(false));
    // And the clamped allocation is a state the share link accepts.
    expect(decodeState(encodeState(intake({ degree: 'self-taught' }), clamped))).not.toBeNull();
  });
});

// ── Ryan ────────────────────────────────────────────────────────────────────

describe('ryan', () => {
  it('masters seven nodes: the six the brief names plus Writing and presenting', () => {
    const fives = NODE_LIST.filter((n) => RYAN_ALLOCATION[n.id] === 5).map((n) => n.name);
    expect(fives).toHaveLength(7);
    expect(fives).toEqual(RYAN_MASTERED_NAMES);
  });

  it('scores systems and exploration on top, then craft and build, near 92 / 88 / 82 / 79', () => {
    const traits = scoreTraits(RYAN_ALLOCATION, TREES);
    const top = topTraits(traits);
    expect(top.map((t) => t.trait).slice(0, 2).sort()).toEqual(['exploration', 'systems']);
    expect(top.map((t) => t.trait).sort()).toEqual(['build', 'craft', 'exploration', 'systems']);
    expect(Math.abs(traits.systems - 92)).toBeLessThanOrEqual(8);
    expect(Math.abs(traits.exploration - 88)).toBeLessThanOrEqual(8);
    expect(Math.abs(traits.craft - 82)).toBeLessThanOrEqual(8);
    expect(Math.abs(traits.build - 79)).toBeLessThanOrEqual(8);
    TRAITS.forEach((t) => {
      expect(traits[t]).toBeGreaterThanOrEqual(0);
      expect(traits[t]).toBeLessThanOrEqual(100);
      expect(Number.isInteger(traits[t])).toBe(true);
    });
    (['research', 'strategy', 'collaboration', 'ai'] as Trait[]).forEach((t) => {
      expect(traits[t]).toBeLessThan(traits.build);
    });
  });

  it('pairs Guardrail Architect with Prototype Alchemist against the real archetype pool', () => {
    expect(ARCHETYPES).toHaveLength(64);
    const traits = scoreTraits(RYAN_ALLOCATION, TREES);
    const { primary, secondary } = pickArchetypes(traits, ARCHETYPES);
    expect(primary.id).toBe('guardrail-architect');
    expect(secondary.id).toBe('prototype-alchemist');
    expect(primary.family).not.toBe(secondary.family);
  });

  it('builds a full result with the authored passive and quest', () => {
    const result = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
    expect(result.pools.level).toBe(16);
    expect(result.pools.craft).toBe(63);
    expect(result.pointsSpent).toBe(84);
    expect(result.intake).toEqual(RYAN_INTAKE);
    expect(result.mastered.map((id) => NODES[id].name)).toEqual(RYAN_MASTERED_NAMES);
    expect(result.topTraits).toHaveLength(4);
    expect(result.topTraits[0].score).toBeGreaterThanOrEqual(result.topTraits[3].score);
    expect(result.passive).toBe(RYAN_OVERRIDES.passive);
    expect(result.quest).toBe(RYAN_OVERRIDES.quest);
    expect(result.description).toBe(describePair(result.primary, result.secondary));
    expect(result.description).toMatch(/^.+ You care about .+, but you're happiest .+\.$/);
  });
});

// ── Scoring shape ───────────────────────────────────────────────────────────

/** Foundations at 3, crowns at 2, everywhere: no lead trait to speak of. */
const SCATTERED: Allocation = NODE_LIST.reduce<Allocation>((acc, n) => {
  acc[n.id] = n.tier === 'foundation' ? 3 : 2;
  return acc;
}, {});

const RESEARCH_HEAVY: Allocation = {
  'discovery-and-synthesis': 5,
  'evidence-and-measurement': 5,
  'problem-framing': 5,
  'flows-edge-cases-and-decisions': 3,
  'information-architecture': 4,
  'typography-and-hierarchy': 3,
  'high-fidelity-in-figma': 3,
  'writing-and-presenting': 4,
  reframing: 3,
  'user-business-and-technical-constraints': 4,
  'north-star-and-direction': 3,
  'working-across-disciplines': 3,
};

const VISUAL_HEAVY: Allocation = {
  'typography-and-hierarchy': 5,
  'composition-brand-and-polish': 5,
  'states-and-behavior': 4,
  'motion-and-micro-interaction-systems': 4,
  'high-fidelity-in-figma': 5,
  'tokens-and-variables': 3,
  'html-css-and-state-definition': 3,
  'problem-framing': 2,
  'working-across-disciplines': 3,
  'writing-and-presenting': 3,
  mentoring: 3,
};

const COLLABORATION_HEAVY: Allocation = {
  'working-across-disciplines': 5,
  'critique-and-consensus': 5,
  'writing-and-presenting': 5,
  'context-that-survives-the-room': 4,
  mentoring: 5,
  'direction-and-advocacy': 4,
  'problem-framing': 3,
  'flows-edge-cases-and-decisions': 3,
  'high-fidelity-in-figma': 3,
  'typography-and-hierarchy': 3,
  'discovery-and-synthesis': 3,
  'tokens-and-variables': 3,
};

describe('scoring', () => {
  it('returns zeros for an empty allocation', () => {
    const traits = scoreTraits({}, TREES);
    TRAITS.forEach((t) => expect(traits[t]).toBe(0));
    expect(topTraits(traits).map((t) => t.score)).toEqual([0, 0, 0, 0]);
  });

  it('reads an even spread as an even profile, in the 40s', () => {
    const even = NODE_LIST.reduce<Allocation>((acc, n) => {
      acc[n.id] = 3;
      return acc;
    }, {});
    const traits = scoreTraits(even, TREES);
    const values = TRAITS.map((t) => traits[t]);
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
    expect(Math.max(...values)).toBeGreaterThanOrEqual(38);
    expect(Math.max(...values)).toBeLessThanOrEqual(50);
  });

  it('keeps a scattered allocation in the 40s to 60s and a focused one in the 90s', () => {
    const scattered = scoreTraits(SCATTERED, TREES);
    TRAITS.forEach((t) => {
      expect(scattered[t]).toBeGreaterThanOrEqual(40);
      expect(scattered[t]).toBeLessThanOrEqual(69);
    });
    [RESEARCH_HEAVY, VISUAL_HEAVY, COLLABORATION_HEAVY].forEach((a) => {
      expect(topTraits(scoreTraits(a, TREES))[0].score).toBeGreaterThanOrEqual(90);
    });
  });

  it('leads research-heavy with research, visual-heavy with craft, collaboration-heavy with collaboration', () => {
    expect(topTraits(scoreTraits(RESEARCH_HEAVY, TREES))[0].trait).toBe('research');
    expect(topTraits(scoreTraits(VISUAL_HEAVY, TREES))[0].trait).toBe('craft');
    expect(topTraits(scoreTraits(COLLABORATION_HEAVY, TREES))[0].trait).toBe('collaboration');
  });

  it('does not depend on pool size: the same shape at half the points scores the same', () => {
    const a = analyzeTraits(RYAN_ALLOCATION, TREES);
    const halved = NODE_LIST.reduce<Allocation>((acc, n) => {
      acc[n.id] = Math.round((RYAN_ALLOCATION[n.id] || 0) / 2);
      return acc;
    }, {});
    const b = analyzeTraits(halved, TREES);
    expect(a.pointsSpent).toBe(84);
    expect(b.pointsSpent).toBeLessThan(a.pointsSpent);
    expect(Math.abs(a.spread - b.spread)).toBeLessThan(0.1);
  });

  it('gives the three synthetic designers different primaries from different families', () => {
    const picks = [RESEARCH_HEAVY, VISUAL_HEAVY, COLLABORATION_HEAVY].map((a) =>
      pickArchetypes(scoreTraits(a, TREES), ARCHETYPES),
    );
    const ids = picks.map((p) => p.primary.id);
    const families = picks.map((p) => p.primary.family);
    expect(new Set(ids).size).toBe(3);
    expect(new Set(families).size).toBe(3);
    picks.forEach((p) => expect(p.primary.family).not.toBe(p.secondary.family));
  });

  it('picks by cosine similarity, secondary from another family', () => {
    const traits = scoreTraits(RYAN_ALLOCATION, TREES);
    const { primary, secondary } = pickArchetypes(traits, STUB_ARCHETYPES);
    expect(primary.id).toBe('stub-systems');
    expect(secondary.id).toBe('stub-exploration');
    expect(() => pickArchetypes(traits, [])).toThrow();
  });
});

// ── Share link ──────────────────────────────────────────────────────────────

const RYAN_DIGITS = '533130205255545243424251403020';

describe('share link', () => {
  it('round-trips Ryan', () => {
    const encoded = encodeState(RYAN_INTAKE, RYAN_ALLOCATION);
    expect(encoded).toBe(`bgw16.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    expect(encoded).toMatch(/^[A-Za-z0-9.%_~-]+$/);
    const decoded = decodeState(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.intake).toEqual(RYAN_INTAKE);
    const expected: Allocation = {};
    Object.keys(RYAN_ALLOCATION).forEach((id) => {
      if (RYAN_ALLOCATION[id] > 0) expected[id] = RYAN_ALLOCATION[id];
    });
    expect(decoded!.allocation).toEqual(expected);
  });

  it('round-trips names with spaces, punctuation, and accents, and every degree, major, and minor', () => {
    const base = intake({ name: 'J. R. Søren-O\'Neil (she/her)', degree: 'self-taught', years: 2, hours: 1 });
    const alloc = spend(spend({}, idOf('Reframing'), 3), idOf('Deciding under constraint'), 1);
    const decoded = decodeState(encodeState(base, alloc));
    expect(decoded).not.toBeNull();
    expect(decoded!.intake).toEqual(base);
    expect(decoded!.allocation).toEqual(alloc);

    DEGREE_OPTIONS.forEach((d) => {
      MAJOR_OPTIONS.forEach((mj) => {
        MINOR_OPTIONS.forEach((mn) => {
          const it = intake({ name: 'x', degree: d.value, major: mj.value, minor: mn.value, years: 3, hours: 2 });
          const back = decodeState(encodeState(it, {}));
          expect(back).not.toBeNull();
          expect(back!.intake).toEqual(it);
        });
      });
    });
  });

  it('rejects garbage and the format from before the degree rule', () => {
    [
      '',
      'hello',
      `b16.5.${RYAN_DIGITS}.Ryan`,
      `bg16.5.${RYAN_DIGITS}.Ryan`,
      'b16.5.533020105255545243414251403020.Ryan%20DeBoer',
      `zgw16.5.${RYAN_DIGITS}.x`,
      `bxw16.5.${RYAN_DIGITS}.x`,
      `bgx16.5.${RYAN_DIGITS}.x`,
      `bgw16.9.${RYAN_DIGITS}.x`,
      `bgw16.5.${RYAN_DIGITS.slice(1)}.x`,
      `bgw16.5.${RYAN_DIGITS}6.x`,
      `bgw16.5.${RYAN_DIGITS}.%E0%A4%A`,
      '<script>',
    ].forEach((v) => expect(decodeState(v)).toBeNull());
    expect(decodeState(undefined as unknown as string)).toBeNull();
  });

  it('rejects states the tree could not have produced', () => {
    // A crown lit over a foundation at 0.
    expect(decodeState('bgw16.5.050000000000000000000000000000.x')).toBeNull();
    // More points than the intake earns: 0 years, no degree, 0 hours, 5 in a foundation.
    expect(decodeState('non0.0.500000000000000000000000000000.x')).toBeNull();
    // The same five points with the intake that earns them (2 years, 8 free).
    expect(decodeState('non2.0.500000000000000000000000000000.x')).not.toBeNull();
    // A degree in web locks its 16 to the Systems tree: 5 in Typography needs free points it does not have.
    expect(decodeState('bwn0.0.500000000000000000000000000000.x')).toBeNull();
    // The same 5 on the Systems tree are fine, and so is Typography once a year adds 4 free.
    expect(decodeState('bwn0.0.000000000050000000000000000000.x')).not.toBeNull();
    expect(decodeState('bwn1.0.400000000000000000000000000000.x')).not.toBeNull();
    expect(decodeState('bwn1.0.500000000000000000000000000000.x')).toBeNull();
    // Self-taught's 8 go anywhere.
    expect(decodeState('sgw0.0.400000000040000000000000000000.x')).not.toBeNull();
    expect(decodeState('sgw0.0.500000000040000000000000000000.x')).toBeNull();
  });
});

// ── The split: the years, locked across the two trees by the design share ───
// Ryan's rule, 2026-09-11: once the years are known, ask what share went to
// design versus code and lock the years points by that share. Optional: an
// intake without a split keeps the years free, exactly as before the rule.

describe('split', () => {
  it('yearsSplit always sums to the years points, both parts non-negative, and mirrors around 50', () => {
    [0, 1, 2, 3, 4, 5, 7, 16, 25, 40].forEach((years) => {
      SPLIT_OPTIONS.forEach((o) => {
        const ys = yearsSplit(years, o.value);
        expect(ys.craft + ys.systems).toBe(yearsPoints(years));
        expect(ys.craft).toBeGreaterThanOrEqual(0);
        expect(ys.systems).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(ys.craft)).toBe(true);
        // 70 design reads as 30 code and back.
        const mirror = yearsSplit(years, 100 - o.value);
        expect(mirror).toEqual({ craft: ys.systems, systems: ys.craft });
      });
    });
  });

  it('rounds the design share to the nearest point: 38 × 0.7 = 26.6 is 27 design and 11 code', () => {
    expect(yearsSplit(16, 70)).toEqual({ craft: 27, systems: 11 });
    expect(yearsSplit(16, 30)).toEqual({ craft: 11, systems: 27 });
    expect(yearsSplit(16, 10)).toEqual({ craft: 4, systems: 34 }); // 3.8
    expect(yearsSplit(16, 90)).toEqual({ craft: 34, systems: 4 }); // 34.2
    expect(yearsSplit(16, 50)).toEqual({ craft: 19, systems: 19 });
    expect(yearsSplit(16, 0)).toEqual({ craft: 0, systems: 38 });
    expect(yearsSplit(16, 100)).toEqual({ craft: 38, systems: 0 });
    expect(yearsSplit(3, 70)).toEqual({ craft: 8, systems: 4 }); // 8.4
    expect(yearsSplit(4, 30)).toEqual({ craft: 4, systems: 10 }); // 4.2
    expect(yearsSplit(0, 70)).toEqual({ craft: 0, systems: 0 });
    // An unsanitized split is sanitized first: 73 reads as 70, 140 as 100, a negative as 0.
    expect(yearsSplit(16, 73)).toEqual(yearsSplit(16, 70));
    expect(yearsSplit(16, 140)).toEqual({ craft: 38, systems: 0 });
    expect(yearsSplit(16, -20)).toEqual({ craft: 0, systems: 38 });
    expect(yearsSplit(-3, 70)).toEqual({ craft: 0, systems: 0 });
  });

  it('sanitizeSplit clamps to 0..100 and rounds to the nearest ten; splitOf reads the intake', () => {
    expect(SPLIT_STEP).toBe(10);
    expect(sanitizeSplit(70)).toBe(70);
    expect(sanitizeSplit(73)).toBe(70);
    expect(sanitizeSplit(75)).toBe(80);
    expect(sanitizeSplit(76)).toBe(80);
    expect(sanitizeSplit(-5)).toBe(0);
    expect(sanitizeSplit(140)).toBe(100);
    expect(sanitizeSplit(0)).toBe(0);
    expect(sanitizeSplit(100)).toBe(100);
    expect(sanitizeSplit(NaN)).toBe(0);
    expect(sanitizeSplit(undefined as unknown as number)).toBe(0);
    // splitOf: absent, undefined, or not a finite number is undefined (years free); a number is sanitized.
    expect(splitOf(intake({}))).toBeUndefined();
    expect(splitOf(intake({ split: undefined }))).toBeUndefined();
    expect(splitOf({ split: NaN })).toBeUndefined();
    expect(splitOf({ split: '70' as unknown as number })).toBeUndefined();
    expect(splitOf({ split: 73 })).toBe(70);
    expect(splitOf({ split: 0 })).toBe(0);
    expect(splitOf({ split: 100 })).toBe(100);
    expect(splitOption(73)).toEqual({ value: 70, label: '70 design · 30 code', short: '70 / 30' });
    expect(splitOption(NaN).value).toBe(0);
  });

  it('exposes eleven options, 0 to 100 design by tens, labelled "70 design · 30 code"', () => {
    expect(SPLIT_OPTIONS.map((o) => o.value)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    expect(SPLIT_OPTIONS[7]).toEqual({ value: 70, label: '70 design · 30 code', short: '70 / 30' });
    expect(SPLIT_OPTIONS[0].label).toBe('0 design · 100 code');
    expect(SPLIT_OPTIONS[10].label).toBe('100 design · 0 code');
    SPLIT_OPTIONS.forEach((o) => {
      expect(o.label).not.toContain(EM_DASH);
      expect(o.short).not.toContain(EM_DASH);
      expect(sanitizeSplit(o.value)).toBe(o.value);
    });
    expect(SPLIT_NOTE).not.toContain(EM_DASH);
    expect(SPLIT_NOTE).not.toMatch(CONTRACTION);
  });

  it('Ryan at 70 design: the 38 years points become 27 craft-locked and 11 systems-locked, craft total unchanged', () => {
    const pools = computePools({ ...RYAN_INTAKE, split: 70 });
    const plain = computePools(RYAN_INTAKE);
    expect(pools.craft).toBe(63);
    expect(pools.craft).toBe(plain.craft);
    expect(pools.core).toBe(plain.core);
    expect(pools.level).toBe(plain.level);
    expect(pools).toMatchObject({ craftLocked: 16 + 27, systemsLocked: 4 + 11, free: 5, core: 21, level: 16 });
    expect(pools.craft).toBe(pools.craftLocked + pools.systemsLocked + pools.free);
    expect(pools.receipt.map((r) => r.points)).toEqual([16, 4, 27, 11, 5, 21]);
    expect(pools.receipt.map((r) => r.label)).toEqual([
      "+16 · Bachelor's, graphic design",
      '+4 · Minor, web',
      '+27 · 16 years, design',
      '+11 · 16 years, code',
      '+5 · 200+ hours',
      '+21 · Core, 16 years',
    ]);
    expect(pools.receipt.map((r) => r.pool)).toEqual(['craft', 'craft', 'craft', 'craft', 'craft', 'core']);
    expect(pools.receipt.map((r) => r.lockedTo)).toEqual(['craft', 'systems', 'craft', 'systems', undefined, undefined]);
    expect(pools.receipt[2].note).toBe(`${YEARS_NOTE} · 70 percent, locked to the Craft tree`);
    expect(pools.receipt[3].note).toBe(`${YEARS_NOTE} · 30 percent, locked to the Systems and build tree`);
    pools.receipt.forEach((r) => {
      expect(r.note).not.toContain(EM_DASH);
      expect(r.note).not.toMatch(CONTRACTION);
      expect(r.label).not.toContain(EM_DASH);
    });
    // One year, singular, on both lines.
    expect(computePools(intake({ years: 1, split: 50 })).receipt.slice(1, 3).map((r) => r.label)).toEqual(['+2 · 1 year, design', '+2 · 1 year, code']);
  });

  it('without a split the pools are byte-identical to before the rule, and RYAN_INTAKE carries none', () => {
    const plain = computePools(RYAN_INTAKE);
    expect(JSON.stringify(computePools({ ...RYAN_INTAKE, split: undefined }))).toBe(JSON.stringify(plain));
    expect(JSON.stringify(computePools({ ...RYAN_INTAKE, split: NaN }))).toBe(JSON.stringify(plain));
    expect(plain).toMatchObject({ craft: 63, craftLocked: 16, systemsLocked: 4, free: 43 });
    expect(plain.receipt).toHaveLength(5);
    expect(plain.receipt[2]).toEqual({ points: 38, label: '+38 · 16 years', note: YEARS_NOTE, pool: 'craft' });
    expect(Object.keys(plain.receipt[2])).toEqual(['points', 'label', 'note', 'pool']);
    // Ryan picks his own split after seeing the consequence; nothing here sets it.
    expect('split' in RYAN_INTAKE).toBe(false);
  });

  it('an absent, undefined, NaN, null, or non-numeric split is byte-identical to no split, for every intake', () => {
    // The page writes `split: undefined` for "not split"; a persisted intake may carry null or a string.
    // None of them may change a single byte of the pools or the share link.
    DEGREE_OPTIONS.forEach((d) => {
      MAJOR_OPTIONS.forEach((mj) => {
        MINOR_OPTIONS.forEach((mn) => {
          [0, 1, 3, 4, 16, 40].forEach((years) => {
            ([0, 1, 5] as HoursBand[]).forEach((hours) => {
              const base = intake({ degree: d.value, major: mj.value, minor: mn.value, years, hours });
              const pools = JSON.stringify(computePools(base));
              const link = encodeState(base, {});
              [undefined, NaN, null, '70', Infinity].forEach((raw) => {
                const it = { ...base, split: raw as unknown as number };
                expect(JSON.stringify(computePools(it))).toBe(pools);
                expect(encodeState(it, {})).toBe(link);
              });
            });
          });
        });
      });
    });
  });

  it('the craft pool is still its three parts, and the receipt still adds up, at every split', () => {
    DEGREE_OPTIONS.forEach((d) => {
      MAJOR_OPTIONS.forEach((mj) => {
        MINOR_OPTIONS.forEach((mn) => {
          [0, 1, 3, 4, 16].forEach((years) => {
            ([0, 5] as HoursBand[]).forEach((hours) => {
              const base = intake({ degree: d.value, major: mj.value, minor: mn.value, years, hours });
              const plain = computePools(base);
              SPLIT_OPTIONS.forEach((o) => {
                const p = computePools({ ...base, split: o.value });
                const ys = yearsSplit(years, o.value);
                expect(p.craft).toBe(plain.craft);
                expect(p.core).toBe(plain.core);
                expect(p.level).toBe(plain.level);
                expect(p.craft).toBe(p.craftLocked + p.systemsLocked + p.free);
                expect(p.free).toBe(plain.free - yearsPoints(years));
                expect(p.craftLocked).toBe(plain.craftLocked + ys.craft);
                expect(p.systemsLocked).toBe(plain.systemsLocked + ys.systems);
                expect(p.receipt).toHaveLength(plain.receipt.length + 1);
                const sum = (pick: (r: (typeof p.receipt)[number]) => boolean) =>
                  p.receipt.filter(pick).reduce((acc, r) => acc + r.points, 0);
                expect(sum((r) => r.pool === 'craft')).toBe(p.craft);
                expect(sum((r) => r.pool === 'core')).toBe(p.core);
                expect(sum((r) => r.lockedTo === 'craft')).toBe(p.craftLocked);
                expect(sum((r) => r.lockedTo === 'systems')).toBe(p.systemsLocked);
                expect(sum((r) => r.pool === 'craft' && !r.lockedTo)).toBe(p.free);
              });
            });
          });
        });
      });
    });
  });

  it('a fully locked allocation is feasible, spends every part to zero, and round-trips with its split', () => {
    // Bachelor's in graphic design, minor in web, 4 years at 50 design, no hours:
    // 16 + 7 craft-locked, 4 + 7 systems-locked, 0 free, core 8.
    const it = intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 4, hours: 0, split: 50 });
    const pools = computePools(it);
    expect(pools).toMatchObject({ craft: 34, craftLocked: 23, systemsLocked: 11, free: 0, core: 8 });
    let a: Allocation = {};
    // Craft tree: 23.
    a = spend(a, idOf('Typography and hierarchy'), 5, pools);
    a = spend(a, idOf('Composition, brand, and polish'), 5, pools);
    a = spend(a, idOf('High-fidelity in Figma'), 5, pools);
    a = spend(a, idOf('Coded prototypes that ship'), 5, pools);
    a = spend(a, idOf('States and behavior'), 3, pools);
    // Systems tree: 11.
    a = spend(a, idOf('Tokens and variables'), 5, pools);
    a = spend(a, idOf('Components, Storybook, and scaling'), 5, pools);
    a = spend(a, idOf('Standards, accessibility, and QA'), 1, pools);
    // Core: 8.
    a = spend(a, idOf('Mentoring'), 5, pools);
    a = spend(a, idOf('Direction and advocacy'), 3, pools);
    expect(treeSpend(a)).toEqual({ craft: 23, systems: 11, core: 8 });
    expect(poolsSpent(a)).toEqual({ craft: 34, core: 8 });
    expect(feasible(a, pools)).toBe(true);
    expect(withinPools(a, pools)).toBe(true);
    expect(remaining(a, pools)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 0 });
    NODE_LIST.forEach((n) => expect(canSpend(a, n.id, TREES, pools)).toBe(false));
    expect(clampToPools(a, pools)).toBe(a);
    // One more on either tree overdraws: there is no free part to pay from.
    expect(feasible({ ...a, [idOf('Problem framing')]: 1 }, pools)).toBe(false);
    expect(feasible({ ...a, [idOf('Standards, accessibility, and QA')]: 2 }, pools)).toBe(false);
    // And the state round-trips through the share link with its split.
    const back = decodeState(encodeState(it, a));
    expect(back).not.toBeNull();
    expect(back!.intake).toEqual(it);
    expect(back!.intake.split).toBe(50);
    expect(back!.allocation).toEqual(a);
  });

  it('locks the years to one tree at 0 or 100 design; the other tree cannot draw on them; hours stay free', () => {
    // 3 years, no degree, no hours: 12 points.
    const typo = idOf('Typography and hierarchy');
    const tokens = idOf('Tokens and variables');
    const allDesign = computePools(intake({ years: 3, split: 100 }));
    expect(allDesign).toMatchObject({ craft: 12, craftLocked: 12, systemsLocked: 0, free: 0 });
    expect(canSpend({}, tokens, TREES, allDesign)).toBe(false);
    expect(spend({}, tokens, 1, allDesign)).toEqual({});
    expect(canSpend({}, typo, TREES, allDesign)).toBe(true);
    expect(spend({}, typo, 9, allDesign)[typo]).toBe(5);
    const allCode = computePools(intake({ years: 3, split: 0 }));
    expect(allCode).toMatchObject({ craft: 12, craftLocked: 0, systemsLocked: 12, free: 0 });
    expect(canSpend({}, typo, TREES, allCode)).toBe(false);
    expect(canSpend({}, tokens, TREES, allCode)).toBe(true);
    // Hours stay free either way: two bands open the Craft tree to exactly 2.
    const withHours = computePools(intake({ years: 3, hours: 2, split: 0 }));
    expect(withHours).toMatchObject({ craft: 14, craftLocked: 0, systemsLocked: 12, free: 2 });
    expect(spend({}, typo, 5, withHours)[typo]).toBe(2);
    expect(remaining({ [typo]: 2 }, withHours)).toEqual({ craftLocked: 0, systemsLocked: 12, free: 0, core: 6 });
  });

  it('never strands a locked point under a split: a random walk stays feasible and spendable', () => {
    const prng = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const spendable = (a: Allocation, pools: ReturnType<typeof computePools>, tree: TreeId) =>
      treeNodes(tree).some((n) => canSpend(a, n.id, TREES, pools));
    const intakes: Intake[] = [
      intake({ degree: 'bachelors', major: 'graphic', minor: 'web', years: 4, hours: 1, split: 50 }), // 23 / 11 / 1
      intake({ degree: 'self-taught', years: 16, hours: 5, split: 70 }), // 27 / 11 / 13
      intake({ degree: 'masters', major: 'web', years: 3, split: 100 }), // 12 / 24 / 0
      { ...RYAN_INTAKE, split: 20 }, // 24 / 34 / 5
    ];
    intakes.forEach((it, i) => {
      const pools = computePools(it);
      const rand = prng(41 + i);
      let a: Allocation = {};
      for (let step = 0; step < 300; step++) {
        const node = NODE_LIST[Math.floor(rand() * NODE_LIST.length)];
        const delta = rand() < 0.65 ? 1 : -1;
        const next = spend(a, node.id, delta, pools);
        expect(delta < 0 || canSpend(a, node.id, TREES, pools) === (next !== a)).toBe(true);
        a = next;
        expect(feasible(a, pools)).toBe(true);
        expect(clampToPools(a, pools)).toBe(a);
        const left = remaining(a, pools);
        expect(left.craftLocked === 0 || spendable(a, pools, 'craft')).toBe(true);
        expect(left.systemsLocked === 0 || spendable(a, pools, 'systems')).toBe(true);
        expect(left.core === 0 || spendable(a, pools, 'core')).toBe(true);
        expect(left.free === 0 || spendable(a, pools, 'craft') || spendable(a, pools, 'systems')).toBe(true);
        const spent = treeSpend(a);
        expect(left.craftLocked + left.systemsLocked + left.free).toBe(pools.craft - spent.craft - spent.systems);
      }
    });
  });

  it('the consequence for Ryan: his current allocation fits only at 10 or 20 design; clampToPools recovers the rest', () => {
    // Craft 24 and Systems 39 against 16 + design-years craft-locked, 4 + code-years systems-locked, 5 free.
    const fits = SPLIT_OPTIONS.filter((o) => feasible(RYAN_ALLOCATION, computePools({ ...RYAN_INTAKE, split: o.value }))).map((o) => o.value);
    expect(fits).toEqual([10, 20]);
    // At 20 design the fit is exact: 24 craft-locked for Craft 24, 34 + 5 for Systems 39.
    const at20 = computePools({ ...RYAN_INTAKE, split: 20 });
    expect(at20).toMatchObject({ craftLocked: 24, systemsLocked: 34, free: 5 });
    expect(remaining(RYAN_ALLOCATION, at20)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 0 });
    // At 70 design the Systems tree is 19 over, and 19 craft-locked points wait for the Craft tree.
    const at70 = computePools({ ...RYAN_INTAKE, split: 70 });
    expect(feasible(RYAN_ALLOCATION, at70)).toBe(false);
    NODE_LIST.forEach((n) => expect(canSpend(RYAN_ALLOCATION, n.id, TREES, at70)).toBe(false));
    const clamped = clampToPools(RYAN_ALLOCATION, at70);
    expect(feasible(clamped, at70)).toBe(true);
    expect(treeSpend(clamped)).toEqual({ craft: 24, systems: 15 + 5, core: 21 });
    expect(remaining(clamped, at70)).toEqual({ craftLocked: 19, systemsLocked: 0, free: 0, core: 0 });
    expect(treeNodes('craft').some((n) => canSpend(clamped, n.id, TREES, at70))).toBe(true);
    // Taking the split away again restores 43 free; the clamped allocation fits as it is and is returned untouched.
    const plain = computePools(RYAN_INTAKE);
    expect(feasible(clamped, plain)).toBe(true);
    expect(clampToPools(clamped, plain)).toBe(clamped);
  });

  it('clampToPools after the split flips from 0 to 100 design: exactly the overdraw comes off the Systems tree, the Craft tree keeps its locked part', () => {
    // Self-taught, 3 years, no hours: 8 free + 12 years. At 0 design the 12 are systems-locked.
    const at0 = computePools(intake({ degree: 'self-taught', years: 3, split: 0 }));
    expect(at0).toMatchObject({ craft: 20, craftLocked: 0, systemsLocked: 12, free: 8, core: 6 });
    let a: Allocation = {};
    a = spend(a, idOf('Tokens and variables'), 5, at0);
    a = spend(a, idOf('Components, Storybook, and scaling'), 5, at0);
    a = spend(a, idOf('Standards, accessibility, and QA'), 5, at0);
    a = spend(a, idOf('Exceptions, contribution, and agent-readable rules'), 1, at0); // Systems 16: 12 locked + 4 free
    a = spend(a, idOf('Typography and hierarchy'), 4, at0); // Craft 4, all from free
    expect(treeSpend(a)).toEqual({ craft: 4, systems: 16, core: 0 });
    expect(remaining(a, at0)).toEqual({ craftLocked: 0, systemsLocked: 0, free: 0, core: 6 });

    // At 100 design the same 12 are craft-locked: Systems 16 now needs 16 free and has 8; Craft 4 sits inside its 12.
    const at100 = computePools(intake({ degree: 'self-taught', years: 3, split: 100 }));
    expect(at100).toMatchObject({ craft: 20, craftLocked: 12, systemsLocked: 0, free: 8, core: 6 });
    expect(feasible(a, at100)).toBe(false);
    NODE_LIST.forEach((n) => expect(canSpend(a, n.id, TREES, at100)).toBe(false));
    const clamped = clampToPools(a, at100);
    expect(feasible(clamped, at100)).toBe(true);
    // Eight off, all from Systems (crowns first: Components 5 to 0 and Exceptions 1 to 0, then Standards 5 to 3); Craft untouched.
    expect(treeSpend(clamped)).toEqual({ craft: 4, systems: 8, core: 0 });
    expect(clamped[idOf('Typography and hierarchy')]).toBe(4);
    expect(clamped[idOf('Tokens and variables')]).toBe(5);
    expect(clamped[idOf('Components, Storybook, and scaling')]).toBeUndefined();
    expect(clamped[idOf('Exceptions, contribution, and agent-readable rules')]).toBeUndefined();
    expect(clamped[idOf('Standards, accessibility, and QA')]).toBe(3);
    Object.keys(clamped).forEach((id) => expect(isLocked(clamped, id)).toBe(false));
    expect(remaining(clamped, at100)).toEqual({ craftLocked: 8, systemsLocked: 0, free: 0, core: 6 });
    // The 8 craft-locked points that appeared are spendable on the Craft tree, and the state survives the link.
    expect(treeNodes('craft').some((n) => canSpend(clamped, n.id, TREES, at100))).toBe(true);
    expect(decodeState(encodeState(intake({ degree: 'self-taught', years: 3, split: 100 }), clamped))!.allocation).toEqual(clamped);
  });

  it('documents the consequence at the top of the range: a split can lock more to one tree than the tree can hold', () => {
    // A tree holds 50 (ten nodes at 5). Ryan at 100 design: 16 + 38 = 54 craft-locked, so 4 can never be spent.
    // The economy does not cap or spill this (nothing in Ryan's rule says to); the intake should show it.
    // If Ryan decides otherwise, this test is the one to change.
    const at100 = computePools({ ...RYAN_INTAKE, split: 100 });
    expect(at100).toMatchObject({ craft: 63, craftLocked: 54, systemsLocked: 4, free: 5, core: 21 });
    const fullCraft: Allocation = {};
    treeNodes('craft').forEach((n) => { fullCraft[n.id] = 5; });
    expect(treeSpend(fullCraft).craft).toBe(50);
    expect(feasible(fullCraft, at100)).toBe(true);
    expect(remaining(fullCraft, at100)).toEqual({ craftLocked: 4, systemsLocked: 4, free: 5, core: 21 });
    expect(treeNodes('craft').some((n) => canSpend(fullCraft, n.id, TREES, at100))).toBe(false);
    // At 90 design the lock is exactly the tree: 16 + 34 = 50, nothing stranded.
    expect(computePools({ ...RYAN_INTAKE, split: 90 }).craftLocked).toBe(50);
  });

  it('buildResult carries the sanitized split on the result intake, or no split key at all; the score ignores it', () => {
    const plain = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
    expect('split' in plain.intake).toBe(false);
    const nan = buildResult({ ...RYAN_INTAKE, split: NaN }, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
    expect('split' in nan.intake).toBe(false);
    const at73 = buildResult({ ...RYAN_INTAKE, split: 73 }, RYAN_ALLOCATION, TREES, ARCHETYPES, RYAN_OVERRIDES);
    expect(at73.intake.split).toBe(70);
    expect(at73.intake).toEqual({ ...RYAN_INTAKE, split: 70 });
    expect(at73.pools).toMatchObject({ craft: 63, craftLocked: 43, systemsLocked: 15, free: 5 });
    // The split moves the pools, never the score: same allocation, same traits and class.
    expect(at73.traits).toEqual(plain.traits);
    expect(at73.primary.id).toBe(plain.primary.id);
    expect(at73.secondary.id).toBe(plain.secondary.id);
  });
});

// ── Share link, the split token ─────────────────────────────────────────────

describe('share link, split token', () => {
  it('carries the split on the years token and round-trips it', () => {
    const at20 = { ...RYAN_INTAKE, split: 20 };
    const encoded = encodeState(at20, RYAN_ALLOCATION);
    expect(encoded).toBe(`bgw16d20.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    expect(encoded).toMatch(/^[A-Za-z0-9.%_~-]+$/);
    const decoded = decodeState(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.intake).toEqual(at20);
    expect(decoded!.intake.split).toBe(20);
    const expected: Allocation = {};
    Object.keys(RYAN_ALLOCATION).forEach((id) => {
      if (RYAN_ALLOCATION[id] > 0) expected[id] = RYAN_ALLOCATION[id];
    });
    expect(decoded!.allocation).toEqual(expected);
    // The same points at 70 design no longer fit where they were spent, and the link says so.
    expect(decodeState(`bgw16d70.5.${RYAN_DIGITS}.Ryan%20DeBoer`)).toBeNull();
    const empty = decodeState(`bgw16d70.5.${'0'.repeat(30)}.Ryan`);
    expect(empty!.intake).toEqual({ ...RYAN_INTAKE, name: 'Ryan', split: 70 });
    expect(empty!.allocation).toEqual({});
  });

  it('a string without the token still decodes, to an intake with no split key; encoding without a split writes none', () => {
    const decoded = decodeState(`bgw16.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    expect(decoded).not.toBeNull();
    expect('split' in decoded!.intake).toBe(false);
    expect(decoded!.intake).toEqual(RYAN_INTAKE);
    expect(encodeState(RYAN_INTAKE, RYAN_ALLOCATION)).toBe(`bgw16.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    expect(encodeState({ ...RYAN_INTAKE, split: undefined }, RYAN_ALLOCATION)).toBe(`bgw16.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    expect(encodeState({ ...RYAN_INTAKE, split: NaN }, RYAN_ALLOCATION)).toBe(`bgw16.5.${RYAN_DIGITS}.Ryan%20DeBoer`);
    // An unsanitized split is written sanitized.
    expect(encodeState({ ...RYAN_INTAKE, split: 73 }, {})).toMatch(/^bgw16d70\.5\./);
    expect(encodeState({ ...RYAN_INTAKE, split: 140 }, {})).toMatch(/^bgw16d100\.5\./);
    expect(encodeState({ ...RYAN_INTAKE, split: -4 }, {})).toMatch(/^bgw16d0\.5\./);
  });

  it('round-trips every split with every degree, major, and minor', () => {
    DEGREE_OPTIONS.forEach((d) => {
      MAJOR_OPTIONS.forEach((mj) => {
        MINOR_OPTIONS.forEach((mn) => {
          SPLIT_OPTIONS.forEach((o) => {
            const it = intake({ name: 'x', degree: d.value, major: mj.value, minor: mn.value, years: 3, hours: 2, split: o.value });
            const back = decodeState(encodeState(it, {}));
            expect(back).not.toBeNull();
            expect(back!.intake).toEqual(it);
            expect(back!.intake.split).toBe(o.value);
          });
        });
      });
    });
  });

  it('rejects a split the intake cannot produce, and still rejects the format from before the degree rule', () => {
    const zero = '0'.repeat(30);
    [
      `bgw16d75.5.${zero}.x`,
      `bgw16d110.5.${zero}.x`,
      `bgw16d.5.${zero}.x`,
      `bgw16d7x.5.${zero}.x`,
      `bgw16d1000.5.${zero}.x`,
      `bgwd70.5.${zero}.x`,
      `bgw16s70.5.${zero}.x`,
      `bgw16.5.d70.${zero}.x`,
      `bgw16.5d70.${zero}.x`,
      `b16d70.5.${zero}.x`,
      `b16.5.${RYAN_DIGITS}.Ryan`,
    ].forEach((v) => expect(decodeState(v)).toBeNull());
    expect(decodeState(`bgw16d0.5.${zero}.x`)!.intake.split).toBe(0);
    expect(decodeState(`bgw16d100.5.${zero}.x`)!.intake.split).toBe(100);
  });

  it('checks feasibility against the split: two years at 100 design pay for Typography, at 0 design they do not', () => {
    const typo5 = '5' + '0'.repeat(29);
    const typo4 = '4' + '0'.repeat(29);
    const tokens5 = '0'.repeat(10) + '5' + '0'.repeat(19);
    // 2 years, no degree: 8 points.
    expect(decodeState(`non2.0.${typo5}.x`)).not.toBeNull(); // free
    expect(decodeState(`non2d100.0.${typo5}.x`)).not.toBeNull(); // 8 craft-locked
    expect(decodeState(`non2d0.0.${typo5}.x`)).toBeNull(); // 8 systems-locked
    expect(decodeState(`non2d0.0.${tokens5}.x`)).not.toBeNull();
    expect(decodeState(`non2d100.0.${tokens5}.x`)).toBeNull();
    // 1 year at 100 design: 4 craft-locked, not enough for 5.
    expect(decodeState(`non1d100.0.${typo5}.x`)).toBeNull();
    // 50 design on 8 points: 4 and 4. Typography 4 fits; 5 does not.
    expect(decodeState(`non2d50.0.${typo4}.x`)).not.toBeNull();
    expect(decodeState(`non2d50.0.${typo5}.x`)).toBeNull();
    // A degree in web plus a year at 100 design: 16 systems-locked and 4 craft-locked, so Typography 4 fits and 5 does not.
    expect(decodeState(`bwn1d100.0.${typo4}.x`)).not.toBeNull();
    expect(decodeState(`bwn1d100.0.${typo5}.x`)).toBeNull();
  });
});

// ── A minimal pool for the pairing mechanics, independent of the real signatures.

const STUB_ARCHETYPES: Archetype[] = [
  {
    id: 'stub-systems',
    name: 'Stub Systems',
    family: 'systems',
    line: 'structure',
    signature: { systems: 1, build: 0.4, collaboration: 0.3 },
    you: 'You build structure.',
    cares: 'the system underneath',
    happiest: 'when the rules hold',
    passive: 'Keeps the system honest.',
    quest: 'Write the rules down.',
  },
  {
    id: 'stub-exploration',
    name: 'Stub Exploration',
    family: 'exploration',
    line: 'invention',
    signature: { exploration: 1, build: 0.5, craft: 0.3 },
    you: 'You try things.',
    cares: 'what could exist',
    happiest: 'when an idea becomes testable',
    passive: 'Turns ambiguity into a prototype.',
    quest: 'Ship the experiment.',
  },
  {
    id: 'stub-research',
    name: 'Stub Research',
    family: 'research',
    line: 'evidence',
    signature: { research: 1, strategy: 0.6 },
    you: 'You ask first.',
    cares: 'what is true',
    happiest: 'when the data agrees',
    passive: 'Finds the signal.',
    quest: 'Prove it.',
  },
];
