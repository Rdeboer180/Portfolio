import React from 'react';
import '../styles/components/_overlay-card.scss';

interface OverlayCardProps {
  text: string;
  altText: string;
  caption?: string;
  onClick?: () => void;
}

const OverlayCard: React.FC<OverlayCardProps> = ({ text, altText, caption, onClick }) => (
  <figure className="overlay-card" onClick={onClick} role={onClick ? 'button' : 'img'} tabIndex={onClick ? 0 : -1} onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}>
    <div className="overlay-card__inner" aria-label={altText}>
      <p className="overlay-card__text">{text}</p>
      {onClick && <span className="overlay-card__hint">Click to unlock</span>}
    </div>
    {caption && <figcaption className="overlay-card__caption">{caption}</figcaption>}
  </figure>
);

export default OverlayCard;
