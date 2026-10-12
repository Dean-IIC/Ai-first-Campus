# Security

Security model for the HKBK College of Engineering website. It covers what is protected, the threats considered, the controls in place, known gaps, and what to do in an incident. Gaps link to tickets in `feature-tickets.md`.

## 1. Assets

| Asset | Where it lives | Sensitivity |
| --- | --- | --- |
| Enquiries (names, emails, phone numbers, messages) | `enquiries` table | **Personal data**: confidential |
| Website content (pages, messages, figures, lists) | Content tables, `/content` files | Public, but integrity matters |
| Supabase secret key (`sb_secret_...`) | Developer's `.env.local` only | **Critical**: full database access, bypasses RLS |
| Supabase publishable key (`sb_publishable_...`) | `.env.local`, Vercel, browser | Public by design; limited by RLS |
| Database password | Password manager | **Critical** |
| `REVALIDATE_SECRET` | `.env.local`, Vercel | Low: can only trigger a cache refresh |
| Images | `public/images`, Storage bucket `site-images` | Public |

## 2. Threats considered

| Threat | Control |
| --- | --- |
| Anyone reads enquiries through the public API | RLS: `enquiries` has an insert policy only, no select (INV-02) |
| Anyone edits or deletes content through the public API | RLS: content tables have select policies only (INV-01) |
| Secret key leaks into the browser or Git | Used only in `scripts/` (INV-03); never in `NEXT_PUBLIC_*`; `.env.local` git-ignored; not set in Vercel |
| Spam bots flood the forms | Honeypot field, server-side validation, length limits, database check constraints. Rate limiting: **gap** (SEC-01) |
| Oversized or malformed input | Server Action trims and caps every field (name 200, email 200, phone 30, message 4000, extra fields 500); database check constraints repeat the limits |
| Cross-site scripting through content | React escapes all text; Markdown is rendered with react-markdown, which does not render raw HTML |
| Clickjacking, MIME sniffing, referrer leaks | Security headers: **gap** (SEC-02) |
| Script injection through third parties | No third-party scripts, fonts or images. Content Security Policy: **gap** (SEC-03) |
| Cache poisoning via the refresh endpoint | `POST /api/revalidate` requires `x-revalidate-secret`; it only refreshes, never changes data |
| Vulnerable dependencies | Next.js monthly security releases; patch monthly (SEC-04) |
| Lost data | Supabase backups (plan-dependent); content also in Git under `/content` |

## 3. Database access rules (row-level security)

RLS is enabled on every table (verified by `npm run check:invariants`, INV-01).

| Table | anon / authenticated can | Staff (dashboard) can |
| --- | --- | --- |
| `pages`, `leadership_messages`, `departments`, `dashboards`, `uhv_activities`, `research_projects`, `consultancy_projects`, `training_programs`, `news_items`, `portals`, `ai_people`, `key_figures`, `houses`, `mous`, `hostel_facilities` | Read | Read and write |
| `enquiries` | Insert only, with `status = 'new'` | Read and write |
| Storage bucket `site-images` | Read (public bucket) | Upload and delete |

There are deliberately **no** update or delete policies for public roles. Writes happen only in the Supabase dashboard or through the secret key in `scripts/seed.mjs`.

## 3a. Staff editing

- Staff sign in at `/staff/login` with email and password (Supabase Auth). The sign-in action signs out anyone who is not in `public.editors`.
- `public.is_editor()` (security definer) tells whether the signed-in user is on the list; the `editors` table itself is readable only by each editor for their own row.
- RLS lets editors insert, update and delete `ai_people`, and upload, replace or delete files only under `site-images/ai-people/`. Everyone else keeps read-only access. Verified with an editor and a non-editor account on PostgreSQL.
- Server Actions re-check the session and the editors list on every save, validate every field, and accept photo addresses only from this project's `site-images/ai-people/` folder.
- Sessions live in cookies set by `@supabase/ssr`; the browser client refreshes them before each save. A session-refresh `proxy.ts` is still optional (SEC-06).

## 4. Keys and secrets

- `.env.local` holds secrets on a developer machine and is listed in `.gitignore`.
- Vercel holds four variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_SITE_URL`. **Never** add `SUPABASE_SECRET_KEY` to Vercel.
- Never paste keys or passwords into chat tools, tickets or documents.
- **Rotation:** if the secret key may have leaked, open Supabase > Project Settings > API Keys, create a new secret key, delete the old one, and update `.env.local` on each developer machine. Rotate `REVALIDATE_SECRET` in Vercel and in the Supabase webhook header together.

## 5. Application controls

- **Server Actions only for mutations** (`actions/enquiry.ts`), using the `@supabase/ssr` server client.
- **Validation:** allowed form types, name length, email or phone required, email and phone formats, required message where configured, consent required.
- **Bot protection:** hidden `website` honeypot field; filled submissions get a fake success and are not stored.
- **Error handling:** Supabase errors and network failures are logged on the server and the visitor sees a generic message; no internal details are shown.
- **Public reads** use a cookie-free client, so cached pages never contain session data.
- **External links** (initiative subdomains, maps, documents) open with `rel="noopener noreferrer"`.
- **Server-only code:** values exported from `"use client"` files are not imported by server code (INV-07).

## 6. Privacy

- Forms collect only what is needed to reply: name, email or phone, message, and form-specific details.
- A consent checkbox is required: "I agree that HKBK College of Engineering may store these details and use them only to respond to this request."
- Enquiries are readable only by staff with dashboard access.
- **Gap:** publish a privacy notice that explains collection, use, retention and how to request deletion, and agree a retention period (SEC-05). Ask the college's legal advisor about obligations under India's Digital Personal Data Protection Act, 2023.

## 7. Known gaps (tracked as tickets)

| Ticket | Gap | Priority |
| --- | --- | --- |
| SEC-01 | Rate limiting on the enquiry Server Action | High |
| SEC-02 | Security headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` | High |
| SEC-03 | Content Security Policy (allow Google Maps frame on Contact) | Medium |
| SEC-04 | Monthly dependency patching routine and `npm audit` in CI | Medium |
| SEC-05 | Privacy notice page and retention policy for enquiries | High |
| SEC-06 | Staff sign-in is done for AI Champions editing; add roles beyond "editor" and a session-refresh `proxy.ts` with the staff portal | Later |

## 8. Incident response

1. **Contain:** rotate any exposed key (section 4); disable a compromised account in Supabase Auth (when sign-in exists).
2. **Assess:** check Supabase logs (API, Postgres) and Vercel logs for the time window.
3. **Fix:** patch the cause; add or tighten an RLS policy or invariant so it cannot recur.
4. **Inform:** tell college leadership; if personal data was exposed, follow legal advice on notifying affected people and authorities.
5. **Record:** add an entry to `changelog.md` and, if the design changed, an ADR in `decision.md`.

## 9. Release security checklist

- [ ] `npm run check:invariants` passes (RLS, secret key, enquiries policies)
- [ ] `npm run build` passes on the latest Next.js 16.x patch
- [ ] Vercel has no `SUPABASE_SECRET_KEY`
- [ ] `.env.local` is not in Git (`git check-ignore .env.local`)
- [ ] Contact form test row inserted and deleted; public API cannot read `enquiries`
