import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/*
 * Browser helpers for staff editing. Used only by client components.
 * Public visitors never trigger a network call: without a stored session
 * the editor check returns false straight away.
 */

let editorCheck: Promise<boolean> | null = null;

function browserClient() {
  try {
    return createSupabaseBrowserClient();
  } catch {
    return null; // Supabase not configured (for example the static preview)
  }
}

/** True when a signed-in editor is viewing the page. Checked once per page load. */
export function checkEditor(): Promise<boolean> {
  if (editorCheck) return editorCheck;
  editorCheck = (async () => {
    const sb = browserClient();
    if (!sb) return false;
    try {
      const { data } = await sb.auth.getSession();
      if (!data.session) return false;
      const { data: isEditor, error } = await sb.rpc("is_editor");
      return !error && isEditor === true;
    } catch {
      return false;
    }
  })();
  return editorCheck;
}

/** Refreshes the session cookies before a Server Action runs, so an expired token is renewed first. */
export async function refreshSession(): Promise<void> {
  const sb = browserClient();
  if (sb) await sb.auth.getSession();
}

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

/** Shrinks a photo to at most 800px on its longest side, as JPEG. */
async function resizePhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot process photos. Try another browser.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The photo could not be processed."))), "image/jpeg", 0.86),
  );
}

/** Checks, resizes and uploads a photo to site-images/ai-people/; returns its public address. */
export async function uploadPersonPhoto(file: File): Promise<string> {
  if (!PHOTO_TYPES.includes(file.type)) throw new Error("Choose a JPG, PNG or WebP photo.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("The photo is larger than 15 MB. Choose a smaller one.");
  const sb = browserClient();
  if (!sb) throw new Error("The website is not connected to Supabase yet.");
  const blob = await resizePhoto(file);
  const path = `ai-people/${crypto.randomUUID()}.jpg`;
  const { error } = await sb.storage.from("site-images").upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) throw new Error("The photo could not be uploaded. Check that you are still signed in.");
  return sb.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}

/** Uploads a timeline photo that is already resized (see shrinkPicture) and returns its public address. */
export async function uploadJourneyPhoto(blob: Blob): Promise<string> {
  const sb = browserClient();
  if (!sb) throw new Error("The website is not connected to Supabase yet.");
  const path = `journey/${crypto.randomUUID()}.jpg`;
  const { error } = await sb.storage.from("site-images").upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) throw new Error("The photo could not be uploaded. Check that you are still signed in.");
  return sb.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}
