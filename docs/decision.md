# Decision log

Architecture decision records (ADRs) for the HKBK College of Engineering website. Each record states the context, the decision, and its consequences. Records are never deleted: when a decision changes, add a new record and mark the old one **Superseded**.

| ID | Decision | Status | Date |
| --- | --- | --- | --- |
| ADR-001 | Next.js App Router on the 16.x LTS line | Accepted | 2026-10-03 |
| ADR-002 | Supabase (Postgres) as the only backend | Accepted | 2026-10-03 |
| ADR-003 | Row-level security on every table; public read, insert-only enquiries | Accepted | 2026-10-03 |
| ADR-004 | Content falls back to files in `/content` when Supabase is unavailable | Accepted | 2026-10-03 |
| ADR-005 | Static pages with 5-minute revalidation plus an on-demand refresh webhook | Accepted | 2026-10-03 |
| ADR-006 | One `enquiries` table and one Server Action for every form | Accepted | 2026-10-03 |
| ADR-007 | shadcn/ui on Tailwind CSS v4 design tokens | Accepted | 2026-10-05 |
| ADR-008 | Native checkbox and select inside shadcn styling | Accepted | 2026-10-05 |
| ADR-009 | Light and dark mode with next-themes and CSS variables | Accepted | 2026-10-05 |
| ADR-010 | Three Supabase clients: public, server (`@supabase/ssr`), browser | Accepted | 2026-10-05 |
| ADR-011 | Database types in the Supabase CLI format, regenerated with `db:types` | Accepted | 2026-10-05 |
| ADR-012 | One menu tree drives the header, footer and banners | Accepted | 2026-10-04 |
| ADR-013 | College-defined top menu, every item always visible | Accepted | 2026-10-05 |
| ADR-014 | Centres and initiatives are data rows that link to subdomains when live | Accepted | 2026-10-04 |
| ADR-015 | Messages carry a `section` so one table serves leadership and AI-First | Accepted | 2026-10-04 |
| ADR-016 | Key figures in a table; some figures are calculated, never stored | Accepted | 2026-10-04 |
| ADR-017 | Never invent facts: drafts, placeholders and "Sample entry" tags | Accepted | 2026-10-03 |
| ADR-018 | Self-hosted IBM Plex fonts and local images only | Accepted | 2026-10-03 |
| ADR-019 | Hostel and Admissions removed from the public site | Accepted | 2026-10-04 |
| ADR-020 | No sign-in and no session proxy until the staff portal | Superseded by ADR-024 | 2026-10-05 |
| ADR-021 | One-file database bootstrap (`supabase/setup_all.sql`) | Accepted | 2026-10-08 |
| ADR-022 | Automated invariant checks and a generated manifest | Accepted | 2026-10-08 |
| ADR-023 | No left panel on inner pages | Accepted | 2026-10-09 |
| ADR-024 | AI Faculty Champions come from a file, with a browser-only editor and zip export | Accepted | 2026-10-09 |
| ADR-024 | Staff editing of AI Champions: Supabase sign-in, editors list, RLS | Accepted | 2026-10-09 |

---

## ADR-001 Next.js App Router on the 16.x LTS line

**Context.** The brief asked for Next.js (later "Next.js 15" in the engineering standard). In October 2026 the supported long-term line is 16.x; 16.3.8 is the Active LTS and receives monthly security releases.

**Decision.** Use Next.js 16.3 with the App Router, React 19 and React Server Components. Follow the same conventions as 15 (`app/` directory, `layout.tsx`, `error.tsx`, `loading.tsx`, Server Actions).

**Consequences.** Security updates continue; no code differs from App Router conventions in 15. Route `params` are Promises and must be awaited. Downgrading to 15 would only lose security support.

## ADR-002 Supabase (Postgres) as the only backend

**Context.** The college asked for Supabase. The site needs editable content, form storage and, later, sign-in and file storage.

**Decision.** Supabase provides Postgres (content and enquiries), Storage (`site-images` bucket) and, in a later phase, Auth. No other backend service.

**Consequences.** Staff edit content in the Supabase dashboard until a staff portal exists. Schema lives in `supabase/migrations`.

## ADR-003 Row-level security on every table

**Context.** The publishable key is public by design; anything it can reach is reachable by anyone.

**Decision.** Enable RLS on every table. Content tables get a single `select` policy for `anon` and `authenticated`. `enquiries` gets an `insert` policy only. No update or delete policies exist for public roles.

**Consequences.** The public website can read content and submit forms, nothing else. Staff read enquiries in the dashboard. Enforced by INV-01 and INV-02 (see `invariants.md`).

## ADR-004 Content falls back to files in `/content`

**Context.** The site must run before Supabase is connected, and must not go blank if Supabase has an outage.

**Decision.** `lib/content.ts` reads Supabase first; on a missing client, an error or a network failure it logs a warning and reads the same content from `content/pages`, `content/messages` and `content/data`. The same files feed `npm run db:seed` and `supabase/setup_all.sql`.

**Consequences.** `/content` is the source of truth for initial content and the safety net afterwards. Once staff edit in Supabase, the database is authoritative and re-seeding overwrites rows with the same `slug`.

## ADR-005 Static pages with revalidation and an on-demand webhook

**Decision.** Content pages export `revalidate = 300`. `POST /api/revalidate` (protected by `x-revalidate-secret`) refreshes every page; a Supabase database webhook calls it on content changes.

**Consequences.** Fast, cacheable pages; edits appear within five minutes, or instantly with the webhook.

## ADR-006 One `enquiries` table and one Server Action

**Decision.** Contact, consultancy and corporate training forms (and the reserved admission and hostel types) post to `actions/enquiry.ts`, which validates input, rejects bots with a honeypot, requires consent, and inserts one row. Form-specific fields go in `details` (jsonb).

**Consequences.** One place to secure and audit; adding a form type needs a value in `ENQUIRY_TYPES` and in the database check constraint.

## ADR-007 shadcn/ui on Tailwind CSS v4 design tokens

**Context.** The engineering standard requires shadcn/ui, Tailwind utilities only, and consistent tokens.

**Decision.** Primitives live in `components/ui/` (Radix-based where interaction needs it). Feature components compose them. Colours come only from CSS-variable tokens defined in `app/globals.css`.

**Consequences.** Consistent look in both themes; new primitives can be added with `npx shadcn@latest add`. Hard-coded colours are blocked by INV-05 and INV-06.

## ADR-008 Native checkbox and select inside shadcn styling

**Context.** Radix Checkbox and Select only submit their values after JavaScript hydrates, but enquiry forms must work before JavaScript loads (progressive enhancement of Server Actions).

**Decision.** `components/ui/checkbox.tsx` and `native-select.tsx` wrap native inputs with shadcn styling.

**Consequences.** Forms submit correctly with or without JavaScript and remain accessible.

## ADR-009 Light and dark mode

**Decision.** `next-themes` sets a `dark` or `light` class on `<html>` from the system setting or the header toggle and remembers the choice. Tokens are redefined under `.dark`. Section colours used as text pair with a `-light` variant in dark mode.

**Consequences.** Every component supports both themes through tokens. Accessibility audits run in both themes.

## ADR-010 Three Supabase clients

**Decision.**
- `lib/supabase/public.ts`: cookie-free client for public reads in Server Components, so pages stay statically cached.
- `lib/supabase/server.ts`: `@supabase/ssr` server client for Server Actions and future authenticated pages.
- `lib/supabase/client.ts`: `@supabase/ssr` browser client for Client Components that need live data or auth.

**Consequences.** Public pages never read cookies (no forced dynamic rendering). Mutations use the session-aware client.

## ADR-011 Database types in the Supabase CLI format

**Context.** Types should be generated from the schema, but no live project was connected when the schema was written.

**Decision.** `lib/database.types.ts` is written in the exact output format of `supabase gen types typescript`; app types in `lib/types.ts` derive from it. `npm run db:types` regenerates it from the live project.

**Consequences.** Strict typing now; regenerate after connecting Supabase and after every migration. INV-09 checks every table is present.

## ADR-012 One menu tree

**Context.** The college asked for the same menu at the top and in the left panel; earlier versions drifted apart.

**Decision.** `buildMenu()` in `lib/menu.ts` defines the menu once; `getMenu()` in `lib/menu-server.ts` loads its data. The header, footer columns and page banners all render from it (the left panel it once also drove was removed; see ADR-023).

**Consequences.** A new page appears everywhere by editing one file. INV-13 blocks menu items defined elsewhere.

## ADR-013 College-defined top menu, every item always visible

**Decision.** Top menu order: Home, About, Programmes, Departments, Centre of Excellence, IEEE, Houses, Placements, MoUs, AI & Quantum Campus, IDEA Lab, IQAC. Items with sub-items open a mega menu (link columns plus a feature card). Every item is always shown: on screens narrower than 1280px the bar wraps and dropdowns open on tap or click; there is no collapsed "Menu" button.

**Consequences.** Long menu bars must still fit on one line at 1280px; item spacing is tuned for that (checked in `flow.md` verification steps).

## ADR-014 Centres and initiatives as data rows

**Context.** UHV, R&D, IEEE, IDEA Lab, Skill Development Centre, Equal Opportunity Cell and Alumni Network will each get their own subdomain site later.

**Decision.** Each is a row in the `portals` table (name kept for compatibility; the website calls them "Centres & Initiatives", never "portals"). Until a row has a `url` and `status = 'Live'`, menus link to a ready-made page at `/initiatives/<slug>`; afterwards they link to the subdomain in a new tab. `menu_group` places each row under Campus Life, Labs or R & D in data, and the menu groups them under Centre of Excellence, IEEE and IDEA Lab.

**Consequences.** Going live is a data change, not a code change. INV-11 prevents a Live row without a valid address.

## ADR-015 Messages carry a `section`

**Decision.** `leadership_messages.section` is `leadership` (Chairman, Director, Principal) or `ai-first` (an AI First Campus message; none at present). Leadership pages read `leadership`; the AI-First Campus section and page read `ai-first`.

**Consequences.** One table and one component (`LeaderMessage`) for all messages; the About menu lists only leadership messages.

## ADR-016 Key figures in a table, some calculated

**Decision.** `key_figures` holds the big numbers. Years of excellence (from 1997) and the AI Faculty Champions and AI Student Ambassadors counts (from `aiProgramme` in `lib/site.ts`) are calculated at render time and must stay empty in data (INV-10).

**Consequences.** Figures never go stale; staff update the rest in one table.

## ADR-017 Never invent facts

**Decision.** Content that the college has not supplied is either a clearly labelled draft (`status: draft` in front matter), a placeholder ("Figure coming soon", "Name coming soon", numbered champion cards), or a row with `is_sample = true` that shows a "Sample entry" tag. No invented statistics, names, partners or recruiters.

**Consequences.** The launch checklist (`docs/CONTENT_GUIDE.md`) lists every draft and placeholder to replace.

## ADR-018 Self-hosted fonts and local images

**Decision.** IBM Plex Sans and Serif via Fontsource; images as WebP/PNG in `public/images` (campus photograph, college logo, original AI and quantum illustrations). No remote images or font CDNs.

**Consequences.** No third-party requests for fonts; predictable performance; images must be added to the repository or to Supabase Storage.

## ADR-019 Hostel and Admissions removed

**Decision.** At the college's request, the Hostel and Admissions pages, links and seed rows were removed. The `hostel_facilities` table and the `admission`, `hostel_application` and `hostel_complaint` enquiry types remain in the schema, unused, so existing projects are not broken.

## ADR-020 No sign-in until the staff portal

**Decision.** The public site has no authentication, so no session-refresh `proxy.ts` is installed. It will be added with the staff portal (see `roadmap.md`).

**Consequences.** No per-request auth calls today; `lib/supabase/server.ts` is ready for authenticated features.

## ADR-021 One-file database bootstrap

**Decision.** `npm run db:sql` builds `supabase/setup_all.sql`: every migration plus every content row as idempotent upserts, wrapped in one transaction. It can be pasted into the Supabase SQL Editor and run any number of times.

**Consequences.** Setting up a new project takes one paste. INV-12 fails if the file falls out of date.

## ADR-022 Automated invariants and a generated manifest

**Decision.** `npm run check:invariants` verifies the automatable rules in `invariants.md`; `npm run docs:manifest` regenerates `docs/manifest.md` and `manifest.json` from the source.

**Consequences.** Documentation about the codebase cannot silently drift; run both before every release.

## ADR-023 No left panel on inner pages

**Context.** Inner pages had a left panel repeating the top menu, with a "You are in" header and a contact card. The college asked for the left panel to be removed.

**Decision.** Inner pages show the banner (with breadcrumb) and then the content at full container width. The top menu is the only menu; the footer keeps its link columns. The panel's components (`section-sidebar`, `sidebar-section`, `sidebar-help`) and `lib/menu-icons.ts` were deleted.

**Consequences.** More room for content on every inner page. Wayfinding relies on the top menu's active item, the section-coloured banner and the breadcrumb.

## ADR-024 Staff editing of AI Champions

**Context.** The AI First Campus office needs to add photos and details of the 15 AI Faculty Champions and 50 AI Student Ambassadors without editing files or the Supabase dashboard.

**Decision.** Supabase Auth with email and password at `/staff/login`; a `public.editors` list and `is_editor()` decide who may edit; RLS allows editors to change `ai_people` and upload only under `site-images/ai-people/`. Add or Edit buttons are client islands on each card that render nothing for the public, so pages stay static. Saves use Server Actions that re-check the editor and revalidate the affected pages. Each card has a stable id and people appear in the card matching their `sort_order`. Until Supabase is connected, the website preview offers the same form backed by the preview's own database and storage; its entries are copied into the project on request.

**Consequences.** Supersedes ADR-020 for this feature. Adding an editor is two steps in Supabase (create user, add to `editors`). A session-refresh proxy is not required because the browser client refreshes the session before each save; it can be added with the wider staff portal.

## ADR-024 AI Faculty Champions come from a file, with a browser-only editor

**Context.** The 15 faculty champions were stored in the `ai_people` table and edited by signed-in editors. The college asked for one data file with photos in the project, and an easy way to update cards without touching code.

**Decision.** `content/champions.json` is the only source for the 15 faculty champion cards, and photos live in `public/images/champions/`. `?edit=1` turns on an editor for that page visit. Everything happens in the browser: inline fields, a circular photo crop that saves a 400 × 400 JPG, Clear card, and Export update (.zip), which packages the updated `content/champions.json` and the new photos. Visitors never see the editor, and the editor code loads only in edit mode. Student ambassadors stay in the `ai_people` table with the staff sign-in.

**Consequences.** Faculty updates go through a file and a redeploy, not the database. Faculty Add and Edit buttons were removed, because the database rows are no longer read for faculty. The `faculty-champion` rows left in `ai_people` are ignored. Edits are not saved on the server, so an export must be copied into the project before the change is visible. INV-14 checks the file.
