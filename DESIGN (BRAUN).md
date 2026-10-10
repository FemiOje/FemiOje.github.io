# DESIGN.md — Braun (games lens)

## 1. Visual theme

1960s Braun hardware rendered as a website. A cream chassis, hairline seams, a speaker grille, a tuning dial, small lowercase labels, and one orange control that tells you where to press. Projects are numbered units in a product line. The feeling is precise, tactile and honest, with one bold headline that gives it presence.

Keywords: less but better, instrument, chassis, unit, dial, readout, grid.

## 2. Colour palette and roles

```css
[data-lens="games"] {
  /* Chassis neutrals */
  --chassis:      #F2EFE9;  /* page background (SK4 cream white) */
  --chassis-warm: #E9E5DC;  /* unit panels, cards, the tuner body */
  --panel-grey:   #D6D3CC;  /* hairlines inside panels, borders, disabled */
  --line-grey:    #BDBAB2;  /* grille dots, dial rim, inactive dots */
  --text-2:       #6E6C66;  /* secondary text: 4.55:1 on chassis */
  --charcoal:     #221F1A;  /* primary text, status dots, dial pointer */

  /* Accent: ONE per view */
  --accent:       #E8501E;  /* braun orange, default */
  /* alternates by semantics: #46704F function green · #F2A900 signal yellow · #C13A27 signal red */
  --on-accent:    #12100D;  /* computed: whichever of #12100D / #FFFFFF has higher contrast on --accent */

  --radius: 4px;
  --t: 150ms;
  --ease: cubic-bezier(0, 0, .2, 1);
  --shadow-overlay: 0 1px 3px rgba(0,0,0,.12);
}
```

Rules
- `--text-2` is the lightest permitted text colour, and only on `--chassis`. On `--chassis-warm` panels, use `--charcoal` for anything smaller than 18px, or verify ≥ 4.5:1.
- `--on-accent`: compute from the accent's relative luminance; for the default orange it is the near-black `#12100D` (≈ 5.0:1). White on Braun orange fails AA; never use it.
- Accent permitted on: primary button fill, hero status dot, active indicator dots (tuner positions, switcher). Nowhere else.

## 3. Typography

Family: **Inter** (SIL OFL), variable with the optical-size (`opsz`) axis so large sizes automatically use the Display design. Fallback stack: `"Inter", "Helvetica Neue", Arial, sans-serif`. Optional variant: put `-apple-system, BlinkMacSystemFont` first so Apple devices render the system San Francisco font. This is allowed; embedding SF font files is not.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display (h1) | `clamp(52px, 8.2vw, 124px)` | 700 (600–800) | 0.94 | -0.045em |
| Section title (h2) | `clamp(36px, 4.4vw, 60px)` | 700 | 1.0 | -0.035em |
| Contact headline | `clamp(48px, 7vw, 108px)` | 700 | 0.95 | -0.045em |
| Unit title (h3) | 24px | 600 | 1.2 | -0.02em |
| Lead | `clamp(18px, 1.6vw, 22px)` | 400 | 1.4 | -0.005em |
| Bio paragraph | `clamp(18px, 1.5vw, 21px)` | 400 | 1.5 | 0.01em |
| Body / UI | 15px | 400 / 500 | 1.5 | 0.01em |
| Label / meta | 13px | 400 | 1.5 | 0.03em |

- `font-variant-numeric: tabular-nums` on the whole lens.
- UI text lowercase via content, not `text-transform` hacks on prose. Never uppercase.
- Max three UI sizes per component; display sizes don't count.
- Measure: lead ≤ 34ch, bio ≤ 60ch.

## 4. Layout principles

- Container: `max-width: 1280px`, side padding `clamp(20px, 4vw, 48px)`.
- Base unit 8px; every gap a multiple of 4.
- Grouping: 8–12px inside a group, 24–32px between groups.
- Section padding: hero `clamp(64px, 9vw, 128px)` top / `clamp(48px, 6vw, 88px)` bottom; sections `clamp(72px, 9vw, 120px)` top; contact `clamp(96px, 12vw, 168px)` top.
- Strict orthogonal grid; left-aligned text; centre only a lone control on its own axis (the dial).
- Spec plate and unit grid: `repeat(auto-fit / auto-fill, minmax(min(100%, Npx), 1fr))` with N = 220 (plate), 340 (units).
- Hero: text column `flex: 999 1 560px`, tuner `flex: 1 1 340px; max-width: 460px`.

## 5. Components

**Header.** Wordmark `femi ojetokun` (15px, 600) left; nav (`work`, `about`, `contact`); lens switcher; `lagos · HH:MM wat` (13px, `--text-2`, Africa/Lagos time). 16px vertical padding, 1px `--panel-grey` bottom border.

**Status line.** 8px accent dot + `frontend engineer — web, onchain, games` (13px, `--text-2`). Sits above the h1.

**Primary button.** Accent fill, `--on-accent` text 15px/500, radius 4px, min-height 48px, padding 0 22px, trailing 16px stroke arrow. Hover: darken fill 6%. Focus: 2px `--charcoal` outline, 2px offset. Secondary: underlined charcoal link.

**Tuner unit (hero) = hero lens switcher.** Panel `--chassis-warm`, 1px `--panel-grey` border, radius 4px, padding 24px, gaps 20px.
- Top row: `fo-00` left, `tuner` right (13px, `--text-2`).
- Speaker grille: 188px tall, radius 4px, dot pattern `radial-gradient(circle, var(--line-grey) 0 2.2px, transparent 2.8px)` on a 13px grid. `aria-hidden`.
- Bottom row: a 96px circular **dial** (`--chassis` fill, 1px `--line-grey` rim) with a 2 × 28px charcoal pointer rotated to −50° / 0° / +50° for `web` / `chain` / `games`, 160ms ease-out; beside it the three position labels, each with a 6px dot (accent when current, `--line-grey` otherwise), and a one-line readout for the current position.
- Behaviour: on this lens the pointer rests at `games`. The position labels are the switcher links (AGENTS.md §4). Clicking the dial or pressing →/← while it is focused rotates the pointer to the next position and follows that lens's link after the 160ms turn. `chain` is skipped while disabled. Dial: `<button aria-label="Turn the dial to switch lens">`.
- Readout copy: `web` → "Interfaces and frontend engineering for the web." · `chain` → "Onchain products — Monad, Ethereum." · `games` → "Onchain games — Dope Wars, Loot Survivor 2."

**Lens switcher (header).** Three lowercase words, 13px, each preceded by a 6px dot; current = accent dot + `--charcoal` text + `aria-current="page"`; others `--line-grey` dot + `--text-2` text; `chain — soon` disabled.

**Spec plate.** A row of cells between 1px `--panel-grey` top/bottom borders: label (13px `--text-2`) over value (15px). Cells: based in, focus, education, previously.

**Unit card (project).** `--chassis-warm` panel, radius 4px, padding 16px, gap 16px.
1. 4:3 image well: `--chassis`, 1px `--panel-grey` border, radius 4px; placeholder `[project screenshot]` centred, 13px.
2. Meta row: model number `fo-0N` left; status right as 8px dot + word: filled `--charcoal` = contributor / shipped; 1.5px `--charcoal` ring = in progress.
3. Title (h3) + one-line summary.
4. Stack line: lowercase items separated by `·`.
Model numbers follow the lens's project order: featured project is `fo-01`.

**Section header.** Label `01 — selected work` (13px `--text-2`) over the h2 (`Units shipped.` / `Spec sheet.`), with a count on the right (`03 units`).

**Spec sheet rows (about).** Grid of label / value / detail / years, 16px vertical padding, 1px `--panel-grey` lines.

**Project detail page ("data sheet").** Header row: model number, status, title (display size). Then a spec table (role, stack, status, links, years), a large image well, and prose ≤ 64ch with images in the same 4px wells. Footer of the sheet: "next unit →".

**Footer.** 1px top border; `© 2026 oluwafemi ojetokun` left, `designed in lagos · less, but better` right, 13px `--text-2`.

## 6. Depth and elevation

Flat. No shadows at rest. Panels separate from the chassis by tone (`--chassis-warm`) and 1px lines. Popovers/menus only: `--shadow-overlay`.

## 7. Motion

- Dial rotation: 160ms `--ease`.
- Hovers: colour/background, 150ms.
- Lens change: crossfade 240ms (View Transitions).
- No springs, bounces, parallax, pulses or scale > 1.02. All off under reduced motion (dial snaps).

## 8. Do's and don'ts

**Do**
- Treat every project as a product in a line, with a model number and a status.
- Keep labels tiny and lowercase; let the one display headline carry the boldness.
- Make the dial genuinely work; it is the signature interaction.

**Don't**
- Use more than one accent hue, or put it on headings or links.
- Use pills, shadows, gradients, glassmorphism, neon, pixel fonts or "gamer" aesthetics. The games lens is about craft, not cliché.
- Show the Braun or Apple names, logos or product images.
- Use uppercase, italics, or weights above 500 outside the display tier.

## 9. Responsive behaviour

- ≥ 1024px: hero text left, tuner right; spec plate 4 cells; units 3 per row.
- 768–1023px: tuner wraps under the hero text at full width (max 460px); units 2 per row.
- < 768px: single column; header items wrap; spec plate 1–2 cells per row; units 1 per row; dial stays 96px (touch target), position labels min-height 44px.

## 10. Agent prompt guide

Paste-ready brief: *"Using the braun-games skill, build the games lens home page: cream chassis #F2EFE9, charcoal text #221F1A, Inter with display optical size for one bold 700 headline (tracking −0.045em), everything else small and lowercase; a tuner unit with a speaker grille and a working dial that switches lenses; projects as numbered units (fo-01…) in #E9E5DC panels with status dots; braun orange #E8501E only on the primary button and active dots; 4px radius, no shadows."*

Reference mockup: the "v1 — Braun" artboard on Femi's Portfolio Homepage canvas.

## 11. Attribution

Chassis colours, accent set, grouping ratio and several rules adapted from [rams-braun-ui](https://github.com/yangyue1974/rams-braun-ui) (MIT) by yangyue1974, an unaffiliated homage to Dieter Rams and the Braun design department.
