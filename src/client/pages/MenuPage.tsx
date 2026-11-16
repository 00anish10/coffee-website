import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ExternalLink, Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchMenu } from '../lib/api';
import { MAPS_MENU_URL } from '../lib/maps';
import { SectionTitle } from '../components/Reveal';
import { MenuCard } from '../components/MenuCard';
import { usePageMeta } from '../hooks/usePageMeta';

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'name';

const SORT_LABELS: Record<SortMode, string> = {
  featured: 'House favorites first',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name: A to Z',
};

export function MenuPage() {
  const prefersReducedMotion = useReducedMotion();
  usePageMeta(
    'Menu – 100+ Himalayan Coffee Flavors & Pastries | Himalayan Arabica Beans',
    'Browse our Thamel menu of 100% Nepali Arabica espresso, signature flavors, 18-hour cold brew, artisan pastries and take-home beans. Prices in NPR.'
  );

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('featured');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['menu', activeCategory],
    queryFn: () => fetchMenu(activeCategory),
  });

  const categories = data?.categories ?? [];
  const items = data?.items ?? [];
  const activeCategoryInfo = categories.find((cat) => cat.slug === activeCategory);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = q
      ? items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.originNote.toLowerCase().includes(q)
        )
      : [...items];

    switch (sortMode) {
      case 'price-asc':
        return result.sort((a, b) => a.priceNpr - b.priceNpr);
      case 'price-desc':
        return result.sort((a, b) => b.priceNpr - a.priceNpr);
      case 'name':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result.sort(
          (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name)
        );
    }
  }, [items, searchQuery, sortMode]);

  const tabs = [{ slug: 'all', name: 'All Offerings' }, ...categories];
  const hasFilters = Boolean(searchQuery.trim()) || activeCategory !== 'all';

  return (
    <div className="pt-28 pb-24 min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <SectionTitle
            kicker="Coffee & Bakery Menu · Prices in NPR"
            title="100+ Flavors & Freshly Baked Pastries"
            subtitle="Every espresso is pulled from 100% organic Himalayan Arabica beans, paired with croissants, brownies, and cheesecakes baked fresh daily."
          />

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search
              className="w-4 h-4 text-mocha dark:text-crema/60 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <label htmlFor="menu-search" className="sr-only">
              Search menu items
            </label>
            <input
              id="menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search espresso, mocha, pastry..."
              className="w-full rounded-xl bg-snow dark:bg-roasted/70 border border-mocha/20 dark:border-crema/15 pl-10 pr-10 py-2.5 text-sm text-espresso dark:text-snow placeholder:text-roasted/50 dark:placeholder:text-crema/50 focus:border-caramel focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-mocha dark:text-crema/60 hover:text-caramel transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <a
            href={MAPS_MENU_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-mocha/25 dark:border-crema/20 px-4 py-2.5 text-sm font-semibold text-espresso dark:text-crema hover:border-caramel hover:text-caramel transition-colors"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            View the Full Menu on Google
          </a>
        </div>

        {/* Animated Category Tabs */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#E8D5BC] dark:bg-roasted/60 border border-mocha/15 dark:border-crema/10 mb-6 w-fit max-w-full"
        >
          {tabs.map((tab) => {
            const active = activeCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveCategory(tab.slug)}
                className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-espresso'
                    : 'text-roasted/80 dark:text-crema/80 hover:text-espresso dark:hover:text-snow'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={prefersReducedMotion ? undefined : 'menuCategoryIndicator'}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-caramel shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {activeCategoryInfo?.description && (
          <p className="mb-6 text-sm text-roasted/75 dark:text-crema/70 max-w-2xl">
            {activeCategoryInfo.description}
          </p>
        )}

        {/* Result meta + sort */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-mocha/15 dark:border-crema/10">
          <p className="text-xs sm:text-sm text-roasted/70 dark:text-crema/65" role="status">
            Showing <span className="font-semibold tabular-nums">{filteredItems.length}</span>{' '}
            {filteredItems.length === 1 ? 'item' : 'items'}
            {searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ''}
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="ml-3 text-caramel font-medium hover:underline underline-offset-4"
              >
                Reset filters
              </button>
            )}
          </p>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-mocha dark:text-crema/60" aria-hidden="true" />
            <label htmlFor="menu-sort" className="text-xs text-roasted/70 dark:text-crema/65">
              Sort
            </label>
            <select
              id="menu-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-xl bg-snow dark:bg-roasted/70 border border-mocha/20 dark:border-crema/15 px-3 py-1.5 text-xs text-espresso dark:text-snow focus:border-caramel focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {SORT_LABELS[mode]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* States */}
        {isError ? (
          <div className="rounded-2xl bg-roasted/10 dark:bg-roasted/50 border border-rose-400/30 p-8 text-center">
            <p className="text-base font-medium">Unable to load menu items right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-caramel px-5 py-2 text-sm font-semibold text-espresso"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-roasted/10 dark:bg-roasted/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-mocha/15 dark:border-crema/10 p-12 text-center">
            <p className="font-serif text-2xl">
              {searchQuery.trim()
                ? `No menu items match “${searchQuery.trim()}”`
                : 'No items in this category yet'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 rounded-xl bg-caramel px-5 py-2.5 text-sm font-semibold text-espresso"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout={!prefersReducedMotion}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
