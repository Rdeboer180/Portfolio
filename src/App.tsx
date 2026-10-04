import React, { useEffect, useState, useRef, lazy } from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import PageShell from './components/PageShell';
import { isPanelRoute } from './utils/panelRoutes';
import { usePanelNavigation } from './hooks/usePanelNavigation';
import ProjectPanel from './components/ProjectPanel';
import NotFoundPage from './components/NotFoundPage';

// Home-page sections load in the initial chunk — home is the default route.
import Hero from './components/Hero';
import About from './components/About';
import SelectedWriting from './components/SelectedWriting';
import SkillMastery from './components/SkillMastery';
import CaseStudyPlayground from './components/CaseStudyPlayground';
import SystemsInPractice from './components/SystemsInPractice';
import Footer from './components/Footer';
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
const TalentAtlasPage = lazy(() => import('./components/TalentAtlasPage'));
const NotesPage = lazy(() => import('./components/NotesPage'));
const NotePage = lazy(() => import('./components/NotePage'));

// Redirect legacy hash URLs (#/work/x, #/about, …) to their real paths, and
// scroll to the anchored section (or top) on every navigation.
function RouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPanelBackground = useRef<string | undefined>(undefined);
  const previousPanelHasReturnScroll = useRef(false);

  // One-time: an old hash link like #/work/wheelrack lands on "/" — send it home to the path.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const returningTo = previousPanelBackground.current;
    const restoreScroll = previousPanelHasReturnScroll.current;
    const panelBackground = isPanelRoute(location.pathname) ? (location.state?.backgroundLocation?.pathname || '/') : undefined;
    previousPanelBackground.current = panelBackground;
    previousPanelHasReturnScroll.current = location.state?.returnScroll !== undefined;
    if (panelBackground || (restoreScroll && returningTo === location.pathname)) return;
    if (location.hash && location.hash !== '#main-content') {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, location.state?.backgroundLocation?.pathname, location.state?.returnScroll]);

  return null;
}

function HomeRoute() {
  const homeLocation = useLocation();
  useEffect(() => {
    const grounds = document.querySelectorAll<HTMLElement>('.ink-ground');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.inkSettled = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    grounds.forEach(el => observer.observe(el));
    const settle = () => {
      if (motion.matches) {
        observer.disconnect();
        grounds.forEach(el => { el.dataset.inkSettled = 'true'; });
      }
    };
    settle();
    motion.addEventListener('change', settle);
    return () => { observer.disconnect(); motion.removeEventListener('change', settle); };
  }, []);
  usePageMeta({
    title: 'Ryan DeBoer | Product Designer · Design Systems · Design Engineering',
    description:
      'Product designer with a systems focus and deep roots in visual craft. Clear interfaces, shared components, and close collaboration with engineering. South Bend, Indiana · Remote US.',
    canonical: `${SITE.portfolioUrl}/`,
    ogDescription: 'Product designer with a systems focus. Enterprise interfaces, shared components, and PlayDraft, a personal product on the App Store.',
    ogImage: `${SITE.portfolioUrl}/images/hero/ryan-deboer-og-2026.jpg`,
    ogType: 'website',
  }, homeLocation.key);
  return (
    <PageShell>
      <Hero />
      <CaseStudyPlayground />
      <SelectedWriting />
      <About compact />
      <SystemsInPractice />
      <Testimonials />
      <SkillMastery />
      <FAQ />
      <Footer />
    </PageShell>
  );
}

function PanelCaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  return <CaseStudyPage slug={slug ?? ''} />;
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
 * The modal is held back until after mount, and that delay is load-bearing:
 * the prerender step strips this chrome out of every static file on purpose,
 * and rendering it during hydration made React find markup the static HTML
 * didn't have — error #418 on all 27 routes, discarding the prerendered tree.
 * Gating on a post-mount flag makes the first client render match the stripped
 * markup exactly, and the chrome appears a frame later — which is also when the
 * unlock state read from storage is actually known.
 *
 * The live region below is the exception, and for the same reason inverted:
 * the prerender does *not* strip it, so it has to render on both sides. See
 * the note on it.
 */
function UnlockChrome() {
  const { promptOpen, unlock, dismissPrompt, continueLocked, unlocked, resolving } = useUnlock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/*
        Unlocking succeeded entirely in pictures: the modal closed, protected
        images resolved in, and 1150ms later the router navigated. A screen
        reader announced none of it — the correct password produced silence,
        then an unexplained new page. This says both halves out loud, and says
        the navigation *before* it happens rather than after.

        Rendered unconditionally, outside the `mounted` gate below, for two
        reasons that agree. A live region has to be in the document *before* its
        content changes or screen readers routinely miss the first
        announcement — inserting the region and its text in the same commit is
        the classic way to announce nothing. And the prerender strips the
        modal, not this: an empty region in the static HTML that the client's
        first render omitted was a structural difference at the very top of
        #root, which is React #418 on every prerendered route, hero or no hero.
        Rendering it on both sides fixes the announcement and the hydration in
        one move. It stays empty until an unlock actually resolves.
      */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {mounted && unlocked && resolving ? 'Password accepted. Protected work unlocked.' : ''}
      </div>
      {mounted && promptOpen && (
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
  const location = useLocation();
  usePanelNavigation();
  const [panelsEnabled, setPanelsEnabled] = useState(false);
  useEffect(() => {
    // Keep static articles and first hydration identical at every screen size.
    if (!(window as Window & { __PORTFOLIO_PRERENDER__?: boolean }).__PORTFOLIO_PRERENDER__) setPanelsEnabled(true);
  }, []);
  const background = panelsEnabled && isPanelRoute(location.pathname) ? (location.state?.backgroundLocation || { pathname: location.pathname.startsWith('/notes/') ? '/notes' : '/', search: '', hash: '', state: null, key: 'reading-background' }) : undefined;
  return (
    <>
      <RouteEffects />
      {!background && <UnlockChrome />}
      <Routes location={background || location}>
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
        <Route path="/talent-tree" element={<PageShell><TalentAtlasPage /></PageShell>} />
        <Route path="/talent-tree/build" element={<PageShell><TalentAtlasPage own /></PageShell>} />
        <Route path="/talent-tree/atlas" element={<Navigate to="/talent-tree/" replace />} />
        <Route path="/talent-tree/atlas/build" element={<Navigate to="/talent-tree/build/" replace />} />
        {/* The name Ryan used in the brief; the site's routes are kebab-case with a
            trailing slash, so this is a client-side alias, not the canonical. */}
        <Route path="/talentTree" element={<Navigate to="/talent-tree/" replace />} />
        {/* A real 404 instead of a silent redirect home. The redirect
            returned HTTP 200 with the homepage, gave the visitor no signal,
            and hydrated the prerendered shell at the wrong URL — which
            duplicated the entire page with a dead copy on top. */}
        <Route path="*" element={<PageShell><NotFoundPage /></PageShell>} />
      </Routes>
      {background && <ProjectPanel overlay={<UnlockChrome />}><Routes key={location.pathname} location={location}>
        <Route path="/work/:slug" element={<PanelCaseStudy />} />
        <Route path="/notes/:slug" element={<NotePage />} />
      </Routes></ProjectPanel>}
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
