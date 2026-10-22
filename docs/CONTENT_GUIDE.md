# Content guide

This guide is for the staff who keep the website up to date. You do not need to write code.

## Two ways to edit

| Method | Best for | How it goes live |
| --- | --- | --- |
| **Supabase dashboard** (Table Editor) | Day-to-day updates: news, projects, dashboards, messages | Within 5 minutes, or instantly if the refresh webhook is set up |
| **Files in `content/`** | Large rewrites and the first launch | A developer runs `npm run db:seed`, or redeploys if Supabase is not used |

If both are used, Supabase wins. Running `npm run db:seed` overwrites rows in Supabase that have the same `slug` as a file, so after launch, choose one place to edit each item.

## Leadership messages

Files: `content/messages/chairman.md` (Shri. C M Ibrahim), `director.md` (Shri. C M Faiz Mohammed) and `principal.md` (Dr. Mohammed Riyaz Ahmed). The Director's and Principal's messages use the text and photos from the AI Transformation Journey portal; photos are in `public/images/leaders/`. Table: `leadership_messages`. The home page and `/leadership` both show every message in full, one below the other, in `sort_order`, with the leader's name and designation under their photo. If an older copy of the database still has a message that is no longer on the site, re-run `supabase/setup_all.sql`.

```markdown
---
name: "Dr. Mohammed Riyaz Ahmed"
designation: "Principal"
organisation: "HKBK College of Engineering"
excerpt: "Two or three sentences for the home page."
photo_url: "https://YOUR-PROJECT.supabase.co/storage/v1/object/public/site-images/principal.jpg"
sort_order: 3
status: approved
---

Dear students,

The message, in paragraphs separated by a blank line. Use **bold** sparingly.
```

The three messages in this repository are **drafts written for review**. Each leader must read, edit and approve their own message before launch.

To add another message, for example from a Dean: create `content/messages/dean.md` with the same front matter, or add a row in the table. It appears on the home page, `/leadership` and the sitemap automatically.

## Pages

Files: `content/pages/<slug>.md`. Table: `pages`.

| Slug | Page |
| --- | --- |
| `about` | About HKBK, vision and mission |
| `vision-mission` | College vision and mission (home page and About). Keep the `## Vision` and `## Mission` headings |
| `home-ai-first` | The AI-First Campus paragraphs on the home page |
| `academics` | Introduction above the department list |
| `programmes` | Introduction above the programme list |
| `research-centres` | Introduction above the research centres |
| `ieee` | IEEE Student Branch. Each `## Heading` becomes a tab |
| `initiatives` | Introduction on the Centres & Initiatives page |
| `ai-champions` | Heading and summary of the AI Champions and Ambassadors page |
| `uhv` | Universal Human Values |
| `ai-quantum` | AI and quantum overview |
| `ai-first` | AI First campus |
| `quantum-lab` | Quantum Lab |
| `dashboards` | Introduction above the dashboards list |
| `research` | Research and development |
| `consultancy` | Consultancy projects |
| `corporate-training` | Corporate training |
| `news` | Introduction above the news list |
| `contact` | Contact |

Write the body in Markdown: `## Heading`, `- bullet`, `1. numbered step`, `**bold**`, `[link text](/page-path)`. Lists, forms and tables below the text come from their own tables and do not need editing here.

## Writing style

- Write for a parent or a student reading on a phone. Short sentences, plain words.
- Sentence case for headings: "Plan a training programme", not "Plan A Training Programme".
- Say what a button does: "Send enquiry", not "Submit".
- Avoid claims you cannot back up, such as "best college in Bengaluru".

## Lists

| What | Table | Seed file |
| --- | --- | --- |
| Departments, programmes and research centres | `departments` | `content/data/departments.json` |
| AI Faculty Champions | `content/champions.json` (photos in `public/images/champions/`) | `content/champions.json` |
| AI Student Ambassadors | `ai_people` | `content/data/ai_people.json` |
| Dashboards | `dashboards` | `content/data/dashboards.json` |
| UHV activities | `uhv_activities` | `content/data/uhv_activities.json` |
| Research projects | `research_projects` | `content/data/research_projects.json` |
| Consultancy projects | `consultancy_projects` | `content/data/consultancy_projects.json` |
| Training programmes | `training_programs` | `content/data/training_programs.json` |
| Events (news rows are kept but not shown) | `news_items` | `content/data/news_items.json` |

When a dashboard is ready, set its `url` and change `status` to `Live`. The **Open dashboard** link appears on the next refresh.

## Menu

The menu at the top shows these items in this order: Home, About, Programmes, Departments, Centre of Excellence, IEEE, Houses, Placements, MoUs, AI & Quantum Campus, IDEA Lab, IQAC. Most items update themselves from the content: Programmes and Departments list the rows in `departments`, Houses lists `houses`, and Centre of Excellence lists the research centres plus UHV, Skill Development Centre, Equal Opportunity Cell and Alumni Network from `portals`.

- **IEEE chapters** are the `## ` sections of `content/pages/ieee.md` (CIS, WIE, Information Theory, Education Society). To add a chapter, add a section there and add it to `IEEE_CHAPTERS` in `lib/menu.ts`.
- **Houses**: rename House 4 and House 5 in the `houses` table, fill in `namesake` and `about`, and set `is_placeholder` to false.
- **Placements** and **IQAC** are `content/pages/placements.md` and `content/pages/iqac.md`. Each `## ` section of the IQAC page becomes a tab.

## MoUs

**MoUs are now edited on the MoUs page by the signed-in admin** (Edit, Delete, ➕ Add MoU, drag to reorder, Sort by date signed). The first save there copies the whole list into the admin content store (`list:mous`), and from then on the website shows that copy: later changes to `content/data/mous.json` or the `mous` table no longer appear. Uploaded MoU documents (PDF, up to 10 MB) go to the private `mou-documents` bucket (create it once per Supabase project with `node --env-file=.env.local scripts/setup-mou-documents.mjs`); visitors can open one only when "Show download link to visitors" is ticked. The notes below describe the original file and table fields.

The MoUs page (`/mous`) shows how many MoUs are listed and every MoU from the `mous` table in one grid (no tabs), in `sort_order`. Each card shows the partner's logo (or its initials until `logo_url` is set), the partner name, "Signed on" with `signed_on`, and the `association` (who signed with the partner, for example `HKBKCE` or `VTU and HKBKCE`). For MoUs listed by academic year, put the years in `academic_year` (for example `AY 2023-24` for one year, or `AY 2023-26` for an MoU active from 2023-24 to 2025-26); it is shown under the name, in place of the "Signed on" date (the date stays in `signed_on`). If the signing date, academic year or association is not known yet, leave it empty; the card then shows only what is filled in. Add one row per MoU: `partner`, `association`, `signed_on`, `valid_until`, `partner_type` (`Industry`, `Academic`, `Research` or `Government`, not shown on the card), and optionally `purpose`, `document_url` (a link to the signed PDF, shown as "View MoU") and `logo_url`. Until rows are added, the page shows "Partner list coming soon" with the number from `key_figures` (slug `mous`). The "What our MoUs cover" panel is in `content/pages/mous.md`.

## AI Transformation Journey timeline (home page, "Our AI Transformation Journey 2026")

Each month is an entry in `content/data/journey_milestones.json` (and the `journey_milestones` table). Visitors see only the months that have content. The signed-in site admin (Edit content → AI First journey timeline) see every month, including empty ones.

- **Edit or Add:** each month has an Edit button (filled) or an Add button (empty) at its top right. The form holds the month and year, layer (none or 1 to 5), title, description, bullet points, icon and status (Completed, In progress or Upcoming).
- **Bullet points:** add, edit, reorder or remove any number of them.
- **Present:** "— Present" appears only on the latest month marked In progress. Mark a month In progress and the label moves to it; the earlier month loses it.
- **Upcoming:** a month marked Upcoming is faded and tagged "Upcoming".
- **Add month:** the button at the end adds the month after the last one (for example January 2027).
- **Delete entry:** removes the month (click twice to confirm).
- **Reorder:** drag a month to a new place, or use the up and down arrows.
- **Photo + caption:** each month with a first paragraph can show one photo centred between that paragraph and the bullet points. In edit mode: **Replace photo** (or **Add photo** when the month has none, which shows "Photo coming soon" to editors only), **Remove photo**, and the caption and alt text fields. Photos are at most 400 px wide on desktop and 90% of the card on mobile, with their proportions kept. Uploads are resized to 1600 px wide and compressed. Months without a photo look as before.
- Changes save straight away and show on the home page on the next load.

Re-running `supabase/setup_all.sql` does not overwrite timeline entries that were edited on the site.

## AI Faculty Champions and AI Student Ambassadors: adding people

**Faculty champions** come from `content/champions.json`: 15 objects, one per card, with `id`, `name`, `designation`, `department`, `photo` (a file name such as `ravi-kumar.jpg`) and `linkedin` (optional, an `https://linkedin.com/` address). An empty `name` shows the card as "Faculty Champion N, Coming soon". Put the photos in `public/images/champions/`.

**To update a card without touching code**, add `?edit=1` to the Champions page address (for example `/ai-quantum?edit=1`). Each card gets fields for name, designation, department and LinkedIn, and a photo button that opens a circular crop. When you are done, choose **Export update (.zip)**. Unzip the file, copy its `content` and `public` folders into the project, run `npm run build`, then commit and push. Edits stay in the browser until you export, and nothing is saved to the website itself. Visitors never see the editor.

**Student ambassadors** are added by the signed-in site admin, using **Add**, **Edit** or **Delete** on each card (see ADMIN_GUIDE.md).

## AI Faculty Champions (home page and the AI First Campus page)

The cards come from `content/champions.json`, one object per card, in display order. The heading count and the "AI Faculty Champions" figure on the home page both follow the number of cards.

**Who can edit.** Visitors see no edit controls. Edit mode opens in either of two ways:
- the signed-in site admin uses **Edit** or **Add** on the cards;
- anyone with the address `?edit=1` added to the page address (for example `https://your-site/ai-quantum?edit=1`).

### Edit a card
1. Open the page in edit mode and find the card.
2. **Name, designation, department, LinkedIn:** click the text. Type, then press **Enter** or click outside the field to save. Press **Esc** to cancel.
3. **Photo:** click the photo, or **Change photo**, and choose a JPG, PNG or WebP picture. Drag the picture so the face sits in the circle and use the slider to zoom, then **Use this photo**. It is saved as a 400 × 400 JPG.
4. **Remove photo:** the card goes back to the dashed placeholder icon.
5. **Clear card:** the name, details and photo are removed, and the card shows "Faculty Champion N / Coming soon".
6. **Delete card:** removes the card from the list.
7. **Move:** drag the card onto another card, or use the ← and → buttons. The numbers follow the new order.

### Add a card
Click **+ Add champion** at the end of the grid. The new card appears as a placeholder; fill it in as above.

### Undo and drafts
- **Undo** reverts the last change. Undo can be used more than once.
- **Unsaved changes** shows while there are edits not yet exported.
- Edits are kept in this browser, so a refresh restores them. **Discard changes** throws them away.

### Publish your changes
1. Click **Save / Export (.zip)**. A zip file downloads.
2. Unzip it. It contains `content/champions.json`, the new photos in `public/images/champions/`, and a `README.txt`.
3. Copy the `content` folder into the project's `content` folder (this replaces `champions.json`).
4. Copy the `public` folder into the project's `public` folder (existing photos are kept).
5. Run `npm run build` to check, then commit and push. Vercel deploys the new site.
6. Photos of removed cards stay in `public/images/champions/`; delete them by hand if you do not need them.

The check `npm run check:invariants` (INV-14) reports cards with a missing photo file, bad ids or an invalid LinkedIn address.

Current status: cards 1–12 are filled, including card 6 (Dr. Balaji Vijayan). Cards 13–15 are waiting for names and photos.

## AI Transformation Journey (home page)

The timeline under AI-First Campus comes from the `journey_milestones` table (or `content/data/journey_milestones.json`). Each row is one period: `period` (for example "April 2026"), `title`, `summary`, `points` (a list), an optional `badge` (shown as a recognition label), `icon` (`sunrise`, `hammer`, `presentation`, `sprout`), and `photos`, a list like `[{"src": "/images/journey/fdp1.jpg", "alt": "Lighting the lamp at the programme inauguration", "fit": "cover"}]`. Use `"fit": "contain"` for posters so they are not cropped. `**bold**` works in the summary and points.

To add photos to another month, upload them to `public/images/journey/` (or the `site-images` bucket) and add them to that row's `photos`.

## Big numbers (home page)

The band under the home page photo shows eleven figures from the `key_figures` table (or `content/data/key_figures.json`): years of excellence, students (2,500+), faculty (150+), papers published (300+), patents filed (150), patents published (50), patents granted (30), MoUs signed (25), AI Faculty Champions, AI Student Ambassadors and students placed (200).

- **Years of excellence** is calculated from the founding year (1997), and the **AI Faculty Champions** and **AI Student Ambassadors** figures come from `aiProgramme` in `lib/site.ts`. Leave their `value` empty.
- For the others, update `value` when the figure changes; `suffix` is shown after it (for example `+`). A figure with no value shows "Figure coming soon".
- Numbers count up when visitors scroll to them, and appear instantly for people who prefer reduced motion.

## Departments, programmes and research centres

All three come from the `departments` table. Each department row holds its `vision`, its `mission` (a list of points), and `research_areas`. A department appears on the Programmes page when `programmes` is exactly `BE`, and on the Research centres page when `has_research_centre` is true. The department vision and mission in this repository are **drafts**; replace them with each department's approved wording.

**Optional sections on a department page** (each tab appears only when it has content; edit them in **Edit content** → Departments):

| Field | One line per | Example |
| --- | --- | --- |
| History of the programme | academic year | `2024–25: Intake increased from 60 to 120` |
| Approvals | badge | `Approved by AICTE` |
| PEOs, PSOs, POs | objective or outcome | `PO1: Engineering knowledge: Apply the knowledge of ...` |
| Curriculum | semester | `Semester 3 (2025 scheme): Operating Systems; Data Structures and Applications` |
| Scope of employment | card | `Higher studies: Preparation for GATE, UGC-NET, CAT ...` |
| Career roles | role | `Data scientist` |

Achievements is free text beside an uploaded photo; until the photo is uploaded the page shows an empty frame. Untick **Show the research centre tile** to hide the Research centre tile and overview row. **Faculty** have their own list (**Edit content** → Faculty): choose the department (`aiml`, `cse`, ...), then name, designation (Professor, Associate Professor, Assistant Professor or Teaching Assistant), qualification and a portrait photo. Tick **Head of the department** for the HoD, who is shown first in a larger card; everyone else is grouped by designation, highest rank first, and the card number sets the order within each group.

## AI Faculty Champions and AI Student Ambassadors

The home page (under AI-First Campus) and the AI & Quantum Campus page (`/ai-quantum#champions`) show the same 15 faculty champion cards, from `content/champions.json`. Cards without a name show as numbered placeholders. The 50 student ambassador cards come from the `ai_people` table, with numbered placeholders up to the programme size set in `lib/site.ts`.

## Centres & Initiatives

Each centre or initiative (Universal Human Values, Research and Development, IEEE Student Branch, IDEA Lab, Skill Development Centre, Equal Opportunity Cell, Alumni Network, and any you add) is one row in the `portals` table, or one entry in `content/data/portals.json`. On the website they are called **Centres & Initiatives**.

Each one appears in the top menu under the section named in its `menu_group` column: `Campus Life` (UHV, IEEE Student Branch, Equal Opportunity Cell, Alumni Network), `Labs` (IDEA Lab, Skill Development Centre) or `R & D` (Research and Development). Until its own site is ready, each one links to a ready-made page at `/initiatives/<slug>`. To connect its subdomain:

1. Open **Table Editor > portals** and find the row.
2. Paste the full address into `url`, for example `https://alumni.hkbk.edu.in`.
3. Change `status` to `Live`.

From the next refresh, the top menu, the footer and `/initiatives` all link straight to the subdomain in a new tab. To add another centre or initiative, insert a row with a new `slug`, `title`, `description`, `category` and `sort_order`; it appears in every menu automatically.

## Images

Images are in `public/images` and listed in `lib/site.ts` under `images`.

| File | Used on | Notes |
| --- | --- | --- |
| `hkbk-logo.png` | Header and footer; `app/icon.png` is the browser tab icon | College logo |
| `campus.webp` | Home hero, About | Photograph of the college building |
| `ai-network.webp` | Home, AI & Quantum, AI First | Original illustration |
| `quantum-computer.webp` | Home, AI & Quantum, Quantum Lab | Original illustration |
| `bloch-sphere.webp` | Quantum Lab | Original diagram |

To change a photograph, save the new file over the old one in `public/images` (about 1600 pixels wide and under 350 KB), and update the `alt` text in `lib/site.ts` to describe it. Only use photographs the college owns or has permission to use.

## Reading form submissions

Open **Table Editor > enquiries** in Supabase. Filter by `type` to see one form, for example `corporate_training`. Change `status` to `in_progress` when someone picks it up and `closed` when it is resolved. [DATABASE.md](DATABASE.md) has ready-made queries.

## Launch checklist

- [ ] Each leader has approved their message and `status: approved` is set
- [ ] Chairman's photo added (Director and Principal photos are in place)
- [ ] Department vision and mission statements replaced with approved wording
- [ ] AI Faculty Champions added to `content/champions.json` with names and photos
- [ ] AI Student Ambassadors added with names and photos
- [ ] Names, namesakes and descriptions added for House 4 and House 5
- [ ] IEEE chapter details, branch counsellor and chapter office-bearers confirmed
- [ ] Placement page recruiter list and IQAC reports added
- [ ] Figures in `key_figures` checked and dated (for example, students placed in which year)
- [ ] Subdomain addresses added and set to `Live` for each centre or initiative that is ready
- [ ] Leadership portraits uploaded to the `site-images` bucket and `photo_url` filled in
- [ ] Official phone number and email added in `lib/site.ts`
- [ ] Vision and mission on `/about` replaced with the officially approved wording
- [ ] Current NAAC/NBA accreditation and AICTE approval details added to `/about`
- [ ] Department list, programmes and research centres checked against current VTU approvals
- [ ] Training programmes confirmed by the training cell, sample tags removed
- [ ] All `is_sample` rows deleted, or real rows added in their place
- [ ] UHV coordinator's name and contact added to the UHV page
- [ ] Privacy notice page added, explaining how form data is stored and used (ask your legal advisor about the Digital Personal Data Protection Act, 2023)
- [ ] A staff member named as owner for each form type, checking `enquiries` daily
