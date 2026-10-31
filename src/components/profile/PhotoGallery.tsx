import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProfilePlaceholder } from "@/components/common/ProfilePlaceholder";
import { imageUrl } from "@/utils/constants";
import type { ImageFile } from "@/utils/interfaces";

interface Props {
  images: ImageFile[];
  name?: string;
  seed?: string;
  /** From md up, shrink the main photo to fit the parent's height (thumbnails stay one row) instead of scrolling. */
  fill?: boolean;
}

/** Main photo + thumbnails, with a full-screen viewer. */
export const PhotoGallery = ({ images, name, seed, fill }: Props) => {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (!images.length) {
    return (
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-gold/30",
          fill && "md:min-h-0 md:shrink"
        )}>
        <ProfilePlaceholder name={name} seed={seed} />
        <span className="absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          <ImageOff className="size-3.5" /> No photos yet
        </span>
      </div>
    );
  }

  const current = images[Math.min(index, images.length - 1)];
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  return (
    <div className={cn("flex flex-col gap-2", fill && "md:min-h-0")}>
      <button
        type="button"
        onClick={() => setZoom(true)}
        className={cn(
          "relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-gold/30",
          fill && "md:min-h-0 md:shrink"
        )}>
        <img
          src={imageUrl(current.url, "card")}
          alt={name ? `${name}, photo ${index + 1}` : `Photo ${index + 1}`}
          className="size-full object-cover"
        />
      </button>
      {images.length > 1 && (
        <div className={cn("grid grid-cols-3 gap-2", fill && "md:flex md:shrink-0 md:overflow-x-auto")}>
          {images.map((img, i) => (
            <button
              type="button"
              key={img.fileId}
              onClick={() => setIndex(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-xl ring-2 ring-transparent transition",
                fill && "md:size-14 md:shrink-0",
                i === index ? "ring-primary" : "opacity-70 hover:opacity-100"
              )}>
              <img src={imageUrl(img.url, "thumb")} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        {/* Fixed-size frame: every photo is letterboxed into the same box, whatever its shape. */}
        <DialogContent
          showCloseButton={false}
          className="h-[min(85dvh,46rem)] w-[min(92vw,40rem)] max-w-none border-none bg-black p-0 sm:max-w-none">
          <DialogTitle className="sr-only">{name ?? "Photo"}</DialogTitle>
          <div className="relative size-full overflow-hidden rounded-lg">
            <img
              src={imageUrl(current.url, "full")}
              alt=""
              className="size-full object-contain"
            />
            <DialogClose
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black shadow-md ring-1 ring-black/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close">
              <X className="size-5" />
            </DialogClose>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md hover:bg-white"
                  aria-label="Previous photo">
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md hover:bg-white"
                  aria-label="Next photo">
                  <ChevronRight />
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
