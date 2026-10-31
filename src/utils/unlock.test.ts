/**
 * @jest-environment node
 */
import { webcrypto } from 'crypto';
import { passwordCore, verifyPassword } from './unlock';

// Jest's node environment leaves out the browser's crypto global
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });

test('the shared password opens however a recruiter types or pastes it', async () => {
  for (const typed of ['#showWork', 'showWork', '#showwork', '#ShowWork ', '(password: #showWork)', 'Password: "#showWork"', '#showWork.']) {
    expect(await verifyPassword(typed)).toBe(true);
  }
});

test('anything else stays locked', async () => {
  for (const typed of ['', '#', '#showWor', 'showworks', '#Continued']) {
    expect(await verifyPassword(typed)).toBe(false);
  }
});

test('the core matches the one /lab/ derives its key from', () => {
  expect(passwordCore('#showWork')).toBe('showwork');
});
