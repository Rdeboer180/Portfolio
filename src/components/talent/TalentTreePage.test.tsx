// The talent tree's two routes, rendered (v5: three lanes and the Forge).
// Run: CI=true npx react-scripts test --watchAll=false src/components/talent
// (jest, for the DOM: the vitest in use has no jsdom of its own.)
//
// Guards the contracts the console is built around: the front door's first
// render is Ryan's tree with the summary sheet filled (what the prerender
// serialises and a crawler reads); the build route's first render is the empty
// intake with the trees dormant; the spending rules the page enforces through
// economy.ts (a point per click, the crown locked until its foundation holds
// three, removal by shift-click and Backspace); the Forge rail (twelve chips,
// four unlocked for Ryan, a hover that lights the recipe, an ability unlocking
// live on the build route); the sheet on a phone; and the share state's round
// trip through the hash, with the older ?t= form still decoded.

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
const forge = () => screen.getByRole('group', { name: 'The Forge' }) as HTMLElement;
const chip = (name: RegExp) => screen.getByRole('button', { name });

/** Answer the three questions with Ryan's answers, so the trees power up. */
function answerIntake(years = 16) {
  fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'bachelors' } });
  fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: String(years) } });
  fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
}

describe('the front door, /talent-tree/', () => {
  it('renders Ryan by default: the three lanes, the rails, thirty nodes, the summary sheet', () => {
    mount('/talent-tree/');
    expect(screen.getByRole('heading', { level: 1, name: "Ryan's tree" })).toBeTruthy();
    expect(screen.getByText('Level 16 Designer · 63 points · one pool')).toBeTruthy();
    expect(screen.getByText(`Class ${RYAN_CLASS_LABEL} · by recipe`)).toBeTruthy();
    expect(screen.getByText(/I've never been sure what to call myself\./)).toBeTruthy();

    // The status rail: the three lanes, computed, then the one spend line.
    const lanes = screen.getByRole('list', { name: 'Points per lane' });
    expect(lanes).toHaveTextContent('Design and systems27');
    expect(lanes).toHaveTextContent('Technical27');
    expect(lanes).toHaveTextContent('Code9');
    expect(screen.getByText('63 / 63')).toBeTruthy();
    expect(screen.getByText('spent · 4 mastered · 4 abilities')).toBeTruthy();

    // The lane headers carry the artboard's second half.
    expect(screen.getByText('· what you define')).toBeTruthy();
    expect(screen.getByText('· how you connect the work')).toBeTruthy();
    expect(screen.getByText('· what you can express in the medium')).toBeTruthy();
    expect(screen.getByText('Root Visual craft · 27 points · 2 mastered')).toBeTruthy();

    // Thirty nodes, each a button with its meaning as the description.
    const nodes = screen.getAllByRole('button', { name: /, (foundation|crown), \d of 5 points/ });
    expect(nodes.length).toBe(30);
    expect(nodeButton(/^Typography, foundation, 5 of 5 points$/)).toBeTruthy();

    // No intake, no spending controls, no state written to the URL.
    expect(screen.queryByLabelText('Degree')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Reset/ })).toBeNull();
    expect(window.location.hash).toBe('');

    // The console ends after the Forge and the closing rail.
    expect(screen.getByText('End of the trees')).toBeTruthy();
    expect(screen.getByText('· 30 nodes · 63 / 63 spent · 4 abilities', { exact: false })).toBeTruthy();

    const sheet = screen.getByRole('region', { name: 'Summary' });
    expect(within(sheet).getByText('Summary · computed from 63 points')).toBeTruthy();
    expect(within(sheet).getByText('four abilities · four masteries · four stats · nothing hand-set')).toBeTruthy();
    expect(within(sheet).getByText('Abilities · 4 unlocked of 12 · the top two are the class')).toBeTruthy();
    expect(within(sheet).getByText('Masteries · four nodes at 5 / 5')).toBeTruthy();
    expect(within(sheet).getByText('4 of 30 nodes')).toBeTruthy();
    expect(within(sheet).getByText(/four foundations · earned by time, not self-rated/)).toBeTruthy();
    expect(within(sheet).getByText('Ryan DeBoer', { selector: '.tt-card__name' })).toBeTruthy();
    expect(within(sheet).getByText('Designs systems that continue working when he leaves the room.')).toBeTruthy();
    expect(within(sheet).getByText(/unlocked by recipe · strength 1/)).toBeTruthy();
    expect(within(sheet).queryByText(/Provisional/)).toBeNull();
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();

    // The crossover and the sheet's foot are plain links.
    const build = screen.getAllByRole('link', { name: /Build your own/ });
    expect(build.length).toBe(2);
    build.forEach((a) => expect(a.getAttribute('href')).toBe('/talent-tree/build/'));
  });

  it('renders twelve Forge chips, four unlocked for Ryan, and lights a recipe on hover', () => {
    mount('/talent-tree/');
    const rail = forge();
    expect(within(rail).getByText('The Forge')).toBeTruthy();
    expect(within(rail).getByText('4 of 12')).toBeTruthy();
    const chips = Array.from(rail.querySelectorAll<HTMLButtonElement>('button.tt-chip'));
    expect(chips.length).toBe(12);
    expect(chips.filter((c) => /, unlocked$/.test(c.getAttribute('aria-label') || '')).length).toBe(4);
    // Unlocked first, then the nearest locked one as "next".
    expect(chips[0].getAttribute('aria-label')).toBe('Guardrail Architect, unlocked');
    expect(chips[4].getAttribute('aria-label')).toBe('Systemsmith, next, 1 point away');
    expect(chips[11].getAttribute('aria-label')).toBe('Shipwright, locked');
    // The recipe inspector features the first unlocked ability with its four requirements.
    const recipe = within(rail).getByRole('region', { name: 'Ability recipe' });
    expect(within(recipe).getByText('Featured ability')).toBeTruthy();
    expect(within(recipe).getByRole('button', { name: 'Inspect Tokens in Design and systems: requires 4, invested 5, met' })).toBeTruthy();
    expect(within(recipe).getAllByRole('button', { name: /^Inspect / }).length).toBe(4);

    // Hover: the recipe's four nodes light; badges keep showing invested points.
    fireEvent.mouseEnter(chips[0]);
    expect(within(rail).getByText('Preview · Guardrail Architect · recipe lit on the trees')).toBeTruthy();
    const lit = document.querySelectorAll('.tt-node.is-lit');
    expect(lit.length).toBe(4);
    expect(document.querySelector('.tt-trees')).toHaveClass('is-forge');
    const badges = Array.from(lit).map((n) => n.querySelector('.tt-node__count')?.textContent);
    expect(badges.sort()).toEqual(['3', '3', '4', '5']);
    expect(document.querySelectorAll('.tt-node.is-receded').length).toBe(26);

    fireEvent.mouseLeave(chips[0]);
    expect(document.querySelectorAll('.tt-node.is-lit').length).toBe(0);

    // A click pins the recipe; Escape lets it go.
    fireEvent.click(chips[0]);
    expect(chips[0].getAttribute('aria-pressed')).toBe('true');
    fireEvent.keyDown(chips[0], { key: 'Escape' });
    expect(chips[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('floats a card beside a hovered node, with its level and gate in words', () => {
    mount('/talent-tree/');
    expect(screen.getByText('Hover a node for its meaning and gate · the card sits on the node')).toBeTruthy();
    fireEvent.mouseEnter(nodeButton(/^Governance, crown/));
    const card = screen.getByTestId('tt-nodecard');
    expect(card.getAttribute('aria-hidden')).toBe('true');
    expect(within(card).getByText('Governance')).toBeTruthy();
    expect(card).toHaveTextContent('3 / 5 · crown');
    expect(card).toHaveTextContent('Unlocked at foundation 3 · foundation holds 4');
    expect(card.querySelectorAll('.tt-nodecard__dot.is-on').length).toBe(3);
    // jsdom has no layout: every box is zero, so neither side fits and the card drops below.
    expect(card).toHaveClass('tt-nodecard--below');
    fireEvent.mouseLeave(nodeButton(/^Governance, crown/));
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();
  });

  it('places the card right of the node, flips left at the console edge, drops below when neither fits', () => {
    const rect = (left: number, top: number, width: number, height: number) => ({ left, top, width, height } as DOMRect);
    const host = rect(0, 0, 1392, 752);
    expect(placeCard(rect(278, 378, 44, 44), host)).toEqual({ left: 334, top: 384, place: 'right' });
    expect(placeCard(rect(1300, 378, 44, 44), host)).toEqual({ left: 1322 - 34 - 280, top: 384, place: 'left' });
    expect(placeCard(rect(150, 378, 44, 44), rect(0, 0, 400, 752))).toEqual({ left: 32, top: 434, place: 'below' });
  });

  it('never mounts the card below 1024', () => {
    desktop = false;
    mount('/talent-tree/');
    fireEvent.mouseEnter(nodeButton(/^Governance, crown/));
    expect(screen.queryByTestId('tt-nodecard')).toBeNull();
  });

  it('sends an older ?t= link to the build route in the hash form', async () => {
    const own = `v5bgn10.5.5${'0'.repeat(29)}.Ada%20Lovelace`;
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

    // The Forge is on the rail from the first paint: twelve chips, none unlocked.
    expect(forge().querySelectorAll('button.tt-chip').length).toBe(12);
    expect(within(forge()).getByText('0 of 12')).toBeTruthy();

    const foundation = () => nodeButton(/^Typography, foundation/);
    expect(foundation().getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(foundation());
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);

    // Degree, then major and minor appear; the receipt prints as answers land.
    fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'bachelors' } });
    expect(screen.getByText("+16 design, locked · Bachelor's, graphic design")).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Minor'), { target: { value: 'web' } });
    expect(screen.getByText('+4 code, locked · minor, web')).toBeTruthy();
    expect(screen.getByText('Two of three to answer · the trees power up on the third')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: '16' } });
    expect(screen.getByText('+38 · 16 years')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
    expect(screen.getByText('+5 · 200+ hours')).toBeTruthy();
    expect(chips().length).toBe(4);
    expect(consoleEl()).toHaveClass('is-live');
    expect(screen.getByText('The panel is live.')).toBeTruthy();

    // The tally, the ledger's three groups, and the unspent counters, computed.
    expect(screen.getByText('63', { selector: '.tt-intake__big' })).toBeTruthy();
    expect(screen.getByText('Level 16', { selector: '.tt-intake__level' })).toBeTruthy();
    const ledger = screen.getByRole('group', { name: /Points ledger/ });
    expect(ledger).toHaveTextContent('Design locked 0 / 16');
    expect(ledger).toHaveTextContent('Code locked 0 / 4');
    expect(ledger).toHaveTextContent('Free 0 / 43');
    expect(within(ledger).queryByText(/Core/)).toBeNull();
    const pools = screen.getByRole('status', { name: 'Points' });
    expect(pools).toHaveTextContent('0 / 63');
    expect(pools).toHaveTextContent('16 design · 4 code');
    expect(foundation().getAttribute('aria-disabled')).toBeNull();
  });

  it('spends, locks the crown until the foundation holds 3, removes on shift-click and Backspace, and resets', () => {
    mount('/talent-tree/build/');
    answerIntake();

    const foundation = () => nodeButton(/^Typography, foundation/);
    const crown = () => nodeButton(/^Layout, crown/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');
    expect(crown().getAttribute('aria-label')).toMatch(/locked until Typography holds 3/);

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

    expect(screen.getByText('Root Visual craft · 4 spent · 0 mastered · 12 locked here')).toBeTruthy();
    fireEvent.mouseEnter(crown());
    fireEvent.click(screen.getByRole('button', { name: 'Add a point to Layout', hidden: true }));
    expect(crown().getAttribute('aria-label')).toMatch(/2 of 5/);
    fireEvent.click(screen.getByRole('button', { name: 'Remove a point from Layout', hidden: true }));
    expect(crown().getAttribute('aria-label')).toMatch(/1 of 5/);

    fireEvent.click(foundation(), { shiftKey: true });
    expect(foundation().getAttribute('aria-label')).toMatch(/2 of 5/);
    // Dropping under 3 refunds the crown and relocks it.
    expect(crown().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');

    fireEvent.keyDown(foundation(), { key: 'Backspace' });
    expect(foundation().getAttribute('aria-label')).toMatch(/1 of 5/);

    // Mastery: five points, the row on the sheet.
    for (let i = 0; i < 4; i += 1) fireEvent.click(foundation());
    expect(foundation().getAttribute('aria-label')).toMatch(/5 of 5/);
    expect(screen.getByText('Masteries · one node at 5 / 5')).toBeTruthy();
    expect(screen.getByText('1 of 30 nodes')).toBeTruthy();
    expect(screen.getByText('Typography', { selector: '.tt-masteries__name' })).toBeTruthy();

    // Reset tree, free and never confirmed.
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset tree' })[0]);
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(screen.getByText('Five points in one node is a mastery. The first one prints here.')).toBeTruthy();
  });

  it('unlocks an ability live as the points land', () => {
    mount('/talent-tree/build/');
    answerIntake();
    expect(within(forge()).getByText('0 of 12')).toBeTruthy();
    expect(chip(/^Systemsmith, locked$/)).toBeTruthy();

    // Systemsmith: Tokens 4 · Components 4 · Storybook 3. Components is a
    // crown, so Tokens has to reach 3 before it takes anything.
    const spend = (name: RegExp, times: number) => {
      for (let i = 0; i < times; i += 1) fireEvent.click(nodeButton(name));
    };
    spend(/^Tokens, foundation/, 4);
    spend(/^Components, crown/, 4);
    expect(chip(/^Systemsmith, next, 3 points away$/)).toBeTruthy();
    spend(/^Storybook, foundation/, 3);

    expect(chip(/^Systemsmith, unlocked$/)).toBeTruthy();
    expect(within(forge()).getByText('1 of 12')).toBeTruthy();
    expect(screen.getByText('Abilities · 1 unlocked of 12 · the top two are the class')).toBeTruthy();
  });

  it('assembles the card on Finish with points left, with the share actions and a copyable receipt', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    mount('/talent-tree/build/');
    answerIntake();
    fireEvent.click(nodeButton(/^Tokens, foundation/));
    expect(screen.queryByText('Level 16 Designer', { selector: '.tt-card__level' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Finish with points left' }));
    const card = screen.getByRole('region', { name: 'Summary' });
    expect(within(card).getByText('Level 16 Designer', { selector: '.tt-card__level' })).toBeTruthy();
    expect(within(card).getByText('Save as image', { selector: '.tt-primary' })).toBeTruthy();
    // Fewer than two abilities: the class is provisional and says so.
    expect(within(card).getByText('Provisional · unlock two abilities to earn it')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada Lovelace' } });
    expect(within(card).getByText('Ada Lovelace', { selector: '.tt-card__name' })).toBeTruthy();

    // The receipt: the class line, three rows of marks, and the abilities line.
    fireEvent.click(screen.getByRole('button', { name: 'Copy receipt' }));
    expect(await screen.findByText('Receipt copied')).toBeTruthy();
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0] as string;
    expect(text.split('\n')[0]).toBe('Ada Lovelace · Level 16 Designer');
    expect(text).toMatch(/Design and systems {2}○○○○◐○○○○○ {2}1 · 0 mastered/);
    expect(text).toMatch(/0 unlocked of 12 · next, /);
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
    expect(screen.getByText('Root Visual craft · 27 spent · 2 mastered')).toBeTruthy();
    expect(screen.getByText('four abilities · four masteries · four stats · nothing hand-set')).toBeTruthy();
    // Everyone is scored by the same rules: no authored card lines here.
    expect(screen.queryByText('Designs systems that continue working when he leaves the room.')).toBeNull();
    const result = buildResult(RYAN_INTAKE, RYAN_ALLOCATION, TREES, ARCHETYPES);
    expect(screen.getByText(result.passive)).toBeTruthy();
    // The hash round-trips.
    expect(window.location.hash).toBe(`#s=${shared}`);
    expect(receiptText(result, 'x')).toContain('Design and systems  ●◐◐◐●◐◐◐○○  27 · 2 mastered');
    expect(receiptText(result, 'x')).toContain('4 unlocked of 12 · Guardrail Architect');
    unmount();

    const own = `v5bgn10.5.5${'0'.repeat(29)}.Ada%20Lovelace`;
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
    const foundation = () => nodeButton(/^Tokens, foundation/);

    // A tap opens the sheet and spends nothing.
    fireEvent.click(foundation());
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('tt-sheet-title');
    expect(within(dialog).getByRole('heading', { name: 'Tokens' })).toBeTruthy();
    expect(foundation().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(within(dialog).getByText('Components unlocks at 3')).toBeTruthy();

    // The sheet's plus spends; the legend is folded in.
    fireEvent.click(within(dialog).getByRole('button', { name: 'Add a point to Tokens' }));
    expect(foundation().getAttribute('aria-label')).toMatch(/1 of 5/);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(foundation()).toHaveFocus();

    // The tabs are the Design / Technical / Code segmented control.
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
    expect(tabs.map((t) => t.textContent)).toEqual([
      expect.stringContaining('Design'),
      expect.stringContaining('Technical'),
      expect.stringContaining('Code'),
    ]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    // The Forge collapses its locked run behind one row.
    expect(within(forge()).getByText('11 locked')).toBeTruthy();
  });
});
