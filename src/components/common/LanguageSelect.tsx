import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const LanguageSelect = ({
  value,
  onChange,
  className,
}: {
  value: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}) => (
  <Select value={value} onValueChange={(v) => onChange(v as Lang)}>
    <SelectTrigger size="sm" aria-label="Language" className={cn("gap-1.5 bg-card", className)}>
      <Languages className="text-primary" />
      <SelectValue />
    </SelectTrigger>
    <SelectContent align="end">
      {LANGUAGES.map((l) => (
        <SelectItem key={l.value} value={l.value} lang={l.locale}>
          {l.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
