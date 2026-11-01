// One drafter's board in PlayDraft's draft room, for the desk's notes.
// Since 1 Nov it meets the app's results screen halfway: the pack's header
// stays (whose top ten this is), and under it the board is the results card
// (the drafter's avatar, name and draft position, then each pick as a row:
// its number, the title, its category in the category's colour, hairlines
// between). The draft-room chrome that only means something live (the
// arrows, the boxed cells, the on-the-clock strip) is gone. Built
// from the app (PlayDraft repo, implementation/category-round-system) and the
// study's screens (public/images/work/playdraft/playdraft-draft-room-live.png,
// -custom-draft-writein.png): the pack's shield and accent pair in the header,
// the drafter's seat chip with its gold edge, the board's cells with their
// snake arrow and pick number, a pick's category in its category's colour, a
// custom draft's teal WRITE-IN cells, the gold ON THE CLOCK cell, the Queue,
// and the on-the-clock strip under the board. One seat, so the picks are
// numbered in my own order, 1.01 to 1.10, not the app's round.pick.
import React from 'react';
import { ACCENTS, DraftPick, DraftSpec, packOf } from './deskDrafts';

const label = (n: number) => `1.${String(n).padStart(2, '0')}`;

/** one pick on the results card: its number, the title, its category (or Write-in) under it */
const PickRow: React.FC<{ pick: DraftPick | null; n: number; custom: boolean; categories?: Record<string, keyof typeof ACCENTS> }> = ({ pick, n, custom, categories }) => {
  if (!pick) {
    return (
      <li className="pdr__row is-open">
        <span className="pdr__n">{label(n)}</span>
        <span className="pdr__row-body"><b className="pdr__pick">On the clock</b></span>
      </li>
    );
  }
  const tone = pick.cat && categories?.[pick.cat] ? ACCENTS[categories[pick.cat]].primary : undefined;
  const meta = pick.label ?? pick.cat ?? (custom ? 'Write-in' : undefined);
  return (
    <li className="pdr__row">
      <span className="pdr__n">{label(n)}</span>
      <span className="pdr__row-body">
        <b className="pdr__pick">{pick.title}</b>
        {pick.sub && <small className="pdr__sub">{pick.sub}</small>}
        {meta && <small className={`pdr__cat${custom && !pick.cat ? ' is-write-in' : ''}`} style={tone ? ({ '--cat': tone } as React.CSSProperties) : undefined}>{meta}</small>}
      </span>
    </li>
  );
};

/** the room: the pack's header, then the results card: the drafter, and the picks as rows */
export const DraftRoom: React.FC<{ spec: DraftSpec }> = ({ spec }) => {
  const pack = packOf(spec.pack);
  const accent = ACCENTS[pack.accent];
  const custom = Boolean(pack.custom);
  const made = spec.picks.filter(Boolean).length;
  return (
    <div className="pdr" style={{ '--pack': accent.primary, '--pack-deep': accent.secondary } as React.CSSProperties}>
      <div className="pdr__top">
        <img className="pdr__shield" src={pack.shield} alt={`${pack.name} pack shield`} width={44} height={51} />
        <div>
          <span className="pdr__kind">{custom ? 'Custom draft' : `${pack.name} pack`}</span>
          <b className="pdr__title">{spec.title}</b>
        </div>
      </div>
      <div className="pdr__card">
        <div className="pdr__drafter">
          <span className="pdr__avatar" aria-hidden="true">R</span>
          <span className="pdr__drafter-text"><b>RDEBOER</b><small>Draft position 1 · {made} of {spec.picks.length} picks</small></span>
        </div>
        <ol className="pdr__rows" aria-label={`${spec.title}: ${made} of ${spec.picks.length} picks`}>
          {spec.picks.map((p, i) => <PickRow key={i} pick={p} n={i + 1} custom={custom} categories={pack.categories} />)}
        </ol>
      </div>
      {spec.queue && (
        <div className="pdr__queue">
          <p className="pdr__queue-head">Queue ({spec.queue.length}) · in the ten, not yet placed</p>
          <ul>{spec.queue.map((q) => <li key={q.title}><b>{q.title}</b></li>)}</ul>
        </div>
      )}
    </div>
  );
};
