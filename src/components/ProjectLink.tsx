import React from 'react';
import { Link, LinkProps, useLocation, useNavigate } from 'react-router-dom';

/** Normal shareable link, enhanced only for unmodified desktop activation. */
export default function ProjectLink({ onClick, ...props }: LinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  return <Link {...props} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || !window.matchMedia('(min-width: 851px)').matches) return;
    event.preventDefault();
    const returnMeta = {
      title: document.title,
      canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
      tags: Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')).map(meta => ({ name: meta.name, property: meta.getAttribute('property'), content: meta.content })),
    };
    navigate(props.to, { state: { backgroundLocation: location, returnScroll: window.scrollY, returnFocusHref: event.currentTarget.getAttribute('href'), returnFocusClass: event.currentTarget.className, returnMeta } });
  }} />;
}
