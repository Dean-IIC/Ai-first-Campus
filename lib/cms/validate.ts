import { serviceBase } from "@/lib/admin/service";
import { CAROUSEL_KEY, MAX_SLIDES } from "@/lib/carousel";
import { MOU_DOCUMENT_PATH } from "@/lib/mous";
import { ALERT_FIELDS, LINK_FIELDS, LIST_SPECS, MESSAGE_FIELDS, PAGE_FIELDS, RANK_FIELDS, SITE_FIELDS, fieldShown, isListTable, type Field } from "./schema";

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

const LINK = /^(https?:\/\/[^\s]+|\/[^\s]*|#[\w-]*|mailto:[^\s]+|tel:[+\d\s-]+)$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Checks one field. Empty optional values become null (or [] / false), as the database stores them. */
function cleanField(f: Field, raw: unknown): unknown {
  const str = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  const fail = (why: string) => {
    throw new Error(`${f.label}: ${why}`);
  };
  switch (f.kind) {
    case "bool":
      return raw === true;
    case "number": {
      if (str.trim() === "") return null;
      const n = Number(str);
      return Number.isFinite(n) ? n : fail("enter a number.");
    }
    case "lines": {
      const items = Array.isArray(raw) ? raw : str.split("\n");
      return items.map((s) => cleanText(String(s ?? ""), 600)).filter(Boolean).slice(0, 60);
    }
    case "image": {
      const url = str.trim();
      if (!url) return null;
      return isAllowedImage(url) ? url : fail("upload the picture here instead of pasting an address.");
    }
    case "link": {
      const url = str.trim();
      if (!url) return null;
      return LINK.test(url) ? url : fail("use a full web address (https://…) or a page on this site (/…).");
    }
    case "date": {
      const d = str.trim();
      if (!d) return f.required ? fail("choose a date.") : null;
      return DATE.test(d) ? d : fail("choose a date.");
    }
    case "email": {
      const e = str.trim();
      if (!e) return "";
      return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(e) && e.length <= 200 ? e : fail("enter a valid email address.");
    }
    case "choice":
      return f.options?.includes(str) ? str : fail("choose one of the options.");
    default: {
      const text = cleanText(str, f.kind === "markdown" ? 30000 : f.kind === "long" ? 4000 : 300, f.kind !== "text");
      if (f.required && !text) fail("this cannot be empty.");
      return text;
    }
  }
}

function cleanRecord(fields: Field[], value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Nothing to save.");
  const v = value as Record<string, unknown>;
  return Object.fromEntries(fields.map((f) => [f.key, cleanField(f, v[f.key])]));
}

const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;

/** MoUs saved before Type and Status were editable get the defaults, so older rows still save. */
function withMouDefaults(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, unknown>;
  return { ...r, partner_type: r.partner_type || "Industry", status: r.status || "Automatic", document_path: r.document_path || "" };
}

/** Rows saved before Category was editable get "Other"; an event without a publish date uses its start date. */
function withEventDefaults(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, unknown>;
  return { ...r, kind: r.kind || "event", category: r.category || "Other", published_on: r.published_on || r.event_date };
}

/** A list in display order. Each row keeps its slug; new rows get one from their title. */
function cleanList(table: string, value: unknown): Record<string, unknown>[] {
  if (!isListTable(table)) throw new Error("This list cannot be edited.");
  if (!Array.isArray(value) || value.length > 300) throw new Error("The list could not be read.");
  const spec = LIST_SPECS[table];
  const seen = new Set<string>();
  return value.map((raw, i) => {
    const row = table === "mous" ? withMouDefaults(raw) : table === "news_items" ? withEventDefaults(raw) : raw;
    const clean = cleanRecord(spec.fields, row);
    if (table === "mous" && clean.document_path && !MOU_DOCUMENT_PATH.test(String(clean.document_path))) throw new Error(`Row ${i + 1}: the uploaded document could not be recognised. Upload it again.`);
    // Fields hidden for this row (e.g. vision and mission for basic sciences) are always saved empty.
    for (const f of spec.fields) if (!fieldShown(f, clean)) clean[f.key] = cleanField(f, null);
    const given = String((row as Record<string, unknown>).slug ?? "");
    const base = given || String(clean[spec.title] ?? spec.item).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "item";
    let slug = base;
    for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
    if (!SLUG.test(slug)) throw new Error(`Row ${i + 1} has an address name that is not allowed.`);
    seen.add(slug);
    // Lists with a "Card number" field keep the number the admin gave; others are numbered in order.
    const order = typeof clean.sort_order === "number" && clean.sort_order >= 1 ? Math.round(clean.sort_order) : i + 1;
    return { slug, ...clean, sort_order: order };
  });
}

/** Home page carousel: up to MAX_SLIDES photos, each an allowed image with alt text and an optional badge. */
function cleanCarousel(value: unknown): { src: string; alt: string; title: string; subtitle: string; fit: "cover" | "contain" }[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error("Add at least one photo.");
  if (value.length > MAX_SLIDES) throw new Error(`The carousel can hold at most ${MAX_SLIDES} photos.`);
  return value.map((raw, i) => {
    const s = (raw ?? {}) as Record<string, unknown>;
    const src = typeof s.src === "string" ? s.src.trim() : "";
    if (!src || !isAllowedImage(src)) throw new Error(`Photo ${i + 1}: upload the picture here instead of pasting an address.`);
    const alt = cleanText(s.alt ?? "", 300);
    if (!alt) throw new Error(`Photo ${i + 1}: describe the photo in the alt text.`);
    return { src, alt, title: cleanText(s.title ?? "", 80), subtitle: cleanText(s.subtitle ?? "", 120), fit: s.fit === "contain" ? "contain" : "cover" };
  });
}

/** Faculty designations, highest rank first: at least one, each once, at most 20. */
function cleanRanks(value: unknown): { designations: string[] } {
  const { designations } = cleanRecord(RANK_FIELDS, value) as { designations: string[] };
  const unique = [...new Set(designations.map((d) => d.slice(0, 80)))];
  if (unique.length === 0) throw new Error("Add at least one designation.");
  if (unique.length > 20) throw new Error("Keep the list to 20 designations or fewer.");
  return { designations: unique };
}

/** Checks a value for its kind of content and returns the cleaned value to store. */
export function cleanValue(key: string, value: unknown): unknown {
  if (key.startsWith("text:")) return cleanText(value, 1000, false);
  if (key.startsWith("image:")) {
    const v = (value ?? {}) as Record<string, unknown>;
    if (typeof v.url !== "string" || !isAllowedImage(v.url)) throw new Error("The image address is not allowed.");
    return { url: v.url, alt: cleanText(v.alt ?? "", 300) };
  }
  if (/^page:[a-z0-9-]+$/.test(key)) return cleanRecord(PAGE_FIELDS, value);
  if (/^message:[a-z0-9-]+$/.test(key)) return cleanRecord(MESSAGE_FIELDS, value);
  if (key === "site:details") return cleanRecord(SITE_FIELDS, value);
  if (key === "site:links") return cleanRecord(LINK_FIELDS, value);
  if (key === "site:alerts") return cleanRecord(ALERT_FIELDS, value);
  if (key === "site:ranks") return cleanRanks(value);
  if (key.startsWith("list:")) return cleanList(key.slice(5), value);
  if (key === CAROUSEL_KEY) return cleanCarousel(value);
  throw new Error("This content cannot be edited.");
}
