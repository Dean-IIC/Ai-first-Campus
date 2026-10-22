import { AI_ROLES } from "@/lib/ai-people";
import { EVENT_CATEGORIES } from "@/lib/events";
import { MOU_STATUSES, MOU_TYPES } from "@/lib/mous";
import { DEPARTMENT_SLUGS, FACULTY_RANKS, NO_STATEMENT_KINDS } from "@/lib/site";
import type { ListTable } from "@/lib/types";

/*
 * What the admin's content editor can change, and how each field is edited and checked.
 * Saved values live in site_content under these keys:
 *   page:<slug>      title, summary and body of a page
 *   message:<slug>   a leadership message
 *   list:<table>     a whole list (departments, news, MoUs, ...), in display order
 *   site:details     address, phone and email
 *   site:links       the Alumni, R&D, UHV and Placement portal links used by those menu items
 *   site:alerts      who receives the email alert for each enquiry form
 * Values are laid over the content from Supabase or /content, so anything not saved keeps its original value.
 */

export type FieldKind = "text" | "long" | "markdown" | "number" | "bool" | "lines" | "image" | "link" | "date" | "choice" | "email";
/** `hideWhen`: the field is not shown, and is saved empty, for rows whose `key` field is one of `in`. */
export type Field = { key: string; label: string; kind: FieldKind; hint?: string; placeholder?: string; options?: readonly string[]; required?: boolean; hideWhen?: { key: string; in: readonly string[] } };
export type ListSpec = { label: string; item: string; title: string; fields: Field[] };

const t = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, kind: "text", ...extra });

/** False when the field is hidden for this row (see `hideWhen`). */
export function fieldShown(f: Field, row: Record<string, unknown>): boolean {
  return !f.hideWhen || !f.hideWhen.in.includes(String(row[f.hideWhen.key] ?? "").trim());
}

const noStatements = { hideWhen: { key: "kind", in: NO_STATEMENT_KINDS } };
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
  { key: "rndUrl", label: "R&D portal link", kind: "link", hint: "Paste the full address of the R&D portal. Leave empty to show the Research & Development page on this site." },
  { key: "uhvUrl", label: "UHV portal link", kind: "link", hint: "Paste the full address of the UHV portal. Leave empty to show the Universal Human Values page on this site." },
  { key: "placement_portal_link", label: "Placement Portal Link", kind: "link", placeholder: "https://placements.hkbkce.in", hint: "Paste the full address of the Placement Portal. Leave empty to show the Placement page on this site." },
];

/** site:ranks — the faculty designations, highest rank first; the Faculty tab groups people in this order. */
export const RANK_FIELDS: Field[] = [
  {
    key: "designations",
    label: "Faculty designations (one per line, highest rank first)",
    kind: "lines",
    required: true,
    hint: "The Faculty tab groups people in this order, after the head of the department. To add a designation, type it on its own line where it ranks, for example between Professor and Associate Professor.",
  },
];

export const ALERT_FIELDS: Field[] = [
  { key: "consultancy", label: "Consultancy form → email", kind: "email", hint: "Who is emailed when someone sends a consultancy request." },
  { key: "corporate_training", label: "Corporate training form → email", kind: "email", hint: "Who is emailed when someone sends a training enquiry." },
  { key: "contact", label: "Contact form → email", kind: "email", hint: "Who is emailed for the Contact page form, and for any form above left empty." },
];

export const LIST_SPECS: Record<ListTable, ListSpec> = {
  departments: { label: "Departments", item: "department", title: "name", fields: [
    t("name", "Name", { required: true }), t("short_name", "Short name"), t("kind", "Kind", { hint: "For example: Engineering" }), t("programmes", "Programmes"),
    long("description", "Description"), { ...long("vision", "Vision", "Several points: put each on its own line."), ...noStatements }, { key: "mission", label: "Mission (one point per line)", kind: "lines", ...noStatements },
    { key: "has_research_centre", label: "Has a VTU research centre", kind: "bool" }, { key: "research_areas", label: "Research areas (one per line)", kind: "lines" },
    { key: "show_research_tile", label: "Show the research centre tile", kind: "bool", hint: "Untick to hide the Research centre tile and overview row on this department's page." },
    // Optional sections: each shows on the department page only when it has content.
    { key: "history", label: "History of the programme (one year per line)", kind: "lines", hint: "Year, colon, milestone. For example: 2021–22: Department established with an intake of 60", ...noStatements },
    { key: "approvals", label: "Approvals (one per line)", kind: "lines", hint: "For example: Approved by AICTE", ...noStatements },
    { key: "peos", label: "Programme educational objectives (one per line)", kind: "lines", hint: "For example: PEO1: Graduates will …", ...noStatements },
    { key: "psos", label: "Programme specific outcomes (one per line)", kind: "lines", hint: "For example: PSO1: Professional skill: Apply …", ...noStatements },
    { key: "pos", label: "Programme outcomes (one per line)", kind: "lines", hint: "For example: PO1: Engineering knowledge: Apply …", ...noStatements },
    { key: "curriculum", label: "Curriculum (one semester per line)", kind: "lines", hint: "Semester (scheme), colon, subjects separated by semicolons. For example: Semester 1 (2025 scheme): Applied Mathematics-I; Applied Chemistry", ...noStatements },
    { key: "employment_scope", label: "Scope of employment (one per line)", kind: "lines", hint: "Heading, colon, text. For example: Government jobs: Preparation for the civil services …", ...noStatements },
    { key: "career_roles", label: "Career roles (one per line)", kind: "lines", hint: "For example: Data scientist", ...noStatements },
    { ...long("achievements", "Achievements", "Shown beside the achievements photo. A blank line starts a new paragraph."), ...noStatements },
    { key: "achievements_image", label: "Achievements photo", kind: "image", ...noStatements },
  ] },
  faculty: { label: "Faculty", item: "faculty member", title: "name", fields: [
    t("name", "Name", { required: true }),
    { key: "department", label: "Department", kind: "choice", options: DEPARTMENT_SLUGS, required: true, hint: "aiml is Artificial Intelligence & Machine Learning, cse is Computer Science and so on." },
    { key: "is_hod", label: "Head of the department", kind: "bool", hint: "Shown first, in a larger card. Tick it for one person per department." },
    t("designation", "Designation", { required: true, hint: `Type it exactly as in Edit content → Faculty designations (for example ${FACULTY_RANKS[2]}); faculty are grouped in that order.` }),
    t("qualification", "Qualification", { hint: "For example: M.Tech, Ph.D." }),
    { key: "photo_url", label: "Photo", kind: "image", hint: "A portrait photo works best." },
    { key: "sort_order", label: "Card number", kind: "number", hint: "Order of the card within its designation, starting at 1." },
  ] },
  news_items: { label: "News and events", item: "news item", title: "title", fields: [
    t("title", "Title", { required: true }), { key: "kind", label: "Type", kind: "choice", options: ["news", "event"], hint: "Only events are shown on the website." }, long("summary", "Summary"),
    { key: "published_on", label: "Published on", kind: "date", required: true }, { key: "event_date", label: "Event date (start)", kind: "date" }, { key: "end_date", label: "End date", kind: "date" },
    t("event_time", "Time", { hint: "For example: 10:00 am – 1:00 pm" }), t("venue", "Venue", { hint: "For example: Seminar Hall, Online" }),
    { key: "category", label: "Category", kind: "choice", options: EVENT_CATEGORIES, required: true }, { key: "poster_url", label: "Poster or photo", kind: "image" },
    { key: "link_url", label: "Registration or details link", kind: "link" }, sample,
  ] },
  mous: { label: "MoUs", item: "MoU", title: "partner", fields: [
    t("partner", "Partner", { required: true }), { key: "partner_type", label: "Type", kind: "choice", options: MOU_TYPES, required: true },
    t("departments", "Department(s) involved", { hint: "For example: CSE, ISE, or Institution-wide" }), t("association", "Association", { hint: "Who signed with the partner, for example: HKBKCE or VTU and HKBKCE" }),
    t("academic_year", "Academic year", { hint: "Academic years the MoU covers, for example: AY 2023-24 or AY 2023-26" }), long("purpose", "Purpose", "Two or three lines."),
    { key: "signed_on", label: "Signed on", kind: "date" }, { key: "valid_until", label: "Valid until", kind: "date" },
    { key: "status", label: "Status", kind: "choice", options: MOU_STATUSES, required: true, hint: "Automatic: Expired once Valid until has passed." },
    { key: "logo_url", label: "Logo", kind: "image" }, { key: "document_url", label: "Document link", kind: "link" },
    t("document_path", "Uploaded document", { hint: "Set by Upload PDF on the MoU card." }), { key: "document_public", label: "Show download link to visitors", kind: "bool" },
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
    t("title", "Title", { required: true }), t("client", "Client"), t("department", "Department"), t("area", "Area", { hint: "For example: Artificial Intelligence / Conversational AI" }),
    { key: "status", label: "Status", kind: "choice", options: ["Proposal", "Ongoing", "Completed", "Delivered (live in production)"], required: true }, year, long("summary", "Summary"),
    { key: "outcomes", label: "Outcomes (one per line)", kind: "lines" }, sample,
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
