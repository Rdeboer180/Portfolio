export interface ProjectMetric {
  value: string;
  label: string;
}

/**
 * The one full-bleed moment a study earns: the strongest artifact or the
 * headline metric set enormous, placed directly after the explanation that
 * earns it (between Approach and Outcome). Exactly one per study — a second
 * beat makes both ordinary. Everything else keeps the reading-column
 * discipline.
 *
 * Metric beats restate a number already in the public OutcomeMetrics, so they
 * survive the gate on locked studies. Image beats are media and stay behind it.
 */
export interface ProjectBeat {
  kind: 'metric' | 'image';
  /** Metric: the value, hedges intact — the beat inherits the study's honesty. */
  value?: string;
  label?: string;
  /** Metric: one line keeping the number honest (measurement window, scope). */
  context?: string;
  /** Image: full-bleed artifact. Must survive enlargement or it isn't the beat. */
  src?: string;
  alt?: string;
  caption?: string;
}

/** Discipline groups a study can belong to; the navigator adds "client" itself. */
export type WorkGroupId = 'aem' | 'systems' | 'product';

export interface ProjectImage {
  /**
   * A portfolio-owned drawing of this artifact, shown while the study is
   * locked. `src` (the artifact itself) renders only after unlock. Use it
   * where the artifact is employer work that cannot sit at a public URL.
   */
  publicSrc?: string;
  publicAlt?: string;
  publicCaption?: string;
  /**
   * Hold a full-page board inside a viewport the reader scrolls: a 3:2 browser
   * window or a phone bezel. Keeps a tall artboard at the column's width.
   */
  frame?: 'browser' | 'phone';
  /** Pixel coordinates into the original board; presentation only, original remains in the lightbox. */
  crop?: { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
  src?: string;
  /** Optimized crop of src for display; src still opens the untouched evidence. */
  displaySrc?: string;
  alt: string;
  layout: 'full' | 'half';
  caption?: string;
  mobile?: boolean;
  isOverlay?: boolean;
  overlayText?: string;
  // When true, src is treated as an inline video (muted autoplay loop, playsInline).
  // Used for short prototype clips. Poster falls back to the project's featured image
  // if not provided.
  isVideo?: boolean;
  videoPoster?: string;
  // Constrains the rendered image to a max pixel width and centers it.
  // Useful for small brand marks / app icons that shouldn't fill the column.
  maxWidth?: number;
}

export interface CodeBlock {
  code: string;
  language?: string;
  filename?: string;
  caption?: string;
}

export interface ApproachSubsection {
  key: string;
  /** A study told in parts: a part heading renders where this changes. */
  part?: string;
  label: string;
  description: string;
  images?: ProjectImage[];
  gridColumns?: 2 | 3 | 4;
  systemMarker?: string;
  codeBlock?: CodeBlock;
  /** Verbatim prompts from the real build sessions, paired with what each one
   *  settled. Rendered as a two-column list; the prompt keeps its own casing
   *  and typos on purpose — an edited prompt is not evidence. */
  promptRows?: { prompt: string; outcome: string }[];
  promptRowsCaption?: string;
  /** Optional list rendered after the description, for subsections that are an
   *  inventory rather than an argument. */
  bullets?: string[];
  variants?: { label: string; image: ProjectImage }[];
  /** Caption over the variant controls; defaults to the component-states line. */
  variantsCaption?: string;
  quote?: { text: string; name: string; role: string };
  libraryTour?: boolean;
}

export interface ProjectOverview {
  title: string;
  deck: string;
  ownership: string;
  status: string;
  category?: string;
  role?: string;
  opening?: ProjectImage;
  /** Project artifacts grouped beneath the overview introduction; available after unlock. */
  evidence?: ProjectImage[];
  relatedNote?: { href: string; label: string };
  decisions: {
    /** A part heading renders where this changes (see ApproachSubsection.part). */
    part?: string;
    title: string; body: string; bodyLink?: { text: string; to: string }; image?: ProjectImage; images?: ProjectImage[];
    /** A wide board shown full width after the media, outside the capped phone rows. */
    wide?: ProjectImage;
    /** Scrollable artboards (framed desktop and phone) shown side by side after the media. */
    artboards?: ProjectImage[];
    /** Short evidence list under the body, e.g. each fix beside what it replaced. */
    points?: string[];
    /** Code that proves the decision shipped, rendered after the media. */
    code?: CodeBlock;
    /** An attributed quote from the person on the other side of the decision. */
    quote?: { text: string; name: string; role: string };
  }[];
  outcome: string;
  /** The headline figure, shown with the outcome. Must already be public in metrics. */
  outcomeMetric?: { value: string; label?: string; context?: string };
  /** The shipped result, shown after the outcome paragraph. */
  outcomeImages?: ProjectImage[];
}

export interface Project {
  overview?: ProjectOverview;
  slug: string;
  client: string;
  /** Company or product background shown before the opening project summary. */
  context?: string;
  /** Anonymous background for the public opening of a protected study. */
  publicContext?: string;
  title: string;
  /** Descriptive, search-oriented title for the case-study page <title>/H1 and
   *  sitemap. Keeps the branded `title` while adding the searchable problem. */
  seoTitle?: string;
  summary?: string;
  /**
   * Homepage-card copy in the proof formula: the problem, then the shipped
   * thing and what it did. Falls back to `summary` where absent. Every claim
   * must already exist in the public (locked-state) study — the card may move
   * public information forward, never disclose new information.
   */
  cardHook?: string;
  /**
   * Short display title for homepage cards, where the full `title` runs three
   * lines. The study page keeps `title`; the card sentence (`cardHook`) and
   * metric carry what the long title was doing.
   */
  cardTitle?: string;
  /** One-sentence argument shown under the hero title, with a drawn underline. */
  thesis?: string;
  /** Short point-of-view asides shown in each section's margin (About-story style). */
  annotations?: {
    problem?: string;
    gaps?: string;
    constraints?: string;
    approach?: string;
    outcome?: string;
  };
  year: string;
  tags: string[];
  role: string;
  tools: string[];
  timeline: string;
  featured?: string;
  studyHero?: ProjectImage;
  /** Explicitly approved image that may render before unlock. */
  publicPreview?: ProjectImage;
  ownership?: string;
  compactStory?: boolean;
  // Optional muted looping cover video (compressed web loop); `featured` doubles
  // as its poster. Rendered on homepage playground cards when present.
  featuredVideo?: string;
  /** An explicit release state when the general stream label is too broad. */
  cardStatus?: string;
  // When true, the homepage playground card treats the cover loop as its
  // primary media — autoplay/loop/muted from mount, not hover-to-play.
  // Reduced motion still renders the poster still.
  featuredVideoPrimary?: boolean;
  /**
   * The colour the card's still or loop ends in along its bottom edge (the
   * mean of its bottom tenth, sampled from the poster), so the card's ground
   * can match it and the media fade into the ground instead of cutting to
   * paper where the folder tab's cutout exposes it. Re-sample when a poster
   * changes.
   */
  coverGround?: string;
  /** Reviewed cover footage explicitly approved for display before unlock. */
  featuredVideoPublic?: boolean;
  /** Case-study hero reel, distinct from the short homepage card loop. */
  featuredReel?: { src: string; poster: string; alt: string; caption?: string; captions?: string };
  /** A brand drawn in over the reel before it plays (BrandIntro). */
  reelIntro?: 't1d-hub';
  // Two-stream taxonomy: employer/client shipped work vs self-initiated builds.
  // Drives the [ SHIPPED ] / [ SELF-BUILT ] chips on cards + case-study heroes.
  stream?: 'professional' | 'passion';
  metrics: ProjectMetric[];
  /** See ProjectBeat — at most one per study, by design. */
  beat?: ProjectBeat;
  /**
   * The study opens on its cover schematic: locked visitors get the plate as
   * the featured frame (drawn, never absent), unlocked visitors watch it
   * resolve into the real hero media within 700ms of arrival — the card they
   * clicked becoming the frame that opens. Flagship-only until it earns more.
   */
  openerSchematic?: boolean;
  hidden?: boolean;
  /**
   * The disciplines the homepage navigator files this study under. Authored
   * rather than inferred from tags, because the tags were written as search
   * terms ("0 → 1 Product Design", "Design System" and "Design Systems" all
   * appear) and a grouping that drifts with copy edits is not a grouping.
   * "Client" is not listed here: it is derived from `clientLabelFor`.
   */
  groups?: WorkGroupId[];
  /**
   * The short client name the navigator shows, where `client` carries the
   * full attribution line. Tire Rack studies still anonymise while locked.
   */
  clientLabel?: string;
  timeToLive?: string;
  /** One note that carries the study forward, linked from the Outcome section. */
  relatedNote?: { href: string; label: string; lead?: string };
  /**
   * The approach as a locked visitor meets it: portfolio-owned drawings of the
   * gated boards (each image's `publicSrc`), under the Approach heading, ahead
   * of the lock panel. Every drawing must pass the cover-schematic rule: the
   * shape of the work, drawable from the public page alone.
   */
  publicPlan?: { lead: string; images: ProjectImage[] };

  // New 7-section structure
  problemPunch?: string;
  problem?: string[];
  problemImages?: ProjectImage[];
  gapsPunch?: string;
  gaps?: string[];
  gapsImages?: ProjectImage[];
  constraintsPunch?: string;
  constraints?: string[];
  constraintsImages?: ProjectImage[];
  approachSubsections?: ApproachSubsection[];
  outcomeNote?: string;
  /**
   * Rendered inside OutcomeMetrics beneath the results note, on both sides of
   * the password gate, through redactClient. Public on locked studies, so an
   * item may not add a partner name, an internal system or host, or any client
   * the redaction pattern does not cover.
   */
  takeaways?: string[];
  outcomeImages?: ProjectImage[];
  outcomeGridImages?: ProjectImage[];
  outcomeLiveLinks?: { label: string; url: string }[];
  // Optional heading over the live-links list (default: 'Select pages are live')
  outcomeLiveLinksLabel?: string;
  // Scan-to-install block in the outcome section. `qr` is a slug under
  // /images/qr/ generated by scripts/gen-qr.mjs; omit the whole object until
  // the target URL exists.
  outcomeInstall?: {
    label: string;   // mono eyebrow, e.g. 'Install on iPhone'
    url: string;     // the same destination the QR encodes
    linkText: string;
    caption: string; // what happens when they scan
    qr: string;      // slug: /images/qr/<slug>.svg
  };
  // Internal work with nothing public to link: named artifacts render as a
  // mono chip list where live links would otherwise go.
  outcomeArtifacts?: string[];
  insightCallout?: string;

  // Legacy approach steps (kept for other projects during transition)
  approachSteps?: { label: string; description: string }[];
  approachImages?: ProjectImage[];

  // Legacy fields (kept for backward compat during transition)
  brief?: string;
  challenge?: string;
  resultsNote?: string;
  approach?: string;
  process?: { label: string; description: string }[];
}

const TIRE_RACK_CONTEXT = 'Tire Rack is a national online retailer of tires, wheels, and automotive accessories. Its website combines shopping with tire testing, reviews, and buying guidance for drivers.';
const PUBLIC_RETAILER_CONTEXT = 'The client is a national US online tire and wheel retailer. Its website combines shopping with tire testing, reviews, and buying guidance for drivers.';

// Live component captures supplied in the October 7 field guide.
const liveComponent = (name: string, alt: string, caption: string): ProjectImage => ({
  src: `/images/work/aem-component-system/live-components/${name}.jpg`,
  alt, caption, layout: 'full',
});

// Boards from the October 2026 Figma component guide, rendered from the file
// with the project number and branch name removed. Shared by the full study
// and its compact edition so captions stay attached to the same artifact.
const componentGuide = (name: string, alt: string, caption: string): ProjectImage => ({
  src: `/images/work/aem-component-system/component-guide/${name}.jpg`,
  alt, caption, layout: 'full',
});
const GUIDE = {
  readMe: componentGuide('guide-read-me', 'Component guide read-me page with usage notes, AEM style steps, breakpoints, a status legend, the page index, and open items', 'The read-me page: how to use the guide, how to apply a style in AEM, breakpoints and key sizes, the status legend, and the open items.'),
  containers: componentGuide('containers-rules', 'Containers page with layout rules, the class each style option adds, and AEM style picker screengrabs', 'Containers: one layout style and an optional background. Nested containers drop their side padding, so gutters never stack.'),
  copyWidth: componentGuide('copy-width-rules', 'Copy Width page with alignment rules, class names, and AEM style picker screengrabs', 'Copy Width: a 900px column with its own alignment group. The recommended setup nests it inside a Fixed Width section.'),
  flex: componentGuide('flex-rules', 'Teaser and Flex page with column rules by screen width and number of children', 'Teaser + Flex: columns follow the screen width and the number of children, and Featured teasers line their links up across each row.'),
  table: componentGuide('table-gap', 'Table page documenting the tire size table as rendered today, marked Not in branch', 'Table: documented as rendered today and marked Not in branch, with a recommendation to move its rules under Tr Table.'),
  heroUpdates: componentGuide('hero-branch-updates', 'List of hero changes made in the branch, each with the behavior it replaced', 'Hero: each change in the branch, listed beside the behavior it replaced.'),
  teaserBeforeAfter: componentGuide('teaser-before-after', 'Featured teaser at 1024px before and after the branch, and stacked at 375px', 'Featured teaser at 1024px: the image pinned to the top before the branch, centered beside the copy after it, and stacked at 375px.'),
  buttons: componentGuide('buttons-states-arrow-link', 'Button states and the wrapping rules for the arrow text link', 'Button states, the narrow-column rule, and the orphaned arrow the no-break space prevents.'),
  heroAuthor: componentGuide('hero-author-primary', 'AEM editor reference with the hero selected, Styles open, numbered author steps, and the resulting classes', 'Author reference: the AEM editor at 1440px with Styles open, numbered steps, and the classes that result.'),
  heroPreview: componentGuide('hero-author-preview', 'Homepage hero preview at 1440px and 375px with the image crop held at 50 percent', 'What visitors see at 1440px and at 375px, with the crop held at 50%.'),
};


// Boards from the homepage exploration file (component concepts and the test
// plan behind each one). `src` is the board itself, rendered with stakeholder
// names, project numbers, and meeting notes removed, and shows only after
// unlock. `publicSrc` is a drawing of the same board in the site's own hand,
// shown while the study is locked; see ProjectImage.publicSrc.
const homepageBoard = (name: string, alt: string, caption: string, publicAlt: string, publicCaption: string, layout: 'full' | 'half' = 'full'): ProjectImage => ({
  src: `/images/work/aem-component-system/homepage-boards/${name}.jpg`,
  publicSrc: `/images/work/aem-component-system/homepage-plan/${name}.jpg`,
  alt, caption, publicAlt, publicCaption, layout,
});
const PLAN = {
  order: homepageBoard('component-order',
    'Three homepage concept pages side by side, each with a different treatment of the sections below the hero',
    'Three concept pages side by side: a category carousel under the hero, a three-step How It Works with the video center, and a version with the pledge. From the exploration file.',
    'Drawing of the homepage section order, the current page beside the proposed one, with moved and removed sections marked',
    'Section order, current beside proposed. Promotions move up and shrink, How It Works becomes tabs, and low-engagement sections leave. Drawn from the exploration file.'),
  tests: homepageBoard('test-plan',
    'Test plan board with the talking points for each change, the design changes, the removals, and the plan forward',
    'The test plan: talking points for each change, the design changes, the removals with their reasons, and the plan forward. Names removed.',
    'Drawing of the test plan: two hypotheses, a fifteen-topic survey, and the sequence of tests on one timeline',
    'The test plan, drawn: a hypothesis for the How It Works order and one for the promotions carousel, a fifteen-topic customer survey, and the tests each has to wait for.'),
  explorations: homepageBoard('concept-b',
    'Homepage concept page with a three-step How It Works and the video center',
    'One of the concept pages: a three-step How It Works, the video center, and the ratings link.',
    'Drawing of the exploration passes side by side, each with the sections it changed marked',
    'The explorations, drawn: three concept pages, then one section in focus at a time, then the refined page. Each pass changed one or two sections and kept the rest.'),
  endState: homepageBoard('end-state',
    'Refined homepage at desktop width, with the vehicle selector open, and at phone width',
    'The refined homepage at desktop, with the vehicle selector open, and at phone width. Every section is an existing component or a style option the guide defines or names as open. From the reDesign file.',
    'Drawing of the refined homepage at desktop and phone widths with each section labelled by its component',
    'The refined homepage, drawn at desktop and phone widths with each section labelled by the component or style option it uses.'),
};
PLAN.explorations.publicSrc = '/images/work/aem-component-system/homepage-plan/explorations.jpg';

// Gated only: the testing notes, the concept pages, the section-focus boards, and the refined UI.
const board = (name: string, alt: string, caption: string, layout: 'full' | 'half' = 'full', frame?: ProjectImage['frame']): ProjectImage => ({
  src: `/images/work/aem-component-system/homepage-boards/${name}.jpg`, alt, caption, layout, frame,
});
const NOTES = {
  howItWorks: board('test-notes-how-it-works', 'Test card for the How It Works section: the goal and the hypothesis', 'How It Works: gauge which questions customers want answered before shopping. The hypothesis, with names removed.', 'half'),
  promo: board('test-notes-promo', 'Test card for the promotions carousel: the hypothesis, the sales-day evidence, and the data to request', 'Promotions carousel: test its size and location. The hypothesis, the sales-day evidence, and the data to request. Names and competitor references removed.', 'half'),
  survey: board('test-notes-survey', 'Survey card with the fifteen topics and the two questions', 'The survey: fifteen topics customers choose from, then three questions a How It Works section should answer.', 'half'),
  topics: board('test-notes-topics', 'Talking-points card listing the six trust topics to test', 'Which topics and components build trust before a purchase: the six candidates put to the team. Names removed.', 'half'),
};
const EXPLORE = {
  conceptA: board('concept-a', 'Concept page with a category carousel under the hero and the deals tabs', 'Concept A: a category carousel under the hero, the deals lane, and the tabbed How It Works.', 'full', 'browser'),
  conceptB: board('concept-b', 'Concept page with a three-step How It Works and the video center', 'Concept B: a three-step How It Works, the video center, and the ratings link.', 'full', 'browser'),
  conceptC: board('concept-c', 'Concept page with the pledge section', 'Concept C: the pledge in place of the 40-years section.', 'full', 'browser'),
  focusNewTires: board('focus-new-tires', 'Homepage board with the When is it time for new tires section in focus', 'In focus: when is it time for new tires, with links into the tire categories.', 'full', 'browser'),
  focusBrands: board('focus-brands', 'Homepage board with the Shop by brands section in focus', 'In focus: shop by brands you can trust.', 'full', 'browser'),
  focusTestTrack: board('focus-test-track', 'Homepage board with the test track section in focus', 'In focus: our test track.', 'full', 'browser'),
  focusReviews: board('focus-reviews', 'Homepage board with the customer reviews section in focus', 'In focus: why customers love us, with verified reviews.', 'full', 'browser'),
  focusPledge: board('focus-pledge', 'Homepage board with the pledge section in focus', 'In focus: the pledge, reusing the deals structure.', 'full', 'browser'),
  focusArticles: board('focus-articles', 'Homepage board with the most-read articles section in focus', 'In focus: drive smarter, the most-read articles.', 'full', 'browser'),
};
const FOCUS = {
  conceptA: board('concept-a-focus', 'The new-tires section as Concept A drew it, with a two-line headline and three link groups', 'Concept A: the new-tires section as first drawn.', 'half'),
  newTires: board('focus-new-tires-crop', 'The same section refined: one headline and three short link groups, with the rest of the page dimmed', 'In focus: the same section, refined, with links into the tire categories.', 'half'),
};
const REFINED = {
  desktop: board('refined-desktop', 'Refined homepage at desktop width', 'The refined homepage at desktop width. From the reDesign file.', 'full', 'browser'),
  selectorOpen: board('refined-selector-open', 'Refined homepage with the vehicle selector open to the make list', 'With the vehicle selector open to the make list.', 'half', 'browser'),
  phone: board('refined-phone', 'Refined homepage at phone width', 'At phone width: the selector collapses to its input, tabs keep their labels, and rows stack.', 'half', 'phone'),
};

const projects: Project[] = [
  {
    slug: 'figma-template-governance',
    coverGround: '#f2efe8',
    client: 'Tire Rack · Design & UX',
    context: 'Tire Rack is a national online tire and wheel retailer. Its Web and UX designers use Figma for design and Workfront for project tracking and approvals.',
    publicContext: 'A national US online tire and wheel retailer, with project tracking and approvals in Workfront.',
    stream: 'professional',
    groups: ['systems'],
    clientLabel: 'Tire Rack',
    title: 'Figma Design & UX: Starter Template Governance and Plugin Development',
    cardTitle: 'Figma starter template & governance',
    seoTitle: 'Figma Design & UX Governance: Starter Templates and Four Internal Plugins',
    summary: 'I built a shared Figma starter template and four internal plugins with agent assistance for a team of 15+ Web and UX designers. Together, they carry the project brief through design, proofing, and handoff.',
    cardHook: 'A shared starter template and four internal plugins for a team of 15+ Web and UX designers, from project setup through handoff.',
    thesis: 'A shared starting point. A clearer handoff.',
    year: '2026',
    role: 'Design & UX Workflow Design · Figma Template Governance · Agent-Assisted Plugin Development',
    ownership: 'I designed the template and plugin workflows, built the tools with agent assistance, and worked with the lead PM on the metadata export.',
    tools: ['Figma', 'Claude', 'Workfront'],
    tags: ['Design Governance', 'Figma Plugins', 'UX Workflows', 'Agent-Assisted Build'],
    timeline: 'Ongoing internal initiative',
    cardStatus: '[ Internal tools published ]',
    featured: '/images/work/figma-template-governance/plugin-suite.png',
    publicPreview: { src: '/images/work/figma-template-governance/plugin-suite.png', alt: 'Four internal Figma plugins: Project Checklist, Proof Assist, Title Card Generator, and Layer Cleanup', layout: 'half', maxWidth: 360, caption: 'The four tools, published to the team’s Figma workspace.' },
    featuredVideo: '/assets/portfolio-safe/figma-template-governance/plugin-quicklook.mp4',
    featuredVideoPrimary: true,
    featuredVideoPublic: true,
    featuredReel: {
      src: '/assets/portfolio-safe/figma-template-governance/plugin-quicklook.mp4',
      poster: '/assets/portfolio-safe/figma-template-governance/plugin-quicklook-poster.jpg',
      alt: 'Quick tour of four internal Figma plugins using original screenshots and footage',
      caption: '16-second tour using original screenshots and footage. Layer Cleanup is shown in the published tools list.',
    },
    metrics: [
      { value: '4', label: 'Internal Figma plugins built with agent assistance' },
      { value: '15+', label: 'Web and UX designers the shared template and tools are built for' },
    ],
    problemPunch: 'A reviewer should not have to reconstruct the project from the file.',
    problem: [
      'Project context lived in Workfront while the design evolved in Figma. Reviewers needed a consistent way to find the brief, inspect the proof, and see what was ready for handoff.',
      'I moved proof preparation from Figma Slides into the working design file, where the team was already comfortable.',
    ],
    gapsPunch: 'Put the guidance beside the work.',
    gaps: ['A starter template sets the structure. The plugins help keep the project cover, proof snapshots, layer names, and handoff checklist current.'],
    constraintsPunch: 'Designers control what is ready for review.',
    constraints: [
      'Proof snapshots update on an explicit refresh, so ongoing edits cannot silently change an approved proof.',
      'The edit uses original footage and screenshots. Team adoption and time savings have not yet been measured.',
    ],
    insightCallout: 'The file should help the next person understand the work without needing its original designer in the room.',
    approachSubsections: [
      {
        key: 'shared-template',
        label: 'Give Design and UX one starting structure',
        description: 'The starter gives Web and UX designers shared pages for project context, research, working designs, proofs, local components, and an archive. Short guides explain what belongs where.',
      },
      {
        key: 'project-context',
        label: 'Project Title Card Generator: bring the brief into the file',
        description: 'The Title Card Generator imports a Workfront CSV or accepts manual input. It fills the cover with the project goal, identifier, status, and links so reviewers can find the brief without leaving the file.',
      },
      {
        key: 'proof-assist',
        label: 'Proof Assist: link review evidence to its source',
        description: 'Proof Assist links snapshot slots to source frames. Designers choose the frame, adjust its fit, and refresh the proof when it is ready for review.',
        images: [{ src: '/images/work/figma-template-governance/proof-template.png', alt: 'Original proof template showing desktop and mobile design snapshots', layout: 'full', caption: 'Original project capture.' }],
      },
      {
        key: 'layer-cleanup',
        label: 'Layer Cleanup: make the working file legible',
        description: 'Layer Cleanup applies naming conventions using the layer type and surrounding frame as context, helping another designer pick up the file.',
      },
      {
        key: 'project-checklist',
        label: 'Project Checklist: make completion and exceptions explicit',
        description: 'Project Checklist saves progress with the file and exports a completion report, including notes about skipped steps, for senior review.',
        images: [{ src: '/images/work/figma-template-governance/actual-checklist-frame.jpg', alt: 'Project Checklist open in the original Figma recording', layout: 'full', caption: 'Original project capture.' }],
      },
    ],
    timeToLive: 'Internally published. Team rollout is ongoing.',
    outcomeNote: 'Four plugins are published internally for a team of 15+ Web and UX designers. The next step is testing the workflow with teammates through setup, review, and handoff.',
    outcomeArtifacts: ['Shared Design & UX starter template', 'Project Title Card Generator', 'Proof Assist', 'Layer Cleanup', 'Project Checklist'],
    overview: {
      title: 'Figma Template Governance',
      category: 'Professional work',
      status: 'Internally published · Governance and rollout ongoing',
      deck: 'A shared Figma starter and four internal plugins for a team of 15+ Web and UX designers.',
      ownership: 'I designed the template and workflows, built the plugins with agent assistance, and partnered with the lead PM on project metadata.',
      evidence: [
        { src: '/images/work/figma-template-governance/starter-template-cover.png', alt: 'Original Figma starter-template cover with the Project Info Card, plugin instructions, and supporting links', layout: 'full', caption: 'The starter-template cover keeps the brief, guide, and project links together.' },
        { src: '/images/work/figma-template-governance/plugin-suite.png', alt: 'Four internal Figma plugins: Project Checklist, Proof Assist, Title Card Generator, and Layer Cleanup', layout: 'half', caption: 'Four tools published to the team’s Figma workspace.' },
      ],
      decisions: [
        { title: 'Put the project context where the work starts', body: 'A standard cover imports exported project metadata and links back to the master project. The starter file gives UX and Design a shared structure with guidance beside the work.' },
        { title: 'Keep proof preparation with the design', body: 'Linked snapshot slots bring source frames into review boards. Designers control refreshes, preserving the reviewed version while the working frames continue to change.', image: { src: '/images/work/figma-template-governance/proof-template.png', alt: 'Original proof template with desktop and mobile snapshots', layout: 'full', caption: 'Proofs use shared layouts and explicit snapshot refreshes.' } },
        { title: 'Make handoff readiness explainable', body: 'Layer Cleanup supports file naming. Project Checklist saves progress and exports completion notes for senior review, including explanations for skipped steps.', image: { src: '/images/work/figma-template-governance/actual-checklist-frame.jpg', alt: 'Project Checklist in the original working Figma file', layout: 'full' } },
      ],
      outcome: 'Four plugins are published internally for a team of 15+ Web and UX designers. Team rollout is ongoing; adoption and time savings are not yet measured.',
    },
  },
  // =============================================
  // 0. WheelRack — Design System & Customer Journey  [image LEFT]
  // =============================================
  {
    slug: 'wheelrack',
    coverGround: '#f2f2f2',
    stream: 'professional',
    // Product Design, not System Design: the design system is the means and
    // the 0-to-1 dealer product is the outcome, and it is the strongest
    // product study after PlayDraft. A study sits in one of the two, never
    // both, so the chips swap in different work.
    groups: ['product'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack · WheelRack',
    context: 'Tire Rack is a national online tire and wheel retailer serving drivers and retail partners. WheelRack is its dealer-facing platform for finding wheels, checking vehicle fitment, and placing orders.',
    publicContext: 'The client is a national US online tire and wheel retailer serving drivers and retail partners. WheelRack is its dealer-facing platform for finding wheels, checking vehicle fitment, and placing orders.',
    title: 'WheelRack: A complete design system and dealer product',
    cardTitle: 'WheelRack: Design system to full product',
    seoTitle: 'WheelRack: Enterprise React Design System for a Wholesale Ecommerce Platform',
    thesis: 'Shared rules for the details that make wheel fitment complicated.',
    summary: 'I built WheelRack’s complete design system and designed the full dealer product, from vehicle search through checkout. I defined tokens, components, responsive behavior, and edge cases, partnering with engineering on the React and Storybook implementation across six retail partners.',
    ownership: 'I owned the complete design system, product design, and behavior specifications. Cheryl Carpenter owned the React build; we worked together on implementation and review.',
    cardHook: 'I built the full design system, partnered with engineering on React and Storybook, and designed the complete dealer product, edge cases included.',
    compactStory: true,
    annotations: {
      problem: 'Dealers were already on tablets. The interface had to catch up.',
      approach: 'The difficult states belong in the system, too.',
      outcome: 'The framework outlived the project. Wholesale picked it up next.',
    },
    openerSchematic: true,
    year: '2023 to 2024 design · 2026 launch',
    tags: ['Product Design', 'Design Systems', 'Responsive', 'Storybook'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'Tokens Studio', 'Storybook', 'HTML/CSS'],
    timeline: '~4 months dedicated across 12+ months, including API delays',
    featured: '/images/work/wheelrack/CS_thumbnail_wheelrack_designSystem_safe.jpg',
    featuredVideo: '/images/work/wheelrack/wheelrack-system-to-product.mp4',
    studyHero: {
      src: '/images/work/wheelrack/evidence/fitment-states.png',
      alt: 'WheelRack dealer interface with wheel filters, vehicle preview, and separate front and rear wheel configurations',
      layout: 'full',
      crop: { x: 158, y: 190, width: 1367, height: 1575, sourceWidth: 6466, sourceHeight: 7179 },
      caption: 'The dealer view brings filters, a vehicle preview, and front/rear purchasing options into one responsive experience. Design artifact.',
    },
    timeToLive: 'Launched June 4, 2026. The system and partner brand builds are complete; rollout continues across additional retailers.',
    problemPunch: 'A dealer interface built for six different partners.',
    problem: [
      'Dealers used the roughly 20-year-old wheel visualizer on tablets, but the interface was not responsive. Six retail partners carried different versions of the experience, without shared tokens or components.',
      'The redesign had to accommodate partner branding and purchasing rules while proving that the new React and microservices stack could support the full journey.',
    ],
    approachSubsections: [
      {
        key: 'journey',
        label: 'Define the journey around dealer tasks',
        description: 'With the UX design manager and stakeholders, I mapped vehicle selection, search results, product details, and checkout. I kept the visualizer separate from purchasing information and documented autocomplete, responsive behavior, and errors in the wireframes. Those rules gave the team a shared starting point for each screen.',
        libraryTour: true,
      },
      {
        key: 'foundation',
        label: 'Give repeated controls the same rules',
        systemMarker: 'Shared foundation',
        description: 'I defined color, spacing, typography, and shadow tokens, then built the controls and larger components from them. The original work used Tokens Studio before Figma Variables. The same token vocabulary carried into Storybook and React; each component’s states and responsive behavior still needed to be specified.',
        images: [{
          src: '/images/work/wheelrack/evidence/filter-states.png',
          alt: 'Filter component specifications showing resting, hover, and keyboard-focus states',
          layout: 'full',
          crop: { x: 120, y: 335, width: 1860, height: 455, sourceWidth: 3604, sourceHeight: 5185 },
          caption: 'Filter controls share explicit resting, hover, and focus states. The rules apply across the filter categories below them.',
        }],
      },
      {
        key: 'fitment',
        label: 'Resolve fitment inside the product component',
        systemMarker: 'Component behavior',
        description: 'A wheel model could carry several finishes and sizes, and front and rear configurations could differ on the same vehicle. I designed variants for those combinations, partner-specific cart or quote actions, and availability warnings. The purchasing component had to account for each case before it could be reused across the journey.',
        variants: [
          {
            label: 'Front / rear',
            image: {
              src: '/images/work/wheelrack/evidence/product-variants.png',
              alt: 'Product component with separate front and rear size selections, quantities, and a combined add-to-cart total',
              layout: 'full',
              crop: { x: 80, y: 1650, width: 850, height: 485, sourceWidth: 6901, sourceHeight: 9906 },
              caption: 'Separate front and rear selections feed a shared total and purchase action.',
            },
          },
          {
            label: 'Get quote',
            image: {
              src: '/images/work/wheelrack/evidence/product-variants.png',
              alt: 'Front and rear product component using the Get Quote action',
              layout: 'full',
              crop: { x: 3690, y: 1650, width: 850, height: 485, sourceWidth: 6901, sourceHeight: 9906 },
              caption: 'The quote variant keeps the configuration structure while changing the partner’s purchasing action.',
            },
          },
          {
            label: 'Unavailable combination',
            image: {
              src: '/images/work/wheelrack/evidence/fitment-states.png',
              alt: 'Front and rear wheel configuration with an availability warning beneath the purchase action',
              layout: 'full',
              crop: { x: 2600, y: 1060, width: 955, height: 565, sourceWidth: 6466, sourceHeight: 7179 },
              caption: 'The warning explains that the selected finish/fitment combination is unavailable and the closest alternative has been selected.',
            },
          },
        ],
      },
      {
        key: 'documentation',
        label: 'Make the rules usable by engineering',
        systemMarker: 'Design + engineering',
        description: 'Cheryl and I worked together daily through Slack threads and calls. I supplied behavior specifications for complex components; she owned the React implementation and stress-tested behavior across viewports. The form documentation shown here makes the intended input sizes, icon placements, and focus, error, and disabled states explicit.',
        images: [{
          src: '/images/work/wheelrack/evidence/form-documentation.png',
          alt: 'Form input documentation showing two sizes, icon placements, and placeholder, active, focus, error, and disabled states',
          layout: 'full',
          crop: { x: 458, y: 1428, width: 1120, height: 550, sourceWidth: 2100, sourceHeight: 3569 },
          caption: 'Form library reference: two input sizes with consistent icon placement and interaction states.',
        }],
        quote: {
          text: 'That gave us one vocabulary to work from instead of two, and it made my half of the work a lot easier to do well.',
          name: 'Cheryl Carpenter',
          role: 'React Front-End Developer · WheelRack build partner',
        },
      },
      {
        key: 'reconciliation',
        label: 'Check the build and feed corrections back',
        systemMarker: 'Implementation review',
        description: 'A shared vocabulary did not remove the reconciliation work. I spent 40+ hours comparing the React build against Figma, reviewing token names, responsive behavior, and component fidelity screen by screen. Weekly stakeholder reviews kept decisions moving as the work progressed.',
        images: [{
          src: '/images/work/wheelrack/supporting/outcome/wheelrack-final-desktop-01.png',
          alt: 'WheelRack interface with numbered callouts mapped to written behavior specifications',
          layout: 'full',
          caption: 'Numbered callouts connect the interface to the behavior specifications used by engineering.',
        }],
      },
    ],
    outcomeNote: 'WheelRack is live from vehicle selection through checkout. Six months after the build, Tire Rack extended the framework into Wholesale, and I helped additional designers join that workflow. Partner adoption grew from six to ten during the build; that growth also reflects business factors beyond the redesign.',
    takeaways: [
      'I would plan the design/build comparison into the work from the start. Tokens gave us common names, but we still had to check how the components behaved on screen.',
      'Working with Cheryl on React web components and Storybook sharpened my understanding of props, states, and reuse. That vocabulary helped prepare me to explore React Native, while learning what needed to change for a native app.',
    ],
    outcomeLiveLinks: [
      { label: 'Explore the live WheelRack experience', url: 'https://wheelrack.com/pitstop/search' },
    ],
    relatedNote: { href: '/notes/prototyping-wheelrack-fitment/', label: 'The state WheelRack’s frames could not show', lead: 'The closest-alternative state, rebuilt as a code prototype:' },
    outcomeLiveLinksLabel: 'Live product',
    metrics: [
      { value: 'Wholesale', label: 'Framework reused 6 months after the build' },
      { value: '200+', label: 'Design tokens' },
      { value: '50+', label: 'Storybook-integrated components' },
      { value: '6 → 10', label: 'Partners during the build; multiple contributing factors' },
    ],
  },

  // =============================================
  // 1. Tire Rack — Tire Category Redesign  [image RIGHT]
  // =============================================
  {
    slug: 'tire-categories',
    coverGround: '#f5f5f5',
    context: TIRE_RACK_CONTEXT,
    publicContext: PUBLIC_RETAILER_CONTEXT,
    thesis: 'Turn 40 confusing categories into choices people can actually make.',
    annotations: {
      problem: 'Too many choices, too much text. People could not decide.',
      gaps: 'No visual language existed yet. I had to build the system and the vocabulary.',
      constraints: '40+ categories, 80+ products each, SEO fighting usability.',
      approach: 'Balancing data with intuition: eight core icons, not ninety.',
      outcome: 'Category entry jumped, and the icon system went sitewide.',
    },
    stream: 'professional',
    groups: ['aem', 'product'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack',
    title: 'Tire Category Page Redesign & Optimizations',
    cardTitle: 'Tire Category Redesign: Path to the right tire',
    seoTitle: 'Automotive Ecommerce Category UX Redesign: +400% Category Entry',
    summary: 'I rebuilt 30+ tire category pages around one icon, comparison, and content system. In the first month, top-performing pages saw up to a 50% conversion lift.',
    cardHook: 'Choosing tires takes expertise most shoppers do not have. 30+ category pages were rebuilt into one guided system. Top pages lifted conversion up to +50% in the first month.',
    beat: {
      kind: 'metric',
      value: 'Up to +400%',
      label: 'Category entry growth',
      context: "Natural-search entries to category pages, compared with the month before launch.",
    },
    year: '2024',
    tags: ['UX/UI Design', 'Wireframing', 'Component Design', 'Modular Design', 'SEO Optimization', 'Icon System Implementation'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'FigJam', 'HTML/CSS', 'Adobe Creative Suite'],
    timeline: '2 months',
    featured: '/images/work/tire-categories/CS_thumbnail_TireCategories_safe.jpg',
    featuredVideo: '/assets/portfolio-safe/tire-categories/cover-loop.mp4',
    timeToLive: '~2 months from brief to system launch across 30+ category pages',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: "Make tire-performance tradeoffs useful to everyday shoppers.",
    problem: [
  "The category pages had to explain what a tire's strengths meant for someone's driving. I could not assume a visitor from search already understood the terms our testing team used.",
  "The experience was dense, inconsistent, and almost entirely verbal. More than 40 categories, many with 80 or more products, had no shared way to show how one choice differed from another.",
  "I needed to translate that knowledge into a comparison someone could use, even if this was the first Tire Rack page they had seen."
],
    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No visual language existed. Design had to define both the system and the vocabulary.',
    gaps: [
      'There was no visual framework for comparing category strengths.',
      'The system had to make each category distinct without inventing a different design for all 40.',
      'Search content needed real space on the page, but it could not bury the product decision.',
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: '40+ categories. 80+ products each. SEO requirements competing with usability.',
    constraints: [
      '40+ unique category variations needed consistent treatment.',
      'Often 80 or more tires per category, and the page still had to stay readable.',
      'SEO content requirements had to coexist with clean, scannable design.',
      'No photography direction existed for category-specific imagery.',
      'Performance data had to be sourced, validated, and visualized for each category.',
    ],

    insightCallout: 'Pushed back on 90 one-off icons in favor of a scalable system: 8 primary icons for broad strengths, 24 supporting icons for specific category distinctions. This framework now governs a 100+ icon sprite library used across the site.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Keep search depth without burying the choice',
        description: "Ransom Rockliffe owned SEO, with requirements for search visibility and detailed content. My priority was making that information useful to a shopper. We worked through the hierarchy together so search depth could stay on the page without burying the comparison.",
        images: [],
      },
      {
        key: 'structure',
        label: "Give a search visitor the essentials first",
        description: "I moved the performance comparison forward and summarized each category in three essential takeaways. Those points had to work for someone arriving directly from search, without the context of the pages leading up to it. The product list and supporting content followed the same hierarchy across categories.",
        images: [
          {
            alt: 'Placeholder for omitted internal wireframe artifact',
            layout: 'full',
            caption: 'Wireframes available on request.',
            isOverlay: true,
            overlayText: "This part of the work includes internal tooling and workflows I cannot share publicly. I am happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'system',
        label: 'An icon system, and a chart that works without motion',
        description: "Primary icons show broad strengths; supporting icons distinguish categories. Photography had to explain the driving conditions each tire type suits, so I worked with our photographer on image selection, locations and shoots. The CSS performance chart includes reduced-motion behavior, a text fallback and screen-reader labels.",
        images: [
          {
            src: '/images/work/tire-categories/primaryHome+icons_safe.png',
            alt: 'Annotated category-page proof: mobile layouts with numbered callouts mapped to UI Behavior specs for icons, performance averages, and the category modal',
            layout: 'full',
            caption: 'The annotated proof: category layouts with numbered callouts mapped to written UI behavior specs',
          },
        ],
      },
      {
        key: 'build',
        label: 'I contributed the chart motion, icons, and shared styles',
        description: 'I worked with engineering on reusable AEM components with author-controlled performance data, then contributed the page structure, CSS chart motion, SVG icons, and shared styles.',
        systemMarker: 'Codebase',
        images: [],
      },
      {
        key: 'iteration',
        label: 'Content teams now change the data without an engineer',
        description: 'The pattern reached 30+ pages. Content teams can now update category copy and performance data in AEM without waiting for an engineer.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: "In the first month, Performance All-Season and Performance Summer reached up to a 50% purchase-conversion lift against the month before launch. Niche categories gained 30 to 40% in the same window. We tracked natural-search entries, on-page engagement and whether visitors entering through a category page went on to buy. These are page-level results over that comparison window.",
    takeaways: [
      'I pushed back on 90 one-off icons. Two tiers shipped instead, 8 primary and 24 supporting, and the tiers held as the library passed 100.',
      'The performance chart animates, but it does not depend on motion: reduced-motion support, a text fallback, and screen-reader labels shipped with it.',
      'Performance data is author-controlled, so a category update no longer waits on an engineer.',
      'Search content got real space on the category pages, but never ahead of the comparison and the product list.',
    ],
    outcomeImages: [
      {
        src: '/images/work/tire-categories/supporting/outcome/in-page-application.png',
        alt: 'Category detail page showing performance bar charts, product grid, and icon system in context',
        layout: 'full',
        caption: 'Category page in context: performance data, icon system, and product discovery working together',
      },
      {
        src: '/images/work/tire-categories/winter_m_safe.png',
        alt: 'Winter tire category page on mobile showing responsive layout with performance data and product listings',
        layout: 'full',
        caption: 'Mobile category experience: responsive layout maintaining full functionality',
        mobile: true,
      },
    ],
    metrics: [
      { value: 'Up to +50%', label: 'Conversion lift, top pages (first month)' },
      { value: 'Up to +400%', label: "Organic category-entry growth vs. month prior" },
      { value: '32 \u2192 100+', label: 'Icons scaled into a governed sitewide sprite library' },
    ],
    outcomeLiveLinks: [
      { label: 'High Performance Summer (live CSS chart)', url: 'https://www.tirerack.com/tires/summer/high-performance' },
    ],
  },

  // =============================================
  // Bolus Binder — diabetes-aware recipe keeper + T1D Hub identity  [passion]
  // App captures lead; the separate clinic identity
  // remains supporting evidence. TestFlight and seeded demo data stay explicit.
  // =============================================
  {
    slug: 'bolus-binder',
    coverGround: '#ecf1f6',
    client: 'Bolus Binder (personal product) · T1D Hub (Dr. Brian Huber’s Type 1 practice)',
    context: 'T1D Hub is the Type 1 diabetes practice Dr. Brian Huber is building, and in partnership with Brian I oversee its brand: the logo, the design system behind it, and the site, where I work directly with his marketing team. Bolus Binder is the companion app that carries that system into the kitchen, so a patient can see how a meal or recipe is likely to metabolize before they cook it.',
    title: 'T1D Hub & Bolus Binder: A clinic brand system, carried into a companion app',
    cardTitle: 'T1D Hub: Brand system to Bolus Binder',
    cardHook: 'I built the T1D Hub brand with Dr. Brian Huber’s practice, then carried its system into Bolus Binder, a React Native companion app that keeps portions, nutrition and estimated absorption close to the food.',
    cardStatus: '[ In TestFlight ]',
    seoTitle: 'T1D Hub brand identity and design system, carried into Bolus Binder, a React Native companion app',
    summary:
      'This study has two parts. The first is T1D Hub, the brand identity and design system I built with Dr. Brian Huber for his Type 1 practice, from the logo to the site his marketing team runs. The second is Bolus Binder, a React Native companion app on the same system, where scaling a recipe moves its nutrition and estimated absorption with it. A controlled diabetic already reads a CGM trace every day, so both use the trace and the colors they already know.',
    reelIntro: 't1d-hub',
    thesis: 'The clinic’s colors mean the same thing in the kitchen.',
    year: '2026',
    tags: ['Product Design', 'Mobile (iOS)', 'Brand Identity', 'Brand System', 'Design System', 'Health Data', 'React Native'],
    role: 'Brand Lead (T1D Hub) · Product Design · Design System · Agent-Assisted Build (React Native)',
    tools: ['Figma', 'Illustrator', 'React Native', 'Expo', 'Claude', 'VS Code'],
    timeline: 'T1D Hub brand live July 2026 · Bolus Binder April → August 2026, in TestFlight',
    stream: 'passion',
    groups: ['product'],
    clientLabel: 'T1D Hub · Personal product',
    featured: '/images/work/bolus-binder/bolus-binder-app-preview-poster.jpg',
    featuredVideo: '/images/work/bolus-binder/bolus-binder-app-preview.mp4?v=2',
    featuredReel: {
      src: '/images/work/bolus-binder/bolus-binder-app-preview.mp4?v=2',
      poster: '/images/work/bolus-binder/bolus-binder-app-preview-poster.jpg',
      alt: 'Bolus Binder recipe library, recipe detail, nutrition, recipe folders, meal planning, and cook mode',
      caption: 'A sequence of simulator stills with seeded demo data, captured in August 2026. Not an interaction recording.',
    },
    timeToLive:
      'T1D Hub mark and design system by June 2026, the clinic site live in July 2026, Bolus Binder in TestFlight since August.',
    metrics: [
      { value: 'React Native + Expo', label: 'Agent-assisted iOS build · Running in TestFlight' },
      { value: '1 → 2', label: 'One system, two experiences · The T1D Hub clinic brand and the Bolus Binder companion app' },
      { value: '1.5×', label: 'Portion-aware nutrition · Macros and the absorption estimate rescale with the serving' },
      { value: '12', label: 'Color tokens carrying clinical semantics · In range, above range, urgent low' },
      { value: 'July 2026', label: 'T1D Hub brand live · Logo, design system and site, with the practice’s marketing team' },
    ],

    problemPunch: 'Cooking and nutrition context belong together.',
    problem: [
  "Living with Type 1 diabetes, I wanted the recipe to come first. I wanted space to make and enjoy a meal, then keep the portions and nutrition context available when I returned to it.",
  "The people T1D Hub serves already read a CGM trace every day, and they know what a controlled day looks like on it. A companion app from the practice had to look and behave like the devices and the clinic they already trust, with the recipe still in charge.",
],

    gapsPunch: 'A portion change should update the whole recipe.',
    gaps: [
      'Changing the portion needed to update ingredients and nutrition together. Saved recipes, versions, and cooking history also needed to remain useful when I returned to a meal.',
      'The brand had to work in two places at once: on the clinic site Brian’s marketing team runs, and inside an app that shows how a meal is likely to metabolize. Without one system, the two would drift apart.',
],

    constraintsPunch: 'Describe behavior, never prescribe a dose.',
    constraints: [
      'The app presents nutrition context, estimates, and cooking history. It never tells anyone how much insulin to take, and the copy holds that line.',
      'The trace, the in-range green and the alert red mean the same thing in the app as on a CGM. Nothing in the interface uses those three colors for decoration, so when one appears, it is about glucose.',
    ],

    approachSubsections: [
      {
        key: 'brand',
        part: 'Part 1 · T1D Hub brand identity & design system',
        label: 'A real brand, built to be used',
        systemMarker: 'BRAND',
        description:
          'Brian is a close friend, and I have been a Type 1 for most of my life, so the practice did not get a designer looking at a healthcare brief. It got a patient. I drew the T1D Hub mark around the one line a Type 1 reads every day: a CGM trace runs through the wordmark, entering at the T and holding the name together, and it has to stay connected in every configuration. Around the mark I built the foundations the practice could run without me: the logo system, the palette, the type, and the rules written beside each one. Those are what Brian’s marketing team works from on the site, and what I review with them when a page goes up.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-mark.png',
            alt: 'T1D Hub wordmark: T1D set in navy, HUB in sky blue, with a CGM trace line and data points running through the letterforms.',
            layout: 'half',
            maxWidth: 420,
            caption: 'The CGM trace connects through the wordmark. It is the one rule the mark cannot lose.',
          },
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-logo-system.png',
            alt: 'T1D Hub logo system page showing primary and reversed lockups alongside five usage rules.',
            layout: 'half',
            caption: 'Four approved configurations, with the constraints written next to them, so the marketing team can place the mark without asking.',
          },
        ],
      },
      {
        key: 'system',
        part: 'Part 1 · T1D Hub brand identity & design system',
        label: 'A design system the practice can extend',
        systemMarker: 'DESIGN SYSTEM',
        description:
          'T1D Hub Design System v1.0 went to Brian in June 2026 as a working website. It is built from the logo’s two-tone foundation: deep navy for stability, sky blue for hope and for data. Twelve color tokens carry clinical meaning, so green is in range, amber is above and red is an urgent low, the same colors a patient already trusts on a CGM. Four gradients stand for stages of the Type 1 journey. Sora carries the headings, Inter the body, and JetBrains Mono is reserved for numbers, so a glucose figure never reads as prose. The system also covers buttons, badges, inputs, alerts, cards and navigation, plus a CGM chart language with a time-in-range summary. Its motion rules keep things calm: entrances take 350ms, the CGM trace draws in 1000ms, and micro-interactions take 150ms. It closes on the brand in context: the website, an office wall, conference slides and business cards.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-color-system.png',
            alt: 'T1D Hub color system: twelve tokens across navy, sky, neutral and alert families, plus four gradients.',
            layout: 'half',
            caption: 'Alert red, amber and green carry clinical meaning, so they are never used decoratively, on the site or in the app.',
          },
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-type-system.png',
            alt: 'T1D Hub type system: Sora ExtraBold for display, Inter for body, JetBrains Mono for glucose readings.',
            layout: 'half',
            caption: 'Mono is reserved for data, so a glucose number never reads as body copy.',
          },
        ],
      },
      {
        key: 'vision',
        part: 'Part 1 · T1D Hub brand identity & design system',
        label: 'A vision handoff, so the next team extends the brand',
        systemMarker: 'HANDOFF',
        description:
          'Alongside the logo files and the web assets, I wrote Brian a future-vision handoff for whoever builds next, his marketing team or an agency: a diabetes patient portal and education platform. It starts with an onboarding questionnaire that places someone by their diabetes type, tools, A1C range and goals, then leads to a personalized dashboard, an education library organized as courses, and a community space. Its first instruction is to build on the existing logo and design system rather than redesign the brand. One of its pillars, nutrition and metabolic response, is where Bolus Binder comes in.',
      },
      {
        key: 'product',
        part: 'Part 2 · Bolus Binder, the companion app',
        label: 'Cooking first, diabetes context second',
        systemMarker: 'PRODUCT',
        description:
          'The recipe comes first. Scale a serving and the ingredients, the net carbs, protein and fat, and the estimated absorption pattern move together, so a patient can see how the meal is likely to metabolize before they cook it. Recipes keep their ingredients, steps and saved versions; cooking events go to a separate log, so planning and cooking never erase the recipe. The absorption curve is labelled as an estimate. It is not an observed CGM reading and never a dose; reviewing observed glucose patterns belongs to LoopStack, a separate app.',
        gridColumns: 3,
        images: [
          {
            src: '/images/work/bolus-binder/app/04-recipe-detail-hero.png',
            alt: 'Bolus Binder recipe detail with the photo, the serving control and the nutrition rings',
            layout: 'half',
            crop: { x: 0, y: 150, width: 1206, height: 1650, sourceWidth: 1206, sourceHeight: 2622 },
            caption: 'The recipe, with its serving control and nutrition rings. Simulator capture, demo data.',
          },
          {
            src: '/images/work/bolus-binder/app/06-recipe-detail-collapsed.png',
            alt: 'Collapsed recipe header keeps the scaled portion and nutrition totals visible',
            layout: 'half',
            crop: { x: 0, y: 150, width: 1206, height: 1650, sourceWidth: 1206, sourceHeight: 2622 },
            caption: 'Scale the portion and the totals follow it through the steps.',
          },
          {
            src: '/images/work/bolus-binder/app/07-nutrition-expected-response.png',
            alt: 'Nutrition view marks its absorption pattern as Estimated',
            layout: 'half',
            crop: { x: 0, y: 1220, width: 1206, height: 1350, sourceWidth: 1206, sourceHeight: 2622 },
            caption: 'The two-wave absorption estimate, labelled as an estimate.',
          },
        ],
      },
      {
        key: 'build',
        part: 'Part 2 · Bolus Binder, the companion app',
        label: 'The same system, carried into TestFlight',
        systemMarker: 'BUILD',
        description:
          'Bolus Binder runs on the T1D Hub system itself: the same tokens, the same clinical color meanings, the same type roles and component rules, so a patient moving from the clinic’s site to the app never has to relearn what green means. The foundations were drawn in Figma and taken into React Native with Expo through an agent-assisted build: I set the system, described each screen against it, reviewed the working states, and refined the interface where the build drifted from the tokens or the hierarchy. The result is a working app in TestFlight that people can cook with.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/bolus-binder/app/01-recipes-home.png',
            alt: 'Bolus Binder recipe library on the T1D Hub system',
            layout: 'half',
            crop: { x: 0, y: 150, width: 1206, height: 1650, sourceWidth: 1206, sourceHeight: 2622 },
            caption: 'The library, on the clinic’s type and color system.',
          },
          {
            src: '/images/work/bolus-binder/app/16-cook-mode.png',
            alt: 'Bolus Binder cook mode, one step at a time',
            layout: 'half',
            crop: { x: 0, y: 150, width: 1206, height: 1650, sourceWidth: 1206, sourceHeight: 2622 },
            caption: 'Cook mode, the state reviewed most often during the build.',
          },
        ],
      },
    ],

    outcomeNote:
      'The T1D Hub brand is live on the practice’s site, authored by Brian’s marketing team from the system and reviewed with me. The Bolus Binder companion app is in TestFlight. The simulator captures show implemented flows with demo data, not measured health outcomes or evidence of clinical adoption. Observed glucose integration remains future work.',
    outcomeImages: [
      {
        src: '/images/work/bolus-binder/supporting/outcome/t1dhub-cgm-visual-language.png',
        alt: 'CGM visual language: a 24-hour glucose trace with in-range, above and below bands, beside a Time In Range summary.',
        layout: 'full',
        caption: 'The chart language the brand and the app share with the CGM a patient already reads: green in range, amber above, red urgent low.',
      },
    ],
    outcomeInstall: {
      label: 'Scan to install on iPhone',
      url: 'https://testflight.apple.com/join/YSyjkS3k',
      linkText: 'testflight.apple.com/join/YSyjkS3k',
      caption: 'Opens TestFlight and installs the current build.',
      qr: 'bolus-binder-testflight',
    },
    outcomeLiveLinks: [{ label: 'Try the TestFlight build', url: 'https://testflight.apple.com/join/YSyjkS3k' }],
  },
  // =============================================
  // 2. Tire Rack — AEM Seasonal Content Strategy  [image LEFT]
  // =============================================
  {
    slug: 'seasonal-content-system',
    coverGround: '#f4f4f5',
    context: TIRE_RACK_CONTEXT,
    publicContext: PUBLIC_RETAILER_CONTEXT,
    thesis: 'Documented well enough that someone else can run the season.',
    annotations: {
      problem: 'Manual seasonal updates, and everyone saw the same content.',
      gaps: 'No way to serve different regions without duplicating pages.',
      constraints: 'Google must not see duplicate pages. The content still has to change.',
      approach: 'Twenty swappable fragments, targeted by audience.',
      outcome: 'A decade in, two junior designers author it under my governance.',
    },
    stream: 'professional',
    groups: ['aem'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack',
    title: 'Seasonal Content Swap: AEM Experience Fragments & Adobe Target',
    cardTitle: 'Seasonal content, without rebuilds',
    seoTitle: 'Seasonal Ecommerce Content System: AEM Experience Fragments & Adobe Target',
    summary: 'I built and still govern reusable AEM Experience Fragments for A/B testing and geographic targeting with Adobe Target. More than 20 seasonal fragments serve six landing pages, supported by documented authoring rules, junior-designer onboarding, and final review.',
    cardHook: 'Reusable AEM Experience Fragments support A/B testing and geographic targeting with Adobe Target. Authors update 20+ seasonal fragments across six pages within a shared review workflow.',
    beat: {
      kind: 'image',
      src: '/images/work/seasonal-content-system/supporting/outcome/winter-homepage-desktop.png',
      alt: 'Winterized homepage with seasonal hero, editorial blocks, and category grid',
      caption: 'The full winter swap. Every above-the-fold section (hero, editorial blocks, category grid) replaced through authoring, with no development involved.',
    },
    year: '2013\u2013Present',
    tags: ['AEM', 'Content Strategy', 'SEO', 'Photography Direction', 'CMS', 'Component Design', 'Modular Design', 'Adobe Target'],
    role: 'Senior Web Designer / AEM Content Strategist',
    tools: ['Adobe Experience Manager', 'Adobe Target', 'Figma', 'HTML/SCSS', 'Adobe Creative Suite'],
    timeline: '10+ years',
    featured: '/images/work/seasonal-content-system/CS_thumbnail_AEM_Winterization_safe.jpg',
    // The intro reel (scripts/seasonal-reel, render-seasonal-reel.mjs): the
    // live winter pages on 23 Oct 2026 against the Internet Archive's
    // non-winter copies of the same URLs. Not public before unlock.
    featuredReel: {
      src: '/images/work/seasonal-content-system/seasonal-swap-reel.mp4',
      poster: '/images/work/seasonal-content-system/seasonal-swap-reel-poster.jpg',
      alt: 'The Tire Rack homepage, tires and packages pages on a season timeline: a frost line winterizes each page, the swapped fragments are named, then each page splits to show the non-winter version southern states see beside the winter version for winter climates.',
      caption: 'Winter pages captured live on 23 October 2026; non-winter pages from the Internet Archive (homepage 2 August 2026, tires 11 July 2026, packages 6 August 2025). The archive kept no tires hero image, so that pair starts at the headline.',
    },
    timeToLive: '10+ years of continuous ownership. Deployed seasonally each fall, with same-day content swaps.',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Manual seasonal updates. No scalable system. Winter and southern-states customers seeing the same content.',
    problem: [
  "The seasonal program gets customers thinking about winter tires in September and October, before the first snowfall. That preparation shapes the homepage, tire pages, delivery, research and wheel-fitment content.",
  "Early swaps were manual. As the site grew, rebuilding pages every season became slow, while serving different text on the same URLs complicated search visibility."
],
    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No fragment library, no audience targeting, no way to serve different content to different regions without page duplication.',
    gaps: [
      'The same page needed to speak differently to winter-climate and southern-state customers.',
      'AEM needed new fragment types and accessible variants; Adobe Target needed a dependable audience split.',
      'Analytics, Photography, and SEO each owned part of the result, so the system had to make those dependencies visible.',
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Google must not see duplicate pages. Analytics needs audience segmentation. Photography needs seasonal imagery on a schedule.',
    constraints: [
      'Google had to treat winter and southern-states variants consistently, not as duplicate pages.',
      'Audience segmentation currently runs as a geo-based split with two segmented audiences via Adobe Target, coordinated with the Analytics team.',
      'Shaped the annual Sweden winter-shoot wishlist alongside Tire Rack\u2019s tire-testing trips. The brief for composition and tone drew on marketing goals, AI-generated reference imagery, and design-system needs.',
      'System needed to be documented clearly enough for two junior designers to author seasonally alongside me, with my oversight on approvals, governance, and design-system alignment.',
      'When breaks happen, they are usually tied to Experience Fragment / Adobe Target sync issues. Those get resolved through coordinated fixes across authoring, analytics, and targeting.',
    ],
    insightCallout: 'The page stays put while the authored fragments change. That one decision made seasonal swaps faster, kept regional targeting out of duplicated URLs, and gave junior designers a system they could run.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Four teams with a stake in one page',
        systemMarker: 'Team',
        description: 'Coordinated across Analytics (audience segmentation rules), Photography (seasonal shoots I directed), SEO (variant indexing strategy), and junior designers (authoring onboarding).',
        images: [],
      },
      {
        key: 'structure',
        label: 'Trace a section to its fragment and Target experience',
        description: "I mapped the seasonal sections in Figma to named Experience Fragments in AEM and their Adobe Target experiences. That map lets us trace an incorrect regional placement back to its content or targeting configuration.",
        images: [
          {
            alt: 'Placeholder for omitted internal documentation artifact',
            layout: 'full',
            caption: 'Internal documentation available on request.',
            isOverlay: true,
            overlayText: "This part of the work includes internal tooling and workflows I cannot share publicly. I am happy to walk through it in detail.",
          },
        ],
      },
      {
        key: 'system',
        label: 'Five fragment types, authored in AEM without a developer',
        description: 'Built reusable fragment types: Hero, Teaser, Entertainment, Video Center, Category Bar. Each with content fields, link behavior, and CTA configuration authored directly in AEM.',
        images: [
          {
            src: '/images/work/seasonal-content-system/winter-aem-hero-detail_blurred.png',
            alt: 'AEM Experience Fragment library: winter, non-winter, and A/B test variants organized by component type',
            layout: 'full',
            caption: 'The fragment library: winter, non-winter, and A/B variants organized for same-day swaps',
          },
        ],
      },
      {
        key: 'build',
        label: 'Written down, then taught to the people authoring it',
        description: 'Authored, tested, and deployed seasonal content directly in AEM. Documented the system in Confluence and mentored junior designers through the authoring workflow.',
        systemMarker: 'Documentation',
        images: [],
      },
      {
        key: 'iteration',
        label: "Keep the season visible while the page text stays consistent",
        systemMarker: 'Governance',
        description: "In 2018, I reduced swaps to the highest-traffic surfaces. Later, natural-search traffic to seasonally swapped pages declined over successive years. After reviewing that trend with SEO, we moved toward visual seasonal changes in 2025 and 2026 while keeping text consistent on the same URLs. We swap imagery or change content order for seasonal and geographic audiences, with SEO reviewing the annual refresh.",
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'Geo-based audiences run through Adobe Target. Winter conversion has generally been stronger since the seasonal program began, although product, marketing, and weather all contribute to that result. Two junior designers now author the swaps using my documentation and approval workflow. I still own the system rules, the final review, and the fixes when AEM and Target fall out of sync.',
    takeaways: [
  "Declining natural-search traffic led us to review seasonal content with SEO. We shifted toward visual changes while keeping the text consistent across variants.",
  "In 2018, I reduced the program to the highest-traffic surfaces.",
  "When Experience Fragments and Adobe Target fall out of sync, authoring, analytics and targeting work through the fix together."
],
    outcomeImages: [
      {
        src: '/images/work/seasonal-content-system/supporting/outcome/winter-homepage-desktop.png',
        alt: 'Winterized homepage with seasonal hero, editorial blocks, and category grid',
        layout: 'full',
        caption: 'Winterized homepage: full Experience Fragment swap across all above-the-fold sections',
      },
    ],
    metrics: [
      { value: '20+', label: 'Experience Fragment components swapped' },
      { value: '6', label: 'High-traffic landing pages governed' },
      { value: '10+', label: 'Years of system governance + documentation' },
      { value: '2', label: 'Junior designers authoring under my oversight' },
    ],
  },

  // =============================================
  // 3. Heatherwood Equestrian Academy  [image RIGHT]
  // =============================================
  {
    slug: 'heatherwood',
    coverGround: '#f5f5f5',
    thesis: 'A brand and a site the owner could actually run herself.',
    annotations: {
      problem: 'Interest was there. The path to inquiry was not.',
      gaps: 'The brand had to come out of a phone-image dump.',
      constraints: 'No retainer after launch, so nothing could depend on me.',
      approach: 'More than ten front doors, one set of rules.',
      outcome: 'Inquiries went from a few a month to a few a day.',
    },
    stream: 'passion',
    groups: [],
    clientLabel: 'Heatherwood Equestrian Academy',
    client: 'Heatherwood Equestrian Academy',
    context: 'Heatherwood Equestrian Academy is a riding academy serving the South Bend, Indiana area. It offers horseback riding lessons, camps, boarding, and activities for families.',
    title: 'Heatherwood: A Brand and Site the Owner Can Run Herself',
    cardTitle: 'Heatherwood: Built for its owner',
    seoTitle: 'Brand Identity & WordPress Site for a Local Equestrian Academy',
    summary: 'I rebuilt Heatherwood’s identity and WordPress site around the services families actually search for. In the weeks after launch, website inquiries moved from roughly three or four a month to four or five a day.',
    cardHook: 'A new identity and WordPress site for a riding academy, built around the services families search for and simple enough for the owner to update herself.',
    year: '2025',
    tags: ['Brand Design', 'Web', 'SEO', 'CMS'],
    role: 'Brand & Web Designer',
    tools: ['Figma', 'WordPress', 'Elementor', 'WPForms', 'Yoast SEO', 'Adobe Illustrator'],
    timeline: '4 months',
    featured: '/images/work/heatherwood/CS_thumbnail_Heatherwood_safe.jpg',
    featuredVideo: '/assets/portfolio-safe/heatherwood/cover-loop.mp4',
    timeToLive: '~4 months from first meeting to full brand + site launch',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'An outdated brand and a website that was not converting. After more than twelve years, the site no longer matched the program.',
    problem: [
      'The program had grown, but the site still felt pieced together and gave families no clear path from interest to inquiry.',
      'Families search for a specific activity ("horseback riding lessons South Bend"), not the brand name.',
      'The owner needed to manage the site herself after launch, without an agency retainer.',
    ],
    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'An aging identity up against polished commercial programs, with none of the SEO or conversion infrastructure to compete.',
    gaps: [
      'The identity needed to feel as warm and personal as the academy while holding its own beside larger commercial programs.',
      'Every headline had to work for both the parent and the search engine.',
    ],
    gapsImages: [
      {
        src: '/images/work/heatherwood/supporting/opportunity/heatherwood-notes-01.png',
        alt: 'Brand identity applied to roadside signage with QR code for mobile conversion',
        layout: 'full',
        caption: 'Brand collateral: extending the identity into physical touchpoints',
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Non-technical owner. Real photography needed. Every page doubles as a search entry point.',
    constraints: [
      'Owner has no technical background. The CMS had to be fully self-manageable.',
      'Each service (lessons, camps, boarding, birthday parties, trail rides) needed its own page with an SEO-targeted headline, a contact form, and FAQ content.',
      'Budget required WordPress with Elementor. No custom dev.',
      'Photography had to feel authentic to the family environment, not stock.',
    ],

    insightCallout: 'Each service page was designed as its own landing page with a contact form sidebar. Families arrive searching for a specific activity, not the brand name.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'What makes families choose it, in the founder’s words',
        description: 'I worked with founder Deborah Clements to understand why families choose Heatherwood, what parents of children ages five to fifteen need to know, and where the academy differs from commercial programs.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Every service is its own front door',
        description: 'Each service became its own search entry point with a page, parent questions, and a dedicated contact form. Visitors can arrive on the exact activity they searched for without reconstructing the site first.',
        images: [],
      },
      {
        key: 'system',
        label: 'One identity, reused across more than ten pages',
        description: 'I redesigned the logo, color, and typography, then carried those rules into service cards, FAQ accordions, and contact-form sidebars.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-02.png',
            alt: 'Services and Experiences page with card grid of all 10 offerings',
            layout: 'half',
            caption: 'Services hub: 10 SEO entry points with consistent card patterns',
          },
          {
            src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-03.png',
            alt: 'Riding Lessons service page with SEO copy and contact form sidebar',
            layout: 'half',
            caption: 'Service landing page: dedicated contact form on every page',
          },
        ],
      },
      {
        key: 'build',
        label: 'Built on tools the owner could keep after I left',
        description: 'Built on WordPress with Elementor, WPForms for contact routing, and Yoast SEO for on-page optimization. Configured caching, analytics, and form notifications for the owner.',
        images: [],
      },
      {
        key: 'iteration',
        label: 'Handing it over is the last design decision',
        systemMarker: 'Team',
        description: 'Trained the owner to manage content updates independently.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'Deborah still manages the WordPress content herself. Website inquiries moved from roughly three or four a month before launch to four or five a day in the weeks after. Those are rough counts from the form submissions in the WordPress inbox, comparing the weeks before launch with the weeks after, not a filtered report. That change belongs to the brand, the site structure, the search work, and the easier inquiry path together, not to any one screen.',
    takeaways: [
      'The site had to run without me, so training the owner was part of the build. She adds services and checks form submissions and SEO scores herself.',
      'One headline for two readers: the parent scanning the page and the search engine indexing it.',
      'An identity can start from a phone-image dump. The work was choosing what belonged, then carrying those choices across more than ten pages.',
    ],
    outcomeImages: [
      {
        src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-01.png',
        alt: 'Homepage hero with SEO-targeted headline and primary inquiry CTA',
        layout: 'full',
        caption: 'Homepage: SEO-targeted headline with primary inquiry CTA',
      },
      {
        src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-mobile-01.png',
        alt: 'Mobile homepage with service cards and enrollment CTA',
        layout: 'full',
        caption: 'Mobile experience: service cards and enrollment flow',
        mobile: true,
      },
    ],
    metrics: [
      { value: '~3\u20134/mo \u2192 4\u20135/day', label: 'Inquiry volume, pre vs. post launch' },
      { value: '10+', label: 'SEO-targeted service landing pages' },
      { value: 'Owner-managed', label: 'No agency dependency post-handoff' },
    ],
  },
  // =============================================
  // 4. Tire Rack — AEM Landing Page System  [image LEFT]
  // =============================================
  {
    slug: 'landing-pages',
    coverGround: '#f2f2f2',
    context: TIRE_RACK_CONTEXT,
    publicContext: PUBLIC_RETAILER_CONTEXT,
    thesis: 'Make landing pages a system, not a fire drill.',
    annotations: {
      problem: 'Every landing page started from scratch. No templates, no patterns.',
      gaps: 'The same decisions, remade on every request.',
      constraints: 'Thin briefs, two audiences, AEM’s limits, and speed as the expectation.',
      approach: 'Invest in the system, and speed stops costing quality.',
      outcome: 'Complex pages take one to two weeks instead of about a month.',
    },
    stream: 'professional',
    groups: ['aem', 'systems'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack',
    title: 'AEM Landing Page System & SEO Template Framework',
    cardTitle: 'AEM: A governed landing-page system',
    seoTitle: 'AEM Landing-Page & SEO Template System for Ecommerce',
    summary: 'I designed 50+ landing pages, then built reusable AEM templates with authoring rules and template permissions. Two junior designers now use the system under my review, with complex pages moving from about a month to 1\u20132 weeks.',
    cardHook: 'Reusable AEM templates, authoring rules, and template permissions help junior designers ship. Complex pages moved from about a month to 1\u20132 weeks.',
    year: '2023\u2013Present',
    tags: ['UX/UI Design', 'Front-End Development', 'CMS'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'HTML/CSS', 'Adobe Creative Suite', 'ChatGPT'],
    timeline: 'Ongoing (50+ landing pages)',
    featured: '/images/work/landing-pages/CS_thumbnail_landing-pages_safe.jpg',
    featuredVideo: '/assets/portfolio-safe/landing-pages/cover-loop.mp4',
    timeToLive: '~1 month \u2192 1\u20132 weeks for complex pages, 1 week for standard, 1\u20132 days for simple launches.',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Every landing page started from scratch. No templates, no patterns, no scalable process.',
    problem: [
      'Tire Rack uses landing pages to answer high-intent searches for tire sizes, categories, and narrow product needs.',
      'SEO and partner teams needed those pages quickly, but every request still started from an empty Figma file and a thin brief.',
      'After enough one-off pages, the design problem became obvious: stop solving the same layout and authoring decisions again.',
    ],
    problemImages: [
      {
        alt: 'Placeholder for omitted content-brief artifact',
        layout: 'full',
        caption: 'Content / SEO brief available on request.',
        isOverlay: true,
        overlayText: "This part of the work includes internal tooling and workflows I cannot share publicly. I am happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No reusable templates. No component strategy. Speed and quality treated as tradeoffs.',
    gaps: [
  "There was no shared pattern library. Each page needed a fresh layout and cross-team coordination.",
  "An optimized heading and metadata did not settle which product benefits or answers the page should lead with."
],
    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Minimal briefs. Two audiences (users + search engines). AEM component limitations. Speed is the expectation.',
    constraints: [
  "Pages need to answer a shopper's question while supporting search discovery.",
  "SEO briefs established headings, metadata and target keywords; design still had to decide how to organize the answer.",
  "AEM components have specific authoring fields and template constraints.",
  "SEO, analytics and merchandising teams all contribute to structure and content."
],

    insightCallout: 'Templates carry the layout and authoring decisions, so a fast page is not a rushed page. QA finds fewer than one issue per page on average.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'The search intent decides the order of the page',
        description: "SEO requirements were part of the brief: the H1, metadata and keywords reflected where the customer was in the shopping journey. I used that starting point to order product evidence, supporting copy and FAQs around the questions the page needed to answer.",
        images: [liveComponent('accordion-shipping', 'Shipping FAQ accordion', 'Shared AEM component on a live page. Capture, October 7, 2026.')],
      },
      {
        key: 'structure',
        label: 'Assembled from patterns, not drawn from scratch',
        description: 'In Figma, I assemble the page from reusable hero, product, FAQ, promotion, and link patterns. The structure stays recognizable while the content and emphasis change with the query.',
        images: [liveComponent('teaser-lighting', 'Lighting page Teaser cards', 'Shared AEM component on a live page. Capture, October 7, 2026.')],
      },
      {
        key: 'system',
        label: 'The recurring shapes became governed templates',
        description: "I turned recurring page layouts into templates for size, category, promotion and product launches. Pages are moving onto the shared AEM core component foundation, so the same authoring rules carry through different content needs.",
        images: [liveComponent('hero-suspension', 'Suspension category Hero Teaser', 'Shared AEM component on a live page. Capture, October 7, 2026.')],
      },
      {
        key: 'iteration',
        label: "Make new needs reusable, with room for a scoped exception",
        systemMarker: 'Governance',
        description: "I favor a new component variant when a product or client need extends an existing pattern. If content does not fit the available components, an HTML markup component can still support an on-brand exploration within the template. I govern component updates and adjust review depth to the risk.",
        bullets: [
          'High-impact pages, meaning the homepage, major category pages, and high-traffic surfaces: senior review, then SEO, analytics, and QA.',
          'Lower-risk pages: senior review, publish, validate live.',
          'A structure the template does not support: a formal project request, so the system grows on purpose instead of through one-off exceptions.',
        ],
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'I designed and built more than 50 pages before turning the recurring decisions into templates. Two junior designers use them now. Complex pages take one or two weeks instead of about a month, standard pages about a week, and simple launches a day or two. SEO reporting tied one new 40-inch tire page to more than $10,000 in annual revenue. There was no earlier page to compare against, so I treat that as evidence of new reach, not a clean design-attribution claim.',
    takeaways: [
  "SEO supplies the heading, metadata and keyword intent. I organize the page around the questions that brought the customer there.",
  "A new content need can become a reusable component variant. HTML markup components remain available for work that does not fit the current patterns."
],
    outcomeImages: [
      {
        src: '/images/work/landing-pages/supporting/landing-pages-35-inch.jpg',
        alt: '35-Inch Tires landing page: SEO-driven content built from reusable component system',
        layout: 'full',
        caption: '35-Inch Tires: SEO-driven page built from the reusable template system',
      },
    ],
    outcomeGridImages: [
      {
        src: '/images/work/landing-pages/supporting/landing-pages-classic-tires.jpg',
        alt: 'Classic Car Tires category landing page with brand carousel',
        layout: 'half',
        caption: 'Classic Car Tires',
      },
      {
        src: '/images/work/landing-pages/supporting/landing-pages-full-page-layouts.jpg',
        alt: 'Full-page layouts showing size table, promotions, and product recommendations',
        layout: 'half',
        caption: 'Full Page Layouts',
      },
      {
        src: '/images/work/landing-pages/supporting/landing-pages-product-mobile.jpg',
        alt: 'Product page mobile views with video, specs, and FAQ sections',
        layout: 'half',
        caption: 'Mobile Variations',
      },
    ],
    outcomeLiveLinks: [
      { label: '35-Inch Tires', url: 'https://www.tirerack.com/tires/35-inch' },
      { label: 'All-Weather Tires', url: 'https://www.tirerack.com/tires/all-weather' },
      { label: 'Black Friday Deals', url: 'https://www.tirerack.com/deals/black-friday' },
      { label: 'G-Force Phenom', url: 'https://www.tirerack.com/landing-page/product/g-forcePhenom' },
    ],
    metrics: [
      { value: '50+', label: 'Landing pages personally designed' },
      { value: 'Weeks \u2192 Days', label: 'Turnaround via governed template system' },
      { value: '<1', label: 'QA issues per page on average' },
    ],
  },

  // =============================================
  // 5. AEM Component System  [image RIGHT]
  // =============================================
  {
    slug: 'aem-component-system',
    coverGround: '#fbfbfb',
    context: TIRE_RACK_CONTEXT,
    publicContext: PUBLIC_RETAILER_CONTEXT,
    thesis: 'One component crosses Figma, the AEM editor, and the Sass branch, and the rule holds on all three.',
    annotations: {
      problem: 'Three surfaces, three descriptions of one component.',
      gaps: 'Option names are not results.',
      constraints: 'Two release paths, and AEM’s own Style System.',
      approach: 'Drawn in Figma, measured in AEM, fixed in Sass, tested on the page.',
      outcome: 'In branch, with the next options drawn and their tests written.',
    },
    stream: 'professional',
    groups: ['aem', 'systems'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack',
    title: 'AEM Component System',
    cardTitle: 'AEM Component System',
    seoTitle: 'AEM Component System: Figma Exploration, Author Rules, and Production Sass',
    summary: 'I carry one component across three surfaces: the Figma file where an idea is drawn and given a test, the AEM editor where an author selects it, and the Sass branch where its rule ships. A seven-page Figma guide keeps the rules, the classes, and the edge cases together, and a homepage exploration file holds the next options with a test plan behind each one.',
    cardHook: 'Authors could pick style options with no defined result. One component now moves from Figma through the AEM editor to the Sass branch, with its rule, its class, and a picture of what to select kept together.',
    year: '2024–2026',
    tags: ['Design Systems', 'AEM', 'Component Governance', 'UX Engineering', 'Sass', 'Figma'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'Figma MCP', 'Sass', 'HTML/CSS', 'Git'],
    timeline: 'Rebuild ~12 months · CSS overhaul ongoing · Homepage exploration ongoing',
    featured: '/images/work/aem-component-system/CS_thumbnail_AEM_componentSystemRebuild_safe.jpg',
    featuredVideo: '/assets/portfolio-safe/aem-component-system/cover-loop.mp4',
    relatedNote: { href: '/notes/the-line-between-figma-and-the-codebase/', label: 'The line between Figma and the AEM codebase is getting thinner', lead: 'Where this is going' },
    beat: {
      kind: 'image',
      src: '/images/work/aem-component-system/homepage-boards/end-state.jpg',
      alt: 'The refined homepage at desktop width, with the vehicle selector open, and at phone width',
      caption: 'The refined homepage, where the research came back to the components: desktop, the vehicle selector open, and phone. From the reDesign file, with internal notes removed.',
    },
    publicPlan: {
      lead: 'The process, drawn in the portfolio’s own hand: how the homepage concepts were ordered, tested, explored section by section, and refined into one page. The boards themselves, from the exploration file, the reDesign file, and the component guide, open with the password.',
      images: [PLAN.order, PLAN.tests, PLAN.explorations, PLAN.endState],
    },
    timeToLive: 'The core components went live after a 12-month rebuild. The CSS overhaul that followed is in a working branch, with the remaining steps to release written down in the guide. The homepage exploration continues in Figma, each concept with its test written before it is built.',

    // ── 01 Problem ──
    problemPunch: 'A style option in the AEM picker, a frame in Figma, and a rule in Sass described the same component three ways, and none of them showed an author the result at each width.',
    problem: [
      'The core components from our 2024–2025 rebuild were live, but parts of the shared CSS still carried older behavior, and a few options did not hold up at phone widths.',
      'The style picker offered choices with nothing behind them: some options had no CSS, and some could not be combined with others.',
      'Tire size tables took their look from CSS pasted into each page.',
    ],
    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'The style picker lists option names, and the Sass holds the rules. Designers plan pages in Figma, where neither one shows up.',
    gaps: [
      'An author choosing Copy Width with Left alignment cannot see from the picker that, placed directly on the page, its copy starts at 109px at 1920 instead of lining up with Fixed Width at 312px.',
      'Breakpoints, the 1296px content max, the 900px copy max, and the page gutter needed to be visible where pages are designed, not only in Sass.',
      'Nothing in AEM shows whether a style option is committed to the branch, configured only on a local build, or still depends on CSS pasted into the page.',
      'Each fix needed a record of the behavior it replaced, so the reason for the rule stays with the rule.',
      'Homepage concepts live in a separate exploration file with their own test plan. For a concept to ship, it has to become a style option, a class, and a rule in the guide.',
    ],
    // ── 03 Constraints ──
    constraintsPunch: 'Live pages, saved styles, and the rules of AEM’s own Style System.',
    constraints: [
      'Saved styles had to keep rendering. Dozens of pages already use the Thin Hero variant, and the core page template renders saved hero styles only when it maps the Hero Teaser policy.',
      'AEM’s Style System sets its own rules. Most style groups are single-select, and it drops a class that is a substring of one already applied.',
      'Template and policy settings ship in the content package, separately from the CSS. A setting made on a local AEM build is not released until it is added to ui.content.',
      'Containers had to match the gutter of pages built outside AEM, so the content edge holds when a visitor moves between them.',
      'Most designers and authors work in Figma and the AEM editor, not in Sass. The rules had to read as measurements, pictures, and clicks.',
    ],
    insightCallout: 'A style option is a decision made for the author in advance. It needs CSS behind it, a defined result at every width, and a picture of what to select. The guide documents all three, the branch fixes what it can, and the exploration file shows what the next option should be, with its test, before anyone builds it.',

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Define the rules: measure the branch before drawing',
        description: 'I measured the components on local AEM builds of the branch, at widths from 375 to 1920 pixels. Those measurements set the frame every page of the guide shares: four breakpoints, a 1296px content max, a 900px copy max, and a gutter of 5% minus the 14px column padding, matching pages outside AEM. A status legend marks every rule as in the branch, configured only on local AEM, or still pasted into the page. Each component page then reads in the same order: the rules, the class each style option adds, the steps in the AEM style picker with a screengrab, and wireframes at key widths.',
        images: [GUIDE.readMe],
      },
      {
        key: 'explore',
        label: 'Explore in Figma, one section at a time, with a test behind each idea',
        systemMarker: 'Figma',
        description: 'The homepage exploration file holds a concept for each section rather than one redesign: three concept pages with different treatments below the hero, then six boards that put one section in focus at a time, from when it is time for new tires to the most-read articles. Each concept carries its test: a written hypothesis, the data to request, a customer survey on the fifteen topics shoppers might want explained before buying, and the order in which tests can run without colliding with the ones already scheduled. The notes below are from the file, with names removed.',
        bullets: [
          'Direction from the quarterly review: tires and wheels come first, and the page should lead with product-first messaging and component order.',
          'Hypothesis for How It Works: the last redesign led with Find, Deliver, Install. Find is now an expectation rather than a question, so delivery and installation lead, then shipping, returns, and testing, which are the brand’s distinct advantages. The section ships without an order first, and customers set it.',
          'Hypothesis for promotions: a smaller carousel, 490 by 180 banners instead of 550 by 470, placed above the fold keeps deal-driven shoppers. The two best-selling days of last year were deal days.',
          'Survey: which of fifteen topics, from shipping and delivery to in-house tire testing, would you want explained before buying, and three questions a How It Works section should answer.',
          'Sequencing: the component-order test waits for the hero button test, the decision guide A/B test, and winter content, and its success is defined before it starts, with a failure case written down.',
          'Removals, each with a reason: the video center and three more videos for engagement and space, ratings charts to a link under Testing, the order pick-up discount for its small audience, the 40-years section in favor of the pledge, and the package mention in the hero.',
          'Rules the concept adds: the red block button stays on one intended path, black pill buttons lead into shopping, white pill buttons lead to information, and the How It Works teasers get a new icon style.',
          'A focus-group question to ask: which How It Works section, ours or a competitor’s, leaves a customer understanding the process best, and why.',
        ],
        variantsCaption: 'Three concept pages, then one section in focus at a time. From the exploration file.',
        variants: [
          { label: 'Concept A', image: EXPLORE.conceptA },
          { label: 'Concept B', image: EXPLORE.conceptB },
          { label: 'Concept C', image: EXPLORE.conceptC },
          { label: 'New tires', image: EXPLORE.focusNewTires },
          { label: 'Brands', image: EXPLORE.focusBrands },
          { label: 'Test track', image: EXPLORE.focusTestTrack },
          { label: 'Reviews', image: EXPLORE.focusReviews },
          { label: 'Pledge', image: EXPLORE.focusPledge },
          { label: 'Articles', image: EXPLORE.focusArticles },
        ],
        images: [PLAN.order, PLAN.tests, NOTES.howItWorks, NOTES.promo, NOTES.survey, NOTES.topics],
      },
      {
        key: 'system',
        label: 'Reuse first, then a variant, then a named gap',
        description: 'A full-bleed color band needed no new component: a Fixed Width container nested inside a Full Width one with a gray background keeps the copy aligned with every other section. Where reuse fell short, a style variant extended an existing component. Copy Width adds a 900px column to the layout container, and the Flex Container lays out existing teaser styles in columns set by the screen width and the number of children. The tire size table was a real gap. I documented it as rendered today and recommended moving its pasted CSS into the branch under the unused Tr Table style.',
        images: [{ ...GUIDE.flex, layout: 'half' }, { ...GUIDE.table, layout: 'half' }],
      },
      {
        key: 'build',
        label: 'Fix the edge case in Sass, and write down what it replaced',
        systemMarker: 'Codebase',
        description: 'I wrote the Sass alongside the guide. Each change in the branch is listed beside the behavior it replaced, so a reviewer can see why the rule exists.',
        bullets: [
          'Hero CTAs use min(250px, 100%). The old forced 350px minimum overflowed 375px phones once padding was added.',
          'Phone hero content can shrink (min-width: 0), so long titles and buttons stay inside the screen instead of pushing the page sideways.',
          'Featured teaser images center beside the copy. With object-position: top, a tall description left empty space under the image.',
          'The red arrow on text links joins the last word with a no-break space, so it can never wrap onto a line by itself.',
          'Copy Width alignment classes are named --align-left and --align-center. AEM’s Style System drops a class that is a substring of one already applied, and an earlier name silently removed Copy Width.',
        ],
        codeBlock: {
          filename: 'components/heroTeaser/scss/styles/_default.scss (sanitized)',
          language: 'scss',
          code: `$desktop-max-height: 560px;
$desktop-max-width: 1260px;
$mobile-max-height: 250px;
$mobile-max-width: 768px;

.heroTeaser {
  .cmp-heroTeaser {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column-reverse;
    position: relative;

    .cmp-teaser__action-link {
      min-width: 250px;
    }

    a.standard, button.standard,
    a.redGreater, button.redGreater {
      font-family: var(--font-family-primary);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-md);
      color: var(--color-white);

      &:hover {
        text-decoration: none;

        span {
          text-decoration: underline;
        }
      }
    }

    .cmp-button.secondaryPillBtn {
      color: var(--color-red) !important;
    }

    .cmp-button.secondaryBtn {
      color: var(--font-color-primary) !important;
      width: auto;
    }
  }
}`,
          caption: 'From the component-scoped Sass I wrote during the rebuild. Its fixed 250px CTA minimum is the behavior the overhaul changed to min(250px, 100%).',
        },
        images: [{ ...GUIDE.heroUpdates, layout: 'half' }, { ...GUIDE.teaserBeforeAfter, layout: 'half' }],
      },
      {
        key: 'iteration',
        label: 'Show authors the result, keep the open items in writing, and draw where the options go next',
        systemMarker: 'Documentation',
        description: 'High-fidelity references rebuild the live Homepage and Tire & Wheel Packages heroes, and a featured teaser from the 33-inch tires page, with real images, copy, and branch values. Numbered steps follow the AEM editor from selecting the component to the classes that result, and they record heading levels: the hero pretitle and title render as one H1, the teaser pair as one H2. Neither hero had a saved style, so each reference records the recommended selection. The read-me page keeps five open items in view until they close, starting with the template settings that still need to move into ui.content. The research then came back to the components: the refined homepage is one page at desktop and phone widths, built from the components the guide defines, with the vehicle selector as the one new component. It is the direction the style options move toward, and the guide is where each option lands once it has a rule, a class, and a picture.',
        images: [GUIDE.heroAuthor, GUIDE.heroPreview, REFINED.desktop, REFINED.phone],
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: 'The v1 guide has seven component pages: containers, copy width, hero, buttons, teaser and flex layouts, cards, and the tire size table. The CSS changes are in a working branch, and the guide records the steps that remain before release. The homepage exploration holds the next options, each with a hypothesis and a test behind it. The core components from the earlier rebuild are live, and WebPageTest reported 60% faster loads on pages using them. The distance between the Figma file and the branch is the part still closing: with the Figma MCP connection I now push between code and Figma in both directions, under the governance skill I built.',
    takeaways: [
      'Measurements come from local AEM builds of the branch, not from the design file.',
      'Reuse came first: a full-bleed band is two existing containers nested together, not a new component.',
      'Fixes are documented beside the behavior they replaced, including a class name AEM’s Style System silently dropped.',
      'The tire size table is recorded as a component gap with a recommendation, rather than another pasted fix.',
      'A homepage concept carries its hypothesis and its test before it carries engineering time.',
    ],
    outcomeLiveLinks: [
      { label: 'Tire Rack Homepage', url: 'https://www.tirerack.com/' },
      { label: 'Tires Landing', url: 'https://www.tirerack.com/tires' },
      { label: 'Events & Sponsorship', url: 'https://www.tirerack.com/events' },
      { label: 'Packages', url: 'https://www.tirerack.com/packages' },
    ],
    metrics: [
      { value: '60%', label: 'Faster page loads (WebPageTest)' },
      { value: '7', label: 'Component pages in the Figma guide' },
      { value: '10+', label: 'Reusable components shipped to production' },
    ],
  },

  // =============================================
  // 5b. Design Enablement Platform — internal tooling  [agentic build]
  // =============================================
  {
    slug: 'design-enablement',
    coverGround: '#f3f3f3',
    thesis: 'Check the image before it reaches the page.',
    annotations: {
      problem: 'Crop problems surfaced after the asset reached AEM.',
      gaps: 'Photography needed to see the production crop before handoff.',
      constraints: 'Production work did not pause, so scope stayed surgical.',
      approach: 'Bring production crop rules into the preview.',
      outcome: 'The photography task went from three steps to one.',
    },
    stream: 'professional',
    groups: ['systems'],
    clientLabel: 'Tire Rack',
    client: 'Tire Rack · Internal Tooling',
    context: 'Tire Rack is a national online tire and wheel retailer. Its design and photography teams produce the pages, imagery, and project materials behind its digital shopping experience.',
    publicContext: 'The client is a national US online tire and wheel retailer. Its design and photography teams produce the pages, imagery, and project materials behind its digital shopping experience.',
    title: 'Scaling Design Through Internal Tooling',
    cardTitle: 'Tools that scale design',
    seoTitle: 'Design Enablement: Responsive Crop Validation & Review Tools',
    summary:
      'I built a browser-based crop simulator so Design and Photography could check responsive imagery before placing it in AEM. Reusable Figma presentation components support the stakeholder review that follows.',
    cardHook: 'A crop simulator brings production breakpoints, gradients, and safe zones into image review before an asset reaches AEM.',
    year: '2025–2026',
    tags: [
      'Design Enablement',
      'Internal Tooling',
      'AI-Assisted Build',
      'Workflow Automation',
      'Design Systems',
    ],
    role: 'Product Design · UX Engineering · AI-Assisted Build',
    tools: ['Figma', 'Claude', 'TypeScript', 'React', 'VS Code'],
    timeline: 'Ongoing (tools shipped iteratively alongside production work)',
    featured: '/assets/portfolio-safe/web-apps/cover-poster.jpg',
    featuredVideo: '/assets/portfolio-safe/web-apps/cover-loop.mp4',

    // ── 01 Problem ──
    problemPunch:
      'A crop problem found in AEM was already a late-stage problem.',
    problem: [
  "I had been using AI-assisted builds to remove repetition from my own work. My manager noticed and brought me a request from Photography: make hero crop decisions easier before the image reached AEM.",
  "Photography needed a preview that matched the live site, while Design and UX needed a reusable format for stakeholder reviews.",
  "Checking crops in AEM pushed breakpoint and safe-zone problems late into the workflow, after other people had already committed time to the asset."
],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'The image needed to work at every production breakpoint.',
    gaps: [
      'Desktop crops could hide important parts of an image on mobile, especially behind copy and gradients.',
      'Reviewing an image outside its production layout did not reveal those conflicts.',
      'Stakeholder decks also required repeated layout work before teams could review the project.',
    ],

    // ── 03 Constraints ──
    constraintsPunch: 'Built inside the team’s production week, not in a lab.',
    constraints: [
      'Internal tools earn adoption or die. Every tool had to beat the workaround it replaced from its first release.',
      'The Hero Crop Simulator had to reproduce the live responsive CSS, gradients, safe zones, and crop behavior. A close approximation would still send the wrong image into production.',
      'Everything was built alongside normal production workload, in partnership with our Lead Product Manager, so scope had to stay surgical.',
    ],

    // ── Key Insight (portable-governance thesis) ──
    insightCallout: 'The preview had to use the same crop behavior as the live site. Otherwise it could approve an image that failed in production.',

    // ── 04 Approach — one subsection per tool ──
    approachSubsections: [
      {
        key: 'crop-simulator',
        label: 'Hero Crop Simulator',
        systemMarker: 'VALIDATION LAYER',
        description:
          "The crop simulator was the first requested exploration beyond my own workflow. I built a browser app using the live site's responsive behavior, gradients and safe zones so Design and Photography could judge desktop, tablet and mobile crops before placing the asset in AEM. I worked with our AI team to host it internally behind company sign-in.",
        images: [
          {
            src: '/assets/portfolio-safe/web-apps/cover-loop.mp4',
            alt: 'Hero Crop Simulator previewing responsive hero crops across breakpoints',
            layout: 'full',
            isVideo: true,
            videoPoster: '/assets/portfolio-safe/web-apps/cover-poster.jpg',
            caption:
              'Production-accurate hero previews across breakpoints, validated before anything touches AEM.',
          },
        ],
      },
      {
        key: 'presentation',
        label: 'Component-Based Presentation System',
        systemMarker: 'COMMUNICATION LAYER',
        description:
          'I turned the recurring parts of a stakeholder deck into Figma components: layouts, charts, callouts, status markers, and content blocks. Design and UX now assemble the presentation around the project instead of rebuilding its visual language before every review.',
        images: [
          {
            src: '/assets/portfolio-safe/web-apps/internalTool_SlidesTemplate.png',
            alt: 'Componentized Figma presentation system with reusable project deck templates, layouts, charts, and callouts',
            layout: 'full',
            caption: 'Every layout, chart, and callout is a component. Decks assemble instead of being rebuilt.',
          },
        ],
      },
    ],

    // ── 05 Outcome ──
    timeToLive: 'In daily use by the design team, maintained alongside core project work rather than as a separate initiative.',
    outcomeNote:
      "The crop simulator is in the team's workflow, and the photography task went from three steps to one. Figma presentation components reduce repeated review setup. I maintain both alongside production work.",
    takeaways: [
  "The crop simulator started as a Photography request after my manager saw the tools I was building for my own work.",
  "Production crop rules and internal sign-in solve different problems: one supports a useful preview, the other controls access.",
  "The photography task went from three steps to one. I keep the preview aligned with production behavior."
],
    outcomeArtifacts: [
      'Hero Crop Simulator',
      'Component-Based Presentation System',
    ],
    metrics: [
      { value: '3 → 1', label: 'Steps in the photography task' },
      { value: '3 teams', label: 'Design, UX & Photography workflows served' },
      { value: 'Zero', label: 'AEM placements needed to validate hero crops' },
    ],
  },

  // =============================================
  // 6. LoopStack → CarbCurve  [personal project, in progress]
  // =============================================
  {
    slug: 'loopstack',
    coverGround: '#fafafa',
    thesis: 'Meals behave like curves, so the app should too.',
    annotations: {
      problem: 'Most diabetes tools treat a meal as one entry. Real meals are curves.',
      gaps: 'Curves over entries. Confidence over recommendations.',
      constraints: 'High-stakes domain. A review tool, never dosing advice.',
      approach: 'Confidence is the safety mechanism, not a feature.',
      outcome: 'Patterns ready to review stay separate from patterns still forming.',
    },
    stream: 'passion',
    groups: ['product'],
    clientLabel: 'Personal product',
    client: 'LoopStack (personal project)',
    context: 'LoopStack is my independent Type 1 diabetes app, built around my own meal and glucose history. It brings recurring patterns into view for personal review and care-team discussion.',
    title: 'LoopStack: Pattern Review for Meals and Glucose',
    cardTitle: 'LoopStack: Patterns worth reviewing',
    seoTitle: 'LoopStack: Trends-First Health-Data UX for Type 1 Diabetes (React/TypeScript)',
    summary: 'A Type 1 diabetes app that compares what Loop predicted with what happened after a meal, then groups repeated glucose curves into patterns worth reviewing with a care team. It runs on TestFlight with 90 days of my HealthKit CGM data and never gives dosing advice.',
    year: '2026',
    tags: ['0 → 1 Product Design', 'Pattern Intelligence', 'Mobile (iOS)', 'AI-Assisted Workflow', 'Type 1 Diabetes', 'HealthKit'],
    role: 'Product Design · UX · Agent-Assisted Build',
    tools: ['Figma', 'Claude', 'ChatGPT', 'Cursor', 'HealthKit', 'Vitest', 'TestFlight'],
    timeline: 'Initial build ~3–4 weeks; HealthKit wiring and pattern intelligence ongoing',
    featured: '/images/work/loopstack/loopstack-portfolio-cover-2026-update.png',
    featuredVideo: '/assets/portfolio-safe/loopstack/cover-loop.mp4',
    featuredVideoPrimary: true,
    timeToLive: 'Concept to working build in ~3–4 weeks. Now on TestFlight: build 2 live, build 3 in flight.',

    // ── 01 Problem ──
    problemPunch: 'Most T1D tools treat meals as one-time entries. Real meals behave like curves.',
    problem: [
  "I wanted to follow a repeat meal through its full glucose-response window, including what happened hours after I finished eating.",
  "A single entry was not enough. I needed to compare similar meals and see whether the same response kept appearing across timing, activity and my current Loop settings."
],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'Static logs → pattern review. Curves over entries; confidence over recommendations.',
    gaps: [
  "My review needed to connect repeat meals by their glucose response, with the earlier entries still available for comparison.",
  "A pattern needs evidence before it earns confidence. I wanted to see how often it recurred and what context might change the interpretation.",
  "Meal timing, activity and settings needed to stay visible beside the curve."
],

    // ── 03 Constraints ──
    constraintsPunch: 'Solo 0 → 1. High-stakes domain. Pattern review and care-team discussion, never dosing advice.',
    constraints: [
      'Solo designer and builder: no research budget, no clinical team, no user panel.',
      'Type 1 physiology is individual. The app had to ground patterns in one user’s real Loop history before it could ever be useful more broadly.',
      'LoopStack must never read as medical advice: no dosing instructions, no recommended carb entries, no pump-setting changes. Every output is pattern evidence, a confidence level, or a point for care-team discussion.',
      'Mobile-first (iOS), running on device through TestFlight. Surfaces had to be scannable in the moments between meals, not deep dashboards.',
    ],

    insightCallout: 'Confidence is the safety mechanism. LoopStack separates “ready to review” patterns from “still building evidence,” so one odd meal never turns into a recommendation and the app stays a review tool rather than a dosing engine.',

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: "Keep the review grounded in my own history",
        description: "I compare what Loop predicted with what happened over the meal's response window. Claude and ChatGPT helped me explore logic and wording; I owned the review of what the app could claim. This remains a personal pattern-review tool, with observations to discuss with a care team rather than instructions to change therapy.",
        images: [
          {
            src: '/assets/portfolio-safe/loopstack/cover-loop.mp4',
            alt: 'Ten-second LoopStack overview: the Trends dashboard and favorite-meal report card, fed by Loop, Apple Health, and Apple Watch data, ending on an evidence-gated confidence ring',
            layout: 'full',
            isVideo: true,
            videoPoster: '/assets/portfolio-safe/loopstack/cover-loop-poster.jpg',
            caption:
              'Ten seconds of LoopStack: real data in from Loop, Apple Health, and Apple Watch. Metrics studied into evidence-gated confidence reports.',
          },
        ],
      },
      {
        key: 'structure',
        label: 'Ingredients ordered by how much they move the curve',
        description: 'Mapped the loop as Input → Compare → Cluster → Review → Refine. Every surface has a single job. The meal builder orders ingredients by absorption impact; context chips (meal time, activity, setting) let pattern-matching cluster a meal with the right past ones. Evidence stays optional: a meal photo or Loop screenshot pairs with the entry automatically.',
        systemMarker: 'Loop introduced',
        images: [
          {
            src: '/images/work/loopstack/02_memory_pattern.png',
            alt: 'Build your meal: guided meal builder ordering grains, proteins and legumes, and nuts or seeds by their effect on absorption timing and insulin disruption',
            layout: 'half',
            caption: 'Input, structured. The builder orders ingredients by how much they move the curve.',
            mobile: true,
          },
          {
            src: '/images/work/loopstack/03_insight_isf.png',
            alt: 'Meal context capture: meal time, activity window, and setting chips, with optional meal-photo and Loop-screenshot evidence uploads before requesting a strategy',
            layout: 'half',
            caption: 'Context and evidence. What surrounds the meal lets pattern-matching cluster it correctly.',
            mobile: true,
          },
        ],
      },
      {
        key: 'system',
        label: 'Real CGM data in, and sample data labeled as sample',
        description: 'Real data replaces hand entry, and the app says where each number comes from.',
        bullets: [
          'HealthKit pulls 90 days of CGM history: time in range across five bands, GMI, and glucose variability.',
          'Workouts, elevated heart rate, and step bursts fold into one fitness trend, applied as a visible sensitivity multiplier and never a dose.',
          'Dietary profile and health connections sit beside the curve as explanatory factors, not overrides.',
        ],
        systemMarker: 'Real data in',
        images: [
          {
            src: '/images/work/loopstack/01_strategy_hero.png',
            alt: 'Dietary profile: primary eating pattern, fat sensitivity, protein impact, and typical food mix setting a background sensitivity baseline that never overrides meal-specific data',
            layout: 'half',
            caption: 'Personal context as explanatory factors: a baseline, never an override.',
            mobile: true,
          },
          {
            src: '/images/work/loopstack/06_profile_calibration.png',
            alt: 'Health connections: Apple Health, Dexcom, and Loop connected, with a current fitness trend applying a ×0.92 sensitivity multiplier explained in plain language',
            layout: 'half',
            caption: 'Real sources in. Fitness load shifts the sensitivity baseline, visibly and explainably.',
            mobile: true,
          },
        ],
      },
      {
        key: 'build',
        label: '460 tests guarding what the app may claim',
        description: 'Claude and ChatGPT helped me compare logic and language quickly; the harder review was mine. A 460-test Vitest suite now guards the confidence logic that decides what the app may claim. TestFlight adds the device check against real Loop data, meal after meal.',
        codeBlock: {
          language: 'text',
          filename: 'pattern-review-system-prompt.md',
          code: `Design a Type 1 diabetes pattern-review screen.

Compare what Loop predicted (modeled carb absorption + insulin activity)
with what the body actually did (glucose response over 6–8h).

Surface, in this order:
- the shape of the meal (flattened / biphasic / fast spike / etc.)
- how many times that shape has shown up
- a confidence state (building evidence vs ready to review)
- contributing factors (dietary pattern, fitness trend, protein impact)

Do NOT:
- present exact dosing instructions
- recommend specific carb-entry amounts
- suggest pump-setting changes as commands

Frame every output as:
- pattern evidence
- a suggested point of discussion with a care team
- a setting category that may be worth reviewing, never a directive`,
          caption: 'Representative prompt used to keep every generated surface inside clinician-safe boundaries: pattern review and discussion points, not dosing directives.',
        },
        images: [],
      },
      {
        key: 'iteration',
        label: "Build confidence through repeat meals",
        description: "I use repeat meals and time-of-day patterns to review questions about sensitivity, meal boluses and background insulin alongside my Loop settings. Each observation shows the supporting meals, trend and confidence tier. Full response windows build evidence; a single unusual result stays an observation for review.",
        systemMarker: 'Confidence gate',
        images: [
          {
            src: '/images/work/loopstack/05_meal_builder.png',
            alt: 'Loop calibration: uploading current therapy settings, absorption model, and favorite meals, with full 6–8h outcome slots; screenshots stay on-device',
            layout: 'full',
            caption: 'Calibration mirrors what Loop is actually running. Screenshots stay on-device, and favorite meals accumulate toward report cards.',
            mobile: true,
          },
        ],
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: 'LoopStack runs on TestFlight as my own pattern-review tool. Observed values stay beside the pump settings rather than replacing them. Clinician-facing review and tighter safety language come before any wider release.',
    takeaways: [
      'Claude and ChatGPT compared logic and language quickly. The review of what the app may say was mine: every output reads as an observation, a piece of evidence, or a discussion point, never an instruction.',
      'Tiers are gated by evidence, not enthusiasm: one odd meal stays an observation until the pattern holds.',
      'Fitness load shifts the sensitivity baseline as a visible multiplier rather than a dose.',
      'Where real history is thin, sample values are labeled as sample; computed and demonstrated are never blended.',
    ],
    outcomeImages: [
      {
        src: '/images/work/loopstack/04_fix_log.png',
        alt: 'Targets and sensitivity: observed ISF of 54 mg/dL per 1U at 72% actionable across 18 meals, shown alongside the base ISF from Loop therapy settings',
        layout: 'full',
        caption: 'The payoff: observed sensitivity earns its confidence tier next to what Loop is running, as evidence for a care-team conversation.',
        mobile: true,
      },
    ],
    // Same code the iOS build wraps (Capacitor) — served on sample data,
    // since HealthKit only exists on device. The disclosure system labels it.
    outcomeLiveLinksLabel: 'Use the working product',
    outcomeLiveLinks: [
      { label: 'Try the live demo (real app, sample data)', url: '/loopstack-demo/' },
    ],
    // TODO(Ryan): swap to the TestFlight public link once it exists —
    // App Store Connect → TestFlight → external group → Enable Public Link.
    // Then add it to TARGETS in scripts/gen-qr.mjs as 'loopstack-testflight',
    // run `node scripts/gen-qr.mjs`, and set qr + url below.
    outcomeInstall: {
      label: 'Scan to open on your phone',
      url: 'https://www.rdeboerdesigns.com/loopstack-demo/',
      linkText: 'rdeboerdesigns.com/loopstack-demo',
      caption: 'Opens the working build on your phone, where the layout was designed to live.',
      qr: 'loopstack-demo',
    },
    metrics: [
      { value: '90 days', label: 'Real HealthKit CGM history: time in range, GMI, variability' },
      { value: '460 tests', label: 'Vitest suite across 28 files, guarding what the app may claim' },
      { value: '0 directives', label: 'Every output frames as evidence or discussion point' },
    ],
  },

  // =============================================
  // 7. PlayDraft — Social drafting app (launched on iOS)
  // =============================================
  {
    slug: 'playdraft',
    coverGround: '#0e1720',
    overview: {
      title: 'PlayDraft',
      category: 'Personal product',
      role: 'Product design · Design system · Agent-assisted build',
      relatedNote: { href: '/notes/a-system-to-maintain/', label: 'Read why I built a product to maintain' },
      deck: "I wanted fantasy-football draft day for snacks, movies and whatever else my friends wanted to argue about. I released PlayDraft, then started cutting the extra mechanics that got in the way of drafting.",
      ownership: "I designed the brand, game and design system, then built the Expo and Supabase app with agents on nights and weekends.",
      status: 'Original release on iOS · v2 in development',
      decisions: [
        {
          title: "Simplify the mechanics, keep the game",
          bodyLink: { text: 'first simplification pass', to: '/notes/simplifying-playdraft-without-losing-the-game/' },
          body: "My first simplification pass went too far. The app started to feel like a list. I brought back the textured shields and character avatars, and gave Home a clearer job. It leads with creation when you are idle and your next pick when it is your turn.",
          images: [
            { src: "/images/work/playdraft/progression/screenshots/01-home.png", alt: "Home asks What are we drafting? beside a large initials avatar, with a Create a draft card and a recently finished Candy draft.", layout: 'full', caption: "Idle Home leads with creation. Staging build on an iPhone 17 simulator, signed in as a test account.", crop: { x: 0, y: 0, width: 1206, height: 2622, sourceWidth: 1206, sourceHeight: 2622 } },
            { src: "/images/work/playdraft/progression/loops/room-fills-countdown.mp4", isVideo: true, videoPoster: "/images/work/playdraft/progression/loops/room-fills-countdown-poster.jpg", alt: "The host's waiting room fills with a third player, the PLAY, DRAFT, WIN intro plays, and the Everyone is here countdown starts with Start draft now.", layout: 'full', caption: "When the last seat fills, PLAY, DRAFT, WIN plays before the countdown. The host's view in a three-account staging test." },
          ],
          wide: { src: '/images/work/playdraft/playdraft-shipped-screens.png', alt: 'Six screens from the shipped PlayDraft build, captured on an iPhone 17: Home with the week’s three competitive rooms and a join button, the full Packs grid with the write-your-own band above it, Collection with per-pack progress and the binder door, the coins-only Store of tickets and card packs, the live draft board with the “The pick is in” card revealing over it, and the winner podium with final standings', layout: 'full', caption: "Six screens from the original release, including a pick arriving on the board and the final podium.", },
        },
        {
          title: "Save an idea before hosting a draft",
          body: "Making a custom pack used to lead straight into a draft room. I separated writing from hosting so you can save an unfinished idea and come back later. Custom now has its own tab beside the pre-built Packs catalog.",
          images: [
            { src: "/images/work/playdraft/progression/screenshots/02-packs.png", alt: "Packs catalog with search, All packs, Recent and Favorites filters, and textured Candy, Fast Food, GOAT Athletes and Horror Movies shields.", layout: 'full', caption: "Pack shields, search and favorites. Staging build on an iPhone 17 simulator.", crop: { x: 0, y: 0, width: 1206, height: 2622, sourceWidth: 1206, sourceHeight: 2622 } },
            { src: "/images/work/playdraft/v2/playdraft-v2-custom-saved.png", alt: "Custom library confirms a Road trip snacks pack saved with zero choices and shows what is needed before hosting.", layout: 'full', caption: "Save a pack before adding its choices or starting a draft. This simulator view uses sample data; account saving was tested separately.", crop: { x: 0, y: 0, width: 1206, height: 2622, sourceWidth: 1206, sourceHeight: 2622 } },
          ],
        },
        {
          title: "Show the choices before committing",
          body: "Setup lets the host choose how many people play, how many picks they get and how long each turn lasts. Join shows open seats and the ticket cost before asking you to commit. If you already have a seat, you can return without spending another ticket.",
          images: [
            { src: "/images/work/playdraft/progression/screenshots/04-new-draft-setup.png", alt: "New draft setup for Candy with an optional name, four players, five picks each and two-minute or eight-hour clock choices.", layout: 'full', caption: "Players, picks and turn length in one setup. Staging build on an iPhone 17 simulator.", crop: { x: 0, y: 0, width: 1206, height: 2622, sourceWidth: 1206, sourceHeight: 2622 } },
            { src: "/images/work/playdraft/progression/screenshots/06-join-invite.png", alt: "A friend's invite to The Candy Showdown shows two of three seats open, the one-ticket hold and the date it comes back, then Join draft · 1 ticket.", layout: 'full', caption: "The invite shows open seats and the ticket hold before you commit. A second test account on an iPhone 17e simulator.", crop: { x: 0, y: 0, width: 1170, height: 2532, sourceWidth: 1170, sourceHeight: 2532 } },
          ],
        },
        {
          title: "Make the design repeatable",
          body: "I turned the pitch into components I could reuse and compare on an iPhone. Big Shoulders gives the headings their character. Initials and character avatars share a size scale, and a YOU label identifies the current player in a group.",
          image: { src: "/images/work/playdraft/v2/playdraft-v2-identity-system.png", alt: "Native v2 identity specimen showing initials, The Sleeper and Bracket avatars at 24, 32, 40, 56 and 96 points, plus player nameplates and a YOU badge.", layout: 'full', caption: "Initials and character avatars at five sizes, followed by player nameplates. Captured from the native component preview with sample players.", crop: { x: 0, y: 0, width: 1206, height: 2622, sourceWidth: 1206, sourceHeight: 2622 } },
          wide: { src: '/images/work/playdraft/playdraft-design-system-governance.png', alt: 'PlayDraft design-system governance board: the rule that components must not inline hex codes, font sizes or spacing numbers; four locked micro-rules including white-on-gold forbidden and the variant owning casing; a primitive to semantic to recipe token flow; Figma provenance with three accepted sources of truth; the five-step path for adding a token; and the three mechanisms that catch drift', layout: 'full', caption: "The rules for adding a token, using it in a component and checking its rendered result.", },
        },
      ],
      outcome: "The original app is on iOS. The rebuilt screens run on iPhone, and saving packs to an account has passed its first checks. V2 is still in development. On a staging server, three test accounts on three iPhone simulators have created, joined and finished drafts through the shared draft and ticket system. Production release and real-device testing are next. I have no usage results for this version yet.",
    },
    thesis: "Let friends draft the things they already argue about.",
    annotations: {
      problem: "Draft day is my favorite part of fantasy football.",
      gaps: "I wanted a draft my friends could finish in one sitting.",
      constraints: "A solo build with store and content restrictions to work through.",
      approach: 'No screen without a reference, even for AI output.',
      outcome: 'Brand to TestFlight in twelve weeks, then launched on iOS.',
    },
    stream: 'passion',
    groups: ['product'],
    clientLabel: 'Personal product',
    client: 'PlayDraft (personal product)',
    context: 'PlayDraft is my independently built social drafting game for iPhone. Friends take turns picking favorites from everyday topics and compare the boards. This case study covers the original release and the current simplification rebuild.',
    title: "PlayDraft: a social drafting game, from brand to App Store",
    cardTitle: 'PlayDraft: A social drafting game',
    seoTitle: "PlayDraft: designing and building a social game with agents",
    summary: "I designed and released a social drafting game with agents. I am now removing XP and competitive modes so friends can get to the draft sooner, while keeping the board, avatars and custom topics.",
    cardHook: 'Draft snacks, movies, or anything your group writes in. I designed the brand, game, and system, then built and released the iPhone app with agents.',
    year: '2026',
    tags: ['0 → 1 Product Execution', 'Mobile (iOS)', 'Game Design', 'Design System', 'Agentic Workflow', 'Brand System'],
    role: 'Product Strategy · Game Design · Brand · UX/UI · Design System · Agent-Assisted Build (React Native) · Content & Legal Ops · QA',
    tools: ['Figma', 'Figma MCP', 'Claude Code', 'Expo / React Native', 'TypeScript', 'Expo Router', 'Supabase', 'RevenueCat', 'Maestro', 'Xcode / TestFlight'],
    timeline: '2026 · App Store launch',
    featured: '/images/work/playdraft/playdraft-cover-v2.png',
    featuredVideo: '/images/work/playdraft/v2/playdraft-v2-walkthrough.mp4',
    featuredReel: {
      src: '/images/work/playdraft/v2/playdraft-v2-walkthrough.mp4',
      poster: '/images/work/playdraft/v2/playdraft-v2-walkthrough-poster.jpg',
      captions: '/images/work/playdraft/v2/playdraft-v2-walkthrough.vtt',
      alt: 'PlayDraft v2 tutorial: picking a pack, writing a custom topic, setting the draft rules, inviting friends with one link, finding and making a pick on the clock, then sharing the recap as an image or as text',
      caption: "The v2 tutorial, in development. Native recordings show packs, Custom, draft settings, an invite, a pick on the clock and sharing the recap as an image or text. The draft room is the earlier prototype and the lineups use sample data.",
    },
    timeToLive: "About twelve weeks of nights and weekends took PlayDraft from the first logo sketch to TestFlight. The released app uses coins. Cash purchases remain disabled pending legal review.",

    // ── 01 Problem ──
    problemPunch: "I wanted draft day without waiting for football season.",
    problem: [
  "In fantasy football, I look forward to the draft most. I love finding a sleeper, losing a pick to a friend and arguing about the board afterward.",
  "I also kept seeing podcasts draft everyday topics for the fun of the debate. I wanted to put that format in friends' hands, from a Halloween candy draft to movies or a topic they write themselves."
],
    // The narrated product reel lives in the hero. The Problem stays focused on
    // the mechanic and decision rather than repeating the video below.

    // ── 02 Gaps & Opportunity ──
    gapsPunch: "A draft should fit into an evening with friends.",
    gaps: [
      "I wanted people to finish a draft in one session, without managing a roster or committing to a season.",
      "For the first release, I wanted the group to leave with a winner and a board worth sharing. That led to the scoring model described below. In v2, I am keeping the lineups and removing the score.",
      "Each topic needed an identity people could recognize while browsing. Pack shields and accent colors give movies, snacks and sports their own place in the same catalog.",
      "Agents could build screens faster than I could review them. I needed shared components and clear references to keep those screens consistent.",
    ],
    // ── 03 Constraints ──
    constraintsPunch: "I owned the design, build and release.",
    constraints: [
      "I had no engineering team or research budget. I designed components, built screens with agents and reviewed the results in the simulator as part of the same workflow.",
      "The app uses React Native and Expo, with Supabase for accounts and live draft data. Service modules separate the screens from the backend so game logic can be tested without a network connection.",
      'App Store guidelines shaped real product decisions: UGC moderation (block / report / eject) for guideline 1.2, a wager token renamed and made coin-only for 5.3, and non-functional cash UI stripped for 2.1.',
      'Packs that name real brands, shows, and athletes follow content rules I wrote myself, without counsel: names only, no likenesses, trademarked nicknames scrubbed, one pack renamed, and a remote kill switch that disables any pack without an app release. The riskiest content launches free-tier only until a lawyer has reviewed it.',
    ],

    insightCallout: "I gave agents a reference for each screen and required them to use the shared tokens and components. Then I checked the result in the app.",

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: "The first logo pulled the product in the wrong direction",
        description: "I wrote the brief before designing screens. It ruled out trading-card framing and pay-to-win mechanics. Then my first logo, DraftPack, looked like a card-collecting game. I replaced the wolf-and-card mark with the PlayDraft shield and checked it at 29 pixels beside other App Store icons.",
        images: [
          {
            src: '/images/work/playdraft/playdraft-brand-evolution.jpg',
            alt: 'Brand evolution board. Top: five DraftPack app-icon variants built on a wolf mark and trading-card frames; bottom: five PlayDraft icon color variations tested at 60/40/29 px and beside PrizePicks, Sleeper, and FastDraft in an App Store grid',
            layout: 'full',
            caption: "I retired DraftPack within days. Below it, the PlayDraft mark appears at 60, 40 and 29 pixels and beside other App Store icons.",
          },
        ],
      },
      {
        key: 'structure',
        label: 'The original release put the draft room at the center',
        description: "The draft room keeps the board, clock, queue, roster and chat together. Search accepts partial names, so typing \"lay\" finds the Lay's flavors. In the original Custom Drafts, players write in their picks and the app rejects duplicates.",
        bullets: [
          'Home: wallet, live drafts, the week’s competitive rooms',
          'Packs: browse, favorites, write your own',
          'Collection: cards, per-pack binders, in-pack search',
          'Store: tickets and card packs',
        ],
        images: [
          {
            src: '/images/work/playdraft/playdraft-shipped-screens.png',
            alt: 'Six screens from the shipped PlayDraft build, captured on an iPhone 17: Home with the week’s three competitive rooms and a join button, the full Packs grid with the write-your-own band above it, Collection with per-pack progress and the binder door, the coins-only Store of tickets and card packs, the live draft board with the “The pick is in” card revealing over it, and the winner podium with final standings',
            layout: 'full',
            caption: "Six screens from the original release, including a pick arriving on the board and the final podium.",
          },
        ],
      },
      {
        key: 'system',
        label: 'The original system made the first release possible',
        description: "The first system gave screens shared tokens, component recipes and an in-app gallery to compare against. Components had to use named colors and states. V2 takes its values from the TypeScript tokens, with automated checks for overrides and native captures for visual review. The older JSON and CSS files document the first system.",
        systemMarker: 'Governance',
        images: [
          {
            src: '/images/work/playdraft/playdraft-design-system-v01-board.png',
            alt: 'PlayDraft design-system one-pager: brand emblem and app icon variants, primary blue and secondary gold color ramps, semantic tokens, gradients, Rajdhani and Inter type ramp, custom icon library, pack category glyphs, and status indicators',
            layout: 'full',
            caption: 'The v0.1 system board: emblem, ramps, semantic tokens, type, custom icon set, and status indicators on one sheet; v0.2 later re-tuned the palette cool and expanded the type ramp',
          },
          {
            src: '/images/work/playdraft/playdraft-design-system-governance.png',
            alt: 'PlayDraft design-system governance board: the rule that components must not inline hex codes, font sizes or spacing numbers; four locked micro-rules including white-on-gold forbidden and the variant owning casing; a primitive to semantic to recipe token flow; Figma provenance with three accepted sources of truth; the five-step path for adding a token; and the three mechanisms that catch drift',
            layout: 'full',
            caption: "The rules for adding a token, using it in a component and checking its rendered result.",
          },
          {
            src: '/images/work/playdraft/playdraft-design-system-live-screen.png',
            alt: 'Three columns cropped from the in-app /design-system route running on device: semantic text and border tokens, then icon, state and podium tokens, then the typography ramp, with swatches labelled by token name and resolved value',
            layout: 'full',
            caption: "The reference gallery renders tokens beside their names and values. I added the podium tokens in the middle column when the winner ceremony shipped.",
          },
        ],
      },
      {
        key: 'build',
        label: "I set the rules and reviewed what agents built",
        description: "Agents built screens from the component recipes and helped write packs against my content rules. I kept game logic separate from backend services so tests could exercise draft order, timers and scoring without a network connection. A weekly audit reported inconsistencies for review. The prompts below show some of the corrections I made during the first release.",
        systemMarker: 'Agent workflows',
        promptRows: [
          {
            prompt: '1 this is good as described XP only slots feed to bonus math 2 defer to casing established in design system dont add transform properties',
            outcome: 'The variant kept its own casing and no textTransform was added. It is now one of the four locked micro-rules on the governance sheet.',
          },
          {
            prompt: 'implement a extremely sharp countdown timer UI for the above need. dont stray from brand system but pull from the best of the apps animation and UI to build and reference my /ryan-design-taste',
            outcome: "The countdown reused the existing motion, type and color tokens.",
          },
          {
            prompt: 'the .05 holo bonus should only apply to the bonus XP rewarded not deterministic results',
            outcome: "In the first release, the holo bonus affected XP only. It could not change a player's placement.",
          },
          {
            prompt: 'just provide me the mechanics for scoring as they stand right now please, hold off on visual enhancements',
            outcome: "I documented the scoring model before designing its UI.",
          },
        ],
        promptRowsCaption: "Prompts from the April to July 2026 build sessions, with the original spelling and casing.",
        codeBlock: {
          language: 'ts',
          filename: 'src/design-system/packs.ts (excerpt, real file)',
          code: `/** \`ink\` was added 2026-07-14 for the Custom Draft tile — the one pack
 *  the player authors. Primary = the system's existing "authored by
 *  humans / the community" hue — NOT gold, which stays reserved for
 *  premium/winner (Custom has no winner). */
export const packAccents = {
  green:  { primary: '#35d68a', secondary: '#163e41' },
  yellow: { primary: '#ffd23f', secondary: '#403d31' },
  // …7 more pairs, each added by decision record…
  ink:    { primary: '#5ad1c2', secondary: '#0c2a2e' },
} as const;

export const packs = {
  // GOAT Athletes — free launch pack (2026-07-13). Names-only editorial
  // sports-history collection: no likenesses/logos, not coin-purchasable,
  // never in paid marketing. See PACK_LEGAL_AVAILABILITY + synopses.
  'goat-athletes': { name: 'GOAT Athletes', accent: 'plum', glyph: 'goat', tier: 'free' },
  // Sitcoms — fills the slot held by the retired Reality Show Castaways
  // pack; ships its own TV-set-with-comedy-mask shield.
  sitcoms: { name: 'Sitcoms', accent: 'cyan', glyph: 'sitcom', tier: 'free' },
  // …
} as const;`,
          caption: "An excerpt from the original pack registry. Comments explain the color choices and content restrictions beside the values the app uses.",
        },
        images: [],
      },
      {
        key: 'iteration',
        label: "I changed how a draft ends",
        description: "The original plan ended with community voting and a verdict the next day. I worried people would leave before seeing the result. In June, I replaced voting with the DraftLab confidence pool, which ranked items through solo mini-games and scored completed drafts immediately. By October, I thought I had added too much around the draft itself. V2 removes scoring and XP, leaving the group with their lineups to compare.",
        images: [
          {
            src: '/images/work/playdraft/progression/loops/recap-and-pick-order.mp4',
            isVideo: true,
            videoPoster: '/images/work/playdraft/progression/loops/recap-and-pick-order-poster.jpg',
            alt: 'The last pick lands, then Draft complete shows each lineup and the actual pick order, with no winner or score.',
            layout: 'full',
            maxWidth: 360,
            caption: "The last pick lands, then the recap: every lineup and the real pick order, with no score. The host's view in the staging test.",
          },
        ],
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: "The original iPhone app shipped. The October rebuild has a smaller navigation, Home states for idle and active players, reusable setup and Custom packs saved to an account. The newest screenshots come from a three-account test on a staging server; the rest use local sample data, and separate service tests cover saving, conflicting edits and retries. The shared draft and ticket systems now run end to end on staging; production release and real-device checks are still open. I have no adoption or retention results for v2.",
    takeaways: [
      "I retired next-day voting in June because I wanted the group to finish in one sitting. I expected that shorter loop to make another round more appealing.",
      "Requiring every token to appear in the in-app gallery gave me a concrete way to review additions from agents.",
      "Recording the demo with Maestro caught a timer that failed to pick automatically at zero. I fixed it before recording again.",
      'App Store rules shaped the product: “Bet on Myself” became coin-only “Podium Boost” for guideline 5.3, and non-functional cash UI came out for 2.1.',
    ],
    metrics: [
      { value: 'Launched', label: 'on the iOS App Store · Solo design & build' },
      { value: '4', label: 'Destinations in the v2 navigation: Home, Drafts, Packs and Custom' },
      { value: '2', label: 'Clock choices in the new setup: 2 minutes or 8 hours per pick' },
      { value: 'Save first', label: 'Custom packs can exist before a draft is hosted' },
    ],
  },

  // =============================================
  // Overscroll Tactics — studio identity + the ident that boots PlayDraft  [passion]
  // Ryan's own LLC and studio brand, so nothing here is client-confidential.
  // The mark's construction is the subject: it is public artwork on a public
  // site, and the drawings below are the shipped geometry, not a preview.
  // =============================================
  {
    slug: 'overscroll-tactics',
    coverGround: '#f9faf5',
    client: 'Overscroll Tactics (self-initiated)',
    context: 'Overscroll Tactics is my independent studio identity for the games and digital products I build. Its OTC Games identity appears in PlayDraft.',
    title: 'Overscroll Tactics: A Studio Mark Die-Cut From a Game That Just Finished',
    cardTitle: 'Overscroll Tactics: A studio identity',
    seoTitle: 'Overscroll Tactics studio identity: brand mark, motion ident, and two runtimes from one geometry',
    summary:
      "Overscroll Tactics names my practice, with OTC Games for its game releases. Overscroll connects to my front-end work; Tactics reflects the strategy behind the products. I kept the parent name open enough for work beyond games, then built a shared mark and motion ident for the web and PlayDraft.",
    cardHook:
      'PlayDraft shipped with no studio behind it. Overscroll Tactics is the parent: one mark that survives a favicon and a cold boot, built once and ported to two runtimes.',
    thesis: 'The mark isn’t drawn on screen. It’s cut out of a game that just finished playing.',
    year: '2026',
    tags: ['Brand System', 'Motion Design', 'Design System', 'Agent-Assisted Build', 'SVG', 'Accessibility'],
    role: 'Brand & Identity · Motion Design · Agent-Assisted Build (Web + React Native) · Design System Documentation',
    tools: ['Illustrator', 'Figma', 'Claude Code', 'VS Code', 'React Native', 'Reanimated', 'CSS'],
    timeline: 'August 2026 · shipped',
    stream: 'passion',
    groups: ['systems'],
    clientLabel: 'Personal product',
    featured: '/images/work/overscroll-tactics/lockup-resolved.png',
    // Deliberately not `featuredVideoPrimary`. A primary loop autoplays forever,
    // which would leave the card resting on a half-resolved frame and put the
    // ident on repeat — the one thing its own spec forbids. On hover instead,
    // the card rests on the finished mark and the ident plays when someone
    // engages it, which is the cold-boot gesture it was designed for.
    featuredVideo: '/images/work/overscroll-tactics/cover-loop.mp4',
    timeToLive: 'Mark to shipped ident in about three weeks, across a static site and a React Native app.',
    metrics: [
      { value: '2 runtimes', label: 'One geometry: CSS keyframes on web, Reanimated + SVG in the app' },
      { value: '~2.2s', label: "Full ident runtime: once per cold launch, never loops" },
      { value: '4 pieces', label: 'Tetrominoes filling a 4×4 board, every path collision-legal' },
      { value: '1 path', label: 'The resolved mark hands off to a single canonical path, no seams' },
    ],

    problemPunch: 'PlayDraft had a brand. The studio shipping it did not exist.',
    problem: [
  "PlayDraft needed a studio identity behind it. I wanted OTC as the abbreviated mark: Overscroll connects to my front-end craft, and Tactics reflects the strategy in the games and products I build. The parent name had to leave room for work beyond games.",
  "The mark also had to work as a small favicon and as a cold-launch moment in the app. I wanted both to come from the same geometry."
],

    gapsPunch: 'The first ident was motion graphics wearing a game costume.',
    gaps: [
      'The first version stacked blocks upward until they assembled the mark. It read well and it was wrong: the blocks obeyed no rules, so the assembly was arbitrary. Decoration that happened to be block-shaped.',
      'If a studio makes games, the ident should be one. Not a reference to a game; an actual played board, with legal moves, that resolves into the mark.',
    ],

    constraintsPunch: "A brief cold-launch moment, two runtimes, one geometry.",
    constraints: [
      "Once the concept worked, speed mattered. I aimed for roughly 1.5 seconds for the emblem to resolve, with the ident limited to cold launch. The full sequence is currently documented at about 2.2 seconds.",
      'Repeated flashing above three per second is a seizure risk (WCAG 2.3.1).',
      'Compositor-safe properties only, and the finished box is reserved before the ident mounts so nothing reflows behind it.',
      'The assembly is falling-block inspired and stays that way: no borrowed branding, signature colours, or game UI.',
    ],

    approachSubsections: [
      {
        key: 'mark',
        label: 'One geometry, written down as rules',
        systemMarker: 'BRAND SYSTEM',
        description:
          'A compact silhouette: a rounded arch, a knocked-out wheel slot, and exactly three descending steps along the bottom. The rules that keep it intact are written as non-negotiables: the wheel is a knockout that shows the ground behind it, never a painted fill; the mark at rest is flat ink; and orange is reserved for motion, focus and interaction, never for the resting mark.',
        images: [
          {
            src: '/images/work/overscroll-tactics/lockup-resolved.png',
            alt: 'The resolved OTC Games lockup: a compact arched mark with a knocked-out wheel slot and three descending steps, beside custom OTC GAMES lettering.',
            layout: 'full',
            caption: 'The finished lockup. The lettering is custom artwork, not a typeface. The UI face is Montserrat and never sets the logotype.',
          },
        ],
      },
      {
        key: 'game',
        label: 'The ident plays an actual game',
        systemMarker: 'MOTION',
        description:
          'Four tetrominoes (I, O, J and L) fill a 4×4 board laid over the mark’s own footprint. Pieces enter from the top, move in whole-cell steps, and every path is collision-legal against the stack already there: the I hard-drops as the floor, the O steers left onto it, the J caps the O, and the L completes the board. The quantised step is the whole idea. A smooth glide would read as motion graphics again.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/overscroll-tactics/board-complete.png',
            alt: 'Four tetromino pieces filling a four-by-four board exactly, with white seams showing the boundary between each piece.',
            layout: 'half',
            caption: 'The board at lock: four pieces, no gaps. The die-cut ignores the seams.',
          },
          {
            src: '/images/work/overscroll-tactics/cut-pass.png',
            alt: 'A dark blade sweeping across the stack, revealing the studio mark behind it while the block stack remains ahead of it.',
            layout: 'half',
            caption: 'The cutter pass: one clip reveals the mark behind the blade, another hides the stack ahead of it.',
          },
        ],
      },
      {
        key: 'cut',
        label: 'The logo is the waste product',
        systemMarker: 'THE PAYOFF',
        description:
          'A blade sweeps the finished board and die-cuts the mark out of it. The offcuts are real: each scrap is a plain rectangle trimmed by a mask of everything inside the board that is not the mark, so the waste matches the cut exactly and no scrap is drawn by hand. Freed pieces fall behind the sheet. The same blade then types the wordmark on, one glyph per step, the way a high-score line resolves.',
      },
      {
        key: 'ports',
        label: 'Two runtimes, one source of truth',
        systemMarker: 'IMPLEMENTATION',
        description:
          'Web: CSS keyframes over inline SVG, no library. App: Reanimated and react-native-svg, which cost three lessons.',
        bullets: [
          'Animated props bypass react-native-svg prop parsing; an animated transform or points string silently fails to render. Every moving shape is a rect driven by y.',
          'Nothing animates a group, so the wordmark rides a plain Animated.View outside the SVG.',
          'Every property derives from one linear clock, so reduced motion is one assignment to the end state, not a second timeline.',
        ],
      },
    ],

    outcomeNote:
      'Live at overscrolltactics.com, and shipping inside PlayDraft on every cold launch. The gate mounts the app tree behind the ident rather than after it, so by the time the mark clears, the first screen is already there. Under reduced motion both ports render the finished mark immediately, with no moving parts.',
    takeaways: [
      'An ident that plays on every loading state burns out. The app gates it to once per launch, not once per mount.',
      'The clear pulsed twice in an early version. Repeated flashing is a seizure risk under WCAG 2.3.1, so it is now one pulse and a cutter pass.',
    ],
    outcomeImages: [
      {
        src: '/images/work/overscroll-tactics/site-home.png',
        alt: 'The OTC Games homepage: the resolved lockup centred on paper with navigation and a line introducing the studio behind PlayDraft.',
        layout: 'full',
        caption: 'overscrolltactics.com. The ident runs once on load, then rests as the static lockup.',
      },
    ],
    outcomeLiveLinks: [
      { label: 'overscrolltactics.com', url: 'https://overscrolltactics.com/' },
    ],
    outcomeLiveLinksLabel: 'The studio site is live',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Internal agentic photography tool. Hidden (direct-link only) until a cover
  // image lands and confidentiality framing is signed off — promote to the
  // featured grid then. Framed at the workflow/process/AI-exploration level;
  // no proprietary internals exposed.
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'photography-workflow-agent',
    stream: 'professional',
    hidden: true,
    client: 'Internal Tool',
    context: 'This project supports an internal photography team preparing and reviewing images for digital production. The team needs tools it can use directly in its daily workflow.',
    title: 'Photography Workflow Agent',
    seoTitle: 'Photography Workflow Agent: AI-Assisted Internal Design Tooling',
    summary: 'A zero-install internal tool that packages a repetitive photography workflow into one interface the team can run, preview, and check themselves. I used Claude to accelerate the build, then tested it against the team’s real tasks.',
    year: '2026',
    tags: ['Agentic Workflow', 'Internal Tools', 'AI-Assisted Product', 'UX Engineering', 'Production Systems'],
    role: 'Product Design · UX Engineering · AI-Assisted Build',
    tools: ['Claude', 'Claude Code', 'HTML/CSS/JS', 'Design Tokens'],
    timeline: 'Self-started internal build, 2026',
    timeToLive: 'In use by the internal photography team; ongoing refinement.',

    problemPunch: 'Repetitive, judgment-heavy image production steps were slowing a real team down.',
    problem: [
      'The photography team repeated the same preparation and review steps by hand. The work needed judgment, but too much of the time went to setup and mistakes surfaced late.',
      'The tool needed to handle the repeatable parts while keeping the review decision with the person who understood the image.',
    ],

    gapsPunch: 'A tool, not a deck. Built to be used, not presented.',
    gaps: [
      'Off-the-shelf editors did not match the team’s sequence of decisions. The useful part was fitting their actual workflow, not adding another general image tool.',
      'It needed to run with zero setup friction for non-technical users and produce output they could trust at a glance.',
      'A convincing demo was not enough. The test was whether the team chose it for a real task the next day.',
    ],

    constraintsPunch: 'Self-started. Zero-install. Real users on day one.',
    constraints: [
      'I started it alongside core project work, so the first release had to solve one useful path instead of covering every edge case.',
      'Had to be usable by the photography team directly, with no install step and no technical onboarding.',
      'Operational details stay private. This case study can show the workflow and build approach without exposing the team’s internal process.',
    ],

    insightCallout: 'Claude made the first working version cheaper to reach. The design work was deciding which steps could be automated, where the team still needed control, and what the preview had to prove before anyone could trust it.',

    approachSubsections: [
      {
        key: 'alignment',
        label: 'Separating the repeatable steps from the judgment',
        description: 'I mapped the team’s actual steps, where the time went, and what they checked before calling a result finished. That separated the repeatable setup from the judgment the tool should leave alone.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Inputs beside a live preview, in one screen',
        description: 'I kept the workflow in one screen, with inputs beside a live preview. Each change becomes visible before export instead of turning into a problem at the next review.',
        images: [],
      },
      {
        key: 'build',
        label: 'Claude scaffolded it; I decided what it could assume',
        description: 'Claude helped structure the first logic and scaffold the interface. I set the interaction model, connected it to the existing design tokens, checked the output against real examples, and tightened the behavior when the generated version made a wrong assumption.',
        images: [],
      },
      {
        key: 'iteration',
        label: 'Real tasks changed the flow, the preview, and the labels',
        description: 'I tested the tool on real tasks with the team and watched for the places it added work instead of removing it. Those sessions changed the flow, the preview, and the labels before the tool became part of the routine.',
        images: [],
      },
    ],

    outcomeNote: 'The photography team now uses the tool directly, with no install step or technical handoff. It makes the repeatable work faster and shows the result early enough to catch a bad decision before export. Claude accelerated the build, but adoption came from matching the team’s real sequence and leaving the final judgment with them. The operational details remain private, so this entry stays at the workflow level.',
    metrics: [
      { value: 'Self-started', label: 'Built alongside core work' },
      { value: 'Zero-install', label: 'Runs for non-technical users day one' },
      { value: 'In use', label: 'Adopted by a real internal team' },
      { value: 'AI-assisted', label: 'Claude accelerated the working build' },
    ],
  },
];

// Compact editions reference the original artifacts so captions, crops, and
// provenance stay attached. The full narrative remains available on demand.
/** Any image the full study defines, found by a fragment of its path. */
const findImage = (project: Project, needle: string): ProjectImage | undefined =>
  [project.studyHero, ...(project.problemImages ?? []), ...(project.gapsImages ?? []), ...(project.constraintsImages ?? []),
    ...(project.approachSubsections ?? []).flatMap(s => [...(s.images ?? []), ...(s.variants ?? []).map(v => v.image)]),
    ...(project.outcomeImages ?? []), ...(project.outcomeGridImages ?? [])].find(i => i?.src?.includes(needle));
const subsection = (project: Project, key: string) => project.approachSubsections?.find(s => s.key === key);

const evidence = (project: Project, key: string, index = 0): ProjectImage | undefined =>
  project.approachSubsections?.find(section => section.key === key)?.images?.filter(image => image.src && !image.isOverlay)[index];

const compactEditions: Record<string, (project: Project) => ProjectOverview> = {
  wheelrack: p => ({
    title: 'WheelRack', category: 'Professional work', role: 'I built the full design system and designed the complete dealer product, partnering with engineering on React and Storybook.',
    status: 'Live · Dealer platform',
    deck: 'Tokens, components, responsive rules, and edge cases became one shared library, applied across vehicle search, wheel fitment, and checkout for six retail partners.',
    ownership: p.ownership!, opening: p.studyHero,
    decisions: [
      { title: 'Make repeated controls predictable', body: 'I defined shared tokens and the resting, hover, and focus states of repeated controls. Those specifications gave the Figma library, Storybook, and React build a common vocabulary.', image: evidence(p, 'foundation') },
      { title: 'Put fitment inside the component', body: 'Front and rear configurations, finishes, availability, and partner-specific purchasing actions needed explicit variants. I resolved those combinations before the component was reused across the journey.', image: p.approachSubsections?.find(s => s.key === 'fitment')?.variants?.[0].image },
      { title: 'Specify behavior, then check the build', body: 'I specified behavior and responsive rules while Cheryl Carpenter owned the React web build. Reviewing it together sharpened my understanding of props, states, and reusable components: a foundation I later carried into building PlayDraft in React Native with agents.', bodyLink: { text: 'building PlayDraft in React Native', to: '/work/playdraft/' }, image: evidence(p, 'documentation'), quote: subsection(p, 'documentation')?.quote },
    ],
    outcome: 'The journey is live from vehicle selection through checkout. The framework later extended into Wholesale. Partner adoption grew during the build, but business factors also contributed; that growth is not a clean measure of design impact.',
    outcomeImages: [findImage(p, 'wheelrack-final-desktop-01')!],
  }),
  'design-enablement': p => ({
    title: 'Tools that scale design', category: 'Internal tools', role: 'Product design · AI-assisted build',
    status: 'In daily team use',
    deck: 'I built a browser-based crop simulator so Photography and Design could check an image against the live site before placing it in AEM. Shared Figma presentation components carry the work into stakeholder review.',
    ownership: 'I designed and built the tools alongside production work. Our AI team helped host the simulator internally behind company sign-in.',
    opening: evidence(p, 'crop-simulator'),
    decisions: [
      { title: 'Use the production rules in the preview', body: 'The simulator uses the live responsive CSS, gradients, and safe zones. Teams can compare desktop, tablet, and mobile crops before committing the image to a page.' },
      { title: 'Spend the review on the work', body: 'Reusable Figma layouts, charts, status markers, and callouts give stakeholder presentations a shared structure. The related Figma starter and plugin workflow covers project setup through handoff.', image: evidence(p, 'presentation'), bodyLink: { text: 'Figma starter and plugin workflow', to: '/work/figma-template-governance/' } },
    ],
    outcome: 'The photography task went from three steps to one. Teams now validate hero crops without placing an image in AEM first, and the presentation components reduce repeated review setup. I maintain the tools alongside production work.',
  }),
  'tire-categories': p => ({
    title: 'Tire Categories', category: 'Professional work', status: 'Live · 30+ category pages',
    deck: 'A shared icon, comparison, and content system helps shoppers choose a tire category without first becoming tire experts.',
    ownership: 'I designed the hierarchy and icon system and contributed page structure, chart motion, SVGs, and shared styles. Ransom Rockliffe owned SEO; engineering partnered on AEM components.',
    opening: evidence(p, 'system'),
    decisions: [
      { title: "Give a search visitor the essentials first", body: "SEO needed depth; shoppers needed a useful comparison. I brought the performance chart forward and reduced each category to three essential takeaways, so the page makes sense even when someone arrives directly from search.", image: p.outcomeImages?.[0] },
      { title: "Give each category a visual explanation", body: "Icons and purposeful photography show the strengths and driving conditions each category suits. The comparison chart also works without animation, with reduced-motion behavior, text fallback and screen-reader labels.", image: evidence(p, 'system') },
      { title: 'Let authors change the data', body: 'Reusable AEM components give content teams control of category copy and performance data without waiting for engineering.' },
    ],
    outcome: p.outcomeNote!,
    outcomeMetric: p.beat?.kind === 'metric' ? { value: p.beat.value!, label: p.beat.label, context: p.beat.context } : undefined,
  }),
  'seasonal-content-system': p => ({
    title: 'AEM Targeting & Seasonal Content', category: 'Professional work', status: 'Live · Ongoing seasonal ownership',
    deck: "More than twenty AEM Experience Fragments serve six pages through Adobe Target. The current program uses a geo-based audience split, with seasonal imagery and content order adapted for winter and southern-state customers.",
    ownership: 'I designed the fragment architecture, authored and deployed content, documented the workflow, and trained junior designers. I still own system rules and final review.',
    opening: { src: p.featured, alt: 'AEM winter seasonal content, homepage project card', layout: 'full' },
    decisions: [
      { title: 'Map the content to its audience', body: 'Five fragment types organize seasonal heroes, teasers, video, entertainment, and category bars. I coordinate the regional audience split with Analytics so each page receives the intended experience.', image: p.outcomeImages?.[0] },
      { title: 'Trace each swap through Figma, AEM, and Target', body: 'I map each Figma section to its AEM Experience Fragment and document matching names. Designers can trace a seasonal asset to the fragment and Adobe Target experience that uses it. I retain approval and responsibility for exceptions.' },
      { title: "Keep seasonal changes visible without changing the page text", body: "Natural-search traffic to swapped pages declined over successive years. After reviewing it with SEO, we shifted toward visual winterization in 2025 and 2026 while keeping text consistent on the same URLs. We swap imagery or change content order for seasonal and geographic audiences, with SEO reviewing the annual refresh." },
    ],
    outcome: 'The geo-based seasonal program is live. Two junior designers author the swaps, and I handle final review and AEM/Target sync issues. Winter conversion has generally strengthened, but weather, marketing, and product changes also contribute.',
  }),
  heatherwood: p => ({
    title: 'Heatherwood', category: 'Independent client work', status: 'Live · Owner-managed WordPress site',
    deck: 'A riding academy’s brand and website, organized around the services families search for and built for its owner to maintain.',
    ownership: 'I designed the identity and website, built it in WordPress, configured forms and search basics, and trained founder Deborah Clements to manage the content.',
    opening: evidence(p, 'system'),
    decisions: [
      { title: 'Give every service its own entrance', body: 'Dedicated service pages answer parent questions and offer a relevant contact form. Families can arrive directly at the activity they searched for.', images: [evidence(p, 'system', 1)!, { ...findImage(p, 'heatherwood-final-mobile-01')!, mobile: false, frame: 'phone' }] },
      { title: 'Carry one identity across the site', body: 'Logo, color, and typography rules extend into reusable service cards, FAQ accordions, and contact sidebars, and off the screen onto the roadside sign.', images: [evidence(p, 'system')!, findImage(p, 'heatherwood-notes-01')!] },
      { title: 'Design the handover, too', body: 'WordPress, Elementor, and clear training let Deborah update content independently. The site did not require an ongoing developer relationship to stay useful.' },
    ],
    outcome: 'Deborah still manages the content herself. Rough inbox counts rose from three or four inquiries a month to four or five a day in the weeks after launch. These are unfiltered form counts; the change reflects brand, content, search, and the inquiry path together.',
    outcomeImages: [findImage(p, 'heatherwood-final-desktop-01')!],
  }),
  'landing-pages': p => ({
    title: 'Landing Page System', category: 'Professional work', status: 'Live · Governed AEM templates',
    deck: 'Fifty-plus landing pages taught me which layouts kept repeating. I turned those patterns into AEM templates, with component variants and permissions that let junior designers build within the system.',
    ownership: 'I designed and built the pages, defined the template patterns, and documented authoring rules. Two junior designers use them; I review component changes and exceptions.',
    opening: p.outcomeImages?.[0],
    decisions: [
      { title: 'Choose a starting point for the brief', body: 'Size, category, promotion, and product-launch pages have recurring layouts. I assemble those layouts from the shared library in Figma, then authors adapt the content in AEM.', image: liveComponent('teaser-lighting', 'Three product teaser cards on the live Tire Rack lighting page', 'One Teaser pattern, repeated for lighting advice and shopping links. Live capture, October 7, 2026.') },
      { title: 'Keep the answer close to the product', body: 'SEO briefs set the heading, metadata, and search intent. Shared FAQ accordions let authors put the supporting answers on the page, with the same interaction across shipping, support, and category content.', image: liveComponent('accordion-shipping', 'Shipping FAQ accordion on the live Tire Rack site', 'The shared Accordion in use on Shipping. Live capture, October 7, 2026.') },
      { title: 'Match the review to the risk', body: 'Template permissions define what authors can edit. High-impact pages go through senior, SEO, analytics, and QA review; lower-risk pages receive senior review and live validation. Requests beyond the template become scoped changes to the AEM component foundation.', image: liveComponent('hero-suspension', 'Thin Hero Teaser on the live Tire Rack suspension page', 'The thin Hero Teaser gives category pages a shared starting point. Live capture, October 7, 2026.'), bodyLink: { text: 'AEM component foundation', to: '/work/aem-component-system/' } },
    ],
    outcome: 'Two junior designers use the templates. Complex pages take one or two weeks instead of about a month; standard pages about a week, and simple launches a day or two. The October 7 inventory shows the shared components in use across category and support pages. Migration and content QA continue.',
    outcomeImages: [findImage(p, 'landing-pages-full-page-layouts')!, findImage(p, 'landing-pages-product-mobile')!],
  }),
  'aem-component-system': p => ({
    title: 'AEM Components', category: 'Professional work', status: 'Live components · CSS overhaul in branch · Homepage concepts in Figma',
    deck: 'One component crosses three surfaces: drawn and given a test in Figma, selected by an author in the AEM editor, shipped as a rule in the Sass branch. A seven-page guide keeps the rules, classes, and edge cases together, and a homepage exploration file holds the next options with a test plan behind each one.',
    ownership: 'I measured the components, defined the rules and edge cases in Figma, wrote the Sass, and built the author references. I also own the homepage exploration and its test plan. The components came from the 2024–2025 rebuild I led.',
    opening: evidence(p, 'explore'),
    decisions: [
      { title: 'Draw the concept and its test together', body: 'The homepage exploration holds a concept for each section rather than one redesign. Each concept carries a written hypothesis, the data to request, a fifteen-topic customer survey, and the order in which tests can run without colliding with the ones already scheduled. Removals carry their reasons.', images: [PLAN.order, PLAN.tests, NOTES.howItWorks, NOTES.promo] },
      { title: 'Explore section by section, then refine the components from the research', body: 'Three concept pages tried different treatments below the hero, and six boards put one section in focus at a time: new tires, brands, the test track, reviews, the pledge, and articles. What survived became one refined page at desktop and phone widths, built from the components the guide defines, with the vehicle selector as the one new component.', images: [FOCUS.conceptA, FOCUS.newTires] },
      { title: 'Measure the build, then write the rule', body: 'Pixel values come from local AEM builds of the branch, measured at widths from 375 to 1920 pixels. The read-me page sets the frame every component shares, and a status legend marks each rule as in the branch, configured only on local AEM, or still pasted into the page.', image: GUIDE.readMe },
      { title: 'Reuse first, then a variant, then a named gap', body: 'A full-bleed color band is two existing containers nested together, not a new component. Copy Width and the Flex Container extend the existing layout container. The tire size table was a real gap, so I documented it as rendered today and recommended moving its pasted CSS into the branch.', images: [GUIDE.flex, GUIDE.table] },
      { title: 'Define the edge case, then fix it in Sass', body: 'Each change in the branch is listed beside the behavior it replaced: hero buttons that overflowed 375px phones, featured images pinned to the top of a tall row, and a red text-link arrow that could wrap onto a line by itself.', images: [GUIDE.heroUpdates, GUIDE.teaserBeforeAfter], points: subsection(p, 'build')?.bullets, code: subsection(p, 'build')?.codeBlock },
      { title: 'Show authors what to select, and keep the target in view', body: 'High-fidelity references recreate the AEM editor around live heroes, with numbered steps from selecting the component to the classes that result. The exploration ends in one target homepage at desktop and phone widths, built from the same components. The guide is where each option lands once it has a rule, a class, and a picture.', images: [GUIDE.heroAuthor, GUIDE.heroPreview], artboards: [REFINED.desktop, REFINED.phone] },
    ],
    outcome: 'The CSS overhaul is in branch, and the guide covers seven component pages. Template settings still need to move into ui.content before release, and the table stays inline until its rules move under Tr Table. The homepage exploration holds the next options with a test behind each one. The core components from the earlier rebuild are live, and WebPageTest reported 60% faster loads on pages using them. With the Figma MCP connection I now push between code and Figma in both directions, under the governance skill I built.',
    relatedNote: { href: '/notes/the-line-between-figma-and-the-codebase/', label: 'Read why the line between Figma and the codebase is getting thinner' },
  }),
  loopstack: p => ({
    title: 'LoopStack', category: 'Personal product', status: 'TestFlight · Personal pattern-review tool',
    deck: "A personal Type 1 diabetes app for following repeat meals through their full glucose-response window and reviewing recurring patterns with the evidence beside them.",
    ownership: 'I designed and built the product with AI assistance and tested it against my own Loop data. It supports pattern review and care-team discussion, not dosing advice.',
    opening: p.approachSubsections?.flatMap(s => s.images ?? []).find(i => i.isVideo && i.src),
    decisions: [
      { title: "Follow the response beyond the meal", body: "I wanted to see what a repeat meal did over its full absorption window. Ingredients, timing and activity stay beside the glucose curve, so I can compare the response with earlier meals.", image: evidence(p, 'structure') },
      { title: 'Say where each number comes from', body: 'Real data sources replace repeated manual entry, while sample data is labeled. Observations stay alongside settings rather than replacing them.', image: evidence(p, 'system', 1) },
      { title: 'Require repetition before confidence', body: "Repeat meals and time-of-day patterns help me review questions about sensitivity, meal boluses and background insulin alongside my Loop settings. Confidence reflects the supporting history. The app keeps those observations in review scope, without recommending changes.", images: [evidence(p, 'iteration')!, findImage(p, '04_fix_log')!] },
    ],
    outcome: p.outcomeNote!,
  }),
  'overscroll-tactics': p => ({
    title: 'Overscroll Tactics', category: 'Studio identity', status: 'Live · Web and PlayDraft',
    deck: "A studio identity with room beyond games. Overscroll connects to my front-end craft; Tactics reflects product strategy. OTC Games carries that identity into PlayDraft.",
    ownership: 'I designed the identity, motion, and documentation, then built the web and React Native implementations with agent assistance.',
    opening: evidence(p, 'mark'),
    decisions: [
      { title: 'Write down the geometry', body: 'The arch, knocked-out wheel slot, and three descending steps stay fixed. The resting mark is flat ink; orange belongs to interaction and motion.', image: evidence(p, 'mark') },
      { title: 'Make the ident obey the game', body: 'Four pieces fill the board through collision-legal, whole-cell moves. The completed stack supplies the material for the cut.', image: evidence(p, 'game') },
      { title: "Give the brand a brief moment", body: "The emblem needed to resolve quickly, then give way to the app. I kept the ident to cold launch and let the app load behind it. Reduced motion goes straight to the finished mark.", image: evidence(p, 'game', 1) },
    ],
    outcome: 'Live on the studio website and inside PlayDraft. The app mounts behind the ident, so the first screen is ready when it clears. Both versions show the finished mark immediately with reduced motion.',
  }),
  'bolus-binder': p => ({
    title: 'T1D Hub + Bolus Binder', category: 'Brand system · Companion app', status: 'Brand v1.0 · App in TestFlight',
    deck: 'I built the T1D Hub brand identity and design system with Dr. Brian Huber’s Type 1 practice, then carried that system into Bolus Binder, a companion app for seeing how a meal is likely to metabolize before you cook it.',
    ownership: 'In partnership with Brian I oversee the T1D Hub brand, from the logo and design system to the site his marketing team runs. I own the product direction, UX/UI and agent-assisted React Native build of Bolus Binder.',
    decisions: [
      { part: 'T1D Hub · Brand identity & design system', title: 'Draw the mark around the line a Type 1 reads every day', body: 'A CGM trace runs through the wordmark, entering at the T and holding the name together. It has to stay connected in every configuration, so the four approved lockups ship with their rules written beside them: never remove the trace, never use it below 28px, and never change the navy and sky split.', image: findImage(p, 't1dhub-logo-system') },
      { part: 'T1D Hub · Brand identity & design system', title: 'Give the practice a system it can extend without me', body: 'Design System v1.0 went to Brian in June 2026 as a working site: twelve color tokens with clinical meaning, Sora and Inter for type with JetBrains Mono for data, components, a CGM chart language, calm motion rules, and the brand on the website, an office wall, slides and business cards.', images: [findImage(p, 't1dhub-color-system')!, findImage(p, 't1dhub-type-system')!] },
      { part: 'T1D Hub · Brand identity & design system', title: 'Hand off a vision, so the next team extends instead of redesigning', body: 'With the logo files and web assets went a future-vision handoff for Brian’s marketing team or an agency: a patient portal and education platform that starts with an onboarding questionnaire, then a personalized dashboard, an education library organized as courses, and a community space. Its first instruction is to build on the existing logo and design system rather than redesign the brand. One of its pillars, nutrition and metabolic response, is where Bolus Binder comes in.' },
      { part: 'Bolus Binder · The companion app', title: 'Make portions change the whole meal', body: 'Bolus Binder runs on the same system. Portion changes update the ingredient quantities and nutrition together, and the collapsed header keeps the portion and macro totals visible as I move through the recipe.', image: { src: '/images/work/bolus-binder/app/06-recipe-detail-collapsed.png', alt: 'Collapsed recipe header keeps the scaled portion and nutrition totals visible', layout: 'half', crop: { x: 0, y: 150, width: 1206, height: 1550, sourceWidth: 1206, sourceHeight: 2622 }, caption: 'Scaled portion and nutrition context · seeded demo data.' } },
      { part: 'Bolus Binder · The companion app', title: 'Separate estimates from observations', body: 'The nutrition view labels the absorption pattern as estimated. It is not measured CGM data or a dosing recommendation, and it uses the clinic’s chart colors with the same meanings. Reviewing observed glucose patterns belongs to the separate LoopStack exploration.', bodyLink: { text: 'LoopStack exploration', to: '/work/loopstack/' }, image: { src: '/images/work/bolus-binder/app/07-nutrition-expected-response.png', alt: 'Nutrition view marks its absorption pattern as Estimated', layout: 'half', crop: { x: 0, y: 1220, width: 1206, height: 1350, sourceWidth: 1206, sourceHeight: 2622 }, caption: 'Estimated pattern, not an observed glucose response.' } },
    ],
    outcome: 'The T1D Hub brand and design system are with the practice and its marketing team. Bolus Binder is in TestFlight; these captures document implemented flows with demo data, not validated health outcomes. Observed glucose integration remains future work.',
    outcomeImages: [{ ...findImage(p, 't1dhub-cgm-visual-language')!, layout: 'full' }],
  }),
};

for (const project of projects) {
  const edition = compactEditions[project.slug];
  if (edition) project.overview = edition(project);
  // Bolus uses original simulator captures and the existing CSS crop treatment.
  if (project.slug === 'bolus-binder') continue;
  const images = [project.overview?.opening, ...(project.overview?.decisions.map(decision => decision.image) ?? [])];
  for (const image of images) {
    if (!image?.src || !image.crop) continue;
    // V2 native evidence uses untouched PNGs and CSS framing, with no generated crop derivative.
    if (image.src.startsWith('/images/work/playdraft/v2/')) continue;
    const { x, y, width, height } = image.crop;
    const stem = image.src.split('/').pop()!.replace(/\.[^.]+$/, '');
    image.displaySrc = `/images/work/${project.slug}/overview-samples/${stem}-${x}-${y}-${width}-${height}.webp`;
  }
}

/**
 * The one order every surface follows: the homepage cards, the navigator, the
 * prev/next links on a study and the site index. It used to live in
 * toolCoins.ts as the card list, so the index and the study pager disagreed
 * with the home. Page 1 of the home is the first three: WheelRack, PlayDraft,
 * AEM. A visible study missing from this list is appended, never dropped.
 */
// Ordered for design-engineering reviews (23 Oct 2026, the ContinuED Senior
// Design Engineer review): Figma-to-code systems, code prototypes, Figma
// plugins and a multi-surface system lead; commerce outcomes follow.
export const WORK_ORDER = [
  'wheelrack',
  'design-enablement',
  'playdraft',
  'aem-component-system',
  'figma-template-governance',
  'bolus-binder',
  'tire-categories',
  'loopstack',
  'landing-pages',
  'seasonal-content-system',
  'overscroll-tactics',
  'heatherwood',
];

/**
 * Ryan's best work: the first cards the work section opens on, at the head of
 * All, before the arrows page on through WORK_ORDER. Kept apart from
 * WORK_ORDER so the pick can change without reordering anything else; every
 * slug here must also be in WORK_ORDER.
 */
export const FEATURED: readonly string[] = ['wheelrack', 'design-enablement', 'playdraft'];

/** Visible studies in WORK_ORDER, with any unlisted study after them in file order. */
export const orderedProjects = (): Project[] => {
  const visible = projects.filter((project) => !project.hidden);
  const rank = new Map(WORK_ORDER.map((slug, index) => [slug, index]));
  return [...visible].sort((a, b) => (rank.get(a.slug) ?? WORK_ORDER.length) - (rank.get(b.slug) ?? WORK_ORDER.length));
};

/**
 * What stands in for the employer on a locked surface.
 *
 * A descriptor rather than a blackout bar or a bare "Confidential client". A bar
 * removes information without substituting any; a descriptor withholds the name
 * while still telling a reader what kind of company and what scale of problem
 * this was, which is what makes an anonymised case study credible instead of
 * evasive. Deliberately claims no ranking: nothing here needs substantiating.
 */
export const ANON_CLIENT = 'A national US online tire & wheel retailer';

/**
 * The client name a card or navigator row may show. Same disclosure rule as
 * ProjectBrand and the study page: the employer stays anonymous until unlock,
 * and WheelRack keeps its own public name while its client line still hides.
 */
export const clientLabelFor = (project: Pick<Project, 'client' | 'clientLabel'>, locked: boolean): string => {
  if (locked && project.client.startsWith('Tire Rack')) return ANON_CLIENT;
  return project.clientLabel ?? project.client;
};

/**
 * The one short name a study goes by wherever it is listed: the homepage card
 * and index row, the Asset Panel and its folders. The study page keeps its
 * full `title` as its heading. Short names used to live in a second map inside
 * the work section, so most studies carried two names on one screen.
 */
export const cardTitleFor = (project: Pick<Project, 'cardTitle' | 'title'>): string => project.cardTitle ?? project.title;

/**
 * The span a listing shows, from the first year the study names to the last:
 * "2023 to 2024 design · 2026 launch" is 2023–2026, "2013–Present" stays as it
 * is. `year` itself stays a sentence for the study page, which has room for it.
 */
export const yearSpanFor = (project: Pick<Project, 'year'>): string => {
  const years = (project.year.match(/\d{4}/g) ?? []).map(Number);
  if (years.length === 0) return project.year;
  const first = Math.min(...years);
  if (/present/i.test(project.year)) return `${first}–Present`;
  const last = Math.max(...years);
  return first === last ? `${first}` : `${first}–${last}`;
};

export default projects;
