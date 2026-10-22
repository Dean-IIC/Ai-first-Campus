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

export const LOGO_TYPES = [...PICTURE_TYPES, "image/svg+xml"];

/** Returns a message when the file cannot be used as a logo, or null when it can. */
export function checkLogo(file: File): string | null {
  if (!LOGO_TYPES.includes(file.type)) return "Choose a JPG, PNG, WebP or SVG logo.";
  if (file.size > MAX_PICTURE_BYTES) return "That logo is larger than 5 MB. Choose a smaller one.";
  return null;
}

/**
 * Turns a logo (including SVG, which can carry scripts) into a plain PNG that fits within maxSide,
 * keeping transparency. Drawn through an <img> element, which also renders SVG files.
 */
export async function shrinkLogo(file: Blob, maxSide = 600): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode().catch(() => {
      throw new Error("That logo could not be read. Try a PNG or JPG file.");
    });
    const w = img.naturalWidth || 512;
    const h = img.naturalHeight || 512;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser cannot process the logo. Try another browser.");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The logo could not be processed."))), "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}
