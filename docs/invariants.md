# Invariants

Statements that must be true of the HKBK website at every commit. If one breaks, fix it before merging.

- **Automated** invariants (INV-01 to INV-13) are checked by `npm run check:invariants`, which exits with an error if any fails. Run it before every push; CI runs it once CI-01 is done.
- **Manual** invariants (INV-M1 to INV-M12) are checked by the steps given, until automated tests cover them (CI-02).

## Automated

| ID | Invariant | Why it matters |
| --- | --- | --- |
| INV-01 | Every table in `public` has row-level security enabled | The publishable key is public; without RLS anyone could read or change the table |
| INV-02 | `enquiries` has an insert policy and no select, update, delete or all policy | Visitors' personal data must never be readable through the public API |
| INV-03 | `SUPABASE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` appear only under `scripts/` | The secret key bypasses RLS; it must never reach the website code or the browser |
| INV-04 | No component or page file is longer than 150 lines | Keeps components focused and reviewable |
| INV-05 | No hard-coded hex colours in components and pages (except the root error page, the theme-colour meta tags and the donut chart palette) | Colours must follow the theme in light and dark mode |
| INV-06 | No `bg-white` surfaces except approved image backings (footer logo disc, MoU partner logos, Bloch sphere diagram, posters in the home photo deck) | White surfaces break dark mode |
| INV-07 | Files marked `"use client"` export no plain values (only components) | Server code importing such a value receives a client reference instead of the value |
| INV-08 | Every `content/data/*.json` file matches a database table, every row has a `slug`, and slugs are unique per file | Seeding upserts by `slug`; duplicates would overwrite each other |
| INV-09 | `lib/database.types.ts` contains every table created by the migrations | Code is typed against the real schema |
| INV-10 | `years-of-excellence`, `ai-faculty-champions` and `ai-student-ambassadors` have `value: null` in `key_figures` | These figures are calculated and must never go stale |
| INV-11 | A centre or initiative with `status: Live` has a valid `http(s)` URL | Menus would otherwise link to nowhere |
| INV-12 | `supabase/setup_all.sql` equals a fresh build from the migrations and content | A new project set up from the file must match the code |
| INV-14 | `content/champions.json` has one card per programme place, ids 1 to n in order, plain photo file names that exist in `public/images/champions/`, and https LinkedIn links only | The faculty champion grid is built from this file; a bad entry would break the page or link |
| INV-13 | Menu items are defined only in `lib/menu.ts` | One menu tree keeps the top bar, footer and banners consistent |

## Manual

| ID | Invariant | How to verify |
| --- | --- | --- |
| INV-M1 | Every page renders with Supabase disconnected (content falls back to `/content`) | Remove the Supabase variables from `.env.local`, run `npm run build`; it must succeed and pages show content |
| INV-M2 | `npm run typecheck` and `npm run build` pass | Run both |
| INV-M3 | The top menu shows all 13 items in one row at 1280px and wider, and every item is visible (wrapping, never collapsed) below that | Open the site at 1280px and 390px |
| INV-M4 | Enquiry forms submit and validate without JavaScript | Disable JavaScript in the browser and submit the Contact form |
| INV-M5 | Zero axe-core WCAG A/AA violations on the home page, a department page, Contact, IEEE, MoUs and AI Champions, in light and dark mode | Run axe (browser extension or CI-02) in both themes |
| INV-M6 | Leadership messages (`section = leadership`) and any AI First Campus message (`section = ai-first`) never mix: the About menu and `/leadership` show only leadership | Check the About mega menu and `/leadership` |
| INV-M7 | Unless an initiative is Live, menus link to `/initiatives/<slug>`; when Live, they open the subdomain in a new tab | Set a test row to Live with a URL and check the menu and footer |
| INV-M8 | No invented facts: every statistic, name, partner and date was supplied by the college; drafts are marked `status: draft`; placeholder rows are `is_sample: true` | Review content changes in each pull request |
| INV-M9 | Every external link opens in a new tab with `rel="noopener noreferrer"` and a screen-reader hint | Inspect links to subdomains, maps and documents |
| INV-M10 | The secret key is not set in Vercel and `.env.local` is not tracked by Git | Vercel > Settings > Environment Variables; `git check-ignore .env.local` |
| INV-M11 | Every page has exactly one `h1`, and every image has alt text (or `alt=""` if decorative) | axe-core and a quick check of new pages |
| INV-M12 | The site is usable at 360px width: no horizontal scrolling of the page body | Open each changed page at 360px |

## Adding an invariant

1. Add a row here with its ID, the statement and why it matters.
2. If it can be checked from the source, add a `check("INV-NN", ...)` block to `scripts/check-invariants.mjs`.
3. Prove the check works: break the rule on purpose, confirm the checker fails, then revert.
4. Record the change in `changelog.md`.
