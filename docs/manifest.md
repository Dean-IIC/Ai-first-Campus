# Manifest

Inventory of the HKBK College of Engineering website, generated from the source files by `npm run docs:manifest` on 2026-10-22. Do not edit by hand. A machine-readable copy is in `manifest.json`.

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
| `/academics/[slug]` | Dynamic (pre-rendered) | 300s | `table:departments`, `table:faculty` | `app/academics/[slug]/page.tsx` |
| `/admin/enquiries` | Static | - | - | `app/admin/enquiries/page.tsx` |
| `/admin/login` | Static | - | - | `app/admin/login/page.tsx` |
| `/ai-quantum` | Static | - | `page:ai-quantum` | `app/ai-quantum/page.tsx` |
| `/alumni` | Static | 300s | `page:alumni` | `app/alumni/page.tsx` |
| `/api/admin/enquiries/csv` | API | - | - | `app/api/admin/enquiries/csv/route.ts` |
| `/api/admin/session` | API | - | - | `app/api/admin/session/route.ts` |
| `/api/admin/upload` | API | - | - | `app/api/admin/upload/route.ts` |
| `/api/mous/document` | API | - | `table:mous` | `app/api/mous/document/route.ts` |
| `/api/revalidate` | API | - | - | `app/api/revalidate/route.ts` |
| `/consultancy` | Static | 300s | `table:consultancy_projects`, `table:departments`, `page:consultancy` | `app/consultancy/page.tsx` |
| `/contact` | Static | 300s | `page:contact` | `app/contact/page.tsx` |
| `/corporate-training` | Static | 300s | `table:training_programs`, `page:corporate-training` | `app/corporate-training/page.tsx` |
| `/events` | Static | - | `table:news_items`, `page:news` | `app/events/page.tsx` |
| `/houses` | Static | 300s | `table:houses`, `page:houses` | `app/houses/page.tsx` |
| `/ieee` | Static | 300s | `page:ieee` | `app/ieee/page.tsx` |
| `/initiatives` | Static | 300s | `table:portals`, `page:initiatives` | `app/initiatives/page.tsx` |
| `/initiatives/[slug]` | Dynamic (pre-rendered) | 300s | `table:portals` | `app/initiatives/[slug]/page.tsx` |
| `/iqac` | Static | 300s | `page:iqac` | `app/iqac/page.tsx` |
| `/leadership` | Static | 300s | - | `app/leadership/page.tsx` |
| `/leadership/[slug]` | Dynamic (pre-rendered) | 300s | - | `app/leadership/[slug]/page.tsx` |
| `/mous` | Static | - | `table:mous`, `table:key_figures`, `table:departments`, `page:mous` | `app/mous/page.tsx` |
| `/placements` | Static | 300s | `table:key_figures`, `page:placements` | `app/placements/page.tsx` |
| `/programmes` | Static | 300s | `table:departments`, `page:programmes` | `app/programmes/page.tsx` |
| `/research` | Static | 300s | `table:research_projects`, `page:research` | `app/research/page.tsx` |
| `/research/centres` | Static | 300s | `table:departments`, `page:research-centres` | `app/research/centres/page.tsx` |
| `/rnd` | Static | 300s | `page:rnd` | `app/rnd/page.tsx` |
| `/uhv` | Static | 300s | `table:uhv_activities`, `page:uhv` | `app/uhv/page.tsx` |

Also: `app/layout.tsx` (root layout), `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## Components (128 files)

| File | Lines | Runs on | Purpose |
| --- | --- | --- | --- |
| `components/features/admin/admin-provider.tsx` | 149 | Client | Holds the admin's session, edit mode, the saved overrides and the save status for the whole site. |
| `components/features/admin/admin-toolbar.tsx` | 93 | Client | Fixed bar at the top of every page for the signed-in admin. Visitors never see it. |
| `components/features/admin/enquiries/enquiry-card.tsx` | 101 | Client | One enquiry: what the visitor sent (shown as plain text), its status, the admin note and the email alert result. |
| `components/features/admin/enquiries/enquiry-filters.tsx` | 48 | Server | Filter by form and status, and search by name, email or organisation. A plain GET form. |
| `components/features/admin/history-panel.tsx` | 51 | Client | The last 30 changes. Restoring one puts back the text, photo or list it set. |
| `components/features/admin/login-form.tsx` | 42 | Client | Email and password for the single admin account. Errors are shown in one generic message. |
| `components/features/cms/carousel-form.tsx` | 126 | Client | The home page carousel in Edit content: upload photos (shrunk to 1600 px and compressed before |
| `components/features/cms/content-editor.tsx` | 111 | Client | The admin's editor for everything stored as content: pages, leadership messages, every list and the contact details. |
| `components/features/cms/editable-text.tsx` | 85 | Client | Text that the admin can change on the page. Visitors see the text exactly as before. In |
| `components/features/cms/field-input.tsx` | 66 | Client | One field of the content editor, edited with the control that suits its kind. |
| `components/features/cms/image-field.tsx` | 58 | Client | A photo in the content editor: shows the current one, uploads a replacement, or removes it. |
| `components/features/cms/list-form.tsx` | 100 | Client | Edits a whole list: change any item, add, delete and reorder. Saved in one go. |
| `components/features/cms/record-form.tsx` | 40 | Client | Edits one item: a page, a leadership message or the contact details. |
| `components/features/cms/save-bar.tsx` | 23 | Client | The Save button at the foot of the content editor, with the result of the last save. |
| `components/features/content/bits.tsx` | 84 | Server | Section heading used on the home page. |
| `components/features/content/content-tabs.tsx` | 77 | Client | Folder-style tabs built on shadcn/Radix Tabs. Every panel stays in the HTML |
| `components/features/content/image-feature.tsx` | 50 | Server | A large image with a caption panel, used for AI, quantum and campus features. |
| `components/features/content/markdown.tsx` | 31 | Server | - |
| `components/features/content/panel.tsx` | 49 | Server | A shadcn Card with an optional header. The coloured top edge and icon use |
| `components/features/content/project-list.tsx` | 58 | Server | Optional bullet points shown under the summary (consultancy outcomes). |
| `components/features/content/vision-mission.tsx` | 32 | Server | College vision and mission, from the `vision-mission` page (Supabase or content/pages/vision-mission.md). |
| `components/features/departments/achievement-card-form.tsx` | 98 | Client | An achievement as a form, for Add and Edit: title, year or date, description and a photo (shrunk in |
| `components/features/departments/achievement-card.tsx` | 99 | Client | One achievement: its framed photo, title, year and the start of the description. Clicking it |
| `components/features/departments/achievement-frame.tsx` | 26 | Server | A gallery-style frame: a thin green-to-teal border, a light mat and a fine inner line around the |
| `components/features/departments/achievement-list.tsx` | 44 | Client | The department's achievements as framed cards (click one to open it), with the admin's Add achievement on top. |
| `components/features/departments/achievements-editor.tsx` | 66 | Client | A short random id for a new achievement. |
| `components/features/departments/department-achievements.tsx` | 13 | Server | The department's achievements: framed cards that open on click, edited on the tab by the signed-in admin. |
| `components/features/departments/department-careers.tsx` | 63 | Server | Icon for a scope card, chosen from words in its heading. |
| `components/features/departments/department-curriculum.tsx` | 35 | Server | The curriculum as one card per semester: its scheme and its subjects. |
| `components/features/departments/department-facts.tsx` | 45 | Server | Three small information tiles above the department tabs. |
| `components/features/departments/department-faculty.tsx` | 64 | Client | Group headings for the usual designations; any other designation is used as written. |
| `components/features/departments/department-history.tsx` | 51 | Server | The last whole number in a milestone ("Intake increased from 60 to 120" → 120). |
| `components/features/departments/department-outcomes.tsx` | 32 | Server | Programme educational objectives, programme specific outcomes and programme outcomes. |
| `components/features/departments/department-overview.tsx` | 35 | Server | Key facts about a department, then the programme's history when it has one. A department |
| `components/features/departments/department-research.tsx` | 35 | Server | The department's research centre and its research areas. |
| `components/features/departments/department-vision-mission.tsx` | 58 | Server | One statement, or several as a numbered list. When every point starts with its own label |
| `components/features/departments/faculty-card-form.tsx` | 149 | Client | A faculty member as a form, for Add and Edit: name, designation, qualification, head of the |
| `components/features/departments/faculty-card.tsx` | 62 | Client | One faculty member. Visitors see the card. The signed-in admin also sees Edit and Delete; |
| `components/features/departments/faculty-editor.tsx` | 74 | Client | Designations, highest rank first (Edit content → Faculty designations). |
| `components/features/departments/faculty-view.tsx` | 60 | Server | Shown before any faculty member is added: one empty portrait frame and a note. |
| `components/features/departments/intake-chart.tsx` | 73 | Server | A round axis top above the largest value (50, 100, 200, 250, 500 ...) and its tick step. |
| `components/features/departments/portrait-crop-dialog.tsx` | 139 | Client | Portrait (3:4) crop for faculty photos: drag or use the arrow keys to position the picture; the slider zooms. |
| `components/features/departments/statement-tile.tsx` | 55 | Server | A highlighted statement card (department vision or mission). |
| `components/features/events/event-card-form.tsx` | 136 | Client | An event as a form, for Add and Edit: title, dates, time, venue, category, description, link and |
| `components/features/events/event-card-view.tsx` | 61 | Server | One event: the calendar date badge (month in the red strip, day below), category, title, dates, |
| `components/features/events/event-card.tsx` | 64 | Client | One event in a list. Visitors see the event. The signed-in admin also sees Edit and Delete |
| `components/features/events/event-list.tsx` | 82 | Client | Events with the admin's "Add event" button at the top. On the home page (`home`): the next three |
| `components/features/events/events-editor.tsx` | 70 | Client | Holds the whole news_items list (old news rows included, untouched) for the event cards' Add, |
| `components/features/forms/enquiry-form.tsx` | 108 | Client | Enquiry form posting to the `submitEnquiry` Server Action. Works before JavaScript loads. |
| `components/features/forms/extra-field-input.tsx` | 37 | Server | Renders one form-specific field; its value is saved in the enquiry's `details`. |
| `components/features/forms/form-field.tsx` | 42 | Server | Label, optional marker, hint and error message around one form control. |
| `components/features/forms/types.ts` | 10 | Server | - |
| `components/features/home/ai-first-section.tsx` | 42 | Server | AI-First Campus: introduction, programme figures, and every champion and ambassador. |
| `components/features/home/count-up.tsx` | 47 | Client | Counts from 0 to `value` once the number scrolls into view. The final number |
| `components/features/home/departments-panel.tsx` | 38 | Server | Grid of all departments, each linking to its page. |
| `components/features/home/explore-section.tsx` | 37 | Server | Research and industry panels. |
| `components/features/home/hero-card.tsx` | 73 | Server | Where a card sits in the deck: 0 is the front photo; 1 and 2 peek out on the right (smaller and |
| `components/features/home/hero-carousel-parts.tsx` | 62 | Server | Previous and next arrows with one dot per photo, under the deck. |
| `components/features/home/hero-carousel.tsx` | 120 | Client | The home page photos as a stacked deck: the front photo with the next two peeking out on the |
| `components/features/home/hero.tsx` | 49 | Server | Opening section: headline, key facts and the photo carousel with a frosted location badge. |
| `components/features/home/journey-bullets.tsx` | 43 | Client | The bullet points of one month: edit, reorder, remove, and add. |
| `components/features/home/journey-edit-button.tsx` | 70 | Client | Edit (filled months) or Add (empty months), plus move up and down. Shown only to signed-in editors. |
| `components/features/home/journey-edit-form.tsx` | 138 | Client | The fields of one month. Its photos and badge are kept as they are. |
| `components/features/home/journey-entry.tsx` | 135 | Server | Renders **bold** segments in a plain string. |
| `components/features/home/journey-photo-editor.tsx` | 140 | Client | The photo block for an editor: Replace or Add, Remove, and the caption and alt text. A month |
| `components/features/home/journey-photo.tsx` | 22 | Server | The photo shown between an entry's first paragraph and its bullet points: centred, at most 400px wide |
| `components/features/home/journey-section.tsx` | 26 | Server | "Our AI Transformation Journey 2026". Only the months with content are sent to visitors; |
| `components/features/home/journey-timeline.tsx` | 138 | Client | The timeline. Visitors see the months that have content, as the server sent them. A signed-in |
| `components/features/home/key-figures.tsx` | 62 | Server | Figures the site already knows, so they never drift out of date. |
| `components/features/home/leadership-section.tsx` | 20 | Server | All leadership messages in full, one below the other, in the featured message design. |
| `components/features/home/notices-section.tsx` | 30 | Server | Events on the home page: the next three upcoming events, or the latest three past ones. |
| `components/features/home/quick-access.tsx` | 41 | Server | Colour-coded shortcut tiles to the most-used pages. |
| `components/features/home/use-journey-drag.ts` | 47 | Client | Drag to reorder for the editor's timeline. Dragging starts from the card's text, not from its |
| `components/features/home/visit-strip.tsx` | 29 | Server | Closing call to visit or contact the college. |
| `components/features/infographics/donut-chart.tsx` | 69 | Server | Accessible SVG donut with a legend. Colours follow the section tones; the track and labels follow the theme. |
| `components/features/infographics/index.ts` | 4 | Server | - |
| `components/features/infographics/milestone-timeline.tsx` | 25 | Server | Horizontal timeline on wide screens, vertical on phones. |
| `components/features/infographics/process-steps.tsx` | 39 | Server | Numbered steps; in a row with arrows on wide screens, or a 2-column grid. |
| `components/features/initiatives/ai-first-section.tsx` | 42 | Server | The AI First Campus section of the AI & Quantum Campus page (#ai-first-campus): the picture, |
| `components/features/initiatives/dashboards-section.tsx` | 97 | Server | The dashboards content (intro text from the "dashboards" page, the chart, the status counts |
| `components/features/initiatives/initiative-callout.tsx` | 37 | Server | Banner at the top of a page whose initiative has (or will have) its own site: UHV, R&D, IEEE. |
| `components/features/initiatives/quantum-section.tsx` | 53 | Server | The Quantum Ready Campus section of the AI & Quantum Campus page (#quantum-ready-campus): the |
| `components/features/layout/anniversary-badge.tsx` | 21 | Server | The "30 Years of Excellence" badge (1997–2027), on a transparent background so it suits light |
| `components/features/layout/content-page.tsx` | 70 | Server | Standard inner page: banner, then the content at full width. |
| `components/features/layout/footer-brand.tsx` | 69 | Server | Logo, motto, address and contact links at the start of the footer. |
| `components/features/layout/footer-columns.ts` | 64 | Server | Research pages kept in the footer, since the R&D menu item may point to the research portal. |
| `components/features/layout/logo.tsx` | 7 | Server | The HKBK College of Engineering crest. Pass `className` to size it some other way (for example to fill a frame). |
| `components/features/layout/page-banner.tsx` | 71 | Server | Page banner: breadcrumb, title and summary on the section's tint. |
| `components/features/layout/site-footer.tsx` | 61 | Server | Site footer: brand and contact block, six link columns, and a slim bottom bar. |
| `components/features/layout/site-header.tsx` | 55 | Server | Main menu bar at the very top, then the logo row with contact details and the theme toggle. |
| `components/features/layout/theme-provider.tsx` | 13 | Client | Light and dark mode via a `dark` class on <html>, following the visitor's system setting by default. |
| `components/features/layout/theme-toggle.tsx` | 27 | Client | Switches between light and dark mode. Icons swap with CSS, so there is no hydration flash. |
| `components/features/mous/mou-card-form.tsx` | 132 | Client | Small labelled field on the card form. |
| `components/features/mous/mou-card-view.tsx` | 95 | Server | Initials for a partner without a logo: "VTU", "CITRIOT" → "CI", "Dyashin Technosoft Pvt Ltd" → "DT". |
| `components/features/mous/mou-card.tsx` | 65 | Client | One MoU card. Visitors see the MoU. The signed-in admin also sees Edit and Delete at the |
| `components/features/mous/mou-directory.tsx` | 85 | Client | Every MoU as a card, under "MoUs (N)". The signed-in admin also gets Add, drag-to-reorder and |
| `components/features/mous/mou-document-field.tsx` | 97 | Client | Sends the PDF straight to the private bucket with the one-time ticket from the server. |
| `components/features/mous/mou-editor.tsx` | 90 | Client | Holds every MoU for the cards' Add, Edit, Delete, drag-to-reorder and sort. Each change saves |
| `components/features/navigation/main-nav.tsx` | 99 | Client | The main menu bar. Every item is always visible: on wide screens dropdowns |
| `components/features/navigation/mega-menu.tsx` | 105 | Server | A column heading: plain text, or a link (with its icon) when the column has its own page. |
| `components/features/navigation/mobile-header.tsx` | 54 | Client | The header on screens narrower than 1024px: one compact sticky row with the crest, the |
| `components/features/navigation/mobile-menu-item.tsx` | 117 | Client | One item of the mobile menu: a full-width link, or an accordion (About, Programmes, ...) |
| `components/features/navigation/mobile-menu-panel.tsx` | 106 | Client | The slide-in menu for phones and tablets: a navy panel from the right over a dimmed page. |
| `components/features/navigation/nav-link.tsx` | 20 | Server | A menu link: internal pages use next/link; live initiative sites open in a new tab. |
| `components/features/people/add-person-card.tsx` | 54 | Client | The "Add new" card at the end of a grid, for people beyond the numbered cards. Admin only. |
| `components/features/people/ai-champions.tsx` | 46 | Server | Summary of the AI Champions programme, linking to the grids with every person. |
| `components/features/people/ai-people-grid.tsx` | 86 | Server | Puts each student ambassador in the card numbered by their sort_order (the position the |
| `components/features/people/ambassador-view.tsx` | 60 | Server | One AI Student Ambassador card: the person (photo or initials, name, department, year), or a |
| `components/features/people/champion-crop-dialog.tsx` | 147 | Client | Circular crop: drag or use the arrow keys to position the picture; the slider zooms. |
| `components/features/people/champion-view.tsx` | 91 | Server | One AI Faculty Champion card. A filled card shows the photo with a solid teal ring (or the |
| `components/features/people/featured-message.tsx` | 83 | Server | Splits a leading salutation line ("Dear students, ...,") from the rest of the letter. |
| `components/features/people/people-editor.tsx` | 68 | Client | Holds every AI Faculty Champion and AI Student Ambassador for the cards' Add, Edit and Delete. |
| `components/features/people/person-card-form.tsx` | 115 | Client | The card as a form, for Add and Edit: click the photo to upload or replace it (with a circular |
| `components/features/people/person-card.tsx` | 105 | Client | One card in the AI Faculty Champions or AI Student Ambassadors grid, shared by both sections. |
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
| `components/ui/table.tsx` | 41 | Server | - |
| `components/ui/tabs.tsx` | 39 | Client | - |
| `components/ui/textarea.tsx` | 18 | Server | - |

## Modules, actions and scripts (55)

| File | Lines | Purpose |
| --- | --- | --- |
| `lib/achievements-server.ts` | 20 | A department's achievements: the saved list, or its single older achievement until one is saved. Server only. |
| `lib/achievements.ts` | 24 | One achievement on a department's Achievements tab: a title, an optional year or date, a |
| `lib/admin/config.ts` | 18 | - |
| `lib/admin/email-alert.ts` | 58 | Which alert address field covers each form. Admission and hostel forms use the general address. |
| `lib/admin/enquiries.ts` | 78 | Keeps only letters, digits and a few safe characters, so the search cannot change the query. |
| `lib/admin/lockout.ts` | 36 | Minutes left on a lock, or 0 when sign-in is allowed. |
| `lib/admin/service.ts` | 37 | A JSON request to the database REST API. Returns null for 204 responses. |
| `lib/admin/session.ts` | 59 | The signing key: the session secret plus the password hash, so a new password ends all sessions. |
| `lib/ai-people.ts` | 24 | The two groups in the AI programme; values match ai_people.role. |
| `lib/areas.tsx` | 177 | - |
| `lib/carousel-server.ts` | 15 | The home page carousel photos the admin saved, or the campus photo when none are saved. Server only. |
| `lib/carousel.ts` | 19 | One photo in the home page carousel. An empty title and subtitle hide the badge for that photo. |
| `lib/champion-image.ts` | 64 | Geometry for the photo crop: a square crop box, a zoom level and a pan offset, all in pixels. |
| `lib/cms/client-image.ts` | 67 | Shrinks a picture in the browser to fit within maxSide, as a JPEG. Used before every upload. |
| `lib/cms/paths.ts` | 25 | - |
| `lib/cms/read.ts` | 25 | - |
| `lib/cms/schema.ts` | 168 | `hideWhen`: the field is not shown, and is saved empty, for rows whose `key` field is one of `in`. |
| `lib/cms/store.ts` | 26 | - |
| `lib/cms/validate.ts` | 180 | A photo address the admin may use: one uploaded to our storage, or a file shipped with the site. |
| `lib/cms/write.ts` | 69 | Saves a value (null removes it), and records the change. |
| `lib/content.ts` | 198 | A value the admin saved in the content editor (see lib/cms/schema.ts), if any. |
| `lib/database.types.ts` | 849 | Supabase database types for the HKBK website. |
| `lib/department-sections.ts` | 57 | A leading code such as M1, PEO1, PSO2 or PO12. |
| `lib/editor.ts` | 84 | True when a signed-in editor is viewing the page. Checked once per page load. |
| `lib/enquiry.ts` | 61 | Per-field messages, used to mark the matching input as invalid. |
| `lib/events.ts` | 41 | Today's date in India (YYYY-MM-DD), so an event becomes "past" after its last day on campus. |
| `lib/format.ts` | 28 | Formats an ISO date (YYYY-MM-DD) as "3 Oct 2026" without timezone shifts. |
| `lib/journey-model.ts` | 73 | Shared rules for the AI Transformation Journey timeline (visitors and editors). |
| `lib/markdown.ts` | 16 | Splits markdown into sections at each "## Heading". Text before the first heading is the intro. |
| `lib/menu-server.ts` | 16 | Loads everything the menu needs and builds it. Server components only. |
| `lib/menu.ts` | 269 | A dropdown column. With `href` the heading is a link; `icon` shows before the heading. |
| `lib/mous.ts` | 27 | An uploaded MoU document's path in the private "mou-documents" bucket. |
| `lib/portals.tsx` | 42 | A portal is clickable once it has an address and is marked Live. |
| `lib/portrait-crop.ts` | 49 | Geometry for the faculty photo crop: a 3:4 portrait crop box, a zoom level and a pan offset, all in pixels. |
| `lib/site-details.ts` | 45 | Address, phone and email: the values in lib/site.ts, with anything the admin saved laid over them. Server only. |
| `lib/site.ts` | 113 | The Training and Placement Portal (staff sign-in), linked from the Placements page. |
| `lib/supabase/client.ts` | 13 | Browser client from @supabase/ssr, for Client Components that need live data or auth. |
| `lib/supabase/env.ts` | 14 | Supabase URL and public key from the environment, or null when the project is not connected yet. |
| `lib/supabase/public.ts` | 18 | Cookie-free client for public content (pages, departments, news...). |
| `lib/supabase/server.ts` | 31 | Server client from @supabase/ssr for Server Actions, Route Handlers and |
| `lib/types.ts` | 50 | Event fields kept only in the admin content store (list:news_items), set with the on-card editor. |
| `lib/ui.ts` | 112 | Wider container for the menu bar and logo row. |
| `lib/utils.ts` | 8 | Merges Tailwind classes, letting later classes override earlier ones. |
| `actions/admin.ts` | 100 | Compares two strings in constant time, so the check does not reveal how much matched. |
| `actions/content.ts` | 70 | Every page and leadership message the content editor can open, with readable names. |
| `actions/enquiries.ts` | 30 | Number of New enquiries, for the badge in the admin bar. Visitors get 0. |
| `actions/enquiry.ts` | 80 | Extra fields each form may send; anything else is ignored. |
| `actions/journey.ts` | 166 | A Supabase client for a signed-in editor, or a message explaining why not. |
| `actions/mous.ts` | 50 | A one-time upload address for a new MoU document. |
| `scripts/build-manifest.mjs` | 149 | Generates docs/manifest.md and manifest.json: an inventory of the project |
| `scripts/build-setup-sql.mjs` | 91 | Builds supabase/setup_all.sql: every migration plus all content from /content, |
| `scripts/check-invariants.mjs` | 163 | Verifies the automatable invariants in docs/invariants.md. |
| `scripts/hash-admin-password.mjs` | 26 | Creates the bcrypt hash for ADMIN_PASSWORD_HASH. Usage: npm run admin:hash |
| `scripts/seed.mjs` | 91 | Uploads everything in /content to Supabase. |
| `scripts/setup-mou-documents.mjs` | 22 | Creates (or updates) the private "mou-documents" storage bucket for MoU PDFs. |

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
- `supabase/migrations/20261013000000_june_entry.sql`
- `supabase/migrations/20261013010000_october_entry.sql`
- `supabase/migrations/20261013020000_june_entry_workshop.sql`
- `supabase/migrations/20261013030000_october_entry_alumni.sql`
- `supabase/migrations/20261014000000_may_completed.sql`
- `supabase/migrations/20261014010000_remove_ai_first_message.sql`
- `supabase/migrations/20261014020000_august_entry_client.sql`
- `supabase/migrations/20261015000000_api_grants.sql`
- `supabase/migrations/20261019120000_mou_association.sql`
- `supabase/migrations/20261022120000_mou_academic_year.sql`
- `supabase/migrations/20261023000000_department_sections.sql`
- `supabase/migrations/20261023010000_faculty.sql`

| Table | Columns | Column names |
| --- | --- | --- |
| `pages` | 5 | `slug`, `title`, `summary`, `body_md`, `updated_at` |
| `leadership_messages` | 10 | `slug`, `name`, `designation`, `organisation`, `excerpt`, `photo_url`, `body_md`, `sort_order`, `section`, `updated_at` |
| `departments` | 24 | `id`, `slug`, `name`, `short_name`, `kind`, `programmes`, `description`, `vision`, `mission`, `has_research_centre`, `research_areas`, `show_research_tile`, `history`, `approvals`, `peos`, `psos`, `pos`, `curriculum`, `employment_scope`, `career_roles`, `achievements`, `achievements_image`, `sort_order`, `updated_at` |
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
| `mous` | 13 | `id`, `slug`, `partner`, `association`, `academic_year`, `partner_type`, `purpose`, `signed_on`, `valid_until`, `document_url`, `logo_url`, `sort_order`, `updated_at` |
| `journey_milestones` | 14 | `id`, `slug`, `period`, `title`, `summary`, `points`, `badge`, `icon`, `inline_photo`, `layer`, `photos`, `sort_order`, `status`, `updated_at` |
| `editors` | 4 | `user_id`, `email`, `role`, `created_at` |
| `site_content` | 3 | `key`, `value`, `updated_at` |
| `site_history` | 6 | `id`, `key`, `label`, `old_value`, `new_value`, `created_at` |
| `admin_security` | 3 | `id`, `failed_attempts`, `locked_until` |
| `faculty` | 10 | `id`, `slug`, `department`, `name`, `is_hod`, `designation`, `qualification`, `photo_url`, `sort_order`, `updated_at` |

## Content

- Pages (`content/pages`): 25
- Messages (`content/messages`): 3
- `content/data/ai_people.json`: 13 row(s)
- `content/data/consultancy_projects.json`: 3 row(s)
- `content/data/dashboards.json`: 7 row(s)
- `content/data/departments.json`: 10 row(s)
- `content/data/faculty.json`: 0 row(s)
- `content/data/houses.json`: 5 row(s)
- `content/data/journey_milestones.json`: 11 row(s)
- `content/data/key_figures.json`: 11 row(s)
- `content/data/mous.json`: 25 row(s)
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
- `docs/changelog.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DATABASE.md`
- `docs/decision.md`
- `docs/DEPLOYMENT.md`
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
- `docs/SETUP.md`
- `README.md`
- `AGENTS.md`
