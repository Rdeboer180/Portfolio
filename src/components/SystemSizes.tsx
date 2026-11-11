// ============================================
// SystemSizes — the three figures in "A design system should come in more
// than one size": the three sizes on one source, the two readers of that
// source, and the drift loop. Real HTML in the board's vocabulary (paper
// cards, hairlines, Menlo tags, one Signal Orange accent), so each one reads
// as a list without its connectors: on phones they stack and the lines drop.
// Connectors are CSS borders, decorative; every relationship is in the copy.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import agents from '../data/system-agents.json';

export const SizesReaders: React.FC = () => (
  <figure className="note-embed sizes sizes--readers">
    <div className="sizes__readers">
      <div className="sizes__side sizes__side--human">
        <p className="sizes__tag">[ person ] reads</p>
        <ul>
          <li className="sizes__item">Gallery</li>
          <li className="sizes__item">Playground</li>
          <li className="sizes__item">Figma library</li>
        </ul>
      </div>
      <p className="sizes__hub">
        <strong className="sizes__title">One source</strong>
        <span className="sizes__tag">DESIGN.md · PRODUCT.md</span>
        <span className="sizes__tag">tokens · components</span>
      </p>
      <div className="sizes__side sizes__side--agent">
        <p className="sizes__tag">[ agent ] reads</p>
        <ul>
          <li className="sizes__item sizes__item--file">AGENTS.md</li>
          <li className="sizes__item sizes__item--file">catalog.json</li>
          <li className="sizes__item sizes__item--file">skills/*.md</li>
        </ul>
      </div>
    </div>
    <figcaption>Agents read their side every time. People read theirs sometimes.</figcaption>
  </figure>
);

const DRIFT_STEPS = [
  { n: 1, who: '', title: 'Ship', body: 'A pattern lands' },
  { n: 2, who: 'agent', title: 'Notice', body: 'New, changed, gone' },
  { n: 3, who: 'agent', title: 'Propose', body: 'Adopt or retire' },
  { n: 4, who: 'person', title: 'Decide', body: 'Yes, no, later' },
  { n: 5, who: '', title: 'Record', body: 'Rule + changelog' },
];

export const DriftLoop: React.FC = () => (
  <figure className="note-embed sizes sizes--drift">
    <ol className="sizes__drift" aria-label="Drift loop, in five steps">
      {DRIFT_STEPS.map((step) => (
        <li key={step.n} className={`sizes__card${step.who === 'person' ? ' sizes__card--ships' : ''}`}>
          <span className="sizes__tag">{step.who ? `[ 0${step.n} ] ${step.who}` : `[ 0${step.n} ]`}</span>
          <strong className="sizes__title">{step.title}</strong>
          <span className="sizes__body">{step.body}</span>
        </li>
      ))}
    </ol>
    <p className="sizes__return">Back to 01 for the next change</p>
    <figcaption>
      After InFlight’s setup, as Tommy Geoco showed it on Dive Radio, 6 November 2026.
    </figcaption>
  </figure>
);

// ── One source, three sizes, and the loop back (canvas D5, Ryan's pick,
// 10 Nov 2026): the sizes read the rules on the left, the source sits in the
// middle, and the drift loop writes back on the right. The steel curtain
// closes the loop: every pull request passes it before a person decides. One
// graph for the homepage, /design-system and the note's opening figure.
const SOURCE_SIZES = [
  { id: 'sketch', title: 'Sketch', who: 'anyone', body: 'Real tokens. Rough layout.' },
  { id: 'playground', title: 'Playground', who: 'the team', body: 'Real components. No production.' },
  { id: 'production', title: 'Production', who: 'reviewed', body: 'The full review.' },
];
// How an agent reads the system, top to bottom. The MCP is the foundation;
// rules and skills sit on top of it. /design-system draws the same list.
export const SOURCE_LAYERS = [
  { name: 'llms.txt', short: 'Where an agent starts', body: 'Where an agent starts: what exists and where to read it.', href: '/llms.txt' },
  { name: 'Rules and skills', short: 'DESIGN.md, AGENTS.md, skills', body: 'AGENTS.md, DESIGN.md, PRODUCT.md and my design-taste skill. How to use what exists.', href: '/system/design.md' },
  { name: 'MCP server', short: `${agents.tools.length} read-only tools`, body: `rdeboer-system: ${agents.tools.length} read-only tools over the generated files.`, href: '/system/mcp.mjs', foundation: true },
  { name: 'Generated from the code', short: 'Catalog, rules, drift', body: 'The catalog, rules and drift files, rewritten on every build.', href: '/system/catalog.json' },
];

export const SystemSource: React.FC<{ embed?: boolean; reviewHref?: string; caption?: boolean }> = ({ embed = true, reviewHref, caption = true }) => (
  <figure className={`${embed ? 'note-embed ' : ''}sizes sizes--source`}>
    <div className="sizes__source">
      <div className="sizes__side-col">
        <p className="sizes__tag sizes__tag--caps">Reads the rules</p>
        <ol className="sizes__stack" aria-label="Three sizes, reading the source">
          {SOURCE_SIZES.map((size) => (
            <li key={size.id} className={`sizes__card sizes__card--${size.id}`}>
              <span className="sizes__tag sizes__size-tag">
                <span className={`sizes__marker sizes__marker--${size.id}`} aria-hidden="true" />
                {size.title} · {size.who}
              </span>
              <span className="sizes__body sizes__body--ink">
                {size.body}
                {size.id === 'production' && reviewHref && <> <Link to={reviewHref} className="sizes__see">See the review <span aria-hidden="true">→</span></Link></>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <span className="sizes__arrow sizes__arrow--in" aria-hidden="true" />
      <div className="sizes__core">
        <strong className="sizes__core-title">One source</strong>
        <ol className="sizes__layers" aria-label="The source, as an agent reads it, top to bottom">
          {SOURCE_LAYERS.map((layer) => (
            <li key={layer.name} className={`sizes__layer${layer.foundation ? ' sizes__layer--foundation' : ''}`}>
              <span className="sizes__layer-name">
                {layer.name}
                {layer.foundation && <><span className="sr-only">, </span><span className="sizes__layer-chip">foundation</span></>}
              </span>
              <span className="sizes__layer-short">{layer.short}</span>
            </li>
          ))}
        </ol>
      </div>
      <span className="sizes__arrow sizes__arrow--out" aria-hidden="true" />
      <div className="sizes__side-col">
        <p className="sizes__tag sizes__tag--caps">Writes back</p>
        <ol className="sizes__loop" aria-label="The drift loop, in five steps">
          {DRIFT_STEPS.map((step) => (
            <li key={step.n} className={`sizes__loop-step${step.who === 'person' ? ' sizes__loop-step--decide' : ''}`}>
              <span className="sizes__tag sizes__loop-who">{step.who}</span>
              <span className="sizes__loop-text">
                <strong className="sizes__loop-title">{step.title}</strong>
                <span className="sizes__body">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="sizes__curtain">Every pull request passes the steel curtain first.</p>
      </div>
    </div>
    {caption && <figcaption>The agent side gets read every time. A person decides what the system keeps.</figcaption>}
  </figure>
);
