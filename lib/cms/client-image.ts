/** Shrinks a picture in the browser to fit within maxSide, as a JPEG. Used before every upload. */
export async function shrinkPicture(file: Blob, maxSide = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot process the picture. Try another browser.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The picture could not be processed."))), "image/jpeg", quality),
  );
}

export const PICTURE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PICTURE_BYTES = 5 * 1024 * 1024;

/** Returns a message when the file cannot be used, or null when it can. */
export function checkPicture(file: File): string | null {
  if (!PICTURE_TYPES.includes(file.type)) return "Choose a JPG, PNG or WebP picture.";
  if (file.size > MAX_PICTURE_BYTES) return "That picture is larger than 5 MB. Choose a smaller one.";
  return null;
}
