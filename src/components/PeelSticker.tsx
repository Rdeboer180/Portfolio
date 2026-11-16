import React, { useId } from 'react';

/**
 * PeelSticker — the peeled-emblem sticker every outbound link ends on
 * (direction B, Ryan, 12 November 2026; first drawn for LinkedIn).
 * A 20×20 rounded-square emblem (rx 4.5 on a 24 grid) in foil, a white
 * die-cut and a steel kiss-cut outside it, its bottom-right corner peeled
 * with a release-paper flap. Two states are drawn, rest and lift; the
 * owning link crossfades them on hover / focus-visible. Decorative: the
 * link carries the name.
 *
 * `block` names the classes (`${block}__sticker`, `__rest`, `__lift`), so
 * each link family keeps its own CSS. `foil` is the rest gradient's stops
 * and `lift` the lifted one's, as [offset, colour] pairs. `mark` is drawn
 * in the emblem's clip, on the 24 grid.
 */
export type FoilStops = ReadonlyArray<readonly [number, string]>;

interface PeelStickerProps {
  block: string;
  foil: FoilStops;
  lift: FoilStops;
  mark: React.ReactNode;
}

const PeelSticker: React.FC<PeelStickerProps> = ({ block, foil, lift, mark }) => {
  const id = useId().replace(/:/g, '');
  const emblem = (grad: string, clip: string) => (
    <g clipPath={`url(#${id}${clip})`}>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="var(--sticker-die-cut)" stroke="var(--sticker-kiss-cut-steel)" strokeWidth="3.6" />
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill={`url(#${id}${grad})`} stroke="var(--sticker-die-cut)" strokeWidth="2.8" />
      {mark}
    </g>
  );
  const stops = (list: FoilStops) => list.map(([offset, colour]) => <stop key={offset} offset={offset} stopColor={colour} />);
  return (
    <svg
      className={`${block}__sticker`}
      viewBox="-3 -3 30 30"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">{stops(foil)}</linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">{stops(lift)}</linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--sticker-die-cut)" />
          <stop offset=".6" stopColor="var(--sticker-release-paper)" />
          <stop offset="1" stopColor="var(--sticker-kiss-cut)" />
        </linearGradient>
        <clipPath id={`${id}c`}><polygon points="-5,-5 29,-5 29,11 11,29 -5,29" /></clipPath>
        <clipPath id={`${id}l`}><polygon points="-5,-5 29,-5 29,7 7,29 -5,29" /></clipPath>
      </defs>
      <g className={`${block}__rest`}>
        {emblem('a', 'c')}
        <path d="M22.9 17.1L17.1 22.9L13.8 13.8Z" fill={`url(#${id}p)`} stroke="var(--sticker-kiss-cut)" strokeWidth=".3" />
      </g>
      <g className={`${block}__lift`}>
        {emblem('b', 'l')}
        <path d="M22.9 13.1L13.1 22.9L9.6 9.6Z" fill={`url(#${id}p)`} stroke="var(--sticker-kiss-cut)" strokeWidth=".3" />
      </g>
    </svg>
  );
};

export default PeelSticker;
