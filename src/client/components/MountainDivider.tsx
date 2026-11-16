interface MountainDividerProps {
  topColorClass?: string;
  fillClass?: string;
  flip?: boolean;
}

export function MountainDivider({
  topColorClass = 'bg-transparent',
  fillClass = 'text-crema dark:text-espresso',
  flip = false,
}: MountainDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none ${topColorClass} ${
        flip ? 'rotate-180' : ''
      }`}
    >
      <svg
        viewBox="0 0 1440 110"
        fill="none"
        preserveAspectRatio="none"
        className={`w-full h-12 sm:h-16 md:h-20 block ${fillClass}`}
      >
        <path
          d="M0 95 L140 52 L245 78 L390 28 L525 72 L680 12 L840 68 L985 24 L1120 74 L1285 36 L1440 82 V110 H0 Z"
          fill="currentColor"
          fillOpacity="0.22"
        />
        <path
          d="M0 100 L190 66 L310 88 L475 34 L620 84 L795 22 L950 78 L1115 44 L1265 86 L1440 54 V110 H0 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
