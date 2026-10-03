/* Native video attributes, disclosure mounting, and protected artifact URLs require DOM inspection. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CaseStudyPage from './CaseStudyPage';
import projects from '../data/projects';

let mockUnlocked = true;
const mockOpenPrompt = jest.fn();
jest.mock('../context/UnlockContext', () => ({
  useUnlock: () => ({ unlocked: mockUnlocked, openPrompt: mockOpenPrompt }),
}));
jest.mock('../hooks/useReveal', () => ({ useReveal: () => [null, true] }));
jest.mock('framer-motion', () => {
  const React = require('react');
  const element = (tag: string) => ({ custom, variants, initial, animate, whileInView, viewport, onViewportEnter, onViewportLeave, ...props }: any) => React.createElement(tag, props);
  return { useReducedMotion: () => true, motion: { div: element('div'), span: element('span') } };
});

beforeEach(() => {
  mockUnlocked = true;
  mockOpenPrompt.mockClear();
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
});

const mount = (detailOnly = false) => render(<MemoryRouter><CaseStudyPage slug="wheelrack" detailOnly={detailOnly} /></MemoryRouter>);

test('component comparison changes evidence and caption, and lightbox restores focus', () => {
  mount(true);
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

test('PlayDraft opens on a controlled walkthrough and keeps detailed evidence available on demand', () => {
  const { container } = render(<MemoryRouter><CaseStudyPage slug="playdraft" /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1, name: 'PlayDraft' })).toBeInTheDocument();
  const video = container.querySelector('video');
  expect(video).toHaveAttribute('controls');
  expect(video).not.toHaveAttribute('autoplay');
  expect(video).toHaveAttribute('poster', '/images/work/playdraft/playdraft-howtoplay-poster.jpg');
  expect(screen.getByText('Settle it in one session')).toBeInTheDocument();
  expect(container.querySelector('.cs--detail-only')).toBeNull();
  const details = container.querySelector('details')!;
  details.open = true;
  fireEvent(details, new Event('toggle'));
  expect(container.querySelector('.cs--detail-only')).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});


test.each(projects.filter(project => project.overview).map(project => [project.slug]))(
  '%s renders its own compact overview and controlled media when unlocked', slug => {
    const project = projects.find(item => item.slug === slug)!;
    const { container } = render(<MemoryRouter><CaseStudyPage slug={slug} /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: project.overview!.title })).toBeInTheDocument();
    expect(screen.getByText(project.overview!.ownership)).toBeInTheDocument();
    container.querySelectorAll('video').forEach(video => {
      expect(video).toHaveAttribute('controls');
      expect(video).not.toHaveAttribute('autoplay');
    });
    expect(screen.queryByText('Read why I built a product to maintain →') !== null).toBe(slug === 'playdraft');
  }
);

test.each(projects.filter(project => project.overview && project.stream === 'professional').map(project => [project.slug]))(
  '%s keeps the compact evidence behind the existing access gate', slug => {
    mockUnlocked = false;
    const { container } = render(<MemoryRouter><CaseStudyPage slug={slug} /></MemoryRouter>);
    expect(container.querySelector('.project-overview')).toBeNull();
    expect(screen.getByRole('button', { name: /Enter password/i })).toBeInTheDocument();
  }
);
