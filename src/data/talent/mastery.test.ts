import { ATLAS_ABILITIES, evaluateAtlas } from './atlas';
import { RYAN_ATLAS } from './atlasState';
import { evaluateMastery, MASTERY_DOMAINS, resolveMastery } from './mastery';

test('every build has a classification, including inactive remembered discoveries', () => {
  expect(resolveMastery(evaluateAtlas({})).title).toBe('Initiate Maker');
  expect(resolveMastery(evaluateAtlas({}, new Set(ATLAS_ABILITIES.map(a => a.id)))).title).toBe('Initiate Maker');
});
test('every proficiency contributes to at least one mastery facet', () => {
  const mapped = new Set(MASTERY_DOMAINS.flatMap(d => d.facets.flatMap(f => f.abilities)));
  expect(ATLAS_ABILITIES.filter(a => !mapped.has(a.id))).toEqual([]);
  expect(Array.from(mapped).filter(id => !ATLAS_ABILITIES.some(a => a.id === id))).toEqual([]);
});
test('alternatives do not stack and each domain has an equal maximum', () => {
  const all = Object.fromEntries(ATLAS_ABILITIES.flatMap(a => a.ingredients).map(id => [id, 5]));
  expect(evaluateMastery(evaluateAtlas(all)).map(d => d.strength)).toEqual([15, 15, 15, 15, 15, 15]);
  expect(evaluateMastery(evaluateAtlas(all)).map(d => d.level)).toEqual([5, 5, 5, 5, 5, 5]);
  const only = evaluateAtlas({ html: 5, css: 5 });
  const more = evaluateAtlas({ html: 5, css: 5, typescript: 5, cms: 5 });
  expect(evaluateMastery(only).find(d => d.id === 'realization')!.strength).toBe(5);
  expect(evaluateMastery(more).find(d => d.id === 'realization')!.strength).toBe(5);
});
test('depth alone in one facet cannot earn an advanced class', () => {
  const domain = evaluateMastery(evaluateAtlas({ html: 5, css: 5 })).find(d => d.id === 'realization')!;
  expect(domain.levelName).toBe('Initiate');
});
test('class selection does not depend on order and three full facets are needed for Master', () => {
  const states = evaluateAtlas(RYAN_ATLAS.allocation);
  expect(resolveMastery(states).title).toBe(resolveMastery([...states].reverse()).title);
  const form = evaluateMastery(evaluateAtlas({ typography: 5, layout: 5, 'raster-craft': 5, 'vector-design': 5 }))[0];
  expect(form.levelName).toBe('Master');
  const partial = evaluateMastery(evaluateAtlas({ typography: 5, layout: 5, 'raster-craft': 4, 'vector-design': 5 }))[0];
  expect(partial.levelName).toBe('Expert');
});

test('Craft Steward combines craft, standards, and exploration for any qualifying build', () => {
  const allocation = { 'raster-craft': 3, layout: 3, tokens: 5, accessibility: 4, governance: 4, documentation: 3, figma: 5, prototyping: 3 };
  const result = resolveMastery(evaluateAtlas(allocation));
  expect(result.title).toBe('Adept Craft Steward');
  expect(result.primary?.facets.map(f => f.rank)).toEqual([3, 3, 3]);
  expect(resolveMastery(evaluateAtlas({ ...allocation, prototyping: 1 })).title).toBe('Initiate Craft Steward');
  expect(resolveMastery(evaluateAtlas({ ...allocation, prototyping: 0 })).primary?.id).not.toBe('craft-steward');
  expect(resolveMastery(evaluateAtlas(RYAN_ATLAS.allocation)).title).toBe('Adept Craft Steward');
});

test('hybrid alternatives never stack and Master requires all three pillars at five', () => {
  const all = Object.fromEntries(ATLAS_ABILITIES.flatMap(a => a.ingredients).map(id => [id, 5]));
  expect(resolveMastery(evaluateAtlas(all)).title).toBe('Master Craft Steward');
  expect(resolveMastery(evaluateAtlas({ ...all, governance: 4 })).title).toBe('Expert Craft Steward');
  expect(resolveMastery(evaluateAtlas(all)).primary?.strength).toBe(15);
});
