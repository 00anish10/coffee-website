import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Coffee, Phone, Trash2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../lib/api';
import { useTastingList } from '../lib/tastingList';

const RESERVE_PHONE = '+9779860199935';

export function TastingList() {
  const prefersReducedMotion = useReducedMotion();
  const { ids, count, remove, clear } = useTastingList();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['menu', 'all'],
    queryFn: () => fetchMenu(),
    enabled: open,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const items = (data?.items ?? []).filter((item) => ids.includes(item.id));
  const total = items.reduce((sum, item) => sum + item.priceNpr, 0);

  return (
    <>
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            aria-label={`Open tasting list (${count} saved items)`}
            className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-2xl bg-caramel px-4 py-3 text-sm font-semibold text-espresso shadow-xl hover:bg-caramel/90 transition-colors cursor-pointer"
          >
            <Coffee className="w-4 h-4" aria-hidden="true" />
            <span>Tasting List</span>
            <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-espresso text-crema text-[11px] tabular-nums px-1">
              {count}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="tasting-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85]"
          >
            <div
              className="absolute inset-0 bg-espresso/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Your tasting list"
              initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-crema dark:bg-espresso border-l border-mocha/20 dark:border-crema/15 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-mocha/15 dark:border-crema/10 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-caramel">Saved for later</p>
                  <h2 className="font-serif text-2xl font-semibold text-espresso dark:text-snow">
                    Your Tasting List
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close tasting list"
                  className="p-2 rounded-xl text-espresso dark:text-snow hover:bg-mocha/10 dark:hover:bg-crema/10 transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {isLoading ? (
                  <p className="text-sm text-roasted/70 dark:text-crema/70">Loading saved items…</p>
                ) : items.length === 0 ? (
                  <p className="text-sm text-roasted/70 dark:text-crema/70">
                    Your tasting list is empty. Browse the menu and tap the coffee bean icon to save
                    drinks and pastries you want to try.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-[#EFE0CC] dark:bg-roasted/60 border border-mocha/15 dark:border-crema/10 p-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        loading="lazy"
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-semibold text-espresso dark:text-snow truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-mocha dark:text-caramel tabular-nums">
                          NPR {item.priceNpr.toLocaleString('en-NP')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name} from tasting list`}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                )}

                {ids.length > 0 && items.length !== ids.length && !isLoading && (
                  <p className="text-xs text-roasted/60 dark:text-crema/55">
                    Some saved items are no longer on the menu and were skipped.
                  </p>
                )}
              </div>

              <div className="border-t border-mocha/15 dark:border-crema/10 p-6 space-y-4">
                {items.length > 0 && (
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-roasted/80 dark:text-crema/75">Estimated total</span>
                    <span className="font-semibold text-caramel tabular-nums">
                      NPR {total.toLocaleString('en-NP')}
                    </span>
                  </div>
                )}
                <a
                  href={`tel:${RESERVE_PHONE}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-caramel px-5 py-3 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Call to reserve your table
                </a>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full rounded-xl border border-mocha/25 dark:border-crema/20 px-5 py-2.5 text-sm font-medium text-roasted/80 dark:text-crema/80 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                  >
                    Clear list
                  </button>
                )}
                <p className="text-[11px] text-center text-roasted/55 dark:text-crema/50">
                  Saved in this browser only. Prices are indicative and in NPR.
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
