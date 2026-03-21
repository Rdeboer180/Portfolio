import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__links">
          <a href="https://linkedin.com/in/ryandeboer" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:rdeboer180@gmail.com">rdeboer180@gmail.com</a>
        </div>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Ryan De Boer
        </p>
      </div>
    </footer>
  );
};

export default Footer;
