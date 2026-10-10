import { act, renderHook } from '@testing-library/react';
import { useHeroRoleTransition } from './useHeroRoleTransition';

let reduced = false;
let preferenceListener: (() => void) | undefined;

beforeEach(() => {
  jest.useFakeTimers();
  reduced = false;
  preferenceListener = undefined;
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => { preferenceListener = listener; },
    removeEventListener: jest.fn(),
  }));
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

it('starts on the supplied role and can transition away from it', () => {
  const { result } = renderHook(() => useHeroRoleTransition(1));
  expect(result.current.selectedRole).toBe(1);
  expect(result.current.displayedRole).toBe(1);
  act(() => result.current.selectRole(0));
  expect(result.current.switching).toBe(true);
  act(() => jest.advanceTimersByTime(400));
  expect(result.current.displayedRole).toBe(0);
});

it('selects immediately, keeps the current paragraph during the beat, then reveals the choice', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  expect(result.current.selectedRole).toBe(1);
  expect(result.current.displayedRole).toBe(0);
  expect(result.current.switching).toBe(true);
  act(() => jest.advanceTimersByTime(399));
  expect(result.current.displayedRole).toBe(0);
  act(() => jest.advanceTimersByTime(1));
  expect(result.current.displayedRole).toBe(1);
  expect(result.current.switching).toBe(false);
});

it('never shows an obsolete selection when a newer title is clicked', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  act(() => jest.advanceTimersByTime(200));
  act(() => result.current.selectRole(2));
  act(() => jest.advanceTimersByTime(200));
  expect(result.current.displayedRole).toBe(0);
  act(() => jest.advanceTimersByTime(200));
  expect(result.current.displayedRole).toBe(2);
});

it('does not extend the beat if the same selected title is clicked again', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  act(() => jest.advanceTimersByTime(200));
  act(() => result.current.selectRole(1));
  act(() => jest.advanceTimersByTime(200));
  expect(result.current.displayedRole).toBe(1);
  expect(result.current.switching).toBe(false);
});

it('cancels the beat when returning to the paragraph already on screen', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  act(() => result.current.selectRole(0));
  expect(result.current.switching).toBe(false);
  act(() => jest.advanceTimersByTime(1000));
  expect(result.current.displayedRole).toBe(0);
});

it('keyboard selection replaces pending pointer copy immediately', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  act(() => result.current.selectRole(3, 'keyboard'));
  expect(result.current.displayedRole).toBe(3);
  expect(result.current.switching).toBe(false);
  expect(result.current.input).toBe('keyboard');
  act(() => jest.advanceTimersByTime(1000));
  expect(result.current.displayedRole).toBe(3);
});

it('settles immediately if reduced motion is enabled during a transition', () => {
  const { result } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(2));
  act(() => { reduced = true; preferenceListener?.(); });
  expect(result.current.displayedRole).toBe(2);
  expect(result.current.switching).toBe(false);
  act(() => result.current.selectRole(3));
  expect(result.current.displayedRole).toBe(3);
  expect(result.current.switching).toBe(false);
});

it('clears a pending replacement when the hero unmounts', () => {
  const { result, unmount } = renderHook(useHeroRoleTransition);
  act(() => result.current.selectRole(1));
  expect(jest.getTimerCount()).toBe(1);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});
