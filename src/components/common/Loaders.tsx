import { useId } from "react";
import { cn } from "@/lib/utils";

const PETALS = 8;

/**
 * Lotus mandala with ॐ, used for blocking, full-screen waits (payments, saves).
 * A saffron→marigold arc sweeps the rim, a ring of petals blooms in turn,
 * a kolam dot ring drifts the other way and the ॐ breathes in the centre.
 */
export const OmSpinner = ({ className }: { className?: string }) => {
  const arcId = `om-arc-${useId()}`;
  return (
    <div className={cn("relative size-20", className)}>
      <svg viewBox="0 0 100 100" fill="none" aria-hidden className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id={arcId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--marigold)" stopOpacity="0" />
            <stop offset="55%" stopColor="var(--marigold)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        {/* Rim: faint track with a sweeping gradient arc */}
        <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeOpacity=".18" strokeWidth="3" />
        <circle
          className="om-spinner-arc"
          cx="50"
          cy="50"
          r="46"
          stroke={`url(#${arcId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="110 179"
        />

        {/* Lotus petals blooming one after another */}
        <g className="om-spinner-petals">
          {Array.from({ length: PETALS }, (_, i) => (
            <g key={i} transform={`rotate(${(360 / PETALS) * i} 50 50)`}>
              <path
                className="om-spinner-petal"
                style={{ animationDelay: `${(i * 1.6) / PETALS}s` }}
                d="M50 11c4.5 3.5 4.5 9 0 13-4.5-4-4.5-9.5 0-13Z"
                fill="var(--primary)"
              />
            </g>
          ))}
        </g>

        {/* Kolam dot ring around the ॐ */}
        <circle
          className="om-spinner-dots"
          cx="50"
          cy="50"
          r="22"
          stroke="var(--gold)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="0 5.76"
        />
      </svg>
      <div className="om-spinner-om absolute inset-0 flex items-center justify-center font-display text-[1.6rem] font-bold leading-none text-primary">
        ॐ
      </div>
    </div>
  );
};

export const BlockingLoader = ({
  show,
  message = "One step closer to your match…",
}: {
  show: boolean;
  message?: string;
}) => {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background/80 backdrop-blur-sm">
      <OmSpinner />
      <p className="px-6 text-center font-display text-xl font-semibold text-primary">
        {message}
      </p>
    </div>
  );
};
