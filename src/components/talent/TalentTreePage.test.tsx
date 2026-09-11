// The talent tree page, rendered.
// Run: CI=true npx react-scripts test --watchAll=false src/components/talent
// (jest, for the DOM: the vitest in use has no jsdom of its own.)
//
// Guards the two contracts the page is built around: the first render is
// Ryan's tree with his result beneath it (what the prerender serialises and a
// crawler reads), and the spending rules the page enforces through
// economy.ts (a point per click, the crown locked until its foundation holds
// three, removal by shift-click and Backspace, the result on request).

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TalentTreePage from '../TalentTreePage';
import { RYAN_CLASS_LABEL } from '../../data/talent/ryan';

beforeAll(() => {
  // jsdom has neither; useReveal and the scroll helpers expect both.
  class IO {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  window.matchMedia = ((q: string) => ({
    matches: false, media: q, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView = () => {};
});

function mount(path = '/talent-tree/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TalentTreePage />
    </MemoryRouter>,
  );
}

const nodeButton = (name: RegExp) => screen.getByRole('button', { name });

describe('TalentTreePage', () => {
  it('renders Ryan by default: header, pools, class, result', () => {
    mount();
    expect(screen.getByRole('heading', { level: 2, name: "Ryan's tree" })).toBeTruthy();
    expect(screen.getByText('Level 16 Designer', { selector: '.tt-board__meta-item' })).toBeTruthy();
    expect(screen.getByText('63 / 63 craft · 21 / 21 core')).toBeTruthy();
    expect(screen.getByText(RYAN_CLASS_LABEL, { selector: '.tt-board__meta-item' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Here is where the points ended up.' })).toBeTruthy();
    expect(screen.getByText('Ryan DeBoer', { selector: '.tt-card__name' })).toBeTruthy();
    expect(screen.getByText('Designs systems that continue working when he leaves the room.')).toBeTruthy();
    // Thirty nodes, each a button with its meaning as the description.
    const nodes = screen.getAllByRole('button', { name: /, (foundation|crown), \d of 5 points/ });
    expect(nodes.length).toBe(30);
    nodes.forEach((n) => {
      expect(n).toHaveAccessibleDescription(/Time spent/);
    });
    expect(nodeButton(/^Typography and hierarchy, foundation, 5 of 5 points$/)).toBeTruthy();
  });

  it('spends, locks the crown until the foundation holds 3, and removes on shift-click and Backspace', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Build your talent tree' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Your tree' })).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 2, name: 'Here is where the points ended up.' })).toBeNull();

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

    // The live pools count the spend.
    expect(screen.getByText(/^4 \/ \d+ craft · 0 \/ \d+ core$/)).toBeTruthy();

    fireEvent.click(foundation(), { shiftKey: true });
    expect(foundation().getAttribute('aria-label')).toMatch(/2 of 5/);
    // Dropping under 3 refunds the crown and relocks it.
    expect(crown().getAttribute('aria-label')).toMatch(/0 of 5/);
    expect(crown().getAttribute('aria-disabled')).toBe('true');

    fireEvent.keyDown(foundation(), { key: 'Backspace' });
    expect(foundation().getAttribute('aria-label')).toMatch(/1 of 5/);
  });

  it('shows the visitor result on Get my class and restores Ryan on See Ryan\'s tree', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Build your talent tree' }));
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(nodeButton(/^Tokens and variables, foundation/));
    fireEvent.click(screen.getByRole('button', { name: 'Get my class' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Here is where the points ended up.' })).toBeTruthy();
    expect(screen.getByText('Ada Lovelace', { selector: '.tt-card__name' })).toBeTruthy();
    expect(screen.getByText('Level 5 Designer', { selector: '.tt-card__level' })).toBeTruthy();
    expect(screen.queryByText('Designs systems that continue working when he leaves the room.')).toBeNull();

    // The header's copy comes first in the DOM; the result carries a second.
    fireEvent.click(screen.getAllByRole('button', { name: "See Ryan's tree" })[0]);
    expect(screen.getByRole('heading', { level: 2, name: "Ryan's tree" })).toBeTruthy();
    expect(screen.getByText('63 / 63 craft · 21 / 21 core')).toBeTruthy();
  });

  it('decodes a valid share state after mount and ignores an invalid one', async () => {
    const own = 'bgn10d70.5.531000000000000000000000000000.Ada%20Lovelace';
    window.history.replaceState(null, '', `/talent-tree/?t=${own}`);
    const { unmount } = mount();
    expect(await screen.findByRole('heading', { level: 2, name: "Ada Lovelace's tree" })).toBeTruthy();
    expect(screen.getByText(/^9 \/ \d+ craft · 0 \/ \d+ core$/)).toBeTruthy();
    unmount();

    window.history.replaceState(null, '', '/talent-tree/?t=nonsense');
    mount();
    expect(await screen.findByRole('heading', { level: 2, name: "Ryan's tree" })).toBeTruthy();
    window.history.replaceState(null, '', '/talent-tree/');
  });
});
