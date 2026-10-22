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

**Storage.** Edits, the change history and the sign-in lock are kept as small files in the `site-images` storage bucket (folder `cms-data/`), which already exists. No database setup is needed for editing; only `SUPABASE_SECRET_KEY` must be set on the server.

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
5. **Photos:** click **Replace photo** under a picture (the home page photos are changed in **Edit content** → Home page carousel instead). Choose a JPG, PNG or WebP up to 5 MB. Pictures are shrunk and compressed in the browser before upload. The alt text under the photo is also editable.
6. **Champions:** on the AI Faculty Champions section, click a name or detail to edit it, a photo to replace it (with a circular crop), **Remove photo**, **Clear card**, **Delete card**, the arrow buttons or drag to reorder, and **+ Add champion** at the end.
7. **Undo** reverses your last change. Undo can be used again to step back further.
8. **History** lists the last 30 changes. Click **Restore** on any entry to put back the version it saved.
9. Click **Sign out** when you finish. The session also ends after seven days.

## Enquiries inbox

Click **Enquiries** in the dark bar (the number shows how many are New). Every consultancy request, corporate training enquiry and Contact page message is listed, newest first. Filter by form or status, or search by name, email or organisation. Open an enquiry to set its status (New, In progress, Closed) and add a private note that visitors never see, then **Save**. **Download CSV** saves the list as it is filtered. Each enquiry also shows whether its email alert was sent.

## 4. Security

- Visitors never see the toolbar, the edit controls or the editing mode.
- Every save, upload, undo and restore checks the session on the server. Anyone who is not signed in is refused.
- The session is a signed cookie: httpOnly (JavaScript cannot read it), secure on the live site, and valid for seven days.
- Five wrong passwords lock sign-in for 15 minutes. The message is the same whether the email or the password was wrong.
- Text is stripped of markup and control characters before it is saved. Uploads are checked by their contents, not only by their file name.
- Forgotten password: contact the site administrator. There are no reset emails.

## 5. What can be edited now

| Area | How |
| --- | --- |
| Home page headline and intro paragraph; section headings and intro lines | **Edit page** on, then click the text |
| Home page photo carousel (up to 10 photos, each with a badge title, subtitle and alt text) | **Edit content** → Home page carousel: **Add photo**, upload, drag or use the arrows to reorder, delete, then **Save changes**. Leave the badge title and subtitle empty to hide the badge on that photo. Set **Fit** to *Full poster* for posters and certificates so nothing is cropped, or *Fill frame* for campus and event photos. With one photo there are no arrows or dots |
| Title, summary and full text of every page | **Edit content** → Page text |
| Leadership messages (name, designation, photo, message) | **Edit content** → Leadership messages |
| MoUs | On the MoUs page: **✏️ Edit** and **🗑️ Delete** on each card, **➕ Add MoU** at the end, drag cards to reorder (with no filter set) or **Sort by date signed (newest first)**. Click the logo to replace it (JPG, PNG, WebP or SVG up to 5 MB, shown on white without cropping). Upload the signed MoU as a PDF (up to 10 MB); it is for admins only unless you tick **Show download link to visitors**. Status is Automatic (Expired after "Valid until") unless you set Active or Expired. Every change is in **Undo** and **History** |
| Events (home page and `/events`) | On the event cards: **✏️ Edit** and **🗑️ Delete**, and **➕ Add event** at the top of the list. Title and start date are required; end date, time, venue, category, short description, a poster or photo (up to 5 MB, shown in full) and a registration link are optional. Past events move to "Past events" by themselves. Every change is in **Undo** and **History** |
| Departments, news and events, MoUs, AI Champions, key figures, houses, centres and initiatives, dashboards, research and consultancy projects, training programmes, UHV activities, the AI First journey | **Edit content** → Lists: open an item to change it, add, delete or reorder, then **Save changes** |
| Address, phone and email (header, footer and Contact page) | **Edit content** → Contact details |
| Where the **Alumni** and **R&D** menu items go | **Edit content** → Alumni and R&D portal links. Empty: the Alumni or Research & Development page on this site. A saved link: the menu opens it in a new tab |
| Who is emailed when an enquiry arrives (consultancy, corporate training, contact) | **Edit content** → Enquiry email alerts (emails are sent once the email service is connected) |
| Menu structure, buttons and the short descriptions written into the code | Not yet |

**Edit content** opens on whatever the page you are viewing shows. Page text uses simple formatting: `## Heading`, `- bullet`, `**bold**`, `[link text](/address)`. Every save from **Edit content** also appears in **Undo** and **History**.
