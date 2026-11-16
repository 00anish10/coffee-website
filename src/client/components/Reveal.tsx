import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 24, className = '' }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  align = 'left',
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  const alignCls = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <Reveal className={`flex flex-col max-w-2xl ${alignCls}`}>
      {kicker && (
        <p className="text-xs sm:text-sm font-medium tracking-widest text-caramel">
          {kicker}
        </p>
      )}
      <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-espresso dark:text-snow">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-roasted/80 dark:text-crema/80 max-w-xl">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function Counter({
  target,
  suffix = '',
  prefix = '',
  duration = 1400,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    x.set(Math.max(-10, Math.min(10, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="border-y border-mocha/20 dark:border-crema/10 bg-crema/60 dark:bg-roasted/40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs sm:text-sm tracking-wide text-roasted/80 dark:text-crema/80">
          {items.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  const repeated = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-mocha/20 dark:border-crema/10 bg-crema/70 dark:bg-roasted/40 py-4 select-none"
      aria-label="Specialty coffee highlights"
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-10 text-xs sm:text-sm font-medium tracking-wider text-roasted/85 dark:text-crema/85"
          >
            <span>{item}</span>
            <span aria-hidden="true" className="text-caramel">
              /
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
