import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import '../styles/components/_clock-prototype.scss';

// PlayDraft's pick on the clock, rebuilt as a code prototype for the note
// "playdraft-pick-on-the-clock". The rules are copied from the app
// (PlayDraft/implementation/category-round-system): snake order from
// draft-order.ts, the expired-turn chain from auto-pick.ts and the draft room
// (queue first, then the visible list's top row, then anything undrafted),
// bots that take the most popular item 650ms into their turn, and the
// on-clock strip that turns red at ten seconds. The room, its players and the
// 20-second clock are sample settings; real rooms run 2 minutes to 8 hours.

type Item = { id: string; title: string; category: string };
const PACK: Item[] = [
  { id: 'reeses', title: 'Reese’s Cups', category: 'Chocolate' },
  { id: 'snickers', title: 'Snickers', category: 'Chocolate' },
  { id: 'twix', title: 'Twix', category: 'Chocolate' },
  { id: 'kitkat', title: 'Kit Kat', category: 'Chocolate' },
  { id: 'mms', title: 'Peanut M&M’s', category: 'Chocolate' },
  { id: 'skittles', title: 'Skittles', category: 'Fruity' },
  { id: 'starburst', title: 'Starburst', category: 'Fruity' },
  { id: 'nerds', title: 'Nerds Gummy Clusters', category: 'Fruity' },
  { id: 'swedish', title: 'Swedish Fish', category: 'Fruity' },
  { id: 'sourpatch', title: 'Sour Patch Kids', category: 'Sour' },
  { id: 'warheads', title: 'Warheads', category: 'Sour' },
  { id: 'sourskittles', title: 'Sour Skittles', category: 'Sour' },
];
const BY_ID = new Map(PACK.map((i) => [i.id, i]));
const CATEGORIES = ['Chocolate', 'Fruity', 'Sour'];
// the pack's popularity axis: bots take chalk, the most popular item left
const POPULAR = ['reeses', 'snickers', 'skittles', 'twix', 'kitkat', 'starburst', 'mms', 'sourpatch', 'nerds', 'swedish', 'sourskittles', 'warheads'];

type Seat = { name: string; me?: boolean };
const SEATS: Seat[] = [{ name: 'Kev' }, { name: 'You', me: true }, { name: 'Maya' }];
const ROUNDS = 3;
const TOTAL = SEATS.length * ROUNDS;
const DEMO_CLOCK = 20;
const BOT_PICK_DELAY_MS = 650;
const EXPIRED_BEAT_MS = 1400;

/** draft-order.ts: round 1 runs 1..N, round 2 runs N..1, and so on. */
const seatFor = (pick: number) => {
  const r = Math.floor(pick / SEATS.length), i = pick % SEATS.length;
  return r % 2 === 1 ? SEATS.length - 1 - i : i;
};
const pickLabel = (pick: number) => `${Math.floor(pick / SEATS.length) + 1}.${String((pick % SEATS.length) + 1).padStart(2, '0')}`;
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

/** auto-pick.ts, as the app has it: the first queued item still draftable, in the player's order. */
export const pickFromQueue = (queue: readonly string[], drafted: Set<string>) => {
  for (const id of queue) {
    const it = BY_ID.get(id);
    if (!it || drafted.has(id)) continue;
    return it;
  }
  return undefined;
};

type Pick = { id: string; seat: number; how: 'pick' | 'auto' | 'bot' };
type Rule = 'queue' | 'visible';

export default function PlayDraftClockPrototype() {
  const systemReduced = useReducedMotion();
  const [forceReduced, setForceReduced] = useState(false);
  const [slow, setSlow] = useState(false);
  const reduced = systemReduced || forceReduced;
  const k = slow && !reduced ? 4 : 1;

  const [rule, setRule] = useState<Rule>('queue');
  const [started, setStarted] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [queue, setQueue] = useState<string[]>(['reeses', 'twix', 'warheads']);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [tab, setTab] = useState<'available' | 'queue'>('available');
  const [clock, setClock] = useState(DEMO_CLOCK);
  const [expired, setExpired] = useState(false);
  const [why, setWhy] = useState('');
  const [announce, setAnnounce] = useState('');

  const drafted = useMemo(() => new Set(picks.map((p) => p.id)), [picks]);
  const ownerOf = useMemo(() => new Map(picks.map((p) => [p.id, SEATS[p.seat].name])), [picks]);
  const pickIndex = picks.length;
  const done = pickIndex >= TOTAL;
  const seat = done ? -1 : seatFor(pickIndex);
  const mine = seat >= 0 && Boolean(SEATS[seat].me);
  const doublePick = !done && pickIndex + 1 < TOTAL && seatFor(pickIndex + 1) === seat;

  const visible = useMemo(() => {
    const q = normalize(search);
    return PACK.filter((i) => !drafted.has(i.id) && (!cat || i.category === cat) && (!q || normalize(i.title).includes(q)));
  }, [drafted, cat, search]);

  // refs, so the timers read the room as it is when they fire
  const live = useRef({ visible, queue, drafted, rule, pickIndex });
  live.current = { visible, queue, drafted, rule, pickIndex };

  const land = useCallback((id: string, how: Pick['how']) => {
    setPicks((ps) => (ps.some((p) => p.id === id) || ps.length >= TOTAL ? ps : [...ps, { id, seat: seatFor(ps.length), how }]));
    const name = SEATS[seatFor(live.current.pickIndex)].name;
    setAnnounce(`${name === 'You' ? 'You' : name} drafted ${BY_ID.get(id)!.title}.`);
  }, []);

  // a bot's turn: chalk, after a beat
  useEffect(() => {
    if (!started || done || mine) return undefined;
    const t = window.setTimeout(() => {
      const top = POPULAR.find((id) => !live.current.drafted.has(id));
      if (top) land(top, 'bot');
    }, BOT_PICK_DELAY_MS * k);
    return () => window.clearTimeout(t);
  }, [started, done, mine, pickIndex, k, land]);

  // your turn: the clock resets, ticks, and drafts for you at zero
  useEffect(() => {
    if (!started || done || !mine) return undefined;
    setClock(DEMO_CLOCK);
    setExpired(false);
    setAnnounce(`You’re on the clock, pick ${pickLabel(pickIndex)}${doublePick ? ', then you pick again' : ''}. ${DEMO_CLOCK} seconds.`);
    return undefined;
  }, [started, done, mine, pickIndex, doublePick]);

  useEffect(() => {
    if (!started || done || !mine || expired) return undefined;
    const t = window.setInterval(() => setClock((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(t);
  }, [started, done, mine, expired, pickIndex]);

  useEffect(() => {
    if (!mine || !started || done) return;
    if (clock === 10) setAnnounce('Ten seconds left.');
    if (clock === 0 && !expired) {
      setExpired(true);
      setAnnounce('Time’s up. Auto-picking for you.');
    }
  }, [clock, mine, started, done, expired]);

  useEffect(() => {
    if (!expired) return undefined;
    const t = window.setTimeout(() => {
      const { visible: v, queue: q, drafted: d, rule: r } = live.current;
      const fromQueue = r === 'queue' ? pickFromQueue(q, d) : undefined;
      const fallback = PACK.find((i) => !d.has(i.id));
      const choice = fromQueue ?? v[0] ?? fallback;
      if (!choice) return;
      const skipped = r === 'queue' ? q.filter((id) => d.has(id)).map((id) => BY_ID.get(id)!.title) : [];
      setWhy(fromQueue
        ? `Took ${choice.title}, your queue’s first item still available${skipped.length ? `, skipping ${skipped.join(' and ')}, already drafted` : ''}.`
        : v[0]
          ? `Took ${choice.title}, the top row of the list as filtered${search || cat ? ` by ${[search && `“${search}”`, cat].filter(Boolean).join(' and ')}` : ''}${r === 'visible' && q.some((id) => !d.has(id)) ? '. Your queue was never read' : ''}.`
          : `Took ${choice.title}: nothing matched the filter, so the clock fell back to the whole pool.`);
      land(choice.id, 'auto');
      setExpired(false);
    }, EXPIRED_BEAT_MS * k);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const reset = () => { setPicks([]); setStarted(false); setExpired(false); setClock(DEMO_CLOCK); setWhy(''); setSearch(''); setCat(null); setQueue(['reeses', 'twix', 'warheads']); setAnnounce('The room is reset.'); };
  const tryBug = () => {
    reset();
    setSearch('sour');
    setTab('available');
    setStarted(true);
  };
  const runOut = () => { if (mine && !expired) setClock(0); };
  const move = (id: string, d: -1 | 1) => setQueue((q) => {
    const i = q.indexOf(id), j = i + d;
    if (j < 0 || j >= q.length) return q;
    const n = [...q]; [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  const state = !started ? 'lobby' : done ? 'done' : expired ? 'expired' : mine ? (clock <= 10 ? 'urgent' : 'mine') : 'waiting';
  const STATES: { key: string; name: string; what: string }[] = [
    { key: 'lobby', name: 'Lobby', what: 'Three seats, snake order. Your queue is already ranked: Reese’s, Twix, Warheads.' },
    { key: 'waiting', name: 'Someone else is up', what: 'A bot takes the most popular item left, 650ms into its turn. The pick lands on the board.' },
    { key: 'mine', name: 'You’re on the clock', what: 'The strip goes gold. On a snake turn it says you pick again.' },
    { key: 'urgent', name: 'Low clock', what: 'Red at ten seconds, announced once to a screen reader.' },
    { key: 'expired', name: 'Time’s up', what: 'The clock says what it is about to do before it does it.' },
    { key: 'done', name: 'Draft complete', what: 'Every lineup and the real pick order.' },
  ];

  const mm = `${Math.floor(clock / 60)}:${String(clock % 60).padStart(2, '0')}`;
  // what the clock would take at 0:00, under the rule in force, shown while it is your turn
  const target = (rule === 'queue' ? pickFromQueue(queue, drafted) : undefined) ?? visible[0] ?? PACK.find((i) => !drafted.has(i.id));
  const fromQueue = rule === 'queue' && Boolean(pickFromQueue(queue, drafted));

  return (
    <div className={`note-embed pdp${reduced ? ' is-reduced' : ''}`} style={{ ['--pd-k' as string]: reduced ? 0 : k }}>
      <div className="pdp-room" aria-label="Prototype: a PlayDraft draft room with sample players and a 20-second clock">
        <div className={`pdp-strip pdp-strip--${state}`}>
          <span className="pdp-strip__avatar" aria-hidden="true">{seat >= 0 ? SEATS[seat].name.charAt(0) : '✓'}</span>
          <span className="pdp-strip__body">
            <b>{!started ? 'Lobby' : done ? 'Draft complete' : expired ? 'Time’s up' : mine ? 'You’re on the clock' : `${SEATS[seat].name} is on the clock`}</b>
            <small>{!started ? 'Three players, three rounds, snake order' : done ? 'Every pick is on the board' : expired ? 'Auto-picking for you…' : `Pick ${pickLabel(pickIndex)}${doublePick ? ' · then picks again (snake turn)' : ''}`}</small>
          </span>
          {doublePick && started && !done && <span className="pdp-strip__x2">×2</span>}
          <span className="pdp-strip__clock" aria-hidden="true">{mine && started && !done ? mm : '·'}</span>
        </div>

        <div className="pdp-board" role="table" aria-label="Draft board">
          <div role="row" className="pdp-board__row pdp-board__row--head">
            {SEATS.map((s, i) => <span role="columnheader" key={s.name} className={i === seat ? 'is-up' : undefined}>{s.name}</span>)}
          </div>
          {Array.from({ length: ROUNDS }, (_, r) => (
            <div role="row" className="pdp-board__row" key={r}>
              {SEATS.map((_, c) => {
                const n = picks.findIndex((p, i) => Math.floor(i / SEATS.length) === r && p.seat === c);
                const p = n >= 0 ? picks[n] : undefined;
                const onIt = !done && Math.floor(pickIndex / SEATS.length) === r && seat === c;
                return (
                  <span role="cell" key={c} className={`pdp-cell${p ? ' is-filled' : ''}${p && n === picks.length - 1 ? ' is-new' : ''}${onIt && started ? ' is-up' : ''}${p?.how === 'auto' ? ' is-auto' : ''}`}>
                    {p ? <>{BY_ID.get(p.id)!.title}{p.how === 'auto' && <em>auto</em>}</> : onIt && started ? 'On the clock' : ''}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {mine && started && !done && !expired && target && (
          <p className="pdp-next">At 0:00 the clock takes <b>{target.title}</b>{fromQueue ? ', from your queue' : search || cat ? ', the top of this filtered list' : ', the top of the list'}.</p>
        )}
        {why && <p className="pdp-why" key={why}><b>Clock:</b> {why}</p>}

        <div className="pdp-panel">
          <div className="pdp-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'available'} onClick={() => setTab('available')}>Available <span>{visible.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === 'queue'} onClick={() => setTab('queue')}>Queue <span>{queue.length}</span></button>
          </div>
          {tab === 'available' ? (
            <div role="tabpanel">
              <input className="pdp-search" type="search" value={search} placeholder="Search the pack" aria-label="Search the pack" onChange={(e) => setSearch(e.target.value)} />
              <div className="pdp-chips">
                {CATEGORIES.map((c) => (
                  <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
                ))}
              </div>
              <ul className="pdp-list">
                {visible.length === 0 && <li className="pdp-list__empty">Nothing matches. The clock would fall back to the whole pool.</li>}
                {visible.map((i, n) => (
                  <li key={i.id} className={n === 0 && rule === 'visible' ? 'is-target' : undefined}>
                    <span>{i.title}<small>{i.category}</small></span>
                    <span className="pdp-list__actions">
                      {!queue.includes(i.id) && <button type="button" onClick={() => setQueue((q) => [...q, i.id])} aria-label={`Queue ${i.title}`}>+ Queue</button>}
                      <button type="button" className="pdp-draft" disabled={!mine || expired || !started} onClick={() => land(i.id, 'pick')}>Draft</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div role="tabpanel">
              <p className="pdp-queue__lead">#1 is your next target. The clock drafts from here.</p>
              <ol className="pdp-list pdp-queue">
                {queue.map((id, n) => {
                  const taken = drafted.has(id);
                  const target = rule === 'queue' && !taken && queue.findIndex((q) => !drafted.has(q)) === n;
                  return (
                    <li key={id} className={`${taken ? 'is-taken' : ''}${target ? ' is-target' : ''}`}>
                      <span>{n + 1}. {taken ? <s>{BY_ID.get(id)!.title}</s> : BY_ID.get(id)!.title}{taken && <small>Taken by {ownerOf.get(id)}, skipped</small>}</span>
                      <span className="pdp-list__actions">
                        <button type="button" onClick={() => move(id, -1)} aria-label={`Move ${BY_ID.get(id)!.title} up`} disabled={n === 0}>↑</button>
                        <button type="button" onClick={() => move(id, 1)} aria-label={`Move ${BY_ID.get(id)!.title} down`} disabled={n === queue.length - 1}>↓</button>
                        <button type="button" onClick={() => setQueue((q) => q.filter((x) => x !== id))} aria-label={`Remove ${BY_ID.get(id)!.title}`}>×</button>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>
        <p className="pdp-sample">Sample room and a 20-second demo clock. The rules are the app’s.</p>
      </div>

      <aside className="pdp-inspector" aria-label="Prototype inspector">
        <p className="pdp-eyebrow">Clock rule</p>
        <div className="pdp-rule" role="radiogroup" aria-label="What the clock drafts at zero">
          <label className={rule === 'queue' ? 'is-on' : undefined}><input type="radio" name="pdp-rule" checked={rule === 'queue'} onChange={() => setRule('queue')} /> Queue first <small>since 15 Aug 2026</small></label>
          <label className={rule === 'visible' ? 'is-on' : undefined}><input type="radio" name="pdp-rule" checked={rule === 'visible'} onChange={() => setRule('visible')} /> Top visible row <small>before the fix</small></label>
        </div>
        <div className="pdp-run">
          {!started ? <button type="button" className="is-primary" onClick={() => setStarted(true)}>Start the draft</button> : <button type="button" onClick={reset}>Reset the room</button>}
          <button type="button" onClick={tryBug}>Try the bug</button>
          <button type="button" onClick={runOut} disabled={!mine || expired || !started}>Run the clock out</button>
        </div>
        <p className="pdp-eyebrow">State</p>
        <ol className="pdp-states">
          {STATES.map((s) => (
            <li key={s.key} className={s.key === state ? 'is-on' : undefined} aria-current={s.key === state ? 'step' : undefined}>
              <b>{s.name}</b><span>{s.what}</span>
            </li>
          ))}
        </ol>
        <div className="pdp-controls">
          <label><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} disabled={reduced} /> Slow motion ×4</label>
          <label><input type="checkbox" checked={reduced} onChange={(e) => setForceReduced(e.target.checked)} disabled={systemReduced} /> Reduced motion{systemReduced ? ' (your setting)' : ''}</label>
        </div>
        <details className="pdp-motion">
          <summary>Motion spec</summary>
          <table>
            <thead><tr><th>Change</th><th>Timing</th><th>Reduced motion</th></tr></thead>
            <tbody>
              <tr><td>Bot pick lands<small>after the turn starts</small></td><td>650ms beat<small>then 420ms settle</small></td><td>Beat kept, no settle</td></tr>
              <tr><td>Strip changes owner<small>colour, background</small></td><td>200ms<small>ease-out</small></td><td>At once</td></tr>
              <tr><td>Low clock<small>red, slow pulse</small></td><td>1s pulse<small>from 10s</small></td><td>Red, no pulse</td></tr>
              <tr><td>Time’s up<small>says what comes next</small></td><td>1.4s beat<small>the app waits on its server</small></td><td>Beat kept</td></tr>
            </tbody>
          </table>
        </details>
      </aside>
    </div>
  );
}
