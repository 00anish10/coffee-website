import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('hab-preloaded') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) return;
    const duration = prefersReducedMotion ? 200 : 1350;
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('hab-preloaded', '1');
      } catch {
        // Ignore storage errors
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [visible, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hab-preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-espresso text-snow"
          aria-label="Loading Himalayan Arabica Beans"
          role="status"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Steam Wisps */}
            <div className="flex gap-3 mb-2 h-8 items-end">
              {[0, 0.25, 0.5].map((delay, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 8, scaleY: 0.7 }}
                  animate={{
                    opacity: [0, 0.75, 0],
                    y: [-2, -20],
                    scaleY: [0.8, 1.15],
                  }}
                  transition={{
                    duration: 1.4,
                    delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="w-1 h-6 rounded-full bg-gradient-to-t from-caramel/60 to-snow/10 blur-[1px]"
                />
              ))}
            </div>

            {/* Coffee Cup Filling Animation */}
            <svg
              width="88"
              height="74"
              viewBox="0 0 88 74"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="cup-fill-clip">
                  <path d="M14 14 H62 V40 C62 53.255 51.255 64 38 64 C24.745 64 14 53.255 14 40 V14 Z" />
                </clipPath>
              </defs>

              <g clipPath="url(#cup-fill-clip)">
                <motion.rect
                  x="12"
                  width="52"
                  height="54"
                  fill="#6F4E37"
                  initial={{ y: 66 }}
                  animate={{ y: 16 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 1.0, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.rect
                  x="12"
                  width="52"
                  height="6"
                  fill="#C8872E"
                  initial={{ y: 66 }}
                  animate={{ y: 16 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 1.0, ease: [0.22, 1, 0.36, 1] }}
                />
              </g>

              <path
                d="M14 14 H62 V40 C62 53.255 51.255 64 38 64 C24.745 64 14 53.255 14 40 V14 Z"
                stroke="#FFFAF3"
                strokeWidth="2.5"
              />
              <path
                d="M62 22 H69 C74.523 22 79 26.477 79 32 C79 37.523 74.523 42 69 42 H62"
                stroke="#FFFAF3"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M8 68 H68"
                stroke="#C8872E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-5 font-serif text-xl tracking-wide text-crema"
            >
              Himalayan Arabica Beans
            </motion.p>
            <p className="mt-1 text-xs tracking-widest text-caramel/90">
              Thamel · Kathmandu · Est. 2012
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
