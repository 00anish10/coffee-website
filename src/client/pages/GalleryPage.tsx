import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchGallery, type GalleryImage } from '../lib/api';
import { SectionTitle } from '../components/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';

export function GalleryPage() {
  const prefersReducedMotion = useReducedMotion();
  usePageMeta(
    'Gallery – Inside Our Thamel Coffee House | Himalayan Arabica Beans',
    'Explore the Himalayan Arabica Beans espresso bar, roastery, latte art, artisan bakery and barista training sessions in Thamel, Kathmandu.'
  );

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
  });

  const images = data?.images ?? [];

  const categories = useMemo(() => {
    const unique = Array.from(new Set(images.map((img) => img.category)));
    return ['All', ...unique];
  }, [images]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  useEffect(() => {
    if (!activeImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filtered.findIndex((i) => i.id === activeImage.id);
        if (idx !== -1 && filtered.length > 1) {
          setActiveImage(filtered[(idx + 1) % filtered.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filtered.findIndex((i) => i.id === activeImage.id);
        if (idx !== -1 && filtered.length > 1) {
          setActiveImage(filtered[(idx - 1 + filtered.length) % filtered.length]);
        }
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeImage, filtered]);

  useEffect(() => {
    if (!activeImage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionTitle
            kicker="Inside Thamel · Picture Gallery"
            title="Moments From the Espresso Bar & Roastery"
            subtitle="Explore our coffee house interior, single-origin extractions, morning pastries, and hands-on barista training sessions."
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-caramel text-espresso font-semibold'
                    : 'bg-[#E8D5BC] dark:bg-roasted/60 text-roasted/85 dark:text-crema/80 hover:text-espresso dark:hover:text-snow'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-roasted/15 dark:bg-roasted/50 animate-pulse break-inside-avoid"
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((img) => (
              <motion.button
                key={img.id}
                type="button"
                data-cursor="interactive"
                layoutId={prefersReducedMotion ? undefined : `gallery-card-${img.id}`}
                onClick={() => setActiveImage(img)}
                className="group relative block w-full text-left rounded-2xl overflow-hidden bg-roasted/20 break-inside-avoid shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-xs font-medium text-caramel">{img.category}</span>
                  <h3 className="font-serif text-lg font-semibold text-snow mt-0.5">
                    {img.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Shared-Layout Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-espresso/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setActiveImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.title}
          >
            <motion.div
              ref={dialogRef}
              layoutId={prefersReducedMotion ? undefined : `gallery-card-${activeImage.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-roasted border border-crema/15 shadow-2xl"
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveImage(null)}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-espresso/80 text-snow hover:bg-caramel hover:text-espresso transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              <span className="absolute top-4 left-4 z-20 rounded-full bg-espresso/75 text-crema px-3 py-1 text-xs tabular-nums backdrop-blur-sm">
                {filtered.findIndex((i) => i.id === activeImage.id) + 1} / {filtered.length}
              </span>

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => {
                      const idx = filtered.findIndex((i) => i.id === activeImage.id);
                      setActiveImage(filtered[(idx - 1 + filtered.length) % filtered.length]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-espresso/75 text-snow hover:bg-caramel hover:text-espresso transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => {
                      const idx = filtered.findIndex((i) => i.id === activeImage.id);
                      setActiveImage(filtered[(idx + 1) % filtered.length]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-espresso/75 text-snow hover:bg-caramel hover:text-espresso transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}

              <div className="max-h-[72vh] overflow-hidden bg-espresso flex items-center justify-center">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-espresso text-snow">
                <p className="text-xs font-medium text-caramel">{activeImage.category}</p>
                <h3 className="font-serif text-2xl font-semibold mt-1">{activeImage.title}</h3>
                <p className="mt-2 text-sm text-crema/80">{activeImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
