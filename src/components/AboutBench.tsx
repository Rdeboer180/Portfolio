import React from 'react';

/**
 * AboutBench — the person, by their objects. Giant Ant's plain-specific
 * humanity translated from a team to an individual: one drawn, top-down bench,
 * four objects, four true sentences in the site's own hand.
 *
 * The rule that keeps this from being clip art: every object must carry an
 * honest one-liner or be cut. All four are grounded in facts the site already
 * states publicly — the systems are built and shipped from this desk, the
 * process playground opens on a sketch, PlayDraft and LoopStack are live on
 * TestFlight, and LoopStack's case study says whose glucose data it runs on.
 * (No coffee cup. Every bench has one; it has nothing true to say.)
 *
 * Deliberately static — no reveal, no hover, no motion. On a page where
 * everything else animates in, the one still thing reads as the most personal.
 * Annotations are real SVG text, and the figure carries a full description.
 */
const AboutBench: React.FC = () => (
  <section className="about-bench" aria-labelledby="about-bench-heading">
    <p className="about-bench__label">[ The Bench ]</p>
    <h2 id="about-bench-heading" className="about-bench__heading">
      All of it ships from one desk
    </h2>
    <figure className="about-bench__figure">
      <svg
        viewBox="0 0 960 400"
        role="img"
        aria-label="Top-down drawing of a work bench holding four objects: a laptop, annotated 'where the systems get built'; an iPad and pencil, annotated 'sketch first, always'; an iPhone, annotated 'PlayDraft and LoopStack ship from here'; and a glucose sensor, annotated 'why LoopStack exists'."
        focusable="false"
      >
        {/* the bench */}
        <rect x="80" y="96" width="800" height="230" rx="10" className="ab-mist" />
        <rect x="80" y="96" width="800" height="230" rx="10" className="ab-hair" />

        {/* laptop — base, keyboard field, trackpad */}
        <rect x="140" y="140" width="210" height="146" rx="8" className="ab-ink" />
        <rect x="156" y="156" width="178" height="66" rx="3" className="ab-steel" />
        <line x1="164" y1="176" x2="326" y2="176" className="ab-steel" />
        <line x1="164" y1="192" x2="326" y2="192" className="ab-steel" />
        <line x1="164" y1="208" x2="310" y2="208" className="ab-steel" />
        <rect x="216" y="236" width="60" height="36" rx="3" className="ab-steel" />

        {/* iPad + pencil — a sketch already on the screen */}
        <g transform="rotate(-4 480 210)">
          <rect x="420" y="140" width="120" height="150" rx="8" className="ab-ink" />
          <path d="M 440 250 C 452 216, 468 238, 480 202 S 504 226, 516 190" className="ab-steel" />
        </g>
        <line x1="560" y1="160" x2="588" y2="242" className="ab-pencil" />

        {/* iPhone — TestFlight-abstract screen */}
        <rect x="640" y="140" width="82" height="152" rx="12" className="ab-ink" />
        <rect x="650" y="152" width="62" height="128" rx="6" className="ab-mist" />
        <circle cx="662" cy="170" r="5" className="ab-orange" />
        <rect x="674" y="166" width="30" height="3" className="ab-steel-fill" />
        <rect x="656" y="188" width="50" height="3" className="ab-steel-fill" />
        <rect x="656" y="200" width="38" height="3" className="ab-steel-fill" />
        <rect x="656" y="256" width="42" height="12" rx="4" className="ab-orange" />

        {/* glucose sensor */}
        <circle cx="800" cy="210" r="24" className="ab-sensor" />
        <circle cx="800" cy="210" r="8" className="ab-sensor-core" />

        {/* annotations — the hand, telling the truth */}
        <g className="about-bench__note">
          <text x="120" y="76" className="ab-caveat">where the systems get built</text>
          <path d="M 216 84 L 236 118" className="ab-leader" />
        </g>
        <g className="about-bench__note">
          <text x="392" y="356" className="ab-caveat">sketch first, always</text>
          <path d="M 462 340 L 476 306" className="ab-leader" />
        </g>
        <g className="about-bench__note">
          <text x="590" y="76" className="ab-caveat">PlayDraft and LoopStack ship from here</text>
          <path d="M 684 84 L 682 132" className="ab-leader" />
        </g>
        <g className="about-bench__note">
          <text x="742" y="356" className="ab-caveat">why LoopStack exists</text>
          <path d="M 800 340 L 800 242" className="ab-leader" />
        </g>
      </svg>
      <figcaption className="about-bench__caption">
        Drawn to a rule: if an object couldn&rsquo;t carry a true one-liner, it didn&rsquo;t
        make the bench.
      </figcaption>
    </figure>
  </section>
);

export default AboutBench;
