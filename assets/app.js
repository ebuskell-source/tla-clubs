(function () {
  var clubs = window.TLA_CLUBS || [];
  var S = window.TLA_SETTINGS || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function runLabel(y) {
    if (!y || y <= 1) return "New this year!";
    return ordinal(y) + " year running";
  }
  function leaders(l) {
    if (!l || !l.length) return "TBD";
    return l.length === 1 ? l[0] : l.slice(0, -1).join(", ") + " & " + l[l.length - 1];
  }

  // Settings → page
  document.querySelectorAll(".js-join").forEach(function (a) { a.href = S.joinForm || "#"; });
  document.querySelectorAll(".js-propose").forEach(function (a) { a.href = S.proposalForm || "#"; });
  document.querySelectorAll(".js-year").forEach(function (e) { if (S.schoolYear) e.textContent = S.schoolYear; });
  document.querySelectorAll(".js-manager").forEach(function (e) { if (S.managerName) e.textContent = S.managerName; });
  document.querySelectorAll(".js-manager-email").forEach(function (a) {
    if (S.managerEmail) { a.href = "mailto:" + S.managerEmail; a.textContent = S.managerEmail; }
  });
  document.querySelectorAll(".js-count").forEach(function (e) { e.textContent = clubs.length; });
  document.querySelectorAll(".js-this-year").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // Cards
  var grid = document.getElementById("club-grid");
  var empty = document.getElementById("empty");
  var search = document.getElementById("search");
  var filter = "all";

  function card(c, i) {
    return (
      '<button class="card card--' + esc(c.colour || "ocean") + '" data-i="' + i + '" aria-haspopup="dialog">' +
        '<span class="card__top">' +
          '<span class="card__icon" aria-hidden="true">' + esc(c.icon || "⭐") + "</span>" +
          '<span class="badge">' + esc(c.format) + "</span>" +
        "</span>" +
        '<span class="card__run">' + esc(runLabel(c.year)) + "</span>" +
        '<span class="card__name">' + esc(c.name) + "</span>" +
        '<span class="card__summary">' + esc(c.summary || "") + "</span>" +
        '<span class="card__meta">' +
          '<span><b>Led by</b> ' + esc(leaders(c.leaders)) + "</span>" +
          '<span><b>Meets</b> ' + esc(c.meetings || "TBD") + "</span>" +
        "</span>" +
        '<span class="card__more">Read more →</span>' +
      "</button>"
    );
  }

  function render() {
    var q = (search.value || "").trim().toLowerCase();
    var html = "", shown = 0;
    clubs.forEach(function (c, i) {
      if (filter !== "all" && c.format !== filter) return;
      var hay = [c.name, c.summary, c.description, (c.leaders || []).join(" ")].join(" ").toLowerCase();
      if (q && hay.indexOf(q) === -1) return;
      html += card(c, i); shown++;
    });
    grid.innerHTML = html;
    empty.hidden = shown !== 0;
  }

  document.querySelectorAll(".chip").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      filter = b.getAttribute("data-filter");
      render();
    });
  });
  search.addEventListener("input", render);

  // Dialog
  var dlg = document.getElementById("club-dialog");
  var content = document.getElementById("dlg-content");

  function open(i) {
    var c = clubs[i];
    content.className = "dialog__body card--" + (c.colour || "ocean");
    content.innerHTML =
      '<button class="dialog__close" aria-label="Close">×</button>' +
      '<div class="dialog__head">' +
        '<span class="card__icon" aria-hidden="true">' + esc(c.icon || "⭐") + "</span>" +
        "<div>" +
          '<p class="card__run">' + esc(c.format) + " · " + esc(runLabel(c.year)) + "</p>" +
          '<h3 id="dlg-title">' + esc(c.name) + "</h3>" +
        "</div>" +
      "</div>" +
      '<p class="dialog__desc">' + esc(c.description) + "</p>" +
      '<dl class="facts">' +
        "<div><dt>Led by</dt><dd>" + esc(leaders(c.leaders)) + "</dd></div>" +
        "<div><dt>Meetings</dt><dd>" + esc(c.meetings || "TBD") + "</dd></div>" +
        '<div><dt>Contact</dt><dd><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></dd></div>" +
        (c.website ? '<div><dt>Website</dt><dd><a href="' + esc(c.website) + '" target="_blank" rel="noopener">Visit the club site ↗</a></dd></div>' : "") +
        "<div><dt>Members</dt><dd>" + esc(c.members || "TBD") + "</dd></div>" +
      "</dl>" +
      '<div class="dialog__actions">' +
        '<a class="btn" href="' + esc(S.joinForm) + '" target="_blank" rel="noopener">Join this club</a>' +
        '<a class="btn btn--ghost" href="mailto:' + esc(c.email) + '">Email the leader</a>' +
      "</div>";
    content.querySelector(".dialog__close").addEventListener("click", function () { dlg.close(); });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".card");
    if (b) open(+b.getAttribute("data-i"));
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  render();
})();
