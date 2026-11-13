import React from 'react';
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
   * 'link' (default): a caption text link led by the LinkedIn sticker, with
   * the off-site arrow. 'inline': the same inside a sentence, taking the
   * sentence's type. 'button': the secondary sticker button with the
   * LinkedIn sticker on it (contact rows, beside Email).
   */
  variant?: 'link' | 'inline' | 'button';
  /** Optional extra class for surface-specific overrides. */
  className?: string;
}

/**
 * LinkedInLink — every outbound LinkedIn link on the site. The die-cut "in"
 * sticker (styles/components/_linkedin-link.scss, tokens --linkedin-* and
 * --sticker-*-linkedin) tells a reader before they click that the link leaves
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
      <span className="linkedin-link__sticker" aria-hidden="true" />
      <span className="linkedin-link__label">{label}</span>
      {variant !== 'button' && <span className="linkedin-link__out" aria-hidden="true">↗</span>}
      <span className="sr-only">{named ? '' : ', on LinkedIn'} (opens in a new tab)</span>
    </a>
  );
};

export default LinkedInLink;
