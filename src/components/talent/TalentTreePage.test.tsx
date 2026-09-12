// The talent tree's two routes, rendered.
// Run: CI=true npx react-scripts test --watchAll=false src/components/talent
// (jest, for the DOM: the vitest in use has no jsdom of its own.)
//
// Guards the contracts the console is built around: the front door's first
// render is Ryan's tree with the summary sheet filled (what the prerender
// serialises and a crawler reads); the build route's first render is the empty intake
// with the trees dormant; the spending rules the page enforces through
// economy.ts (a point per click, the crown locked until its foundation holds
// three, removal by shift-click and Backspace); the sheet on a phone; and
// the share state's round trip through the hash, with the older ?t= form
// still decoded.

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TalentTreePage from '../TalentTreePage';
import { RYAN_ALLOCATION, RYAN_CLASS_LABEL, RYAN_INTAKE } from '../../data/talent/ryan';
import { encodeState } from '../../data/talent/score';
import { receiptText } from './consoleData';
import { placeCard } from './TalentInspector';
import { ARCHETYPES } from '../../data/talent/archetypes';
import { buildResult } from '../../data/talent/score';
import { TREES } from '../../data/talent/trees';

let phone = false;
let desktop = true;

beforeAll(() => {
  // jsdom has neither; useReveal and the scroll helpers expect both.
  class IO {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  window.matchMedia = ((q: string) => ({
    matches: q.includes('max-width: 767px') ? phone : q.includes('min-width: 1024px') ? desktop : false,
    media: q, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  phone = false;
  desktop = true;
  window.history.replaceState(null, '', '/');
});

function mount(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/talent-tree" element={<TalentTreePage mode="ryan" />} />
        <Route path="/talent-tree/build" element={<TalentTreePage mode="build" />} />
      </Routes>
    </MemoryRouter>,
  );
}

const nodeButton = (name: RegExp) => screen.getByRole('button', { name });

/** Answer the three questions with Ryan's answers, so the trees power up. */
function answerIntake(years = 16) {
  fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'bachelors' } });
  fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: String(years) } });
  fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
}

describe('the front door, /talent-tree/', () => {
  it('renders Ryan by default: story, rails, thirty nodes, the closing rail, the summary sheet', () => {
    mount('/talent-tree/');
    expect(screen.getByRole('heading', { level: 1, name: "Ryan's tree" })).toBeTruthy();
    expect(screen.getByText('Level 16 Designer · 63 craft · 21 core')).toBeTruthy();
    expect(screen.getByText(RYAN_CLASS_LABEL, { selector: '.tt-story__class' })).toBeTruthy();
    expect(screen.getByText(/I've never been sure what to call myself\./)).toBeTruthy();
    expect(screen.getByText('84 / 84')).toBeTruthy();
    expect(screen.getByText('spent · 0 unspent')).toBeTruthy();

    // Thirty nodes, each a button with its meaning as the description.
    const nodes = screen.getAllByRole('button', { name: /, (foundation|crown), \d of 5 points/ });
    expect(nodes.length).toBe(30);
    nodes.forEach((n) => expect(n).toHaveAccessibleDescription(/Time spent/));
    expect(nodeButton(/^Typography and hierarchy, foundation, 5 of 5 points$/)).toBeTruthy();

    // No intake, no spending controls, no state written to the URL.
    expect(screen.queryByLabelText('Degree')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Reset/ })).toBeNull();
    expect(window.location.hash).toBe('');

    // The console ends after the legend; the summary is on the sheet, every word in the static HTML.
    expect(screen.getByText('End of the trees')).toBeTruthy();
    expect(screen.getByText('· 30 nodes · 84 / 84 spent', { exact: false })).toBeTruthy();
    expect(screen.getByText('Points in the node, always on')).toBeTruthy();
    const sheet = screen.getByRole('region', { name: 'Summary' });
    expect(within(sheet).getByText('Summary · computed from 84 points')).toBeTruthy();
    expect(within(sheet).getByText('seven masteries · two archetypes · four stats · nothing hand-set')).toBeTruthy();
    expect(within(sheet).getByText('7 of 30 nodes')).toBeTruthy();
    expect(within(sheet).getByText(/six foundations and one crown · earned by time, not self-rated/)).toBeTruthy();
    expect(within(sheet).getAllByText(/foundation|crown/, { selector: '.tt-masteries__meta' }).length).toBe(7);
    expect(within(sheet).getByText('Ryan DeBoer', { selector: '.tt-card__name' })).toBeTruthy();
    expect(within(sheet).getByText('Designs systems that continue working when he leaves the room.')).toBeTruthy();
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();

    // The crossover and the sheet's foot are plain links.
    const build = screen.getAllByRole('link', { name: /Build your own/ });
    expect(build.length).toBe(2);
    build.forEach((a) => expect(a.getAttribute('href')).toBe('/talent-tree/build/'));
  });

  it('floats a card beside a hovered node, with its level, gate in words, and the trait it feeds', () => {
    mount('/talent-tree/');
    expect(screen.getByText('Hover a node for its meaning and gate · the card sits on the node')).toBeTruthy();
    fireEvent.mouseEnter(nodeButton(/^Production ownership, crown/));
    const card = screen.getByTestId('tt-nodecard');
    expect(card.getAttribute('aria-hidden')).toBe('true');
    expect(within(card).getByText('Production ownership')).toBeTruthy();
    expect(within(card).getByText('2 / 5')).toBeTruthy();
    expect(card).toHaveTextContent('2 / 5 · crown · Systems');
    expect(card).toHaveTextContent('Unlocked at foundation 3 · foundation holds 5 · feeds Build');
    expect(card.querySelectorAll('.tt-nodecard__dot.is-on').length).toBe(2);
    // jsdom has no layout: every box is zero, so neither side fits and the card drops below.
    expect(card).toHaveClass('tt-nodecard--below');
    expect(within(card).queryByRole('button')).toBeNull();
    fireEvent.mouseLeave(nodeButton(/^Production ownership, crown/));
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();
  });

  it('places the card right of the node, flips left at the console edge, drops below when neither fits', () => {
    const rect = (left: number, top: number, width: number, height: number) => ({ left, top, width, height } as DOMRect);
    const host = rect(0, 0, 1392, 752);
    // A node centred at (300, 400): the card's left edge 34px from the centre, its caret level with it.
    expect(placeCard(rect(278, 378, 44, 44), host)).toEqual({ left: 334, top: 384, place: 'right' });
    // Near the right edge: the same 34px, to the left.
    expect(placeCard(rect(1300, 378, 44, 44), host)).toEqual({ left: 1322 - 34 - 280, top: 384, place: 'left' });
    // A narrow host where neither side fits: centred below, 34px under the centre, kept inside the edges.
    expect(placeCard(rect(150, 378, 44, 44), rect(0, 0, 400, 752))).toEqual({ left: 32, top: 434, place: 'below' });
  });

  it('never mounts the card below 1024', () => {
    desktop = false;
    mount('/talent-tree/');
    fireEvent.mouseEnter(nodeButton(/^Production ownership, crown/));
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();
  });

  it('sends an older ?t= link to the build route in the hash form', async () => {
    const own = 'bgn10d70.5.531000000000000000000000000000.Ada%20Lovelace';
    window.history.replaceState(null, '', `/talent-tree/?t=${own}`);
    mount('/talent-tree/');
    expect(await screen.findByRole('heading', { level: 1, name: 'Build your talent tree' })).toBeTruthy();
    expect(await screen.findByText('Ada Lovelace', { selector: '.tt-card__name' })).toBeTruthy();
  });
});

describe('the build route, /talent-tree/build/', () => {
  it('renders the empty intake with the trees dormant, then powers up on the third answer', () => {
    mount('/talent-tree/build/');
    expect(screen.getByRole('heading', { level: 1, name: 'Build your talent tree' })).toBeTruthy();
    expect(screen.getByText('Three of three to answer · the trees power up on the third')).toBeTruthy();
    expect(screen.getByText('Unspent · after the intake')).toBeTruthy();
    const consoleEl = () => screen.getByRole('region', { name: 'Build your talent tree' });
    const chips = () => within(screen.getByRole('list', { name: 'Receipt' })).queryAllByRole('listitem');
    expect(consoleEl()).toHaveClass('is-dormant');
    expect(chips().length).toBe(0);
    expect(screen.getByText('Your summary assembles when the last point lands')).toBeTruthy();
    expect(screen.queryByText('Ryan DeBoer', { selector: '.tt-card__name' })).toBeNull();

    const foundation = () => nodeButton(/^Typography and hierarchy, foundation/);
    expect(foundation().getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(foundation());
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);

    // Degree, then major and minor appear; the receipt prints as answers land.
    fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'bachelors' } });
    expect(screen.getByText('+16 craft, locked · Bachelor\'s, graphic design')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Minor'), { target: { value: 'web' } });
    expect(screen.getByText('+4 systems, locked · minor, web')).toBeTruthy();
    expect(screen.getByText('Two of three to answer · the trees power up on the third')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: '16' } });
    expect(screen.getByText('+38 · 16 years')).toBeTruthy();
    expect(screen.getByText('+21 core')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
    expect(screen.getByText('+5 · 200+ hours')).toBeTruthy();
    expect(chips().length).toBe(5);
    expect(consoleEl()).toHaveClass('is-live');
    expect(screen.getByText('The panel is live.')).toBeTruthy();

    // The tally and the unspent counters are computed from the answers.
    expect(screen.getByText('63', { selector: '.tt-intake__big' })).toBeTruthy();
    expect(screen.getByText('21', { selector: '.tt-intake__big' })).toBeTruthy();
    expect(screen.getByText('Level 16', { selector: '.tt-intake__level' })).toBeTruthy();
    const pools = screen.getByRole('status', { name: 'Points' });
    expect(pools).toHaveTextContent('Unspent63craft');
    expect(pools).toHaveTextContent('16 craft · 4 systems');
    expect(foundation().getAttribute('aria-disabled')).toBeNull();
    expect(screen.queryByText('Your summary assembles when the last point lands')).toBeNull();
    expect(screen.getByText('Five points in one node is a mastery. The first one prints here.')).toBeTruthy();
  });

  it('spends, locks the crown until the foundation holds 3, removes on shift-click and Backspace, and resets', () => {
    mount('/talent-tree/build/');
    answerIntake();

    const foundation = () => nodeButton(/^Typography and hierarchy, foundation/);
    const crown = () => nodeButton(/^Composition, brand, and polish, crown/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');
    expect(crown().getAttribute('aria-label')).toMatch(/locked until Typography and hierarchy holds 3/);

    fireEvent.click(crown());
    expect(crown().getAttribute('aria-label')).toMatch(/0 of 5/);

    fireEvent.click(foundation());
    fireEvent.click(foundation());
    expect(foundation().getAttribute('aria-label')).toMatch(/2 of 5/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(foundation());
    expect(crown().getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(crown());
    expect(crown().getAttribute('aria-label')).toMatch(/1 of 5/);

    // The rails count the spend: the tree header, and the node card's minus and plus.
    expect(screen.getByText('Root Visual craft · 4 spent · 0 mastered · 12 locked here')).toBeTruthy();
    fireEvent.mouseEnter(crown());
    fireEvent.click(screen.getByRole('button', { name: 'Add a point to Composition, brand, and polish', hidden: true }));
    expect(crown().getAttribute('aria-label')).toMatch(/2 of 5/);
    fireEvent.click(screen.getByRole('button', { name: 'Remove a point from Composition, brand, and polish', hidden: true }));
    expect(crown().getAttribute('aria-label')).toMatch(/1 of 5/);

    fireEvent.click(foundation(), { shiftKey: true });
    expect(foundation().getAttribute('aria-label')).toMatch(/2 of 5/);
    // Dropping under 3 refunds the crown and relocks it.
    expect(crown().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');

    fireEvent.keyDown(foundation(), { key: 'Backspace' });
    expect(foundation().getAttribute('aria-label')).toMatch(/1 of 5/);

    // Mastery: five points, the tag, the row on the sheet.
    for (let i = 0; i < 4; i += 1) fireEvent.click(foundation());
    expect(foundation().getAttribute('aria-label')).toMatch(/5 of 5/);
    expect(screen.getByText('one mastery')).toBeTruthy();
    expect(screen.getByText('1 of 30 nodes')).toBeTruthy();
    expect(screen.getByText('Typography and hierarchy', { selector: '.tt-masteries__name' })).toBeTruthy();

    // Reset tree, free and never confirmed; then the state in the hash goes with it.
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset tree' })[0]);
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(screen.getByText('Five points in one node is a mastery. The first one prints here.')).toBeTruthy();
  });

  it('assembles the card on Finish with points left, with the share actions and a copyable receipt', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    mount('/talent-tree/build/');
    answerIntake();
    fireEvent.click(nodeButton(/^Tokens and variables, foundation/));
    expect(screen.queryByText('Level 16 Designer', { selector: '.tt-card__level' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Finish with points left' }));
    const card = screen.getByRole('region', { name: 'Summary' });
    expect(within(card).getByText('Level 16 Designer', { selector: '.tt-card__level' })).toBeTruthy();
    expect(within(card).getByText('Save as image', { selector: '.tt-primary' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada Lovelace' } });
    expect(within(card).getByText('Ada Lovelace', { selector: '.tt-card__name' })).toBeTruthy();
    expect(screen.queryByText('Designs systems that continue working when he leaves the room.')).toBeNull();

    // The receipt: the class line and three rows of marks.
    fireEvent.click(screen.getByRole('button', { name: 'Copy receipt' }));
    expect(await screen.findByText('Receipt copied')).toBeTruthy();
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0] as string;
    expect(text.split('\n')[0]).toBe('Ada Lovelace · Level 16 Designer');
    expect(text).toMatch(/Systems and build {2}◐○○○○○○○○○ {2}1 · 0 mastered/);
    expect(text).toContain('/talent-tree/build/#s=');

    // Copy link carries the same state as the hash.
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(await screen.findByText('Link copied')).toBeTruthy();
    const link = writeText.mock.calls[1][0] as string;
    expect(link.endsWith(window.location.hash)).toBe(true);
    expect(window.location.hash.startsWith('#s=')).toBe(true);
  });

  it('decodes a shared state from the hash after mount, and a ?t= link is moved to the hash', async () => {
    const shared = encodeState(RYAN_INTAKE, RYAN_ALLOCATION);
    window.history.replaceState(null, '', `/talent-tree/build/#s=${shared}`);
    const { unmount } = mount('/talent-tree/build/');
    expect(await screen.findByText('Ryan DeBoer', { selector: '.tt-card__name' })).toBeTruthy();
    expect(screen.getByText('Root Visual craft · 24 spent · 2 mastered')).toBeTruthy();
    expect(screen.getByText('seven masteries · two archetypes · four stats · nothing hand-set')).toBeTruthy();
    // Everyone is scored by the same rules: no authored card lines here.
    expect(screen.queryByText('Designs systems that continue working when he leaves the room.')).toBeNull();
    const result = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES);
    expect(screen.getByText(result.passive)).toBeTruthy();
    // The hash round-trips.
    expect(window.location.hash).toBe(`#s=${shared}`);
    expect(receiptText(result, 'x')).toContain('Craft              ●◐◐◐◐○◐○●◐  24 · 2 mastered');
    unmount();

    const own = 'bgn10d70.5.531000000000000000000000000000.Ada%20Lovelace';
    window.history.replaceState(null, '', `/talent-tree/build/?t=${own}`);
    mount('/talent-tree/build/');
    expect(await screen.findByText('Ada Lovelace', { selector: '.tt-card__name' })).toBeTruthy();
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe(`#s=${own}`);
  });

  it('ignores an invalid hash', async () => {
    window.history.replaceState(null, '', '/talent-tree/build/#s=nonsense');
    mount('/talent-tree/build/');
    expect(await screen.findByText('Three of three to answer · the trees power up on the third')).toBeTruthy();
  });
});

describe('the phone', () => {
  it('opens a node in a sheet on tap, spends from it, closes on Escape, and returns focus to the node', async () => {
    phone = true;
    mount('/talent-tree/build/');
    answerIntake();
    const foundation = () => nodeButton(/^Tokens and variables, foundation/);

    // A tap opens the sheet and spends nothing.
    fireEvent.click(foundation());
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('tt-sheet-title');
    expect(within(dialog).getByRole('heading', { name: 'Tokens and variables' })).toBeTruthy();
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(within(dialog).getByText('Components, Storybook, and scaling unlocks at 3')).toBeTruthy();

    // The sheet's plus spends; the legend is folded in.
    fireEvent.click(within(dialog).getByRole('button', { name: 'Add a point to Tokens and variables' }));
    expect(foundation().getAttribute('aria-label')).toMatch(/1 of 5/);
    expect(within(dialog).getByText('mastered', { selector: '.tt-legend__text' })).toBeTruthy();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(foundation()).toHaveFocus();

    // The tabs show one tree at a time.
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });
});
