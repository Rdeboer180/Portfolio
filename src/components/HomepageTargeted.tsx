import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionBadge from './SectionBadge';
import HowIWork from './HowIWork';
import TechnicalAbilities from './TechnicalAbilities';
import SelectedWork from './SelectedWork';
import Testimonials from './Testimonials';
import LayersPanel from './LayersPanel';
import type { TargetedHomepageContent } from '../data/homepage-sleeper';
import { setHomeVariant } from '../utils/homeSession';
import uiCodeSvg from '../assets/ui/ui_code.svg';
import uiPromptSvg from '../assets/ui/ui_prompt.svg';

type HeroPhase = 'typing' | 'looping';

/* ─── Shared Icons ─── */

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12,1C5.93,1,1,5.93,1,12s4.93,11,11,11,11-4.93,11-11S18.07,1,12,1ZM12,21.5c-5.25,0-9.5-4.25-9.5-9.5S6.75,2.5,12,2.5s9.5,4.25,9.5,9.5-4.25,9.5-9.5,9.5Z" />
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12,4.2l-3.8,9.6c-.3.7-.1,1.2.1,1.6.4.7,1.2,1.3,2.2,1.7h3c1-.4,1.8-1,2.2-1.7.2-.4.4-.9.1-1.6L12,4.2Z" fill="#fff" />
    <line x1="12" y1="4.8" x2="12" y2="11.5" stroke="#fff" strokeWidth="0.5" />
    <circle cx="12" cy="12" r="0.7" />
    <rect x="10.2" y="17.3" width="3.6" height="1.4" rx="0.2" fill="#fff" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 449.81 688.24" fill="currentColor" stroke="none">
    <path d="M252.1,416.74l-27.21-55.13-27.17,55.13c-1.9,3.83-5.58,6.47-9.81,7.1l-60.82,8.85,44.01,42.9c3.09,2.98,4.46,7.29,3.75,11.52l-10.41,60.56,54.42-28.59c1.89-1,3.98-1.52,6.02-1.52s4.16.52,6.06,1.52l54.42,28.59-10.41-60.56c-.71-4.24.67-8.55,3.76-11.52l44.01-42.9-60.82-8.85c-4.24-.63-7.92-3.27-9.81-7.1Z" opacity="0.35" />
    <path d="M421.1,353.59c-7.9-14.07-17.33-27.34-28.14-39.52-5.73-6.38-11.82-12.55-18.27-18.27-12.11-10.8-25.45-20.45-39.95-28.5-.29-.22-.51-.36-.8-.51-7.03-3.99-14.5-7.69-22.26-10.88-16.9-7.11-34.59-12.11-52.43-14.79-9.21-1.45-18.64-2.25-28.14-2.54-2.03-.07-4.14-.15-6.24-.15-18.34,0-36.26,2.17-53.73,6.53-11.24,2.68-22.26,6.38-33,10.88-1.38.58-2.83,1.23-4.21,1.88-6.24,2.76-12.4,5.8-18.13,8.99C44.38,306.52,0,381.87,0,463.38c0,53.88,19.07,103.41,50.76,142.2,9.57,11.67,20.3,22.41,31.98,31.91,38.79,31.69,88.25,50.76,142.13,50.76,91.66,0,170.7-55.11,205.66-133.94,5.36-11.89,9.65-24.29,12.76-37.2,4.28-17.19,6.53-35.24,6.53-53.73,0-39.09-10.23-76.8-28.72-109.79ZM334.08,457.86l-32.34,31.54,13.71,79.84c.87,4.86-1.16,9.86-5.15,12.76-2.32,1.59-4.93,2.46-7.61,2.46-2.1,0-4.21-.51-6.09-1.52l-71.72-37.64-71.64,37.64c-4.42,2.32-9.65,1.96-13.7-.94-3.99-2.9-6.02-7.9-5.22-12.76l13.78-79.84-58.01-56.49c-3.55-3.48-4.86-8.63-3.34-13.34,1.52-4.71,5.66-8.12,10.52-8.85l80.2-11.67,32.35-65.48,3.48-7.11c2.17-4.42,6.67-7.25,11.6-7.25s9.5,2.83,11.68,7.25l32.99,66.86,2.83,5.73,3.41.51,58.44,8.48,18.35,2.68c4.86.73,8.99,4.14,10.51,8.85,1.53,4.71.22,9.86-3.34,13.34l-.36.29-25.31,24.65Z" />
    <path d="M243.15,216.82c-3.77-.29-7.62-.44-11.32-.58-2.24-.07-4.64-.07-6.96-.07-24.65,0-48.66,3.55-71.86,10.66-7.98,2.39-15.81,5.22-23.5,8.48-4.2,1.81-8.34,3.7-12.4,5.58-.44.22-.8.36-1.23.58l-1.38-3.19-37.56-87.53L18.85,15.45v-.07C15.74,8.05,21.03,0,29.01,0h39.23l.58,1.31,49.82,116.02c0,.07.07.15.07.22l13.85,32.2c2.1,4.86,6.89,7.83,11.96,7.83,1.67,0,3.48-.36,5.15-1.01,6.53-2.83,9.57-10.52,6.74-17.12l-13.92-32.41-24.15-56.13-8.55-20.01-6.24-14.58-2.97-6.89-3.99-9.43h46.19c.73,0,1.38.07,2.1.22,3.55.65,6.6,3.05,8.05,6.45l1.23,2.83,28.28,64.83h-.44l7.83,18.27,7.54,17.55,6.24,14.58,8.55,19.94,2.47,5.8,14.14,33,14.36,33.36Z" opacity="0.65" />
    <path d="M431.25,15.52l-18.71,43.15-6.82,15.66-56.13,130.6-14.21,33.21-1.45,3.34c-3.12-1.52-6.38-3.05-9.65-4.43-1.3-.58-2.61-1.16-3.99-1.74-3.34-1.38-6.67-2.75-10.08-3.99-5.59-2.03-11.24-3.92-16.9-5.51-8.12-2.39-16.25-4.28-24.51-5.73l-14.14-32.92-5.37-12.47-3.19-7.47-6.24-14.57-2.83-6.6,1.89-4.35,14.21-33.21,14.72-34.16h-.15l8.48-19.51,17.55-40.83c.15-.29.36-.51.51-.65l2.9-6.67c1.81-4.06,5.8-6.67,10.15-6.67h47.21l-.22.51-3.84,8.99-38.22,88.91-17.62,41.04c-1.52,3.56-1.3,7.47.22,10.74,1.23,2.61,3.34,4.78,6.09,6.09.15.15.36.22.51.29,1.67.65,3.41,1.01,5.15,1.01,5.07,0,9.86-2.97,11.96-7.83l17.62-41.04,37.93-88.4.22-.44,8.48-19.87h38.29c2.18,0,4.14.58,5.8,1.67,1.52.87,2.75,2.18,3.63,3.63,1.81,2.9,2.25,6.67.72,10.23Z" opacity="0.65" />
  </svg>
);

const FootballIcon = () => (
  <svg viewBox="0 0 800 600.7" fill="currentColor" stroke="none">
    <path d="M271.16,328.9c-2.27-10.86-4.37-21.33-6.68-31.75-.54-2.45-1.5-4.92-2.78-7.07-2.16-3.63-5.26-6.46-9.79-6.29-4.67,.17-7.81,3.16-9.72,7.14-3.96,8.23-3.58,17.03-2.73,25.79,.61,6.29,1.61,12.53,2.42,18.6-61.12,17.53-121.96,34.98-183.98,52.77-.31-6.15-1.41-12.3-.81-18.27,3.56-35.21,14.24-68.42,31.04-99.39,50.62-93.34,128.1-154.11,228.63-186.29,26.9-8.61,54.61-13.26,82.78-15.66,25.57-2.18,51.05-1.83,76.44,1.25,78.28,9.51,147.93,39.38,208.9,89.43,28.42,23.33,53.58,49.72,74.54,80,5.32,7.68,7.73,14.82,7.48,21.05-45.71,2.1-91.4,4.2-137.68,6.32-1.09-4.48-1.98-9.81-3.69-14.85-2.5-7.38-5.42-14.63-8.54-21.78-1.05-2.41-3.06-4.48-4.93-6.42-4.04-4.2-8.27-5.25-12.12-3.32-4.2,2.11-6.59,6.84-5.64,12.3,1.63,9.35,3.59,18.64,5.36,27.97,.56,2.95,.98,5.92,1.54,9.39-13.35,1.41-26.45,2.79-39.72,4.19-1.69-7.27-3.06-14.18-4.96-20.94-1.05-3.71-2.63-7.4-4.64-10.68-2.11-3.44-5.29-6.01-9.85-4.7-4.69,1.35-6.77,5.06-7.02,9.53-.16,2.94,.63,5.97,1.26,8.9,1.45,6.73,3.07,13.42,4.73,20.6-9.09,1.29-17.63,2.49-26.04,3.68-1.93-7.59-3.52-14.78-5.65-21.8-1.07-3.54-2.56-7.28-4.95-9.97-1.81-2.03-5.63-3.88-8.02-3.35-2.64,.58-6.02,3.62-6.66,6.19-.99,4-.4,8.59,.34,12.79,1.11,6.32,2.92,12.51,4.55,19.25-8.95,1.54-17.19,2.96-25.71,4.42-1.64-6.39-3.05-12.68-4.9-18.83-1.16-3.86-2.61-7.73-4.59-11.22-2.65-4.67-6.55-6.12-10.6-4.8-3.74,1.22-6.65,5.31-6.35,10.01,.24,3.73,1.19,7.42,2.04,11.09,1.28,5.54,2.74,11.04,4.24,16.98-8.83,1.69-17.32,3.31-25.62,4.9-2.38-8.34-4.61-16.59-7.13-24.75-.74-2.4-2.1-4.67-3.51-6.77-2.17-3.24-5.54-4.28-9.16-3.35-3.62,.93-6.26,3.57-6.33,7.37-.07,4.31,.41,8.7,1.25,12.93,1.19,6.01,2.92,11.91,4.52,18.24-9.11,1.9-17.71,3.7-26.37,5.51-1.95-7.31-3.63-14.47-5.82-21.48-1.1-3.54-2.9-6.93-4.79-10.14-2.11-3.6-5.77-4.35-9.52-3.42-3.89,.96-6.32,3.9-6.42,7.83-.1,3.86,.41,7.81,1.24,11.59,1.44,6.57,3.33,13.05,5.09,19.8-8.96,2.01-17.42,3.91-26.18,5.88-1.59-6.12-2.89-12.29-4.85-18.25-1.44-4.38-3.46-8.65-5.77-12.66-1.72-2.98-4.66-4.69-8.43-3.91-4.16,.86-7.01,3.5-7.33,7.55-.31,3.96,.22,8.1,1.06,12.02,1.39,6.45,3.32,12.78,5.12,19.49-13,3.16-25.65,6.24-38.62,9.39Z" />
    <path d="M62.26,400.02c9.08-1.93,17.74-3.76,26.39-5.61,39.14-8.33,78.28-16.66,117.41-25.01,12.65-2.7,25.32-5.34,37.93-8.23,2.97-.68,3.46,.53,4.22,2.93,2.55,8.02,4.86,16.2,8.36,23.81,2.26,4.93,6.11,9.28,9.86,13.32,2.87,3.09,6.94,4.32,11.2,2.29,4.31-2.05,6.51-5.81,5.85-10.29-1.25-8.46-3.17-16.82-4.9-25.21-.88-4.26-1.96-8.48-3.07-13.21,12.78-2.65,25.37-5.27,38.73-8.04,.97,5.84,1.88,11.4,2.81,16.96,.64,3.86,1.04,7.79,2.01,11.57,1.39,5.42,5.37,8.54,9.83,8.26,4.42-.28,8.17-3.93,8.06-9.8-.19-9.44-1.43-18.87-2.23-28.3-.08-.88-.22-1.76-.39-3.09,8.65-1.77,17.13-3.51,26.38-5.4,.9,5.64,1.75,11.08,2.62,16.51,.62,3.87,1.01,7.8,1.98,11.58,1.36,5.29,5.24,8.55,9.36,8.45,4.42-.11,8.47-3.49,8.65-9.37,.26-8.37-.82-16.77-1.39-25.16-.13-1.92-.51-3.83-.82-6.05,8.64-1.67,17.01-3.28,26.11-5.04,.83,5.8,1.56,11.25,2.4,16.68,.57,3.72,1,7.49,1.97,11.11,1.49,5.53,5.65,8.84,9.83,8.35,4.32-.51,8.04-4.4,8.09-10.03,.07-7.66-.73-15.33-1.23-22.99-.13-2.08-.5-4.15-.82-6.7,8.52-1.49,16.74-2.93,25.85-4.52,.87,5.83,1.63,11.55,2.6,17.24,.68,3.99,1.25,8.07,2.6,11.85,1.37,3.83,4.05,6.82,8.77,6.46,4.46-.34,7.24-3.43,7.5-7.26,.51-7.6,.07-15.28-.19-22.91-.09-2.69-.8-5.36-1.35-8.86,8.35-1.47,16.67-2.93,25.67-4.51,.8,6.01,1.45,11.79,2.37,17.53,.66,4.14,1.34,8.34,2.63,12.31,1.26,3.87,4.39,6.39,8.57,6.18,4.2-.21,7.26-3,7.74-7.07,.69-5.78,.72-11.68,.54-17.52-.15-4.8-1.02-9.57-1.62-14.75,8.35-1.34,16.47-2.64,25.25-4.05,.76,6.82,1.24,13.38,2.31,19.84,.65,3.93,1.5,8.13,3.51,11.46,3.65,6.06,10.87,5.54,14.03-.83,1.36-2.74,2.22-6.05,2.2-9.09-.04-6.32-.82-12.64-1.29-18.96-.13-1.76-.22-3.52-.35-5.54,13.04-1.8,25.69-3.54,39-5.38,.92,9.81,1.64,19.24,2.78,28.62,.44,3.67,1.22,7.54,2.91,10.77,3.47,6.63,10.96,7.47,16.33,2.25,4.84-4.69,6.7-10.83,6.92-17.21,.28-8.58-.28-17.18-.48-25.78-.02-.72,0-1.45,0-2.87,44.55-4.95,88.99-9.89,134.78-14.97-1.8,7.69-2.96,14.46-4.99,20.96-11.64,37.21-30.04,70.97-53.5,101.93-45.07,59.47-102.06,103.86-170.68,133.17-32.23,13.76-65.72,23.01-100.5,27.77-28.13,3.85-56.33,4.73-84.55,2.39-62.87-5.21-121.62-23.87-176.2-55.52-32.06-18.59-61.28-40.91-86.27-68.32-9.3-10.2-17.04-21.82-25.35-32.89-1.22-1.62-1.69-3.79-2.71-6.19Z" opacity="0.6" />
  </svg>
);

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

/* ─── Section Components (driven by content prop) ─── */

const TargetedHero: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { hero, meta } = content;
  const roles = hero.roles;
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<number>(0);
  const isFirstRunRef = useRef(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<HeroPhase>('typing');

  const [showBBox, setShowBBox] = useState(false);
  const [headlineScale, setHeadlineScale] = useState(1);
  const [isStretching, setIsStretching] = useState(false);

  // Highlight animation for the hero body
  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const highlights = section.querySelectorAll('.about__highlight');
    if (highlights.length === 0) return;

    const startTimer = setTimeout(() => {
      highlights.forEach((el) => {
        el.classList.add('about__highlight--active');
        setTimeout(() => {
          el.classList.add('about__highlight--bold');
          el.classList.remove('about__highlight--active');
        }, 1000);
      });
    }, 1800);

    return () => clearTimeout(startTimer);
  }, []);

  // ===== TYPING PHASE (first load) =====
  useEffect(() => {
    if (phase !== 'typing') return;
    const target = roles[0];
    if (displayText.length === target.length) {
      const t1 = window.setTimeout(() => setShowBBox(true), 400);
      const t2 = window.setTimeout(() => {
        setShowBBox(false);
        setPhase('looping');
      }, 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    const id = setTimeout(() => {
      setDisplayText(target.substring(0, displayText.length + 1));
    }, 80);
    return () => clearTimeout(id);
  }, [displayText, phase, roles]);

  // ===== LOOPING SEQUENCE =====
  useEffect(() => {
    if (phase !== 'looping') return;

    const advance = () => {
      setActiveIndex(prev => {
        const next = (prev + 1) % roles.length;
        setDisplayText(roles[next]);

        if (next === 2 && isFirstRunRef.current) {
          setHeadlineScale(0.8);
          setShowBBox(true);
          const t1 = window.setTimeout(() => {
            setIsStretching(true);
            setHeadlineScale(1);
          }, 300);
          const t2 = window.setTimeout(() => {
            setShowBBox(false);
            setIsStretching(false);
          }, 2500);
          loopRef.current = window.setTimeout(advance, 4000);
          (loopRef as any)._subs = [t1, t2];
        } else {
          setHeadlineScale(1);
          setIsStretching(false);
          setShowBBox(true);
          const t1 = window.setTimeout(() => setShowBBox(false), 500);
          loopRef.current = window.setTimeout(advance, 3000);
          (loopRef as any)._subs = [t1];
        }

        if (next === 0 && prev === 2) {
          isFirstRunRef.current = false;
        }
        return next;
      });
    };

    loopRef.current = window.setTimeout(advance, 2500);

    return () => {
      window.clearTimeout(loopRef.current);
      const subs = (loopRef as any)._subs;
      if (subs) subs.forEach((id: number) => window.clearTimeout(id));
    };
  }, [phase, roles]);

  // ===== INTERACTIVE LAYER CLICKS =====
  const handleLayerClick = useCallback((index: number) => {
    if (phase !== 'looping' || index === activeIndex) return;

    window.clearTimeout(loopRef.current);
    const subs = (loopRef as any)._subs;
    if (subs) subs.forEach((id: number) => window.clearTimeout(id));

    setActiveIndex(index);
    setDisplayText(roles[index]);
    setHeadlineScale(1);
    setIsStretching(false);
    setShowBBox(true);

    const t1 = window.setTimeout(() => setShowBBox(false), 500);

    loopRef.current = window.setTimeout(() => {
      const advanceFromClick = () => {
        setActiveIndex(prev => {
          const next = (prev + 1) % roles.length;
          setDisplayText(roles[next]);
          setHeadlineScale(1);
          setIsStretching(false);
          setShowBBox(true);
          const hide = window.setTimeout(() => setShowBBox(false), 500);
          loopRef.current = window.setTimeout(advanceFromClick, 5000);
          (loopRef as any)._subs = [hide];
          return next;
        });
      };
      loopRef.current = window.setTimeout(advanceFromClick, 5000);
    }, 0);

    (loopRef as any)._subs = [t1];
  }, [phase, activeIndex, roles]);

  useEffect(() => {
    return () => {
      window.clearTimeout(loopRef.current);
      const subs = (loopRef as any)._subs;
      if (subs) subs.forEach((id: number) => window.clearTimeout(id));
    };
  }, []);

  const slug = meta.slug;

  return (
    <section className="hero-hybrid" ref={heroRef}>
      <nav className="hero-hybrid__nav">
        <div className="hero-hybrid__nav-logo">Ryan DeBoer</div>
        <div className="hero-hybrid__nav-links">
          <a href={`#/${slug}#about`}>About Me</a>
          <a href={`#/${slug}#projects`}>My Work</a>
          <a href="#/resume">Resume</a>
          <a href="mailto:rdeboer180@gmail.com" className="hero-hybrid__nav-cta">Get in touch</a>
        </div>
      </nav>

      <div className="hero-hybrid__content">
        <div className="hero-hybrid__grid">
          <div className="hero-hybrid__text">
            <p className="hero-hybrid__eyebrow hero-hybrid__reveal hero-hybrid__reveal--1">
              Senior Web Designer by title. <span>Systems thinker with front-end depth. I operate as a</span>
            </p>

            <div
              className="hero-hybrid__typed-wrap hero-hybrid__reveal hero-hybrid__reveal--2"
              ref={headlineRef}
            >
              <div
                className={`hero-hybrid__bbox${showBBox ? ' hero-hybrid__bbox--visible' : ''}`}
                aria-hidden="true"
              >
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tl" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tr" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bl" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--br" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--tm" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--bm" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--ml" />
                <span className="hero-hybrid__bbox-handle hero-hybrid__bbox-handle--mr" />
              </div>

              <h1 className="hero-hybrid__h1-sr-only">
                {roles.join(', ')}
              </h1>

              <span
                className={`hero-hybrid__typed${isStretching ? ' hero-hybrid__typed--stretching' : ''}`}
                style={headlineScale !== 1 ? { transform: `scaleX(${headlineScale})`, transformOrigin: 'left center' } : undefined}
                aria-hidden="true"
              >
                {displayText}
                <span className="hero-hybrid__cursor" />
              </span>
            </div>

            <p className="hero-hybrid__body hero-hybrid__reveal hero-hybrid__reveal--4">{hero.body}</p>
            <div className="hero-hybrid__actions hero-hybrid__reveal hero-hybrid__reveal--5">
              <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--lg">
                <img src="/images/hero/email-icon.svg" alt="" className="hero-hybrid__btn-icon" />
                rdeboer180@gmail.com
              </a>
              <a href={`#/${slug}#projects`} className="btn btn--secondary btn--lg">
                View my work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-hybrid__visual">
            <div className="hero-hybrid__image-container">
              <div className="hero-hybrid__image-wrapper">
                <div className="hero-hybrid__orange-bg">
                  <div className="hero-hybrid__orange-bg-inner">
                    <img src="/images/hero/orange-background.svg" alt="" className="hero-hybrid__orange-bg-img" />
                  </div>
                </div>
                <div className="hero-hybrid__border-ring" />
                <div className="hero-hybrid__profile-circle">
                  <img src="/images/hero/ryan-deboer.png" alt="Ryan Deboer" className="hero-hybrid__profile-img" />
                </div>
              </div>

              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--code">
                <img src={uiCodeSvg} alt="" />
              </div>
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--prompt">
                <img src={uiPromptSvg} alt="" />
              </div>
              <div className="hero-hybrid__ui-element hero-hybrid__ui-element--layers">
                <LayersPanel
                  ref={panelRef}
                  activeIndex={activeIndex}
                  onLayerClick={handleLayerClick}
                  roles={roles}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-hybrid__proof-band">
        <div className="hero-hybrid__proof-inner">
          <div className="hero-hybrid__proof-left">
            <p className="hero-hybrid__proof-label">Core Proficiencies</p>
            <div className="hero-hybrid__proof-icons">
              {proficiencies.map((icon, i) => (
                <div key={i} className="hero-hybrid__proof-icon" title={icon.alt}>
                  <img src={icon.src} alt={icon.alt} />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-hybrid__proof-divider" />
          <div className="hero-hybrid__proof-right">
            <p className="hero-hybrid__proof-text">Reviews from those I have worked with</p>
            <a href={`#/${slug}#testimonials`} className="hero-hybrid__proof-cta">
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

const TargetedAbout: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { about, meta } = content;
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const highlights = section.querySelectorAll('.about__highlight');
    if (highlights.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sweepDuration = 600;
            const holdDuration = 400;
            const cycleTime = sweepDuration + holdDuration + 500 + 200;
            highlights.forEach((el, i) => {
              const baseDelay = i * cycleTime;
              setTimeout(() => {
                el.classList.add('about__highlight--active');
              }, baseDelay);
              setTimeout(() => {
                el.classList.add('about__highlight--bold');
                el.classList.remove('about__highlight--active');
              }, baseDelay + sweepDuration + holdDuration);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about about--wide" ref={sectionRef}>
      <div className="about__container">
        <div className="about__content">
          <div className="about__text">
            <SectionBadge icon={<UserIcon />} label="About Me" />
            <h2 className="about__title">{about.title}</h2>
            {about.paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                {i === 1 && about.titleImage && (
                  <motion.img
                    src={about.titleImage}
                    alt="Grandville Gremlins"
                    className="about__inline-image"
                    initial={{ scale: 0, opacity: 0, rotate: -15 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.3 }}
                  />
                )}
                <p className="about__body">{p}</p>
              </React.Fragment>
            ))}
            <p className="about__body">
              There's more to how I think&mdash;and how I help teams do better work&mdash;than what fits here.
            </p>
            <div className="about__cta-links">
              <a href="#/about" className="about__read-more">Go deeper on my approach &rarr;</a>
              <span className="about__link-separator">or</span>
              <a href={`#/${meta.slug}#testimonials`} className="about__read-more">see what it's like to work with me &rarr;</a>
            </div>
          </div>
        </div>
        <div className="about__stats">
          {about.stats.map((stat) => (
            <div key={stat.label} className="about__stat">
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetedWhyCompany: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { whyCompany } = content;
  return (
    <section id="why-company" className="skills">
      <div className="skills__container">
        <div className="skills__header">
          <SectionBadge icon={
            content.meta.company === 'Dexcom'
              ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" /><text x="12" y="13" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="inherit" letterSpacing="-0.02em">T1D</text></svg>
              : content.meta.company === 'Insulet'
              ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" /><text x="12" y="13" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="7.5" fontWeight="800" fontFamily="inherit" letterSpacing="-0.02em">Pod</text></svg>
              : <FootballIcon />
          } label={whyCompany.badgeLabel} />
          <h2 className="skills__title">{whyCompany.title}</h2>
          <p className="skills__subtitle">{whyCompany.subtitle}</p>
          <p className="skills__intro">{whyCompany.intro}</p>
        </div>
        <div className="skills__grid">
          {whyCompany.points.map((point) => (
            <div key={point.title} className="skills__card">
              <h3 className="skills__card-title">{point.title}</h3>
              <p className="skills__card-body">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetedSkills: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { skills } = content;
  return (
    <section id="skills" className="skills">
      <div className="skills__container">
        <div className="skills__header">
          <SectionBadge icon={<LayersIcon />} label="Strengths" />
          <h2 className="skills__title">{skills.title}</h2>
          <p className="skills__subtitle">{skills.subtitle}</p>
          <p className="skills__intro">{skills.intro}</p>
        </div>
        <div className="skills__grid">
          {skills.categories.map((cat) => (
            <div key={cat.title} className="skills__card">
              <h3 className="skills__card-title">{cat.title}</h3>
              <ul className="skills__card-list">
                {cat.skills.map((skill) => (
                  <li key={skill} className="skills__card-item">{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetedFAQ: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="faq">
      <div className="faq__container">
        <div className="faq__left">
          <span className="faq__eyebrow">FAQ</span>
          <h2 className="faq__title">{faq.title}</h2>
          <p className="faq__intro">{faq.intro}</p>
        </div>
        <div className="faq__right">
          {faq.items.map((item, i) => (
            <div key={i} className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}>
              <button className="faq__question" onClick={() => toggle(i)}>
                <span className="faq__question-text">{item.question}</span>
                <span className="faq__toggle">{openIndex === i ? '\u00d7' : '+'}</span>
              </button>
              <div className="faq__answer-wrapper">
                {typeof item.answer === 'string' ? (
                  <p className="faq__answer">{item.answer}</p>
                ) : (
                  <div className="faq__answer">{item.answer}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetedFooter: React.FC<{ content: TargetedHomepageContent }> = ({ content }) => {
  const { footer } = content;
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__cta">
            <span className="footer__eyebrow">{footer.eyebrow}</span>
          </div>
          <div className="footer__actions">
            <a href="mailto:rdeboer180@gmail.com" className="btn btn--primary btn--md">
              rdeboer180@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/ryan-deboer-b4a00351" className="btn btn--secondary btn--md" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Ryan De Boer &bull; {footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ─── Page Assembly ─── */

interface HomepageTargetedProps {
  content: TargetedHomepageContent;
}

const HomepageTargeted: React.FC<HomepageTargetedProps> = ({ content }) => {
  useEffect(() => {
    setHomeVariant(content.meta.slug);
  }, [content.meta.slug]);

  return (
    <div className="min-h-screen bg-white">
      <TargetedHero content={content} />
      <TargetedAbout content={content} />
      <SelectedWork />
      <TargetedWhyCompany content={content} />
      <Testimonials />
      <HowIWork />
      <TargetedSkills content={content} />
      <TechnicalAbilities />
      <TargetedFAQ content={content} />
      <TargetedFooter content={content} />
    </div>
  );
};

export default HomepageTargeted;
