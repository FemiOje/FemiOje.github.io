/* The whole site renders from this file. Edit data here; the pages read it through
   src/content.config.ts, which checks every entry against the schema.
   Every entry must be traceable to a real repo, PR, or live URL.

   profile     who the site is about. `intro` is the one line that changes per lens.
   experience  the rows in the about section, in `order`.
   projects    one entry per project:
     lenses       which lenses show it: home (everything), web, games, blockchain
     featured_in  lenses where it is the one featured project
     order        its place in each lens it appears in
     tags         drive the project filters: web, onchain, games, open-source
     status       shipped | contributor | in-progress
     years        from the dates of its entries in `txs`
     cover        image path from the repo root; a placeholder shows when absent
     gallery      more images for the project page, after the cover: { src, alt }, alt saying what it shows
     excerpt      optional code figure for the blockchain lens: real lines from the repo (18 at most), with the
                  permalink they were copied from. `lang` picks the highlighting grammar; Cairo reads best as "rust"
     net          "mainnet" = shipped / professional / open-source work.  "testnet" = coursework, bootcamps, learning.
   txs         something that happened to a project (`to` is its slug). status "pending" = work in progress.
               src says where the date came from: "push" (GitHub last-push date) or "commit" (dated upstream commit). */
export default {
  asOf: "2026-10-05",

  profile: {
    name: "Femi Ojetokun",
    fullName: "Oluwafemi Ojetokun",
    handle: "jinius",
    role: "Software engineer",
    /* A fixed offset, not a place. The Etc zones invert the sign: this is GMT+1. */
    timeZone: "Etc/GMT-1",
    focus: "web, blockchain, games",
    bio: [
      "I'm a software engineer and blockchain security researcher.",
      "I'm currently working on Aux, a shared space for discovering new music through other people, and learning about blockchain security."
    ],
    intro: {
      home: "Working where the web, blockchains and games meet.",
      web: "Currently building Aux, a shared space for discovering new music through other people.",
      games: "Open-source contributor to Loot Survivor 2 and Dope Wars, among others.",
      blockchain: "Created Hex'd, a fully onchain battle royale on Starknet, and Herit, an onchain inheritance platform."
    },
    /* The search and social description of each lens's home page: what a search result shows. */
    meta: {
      home: "I'm Femi Ojetokun, a software engineer working where the web, blockchains and games meet. My projects, open-source work and how to reach me.",
      web: "Frontend work by Femi Ojetokun, a software engineer. Currently building Aux, a shared space for discovering new music through other people.",
      games: "Games by Femi Ojetokun: Hex'd, a fully onchain battle royale on Starknet, Unity game jam entries, and open-source work on Loot Survivor 2 and Dope Wars.",
      blockchain: "Onchain work by Femi Ojetokun: Hex'd, a fully onchain battle royale on Starknet, and Herit, an onchain inheritance platform co-created with Kelechi Kizito."
    },
    email: "0xjinius@gmail.com",
    links: [
      { label: "github", url: "https://github.com/FemiOje" },
      { label: "x", url: "https://x.com/0xjinius" },
      { label: "itch.io", url: "https://femioje.itch.io" },
      { label: "discord", url: "https://discord.com/users/968871471206264872" }
    ],
    /* Language of each original (non-fork) public repo on GitHub, counted on asOf. */
    holdings: [
      { token: "C#", amount: 20 },
      { token: "ShaderLab", amount: 7 },
      { token: "JavaScript", amount: 7 },
      { token: "TypeScript", amount: 6 },
      { token: "Cairo", amount: 4 },
      { token: "Python", amount: 2 },
      { token: "Shell", amount: 1 },
      { token: "PHP", amount: 1 },
      { token: "HTML", amount: 1 },
      { token: "Rust", amount: 1 },
      { token: "Java", amount: 1 }
    ]
  },

  experience: [
    { id: "provable-labs", label: "work", title: "Provable Labs", detail: "Software Engineer · working directly under the co-founder to port Loot Survivor 2 and Dope Wars into the Embeddable Game Standard", years: "2025", order: 1 },
    { id: "open-source", label: "open source", title: "Daydreams, Dope Wars, Loot Survivor 2, DojoByExample, etc.", detail: "contributor to both onchain games", order: 2 },
    { id: "education", label: "education", title: "B.Sc. Computer Science", detail: "University of Lagos", years: "March 2027", order: 3 },
    { id: "learning", label: "learning", title: "Blockchain Security", detail: "", order: 4 }
  ],

  projects: [
    /* ───────────── mainnet ───────────── */
    {
      title: "Hex'd", slug: "hexed", role: "Author", status: "shipped", years: "2026",
      summary: "A fully onchain asynchronous battle royale with fog of war. Players cross a hex grid where every empty tile is a gift or a curse, and walking into another player resolves combat by XP. All logic, state and randomness live on Starknet through Dojo; the client is a playable 3D board.",
      lenses: ["home", "games", "blockchain"], featured_in: ["games", "blockchain"],
      order: { home: 2, games: 1, blockchain: 1 },
      tags: ["onchain", "games"],
      stack: ["Cairo", "Dojo", "Starknet", "React", "Three.js", "Cartridge Controller"],
      links: { live: "", repo: "https://github.com/FemiOje/hexed" },
      kind: "game", net: "mainnet",
      excerpt: {
        file: "combat.cairo", lang: "rust",
        caption: "combat goes to the player with more XP, and a tie goes to the attacker.",
        url: "https://github.com/FemiOje/hexed/blob/387e095a354d98acb7a5ad82550617d6e4bdb3b0/contracts/src/helpers/combat.cairo#L44-L60",
        code: `pub fn resolve_combat(
    ref world: dojo::world::WorldStorage,
    token_id: felt252,
    defender_token_id: felt252,
    ref state: PlayerState,
    direction: Direction,
) -> CombatOutcome {
    let old_position = state.position;
    let next_vec = get_neighbor(old_position, direction);

    let mut attacker_stats: PlayerStats = world.read_model(token_id);
    let mut defender_stats: PlayerStats = world.read_model(defender_token_id);

    // Higher XP wins. Equal XP penalises defender (attacker wins).
    let attacker_won = attacker_stats.xp >= defender_stats.xp;
    let mut attacker_died = false;
    let mut defender_died = false;`
      },
      facts: [
        { k: "grid", v: "21 × 21 hexes, axial coordinates" },
        { k: "fog_of_war", v: "6-bit neighbour bitmask" },
        { k: "rng", v: "Poseidon hash of game state" },
        { k: "max_concurrent_games", v: "350" },
        { k: "event_types", v: "7" },
        { k: "network", v: "Starknet Sepolia" }
      ]
    },
    {
      title: "Herit", slug: "herit", role: "Co-creator", status: "shipped", years: "2026",
      summary: "An onchain inheritance platform built on ENSv2 subnames and World ID: if an owner is no longer alive, their heirs gain access. Took first place for Best Use of ENSv2 at ETHOnline 2026.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 3, blockchain: 2 },
      tags: ["onchain", "open-source"],
      stack: ["TypeScript", "ENSv2", "World ID"],
      links: { live: "", repo: "https://github.com/FemiOje/herit" },
      cover: "img/smart-contracts/herit.png",
      kind: "dapp", net: "mainnet", upstream: "Kelechikizito/herit",
      facts: [
        { k: "co_creator", v: "Kelechi Kizito" },
        { k: "award", v: "1st place, Best Use of ENSv2 — ETHOnline 2026" },
        { k: "my_commits_upstream", v: "28, between 2026-09-05 and 2026-09-12" }
      ]
    },
    {
      title: "Death Mountain Renderer", slug: "ls2-renderer", role: "Fork", status: "shipped", years: "2025",
      summary: "A Cairo contract that renders Loot Survivor adventurers as dynamic SVG NFT metadata: health bars coloured by remaining health, equipment icons, level and stats, all generated onchain and returned as Base64-encoded JSON.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 4, blockchain: 3 },
      tags: ["onchain"],
      stack: ["Cairo", "Starknet", "SVG"],
      links: { live: "", repo: "https://github.com/FemiOje/ls2-renderer" },
      cover: "img/smart-contracts/loot-survivor-2.png",
      gallery: [
        { src: "img/smart-contracts/loot-survivor-3.png", alt: "A dead adventurer's card: a gravestone, the line \"Death Mountain has claimed another\" and a final score of 80 XP." }
      ],
      kind: "contract", net: "mainnet", upstream: "Provable-Games/death-mountain-renderer",
      facts: [
        { k: "entry_points", v: "game_details(), token_description(), game_details_svg()" },
        { k: "output", v: "Base64 JSON metadata with embedded SVG" }
      ]
    },
    {
      title: "aux", slug: "aux", role: "Contributor", status: "in-progress", years: "2026",
      summary: "For the audiophiles looking for niche music, the music nerds looking to be put on, and the hobbyists looking to refresh their taste.",
      lenses: ["home", "web"], featured_in: ["home", "web"],
      order: { home: 1, web: 1 },
      tags: ["web", "open-source"],
      stack: ["TypeScript", "Privy"],
      links: { live: "", repo: "https://github.com/Kelechikizito/aux" },
      kind: "web", net: "mainnet", upstream: "Kelechikizito/aux"
    },
    {
      title: "agent-sandbox", slug: "agent-sandbox", role: "Author", status: "shipped", years: "2026",
      summary: "A Docker sandbox that lets AI coding agents work on a project without access to your computer. Outgoing traffic is denied by default and unknown sites wait for approval; the agent runs unprivileged with every Linux capability removed; no host files are mounted.",
      lenses: ["home"], featured_in: [],
      order: { home: 5 },
      tags: [],
      stack: ["Shell", "Docker", "iptables", "Foundry"],
      links: { live: "", repo: "https://github.com/FemiOje/agent-sandbox" },
      kind: "tool", net: "mainnet",
      facts: [
        { k: "self_test", v: "55 checks via ./sandbox test, also run in GitHub Actions" },
        { k: "network_policy", v: "default deny, approval proxy" },
        { k: "agent_user", v: "uid 1000, no capabilities, no_new_privs" }
      ]
    },
    {
      title: "daydreams", slug: "daydreams", role: "Contributor", status: "contributor", years: "2025",
      summary: "A generative agent framework for executing anything onchain. Contributed work on its Telegram client.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 6, blockchain: 4 },
      tags: ["onchain", "open-source"],
      stack: ["TypeScript"],
      links: { live: "", repo: "https://github.com/daydreamsai/daydreams" },
      kind: "tool", net: "mainnet", upstream: "daydreamsai/daydreams",
      facts: [
        { k: "my_commits_upstream", v: "11, between 2025-01-29 and 2025-01-31" }
      ]
    },
    {
      title: "FishFest", slug: "fish-fest", role: "Author", status: "shipped", years: "2025",
      summary: "A 2D underwater casual endless runner, built for the Fish Fest game jam by team Axolotl.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 7, games: 2 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "https://femioje.itch.io/fishfest-gamejamnew-build", repo: "https://github.com/FemiOje/Fish-Fest-Game-Jam" },
      cover: "img/game-dev/fishfest_gamejam.png",
      kind: "game", net: "mainnet"
    },
    {
      title: "Adventure of the Thing", slug: "adventure-of-the-thing", role: "Author", status: "shipped", years: "2024",
      summary: "A 2D adventure game with combat physics. Submission for the 2024 Scripto Game Jam.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 8, games: 3 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "https://femioje.itch.io/adventure-of-the-thing", repo: "https://github.com/FemiOje/Adventure-of-the-Thing" },
      cover: "img/game-dev/adventure-of-the-thing.png",
      kind: "game", net: "mainnet"
    },
    {
      title: "Dungeon Generator 2D", slug: "dungeon-generator-2d", role: "Author", status: "shipped", years: "2025",
      summary: "A 2D game built around a dungeon generator.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 9, games: 4 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/dungeon-generator-2d" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Penito Furniture", slug: "penito-furniture", role: "Author", status: "shipped", years: "2023",
      summary: "A furniture shopping app built with React, React Router, Redux Toolkit and localStorage.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 10, web: 2 },
      tags: ["web"],
      stack: ["React", "Redux Toolkit", "React Router"],
      links: { live: "https://penito-furniture.netlify.app/", repo: "https://github.com/FemiOje/penitoFurniture" },
      cover: "img/web-dev/penito-furniture.png",
      kind: "web", net: "mainnet"
    },
  ],

  txs: [
    { id: "aux-feed", date: "2026-10-05", src: "commit", method: "merge", to: "aux", status: "pending", note: "Add feed, Privy sign-in, posting drops and saves (#2)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },
    { id: "agent-sandbox-deploy", date: "2026-10-02", src: "push", method: "deploy", to: "agent-sandbox", note: "Docker sandbox for AI coding agents", url: "https://github.com/FemiOje/agent-sandbox" },
    { id: "aux-setup", date: "2026-09-30", src: "commit", method: "merge", to: "aux", note: "Project setup (#1)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },
    { id: "herit-dashboard", date: "2026-09-12", src: "commit", method: "merge", to: "herit", note: "Dashboard, roadmap page and mobile responsiveness", url: "https://github.com/Kelechikizito/herit/commits?author=FemiOje" },
    { id: "hexed-jam", date: "2026-03-08", src: "commit", method: "submit", to: "hexed", note: "[Submission]: Hex'd (#276) — Dojo game jams", url: "https://github.com/dojoengine/game-jams/pull/276" },
    { id: "ls2-renderer-push", date: "2025-12-01", src: "push", method: "deploy", to: "ls2-renderer", note: "SVG metadata renderer for Loot Survivor adventurers", url: "https://github.com/FemiOje/ls2-renderer" },
    { id: "dungeon-deploy", date: "2025-04-20", src: "push", method: "deploy", to: "dungeon-generator-2d", note: "2D game with a dungeon generator", url: "https://github.com/FemiOje/dungeon-generator-2d" },
    { id: "dojobyexample-merge", date: "2025-03-23", src: "commit", method: "merge", ext: "AkatsukiLabs/DojoByExample", net: "mainnet", note: "feat: create RewardType enum (#44)", url: "https://github.com/AkatsukiLabs/DojoByExample/pull/44" },
    { id: "fish-fest-jam", date: "2025-02-12", src: "push", method: "submit", to: "fish-fest", note: "Fish Fest game jam, team Axolotl", url: "https://femioje.itch.io/fishfest-gamejamnew-build" },
    { id: "daydreams-telegram", date: "2025-01-31", src: "commit", method: "merge", to: "daydreams", note: "Telegram client: login, startup message, chat list scraper", url: "https://github.com/daydreamsai/daydreams/commits?author=FemiOje" },
    { id: "bytebeasts-fix", date: "2024-11-26", src: "commit", method: "merge", ext: "ByteBeasts/ByteBeastsFrontend", net: "mainnet", note: "Bug fix transitions (#149)", url: "https://github.com/ByteBeasts/ByteBeastsFrontend/pull/149" },
    { id: "adventure-jam", date: "2024-09-04", src: "push", method: "submit", to: "adventure-of-the-thing", note: "2024 Scripto Game Jam", url: "https://femioje.itch.io/adventure-of-the-thing" },
    { id: "penito-deploy", date: "2023-02-15", src: "push", method: "deploy", to: "penito-furniture", note: "Furniture shopping app", url: "https://penito-furniture.netlify.app/" }
  ]
};
