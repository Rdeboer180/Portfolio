import React from 'react';
import type { ArchiveCard as ArchiveCardData } from '../data/archiveCards';

// A first-edition archive card: the binder's card (public/binder-home,
// frontHTML in docs/explorations/binder-specimen/index.html) node for node,
// with the holo layers left out. Yellow vintage border where the foil was,
// matte card stock tinted from the art, the stat rows as attack slots, a
// history clock in the type badge and the 1st Edition stamp where a locked
// card's pill sits. It opens nothing, so it is a labelled image, not a button.

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{children}</svg>
);

// The archive's type: a clock turning back, its trailing arc dashed (Ryan's reference icon)
export const HistoryIcon: React.FC = () => (
  <Svg>
    <path d="M4.64 7.75A8.5 8.5 0 1 1 16.25 19.36" />
    <path d="M3.9 4.3 4.5 8.1 8.3 7.5" />
    <path d="M11.26 20.47A8.5 8.5 0 0 1 9.37 20.08M7.12 18.96A8.5 8.5 0 0 1 5.68 17.69M4.3 15.59A8.5 8.5 0 0 1 3.69 13.77" />
    <path d="M12 7.6v4.6l3.1 2" />
  </Svg>
);

// the binder's three row icons (ROW_ICONS), in the same order
const ROW_ICONS = [
  <path key="0" d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" />,
  <React.Fragment key="1"><path d="M12 3 3 8l9 5 9-5-9-5z" /><path d="M3 13l9 5 9-5" /></React.Fragment>,
  <React.Fragment key="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /></React.Fragment>,
];

const EditionStamp: React.FC = () => (
  <svg className="cf-edition__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="11.2" />
    <circle cx="12" cy="12" r="9.6" className="cf-edition__ring" />
    <text x="12" y="14.6" textAnchor="middle" className="cf-edition__one">1</text>
    <text x="12" y="19.4" textAnchor="middle" className="cf-edition__word">EDITION</text>
  </svg>
);

// build-cards.mjs: valueSize and titleSize
const valueSize = (value: string) => (value.length <= 5 ? 'l' : value.length <= 10 ? 'm' : 's');
const titleSize = (title: string, subtitle: string) => {
  if (!subtitle) return 'w';
  return title.length <= 12 ? 'l' : title.length <= 18 ? 'm' : 'n';
};

interface Props {
  card: ArchiveCardData;
  total: number;
  className?: string;
  style?: React.CSSProperties;
  /** the desk shows every card at once, so its art loads with the page, not on scroll */
  eager?: boolean;
}

const ArchiveCard: React.FC<Props> = ({ card: c, total, className, style, eager }) => {
  const of = String(total).padStart(2, '0');
  const label = `${c.title}${c.subtitle ? `: ${c.subtitle}` : ''}. Archived artwork, ${c.year}, ${c.category}. First edition, archive card ${c.index} of ${of}.`;
  const statsId = `archive-stats-${c.slug}`;
  return (
    <div
      className={`pocket pocket--archive${c.theme.tone === 'dark' ? ' pocket--dark' : ''}${className ? ` ${className}` : ''}`}
      data-slug={c.slug}
      style={{ '--h': c.theme.h, '--s': c.theme.s, ...style } as React.CSSProperties}
    >
      <div className="card" role="img" aria-label={label} aria-describedby={statsId}>
        <div className="card__body">
          <div className="face face--front">
            <div className="face__foil" />
            <header className="cf-head">
              <span className="cf-index">{c.index}</span>
              <div className={`cf-title cf-title--${titleSize(c.title, c.subtitle)}`}>
                <strong className="cf-name">{c.title}</strong>
                {c.subtitle && <p>{c.subtitle}</p>}
              </div>
              <span className="cf-type" title="Archived artwork"><HistoryIcon /></span>
            </header>
            <figure className="cf-art">
              <img
                // the card shows its art about 200px wide: a 480px copy (images/archive/card), not the full hero
                src={c.hero.replace('/images/archive/', '/images/archive/card/')}
                alt=""
                width="1280"
                height="800"
                decoding="async"
                loading={eager ? 'eager' : 'lazy'}
                style={c.focus != null ? { objectPosition: `${c.focus * 100}% 50%` } : undefined}
              />
              <figcaption className="cf-edition"><EditionStamp /></figcaption>
            </figure>
            <ul className="cf-stats">
              {c.stats.map((s, k) => (
                <li key={s.primary}>
                  <Svg>{ROW_ICONS[k % 3]}</Svg>
                  <span className="l">{s.primary}</span>
                  {s.secondary && <span className="s">{s.secondary}</span>}
                  <span className={`v v--${valueSize(s.value)}`}>{s.value}</span>
                </li>
              ))}
            </ul>
            <footer className="cf-foot"><span>{c.year}</span><span>{c.category}</span></footer>
          </div>
          <div className="card__edge card__edge--l" aria-hidden="true" />
          <div className="card__edge card__edge--r" aria-hidden="true" />
        </div>
      </div>
      <p className="sr-only" id={statsId}>
        {c.heroAlt} {c.stats.map((s) => `${s.primary} (${s.secondary}): ${s.value}.`).join(' ')}
      </p>
      <div className="card__shadow" aria-hidden="true" />
    </div>
  );
};

export default ArchiveCard;
