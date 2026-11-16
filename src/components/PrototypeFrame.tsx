import React, { useEffect, useRef, useState } from 'react';

const CANVAS = { w: 1280, h: 800 };

/**
 * A live prototype held in the same browser window as the artboards. It loads
 * only when the reader asks (the demo is a full app), and the page still has
 * a plain link that opens it on its own.
 */
const PrototypeFrame: React.FC<{ src: string; title: string; caption?: string }> = ({ src, title, caption }) => {
  const [on, setOn] = useState(false);
  const [w, setW] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  // The app is drawn on a desktop canvas and scaled to the column, so it reads
  // as the desktop app and not a squeezed one; on a phone it runs at its own size.
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const scaled = w >= 640;
  const k = scaled ? w / CANVAS.w : 1;
  return (
    <figure className="proto">
      <div className="framed framed--browser">
        <div className="framed__chrome" aria-hidden="true"><i /><i /><i /><span className="framed__url" /></div>
        <div className={`proto__screen${scaled ? ' proto__screen--scaled' : ''}`} ref={box} style={scaled ? { height: CANVAS.h * k } : undefined}>
          {on ? (
            <iframe className="proto__frame" src={src} title={title} loading="lazy" style={scaled ? { width: CANVAS.w, height: CANVAS.h, transform: `scale(${k})` } : undefined} />
          ) : (
            <button type="button" className="proto__start" onClick={() => setOn(true)}>
              Try it here <span className="proto__hint">Sample patient, nothing leaves your browser</span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="cs__caption">
        {caption}{caption ? ' ' : ''}
        <a href={src} target="_blank" rel="noopener noreferrer">Open full screen<span className="sr-only"> (opens in a new tab)</span></a>
      </figcaption>
    </figure>
  );
};

export default PrototypeFrame;
