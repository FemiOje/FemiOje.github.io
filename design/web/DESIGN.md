# Design Guidelines — Browser + Inspector (web lens)

## Visual Style
- **Aesthetic**: The portfolio rendered *inside* a light browser window with developer tools docked open. The browser tabs are the lens switcher, the viewport holds a clean, typographic portfolio page, and the inspector beside it is live: select elements, untick CSS, recolour `--accent`, see the box model, run console commands
- **Mood**: Confident, playful, transparent — "here's my work, and here's how it's built; go ahead, take it apart." The craft is the proof
- **Inspiration**: Browser developer tools (Elements tree, Styles pane with property checkboxes, box model, grid badges, device toolbar, Console), Swiss-rooted typographic restraint for the page inside the window
- **Lens**: This is the **web** lens (route `/web`) of Femi Ojetokun's portfolio — it speaks to people hiring a frontend / web engineer. It lives on a light ground so it sits in the same family as the classic lens (warm washi off-white) and the blockchain lens (cool whitepaper white). Never a dark theme, never a full-bleed colour field
- **Not a clone**: generic browser and inspector chrome — neutral grey window dots, our own icons and colours. Never copy a specific browser's logo, icons, exact UI or trade dress

## Color Palette
- **Desk**: `#ECEEF2` — page background around the window
- **Window border**: `#D3D8DF` — 1px outline of the browser window
- **Chrome**: `#F1F3F6` — tab strip background, URL field
- **Surface**: `#FFFFFF` — active tab, toolbar, viewport page, devtools body
- **Panel**: `#F7F8FA` — devtools toolbar, breadcrumb bar, console command bar
- **Line**: `#E3E5E8` — dividers inside the page and devtools
- **Line strong**: `#D5D9DF` — devtools border, button outlines, phone-frame edges
- **Ink**: `#15171C` — primary text everywhere
- **Ink 2**: `#3C4250` — UI text in chrome (inactive tabs, URL, icons-as-buttons)
- **Ink 3**: `#4B5262` — secondary text on the page and in devtools (7.6:1 on white)
- **Icon decor**: `#8A909C` — decorative browser nav icons only (`aria-hidden`), never text
- **Window dots**: `#C9CED6` — the three neutral dots (decor)
- **Inspect blue**: `#1F3BD6` — selection outline, inspect labels/chips, active devtools tab underline, focus ring. Fixed; never changes with `--accent`
- **Inspect tint**: `rgba(31,59,214,0.06)` selected · `rgba(31,59,214,0.03)` hovered — painted as an inset box-shadow so element backgrounds stay visible
- **Selected row**: `#E4E9FB` · **Hovered row**: `#F1F3F8` — Elements tree rows; also the pressed state of devtools toggle buttons
- **Accent (`--accent`)**: `#1F3BD6` ultramarine *(default)* · `#0B6E4F` green · `#B4410E` rust · `#15171C` ink — page CTA background, page links, active-tab favicon. Swappable live from the Styles pane
- **Syntax**: tag `#8A2BAE` · attribute name `#94500A` · attribute value `#1F3BD6` · CSS property `#B3261E` · punctuation/muted `#5B6270` · text `#15171C`
- **Console**: return value `#1A3FC4` · error text `#B3261E` on `#FDEEEE` with `#F5C2C0` divider · input prompt `›` in inspect blue
- **Grid overlay**: `#8A2BAE` dashed item outlines on a `rgba(138,43,174,0.10)` gap tint
- **Box model**: margin `#F7E2C6` (dashed `#B88A57`) · border `#FBEDBB` (`#C2A653`) · padding `#D6E8C1` · content `#C9DDF3` — all with ink text
- **Page card**: `#FAFAFB` background · image well `#F3F4F6`

## Typography
- **Page + UI font**: **Archivo** (variable, SIL OFL) — the portfolio page, browser chrome, devtools tab labels. Normal width (no condensed)
- **Code font**: **JetBrains Mono** (SIL OFL) — Elements tree, Styles pane, Console, URL field, inspect labels/chips, stack lines on cards
- **Fallbacks**: Archivo → `'Helvetica Neue', Arial, sans-serif` · JetBrains Mono → `ui-monospace, Menlo, Consolas, monospace`
- **Page h1**: Archivo 800, 64px desktop / 40px phone, `line-height: 1`, `letter-spacing: -0.035em`, max 12ch
- **Page h2**: Archivo 800, 28px, `letter-spacing: -0.02em`; contact headline 56px / 40px, `line-height: 1`, `letter-spacing: -0.03em`
- **Card title h3**: Archivo 800, 22px, `letter-spacing: -0.015em`
- **Lead**: Archivo 400, 19px / 17px, `line-height: 1.6`, ink 3, max 46ch
- **Body**: Archivo 400, 14–17px, `line-height: 1.55–1.6`
- **Labels / meta**: Archivo 600, 12–13px, ink 3, lowercase
- **Site name**: Archivo 800, 16px, `letter-spacing: -0.01em`
- **Chrome UI**: Archivo 13px (tabs 400, active 700; devtools button 600)
- **Devtools**: JetBrains Mono 12.5px, `line-height: 1.5`; breadcrumb 11.5px; chips/labels 11px; tab labels Archivo 600 12.5px
- **Case**: page headings sentence case ("Interfaces that hold up under inspection.", "Say hello."); labels, nav and tabs lowercase; code exactly as code

## Spacing & Layout
- **Desk padding**: `clamp(12px, 2.5vw, 36px)` around the window
- **Window**: `max-width: 1360px`, centred, 1px border, 10px radius, overflow hidden
- **Tab strip**: padding `8px 10px 0`; tabs `min-height: 38px`, `padding: 0 16px`
- **Toolbar**: padding `8px 12px`; URL field 34px tall, fully rounded
- **Panes**: flex row — viewport `flex: 999 1 560px`, devtools `flex: 1 1 380px`; panes 760px tall on desktop (or fill the window height); each scrolls on its own
- **Page inside viewport**: `max-width: 880px`, centred, padding `30px 48px 0` (desktop) / `30px 20px 0` (phone). Hero padding `56px 64px`; sections separated by 1px line rules with 28–48px top padding
- **Projects grid**: `repeat(auto-fill, minmax(min(100%, 240px), 1fr))`, gap 16px
- **About**: grid `180px minmax(0, 1fr)`, column gap 32px, 2px-weight feel via a 1px ink top rule
- **Devtools**: toolbar 40px; Elements tree ~290px tall; breadcrumb bar; Styles pane fills the rest
- **Device mode**: viewport frame narrows to 390px, centred on a `#E9EBEE` surround with 1px edges
- **Mobile (real phones)**: the window keeps its chrome; tabs scroll horizontally; devtools stack below the viewport and start closed

## Borders & Radius
- **Window**: 10px radius · **tabs**: `8px 8px 0 0` · **URL field**: fully rounded (17px) · **devtools buttons, inputs, console chips**: 4–6px · **inspect chips/labels, grid badge**: 3px · **page buttons and cards**: **0** (square, Swiss-rooted)
- **Lines**: 1px everywhere. The only 2px lines are the active devtools tab underline and the selection outline

## Shadows & Elevation
- **None.** The window is flat on the desk with a 1px border. No drop shadows, blur, glass or gradients
- The only "shadow" is the inspect tint, implemented as `box-shadow: inset 0 0 0 9999px rgba(31,59,214,.06)` — an overlay, not elevation

## Buttons
- **Page primary (`.btn`)**: `--accent` background, white text, Archivo 700 15px, `padding: 14px 22px`, `min-height: 44px`, radius 0, no underline. Hover: ink background
- **Page secondary**: plain underlined text button ("or type `help()` in the console") — opens the Console
- **Browser "devtools" toggle**: 1px line-strong border, 6px radius, Archivo 600 13px, `aria-pressed`; pressed = selected-row fill
- **Devtools icon buttons** (select element, device toolbar, close): 32 × 32px, transparent, 4px radius; pressed = selected-row fill + inspect-blue icon
- **Devtools tabs**: text buttons, 40px tall, 2px inspect-blue underline when active, `aria-pressed`
- **Console chips**: white, 1px line-strong, 4px radius, mono 11.5px, `min-height: 30px`

## Icons
- Thin stroke icons (1.4–1.5px), 12–16px, `currentColor`, square-ish line caps: back, forward, reload (decor), lock, code brackets (devtools), cursor-in-box (select element), phone (device), close ×
- Lens favicons in tabs: 16px rounded squares with a lowercase mono letter (`c`, `w`, `g`, `b`); active tab's favicon filled with `--accent`
- No emoji, no illustrations, no browser logos

## Components Spotted
- **Tab strip = lens switcher**: three neutral window dots, then four tabs — `classic`, `web`, `games`, `blockchain`; the current lens is the raised white tab with `aria-current="page"`
- **Toolbar**: decorative back/forward/reload, URL field (`lock` + host + `/`**web**), "devtools" toggle on the right
- **Viewport page**: site nav (name + work/about/contact), hero (label with Lagos time, h1, lead, CTA + console link), "Selected work" grid of cards, About (heading + paragraph + facts list), Contact ("Say hello." + links), © line
- **Card**: 1px border, 20px padding, `#FAFAFB`; number + status row, 16:10 image well, title, summary, mono stack line
- **Selection overlay**: 2px inspect-blue outline (offset 2px) + inset tint on the selected element; 1px dashed outline on the hovered one; a blue label above it reading `selector  W × H`
- **Inspect mode**: every inspectable element gets a small white chip (tag name, inspect-blue text) at its top-left; clicking one selects it; the selected chip turns blue and shows the full label
- **Devtools shell**: toolbar (select element · device toolbar · | · Elements · Console · spacer · device size · close)
- **Elements tree**: syntax-coloured HTML outline, indented 14px per level; inspectable rows are buttons (hover highlights the element on the page, click selects); collapsed children shown as `…`; a `grid` badge on grid containers toggles the grid overlay
- **Breadcrumb**: `html › body › main › section.hero › h1.hero__title`
- **Styles pane**: `element.style { }`, then the selected element's rule with a file:line link and a checkbox per declaration (untick = struck through and removed live), then `:root { --accent: ■ ■ ■ ■ #hex; }` with clickable swatches
- **Box model**: nested margin › border › padding › content boxes with real computed values
- **Console**: greeting line (`femi.hello()` → string), output lines with `›` input, `←` return and `✕` error prefixes, a row of command chips, and a text input with a `›` prompt

## Imagery & Illustration
- Project screenshots sit in square image wells inside cards (1px line border); until supplied, the well shows a mono `[project screenshot]` placeholder
- No device mockups, no stock imagery, no illustrations — the browser window *is* the illustration

## Overall Replication Notes
Key things an AI coding tool must know to nail this style:

- **Light family**: desk `#ECEEF2`, white window, white page. No dark mode, no full-bleed colour fields
- **The tabs are the lens switcher** — real `<a href>` links inside `<nav aria-label="Choose a lens">`
- **The inspector must be real**: selecting, hover-highlighting, unticking CSS, swapping `--accent`, grid overlay, device mode, box model and console all work. A static picture of devtools misses the point
- **Inspect blue is fixed**; `--accent` is the page's colour and is user-swappable. Keep them separate
- **Two fonts**: Archivo for the page and chrome, JetBrains Mono for code. Page buttons and cards are square; chrome has gentle radii
- **Overlay never shifts layout**: use `outline` + inset `box-shadow` and absolutely positioned labels/chips
- **Generic, not a clone**: no browser logos, coloured traffic lights or copied UI
- **Facts only**: console output and page copy use only the facts in AGENTS.md; everything else is a `[placeholder]`