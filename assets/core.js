/* Shared by every world: helpers, the indexed data, the hub page, the router and the theme toggle.
   A world is a file that sets P.worlds.<name> = { title, render(parts) → html, mount?(root) }. */
(function () {
  var C = window.PORTFOLIO;
  var app = document.getElementById("app");
  if (!C || !app) return;

  /* ── helpers ── */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^(https?:|mailto:)/i.test(u || "") ? esc(u) : "#"; }
  function ext(u, label, cls) {
    var mail = /^mailto:/i.test(u || "");
    return '<a class="' + (cls || "") + '" href="' + safeUrl(u) + '"' + (mail ? "" : ' target="_blank" rel="noopener"') + ">" + label + "</a>";
  }

  /* Hashes are decorative: derived from the entry id so they stay stable across deploys. */
  function hash(str, len) {
    var out = "";
    for (var seed = 0; out.length < len; seed++) {
      var h = 0x811c9dc5 ^ (seed * 0x9e3779b1);
      for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
      h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 13;
      out += ("0000000" + (h >>> 0).toString(16)).slice(-8);
    }
    return "0x" + out.slice(0, len);
  }
  function short(h) { return h.length > 18 ? h.slice(0, 8) + "…" + h.slice(-6) : h; }

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function monthName(key) { return MONTHS[+key.slice(5, 7) - 1] + " " + key.slice(0, 4); }
  function age(date) {
    var days = Math.floor((Date.now() - new Date(date + "T00:00:00Z").getTime()) / 864e5);
    if (days <= 0) return "today";
    if (days === 1) return "1 day ago";
    if (days < 31) return days + " days ago";
    if (days < 365) { var m = Math.floor(days / 30.4); return m + (m === 1 ? " month ago" : " months ago"); }
    var y = Math.floor(days / 365.25) || 1; return y + (y === 1 ? " year ago" : " years ago");
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div>";
  }
  function roleLabel(c) {
    if (c.role === "contributor") return "contributor to " + c.upstream;
    if (c.role === "fork") return "fork of " + c.upstream;
    return "author";
  }
  function links(c) {
    return [c.live ? ext(c.live, "Live ↗", "btn primary") : "", c.repo ? ext(c.repo, "Source ↗", c.live ? "btn" : "btn primary") : "",
      c.onchain ? ext(c.onchain.url, "On " + esc(c.onchain.network) + " ↗", "btn") : ""].join("");
  }

  /* ── index the data ── */
  var byId = {};
  C.contracts.forEach(function (c) {
    byId[c.id] = c;
    c.tracks = c.tracks || [];
    c.address = c.onchain && c.onchain.address ? c.onchain.address : hash("contract:" + c.id, 40);
  });
  var allTxs = C.txs.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  allTxs.forEach(function (t) {
    t.hash = hash("tx:" + t.id, 64);
    t.net = t.net || (byId[t.to] ? byId[t.to].net : "mainnet");
  });
  function inTrack(track) { return C.contracts.filter(function (c) { return c.tracks.indexOf(track) >= 0; }); }
  function txsOf(id) { return allTxs.filter(function (t) { return t.to === id; }); }

  /* ── hub ── */
  function door(world, label, verb, motif) {
    var list = inTrack(world);
    return '<a class="door door-' + world + '" href="#/' + world + '">' +
      '<div class="door-art" aria-hidden="true">' + motif + "</div>" +
      '<div class="door-body">' +
        '<div class="door-count mono">' + plural(list.length, "project") + "</div>" +
        '<div class="door-name">' + label + "</div>" +
        '<p class="door-sum">' + verb + "</p>" +
        '<div class="door-list">' + list.slice(0, 3).map(function (c) { return esc(c.name); }).join(" · ") + "</div>" +
        '<span class="door-go">Enter →</span>' +
      "</div></a>";
  }
  /* A world that exports preview() gets a homepage section drawn in its own design;
     .scope-<world> re-points the colour variables for that section only. */
  function section(world, label, verb, motif) {
    var w = P.worlds[world];
    if (!w || !w.preview) return '<div class="doors">' + door(world, label, verb, motif) + "</div>";
    return '<section class="pv pv-' + world + " scope-" + world + '" aria-label="' + esc(label) + '">' + w.preview() + "</section>";
  }
  function hub() {
    var o = C.owner;
    var also = C.contracts.filter(function (c) { return !c.tracks.length; });
    function way(n, world, label) {
      return '<a class="way" href="#/' + world + '"><span class="way-n mono">0' + n + '</span><span class="way-l">' + label +
        '</span><span class="way-c mono">' + plural(inTrack(world).length, "project") + '</span><span class="way-go" aria-hidden="true">→</span></a>';
    }
    return '<section class="hero hub-hero">' +
        '<div class="hub-intro">' +
          '<p class="eyebrow">' + esc(o.greeting || "") + "</p>" +
          "<h1>" + esc(o.name) + '<span class="accent">.</span></h1>' +
          '<p class="lede">' + esc(o.role) + ". " + esc(o.bio) + " Three kinds of work, each shown in a design borrowed from its own medium.</p>" +
          '<div class="btns">' + o.links.map(function (l, i) { return ext(l.url, esc(l.label) + " ↗", i ? "btn" : "btn primary"); }).join("") + "</div>" +
        "</div>" +
        '<nav class="ways" aria-label="Three ways in">' + way(1, "game", "Game dev") + way(2, "chain", "Blockchain") + way(3, "web", "Web dev") + "</nav>" +
      "</section>" +
      section("game", "Game dev", "A hex map under fog of war. Walk it; every tile you uncover might be a game.",
        '<i class="hx"></i><i class="hx on"></i><i class="hx"></i><i class="hx fog"></i><i class="hx you"></i><i class="hx on"></i><i class="hx fog"></i>') +
      section("chain", "Blockchain", "A block explorer. Blocks are months, transactions are things shipped, contracts are projects.",
        '<i class="bk pend"></i><i class="bk-sep"></i><i class="bk"></i><i class="bk"></i><i class="bk"></i>') +
      section("web", "Web dev", "A browser with the inspector open. Each site is a tab; its markup and network log are the write-up.",
        '<span class="br"><span class="br-bar"><i></i><i></i><i></i><b></b></span><span class="br-page"><u></u><u></u><u></u></span></span>') +
      (also.length ? '<section class="panel"><div class="panel-head"><h2>Also <span class="muted">· work that fits none of the three</span></h2></div>' +
        also.map(function (c) {
          return '<div class="row"><div class="row-main">' + ext(c.repo, esc(c.name) + " ↗", "hash") + '<span class="kind">' + esc(c.kind) + "</span>" +
            '<div class="row-sub">' + esc(c.summary) + '</div></div><div class="row-side"><span class="muted">' + esc((c.stack || []).slice(0, 3).join(" · ")) + "</span></div></div>";
        }).join("") + "</section>" : "");
  }

  /* ── router ── */
  var P = window.P = {
    C: C, esc: esc, ext: ext, hash: hash, short: short, monthName: monthName, age: age, plural: plural,
    chips: chips, roleLabel: roleLabel, links: links, byId: byId, allTxs: allTxs, inTrack: inTrack, txsOf: txsOf,
    worlds: { "": { title: "", render: hub } }
  };
  var navLinks = document.querySelectorAll("[data-world-link]");
  var last = null;
  P.render = function (keepScroll) {
    var parts = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
    var name = P.worlds[parts[0]] ? parts[0] : "";
    var world = P.worlds[name];
    document.documentElement.setAttribute("data-world", name || "hub");
    app.innerHTML = world.render(parts.slice(1));
    if (world.mount) world.mount(app);
    navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-world-link") === name); });
    var h = app.querySelector("h1");
    document.title = (name && h ? h.textContent + " — " : "") + (world.title ? world.title + " — " : "") + C.site.name;
    if (keepScroll !== true && location.hash !== last) window.scrollTo(0, 0);
    last = location.hash;
  };
  window.addEventListener("hashchange", function () { P.render(); });

  /* ── theme toggle ── */
  var themeBtn = document.getElementById("theme-toggle");
  function effectiveTheme() {
    var s = null;
    try { s = localStorage.getItem("site-theme"); } catch (e) {}
    if (s === "light" || s === "dark") return s;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (themeBtn) themeBtn.textContent = t === "dark" ? "☀" : "☾";
  }
  applyTheme(effectiveTheme());
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try { localStorage.setItem("site-theme", next); } catch (e) {}
    applyTheme(next);
  });

  /* ── footer ── */
  var foot = document.getElementById("foot");
  if (foot) foot.innerHTML = "<span>" + esc(C.owner.name) + " · one portfolio, three worlds. Hashes and map tiles are decorative; every link is real.</span>" +
    "<span>" + C.owner.links.map(function (l) { return ext(l.url, esc(l.label)); }).join(" · ") + "</span>";

  /* World files load after this one, so wait for them before the first render. */
  document.addEventListener("DOMContentLoaded", function () { P.render(); });
})();
