import React from 'react';
import PeelSticker, { FoilStops } from './PeelSticker';

/**
 * OutboundLink — the GitHub and download links end on a small peeled-emblem
 * sticker, the same recipe as LinkedInLink's (16 November 2026), so a reader
 * knows before the click where the link goes. The sticker replaces the ↗.
 * A download sticker leads its text, inline on the first line (Ryan, 16
 * November): the action reads first. The GitHub sticker trails, like LinkedIn.
 * GitHub: the mark in white on graphite foil. Download: a white arrow into a
 * tray on the brand-orange enamel. Styles: styles/components/_outbound-link.scss;
 * colours are tokens (--github-*, --download-*, --sticker-*).
 */
export type OutboundKind = 'github' | 'download';

/** Which sticker a URL earns, or null for links that keep their ↗. */
export const outboundKind = (url: string): OutboundKind | null => {
  if (/\/releases(\/|$)|\.(dmg|zip|pkg)$/i.test(url)) return 'download';
  if (/^https:\/\/github\.com\//i.test(url)) return 'github';
  return null;
};

// GitHub's mark (Octicons mark-github, 16 grid) set 12 units wide on the 24 grid.
const GITHUB_MARK = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';
// An arrow down into a tray, drawn as a white line.
const DOWNLOAD_MARK = 'M12 6.6v8.2M8.7 11.6L12 14.9l3.3-3.3M7.4 17.6h9.2';

const STICKERS: Record<OutboundKind, { foil: FoilStops; lift: FoilStops; mark: React.ReactNode }> = {
  github: {
    foil: [[0, 'var(--github-deep)'], [0.3, 'var(--github)'], [0.42, 'var(--github-light)'], [0.47, 'var(--github-glint)'], [0.53, 'var(--github-light)'], [0.72, 'var(--github)'], [1, 'var(--github-deep)']],
    lift: [[0, 'var(--github)'], [0.34, 'var(--github-light)'], [0.5, 'var(--github-glint)'], [0.6, 'var(--github-light)'], [1, 'var(--github-deep)']],
    mark: <path d={GITHUB_MARK} transform="translate(6 6) scale(.75)" fill="var(--sticker-die-cut)" fillRule="evenodd" />,
  },
  download: {
    foil: [[0, 'var(--download-deep)'], [0.3, 'var(--download)'], [0.42, 'var(--download-light)'], [0.47, 'var(--download-glint)'], [0.53, 'var(--download-light)'], [0.72, 'var(--download)'], [1, 'var(--download-deep)']],
    lift: [[0, 'var(--download)'], [0.34, 'var(--download-light)'], [0.5, 'var(--download-glint)'], [0.6, 'var(--download-light)'], [1, 'var(--download-deep)']],
    mark: <path d={DOWNLOAD_MARK} stroke="var(--sticker-die-cut)" strokeWidth="2.6" />,
  },
};

interface OutboundLinkProps {
  href: string;
  kind: OutboundKind;
  label: React.ReactNode;
  className?: string;
}

const OutboundLink: React.FC<OutboundLinkProps> = ({ href, kind, label, className }) => {
  const sticker = STICKERS[kind];
  const mark = <PeelSticker block="outbound-link" foil={sticker.foil} lift={sticker.lift} mark={sticker.mark} />;
  const leads = kind === 'download';
  return (
    <a
      href={href}
      className={['outbound-link', `outbound-link--${kind}`, className].filter(Boolean).join(' ')}
      target="_blank"
      rel="noopener noreferrer"
    >
      {leads && mark}
      <span className="outbound-link__label">{label}</span>
      {!leads && mark}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
};

export default OutboundLink;
