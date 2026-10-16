/* The carousel, the navigator and the lock state meet in the DOM. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CaseStudyPlayground from './CaseStudyPlayground';
import { WorkNavigatorProvider } from '../context/WorkNavigatorContext';
import { ANON_CLIENT, WORK_ORDER } from '../data/projects';

let mockUnlocked = false;
jest.mock('../context/UnlockContext', () => ({
  useUnlock: () => ({ unlocked: mockUnlocked, lockedReady: true, resolving: false, openPrompt: jest.fn() }),
}));
jest.mock('../hooks/useReveal', () => ({ useReveal: () => [null, true] }));
jest.mock('./Testimonials', () => ({ FeaturedEndorsement: () => null }));
jest.mock('framer-motion', () => {
  const React = require('react');
  const element = (tag: string) => ({ custom, variants, initial, animate, whileInView, viewport, onViewportEnter, onViewportLeave, ...props }: any) => React.createElement(tag, props);
  // Reduced motion keeps the <img> media path, the one the prerender serializes.
  return { useReducedMotion: () => true, motion: { div: element('div'), span: element('span') } };
});

beforeEach(() => {
  mockUnlocked = false;
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  window.history.replaceState(null, '', '/');
  (window as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

const mount = () => render(<MemoryRouter><WorkNavigatorProvider><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>);
const cardSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__card')).map((card) => card.dataset.slug);
const openRail = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Browse by discipline or client' }));
  return screen.getByRole('complementary', { name: 'Browse work by discipline or client' });
};

test('renders the one order, opens on WheelRack, PlayDraft and AEM, and counts three to a page', () => {
  const { container } = mount();
  expect(cardSlugs(container)).toEqual(WORK_ORDER);
  expect(cardSlugs(container).slice(0, 3)).toEqual(['wheelrack', 'playdraft', 'aem-component-system']);
  expect(screen.getByText('1 / 4')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous case studies' })).toBeDisabled();
  // The hook line is gone; a card is its title and its outcome.
  expect(container.querySelector('.case-playground__card-line')).toBeNull();
  expect(screen.getByRole('heading', { level: 3, name: 'PlayDraft: A social drafting game' })).toBeInTheDocument();
});

test('locked cards carry the lock line and name no client; unlocked cards name it', () => {
  const { container, unmount } = mount();
  expect(screen.getAllByText('Password protected')).toHaveLength(7);
  expect(container.textContent).not.toContain('Tire Rack');
  unmount();
  mockUnlocked = true;
  const view = mount();
  expect(screen.queryByText('Password protected')).not.toBeInTheDocument();
  expect(view.container.textContent).toContain('Tire Rack');
});

test('the navigator filters the row by discipline and client, and keeps the employer anonymous while locked', () => {
  const { container } = mount();
  expect(container.querySelector('.side-panel--work')).toBeNull();
  const rail = openRail();
  expect(screen.getByRole('button', { name: 'Browse by discipline or client' })).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(within(rail).getByRole('button', { name: /^AEM/ }));
  expect(cardSlugs(container)).toEqual(['aem-component-system', 'tire-categories', 'landing-pages', 'seasonal-content-system']);
  expect(screen.getByText('[ AEM ]')).toBeInTheDocument();
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
  expect(window.location.hash).toBe('#projects/aem');
  // The rail lists the same four, by title, in the same order.
  expect(within(rail).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
    '/work/aem-component-system/', '/work/tire-categories/', '/work/landing-pages/', '/work/seasonal-content-system/',
  ]);

  fireEvent.click(within(rail).getByRole('button', { name: /^Client/ }));
  expect(within(rail).getByText(ANON_CLIENT)).toBeInTheDocument();
  expect(rail.textContent).not.toContain('Tire Rack');
  fireEvent.click(within(rail).getByRole('button', { name: /^Personal products/ }));
  expect(cardSlugs(container)).toEqual(['playdraft', 'loopstack', 'bolus-binder', 'overscroll-tactics']);
  expect(window.location.hash).toBe('#projects/client/personal');

  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(cardSlugs(container)).toEqual(WORK_ORDER);
  expect(window.location.hash).toBe('#projects');
});

test('Escape closes the rail and returns focus to the control that opened it', () => {
  mount();
  openRail();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('complementary', { name: 'Browse work by discipline or client' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Browse by discipline or client' })).toHaveFocus();
});
