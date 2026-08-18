import React, { useEffect, useState, lazy } from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import PageShell from './components/PageShell';
import NotFoundPage from './components/NotFoundPage';

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
import { scrollBehavior } from './utils/motion';
import { UnlockProvider, useUnlock } from './context/UnlockContext';
import PasswordModal from './components/PasswordModal';

// Targeted-homepage template. Duplicate homepage-template.tsx per deployment and
// add a route below. See src/data/targetedHomepage.ts for the contract.
import templateContent from './data/homepage-template';

// Secondary routes are code-split — they aren't needed to paint the landing page.
const DesignSystem = lazy(() => import('./components/DesignSystem'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ResumePage = lazy(() => import('./components/ResumePage'));
const HomepageTargeted = lazy(() => import('./components/HomepageTargeted'));
const SitemapPage = lazy(() => import('./components/SitemapPage'));
const NotesPage = lazy(() => import('./components/NotesPage'));
const NotePage = lazy(() => import('./components/NotePage'));

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
        document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function HomeRoute() {
  usePageMeta({
    title: 'Ryan DeBoer | Product Design Engineer · Systems · Front-End',
    description:
      'Ryan DeBoer | Product Design Engineer · Systems · Front-End. Design engineer bridging UX, systems thinking, and real-world shipping. 16+ years in design systems, ecommerce, and high-impact product work.',
    canonical: `${SITE.portfolioUrl}/`,
    ogDescription: 'Product Design Engineer. I bridge the gap between ambitious UX and buildable systems.',
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'website',
  });
  return (
    <PageShell>
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

/**
 * Site-wide unlock chrome: the password prompt, raised on intent. Rendered
 * outside <Routes> so it survives navigation.
 *
 * The standing bar that used to live here is gone. It rendered above the nav on
 * every page, which made "enter the site password" the first line of the site —
 * the worst possible first impression for chrome whose whole job was to be a
 * quiet standing offer. The affordance now lives in the work section
 * (CaseStudyPlayground), beside the locked objects it actually unlocks.
 *
 * Held back until after mount, and that delay is load-bearing: the prerender
 * step strips this chrome out of every static file on purpose, and rendering it
 * during hydration made React find markup the static HTML didn't have — error
 * #418 on all 27 routes, discarding the prerendered tree. Gating on a
 * post-mount flag makes the first client render match the stripped markup
 * exactly, and the chrome appears a frame later — which is also when the unlock
 * state read from storage is actually known.
 */
function UnlockChrome() {
  const { promptOpen, unlock, dismissPrompt, continueLocked, unlocked, resolving } = useUnlock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      {/*
        Unlocking succeeded entirely in pictures: the modal closed, protected
        images resolved in, and 1150ms later the router navigated. A screen
        reader announced none of it — the correct password produced silence,
        then an unexplained new page. This says both halves out loud, and says
        the navigation *before* it happens rather than after.
      */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {unlocked && resolving ? 'Password accepted. Protected work unlocked.' : ''}
      </div>
      {promptOpen && (
        <PasswordModal
          variant="site"
          onUnlock={unlock}
          onDismiss={dismissPrompt}
          onContinue={continueLocked}
        />
      )}
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <UnlockChrome />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<PageShell><AboutPage /></PageShell>} />
        <Route path="/resume" element={<PageShell><ResumePage /></PageShell>} />
        <Route path="/design-system" element={<PageShell><DesignSystem /></PageShell>} />
        {/* Targeted-homepage template preview (unlinked). Add real deployments as
            additional routes rendering <HomepageTargeted content={...} />. */}
        <Route path="/homepage_template" element={<PageShell><HomepageTargeted content={templateContent} /></PageShell>} />
        {/* Renamed 2026-08-07: the old slug named the client in the URL, which
            leaked past the page's own redaction and into the sitemap and OG
            tags. Kept as a redirect so existing links and index entries don't
            break. Client-side, not a 301 — a server rule would be better if the
            host ever allows one. */}
        <Route
          path="/work/tire-rack-winter"
          element={<Navigate to="/work/seasonal-content-system" replace />}
        />
        <Route path="/work/:slug" element={<CaseStudyRoute />} />
        <Route path="/notes" element={<PageShell><NotesPage /></PageShell>} />
        <Route path="/notes/:slug" element={<PageShell><NotePage /></PageShell>} />
        <Route path="/sitemap" element={<PageShell><SitemapPage /></PageShell>} />
        {/* A real 404 instead of a silent redirect home. The redirect
            returned HTTP 200 with the homepage, gave the visitor no signal,
            and hydrated the prerendered shell at the wrong URL — which
            duplicated the entire page with a dead copy on top. */}
        <Route path="*" element={<PageShell><NotFoundPage /></PageShell>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UnlockProvider>
        <AppRoutes />
      </UnlockProvider>
    </BrowserRouter>
  );
}

export default App;
