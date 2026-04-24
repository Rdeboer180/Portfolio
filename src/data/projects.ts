export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectImage {
  src?: string;
  alt: string;
  layout: 'full' | 'half';
  caption?: string;
  mobile?: boolean;
  isOverlay?: boolean;
  overlayText?: string;
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
}

export interface Project {
  slug: string;
  client: string;
  title: string;
  summary?: string;
  year: string;
  tags: string[];
  role: string;
  tools: string[];
  timeline: string;
  featured: string;
  metrics: ProjectMetric[];
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
  outcomeImages?: ProjectImage[];
  outcomeGridImages?: ProjectImage[];
  outcomeLiveLinks?: { label: string; url: string }[];
  insightCallout?: string;

  // Legacy approach steps (kept for other projects during transition)
  approachSteps?: { label: string; description: string }[];
  approachImages?: ProjectImage[];

  // Legacy fields (kept for backward compat during transition)
  brief?: string;
  challenge?: string;
  images?: ProjectImage[];
  resultsNote?: string;
  ownership?: string[];
  approach?: string;
  process?: { label: string; description: string }[];
  takeaways?: string[];
}

const projects: Project[] = [
  // =============================================
  // 0. WheelRack — Design System & Customer Journey  [image LEFT]
  // =============================================
  {
    slug: 'wheelrack',
    client: 'Tire Rack \u2014 WheelRack',
    title: 'WheelRack Design System & Full Customer Journey Redesign',
    summary: 'Built a design system from scratch and redesigned the full customer journey for a 20-year-old dealer platform. Partner adoption grew from 6 to 10 during the build\u2014the redesign helped influence buy-in as additional retailers saw the in-progress UI.',
    year: '2023\u20132024',
    tags: ['Design Systems', 'UX/UI Design', 'Responsive', 'React', 'Storybook', 'Design Tokens'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'Tokens Studio', 'Storybook', 'HTML/CSS', 'JavaScript', 'Jira'],
    timeline: '~4 months dedicated (12+ months total with API delays)',
    featured: '/images/work/wheelrack/CS_thumbnail_wheelrack_designSystem_safe.jpg',
    timeToLive: 'System and partner brand builds complete. Full release planned for Q2 2026, pending API integration work.',

    // ── 01 Problem ──
    problemPunch: 'A 20-year-old platform. No design system. No responsive design. Six partners, zero consistency.',
    problem: [
      'WheelRack is Tire Rack\u2019s aftermarket wheel visualizer\u2014roughly 20 years old, served to dealers across 6 retail partners.',
      'Dealers use it on tablets in-store. No responsive design, clunky dropdowns, visually inconsistent across partner brands.',
      'Business goal: modernize as a proof-of-concept for Tire Rack\u2019s future tech stack (React + Microservices).',
    ],
    problemImages: [
      {
        alt: 'Placeholder for omitted legacy site screenshot',
        layout: 'full',
        caption: 'Legacy state available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'Every partner was a one-off. No tokens, no components, no shared language between design and engineering.',
    gaps: [
      'No shared design system, tokens, or component library\u2014every partner variant handled ad hoc.',
      'Invested deliberately in advanced design-system fluency: completed an 80+ hour Figma Masterclass covering Atomic Design, components and variants, tokens and variables, responsive behavior, documentation and handoff, and prototyping component behavior.',
      'Partnered with senior React developer Cheryl Carpenter to build the system from the ground up. I owned system design, component logic, token structure, edge cases, responsive behavior, and design\u2013dev alignment. Cheryl owned React implementation, component integration, and viewport/behavior stress testing. Work moved Figma \u2192 Tokens Studio \u2192 Storybook \u2192 React, tracked in Jira.',
      'Chose Tokens Studio because this work predated Figma Variables. It better supported structured token sets, sync, export/import, and the React/Storybook pipeline. Today I\u2019d start in Figma Variables and evaluate an external pipeline from there.',
    ],
    gapsImages: [
      {
        src: '/images/work/wheelrack/supporting/approach/wheelrack-ux-wireframe-02.png',
        alt: 'Vehicle selector wireframe with annotated UI behavior specs for Make/Year/Model autocomplete flow',
        layout: 'full',
        caption: 'Early wireframe showing the complexity of the vehicle selector flow\u2014this wasn\u2019t just a UI cleanup',
      },
    ],

    // ── 03 Constraints ──
    constraintsPunch: 'Waterfall to Agile mid-project. Split attention. Six partners with different rules.',
    constraints: [
      'Sprint 0 followed Waterfall; future sprints shifted to Agile\u2014a new methodology for the team.',
      'Design time split across higher priority retail projects, with 10\u201320 day windows per task.',
      'Key edge cases: wheel models with multiple colors/sizes on a single tile, front/rear tire-size variance, separating the visualizer from supporting product info and shopping, and filter complexity with accessibility requirements.',
      'Custom headers/footers per partner with additional filters or cart integration.',
      'Coordinated with in-house photography team for vehicle and wheel images at specific angles.',
    ],
    constraintsImages: [
      {
        alt: 'Placeholder for omitted internal discovery artifact',
        layout: 'full',
        caption: 'Discovery/learning detail available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    insightCallout: 'Built 200+ tokens and 50+ components from scratch\u2014establishing a shared language between design and engineering that eliminated ambiguity in the React build.',

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Full stakeholder meeting to review objectives. Worked with UX design manager and teammates to map the page flow and identify the primary user: dealers on tablets.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Wireframed the full customer journey\u2014vehicle selection, search results, product detail, and checkout. Annotated behavior specs for autocomplete, responsive states, and error handling.',
        systemMarker: 'Pattern introduced',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/wheelrack/supporting/approach/wheelrack-ux-wireframe-03.png',
            alt: 'Detailed wireframe with annotated UI behavior specs for vehicle selector and search flow',
            layout: 'full',
            caption: 'Wireframe with behavior specs\u2014autocomplete, dynamic selection, responsive breakpoints',
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Established atomic tokens (color, spacing, typography, shadow) that evolved into buttons, inputs, headers, modals, product cards, and visualizer views. Each component built in Figma, validated in Storybook.',
        systemMarker: 'System decision',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/wheelrack/supporting/opportunity/wheelrack-design-system-02.png',
            alt: 'Figma typography token definitions with heading and body text styles',
            layout: 'half',
            caption: 'Typography tokens\u2014source of truth across Figma and code',
          },
          {
            src: '/images/work/wheelrack/supporting/opportunity/wheelrack-design-system-05.png',
            alt: 'Full button state matrix showing primary and secondary variants across sizes',
            layout: 'half',
            caption: 'Button component\u2014full state matrix across sizes and variants',
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        description: 'Partnered daily with React dev via Slack threads and calls. Components validated in Storybook before integration. Supplied detailed front-end behavior specs for every complex component.',
        systemMarker: 'Scalability consideration',
        images: [
          {
            alt: 'Placeholder for omitted internal Storybook artifact',
            layout: 'full',
            caption: 'Storybook detail available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'iteration',
        label: 'Iteration',
        description: 'Presented weekly to a large stakeholder group for review and sign-off. Spent 40+ hours comparing the React build against Figma styles\u2014reviewing token names, responsive behavior, and component fidelity screen by screen.',
        images: [],
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: 'Delivered a complete design system and full customer journey from vehicle selection through checkout. Partner adoption grew from 6 to 10 during the build as additional retailers saw the in-progress UI\u2014the redesign helped influence buy-in, though final adoption reflects broader business factors too. The Storybook-integrated component library gave the React team an unambiguous source of truth, and the token system established a shared language between design and engineering. Within 6 months, the same framework was extended into Tire Rack\u2019s Wholesale site, where I helped onboard 3\u20134 additional designers into the workflow Cheryl and I established.',
    outcomeImages: [
      {
        src: '/images/work/wheelrack/supporting/outcome/wheelrack-final-desktop-01.png',
        alt: 'Final WheelRack landing page with wheel visualizer, vehicle image, filters, and search results',
        layout: 'full',
        caption: 'Shipped landing page\u2014vehicle visualizer, filter system, and responsive product grid',
      },
      {
        src: '/images/work/wheelrack/supporting/approach/wheelrack-final-desktop-05.png',
        alt: 'Wheel details page with annotated UI behavior callouts for fitment, finish selector, and product tabs',
        layout: 'full',
        caption: 'Product detail page\u2014annotated specs for engineering handoff',
      },
    ],
    metrics: [
      { value: '200+', label: 'Atomic-level design tokens' },
      { value: '50+', label: 'Storybook-integrated components' },
      { value: '6 \u2192 10', label: 'Partners during build (influenced adoption)' },
      { value: 'Wholesale', label: 'System extended 6 months post-build' },
    ],
  },

  // =============================================
  // 1. Tire Rack — Tire Category Redesign  [image RIGHT]
  // =============================================
  {
    slug: 'tire-categories',
    client: 'Tire Rack',
    title: 'Tire Category Page Redesign & Optimizations',
    summary: 'Redesigned 30+ tire category pages into a scalable system of iconography, data visualization, and content structure. Top-performing category pages saw up to +50% conversion lift in the first month after launch.',
    year: '2024',
    tags: ['UX/UI Design', 'Wireframing', 'Component Design', 'Modular Design', 'SEO Optimization', 'Icon System Implementation'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'FigJam', 'HTML/CSS', 'Adobe Creative Suite'],
    timeline: '2 months',
    featured: '/images/work/tire-categories/CS_thumbnail_TireCategories_safe.jpg',
    timeToLive: '~2 months from brief to system launch across 30+ category pages',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Too many choices. Too much text. Users couldn\u2019t decide fast enough.',
    problem: [
      'Tire Rack\u2019s category pages serve as a primary entry point for millions of users navigating a highly complex product space.',
      'The existing experience was text-heavy and inconsistent\u2014no visual system to differentiate 40+ tire categories, each supporting 80+ products.',
      'Design needed to define both the structure and the visual language from scratch.',
    ],
    problemImages: [
      {
        alt: 'Placeholder for omitted internal project-notes artifact',
        layout: 'full',
        caption: 'Project notes available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No visual language existed. Design had to define both the system and the vocabulary.',
    gaps: [
      'No existing framework to visually represent differences between categories.',
      'Each category needed to communicate distinct performance characteristics clearly while maintaining consistency across 40+ variations.',
      'SEO-driven content requirements competing with usability and clarity\u2014no balance had been struck.',
    ],
    gapsImages: [
      {
        alt: 'Placeholder for omitted internal process-notes artifact',
        layout: 'full',
        caption: 'Early-process notes available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: '40+ categories. 80+ products each. SEO requirements competing with usability.',
    constraints: [
      '40+ unique category variations needed consistent treatment.',
      'Large product sets (often 80+ tires per category) requiring balanced content density.',
      'SEO content requirements had to coexist with clean, scannable design.',
      'No photography direction existed for category-specific imagery.',
      'Performance data had to be sourced, validated, and visualized for each category.',
    ],

    insightCallout: 'Pushed back on 90 one-off icons in favor of a scalable system\u20148 primary icons for broad strengths, 24 supporting icons for specific category distinctions. This framework now governs a 100+ icon sprite library used across the site.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Broke the experience into scalable layers: category hierarchy, icon systems, data visualization, and content structure aligned to SEO intent. Partnered closely with Ransom Rockliffe on the SEO side, navigating the core tension\u2014preserving usability and clarity while adding enough keyword and product depth for SEO and LLM discoverability.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Defined the category page hierarchy and wireframed repeatable layout patterns that could flex across 40+ variations while keeping product discovery and comparison front and center.',
        systemMarker: 'Pattern introduced',
        images: [
          {
            alt: 'Placeholder for omitted internal wireframe artifact',
            layout: 'full',
            caption: 'Wireframes available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Developed 8 primary category icons and 24 supporting characteristic icons\u2014a deliberate scaling move against a proposed 90 one-offs. Designed a CSS-animated bar chart system for performance comparison, shipped with reduced-motion support, text fallback, and screen-reader labeling. Sourced photography inspiration, aligned category/vehicle/product fit with specialists, and worked with in-house photography on location, weather, tone, and composition\u2014joining two specialized shoots for the trailer and classic tire categories.',
        systemMarker: 'System decision',
        gridColumns: 2,
        images: [
          {
            alt: 'Placeholder for omitted internal file-system artifact',
            layout: 'full',
            caption: 'Working files available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
          {
            src: '/images/work/tire-categories/primaryHome+icons_safe.png',
            alt: 'Primary category landing page with 8 category icons and visual hierarchy',
            layout: 'half',
            caption: 'Category hub\u20148 primary icons enabling quick visual scanning across tire types',
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        description: 'Worked with engineering to define reusable AEM components with admin-controlled fields for performance data. Contributed directly to page structure, CSS chart animations, SVG icon creation, and scalable styling patterns.',
        systemMarker: 'Scalability consideration',
        gridColumns: 2,
        images: [
          {
            alt: 'Placeholder for omitted internal design-proof artifact',
            layout: 'full',
            caption: 'Pre-dev proof available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
          {
            alt: 'Placeholder for omitted internal version-control artifact',
            layout: 'full',
            caption: 'Versioning detail available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'iteration',
        label: 'Iteration',
        description: 'System scaled to 30+ landing pages with consistent UX patterns and flexible CMS-driven content updates. Non-dev teams could update performance data and category content without engineering support.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'The redesigned system aligned SEO, UX, and product discovery into a single framework\u2014reducing friction while increasing clarity and conversion. Measured against the month before launch, top-performing category pages (Performance All-Season, Performance Summer) saw up to +50% conversion lift in the first month; niche categories saw 30\u201340% gains. Category page entry traffic across the system saw up to +400% growth in the same window. Beyond the initial launch, this work influenced the broader direction of characteristic icons sitewide\u2014now governed as a 100+ icon sprite library.',
    outcomeImages: [
      {
        src: '/images/work/tire-categories/supporting/outcome/in-page-application.png',
        alt: 'Category detail page showing performance bar charts, product grid, and icon system in context',
        layout: 'full',
        caption: 'Category page in context\u2014performance data, icon system, and product discovery working together',
      },
      {
        src: '/images/work/tire-categories/winter_m_safe.png',
        alt: 'Winter tire category page on mobile showing responsive layout with performance data and product listings',
        layout: 'full',
        caption: 'Mobile category experience\u2014responsive layout maintaining full functionality',
        mobile: true,
      },
    ],
    metrics: [
      { value: 'Up to +50%', label: 'Conversion lift, top pages (first month)' },
      { value: 'Up to +400%', label: 'Category entry growth vs. month prior' },
      { value: '32 \u2192 100+', label: 'Icons scaled into sitewide sprite library' },
    ],
    outcomeLiveLinks: [
      { label: 'High Performance Summer (live CSS chart)', url: 'https://www.tirerack.com/tires/summer/high-performance' },
    ],
  },

  // =============================================
  // 2. Tire Rack — AEM Seasonal Content Strategy  [image LEFT]
  // =============================================
  {
    slug: 'tire-rack-winter',
    client: 'Tire Rack',
    title: 'Tire Rack Seasonal Content Swap \u2014 AEM Experience Fragments & Adobe Target',
    summary: 'Built and owned a scalable AEM content system that swaps 20+ components across 6 landing pages each season. Seasonal winterization has been associated with stronger annual winter conversion lift compared with pre-winterization periods.',
    year: '2013\u2013Present',
    tags: ['AEM', 'Content Strategy', 'SEO', 'Photography Direction', 'CMS', 'Component Design', 'Modular Design', 'Adobe Target'],
    role: 'Senior Web Designer / AEM Content Strategist',
    tools: ['Adobe Experience Manager', 'Adobe Target', 'Figma', 'HTML/SCSS', 'Adobe Creative Suite'],
    timeline: '10+ years',
    featured: '/images/work/tire-rack-winter/CS_thumbnail_AEM_Winterization_safe.jpg',
    timeToLive: '10+ years of continuous ownership\u2014system deployed seasonally each fall with same-day content swaps',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Manual seasonal updates. No scalable system. Winter and southern-states customers seeing the same content.',
    problem: [
      'Since 2013, Tire Rack needed a winterized version of its high-traffic landing pages each fall\u2014homepage, tire pages, delivery, research, and wheel adjustment pages.',
      'Early seasonal updates were manual and time-intensive. As the digital footprint grew, the process needed to scale without duplicating pages or confusing search engines.',
    ],
    problemImages: [
      {
        alt: 'Placeholder for omitted internal release-notes artifact',
        layout: 'full',
        caption: 'Release notes available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No fragment library, no audience targeting, no way to serve different content to different regions without page duplication.',
    gaps: [
      'No existing system to serve meaningfully different content to winter-climate and southern-states customers.',
      'Needed new fragment types, accessible component variants, and Adobe Target audience rules.',
      'Close collaboration required across Analytics, Photography, and SEO teams to ensure consistency and conversion.',
    ],
    gapsImages: [
      {
        alt: 'Placeholder for omitted internal photography-ideation artifact',
        layout: 'full',
        caption: 'Photography ideation available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'SEO can\u2019t see duplicate pages. Analytics needs audience segmentation. Photography needs seasonal imagery on a schedule.',
    constraints: [
      'Google had to treat winter and southern-states variants consistently\u2014not as duplicate pages.',
      'Audience segmentation currently runs as a geo-based split with two segmented audiences via Adobe Target, coordinated with the Analytics team.',
      'Shaped the annual Sweden winter-shoot wishlist alongside Tire Rack\u2019s tire-testing trips\u2014using marketing goals, AI-generated reference imagery, and design-system needs to brief composition and tone.',
      'System needed to be documented clearly enough for two junior designers to author seasonally alongside me, with my oversight on approvals, governance, and design-system alignment.',
      'When breaks happen, they\u2019re usually tied to Experience Fragment / Adobe Target sync issues\u2014resolved through coordinated fixes across authoring, analytics, and targeting.',
    ],
    constraintsImages: [
      {
        alt: 'Placeholder for omitted internal authoring-notes artifact',
        layout: 'full',
        caption: 'Authoring contingencies available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    insightCallout: 'Evolved from manual content updates into a 20+ component Experience Fragment library\u2014audience-targeted, SEO-safe, and mentor-ready for junior designers.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Coordinated across Analytics (audience segmentation rules), Photography (seasonal shoots I directed), SEO (variant indexing strategy), and junior designers (authoring onboarding).',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Designed the Experience Fragment architecture\u2014component types, variant rules, and the swap logic that lets 20+ modules change simultaneously without touching page structure.',
        systemMarker: 'System decision',
        images: [
          {
            src: '/images/work/tire-rack-winter/supporting/constraints/winter-confluence-docs.png',
            alt: 'Confluence documentation for Experience Fragment workflows with Ryan DeBoer as primary contact',
            layout: 'full',
            caption: 'Internal documentation\u2014system architecture and authoring workflows',
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Built reusable fragment types: Hero, Teaser, Entertainment, Video Center, Category Bar. Each with content fields, link behavior, and CTA configuration authored directly in AEM.',
        systemMarker: 'Pattern introduced',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/tire-rack-winter/supporting/approach/winter-aem-authoring.png',
            alt: 'AEM authoring view with Teaser component edit dialog',
            layout: 'half',
            caption: 'Component authoring\u2014Teaser dialog with link behavior and CTA fields',
          },
          {
            src: '/images/work/tire-rack-winter/supporting/approach/winter-aem-hero-detail.png',
            alt: 'Winter Hero fragment detail view with component variants',
            layout: 'half',
            caption: 'Hero fragment detail\u2014variant breakdown across component types',
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        description: 'Authored, tested, and deployed seasonal content directly in AEM. Documented the system in Confluence and mentored junior designers through the authoring workflow.',
        systemMarker: 'Scalability consideration',
        images: [],
      },
      {
        key: 'iteration',
        label: 'Iteration',
        description: 'This was never static work. Two phase shifts defined its evolution: in 2018, reduced unnecessary winter / non-winter content swaps to focus ROI on the highest-traffic surfaces. In 2025\u20132026, SEO identified indexing harm from serving different content on the same URLs\u2014which drove a more visual-first, system-driven winterization approach that preserved seasonal distinction without creating duplicate-content signals.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'Over a decade of continuous ownership, this system evolved into a scalable AEM Experience Fragment library\u201420+ component types, geo-based audience targeting via Adobe Target, spanning 6 high-traffic landing pages simultaneously. Seasonal winterization has been associated with stronger annual winter conversion lift than pre-winterization periods\u2014though that outcome reflects product, marketing, and climate factors alongside the system itself. Two junior designers now author seasonal content under my governance, with documentation, approvals, and design-system alignment owned by me. The 10+ year arc is less about repetition and more about long-term system governance, documentation leadership, and strategic refinement.',
    outcomeImages: [
      {
        src: '/images/work/tire-rack-winter/supporting/outcome/winter-homepage-desktop.png',
        alt: 'Winterized Tire Rack homepage with seasonal hero, editorial blocks, and category grid',
        layout: 'full',
        caption: 'Winterized homepage\u2014full Experience Fragment swap across all above-the-fold sections',
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
    client: 'Heatherwood Equestrian Academy',
    title: 'Building a Brand and a Sustainable System for a Local Equestrian Academy',
    summary: 'End-to-end rebrand and rebuild for a family-owned equestrian academy\u2014brand identity, IA, WordPress CMS, and SEO architecture. Inquiries moved from ~3\u20134 per month pre-launch to 4\u20135 form submissions daily in the weeks after launch.',
    year: '2025',
    tags: ['Brand Design', 'Web', 'SEO', 'CMS'],
    role: 'Brand & Web Designer',
    tools: ['Figma', 'WordPress', 'Elementor', 'WPForms', 'Yoast SEO', 'Adobe Illustrator'],
    timeline: '4 months',
    featured: '/images/work/heatherwood/CS_thumbnail_Heatherwood_safe.jpg',
    timeToLive: '~4 months from first meeting to full brand + site launch',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'An outdated brand and website that wasn\u2019t converting\u2014after 12+ years, the digital presence no longer matched the quality of the program.',
    problem: [
      'Heatherwood had operated under the same brand and website for 12+ years. Core issues: outdated look, weak brand continuity, no logical UX path, and a trust/conversion structure that wasn\u2019t supporting inquiries.',
      'Families search for specific activities ("horseback riding lessons South Bend"), not the brand name. Each service needed its own search entry point.',
      'The system had to be fully owner-managed with zero ongoing agency dependency.',
    ],
    problemImages: [
      {
        src: '/images/work/heatherwood/supporting/Problem/Screenshot 2026-04-02 at 10.16.00 AM.png',
        alt: 'Initial project scope and requirements for Heatherwood digital brand',
        layout: 'full',
        caption: 'Project scope\u2014defining what the brand and site needed to accomplish',
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'An aging identity competing against polished commercial programs\u2014without the SEO or conversion infrastructure to back it up.',
    gaps: [
      'The existing brand felt dated and lacked the polish needed to compete with larger commercial programs\u2014needed a full rebrand that feels warm and family-oriented but holds its own visually.',
      'Brand work started from a phone-image dump and required curation, aesthetic research, and regional positioning before a usable visual system could take shape.',
      'Each service (lessons, camps, boarding, birthday parties, trail rides) needed to function as an independent SEO landing page with its own conversion path.',
      'Every headline had to work for both the parent scanning the page and the search engine indexing it.',
    ],
    gapsImages: [
      {
        src: '/images/work/heatherwood/supporting/opportunity/heatherwood-notes-01.png',
        alt: 'Brand identity applied to roadside signage with QR code for mobile conversion',
        layout: 'full',
        caption: 'Brand collateral\u2014extending the identity into physical touchpoints',
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Non-technical owner. Real photography needed. Every page doubles as a search entry point.',
    constraints: [
      'Owner has no technical background\u2014CMS had to be fully self-manageable.',
      'Service pages each needed SEO-targeted headlines, dedicated contact forms, and structured FAQ content.',
      'Budget required WordPress with Elementor\u2014no custom dev.',
      'Photography had to feel authentic to the family environment, not stock.',
    ],

    insightCallout: 'Each service page was designed as its own landing page with a contact form sidebar\u2014because families arrive searching for a specific activity, not the brand name.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Partnered with the founder to understand the academy\u2019s story, key demographics (families with children 5\u201315 across Michiana), and what makes Heatherwood different from commercial programs.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Architected the site so each service functions as an independent SEO entry point. FAQ content structured around real parent questions. Conversion path routes every visitor to a form submission.',
        systemMarker: 'Pattern introduced',
        images: [
          {
            src: '/images/work/heatherwood/supporting/approach/heatherwood-notes-05.png',
            alt: 'WordPress CMS dashboard with analytics, forms, and SEO scoring',
            layout: 'full',
            caption: 'CMS architecture\u2014owner-managed dashboard with analytics, forms, and SEO',
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Redesigned the full brand identity (logo, color, typography) and built reusable page patterns\u2014service card grids, FAQ accordions, contact form sidebars\u2014that scale across 10+ service pages.',
        systemMarker: 'System decision',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-02.png',
            alt: 'Services and Experiences page with card grid of all 10 offerings',
            layout: 'half',
            caption: 'Services hub\u201410 SEO entry points with consistent card patterns',
          },
          {
            src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-03.png',
            alt: 'Riding Lessons service page with SEO copy and contact form sidebar',
            layout: 'half',
            caption: 'Service landing page\u2014dedicated contact form on every page',
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        description: 'Built on WordPress with Elementor, WPForms for contact routing, and Yoast SEO for on-page optimization. Configured caching, analytics, and form notifications for the owner.',
        systemMarker: 'Scalability consideration',
        images: [],
      },
      {
        key: 'iteration',
        label: 'Iteration',
        description: 'Trained the owner to manage content updates, add new services, and monitor form submissions and SEO scores independently.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'The rebrand and new site launched with a complete identity overhaul, 10+ SEO-optimized service pages each functioning as independent search entry points with dedicated contact forms, and a WordPress CMS that Deborah Clements still manages independently. Inquiries moved from ~3\u20134 website-driven submissions per month pre-launch to 4\u20135 daily in the weeks after launch\u2014a step-change in demand alignment with the local market. Testimonial themes emphasize site cleanliness, clear UX flow, easy access to training materials, simple service requests, and rider consent access. The redesign drove increased demand; broader conversion results reflect the combined effect of brand, IA, SEO, and CMS handoff.',
    outcomeImages: [
      {
        src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-desktop-01.png',
        alt: 'Homepage hero with SEO-targeted headline and primary inquiry CTA',
        layout: 'full',
        caption: 'Homepage\u2014SEO-targeted headline with primary inquiry CTA',
      },
      {
        src: '/images/work/heatherwood/supporting/outcome/heatherwood-final-mobile-01.png',
        alt: 'Mobile homepage with service cards and enrollment CTA',
        layout: 'full',
        caption: 'Mobile experience\u2014service cards and enrollment flow',
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
    client: 'Tire Rack',
    title: 'AEM Landing Page System & SEO Template Framework',
    summary: 'Designed 50+ landing pages personally, then built the governed AEM template system that two junior designers now use\u2014shifting turnaround from ~1 month to 1\u20132 weeks for complex pages and 1\u20132 days for simple launches.',
    year: '2023\u2013Present',
    tags: ['UX/UI Design', 'Front-End Development', 'CMS'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'HTML/CSS', 'Adobe Creative Suite', 'ChatGPT'],
    timeline: 'Ongoing (50+ landing pages)',
    featured: '/images/work/landing-pages/CS_thumbnail_landing-pages_safe.jpg',
    timeToLive: '~1 month \u2192 1\u20132 weeks for complex pages, 1 week for standard, 1\u20132 days for simple launches.',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Every landing page started from scratch. No templates, no patterns, no scalable process.',
    problem: [
      'Tire Rack\u2019s SEO strategy relies on targeted landing pages capturing high-intent search queries across tire sizes, categories, and niche segments.',
      'Pages were requested by SEO or partner teams and needed to launch quickly\u2014without sacrificing consistency, usability, or performance.',
      'At scale, the challenge wasn\u2019t designing a page\u2014it was creating a system that other designers and teams could use without starting from scratch each time.',
    ],
    problemImages: [
      {
        alt: 'Placeholder for omitted content-brief artifact',
        layout: 'full',
        caption: 'Content / SEO brief available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No reusable templates. No component strategy. Speed and quality treated as tradeoffs.',
    gaps: [
      'No pattern library\u2014each page was a one-off design effort requiring cross-team coordination and multi-week timelines.',
      'Heading hierarchy wasn\u2019t mapped to keyword intent, missing long-tail SEO opportunities.',
      'No AI-assisted workflow for content generation or QA.',
    ],
    gapsImages: [
      {
        alt: 'Placeholder for omitted internal copy spec',
        layout: 'full',
        caption: 'Copy spec available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Minimal briefs. Two audiences (users + search engines). AEM component limitations. Speed is the expectation.',
    constraints: [
      'Pages serve two audiences: customers searching for specific tires and search engines indexing structured content.',
      'Minimal direction per request\u2014often just a tire type, target keywords, and a product photo.',
      'AEM component system with specific authoring constraints and structured field requirements.',
      'SEO, analytics, and merchandising teams all have input on structure and content.',
    ],
    constraintsImages: [
      {
        alt: 'Placeholder for omitted internal project-management artifact',
        layout: 'full',
        caption: 'Project-management surface available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    insightCallout: 'Speed and quality aren\u2019t tradeoffs when you invest in systems. QA now surfaces under one issue per landing page on average\u2014fast turnaround without cutting corners.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Content-Driven Foundation',
        description: 'Every page begins with a content brief and defined goal. I establish page hierarchy (hero, features, products, FAQs), required SEO content placement, and internal linking strategy. Close collaboration with SEO and copy teams to refine needs against available component structures.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Component-Based Planning',
        description: 'In Figma, I map each landing page using reusable components sourced from across the site\u2014hero patterns, product feature sections, FAQ modules, promotional and linking sections. Consistency while allowing flexibility for different page types.',
        systemMarker: 'Pattern introduced',
        images: [
          {
            alt: 'Placeholder for omitted internal roadmap artifact',
            layout: 'full',
            caption: 'Program roadmap available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'system',
        label: 'AEM System Development',
        description: 'Built and established a system of reusable component patterns: rapid page creation from pre-defined layouts to start from.',
        systemMarker: 'System decision',
        images: [
          {
            alt: 'Placeholder for omitted internal review/communication artifact',
            layout: 'full',
            caption: 'Review and iteration detail available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'build',
        label: 'AI-Assisted Workflow',
        description: 'AI is used to standardize repetitive content-ops and production tasks\u2014not to replace strategy. Practical uses: SEO-friendly image naming, alt text generation, release-note drafting, and documentation assistance that helps junior designers navigate the system. LLM assistance is layered on top of the internal wiki I govern, not instead of it.',
        systemMarker: 'Scalability consideration',
        images: [
          {
            alt: 'Placeholder for omitted internal testing-notes artifact',
            layout: 'full',
            caption: 'Testing notes available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'iteration',
        label: 'Iteration & Deployment',
        description: 'High-impact pages (homepage, major category pages, high-traffic surfaces) go through senior review, SEO, analytics, and QA. Lower-risk pages move faster\u2014often senior review, publish, live validation. When SEO needs a structure the template doesn\u2019t support, a formal project request is filed so the system grows deliberately rather than through one-off exceptions. I govern all AEM template and component-level updates.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'This work shifted landing page creation from a one-off design task to a governed system. I personally designed and built 50+ landing pages, and later built the governed system that two junior designers now use under my oversight. Turnaround moved from ~1 month to 1\u20132 weeks for complex pages, a week for standard pages, and 1\u20132 days for simple launches\u2014with QA surfacing under one issue per page on average. One illustrative SEO win: a 40-inch tire landing page contributed to $10k+ in added annual revenue per SEO reporting, though there was no prior page to compare against, so the gain reflects net-new reach rather than design attribution alone.',
    outcomeImages: [
      {
        src: '/images/work/landing-pages/supporting/landing-pages-35-inch.jpg',
        alt: '35-Inch Tires landing page\u2014SEO-driven content built from reusable component system',
        layout: 'full',
        caption: '35-Inch Tires\u2014SEO-driven page built from the reusable template system',
      },
    ],
    outcomeGridImages: [
      {
        src: '/images/work/landing-pages/supporting/landing-pages-20-inch.jpg',
        alt: '20-Inch Tires landing page with product hero and responsive layout',
        layout: 'half',
        caption: '20-Inch Tires',
      },
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
      {
        src: '/images/work/landing-pages/supporting/landing-pages-responsive-preview.jpg',
        alt: 'Product landing page shown across desktop and mobile breakpoints',
        layout: 'half',
        caption: 'Responsive Preview',
      },
      {
        src: '/images/work/landing-pages/supporting/landing-pages-classic-full.jpg',
        alt: 'Classic Car Tires full page with FAQ, featured brands, and testimonials',
        layout: 'half',
        caption: 'Classic Full Page',
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
    client: 'Tire Rack',
    title: 'AEM Component System Rebuild',
    summary: 'Partnered with Tire Rack\u2019s new AEM dev team to rebuild the authoring system around reusable core components. Shipped 10+ live components powering homepage, tires hub, events, and packages\u201460% faster page loads (WebPageTest) and a shared foundation for design, dev, SEO, and accessibility.',
    year: '2024\u20132025',
    tags: ['Design Systems', 'AEM', 'Front-End Development', 'UX Engineering', 'CMS'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'Sass', 'HTML/CSS', 'Git'],
    timeline: '~12 months (ongoing)',
    featured: '/images/work/aem-component-system/CS_thumbnail_AEM_componentSystemRebuild_safe.jpg',
    timeToLive: '12 months from kickoff to live components\u2014core variants and templates now powering the homepage and tires hub.',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'A decade of AEM authoring with no investment in core components, modern patterns, or a shared system.',
    problem: [
      'I\u2019d been authoring in AEM since 2013, before Adobe even acquired the platform\u2014but the team never adopted core components, editable templates, or a scalable pattern library.',
      'Every page was stitched together from aging custom components, one-off overrides, and asset dumps that slowed authoring and hurt page performance.',
      'In 2025 we finally hired a dedicated AEM dev team\u2014the moment to rebuild the foundation, not just patch what was there.',
    ],
    problemImages: [
      {
        src: '/images/work/aem-component-system/AEM_CoreComponents_blurred.jpeg',
        alt: 'Existing AEM component inventory showing fragmented, aging custom components',
        layout: 'full',
        caption: 'Starting point\u2014fragmented custom components built up over a decade of authoring decisions',
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'No reusable patterns. No variable system. Authoring and engineering solving the same problems twice.',
    gaps: [
      'Heroes, product grids, and teasers existed in five different flavors\u2014none of them sharing structure, tokens, or authoring behavior.',
      'SEO and accessibility requirements were bolted on per page instead of baked into the component layer.',
      'No shared Sass variables or authoring defaults\u2014every new page meant re-deciding spacing, type scale, and responsive behavior.',
      'Design team had no documentation on when to use which component or how variants were meant to behave.',
    ],
    gapsImages: [
      {
        alt: 'Placeholder for omitted internal solution-notes artifact',
        layout: 'full',
        caption: 'Solution write-up available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
      {
        alt: 'Placeholder for omitted internal component-requirements artifact',
        layout: 'full',
        caption: 'Requirements doc available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'Live enterprise CMS. SEO-critical surfaces. A new dev team still learning the codebase.',
    constraints: [
      'Work happened inside a live production AEM instance\u2014nothing could break authoring for merchandising or content teams mid-flight.',
      'Every component shipped with SEO and accessibility requirements baked in: lazy loading with toggle control, H1 restrictions per surface, eyebrow support in teaser/hero for keyword headroom without breaking hierarchy, and Akamai integration for serving only the relevant JSP/CSS assets per page.',
      'Invested deliberately in technical fluency: completed AEM authoring certification, finished the weekend AEM tutorial, and leveled up on Sass structure so I could contribute real code alongside the dev team, not just hand off specs.',
      'Led 15 years of DAM cleanup\u2014tagging, alt text, file naming, and asset governance across 100+ images. The operational win (discoverability, consistency, authoring speed) was as important as the performance win.',
    ],
    constraintsImages: [
      {
        alt: 'Placeholder for omitted internal documentation artifact',
        layout: 'full',
        caption: 'DAM cleanup process available on request.',
        isOverlay: true,
        overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
      },
    ],

    insightCallout: 'The win wasn\u2019t any single component\u2014it was establishing a shared system of variables, variants, and documentation that the design, dev, SEO, and accessibility teams could all build against. Shipped real Sass, not just specs.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Worked side by side with Patrick Steins, a trusted engineering peer on AEM, to establish which core components we could adopt as-is, which needed extension, and which had to be built from scratch. He reviewed my branch work based on established trust. Partnered early with SEO and accessibility leads so their requirements\u2014lazy-load toggles, H1 rules, eyebrow patterns, Akamai-scoped asset loading\u2014were baked into the component contract, not layered on after.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Component Proposals',
        description: 'Before any dev work started, I wrote up each component\u2014authoring fields, variants, responsive behavior, edge cases, and how it should plug into editable templates. These proposals became the shared contract between design and engineering.',
        images: [
          {
            alt: 'Placeholder for omitted internal component write-up artifact',
            layout: 'full',
            caption: 'Write-up available on request.',
            isOverlay: true,
            overlayText: "This portion of the work includes internal tooling and workflows not publicly shareable. I'm happy to walk through it in detail."
          },
        ],
      },
      {
        key: 'system',
        label: 'Building the Variants',
        description: 'Built 8 core component variants directly\u2014heroes, teasers, lists, featured product blocks\u2014each shipping with its Sass, authoring defaults, and documentation at the same time. For 3 additional API-driven foundation components, I wrote the utility and authoring behavior, defined the interaction pattern, provided SCSS, and oversaw implementation through replication with the dev team.',
        systemMarker: 'System decision',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/aem-component-system/FinalComponentBuildout_Hero_safe.jpeg',
            alt: 'Final hero component buildout showing variants and responsive behavior',
            layout: 'half',
            caption: 'Hero core\u2014one component, multiple variants, consistent authoring',
          },
          {
            src: '/images/work/aem-component-system/FinalComponentBuildout_Teasers_safe.jpeg',
            alt: 'Final teaser component buildout with multiple layout variations',
            layout: 'half',
            caption: 'Teasers\u2014built to handle editorial, promotional, and product surfaces from the same base',
          },
        ],
      },
      {
        key: 'build',
        label: 'Design-to-Code Foundation',
        description: 'This wasn\u2019t a design-only handoff. I wrote Sass, defined the global variable layer, and shipped component-level code alongside the dev team\u2014closing the gap between what was designed and what landed in production. Sanitized excerpt below (file names redacted; CSS custom properties for tokens, responsive-aware layout containers, and component-scoped Sass).',
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
          caption: 'Excerpt from a component-scoped Sass file I authored\u2014variables for responsive ceilings, CSS custom properties as the token layer, and nested component states. Happy to walk through the broader architecture (global variables, layout containers, token pipeline) in conversation.',
        },
        images: [],
      },
      {
        key: 'iteration',
        label: 'Documentation & Handoff',
        description: 'Every component shipped with written documentation for the design team\u2014when to use which variant, what fields to author, and how the component behaves across breakpoints. That documentation is what turned the build into an actual system other people could use.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'The rebuild moved Tire Rack\u2019s AEM authoring from one-off pages to a real component system\u2014faster page loads (60% improvement measured in WebPageTest), cleaner authoring, and a shared foundation across design, dev, SEO, and accessibility. The new core components now power the homepage, tires landing, events and sponsorship pages, and packages page in production. The authoring experience is night-and-day better for junior designers; combined with my documentation, it lets design and SEO use the CMS much more like a true CMS. Due to proprietary constraints, certain aspects of this system (including internal tooling and workflows) are not publicly displayed\u2014happy to walk through them in detail in conversation.',
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
  // 6. LoopStack → CarbCurve  [personal project, in progress]
  // =============================================
  {
    slug: 'loopstack',
    client: 'LoopStack → CarbCurve (personal project)',
    title: 'LoopStack: Designing a System for Metabolic Decision-Making',
    summary: 'An in-progress 0 → 1 product system that models how meals actually behave—turning CGM data, meal context, and activity into actionable insulin strategy. Phase 1 ships as my personal modeling engine; Phase 2 evolves into CarbCurve, a consumer app.',
    year: '2026',
    tags: ['0 → 1 Product Design', 'System Design', 'Mobile (iOS)', 'AI-Assisted Workflow', 'Health / Metabolic', 'Prototype'],
    role: 'Product Design · UX · Front-End',
    tools: ['Figma', 'Claude', 'ChatGPT', 'Cursor'],
    timeline: '~3–4 weeks (concept → working prototype, ongoing iteration)',
    featured: '/images/work/loopstack/CS_thumbnail_loopstack_safe.png',
    timeToLive: 'Concept to working prototype in ~3–4 weeks. In active development. Evolving into CarbCurve (consumer app) and CarbCurve+ (connected, adaptive system).',

    // ── 01 Problem ──
    problemPunch: 'Most T1D tools assume X carbs = Y insulin. Real glucose response doesn’t work that way.',
    problem: [
      'Tools for people with Type 1 diabetes are built on a simplified model—count the carbs, dose the insulin. But real-world glucose response is shaped by fat, protein, food composition, timing, activity, physiology, and prior patterns.',
      'The result is unpredictable spikes, reactive dosing, and constant guesswork. The problem isn’t counting carbs—it’s understanding how they behave over time.',
    ],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'Static calculation → dynamic behavior modeling. Shape over time, not quantity.',
    gaps: [
      'Existing apps ask “how many carbs?” The better question is “what kind of glucose curve will this meal create?”',
      'No consumer tool in this space treats pattern recognition as a first-class surface. Logs are raw; patterns are the user’s job to spot.',
      'Most tools jump from data → recommendation. Users need an intermediate step: confidence. How reliable is the pattern? How often has it held?',
      'Personal context (dietary habits, lifestyle signals, sensitivity baseline) shapes everything—but it’s rarely captured in a way that actually influences the model.',
    ],

    // ── 03 Constraints ──
    constraintsPunch: 'Solo 0 → 1. High-stakes domain. Decision support only—no dosing claims.',
    constraints: [
      'Solo designer and builder—no research budget, no clinical team, no user panel. Needed a workflow that compressed research, system design, and prototyping.',
      'Type 1 physiology is individual. The system had to personalize around a single user’s history before it could generalize.',
      'High-risk domain. The product can surface patterns and stage changes, but it must never auto-dose or replace clinical guidance. Decision support, not automation.',
      'Mobile-first (iOS). Surfaces had to be scannable mid-meal and mid-decision—not deep dashboards.',
      'AI-assisted workflow had to match the complexity of the domain: prompt → output → critique → refine, with system logic defined before any UI polish.',
    ],

    insightCallout: 'Confidence unlocks action. Most tools go data → recommendation. LoopStack inserts confidence → decision—transforming the experience from automation into decision support.',

    // ── 04 Approach (subsections) ──
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Scoped the work as a phased, system-first 0 → 1: Phase 1 LoopStack (personal modeling engine), Phase 2 CarbCurve (consumer app), Phase 3 CarbCurve+ (connected, adaptive system). Set the product thesis—behavior modeling, not carb counting—before touching UI. Chose an AI-augmented workflow (Claude + ChatGPT for system logic, Figma for structure, Cursor for working prototype) to compress the research/design/build loop into weeks instead of months.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Mapped the product as a continuous learning loop—Input → Model → Insight → Action → Refine—so every surface has a clear role in the loop, not a role in a feature list. The Strategy intake is the decision surface: before any recommendation, the user grounds the meal in context (meal time, activity window, setting) so the model can pair it with the right past patterns.',
        systemMarker: 'Pattern introduced',
        images: [
          {
            src: '/images/work/loopstack/01_strategy_hero.png',
            alt: 'Strategy intake surface—meal time, activity window, and setting captured before requesting a strategy, with optional Loop screenshot evidence upload',
            layout: 'full',
            caption: 'Strategy intake—grounds every recommendation in meal context and evidence before the model runs',
            mobile: true,
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Built the input surfaces as a connected system, mobile-first. Each captures a different layer of context that shapes the model: the Meal Builder structures absorption-influencing ingredients into composable sections; the Dietary Profile sets baseline food patterns and sensitivities; Loop Calibration anchors the system to what the user’s pump/CGM is actually running so LoopStack stays grounded against real therapy settings. Progressive disclosure and explanation-alongside-suggestion are consistent across all surfaces.',
        systemMarker: 'System decision',
        gridColumns: 3,
        images: [
          {
            src: '/images/work/loopstack/02_memory_pattern.png',
            alt: 'Meal Builder surface—composable sections for grains, proteins, nuts and seeds that structure absorption-influencing ingredients',
            layout: 'half',
            caption: 'Meal Builder—composable ingredient sections, not a flat carb count',
            mobile: true,
          },
          {
            src: '/images/work/loopstack/06_profile_calibration.png',
            alt: 'Dietary Profile surface—primary eating pattern, fat sensitivity, protein impact, and typical food mix feeding the personalization layer',
            layout: 'half',
            caption: 'Dietary Profile—baseline patterns and sensitivities',
            mobile: true,
          },
          {
            src: '/images/work/loopstack/05_meal_builder.png',
            alt: 'Loop Calibration surface—upload current Loop therapy settings, absorption model, favorite meals, and full 6–8h outcome entries to ground suggestions against what Loop is actually running',
            layout: 'half',
            caption: 'Loop Calibration—grounds LoopStack against real therapy settings',
            mobile: true,
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        description: 'Worked in rapid prompt → output → critique → refine loops with Claude and ChatGPT to stress-test the modeling framework and the Meal Builder variable space before any UI was built. Prototyping in Cursor became a thinking tool: the working prototype forced the system logic to resolve before the UI did, and it let me validate mental models by using the product personally.',
        codeBlock: {
          language: 'text',
          filename: 'meal-builder-system-prompt.md',
          code: `Design a meal builder flow for a Type 1 diabetes app.

Focus on variables that affect glucose absorption timing and curve shape:
- refined vs whole carbs
- fat content
- protein impact (delayed rise)
- meal timing
- activity window

Avoid calorie tracking or generic nutrition logging.

Instead:
- structure inputs so they influence a predictive model
- enable outputs that determine:
  - fast vs delayed spike
  - upfront vs extended insulin split
  - confidence level

The goal is not tracking — it’s understanding behavior over time.`,
          caption: 'Representative prompt used to align system logic with UX before building the Meal Builder surface. Prompts like this drove the input schema, the model’s outputs, and the decision-support framing.',
        },
        images: [],
      },
      {
        key: 'iteration',
        label: 'Iteration',
        description: 'The most valuable UX moment in this product is deciding whether to trust a recommendation—so confidence, direction of change, and contributing factors sit alongside every pattern, never behind it. The Insights surface exposes observed ISF versus baseline, trend, and meal sample size so the user can judge reliability before acting. Health connections and the fitness-driven ISF multiplier close the loop by letting broader physiological context (cardiovascular load, training volume) adjust suggestions over time.',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/loopstack/03_insight_isf.png',
            alt: 'Insights surface—observed ISF of 54 mg/dL per 1U, +8% vs base, trending up over 18 meals, with an Actionable confidence indicator',
            layout: 'half',
            caption: 'Insights—observed ISF with confidence, direction, and sample size surfaced together',
            mobile: true,
          },
          {
            src: '/images/work/loopstack/04_fix_log.png',
            alt: 'Health connections surface—Apple Health, Dexcom, Loop, and Nightscout sync status with a current fitness trend showing cardiovascular load up 12% over 14 days and an applied ISF multiplier of ×0.92',
            layout: 'half',
            caption: 'Health connections—fitness trend translated into an applied ISF multiplier, visible and explained',
            mobile: true,
          },
        ],
      },
    ],

    // ── 05 Outcome ──
    outcomeNote: 'LoopStack establishes a new frame for this space: not carb counting, but metabolic pattern recognition plus decision support. Phase 1 is currently in active development as my personal modeling engine—meal after meal, the system learns, explains, and helps me decide whether a recommendation is worth acting on. Phase 2 (CarbCurve) evolves the foundation into an accessible consumer app focused on visualizing meal behavior, simulating glucose curves, and teaching absorption dynamics. Phase 3 (CarbCurve+) layers in device integrations (CGM, pumps, Apple Health), personalized model refinement, and community-informed adaptive recommendations.',
    outcomeImages: [
      {
        src: '/images/work/loopstack/loopstack-end-result_safe.png',
        alt: 'LoopStack end-state—the full connected system of surfaces operating as a closed learning loop',
        layout: 'full',
        caption: 'Current end-state of the working prototype—the six surfaces operating as one connected loop',
      },
    ],
    metrics: [
      { value: '3–4 wk', label: 'Concept → working prototype' },
      { value: '6', label: 'Core surfaces in the loop' },
      { value: '3-phase', label: 'Roadmap: LoopStack → CarbCurve → CarbCurve+' },
    ],
  },
];

export default projects;
