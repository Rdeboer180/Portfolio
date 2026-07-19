// ============================================
// About Page — Structured copy data
// All copy lives here, not in markup.
// ============================================

import React from 'react';

// ============================================
// Story Sections — text-first editorial flow ("Craft is the through-line")
// Six scannable beats; each has one orange handwritten annotation.
// ============================================

export interface StorySection {
  num: string;        // "01"
  title: string;
  body: string[];     // one entry per paragraph
  annotation: string; // the single orange handwritten mark
}

export const storySections: StorySection[] = [
  {
    num: '01',
    title: 'Where the craft started',
    body: [
      'I built my foundation intentionally. Before design was my job, it was already where my ' +
        'attention went — high school electives in visual communication, an internship at a local ' +
        'broadcast station, early college courses, and eventually Kendall College of Art and ' +
        'Design, where I studied Graphic Design with a minor in Web Animation.',
      'That early path gave me the base layer I still rely on: composition, hierarchy, typography, ' +
        'pacing, brand, and the discipline of making something feel considered instead of ' +
        'assembled. The tools kept changing, but the fundamentals stayed.',
    ],
    annotation: 'The tools changed. The foundation stayed.',
  },
  {
    num: '02',
    title: 'Getting closer to the code',
    body: [
      'I came into my career with a strong eye for design, but the codebase quickly exposed what ' +
        'I still needed to learn. HTML tables, CSS, responsive behavior, variables, flexbox, CMS ' +
        'constraints — early on, a lot of it felt like a different language.',
      'So I put in the reps. Conferences, certifications, side projects, asking questions, ' +
        'breaking things, fixing them, and slowly getting closer to how the work actually gets ' +
        'built. Over time, that changed my design instincts. I learned how decisions live in ' +
        'production, how systems scale, and how to communicate with engineers in a way that makes ' +
        'the final product stronger.',
    ],
    annotation: 'The file is not the finish line.',
  },
  {
    num: '03',
    title: 'Building systems that last',
    body: [
      'My strongest work often happens in the structure behind the interface: components, ' +
        'documentation, accessibility, governance, reusable templates, CMS logic, and the ' +
        'decisions that help teams move with more confidence.',
      'Over more than 12 years at Tire Rack, that mindset grew across UX strategy, A/B testing, ' +
        'analytics, SEO-informed information architecture, AEM component systems, front-end ' +
        'collaboration, and pattern documentation. I became a lead for building and maintaining ' +
        'component templates and styles because I care about the work lasting after the first ' +
        'version ships.',
    ],
    annotation: 'Good systems help when I’m not in the room.',
  },
  {
    num: '04',
    title: 'Exploring what is next',
    body: [
      'AI-assisted workflows have lowered the cost of exploration. More people can bring ideas to ' +
        'higher fidelity faster, which I think opens up better conversations — but it also makes ' +
        'judgment more important.',
      'For me, tools like Claude, Figma Make, and AI-assisted code generation are not replacements ' +
        'for craft. They are multipliers. The value is still in setting the guardrails, reviewing ' +
        'the output, protecting the brand, checking accessibility, understanding the system, and ' +
        'knowing what is actually worth keeping.',
      'Personal, volunteer, and internal projects have become the place where I test that shift ' +
        'directly. They have helped me build more end-to-end, work around old full-stack barriers, ' +
        'and rediscover the joy of design by getting closer to the full arc of the work.',
    ],
    annotation: 'When making things look real gets easier, judgment matters more.',
  },
  {
    num: '05',
    title: 'The human part',
    body: [
      'I’m a husband and father first. My wife Stephanie, our kids, and the life we’re building at ' +
        'home are the reason I care so much about finding work that is meaningful, sustainable, ' +
        'and aligned with the kind of person I want to be.',
      'Outside of work, my life is built around the people I keep showing up for: Survivor nights ' +
        'with my mom and childhood best friend, Sunday family dinners, board games with cousins, ' +
        'and a dynasty fantasy football league that has somehow become a decade-long strategy ' +
        'system.',
      'Those things probably say a lot about me. I like traditions. I like systems that evolve. I ' +
        'like investing in something long enough to make it better. That mindset shows up in my ' +
        'work too.',
    ],
    annotation: 'Show up. Stay invested. Build things that last.',
  },
  {
    num: '06',
    title: 'Building better bridges',
    body: [
      'I believe the best work happens when people have enough space to think deeply and enough ' +
        'connection to not work in isolation. Remote work has been a huge part of that for me. It ' +
        'gives me the room to do focused design work, stay present for my family, and return to ' +
        'the work with more energy — but I do not believe remote culture works by accident.',
      'At Tire Rack, I’ve been a founding leader of MPG, an internal group built around ' +
        'connection, shared learning, and cross-functional conversation. That work has shaped how ' +
        'I think about team culture. Collaboration is not just being in the same room. It is ' +
        'trust, context, shared language, and people choosing to keep professional relationships ' +
        'strong even when the work happens across screens.',
      'That is also why I’m interested in what tools like Claude can unlock for stakeholder ' +
        'collaboration. When a product idea, rough thought, strategy note, or workflow problem can ' +
        'be brought to higher fidelity faster, more people can participate earlier. A PM, designer, ' +
        'developer, stakeholder, or subject-matter expert can get their idea into a shape the team ' +
        'can actually react to. That does not replace design judgment. It creates a better starting ' +
        'point for shared understanding.',
    ],
    annotation: 'Collaboration is not proximity. It is trust, context, and intent.',
  },
  {
    num: '07',
    title: 'How I work',
    body: [
      'I start by defining the problem and aligning early, because a polished solution does not ' +
        'matter if the team is solving the wrong thing. From there, I design with intent, stay ' +
        'close to implementation, ship with care, and use each release to make the next version ' +
        'stronger.',
      'I value craft, clarity, and ownership. Craft means the work holds up under scrutiny. ' +
        'Clarity means the team can extend it without me in the room. Ownership means I do not ' +
        'wait to be told what needs doing.',
      'The best teams I’ve worked with were not just talented. They were honest, aligned, willing ' +
        'to give and receive feedback, and committed to making each other better. That is the kind ' +
        'of environment I try to help build.',
    ],
    annotation: 'Care is a production skill.',
  },
];

// ============================================
// Process Principles — "My Process" section
// ============================================

export interface Principle {
  num: string;     // e.g. "01"
  label: string;
  title: string;
  body: React.ReactNode;
}

export const principles: Principle[] = [
  {
    num: '01',
    label: 'Method',
    title: 'Define & Align',
    body: (
      <p>
        I ask the right questions before a single pixel moves: the goal, the audience, the
        constraints, the system, and the people who need to build or maintain the work after
        it leaves my hands. A polished solution doesn&rsquo;t matter if the team is solving
        the wrong problem.
      </p>
    ),
  },
  {
    num: '02',
    label: 'Method',
    title: 'Design With Intent',
    body: (
      <p>
        Every design decision should have a reason. From hierarchy and interaction states to
        annotated UI behavior, accessibility, and design tokens, I design so the work can be
        understood, defended, built, and extended by the team.
      </p>
    ),
  },
  {
    num: '03',
    label: 'Method',
    title: 'Build For The Long Game',
    body: (
      <p>
        With years spent close to front-end implementation, I think about how design decisions
        live in production. I care about reusable components, CMS patterns, documentation,
        naming, and responsive behavior — the system behind the screen is what determines
        whether the work holds up after launch.
      </p>
    ),
  },
  {
    num: '04',
    label: 'Method',
    title: 'Validate, Optimize & Drive Results',
    body: (
      <p>
        I design for outcomes, not deliverables. Usability review, A/B testing, analytics,
        SEO-informed information architecture, accessibility checks, and post-launch reflection
        aren&rsquo;t afterthoughts — they&rsquo;re how each release feeds the next iteration.
      </p>
    ),
  },
  {
    num: '05',
    label: 'Method',
    title: 'Put In The Reps',
    body: (
      <p>
        I treat growth deliberately. Photoshop to Illustrator, front-end code to Figma systems,
        certification to AI-assisted workflows — I keep evolving because the industry keeps
        moving. I follow the communities and voices shaping modern design, systems, and AI
        workflows — Drive Club, UI Collective Design, Tommy Geoco, Michael Riddering (Rid),
        Jenny Wen, and Brad Frost&rsquo;s Atomic Design among them — not to chase every trend,
        but to keep testing what actually makes the work better.
      </p>
    ),
  },
];
