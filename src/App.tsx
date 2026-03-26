import React, { useState, useEffect } from 'react';
import HeroHybrid from './components/HeroHybrid';
import About from './components/About';
import Skills from './components/Skills';
import TechnicalAbilities from './components/TechnicalAbilities';
import SelectedWork from './components/SelectedWork';
import Footer from './components/Footer';
import HowIWork from './components/HowIWork';
import Testimonials from './components/Testimonials';

import FAQ from './components/FAQ';
import DesignSystem from './components/DesignSystem';
import CaseStudyPage from './components/CaseStudyPage';
import AboutPage from './components/AboutPage';
import ResumePage from './components/ResumePage';
import HomepageTargeted from './components/HomepageTargeted';
import sleeperContent from './data/homepage-sleeper';

function getRoute(hash: string): { page: string; slug?: string } {
  if (hash === '#/design-system') return { page: 'design-system' };
  if (hash === '#/about') return { page: 'about' };
  if (hash === '#/resume') return { page: 'resume' };
  if (hash === '#/homepage_sleeper' || hash.startsWith('#/homepage_sleeper#')) return { page: 'homepage_sleeper' };
  if (hash.startsWith('#/work/')) return { page: 'case-study', slug: hash.replace('#/work/', '') };
  return { page: 'home' };
}

function App() {
  const [route, setRoute] = useState(() => getRoute(window.location.hash));

  useEffect(() => {
    const handleHash = () => {
      const newRoute = getRoute(window.location.hash);
      setRoute(newRoute);
      // Only scroll to top for page navigations, not anchor links on home
      if (newRoute.page !== 'home') {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (route.page === 'design-system') {
    return <DesignSystem />;
  }

  if (route.page === 'about') {
    return <AboutPage />;
  }

  if (route.page === 'resume') {
    return <ResumePage />;
  }

  if (route.page === 'homepage_sleeper') {
    return <HomepageTargeted content={sleeperContent} />;
  }

  if (route.page === 'case-study' && route.slug) {
    return <CaseStudyPage slug={route.slug} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroHybrid />
      <About />
      <HowIWork />
      <TechnicalAbilities />
      <Skills />
      <SelectedWork />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
