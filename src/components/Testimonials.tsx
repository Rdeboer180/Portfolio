import React from 'react';
import SectionBadge from './SectionBadge';
import { SITE } from '../data/site';

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

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="testimonials__highlight">{children}</span>
);

interface Testimonial {
  title: string;
  quote: React.ReactNode;
  name: string;
  role: string;
  year: string;
}

// Preserve the existing recommendations verbatim; excerpts below are direct selections.
const testimonials: Testimonial[] = [
  {
    title: 'Leadership & Delivery',
    quote: (
      <>
        <p>Ryan is <H>one of the most helpful, industrious, passionate and dependable designers</H> I&rsquo;ve had the luck of serving as a manager.</p>
        <p>He runs large projects from a design perspective, coordinates with leaders and ICs from corresponding teams on his own, and has a <H>strong record of delivering large bodies of work without issue</H>. He writes good, clean code and cares passionately about making sure the vision gets realized.</p>
        <p>A team or role that lets him lead projects across technical and nontechnical teams would truly flourish with him in the seat.</p>
      </>
    ),
    name: 'Adam Payne',
    role: 'Web Design Manager (Ryan’s direct manager)',
    year: '2026',
  },
  {
    title: 'Design–Engineering Partnership',
    quote: (
      <>
        <p>He owned the design side; I owned the build, and it was <H>one of the best collaborations I&rsquo;ve had</H>. Ryan doesn&rsquo;t just design screens&mdash;he <H>designs the whole experience</H>.</p>
        <p>WheelRack had no shared foundation when we started, so Ryan built one from scratch&mdash;a full token set for color, spacing, and typography that grew into a documented component library. That gave us <H>one vocabulary to work from instead of two</H>, and it made my half of the work a lot easier to do well.</p>
        <p><H>Any product team would be better with him on it.</H></p>
      </>
    ),
    name: 'Cheryl Carpenter',
    role: 'React Front-End Developer, Tire Rack (WheelRack build partner)',
    year: '2026',
  },
  {
    title: 'Craft, Care, and Growth',
    quote: (
      <>
        <p>Ryan and I work closely together to support a professional development program that serves around 100 people within our department. The quality of the experience our participants receive is a <H>direct reflection of the effort and care he puts into it</H>.</p>
        <p>As a designer, he has an <H>exceptional eye for creating work that is clean, creative and visually engaging</H>.</p>
        <p>Most importantly, Ryan is one of the kindest and most professional people I&rsquo;ve worked with. He combines talent, humility and a genuine desire to help his teammates succeed.</p>
      </>
    ),
    name: 'Amanda Straup',
    role: 'Assistant Vice President, Digital Operations at Tire Rack',
    year: '2026',
  },
  {
    title: 'Process Improvement & Shared Learning',
    quote: (
      <>
        <p>I worked with Ryan for <H>over 10 years</H> and got to know him quite well, both as a designer and as a person. He truly has a passion for improvement in both his professional and personal life. He is always looking for <H>better and more efficient ways to do things</H>. He loves trying new tools and <H>refining existing processes</H>.</p>
        <p>&hellip; He&rsquo;s always eager to ask questions, see what others have been working on, and find what knowledge he can glean from them. At the same time, he&rsquo;s <H>happy to share his own knowledge and what he has learned</H> from the work he&rsquo;s been doing.</p>
      </>
    ),
    name: 'Rob Oxley',
    role: 'Senior Web Designer, Tire Rack (design peer for over 10 years)',
    year: '2026',
  },
  {
    title: 'Systems Knowledge & Cross-Team Trust',
    quote: (
      <>
        <p>Ryan has a lot of <H>institutional knowledge</H>. He understands what we&rsquo;ve done in the past, <H>what&rsquo;s worked, what hasn&rsquo;t, and why</H>. Combined with his technical skills, he has been very effective in project work.</p>
        <p>He consistently takes the initiative to engage relevant teams&mdash;including UX, UXR, Analytics, Imaging, and SEO&mdash;whenever needed. He excels at <H>building and maintaining strong relationships</H>, which significantly enhances his overall effectiveness. It&rsquo;s also evident that he genuinely <H>values and cares for his colleagues</H>.</p>
      </>
    ),
    name: 'Ryan Kokesh',
    role: 'Senior UX Manager (overseeing design 2022-2024)',
    year: '2024',
  },
  {
    title: 'Mentorship & Confidence',
    quote: (
      <>
        <p>Since I started at Tire Rack almost 5 years ago, Ryan has always been <H>a kind and thoughtful mentor</H> to me as a Senior Designer on the Web Design team.</p>
        <p>He is a very intuitive and collaborative teammate, and <H>always looks for ways that we can improve our design system and user experience</H> throughout our sites.</p>
        <p>He is a seasoned pro with Adobe Creative Suite and <H>took the time to teach me a few tricks</H> with Illustrator and Photoshop to improve my design output and workflow. He is also skilled with AEM and is <H>a great knowledge resource</H> for this platform as well.</p>
        <p>I know that whenever we are paired together on a project, Ryan will <H>go out of his way to ensure the junior designer (me in this case) has the confidence they need</H> in order to make the project a success.</p>
      </>
    ),
    name: 'Gina Saucedo',
    role: 'Web Designer, Tire Rack (Web Design team)',
    year: '2026',
  },
];

const excerpts = [
  { index: 0, text: 'He runs large projects from a design perspective, coordinates with leaders and ICs from corresponding teams on his own, and has a strong record of delivering large bodies of work without issue.' },
  { index: 1, text: 'He owned the design side; I owned the build, and it was one of the best collaborations I’ve had. Ryan doesn’t just design screens—he designs the whole experience.' },
  { index: 4, text: 'He consistently takes the initiative to engage relevant teams—including UX, UXR, Analytics, Imaging, and SEO—whenever needed. He excels at building and maintaining strong relationships, which significantly enhances his overall effectiveness.' },
];

export const FeaturedEndorsement: React.FC = () => (
  <figure className="featured-endorsement">
    <blockquote>“That gave us one vocabulary to work from instead of two, and it made my half of the work a lot easier to do well.”</blockquote>
    <figcaption><strong>Cheryl Carpenter</strong> · React Front-End Developer, Tire Rack · WheelRack build partner, on the token and component library, 2026. <a href="#testimonials" className="about__inline-link">Read the recommendations</a></figcaption>
  </figure>
);

const Testimonials: React.FC = () => (
  <section id="testimonials" className="testimonials testimonials--concise ink-ground" aria-labelledby="testimonials-heading">
    <div className="testimonials__container">
      <SectionBadge icon={<QuoteIcon />} label="Peer recommendations" index="04" />
      <h2 id="testimonials-heading" className="testimonials__lede">From the people I build with</h2>
      <div className="testimonials__grid">
        {excerpts.map(({ index, text }) => {
          const t = testimonials[index];
          return <figure key={t.name} className="testimonials__card">
            <QuoteMark />
            <span className="testimonials__card-title">{t.title}</span>
            <blockquote className="testimonials__quote">{text}</blockquote>
            <figcaption className="testimonials__author"><span className="testimonials__name">{t.name}</span><span className="testimonials__role">{t.role}, {t.year}</span></figcaption>
          </figure>;
        })}
      </div>
      <a href={SITE.linkedinRecommendationsUrl} className="testimonials__cta" target="_blank" rel="noopener noreferrer"><span>Read recommendations on LinkedIn <span aria-hidden="true">↗</span></span><span className="sr-only"> (opens in a new tab)</span></a>
    </div>
  </section>
);

export default Testimonials;
