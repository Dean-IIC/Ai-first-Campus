# Prompt for a coding agent: set up and connect the HKBK website

Copy everything inside the box into your coding agent (for example Claude Code), opened in the folder that contains `hkbk-website`.

```text
You are setting up the HKBK College of Engineering website (Next.js 16 + Supabase) on this computer and connecting it to our Supabase project. Work step by step, run the commands yourself, check every result before moving on, and stop and explain if anything fails.

PROJECT
- Code: the folder `hkbk-website` (unzipped from hkbk-website.zip). First read README.md, AGENTS.md and docs/SETUP.md. Follow AGENTS.md for any code change.
- Supabase project URL: https://elhxrjkasyzjkyazutgi.supabase.co
- Supabase project ref: elhxrjkasyzjkyazutgi

SECURITY RULES (always)
- Never print, echo, log or commit secret values. Secrets live only in `.env.local`, which is git-ignored.
- Do not ask me to paste secret keys or the database password into this chat. Ask me to put them into `.env.local` myself (or type the password when a command prompts for it), then read them from there.
- The Supabase secret key must never go into a NEXT_PUBLIC_ variable, client code, Git, or Vercel.

STEP 1 - Check prerequisites
- Run: node -v (must be 20.9 or newer), npm -v, git --version, npx supabase --version.
- If Node is too old or missing, tell me what to install and stop.

STEP 2 - Install and build
- cd hkbk-website
- npm install
- npm run typecheck
- npm run build
- All three must succeed before continuing.

STEP 3 - Create .env.local
- Copy .env.example to .env.local.
- Set NEXT_PUBLIC_SUPABASE_URL=https://elhxrjkasyzjkyazutgi.supabase.co
- Set REVALIDATE_SECRET to a new random value: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
- Keep NEXT_PUBLIC_SITE_URL=https://www.hkbk.edu.in unless I give another address.
- Ask me to add, in .env.local, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_...) and SUPABASE_SECRET_KEY (sb_secret_...) from Supabase Dashboard > Project Settings > API Keys. Wait until I confirm.
- Confirm with `git check-ignore .env.local` that the file is ignored.

STEP 4 - Create the database schema (use option A; fall back to B)
Option A, Supabase CLI:
- npx supabase login            (opens a browser to sign in)
- npx supabase link --project-ref elhxrjkasyzjkyazutgi   (I will type the database password when asked)
- npx supabase db push          (applies the 8 files in supabase/migrations, in order)
Option B, if the CLI cannot be used:
- Tell me to open Supabase Dashboard > SQL Editor > New query, paste the entire contents of supabase/setup_all.sql, and click Run. This creates the schema AND loads all content, and is safe to run again. Then skip Step 5.

STEP 5 - Load the website content
- npm run db:seed
- This upserts all pages, leadership messages, departments, key figures, houses, centres and initiatives, news and other lists using the secret key from .env.local. (Use npm run db:seed:no-samples only if I ask to leave out rows marked as samples.)

STEP 6 - Verify
In the database (CLI `npx supabase db query` if available, or ask me to run these in the SQL Editor and tell you the results):
- Row counts must be: pages 23, leadership_messages 4, departments 10, key_figures 11, portals 7, houses 5, dashboards 7, training_programs 8, news_items 4, mous 0, ai_people 0.
- Row-level security on every table: select tablename from pg_tables where schemaname = 'public' and not rowsecurity;  must return no rows.
- Storage bucket: select id, public from storage.buckets where id = 'site-images';  must return one row with public = true.
Regenerate the database types and re-check the build:
- npx supabase gen types typescript --project-id elhxrjkasyzjkyazutgi --schema public > lib/database.types.ts
- npm run typecheck and npm run build must pass. If they fail because of the new types, fix the code following AGENTS.md, not by editing the generated file.
Check the running site:
- npm run dev, then open http://localhost:3000.
- The terminal must NOT show "[content] ... Using files in /content instead" warnings; that would mean Supabase is not being read.
- Submit the Contact page form with obvious test data, confirm a new row appears in the `enquiries` table, then delete that test row.

STEP 7 - Deploy (only after I say "deploy")
- Create a PRIVATE GitHub repository named hkbk-website and push the code (never .env.local).
- In Vercel: Add New > Project > import the repository. Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, REVALIDATE_SECRET, NEXT_PUBLIC_SITE_URL. Do NOT add SUPABASE_SECRET_KEY. Deploy.
- Give me the deployed URL and confirm the home page, a department page and the Contact form work there.
- Then help me create a Supabase Database Webhook (Database > Webhooks): tables pages, leadership_messages, news_items, key_figures, mous, portals; events insert, update, delete; HTTP POST to https://<deployed-domain>/api/revalidate with header x-revalidate-secret set to the REVALIDATE_SECRET value.

STEP 8 - Report back
- List what you did, each verification result (pass or fail), the deployed URL if any, and anything I still need to do (for example: approve leadership messages, upload photos to the site-images bucket, enter the 25 MoUs, name House 4 and House 5).
```

## Have these ready before you start

- The **publishable key** and **secret key** from Supabase > Project Settings > API Keys.
- The **database password** you chose when you created the Supabase project (needed for option A).
- Your GitHub and Vercel accounts, if you want the agent to deploy.
