import React, { useEffect, useRef, useState } from 'react';

const CANVAS = { w: 1280, h: 800 };
// Below this column width the desktop canvas would be scaled past reading.
const SCALE_MIN = 640;

interface PrototypeFrameProps {
  src: string;
  title: string;
  caption?: string;
  /** Where a phone reader goes instead, when the prototype needs a wide screen. */
  phoneAlt?: { label: string; href: string };
}

/**
 * A live prototype held in the same browser window as the artboards. It loads
 * only when the reader asks (the demo is a full app), and the page still has
 * a plain link that opens it on its own.
 */
const PrototypeFrame: React.FC<PrototypeFrameProps> = ({ src, title, caption, phoneAlt }) => {
  const [on, setOn] = useState(false);
  const [w, setW] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  // The app is drawn on a desktop canvas and scaled to the column, so it reads
  // as the desktop app and not a squeezed one.
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const scaled = w >= SCALE_MIN;
  const k = scaled ? w / CANVAS.w : 1;
  // On a phone a desktop app can only be cropped or shrunk past reading, so
  // the frame offers the phone build first and the desktop app full screen.
  const phone = !!phoneAlt && w > 0 && !scaled;
  return (
    <figure className="proto">
      <div className="framed framed--browser">
        <div className="framed__chrome" aria-hidden="true"><i /><i /><i /><span className="framed__url" /></div>
        <div
          className={`proto__screen${scaled ? ' proto__screen--scaled' : ''}${phone ? ' proto__screen--phone' : ''}`}
          ref={box}
          style={scaled ? { height: CANVAS.h * k } : undefined}
        >
          {phone && phoneAlt ? (
            <div className="proto__phone">
              <p className="proto__phone-note">The desktop app needs a wider screen than a phone.</p>
              <a className="proto__phone-primary" href={phoneAlt.href} target="_blank" rel="noopener noreferrer">
                {phoneAlt.label} <span aria-hidden="true">→</span><span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a className="proto__phone-secondary" href={src} target="_blank" rel="noopener noreferrer">
                Open the desktop app anyway<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          ) : on ? (
            <iframe className="proto__frame" src={src} title={title} loading="lazy" style={scaled ? { width: CANVAS.w, height: CANVAS.h, transform: `scale(${k})` } : undefined} />
          ) : (
            <button type="button" className="proto__start" onClick={() => setOn(true)}>
              Try it here <span className="proto__hint">Sample patient, nothing leaves your browser</span>
            </button>
          )}
        </div>
      </div>
      {!phone && (
        <figcaption className="cs__caption">
          {caption}{caption ? ' ' : ''}
          <a href={src} target="_blank" rel="noopener noreferrer">Open full screen<span className="sr-only"> (opens in a new tab)</span></a>
        </figcaption>
      )}
    </figure>
  );
};

export default PrototypeFrame;
