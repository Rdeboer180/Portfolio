// ============================================
// SystemOverview — the "How it works" tab of /design-system: the three sizes,
// how agents reach the system (MCP first), the gates work passes on the way
// out, and the drift still in the open. Everything listed comes from
// src/data/system-agents.json (the same file the MCP server serves) and the
// snapshot the catalog build writes, so the page can't describe a system
// that isn't there.
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SizesLadder } from './SystemSizes';
import agents from '../data/system-agents.json';
import snapshot from '../data/system-snapshot.json';

const SITE = 'https://www.rdeboerdesigns.com';
export const INSTALL = `curl -so ~/rdeboer-system.mjs ${SITE}/system/mcp.mjs\nclaude mcp add rdeboer-system -- node ~/rdeboer-system.mjs`;

const LAYERS = [
  { name: 'llms.txt', body: 'Where an agent starts: what exists and where to read it.', href: '/llms.txt' },
  { name: 'Rules and skills', body: 'AGENTS.md, DESIGN.md, PRODUCT.md and my design-taste skill. How to use what exists.', href: '/system/design.md' },
  { name: 'MCP server', body: `rdeboer-system: ${agents.tools.length} read-only tools over the generated files.`, href: '/system/mcp.mjs', foundation: true },
  { name: 'Generated from the code', body: 'The catalog, rules and drift files, rewritten on every build.', href: '/system/catalog.json' },
];

const CopyInstall: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(INSTALL).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }, () => {});
  };
  return (
    <div className="sysx__install">
      <pre className="sysx__code"><code>{INSTALL}</code></pre>
      <button type="button" className="sysx__copy" onClick={copy} aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

const SystemOverview: React.FC<{ onOpenCatalog: () => void }> = ({ onOpenCatalog }) => (
  <div className="sysx">
    <section className="ds__section">
      <h2 className="ds__section-title">One source, three sizes</h2>
      <p className="sysx__lede">
        Anyone can sketch, the team can play, and only production gets the full review. Each size reads
        the same source. What changes is how much gets checked.
      </p>
      <SizesLadder />
      <ol className="sysx__sizes">
        {agents.sizes.map((size, i) => (
          <li key={size.id} className={`sysx__size${size.id === 'production' ? ' sysx__size--ships' : ''}`}>
            <span className="sysx__tag">[ 0{i + 1} ] {size.who.toLowerCase()}</span>
            <h3 className="sysx__size-title">{size.label}</h3>
            <dl className="sysx__fixed">
              <dt>Fixed</dt><dd>{size.fixed}</dd>
              <dt>Loose</dt><dd>{size.loose}</dd>
            </dl>
            <ul className="sysx__checks">
              {size.checks.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </section>

    <section className="ds__section">
      <h2 className="ds__section-title">Agents reach the system through one door</h2>
      <p className="sysx__lede">
        Most of my ideas start in Claude now, so an agent is the first reader of this system. 18 of the 21
        public systems in Kaelig Deloumeau-Prigent&rsquo;s{' '}
        <a href="https://state-of-ai-in-design-systems.netlify.app/" target="_blank" rel="noopener noreferrer">State of AI in Design Systems</a>{' '}
        ship an official MCP server. <strong>The MCP is the foundation; rules and skills sit on top of it.</strong>
      </p>

      <ol className="sysx__layers" aria-label="How an agent reads this system, top to bottom">
        {LAYERS.map((l) => (
          <li key={l.name} className={`sysx__layer${l.foundation ? ' sysx__layer--foundation' : ''}`}>
            <a className="sysx__layer-name" href={l.href}>{l.name}</a>
            <span className="sysx__layer-body">{l.body}</span>
            {l.foundation && <span className="sysx__chip sysx__chip--live">foundation</span>}
          </li>
        ))}
      </ol>

      <h3 className="ds__subsection-title">The tools</h3>
      <dl className="sysx__tools">
        {agents.tools.map((t) => (
          <div key={t.name} className="sysx__tool">
            <dt><code>{t.name}</code></dt>
            <dd>{t.summary}</dd>
          </div>
        ))}
      </dl>

      <h3 className="ds__subsection-title">Connect it</h3>
      <CopyInstall />
      <p className="sysx__note">
        One file, no dependencies, read-only. It reads what the last deploy published under{' '}
        <a href="/system/catalog.json">/system/</a>. Inside the repo, <code>.mcp.json</code> registers it
        against the working tree instead, and <code>review_change</code> runs the pull-request review before
        there is a pull request. It isn&rsquo;t hosted yet.
      </p>
    </section>

    <section className="ds__section">
      <h2 className="ds__section-title">Agents propose, checks block, I decide</h2>
      <p className="sysx__lede">
        The same rules run three times: while an agent builds, on the pull request, and at deploy. Only the
        deterministic ones block. No model sits in a step that can stop a release.
      </p>
      <ol className="sysx__gates">
        {agents.gates.map((g) => (
          <li key={g.check} className={`sysx__gate${g.status !== 'live' ? ' sysx__gate--todo' : ''}`}>
            <span className="sysx__gate-stage">{g.stage}</span>
            <span className="sysx__gate-check">{g.check}</span>
            <span className="sysx__gate-chips">
              <span className={`sysx__chip sysx__chip--${g.kind}`}>{g.kind}</span>
              <span className={`sysx__chip sysx__chip--${g.status === 'live' ? 'live' : 'todo'}`}>{g.status}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="sysx__note">
        Every pull request passes what Brad Frost calls the steel curtain. Mine checks what the change adds,
        not the debt it inherits, and leaves one comment: what blocks, what to answer, and the registry entries
        it committed for any new component or style block, so the MCP&rsquo;s rules change in the same diff I
        review. It catches the accessibility basics, not a full audit yet.{' '}
        <Link to="/notes/a-design-system-in-more-than-one-size/">Why it works this way &rarr;</Link>
      </p>
      <p className="sysx__status">
        <span className="sysx__tag">[ registry ]</span>
        <span>{snapshot.registered} components taken on</span>
        <span>{snapshot.proposed} proposed, waiting on a person</span>
        <a href="/system/registry.json">registry.json</a>
      </p>
    </section>

    <section className="ds__section">
      <h2 className="ds__section-title">Copy has rules too</h2>
      <p className="sysx__lede">
        How copy reads is part of the system, not a pass at the end. The rules come from my taste skill, and the
        MCP serves them as <code>get_voice</code> and <code>check_copy</code>. <strong>{snapshot.voice.thesis}</strong>
      </p>
      <div className="sysx__voice">
        <dl className="sysx__voice-cols">
          <div>
            <dt>I am</dt>
            <dd>{snapshot.voice.iAm.join(' · ')}</dd>
          </div>
          <div>
            <dt>I am not</dt>
            <dd>{snapshot.voice.iAmNot.join(' · ')}</dd>
          </div>
        </dl>
        <h3 className="ds__subsection-title">One register per piece</h3>
        <dl className="sysx__tools">
          {snapshot.voice.registers.map((r) => (
            <div key={r.register} className="sysx__tool">
              <dt>{r.register}</dt>
              <dd>{r.rule}</dd>
            </div>
          ))}
        </dl>
        <h3 className="ds__subsection-title">What the curtain flags</h3>
        <ul className="sysx__bans" aria-label="Phrases and headings the steel curtain flags in new copy">
          {snapshot.voice.bans.map((b) => <li key={b}><s>{b}</s></li>)}
          {snapshot.voice.labelHeadings.map((h) => <li key={h}><s>{h}</s> as a heading</li>)}
        </ul>
        <p className="sysx__note">
          Those are the only parts a script can check. Whether a piece names its artifact, admits its cost and
          ends open is still a read, mine or an agent&rsquo;s with <code>get_voice</code> in hand.
        </p>
      </div>
    </section>

    <section className="ds__section">
      <h2 className="ds__section-title">Drift, in the open</h2>
      <p className="sysx__lede">
        {snapshot.rawColours} raw colours across {snapshot.componentsWithRawColours} components still sit
        outside the tokens. Most belong to illustrations, where the colour is the drawing. The rest is drift
        the system hasn&rsquo;t absorbed yet.
      </p>
      <ul className="sysx__drift">
        {snapshot.drift.map((d) => (
          <li key={d.name}>
            <code>{d.name}</code>
            <span className="sysx__drift-bar" style={{ width: `${Math.max(4, (d.count / snapshot.drift[0].count) * 100)}%` }} aria-hidden="true" />
            <span className="sysx__drift-count">{d.count}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="sysx__link-btn" onClick={onOpenCatalog}>
        Every component, block and colour in the catalog &rarr;
      </button>
    </section>
  </div>
);

export default SystemOverview;
