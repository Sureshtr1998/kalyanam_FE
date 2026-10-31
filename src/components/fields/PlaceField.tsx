import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PLACE_SEARCH_URL } from "@/utils/constants";

export interface Place {
  /** "City, State, Country" */
  label: string;
  /** Missing only when the place service was unreachable and the text was typed. */
  lat?: number;
  lng?: number;
}

interface PhotonFeature {
  properties: { name?: string; county?: string; state?: string; country?: string };
  geometry: { coordinates: [number, number] };
}

// Photon (OpenStreetMap) allows type-ahead search worldwide, villages included.
const searchPlaces = async (q: string, signal: AbortSignal): Promise<Place[]> => {
  const url = `${PLACE_SEARCH_URL}?q=${encodeURIComponent(q)}&limit=8&lang=en&osm_tag=place`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Place search failed (${res.status})`);
  const data: { features: PhotonFeature[] } = await res.json();
  const seen = new Set<string>();
  return data.features.flatMap(({ properties: p, geometry }) => {
    if (!p.name || !p.country) return [];
    const label = [p.name, p.state ?? p.county, p.country].filter(Boolean).join(", ");
    if (seen.has(label)) return [];
    seen.add(label);
    return [{ label, lat: geometry.coordinates[1], lng: geometry.coordinates[0] }];
  });
};

interface PlaceFieldProps {
  id?: string;
  /** The chosen place; empty until one is picked from the list. */
  value: string;
  onChange: (place: Place | null) => void;
  placeholder?: string;
}

/**
 * Type-ahead birthplace picker covering the whole world. The value is only set
 * once a suggestion is chosen, so the astrologer always gets a real location.
 * If the place service is unreachable, typed text is accepted as is.
 */
export const PlaceField = ({ id, value, onChange, placeholder = "Start typing your town or city" }: PlaceFieldProps) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || q === value) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      searchPlaces(q, ctrl.signal)
        .then((r) => {
          setResults(r);
          setOffline(false);
        })
        .catch((err) => {
          if (ctrl.signal.aborted) return;
          console.error(err);
          setOffline(true);
        })
        .finally(() => !ctrl.signal.aborted && setLoading(false));
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, value]);

  const type = (text: string) => {
    setQuery(text);
    setOpen(true);
    // Fallback when the place service is down: accept what was typed.
    if (offline) onChange(text.trim() ? { label: text } : null);
    else if (value) onChange(null);
  };

  const pick = (p: Place) => {
    setQuery(p.label);
    setResults([]);
    setOpen(false);
    onChange(p);
  };

  const unpicked = !offline && query.trim().length > 0 && query !== value;

  return (
    <Popover open={open && query.trim().length >= 2 && query !== value} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            value={query}
            onChange={(e) => type(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                e.preventDefault();
                pick(results[0]);
              }
            }}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-invalid={unpicked || undefined}
            className={cn("h-10 bg-card pl-9", loading && "pr-9")}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>
              {loading ? "Searching…" : offline ? "Place search is unavailable. Your typed place will be used." : "No place found. Try the nearest town."}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup>
                {results.map((p) => (
                  <CommandItem key={p.label} value={p.label} onSelect={() => pick(p)}>
                    <MapPin className="text-muted-foreground" />
                    {p.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
