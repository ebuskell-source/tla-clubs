# TLA Student Clubs

Website for TLA Student Clubs (join or start a student-led club).

## Editing clubs
Clubs are managed in the **TLA Clubs Editor** (Google Sheet + Apps Script). Leaders and
sponsors edit their own club, and an admin approves changes. Setup: [`editor/SETUP.md`](editor/SETUP.md).

Until the editor's feed is connected (`feedUrl` in `assets/clubs.js`), the site uses the
backup list in `assets/clubs.js`. No build step.

## Moving to a custom domain
Add a `CNAME` file containing the domain (e.g. `clubs.schoolathome.ca`), point a DNS CNAME record at `ebuskell-source.github.io`, then set the custom domain under Settings → Pages.
