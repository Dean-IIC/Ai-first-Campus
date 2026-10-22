# Changelog

All notable changes to the HKBK College of Engineering website. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). Add new entries under **Unreleased** in the same pull request as the change.

## [Unreleased]

### Added (MoUs by academic year)
- MoUs page (`/mous`): 11 MoUs from the AY 2023-24, 2024-25 and 2025-26 lists are added, each with the academic years it covers under the name: Karunadu Technologies, Mitron Technologies and Innovations, Prodevans Technologies, Enterprise Building Training Solutions and Cranes Varsity (AY 2023-26); Reverse Engineering Infosec (AY 2024-26); Brain O Vision (AY 2023-25); Krish Tec (AY 2025-26); WSPL Hosting Solutions and Colt Assist and Utility Technologies (AY 2024-25); Vigameq Consultancy Services (AY 2023-24). The page now lists 24 MoUs and the "MoUs signed" key figure is 24.
- New `academic_year` column (migration `20261022120000_mou_academic_year.sql`), an Academic year field in **Edit content** → MoUs, and an academic-year line on the MoU card.
- Logos in `public/images/mous/` for all 11: Karunadu Technologies, Krish Tec, Reverse Engineering Infosec (Reinfosec), Prodevans Technologies, Cranes Varsity, WSPL Hosting Solutions, Brain O Vision and Mitron Technologies and Innovations from each company's website; Enterprise Building Training Solutions, Colt Assist and Vigameq cut from website screenshots supplied by the college (Colt and Vigameq redrawn dark so they show on the white logo tile).

### Changed (home photo deck)
- Home page hero photos are a stacked deck: the front photo with the next two peeking out on the right (92% and 84% size, 85% and 60% opacity; narrower peeks on phones). Every 5 s the front photo slides out to the back and the next one moves forward (0.6 s). Pauses on hover or tap; arrows and dots under the deck; swipe on phones; clicking a peeking photo brings it forward; no auto-slide or animation with reduced motion. The badge sits below the front photo's bottom-left corner, overlapping it by 12 px. New per-photo **Fit** in Edit content → Home page carousel: "Full poster" (whole image on a light backing, nothing cropped) or "Fill frame". The VTU Rank poster was set to Full poster (History). Files: `hero-carousel.tsx`, `hero-card.tsx`, `hero-carousel-parts.tsx`; `fit` added to `HeroSlide`.

### Added (30 Years of Excellence badge)
- "30 Years of Excellence" badge (transparent background: `public/images/30-years-badge.webp`, `-sm.webp`, PNG master) in the desktop header before the VTU/AICTE text (64 px), in the compact header next to the dark-mode toggle (40 px, from 440 px wide so the college name is never cut), in the hero instead of the calendar icon beside "Established 1997", and in the footer next to the college name (48 px). Tooltip and alt text: "Celebrating 30 years of excellence, 1997–2027"; the header badge opens the About page. Component `components/features/layout/anniversary-badge.tsx`, image data in `images.anniversary` (`lib/site.ts`).

### Changed (AI & Quantum Campus page)
- "AI & Quantum Campus" in the menu (desktop and mobile) is now a plain link to `/ai-quantum`, with no dropdown. That page (title "AI & Quantum Campus", saved through Edit content and in History) shows the overview text, then the AI First Campus section (`#ai-first-campus`: picture, page text, Champions summary and grids `#champions`, journey `#journey`) and the Quantum Ready Campus section (`#quantum-ready-campus`), reusing the same components and data. The two picture cards on the overview are removed. Old addresses redirect permanently: `/ai-quantum/ai-first`, `/quantum-lab`, `/champions`, `/dashboards`. Sitemap lists `/ai-quantum` only; the footer keeps its AI and quantum links (`AI_QUANTUM_LINKS` in `lib/menu.ts`). Dashboards stay hidden. The compact dropdown from the previous change is removed.

### Changed (AI & Quantum menu and journey)
- AI & Quantum Campus dropdown: a compact list sized to its content (under the menu item) with two direct links, "AI First Campus" (CPU icon) and "Quantum Ready Campus" (atom icon), plus "Overview of AI and quantum →"; the duplicate links under each heading are removed. Same in the mobile menu. A menu column with `href` and no links is now a direct link (`isDirectColumn`, `isCompactSection` in `lib/menu.ts`, `compact-menu.tsx`); the footer and breadcrumbs are unchanged.
- AI First Campus page: the AI First journey timeline (same component and data as the home page, editable in the same way) is added after the AI Champions and Ambassadors content, at `/ai-quantum/ai-first#journey`. It stays on the home page too.

### Added
- The Placements menu item (desktop menu, mobile menu and footer) opens the saved Placement Portal Link directly in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), even though it is on *.hkbkce.in; with no link saved it opens the `/placements` page as before. The Placements page and its button are unchanged.
- Edit content → "Alumni, R&D, UHV and Placement portal links" has a new **Placement Portal Link** field (stored in `site:links` as `placement_portal_link`; placeholder https://placements.hkbkce.in). When it is set, the Placements menu item (header, mobile menu and footer) opens the portal and the Placements page button uses it; when empty, the menu opens `/placements` and the button falls back to `site.placementPortalUrl`. Link fields can now show a placeholder.

### Changed (MoUs)
- MoUs page (`/mous`): the 13 signed MoUs are listed (Shinawatra University, CITRIOT, VTU, DSEdify, RollNumber Technologies, V-INSPIRE, Gleamator Technologies, Dyashin Technosoft, Ubuntu Consortium, Chiac ASI, Medini Technologies, QuantumX, UST) in one grid with no partner-type tabs. Each card shows the logo (initials until a logo is uploaded), the partner name, "Signed on" date and the association; the date and association are left out when they are not set. The counter on the page now matches the number of cards, and the "MoUs signed" key figure is 13. New `association` column (migration `20261019120000_mou_association.sql`) and an Association field in **Edit content** → MoUs.
- MoU partner logos in `public/images/mous/` for all 13 partners. The CITRIOT, VTU, DSEdify, Gleamator Technologies, Dyashin Technosoft, Ubuntu Consortium and UST logos come from each partner's official website. The Chiac ASI and Medini Technologies logos come from their websites and are recoloured dark, because the originals are white and would not show on the white logo tile. QuantumX's comes from its LinkedIn page. Shinawatra University's comes from Wikimedia Commons ("SIU LOGO UPDATE" by Prsiu, CC BY-SA 4.0). The college supplied the RollNumber Technologies and V-INSPIRE logos.

### Changed (menu)
- Department vision and mission replaced for CSE, ECE, ME, ISE and AIML with the approved text (saved through the departments list; History: "Departments: new vision and mission (CSE, ECE, ME, ISE, AIML)"). The Vision tile now shows several points (one per line, as for ME) as a numbered list like the Mission tile, and when every point starts with a label such as "M1:" (ECE) the badges show M1–M4 instead of numbers. The Vision field in Edit content says to put each point on its own line.
- Basic sciences and humanities departments (Mathematics, Physics, Chemistry, Humanities): the "Vision and mission" tab is removed, so their pages open on Overview; old `#vision-mission` links open Overview. Their vision and mission were cleared through the saved departments list (History: "Departments: removed vision and mission (Mathematics, Physics, Chemistry, Humanities)"). In Edit content → Departments the Vision and Mission fields are hidden for any department whose Kind is "Basic sciences and humanities", and the server always saves them empty (new `hideWhen` field option, `SCIENCES_KIND` in `lib/site.ts`). Engineering and Physical education departments and the college vision and mission are unchanged.
- AI First Campus page: the box with "What students get", "What faculty and staff get" and "Our rules for AI" now comes right after the AI picture, before the AI Champions and Ambassadors summary and grids. No text or design changes.
- Dashboards are no longer shown: removed the dashboards section from the AI First Campus page and the "Dashboards in progress" chart from the AI and quantum overview (`/ai-quantum`). The dashboards list, the "dashboards" page text, Edit content and History are unchanged, and `components/features/initiatives/dashboards-section.tsx` is kept so it can be shown again. AI First Campus page order is now: header, AI picture, AI Champions and Ambassadors summary (15 / 50, See all), the full champions grids (`#champions`), then the page text. `/ai-quantum/dashboards` now redirects permanently to `/ai-quantum/ai-first`; the footer link is unchanged.
- AI First Campus page (`/ai-quantum/ai-first`): the two link cards are removed. Below the page header it now shows the full AI Champions and Ambassadors content (faculty and ambassador grids, same component and data, admin editing unchanged) under a "AI Champions and Ambassadors" heading (`#champions`), then the full Dashboards content (intro, chart, status counts, tabbed list) under "Dashboards" (`#dashboards`), then the existing photo, summary panel and page text. The summary panel's "See all" links point to the grids on the same page. `/ai-quantum/champions` and `/ai-quantum/dashboards` redirect permanently (308) to those sections and are removed from the sitemap. The page now renders on each request so card edits show at once. Dashboards content moved to `components/features/initiatives/dashboards-section.tsx`; `link-cards.tsx` removed.
- AI & Quantum Campus dropdown (desktop and mobile): the AI First Campus column now lists only "AI First Campus". The AI First Campus page has two cards below the heading, "AI Champions and Ambassadors" and "Dashboards" (side by side, stacked on phones), linking to the existing pages, which are unchanged. The footer still lists both links, and the menu item stays highlighted on those pages. New `components/features/content/link-cards.tsx`.

### Added
- Enquiries inbox for the admin (`/admin/enquiries`, **Enquiries** button in the admin bar with a count of new ones): every consultancy, corporate training and contact enquiry with filters by form and status, search by name, email or organisation, status (New, In progress, Closed), a private note, and **Download CSV**. Visitors can send a limited number of enquiries per hour. Optional email alerts through Resend: recipients per form are set in **Edit content** → Enquiry email alerts, and alerts start once `RESEND_API_KEY` is set on Vercel; until then each enquiry shows "Email alerts not set up". Five test enquiries were removed.

### Changed
- Top menu (desktop and mobile): "AI First Campus" and "Quantum Ready Campus" are combined into one "AI & Quantum Campus" dropdown with two columns. AI First Campus (CPU icon) lists AI First Campus, AI Champions and Ambassadors and Dashboards; Quantum Ready Campus (atom icon) links to the Quantum Lab page. Both column headings are links. A bottom link "Overview of AI and quantum" opens `/ai-quantum`. The picture card is removed. Menu columns can now have `href` and `icon`, and a section can have a `footerLink`. The footer's AI and quantum column is unchanged.
- Admin sign-in page: the college logo now sits fully inside its white circle (96 px on desktop, 80 px on phones, 8 px padding, scaled to fit, soft shadow, 16 px gap to the title). `Logo` takes an optional `className` to size it.
- Home page photo is now a carousel in the same frame: it slides every 5 seconds, pauses while the mouse is over it or after a tap, and has arrows (on hover; always on touch screens), dots and swiping. Each photo has its own badge title and subtitle (no badge when both are empty). Visitors who prefer reduced motion get no auto-play. Photos are managed in **Edit content** → Home page carousel (upload, badge, alt text, drag to reorder, delete, up to 10), saved with History; the on-page "Replace photo" on the hero is removed. Until photos are added it shows the current campus photo only.
- Placements page (`/placements`) now has a "Training and Placement Portal" box with an "Open the Placement Portal" button (staff sign-in, opens in a new tab). The address is `site.placementPortalUrl` in `lib/site.ts`: https://placements.hkbkce.in (verified on Vercel 19 Oct 2026; https://hkbk-placement-portal.vercel.app still works).
- The research portal is now called "HKBK Research": the R&D page line reads "…on HKBK Research", its button is "Open HKBK Research", and the footer link is "HKBK Research".
- Database moved to a Supabase project in the college's own account (`elhxrjkasyzjkyazutgi`). All tables (including the five the old project never had), every row, every storage file and the saved edits were copied; photo addresses in the saved edits point to the new storage. Vercel and `.env.local` use the new URL and keys. New migration `20261015000000_api_grants.sql` grants the Data API permissions that new Supabase projects no longer add automatically. A full backup of the old project is in `backups/2026-10-15/`.
- R&D now opens the HKBK Research Pulse portal (https://research.hkbkce.in), set as the R&D portal link in Edit content. Links to HKBK's own sites (*.hkbkce.in) open in the same tab. The R&D page (`/rnd`) has the line about Research Pulse and an "Open Research Pulse" button, and keeps its links to Research centres and Research projects. The footer's Centre of Excellence column lists "Research Pulse".
- College vision and mission replaced with the approved text (one vision statement, three mission points) on the home page and the About page; department statements are unchanged.
- Centre of Excellence menu (desktop and mobile): the first group is now "Industry" with Consultancy projects and Corporate training only; Research and Development, Research centres and Research projects are no longer in it. Research centres and Research projects are linked from the R&D page (`/rnd`) and always listed in the footer's Centre of Excellence column.
- The consultancy client's name is no longer shown: the AI First Campus timeline (August – September 2026) says "a Bengaluru food business", and the consultancy project's client is "A Bengaluru food business". The name was also removed from earlier change-history entries.
- Sample entries removed through the admin content store: all research projects and training programmes, consultancy projects 2 and 3, and news items "Quantum Lab opens for first-year students" and "Corporate training calendar for 2026–27". Empty lists now show a short message for visitors instead of a note about Supabase.
- `backups/` is git-ignored; a full read-only backup of the database tables and storage was saved there on 2026-10-14.
- Search engines: `NEXT_PUBLIC_SITE_URL` on Vercel is now `https://www.hkbkce.in`, so the sitemap, robots.txt and page metadata use the new domain instead of www.hkbk.edu.in.
- AI First Campus timeline: the August entry reads "August – September 2026" again, and May 2026 is Completed, so only September – October 2026 is in progress.
- Header (desktop logo row): the address block with the location pin is removed; the affiliation text sits on the right next to the dark-mode toggle. The full address still shows in the footer and on the Contact page.
- AI First Campus timeline, September – October 2026 entry (Layer 4): the description now says the Alumni Portal is being developed as part of the HKBK college website (not on Zoho), and the Alumni bullet is reworded to match and moved to the end of the list, after "Secure by design".
- AI First Campus timeline, June – July 2026 entry: the UHV-2 content is replaced by "AI Faculty Champions Recognised — AI Transformation Workshop" (no workshop length mentioned), with its description and six bullet points as supplied (no personal names). Layer 2, Completed. Icon: trophy (editable).
- AI First Campus timeline, October entry only: "September – October 2026", Layer 3, In progress (shows "— Present" as the latest in-progress entry), "Smart Campus Operations — Digital Systems on the Zoho Platform", with its description and seven bullet points as supplied. Icon: cpu (editable). September 2026 remains empty and hidden from visitors. A one-time database update applies to the October row only while it is still empty.
- AI First Campus timeline, June entry only: "June – July 2026", Layer 2, Completed, "Universal Human Values 2 (UHV-2) — Values-Led AI Adoption", with its description and six bullet points as supplied. Icon: users (editable). July 2026 remains empty and hidden from visitors. A one-time database update applies to the June row only while it is still empty.

### Added
- **UHV** in the top menu (desktop and mobile), after R&D, with a HeartHandshake icon and the tooltip "Universal Human Values — Coming soon". It opens the existing `/uhv` page until a **UHV portal link** is saved under Edit content → Alumni, R&D and UHV portal links. The UHV entry no longer appears under Centre of Excellence → Centres and cells or in the footer's Centre of Excellence column; all UHV pages, lists and other content are unchanged. Desktop menu text is 13.5px at 1280–1535px wide so the menu stays on one line.
- Consultancy projects: optional **Area** and **Outcomes** (bullet list) fields, and the status "Delivered (live in production)" (shown in green), editable under Edit content → Lists → Consultancy projects.
- Mobile and tablet menu (below 1024px): a compact sticky header (crest, college name, dark-mode toggle, ☰) and a navy slide-in panel from the right (85% of the screen, at most 360px) over a dimmed page. All menu items in the same order, R&D with its flask icon, dropdown items as accordions (one open at a time), the current page marked in orange. Closes on ✕, the overlay, any link, Escape or a swipe to the right; the page behind does not scroll; focus stays in the panel and returns to ☰. From 1024px the full menu and logo row are unchanged.
- **R&D** in the top menu (desktop and mobile), after Alumni, with a flask icon and the tooltip "Research & Development". It opens the new `/rnd` page (title "Research & Development", line "HKBK Research & Development portal — coming soon", editable under Edit content → Page text) until an **R&D portal link** is saved under Edit content → Alumni and R&D portal links; then the menu item opens that link in a new tab. The existing `/research` page is unchanged. Desktop menu items are a little closer together (2px each side at 1280–1535px, 6px from 1536px) so the menu stays on one line.
- Principal's photo (Dr. Mohammed Riyaz Ahmed) replaced with the new supplied portrait, cropped to head and shoulders: `public/images/leaders/principal.jpg`.
- Director's photo (Shri. C M Faiz Mohammed) replaced with the newer supplied portrait (seated at the desk), cropped to head and shoulders: `public/images/leaders/director.jpg`.
- Chairman's photo (Shri. C M Ibrahim): `public/images/leaders/chairman.jpg`, a portrait crop of the supplied photo, set in `content/messages/chairman.md` and the `leadership_messages` row.
- AI Faculty Champions and AI Student Ambassadors: one shared card (`PersonCard`) for both sections. The signed-in admin sees ✏️ Edit and 🗑️ Delete on filled cards and ➕ Add on empty ones; Edit and Add turn the card into a form in place (click the photo to upload or replace it with a circular crop, name and details, Save or Cancel). Delete asks "Delete this person?" and returns the card to an empty slot. A ➕ Add new card at the end of each grid adds people beyond the numbered cards, and the heading counts follow. Changes save through the admin content store (`list:ai_people`), show on the live site at once and can be undone. Visitors see the cards as before.
- The content editor asks for confirmation before saving a list that removes half or more of its items.
- **Alumni** in the top menu (desktop and mobile), after Placements. It opens the new `/alumni` page (title "Alumni", line "HKBK Alumni Network — portal coming soon", editable under Edit content → Page text → Alumni) until an **Alumni portal link** is saved under Edit content → Alumni portal link; from then on the menu item opens that link in a new tab. Desktop menu items are 1px closer together on each side at 1280–1535px wide so the menu stays on one line.
- Site admin: **Edit content** in the admin toolbar opens one editor for everything stored as content: the title, summary and text of all 23 pages, every leadership message (with photo), all 13 lists (departments, news and events, MoUs, AI Champions, key figures, houses, centres and initiatives, dashboards, research and consultancy projects, training programmes, UHV activities, the AI First journey) and the contact details (address, phone, email). Lists support add, delete and reorder. It opens on the content of the page being viewed.
- Saved values (`page:`, `message:`, `list:`, `site:details`, plus the existing `text:` and `image:`) are laid over the content from Supabase or `/content`, so undo, history and restore work for them as for inline edits. Every field is checked on the server (`lib/cms/schema.ts`, `lib/cms/validate.ts`).

### Removed
- The AI First Campus message (featured message, letter, photo, name and title) from the home page, the AI First Campus page, the AI First Campus menu, the mobile menu and the footer; its data file, photo and database row; and the "Office" paragraph on the AI First Campus page. The old address `/leadership/chief-ai-quantum-officer` redirects permanently to `/ai-quantum/ai-first`.
- The old staff sign-in page `/staff/login`, its form and `actions/auth.ts`. All editing is done by the site admin.
- The staff-editor Add/Edit dialog and editor bar on the champions cards (`person-edit-button`, `person-edit-form`, `person-photo-field`, `editor-bar`, `person-slot`, `faculty-card`, `actions/ai-people.ts`), replaced by the admin's on-card editing.

### Changed
- Admin edits, the change history and the sign-in lock are kept as JSON files in the `site-images` storage bucket (`cms-data/content.json`, `history.json`, `security.json`), read and written only on the server with the secret key (`lib/cms/store.ts`). Editing no longer needs the `site_content`, `site_history` and `admin_security` tables.
- The header, footer and Contact page read the contact details through `getSiteDetails()`.

## [0.25.2] - 2026-10-10

### Changed
- AI First Campus timeline, August entry only: "August – September 2026", Layer 2, Completed, "AI in Action — Industry Consultancy: AI Customer-Support Chatbot", with its description and six bullet points as supplied. Icon: rocket (editable). September 2026 remains empty and hidden from visitors. A one-time database update applies to the August row only while it is still empty.

## [0.25.1] - 2026-10-10

### Changed
- Timeline photos are smaller: at most 400px wide on desktop (about half the card, centred) and at most 90% of the card on mobile. Proportions are kept. The same size applies to every month. The editor's placeholder and controls use the same width.

## [0.25.0] - 2026-10-10

### Added
- AI Transformation Journey: an optional photo with a caption between a month's first paragraph and its bullet points. April 2026 (6-Month AI Transformation Program) has its photo, `public/images/journey/apr-2026-expert-partner.jpg`, 80% of the card width on desktop and full width on mobile, original proportions, lazy-loaded, with alt text.
- Editors: Replace photo, Remove photo (or Add photo), caption and alt text on each month. Uploads are resized to 1600 px and compressed. Months without a photo show "Photo coming soon" to editors only.
- Database: `journey_milestones.inline_photo` and an editor upload rule for `site-images/journey/`.

### Tested
- 20 browser checks for the photo (placement, centring, width, proportions, mobile, editor controls, replacing the photo once, refresh, caption and alt text) and the 25 timeline checks, all passing.

## [0.24.0] - 2026-10-10

### Added
- AI Transformation Journey timeline: editable by signed-in staff editors. Each month has Edit or Add, with the fields month and year, layer (none or 1 to 5), title, description, bullet points (add, edit, reorder, remove), icon and status (Completed, In progress, Upcoming). Add month, delete entry, drag or arrow reordering. Changes save to the database.
- Empty months (June to December 2026) are listed for editors only and never sent to visitors.
- "— Present" is shown only on the latest month marked In progress. Upcoming months are faded and tagged.

### Changed
- May 2026 is marked In progress; its "— Present" label now comes from its status. Its content is unchanged.
- The home page renders on each request so timeline changes show straight after saving.
- Re-running `supabase/setup_all.sql` keeps timeline entries that were edited on the site.

### Tested
- 25 browser checks: visitor view (filled months only, Present, no controls), editor view (every month, Edit/Add), filling June (title, bullet, layer, icon, In progress), refresh, Upcoming styling, add month, delete, reorder, and persistence. Drag-and-drop was verified by dispatching the drag events; a real mouse drag could not be automated in this environment, so please try it on your site (the arrows also reorder).

## [0.23.3] - 2026-10-10

### Changed
- AI Transformation Journey, "Layer 1 Deployed": removed the point "Google Gemini Enterprise access rolled out to students and faculty". The other points are unchanged. Re-run `supabase/setup_all.sql` on the database so the database copy is updated too.

## [0.23.2] - 2026-10-10

### Changed
- The AI First Campus message: removed the "Google Gemini" bullet. The other bullets are unchanged. The setup file was regenerated; re-run `supabase/setup_all.sql` on the database so the database copy of the message is updated too.

## [0.23.1] - 2026-10-10

### Fixed
- AI Faculty Champions: every card showed "Add", even with a name and photo. The Add/Edit label was decided by the record's slug, so a card without a slug always showed "Add". The label now follows the card's content: a card with a name or a photo shows "Edit"; only an empty card shows "Add". The same rule applies to the AI Student Ambassadors.
- Saving and clearing a card without a slug now work on the card's slot (role and position) instead of failing or creating a duplicate.
- The edit form is pre-filled with the current photo, name, designation and department.
- The AI Champions and Ambassadors page now renders on each request, so a new or changed card shows straight after saving (the page previously kept a copy for up to five minutes).
- The shared helper `hasPerson` lives in `lib/ai-people.ts`.

## [0.23.0] - 2026-10-10

### Changed
- AI Faculty Champions use the same Add/Edit feature as the AI Student Ambassadors: a navy Edit button on filled cards and an Add button on empty ones, shown only to signed-in staff editors. The same form (photo with circular crop, name, designation, department, Remove photo, Clear this card) and the same save logic are used.
- Filled faculty cards without a photo show the person's initials in the circle.
- If the people table is empty (for example, a new database that has not been seeded), the saved list in `content/data/ai_people.json` is shown.

### Tested
- Visitors see no Edit or Add buttons. A signed-in editor can edit card 1, add a card in slot 14, refresh and see both changes kept, and clear the test card. Student Ambassadors are unchanged.

## [0.22.2] - 2026-10-10

### Changed
- AI Faculty Champions card 13: Dr. Sujhita, with photo `sujhita.jpg` (400 × 400, centred on the face). Designation and department to be added.

## [0.22.1] - 2026-10-10

### Changed
- Admin sessions are signed with the session secret and the password hash, so changing the password signs out every open session.
- Editable text and images carry a hidden `data-cms-id`; visitors see no change.

### Added
- Preview-only admin demo (in the preview file, not in the site code): demo login, toolbar, inline editing, photo replacement, champions editing, undo and history, kept in the browser.

## [0.22.0] - 2026-10-10

### Added
- Site admin: one admin account signs in at `/admin/login` (bcrypt password hash, signed seven-day session cookie, lock-out after five wrong attempts for 15 minutes).
- Admin toolbar on every page for the signed-in admin: Edit page, Undo, History, Sign out. Visitors see none of it.
- Inline editing on the live site: home headline, intro and photo; section headings and intros; the AI Faculty Champions. Saves go to the database and show straight away.
- Change history of the last 30 changes, with Undo and Restore.
- Database tables `site_content`, `site_history` and `admin_security`; the champions are copied into the database by the setup file.
- `npm run admin:hash` to create the admin password hash.

### Changed
- The AI Faculty Champions are saved in the database. The export and browser-draft editor is removed.
- The secret key is read only by `lib/admin/service.ts` (checked by INV-03). INV-15 checks every admin write requires the session.


## [0.21.1] - 2026-10-09

### Changed
- Card 6 is Dr. Balaji Vijayan, Associate Professor, Department of ISE. Its photo is now `public/images/champions/balaji-vijayan.jpg`.

## [0.21.0] - 2026-10-09

### Added
- Edit mode for the AI Faculty Champions: click-to-edit name, designation, department and LinkedIn fields; Change photo (circular crop, 400 × 400 JPG), Remove photo, Clear card, Delete card; drag to reorder or Move earlier/later; + Add champion; Undo; Unsaved changes indicator; drafts kept in the browser; Save / Export (.zip).
- Edit mode opens with `?edit=1` or the **Edit people** button for signed-in editors. Visitors see no edit controls.

### Changed
- The heading count and the home page's "AI Faculty Champions" figure follow the number of cards in `content/champions.json`; `lib/site.ts` counts them.
- Champion cards are the same height in each row. Department and designation lines wrap evenly instead of breaking mid-phrase.

### Removed
- The earlier champion grid, its draft store and its edit toolbar (replaced by the new editor).

## [0.20.1] - 2026-10-09

### Added
- "Edit people" button above the AI Faculty Champion cards, shown only to signed-in editors. It opens the existing card editor (names, details, photos, export). Visitors do not see it. The editor note above the sections now points to it.

## [0.20.0] - 2026-10-09

### Added
- Twelve AI Faculty Champions with photos, taken from the faculty photo sheet: Dr. Aryalekshmi, Prof. Noor Ayesha, Prof. Afreen Kubra, Dr. Yousuf Madar, Dr. Shireen Fathima, a champion whose name is to be confirmed (card 6), Dr. Sufia Banu, Dr. Maaz Ahmed, Prof. Tahir Naquash, Ms. Deepa K, Prof. Summaiya Almas and Mr. Mohammed Nabeel. Photos are in `public/images/champions/`, cropped to each circular frame at 400 × 400.

### Changed
- `content/champions.json` holds the 15 cards; cards 13–15 remain as "Coming soon".
- Champion photo alt text now reads "Photo of [name], [designation], [department]".

## [0.20.0] - 2026-10-09

### Changed
- AI Faculty Champions are one data file, `content/champions.json` (15 objects: id, name, designation, department, photo, linkedin). Photos go in `public/images/champions/`. Cards without a name show "Faculty Champion N, Coming soon" with the dashed placeholder icon.
- Champion cards: 120px circular photo with a solid teal ring (dashed placeholder when there is no photo), bold navy name, designation, grey department, optional LinkedIn mark, hover lift. Layout is 3 columns on desktop, 2 on tablet, 1 on phone. The heading count comes from the file.
- Alt text reads "Photo of [name], [department]"; photos are lazy-loaded.
- The Faculty Add and Edit buttons (signed-in editors) were removed: faculty now come from the file. Student ambassadors keep the staff sign-in and Add or Edit.

### Added
- Edit mode at `?edit=1` on the champions cards (home page, AI First Campus and `/ai-quantum/champions`): inline fields for name, designation, department and LinkedIn; a circular crop with zoom and drag or arrow keys, saved as a 400 × 400 JPG; Clear card; Export update (.zip) with the updated `content/champions.json`, the photos (named after each champion) and a README. Visitors do not see it.
- INV-14: checks the champions file.

### Notes
- The static preview does not include the editor; edit mode works on the live site.

## [0.20.0] - 2026-10-09

### Added
- Staff editing of AI Faculty Champions and AI Student Ambassadors on the website: sign-in at `/staff/login` (email and password, editors list only), an editor bar with Sign out above the grid, and Add or Edit on every card (photo, name, department, designation or year). Saves through Server Actions; photos resized in the browser and stored in `site-images/ai-people/`.
- Migration `20261009010000_editors.sql`: `editors` table, `is_editor()` function, `ai_people.bio`, and RLS policies so only editors can change `ai_people` or upload to `site-images/ai-people/`.
- Every champion and ambassador card has a stable id (`faculty-01` … `faculty-15`, `ambassador-01` … `ambassador-50`); people appear in the card matching their position.
- Website preview: "Edit people" button for the owner and Editors, with the same form, saving to the preview's own database and photo storage.

## [0.19.3] - 2026-10-09

### Changed
- The Director's, Principal's and AI First Campus messages use the same featured design as the Chairman's (navy header, gold-framed photo, pull quote, name in gold, drop cap, signature in the theme blue), on the home page, `/leadership`, `/leadership/[slug]` and the AI First Campus page. Photos are anchored to the top so faces are not cropped.
- Pull quotes for the Director, Principal and AI First Campus message use a sentence from later in their own message, so the quote no longer repeats the letter's opening line.

### Removed
- `components/features/people/leader-message.tsx` (replaced everywhere by `featured-message.tsx`).

## [0.19.2] - 2026-10-09

### Changed
- Chairman's message on the home page redesigned (`components/features/people/featured-message.tsx`): navy gradient header with a gold-framed portrait (initials until a photo is added), his words as a pull quote, his name in large gold serif type with a gold accent bar, then the letter with an italic greeting, a drop cap and a signature with his name in the theme blue under a gold rule. The Director's and Principal's messages keep their layout.

## [0.20.0] - 2026-10-09

### Changed
- Department pages restyled: the department name is shown large in the section's gradient under a small "Department of", with the department code as a faint watermark in the banner.
- Vision and mission shown as two highlighted tiles side by side (gradient icon tile, soft glow, large quotation mark, tinted surface, coloured base bar); numbered mission points use gradient circles.
- The chips above the tabs replaced by three information tiles: Programme, Department and Research centre.

## [0.19.1] - 2026-10-09

### Changed
- Information Science & Engineering: vision and mission replaced with the department's approved wording.
- A department with a single mission statement shows it as a paragraph styled like the vision; departments with several mission points keep the numbered list.

## [0.19.0] - 2026-10-09

### Removed
- The left panel on all inner pages (menu, "You are in" header and "Have a question?" card). Content now uses the full page width. Components `section-sidebar`, `sidebar-section`, `sidebar-help` and `lib/menu-icons.ts` deleted. See ADR-023.

### Unchanged
- The top menu (13 items), footer, home page and all page content.

## [0.18.0] - 2026-10-09

### Added
- "Our AI Transformation Journey 2026" on the home page, copied from the AI Transformation Journey portal: January–February, March (with the AICTE recognition badge), April (with all 12 FDP photos) and May; `journey_milestones` table.
- Photos of the Director, the Principal and the AI First Campus message (`public/images/leaders/`).

### Changed
- Messages from the Director, the Principal and the AI First Campus message now use their text from the AI Transformation Journey portal, with their highlight points. The Chairman's message is unchanged.
- Director's organisation shown as HKBK Group of Institutions.
- `supabase/setup_all.sql` writes JSON columns correctly.

### Unchanged
- The top menu and left panel (13 items).

## [0.17.0] - 2026-10-08

### Added
- `supabase/setup_all.sql`: every migration plus all content in one idempotent file to paste into the Supabase SQL Editor; `npm run db:sql` rebuilds it.
- `docs/AGENT_SETUP_PROMPT.md`: ready-made prompt for a coding agent to connect project `stksjavtukawalkffqjw`, verify and deploy.
- Documentation set: `decision.md`, `flow.md`, `security.md`, `design.md`, `prd.md`, `rules.md`, `roadmap.md`, `master-spec.md`, `changelog.md`, `feature-tickets.md`, `invariants.md`, `manifest.md`.
- `npm run check:invariants`: 13 automated checks (RLS, enquiry policies, secret key, component size, colour tokens, client exports, content slugs, types, calculated figures, live initiatives, setup file, single menu).
- `npm run docs:manifest`: generates `docs/manifest.md` and `manifest.json` from the source.

### Changed
- `docs/ROADMAP.md` replaced by `docs/roadmap.md` with ticket references.
- `AGENTS.md` points to `rules.md` and `invariants.md`.

## [0.16.0] - 2026-10-05

### Changed
- Left panel redesigned: "You are in" gradient header, section icons in coloured tiles, item counts, tree-style sub-links with an active dot, smooth expand, gradient contact card.
- Footer reorganised into six columns (About HKBK, Programmes, Departments, Centre of Excellence, Student life, AI and quantum) with a brand and contact block; text reduced two sizes (links 12px, bar 11px).
- About menu lists only the Chairman's, Director's and Principal's messages.

### Removed
- Separate "All departments" box on department pages (the left panel tree lists them).

## [0.15.0] - 2026-10-05

### Added
- "25 MoUs signed" in the big numbers; band now shows 11 figures in rows of six.
- MoUs menu item and `/mous` page with count, scope and a partner directory by type; `mous` table.

## [0.14.0] - 2026-10-05

### Added
- shadcn/ui primitives in `components/ui/`; `components.json`.
- Light and dark mode (next-themes) with a header toggle; tokens for both themes.
- `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`.
- `@supabase/ssr` server and browser clients; cookie-free public client; `lib/database.types.ts` in Supabase CLI format; `npm run db:types`.
- Glass effects on the menu bar, hero badge, big-numbers tiles and mega menus.

### Changed
- Components moved to `components/features/<area>/`; Server Action moved to `actions/enquiry.ts`.
- All components under 150 lines (home page split into sections).
- Forms rebuilt on shadcn inputs with per-field errors.

### Fixed
- Amber section colour darkened to `#925700` to meet WCAG AA on badges; axe audits clean in both themes.

## [0.13.0] - 2026-10-04

### Changed
- Every menu item shown on the bar at all screen sizes; items wrap and dropdowns open on tap on narrow screens (no collapsed "Menu" button).

## [0.12.0] - 2026-10-04

### Changed
- Main menu moved into the top navy bar; News, Events, Dashboards and Contact moved to the footer.

## [0.11.0] - 2026-10-04

### Added
- College-defined top menu: Home, About, Programmes, Departments, Centre of Excellence, IEEE, Houses, Placements, AI First Campus, Quantum Ready Campus, IDEA Lab, IQAC.
- IEEE chapters (CIS, WIE, Information Theory Society, Education Society) as tabs; `/houses` with five houses; `/placements`; `/iqac`.
- Left panel shows the full menu, matching the top bar.

## [0.10.0] - 2026-10-04

### Added
- Figures from the college: 2,500+ students, 150+ faculty, 300+ papers, 150 patents filed, 50 published, 30 granted, 15 AI Faculty Champions, 50 AI Student Ambassadors, 200 students placed.

### Removed
- "HKBK at a glance" sections.

## [0.9.0] - 2026-10-04

### Added
- Mega-menu header modelled on leading Bengaluru engineering-college sites.
- Big numbers band with count-up animation; `key_figures` table.

## [0.8.0] - 2026-10-04

### Changed
- Left panel shows only the current section ("Explore HKBK" panel removed).

## [0.7.0] - 2026-10-04

### Added
- An AI First Campus message under AI-First Campus and on the AI First page (`section = ai-first`).
- All 15 AI Faculty Champions and 50 AI Student Ambassadors as cards on the home page.

### Removed
- "Meet the team" button.

## [0.6.0] - 2026-10-04

### Changed
- Leadership messages shown in full on the home page, with names under photos: Shri. C M Ibrahim (Chairman), Shri. C M Faiz Mohammed (Director), Dr. Mohammed Riyaz Ahmed (Principal).
- AI-First Campus paragraphs replace the AI and quantum image cards.

### Removed
- The AI First Campus message from the leadership list.

## [0.5.0] - 2026-10-04

### Added
- College logo in the header, footer and favicon.
- `/initiatives` and `/initiatives/[slug]`: ready-made pages until each subdomain is live.
- AI Champions and Ambassadors page with numbered placeholders.

### Changed
- "Portals" renamed "Centres & Initiatives"; leadership messages listed one below the other.

## [0.4.0] - 2026-10-04

### Added
- Photograph of the college building.
- Ten departments with vision and mission pages; `/programmes` (five BE); `/research/centres` (six centres); IEEE page; vision and mission on the home page.

### Removed
- Hostel and Admissions pages; home roadmap and portals sections; several statistics.

## [0.3.0] - 2026-10-03

### Added
- Original AI, quantum and Bloch sphere illustrations; infographics (process steps, quantum-safe timeline, dashboards donut).
- College portals (UHV, R&D, Alumni, Equal Opportunity Cell, IDEA Lab, Skill Development) in the menu, footer and `/portals`.

## [0.2.0] - 2026-10-03

### Changed
- Redesign: white background with colour-coded sections, panels and tabs.

## [0.1.0] - 2026-10-03

### Added
- Initial Next.js and Supabase website: pages, leadership messages, departments, AI and quantum section, research, consultancy, corporate training, news, contact.
- Supabase schema with row-level security; enquiry forms via a Server Action; content files with database fallback; seed script; setup, architecture, database, content and deployment guides.
