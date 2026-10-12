# Deployment

The recommended setup is **Vercel** for the website and **Supabase** for the database. Both have free tiers suitable for testing.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, select **Add New > Project** and import the repository. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add the values from your `.env.local`, except `SUPABASE_SECRET_KEY`, which the website does not need:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `REVALIDATE_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (for example `https://www.hkbk.edu.in`)
4. Select **Deploy**.

## Custom domain

In the Vercel project, open **Settings > Domains**, add the domain, and follow the DNS instructions for your domain registrar. Vercel issues the TLS certificate automatically.

## Show edits instantly

Pages refresh every 5 minutes on their own. To refresh as soon as staff save a change in Supabase:

1. In Supabase, open **Database > Webhooks** and select **Create a new hook**.
2. Choose the content tables (`pages`, `leadership_messages`, `news_items`, and any others staff edit often) and the **Insert**, **Update** and **Delete** events.
3. Set the type to **HTTP Request**, method **POST**, URL `https://YOUR-DOMAIN/api/revalidate`.
4. Add an HTTP header `x-revalidate-secret` with the value of `REVALIDATE_SECRET`.

To test from a terminal:

```bash
curl -X POST https://YOUR-DOMAIN/api/revalidate -H "x-revalidate-secret: YOUR_SECRET"
```

## Hosting elsewhere

The site is a standard Next.js app. On any Node.js 20.9+ server:

```bash
npm ci
npm run build
npm run start   # serves on port 3000
```

Put it behind a reverse proxy such as Nginx with TLS 1.3. For quantum-safe key exchange outside Vercel, use a proxy built with OpenSSL 3.5 or newer and enable the `X25519MLKEM768` group.

## Keep it updated

Next.js publishes scheduled security releases every month. Set a monthly reminder to run `npm outdated`, update `next` within the 16.x line, run `npm run build`, and redeploy.
