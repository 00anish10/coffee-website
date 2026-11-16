import { motion, useReducedMotion } from 'motion/react';
import { useCafeStatus } from '../hooks/useCafeStatus';

interface OpenStatusBadgeProps {
  showDetail?: boolean;
  className?: string;
  /** Use light text/borders for placement on always-dark surfaces (hero, footer). */
  forceDark?: boolean;
}

export function OpenStatusBadge({
  showDetail = false,
  className = '',
  forceDark = false,
}: OpenStatusBadgeProps) {
  const { isOpen, label, detail } = useCafeStatus();
  const prefersReducedMotion = useReducedMotion();

  const tone = isOpen
    ? forceDark
      ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-300'
      : 'border-himalayan/30 bg-himalayan/10 text-himalayan dark:text-emerald-300'
    : forceDark
      ? 'border-crema/20 bg-crema/10 text-crema/70'
      : 'border-mocha/25 bg-mocha/10 text-mocha dark:border-crema/20 dark:text-crema/70';

  const dot = isOpen
    ? forceDark
      ? 'bg-emerald-300'
      : 'bg-himalayan dark:bg-emerald-300'
    : forceDark
      ? 'bg-crema/60'
      : 'bg-mocha dark:bg-crema/60';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${tone} ${className}`}
      title={`Kathmandu time · ${detail}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isOpen && !prefersReducedMotion && (
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className={`absolute inline-flex h-full w-full rounded-full ${dot}`}
          />
        )}
        <span
          aria-hidden="true"
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`}
        />
      </span>
      <span>{label}</span>
      {showDetail && <span className="opacity-75">· {detail}</span>}
    </span>
  );
}
