import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import WheelRackLibraryTour from './WheelRackLibraryTour';

let mockReduced = false;
jest.mock('framer-motion', () => ({ useReducedMotion: () => mockReduced }));

type TestAnimation = { currentTime: number; play: jest.Mock; pause: jest.Mock; cancel: jest.Mock; onfinish: null | (() => void) };
let animations: TestAnimation[];
beforeEach(() => {
  mockReduced = false;
  animations = [];
  Element.prototype.animate = jest.fn(() => {
    const animation = { currentTime: 0, play: jest.fn(), pause: jest.fn(), cancel: jest.fn(), onfinish: null };
    animations.push(animation);
    return animation as unknown as Animation;
  });
});

const mount = () => {
  const result = render(<WheelRackLibraryTour />);
  result.container.querySelectorAll('image').forEach(image => fireEvent.load(image));
  return result;
};

test('waits for artifacts, then supports pause, chapter seeking, and replay', () => {
  const result = render(<WheelRackLibraryTour />);
  expect(screen.getByRole('button', { name: 'Pause tour' })).toBeDisabled();
  expect(animations).toHaveLength(0);
  result.container.querySelectorAll('image').forEach(image => fireEvent.load(image));
  expect(animations[0].play).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Pause tour' }));
  expect(screen.getByRole('button', { name: 'Play tour' })).toBeEnabled();
  expect(animations[0].pause).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Fitment' }));
  expect(animations.every(animation => animation.currentTime === 14300)).toBe(true);
  expect(screen.getByText('Front and rear selections. Cart and quote variants.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Library' }));
  expect(animations.every(animation => animation.currentTime === 28000)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Replay tour' }));
  expect(animations.every(animation => animation.currentTime === 0)).toBe(true);
  expect(screen.getByRole('button', { name: 'Inputs' })).toHaveAttribute('aria-pressed', 'true');
  result.unmount();
  expect(animations.every(animation => animation.cancel.mock.calls.length > 0)).toBe(true);
});

test('holds the final overview when playback completes', () => {
  mount();
  act(() => animations[0].onfinish?.());
  expect(screen.getByRole('button', { name: 'Replay tour' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-pressed', 'true');
});

test('pauses while the tab is hidden and resumes only if playback was active', () => {
  mount();
  const hidden = jest.spyOn(document, 'hidden', 'get');
  hidden.mockReturnValue(true);
  fireEvent(document, new Event('visibilitychange'));
  const playCount = animations[0].play.mock.calls.length;
  expect(animations[0].pause).toHaveBeenCalled();
  hidden.mockReturnValue(false);
  fireEvent(document, new Event('visibilitychange'));
  expect(animations[0].play).toHaveBeenCalledTimes(playCount + 1);
  fireEvent.click(screen.getByRole('button', { name: 'Pause tour' }));
  hidden.mockReturnValue(true);
  fireEvent(document, new Event('visibilitychange'));
  hidden.mockReturnValue(false);
  fireEvent(document, new Event('visibilitychange'));
  expect(animations[0].play).toHaveBeenCalledTimes(playCount + 1);
  hidden.mockRestore();
});

test('reduced motion shows the overview and offers still chapter views without animation', () => {
  mockReduced = true;
  mount();
  expect(animations).toHaveLength(0);
  expect(screen.queryByRole('button', { name: /tour$/ })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Inputs' }));
  expect(screen.getByRole('button', { name: 'Inputs' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText(/Reduced motion is on/)).toBeInTheDocument();
  expect(animations).toHaveLength(0);
});
