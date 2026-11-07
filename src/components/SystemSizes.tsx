// ============================================
// SystemSizes — the three figures in "A design system should come in more
// than one size": the three sizes on one source, the two readers of that
// source, and the drift loop. Real HTML in the board's vocabulary (paper
// cards, hairlines, Menlo tags, one Signal Orange accent), so each one reads
// as a list without its connectors: on phones they stack and the lines drop.
// Connectors are CSS borders, decorative; every relationship is in the copy.
// ============================================

import React from 'react';

export const SizesLadder: React.FC = () => (
  <figure className="note-embed sizes sizes--ladder">
    <ol className="sizes__ladder" aria-label="Three sizes of one design system">
      <li className="sizes__rung sizes__rung--1">
        <span className="sizes__card">
          <span className="sizes__tag">[ 01 ] anyone</span>
          <strong className="sizes__title">Sketch</strong>
          <span className="sizes__body">Real tokens. Rough layout.</span>
        </span>
      </li>
      <li className="sizes__rung sizes__rung--2">
        <span className="sizes__card sizes__card--team">
          <span className="sizes__tag">[ 02 ] the team</span>
          <strong className="sizes__title">Playground</strong>
          <span className="sizes__body">Real components. No production.</span>
        </span>
      </li>
      <li className="sizes__rung sizes__rung--3">
        <span className="sizes__card sizes__card--ships">
          <span className="sizes__tag">[ 03 ] what ships</span>
          <strong className="sizes__title">Production</strong>
          <span className="sizes__body">The full review.</span>
        </span>
      </li>
    </ol>
    <p className="sizes__rail">One source · DESIGN.md · tokens · components</p>
  </figure>
);

export const SizesReaders: React.FC = () => (
  <figure className="note-embed sizes sizes--readers">
    <div className="sizes__readers">
      <div className="sizes__side sizes__side--human">
        <p className="sizes__tag">[ human ] reads</p>
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
    <figcaption>The agent side gets read every time. The human side, sometimes.</figcaption>
  </figure>
);

const DRIFT_STEPS = [
  { n: 1, who: '', title: 'Ship', body: 'A pattern lands' },
  { n: 2, who: 'agent', title: 'Notice', body: 'New, changed, gone' },
  { n: 3, who: 'agent', title: 'Propose', body: 'Adopt or retire' },
  { n: 4, who: 'human', title: 'Decide', body: 'Yes, no, later' },
  { n: 5, who: '', title: 'Record', body: 'Rule + changelog' },
];

export const DriftLoop: React.FC = () => (
  <figure className="note-embed sizes sizes--drift">
    <ol className="sizes__drift" aria-label="Drift loop, in five steps">
      {DRIFT_STEPS.map((step) => (
        <li key={step.n} className={`sizes__card${step.who === 'human' ? ' sizes__card--ships' : ''}`}>
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
