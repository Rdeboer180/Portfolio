import React from 'react';

/**
 * A tall page board held inside a viewport the reader scrolls, so a full-page
 * artboard keeps the column's width instead of running the page's height.
 * `browser` is a 3:2 window with minimal chrome; `phone` is a phone bezel.
 * The screen is a focusable region (keyboard scroll) and the image inside it
 * still opens at full size in a new tab.
 */
const FramedViewport: React.FC<{ kind: 'browser' | 'phone'; src: string; alt: string }> = ({ kind, src, alt }) => (
  <div className={`framed framed--${kind}`}>
    {kind === 'browser' ? (
      <div className="framed__chrome" aria-hidden="true"><i /><i /><i /><span className="framed__url" /></div>
    ) : (
      <div className="framed__notch" aria-hidden="true" />
    )}
    <div className="framed__screen" tabIndex={0} role="region" aria-label={`${alt}. Scrolls.`}>
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${alt} (opens in a new tab)`}>
        <img src={src} alt={alt} loading="lazy" />
      </a>
    </div>
  </div>
);

export default FramedViewport;
