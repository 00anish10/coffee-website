import { Link } from 'react-router-dom';
import { ArrowRight, Coffee } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { MountainDivider } from '../components/MountainDivider';

export function NotFoundPage() {
  usePageMeta(
    'Page not found – Himalayan Arabica Beans',
    'This page has gone cold. Return to the Himalayan Arabica Beans home page or browse our Thamel coffee menu.'
  );

  return (
    <div className="min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow flex flex-col justify-center pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Coffee className="w-10 h-10 text-caramel mx-auto" aria-hidden="true" />
        <p className="mt-5 text-xs font-medium tracking-widest text-caramel">404 · Off the map</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
          This trail ends at a cold cup
        </h1>
        <p className="mt-5 text-base sm:text-lg text-roasted/80 dark:text-crema/80 max-w-xl mx-auto">
          The page you are looking for is not on our menu. Head back to the espresso bar or explore
          our coffees, pastries and Thamel gallery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-caramel px-6 py-3 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors"
          >
            <span>Back to Home</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-xl border border-mocha/25 dark:border-crema/20 px-6 py-3 text-sm font-medium hover:border-caramel hover:text-caramel transition-colors"
          >
            Browse the Menu
          </Link>
        </div>
      </div>
      <div className="mt-16">
        <MountainDivider />
      </div>
    </div>
  );
}
