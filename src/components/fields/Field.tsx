import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | false | null;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error, with consistent spacing. */
export const Field = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps) => (
  <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
    {label && (
      <Label htmlFor={htmlFor} className="text-[13px] font-semibold text-foreground/80">
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-destructive">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

/** Two-column responsive grid for form fields. */
export const FieldGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2", className)}>
    {children}
  </div>
);
