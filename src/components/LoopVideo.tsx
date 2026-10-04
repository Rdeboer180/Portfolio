import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Silent, GIF-like media. The whole frame is the keyboard and touch toggle. */
export default function LoopVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null);
  const [playing, setPlaying] = useState(false);
  const shouldPlay = inView && visible && (choice === 'play' || (!reduced && choice !== 'pause'));
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return () => document.removeEventListener('visibilitychange', update);
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (video.current) observer.observe(video.current);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (shouldPlay) { el.muted = true; el.play()?.catch(() => setPlaying(false)); }
    else el.pause();
  }, [shouldPlay]);
  return <video ref={video} src={src} poster={poster} muted loop playsInline preload="metadata"
    className="project-loop-video" role="button" tabIndex={0}
    aria-label={`${playing ? 'Pause' : 'Play'} ${label}`} aria-pressed={playing}
    onClick={() => setChoice(video.current?.paused ? 'play' : 'pause')}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setChoice(video.current?.paused ? 'play' : 'pause'); } }}
    onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />;
}
