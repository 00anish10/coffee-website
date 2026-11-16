import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import type { Testimonial } from '../lib/api';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const count = testimonials.length;

  useEffect(() => {
    if (count <= 1 || isPaused || prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % count);
    }, 5500);
    return () => window.clearInterval(id);
  }, [count, isPaused, prefersReducedMotion]);

  if (!count) {
    return null;
  }

  const current = testimonials[index % count];

  const goTo = (nextIdx: number, dir: number) => {
    setDirection(dir);
    setIndex((nextIdx + count) % count);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50) {
      goTo(index + 1, 1);
    } else if (info.offset.x > 50) {
      goTo(index - 1, -1);
    }
  };

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Guest testimonials"
    >
      <div className="overflow-hidden rounded-2xl bg-[#EFE0CC] dark:bg-roasted/70 border border-mocha/15 dark:border-crema/10 px-6 py-10 sm:px-12 sm:py-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            drag={prefersReducedMotion || count <= 1 ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? 48 : -48 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? -48 : 48 }
            }
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <Quote className="w-8 h-8 text-caramel/80 shrink-0" aria-hidden="true" />
              <div className="flex items-center gap-1" aria-label={`Rated ${current.rating} out of 5 stars`}>
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-caramel text-caramel"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            <blockquote className="font-serif text-xl sm:text-2xl lg:text-[26px] leading-relaxed text-espresso dark:text-snow">
              “{current.quote}”
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-mocha/15 dark:border-crema/10 pt-5">
              <div>
                <p className="font-semibold text-base text-espresso dark:text-snow">
                  {current.authorName}
                </p>
                <p className="text-xs sm:text-sm text-roasted/75 dark:text-crema/75 mt-0.5">
                  {current.authorRole}
                  <span aria-hidden="true"> · </span>
                  {current.origin}
                </p>
              </div>
              <span className="text-xs text-mocha dark:text-caramel/90 tabular-nums">
                Visited {current.visitDate}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => {
              const active = i === index % count;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`View testimonial from ${t.authorName}`}
                  aria-current={active ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-7 bg-caramel'
                      : 'w-2 bg-mocha/30 dark:bg-crema/25 hover:bg-caramel/60'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1, -1)}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-xl border border-mocha/20 dark:border-crema/15 text-espresso dark:text-snow hover:bg-caramel hover:text-espresso hover:border-caramel transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1, 1)}
              aria-label="Next testimonial"
              className="p-2.5 rounded-xl border border-mocha/20 dark:border-crema/15 text-espresso dark:text-snow hover:bg-caramel hover:text-espresso hover:border-caramel transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
