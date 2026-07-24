// ============================================
// Site / contact — single source of truth
// Name, email, and social URLs referenced across the site. Update here, not in
// individual components.
// ============================================

export const SITE = {
  name: 'Ryan DeBoer',
  email: 'rdeboer180@gmail.com',
  location: 'South Bend, Indiana',
  portfolioUrl: 'https://www.rdeboerdesigns.com',
  /** Canonical LinkedIn profile URL (profile root — activity deep links are auth-walled). */
  linkedinUrl: 'https://www.linkedin.com/in/ryandeboerdesigns/',
} as const;

/** Ready-to-use mailto: href. */
export const EMAIL_HREF = `mailto:${SITE.email}`;
