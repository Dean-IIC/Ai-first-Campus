# Manifest

Inventory of the HKBK College of Engineering website, generated from the source files by `npm run docs:manifest` on 2026-10-12. Do not edit by hand. A machine-readable copy is in `manifest.json`.

## Project

| Item | Value |
| --- | --- |
| Package | `hkbk-campus-website` version 0.25.2 |
| Description | HKBK College of Engineering website: AI First and Quantum Ready campus, built with Next.js and Supabase. |
| next | 16.3.8 |
| react | ^19.3.0 |
| typescript | ^5.9.3 |
| tailwindcss | ^4.3.3 |
| @supabase/supabase-js | ^2.117.2 |
| @supabase/ssr | ^0.12.7 |
| next-themes | ^0.4.6 |

## Routes (31)

Components used by a route may load more data (for example the home page sections); see the components table.

| Route | Type | Revalidate | Data read in the route file | File |
| --- | --- | --- | --- | --- |
| `/` | Static | - | `table:departments`, `table:news_items`, `table:journey_milestones`, `page:home-ai-first` | `app/page.tsx` |
| `/about` | Static | 300s | `page:about` | `app/about/page.tsx` |
| `/academics` | Static | 300s | `table:departments`, `page:academics` | `app/academics/page.tsx` |
| `/academics/[slug]` | Dynamic (pre-rendered) | 300s | `table:departments` | `app/academics/[slug]/page.tsx` |
| `/admin/login` | Static | - | - | `app/admin/login/page.tsx` |
| `/ai-quantum` | Static | 300s | `table:dashboards`, `page:ai-quantum` | `app/ai-quantum/page.tsx` |
| `/ai-quantum/ai-first` | Static | 300s | `page:ai-first` | `app/ai-quantum/ai-first/page.tsx` |
| `/ai-quantum/champions` | Static | - | `page:ai-champions` | `app/ai-quantum/champions/page.tsx` |
| `/ai-quantum/dashboards` | Static | 300s | `table:dashboards`, `page:dashboards` | `app/ai-quantum/dashboards/page.tsx` |
| `/ai-quantum/quantum-lab` | Static | 300s | `page:quantum-lab` | `app/ai-quantum/quantum-lab/page.tsx` |
| `/api/admin/session` | API | - | - | `app/api/admin/session/route.ts` |
| `/api/admin/upload` | API | - | - | `app/api/admin/upload/route.ts` |
| `/api/revalidate` | API | - | - | `app/api/revalidate/route.ts` |
| `/consultancy` | Static | 300s | `table:consultancy_projects`, `table:departments`, `page:consultancy` | `app/consultancy/page.tsx` |
| `/contact` | Static | 300s | `page:contact` | `app/contact/page.tsx` |
| `/corporate-training` | Static | 300s | `table:training_programs`, `page:corporate-training` | `app/corporate-training/page.tsx` |
| `/houses` | Static | 300s | `table:houses`, `page:houses` | `app/houses/page.tsx` |
| `/ieee` | Static | 300s | `page:ieee` | `app/ieee/page.tsx` |
| `/initiatives` | Static | 300s | `table:portals`, `page:initiatives` | `app/initiatives/page.tsx` |
| `/initiatives/[slug]` | Dynamic (pre-rendered) | 300s | `table:portals` | `app/initiatives/[slug]/page.tsx` |
| `/iqac` | Static | 300s | `page:iqac` | `app/iqac/page.tsx` |
| `/leadership` | Static | 300s | - | `app/leadership/page.tsx` |
| `/leadership/[slug]` | Dynamic (pre-rendered) | 300s | - | `app/leadership/[slug]/page.tsx` |
| `/mous` | Static | 300s | `table:mous`, `table:key_figures`, `page:mous` | `app/mous/page.tsx` |
| `/news` | Static | 300s | `table:news_items`, `page:news` | `app/news/page.tsx` |
| `/placements` | Static | 300s | `table:key_figures`, `page:placements` | `app/placements/page.tsx` |
| `/programmes` | Static | 300s | `table:departments`, `page:programmes` | `app/programmes/page.tsx` |
| `/research` | Static | 300s | `table:research_projects`, `page:research` | `app/research/page.tsx` |
| `/research/centres` | Static | 300s | `table:departments`, `page:research-centres` | `app/research/centres/page.tsx` |
| `/staff/login` | Static | - | - | `app/staff/login/page.tsx` |
| `/uhv` | Static | 300s | `table:uhv_activities`, `page:uhv` | `app/uhv/page.tsx` |

Also: `app/layout.tsx` (root layout), `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## Components (86 files)

| File | Lines | Runs on | Purpose |
| --- | --- | --- | --- |
| `components/features/admin/admin-provider.tsx` | 146 | Client | Holds the admin's session, edit mode, the saved overrides and the save status for the whole site. |
| `components/features/admin/admin-toolbar.tsx` | 68 | Client | Fixed bar at the top of every page for the signed-in admin. Visitors never see it. |
| `components/features/admin/history-panel.tsx` | 51 | Client | The last 30 changes. Restoring one puts back the text, photo or list it set. |
| `components/features/admin/login-form.tsx` | 42 | Client | Email and password for the single admin account. Errors are shown in one generic message. |
| `components/features/cms/editable-image.tsx` | 121 | Client | A picture that the admin can replace on the page. Visitors see the picture as before. In |
| `components/features/cms/editable-text.tsx` | 85 | Client | Text that the admin can change on the page. Visitors see the text exactly as before. In |
| `components/features/content/bits.tsx` | 83 | Server | Section heading used on the home page. |
| `components/features/content/content-tabs.tsx` | 77 | Client | Folder-style tabs built on shadcn/Radix Tabs. Every panel stays in the HTML |
| `components/features/content/image-feature.tsx` | 50 | Server | A large image with a caption panel, used for AI, quantum and campus features. |
| `components/features/content/markdown.tsx` | 31 | Server | - |
| `components/features/content/panel.tsx` | 49 | Server | A shadcn Card with an optional header. The coloured top edge and icon use |
| `components/features/content/project-list.tsx` | 46 | Server | Project rows for R&D and consultancy, with a coloured edge per section. |
| `components/features/content/vision-mission.tsx` | 32 | Server | College vision and mission, from the `vision-mission` page (Supabase or content/pages/vision-mission.md). |
| `components/features/departments/department-facts.tsx` | 40 | Server | Three small information tiles above the department tabs. |
| `components/features/departments/department-overview.tsx` | 22 | Server | Key facts about a department. |
| `components/features/departments/department-research.tsx` | 35 | Server | The department's research centre and its research areas. |
| `components/features/departments/department-vision-mission.tsx` | 40 | Server | A department's vision and mission as two highlighted tiles; several mission points show as a numbered list. |
| `components/features/departments/statement-tile.tsx` | 55 | Server | A highlighted statement card (department vision or mission). |
| `components/features/forms/enquiry-form.tsx` | 108 | Client | Enquiry form posting to the `submitEnquiry` Server Action. Works before JavaScript loads. |
| `components/features/forms/extra-field-input.tsx` | 37 | Server | Renders one form-specific field; its value is saved in the enquiry's `details`. |
| `components/features/forms/form-field.tsx` | 42 | Server | Label, optional marker, hint and error message around one form control. |
| `components/features/forms/types.ts` | 10 | Server | - |
| `components/features/home/ai-first-section.tsx` | 48 | Server | AI-First Campus: introduction, programme figures, the Chief AI and Quantum Officer's message, and every champion and ambassador. |
| `components/features/home/count-up.tsx` | 47 | Client | Counts from 0 to `value` once the number scrolls into view. The final number |
| `components/features/home/departments-panel.tsx` | 38 | Server | Grid of all departments, each linking to its page. |
| `components/features/home/explore-section.tsx` | 37 | Server | Research and industry panels. |
| `components/features/home/hero.tsx` | 51 | Server | Opening section: headline, key facts and the campus photograph with a frosted location badge. |
| `components/features/home/journey-bullets.tsx` | 43 | Client | The bullet points of one month: edit, reorder, remove, and add. |
| `components/features/home/journey-edit-button.tsx` | 70 | Client | Edit (filled months) or Add (empty months), plus move up and down. Shown only to signed-in editors. |
| `components/features/home/journey-edit-form.tsx` | 138 | Client | The fields of one month. Its photos and badge are kept as they are. |
| `components/features/home/journey-entry.tsx` | 135 | Server | Renders **bold** segments in a plain string. |
| `components/features/home/journey-photo-editor.tsx` | 140 | Client | The photo block for an editor: Replace or Add, Remove, and the caption and alt text. A month |
| `components/features/home/journey-photo.tsx` | 22 | Server | The photo shown between an entry's first paragraph and its bullet points: centred, at most 400px wide |
| `components/features/home/journey-section.tsx` | 25 | Server | "Our AI Transformation Journey 2026". Only the months with content are sent to visitors; |
| `components/features/home/journey-timeline.tsx` | 138 | Client | The timeline. Visitors see the months that have content, as the server sent them. A signed-in |
| `components/features/home/key-figures.tsx` | 62 | Server | Figures the site already knows, so they never drift out of date. |
| `components/features/home/leadership-section.tsx` | 20 | Server | All leadership messages in full, one below the other, in the featured message design. |
| `components/features/home/news-list.tsx` | 24 | Server | News or events in two columns, each with a calendar-style date. |
| `components/features/home/notices-section.tsx` | 37 | Server | Latest news and events in tabs. |
| `components/features/home/quick-access.tsx` | 41 | Server | Colour-coded shortcut tiles to the most-used pages. |
| `components/features/home/use-journey-drag.ts` | 47 | Client | Drag to reorder for the editor's timeline. Dragging starts from the card's text, not from its |
| `components/features/home/visit-strip.tsx` | 29 | Server | Closing call to visit or contact the college. |
| `components/features/infographics/donut-chart.tsx` | 69 | Server | Accessible SVG donut with a legend. Colours follow the section tones; the track and labels follow the theme. |
| `components/features/infographics/index.ts` | 4 | Server | - |
| `components/features/infographics/milestone-timeline.tsx` | 25 | Server | Horizontal timeline on wide screens, vertical on phones. |
| `components/features/infographics/process-steps.tsx` | 39 | Server | Numbered steps; in a row with arrows on wide screens, or a 2-column grid. |
| `components/features/initiatives/initiative-callout.tsx` | 37 | Server | Banner at the top of a page whose initiative has (or will have) its own site: UHV, R&D, IEEE. |
| `components/features/layout/content-page.tsx` | 70 | Server | Standard inner page: banner, then the content at full width. |
| `components/features/layout/footer-brand.tsx` | 62 | Server | Logo, motto, address and contact links at the start of the footer. |
| `components/features/layout/footer-columns.ts` | 51 | Server | Short footer labels for the IEEE chapters. |
| `components/features/layout/logo.tsx` | 7 | Server | The HKBK College of Engineering crest. |
| `components/features/layout/page-banner.tsx` | 71 | Server | Page banner: breadcrumb, title and summary on the section's tint. |
| `components/features/layout/site-footer.tsx` | 61 | Server | Site footer: brand and contact block, six link columns, and a slim bottom bar. |
| `components/features/layout/site-header.tsx` | 59 | Server | Main menu bar at the very top, then the logo row with contact details and the theme toggle. |
| `components/features/layout/theme-provider.tsx` | 13 | Client | Light and dark mode via a `dark` class on <html>, following the visitor's system setting by default. |
| `components/features/layout/theme-toggle.tsx` | 26 | Client | Switches between light and dark mode. Icons swap with CSS, so there is no hydration flash. |
| `components/features/mous/mou-card.tsx` | 49 | Server | One MoU: partner, type, purpose, dates and a link to the signed document. |
| `components/features/mous/mou-directory.tsx` | 47 | Server | All MoUs in tabs by partner type, or an empty state until the list is added. |
| `components/features/navigation/main-nav.tsx` | 96 | Client | The main menu bar. Every item is always visible: on wide screens dropdowns |
| `components/features/navigation/mega-menu.tsx` | 75 | Server | The dropdown for one menu item: link columns plus a feature card. |
| `components/features/navigation/nav-link.tsx` | 20 | Server | A menu link: internal pages use next/link; live initiative sites open in a new tab. |
| `components/features/people/ai-champions.tsx` | 46 | Server | Summary of the AI Champions programme, linking to the full page with every person. |
| `components/features/people/ai-people-grid.tsx` | 93 | Server | Puts each student ambassador in the card numbered by their sort_order (the position the |
| `components/features/people/champion-crop-dialog.tsx` | 147 | Client | Circular crop: drag or use the arrow keys to position the picture; the slider zooms. |
| `components/features/people/champion-view.tsx` | 91 | Server | One AI Faculty Champion card. A filled card shows the photo with a solid teal ring (or the |
| `components/features/people/editor-bar.tsx` | 35 | Client | Shown above the champions grid only to a signed-in editor. |
| `components/features/people/faculty-card.tsx` | 60 | Server | One AI Faculty Champion slot. It uses the same slot markers, Add/Edit button, form and save |
| `components/features/people/featured-message.tsx` | 83 | Server | Splits a leading salutation line ("Dear students, ...,") from the rest of the letter. |
| `components/features/people/person-edit-button.tsx` | 57 | Client | Add or Edit on one card. Renders nothing unless a signed-in editor is viewing. |
| `components/features/people/person-edit-form.tsx` | 142 | Client | The fields for one card. Student Ambassadors: photo, name, department and a short line. |
| `components/features/people/person-photo-field.tsx` | 77 | Client | The photo part of the Add/Edit form: preview, choose, and Remove photo. With `crop` on |
| `components/features/people/person-slot.tsx` | 78 | Server | One card in the AI Champions or Ambassadors grid: a real person, or a numbered placeholder. |
| `components/features/staff/sign-in-form.tsx` | 39 | Client | Staff sign-in with email and password; the Server Action checks the editors list. |
| `components/ui/alert.tsx` | 32 | Server | - |
| `components/ui/badge.tsx` | 33 | Server | - |
| `components/ui/button.tsx` | 42 | Server | - |
| `components/ui/card.tsx` | 41 | Server | - |
| `components/ui/checkbox.tsx` | 23 | Server | shadcn-styled checkbox built on the native input, so it submits with the |
| `components/ui/dialog.tsx` | 55 | Client | - |
| `components/ui/input.tsx` | 19 | Server | - |
| `components/ui/label.tsx` | 18 | Client | - |
| `components/ui/native-select.tsx` | 25 | Server | shadcn-styled native select: accessible, submits with the form, works without JavaScript. |
| `components/ui/separator.tsx` | 20 | Client | - |
| `components/ui/skeleton.tsx` | 9 | Server | - |
| `components/ui/tabs.tsx` | 39 | Client | - |
| `components/ui/textarea.tsx` | 18 | Server | - |

## Modules, actions and scripts (39)

| File | Lines | Purpose |
| --- | --- | --- |
| `lib/admin/config.ts` | 18 | - |
| `lib/admin/lockout.ts` | 41 | Minutes left on a lock, or 0 when sign-in is allowed. |
| `lib/admin/service.ts` | 31 | A JSON request to the database REST API. Returns null for 204 responses. |
| `lib/admin/session.ts` | 59 | The signing key: the session secret plus the password hash, so a new password ends all sessions. |
| `lib/ai-people.ts` | 24 | The two groups in the AI programme; values match ai_people.role. |
| `lib/areas.tsx` | 177 | - |
| `lib/champion-image.ts` | 64 | Geometry for the photo crop: a square crop box, a zoom level and a pan offset, all in pixels. |
| `lib/cms/client-image.ts` | 29 | Shrinks a picture in the browser to fit within maxSide, as a JPEG. Used before every upload. |
| `lib/cms/read.ts` | 22 | - |
| `lib/cms/validate.ts` | 34 | A photo address the admin may use: one uploaded to our storage, or a file shipped with the site. |
| `lib/cms/write.ts` | 83 | Saves a value (null removes it), and records the change. |
| `lib/content.ts` | 160 | Messages for one place on the site: "leadership" (default) or "ai-first". |
| `lib/database.types.ts` | 771 | Supabase database types for the HKBK website. |
| `lib/editor.ts` | 84 | True when a signed-in editor is viewing the page. Checked once per page load. |
| `lib/enquiry.ts` | 30 | Per-field messages, used to mark the matching input as invalid. |
| `lib/format.ts` | 28 | Formats an ISO date (YYYY-MM-DD) as "3 Oct 2026" without timezone shifts. |
| `lib/journey-model.ts` | 73 | Shared rules for the AI Transformation Journey timeline (visitors and editors). |
| `lib/markdown.ts` | 16 | Splits markdown into sections at each "## Heading". Text before the first heading is the intro. |
| `lib/menu-server.ts` | 15 | Loads everything the menu needs and builds it. Server components only. |
| `lib/menu.ts` | 242 | One item in the top menu. Items with `columns` open a dropdown; items with |
| `lib/portals.tsx` | 42 | A portal is clickable once it has an address and is marked Live. |
| `lib/site.ts` | 101 | Opens another site (a live initiative subdomain) in a new tab. |
| `lib/supabase/client.ts` | 13 | Browser client from @supabase/ssr, for Client Components that need live data or auth. |
| `lib/supabase/env.ts` | 14 | Supabase URL and public key from the environment, or null when the project is not connected yet. |
| `lib/supabase/public.ts` | 18 | Cookie-free client for public content (pages, departments, news...). |
| `lib/supabase/server.ts` | 31 | Server client from @supabase/ssr for Server Actions, Route Handlers and |
| `lib/types.ts` | 44 | - |
| `lib/ui.ts` | 106 | Wider container for the menu bar and logo row. |
| `lib/utils.ts` | 8 | Merges Tailwind classes, letting later classes override earlier ones. |
| `actions/admin.ts` | 100 | Compares two strings in constant time, so the check does not reveal how much matched. |
| `actions/ai-people.ts` | 114 | The person's slug when editing an existing card; omit to add a new person. |
| `actions/auth.ts` | 45 | Staff sign-in with email and password. Only accounts on the editors list stay signed in. |
| `actions/enquiry.ts` | 80 | Validates an enquiry form and stores it in the `enquiries` table (insert-only under RLS). |
| `actions/journey.ts` | 166 | A Supabase client for a signed-in editor, or a message explaining why not. |
| `scripts/build-manifest.mjs` | 149 | Generates docs/manifest.md and manifest.json: an inventory of the project |
| `scripts/build-setup-sql.mjs` | 91 | Builds supabase/setup_all.sql: every migration plus all content from /content, |
| `scripts/check-invariants.mjs` | 163 | Verifies the automatable invariants in docs/invariants.md. |
| `scripts/hash-admin-password.mjs` | 26 | Creates the bcrypt hash for ADMIN_PASSWORD_HASH. Usage: npm run admin:hash |
| `scripts/seed.mjs` | 91 | Uploads everything in /content to Supabase. |

## Database

Migrations, applied in order:

- `supabase/migrations/20261003000000_init.sql`
- `supabase/migrations/20261003010000_portals.sql`
- `supabase/migrations/20261003020000_departments_ai_people.sql`
- `supabase/migrations/20261003030000_message_section.sql`
- `supabase/migrations/20261003040000_key_figures.sql`
- `supabase/migrations/20261003050000_initiative_menu_group.sql`
- `supabase/migrations/20261003060000_houses.sql`
- `supabase/migrations/20261003070000_mous.sql`
- `supabase/migrations/20261009000000_journey.sql`
- `supabase/migrations/20261009010000_editors.sql`
- `supabase/migrations/20261010000000_admin_cms.sql`
- `supabase/migrations/20261010020000_journey_editing.sql`
- `supabase/migrations/20261010030000_journey_inline_photo.sql`
- `supabase/migrations/20261010040000_august_entry.sql`

| Table | Columns | Column names |
| --- | --- | --- |
| `pages` | 5 | `slug`, `title`, `summary`, `body_md`, `updated_at` |
| `leadership_messages` | 10 | `slug`, `name`, `designation`, `organisation`, `excerpt`, `photo_url`, `body_md`, `sort_order`, `section`, `updated_at` |
| `departments` | 13 | `id`, `slug`, `name`, `short_name`, `kind`, `programmes`, `description`, `vision`, `mission`, `has_research_centre`, `research_areas`, `sort_order`, `updated_at` |
| `dashboards` | 9 | `id`, `slug`, `title`, `category`, `description`, `url`, `status`, `sort_order`, `updated_at` |
| `uhv_activities` | 7 | `id`, `slug`, `activity_type`, `title`, `description`, `sort_order`, `updated_at` |
| `research_projects` | 11 | `id`, `slug`, `title`, `investigator`, `funding_agency`, `status`, `year`, `summary`, `is_sample`, `sort_order`, `updated_at` |
| `consultancy_projects` | 11 | `id`, `slug`, `title`, `client`, `department`, `status`, `year`, `summary`, `is_sample`, `sort_order`, `updated_at` |
| `training_programs` | 11 | `id`, `slug`, `title`, `track`, `duration`, `mode`, `audience`, `summary`, `is_sample`, `sort_order`, `updated_at` |
| `hostel_facilities` | 7 | `id`, `slug`, `title`, `description`, `is_sample`, `sort_order`, `updated_at` |
| `news_items` | 10 | `id`, `slug`, `kind`, `title`, `summary`, `published_on`, `event_date`, `link_url`, `is_sample`, `updated_at` |
| `enquiries` | 9 | `id`, `type`, `name`, `email`, `phone`, `message`, `details`, `status`, `created_at` |
| `portals` | 12 | `id`, `slug`, `title`, `description`, `url`, `category`, `icon`, `status`, `related_page`, `menu_group`, `sort_order`, `updated_at` |
| `ai_people` | 9 | `id`, `slug`, `name`, `role`, `department`, `bio`, `photo_url`, `sort_order`, `updated_at` |
| `key_figures` | 7 | `id`, `slug`, `label`, `value`, `suffix`, `sort_order`, `updated_at` |
| `houses` | 9 | `id`, `slug`, `name`, `namesake`, `about`, `motto`, `is_placeholder`, `sort_order`, `updated_at` |
| `mous` | 11 | `id`, `slug`, `partner`, `partner_type`, `purpose`, `signed_on`, `valid_until`, `document_url`, `logo_url`, `sort_order`, `updated_at` |
| `journey_milestones` | 14 | `id`, `slug`, `period`, `title`, `summary`, `points`, `badge`, `icon`, `inline_photo`, `layer`, `photos`, `sort_order`, `status`, `updated_at` |
| `editors` | 4 | `user_id`, `email`, `role`, `created_at` |
| `site_content` | 3 | `key`, `value`, `updated_at` |
| `site_history` | 6 | `id`, `key`, `label`, `old_value`, `new_value`, `created_at` |
| `admin_security` | 3 | `id`, `failed_attempts`, `locked_until` |

## Content

- Pages (`content/pages`): 23
- Messages (`content/messages`): 4
- `content/data/ai_people.json`: 13 row(s)
- `content/data/consultancy_projects.json`: 3 row(s)
- `content/data/dashboards.json`: 7 row(s)
- `content/data/departments.json`: 10 row(s)
- `content/data/houses.json`: 5 row(s)
- `content/data/journey_milestones.json`: 11 row(s)
- `content/data/key_figures.json`: 11 row(s)
- `content/data/mous.json`: 0 row(s)
- `content/data/news_items.json`: 4 row(s)
- `content/data/portals.json`: 7 row(s)
- `content/data/research_projects.json`: 3 row(s)
- `content/data/training_programs.json`: 8 row(s)
- `content/data/uhv_activities.json`: 6 row(s)

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REVALIDATE_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`

## npm scripts

| Command | Runs |
| --- | --- |
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | `node --env-file=.env.local scripts/seed.mjs` |
| `npm run db:types` | `supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" --schema public > lib/database.types.ts` |
| `npm run db:seed:no-samples` | `node --env-file=.env.local scripts/seed.mjs --no-samples` |
| `npm run db:sql` | `node scripts/build-setup-sql.mjs > supabase/setup_all.sql` |
| `npm run check:invariants` | `node scripts/check-invariants.mjs` |
| `npm run docs:manifest` | `node scripts/build-manifest.mjs` |
| `npm run admin:hash` | `node scripts/hash-admin-password.mjs` |

## Documentation

- `docs/ADMIN_GUIDE.md`
- `docs/AGENT_SETUP_PROMPT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `docs/SETUP.md`
- `docs/changelog.md`
- `docs/decision.md`
- `docs/design.md`
- `docs/feature-tickets.md`
- `docs/flow.md`
- `docs/invariants.md`
- `docs/manifest.md`
- `docs/master-spec.md`
- `docs/prd.md`
- `docs/roadmap.md`
- `docs/rules.md`
- `docs/security.md`
- `README.md`
- `AGENTS.md`
