import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE_MB, MAX_IMAGES, imageUrl } from "@/utils/constants";
import type { ImageFile } from "@/utils/interfaces";

export type PhotoItem = ImageFile | File;

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"];

export interface PhotoText {
  add: string;
  type: string;
  size: (mb: number) => string;
  max: (n: number) => string;
}

const defaultText: PhotoText = {
  add: "Add photo",
  type: "Only JPG or PNG photos are allowed.",
  size: (mb) => `Each photo must be under ${mb} MB. Try a screenshot or a compressed copy.`,
  max: (n) => `You can add up to ${n} photos.`,
};

interface Props {
  value: PhotoItem[];
  onChange: (items: PhotoItem[]) => void;
  className?: string;
  text?: PhotoText;
}

/** Up to three photos: existing uploads and newly picked files, first one is the cover. */
export const PhotoManager = ({ value, onChange, className, text = defaultText }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(
    () => value.map((item) => (item instanceof File ? URL.createObjectURL(item) : imageUrl(item.url, "card"))),
    [value]
  );
  useEffect(
    () => () => previews.forEach((p) => p.startsWith("blob:") && URL.revokeObjectURL(p)),
    [previews]
  );

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const room = MAX_IMAGES - value.length;
    const picked: File[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setError(text.type);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(text.size(MAX_FILE_SIZE_MB));
        continue;
      }
      const dup = value.some((v) => v instanceof File && v.name === file.name && v.size === file.size);
      if (!dup) picked.push(file);
    }
    if (picked.length > room) setError(text.max(MAX_IMAGES));
    if (picked.length) onChange([...value, ...picked.slice(0, room)]);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const makeCover = (i: number) => onChange([value[i], ...value.filter((_, idx) => idx !== i)]);

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {value.map((item, i) => (
          <div
            key={item instanceof File ? `${item.name}-${item.size}` : item.fileId}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted ring-1 ring-border">
            <img src={previews[i]} alt={`Photo ${i + 1}`} className="size-full object-cover" />
            {i === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur hover:bg-black/70">
                <Star className="size-3" /> Make cover
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-destructive"
              aria-label={`Remove photo ${i + 1}`}>
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-[4/5] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gold/50 bg-accent/40 p-2 text-center text-accent-foreground transition hover:border-primary hover:bg-accent"
            )}>
            <ImagePlus className="size-6" />
            <span className="text-xs font-semibold">{text.add}</span>
            <span className="text-[10px] text-muted-foreground">
              {value.length}/{MAX_IMAGES}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className={cn("mt-2 text-xs", error ? "font-medium text-destructive" : "text-muted-foreground")}>
        {error ?? `JPG or PNG, under ${MAX_FILE_SIZE_MB} MB each. A clear, recent face photo works best.`}
      </p>
    </div>
  );
};
