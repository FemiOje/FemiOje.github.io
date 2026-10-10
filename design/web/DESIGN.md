# Design Guidelines — Swiss Blue Poster (web lens)

## Visual Style
- **Aesthetic**: International Typographic Style (Swiss design) rendered as a colourful poster — full-bleed flat colour fields, a strict 12-column grid, asymmetric compositions inside it, huge condensed type, geometric shapes (concentric rings, blocks, bars, quarter-circles) and big section numerals. Every colour is a shade of blue
- **Mood**: Confident, precise, energetic — engineering rigour with poster-wall presence. Feels like a 1960s Zürich concert poster rebuilt as a website
- **Inspiration**: Josef Müller-Brockmann's Tonhalle / musica viva posters (grid-built abstract compositions, concentric forms), Armin Hofmann and the Basel school (reduction to dot, line, shape), Emil Ruder (flush-left typographic rhythm), *Neue Grafik*; on the web, CSS recreations of Swiss posters
- **Lens**: This is the **web** lens (route `/web`) of Femi Ojetokun's portfolio — it speaks to people hiring a frontend / web engineer. The classic lens (`/`, Ma) uses Japanese off-white; this lens must feel clearly different: blue, loud, gridded

## Color Palette
- **Paper**: `#F3F7FC` — blue-tinted off-white page background for light sections. Never pure white as a page background
- **Ultramarine (hero field)**: `#1F3BD6` — the hero/header field and primary brand blue. White text on it (7.9:1)
- **Cobalt**: `#2A62F0` — poster-card field, section numerals on paper. White text on it (5.1:1)
- **Cerulean**: `#4FA3F7` — contact section field, overprint block in the hero, inner ring. **Navy text only** on it (6.5:1) — white fails
- **Sky**: `#9CCBFF` — poster-card field, outer rings. Navy text (10:1)
- **Ice**: `#DCEBFF` — poster-card field, hero bar, inner rings, body text on navy. Navy text (14:1)
- **Navy (ink)**: `#0B1A3A` — primary text on light fields, about-section field, 2px rules, active filter fill
- **Slate blue**: `#4A5878` — secondary text on paper (6.5:1)
- **Mist**: `#9FB3D9` — secondary text/labels on navy (8.1:1)
- **Rule on navy**: `#24365F` — 1px row dividers inside the navy section
- **White**: `#FFFFFF` — text on ultramarine/cobalt, primary button fill on the hero
- **Grid overlay**: `rgba(79,163,247,0.16)` fill, `rgba(79,163,247,0.4)` column edges
- **No non-blue accents.** No red, yellow, orange or green anywhere

## Typography
- **Font**: **Archivo** (variable, SIL Open Font License) with width (`wdth` 62–125) and weight (100–900) axes. One family for everything — Swiss posters use one grotesque. Fallback: `'Helvetica Neue', Arial, sans-serif`
- **Condensed display** (`font-stretch: 68%`): the giant hero word, section numerals, section titles, project titles, the contact headline
- **Giant hero word** ("Web."): weight 900, `clamp(150px, 27vw, 400px)`, `line-height: 0.74`, `letter-spacing: -0.04em`, bottom-left, may bleed off the field's bottom edge
- **Section numerals** (01, 02, 03): weight 900, `clamp(96px, 12vw, 180px)`, `line-height: 0.8`
- **h1** (normal width): weight 700, `clamp(36px, 4.6vw, 64px)`, `line-height: 1.02`, `letter-spacing: -0.02em`, max 11ch
- **h2** (condensed): weight 800, `clamp(44px, 5.4vw, 80px)`, `line-height: 0.9`
- **Contact headline** (condensed): weight 900, `clamp(88px, 15vw, 240px)`, `line-height: 0.82`
- **Project title h3** (condensed): weight 800, 48px, `line-height: 0.9`
- **Lead / bio**: weight 500, `clamp(22px, 2.2vw, 32px)`, `line-height: 1.25`, max 34ch
- **Body**: weight 400, 15–16px, `line-height: 1.45–1.5`
- **Labels / meta / nav**: weight 700 (labels) or 500 (nav), 13–14px, sentence/lowercase, never uppercase
- **Alignment**: flush-left, ragged-right — always. Never centred, never justified
- **Numbers**: `font-variant-numeric: tabular-nums`

## Spacing & Layout
- **Grid**: 12 columns, `24px` gutters, `max-width: 1280px`, side padding `clamp(20px, 4vw, 48px)`. Everything snaps to it; compositions are asymmetric *inside* it
- **Colour fields are full-bleed**; their content sits in the 1280px grid container
- **Section rhythm** (top → bottom): ultramarine hero field → paper work section → navy about field → cerulean contact field → paper footer. Alternating fields is what makes the page read as posters
- **Section padding**: `clamp(80px, 9vw, 128px)` vertical; hero min-height `clamp(720px, 72vw, 980px)`
- **Section header**: numeral + (label over h2) on the left, controls on the right, 2px navy rule below
- **Base unit**: 8px; gaps 8 / 16 / 24 / 32 / 48 / 64
- **Mobile**: single column; meta row wraps; poster cards one per row; giant word scales with vw and may crop

## Borders & Radius
- **Border radius**: **`0` everywhere.** Swiss is square. The only round things are the geometric circles/rings (decor) — never buttons, cards or inputs
- **Rules**: `2px solid` (white on blue fields, navy on paper) for header underline, section-header underline, contact top rule, buttons; `1px #24365F` for rows inside navy

## Shadows & Elevation
- **None.** No box-shadow, no blur, no glassmorphism, no gradients. Depth comes only from flat colour planes and the one multiply **overprint** (cerulean block over ultramarine)

## Buttons
- **Primary on blue field**: white fill, ultramarine text, weight 800, 16px, `min-height: 52px`, `padding: 0 24px`, radius 0
- **Secondary on blue field**: transparent, `2px solid #FFF`, white text, weight 700
- **On paper**: navy fill + white text (primary) or `2px solid #0B1A3A` outline (secondary)
- **Toggle buttons** (grid, filters): outline by default, filled (navy on paper / white on blue) when `aria-pressed="true"`
- **Hover**: invert fill/text, 120ms. **Active**: `translate(0,1px)`. No shadows, no scaling

## Icons
- Minimal: 14–16px stroke icons (2px stroke, square caps) — arrow, recompose (cycle) icon. `currentColor`, `aria-hidden`
- Geometry *is* the illustration: circles, rings, bars, rectangles, quarter-circles — never illustrations, emoji or 3D

## Components Spotted
- **Header** (inside the hero field): name (800, 17px) left · lens switcher centre · `lagos HH:MM` + **grid** toggle right · 2px white bottom rule
- **Lens switcher**: four links — `classic`, `web`, `games`, `blockchain` — each preceded by a 10px square: outlined (1.5px) for others, filled for current, current also weight 800 + `aria-current="page"`
- **Meta row**: 4 cells on an auto-fit grid — `01 / Frontend engineering`, `Lagos / Nigeria, UTC+1`, `Focus / Web, onchain, games`, and the **recompose 1/3** button
- **Hero composition**: concentric rings (outer two sky, third ice, filled cerulean core), a cerulean multiply block, an ice bar — positioned per composition; 3 compositions cycled by *recompose*
- **Giant word**: "Web." condensed 900 white, bottom-left, `aria-hidden` (the h1 carries meaning)
- **Filter bar**: `all · web · onchain · games · open source` square toggle buttons; live count label `03 projects`
- **Poster card**: 3:4, min-height 460px, padding 28px, flat colour field (cobalt / sky / ice in rotation), condensed number top-left (72px), status top-right, a geometric motif in the middle, condensed title + summary + stack at the bottom
- **Spec section** (navy field): numeral `02` cerulean, label, h2 `Spec.`, large lead paragraph in white, hairline rows (label · value · detail)
- **Contact** (cerulean field): numeral `03`, giant `Say hello.`, links row above a 2px navy rule
- **Footer** (paper): © line left, `set in Archivo · built on a 12-column grid` right
- **Grid overlay**: toggled by the header's grid button; 12 translucent columns over the whole page, `pointer-events: none`

## Imagery & Illustration
- Project screenshots (when supplied) sit in **square-cornered** frames inside poster cards or detail pages, never device mockups; until supplied, the geometric motif stands in
- Geometric decor is **systematic**, not scattered: every shape aligns to grid columns or field edges
- Photography, if used, is objective and documentary, duotoned to navy/blue

## Overall Replication Notes
Key things an AI coding tool must know to nail this style:

- **Everything is blue.** Ultramarine, cobalt, cerulean, sky, ice, navy — plus white. A single non-blue accent breaks the lens
- **Radius 0 and no shadows.** Square buttons, square cards. Circles exist only as decorative geometry
- **Full-bleed colour fields, alternating** (ultramarine → paper → navy → cerulean → paper). This is what makes it a poster, not a page
- **Condensed Archivo for display, normal Archivo for reading.** One family, width does the shouting
- **Giant numerals and the giant word** are the signature — oversized, tight, bottom/left anchored, allowed to crop at field edges
- **Flush-left, asymmetric, on a 12-column grid.** Nothing centred
- **Contrast pairs are fixed**: white only on ultramarine/cobalt/navy; navy on cerulean/sky/ice/paper. Never white on cerulean or sky
- **Functionality is part of the look**: recompose, grid overlay and project filters must work
- **Motion is mechanical**: shapes glide 700ms on recompose; everything else 120–200ms; all off under reduced motion