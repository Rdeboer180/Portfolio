import React, { useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
import { usePageMeta } from './hooks/usePageMeta';
import { SITE } from './data/site';

// Targeted-homepage template. Duplicate homepage-template.tsx per deployment and
// add a route below. See src/data/targetedHomepage.ts for the contract.
import templateContent from './data/homepage-template';

// Secondary routes are code-split — they aren't needed to paint the landing page.
const DesignSystem = lazy(() => import('./components/DesignSystem'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ResumePage = lazy(() => import('./components/ResumePage'));
const HomepageTargeted = lazy(() => import('./components/HomepageTargeted'));

// Redirect legacy hash URLs (#/work/x, #/about, …) to their real paths, and
// scroll to the anchored section (or top) on every navigation.
function RouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();

  // One-time: an old hash link like #/work/wheelrack lands on "/" — send it home to the path.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.hash && location.hash !== '#main-content') {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function HomeRoute() {
  usePageMeta({
    title: 'Ryan DeBoer | Senior Product Designer · Design Systems · Front-End',
    description:
      'Ryan DeBoer | Senior Product Designer · Design Systems · Front-End. Design engineer bridging UX, systems thinking, and real-world shipping. 16+ years in design systems, ecommerce, and high-impact product work.',
    canonical: `${SITE.portfolioUrl}/`,
    ogDescription: 'Senior Product Designer + Design Engineer. I bridge the gap between ambitious UX and buildable systems.',
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'website',
  });
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

function CaseStudyRoute() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <PageShell>
      <CaseStudyPage slug={slug ?? ''} />
    </PageShell>
  );
}

function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<PageShell><AboutPage /></PageShell>} />
        <Route path="/resume" element={<PageShell><ResumePage /></PageShell>} />
        <Route path="/design-system" element={<PageShell><DesignSystem /></PageShell>} />
        {/* Targeted-homepage template preview (unlinked). Add real deployments as
            additional routes rendering <HomepageTargeted content={...} />. */}
        <Route path="/homepage_template" element={<PageShell><HomepageTargeted content={templateContent} /></PageShell>} />
        <Route path="/work/:slug" element={<CaseStudyRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
