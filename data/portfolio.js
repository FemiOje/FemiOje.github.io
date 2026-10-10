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
    focus: "web, onchain, games",
    bio: [
      "Interested and actively building in web development, blockchain development and game development."
    ],
    intro: {
      home: "Working where the web, blockchains and games meet.",
      web: "Currently building Aux, a shared space for discovering new music through other people.",
      games: "Open-source contributor to Loot Survivor 2 and Dope Wars, two onchain games.",
      blockchain: "Author of Hex'd, a fully onchain battle royale on Starknet, and contributor to herit, an onchain inheritance platform."
    },
    email: "0xjinius@gmail.com",
    links: [
      { label: "github", url: "https://github.com/FemiOje" },
      { label: "x", url: "https://x.com/0xjinius" },
      { label: "itch.io", url: "https://femioje.itch.io" }
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
    { id: "provable-labs", label: "work", title: "Provable Labs", detail: "[role title] · a one-person team, working directly under the CEO and co-founder", years: "[years]", order: 1 },
    { id: "open-source", label: "open source", title: "Dope Wars, Loot Survivor 2", detail: "contributor to both onchain games", order: 2 },
    { id: "education", label: "education", title: "B.Sc. Computer Science", detail: "University of Lagos", years: "[year]", order: 3 },
    { id: "learning", label: "learning", title: "Smart contracts", detail: "Speedrun Ethereum → Ethernaut → Damn Vulnerable DeFi", order: 4 }
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
      title: "herit", slug: "herit", role: "Contributor", status: "contributor", years: "2026",
      summary: "An onchain inheritance platform built on ENSv2 subnames and World ID: if an owner is no longer alive, their heirs gain access. Took first place for Best Use of ENSv2 at ETHOnline 2026.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 3, blockchain: 2 },
      tags: ["onchain", "open-source"],
      stack: ["TypeScript", "ENSv2", "World ID"],
      links: { live: "", repo: "https://github.com/Kelechikizito/herit" },
      kind: "dapp", net: "mainnet", upstream: "Kelechikizito/herit",
      facts: [
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
      title: "Scar'd", slug: "scard", role: "Author", status: "shipped", years: "2025",
      summary: "A game submitted to the Dojo game jams.",
      lenses: ["home", "games", "blockchain"], featured_in: [],
      order: { home: 8, games: 3, blockchain: 4 },
      tags: ["onchain", "games"],
      stack: ["TypeScript", "Dojo"],
      links: { live: "", repo: "https://github.com/FemiOje/scard" },
      kind: "game", net: "mainnet"
    },
    {
      title: "daydreams", slug: "daydreams", role: "Contributor", status: "contributor", years: "2025",
      summary: "A generative agent framework for executing anything onchain. Contributed work on its Telegram client.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 9, blockchain: 5 },
      tags: ["onchain", "open-source"],
      stack: ["TypeScript"],
      links: { live: "", repo: "https://github.com/daydreamsai/daydreams" },
      kind: "tool", net: "mainnet", upstream: "daydreamsai/daydreams",
      facts: [
        { k: "my_commits_upstream", v: "11, between 2025-01-29 and 2025-01-31" }
      ]
    },
    {
      title: "Dojo Tic-Tac-Toe", slug: "dojo-tic-tac-toe", role: "Author", status: "shipped", years: "2025",
      summary: "The classic game with Dojo as the backend: two players join, turns and the eight winning lines are enforced by the contract.",
      lenses: ["home", "games", "blockchain"], featured_in: [],
      order: { home: 10, games: 4, blockchain: 6 },
      tags: ["onchain", "games"],
      stack: ["Cairo", "Dojo", "TypeScript"],
      links: { live: "", repo: "https://github.com/FemiOje/dojo_tic-tac-toe" },
      kind: "game", net: "mainnet"
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
      order: { home: 11, games: 5 },
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
      order: { home: 12, games: 6 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/dungeon-generator-2d" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Multiplayer Racing", slug: "multiplayer-racing", role: "Author", status: "shipped", years: "2024",
      summary: "A 3D multiplayer racing game built with Unity.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 13, games: 7 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/Multiplayer-Racing" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Collegiate Game Jam 2024", slug: "collegiate-game-jam-2024", role: "Author", status: "shipped", years: "2024",
      summary: "Entry for the 2024 Collegiate Game Jam hosted by UNC Game Dev. Theme: Out of Order.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 14, games: 8 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/2024-Collegiate-Game-Jam" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Minecraft-Femi", slug: "minecraft-femi", role: "Author", status: "shipped", years: "2023",
      summary: "Dojo Game Jam submission.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 15, games: 9 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/Minecraft-Femi" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Parking Simulator", slug: "parking-simulator", role: "Author", status: "shipped", years: "2023",
      summary: "Submission for the Maliyo Games Game Jam 2023.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 16, games: 10 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "", repo: "https://github.com/FemiOje/Parking-Simulator" },
      kind: "game", net: "mainnet"
    },
    {
      title: "Penito Furniture", slug: "penito-furniture", role: "Author", status: "shipped", years: "2023",
      summary: "A furniture shopping app built with React, React Router, Redux Toolkit and localStorage.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 17, web: 2 },
      tags: ["web"],
      stack: ["React", "Redux Toolkit", "React Router"],
      links: { live: "https://penito-furniture.netlify.app/", repo: "https://github.com/FemiOje/penitoFurniture" },
      cover: "img/web-dev/penito-furniture.png",
      kind: "web", net: "mainnet"
    },

    /* ───────────── testnet ───────────── */
    {
      title: "Student Registry Contract", slug: "student-registry-contract", role: "Author", status: "shipped", years: "2025",
      summary: "A Cairo contract that maintains student records on Starknet.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 18, blockchain: 7 },
      tags: ["onchain"],
      stack: ["Cairo", "Scarb", "Snforge", "Starkli"],
      links: { live: "", repo: "https://github.com/FemiOje/student_registry_contract" },
      cover: "img/smart-contracts/student-registry-contract.png",
      kind: "contract", net: "testnet",
      onchain: {
        network: "Starknet Sepolia",
        address: "0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02",
        url: "https://sepolia.starkscan.co/contract/0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02"
      }
    },
    {
      title: "Student Registry Frontend", slug: "student-registry-frontend", role: "Author", status: "shipped", years: "2025",
      summary: "The interface for reading and updating student records on the registry contract.",
      lenses: ["home", "web", "blockchain"], featured_in: [],
      order: { home: 19, web: 3, blockchain: 8 },
      tags: ["web", "onchain"],
      stack: ["React", "TypeScript", "Tailwind CSS", "Starknet-React"],
      links: { live: "https://student-registry-frontend.vercel.app/", repo: "https://github.com/FemiOje/student-registry-frontend" },
      cover: "img/smart-contracts/student-registry-frontend.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Bookstore Contract", slug: "bookstore", role: "Author", status: "shipped", years: "2025",
      summary: "A Cairo contract that maintains book records on Starknet.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 20, blockchain: 9 },
      tags: ["onchain"],
      stack: ["Cairo", "Scarb", "Snforge", "Starkli"],
      links: { live: "", repo: "https://github.com/FemiOje/bookstore" },
      cover: "img/smart-contracts/bookstore-contract.png",
      kind: "contract", net: "testnet",
      onchain: {
        network: "Starknet Sepolia",
        address: "0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985",
        url: "https://sepolia.starkscan.co/contract/0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985"
      }
    },
    {
      title: "GIDA × Starknet Testing", slug: "gida-testing", role: "Author", status: "shipped", years: "2024",
      summary: "Week 6 assignment of the GIDA × Starknet Cairo bootcamp.",
      lenses: ["home", "blockchain"], featured_in: [],
      order: { home: 21, blockchain: 10 },
      tags: ["onchain"],
      stack: ["Cairo"],
      links: { live: "", repo: "https://github.com/FemiOje/gida-starknet-testing-session-3" },
      kind: "contract", net: "testnet"
    },
    {
      title: "CryptoTracker", slug: "cryptotracker", role: "Contributor", status: "contributor", years: "2025",
      summary: "A group assignment: a website for reviewing data and information on crypto.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 22, web: 4 },
      tags: ["web", "open-source"],
      stack: ["Next.js", "Tailwind CSS", "CoinGecko API"],
      links: { live: "https://cryptotracker-hazel.vercel.app/", repo: "https://github.com/QuadlcorE/cryptotracker" },
      cover: "img/school/crypto-tracker.png",
      kind: "web", net: "testnet", upstream: "QuadlcorE/cryptotracker",
      facts: [
        { k: "my_commits_upstream", v: "13, between 2025-02-27 and 2025-04-01" }
      ]
    },
    {
      title: "Assets Management System", slug: "assets-management-system", role: "Author", status: "shipped", years: "2025",
      summary: "CSC434 group project: employees request and track office items, with records of assigned assets.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 23, web: 5 },
      tags: ["web"],
      stack: ["PHP", "MySQL", "HTML", "CSS"],
      links: { live: "", repo: "https://github.com/FemiOje/assets-management-system" },
      cover: "img/school/assets-management-system.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Logistics Company Dashboard", slug: "logistics-dashboard", role: "Author", status: "shipped", years: "2025",
      summary: "A responsive, interactive dashboard for a logistics company to track shipments in real time.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 24, web: 6 },
      tags: ["web"],
      stack: ["React", "TypeScript", "WebSockets", "Jest"],
      links: { live: "", repo: "https://github.com/FemiOje/logistics-company-dashboard" },
      cover: "img/school/logistics-dashboard.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Dining Philosophers", slug: "dining-philosophers", role: "Author", status: "shipped", years: "2023",
      summary: "Solving the Dining Philosophers problem in Java.",
      lenses: ["home"], featured_in: [],
      order: { home: 25 },
      tags: [],
      stack: ["Java"],
      links: { live: "", repo: "https://github.com/FemiOje/Dining-Philosophers-Problem-Java" },
      kind: "tool", net: "testnet"
    },
    {
      title: "Pong Clone", slug: "pong-clone", role: "Author", status: "shipped", years: "2023",
      summary: "A clone of the classic Pong.",
      lenses: ["home", "games"], featured_in: [],
      order: { home: 26, games: 11 },
      tags: ["games"],
      stack: ["Unity", "C#"],
      links: { live: "https://femioje.itch.io/pong-clone", repo: "https://github.com/FemiOje/Pong-Clone" },
      cover: "img/game-dev/pong-clone.png",
      kind: "game", net: "testnet"
    },
    {
      title: "Star Wars API", slug: "star-wars-api", role: "Author", status: "shipped", years: "2023",
      summary: "A site built on the Star Wars API that displays characters, films, planets and starships.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 27, web: 7 },
      tags: ["web"],
      stack: ["React", "Tailwind CSS"],
      links: { live: "https://star-wars-api-femioje.vercel.app/", repo: "https://github.com/FemiOje/star-wars-api" },
      cover: "img/web-dev/star-wars.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Meme Generator", slug: "meme-generator", role: "Author", status: "shipped", years: "2023",
      summary: "A meme generator built to better understand APIs.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 28, web: 8 },
      tags: ["web"],
      stack: ["React"],
      links: { live: "https://meme-generator-femioje.vercel.app/", repo: "https://github.com/FemiOje/meme-generator" },
      cover: "img/web-dev/meme-generator.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Dashboard", slug: "dashboard", role: "Author", status: "shipped", years: "2023",
      summary: "A fully responsive dashboard built with React and Tailwind CSS to practise grids and responsive layouts.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 29, web: 9 },
      tags: ["web"],
      stack: ["React", "Tailwind CSS"],
      links: { live: "https://dashboard-femioje.vercel.app/", repo: "https://github.com/FemiOje/dashboard" },
      cover: "img/web-dev/dashboard.png",
      kind: "web", net: "testnet"
    },
    {
      title: "Metabnb Clone", slug: "metabnb-clone", role: "Author", status: "shipped", years: "2023",
      summary: "HNG Internship stage 3 task.",
      lenses: ["home", "web"], featured_in: [],
      order: { home: 30, web: 10 },
      tags: ["web"],
      stack: ["React", "React Router", "CSS"],
      links: { live: "https://metabnb-clone-oluwafemi.vercel.app/", repo: "https://github.com/FemiOje/metabnb-clone" },
      cover: "img/web-dev/metabnb-clone.png",
      kind: "web", net: "testnet"
    }
  ],

  txs: [
    { id: "aux-feed", date: "2026-10-05", src: "commit", method: "merge", to: "aux", status: "pending", note: "Add feed, Privy sign-in, posting drops and saves (#2)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },
    { id: "agent-sandbox-deploy", date: "2026-10-02", src: "push", method: "deploy", to: "agent-sandbox", note: "Docker sandbox for AI coding agents", url: "https://github.com/FemiOje/agent-sandbox" },
    { id: "aux-setup", date: "2026-09-30", src: "commit", method: "merge", to: "aux", note: "Project setup (#1)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },
    { id: "herit-dashboard", date: "2026-09-12", src: "commit", method: "merge", to: "herit", note: "Dashboard, roadmap page and mobile responsiveness", url: "https://github.com/Kelechikizito/herit/commits?author=FemiOje" },
    { id: "hexed-jam", date: "2026-03-08", src: "commit", method: "submit", to: "hexed", note: "[Submission]: Hex'd (#276) — Dojo game jams", url: "https://github.com/dojoengine/game-jams/pull/276" },
    { id: "scard-jam", date: "2025-12-01", src: "commit", method: "submit", to: "scard", note: "Scar'd project details and gameplay instructions (#190) — Dojo game jams", url: "https://github.com/dojoengine/game-jams/pull/190" },
    { id: "ls2-renderer-push", date: "2025-12-01", src: "push", method: "deploy", to: "ls2-renderer", note: "SVG metadata renderer for Loot Survivor adventurers", url: "https://github.com/FemiOje/ls2-renderer" },
    { id: "dojo-ttt-deploy", date: "2025-04-25", src: "push", method: "deploy", to: "dojo-tic-tac-toe", note: "Tic-tac-toe with Dojo as the backend", url: "https://github.com/FemiOje/dojo_tic-tac-toe" },
    { id: "dungeon-deploy", date: "2025-04-20", src: "push", method: "deploy", to: "dungeon-generator-2d", note: "2D game with a dungeon generator", url: "https://github.com/FemiOje/dungeon-generator-2d" },
    { id: "cryptotracker-merge", date: "2025-04-01", src: "commit", method: "merge", to: "cryptotracker", note: "FAQ search and support pages", url: "https://github.com/QuadlcorE/cryptotracker/commits?author=FemiOje" },
    { id: "bookstore-deploy", date: "2025-03-31", src: "push", method: "deploy", to: "bookstore", note: "Deployed to Starknet Sepolia", url: "https://sepolia.starkscan.co/contract/0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985" },
    { id: "assets-submit", date: "2025-03-31", src: "push", method: "submit", to: "assets-management-system", note: "CSC434 group project", url: "https://github.com/FemiOje/assets-management-system" },
    { id: "dojobyexample-merge", date: "2025-03-23", src: "commit", method: "merge", ext: "AkatsukiLabs/DojoByExample", net: "mainnet", note: "feat: create RewardType enum (#44)", url: "https://github.com/AkatsukiLabs/DojoByExample/pull/44" },
    { id: "registry-frontend-deploy", date: "2025-03-21", src: "push", method: "deploy", to: "student-registry-frontend", note: "Frontend for the registry contract", url: "https://student-registry-frontend.vercel.app/" },
    { id: "registry-contract-deploy", date: "2025-03-20", src: "push", method: "deploy", to: "student-registry-contract", note: "Deployed to Starknet Sepolia", url: "https://sepolia.starkscan.co/contract/0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02" },
    { id: "logistics-deploy", date: "2025-02-26", src: "push", method: "deploy", to: "logistics-dashboard", note: "Real-time shipment tracking dashboard", url: "https://github.com/FemiOje/logistics-company-dashboard" },
    { id: "fish-fest-jam", date: "2025-02-12", src: "push", method: "submit", to: "fish-fest", note: "Fish Fest game jam, team Axolotl", url: "https://femioje.itch.io/fishfest-gamejamnew-build" },
    { id: "daydreams-telegram", date: "2025-01-31", src: "commit", method: "merge", to: "daydreams", note: "Telegram client: login, startup message, chat list scraper", url: "https://github.com/daydreamsai/daydreams/commits?author=FemiOje" },
    { id: "bytebeasts-fix", date: "2024-11-26", src: "commit", method: "merge", ext: "ByteBeasts/ByteBeastsFrontend", net: "mainnet", note: "Bug fix transitions (#149)", url: "https://github.com/ByteBeasts/ByteBeastsFrontend/pull/149" },
    { id: "gida-submit", date: "2024-10-13", src: "push", method: "submit", to: "gida-testing", note: "Week 6, GIDA × Starknet Cairo bootcamp", url: "https://github.com/FemiOje/gida-starknet-testing-session-3" },
    { id: "adventure-jam", date: "2024-09-04", src: "push", method: "submit", to: "adventure-of-the-thing", note: "2024 Scripto Game Jam", url: "https://femioje.itch.io/adventure-of-the-thing" },
    { id: "racing-deploy", date: "2024-05-01", src: "push", method: "deploy", to: "multiplayer-racing", note: "3D multiplayer racing game", url: "https://github.com/FemiOje/Multiplayer-Racing" },
    { id: "collegiate-jam", date: "2024-03-29", src: "push", method: "submit", to: "collegiate-game-jam-2024", note: "2024 Collegiate Game Jam — theme: Out of Order", url: "https://github.com/FemiOje/2024-Collegiate-Game-Jam" },
    { id: "minecraft-jam", date: "2023-12-26", src: "push", method: "submit", to: "minecraft-femi", note: "Dojo Game Jam", url: "https://github.com/FemiOje/Minecraft-Femi" },
    { id: "dining-deploy", date: "2023-12-12", src: "push", method: "deploy", to: "dining-philosophers", note: "Dining Philosophers in Java", url: "https://github.com/FemiOje/Dining-Philosophers-Problem-Java" },
    { id: "parking-jam", date: "2023-12-08", src: "push", method: "submit", to: "parking-simulator", note: "Maliyo Games Game Jam 2023", url: "https://github.com/FemiOje/Parking-Simulator" },
    { id: "pong-deploy", date: "2023-10-19", src: "push", method: "deploy", to: "pong-clone", note: "Clone of the classic", url: "https://femioje.itch.io/pong-clone" },
    { id: "star-wars-deploy", date: "2023-07-06", src: "push", method: "deploy", to: "star-wars-api", note: "Star Wars API browser", url: "https://star-wars-api-femioje.vercel.app/" },
    { id: "meme-deploy", date: "2023-06-24", src: "push", method: "deploy", to: "meme-generator", note: "Meme generator", url: "https://meme-generator-femioje.vercel.app/" },
    { id: "dashboard-deploy", date: "2023-06-02", src: "push", method: "deploy", to: "dashboard", note: "Responsive dashboard", url: "https://dashboard-femioje.vercel.app/" },
    { id: "penito-deploy", date: "2023-02-15", src: "push", method: "deploy", to: "penito-furniture", note: "Furniture shopping app", url: "https://penito-furniture.netlify.app/" },
    { id: "metabnb-submit", date: "2023-01-08", src: "push", method: "submit", to: "metabnb-clone", note: "HNG Internship stage 3", url: "https://metabnb-clone-oluwafemi.vercel.app/" }
  ]
};
