import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import '../styles/components/_wheelrack-library-tour.scss';

const ROOT = '/images/work/wheelrack/';
const SOURCES = {
  forms: ['evidence/form-documentation.png', 2100, 3569],
  filters: ['evidence/filter-states.png', 3604, 5185],
  product: ['evidence/product-variants.png', 6901, 9906],
  fitment: ['evidence/fitment-states.png', 6466, 7179],
  buttons: ['supporting/opportunity/wheelrack-design-system-05.png', 1373, 2507],
  colors: ['supporting/opportunity/wheelrack-design-system-02.png', 2794, 1407],
  type: ['evidence/typography.png', 1445, 2512],
  space: ['evidence/structure-tokens.png', 1445, 2471],
} as const;

// Presentation windows into the original artifacts. No UI has been recreated.
const VIEWS: { label: string; source: keyof typeof SOURCES; crop: number[]; reveal: number }[] = [
  { label: 'Inputs / every state', source: 'forms', crop: [455, 1425, 1125, 550], reveal: 0 },
  { label: 'Checkboxes + radios', source: 'forms', crop: [485, 2100, 1260, 255], reveal: 4800 },
  { label: 'Dropdowns / open + closed', source: 'forms', crop: [480, 2460, 1550, 1010], reveal: 5100 },
  { label: 'Buttons / size + icon', source: 'buttons', crop: [450, 335, 815, 545], reveal: 5400 },
  { label: 'Filters / hover + focus', source: 'filters', crop: [120, 335, 1860, 455], reveal: 8700 },
  { label: 'Pricing / expanded', source: 'filters', crop: [825, 1350, 335, 880], reveal: 9050 },
  { label: 'Front + rear / add to cart', source: 'product', crop: [80, 1650, 850, 485], reveal: 12100 },
  { label: 'Partner variant / get quote', source: 'product', crop: [3690, 1650, 850, 485], reveal: 12400 },
  { label: 'Availability / recovery', source: 'fitment', crop: [2600, 1060, 955, 565], reveal: 15800 },
  { label: 'Dealer view / desktop', source: 'fitment', crop: [158, 190, 1367, 1575], reveal: 17900 },
  { label: 'Dealer view / mobile', source: 'fitment', crop: [1610, 190, 380, 2270], reveal: 18200 },
  { label: 'Empty results / next step', source: 'fitment', crop: [2220, 3850, 1320, 1120], reveal: 18500 },
  { label: 'Color / shared palette', source: 'colors', crop: [0, 0, 2794, 1407], reveal: 18800 },
  { label: 'Typography / partner exception', source: 'type', crop: [475, 175, 920, 420], reveal: 19100 },
  { label: 'Spacing / shared values', source: 'space', crop: [480, 167, 880, 220], reveal: 19400 },
  { label: 'Radius + icon scale', source: 'space', crop: [480, 410, 880, 545], reveal: 19700 },
];

const DURATION = 28000;
const pose = (x: number, y: number, scale: number) => `translate(${50 - x * scale}%, ${50 - y * scale}%) scale(${scale})`;
const OVERVIEW = pose(50, 50, 1);
const CHAPTERS = [
  { label: 'Inputs', at: 0, seek: 2200, pose: pose(14, 14, 3.1), title: 'Start with one control.', note: 'The same input, with focus, error, and disabled states.' },
  { label: 'Controls', at: 4800, seek: 7000, pose: pose(62, 14, 1.75), title: 'Then account for the variations.', note: 'Sizes, icons, selections, and open states.' },
  { label: 'Filters', at: 8700, seek: 10800, pose: pose(26, 38, 2.2), title: 'Carry those rules into the filters.', note: 'Hover and keyboard focus are specified together.' },
  { label: 'Fitment', at: 12100, seek: 14300, pose: pose(74, 38, 2.1), title: 'Build up to the purchasing component.', note: 'Front and rear selections. Cart and quote variants.' },
  { label: 'Recovery', at: 15800, seek: 17600, pose: pose(14, 62, 2.8), title: 'Include the unavailable combinations.', note: 'The warning explains what changed.' },
  { label: 'Library', at: 18800, seek: DURATION, pose: OVERVIEW, title: 'Pull back. The rules repeat across the library.', note: 'Foundations, controls, product views, and the states between them.' },
];

// The long camera moves are an explanatory sequence, not control-response timing.
const CAMERA = [
  [0, pose(14, 14, 3.2)], [4600, pose(14, 14, 3.05)],
  [6300, pose(62, 14, 1.75)], [8500, pose(62, 14, 1.7)],
  [10300, pose(26, 38, 2.2)], [11900, pose(26, 38, 2.15)],
  [13700, pose(74, 38, 2.1)], [15500, pose(74, 38, 2.05)],
  [17300, pose(14, 62, 2.8)], [18400, pose(14, 62, 2.75)],
  [22600, OVERVIEW], [DURATION, OVERVIEW],
] as const;

export default function WheelRackLibraryTour() {
  const reduced = useReducedMotion();
  const host = useRef<HTMLElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const animations = useRef<Animation[]>([]);
  const activeChapter = useRef(reduced ? 5 : 0);
  const loaded = useRef(new Set<number>());
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [playing, setPlaying] = useState(!reduced);
  const [finished, setFinished] = useState(false);
  const [chapter, setChapter] = useState(reduced ? 5 : 0);
  const [prepared, setPrepared] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!host.current || typeof IntersectionObserver === 'undefined') {
      setNear(true); setInView(true); return;
    }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: '400px' });
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    preload.observe(host.current); observer.observe(host.current);
    return () => { preload.disconnect(); observer.disconnect(); };
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onLoad = useCallback((index: number) => {
    loaded.current.add(index);
    if (loaded.current.size === VIEWS.length) setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !camera.current || !progress.current) return;
    if (reduced || !camera.current.animate) {
      setPlaying(false); setChapter(5);
      camera.current.style.transform = OVERVIEW;
      setPrepared(true);
      return;
    }
    const tour = camera.current.animate(CAMERA.map(([time, transform]) => ({
      offset: time / DURATION, transform, easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
    })), { duration: DURATION, fill: 'both' });
    const meter = progress.current.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: DURATION, fill: 'both' });
    const cards = Array.from(camera.current.querySelectorAll<HTMLElement>('.wr-tour__card')).map((card, index) => {
      const start = VIEWS[index].reveal / DURATION;
      return card.animate([
        { offset: 0, opacity: index === 0 ? 1 : 0, transform: 'translateY(12px) scale(0.97)' },
        ...(index ? [{ offset: start, opacity: 0, transform: 'translateY(12px) scale(0.97)' }] : []),
        { offset: Math.min(1, start + 600 / DURATION), opacity: 1, transform: 'translateY(0) scale(1)', easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        { offset: 1, opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: DURATION, fill: 'both' });
    });
    animations.current = [tour, meter, ...cards];
    animations.current.forEach(animation => { animation.pause(); animation.currentTime = 0; });
    tour.onfinish = () => { setFinished(true); setPlaying(false); setChapter(5); };
    setPrepared(true);
    return () => { animations.current.forEach(animation => animation.cancel()); animations.current = []; };
  }, [ready, reduced]);

  useEffect(() => {
    if (!prepared || reduced) return;
    const active = playing && inView && visible;
    animations.current.forEach(animation => active ? animation.play() : animation.pause());
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const time = Number(animations.current[0]?.currentTime || 0);
      const index = CHAPTERS.reduce((current, item, i) => time >= item.at ? i : current, 0);
      if (activeChapter.current !== index) {
        activeChapter.current = index;
        setChapter(index);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView, visible, prepared, reduced]);

  const seek = (index: number) => {
    activeChapter.current = index;
    setPlaying(false); setFinished(index === 5); setChapter(index);
    if (animations.current.length) {
      animations.current.forEach(animation => { animation.pause(); animation.currentTime = CHAPTERS[index].seek; });
    } else if (camera.current) camera.current.style.transform = CHAPTERS[index].pose;
  };

  const toggle = () => {
    if (finished) {
      animations.current.forEach(animation => { animation.pause(); animation.currentTime = 0; });
      activeChapter.current = 0;
      setChapter(0); setFinished(false); setPlaying(true);
    } else setPlaying(value => !value);
  };

  return (
    <figure ref={host} className="wr-tour" aria-label="WheelRack component library tour">
      <div className="wr-tour__heading">
        <span className="wr-tour__eyebrow">WheelRack / component library</span>
        <span className="wr-tour__index" aria-hidden="true">{String(chapter + 1).padStart(2, '0')} / 06</span>
        <p>{CHAPTERS[chapter].title}</p>
      </div>
      <div className={`wr-tour__viewport${!prepared ? ' is-loading' : ''}`} aria-hidden="true">
        <div ref={camera} className="wr-tour__camera">
          {near && VIEWS.map((view, index) => {
            const [src, width, height] = SOURCES[view.source];
            const [x, y, cropWidth, cropHeight] = view.crop;
            return (
              <div key={view.label} className="wr-tour__card" style={{ left: `${3 + index % 4 * 24}%`, top: `${3 + Math.floor(index / 4) * 24}%` }}>
                <span className="wr-tour__card-label">{view.label}</span>
                <div className="wr-tour__sample">
                  <svg viewBox={`0 0 ${cropWidth} ${cropHeight}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <svg viewBox={`${x} ${y} ${cropWidth} ${cropHeight}`} width={cropWidth} height={cropHeight} overflow="hidden">
                      <image href={ROOT + src} width={width} height={height}
                        onLoad={() => onLoad(index)} onError={() => { setFailed(true); onLoad(index); }} />
                    </svg>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
        {!prepared && <span className="wr-tour__loading">Loading the library…</span>}
      </div>
      <div className="wr-tour__annotation" aria-live={playing ? 'off' : 'polite'}>
        <span aria-hidden="true">↳</span><p>{CHAPTERS[chapter].note}</p>
      </div>
      <div className="wr-tour__progress" aria-hidden="true"><span ref={progress} /></div>
      <div className="wr-tour__controls">
        <div className="wr-tour__chapters" role="group" aria-label="Library tour chapters">
          {CHAPTERS.map((item, index) => <button type="button" key={item.label} disabled={!prepared} aria-pressed={index === chapter} onClick={() => seek(index)}>{item.label}</button>)}
        </div>
        {!reduced && <button type="button" className="wr-tour__play" disabled={!prepared || !animations.current.length} onClick={toggle}>
          {finished ? 'Replay tour' : playing ? 'Pause tour' : 'Play tour'}
        </button>}
      </div>
      <figcaption className="cs__caption">
        {failed ? 'Some library images could not load. Reload the page to try again.' : 'A tour through the documented library: input states, filters, purchasing components, responsive views, and foundations.'}
        {reduced && ' Reduced motion is on. Choose a chapter to inspect a still view.'}
      </figcaption>
    </figure>
  );
}
