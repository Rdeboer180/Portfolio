import React, { useEffect, useRef } from 'react';
import { SIGNATURE_ANCHORS, SIGNATURE_D, SIGNATURE_LENGTH, SIGNATURE_WIDTH } from '../data/signaturePath';

// The signature drawn the way the pen tool draws: the real outline strokes on in drawing
// order, the anchor at the drawing front shows its real handles, and the anchors just
// placed linger as a short trail. Then the fill lands and the path deselects. Plays once.
const DRAW_MS = 1150;
const FILL_MS = 260;
const TRAIL = 46; // path units an anchor stays visible behind the front
const HEIGHT = 48;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const SignatureMark: React.FC<{ play: boolean }> = ({ play }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const chromeRef = useRef<SVGGElement>(null);
  const trailRefs = useRef<(SVGRectElement | null)[]>([]);
  const handleRefs = useRef<{ inL: SVGLineElement | null; outL: SVGLineElement | null; inC: SVGCircleElement | null; outC: SVGCircleElement | null; head: SVGRectElement | null }>({ inL: null, outL: null, inC: null, outC: null, head: null });
  const played = useRef(false);

  useEffect(() => {
    if (!play || played.current) return;
    played.current = true;
    const path = pathRef.current, chrome = chromeRef.current;
    if (!path || !chrome) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.strokeDashoffset = '0'; path.style.fillOpacity = '1'; chrome.style.opacity = '0';
      return;
    }
    const h = handleRefs.current;
    const place = (line: SVGLineElement | null, dot: SVGCircleElement | null, from: { x: number; y: number }, to: [number, number] | null) => {
      if (!line || !dot) return;
      const show = to ? '1' : '0';
      line.style.opacity = show; dot.style.opacity = show;
      if (!to) return;
      line.setAttribute('x1', String(from.x)); line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to[0])); line.setAttribute('y2', String(to[1]));
      dot.setAttribute('cx', String(to[0])); dot.setAttribute('cy', String(to[1]));
    };
    let raf = 0, start = 0, lastHead = -1;
    const frame = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DRAW_MS);
      const front = SIGNATURE_LENGTH * ease(t);
      path.style.strokeDashoffset = String(SIGNATURE_LENGTH - front);
      // Trail: anchors placed in the last TRAIL units fade out behind the front.
      let head = -1;
      SIGNATURE_ANCHORS.forEach((a, i) => {
        const el = trailRefs.current[i];
        if (!el) return;
        const age = front - a.at;
        if (age < 0 || t >= 1) { el.style.opacity = '0'; return; }
        head = i;
        el.style.opacity = age > TRAIL ? '0' : String(1 - age / TRAIL);
      });
      if (head !== lastHead && head >= 0 && h.head) {
        const a = SIGNATURE_ANCHORS[head];
        h.head.setAttribute('x', String(a.x - 1.9)); h.head.setAttribute('y', String(a.y - 1.9));
        place(h.inL, h.inC, a, a.hin); place(h.outL, h.outC, a, a.hout);
        lastHead = head;
      }
      if (t < 1) { raf = requestAnimationFrame(frame); return; }
      path.style.transition = `fill-opacity ${FILL_MS}ms ease`;
      path.style.fillOpacity = '1';
      chrome.style.transition = `opacity ${FILL_MS}ms ease`;
      chrome.style.opacity = '0';
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <svg className="signature-mark" viewBox={`0 0 ${SIGNATURE_WIDTH} ${HEIGHT}`} width={SIGNATURE_WIDTH} height={HEIGHT} role="img" aria-label="Ryan DeBoer">
      <path ref={pathRef} className="signature-mark__ink" d={SIGNATURE_D} strokeDasharray={SIGNATURE_LENGTH} pathLength={SIGNATURE_LENGTH} />
      <g ref={chromeRef} className="signature-mark__chrome" aria-hidden="true">
        {SIGNATURE_ANCHORS.map((a, i) => (
          <rect key={i} ref={(el) => { trailRefs.current[i] = el; }} className="signature-mark__anchor" x={a.x - 1.4} y={a.y - 1.4} width={2.8} height={2.8} />
        ))}
        <line ref={(el) => { handleRefs.current.inL = el; }} className="signature-mark__handle" />
        <line ref={(el) => { handleRefs.current.outL = el; }} className="signature-mark__handle" />
        <circle ref={(el) => { handleRefs.current.inC = el; }} className="signature-mark__handle-end" r={1.3} />
        <circle ref={(el) => { handleRefs.current.outC = el; }} className="signature-mark__handle-end" r={1.3} />
        <rect ref={(el) => { handleRefs.current.head = el; }} className="signature-mark__anchor signature-mark__anchor--selected" width={3.8} height={3.8} />
      </g>
    </svg>
  );
};

export default SignatureMark;
