import { ARCHETYPES } from './archetypes';
import { FAMILY_LABEL, TRAITS } from './types';
import type { Archetype, Family, Trait } from './types';

/**
 * Archetype invariants, executable.
 *
 * The result page composes the pair description and the card from these
 * fields verbatim, so the shape of every string is a contract, not a style
 * preference. The brief's own example sentence is the fixture: if the
 * composition ever drifts, this fails before a visitor sees it.
 *
 * Run: CI=true npx vitest run --globals src/data/talent/archetypes.test.ts
 */

const EM_DASH = '—';
const FAMILIES = Object.keys(FAMILY_LABEL) as Family[];

const kebab = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const nonZero = (a: Archetype) =>
  (Object.entries(a.signature) as [Trait, number][]).filter(([, w]) => w > 0);

const signatureKey = (a: Archetype) =>
  nonZero(a)
    .sort(([x], [y]) => x.localeCompare(y))
    .map(([t, w]) => `${t}:${w.toFixed(2)}`)
    .join('|');

const strings = (a: Archetype) => [a.name, a.line, a.you, a.cares, a.happiest, a.passive, a.quest];

/** Word-boundary match so "the" and "they" do not count as "he". */
const PRONOUN = /\b(you|he|she)\b/i;

const compose = (primary: Archetype, secondary: Archetype) =>
  `${primary.you} You care about ${primary.cares}, but you're happiest ${secondary.happiest}.`;

const byId = (id: string) => {
  const found = ARCHETYPES.find((a) => a.id === id);
  if (!found) throw new Error(`missing archetype ${id}`);
  return found;
};

describe('archetype pool', () => {
  it('holds exactly 64 archetypes', () => {
    expect(ARCHETYPES).toHaveLength(64);
  });

  it('has unique ids and unique names', () => {
    const ids = ARCHETYPES.map((a) => a.id);
    const names = ARCHETYPES.map((a) => a.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('uses the kebab-case of the name as the id', () => {
    const off = ARCHETYPES.filter((a) => a.id !== kebab(a.name)).map((a) => `${a.name} -> ${a.id}`);
    expect(off).toEqual([]);
  });

  it('has eight archetypes in every family', () => {
    const counts = Object.fromEntries(
      FAMILIES.map((f) => [f, ARCHETYPES.filter((a) => a.family === f).length]),
    );
    expect(counts).toEqual(Object.fromEntries(FAMILIES.map((f) => [f, 8])));
  });
});

describe('signatures', () => {
  it('use only known traits with weights in 0..1', () => {
    const bad = ARCHETYPES.flatMap((a) =>
      (Object.entries(a.signature) as [string, number][])
        .filter(([t, w]) => !TRAITS.includes(t as Trait) || w < 0 || w > 1)
        .map(([t, w]) => `${a.id}: ${t}=${w}`),
    );
    expect(bad).toEqual([]);
  });

  it('carry one to four non-zero weights that sum to 1 within 0.02', () => {
    const bad = ARCHETYPES.filter((a) => {
      const live = nonZero(a);
      const sum = live.reduce((acc, [, w]) => acc + w, 0);
      return live.length < 1 || live.length > 4 || Math.abs(sum - 1) > 0.02;
    }).map((a) => `${a.id}: ${signatureKey(a)}`);
    expect(bad).toEqual([]);
  });

  it('are all different from one another', () => {
    const keys = ARCHETYPES.map(signatureKey);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dupes).toEqual([]);
  });
});

describe('copy', () => {
  it('contains no em dashes anywhere', () => {
    const hits = ARCHETYPES.flatMap((a) =>
      strings(a).filter((s) => s.includes(EM_DASH)).map((s) => `${a.id}: ${s}`),
    );
    expect(hits).toEqual([]);
  });

  it('ends `you` with a period', () => {
    const off = ARCHETYPES.filter((a) => !a.you.endsWith('.')).map((a) => a.id);
    expect(off).toEqual([]);
  });

  it('leaves `cares` and `happiest` without a trailing period', () => {
    const off = ARCHETYPES.filter((a) => a.cares.endsWith('.') || a.happiest.endsWith('.')).map(
      (a) => a.id,
    );
    expect(off).toEqual([]);
  });

  it('starts every `happiest` with "when"', () => {
    const off = ARCHETYPES.filter((a) => !a.happiest.startsWith('when ')).map((a) => a.id);
    expect(off).toEqual([]);
  });

  it('ends `passive` and `quest` with a period', () => {
    const off = ARCHETYPES.filter((a) => !a.passive.endsWith('.') || !a.quest.endsWith('.')).map(
      (a) => a.id,
    );
    expect(off).toEqual([]);
  });

  it('keeps `passive` and `quest` free of you, he, and she', () => {
    const off = ARCHETYPES.flatMap((a) =>
      [a.passive, a.quest].filter((s) => PRONOUN.test(s)).map((s) => `${a.id}: ${s}`),
    );
    expect(off).toEqual([]);
  });

  it('never reuses a `you`, `passive`, or `quest` sentence', () => {
    for (const field of ['you', 'passive', 'quest'] as const) {
      const values = ARCHETYPES.map((a) => a[field]);
      const dupes = values.filter((v, i) => values.indexOf(v) !== i);
      expect(dupes).toEqual([]);
    }
  });
});

describe('composition', () => {
  it('reproduces the brief\'s Guardrail Architect / Prototype Alchemist sentence exactly', () => {
    const primary = byId('guardrail-architect');
    const secondary = byId('prototype-alchemist');
    expect(compose(primary, secondary)).toBe(
      'You build enough structure for experimentation to move fast without becoming chaos. ' +
        'You care about the system underneath the work, but you\'re happiest when you\'re turning ' +
        'an uncertain idea into something real enough to test.',
    );
  });
});
