import React, { useId } from 'react';
import { SITE } from '../data/site';

/**
 * Canonical LinkedIn profile URL — every LinkedIn link on the site points at
 * the profile root (or the recommendations list). Activity-feed / post deep
 * links are auth-walled for logged-out visitors, so they are never used.
 * Sourced from data/site.ts.
 */
export const LINKEDIN_PROFILE_URL = SITE.linkedinUrl;

const HREF = {
  profile: SITE.linkedinUrl,
  recommendations: SITE.linkedinRecommendationsUrl,
} as const;

interface LinkedInLinkProps {
  /** Visible link text. */
  label: string;
  /**
   * Placement identifier, emitted as data-li-surface. Inert until an
   * analytics stack exists — pre-wires the linkedin_click event taxonomy
   * (testimonial_source | case_study_close | about_bridge | faq_build).
   */
  surface: string;
  /** Which LinkedIn page: the profile (default) or the recommendations list. */
  to?: keyof typeof HREF;
  /**
   * 'link' (default): a caption text link that ends on the LinkedIn sticker
   * (the sticker is the off-site mark). 'inline': the same inside a
   * sentence, taking the sentence's type. 'button': the secondary sticker button with the
   * LinkedIn sticker on it (contact rows, beside Email).
   */
  variant?: 'link' | 'inline' | 'button';
  /** Optional extra class for surface-specific overrides. */
  className?: string;
}

// The "in" on the 24 grid, drawn as a white line on the emblem.
const IN_MARK = 'M7.5 7.4v.01M7.5 11v6.5M11.6 17.5v-6.5M11.6 13.6c0-1.8 1.3-2.6 2.7-2.6s2.7.8 2.7 2.6v3.9';

/**
 * LinkedInSticker — direction B, "Peeled emblem" (Ryan, 12 November 2026).
 * LinkedIn's rounded-square emblem (20×20, rx 4.5 on a 24 grid) in blue foil
 * with the "in" knocked out white; a white die-cut and a steel kiss-cut
 * outside it, as on HoloSticker. Its bottom-right corner is peeled: the
 * emblem is clipped along a diagonal and a release-paper flap lies folded on
 * it. Two states are drawn, rest and lift; hover / focus-visible on the link
 * crossfades to the lift (the corner peels further, the foil's light moves)
 * and the sticker rises 2px and turns 4deg. Colours are tokens
 * (--linkedin-*, --sticker-*). Decorative: the link carries the name.
 */
const LinkedInSticker: React.FC<{ ink: number }> = ({ ink }) => {
  const id = useId().replace(/:/g, '');
  const emblem = (foil: string, clip: string) => (
    <g clipPath={`url(#${id}${clip})`}>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="var(--sticker-die-cut)" stroke="var(--sticker-kiss-cut-steel)" strokeWidth="3.6" />
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill={`url(#${id}${foil})`} stroke="var(--sticker-die-cut)" strokeWidth="2.8" />
      <path d={IN_MARK} stroke="var(--sticker-die-cut)" strokeWidth={ink} />
    </g>
  );
  return (
    <svg
      className="linkedin-link__sticker"
      viewBox="-3 -3 30 30"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--linkedin-blue-deep)" />
          <stop offset=".26" stopColor="var(--linkedin-blue)" />
          <stop offset=".38" stopColor="var(--linkedin-blue-light)" />
          <stop offset=".44" stopColor="var(--linkedin-blue-glint)" />
          <stop offset=".5" stopColor="var(--linkedin-blue-light)" />
          <stop offset=".7" stopColor="var(--linkedin-blue)" />
          <stop offset="1" stopColor="var(--linkedin-blue-deep)" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--linkedin-blue)" />
          <stop offset=".32" stopColor="var(--linkedin-blue-light)" />
          <stop offset=".5" stopColor="var(--sticker-die-cut)" />
          <stop offset=".58" stopColor="var(--linkedin-blue-light)" />
          <stop offset="1" stopColor="var(--linkedin-blue-deep)" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--sticker-die-cut)" />
          <stop offset=".6" stopColor="var(--sticker-release-paper)" />
          <stop offset="1" stopColor="var(--sticker-kiss-cut)" />
        </linearGradient>
        <clipPath id={`${id}c`}><polygon points="-5,-5 29,-5 29,11 11,29 -5,29" /></clipPath>
        <clipPath id={`${id}l`}><polygon points="-5,-5 29,-5 29,7 7,29 -5,29" /></clipPath>
      </defs>
      <g className="linkedin-link__rest">
        {emblem('a', 'c')}
        <path d="M22.9 17.1L17.1 22.9L13.8 13.8Z" fill={`url(#${id}p)`} stroke="var(--sticker-kiss-cut)" strokeWidth=".3" />
      </g>
      <g className="linkedin-link__lift">
        {emblem('b', 'l')}
        <path d="M22.9 13.1L13.1 22.9L9.6 9.6Z" fill={`url(#${id}p)`} stroke="var(--sticker-kiss-cut)" strokeWidth=".3" />
      </g>
    </svg>
  );
};

/**
 * LinkedInLink — every outbound LinkedIn link on the site. The peeled emblem
 * sticker (styles/components/_linkedin-link.scss, tokens --linkedin-* and
 * --sticker-*) tells a reader before they click that the link leaves
 * for LinkedIn; the accessible name says the same, and that it opens a new tab.
 */
const LinkedInLink: React.FC<LinkedInLinkProps> = ({ label, surface, to = 'profile', variant = 'link', className }) => {
  const classes = ['linkedin-link', `linkedin-link--${variant}`];
  if (variant === 'button') classes.push('btn', 'btn--secondary', 'btn--md');
  if (className) classes.push(className);
  const named = /linkedin/i.test(label);
  return (
    <a
      href={HREF[to]}
      className={classes.join(' ')}
      target="_blank"
      rel="noopener noreferrer"
      data-li-surface={surface}
    >
      <span className="linkedin-link__label">{label}</span>
      {/* small stickers want a fatter "in" to read: 2.7 at the 30px box
          (link, button), 3 for the ~25px inline one, 3.2 at 20px */}
      <LinkedInSticker ink={variant === 'inline' ? 3 : 2.7} />
      <span className="sr-only">{named ? '' : ', on LinkedIn'} (opens in a new tab)</span>
    </a>
  );
};

export default LinkedInLink;
