import { ATLAS_ABILITIES, ATLAS_SKILLS, atlasAbilityView, evaluateAtlas, evaluateAtlasAbility, pickAtlasClass, uncoveredAtlasSkills } from './atlas';
import { RYAN_ATLAS, atlasPools, atlasSpent, atlasWithinBudget, normalizeAtlas, changeAtlasPoint, decodeAtlas, encodeAtlas } from './atlasState';
import { RYAN_ALLOCATION, RYAN_INTAKE } from './ryan';
import { encodeState } from './score';

const systemSight = ATLAS_ABILITIES.find((a) => a.id === 'system-sight')!;

test('the complete 36-talent, 35-proficiency catalog covers every talent', () => {
  expect(ATLAS_SKILLS).toHaveLength(36);
  expect(ATLAS_ABILITIES).toHaveLength(35);
  expect(new Set(ATLAS_ABILITIES.map((a) => a.id)).size).toBe(35);
  expect(uncoveredAtlasSkills()).toEqual([]);
  ['design', 'technical', 'code'].forEach(id => expect(ATLAS_SKILLS.filter(s => s.territory === id)).toHaveLength(12));
  expect(new Set(ATLAS_SKILLS.map(s => s.id)).size).toBe(36);
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

test('Ryan’s requested strengths fit the revised annual budget without a special credit', () => {
  const pools = atlasPools(RYAN_ATLAS.intake, RYAN_ATLAS.craftCredit, RYAN_ATLAS.priorPracticeYears);
  expect(pools.total).toBe(89);
  expect(RYAN_ATLAS.craftCredit).toBe(0);
  expect(atlasWithinBudget(RYAN_ATLAS.allocation, pools)).toBe(true);
  expect(Object.values(atlasSpent(RYAN_ATLAS.allocation)).reduce((a, b) => a + b, 0)).toBe(89);
  expect(RYAN_ATLAS.allocation).toMatchObject({ html: 3, css: 5, governance: 4, figma: 5, storybook: 3, automation: 2, git: 2, 'ai-tools': 4, 'agent-context': 4, handoff: 4, prototyping: 3, 'state-modeling': 3 });
  ['components', 'accessibility', 'typography', 'prototyping', 'state-modeling'].forEach(id => expect(RYAN_ATLAS.allocation[id]).toBeGreaterThanOrEqual(3));
});

test('all prerequisites unlock at two; Automation is independent', () => {
  const pools = atlasPools(RYAN_INTAKE);
  ATLAS_SKILLS.filter(s => s.prerequisite).forEach(s => {
    const prerequisite = s.prerequisite!;
    expect(prerequisite.points).toBe(2);
    expect(changeAtlasPoint({ [prerequisite.skillId]: 1 }, s.id, 1, pools)[s.id]).toBeUndefined();
    expect(changeAtlasPoint({ [prerequisite.skillId]: 2 }, s.id, 1, pools)[s.id]).toBe(1);
  });
  expect(changeAtlasPoint({}, 'automation', 1, pools)).toEqual({ automation: 1 });
  expect(changeAtlasPoint({ typography: 2, layout: 2 }, 'typography', -1, pools)).toEqual({ typography: 1 });
});

test('revised budget respects optional experience splits and spending limits', () => {
  const pools = atlasPools({ ...RYAN_INTAKE, split: 50 });
  expect(pools.total).toBe(89);
  expect(pools.designLocked).toBe(48);
  expect(pools.codeLocked).toBe(36);
  expect(pools.free).toBe(5);
  const noPoints = atlasPools({ ...RYAN_INTAKE, degree: 'none', minor: 'none', years: 0, hours: 0 });
  const empty = {};
  expect(changeAtlasPoint(empty, 'vector-design', 1, noPoints)).toBe(empty);
  expect(atlasPools({ ...RYAN_INTAKE, years: 17 }).total - atlasPools(RYAN_INTAKE).total).toBe(4);
});

test('v6 shares preserve stable ids and credit while existing v5 shares still load', () => {
  const decoded = decodeAtlas(encodeAtlas(RYAN_ATLAS))!;
  expect(decoded.allocation['raster-craft']).toBe(3);
  expect(decoded.allocation['vector-design']).toBe(5);
  expect(decoded.craftCredit).toBe(0);
  const oldCredited = { ...RYAN_ATLAS, allocation: { ...RYAN_ALLOCATION, 'raster-craft': 3, 'vector-design': 5 }, craftCredit: 8 };
  expect(decodeAtlas(encodeAtlas(oldCredited))?.craftCredit).toBe(8);
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

test('new talents survive shares and unlock their own proficiencies', () => {
  const allocation = { 'systems-mapping': 2, 'validation': 2, 'apis-integrations': 2, 'testing-quality': 2, handoff: 2, 'state-modeling': 2, figma: 2, prototyping: 2, typescript: 2, storybook: 2 };
  expect(decodeAtlas(encodeAtlas({ ...RYAN_ATLAS, allocation }))?.allocation).toEqual(allocation);
  const states = evaluateAtlas(allocation);
  ['system-clarity', 'evidence-loop', 'connected-interfaces', 'reliable-components'].forEach(id => expect(states.find(s => s.ability.id === id)?.rank).toBe(2));
});

test('Ryan’s 89 points distinguish professional years from earlier practice and survive sharing', () => {
  expect(RYAN_ATLAS.intake.years).toBe(14);
  expect(RYAN_ATLAS.priorPracticeYears).toBe(2);
  const pools = atlasPools(RYAN_ATLAS.intake, 0, RYAN_ATLAS.priorPracticeYears);
  expect(pools.total).toBe(89);
  expect(pools.receipt.map(line => line.label)).toContain('+8 · 2 years of earlier independent practice');
  expect(RYAN_ATLAS.allocation).toMatchObject({ research: 2, 'information-architecture': 1, 'systems-mapping': 2 });
  expect(decodeAtlas(encodeAtlas(RYAN_ATLAS))).toEqual({ ...RYAN_ATLAS, allocation: normalizeAtlas(RYAN_ATLAS.allocation) });
  for (const priorPracticeYears of [-1, 1.5, 100, '2']) {
    expect(decodeAtlas(`v6.${encodeURIComponent(JSON.stringify({ ...RYAN_ATLAS, priorPracticeYears }))}`)).toBeNull();
  }
  const legacy = { ...RYAN_ATLAS, intake: { ...RYAN_ATLAS.intake, years: 16 } };
  delete legacy.priorPracticeYears;
  expect(decodeAtlas(encodeAtlas(legacy))).toEqual({ ...legacy, allocation: normalizeAtlas(legacy.allocation) });
});
