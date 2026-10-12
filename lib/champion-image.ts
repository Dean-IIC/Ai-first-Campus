/** Geometry for the photo crop: a square crop box, a zoom level and a pan offset, all in pixels. */

export const BOX = 240; // size of the crop circle on screen
export const OUT = 400; // size of the saved photo

export type Natural = { w: number; h: number };
export type Pan = { x: number; y: number };

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Scale and limits for the picture at a zoom level. The smaller side always fills the box. */
export function layout(nat: Natural, zoom: number, pan: Pan) {
  const scale = (BOX / Math.min(nat.w, nat.h)) * zoom;
  const maxX = Math.max(0, (nat.w * scale - BOX) / 2);
  const maxY = Math.max(0, (nat.h * scale - BOX) / 2);
  return { scale, maxX, maxY, clamped: { x: clamp(pan.x, -maxX, maxX), y: clamp(pan.y, -maxY, maxY) } };
}

/** The square of the source picture that is visible inside the crop circle. */
export function sourceRegion(nat: Natural, zoom: number, pan: Pan) {
  const { scale, clamped } = layout(nat, zoom, pan);
  const side = BOX / scale;
  const cx = nat.w / 2 - clamped.x / scale;
  const cy = nat.h / 2 - clamped.y / scale;
  return { sx: clamp(cx - side / 2, 0, nat.w - side), sy: clamp(cy - side / 2, 0, nat.h - side), side };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This picture could not be opened. Try a JPG or PNG."));
    img.src = src;
  });
}

/** Crops the chosen area to a 400 × 400 JPG. Runs in the browser only. */
export async function renderSquareJpeg(src: string, nat: Natural, zoom: number, pan: Pan): Promise<Blob> {
  const img = await loadImage(src);
  const { sx, sy, side } = sourceRegion(nat, zoom, pan);
  const canvas = document.createElement("canvas");
  canvas.width = OUT;
  canvas.height = OUT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot prepare the photo.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, OUT, OUT);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, side, side, 0, 0, OUT, OUT);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The photo could not be saved."))), "image/jpeg", 0.85),
  );
}

/** Reads a picture file as a data: address, so it can be kept in the draft. */
export function readFileAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The photo could not be read."));
    reader.readAsDataURL(blob);
  });
}
