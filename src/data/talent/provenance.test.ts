import { TALENT_SOURCES } from './provenance';
import { NODES } from './trees';
import projects from '../projects';
import { getNote } from '../notes';

describe('talent sources', () => {
  it('keeps every label under 20 characters', () => {
    const long = Object.entries(TALENT_SOURCES).flatMap(([id, sources]) =>
      sources.filter((s) => s.label.length >= 20).map((s) => `${id}: ${s.label}`));
    expect(long).toEqual([]);
  });

  it('keeps every tag short', () => {
    const long = Object.values(TALENT_SOURCES).flat().filter((s) => s.tag.length > 10).map((s) => s.tag);
    expect(long).toEqual([]);
  });

  it('links only to pages a visitor can reach', () => {
    const resolves = (to: string): boolean => {
      const work = to.match(/^\/work\/([^/]+)\/$/);
      if (work) return projects.some((p) => p.slug === work[1] && !p.hidden);
      const note = to.match(/^\/notes\/([^/]+)\/$/);
      if (note) return !!getNote(note[1]);
      return to === '/demo/tire-fitment/';
    };
    const broken = Object.values(TALENT_SOURCES).flat().filter((s) => s.to && !resolves(s.to)).map((s) => `${s.label} -> ${s.to}`);
    expect(broken).toEqual([]);
  });

  it('only names talents that exist in the tree', () => {
    expect(Object.keys(TALENT_SOURCES).filter((id) => !NODES[id])).toEqual([]);
  });
});
