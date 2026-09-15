import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TalentAtlas from './TalentAtlas';
import { RYAN_ATLAS, encodeAtlas } from '../../data/talent/atlasState';

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  Element.prototype.scrollTo = jest.fn();
});
afterEach(() => window.history.replaceState(null, '', '/'));
const mount = (own = false) => render(<MemoryRouter><TalentAtlas own={own} /></MemoryRouter>);

test('Ryan’s Atlas includes the credited visual skills and a computed class', () => {
  mount();
  expect(screen.getByRole('button', { name: /^Raster Craft\. 3 of 5/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^CMS\. 3 of 5/ })).toBeTruthy();
  expect(screen.getByRole('meter', { name: 'Ability charge' })).toHaveAttribute('aria-valuenow', '75');
  expect(screen.getByText('+8 · prior visual craft credit')).toBeTruthy();
});

test('the empty visitor build exposes neither secret recipes nor a secret provisional class', () => {
  mount(true);
  expect(screen.getByRole('button', { name: 'Copy build link' })).toBeDisabled();
  expect(screen.queryByText('Guardrail Architect')).toBeNull();
  expect(screen.queryByText('Script Spark')).toBeNull();
  expect(screen.getByText('Your class is taking shape')).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /^Undiscovered ability \d/ })).toHaveLength(31);
});

test('spending discovers and strengthens abilities without leaking unearned ranks', () => {
  mount(true);
  fireEvent.change(screen.getByLabelText('Degree'), { target: { value: 'none' } });
  fireEvent.change(screen.getByLabelText('Years of professional experience'), { target: { value: '10' } });
  fireEvent.click(screen.getByLabelText('More than 200 hours, plus 5'));
  fireEvent.click(screen.getByRole('button', { name: /^HTML\. 0 of 5/ }));
  const addHTML = screen.getByRole('button', { name: 'Add a point to HTML' });
  fireEvent.click(addHTML); fireEvent.click(addHTML); fireEvent.click(addHTML);
  fireEvent.click(screen.getByRole('button', { name: /^CSS\. 0 of 5/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS' }));
  expect(screen.getByRole('button', { name: /^Front-End Flow\. Unlocked/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Add a point to CSS' }));
  const ability = screen.getByRole('button', { name: /^Front-End Flow\. Strengthened/ });
  fireEvent.click(ability);
  const inspector = screen.getByRole('region', { name: 'Ability details' });
  expect(within(inspector).getByText('CSS +1')).toBeTruthy();
  expect(window.location.hash).toContain('v6.');
});

test('shared Atlas builds preserve the extra credit and new skills', () => {
  window.history.replaceState(null, '', `/#${new URLSearchParams({ s: encodeAtlas(RYAN_ATLAS) })}`);
  mount(true);
  expect(screen.getByRole('button', { name: /^Vector Design\. 5 of 5/ })).toBeTruthy();
  expect(screen.getByText('+8 · prior visual craft credit')).toBeTruthy();
});
