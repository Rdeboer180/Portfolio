import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import '../styles/components/_fitment-prototype.scss';

// WheelRack's front/rear purchasing component, rebuilt as a code prototype for
// the note "prototyping-wheelrack-fitment". The states and the closest-
// alternative rule come from the 2024 behavior spec; the sizes, finishes and
// prices are sample data. Beside it an inspector names the state on screen,
// lists each transition's timing, and can slow the motion or show the
// reduced-motion version, so the reader sees what the static frames could not.

type Size = { id: string; label: string; detail: string; dia: number; width: number; offset: number; each: number };

const FRONT: Size[] = [
  { id: 'f1', label: '19x9', detail: '+20mm offset', dia: 19, width: 9, offset: 20, each: 209.02 },
  { id: 'f2', label: '19x9.5', detail: '+15mm offset', dia: 19, width: 9.5, offset: 15, each: 219.5 },
  { id: 'f3', label: '19x9.5', detail: '+25mm offset', dia: 19, width: 9.5, offset: 25, each: 219.5 },
];
const REAR: Size[] = [
  { id: 'r1', label: '20x10', detail: '+30mm offset', dia: 20, width: 10, offset: 30, each: 272.08 },
  { id: 'r2', label: '20x10.5', detail: '+35mm offset', dia: 20, width: 10.5, offset: 35, each: 279.5 },
  { id: 'r3', label: '21x11', detail: '+40mm offset', dia: 21, width: 11, offset: 40, each: 305.25 },
];
// one size for both axles when the vehicle is square
const SQUARE: Size[] = [
  { id: 's1', label: '19x9', detail: '+20mm offset', dia: 19, width: 9, offset: 20, each: 209.02 },
  { id: 's2', label: '19x9.5', detail: '+25mm offset', dia: 19, width: 9.5, offset: 25, each: 219.5 },
];

type Finish = { id: string; name: string; swatch: string; missing: string[] };
const FINISHES: Finish[] = [
  { id: 'black', name: 'Satin Black', swatch: '#2a2b2e', missing: [] },
  { id: 'bronze', name: 'Matte Bronze', swatch: '#7a5a3a', missing: ['f3', 'r2'] },
  { id: 'silver', name: 'Gloss Silver', swatch: '#c9ccd1', missing: ['f2', 'r1', 's2'] },
];

/** The spec's rule: same diameter first, then the nearest width, then the nearest offset. */
export const closestAlternative = (from: Size, options: Size[]): Size =>
  options.reduce((best, s) => {
    const score = (x: Size) => Math.abs(x.dia - from.dia) * 100 + Math.abs(x.width - from.width) * 10 + Math.abs(x.offset - from.offset) / 5;
    return score(s) < score(best) ? s : best;
  });

type StateKey = 'resting' | 'alternative' | 'square' | 'quote';
const STATES: { key: StateKey; name: string; what: string }[] = [
  { key: 'resting', name: 'Resting', what: 'Front and rear set separately; each row prices its set of two, the footer prices the set of four.' },
  { key: 'alternative', name: 'Closest alternative', what: 'A finish without the chosen size. The nearest size is selected, its row is marked, the note explains, and the total follows.' },
  { key: 'square', name: 'Square fitment', what: 'One size on both axles. The rear row folds into the front row, which becomes a set of four.' },
  { key: 'quote', name: 'Quote partner', what: 'The same configuration, with the partner’s purchasing action. Only the label and icon change.' },
];

const MOTION: { change: string; property: string; ms: number; easing: string; reduced: string }[] = [
  { change: 'Changed row is marked', property: 'background', ms: 900, easing: 'ease-out', reduced: 'Static “Changed” tag' },
  { change: 'Note appears', property: 'opacity, translateY 4px', ms: 220, easing: 'cubic-bezier(.2,.8,.2,1)', reduced: 'Appears at once' },
  { change: 'Totals update', property: 'number tween', ms: 240, easing: 'ease-out', reduced: 'Updates at once' },
  { change: 'Rear row folds away', property: 'grid rows 1fr → 0fr, opacity', ms: 280, easing: 'cubic-bezier(.2,.8,.2,1)', reduced: 'Removed at once' },
  { change: 'Action label swaps', property: 'opacity crossfade', ms: 160, easing: 'linear', reduced: 'Swaps at once' },
];

const money = (n: number) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

/** A price that counts to its new value, unless motion is off. */
const Tween: React.FC<{ value: number; ms: number; still: boolean }> = ({ value, ms, still }) => {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (still || ms === 0) { from.current = value; setShown(value); return undefined; }
    const start = performance.now(), a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = value; };
  }, [value, ms, still]);
  return <>{money(shown)}</>;
};

const SizeRow: React.FC<{
  axle: string; tag: string; sizes: Size[]; finish: Finish; picked: string; qty: number;
  onPick: (id: string) => void; onQty: (q: number) => void; changed: boolean; changeKey: number;
  still: boolean; tweenMs: number; reduced: boolean;
}> = ({ axle, tag, sizes, finish, picked, qty, onPick, onQty, changed, changeKey, still, tweenMs, reduced }) => {
  const name = useId();
  const size = sizes.find((s) => s.id === picked)!;
  return (
    <fieldset className={`fp-row${changed ? ' is-changed' : ''}`} key={changed ? changeKey : undefined}>
      <legend className="fp-row__legend"><span className="fp-tag">{tag}</span><span className="sr-only">{axle} size</span></legend>
      <div className="fp-row__sizes">
        {sizes.map((s) => {
          const missing = finish.missing.includes(s.id);
          return (
            <label key={s.id} className={`fp-radio${missing ? ' is-missing' : ''}`}>
              <input type="radio" name={name} value={s.id} checked={picked === s.id} disabled={missing} onChange={() => onPick(s.id)} />
              <span>{s.label} <small>({s.detail}{missing ? ', not in this finish' : ''})</small></span>
            </label>
          );
        })}
      </div>
      <p className="fp-row__spec"><b>Size:</b> {size.label} <small>{size.detail}</small></p>
      <div className="fp-row__buy">
        <label className="fp-qty">
          <span>Quantity</span>
          <select value={qty} onChange={(e) => onQty(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </label>
        <p className="fp-row__price"><small>Set of {qty}</small> <Tween value={size.each * qty} ms={tweenMs} still={still} /></p>
        {changed && reduced && <span className="fp-changed">Changed</span>}
      </div>
    </fieldset>
  );
};

export default function WheelRackFitmentPrototype() {
  const systemReduced = useReducedMotion();
  const [forceReduced, setForceReduced] = useState(false);
  const [slow, setSlow] = useState(false);
  const reduced = systemReduced || forceReduced;
  const k = slow ? 4 : 1;

  const [finish, setFinish] = useState<Finish>(FINISHES[0]);
  const [staggered, setStaggered] = useState(true);
  const [quote, setQuote] = useState(false);
  const [front, setFront] = useState('f3');
  const [rear, setRear] = useState('r2');
  const [square, setSquare] = useState('s2');
  const [fq, setFq] = useState(2), [rq, setRq] = useState(2), [sq, setSq] = useState(4);
  const [changed, setChanged] = useState<string[]>([]);
  const [changeKey, setChangeKey] = useState(0);
  const [announce, setAnnounce] = useState('');

  const pickFinish = (f: Finish) => {
    setFinish(f);
    const moved: string[] = [];
    const fix = (axle: string, current: string, list: Size[], set: (id: string) => void) => {
      if (!f.missing.includes(current)) return;
      const from = list.find((s) => s.id === current)!;
      const next = closestAlternative(from, list.filter((s) => !f.missing.includes(s.id)));
      set(next.id); moved.push(axle);
      return `${axle} changed from ${from.label} ${from.detail} to ${next.label} ${next.detail}.`;
    };
    const lines = staggered
      ? [fix('Front', front, FRONT, setFront), fix('Rear', rear, REAR, setRear)]
      : [fix('Front and rear', square, SQUARE, setSquare)];
    setChanged(moved);
    setChangeKey((n) => n + 1);
    const said = lines.filter(Boolean).join(' ');
    setAnnounce(said ? `${f.name}: your selected finish and fitment combination is unavailable. ${said}` : `${f.name} selected.`);
  };

  const state: StateKey = changed.length ? 'alternative' : !staggered ? 'square' : quote ? 'quote' : 'resting';
  const total = staggered
    ? FRONT.find((s) => s.id === front)!.each * fq + REAR.find((s) => s.id === rear)!.each * rq
    : SQUARE.find((s) => s.id === square)!.each * sq;
  const count = staggered ? fq + rq : sq;

  const style = useMemo(() => ({
    ['--fp-k' as string]: reduced ? 0 : k,
  }), [reduced, k]);
  const tweenMs = reduced ? 0 : 240 * k;

  // a user choice clears the "changed" marks
  const clearMarks = () => { if (changed.length) setChanged([]); };

  return (
    <div className="note-embed fp" style={style}>
      <div className="fp-stage" aria-label="Prototype: WheelRack front and rear wheel configuration, sample data">
        <div className="fp-finish">
          <span className="fp-finish__label" id="fp-finish-label">Finish: <b>{finish.name}</b></span>
          <div className="fp-finish__swatches" role="radiogroup" aria-labelledby="fp-finish-label">
            {FINISHES.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={finish.id === f.id}
                className={`fp-swatch${finish.id === f.id ? ' is-on' : ''}`} style={{ ['--sw' as string]: f.swatch }}
                onClick={() => pickFinish(f)} aria-label={f.name} />
            ))}
          </div>
          <label className="fp-switch">
            <input type="checkbox" checked={!staggered} onChange={(e) => { setStaggered(!e.target.checked); setChanged([]); setAnnounce(e.target.checked ? 'Same size front and rear. One set of four.' : 'Staggered: front and rear sized separately.'); }} />
            <span>Same size front and rear</span>
          </label>
        </div>

        <div className={`fp-axles${staggered ? '' : ' is-square'}`}>
          <div className="fp-axles__front">
            {staggered ? (
              <SizeRow axle="Front" tag="Front" sizes={FRONT} finish={finish} picked={front} qty={fq}
                onPick={(id) => { setFront(id); clearMarks(); }} onQty={(q) => { setFq(q); clearMarks(); }}
                changed={changed.includes('Front')} changeKey={changeKey} still={reduced} tweenMs={tweenMs} reduced={reduced} />
            ) : (
              <SizeRow axle="Front and rear" tag="Front & rear" sizes={SQUARE} finish={finish} picked={square} qty={sq}
                onPick={(id) => { setSquare(id); clearMarks(); }} onQty={(q) => { setSq(q); clearMarks(); }}
                changed={changed.includes('Front and rear')} changeKey={changeKey} still={reduced} tweenMs={tweenMs} reduced={reduced} />
            )}
          </div>
          <div className="fp-axles__rear" aria-hidden={!staggered} inert={!staggered ? true : undefined}>
            <div className="fp-axles__rear-inner">
              <SizeRow axle="Rear" tag="Rear" sizes={REAR} finish={finish} picked={rear} qty={rq}
                onPick={(id) => { setRear(id); clearMarks(); }} onQty={(q) => { setRq(q); clearMarks(); }}
                changed={changed.includes('Rear')} changeKey={changeKey} still={reduced} tweenMs={tweenMs} reduced={reduced} />
            </div>
          </div>
        </div>

        <div className="fp-foot">
          <p className="fp-foot__total"><small>Set of {count}</small> <Tween value={total} ms={tweenMs} still={reduced} /></p>
          <button type="button" className="fp-action">
            <span className={`fp-action__label${quote ? '' : ' is-on'}`} aria-hidden={quote}>Add to cart</span>
            <span className={`fp-action__label${quote ? ' is-on' : ''}`} aria-hidden={!quote}>Get quote</span>
          </button>
        </div>
        {changed.length > 0 && (
          <p className="fp-note" key={changeKey}>
            <b>Note:</b> Your selected finish/fitment combination is unavailable. The closest alternative has been selected on your behalf.
          </p>
        )}
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>
        <p className="fp-sample">Sample sizes and prices. The states and the rule are the spec’s.</p>
      </div>

      <aside className="fp-inspector" aria-label="Prototype inspector">
        <p className="fp-inspector__eyebrow">State</p>
        <ol className="fp-states">
          {STATES.map((s) => (
            <li key={s.key} className={s.key === state ? 'is-on' : undefined} aria-current={s.key === state ? 'step' : undefined}>
              <b>{s.name}</b>
              <span>{s.what}</span>
            </li>
          ))}
        </ol>
        <div className="fp-try">
          <p className="fp-inspector__eyebrow">Try</p>
          <button type="button" onClick={() => pickFinish(FINISHES[1])}>Matte Bronze</button>
          <button type="button" onClick={() => pickFinish(FINISHES[2])}>Gloss Silver</button>
          <button type="button" onClick={() => setQuote((q) => !q)} aria-pressed={quote}>Quote partner</button>
        </div>
        <div className="fp-controls">
          <label><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} disabled={reduced} /> Slow motion ×4</label>
          <label><input type="checkbox" checked={reduced} onChange={(e) => setForceReduced(e.target.checked)} disabled={systemReduced} /> Reduced motion{systemReduced ? ' (your setting)' : ''}</label>
        </div>
        <details className="fp-motion">
          <summary>Motion spec</summary>
          <table>
            <thead><tr><th>Change</th><th>Timing</th><th>Reduced motion</th></tr></thead>
            <tbody>
              {MOTION.map((m) => (
                <tr key={m.change}>
                  <td>{m.change}<small>{m.property}</small></td>
                  <td>{m.ms}ms<small>{m.easing}</small></td>
                  <td>{m.reduced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </aside>
    </div>
  );
}
