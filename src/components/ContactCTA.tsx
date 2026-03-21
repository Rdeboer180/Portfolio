import React from 'react';

const ContactCTA: React.FC = () => {
  return (
    <section className="contact-cta">
      <div className="contact-cta__container">
        <div className="contact-cta__content">
          <span className="contact-cta__eyebrow">Get in touch</span>
          <h2 className="contact-cta__title">Let's work together</h2>
          <p className="contact-cta__body">
            Have a project in mind? I'd love to hear about it. Whether it's a design system build,
            a UX redesign, or a brand-to-web project — let's talk about what you need.
          </p>
          <div className="contact-cta__actions">
            <a href="mailto:rdeboer180@gmail.com" className="contact-cta__btn contact-cta__btn--primary">
              rdeboer180@gmail.com
            </a>
            <a href="https://linkedin.com/in/ryandeboer" className="contact-cta__btn contact-cta__btn--secondary" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
