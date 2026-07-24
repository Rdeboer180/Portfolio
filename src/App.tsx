import React, { useState, useEffect, lazy } from 'react';
import PageShell from './components/PageShell';

// Home-page sections load in the initial chunk — home is the default route.
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import TechnicalAbilities from './components/TechnicalAbilities';
import CaseStudyPlayground from './components/CaseStudyPlayground';
import Footer from './components/Footer';
import ProcessPlayground from './components/ProcessPlayground';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';

// Targeted-homepage template. Duplicate homepage-template.tsx per deployment and
// add a route branch below. See src/data/targetedHomepage.ts for the contract.
import templateContent from './data/homepage-template';

// Secondary routes are code-split — they aren't needed to paint the landing page.
const DesignSystem = lazy(() => import('./components/DesignSystem'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ResumePage = lazy(() => import('./components/ResumePage'));
const HomepageTargeted = lazy(() => import('./components/HomepageTargeted'));

function getRoute(hash: string): { page: string; slug?: string; anchor?: string } {
  // Extract anchor fragment from compound hashes like #/about#experience
  const anchorMatch = hash.match(/^#\/[^#]+(#.+)$/);
  const anchor = anchorMatch ? anchorMatch[1].slice(1) : undefined;

  if (hash === '#/design-system') return { page: 'design-system' };
  if (hash === '#/about' || hash.startsWith('#/about#')) return { page: 'about', anchor };
  if (hash === '#/resume') return { page: 'resume' };
  if (hash === '#/homepage_template' || hash.startsWith('#/homepage_template#')) return { page: 'homepage_template', anchor };
  if (hash.startsWith('#/work/')) return { page: 'case-study', slug: hash.replace('#/work/', '') };
  return { page: 'home' };
}

function App() {
  const [route, setRoute] = useState(() => getRoute(window.location.hash));

  // Handle anchor scroll on initial load
  useEffect(() => {
    if (route.anchor) {
      requestAnimationFrame(() => {
        document.getElementById(route.anchor!)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const newRoute = getRoute(window.location.hash);
      setRoute(newRoute);
      if (newRoute.anchor) {
        // Scroll to anchor element after render
        requestAnimationFrame(() => {
          document.getElementById(newRoute.anchor!)?.scrollIntoView({ behavior: 'smooth' });
        });
      } else if (newRoute.page !== 'home') {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (route.page === 'design-system') {
    return <PageShell><DesignSystem /></PageShell>;
  }

  if (route.page === 'about') {
    return <PageShell><AboutPage /></PageShell>;
  }

  if (route.page === 'resume') {
    return <PageShell><ResumePage /></PageShell>;
  }

  // Targeted-homepage template preview (unlinked). Add real deployments as
  // additional route branches rendering <HomepageTargeted content={...} />.
  if (route.page === 'homepage_template') {
    return <PageShell><HomepageTargeted content={templateContent} /></PageShell>;
  }

  if (route.page === 'case-study' && route.slug) {
    return <PageShell><CaseStudyPage slug={route.slug} /></PageShell>;
  }

  return (
    <PageShell className="min-h-screen bg-white">
      <Hero />
      <About />
      <CaseStudyPlayground />
      <Skills />
      <Testimonials />
      <ProcessPlayground />
      <TechnicalAbilities />
      <FAQ />
      <Footer />
    </PageShell>
  );
}

export default App;
