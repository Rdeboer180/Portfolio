import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

/** Reveal stagger, matching AboutHero's `d()`. */
const d = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

type StudioPointId = 'monitor' | 'system-wall' | 'walking-pad' | 'game-shelf' | 'library';

interface StudioPoint {
  id: StudioPointId;
  number: string;
  label: string;
  title: string;
  /**
   * A body may carry one emphasised phrase: the concept the object stands
   * for, never a tool name, so the reading is a philosophy and not a skills
   * cloud. The proof stays plain; its block already carries the accent.
   */
  body: React.ReactNode;
  proof: string;
  position: { left: string; top: string };
}

// Copy budget, from the handoff that repositioned this room for design-systems
// and design-engineering roles: body 35–55 words, proof 25–45. The room should
// reward a click without becoming five mini case studies. The three About
// surfaces keep distinct jobs — My Process is how Ryan works, Systems Beyond
// the Canvas is where the system lives, this room is what habits make that
// believable — so nothing here restates the four-beat loop, and every proof
// names something a reader can go and check elsewhere on the site.
const STUDIO_POINTS: StudioPoint[] = [
  {
    id: 'monitor',
    number: '01',
    label: 'The desk',
    title: 'Keep design and build in the same conversation',
    body: (
      <>
        A screen rarely gets the final say. I move between{' '}
        <strong>Figma, working prototypes, front-end code, and the shipped product</strong>, and
        keep them close enough to challenge each other. A component that works in Figma and
        breaks in production is not finished. Code that ships clean and drifts from the system
        is not either.
      </>
    ),
    proof: 'PlayDraft went from brand sketch to an agent-assisted React Native build on TestFlight in twelve weeks, the Figma file and the code correcting each other at this desk. LoopStack is here too, running on my own glucose data because I have Type 1 diabetes.',
    position: { left: '45%', top: '36%' },
  },
  {
    id: 'system-wall',
    number: '02',
    label: 'The system wall',
    title: 'Make the rules visible enough to travel',
    body: (
      <>
        A design system gets fragile when its logic lives only in a file or in one
        person&rsquo;s head. I keep{' '}
        <strong>
          tokens, component decisions, open questions, accessibility rules, and implementation
          constraints
        </strong>{' '}
        where they can be used outside the original canvas: by designers, engineers, reviewers,
        and increasingly the agents helping us build.
      </>
    ),
    proof: 'WheelRack was built that way: neither Figma nor Storybook was the source of truth, so they had to agree. This site keeps its rules in DESIGN.md and PRODUCT.md, one record for the person and the agent building from it.',
    position: { left: '33.5%', top: '24.5%' },
  },
  // The retired fifth principle, "Keep putting in the reps", lives here now —
  // as a habit with an object, not as a step in the loop. This is where the
  // people and shows Ryan studies are named, because this is where the
  // listening physically happens; the process closer on the approach tab
  // keeps the argument (what studying other people's standards does to the
  // work) and points here rather than listing them again. One place names
  // the sources, the other says why they matter. Neither restates the other.
  //
  // The title deliberately does not say "reps". The closer and the story on
  // the approach tab both already do, and the handoff's "Put in the reps
  // between releases" would have made three on one page. Ryan's own direction
  // for this point — never falling behind, staying in shape mentally,
  // sharpening the biggest gap he has named — gives the title instead, and
  // the handoff's "between releases" framing keeps it about consistency and
  // curiosity rather than hours.
  //
  // COPY STATUS: body and proof come from Ryan's direction (purposeful
  // conferences, Dive Radio, the Dive Club series, emerging tools and the
  // workflows around them as the gap) and from what the site records: the
  // "Studying the tape" note (July 2026) holds the Monday rule and the Dive
  // Club / Config habit; the AI-workflow note dates the "better search box"
  // starting point to late 2025; the names were Ryan's own list in the
  // process closer before it moved here. Still to confirm with Ryan: the
  // name of Dive Radio, now linked to the show's own playlist ("Dive Radio -
  // Weekly Live Show"), which is the only corroboration it has on the site,
  // and whether a conference should be named (none is, because none is on
  // the record).
  {
    id: 'walking-pad',
    number: '03',
    label: 'The walking pad',
    title: 'Stay in shape between releases',
    body: (
      <>
        What the pad is for between launches:{' '}
        <a
          className="studio-mock__body-link"
          href="https://www.youtube.com/playlist?list=PLWyuIk6_QxAE"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dive Radio
        </a>
        , and{' '}
        <a
          className="studio-mock__body-link"
          href="https://www.dive.club/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dive Club
        </a>{' '}
        interviews with Dan Mall on design systems, Loredana Crisan on Figma, Meaghan Choi on
        Claude Code. Tommy Geoco and Michael Riddering are the standing argument. Not to keep
        up. To close the gap I have named:{' '}
        <strong>emerging tools and the workflows around them</strong>.
      </>
    ),
    proof: 'The rule is from the note Studying the tape: if watching it doesn’t change what you make on Monday, it was entertainment. In late 2025 I was using an LLM as a better search box. PlayDraft on TestFlight and an installable design-taste skill came after.',
    // On the front half of the belt, right of the hinge, so the control is
    // still on the pad once the rear half has folded over onto it. Clear of
    // the hood and its readout down to tablet width; at phone width the
    // control covers the hood's edge and the readout is still in the clear.
    position: { left: '48.4%', top: '72.5%' },
  },
  {
    id: 'game-shelf',
    number: '04',
    label: 'The game shelf',
    title: 'Design systems people want to return to',
    body: (
      <>
        Board games and long-running leagues are a useful reminder that a system is more than
        its rules. Rules give it consistency;{' '}
        <strong>choice, feedback, tension, and shared understanding</strong> are what bring
        people back. I hold product and design systems to the same test: a technically correct
        system still fails if the team avoids it.
      </>
    ),
    proof: 'PlayDraft started there: rules people can understand, choices that stay interesting, and the on-the-clock tension of a fantasy draft, opened to snacks, movies, or anything friends write in.',
    position: { left: '14.5%', top: '51.5%' },
  },
  {
    id: 'library',
    number: '05',
    label: 'The library',
    title: 'Keep the whole system within reach',
    body: (
      <>
        Shelved by the job each tool does, the core in orange: Figma to frame and steer, code to
        make the behavior real, documentation to preserve intent, analytics and QA to test the
        result, agent skills to carry the same rules into new requests.{' '}
        <strong>The tool changes with the question. The system should survive the switch.</strong>
      </>
    ),
    proof: 'This site runs on the same idea: tokens named in Figma first, React and TypeScript, written governance, agent-readable context, and drafts from Claude Code with every call still mine.',
    // On the cupboard base, not the shelves — the one part of the unit with
    // no label under it for the control to cover. A touch right of the unit's
    // centre line, from when the walking pad's control sat at the sideboard
    // and the two touched at phone width; it stays because it is fine there.
    position: { left: '91%', top: '69%' },
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

/**
 * A volume in the library of assets. Standing volumes carry their label down
 * the spine; flat ones lie on the shelf and carry it along the long side.
 * `core` marks a core proficiency — the same set that is starred under Tools
 * & Technologies, so orange here means the same thing it means there.
 */
interface Volume {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  flat?: boolean;
  core?: boolean;
}

// The library, curated from the Tools & Technologies inventory: one shelf per
// category, in the inventory's own order, and only the tools that have shipped
// something. Forty-two spines is a barcode; eighteen is a shelf.
//
// How a tool reads at this scale: the label is Menlo at 10 user units, which
// is ~8.5px on a desktop viewport and ~7.4px on a tablet — the same size as
// the plate marks in the corners and the light switch's own label. A name
// that fits on a standing spine (five characters or fewer in a 46-unit row)
// stands; a longer one lies flat so it can run horizontally. At phone widths
// the SVG is ~317px wide and no label in the drawing is readable, so the
// detail panel and the <desc> carry the inventory there; the shelf still
// reads as a shelf of distinct volumes.
const LIBRARY: Volume[] = [
  // Bookcase over the sideboard — the build. Short names stand; the two
  // long ones lie in a stack on the lower shelf.
  { x: 613, y: 208, w: 19, h: 38, label: 'SCSS', core: true },
  { x: 635, y: 206, w: 21, h: 40, label: 'React' },
  { x: 659, y: 212, w: 18, h: 34, label: 'AEM', core: true },
  { x: 681, y: 209, w: 20, h: 37, label: 'Expo' },
  { x: 612, y: 276, w: 76, h: 14, label: 'TypeScript', flat: true },
  { x: 618, y: 262, w: 50, h: 14, label: 'GitHub', flat: true },

  // Tall unit, top shelf — design and prototyping.
  { x: 756, y: 158, w: 22, h: 42, label: 'Figma', core: true },
  { x: 781, y: 186, w: 80, h: 14, label: 'Illustrator', flat: true, core: true },
  { x: 787, y: 172, w: 67, h: 14, label: 'Photoshop', flat: true },

  // Second shelf — the design system. All three names are long, so the
  // whole shelf is a stack.
  { x: 757, y: 232, w: 93, h: 14, label: 'Atomic Design', flat: true, core: true },
  { x: 763, y: 218, w: 93, h: 14, label: 'Design Tokens', flat: true },
  { x: 760, y: 204, w: 67, h: 14, label: 'Storybook', flat: true },

  // Third shelf — agentic systems.
  { x: 756, y: 254, w: 20, h: 36, label: 'MCP' },
  { x: 777, y: 276, w: 86, h: 14, label: 'Agent Skills', flat: true },
  { x: 781, y: 262, w: 80, h: 14, label: 'Claude Code', flat: true },

  // Fourth shelf — UX, accessibility, measurement.
  { x: 756, y: 322, w: 86, h: 14, label: 'Adobe Target', flat: true },
  { x: 760, y: 308, w: 28, h: 14, label: 'SEO', flat: true, core: true },
  { x: 844, y: 298, w: 20, h: 38, label: 'WCAG' },
];

const renderVolumes = (volumes: Volume[]) =>
  volumes.map(({ x, y, w, h, label, flat, core }) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    return (
      <g key={label}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={1}
          className={`studio-mock__vol${core ? ' studio-mock__vol--core' : ''}`}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          transform={flat ? undefined : `rotate(90 ${cx} ${cy})`}
          className={`studio-mock__vol-label${core ? ' studio-mock__vol-label--core' : ''}`}
        >
          {label}
        </text>
      </g>
    );
  });

const StudioDrawing = ({ activePart }: { activePart: StudioPointId }) => (
  // Drawn from the actual room rather than a generic studio: butcher-block
  // standing desk on black legs, monitor on an arm with the laptop on a riser
  // beside it, walking pad out on the floor underneath, the game closet, and the
  // library wall on the right that gives the closet on the left something to
  // answer to.
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
      whiteboard of the week with drawings pinned beside it, a clock, a
      wall-mounted TV, a standing desk carrying a wide monitor, a laptop on a
      riser, keyboard, notebook and coffee, a walking pad out on the floor
      beneath it with its slatted belt along the top, a hinge pin at mid-deck
      and the motor hood with its readout at the sideboard end (select it and
      the rear half folds up and over to rest on the hood, the way it is put
      away),
      and on the right a library of assets: a bookcase over a
      sideboard with a lamp, grown into a tall unit with a cupboard base. Its
      spines and flat volumes are labelled with the tools of the work, one
      shelf per job. Design: Figma, Illustrator, Photoshop. System: Atomic
      Design, Design Tokens, Storybook. Build: SCSS, React, AEM, Expo,
      TypeScript, GitHub. Agentic: MCP, Claude Code, Agent Skills. Measurement:
      Adobe Target, SEO, WCAG. Orange volumes mark core proficiencies. Numbered
      controls reveal how each part supports the work.
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

    {/* Walnut-topped sideboard, lamp on the open end. The bookcase that sits
        on it belongs to the library group below. */}
    <rect x="604" y="300" width="136" height="90" className="studio-mock__paper" />
    <path d="M600 290H744V300H600Z" className="studio-mock__wood" />
    <path d="M650 300V390M698 300V390" className="studio-mock__steel" />
    <circle cx="644" cy="322" r="2.5" className="studio-mock__ink--fill" />
    <circle cx="704" cy="322" r="2.5" className="studio-mock__ink--fill" />
    <path d="M712 252H736L741 276H707Z" className="studio-mock__shade" />
    <path d="M718 276H730V290H718Z" className="studio-mock__wood" />

    {/* The library of assets. The bookcase over the sideboard, grown into a
        tall unit on the floor beside it — the two share their shelf lines, and
        the lamp sits in the nook between. It replaces the couch, which was
        drawn twice and read as a filing cabinet both times, and it gives the
        right side of the room a piece of furniture with the closet's weight
        so the room does not end at the sideboard. */}
    <g data-part="library">
      <rect x="608" y="152" width="98" height="138" className="studio-mock__paper" />
      <path d="M608 200H706M608 246H706" className="studio-mock__ink" />
      <rect x="616" y="166" width="26" height="30" className="studio-mock__paper" />
      <path d="M681 182H697L694 196H678Z" className="studio-mock__pot" />
      <path d="M689 182V164M689 174C684 170 680 164 679 158M689 174C694 170 698 164 699 158M689 179C683 177 678 172 675 167M689 179C695 177 700 172 703 167" className="studio-mock__plant studio-mock__plant--small" />

      <rect x="752" y="152" width="116" height="238" className="studio-mock__paper" />
      <path d="M752 200H868M752 246H868M752 290H868M752 336H868" className="studio-mock__ink" />
      {/* Cupboard base with the sideboard's knobs, then a plinth. A run of
          spines all the way to the floor is the barcode again; the doors give
          the eye somewhere to rest and the unit somewhere to stand. */}
      <path d="M810 336V384" className="studio-mock__steel" />
      <circle cx="804" cy="360" r="2.5" className="studio-mock__ink--fill" />
      <circle cx="816" cy="360" r="2.5" className="studio-mock__ink--fill" />
      <path d="M752 384H868V390H752Z" className="studio-mock__frame" />

      {renderVolumes(LIBRARY)}
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

    {/* Walking pad, out on the floor under the desk: a long, low deck with the
        belt slatted along its top, a hinge pin at mid-deck, and the motor hood
        at the sideboard end. At rest it is drawn in use, which is the state
        the rest of the plate is in (the coffee is steaming, the chart is up)
        and the one pose in which this object is unmistakable: the cue a
        treadmill cannot do without is its length. Three earlier passes drew
        it parked instead — folded upright under the desk, then in front of
        the sideboard, then with a slatted belt, a rounded fold and wheels —
        and it read as a cabinet with glass doors, a cabinet again, and a
        space heater. A folded pad seen square-on is a stubby box, and a
        stubby box with casters is an appliance.

        The fourth pass keeps the in-use pose at rest and makes the fold the
        thing you ask for. Selecting the point lights the readout, steps the
        belt one slat as it comes to a stop, then hinges the rear half up
        through vertical and over onto the front half, which is how the real
        one is put away. Deselecting unfolds it. Nothing else in a room folds
        like this, so the motion carries the identity the parked pose alone
        could not, and the folded pose it lands in is a low double deck
        beside the hood rather than the tall box that read as furniture.

        The fold has to end lying down. The desk is drawn with 66 units of
        clearance above the deck and the plate is not to scale (the deck is
        long on purpose), so a folded stack stood on end is 106 tall and goes
        through the desktop; the real pad's upright parking spot is not
        available in this drawing. And the fold does not close flat. On the
        real thing the motor housing is taller than the deck, so the folded
        rear half rests on it at a slight incline with a wedge of air between
        the two belts. The first cut of this pass closed it flat, and a flat
        double deck beside a boxy hood read at 6× as a stacked amplifier next
        to a heater — the appliance again. The open wedge is what says
        "hinged", so the hood carries a sloped top and the turn stops at 168°
        with the rear half lying along that slope. The hinge sits at 400, a
        touch nearer the far end than the midpoint, so the rear half lands on
        the hood rather than short of it; the readout is on the hood's face,
        below the slope, so it stays lit when the deck is lying over it.

        Painted after the desk, not before. At rest the two never overlap, but
        at the top of the swing the rising half stands in front of the laptop
        riser, and a desk painted over it would look like it had swallowed
        the pad. The geometry of the turn is in _about-studio.scss. */}
    <g data-part="walking-pad">
      {/* Front half: deck, belt, and the motor hood with its sloped top and
          the readout on its face. */}
      <path d="M400 366H518V390H400Z" className="studio-mock__pad" />
      <clipPath id="studio-pad-belt-front">
        <rect x="404" y="370" width="70" height="12" />
      </clipPath>
      <rect x="404" y="370" width="70" height="12" className="studio-mock__pad-belt" />
      {/* One slat more than fits on each half: the clip hides whichever is
          off the deck, so the belt can step a slat without a gap opening at
          either end. */}
      <g clipPath="url(#studio-pad-belt-front)">
        <g className="studio-mock__pad-slats">
          <path d="M412 371V381M422 371V381M432 371V381M442 371V381M452 371V381M462 371V381M472 371V381M482 371V381" className="studio-mock__pad-slat" />
        </g>
      </g>
      <path d="M480 366V352Q480 349 483 348.4L514 341.8Q518 341 518 345V390H480Z" className="studio-mock__pad" />
      <rect x="489" y="356" width="20" height="5" rx="1" className="studio-mock__pad-display" />

      {/* Rear half. Hinged at (400, 366), the top of the deck at the seam.
          Turned 168° in _about-studio.scss it lies along the hood's slope
          with its belt facing the front belt, a wedge of air between. */}
      <g className="studio-mock__pad-rear">
        <path d="M311 366H400V390H306V371A5 5 0 0 1 311 366Z" className="studio-mock__pad" />
        <clipPath id="studio-pad-belt-rear">
          <rect x="314" y="370" width="83" height="12" />
        </clipPath>
        <rect x="314" y="370" width="83" height="12" className="studio-mock__pad-belt" />
        <g clipPath="url(#studio-pad-belt-rear)">
          <g className="studio-mock__pad-slats">
            <path d="M322 371V381M332 371V381M342 371V381M352 371V381M362 371V381M372 371V381M382 371V381M392 371V381M402 371V381" className="studio-mock__pad-slat" />
          </g>
        </g>
      </g>
      <circle cx="400" cy="366" r="2.4" className="studio-mock__pad-hinge" />
    </g>

    {/* The only thing in the room that moves on its own, and the only object
        that stays lit in every state — it sits on the desk but outside the
        desk's group, because dimming the coffee to 0.55 for four of the five
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

    {/* Construction marks */}
    <path d="M22 12V2M12 24H2M878 12V2M888 24H898M22 496V506M12 484H2M878 496V506M888 484H898" className="studio-mock__crop" />
    <text x="32" y="510" className="studio-mock__svg-label">STUDIO PLATE / DRAWN FROM THE ROOM</text>
    <text x="688" y="510" className="studio-mock__svg-label">FRONT ELEVATION / NOT TO SCALE</text>
  </svg>
);

const AboutStudio: React.FC = () => {
  const [activePointId, setActivePointId] = useState<StudioPointId>('monitor');
  const [isAfterHours, setIsAfterHours] = useState(false);
  // The panel is now always mounted (both panels are, so the prerendered HTML
  // carries both) and merely `hidden` while the other tab is selected. The
  // reveal still fires on tab-in rather than on page load: a `display: none`
  // subtree has no box, so IntersectionObserver reports it as not intersecting
  // and only delivers `isIntersecting` once the panel is shown. The underline
  // draws when you arrive, not while nobody is looking.
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
          <p className="studio-mock__intro-lede">
            Most of the work I care about happens between the obvious artifacts.
          </p>
          <p>
            This is where a Figma decision gets tested in code, a production edge case becomes a
            new system rule, an agent gets the same context as the team, and an idea gets enough
            drafts to become something other people can use.
          </p>
          <p>
            The room is personal. The way it works is not:{' '}
            <b className="studio-mock__emphasis">
              keep the system close, keep the build close, and keep feeding what you learn back
              into both.
            </b>
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
          <dd>Define &rarr; explore &rarr; learn &rarr; feed back</dd>
        </div>
      </dl>

      <div className={`studio-mock__workspace${isAfterHours ? ' is-after-hours' : ''}`}>
        <div className="studio-mock__scene">
          <div className="studio-mock__scene-meta">
            <span>Five objects &middot; select to read</span>
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

        {/* Every point's copy is in the DOM and the inactive ones are `hidden`,
            the same trade the About tabs make: the prerendered HTML carries all
            five readings instead of whichever one happened to be selected at
            build time. Leaving `display: none` for the displayed one restarts
            the entry animation, so the swap still reads as a swap. */}
        <aside className="studio-mock__detail" aria-live="polite">
          {STUDIO_POINTS.map((point) => (
            <div
              key={point.id}
              className="studio-mock__detail-body"
              hidden={point.id !== activePointId}
            >
              <p className="studio-mock__detail-index">{point.number} / {point.label}</p>
              <h2>{point.title}</h2>
              <p>{point.body}</p>
              <div className="studio-mock__proof">
                <span>What it proves</span>
                <p>{point.proof}</p>
              </div>
            </div>
          ))}
          <p className="studio-mock__detail-hint">Select a numbered object to read the room.</p>
        </aside>
      </div>
    </section>
  );
};

export default AboutStudio;
