import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export function CoffeeBeanCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const smoothX = useSpring(cursorX, { damping: 28, stiffness: 380, mass: 0.4 });
  const smoothY = useSpring(cursorY, { damping: 28, stiffness: 380, mass: 0.4 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest('a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]')
      );
      setIsHovering(interactive);
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [cursorX, cursorY, isVisible, prefersReducedMotion]);

  if (prefersReducedMotion || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 1.75 : 1,
        rotate: isHovering ? 24 : -12,
        opacity: isHovering ? 0.92 : 0.72,
      }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:flex items-center justify-center mix-blend-difference"
    >
      {/* Roasted Coffee Bean SVG Follower */}
      <svg width="20" height="26" viewBox="0 0 24 32" fill="none">
        <ellipse
          cx="12"
          cy="16"
          rx="9"
          ry="13"
          fill="#C8872E"
          fillOpacity={isHovering ? 0.32 : 0.78}
          stroke="#FFFAF3"
          strokeWidth="1.4"
        />
        <path
          d="M12 4.5C9.5 10.5 14.5 21.5 12 27.5"
          stroke="#1C110A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
