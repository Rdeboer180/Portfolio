import { isReviewPath, reviewHref } from './reviewRoutes';

afterEach(() => window.history.replaceState(null, '', '/'));

test('review scope matches the path boundary and leaves public links unchanged', () => {
  expect(isReviewPath('/dive')).toBe(true);
  expect(isReviewPath('/dive/work/playdraft/')).toBe(true);
  expect(isReviewPath('/diver')).toBe(false);
  expect(reviewHref('/work/playdraft/')).toBe('/work/playdraft/');
});

test('review page links retain queries and fragments without double-prefixing', () => {
  window.history.replaceState(null, '', '/dive/');
  expect(reviewHref('/work/playdraft/?view=full#outcome')).toBe('/dive/work/playdraft/?view=full#outcome');
  expect(reviewHref('https://www.rdeboerdesigns.com/')).toBe('/dive/');
  expect(reviewHref('/dive/notes/')).toBe('/dive/notes/');
  expect(reviewHref('/loopstack-demo/')).toBe('/dive/loopstack-demo/');
  expect(reviewHref('/artifacts/eight-wrong-first-drafts.html')).toBe('/dive/artifacts/eight-wrong-first-drafts.html');
});

test('external destinations and shared assets keep their original URLs', () => {
  window.history.replaceState(null, '', '/dive/');
  for (const href of ['https://www.dive.club/', 'https://wheelrack.com/pitstop/search', '//example.com/demo', 'mailto:ryan@example.com', '#projects', '/images/hero/ryan-deboer-2026.jpeg', '/resume.pdf']) {
    expect(reviewHref(href)).toBe(href);
  }
});
