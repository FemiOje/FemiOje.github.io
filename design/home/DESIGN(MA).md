# DESIGN.md — Ma (web lens)

## 1. Visual theme

Entering a quiet Japanese home. Warm washi paper, ink-dark text, pale bamboo, thin wooden frames. Long pauses between rooms. One object on display at a time. The feeling is peaceful, considered and slightly reverent; never themed or touristic.

Keywords: ma (negative space), kanso (simplicity), shibui (quiet beauty), paper, ink, bamboo, lattice, seal.

## 2. Colour palette and roles

```css
[data-lens="web"] {
  /* Paper */
  --paper:        #F4F0E6;  /* page background (washi) */
  --paper-recess: #ECE6D7;  /* tokonoma alcove, image wells, panels */
  --paper-faint:  #EAE4D4;  /* the large background kanji only */

  /* Wood and bamboo (decor, never text) */
  --wood-beam:    #D2C9AE;  /* 3px alcove beam, bamboo node rings */
  --lattice:      #D9D1BB;  /* shoji grid lines, hairlines */
  --node:         #C9C0A6;  /* divider node, bamboo leaf outline */
  --bamboo-1:     #E6DFCA;  /* nearest stalk */
  --bamboo-2:     #EAE4D2;
  --bamboo-3:     #EDE8D8;  /* farthest stalk */
  --numeral:      #A39B85;  /* decorative kanji numerals 一 二 三 (aria-hidden) */

  /* Ink */
  --ink:          #2B2A26;  /* primary text, primary button border */
  --ink-soft:     #625D52;  /* secondary text: ≥ 5.2:1 on paper and on paper-recess */

  /* The one accent: the seal */
  --seal:         #B8412A;  /* shu (vermilion). Alternates: #2E4A62 ai/indigo, #5E6B3A matcha, #2B2A26 ink */
  --on-seal:      #FBF8F1;
}
```

Rules
- Background is always `--paper`; recessed surfaces use `--paper-recess`. Never pure white, never pure black.
- Body and label text: `--ink` or `--ink-soft` only. `--ink-soft` passes AA on both paper tones; nothing lighter is ever used for text.
- `--seal` appears on: the hanko seal, `:focus-visible` outline, the active mark in the lens switcher. Nowhere else.
- Decor colours (`--wood-beam`, `--lattice`, `--node`, `--bamboo-*`, `--paper-faint`, `--numeral`) are for lines, shapes and decorative glyphs only.

## 3. Typography

| Role | Family | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| Display (h1) | Shippori Mincho | 400 | `clamp(44px, 6.4vw, 96px)` | 1.14 | -0.005em |
| Section title (h2) | Shippori Mincho | 400 | `clamp(32px, 3.6vw, 48px)` | 1.2 | 0 |
| Contact headline (h2) | Shippori Mincho | 400 | `clamp(40px, 5.6vw, 80px)` | 1.15 | 0 |
| Project title (h3) | Shippori Mincho | 500 | 26px (grid), 34px (tokonoma) | 1.2 | 0 |
| Bio paragraph | Shippori Mincho | 400 | `clamp(19px, 1.6vw, 22px)` | 1.85 | 0 |
| Body | Zen Kaku Gothic New | 400 | 16px | 1.8 | 0.02em |
| Lead (under h1) | Zen Kaku Gothic New | 400 | `clamp(16px, 1.3vw, 18px)` | 1.9 | 0.02em |
| Label / meta | Zen Kaku Gothic New | 400 | 13px | 1.6 | 0.10–0.14em |
| Nav | Zen Kaku Gothic New | 400 | 14px | — | 0.08em |
| Vertical kanji label | Shippori Mincho | 400 | 15px | — | 0.3em, `writing-mode: vertical-rl` |

- Both fonts: SIL Open Font License (Google Fonts / `@fontsource`). Fallbacks: Mincho → `"Hiragino Mincho ProN", "Yu Mincho", serif`; Gothic → `"Hiragino Sans", "Yu Gothic", system-ui, sans-serif`.
- Headings in sentence case. Labels, nav and meta in lowercase.
- Measure: prose ≤ 56ch (bio), ≤ 40ch (lead), h1 ≤ 13ch.
- Numbers in clocks and meta: `font-variant-numeric: tabular-nums`.

## 4. Japanese vocabulary (the only Japanese allowed)

| Text | Reading | Meaning | Where |
|---|---|---|---|
| 間 | ma | negative space | huge, faint, behind the hero (`aria-hidden`) |
| 玄関 | genkan | entryway | hero label |
| 作品 | sakuhin | works | vertical label, work section |
| 経歴 | keireki | background / career | vertical label, about section |
| 便り | tayori | a letter, correspondence | vertical label, contact section |
| 一 二 三 四 五 | ichi … go | one … five | project numerals in the shoji grid (`aria-hidden`) |
| 一期一会 | ichigo ichie | one time, one meeting | footer, followed by the English gloss |
| フェミ | femi | "Femi" in katakana | inside the hanko seal (`aria-hidden`) |

English concept words may appear in labels: `tokonoma — the one thing on display`. Anything beyond this table needs Femi's approval and a native speaker's check.

## 5. Layout principles

- Container: `max-width: 1200px`, side padding `clamp(24px, 5vw, 64px)`.
- **Vertical rhythm is the design.** Minimum section padding:
  - hero: top `clamp(96px, 14vw, 200px)`, bottom `clamp(96px, 12vw, 176px)`
  - work: top `clamp(96px, 12vw, 168px)`
  - about: top `clamp(120px, 14vw, 200px)`
  - contact: top `clamp(140px, 16vw, 240px)`, bottom `clamp(96px, 12vw, 160px)`
- Internal gaps: 36px within a hero stack, 56px between work blocks, 48px between bio and rows.
- Asymmetry over centring. Text aligns left; nothing is centred except content inside image wells.
- Section headers: vertical kanji label on the left (28px gap), then English label + h2 stacked.
- Flex-wrap rows with `flex: 999 1 560px` for the main column so everything stacks gracefully on phones.

## 6. Components

**Header.** Seal + name (Mincho 17px) on the left, nav centre/right, then `lagos · HH:MM` (Africa/Lagos time, 13px, tabular). 28px vertical padding. No border.

**Hanko seal.** 34 × 34px, radius 3px, `--seal` fill, `--on-seal` text, フェミ set vertically (`writing-mode: vertical-rl`), Mincho 10px weight 600. Decorative: `aria-hidden="true"`; the name beside it is the accessible text.

**Lens switcher (Ma style).** Three lowercase words in a row (`web · chain · games`), 13px, tracking 0.12em. The active one has a 6px seal-coloured square before it (a tiny seal) and `aria-current="page"`. Disabled `chain — soon` in `--ink-soft` with no link. Lives in the header, and once more in the hero under the actions.

**Primary action.** Text "enter" + thin arrow, 1px `--ink` border, radius 2px, min-height 48px, padding 0 22px, transparent fill. Hover: background `--paper-recess`. Secondary action: plain underlined link.

**Bamboo cluster.** Hero only, right side, `aria-hidden`. Three stalks of decreasing width (11, 8, 6px) and lightness (`--bamboo-1/2/3`), each a stack of segments 70–140px tall separated by 2px node rings (`--wood-beam` or lighter), rounded tops, leaning −1.2°, +1.4°, −0.6° from the base. Two small leaf sprays (2–3 lanceolate leaves each, `--bamboo-*` fill, 1px `--node` outline) at upper nodes. Container height `clamp(300px, 42vw, 540px)`, max-width 320px, overflow hidden. Optional sway: rotate ±1.6° over 9–11s, ease-in-out, infinite; off under reduced motion.

**Bamboo divider.** A full-width 1px `--lattice` line with one node: a 5 × 11px mark with 1px `--node` left/right borders, placed at 30% (top of page) or 70% (bottom), never centred. Use between hero and work, and above the footer. Nowhere else.

**Tokonoma (featured project).** One project only. Panel in `--paper-recess` with a 3px `--wood-beam` top border (the alcove's beam), radius 0 0 2px 2px. Left: 16:10 image well (`--paper` with 1px `--lattice` border). Right, aligned to the bottom: status label, Mincho title 34px, one-paragraph summary, stack line. Padding `clamp(24px, 4vw, 56px)`.

**Shoji grid (other projects).** CSS grid, `repeat(auto-fit, minmax(min(100%, 380px), 1fr))`, `gap: 1px` over a `--lattice` background with a 1px `--lattice` border, so the gaps read as kumiko lattice. Cells: `--paper` background, padding `clamp(24px, 3.5vw, 44px)`, 4:3 image well in `--paper-recess`, kanji numeral (`--numeral`, 20px) + Mincho title, summary, stack line.

**Hairline rows (about).** Grid of label / value / detail, 20px vertical padding, 1px `--lattice` top border (and bottom on the last row).

**Project detail page.** Same frame. Genkan-style label (`作品 · <project>`), Mincho h1, lead sentence, then one full-width image well, then prose (≤ 64ch) alternating with single images placed off-centre. End with a quiet "next project" link and the bamboo divider.

**Footer.** Bamboo divider (node at 70%), then © line left, `一期一会 — one time, one meeting` right, 13px.

## 7. Depth and elevation

None. No shadows, no blur, no gradients. Depth = paper tone change (`--paper` → `--paper-recess`) plus 1px lines. The 3px alcove beam is the heaviest line on the page.

## 8. Motion

- Bamboo sway: as above.
- Page and lens transitions: crossfade 240ms ease-out.
- Hover: colour and background changes only, 160ms ease-out.
- Nothing scales, slides, bounces or parallaxes. `@media (prefers-reduced-motion: reduce)` disables all animation.

## 9. Do's and don'ts

**Do**
- Let whole screens be mostly paper.
- Use one object per "room": one featured project, one bamboo cluster, one large kanji.
- Keep Japanese references quiet enough that a visitor might not notice them on the first scroll.
- Write calm, plain copy: short sentences, no hype.

**Don't**
- Add cherry blossoms, torii, Fuji, waves, koi, lanterns, ensō circles, brush-stroke fonts, or red-and-black "oriental" palettes.
- Use bold weights, all-caps, icons as decoration, emoji, badges, or chips.
- Put the seal colour on anything except the seal, focus ring and active switcher mark.
- Invent Japanese text or translate English copy into Japanese.
- Fill empty space with stats, logos or testimonials.

## 10. Responsive behaviour

- ≥ 1024px: hero text and bamboo side by side; tokonoma image left, text right; shoji 2 columns.
- 768–1023px: same structure, tighter padding (the clamps handle it).
- < 768px: everything stacks; bamboo cluster drops to 300px tall and sits below the hero text; vertical kanji labels stay vertical beside their headings; nav wraps under the name; shoji becomes one column (the lattice lines become horizontal dividers).
- The large 間 shrinks with `clamp(120px, 16vw, 220px)` and may be clipped at the left edge; never let it overlap readable text.

## 11. Agent prompt guide

Paste-ready brief: *"Using the ma-web skill, build the web lens home page: washi paper background #F4F0E6, ink text #2B2A26, Shippori Mincho headings at weight 400 with Zen Kaku Gothic New body, vast vertical spacing, a hanko seal reading フェミ as the logo, a three-stalk pale bamboo cluster in the hero, a tokonoma alcove for the featured project and a 1px-lattice shoji grid for the rest. Only the seal is coloured. No other Japanese imagery."*

Reference mockup: the "v2 — Ma (Japanese home)" artboard on Femi's Portfolio Homepage canvas.
