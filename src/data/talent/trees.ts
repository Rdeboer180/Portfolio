// ============================================
// Talent tree: the three trees, fifteen areas, thirty nodes
// Names are the brief's, verbatim (BRIEF-v3, "The tree model"). Each node
// carries one sentence for hover, a glyph key into glyphs.ts, and weights over
// the eight traits. Weights are the only tuning surface for scoring; see
// score.ts for how they turn into the 0..100 stats.
//
// Weight design, in short:
// - Every entry is a real contribution (0.05 or more); nothing is sprinkled to
//   make sums tidy. Each node's weights sum to 1.
// - "craft" means visual craft only, so it lives on the type, composition,
//   motion, states, prototyping, and pattern nodes, not on writing or mentoring,
//   and not on the tokens, components, or HTML and CSS nodes, which are build
//   (the small craft weights they once carried moved to build on 2026-09-11,
//   when Ryan's degree rule added four points to his tree and the sprinkle
//   tipped his secondary archetype from Prototype Alchemist to Interface
//   Stylist).
// - "exploration" concentrates in prototyping, AI-assisted work, reframing, and
//   behavior; "systems" in tokens, components, standards, governance, IA, and
//   patterns; "build" in design-to-code and production; "ai" on the two agentic
//   nodes plus the governance and documentation nodes that agents consume.
// - The core tree carries most of "collaboration" and "strategy"; "research"
//   sits on discovery, evidence, framing, and IA.
//
// Each node also carries a masteryLine: the sentence the masteries drawer
// prints once the node holds five points. `meaning` answers "what does a point
// here buy"; masteryLine answers "what does mastering this look like". The
// seven Ryan has mastered are the front-door artboard's lines verbatim; the
// other twenty-three are drafted in the same register.
// ============================================

import type { TalentArea, TalentNode, TalentTree, Trait } from './types';

type Weights = Partial<Record<Trait, number>>;

/** Compact node authoring: [id, name, meaning, weights, glyph, masteryLine]. */
type NodeSpec = [string, string, string, Weights, string, string];

function area(
  treeId: TalentTree['id'],
  id: string,
  name: string,
  foundation: NodeSpec,
  crown: NodeSpec,
): TalentArea {
  const make = (spec: NodeSpec, tier: TalentNode['tier']): TalentNode => ({
    id: spec[0],
    areaId: id,
    tier,
    name: spec[1],
    meaning: spec[2],
    weights: spec[3],
    glyph: spec[4],
    masteryLine: spec[5],
  });
  return { id, treeId, name, nodes: [make(foundation, 'foundation'), make(crown, 'crown')] };
}

export const TREES: TalentTree[] = [
  {
    id: 'craft',
    name: 'Craft',
    pool: 'craft',
    root: { name: 'Visual craft', glyph: 'visual-craft' },
    areas: [
      area(
        'craft',
        'visual-craft',
        'Visual craft',
        [
          'typography-and-hierarchy',
          'Typography and hierarchy',
          'Time spent making type do the structural work, so a screen reads in the right order before any color is applied.',
          { craft: 0.7, systems: 0.2, exploration: 0.1 },
          'typography',
          'Type does the structural work, so a screen reads in order before color lands.',
        ],
        [
          'composition-brand-and-polish',
          'Composition, brand, and polish',
          'Time spent on the last ten percent, where spacing, image, and brand voice turn a correct layout into a finished one.',
          { craft: 0.55, exploration: 0.3, strategy: 0.15 },
          'layout-grid',
          'The last ten percent, where spacing, image, and voice finish a correct layout.',
        ],
      ),
      area(
        'craft',
        'interaction-design',
        'Interaction design',
        [
          'states-and-behavior',
          'States and behavior',
          'Time spent defining what a component does when it is empty, loading, disabled, or wrong, not only when it is ideal.',
          { exploration: 0.35, systems: 0.3, build: 0.2, craft: 0.15 },
          'ui-design',
          'Every state drawn, so the interface answers a tap the way people expect.',
        ],
        [
          'motion-and-micro-interaction-systems',
          'Motion and micro-interaction systems',
          'Time spent turning one-off transitions into a motion language with named durations, easings, and reasons.',
          { craft: 0.45, systems: 0.2, build: 0.2, exploration: 0.15 },
          'animation',
          'Motion that explains what changed, timed as a system rather than per screen.',
        ],
      ),
      area(
        'craft',
        'product-thinking',
        'Product thinking',
        [
          'problem-framing',
          'Problem framing',
          'Time spent deciding what the problem actually is before deciding what to draw.',
          { strategy: 0.4, research: 0.4, exploration: 0.15, collaboration: 0.05 },
          'problem-framing',
          'The problem stated well enough that the right solution becomes obvious to everyone.',
        ],
        [
          'flows-edge-cases-and-decisions',
          'Flows, edge cases, and decisions',
          'Time spent mapping every path through a journey, including the ones that fail, and choosing what happens at each fork.',
          { strategy: 0.25, systems: 0.25, research: 0.25, craft: 0.15, exploration: 0.05, collaboration: 0.05 },
          'ux-design',
          'Flows drawn to the edges, where the empty, the slow, and the broken cases live.',
        ],
      ),
      area(
        'craft',
        'research',
        'Research',
        [
          'discovery-and-synthesis',
          'Discovery and synthesis',
          'Time spent with users, data, and stakeholders, then turning what was heard into something a team can act on.',
          { research: 0.65, collaboration: 0.15, strategy: 0.1, exploration: 0.05, ai: 0.05 },
          'research',
          'Raw interviews and data turned into the few findings a team can act on.',
        ],
        [
          'evidence-and-measurement',
          'Evidence and measurement',
          'Time spent instrumenting the work and reading the results, so a decision can be defended with numbers rather than taste.',
          { research: 0.55, strategy: 0.3, build: 0.1, ai: 0.05 },
          'ab-testing',
          'Designs instrumented before launch, so the result can be defended with numbers.',
        ],
      ),
      area(
        'craft',
        'prototyping',
        'Prototyping',
        [
          'high-fidelity-in-figma',
          'High-fidelity in Figma',
          'Time spent building prototypes real enough that a stakeholder or a test participant forgets it is not the product.',
          { exploration: 0.7, craft: 0.2, build: 0.1 },
          'hifi-prototyping',
          'Prototypes real enough that a stakeholder forgets it is not the product.',
        ],
        [
          'coded-prototypes-that-ship',
          'Coded prototypes that ship',
          'Time spent proving an idea in working code, close enough to production that the prototype can become the first version.',
          { build: 0.55, exploration: 0.35, ai: 0.1 },
          'expo',
          'Ideas proved in working code, close enough to production to become the first version.',
        ],
      ),
    ],
  },
  {
    id: 'systems',
    name: 'Systems and build',
    pool: 'craft',
    root: { name: 'Build', glyph: 'build' },
    areas: [
      area(
        'systems',
        'design-systems',
        'Design systems',
        [
          'tokens-and-variables',
          'Tokens and variables',
          'Time spent naming the decisions of a system as variables, so a change made once lands everywhere it should.',
          { systems: 0.75, build: 0.25 },
          'tokenization',
          'Decisions named as variables, so a change made once lands everywhere.',
        ],
        [
          'components-storybook-and-scaling',
          'Components, Storybook, and scaling',
          'Time spent building components that hold up in a library, documented and stress-tested across the surfaces that consume them.',
          { systems: 0.6, build: 0.3, collaboration: 0.1 },
          'component-libraries',
          'Parts with contracts, documented where engineers work, tested across surfaces.',
        ],
      ),
      area(
        'systems',
        'governance',
        'Governance',
        [
          'standards-accessibility-and-qa',
          'Standards, accessibility, and QA',
          'Time spent on the rules a system enforces, from contrast and focus order to the checks that catch drift before release.',
          { systems: 0.7, collaboration: 0.15, build: 0.1, craft: 0.05 },
          'accessibility',
          'Rules that hold when I am not in the room, from contrast to release checks.',
        ],
        [
          'exceptions-contribution-and-agent-readable-rules',
          'Exceptions, contribution, and agent-readable rules',
          'Time spent governing how a system grows, including how a team contributes, when to break a rule, and how an agent can read the rules too.',
          { systems: 0.5, ai: 0.2, collaboration: 0.2, strategy: 0.1 },
          'git-github',
          'Rules written so people and agents both know when to break them.',
        ],
      ),
      area(
        'systems',
        'design-to-code-translation',
        'Design-to-code translation',
        [
          'html-css-and-state-definition',
          'HTML, CSS, and state definition',
          'Time spent expressing a design in the languages the browser reads, with every state and breakpoint defined rather than implied.',
          { build: 0.6, systems: 0.3, exploration: 0.1 },
          'html-css-sass',
          'The design in the browser\'s own language, every state and breakpoint defined.',
        ],
        [
          'production-ownership',
          'Production ownership',
          'Time spent owning code after it ships, including the reviews, regressions, and releases that come with it.',
          { build: 0.8, collaboration: 0.15, ai: 0.05 },
          'ship',
          'The front end owned in production, where the real work finally becomes visible.',
        ],
      ),
      area(
        'systems',
        'ai-and-agentic-workflows',
        'AI and agentic workflows',
        [
          'ai-assisted-exploration',
          'AI-assisted exploration',
          'Time spent using models and agents to widen the search, generating and discarding more directions than a hand could alone.',
          { exploration: 0.65, ai: 0.35 },
          'agentic-design',
          'Agents put to work on the exploring, with the judgment kept human.',
        ],
        [
          'systems-that-direct-agents',
          'Systems that direct agents',
          'Time spent writing the context, constraints, and checks that let an agent do design work the way the system intends.',
          { ai: 0.45, systems: 0.3, exploration: 0.25 },
          'agentic-coding',
          'Context and guardrails an agent can read, so its output arrives on system.',
        ],
      ),
      area(
        'systems',
        'systems-thinking',
        'Systems thinking',
        [
          'information-architecture',
          'Information architecture',
          'Time spent structuring content and navigation so the shape of a product matches the shape of what people are trying to do.',
          { systems: 0.55, research: 0.25, strategy: 0.1, craft: 0.1 },
          'information-architecture',
          'Names and structure that match how people look for things, not the org chart.',
        ],
        [
          'patterns-that-hold-across-surfaces',
          'Patterns that hold across surfaces',
          'Time spent finding the pattern under several screens or products, then making it hold on web, native, and whatever comes next.',
          { systems: 0.5, craft: 0.25, build: 0.1, strategy: 0.1, ai: 0.05 },
          'responsive-design',
          'One pattern that survives phone, desktop, and email without being redrawn each time.',
        ],
      ),
    ],
  },
  {
    id: 'core',
    name: 'Core',
    pool: 'core',
    root: { name: 'Judgment', glyph: 'judgment' },
    areas: [
      area(
        'core',
        'collaboration',
        'Collaboration',
        [
          'working-across-disciplines',
          'Working across disciplines',
          'Time spent inside engineering, product, and content conversations, not only at the design table.',
          { collaboration: 0.6, build: 0.15, strategy: 0.15, research: 0.1 },
          'cross-discipline',
          'Design decided inside engineering and product conversations, not only at the design table.',
        ],
        [
          'critique-and-consensus',
          'Critique and consensus',
          'Time spent giving and taking critique well, then moving a room from opinions to a decision it can hold.',
          { collaboration: 0.65, craft: 0.25, strategy: 0.1 },
          'stakeholder-alignment',
          'Critique given and taken well, then a room moved from opinions to a decision.',
        ],
      ),
      area(
        'core',
        'communication',
        'Communication',
        [
          'writing-and-presenting',
          'Writing and presenting',
          'Time spent explaining the work in writing and in person, so the reasoning travels as far as the screens do.',
          { collaboration: 0.35, strategy: 0.35, research: 0.2, craft: 0.1 },
          'communication',
          'Reasoning that travels as far as the screens do, in writing and in the room.',
        ],
        [
          'context-that-survives-the-room',
          'Context that survives the room',
          'Time spent documenting decisions, rationale, and constraints so the next person, or the next agent, starts where you left off.',
          { ai: 0.3, collaboration: 0.25, systems: 0.25, strategy: 0.2 },
          'documentation',
          'Decisions and constraints recorded, so the next person starts where the last one stopped.',
        ],
      ),
      area(
        'core',
        'leadership',
        'Leadership',
        [
          'mentoring',
          'Mentoring',
          'Time spent making other designers better, through pairing, feedback, and the patience to let them find it themselves.',
          { collaboration: 0.65, strategy: 0.25, craft: 0.1 },
          'mentoring',
          'Other designers made better through pairing, feedback, and the patience to wait.',
        ],
        [
          'direction-and-advocacy',
          'Direction and advocacy',
          'Time spent setting direction for a team and defending design decisions where budgets and roadmaps are set.',
          { strategy: 0.45, collaboration: 0.45, research: 0.1 },
          'design-advocacy',
          'Direction set for a team, and design defended where budgets and roadmaps are.',
        ],
      ),
      area(
        'core',
        'problem-solving',
        'Problem solving',
        [
          'reframing',
          'Reframing',
          'Time spent taking a stuck problem apart and putting it back together from a different starting point.',
          { exploration: 0.5, strategy: 0.25, research: 0.25 },
          'problem-solving',
          'A stuck problem taken apart and rebuilt from a different starting point.',
        ],
        [
          'deciding-under-constraint',
          'Deciding under constraint',
          'Time spent making the call when the deadline, the data, and the budget will not all cooperate.',
          { strategy: 0.5, research: 0.25, build: 0.15, systems: 0.1 },
          'decision',
          'The call made when the deadline, the data, and the budget will not agree.',
        ],
      ),
      area(
        'core',
        'strategy',
        'Strategy',
        [
          'user-business-and-technical-constraints',
          'User, business, and technical constraints',
          'Time spent holding what users need, what the business needs, and what the stack can do in the same frame.',
          { strategy: 0.5, research: 0.2, build: 0.15, systems: 0.1, collaboration: 0.05 },
          'sliders',
          'User need, business need, and what the stack can do, held in one frame.',
        ],
        [
          'north-star-and-direction',
          'North star and direction',
          'Time spent describing where a product should be in a few years, and what the next quarter has to do about it.',
          { strategy: 0.6, collaboration: 0.3, research: 0.1 },
          'leadership',
          'Where the product should be in a few years, and what this quarter owes it.',
        ],
      ),
    ],
  },
];

/** Every area, in tree order. */
export const AREAS: TalentArea[] = TREES.reduce<TalentArea[]>((acc, tree) => acc.concat(tree.areas), []);

/** Every node, in tree order (foundation before crown within an area). */
export const NODE_LIST: TalentNode[] = AREAS.reduce<TalentNode[]>((acc, a) => acc.concat(a.nodes), []);

/** Node by id. */
export const NODES: Record<string, TalentNode> = NODE_LIST.reduce<Record<string, TalentNode>>((acc, n) => {
  acc[n.id] = n;
  return acc;
}, {});

const TREE_BY_NODE: Record<string, TalentTree> = {};
const AREA_BY_NODE: Record<string, TalentArea> = {};
TREES.forEach((tree) => {
  tree.areas.forEach((a) => {
    a.nodes.forEach((n) => {
      TREE_BY_NODE[n.id] = tree;
      AREA_BY_NODE[n.id] = a;
    });
  });
});

export function nodeById(id: string): TalentNode | undefined {
  return NODES[id];
}

export function treeOf(nodeId: string): TalentTree | undefined {
  return TREE_BY_NODE[nodeId];
}

export function areaOf(nodeId: string): TalentArea | undefined {
  return AREA_BY_NODE[nodeId];
}

/** The foundation that gates a crown, or undefined when the node is itself a foundation. */
export function foundationOf(nodeId: string): TalentNode | undefined {
  const a = AREA_BY_NODE[nodeId];
  if (!a || a.nodes[1].id !== nodeId) return undefined;
  return a.nodes[0];
}

/** The crown a foundation gates, or undefined when the node is itself a crown. */
export function crownOf(nodeId: string): TalentNode | undefined {
  const a = AREA_BY_NODE[nodeId];
  if (!a || a.nodes[0].id !== nodeId) return undefined;
  return a.nodes[1];
}
