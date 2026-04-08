import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__cta">
            <span className="footer__eyebrow">Get in touch</span>
          </div>
          <div className="footer__actions">
            <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--md">
              rdeboer180@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/ryandeboerdesigns" className="btn btn--secondary btn--md" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Ryan DeBoer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
