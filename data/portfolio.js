/* The whole site renders from this file. Edit data here; never hand-edit HTML.
   Every entry must be traceable to a real repo, PR, or live URL — see SKILL.md "Rules".

   A project (called a "contract" here, after the blockchain world) appears in each world named in `tracks`:
     "game"  → a tile on the fog-of-war hex map
     "chain" → a contract on the block explorer
     "web"   → a tab in the browser window
   tracks: [] puts it in the hub's "Also" list only.
   tx = something that happened to a project.  block = a month (derived).
   net: "mainnet" = shipped / professional / open-source work.  "testnet" = coursework, bootcamps, learning.
   tx.src says where the date came from: "push" (GitHub last-push date) or "commit" (dated upstream commit). */
window.PORTFOLIO = {
  site: { name: "jinius", chain: "jinius", scan: "jiniusscan", asOf: "2026-10-05" },

  owner: {
    handle: "jinius",
    name: "Femi Ojetokun",
    role: "Software engineer",
    bio: "Interested and actively building in web development, blockchain development and game development.",
    greeting: "Ohayo 👋",
    links: [
      { label: "GitHub", url: "https://github.com/FemiOje" },
      { label: "X / Twitter", url: "https://x.com/0xjinius" },
      { label: "itch.io", url: "https://femioje.itch.io" },
      { label: "Email", url: "mailto:0xjinius@gmail.com" }
    ],
    /* Language of each original (non-fork) public repo on GitHub, counted on site.asOf. */
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

  contracts: [
    /* ───────────── mainnet ───────────── */
    {
      id: "hexed", tracks: ["game", "chain"], name: "Hex'd", kind: "game", net: "mainnet", role: "author", featured: true,
      summary: "A fully onchain asynchronous battle royale with fog of war. Players cross a hex grid where every empty tile is a gift or a curse, and walking into another player resolves combat by XP. All logic, state and randomness live on Starknet through Dojo; the client is a playable 3D board.",
      stack: ["Cairo", "Dojo", "Starknet", "React", "Three.js", "Cartridge Controller"],
      repo: "https://github.com/FemiOje/hexed",
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
      id: "herit", tracks: ["chain"], name: "herit", kind: "dapp", net: "mainnet", role: "contributor", featured: true,
      upstream: "Kelechikizito/herit",
      summary: "An onchain inheritance platform built on ENSv2 subnames and World ID: if an owner is no longer alive, their heirs gain access. Took first place for Best Use of ENSv2 at ETHOnline 2026.",
      stack: ["TypeScript", "ENSv2", "World ID"],
      repo: "https://github.com/Kelechikizito/herit",
      facts: [
        { k: "award", v: "1st place, Best Use of ENSv2 — ETHOnline 2026" },
        { k: "my_commits_upstream", v: "28, between 2026-09-05 and 2026-09-12" }
      ]
    },
    {
      id: "ls2-renderer", tracks: ["chain"], name: "Death Mountain Renderer", kind: "contract", net: "mainnet", role: "fork", featured: true,
      upstream: "Provable-Games/death-mountain-renderer",
      summary: "A Cairo contract that renders Loot Survivor adventurers as dynamic SVG NFT metadata: health bars coloured by remaining health, equipment icons, level and stats, all generated onchain and returned as Base64-encoded JSON.",
      stack: ["Cairo", "Starknet", "SVG"],
      repo: "https://github.com/FemiOje/ls2-renderer",
      facts: [
        { k: "entry_points", v: "game_details(), token_description(), game_details_svg()" },
        { k: "output", v: "Base64 JSON metadata with embedded SVG" }
      ]
    },
    {
      id: "aux", tracks: ["web"], name: "aux", kind: "web", net: "mainnet", role: "contributor",
      upstream: "Kelechikizito/aux",
      summary: "For the audiophiles looking for niche music, the music nerds looking to be put on, and the hobbyists looking to refresh their taste.",
      stack: ["TypeScript", "Privy"],
      repo: "https://github.com/Kelechikizito/aux"
    },
    {
      id: "agent-sandbox", tracks: [], name: "agent-sandbox", kind: "tool", net: "mainnet", role: "author", featured: true,
      summary: "A Docker sandbox that lets AI coding agents work on a project without access to your computer. Outgoing traffic is denied by default and unknown sites wait for approval; the agent runs unprivileged with every Linux capability removed; no host files are mounted.",
      stack: ["Shell", "Docker", "iptables", "Foundry"],
      repo: "https://github.com/FemiOje/agent-sandbox",
      facts: [
        { k: "self_test", v: "55 checks via ./sandbox test, also run in GitHub Actions" },
        { k: "network_policy", v: "default deny, approval proxy" },
        { k: "agent_user", v: "uid 1000, no capabilities, no_new_privs" }
      ]
    },
    {
      id: "thesis-drl-portfolio", tracks: [], name: "RL for Portfolio Management", kind: "research", net: "mainnet", role: "author", featured: true,
      summary: "B.Sc. Computer Science final-year project, University of Lagos. A controlled comparison of three continuous-action deep RL algorithms — Policy Gradient, PPO and DDPG — on an eight-asset S&P 500 portfolio under transaction costs, where only the learning rule is allowed to differ.",
      stack: ["Python", "Deep RL", "PPO", "DDPG"],
      repo: "https://github.com/FemiOje/thesis-drl-portfolio",
      facts: [
        { k: "universe", v: "8 assets, one per GICS sector" },
        { k: "data", v: "daily OHLC, 2021-08-25 to 2026-08-24" },
        { k: "split", v: "60 / 20 / 20 chronological; test scored once" },
        { k: "commission", v: "10 bps per trade" }
      ]
    },
    {
      id: "scard", tracks: ["game", "chain"], name: "Scar'd", kind: "game", net: "mainnet", role: "author",
      summary: "A game submitted to the Dojo game jams.",
      stack: ["TypeScript", "Dojo"],
      repo: "https://github.com/FemiOje/scard"
    },
    {
      id: "daydreams", tracks: ["chain"], name: "daydreams", kind: "tool", net: "mainnet", role: "contributor",
      upstream: "daydreamsai/daydreams",
      summary: "A generative agent framework for executing anything onchain. Contributed work on its Telegram client.",
      stack: ["TypeScript"],
      repo: "https://github.com/daydreamsai/daydreams",
      facts: [{ k: "my_commits_upstream", v: "11, between 2025-01-29 and 2025-01-31" }]
    },
    {
      id: "dojo-tic-tac-toe", tracks: ["game", "chain"], name: "Dojo Tic-Tac-Toe", kind: "game", net: "mainnet", role: "author",
      summary: "The classic game with Dojo as the backend: two players join, turns and the eight winning lines are enforced by the contract.",
      stack: ["Cairo", "Dojo", "TypeScript"],
      repo: "https://github.com/FemiOje/dojo_tic-tac-toe"
    },
    {
      id: "fish-fest", tracks: ["game"], name: "FishFest", kind: "game", net: "mainnet", role: "author", featured: true,
      summary: "A 2D underwater casual endless runner, built for the Fish Fest game jam by team Axolotl.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Fish-Fest-Game-Jam",
      live: "https://femioje.itch.io/fishfest-gamejamnew-build",
      image: "img/game-dev/fishfest_gamejam.png"
    },
    {
      id: "adventure-of-the-thing", tracks: ["game"], name: "Adventure of the Thing", kind: "game", net: "mainnet", role: "author",
      summary: "A 2D adventure game with combat physics. Submission for the 2024 Scripto Game Jam.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Adventure-of-the-Thing",
      live: "https://femioje.itch.io/adventure-of-the-thing",
      image: "img/game-dev/adventure-of-the-thing.png"
    },
    {
      id: "dungeon-generator-2d", tracks: ["game"], name: "Dungeon Generator 2D", kind: "game", net: "mainnet", role: "author",
      summary: "A 2D game built around a dungeon generator.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/dungeon-generator-2d"
    },
    {
      id: "multiplayer-racing", tracks: ["game"], name: "Multiplayer Racing", kind: "game", net: "mainnet", role: "author",
      summary: "A 3D multiplayer racing game built with Unity.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Multiplayer-Racing"
    },
    {
      id: "collegiate-game-jam-2024", tracks: ["game"], name: "Collegiate Game Jam 2024", kind: "game", net: "mainnet", role: "author",
      summary: "Entry for the 2024 Collegiate Game Jam hosted by UNC Game Dev. Theme: Out of Order.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/2024-Collegiate-Game-Jam"
    },
    {
      id: "minecraft-femi", tracks: ["game"], name: "Minecraft-Femi", kind: "game", net: "mainnet", role: "author",
      summary: "Dojo Game Jam submission.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Minecraft-Femi"
    },
    {
      id: "parking-simulator", tracks: ["game"], name: "Parking Simulator", kind: "game", net: "mainnet", role: "author",
      summary: "Submission for the Maliyo Games Game Jam 2023.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Parking-Simulator"
    },
    {
      id: "penito-furniture", tracks: ["web"], name: "Penito Furniture", kind: "web", net: "mainnet", role: "author",
      summary: "A furniture shopping app built with React, React Router, Redux Toolkit and localStorage.",
      stack: ["React", "Redux Toolkit", "React Router"],
      repo: "https://github.com/FemiOje/penitoFurniture",
      live: "https://penito-furniture.netlify.app/",
      image: "img/web-dev/penito-furniture.png"
    },

    /* ───────────── testnet ───────────── */
    {
      id: "student-registry-contract", tracks: ["chain"], name: "Student Registry Contract", kind: "contract", net: "testnet", role: "author",
      summary: "A Cairo contract that maintains student records on Starknet.",
      stack: ["Cairo", "Scarb", "Snforge", "Starkli"],
      repo: "https://github.com/FemiOje/student_registry_contract",
      image: "img/smart-contracts/student-registry-contract.png",
      onchain: {
        network: "Starknet Sepolia",
        address: "0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02",
        url: "https://sepolia.starkscan.co/contract/0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02"
      }
    },
    {
      id: "student-registry-frontend", tracks: ["web", "chain"], name: "Student Registry Frontend", kind: "web", net: "testnet", role: "author",
      summary: "The interface for reading and updating student records on the registry contract.",
      stack: ["React", "TypeScript", "Tailwind CSS", "Starknet-React"],
      repo: "https://github.com/FemiOje/student-registry-frontend",
      live: "https://student-registry-frontend.vercel.app/",
      image: "img/smart-contracts/student-registry-frontend.png"
    },
    {
      id: "bookstore", tracks: ["chain"], name: "Bookstore Contract", kind: "contract", net: "testnet", role: "author",
      summary: "A Cairo contract that maintains book records on Starknet.",
      stack: ["Cairo", "Scarb", "Snforge", "Starkli"],
      repo: "https://github.com/FemiOje/bookstore",
      image: "img/smart-contracts/bookstore-contract.png",
      onchain: {
        network: "Starknet Sepolia",
        address: "0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985",
        url: "https://sepolia.starkscan.co/contract/0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985"
      }
    },
    {
      id: "gida-testing", tracks: ["chain"], name: "GIDA × Starknet Testing", kind: "contract", net: "testnet", role: "author",
      summary: "Week 6 assignment of the GIDA × Starknet Cairo bootcamp.",
      stack: ["Cairo"],
      repo: "https://github.com/FemiOje/gida-starknet-testing-session-3"
    },
    {
      id: "cryptotracker", tracks: ["web"], name: "CryptoTracker", kind: "web", net: "testnet", role: "contributor",
      upstream: "QuadlcorE/cryptotracker",
      summary: "A group assignment: a website for reviewing data and information on crypto.",
      stack: ["Next.js", "Tailwind CSS", "CoinGecko API"],
      repo: "https://github.com/QuadlcorE/cryptotracker",
      live: "https://cryptotracker-hazel.vercel.app/",
      image: "img/school/crypto-tracker.png",
      facts: [{ k: "my_commits_upstream", v: "13, between 2025-02-27 and 2025-04-01" }]
    },
    {
      id: "assets-management-system", tracks: ["web"], name: "Assets Management System", kind: "web", net: "testnet", role: "author",
      summary: "CSC434 group project: employees request and track office items, with records of assigned assets.",
      stack: ["PHP", "MySQL", "HTML", "CSS"],
      repo: "https://github.com/FemiOje/assets-management-system",
      image: "img/school/assets-management-system.png"
    },
    {
      id: "logistics-dashboard", tracks: ["web"], name: "Logistics Company Dashboard", kind: "web", net: "testnet", role: "author",
      summary: "A responsive, interactive dashboard for a logistics company to track shipments in real time.",
      stack: ["React", "TypeScript", "WebSockets", "Jest"],
      repo: "https://github.com/FemiOje/logistics-company-dashboard",
      image: "img/school/logistics-dashboard.png"
    },
    {
      id: "dining-philosophers", tracks: [], name: "Dining Philosophers", kind: "tool", net: "testnet", role: "author",
      summary: "Solving the Dining Philosophers problem in Java.",
      stack: ["Java"],
      repo: "https://github.com/FemiOje/Dining-Philosophers-Problem-Java"
    },
    {
      id: "pong-clone", tracks: ["game"], name: "Pong Clone", kind: "game", net: "testnet", role: "author",
      summary: "A clone of the classic Pong.",
      stack: ["Unity", "C#"],
      repo: "https://github.com/FemiOje/Pong-Clone",
      live: "https://femioje.itch.io/pong-clone",
      image: "img/game-dev/pong-clone.png"
    },
    {
      id: "star-wars-api", tracks: ["web"], name: "Star Wars API", kind: "web", net: "testnet", role: "author",
      summary: "A site built on the Star Wars API that displays characters, films, planets and starships.",
      stack: ["React", "Tailwind CSS"],
      repo: "https://github.com/FemiOje/star-wars-api",
      live: "https://star-wars-api-femioje.vercel.app/",
      image: "img/web-dev/star-wars.png"
    },
    {
      id: "meme-generator", tracks: ["web"], name: "Meme Generator", kind: "web", net: "testnet", role: "author",
      summary: "A meme generator built to better understand APIs.",
      stack: ["React"],
      repo: "https://github.com/FemiOje/meme-generator",
      live: "https://meme-generator-femioje.vercel.app/",
      image: "img/web-dev/meme-generator.png"
    },
    {
      id: "dashboard", tracks: ["web"], name: "Dashboard", kind: "web", net: "testnet", role: "author",
      summary: "A fully responsive dashboard built with React and Tailwind CSS to practise grids and responsive layouts.",
      stack: ["React", "Tailwind CSS"],
      repo: "https://github.com/FemiOje/dashboard",
      live: "https://dashboard-femioje.vercel.app/",
      image: "img/web-dev/dashboard.png"
    },
    {
      id: "metabnb-clone", tracks: ["web"], name: "Metabnb Clone", kind: "web", net: "testnet", role: "author",
      summary: "HNG Internship stage 3 task.",
      stack: ["React", "React Router", "CSS"],
      repo: "https://github.com/FemiOje/metabnb-clone",
      live: "https://metabnb-clone-oluwafemi.vercel.app/",
      image: "img/web-dev/metabnb-clone.png"
    }
  ],

  txs: [
    /* status "pending" puts a tx in the mempool (work in progress) instead of a block. */
    { id: "aux-feed", date: "2026-10-05", src: "commit", method: "merge", to: "aux", status: "pending",
      note: "Add feed, Privy sign-in, posting drops and saves (#2)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },

    { id: "agent-sandbox-deploy", date: "2026-10-02", src: "push", method: "deploy", to: "agent-sandbox",
      note: "Docker sandbox for AI coding agents", url: "https://github.com/FemiOje/agent-sandbox" },
    { id: "aux-setup", date: "2026-09-30", src: "commit", method: "merge", to: "aux",
      note: "Project setup (#1)", url: "https://github.com/Kelechikizito/aux/commits?author=FemiOje" },
    { id: "herit-dashboard", date: "2026-09-12", src: "commit", method: "merge", to: "herit",
      note: "Dashboard, roadmap page and mobile responsiveness", url: "https://github.com/Kelechikizito/herit/commits?author=FemiOje" },
    { id: "thesis-deploy", date: "2026-08-30", src: "push", method: "publish", to: "thesis-drl-portfolio",
      note: "PG vs PPO vs DDPG on an eight-asset portfolio", url: "https://github.com/FemiOje/thesis-drl-portfolio" },
    { id: "hexed-jam", date: "2026-03-08", src: "commit", method: "submit", to: "hexed",
      note: "[Submission]: Hex'd (#276) — Dojo game jams", url: "https://github.com/dojoengine/game-jams/pull/276" },
    { id: "scard-jam", date: "2025-12-01", src: "commit", method: "submit", to: "scard",
      note: "Scar'd project details and gameplay instructions (#190) — Dojo game jams", url: "https://github.com/dojoengine/game-jams/pull/190" },
    { id: "ls2-renderer-push", date: "2025-12-01", src: "push", method: "deploy", to: "ls2-renderer",
      note: "SVG metadata renderer for Loot Survivor adventurers", url: "https://github.com/FemiOje/ls2-renderer" },
    { id: "dojo-ttt-deploy", date: "2025-04-25", src: "push", method: "deploy", to: "dojo-tic-tac-toe",
      note: "Tic-tac-toe with Dojo as the backend", url: "https://github.com/FemiOje/dojo_tic-tac-toe" },
    { id: "dungeon-deploy", date: "2025-04-20", src: "push", method: "deploy", to: "dungeon-generator-2d",
      note: "2D game with a dungeon generator", url: "https://github.com/FemiOje/dungeon-generator-2d" },
    { id: "cryptotracker-merge", date: "2025-04-01", src: "commit", method: "merge", to: "cryptotracker",
      note: "FAQ search and support pages", url: "https://github.com/QuadlcorE/cryptotracker/commits?author=FemiOje" },
    { id: "bookstore-deploy", date: "2025-03-31", src: "push", method: "deploy", to: "bookstore",
      note: "Deployed to Starknet Sepolia", url: "https://sepolia.starkscan.co/contract/0x03af4bd17d75ded7eb9322a3d5dfbcc76310498dd53827b88ca40d38d9512985" },
    { id: "assets-submit", date: "2025-03-31", src: "push", method: "submit", to: "assets-management-system",
      note: "CSC434 group project", url: "https://github.com/FemiOje/assets-management-system" },
    { id: "dojobyexample-merge", date: "2025-03-23", src: "commit", method: "merge", ext: "AkatsukiLabs/DojoByExample", net: "mainnet",
      note: "feat: create RewardType enum (#44)", url: "https://github.com/AkatsukiLabs/DojoByExample/pull/44" },
    { id: "registry-frontend-deploy", date: "2025-03-21", src: "push", method: "deploy", to: "student-registry-frontend",
      note: "Frontend for the registry contract", url: "https://student-registry-frontend.vercel.app/" },
    { id: "registry-contract-deploy", date: "2025-03-20", src: "push", method: "deploy", to: "student-registry-contract",
      note: "Deployed to Starknet Sepolia", url: "https://sepolia.starkscan.co/contract/0x079862ff1faa276c4d398e0dcaedc63245f289ad3099e84c9e3d6fdd40d5bf02" },
    { id: "logistics-deploy", date: "2025-02-26", src: "push", method: "deploy", to: "logistics-dashboard",
      note: "Real-time shipment tracking dashboard", url: "https://github.com/FemiOje/logistics-company-dashboard" },
    { id: "fish-fest-jam", date: "2025-02-12", src: "push", method: "submit", to: "fish-fest",
      note: "Fish Fest game jam, team Axolotl", url: "https://femioje.itch.io/fishfest-gamejamnew-build" },
    { id: "daydreams-telegram", date: "2025-01-31", src: "commit", method: "merge", to: "daydreams",
      note: "Telegram client: login, startup message, chat list scraper", url: "https://github.com/daydreamsai/daydreams/commits?author=FemiOje" },
    { id: "bytebeasts-fix", date: "2024-11-26", src: "commit", method: "merge", ext: "ByteBeasts/ByteBeastsFrontend", net: "mainnet",
      note: "Bug fix transitions (#149)", url: "https://github.com/ByteBeasts/ByteBeastsFrontend/pull/149" },
    { id: "gida-submit", date: "2024-10-13", src: "push", method: "submit", to: "gida-testing",
      note: "Week 6, GIDA × Starknet Cairo bootcamp", url: "https://github.com/FemiOje/gida-starknet-testing-session-3" },
    { id: "adventure-jam", date: "2024-09-04", src: "push", method: "submit", to: "adventure-of-the-thing",
      note: "2024 Scripto Game Jam", url: "https://femioje.itch.io/adventure-of-the-thing" },
    { id: "racing-deploy", date: "2024-05-01", src: "push", method: "deploy", to: "multiplayer-racing",
      note: "3D multiplayer racing game", url: "https://github.com/FemiOje/Multiplayer-Racing" },
    { id: "collegiate-jam", date: "2024-03-29", src: "push", method: "submit", to: "collegiate-game-jam-2024",
      note: "2024 Collegiate Game Jam — theme: Out of Order", url: "https://github.com/FemiOje/2024-Collegiate-Game-Jam" },
    { id: "minecraft-jam", date: "2023-12-26", src: "push", method: "submit", to: "minecraft-femi",
      note: "Dojo Game Jam", url: "https://github.com/FemiOje/Minecraft-Femi" },
    { id: "dining-deploy", date: "2023-12-12", src: "push", method: "deploy", to: "dining-philosophers",
      note: "Dining Philosophers in Java", url: "https://github.com/FemiOje/Dining-Philosophers-Problem-Java" },
    { id: "parking-jam", date: "2023-12-08", src: "push", method: "submit", to: "parking-simulator",
      note: "Maliyo Games Game Jam 2023", url: "https://github.com/FemiOje/Parking-Simulator" },
    { id: "pong-deploy", date: "2023-10-19", src: "push", method: "deploy", to: "pong-clone",
      note: "Clone of the classic", url: "https://femioje.itch.io/pong-clone" },
    { id: "star-wars-deploy", date: "2023-07-06", src: "push", method: "deploy", to: "star-wars-api",
      note: "Star Wars API browser", url: "https://star-wars-api-femioje.vercel.app/" },
    { id: "meme-deploy", date: "2023-06-24", src: "push", method: "deploy", to: "meme-generator",
      note: "Meme generator", url: "https://meme-generator-femioje.vercel.app/" },
    { id: "dashboard-deploy", date: "2023-06-02", src: "push", method: "deploy", to: "dashboard",
      note: "Responsive dashboard", url: "https://dashboard-femioje.vercel.app/" },
    { id: "penito-deploy", date: "2023-02-15", src: "push", method: "deploy", to: "penito-furniture",
      note: "Furniture shopping app", url: "https://penito-furniture.netlify.app/" },
    { id: "metabnb-submit", date: "2023-01-08", src: "push", method: "submit", to: "metabnb-clone",
      note: "HNG Internship stage 3", url: "https://metabnb-clone-oluwafemi.vercel.app/" }
  ]
};
