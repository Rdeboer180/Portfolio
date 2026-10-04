/** Defer geometry writes until after ResizeObserver delivery to avoid resize loops. */
export function observeLayout(elements: Element[], draw: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; draw(); });
  };
  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', schedule);
    return () => { window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }
  const observer = new ResizeObserver(schedule);
  elements.forEach(element => observer.observe(element));
  return () => { observer.disconnect(); cancelAnimationFrame(frame); };
}
