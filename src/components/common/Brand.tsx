import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import brandLogo from "@/assets/brand-logo.webp";

interface BrandProps {
  to?: string;
  className?: string;
  /** Hide the wordmark below this breakpoint. */
  compact?: boolean;
}

/** Emblem: Seetha and Rama with the company name. Same artwork as public/logo.png (favicon). */
export const BrandMark = ({ className }: { className?: string }) => (
  <img
    src={brandLogo}
    alt=""
    aria-hidden
    width={192}
    height={192}
    className={cn("size-10 rounded-full bg-white object-cover ring-1 ring-gold/40", className)}
  />
);

export const Brand = ({ to = "/", className, compact }: BrandProps) => (
  <Link to={to} className={cn("group flex items-center gap-2.5", className)}>
    <BrandMark className="size-11 shrink-0 shadow-sm transition-transform group-hover:scale-105" />
    <span className={cn("leading-none", compact && "hidden sm:block")}>
      <span className="block font-display text-[1.35rem] font-bold tracking-tight text-primary">
        Seetha Rama
      </span>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-foreground/80">
        Kalyana
      </span>
    </span>
  </Link>
);

/** Small lotus glyph used as a decorative bullet / divider. */
export const Lotus = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 40" fill="none" aria-hidden className={cn("h-5 w-8", className)}>
    <path
      d="M32 4c5 6 7 12 7 18s-3 11-7 14c-4-3-7-8-7-14s2-12 7-18Z"
      fill="currentColor"
      opacity=".9"
    />
    <path
      d="M12 14c8 1 14 6 17 13 1 3 2 6 3 9-6 0-12-2-16-6-3-4-4-10-4-16Z"
      fill="currentColor"
      opacity=".55"
    />
    <path
      d="M52 14c-8 1-14 6-17 13-1 3-2 6-3 9 6 0 12-2 16-6 3-4 4-10 4-16Z"
      fill="currentColor"
      opacity=".55"
    />
    <path d="M4 36h56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
  </svg>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}) => (
  <div
    className={cn(
      "flex flex-col gap-3",
      align === "center" ? "items-center text-center" : "items-start text-left",
      className
    )}>
    {eyebrow && (
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-foreground">
        <Lotus className="h-3.5 w-6 text-gold" />
        {eyebrow}
      </span>
    )}
    <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    {description && (
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>
    )}
  </div>
);
