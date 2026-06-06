import React, { useEffect, useRef } from 'react';
import SectionBadge from './SectionBadge';

const QuoteIcon = () => (
  <svg viewBox="0 0 180 169.8" fill="currentColor" stroke="none">
    {/* Back bubble */}
    <path d="M19.09,125.13h-3.06c-8.82,0-16.03-7.22-16.03-16.03V40.25c0-12.58,10.27-22.85,22.85-22.85h.68V5.47c0-2.07,1.07-3.85,2.91-4.82,1.82-.96,3.89-.85,5.59.3l24.11,16.45h80.56c8.82,0,16.03,7.22,16.03,16.03v3.06H43.31c-13.33,0-24.21,10.88-24.21,24.21v64.42h0Z" opacity="0.4" />
    {/* Middle bubble */}
    <path d="M152.73,44.68v64.42c0,8.82-7.22,16.03-16.03,16.03H27.27V60.71c0-8.82,7.22-16.03,16.03-16.03h109.42Z" opacity="0.7" />
    {/* Front bubble */}
    <path d="M160.91,44.68h3.06c8.82,0,16.03,7.22,16.03,16.03v68.84c0,12.58-10.27,22.85-22.85,22.85h-.68v11.93c0,2.07-1.07,3.85-2.91,4.82-1.82.96-3.88.85-5.59-.3l-24.11-16.45H43.31c-8.82,0-16.03-7.22-16.03-16.03v-3.06h109.42c13.33,0,24.21-10.88,24.21-24.21V44.68h0Z" opacity="0.55" />
    {/* Dots in middle bubble */}
    <circle cx="57.6" cy="84.9" r="10.2" fill="#fff" />
    <circle cx="90" cy="84.9" r="10.2" fill="#fff" />
    <circle cx="122.4" cy="84.9" r="10.2" fill="#fff" />
  </svg>
);

const QuoteMark = () => (
  <svg className="testimonials__quote-mark" viewBox="0 0 32 32" fill="currentColor">
    <path d="M4 20.5c0-4.4 3.6-8 8-8h.5V10c0-3.3-2.7-6-6-6H6C4.9 4 4 3.1 4 2s.9-2 2-2h.5C12.3 0 17 4.7 17 10.5v10c0 3-2.5 5.5-5.5 5.5h-2C6.5 26 4 23.5 4 20.5zm18 0c0-4.4 3.6-8 8-8h.5V10c0-3.3-2.7-6-6-6H24c-1.1 0-2-.9-2-2s.9-2 2-2h.5C30.3 0 35 4.7 35 10.5v10c0 3-2.5 5.5-5.5 5.5h-2c-3 0-5.5-2.5-5.5-5.5z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.95 6.55 7.05.75-5.3 4.85 1.5 7.1L12 18l-6.2 3.75 1.5-7.1L2 9.8l7.05-.75L12 2.5z" />
  </svg>
);

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="testimonials__highlight">{children}</span>
);

// Order locked by the case-study brief:
// 1. Leadership & Team Impact (Adam) → 2. Cross-Functional & Human (Kokesh)
// → 3. Craft & Standard-Setting (Adam) → 4. Systems Thinking (Kokesh)
// → 5. Precision & Reasoning (Tim) → 6. Business Impact (Deborah)
const testimonials = [
  {
    title: 'Leadership & Team Impact',
    quote: (
      <>Ryan&rsquo;s <H>team mentality is unshakable</H>. He views every initiative as a group effort, and includes everyone from stakeholders to peer designers in his comms. He cares deeply about establishing a shared understanding, and genuinely works hard to create and maintain a sense of unity and community. This doesn&rsquo;t just help our team in terms of skill development and information sharing, it also strengthens our internal culture between the UX, UXR, Analytics and Web Design teams as a community of practice. He creates community not just for himself, but for those he welcomes in. Most importantly, Ryan <H>sets an example to the rest of the team for what great communication and collaboration looks like</H>.</>
    ),
    name: 'Adam Payne',
    role: 'Web Design Manager',
    year: '2025',
  },
  {
    title: 'Cross-Functional & Human',
    quote: (
      <>Ryan consistently takes the initiative to engage with relevant teams&mdash;such as UX, UXR, Analytics, Imaging, and SEO&mdash;whenever needed. He excels at <H>building and maintaining strong relationships</H>, which significantly enhances his overall effectiveness. Moreover, it is evident that he genuinely <H>values and cares for his colleagues</H>.</>
    ),
    name: 'Ryan Kokesh',
    role: 'Senior UX Manager (overseeing design 2022-2024)',
    year: '2024',
  },
  {
    title: 'Craft & Standard-Setting',
    quote: (
      <>Ryan&rsquo;s work is great. He consistently <H>delivers designs that are thoughtful, intentional, and visually beautiful</H>. He is thorough and precise, and he makes sure that everyone&rsquo;s expectations are being met. Folks love working with Ryan because they know they can expect great communication, <H>attention to detail and strong visual design sense</H>. He helps to set a standard for our visual presentation on the marketing-oriented pages of the site, and does the same in his collaboration and documentation.</>
    ),
    name: 'Adam Payne',
    role: 'Web Design Manager',
    year: '2025',
  },
  {
    title: 'Systems Thinking',
    quote: (
      <>Ryan has a lot of <H>institutional knowledge</H>. He understands what we&rsquo;ve done in the past, <H>what&rsquo;s worked, what hasn&rsquo;t, and why</H>. Combined with his technical skills, he has been very effective in project work.</>
    ),
    name: 'Ryan Kokesh',
    role: 'Senior UX Manager (overseeing design 2022-2024)',
    year: '2024',
  },
  {
    title: 'Precision & Reasoning',
    quote: (
      <><H>Always very high quality work.</H> Has always thought through even the minor details, with <H>specific reasoning for most all choices</H>.</>
    ),
    name: 'Tim Joines',
    role: 'Tire Rack Senior Management',
    year: '2021',
  },
  {
    title: 'Business Impact',
    quote: (
      <>The new site has been amazing&mdash;we&rsquo;re <H>getting new inquiries every day</H>, and <H>clients have been loving it</H>. It&rsquo;s made it so much easier to connect and respond, and I couldn&rsquo;t be happier with how it&rsquo;s working for us.</>
    ),
    name: 'Deborah Clements',
    role: 'Owner & Operator, Heatherwood Equestrian Academy',
    year: '2025',
  },
];

const teamScoreTags = [
  'Systems thinker',
  'Remote teammate',
  'Design → code bridge',
  'AI-forward builder',
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Single IntersectionObserver drives both the TeamScore-card stack reveal
  // and the testimonial-card stagger. Each card gets `--in` toggled when it
  // crosses ~25% into the viewport. Reduced-motion is honored entirely in CSS.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('testimonials__reveal--in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <div className="testimonials__container">
        {/* ==== Zone A — Hero proof area ==================================== */}
        <div className="testimonials__hero">
          <div className="testimonials__hero-text">
            <SectionBadge icon={<QuoteIcon />} label="Peer Reviewed" />
            <h2 className="testimonials__lede">
              Hear from the people I build with
            </h2>
            <p className="testimonials__subline">
              I can tell you I&rsquo;m systems-minded, collaborative, fast-moving,
              and easy to work with&mdash;but the people I&rsquo;ve partnered with
              probably say it better.
            </p>
            <p className="testimonials__micro">Straight from my year-end reviews</p>
            <a href="#peer-reviews" className="testimonials__cta">
              Read the feedback
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* ==== TeamScore stacked card ================================== */}
          <figure
            className="testimonials__team-score testimonials__reveal"
            data-reveal
          >
            <span
              className="testimonials__team-score-shadow testimonials__team-score-shadow--back"
              aria-hidden="true"
            />
            <span
              className="testimonials__team-score-shadow testimonials__team-score-shadow--mid"
              aria-hidden="true"
            />
            <div className="testimonials__team-score-card">
              <div className="testimonials__team-score-header">
                <span className="testimonials__team-score-mark">
                  <span className="testimonials__team-score-mark-glyph" aria-hidden="true">★</span>
                  <span className="testimonials__team-score-mark-text">TeamScore</span>
                </span>
                <div
                  className="testimonials__team-score-stars"
                  role="img"
                  aria-label="4.9 out of 5 stars"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`testimonials__team-score-star testimonials__team-score-star--${i + 1}`}
                      aria-hidden="true"
                    >
                      <StarIcon />
                    </span>
                  ))}
                </div>
              </div>
              <figcaption className="testimonials__team-score-body">
                <p className="testimonials__team-score-rating">
                  <span className="testimonials__team-score-label">Collaboration Rating</span>
                  <span className="testimonials__team-score-score">
                    <strong>4.9</strong> / 5
                  </span>
                  <span className="sr-only"> — 4.9 out of 5</span>
                </p>
                <p className="testimonials__team-score-basis">
                  Built from 12+ years of design systems, production handoff, remote
                  teamwork, and cross-functional problem solving.
                </p>
                <ul className="testimonials__team-score-tags">
                  {teamScoreTags.map((tag) => (
                    <li key={tag} className="testimonials__team-score-tag">{tag}</li>
                  ))}
                </ul>
              </figcaption>
            </div>
          </figure>
        </div>

        {/* ==== Zone B — Divider =========================================== */}
        <div className="testimonials__divider">
          <h3 id="peer-reviews" className="testimonials__divider-label">
            Year-end review highlights
          </h3>
        </div>

        {/* ==== Zone C — Testimonial grid ================================== */}
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="testimonials__card testimonials__reveal"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <QuoteMark />
              <span className="testimonials__card-title">{t.title}</span>
              <p className="testimonials__quote">{t.quote}</p>
              <cite className="testimonials__author">
                <span className="testimonials__name">&mdash; {t.name}</span>
                <span className="testimonials__role">{t.role}, {t.year}</span>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
