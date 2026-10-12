# Engineering standards for this repository

Read this before changing code. The full, authoritative rules are in `docs/rules.md`; the must-always-be-true checks are in `docs/invariants.md` (run `npm run check:invariants`). Product scope is in `docs/prd.md` and the technical specification in `docs/master-spec.md`.

## Stack

- Next.js App Router (16.x LTS, same conventions as 15), React 19, TypeScript (strict).
- Tailwind CSS v4 with CSS-variable design tokens in `app/globals.css`. No `@apply`, no separate CSS files.
- shadcn/ui primitives in `components/ui/` (config in `components.json`). Radix UI under the hood; `lucide-react` icons.
- Supabase: Postgres with row-level security, `@supabase/ssr` for server and browser clients.
- `next-themes` for light and dark mode.

## Folder structure

| Path | What goes there |
| --- | --- |
| `app/` | Routes. Pages fetch data and compose feature components. Root `layout.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`, `not-found.tsx` |
| `components/ui/` | shadcn primitives only (button, card, badge, tabs, input, textarea, label, checkbox, native-select, separator, skeleton, alert). Add more with `npx shadcn@latest add <name>` |
| `components/features/<area>/` | Domain components: `layout`, `navigation`, `home`, `content`, `people`, `departments`, `forms`, `infographics`, `initiatives` |
| `actions/` | Server Actions (`"use server"`). All mutations go here |
| `lib/` | Utilities: `utils.ts` (`cn`), `content.ts` (data loader), `menu.ts` and `menu-server.ts` (navigation), `site.ts`, `ui.ts` (tones), `database.types.ts`, `supabase/` |

## Design rules

- Compose views from shadcn primitives (`Card`, `Button`/`buttonVariants`, `Badge`, `Tabs`, form controls). Feature components wrap them; do not restyle primitives ad hoc.
- Colours come from tokens only: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `text-heading`, `text-primary`, `border-border`, plus section tones from `TONE` in `lib/ui.ts`. Never hard-code hex values or `bg-white` in components.
- Dark mode is automatic through tokens. When a section colour is used as text, pair it with its light variant: `text-t-teal dark:text-t-teal-light`.
- Mobile first: base classes for phones, then `sm:`, `md:`, `lg:`, `xl:`.
- Glassmorphism sparingly: `backdrop-blur` with translucent `bg-*/NN` and a soft glow, only on surfaces over photos or dark bands.
- Respect `prefers-reduced-motion` (handled globally) and keep transitions short.

## Accessibility

- Every interactive element is reachable by keyboard and shows a visible focus ring.
- Icons are `aria-hidden`; icon-only buttons have an `aria-label`.
- Form fields use `FormField` (label, hint, error) and set `aria-invalid` on errors.
- Tabs use Radix Tabs through `ContentTabs`, which keeps every panel in the HTML and opens a tab from the URL hash.
- Text contrast meets WCAG AA in both themes.

## Rendering and data

- Server Components by default. Add `"use client"` only for state, effects or browser APIs (today: `main-nav`, `content-tabs`, `enquiry-form`, `count-up`, `theme-provider`, `theme-toggle`, shadcn `tabs`/`label`/`separator`).
- Never import non-component values from a `"use client"` file into server code; put shared constants in `lib/`.
- Public content: `lib/content.ts` with the cookie-free client in `lib/supabase/public.ts`, so pages stay statically cached (`revalidate = 300`). It falls back to `/content` files if Supabase is unavailable.
- Mutations: Server Actions in `actions/` using `createSupabaseServerClient()` from `lib/supabase/server.ts`.
- Browser code that needs Supabase uses `createSupabaseBrowserClient()` from `lib/supabase/client.ts`.
- Row-level security is on for every table. The secret key is used only by `scripts/seed.mjs`; never in `NEXT_PUBLIC_*` variables or client code.

## Types

- `lib/database.types.ts` is generated from the schema: `SUPABASE_PROJECT_ID=<ref> npm run db:types` after every migration.
- App types in `lib/types.ts` derive from it (`Tables<"departments">` minus `id`/`updated_at`). Do not hand-write row types.

## Code rules

- Complete, working code only; no placeholder comments.
- Every function handles its error cases (network failures, missing rows, invalid input).
- Keep components under 150 lines; split into focused sub-components when they grow.
- Menus are defined once in `lib/menu.ts`; the header, footer and banners all render from it. There is no left panel.
- Check work with `npm run typecheck`, `npm run build` and `npm run check:invariants`. Update `docs/changelog.md` and, when structure changes, run `npm run docs:manifest`.
