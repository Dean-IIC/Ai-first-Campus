# HKBK College of Engineering website

The public website for HKBK College of Engineering, Nagawara, Bengaluru: an AI First and Quantum Ready campus. Built with **Next.js 16** (App Router, React Server Components), **shadcn/ui** on Tailwind CSS v4, **Supabase** (Postgres with row-level security, `@supabase/ssr`) and full **light and dark mode**.

The site runs immediately with no database: every page falls back to the Markdown and JSON files in [`content/`](content). Connect Supabase when you want staff to edit content in a dashboard and to collect form submissions.

## What is included

| Area | Route | Content source |
| --- | --- | --- |
| Home: campus photo, big numbers (years, students, faculty, papers, patents, MoUs, AI Champions and Ambassadors, placements), quick access, vision and mission, full leadership messages, AI-First Campus (all 15 AI Faculty Champions and 50 AI Student Ambassadors), news and events | `/` | several |
| About, with Vision and mission and Leadership tabs | `/about` | `pages/about`, `pages/vision-mission` |
| Leadership messages from the Chairman, Director and Principal, in full, one below the other (also on the home page) | `/leadership` | `leadership_messages` |
| Departments: CSE, ISE, AIML, ME, ECE, Mathematics, Physics, Chemistry, Humanities, Physical Education and Sports | `/academics` | `departments` |
| Department pages with vision, mission and research centre | `/academics/[slug]` | `departments` |
| Programmes: BE in CSE, ISE, AIML, ME and ECE | `/programmes` | `departments` |
| AI & Quantum overview, AI First campus, Quantum Lab | `/ai-quantum/...` | `pages/*` |
| AI Champions and Ambassadors: 15 faculty and 50 student placeholders that fill in as names and photos are added | `/ai-quantum/champions` | `ai_people` |
| AI and quantum dashboards hub | `/ai-quantum/dashboards` | `dashboards` |
| Research and development | `/research` | `research_projects` |
| Research centres: CSE, ECE, ME, Chemistry, Physics, Mathematics | `/research/centres` | `departments` |
| Consultancy projects, with request form | `/consultancy` | `consultancy_projects` |
| Corporate training, with enquiry form | `/corporate-training` | `training_programs` |
| UHV information page | `/uhv` | `pages/uhv` |
| News and events | `/news` | `news_items` |
| Centres & Initiatives: UHV, R&D, IEEE Student Branch, IDEA Lab, Skill Development Centre, Equal Opportunity Cell, Alumni Network. Each links to its own subdomain once live | Top menu (Centre of Excellence, IEEE, IDEA Lab), footer, `/initiatives` (one tab each), `/initiatives/[slug]` | `portals` table |
| Houses: Dr. A. P. J. Abdul Kalam, Mother Teresa, Rabindranath Tagore and two to be named | `/houses` (one tab each) | `houses` |
| Placements | `/placements` | `pages/placements`, `key_figures` |
| MoUs: count and partner directory | `/mous` | `mous`, `key_figures`, `pages/mous` |
| IQAC | `/iqac` | `pages/iqac` |
| IEEE Student Branch with chapters: CIS, WIE, Information Theory Society, Education Society | `/ieee` (one tab each) | `pages/ieee` |
| Contact, with map and form | `/contact` | site settings |

The contact, consultancy and corporate training forms save to one `enquiries` table, which staff read in the Supabase dashboard.

Images live in `public/images`: the college logo, a photograph of the college building, and original AI and quantum illustrations (see [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md#images)).

## Quick start

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Every page works; forms explain that the database is not connected yet.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the three files in [`supabase/migrations`](supabase/migrations) in order of their names.
3. Copy `.env.example` to `.env.local` and fill in the URL, publishable key and secret key.
4. Upload the content: `npm run db:seed`
5. Restart `npm run dev`. Pages now read from Supabase, and forms save enquiries.

Full steps: [docs/SETUP.md](docs/SETUP.md).

## Before launch

All copy in `content/` is a **draft** written for review. Leadership messages in particular must be approved by each person before publishing. Work through the checklist in [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md#launch-checklist), which covers names, photos, phone and email, accreditation details and removing sample rows.

## Documentation

| Document | What it covers |
| --- | --- |
| [docs/prd.md](docs/prd.md) | Product requirements: goals, audiences, functional and non-functional requirements, release criteria |
| [docs/master-spec.md](docs/master-spec.md) | Complete technical specification: architecture, routes, navigation, data model, forms, caching, environment |
| [docs/design.md](docs/design.md) | Design system: tokens, type, layout, components, icons, imagery, motion, accessibility |
| [docs/flow.md](docs/flow.md) | Visitor journeys and data flows, with diagrams |
| [docs/decision.md](docs/decision.md) | Architecture decision records (ADR-001 to ADR-022) |
| [docs/security.md](docs/security.md) | Assets, threats, RLS policies, keys, privacy, gaps, incident response |
| [docs/rules.md](docs/rules.md) | Rules for developers, editors and AI agents; definition of done |
| [docs/invariants.md](docs/invariants.md) | Must-always-be-true statements; `npm run check:invariants` |
| [docs/roadmap.md](docs/roadmap.md) | Phases from launch to the staff portal, initiative sites, AI services, Quantum Lab, research |
| [docs/feature-tickets.md](docs/feature-tickets.md) | Backlog with priorities, estimates and acceptance criteria |
| [docs/changelog.md](docs/changelog.md) | Release history |
| [docs/manifest.md](docs/manifest.md) | Generated inventory of routes, components, modules, tables, content and scripts (`npm run docs:manifest`) |
| [docs/SETUP.md](docs/SETUP.md) | Local setup and connecting Supabase |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploying to Vercel, domain, refresh webhook |
| [docs/AGENT_SETUP_PROMPT.md](docs/AGENT_SETUP_PROMPT.md) | Prompt for a coding agent to set up Supabase and deploy |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture overview |
| [docs/DATABASE.md](docs/DATABASE.md) | Tables, columns and useful queries |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | How staff edit content; launch checklist |
| [AGENTS.md](AGENTS.md) | Engineering standards summary for AI coding agents |

## Project structure

```text
app/                 Routes (one folder per page), server action for forms, sitemap
components/ui/       shadcn/ui primitives (button, card, badge, tabs, form controls, ...)
components/features/ Domain components by area: layout, navigation, home, content, people, forms, ...
actions/             Server Actions (enquiry form)
lib/                 cn helper, content loader, menu, Supabase clients, generated database types
content/
  messages/          Leadership messages (Markdown with front matter)
  pages/             Page text (Markdown with front matter)
  data/              Lists: departments, dashboards, projects, programmes, news
supabase/migrations/ Database schema and row-level security
scripts/seed.mjs     Uploads content/ to Supabase
docs/                Project documentation
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Check TypeScript types |
| `npm run db:types` | Regenerate `lib/database.types.ts` from Supabase (set `SUPABASE_PROJECT_ID`) |
| `npm run db:sql` | Rebuild `supabase/setup_all.sql`: all migrations and content in one file to paste into the SQL Editor |
| `npm run db:seed` | Upload `content/` to Supabase, including sample rows |
| `npm run db:seed:no-samples` | Upload `content/`, skipping rows marked as samples |
| `npm run db:sql` | Rebuild `supabase/setup_all.sql`: all migrations plus all content in one paste-and-run file |
| `npm run check:invariants` | Verify the automated invariants in `docs/invariants.md` |
| `npm run docs:manifest` | Regenerate `docs/manifest.md` and `manifest.json` |
