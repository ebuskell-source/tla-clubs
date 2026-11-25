/*
  TLA Student Clubs — club list
  ------------------------------------------------------------
  BACKUP LIST. Once feedUrl (bottom of this file) is set, clubs come from the
  Google Sheet / editor instead, and this list is only used if the sheet can't load.

  To add, edit or remove a club, change the entries below.
  Each club is one { ... } block. Keep the commas between blocks.

  format:   "Online" or "In person"
  year:     how many years the club has run (1 = new this year)
  website:  optional — leave as "" if the club has no site
  members:  optional — leave as "" to show "TBD"
  colour:   any of: "berry", "forest", "ocean", "gold", "plum", "rust"
*/
window.TLA_CLUBS = [
  {
    name: "Book Club",
    icon: "📚",
    colour: "berry",
    format: "Online",
    year: 2,
    leaders: ["Pepper Noble"],
    summary: "One book a month, weekly chill chats, and a vote on what to read next.",
    description:
      "Our club will read one book each month, but we're totally flexible. If our readers are flying through it, we can speed up. If people need more time, we can slow things down. The point is to make reading fun, not stressful. We'll meet once a week to talk about the chapters we agreed on for that week. Meetings will be super chill: we'll start by catching up, then share our reactions to the reading — favourite moments, characters we loved or couldn't stand, plot twists that traumatized us (in a good way), all of it. After that, we'll have an open group conversation where everyone can jump in with thoughts or questions. We'll end each month by recommending new books and voting on what we want to read next so everyone gets a say. The goal is simple: fun conversations, new books, and a welcoming space for anyone who loves reading, or wants to love it more.",
    meetings: "Fridays, 12:00 – 1:00 p.m. (times can be adjusted if not convenient for participants)",
    email: "peppernoble@schoolathome.ca",
    website: "",
    members: ""
  },
  {
    name: "Chess Club",
    icon: "♟️",
    colour: "forest",
    format: "Online",
    year: 3,
    leaders: ["Oliver Lesley", "Isabella Lockhart"],
    sponsor: "Mr. Edmund Buskell",
    summary: "Weekly games, strategy and friendly competition for every skill level.",
    description:
      "Please see the official Chess Club website for more information!",
    meetings: "Every Friday, 3:30 – 4:30 p.m. (first meeting Nov. 7)",
    email: "edmundbuskell@schoolathome.ca",
    website: "https://sites.google.com/schoolathome.ca/tcc/home",
    members: ""
  },
  {
    name: "TLA Poetry Club",
    icon: "🪶",
    colour: "plum",
    format: "Online",
    year: 3,
    leaders: ["Fatima Khan"],
    summary: "Write, recite and share poetry — and get published in the TLA News Bulletin.",
    description:
      "\"Poems are perfect, both early and late, and if you could write one, wouldn't that be just great?...\" Welcome one and all to the TLA Poetry Club, for those who enjoy both the spoken and written word. In this club, you will have a chance to write and showcase your own poetry in the TLA News Bulletin, as well as share it with others. We will also recite a wide variety of poems, some related to celebrations such as St. Patrick's Day and the coming of new seasons, to group recitations of poems written by the club members. For our first meeting, come armed with your favourite poem, and we'll be on our way!",
    meetings: "Last Friday of every month at 2:00 p.m.",
    email: "fatimakhan@schoolathome.ca",
    website: "",
    members: ""
  }
];

/* Site-wide links and contacts */
window.TLA_SETTINGS = {
  schoolYear: "2026/27",
  joinForm: "https://forms.gle/8RwX9NMCMAW4BFwK8",
  proposalForm: "https://forms.gle/P92AzQoVwhWUEnLB6",
  /* Paste the "Publish to web" CSV link of the sheet's Clubs tab here.
     When set, the site loads clubs from the sheet (and the list above is only a backup). */
  feedUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUdfE3n7wklSbvZHWYzhbF1H0YLbYJKuS7cplYANhfl0ThN6g8AvSJOXy9upMKyGbAwd4TcQLF4-28/pub?gid=249775330&single=true&output=csv",
  /* The editor web app link (Apps Script → Deploy → Web app URL) */
  editorUrl: "https://script.google.com/a/macros/schoolathome.ca/s/AKfycbwkiasg90OsHwsKs43PRDEniT9bc2RbnSXOuWt5bq8hC-iD1bjQLYW9pDsEuMqItIAK/exec",
  managerName: "Mr. Edmund Buskell",
  managerEmail: "ebuskell@schoolathome.ca"
};
