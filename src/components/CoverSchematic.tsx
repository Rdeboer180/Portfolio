import React from 'react';

/**
 * CoverSchematic — the locked professional stream, drawn instead of blurred.
 *
 * The blur removed information without substituting any: a visitor learned a
 * project's name and that they couldn't see it. Each plate here is a schematic
 * of the project's system in the site's own hand — ink and steel linework on
 * paper, Signal Orange on the one path that matters — so a locked card answers
 * "what is this and why does it matter" without unlocking anything.
 *
 * The confidentiality rule every plate must pass: each drawing depicts the
 * SHAPE of the system, never the system. Every line could be produced by
 * someone who has only read the public (locked-state) case-study page. No UI is
 * traced, no internal names appear, no numbers beyond what the public summary
 * already states. The seasonal plate additionally holds that study's client
 * anonymization.
 *
 * Callout groups (`cover-schematic__callout`) draw in when the card is hovered
 * or focused — the locked card's hover reward is more specificity, not a tease.
 * Interaction and resolve behavior live in _cover-schematic.scss; the resolve
 * (plate fading to real media on unlock) rides the playground's existing
 * card-by-card delay.
 *
 * Plates are aria-hidden: the card's real text (title, hook, metric, and the
 * playground's "Password protected" line) carries the accessible story.
 */

const Handles: React.FC = () => (
  <>
    <rect className="cover-schematic__handle" x="6" y="6" width="5" height="5" />
    <rect className="cover-schematic__handle" x="309" y="6" width="5" height="5" />
    <rect className="cover-schematic__handle" x="6" y="189" width="5" height="5" />
    <rect className="cover-schematic__handle" x="309" y="189" width="5" height="5" />
  </>
);

/** Wheel fitment geometry — the one source of truth the system carries. */
const WheelrackPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 02</text>
    <circle cx="160" cy="104" r="58" className="cs-ink" />
    <circle cx="160" cy="104" r="42" className="cs-steel" />
    <circle cx="160" cy="104" r="20" className="cs-dash" />
    <circle cx="160" cy="73" r="4" className="cs-ink" />
    <circle cx="189.5" cy="94.4" r="4" className="cs-ink" />
    <circle cx="178.2" cy="129.1" r="4" className="cs-keep" />
    <circle cx="141.8" cy="129.1" r="4" className="cs-ink" />
    <circle cx="130.5" cy="94.4" r="4" className="cs-ink" />
    <line x1="160" y1="104" x2="178.2" y2="129.1" className="cs-keep" />
    <g className="cover-schematic__callout">
      <line x1="102" y1="176" x2="218" y2="176" className="cs-steel" />
      <line x1="102" y1="172" x2="102" y2="180" className="cs-steel" />
      <line x1="218" y1="172" x2="218" y2="180" className="cs-steel" />
      <text x="160" y="190" textAnchor="middle" className="cs-mono">fitment logic</text>
    </g>
    <g className="cover-schematic__callout">
      <line x1="240" y1="46" x2="240" y2="162" className="cs-steel" />
      <line x1="236" y1="46" x2="244" y2="46" className="cs-steel" />
      <line x1="236" y1="162" x2="244" y2="162" className="cs-steel" />
      <text x="248" y="107" className="cs-mono">tokens</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 66 44 L 96 62" className="cs-keep-thin" />
      <text x="14" y="40" className="cs-caveat">the system, shown</text>
    </g>
  </>
);

/** The category decision tree — three decisions instead of three hundred tires. */
const TireCategoriesPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 06</text>
    <rect x="120" y="30" width="80" height="22" className="cs-ink" />
    <text x="160" y="44" textAnchor="middle" className="cs-mono">every tire</text>
    <line x1="160" y1="52" x2="65" y2="82" className="cs-steel" />
    <line x1="160" y1="52" x2="160" y2="82" className="cs-keep" />
    <line x1="160" y1="52" x2="255" y2="82" className="cs-steel" />
    <rect x="28" y="82" width="74" height="20" className="cs-steel" />
    <rect x="114" y="82" width="92" height="20" className="cs-keep" />
    <rect x="218" y="82" width="74" height="20" className="cs-steel" />
    <text x="160" y="95" textAnchor="middle" className="cs-mono cs-mono--accent">how you drive</text>
    <line x1="160" y1="102" x2="112" y2="132" className="cs-steel" />
    <line x1="160" y1="102" x2="213" y2="132" className="cs-keep" />
    <rect x="75" y="132" width="74" height="20" className="cs-steel" />
    <rect x="170" y="132" width="86" height="20" className="cs-tint" />
    <rect x="170" y="132" width="86" height="20" className="cs-keep" />
    <text x="213" y="145" textAnchor="middle" className="cs-mono cs-mono--accent">your tire</text>
    <g className="cover-schematic__callout">
      <line x1="16" y1="34" x2="16" y2="152" className="cs-steel" />
      <line x1="12" y1="34" x2="20" y2="34" className="cs-steel" />
      <line x1="12" y1="152" x2="20" y2="152" className="cs-steel" />
      <text x="14" y="172" className="cs-mono">3 decisions, not 300 tires</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 262 168 L 234 154" className="cs-keep-thin" />
      <text x="200" y="184" className="cs-caveat">the guided path</text>
    </g>
  </>
);

/** One storefront layout, seasonal variants by authoring. Client anonymized. */
const SeasonalPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 07</text>
    <rect x="46" y="34" width="228" height="126" className="cs-ink" />
    <rect x="46" y="34" width="228" height="16" className="cs-mist" />
    <rect x="60" y="60" width="130" height="42" className="cs-tint" />
    <rect x="60" y="60" width="130" height="42" className="cs-keep" />
    <text x="125" y="85" textAnchor="middle" className="cs-mono cs-mono--accent">seasonal slot ❄</text>
    <rect x="202" y="60" width="58" height="42" className="cs-steel" />
    <rect x="60" y="112" width="60" height="34" className="cs-steel" />
    <rect x="132" y="112" width="58" height="34" className="cs-steel" />
    <rect x="202" y="112" width="58" height="34" className="cs-dash" />
    <g className="cover-schematic__callout">
      <line x1="60" y1="172" x2="190" y2="172" className="cs-steel" />
      <line x1="60" y1="168" x2="60" y2="176" className="cs-steel" />
      <line x1="190" y1="168" x2="190" y2="176" className="cs-steel" />
      <text x="60" y="187" className="cs-mono">one layout · per-season variants</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 262 178 L 240 152" className="cs-keep-thin" />
      <text x="196" y="194" className="cs-caveat">authored, not rebuilt</text>
    </g>
  </>
);

/** Three page skeletons, one core component — reused, not rebuilt. */
const AemPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 03</text>
    <rect x="58" y="64" width="76" height="96" className="cs-dash" />
    <rect x="44" y="50" width="76" height="96" className="cs-steel" />
    <rect x="30" y="36" width="76" height="96" className="cs-ink" />
    <rect x="38" y="44" width="60" height="12" className="cs-steel" />
    <rect x="38" y="62" width="60" height="18" className="cs-keep" />
    <rect x="38" y="86" width="60" height="18" className="cs-steel" />
    <rect x="38" y="110" width="60" height="14" className="cs-dash" />
    <line x1="98" y1="71" x2="216" y2="94" className="cs-steel" />
    <line x1="134" y1="98" x2="216" y2="102" className="cs-steel" />
    <line x1="148" y1="126" x2="216" y2="110" className="cs-steel" />
    <rect x="216" y="82" width="84" height="40" className="cs-tint" />
    <rect x="216" y="82" width="84" height="40" className="cs-keep" />
    <text x="258" y="106" textAnchor="middle" className="cs-mono cs-mono--accent">core</text>
    <g className="cover-schematic__callout">
      <line x1="216" y1="138" x2="300" y2="138" className="cs-steel" />
      <line x1="216" y1="134" x2="216" y2="142" className="cs-steel" />
      <line x1="300" y1="134" x2="300" y2="142" className="cs-steel" />
      <text x="258" y="153" textAnchor="middle" className="cs-mono">10+ live components</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 130 176 L 108 152" className="cs-keep-thin" />
      <text x="60" y="192" className="cs-caveat">reused, not rebuilt</text>
    </g>
  </>
);

/** A plugin panel automating the repetitive part of production. */
const DesignEnablementPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 05</text>
    <rect x="36" y="38" width="176" height="128" className="cs-ink" />
    <rect x="36" y="38" width="176" height="16" className="cs-mist" />
    <circle cx="46" cy="46" r="2.5" className="cs-steel-fill" />
    <circle cx="55" cy="46" r="2.5" className="cs-steel-fill" />
    <rect x="36" y="54" width="30" height="112" className="cs-steel" />
    <rect x="43" y="64" width="16" height="12" className="cs-steel" />
    <rect x="43" y="82" width="16" height="12" className="cs-keep" />
    <rect x="43" y="100" width="16" height="12" className="cs-steel" />
    <rect x="88" y="72" width="96" height="66" className="cs-dash" />
    <rect x="104" y="86" width="64" height="38" className="cs-steel" />
    <line x1="212" y1="105" x2="240" y2="105" className="cs-keep" />
    <path d="M 234 100 L 241 105 L 234 110" className="cs-keep" />
    <rect x="260" y="66" width="44" height="30" className="cs-dash" />
    <rect x="252" y="78" width="44" height="30" className="cs-steel" />
    <rect x="244" y="90" width="44" height="30" className="cs-ink" />
    <g className="cover-schematic__callout">
      <line x1="244" y1="132" x2="288" y2="132" className="cs-steel" />
      <line x1="244" y1="128" x2="244" y2="136" className="cs-steel" />
      <line x1="288" y1="128" x2="288" y2="136" className="cs-steel" />
      <text x="266" y="147" textAnchor="middle" className="cs-mono">3 tools</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 130 182 L 116 164" className="cs-keep-thin" />
      <text x="36" y="194" className="cs-caveat">the repetitive part, automated</text>
    </g>
  </>
);

/** One governed template, many launches. */
const LandingPagesPlate: React.FC = () => (
  <>
    <text x="160" y="22" textAnchor="middle" className="cs-mono">Plate 09</text>
    <rect x="40" y="38" width="88" height="122" className="cs-ink" />
    <rect x="48" y="46" width="72" height="12" className="cs-steel" />
    <rect x="48" y="64" width="72" height="30" className="cs-steel" />
    <rect x="48" y="100" width="34" height="20" className="cs-steel" />
    <rect x="86" y="100" width="34" height="20" className="cs-steel" />
    <rect x="48" y="126" width="44" height="14" className="cs-tint" />
    <rect x="48" y="126" width="44" height="14" className="cs-keep" />
    <line x1="128" y1="99" x2="168" y2="99" className="cs-keep" />
    <path d="M 162 94 L 169 99 L 162 104" className="cs-keep" />
    <rect x="204" y="34" width="82" height="104" className="cs-dash" />
    <rect x="190" y="48" width="82" height="104" className="cs-steel" />
    <rect x="176" y="62" width="82" height="104" className="cs-ink" />
    <rect x="184" y="70" width="66" height="10" className="cs-steel" />
    <rect x="184" y="86" width="66" height="24" className="cs-steel" />
    <rect x="184" y="116" width="30" height="16" className="cs-steel" />
    <rect x="218" y="116" width="32" height="16" className="cs-steel" />
    <rect x="184" y="138" width="40" height="12" className="cs-dash" />
    <g className="cover-schematic__callout">
      <line x1="176" y1="176" x2="286" y2="176" className="cs-steel" />
      <line x1="176" y1="172" x2="176" y2="180" className="cs-steel" />
      <line x1="286" y1="172" x2="286" y2="180" className="cs-steel" />
      <text x="231" y="191" textAnchor="middle" className="cs-mono">50+ shipped · ~1 month → 1–2 weeks</text>
    </g>
    <g className="cover-schematic__callout">
      <path d="M 96 178 L 84 164" className="cs-keep-thin" />
      <text x="30" y="192" className="cs-caveat">governed, then handed off</text>
    </g>
  </>
);

const PLATES: Record<string, React.FC> = {
  wheelrack: WheelrackPlate,
  'tire-categories': TireCategoriesPlate,
  'seasonal-content-system': SeasonalPlate,
  'aem-component-system': AemPlate,
  'design-enablement': DesignEnablementPlate,
  'landing-pages': LandingPagesPlate,
};

export const hasSchematic = (slug: string): boolean => slug in PLATES;

const CoverSchematic: React.FC<{ slug: string }> = ({ slug }) => {
  const Plate = PLATES[slug];
  if (!Plate) return null;
  return (
    <figure className="cover-schematic" aria-hidden="true">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" focusable="false">
        <Plate />
        <Handles />
      </svg>
    </figure>
  );
};

export default CoverSchematic;
