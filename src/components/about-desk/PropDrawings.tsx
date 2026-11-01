// Desk prop drawings. Photographic materials and interaction surfaces live
// in PhotographicArtifacts; the Atomic Purple console remains vector-built.
import React from 'react';

// ── a Game Boy Color, Atomic Purple ─────────────────────────────────────────
// 78 × 133.5 mm, face up, in the clear purple shell (after the public-domain
// Wikimedia photograph Nintendo-Game-Boy-Color-FL). The plastic is pale and
// see-through: the desk's wood shows through it, the shell runs deeper purple
// where it is thickest, at its rim, and what is inside shows softly under it:
// the screw posts, the rubber under the buttons, the little green board at the
// lower left, the brass speaker under its grille. The lens is black, the
// screen off; the light catches the upper left and runs off the lens glass.
export const GameBoyColor: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const body = 'M14 0H234A14 14 0 0 1 248 14V398A26 26 0 0 1 222 424H26A26 26 0 0 1 0 398V14A14 14 0 0 1 14 0Z';
  const grille: [number, number][] = [[0, 0]];
  [9, 17].forEach((r, ring) => { const n = ring ? 14 : 7; for (let i = 0; i < n; i += 1) grille.push([r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)]); });
  const COLOR = [['C', '#e8317e'], ['O', '#7a4fc9'], ['L', '#2fae5f'], ['O', '#f2b51c'], ['R', '#2f7fd6']];
  return (
    <svg className="s" viewBox="0 0 248 424" style={{ width, height }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gbc-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e4dbf4" /><stop offset=".5" stopColor="#cbbde8" /><stop offset="1" stopColor="#b3a0dc" /></linearGradient>
        <linearGradient id="gbc-bevel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset=".4" stopColor="#fff" stopOpacity="0" /><stop offset=".6" stopColor="#6a4ca8" stopOpacity="0" /><stop offset="1" stopColor="#5a3d98" stopOpacity=".7" /></linearGradient>
        <radialGradient id="gbc-sheen" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <linearGradient id="gbc-lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a292f" /><stop offset="1" stopColor="#18171c" /></linearGradient>
        <linearGradient id="gbc-lcd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b4b8ad" /><stop offset="1" stopColor="#8e9389" /></linearGradient>
        <linearGradient id="gbc-key" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a5763" /><stop offset=".55" stopColor="#38353f" /><stop offset="1" stopColor="#24222a" /></linearGradient>
        <radialGradient id="gbc-btn" cx=".36" cy=".32" r=".78"><stop offset="0" stopColor="#6b6874" /><stop offset=".5" stopColor="#3d3a44" /><stop offset="1" stopColor="#25232b" /></radialGradient>
        <radialGradient id="gbc-cone" cx=".45" cy=".42" r=".55"><stop offset="0" stopColor="#c87a3a" /><stop offset=".22" stopColor="#e9cf96" /><stop offset=".6" stopColor="#c9a868" /><stop offset="1" stopColor="#8f7448" /></radialGradient>
        <filter id="gbc-under" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".7" /></filter>
        <clipPath id="gbc-clip"><path d={body} /></clipPath>
      </defs>
      {/* the shell: see-through, so the desk shows */}
      <path d={body} fill="url(#gbc-shell)" opacity=".48" />
      {/* inside, seen through the plastic */}
      <g clipPath="url(#gbc-clip)" filter="url(#gbc-under)">
        <rect x="12" y="190" width="224" height="214" rx="10" fill="#6f6a8f" opacity=".07" />
        <path d="M114 188h20v26h-20z" fill="#c9893f" opacity=".1" />
        <circle cx="64" cy="290" r="36" fill="#7d68b4" opacity=".26" />
        {[[160, 296], [201, 270]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="21" fill="#7d68b4" opacity=".24" />)}
        {[[98, 370], [140, 370]].map(([x, y]) => <rect key={x} x={x - 19} y={y - 8} width="38" height="16" rx="8" fill="#7d68b4" opacity=".2" transform={`rotate(-25 ${x} ${y})`} />)}
        {[[24, 206], [224, 206], [124, 236], [24, 396], [224, 396], [104, 338]].map(([x, y]) => (
          <g key={`${x}${y}`} opacity=".6"><circle cx={x} cy={y} r="7.5" fill="#9a84cf" opacity=".75" /><circle cx={x} cy={y} r="2.6" fill="#6f58a8" /></g>
        ))}
        {/* the small green board at the lower left: its chips with their legs and part numbers, the parts between them */}
        <g transform="translate(22 318)" opacity=".72">
          <rect width="48" height="56" rx="3" fill="#3f6b4c" opacity=".78" />
          <path d="M6 8h20M6 16h30M10 30h28M6 44h18M3 4v48M45 12v38M17 28v-8h7" stroke="#7fae7c" strokeWidth=".7" fill="none" opacity=".75" />
          <g fill="#b9b39a">
            {[0, 1, 2, 3].map((i) => <rect key={`a${i}`} x={29.2 + i * 2.8} y="4.6" width="1" height="1.6" />)}
            {[0, 1, 2, 3].map((i) => <rect key={`b${i}`} x={29.2 + i * 2.8} y="13.8" width="1" height="1.6" />)}
            {[0, 1, 2, 3, 4].map((i) => <rect key={`c${i}`} x={25.4 + i * 3.2} y="34.6" width="1" height="1.6" />)}
            {[0, 1, 2, 3, 4].map((i) => <rect key={`d${i}`} x={25.4 + i * 3.2} y="45.8" width="1" height="1.6" />)}
            {[0, 1].map((i) => <rect key={`e${i}`} x="6.6" y={23 + i * 3} width="1.6" height=".9" />)}
          </g>
          <rect x="28" y="6" width="12" height="8" rx="1" fill="#1d2721" /><rect x="8" y="22" width="9" height="6" rx="1" fill="#1d2721" />
          <rect x="24" y="36" width="16" height="10" rx="1" fill="#1d2721" />
          <circle cx="26" cy="38" r=".7" fill="#4a5a4e" />
          <text x="32" y="42.6" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="2.6" fill="#7d8a80">CPU CGB</text>
          <text x="34" y="11.2" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2.2" fill="#6e7a70">RAM</text>
          <text x="12.5" y="26.2" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="2" fill="#6e7a70">AMP</text>
          {/* a crystal, a few capacitors and resistors */}
          <rect x="6" y="32" width="11" height="4.4" rx="2.2" fill="#a9acb0" /><rect x="7" y="32.8" width="9" height="1" rx=".5" fill="#fff" opacity=".45" />
          {[[22, 22], [26, 22], [42, 30]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="2.4" height="1.4" fill="#a8835a" />)}
          {[[8, 12], [8, 40], [42, 40]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="3" height="1.3" fill="#2a2a2a" stroke="#c9c2a0" strokeWidth=".3" />)}
          <circle cx="40" cy="22" r="2.4" fill="#26303a" stroke="#8f9aa6" strokeWidth=".4" /><path d="M38.6 22h2.8" stroke="#8f9aa6" strokeWidth=".4" />
          {[[6, 50], [12, 50], [18, 50], [36, 24], [42, 24]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#d2c79a" />)}
        </g>
        {/* the ribbon from the board up to the screen */}
        <path d="M60 318V250h8V214" fill="none" stroke="#c9893f" strokeWidth="5" opacity=".1" />
        {/* the speaker: a brass cone under the grille */}
        <circle cx="196" cy="378" r="25" fill="url(#gbc-cone)" opacity=".6" />
        <circle cx="196" cy="378" r="25" fill="none" stroke="#6d5634" strokeWidth="1.2" opacity=".42" />
        <circle cx="196" cy="378" r="12" fill="none" stroke="#a78756" strokeWidth=".8" opacity=".7" />
      </g>
      {/* the plastic over it all: the rim deeper where it is thickest, the wall's inner edge, the sheen */}
      <g clipPath="url(#gbc-clip)">
        <path d={body} fill="none" stroke="#8d72c8" strokeWidth="9" opacity=".55" />
        <path d={body} fill="none" stroke="url(#gbc-bevel)" strokeWidth="4" />
        <rect x="7.5" y="7.5" width="233" height="409" rx="19" fill="none" stroke="#a991d8" strokeWidth="1.2" opacity=".6" />
        <ellipse cx="66" cy="58" rx="112" ry="56" fill="url(#gbc-sheen)" transform="rotate(-32 66 58)" />
        <path d="M6 330V30A22 22 0 0 1 28 8H120" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      {/* the lens, the screen behind it (off), the power light, the name */}
      <rect x="18" y="20" width="212" height="168" rx="10" fill="url(#gbc-lens)" />
      <rect x="51" y="33" width="146" height="126" rx="3" fill="#0e0e11" />
      <rect x="53" y="35" width="142" height="122" rx="2" fill="url(#gbc-lcd)" />
      <rect x="53" y="35" width="142" height="122" rx="2" fill="#1b2a12" opacity=".08" />
      <circle cx="33" cy="80" r="3.2" fill="#3a1212" />
      <path d="M38.5 76.5a5 5 0 0 1 0 7M41.5 74.5a8 8 0 0 1 0 11M44.5 72.5a11 11 0 0 1 0 15" fill="none" stroke="#8a8994" strokeWidth=".9" />
      <text x="34" y="96" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="5.2" letterSpacing=".6" fill="#8a8994">POWER</text>
      <text x="124" y="177" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="13" letterSpacing="1.2">
        <tspan fill="#b9b9c3">GAME BOY </tspan>
        {COLOR.map(([ch, c], i) => <tspan key={i} fill={c}>{ch}</tspan>)}
      </text>
      <path d="M18 120L120 20H170L18 172Z" fill="#fff" opacity=".05" />
      <path d="M18 98L96 20H110L18 112Z" fill="#fff" opacity=".1" />
      {/* the maker's name moulded into the shell beside the D-pad */}
      <text x="150" y="232" textAnchor="middle" fontFamily="Inter, sans-serif" fontStyle="italic" fontWeight="800" fontSize="12" fill="#fff" opacity=".35" transform="rotate(-25 150 232)">Nintendo</text>
      <text x="150.8" y="232.8" textAnchor="middle" fontFamily="Inter, sans-serif" fontStyle="italic" fontWeight="800" fontSize="12" fill="#6e57a6" opacity=".35" transform="rotate(-25 150 232)">Nintendo</text>
      {/* the D-pad in its dish */}
      <circle cx="64" cy="290" r="37" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.2" />
      <circle cx="64" cy="290" r="38.5" fill="none" stroke="#7f68b8" strokeOpacity=".5" />
      <path d="M51 253h26v24h24v26H77v24H51v-24H27v-26h24z" fill="url(#gbc-key)" stroke="#1e1c23" strokeWidth="2" strokeLinejoin="round" />
      <path d="M53 256h22M30 280h20M80 280h18" stroke="#fff" strokeOpacity=".2" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="64" cy="290" r="6" fill="#141317" opacity=".5" />
      {/* B and A */}
      {[[160, 296, 'B'], [201, 270, 'A']].map(([x, y, l]) => (
        <g key={l as string}>
          <circle cx={x as number} cy={y as number} r="16" fill="url(#gbc-btn)" />
          <ellipse cx={(x as number) - 5} cy={(y as number) - 6} rx="6" ry="3.5" fill="#fff" opacity=".2" transform={`rotate(-30 ${(x as number) - 5} ${(y as number) - 6})`} />
          <text x={x as number} y={(y as number) + 4.5} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill="#55525e">{l}</text>
        </g>
      ))}
      {/* Select and Start */}
      {[98, 140].map((x) => (
        <g key={x} transform={`rotate(-25 ${x} 370)`}>
          <rect x={x - 17} y="364" width="34" height="13" rx="6.5" fill="none" stroke="#7f68b8" strokeOpacity=".6" />
          <rect x={x - 15} y="365.5" width="30" height="10" rx="5" fill="url(#gbc-key)" />
        </g>
      ))}
      {/* the grille over the speaker */}
      {grille.map(([x, y], i) => <circle key={i} cx={196 + x} cy={378 + y} r="2.4" fill="#4b3a6e" opacity=".55" />)}
    </svg>
  );
};

export { PokemonRedCart, GraysAlmanac, IpodMini } from './PhotographicArtifacts';
