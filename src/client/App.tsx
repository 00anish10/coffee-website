import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ThemeProvider } from './lib/themeContext';
import { TastingListProvider } from './lib/tastingList';
import { useLenis } from './hooks/useLenis';
import { Preloader } from './components/Preloader';
import { CoffeeBeanCursor } from './components/CoffeeBeanCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipLink } from './components/SkipLink';
import { BackToTop } from './components/BackToTop';
import { TastingList } from './components/TastingList';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const MenuPage = lazy(() =>
  import('./pages/MenuPage').then((m) => ({ default: m.MenuPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = (window as unknown as { __habLenis?: { scrollTo: (n: number) => void } })
      .__habLenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        id="main-content"
        tabIndex={-1}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-crema dark:bg-espresso text-espresso dark:text-snow">
              <p className="font-serif text-xl text-caramel">Brewing...</p>
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}

function AppShell() {
  useLenis();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-crema dark:bg-espresso text-espresso dark:text-snow">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-[80] shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {!isAdmin && <SkipLink />}
      {!isAdmin && <Preloader />}
      {!isAdmin && <CoffeeBeanCursor />}
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        <AnimatedRoutes />
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <TastingList />}
      {!isAdmin && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TastingListProvider>
            <MotionConfig reducedMotion="user">
              <BrowserRouter>
                <AppShell />
              </BrowserRouter>
            </MotionConfig>
          </TastingListProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
