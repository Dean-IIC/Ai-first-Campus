# Roadmap

Where the HKBK website goes next. Quarters are targets, not commitments; each item links to a ticket in `feature-tickets.md`. Completed work is recorded in `changelog.md`.

| Phase | Theme | Target | Status |
| --- | --- | --- | --- |
| 0 | Public website foundation | October 2026 | **Done** (v0.17.0) |
| 1 | Launch | October to November 2026 | Next |
| 2 | Staff portal | Q1 2027 | Planned |
| 3 | Centres and initiatives sites | Q1 to Q2 2027 | Planned |
| 4 | AI First services | Q2 2027 | Planned |
| 5 | Quantum Lab and quantum-safe campus | Q3 2027 | Planned |
| 6 | Research and industry | Q4 2027 | Planned |

## Phase 0: Public website foundation (done)

- [x] Every public page: About, Programmes, Departments (with vision and mission), Centre of Excellence, IEEE and chapters, Houses, Placements, MoUs, AI First Campus, AI Champions and Ambassadors, Quantum Ready Campus, IDEA Lab, IQAC, News, Contact
- [x] Leadership messages in full; message from the Chief AI and Quantum Officer under AI-First Campus
- [x] Big numbers, college logo, campus photograph, AI and quantum illustrations
- [x] One menu tree for the top bar and footer; every menu item always visible
- [x] Centres and initiatives ready to switch to their subdomains by data change
- [x] shadcn/ui on Tailwind tokens; light and dark mode; WCAG AA audits clean
- [x] Supabase schema with RLS, typed clients, Server Action forms, file fallback
- [x] One-file database setup, invariant checker, generated manifest, full documentation

## Phase 1: Launch

Goal: the site live on the college domain with approved content.

| Ticket | Item |
| --- | --- |
| LAUNCH-01 | Connect the Supabase project and load content |
| LAUNCH-02 | Leaders and the Chief AI and Quantum Officer approve their messages |
| LAUNCH-03 | Upload photos of leaders, champions and ambassadors |
| LAUNCH-04 | Department vision and mission statements approved |
| LAUNCH-05 | Enter the 25 MoUs |
| LAUNCH-06 | Name House 4 and House 5 |
| LAUNCH-07 | Official phone and email; remove sample rows |
| LAUNCH-08 | Deploy to Vercel, connect the domain, add the revalidate webhook |
| SEC-01, SEC-02, SEC-05 | Rate limiting, security headers, privacy notice |

**Exit criteria:** release criteria in `prd.md` section 9 are all met.

## Phase 2: Staff portal

Goal: staff manage content and enquiries without the Supabase dashboard.

- Staff sign-in with Supabase Auth using the college's Google Workspace or Microsoft accounts; session-refresh `proxy.ts` (SEC-06, PORTAL-01)
- Roles: admin, department editor, placement cell, industry cell, IQAC (PORTAL-02)
- Enquiry inbox with assignment, status, notes and email notification to the right office (PORTAL-03, PORTAL-04)
- Content editor for pages, news, figures, MoUs, houses, people and initiative links (PORTAL-05)
- Audit log of every change (PORTAL-06)

## Phase 3: Centres and initiatives sites

Goal: each centre and initiative has its own site on a subdomain with a shared look.

- Shared design system package (tokens, primitives, header and footer) reused across subdomain sites (SITES-01)
- Starter template for a centre site, connected to the same Supabase project with its own tables (SITES-02)
- Launch order proposed: UHV, IEEE, IDEA Lab, R&D, Skill Development Centre, Equal Opportunity Cell, Alumni Network (SITES-03)
- Switch each `portals` row to `Live` as its site launches

## Phase 4: AI First services

- Campus assistant that answers from official documents with citations (pgvector with Supabase automatic embeddings) (AI-01)
- AI literacy modules and progress tracking for students and staff (AI-02)
- Live dashboards: AI assistant usage, literacy progress, AI Champions activity (AI-03)
- AI Champions and Ambassadors profiles managed by the AI office (AI-04)

## Phase 5: Quantum Lab and quantum-safe campus

- Circuit composer and in-browser simulator (QL-01)
- Job broker for real quantum hardware through IBM Quantum, with per-student quotas (QL-02)
- Cryptographic inventory of campus systems and a quantum-safe readiness dashboard (QL-03)
- Verifiable digital certificates with post-quantum signatures (ML-DSA) (QL-04)

## Phase 6: Research and industry

- Publications and patents register feeding the research figures and a research output dashboard (RI-01)
- MoU lifecycle: renewals, activities and outcomes per partner (RI-02)
- Placement records by year and recruiter, feeding the placements page (RI-03)
- Consultancy and training pipelines with proposals and feedback (RI-04)
