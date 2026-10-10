import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PaperArtboardGallery from './PaperArtboardGallery';

test('visits all nine artboards and wraps in both directions', () => {
  render(<PaperArtboardGallery />);
  const sources = new Set<string>();
  for (let i = 0; i < 9; i++) {
    sources.add(screen.getByRole('img').getAttribute('src')!);
    expect(screen.getByText(`${i + 1} / 9`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next artboard' }));
  }
  expect(sources.size).toBe(9);
  expect(screen.getByText('1 / 9')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Previous artboard' }));
  expect(screen.getByText('9 / 9')).toBeInTheDocument();
});

test('choosing a board updates the image and full-size link together', () => {
  render(<PaperArtboardGallery />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Choose an artboard' }), { target: { value: '5' } });
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/notes/playdraft-system/home.png');
  expect(screen.getByRole('link', { name: /Open full size/ })).toHaveAttribute('href', '/images/notes/playdraft-system/home.png');
  expect(screen.getByText('6 / 9')).toBeInTheDocument();
});

test('conversation captures use their own count, labels, and navigation', () => {
  render(<PaperArtboardGallery conversation boards={[
    ['chat-direction', 'Direction feedback', 2066, 1632],
    ['chat-handoff', 'Model handoff', 2020, 1464],
    ['chat-review', 'Review decisions', 2304, 1966],
  ]} />);
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Previous capture' }));
  expect(screen.getByText('3 / 3')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('alt', 'Review decisions');
  fireEvent.change(screen.getByRole('combobox', { name: 'Choose a capture' }), { target: { value: '1' } });
  expect(screen.getByRole('link', { name: /Open full size/ })).toHaveAttribute('href', '/images/notes/playdraft-system/chat-handoff.png');
});
