/* The filter chips, the view toggle, the pager and the lock state meet in the DOM. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CaseStudyPlayground from './CaseStudyPlayground';
import AuthoredSection from './AuthoredSection';
import AuthorSidePanel from './AuthorSidePanel';
import WorkNavigator from './WorkNavigator';
import { WorkNavigatorProvider } from '../context/WorkNavigatorContext';
import { AuthorModeProvider } from '../context/AuthorModeContext';
import { AUTHORED_COMPONENTS } from '../data/authorChrome';
import projects, { ANON_CLIENT, FEATURED, WORK_ORDER, cardTitleFor } from '../data/projects';
import { studiesInGroup } from '../data/workGroups';

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
const AEM = ['aem-component-system', 'tire-categories', 'landing-pages', 'seasonal-content-system'];
// All opens on the featured studies, then continues in WORK_ORDER.
const ALL = [...FEATURED, ...WORK_ORDER.filter((slug) => !FEATURED.includes(slug))];

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
        <AuthoredSection {...AUTHORED_COMPONENTS.playground}>
          <CaseStudyPlayground />
        </AuthoredSection>
      </WorkNavigatorProvider>
    </AuthorModeProvider>
  </MemoryRouter>,
);

const cardSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__card')).map((card) => card.dataset.slug);
const rowSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__list > li')).map((row) => row.dataset.slug);
const tileSlugs = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('.case-playground__tile')).map((tile) => tile.dataset.slug);
const chips = () => screen.getByRole('group', { name: 'Browse by discipline' });
const chip = (label: string) => within(chips()).getByRole('button', { name: label });
const viewButton = (label: string) => within(screen.getByRole('group', { name: 'View' })).getByRole('button', { name: label });
const pager = (container: HTMLElement) => container.querySelector('.case-playground__pager');

test('the section opens on All as cards, led by the featured studies, with the arrows and no side panel', () => {
  const { container } = mount();
  expect(within(chips()).getAllByRole('button').map((button) => button.textContent)).toEqual(['All', 'AEM', 'System Design', 'Product Design']);
  expect(chip('All')).toHaveAttribute('aria-pressed', 'true');
  expect(cardSlugs(container)).toEqual(ALL);
  expect(cardSlugs(container).slice(0, FEATURED.length)).toEqual([...FEATURED]);
  expect(viewButton('Cards')).toHaveAttribute('aria-pressed', 'true');
  expect(pager(container)).not.toHaveClass('case-playground__pager--single');
  expect(screen.getByText('1 / 4')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous case studies' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next case studies' })).toBeEnabled();
  expect(container.querySelector('.side-panel')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Featured' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 3, name: 'PlayDraft: A social drafting game' })).toBeInTheDocument();
});
test('the view toggle is three icon buttons that still say what they do', () => {
  mount();
  const toggle = screen.getByRole('group', { name: 'View' });
  const buttons = within(toggle).getAllByRole('button');
  expect(buttons.map((button) => button.getAttribute('title'))).toEqual(['Cards', 'List', 'Grid']);
  for (const button of buttons) {
    // The glyph is decoration; the word is the accessible name.
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(button.querySelector('.sr-only')?.textContent).toBe(button.getAttribute('title'));
  }
  expect(within(toggle).getByRole('button', { name: 'Cards' })).toHaveAttribute('aria-pressed', 'true');
});

test('a discipline narrows the row and All brings the whole order back', () => {
  const { container } = mount();
  fireEvent.click(chip('AEM'));
  expect(cardSlugs(container)).toEqual(AEM);
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
  expect(window.location.hash).toBe('#projects/aem');
  fireEvent.click(chip('All'));
  expect(cardSlugs(container)).toEqual(ALL);
  expect(window.location.hash).toBe('#projects');
});

test('System Design and Product Design swap in different work', () => {
  const { container } = mount();
  fireEvent.click(chip('System Design'));
  const systems = cardSlugs(container);
  expect(systems).toEqual(studiesInGroup('systems').map((project) => project.slug));
  fireEvent.click(chip('Product Design'));
  const product = cardSlugs(container);
  expect(product).toEqual(studiesInGroup('product').map((project) => project.slug));
  expect(product.filter((slug) => systems.includes(slug))).toEqual([]);
  expect(chip('Product Design')).toHaveAttribute('aria-pressed', 'true');
  expect(window.location.hash).toBe('#projects/product');
});

test('Cards, List and Grid lay out the same filtered set; the pager belongs to Cards; nothing is stored', () => {
  const { container } = mount();
  fireEvent.click(chip('AEM'));
  expect(cardSlugs(container)).toEqual(AEM);

  fireEvent.click(viewButton('List'));
  expect(viewButton('List')).toHaveAttribute('aria-pressed', 'true');
  expect(cardSlugs(container)).toEqual([]);
  expect(rowSlugs(container)).toEqual(AEM);
  expect(pager(container)).toBeNull();

  fireEvent.click(viewButton('Grid'));
  expect(tileSlugs(container)).toEqual(AEM);
  expect(container.querySelectorAll('.case-playground__tile .case-playground__preview--plate')).toHaveLength(4);
  expect(pager(container)).toBeNull();

  fireEvent.click(chip('All'));
  expect(tileSlugs(container)).toEqual(ALL);
  expect(chip('All')).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(viewButton('Cards'));
  expect(cardSlugs(container)).toEqual(ALL);
  expect(screen.getByText('1 / 4')).toBeInTheDocument();
  expect(window.localStorage.length).toBe(0);
});

test('locked studies carry the lock line in every layout, name no client, and each line has its own id', () => {
  const { container, unmount } = mount();
  expect(screen.getAllByText('Password protected')).toHaveLength(7);
  fireEvent.click(viewButton('List'));
  expect(screen.getAllByText('Password protected')).toHaveLength(7);
  expect(container.textContent).not.toContain('Tire Rack');
  const rows = container.querySelectorAll<HTMLElement>('.case-playground__list .dam__item');
  expect(within(rows[0]).getByText(`2023–2026 · ${ANON_CLIENT}`)).toBeInTheDocument();
  expect(rows[0].tagName).toBe('A');
  expect(rows[0]).toHaveAttribute('aria-describedby', 'index-lock-wheelrack');
  expect(container.querySelector('#index-lock-wheelrack')).toHaveTextContent('Password protected');
  const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(container.querySelectorAll('.case-playground__list .dam__thumb--locked')).toHaveLength(6);
  unmount();

  mockUnlocked = true;
  const view = mount();
  expect(screen.queryByText('Password protected')).not.toBeInTheDocument();
  expect(view.container.textContent).toContain('Tire Rack');
});

test('a deep link applies its filter after mount; a client link is an authoring view and leaves Publisher on All', () => {
  window.history.replaceState(null, '', '/#projects/aem');
  const aem = mount();
  expect(cardSlugs(aem.container)).toEqual(AEM);
  expect(chip('AEM')).toHaveAttribute('aria-pressed', 'true');
  aem.unmount();

  window.history.replaceState(null, '', '/#projects/client/personal');
  const client = mount();
  expect(cardSlugs(client.container)).toEqual(ALL);
  expect(chip('All')).toHaveAttribute('aria-pressed', 'true');
});

test('a study goes by one name on its card, its row and its folder row, and plates carry no number', () => {
  const { container } = render(
    <MemoryRouter><WorkNavigatorProvider><WorkNavigator /><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>,
  );
  const names = (selector: string) => Array.from(container.querySelectorAll(selector)).map((el) => el.textContent);
  const expected = (slugs: readonly string[]) => slugs.map((slug) => cardTitleFor(projects.find((project) => project.slug === slug)!));
  expect(names('.case-playground__card-title')).toEqual(expected(ALL));

  fireEvent.click(within(screen.getByRole('list', { name: 'Case study folders' })).getByRole('button', { name: /^AEM/ }));
  expect(names('.work-nav__studies .dam__name')).toEqual(expected(AEM));
  expect(names('.case-playground__card-title')).toEqual(expected(AEM));
  fireEvent.click(viewButton('List'));
  expect(names('.case-playground__list .dam__name')).toEqual(expected(AEM));

  // The drawn plates on locked cards say what the system is, not which plate it is.
  fireEvent.click(viewButton('Cards'));
  expect(container.querySelectorAll('.cover-schematic').length).toBeGreaterThan(0);
  expect(container.textContent).not.toMatch(/Plate \d/);
});

test('the case-study folders file by discipline and client, keep the employer anonymous while locked, and clear to All', () => {
  const { container } = render(
    <MemoryRouter><WorkNavigatorProvider><WorkNavigator /><CaseStudyPlayground /></WorkNavigatorProvider></MemoryRouter>,
  );
  const folders = screen.getByRole('list', { name: 'Case study folders' });
  fireEvent.click(within(folders).getByRole('button', { name: /^AEM/ }));
  expect(cardSlugs(container)).toEqual(AEM);
  expect(within(folders).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(AEM.map((slug) => `/work/${slug}/`));

  fireEvent.click(within(folders).getByRole('button', { name: /^Client/ }));
  expect(within(folders).getByText(ANON_CLIENT)).toBeInTheDocument();
  expect(folders.textContent).not.toContain('Tire Rack');
  fireEvent.click(screen.getByRole('button', { name: 'Show all work' }));
  expect(cardSlugs(container)).toEqual(ALL);
  expect(chip('All')).toHaveAttribute('aria-pressed', 'true');
});

test('the Asset Panel opens the folders under Case studies, a client folder filters the page while authoring, and the toolbar has no layout of its own', () => {
  window.sessionStorage.setItem(AUTHOR_KEY, JSON.stringify({ panelOpen: true, panelTab: 'assets', selected: AUTHORED_COMPONENTS.playground.component }));
  const { container } = mountWithAuthor();
  expect(screen.queryByRole('group', { name: 'Layout' })).not.toBeInTheDocument();
  const panel = screen.getByRole('complementary', { name: 'Asset panel' });
  expect(within(panel).queryByRole('list', { name: 'Case study folders' })).not.toBeInTheDocument();

  fireEvent.click(within(panel).getByRole('button', { name: 'Case studies' }));
  const folders = within(panel).getByRole('list', { name: 'Case study folders' });
  fireEvent.click(within(folders).getByRole('button', { name: /^Client/ }));
  fireEvent.click(within(folders).getByRole('button', { name: /^Personal products/ }));
  expect(cardSlugs(container)).toEqual(['playdraft', 'loopstack', 'bolus-binder', 'overscroll-tactics']);
  // No chip claims a client selection.
  expect(within(chips()).getAllByRole('button').every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
});
