// ============================================
// CurtainCaught — the figures in "The gate stopped my redesign": the steel
// curtain's verdict on PR #20 as a receipt, its 59 colour findings to scale,
// the twelve colours it couldn't match, the PR laid across atomic design's
// five stages, and the primary button before and after.
// Note-scale, in the site's vocabulary (paper, hairlines, Menlo, Signal
// Orange where the gate blocked). Stacks on phones.
//
// The swatch values are data: the exact colours the curtain reported, shown
// as themselves. None has a token within reach, which is the point.
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

type Line = { label: string; n?: number; tag: string; tone: 'block' | 'report' | 'pass' | 'zero' };

const RECEIPT: { group: string; lines: Line[] }[] = [
  {
    group: 'Governance · added lines only',
    lines: [
      { label: 'Raw colour, has a token', n: 46, tag: 'Block', tone: 'block' },
      { label: 'Raw colour, none close', n: 13, tag: 'Report', tone: 'report' },
      { label: 'Not in the registry', n: 2, tag: 'Report', tone: 'report' },
      { label: 'Accessibility basics', n: 0, tag: '—', tone: 'zero' },
      { label: 'Copy against my voice rules', n: 0, tag: '—', tone: 'zero' },
    ],
  },
  {
    group: 'Build · before merge',
    lines: [
      { label: 'Build and prerender', tag: 'Pass', tone: 'pass' },
      { label: 'Hydration, every route', tag: 'Pass', tone: 'pass' },
    ],
  },
  {
    group: 'Written back to the system',
    lines: [
      { label: 'Components proposed', n: 2, tag: '+', tone: 'zero' },
      { label: 'Patterns proposed', n: 5, tag: '+', tone: 'zero' },
    ],
  },
];

/** Figure 1: the verdict, as the receipt the curtain checks you out with. */
export const CurtainReceipt: React.FC = () => (
  <figure className="note-embed curtain curtain--receipt">
    <div className="curtain__frame">
      <span className="curtain__handle curtain__handle--tl" aria-hidden="true" />
      <span className="curtain__handle curtain__handle--tr" aria-hidden="true" />
      <span className="curtain__handle curtain__handle--bl" aria-hidden="true" />
      <span className="curtain__handle curtain__handle--br" aria-hidden="true" />
      <div className="curtain__receipt">
        <p className="curtain__receipt-title">Steel curtain</p>
        <p className="curtain__receipt-meta">PR #20 · 11 Nov 2026 · 38 seconds</p>
        {RECEIPT.map((g) => (
          <div key={g.group} className="curtain__receipt-group">
            <p className="curtain__receipt-head">{g.group}</p>
            <ul>
              {g.lines.map((l) => (
                <li key={l.label} className="curtain__line">
                  <span>{l.label}</span>
                  <span className="curtain__n">{l.n ?? ''}</span>
                  <span className={`curtain__tag curtain__tag--${l.tone}`}>{l.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="curtain__verdict">
          <span>Verdict</span>
          <span className="curtain__tag curtain__tag--block">Stopped</span>
        </p>
      </div>
    </div>
    <figcaption>No model in either job. Anyone can read the rule that fired and rerun it.</figcaption>
  </figure>
);

/** Figure 2: the 59 colour findings, to scale, by distance from a token. */
export const CurtainColourBar: React.FC = () => (
  <figure className="note-embed curtain curtain--bar">
    <div
      className="curtain__bar"
      role="img"
      aria-label="59 raw colours: 29 exact token values and 17 near-duplicates, both blocked; 13 with no close token, reported."
    >
      <span className="curtain__seg curtain__seg--exact" style={{ flexGrow: 29 }} />
      <span className="curtain__seg curtain__seg--close" style={{ flexGrow: 17 }} />
      <span className="curtain__seg curtain__seg--none" style={{ flexGrow: 13 }} />
    </div>
    <div className="curtain__legend" aria-hidden="true">
      <div style={{ flexGrow: 29 }}><b>29</b><span className="curtain__key curtain__key--block">exact · blocked</span></div>
      <div style={{ flexGrow: 17 }}><b>17</b><span className="curtain__key curtain__key--block">close · blocked</span></div>
      <div style={{ flexGrow: 13 }}><b>13</b><span className="curtain__key">none · reported</span></div>
    </div>
    <figcaption>Distance is straight-line RGB. Zero is a token typed by hand; under 24 is a near-duplicate.</figcaption>
  </figure>
);

const MATERIALS: { name: string; where: string; swatches: { hex: string; near: string }[] }[] = [
  {
    name: 'Sticker release paper',
    where: 'under a peeling button',
    swatches: [
      { hex: '#dccfb4', near: 'Orange Soft · 31' },
      { hex: '#b9a987', near: 'Steel · 59' },
      { hex: '#8c7d60', near: 'Graphite · 35' },
      { hex: '#5f533d', near: 'Slate · 26' },
    ],
  },
  {
    name: 'iPad metal and glass',
    where: 'edge, rim, bezel, lens',
    swatches: [
      { hex: '#a6abb2', near: 'Steel · 27' },
      { hex: '#7d838b', near: 'Graphite · 35' },
      { hex: '#c3c8ce', near: 'Steel Light · 35' },
      { hex: '#b2b8bf', near: 'Steel · 47' },
      { hex: '#0c0d0f', near: 'Ink · 24' },
      { hex: '#050608', near: 'Ink · 36' },
    ],
  },
  {
    name: 'Between orange steps',
    where: 'a gradient, a highlight',
    swatches: [
      { hex: '#ff9a7a', near: 'Orange Muted · 54' },
      { hex: '#fbd9cd', near: 'Orange Tint · 34' },
    ],
  },
];

/** Figure 3: the twelve colours the curtain couldn't match to a token. */
export const CurtainMaterials: React.FC = () => (
  <figure className="note-embed curtain curtain--materials">
    <div className="curtain__materials">
      {MATERIALS.map((m) => (
        <div key={m.name} className="curtain__material">
          <p className="curtain__material-name">{m.name}</p>
          <p className="curtain__material-where">{m.where}</p>
          <ul className="curtain__swatches">
            {m.swatches.map((s) => (
              <li key={s.hex}>
                <span className="curtain__chip" style={{ background: s.hex }} aria-hidden="true" />
                <code>{s.hex}</code>
                <span className="curtain__near">{s.near}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <figcaption>The nearest token and its distance under each. Ten of twelve are materials.</figcaption>
  </figure>
);

const LADDER: { level: string; built: string; read: string; gap?: boolean }[] = [
  { level: 'Pages', built: 'The simplified homepage', read: 'Diffed against main, added lines only. Prerendered and hydrated every route.' },
  { level: 'Templates', built: 'Layout tokens: a 65ch measure, a fluid gutter, a 360px floor', read: 'No check here yet. Nothing tests layout.', gap: true },
  { level: 'Organisms', built: 'Why me; testimonials in an iPad', read: 'Proposed WhyMe, and named three sections it shares a ground with.' },
  { level: 'Molecules', built: 'HoloSticker; buttons as stickers that peel', read: 'Proposed HoloSticker. Blocked 18 hex values it typed by hand.' },
  { level: 'Atoms', built: 'Seven sticker tokens', read: '46 colours with a token, blocked. 13 without one, reported.' },
];

/** Figure 4: the PR across atomic design's stages, built up and read down. */
export const CurtainLadder: React.FC = () => (
  <figure className="note-embed curtain curtain--ladder">
    <div className="curtain__ladder">
      <p className="curtain__ladder-head" aria-hidden="true"><span>↑</span> Built up in the PR</p>
      <p className="curtain__ladder-head curtain__ladder-head--level" aria-hidden="true">Stage</p>
      <p className="curtain__ladder-head" aria-hidden="true"><span>↓</span> Read down by the curtain</p>
      {LADDER.map((r) => (
        <div key={r.level} className="curtain__row">
          <p className="curtain__cell"><span className="sr-only">{r.level}, built in the PR: </span>{r.built}</p>
          <p className="curtain__cell curtain__cell--level" aria-hidden="true">{r.level}</p>
          <p className={`curtain__cell curtain__cell--read${r.gap ? ' curtain__cell--gap' : ''}`}>
            <span className="sr-only">Read by the curtain: </span>{r.read}
          </p>
        </div>
      ))}
      <p className="curtain__writeback">
        <span aria-hidden="true">↺</span> Written back up: the registry, committed to the same PR.
      </p>
    </div>
  </figure>
);

/** Figure 5: the primary button before the PR, and the real one after. */
export const CurtainButtons: React.FC = () => (
  <figure className="note-embed curtain curtain--buttons">
    <div className="curtain__buttons">
      <div className="curtain__button-side">
        <span className="curtain__side-tag">[ before ]</span>
        <span className="curtain__old-btn" aria-hidden="true">See the redesign</span>
        <p>Signal Orange, white label at 3.9:1.</p>
      </div>
      <div className="curtain__button-side">
        <span className="curtain__side-tag curtain__side-tag--now">[ after · the real one ]</span>
        <Link to="/" className="btn btn--primary btn--md">See the redesign</Link>
        <p>Orange Deep in a foil edge, 5.65:1. Hover it.</p>
      </div>
    </div>
    <figcaption>The contrast fix came from the redesign. The curtain doesn&rsquo;t check contrast yet.</figcaption>
  </figure>
);
