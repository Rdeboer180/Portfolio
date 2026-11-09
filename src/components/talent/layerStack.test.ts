// The thread's geometry: every knot is arithmetic, so the markup prerenders
// whole and the thread lands on the chips without measuring the DOM.
// Run: CI=true npx react-scripts test --watchAll=false src/components/talent

import { ABILITIES } from '../../data/talent/abilities';
import { NODES } from '../../data/talent/trees';
import { STACK_FLAT, STACK_ISO, STACK_ORDER, recipeLanes, stackChips, stackPoint, threadEdges } from './skillTreeData';

describe('the layer stack', () => {
  it('gives every lane ten chips, all inside the sheet', () => {
    [STACK_ISO, STACK_FLAT].forEach((geo) => STACK_ORDER.forEach((lane) => {
      const chips = stackChips(geo, lane);
      expect(chips.length).toBe(10);
      chips.forEach((c) => {
        expect(c.left - geo.chip / 2).toBeGreaterThanOrEqual(0);
        expect(c.left + geo.chip / 2).toBeLessThanOrEqual(geo.sheetW);
        expect(c.top - geo.chip / 2).toBeGreaterThanOrEqual(0);
        expect(c.top + geo.chip / 2).toBeLessThanOrEqual(geo.sheetH);
      });
    }));
  });

  it('places every skill on the stage, and nothing else', () => {
    [STACK_ISO, STACK_FLAT].forEach((geo) => {
      Object.keys(NODES).forEach((id) => {
        const p = stackPoint(geo, id)!;
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(geo.width);
        expect(p.y).toBeGreaterThan(0);
        expect(p.y).toBeLessThan(geo.height);
      });
      expect(stackPoint(geo, 'not-a-skill')).toBeNull();
    });
  });

  it('threads every recipe as one tree: n skills, n − 1 edges, each from a skill already on it', () => {
    ABILITIES.forEach((ability) => {
      const ids = ability.formula.map((s) => s.nodeId);
      const edges = threadEdges(STACK_ISO, ids);
      expect(edges.length).toBe(ids.length - 1);
      const on = new Set([ids[0]]);
      edges.forEach((e) => {
        expect(on.has(e.from)).toBe(true);
        expect(on.has(e.to)).toBe(false);
        expect(e.length).toBeGreaterThan(0);
        on.add(e.to);
      });
      expect(on.size).toBe(ids.length);
      expect(recipeLanes(ability).length).toBeGreaterThan(0);
    });
    expect(threadEdges(STACK_ISO, ['figma'])).toEqual([]);
  });
});
