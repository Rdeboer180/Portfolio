import React from 'react';
import SectionBadge from './SectionBadge';

const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
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
