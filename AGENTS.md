# AGENTS.md — Femi Ojetokun's portfolio

Read this file first. It explains what you are building, who it is for, how the site is structured, and which skill to load for which part. The visual rules live in the skills; this file holds the context and the contracts that all four lenses share.

---

## 1. The owner

- **Name:** Oluwafemi Ojetokun ("Femi"). GitHub: [FemiOje](https://github.com/FemiOje).
- **Role:** Frontend / software engineer, based in Lagos, Nigeria.
- **Education:** B.Sc. Computer Science, University of Lagos (recent graduate).
- **Works at the intersection of:** frontend web, blockchain, and games.
- **Experience:** Provable Labs — one-person team working directly under the CEO/co-founder.
- **Open source:** contributor to **Dope Wars** and **Loot Survivor 2** (onchain games).
- **Own project:** **Aux** — a live, music-app-agnostic shared space where people share their music taste and discover new music through each other. Stack: React, Node, Postgres, Redis; Monad onchain features (drop records, tips to curators) are core to it. Status: in progress.
- **Currently learning:** smart contracts — Speedrun Ethereum → Ethernaut → Damn Vulnerable DeFi.

**Never invent facts.** No made-up metrics, dates, employers, testimonials, client names, or project descriptions. Anything not listed here is a visible placeholder in square brackets, e.g. `[one line on what you built]`, `[years]`, `[your email]`, until Femi supplies it.

---

## 2. The idea: one site, four lenses

The site presents the same person and the same work through **four lenses**. A visitor picks the lens that matches why they came:

| Lens | Route | Who it speaks to | Design | Skill to load |
|---|---|---|---|---|
| `home` | `/` | everyone (the home page) | **Ma** — entering a Japanese home: washi paper, Mincho type, vast space, subtle bamboo | `skills/ma-classic/` |
| `web` | `/web` | people hiring a frontend / web engineer | **Browser + Inspector** — the page inside a light browser window whose tabs are the lens switcher, with working developer tools docked beside it (Elements, Styles, box model, Console) | `inspector-web` (guidelines in `design/web/DESIGN.md`) |
| `games` | `/games` | game studios, onchain game teams | **Overworld** — a light paper page carrying one tiny game: a pixel-art map where each game project is a level the visitor walks to | `overworld-games` (guidelines in `design/games/DESIGN.md`) |
| `blockchain` | `/blockchain` | blockchain / protocol teams | **Whitepaper + Ledger** — the page set as a scientific paper carrying a SHA-256 hash chain of the work that visitors can verify | `whitepaper-blockchain` (guidelines in `design/blockchain/DESIGN.md`) |

The lenses share **content**, **routes** and **the switcher contract** (below). They do **not** share layout components or styling: each lens is its own visual world, built strictly from its skill.

### Lenses without a skill in this folder
- Leave their existing design alone unless Femi asks for changes.
- Never restyle them with another lens's tokens, and never improvise a new design for them.
- When a new skill is added for a lens, wire it in exactly like the others.

---

## 3. Architecture

Defaults below; Femi may override any of them, and his instructions win.

- **Framework:** Astro (static output, near-zero client JS). [Astro Keel](https://github.com/kpab/astro-keel) (MIT) is an acceptable starting point for content collections, RSS and SEO, but strip its styling; every visible style comes from a lens skill. Keep Astro Keel's MIT license notice if you start from it.
- **Routes:** each lens is a real page, so it is linkable, crawlable and fast:
  - `/` → the `home` lens (default)
  - `/web` → the `web` lens
  - `/games` → the `games` lens
  - `/blockchain` → the `blockchain` lens
  - Project detail pages per lens: `/<lens>/work/<slug>` (`/work/<slug>` for `home`).
- **Remembering the choice:** store the last chosen lens in `localStorage` (`lens`). On `/`, if a different lens is remembered, offer it with a single quiet link ("continue in games") rather than auto-redirecting. Wrap storage access in try/catch; the site must work without it.
- **Transitions:** Astro View Transitions. Inside a lens: crossfade only, 200–300 ms. Between lenses: a full-page CSS overlay (`src/lib/client/lens-transition.*`) in which the lens being left closes over the page in its own motif and the lens being entered opens onto the new one. Both are disabled under `prefers-reduced-motion`.
- **Styling:** each lens's tokens are CSS custom properties scoped to `[data-lens="home"]`, `[data-lens="web"]`, `[data-lens="games"]`, `[data-lens="blockchain"]` on `<html>`. No shared global palette.
- **Fonts:** self-host via `@fontsource` packages where available; never hotlink fonts in production.

### Content model (shared by every lens)

```
src/content/
  profile.md        # name, role, location, bio paragraphs, links
  projects/*.md     # one file per project
  experience/*.md   # roles, open source, education, learning
```

Project frontmatter:

```yaml
title: Loot Survivor 2
slug: loot-survivor-2
summary: "[one line on what you built]"
role: Open-source contributor
status: contributor        # contributor | shipped | in-progress
lenses: [home, web, games, blockchain]   # which lenses show it
featured_in: [games]                        # lenses where it is the featured project
order: { home: 2, web: 2, games: 1, blockchain: 2 }
tags: [games, onchain, open-source]         # drives the project filters (home lens) and the web lens's console
stack: [onchain game, open source]
links: { live: "", repo: "" }
cover: ./cover.png         # optional; placeholder box if absent
```

Default lens assignments (adjust when Femi says otherwise):

| Project | home | web | games | blockchain | Featured in | Tags |
|---|---|---|---|---|---|---|
| Aux | ✓ | ✓ | | ✓ | home, web | web, onchain |
| Loot Survivor 2 | ✓ | ✓ | ✓ | ✓ | games | games, onchain, open-source |
| Dope Wars | ✓ | ✓ | ✓ | ✓ | — | games, onchain, open-source |

---

## 4. The lens switcher contract

Every lens renders the switcher **in its own visual language**, but it must behave identically everywhere:

- Exactly four options, always in this order: `home`, `web`, `games`, `blockchain`.
- Labels are those lowercase words. Each lens may add its own flourish around them (Ma: a small seal mark; web: a favicon square in each browser tab), but the words stay readable.
- Each option is a real `<a href>` to that lens's route. The current lens has `aria-current="page"`.
- Wrap the options in `<nav aria-label="Choose a lens">`.
- Placement: in the header on every page, plus one prominent instance in the hero. Exception: in the `web` lens the browser tabs are the only switcher; it has no second instance.
- Keyboard: Tab reaches every option; visible focus ring; touch targets ≥ 44 × 44 px.

---

## 5. Rules for every lens

1. **Load the lens skill before writing any code for that lens**, and follow its DESIGN.md exactly. If the skill and this file disagree on visuals, the skill wins; on content, routes and contracts, this file wins.
2. **One lens per page.** Never mix tokens, fonts or motifs across lenses.
3. **Content is identical across lenses** except order, featured project and the short lens intro line. Facts never change between lenses.
4. **Accessibility:** WCAG 2.2 AA. Body text ≥ 4.5:1, large text ≥ 3:1. Semantic landmarks, one `<h1>` per page, real buttons and links, `alt` on every image, `lang="ja"` on Japanese text, reduced-motion respected.
5. **Performance:** Lighthouse ≥ 95 on all four categories per lens. No layout shift from fonts (use `font-display: swap` plus size-adjusted fallbacks).
6. **Responsive:** every page works from 360 px wide upward. Test 360, 768, 1280 and 1440.
7. **Legal:** only MIT/OFL/permissively licensed code, fonts and assets. Never embed Apple's SF Pro font files. No third-party brand names, logos or trademarks as decoration (no Braun logo, no Apple marks). Keep upstream license notices.
8. **Placeholders over invention** (see §1).

---

## 6. Repository layout

```
AGENTS.md                  # this file
skills/
  ma-classic/              # the HOME lens (/)
    SKILL.md               # options, defaults, tokens, components, decor limits, anti-patterns
    DESIGN.md              # design guidelines + the approved Japanese vocabulary
design/
  <lens>/DESIGN.md         # design guidelines for the web, games and blockchain lenses (their skills are loaded by name)
src/                       # the Astro site
```

## 7. Definition of done for a lens

- [ ] Home page for the lens matches its DESIGN.md (palette, type, spacing, motifs).
- [ ] Switcher present and behaving per §4.
- [ ] All projects assigned to the lens render, in the lens's order, featured one first.
- [ ] Project detail page template done.
- [ ] Every missing fact is a visible `[placeholder]`.
- [ ] The lens skill's own checklist passes.
- [ ] Accessibility, performance and responsive rules in §5 pass.