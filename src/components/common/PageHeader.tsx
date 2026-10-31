import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
      className
    )}>
    <div className="min-w-0">
      <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const EmptyState = ({
  icon,
  image,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  image?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center rounded-2xl border border-dashed border-gold/40 bg-card/60 px-6 py-12 text-center",
      className
    )}>
    {image && (
      <img src={image} alt="" className="mb-5 size-36 rounded-full object-cover shadow-md ring-4 ring-gold/20 sm:size-44" />
    )}
    {icon && (
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        {icon}
      </div>
    )}
    <h3 className="font-display text-2xl font-bold">{title}</h3>
    {description && (
      <div className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{description}</div>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
