import React from 'react';
import '../styles/styles.scss';

const AboutUX: React.FC = () => {
  return (
    <section id="about" className="about-page about-page--standalone">
      <div className="about-page__container">
        <div className="about-page__content">
          <h2 className="about-page__heading">How I Got Here</h2>

          <div className="about-page__body">
            <p>
              I started as a web designer in 2010, back when the role encompassed everything—UX, UI, front-end, systems thinking. That wasn't a limitation. It was an education.
            </p>

            <p>
              Over 14 years, I've built responsive systems, shipped high-traffic ecommerce experiences, and collaborated with engineers who forced me to think in constraints. I learned early that the most beautiful design fails if it doesn't account for scale, shipping, and the real people building it.
            </p>

            <p>
              <strong>From 2021–2025, I operated directly under a Lead UX Manager at Tire Rack.</strong> I moved away from solo execution and into the harder work: translating ambiguous UX challenges into production-ready systems, mentoring junior designers on strategic thinking, and serving as the connective tissue between design and engineering. I was trusted with complex problems that had no obvious answers—and learning to live in that ambiguity is what shaped how I approach design today.
            </p>

            <p>
              During my recent sabbatical, I rebuilt this portfolio entirely using AI-native workflows (Claude, Cursor, Figma Make). Not because I'm chasing trends. Because I'm genuinely curious about what's possible when you pair human judgment with AI-accelerated exploration. I think that's the future of design work—and it excites me.
            </p>

            <p>
              I'm looking to return to high-impact product work. To problems that matter. To teams that value someone who can see the full picture: the UX, the engineering, the systems, the shipping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUX;
