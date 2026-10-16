import projects, { ANON_CLIENT, FEATURED, Project, WorkGroupId, clientLabelFor, orderedProjects } from './projects';

/**
 * The groupings the homepage navigator offers, in the order they are listed.
 * Three disciplines are authored per study (`project.groups`); "client" is
 * derived from the attribution line so a study can never be filed under a
 * client it does not name.
 */
export type NavigatorGroupId = WorkGroupId | 'client';

export const WORK_GROUPS: { id: NavigatorGroupId; label: string }[] = [
  { id: 'aem', label: 'AEM' },
  { id: 'systems', label: 'System Design' },
  { id: 'product', label: 'Product Design' },
  { id: 'client', label: 'Client' },
];

export const isNavigatorGroup = (value: string | null | undefined): value is NavigatorGroupId =>
  WORK_GROUPS.some((group) => group.id === value);

/**
 * What the work section can be filtered to. No selection is Featured, the
 * opening view; `all` is every study, featured first; the rest are the
 * navigator's groups.
 */
export type WorkFilter = NavigatorGroupId | 'all';

export const isWorkFilter = (value: string | null | undefined): value is WorkFilter =>
  value === 'all' || isNavigatorGroup(value);

/** The featured studies, in the order FEATURED lists them. */
export const featuredProjects = (): Project[] => {
  const listed = orderedProjects();
  return FEATURED.map((slug) => listed.find((project) => project.slug === slug)).filter((project): project is Project => Boolean(project));
};

/** Studies in a discipline, in WORK_ORDER. */
export const studiesInGroup = (id: WorkGroupId): Project[] =>
  orderedProjects().filter((project) => project.groups?.includes(id));

/**
 * Client keys are neutral on purpose. They end up in the URL hash and the
 * navigator's DOM, both readable before unlock, so the employer is "employer"
 * there and only the label (`clientGroupLabel`) decides whether to name it.
 */
export type ClientKey = 'employer' | 'heatherwood' | 'personal';

export const clientKeyFor = (project: Pick<Project, 'slug' | 'client'>): ClientKey => {
  if (project.client.startsWith('Tire Rack')) return 'employer';
  if (project.slug === 'heatherwood') return 'heatherwood';
  return 'personal';
};

export const isClientKey = (value: string | null | undefined): value is ClientKey =>
  value === 'employer' || value === 'heatherwood' || value === 'personal';

/** The heading a client sub-group shows; the employer stays anonymous while locked. */
export const clientGroupLabel = (key: ClientKey, locked: boolean): string => {
  if (key === 'personal') return 'Personal products';
  const sample = projects.find((project) => clientKeyFor(project) === key);
  if (!sample) return key;
  return locked && key === 'employer' ? ANON_CLIENT : clientLabelFor(sample, false);
};

/** Client sub-groups in first-appearance order of WORK_ORDER, each with its studies. */
export const clientGroups = (locked: boolean): { key: ClientKey; label: string; studies: Project[] }[] => {
  const groups = new Map<ClientKey, Project[]>();
  for (const project of orderedProjects()) {
    const key = clientKeyFor(project);
    groups.set(key, [...(groups.get(key) ?? []), project]);
  }
  return Array.from(groups.entries()).map(([key, studies]) => ({ key, label: clientGroupLabel(key, locked), studies }));
};

/**
 * The studies a selection resolves to. No selection is Featured; All opens on
 * the featured studies and continues in WORK_ORDER.
 */
export const studiesFor = (group: WorkFilter | null, clientKey: ClientKey | null): Project[] => {
  if (!group) return featuredProjects();
  if (group === 'all') {
    const featured = featuredProjects();
    return [...featured, ...orderedProjects().filter((project) => !featured.includes(project))];
  }
  if (group !== 'client') return studiesInGroup(group);
  const all = orderedProjects();
  return clientKey ? all.filter((project) => clientKeyFor(project) === clientKey) : all;
};
