// ============================================
// SystemCatalogExplorer — the "Catalog" tab of /design-system. Reads the same
// /system/catalog.json and /system/drift.json the MCP server and the
// pull-request review read, after mount (it is never the prerendered tab), so
// it always shows the last deploy as it is.
// ============================================

import React, { useEffect, useMemo, useState } from 'react';

interface Component { name: string; path: string; blocks: string[]; hex: string[] }
interface Catalog { commit: string | null; components: Component[]; tokens: Record<string, string> }
interface Drift { path: string; colours: { hex: string; token: string; value: string; verdict: 'exact' | 'close' | 'none' }[] }

const VERDICT = { exact: 'is exactly', close: 'is close to', none: 'nearest' } as const;

const SystemCatalogExplorer: React.FC = () => {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [drift, setDrift] = useState<Map<string, Drift>>(new Map());
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyDrift, setOnlyDrift] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([
      fetch('/system/catalog.json').then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch('/system/drift.json').then((r) => (r.ok ? r.json() : [])),
    ]).then(([c, d]: [Catalog, Drift[]]) => {
      if (!live) return;
      setCatalog(c);
      setDrift(new Map(d.map((x) => [x.path, x])));
    }, () => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const rows = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    return catalog.components.filter((c) =>
      (!onlyDrift || c.hex.length) &&
      (!q || c.name.toLowerCase().includes(q) || c.blocks.some((b) => b.includes(q))));
  }, [catalog, query, onlyDrift]);

  if (failed) return <p className="sysx__note">The catalog didn&rsquo;t load. It lives at <a href="/system/catalog.json">/system/catalog.json</a>.</p>;
  if (!catalog) return <p className="sysx__note" aria-busy="true">Reading the catalog&hellip;</p>;

  return (
    <section className="ds__section sysx">
      <h2 className="ds__section-title">Catalog</h2>
      <p className="sysx__lede">
        Every component in the code, the class blocks it draws with and any colour outside the tokens, as of
        build <code>{catalog.commit}</code>. The same file the MCP server and the pull-request review read:{' '}
        <a href="/system/catalog.json">catalog.json</a>.
      </p>
      <div className="sysx__filters">
        <label className="sysx__search">
          <span className="sr-only">Search components and blocks</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components and blocks" />
        </label>
        <label className="sysx__toggle">
          <input type="checkbox" checked={onlyDrift} onChange={(e) => setOnlyDrift(e.target.checked)} />
          Only raw colours
        </label>
        <span className="sysx__count" aria-live="polite">{rows.length} of {catalog.components.length}</span>
      </div>
      <ul className="sysx__catalog">
        {rows.map((c) => {
          const d = drift.get(c.path);
          const isOpen = open === c.path;
          return (
            <li key={c.path} className="sysx__row">
              <button type="button" className="sysx__row-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.path)}>
                <span className="sysx__row-name">{c.name}</span>
                <span className="sysx__row-path">{c.path.replace('src/components/', '')}</span>
                {c.hex.length > 0 && <span className="sysx__chip sysx__chip--todo">{c.hex.length} raw</span>}
              </button>
              {isOpen && (
                <div className="sysx__row-body">
                  <p className="sysx__row-label">Blocks</p>
                  <p className="sysx__blocks">{c.blocks.length ? c.blocks.map((b) => <code key={b}>.{b}</code>) : 'None'}</p>
                  {d && (
                    <>
                      <p className="sysx__row-label">Raw colours</p>
                      <ul className="sysx__swatches">
                        {d.colours.map((x) => (
                          <li key={x.hex}>
                            <span className="sysx__swatch" style={{ background: x.hex }} aria-hidden="true" />
                            <code>{x.hex}</code> {VERDICT[x.verdict]} <code>${x.token}</code>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SystemCatalogExplorer;
