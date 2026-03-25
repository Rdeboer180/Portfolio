import React from 'react';
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

const testimonials = [
  {
    quote: 'Ryan consistently takes the initiative to engage with relevant teams—such as UX, UXR, Analytics, Imaging, and SEO—whenever needed. He excels at building and maintaining strong relationships, which significantly enhances his overall effectiveness. Moreover, it is evident that he genuinely values and cares for his colleagues.',
    name: 'Director UX Design & Product Insight Manager',
    role: 'Leadership',
    year: '2024',
  },
  {
    quote: 'Ryan\'s work is great. He consistently delivers designs that are at once thoughtful, intentional, and visually beautiful. He is thorough and precise, and he makes sure that everyone\'s expectations are being met. Folks love working with Ryan because they know they can expect great communication, attention to detail and strong visual design sense. He helps to set a standard for our visual presentation on the marketing-oriented pages of the site, and does the same in his collaboration and documentation.',
    name: 'Web Design Manager',
    role: 'Design Leadership',
    year: '2025',
  },
  {
    quote: 'Ryan\'s team mentality is unshakable. He views every initiative as a group effort, and includes everyone from stakeholders to peer designers in his comms. He cares deeply about establishing a shared understanding, and genuinely works hard to create and maintain a sense of unity and community. This doesn\'t just help our team in terms of skill development and information sharing, it also strengthens our internal culture between the UX, UXR, Analytics and Web Design teams as a community of practice. He creates community not just for himself, but for those he welcomes in. Most importantly, Ryan sets an example to the rest of the team for what great communication and collaboration looks like.',
    name: 'Web Design Manager',
    role: 'Design Leadership',
    year: '2025',
  },
  {
    quote: 'Always very high quality work. Has always thought through even the minor details, with specific reasoning for most all choices.',
    name: 'Senior Vice President of Digital Operations',
    role: 'Executive Leadership',
    year: '2021',
  },
  {
    quote: 'Ryan has a lot of institutional knowledge. He understands what we\'ve done in the past, what\'s worked, what hasn\'t, and why. Combined with his technical skills, he has been very effective in project work.',
    name: 'Senior Management',
    role: 'Leadership',
    year: '2024',
  },
  {
    quote: 'The new site has been amazing—we\'re getting new inquiries every day, and clients have been loving it. It\'s made it so much easier to connect and respond, and I couldn\'t be happier with how it\'s working for us.',
    name: 'Deborah Clements',
    role: 'Owner & Operator, Heatherwood Equestrian Academy',
    year: '2025',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <SectionBadge icon={<QuoteIcon />} label="Testimonials" />
          <h2 className="testimonials__title">Words from those I've worked with</h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonials__card">
              <QuoteMark />
              <p className="testimonials__quote">{t.quote}</p>
              <div className="testimonials__author">
                <span className="testimonials__name">— {t.name}</span>
                <span className="testimonials__role">{t.role}, {t.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
