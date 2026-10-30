/* Game world: a hex map under fog of war, after Hex'd. Stepping onto a tile reveals its six neighbours;
   a neighbour shows only that something is there, and you learn what by walking in. */
(function () {
  var P = window.P;
  if (!P) return;
  var C = P.C, esc = P.esc, chips = P.chips;
  var RADIUS = 3, SIZE = 46;
  var DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  function key(q, r) { return q + "," + r; }
  function ring(q, r) { return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)); }
  function px(q, r) { return [SIZE * Math.sqrt(3) * (q + r / 2), SIZE * 1.5 * r]; }

  /* ── the board: every cell within RADIUS of the centre, ordered ring by ring ── */
  var cells = [];
  for (var q = -RADIUS; q <= RADIUS; q++)
    for (var r = Math.max(-RADIUS, -q - RADIUS); r <= Math.min(RADIUS, -q + RADIUS); r++)
      if (q || r) cells.push({ q: q, r: r });
  cells.sort(function (a, b) {
    var d = ring(a.q, a.r) - ring(b.q, b.r);
    if (d) return d;
    var pa = px(a.q, a.r), pb = px(b.q, b.r);
    return Math.atan2(pa[1], pa[0]) - Math.atan2(pb[1], pb[0]);
  });

  /* Games are spread evenly over that order, so placement is stable and the first is next to the start. */
  var games = P.inTrack("game"), at = {}, where = {};
  games.forEach(function (g, i) {
    var c = cells[Math.floor(i * cells.length / games.length)];
    at[key(c.q, c.r)] = g; where[g.id] = c;
  });

  /* ── state (kept for the visit, not stored) ── */
  var pos, revealed, visited, moves;
  function reset() { pos = { q: 0, r: 0 }; revealed = {}; visited = {}; moves = 0; step(0, 0, true); }
  function step(q, r, free) {
    pos = { q: q, r: r };
    visited[key(q, r)] = 1; revealed[key(q, r)] = 1;
    DIRS.forEach(function (d) { revealed[key(q + d[0], r + d[1])] = 1; });
    if (!free) moves++;
  }
  function revealAll() {
    cells.forEach(function (c) { revealed[key(c.q, c.r)] = 1; if (at[key(c.q, c.r)]) visited[key(c.q, c.r)] = 1; });
  }
  function found() { return games.filter(function (g) { return visited[key(where[g.id].q, where[g.id].r)]; }).length; }
  reset();

  /* ── drawing ── */
  function points(cx, cy, s) {
    var out = [];
    for (var i = 0; i < 6; i++) { var a = Math.PI / 180 * (60 * i + 30); out.push((cx + s * Math.cos(a)).toFixed(1) + "," + (cy + s * Math.sin(a)).toFixed(1)); }
    return out.join(" ");
  }
  function lines(name) {
    var words = name.split(" "), out = [""];
    words.forEach(function (w) {
      var cur = out[out.length - 1];
      if (!cur) out[out.length - 1] = w;
      else if ((cur + " " + w).length <= 11) out[out.length - 1] = cur + " " + w;
      else out.push(w);
    });
    if (out.length > 3) { out = out.slice(0, 3); out[2] += "…"; }
    return out;
  }
  function tile(q, r) {
    var k = key(q, r), p = px(q, r), g = at[k], here = pos.q === q && pos.r === r;
    var seen = revealed[k], been = visited[k];
    var cls = "tile" + (seen ? " seen" : " fog") + (g && seen ? " has" : "") + (been ? " been" : "") + (here ? " here" : "");
    var label = !seen ? "Fog" : here ? "You are here" + (g ? ": " + g.name : "") : g ? (been ? g.name : "Something is here") : "Empty tile";
    var inner = "";
    if (here) inner += '<circle class="you" cx="' + p[0].toFixed(1) + '" cy="' + (p[1] + (g ? 24 : 0)).toFixed(1) + '" r="' + (g ? 5 : 9) + '"/>';
    if (g && been) {
      var ls = lines(g.name), y0 = p[1] - (ls.length - 1) * 6.5 - (here ? 5 : 0);
      inner += '<text class="t-name" x="' + p[0].toFixed(1) + '" y="' + y0.toFixed(1) + '">' + ls.map(function (l, i) {
        return '<tspan x="' + p[0].toFixed(1) + '" dy="' + (i ? 13 : 4) + '">' + esc(l) + "</tspan>";
      }).join("") + "</text>";
    } else if (g && seen) {
      inner += '<text class="t-mark" x="' + p[0].toFixed(1) + '" y="' + (p[1] + 8).toFixed(1) + '">?</text>';
    }
    return '<g class="' + cls + '" data-q="' + q + '" data-r="' + r + '"' + (seen && !here ? ' tabindex="0" role="button"' : "") + ' aria-label="' + esc(label) + '">' +
      '<polygon points="' + points(p[0], p[1], SIZE - 3) + '"/>' + inner + "</g>";
  }
  function board() {
    var w = SIZE * Math.sqrt(3) * (RADIUS * 2 + 1) + 12, h = SIZE * (RADIUS * 3 + 2) + 12;
    var all = [{ q: 0, r: 0 }].concat(cells);
    return '<svg class="board" viewBox="' + (-w / 2).toFixed(0) + " " + (-h / 2).toFixed(0) + " " + w.toFixed(0) + " " + h.toFixed(0) +
      '" role="group" aria-label="Hex map. Select a revealed tile to move there.">' + all.map(function (c) { return tile(c.q, c.r); }).join("") + "</svg>";
  }

  /* ── the encounter panel ── */
  function encounter() {
    var g = at[key(pos.q, pos.r)];
    if (!g) {
      return '<div class="enc"><div class="enc-cap">' + (moves ? "Empty tile" : "Start") + "</div>" +
        '<p class="enc-sum">' + (moves
          ? "Nothing here. The fog has lifted on the tiles around you; a <b>?</b> means something is waiting on that tile."
          : "You are the dot in the middle. Select any lit tile to move there. Each step lifts the fog on the six tiles around you, and a <b>?</b> marks a tile with a game on it.") + "</p></div>";
    }
    var log = P.txsOf(g.id);
    return '<div class="enc found">' +
      '<div class="enc-cap">Encounter · ' + esc(g.net === "testnet" ? "practice build" : "game") + "</div>" +
      (g.image ? '<img class="enc-img" src="' + esc(g.image) + '" alt="Screenshot of ' + esc(g.name) + '" onerror="this.remove()">' : "") +
      "<h1>" + esc(g.name) + "</h1>" +
      '<p class="enc-sum">' + esc(g.summary) + "</p>" +
      chips(g.stack) +
      (g.facts && g.facts.length ? '<dl class="enc-facts">' + g.facts.map(function (f) { return "<dt>" + esc(f.k.replace(/_/g, " ")) + "</dt><dd>" + esc(f.v) + "</dd>"; }).join("") + "</dl>" : "") +
      (log.length ? '<div class="enc-log">' + log.map(function (t) {
        return '<div><span class="mono muted">' + esc(t.date) + "</span> " + esc(t.note) + "</div>";
      }).join("") + "</div>" : "") +
      '<div class="btns">' + P.links(g) + "</div>" +
      '<div class="muted enc-role">' + esc(P.roleLabel(g)) + "</div></div>";
  }

  function render(p) {
    /* #/game/<id> jumps straight to that game's tile, so every game is linkable. */
    if (p[0] && where[p[0]] && !(pos.q === where[p[0]].q && pos.r === where[p[0]].r)) step(where[p[0]].q, where[p[0]].r);
    var n = found();
    return '<section class="hud">' +
        '<div><p class="eyebrow">game dev · fog of war</p><h2 class="hud-title">' + esc(C.owner.handle) + "'s map</h2></div>" +
        '<div class="hud-stats"><span><b class="mono">' + n + "/" + games.length + '</b> found</span><span><b class="mono">' + moves + "</b> moves</span>" +
        '<button class="btn" data-act="reveal">Reveal all</button><button class="btn" data-act="reset">Reset</button></div>' +
      "</section>" +
      '<section class="field"><div class="board-wrap">' + board() + "</div>" + encounter() + "</section>" +
      '<section class="panel"><div class="panel-head"><h2>All games <span class="muted">· skip the fog</span></h2></div>' +
        games.map(function (g) {
          return '<div class="row"><div class="row-main"><a class="hash" href="#/game/' + esc(g.id) + '">' + esc(g.name) + "</a>" +
            '<div class="row-sub">' + esc(g.summary) + '</div></div><div class="row-side"><span class="muted">' + esc((g.stack || []).slice(0, 3).join(" · ")) + "</span></div></div>";
        }).join("") + "</section>";
  }

  /* #app outlives every render, so bind once here rather than in mount(). */
  var root = document.getElementById("app");
  function act(el) {
    if (document.documentElement.getAttribute("data-world") !== "game") return;
    var b = el.closest("[data-act]");
    if (b) {
      if (b.getAttribute("data-act") === "reveal") revealAll(); else reset();
      if (location.hash !== "#/game") history.replaceState(null, "", "#/game");
      P.render(true);
      return;
    }
    var t = el.closest(".tile.seen");
    if (!t || t.classList.contains("here")) return;
    var q = +t.getAttribute("data-q"), r = +t.getAttribute("data-r"), g = at[key(q, r)];
    step(q, r);
    var next = g ? "#/game/" + g.id : "#/game";
    if (location.hash !== next) history.replaceState(null, "", next);
    P.render(true);
    var here = root.querySelector(".tile.here");
    if (here && here.focus) { here.setAttribute("tabindex", "-1"); here.focus(); }
  }
  root.addEventListener("click", function (e) { act(e.target); });
  root.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest(".tile")) { e.preventDefault(); act(e.target); }
  });

  /* ── hub preview: a two-ring map with the start lit, three ? on the first ring and fog beyond ── */
  function preview() {
    var S = 30, marks = Math.min(games.length, 3), out = [];
    function mpx(q, r) { return [S * Math.sqrt(3) * (q + r / 2), S * 1.5 * r]; }
    for (var q = -2; q <= 2; q++)
      for (var r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++) {
        var d = ring(q, r), p = mpx(q, r), i = DIRS.findIndex(function (x) { return x[0] === q && x[1] === r; });
        var has = d === 1 && i % 2 === 0 && i / 2 < marks;
        var cls = d === 0 ? "tile seen here" : d === 1 ? "tile seen" + (has ? " has" : "") : "tile fog";
        out.push('<g class="' + cls + '"><polygon points="' + points(p[0], p[1], S - 2) + '"/>' +
          (d === 0 ? '<circle class="you" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="7"/>' : "") +
          (has ? '<text class="t-mark" x="' + p[0].toFixed(1) + '" y="' + (p[1] + 8).toFixed(1) + '">?</text>' : "") + "</g>");
      }
    var w = S * Math.sqrt(3) * 5 + 8, h = S * 8 + 8;
    return '<div class="pv-text">' +
        '<p class="eyebrow">game dev · fog of war</p>' +
        '<h2 class="hud-title">' + esc(C.owner.handle) + "'s map</h2>" +
        "<p>" + P.plural(games.length, "game") + " hidden under fog on a hex map. Each step lifts the fog around you, and a <b>?</b> means something is waiting there.</p>" +
        '<div class="pv-games">' + games.slice(0, 4).map(function (g) {
          return '<a href="#/game/' + esc(g.id) + '"><i class="pv-hex" aria-hidden="true"></i>' + esc(g.name) + "</a>";
        }).join("") + "</div>" +
        '<div class="btns"><a class="btn primary" href="#/game">Enter the map →</a></div>' +
      "</div>" +
      '<a class="pv-art board-wrap" href="#/game" aria-label="Enter the hex map">' +
        '<svg class="board" viewBox="' + (-w / 2).toFixed(0) + " " + (-h / 2).toFixed(0) + " " + w.toFixed(0) + " " + h.toFixed(0) + '" aria-hidden="true">' + out.join("") + "</svg></a>";
  }

  P.worlds.game = { title: "Game dev", render: render, preview: preview };
})();
