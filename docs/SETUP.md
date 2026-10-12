# Setup

## 1. Run the site locally

Requirements: Node.js 20.9 or newer, and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase, content comes from the `content/` folder and the forms show a "not connected" message.

## 2. Create the Supabase project

1. Sign in at [supabase.com](https://supabase.com) and create a new project. Choose the region closest to Bengaluru (Mumbai, `ap-south-1`) so pages load quickly and data stays in India.
2. Save the database password somewhere safe.

## 3. Create the tables

**Quickest way (one paste):** open **SQL Editor → New query**, paste the whole of `supabase/setup_all.sql`, and click **Run**. It creates every table with row-level security, the `site-images` storage bucket, and loads all the website content, so you can skip step 5. It is safe to run again. Regenerate it after changing content or migrations with `npm run db:sql`.

**Or step by step:**

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste the contents of `supabase/migrations/20261003000000_init.sql` and select **Run**.
3. Do the same for the other files in `supabase/migrations`, in order of their names.

This creates every table, turns on row-level security, and creates a public `site-images` storage bucket for portraits.

Quickest option: paste the single file `supabase/setup_all.sql` into the SQL Editor and click **Run**. It runs every migration and loads all the content in one go, and is safe to run again (regenerate it with `npm run db:sql` after changing migrations or content).

If you use the Supabase CLI instead:

```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

## 4. Add environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` from **Project Settings > API Keys**:

| Variable | Where to find it | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Website and seed script |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`). The legacy anon key also works as `NEXT_PUBLIC_SUPABASE_ANON_KEY`. | Website |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`). The legacy service_role key also works as `SUPABASE_SERVICE_ROLE_KEY`. | Seed script only |
| `REVALIDATE_SECRET` | Any long random string you choose | `/api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | The public address, for example `https://www.hkbk.edu.in` | SEO metadata and sitemap |

Never commit `.env.local`, and never put the secret key in any variable that starts with `NEXT_PUBLIC_`.

## 5. Generate database types (optional, after schema changes)

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), sign in with `supabase login`, then run:

```bash
SUPABASE_PROJECT_ID=your-project-ref npm run db:types
```

This rewrites `lib/database.types.ts` from your live schema. The repository already includes a copy that matches the migrations.

## 6. Upload the content

```bash
npm run db:seed
```

This copies every file in `content/` into Supabase. It is safe to run again: rows are matched by `slug` and updated. To leave out placeholder rows, run `npm run db:seed:no-samples` instead.

## 7. Check it works

1. Restart `npm run dev`.
2. Change a page title in **Table Editor > pages** and reload the page within 5 minutes (or restart the dev server) to see it update.
3. Submit the form on `/contact`, then open **Table Editor > enquiries**. Your test message should be there.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| Terminal shows `[content] ... Using files in /content instead` | The tables are missing or the keys are wrong. Re-run the SQL migration and check `.env.local`. |
| Form says "not connected to the database yet" | `NEXT_PUBLIC_SUPABASE_URL` or the publishable key is missing. Restart the dev server after editing `.env.local`. |
| Form says "could not be saved" | Check the terminal for the Supabase error. The usual cause is a form `type` that is not in the database check constraint. |
| `npm run db:seed` says keys are missing | `SUPABASE_SECRET_KEY` is not set in `.env.local`. |
