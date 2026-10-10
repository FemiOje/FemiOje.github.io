# Design Guidelines — Whitepaper + Ledger (blockchain lens)

## Visual Style
- **Aesthetic**: The page is set as a scientific paper — centred title block, author line, abstract, keywords, §-numbered sections, sidenotes in the margin, booktabs tables, numbered figures, one display equation, references — and it carries a working **ledger**: work history as a SHA-256 hash chain in monospace that visitors can verify in the browser. Cool white paper, black ink, one accent that only ever means "confirmed"
- **Mood**: Rigorous, calm, credible — a paper you would cite, written by someone who checks their work. Quiet until you ask it to prove something, then it proves it
- **Inspiration**: Donald Knuth's TeX and Computer Modern; the LaTeX `article` class (title block, abstract environment, `\section` numbering, `definition` environment); Simon Fear's booktabs rules; Edward Tufte's sidenotes; the whitepaper as the founding document of the industry; double-entry ledgers and block explorers (as genres — no specific product's look); on the web, LaTeX.css (MIT)
- **Lens**: This is the **blockchain** lens (route `/blockchain`) of Femi Ojetokun's portfolio — it speaks to protocol teams, onchain game studios and crypto companies hiring a smart-contract / onchain engineer. It must feel clearly different from the other three: home (`/`, Ma) is warm washi and air; web (`/web`, Swiss) is loud blue fields; games (`/games`, Braun) is cream hardware with an orange dial. This lens is **cool white, black ink, dense, typeset and verifiable**

## Color Palette
- **Paper**: `#FCFCFA` — cool near-white page background. Never washi cream (home lens), never pure white
- **Ledger**: `#F2F2EE` — ledger row hover and the "linked parent block" highlight
- **Code**: `#F5F5F1` — code-figure background
- **Desk**: `#E9E9E4` — behind the paper sheet in the "Sheet on desk" option only. **No text on it** (faint ink fails at 4.2:1)
- **Ink**: `#141414` — all primary text, booktabs rules, button borders, primary button fill (17.9:1 on paper). Never pure black
- **Ink-soft**: `#4F4F4B` — bylines, affiliation, labels, sidenotes, table headers (8.0:1 on paper)
- **Ink-faint**: `#6E6E69` — sidenote numbers and small meta only, on paper / ledger / code (≥ 4.6:1)
- **Rule**: `#CFCFC8` — 1px hairlines between papers, under the running head, around figures (decorative)
- **Rule-strong**: `#8A8A84` — link underlines and non-text UI edges (3.4:1)
- **Confirm (the one accent)**: `#1F6B45` green (6.3:1 on paper) — options: oxblood `#8E2A1F` (8.2:1) or ink only. It appears **only** on ✓ ticks and "chain valid" after verification, the status dot of a live/deployed project, the focus ring, and the `[ ]` brackets around the current lens
- **No other colour.** No blues (that's the web lens), no orange (games), no vermilion (home), no gradients, no colour syntax highlighting. A page with nothing verified and nothing live has no colour at all — that is correct

## Typography
- **Text face**: **Latin Modern Roman** (GUST e-foundry, GUST Font License) — the LaTeX face — 400, 400 italic, 700, 700 italic, self-hosted from the woff2 files in the latex.css package. Option: **STIX Two Text** (SIL OFL), the scientific-journal face. Fallback: `'Times New Roman', serif`
- **Mono face**: **IBM Plex Mono** (SIL OFL 1.1) 400/500 (600 for code keywords) — ledger, hashes, labels, running head, buttons, code. Fallback: `ui-monospace, Menlo, monospace`
- **Math**: native MathML in **Latin Modern Math** or **STIX Two Math**, fallback `math`
- **Title (h1)**: weight **400** (LaTeX `\title` is not bold), `clamp(32px, 4.8vw, 52px)`, `line-height: 1.15`, max 18ch, centred, `text-wrap: balance`
- **Section heads (h2)**: weight 700, 26px, `line-height: 1.25`, number + 1em gap + title ("2  Selected papers")
- **Paper titles (h3)**: weight 700, 20px, number + title ("2.1  [Project]")
- **Authors**: 20px · **Affiliation**: 16px italic ink-soft · **Date**: 16px ink-soft
- **Abstract**: label "Abstract" 15px bold centred; body 16px / 1.5, 34rem wide
- **Body**: 18px / 1.55 (Latin Modern runs small and thin on screens — don't go below 17px), justified with `hyphens: auto` at ≥ 640px, ragged below; `text-wrap: pretty`; ligatures on
- **Captions**: 15px; "Figure n:" / "Table n:" in bold
- **Sidenotes**: 14px / 1.45 ink-soft; mono number 12px ink-faint
- **Mono UI**: 13px, lowercase, `tabular-nums`; code 13.5px / 1.6
- **Case**: headings in sentence case; mono labels, nav, buttons and meta lowercase; never uppercase
- **Bold** only where LaTeX uses it (section/subsection heads, Abstract, Figure/Table labels, Definition labels). *Italics* for emphasis, affiliation, bylines, venue names
- **Alignment**: title block centred (paper convention); everything else flush-left
- **Numbering** (all in page order): sections 1–5, papers 2.1, 2.2…, figures 1, 2…, tables 1, 2…, equation (1), sidenotes 1, 2… Abstract and References are unnumbered

## Spacing & Layout
- **Columns**: one prose column (`--measure: 40rem`) + `3rem` gap + a `15rem` margin column, total container `58rem` + side padding `clamp(20px, 5vw, 48px)`. Sections sit left-aligned in the container; the margin column holds sidenotes
- **Wide elements** (code figures, the ledger) may span text + margin (`.wide`), like LaTeX `figure*`
- **Page rhythm** (top → bottom): sticky running head → title block (title, authors, abstract, keywords, equation (1), actions) → §1 Introduction → §2 Selected papers → §3 The ledger → §4 Methods → §5 Correspondence → References → colophon
- **Section padding**: `clamp(64px, 8vw, 112px)` above each section; title block `clamp(56px, 9vw, 120px)` top, `clamp(40px, 6vw, 72px)` bottom
- **Papers**: 36px vertical padding, separated by a 1px hairline
- **Base unit**: 4px; common gaps 8 / 12 / 20 / 28 / 36 / 44px
- **Breakpoints**: < 640px ragged text, ledger rows stack; 640–1099px justified text, sidenotes open on tap; ≥ 1100px sidenotes float in the margin
- **Mobile**: single column; sidenotes become tap-to-open notes under their paragraph; ledger rows stack (entry + ✓, height + date, hash, prev); code figures and the ledger scroll horizontally inside their own wrappers, never the page

## Borders & Radius
- **Border radius**: **`0` everywhere.** The only round thing is the 7px status dot
- **booktabs rules**: `2px solid ink` above and below every table, code figure and `.record` list (`\toprule` / `\bottomrule`); `1px solid ink` under table headers and code (`\midrule`)
- **Hairlines**: `1px solid #CFCFC8` under the running head, between papers, above the colophon, sidenote left edge on mobile, screenshot frames
- No vertical rules in tables — ever (booktabs rule)

## Shadows & Elevation
- **None.** No box-shadow, no blur, no glass, no gradients, no glow. Hierarchy comes from type, numbering and rules. The "Sheet on desk" option uses a hairline edge, not a shadow

## Buttons
- **Mono, square, lowercase**: IBM Plex Mono 500, 13px, `min-height: 44px`, `padding: 0 16px`, `1px solid ink`, radius 0
- **Primary**: ink fill, paper text ("read the papers ↓", "verify chain"); hover ink-soft fill
- **Secondary**: transparent, ink border and text ("verify the ledger", "cite"); hover ledger-tone fill
- **Disabled** (while verifying): `opacity: .7`, `cursor: progress`
- **Text links**: ink, 1px underline in rule-strong, offset 3px; hover underline turns ink. External links end in ↗
- No accent on buttons, ever. No icons inside buttons except ↓ and →

## Icons
- **No icon set.** Only typographic glyphs: ✓ (verified), ✕ (failed), ↗ (external), → (internal), ↓ (scroll), § (section), `[ ]` (current lens)
- Never chain-link icons, wallet icons, token/chain logos (including the Ethereum or Bitcoin marks), coins, cubes or rockets

## Components Spotted
- **Running head** (sticky, mono 13px, hairline below): `f. ojetokun — onchain systems` left · lens switcher centre · current section (`§2 selected papers`) + `lagos HH:MM` (+ optional `block #…`) right
- **Lens switcher**: four lowercase mono links — `home`, `web`, `games`, `blockchain` — the current one shown as `[blockchain]` with accent brackets, ink text and `aria-current="page"`; others ink-soft
- **Title block**: kicker `working paper · v2026.10` (version = build month), title ("Contracts you can read, interfaces you can trust."), author with sidenote ¹ (correspondence), italic affiliation (`University of Lagos · Lagos, Nigeria`), build month, abstract, keywords, equation (1) `Hₙ = SHA-256(Hₙ₋₁ ∥ eₙ)` with its number at the right edge, actions (`read the papers ↓` primary, `verify the ledger` secondary)
- **Section heading**: number + title, bold, flush-left; `data-section` drives the running head
- **Sidenote**: superscript number in the text; the note floats into the margin at ≥ 1100px, opens on tap below, stays inline without JS
- **Paper** (project): mono label `paper 2.1 · ● deployed · mainnet` (dot green only if live), numbered title, italic byline (authors · year · role), **Abstract.** paragraph, one code figure, a booktabs `.record` list (chain, status, stack, contracts), links row (`code ↗`, `deployment ↗`, `read the paper →`, `cite`)
- **Code figure**: booktabs-ruled block on the code tone, monochrome highlighting (keywords 600, comments italic ink-soft), ≤ 18 real lines, caption below ("**Figure 1:** `Contract.sol` — …")
- **The ledger (Table 1)**: caption above, columns `height · hash · prev · date · entry · ✓`, newest first, hashes shown as `0x1a2b3c…9f0e`. Blocks are, oldest to newest: roles (one per position), notable open-source contributions, and projects (shipped or in progress) — only entries that exist in the content collections, each tagged with its kind (`role`, `contribution`, `project`). Genesis is the earliest entry with `prev` = 64 zeros. Below the verify row sits **Figure 2: `chain.js`**, the real build code that writes the table
- **Verify chain**: recomputes every block's SHA-256 in the browser from genesis upward, ticks each row ✓ (90ms apart), then reports `chain valid · n blocks` in green — or ✕ and `chain broken`. Hovering a row highlights its parent block
- **Cite**: copies a BibTeX `@misc` entry for the portfolio or a project; announces "copied" via a live region; falls back to showing the BibTeX on the page
- **Definitions (§4)**: up to three `Definition 4.n (Topic).` blocks, then **Table 2** (tools by layer) in booktabs
- **Correspondence (§5)**: one-line invitation and a booktabs `.record` list (email, github, ENS if supplied)
- **References**: numbered `[1]` list, hanging numbers in ink-soft; inline `[1]` markers link to it
- **Colophon** (mono, hairline above): `typeset in latin modern & ibm plex mono · build [git sha]` left, `— 1 —` right (+ shortcuts off switch when that option is on)
- **Project detail page** (`/blockchain/[slug]`): the full paper — title block for the project (authors, date, abstract), its sections from the MDX body, figures, a deployment record table, references and a cite button

## Imagery & Illustration
- Project screenshots (when supplied) appear only as **numbered Figures with captions**, square-cornered, 1px hairline frame, never device mockups, never decorative
- The equation, the ledger and the code figures **are** the illustration. No illustrations, 3D, emoji, stock imagery, background patterns or decorative hex strings
- Diagrams (e.g. contract architecture), if Femi supplies one, are drawn as thin black line art on paper and captioned as a Figure

## Overall Replication Notes
Key things an AI coding tool must know to nail this style:

- **It's a paper, not a crypto landing page.** Title block, abstract, numbered sections, sidenotes, booktabs, references. No neon, no gradients, no dark mode "web3" look, no wallet buttons
- **Everything on the page is true and checkable.** The ledger's hashes are real SHA-256 computed at build time; "verify chain" proves it in the browser. Never `Math.random()` hashes, never invented transactions, addresses, stats or clients — use `[placeholders]` per AGENTS.md
- **Match the approved mockup** ("blockchain — whitepaper + ledger" on the Portfolio Homepage canvas). Its Tweaks "tamper" switch exists only to demo a failed verification — never ship it
- **Equation (1) is load-bearing.** It must state exactly the rule `buildChain()` and the verify script use (`prev|slug|date|title` → SHA-256). Call it SHA-256 — never keccak
- **One accent, and it means "confirmed".** Green only on ✓, "chain valid", the live dot, the focus ring and the current-lens brackets. A fresh page is black and white
- **Two typefaces with fixed jobs**: Latin Modern for reading (prose, headings, captions), IBM Plex Mono for data and UI (ledger, labels, buttons, code). Bold only where LaTeX would use it
- **booktabs, radius 0, no shadows.** Heavy rules top and bottom, light rule under headers, no vertical rules, no boxes
- **The margin column is part of the design**: 40rem text + 15rem margin at ≥ 1100px; sidenotes live there. Below that, notes open on tap and the page is still complete with JS off
- **Distinct from the other lenses**: cool white not cream, black not blue, serif + mono not grotesque, dense not airy
- **Motion is minimal**: the ledger ticks on verify (90ms per block), UI 140ms, page crossfade 180ms; nothing scrolls, types or counts; all off under reduced motion