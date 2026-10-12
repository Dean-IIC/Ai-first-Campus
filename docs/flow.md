# Flows

How visitors move through the site and how data moves through the system. Diagrams use Mermaid, which GitHub renders.

## 1. Visitor navigation

```mermaid
flowchart TD
    A[Visitor lands on Home] --> B{What do they need?}
    B -->|About the college| C[About: overview, vision and mission, leadership messages]
    B -->|Choose a programme| D[Programmes: 5 BE programmes] --> E[Department page: vision, mission, research centre]
    B -->|A department| E
    B -->|Research, cells, industry| F[Centre of Excellence: R&D, research centres, UHV, skills, EOC, alumni, consultancy, training]
    B -->|Student life| G[IEEE and chapters, Houses]
    B -->|Outcomes| H[Placements, MoUs]
    B -->|AI and quantum| I[AI First Campus, AI Champions, Dashboards, Quantum Ready Campus, IDEA Lab]
    B -->|Quality| J[IQAC]
    B -->|Get in touch| K[Contact form]
    F --> L{Initiative live?}
    L -->|url set and status Live| M[Opens its subdomain in a new tab]
    L -->|not yet| N[Ready-made page /initiatives/slug]
```

Navigation surfaces, all built from one menu tree (`lib/menu.ts`):

| Surface | Behaviour |
| --- | --- |
| Top menu bar | 13 items. At 1280px and wider: one row, dropdowns open on hover or keyboard focus. Narrower: items wrap, dropdowns open on tap or click; Escape or a click outside closes them |
| Mega menus | Columns of links plus a feature card (picture, short text, button) |
| Footer | Six columns: About HKBK, Programmes, Departments, Centre of Excellence, Student life, AI and quantum |
| Breadcrumb banner | Home > section > page, coloured by section |

## 2. Reading content (every page view)

```mermaid
sequenceDiagram
    participant V as Visitor
    participant CDN as Vercel edge cache
    participant N as Next.js (Server Component)
    participant L as lib/content.ts
    participant S as Supabase (public client)
    participant F as /content files
    V->>CDN: GET /academics/cse
    alt Cached page is fresh (< 5 min)
        CDN-->>V: Static HTML
    else Needs regeneration
        CDN->>N: Render page
        N->>L: getList("departments")
        L->>S: select * order by sort_order
        alt Supabase answers
            S-->>L: rows (RLS: public read)
        else Not configured, error or network failure
            L->>F: read content/data/departments.json
            F-->>L: rows (and log a warning)
        end
        L-->>N: typed rows
        N-->>CDN: HTML (cached for 300 s)
        CDN-->>V: HTML
    end
```

## 3. Submitting an enquiry

```mermaid
sequenceDiagram
    participant V as Visitor
    participant B as Browser form (EnquiryForm)
    participant A as Server Action submitEnquiry
    participant S as Supabase (@supabase/ssr server client)
    V->>B: Fill in and submit (works with or without JavaScript)
    B->>A: FormData (type, name, email, phone, message, extra:*, consent, honeypot)
    A->>A: Honeypot filled? -> pretend success, store nothing
    A->>A: Validate type, name, email or phone, formats, required message, consent
    alt Invalid
        A-->>B: status error, message, field errors
        B-->>V: Field highlighted + alert
    else Valid
        A->>S: insert into enquiries (RLS allows insert only)
        alt Insert fails or network error
            S-->>A: error
            A-->>B: friendly error, logged on server
        else Saved
            S-->>A: ok
            A-->>B: status success
            B-->>V: "Thank you" confirmation
        end
    end
```

Staff then read the row in Supabase > Table Editor > `enquiries` and move `status` from `new` to `in_progress` to `closed`.

## 4. Editing and publishing content

```mermaid
flowchart LR
    E[Staff edits a row in Supabase Table Editor] --> W{Database webhook configured?}
    W -->|Yes| R[POST /api/revalidate with x-revalidate-secret] --> P[All pages regenerate on next request]
    W -->|No| T[Pages regenerate within 5 minutes]
    D[Developer edits files in /content] --> S1[npm run db:seed] --> E2[Rows upserted by slug] --> W
    D --> S2[npm run db:sql] --> SQL[supabase/setup_all.sql for new projects]
```

## 5. Taking a centre or initiative live

```mermaid
flowchart LR
    A[Subdomain site ready, e.g. https://uhv.hkbk.edu.in] --> B[portals row: set url]
    B --> C[portals row: set status = Live]
    C --> D[Top menu, footer and /initiatives link straight to the subdomain, new tab]
    C -.->|status Live without url| X[Blocked by INV-11]
```

## 6. Theme

```mermaid
flowchart LR
    S[System colour scheme] --> T{Saved choice in localStorage?}
    T -->|No| U[Follow system: light or dark]
    T -->|Yes| V[Use saved choice]
    G[Visitor clicks the sun/moon toggle] --> H[Switch class on html, save choice]
```

## 7. Deployment

```mermaid
flowchart LR
    C[Commit to main on GitHub] --> V[Vercel build: npm run build]
    V --> P[Pages pre-rendered with content from Supabase]
    P --> L[Live site on the custom domain over HTTPS]
    C -.-> Q[Before pushing: npm run typecheck, npm run build, npm run check:invariants]
```

## 8. First-time setup

```mermaid
flowchart TD
    A[Create Supabase project] --> B{Supabase CLI available?}
    B -->|Yes| C[npx supabase link, npx supabase db push] --> D[npm run db:seed]
    B -->|No| E[Paste supabase/setup_all.sql in SQL Editor, Run]
    D --> F[.env.local: URL, publishable key, secret key, revalidate secret]
    E --> F
    F --> G[npm run dev and verify] --> H[Deploy to Vercel] --> I[Add revalidate webhook]
```

Step-by-step instructions: `docs/SETUP.md`, `docs/DEPLOYMENT.md`, and the agent prompt in `docs/AGENT_SETUP_PROMPT.md`.
