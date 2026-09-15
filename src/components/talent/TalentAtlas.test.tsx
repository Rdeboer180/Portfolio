import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TalentAtlas from './TalentAtlas';
import TalentAtlasPage from '../TalentAtlasPage';
import { RYAN_ATLAS, encodeAtlas } from '../../data/talent/atlasState';

beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });
afterEach(() => window.history.replaceState(null, '', '/'));
const mount = (own = false) => {
  const view = render(<MemoryRouter><TalentAtlas own={own} /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /^Your proficiencies/ }));
  return view;
};

test('Ryan’s Forge preserves requested talents and a persistent class while browsing', () => {
  mount();
  const declaration = screen.getByRole('region', { name: 'Your classification' });
  const title = within(declaration).getByRole('heading').textContent;
  fireEvent.click(screen.getByRole('button', { name: /^Vector Velocity\. / }));
  expect(within(declaration).getByRole('heading')).toHaveTextContent(title!);
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 36 talents' }));
  expect(screen.getByRole('button', { name: /^CSS\/SASS\. 5 of 5/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^HTML\. 3 of 5/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^Raster Craft\. 3 of 5/ })).toBeTruthy();
  expect(screen.getAllByText('+56 · 14 years').length).toBeGreaterThan(0);
});
test('empty builds always have a starter class without exposing hidden recipes', () => {
  mount(true);
  expect(screen.getByRole('button', { name: 'Copy build link' })).toBeDisabled();
  expect(screen.queryByText('Durable Standards')).toBeNull();
  expect(screen.queryByText('Script Spark')).toBeNull();
  expect(screen.getByRole('heading', { name: 'Initiate Maker' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 35 proficiencies' }));
  expect(screen.getAllByRole('button', { name: /^Undiscovered proficiency \d/ })).toHaveLength(35);
});
test('allocation earns passives, updates classification, and resets to the starter', () => {
  mount(true);
  fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'none' } });
  fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: '10' } });
  fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
  fireEvent.click(screen.getByRole('button', { name: /^HTML\. 0 of 5/ }));
  const add = screen.getByRole('button', { name: 'Add a point to HTML' });
  fireEvent.click(add); fireEvent.click(add); fireEvent.click(add);
  fireEvent.click(screen.getByRole('button', { name: /^CSS\/SASS\. 0 of 5/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS/SASS' }));
  expect(screen.getByRole('heading', { name: 'Initiate Bridgewright' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 35 proficiencies' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS/SASS' }));
  fireEvent.click(screen.getByRole('button', { name: /^Front-End Flow\. Strengthened/ }));
  expect(within(screen.getByRole('region', { name: 'Proficiency details' })).getByText('CSS/SASS +1')).toBeTruthy();
  expect(window.location.hash).toContain('v6.');
  fireEvent.click(screen.getByRole('button', { name: 'Reset build' }));
  expect(screen.getByRole('heading', { name: 'Initiate Maker' })).toBeTruthy();
  expect(window.location.hash).toBe('');
});
test('shared builds preserve all updated talent allocations', () => {
  window.history.replaceState(null, '', `/#${new URLSearchParams({ s: encodeAtlas(RYAN_ATLAS) })}`);
  mount(true);
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  expect(screen.getAllByText('+56 · 14 years').length).toBeGreaterThan(0);
});

test('top proficiencies are ranked, and Show all reveals the complete collection', () => {
  mount();
  const section = screen.getByRole('region', { name: 'Proficiency collection' });
  expect(within(section).getByRole('heading', { name: 'Your top proficiencies' })).toBeTruthy();
  const cards = within(section).getAllByRole('button', { name: /\. (Master|Elite|Advanced|Strengthened|Unlocked)\./ });
  expect(cards).toHaveLength(6);
  expect(cards[0]).toHaveAccessibleName('Token Tactics. Master.');
  fireEvent.click(within(section).getByRole('button', { name: 'Show all 35 proficiencies' }));
  expect(within(section).getByRole('heading', { name: 'All your proficiencies' })).toBeTruthy();
  expect(within(section).getAllByRole('button')).toHaveLength(36);
});

test('switching from Ryan to a visitor build resets the focused read-only view', () => {
  const view = render(<MemoryRouter><TalentAtlasPage /></MemoryRouter>);
  view.rerender(<MemoryRouter><TalentAtlasPage own /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Initiate Maker' })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^Automation\. 0 of 5/ })).toBeTruthy();
});

test('proficiencies are secondary and collapsed below the classification by default', () => {
  render(<MemoryRouter><TalentAtlas /></MemoryRouter>);
  expect(screen.queryByText('At the workbench')).toBeNull();
  expect(screen.queryByRole('region', { name: 'Proficiency details' })).toBeNull();
  const toggle = screen.getByRole('button', { name: /^Your proficiencies/ });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: /^CSS\/SASS\. 5 of 5/ })).toBeTruthy();
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(within(screen.getByRole('region', { name: 'Build proficiencies' })).getByRole('region', { name: 'Proficiency details' })).toBeTruthy();
  fireEvent.click(toggle);
  expect(screen.queryByRole('region', { name: 'Proficiency collection' })).toBeNull();
});

test('Ryan’s combined class shows public evidence without opening the proficiency drawer', () => {
  render(<MemoryRouter><TalentAtlas /></MemoryRouter>);
  const declaration = screen.getByRole('region', { name: 'Your classification' });
  expect(within(declaration).getByRole('heading', { name: 'Adept Craft Steward' })).toBeTruthy();
  expect(within(declaration).getByRole('link', { name: 'Standards' })).toHaveAttribute('href', '/work/wheelrack/');
  fireEvent.click(screen.getByRole('button', { name: /^Your proficiencies/ }));
  expect(within(screen.getByRole('region', { name: 'Proficiency details' })).getByRole('link', { name: /WheelRack/ })).toBeTruthy();
});
