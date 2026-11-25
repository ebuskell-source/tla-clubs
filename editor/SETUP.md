# TLA Clubs Editor — setup (about 10 minutes, one time)

The editor is a Google Apps Script web app attached to a Google Sheet.
Club leaders/sponsors sign in with their schoolathome account, edit only the clubs
they're assigned to, and their changes wait for an admin to approve them.
The public site reads the approved list from the sheet's **Clubs** tab.

## 1. Make the sheet + script
1. Create a new Google Sheet, e.g. **TLA Student Clubs — Data**.
2. **Extensions → Apps Script**.
3. Replace everything in `Code.gs` with the contents of [`Code.gs`](Code.gs).
4. Click **+ → HTML**, name it exactly `Editor`, and paste in [`Editor.html`](Editor.html).
5. Save. In the function dropdown pick **setup** and click **Run**. Approve the permissions.
   This creates the `Clubs`, `Drafts`, `Editors` and `Admins` tabs, loads this year's
   three clubs, and makes you the first admin.

## 2. Deploy the editor
1. **Deploy → New deployment → ⚙ → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone within schoolathome.ca**
2. **Deploy** and copy the **Web app URL**. That's the editor link.

## 3. Publish the club list for the site
1. In the sheet: **File → Share → Publish to web**.
2. Under *Link*, choose the **Clubs** tab (not "Entire document") and **Comma-separated values (.csv)**.
3. **Publish** and copy the link.
   Only the Clubs tab is published. Drafts, Editors and Admins stay private.

## 4. Connect the site
In `assets/clubs.js`, at the bottom, paste:
- the CSV link into `feedUrl`
- the editor link into `editorUrl`

(Or send both links to Claude to do it.)

## Using it
- **Assign people:** Editor → Admin → *People* → enter their schoolathome email, pick the club
  and role (Leader = student, Sponsor = staff). They get an email with the editor link.
- **Approve edits:** *Approvals* tab shows exactly what changed. Approve to publish it, or
  reject with a note (they're emailed either way).
- **Add / hide / reorder clubs:** *Clubs* tab. Admin edits go live right away.
- Published changes show on the site within about 5 minutes. That's Google's
  publish-to-web refresh time.

## Updating the code later
Paste the new `Code.gs` / `Editor.html`, then **Deploy → Manage deployments → ✏ →
Version: New version → Deploy**. The URL stays the same.
