# Product requirements document (PRD)

**Product:** HKBK College of Engineering website, an AI First and Quantum Ready campus
**Owner:** Office of the Chief AI and Quantum Officer, HKBK College of Engineering
**Version:** 0.17 (October 2026)
**Status:** Built; awaiting Supabase connection, content approval and launch

## 1. Problem

HKBK College of Engineering (Nagawara, Bengaluru; established 1997; affiliated to VTU, approved by AICTE) is repositioning as an **AI First and Quantum Ready campus**. It needs a modern public website that:

- presents the college, its leadership, programmes, departments and research credibly;
- shows the AI and quantum commitment with concrete evidence (AI Faculty Champions, AI Student Ambassadors, Quantum Lab, dashboards);
- connects to the separate sites that centres and initiatives (UHV, R&D, IEEE, IDEA Lab and others) will launch on their own subdomains;
- can be updated by college staff without developers.

## 2. Goals

| ID | Goal |
| --- | --- |
| G1 | Visitors find programmes, departments and contact details in three clicks or fewer from any page |
| G2 | The AI First and Quantum Ready identity is visible on the home page and in a dedicated menu area |
| G3 | Staff update content (news, figures, MoUs, people, links) in Supabase without code changes |
| G4 | Every centre and initiative can go live on its own subdomain by changing one database row |
| G5 | The site is fast, accessible (WCAG 2.2 AA), secure, and works in light and dark mode |

**Non-goals (this release):** online admissions, hostel management, student or staff sign-in, fee payments, an AI chatbot, live dashboards. See `roadmap.md`.

## 3. Audiences

| Audience | Needs |
| --- | --- |
| Prospective students and parents | Programmes, departments, campus, placements, credibility |
| Current students | IEEE, houses, AI programmes, news and events |
| Industry partners | Consultancy, corporate training, MoUs, placements |
| Researchers and academics | Research centres, R&D, IEEE chapters |
| Accreditation and regulatory reviewers | Vision and mission, IQAC, leadership, figures |
| College staff (editors) | Simple, safe ways to update content and read enquiries |

## 4. Functional requirements

### Global

| ID | Requirement | Status |
| --- | --- | --- |
| FR-01 | Top menu, in this order: Home, About, Programmes, Departments, Centre of Excellence, IEEE, Houses, Placements, MoUs, AI First Campus, Quantum Ready Campus, IDEA Lab, IQAC | Done |
| FR-02 | Every menu item is always visible on the bar; on narrow screens items wrap and dropdowns open on tap | Done |
| FR-03 | Dropdown items open mega menus with link columns and a feature card | Done |
| FR-04 | Inner pages use the full width for content, with no left panel (removed at the college's request) | Done |
| FR-05 | Footer organised into six columns with 12px text, plus a brand and contact block | Done |
| FR-06 | College logo in the header, footer and browser tab | Done |
| FR-07 | Light and dark mode, following the system setting, with a toggle that remembers the choice | Done |
| FR-08 | Breadcrumb banner on inner pages, coloured by section | Done |

### Home page

| ID | Requirement | Status |
| --- | --- | --- |
| FR-10 | Hero with headline, key facts and the campus photograph | Done |
| FR-11 | Big numbers: years of excellence (29, calculated), 2,500+ students, 150+ faculty, 300+ papers, 150 patents filed, 50 published, 30 granted, 25 MoUs, 15 AI Faculty Champions, 50 AI Student Ambassadors, 200 students placed | Done |
| FR-12 | Quick access tiles to the most-used pages | Done |
| FR-13 | Vision and mission | Done |
| FR-14 | Leadership messages from the Chairman (Shri. C M Ibrahim), Director (Shri. C M Faiz Mohammed) and Principal (Dr. Mohammed Riyaz Ahmed), in full, one below the other, name under photo | Done (text is draft) |
| FR-15 | AI-First Campus section: introduction, message from the Chief AI and Quantum Officer (Dr. Tabassum Ara), all 15 champions and 50 ambassadors as cards | Done (names and photos pending) |
| FR-16 | Notices and events in tabs; research and industry panels; departments grid; visit strip | Done |

### Sections

| ID | Requirement | Status |
| --- | --- | --- |
| FR-20 | About: overview, vision and mission, leadership | Done |
| FR-21 | Programmes: five BE programmes (CSE, ISE, AIML, ME, ECE) | Done |
| FR-22 | Departments: ten departments, each with vision, mission, overview and research centre where applicable | Done (statements are draft) |
| FR-23 | Centre of Excellence: R&D, six research centres (CSE, ECE, ME, Chemistry, Physics, Mathematics), research projects, consultancy, corporate training, UHV, Skill Development Centre, Equal Opportunity Cell, Alumni Network | Done |
| FR-24 | IEEE: branch overview, activities, membership, chapters CIS, WIE, Information Theory Society, Education Society | Done |
| FR-25 | Houses: Dr. A. P. J. Abdul Kalam, Mother Teresa, Rabindranath Tagore, House 4 and House 5 (names pending) | Done |
| FR-26 | Placements page with placement figure and preparation process | Done |
| FR-27 | MoUs page: count, scope, partner directory by type (Industry, Academic, Research, Government) | Done (partner list pending) |
| FR-28 | AI First Campus: page, Chief AI and Quantum Officer's message, AI Champions and Ambassadors page, dashboards hub | Done |
| FR-29 | Quantum Ready Campus: Quantum Lab, process steps, quantum-safe timeline | Done |
| FR-30 | IDEA Lab and every centre or initiative: ready-made page until its subdomain is live, then a direct link | Done |
| FR-31 | IQAC: about, objectives, functions, reports | Done (reports pending) |
| FR-32 | News and events; contact page with map and form | Done |

### Data and administration

| ID | Requirement | Status |
| --- | --- | --- |
| FR-40 | All content stored in Supabase and editable in the Table Editor | Done (pending connection) |
| FR-41 | Site keeps working from `/content` files if Supabase is unavailable | Done |
| FR-42 | Contact, consultancy and corporate training forms save to `enquiries` | Done |
| FR-43 | Edits appear within 5 minutes, or instantly with the revalidate webhook | Done |
| FR-44 | One-file database setup (`supabase/setup_all.sql`) and a seed script | Done |

## 5. Non-functional requirements

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-01 | Performance | Static pages from the edge; Largest Contentful Paint under 2.5 s on 4G for the home page |
| NFR-02 | Accessibility | WCAG 2.2 AA; zero axe A/AA violations on key pages in both themes |
| NFR-03 | Responsiveness | 360px to 1920px; menu on one line from 1280px |
| NFR-04 | Security | RLS on every table; secret key never in client or Vercel; see `security.md` |
| NFR-05 | Privacy | Consent on every form; privacy notice before launch (SEC-05) |
| NFR-06 | Maintainability | Components under 150 lines; typed with generated Supabase types; invariants pass |
| NFR-07 | SEO | Unique titles and descriptions, sitemap, robots, semantic headings |
| NFR-08 | Availability | Content fallback; Vercel and Supabase managed hosting |

## 6. Success measures (first six months after launch)

- Enquiries received per month through the website (baseline at launch).
- Share of visits reaching Programmes or Departments.
- All centres and initiatives linked to live subdomains.
- Zero accessibility regressions in quarterly audits.
- Content updated by staff at least weekly without developer help.

## 7. Assumptions and constraints

- Hosting on Vercel; database on Supabase (Mumbai region recommended).
- All leadership, department and page text is **draft** until approved by the people concerned.
- Figures supplied by the college as of October 2026; staff keep them current.
- Hostel and Admissions are out of scope at the college's request.

## 8. Open items

| Item | Owner |
| --- | --- |
| Approve leadership messages and the Chief AI and Quantum Officer's message | Each leader |
| Photos of leaders, AI Faculty Champions and AI Student Ambassadors | Office of the Chief AI and Quantum Officer |
| Department vision and mission statements | Heads of department |
| Names of House 4 and House 5 | Student affairs |
| The 25 MoU partners | Industry relations |
| Additional IEEE chapters, if any | IEEE branch counsellor |
| Official phone and email | Administration |
| Subdomain addresses for each centre and initiative | IT team |

## 9. Release criteria

- [ ] Supabase connected and seeded; invariants and build pass
- [ ] All draft text approved; placeholders replaced or accepted
- [ ] Security headers and rate limiting in place (SEC-01, SEC-02)
- [ ] Privacy notice published (SEC-05)
- [ ] Accessibility audit passes in both themes
- [ ] Deployed to the production domain over HTTPS with the revalidate webhook working
