/* The featured cards, the index, the discipline chips and the author's layout styles meet in the DOM. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CaseStudyPlayground, { WorkLayoutStyle } from './CaseStudyPlayground';
import AuthoredSection from './AuthoredSection';
import AuthorSidePanel from './AuthorSidePanel';
import WorkNavigator from './WorkNavigator';
import { WorkNavigatorProvider } from '../context/WorkNavigatorContext';
import { AuthorModeProvider } from '../context/AuthorModeContext';
import { AUTHORED_COMPONENTS } from '../data/authorChrome';
import projects, { ANON_CLIENT, WORK_ORDER, cardTitleFor } from '../data/projects';

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

const AUTHOR_KEY = 'rdeboer:author-mode';
const PLAYGROUND = AUTHORED_COMPONENTS.playground.component;
const AEM = ['aem-component-system', 'tire-categories', 'landing-pages', 'seasonal-content-system'];

beforeEach(() => {
  mockUnlocked = false;
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
  window.sessionStorage.clear();
  (window as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

/** The Publisher page: no author chrome mounted at all. */
const mount = () => render(<MemoryRouter><WorkNavigatorProvider><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>);

/** The page as App composes it, with the author chrome that can reach the section. */
const mountWithAuthor = () => render(
  <MemoryRouter>
    <AuthorModeProvider>
      <WorkNavigatorProvider>
        <AuthorSidePanel />
        <AuthoredSection {...AUTHORED_COMPONENTS.playground} toolbar={<WorkLayoutStyle />}>
          <CaseStudyPlayground />
        </AuthoredSection>
      </WorkNavigatorProvider>
    </AuthorModeProvider>
  </MemoryRouter>,
);

const cardSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__card')).map((card) => card.dataset.slug);
const indexSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__list > li')).map((row) => row.dataset.slug);
const chips = () => screen.getByRole('group', { name: 'Browse by discipline' });
const chip = (label: string) => within(chips()).getByRole('button', { name: label });

test('a visitor gets three featured cards, then every study in the index, with no paging and no layout to choose', () => {
  const { container } = mount();
  expect(cardSlugs(container)).toEqual(['wheelrack', 'playdraft', 'aem-component-system']);
  expect(indexSlugs(container)).toEqual(WORK_ORDER);
  // The index is the finder's row: title, outcome, year and client.
  const rows = container.querySelectorAll<HTMLElement>('.case-playground__list .dam__item');
  expect(within(rows[1]).getByText('PlayDraft: A social drafting game')).toBeInTheDocument();
  expect(container.querySelector('.case-playground__card-line')).toBeNull();
  expect(screen.getByRole('heading', { level: 3, name: 'PlayDraft: A social drafting game' })).toBeInTheDocument();
  // Paging, the browse rail and the layout switch are gone from Publisher.
  expect(screen.queryByRole('button', { name: /case studies$/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/^\d+ \/ \d+$/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Browse by discipline or client' })).not.toBeInTheDocument();
  expect(screen.queryByRole('group', { name: 'Layout' })).not.toBeInTheDocument();
  expect(container.querySelector('.side-panel')).toBeNull();
});

test('locked studies carry the lock line on card and row, name no client, and each line has its own id', () => {
  const { container, unmount } = mount();
  // WheelRack and AEM among the featured three, all seven in the index.
  expect(screen.getAllByText('Password protected')).toHaveLength(9);
  expect(container.textContent).not.toContain('Tire Rack');
  const rows = container.querySelectorAll<HTMLElement>('.case-playground__list .dam__item');
  expect(within(rows[0]).getByText(`2023–2026 · ${ANON_CLIENT}`)).toBeInTheDocument();
  expect(rows[0].tagName).toBe('A');
  expect(rows[0]).toHaveAttribute('aria-describedby', 'index-lock-wheelrack');
  expect(container.querySelector('#index-lock-wheelrack')).toHaveTextContent('Password protected');
  expect(container.querySelector('#lock-wheelrack')).toHaveTextContent('Password protected');
  const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(container.querySelectorAll('.case-playground__list .dam__thumb--locked')).toHaveLength(6);
  unmount();

  mockUnlocked = true;
  const view = mount();
  expect(screen.queryByText('Password protected')).not.toBeInTheDocument();
  expect(view.container.querySelectorAll('.case-playground__list .dam__thumb--locked')).toHaveLength(0);
  expect(view.container.textContent).toContain('Tire Rack');
});

test('the discipline chips filter the featured cards and the index together, and write the deep link', () => {
  const { container } = mount();
  expect(within(chips()).getAllByRole('button').map((button) => button.textContent)).toEqual(['All', 'AEM', 'System Design', 'Product Design']);
  expect(chip('All')).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(chip('AEM'));
  expect(chip('AEM')).toHaveAttribute('aria-pressed', 'true');
  expect(chip('All')).toHaveAttribute('aria-pressed', 'false');
  expect(cardSlugs(container)).toEqual(AEM.slice(0, 3));
  expect(indexSlugs(container)).toEqual(AEM);
  expect(window.location.hash).toBe('#projects/aem');

  fireEvent.click(chip('All'));
  expect(cardSlugs(container)).toEqual(WORK_ORDER.slice(0, 3));
  expect(indexSlugs(container)).toEqual(WORK_ORDER);
  expect(window.location.hash).toBe('#projects');
});

test('a deep link applies its discipline after mount; a client link is an authoring view and leaves Publisher whole', () => {
  window.history.replaceState(null, '', '/#projects/aem');
  const aem = mount();
  expect(indexSlugs(aem.container)).toEqual(AEM);
  expect(chip('AEM')).toHaveAttribute('aria-pressed', 'true');
  aem.unmount();

  window.history.replaceState(null, '', '/#projects/client/personal');
  const client = mount();
  expect(indexSlugs(client.container)).toEqual(WORK_ORDER);
});

test('the case-study folders file by discipline and client, keep the employer anonymous while locked, and filter the page', () => {
  const { container } = render(
    <MemoryRouter><WorkNavigatorProvider><WorkNavigator /><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>,
  );
  const folders = screen.getByRole('list', { name: 'Case study folders' });
  fireEvent.click(within(folders).getByRole('button', { name: /^AEM/ }));
  expect(indexSlugs(container)).toEqual(AEM);
  // The folder lists the same four, in the same order, under the same links.
  expect(within(folders).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(AEM.map((slug) => `/work/${slug}/`));

  fireEvent.click(within(folders).getByRole('button', { name: /^Client/ }));
  expect(within(folders).getByText(ANON_CLIENT)).toBeInTheDocument();
  expect(folders.textContent).not.toContain('Tire Rack');
  fireEvent.click(screen.getByRole('button', { name: 'Show all work' }));
  expect(indexSlugs(container)).toEqual(WORK_ORDER);
});

test('in Author the selected component offers Cards, List and Grid; Publisher always returns to the default', () => {
  window.sessionStorage.setItem(AUTHOR_KEY, JSON.stringify({ selected: PLAYGROUND, panelOpen: true, panelTab: 'assets' }));
  const { container } = mountWithAuthor();

  const layout = screen.getByRole('group', { name: 'Layout' });
  expect(within(layout).getByRole('button', { name: 'Cards' })).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(within(layout).getByRole('button', { name: 'List' }));
  expect(cardSlugs(container)).toEqual([]);
  expect(indexSlugs(container)).toEqual(WORK_ORDER);

  fireEvent.click(within(layout).getByRole('button', { name: 'Grid' }));
  expect(container.querySelectorAll('.case-playground__tile')).toHaveLength(WORK_ORDER.length);
  expect(container.querySelectorAll('.case-playground__tile .case-playground__preview--plate').length).toBeGreaterThan(0);
  expect(indexSlugs(container)).toEqual([]);
  // The style lasts the tab, in Author's own state, never in localStorage.
  expect(JSON.parse(window.sessionStorage.getItem(AUTHOR_KEY) ?? '{}').workView).toBe('grid');
  expect(window.localStorage.length).toBe(0);

  // Leaving Author is Publisher again: the default layout, no toolbar.
  act(() => { fireEvent.keyDown(window, { key: 'm', metaKey: true, shiftKey: true }); });
  expect(screen.queryByRole('group', { name: 'Layout' })).not.toBeInTheDocument();
  expect(cardSlugs(container)).toEqual(WORK_ORDER.slice(0, 3));
  expect(indexSlugs(container)).toEqual(WORK_ORDER);
});

test('the Asset Panel opens the case-study folders under the Case studies filter, and a client folder filters the page while authoring', () => {
  window.sessionStorage.setItem(AUTHOR_KEY, JSON.stringify({ panelOpen: true, panelTab: 'assets' }));
  const { container } = mountWithAuthor();
  const panel = screen.getByRole('complementary', { name: 'Asset panel' });
  expect(within(panel).queryByRole('list', { name: 'Case study folders' })).not.toBeInTheDocument();

  fireEvent.click(within(panel).getByRole('button', { name: 'Case studies' }));
  const folders = within(panel).getByRole('list', { name: 'Case study folders' });
  fireEvent.click(within(folders).getByRole('button', { name: /^Client/ }));
  fireEvent.click(within(folders).getByRole('button', { name: /^Personal products/ }));
  expect(indexSlugs(container)).toEqual(['playdraft', 'loopstack', 'bolus-binder', 'overscroll-tactics']);
  // No discipline chip claims a client selection.
  expect(within(chips()).getAllByRole('button').every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
});

test('a study goes by one name on its card, its index row and its folder row, and plates carry no number', () => {
  const { container } = render(
    <MemoryRouter><WorkNavigatorProvider><WorkNavigator /><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>,
  );
  const names = (selector: string) => Array.from(container.querySelectorAll(selector)).map((el) => el.textContent);
  const expected = (slugs: string[]) => slugs.map((slug) => cardTitleFor(projects.find((project) => project.slug === slug)!));
  expect(names('.case-playground__card-title')).toEqual(expected(WORK_ORDER.slice(0, 3)));
  expect(names('.case-playground__list .dam__name')).toEqual(expected(WORK_ORDER));

  fireEvent.click(within(screen.getByRole('list', { name: 'Case study folders' })).getByRole('button', { name: /^AEM/ }));
  expect(names('.work-nav__studies .dam__name')).toEqual(expected(AEM));
  expect(names('.case-playground__list .dam__name')).toEqual(expected(AEM));

  // The drawn plates on locked cards say what the system is, not which plate it is.
  expect(container.querySelectorAll('.cover-schematic').length).toBeGreaterThan(0);
  expect(container.textContent).not.toMatch(/Plate \d/);
});
