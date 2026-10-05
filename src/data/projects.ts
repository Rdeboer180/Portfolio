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

export interface ProjectImage {
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
  relatedNote?: { href: string; label: string };
  decisions: { title: string; body: string; bodyLink?: { text: string; to: string }; image?: ProjectImage }[];
  outcome: string;
}

export interface Project {
  overview?: ProjectOverview;
  slug: string;
  client: string;
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
  /** Case-study hero reel, distinct from the short homepage card loop. */
  featuredReel?: { src: string; poster: string; alt: string; caption?: string };
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
  timeToLive?: string;

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

const projects: Project[] = [
  // =============================================
  // 0. WheelRack — Design System & Customer Journey  [image LEFT]
  // =============================================
  {
    slug: 'wheelrack',
    stream: 'professional',
    client: 'Tire Rack · WheelRack',
    title: 'WheelRack: A complete design system and dealer product',
    cardTitle: 'WheelRack: Design system to full product',
    seoTitle: 'WheelRack: Enterprise React Design System for a Wholesale Ecommerce Platform',
    thesis: 'Shared rules for the details that make wheel fitment complicated.',
    summary: 'I built WheelRack’s complete design system and designed the full dealer product, from vehicle search through checkout. I defined tokens, components, responsive behavior, and edge cases, partnering with engineering on the React and Storybook implementation across six retail partners.',
    ownership: 'I owned the complete design system, product design, and behavior specifications. Cheryl Carpenter owned the React build; we worked together on implementation and review.',
    cardHook: 'I built the full design system, partnered with engineering on React and Storybook, and designed the complete dealer product—edge cases included.',
    compactStory: true,
    annotations: {
      problem: 'Dealers were already on tablets. The interface had to catch up.',
      approach: 'The difficult states belong in the system, too.',
      outcome: 'The framework outlived the project. Wholesale picked it up next.',
    },
    openerSchematic: true,
    year: '2023 to 2024 design · 2026 launch',
    tags: ['Design Systems', 'Product Design', 'Responsive', 'Storybook'],
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
    thesis: 'Turn 40 confusing categories into choices people can actually make.',
    annotations: {
      problem: 'Too many choices, too much text. People could not decide.',
      gaps: 'No visual language existed yet. I had to build the system and the vocabulary.',
      constraints: '40+ categories, 80+ products each, SEO fighting usability.',
      approach: 'Balancing data with intuition: eight core icons, not ninety.',
      outcome: 'Category entry jumped, and the icon system went sitewide.',
    },
    stream: 'professional',
    client: 'Tire Rack',
    title: 'Tire Category Page Redesign & Optimizations',
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
    client: 'Bolus Binder (personal product) · T1D Hub (local clinic)',
    title: 'Bolus Binder: A diabetes-aware recipe keeper',
    cardTitle: 'Bolus Binder: Cooking comes first',
    cardHook: 'I designed and built a React Native recipe app around living with Type 1 diabetes, keeping portions, nutrition, and meal planning close to the food.',
    cardStatus: '[ In TestFlight ]',
    seoTitle: 'Bolus Binder: a diabetes-aware recipe app in React Native, on the T1D Hub design system',
    summary:
      'I designed and built a React Native recipe app around my own Type 1 diabetes workflow: saving recipes, adjusting portions, planning meals, and keeping nutrition context close to the food.',
    thesis: 'Save the recipe. Understand the meal.',
    year: '2026',
    tags: ['Product Design', 'Mobile (iOS)', 'Brand System', 'Design System', 'Health Data', 'React Native'],
    role: 'Product Design · Brand & Design System · Agent-Assisted Build (React Native)',
    tools: ['Figma', 'React Native', 'Expo', 'Claude', 'VS Code'],
    timeline: 'April → August 2026 · TestFlight',
    stream: 'passion',
    featured: '/images/work/bolus-binder/bolus-binder-app-preview-poster.jpg',
    featuredVideo: '/images/work/bolus-binder/bolus-binder-app-preview.mp4',
    featuredReel: {
      src: '/images/work/bolus-binder/bolus-binder-app-preview.mp4',
      poster: '/images/work/bolus-binder/bolus-binder-app-preview-poster.jpg',
      alt: 'Bolus Binder recipe library, recipe detail, nutrition, recipe folders, meal planning, and cook mode',
      caption: 'A sequence of simulator stills with seeded demo data, captured in August 2026. Not an interaction recording.',
    },
    timeToLive:
      'Concept in April, named in August, TestFlight build running now.',
    metrics: [
      { value: 'React Native + Expo', label: 'Agent-assisted iOS build' },
      { value: 'v1.0', label: 'T1D Hub design system, delivered June 2026 for a local Type 1 clinic' },
      { value: '12', label: 'Color tokens carrying clinical semantics: in range, above range, urgent low' },
      { value: '3', label: 'Type roles: Sora for display, Inter for body, JetBrains Mono for data' },
    ],

    problemPunch: 'Cooking and nutrition context belong together.',
    problem: [
  "Living with Type 1 diabetes, I wanted the recipe to come first. I wanted space to make and enjoy a meal, then keep the portions and nutrition context available when I returned to it."
],

    gapsPunch: 'A portion change should update the whole recipe.',
    gaps: [
      'Changing the portion needed to update ingredients and nutrition together. Saved recipes, versions, and cooking history also needed to remain useful when I returned to a meal.',
],

    constraintsPunch: 'Describe behavior, never prescribe a dose.',
    constraints: [
      'The app presents nutrition context, estimates, and cooking history. It never tells anyone how much insulin to take, and the copy holds that line.',
    ],

    approachSubsections: [
      {
        key: 'model',
        label: 'Keep recipes, versions, and cooking events distinct',
        systemMarker: 'DATA MODEL',
        description:
          'Recipes retain their ingredients, steps, and saved versions. Cooking events build a separate log, so planning and cooking do not erase the recipe. Bolus Binder starts with food and nutrition context; LoopStack is a separate app for reviewing observed glucose patterns.',
      },
      {
        key: 'system',
        label: "A visual foundation from separate clinic identity work",
        systemMarker: 'BRAND + SYSTEM',
        description:
          "The visual language draws on the T1D Hub identity system I created for a local Type 1 clinic. That is a separate engagement. The brand boards shown here document its colors, type and logo rules, not the Bolus Binder app interface or clinic use of the app.",
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
            caption: 'Four approved configurations, with the constraints written next to them.',
          },
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-color-system.png',
            alt: 'T1D Hub color system: twelve tokens across navy, sky, neutral and alert families, plus four gradients.',
            layout: 'half',
            caption: 'Alert red, amber and green carry clinical meaning, so they are never used decoratively.',
          },
          {
            src: '/images/work/bolus-binder/supporting/approach/t1dhub-type-system.png',
            alt: 'T1D Hub type system: Sora ExtraBold for display, Inter for body, JetBrains Mono for glucose readings.',
            layout: 'half',
            caption: 'Mono is reserved for data, so a glucose number never reads as body copy.',
          },
        ],
      },
    ],

    outcomeNote:
      'The React Native app is in TestFlight. The simulator captures show implemented flows with demo data, not measured health outcomes or evidence of clinical adoption. Observed glucose integration remains future work.',
    outcomeImages: [
      {
        src: '/images/work/bolus-binder/supporting/outcome/t1dhub-cgm-visual-language.png',
        alt: 'CGM visual language: a 24-hour glucose trace with in-range, above and below bands, beside a Time In Range summary.',
        layout: 'full',
        caption: 'The chart language Bolus Binder inherits: green in range, amber above, red urgent low.',
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
    thesis: 'Documented well enough that someone else can run the season.',
    annotations: {
      problem: 'Manual seasonal updates, and everyone saw the same content.',
      gaps: 'No way to serve different regions without duplicating pages.',
      constraints: 'Google must not see duplicate pages. The content still has to change.',
      approach: 'Twenty swappable fragments, targeted by audience.',
      outcome: 'A decade in, two junior designers author it under my governance.',
    },
    stream: 'professional',
    client: 'Tire Rack',
    title: 'Seasonal Content Swap: AEM Experience Fragments & Adobe Target',
    seoTitle: 'Seasonal Ecommerce Content System: AEM Experience Fragments & Adobe Target',
    summary: 'I built and still govern an AEM system that swaps more than 20 seasonal fragments across six landing pages. The same URLs can serve winter and southern-state audiences without rebuilding the pages each year.',
    cardHook: 'Seasonal storefronts were rebuilt by hand every year. An AEM fragment system now swaps 20+ components a season through authoring, not development.',
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
        label: 'One architecture, twenty modules that swap at once',
        description: "I designed the Experience Fragment types, variant rules and swap logic so more than twenty modules could change without rebuilding the pages. The updated AEM core components give authors a shared structure for editing and replacing content across those surfaces.",
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
        description: "In 2018, I reduced swaps to the highest-traffic surfaces. Later, natural-search traffic to seasonally swapped pages declined over successive years. After reviewing that trend with SEO, we moved toward visual seasonal changes in 2025 and 2026 while keeping text consistent on the same URLs.",
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
    thesis: 'A brand and a site the owner could actually run herself.',
    annotations: {
      problem: 'Interest was there. The path to inquiry was not.',
      gaps: 'The brand had to come out of a phone-image dump.',
      constraints: 'No retainer after launch, so nothing could depend on me.',
      approach: 'More than ten front doors, one set of rules.',
      outcome: 'Inquiries went from a few a month to a few a day.',
    },
    stream: 'passion',
    client: 'Heatherwood Equestrian Academy',
    title: 'Heatherwood: A Brand and Site the Owner Can Run Herself',
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
    thesis: 'Make landing pages a system, not a fire drill.',
    annotations: {
      problem: 'Every landing page started from scratch. No templates, no patterns.',
      gaps: 'The same decisions, remade on every request.',
      constraints: 'Thin briefs, two audiences, AEM’s limits, and speed as the expectation.',
      approach: 'Invest in the system, and speed stops costing quality.',
      outcome: 'Turnaround went from a month to days, under one QA issue per page.',
    },
    stream: 'professional',
    client: 'Tire Rack',
    title: 'AEM Landing Page System & SEO Template Framework',
    seoTitle: 'AEM Landing-Page & SEO Template System for Ecommerce',
    summary: 'Designed 50+ landing pages personally, then built the governed AEM template system that two junior designers now use. Turnaround moved from ~1 month to 1\u20132 weeks for complex pages and 1\u20132 days for simple launches.',
    cardHook: 'Every landing page took a designer about a month. A governed AEM template system moved complex pages to 1\u20132 weeks. Junior designers ship them now.',
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
        images: [],
      },
      {
        key: 'structure',
        label: 'Assembled from patterns, not drawn from scratch',
        description: 'In Figma, I assemble the page from reusable hero, product, FAQ, promotion, and link patterns. The structure stays recognizable while the content and emphasis change with the query.',
        images: [],
      },
      {
        key: 'system',
        label: 'The recurring shapes became governed templates',
        description: "I turned recurring page layouts into templates for size, category, promotion and product launches. Pages are moving onto the shared AEM core component foundation, so the same authoring rules carry through different content needs.",
        images: [],
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
  // 5. AEM Component System Rebuild  [image RIGHT]
  // =============================================
  {
    slug: 'aem-component-system',
    thesis: 'Stop authoring and engineering from solving the same problem twice.',
    annotations: {
      problem: 'A decade of AEM authoring with no core system underneath.',
      gaps: 'No reusable patterns, no variables. The same work, done twice.',
      constraints: 'A live enterprise CMS and a dev team still learning the codebase.',
      approach: 'I wrote the specs and shipped the production Sass.',
      outcome: 'One system design, dev, SEO, and accessibility all build against.',
    },
    stream: 'professional',
    client: 'Tire Rack',
    title: 'AEM Component System Rebuild',
    seoTitle: 'Adobe Experience Manager Design System & Storefront Performance Rebuild',
    summary: 'I partnered with a new AEM engineering team to replace one-off authoring with more than ten reusable components. The components now power the homepage, tires hub, events, and packages pages, with WebPageTest showing 60% faster loads.',
    cardHook: 'Every page was a one-off build. Authoring was rebuilt around 10+ reusable core components. Pages load 60% faster, on a foundation design and dev share.',
    year: '2024\u20132025',
    tags: ['Design Systems', 'AEM', 'Front-End Development', 'UX Engineering', 'CMS'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'Sass', 'HTML/CSS', 'Git'],
    timeline: '~12 months (ongoing)',
    featured: '/images/work/aem-component-system/CS_thumbnail_AEM_componentSystemRebuild_safe.jpg',
    featuredVideo: '/assets/portfolio-safe/aem-component-system/cover-loop.mp4',
    timeToLive: '12 months from kickoff to live components. Core variants and templates now power the homepage and tires hub.',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'A decade of AEM authoring with no investment in core components, modern patterns, or a shared system.',
    problem: [
      'I had been authoring in AEM since 2013. In all that time, the team never adopted core components, editable templates, or a scalable pattern library.',
      'Every page was stitched together from aging custom components, one-off overrides, and asset dumps that slowed authoring and hurt page performance.',
      'In 2025 we hired a dedicated AEM engineering team, which made it possible to rebuild the foundation instead of adding another patch.',
    ],
    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No reusable patterns. No variable system. Authoring and engineering solving the same problems twice.',
    gaps: [
      'Heroes, product grids, and teasers existed in five different flavors. None of them shared structure, tokens, or authoring behavior.',
      'SEO and accessibility requirements were bolted on per page instead of baked into the component layer.',
      'No shared Sass variables or authoring defaults. Every new page meant re-deciding spacing, type scale, and responsive behavior.',
      'Design team had no documentation on when to use which component or how variants were meant to behave.',
    ],
    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Live enterprise CMS. SEO-critical surfaces. A new dev team still learning the codebase.',
    constraints: [
      'Work happened inside a live production AEM instance. Nothing could break authoring for merchandising or content teams mid-flight.',
      'Every component had to carry SEO and accessibility rules from the start: a lazy-load toggle, H1 limits per surface, an eyebrow slot for keyword headroom without breaking hierarchy, and Akamai scoping so a page loads only its own JSP and CSS.',
      'I completed AEM authoring certification, worked through Adobe\u2019s WKND tutorial, and deepened my Sass practice so I could contribute code beside the engineering team after the specs were written.',
      'Fifteen years of DAM debt came with the rebuild: tagging, alt text, file naming, and governance across 100+ images. I led that cleanup. Findable assets and faster authoring mattered as much as the load time.',
    ],
    insightCallout: 'The value was the shared system: variables, variants, and documentation that design, engineering, SEO, and accessibility build against. I wrote the component specs and shipped production Sass beside them.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: "Extend core components with clear exceptions",
        description: "I started with existing core components and exposed design choices through selectable style variants. The Hero needed its own heading-level options and an eyebrow integrated into the heading, unlike the full-width teaser. Keeping the other components under familiar core parents made onboarding and documentation clearer. Patrick Steins reviewed my branches, with SEO and accessibility requirements defined early.",
        images: [],
      },
      {
        key: 'structure',
        label: 'A written contract before any component was built',
        description: 'I wrote up each component: authoring fields, variants, responsive behavior, edge cases, and how it would plug into editable templates. Those write-ups became the contract that design and engineering built against.',
        images: [
          {
            alt: 'Placeholder for omitted internal component write-up artifact',
            layout: 'full',
            caption: 'Write-up available on request.',
            isOverlay: true,
            overlayText: "This part of the work includes internal tooling and workflows I cannot share publicly. I am happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'system',
        label: 'Eight variants, each shipping with its Sass and its docs',
        description: 'Built 8 core component variants directly (heroes, teasers, lists, featured product blocks), each shipping with its Sass, authoring defaults, and documentation at the same time. For 3 additional API-driven foundation components, I wrote the utility and authoring behavior, defined the interaction pattern, provided SCSS, and oversaw implementation through replication with the dev team.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/aem-component-system/FinalComponentBuildout_Hero_safe.jpeg',
            alt: 'Final hero component buildout showing variants and responsive behavior',
            layout: 'half',
            caption: 'Hero core: one component, multiple variants, consistent authoring',
          },
          {
            src: '/images/work/aem-component-system/FinalComponentBuildout_Teasers_safe.jpeg',
            alt: 'Final teaser component buildout with multiple layout variations',
            layout: 'half',
            caption: 'Teasers: built to handle editorial, promotional, and product surfaces from the same base',
          },
        ],
      },
      {
        key: 'build',
        label: 'The Sass I wrote is the Sass that shipped',
        systemMarker: 'Codebase',
        description: 'This was not a design-only handoff. I wrote the Sass, defined the global variable layer, and shipped component-level code alongside the dev team. That closed the gap between the design and what landed in production. File names in the excerpt below are redacted.',
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
          caption: 'From a component-scoped Sass file I authored: variables for responsive ceilings, CSS custom properties as the token layer, and nested component states.',
        },
        images: [],
      },
      {
        key: 'iteration',
        label: "Rebuild the pages, then make future variants easier",
        systemMarker: 'Documentation',
        description: "The new components required new core templates, so each page needed a full rebuild. That migration took months. Once those templates were in place, new component variants could be introduced without repeating the page overhaul. Documentation gives designers the fields, usage rules and responsive behavior for each variant.",
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: "Load-speed, screen-reader and SEO checks helped us decide to extend the rebuild across the site. The reported 60% load-speed improvement comes from WebPageTest on pages using the new components. Authors now work within shared core templates that can accept new variants, using the same fields and rules engineering supports.",
    takeaways: [
  "Most components extend familiar core parents through selectable styles. The Hero's different heading and eyebrow controls remain explicit in its authoring rules.",
  "Moving pages onto new templates took months. That investment made subsequent component variants easier to roll out.",
  "I wrote the production Sass alongside engineering, with branch review and shared documentation.",
  "The DAM cleanup covered tagging, alt text and file names across more than a hundred images."
],
    outcomeLiveLinks: [
      { label: 'Tire Rack Homepage', url: 'https://www.tirerack.com/' },
      { label: 'Tires Landing', url: 'https://www.tirerack.com/tires' },
      { label: 'Events & Sponsorship', url: 'https://www.tirerack.com/events' },
      { label: 'Packages', url: 'https://www.tirerack.com/packages' },
    ],
    metrics: [
      { value: '60%', label: 'Faster page loads (WebPageTest)' },
      { value: '10+', label: 'Reusable components shipped to production' },
      { value: '15 yrs', label: 'DAM governance debt resolved' },
    ],
  },

  // =============================================
  // 5b. Design Enablement Platform — internal tooling  [agentic build]
  // =============================================
  {
    slug: 'design-enablement',
    thesis: 'The design system had to travel with the work.',
    annotations: {
      problem: 'Repetitive design work and messy handoffs slowed the team down.',
      gaps: 'The workarounds worked. They did not share context.',
      constraints: 'Production work did not pause, so scope stayed surgical.',
      approach: 'Connected plugins and apps into one workflow layer.',
      outcome: 'Fewer manual review cycles across design, UX, and photography.',
    },
    stream: 'professional',
    client: 'Tire Rack · Internal Tooling',
    title: 'Scaling Design Through Internal Tooling',
    seoTitle: 'Design Enablement: Internal Figma Plugins & AI-Assisted Tooling',
    summary:
      'I built three internal tools that carry the system’s rules into daily work: a Figma metadata plugin, a production-accurate crop simulator, and a presentation system used across Design, UX, and Photography.',
    cardHook: 'Repetitive production work was eating design time. Three connected internal tools now carry the system into project setup, crop validation, and stakeholder decks, places the component library never reached.',
    year: '2025–2026',
    tags: [
      'Design Enablement',
      'Internal Tooling',
      'Figma Plugin',
      'AI-Assisted Build',
      'Workflow Automation',
      'Design Systems',
    ],
    role: 'Product Design · UX Engineering · AI-Assisted Build',
    tools: ['Figma', 'Claude', 'TypeScript', 'React', 'VS Code', 'Workfront'],
    timeline: 'Ongoing (tools shipped iteratively alongside production work)',
    featured: '/assets/portfolio-safe/web-apps/cover-poster.jpg',
    featuredVideo: '/assets/portfolio-safe/web-apps/cover-loop.mp4',

    // ── 01 Problem ──
    problemPunch:
      'The team’s biggest friction was not the work. It was the process around the work.',
    problem: [
  "I had been using AI-assisted builds to remove repetition from my own work. My manager noticed and brought me a request from Photography: make hero crop decisions easier before the image reached AEM.",
  "That request grew into a set of tools for recurring setup, asset review and presentation work. Project context was still scattered across spreadsheets and Figma files.",
  "Checking crops in AEM pushed breakpoint and safe-zone problems late into the workflow, after other people had already committed time to the asset."
],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'Each problem had a point solution. Nobody was designing the workflow itself.',
    gaps: [
      'Project metadata, image validation, and stakeholder reviews each had a workaround, but the workarounds did not share context.',
      'AI and MCP tools could infer structure, but they could not know an internal project ID, owner, or planning note. The workflow had to supply that context explicitly.',
      'Every stakeholder deck started from an empty file, so teams spent review time rebuilding the container around the work.',
    ],

    // ── 03 Constraints ──
    constraintsPunch: 'Built inside the team’s production week, not in a lab.',
    constraints: [
      'Internal tools earn adoption or die. Every tool had to beat the workaround it replaced from its first release.',
      'The Hero Crop Simulator had to reproduce the live responsive CSS, gradients, safe zones, and crop behavior. A close approximation would still send the wrong image into production.',
      'Everything was built alongside normal production workload, in partnership with our Lead Product Manager, so scope had to stay surgical.',
    ],

    // ── Key Insight (portable-governance thesis) ──
    insightCallout:
      'The design system had to travel with the work. Its rules now live in the plugin, the simulator, the presentation components, the code, and the documentation rather than waiting in a library someone has to remember to open.',

    // ── 04 Approach — one subsection per tool ──
    approachSubsections: [
      {
        key: 'metadata',
        label: 'Figma Project Metadata Plugin',
        systemMarker: 'CONTEXT LAYER',
        description:
          'I worked with our Lead Product Manager on a Figma plugin that reads an exported Workfront spreadsheet and builds the project title card inside the design file. It fills what an agent cannot infer: the internal ID, owner, business context, and planning metadata. Hundreds of active files now have one searchable entry point instead of another naming convention someone has to remember.',
        images: [
          {
            src: '/assets/portfolio-safe/web-apps/internalTool_figmaPlugin.png',
            alt: 'Figma project metadata plugin generating a standardized project title card',
            layout: 'full',
            caption: 'Workfront metadata flowing into a standardized, searchable title card inside Figma.',
          },
        ],
      },
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
      {
        key: 'connected-layer',
        label: "Extend shared rules into the team's daily work",
        systemMarker: 'PLATFORM',
        description:
          "The metadata plugin, crop simulator and presentation components carry the system into setup and review. My manager's requests extended the work to other teams, and further tools are in development. I keep the shipped tools focused on recurring tasks and maintain them alongside production work.",
      },
    ],

    // ── 05 Outcome ──
    timeToLive: 'In daily use by the design team, maintained alongside core project work rather than as a separate initiative.',
    outcomeNote:
      "All three tools are part of the team's workflow. The photography task went from three steps to one. The team has also seen related projects reach QA and launch weeks earlier. The metadata plugin keeps context in Figma, and the presentation components reduce repeated setup.",
    takeaways: [
  "The crop simulator started as a Photography request after my manager saw the tools I was building for my own work.",
  "Project IDs, owners and planning notes come from supplied metadata, rather than an agent's inference.",
  "Production crop rules and internal sign-in solve different problems: one supports a useful preview, the other controls access.",
  "The photography task went from three steps to one. The team has also seen earlier QA and launch timing on related projects."
],
    outcomeArtifacts: [
      'Figma Project Metadata Plugin',
      'Hero Crop Simulator',
      'Component-Based Presentation System',
    ],
    metrics: [
      { value: '3', label: 'Connected internal tools shipped' },
      { value: '3 teams', label: 'Design, UX & Photography workflows served' },
      { value: '100s', label: 'Of active design files given searchable context' },
      { value: 'Zero', label: 'AEM placements needed to validate hero crops' },
    ],
  },

  // =============================================
  // 6. LoopStack → CarbCurve  [personal project, in progress]
  // =============================================
  {
    slug: 'loopstack',
    thesis: 'Meals behave like curves, so the app should too.',
    annotations: {
      problem: 'Most diabetes tools treat a meal as one entry. Real meals are curves.',
      gaps: 'Curves over entries. Confidence over recommendations.',
      constraints: 'High-stakes domain. A review tool, never dosing advice.',
      approach: 'Confidence is the safety mechanism, not a feature.',
      outcome: 'Patterns ready to review stay separate from patterns still forming.',
    },
    stream: 'passion',
    client: 'LoopStack (personal project)',
    title: 'LoopStack: Pattern Review for Meals and Glucose',
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
    overview: {
      title: 'PlayDraft',
      category: 'Personal product',
      role: 'Product design · Design system · Agent-assisted build',
      relatedNote: { href: '/notes/a-system-to-maintain/', label: 'Read why I built a product to maintain' },
      deck: "I wanted the anticipation of fantasy-football draft day without waiting for the next season. Friends can draft snacks, movies or their own topics, then debate the boards.",
      ownership: 'I designed the brand, game, interface, and design system, then built the Expo and Supabase app with agents. This was a solo, nights-and-weekends product.',
      status: 'Available on the App Store · iPhone',
      decisions: [
        {
          title: 'Settle it in one session',
          body: "I replaced next-day voting with instant scoring so the group gets a verdict in the same session. My bet was that an immediate result would make another round more appealing.",
          image: { src: '/images/work/playdraft/playdraft-results-ceremony.png', alt: 'PlayDraft winner ceremony with the winning board and earned XP', layout: 'full', caption: 'The winner ceremony closes the draft.' },
        },
        {
          title: 'Keep the live draft in one place',
          body: 'Board, clock, queue, roster, and chat share the draft room. Search handles partial names, and custom drafts let the group write its own picks without duplicates.',
          image: { src: '/images/work/playdraft/playdraft-draft-room-live.png', alt: 'Live PlayDraft room showing the draft board, pick clock, and browse sheet', layout: 'full', caption: 'A capture from the running app.' },
        },
        {
          title: 'Give every new screen a reference',
          body: 'Shared tokens, component recipes, and a living reference screen constrain agent-assisted implementation. I kept the product decisions and reviewed the output against that system.',
          image: { src: '/images/work/playdraft/playdraft-design-system-live-screen.png', alt: 'PlayDraft living design-system screen with named semantic tokens and typography specimens', layout: 'full', caption: 'The system rendered on-device.' },
        },
      ],
      outcome: "PlayDraft is on the App Store after about twelve weeks to TestFlight. I think I shipped too much around the core game, so I am simplifying the path from joining a draft to getting a verdict. The live economy uses coins.",
    },
    thesis: 'Take the best mechanic in fantasy sports and set it loose on anything.',
    annotations: {
      problem: 'Drafting is the most fun part of fantasy sports, and it is stuck there.',
      gaps: 'The mechanic is universal. A casual product to host it was not.',
      constraints: 'Solo builder, real App Store rules, no lawyer on retainer.',
      approach: 'No screen without a reference, even for AI output.',
      outcome: 'Brand to TestFlight in twelve weeks, then launched on iOS.',
    },
    stream: 'passion',
    client: 'PlayDraft (personal product)',
    title: 'PlayDraft: A Social Drafting Game Built From Brand to App Store',
    cardTitle: 'PlayDraft: A Social Drafting Game',
    seoTitle: 'PlayDraft: a 0→1 Social Game Designed & Built With Agents in React Native',
    summary: "I love fantasy-football draft day and wanted that experience for everyday topics. Friends choose or write a topic, draft on the clock and get an instant verdict. I designed the brand, interface and system, then built the Expo and Supabase app with agents. It reached TestFlight in twelve weeks and is now on the App Store. I am simplifying the product around that core loop.",
    cardHook: 'Draft snacks, movies, or anything your group writes in. I designed the brand, game, and system, then built and released the iPhone app with agents.',
    year: '2026',
    tags: ['0 → 1 Product Execution', 'Mobile (iOS)', 'Game Design', 'Design System', 'Agentic Workflow', 'Brand System'],
    role: 'Product Strategy · Game Design · Brand · UX/UI · Design System · Agent-Assisted Build (React Native) · Content & Legal Ops · QA',
    tools: ['Figma', 'Figma MCP', 'Claude Code', 'Expo / React Native', 'TypeScript', 'Expo Router', 'Supabase', 'RevenueCat', 'Maestro', 'Xcode / TestFlight'],
    timeline: '2026 · App Store launch',
    featured: '/images/work/playdraft/playdraft-cover-v2.png',
    featuredVideo: '/images/work/playdraft/playdraft-cover-montage.mp4',
    featuredReel: {
      src: '/images/work/playdraft/playdraft-howtoplay-reel.mp4',
      poster: '/images/work/playdraft/playdraft-howtoplay-poster.jpg',
      alt: 'PlayDraft product reel: picking a DraftPack, tuning the draft and inviting a group, live snake-draft picks on the clock, DraftLab solo games, the store economy, the winner scored on draft-day value, the competitive sliced board and season standings, and sharing the final board',
      caption: 'PlayDraft in 89 seconds. Narrated and subtitled, captured in the real app against the live backend.',
    },
    timeToLive: 'From first logo sketch to TestFlight builds: ~12 weeks of solo nights-and-weekends work. Now live on the App Store with a coins-only economy; cash purchases remain behind a feature flag pending legal review.',

    // ── 01 Problem ──
    problemPunch: 'Drafting is one of the most fun social mechanics in fantasy sports, but it has stayed locked to sports.',
    problem: [
  "In fantasy football, the draft is the part I look forward to most: competing for a pick, finding a sleeper and arguing about the board afterward.",
  "I also kept seeing podcasts draft everyday topics for the fun of the debate. I wanted to put that format in friends' hands, from a Halloween candy draft to movies or a topic they write themselves."
],
    // The narrated product reel lives in the hero. The Problem stays focused on
    // the mechanic and decision rather than repeating the video below.

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'The mechanic is universal. The product to host it casually was not.',
    gaps: [
      'Fantasy apps assume rosters, scoring, and weekly commitment. PlayDraft needed the opposite: quick drafts among friends that resolve in one session. No league dues, no season.',
      'A casual draft still needs a verdict. The interaction model had to deliver a credible winner fast, keep the group debating after, and hand them something worth posting. The share card is part of the game loop, not marketing.',
      'Topic content needs to grow without flattening personality. A Scary Movies draft, a Super Powers draft, and a GOAT Athletes draft should feel like the same product but read very differently.',
      'AI-assisted prototyping can produce a lot of screens fast, and just as easily produce inconsistent ones. The project needed a design system strong enough to act as a constraint layer, not a style guide tacked on later.',
    ],
    // ── 03 Constraints ──
    constraintsPunch: 'Solo designer-builder. Real mobile stack. Real App Store rules. No lawyer on retainer.',
    constraints: [
      'Solo product design and build: no engineering team, no design partner, no research budget. Needed a workflow that compressed system design, screen design, and implementation into a single loop.',
      'Real production stack from day one: Expo Router, React Native, TypeScript, Supabase (auth, DB, realtime, RLS, edge functions), RevenueCat rails. UI never touches provider SDKs directly. Everything routes through /src/services/*.service.ts.',
      'App Store guidelines shaped real product decisions: UGC moderation (block / report / eject) for guideline 1.2, a wager token renamed and made coin-only for 5.3, and non-functional cash UI stripped for 2.1.',
      'Packs that name real brands, shows, and athletes follow content rules I wrote myself, without counsel: names only, no likenesses, trademarked nicknames scrubbed, one pack renamed, and a remote kill switch that disables any pack without an app release. The riskiest content launches free-tier only until a lawyer has reviewed it.',
    ],

    insightCallout: 'The design system doubled as the guardrail for AI output. Tokens, recipes, and a “no screen without a reference” rule meant every AI-assisted screen or new pack had somewhere to belong before it was built.',

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: 'The brief banned the patterns I didn’t want to copy',
        description: 'The brief and core loop came before any UI: Create or Join → snake picks → a verdict → reward. It ruled out TCG card-collector framing, pay-to-win, and copyrighted rosters. The first mark broke the first rule within days. “DraftPack,” a wolf-and-card identity, pulled straight toward the collector framing, so I retired it. The PlayDraft shield replaced it, tested at 29 px and against the App Store grid it would sit in.',
        images: [
          {
            src: '/images/work/playdraft/playdraft-brand-evolution.jpg',
            alt: 'Brand evolution board. Top: five DraftPack app-icon variants built on a wolf mark and trading-card frames; bottom: five PlayDraft icon color variations tested at 60/40/29 px and beside PrizePicks, Sleeper, and FastDraft in an App Store grid',
            layout: 'full',
            caption: 'DraftPack (top) was retired within days. The PlayDraft mark (bottom) was tested at 60, 40, and 29 px and beside PrizePicks, Sleeper, and FastDraft.',
          },
        ],
      },
      {
        key: 'structure',
        label: 'Four screens, with the draft room at the center',
        description: 'The draft room puts board, clock, queue, roster, and chat on one screen. Two bets defined it. In-draft search reads intent, so typing “lay” surfaces every Lay’s flavor. Custom Drafts make every pick a write-in, and duplicates bounce.',
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
            caption: 'The shipped app, not the Figma. The four tabs, then the two moments the product turns on: a pick landing on the live board, and the podium that settles it.',
          },
        ],
      },
      {
        key: 'system',
        label: 'The constraint layer came before the screens',
        description: 'The foundation ships as tokens.json, tokens.css, and a 15-module TypeScript package. Governance is written down, not implied: no hex literals in components (ADR-003), nine status-pill states with required leading icons, and a live /design-system screen where any token without a rendering gets deleted. Pack accents grew from five pairs to ten by decision record. That is what let 133 components and 59 screens ship solo without drift.',
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
            caption: 'The governance sheet: one rule at the top, the contribution path that enforces it, and the three places drift gets caught. Step 4 is the teeth.',
          },
          {
            src: '/images/work/playdraft/playdraft-design-system-live-screen.png',
            alt: 'Three columns cropped from the in-app /design-system route running on device: semantic text and border tokens, then icon, state and podium tokens, then the typography ramp, with swatches labelled by token name and resolved value',
            layout: 'full',
            caption: 'Three columns of the living reference, running on-device: tokens rendered with their names and resolved values. This screen is the audit surface: the podium tokens in the middle column were added the week the winner ceremony shipped',
          },
        ],
      },
      {
        key: 'build',
        label: 'AI scaffolds against the recipes; the audit catches drift',
        description: 'The shipped app is a production build, not a prototype shell: 26 feature modules, 28 provider-agnostic services, 104 Supabase migrations, 8 edge functions. Game logic (snake order, pick clock, confidence-pool scoring) lives inside with providers at the edge, so the engine is testable without the network. AI scaffolds screens from the token recipes, authors packs through a curator agent that checks them against the content rules, and runs a weekly report-only audit that flags drift and touches no app code. Tokens, product decisions, and legal posture sit in the same annotated file:',
        systemMarker: 'Agent workflows',
        promptRows: [
          {
            prompt: '1 this is good as described XP only slots feed to bonus math 2 defer to casing established in design system dont add transform properties',
            outcome: 'The variant kept its own casing and no textTransform was added. It is now one of the four locked micro-rules on the governance sheet.',
          },
          {
            prompt: 'implement a extremely sharp countdown timer UI for the above need. dont stray from brand system but pull from the best of the apps animation and UI to build and reference my /ryan-design-taste',
            outcome: 'The pre-draft countdown shipped on the existing motion, type, and colour tokens. No new visual language entered the system to get it.',
          },
          {
            prompt: 'the .05 holo bonus should only apply to the bonus XP rewarded not deterministic results',
            outcome: 'The holo bonus is wired to the bonus-XP lane only. Collection luck pays progression and never moves a placement.',
          },
          {
            prompt: 'just provide me the mechanics for scoring as they stand right now please, hold off on visual enhancements',
            outcome: 'The scoring model got written down before any UI was drawn for it. The visual work waited a turn.',
          },
        ],
        promptRowsCaption: 'Verbatim from the build sessions, April to July 2026. Lowercase and typos left in. An edited prompt is not evidence.',
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
          caption: 'Real source. The pack registry carries its own decision history in the file the components actually read: why ink teal exists, why gold is off-limits, and the legal posture of every third-party topic.',
        },
        images: [],
      },
      {
        key: 'iteration',
        label: "Give the group a verdict while the session is still happening",
        description: "The original loop ended in community voting, with the verdict delayed until the next day. I worried that wait would weaken engagement and replay, especially between strangers. In June, I replaced voting with the DraftLab confidence pool: solo mini-games rank pack items so a finished draft can return an instant winner. I am now simplifying the surrounding features because I think I launched too much around the core draft.",
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: "PlayDraft is live on the App Store for iPhone. Groups can choose or write a topic, draft on the clock and get an instant scored winner. There are no launch metrics to report yet. I think the first release carried too many features, and I am working on updates that bring the draft and verdict back into focus. Third-party packs stay free under the content rules; some promotional surfaces remain unwired.",
    takeaways: [
      "I retired next-day voting in June because I wanted the group to finish in one sitting. I expected that shorter loop to make another round more appealing.",
      'Any token with no rendering on the live /design-system screen gets deleted. That rule, not a style guide, is what held the AI-scaffolded screens to the system.',
      'Scripting the demo reel in Maestro caught a pick clock that never auto-picked at zero, and the fix went in instead of a caption.',
      'App Store rules shaped the product: “Bet on Myself” became coin-only “Podium Boost” for guideline 5.3, and non-functional cash UI came out for 2.1.',
    ],
    metrics: [
      { value: 'Launched', label: 'on the iOS App Store · Solo design & build' },
      { value: '133', label: 'Components on a token-governed design system' },
      { value: '59', label: 'Screens & routes across the shipped Expo Router app' },
      { value: '17', label: 'Draft packs in the launch catalog, every third-party topic checked against content rules written without counsel' },
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
    client: 'Overscroll Tactics (self-initiated)',
    title: 'Overscroll Tactics: A Studio Mark Die-Cut From a Game That Just Finished',
    cardTitle: 'Overscroll Tactics: A Studio Identity',
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
      { title: 'Specify behavior, then check the build', body: 'I specified behavior and responsive rules while Cheryl Carpenter owned the React web build. Reviewing it together sharpened my understanding of props, states, and reusable components—a foundation I later carried into building PlayDraft in React Native with agents.', bodyLink: { text: 'building PlayDraft in React Native', to: '/work/playdraft/' }, image: evidence(p, 'documentation') },
    ],
    outcome: 'The journey is live from vehicle selection through checkout. The framework later extended into Wholesale. Partner adoption grew during the build, but business factors also contributed; that growth is not a clean measure of design impact.',
  }),
  'design-enablement': p => ({
    title: 'Design Enablement', category: 'Internal tools', role: 'Product design · AI-assisted build',
    status: 'In daily team use',
    deck: 'Three tools carry shared rules into project setup, image validation, and stakeholder presentations, where a component library alone could not help.',
    ownership: "I designed and built the tools alongside production work. Our Lead Product Manager partnered on project context; our AI team helped host the crop tool internally behind company sign-in.",
    opening: evidence(p, 'crop-simulator'),
    decisions: [
      { title: 'Put project context inside the file', body: 'The Figma plugin turns exported Workfront data into a searchable title card. IDs, owners, and planning context arrive as facts instead of assumptions an agent has to make.', image: evidence(p, 'metadata') },
      { title: "Solve the crop decision before the AEM placement", body: "After seeing my own workflow tools, my manager brought me Photography's crop-review problem. The simulator uses production breakpoints, gradients and safe zones so teams can judge an asset before placing it in AEM.", image: evidence(p, 'crop-simulator') },
      { title: 'Reuse the presentation structure', body: 'Layouts, charts, status markers, and callouts became Figma components. Teams assemble the review around the project instead of rebuilding the deck first.', image: evidence(p, 'presentation') },
    ],
    outcome: "Three tools are in the team's workflow. The photography task went from three steps to one, and the team has seen related projects reach QA and launch weeks earlier. I maintain the tools alongside production work.",
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
  }),
  'seasonal-content-system': p => ({
    title: 'Seasonal Content', category: 'Professional work', status: 'Live · Ongoing seasonal ownership',
    deck: "Help customers prepare for winter before the first snowfall. A shared AEM fragment system updates seasonal content across six landing pages without rebuilding them each year.",
    ownership: 'I designed the fragment architecture, authored and deployed content, documented the workflow, and trained junior designers. I still own system rules and final review.',
    opening: { src: p.featured, alt: 'AEM winter seasonal content — homepage project card', layout: 'full' },
    decisions: [
      { title: 'Separate seasonal content from page structure', body: "The updated AEM core components give authors shared editing rules. Five fragment types carry content, links and calls to action, letting more than twenty modules change across pages without a rebuild.", image: p.outcomeImages?.[0] },
      { title: 'Write down the authoring rules', body: 'Documentation and hands-on onboarding let junior designers make the swaps while I retain approval and responsibility for exceptions.' },
      { title: "Keep seasonal changes visible without changing the page text", body: "Natural-search traffic to swapped pages declined over successive years. After reviewing it with SEO, we shifted toward visual winterization in 2025 and 2026 while keeping text consistent on the same URLs." },
    ],
    outcome: 'Two junior designers now author seasonal swaps. I govern the system and resolve AEM/Target mismatches. Winter conversion has generally strengthened, but weather, marketing, and product changes also contribute.',
  }),
  heatherwood: p => ({
    title: 'Heatherwood', category: 'Independent client work', status: 'Live · Owner-managed WordPress site',
    deck: 'A riding academy’s brand and website, organized around the services families search for and built for its owner to maintain.',
    ownership: 'I designed the identity and website, built it in WordPress, configured forms and search basics, and trained founder Deborah Clements to manage the content.',
    opening: evidence(p, 'system'),
    decisions: [
      { title: 'Give every service its own entrance', body: 'Dedicated service pages answer parent questions and offer a relevant contact form. Families can arrive directly at the activity they searched for.', image: evidence(p, 'system', 1) },
      { title: 'Carry one identity across the site', body: 'Logo, color, and typography rules extend into reusable service cards, FAQ accordions, and contact sidebars.', image: evidence(p, 'system') },
      { title: 'Design the handover, too', body: 'WordPress, Elementor, and clear training let Deborah update content independently. The site did not require an ongoing developer relationship to stay useful.' },
    ],
    outcome: 'Deborah still manages the content herself. Rough inbox counts rose from three or four inquiries a month to four or five a day in the weeks after launch. These are unfiltered form counts; the change reflects brand, content, search, and the inquiry path together.',
  }),
  'landing-pages': p => ({
    title: 'Landing Page System', category: 'Professional work', status: 'Live · Governed AEM templates',
    deck: 'After designing more than fifty landing pages, I turned their recurring decisions into templates that other designers can use.',
    ownership: 'I designed and built the pages and template patterns, then documented their use. I govern component-level changes and review work by two junior designers.',
    opening: p.outcomeImages?.[0],
    decisions: [
      { title: 'Let search intent set the order', body: "SEO briefs set the H1, metadata and target keywords for a customer's shopping stage. I organize the product evidence and answers around that intent, so the page helps someone act on the search that brought them there.", image: p.outcomeGridImages?.[0] },
      { title: 'Turn recurring layouts into starting points', body: "Pages now share the AEM component foundation, with recurring hero, product, FAQ and promotion layouts. Content and emphasis can change while authors work within familiar rules.", image: p.outcomeGridImages?.[1] , bodyLink: {"text":"AEM component foundation","to":"/work/aem-component-system/"} },
      { title: "Make new needs reusable", body: "New product or client needs usually become component variants. When content does not fit an existing pattern, HTML markup components still allow an on-brand exploration within the template. I keep those exceptions under review.", image: p.outcomeGridImages?.[2] },
    ],
    outcome: 'Two junior designers use the templates. Complex pages now take one or two weeks instead of about a month; standard pages about a week, and simple launches a day or two. Page-specific revenue reporting is documented in the full study with its attribution limits.',
  }),
  'aem-component-system': p => ({
    title: 'AEM Components', category: 'Professional work', status: 'Live · Shared authoring foundation',
    deck: 'A reusable component foundation replaces one-off page authoring across the homepage, tires hub, events, and packages.',
    ownership: 'I wrote component specifications and production Sass alongside AEM engineering. Patrick Steins reviewed my branches; SEO and accessibility leads helped define the contracts.',
    opening: evidence(p, 'system'),
    decisions: [
      { title: "Extend core components with clear exceptions", body: "I extended familiar core components through selectable styles and written authoring rules. The Hero needed its own heading-level options and an eyebrow integrated into the heading. I made those differences explicit in its contract." },
      { title: 'Ship variants with their rules', body: 'Eight core variants shipped with Sass, authoring defaults, and documentation. For three additional API-driven components, I specified behavior and styles alongside the engineering team.', image: { ...evidence(p, 'system', 1)!, crop: { x: 0, y: 256, width: 428, height: 328, sourceWidth: 428, sourceHeight: 1536 } } },
      { title: "Pay the migration cost once", body: "Every page needed a rebuild on its new core template. That took months, but the templates now accept new component variants without repeating the overhaul. Shared fields and documentation give authors a clearer starting point.", image: { ...evidence(p, 'system')!, crop: { x: 0, y: 54, width: 428, height: 481, sourceWidth: 428, sourceHeight: 1536 } } },
    ],
    outcome: "The components power live pages, with WebPageTest reporting 60% faster loads. Load-speed, screen-reader and SEO checks informed the wider rollout. Designers now author within the same templates and variant rules engineering supports.",
  }),
  loopstack: p => ({
    title: 'LoopStack', category: 'Personal product', status: 'TestFlight · Personal pattern-review tool',
    deck: "A personal Type 1 diabetes app for following repeat meals through their full glucose-response window and reviewing recurring patterns with the evidence beside them.",
    ownership: 'I designed and built the product with AI assistance and tested it against my own Loop data. It supports pattern review and care-team discussion, not dosing advice.',
    opening: p.approachSubsections?.flatMap(s => s.images ?? []).find(i => i.isVideo && i.src),
    decisions: [
      { title: "Follow the response beyond the meal", body: "I wanted to see what a repeat meal did over its full absorption window. Ingredients, timing and activity stay beside the glucose curve, so I can compare the response with earlier meals.", image: evidence(p, 'structure') },
      { title: 'Say where each number comes from', body: 'Real data sources replace repeated manual entry, while sample data is labeled. Observations stay alongside settings rather than replacing them.', image: evidence(p, 'system', 1) },
      { title: 'Require repetition before confidence', body: "Repeat meals and time-of-day patterns help me review questions about sensitivity, meal boluses and background insulin alongside my Loop settings. Confidence reflects the supporting history. The app keeps those observations in review scope, without recommending changes.", image: evidence(p, 'iteration') },
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
    title: 'Bolus Binder', category: "Personal product", status: 'TestFlight · React Native build',
    deck: 'Living with Type 1 diabetes, I wanted cooking to come first. I designed and built a recipe keeper that brings portions, nutrition context, and meal planning into one app.',
    ownership: 'I own the product direction, UX/UI, design system, and agent-assisted React Native build. The app draws on the T1D Hub visual system from my separate clinic identity work.',
    decisions: [
      { title: 'Keep the recipe familiar', body: 'I kept saving and cooking recipes at the center. Familiar folders, timing filters, and saved versions help me return to a meal; a separate cooking log preserves when I made it.', image: { src: '/images/work/bolus-binder/app/03-folder-dinners.png', alt: 'Dinner recipes grouped in a folder with timing and rating filters', layout: 'half', crop: { x: 0, y: 150, width: 1206, height: 1650, sourceWidth: 1206, sourceHeight: 2622 }, caption: 'Recipe organization · simulator capture with demo data.' } },
      { title: 'Make portions change the whole meal', body: 'Portion changes update the ingredient quantities and nutrition together. The collapsed header keeps the portion and macro totals visible as I move through the recipe.', image: { src: '/images/work/bolus-binder/app/06-recipe-detail-collapsed.png', alt: 'Collapsed recipe header keeps the scaled portion and nutrition totals visible', layout: 'half', crop: { x: 0, y: 150, width: 1206, height: 1550, sourceWidth: 1206, sourceHeight: 2622 }, caption: 'Scaled portion and nutrition context · seeded demo data.' } },
      { title: 'Separate estimates from observations', body: 'The nutrition view labels the absorption pattern as estimated. It is not measured CGM data or a dosing recommendation. Reviewing observed glucose patterns belongs to the separate LoopStack exploration.', bodyLink: { text: 'LoopStack exploration', to: '/work/loopstack/' }, image: { src: '/images/work/bolus-binder/app/07-nutrition-expected-response.png', alt: 'Nutrition view marks its absorption pattern as Estimated', layout: 'half', crop: { x: 0, y: 1220, width: 1206, height: 1350, sourceWidth: 1206, sourceHeight: 2622 }, caption: 'Estimated pattern, not an observed glucose response.' } },
    ],
    outcome: 'The React Native app is in TestFlight. These captures document implemented product flows, not validated health outcomes. Observed glucose integration remains future work.',
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
    const { x, y, width, height } = image.crop;
    const stem = image.src.split('/').pop()!.replace(/\.[^.]+$/, '');
    image.displaySrc = `/images/work/${project.slug}/overview-samples/${stem}-${x}-${y}-${width}-${height}.webp`;
  }
}

export default projects;
