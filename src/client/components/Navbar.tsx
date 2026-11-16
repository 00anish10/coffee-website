import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../lib/themeContext';
import { OpenStatusBadge } from './OpenStatusBadge';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  // The home hero is always dark, so in light mode the transparent navbar
  // must still use light text until the user scrolls past it.
  const overHero = isHome && !scrolled;

  const logoClass = overHero ? 'text-snow' : 'text-espresso dark:text-snow';
  const linkInactiveClass = overHero
    ? 'text-crema/85 hover:text-snow'
    : 'text-espresso/80 dark:text-crema/85 hover:text-espresso dark:hover:text-snow';
  const iconButtonClass = overHero
    ? 'border-crema/25 text-crema hover:border-caramel hover:text-caramel'
    : 'border-mocha/20 dark:border-crema/15 text-espresso dark:text-crema hover:border-caramel hover:text-caramel';
  const mobileButtonClass = overHero
    ? 'border-crema/25 text-snow'
    : 'border-mocha/20 dark:border-crema/15 text-espresso dark:text-snow';

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-crema/88 dark:bg-espresso/88 backdrop-blur-md border-b border-mocha/15 dark:border-crema/10 shadow-sm'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <Link
            to="/"
            className={`font-serif text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors ${logoClass}`}
          >
            Himalayan Arabica Beans
          </Link>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive ? 'text-caramel' : linkInactiveClass
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId={prefersReducedMotion ? undefined : 'navActiveUnderline'}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-caramel rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary CTA + Theme Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <OpenStatusBadge className="hidden lg:inline-flex" showDetail forceDark={overHero} />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light crema theme' : 'Switch to dark espresso theme'}
              className={`p-2 rounded-xl border transition-colors ${iconButtonClass}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-caramel px-4 py-2 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors whitespace-nowrap shrink-0"
            >
              Explore Menu
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={`md:hidden p-2 rounded-xl border transition-colors ${mobileButtonClass}`}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] md:hidden"
          >
            <div
              className="absolute inset-0 bg-espresso/75 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              aria-label="Mobile Navigation"
              initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-crema dark:bg-espresso border-l border-mocha/20 dark:border-crema/15 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-mocha/15 dark:border-crema/10">
                  <span className="font-serif text-lg font-semibold text-espresso dark:text-snow">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-2 rounded-xl text-espresso dark:text-snow hover:bg-mocha/10 dark:hover:bg-crema/10"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <ul className="mt-6 flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-caramel text-espresso font-semibold'
                              : 'text-espresso dark:text-crema hover:bg-mocha/10 dark:hover:bg-roasted/70'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-mocha/15 dark:border-crema/10 text-xs text-roasted/75 dark:text-crema/70 space-y-1">
                <p className="font-semibold text-espresso dark:text-snow">
                  Saat Ghumti Marg, Thamel
                </p>
                <p>Kathmandu, Nepal · Open 7:00 AM – 9:00 PM</p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
