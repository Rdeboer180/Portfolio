import React from 'react';
import SectionBadge from './SectionBadge';

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const impactAreas = [
  'E-Commerce UX & Revenue Impact',
  'Design System Architecture',
  'Research-Led UX Strategy',
  'Cross-Functional Design Leadership',
  'Brand-to-Web Translation',
];

const deliveryMethods = [
  'High-Fidelity Prototyping & Spec Documentation',
  'Component-Driven Front-End Development',
  'SEO-Informed Information Architecture',
  'Annotated UI Behavior Specs for Engineering',
  'Owner-Ready CMS & Handoff Systems',
];

const Impact: React.FC = () => {
  return (
    <section className="impact">
      <div className="impact__container">
        <div className="impact__header">
          <SectionBadge icon={<TrendingIcon />} label="Impact" />
          <h2 className="impact__title">Where and how I create impact</h2>
        </div>

        <div className="impact__columns">
          <div className="impact__column">
            <h3 className="impact__column-heading">Where I Create Impact</h3>
            <ol className="impact__list">
              {impactAreas.map((item, i) => (
                <li key={i} className="impact__item">
                  <span className="impact__number">{i + 1}</span>
                  <span className="impact__text">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="impact__column">
            <h3 className="impact__column-heading">How I Deliver Impact</h3>
            <ol className="impact__list">
              {deliveryMethods.map((item, i) => (
                <li key={i} className="impact__item">
                  <span className="impact__number">{i + 1}</span>
                  <span className="impact__text">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
