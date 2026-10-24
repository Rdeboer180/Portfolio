/* The unlock accepts exactly the password whose hash the build was given,
   and nothing when it was given none. The real password never appears here. */
import { createHash, webcrypto } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

beforeAll(() => {
  // The browser has WebCrypto; the jsdom CRA pins predates it.
  if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
});

/** The module as a build with this hash (or none) compiles it: it reads the variable once, at load. */
const build = (hash?: string): typeof import('./unlock') => {
  const previous = process.env.REACT_APP_PROJECT_PASSWORD_HASH;
  if (hash === undefined) delete process.env.REACT_APP_PROJECT_PASSWORD_HASH;
  else process.env.REACT_APP_PROJECT_PASSWORD_HASH = hash;
  let unlock: typeof import('./unlock') | undefined;
  jest.isolateModules(() => { unlock = require('./unlock'); });
  if (previous === undefined) delete process.env.REACT_APP_PROJECT_PASSWORD_HASH;
  else process.env.REACT_APP_PROJECT_PASSWORD_HASH = previous;
  return unlock!;
};

test('the one accepted password is the one whose hash the build was given', async () => {
  const { verifyPassword } = build(sha256('a test password'));
  await expect(verifyPassword('a test password')).resolves.toBe(true);
  await expect(verifyPassword('A test password')).resolves.toBe(false);
  await expect(verifyPassword('')).resolves.toBe(false);
});

test('a build without the secret unlocks nothing', async () => {
  const { verifyPassword } = build(undefined);
  await expect(verifyPassword('a test password')).resolves.toBe(false);
  await expect(verifyPassword('')).resolves.toBe(false);
  await expect(build('').verifyPassword('')).resolves.toBe(false);
});

test('the source carries no password hash of its own', () => {
  const source = readFileSync(join(__dirname, 'unlock.ts'), 'utf8');
  expect(source).not.toMatch(/['"`][0-9a-f]{64}['"`]/i);
});
