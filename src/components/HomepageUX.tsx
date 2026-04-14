import React from 'react';
import HeroUX from './HeroUX';
import AboutUX from './AboutUX';
import CapabilitiesUX from './CapabilitiesUX';
import SelectedWork from './SelectedWork';
import Testimonials from './Testimonials';
import Footer from './Footer';
import '../styles/styles.scss';

const HomepageUX: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroUX />
      <AboutUX />
      <CapabilitiesUX />
      <SelectedWork />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomepageUX;
