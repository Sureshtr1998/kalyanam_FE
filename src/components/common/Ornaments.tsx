import { cn } from "@/lib/utils";

/** Mango-leaf thoranam with marigold drops, as hung over South Indian doorways. */
export const Thoranam = ({ className, leaves = 9 }: { className?: string; leaves?: number }) => {
  const width = leaves * 24;
  return (
    <svg
      viewBox={`0 0 ${width} 46`}
      className={cn("h-10 w-auto", className)}
      aria-hidden
      fill="none">
      <path
        d={`M2 6 Q ${width / 2} 16 ${width - 2} 6`}
        stroke="var(--saffron-800)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {Array.from({ length: leaves }).map((_, i) => {
        const x = 12 + i * 24;
        const sag = 6 + 10 * Math.sin((Math.PI * (i + 0.5)) / leaves);
        return (
          <g key={i} transform={`translate(${x} ${sag})`}>
            <path
              d="M0 0 C 7 8, 6 22, 0 30 C -6 22, -7 8, 0 0 Z"
              fill={i % 2 ? "#3f7d2a" : "#5a9a35"}
            />
            <path d="M0 2 L0 27" stroke="#2f5e1f" strokeWidth="0.8" />
            {i < leaves - 1 && (
              <circle cx="12" cy="4" r="3.6" fill={i % 2 ? "var(--marigold)" : "var(--saffron-500)"} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Purna kalasha: pot, mango leaves and coconut. */
export const Kalasha = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={cn("size-10", className)} aria-hidden fill="none">
    <path d="M18 24c-6-3-10-1-12 2 5 1 9 2 12 0Z" fill="#4f8f30" />
    <path d="M46 24c6-3 10-1 12 2-5 1-9 2-12 0Z" fill="#4f8f30" />
    <path d="M24 22c-4-6-3-11 0-14 2 5 3 9 2 13Z" fill="#5a9a35" />
    <path d="M40 22c4-6 3-11 0-14-2 5-3 9-2 13Z" fill="#5a9a35" />
    <ellipse cx="32" cy="15" rx="7" ry="8" fill="#8a5a2b" />
    <path d="M27 11c3-2 7-2 10 0" stroke="#6b4320" strokeWidth="1.2" />
    <rect x="20" y="22" width="24" height="5" rx="2" fill="var(--marigold)" />
    <path
      d="M22 27h20c6 4 9 10 9 16 0 9-8 15-19 15S13 52 13 43c0-6 3-12 9-16Z"
      fill="var(--saffron-600)"
    />
    <path d="M16 40h32" stroke="var(--marigold)" strokeWidth="2.5" />
    <path d="M17 46h30" stroke="var(--saffron-800)" strokeWidth="1.2" strokeDasharray="2 3" />
    <circle cx="32" cy="36" r="2.5" fill="var(--kumkum)" />
  </svg>
);
