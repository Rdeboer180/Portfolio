// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (the version CRA pins) predates TextEncoder/TextDecoder being globals,
// but react-router v7 reads them at module scope. Without these two lines every
// suite that transitively imports a router module dies at import time — which
// is why the only test in the repo had been failing rather than testing.
// Node has had both in `util` since v11, so this is a re-export, not a polyfill.
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
