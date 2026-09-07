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
  /** Mono marker under the title — Ryan's own sub-terms, as on the homepage rail. */
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
      'Before anything gets drawn I want to know which decision is stuck, what the product has to ' +
      'survive, and what already exists to build on: tokens, patterns, and the rules people and ' +
      'agents read. A polished answer to the wrong question is still wrong.',
    cost: 'Every later beat argues about scope instead of the work.',
    evidence: { label: 'The design system this site runs on, live', to: '/design-system' },
    relation: 'Leads to 02.',
  },
  {
    num: '02',
    title: 'Explore across surfaces',
    meta: 'Figma · prototypes · code',
    body:
      'Figma or working code, whichever answers fastest. High-fidelity prototypes are cheap enough ' +
      'now that the first thing a stakeholder sees often runs. Both surfaces are allowed to change ' +
      'the system, and neither owns it.',
    cost: 'Stay on one surface and the file keeps hiding what the browser would have shown.',
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
      'The browser exposes what the frame hid: responsive behavior, naming, the state nobody drew, ' +
      'the orange that fails contrast at 14px. I stay through QA and past launch, and I keep the ' +
      'claim as narrow as the evidence.',
    cost: 'The system learns nothing, and the next version repeats the miss.',
    evidence: { label: 'Eight times my first idea was wrong', to: '/notes/eight-wrong-first-drafts' },
    relation: 'Two-way with 02. Leads to 04.',
  },
  {
    num: '04',
    title: 'Feed it back into the system',
    meta: 'components · documentation · governance · agent-readable guidance',
    body:
      'What production taught goes back where the next person will find it: the component, the ' +
      'doc, the governance rule, the skill an agent reads before it contributes. The system has ' +
      'done its job when the team makes the next good decision without me in the room.',
    cost: 'The lesson lives in one head, mine, which is the failure a system exists to prevent.',
    evidence: { label: 'A design-taste system an agent can follow', to: '/notes/ryan-design-taste-skill' },
    relation: 'Returns to 01. The loop has no finish line.',
  },
];

/**
 * Under the circuit. The first sentence is unchanged from the previous deck.
 * The second paragraph is the old fifth principle ("Keep putting in the reps"),
 * which was never a step in the loop; it is the reason the loop keeps turning,
 * so it moves here. Its opening clause is a DRAFT; the list of names and the
 * last two sentences are Ryan's, unchanged.
 */
export const processCloser = {
  lead:
    'The tools will keep changing, so I do not build the process around a tool. I build it ' +
    'around a harder standard: ',
  emphasis: 'care for what ships',
  reps:
    'The loop keeps turning because I keep putting in the reps: studying the people and ' +
    'communities whose standards make me inspect my own work more closely, including Dive Club, ' +
    'UI Collective Design, Tommy Geoco, Michael Riddering, Jenny Wen, and Brad Frost. The useful ' +
    'part is not the inspiration. It is the habit or rule that changes what I build next.',
};

// ============================================
// Strengths, in other people's words
// The homepage Strengths section (Skills.tsx) relocated here. It failed on the
// homepage because it asserted 22 phrases with no way to check any of them.
// Here each surviving phrase is grouped by who the work was with and paired
// with the person who said it — a verbatim fragment of a recommendation that
// appears in full in the homepage Testimonials section and on LinkedIn — or,
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
      {
        kind: 'person',
        quote: 'communication skills are top notch',
        name: 'Urbano Baz',
        role: 'Software Engineer, partner team',
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
    phrases: ['Systems thinking'],
    vouchers: [
      {
        kind: 'person',
        quote: 'what’s worked, what hasn’t, and why',
        name: 'Ryan Kokesh',
        role: 'Senior UX Manager, 2022–2024',
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
