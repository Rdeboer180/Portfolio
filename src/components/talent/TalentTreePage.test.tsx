// The Forge, rendered on the canvas (board 25: all three lanes through the
// Layers panel, plus Abilities, with the Design / Dev toggle).
// Run: CI=true npx react-scripts test --watchAll=false src/components/talent
// (jest, for the DOM: the vitest in use has no jsdom of its own.)
//
// Guards the contracts the page is built around: it is Ryan's tree only and
// read only (no builder, no intake, nothing written to the URL); it opens on
// his story and the Technical lane in Design mode (what the prerender
// serialises and a crawler reads); the Layers panel switches lanes and the
// toggle switches the right panel; picking a skill reads it; and on a phone
// each lane is a list with a sheet per skill.

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TalentTreePage from '../TalentTreePage';
import { RYAN_OVERRIDES } from '../../data/talent/ryan';
import { STORY } from './ForgeCanvas';

let phone = false;

beforeAll(() => {
  class IO {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  window.matchMedia = ((q: string) => ({
    matches: q.includes('max-width: 767px') ? phone : false,
    media: q, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  phone = false;
  window.history.replaceState(null, '', '/');
});

function mount() {
  return render(
    <MemoryRouter initialEntries={['/talent-tree/']}>
      <Routes>
        <Route path="/talent-tree" element={<TalentTreePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const nodeButton = (name: RegExp) => screen.getByRole('button', { name });
const tab = (name: RegExp) => screen.getByRole('tab', { name });

describe('the Forge, /talent-tree/', () => {
  it("opens on Ryan's story, then the Technical lane in Design mode", () => {
    mount();
    expect(screen.getByRole('heading', { level: 1, name: 'My talent tree' })).toBeTruthy();
    expect(screen.getByText(STORY)).toBeTruthy();
    // The class reads as one line; its first half links to the note behind the title.
    expect(screen.getByText((_, el) => el?.textContent === 'Visual Problem Solver / Context Carrier' && !!el.querySelector('a'))).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Visual Problem Solver' })[0].getAttribute('href')).toBe('/notes/visual-problem-solver/');
    expect(screen.getByText('Level 16 · 89 points over sixteen years · six skills at 5 · 4 of 12 abilities')).toBeTruthy();

    expect(screen.getByRole('heading', { level: 2, name: 'How I connect the work' })).toBeTruthy();
    expect(screen.getByText('Pick a skill to read what a point here means.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Design' }).getAttribute('aria-pressed')).toBe('true');

    // The Layers panel: three lanes and the abilities, Technical selected.
    const tabs = within(screen.getByRole('tablist', { name: 'Layers' })).getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Design and systems33', 'Technical37', 'Code19', 'Abilities4/12']);
    expect(tab(/^Technical/).getAttribute('aria-selected')).toBe('true');

    // Ten skills and the root; the strongest is open in words.
    expect(screen.getAllByRole('button', { name: /, (foundation|crown), \d of 5 points$/ }).length).toBe(10);
    expect(screen.getByText('Workflow')).toBeTruthy();
    const note = screen.getByLabelText('Skill');
    expect(within(note).getByRole('heading', { level: 3, name: 'Figma' })).toBeTruthy();
    expect(within(note).getByText('Visual Problem Solver')).toBeTruthy();

    // The gutter props: the class card and Ryan's own next quest.
    expect(document.querySelector('.fc-classcard__name a')?.textContent).toBe('Visual Problem Solver');
    expect(screen.getByText(RYAN_OVERRIDES.quest)).toBeTruthy();

    // The playground, without a password. No builder, no state in the URL.
    expect(screen.getByRole('link', { name: /Open the playground/ }).getAttribute('href')).toBe('https://www.rdeboerdesigns.com/lab/playground/');
    expect(screen.queryByText(/build your own/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Add a point/ })).toBeNull();
    expect(window.location.hash).toBe('');
  });

  it('switches lanes from the Layers panel, by click and by arrow key', () => {
    mount();
    fireEvent.click(tab(/^Design and systems/));
    expect(screen.getByRole('heading', { level: 2, name: 'What I define' })).toBeTruthy();
    expect(nodeButton(/^Typography, foundation, 5 of 5 points$/)).toBeTruthy();
    expect(screen.getByText('Forge / Design')).toBeTruthy();

    fireEvent.keyDown(tab(/^Design and systems/), { key: 'ArrowDown' });
    expect(screen.getByRole('heading', { level: 2, name: 'How I connect the work' })).toBeTruthy();

    fireEvent.click(tab(/^Code/));
    expect(screen.getByRole('heading', { level: 2, name: 'What I can express in the medium' })).toBeTruthy();
    expect(nodeButton(/^HTML, foundation, 5 of 5 points$/)).toBeTruthy();

    fireEvent.click(tab(/^Abilities/));
    expect(screen.getByRole('heading', { level: 2, name: 'What the points unlock' })).toBeTruthy();
    const rows = within(screen.getByRole('list', { name: 'Abilities' })).getAllByRole('button');
    expect(rows.length).toBe(12);
    expect(rows.filter((r) => r.textContent!.endsWith('forged')).length).toBe(4);
    expect(rows[0].textContent).toContain('Visual Problem Solver');
    expect(within(screen.getByLabelText('Recipe')).getByText('5 / 5 ✓')).toBeTruthy();
    fireEvent.click(rows[7]);
    expect(screen.getByRole('heading', { level: 3, name: 'Design Diplomat' })).toBeTruthy();
    expect(screen.getByText('1 point away')).toBeTruthy();
  });

  it('reads a picked skill, never spends it, and toggles Dev for the data behind it', () => {
    mount();
    fireEvent.click(nodeButton(/^Internal tools, crown/));
    expect(nodeButton(/^Internal tools, crown, 4 of 5 points$/).getAttribute('aria-pressed')).toBe('true');
    const note = screen.getByLabelText('Skill');
    expect(within(note).getByRole('heading', { level: 3, name: 'Internal tools' })).toBeTruthy();
    expect(within(note).getByText('4 of 5 · crown over AI tools')).toBeTruthy();
    expect(within(note).getByText('Agent Wrangler')).toBeTruthy();
    expect(document.querySelectorAll('.fc-wire.is-chain').length).toBe(2);
    expect(screen.queryByText('internal-tools')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Dev' }));
    const inspect = screen.getByLabelText('Inspect');
    expect(within(inspect).getByText('internal-tools')).toBeTruthy();
    expect(within(inspect).getByText('4 · new in v7')).toBeTruthy();
    expect(within(inspect).getByText('// Agent Wrangler · met')).toBeTruthy();
    expect(within(inspect).getByText("+ 'internal-tools': 4,")).toBeTruthy();
    expect(within(inspect).getByText("− 'agent-context': 1,")).toBeTruthy();
    expect(screen.getByText('Dev mode: ids, gates, and the data behind every number.')).toBeTruthy();
    expect(nodeButton(/^Internal tools, crown, 4 of 5 points$/)).toBeTruthy();
  });
});

describe('the code lane, in Ryan\'s words', () => {
  it('marks TypeScript and React Native as agent-built and explains them on hover', () => {
    mount();
    fireEvent.click(tab(/^Code/));
    const ts = nodeButton(/^TypeScript, foundation, 3 of 5 points, agent-built$/);
    expect(nodeButton(/^React Native, foundation, 3 of 5 points, agent-built$/)).toBeTruthy();
    expect(nodeButton(/^React, crown, 1 of 5 points$/)).toBeTruthy();
    expect(screen.getAllByText('agent-built').length).toBe(2);

    // Hover reads the skill in the panel; leaving goes back to the pick.
    fireEvent.mouseEnter(ts);
    const note = screen.getByLabelText('Skill');
    expect(within(note).getByRole('heading', { level: 3, name: 'TypeScript' })).toBeTruthy();
    expect(within(note).getByText('Agents write the TypeScript while I direct them, and I have learned to read the output.')).toBeTruthy();
    fireEvent.mouseLeave(ts);
    expect(within(screen.getByLabelText('Skill')).getByRole('heading', { level: 3, name: 'HTML' })).toBeTruthy();

    fireEvent.mouseEnter(nodeButton(/^React, crown/));
    expect(screen.getByText(/React was the foundation of WheelRack/)).toBeTruthy();
  });
});

describe('the phone', () => {
  it('shows the Design / Dev toggle in the list itself, not only in the sheet', () => {
    phone = true;
    mount();
    expect(screen.getByText('Pick a skill to read what a point here means.')).toBeTruthy();
    expect(screen.queryByText('internal-tools')).toBeNull();
    expect(screen.queryByLabelText('ryan.ts diff')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Dev' }));
    expect(screen.getByText('Dev mode: ids, gates, and the data behind every number.')).toBeTruthy();
    expect(screen.getByText('internal-tools')).toBeTruthy();
    expect(screen.getByText('crown · gate ai-tools ≥ 3')).toBeTruthy();
    expect(within(screen.getByLabelText('ryan.ts diff')).getByText("+ 'internal-tools': 4,")).toBeTruthy();
  });

  it('lists a lane, opens a skill in a sheet, and closes on Escape with focus returned', async () => {
    phone = true;
    mount();
    expect(screen.getByRole('heading', { level: 1, name: 'My talent tree' })).toBeTruthy();
    // The class reads as one line; its first half links to the note behind the title.
    expect(screen.getByText((_, el) => el?.textContent === 'Visual Problem Solver / Context Carrier' && !!el.querySelector('a'))).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Visual Problem Solver' })[0].getAttribute('href')).toBe('/notes/visual-problem-solver/');
    expect(screen.queryByText(/build your own/i)).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /^Design/ }));
    const tokens = () => nodeButton(/^Tokens, foundation, 5 of 5 points$/);
    fireEvent.click(tokens());
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('aria-label')).toBe('Tokens');
    expect(within(dialog).getByRole('heading', { level: 3, name: 'Tokens' })).toBeTruthy();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(tokens()).toHaveFocus();
  });
});
