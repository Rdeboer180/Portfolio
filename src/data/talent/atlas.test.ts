import { ATLAS_ABILITIES, ATLAS_SKILLS, atlasAbilityView, evaluateAtlas, evaluateAtlasAbility, pickAtlasClass, uncoveredAtlasSkills } from './atlas';
import { RYAN_ATLAS, atlasPools, atlasSpent, atlasWithinBudget, changeAtlasPoint, decodeAtlas, encodeAtlas } from './atlasState';
import { ATLAS_ABILITY_POSITIONS, ATLAS_SKILL_POSITIONS } from './atlasLayout';
import { RYAN_ALLOCATION, RYAN_INTAKE } from './ryan';
import { encodeState } from './score';

const systemSight = ATLAS_ABILITIES.find((a) => a.id === 'system-sight')!;

test('the complete 32-skill, 31-ability catalog covers every skill and map location', () => {
  expect(ATLAS_SKILLS).toHaveLength(32);
  expect(ATLAS_ABILITIES).toHaveLength(31);
  expect(new Set(ATLAS_ABILITIES.map((a) => a.id)).size).toBe(31);
  expect(uncoveredAtlasSkills()).toEqual([]);
  ATLAS_ABILITIES.forEach((a) => expect(ATLAS_ABILITY_POSITIONS[a.id]).toBeDefined());
  ATLAS_SKILLS.forEach((s) => expect(ATLAS_SKILL_POSITIONS[s.id]).toBeDefined());
});

test('charge responds continuously while rank follows the weakest ingredient', () => {
  const initial = evaluateAtlasAbility(systemSight, { tokens: 5, components: 5, governance: 2 });
  expect(initial.rankLabel).toBe('Strengthened');
  expect(initial.charge).toBe(12 / 15);
  expect(initial.limitingSkills).toEqual(['governance']);
  expect(initial.requirements.find((r) => r.skillId === 'governance')?.nextRankMissing).toBe(1);
  expect(evaluateAtlasAbility(systemSight, { tokens: 5, components: 5, governance: 3 }).rankLabel).toBe('Advanced');
  const mastered = evaluateAtlasAbility(systemSight, { tokens: 5, components: 5, governance: 5 });
  expect(mastered.rankLabel).toBe('Master');
  expect(mastered.charge).toBe(1);
  expect(mastered.nextRank).toBeNull();
  expect(mastered.limitingSkills).toEqual([]);
});

test('discovery happens only when all ingredients are invested, including two-skill recipes', () => {
  expect(evaluateAtlasAbility(systemSight, { tokens: 5 }).visibility).toBe('hidden');
  const hint = evaluateAtlasAbility(systemSight, { tokens: 5, components: 2 });
  expect(hint.visibility).toBe('resonating');
  const view = atlasAbilityView(hint);
  expect(view.name).toBe('???');
  expect(view).not.toHaveProperty('requirements');
  expect(view).not.toHaveProperty('description');
  expect(evaluateAtlasAbility(systemSight, { tokens: 1, components: 1, governance: 1 }).visibility).toBe('discovered');
  expect(evaluateAtlasAbility(ATLAS_ABILITIES[0], { figma: 1, components: 1 }).rankLabel).toBe('Unlocked');
});

test('remembered discoveries cannot retain an unearned rank or influence class', () => {
  const remembered = evaluateAtlasAbility(systemSight, {}, true);
  expect(remembered.visibility).toBe('discovered');
  expect(remembered.rank).toBe(0);
  expect(remembered.classWeight).toBe(0);
  expect(pickAtlasClass([remembered]).primary).toBeNull();
});

test('empty builds never disclose a provisional secret class', () => {
  expect(pickAtlasClass(evaluateAtlas({}))).toEqual({ primary: null, secondary: null });
});

test('Ryan’s explicit visual craft credit funds the two additions without moving existing points', () => {
  const pools = atlasPools(RYAN_ATLAS.intake, RYAN_ATLAS.craftCredit);
  expect(pools.total).toBe(71);
  expect(atlasWithinBudget(RYAN_ATLAS.allocation, pools)).toBe(true);
  expect(Object.values(atlasSpent(RYAN_ATLAS.allocation)).reduce((a, b) => a + b, 0)).toBe(71);
  Object.entries(RYAN_ALLOCATION).forEach(([id, points]) => expect(RYAN_ATLAS.allocation[id]).toBe(points));
  expect(atlasPools(RYAN_INTAKE).total).toBe(63);
});

test('spending respects gates and budgets, including the new visual skills', () => {
  const pools = atlasPools(RYAN_INTAKE, 8);
  expect(changeAtlasPoint(RYAN_ATLAS.allocation, 'raster-craft', 1, pools)).toBe(RYAN_ATLAS.allocation);
  expect(changeAtlasPoint({}, 'layout', 1, pools)).toEqual({});
  expect(changeAtlasPoint({ typography: 3, layout: 2 }, 'typography', -1, pools)).toEqual({ typography: 2 });
  expect(changeAtlasPoint({}, 'vector-design', 1, pools)).toEqual({ 'vector-design': 1 });
});

test('v6 shares preserve stable ids and credit while existing v5 shares still load', () => {
  const decoded = decodeAtlas(encodeAtlas(RYAN_ATLAS))!;
  expect(decoded.allocation['raster-craft']).toBe(3);
  expect(decoded.allocation['vector-design']).toBe(5);
  expect(decoded.craftCredit).toBe(8);
  expect(decodeAtlas(encodeState(RYAN_INTAKE, RYAN_ALLOCATION))?.craftCredit).toBe(0);
  expect(decodeAtlas('v6.broken')).toBeNull();
  const invalid = `v6.${encodeURIComponent(JSON.stringify({ ...RYAN_ATLAS, allocation: { typography: 1, layout: 5 } }))}`;
  expect(decodeAtlas(invalid)).toBeNull();
});

test('malformed numeric input cannot corrupt ability charge', () => {
  const state = evaluateAtlasAbility(systemSight, { tokens: NaN, components: Infinity, governance: -4 });
  expect(state.charge).toBe(0);
  expect(state.rank).toBe(0);
});
