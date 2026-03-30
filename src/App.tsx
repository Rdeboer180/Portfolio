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
import yahooContent from './data/homepage-yahoo';
import fantasypointsContent from './data/homepage-fantasypoints';
import t1dContent from './data/homepage-t1d';
import insuletContent from './data/homepage-insulet';

function getRoute(hash: string): { page: string; slug?: string; anchor?: string } {
  // Extract anchor fragment from compound hashes like #/homepage_sleeper#about
  const anchorMatch = hash.match(/^#\/[^#]+(#.+)$/);
  const anchor = anchorMatch ? anchorMatch[1].slice(1) : undefined;

  if (hash === '#/design-system') return { page: 'design-system' };
  if (hash === '#/about') return { page: 'about' };
  if (hash === '#/resume') return { page: 'resume' };
  if (hash === '#/homepage_sleeper' || hash.startsWith('#/homepage_sleeper#')) return { page: 'homepage_sleeper', anchor };
  if (hash === '#/homepage_yahoo' || hash.startsWith('#/homepage_yahoo#')) return { page: 'homepage_yahoo', anchor };
  if (hash === '#/homepage_fantasypoints' || hash.startsWith('#/homepage_fantasypoints#')) return { page: 'homepage_fantasypoints', anchor };
  if (hash === '#/homepage_t1d' || hash.startsWith('#/homepage_t1d#')) return { page: 'homepage_t1d', anchor };
  if (hash === '#/homepage_insulet' || hash.startsWith('#/homepage_insulet#')) return { page: 'homepage_insulet', anchor };
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

  if (route.page === 'homepage_yahoo') {
    return <HomepageTargeted content={yahooContent} />;
  }

  if (route.page === 'homepage_fantasypoints') {
    return <HomepageTargeted content={fantasypointsContent} />;
  }

  if (route.page === 'homepage_t1d') {
    return <HomepageTargeted content={t1dContent} />;
  }

  if (route.page === 'homepage_insulet') {
    return <HomepageTargeted content={insuletContent} />;
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
