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
      'Design had my attention before it became my job: high school electives in visual ' +
        'communication, an internship at a local broadcast station, early college courses, and ' +
        'eventually Kendall College of Art and ' +
        'Design, where I studied Graphic Design with a minor in Web Animation.',
      'That path taught me composition, hierarchy, typography, pacing, and brand. More important, ' +
        'it taught me to tell the difference between something considered and something merely ' +
        'assembled. I still use that distinction every day.',
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
      'I learned by putting in the reps: conferences, certifications, side projects, questions, ' +
        'and plenty of things I had to break before I could fix them. Working closer to the ' +
        'codebase changed my design instincts. I started judging a decision by how it behaved in ' +
        'production rather than only by how it looked in a file.',
    ],
    annotation: 'The file is not the finish line.',
  },
  {
    num: '03',
    title: 'Building systems that last',
    body: [
      'A lot of my best work sits behind the interface: components, documentation, accessibility, ' +
        'governance, reusable templates, and CMS logic. Those are the pieces that let a team keep ' +
        'making good decisions after the launch meeting ends.',
      'Across twelve years at Tire Rack, I moved between UX strategy, testing, analytics, ' +
        'SEO-informed information architecture, AEM components, production styles, and pattern ' +
        'documentation. I became a lead for the template and style layer because I kept staying ' +
        'with the work after the first version shipped.',
    ],
    annotation: 'Good systems help when I’m not in the room.',
  },
  {
    num: '04',
    title: 'Exploring what is next',
    body: [
      'AI-assisted tools made it cheaper to test an idea. That opens the conversation earlier, but ' +
        'it also produces more plausible work that still needs someone to judge it.',
      'Claude, Figma Make, and code generation help me explore and build. I still own the ' +
        'guardrails, the brand, the accessibility check, the system fit, and the decision to keep ' +
        'or reject what they produce.',
      'I test that boundary in personal, volunteer, and internal products. Those projects let me ' +
        'follow an idea through strategy, interface, code, and use, including the parts that do not ' +
        'survive contact with the working product.',
    ],
    annotation: 'When making things look real gets easier, judgment matters more.',
  },
  {
    num: '05',
    title: 'The human part',
    body: [
      'I’m a husband and father first. My wife Stephanie, our kids, and the life we are building ' +
        'at home shape the kind of work I want and the pace I can sustain.',
      'Outside of work, my life is built around the people I keep showing up for: Survivor nights ' +
        'with my mom and childhood best friend, Sunday family dinners, board games with cousins, ' +
        'and a dynasty fantasy football league that has somehow become a decade-long strategy ' +
        'system.',
      'I like traditions, systems that evolve, and investing in something long enough to make it ' +
        'better. That is probably the cleanest line between my life and my work.',
    ],
    annotation: 'Show up. Stay invested. Build things that last.',
  },
  {
    num: '06',
    title: 'Building better bridges',
    body: [
      'Remote work gives me room for focused design and lets me stay present for my family. It ' +
        'works best when a team replaces accidental hallway context with deliberate communication.',
      'At Tire Rack, I’ve been a founding leader of MPG, an internal group built around ' +
        'connection, shared learning, and cross-functional conversation. That work has shaped how ' +
        'I think about team culture. Collaboration takes more than proximity. It is ' +
        'trust, context, shared language, and people choosing to keep professional relationships ' +
        'strong even when the work happens across screens.',
      'Tools like Claude can help here too. A product idea or rough workflow can become something ' +
        'the team can react to before it hardens into a plan. That does not settle the design. It ' +
        'gives product, design, engineering, and subject-matter experts a more concrete place to ' +
        'start.',
    ],
    annotation: 'Collaboration is not proximity. It is trust, context, and intent.',
  },
  {
    num: '07',
    title: 'How I work',
    body: [
      'I start by finding the decision the team is actually stuck on. Then I stay close enough to ' +
        'implementation to see where the idea breaks, ship the version that holds up, and use what ' +
        'we learn to shape the next one.',
      'My bar is practical. The work should survive scrutiny, the team should be able to extend it ' +
        'without me, and I should not need an invitation to fix an obvious gap.',
      'The best teams I’ve worked with were more than talented. They were honest, aligned, willing ' +
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
    title: 'Find the decision',
    body: (
      <p>
        Before I move pixels, I need to know which decision is stuck, who it affects, and what
        the product has to survive. A polished answer is still wrong if it answers the wrong
        question.
      </p>
    ),
  },
  {
    num: '02',
    label: 'Method',
    title: 'Make it legible',
    body: (
      <p>
        I put the reason close to the artifact. Hierarchy, states, behavior notes,
        accessibility, and tokens should give the next person enough context to build or extend
        the decision without guessing.
      </p>
    ),
  },
  {
    num: '03',
    label: 'Method',
    title: 'Stay with the build',
    body: (
      <p>
        The browser exposes what the frame hid. I stay close to the components, CMS patterns,
        naming, responsive behavior, and documentation so the idea has a chance to survive
        production.
      </p>
    ),
  },
  {
    num: '04',
    label: 'Method',
    title: 'Measure what changed',
    body: (
      <p>
        Usability reviews, experiments, analytics, search behavior, accessibility checks, and
        post-launch reflection tell me where the work held and where it did not. I keep the claim
        as narrow as the evidence.
      </p>
    ),
  },
  {
    num: '05',
    label: 'Method',
    title: 'Keep putting in the reps',
    body: (
      <p>
        I study the people and communities whose standards make me inspect my own work more
        closely, including Dive Club, UI Collective Design, Tommy Geoco, Michael Riddering,
        Jenny Wen, and Brad Frost. The useful part is not the inspiration. It is the habit or rule
        that changes what I build next.
      </p>
    ),
  },
];
