// Ryan's top tens, one for each prop in the desk's gutters, as PlayDraft
// drafts (DraftRoom.tsx draws them). The packs, their accent pairs and their
// category colours are the app's own (PlayDraft repo,
// implementation/category-round-system: src/design-system/packs.ts and
// src/data/packs/*). A pick that is null would still be on the clock: one
// Ryan has not given yet. Nothing here is filled in for him.

export type PackAccent = { primary: string; secondary: string };

/** packAccents, from the app */
export const ACCENTS = {
  green: { primary: '#35d68a', secondary: '#163e41' },
  yellow: { primary: '#ffd23f', secondary: '#403d31' },
  plum: { primary: '#c79bff', secondary: '#1e1f40' },
  red: { primary: '#ff8f8f', secondary: '#281724' },
  blue: { primary: '#78b7ff', secondary: '#132b52' },
  rust: { primary: '#d18242', secondary: '#3a1f0d' },
  orange: { primary: '#ff8c42', secondary: '#3a1a05' },
  cyan: { primary: '#9ae6e1', secondary: '#072525' },
  ink: { primary: '#5ad1c2', secondary: '#0c2a2e' },
} satisfies Record<string, PackAccent>;
type AccentName = keyof typeof ACCENTS;

interface Pack {
  name: string;
  accent: AccentName;
  shield: string;
  /** the pack's categories and the accent each wears (the app's *_CATEGORY_TO_ACCENT) */
  categories?: Record<string, AccentName>;
  /** a custom draft: the player authors the topic and every pick is a write-in */
  custom?: boolean;
}

export const PACKS = {
  'goat-athletes': {
    name: 'GOAT Athletes', accent: 'plum', shield: '/images/playdraft/shields/goat-athletes.svg',
    categories: { Baseball: 'blue', Basketball: 'orange', Football: 'green', 'Soccer & Hockey': 'cyan', 'Tennis & Golf': 'yellow', Other: 'plum' },
  },
  'video-games': {
    name: 'Video Games', accent: 'blue', shield: '/images/playdraft/shields/video-games.svg',
    categories: { Platformers: 'yellow', Shooters: 'red', Adventure: 'green', RPG: 'plum', Strategy: 'blue', 'Sports, Racing & Party': 'rust', 'Retro & Arcade': 'plum' },
  },
  movies: { name: 'Movies', accent: 'red', shield: '/images/playdraft/shields/movies.svg' },
  // All TV: the series pack Ryan is building now (31 Oct); its shield is from the app repo, its data is not written yet
  'all-tv': { name: 'All TV', accent: 'cyan', shield: '/images/playdraft/shields/all-tv.svg' },
  custom: { name: 'Custom Draft', accent: 'ink', shield: '/images/playdraft/shields/custom-draft.svg', custom: true },
} satisfies Record<string, Pack>;
export type PackKey = keyof typeof PACKS;
export const packOf = (key: PackKey): Pack => PACKS[key];

export interface DraftPick {
  title: string;
  /** a second line: the artist of a song */
  sub?: string;
  /** the pack's category, which colours the line under the title */
  cat?: string;
  /** the label under the title, when it is not the category itself (Tony Hawk's sport, in the pack's Other) */
  label?: string;
}

export interface DraftSpec {
  /** the draft's name, as the room's header shows it */
  title: string;
  pack: PackKey;
  /** ten picks in order; null is still on the clock */
  picks: (DraftPick | null)[];
  /** picks that are in the ten but not yet placed in it: the app's Queue */
  queue?: DraftPick[];
}

export const DRAFTS: Record<string, DraftSpec> = {
  // the Game Boy Color: PlayDraft's Video Games pack. FireRed and NBA Hangtime
  // are not in the pack's 500; they take the category the pack gives their
  // siblings (its other Pokémon games are RPG, NBA Jam is Sports, Racing & Party).
  games: {
    title: 'My top 10 games',
    pack: 'video-games',
    picks: [
      { title: 'Conker’s Bad Fur Day', cat: 'Platformers' },
      { title: 'Pokémon FireRed', cat: 'RPG' },
      { title: 'World of Warcraft', cat: 'RPG' },
      { title: 'Rock Band', cat: 'Sports, Racing & Party' },
      { title: 'Perfect Dark', cat: 'Shooters' },
      { title: 'Super Mario Odyssey', cat: 'Platformers' },
      { title: 'TMNT: Turtles in Time', cat: 'Adventure' },
      { title: 'Pokémon Trading Card Game', cat: 'Strategy' },
      { title: 'Final Fantasy IV', cat: 'RPG' },
      { title: 'NBA Hangtime', cat: 'Sports, Racing & Party' },
    ],
  },
  // Pokémon Red: there is no Pokémon pack, so a custom draft
  pokemon: {
    title: 'My top 10 Pokémon',
    pack: 'custom',
    picks: ['Charizard', 'Eevee', 'Alakazam', 'Ampharos', 'Lugia', 'Togepi', 'Mew', 'Torchic', 'Articuno', 'Luxio'].map((title) => ({ title })),
  },
  // the Dragon Ball: the All TV pack Ryan is building. Its categories are not
  // written yet, so the picks carry none; give them a `cat` once they are.
  tv: {
    title: 'Favorite TV series of all time',
    pack: 'all-tv',
    picks: ['Breaking Bad', 'Survivor', 'Dragon Ball Z / Super', 'The Pitt', 'The Office', 'The Traitors', 'From', 'Friends', 'Stranger Things', 'Prison Break'].map((title) => ({ title })),
  },
  // Grays Sports Almanac: PlayDraft's Movies pack. Ryan's list (the one the
  // desk's ticket stubs carried before, 31 Oct); the line under each is its year.
  movies: {
    title: 'Favorite movies of all time',
    pack: 'movies',
    picks: [
      ['Avengers: Endgame', '2019'], ['Back to the Future Part II', '1989'], ['Die Hard', '1988'], ['I Love You, Man', '2009'], ['Baby Driver', '2017'],
      ['The Martian', '2015'], ['The Avengers', '2012'], ['Fight Club', '1999'], ['The Lion King', '1994'], ['The Empire Strikes Back', '1980'],
    ].map(([title, label]) => ({ title, label })),
  },
  // the AirPods: a custom draft, Ryan's ten in his order (31 Oct)
  podcasts: {
    title: 'My top 10 podcasts',
    pack: 'custom',
    picks: [
      'The Fantasy Footballers', 'Rob Has a Podcast', 'Dive Radio', 'Late-Round Fantasy Football', 'Dynasty Nerds',
      'I Will Teach You to Be Rich', 'Diabetech', 'Dive Club', 'The Daily', 'Mastering Diabetes',
    ].map((title) => ({ title })),
  },
  // the Illustrator CS disc: a custom draft
  designers: {
    title: 'Favorite designers and influences',
    pack: 'custom',
    picks: ['Michael Riddering', 'Tommy Geoco', 'Jared Tredly', 'Chloe Park', 'Loredana Crisan', 'James McDonald', 'Dianne Alter', 'Brad Frost', 'Kirk McNeill', 'Minsang Choi'].map((title) => ({ title })),
  },
  // the iPod shuffle: a custom draft of songs; the iPod shuffles one of them
  songs: {
    title: 'My top 10 songs',
    pack: 'custom',
    picks: [
      { title: 'Babe I’m Gonna Leave You', sub: 'Led Zeppelin' },
      { title: 'Come Together', sub: 'The Beatles' },
      { title: 'Hammer to Fall', sub: 'Queen' },
      { title: 'Africa', sub: 'Toto' },
      { title: 'The Masterplan', sub: 'Oasis' },
      { title: 'I’ve Just Seen a Face', sub: 'The Beatles' },
      { title: 'Peace of Mind', sub: 'Boston' },
      { title: 'Counting Stars', sub: 'OneRepublic' },
      { title: 'Tom Sawyer', sub: 'Rush' },
      { title: 'How to Save a Life', sub: 'The Fray' },
    ],
  },
  // the football: PlayDraft's GOAT Athletes pack. Cooper Kupp, Von Miller,
  // Luke Kuechly, Alvin Kamara and Drue Tranquill are not in the pack's 483;
  // they take its Football category.
  goat: {
    title: 'My GOAT athletes',
    pack: 'goat-athletes',
    picks: [
      { title: 'Peyton Manning', cat: 'Football' },
      { title: 'Michael Jordan', cat: 'Basketball' },
      { title: 'Cooper Kupp', cat: 'Football' },
      { title: 'Von Miller', cat: 'Football' },
      { title: 'Scottie Pippen', cat: 'Basketball' },
      { title: 'Luke Kuechly', cat: 'Football' },
      { title: 'Alvin Kamara', cat: 'Football' },
      { title: 'Drue Tranquill', cat: 'Football' },
      { title: 'Tony Hawk', cat: 'Other', label: 'Skateboarding' },
      { title: 'Kevin McHale', cat: 'Basketball' },
    ],
  },
};
