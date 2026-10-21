import React, { useEffect, useRef } from 'react';

// The top of a study opened from the homepage binder (CaseStudyBinder.tsx):
// the binder builds it here (window.binderHome.mountTop) in a shadow root
// with its own styles, the sleeve its card tucks into, the reel that unfolds
// beside it and the walkthrough video, so the card lands in the site's real
// panel. When the panel is about to slide away it asks first
// (portfolio:panel-closing), and the binder folds the reel and takes the card
// home.

declare global {
  interface Window {
    binderHome?: {
      mountTop: (el: HTMLElement, slug: string) => void;
      unmountTop: (el: HTMLElement) => void;
      closing: () => Promise<void>;
    };
  }
}

const BinderTop: React.FC<{ slug: string; id?: string }> = ({ slug, id }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const home = window.binderHome;
    if (!el || !home) return undefined;
    home.mountTop(el, slug);
    const ask = (event: Event) => {
      const wait = (event as CustomEvent<{ wait: (p: Promise<unknown>) => void }>).detail?.wait;
      wait?.(home.closing());
    };
    document.addEventListener('portfolio:panel-closing', ask);
    return () => {
      document.removeEventListener('portfolio:panel-closing', ask);
      home.unmountTop(el);
    };
  }, [slug]);
  return <div ref={ref} id={id} className="project-overview__binder-top" />;
};

export default BinderTop;
