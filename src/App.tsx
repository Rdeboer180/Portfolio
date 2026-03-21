import React, { useState, useEffect } from 'react';
import HeroHybrid from './components/HeroHybrid';
import About from './components/About';
import Skills from './components/Skills';
import TechnicalAbilities from './components/TechnicalAbilities';
import SelectedWork from './components/SelectedWork';
import Footer from './components/Footer';
import HowIWork from './components/HowIWork';
import Impact from './components/Impact';
import Testimonials from './components/Testimonials';
import ContactCTA from './components/ContactCTA';
import FAQ from './components/FAQ';
import DesignSystem from './components/DesignSystem';
import CaseStudyPage from './components/CaseStudyPage';

function getRoute(hash: string): { page: string; slug?: string } {
  if (hash === '#/design-system') return { page: 'design-system' };
  if (hash.startsWith('#/work/')) return { page: 'case-study', slug: hash.replace('#/work/', '') };
  return { page: 'home' };
}

function App() {
  const [route, setRoute] = useState(() => getRoute(window.location.hash));

  useEffect(() => {
    const handleHash = () => {
      setRoute(getRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (route.page === 'design-system') {
    return <DesignSystem />;
  }

  if (route.page === 'case-study' && route.slug) {
    return <CaseStudyPage slug={route.slug} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroHybrid />
      <About />
      <HowIWork />
      <Impact />
      <Skills />
      <TechnicalAbilities />
      <SelectedWork />
      <Testimonials />
      <FAQ />
      <ContactCTA />
      <Footer />
    </div>
  );
}

export default App;
