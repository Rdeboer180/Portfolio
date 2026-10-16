import projects, { ANON_CLIENT, WORK_ORDER, clientLabelFor, orderedProjects } from './projects';
import { WORK_GROUPS, clientGroups, clientKeyFor, studiesFor, studiesInGroup } from './workGroups';

/**
 * The navigator's data rules, executable. The order and the groupings are
 * authored, so these guard the promises the homepage makes about them: one
 * order everywhere, every study findable, and the employer never named
 * before unlock.
 */

const visible = projects.filter((project) => !project.hidden);
const slugsOf = (list: { slug: string }[]) => list.map((project) => project.slug);

describe('work order', () => {
  it('lists every visible study exactly once', () => {
    expect(slugsOf(orderedProjects()).sort()).toEqual(slugsOf(visible).sort());
  });

  it('names only studies that exist and are visible', () => {
    const visibleSlugs = new Set(slugsOf(visible));
    expect(WORK_ORDER.filter((slug) => !visibleSlugs.has(slug))).toEqual([]);
    expect(new Set(WORK_ORDER).size).toBe(WORK_ORDER.length);
  });

  it('opens on WheelRack, PlayDraft and the AEM component system', () => {
    expect(slugsOf(orderedProjects()).slice(0, 3)).toEqual(['wheelrack', 'playdraft', 'aem-component-system']);
  });
});

describe('groups', () => {
  it('offers the four groupings in the order the rail lists them', () => {
    expect(WORK_GROUPS.map((group) => group.id)).toEqual(['aem', 'systems', 'product', 'client']);
  });

  it('files every visible study under a discipline, or under its client alone for brand work', () => {
    const unfiled = visible.filter((project) => !(project.groups?.length) && project.slug !== 'heatherwood');
    expect(slugsOf(unfiled)).toEqual([]);
  });

  it('keeps each discipline in WORK_ORDER', () => {
    const ordered = orderedProjects();
    for (const id of ['aem', 'systems', 'product'] as const) {
      expect(slugsOf(studiesInGroup(id))).toEqual(slugsOf(ordered.filter((project) => project.groups?.includes(id))));
    }
    expect(slugsOf(studiesInGroup('aem'))).toEqual(['aem-component-system', 'tire-categories', 'landing-pages', 'seasonal-content-system']);
  });

  it('resolves a selection to its studies and no selection to the whole order', () => {
    expect(slugsOf(studiesFor(null, null))).toEqual(slugsOf(orderedProjects()));
    expect(slugsOf(studiesFor('client', 'personal'))).toEqual(['playdraft', 'loopstack', 'bolus-binder', 'overscroll-tactics']);
    expect(slugsOf(studiesFor('client', 'heatherwood'))).toEqual(['heatherwood']);
    expect(slugsOf(studiesFor('client', 'employer'))).toHaveLength(7);
  });
});

describe('client disclosure', () => {
  const wheelrack = projects.find((project) => project.slug === 'wheelrack')!;

  it('keeps the employer anonymous while locked, in labels and in group headings', () => {
    expect(clientLabelFor(wheelrack, true)).toBe(ANON_CLIENT);
    expect(clientLabelFor(wheelrack, false)).toBe('Tire Rack');
    const locked = clientGroups(true);
    expect(locked.map((group) => group.label)).toContain(ANON_CLIENT);
    expect(locked.some((group) => group.label.includes('Tire Rack'))).toBe(false);
    expect(clientGroups(false).map((group) => group.label)).toContain('Tire Rack');
  });

  it('uses neutral client keys, so nothing in a hash or the DOM names the employer', () => {
    expect(new Set(visible.map(clientKeyFor))).toEqual(new Set(['employer', 'heatherwood', 'personal']));
  });
});
