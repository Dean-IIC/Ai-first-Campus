# Site admin guide

One person (the site administrator) can sign in on the live site and edit the content directly. Changes are saved to the database at once and show on the live site straight away. No export and no redeploy.

## 1. Set up (once)

**Environment variables.** Set these in `.env.local` for development and in Vercel (Project → Settings → Environment Variables) for the live site:

| Variable | What it is |
| --- | --- |
| `ADMIN_EMAIL` | The admin's email address |
| `ADMIN_PASSWORD_HASH` | The bcrypt hash of the admin's password (step 2) |
| `SESSION_SECRET` | A random string of at least 32 characters. Create one with `openssl rand -hex 32` |
| `SUPABASE_SECRET_KEY` | Already needed for the database. It is used only on the server, never in the browser |

After changing any of these, redeploy so the live site picks them up.

**Database and storage.** Run `supabase/setup_all.sql` in the Supabase SQL Editor (or `npx supabase db push`). This creates the admin tables and copies the current champion cards into the database. Running it again does not overwrite live edits. The `site-images` storage bucket already exists from the earlier setup.

## 2. Create the admin password

```bash
npm run admin:hash
```

Type the password when asked. Nothing is shown on screen as you type. Use at least 12 characters. The command prints a line like `ADMIN_PASSWORD_HASH='$2b$12$...'`. Copy that whole line into the environment variables. The password itself is never stored anywhere.

## Changing the admin password

1. Run `npm run admin:hash` and type the new password.
2. Replace `ADMIN_PASSWORD_HASH` in Vercel with the new line (keep the single quotes).
3. Redeploy. Every open session ends straight away, because sessions are signed with the password hash; sign in again with the new password.

To end every session without changing the password, change `SESSION_SECRET` instead and redeploy.

## Trying it in the preview

The preview link (claude.ai artifact) is a saved snapshot of the site with no server or database, so the real sign-in cannot run there. It has a separate **preview-only demo login** instead:

- Email `demo@preview.hkbk`, password `try-editing` (shown on the preview's sign-in page).
- Edits are kept only in your browser. **Reset demo** in the toolbar clears them.
- The demo's photo crop is a simple centre crop; the live site also lets you drag and zoom.
- The demo exists only in the preview file. It is not part of the site's code and does not work on the live site.

## 3. Sign in and edit

1. Open `https://your-site/admin/login` and enter the admin email and password.
2. A dark bar appears at the top of every page: **Signed in as admin**, **Edit page**, **Undo**, **History**, **Sign out**.
3. Click **Edit page** to turn editing on. Editable text is outlined in dashed teal when you hover over it.
4. **Text:** click it, type, then press **Enter** or click elsewhere. The bar shows "Saved ✓". Press **Esc** to cancel.
5. **Photos:** click **Replace photo** under a picture. Choose a JPG, PNG or WebP up to 5 MB. Pictures are shrunk and compressed in the browser before upload. The alt text under the photo is also editable.
6. **Champions:** on the AI Faculty Champions section, click a name or detail to edit it, a photo to replace it (with a circular crop), **Remove photo**, **Clear card**, **Delete card**, the arrow buttons or drag to reorder, and **+ Add champion** at the end.
7. **Undo** reverses your last change. Undo can be used again to step back further.
8. **History** lists the last 30 changes. Click **Restore** on any entry to put back the version it saved.
9. Click **Sign out** when you finish. The session also ends after seven days.

## 4. Security

- Visitors never see the toolbar, the edit controls or the editing mode.
- Every save, upload, undo and restore checks the session on the server. Anyone who is not signed in is refused.
- The session is a signed cookie: httpOnly (JavaScript cannot read it), secure on the live site, and valid for seven days.
- Five wrong passwords lock sign-in for 15 minutes. The message is the same whether the email or the password was wrong.
- Text is stripped of markup and control characters before it is saved. Uploads are checked by their contents, not only by their file name.
- Forgotten password: contact the site administrator. There are no reset emails.

## 5. What can be edited now

| Area | Editable |
| --- | --- |
| Home page headline, intro paragraph and campus photo (with alt text) | Yes |
| Section headings and intro lines on every page that uses the section heading | Yes |
| AI Faculty Champions: intro, names, designations, departments, photos, add, delete, clear, reorder | Yes |
| Body text of the other pages, menu labels, buttons, link addresses | Not yet |
| Showing, hiding and moving whole sections | Not yet |
| Lists such as MoUs, departments, news and houses | Not yet (the champions list is the first) |

The editing system is the same for all of these; each area needs its text or photo marked as editable. Ask for the next area you want and it can be added in the same way.
