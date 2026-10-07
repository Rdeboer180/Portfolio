export interface Coin {
  icon: string;  // file in /images/proficiencies/
  name: string;  // tooltip only — coins are decorative to AT
  x: number;     // left, % of tray width
  rot: number;   // resting rotation, deg
  lift: number;  // px raised off the tray floor (overlap)
  z: number;
}

interface PlaygroundCard {
  slug: string;
  coins: Coin[];
}

export const CARDS: PlaygroundCard[] = [
  {
    slug: 'wheelrack',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 6, rot: -9, lift: 0, z: 2 },
      { icon: 'vscode.svg', name: 'VS Code', x: 22, rot: 7, lift: 3, z: 3 },
      { icon: 'github.svg', name: 'GitHub', x: 41, rot: -14, lift: 0, z: 1 },
      { icon: 'workfront.svg', name: 'Workfront', x: 57, rot: 11, lift: 5, z: 2 },
      { icon: 'slack.svg', name: 'Slack', x: 75, rot: -6, lift: 0, z: 1 },],
  },
  {
    slug: 'aem-component-system',
    coins: [{ icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 8, rot: -8, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 26, rot: 11, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 45, rot: -6, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 62, rot: 8, lift: 4, z: 2 },
      { icon: 'workfront.svg', name: 'Workfront', x: 79, rot: -12, lift: 0, z: 1 },],
  },
  {
    slug: 'playdraft',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: -10, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 26, rot: 9, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 45, rot: -6, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 63, rot: 11, lift: 2, z: 2 },],
  },
  {
    slug: 'figma-template-governance',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: -9, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 32, rot: 10, lift: 3, z: 3 },
      { icon: 'workfront.svg', name: 'Workfront', x: 57, rot: -6, lift: 0, z: 1 }],
  },
  {
    slug: 'design-enablement',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 7, rot: 10, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 24, rot: -7, lift: 4, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 43, rot: 6, lift: 0, z: 1 },
      { icon: 'workfront.svg', name: 'Workfront', x: 59, rot: -12, lift: 2, z: 2 },
      { icon: 'github.svg', name: 'GitHub', x: 76, rot: 8, lift: 0, z: 1 },],
  },
  {
    slug: 'loopstack',
    coins: [{ icon: 'claude.svg', name: 'Claude', x: 7, rot: -11, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 24, rot: 8, lift: 4, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 43, rot: -5, lift: 0, z: 1 },
      { icon: 'github.svg', name: 'GitHub', x: 59, rot: 13, lift: 2, z: 2 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 76, rot: -9, lift: 0, z: 1 },],
  },
  {
    slug: 'tire-categories',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: 12, lift: 0, z: 1 },
      { icon: 'illustrator.svg', name: 'Adobe Illustrator', x: 25, rot: -8, lift: 4, z: 3 },
      { icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 44, rot: 6, lift: 0, z: 2 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 60, rot: -12, lift: 2, z: 1 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 77, rot: 9, lift: 0, z: 2 },],
  },
  {
    slug: 'bolus-binder',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: -10, lift: 0, z: 2 },
      { icon: 'claude.svg', name: 'Claude', x: 32, rot: 9, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 57, rot: -6, lift: 0, z: 2 }],
  },
  {
    slug: 'seasonal-content-system',
    coins: [{ icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 8, rot: -10, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 27, rot: 8, lift: 3, z: 3 },
      { icon: 'photoshop.svg', name: 'Photoshop', x: 47, rot: -7, lift: 0, z: 1 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 66, rot: 12, lift: 2, z: 2 },],
  },
  {
    slug: 'overscroll-tactics',
    coins: [{ icon: 'illustrator.svg', name: 'Illustrator', x: 7, rot: -9, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 25, rot: 8, lift: 4, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 43, rot: -6, lift: 0, z: 1 },
      { icon: 'claude.svg', name: 'Claude', x: 60, rot: 12, lift: 2, z: 2 },
      { icon: 'github.svg', name: 'GitHub', x: 77, rot: -8, lift: 0, z: 1 },],
  },
  {
    slug: 'heatherwood',
    coins: [{ icon: 'figma-dark.svg', name: 'Figma', x: 9, rot: 10, lift: 0, z: 1 },
      { icon: 'illustrator.svg', name: 'Adobe Illustrator', x: 28, rot: -9, lift: 4, z: 3 },
      { icon: 'photoshop.svg', name: 'Photoshop', x: 48, rot: 6, lift: 0, z: 2 },
      { icon: 'vscode.svg', name: 'VS Code', x: 67, rot: -12, lift: 2, z: 1 },],
  },
  {
    slug: 'landing-pages',
    coins: [{ icon: 'experience-manager.svg', name: 'Adobe Experience Manager', x: 7, rot: 9, lift: 0, z: 2 },
      { icon: 'figma-dark.svg', name: 'Figma', x: 25, rot: -11, lift: 3, z: 3 },
      { icon: 'vscode.svg', name: 'VS Code', x: 44, rot: 7, lift: 0, z: 1 },
      { icon: 'openai-chatgpt.svg', name: 'ChatGPT', x: 61, rot: -6, lift: 4, z: 2 },
      { icon: 'adobe-analytics.svg', name: 'Adobe Analytics', x: 78, rot: 10, lift: 0, z: 1 },],
  },
];

export type CoinPhase = 'idle' | 'in' | 'out';

export const coinVariants = {
  idle: (c: Coin) => ({
    y: -130,
    x: 0,
    rotate: c.rot * 2.4,
    opacity: 0,
    transition: { duration: 0 },
  }),
  in: (c: Coin) => ({
    y: 0,
    x: 0,
    rotate: c.rot,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 22,
      mass: 0.9,
      delay: c.x * 0.005, // land left → right
      opacity: { duration: 0.15, delay: c.x * 0.005 },
    },
  }),
  out: (c: Coin) => ({
    y: 170,
    rotate: c.rot * 2,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeIn' as const,
      delay: c.lift * 0.03 + c.x * 0.002, // loose, uneven tumble
      opacity: { duration: 0.16, delay: 0.3 + c.x * 0.002 },
    },
  }),
};

// Reduced motion: opacity-only, coins stay in their resting pose
export const coinVariantsReduced = {
  idle: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 0, transition: { duration: 0 } }),
  in: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 1, transition: { duration: 0.2 } }),
  out: (c: Coin) => ({ y: 0, x: 0, rotate: c.rot, opacity: 0, transition: { duration: 0.2 } }),
};
