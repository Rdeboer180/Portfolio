// ============================================
// About Page — Structured copy data
// All copy lives here, not in markup.
// ============================================

// ============================================
// Story Sections — text-first editorial flow ("Craft is the through-line")
// Seven scannable beats; each has one orange handwritten annotation.
// ============================================

export interface StorySection {
  num: string;        // "01"
  title: string;
  body: string[];     // one entry per paragraph
  related?: { to: string; label: string };
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
        'it taught me to notice when a layout looked assembled instead of designed. ' +
        'I still use that distinction every day.',
    ],
    annotation: '',
  },
  {
    num: '02',
    title: 'Getting closer to the code',
    body: [
      'I came into my career with a strong eye for design, but the codebase quickly exposed what ' +
        'I still needed to learn. HTML tables, CSS, responsive behavior, variables, flexbox, CMS ' +
        'constraints: early on, a lot of it felt like a different language.',
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
      'I think about the system an author inherits as carefully as the page a customer sees. ' +
        'In AEM, I build reusable component variants and define template permissions, authoring ' +
        'rules, and review workflows. Those decisions give the team room to change content ' +
        'while keeping the shared structure dependable.',
      'Across twelve years at Tire Rack, I moved between UX strategy, testing, analytics, ' +
        'SEO-informed information architecture, AEM components, production styles, and pattern ' +
        'documentation. That work includes Experience Fragments for A/B testing and geographic ' +
        'targeting with Adobe Target. I became a lead for the template and style layer by ' +
        'continuing to maintain and improve it after launch.',
    ],
    annotation: 'Built to outlast the launch meeting.',
    related: { to: '/work/aem-component-system/', label: 'See the AEM component system' },
  },
  {
    num: '04',
    title: 'Learning by building',
    related: { to: '/work/playdraft/', label: 'See how I designed and built PlayDraft' },
    body: [
      'I learn best when there’s something I actually want to make. AI has opened up more of those ' +
        'possibilities, and I keep finding new ways to use it across design, code, and the small ' +
        'tools that support both. Some experiments stick. Others show me what I still need to learn.',
      'I use Claude, Figma Make, and code generation to explore and build. I review the design, ' +
        'the behavior, and the code before anything they produce is kept.',
    ],
    annotation: '',
  },
  {
    num: '05',
    title: 'The human part',
    body: [
      'I’m a husband and father first. My wife Stephanie, our kids, and the life we are building ' +
        'at home shape the kind of work I want and the pace I can sustain.',
      'Outside work, I spend time with the people I\'ve known longest: Survivor nights ' +
        'with my mom and childhood best friend, Sunday family dinners, board games with cousins, ' +
        'and a dynasty fantasy football league that has somehow become a decade-long strategy ' +
        'system.',
      'I like traditions and sticking with something long enough to make it better. ' +
        'That carries into my work too.',
    ],
    annotation: 'Show up. Stay invested. Build things that last.',
  },
  {
    num: '06',
    title: 'Building better bridges',
    body: [
      'Remote work gives me room for focused design and lets me stay present for my family. It ' +
        'works best when people share the context others would miss outside the office.',
      'At Tire Rack, I’ve been a founding leader of MPG, an internal group built around ' +
        'connection, shared learning, and cross-functional conversation. That group has taught me ' +
        'to make time for conversations beyond the immediate project, especially when we work remotely.',
    ],
    annotation: '',
  },
  // Was "How I work", and opened with a one-paragraph restatement of the loop
  // (find the decision → stay close to implementation → ship what holds up →
  // learn for the next one). The four-beat circuit below the Bridge card is now
  // the site's single account of that sequence, so this beat keeps only what
  // exists nowhere else on the site: the bar the work is held to, and the kind
  // of team that clears it. Nothing from the cut paragraph was lost — "which
  // decision is stuck" opens beat 01 of the circuit, and "use what we learn to
  // shape the next one" is beats 03 and 04.
  {
    num: '07',
    title: 'What I hold myself to',
    body: [
      'I want to explain my decisions, leave work the team can extend, and fix obvious gaps ' +
        'without waiting to be asked.',
      'The best teams I\'ve worked with were honest with each other. They shared direction, ' +
        'gave useful feedback, and helped each other improve. That is the kind ' +
        'of environment I try to help build.',
    ],
    annotation: 'Care is a production skill.',
  },
];

// ============================================
// The loop — "How I work", drawn as a circuit
// The same four beats as the homepage rail (SystemsInPractice), in the same
// words. The About page adds what the rail has no room for: a paragraph, the
// cost of skipping the beat, and one evidence link per beat.
//
// COPY STATUS — read before editing:
//   • `title` and `meta` (the mono triplet) are Ryan's words and are final.
//   • `body` and `cost` are DRAFTS assembled from the previous five-principle
//     deck (01 Find the decision · 02 Make it legible · 03 Stay with the
//     build · 04 Measure what changed) and awaiting Ryan's edit.
//   • `evidence` points at ungated routes only. Every `/work/*` study in the
//     professional stream renders its middle as a lock panel, so the evidence
//     here comes from the self-built stream, the notes, and the live design
//     system — pages a reader lands on, not a prompt.
// ============================================

export interface ProcessBeat {
  num: '01' | '02' | '03' | '04';
  title: string;
  /** Mono marker under the title. Ryan's own sub-terms; the homepage rail dropped its own, so this is the only place they appear. */
  meta: string;
  /** DRAFT — see COPY STATUS above. */
  body: string;
  /** DRAFT — the admitted-cost line: what the loop loses when this beat is skipped. */
  cost: string;
  /** One page that proves the beat. Ungated routes only. */
  evidence: { label: string; to: string };
  /**
   * The beat's place on the loop, in words. Screen-reader only where a wire
   * draws it; visible under the card on the phone. The loop is never carried by
   * a line or a colour alone.
   */
  relation: string;
}

export const processBeats: ProcessBeat[] = [
  {
    num: '01',
    title: 'Define the rules',
    meta: 'intent · constraints · foundations',
    body:
      'Before I draw anything, I want to know which decision we\'re trying to make and what ' +
      'the product will need after launch. Then I take stock of what is already there: the tokens and ' +
      'patterns, and the rules written down for people and agents alike. A polished answer to the ' +
      'wrong question is still wrong.',
    cost: 'I spent six weeks on studio names before I asked which question a name had to answer.',
    evidence: { label: 'The design system this site runs on, live', to: '/design-system' },
    relation: 'Leads to 02.',
  },
  {
    num: '02',
    title: 'Explore across surfaces',
    meta: 'Figma · prototypes · code',
    body:
      'For PlayDraft, every screen starts with a reference on the Figma canvas. That same canvas ' +
      'holds the observations from testing the running app. Prototypes ' +
      'are cheap enough now that the first thing a stakeholder sees often runs. Testing the ' +
      'running app changes both the Figma designs and the shared components.',
    cost: 'Stay in the file and the screen gets built twice, the second time after someone approved the first.',
    evidence: {
      label: 'PlayDraft: Figma to React Native to TestFlight in twelve weeks',
      to: '/work/playdraft',
    },
    relation: 'Two-way with 03: exploring and learning trade places as often as the work needs.',
  },
  {
    num: '03',
    title: 'Learn from what becomes real',
    meta: 'QA · edge cases · accessibility · production',
    body:
      'The browser exposes what the frame hid: responsive behavior, the state nobody drew, the ' +
      'orange that fails contrast at 14px. I stay through QA and after launch. When I report ' +
      'results, I separate what we measured from what I think contributed.',
    cost: 'PlayDraft\u2019s competitive clock is thirty seconds. The notification that shipped told players they had two minutes.',
    evidence: { label: 'Eight times my first idea was wrong', to: '/notes/eight-wrong-first-drafts' },
    relation: 'Two-way with 02. Leads to 04.',
  },
  {
    num: '04',
    title: 'Feed it back into the system',
    meta: 'components · documentation · governance · agent-readable guidance',
    body:
      'An agent kept reaching for purple gradients. Better prompting per task did not fix it. ' +
      'Writing the judgment down once, as a skill the agent loads before any visual work, did. ' +
      'The system has done its job when the team makes the next good decision without me in the room.',
    cost: 'Someone rebuilds the same component, and the product ships both versions.',
    evidence: { label: 'A design-taste system an agent can follow', to: '/notes/ryan-design-taste-skill' },
    relation: 'Returns to 01. The loop has no finish line.',
  },
];

// Close with how ongoing study changes the next build.
export const processCloser = {
  lead:
    'I keep reviewing and improving the work because I ',
  emphasis: 'care about what ships',
  reps:
    'I study the people and communities named in the studio, often while I am on the walking ' +
    'pad. I use what I learn to revise components, document rules, and check the next build.',
};

// ============================================
// Strengths, in other people's words
// The homepage Strengths section (Skills.tsx) relocated here. It failed on the
// homepage because it asserted 22 phrases with no way to check any of them.
// Here each surviving phrase is grouped by who the work was with and paired
// with the person who said it — a verbatim fragment of a recommendation that
// is excerpted in the homepage Testimonials section and available on LinkedIn — or,
// for the writing row, with the artifact itself.
//
// WHAT DID NOT SURVIVE, and why (so nothing was dropped silently):
//   • Already in the homepage Technical section, some verbatim — dropped here:
//     Accessibility-First Design (WCAG) → "WCAG Accessibility"; SEO-Driven
//     Design → "SEO-Informed Design"; A/B Testing & Experimentation → "A/B
//     Testing"; Design Systems & Governance → "Governance & Adoption" and the
//     Design Systems column; Design-system auditing (verbatim); Reusable design
//     and QA skills → "Reusable agent skills" + "System-aware QA"; Human review
//     and governance → "Human review gates"; System-aware agent workflows →
//     "MCP workflows" and the whole Systems in Practice section.
//   • Carried by the circuit above, in Ryan's own term — dropped here:
//     Machine-readable design guidance → beat 04, "agent-readable guidance".
//   • Merged: Stakeholder Management + Stakeholder Alignment → "Stakeholder
//     alignment"; Stakeholder Presentation & Storytelling → "Presentation &
//     storytelling".
//   • Dropped as unevidenced: Strategic Planning. No recommendation, study, or
//     note on the site evidences it as a distinct practice. It can return when
//     something does.
//
// COPY STATUS: the phrases are the homepage's, re-cased. The row labels, the
// intro, and the section title are DRAFTS for Ryan's edit. Quote fragments are
// verbatim from Testimonials.tsx and must stay that way.
// ============================================

export type StrengthVoucher =
  | { kind: 'person'; quote: string; name: string; role: string }
  | { kind: 'artifact'; label: string; to: string };

export interface StrengthRow {
  /** Who the work was with. */
  with: string;
  /** The strengths, as the mono meta of the relationship. */
  phrases: string[];
  /** Who said so, or the artifact that shows it. */
  vouchers: StrengthVoucher[];
}

export const strengthRows: StrengthRow[] = [
  {
    with: 'With engineers',
    phrases: ['Engineering partnership', 'Framework & template development'],
    vouchers: [
      {
        kind: 'person',
        quote: 'one vocabulary to work from instead of two',
        name: 'Cheryl Carpenter',
        role: 'React front-end developer, WheelRack build partner',
      },
    ],
  },
  {
    with: 'With product and stakeholders',
    phrases: [
      'Product team integration',
      'Cross-functional facilitation',
      'Stakeholder alignment',
      'Presentation & storytelling',
    ],
    vouchers: [
      {
        kind: 'person',
        quote: 'coordinates with leaders and ICs from corresponding teams on his own',
        name: 'Adam Payne',
        role: 'Web Design Manager, Ryan’s direct manager',
      },
    ],
  },
  {
    with: 'With designers',
    phrases: ['Design leadership', 'Mentoring & design advocacy'],
    vouchers: [
      {
        kind: 'person',
        quote: 'a kind and thoughtful mentor',
        name: 'Gina Saucedo',
        role: 'Web Designer, Tire Rack',
      },
      {
        kind: 'person',
        quote: 'a professional development program that serves around 100 people',
        name: 'Amanda Straup',
        role: 'Assistant Vice President, Digital Operations',
      },
    ],
  },
  {
    with: 'Over the long run',
    phrases: ['Systems thinking', 'Process improvement'],
    vouchers: [
      {
        kind: 'person',
        quote: 'what’s worked, what hasn’t, and why',
        name: 'Ryan Kokesh',
        role: 'Senior UX Manager, 2022–2024',
      },
      {
        kind: 'person',
        quote: 'better and more efficient ways to do things',
        name: 'Rob Oxley',
        role: 'Senior Web Designer, Tire Rack; design peer for over 10 years',
      },
    ],
  },
  {
    with: 'In writing',
    phrases: ['Written documentation', 'Process documentation'],
    vouchers: [
      {
        kind: 'artifact',
        label: 'Two files keep the brand from drifting',
        to: '/notes/governance-in-markdown',
      },
    ],
  },
];
