import type { Allocation, Family, TalentNode, TreeId } from './types';
import { NODE_LIST, foundationOf, treeOf } from './trees';

/** Atlas v2 is staged separately so existing v5 share links retain their taxonomy. */
export interface AtlasSkill extends TalentNode {
  territory: TreeId;
  prerequisite?: { skillId: string; points: number };
}

const newCraftSkills: AtlasSkill[] = [
  {
    id: 'raster-craft', name: 'Raster Craft', territory: 'design', areaId: 'visual-assets', tier: 'foundation',
    meaning: 'Time spent in Photoshop and raster workflows, shaping images through compositing, retouching, and production craft.',
    weights: { craft: 0.7, exploration: 0.2, build: 0.1 }, glyph: 'visual-craft',
    masteryLine: 'Images composed and prepared with the same care as the interface around them.',
  },
  {
    id: 'vector-design', name: 'Vector Design', territory: 'design', areaId: 'visual-assets', tier: 'foundation',
    meaning: 'Time spent building scalable marks, icons, illustrations, and graphic systems in vector tools.',
    weights: { craft: 0.6, systems: 0.3, exploration: 0.1 }, glyph: 'visual-craft',
    masteryLine: 'Scalable visual assets that stay precise from the smallest icon to the largest application.',
  },
];

export const ATLAS_SKILLS: AtlasSkill[] = [
  ...NODE_LIST.map((node): AtlasSkill => {
    const prerequisite = node.id === 'automation' ? undefined : foundationOf(node.id);
    return { ...node, territory: treeOf(node.id)!.id,
      ...(prerequisite ? { prerequisite: { skillId: prerequisite.id, points: 2 } } : {}) };
  }),
  ...newCraftSkills,
];
export const ATLAS_SKILL_BY_ID = Object.fromEntries(ATLAS_SKILLS.map((skill) => [skill.id, skill])) as Record<string, AtlasSkill>;

export type AtlasAbilityKind = 'stance' | 'combo' | 'finisher';
export type AtlasRank = 0 | 1 | 2 | 3 | 4 | 5;
export type AtlasVisibility = 'hidden' | 'resonating' | 'discovered';
export const ATLAS_RANK_LABELS = ['Dormant', 'Unlocked', 'Strengthened', 'Advanced', 'Elite', 'Master'] as const;

export interface AtlasAbility {
  id: string;
  name: string;
  kind: AtlasAbilityKind;
  family: Family;
  ingredients: string[];
  description: string;
  hint: string;
}

function ability(id: string, name: string, kind: AtlasAbilityKind, family: Family, ingredients: string[], description: string): AtlasAbility {
  const hints: Record<Family, string> = {
    craft: 'Your visual-craft skills are beginning to connect.',
    systems: 'A pattern is forming between your system skills.',
    exploration: 'Your experiments are finding common ground.',
    build: 'Your design and implementation skills are beginning to connect.',
    product: 'Your interface decisions are beginning to reinforce one another.',
    collaboration: 'Connections are forming in how you carry work between people.',
    research: 'Your research and sense-making skills are beginning to connect.',
    ai: 'Your tools and working methods are beginning to reinforce one another.',
  };
  return { id, name, kind, family, ingredients, description, hint: hints[family] };
}

/** The 30-recipe brief plus Ryan-approved Script Spark for JavaScript coverage. */
export const ATLAS_ABILITIES: AtlasAbility[] = [
  ability('figma-force', 'Figma Force', 'stance', 'systems', ['figma', 'components'], 'Turn design files into reusable systems.'),
  ability('pixel-prowess', 'Pixel Prowess', 'stance', 'craft', ['raster-craft', 'layout'], 'Bring image craft, composition, and interface polish together.'),
  ability('vector-velocity', 'Vector Velocity', 'stance', 'craft', ['vector-design', 'typography'], 'Build a precise visual language from type and scalable graphics.'),
  ability('token-tactics', 'Token Tactics', 'stance', 'systems', ['tokens', 'css'], 'Carry named design decisions directly into implementation.'),
  ability('component-combo', 'Component Combo', 'stance', 'systems', ['components', 'storybook'], 'Carry library thinking into the tools engineers use.'),
  ability('motion-momentum', 'Motion Momentum', 'stance', 'product', ['motion', 'interaction'], 'Use movement to communicate state and intent.'),
  ability('prototype-pulse', 'Prototype Pulse', 'stance', 'exploration', ['figma', 'prototyping'], 'Make an idea tangible enough to evaluate quickly.'),
  ability('state-sense', 'State Sense', 'stance', 'product', ['interaction', 'state-modeling'], 'See the interface states beyond the ideal screen.'),
  ability('accessibility-armor', 'Accessibility Armor', 'stance', 'systems', ['accessibility', 'components'], 'Build inclusive behavior into reusable primitives.'),
  ability('handoff-harmony', 'Handoff Harmony', 'stance', 'collaboration', ['handoff', 'documentation'], 'Reduce translation loss between design and engineering.'),
  ability('cms-command', 'CMS Command', 'stance', 'systems', ['cms', 'information-architecture'], 'Create structured experiences that content authors can operate.'),
  ability('template-tactics', 'Template Tactics', 'stance', 'build', ['cms', 'html'], 'Build reusable page architecture for real content.'),
  ability('front-end-flow', 'Front-End Flow', 'stance', 'build', ['html', 'css'], 'Think and work in the browser’s own medium.'),
  ability('typescript-tempo', 'TypeScript Tempo', 'stance', 'build', ['typescript', 'state-modeling'], 'Give application logic and state clear contracts.'),
  ability('agent-arsenal', 'Agent Arsenal', 'stance', 'ai', ['ai-tools', 'agent-context'], 'Give agents both capability and the context to use it.'),
  ability('script-spark', 'Script Spark', 'stance', 'build', ['javascript', 'interaction'], 'Turn interaction ideas into behavior in the browser.'),
  ability('system-sight', 'System Sight', 'combo', 'systems', ['tokens', 'components', 'governance'], 'See the rules, consumers, and consequences behind a component.'),
  ability('brand-barrage', 'Brand Barrage', 'combo', 'craft', ['typography', 'raster-craft', 'vector-design'], 'Build a visual language across type, images, and scalable assets.'),
  ability('interface-instinct', 'Interface Instinct', 'combo', 'product', ['layout', 'interaction', 'prototyping'], 'Turn interface judgment into ideas people can try.'),
  ability('lossless-handoff', 'Lossless Handoff', 'combo', 'collaboration', ['components', 'storybook', 'handoff'], 'Help a design survive translation into engineering.'),
  ability('content-choreography', 'Content Choreography', 'combo', 'systems', ['cms', 'information-architecture', 'accessibility'], 'Make content architecture work for readers and authors.'),
  ability('front-end-mastery', 'Front-End Mastery', 'combo', 'build', ['html', 'css', 'typescript'], 'Develop command of the front-end medium through structure, styling, and contracts.'),
  ability('cross-platform-craft', 'Cross-Platform Craft', 'combo', 'build', ['react', 'react-native', 'components'], 'Carry component thinking across web and native experiences.'),
  ability('automation-advantage', 'Automation Advantage', 'combo', 'ai', ['ai-tools', 'agent-context', 'automation'], 'Find ways to remove repetitive work from the process.'),
  ability('signal-sense', 'Signal Sense', 'combo', 'research', ['research', 'qa-and-analytics', 'information-architecture'], 'Turn qualitative and quantitative signals into useful direction.'),
  ability('design-diplomacy', 'Design Diplomacy', 'combo', 'collaboration', ['handoff', 'governance', 'research'], 'Reconcile user needs, system rules, and engineering constraints.'),
  ability('guardrail-architect', 'Guardrail Architect', 'finisher', 'systems', ['tokens', 'accessibility', 'governance', 'documentation'], 'Standards, accessibility, and governance that hold when you leave the room.'),
  ability('prototype-alchemist', 'Prototype Alchemist', 'finisher', 'exploration', ['figma', 'prototyping', 'ai-tools', 'html'], 'Turn ambiguity into something tangible enough to test and improve.'),
  ability('systemsmith', 'Systemsmith', 'finisher', 'systems', ['tokens', 'components', 'storybook', 'css'], 'Forge a system from design decisions into reusable implemented primitives.'),
  ability('system-memory', 'System Memory', 'finisher', 'collaboration', ['documentation', 'governance', 'agent-context', 'cms'], 'Keep the reasoning accessible to people, content authors, and agents.'),
  ability('shipwright', 'Shipwright', 'finisher', 'build', ['git', 'performance', 'qa-and-analytics', 'production-ownership'], 'Stay responsible for the work after it meets real use.'),
];

export interface AtlasAbilityState {
  ability: AtlasAbility;
  visibility: AtlasVisibility;
  activeConnections: number;
  invested: number;
  capacity: number;
  /** A 0–1 recipe fill, not a rating of professional competence. */
  charge: number;
  rank: AtlasRank;
  rankLabel: typeof ATLAS_RANK_LABELS[number];
  nextRank: AtlasRank | null;
  requirements: { skillId: string; points: number; nextRankMissing: number }[];
  limitingSkills: string[];
  territories: TreeId[];
  classWeight: number;
}

export function atlasPoints(allocation: Allocation, id: string): number {
  const value = allocation[id];
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(5, Math.floor(value))) : 0;
}

/** Discovery memory is supplied by the caller; never inferred from rank or storage. */
export function evaluateAtlasAbility(definition: AtlasAbility, allocation: Allocation, remembered = false): AtlasAbilityState {
  if (!definition.ingredients.length) throw new Error('An Atlas ability needs ingredients.');
  if (new Set(definition.ingredients).size !== definition.ingredients.length) throw new Error('An Atlas recipe cannot repeat a skill.');
  const points = definition.ingredients.map((id) => {
    if (!ATLAS_SKILL_BY_ID[id]) throw new Error(`Unknown Atlas skill: ${id}`);
    return atlasPoints(allocation, id);
  });
  const rank = Math.min(...points) as AtlasRank;
  const nextRank = rank === 5 ? null : (rank + 1) as AtlasRank;
  const invested = points.reduce((sum, value) => sum + value, 0);
  const capacity = points.length * 5;
  const activeConnections = points.filter((value) => value > 0).length;
  const visibility = rank > 0 || remembered ? 'discovered' : activeConnections >= 2 ? 'resonating' : 'hidden';
  const territories = Array.from(new Set(definition.ingredients.map((id) => ATLAS_SKILL_BY_ID[id].territory)));
  const kindWeight = { stance: 1, combo: 2, finisher: 3 }[definition.kind];
  return {
    ability: definition, visibility, activeConnections, invested, capacity, charge: invested / capacity,
    rank, rankLabel: ATLAS_RANK_LABELS[rank], nextRank,
    requirements: definition.ingredients.map((skillId, index) => ({ skillId, points: points[index], nextRankMissing: nextRank === null ? 0 : Math.max(0, nextRank - points[index]) })),
    limitingSkills: nextRank === null ? [] : definition.ingredients.filter((_, index) => points[index] === rank),
    territories,
    // Draft weighting: rank matters, finishers carry more weight, breadth breaks close matches.
    // Dormant remembered discoveries cannot influence the current class.
    classWeight: rank === 0 ? 0 : rank * kindWeight + (territories.length - 1) * 0.25 + invested / capacity * 0.1,
  };
}

export function evaluateAtlas(allocation: Allocation, rememberedIds: ReadonlySet<string> = new Set()): AtlasAbilityState[] {
  return ATLAS_ABILITIES.map((definition) => evaluateAtlasAbility(definition, allocation, rememberedIds.has(definition.id)));
}

/** A presentation-safe view: neither hidden nor resonating abilities leak recipes or names. */
export function atlasAbilityView(state: AtlasAbilityState) {
  const publicState = { id: state.ability.id, visibility: state.visibility, activeConnections: state.activeConnections };
  if (state.visibility !== 'discovered') {
    return { ...publicState, name: '???', hint: state.visibility === 'resonating' ? state.ability.hint : 'An undiscovered connection.' };
  }
  return { ...publicState, name: state.ability.name, description: state.ability.description,
    rank: state.rank, rankLabel: state.rankLabel, charge: state.charge,
    requirements: state.requirements, nextRank: state.nextRank, limitingSkills: state.limitingSkills };
}

/** Never backfill a class with undiscovered names. The first two distinct families win. */
export function pickAtlasClass(states: AtlasAbilityState[]): { primary: AtlasAbilityState | null; secondary: AtlasAbilityState | null } {
  const ranked = states.filter((state) => state.rank > 0)
    .map((state, index) => ({ state, index }))
    .sort((a, b) => b.state.classWeight - a.state.classWeight || a.index - b.index);
  const primary = ranked[0]?.state || null;
  const secondary = ranked.find(({ state }) => state.ability.family !== primary?.ability.family)?.state || null;
  return { primary, secondary };
}

export function uncoveredAtlasSkills(): string[] {
  const used = new Set(ATLAS_ABILITIES.flatMap((definition) => definition.ingredients));
  return ATLAS_SKILLS.filter((skill) => !used.has(skill.id)).map((skill) => skill.id);
}
