// ============================================
// About Page — Structured copy data
// All copy lives here, not in markup.
// ============================================

import React from 'react';

// ============================================
// Story Cards — "Who I Am" section
// ============================================

export interface StoryCard {
  id: string;
  num: string;      // e.g. "01"
  label: string;
  title: string;
  body: React.ReactNode;
  highlight: string;
  tabColor: string; // pastel file-divider hue for this card's tab
}

export const storyCards: StoryCard[] = [
  {
    id: 'origin',
    num: '01',
    label: 'Origin',
    title: 'A design path that started before the job title.',
    body: (
      <>
        <p>
          I built my foundation intentionally. Before design was my career, it was already how
          I spent my time — high school electives in visual communication, an internship at a
          local broadcast station, early college courses, and eventually Kendall College of Art
          and Design, where I studied Graphic Design with a minor in Web Animation.
        </p>
        <p>
          That early path gave me the thing I still rely on most: a respect for the fundamentals.
          Composition, hierarchy, typography, pacing, brand, and visual clarity are still the base
          layer of how I work, even as the tools around the work keep changing.
        </p>
      </>
    ),
    highlight: 'The tools changed. The foundation still matters.',
    tabColor: '#E8956B',
  },
  {
    id: 'craft',
    num: '02',
    label: 'Craft',
    title: 'I still care about making the work feel considered.',
    body: (
      <>
        <p>
          I started in Photoshop, pushed deeper into Illustrator, and learned icon systems,
          vector craft, layout, brand expression, and the small visual decisions that make an
          interface feel intentional instead of assembled.
        </p>
        <p>
          That part of me has never gone away. Even now — working with design systems, CMS
          patterns, front-end constraints, or AI-assisted workflows — I believe craft is visible
          in the details: the spacing, the naming, the interaction, the empty state, the handoff,
          the thing someone else has to maintain later.
        </p>
      </>
    ),
    highlight: 'Craft is not decoration. It’s care made visible.',
    tabColor: '#E9B84D',
  },
  {
    id: 'code',
    num: '03',
    label: 'Code',
    title: 'I got closer to the code because I wanted the work to survive implementation.',
    body: (
      <>
        <p>
          Early in my career, conversations around HTML tables, CSS, responsive behavior,
          variables, flexbox, and CMS constraints felt like a different language. I wasn&rsquo;t
          at the level of the people around me yet, so I closed that gap the only way I knew
          how: by putting in the reps.
        </p>
        <p>
          Over time, front-end logic became part of how I think. I learned how design decisions
          live in production, how templates constrain real teams, how styles scale, and how to
          communicate with engineers in a way that makes the final product stronger.
        </p>
      </>
    ),
    highlight: 'The closer I got to implementation, the better my design decisions became.',
    tabColor: '#A7C796',
  },
  {
    id: 'systems',
    num: '04',
    label: 'Systems',
    title: 'The system is bigger than the screen.',
    body: (
      <>
        <p>
          My strongest work often happens in the structure behind the interface: component
          patterns, documentation, governance, accessibility checks, reusable templates, CMS
          logic, design tokens, and the decisions that help teams move with more consistency.
        </p>
        <p>
          At Tire Rack, that mindset showed up across AEM component work, scalable page systems,
          iconography, design documentation, and larger design-system efforts. I don&rsquo;t
          think of systems as just a library of pixels. I think of them as the operating model
          that helps people make better decisions when I&rsquo;m not in the room.
        </p>
      </>
    ),
    highlight: 'A good system should help the next person make a better decision.',
    tabColor: '#8FB4D9',
  },
  {
    id: 'ai',
    num: '05',
    label: 'AI-Native Workflows',
    title: 'AI didn’t replace the fundamentals. It made them more useful.',
    body: (
      <>
        <p>
          I was early to AI-assisted design and development workflows because I saw the
          opportunity to reduce the friction between idea, interface, prototype, and shipped
          product. Tools like Claude, Figma Make, agentic coding workflows, and AI-assisted
          exploration are changing how quickly ideas can reach useful fidelity.
        </p>
        <p>
          But the value isn&rsquo;t just prompting. It&rsquo;s knowing how to direct the work,
          set the guardrails, review the output, protect the brand, check accessibility,
          understand the system, and decide what&rsquo;s actually worth keeping.
        </p>
        <p>
          Personal, volunteer, and internal projects have become a place to explore that shift
          directly. They&rsquo;ve helped me work around old barriers that used to prevent
          full-stack execution and rediscover the joy of design by getting closer to the full
          arc of building.
        </p>
      </>
    ),
    highlight: 'When making things look real gets easier, judgment gets more important.',
    tabColor: '#DD9DB0',
  },
  {
    id: 'family',
    num: '06',
    label: 'Family & Life',
    title: 'The work matters, but it isn’t the whole story.',
    body: (
      <>
        <p>
          I&rsquo;m a husband and father first. My wife Stephanie, our kids, and the life
          we&rsquo;re building at home are the reason I care so much about finding work
          that&rsquo;s meaningful, sustainable, and aligned with the kind of person I want to be.
        </p>
        <p>
          Outside of work, my life is built around family rhythms: Survivor nights with my mom
          and my childhood best friend (we run our own fantasy draft every season — winner keeps
          the tiki idol until the next one), Sunday dinners with extended family, board games like
          Catan and 7 Wonders, and a dynasty fantasy football league I&rsquo;ve run for over a
          decade. The traditions only matter because people keep showing up for them.
        </p>
        <p>
          That consistency shapes how I work too. Show up. Invest in people. Build things that
          last.
        </p>
      </>
    ),
    highlight: 'The best work comes from people who have something real to come back to.',
    tabColor: '#B79ED6',
  },
  {
    id: 'team',
    num: '07',
    label: 'Team & Leadership',
    title: 'Senior work should make the people around it better.',
    body: (
      <>
        <p>
          I believe senior-level design is about more than producing polished screens. It&rsquo;s
          about adding clarity, improving the process, building trust, documenting decisions,
          creating shared language, and helping the team move with more confidence.
        </p>
        <p>
          That&rsquo;s also how I think about remote culture. I&rsquo;m a believer in remote
          work, but not in disappearing into isolation — the best remote teams build bridges on
          purpose. At Tire Rack, I&rsquo;ve been a founding leader of MPG, an internal group
          built around connection, shared learning, and cross-functional conversation.
        </p>
        <p>
          Good culture doesn&rsquo;t happen because people are in the same room. It happens
          because people keep choosing to share context, unblock each other, and care about the
          work together.
        </p>
      </>
    ),
    highlight: 'Collaboration isn’t proximity. It’s trust, context, and intent.',
    tabColor: '#8FC9C2',
  },
  {
    id: 'build',
    num: '08',
    label: 'What I Want To Build',
    title: 'I want to work on products that make people’s lives better.',
    body: (
      <>
        <p>
          The work I&rsquo;m most drawn to sits in spaces I already care about: health,
          wellness, self-care, financial literacy, education, family life, and tools that help
          people understand themselves or make better decisions.
        </p>
        <p>
          More than one specific product category, I want to build purposeful systems with the
          tools that are reshaping the industry — close to the strategy, the interface, the
          system, the implementation, and the team using it. That&rsquo;s where I believe I can
          do the best work of my career.
        </p>
      </>
    ),
    highlight: 'I want to build work that’s useful, thoughtful, and strong enough to last.',
    tabColor: '#A98BD0',
  },
];

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
