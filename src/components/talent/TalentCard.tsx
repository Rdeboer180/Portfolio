// ============================================
// Talent tree: the result card, in the DOM
// The RPG card from Result.dc.html: name, level, the two-archetype class,
// the pair description, four primary stats as twenty-segment bars, the
// passive ability and current quest, three miniature trees, and the URL.
// Responsive here; the 1200 × 630 rendition for sharing is drawn by
// cardImage.ts from the same cardData(). The stat rows and their segments
// carry an index (--tt-i) so the console's assembling motion can fill them
// in sequence; the class line carries the sweep's span.
// ============================================

import React from 'react';
import type { CardData } from './cardData';
import { LEVEL_ALPHA } from './cardData';

const MiniTrees: React.FC<{ trees: CardData['trees'] }> = ({ trees }) => (
  <svg
    className="tt-card__mini-svg"
    viewBox="0 0 168 44"
    width="168"
    height="44"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {trees.map((tree, ti) => {
      const xs = [4, 13, 22, 31, 40];
      const lit = tree.levels
        .map((lv, i) => ({ lv, x: xs[i] }))
        .sort((a, b) => a.lv - b.lv);
      return (
        <g key={tree.id} transform={`translate(${ti * 62} 0)`}>
          <path
            d="M22 38V26M4 26h36M4 26V8M13 26V8M22 26V8M31 26V8M40 26V8"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.2"
          />
          {lit.filter((b) => b.lv > 0).map((b) => (
            <path
              key={b.x}
              d={b.x === 22 ? 'M22 38V8' : `M22 38V26H${b.x}V8`}
              stroke="#f03d01"
              strokeOpacity={LEVEL_ALPHA[b.lv]}
              strokeWidth="1.4"
            />
          ))}
          {tree.levels.map((lv, i) => (
            <circle
              key={xs[i]}
              cx={xs[i]}
              cy="8"
              r="2.4"
              fill={lv > 0 ? '#f03d01' : '#1b1b1b'}
              fillOpacity={lv > 0 ? LEVEL_ALPHA[lv] : 1}
              stroke={lv > 0 ? 'none' : 'rgba(255,255,255,0.3)'}
              strokeWidth="1"
            />
          ))}
          <circle cx="22" cy="38" r="3" fill="#f03d01" />
        </g>
      );
    })}
  </svg>
);

/** A name past 20 characters steps the class down a size so it never breaks inside the name. */
export function classIsLong(data: Pick<CardData, 'primary' | 'secondary'>): boolean {
  return Math.max(data.primary.length, data.secondary.length) > 20;
}

const TalentCard: React.FC<{ data: CardData }> = ({ data }) => (
  <div className={`tt-card${classIsLong(data) ? ' tt-card--long-class' : ''}`} data-card="talent-card">
    <div className="tt-card__main">
      <div className="tt-card__left">
        <div className="tt-card__id">
          <span className="tt-card__name">{data.name}</span>
          <span className="tt-card__level">{`Level ${data.level} Designer`}</span>
        </div>
        <h3 className="tt-card__class">
          <span className="tt-card__class-line">
            <span className="tt-card__sweep">{data.primary}</span>
            <svg
              className="tt-card__slash"
              viewBox="0 0 26 58"
              width="26"
              height="58"
              fill="none"
              stroke="#8f9daf"
              strokeWidth="3"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M21 5L5 53" />
            </svg>
          </span>
          <span className="tt-card__class-line"><span className="tt-card__sweep">{data.secondary}</span></span>
        </h3>
        <p className="tt-card__desc">{data.description}</p>
        <dl className="tt-card__rows">
          <div className="tt-card__row">
            <dt>Passive ability</dt>
            <dd>{data.passive}</dd>
          </div>
          <div className="tt-card__row">
            <dt>Current quest</dt>
            <dd>{data.quest}</dd>
          </div>
        </dl>
      </div>

      <div className="tt-card__stats">
        <div className="tt-card__stats-head">
          <span>Primary stats</span>
          <span>{`Computed from ${data.pointsSpent} points`}</span>
        </div>
        {data.stats.map((s, si) => (
          <div className="tt-card__stat" key={s.trait} style={{ '--tt-i': si } as React.CSSProperties}>
            <div className="tt-card__stat-row">
              <span className="tt-card__stat-label">{s.label}</span>
              <span className="tt-card__stat-num">{s.score}</span>
            </div>
            <div className="tt-card__bar" role="img" aria-label={`${s.label} ${s.score} of 100`}>
              {s.segments.map((fill, i) => (
                <span key={i} className={`tt-card__seg${fill >= 1 ? ' is-full' : ''}`} style={{ '--tt-i': i } as React.CSSProperties}>
                  {fill > 0 && fill < 1 && (
                    <span className="tt-card__seg-fill" style={{ width: `${Math.round(fill * 100)}%` }} />
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="tt-card__axis" aria-hidden="true">
          <span className="tt-card__axis-rule">
            <span className="tt-card__tick tt-card__tick--0" />
            <span className="tt-card__tick tt-card__tick--50" />
            <span className="tt-card__tick tt-card__tick--100" />
          </span>
          <span className="tt-card__axis-labels"><span>0</span><span>50</span><span>100</span></span>
        </div>
        <p className="tt-card__foot">
          One segment is five points of trait score. Eight traits weighted per node, normalized to 100, top four shown.
        </p>
      </div>
    </div>

    <div className="tt-card__bottom">
      <div className="tt-card__mini">
        <MiniTrees trees={data.trees} />
        <span className="tt-card__mini-text">
          {`${data.trees.length} trees · ${data.areaCount} areas · ${data.masteredCount} mastered`}
        </span>
      </div>
      <span className="tt-card__url">{data.url}</span>
    </div>
  </div>
);

export default TalentCard;
