// ============================================
// AboutDeskPage — the About page as a desk you scroll down
// Route: /about (the canvas, live 1 Nov 2026; /about-desk redirects here)
// ============================================
// The note sits on a whitewashed desk as a folder with three tabs. Everything
// around it is a real thing at real size, and every one of them can be picked
// up and moved. A [[link]] in the note draws a pencil line to the thing it
// names. At a glance stays on the folder's front under every tab, and all
// three tabs stay in the markup, so a reader without a pointer, a crawler and
// an answer engine get the whole page. The design came off the About
// Playground canvas, 27 October 2026.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ArchiveCard from '../ArchiveCard';
import { ARCHIVE_CARDS } from '../../data/archiveCards';
import { SITE, EMAIL_HREF } from '../../data/site';
import { SEARCH_META, profileJsonLd } from '../../data/seo';
import { LINKEDIN_PROFILE_URL } from '../LinkedInLink';
import { usePageMeta } from '../../hooks/usePageMeta';
import { getHomeHref } from '../../utils/homeSession';
import { CONTAINED_MAT, CONTAINED_STARTS, CONTAINER, CUTTING_MAT, HYBRID_LOWER_MIN, HYBRID_MAT_MIN_WIDTH, HYBRID_STARTS, MAT_RATIO, DESK_TABS, DESK_THINGS, DESK_WIDTH, DeskTab, DeskThing, FOLDER, LINK_TO, LOWER_HEIGHT, SHELF_LOWER, TRAY } from './deskObjects';
import { useDesk } from './useDesk';
import { DeskFront, PANELS, WikiLink } from './AboutDeskPanels';
import { ReactComponent as Disc } from '../../assets/desk/objects/disc.svg';
import { ReactComponent as Phone } from '../../assets/desk/objects/phone.svg';
import { ReactComponent as Sketch } from '../../assets/desk/objects/sketch.svg';
import { ReactComponent as Pencil } from '../../assets/desk/objects/pencil.svg';
import { ReactComponent as CuttingMat } from '../../assets/desk/objects/cutting-mat.svg';
import { AirPodsCase, Bud, DragonBall, Football, Notebook, TrackpadSurface } from './DeskDrawings';
import { GameBoyColor, GraysAlmanac, IpodMini, PokemonRedCart } from './PropDrawings';
import { LoopScreen } from './LoopScreen';
import { DeskNote } from './DeskNotes';
import DismissStrip, { ReturnArrow } from '../DismissStrip';
import { HybridMargin, GUTTER_MIN } from './HybridMargin';
import AboutIntroVideo from '../AboutIntroVideo';
import { NoteOpener } from './noteOpener';
import LayersPanel from '../LayersPanel';
import SectionBadge from '../SectionBadge';
import Footer from '../Footer';
import { FreePencil } from './FreePencil';
import { FlavorEffects } from './FlavorEffects';
import '../../styles/styles.scss';
// the page's own styles ride in its lazy chunk, not in every page's stylesheet
import './aboutDesk.scss';

const DRAWINGS: Partial<Record<DeskThing['draw'], React.FC<React.SVGProps<SVGSVGElement>>>> = {
  disc: Disc,
  sketch: Sketch,
  pencil: Pencil,
};
/** the drawings that are components of their own, sized by the thing */
const SIZED: Partial<Record<DeskThing['draw'], React.FC<{ width: number; height: number }>>> = {
  'pokemon-red': PokemonRedCart,
  'gameboy-color': GameBoyColor,
  almanac: GraysAlmanac,
  'ipod-mini': IpodMini,
};

// the same notched chevron as the way back's cursor (DismissStrip.tsx), drawn in the button's ink
const BackChevron = () => <ReturnArrow className="about-desk__chevron" />;

/** One thing on the desk: a button you can pick up, click, or move with the keys. */
interface ThingProps {
  thing: DeskThing;
  left: number;
  top: number;
  turn: number;
  z: number;
  held: boolean;
  /** an archive card whose note is open: it stays grown at 110% */
  picked?: boolean;
  linked: boolean;
  taps: number;
  open: boolean;
  register: (id: string) => (el: HTMLElement | null) => void;
  onGrab: (id: string, e: React.PointerEvent) => void;
  onTap: (id: string, e: React.MouseEvent | React.KeyboardEvent) => void;
  onNudge: (id: string, e: React.KeyboardEvent) => void;
}
const SOFT = new Set(['pods', 'bud', 'disc']);
const Thing = React.memo<ThingProps>(({ thing, left, top, turn, z, held, picked, linked, taps, open, register, onGrab, onTap, onNudge }) => {
  const className = `loose loose--${thing.kind}${thing.bare ? ' loose--bare' : ''}${SOFT.has(thing.kind) ? ' loose--soft' : ''}${held ? ' is-held' : ''}${picked ? ' is-picked' : ''}${linked ? ' is-linked' : ''}${thing.from ? ' is-out' : ''}`;
  const size: React.CSSProperties = { width: thing.width, height: thing.height };
  // the thing keeps its own size wherever it is put: an absolutely placed box
  // with no width shrinks to the space left before the desk's right edge
  const style: React.CSSProperties = { left, top, ...size, transform: `rotate(${turn}deg)`, zIndex: z };
  let drawing: React.ReactNode;
  if (thing.kind === 'card') {
    const card = ARCHIVE_CARDS.find((c) => c.slug === thing.card)!;
    drawing = <ArchiveCard card={card} total={ARCHIVE_CARDS.length} eager style={{ '--cw': `${thing.width}px` } as React.CSSProperties} />;
  } else if (thing.kind === 'pack') {
    drawing = <img className="s" src="/images/desk/foil-pack.webp" alt="" width={thing.width} height={thing.height} style={size} />;
  } else if (thing.kind === 'ball') drawing = <DragonBall size={thing.width} />;
  else if (thing.kind === 'football') drawing = <Football width={thing.width} height={thing.height} />;
  else if (thing.kind === 'pods') drawing = <AirPodsCase width={thing.width} height={thing.height} open={open} />;
  else if (thing.kind === 'bud') drawing = <Bud width={thing.width} height={thing.height} />;
  else if (thing.kind === 'pad') drawing = <TrackpadSurface width={thing.width} height={thing.height} taps={taps} />;
  else if (thing.kind === 'book') drawing = <Notebook width={thing.width} height={thing.height} taps={taps} />;
  else if (thing.kind === 'phone') {
    drawing = (
      <>
        <Phone className="s" style={size} aria-hidden="true" focusable="false" />
        <div className="loose__screen device-glass" style={{ left: thing.width * (16 / 180), top: thing.height * (14 / 360), width: thing.width * (148 / 180), height: thing.height * (332 / 360), borderRadius: thing.width * (27 / 180) }}>
          <LoopScreen width={thing.width * (148 / 180)} height={thing.height * (332 / 360)} />
        </div>
      </>
    );
  } else {
    const Sized = SIZED[thing.draw];
    const Drawing = DRAWINGS[thing.draw];
    drawing = Sized ? <Sized width={thing.width} height={thing.height} /> : Drawing ? <Drawing className="s" style={size} aria-hidden="true" focusable="false" /> : null;
  }
  const inner = (
    <>
      <span className="loose__body">{drawing}</span>
      {thing.tag && <span className="tag">{thing.tag}</span>}
    </>
  );
  const shared = {
    id: `t-${thing.id}`,
    ref: register(thing.id),
    className,
    style,
    onPointerDown: (e: React.PointerEvent) => onGrab(thing.id, e),
    onClick: (e: React.MouseEvent) => onTap(thing.id, e),
    'aria-label': thing.label,
  };
  // the phone holds working controls, and a button cannot hold buttons
  if (thing.kind === 'phone') {
    return (
      <div
        {...shared}
        role="group"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(thing.id, e); } else onNudge(thing.id, e);
        }}
      >
        {inner}
      </div>
    );
  }
  return <button type="button" {...shared} onKeyDown={(e) => onNudge(thing.id, e)}>{inner}</button>;
});
Thing.displayName = 'Thing';

/**
 * variant 'desk': the 1440 desk, zoomed to the window, things all around the folder.
 * variant 'contained': the homepage's 1186 container; the folder on the left, the
 * loose things in a tray beside it, the mat and the notebook below. Cards there
 * do not pick up: hovering brings one to the front.
 * variant 'hybrid': the pitch between them. The folder leads at reading width;
 * the props sit small in the wood margin beside their sections and scroll with
 * them; the mat, the archive, the sketch and the notebook sit below. Nothing is
 * cropped and nothing sticks.
 */
/** the three motion directions built on the hybrid (impeccable animate pass, 28 Oct) */
export type HybridFlavor = 'a' | 'b' | 'c';
export const FLAVOR_NAMES: Record<HybridFlavor, string> = { a: 'Tactile', b: 'Ink', c: 'Instrument' };

const AboutDeskPage: React.FC<{ variant?: 'desk' | 'contained' | 'hybrid'; flavor?: HybridFlavor }> = ({ variant = 'desk', flavor }) => {
  // every layout but the desk lays things out in boxes of its own
  const contained = variant !== 'desk';
  const hybrid = variant === 'hybrid';
  usePageMeta({
    ...SEARCH_META.about,
    canonical: `${SITE.portfolioUrl}/about/`,
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'profile',
    jsonLd: profileJsonLd(`${SITE.portfolioUrl}/about/`, SEARCH_META.about.title),
  });

  const root = useRef<HTMLDivElement>(null);
  const folder = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<DeskTab>('work');
  const [folderHeight, setFolderHeight] = useState(1800);
  const [contact, setContact] = useState(false);
  const [scale, setScale] = useState(1);
  const [compact, setCompact] = useState(false);
  const [shelf, setShelf] = useState({ tray: 0.53, lower: 1, gutter: 0 });
  const tray = useRef<HTMLDivElement>(null);
  const lowerBox = useRef<HTMLDivElement>(null);
  const rootFor = useCallback((id: string) => {
    if (hybrid) return lowerBox.current;
    return DESK_THINGS.find((t) => t.id === id)?.group === 'side' ? tray.current : lowerBox.current;
  }, [hybrid]);
  const containedOpt = useMemo(() => (contained ? { starts: hybrid ? HYBRID_STARTS : CONTAINED_STARTS, rootFor, fixed: hybrid } : undefined), [contained, hybrid, rootFor]);

  // the hybrid's margin notes are in Ryan's hand again: Caveat, from Google Fonts for the pitch
  useEffect(() => {
    if (!hybrid || document.getElementById('caveat-font')) return;
    const link = document.createElement('link');
    link.id = 'caveat-font';
    link.rel = 'stylesheet';
    // Caveat for the margin notes; Rajdhani for the PlayDraft recaps, the app's own display face
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Rajdhani:wght@600;700&display=swap';
    document.head.appendChild(link);
  }, [hybrid]);
  // the Instrument flavor's type inspector stays off on the canvas: the page is already a design tool
  const inspect = false;
  const [fixLine, setFixLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const [note, setNote] = useState<{ key: string; side: 'left' | 'right'; from: string } | null>(null);

  // every note slides in from the right, as the homepage's case studies and notes do
  const onNote = useCallback((key: string, id: string) => setNote({ key, side: 'right', from: id }), []);
  const closeNote = useCallback(() => {
    setNote((n) => {
      if (n) window.setTimeout(() => document.getElementById(`t-${n.from}`)?.focus({ preventScroll: true }), 0);
      return null;
    });
  }, []);
  const switchNote = useCallback((key: string) => setNote((n) => (n ? { ...n, key } : n)), []);

  const desk = useDesk(root, { folderHeight, onNote, contained: containedOpt });
  const { placed, held, link, lowerTop, taps, podsOpen, grab, tap, nudge, reset, linkOn, linkOff, register } = desk;

  // the folder's height decides where the desk below it starts
  useLayoutEffect(() => {
    const el = folder.current;
    if (!el) return undefined;
    // the desk is laid out under the folder's tallest tab, so switching tabs
    // never moves a thing: only the paper gets shorter
    const measure = () => {
      const panels = Array.from(el.querySelectorAll<HTMLElement>('.panel'));
      const active = panels.find((p) => !p.classList.contains('is-away'));
      const tallest = Math.max(0, ...panels.map((p) => p.offsetHeight));
      setFolderHeight(Math.round(el.offsetHeight - (active?.offsetHeight ?? 0) + tallest + FOLDER.tabs));
    };
    measure();
    if (!('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll('.panel').forEach((p) => ro.observe(p));
    return () => ro.disconnect();
  }, [compact]);

  // the desk is 1440 wide; a narrower window sees it zoomed out, and a phone sees the folder alone.
  // zoom, not a scale transform: zoom scales the layout, so the folder's tab strip can stick
  useLayoutEffect(() => {
    const fit = () => {
      const w = stage.current?.clientWidth ?? window.innerWidth;
      setCompact(window.innerWidth < 900);
      setScale(Math.min(1, w / DESK_WIDTH));
      // the contained page: the container, the folder's 740, a 40 gap, the tray takes the rest
      const box = Math.min(CONTAINER, window.innerWidth - 64);
      // the hybrid's props live in the page gutters: what is left of the window either side of the container
      setShelf({ tray: Math.max(0.3, (box - FOLDER.width - 40) / TRAY.width), lower: box / CONTAINER, gutter: Math.floor((window.innerWidth - box) / 2) });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    if (!contact) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setContact(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [contact]);

  // while the tab strip is stuck under the nav it gets a paper backing, so the
  // folder's text does not show through the gaps between the tabs
  useEffect(() => {
    if (compact) return undefined;
    let frame = 0;
    const check = () => {
      frame = 0;
      const tabs = document.querySelector<HTMLElement>('.about-desk__tabs');
      const body = folder.current;
      if (!tabs || !body) return;
      const stuck = body.getBoundingClientRect().top < tabs.getBoundingClientRect().bottom - 1;
      tabs.classList.toggle('is-stuck', stuck);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [compact]);

  const tabMounted = useRef(false);
  useEffect(() => {
    if (!tabMounted.current) { tabMounted.current = true; return; }
    const panel = document.getElementById(`about-desk-panel-${tab}`);
    const nav = document.querySelector<HTMLElement>('.about-desk__nav');
    if (!panel) return;
    const top = panel.getBoundingClientRect().top;
    const offset = (nav?.offsetHeight ?? 72) + 58 * (contained ? 1 : scale) + 16;
    // only when the tab's start is above the fold: switching near the top stays put
    if (top < offset) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollBy({ top: top - offset, behavior: smooth ? 'smooth' : 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const tabKey = useCallback((e: React.KeyboardEvent) => {
    const keys = DESK_TABS.map((t) => t.key);
    const i = keys.indexOf(tab);
    let j: number | null = null;
    if (e.key === 'ArrowRight') j = (i + 1) % keys.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + keys.length) % keys.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = keys.length - 1;
    if (j === null) return;
    e.preventDefault();
    setTab(keys[j]);
    (document.getElementById(`about-desk-tab-${keys[j]}`) as HTMLButtonElement | null)?.focus();
  }, [tab]);

  // in the contained page the things are in other boxes, so the pencil line is
  // drawn over the whole window, from the link to the thing, while you point at it
  const lineOn = useCallback((key: string, e: React.SyntheticEvent<HTMLElement>) => {
    linkOn(key, LINK_TO[key][0], e);
    if (!contained) return;
    const a = e.currentTarget.getBoundingClientRect();
    const b = document.getElementById(`t-${LINK_TO[key][0]}`)?.getBoundingClientRect();
    if (!b) return;
    setFixLine({ x1: a.left + a.width / 2, y1: a.bottom, x2: b.left + b.width / 2, y2: b.top + b.height / 2 });
  }, [linkOn, contained]);
  const lineOff = useCallback(() => { linkOff(); setFixLine(null); }, [linkOff]);
  useEffect(() => {
    if (!fixLine) return undefined;
    const off = () => setFixLine(null);
    window.addEventListener('scroll', off, { passive: true, once: true });
    return () => window.removeEventListener('scroll', off);
  }, [fixLine]);

  // a [[link]] whose thing is off the page (narrow windows, phones) opens the thing's note instead
  const pick = useCallback((key: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = LINK_TO[key][0];
    const el = document.getElementById(`t-${id}`);
    const shown = el && el.getClientRects().length > 0;
    if (shown) return;
    const note = DESK_THINGS.find((t) => t.id === id)?.note;
    if (!note) return;
    e.preventDefault();
    setNote({ key: note, side: 'right', from: id });
  }, []);
  const wiki = useCallback((to: string, label: React.ReactNode) => (
    <WikiLink to={to} href={`#t-${LINK_TO[to][0]}`} onOn={lineOn} onOff={lineOff} onPick={pick}>{label}</WikiLink>
  ), [lineOn, lineOff, pick]);

  const height = lowerTop + LOWER_HEIGHT;
  const line = useMemo(() => {
    if (!link) return null;
    const t = LINK_TO[link.key];
    const p = placed[t[0]];
    if (!p) return null;
    const x2 = p.left + t[1];
    const y2 = p.top + t[2];
    const cx = (link.x1 + x2) / 2 + (y2 - link.y1) * 0.16;
    const cy = (link.y1 + y2) / 2 - (x2 - link.x1) * 0.16;
    return {
      x1: link.x1, y1: link.y1, x2, y2,
      d: `M${link.x1} ${link.y1}Q${Math.round(cx)} ${Math.round(cy)} ${x2} ${y2}`,
      d2: `M${link.x1 + 1} ${link.y1 + 1.5}Q${Math.round(cx + 4)} ${Math.round(cy + 3)} ${x2 + 1} ${y2 + 2}`,
    };
  }, [link, placed]);

  // the room light starts here; the desk moves it with the pointer, outside React
  const lightVars = useMemo(() => ({ '--streak-x': '0px', '--streak-y': '-12px', '--win-x': '0px', '--win-y': '0px' }) as React.CSSProperties, []);

  const folderMarkup = useMemo(() => (
    <NoteOpener.Provider value={onNote}>
    <article className="about-desk__folder" style={compact || contained ? undefined : { left: FOLDER.left, top: FOLDER.top, width: FOLDER.width }} aria-label="About Ryan DeBoer">
      <div className="about-desk__tabs" role="tablist" aria-label="About, three ways in">
        {DESK_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`about-desk-tab-${t.key}`}
            className={`ftab${tab === t.key ? ' is-open' : ''}`}
            aria-selected={tab === t.key}
            aria-controls={`about-desk-panel-${t.key}`}
            tabIndex={tab === t.key ? 0 : -1}
            onClick={() => setTab(t.key)}
            onKeyDown={tabKey}
          >
            <span className="ftab__index">{t.index}</span>
            <span className="ftab__label">{t.label}</span>
          </button>
        ))}
      </div>
      <div className={`about-desk__body sheet sheet--${tab}`} ref={folder}>
        <DeskFront wiki={wiki} />
        {DESK_TABS.map((t) => {
          const Panel = PANELS[t.key];
          return (
            <div key={t.key} role="tabpanel" id={`about-desk-panel-${t.key}`} aria-labelledby={`about-desk-tab-${t.key}`} className={`panel${tab === t.key ? '' : ' is-away'}`} aria-hidden={tab !== t.key} inert={tab !== t.key}>
              <Panel wiki={wiki} />
            </div>
          );
        })}
        <div className="about-desk__backlinks">
          <b>3 backlinks</b><span>the binder</span><span aria-hidden="true">·</span>{wiki('tree', 'the skill tree')}<span aria-hidden="true">·</span>{wiki('notes', 'notes')}
          <span className="about-desk__count">{DESK_THINGS.length} things on this desk{contained ? '' : ', all of them movable'}</span>
        </div>
      </div>
    </article>
    </NoteOpener.Provider>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [tab, compact, contained, wiki, tabKey, onNote]);

  // the hybrid's mat starts at the page's left edge and runs off the window's right edge at any width
  const matW = Math.max(HYBRID_MAT_MIN_WIDTH, Math.ceil((CONTAINER + shelf.gutter + 80) / shelf.lower));
  const matH = Math.round(matW * MAT_RATIO);

  const stillThings = useMemo(() => Object.fromEntries(DESK_THINGS.map((t) => [t.id, { ...t, label: t.label.replace(' Drag to move, or use the arrow keys.', ' Click for its story.') }])), []);
  const renderThing = (raw: DeskThing) => {
    const thing = hybrid ? stillThings[raw.id] : raw;
    return renderOne(thing);
  };
  const renderOne = (thing: DeskThing) => (
    (!thing.from || podsOpen) && (
      <Thing
        key={thing.id}
        thing={thing}
        left={placed[thing.id].left}
        top={placed[thing.id].top}
        turn={placed[thing.id].turn}
        z={placed[thing.id].z}
        held={held === thing.id}
        picked={thing.kind === 'card' && note?.from === thing.id}
        linked={!!link && link.to === thing.id}
        taps={taps[thing.id] || 0}
        open={thing.kind === 'pods' && podsOpen}
        register={register}
        onGrab={grab}
        onTap={tap}
        onNudge={nudge}
      />
    )
  );

  return (
    <div
      className={`about-desk${compact ? ' about-desk--compact' : ''}${contained && !compact ? ' about-desk--contained' : ''}${hybrid && !compact ? ' about-desk--hybrid' : ''}${hybrid && flavor ? ` about-desk--flavor-${flavor}` : ''}${hybrid && flavor === 'c' && inspect ? ' about-desk--inspecting' : ''}${hybrid && !compact ? ' about-desk--site about-desk--look-canvas' : ''}`}
      ref={(el) => { stage.current = el; if (contained) root.current = el; }}
      style={contained ? ({ ...lightVars, '--stick': '76px' } as React.CSSProperties) : undefined}
    >
      <nav className="about-desk__nav" aria-label="Primary">
        <Link to={getHomeHref()} className="about-desk__logo">Ryan DeBoer</Link>
        <div className="about-desk__nav-right">
          {!compact && !hybrid && (
            <>
              <span className="about-desk__hint">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12" /><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12" /><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12" /><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2c-2.2 0-3.6-.8-4.8-2.2L4.2 16a1.6 1.6 0 0 1 2.4-2.1L8 15" /></svg>
                Everything on this desk moves
              </span>
              <button type="button" className="btn btn--secondary btn--md" onClick={reset}>Tidy the desk</button>
            </>
          )}

          {hybrid && (
            <div className="about-desk__links">
              <Link to="/about" aria-current="page">About</Link>
              <Link to="/#projects">Work</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/resume">Resume</Link>
            </div>
          )}
          {hybrid ? (
            <a href={EMAIL_HREF} className="about-desk__cta">Get in touch</a>
          ) : (
            <>
              <button type="button" className="btn btn--primary btn--md" onClick={() => setContact(true)} aria-expanded={contact}>Get in touch</button>
              <Link to={getHomeHref()} className="about-desk__back">&larr; Back to Home</Link>
            </>
          )}
        </div>
      </nav>

      {compact ? (
        <div className="about-desk__compact">
          {/* no gutters on a phone: the "How I work" iPad leads the folder instead */}
          <div className="about-desk__intro-video"><AboutIntroVideo fit turn={-2} /></div>
          {folderMarkup}
          <section className="about-desk__deck" aria-label="The archive, first edition">
            <ul className="archive-deck__hand">
              {ARCHIVE_CARDS.map((card, i) => (
                <li key={card.slug} className="archive-deck__slot" style={{ '--i': i, '--d': Math.abs(i - 3) } as React.CSSProperties}>
                  <ArchiveCard card={card} total={ARCHIVE_CARDS.length} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : hybrid ? (
        <div className="shelf shelf--hybrid shelf--site">
          {/* the reading column, with the hero's Layers panel as the way between the three tabs */}
          <div className="site-top shelf__row shelf__row--hybrid">
            <p className="site-frame-label" aria-hidden="true">About / {DESK_TABS.find((t) => t.key === tab)?.label}</p>
            <div className="shelf__main">{folderMarkup}</div>
            <aside className="site-rail" aria-label="Sections of this page">
              <LayersPanel
                compact
                title="About / Layers"
                label="Sections"
                roles={DESK_TABS.map((t) => t.label)}
                activeIndex={DESK_TABS.findIndex((t) => t.key === tab)}
                onLayerClick={(i) => setTab(DESK_TABS[i].key)}
                controlsId={`about-desk-panel-${tab}`}
              />
              <p className="site-rail__meta">layer / {DESK_TABS.find((t) => t.key === tab)?.index} {DESK_TABS.find((t) => t.key === tab)?.label}</p>
              {/* gutters too narrow for the props: the "How I work" iPad comes into the rail instead */}
              {shelf.gutter < GUTTER_MIN && <AboutIntroVideo fit turn={-3} />}
            </aside>
            <HybridMargin gutter={shelf.gutter} onNote={onNote} />
          </div>
          <div className="desk-band__head desk-band__head--lower">
            <SectionBadge ruled label="The archive" icon={<svg viewBox="0 0 24 24"><path d="M4 6h16v4H4zM6 10v9h12v-9M10 14h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>} />
            <h2>The early work, my notes, and the skill tree</h2>
          </div>
          <section className="shelf__lower shelf__lower--hybrid" aria-label="My notes, the archive and the skill tree">
            <div className="shelf__lower-desk" ref={lowerBox} style={{ width: matW, height: Math.max(HYBRID_LOWER_MIN, matH), zoom: shelf.lower }}>
              <div className="about-desk__mat" style={{ left: 0, top: 0 }} aria-hidden="true">
                <CuttingMat className="s" style={{ width: matW, height: matH }} focusable="false" />
              </div>
              <p className="shelf__note shelf__note--archive" aria-hidden="true">the early work, 1st edition. point at one</p>
              <p className="shelf__note shelf__note--book" aria-hidden="true">my notes. click to turn the page</p>
              {DESK_THINGS.filter((t) => t.group === 'lower' && t.id !== 'pencil').map(renderThing)}
            </div>
          </section>
        </div>
      ) : contained ? (
        <div className="shelf">
          <div className="shelf__row">
            <div className="shelf__main">{folderMarkup}</div>
            <aside className="shelf__tray" aria-label="Things on the desk">
              <div className="shelf__tray-desk" ref={tray} style={{ width: TRAY.width, height: TRAY.height, zoom: shelf.tray }}>
                {DESK_THINGS.filter((t) => t.group === 'side').map(renderThing)}
              </div>
            </aside>
          </div>
          <section className="shelf__lower" aria-label="The archive, the skill tree and the notebook">
            <div className="shelf__lower-desk" ref={lowerBox} style={{ width: SHELF_LOWER.width, height: SHELF_LOWER.height, zoom: shelf.lower }}>
              <div className="about-desk__mat" style={{ left: CONTAINED_MAT.left, top: CONTAINED_MAT.top }} aria-hidden="true">
                <CuttingMat className="s" style={{ width: CUTTING_MAT.width, height: CUTTING_MAT.height }} focusable="false" />
              </div>
              {DESK_THINGS.filter((t) => t.group === 'lower').map(renderThing)}
            </div>
          </section>
          {fixLine && (
            <svg className="shelf__line" aria-hidden="true">
              <path className="about-desk__line-draw" d={`M${fixLine.x1} ${fixLine.y1}Q${(fixLine.x1 + fixLine.x2) / 2 + (fixLine.y2 - fixLine.y1) * 0.16} ${(fixLine.y1 + fixLine.y2) / 2 - (fixLine.x2 - fixLine.x1) * 0.16} ${fixLine.x2} ${fixLine.y2}`} pathLength={1} fill="none" stroke="#5a5d63" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx={fixLine.x1} cy={fixLine.y1} r="3.5" fill="#c23001" />
              <circle cx={fixLine.x2} cy={fixLine.y2} r="6" fill="none" stroke="#f03d01" strokeWidth="2" />
            </svg>
          )}
        </div>
      ) : (
        <div className="about-desk__viewport" style={{ height: Math.round(height * scale) }}>
          <div className="about-desk__desk" ref={root} style={{ width: DESK_WIDTH, height, zoom: scale, ...lightVars, '--stick': `${Math.round(76 / scale)}px` } as React.CSSProperties}>
            <div className="about-desk__mat" style={{ left: CUTTING_MAT.left, top: lowerTop + CUTTING_MAT.top }} aria-hidden="true">
              <CuttingMat className="s" style={{ width: CUTTING_MAT.width, height: CUTTING_MAT.height }} focusable="false" />
            </div>
            {folderMarkup}
            {DESK_THINGS.map(renderThing)}
            {line && (
              <svg className="about-desk__line" viewBox={`0 0 ${DESK_WIDTH} ${height}`} style={{ width: DESK_WIDTH, height }} aria-hidden="true">
                <path className="about-desk__line-draw" d={line.d} pathLength={1} fill="none" stroke="#5a5d63" strokeWidth="1.8" strokeLinecap="round" />
                <path className="about-desk__line-draw" d={line.d2} pathLength={1} fill="none" stroke="#7b7e85" strokeWidth=".9" strokeLinecap="round" opacity=".5" />
                <circle cx={line.x1} cy={line.y1} r="3.5" fill="#c23001" />
                <circle cx={line.x2} cy={line.y2} r="6" fill="none" stroke="#f03d01" strokeWidth="2" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* the site's get-in-touch footer closes the page, pulled up over the foot of the desk */}
      {hybrid && !compact && <Footer />}
      {hybrid && !compact && <FreePencil root={stage} scale={shelf.lower} measure={flavor === 'c'} />}
      {hybrid && flavor && !compact && <FlavorEffects flavor={flavor} tab={tab} inspect={inspect} />}

      {note && <DeskNote note={note.key} side={note.side} onClose={closeNote} open={switchNote} back={<BackChevron />} />}

      {contact && (
        <>
          <button type="button" className="about-desk__scrim" onClick={() => setContact(false)} aria-label="Close" />
          <aside className="about-desk__flyout" aria-labelledby="about-desk-contact">
            <button type="button" className="btn btn--secondary btn--md about-desk__close" onClick={() => setContact(false)}><BackChevron />Back to the desk</button>
            <h3>Get in touch</h3>
            <h2 id="about-desk-contact">Let’s talk.</h2>
            <p>I’m open to remote product design, design systems, and design engineering roles in the US. If my work fits what your team needs, I would be glad to talk.</p>
            <div className="about-desk__flyout-links">
              <a href={EMAIL_HREF}>Email me</a>
              <a href={LINKEDIN_PROFILE_URL} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
            </div>
            <h3>Elsewhere on the site</h3>
            <div className="about-desk__flyout-links">
              <Link to="/notes">Notes</Link>
              <Link to="/talent-tree/">Skill tree</Link>
              <Link to="/design-system">Design system</Link>
              <Link to="/sitemap">Site index</Link>
              <Link to="/resume">Résumé</Link>
            </div>
            <p className="about-desk__fine">© {new Date().getFullYear()} {SITE.name}</p>
          </aside>
          <DismissStrip label="Back to the desk" open onDismiss={() => setContact(false)} width="min(520px, 100vw)" />
        </>
      )}
    </div>
  );
};

export default AboutDeskPage;
