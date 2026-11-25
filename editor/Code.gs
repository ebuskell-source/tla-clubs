/**
 * TLA Student Clubs — Editor (Google Apps Script, bound to the clubs Google Sheet)
 *
 * Tabs this script uses (run setup() once to create them):
 *   Clubs     – the PUBLISHED club list. "Publish to web" this tab as CSV for the public site.
 *   Drafts    – edits submitted by leaders/sponsors, waiting for approval.
 *   Editors   – who may edit which club (email, club_id, role = Leader | Sponsor).
 *   Admins    – emails that can approve edits, assign editors and add clubs.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me      Who has access: Anyone within schoolathome.ca
 */

var CLUB_FIELDS = ['id', 'name', 'icon', 'colour', 'format', 'year', 'leaders', 'summary',
  'description', 'meetings', 'email', 'website', 'members', 'visible', 'order',
  'updated_at', 'updated_by'];
var EDITABLE = ['name', 'icon', 'colour', 'format', 'year', 'leaders', 'summary',
  'description', 'meetings', 'email', 'website', 'members'];
var DRAFT_FIELDS = ['draft_id', 'club_id', 'submitted_by', 'submitted_at', 'status', 'note',
  'reviewed_by', 'reviewed_at', 'data'];
var EDITOR_FIELDS = ['email', 'club_id', 'role', 'added_by', 'added_at'];
var COLOURS = ['berry', 'forest', 'ocean', 'gold', 'plum', 'rust'];
var FORMATS = ['Online', 'In person', 'Online & in person'];
var SITE_URL = 'https://ebuskell-source.github.io/tla-clubs/';

/* ---------- web app ---------- */

function doGet() {
  return HtmlService.createTemplateFromFile('Editor').evaluate()
    .setTitle('TLA Clubs Editor')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- one-time setup ---------- */

function setup() {
  var ss = SpreadsheetApp.getActive();
  var me = Session.getActiveUser().getEmail();
  ensureSheet_(ss, 'Clubs', CLUB_FIELDS);
  ensureSheet_(ss, 'Drafts', DRAFT_FIELDS);
  ensureSheet_(ss, 'Editors', EDITOR_FIELDS);
  var admins = ensureSheet_(ss, 'Admins', ['email']);
  if (admins.getLastRow() < 2 && me) admins.appendRow([me]);

  var clubs = ss.getSheetByName('Clubs');
  if (clubs.getLastRow() < 2) {
    var now = new Date().toISOString();
    seedClubs_().forEach(function (c, i) {
      c.visible = 'TRUE'; c.order = i + 1; c.updated_at = now; c.updated_by = me;
      clubs.appendRow(CLUB_FIELDS.map(function (f) { return c[f] == null ? '' : c[f]; }));
    });
  }
  // Long text columns shouldn't stretch rows forever
  clubs.getRange('A:Q').setWrap(false);
  ss.getSheetByName('Drafts').getRange('I:I').setWrap(false);
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function seedClubs_() {
  return [
    { id: 'book-club', name: 'Book Club', icon: '📚', colour: 'berry', format: 'Online', year: 2,
      leaders: 'Pepper Noble',
      summary: 'One book a month, weekly chill chats, and a vote on what to read next.',
      description: "Our club will read one book each month, but we're totally flexible. If our readers are flying through it, we can speed up. If people need more time, we can slow things down. The point is to make reading fun, not stressful. We'll meet once a week to talk about the chapters we agreed on for that week. Meetings will be super chill: we'll start by catching up, then share our reactions to the reading — favourite moments, characters we loved or couldn't stand, plot twists that traumatized us (in a good way), all of it. After that, we'll have an open group conversation where everyone can jump in with thoughts or questions. We'll end each month by recommending new books and voting on what we want to read next so everyone gets a say. The goal is simple: fun conversations, new books, and a welcoming space for anyone who loves reading, or wants to love it more.",
      meetings: 'Fridays, 12:00 – 1:00 p.m. (times can be adjusted if not convenient for participants)',
      email: 'peppernoble@schoolathome.ca', website: '', members: '' },
    { id: 'chess-club', name: 'Chess Club', icon: '♟️', colour: 'forest', format: 'Online', year: 3,
      leaders: 'Oliver Lesley, Isabella Lockhart',
      summary: 'Weekly games, strategy and friendly competition for every skill level.',
      description: 'Please see the official Chess Club website for more information!',
      meetings: 'Every Friday, 3:30 – 4:30 p.m. (first meeting Nov. 7)',
      email: 'edmundbuskell@schoolathome.ca',
      website: 'https://sites.google.com/schoolathome.ca/tcc/home', members: '' },
    { id: 'poetry-club', name: 'TLA Poetry Club', icon: '🪶', colour: 'plum', format: 'Online', year: 3,
      leaders: 'Fatima Khan',
      summary: 'Write, recite and share poetry — and get published in the TLA News Bulletin.',
      description: "\"Poems are perfect, both early and late, and if you could write one, wouldn't that be just great?...\" Welcome one and all to the TLA Poetry Club, for those who enjoy both the spoken and written word. In this club, you will have a chance to write and showcase your own poetry in the TLA News Bulletin, as well as share it with others. We will also recite a wide variety of poems, some related to celebrations such as St. Patrick's Day and the coming of new seasons, to group recitations of poems written by the club members. For our first meeting, come armed with your favourite poem, and we'll be on our way!",
      meetings: 'Last Friday of every month at 2:00 p.m.',
      email: 'fatimakhan@schoolathome.ca', website: '', members: '' }
  ];
}

/* ---------- helpers ---------- */

function me_() {
  var email = (Session.getActiveUser().getEmail() || '').toLowerCase();
  if (!email) throw new Error('Could not tell who you are. Sign in with your schoolathome account.');
  return email;
}

function sheet_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('Missing "' + name + '" tab — run setup() first.');
  return sh;
}

function readTable_(name) {
  var values = sheet_(name).getDataRange().getValues();
  var head = values.shift() || [];
  return values.map(function (row, i) {
    var o = { _row: i + 2 };
    head.forEach(function (h, j) {
      var v = row[j];
      o[h] = v instanceof Date ? v.toISOString() : v;
    });
    return o;
  });
}

function writeRow_(name, fields, obj, rowNum) {
  var sh = sheet_(name);
  var row = fields.map(function (f) { return obj[f] == null ? '' : obj[f]; });
  if (rowNum) sh.getRange(rowNum, 1, 1, fields.length).setValues([row]);
  else sh.appendRow(row);
}

function isAdmin_(email) {
  return readTable_('Admins').some(function (a) {
    return String(a.email).trim().toLowerCase() === email;
  });
}

function requireAdmin_() {
  var email = me_();
  if (!isAdmin_(email)) throw new Error('Only Student Clubs admins can do that.');
  return email;
}

function myAssignments_(email) {
  return readTable_('Editors').filter(function (e) {
    return String(e.email).trim().toLowerCase() === email;
  });
}

function canEdit_(email, clubId) {
  return myAssignments_(email).some(function (e) { return String(e.club_id) === String(clubId); });
}

function slug_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'club';
}

function clean_(data) {
  var out = {};
  EDITABLE.forEach(function (f) {
    var v = data[f] == null ? '' : String(data[f]).trim();
    out[f] = v.slice(0, f === 'description' ? 4000 : 400);
  });
  if (!out.name) throw new Error('Club name is required.');
  if (COLOURS.indexOf(out.colour) === -1) out.colour = 'ocean';
  if (FORMATS.indexOf(out.format) === -1) out.format = 'Online';
  var y = parseInt(out.year, 10); out.year = isNaN(y) || y < 1 ? 1 : Math.min(y, 50);
  if (out.website && !/^https?:\/\//i.test(out.website)) {
    throw new Error('Website must start with https://');
  }
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) {
    throw new Error('Contact email does not look right.');
  }
  // Keep cells from being read as formulas
  Object.keys(out).forEach(function (k) {
    if (typeof out[k] === 'string' && /^[=+\-@]/.test(out[k])) out[k] = "'" + out[k];
  });
  return out;
}

function clubById_(id) {
  return readTable_('Clubs').filter(function (c) { return String(c.id) === String(id); })[0];
}

function pick_(c) {
  var o = {};
  CLUB_FIELDS.forEach(function (f) { o[f] = c[f]; });
  return o;
}

function notify_(to, subject, body) {
  try { if (to) MailApp.sendEmail({ to: to, subject: subject, body: body }); }
  catch (e) { console.warn('Email failed: ' + e); }
}

function adminEmails_() {
  return readTable_('Admins').map(function (a) { return String(a.email).trim(); })
    .filter(String).join(',');
}

/* ---------- API for Editor.html ---------- */

function getState() {
  var email = me_();
  var admin = isAdmin_(email);
  var clubs = readTable_('Clubs').map(pick_);
  var drafts = readTable_('Drafts');
  var mine = myAssignments_(email);
  var myIds = mine.map(function (e) { return String(e.club_id); });

  var state = {
    email: email,
    isAdmin: admin,
    siteUrl: SITE_URL,
    colours: COLOURS,
    formats: FORMATS,
    myClubs: clubs.filter(function (c) { return myIds.indexOf(String(c.id)) !== -1; })
      .map(function (c) {
        var role = mine.filter(function (e) { return String(e.club_id) === String(c.id); })[0].role;
        var last = drafts.filter(function (d) {
          return String(d.club_id) === String(c.id);
        }).pop();
        return {
          club: c, role: role,
          pending: last && last.status === 'pending' ? JSON.parse(last.data) : null,
          lastStatus: last ? { status: last.status, note: last.note, at: last.reviewed_at || last.submitted_at } : null
        };
      })
  };

  if (admin) {
    state.clubs = clubs;
    state.pending = drafts.filter(function (d) { return d.status === 'pending'; }).map(function (d) {
      return { draft_id: d.draft_id, club_id: d.club_id, submitted_by: d.submitted_by,
        submitted_at: d.submitted_at, data: JSON.parse(d.data),
        current: pick_(clubById_(d.club_id) || {}) };
    });
    state.editors = readTable_('Editors').map(function (e) {
      return { email: e.email, club_id: String(e.club_id), role: e.role };
    });
    state.admins = readTable_('Admins').map(function (a) { return a.email; });
  }
  return state;
}

/** Leader/sponsor submits an edit → waits in Drafts for approval. */
function submitDraft(clubId, data) {
  var email = me_();
  if (!canEdit_(email, clubId) && !isAdmin_(email)) {
    throw new Error("You're not assigned to this club.");
  }
  if (!clubById_(clubId)) throw new Error('Club not found.');
  var clean = clean_(data);

  // Replace any older pending draft for this club
  readTable_('Drafts').forEach(function (d) {
    if (String(d.club_id) === String(clubId) && d.status === 'pending') {
      d.status = 'replaced'; d.reviewed_at = new Date().toISOString();
      writeRow_('Drafts', DRAFT_FIELDS, d, d._row);
    }
  });
  writeRow_('Drafts', DRAFT_FIELDS, {
    draft_id: Utilities.getUuid(), club_id: clubId, submitted_by: email,
    submitted_at: new Date().toISOString(), status: 'pending', data: JSON.stringify(clean)
  });
  notify_(adminEmails_(), 'TLA Clubs: edit waiting for approval — ' + clean.name,
    email + ' submitted changes to "' + clean.name + '".\n\nReview them in the editor: ' +
    ScriptApp.getService().getUrl());
  return getState();
}

/** Leader/sponsor withdraws their pending edit. */
function withdrawDraft(clubId) {
  var email = me_();
  readTable_('Drafts').forEach(function (d) {
    if (String(d.club_id) === String(clubId) && d.status === 'pending' &&
        (String(d.submitted_by).toLowerCase() === email || isAdmin_(email))) {
      d.status = 'withdrawn'; d.reviewed_at = new Date().toISOString();
      writeRow_('Drafts', DRAFT_FIELDS, d, d._row);
    }
  });
  return getState();
}

/* ---------- admin ---------- */

function reviewDraft(draftId, approve, note) {
  var admin = requireAdmin_();
  var d = readTable_('Drafts').filter(function (x) { return x.draft_id === draftId; })[0];
  if (!d || d.status !== 'pending') throw new Error('That edit is no longer pending.');
  var data = JSON.parse(d.data);

  if (approve) {
    var c = clubById_(d.club_id);
    if (!c) throw new Error('Club no longer exists.');
    EDITABLE.forEach(function (f) { c[f] = data[f]; });
    c.updated_at = new Date().toISOString(); c.updated_by = d.submitted_by + ' (approved by ' + admin + ')';
    writeRow_('Clubs', CLUB_FIELDS, c, c._row);
  }
  d.status = approve ? 'approved' : 'rejected';
  d.note = String(note || '').slice(0, 1000);
  d.reviewed_by = admin; d.reviewed_at = new Date().toISOString();
  writeRow_('Drafts', DRAFT_FIELDS, d, d._row);

  notify_(d.submitted_by,
    'TLA Clubs: your changes to "' + data.name + '" were ' + (approve ? 'approved' : 'not approved'),
    approve
      ? 'Your changes are approved and will show on the clubs site within a few minutes:\n' + SITE_URL
      : 'Your changes were not approved.' + (d.note ? '\n\nNote: ' + d.note : '') +
        '\n\nYou can make changes and resubmit here: ' + ScriptApp.getService().getUrl());
  return getState();
}

/** Admin edits a club directly (publishes immediately) or creates a new one (clubId empty). */
function saveClub(clubId, data) {
  var admin = requireAdmin_();
  var clean = clean_(data);
  var now = new Date().toISOString();
  if (clubId) {
    var c = clubById_(clubId);
    if (!c) throw new Error('Club not found.');
    EDITABLE.forEach(function (f) { c[f] = clean[f]; });
    c.updated_at = now; c.updated_by = admin;
    writeRow_('Clubs', CLUB_FIELDS, c, c._row);
  } else {
    var all = readTable_('Clubs');
    var id = slug_(clean.name), n = 2, base = id;
    while (all.some(function (x) { return String(x.id) === id; })) id = base + '-' + (n++);
    clean.id = id; clean.visible = 'TRUE'; clean.order = all.length + 1;
    clean.updated_at = now; clean.updated_by = admin;
    writeRow_('Clubs', CLUB_FIELDS, clean);
  }
  return getState();
}

function setClubVisible(clubId, visible) {
  var admin = requireAdmin_();
  var c = clubById_(clubId);
  if (!c) throw new Error('Club not found.');
  c.visible = visible ? 'TRUE' : 'FALSE';
  c.updated_at = new Date().toISOString(); c.updated_by = admin;
  writeRow_('Clubs', CLUB_FIELDS, c, c._row);
  return getState();
}

function moveClub(clubId, dir) {
  requireAdmin_();
  var clubs = readTable_('Clubs').sort(function (a, b) { return (+a.order || 0) - (+b.order || 0); });
  var i = clubs.findIndex(function (c) { return String(c.id) === String(clubId); });
  var j = i + (dir < 0 ? -1 : 1);
  if (i < 0 || j < 0 || j >= clubs.length) return getState();
  var t = clubs[i]; clubs[i] = clubs[j]; clubs[j] = t;
  clubs.forEach(function (c, k) {
    if (+c.order !== k + 1) { c.order = k + 1; writeRow_('Clubs', CLUB_FIELDS, c, c._row); }
  });
  return getState();
}

function assignEditor(email, clubId, role) {
  var admin = requireAdmin_();
  email = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@schoolathome\.ca$/.test(email)) {
    throw new Error('Use a schoolathome.ca email address.');
  }
  if (!clubById_(clubId)) throw new Error('Club not found.');
  role = role === 'Sponsor' ? 'Sponsor' : 'Leader';
  var existing = readTable_('Editors').filter(function (e) {
    return String(e.email).toLowerCase() === email && String(e.club_id) === String(clubId);
  })[0];
  if (existing) {
    existing.role = role; writeRow_('Editors', EDITOR_FIELDS, existing, existing._row);
  } else {
    writeRow_('Editors', EDITOR_FIELDS, { email: email, club_id: clubId, role: role,
      added_by: admin, added_at: new Date().toISOString() });
    var c = clubById_(clubId);
    notify_(email, 'TLA Clubs: you can now edit "' + c.name + '"',
      "You've been added as a " + role.toLowerCase() + ' for ' + c.name +
      '. You can update the club\'s page here (sign in with your schoolathome account):\n' +
      ScriptApp.getService().getUrl() + '\n\nChanges are reviewed before they go live.');
  }
  return getState();
}

function removeEditor(email, clubId) {
  requireAdmin_();
  var sh = sheet_('Editors');
  readTable_('Editors').reverse().forEach(function (e) {
    if (String(e.email).toLowerCase() === String(email).toLowerCase() &&
        String(e.club_id) === String(clubId)) sh.deleteRow(e._row);
  });
  return getState();
}

function addAdmin(email) {
  requireAdmin_();
  email = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@schoolathome\.ca$/.test(email)) throw new Error('Use a schoolathome.ca email address.');
  if (!isAdmin_(email)) sheet_('Admins').appendRow([email]);
  return getState();
}

function removeAdmin(email) {
  var me = requireAdmin_();
  email = String(email).toLowerCase();
  if (email === me) throw new Error("You can't remove yourself.");
  var sh = sheet_('Admins');
  readTable_('Admins').reverse().forEach(function (a) {
    if (String(a.email).toLowerCase() === email) sh.deleteRow(a._row);
  });
  return getState();
}
