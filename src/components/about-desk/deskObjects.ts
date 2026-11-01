// The things on the About desk: what each one is, how big it is, and where it
// starts. Everything is at one real-world scale, 3.175px a millimetre: the
// archive card's face is 200px for a 63mm trading card, and the note is a
// 214mm US Letter sheet. Positions are the canvas's (About Playground,
// 27 October 2026): x and y in desk pixels, the turn in degrees, the stack
// order. A thing in the lower desk is placed from the lower desk's top, which
// moves to sit under whichever tab of the folder is open.
import { ARCHIVE_CARDS } from '../../data/archiveCards';

export type DeskGroup = 'side' | 'lower';

/** how a thing moves when it is dragged and what it does when it is clicked (plans/006) */
export type DeskKind = 'ball' | 'disc' | 'football' | 'pods' | 'bud' | 'pad' | 'card' | 'sketch' | 'pencil' | 'book' | 'phone' | 'cart' | 'console' | 'almanac' | 'shuffle' | 'pack';

export interface DeskThing {
  id: string;
  /** what the button says it is */
  label: string;
  /** the caption that shows on hover */
  tag?: string;
  /** which drawing, or which archive card, or the pack image */
  draw: 'pokemon-red' | 'gameboy-color' | 'almanac' | 'ipod-mini' | 'dragon-ball' | 'disc' | 'phone' | 'airpods' | 'trackpad' | 'football' | 'pack'
    | 'sketch' | 'pencil' | 'notebook-open' | 'card' | 'bud';
  kind: DeskKind;
  /** the note a click opens (deskNotes.tsx); none for the pencil */
  note?: string;
  /** a thing that only comes out of another one: the AirPods come out of their case */
  from?: string;
  /** the archive card it shows, for draw: 'card' */
  card?: string;
  width: number;
  height: number;
  start: [x: number, y: number, turn: number, z: number];
  group: DeskGroup;
  /** the drawing brings its own contact shadow: the page casts none */
  bare?: boolean;
}

export const DESK_WIDTH = 1440;
export const FOLDER = { left: 360, top: 112, width: 740, tabs: 58 } as const;
/** the lower desk's height, and the least distance it sits from the top of the page */
export const LOWER_HEIGHT = 1360;
export const LOWER_MIN_TOP = 1500;
export const CUTTING_MAT = { left: 454, top: 225, width: 1301, height: 832 } as const;

// the archive: four stacked where they fell out of the pack, three loose on the mat
const CARD_SPOTS: [slug: string, x: number, y: number, turn: number, z: number][] = [
  ['baxter-building', 400, 180, -6, 8], ['veggietales-toys', 440, 196, 4, 9], ['grandville-gremlins', 482, 184, -3, 10], ['dc-lawncare', 526, 206, 7, 11],
  ['grand-lan', 700, 170, -5, 4], ['fusion', 840, 150, 3, 5], ['vitamin-giant', 760, 380, -2, 6],
];
const cards: DeskThing[] = CARD_SPOTS.map(([slug, x, y, turn, z]) => {
  const card = ARCHIVE_CARDS.find((c) => c.slug === slug);
  if (!card) throw new Error(`about desk: no archive card ${slug}`);
  return {
    id: `card-${slug}`,
    label: `${card.title}: ${card.subtitle}. Archived artwork, first edition, ${card.year}. Drag to move, or use the arrow keys.`,
    draw: 'card' as const,
    kind: 'card' as const,
    note: `card:${slug}`,
    card: slug,
    width: 220,
    height: 220 / 0.735,
    start: [x, y, turn, z],
    group: 'lower' as const,
  };
});

export const DESK_THINGS: DeskThing[] = [
  // beside the folder: the early years down the left, the work now down the right
  { id: 'pkred', label: 'Pokémon Red, the Game Boy cartridge. Drag to move, or use the arrow keys.', tag: 'Pokémon Red, 1998', draw: 'pokemon-red', kind: 'cart', note: 'pokemon', width: 181, height: 206, start: [-60, 120, -8, 3], group: 'side' },
  { id: 'gbc', label: 'A Game Boy Color in Atomic Purple, the clear purple shell. Drag to move, or use the arrow keys.', tag: 'Game Boy Color, Atomic Purple', draw: 'gameboy-color', kind: 'console', note: 'games', width: 248, height: 424, start: [-150, 300, 6, 2], group: 'side' },
  { id: 'cd', label: 'Adobe Illustrator CS training disc. Drag to move, or use the arrow keys.', tag: 'where the tools started', draw: 'disc', kind: 'disc', note: 'designers', width: 381, height: 381, start: [-132, 760, 0, 2], group: 'side' },
  { id: 'almanac', label: 'Grays Sports Almanac, the book from Back to the Future Part II. Drag to move, or use the arrow keys.', tag: 'Grays Sports Almanac', draw: 'almanac', kind: 'almanac', note: 'movies', width: 483, height: 705, start: [-300, 1150, -6, 2], group: 'side' },
  { id: 'ball', label: 'Four-star Dragon Ball. Drag to move, or use the arrow keys.', tag: 'four stars', draw: 'dragon-ball', kind: 'ball', note: 'tv', width: 241, height: 241, start: [102, 1084, 0, 4], group: 'side' },
  { id: 'ipod', label: 'A green iPod mini with a white click wheel. Drag to move, or use the arrow keys.', tag: 'on shuffle', draw: 'ipod-mini', kind: 'shuffle', note: 'songs', width: 161, height: 290, start: [1180, 520, 10, 4], group: 'side' },
  { id: 'phone', label: 'iPhone running my own build of Loop, the automated insulin app. Its controls work. Drag the phone by its frame, or use the arrow keys; press Enter for the story.', tag: 'Loop, my own build', draw: 'phone', kind: 'phone', note: 'loop', width: 239, height: 479, start: [1150, 150, 6, 2], group: 'side' },
  { id: 'pods', label: 'AirPods Pro case. Drag to move, or use the arrow keys.', tag: 'always within reach', draw: 'airpods', kind: 'pods', note: 'podcasts', width: 196, height: 151, start: [1252, 652, -12, 3], group: 'side' },
  { id: 'bud-l', label: 'Left AirPod, out of its case. Drag to move, or use the arrow keys.', draw: 'bud', kind: 'bud', note: 'podcasts', from: 'pods', width: 98, height: 69, start: [1150, 790, -24, 6], group: 'side' },
  { id: 'bud-r', label: 'Right AirPod, out of its case. Drag to move, or use the arrow keys.', draw: 'bud', kind: 'bud', note: 'podcasts', from: 'pods', width: 98, height: 69, start: [1226, 838, 152, 6], group: 'side' },
  { id: 'pad', label: 'Apple trackpad. Drag to move, or use the arrow keys.', tag: 'the trackpad, not a mouse', draw: 'trackpad', kind: 'pad', note: 'pad', width: 508, height: 365, start: [1196, 806, 3, 2], group: 'side' },
  { id: 'ndball', label: 'Notre Dame foam football, seen from above. Drag to move, or use the arrow keys.', tag: 'South Bend, Saturdays', draw: 'football', kind: 'football', note: 'goat', width: 628, height: 628, start: [1092, 1080, -10, 2], group: 'side', bare: true },
  // the desk below the folder: the archive, on the cutting mat
  { id: 'envelope', label: 'The foil pack the archive cards came in, torn open: 1st Edition, The Early Work, Ryan DeBoer Project Archive, 7 original project cards. Drag to move, or use the arrow keys.', tag: 'before any of this · 2009–14', draw: 'pack', kind: 'pack', note: 'archive', width: 222, height: 340, start: [236, 296, 12, 1], group: 'lower', bare: true },
  ...cards,
  { id: 'sketch', label: 'A pencil sketch of my talent tree. Drag to move, or open it for the Forge.', draw: 'sketch', kind: 'sketch', note: 'forge', width: 470, height: 400, start: [1050, 390, -3, 3], group: 'lower' },
  { id: 'pencil', label: 'Drawing pencil, 8H. Drag to move, or use the arrow keys.', draw: 'pencil', kind: 'pencil', width: 556, height: 31, start: [944, 598, -18, 5], group: 'lower' },
  { id: 'book', label: 'My notebook, open. Click to turn the page to more notes.', tag: 'opens the notes', draw: 'notebook-open', kind: 'book', note: 'notes', width: 984, height: 685, start: [-120, 796, 2, 3], group: 'lower' },
];


/** Where a [[link]] in the note lands on the thing it names, from the thing's top left. */
export const LINK_TO: Record<string, [id: string, dx: number, dy: number]> = {
  southbend: ['ndball', 314, 300],
  kendall: ['card-grand-lan', 110, 150],
  round2: ['card-baxter-building', 110, 150],
  loop: ['phone', 120, 240],
  forge: ['sketch', 235, 200],
  notes: ['book', 460, 100],
  archive: ['envelope', 111, 40],
  survivor: ['ball', 120, 120],
  league: ['card-grandville-gremlins', 110, 150],
  movies: ['almanac', 240, 120],
  listens: ['pods', 98, 75],
};

export type DeskTab = 'work' | 'path' | 'who';
export const DESK_TABS: { key: DeskTab; index: string; label: string }[] = [
  { key: 'work', index: '01 / 03', label: 'How I work' },
  { key: 'path', index: '02 / 03', label: 'How I got here' },
  { key: 'who', index: '03 / 03', label: 'Who I am' },
];

// ── the contained layout (/about-desk/contained) ───────────────────────────
// The page sits in the homepage's container (1186px). The folder keeps its
// 740px; the things that lay beside it move into a tray beside the folder,
// drawn at real size and shown zoomed out to the tray's width, and the mat,
// the archive, the Forge sketch and the notebook sit below the folder.
export const CONTAINER = 1186;
export const TRAY = { width: 760, height: 1480 } as const;
export const SHELF_LOWER = { width: CONTAINER, height: 1560 } as const;
const OFFSET = (DESK_WIDTH - CONTAINER) / 2;
const TRAY_SPOTS: Record<string, [number, number, number, number]> = {
  pkred: [-40, 0, -8, 3],
  gbc: [-90, 200, 6, 2],
  phone: [480, 30, 6, 3],
  cd: [60, 640, 0, 2],
  pods: [520, 560, -12, 4],
  'bud-l': [424, 678, -24, 6],
  'bud-r': [524, 726, 152, 6],
  ball: [372, 640, 0, 4],
  ipod: [300, 420, 10, 4],
  almanac: [-200, 900, -6, 2],
  pad: [330, 900, 3, 2],
  ndball: [-170, 1050, -10, 2],
}
export const CONTAINED_STARTS: Record<string, [number, number, number, number]> = Object.fromEntries(
  DESK_THINGS.map((t) => {
    if (t.group === 'side') return [t.id, TRAY_SPOTS[t.id] ?? [...t.start]];
    // the notebook comes all the way into the container, in full view
    if (t.id === 'book') return [t.id, [40, 820, 1, 3]];
    // the Forge sketch and the pencil on it come in from the edge, so the whole sheet shows
    if (t.id === 'sketch') return [t.id, [t.start[0] - OFFSET - 110, t.start[1], t.start[2], t.start[3]]];
    if (t.id === 'pencil') return [t.id, [t.start[0] - OFFSET - 110, t.start[1], t.start[2], t.start[3]]];
    return [t.id, [t.start[0] - OFFSET, t.start[1], t.start[2], t.start[3]]];
  }),
);
export const CONTAINED_MAT = { left: CUTTING_MAT.left - OFFSET, top: CUTTING_MAT.top } as const;

// ── the hybrid pitch (/about-desk/hybrid) ──────────────────────────────────
// Information first. The folder leads at reading width inside the homepage
// container; the props sit small in the wood margin beside the section they
// belong to, and scroll with it. Nothing is cropped and nothing sticks. Below
// the folder, the cutting mat at the container's width holds the archive, the
// Forge sketch and the notebook.
/** the mat's own proportions; on the hybrid it is drawn at least this tall and runs off the window's right edge */
export const MAT_RATIO = CUTTING_MAT.height / CUTTING_MAT.width;
export const HYBRID_MAT_MIN_WIDTH = 1345;
/** the lower desk is at least this tall: the notebook overhangs the mat's foot onto the wood */
export const HYBRID_LOWER_MIN = 1010;
// The bottom of the page, composed rather than dropped (impeccable layout pass,
// 28 Oct). The notebook leads: it lies open in front, on top. The seven archive
// cards fan from beneath its top edge like a hand tucked under it, so their
// title strips read and a pointer pulls one out; the torn pack lies where they
// spilled from. The Forge sketch sits on the mat to the right with the pencil
// across it, its corner under the notebook. Nothing here drags.
const HAND = ['baxter-building', 'veggietales-toys', 'grandville-gremlins', 'dc-lawncare', 'grand-lan', 'fusion', 'vitamin-giant'];
const HYBRID_SPOTS: Record<string, [number, number, number, number]> = {
  envelope: [24, 46, -14, 1],
  ...Object.fromEntries(HAND.map((slug, i) => {
    const o = i - 3;
    return [`card-${slug}`, [100 + i * 90, 84 + o * o * 9, o * 5, 2 + i]];
  })),
  sketch: [900, 86, 4, 3],
  pencil: [858, 318, -18, 12],
  book: [48, 300, -2, 20],
};
export const HYBRID_STARTS: Record<string, [number, number, number, number]> = Object.fromEntries(
  DESK_THINGS.map((t) => [t.id, HYBRID_SPOTS[t.id] ?? [...t.start]]),
);

/**
 * A prop in the page gutters: one set for the whole page, the same under every
 * tab, placed by its distance from the top of the folder. `over` props lean
 * onto the paper's edge.
 */
export interface GutterProp {
  id: string;
  side: 'left' | 'right';
  /** distance from the folder's top */
  y: number;
  /** lean: well onto the paper; touch: the football's reach; kiss: onto the paper's margin only, never its text */
  over?: 'lean' | 'touch' | 'kiss';
  /** a turn of its own, in degrees */
  turn?: number;
}

/** each gutter prop's plain name, for the layer lists and chips (the tags are the handwritten captions) */
export const PROP_NAMES: Record<string, string> = {
  pkred: 'Pokémon Red', ball: 'Four-star ball', gbc: 'Game Boy Color', cd: 'Illustrator CS disc', ipod: 'iPod mini',
  almanac: 'Grays Sports Almanac', ndball: 'Notre Dame football', pad: 'Trackpad', pods: 'AirPods Pro', phone: 'iPhone, running Loop',
};

const L = (id: string, side: 'left' | 'right', y: number, more: Partial<GutterProp> = {}): GutterProp => ({ id, side, y, ...more });
/**
 * The props down both gutters, oldest to newest, so the scroll is the years:
 * Pokémon Red and the Game Boy Color at the top, the phone running my Loop
 * build at the bottom. Ryan chose this Timeline over nine other layouts (30
 * Oct); on 31 Oct the cartridges, the stubs and the buff gave way to the
 * Game Boy Color, Pokémon Red, the Almanac and the iPod mini.
 */
export const GUTTER_PROPS: GutterProp[] = [
  L('pkred', 'left', -24, { turn: -6 }), L('ball', 'right', 300), L('gbc', 'left', 320, { turn: 4 }), L('cd', 'left', 880, { turn: 45 }), L('ipod', 'right', 1000, { over: 'kiss', turn: 9 }),
  L('almanac', 'left', 1460, { over: 'lean', turn: -4 }), L('ndball', 'right', 1620, { over: 'touch' }), L('pad', 'left', 2320, { turn: -7 }), L('pods', 'right', 1380, { turn: -11 }), L('phone', 'right', 2700, { over: 'kiss', turn: 7 })];
