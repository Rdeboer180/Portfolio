// The phone on the desk runs my own build of Loop, the open-source automated
// insulin app: its status screen at iPhone size, drawn at half scale. Every
// part of it answers. Hover the reading and it moves the way a CGM does; the
// chart scrubs; the toolbar opens the carb entry with my custom absorption
// curves (the 8-hour 🍲 and the 12-hour 🥜 among them), my saved meals and the
// rolling 24-hour history; the gear lists the patches in the build.
// The numbers are a demo, not my data, and nothing here is dosing advice.
import React, { useEffect, useMemo, useRef, useState } from 'react';

const W = 393;
const READINGS = [98, 101, 104, 102, 99, 96, 95, 97, 98];

// three hours of history, five minutes apart, settling into range after lunch
const HISTORY = Array.from({ length: 37 }, (_, i) => {
  const t = i / 36;
  return Math.round(98 + 46 * Math.exp(-((t - 0.32) ** 2) / 0.03) - 6 * Math.sin(t * 9) * (1 - t));
});

type Curve = { key: string; emoji: string; label: string; hours: number; custom?: boolean };
const CURVES: Curve[] = [
  { key: 'fast', emoji: '🍭', label: 'Fast', hours: 2.5 },
  { key: 'medium', emoji: '🌮', label: 'Medium', hours: 4 },
  { key: 'slow', emoji: '🍕', label: 'Slow', hours: 6 },
  { key: 'heavy', emoji: '🍲', label: 'Heavy meal', hours: 8, custom: true },
  { key: 'dessert', emoji: '🥜', label: 'Dessert', hours: 12, custom: true },
];
const FAVORITES = [
  { name: 'Pizza night', grams: 60, curve: 'slow' },
  { name: 'Pasta with meat sauce', grams: 75, curve: 'heavy' },
  { name: 'Ice cream, late', grams: 30, curve: 'dessert' },
];
const DAY = [
  { time: '7:12 PM', grams: 60, curve: 'slow' },
  { time: '12:30 PM', grams: 40, curve: 'medium' },
  { time: '8:05 AM', grams: 25, curve: 'fast' },
];
const PATCHES = [
  'Loop 3.14.8, built from my own fork',
  'Parabolic carb absorption in LoopKit',
  'Absorption up to 12 hours, entries up to 4 hours ahead',
  'Presets of 2.5, 4 and 6 hours',
  '🍲 8-hour heavy-meal curve',
  '🥜 12-hour delayed dessert curve',
  'Save a past meal to favorites',
  'Rolling 24-hour carb history',
];
const curveOf = (key: string) => CURVES.find((c) => c.key === key) ?? CURVES[1];

/** a parabolic absorption curve: carbs on board over the next 12 hours, as an SVG path */
const cobPath = (grams: number, hours: number, w: number, h: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = (i / 48) * 12;
    const x = t / hours;
    const left = x >= 1 ? 0 : grams * (1 - (3 * x * x - 2 * x * x * x));
    pts.push(`${((i / 48) * w).toFixed(1)} ${(h - (left / 80) * h).toFixed(1)}`);
  }
  return `M0 ${h}L${pts.join('L')}L${w} ${h}Z`;
};

export const LoopScreen: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const scale = width / W;
  const [reading, setReading] = useState(98);
  const [hovering, setHovering] = useState(false);
  const [ran, setRan] = useState(1);
  const [spin, setSpin] = useState(0);
  const [preMeal, setPreMeal] = useState(false);
  const [workout, setWorkout] = useState(false);
  const [sheet, setSheet] = useState<'carbs' | 'bolus' | 'settings' | null>(null);
  const [curve, setCurve] = useState('dessert');
  const [grams, setGrams] = useState(30);
  const [entry, setEntry] = useState<{ grams: number; curve: string } | null>({ grams: 25, curve: 'medium' });
  const [scrub, setScrub] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const step = useRef(0);

  // hover the reading and it moves, five minutes at a time, the way a CGM does
  useEffect(() => {
    if (!hovering) {
      const t = window.setTimeout(() => { setReading(98); step.current = 0; }, 700);
      return () => window.clearTimeout(t);
    }
    const tick = () => { step.current = (step.current + 1) % READINGS.length; setReading(READINGS[step.current]); };
    tick();
    const id = window.setInterval(tick, 900);
    return () => window.clearInterval(id);
  }, [hovering]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const prev = READINGS[(step.current - 1 + READINGS.length) % READINGS.length];
  const delta = hovering ? reading - prev : 0;
  const arrow = delta >= 3 ? '↗' : delta <= -3 ? '↘' : '→';
  const history = useMemo(() => [...HISTORY.slice(0, -1), reading], [reading]);
  const band = workout ? [140, 160] : preMeal ? [80, 90] : [90, 110];
  const eventually = Math.round(reading + (workout ? 22 : preMeal ? -6 : 6) - (entry ? 0 : 2));

  // the glucose chart: 3 hours back, 2 forward
  const CW = W - 32, CH = 168, lo = 60, hi = 200;
  const xAt = (i: number) => (i / 60) * CW;
  const yAt = (g: number) => CH - ((g - lo) / (hi - lo)) * CH;
  const predict = Array.from({ length: 25 }, (_, i) => reading + (eventually - reading) * (1 - Math.exp(-i / 8)));
  const scrubValue = scrub === null ? null : scrub <= 36 ? history[scrub] : Math.round(predict[scrub - 36]);
  const scrubTime = scrub === null ? '' : scrub <= 36 ? `${Math.round((36 - scrub) * 5)} min ago` : `in ${Math.round((scrub - 36) * 5)} min`;

  const onChart = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setScrub(Math.max(0, Math.min(60, Math.round(((e.clientX - r.left) / r.width) * 60))));
  };

  const stopClick = (e: React.MouseEvent) => {
    // a control inside the screen answers itself; the rest of the phone opens its note
    if ((e.target as Element).closest('button, [data-own-pointer]')) e.stopPropagation();
  };

  return (
    <div className="loop" style={{ width, height }} onClick={stopClick}>
      <div className="loop__app" style={{ width: W, height: height / scale, transform: `scale(${scale})` }}>
        <div className="loop__status"><b>9:41</b><span className="loop__island" /><span className="loop__bars" aria-hidden="true">▂▄▆ ◔ ▮</span></div>

        <div className="loop__hud">
          <button type="button" data-own-pointer className="loop__ring" aria-label={`Loop ran ${ran} minute${ran === 1 ? '' : 's'} ago. Run the loop.`} style={{ '--spin': `${spin}deg` } as React.CSSProperties}
            onClick={() => { setSpin((s) => s + 360); setRan(0); setToast('Looped just now. Next run in 5 min.'); }}>
            <span className="loop__ring-mark" />
            <small>{ran === 0 ? 'now' : `${ran} min`}</small>
          </button>
          <button type="button" data-own-pointer className="loop__bg" aria-label={`Glucose ${reading} milligrams per deciliter, ${arrow === '→' ? 'steady' : arrow === '↗' ? 'rising' : 'falling'}`}
            onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}
            onClick={() => setToast(`${reading} mg/dL from the CGM, ${hovering ? 'live' : '2 min ago'}`)}>
            <span className="loop__bg-value" key={reading}>{reading}</span>
            <span className="loop__bg-unit"><span className="loop__bg-arrow">{arrow}</span>mg/dL</span>
          </button>
          <button type="button" data-own-pointer className="loop__pump" aria-label="Pump: 142 units left, basal 0.85 units an hour" onClick={() => setToast('Pump · 142 U left · basal 0.85 U/hr')}>
            <span className="loop__pump-res"><i style={{ height: '71%' }} /></span>
            <span><b>142 U</b><small>0.85 U/hr</small></span>
          </button>
        </div>
        {workout && <button type="button" data-own-pointer className="loop__override" onClick={() => setWorkout(false)}>❤️ Workout · 140–160 mg/dL · end</button>}

        <div className="loop__charts">
          <section className="loop__card">
            <header><b>Glucose</b><span>{scrubValue !== null ? `${scrubValue} mg/dL · ${scrubTime}` : `Eventually ${eventually} mg/dL`}</span></header>
            <svg data-own-pointer viewBox={`0 0 ${CW} ${CH}`} className="loop__chart" onPointerMove={onChart} onPointerLeave={() => setScrub(null)} role="img" aria-label={`Glucose over the last three hours, now ${reading}, eventually ${eventually}`}>
              <rect x="0" y={yAt(band[1])} width={CW} height={yAt(band[0]) - yAt(band[1])} className="loop__band" />
              {[80, 120, 160].map((g) => <line key={g} x1="0" x2={CW} y1={yAt(g)} y2={yAt(g)} className="loop__grid" />)}
              <line x1={xAt(36)} x2={xAt(36)} y1="0" y2={CH} className="loop__now" />
              <path d={`M${xAt(36)} ${yAt(reading)}${predict.map((g, i) => `L${xAt(36 + i)} ${yAt(g)}`).join('')}`} className="loop__predict" />
              {history.map((g, i) => <circle key={i} cx={xAt(i)} cy={yAt(g)} r={i === 36 ? 4 : 2.6} className={i === 36 ? 'loop__dot loop__dot--now' : 'loop__dot'} />)}
              {scrub !== null && scrubValue !== null && (
                <g><line x1={xAt(scrub)} x2={xAt(scrub)} y1="0" y2={CH} className="loop__scrub" /><circle cx={xAt(scrub)} cy={yAt(scrubValue)} r="5" className="loop__scrub-dot" /></g>
              )}
            </svg>
          </section>
          <section className="loop__card loop__card--small">
            <header><b>Active Insulin</b><span>1.35 U</span></header>
            <svg viewBox={`0 0 ${CW} 60`} className="loop__mini" aria-hidden="true"><path d={`M0 60L0 30Q${CW * 0.2} 8 ${CW * 0.45} 26T${CW} 60Z`} className="loop__iob" /></svg>
          </section>
          <section className="loop__card loop__card--small">
            <header><b>Active Carbohydrates</b><span>{entry ? `${Math.round(entry.grams * 0.8)} g · ${curveOf(entry.curve).emoji} ${curveOf(entry.curve).hours}h` : '0 g'}</span></header>
            <svg viewBox={`0 0 ${CW} 60`} className="loop__mini" aria-hidden="true">{entry && <path d={cobPath(entry.grams, curveOf(entry.curve).hours, CW, 60)} className="loop__cob" />}</svg>
          </section>
          <section className="loop__card loop__card--small">
            <header><b>Insulin Delivery</b><span>0.85 U/hr</span></header>
            <svg viewBox={`0 0 ${CW} 40`} className="loop__mini" aria-hidden="true"><path d={`M0 22H${CW * 0.3}V12H${CW * 0.42}V26H${CW * 0.7}V18H${CW}`} className="loop__basal" /></svg>
          </section>
        </div>

        <nav className="loop__bar" aria-label="Loop toolbar">
          <button type="button" data-own-pointer aria-label="Add carbs" className={sheet === 'carbs' ? 'is-on' : ''} onClick={() => setSheet('carbs')}><span className="loop__ico loop__ico--carbs" /></button>
          <button type="button" data-own-pointer aria-label="Pre-meal preset" aria-pressed={preMeal} className={preMeal ? 'is-on' : ''} onClick={() => { setPreMeal((v) => !v); setToast(preMeal ? 'Pre-meal preset off' : 'Pre-meal: target 80–90 for an hour'); }}><span className="loop__ico loop__ico--premeal" /></button>
          <button type="button" data-own-pointer aria-label="Bolus" className={sheet === 'bolus' ? 'is-on' : ''} onClick={() => setSheet('bolus')}><span className="loop__ico loop__ico--bolus" /></button>
          <button type="button" data-own-pointer aria-label="Workout override" aria-pressed={workout} className={workout ? 'is-on' : ''} onClick={() => setWorkout((v) => !v)}><span className="loop__ico loop__ico--heart" /></button>
          <button type="button" data-own-pointer aria-label="Settings" className={sheet === 'settings' ? 'is-on' : ''} onClick={() => setSheet('settings')}><span className="loop__ico loop__ico--gear" /></button>
        </nav>

        {sheet && (
          <div className="loop__sheet" role="dialog" aria-label={sheet === 'carbs' ? 'Add carb entry' : sheet === 'bolus' ? 'Bolus' : 'This build'}>
            <header>
              <button type="button" data-own-pointer onClick={() => setSheet(null)}>Cancel</button>
              <b>{sheet === 'carbs' ? 'Add Carb Entry' : sheet === 'bolus' ? 'Bolus' : 'My Loop build'}</b>
              {sheet === 'carbs'
                ? <button type="button" data-own-pointer className="loop__save" onClick={() => { setEntry({ grams, curve }); setSheet(null); setToast(`Demo: ${grams} g ${curveOf(curve).emoji} added. Nothing was dosed.`); }}>Save</button>
                : <span />}
            </header>
            {sheet === 'carbs' && (
              <div className="loop__form">
                <div className="loop__row">
                  <span>Amount Consumed</span>
                  <span className="loop__stepper">
                    <button type="button" data-own-pointer aria-label="Five grams less" onClick={() => setGrams((g) => Math.max(5, g - 5))}>−</button>
                    <b>{grams} g</b>
                    <button type="button" data-own-pointer aria-label="Five grams more" onClick={() => setGrams((g) => Math.min(250, g + 5))}>+</button>
                  </span>
                </div>
                <div className="loop__row loop__row--stack">
                  <span>Absorption Time <small>{curveOf(curve).hours} hr · parabolic</small></span>
                  <div className="loop__curves">
                    {CURVES.map((c) => (
                      <button type="button" data-own-pointer key={c.key} aria-pressed={curve === c.key} aria-label={`${c.label}, ${c.hours} hours${c.custom ? ', custom curve' : ''}`} className={curve === c.key ? 'is-on' : ''} onClick={() => setCurve(c.key)}>
                        <span>{c.emoji}</span><small>{c.hours}h</small>{c.custom && <i>custom</i>}
                      </button>
                    ))}
                  </div>
                  <svg viewBox="0 0 330 54" className="loop__preview" aria-hidden="true"><path d={cobPath(grams, curveOf(curve).hours, 330, 54)} className="loop__cob" /></svg>
                </div>
                <h4>Favorite past meals</h4>
                {FAVORITES.map((f) => (
                  <button type="button" data-own-pointer key={f.name} className="loop__list" onClick={() => { setGrams(f.grams); setCurve(f.curve); }}>
                    <span>{curveOf(f.curve).emoji} {f.name}</span><b>{f.grams} g</b>
                  </button>
                ))}
                <h4>Last 24 hours</h4>
                {DAY.map((d) => (
                  <div key={d.time} className="loop__list"><span>{d.time}</span><b>{d.grams} g {curveOf(d.curve).emoji}</b></div>
                ))}
              </div>
            )}
            {sheet === 'bolus' && (
              <div className="loop__form">
                <div className="loop__row"><span>Current Glucose</span><b>{reading} mg/dL</b></div>
                <div className="loop__row"><span>Recommended</span><b>0 U</b></div>
                <p className="loop__fine">In range and the loop is handling it. This screen is a demo: it does not dose, and none of it is advice.</p>
                <button type="button" data-own-pointer className="loop__big" onClick={() => { setSheet(null); setToast('Nothing to deliver. In range.'); }}>Done</button>
              </div>
            )}
            {sheet === 'settings' && (
              <div className="loop__form">
                <p className="loop__fine">Built from my fork of LoopWorkspace. The patches apply on every build:</p>
                {PATCHES.map((p) => <div key={p} className="loop__list"><span>{p}</span></div>)}
              </div>
            )}
          </div>
        )}
        {toast && <div className="loop__toast" role="status">{toast}</div>}
        <span className="loop__home" aria-hidden="true" />
      </div>
    </div>
  );
};
