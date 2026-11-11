// ============================================
// Where a talent came from: the schooling, jobs, projects and tools that put
// points into it, for the homepage's talent cards. Each source is a label
// under 20 characters and a short tag (a year, a count, or what kind of
// source it is), read top to bottom, oldest first where there is a year.
//
// Drafted 10 Nov 2026 from the repo's own record, for Ryan to confirm:
// the About progression (Kendall BFA with a Web Animation minor, Tire Rack
// from 2014), the archive cards (Round 2, 2013–14), projects.ts years,
// RYAN_NODE_PROOF and RYAN_NODE_NOTES (ryan.ts), the binder cards (PlayDraft's
// 37 components) and the homepage capability tools. Nothing here is new
// fact; if a source changes there, change it here. Links (canvas N6) follow
// RYAN_NODE_PROOF and the homepage's old capability links; a source with no
// page of its own stays plain. provenance.test.ts keeps every label under 20
// characters, every id a real talent, and every link a real page.
// ============================================

export interface TalentSource {
  /** Under 20 characters. */
  label: string;
  /** A year, a count, or the kind of source: short. */
  tag: string;
  /** The study, note or demo a visitor can open for this source, when there is one. */
  to?: string;
}

export const TALENT_SOURCES: Record<string, TalentSource[]> = {
  typography: [
    { label: 'Kendall BFA', tag: '2013' },
    { label: 'Round 2 designer', tag: '2013' },
    { label: 'Heatherwood brand', tag: '2025', to: '/work/heatherwood/' },
    { label: 'T1D Hub type system', tag: '2026', to: '/work/bolus-binder/' },
  ],
  tokens: [
    { label: 'WheelRack tokens', tag: '200+', to: '/work/wheelrack/' },
    { label: 'Tokens Studio', tag: 'tool' },
    { label: 'Figma Variables', tag: 'tool' },
  ],
  accessibility: [
    { label: 'Tire category chart', tag: '2024', to: '/work/tire-categories/' },
    { label: 'A11y annotations', tag: 'specs' },
  ],
  components: [
    { label: 'WheelRack library', tag: '50+', to: '/work/wheelrack/' },
    { label: 'AEM core variants', tag: '2024', to: '/work/aem-component-system/' },
    { label: 'PlayDraft library', tag: '37', to: '/work/playdraft/' },
  ],
  figma: [
    { label: 'Figma starter kit', tag: '2026', to: '/work/figma-template-governance/' },
    { label: 'Three Figma plugins', tag: '2026' },
    { label: 'Figma MCP', tag: 'tool' },
  ],
  prototyping: [
    { label: 'WheelRack fitment', tag: 'note', to: '/notes/prototyping-wheelrack-fitment/' },
    { label: 'PlayDraft prototype', tag: 'note', to: '/notes/playdraft-pick-on-the-clock/' },
    { label: 'Tire fitment demo', tag: '2026', to: '/demo/tire-fitment/' },
  ],
  storybook: [
    { label: 'WheelRack Storybook', tag: '50+', to: '/work/wheelrack/' },
  ],
  'skills-and-plugins': [
    { label: 'Title card plugin', tag: 'Figma', to: '/work/figma-template-governance/' },
    { label: 'Layer Cleanup', tag: 'Figma' },
    { label: 'Design-system skill', tag: 'PR' },
  ],
  html: [
    { label: 'Web Animation minor', tag: '2013' },
    { label: 'Into the browser', tag: '2014' },
    { label: 'AEM authoring', tag: '12+ yrs', to: '/work/aem-component-system/' },
    { label: 'Heatherwood site', tag: '2025', to: '/work/heatherwood/' },
  ],
  git: [
    { label: 'My own repos', tag: '12 yrs' },
    { label: 'Weekly PRs', tag: 'Tire Rack' },
  ],
  react: [
    { label: 'WheelRack codebase', tag: '2023', to: '/work/wheelrack/' },
    { label: 'Built with Cheryl', tag: 'partner' },
  ],
  typescript: [
    { label: 'Agents write it', tag: 'directed' },
    { label: 'I read the output', tag: 'review' },
    { label: 'PlayDraft app', tag: '2026', to: '/work/playdraft/' },
  ],
};
