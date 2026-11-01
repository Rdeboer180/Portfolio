// The archive set: seven first-edition cards for work from before the
// binder's case studies, dealt out on /about from the "By 2013" milestone.
// Same fields the binder's cards.js carries (build-cards.mjs), less the
// study, the back and the lock: an archive card opens nothing.
//
// Rows are attack slots: what the piece is, and a figure or medium for its
// damage. Every row describes what the artwork itself shows. Eras follow the
// résumé and the About page: the college-era jobs are "Before 2013", the
// Round 2 packaging and toy graphics are its 2013–14 designer role, and the
// Gremlins crest is the dynasty league the FAQ says has run about a decade.
// Ryan to confirm the eras and the Round 2 attribution before this ships.

export interface ArchiveStat {
  value: string;
  primary: string;
  secondary: string;
}

export interface ArchiveCard {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  hero: string;
  heroAlt: string;
  /** object-position x of the art in its 1.6 window, 0–1 */
  focus?: number;
  /** the card stock's hue and how much colour it takes; dark is the Darkness-type stock */
  theme: { h: number; s: number; tone?: 'dark' };
  stats: ArchiveStat[];
  year: string;
  category: string;
}

const art = (file: string) => `/images/archive/${file}`;

export const ARCHIVE_CARDS: ArchiveCard[] = [
  {
    slug: 'grand-lan',
    index: '01',
    title: 'Grand LAN',
    subtitle: 'Gaming center identity',
    hero: art('grand-lan.webp'),
    heroAlt: 'Three Grand LAN event flyers for Call of Duty Nights, Magic Weekdays and Mario Mondays, behind a stack of black business cards with the green chevron mark.',
    theme: { h: 82, s: 0.75, tone: 'dark' },
    stats: [
      { value: 'Mark', primary: 'Chevron monogram', secondary: 'A G and L folded into one roof' },
      { value: '3', primary: 'Event-night flyers', secondary: 'Call of Duty, Magic, Mario' },
      { value: 'Print', primary: 'Business cards', secondary: 'The mark on black stock' },
    ],
    year: 'Before 2013',
    category: 'Identity · Print',
  },
  {
    slug: 'fusion',
    index: '02',
    title: 'Fusion',
    subtitle: 'Supplement drink labels',
    hero: art('fusion.webp'),
    heroAlt: 'Fusion power supplement cans in teal, orange and magenta beside their flat label art with nutrition panels.',
    focus: 0.6,
    theme: { h: 292, s: 0.6 },
    stats: [
      { value: '3', primary: 'Flavor labels', secondary: 'Teal, orange and magenta' },
      { value: 'Mark', primary: 'Atom logo', secondary: 'One orbit per flavor color' },
      { value: 'Flats', primary: 'Print-ready wraps', secondary: 'Nutrition panel and barcode set' },
    ],
    year: 'Before 2013',
    category: 'Packaging',
  },
  {
    slug: 'vitamin-giant',
    index: '03',
    title: 'Vitamin Giant',
    subtitle: 'Supplement storefront',
    hero: art('vitamin-giant.webp'),
    heroAlt: 'Vitamin Giant ecommerce pages mounted on boards: a homepage with deal of the day and category tiles, and an Energy category page.',
    focus: 0.45,
    theme: { h: 200, s: 0.75 },
    stats: [
      { value: 'Home', primary: 'Storefront homepage', secondary: 'Promos, deal of the day, hot item' },
      { value: '12', primary: 'Category tiles', secondary: 'Browse by category' },
      { value: 'Grid', primary: 'Category page', secondary: 'Sort, paging and product cards' },
    ],
    year: 'Before 2013',
    category: 'Web · Ecommerce',
  },
  {
    slug: 'dc-lawncare',
    index: '04',
    title: 'DC Lawncare',
    subtitle: 'Local service brand',
    hero: art('dc-lawncare.webp'),
    heroAlt: 'DC Lawncare yard sign, door hanger and business cards, each with a DC monogram filled with grass.',
    focus: 0.4,
    theme: { h: 112, s: 0.55 },
    stats: [
      { value: 'Mark', primary: 'Grass-filled monogram', secondary: 'The lawn is the letterform' },
      { value: '4', primary: 'Print pieces', secondary: 'Yard sign, door hanger, card, coupon' },
      { value: '$5/$10', primary: 'Offer card', secondary: 'A mow or a full service' },
    ],
    year: 'Before 2013',
    category: 'Identity · Print',
  },
  {
    slug: 'baxter-building',
    index: '05',
    title: 'Baxter Building',
    subtitle: 'Fantastic Four playset box',
    hero: art('marvel-baxter-building.webp'),
    heroAlt: 'The Mighty World of Marvel Fantastic Four Baxter Building playset box: the four heroes in comic panels, the building cut away to its labelled floors, and The Thing shown at actual size.',
    focus: 0.5,
    theme: { h: 4, s: 0.85 },
    stats: [
      { value: 'Box', primary: 'Playset packaging', secondary: 'Comic panels and a cutaway' },
      { value: '4', primary: 'Character cards', secondary: 'The whole team, in classic art' },
      { value: '24″', primary: 'Building height', secondary: 'Three stories, working elevator' },
    ],
    year: '2013–14',
    category: 'Packaging',
  },
  {
    slug: 'veggietales-toys',
    index: '06',
    title: 'VeggieTales',
    subtitle: 'Wooden toy graphics',
    hero: art('veggietales-toys.webp'),
    heroAlt: 'Three VeggieTales wooden toys on wood plinths: an alphabet block wagon, a pull-along racer and a standing nativity scene.',
    focus: 0.5,
    theme: { h: 36, s: 0.6 },
    stats: [
      { value: '3', primary: 'Wooden toys', secondary: 'Block wagon, racer, nativity' },
      { value: 'Wood', primary: 'Printed graphics', secondary: 'Art laid straight onto the grain' },
      { value: 'A–Z', primary: 'Alphabet blocks', secondary: 'Letters, numbers and characters' },
    ],
    year: '2013–14',
    category: 'Product graphics',
  },
  {
    slug: 'grandville-gremlins',
    index: '07',
    title: 'Gremlins',
    subtitle: 'Fantasy league crest',
    hero: art('grandville-gremlins.webp'),
    heroAlt: 'The Grandville Gremlins crest, a horned black mask with orange eyes over brushed orange lettering, beside a black tee printed with it.',
    focus: 0.45,
    theme: { h: 22, s: 0.95, tone: 'dark' },
    stats: [
      { value: 'Crest', primary: 'League mark', secondary: 'Grandville Gremlins' },
      { value: 'Tee', primary: 'League shirt', secondary: 'The crest printed on black' },
      { value: '~10 yrs', primary: 'Dynasty league', secondary: 'A mascot and logo for every team' },
    ],
    year: 'A decade on',
    category: 'Identity · Apparel',
  },
];
