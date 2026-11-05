// ============================================
// AboutIntroVideo — the "How I work" video on an iPad mini lying on the About
// desk, at the props' real scale (3.175px a millimetre: 134.8 × 195.4mm is
// 428 × 620). Its home screen is mine, and the video sits on it as
// picture-in-picture in the bottom-left corner, as large as the visible part
// of the iPad allows. Play flips the iPad edge-on, then the player tumbles to
// the middle of the screen and turns landscape, the video filling it; closing
// runs that backwards. Reduced motion skips the tumble and just fades.
// /about/#video opens it on arrival, for a link sent on its own.
// ============================================

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SRC = '/videos/about/how-i-work.mp4';
const POSTER = '/videos/about/how-i-work-poster.jpg';
const LENGTH = '1:37';
const DEEP_LINK = '#video';

// The phone, rail and gutter iPads swap as the page measures itself, so the link is spent
// once per page load, by whichever iPad is on the page when the layout has settled.
let deepLinkPending = typeof window !== 'undefined' && window.location.hash === DEEP_LINK;

// flipping: the desk iPad turns edge-on · opening: the player tumbles in · open
// closing: the player tumbles back, edge-on · returning: the desk iPad turns back
type Phase = 'closed' | 'flipping' | 'opening' | 'open' | 'closing' | 'returning';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Runs `done` once, when the animation finishes or after its duration, whichever comes
// first: a background tab doesn't advance animations, and the modal must not strand there.
const settle = (anim: Animation, ms: number, done: () => void) => {
  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    window.clearTimeout(timer);
    done();
  };
  const timer = window.setTimeout(() => {
    anim.finish();
    run();
  }, ms + 250);
  anim.onfinish = run;
};

const EDGE = 'perspective(1400px) rotateY(90deg)';
const FLAT = 'perspective(1400px) rotateY(0deg)';

// The transform that lays the landscape player over the portrait desk iPad: same centre,
// turned a quarter (plus the desk turn), scaled so its short side matches the iPad's width,
// and tipped edge-on, which is where the desk iPad's flip leaves off.
const overDesk = (desk: HTMLElement, player: HTMLElement, turn: number) => {
  const a = desk.getBoundingClientRect();
  const b = player.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);
  const s = desk.offsetWidth / player.offsetHeight;
  return `translate(${dx}px, ${dy}px) scale(${s}) rotate(${turn - 90}deg) rotateX(90deg)`;
};

// The home screen: my own apps, drawn small
const APPS: { name: string; tile: React.ReactNode; bg: string }[] = [
  { name: 'PlayDraft', bg: '#26355c', tile: <img src="/images/work/playdraft/playdraft-app-icon-mark.png" alt="" /> },
  { name: 'LoopStack', bg: '#fff', tile: <svg viewBox="0 0 40 40"><path d="M29 12a11 11 0 1 0 0 16" fill="none" stroke="#3fb950" strokeWidth="6" strokeLinecap="round" /><path d="M24 17h9M24 20h9M24 23h9" stroke="#3fb950" strokeWidth="2" /></svg> },
  { name: 'T1D Hub', bg: '#1f3a8a', tile: <svg viewBox="0 0 40 40"><text x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="system-ui">T1D</text></svg> },
  { name: 'Picture This', bg: '#14161b', tile: <svg viewBox="0 0 40 40"><path d="M20 20V8a12 12 0 0 1 12 12z" fill="#f4b740" /><path d="M20 20h12a12 12 0 0 1-12 12z" fill="#e85d9b" /><path d="M20 20v12A12 12 0 0 1 8 20z" fill="#38c6d9" /><path d="M20 20H8A12 12 0 0 1 20 8z" fill="none" stroke="#f3f1ec" strokeWidth="1.6" strokeDasharray="2 2.5" /></svg> },
  { name: 'Overscroll', bg: '#f7f4ee', tile: <svg viewBox="0 0 40 40"><path d="M13 31V17a9 9 0 0 1 18 0v8h-4v3h-4v3z" fill="#f04a00" /><rect x="19" y="13" width="3" height="6" rx="1.5" fill="#f7f4ee" /></svg> },
  { name: 'Binder', bg: 'linear-gradient(135deg,#f6c1e0,#b5e3f5 45%,#d8f7c2 75%,#f9e3a7)', tile: <svg viewBox="0 0 40 40"><g fill="none" stroke="#2b2d33" strokeWidth="2"><rect x="11" y="9" width="20" height="24" rx="2" /><circle cx="11" cy="15" r="2" /><circle cx="11" cy="27" r="2" /></g></svg> },
  { name: 'Notes', bg: '#fffbe9', tile: <svg viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="11" fill="#f5c542" /><path d="M8 19h24M8 25h24M8 31h16" stroke="#d6d1bd" strokeWidth="1.6" /></svg> },
  { name: 'Figma', bg: '#1e1e1e', tile: <svg viewBox="0 0 40 40"><g fill="none" stroke="#fff" strokeWidth="2"><rect x="12" y="10" width="16" height="20" rx="3" /><path d="M12 17h16M12 23h16M20 10v20" /></g></svg> },
];

const HomeScreen: React.FC = () => (
  <div className="about-ipad__home" aria-hidden="true">
    <div className="about-ipad__status"><span>9:41</span><span className="about-ipad__battery" /></div>
    <ul className="about-ipad__apps">
      {APPS.map((app) => (
        <li key={app.name}>
          <span className="about-ipad__icon" style={{ background: app.bg }}>{app.tile}</span>
          <span className="about-ipad__app-name">{app.name}</span>
        </li>
      ))}
    </ul>
    <div className="about-ipad__dock-bar">
      {APPS.slice(0, 4).map((app) => (
        <span key={app.name} className="about-ipad__icon" style={{ background: app.bg }}>{app.tile}</span>
      ))}
    </div>
  </div>
);

interface Props {
  /** how far the desk iPad is turned, so the tumble starts and ends on it */
  turn?: number;
  /** how much of the iPad shows before the window's edge; the picture-in-picture grows into that */
  reach?: number;
  /** when the gutters are too narrow for props: fill its column (the rail, or the phone layout), fully in view */
  fit?: boolean;
}

const AboutIntroVideo: React.FC<Props> = ({ turn = 0, reach, fit = false }) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const trigger = useRef<HTMLButtonElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // the specular band on the aluminium back, swept across it as the player turns
  const sheen = useRef<HTMLSpanElement>(null);

  // 1. the desk iPad turns edge-on, then the player takes over
  const open = () => {
    if (phase !== 'closed' || !desk.current) return;
    if (prefersReducedMotion()) {
      setPhase('opening');
      return;
    }
    setPhase('flipping');
    const flip = desk.current.animate([{ transform: FLAT }, { transform: EDGE }], { duration: 190, easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)', fill: 'forwards' });
    settle(flip, 190, () => setPhase('opening'));
  };

  // 2. the player tumbles from the desk to the middle, turning landscape
  useLayoutEffect(() => {
    if (phase !== 'opening' || !stage.current || !desk.current) return;
    const reduce = prefersReducedMotion();
    const ms = reduce ? 200 : 1000;
    const start = overDesk(desk.current, stage.current, turn);
    const tumble = stage.current.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { transform: start, offset: 0 },
            { transform: 'translate(0, -3%) scale(0.82) rotate(-24deg) rotateX(250deg)', offset: 0.55 },
            { transform: 'translate(0, 0) scale(1.015) rotate(0deg) rotateX(354deg)', offset: 0.86 },
            { transform: 'translate(0, 0) scale(1) rotate(0deg) rotateX(360deg)', offset: 1 },
          ],
      { duration: ms, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
    );
    backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 200 : 420, fill: 'both' });
    // The back shows while the player turns through rotateX 90° to 270°, which the tumble's
    // ease-out packs into roughly its first 45 to 150ms: the key light slides across the aluminium
    // in that window, as it would on a real iPad turned in the hand. Transform only, on the
    // compositor, and skipped with the tumble under reduced motion.
    const shine = reduce
      ? null
      : sheen.current?.animate(
          [
            { transform: 'translate(-70%, -18%) rotate(-12deg)', offset: 0 },
            { transform: 'translate(-70%, -18%) rotate(-12deg)', offset: 0.04, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
            { transform: 'translate(70%, 18%) rotate(-12deg)', offset: 0.15 },
            { transform: 'translate(70%, 18%) rotate(-12deg)', offset: 1 },
          ],
          { duration: ms, easing: 'linear', fill: 'both' },
        );
    settle(tumble, ms, () => {
      tumble.cancel();
      shine?.cancel();
      setPhase('open');
      closeBtn.current?.focus();
      // Still inside the click's user activation window, so sound is allowed.
      video.current?.play().catch(() => {});
    });
  }, [phase, turn]);

  // A linked visitor gets the same flip and tumble, once the page has settled. With no click
  // behind it the browser may refuse sound; the player then waits on its own play button.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    let timer = 0;
    const arrive = () => {
      if (!deepLinkPending) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        deepLinkPending = false;
        openRef.current();
      }, 700);
    };
    const onHash = () => {
      if (window.location.hash !== DEEP_LINK) return;
      deepLinkPending = true;
      arrive();
    };
    arrive();
    window.addEventListener('hashchange', onHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // 3. back: the player tumbles to the desk and arrives edge-on; the desk iPad turns flat again
  const close = useCallback(() => {
    if (phase !== 'open' || !stage.current || !desk.current) return;
    video.current?.pause();
    // closed, the link is done with: a refresh shouldn't bring the player back
    if (window.location.hash === DEEP_LINK) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    setPhase('closing');
    const reduce = prefersReducedMotion();
    const ms = reduce ? 180 : 560;
    const back = stage.current.animate(
      reduce
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ transform: 'translate(0, 0) scale(1) rotate(0deg) rotateX(0deg)' }, { transform: overDesk(desk.current, stage.current, turn) }],
      { duration: ms, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' },
    );
    backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? 180 : 480, fill: 'both' });
    settle(back, ms, () => {
      const el = desk.current;
      if (reduce || !el) {
        el?.getAnimations().forEach((a) => a.cancel());
        setPhase('closed');
        trigger.current?.focus();
        return;
      }
      setPhase('returning');
      el.getAnimations().forEach((a) => a.cancel());
      const flat = el.animate([{ transform: EDGE }, { transform: FLAT }], { duration: 220, easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)' });
      settle(flat, 220, () => {
        setPhase('closed');
        trigger.current?.focus();
      });
    });
  }, [phase, turn]);

  // Esc closes; the page behind doesn't scroll while the player is up.
  useEffect(() => {
    if (phase === 'closed') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, close]);

  // the player is up, and the desk iPad hidden, from the tumble in to the tumble back
  const playerUp = phase === 'opening' || phase === 'open' || phase === 'closing';

  return (
    <div className={`about-ipad${fit ? ' about-ipad--fit' : ''}`} style={reach ? ({ '--reach': `${reach}px` } as React.CSSProperties) : undefined}>
      <button
        ref={trigger}
        type="button"
        className="about-ipad__trigger"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={phase !== 'closed'}
        aria-label={`Play “How I work”, a ${LENGTH} video introduction`}
      >
        <div ref={desk} className={`about-ipad__desk${playerUp ? ' is-away' : ''}`}>
          <div className="about-ipad__mini">
            <div className="about-ipad__face about-ipad__face--front">
              <span className="about-ipad__camera" aria-hidden="true" />
              <div className="about-ipad__screen device-glass">
                <HomeScreen />
                {/* the video, minimised to picture-in-picture */}
                <span className="about-ipad__pip">
                  <img src={POSTER} alt="" loading="lazy" />
                  <span className="about-ipad__pip-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
                  </span>
                  <span className="about-ipad__pip-label">How I work <span>{LENGTH}</span></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>

      {playerUp &&
        createPortal(
          <div className="about-ipad-modal" role="dialog" aria-modal="true" aria-label="How I work, video">
            <div ref={backdrop} className="about-ipad-modal__backdrop" onClick={close} />
            <div ref={stage} className={`about-ipad-modal__stage is-${phase}`}>
              <div className="about-ipad__device">
                <div className="about-ipad__face about-ipad__face--front">
                  <span className="about-ipad__camera" aria-hidden="true" />
                  <div className="about-ipad__screen device-glass">
                    <video
                      ref={video}
                      src={SRC}
                      poster={POSTER}
                      className="about-ipad__video"
                      controls={phase === 'open'}
                      playsInline
                      preload="auto"
                    />
                  </div>
                </div>
                {/* the back only shows mid-tumble */}
                <div className="about-ipad__face about-ipad__face--back" aria-hidden="true">
                  <span className="about-ipad__lens" />
                  <span className="about-ipad__flash" />
                  <span ref={sheen} className="about-ipad__sheen" />
                </div>
              </div>
              <button
                ref={closeBtn}
                type="button"
                className="about-ipad-modal__close"
                onClick={close}
                aria-label="Close video"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AboutIntroVideo;
