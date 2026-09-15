import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TalentAtlas from './TalentAtlas';
import { RYAN_ATLAS, encodeAtlas } from '../../data/talent/atlasState';

beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });
afterEach(() => window.history.replaceState(null, '', '/'));
const mount = (own = false) => render(<MemoryRouter><TalentAtlas own={own} /></MemoryRouter>);

test('Ryan’s Forge preserves credited talents and a persistent class while browsing', () => {
  mount();
  const declaration = screen.getByRole('region', { name: 'Your classification' });
  const title = within(declaration).getByRole('heading').textContent;
  fireEvent.click(screen.getByRole('button', { name: /^Vector Velocity\. / }));
  expect(within(declaration).getByRole('heading')).toHaveTextContent(title!);
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 32 talents' }));
  expect(screen.getByRole('button', { name: /^Raster Craft\. 3 of 5/ })).toBeTruthy();
  expect(screen.getByText('+8 · prior visual craft credit')).toBeTruthy();
});
test('empty builds always have a starter class without exposing hidden recipes', () => {
  mount(true);
  expect(screen.getByRole('button', { name: 'Copy build link' })).toBeDisabled();
  expect(screen.queryByText('Durable Standards')).toBeNull();
  expect(screen.queryByText('Script Spark')).toBeNull();
  expect(screen.getByRole('heading', { name: 'Initiate Maker' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 31 proficiencies' }));
  expect(screen.getAllByRole('button', { name: /^Undiscovered proficiency \d/ })).toHaveLength(31);
});
test('allocation earns passives, updates classification, and resets to the starter', () => {
  mount(true);
  fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'none' } });
  fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: '10' } });
  fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
  fireEvent.click(screen.getByRole('button', { name: /^HTML\. 0 of 5/ }));
  const add = screen.getByRole('button', { name: 'Add a point to HTML' });
  fireEvent.click(add); fireEvent.click(add); fireEvent.click(add);
  fireEvent.click(screen.getByRole('button', { name: /^CSS\. 0 of 5/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS' }));
  expect(screen.getByRole('heading', { name: 'Initiate Bridgewright' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Show all 31 proficiencies' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS' }));
  fireEvent.click(screen.getByRole('button', { name: /^Front-End Flow\. Strengthened/ }));
  expect(within(screen.getByRole('region', { name: 'Proficiency details' })).getByText('CSS +1')).toBeTruthy();
  expect(window.location.hash).toContain('v6.');
  fireEvent.click(screen.getByRole('button', { name: 'Reset build' }));
  expect(screen.getByRole('heading', { name: 'Initiate Maker' })).toBeTruthy();
  expect(window.location.hash).toBe('');
});
test('shared builds preserve credit and all new talent allocations', () => {
  window.history.replaceState(null, '', `/#${new URLSearchParams({ s: encodeAtlas(RYAN_ATLAS) })}`);
  mount(true);
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  expect(screen.getByText('+8 · prior visual craft credit')).toBeTruthy();
});
