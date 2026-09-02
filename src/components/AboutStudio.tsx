import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

/** Reveal stagger, matching AboutHero's `d()`. */
const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

type StudioPointId = 'monitor' | 'system-wall' | 'walking-pad' | 'game-shelf';

interface StudioPoint {
  id: StudioPointId;
  number: string;
  label: string;
  title: string;
  body: string;
  proof: string;
  position: { left: string; top: string };
}

const STUDIO_POINTS: StudioPoint[] = [
  {
    id: 'monitor',
    number: '01',
    label: 'The desk',
    title: 'Design beside the build',
    body: 'Everything starts as a sketch before it becomes a file. From there Figma, front-end code, and the shipped product stay close enough to pressure-test one another.',
    proof: 'PlayDraft and LoopStack move from idea to working software here. LoopStack exists because I have Type 1 diabetes and wanted the version of that experience that did not exist yet.',
    position: { left: '45%', top: '36%' },
  },
  {
    id: 'system-wall',
    number: '02',
    label: 'The system wall',
    title: 'Make the structure visible',
    body: 'References, rules, and active decisions stay in view so the system is easier to question and maintain.',
    proof: 'The same bias shows up in tokens, components, documentation, and governance.',
    position: { left: '33.5%', top: '24.5%' },
  },
  {
    id: 'walking-pad',
    number: '03',
    label: 'The walking pad',
    title: 'Build a sustainable pace',
    body: 'The room is set up for long focus without treating stillness as the price of serious work.',
    proof: 'A dedicated workspace helps remote work stay focused, repeatable, and present.',
    position: { left: '75%', top: '69%' },
  },
  {
    id: 'game-shelf',
    number: '04',
    label: 'The game shelf',
    title: 'Keep play close',
    body: 'Board games, long-running leagues, and the arguments around both are part of how I think about systems people return to.',
    proof: 'PlayDraft started with that same interest in choices, tension, and shared rituals.',
    position: { left: '14.5%', top: '51.5%' },
  },
];

/** [x, width, height, tone] — tone 0 plain, 1 accent, 2 alt. */
type Spine = [number, number, number, 0 | 1 | 2];

// Shelves of games and books. Widths and heights vary because a row of
// identical bars reads as a barcode rather than a shelf: in the actual closet
// the Catan boxes are tall and square and the card games are thin.
const CLOSET_TOP: Spine[] = [
  [52, 11, 54, 0], [65, 9, 48, 1], [76, 13, 56, 0], [91, 8, 44, 2], [101, 11, 52, 0],
  [114, 9, 50, 1], [125, 14, 56, 0], [141, 8, 46, 0], [151, 11, 54, 2], [164, 9, 48, 0],
  [175, 12, 52, 1], [189, 8, 44, 0], [199, 13, 56, 0],
];

const CLOSET_BOTTOM: Spine[] = [
  [52, 13, 58, 0], [67, 9, 50, 1], [78, 11, 54, 0], [91, 8, 46, 0], [101, 12, 56, 2],
  [115, 10, 48, 0], [127, 9, 52, 1], [138, 13, 58, 0], [153, 8, 44, 0], [163, 11, 54, 0],
  [176, 10, 48, 2], [188, 12, 56, 1], [202, 10, 50, 0],
];

const BOOKS_MID: Spine[] = [
  [614, 8, 32, 0], [624, 7, 28, 1], [633, 9, 34, 0], [644, 6, 26, 2],
  [664, 8, 30, 0], [674, 7, 26, 0], [683, 9, 34, 1], [694, 6, 28, 0],
];

const BOOKS_LOW: Spine[] = [
  [614, 9, 36, 1], [625, 7, 30, 0], [634, 8, 34, 2], [644, 6, 28, 0],
  [664, 7, 30, 0], [673, 9, 36, 0], [684, 7, 28, 1], [693, 6, 32, 0],
];

const TONE_CLASS = ['', ' studio-mock__spine--accent', ' studio-mock__spine--alt'];

const renderSpines = (baseline: number, spines: Spine[]) =>
  spines.map(([x, w, h, tone]) => (
    <rect
      key={`${baseline}-${x}`}
      x={x}
      y={baseline - h}
      width={w}
      height={h}
      className={`studio-mock__spine${TONE_CLASS[tone]}`}
    />
  ));

const StudioDrawing = ({ activePart }: { activePart: StudioPointId }) => (
  // Drawn from the actual room rather than a generic studio: butcher-block
  // standing desk on black legs, monitor on an arm with the laptop on a riser
  // beside it, walking pad folded upright underneath, the game closet, and the
  // couch half of the room that makes it a room and not a workstation.
  //
  // `data-active` lets the selected object respond, so the numbered control and
  // the thing it describes are visibly the same object. Until that existed the
  // only link between them was proximity, which meant the room read as a
  // picture with buttons on top rather than a room you were touching.
  <svg
    className="studio-mock__drawing"
    data-active={activePart}
    viewBox="0 0 900 520"
    role="img"
    aria-labelledby="studio-drawing-title studio-drawing-desc"
  >
    <title id="studio-drawing-title">Drawing of Ryan&rsquo;s home studio</title>
    <desc id="studio-drawing-desc">
      A flattened front elevation of the actual room: a closet of board games, a
      whiteboard of the week with drawings pinned beside it, a wall-mounted TV, a
      standing desk carrying a wide monitor, a laptop on a riser, keyboard,
      notebook and coffee, a walking pad folded upright underneath, a bookcase
      over a sideboard with a lamp, and a cream couch below a framed landscape.
      Numbered controls reveal how each part supports the work.
    </desc>

    <rect x="22" y="24" width="856" height="460" rx="8" className="studio-mock__wall" />
    <path d="M22 390H878V484H22Z" className="studio-mock__floor" />
    {/* Light wood plank floor — the floor is most of the lower third, and a
        flat band there read as nothing at all. */}
    <path d="M22 414H878M22 442H878M22 470H878" className="studio-mock__plank" />
    <path d="M22 390H878" className="studio-mock__ink" />

    {/* Game closet — doors off, wire rack up top for the big flat boxes,
        two wooden shelves of spines below. */}
    <g data-part="game-shelf">
      <rect x="44" y="146" width="176" height="244" className="studio-mock__paper" />
      <rect x="56" y="196" width="72" height="18" className="studio-mock__box studio-mock__box--accent" />
      <rect x="56" y="178" width="72" height="18" className="studio-mock__box" />
      <rect x="134" y="186" width="74" height="28" className="studio-mock__box" />
      <rect x="134" y="168" width="74" height="18" className="studio-mock__box studio-mock__box--accent" />
      <path d="M44 214H220" className="studio-mock__steel" />
      <path d="M58 214V222M80 214V222M102 214V222M124 214V222M146 214V222M168 214V222M190 214V222M208 214V222" className="studio-mock__steel" />
      {renderSpines(300, CLOSET_TOP)}
      {renderSpines(372, CLOSET_BOTTOM)}
      <path d="M44 300H220M44 372H220" className="studio-mock__shelf" />
    </g>

    {/* The week, written out, and whatever the kids brought home this month. */}
    <g data-part="system-wall">
      <rect x="240" y="76" width="132" height="106" className="studio-mock__paper" />
      <path d="M240 98H372" className="studio-mock__steel" />
      <path d="M254 114H332M254 128H346M254 142H318M254 156H338M254 170H304" className="studio-mock__steel" />
      <path d="M254 114H294" className="studio-mock__signal" />
      <rect x="358" y="90" width="46" height="54" className="studio-mock__note" />
      <rect x="374" y="114" width="44" height="52" className="studio-mock__note studio-mock__note--alt" />
      <circle cx="381" cy="90" r="3" className="studio-mock__pin" />
      <circle cx="396" cy="114" r="3" className="studio-mock__pin" />
    </g>

    <circle cx="436" cy="106" r="14" className="studio-mock__paper" />
    <path d="M436 106V97M436 106L442 111" className="studio-mock__ink" />

    {/* Wall-mounted TV, off. */}
    <rect x="462" y="66" width="96" height="58" rx="2" className="studio-mock__tv" />

    {/* Bookcase over the walnut-topped sideboard, lamp on the open end. */}
    <rect x="608" y="152" width="98" height="138" className="studio-mock__paper" />
    <path d="M608 200H706M608 246H706" className="studio-mock__ink" />
    <path d="M658 152V290" className="studio-mock__steel" />
    <rect x="616" y="166" width="26" height="30" className="studio-mock__paper" />
    <path d="M681 182H697L694 196H678Z" className="studio-mock__pot" />
    <path d="M689 182V164M689 174C684 170 680 164 679 158M689 174C694 170 698 164 699 158M689 179C683 177 678 172 675 167M689 179C695 177 700 172 703 167" className="studio-mock__plant studio-mock__plant--small" />
    {renderSpines(246, BOOKS_MID)}
    {renderSpines(290, BOOKS_LOW)}
    <rect x="604" y="300" width="136" height="90" className="studio-mock__paper" />
    <path d="M600 290H744V300H600Z" className="studio-mock__wood" />
    <path d="M650 300V390M698 300V390" className="studio-mock__steel" />
    <circle cx="644" cy="322" r="2.5" className="studio-mock__ink--fill" />
    <circle cx="704" cy="322" r="2.5" className="studio-mock__ink--fill" />
    <path d="M712 252H736L741 276H707Z" className="studio-mock__shade" />
    <path d="M718 276H730V290H718Z" className="studio-mock__wood" />

    {/* Framed landscape over the couch. */}
    <rect x="774" y="96" width="96" height="64" className="studio-mock__art" />
    <path d="M774 150L798 120L816 138L838 112L870 146V160H774Z" className="studio-mock__art-mass" />
    <rect x="774" y="96" width="96" height="64" className="studio-mock__art-frame" />

    {/* Couch. Cream, two seats, one knit pillow that lives on the right.
        Every corner is rounded and the parts overlap front-to-back, because the
        first pass drew it as flush rectangles and it read as a filing cabinet
        sitting where the couch is. Softness is the whole signal here — it is
        the one object in the room that is not a hard edge. */}
    <rect x="762" y="286" width="92" height="64" rx="9" className="studio-mock__fabric" />
    <path d="M808 292V346" className="studio-mock__seam" />
    <rect x="748" y="346" width="120" height="36" rx="8" className="studio-mock__fabric" />
    <rect x="772" y="340" width="36" height="32" rx="6" className="studio-mock__fabric" />
    <rect x="812" y="340" width="36" height="32" rx="6" className="studio-mock__fabric" />
    <rect x="742" y="300" width="26" height="82" rx="10" className="studio-mock__fabric" />
    <rect x="848" y="300" width="26" height="82" rx="10" className="studio-mock__fabric" />
    <rect x="776" y="302" width="28" height="32" rx="4" className="studio-mock__fabric" />
    <rect x="812" y="298" width="32" height="36" rx="4" className="studio-mock__fabric studio-mock__fabric--alt" />
    <path d="M818 306H838M818 316H838M818 326H838" className="studio-mock__knit" />
    <path d="M754 382V390M860 382V390" className="studio-mock__ink" />

    {/* Anti-fatigue mat. Stays under the desk — it is where you stand. */}
    <path d="M250 392H480V404H250Z" className="studio-mock__mat" />

    {/* Walking pad, folded upright and parked against the sideboard. Drawn
        after it so it clearly stands in front rather than inside it. */}
    <g data-part="walking-pad">
      <path d="M624 296H706V390H624Z" className="studio-mock__pad" />
      <path d="M634 310H696V374H634Z" className="studio-mock__pad-deck" />
      <path d="M620 292H710V300H620Z" className="studio-mock__pad" />
      <rect x="628" y="318" width="6" height="16" className="studio-mock__box--accent" />
      <rect x="696" y="318" width="6" height="16" className="studio-mock__box--accent" />
      <path d="M632 382H698" className="studio-mock__pad-line" />
    </g>

    {/* The desk. */}
    <g data-part="monitor">
      {/* Wide monitor on its arm. */}
      <path d="M460 272V286M434 286H486" className="studio-mock__frame-line" />
      <rect x="380" y="168" width="160" height="104" rx="3" className="studio-mock__monitor" />
      {/* What is on the screen is a chart, because what gets built here is a
          data product. Drawn in the plate's own vernacular rather than dropping
          in a screenshot — a raster image would break the blueprint conceit
          that holds the rest of the drawing together. */}
      <path d="M394 198H444" className="studio-mock__screen-line" />
      <path d="M394 250H518M394 250V206" className="studio-mock__screen-axis" />
      <path d="M394 226H518" className="studio-mock__screen-band" />
      <path
        d="M394 240L414 232L436 214L458 222L478 202L498 210L518 196"
        className="studio-mock__screen-trace"
      />

      {/* Butcher block on black legs. */}
      <path d="M228 286H588V300H228Z" className="studio-mock__wood" />
      <path d="M266 300H280V382H266Z" className="studio-mock__frame" />
      <path d="M546 300H560V382H546Z" className="studio-mock__frame" />
      <path d="M244 382H302V390H244Z" className="studio-mock__frame" />
      <path d="M524 382H582V390H524Z" className="studio-mock__frame" />
      <path d="M273 306H553" className="studio-mock__frame-line" />

      {/* Spiral notebook and a pen, always to the left of the keyboard. */}
      <path d="M238 276H300V286H238Z" className="studio-mock__paper" />
      <path d="M243 276V286M249 276V286M255 276V286M261 276V286M267 276V286" className="studio-mock__steel" />
      <path d="M276 272H300" className="studio-mock__ink" />

      {/* MacBook on its riser, overlapping the monitor's left edge. */}
      <path d="M312 272H400L394 286H318Z" className="studio-mock__frame" />
      <rect x="320" y="206" width="76" height="60" rx="2" className="studio-mock__laptop-screen" />
      <path d="M306 266H410L416 272H300Z" className="studio-mock__laptop" />

      {/* Full-size keyboard with the numpad, trackpad to its right. */}
      <rect x="404" y="276" width="112" height="10" rx="2" className="studio-mock__keys" />
      <path d="M486 276V286" className="studio-mock__steel" />
      <path d="M414 280H478M414 283H478" className="studio-mock__key-line" />
      <rect x="524" y="276" width="28" height="10" rx="2" className="studio-mock__keys" />

    </g>

    {/* The only thing in the room that moves on its own, and the only object
        that stays lit in every state — it sits on the desk but outside the
        desk's group, because dimming the coffee to 0.55 for three of the four
        selections put out the one signal that says someone is in here. */}
    <g className="studio-mock__coffee">
      <path d="M556 260H584V280A6 6 0 0 1 578 286H562A6 6 0 0 1 556 280Z" className="studio-mock__mug" />
      <path d="M584 265H591A7 7 0 0 1 591 279H584" className="studio-mock__mug-handle" />
      <g className="studio-mock__steam" aria-hidden="true">
        <path d="M563 254C559 246 567 242 563 234" className="studio-mock__steam-wisp" />
        <path d="M572 256C568 247 576 243 572 233" className="studio-mock__steam-wisp studio-mock__steam-wisp--mid" />
        <path d="M580 254C576 246 584 242 580 236" className="studio-mock__steam-wisp studio-mock__steam-wisp--late" />
      </g>
    </g>

    {/* Ottoman, foreground, where it is always in the way. */}
    <path d="M636 414H744L760 442H652Z" className="studio-mock__ottoman" />

    {/* Construction marks */}
    <path d="M22 12V2M12 24H2M878 12V2M888 24H898M22 496V506M12 484H2M878 496V506M888 484H898" className="studio-mock__crop" />
    <text x="32" y="510" className="studio-mock__svg-label">STUDIO PLATE / DRAWN FROM THE ROOM</text>
    <text x="688" y="510" className="studio-mock__svg-label">FRONT ELEVATION / NOT TO SCALE</text>
  </svg>
);

const AboutStudio: React.FC = () => {
  const [activePointId, setActivePointId] = useState<StudioPointId>('monitor');
  const [isAfterHours, setIsAfterHours] = useState(false);
  const activePoint = STUDIO_POINTS.find((point) => point.id === activePointId) ?? STUDIO_POINTS[0];
  // The panel only mounts when this tab is selected, so the observer fires on
  // tab-in — the underline draws when you arrive, not once per page load.
  const [revealRef, revealed] = useReveal<HTMLElement>(0.15);

  return (
    <section
      ref={revealRef}
      className={`studio-mock${revealed ? ' is-visible' : ''}`}
      aria-labelledby="studio-mock-heading"
    >
      <div className="studio-mock__intro">
        <div>
          <p className="studio-mock__eyebrow">[ Concept mockup / where it happens ]</p>
          <h1 id="studio-mock-heading" className="studio-mock__heading">
            The room behind{' '}
            <span className="studio-mock__heading-mark">
              the work.
              {/* Same hand-drawn underline as the approach tab's h1, same path,
                  same draw. The two tabs are one page; their headline should
                  behave like one headline. */}
              <svg
                className="studio-mock__underline"
                width="320"
                height="16"
                viewBox="0 0 320 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="reveal-draw"
                  style={d(360)}
                  d="M4 10 C 80 3, 220 3, 316 9"
                  stroke="var(--color-primary, #f03d01)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                />
              </svg>
            </span>
          </h1>
        </div>
        <div className="studio-mock__intro-copy">
          <p>
            A dedicated studio for focused design, close-to-code making, and the systems that help
            the work survive after launch.
          </p>
          <p className="studio-mock__intro-note">
            Built as a drawing rather than a walkthrough. The room answers when you
            ask it something — which is the part worth having, and the part that
            still works on a slow connection.
          </p>
        </div>
      </div>

      {/* Facts, not instructions. The strip that lived here explained how to
          use the widget below it, which is the one thing a visitor can work out
          on their own — and it pushed the details a hiring team actually scans
          for off the page entirely. */}
      <dl className="studio-mock__facts">
        <div>
          <dt>Base</dt>
          <dd>South Bend, Indiana</dd>
        </div>
        <div>
          <dt>Time zone</dt>
          <dd>Eastern &middot; US remote</dd>
        </div>
        <div>
          <dt>Workspace</dt>
          <dd>Dedicated home studio</dd>
        </div>
        <div>
          <dt>Working loop</dt>
          <dd>Focus &rarr; critique &rarr; handoff</dd>
        </div>
      </dl>

      <div className={`studio-mock__workspace${isAfterHours ? ' is-after-hours' : ''}`}>
        <div className="studio-mock__scene">
          <div className="studio-mock__scene-meta">
            <span>Four objects &middot; select to read</span>
            <span>Drawn from the actual room</span>
          </div>
          <div className="studio-mock__drawing-wrap">
            <StudioDrawing activePart={activePointId} />
            {STUDIO_POINTS.map((point) => {
              const isActive = activePointId === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  className={`studio-mock__hotspot${isActive ? ' is-active' : ''}`}
                  style={point.position}
                  aria-label={`Explore ${point.label}`}
                  aria-pressed={isActive}
                  onClick={() => setActivePointId(point.id)}
                >
                  {point.number}
                </button>
              );
            })}
            <button
              type="button"
              className="studio-mock__light-switch"
              aria-pressed={isAfterHours}
              aria-label={isAfterHours ? 'Switch the studio to workday light' : 'Switch the studio to after-hours light'}
              onClick={() => setIsAfterHours((current) => !current)}
            >
              <span aria-hidden="true" />
              <small>{isAfterHours ? 'Workday' : 'After hours'}</small>
            </button>
          </div>
        </div>

        <aside className="studio-mock__detail" aria-live="polite">
          <div className="studio-mock__detail-body" key={activePoint.id}>
            <p className="studio-mock__detail-index">{activePoint.number} / {activePoint.label}</p>
            <h2>{activePoint.title}</h2>
            <p>{activePoint.body}</p>
            <div className="studio-mock__proof">
              <span>What it proves</span>
              <p>{activePoint.proof}</p>
            </div>
          </div>
          <p className="studio-mock__detail-hint">Select a numbered object to read the room.</p>
        </aside>
      </div>
    </section>
  );
};

export default AboutStudio;
