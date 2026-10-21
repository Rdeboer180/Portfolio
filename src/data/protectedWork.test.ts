import projects from './projects';
import { PROTECTED_WORK, PROTECTED_WORK_NAMES } from './protectedWork';

test('the protected list is exactly the professional stream', () => {
  const professional = projects.filter((p) => p.stream === 'professional').map((p) => p.slug).sort();
  expect(Array.from(PROTECTED_WORK).sort()).toEqual(professional);
});

test('every protected study has a short name for the password prompt', () => {
  for (const slug of Array.from(PROTECTED_WORK)) expect(PROTECTED_WORK_NAMES[slug]?.trim()).toBeTruthy();
});
