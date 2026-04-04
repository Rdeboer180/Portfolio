export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  layout: 'full' | 'half';
  caption?: string;
  mobile?: boolean;
}

export interface ApproachSubsection {
  key: string;
  label: string;
  description: string;
  images?: ProjectImage[];
  gridColumns?: 2 | 3 | 4;
  systemMarker?: string;
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
    summary: 'Built a design system from scratch and redesigned the full customer journey for a 20-year-old dealer platform\u2014growing partner adoption from 6 to 10+ retail brands.',
    year: '2023\u20132024',
    tags: ['Design Systems', 'UX Design', 'UI Design', 'Responsive', 'React'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'Token Studio', 'Storybook', 'HTML/CSS', 'JavaScript'],
    timeline: '~4 months dedicated (12+ months total with API delays)',
    featured: '/images/work/wheelrack/CS_thumbnail_wheelrack_designSystem.jpg',
    timeToLive: '8+ months of work to build out system, project pending live date due to ongoing API call work',

    // ── 01 Problem ──
    problemPunch: 'A 20-year-old platform. No design system. No responsive design. Six partners, zero consistency.',
    problem: [
      'WheelRack is Tire Rack\u2019s aftermarket wheel visualizer\u2014roughly 20 years old, served to dealers across 6 retail partners.',
      'Dealers use it on tablets in-store. No responsive design, clunky dropdowns, visually inconsistent across partner brands.',
      'Business goal: modernize as a proof-of-concept for Tire Rack\u2019s future tech stack (React + Microservices).',
    ],
    problemImages: [
      {
        src: '/images/work/wheelrack/supporting/Problem/oldsite1.png',
        alt: 'Old WheelRack vehicle selector showing basic dropdown and outdated partner branding',
        layout: 'full',
        caption: 'The existing vehicle selector\u2014no autocomplete, no responsive behavior, no shared design language',
      },
    ],

    // ── 02 Gaps & Opportunity ──
    gapsPunch: 'Every partner was a one-off. No tokens, no components, no shared language between design and engineering.',
    gaps: [
      'No shared design system, tokens, or component library\u2014every partner variant handled ad hoc.',
      'Identified early that my Figma skills needed leveling up. Completed an 80+ hour Figma Masterclass certification mid-project.',
      'Partnered with a senior React developer to build the system from the ground up\u2014Figma components integrated with Token Studio, validated through Storybook.',
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
      'Complex fitment edge cases: front/rear sizing, unavailable finish combos, missing vehicle photography, partner-specific behaviors.',
      'Custom headers/footers per partner with additional filters or cart integration.',
      'Coordinated with in-house photography team for vehicle and wheel images at specific angles.',
    ],
    constraintsImages: [
      {
        src: '/images/work/wheelrack/supporting/opportunity/beforeIbegin_discovery.png',
        alt: 'Figma Masterclass certification awarded to Ryan DeBoer\u2014system thinking before visual design',
        layout: 'full',
        caption: 'Invested in system-level thinking before jumping into visuals\u2014the foundation for everything that followed',
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
            src: '/images/work/wheelrack/supporting/opportunity/storybook.png',
            alt: 'Storybook button component with props table showing variant, size, and state controls',
            layout: 'full',
            caption: 'Storybook integration\u2014props, variants, and interactive playground bridging design to code',
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
    outcomeNote: 'Delivered a complete design system and full customer journey from vehicle selection through checkout. 6 additional dealer partners opted in after seeing the redesigned UI\u2014growing the platform from 6 to 10+ retail partners. The Storybook-integrated component library enabled the React team to build without ambiguity, and the token system established a shared language between design and engineering.',
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
      { value: '6 \u2192 10+', label: 'Retail partners (organic growth)' },
    ],
  },

  // =============================================
  // 1. Tire Rack — Tire Category Redesign  [image RIGHT]
  // =============================================
  {
    slug: 'tire-categories',
    client: 'Tire Rack',
    title: 'Tire Category Page Redesign & Optimizations',
    summary: 'Redesigned 30+ tire category pages into a scalable system\u2014creating a unified framework of iconography, data visualization, and content structure that drove +400% entry growth and +50% conversion lift.',
    year: '2024',
    tags: ['UX Design', 'UI Design', 'Wireframing', 'Design Systems'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'FigJam', 'HTML/CSS', 'Adobe Creative Suite'],
    timeline: '2 months',
    featured: '/images/work/tire-categories/CS_thumbnail_TireCategories.jpg',
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
        src: '/images/work/tire-categories/supporting/Problem/projectNotes.png',
        alt: 'Project notes outlining category page requirements, content structure, and initial scope',
        layout: 'full',
        caption: 'Project notes\u2014scoping the category system before any design work began',
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
        src: '/images/work/tire-categories/supporting/opportunity/earlyProcess_notes.png',
        alt: 'Early process notes mapping category structure and content requirements',
        layout: 'full',
        caption: 'Early discovery notes\u2014mapping what was missing before any design began',
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

    insightCallout: 'Created 32 custom icons and a CSS-animated performance chart system\u2014turning dense spec data into scannable, visual decision-making tools.',

    // \u2500\u2500 04 Approach (subsections) \u2500\u2500
    approachSubsections: [
      {
        key: 'alignment',
        label: 'Alignment',
        description: 'Broke the experience into scalable layers: category hierarchy, icon systems, data visualization, and content structure aligned to SEO intent. Close coordination across SEO, copy, testing, and development teams throughout.',
        images: [],
      },
      {
        key: 'structure',
        label: 'Structure',
        description: 'Defined the category page hierarchy and wireframed repeatable layout patterns that could flex across 40+ variations while keeping product discovery and comparison front and center.',
        systemMarker: 'Pattern introduced',
        images: [
          {
            src: '/images/work/tire-categories/supporting/Problem/wireframes.png',
            alt: 'Category page wireframes showing layout hierarchy and content zones',
            layout: 'full',
            caption: 'Wireframes establishing the repeatable page structure across all category types',
          },
        ],
      },
      {
        key: 'system',
        label: 'System',
        description: 'Developed 8 primary category icons and 24 supporting characteristic icons to reduce cognitive load. Designed a CSS-animated bar chart system for performance comparison. Worked with the photography team to define visual direction for each category.',
        systemMarker: 'System decision',
        gridColumns: 2,
        images: [
          {
            src: '/images/work/tire-categories/supporting/constraints/workingFiles.png',
            alt: 'Working design files showing icon system development and category component variants',
            layout: 'half',
            caption: 'Working files\u2014icon system and component development across category types',
          },
          {
            src: '/images/work/tire-categories/supporting/outcome/primaryHome+icons.png',
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
            src: '/images/work/tire-categories/supporting/approach/snipet_beforede1.png',
            alt: 'Code snippet showing CSS implementation of category page components',
            layout: 'half',
            caption: 'Front-end execution\u2014CSS and component structure contributed directly to the build',
          },
          {
            src: '/images/work/tire-categories/supporting/approach/versioning_git.png',
            alt: 'Git version control showing branch management for category page development',
            layout: 'half',
            caption: 'Version control\u2014managing code alongside the development team',
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
    outcomeNote: 'The redesigned system aligned SEO, UX, and product discovery into a single framework\u2014reducing friction while increasing clarity and conversion. It created a scalable foundation that supports 30+ category pages with consistent patterns and CMS-driven flexibility.',
    outcomeImages: [
      {
        src: '/images/work/tire-categories/supporting/outcome/in-page-application.png',
        alt: 'Category detail page showing performance bar charts, product grid, and icon system in context',
        layout: 'full',
        caption: 'Category page in context\u2014performance data, icon system, and product discovery working together',
      },
      {
        src: '/images/work/tire-categories/supporting/outcome/winter_m.png',
        alt: 'Winter tire category page on mobile showing responsive layout with performance data and product listings',
        layout: 'full',
        caption: 'Mobile category experience\u2014responsive layout maintaining full functionality',
        mobile: true,
      },
    ],
    metrics: [
      { value: '+400%', label: 'Category page entry growth' },
      { value: '+50%', label: 'Conversion lift across key pages' },
      { value: '32', label: 'Custom icons (8 primary + 24 supporting)' },
    ],
  },

  // =============================================
  // 2. Tire Rack — AEM Seasonal Content Strategy  [image LEFT]
  // =============================================
  {
    slug: 'tire-rack-winter',
    client: 'Tire Rack',
    title: 'Tire Rack Seasonal Content Swap \u2014 AEM Experience Fragments & Adobe Target',
    summary: 'Built and owned a scalable AEM content system that swaps 20+ components across 6 landing pages each season\u2014driving +30% winter tire sales over 10+ years.',
    year: '2013\u2013Present',
    tags: ['AEM', 'Content Strategy', 'SEO', 'Photography Direction', 'Design Systems'],
    role: 'Senior Web Designer / AEM Content Strategist',
    tools: ['Adobe Experience Manager', 'Adobe Target', 'Figma', 'HTML/SCSS', 'Adobe Creative Suite'],
    timeline: '10+ years',
    featured: '/images/work/tire-rack-winter/CS_thumbnail_AEM_Winterization.jpg',
    timeToLive: '10+ years of continuous ownership\u2014system deployed seasonally each fall with same-day content swaps',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Manual seasonal updates. No scalable system. Winter and southern-states customers seeing the same content.',
    problem: [
      'Since 2013, Tire Rack needed a winterized version of its high-traffic landing pages each fall\u2014homepage, tire pages, delivery, research, and wheel adjustment pages.',
      'Early seasonal updates were manual and time-intensive. As the digital footprint grew, the process needed to scale without duplicating pages or confusing search engines.',
    ],
    problemImages: [
      {
        src: '/images/work/tire-rack-winter/supporting/Problem/contentDoc.png',
        alt: 'Content documentation outlining seasonal swap requirements and component inventory',
        layout: 'full',
        caption: 'Content documentation\u2014scoping the seasonal system before building',
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
        src: '/images/work/tire-rack-winter/supporting/opportunity/photography_collecting_ideas.png',
        alt: 'Photography direction notes for seasonal imagery collection and shoot planning',
        layout: 'full',
        caption: 'Photography direction\u2014collecting ideas and planning seasonal shoots',
      },
    ],

    // \u2500\u2500 03 Constraints \u2500\u2500
    constraintsPunch: 'SEO can\u2019t see duplicate pages. Analytics needs audience segmentation. Photography needs seasonal imagery on a schedule.',
    constraints: [
      'Google had to treat winter and southern-states variants consistently\u2014not as duplicate pages.',
      'Audience segmentation rules defined with Analytics team via Adobe Target.',
      'Directed on-site photography shoots for seasonal imagery.',
      'System needed to be documented clearly enough to onboard and mentor junior designers.',
    ],
    constraintsImages: [
      {
        src: '/images/work/tire-rack-winter/supporting/constraints/documenting authoring contingencies.png',
        alt: 'AEM Mapping of component swaps based on author location and their publisher counterparts',
        layout: 'full',
        caption: 'AEM Mapping of component swaps based on author location and their publisher counterparts',
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
        description: 'Refined annually over 10+ years. Added new fragment types, updated audience rules with Analytics, and expanded the system from homepage-only to 6 high-traffic landing pages.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'Over 10+ years of ownership, this system grew into a scalable AEM Experience Fragment library\u201420+ component types, audience-targeted via Adobe Target, spanning 6 high-traffic landing pages simultaneously. The Photography team collaboration (including on-site shoots I directed) produced the seasonal imagery, and ongoing SEO alignment ensured consistent indexing across variants. Junior designers now author independently using the documented system.',
    outcomeImages: [
      {
        src: '/images/work/tire-rack-winter/supporting/outcome/winter-homepage-desktop.png',
        alt: 'Winterized Tire Rack homepage with seasonal hero, editorial blocks, and category grid',
        layout: 'full',
        caption: 'Winterized homepage\u2014full Experience Fragment swap across all above-the-fold sections',
      },
    ],
    metrics: [
      { value: '+30%', label: 'Winter tire sales increase' },
      { value: '+20%', label: 'Winter All-Season tire sales' },
      { value: '20+', label: 'Components swapped site-wide' },
      { value: '10+', label: 'Years of end-to-end ownership' },
    ],
  },

  // =============================================
  // 3. Heatherwood Equestrian Academy  [image RIGHT]
  // =============================================
  {
    slug: 'heatherwood',
    client: 'Heatherwood Equestrian Academy',
    title: 'Building a Brand and a Sustainable System for a Local Equestrian Academy',
    summary: 'Built a complete digital brand from scratch for a 30-year family-owned academy\u201410+ SEO service pages, each with its own conversion path, running on a CMS the owner manages independently.',
    year: '2025',
    tags: ['Brand Design', 'Web', 'SEO', 'CMS'],
    role: 'Brand & Web Designer',
    tools: ['Figma', 'WordPress', 'Elementor', 'WPForms', 'Yoast SEO', 'Adobe Illustrator'],
    timeline: '4 months',
    featured: '/images/work/heatherwood/CS_thumbnail_Heatherwood.jpg',
    timeToLive: '~4 months from first meeting to full brand + site launch',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'No brand. No website. No way for families to discover or enroll online.',
    problem: [
      'Heatherwood had operated for decades on word-of-mouth alone\u2014no brand system, no web presence.',
      'Families search for specific activities ("horseback riding lessons South Bend"), not the brand name. Each service needed its own search entry point.',
      'The system had to be fully owner-managed with zero ongoing agency dependency.',
    ],
    problemImages: [
      {
        src: '/images/work/heatherwood/supporting/Problem/Screenshot 2026-04-02 at 10.16.00\u202FAM.png',
        alt: 'Initial project scope and requirements for Heatherwood digital brand',
        layout: 'full',
        caption: 'Project scope\u2014defining what the brand and site needed to accomplish',
      },
    ],

    // \u2500\u2500 02 Gaps & Opportunity \u2500\u2500
    gapsPunch: 'Competing with commercial programs on visuals while capturing the warmth of a family-run academy.',
    gaps: [
      'No visual identity existed\u2014needed a brand that feels warm and family-oriented but competes with larger commercial programs.',
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
        description: 'Built the brand identity (logo, color, typography) and designed reusable page patterns\u2014service card grids, FAQ accordions, contact form sidebars\u2014that scale across 10+ service pages.',
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
    outcomeNote: 'The site launched with a complete brand identity, 10+ SEO-optimized service pages each functioning as independent search entry points with dedicated contact forms, an FAQ section addressing real parent questions, and a WordPress CMS the owner operates independently. Families now discover Heatherwood through Google searches for specific services\u2014a capability that didn\u2019t exist before this project.',
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
      { value: 'Full Brand', label: 'Built from zero' },
      { value: '10+', label: 'SEO service landing pages' },
      { value: 'Owner-Run', label: 'Zero ongoing agency dependency' },
    ],
  },
  // =============================================
  // 4. Tire Rack — AEM Landing Page System  [image LEFT]
  // =============================================
  {
    slug: 'landing-pages',
    client: 'Tire Rack',
    title: 'AEM Landing Page System & SEO Template Framework',
    summary: 'Developed a scalable AEM template system that shifted landing page creation from one-off design tasks to a repeatable framework\u201450+ pages shipped, from weeks to hours.',
    year: '2023\u2013Present',
    tags: ['UX Design', 'UI Design', 'Front-End Development', 'Design Systems'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['AEM', 'Figma', 'HTML/CSS', 'Adobe Creative Suite', 'ChatGPT'],
    timeline: 'Ongoing (50+ landing pages)',
    featured: '/images/work/landing-pages/CS_thumbnail_landing-pages.jpg',
    timeToLive: 'From weeks to days\u2014system reduced turnaround from multi-week cycles to same-week launches',

    // \u2500\u2500 01 Problem \u2500\u2500
    problemPunch: 'Every landing page started from scratch. No templates, no patterns, no scalable process.',
    problem: [
      'Tire Rack\u2019s SEO strategy relies on targeted landing pages capturing high-intent search queries across tire sizes, categories, and niche segments.',
      'Pages were requested by SEO or partner teams and needed to launch quickly\u2014without sacrificing consistency, usability, or performance.',
      'At scale, the challenge wasn\u2019t designing a page\u2014it was creating a system that other designers and teams could use without starting from scratch each time.',
    ],
    problemImages: [
      {
        src: '/images/work/landing-pages/supporting/contentBrief.png',
        alt: 'Content brief showing SEO keywords and page requirements for a new landing page',
        layout: 'full',
        caption: 'Typical intake\u2014an SEO-driven content brief that needs to become a live page',
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
        src: '/images/work/landing-pages/supporting/copy_provided.png',
        alt: 'Raw copy and content inputs provided for landing page development',
        layout: 'full',
        caption: 'Content inputs\u2014translating raw copy and SEO requirements into structured layouts',
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
        src: '/images/work/landing-pages/supporting/projectDoc.png',
        alt: 'Project scope document defining landing page requirements and deliverables',
        layout: 'full',
        caption: 'Scope document\u2014defining requirements and component needs before design begins',
      },
    ],

    insightCallout: 'Speed and quality aren\u2019t tradeoffs when you invest in systems. Reusable patterns and AI-assisted workflows let me ship in hours without shortcuts.',

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
            src: '/images/work/landing-pages/supporting/ongoing_efforts_organize.png',
            alt: 'Organized list of ongoing landing page efforts and component planning',
            layout: 'full',
            caption: 'System planning\u2014managing component selection and page structure across 50+ pages',
          },
        ],
      },
      {
        key: 'system',
        label: 'AEM System Development',
        description: 'Built and refined reusable AEM component patterns: rapid page creation from pre-defined layouts, flexible content input through structured fields, and integration with API-driven product and search data.',
        systemMarker: 'System decision',
        images: [
          {
            src: '/images/work/landing-pages/supporting/communication_images.png',
            alt: 'Cross-team communication artifacts from landing page development process',
            layout: 'full',
            caption: 'Cross-functional coordination\u2014aligning SEO, merchandising, and development on component strategy',
          },
        ],
      },
      {
        key: 'build',
        label: 'AI-Assisted Workflow',
        description: 'Developed a ChatGPT-based workflow that generates structured content from component inputs, pulls relevant product categories (tire sizes, wheel sizes), creates internal linking structures aligned to SEO strategy, and produces QA-ready notes and testing scenarios.',
        systemMarker: 'Scalability consideration',
        images: [
          {
            src: '/images/work/landing-pages/supporting/testing notes.png',
            alt: 'QA testing notes and deployment checklist for landing page launch',
            layout: 'full',
            caption: 'QA documentation\u2014AI-generated testing scenarios and deployment checklist',
          },
        ],
      },
      {
        key: 'iteration',
        label: 'Iteration & Deployment',
        description: 'High-impact pages deploy to staging with generated QA docs and team review. Lower-risk pages publish directly with live testing and optimization. Process evolved from week-long cycles to same-week or multi-day turnarounds.',
        images: [],
      },
    ],

    // \u2500\u2500 05 Outcome \u2500\u2500
    outcomeNote: 'This work shifted landing page creation from a one-off design task to a scalable system. By combining design systems, AEM component strategy, and AI-assisted workflows, I enabled faster execution, better consistency, and stronger alignment between SEO, UX, and product discovery.',
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
      { value: '50+', label: 'Landing pages created' },
      { value: 'Weeks \u2192 Days', label: 'Turnaround reduction' },
      { value: 'Consistent', label: 'UX across all SEO experiences' },
    ],
  },
];

export default projects;
