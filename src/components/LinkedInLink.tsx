import React from 'react';
import { SITE } from '../data/site';

/**
 * Canonical LinkedIn profile URL — every LinkedIn link on the site points at
 * the profile root. Activity-feed / post deep links are auth-walled for
 * logged-out visitors, so they are never used. Sourced from data/site.ts.
 */
export const LINKEDIN_PROFILE_URL = SITE.linkedinUrl;

interface LinkedInLinkProps {
  /** Visible link text. */
  label: string;
  /**
   * Placement identifier, emitted as data-li-surface. Inert until an
   * analytics stack exists — pre-wires the linkedin_click event taxonomy
   * (testimonial_source | case_study_close | about_bridge | faq_build).
   */
  surface: string;
  /** Optional extra class for surface-specific overrides. */
  className?: string;
}

/**
 * LinkedInLink — shared profile-link atom: caption-size text link with the
 * 12px LinkedIn glyph (CSS mask, follows currentColor). Base styles live in
 * styles/components/_linkedin-link.scss.
 */
const LinkedInLink: React.FC<LinkedInLinkProps> = ({ label, surface, className }) => (
  <a
    href={LINKEDIN_PROFILE_URL}
    className={className ? `linkedin-link ${className}` : 'linkedin-link'}
    target="_blank"
    rel="noopener noreferrer"
    data-li-surface={surface}
  >
    {label}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export default LinkedInLink;
