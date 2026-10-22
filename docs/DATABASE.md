# Database

Schema: [`supabase/migrations/20261003000000_init.sql`](../supabase/migrations/20261003000000_init.sql). Every table has row-level security (RLS) turned on.

## Access rules

| Table | Public website (publishable key) | Staff (Supabase dashboard) |
| --- | --- | --- |
| All content tables | Read | Read and write |
| `enquiries` | Insert only | Read and write |

There are no policies that let the public key update or delete anything.

## Content tables

Every list table has a unique `slug`, used by the seed script to update rows instead of duplicating them, and a `sort_order` that controls display order (lowest first).

### `pages`

| Column | Type | Notes |
| --- | --- | --- |
| `slug` | text, primary key | Matches the route, for example `uhv`, `ieee`, `ai-first` |
| `title` | text | Page heading and browser title |
| `summary` | text | Line under the heading, and the search-engine description |
| `body_md` | text | Page body in Markdown |

### `leadership_messages`

| Column | Type | Notes |
| --- | --- | --- |
| `slug` | text, primary key | `chairman`, `director`, `principal` |
| `name` | text | Full name. If empty, the designation is shown instead |
| `designation` | text | For example `Principal` |
| `organisation` | text | Shown under the name |
| `excerpt` | text | Two or three sentences, used in search-engine descriptions |
| `photo_url` | text | Public URL from the `site-images` bucket. If empty, a monogram is shown |
| `body_md` | text | The full message in Markdown |
| `sort_order` | int | Display order |
| `section` | text | `leadership` (home page and `/leadership`) or `ai-first` (under AI-First Campus and on the AI First page) |

### Lists

| Table | Key columns |
| --- | --- |
| `departments` | `name`, `short_name`, `kind` (Engineering, Basic sciences and humanities, Physical education), `programmes` (`BE` marks the five BE programmes), `description`, `vision`, `mission` (list), `has_research_centre`, `research_areas` (list); optional page sections (ADR-025): `show_research_tile`, `history`, `approvals`, `peos`, `psos`, `pos`, `curriculum`, `employment_scope`, `career_roles` (lists, one "Label: text" point per item), `achievements`, `achievements_image` |
| `faculty` | `department` (a department slug such as `aiml`), `name`, `is_hod` (shown first), `designation` (Professor, Associate Professor, Assistant Professor or Teaching Assistant), `qualification`, `photo_url`, `sort_order`; shown in the Faculty tab of that department's page |
| `ai_people` | Student ambassadors only (`role = Student ambassador`). Faculty champions moved to `content/champions.json` in version 0.20.0; any old `Faculty champion` rows are no longer shown |
| `dashboards` | `title`, `category` (AI, Quantum, Academic, Research, Operations), `description`, `url`, `status` (Live, Beta, In development) |
| `uhv_activities` | `activity_type`, `title`, `description` |
| `research_projects` | `title`, `investigator`, `funding_agency`, `status` (Proposed, Ongoing, Completed), `year`, `summary`, `is_sample` |
| `consultancy_projects` | `title`, `client`, `department`, `status` (Proposal, Ongoing, Completed), `year`, `summary`, `is_sample` |
| `training_programs` | `title`, `track`, `duration`, `mode`, `audience`, `summary`, `is_sample` |
| `news_items` | `kind` (news, event), `title`, `summary`, `published_on`, `event_date`, `link_url`, `is_sample` |

Rows with `is_sample = true` show a "Sample entry" tag on the website. Delete them before launch:

```sql
delete from research_projects where is_sample;
delete from consultancy_projects where is_sample;
delete from training_programs where is_sample;
delete from news_items where is_sample;
```

A dashboard shows an **Open dashboard** link only when `url` is set and `status` is `Live` or `Beta`.

## `houses`

| Column | Type | Notes |
| --- | --- | --- |
| `slug` | text, unique | `abdul-kalam`, `mother-teresa`, `rabindranath-tagore`, `house-4`, `house-5` |
| `name` | text | Shown in the menu and as the tab title |
| `namesake` | text | One or two sentences about the person the house is named after |
| `about` | text | What the house stands for |
| `motto` | text | Optional |
| `is_placeholder` | boolean | `true` for the two houses still to be named; the menu shows "Name coming soon" |

## `mous`

| Column | Type | Notes |
| --- | --- | --- |
| `partner` | text | Partner organisation |
| `partner_type` | text | `Industry`, `Academic`, `Research` or `Government`; sets the tab it appears in |
| `purpose` | text | One or two sentences on what the MoU covers |
| `signed_on`, `valid_until` | date | Optional |
| `document_url` | text | Link to the signed MoU (must start with `http://` or `https://`) |
| `logo_url` | text | Partner logo, ideally from the `site-images` bucket |

## `site_content`, `site_history`, `admin_security`

- `site_content`: the saved value of each editable item (`text:<id>`, `image:<id>`, `champions`). Visitors may read it; nothing else is public.
- `site_history`: the last 30 changes (old and new value, label). Written and read only by the server.
- `admin_security`: the admin's failed sign-in count and lock time. Server only.

## `journey_milestones`

The "Our AI Transformation Journey 2026" timeline on the home page.

| Column | Type | Notes |
| --- | --- | --- |
| `period` | text | For example `April 2026` |
| `title`, `summary` | text | `**bold**` supported |
| `points` | text[] | Bullet points |
| `badge` | text | Optional recognition label |
| `icon` | text | `sunrise`, `hammer`, `presentation`, `sprout` |
| `photos` | jsonb | List of `{src, alt, fit}`; `fit` is `cover` or `contain` |

## `key_figures`

The big numbers on the home page.

| Column | Type | Notes |
| --- | --- | --- |
| `slug` | text, unique | `years-of-excellence`, `students`, `faculty`, `papers-published`, `patents-filed`, `patents-published`, `patents-granted`, `mous`, `ai-faculty-champions`, `ai-student-ambassadors`, `students-placed` |
| `label` | text | Shown under the number |
| `value` | int | The number. Leave empty to show "Figure coming soon". Ignored for `years-of-excellence` (calculated from 1997) and the two AI figures (from `lib/site.ts`) |
| `suffix` | text | Shown after the number, `+` by default |

## `portals` (Centres & Initiatives)

The centres and initiatives that will have their own subdomain sites. On the website they are called **Centres & Initiatives**. They appear in the top menu, the footer, `/initiatives` (one tab each), on a ready-made page at `/initiatives/<slug>`, and as a banner on related pages (UHV, R&D and IEEE).

| Column | Type | Notes |
| --- | --- | --- |
| `slug` | text, unique | `uhv`, `research`, `alumni`, `equal-opportunity-cell`, `idea-lab`, `skill-development`, `ieee` |
| `title` | text | Name shown in menus and pages, for example `Alumni Network` |
| `description` | text | One sentence on what the portal does |
| `url` | text | Full address, for example `https://uhv.hkbk.edu.in`. Must start with `http://` or `https://` |
| `category` | text | `Academics and values`, `Research and innovation` or `Students and alumni`; sets the colour and grouping |
| `icon` | text | `uhv`, `research`, `idea-lab`, `skills`, `alumni`, `equal-opportunity`, `ieee`, or anything else for a plain link icon |
| `status` | text | `Coming soon` or `Live`. Menus link to the subdomain only when `url` is set **and** `status` is `Live`; otherwise to `/initiatives/<slug>` |
| `related_page` | text | Optional page on this site, for example `/uhv`, shown as a second link on the card |
| `menu_group` | text | Top-menu section it appears under: `Campus Life`, `Labs` or `R & D` |

## `enquiries`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | |
| `type` | text | `contact`, `corporate_training`, `consultancy` (the schema also accepts `admission`, `hostel_application` and `hostel_complaint` for future use) |
| `name`, `email`, `phone`, `message` | text | At least one of email or phone is required |
| `details` | jsonb | Form-specific fields, for example `{"organisation": "Acme Ltd", "programme": "Generative AI for working professionals"}` |
| `status` | text | `new`, `in_progress`, `closed`. Staff update this as they work |
| `created_at` | timestamptz | |

Useful queries for staff:

```sql
-- Open corporate training enquiries, newest first
select created_at, name, email, phone, details->>'organisation' as organisation, details->>'programme' as programme
from enquiries
where type = 'corporate_training' and status <> 'closed'
order by created_at desc;
```

## Adding a new form type

1. Add the value to `ENQUIRY_TYPES` and `SUCCESS_MESSAGES` in `lib/enquiry.ts`.
2. Create a new migration that drops and re-creates the `enquiries_type_check` constraint with the new value.
3. Use `<EnquiryForm type="new_type" ... />` on the page.

## Storage

The `site-images` bucket is public. Upload leadership portraits there (square images, at least 400 by 400 pixels), copy the public URL, and paste it into `leadership_messages.photo_url` or the `photo_url` front matter field.
