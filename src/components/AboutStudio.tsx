import React, { useState } from 'react';

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
    label: 'The monitor',
    title: 'Design beside the build',
    body: 'Everything starts as a sketch before it becomes a file. From there Figma, front-end code, and the shipped product stay close enough to pressure-test one another.',
    proof: 'PlayDraft and LoopStack move from idea to working software here. LoopStack exists because I have Type 1 diabetes and wanted the version of that experience that did not exist yet.',
    position: { left: '49%', top: '45%' },
  },
  {
    id: 'system-wall',
    number: '02',
    label: 'The system wall',
    title: 'Make the structure visible',
    body: 'References, rules, and active decisions stay in view so the system is easier to question and maintain.',
    proof: 'The same bias shows up in tokens, components, documentation, and governance.',
    position: { left: '70%', top: '23%' },
  },
  {
    id: 'walking-pad',
    number: '03',
    label: 'The walking pad',
    title: 'Build a sustainable pace',
    body: 'The room is set up for long focus without treating stillness as the price of serious work.',
    proof: 'A dedicated workspace helps remote work stay focused, repeatable, and present.',
    position: { left: '48%', top: '82%' },
  },
  {
    id: 'game-shelf',
    number: '04',
    label: 'The game shelf',
    title: 'Keep play close',
    body: 'Board games, long-running leagues, and the arguments around both are part of how I think about systems people return to.',
    proof: 'PlayDraft started with that same interest in choices, tension, and shared rituals.',
    position: { left: '15%', top: '42%' },
  },
];

const StudioDrawing = () => (
  <svg className="studio-mock__drawing" viewBox="0 0 900 520" role="img" aria-labelledby="studio-drawing-title studio-drawing-desc">
    <title id="studio-drawing-title">Concept drawing of Ryan's home studio</title>
    <desc id="studio-drawing-desc">A front-facing vector room with a game shelf, standing desk and monitor, system wall, plant, and walking pad. Numbered controls reveal how each part supports the work.</desc>

    <rect x="22" y="24" width="856" height="460" rx="8" className="studio-mock__wall" />
    <path d="M22 390H878V484H22Z" className="studio-mock__floor" />
    <path d="M22 390H878" className="studio-mock__ink" />

    {/* Window and quiet daylight */}
    <rect x="50" y="58" width="164" height="164" rx="4" className="studio-mock__paper" />
    <path d="M132 58V222M50 140H214" className="studio-mock__steel" />
    <path d="M214 90L380 238H214Z" className="studio-mock__sun" />

    {/* Game shelf */}
    <rect x="58" y="250" width="180" height="134" rx="3" className="studio-mock__paper" />
    <path d="M58 294H238M58 338H238" className="studio-mock__ink" />
    <rect x="73" y="260" width="35" height="28" className="studio-mock__box studio-mock__box--accent" />
    <rect x="113" y="266" width="48" height="22" className="studio-mock__box" />
    <rect x="167" y="256" width="55" height="32" className="studio-mock__box" />
    <rect x="72" y="304" width="58" height="28" className="studio-mock__box" />
    <rect x="136" y="300" width="36" height="32" className="studio-mock__box studio-mock__box--accent" />
    <rect x="178" y="310" width="43" height="22" className="studio-mock__box" />
    <path d="M80 348V377M92 348V377M109 348V377M132 348V377M146 348V377" className="studio-mock__steel" />

    {/* Wall artifacts */}
    <rect x="300" y="70" width="168" height="92" rx="3" className="studio-mock__paper" />
    <path d="M324 97H438M324 116H410M324 135H452" className="studio-mock__steel" />
    <path d="M324 97H375" className="studio-mock__signal" />
    <rect x="558" y="64" width="210" height="120" rx="3" className="studio-mock__paper" />
    <path d="M584 92H632V126H584ZM646 92H694V126H646ZM708 92H742V126H708Z" className="studio-mock__note" />
    <path d="M584 146H742" className="studio-mock__steel" />
    <path d="M600 146V164M662 146V164M724 146V164" className="studio-mock__steel" />

    {/* Desk and monitor */}
    <path d="M290 314H700V335H290Z" className="studio-mock__desk" />
    <path d="M318 335V414M672 335V414" className="studio-mock__ink studio-mock__ink--heavy" />
    <rect x="401" y="204" width="188" height="106" rx="6" className="studio-mock__monitor" />
    <path d="M495 310V326M452 326H538" className="studio-mock__ink studio-mock__ink--heavy" />
    <path d="M424 228H484M424 246H548M424 264H506M520 228H566" className="studio-mock__screen-line" />
    <path d="M424 282H470" className="studio-mock__screen-signal" />
    <rect x="422" y="319" width="124" height="8" rx="3" className="studio-mock__keyboard" />
    <path d="M610 304L626 256L641 304M626 256V238" className="studio-mock__lamp" />
    <circle cx="626" cy="234" r="10" className="studio-mock__lamp-head" />

    {/* Plant */}
    <path d="M742 374H807L797 422H752Z" className="studio-mock__pot" />
    <path d="M774 372C768 334 748 308 726 292M774 370C780 328 803 300 828 292M774 368C756 344 735 342 715 346M776 355C798 338 818 340 840 350" className="studio-mock__plant" />

    {/* Walking pad */}
    <path d="M326 432H648L678 466H298Z" className="studio-mock__pad" />
    <path d="M336 444H638" className="studio-mock__pad-line" />

    {/* Light switch — its HTML control sits over this plate */}
    <rect x="824" y="218" width="24" height="38" rx="3" className="studio-mock__paper" />
    <path d="M836 228V246" className="studio-mock__signal" />

    {/* Construction marks */}
    <path d="M22 12V2M12 24H2M878 12V2M888 24H898M22 496V506M12 484H2M878 496V506M888 484H898" className="studio-mock__crop" />
    <text x="32" y="510" className="studio-mock__svg-label">STUDIO PLATE / CONCEPT 01</text>
    <text x="688" y="510" className="studio-mock__svg-label">FRONT ELEVATION / NOT TO SCALE</text>
  </svg>
);

const AboutStudio: React.FC = () => {
  const [activePointId, setActivePointId] = useState<StudioPointId>('monitor');
  const [isAfterHours, setIsAfterHours] = useState(false);
  const activePoint = STUDIO_POINTS.find((point) => point.id === activePointId) ?? STUDIO_POINTS[0];

  return (
    <section className="studio-mock" aria-labelledby="studio-mock-heading">
      <div className="studio-mock__intro">
        <div>
          <p className="studio-mock__eyebrow">[ Concept mockup / where it happens ]</p>
          <h1 id="studio-mock-heading" className="studio-mock__heading">The room behind the work.</h1>
        </div>
        <div className="studio-mock__intro-copy">
          <p>
            A dedicated studio for focused design, close-to-code making, and the systems that help
            the work survive after launch.
          </p>
          <p className="studio-mock__intro-note">
            The finished version would arrive through the accelerated walk, hold on the final
            frame, then draw this room into place.
          </p>
        </div>
      </div>

      <ol className="studio-mock__storyboard" aria-label="Planned transition into the studio">
        <li><span>01</span><strong>Upstairs</strong><small>Begin in real footage</small></li>
        <li><span>02</span><strong>Speed ramp</strong><small>Move through the house</small></li>
        <li><span>03</span><strong>Final hold</strong><small>Lock the office frame</small></li>
        <li><span>04</span><strong>Vector pass</strong><small>Draw the system over reality</small></li>
      </ol>

      <div className={`studio-mock__workspace${isAfterHours ? ' is-after-hours' : ''}`}>
        <div className="studio-mock__scene">
          <div className="studio-mock__scene-meta">
            <span>Dedicated home studio</span>
            <span>South Bend, Indiana</span>
          </div>
          <div className="studio-mock__drawing-wrap">
            <StudioDrawing />
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
