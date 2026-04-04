import React, { useState, useEffect } from 'react';
import '../styles/styles.scss';

const proficiencies = [
  { src: '/images/proficiencies/figma.svg', alt: 'Figma', bg: '#f3e8ff' },
  { src: '/images/proficiencies/scss.png', alt: 'SCSS' },
  { src: '/images/proficiencies/chakra.png', alt: 'Chakra UI' },
  { src: '/images/proficiencies/illustrator.png', alt: 'Illustrator' },
  { src: '/images/proficiencies/photoshop.png', alt: 'Photoshop' },
  { src: '/images/proficiencies/aem.png', alt: 'AEM' },
  { src: '/images/proficiencies/wordpress.png', alt: 'WordPress' },
  { src: '/images/proficiencies/css3.png', alt: 'CSS3' },
  { src: '/images/proficiencies/html5.png', alt: 'HTML5', bg: '#dcfce7' },
  { src: '/images/proficiencies/github.png', alt: 'GitHub' },
  { src: '/images/proficiencies/vscode.png', alt: 'VS Code' },
];

const roles = [
  'Design Strategist',
  'Product Designer',
  'UX Engineer',
];

const HeroHybrid: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 4000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
        return;
      }
      const timer = setTimeout(() => {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
      }, 40);
      return () => clearTimeout(timer);
    }

    if (displayText.length === currentRole.length) {
      setIsPaused(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(currentRole.substring(0, displayText.length + 1));
    }, 80);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isPaused, roleIndex]);

  return (
    <section className="hero-hybrid">
      {/* Minimal fixed nav */}
      <nav className="hero-hybrid__nav">
        <div className="hero-hybrid__nav-logo">Ryan DeBoer</div>
        <div className="hero-hybrid__nav-links">
          <a href="#/about">About Me</a>
          <a href="#/work/heatherwood">My Work</a>
          <a href="#/resume">Resume</a>
          <a href="mailto:rdeboer180@gmail.com" className="hero-hybrid__nav-cta">Get in touch</a>
        </div>
      </nav>

      <div className="hero-hybrid__content">
        <div className="hero-hybrid__grid">
          {/* Left: Clean animated text */}
          <div className="hero-hybrid__text">
            <p className="hero-hybrid__eyebrow hero-hybrid__reveal hero-hybrid__reveal--1">
              Senior Web Designer by title I think in systems and build in code. I operate as a
            </p>

            <div className="hero-hybrid__typed-wrap hero-hybrid__reveal hero-hybrid__reveal--2">
              <span className="hero-hybrid__typed">
                {displayText}
                <span className="hero-hybrid__cursor" />
              </span>
            </div>

            <p className="hero-hybrid__body hero-hybrid__reveal hero-hybrid__reveal--4">
              I design and build high-fidelity product experiences with a systems-first approach&mdash;combining UX, front-end coding, and design systems to turn complex ideas into scalable, production-ready solutions.
            </p>

            <div className="hero-hybrid__actions hero-hybrid__reveal hero-hybrid__reveal--5">
              <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero-hybrid__btn-icon" />
                rdeboer180@gmail.com
              </a>
              <a href="#projects" className="btn btn--secondary btn--lg">
                View my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Profile image with UI overlay elements */}
          <div className="hero-hybrid__visual">
            <div className="hero-hybrid__image-container">
              <div className="hero-hybrid__image-wrapper">
                <div className="hero-hybrid__orange-bg">
                  <div className="hero-hybrid__orange-bg-inner">
                    <img
                      src="/images/hero/orange-background.svg"
                      alt=""
                      className="hero-hybrid__orange-bg-img"
                    />
                  </div>
                </div>
                <div className="hero-hybrid__border-ring" />
                <div className="hero-hybrid__profile-circle">
                  <img
                    src="/images/hero/ryan-deboer.png"
                    alt="Ryan Deboer"
                    className="hero-hybrid__profile-img"
                  />
                </div>
              </div>

              {/* Floating UI toolkit overlays */}
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--code">
                <img src="/images/hero/ui_elements/ui_code.png" alt="" />
              </div>
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--prompt">
                <img src="/images/hero/ui_elements/ui_prompt.png?v=2" alt="" />
              </div>
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--illustrator">
                <img src="/images/hero/ui_elements/ui_illustrator.avif" alt="" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Social proof band — full-width separator */}
      <div className="hero-hybrid__proof-band">
        <div className="hero-hybrid__proof-inner">
          <div className="hero-hybrid__proof-left">
            <p className="hero-hybrid__proof-label">Core Proficiencies</p>
            <div className="hero-hybrid__proof-icons">
              {proficiencies.map((icon, i) => (
                <div
                  key={i}
                  className="hero-hybrid__proof-icon"
                  title={icon.alt}
                >
                  <img src={icon.src} alt={icon.alt} />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-hybrid__proof-divider" />
          <div className="hero-hybrid__proof-right">
            <p className="hero-hybrid__proof-text">
              The best signal of how I work isn't what I say—it's what the people I've worked with say.
            </p>
            <a href="#testimonials" className="hero-hybrid__proof-cta">
              View Testimonials
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-hybrid__proof-angle" />
      </div>
    </section>
  );
};

export default HeroHybrid;
