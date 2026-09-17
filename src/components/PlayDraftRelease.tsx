import React from 'react';
import playdraft from '../data/playdraft.json';

/** One store destination, with placement-specific labels and visual emphasis. */
export const PlayDraftStoreLink: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <a
    href={playdraft.appStoreUrl}
    className={`pd-release__link ${className}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
    <span className="pd-release__arrow" aria-hidden="true">↗</span>
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/** Quiet, current product status next to the case-study or dated writing. */
export const PlayDraftLaunch: React.FC<{ context?: 'study' | 'note' | 'index' }> = ({ context = 'study' }) => (
  <aside className={`pd-release pd-release--${context}`} aria-label="PlayDraft release update">
    <img className="pd-release__icon" src={playdraft.icon} alt="" width="44" height="44" />
    <div className="pd-release__copy">
      <span className="pd-release__eyebrow">
        {context === 'study' ? 'Designed, built & released' : 'Product update · September 2026'}
      </span>
      <PlayDraftStoreLink>
        {context === 'study' ? 'Now on the App Store' : 'PlayDraft is now on the App Store'}
      </PlayDraftStoreLink>
      {context !== 'study' && <p>The game behind the work is ready to play on iPhone.</p>}
    </div>
    {context === 'study' && <span className="pd-release__platform">Available for iPhone</span>}
  </aside>
);

export const PlayDraftDownload: React.FC = () => (
  <section className="pd-download" aria-labelledby="playdraft-download-title">
    <div className="pd-download__identity">
      <img src={playdraft.icon} alt="" width="56" height="56" loading="lazy" />
      <div>
        <span className="pd-download__name">PlayDraft</span>
        <span className="pd-download__status">Now on the App Store</span>
      </div>
    </div>
    <div className="pd-download__content">
      <div className="pd-download__copy">
        <h2 id="playdraft-download-title">Draft yours.<br />Settle it.</h2>
        <p>Snacks, movies, or a topic of your own. Bring your friends, draft on the clock, and see who picked best.</p>
        <PlayDraftStoreLink className="pd-download__button">Download for iPhone</PlayDraftStoreLink>
      </div>
      <figure className="pd-download__scan">
        <img src={`/images/qr/${playdraft.qrSlug}.svg`} alt="" width="144" height="144" loading="lazy" />
        <figcaption>Scan with your iPhone<br />to open the App Store</figcaption>
      </figure>
    </div>
  </section>
);
