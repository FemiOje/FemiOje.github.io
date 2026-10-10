/* Web world: a browser window with the inspector open. Each site is a tab; the page is its screenshot;
   Elements is the project written as markup and Network is its history. */
(function () {
  var P = window.P;
  if (!P) return;
  var esc = P.esc, ext = P.ext;
  var sites = P.inTrack("web");

  function tag(name, attrs, close) {
    return '<span class="tk-p">&lt;' + (close ? "/" : "") + '</span><span class="tk-t">' + name + "</span>" +
      (attrs || []).map(function (a) { return ' <span class="tk-a">' + a[0] + '</span><span class="tk-p">="</span><span class="tk-v">' + a[1] + '</span><span class="tk-p">"</span>'; }).join("") +
      '<span class="tk-p">&gt;</span>';
  }
  function line(depth, html) { return '<div class="ln" style="padding-left:' + (depth * 16 + 12) + 'px">' + html + "</div>"; }
  function elements(c) {
    var out = [line(0, tag("project", [["id", esc(c.id)], ["role", esc(c.role)], ["net", esc(c.net)]].concat(c.upstream ? [["upstream", esc(c.upstream)]] : [])))];
    out.push(line(1, tag("h1") + esc(c.name) + tag("h1", null, true)));
    out.push(line(1, tag("p") + esc(c.summary) + tag("p", null, true)));
    out.push(line(1, tag("ul", [["class", "stack"]])));
    (c.stack || []).forEach(function (s) { out.push(line(2, tag("li") + esc(s) + tag("li", null, true))); });
    out.push(line(1, tag("ul", null, true)));
    if (c.live) out.push(line(1, tag("a", [["href", ext(c.live, esc(c.live), "tk-link")]]) + "live" + tag("a", null, true)));
    if (c.repo) out.push(line(1, tag("a", [["href", ext(c.repo, esc(c.repo), "tk-link")]]) + "source" + tag("a", null, true)));
    out.push(line(0, tag("project", null, true)));
    return out.join("");
  }
  function network(c) {
    var log = P.txsOf(c.id);
    if (!log.length) return '<div class="empty">No requests recorded.</div>';
    return '<div class="nw nw-head"><span>Name</span><span>Method</span><span>Status</span><span>When</span></div>' + log.map(function (t) {
      var pend = t.status === "pending";
      return '<div class="nw">' + (t.url ? ext(t.url, esc(t.note), "nw-name") : '<span class="nw-name">' + esc(t.note) + "</span>") +
        '<span class="mono">' + esc(t.method) + '</span><span class="mono ' + (pend ? "st-pend" : "st-ok") + '">' + (pend ? "(pending)" : "200") + "</span>" +
        '<span class="muted">' + esc(t.date) + "</span></div>";
    }).join("");
  }

  function render(p) {
    if (!sites.length) return '<section class="panel pad"><h1>No sites yet</h1></section>';
    var cur = sites[0];
    sites.forEach(function (s) { if (s.id === p[0]) cur = s; });
    var url = cur.live || cur.repo || "";
    return '<section class="hero"><p class="eyebrow">web dev · view source</p></section>' +
      '<section class="browser">' +
        '<div class="tabs" role="tablist" aria-label="Sites">' + sites.map(function (s) {
          return '<a class="tab' + (s === cur ? " active" : "") + '" role="tab" aria-selected="' + (s === cur) + '" href="#/web/' + esc(s.id) + '">' +
            '<i class="fav" aria-hidden="true"></i><span>' + esc(s.name) + "</span></a>";
        }).join("") + "</div>" +
        '<div class="toolbar"><span class="tb-btn" aria-hidden="true">←</span><span class="tb-btn" aria-hidden="true">→</span><span class="tb-btn" aria-hidden="true">⟳</span>' +
          '<div class="url mono"><span class="lock" aria-hidden="true">' + (cur.live ? "🔒" : "⌂") + "</span><span>" + esc(url.replace(/^https?:\/\//, "")) + "</span></div>" +
          (url ? ext(url, cur.live ? "Open ↗" : "Source ↗", "btn primary") : "") + "</div>" +
        '<div class="viewport">' +
          (cur.image ? '<img src="' + esc(cur.image) + '" alt="Screenshot of ' + esc(cur.name) + '" onerror="this.remove()">' : "") +
          '<div class="page"><span class="kind">' + esc(cur.net === "testnet" ? "coursework" : "shipped") + "</span><h1>" + esc(cur.name) + "</h1>" +
            "<p>" + esc(cur.summary) + "</p>" + P.chips(cur.stack) + '<div class="muted">' + esc(P.roleLabel(cur)) + "</div></div>" +
        "</div>" +
        '<div class="devtools">' +
          '<div class="dt-pane"><div class="dt-head"><span class="dt-tab">Elements</span></div><div class="dt-body mono code">' + elements(cur) + "</div></div>" +
          '<div class="dt-pane"><div class="dt-head"><span class="dt-tab">Network</span><span class="muted">' + P.plural(P.txsOf(cur.id).length, "request") + '</span></div><div class="dt-body">' + network(cur) + "</div></div>" +
        "</div>" +
      "</section>";
  }

  function mount(root) {
    var active = root.querySelector(".tab.active");
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /* ── hub preview: the browser chrome with the first site that has a screenshot open ── */
  function preview() {
    if (!sites.length) return "";
    var cur = sites.filter(function (s) { return s.image; })[0] || sites[0];
    var tabs = [cur].concat(sites.filter(function (s) { return s !== cur; })).slice(0, 4);
    var url = cur.live || cur.repo || "";
    return '<div class="pv-text">' +
        '<p class="eyebrow">web dev · view source</p>' +
        "<h2>" + P.plural(sites.length, "site") + ', one <span class="accent">tab</span> each.</h2>' +
        "<p>A browser with the inspector open. The page is the screenshot; Elements is the project written as markup and Network is its history.</p>" +
        '<div class="btns"><a class="btn primary" href="#/web">Open the browser →</a></div>' +
      "</div>" +
      '<div class="pv-art browser">' +
        '<div class="tabs">' + tabs.map(function (s) {
          return '<a class="tab' + (s === cur ? " active" : "") + '" href="#/web/' + esc(s.id) + '"><i class="fav" aria-hidden="true"></i><span>' + esc(s.name) + "</span></a>";
        }).join("") + "</div>" +
        '<div class="toolbar"><span class="tb-btn" aria-hidden="true">←</span><span class="tb-btn" aria-hidden="true">→</span>' +
          '<div class="url mono"><span class="lock" aria-hidden="true">' + (cur.live ? "🔒" : "⌂") + "</span><span>" + esc(url.replace(/^https?:\/\//, "")) + "</span></div></div>" +
        '<a class="viewport" href="#/web/' + esc(cur.id) + '">' +
          (cur.image ? '<img src="' + esc(cur.image) + '" alt="Screenshot of ' + esc(cur.name) + '" loading="lazy" onerror="this.remove()">' : "") +
          '<div class="page"><span class="kind">' + esc(cur.net === "testnet" ? "coursework" : "shipped") + "</span><h3>" + esc(cur.name) + "</h3></div></a>" +
        '<div class="dt-head"><span class="dt-tab">Elements</span><span class="muted">' + P.plural(P.txsOf(cur.id).length, "request") + "</span></div>" +
        '<div class="dt-body mono code">' + line(0, tag("h1") + esc(cur.name) + tag("h1", null, true)) + "</div>" +
      "</div>";
  }

  P.worlds.web = { title: "Web dev", render: render, mount: mount, preview: preview };
})();
