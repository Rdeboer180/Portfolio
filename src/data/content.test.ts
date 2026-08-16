import projects from './projects';
import { NOTES as notes } from './notes';

/**
 * Content invariants, executable.
 *
 * These replace the CRA boilerplate test, which asserted the presence of a
 * "learn react" link that has not existed since the first commit — and which
 * failed outright on `import App` because react-router-dom's ESM build does not
 * resolve under CRA's jest transform. A suite that cannot run guards nothing.
 *
 * What is worth guarding here is not the render tree — it is the data, because
 * that is where the rules with real consequences live. PRODUCT.md:45 is a
 * standing promise: real metrics and quotes only, never fabricated numbers or
 * testimonials. A promise a human has to remember is a promise that decays; the
 * tests below make the audit's findings fail the build instead.
 *
 * Deliberately dependency-free (no router, no DOM) so it runs anywhere.
 */

const visible = projects.filter((p) => !p.hidden);

describe('projects', () => {
  it('every visible project has the fields a case-study page renders', () => {
    const missing = visible
      .map((p) => {
        const gaps: string[] = [];
        if (!p.summary?.trim()) gaps.push('summary');
        if (!p.timeToLive?.trim()) gaps.push('timeToLive');
        if (!p.tags?.length) gaps.push('tags');
        if (!p.role?.trim()) gaps.push('role');
        return gaps.length ? `${p.slug}: ${gaps.join(', ')}` : null;
      })
      .filter(Boolean);
    expect(missing).toEqual([]);
  });

  it('has no duplicate slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toEqual(Array.from(new Set(slugs)));
  });

  /**
   * The fabrication guard. Every one of these strings was live on the site
   * before the August 2026 audit — invented reviewers, invented employers, and
   * an invented conversion number — sitting in the design system where they
   * read as real. The check is intentionally blunt: a placeholder name is
   * cheaper to catch here than in someone's screenshot.
   */
  it('contains no placeholder companies, people, or numbers', () => {
    const BANNED = ['Acme Corp', 'Acme Inc', 'Jane Doe', 'John Doe', 'Lorem ipsum'];
    const haystack = JSON.stringify(
      projects.map((p) => ({ ...p, images: undefined, body: undefined })),
    );
    const hits = BANNED.filter((term) =>
      haystack.toLowerCase().includes(term.toLowerCase()),
    );
    expect(hits).toEqual([]);
  });

  /**
   * A bare number is a claim. Metrics must carry a label that scopes them, so
   * "+50%" cannot be read as a whole-business lift when it was one page in one
   * month. Guards against a label being trimmed back to a unit.
   */
  it('every metric has a value and a scoping label', () => {
    const thin = visible.flatMap((p) =>
      p.metrics
        .filter((m) => !m.value?.trim() || m.label.trim().length < 4)
        .map((m) => `${p.slug}: "${m.value}" / "${m.label}"`),
    );
    expect(thin).toEqual([]);
  });
});

describe('notes', () => {
  it('has no duplicate slugs', () => {
    const slugs = notes.map((n) => n.slug);
    expect(slugs).toEqual(Array.from(new Set(slugs)));
  });

  it('every note has a dek short enough to serve as a meta description', () => {
    // Search engines truncate around 160 characters; a dek is also the index
    // row, so a long one wraps the list into paragraphs.
    const long = notes
      .filter((n) => n.dek.length > 160)
      .map((n) => `${n.slug} (${n.dek.length} chars)`);
    expect(long).toEqual([]);
  });

  it('every note has a sortable ISO date matching its display date', () => {
    const bad = notes
      .filter((n) => !/^\d{4}-\d{2}(-\d{2})?$/.test(n.dateISO))
      .map((n) => `${n.slug}: ${n.dateISO}`);
    expect(bad).toEqual([]);
  });
});
