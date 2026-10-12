import { randomUUID } from "node:crypto";
import { isAdminSession } from "@/lib/admin/session";
import { storeImage } from "@/lib/cms/write";

const MAX_BYTES = 5 * 1024 * 1024;

/** Recognises JPEG, PNG and WebP by their first bytes, not by the file name or the browser's guess. */
function detect(bytes: Uint8Array): { type: string; ext: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { type: "image/jpeg", ext: "jpg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { type: "image/png", ext: "png" };
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return { type: "image/webp", ext: "webp" };
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return Response.json({ error: "You are signed out." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose a picture to upload." }, { status: 400 });
    if (file.size > MAX_BYTES) return Response.json({ error: "The picture is larger than 5 MB." }, { status: 413 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const found = detect(bytes);
    if (!found) return Response.json({ error: "Only JPG, PNG or WebP pictures can be uploaded." }, { status: 415 });
    const url = await storeImage(bytes.buffer, found.type, `${randomUUID()}.${found.ext}`);
    return Response.json({ url });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "The picture could not be uploaded." }, { status: 500 });
  }
}
