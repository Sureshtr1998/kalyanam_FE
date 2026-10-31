import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/utils";

/** Festive gradients; each member without a photo gets one picked from their id/name. */
const PALETTES = [
  "from-[#f97316] via-[#e11d48] to-[#7c2d12]", // saffron to kumkum
  "from-[#0f766e] via-[#14b8a6] to-[#facc15]", // peacock
  "from-[#7e22ce] via-[#c026d3] to-[#fb7185]", // lotus
  "from-[#1e3a8a] via-[#4f46e5] to-[#38bdf8]", // indigo silk
  "from-[#9f1239] via-[#be123c] to-[#f59e0b]", // bridal maroon
  "from-[#166534] via-[#65a30d] to-[#fde047]", // mango leaf
  "from-[#b45309] via-[#d97706] to-[#fef08a]", // marigold
  "from-[#334155] via-[#6d28d9] to-[#f472b6]", // twilight
];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

interface Props {
  name?: string;
  /** Stable seed so the same member always gets the same colours. */
  seed?: string;
  size?: "thumb" | "card";
  className?: string;
}

/** Shown in place of a profile photo: gradient, rangoli motif and initials. */
export const ProfilePlaceholder = ({ name, seed, size = "card", className }: Props) => {
  const palette = PALETTES[Math.abs(hash(seed || name || "")) % PALETTES.length];
  const card = size === "card";
  return (
    <div
      role="img"
      aria-label={name ? `${name} has not added a photo` : "No photo"}
      className={cn("relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br", palette, className)}>
      {card && (
        <svg viewBox="0 0 200 200" className="absolute -right-10 -top-10 size-56 text-white/15" aria-hidden fill="none">
          {[90, 70, 50, 30].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 6" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="58"
              rx="9"
              ry="22"
              fill="currentColor"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="12" fill="currentColor" />
        </svg>
      )}
      <span
        className={cn(
          "relative font-display font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
          card ? "-mt-[18%] text-7xl" : "text-lg"
        )}>
        {getInitials(name)}
      </span>
    </div>
  );
};
