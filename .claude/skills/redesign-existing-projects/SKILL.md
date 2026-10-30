---
name: redesign-existing-projects
description: "Audits and upgrades existing websites and apps to premium quality. Diagnoses generic AI design patterns, weak states, and sloppy code, then applies targeted fixes without breaking functionality. Use this skill whenever the user wants to improve, polish, upgrade, refine, audit, fix, or redesign an EXISTING site, page, app, or component, even when they only say it looks bad, cheap, generic, or AI made. Works with any CSS framework or vanilla CSS."
---

# Redesign Existing Projects

This skill is a **diagnostic**. It finds what is wrong with an existing interface and fixes it in place.

## Design values

All concrete values (fonts, background colors, spacing, radius, icon sets, motion timing) live in the **Design Values** section at the bottom of this file. That section is the single source of truth. The audit below tells you *what to look for*; Design Values tells you *what to replace it with*.

Never invent a font, hex value, spacing number, radius, or easing curve that is not in Design Values. If a situation is not covered there, ask rather than guessing.

To adapt this skill to a different design system, edit only the Design Values section. The entire audit follows it automatically.

## How this works

1. **Scan** — Read the codebase. Identify the framework, styling method (Tailwind, vanilla CSS, styled-components, CSS modules), and the current design patterns.
2. **Diagnose** — Run the full audit below. List every generic pattern, weak point, and missing state you find. Report before fixing.
3. **Fix** — Apply targeted upgrades inside the existing stack, in the Fix Priority order. Do not rewrite from scratch. Improve what is there.

---

# Design audit

## Typography

- **Browser default fonts, or Inter / Roboto / Arial / Open Sans / Helvetica.** Replace with an approved font from the Design Values section.
- **Two typefaces on one site.** Consolidate to one, unless the project brief explicitly calls for a pair.
- **Italic type anywhere.** Remove it. Use weight, size, or color for emphasis instead.
- **Ultra bold weights (800, 900, black).** Cap at semibold or bold.
- **Only Regular (400) and Bold (700) in use.** Introduce Medium (500) and SemiBold (600) for finer hierarchy.
- **Headlines lack presence.** Increase display size and tighten letter spacing so headlines feel heavy and intentional. Adjust tracking only within the line height the type scale already provides.
- **Body text too wide.** Cap paragraph measure at roughly 65 characters.
- **Numbers in a proportional font.** Enable `font-variant-numeric: tabular-nums` for data heavy interfaces.
- **Missing letter spacing adjustments.** Negative tracking on large headers, positive tracking on small labels and caps.
- **All caps subheaders everywhere.** Switch to sentence case or small caps. Do not switch to italics.
- **Orphaned words.** A single word alone on the last line. Fix with `text-wrap: balance` on headings and `text-wrap: pretty` on body.
- **Hyphens inside copy.** Do not use `-` in headings, body text, or labels. Rewrite the phrase.
- **Arbitrary or off scale font sizes.** Resolve every size to the Tailwind type scale. Never leave `text-[19px]`, `font-size: 22px`, or `1.4rem` in place. If a size does not land on a step, snap to the closest step below and take its paired line height. Do not combine this with independently set custom line heights from the two fixes above; adjust only within the matched step's value so the rules do not fight.
- **Buttons with off scale type.** Main buttons `text-base` semibold. Header buttons `text-sm` semibold.

## Color and surfaces

- **Background colors outside the approved palette.** Snap every dark surface to the approved dark values. Do not substitute `#0a0a0a`, `#121212`, or a tinted navy.
- **Gradient backgrounds of any kind.** Backgrounds are flat. Remove linear, radial, and mesh background gradients entirely. The only permitted gradient is on hero heading text.
- **Hero heading with flat text color.** Apply the approved left to right text gradient for the active theme.
- **The purple and blue "AI gradient" aesthetic.** The single most common AI fingerprint. Replace with a flat neutral base and one considered accent.
- **Oversaturated accent colors.** Keep saturation under 80% so accents sit with the neutrals instead of screaming.
- **More than one accent color.** Pick one. Remove the rest.
- **Mixing warm and cool grays.** Commit to one gray family and tint consistently.
- **Generic `box-shadow`.** Tint shadows toward the background hue instead of pure black at low opacity.
- **Flat surfaces with zero texture.** Add subtle noise or grain overlays. Do not reach for a gradient to solve flatness.
- **Inconsistent lighting direction.** Audit every shadow so they imply one light source.
- **A random dark section inside a light page, or the reverse.** This reads as a copy paste accident. Commit to one background tone, or step to a neighboring approved shade rather than jumping to `#111` in the middle of a cream page.
- **Empty sections with no depth.** Add high quality background imagery, masked or overlaid at low opacity, or a subtle pattern. Use `https://picsum.photos/seed/{name}/1920/1080` when real assets are unavailable. Never solve this with an ambient gradient.

## Layout

- **Everything centered and symmetrical.** Break symmetry with offset margins, mixed aspect ratios, or a left aligned header over centered content.
- **Three equal card columns as the feature row.** The most generic AI layout. Three to five benefits is correct as *content*; the *layout* should be a two column zig zag, an asymmetric grid, horizontal scroll, or masonry.
- **`height: 100vh` on full screen sections.** Replace with `min-height: 100dvh` to stop layout jump on iOS Safari.
- **Complex flexbox percentage math.** Replace with CSS Grid.
- **No max width container.** Add a constraint around 1200 to 1440px with auto margins. Hero heading and subheading cap at 680px.
- **Cards forced to equal height by flexbox.** Allow variable heights, or use masonry when content length varies.
- **Radius chosen by feel.** Every radius comes from Tailwind's scale. When a shape sits inside another and the gap is under 32px, the inner radius equals the outer radius minus the gap, applied only when the result exceeds 2.
- **Spacing values invented ad hoc.** Every margin, padding, and gap resolves to the approved spacing scale.
- **No overlap or depth.** Elements sitting flat beside each other. Use negative margins to layer.
- **Symmetrical vertical padding.** Adjust optically. Bottom padding usually needs slightly more.
- **Dashboard always has a left sidebar.** Try top navigation, a floating command menu, or a collapsible panel.
- **Missing whitespace.** Step up one level on the spacing scale and let it breathe. Dense layouts suit data dashboards, not marketing pages.
- **Buttons not bottom aligned in card groups.** Pin CTAs to the bottom of each card so they form one clean horizontal line.
- **Feature lists starting at different vertical positions.** In pricing and comparison columns, lists must start at the same Y position. Use fixed height title and price blocks.
- **Inconsistent vertical rhythm across side by side elements.** Align titles, descriptions, prices, and buttons across all items. Misaligned baselines read as broken.
- **Mathematical alignment that looks optically wrong.** Icons beside text, play buttons in circles, and text in buttons often need one or two pixels of optical correction.

## Interactivity and states

- **Default or instant transitions.** Every transition uses a custom cubic bezier with real weight, not `ease` or `linear`. Baseline: `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]`. Micro interactions such as color shifts may run shorter, but never below 200ms and never on a default curve.
- **Elements appearing statically on scroll.** Content entering the viewport fades up heavily: `translate-y-16 blur-md opacity-0` resolving to `translate-y-0 blur-0 opacity-100` over 800ms or longer.
- **`window.addEventListener('scroll')` for reveals.** Replace with `IntersectionObserver` or Framer Motion `whileInView`. Scroll listeners cause continuous reflow and destroy mobile performance.
- **Standard docked navbar.** Replace with the floating island pattern: a detached glass pill, `mt-6 mx-auto w-max rounded-full`.
- **Hamburger icon that swaps or disappears.** The lines must rotate and translate into a true X using `rotate-45` and `-rotate-45` with absolute positioning.
- **Mobile menu as a dropdown.** Open a screen filling overlay with `backdrop-blur-3xl` over `bg-black/80` or `bg-white/80`, with links staggered in from `translate-y-12 opacity-0` using incremental delays.
- **No hover states on buttons.** Add a background shift, slight scale, or translate.
- **No active or pressed feedback.** Add `scale(0.98)` or `translateY(1px)` on press.
- **Missing focus ring.** Visible focus indicators are an accessibility requirement, not a style choice.
- **No loading states.** Replace circular spinners with skeleton loaders shaped like the real layout.
- **No empty states.** Design a composed "getting started" view instead of a blank panel.
- **No error states.** Inline, specific form errors. Never `window.alert()`.
- **Dead links.** Buttons pointing at `#`. Link them or visually disable them.
- **No current page indicator in navigation.** Style the active link distinctly.
- **Scroll jumping.** Add `scroll-behavior: smooth` for anchor navigation.
- **Animating `top`, `left`, `width`, or `height`.** Switch to `transform` and `opacity` for GPU acceleration.

## Content

- **Generic names like "John Doe".** Use diverse, realistic names.
- **Fake round numbers like `99.99%`, `50%`, `$100.00`.** Use organic data: `47.2%`, `$99.00`, `+1 (312) 847-1928`.
- **Placeholder companies like "Acme Corp", "Nexus", "SmartFlow".** Invent contextual, believable brand names.
- **AI copywriting cliches.** Never "Elevate", "Seamless", "Unleash", "Next Gen", "Game changer", "Delve", "Tapestry", or "In the world of". Write plain, specific language.
- **Vague value propositions.** "Streamline" and "optimize" say nothing. Replace with a measurable outcome: "Cut weekly reporting from 4 hours to 15 minutes".
- **Features listed with no outcome.** Every feature line should state what it means for the user.
- **Weak CTAs.** Never "Learn more" or "Submit". Use a verb plus what they get: "Start free trial", "Book a demo".
- **Competing CTAs above the fold.** One primary action per page.
- **Proof buried at the bottom.** Move testimonials, logos, and numbers next to the claims they support.
- **No risk reversal.** Add at least one of free trial, free plan, no credit card, cancel anytime, money back guarantee.
- **Exclamation marks in success messages.** Remove them. Be confident, not loud.
- **"Oops!" error messages.** Be direct: "Connection failed. Please try again."
- **Passive voice.** "We could not save your changes", not "Mistakes were made".
- **Identical blog post dates.** Randomize them.
- **The same avatar for multiple users.** Unique asset per person.
- **Lorem Ipsum.** Never. Write real draft copy.
- **Title Case On Every Header.** Sentence case instead.

## Component patterns

- **Generic card look: border plus shadow plus white background.** Drop to background color alone, or spacing alone. Cards should exist only where elevation communicates hierarchy.
- **Border on a single side of a card.** Never. Borders go all the way around or not at all.
- **Always one filled button plus one ghost button.** Introduce text links or tertiary styles to cut visual noise.
- **Pill shaped "New" and "Beta" badges.** Try square badges, flags, or plain text labels.
- **Accordion FAQ.** The FAQ section itself should stay, six to twelve questions. Change the pattern: a side by side list, searchable help, or inline progressive disclosure reads better than a stack of chevrons.
- **Three card carousel testimonials with dots.** Replace with a masonry wall, embedded social posts, or one rotating quote.
- **Pricing table with three towers.** Emphasize the recommended tier with color and weight, not extra height.
- **Modals for everything.** Use inline editing, slide over panels, or expandable sections for simple actions.
- **Avatar circles exclusively.** Try squircles or rounded squares.
- **Light and dark toggle as a sun and moon switch.** Use a dropdown, system preference detection, or a settings entry.
- **Four column footer link farm.** Simplify to main paths plus legally required links.

## Iconography and imagery

- **Lucide, Feather, Material Icons, or Material Symbols.** These are the default AI choices. Replace with an approved set from the Design Values section.
- **Rocketship for "Launch", shield for "Security".** Replace cliche metaphors with bolt, fingerprint, spark, vault.
- **Inconsistent stroke widths.** Standardize every icon to one stroke weight.
- **Missing favicon.** Always ship a branded one.
- **Stock "diverse team" photos.** Use real photos, candid shots, or one consistent illustration style.

## Code quality

- **Div soup.** Use `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`.
- **Inline styles mixed with classes.** Move everything into the project's styling system.
- **Hardcoded pixel widths.** Use `%`, `rem`, `em`, and `max-width`.
- **Missing alt text.** Describe the content. Never leave `alt="image"` on a meaningful image.
- **Arbitrary z index like `9999`.** Establish a scale in the theme.
- **Commented out dead code.** Remove all debug artifacts.
- **Import hallucinations.** Verify every import exists in the project dependencies.
- **Missing meta tags.** Add `<title>`, description, `og:image`, and social sharing tags.

## Strategic omissions

What AI builds typically forget entirely:

- **No legal links.** Privacy policy and terms in the footer.
- **No back navigation.** Every page needs a way out.
- **No custom 404.** Design a branded, helpful one.
- **No form validation.** Client side checks for email format and required fields.
- **No skip to content link.** Essential for keyboard users.
- **No cookie consent.** Add a compliant banner where the jurisdiction requires it.
- **Landing page indexing not considered.** Ad only and time bound offers should be `noindex`. Evergreen pages need a real title, meta description, internal links, and a plain question and answer FAQ for AEO.

---

# Upgrade techniques

High impact replacements to pull from once the audit fixes are in.

**Typography**
- Variable font animation, interpolating weight or width on scroll or hover
- Outlined to filled text transitions on scroll entry
- Text mask reveals, with large type acting as a window onto video or imagery

**Layout**
- Broken grid and deliberate asymmetry, with elements overlapping or bleeding off screen
- Whitespace maximization to force focus onto one element
- Parallax card stacks that stick and pile during scroll
- Split screen scroll with halves moving in opposite directions

**Motion**
- Smooth scroll with inertia, decoupled from browser defaults
- Staggered entry, never mounting everything at once
- Spring physics on all interactive elements
- Scroll driven reveals through expanding masks, wipes, or draw on SVG paths

**Surfaces**
- True glassmorphism: `backdrop-filter` plus a 1px inner border and a subtle inner shadow to simulate edge refraction
- Spotlight borders that illuminate under the cursor
- Fixed, `pointer-events: none` grain overlays to break digital flatness
- Colored, tinted shadows carrying the background hue

Note: none of these may reintroduce a background gradient. Depth comes from noise, imagery, shadow, and layering.

---

# Fix priority

Maximum visual impact, minimum risk, in this order:

1. **Font swap** — biggest instant improvement, lowest risk
2. **Color and surface cleanup** — snap to the approved palette, remove background gradients
3. **Hover, active, and focus states** — makes the interface feel alive
4. **Layout and spacing** — grid, max width, spacing scale, nested radius formula
5. **Motion pass** — custom easing curves, scroll reveals via IntersectionObserver, island nav
6. **Replace generic components** — swap cliche patterns for the alternatives above
7. **Loading, empty, and error states** — makes it feel finished
8. **Copy pass** — remove cliches, add specificity, fix CTAs
9. **Type scale polish** — the premium final touch

---

# Rules

- Work with the existing tech stack. Do not migrate frameworks or styling libraries.
- Do not break existing functionality. Test after every change.
- Report the diagnosis before applying fixes. Let the user veto items.
- Check the project's dependency file before importing any new library.
- If the project uses Tailwind, check the version, v3 or v4, before touching config.
- If there is no framework, use vanilla CSS.
- Keep changes reviewable and focused. Small targeted improvements over big rewrites.
- Never invent a design value. If it is not in Design Values, ask.

---

# Design values

The single source of truth for this skill, written for **jinius**, Femi Ojetokun's portfolio (Astro, vanilla CSS, tokens as custom properties scoped to `[data-lens]` on `<html>`). Edit this section to adapt the skill to another design system.

The site is one person seen through **four lenses**. Each lens is its own visual world with its own palette, fonts, shapes and motion. They share content, routes and the lens switcher contract (see `jinius/AGENTS.md`), and nothing else.

| Lens | Route | Idea (keep it) | Stylesheet | Lens skill |
|---|---|---|---|---|
| `home` | `/` | **Ma**: entering a quiet Japanese home. Washi paper, ink, long pauses, one object on display | `src/lenses/home/ma.css` | `ma-classic` |
| `web` | `/web` | **Browser + Inspector**: the portfolio inside a light browser window with real, working devtools | `src/lenses/web/inspector.css` | `inspector-web` |
| `games` | `/games` | **Overworld**: a printed game manual map on paper; walk to each game project, pick up coins | `src/lenses/games/overworld.css` | `overworld-games` |
| `blockchain` | `/blockchain` | **Whitepaper + Ledger**: the page typeset as a LaTeX paper carrying a SHA-256 chain you can verify | `src/lenses/blockchain/whitepaper.css` | `whitepaper-blockchain` |

**How to use this section**

1. Find the lens you are working in from the route or `data-lens`. Load its lens skill and `design/<lens>/DESIGN.md`.
2. Use only that lens's block below. Never carry a token, font, radius or motif from one lens into another.
3. Apply the **Shared values** to every lens, then the lens block, then the **Human pass** for that lens.
4. A `—` in a line height column means the build inherits it; leave it inherited. Values marked **change** differ from what the current build ships. They are the refinement target; list them in the diagnosis so they can be vetoed before you apply them.

---

## Shared values (all four lenses)

The goal is a site a visitor would believe one careful person designed by hand. Each lens already has a strong idea. Refinement means executing that idea with restraint and precision, not adding more of it.

**Surfaces**
- Light only. Every lens sets `color-scheme: light` and never follows `prefers-color-scheme` into a dark theme.
- Never pure white page grounds (the one exception is the web lens's window surface `#FFFFFF`, because it is a browser) and never pure black ink.
- Depth comes from a paper tone step (page → recess) and 1px or 2px rules. No shadows, blur, glass, glow, noise, grain or gradients of any kind, including on text.
- The only permitted `box-shadow` uses are functional, not elevation: the full bleed sticky header trick `box-shadow: 0 0 0 100vmax <page tone>`, the web lens's inset inspect tint, and the games lens's inset paper ring on the level strip.

**One accent, one meaning**
- Each lens has exactly one accent and it always means the same thing. If an element is not on that lens's accent list, it does not get the accent. A fresh page with nothing selected or confirmed is almost entirely ink on paper, and that is correct.
- The focus ring is always the lens accent, 2px solid.

**Typography**
- Each lens has its own fixed pair of typefaces and its own type scale (below). These replace the Tailwind type scale. Snap any off scale size to the nearest step in that lens's table.
- No weight above 700 anywhere.
- No uppercase anywhere. Headings in sentence case. Labels, nav, buttons, tags and meta in lowercase.
- Italics only in the blockchain lens, and only where LaTeX would use them.
- `text-wrap: balance` on every heading, `text-wrap: pretty` on every paragraph.
- `font-variant-numeric: tabular-nums` on clocks, dates, counters, level codes, block heights and hashes.
- Measure: prose never wider than the lens's stated `ch` limit.

**Shape and lines**
- Radius is `0` on page content in every lens. The exceptions are listed per lens and are small and deliberate (a 3px seal, a browser window's 10px corner).
- Lines are 1px. A 2px line is a structural statement (alcove beam, map frame, booktabs rule, active tab) and appears only where the lens block says.

**Motion**
- Motion is short, functional and lens specific (durations below). Hover changes colour or background only.
- No scroll triggered reveals. Content is simply there when you scroll to it.
- No scale on hover, no bounce, no parallax, no spring. Press feedback is `translateY(1px)` or `translateY(2px)` where the lens allows it.
- Between lenses: the existing full page overlay in `src/lib/client/lens-transition.*`. Inside a lens: crossfade only.
- `prefers-reduced-motion: reduce` turns every animation and transition off.

**Icons and imagery**
- No icon library in any lens. Icons are typographic glyphs (→ ← ↗ ↓ ✓ ✕ · §) or drawn in code by the lens (browser chrome icons, pixel sprites, the hanko seal).
- Draw each icon for the size it appears at. When the same icon shows up at two sizes, redraw it at each size and tune its stroke weight by eye, staying within the lens's stated range (web: 1.4–1.5px). Don't scale one drawing with `transform` or `width`. The exception is games lens pixel art, which only ever scales by whole numbers with `image-rendering: pixelated`.
- No stock photos, picsum placeholders, device mockups, 3D, emoji or decorative illustration. A missing screenshot is a visible, styled `[project screenshot]` placeholder in an image well.

**Copy (applies across lenses)**
- First person, plain, specific. Short sentences. The tone of someone showing their own work to one person, not marketing to a crowd.
- Never invent facts. Anything not in `AGENTS.md` §1 is a visible `[placeholder]`.
- No em dashes inside prose sentences; use a full stop or a comma. Em dashes are allowed only in fixed patterns the lens defines (a footer gloss, a figure caption, a running head).
- No rhetorical triads ("fast, accessible and beautiful"), no "passionate", "crafting", "pixel perfect", "seamless", "elevate", "journey". No exclamation marks.
- The middle dot `·` is the separator for meta lines across all lenses.
- Small true details beat claims: the live `lagos · HH:MM` clock, a build month, a real git sha, real hashes, real role and status labels.

**Small craft details (all lenses)**
- Links: 1px underline, offset 3px (the home lens uses 5px), colour per lens below.
- Text selection uses the lens's own tones (**change**: no lens sets `::selection` today; values per lens below).
- Touch targets ≥ 44 × 44px. Body text ≥ 4.5:1, large text ≥ 3:1.
- Never centre what can be offset. Deliberately uneven values (a divider node at 30% or 70%, bamboo leaning −1.2° / +1.4° / −0.6°) are what make a layout feel placed by hand. Do not tidy them into symmetry.

---

## Audit rules that change for jinius

The audit above was written for generic product sites. For this portfolio, these rules are replaced. Everything else in the audit applies as written.

| Audit rule | For jinius |
|---|---|
| Approved fonts, "two typefaces on one site" | Each lens has its own fixed pair (below). Two faces per lens is correct. Never swap them for Geist, Inter or any other face. |
| Italic type anywhere | Allowed in the blockchain lens only (affiliation, bylines, emphasis, venue names, code comments). Banned elsewhere. |
| Tailwind type scale, snap to step | Snap to the lens's own scale table. |
| Dark background palette | Not used. All lenses are light. |
| Hero heading gradient | Not used. Headings are flat ink. |
| Add noise or grain; background imagery for empty sections | Not used. Empty paper is the design, especially in the home lens. |
| Tint shadows toward the background hue | Not used. No elevation shadows. |
| `duration-700` custom bezier baseline; 800ms blur fade up reveals | Replaced by each lens's motion values. No scroll reveals. |
| Floating glass island navbar | Not used. Each lens has its own header (below). |
| Full screen blurred mobile menu | Not used. Nav wraps or scrolls horizontally as each lens defines. |
| Phosphor / Solar / Iconamoon icons | Not used. Glyphs and lens drawn icons only. |
| Max width 1200 to 1440px; hero cap 680px | Use each lens's container. |
| Pricing, risk reversal, testimonials, logos, FAQ, cookie banner | Do not add. This is a personal portfolio with no tracking. |
| Spacing scale 0 to 96px | Use each lens's spacing values, including its `clamp()` section padding. |
| Avatars as squircles | No avatars. The home seal and the games player sprite are the only marks of the person. |

---

## Lens: home (`/`) — Ma

**Keep:** a calm Japanese home. Washi paper, ink, bamboo, lattice, a hanko seal. Vast negative space. One object on display at a time.

**Signature moment:** the tokonoma, an alcove holding the single featured project.

**Palette**

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F4F0E6` | page background |
| `--paper-recess` | `#ECE6D7` | tokonoma, image wells, hover fill |
| `--paper-faint` | `#EAE4D4` | the large background 間 only |
| `--wood-beam` | `#D2C9AE` | 3px alcove beam, bamboo node rings |
| `--lattice` | `#D9D1BB` | shoji lines, hairlines |
| `--node` | `#C9C0A6` | divider node, leaf outlines |
| `--bamboo-1/2/3` | `#E6DFCA` · `#EAE4D2` · `#EDE8D8` | bamboo stalks, nearest to farthest |
| `--numeral` | `#A39B85` | decorative kanji numerals (`aria-hidden`) |
| `--ink` | `#2B2A26` | text, primary button border |
| `--ink-soft` | `#625D52` | secondary text (lightest colour ever used for text) |
| `--seal` | `#B8412A` | **accent**: the hanko seal, focus ring, active switcher mark. Nowhere else |
| `--on-seal` | `#FBF8F1` | text on the seal |

Selection (**change**): background `--lattice`, colour `--ink`.

**Type:** Shippori Mincho (display, titles, bio) and Zen Kaku Gothic New (body, labels, nav).

| Role | Face | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| Display h1 | Mincho | 400 | `clamp(44px, 6.4vw, 96px)` | 1.14 | −0.005em |
| Section h2 | Mincho | 400 | `clamp(32px, 3.6vw, 48px)` | 1.2 | 0 |
| Contact h2 | Mincho | 400 | `clamp(40px, 5.6vw, 80px)` | 1.15 | 0 |
| Project h3 | Mincho | 500 | 26px grid, 34px tokonoma | 1.2 | 0 |
| Bio | Mincho | 400 | `clamp(19px, 1.6vw, 22px)` | 1.85 | 0 |
| Lead | Gothic | 400 | `clamp(16px, 1.3vw, 18px)` | 1.9 | 0.02em |
| Body | Gothic | 400 | 16px | 1.8 | 0.02em |
| Nav | Gothic | 400 | 14px | — | 0.08em |
| Label, meta | Gothic | 400 | 13px | 1.6 | 0.10–0.14em |
| Vertical kanji label | Mincho | 400 | 15px | — | 0.3em, `vertical-rl` |

Measure: h1 ≤ 13ch, lead ≤ 40ch, bio ≤ 56ch, detail prose ≤ 64ch. Weights 400 and 500 only (600 inside the seal).

**Layout:** container 1200px, gutter `clamp(24px, 5vw, 64px)`. Section top padding: hero `clamp(96px, 14vw, 200px)`, work `clamp(96px, 12vw, 168px)`, about `clamp(120px, 14vw, 200px)`, contact `clamp(140px, 16vw, 240px)`. Internal gaps 36 / 48 / 56px. Text flush left; nothing centred except inside image wells. Main column `flex: 999 1 560px`.

**Shape and lines:** radius 0, except seal 3px, primary action 2px, tokonoma `0 0 2px 2px`. 1px `--lattice` hairlines; the 3px `--wood-beam` alcove beam is the heaviest line on the page. Shoji grid is `gap: 1px` over a `--lattice` ground.

**Motion:** hover 160ms ease-out (colour, background, underline colour). Crossfade 240ms ease-out. Bamboo sway ±1.6° over 9–11s, ease-in-out; off under reduced motion.

**Header and switcher:** seal + name (Mincho 17px) left, nav, `lagos · HH:MM` 13px tabular. No border, 28px vertical padding. Switcher: lowercase words, 13px, 0.12em tracking, a 6px seal square before the current lens.

**Links:** ink, 1px underline, offset 5px.

**Human pass**
- **Motif budget.** At most two decorative devices visible in any one viewport (seal excepted). Bamboo and 間 belong to the hero; the shoji grid belongs to work; the divider appears twice per page. Never add a third motif to fill space.
- **Vertical kanji labels earn their place.** Use them where a section opens a new room (work, about, contact), not on every block. If two sit in one viewport, drop one.
- **Rooms are not identical.** Sections must not share the same scaffold and height. One room is tall and nearly empty, one is dense rows, one is a single object.
- **Quiet enough to miss.** A visitor should be able to scroll once without consciously noticing anything "Japanese". If the reference is the first thing you see, it is too loud.
- **Never:** cherry blossom, torii, Fuji, waves, koi, lanterns, ensō, brush fonts, red and black "oriental" palettes, invented Japanese text, bold weights, chips or badges, stats or logos to fill space.

---

## Lens: web (`/web`) — Browser + Inspector

**Keep:** the portfolio rendered inside a light, generic browser window with working devtools docked beside it. Tabs are the lens switcher. "Here is my work, and here is how it is built."

**Signature moment:** the inspector actually works (select, untick CSS, swap `--accent`, box model, grid overlay, console).

**Palette**

| Token | Value | Use |
|---|---|---|
| `--desk` | `#ECEEF2` | page ground around the window |
| `--window-line` | `#D3D8DF` | 1px window outline |
| `--chrome` | `#F1F3F6` | tab strip, URL field |
| `--surface` | `#FFFFFF` | active tab, toolbar, page, devtools body |
| `--panel` | `#F7F8FA` | devtools toolbar, breadcrumb, console bar |
| `--line` · `--line-strong` | `#E3E5E8` · `#D5D9DF` | dividers · outlines |
| `--ink` · `--ink-2` · `--ink-3` | `#15171C` · `#3C4250` · `#4B5262` | text · chrome UI text · secondary text |
| `--icon-decor` · `--dots` | `#8A909C` · `#C9CED6` | decorative icons and window dots only |
| `--inspect` | `#1F3BD6` | **fixed accent**: selection outline, inspect chips, active devtools tab, focus ring |
| `--inspect-tint` · `--inspect-hover` | `rgba(31,59,214,.06)` · `.03` | inset overlay tints |
| `--row-selected` · `--row-hover` | `#E4E9FB` · `#F1F3F8` | Elements rows, pressed toggles |
| `--accent` | `#1F3BD6` default; `#0B6E4F` · `#B4410E` · `#15171C` | **page accent**, user swappable: page CTA, page links, active favicon |
| `--card-bg` · `--well` | `#FAFAFB` · `#F3F4F6` | page cards · image wells |
| Syntax | tag `#8A2BAE` · attr `#94500A` · value `#1F3BD6` · prop `#B3261E` · muted `#5B6270` | devtools only |

Box model, grid overlay and console colours stay exactly as defined in `inspector.css`. `--inspect` never follows `--accent`.

Selection (**change**): background `--row-selected`, colour `--ink`.

**Type:** Archivo (page and chrome, normal width) and JetBrains Mono (everything in devtools, URL, stack lines).

| Role | Face | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| Page h1 | Archivo | **700** (change, was 800) | 64px / 40px phone | 1 | **−0.025em** (change, was −0.035em) |
| Contact h2 | Archivo | **700** (change) | 56px / 40px | 1 | **−0.025em** (change, was −0.03em) |
| Section h2 | Archivo | **700** (change) | 28px | — | −0.02em |
| Card h3 | Archivo | **700** (change) | 22px | — | −0.015em |
| Site name | Archivo | **700** (change) | 16px | — | −0.01em |
| Lead | Archivo | 400 | 19px / 17px | 1.6 | 0 |
| Body | Archivo | 400 | 16px (15px in cards) | 1.6 | 0 |
| Button | Archivo | 700 | 15px | — | 0 |
| Label, meta | Archivo | 600 | 12–13px | — | 0 |
| Chrome tabs | Archivo | 400, active 700 | 13px | — | 0 |
| Devtools code | JetBrains Mono | 400 | 12.5px | 1.5 | 0 |
| Breadcrumb · chips | JetBrains Mono | 400 | 11.5px · 11px | — | 0 |

Measure: h1 ≤ 12ch, lead ≤ 46ch.

**Layout:** desk padding `clamp(12px, 2.5vw, 36px)`. Window `max-width: 1360px`. Panes: viewport `flex: 999 1 560px`, devtools `flex: 1 1 380px`, height `clamp(480px, calc(100dvh - 220px), 760px)`. Page inside the viewport `max-width: 880px`, padding `30px 48px 0` (`30px 20px 0` phone); hero `56px 64px`; sections split by 1px rules with 28–48px top padding. Projects grid `repeat(auto-fill, minmax(min(100%, 240px), 1fr))`, gap 16px. About grid `180px minmax(0, 1fr)`, gap 32px.

**Shape and lines:** window 10px, tabs `8px 8px 0 0`, URL field 17px (pill), devtools buttons and inputs 4–6px, inspect chips 3px. **Page buttons and cards: 0.** 1px lines everywhere; 2px only for the active devtools tab underline and the selection outline.

**Motion (change: the lens defines none today):** chrome hover 140ms ease-out, background only. Inspector overlays, selection outlines and box model updates are **instant**, as real devtools are. No animated highlight boxes.

**Header and switcher:** the tab strip is the only switcher: three neutral dots, then `home`, `web`, `games`, `blockchain` tabs with mono letter favicons; current tab raised white with `aria-current="page"`. No second instance in the hero.

**Links:** `--accent`, 1px underline (2px on the hovered nav item), offset 3px.

**Human pass**
- **The page stands alone.** Close devtools and the page inside the window must still read as a quiet, well set typographic portfolio. If it only works because of the chrome around it, the page is underdesigned.
- **Heavy black display with very tight tracking is the stock AI landing headline.** Hence the cap at 700 and −0.025em. Let size and white space carry the headline.
- **Devtools look used, not staged.** Real selectors, real file:line links, real computed box model values, a short console greeting. No lorem, no fake class names like `.hero-wrapper-container`.
- **Generic, not a clone.** Neutral grey dots, our own icons. No browser logos, coloured traffic lights or copied UI.
- **Never:** dark theme, full bleed colour fields, drop shadows on the window, rounded page cards, glassy toolbars, syntax colour on the page itself.

---

## Lens: games (`/games`) — Overworld

**Keep:** a light paper page carrying one tiny game. A pixel art overworld map in muted print tones, like the fold out map in an old game manual. Each game project is a level you walk to; one coin per road.

**Signature moment:** the map. Everything around it is plain paper and ink.

**Palette (page CSS)**

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F5EF` | page background |
| `--recess` | `#EEEBE2` | level dialog, hover fills |
| `--ink` | `#1E1D1A` | text, borders, map frame, primary buttons |
| `--ink-soft` | `#5C5A53` | secondary text, meta |
| `--rule` | `#D8D4C8` | hairlines, decorative |
| `--rule-strong` | `#8C887C` | link underlines, key cap borders |
| `--gold` | `#A97409` | **accent, "this is you / you got it"**: current lens square, focus ring, HUD coin, visited square, achievement square. Never text, buttons or backgrounds |
| `--map-ground` | `#DFE5D2` | canvas backdrop while loading |

Map art colours (ground, road, water, wood, foliage, rock, outline `#2E2D29`, sprite shadow `rgba(46,45,41,.13)`, coin, player) live in `src/lenses/games/palette.ts` and are canvas only, never page CSS.

Selection (**change**): background `--rule`, colour `--ink`.

**Type:** Pixelify Sans 400/500 (display: h1, h2, level names, map labels, buttons, HUD, key caps) and Atkinson Hyperlegible 400/700 (all reading text).

| Role | Face | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| h1 (index) | Pixelify | 400 | `clamp(40px, 6.4vw, 76px)` | 1.02 | −0.01em |
| h1 (level page) | Pixelify | 400 | `clamp(40px, 6vw, 72px)` | 1.04 | 0 |
| Level title | Pixelify | 400 | `clamp(30px, 3.4vw, 42px)` | 1.08 | 0 |
| Section h2 | Pixelify | 400 | `clamp(26px, 3vw, 34px)` | — | 0 |
| Level list name | Pixelify | 400 | 22px | — | 0 |
| Brand · buttons | Pixelify | 500 · 400 | 18px · 15px | 1 | 0.02em |
| Body | Atkinson | 400 | 16px | 1.7 | 0.01em |
| Lead (level page) | Atkinson | 400 | 18px | 1.7 | 0.01em |
| Meta, eyebrow, caption | Atkinson | 400 | 13–14px | — | 0.04–0.1em |

Measure: write ups ≤ 62ch, level lead ≤ 52ch. The pixel face never sets a paragraph and never goes above 500.

**Layout:** container 1040px, padding `clamp(20px, 5vw, 56px)`. 28px between blocks on the index, 56–96px between sections on level pages. Map canvas 320 × 176 logical px, integer scaled, `image-rendering: pixelated`, never taller than about 62vh.

**Shape and lines:** radius 0 everywhere; the pixel grid is the softness. Map frame and dialog top rule 2px ink. Row hairlines 1px `--rule`. Buttons, labels and toast 1px or 2px ink.

**Motion:** UI 160ms `cubic-bezier(0, 0, .2, 1)`, background only. Toast 240ms opacity and transform, 3.2s on screen. Coin pickup 0.45s. Press: `translateY(2px)`. Reduced motion: the player moves instantly, water and coins stop.

**Header and switcher:** player head sprite + "Femi Ojetokun" in Pixelify 18px, lens switcher with a 6px gold square before the current lens, `lagos · HH:MM` in ink soft. Sticky, paper background.

**Links:** ink, 1px underline in `--rule-strong`, offset 3px.

**Human pass**
- **Print, not screen.** If the map looks like a bright retro game screenshot, the palette is wrong. Muted tones, 1px ink outlines, flat 2px shadows.
- **The game stays in the frame.** Outside the map the page is as quiet as the home and blockchain lenses. No pixel borders on cards, no pixel cursors, no chiptune, no "press start" copy.
- **Pixel type is for short labels.** Keep Pixelify lines short (a heading, a name, a button). Long Pixelify headings read as a novelty font demo.
- **The list is the navigation.** Every level is a plain link in the level select list; the map is an enhancement that can fail without losing anything.
- **Never:** enemies, timers, lives, scores that gate content, bright saturated palettes, uppercase, shadows, rounded corners, a dark arcade theme.

---

## Lens: blockchain (`/blockchain`) — Whitepaper + Ledger

**Keep:** the page set as a scientific paper (title block, abstract, numbered sections, sidenotes, booktabs tables, one display equation, references) carrying a working ledger of SHA-256 chained blocks that visitors verify in the browser.

**Signature moment:** "verify chain", ticking each block ✓ and ending on `chain valid · n blocks`.

**Palette**

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FCFCFA` | page background |
| `--ledger` | `#F2F2EE` | ledger row hover, linked parent block |
| `--code` | `#F5F5F1` | code figures |
| `--desk` | `#E9E9E4` | behind the sheet, "sheet on desk" option only; never text on it |
| `--ink` | `#141414` | text, booktabs rules, button borders, primary fill |
| `--ink-soft` | `#4F4F4B` | bylines, labels, sidenotes, table headers |
| `--ink-faint` | `#6E6E69` | sidenote numbers and small meta only |
| `--rule` · `--rule-strong` | `#CFCFC8` · `#8A8A84` | hairlines · link underlines and control edges |
| `--confirm` | `#1F6B45` | **accent, "confirmed"**: ✓ ticks, "chain valid", live status dot, focus ring, `[ ]` around the current lens. Nothing else |

No other colour. No syntax highlighting colour. A page where nothing is verified and nothing is live is black and white.

Selection (**change**): background `--rule`, colour `--ink`.

**Type:** Latin Modern Roman (400, 400 italic, 700, 700 italic) for reading and headings; IBM Plex Mono (400, 500, 600 for code keywords) for ledger, labels, buttons, code, running head. Math in Latin Modern Math.

| Role | Face | Weight | Size | Line height | Notes |
|---|---|---|---|---|---|
| Title h1 | LM | 400 | `clamp(32px, 4.8vw, 52px)` | 1.15 | centred, ≤ 18ch, −0.005em |
| Section h2 | LM | 700 | 26px | 1.25 | number, 1em gap, title |
| Paper h3 | LM | 700 | 20px | — | `2.1  Title` |
| Authors | LM | 400 | 20px | — | |
| Affiliation, byline | LM italic | 400 | 16px | — | ink soft |
| Body | LM | 400 | 18px | 1.55 | justified + `hyphens: auto` ≥ 640px, ragged below |
| Abstract | LM | 400 | 16px | 1.5 | 34rem wide, label 15px bold |
| Caption | LM | 400 | 15px | — | "Figure n:" bold |
| Sidenote | LM | 400 | 14px | 1.45 | ink soft; number mono 12px ink faint |
| Mono UI | Plex Mono | 400/500 | 13px | — | lowercase, tabular |
| Code | Plex Mono | 400 | 13.5px | 1.6 | keywords 600, comments italic ink soft |

Body never below 17px; Latin Modern runs thin on screens.

**Layout:** prose `--measure: 40rem` + 3rem gap + 15rem margin column = 58rem container, padding `clamp(20px, 5vw, 48px)`. Section padding `clamp(64px, 8vw, 112px)`. Base unit 4px; gaps 8 / 12 / 20 / 28 / 36 / 44px. Title block centred; everything else flush left. Wide elements (ledger, code figures) span text + margin.

**Shape and lines:** radius 0; the 7px status dot is the only round thing. booktabs: 2px ink top and bottom rule, 1px ink mid rule, no vertical rules ever. Hairlines 1px `--rule`.

**Motion:** UI 140ms `cubic-bezier(.2, .6, .2, 1)`. Ledger tick 90ms per block. Crossfade 180ms. Nothing types, counts or scrolls by itself.

**Header and switcher:** sticky mono running head, hairline below: `f. ojetokun — onchain systems` left, switcher centre (current lens as `[blockchain]` with confirm green brackets), current `§` section and `lagos HH:MM` right.

**Links:** ink, 1px underline in `--rule-strong`, offset 3px; underline turns ink on hover. External links end in ↗.

**Human pass**
- **A real paper, not a costume of one.** Follow LaTeX `article` conventions exactly: numbering in page order, bold only where LaTeX bolds, italics only where LaTeX italicises, captions below figures and above tables. Decorative `§` signs, fake equations or ornamental hex strings are the giveaway.
- **Everything is checkable.** Hashes are computed at build time, equation (1) states exactly the rule the code uses, and the colophon carries the real git sha. Never `Math.random()` hashes, invented addresses or stats.
- **Density is the point.** This is the densest lens. Resist adding air; give it rhythm through rules and numbering instead.
- **Never:** crypto landing tropes (neon, dark mode, glow, wallet buttons, chain logos, coins, cubes, rockets), blue (web lens), orange or gold (games), vermilion (home), boxes around sections, rounded tables.

---

## Credits

This skill is adapted from [redesign-skill](https://github.com/elayadesign/redesign-skill) by [Elaya](https://elaya.design/), MIT licensed. It is based on the first version of that skill (commit `724a0cc`). The audit, upgrade techniques, fix priority and rules sections are Elaya's; the Design values section was rewritten for jinius.

<details>
<summary>redesign-skill license</summary>

```
MIT License

Copyright (c) 2026 Elaya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
</details>

Parts of the original skill were adapted from [taste-skill](https://github.com/Leonxlnx/taste-skill) by Leon Lin ([@LexnLin](https://x.com/LexnLin)), MIT licensed. Its redesign audit structure, content realism checks, and motion and navigation ideas informed the matching sections here.

<details>
<summary>taste-skill license</summary>

```
MIT License

Copyright (c) 2026 Leonxlnx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
</details>
