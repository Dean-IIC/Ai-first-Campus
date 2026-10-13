import { AI_ROLES } from "@/lib/ai-people";
import type { ListTable } from "@/lib/types";

/*
 * What the admin's content editor can change, and how each field is edited and checked.
 * Saved values live in site_content under these keys:
 *   page:<slug>      title, summary and body of a page
 *   message:<slug>   a leadership message
 *   list:<table>     a whole list (departments, news, MoUs, ...), in display order
 *   site:details     address, phone and email
 *   site:links       the Alumni portal link used by the Alumni menu item
 * Values are laid over the content from Supabase or /content, so anything not saved keeps its original value.
 */

export type FieldKind = "text" | "long" | "markdown" | "number" | "bool" | "lines" | "image" | "link" | "date" | "choice";
export type Field = { key: string; label: string; kind: FieldKind; hint?: string; options?: readonly string[]; required?: boolean };
export type ListSpec = { label: string; item: string; title: string; fields: Field[] };

const t = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, kind: "text", ...extra });
const long = (key: string, label: string, hint?: string): Field => ({ key, label, kind: "long", hint });
const sample: Field = { key: "is_sample", label: "Placeholder entry (shows a “Sample entry” tag)", kind: "bool" };
const year: Field = { key: "year", label: "Year", kind: "number" };

export const PAGE_FIELDS: Field[] = [
  t("title", "Page title", { required: true }),
  long("summary", "Summary under the title"),
  { key: "body_md", label: "Page text", kind: "markdown", hint: "## starts a heading, - starts a bullet, **bold**, [link text](/address)." },
];

export const MESSAGE_FIELDS: Field[] = [
  t("designation", "Designation", { required: true }),
  t("name", "Name"),
  t("organisation", "Organisation"),
  { key: "photo_url", label: "Photo", kind: "image" },
  long("excerpt", "Short excerpt"),
  { key: "body_md", label: "Message", kind: "markdown", hint: "Leave a blank line between paragraphs." },
];

export const SITE_FIELDS: Field[] = [
  t("phone", "Phone number", { hint: "Leave empty to hide it." }),
  t("email", "Email address", { hint: "Leave empty to hide it." }),
  t("line1", "Address line 1"),
  t("line2", "Address line 2"),
  t("city", "City"),
  t("state", "State"),
  t("pin", "PIN code"),
  t("mapQuery", "Map search text", { hint: "What Google Maps searches for on the Contact page." }),
];

export const LINK_FIELDS: Field[] = [
  { key: "alumniUrl", label: "Alumni portal link", kind: "link", hint: "Paste the full address, for example https://alumni.hkbk.edu.in. Leave empty to show the Alumni page on this site." },
];

export const LIST_SPECS: Record<ListTable, ListSpec> = {
  departments: { label: "Departments", item: "department", title: "name", fields: [
    t("name", "Name", { required: true }), t("short_name", "Short name"), t("kind", "Kind", { hint: "For example: Engineering" }), t("programmes", "Programmes"),
    long("description", "Description"), long("vision", "Vision"), { key: "mission", label: "Mission (one point per line)", kind: "lines" },
    { key: "has_research_centre", label: "Has a VTU research centre", kind: "bool" }, { key: "research_areas", label: "Research areas (one per line)", kind: "lines" },
  ] },
  news_items: { label: "News and events", item: "news item", title: "title", fields: [
    t("title", "Title", { required: true }), { key: "kind", label: "Type", kind: "choice", options: ["news", "event"] }, long("summary", "Summary"),
    { key: "published_on", label: "Published on", kind: "date", required: true }, { key: "event_date", label: "Event date", kind: "date" }, { key: "link_url", label: "Link", kind: "link" }, sample,
  ] },
  mous: { label: "MoUs", item: "MoU", title: "partner", fields: [
    t("partner", "Partner", { required: true }), t("partner_type", "Partner type", { hint: "For example: Industry, University" }), long("purpose", "Purpose"),
    { key: "signed_on", label: "Signed on", kind: "date" }, { key: "valid_until", label: "Valid until", kind: "date" },
    { key: "document_url", label: "Document link", kind: "link" }, { key: "logo_url", label: "Logo", kind: "image" },
  ] },
  ai_people: { label: "AI Champions and Ambassadors", item: "person", title: "name", fields: [
    t("name", "Name", { required: true }), { key: "role", label: "Role", kind: "choice", options: AI_ROLES, required: true }, t("department", "Department"), t("bio", "Designation or year"), { key: "photo_url", label: "Photo", kind: "image" },
    { key: "sort_order", label: "Card number", kind: "number", hint: "Which numbered card the person fills in their section." },
  ] },
  key_figures: { label: "Key figures", item: "figure", title: "label", fields: [
    t("label", "Label", { required: true }), { key: "value", label: "Number", kind: "number", hint: "Leave empty for figures the site calculates itself." }, t("suffix", "After the number", { hint: "For example: + or %" }),
  ] },
  houses: { label: "Student houses", item: "house", title: "name", fields: [
    t("name", "Name", { required: true }), t("motto", "Motto"), long("namesake", "About the namesake"), long("about", "About the house"), { key: "is_placeholder", label: "Placeholder", kind: "bool" },
  ] },
  portals: { label: "Centres and initiatives", item: "initiative", title: "title", fields: [
    t("title", "Title", { required: true }), long("description", "Description"), { key: "url", label: "Web address", kind: "link", hint: "Set this and choose Live to link to its own site." },
    { key: "status", label: "Status", kind: "choice", options: ["Live", "Coming soon"], required: true }, t("category", "Category"), t("menu_group", "Menu section"), t("related_page", "Related page on this site", { hint: "For example: /uhv" }), t("icon", "Icon name"),
  ] },
  dashboards: { label: "Dashboards", item: "dashboard", title: "title", fields: [
    t("title", "Title", { required: true }), t("category", "Category"), long("description", "Description"), { key: "url", label: "Web address", kind: "link" }, { key: "status", label: "Status", kind: "choice", options: ["Live", "Beta", "In development"], required: true },
  ] },
  research_projects: { label: "Research projects", item: "project", title: "title", fields: [
    t("title", "Title", { required: true }), t("investigator", "Investigator"), t("funding_agency", "Funding agency"), { key: "status", label: "Status", kind: "choice", options: ["Proposed", "Ongoing", "Completed"], required: true }, year, long("summary", "Summary"), sample,
  ] },
  consultancy_projects: { label: "Consultancy projects", item: "project", title: "title", fields: [
    t("title", "Title", { required: true }), t("client", "Client"), t("department", "Department"), { key: "status", label: "Status", kind: "choice", options: ["Proposal", "Ongoing", "Completed"], required: true }, year, long("summary", "Summary"), sample,
  ] },
  training_programs: { label: "Corporate training programmes", item: "programme", title: "title", fields: [
    t("title", "Title", { required: true }), t("track", "Track"), t("duration", "Duration"), t("mode", "Mode"), t("audience", "Audience"), long("summary", "Summary"), sample,
  ] },
  uhv_activities: { label: "UHV activities", item: "activity", title: "title", fields: [
    t("title", "Title", { required: true }), t("activity_type", "Type"), long("description", "Description"),
  ] },
  journey_milestones: { label: "AI First journey timeline", item: "entry", title: "title", fields: [
    t("period", "Period", { required: true }), t("title", "Title"), long("summary", "Summary"), { key: "points", label: "Points (one per line)", kind: "lines" },
    { key: "status", label: "Status", kind: "choice", options: ["completed", "in_progress", "upcoming"], required: true }, t("badge", "Badge"), t("icon", "Icon name"), { key: "layer", label: "Layer (1 to 5)", kind: "number" },
  ] },
};

export const LIST_TABLES = Object.keys(LIST_SPECS) as ListTable[];
export const isListTable = (name: string): name is ListTable => name in LIST_SPECS;
