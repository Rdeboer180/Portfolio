// ============================================
// Talent tree: node glyphs
// Inner SVG markup on a 24 grid, hand-authored in the icon sheet
// (scratchpad icons-gen.mjs and tt-intro-tree-gen.mjs). Stroke-based; the
// only fills are the dots the source drew. The renderer wraps each entry in
// <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
// stroke-linecap="round" stroke-linejoin="round"> and sets size and color.
// Keys are the node glyph keys in trees.ts, the three roots, and "branch" for
// the hero chip and the homepage section badge. Do not redraw here; the sheet
// is the source.
// ============================================

export const GLYPHS: Record<string, string> = {
  // Craft tree
  typography: '<path d="M5 7V4h14v3M12 4v16M9 20h6"/>',
  'layout-grid':
    '<path d="M7 3H5a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 5 21h2M17 3h2a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 19 21h-2"/><rect x="8" y="7" width="8" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/>',
  'ui-design': '<rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="16" cy="12" r="2.5"/>',
  animation: '<path d="M3 12h4.5M16.5 12H21"/><path d="M12 7.5l4.5 4.5-4.5 4.5L7.5 12z"/>',
  'problem-framing':
    '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><circle cx="12" cy="12" r="2.2"/>',
  'ux-design':
    '<rect x="3" y="3" width="8" height="7" rx="1.5"/><rect x="13" y="14" width="8" height="7" rx="1.5"/><path d="M7 10v6.5a1 1 0 0 0 1 1h5"/>',
  research: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2L20 20"/>',
  'ab-testing':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14"/><path d="M14 12.5l1.8 1.8 3.2-3.2"/>',
  'hifi-prototyping': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 9l5.5 3-5.5 3z"/>',
  expo: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10.5 9.5l4.5 2.5-4.5 2.5z"/>',

  // Systems and build tree
  tokenization:
    '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5"/><rect x="14" y="14" width="6.5" height="6.5" rx="1.5"/>',
  'component-libraries':
    '<path d="M12 3.5l2.75 2.75L12 9 9.25 6.25z"/><path d="M6.25 9.25 9 12l-2.75 2.75L3.5 12z"/><path d="M17.75 9.25 20.5 12l-2.75 2.75L15 12z"/><path d="M12 15l2.75 2.75L12 20.5l-2.75-2.75z"/>',
  accessibility:
    '<path d="M3 12s3.5-6.5 9-6.5 9 6.5 9 6.5-3.5 6.5-9 6.5S3 12 3 12z"/><circle cx="12" cy="12" r="2.8"/>',
  'git-github':
    '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="7" r="2.2"/><path d="M6 7.2v9.6"/><path d="M18 9.2a9.8 9.8 0 0 1-9.8 9.8"/>',
  'html-css-sass': '<path d="M10 3L8 21M16 3l-2 18M4 9h17M3 15h17"/>',
  ship: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  'agentic-design':
    '<path d="M12 3.5c0 4.7 3.8 8.5 8.5 8.5-4.7 0-8.5 3.8-8.5 8.5 0-4.7-3.8-8.5-8.5-8.5 4.7 0 8.5-3.8 8.5-8.5z"/>',
  'agentic-coding':
    '<path d="M3 7l5 5-5 5"/><path d="M16 7c0 2.8 2.2 5 5 5-2.8 0-5 2.2-5 5 0-2.8-2.2-5-5-5 2.8 0 5-2.2 5-5z"/>',
  'information-architecture':
    '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/><path d="M12 8v4M5.5 16v-4h13v4M12 12v4"/>',
  'responsive-design':
    '<path d="M12 16H4.5A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4h13A1.5 1.5 0 0 1 19 5.5v1"/><rect x="15" y="10" width="6" height="11" rx="1.5"/>',

  // Core tree
  'cross-discipline': '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  'stakeholder-alignment':
    '<path d="M12 3v18"/><rect x="5" y="6.5" width="14" height="5" rx="1"/><rect x="8" y="12.5" width="8" height="5" rx="1"/>',
  communication:
    '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-5 4v-4h-.5A1.5 1.5 0 0 1 3 14.5z"/>',
  documentation:
    '<path d="M19 3H7.5A2.5 2.5 0 0 0 5 5.5v13a2.5 2.5 0 0 1 2.5-2.5H19V3z"/><path d="M5 18.5A2.5 2.5 0 0 0 7.5 21H19v-5"/>',
  mentoring:
    '<circle cx="9" cy="8" r="3.5"/><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3a4.5 4.5 0 0 1 4.5 4.5V20"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14.3a4.5 4.5 0 0 1 3 4.2V20"/>',
  'design-advocacy':
    '<path d="M3 10v4a1 1 0 0 0 1 1h3.5l8.5 5V4L7.5 9H4a1 1 0 0 0-1 1z"/><path d="M19.5 9.5a3.5 3.5 0 0 1 0 5"/>',
  'problem-solving':
    '<path d="M9 18v-1.5c0-1.3-.8-2-1.6-2.9A6 6 0 1 1 16.6 13.6c-.8.9-1.6 1.6-1.6 2.9V18"/><path d="M9 18h6M10 21h4"/><path d="M9.6 10.2l1.7 1.7 3.2-3.2"/>',
  decision: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M9.5 12l1.8 1.8 3.4-3.4"/>',
  sliders:
    '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
  leadership: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',

  // Roots
  'visual-craft': '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><path d="M13.5 7.5l3 3"/>',
  build: '<path d="M12 4.9l7.1 7.1-3.1 3.1-7.1-7.1z"/><path d="M12.4 11.6L3.5 20.5"/>',
  judgment: '<path d="M12 3.5v17M8.5 20.5h7M5.5 7h13"/><path d="M5.5 7 3 13h5z"/><path d="M18.5 7 16 13h5z"/>',

  // The branch mark: hero inspector chip and the section 05 badge (ChipC, Section05).
  branch:
    '<circle cx="12" cy="18.6" r="2.2"/><path d="M12 16.4V11.6M12 11.6L6.6 6.8M12 11.6L17.4 6.8"/><circle cx="5.6" cy="5.6" r="2.2" fill="currentColor"/><circle cx="18.4" cy="5.6" r="2.2" fill="currentColor"/>',
};

/** Glyph markup for a key, or the branch mark when the key is unknown. */
export function glyph(key: string): string {
  return GLYPHS[key] || GLYPHS.branch;
}
