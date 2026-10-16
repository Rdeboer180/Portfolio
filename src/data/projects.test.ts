import projects, { cardTitleFor, orderedProjects, yearSpanFor } from './projects';

test('the year span runs from the first year a study names to the last', () => {
  expect(yearSpanFor({ year: '2023 to 2024 design · 2026 launch' })).toBe('2023–2026');
  expect(yearSpanFor({ year: '2024–2026' })).toBe('2024–2026');
  expect(yearSpanFor({ year: '2013\u2013Present' })).toBe('2013–Present');
  expect(yearSpanFor({ year: '2026' })).toBe('2026');
  expect(yearSpanFor({ year: 'Ongoing' })).toBe('Ongoing');
});

test('every listed study has its own short name, and no two share one', () => {
  const listed = orderedProjects();
  expect(listed.every((project) => Boolean(project.cardTitle))).toBe(true);
  const names = listed.map(cardTitleFor);
  expect(new Set(names).size).toBe(names.length);
  // A study without a short name falls back to its full title.
  const { cardTitle, ...withoutCard } = projects[0];
  expect(cardTitleFor(withoutCard)).toBe(projects[0].title);
});
