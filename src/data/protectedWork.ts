// The studies behind the site's password: the professional stream in
// projects.ts, by slug, with the short name the password prompt uses for
// each ("WheelRack is password protected"). Kept here so the panel
// navigation (used on every page, the homepage included) can ask "is this
// protected?" without loading all the project data. protectedWork.test.ts
// keeps it in step with projects.ts.
export const PROTECTED_WORK_NAMES: Readonly<Record<string, string>> = {
  'figma-template-governance': 'Figma Template Governance',
  wheelrack: 'WheelRack',
  'tire-categories': 'Tire Category Redesign',
  'seasonal-content-system': 'Seasonal Content System',
  'landing-pages': 'AEM Landing Governance',
  'aem-component-system': 'AEM Component System',
  'design-enablement': 'Tools that scale design',
  'photography-workflow-agent': 'Photography Workflow Agent',
};

export const PROTECTED_WORK: ReadonlySet<string> = new Set(Object.keys(PROTECTED_WORK_NAMES));
