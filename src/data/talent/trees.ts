// ============================================
// Talent tree: the three lanes, fifteen areas, thirty nodes (v5, 2026-09-12)
// Design and systems (what you define), Technical (how you connect the work),
// Code (what you can express in the medium). Node names are short nouns; ids
// are the kebab-case of the name. Every node carries one sentence for hover, a
// mastery line, a glyph key into glyphs.ts, and weights over the eight traits.
//
// Weights are the only tuning surface for scoring; see score.ts for how they
// turn into the 0..100 stats. Each node's weights sum to 1 and every entry is
// a real contribution. The lanes lean the way the spec asks: the Code lane
// leans build, the Technical lane leans systems, ai, and exploration, and the
// Design lane leans craft, systems, and research.
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
    id: 'design',
    name: 'Design and systems',
    pool: 'points',
    root: { name: 'Visual craft', glyph: 'visual-craft' },
    areas: [
      area(
        'design',
        'typography',
        'Typography',
        [
          'typography',
          'Typography',
          'Time spent making type do the structural work, so a screen reads in the right order before any color lands.',
          { craft: 0.6, systems: 0.3, exploration: 0.1 },
          'typography',
          'Type does the structural work, so a screen reads in order before color lands.',
        ],
        [
          'layout',
          'Layout',
          'Time spent on grid, spacing, and composition, where a correct arrangement becomes a finished one.',
          { craft: 0.55, systems: 0.3, strategy: 0.15 },
          'layout-grid',
          'Grid and spacing held steady, so every page of a product feels built by one hand.',
        ],
      ),
      area(
        'design',
        'interaction',
        'Interaction',
        [
          'interaction',
          'Interaction',
          'Time spent defining what a component does when it is empty, loading, disabled, or wrong, not only when it is ideal.',
          { exploration: 0.3, craft: 0.3, systems: 0.25, build: 0.15 },
          'ui-design',
          'Every state drawn, so the interface answers a tap the way people expect.',
        ],
        [
          'motion',
          'Motion',
          'Time spent turning one-off transitions into a motion language with named durations, easings, and reasons.',
          { craft: 0.5, exploration: 0.25, build: 0.15, systems: 0.1 },
          'animation',
          'Motion that explains what changed, timed as a system rather than per screen.',
        ],
      ),
      area(
        'design',
        'tokens',
        'Tokens',
        [
          'tokens',
          'Tokens',
          'Time spent naming the decisions of a system as variables, so a change made once lands everywhere it should.',
          { systems: 0.75, build: 0.2, craft: 0.05 },
          'tokenization',
          'Decisions named as variables, so a change made once lands everywhere.',
        ],
        [
          'components',
          'Components',
          'Time spent building parts that hold up in a library, with contracts an engineer can read and reuse.',
          { systems: 0.65, build: 0.25, craft: 0.1 },
          'component-libraries',
          'Parts with contracts, tested across the surfaces that consume them.',
        ],
      ),
      area(
        'design',
        'accessibility',
        'Accessibility',
        [
          'accessibility',
          'Accessibility',
          'Time spent on contrast, focus order, and assistive behavior, designed in rather than audited after.',
          { systems: 0.65, craft: 0.1, build: 0.15, collaboration: 0.1 },
          'accessibility',
          'Contrast, focus order, and assistive behavior designed in, not audited after.',
        ],
        [
          'governance',
          'Governance',
          'Time spent on how a system grows: who contributes, when a rule may break, and what keeps drift out of a release.',
          { systems: 0.55, collaboration: 0.25, strategy: 0.1, ai: 0.1 },
          'decision',
          'Rules that hold when I am not in the room, including when to break them.',
        ],
      ),
      area(
        'design',
        'research',
        'Research',
        [
          'research',
          'Research',
          'Time spent with users, data, and stakeholders, then turning what was heard into something a team can act on.',
          { research: 0.65, strategy: 0.15, collaboration: 0.1, exploration: 0.1 },
          'research',
          'Raw interviews and data turned into the few findings a team can act on.',
        ],
        [
          'information-architecture',
          'Information architecture',
          'Time spent structuring content and navigation so the shape of a product matches the shape of what people are doing.',
          { systems: 0.4, research: 0.3, strategy: 0.2, craft: 0.1 },
          'information-architecture',
          'Names and structure that match how people look for things, not the org chart.',
        ],
      ),
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    pool: 'points',
    root: { name: 'Workflow', glyph: 'workflow' },
    areas: [
      area(
        'technical',
        'figma',
        'Figma',
        [
          'figma',
          'Figma',
          'Time spent in the tool itself, where variables, auto layout, and libraries decide how fast the next file moves.',
          { exploration: 0.6, craft: 0.2, systems: 0.2 },
          'hifi-prototyping',
          'The tool itself mastered, so a file is a system rather than a drawing.',
        ],
        [
          'prototyping',
          'Prototyping',
          'Time spent building prototypes real enough that a stakeholder or a test participant forgets it is not the product.',
          { exploration: 0.65, build: 0.2, craft: 0.15 },
          'ux-design',
          'Prototypes real enough that a stakeholder forgets it is not the product.',
        ],
      ),
      area(
        'technical',
        'storybook',
        'Storybook',
        [
          'storybook',
          'Storybook',
          'Time spent putting components where engineers work, with the states and props visible next to the code.',
          { systems: 0.5, build: 0.25, collaboration: 0.15, craft: 0.1 },
          'storybook',
          'Components documented where engineers work, every state visible beside the code.',
        ],
        [
          'documentation',
          'Documentation',
          'Time spent writing the decisions, rationale, and constraints down, so the next person starts where the last one stopped.',
          { collaboration: 0.4, systems: 0.3, ai: 0.15, strategy: 0.15 },
          'documentation',
          'Decisions and constraints recorded, so people and agents both start informed.',
        ],
      ),
      area(
        'technical',
        'handoff',
        'Handoff',
        [
          'handoff',
          'Handoff',
          'Time spent on specs, annotation, and the engineering partnership that decides whether a design survives the build.',
          { collaboration: 0.45, build: 0.25, systems: 0.2, craft: 0.1 },
          'cross-discipline',
          'Specs and annotation clear enough that the build matches without a meeting.',
        ],
        [
          'state-modeling',
          'State modeling',
          'Time spent naming the states a feature can be in, and what moves it from one to the next.',
          { systems: 0.45, build: 0.25, exploration: 0.2, craft: 0.1 },
          'state-modeling',
          'Every state a feature can hold, named, with the moves between them drawn.',
        ],
      ),
      area(
        'technical',
        'cms',
        'CMS',
        [
          'cms',
          'CMS',
          'Time spent owning content systems such as AEM and WordPress, where templates and authoring decide what ships.',
          { systems: 0.45, build: 0.3, collaboration: 0.15, strategy: 0.1 },
          'cms',
          'Content systems owned, so authors ship pages without a designer in the loop.',
        ],
        [
          'qa-and-analytics',
          'QA and analytics',
          'Time spent checking the release and reading what it did, so a decision can be defended with numbers.',
          { research: 0.4, systems: 0.3, build: 0.2, strategy: 0.1 },
          'ab-testing',
          'Releases checked and instrumented, so the result can be defended with numbers.',
        ],
      ),
      area(
        'technical',
        'ai-tools',
        'AI tools',
        [
          'ai-tools',
          'AI tools',
          'Time spent using models and agents to widen the search, generating and discarding more directions than a hand could alone.',
          { exploration: 0.55, ai: 0.35, build: 0.1 },
          'agentic-design',
          'Agents put to work on the exploring, with the judgment kept human.',
        ],
        [
          'agent-context',
          'Agent context',
          'Time spent writing the skills, rules, and agent-readable documents that let an agent work the way the system intends.',
          { ai: 0.5, systems: 0.25, collaboration: 0.15, exploration: 0.1 },
          'agentic-coding',
          'Context and guardrails an agent can read, so its output arrives on system.',
        ],
      ),
    ],
  },
  {
    id: 'code',
    name: 'Code',
    pool: 'points',
    root: { name: 'Build', glyph: 'build' },
    areas: [
      area(
        'code',
        'html',
        'HTML',
        [
          'html',
          'HTML',
          'Time spent expressing a design in the markup the browser reads, with structure and semantics rather than boxes.',
          { build: 0.65, systems: 0.25, craft: 0.1 },
          'html-css-sass',
          'The design in the browser’s own language, structured before it is styled.',
        ],
        [
          'css',
          'CSS',
          'Time spent styling in the medium itself, with every state and breakpoint defined rather than implied.',
          { build: 0.55, craft: 0.3, systems: 0.15 },
          'responsive-design',
          'Every state and breakpoint defined in the medium, not implied in a mockup.',
        ],
      ),
      area(
        'code',
        'git',
        'Git',
        [
          'git',
          'Git',
          'Time spent in branches, reviews, and history, where working with engineers stops being a handoff.',
          { build: 0.6, collaboration: 0.25, systems: 0.15 },
          'git-github',
          'Branches, reviews, and history handled, so contributing is not a favor.',
        ],
        [
          'automation',
          'Automation',
          'Time spent on tooling, scripts, and internal apps that remove the task instead of doing it faster.',
          { build: 0.5, ai: 0.2, systems: 0.2, exploration: 0.1 },
          'sliders',
          'Tooling and scripts that remove a task rather than making it quicker.',
        ],
      ),
      area(
        'code',
        'javascript',
        'JavaScript',
        [
          'javascript',
          'JavaScript',
          'Time spent making an interface behave, in the language the browser runs.',
          { build: 0.75, exploration: 0.15, systems: 0.1 },
          'code',
          'Behavior written in the language the browser runs, not described in a spec.',
        ],
        [
          'typescript',
          'TypeScript',
          'Time spent on types and contracts, so the shape of the data is checked before the interface renders it.',
          { build: 0.6, systems: 0.3, ai: 0.1 },
          'problem-framing',
          'Types and contracts that catch a wrong shape before an interface renders it.',
        ],
      ),
      area(
        'code',
        'react',
        'React',
        [
          'react',
          'React',
          'Time spent in components, state, and effects, where a design system becomes a running application.',
          { build: 0.75, systems: 0.15, exploration: 0.1 },
          'react',
          'Components, state, and effects written, so the system becomes an application.',
        ],
        [
          'react-native',
          'React Native',
          'Time spent shipping the same component thinking to phones, where platform rules replace browser ones.',
          { build: 0.7, craft: 0.15, exploration: 0.15 },
          'expo',
          'One component vocabulary carried to phones, where the platform rules differ.',
        ],
      ),
      area(
        'code',
        'production-ownership',
        'Production ownership',
        [
          'production-ownership',
          'Production ownership',
          'Time spent owning code after it ships, including the reviews, regressions, and releases that come with it.',
          { build: 0.7, collaboration: 0.2, ai: 0.1 },
          'ship',
          'The front end owned in production, where the real work finally becomes visible.',
        ],
        [
          'performance',
          'Performance',
          'Time spent on the budget a page keeps, from payload and paint to the interaction that has to stay under a frame.',
          { build: 0.6, research: 0.2, systems: 0.2 },
          'performance',
          'A page held to a budget, from payload and paint to interaction under a frame.',
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
