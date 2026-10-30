# Design Guidelines — Overworld (games lens)

## Visual Style
- **Aesthetic**: A printed game map on light paper. The page is a calm sibling of the home (washi) and blockchain (whitepaper) lenses: paper, near-black ink, hairlines, square corners, one small accent. The only game-flavoured layer is the overworld itself, a small pixel-art map in muted print tones with thin ink outlines, like the fold-out map in an old game manual
- **Mood**: Playful but quiet. Inviting someone to walk, not shouting at them. A visitor should feel they switched lenses in the same house, not left for a different site
- **Inspiration**: overworld maps of classic console platformers (the convention, never any game's art), fold-out paper maps in game manuals, board-game rulebooks, the sister lenses' own paper-and-ink rules
- **The one game**: walk a character between levels and pick up one coin per path. That is the whole game. Nothing to lose, no timer, no score pressure

## Color Palette

### Page (CSS)
- **Paper**: `#F7F5EF` — sits between home's warm washi `#F4F0E6` and blockchain's cool white `#FCFCFA`. Never pure white
- **Recess**: `#EEEBE2` — the level dialog, hover fills
- **Ink**: `#1E1D1A` — text, borders, the map frame, primary buttons. Never pure black
- **Ink soft**: `#5C5A53` — secondary text, labels, meta
- **Rule**: `#D8D4C8` — hairlines between rows, decorative only
- **Rule strong**: `#8C887C` — link underlines, key-cap borders (3.2:1 on paper)
- **Gold (the one accent)**: `#A97409` — means "this is you / you got it". Only on: the current-lens square in the switcher, the focus ring, the coin square in the HUD, the "visited" square in the level list, the achievement square in the toast. Never on text, links, headings, buttons or backgrounds

### Map art (canvas only — never used as page CSS)
- **Ground**: `#DFE5D2` · tufts `#C3CDB1`
- **Road**: `#F7F3E7` · edge `#9C9783`
- **Water**: `#C4D7DD` · shimmer `#E6F0F1` · bank `#93AEB7`
- **Wood (bridges)**: `#D2BF98` · planks `#8E7C5D`
- **Foliage**: leaf `#A3B58F` · dark `#81966F` · light `#C3D0B0` · trunk `#7A6A55`
- **Rock**: `#BDBAAE` · light `#DCD9CE`
- **Outline**: `#2E2D29` — every sprite gets a 1px outline in this colour
- **Shadow**: `rgba(46, 45, 41, .13)` — flat 2px ellipse under sprites
- **Coin**: `#D9A21B` · dark `#9C720F` · shine `#F3DC93` — brighter than the page gold because it sits inside a 1px ink outline
- **Player**: hair `#3A3530`, skin `#9A6A4A`, scarf = coin gold, tunic `#7D93B6` / `#61779C`, trousers `#5A5850`

## Typography
- **Display (pixel)**: Pixelify Sans 400 / 500 (SIL OFL, `@fontsource/pixelify-sans`). Used for: h1, h2, level names, map labels, buttons, HUD, key caps. Never for paragraphs
- **Body**: Atkinson Hyperlegible 400 / 700 (SIL OFL, `@fontsource/atkinson-hyperlegible`). Paragraphs, eyebrows, meta, tags, list descriptions
- **Scale**: h1 `clamp(40px, 6.4vw, 76px)` / line-height 1.02 · level title `clamp(30px, 3.4vw, 42px)` · section h2 `clamp(26px, 3vw, 34px)` · level-list name 22px · body 16px / 1.7 · meta 13–14px with `letter-spacing: .06–.1em`
- **Case**: headings in sentence case ("Pick a level.", "Level select"). Labels, nav, buttons, tags, eyebrows and map labels in lowercase. Never uppercase
- **Weight**: pixel face never above 500. Body bold only for inline emphasis
- **Numerals**: `font-variant-numeric: tabular-nums` on the HUD, level codes, dates and the clock

## Spacing & Layout
- **Container**: `max-width: 1040px`, `padding-inline: clamp(20px, 5vw, 56px)`
- **Page order (index)**: header → intro (h1 + lead, HUD on the right) → map → controls caption → level dialog → level select list → footer
- **Page order (level page)**: header → back link → level header → hero figure → level card (spec rows) → write-up sections → media → previous / next level → footer
- **Rhythm**: 28px between blocks on the index; 56–96px between sections on level pages
- **Map size**: logical canvas 320 × 176 px (20 × 11 tiles of 16px), scaled to the container width with `image-rendering: pixelated`. Never wider than the container, never taller than ~62vh
- **Mobile**: map stays full width; labels hide except the current level; dialog stacks the icon above the text; level list stays one column

## Borders & Radius
- **Radius**: `0` everywhere. The pixel grid is the softness
- **Map frame**: `2px solid ink`
- **Dialog**: `border-top: 2px solid ink` on the recess (the same "beam over an alcove" move as home's tokonoma and blockchain's booktabs top rule)
- **Rows**: `1px solid rule` hairlines between level-list rows and level-card rows
- **Buttons, labels, toast**: `1px` or `2px` solid ink

## Shadows & Elevation
- **None in CSS.** No box-shadow, no blur, no gradients, no glass
- Depth on the page comes from paper tone shifts (paper → recess) and rules
- Inside the map, sprites get one flat 2px shadow ellipse at `rgba(46,45,41,.13)`. That is the only shadow in the lens

## Buttons
- **Primary** ("enter level →", "play ↗"): ink fill, paper text, 1px ink border, `min-height: 46px`, Pixelify 15px, lowercase. Hover: ink-soft fill
- **Secondary** ("next level →", "code ↗"): transparent, ink text, 1px ink border. Hover: paper fill (on recess) or recess fill (on paper)
- **Press**: `translateY(2px)` only. No scale, no bounce
- **Focus**: 2px gold outline, 3px offset

## Icons
- No icon library. The only icons are the pixel sprites drawn in code: one building per level, the player, coins
- Text glyphs allowed: → ← ↗ ↓ ✓ · and arrow keys inside key caps
- Each level's sprite comes from a small fixed set chosen by the project's `kind` (see Components › Level sprite)

## Components Spotted
- **Header**: same contract as every lens. Brand mark (the player's head, 20 × 20 sprite, 1.5× scale) + "Femi Ojetokun" in Pixelify 18px; lens switcher (home · web · games · blockchain) with a 6px gold square before the current lens; "lagos · HH:MM" clock in ink soft
- **Intro**: h1 "Pick a level." + one-sentence lead; HUD on the right: gold square + "coins 0/n", "levels 1/n", and "skip the map ↓" anchor to the level list
- **Overworld map**: canvas in a 2px ink frame. one winding road on a fixed route: START (home) at the bottom-left, one node per game along the road in data order, GOAL (contact) right after the last game. Up to 7 games per world; an 8th starts world 2. The river gets a bridge where the road crosses it. Level names float above nodes as small paper labels (1px ink border); the current level's label inverts to ink
- **Level sprite**: 16 × 16 building with a 1px outline, chosen by kind: `onchain` → dungeon mouth with torches, `jam` → tent, `prototype` → workshop, `tool` → tower, `multiplayer` → city block, `music` → speaker, anything else → scroll. START = house, GOAL = castle with a gold flag
- **Player**: 12 × 14 sprite, two walking frames, mirrors to face left; stands 3px in front of the current building, which lifts 3px
- **Coin**: one per road, at its midpoint; 6px coin with a 4-frame spin and 1px ink outline. Picking one up throws four gold pixels upward for 0.45s
- **Controls caption**: one line under the map in ink soft with key caps (`←` `↑` `→` `↓`, `wasd`, `enter`)
- **Level dialog**: recess panel under the map with a 2px ink top rule. Left: the level sprite at 4× in a ground-coloured square. Right: eyebrow "level 1-3 · role", title, one-paragraph summary, tags as plain lowercase words, then "enter level →" (primary, goes to the level page) and "next level →" (secondary). A "play ↗" button appears when the project has a live link
- **Achievement toast**: paper box with a 2px ink border, centred at the top of the map: gold square + "explorer" + ink-soft "visited every level". Two achievements only: explorer (all levels visited) and coin collector (all coins). 3.2s on screen
- **Level select list**: h2 "Level select" + one line, then hairline rows: code (`1-1`), name (Pixelify 22px), kind (body 14px), status ("visited" with a gold square, or "not yet"). Each row is a real link to the level page
- **Level page header**: "← world map" link, eyebrow "level 1-3 · world 1", h1 project title, one-line summary, status chip in words ("live", "in development", "archived"), primary "play ↗" and secondary "code ↗"
- **Hero figure**: screenshot or short muted looping clip in a 2px ink frame, `image-rendering: auto`, caption below in ink soft ("Figure 1 — the dungeon screen")
- **Level card**: hairline rows like home's about rows: role · team · dates · engine / stack · chain · platform · status. A row with no data is omitted, never shown empty
- **Write-up sections**: "How it plays", "What I built", "What I learned" as sentence-case h2s in Pixelify with body paragraphs at a 62ch measure
- **Media strip**: further figures in a two-column grid (one column on mobile), each framed and captioned
- **Level nav**: bottom of the level page, "← 1-2 loot survivor 2" and "1-4 herit →" as secondary buttons, with a 1-line strip map showing the row of nodes and the current one inverted
- **Footer**: hairline top rule, two short lowercase lines in ink soft

## Imagery & Illustration
- All map art is drawn in code at runtime from the palette above. No sprite sheets copied from any game, no third-party character, no console shapes
- Project screenshots only appear on level pages, as framed and captioned figures
- Pixel art is always integer-scaled with `image-rendering: pixelated`; screenshots never are

## Overall Replication Notes
Key things an AI coding tool must know to nail this style:

- **It is a light page.** Paper `#F7F5EF`, ink `#1E1D1A`. There is no dark theme for this lens and it must not follow `prefers-color-scheme` into one. It has to look like the home and blockchain lenses' sibling
- **Gold means "you / got it" and nothing else.** Current lens, focus ring, coins, visited, achievements. Never text, never a button, never a background
- **The map is an enhancement, the list is the navigation.** Every level is reachable from the level select list as a plain link, with the map ignored, JS off or the canvas failing
- **Levels come from `portfolio.js`.** Filter the shared project data to games; never hard-code a project on the map. Adding a game to the data adds a level
- **Muted print tones with ink outlines.** If the map looks like a bright retro game screen, the palette is wrong
- **Square corners, no shadows, hairlines.** Same rules as the sister lenses
- **Pixelify for display, Atkinson for reading.** Never set a paragraph in the pixel face
- **Lowercase labels, sentence-case headings, no uppercase anywhere**
- **One tiny game.** Walk and collect coins. Do not add enemies, timers, lives, health, levels that must be "beaten" or anything that gates content
- **Reduced motion**: the player moves instantly between levels, water and coins stop animating, toasts appear without sliding