# Rules

The rules for everyone who changes this project: developers, content editors and AI coding agents. `AGENTS.md` summarises the engineering rules for agents; this file is the full, authoritative version. Rules marked **[auto]** are checked by `npm run check:invariants` (see `invariants.md`).

## 1. Engineering

### Stack
- R1. Next.js App Router (16.x LTS), React 19, TypeScript strict. Do not add another framework, CSS library or state library without an ADR in `decision.md`.
- R2. Tailwind CSS v4 utilities only. No `@apply`, no CSS modules, no inline `style` except for computed values that utilities cannot express.
- R3. shadcn/ui primitives in `components/ui/`; add new ones with `npx shadcn@latest add <name>`. Do not restyle primitives inside features; extend variants instead.

### Structure
- R4. `app/` for routes, `components/ui/` for primitives, `components/features/<area>/` for domain components, `actions/` for Server Actions, `lib/` for utilities and data access, `scripts/` for Node tooling.
- R5. File names are kebab-case; components are PascalCase default exports.
- R6. Components stay under 150 lines; split into focused sub-components. **[auto]**
- R7. The menu is defined once, in `lib/menu.ts`. Header, footer and banners render from it. **[auto]**

### Rendering and data
- R8. Server Components by default. Use `"use client"` only for state, effects or browser APIs.
- R9. Never export plain values from a `"use client"` file for server code to import; shared constants go in `lib/`. **[auto]**
- R10. Fetch data in Server Components through `lib/content.ts`. Do not call Supabase from Client Components for public content.
- R11. All mutations go through Server Actions in `actions/` using `createSupabaseServerClient()`.
- R12. Every page that reads content exports `revalidate = 300`.
- R13. Every function handles its failure cases: missing rows, Supabase errors, network failures, invalid input. Log on the server; show a plain message to the visitor.
- R14. No placeholder code or comments such as "implement later". Ship complete, working code.

### Types
- R15. Row types come from `lib/database.types.ts` via `lib/types.ts`. Never hand-write row types. **[auto: every table present]**
- R16. After any migration: update `lib/database.types.ts` (`npm run db:types` with a connected project), run `npm run db:sql`, and commit both.

## 2. Database
- R17. Schema changes only as new files in `supabase/migrations/` named `YYYYMMDDHHMMSS_description.sql`. Never edit a migration that has run in production; add a new one.
- R18. Every new table enables row-level security and gets explicit policies in the same migration. **[auto]**
- R19. Public roles get `select` on content tables only; `enquiries` keeps insert-only. **[auto]**
- R20. Migrations are idempotent (`if not exists`, `drop ... if exists` before `create`).
- R21. Every content table has a unique `slug` and a `sort_order`. **[auto: unique slugs]**
- R22. `supabase/setup_all.sql` must match the migrations and content. **[auto]**

## 3. Security
- R23. The Supabase secret key appears only in `scripts/` and `.env.local`. Never in `NEXT_PUBLIC_*`, client code, Git or Vercel. **[auto]**
- R24. Never paste keys or passwords into chats, tickets, commits or documents.
- R25. External links open with `target="_blank" rel="noopener noreferrer"` and an "opens in a new tab" hint for screen readers.
- R26. Forms validate on the server, include the honeypot, require consent and cap field lengths.

## 4. Design
- R27. Colours come only from tokens and the `TONE` map; no hex values or `bg-white` in components (approved image backings excepted). **[auto]**
- R28. Section colour as text always pairs with its dark-mode light variant.
- R29. Every new screen is checked in light and dark mode, at 390px, 768px, 1280px and 1440px.
- R30. The top menu must fit on one line at 1280px. If a new item breaks this, tighten spacing or shorten labels before merging.
- R31. Icons from lucide-react, `aria-hidden`; icon-only buttons need an `aria-label`.

## 5. Accessibility
- R32. WCAG 2.2 AA. Zero axe-core A/AA violations on changed pages in both themes.
- R33. All functionality works by keyboard, with a visible focus ring.
- R34. One `h1` per page; headings in order; images have accurate alt text or `alt=""` if decorative.
- R35. Forms: visible labels, field-level errors with `aria-invalid`, and a summary message.

## 6. Content
- R36. Never invent facts: no made-up statistics, names, partners, recruiters, dates or quotes.
- R37. Unapproved text carries `status: draft`; seeded placeholder rows carry `is_sample: true`.
- R38. Leadership and officer messages are published only after the person approves them.
- R39. Use the college's terms: "Centres & Initiatives" (never "portals"), "MoUs", "AI First Campus", "Quantum Ready Campus".
- R40. Calculated figures (years of excellence, AI champions and ambassadors counts) are never typed into data. **[auto]**
- R41. A centre or initiative is marked `Live` only when its `url` works. **[auto]**
- R42. Photographs must be owned by the college or used with written permission.

## 7. Workflow
- R43. Work on a branch; open a pull request into `main`; Vercel deploys `main`.
- R44. Commit messages: imperative and specific ("Add MoU directory page", not "updates").
- R45. Update `changelog.md` under "Unreleased" in the same pull request.
- R46. Record any architectural change as an ADR in `decision.md`.
- R47. Regenerate `docs/manifest.md` with `npm run docs:manifest` when routes, components, tables or scripts change.

## 8. Definition of done

A change is done when:

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run check:invariants` passes
- [ ] Checked in light and dark mode and at the four widths in R29
- [ ] Accessibility audit clean for changed pages
- [ ] `changelog.md` updated; ADR added if needed; manifest regenerated if needed
- [ ] Content is approved or clearly marked as draft
