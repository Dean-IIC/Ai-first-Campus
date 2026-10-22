/** Geometry for the faculty photo crop: a 3:4 portrait crop box, a zoom level and a pan offset, all in pixels. */

export const BOX_W = 240; // crop frame on screen
export const BOX_H = 320;
export const OUT_W = 600; // saved photo
export const OUT_H = 800;

export type Natural = { w: number; h: number };
export type Pan = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Scale and limits for the picture at a zoom level. The picture always covers the whole frame. */
export function portraitLayout(nat: Natural, zoom: number, pan: Pan) {
  const scale = Math.max(BOX_W / nat.w, BOX_H / nat.h) * zoom;
  const maxX = Math.max(0, (nat.w * scale - BOX_W) / 2);
  const maxY = Math.max(0, (nat.h * scale - BOX_H) / 2);
  return { scale, clamped: { x: clamp(pan.x, -maxX, maxX), y: clamp(pan.y, -maxY, maxY) } };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This picture could not be opened. Try a JPG or PNG."));
    img.src = src;
  });
}

/** Crops the area inside the frame to a 600 × 800 JPG. Runs in the browser only. */
export async function renderPortraitJpeg(src: string, nat: Natural, zoom: number, pan: Pan): Promise<Blob> {
  const img = await loadImage(src);
  const { scale, clamped } = portraitLayout(nat, zoom, pan);
  const sw = BOX_W / scale;
  const sh = BOX_H / scale;
  const sx = clamp(nat.w / 2 - clamped.x / scale - sw / 2, 0, nat.w - sw);
  const sy = clamp(nat.h / 2 - clamped.y / scale - sh / 2, 0, nat.h - sh);
  const canvas = document.createElement("canvas");
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot prepare the photo.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The photo could not be saved."))), "image/jpeg", 0.88),
  );
}
