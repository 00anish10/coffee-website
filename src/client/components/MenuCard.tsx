import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Bookmark, BookmarkCheck, Coffee } from 'lucide-react';
import type { MenuItem } from '../lib/api';
import { useTastingList } from '../lib/tastingList';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const { has, toggle } = useTastingList();
  const saved = has(item.id);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 220,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      data-cursor="interactive"
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
            }
      }
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 shadow-sm hover:shadow-xl transition-shadow duration-300 ${
        item.isAvailable ? '' : 'opacity-80'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-roasted/20 dark:bg-espresso/60">
        {!imgFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-roasted to-espresso text-crema/70 p-6 text-center">
            <Coffee className="w-8 h-8 mb-2 text-caramel" aria-hidden="true" />
            <span className="font-serif text-sm">{item.name}</span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"
        />

        <button
          type="button"
          onClick={() => toggle(item.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.name} from tasting list` : `Save ${item.name} to tasting list`}
          title={saved ? 'Remove from tasting list' : 'Save to tasting list'}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
            saved
              ? 'bg-caramel text-espresso border-caramel'
              : 'bg-espresso/55 text-snow border-crema/25 hover:bg-caramel hover:text-espresso hover:border-caramel'
          }`}
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Bookmark className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {!item.isAvailable && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-espresso/85 text-crema border border-crema/20 px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-md">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-mocha dark:text-caramel/90">
            {item.originNote}
            {item.isFeatured && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="text-himalayan dark:text-emerald-300">House Favorite</span>
              </>
            )}
          </p>

          <div className="mt-2 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold text-espresso dark:text-snow leading-snug">
              {item.name}
            </h3>
            <span className="tabular-nums whitespace-nowrap shrink-0 text-base font-semibold text-caramel">
              NPR {item.priceNpr.toLocaleString('en-NP')}
            </span>
          </div>

          <p className="mt-2.5 text-sm leading-relaxed text-roasted/80 dark:text-crema/75 line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
