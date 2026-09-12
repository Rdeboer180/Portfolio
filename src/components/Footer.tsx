import React from 'react';
import { Link } from 'react-router-dom';
import { SITE, EMAIL_HREF } from '../data/site';

const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__cta">
            <span className="footer__eyebrow">Get in touch</span>
            <p className="footer__lead">
              Looking for someone who can connect design and implementation? I am open to remote
              roles in the US. If my work fits what your team needs, I would be glad to talk.
            </p>
          </div>
          <div className="footer__actions">
            <a href={EMAIL_HREF} className="btn btn--primary btn--md">
              Email me
            </a>
            <a href={SITE.linkedinUrl} className="btn btn--secondary btn--md" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Ryan DeBoer
          </p>
          <div className="footer__meta-links">
            <Link to="/notes" className="footer__site-index">Notes</Link>
            <Link to="/talent-tree/" className="footer__site-index">Talent tree</Link>
            <Link to="/design-system" className="footer__site-index">Design system</Link>
            <Link to="/sitemap" className="footer__site-index">Site index</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
