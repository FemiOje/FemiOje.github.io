# AGENTS.md — Femi Ojetokun's portfolio

Read this file first. It explains what you are building, who it is for, how the site is structured, and which skill to load for which part. The visual rules live in the skills; this file holds the context and the contracts that all three designs share.

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

## 2. The idea: one site, three lenses

The site presents the same person and the same work through **three lenses**. A visitor picks the lens that matches why they came:

| Lens | Who it speaks to | Design | Skill to load | Status |
|---|---|---|---|---|
| `web` | people hiring a frontend / web engineer | **Ma** — entering a Japanese home: washi paper, Mincho type, vast space, subtle bamboo | `skills/ma-web/` | ready |
| `games` | game studios, onchain game teams | **Braun** — Dieter Rams-era hardware: cream chassis, instrument dials, one orange accent | `skills/braun-games/` | ready |
| `chain` | blockchain / protocol teams | not designed yet | — | **pending** |

The lenses share **content**, **routes** and **the switcher contract** (below). They do **not** share layout components or styling: each lens is its own visual world, built strictly from its skill.

### Until the `chain` lens exists
- Show it in the switcher as disabled, labelled `chain — soon`, with `aria-disabled="true"` and no link.
- Do not improvise a chain design, and do not reuse another lens's design under the chain name.
- When a `skills/chain-*/` skill is added, wire it in exactly like the other two.

---

## 3. Architecture

Defaults below; Femi may override any of them, and his instructions win.

- **Framework:** Astro (static output, near-zero client JS). [Astro Keel](https://github.com/kpab/astro-keel) (MIT) is an acceptable starting point for content collections, RSS and SEO, but strip its styling; every visible style comes from a lens skill. Keep Astro Keel's MIT license notice if you start from it.
- **Routes:** each lens is a real page, so it is linkable, crawlable and fast:
  - `/` → the `web` lens (default)
  - `/games` → the `games` lens
  - `/chain` → the `chain` lens (once it exists)
  - Project detail pages per lens: `/<lens>/work/<slug>` (`/work/<slug>` for `web`).
- **Remembering the choice:** store the last chosen lens in `localStorage` (`lens`). On `/`, if a different lens is remembered, offer it with a single quiet link ("continue in games") rather than auto-redirecting. Wrap storage access in try/catch; the site must work without it.
- **Transitions:** Astro View Transitions between lenses, crossfade only, 200–300 ms, disabled under `prefers-reduced-motion`.
- **Styling:** each lens's tokens are CSS custom properties scoped to `[data-lens="web"]`, `[data-lens="games"]`, etc. on `<html>`. No shared global palette.
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
lenses: [games, chain]     # which lenses show it
featured_in: [games]       # lenses where it is the featured project
order: { web: 3, games: 1, chain: 2 }
stack: [onchain game, open source]
links: { live: "", repo: "" }
cover: ./cover.png         # optional; placeholder box if absent
```

Default lens assignments (adjust when Femi says otherwise):

| Project | web | games | chain | Featured in |
|---|---|---|---|---|
| Aux | ✓ | | ✓ | web |
| Loot Survivor 2 | ✓ | ✓ | ✓ | games |
| Dope Wars | ✓ | ✓ | ✓ | — |

---

## 4. The lens switcher contract

Every lens renders the switcher **in its own visual language**, but it must behave identically everywhere:

- Exactly three options, always in this order: `web`, `chain`, `games`.
- Labels are those lowercase words. Each lens may add its own flourish around them (Ma: a small seal mark; Braun: a tuning dial), but the words stay readable.
- Each option is a real `<a href>` to that lens's route (disabled options per §2). The current lens has `aria-current="page"`.
- Wrap the options in `<nav aria-label="Choose a lens">`.
- Placement: in the header on every page, plus one prominent instance in the hero.
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
  ma-web/
    SKILL.md               # build order, hard rules, checklist for the web lens
    DESIGN.md              # tokens, type, components, motifs, do's and don'ts
  braun-games/
    SKILL.md
    DESIGN.md
  chain-*/                 # added later
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
