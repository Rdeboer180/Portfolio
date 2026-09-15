import { ATLAS_ABILITIES } from './atlas';

export const ATLAS_SIZE = { width: 1200, height: 2840 };
export interface AtlasPoint { x: number; y: number }

/** Authored map coordinates preserve reading room; they never encode point values. */
export const ATLAS_SKILL_POSITIONS: Record<string, AtlasPoint> = Object.fromEntries([
  ['typography', 240, 160], ['layout', 140, 315], ['interaction', 340, 350],
  ['raster-craft', 95, 505], ['tokens', 260, 535], ['vector-design', 145, 690],
  ['components', 330, 730], ['accessibility', 195, 890], ['motion', 380, 950],
  ['governance', 280, 1085], ['research', 100, 1140], ['information-architecture', 200, 1300],
  ['figma', 600, 160], ['prototyping', 490, 315], ['storybook', 700, 355],
  ['documentation', 600, 530], ['handoff', 475, 700], ['state-modeling', 700, 800],
  ['cms', 570, 955], ['ai-tools', 470, 1110], ['qa-and-analytics', 730, 1130], ['agent-context', 590, 1300],
  ['html', 960, 160], ['css', 850, 315], ['git', 1080, 335], ['javascript', 960, 505],
  ['automation', 1090, 680], ['typescript', 830, 735], ['performance', 990, 860],
  ['react', 885, 1040], ['react-native', 1080, 1130], ['production-ownership', 950, 1320],
].map(([id, x, y]) => [id as string, { x: x as number, y: y as number }]));

const stance = [[160,1490],[100,1650],[265,1800],[380,1540],[465,1730],[305,1970],[600,1460],[725,1670],[170,2120],[550,1930],[685,2100],[850,1820],[1035,1490],[1000,2020],[870,1575],[1090,1750]];
const combo = [[340,2230],[105,2330],[450,2425],[590,2200],[740,2380],[925,2240],[1090,2420],[885,2560],[160,2600],[540,2620]];
const finisher = [[390,2510],[710,2700],[790,1940],[560,1600],[1060,2700]];
export const ATLAS_ABILITY_POSITIONS: Record<string, AtlasPoint> = {};
const counters = { stance: 0, combo: 0, finisher: 0 };
ATLAS_ABILITIES.forEach((ability) => {
  const [x, y] = { stance, combo, finisher }[ability.kind][counters[ability.kind]++];
  ATLAS_ABILITY_POSITIONS[ability.id] = { x, y };
});

export function atlasCurve(from: AtlasPoint, to: AtlasPoint): string {
  const middle = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`;
}
