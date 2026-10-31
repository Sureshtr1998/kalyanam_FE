import { useState } from "react";
import { Check, ChevronsUpDown, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SelectType } from "@/utils/interfaces";
import { normalizeToArray, presetLabels } from "@/utils/utils";

/** Splits options into consecutive runs that share a `group` heading. */
const groupOptions = (options: SelectType[]) =>
  options.reduce<{ heading?: string; items: SelectType[] }[]>((groups, o) => {
    const last = groups[groups.length - 1];
    if (last && last.heading === o.group) last.items.push(o);
    else groups.push({ heading: o.group, items: [o] });
    return groups;
  }, []);

interface SelectFieldProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  options: SelectType[];
  placeholder?: string;
  /** Long lists (castes, languages, countries) get a type-to-search popover. */
  searchable?: boolean;
  /** Searchable only: lets the member use what they typed when it isn't listed. */
  creatable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export const SelectField = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select",
  searchable,
  creatable,
  disabled,
  invalid,
  className,
}: SelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (!searchable) {
    return (
      <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={invalid || undefined}
          className={cn("h-10 w-full bg-card", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {groupOptions(options).map((g, i) => (
            <SelectGroup key={g.heading ?? i}>
              {g.heading && <SelectLabel>{g.heading}</SelectLabel>}
              {g.items.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const selected = options.find((o) => o.value === value);
  // A typed-in value that isn't one of the options still shows as selected.
  const shown = selected?.label ?? (creatable && value ? value : undefined);
  const typed = search.trim();
  const canCreate =
    creatable && typed && !options.some((o) => o.label.toLowerCase() === typed.toLowerCase());
  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    setSearch("");
  };
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSearch("");
      }}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between bg-card px-3 font-normal",
            !shown && "text-muted-foreground",
            className
          )}>
          <span className="truncate">{shown ?? placeholder}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-60 p-0"
        align="start">
        <Command>
          <CommandInput
            placeholder={creatable ? "Search or type your own…" : "Search…"}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {!canCreate && <CommandEmpty>No match found.</CommandEmpty>}
            {canCreate && (
              <CommandGroup>
                <CommandItem value={`__create__${typed}`} forceMount onSelect={() => choose(typed)}>
                  <Plus className="text-primary" />
                  Use “{typed}”
                </CommandItem>
              </CommandGroup>
            )}
            {groupOptions(options).map((g, i) => (
              <CommandGroup key={g.heading ?? i} heading={g.heading}>
                {g.items.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    keywords={g.heading ? [g.heading] : undefined}
                    onSelect={() => choose(o.value)}>
                    <Check
                      className={cn(
                        "text-primary",
                        value === o.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface MultiSelectFieldProps {
  id?: string;
  value?: string | string[];
  onChange: (value: string[]) => void;
  options: SelectType[];
  placeholder?: string;
  invalid?: boolean;
  /** Shortcuts shown above the list that select (or clear) a whole set of options at once. */
  presets?: { label: string; values: string[] }[];
}

const CheckBox = ({ state }: { state: boolean | "partial" }) => (
  <span
    className={cn(
      "flex size-4 items-center justify-center rounded-[4px] border",
      state ? "border-primary bg-primary text-primary-foreground" : "border-input"
    )}>
    {state === true && <Check className="size-3 text-primary-foreground" />}
    {state === "partial" && <Minus className="size-3 text-primary-foreground" />}
  </span>
);

export const MultiSelectField = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Any",
  invalid,
  presets = [],
}: MultiSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = normalizeToArray(value);

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);

  const presetState = (values: string[]) => {
    const on = values.filter((v) => selected.includes(v)).length;
    return on === values.length ? true : on ? ("partial" as const) : false;
  };
  const togglePreset = (values: string[]) =>
    onChange(
      presetState(values) === true
        ? selected.filter((s) => !values.includes(s))
        : [...selected, ...values.filter((v) => !selected.includes(v))]
    );

  const chips = presetLabels(options, presets, selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-auto min-h-10 w-full justify-between bg-card px-3 py-1.5 font-normal",
            !selected.length && "text-muted-foreground"
          )}>
          <span className="flex min-w-0 flex-1 flex-wrap gap-1">
            {selected.length === 0 && placeholder}
            {chips.slice(0, 2).map((label) => (
              <Badge key={label} variant="secondary" className="max-w-36 truncate font-medium">
                {label}
              </Badge>
            ))}
            {chips.length > 2 && (
              <Badge variant="outline" className="font-medium">
                +{chips.length - 2} more
              </Badge>
            )}
          </span>
          {selected.length > 0 ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              className="rounded p-0.5 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange([]);
                }
              }}>
              <X className="size-4" />
            </span>
          ) : (
            <ChevronsUpDown className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-60 p-0"
        align="start">
        <Command>
          {options.length > 8 && <CommandInput placeholder="Search…" />}
          <CommandList>
            <CommandEmpty>No match found.</CommandEmpty>
            {presets.length > 0 && (
              <CommandGroup heading="Quick select">
                {presets.map((p) => (
                  <CommandItem key={p.label} value={p.label} onSelect={() => togglePreset(p.values)}>
                    <CheckBox state={presetState(p.values)} />
                    <span className="font-medium">{p.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {groupOptions(options).map((g, i) => (
              <CommandGroup key={g.heading ?? i} heading={g.heading}>
                {g.items.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    keywords={g.heading ? [g.heading] : undefined}
                    onSelect={() => toggle(o.value)}>
                    <CheckBox state={selected.includes(o.value)} />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
