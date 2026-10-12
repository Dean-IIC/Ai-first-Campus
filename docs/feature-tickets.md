# Feature tickets

The backlog for the HKBK website. Each ticket has an ID, priority, estimate, dependencies and acceptance criteria. Phases match `roadmap.md`.

**Priority:** P0 blocks launch · P1 needed soon after launch · P2 planned · P3 later
**Estimate:** S (up to 1 day) · M (2 to 5 days) · L (1 to 3 weeks) · XL (more than 3 weeks)
**Status:** To do unless marked otherwise

## Summary

| ID | Title | Priority | Estimate | Phase |
| --- | --- | --- | --- | --- |
| LAUNCH-01 | Connect Supabase and load content | P0 | S | 1 |
| LAUNCH-02 | Approve leadership and officer messages | P0 | S | 1 |
| LAUNCH-03 | Upload photos of leaders, champions and ambassadors | P0 | M | 1 |
| LAUNCH-04 | Approve department vision and mission statements | P0 | M | 1 |
| LAUNCH-05 | Enter the 25 MoUs | P1 | S | 1 |
| LAUNCH-06 | Name House 4 and House 5 | P1 | S | 1 |
| LAUNCH-07 | Official contacts and removal of sample rows | P0 | S | 1 |
| LAUNCH-08 | Deploy, connect the domain, add the revalidate webhook | P0 | S | 1 |
| SEC-01 | Rate limiting on enquiry forms | P0 | M | 1 |
| SEC-02 | Security headers | P0 | S | 1 |
| SEC-03 | Content Security Policy | P1 | M | 1 |
| SEC-04 | Dependency patching routine and audit in CI | P1 | S | 1 |
| SEC-05 | Privacy notice and enquiry retention | P0 | S | 1 |
| SEC-06 | Staff sign-in and session proxy | P2 | M | 2 |
| CI-01 | Continuous integration pipeline | P1 | S | 1 |
| CI-02 | Automated browser and accessibility tests | P1 | M | 1 |
| SEO-01 | Structured data and social sharing images | P1 | S | 1 |
| PORTAL-01 | Staff sign-in with college accounts (email and password done for AI Champions; Google or Microsoft sign-in to do) | P2 | M | 2 |
| PORTAL-02 | Roles and permissions | P2 | M | 2 |
| PORTAL-03 | Enquiry inbox | P2 | L | 2 |
| PORTAL-04 | New-enquiry notifications | P2 | M | 2 |
| PORTAL-05 | Content editor | P2 | L | 2 |
| PORTAL-06 | Audit log | P2 | M | 2 |
| SITES-01 | Shared design system package | P2 | L | 3 |
| SITES-02 | Centre site starter template | P2 | L | 3 |
| SITES-03 | Launch centre and initiative sites | P2 | XL | 3 |
| AI-01 | Campus assistant with citations | P2 | XL | 4 |
| AI-02 | AI literacy modules | P2 | L | 4 |
| AI-03 | Live AI dashboards | P3 | L | 4 |
| AI-04 | AI Champions and Ambassadors profiles (photo, name, department and designation editing done in 0.20.0) | P2 | M | 4 |
| QL-01 | Circuit composer and simulator | P3 | XL | 5 |
| QL-02 | Quantum hardware job broker | P3 | L | 5 |
| QL-03 | Quantum-safe readiness dashboard | P3 | L | 5 |
| QL-04 | Post-quantum signed certificates | P3 | L | 5 |
| RI-01 | Publications and patents register | P2 | L | 6 |
| RI-02 | MoU lifecycle tracking | P3 | M | 6 |
| RI-03 | Placement records by year | P2 | M | 6 |
| RI-04 | Consultancy and training pipelines | P3 | L | 6 |

---

## Phase 1: Launch

### LAUNCH-01 Connect Supabase and load content
P0 · S · Depends on: none
Run the migrations on project `stksjavtukawalkffqjw`, load content, and connect the site.
- [ ] `supabase db push` or `setup_all.sql` applied; row counts match `master-spec.md` section 6
- [ ] `.env.local` configured; no "[content] ... Using files" warnings in `npm run dev`
- [ ] Contact form test row appears in `enquiries` and is deleted
- [ ] `lib/database.types.ts` regenerated with `db:types`; build passes

### LAUNCH-02 Approve leadership and officer messages
P0 · S · Depends on: none
- [ ] Chairman, Director, Principal and Chief AI and Quantum Officer each approve or edit their message
- [ ] `status: approved` set in `content/messages/*.md` (or the rows updated in Supabase)

### LAUNCH-03 Upload photos
P0 · M · Depends on: LAUNCH-01
- [ ] Leader and officer photos in the `site-images` bucket; `photo_url` set
- [ ] One `ai_people` row per champion (15) and ambassador (50) with name, department and photo
- [ ] Home page and `/ai-quantum/champions` show real cards, no placeholders

### LAUNCH-04 Approve department statements
P0 · M · Depends on: none
- [ ] Each head of department approves vision, mission and research areas for their department
- [ ] Draft wording replaced in `departments`

### LAUNCH-05 Enter the 25 MoUs
P1 · S · Depends on: LAUNCH-01
- [ ] 25 rows in `mous` with partner, type, purpose and dates; signed PDFs linked where available
- [ ] `/mous` shows the directory instead of "Partner list coming soon"

### LAUNCH-06 Name House 4 and House 5
P1 · S · Depends on: LAUNCH-01
- [ ] Names, namesakes and descriptions entered; `is_placeholder` set to false
- [ ] Menu no longer shows "Name coming soon"

### LAUNCH-07 Official contacts and sample rows
P0 · S · Depends on: LAUNCH-01
- [ ] Phone and email set in `lib/site.ts`; shown in header and footer
- [ ] All `is_sample = true` rows deleted or replaced (research, consultancy, training, news)

### LAUNCH-08 Deploy and connect the domain
P0 · S · Depends on: LAUNCH-01, SEC-02, SEC-05
- [ ] Vercel project with four environment variables (no secret key)
- [ ] Domain connected over HTTPS (test on a subdomain first, then `www.hkbk.edu.in`)
- [ ] Supabase webhook calls `/api/revalidate`; an edit appears within a minute

### SEC-01 Rate limiting on enquiry forms
P0 · M · Depends on: LAUNCH-01
Limit submissions per IP address and per email to stop floods.
- [ ] More than 5 submissions per IP per 10 minutes are rejected with a friendly message
- [ ] Limits stored in Postgres (no new service) or in Vercel's firewall rules
- [ ] Honeypot and validation unchanged; INV-02 still passes

### SEC-02 Security headers
P0 · S · Depends on: none
- [ ] `next.config.ts` sends `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` (camera, microphone, geolocation off)
- [ ] securityheaders.com grade A or better on the deployed site

### SEC-03 Content Security Policy
P1 · M · Depends on: SEC-02
- [ ] CSP with nonces for Next.js scripts; `frame-src` allows Google Maps on `/contact` only
- [ ] No console CSP violations on any page

### SEC-04 Dependency patching
P1 · S · Depends on: CI-01
- [ ] Monthly update routine documented; `npm audit --omit=dev` runs in CI and fails on high severity

### SEC-05 Privacy notice and retention
P0 · S · Depends on: none
- [ ] `/privacy` page explaining what forms collect, why, who sees it, retention period and how to request deletion
- [ ] Linked from every form's consent line and the footer
- [ ] Retention period agreed and a scheduled job (pg_cron) deletes enquiries older than it

### CI-01 Continuous integration
P1 · S · Depends on: none
- [ ] GitHub Actions on every pull request: `npm ci`, `typecheck`, `build`, `check:invariants`
- [ ] Pull requests cannot merge while checks fail

### CI-02 Automated browser and accessibility tests
P1 · M · Depends on: CI-01
- [ ] Playwright smoke tests: menu, mega menus, tabs and deep links, forms, theme toggle, at 390px and 1440px
- [ ] axe-core A/AA audit of key pages in light and dark mode; fails on any violation
- [ ] Menu fits on one line at 1280px (test asserts a single row)

### SEO-01 Structured data and sharing images
P1 · S · Depends on: none
- [ ] `CollegeOrUniversity` JSON-LD on the home page; `BreadcrumbList` on inner pages
- [ ] Open Graph images for the home page and each section

## Phase 2: Staff portal

### SEC-06 / PORTAL-01 Staff sign-in
P2 · M · Depends on: LAUNCH-08
- [ ] Supabase Auth with Google Workspace or Microsoft (college accounts only)
- [ ] `proxy.ts` refreshes sessions; `/staff` routes require sign-in
- [ ] Public pages remain static and cookie-free (ADR-010)

### PORTAL-02 Roles and permissions
P2 · M · Depends on: PORTAL-01
- [ ] Roles: admin, department editor, placement cell, industry cell, IQAC
- [ ] RLS policies grant each role write access only to its tables or rows; invariants extended

### PORTAL-03 Enquiry inbox
P2 · L · Depends on: PORTAL-02
- [ ] Staff see enquiries for their role, assign them, change status and add notes
- [ ] Filters by type, status and date; export to CSV

### PORTAL-04 New-enquiry notifications
P2 · M · Depends on: PORTAL-03
- [ ] Database webhook and Edge Function email the responsible office within a minute

### PORTAL-05 Content editor
P2 · L · Depends on: PORTAL-02
- [ ] Forms to edit pages (Markdown preview), news, figures, MoUs, houses, people and initiative links
- [ ] Image upload to `site-images`; changes trigger revalidation

### PORTAL-06 Audit log
P2 · M · Depends on: PORTAL-05
- [ ] Every insert, update and delete records who, what, when and the previous value

## Phase 3: Centres and initiatives sites

### SITES-01 Shared design system package
P2 · L · Depends on: none
- [ ] Tokens, `components/ui`, header and footer published as a workspace package used by this site and the subdomain sites

### SITES-02 Centre site starter
P2 · L · Depends on: SITES-01
- [ ] Next.js template with home, about, events, team, resources and contact pages, reading its own Supabase tables with RLS

### SITES-03 Launch centre sites
P2 · XL · Depends on: SITES-02
- [ ] UHV, IEEE, IDEA Lab, R&D, Skill Development Centre, Equal Opportunity Cell and Alumni Network live on their subdomains
- [ ] Each `portals` row set to `Live` with its `url`; menus link straight to the sites

## Phase 4: AI First services

### AI-01 Campus assistant with citations
P2 · XL · Depends on: PORTAL-01
- [ ] Answers questions from approved college documents only, with citations; says when it does not know
- [ ] Documents embedded with pgvector (Supabase automatic embeddings); human review of the document set
- [ ] Clear AI disclosure and feedback button; no personal data in prompts

### AI-02 AI literacy modules
P2 · L · Depends on: PORTAL-01
- [ ] Short modules for students and staff with completion tracking

### AI-03 Live AI dashboards
P3 · L · Depends on: AI-01, AI-02
- [ ] Dashboards hub items switch from "In development" to live links

### AI-04 AI Champions and Ambassadors profiles
P2 · M · Depends on: PORTAL-05
- [ ] AI office manages profiles, photos and activities; cards link to profiles

## Phase 5: Quantum Lab and quantum-safe campus

### QL-01 Circuit composer and simulator
P3 · XL · Depends on: PORTAL-01
- [ ] Drag-and-drop circuits up to 10 qubits simulated in the browser; save and share

### QL-02 Quantum hardware job broker
P3 · L · Depends on: QL-01
- [ ] Submit jobs to IBM Quantum within per-student quotas; results stored and shown

### QL-03 Quantum-safe readiness dashboard
P3 · L · Depends on: none
- [ ] Inventory of campus systems and their cryptography; progress towards ML-KEM and ML-DSA

### QL-04 Post-quantum signed certificates
P3 · L · Depends on: QL-03
- [ ] Certificates signed with ML-DSA and verifiable on a public page

## Phase 6: Research and industry

### RI-01 Publications and patents register
P2 · L · Depends on: PORTAL-02
- [ ] Register of papers and patents; papers, filed, published and granted figures computed from it

### RI-02 MoU lifecycle
P3 · M · Depends on: LAUNCH-05
- [ ] Renewal reminders, activities and outcomes per MoU

### RI-03 Placement records
P2 · M · Depends on: PORTAL-02
- [ ] Placements by year, programme and recruiter; placements page and figures computed from them

### RI-04 Consultancy and training pipelines
P3 · L · Depends on: PORTAL-03
- [ ] Track enquiries through proposal, delivery and feedback
