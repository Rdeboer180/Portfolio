/**
 * The homepage as AEM would address it: one entry per authorable section, in
 * page order. App.tsx spreads these onto <AuthoredSection>; the Side Panel's
 * Components tab and the annotation count read the same list, so the chrome
 * cannot drift from the page.
 */

export interface AuthorAnnotation {
  /** The decision, in the register of the site. Never a claim the docs do not make.
   *  Several entries render as separate paragraphs. */
  text: string | readonly string[];
  /** Where the decision is written down, so a reader can check it. */
  source: string;
  link?: { label: string; href: string };
}

export interface AuthoredComponentSpec {
  /** Resource type, written the way AEM addresses a component. */
  component: string;
  /** The section's human name, for the Components tab. */
  label: string;
  /** The in-page id the toolbar's Copy link points at. */
  anchor: string;
  /** Template-locked: outlined but not authorable. */
  locked?: boolean;
  /** Why it is locked, in the template's words. */
  policy?: string;
  /** The one honest secondary action a component toolbar can offer here. */
  related?: { label: string; href: string };
  annotation?: AuthorAnnotation;
}

export const AUTHORED_COMPONENTS = {
  playground: {
    component: 'rdeboer/components/work-playground',
    label: 'Case studies',
    anchor: 'projects',
    annotation: {
      text: 'This section sits on Cool Paper on purpose. Without that one ground change the page would open with four paper sections and no band for 5,000px.',
      source: 'DESIGN.md, the Ink-on-Paper Rule; September 2026 homepage cut',
    },
  },
  writing: {
    component: 'core/wcm/components/experiencefragment/v1',
    label: 'Writing from the work',
    anchor: 'writing',
    related: { label: 'Open the index', href: '/notes/' },
    annotation: {
      text: 'The three newest notes, read from the same list that builds the Notes index. Nothing here is chosen by hand, so the section cannot drift from the index.',
      source: 'SelectedWriting.tsx, NOTES_BY_DATE.slice(0, 3)',
    },
  },
  bio: {
    component: 'rdeboer/components/bio',
    label: 'Why me?',
    anchor: 'about',
    related: { label: 'Open note', href: '/notes/aem-meeting-authors-where-they-work/' },
    annotation: {
      text: 'The compact bio. Strengths left this page in September 2026 and became attribution on the About page, where each line belongs to a recommender rather than to me.',
      source: 'PRODUCT.md; ProcessStrengths on /about',
    },
  },
  process: {
    component: 'rdeboer/components/process-board',
    label: 'How I work',
    anchor: 'systems',
    related: { label: 'Open the public study', href: '/work/playdraft/' },
    annotation: {
      text: [
        'In AEM, this loop means core-component variants, template permissions, and Experience Fragments for A/B testing and geographic targeting with Adobe Target. I design the authoring and review workflows too, so the team knows what it can change and how to extend the system.',
        'The process is stated once, here. In September 2026 five competing accounts were reconciled to this four-beat loop. Five of the board nodes are deliberately identical paper cards; a pastel tint per category was considered and rejected.',
      ],
      source: 'Capabilities, AEM & content systems; PRODUCT.md, The Process, Stated Once; DESIGN.md, the No-Categorical-Palette Rule',
    },
  },
  recommendations: {
    component: 'rdeboer/components/recommendation-list',
    label: 'Peer recommendations',
    anchor: 'testimonials',
    locked: true,
    policy: 'Inherited from template: verbatim, no paraphrase',
    annotation: {
      text: 'Every quote is a verbatim excerpt from a written recommendation. Excerpts are direct selections, never paraphrase, which is why this component is locked in the template.',
      source: 'Testimonials.tsx, line 38',
    },
  },
  capabilities: {
    component: 'rdeboer/components/capability-list',
    label: 'Capabilities',
    anchor: 'mastery',
    related: { label: 'Open the Forge', href: '/talent-tree/' },
    annotation: {
      text: 'Product implementation separates Direct from Agent-assisted on purpose. HTML, Sass and AEM are hands-on. React and React Native builds are directed, reviewed, tested and released by me.',
      source: 'SkillMastery.tsx, the capability data',
    },
  },
  faq: {
    component: 'core/wcm/components/accordion/v1',
    label: 'FAQ',
    anchor: 'faq',
    annotation: {
      text: 'These are the questions that usually come up before the work starts. How this page was built moved to Page properties, because it describes the page rather than the person.',
      source: 'FAQ.tsx; Page properties, Built with and Authorship',
      link: { label: 'How this site works', href: '/notes/how-this-site-works/' },
    },
  },
} as const satisfies Record<string, AuthoredComponentSpec>;

export const AUTHORED_LIST: readonly AuthoredComponentSpec[] = Object.values(AUTHORED_COMPONENTS);

/** 1-based pin number in page order, or null when a section carries no annotation. */
export const annotationNumber = (component: string): number | null => {
  const annotated = AUTHORED_LIST.filter((spec) => spec.annotation);
  const index = annotated.findIndex((spec) => spec.component === component);
  return index === -1 ? null : index + 1;
};

export const ANNOTATION_COUNT = AUTHORED_LIST.filter((spec) => spec.annotation).length;
