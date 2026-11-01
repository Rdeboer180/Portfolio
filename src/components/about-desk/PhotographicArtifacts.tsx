// Photographic materials are cached as transparent WebP; SVG keeps the precise
// physical bounds and the iPod's interactive surface. The host casts one shared
// desk shadow, so these assets do not bring a second baked-in cast shadow.
import React, { useId } from 'react';
import { DRAFTS } from './deskDrafts';

type ArtifactSize = { width: number; height: number };
const artifactUrl = (file: string) => `${process.env.PUBLIC_URL}/images/desk/artifacts/${file}`;

export const PokemonRedCart: React.FC<ArtifactSize> = ({ width, height }) => (
  <svg className="s" viewBox="0 0 181 206" width={width} height={height} style={{ width, height }} aria-hidden="true" focusable="false">
    <image href={artifactUrl('pokemon-red-desk.webp')} width="181" height="206" preserveAspectRatio="xMidYMid meet" />
  </svg>
);

export const GraysAlmanac: React.FC<ArtifactSize> = ({ width, height }) => (
  <svg className="s" viewBox="0 0 483 705" width={width} height={height} style={{ width, height }} aria-hidden="true" focusable="false">
    <image href={artifactUrl('grays-almanac-desk.webp')} width="483" height="705" />
  </svg>
);

// 50.8 × 91.4 mm at the desk's 3.175 px/mm. The screen briefly catches a
// backlight on shuffle; the original mini has no separate green status LED.
// The screen shows the song that is playing as the 2004 mini drew its Now
// Playing screen: a grey LCD, the title bar (play mark, Now Playing, battery)
// over a rule, the track count, the song in bold, the artist, and the
// outlined progress bar filling under them.
type IpodSong = { title: string; artist: string; n: number; of: number };
// wherever the iPod is drawn, it is playing: Come Together, my 1.01, unless a press has moved it on
const FIRST = DRAFTS.songs.picks[0];
const DEFAULT_SONG: IpodSong = { title: FIRST?.title ?? '', artist: FIRST?.sub ?? '', n: 1, of: DRAFTS.songs.picks.length };

export const IpodMini: React.FC<ArtifactSize & { song?: IpodSong; onEnd?: () => void }> = ({ width, height, song = DEFAULT_SONG, onEnd }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="s" viewBox="0 0 161 290" width={width} height={height} style={{ width, height }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-backlight`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f3f8dc" stopOpacity=".18" />
          <stop offset="1" stopColor="#e6f0d5" stopOpacity=".07" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".08" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <image href={artifactUrl('ipod-mini-desk.webp')} width="161" height="290" preserveAspectRatio="xMidYMid meet" />
      {song.title && (
        <g className="ipod-screen" key={song.n}>
          <clipPath id={`${id}-lcd`}><rect x="29" y="21" width="104" height="80" rx="2.5" /></clipPath>
          <g clipPath={`url(#${id}-lcd)`}>
            <rect x="29" y="21" width="104" height="80" fill="#b9c3c4" />
            <rect x="29" y="21" width="104" height="80" fill="url(#ipod-lcd-shade)" />
            <defs>
              <linearGradient id="ipod-lcd-shade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#5d6a70" stopOpacity=".12" /></linearGradient>
            </defs>
            {/* the title bar: play, Now Playing, battery, and its rule */}
            <path d="M34 26.2 L37.4 28.2 L34 30.2 Z" fill="#2b3134" />
            <text x="81" y="30" textAnchor="middle" className="ipod-screen__bar">Now Playing</text>
            <rect x="119" y="26.2" width="8.6" height="4.2" rx=".6" fill="none" stroke="#2b3134" strokeWidth=".7" />
            <rect x="120" y="27.1" width="5.4" height="2.4" fill="#2b3134" />
            <rect x="127.7" y="27.5" width=".9" height="1.6" fill="#2b3134" />
            <path d="M31 33 H131" stroke="#2b3134" strokeWidth=".6" />
            <text x="33" y="41" className="ipod-screen__count">{song.n} of {song.of}</text>
            <text x="81" y="56" textAnchor="middle" className="ipod-screen__title">{song.title}</text>
            <text x="81" y="66" textAnchor="middle" className="ipod-screen__artist">{song.artist}</text>
            {/* the progress bar: outlined, filling from the left; when it fills, the next song plays */}
            <rect x="36" y="80" width="90" height="5.4" rx="1" fill="#c8d0d1" stroke="#2b3134" strokeWidth=".7" />
            <rect className="ipod-screen__fill" x="36.6" y="80.6" width="88.8" height="4.2" fill="#2b3134" onAnimationEnd={onEnd} />
          </g>
        </g>
      )}
      <rect data-part="ipod-glow" x="28" y="20" width="106" height="82" rx="3" fill={`url(#${id}-backlight)`} opacity="0" />
      <rect data-part="ipod-led" x="28" y="20" width="106" height="82" rx="3" fill={`url(#${id}-glass)`} opacity="0" />
      <circle data-part="ipod-press" data-center-x="80.7" data-center-y="198" data-press-radius="20" data-ring-radius="60" cx="80.7" cy="198" r="20" fill="#2c3524" opacity="0" />
    </svg>
  );
};
