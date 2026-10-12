import { serviceBase } from "@/lib/admin/service";

/*
 * Everything the admin saves is checked here before it reaches the database. Text is
 * stripped of markup and control characters, so it is stored and shown as plain text.
 */

export function cleanText(input: unknown, max = 1000, multiline = false): string {
  if (typeof input !== "string") throw new Error("Text is required.");
  const plain = input.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const text = multiline ? plain.replace(/\r\n?/g, "\n").trim() : plain.replace(/\s+/g, " ").trim();
  if (text.length > max) throw new Error(`Text can be at most ${max} characters.`);
  return text;
}

/** A photo address the admin may use: one uploaded to our storage, or a file shipped with the site. */
export function isAllowedImage(url: string): boolean {
  if (url.startsWith("/images/")) return !url.includes("..");
  return url.startsWith(`${serviceBase()}/storage/v1/object/public/site-images/cms/`);
}



/** Checks a value for its kind of content and returns the cleaned value to store. */
export function cleanValue(key: string, value: unknown): unknown {
  if (key.startsWith("text:")) return cleanText(value, 1000, false);
  if (key.startsWith("image:")) {
    const v = (value ?? {}) as Record<string, unknown>;
    if (typeof v.url !== "string" || !isAllowedImage(v.url)) throw new Error("The image address is not allowed.");
    return { url: v.url, alt: cleanText(v.alt ?? "", 300) };
  }
  throw new Error("This content cannot be edited.");
}
