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

export interface Project {
  slug: string;
  client: string;
  title: string;
  year: string;
  tags: string[];
  role: string;
  tools: string[];
  timeline: string;
  featured: string;
  brief: string;
  challenge: string;
  images: ProjectImage[];
  metrics: ProjectMetric[];
  resultsNote?: string;
}

const projects: Project[] = [
  // =============================================
  // 1. Heatherwood Equestrian Academy
  // =============================================
  {
    slug: 'heatherwood',
    client: 'Heatherwood Equestrian Academy',
    title: 'Building a Brand and a Sustainable System for a Local Equestrian Academy',
    year: '2025',
    tags: ['Brand Design', 'Web', 'SEO', 'CMS'],
    role: 'Brand & Web Designer',
    tools: ['Figma', 'WordPress', 'Elementor', 'WPForms', 'Yoast SEO', 'Adobe Illustrator'],
    timeline: '4 months',
    featured: '/images/work/heatherwood/heatherwood-final-desktop-01.png',
    brief: 'Partnered with Deborah Clements, founder of a 30-year family-owned equestrian academy in Granger, Indiana, to build a complete digital brand from scratch. The strategy centered on capturing Heatherwood\u2019s key demographic \u2014 families with children ages 5\u201315 across the Michiana area \u2014 through SEO-leveraged service pages that double as search entry points, FAQ content structured around the real questions parents ask before enrolling, and a conversion path that routes every visitor to a form submission. Each service page was designed as its own landing page with a contact form sidebar, because analytics showed that families arrive searching for a specific activity \u2014 not the brand name.',
    challenge: 'Heatherwood had operated for decades on word-of-mouth alone. There was no brand system, no web presence, and no way for families to discover or enroll online. The core challenge was three-fold: build a brand identity that captures the warmth of a family environment while competing visually with larger commercial programs; architect a site where each service \u2014 riding lessons, summer camps, boarding, birthday parties, trail rides \u2014 functions as an independent SEO entry point with its own conversion path; and deliver the entire system in a way that a non-technical owner can manage independently, with zero ongoing agency dependency. Every headline needed to work for both the parent scanning the page and the search engine indexing it.',
    images: [
      // 1. Notes — brand collateral (road sign + vehicle magnet)
      {
        src: '/images/work/heatherwood/heatherwood-notes-01.png',
        alt: 'Heatherwood Equestrian Academy road sign with logo, QR code, and services listed: Lessons, Camps, Boarding',
        layout: 'half',
        caption: 'heatherwood-notes-01 — Brand identity applied to roadside signage with QR code for mobile conversion',
      },
      {
        src: '/images/work/heatherwood/heatherwood-notes-02.png',
        alt: 'Heatherwood branded vehicle magnet on truck door showing logo, QR code, and service list',
        layout: 'half',
        caption: 'heatherwood-notes-02 — Vehicle magnet extending brand visibility into the local community',
      },
      // 2. Final desktop — homepage hero
      {
        src: '/images/work/heatherwood/heatherwood-final-desktop-01.png',
        alt: 'Heatherwood Academy desktop homepage hero with horses in pasture and SEO headline',
        layout: 'full',
        caption: 'heatherwood-final-desktop-01 — Homepage hero with SEO-targeted headline and primary inquiry CTA',
      },
      // 3. Final desktop — services grid + service detail pair
      {
        src: '/images/work/heatherwood/heatherwood-final-desktop-02.png',
        alt: 'Desktop Services and Experiences page showing card grid of all 10 offerings',
        layout: 'half',
        caption: 'heatherwood-final-desktop-02 — Services hub with 10 SEO entry points',
      },
      {
        src: '/images/work/heatherwood/heatherwood-final-desktop-03.png',
        alt: 'Riding Lessons service page with SEO copy and contact form sidebar',
        layout: 'half',
        caption: 'heatherwood-final-desktop-03 — Service landing page with dedicated contact form',
      },
      // 4. Final mobile — homepage + FAQ (mobile frames)
      {
        src: '/images/work/heatherwood/heatherwood-final-mobile-01.png',
        alt: 'Mobile homepage showing service cards and three-step enrollment flow',
        layout: 'half',
        caption: 'heatherwood-final-mobile-01 — Mobile homepage with service cards and enrollment CTA',
        mobile: true,
      },
      {
        src: '/images/work/heatherwood/heatherwood-final-mobile-04.png',
        alt: 'Plan Your Ride FAQ accordion on mobile with parent questions about lessons',
        layout: 'half',
        caption: 'heatherwood-final-mobile-04 — FAQ targeting real parent search queries',
        mobile: true,
      },
      // 5. Notes — CMS dashboard (sustainability system)
      {
        src: '/images/work/heatherwood/heatherwood-notes-05.png',
        alt: 'WordPress admin dashboard with analytics, caching, and Yoast SEO integration',
        layout: 'full',
        caption: 'heatherwood-notes-05 — Owner-managed CMS with analytics, forms, and SEO scoring',
      },
    ],
    metrics: [
      { value: 'Full Brand', label: 'Built from zero' },
      { value: '10+', label: 'SEO service landing pages' },
      { value: 'Owner-Run', label: 'Zero ongoing agency dependency' },
    ],
    resultsNote: 'The site launched with a complete brand identity, 10+ SEO-optimized service pages each functioning as independent search entry points with dedicated contact forms, an FAQ section addressing the real questions parents ask before enrolling, and a WordPress CMS the owner operates independently. Families now discover Heatherwood through Google searches for specific services like "horseback riding lessons South Bend" and "summer horse camps Granger Indiana" \u2014 a capability that didn\u2019t exist before this project.',
  },

  // =============================================
  // 2. Tire Rack \u2014 Tire Category Redesign
  // =============================================
  {
    slug: 'tire-categories',
    client: 'Tire Rack',
    title: 'Tire Category Page Redesign & Optimizations',
    year: '2024',
    tags: ['UX Design', 'UI Design', 'Wireframing', 'Design Systems'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'FigJam', 'HTML/CSS', 'Adobe Creative Suite'],
    timeline: '6 months',
    featured: '/images/work/tire-categories/featured.png',
    brief: 'Tire Rack\u2019s category pages were the primary entry point for millions of customers navigating one of the largest online tire retailers. The existing system relied on outdated layouts, inconsistent iconography, and a content structure that didn\u2019t reflect how real users shop for tires. The project spanned wireframing, requirements documentation, custom icon design, and full high-fidelity mockups across desktop and mobile.',
    challenge: 'The core challenge was rethinking how tire categories are presented \u2014 from a flat, text-heavy page to a structured, visually intuitive system that reduces decision fatigue. Customers needed to quickly identify the right tire type for their driving conditions without reading walls of spec text. Each category required a distinct visual identity through custom iconography while maintaining consistency across the system.',
    images: [
      {
        src: '/images/work/tire-categories/featured.png',
        alt: 'Tire category redesign \u2014 before and after comparison with custom icon system',
        layout: 'full',
        caption: 'Final category page designs with custom weather and terrain icon set',
      },
      {
        src: '/images/work/tire-categories/in-page-application.png',
        alt: 'Extreme Performance Summer tire category page showing product grid, features section, and brand logos',
        layout: 'full',
        caption: 'In-page application \u2014 category detail view with feature callouts and product grid',
      },
    ],
    metrics: [
      { value: '+34%', label: 'Category page engagement' },
      { value: '-22%', label: 'Bounce rate reduction' },
      { value: '6', label: 'Custom icon categories designed' },
    ],
    resultsNote: 'The redesigned category system improved findability across all tire types and established a scalable pattern now used across additional product verticals at Tire Rack.',
  },

  // =============================================
  // 3. WheelRack \u2014 Design System & Customer Journey
  // =============================================
  {
    slug: 'wheelrack',
    client: 'Tire Rack \u2014 WheelRack',
    title: 'WheelRack Design System & Full Customer Journey Redesign',
    year: '2023\u20132024',
    tags: ['Design Systems', 'UX Design', 'UI Design', 'Responsive', 'Wireframing'],
    role: 'Senior Web Designer / UX Engineer',
    tools: ['Figma', 'FigJam', 'HTML/CSS', 'JavaScript'],
    timeline: '12+ months',
    featured: '/images/work/wheelrack/wheelrack-final-desktop-01.png',
    brief: 'WheelRack is Tire Rack\u2019s dedicated aftermarket wheel shopping experience, served across multiple retail partner brands (PitStop, OrderTire, AAFES Exchange, AutoNation). The project required a ground-up revamp and replatform \u2014 building a shared design system from scratch, designing the full customer journey from vehicle selection through wheel details, and delivering responsive high-fidelity mockups with detailed UI behavior documentation for every state and edge case.',
    challenge: 'The existing WheelRack experience was fragmented, visually inconsistent across partner sites, and lacked a coherent design system. The vehicle selector used a clunky dropdown interface with no autocomplete. Search results had no wheel visualizer. Product detail pages couldn\u2019t handle complex fitment scenarios like front/rear sizing or unavailable finish combinations. Every interaction needed to be redesigned from wireframe through high-fidelity \u2014 across desktop, tablet, and mobile \u2014 with annotated UI behavior specs for engineering handoff.',
    images: [
      // 1. Design System — color tokens
      {
        src: '/images/work/wheelrack/wheelrack-design-system-01.png',
        alt: 'WheelRack design system color token palette with neutral, primary, secondary, and semantic scales',
        layout: 'full',
        caption: 'wheelrack-design-system-01 — Color token system across all semantic scales',
      },
      // 2. Design System — typography + buttons pair
      {
        src: '/images/work/wheelrack/wheelrack-design-system-02.png',
        alt: 'Typography scale with heading sizes, weights, and body text styles',
        layout: 'half',
        caption: 'wheelrack-design-system-02 — Typography scale and hierarchy',
      },
      {
        src: '/images/work/wheelrack/wheelrack-design-system-04.png',
        alt: 'Button component library with primary and secondary variants across sizes and states',
        layout: 'half',
        caption: 'wheelrack-design-system-04 — Button components with full state matrix',
      },
      // 3. UX Wireframe — vehicle selector flow
      {
        src: '/images/work/wheelrack/wheelrack-ux-wireframe-01.png',
        alt: 'Vehicle selector wireframe with Make/Year/Model steps and annotated UI behavior specs',
        layout: 'full',
        caption: 'wheelrack-ux-wireframe-01 — Vehicle selector UX with annotated behavior specs',
      },
      // 4. Final desktop — landing page
      {
        src: '/images/work/wheelrack/wheelrack-final-desktop-01.png',
        alt: 'WheelRack landing page with wheel visualizer, vehicle image, filters, and search results across desktop and mobile',
        layout: 'full',
        caption: 'wheelrack-final-desktop-01 — High-fidelity landing page with wheel visualizer',
      },
      // 5. Final desktop — wheel details + annotated specs pair
      {
        src: '/images/work/wheelrack/wheelrack-final-desktop-04.png',
        alt: 'Wheel details page with product hero, finish selector, vehicle preview, and spec table',
        layout: 'half',
        caption: 'wheelrack-final-desktop-04 — Product detail page with vehicle preview',
      },
      {
        src: '/images/work/wheelrack/wheelrack-final-desktop-05.png',
        alt: 'Annotated wheel details with numbered UI behavior callouts for engineering handoff',
        layout: 'half',
        caption: 'wheelrack-final-desktop-05 — Annotated specs for engineering handoff',
      },
      // 6. Final mobile — responsive results
      {
        src: '/images/work/wheelrack/wheelrack-final-mobile-01.png',
        alt: 'Mobile wheel search results with responsive filter flyout and stacked product cards',
        layout: 'full',
        mobile: true,
        caption: 'wheelrack-final-mobile-01 — Mobile results with responsive filter pattern',
      },
    ],
    metrics: [
      { value: '50+', label: 'Design system components' },
      { value: '22', label: 'Pages of annotated UI specs' },
      { value: '4', label: 'Retail partners supported' },
    ],
    resultsNote: 'Delivered a complete design system and full customer journey from vehicle selection through product details. The system supports four retail partner brands, handles complex fitment edge cases, and shipped with annotated UI behavior documentation for every state \u2014 enabling engineering to build without ambiguity.',
  },
];

export default projects;
