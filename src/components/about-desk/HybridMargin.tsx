// The hybrid pitch's gutters: the desk's props sit outside the page wrapper, on
// the wood to the left and right of the container, at the real size the design
// proof pitched them (3.175px a mm). They are one set for the whole page, the
// same under every tab, each at its own distance from the top of the folder, so
// switching tabs never moves or swaps them. They scroll with the page (nothing
// sticks) and run off the edge of the window; the phone and the Almanac lean
// onto the paper's edge, the football just touches it. When the
// gutters are too narrow, they leave the page. They do not drag; each answers a
// pointer with a small lift and a click with its own motion, then opens its note.
import React, { useRef, useState } from 'react';
import { DESK_THINGS, GUTTER_PROPS, GutterProp, PROP_NAMES } from './deskObjects';
import { AirPodsCase, DragonBall, Football, TrackpadSurface, rollFootball, summonBall } from './DeskDrawings';
import { LoopScreen } from './LoopScreen';
import { pressGlass, pressShuffle, pushFlat, rollPencilOff, spinDisc } from './deskMotion';
import { GameBoyColor, GraysAlmanac, IpodMini, PokemonRedCart } from './PropDrawings';
import { DRAFTS } from './deskDrafts';
import { ReactComponent as Sketch } from '../../assets/desk/objects/sketch.svg';
import { ReactComponent as Pencil } from '../../assets/desk/objects/pencil.svg';
import { ReactComponent as Disc } from '../../assets/desk/objects/disc.svg';
import { ReactComponent as Phone } from '../../assets/desk/objects/phone.svg';

const BY_ID = Object.fromEntries(DESK_THINGS.map((t) => [t.id, t]));
// the iPod's screen starts on Come Together, Ryan's first pick; every press shuffles to another song
let lastSong = 0;
const nextSong = () => {
  const n = DRAFTS.songs.picks.length;
  lastSong = (lastSong + 1 + Math.floor(Math.random() * (n - 1))) % n;
  return lastSong;
};
// when a song's bar fills, the next of the ten plays, in order
const followingSong = () => {
  lastSong = (lastSong + 1) % DRAFTS.songs.picks.length;
  return lastSong;
};
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface PropProps {
  prop: GutterProp;
  onNote: (note: string, id: string) => void;
}

/** one prop in the margin: a real button (or, for the phone, a group that holds the app's controls) */
const Prop: React.FC<PropProps> = ({ prop, onNote }) => {
  const body = useRef<HTMLSpanElement>(null);
  const [taps, setTaps] = useState(0);
  const thing = BY_ID[prop.id];
  const w = thing.width;
  const h = thing.height;
  const note = thing.note ?? '';
  const over = prop.over ? ` prop--${prop.over}` : '';
  // the case opens on the first click and stays open; later clicks only open its note
  const open = prop.id === 'pods' && taps > 0;
  // the Game Boy: how many times it has been switched on (its boot screen replays on each)
  const [boots, setBoots] = useState(0);
  // the iPod: which of the ten is on its Now Playing screen (Come Together, my 1.01, to start)
  const [song, setSong] = useState(0);

  // pressed, a prop is set down on the desk and stays down while its note is open:
  // the lift on hover ends at the press, not when the note's scrim covers it
  const setDown = (el: HTMLElement | null, down: boolean) => el?.classList.toggle('is-down', down);
  const play = (e: React.MouseEvent | React.KeyboardEvent) => {
    const el = body.current;
    const rm = reduced();
    setTaps((n) => n + 1);
    setDown(e.currentTarget.closest<HTMLElement>('.prop'), true);
    // each motion says how long until its thing is still; the note follows then
    let wait = rm ? 0 : 420;
    const from = 'clientX' in e && e.detail > 0 ? { x: e.clientX, y: e.clientY } : null;
    // the ball rolls a little away from the pointer and lights up
    if (el && prop.id === 'ball') wait = summonBall(el, from, rm);
    // the football rolls a little across its length, rocking and yawing as a football does
    if (el && prop.id === 'ndball') wait = rm ? 0 : rollFootball(el, from, rm);
    if (el && !rm) {
      // each thing by its own physics and weight (deskMotion.ts)
      const label = el.querySelector<SVGElement>('[data-part="spin"]');
      if (prop.id === 'cd' && label) spinDisc(label);
      const pencil = el.querySelector<HTMLElement>('.prop__pencil');
      if (prop.id === 'sketch' && pencil && !pencil.getAnimations().length) rollPencilOff(pencil);
      // a 20 g cartridge flicks away; a 190 g console gathers speed under the finger; a paper cover grips
      if (prop.id === 'pkred') wait = pushFlat(el, from, { dist: 12, reach: 30, turn: 3, ms: 180 });
      // the console barely moves under the finger (a fifth of the first push, 1 Nov): the press is for the power, not the shove
      if (prop.id === 'gbc') wait = pushFlat(el, from, { dist: 1.4, reach: 4, turn: 0.4, ms: 280, ramp: true });
      if (prop.id === 'almanac') wait = pushFlat(el, from, { dist: 3, reach: 9, turn: 3.5, ms: 320, ramp: true });
      if (prop.id === 'pad') pressGlass(el);
    }
    // the iPod: pressed, its screen shuffles to another of the ten, and the top ten opens as its light goes out
    if (prop.id === 'ipod') {
      if (el) wait = pressShuffle(el, rm, from);
      const next = nextSong();
      setSong(next);
      window.setTimeout(() => onNote(`songs:${next}`, prop.id), wait);
      e.stopPropagation();
      return;
    }
    // the Game Boy turns on, and its note waits for the logo and the name to come up
    if (prop.id === 'gbc') { setBoots((n) => n + 1); if (!rm) wait = Math.max(wait, 1400); }
    if (note) window.setTimeout(() => onNote(note, prop.id), wait);
    e.stopPropagation();
  };
  const lift = (e: React.SyntheticEvent<HTMLElement>) => setDown(e.currentTarget, false);

  let drawing: React.ReactNode;
  if (prop.id === 'ball') drawing = <DragonBall size={thing.width} />;
  else if (prop.id === 'pods') {
    drawing = (
      <>
        <AirPodsCase width={thing.width} height={thing.height} open={open} />
      </>
    );
  } else if (prop.id === 'pad') drawing = <TrackpadSurface width={thing.width} height={thing.height} taps={taps} />;
  else if (prop.id === 'cd') drawing = <Disc className="s" style={{ width: thing.width, height: thing.height }} aria-hidden="true" focusable="false" />;
  else if (prop.id === 'sketch') {
    drawing = (
      <>
        <Sketch className="s" style={{ width: thing.width, height: thing.height }} aria-hidden="true" focusable="false" />
        <span className="prop__pencil" aria-hidden="true"><Pencil className="s" style={{ width: 556, height: 31 }} focusable="false" /></span>
      </>
    );
  } else if (prop.id === 'pkred') drawing = <PokemonRedCart width={w} height={h} />;
  else if (prop.id === 'gbc') drawing = <GameBoyColor width={w} height={h} boot={boots} />;
  else if (prop.id === 'almanac') drawing = <GraysAlmanac width={w} height={h} />;
  else if (prop.id === 'ipod') {
    const pick = DRAFTS.songs.picks[song];
    drawing = <IpodMini width={w} height={h} onEnd={() => setSong(followingSong())} song={pick ? { title: pick.title, artist: pick.sub ?? '', n: song + 1, of: DRAFTS.songs.picks.length } : undefined} />;
  }
  else if (prop.id === 'ndball') drawing = <Football width={thing.width} height={thing.height} />;
  else if (prop.id === 'phone') {
    drawing = (
      <>
        <Phone className="s" style={{ width: thing.width, height: thing.height }} aria-hidden="true" focusable="false" />
        <div className="loose__screen" style={{ left: thing.width * (16 / 180), top: thing.height * (14 / 360), width: thing.width * (148 / 180), height: thing.height * (332 / 360), borderRadius: thing.width * (27 / 180) }}>
          <LoopScreen width={thing.width * (148 / 180)} height={thing.height * (332 / 360)} />
        </div>
      </>
    );
  }

  // the name starts with the caption that shows, so a prop can be called by what it says (WCAG 2.5.3)
  const label = thing.label.replace(/ Drag .*$/, prop.id === 'ipod' ? ' Click to shuffle a song from my top ten and open the list.' : ' Click to open its note.');
  const inner = (
    <>
      <span className="prop__body" ref={body} style={{ width: w, height: h }}>
        <span className="prop__art" style={{ width: w, height: h }}>{drawing}</span>
      </span>
    </>
  );
  const id = `t-${prop.id}`;
  if (prop.id === 'phone') {
    // the phone holds the app's own controls, so it is a group; its story opens from a real button
    // (shown when it has keyboard focus), and a click anywhere else on the phone opens it too
    const story = label.replace(/ Click to open its note\.$/, '');
    return (
      <div id={id} className={`prop prop--phone${over}`} role="group" aria-label={story} data-chip={PROP_NAMES[prop.id] ?? thing.tag} onClick={play} onPointerLeave={lift}>
        <button type="button" className="prop__open" onClick={play} onBlur={lift}>Open the Loop story</button>
        {inner}
      </div>
    );
  }
  return <button type="button" id={id} className={`prop prop--${prop.id}${over}`} aria-label={thing.tag ? `${thing.tag}. ${label}` : label} data-chip={PROP_NAMES[prop.id] ?? thing.tag} onClick={play} onPointerLeave={lift} onBlur={lift}>{inner}</button>;
};

/** a gutter narrower than this shows too little of a prop to read: the props leave the page */
export const GUTTER_MIN = 48;

/** The two gutters beside the page wrapper: one set of props for the whole page, oldest to newest. */
export const HybridMargin: React.FC<{ gutter: number; onNote: (note: string, id: string) => void }> = ({ gutter, onNote }) => {
  if (gutter < GUTTER_MIN) return null;
  return (
    <div className="gutters" role="group" aria-label="Things on the desk">
      {GUTTER_PROPS.map((p) => (
        <div key={p.id} className={`gutter-spot gutter-spot--${p.side}`} style={{ top: p.y, rotate: p.turn ? `${p.turn}deg` : undefined }}>
          <Prop prop={p} onNote={onNote} />
        </div>
      ))}
    </div>
  );
};
