import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Project } from '../data/projects';

/** The exact homepage cover, with silent playback and accessible pause controls. */
export default function ProjectPreview({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const automaticPause = useRef(false);
  useEffect(() => {
    setMounted(true);
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return () => document.removeEventListener('visibilitychange', onVisibility);
    }
    const el = video.current;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (el) observer.observe(el);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (mounted && inView && visible && !reduced && !manuallyPaused) {
      automaticPause.current = false;
      el.muted = true;
      el.play()?.catch(() => { /* Browser autoplay restrictions leave usable controls. */ });
    } else if (!el.paused) {
      automaticPause.current = true;
      el.pause();
    }
  }, [mounted, inView, visible, reduced, manuallyPaused]);
  if (!project.featuredVideo) return null;
  return <figure className="project-overview__preview">
    <video ref={video} src={project.featuredVideo} poster={project.featuredVideo.replace(/\.mp4$/, '-poster.jpg')}
      muted loop playsInline controls preload="metadata" autoPlay={mounted && !reduced && !manuallyPaused && inView && visible}
      aria-label={`${project.title} preview`}
      onPause={() => { if (automaticPause.current) automaticPause.current = false; else setManuallyPaused(true); }}
      onPlay={() => setManuallyPaused(false)} />
  </figure>;
}
