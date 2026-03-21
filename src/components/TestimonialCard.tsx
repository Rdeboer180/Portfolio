import React from 'react';

interface TestimonialCardProps {
  avatarSrc?: string;
  name: string;
  role: string;
  company?: string;
  rating?: number;
  quote: string;
  companyLogoSrc?: string;
  className?: string;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  avatarSrc,
  name,
  role,
  company,
  rating,
  quote,
  companyLogoSrc,
  className,
}) => (
  <div className={`testimonial-card ${className ?? ''}`}>
    <div className="testimonial-card__header">
      {avatarSrc ? (
        <img src={avatarSrc} alt={name} className="testimonial-card__avatar" />
      ) : (
        <div className="testimonial-card__avatar testimonial-card__avatar--placeholder">
          {name.charAt(0)}
        </div>
      )}
      <div className="testimonial-card__identity">
        <span className="testimonial-card__name">{name}</span>
        <span className="testimonial-card__role">
          {role}{company ? ` @ ${company}` : ''}
        </span>
      </div>
    </div>

    {rating && (
      <div className="testimonial-card__rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </div>
    )}

    <p className="testimonial-card__quote">{quote}</p>

    {companyLogoSrc && (
      <img src={companyLogoSrc} alt={company ?? ''} className="testimonial-card__logo" />
    )}
  </div>
);

export default TestimonialCard;
