import React from 'react';
import '../styles/components/_overlay-card.scss';

interface OverlayCardProps {
  text: string;
  altText: string;
  caption?: string;
  onClick?: () => void;
}

// Three things were wrong here and they compounded:
//   - `role` sat on the <figure> while `aria-label` sat on an inner <div>,
//     where AT discards it — so the role="img" branch had no accessible name
//     at all, and role="img" also prunes its own descendant text.
//   - role="button" responded to Enter but not Space, which a button must.
//   - <figcaption> ended up inside the button role.
// Role, tabIndex and the label now live on the same element, the caption sits
// outside the interactive region, and both keys activate.
const OverlayCard: React.FC<OverlayCardProps> = ({ text, altText, caption, onClick }) => (
  <figure className="overlay-card">
    <div
      className="overlay-card__inner"
      role={onClick ? 'button' : 'img'}
      aria-label={altText}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <p className="overlay-card__text">{text}</p>
      {onClick && <span className="overlay-card__hint">Click to unlock</span>}
    </div>
    {caption && <figcaption className="overlay-card__caption">{caption}</figcaption>}
  </figure>
);

export default OverlayCard;
