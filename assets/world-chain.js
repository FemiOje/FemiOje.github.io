/* Blockchain world: a block explorer. Blocks are months, transactions are things shipped, contracts are projects. */
(function () {
  var P = window.P;
  if (!P) return;
  var C = P.C, esc = P.esc, ext = P.ext, hash = P.hash, short = P.short, monthName = P.monthName, age = P.age,
    plural = P.plural, chips = P.chips, roleLabel = P.roleLabel, byId = P.byId;
  var R = "#/chain";
  function blockNo(key) { return key.replace("-", ""); }
  function onChain(c) { return c.tracks.indexOf("chain") >= 0; }
  /* A tx belongs here if its project does, or if it is a one-off PR elsewhere (ext). */
  var allTxs = P.allTxs.filter(function (t) { return byId[t.to] ? onChain(byId[t.to]) : !!t.ext; });
  var ownerAddr = hash("owner:" + C.owner.handle, 40);

  /* ── network (mainnet = shipped work, testnet = coursework & learning) ── */
  var net = "mainnet";
  try { if (localStorage.getItem("scan-net") === "testnet") net = "testnet"; } catch (e) {}
  function contracts() { return C.contracts.filter(function (c) { return c.net === net && onChain(c); }); }
  function txs() { return allTxs.filter(function (t) { return t.net === net; }); }
  function confirmed() { return txs().filter(function (t) { return t.status !== "pending"; }); }
  function pending() { return txs().filter(function (t) { return t.status === "pending"; }); }
  function blocks() {
    var map = {}, list = [];
    confirmed().forEach(function (t) {
      var k = t.date.slice(0, 7);
      if (!map[k]) { map[k] = { key: k, txs: [] }; list.push(map[k]); }
      map[k].txs.push(t);
    });
    return list;
  }

  /* ── fragments ── */
  function method(t) { return '<span class="method m-' + esc(t.method) + '">' + esc(t.method) + "</span>"; }
  function target(t) {
    var c = byId[t.to];
    if (c) return '<a href="' + R + '/contract/' + esc(c.id) + '">' + esc(c.name) + "</a>";
    return t.ext ? ext("https://github.com/" + t.ext, esc(t.ext) + " ↗") : "—";
  }
  function txRow(t) {
    return '<div class="row">' +
      '<div class="row-main">' +
        '<a class="mono hash" href="' + R + '/tx/' + esc(t.id) + '">' + short(t.hash) + "</a>" + method(t) +
        (t.status === "pending" ? '<span class="pill pending">pending</span>' : "") +
        '<div class="row-sub">' + esc(t.note) + "</div>" +
      "</div>" +
      '<div class="row-side"><span class="to">to ' + target(t) + '</span><span class="muted">' + age(t.date) + "</span></div>" +
    "</div>";
  }
  function blockRow(b) {
    var names = [];
    b.txs.forEach(function (t) {
      var n = byId[t.to] ? byId[t.to].name : t.ext;
      if (n && names.indexOf(n) < 0) names.push(n);
    });
    return '<div class="row">' +
      '<div class="row-main">' +
        '<a class="mono hash" href="' + R + '/block/' + b.key + '">#' + blockNo(b.key) + "</a>" +
        '<span class="muted">' + monthName(b.key) + "</span>" +
        '<div class="row-sub">' + esc(names.join(" · ")) + "</div>" +
      "</div>" +
      '<div class="row-side"><span>' + plural(b.txs.length, "txn") + '</span><span class="muted">' + age(b.txs[0].date) + "</span></div>" +
    "</div>";
  }
  function contractCard(c) {
    return '<a class="card" href="' + R + '/contract/' + esc(c.id) + '">' +
      (c.image ? '<img class="card-img" src="' + esc(c.image) + '" alt="" loading="lazy" onerror="this.remove()">' : "") +
      '<div class="card-body">' +
        '<div class="card-top"><span class="kind">' + esc(c.kind) + '</span><span class="mono muted">' + short(c.address) + "</span></div>" +
        '<div class="card-name">' + esc(c.name) + "</div>" +
        '<p class="card-sum">' + esc(c.summary) + "</p>" +
        chips((c.stack || []).slice(0, 4)) +
      "</div></a>";
  }
  function panel(title, body, more) {
    return '<section class="panel"><div class="panel-head"><h2>' + title + "</h2>" + (more || "") + "</div>" + body + "</section>";
  }
  function kv(rows) {
    return '<dl class="kv">' + rows.filter(Boolean).map(function (r) {
      return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>";
    }).join("") + "</dl>";
  }
  function empty(msg) { return '<div class="empty">' + msg + "</div>"; }
  function crumb(parts) { return '<div class="crumb">' + parts.join(' <span class="muted">/</span> ') + "</div>"; }

  /* ── pages ── */
  function home() {
    var bl = blocks(), cf = confirmed(), pd = pending(), cs = contracts();
    var featured = cs.filter(function (c) { return c.featured; });
    if (!featured.length) featured = cs.slice(0, 6);
    var o = C.owner;
    return '<section class="hero">' +
        '<p class="eyebrow">' + esc(C.site.scan || C.site.name) + " · " + esc(C.site.chain) + " " + net + "</p>" +
        "<h1>" + esc(o.name) + ', <span class="accent">onchain</span>.</h1>' +
        '<p class="lede">A block explorer for the blockchain work: every block is a month, every transaction is something shipped, every contract is a project.</p>' +
      "</section>" +
      strip() +
      '<section class="stats">' +
        stat("Latest block", bl.length ? "#" + blockNo(bl[0].key) : "—", bl.length ? monthName(bl[0].key) : "") +
        stat("Transactions", cf.length, pd.length ? pd.length + " pending" : "confirmed") +
        stat("Contracts", cs.length, "projects on " + net) +
        stat("Tokens held", o.holdings.length, "languages") +
      "</section>" +
      (pd.length ? panel("Mempool <span class=\"muted\">· in progress</span>", pd.map(txRow).join("")) : "") +
      '<div class="cols">' +
        panel("Latest blocks", bl.slice(0, 6).map(blockRow).join("") || empty("No blocks on " + net + "."), '<a class="more" href="' + R + '/blocks">View all →</a>') +
        panel("Latest transactions", cf.slice(0, 6).map(txRow).join("") || empty("No transactions on " + net + "."), '<a class="more" href="' + R + '/txs">View all →</a>') +
      "</div>" +
      panel("Verified contracts", '<div class="grid">' + featured.map(contractCard).join("") + "</div>", '<a class="more" href="' + R + '/contracts">All ' + cs.length + " →</a>");
  }
  function stat(label, value, sub) {
    return '<div class="stat"><div class="stat-l">' + label + '</div><div class="stat-v mono">' + esc(value) + '</div><div class="stat-s">' + esc(sub) + "</div></div>";
  }

  function blocksPage() {
    return crumb(["Blocks"]) + panel("Blocks <span class=\"muted\">· one per active month</span>", blocks().map(blockRow).join("") || empty("No blocks on " + net + "."));
  }
  function blockPage(key) {
    var all = blocks(), i = -1;
    all.forEach(function (b, n) { if (b.key === key) i = n; });
    if (i < 0) return notFound();
    var b = all[i], newer = all[i - 1], older = all[i + 1];
    return crumb(['<a href="' + R + '/blocks">Blocks</a>', "#" + blockNo(key)]) +
      panel("Block #" + blockNo(key), kv([
        ["Month", monthName(key)],
        ["Transactions", b.txs.length],
        ["Network", esc(C.site.chain) + " " + net],
        ["Block hash", '<span class="mono wrap-any">' + hash("block:" + key, 64) + "</span>"],
        ["Navigate", (older ? '<a href="' + R + '/block/' + older.key + '">← #' + blockNo(older.key) + "</a>" : '<span class="muted">genesis</span>') +
          ' &nbsp; ' + (newer ? '<a href="' + R + '/block/' + newer.key + '">#' + blockNo(newer.key) + " →</a>" : '<span class="muted">latest</span>')]
      ])) +
      panel("Transactions", b.txs.map(txRow).join(""));
  }

  function txsPage() {
    var pd = pending();
    return crumb(["Transactions"]) +
      (pd.length ? panel("Mempool", pd.map(txRow).join("")) : "") +
      panel("Transactions", confirmed().map(txRow).join("") || empty("No transactions on " + net + "."));
  }
  function txPage(id) {
    var t = null;
    allTxs.forEach(function (x) { if (x.id === id) t = x; });
    if (!t) return notFound();
    if (t.net !== net) net = t.net;
    var key = t.date.slice(0, 7), isPending = t.status === "pending";
    return crumb(['<a href="' + R + '/txs">Transactions</a>', short(t.hash)]) +
      panel("Transaction", kv([
        ["Hash", '<span class="mono wrap-any">' + t.hash + "</span>"],
        ["Status", isPending ? '<span class="pill pending">pending · in progress</span>' : '<span class="pill ok">✓ success</span>'],
        ["Block", isPending ? '<span class="muted">not yet included</span>' : '<a class="mono" href="' + R + '/block/' + key + '">#' + blockNo(key) + "</a> " + '<span class="muted">' + monthName(key) + "</span>"],
        ["Timestamp", esc(t.date) + ' <span class="muted">· ' + age(t.date) + " · " + (t.src === "commit" ? "commit date" : "last push to the repo") + "</span>"],
        ["From", '<a class="mono" href="' + R + '/address">' + esc(C.owner.handle) + "</a>"],
        ["To", target(t)],
        ["Method", method(t)],
        ["Input", esc(t.note)],
        t.url ? ["Receipt", ext(t.url, "View the evidence ↗")] : null
      ]));
  }

  function contractsPage() {
    var cs = contracts();
    return crumb(["Contracts"]) + panel("Contracts <span class=\"muted\">· " + cs.length + " on " + net + "</span>",
      cs.length ? '<div class="grid">' + cs.map(contractCard).join("") + "</div>" : empty("No contracts on " + net + "."));
  }
  function contractPage(id) {
    var c = byId[id];
    if (!c) return notFound();
    if (c.net !== net) net = c.net;
    var ev = P.txsOf(id);
    var links = P.links(c);
    return crumb(['<a href="' + R + '/contracts">Contracts</a>', esc(c.name)]) +
      '<section class="panel pad contract-head">' +
        '<div><span class="kind">' + esc(c.kind) + '</span> <span class="pill ok">✓ verified</span>' +
        (c.net === "testnet" ? ' <span class="pill">testnet</span>' : "") + "</div>" +
        "<h1>" + esc(c.name) + "</h1>" +
        '<div class="mono muted wrap-any">' + esc(c.address) + "</div>" +
        '<p class="lede">' + esc(c.summary) + "</p>" +
        '<div class="btns">' + links + "</div>" +
      "</section>" +
      (c.image ? '<section class="panel shot"><img src="' + esc(c.image) + '" alt="Screenshot of ' + esc(c.name) + '" onerror="this.parentNode.remove()"></section>' : "") +
      panel("Overview", kv([
        ["Deployer", '<a class="mono" href="' + R + '/address">' + esc(C.owner.handle) + "</a> " + '<span class="muted">· ' + esc(roleLabel(c)) + "</span>"],
        ["Compiler", chips(c.stack)],
        c.onchain ? ["Onchain address", ext(c.onchain.url, '<span class="mono wrap-any">' + esc(c.onchain.address) + "</span>") + ' <span class="muted">· ' + esc(c.onchain.network) + " (real)</span>"] : null
      ])) +
      (c.facts && c.facts.length ? panel("Read contract", c.facts.map(function (f) {
        return '<div class="read"><span class="mono fn">' + esc(f.k) + '()</span><span class="ret">→ ' + esc(f.v) + "</span></div>";
      }).join("")) : "") +
      panel("Events", ev.map(txRow).join("") || empty("No transactions recorded."));
  }

  function addressPage() {
    var o = C.owner, total = 0;
    o.holdings.forEach(function (h) { total += h.amount; });
    var mine = allTxs.filter(function (t) { return t.status !== "pending"; });
    return crumb(["Address"]) +
      '<section class="panel pad contract-head">' +
        '<div><span class="kind">account</span> <span class="pill ok">● online</span></div>' +
        "<h1>" + esc(o.name) + ' <span class="muted">(' + esc(o.handle) + ")</span></h1>" +
        '<div class="mono muted wrap-any">' + ownerAddr + "</div>" +
        '<p class="lede">' + esc(o.role) + ". " + esc(o.bio) + "</p>" +
        '<div class="btns">' + o.links.map(function (l, i) { return ext(l.url, esc(l.label) + " ↗", i ? "btn" : "btn primary"); }).join("") + "</div>" +
      "</section>" +
      '<div class="cols">' +
        panel("Token holdings <span class=\"muted\">· original repos by language</span>", o.holdings.map(function (h) {
          return '<div class="hold"><span class="hold-t">' + esc(h.token) + '</span><span class="hold-bar"><i style="width:' + (h.amount / o.holdings[0].amount * 100).toFixed(1) + '%"></i></span><span class="mono">' + h.amount + "</span></div>";
        }).join("") + '<div class="note">' + total + " original public repos with a detected language, counted on GitHub " + esc(C.site.asOf) + ". Forks excluded.</div>") +
        panel("Account", kv([
          ["Transactions", mine.length + ' <span class="muted">across both networks</span>'],
          ["Contracts", C.contracts.filter(onChain).length],
          ["First seen", mine.length ? esc(mine[mine.length - 1].date) : "—"],
          ["Last active", mine.length ? esc(mine[0].date) + ' <span class="muted">· ' + age(mine[0].date) + "</span>" : "—"]
        ])) +
      "</div>" +
      panel("Latest transactions", confirmed().slice(0, 8).map(txRow).join("") || empty("No transactions on " + net + "."), '<a class="more" href="' + R + '/txs">View all →</a>');
  }

  function notFound() {
    return '<section class="panel pad"><h1>Not found</h1><p class="lede">Nothing at this hash on ' + esc(C.site.chain) + " " + net +
      '. Try the other network, or go <a href="' + R + '">home</a>.</p></section>';
  }

  /* ── mempool-style strip: pending work on the left, mined months on the right ── */
  function strip() {
    var pd = pending(), bl = blocks().slice(0, 10);
    return '<section class="strip" aria-label="Recent blocks">' +
      '<a class="blk pend" href="' + R + '/txs"><span class="blk-n">mempool</span><span class="blk-m">' + (pd.length ? "in progress" : "empty") +
        '</span><span class="blk-t">' + plural(pd.length, "txn") + "</span></a>" +
      '<span class="strip-sep" aria-hidden="true"></span>' +
      bl.map(function (b, i) {
        return '<a class="blk' + (i ? "" : " tip") + '" href="' + R + "/block/" + b.key + '"><span class="blk-n mono">#' + blockNo(b.key) + '</span><span class="blk-m">' +
          monthName(b.key) + '</span><span class="blk-t">' + plural(b.txs.length, "txn") + "</span></a>";
      }).join("") + "</section>";
  }

  /* ── sub-navigation, network switch and search live inside this world ── */
  function bar(sec) {
    function a(href, key, label) { return '<a href="' + R + href + '"' + (sec === key ? ' class="active"' : "") + ">" + label + "</a>"; }
    return '<div class="chainbar">' +
      '<nav class="nav" aria-label="Explorer sections">' + a("", "", "Home") + a("/blocks", "block", "Blocks") + a("/txs", "tx", "Transactions") +
        a("/contracts", "contract", "Contracts") + a("/address", "address", "Address") + "</nav>" +
      '<button class="net" id="net-toggle" aria-label="Switch network"><span class="net-dot"></span>' + net + "</button>" +
      "</div>" +
      '<div class="search"><span class="search-ico" aria-hidden="true">⌕</span>' +
        '<input id="search" type="search" autocomplete="off" spellcheck="false" placeholder="Search by project, stack, month or tx hash" aria-label="Search the explorer">' +
        '<kbd>/</kbd><div class="results" id="results" hidden></div></div>';
  }

  function render(p) {
    var sec = p[0] || "", id = p.slice(1).join("/");
    var page = sec === "" ? home()
      : sec === "blocks" ? blocksPage()
      : sec === "block" ? blockPage(id)
      : sec === "txs" ? txsPage()
      : sec === "tx" ? txPage(id)
      : sec === "contracts" ? contractsPage()
      : sec === "contract" ? contractPage(id)
      : sec === "address" ? addressPage()
      : notFound();
    document.documentElement.setAttribute("data-net", net);
    return bar(sec.replace(/s$/, "")) + page;
  }
  function setNet(n) {
    net = n;
    try { localStorage.setItem("scan-net", net); } catch (e) {}
  }

  /* ── search ── */
  function find(q) {
    q = q.toLowerCase().trim();
    if (!q) return [];
    var out = [];
    C.contracts.filter(onChain).forEach(function (c) {
      if ((c.name + " " + c.kind + " " + (c.stack || []).join(" ") + " " + c.summary + " " + c.address).toLowerCase().indexOf(q) >= 0)
        out.push({ href: R + "/contract/" + c.id, tag: "contract", text: c.name, sub: (c.stack || []).slice(0, 3).join(" · "), net: c.net });
    });
    allTxs.forEach(function (t) {
      if ((t.note + " " + t.method + " " + t.hash + " " + (t.ext || "")).toLowerCase().indexOf(q) >= 0)
        out.push({ href: R + "/tx/" + t.id, tag: "tx", text: t.note, sub: t.method + " · " + t.date, net: t.net });
    });
    var seen = {};
    allTxs.forEach(function (t) {
      var k = t.date.slice(0, 7), label = (blockNo(k) + " " + k + " " + monthName(k)).toLowerCase();
      if (t.status !== "pending" && !seen[k + t.net] && label.indexOf(q) >= 0) {
        seen[k + t.net] = 1;
        out.push({ href: R + "/block/" + k, tag: "block", text: "#" + blockNo(k), sub: monthName(k), net: t.net });
      }
    });
    return out.slice(0, 8);
  }
  /* The bar is re-rendered with every page, so listeners are bound in mount(). */
  function mount(root) {
    var input = root.querySelector("#search"), box = root.querySelector("#results"), netBtn = root.querySelector("#net-toggle");
    if (netBtn) netBtn.addEventListener("click", function () { setNet(net === "mainnet" ? "testnet" : "mainnet"); P.render(); });
    if (!input || !box) return;
    function show() {
      var r = find(input.value);
      box.hidden = !input.value.trim();
      box.innerHTML = r.length ? r.map(function (x) {
        return '<a class="result" href="' + esc(x.href) + '" data-net="' + x.net + '"><span class="kind">' + x.tag + '</span><span class="result-t">' + esc(x.text) +
          '</span><span class="muted result-s">' + esc(x.sub) + (x.net === "testnet" ? " · testnet" : "") + "</span></a>";
      }).join("") : '<div class="empty">No matches.</div>';
    }
    function go(a) {
      if (a.getAttribute("data-net") !== net) setNet(a.getAttribute("data-net"));
      if (location.hash === a.getAttribute("href")) P.render(); else location.hash = a.getAttribute("href");
    }
    input.addEventListener("input", show);
    input.addEventListener("focus", show);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; box.hidden = true; input.blur(); }
      if (e.key === "Enter") { var first = box.querySelector(".result"); if (first) go(first); }
    });
    box.addEventListener("click", function (e) { var a = e.target.closest(".result"); if (a) { e.preventDefault(); go(a); } });
  }
  document.addEventListener("click", function (e) {
    var box = document.getElementById("results");
    if (box && !e.target.closest(".search")) box.hidden = true;
  });
  document.addEventListener("keydown", function (e) {
    var input = document.getElementById("search");
    if (input && e.key === "/" && document.activeElement !== input && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });

  /* ── hub preview: the block strip and the three latest transactions ── */
  function preview() {
    var bl = blocks(), cf = confirmed(), cs = contracts();
    return '<div class="pv-top"><div class="pv-text">' +
        '<p class="eyebrow">' + esc(C.site.scan || C.site.name) + " · " + esc(C.site.chain) + " " + net + "</p>" +
        "<h2>" + esc(C.owner.name.split(" ")[0]) + ', <span class="accent">onchain</span>.</h2>' +
        "<p>A block explorer for the blockchain work: every block is a month, every transaction is something shipped, every contract is a project.</p>" +
        '<div class="btns"><a class="btn primary" href="' + R + '">Open the explorer →</a></div>' +
      "</div>" +
      '<div class="stats">' +
        stat("Latest block", bl.length ? "#" + blockNo(bl[0].key) : "—", bl.length ? monthName(bl[0].key) : "") +
        stat("Transactions", cf.length, "confirmed") +
        stat("Contracts", cs.length, "on " + net) +
      "</div></div>" +
      strip() +
      panel("Latest transactions", cf.slice(0, 3).map(txRow).join("") || empty("No transactions on " + net + "."), '<a class="more" href="' + R + '/txs">View all →</a>');
  }

  P.worlds.chain = { title: C.site.scan || "explorer", render: render, mount: mount, preview: preview };
})();
