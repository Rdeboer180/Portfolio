// ============================================
// PrFlow — "the PR flow" on /design-system: what a pull request goes through,
// from an agent building on a branch to the MCP serving the rules it added.
// A side-scrolling strip of seven frames with a step rail above it. The rail
// fills as you scroll; each frame's detail settles in once, the first time it
// is mostly in view. All motion uses the site's curve ($ease-out).
//
// Hydration-safe: the server and the first client render show every frame in
// its final state. Only after mount (and never under reduced motion) do the
// frames not yet seen arm, so there is nothing to mismatch.
// ============================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

type Frame = { stage: string; title: string; body: string; art: React.ReactNode };

const Row: React.FC<{ code?: string; text: React.ReactNode; tag?: string; tagKind?: 'blocks' | 'answer' | 'ok' }> = ({ code, text, tag, tagKind }) => (
  <li className="prflow__line">
    {code && <code className="prflow__code">{code}</code>}
    <span className="prflow__text">{text}</span>
    {tag && <span className={`prflow__tag prflow__tag--${tagKind}`}>{tag}</span>}
  </li>
);

const FRAMES: Frame[] = [
  {
    stage: 'branch',
    title: 'Build with the system',
    body: 'An agent reads the rules over MCP while it works, and runs the checks the pull request will run.',
    art: (
      <ul className="prflow__art">
        <Row code="get_component" text="QuoteCard → like TestimonialCard" />
        <Row code="check_source" text="1 finding" tag="blocks" tagKind="blocks" />
        <Row code="check_copy" text="1 finding" tag="answer" tagKind="answer" />
      </ul>
    ),
  },
  {
    stage: 'pull request',
    title: 'The curtain runs',
    body: 'Opening the pull request starts two jobs: the rules on what the change adds, and the full build.',
    art: (
      <ul className="prflow__art">
        <Row code="governance" text="system · accessibility · copy" tag="running" tagKind="ok" />
        <Row code="build" text="prerender · hydration · Dive Club" tag="running" tagKind="ok" />
      </ul>
    ),
  },
  {
    stage: 'findings',
    title: 'Findings sort themselves',
    body: 'Deterministic findings block the merge. Everything else is a question for a person.',
    art: (
      <ul className="prflow__art">
        <Row code="SYS002" text={<>.quote-tile has no stylesheet</>} tag="blocks" tagKind="blocks" />
        <Row code="COPY002" text="“Results” as a heading" tag="answer" tagKind="answer" />
        <Row code="A11Y004" text="onClick on a div" tag="answer" tagKind="answer" />
      </ul>
    ),
  },
  {
    stage: 'registry',
    title: 'The rules change in the same diff',
    body: 'Each new component or style block gets a proposed registry entry, committed to the branch.',
    art: (
      <pre className="prflow__diff" aria-label="The registry entry the curtain commits">
        <span className="prflow__diff-line">{'  "QuoteCard": {'}</span>
        <span className="prflow__diff-line prflow__diff-line--add">{'+   "size": "playground",'}</span>
        <span className="prflow__diff-line prflow__diff-line--add">{'+   "status": "proposed",'}</span>
        <span className="prflow__diff-line prflow__diff-line--add">{'+   "relatives": ["TestimonialCard"]'}</span>
        <span className="prflow__diff-line">{'  }'}</span>
      </pre>
    ),
  },
  {
    stage: 'comment',
    title: 'One comment',
    body: 'What blocks, what to answer and what the registry gained, edited in place on every push.',
    art: (
      <div className="prflow__comment">
        <span className="prflow__comment-head">Steel curtain</span>
        <span className="prflow__comment-verdict"><b>Stopped.</b> 1 blocking, 2 to address.</span>
        <span className="prflow__comment-meta">Proposed component: QuoteCard</span>
      </div>
    ),
  },
  {
    stage: 'decision',
    title: 'A person decides',
    body: 'Fix what blocks. Then promote the entry with a size and a home on this page, or drop it.',
    art: (
      <ul className="prflow__art prflow__choices">
        <Row text="Fix .quote-tile" tag="done" tagKind="ok" />
        <Row text="Promote QuoteCard to production" tag="chosen" tagKind="blocks" />
        <Row text="Drop the entry" />
      </ul>
    ),
  },
  {
    stage: 'ship',
    title: 'Merge, ship, serve',
    body: 'The deploy repeats the build gates, and the MCP serves the new rule on the next request.',
    art: (
      <ul className="prflow__art">
        <Row code="deploy" text="build gates · live bundles" tag="passed" tagKind="ok" />
        <Row code="get_component" text={<>QuoteCard → <span className="prflow__em">production</span></>} />
      </ul>
    ),
  },
];

const PrFlow: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  // Nothing settles in until the strip itself is on screen.
  const [figureRef, revealed] = useReveal<HTMLElement>(0.25);

  // Arm the settle-in only on the client, and never under reduced motion.
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setArmed(true);
  }, []);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? Math.min(1, el.scrollLeft / max) : 0;
    railRef.current?.style.setProperty('--prflow-progress', String(progress));
    // The rail and the strip move together: progress picks the active step.
    setActive(Math.round(progress * (FRAMES.length - 1)));
    // Once the strip is on screen, a frame settles in the first time most of it is visible.
    if (!revealed) return;
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    const visible = (Array.from(el.children) as HTMLElement[])
      .map((f, i) => ({ i, shown: Math.min(right, f.offsetLeft + f.offsetWidth) - Math.max(left, f.offsetLeft), w: f.offsetWidth }))
      .filter((f) => f.shown / f.w > 0.6)
      .map((f) => f.i);
    setSeen((prev) => (visible.every((i) => prev.has(i)) ? prev : new Set(Array.from(prev).concat(visible))));
  }, [revealed]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.max(0, Math.min(FRAMES.length - 1, index));
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: (i / (FRAMES.length - 1)) * (el.scrollWidth - el.clientWidth), behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <figure ref={figureRef} className={`prflow${armed ? ' is-armed' : ''}`}>
      <div className="prflow__top">
        <div ref={railRef} className="prflow__rail">
          <span className="prflow__rail-track" aria-hidden="true"><span className="prflow__rail-fill" /></span>
          <ol className="prflow__steps">
            {FRAMES.map((f, i) => (
              <li key={f.stage}>
                <button
                  type="button"
                  className={`prflow__step${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                  aria-current={i === active ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="prflow__step-dot" aria-hidden="true" />
                  <span className="prflow__step-label">{f.stage}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="prflow__nav">
          <button type="button" className="prflow__arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous step">&larr;</button>
          <button type="button" className="prflow__arrow" onClick={() => goTo(active + 1)} disabled={active === FRAMES.length - 1} aria-label="Next step">&rarr;</button>
        </div>
      </div>

      {/* Focusable so arrow keys scroll it; every frame is real text. */}
      <div ref={scrollerRef} className="prflow__scroller" tabIndex={0} role="region" aria-label="The pull request flow, seven steps; scroll sideways">
        {FRAMES.map((f, i) => (
          <article
            key={f.stage}
            className={`prflow__frame${i === active ? ' is-active' : ''}${seen.has(i) ? ' is-seen' : ''}`}
            aria-label={`Step ${i + 1} of ${FRAMES.length}: ${f.title}`}
          >
            <span className="prflow__stage">[ 0{i + 1} ] {f.stage}</span>
            <h3 className="prflow__title">{f.title}</h3>
            <p className="prflow__body">{f.body}</p>
            <div className="prflow__detail">{f.art}</div>
          </article>
        ))}
      </div>
    </figure>
  );
};

export default PrFlow;
