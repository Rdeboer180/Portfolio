/** Generalist master, approved portfolio-header edition from October 6, 2026.
 * Keep this copy aligned with public/Ryan-DeBoer-Resume.pdf when replacing the master.
 */
export interface ResumeBullet { text: string; emphasis?: string; }
export interface ResumeEntry {
  name: string;
  title: string;
  dates: string;
  location?: string;
  summary?: string;
  bullets: ResumeBullet[];
  href?: string;
}

export const RESUME = {
  "title": "Product Designer - Systems - UI Engineering",
  "downloadHref": "/Ryan-DeBoer-Resume.pdf?v=2026-10-06",
  "downloadFilename": "Ryan_DeBoer_Product_Design_Generalist.pdf",
  "summary": "I connect product design, design systems, and implementation to carry complex experiences from first decision through production. More than a decade at Tire Rack spans ecommerce and dealer journeys, reusable systems, accessible interaction patterns, and hands-on web implementation. In independent mobile work, I direct agent-assisted builds and review the resulting behavior, design, and release quality.",
  "skills": [
    {
      "label": "Product and experience design",
      "text": "Product strategy, UX/UI design, interaction design, information architecture, user flows, prototyping, responsive design, accessibility."
    },
    {
      "label": "Design systems",
      "text": "Design tokens, semantic naming, component contracts, variants and states, governance, documentation, adoption, contribution guidance."
    },
    {
      "label": "Implementation and delivery",
      "text": "HTML, CSS, SCSS/Sass, AEM authoring, Figma, Storybook collaboration, React Native/Expo/TypeScript agent-assisted builds, implementation QA."
    },
    {
      "label": "Evidence and workflow",
      "text": "Adobe Analytics, WebPageTest, stakeholder collaboration, SEO-informed structure, Claude Code, Figma MCP, Git/GitHub."
    }
  ],
  "experience": [
    {
      "name": "Tire Rack",
      "title": "Senior Web Designer",
      "dates": "May 2021 - Present",
      "location": "South Bend, IN",
      "summary": "Lead product and interface design across ecommerce, dealer workflows, reusable content systems, and internal tools, working with UX, engineering, analytics, SEO, and content teams.",
      "bullets": [
        {
          "text": "Co-Founded and led an internal professional development program serving approximately 90 digital team members, creating structured learning opportunities across technical, product, and leadership disciplines.",
          "emphasis": "approximately 90 digital team members"
        },
        {
          "text": "Redesigned 30+ tire category pages around a shared comparison, icon, and content system. First-month results included up to 50% conversion lift on top pages and up to 400% category-entry growth versus the prior month.",
          "emphasis": "up to 50% conversion lift"
        },
        {
          "text": "Led the WheelRack dealer journey from vehicle selection through checkout and built its first design system: 200+ tokens and 50+ Storybook-integrated components. Partnered with a senior React developer on implementation; the framework was later extended into Wholesale.",
          "emphasis": "200+ tokens and 50+ Storybook-integrated components"
        },
        {
          "text": "Chose a two-tier, 32-icon system instead of 90 one-off icons; the library later grew past 100. Shipped comparison charts with reduced-motion support, screen-reader labels, and a text fallback.",
          "emphasis": "two-tier, 32-icon system"
        },
        {
          "text": "Designed and built 50+ landing pages, then converted recurring patterns into governed AEM templates. Delivery for complex pages moved from about a month to 1-2 weeks; two junior designers now use the system.",
          "emphasis": "from about a month to 1-2 weeks"
        },
        {
          "text": "Partnered with AEM engineers on 10+ reusable components, defining fields, variants, responsive behavior, and accessibility requirements and writing production Sass. WebPageTest measured 60% faster loads on pages using the new components.",
          "emphasis": "60% faster loads"
        },
        {
          "text": "Shipped three AI-assisted internal tools: a Figma metadata plugin, responsive crop simulator, and presentation system used across Design, UX, and Photography.",
          "emphasis": "three AI-assisted internal tools"
        }
      ]
    },
    {
      "name": "Tire Rack",
      "title": "Web Designer",
      "dates": "2014 - 2021",
      "location": "South Bend, IN",
      "bullets": [
        {
          "text": "Owned responsive ecommerce UI from visual design through HTML/CSS/SCSS implementation, collaborating with engineering, SEO, content, and analytics.",
          "emphasis": "HTML/CSS/SCSS implementation"
        },
        {
          "text": "Created reusable page and component patterns in AEM and maintained visual consistency within production constraints."
        }
      ]
    },
    {
      "name": "Round 2 Corp",
      "title": "Designer",
      "dates": "2013 - 2014",
      "bullets": [
        {
          "text": "Created brand, packaging, and product graphics with an emphasis on typography, composition, and production accuracy."
        }
      ]
    }
  ],
  "projects": [
    {
      "name": "PlayDraft",
      "title": "Independent Product Designer & Agent-Assisted Builder",
      "dates": "2026 - Present",
      "bullets": [
        {
          "text": "Led product direction, brand, UX/UI, system rules, and release QA for an iPhone social drafting game; reached TestFlight in 12 weeks and released on the App Store.",
          "emphasis": "TestFlight in 12 weeks"
        },
        {
          "text": "Designed a connected social game loop, then used play feedback to replace next-day community voting with instant scoring for a satisfying single-session result.",
          "emphasis": "next-day community voting with instant scoring"
        },
        {
          "text": "Directed agent-assisted React Native, Expo, and TypeScript implementation and reviewed the working app before release."
        }
      ],
      "href": "/work/playdraft/"
    },
    {
      "name": "LoopStack",
      "title": "Independent Product Designer & Agent-Assisted Builder",
      "dates": "2026 - Present",
      "bullets": [
        {
          "text": "Designed an iOS pattern-review experience using real HealthKit CGM history to compare predicted and observed glucose responses.",
          "emphasis": "pattern-review experience"
        },
        {
          "text": "Made evidence strength and source context visible, separating patterns ready to review from those still developing. Kept the product within review and care-team discussion boundaries."
        }
      ],
      "href": "/work/loopstack/"
    }
  ],
  "education": [
    "Bachelor of Fine Arts, Graphic Design | Kendall College of Art and Design",
    "Minor in Web Animation"
  ]
};
