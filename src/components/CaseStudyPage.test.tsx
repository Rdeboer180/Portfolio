import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CaseStudyPage from './CaseStudyPage';

let mockUnlocked = true;
const mockOpenPrompt = jest.fn();
jest.mock('../context/UnlockContext', () => ({
  useUnlock: () => ({ unlocked: mockUnlocked, openPrompt: mockOpenPrompt }),
}));
jest.mock('../hooks/useReveal', () => ({ useReveal: () => [null, true] }));
jest.mock('framer-motion', () => ({ useReducedMotion: () => true }));

beforeEach(() => {
  mockUnlocked = true;
  mockOpenPrompt.mockClear();
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
});

const mount = () => render(<MemoryRouter><CaseStudyPage slug="wheelrack" /></MemoryRouter>);

test('component comparison changes evidence and caption, and lightbox restores focus', () => {
  mount();
  const controls = screen.getByRole('group', { name: 'Product component states' });
  const quote = within(controls).getByRole('button', { name: 'Get quote' });
  fireEvent.click(quote);
  expect(quote).toHaveAttribute('aria-pressed', 'true');
  expect(within(controls).getByRole('button', { name: 'Front / rear' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByText(/The quote variant keeps/)).toBeInTheDocument();

  const image = screen.getByRole('button', { name: /Open Front and rear product component using the Get Quote/ });
  fireEvent.click(image);
  const dialog = screen.getByRole('dialog', { name: 'Image lightbox' });
  expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/images/work/wheelrack/evidence/product-variants.png');
  expect(within(dialog).getByRole('button', { name: 'Close lightbox' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(image).toHaveFocus();
});

test('locked case study keeps new artifacts, ownership detail, and comparison behind the existing gate', () => {
  mockUnlocked = false;
  const { container } = mount();
  expect(screen.queryByRole('group', { name: 'Product component states' })).not.toBeInTheDocument();
  expect(screen.queryByRole('group', { name: 'Library tour chapters' })).not.toBeInTheDocument();
  expect(container.querySelector('img[src*="/evidence/"]')).toBeNull();
  expect(screen.queryByText(/Cheryl Carpenter owned/)).not.toBeInTheDocument();
  expect(screen.queryByText('Cheryl Carpenter')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /WheelRack: A shared system/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Enter password/i }));
  expect(mockOpenPrompt).toHaveBeenCalledWith();
});
