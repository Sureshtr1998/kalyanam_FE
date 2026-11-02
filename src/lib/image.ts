const MAX_SIDE = 1600;

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

/**
 * Shrinks a photo to fit under `maxBytes` by resizing and re-encoding it as JPEG.
 * Files already under the limit are returned untouched; returns null if it can't get small enough.
 */
export const shrinkImage = async (file: File, maxBytes: number): Promise<File | null> => {
  if (file.size <= maxBytes) return file;
  try {
    // Honour the EXIF rotation so phone photos don't end up sideways.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    let side = Math.min(MAX_SIDE, Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 6; attempt++) {
      const scale = side / Math.max(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) break;
      // PNGs can be transparent; JPEG has no alpha, so paint white first.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await toBlob(canvas, attempt < 3 ? 0.85 - attempt * 0.1 : 0.7);
      if (blob && blob.size <= maxBytes) {
        bitmap.close();
        return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
      }
      if (attempt >= 2) side = Math.round(side * 0.8);
    }
    bitmap.close();
  } catch {
    // Unreadable image: fall through and let the caller show the size error.
  }
  return null;
};
