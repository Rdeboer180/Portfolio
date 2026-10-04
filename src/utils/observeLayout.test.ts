import { observeLayout } from './observeLayout';

test('resize deliveries batch geometry writes into a later frame and cancel on unmount', () => {
  let deliver: () => void = () => {};
  const observe = jest.fn();
  const disconnect = jest.fn();
  const original = global.ResizeObserver;
  global.ResizeObserver = jest.fn(callback => { deliver = () => callback([], {} as ResizeObserver); return { observe, disconnect, unobserve: jest.fn() }; });
  let frame: FrameRequestCallback = () => {};
  const request = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { frame = callback; return 7; });
  const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  const draw = jest.fn();
  const cleanup = observeLayout([document.createElement('div')], draw);
  deliver(); deliver(); deliver();
  expect(draw).not.toHaveBeenCalled();
  expect(request).toHaveBeenCalledTimes(1);
  frame(0);
  expect(draw).toHaveBeenCalledTimes(1);
  deliver();
  cleanup();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(cancel).toHaveBeenCalledWith(7);
  request.mockRestore(); cancel.mockRestore(); global.ResizeObserver = original;
});
