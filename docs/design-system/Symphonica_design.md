# Symphonica Design System — Base Specification (v1.1.0)

---

## 1. Principles

- Clarity over creativity
- Explicit visual feedback for all states
- Strict consistency with Figma components
- Token-driven system (no hardcoded values)
- Prefer aliases over duplicated values
- Preserve backward compatibility during migration

---

## 2. Token Architecture

### 2.1 Core Tokens
Foundational, reusable, stable values.

Includes:
- Colors (neutral, legacy, transparent)
- Spacing
- Sizes
- Typography
- Motion

---

### 2.2 Semantic Tokens
Meaning-based tokens used across UI.

Includes:
- Role colors (primary, success, danger, etc.)
- Role variants (base / light / lightAlert / dark / border)
- Interaction states (hover / active / disabled)

---

### 2.3 Component Tokens
Component-specific tokens.

Includes:
- Alerts
- Badges
- Buttons
- Button Groups
- Cards
  - Primary cards
  - Secondary cards
  - Card headers
  - Subtitle labels (Info / Success / Error role surfaces)
- Tables
  - Header
  - Rows
  - Footer
- Pills
- Navigation — Tabs Top (Secondary Card body section switching)
- Navigation — App Sidebar (primary shell menu)
- App Header (Symphonica top shell — search, utilities, breadcrumb; Small / Large variants)

---

## 3. Core Tokens

### 3.1 Neutral Colors

- White → base background
- 100–900 → grayscale scale
- Black → strongest contrast

---

### 3.2 Special Colors

- Transparent → explicit "no background"

---

### 3.3 Legacy Neutrals

Temporary tokens kept for migration:

- Strong
- Medium
- Soft
- Subtle

---

### 3.4 Spacing

Base unit: **4px**

Scale:
- 0 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40
- **`component.buttonGroup.segment`**: **`paddingX`** → **`Core/Spacing/12`**, **`paddingY`** → **`Core/Spacing/8`** (Guía frame proportions; resolve only via component tokens, not as ad-hoc layout rhythm elsewhere)

Rules:
- Always use tokens
- Avoid arbitrary values

---

### 3.5 Sizes

Used for:
- Icons
- Controls
- Compact UI

Available size tokens:
- 0 / 4 / 6 / 8 / 12 / 14 / 16 / 18 / 20 / 24 / 26 / 28 / 30 / 32 / 38 / 40 / 50

---

### 3.6 Typography

Font: **Montserrat**

Symphonica uses Montserrat as the global typography family.

### Font Loading

Implementation:
- Montserrat must be explicitly loaded by the application
- Do not assume the font is available in the browser
- The project must import Montserrat before rendering the UI

Recommended approaches:
- Google Fonts
- Local self-hosted files

Google Fonts import:
https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap

Required weights:
- 400
- 500
- 600

### Global Typography Rules

- All components must use Symphonica typography tokens
- Font family must always be explicitly defined
- Components must explicitly define:
  - font-family
  - font-size
  - font-weight
- Typography must always resolve from tokens
- Do not rely on browser defaults
- Do not rely on Bootstrap typography defaults
- Do not inherit typography from parent elements if tokens exist
- Do not use responsive typography (`rem`, `em`, `vw`, `clamp`) unless explicitly defined
- Do not rely on fallback fonts as primary rendering
- Font loading must happen globally before component rendering
- Line-height tokens (**`Core/Typography/LineHeight`**): **`tight`**, **`solid`**, **`relaxed`** — use **`relaxed`** only when a component token aliases it (e.g. **`component.buttonGroup.segment`** label line-height).

---

### 3.7 Motion

Motion defines how UI elements transition between states.

#### Duration Tokens

- `motion.fast = 120ms`
  - Small state changes
  - Button hover
  - Icon hover
  - Micro feedback

- `motion.base = 180ms`
  - Standard UI transitions
  - Menus
  - Dropdowns
  - Sidebar expand/collapse
  - Form feedback

- `motion.slow = 280ms`
  - Larger layout transitions
  - Panel changes
  - Modal entrance/exit

#### Easing Tokens

- `motion.easing.standard = cubic-bezier(0.2, 0, 0, 1)`
  - Default easing for most UI transitions
  - Use for opening, expanding and entering elements

- `motion.easing.exit = cubic-bezier(0.3, 0, 0.8, 0.15)`
  - Use for closing, collapsing and leaving elements

#### Usage Rules

- Do not animate `display`
- Prefer `transform` and `opacity`
- Use `width` only for persistent layout elements such as the Sidebar
- Avoid transitions longer than `280ms`
- Respect `prefers-reduced-motion`
- Motion must clarify state changes, not decorate them

#### Sidebar / Menu Motion

The Sidebar must not open or close instantly.

Recommended transition:

transition:
  width 180ms cubic-bezier(0.2, 0, 0, 1),
  transform 180ms cubic-bezier(0.2, 0, 0, 1),
  opacity 120ms cubic-bezier(0.2, 0, 0, 1);

---

## 4. Semantic Tokens

### 4.1 Role Colors

- Primary
- Secondary
- Dark

---

### 4.2 Role Variants

Each role includes:

- Base → main color
- Light → backgrounds
- Dark → foregrounds

Roles:
- Success
- Danger
- Info
- Warning
- Process

---

### 4.3 Action Tokens (Interaction)

Defines UI states:

- Hover
- Active
- Disabled

Per role:
- Primary
- Danger
- Success

---

### 4.4 Text Tokens

Text tokens define semantic usage for typography across the system.

They abstract color usage from intent, allowing consistent text styling
independent of specific color values.

#### Available Tokens

- `Semantic/Text/Primary`
  - Main body text
  - Default text color

- `Semantic/Text/Secondary`
  - Supporting or less prominent text
  - Used for descriptions, metadata, helper text

- `Semantic/Text/Title`
  - Headings and important labels
  - Uses brand color for emphasis

- `Semantic/Text/White`
  - Used on dark or colored backgrounds
  - Ensures proper contrast in filled components

#### Rules

- Always use text tokens instead of raw color tokens for typography
- Do not reference `Semantic/Color/*` directly in text styles
- Text tokens must remain decoupled from component logic

#### Mapping

- Primary → `Semantic/Color/Dark`
- Secondary → `Core/Color/LegacyNeutral/Strong`
- Title → `Semantic/Color/Primary`

---

## 5. Component Tokens

References elsewhere in this specification use **§5.*n*** for the subsections below (**§5.1**–**§5.11**). **§5.3** covers labeled buttons and includes **Button Groups** under the same heading family.

---

### 5.1 Alerts

Structure:
- Background
- Foreground
- Border

Rules:
- Always use **`component.alert.*`** tokens (never raw semantic hex in markup)
- **Primary**, **Danger**, **Info** backgrounds → **`Semantic/Color/*/Light Alert`** (`semantic.color.*.lightAlert`)
- **Success**, **Warning** backgrounds → **`Semantic/Color/*/Light`** (`semantic.color.*.light`)
- Foreground → **Dark** variant (`semantic.color.*.dark`; **Primary** uses **`semantic.color.dark`**)
- **Primary**, **Success**, **Danger**, **Info** borders → **`Semantic/Color/*/Border`** (`semantic.color.*.border`)
- **Warning** border → **`Semantic/Color/Warning/Base`** (`semantic.color.warning.base`) — Guía aliases warning base for alert stroke
- **Badges** (§5.2) keep **`Semantic/Color/*/Light`** surfaces — not Light Alert

---

### 5.2 Badges

Structure:
- Background
- Foreground

Typography:
- Font size: `Core/Typography/FontSize/12`
- Font weight: `Core/Typography/FontWeight/Medium`
- Text transform: uppercase

Sizing:
- Height: `component.badge.height`
- Horizontal padding: `component.badge.paddingX` (`Core/Spacing/8`)
- Vertical padding: `component.badge.paddingY` (`0` — fixed height owns the vertical box; do not derive height from padding)
- Badge height must not be derived from padding or line-height

Typography Rules:

- Must explicitly set font-family
- Must use font-weight: 500
- Must not inherit font styles from parent or Bootstrap

Rules:
- Use semantic variants when possible
- Avoid raw colors
- Badge labels must always be uppercase
- Badge labels must use Montserrat Medium (500)

Note:
`Badge/Warning` is legacy.

Segmented **Button Group** numeric count pills are **not** this component: use **`component.buttonGroup.countBadge`** and §5.3 **Button Groups** — **14px** medium numerals, pill shape, **no** uppercase requirement.

---

### 5.3 Buttons

#### Button Ownership Rules

Symphonica defines two different icon-based button patterns.

#### Outlined Icon-Only Buttons

Used for:
- Card Header actions
- Toolbar actions
- Refresh
- Download
- Secondary utility actions

Rules:
- Must use `component.button.outlined.iconOnly`
- Must be square
- Must use Bootstrap outlined button structure
- Must not be circular
- Must not use `component.button.icon`
- Token sizing: **`component.button.outlined.iconOnly.size`** / **`iconSize`** map to **`component.button.size.md`** (**38×38** hit area, **24px** Material icon) so Card Header toolbars align with **`sym-form-control`** row height and **filled primary** actions (Guía filter rows — e.g. [7872:9277](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7872-9277)). Do not regress to Bootstrap **`btn-sm`** dimensions for these chrome buttons.

#### Circular Icon Buttons

Used for:
- Table action columns
- Compact contextual actions
- Table footer load more
- Row-level actions

Rules:
- Must use `component.button.icon`
- Must be circular
- Must not use Bootstrap outlined icon-only rules
- Must not use `component.button.outlined.iconOnly`
- Must use Google Material Icons only
- Add icon must use the Material Icon `add`
- Refresh icon must use the Material Icon `refresh`

#### Circular icon button tooltips (Bootstrap)

Circular icon buttons communicate only through glyphs. Every instance **must** have an accessible name (**`aria-label`** or equivalent).

For sighted users, **also** enable **Bootstrap Tooltip** on hover/focus with the **same** human-readable string as the default visible hint (unless product intentionally passes a shorter tooltip string). This applies to:

- **Tables:** body Actions column and table-footer controls (for example load-more).
- **Cards:** circular icon rows on white card surfaces (**`primaryCard`** / **`dangerCard`**).

Tooltip timing is token-driven: **`component.tooltip.iconButton.delayShowMs`** (default **400** ms — a short intentional delay for dense UIs; values on the order of **4 ms** are not practical) and **`component.tooltip.iconButton.delayHideMs`** (default **100** ms). Use **`container: 'body'`** (or equivalent) when initializing Bootstrap so tooltips are not clipped by table or card overflow. Showcase reference: **`symphonica-ui/src/components/SymIconTooltipButton.tsx`**.

#### Critical separation

- Card Header icon-only actions ≠ Table action icon buttons
- Do not reuse outlined icon-only styles for table actions
- Do not reuse circular icon button styles for Card Header actions
- Button placement is owned by the parent component
- Button visual style is owned by the button variant

---

#### Variants
- Filled
- Outlined
- Icon

---

#### Filled Buttons

- Background → semantic base
- Foreground → white
- Border → semantic base
- States → semantic action

---

#### Outlined Buttons

- Background → white
- Foreground → semantic base
- Border → semantic base
- States → semantic action

#### Outlined Icon-Only Buttons

- Use Bootstrap outlined button structure
- Do not use Bootstrap Icons
- Do not use browser/default icon sizing
- Must use Google Material Icons only

#### Button Border Radius

- Buttons use Bootstrap default border radius
- Do not apply `core.border.radius.md` to buttons
- Do not infer button radius from cards or badges
- Button radius is owned by Bootstrap unless explicitly overridden by the system


#### Button Sizes

Symphonica defines three button sizes:

- Small (sm)
  - Button: `Core/Size/32`
  - Icon: `Core/Size/20`

- Medium (md)
  - Button: `Core/Size/38`
  - Icon: `Core/Size/24`

- Large (lg)
  - Button: `Core/Size/50`
  - Icon: `Core/Size/32`
  
Typography:

- Buttons must use:
  - font-family: `Core/Typography/FontFamily/Primary`
  - font-weight: Medium (500)
- Do not inherit typography from Bootstrap
- Do not use default button font styles

Layout:

- Button must use fixed width and height
- Do not use padding-based sizing
- Button size must not depend on icon size
- Icon-only buttons must visually match their defined size (32 / 38 / 50)

Implementation rules:

- Use width and height equal to button size
- Center icon using flexbox
- Do not use horizontal or vertical padding

Rules:
- Do not use Bootstrap default padding for icon-only buttons
- Button must be square
- Icon must be visually centered
- Button size must match one of the defined sizes (sm, md, lg)
- Icon-only buttons must use size tokens
- Button size must not be derived from padding
- Icon size must not define button size
- Bootstrap default sizing must not be used

---

#### Icon Buttons

Structure:
- Background/{State}
- Icon/{State}

Surface variants:
- **Default** (`component.button.icon.primary` / `danger`): for **table** action columns, table footer load-more, and any control chiefly used on `Semantic/Color/Secondary` (app) background or on table row surfaces.
- **On card** (`component.button.icon.primaryCard` / `dangerCard`): for circular icon buttons placed **inside Primary or Secondary card bodies** (white surface). **Both** variants use the **same** hover background **`Core/Color/Neutral/200`** — aligned with **Pills** hover (`component.pill.states.hover.background`). **Role** (primary vs destructive) is expressed **only** via **`icon.*`** colors (`Semantic/Color/Primary` vs **`Semantic/Color/Danger`**), not via a different hover chip.

Rules:
- Do not use the **on card** variant for table row actions or for the table footer load-more control.
- Default and on-card variants share the same sizes, border radius, default/active/disabled behavior except **hover background** (and matching icon tokens where defined).

Sizing:

- Icon buttons must use:
  - size: `component.button.icon.size`
  - icon size: `component.button.icon.iconSize`

- Do not use button size tokens (sm, md, lg) for circular icon buttons

States:
- Default
- Hover
- Active
- Disabled

Behavior (default variant):
- Default → transparent background
- Hover → white background
- Active → semantic action active
- Disabled → transparent

Behavior (on card variant):
- Default → transparent background (same as default variant)
- Hover → `Semantic/Color/Secondary` background
- Active → semantic action active (same as default variant)
- Disabled → transparent

Icon:
- Default → semantic color
- Active → white
- Disabled → action disabled token (primary/danger per variant)

---

#### Button Groups

A **button group** is a **composition** of standard Symphonica buttons under **`component.button`** (Bootstrap **`btn`** + Symphonica overrides). In the **canonical Card Header pattern**, the Guía de Estilos treats it as a **segmented primary control**: one continuous **primary** outline, **mutually exclusive segments**, and optional **numeric count pills** beside each label (see anatomy below). Other uses still merge adjacent **`btn`** siblings into one strip with **straight inner seams** and **rounding only on the outer ends**.

Source (reference): [Guía de Estilos — Button Group](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7321-12060).

#### Placement

- Preferred **inside Cards**: **Primary Card Header** bottom-row **left group** when using the header **button-group pattern** — see §5.5 (**Button group pattern**).
- Avoid detached groups floating without an owning card/header section unless an explicit layout spec overrides.

#### Anatomy (Figma-aligned segmented pattern)

- **Segments**: reference sets use **three** or **four** segments in one row; product may fix count per screen, but keep **one selected segment** at a time unless spec defines multi-select (default: single selection).
- **Per segment**: primary **label** (Montserrat **16** / medium / line-height **1.5**) plus an optional trailing **count pill** (numeric only).
- **Count pill**: pill radius (**`Core/Border/Radius/Full`**), background **`Semantic/Color/Secondary`**, numeral **`Semantic/Color/Primary`**, typography **`Core/Typography/FontSize/14`** + **`Core/Typography/FontWeight/Medium`** — **not** uppercase and **not** the global status-badge recipe in §5.2 (that remains **12px**, uppercase). Implement via **`component.buttonGroup.countBadge`**.
- **Inside the segment**: horizontal gap between label and count pill **`component.buttonGroup.segment.labelBadgeGap`** (**`Core/Spacing/8`**); segment padding **`paddingX`** → **`Core/Spacing/12`**, **`paddingY`** → **`Core/Spacing/8`** (via **`component.buttonGroup.segment`**).
- **Border**: shared **`Core/Border/Width/Hairline`** stroke in **`Semantic/Color/Primary`** around each segment; inner vertical edges align so the group reads as **one** segmented frame (Bootstrap **`btn-group`** border collapse / negative margin pattern).

#### Selection visuals (primary segmented variant)

- **Unselected segment**: interior **`Core/Color/Transparent`** (reads clear on the Card Header white surface); label and count numeral use **primary** foreground on **secondary** pill surface for the count only.
- **Selected segment**: interior **`Semantic/Color/Primary`**; label **`Core/Color/Neutral/White`**; **count pill unchanged** (still **`Semantic/Color/Secondary`** surface + **primary** numeral), matching the reference component.

#### Hover, active, disabled

- **Unselected** segment, pointer hover / pressed: use **`component.button.outlined.primary.hover`** and **`component.button.outlined.primary.active`** for background, border, and label foreground (aligned with §5.3 outlined labeled buttons — solid semantic hover/active fills, white text on those states).
- **Selected** segment: use **`component.button.filled.primary.hover`** and **`component.button.filled.primary.active`** for the segment shell; keep count pill colors as defined on **`component.buttonGroup.countBadge`** unless a future spec ties selected-state pills to white-on-primary (reference keeps secondary pills).
- **Disabled**: not illustrated in Figma; map segment chrome to **`component.button.outlined.primary.disabled`** when unselected and **`component.button.filled.primary.disabled`** when selected; hide or dim counts per product rules without inventing new palette hex values.

#### Composition and geometry (all button groups)

- **Inner joins**: **square** perpendicular corners between neighbors — suppress **individual** **`border-radius`** on shared vertical edges mid-group so inner faces read as **straight** and borders do **not** “double-gap”.
- **Outer ends**: the **leading** outer corner of the **first** segment and **trailing** outer corner of the **last** use **`component.buttonGroup.borderRadius.container`** (**`Core/Border/Radius/Sm`**).
- **`component.buttonGroup.gap`**: **`Core/Spacing/0`** between siblings (abutting borders); Bootstrap overlap for **`btn-group`** stays an implementation detail — resolved spacing is **`component.buttonGroup.gap`** only.
- **Sizes**: segmented header pattern uses dimensions implied by **`component.buttonGroup.segment`** + **`component.button.size.md`** row height alignment unless a spec chooses **sm** / **lg**.

#### Icons

- If a segmented control includes icons (not shown in the reference node), follow **§10 Iconography**: **Google Material Icons Outlined**, `<span class="material-icons-outlined">…</span>`.

#### Tokens

- **Shell**: **`component.buttonGroup.gap`**, **`component.buttonGroup.borderRadius.container`**.
- **Segment layout / type**: **`component.buttonGroup.segment`** (`paddingX`, `paddingY`, label stack, **`labelBadgeGap`**).
- **Count pill**: **`component.buttonGroup.countBadge`** (fills, type, radius, padding — aliases **`Semantic/Color/Secondary`**, **`Semantic/Color/Primary`**, **`Core/Typography/FontSize/14`**, **`Core/Border/Radius/Full`**).

#### Structural note

- Markup aligns with **`btn-group`** (or frameworks that wrap `ButtonGroup`); Symphonica tokens/style overrides apply on top — **rounded shell + square interior joins** as above.

---

### 5.4 Data Display — Tables

Tables are structured components used to display tabular data with multiple interaction states.

#### Table Ownership

Tables own:
- Data structure
- Header cells
- Sort interaction
- Row states
- Row selection
- Table footer behavior
- Action column behavior

Tables do not own:
- Section title
- Section subtitle
- Card Header layout
- External filters
- Page-level actions

Rules:
- Tables must always be rendered inside a Primary Card
- Tables must not include their own title
- Tables must not render standalone section headers
- Section titles belong to the Card/Header Card, not to the Table
- Table Header means the internal table header row (`th`), not the Card Header Section

---

#### Table Composition

A standard table card may contain:

- Primary Card
  - Optional Card Header Section only when the table itself requires filters or actions
  - Table
  - Optional Table Footer

Rules:
- A Card Header Section may exist above the table, but it is not part of the table element
- A separate section header card must not be merged into the table card
- Adding a table must not remove, replace, or merge with an existing Card Header card

---

#### Table Header

Table headers support sorting actions.

Structure:
- Column title
- Optional sort icon placed to the right of the column title

Visual rules:
- Height: `component.table.header.height`
- Background: `component.table.header.background`
- Text color: `component.table.header.foreground`
- Font size: `component.table.header.fontSize`
- Font weight: `component.table.header.fontWeight`
- Bottom separator: `component.table.header.borderBottom`

Sort icon rules:
- Must use Google Material Icons only
- Icon size: `component.table.header.icon.size`
- Icon color: `component.table.header.icon.color`
- Gap between title and icon: `component.table.header.icon.gap`

Sort Icon Mapping:
- Default / unsorted → `swap_vert`
- Ascending → `arrow_upward`
- Descending → `arrow_downward`

Sorting rules:
- Do not use chevron icons for sorting
- Do not use generic arrows without direction meaning
- Do not use Bootstrap default sort icons
- Do not use neutral or gray icons
- Sort icons must reflect data ordering, not navigation

Sort interaction feedback:
- Sorting feedback must be shown primarily through icon state
- Active sorted column must not change text color
- Table header text must always use `component.table.header.foreground`
- Optional text emphasis may only change font weight, not color
- Do not change header background aggressively

---

#### Table Row Anatomy

Rows must use fixed-height anatomy. The visual height must not be produced by Bootstrap padding.

Row state variants:
- Default
- Hover
- Selected
- New Item

State priority:
1. Selected
2. New Item
3. Hover
4. Default

Visual rules:
- Header rows must have fixed height from `component.table.header.height`
- Body rows must have fixed height from `component.table.row.height`
- Body rows must use bottom separator from `component.table.row.borderBottom`
- Text must use `Semantic/Text/*` tokens or the corresponding component table tokens
- Status cells must use the Badge component
- Action cells must use circular Icon Buttons

Implementation contract:
- If using native table layout, apply fixed height to `tr`, `th`, and `td`
- If using flex layout, apply fixed height to the row container and align cell content inside it
- Enforce row height with `height`, `min-height`, and `max-height`
- Header row height must resolve from `component.table.header.height`
- Body row height must resolve from `component.table.row.height`
- Cell content must be vertically centered
- Cell horizontal padding must resolve from `component.table.cell.paddingX`
- Cell vertical padding must resolve from `component.table.cell.paddingY`
- Native table cells must set vertical padding from `component.table.cell.paddingY`, not Bootstrap defaults
- Native table cells must not use Bootstrap `.table` vertical padding
- Table row height must be a cell-level contract, not only a row-level declaration
- Do not let Bootstrap table padding control row height
- Do not add vertical padding that increases row height
- Do not use auto height for rows
- Content must not overflow row height


#### Table Native Rendering Contract

When using native HTML tables, row height must not rely on `tr` alone.

Rules:
- Native tables must use `border-collapse: collapse`
- Row height must be enforced through both:
  - `tr` as the row container
  - `th` and `td` as the cell elements
- `th` and `td` must resolve height from the same table height tokens as their parent row
- `th` and `td` must use `component.table.cell.paddingY` for vertical padding
- `component.table.cell.paddingY` must remain zero unless explicitly changed in tokens
- `th` and `td` must use horizontal padding only
- Bootstrap default table padding must be overridden
- Cell content must be vertically centered inside the fixed row height
- Line-height must not force row height beyond the token height
- Content that exceeds row height must be truncated or managed internally
- Content must not expand the row

Implementation requirements:
- For header rows, apply `component.table.header.height` to `thead tr`, `th`, and relevant inner cell wrappers if used
- For body rows, apply `component.table.row.height` to `tbody tr`, `td`, and relevant inner cell wrappers if used
- If an inner wrapper is used inside `th` or `td`, it must use flex alignment and inherit the cell height token
- Do not depend on Bootstrap `.table` padding, `.table-sm`, or default line-height to define row height

Row separator rules:
- Header rows must use `component.table.header.borderBottom`
- Body rows must use `component.table.row.borderBottom`
- Separator width/style/color must come from table borderBottom tokens
- Do not use shadows, gaps, margins, or background bands as row separators
- Do not remove row separators on hover, selected, or new item states

State behavior:
- Hover must affect the entire row
- Selected state has priority over hover
- New Item must be visually distinguishable from hover and selected
- New Item must not conflict with semantic status colors used by badges

---

#### Table Action Column

Actions column must use compact circular Icon Buttons.

##### Row hover visibility

- By default, action buttons in the Actions column **must not be visible** (use `opacity`, `visibility`, or an equivalent technique; do not remove controls from the tab order solely for visuals).
- When the pointer is over **the table body row** that contains those actions, the buttons **must become visible**.
- Prefer transitioning visibility with **`Core/Motion`** duration and easing tokens (e.g. `opacity` — do not animate `display`).
- Respect **`prefers-reduced-motion`**: shorten or omit the visibility transition rather than enforcing full motion duration on users who request reduced motion.
- For keyboard and assistive-tech use, ensure actions remain usable when the row or an action receives focus (e.g. show on **`:focus-within`** on the row, or an equivalent accessible pattern).

Rules:
- Table action buttons must use `component.button.icon`
- Table action buttons must not use `component.button.outlined.iconOnly`
- Table action buttons must not use Bootstrap outlined icon-only styles
- Actions column must not trigger row selection when interacting with buttons/icons
- Use Material Icons (Outlined) from Google Fonts library.
- Implementation: Use <span> tags with class "material-icons-outlined".
- Never use @mdi/react or SVG-based icons unless specifically requested.
- Do not use emoji, Unicode, Bootstrap Icons, FontAwesome, lucide, Heroicons, or inline SVG
- Do not invent icons
- Each icon-only control **must** keep **`aria-label`** (or equivalent) aligned with the action
- Add **Bootstrap Tooltip** for the same string by default (see **§5.3**, **Circular icon button tooltips**); delays from **`component.tooltip.iconButton`**

Table Action Icon Mapping:
- View / Details → `visibility`
- Open in new → `open_in_new`
- Copy / Clone → `content_copy`
- Download → `file_download`
- Delete → `delete`

Notes:
- Table action icon mappings are implementation metadata
- They must not be exported as CSS variables

---

#### Table Footer

Tables may include a footer area used for pagination or progressive loading.

Structure:
- Center action: load more items
- Right text: item counter

Layout rules:
- Footer spacing must use `component.table.footer.paddingTop` and `component.table.footer.paddingBottom`
- Footer content must be vertically centered
- Load more action must be centered horizontally
- Item counter must be aligned to the right
- Footer belongs to the table card/container, not to table rows

Implementation rules:
- Footer must use a horizontal layout container
- Layout must support a centered element and a right-aligned element
- Recommended: relative footer container, centered load-more action, right-aligned counter
- Do not place load more and counter in the same left-aligned flow
- Do not stack footer elements vertically unless explicitly required
- Do not use margin-bottom in table footer
- Bottom spacing is handled by the parent Card padding

Load more action:
- Must use the existing circular Icon Button component
- Must follow `component.table.footer.loadMore` tokens
- Must use `add`
- Do not use directional icons such as chevron or arrow
- Do not create a custom circular button

Item counter:
- Example: `Showing 10 of 152 items`
- Must use `component.table.footer.counter` tokens
- Do not hardcode item counter typography

---

#### Accessibility

- Rows must support keyboard navigation when interactive
- Selected state must be perceivable without color only
- Sortable headers must expose sort state accessibly
- Actions column controls must follow **Row hover visibility**: hidden by default is visual-only; `:focus-within` on the row (or equivalent) must reveal buttons so keyboard and assistive-tech users can operate them

---

### 5.5 Surface Components — Cards

Cards are surface containers used to group related content, actions, and data.

Symphonica defines two main card types:

- Primary Cards
- Secondary Cards

#### Card Header Section

Primary cards may include a header section used for navigation, filters, or actions.

**Scope:** This **Card Header** is **not** the application **App Header** (§5.9). It is **section chrome** for the page region below it: it **must remain visible** at the top of the main-column scroll viewport (**`sym-app-body`**) while the user scrolls tables, secondary cards, and other content — the same *intent* as the App Header, but scoped to the page section.

**Scroll (normative):** implement with **`position: sticky`**, **not** viewport **`position: fixed`**. Sticky keeps the header anchored to the **`sym-app-body`** scrollport (**`top: 0`** — the App Header already lives outside that scrollport and is reserved on **`sym-app-main`**). **Never** use viewport **`fixed`** for card headers (sidebar **`left`** / width / stacking bugs; duplicates App Header ownership).

**Why sticky, not fixed?**

| Approach | Verdict |
|----------|---------|
| **`position: sticky`** in **`sym-app-body`** | **Canonical** — no extra offset math; releases when the owning card scrolls out (if applicable) |
| **`position: fixed`** on the card header | **Forbidden** — belongs to App Header shell only (§5.9) |

See **Primary Card header — sticky scroll behavior** below for markup, tokens, and the two layout shapes (header-only card vs header + body in one card).

**Source (reference):** [Guía de Estilos — Card Primary Header](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7230-4966) (variants **`Filter=NavPills`**, **`Filter=Simple` / `Filter=Advanced`**, **`Filter=Always`**, Scheduler-style **`Filter=Simple` / `Filter=Advanced` / `Filter=No`**, etc.).

Primary Card headers organize **title metadata** and **one** of three **mutually exclusive** interaction families on the **bottom row** (left side):

| Spec variant | Typical Guía / Figma cue | Left group (bottom row) |
|--------------|--------------------------|-------------------------|
| **Pills navigation** | `Filter=NavPills` | Refresh / download (optional) + **pills** |
| **Filters** | `Filter=Simple`, `Filter=Advanced` | Filter fields + clear / advanced controls |
| **Button group** | `Filter=Always`, Scheduler dashboards | **Segmented Button Group** (§5.3) |

**Auto-exclusion:** **Pills navigation** and **Filters** are **never** combined in the same Primary Card header — choose exactly one. **Button group** is the third family: do **not** mix it with pills or with a filters row in the same header.

Structure:

- **Top section (title band):**
  - **Title** (required)
  - **Optional** subtitle / metadata (many Guía frames omit it — `Filter=None` / `Filter=No`)
  - **Conditional:** **Primary Create** button (filled primary): visible label **`Create {entity}`** with Material **`add`** outlined icon **before** the text (do **not** put a literal **`+`** in the label; the icon conveys addition). Align **top-right** on the **same vertical band as the title** when the **Button group** variant requires **both** the **search / advanced-search** strip on the bottom-right **and** this action (see **Button group** below). For **Pills** and **Filters**, the same button defaults to the **bottom-row right group** when present, not the title row.

- **Bottom section:**
  - **Left group:** exactly one pattern — pills **or** filters **or** segmented button group
  - **Right group:** depends on variant (primary **Create**, search strip, or empty — see below)

Rules:

- Exactly **one** left-group pattern per header; no stacking pills + filters + button group.
- Use **progressive disclosure** (advanced row) instead of overloading a single row.

Layout behavior:

- **Pills:** horizontal alignment in the bottom row; never inline with the title.
- **Filters / search fields:** may wrap; **advanced** states add a **full-width row immediately below** the row that contains the advanced toggle (same behaviour as **Filters** and **Button-group search**).
- Respect **`component.card.header`** spacing tokens; no ad-hoc gaps.

Constraints:

- Header height grows only as needed (e.g. **Simple** vs **Advanced** filter rows in Guía).
- Remain consistent within a product area.

#### Primary Card header — sticky scroll behavior

Primary Card headers **do not scroll away** with page content in **`sym-app-body`**. They **stick** under the App Header band using **`position: sticky`**.

| Layout shape | DOM | Sticky target | Scope class (implementation) |
|--------------|-----|---------------|------------------------------|
| **Section header card** | `<article class="sym-card-primary">` contains **only** **`sym-card-header`** (no table/body in the same article) | The **`<article>`** | **`sym-card-primary--section-sticky`** |
| **Combined primary card** | `<article>` contains **`sym-card-header`** **and** body (table, nested cards, etc.) | **`sym-card-header`** only | **`sym-card-header--sticky`** (on the `<header>`) |

Typical product layout (e.g. showcase inventory / service orders): **section header card** first on **`sym-page`**, then separate Primary/Secondary cards for data — the first card matches the **section header** row in the table above.

**Tokens** (implementation): **`component.card.header.sticky.*`**

| Token | Role |
|-------|------|
| **`offsetTop`** | **`0`** — stick to top of **`sym-app-body`** scrollport |
| **`zIndex`** | Above scrolling page content, below modals/toasts (§5.10–§5.11) |
| **`gapCover`** | Reserved token (alias **`layout.body.sectionGap`**). Keep normal **`sym-page`** **`gap`** between siblings — **do not** fake cover with negative **`margin-bottom`** or extra **`box-shadow`** spread (causes a visible “ghost” card edge). **Prerequisite:** **`sym-app-main`** **`overflow: visible`**; scroll only **`sym-app-body`** |

**Surface while stuck:** opaque **`component.card.primary.background`** (+ card elevation token as today). **Advanced filters:** the full **`sym-card-header`** block sticks together (advanced row stays inside the header, not a separate stick boundary).

**Do not flatten** **`sym-card-header__top`**, **`sym-card-header__bottom`**, and optional advanced rows — required for sticky height, motion, and accessibility (see Filters implementation contract).

##### Sticky scroll — implementation contract (assistants / Cursor)

Follow this checklist whenever you add or change a **Primary Card header** on a scrolling page. Full narrative: **§5.5 — Primary Card header — sticky scroll behavior** above.

**Canonical references (working code):**

| Pattern | Markup reference | CSS |
|---------|------------------|-----|
| **Section header card** (pills / filters, no table in same `<article>`) | `symphonica-ui/src/showcase/SymphonicaShowcase.tsx` — first `<article class="sym-card-primary sym-card-primary--section-sticky">` | `symphonica-ui/src/styles/symphonica.css` — `.sym-card-primary.sym-card-primary--section-sticky` |
| **Section header card** (filters + advanced row) | `symphonica-ui/src/showcase/PartyDomainShowcase.tsx` — first `<article>` | Same CSS class as above |
| **App shell** (scroll + sticky prerequisite) | `symphonica-ui/src/App.tsx` — `sym-app-main` + `sym-app-body` | `symphonica.css` — `.sym-app-main` (**`overflow: visible`**), `.sym-app-body` (**`overflow-y: auto`**) |

**Step-by-step (section header card — most common):**

1. **Page structure:** `sym-app-shell` → `sym-app-main` → `SymAppHeader` (fixed) + **`sym-app-body`** (scrolls) → **`sym-page`** (`gap: layout.body.sectionGap`) → siblings.
2. **First sibling:** `<article class="sym-card-primary sym-card-primary--section-sticky sym-no-hover">` with **only** `<header class="sym-card-header">` inside (title, pills/filters, optional Create). **No** table or secondary content in this `<article>`.
3. **Following siblings:** data cards (e.g. primary card with table in a **separate** `<article>`). Spacing between header card and data card comes from **`sym-page`** **`gap`** — **do not** remove or cancel it.
4. **CSS:** use existing **`.sym-card-primary.sym-card-primary--section-sticky`** — do not reimplement sticky in inline styles or ad-hoc classes.
5. **Tokens:** `component.card.header.sticky.offsetTop`, `.zIndex`; elevation = **`component.card.primary.shadow`** only (one shadow).

**Step-by-step (combined primary card — header + body in one `<article>`):**

1. `<article class="sym-card-primary">` contains `<header class="sym-card-header sym-card-header--sticky">` plus body (table, etc.).
2. CSS: **`.sym-card-header--sticky`** in `symphonica.css` (horizontal bleed matches card padding).

**App shell prerequisites (mandatory — sticky silently fails if violated):**

| Element | Required | Forbidden |
|---------|----------|-----------|
| **`sym-app-main`** | `overflow: visible`, `max-height: 100vh`, `box-sizing: border-box`, flex column, `padding-top` = header stack height | **`overflow: hidden`** on `sym-app-main` (breaks **`position: sticky`** for all descendants of `sym-app-body`) |
| **`sym-app-body`** | `flex: 1`, `min-height: 0`, **`overflow-y: auto`** (sole main-column scrollport) | Nesting scroll on `sym-page` instead of `sym-app-body` without re-validating sticky |
| **`sym-app-header`** | `position: fixed`; **outside** `sym-app-body` | Card header `position: fixed` to viewport |

**Anti-patterns (known regressions — do not reintroduce):**

| Mistake | Symptom | Correct approach |
|---------|---------|------------------|
| **`sym-app-main { overflow: hidden }`** | Section header scrolls away with page; sticky appears “broken” | **`overflow: visible`** on `sym-app-main`; scroll only **`sym-app-body`** |
| **`position: fixed`** on card header | Wrong `left`/width vs sidebar; fights App Header | **`position: sticky`** in **`sym-app-body`** |
| **Missing `sym-card-primary--section-sticky`** | Header card scrolls off screen | Add scope class on header-only `<article>` |
| **`margin-bottom: calc(-1 × sectionGap)`** on sticky article | Table card touches header; layout gap lost | Keep **`sym-page`** **`gap`**; no negative margin |
| **Extra `box-shadow` spread** under sticky article (“gapCover”) | White “ghost” second card lip; clashes with table card | **One** `component.card.primary.shadow` only |
| **Flattening** `sym-card-header__top` / `__bottom` / advanced row | Wrong sticky height; filters contract broken | Preserve header DOM structure per Filters contract |

**`meta.llmImplementationNotes`:** `primaryCardHeaderStickyScroll` and `cardHeaderStickyImplementationContract` in **`design_tokens.json`**.

#### Card Header Groups Usage

The **bottom** horizontal strip is split into:

- **Left group:** pills **or** filters **or** button group (exclusive).
- **Right group:** contextual — optional **primary Create** (see recipe below), **search + advanced**, or empty per variant rules below.

#### Pattern exclusivity (summary)

The left group uses **only one** of:

- Pills navigation  
- Filters  
- Button group  

Do **not** combine pills with filters, pills with button group, or filters with button group on the same Primary Card header.

If multiple interaction types are required:

- Prefer **advanced** row disclosure (filters or search), not an extra pattern in the same header.

#### Empty State Behavior

If the left group is empty:

- The right group stays **end-aligned** (LTR); do not center or stretch actions across the header.

If **both** groups are empty:

- Do **not** render the bottom header row (title band may still show).

##### Right group (variant-dependent)

The bottom-row **right** slot is **not** always “Create only”:

- **Pills navigation:** typically optional **Primary Create** (filled primary) — label **`Create {entity}`** + leading **`add`** icon; omit entirely when the screen has no primary create (Guía allows empty right group).
- **Filters:** typically optional **primary Create** in this slot **when** the product defines one; otherwise leave empty. Do **not** place pill or filter controls here.
- **Button group:** this slot holds the **search** control (Bootstrap **`form-control`** / Symphonica field tokens) and an **advanced search** affordance (e.g. outlined icon-only **`tune`** or equivalent per Guía). **Opening advanced search** inserts an **additional row below** (same progressive disclosure as **Filters advanced**). When **both** this search strip **and** **primary Create** are required, move **primary Create** to the **top section**, **top-right**, aligned with the **title** — the bottom-right stays dedicated to search (+ advanced trigger).

**Primary Create button recipe (when used):** **`component.button.filled.primary`**; Material Icons Outlined **`add`** immediately **before** the label; visible label **`Create {entity}`** (e.g. “Create service order”) — **no** redundant **`+`** character in the string because **`add`** already communicates addition (matches Guía). §5.3 / Guía button tokens.

Rules:

- Do not park unrelated secondary actions in the right group; icon-only utilities belong in the **left** group order for **Pills** / **Filters**.
- Do not place pills, filter chips, or segmented segments in the right group.

##### Left group — variant recipes

###### 1. Pills navigation (`NavPills`)

Structure:

- Optional **Refresh** outlined icon-only  
- Optional **Download** outlined icon-only  
- **Pills** (`component.pill`) — not Bootstrap `nav-tabs`

Rules:

- Icons use **`component.button.outlined.iconOnly`**; refresh → Material **`refresh`**, download → **`file_download`**.
- **Mutual exclusion:** never pair this left group with **Filters** in the same header.

###### 2. Filters (`Simple` / `Advanced`)

Structure:

- Optional leading icon-only actions (refresh / download) per product — **before** fields when present.
- **Inputs and/or selects** as compact filters.
- **Clear filters** outlined icon-only (e.g. **`filter_alt_off`**).
- **Advanced filters** outlined icon-only (e.g. **`tune`**) — **omit** when the screen has no advanced filter set.

Filter field rules:

- **No visible field labels** in the header chrome — use **`placeholder`** (and optional trailing icons) as the visible cue, matching Guía **Customer Search** / **Integration Orders** style frames.
- **Accessibility:** every filter control still needs an **accessible name** (`aria-label`, `aria-labelledby`, or a **visually hidden** `<label>`) — placeholders alone are not sufficient for WCAG naming.

Advanced behaviour:

- **Without** advanced: single header row (**Simple** height in Guía).
- **With** advanced: toggling advanced opens a **second row directly below** the main bottom row with additional fields (**Advanced** height in Guía). Closing advanced removes that row.

- **Clear** stays **outlined icon-only**. **`tune`** (advanced) is **outlined icon-only** when collapsed; when the advanced row is **open**, render **`tune`** as **filled-primary icon-only** (white glyph on primary fill) — matches Guía **Card Primary Header with filters** ([Figma reference](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7872-9277)).

**Mutual exclusion:** never combine this pattern with **Pills navigation** in the same header.

##### Filters layout constraints

- Align toolbar controls **`flex-end`** (baseline band): icon-only triggers share the same vertical band as inputs/selects (Guía filter rows).
- Primary toolbar fields: target **`160px`–`300px`** width each (`max-width: 300px`, `min-width: 160px`), wrapping when the viewport is narrow — matches **Card Primary Header with filters** ([Figma](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7872-9277)).
- Advanced row fields: same **min/max** band; prefer **`flex: 1 1 0`** so siblings share horizontal space up to the **300px** cap per field.
- Fields must not force horizontal scroll; **wrap** to the next line when space is tight.
- Do not shrink controls below a usable minimum width.
- Prefer wrapping over compressing typography.

##### Filters variant — implementation contract (assistants / Cursor)

This subsection is the **machine- and human-readable contract** for rebuilding the **Filters** Primary Card header in code. Follow it verbatim unless the Guía adds a new frame.

**Canonical reference implementation (copy shape from here):** `symphonica-ui/src/showcase/PartyDomainShowcase.tsx` — the first `<article className="sym-card-primary">` / `<header className="sym-card-header">` block inside `PartyDomainShowcase`.

**Guía screens:** [Card Primary Header — filters, advanced closed + open](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7872-9277).

**Non-negotiable DOM semantics:**

1. **Do not flatten** title + toolbar + advanced row into one flex row. Keep **`sym-card-header__top`**, **`sym-card-header__bottom`**, and the **optional advanced block** as separate siblings inside **`sym-card-header`** so spacing (`component.card.header.layout.gap`) and **sticky** scroll behavior (§5.5) stay correct.
2. **Bottom row:** **`sym-card-header__bottom`** contains exactly **`sym-card-header__left`** then **`sym-card-header__right`**. The left group wraps the toolbar; the right group holds **only** the optional **primary Create** (never filter inputs in the right group).
3. **Toolbar:** Inside **`sym-card-header__left`**, use a single **`sym-card-header__filters`** container for the **simple** row (leading optional refresh/download icon-only → fields → **`filter_alt_off`** → **`tune`**).
4. **Advanced row:** When expanded, render **another** block **below** **`sym-card-header__bottom`**, still inside **`sym-card-header`**, with **`sym-card-header__advanced-row`** (and reuse **`sym-card-header__filters`** on that row for the same flex/wrap/gap behavior). Do **not** insert the advanced row inside **`sym-card-header__right`**.

**CSS class binding (symphonica-ui):**

| Region | Classes | Notes |
|--------|-----------|--------|
| Card shell | `sym-card-primary` | Primary surface + padding tokens |
| Header root | `sym-card-header` | Column; vertical gap from **`component.card.header.layout`** |
| Title band | `sym-card-header__top` → `sym-card-title` | Title required |
| Bottom strip | `sym-card-header__bottom` | Row; **`flex-end`** alignment via header tokens |
| Left cluster | `sym-card-header__left` | **`flex: 1`**, **`min-width: 0`** so filters can wrap without breaking layout |
| Right CTA | `sym-card-header__right` | **`flex-shrink: 0`**; optional **`sym-btn-filled-primary`** |
| Simple toolbar | `sym-card-header__filters` | Wrap + **`align-items: flex-end`** + **`core.spacing.8`** gap |
| Simple field wrapper | `sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar` | **160px–300px** band; no **`flex: 1 1 10rem`** alone |
| Advanced row container | `sym-card-header__advanced-row` (+ optional second `sym-card-header__filters`) | Full width; **no** top border (vertical rhythm = header layout gap) |
| Advanced field wrapper | `sym-card-header__filter-field sym-card-header__filter-field--advanced-toolbar` | **`flex: 1 1 0`**, same **160–300px** cap |
| Clear | `sym-btn-outlined-icon-only` | Icon **`filter_alt_off`** — **md** hit target (tokens **`component.button.outlined.iconOnly`**) |
| Advanced toggle | `sym-btn-outlined-icon-only` **or** `sym-btn-filled-primary sym-btn-filled-primary--icon-only` | Outlined when collapsed; **filled icon-only** when row open — **same md square** as outlined (filled modifier reuses icon-only dimensions) |
| Primary Create | `sym-btn-filled-primary` | Leading **`add`**; label **`Create {entity}`** — **no** literal **`+`** in string |

**Bootstrap / Symphonica controls:** Inputs and selects use **`form-control sym-form-control`** / **`form-select sym-form-control`** (per §5.10 field styling). Icons: **`material-icons-outlined`**.

**State matrix (`tune` + advanced row):**

| Advanced row | `tune` button classes | ARIA |
|--------------|----------------------|------|
| Closed | `sym-btn-outlined-icon-only` | `aria-expanded={false}` · `aria-pressed={false}` · `aria-controls` → region `id` |
| Open | `sym-btn-filled-primary sym-btn-filled-primary--icon-only` | `aria-expanded={true}` · `aria-pressed={true}` · same `aria-controls` |

**Accessibility checklist:**

- Every filter control has a **real name**: paired **`visually-hidden`** `<label htmlFor="…">` **or** `aria-label` (placeholders alone are insufficient).
- Advanced disclosed content: **`role="region"`**, stable **`id`**, concise **`aria-label`**, **`aria-controls` / `aria-expanded`** on the toggle.
- Icon glyphs: **`aria-hidden`** on **`material-icons-outlined`** spans; meaning lives on the button label.

**Anti-patterns (reject in review):**

- Literal **`+`** in the Create label when **`add`** is already shown.
- **`tune`** stays outlined while the advanced row is visible (must match Guía filled active state).
- Omitting **`sym-card-header__filter-field--primary-toolbar`** / **`--advanced-toolbar`** → fields revert to generic flex and **break** the 160–300px Guía band.
- Moving filters into **`sym-card-header__top`** (Filters variant keeps Create on **bottom-right**, not title row, unless you are in the **Button group + Create + search** exception documented above).

---

###### 3. Button group (`Filter=Always`, Scheduler, etc.)

Structure — **bottom row:**

- **Left:** Segmented **Button Group** (Bootstrap **`btn-group`** + §5.3): **3–4** segments typical; label + optional **count pill**; **one** selected segment for exclusive buckets unless spec says otherwise. Chrome: **`component.buttonGroup.*`**.
- **Right:** **Search** field + **advanced search** control. Activating advanced search adds a **new row below** (additional criteria), same disclosure model as **Filters advanced**.

Structure — **top row (conditional):**

- When this variant requires **both** the bottom-right **search** strip **and** a **primary Create** action (**`Create {entity}`** label + **`add`** icon), place **that button** in the **top section**, **aligned top-right** on the **same band as the title** (Figma e.g. Scheduler **New Job** frames). Do **not** stack Create beside search on the bottom-right in that case.

Rules:

- Use only for **related, mutually exclusive** buckets (status / scope), not unrelated actions.
- Do **not** mix this left pattern with pills or filter-only rows in the same header.

---

#### Implementation mapping (tokens)

- Must use **`component.card.header`** layout tokens (including **`alignItems: flex-end`** on **`header.bottom`** and left/right groups for Filters toolbars).
- Top section → **`header.top`**; bottom row → **`header.bottom`**; left / right → **`header.bottom.leftGroup`** / **`header.bottom.rightGroup`**.
- Do not flatten title + bottom rows into a single undifferentiated flex row in code — preserve **top** vs **bottom** semantics for animation, sticky subheaders, and accessibility.
- **Filters variant detailed binding:** see **§5.5 — Filters variant — implementation contract (assistants / Cursor)** and **`PartyDomainShowcase`** header markup.

Rules:

- Do not invent header chrome outside these three variants unless a new frame is added to the Guía.

#### Primary Card Header with Pills

Summary checklist:

- **Top:** title + optional subtitle/metadata; optional **primary Create** only via **bottom-row right** (or absent).
- **Bottom left:** optional refresh + download + **pills**.
- **Bottom right:** optional **primary Create** (filled primary, **`add`** icon + **`Create {entity}`** — no **`+`** in copy).
- Pills stay **below** the title band; never inline with the title.
- Do not swap pills for ad-hoc buttons.

#### Primary Card Header with Filters

Summary checklist:

- **Top:** title + optional subtitle/metadata **only** — **primary Create** on the **title row** only in the **Button group + Create + search** case, **not** for standalone Filters.
- **Bottom left:** filters with **placeholder**-led fields; clear + optional advanced icon-only.
- **Advanced:** optional; when on, **extra row below** main bottom row; **`tune`** uses **filled-primary icon-only** while open ([Guía frame](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7872-9277)).
- **Bottom right:** optional **primary Create** when the product defines it.
- **Code / AI contract:** **§5.5 — Filters variant — implementation contract (assistants / Cursor)** + canonical **`PartyDomainShowcase`** header + `meta.llmImplementationNotes.cardHeaderFiltersImplementationContract` in **`design_tokens.json`**.

#### Primary Card Header with Button Group

Summary checklist:

- **Top:** title + optional subtitle; **primary Create** **top-right** when Create **and** bottom search strip are both required.
- **Bottom left:** segmented button group (§5.3).
- **Bottom right:** search + advanced trigger; advanced expands **row below**.

#### Card Subtitle Label

Cards may include subtitle labels to separate groups of information inside the card content.

Source (Figma): [Guía de Estilos — Subtitle Label](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7253-5143).

##### Structural variants

- Text only
- Text with switch

##### Role variants

The label supports three **roles**. Pick the role by context (neutral framing vs positive vs critical).

- **Copy / typography / optional leading icons** use **`component.card.subtitle.{info|success|error}.text`** and **`component.card.subtitle.{info|success|error}.icon`** (today both resolve to the same semantic colors as in Figma; split allows a different icon tint later without renaming).
- **Strip (bar) surface** behind the row uses **`component.card.subtitleLabel.surface.{info|success|error}`** — keeps layout/chrome separate from subtitle copy tokens.

| Role | Purpose (typical) | Strip surface (`subtitleLabel.surface.*`) | Text (`subtitle.*.text`) | Icon (`subtitle.*.icon`) |
|------|-------------------|------------------------------------------|---------------------------|---------------------------|
| **Info** | Default section framing | `Semantic/Color/Secondary` | `Semantic/Text/Title` | Same alias as text |
| **Success** | Positive emphasis | `Semantic/Color/Success/Light` | `Semantic/Color/Success/Dark` | Same alias as text |
| **Error** | Critical / blocking (Danger palette) | `Semantic/Color/Danger/Light` | `Semantic/Color/Danger/Dark` | Same alias as text |

Rules:
- **Info** is the default when no role is specified in markup.
- **Error** uses the **Danger** semantic scale for strip + typography (aligned with Alerts/Badges).
- Do not introduce a second parallel tree (e.g. legacy `roles.*.background`) for the same visuals; use **`subtitle` + `subtitleLabel.surface`** only.

Switch rules:

- Switch variant must use a toggle switch control
- Do not use standard checkboxes
- Use Bootstrap switch structure styled with Symphonica tokens
- Switch must be aligned to the right side of the subtitle label
- Switch height must not alter subtitle label height
- The switch control keeps **standard primary** appearance driven by **§5.12** (**`semantic.color.primary`** checked track + focus ring); it does **not** take on Success or Error tint from the bar (matches Figma: Simple/Advanced chrome stays primary)

Use cases:
- Grouping metadata
- Separating form/detail sections
- Labeling content blocks inside a card

Shared layout chrome (component `subtitleLabel`; all roles):

- Border radius: `Core/Border/Radius/Sm`
- Height: `Core/Size/40`
- Typography scale: **`component.card.subtitleLabel.fontSize`** and **`component.card.subtitleLabel.fontWeight`**

Typography (all roles):

- Font family: Montserrat
- Font size and weight resolve from **`component.card.subtitleLabel.fontSize`** and **`fontWeight`**
- Text and optional **Material Icons Outlined** in the bar must use **`component.card.subtitle.{role}.text`** and **`component.card.subtitle.{role}.icon`** respectively (implementations may inherit `color` on text nodes; icons should reference the **icon** token).

Layout rules:
- Text must be vertically centered
- Text-only variant aligns title to the left
- Switch variant aligns title to the left and switch control to the right
- Switch must not override subtitle label height

Implementation notes:
- Prefer explicit markup classes or props for role (`info` | `success` | `error`) so implementations do not confuse role with Badge or Alert variants.
- Structural variant **with switch** composes orthogonally with any role.

---

#### Primary Cards

Primary cards are used as main page containers.

Typical use cases:
- Main dashboard sections
- Table containers
- Section headers with filters and actions
- Main content areas

Behavior:
- Default state only
- Uses shadow
- No border

Structure:
- Header
- Body
- Optional footer/actions area

Visual rules:
- Background: `Core/Color/Neutral/White`
- Shadow: `core.shadow.card`
- Border: none
- Border radius: `core.border.radius.md`

Spacing rules (fixed):
- Padding: `Core/Spacing/16`
- Gap: `Core/Spacing/16`
- Footer/actions spacing: `Core/Spacing/16`

---

#### Secondary Cards

Secondary cards are used for smaller content groups or selectable surfaces.

Typical use cases:
- Detail views inside a larger layout
- Product/API/resource grids
- Selectable card lists
- Compact information modules

States:
- Default
- Hover
- Active
- Selected

##### Default

- No shadow
- Border visible
- Border color: `Core/Color/Neutral/500`

##### Hover

- Applies card shadow

##### Active

- No shadow
- Border color: `Semantic/Color/Success/Base`

##### Selected

- No shadow
- Border color: `Semantic/Color/Primary`

State priority:

1. Selected
2. Active
3. Hover
4. Default

Rule:
Selected and active states must not be visually overridden by hover.

---

#### Secondary Card Grid Variant

Secondary cards may be used as compact grid/gallery items.

Typical use cases:
- Gallery-like layouts
- Product/resource grids
- API or connector cards
- Compact selectable cards

Layout rules:
- Grid layouts must not exceed 4 cards per row
- In column terms, secondary card grids must not exceed 3 columns wide
- Use responsive behavior to reduce columns on smaller screens
- Do not force cards to shrink below readable content width

Typography:
- Grid card title font size: `Core/Typography/FontSize/16`
- Grid card title font weight: `Core/Typography/FontWeight/Semibold`
- Grid card title color: `Semantic/Text/Title`

Rules:
- Use the 16px title only for secondary cards used as grid/gallery items
- Standard secondary cards may keep the default card title rules

Spacing:

- Grid cards must use:
  - Padding: `Core/Spacing/16`
  - Gap: `Core/Spacing/16`

Rules:
- Do not use the default secondary card spacing (24) in grid layouts
- Grid cards must align visually with primary card density

---

#### Secondary Card Spacing (fixed)

- Padding: `Core/Spacing/24`
- Gap: `Core/Spacing/24`
- Footer/actions spacing: `Core/Spacing/24`

---

#### Card nesting and hierarchy

Symphonica does **not** document arbitrary “cards inside cards.” The following rules define the **only** supported nesting pattern and prevent hierarchy inversions.

##### Prohibited

- **Do not nest a Primary Card inside a Secondary Card.**
  - A Primary Card is a **top-level section container** (shadow, no border, main module).
  - A nested Primary inside a Secondary breaks visual hierarchy, elevation, and the intended reading order (main surface inside a bordered “detail” surface).

##### Permitted

- **Secondary Card inside Primary Card** (or inside the white body of a Primary Card / equivalent primary module surface) is allowed.
  - Matches use cases such as detail clusters, resource/API grids, and selectable tiles **within** a main section.

##### Nested Secondary visual rule (contrast)

- When a Secondary Card is rendered **inside** a Primary Card, its **surface background** must **not** stay the same as the parent white body (both would read as one flat white).
- Use **`Core/Color/LegacyNeutral/Subtle`** for the nested Secondary Card **default background** so the inner card reads clearly against the Primary white.
- Implementation token: `component.card.secondary.nestedInPrimary.background` (alias to Legacy Neutral / Subtle).
- **Border**, **hover / active / selected** states, **grid variant** typography and spacing follow the normal Secondary Card rules unchanged unless otherwise specified.
- Secondary Cards placed **directly** on the app body (`Semantic/Color/Secondary`) keep the default Secondary surface (**`Core/Color/Neutral/White`**) as today.

##### Summary

| Context | Primary nested in Secondary | Secondary nested in Primary |
|--------|-----------------------------|-----------------------------|
| Allowed | No | Yes |
| Nested secondary background | — | `LegacyNeutral/Subtle` (tokenized) |

---

#### Card Typography

##### Header / Title

- Font family: Montserrat
- Font size: `20px`
- Font weight: `600`
- Color: `Semantic/Text/Title`

##### Body

- Font size: `14px`
- Font weight depends on hierarchy:
  - 400 regular
  - 500 medium
  - 600 semibold
- Text color:
  - `Semantic/Text/Primary`
  - `Semantic/Text/Secondary`

Rule:
Use text tokens based on hierarchy. Do not use raw color tokens.

---

#### Card Actions

Actions inside cards must use existing button definitions:

- Primary actions → Filled Button
- Secondary actions → Outlined Button
- Contextual actions → Icon Button

---

#### Card Status Badge Placement

Cards may include a status badge to indicate the current state of the entity.

Placement priority:

1. Top-right corner (default)
2. Bottom-right corner (fallback)

Rules:

- The status badge must be positioned in the top-right corner of the card by default
- If the card includes icon buttons or actions in the top-right corner:
  → The badge must move to the bottom-right corner

- Icon buttons have priority over status badges
- Badge and icon buttons must never overlap

Layout behavior:

- Top-right placement:
  - Badge aligned to the card padding edge

- Bottom-right placement:
  - Badge aligned to the card padding edge
  - Must respect internal spacing tokens

Constraints:

- Do not place the badge on the left side
- Do not center the badge
- Do not stack badge and icon buttons in the same position

---

#### Implementation Rules

- Do not hardcode border radius
- Do not hardcode shadow
- Do not hardcode spacing
- Primary cards must not have borders
- Secondary cards must not have shadow except on hover

---

### 5.6 Navigation Components — Pills

Pills are compact navigation elements used to switch between views or data sets.

States:
- Default
- Hover
- Active
- Disabled

Structure:
- Text label only

Typography:
- Font family: Montserrat
- Font size: `Core/Typography/FontSize/14`
- Font weight: `Core/Typography/FontWeight/Medium`

Spacing:
- Padding X: `Core/Spacing/12`
- Padding Y: `Core/Spacing/8`
- Pills do not use fixed height
- Height is content-driven by typography and padding

Responsive behavior:
- Pill typography is fixed
- Pill font size must not scale with viewport, display size or container width
- Always use `component.pill.fontSize`
- Do not use `rem`, `em`, `vw`, `clamp()` or responsive typography utilities for Pills

Implementation rules:

- Pills must explicitly set font size using component tokens
- Do not inherit font size from parent containers or Bootstrap
- Do not use default Bootstrap nav/tab font sizing

#### Default
- Background: transparent
- Text: `Semantic/Text/Secondary`

#### Hover
- Background: `Core/Color/Neutral/200`
- Text: `Semantic/Text/Secondary`

#### Active
- Background: `Semantic/Color/Primary/Base`
- Text: `Semantic/Text/White`

#### Disabled
- Background: transparent
- Text: `Core/Color/Neutral/500`

Rules:
- Do not set a fixed height for Pills
- Do not reuse button height rules for Pills
- Pills must be used for navigation, not actions
- Do not use badges as navigation
- Do not mix pills with button styles

**Note:** Inside **Secondary Card** content, use **Tabs Top** (`§5.7`) for section switching instead of Pills. Pills remain for **Card Header** navigation patterns and other pill-specific contexts.

---

### 5.7 Navigation — Tabs Top (Secondary Cards)

Tabs Top are Bootstrap `nav-tabs` used **inside Secondary Card bodies** to switch sections or views. They align with the [Bootstrap 5 UI Kit — Tabs top](https://www.figma.com/design/nxyHm0KrZLbBCr9Y8iC1km/Bootstrap-5-Design-System---UI-Kit?node-id=1-34210) component: primary theme border on the track and on the active tab, Montserrat 14 / medium, inactive labels use body text color on white card.

#### Structure

- Markup: `ul.nav.nav-tabs` with Symphonica scope class (e.g. `sym-nav-tabs-top`), `li.nav-item`, `button.nav-link` (or anchor when routed).
- `role="tablist"` on the `ul`; each control `role="tab"`.

#### When to use

- **Secondary Cards**: use Tabs Top for in-card section switching.
- **Primary Card Header** bottom row: keep **Pills** (or filters / button group) per Card Header rules — do not replace Card Header pills with Tabs Top unless product spec changes.

#### Tokens

- Use `component.nav.tabs.top` for track border, tab typography, padding, radii, gap, and inactive / inactiveHover / active / disabled surfaces.

#### Visual (summary)

- **Track**: bottom border `Semantic/Color/Primary` (`component.nav.tabs.top.track`).
- **Active tab**: white background, top/left/right border primary, label `Semantic/Text/Title`, top corner radius from tokens; bottom border meets the track using the white “cover” token so the tab connects to the content area.
- **Inactive tab**: transparent background and **transparent borders** (`component.nav.tabs.top.inactive.borderColor`); label `Semantic/Text/Primary`. Inactive must not look like a boxed tab until hover or active.
- **Inactive hover**: background `Core/Color/Neutral/100`; **primary border on top, left, and right** (`component.nav.tabs.top.inactiveHover.borderColor`); **bottom border uses `inactiveHover.borderBottomCover`** (same as hover background) to overlap the track—same pattern as active’s white cover. Do not map hover borders to `inactive.borderColor` or the outline stays invisible.
- **Disabled**: transparent background, `Core/Color/Neutral/500` label.

#### Rules

- Do not use **Pills** for this in-card pattern when Tabs Top is required.
- Do not use default Bootstrap tab colors; override with Symphonica tokens.
- Tables and table footers do not use Tabs Top for row actions (use circular icon buttons per table rules).

---

### 5.8 Navigation — App Sidebar (Primary menu)

The **Symphonica primary navigation** is a **vertical sidebar** (logo / wordmark, global search field, domain list with leading Material Icons Outlined, labels, trailing `chevron_right`). Source: [Guía de Estilos — menú](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7089-7392).

#### Structure

- **Shell**: `aside` (or app-owned landmark) with scope class **`sym-sidebar`**; optional **`sym-sidebar--collapsed`** when width is collapsed. **`position: fixed`**, **`top: 0`**, **`left: 0`**, **`bottom: 0`** (viewport‑high rail) — **must not scroll** with the main column; width **`component.nav.sidebar.widthExpanded`** / **`widthCollapsed`**. **`sym-app-shell`** exposes **`--sym-shell-sidebar-width`** (expanded vs collapsed); **`sym-app-main`** uses **`margin-left`** equal so the main column clears the rail (same variable drives App Header **`left`**).
- **Header**: wordmark **Symphonica** (typography from `component.nav.sidebar` wordmark tokens) + toggle control (`menu_open` when expanded, `menu` when collapsed).
- **Search**: single-line field, placeholder tone `component.nav.sidebar.searchPlaceholderColor`, border `searchBorderColor`, type size `searchFontSize`, suffix search icon (Material Outlined `search`).
- **Nav list**: `ul` / list with **`menuListGap`** = **`Core/Spacing/16`** between successive **list rows** (flex/`gap` between items — **not** row-internal padding). Each nav row uses **`itemPaddingY`** = **`Core/Spacing/8`** top and bottom on the interactive surface (**`sym-sidebar__link`**, and the collapse **`sym-sidebar__toggle`** uses the same token) so the **24px** leading icon and label have vertical air and a comfortable minimum hit height; horizontal inset remains **`itemPaddingX`** (`Core/Spacing/4`). Horizontal gap between leading icon and label: **`itemGap`** (`Core/Spacing/16`). Each row is a single interactive control (`button` or routed link) with:
  - Leading icon **24px** (`iconSize`), tinted per row using **`component.nav.sidebar.itemIcon.*`** (aliases to the semantic palette — e.g. Home → primary base, Service Domain → success base). Do **not** replace these with arbitrary hex outside tokens.
  - Label: Montserrat **`itemLabelFontSize` / `itemLabelFontWeight`**, `Semantic/Text/Primary`.
  - Trailing **`chevron_right`** in `chevronColor`.
- **Widths**: expanded → `component.nav.sidebar.widthExpanded` (aliases **`layout.apiExplorer.sidebarColumnWidth`**, 330px); collapsed → **`widthCollapsed`** (64px). Collapsed mode hides label, chevron, and search (visually / SR-friendly), centers row icons, tightens horizontal padding.

#### States

- **Row hover**: background `itemHoverBackground` (`Core/Color/Neutral/200`).
- **Current / active route** (optional): background `itemActiveBackground` (`Semantic/Color/Primary/Light`); set `aria-current="page"` on the active control.
- **Motion**: width and row transitions use `Core/Motion` tokens (respect reduced motion).

#### Rules

- Implement with **`component.nav.sidebar`** only for sizes, colors, and spacing — see `design_tokens.json` and generated CSS variables.
- Icons: **Material Icons Outlined** only, 24px row icons; toggle uses tokenized control styling (`toggleIconColor`).
- **Scroll / overflow**: the **rail chrome** (aside) is **viewport-fixed** — **do not** attach vertical scroll to the whole **`aside`**. Expanded — overflow scrolls on the **nav list** (`sym-sidebar__list`) **only** (wordmark, toggle, and search stay visible above the scrolling region). Collapsed — **no visible scrollbar** on the sidebar; use **`overflow: hidden`** on chrome/nav wrappers so the narrow rail never shows a scroll track.
- Do not restyle sidebar rows as Bootstrap `nav-pills` or `nav-tabs`; this pattern is separate from Card Header pills and Secondary Card Tabs Top.
- Product logo asset may replace the text wordmark; keep dimensions and spacing token-driven.

---

### 5.9 App Header (Symphonica Header)

The **App Header** is the **top application chrome** above the sidebar: **global search**, **utility icons**, optional **account / locale** cluster, and **breadcrumb** hierarchy. It is **not** the Primary Card header (§5.5); it spans the **main column** beside the sidebar.

Source (reference): [Guía de Estilos — Symphonica Header](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7219-7632).

#### Variants

| Variant | Behaviour | Breadcrumb surface |
|--------|-----------|-------------------|
| **Large** | Hero-style **primary** band: **`background-color`** + **`background-image`** from tokens — **`component.header.large.shellBackgroundBase`** (fallback / undertone) and **`component.header.large.shellHeroLinearGradient`** (aliases **`semantic.gradient.heroPrimaryBand`**, a single CSS **`linear-gradient(...)`** using **`var(--semantic-color-primary-base)`**, **`var(--semantic-action-primary-active)`**, **`var(--semantic-action-primary-hover)`** at **0% / 40% / 100%**, angle **132deg**). No bitmap exports required for this gradient; products may set the gradient token to **`none`** for a flat hero. Breadcrumb sits inside the band with **deep bottom padding** (`component.header.large.breadcrumbBandPaddingBottom`) so **main body content overlaps** the lower portion of the header — use **`layout.header.large.bodyOffsetTop`** and **`layout.header.large.shellHeight`** (§8 **Layout Model**). | Links / separators / icons use **`semantic.text.white`** (via **`component.header.large.breadcrumbForeground`**, **`breadcrumbSeparatorForeground`**, **`helpIconForeground`**). |
| **Small** | **Classic** stack: **nav row** solid **`component.header.small.navBarBackground`**; **breadcrumb row** uses **`component.header.small.breadcrumbBarBackground`**, which **aliases `layout.body.background`** so the strip **matches the main column body** (no separate white chip — reads continuous with the page). Implementations may use **`transparent`** only if the parent already paints **`layout.body.background`** edge-to-edge; prefer the token alias for explicit parity. No intentional overlap: body follows **below** the full header. | Links use **`component.header.small.breadcrumbForeground`**; separators **`component.header.small.breadcrumbSeparatorForeground`**; **help** icon **`component.header.small.helpIconForeground`**. |

#### Structure

- **Nav row** (both variants): horizontal padding **`component.header.shell.horizontalPadding`**; inner vertical padding **`component.header.navBar.paddingY`**; **do not** separate the breadcrumb band from the nav row with a **border-bottom** hairline — **Large** and **Small** both keep a **continuous** shell (hero gradient + breadcrumb typography on **Large**; primary nav + body-toned breadcrumb band on **Small**). Tokens **`component.header.large.navBarBorderBottomWidth`** / **`navBarBorderBottomColor`** exist only for an exceptional product fork; default **`navBarBorderBottomWidth`** is **`0`** (no visible divider).
- **Search**: Bootstrap **`form-control`** / input group pattern — width clamps **`component.header.search.minWidth`**–**`component.header.search.preferredWidth`**, border **`component.header.search.borderColor`**, placeholder **`component.header.search.placeholderColor`**, typography **`component.header.search.fontSize`** / **`fontWeight`**, suffix icon **Material Outlined `search`** per **`component.header.search.suffixIconSize`**.
- **Utility cluster**: icon buttons / links spaced by **`component.header.shell.utilityTrayGap`**; breadcrumb row trailing cluster gap from **`component.header.shell.breadcrumbClusterGap`**; icons **Material Icons Outlined** (`description`, `apps`, product-specific glyphs, locale flag asset when applicable) at **`component.header.utility.iconSize`** unless a nested molecule specifies otherwise. **Hover** on **utility icon buttons** sitting on **primary-tinted** surfaces (**Large** hero band, **Small** nav row): **`semantic.overlay.whiteOnBrand.hover`** — translucent white overlay; do **not** hand-pick RGBA.
- **User line** (e-mail + non-interactive **`account_circle`** glyph): **`component.header.user.emailFontSize`** / **`emailFontWeight`**; **Large** foreground **`component.header.large.userEmailForeground`** (**`semantic.text.white`** on hero); **Small** on primary nav row **`component.header.small.userEmailForeground`** (**`semantic.text.white`**). The **`account_circle`** icon **must** use the **same** foreground token as the adjacent e-mail (not body default text — icons paint via **`color`**).
- **Breadcrumb**: Bootstrap **`breadcrumb`** structure — [Bootstrap 5.1 Breadcrumb](https://getbootstrap.com/docs/5.1/components/breadcrumb/). Leading **`home`** Material icon (**`component.header.breadcrumb.leadingIconSize`**); segment typography **`breadcrumb.linkFontSize`** / **`linkFontWeight`**; separators **`separatorFontSize`** / **`separatorFontWeight`** / **`separatorPaddingX`**; optional **`help_outline`** **`breadcrumb.helpIconSize`**. Segment **`a`** elements must **not** use default hyperlink underline (icons and labels); affordance comes from color tokens and **`:focus-visible`** only — sidenav rows implemented as **`NavLink`** / anchors follow the same rule so router navigation does not inherit reboot link underlines.

#### Tokens

- **Layout geometry (overlap & fixed chrome)**: **`layout.header.large.shellHeight`**, **`layout.header.large.bodyOffsetTop`** (overlap depth — §8); **`layout.header.small.stackHeight`** (vertical reservation under fixed **Small** header — tune if the nav row wraps).
- **Main column body**: **`layout.body.background`**, **`layout.body.sectionGap`**. Page wrapper (**`sym-page`**) uses **`margin-top: 0`** and **`padding-top: 0`** for **both** header variants — **no negative `margin-top`** on the page wrapper (it stacks primary chrome **under** the App Header). **Large** overlap is **only** via **`sym-app-body`** + **`layout.header.large`**.
- **Hero band (Large)**: **`semantic.gradient.heroPrimaryBand`** — canonical **`linear-gradient`** recipe (documented in JSON as one string so tools read angle + stops without Figma); **`component.header.large.shellBackgroundBase`** and **`component.header.large.shellHeroLinearGradient`** (alias) wire it into the shell.
- **Chrome & content**: **`component.header.shell`**, **`navBar`**, **`search`**, **`breadcrumb`** (shared metrics), **`small`** (**`breadcrumbBarBackground`** matches **`layout.body.background`**; breadcrumb/help/user colors), **`large`** (hero shell tokens above, band padding, breadcrumb/help/user colors — **no** default nav-row divider; **`large.navBarBorderBottomWidth`** stays **`0`** unless a product explicitly opts into a fork).
- **Translucent white on brand** (utility icon **`:hover`** on **Large** hero / **Small** nav): **`semantic.overlay.whiteOnBrand.hover`**. Pair token **`semantic.overlay.whiteOnBrand.emphasis`** is reserved for stronger emphasis on solid role surfaces (e.g. **§5.11** toast close **`:hover`**).

#### Gradient tokens (LLM / implementation)

- Prefer **`semantic.gradient.*`** for any **multi-stop linear gradient** that must stay theme-aware: the value is **literal CSS** embedding **`var(--semantic-…)`** / **`var(--core-…)`** references so changing primaries updates the gradient without editing angles or percentages in code.
- **`semantic.gradient.heroPrimaryBand`** is the reference pattern for the **Large App Header** hero surface; components should consume it via **`component.header.large.shellHeroLinearGradient`** unless a product fork replaces that alias.

#### Rules

- Do **not** substitute Card Header patterns for the App Header; ownership stays with the **application shell**.
- **App Header (§5.9)** uses **`position: fixed`** and **`top: 0`** relative to the **viewport**, spanning **only the main column** (horizontal **`left`** immediately **after** the **sidebar** — expanded vs collapsed width). It **must not scroll**: scrolling is confined to **`sym-app-body`** (or equivalent main-column viewport). Reserve **`padding-top`** on **`sym-app-main`** equal to **`layout.header.large.shellHeight`** (**Large**) or **`layout.header.small.stackHeight`** (**Small**) so layout clears the fixed chrome. **Primary Card headers** (§5.5) use **`position: sticky`** in **`sym-app-body`** so section chrome stays visible — **not** viewport-**`fixed`**.
- Use **tokens only** for colors and spacing; optional illustration layers may ship from **design exports**, but the **default Large hero fill** is **`shellBackgroundBase` + `shellHeroLinearGradient`** — no raster gradient asset required.
- **Small** variant must **not** apply the **Large** body overlap offset unless migrating layouts explicitly switch variants.

---

### 5.10 Modal Dialog

**Modal dialogs** surface blocking confirmations, destructive checks, or short forms above the main UI. Visual and variant structure follow the Guía de Estilos.

**Source (reference):** [Guía de Estilos — Modal Dialog](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7273-4192).

#### Role variants (tone)

Symphonica modals use **three roles**. The role drives **title ink**, **leading header icon** (when present), **primary action(s)** fill color, and optional **featured-item** tint where the spec calls for emphasis.

| Role | Use | Title / icon tint | Primary action button |
|------|-----|-------------------|----------------------|
| **Info** | Ordinary actions: clone, create, edit, confirm neutral actions, launch, etc. | **`Semantic/Text/Title`** (primary-violet title semantics — **`semantic.text.title`**) | **`component.button.filled.primary`** |
| **Danger** | Delete and **irrevocable** actions | **`Semantic/Color/Danger/Base`** | **`component.button.filled.danger`** |
| **Success** | Affirmations such as **Publish**, ship, go-live | **`Semantic/Color/Success/Base`** | **`component.button.filled.success`** |

#### Anatomy

- **Backdrop**: dims page behind the dialog; clicks typically dismiss only when explicitly allowed (prefer explicit Cancel/Close for destructive flows). Implement scrim from **`Core/Color/Neutral/900`** at **~45%** opacity (token-derived, e.g. **`color-mix`**), not ad‑hoc unrelated neutrals.
- **Panel**: **`Core/Color/Neutral/White`** surface, corner **`Core/Border/Radius/Md`** (**8px** — Guía frame; matches primary card-like shells unless Figma exports a dedicated modal radius token later). Elevation: **`core.shadow.modal`** (**Shadows / Modal** from Guía — `0 7px 20px` on **`#00000029`** equivalent; do **not** substitute **`core.shadow.card`** without review). **Max height** (scroll container): **`min(90vh, 720px)`** — the **panel** scrolls internally when content is taller; keeps the dialog usable on short viewports while bounding height on large displays (**720px** tracks the reference implementation unless Guía publishes a different frame).
- **Major regions** (header row, body column, footer): vertical separation **`Core/Spacing/24`** between those blocks (panel padding remains **`Core/Spacing/24`** per below).
- **Header row**: horizontal **`justify-between`**. **Leading cluster**: optional **Material Icons Outlined** glyph (**24px**, **`Core/Spacing/8`** gap to title) + **title**. Title typography: **`Core/Typography/FontSize/20`**, **`Core/Typography/FontWeight/Semibold`**, line-height tight/normal per Guía. **Trailing**: close control (**24px** target hit area, **`close`** glyph — keyboard-accessible, **`aria-label`**).
- **Body**: vertical rhythm from Guía (**`Core/Spacing/16`** between stacked blocks inside the content column; **`Core/Spacing/24`** panel padding). Supporting copy: **`Core/Typography/FontSize/14`**, **`Core/Typography/FontWeight/Medium`**, **`Semantic/Text/Secondary`** (~**22px** row rhythm where specified in Guía).

#### Featured item (“elemento destacado”)

Most confirmation flows include a **featured strip** naming the entity affected (record name, route, device, etc.):

- Default strip surface in reference layouts: **`Semantic/Color/Secondary`** (**`semantic.color.secondary`**) with **`Semantic/Text/Primary`**, **16px** medium, centered or full-width as in Guía; horizontal **`Core/Spacing/8`**, vertical **`Core/Spacing/16`**, corner **`Core/Border/Radius/Sm`**.
- Product specs may swap the strip to **role-tinted lights** (e.g. **`Semantic/Color/Primary/Light`**, **`Semantic/Color/Danger/Light`**, **`Semantic/Color/Success/Light`**) for stronger emphasis — still token-driven, never ad-hoc hex.

Optional when the context is obvious from the title alone.

#### Forms inside modals

Examples: **Clone Process Model**, **Create Device** (vendor → model → version), optional description **textarea**.

- Use Bootstrap **`form-control`** / **`form-select`** / **`form-label`** patterns styled with Symphonica field tokens (placeholder **`Semantic/Text`/`neutral` placeholder tones**, borders **`Core/Color/Neutral/400`** default, primary-focused ring per **`core.focus.ring`** / **`semantic.color.primary`** — **§5.12**).
- Required markers: **danger** asterisk (**`Semantic/Color/Danger/Base`**).
- Stack fields with **`Core/Spacing/16`** (or tighter **12** only if Guía frame specifies); scrolling: **dialog body** scrolls, not the **backdrop**.

Multi-primary layouts (e.g. **Clone and Open Editor** + **Clone Model**): **both** actions use the **same role** filled styling (**Info → primary fill**, **Success → success fill**); ordering follows UX — **Cancel** stays outlined.

#### Footer actions

- **Dismiss / Cancel**: **always** **`component.button.outlined.primary`**, **`component.button.size.sm`** (`Core/Size/32` button height recipe — **sm** labeled buttons).
- **Affirmation / submit**: **always** **filled**, **`component.button.size.sm`**, mapped to the **modal role** (**primary**, **danger**, or **success** filled tokens).
- Alignment: **end** (right in LTR), **`Core/Spacing/8`** between buttons.

#### Accessibility & shell behavior

- Implement **`role="dialog"`**, **`aria-modal="true"`**, **`aria-labelledby`** (title id); initial focus on the dialog panel or first focusable control per pattern.
- **Escape** closes only when product rules allow; destructive dialogs should **not** silently discard without confirmation.
- **`Focus`** returns to the invoking control on close.
- **Z-index** stacks **above** App Header and sidebar chrome — above **`sym-app-header`** / **`sym-sidebar`** modal layer without obscuring required notifications policy.
- **Viewport overlay geometry**: **`sym-app-main`** uses **`overflow: visible`** so **§5.5** **`position: sticky`** works in **`sym-app-body`** (an **`overflow: hidden`** ancestor breaks sticky). **Mount** backdrop + dialog at **`document.body`** (not inside **`sym-app-main`**) so **`inset: 0`** spans the **viewport** and covers the sidebar.

#### Rules

- Do **not** reuse **badge** or **pill** components as modal titles; titles are **plain heading** semantics + optional icon.
- Do **not** mix **md/lg** buttons in the modal footer when following Guía — footer actions stay **sm**.
- Motion: open/close use **`Core/Motion`** durations/easing; respect **`prefers-reduced-motion`** (see global constraint — avoid instantaneous pop).

---

### 5.11 Toasts (Snackbars)

**Toasts** are **non-blocking** transient notifications: they confirm outcomes, report failures, or deliver contextual info **without** trapping focus or dimming the page (contrast **§5.10** Modals).

**Source (reference):** [Guía de Estilos — Toasts](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=6621-29899).

#### Role variants

| Role | When | Canonical title tone (adjust copy per product) |
|------|------|------------------------------------------------|
| **Success** | Action completed OK (most common) | e.g. **Operation Successfully** |
| **Error** | Action failed or critical problem | e.g. **Operation Failed** |
| **Info** | Context when entering a section or supplementary guidance | e.g. **Operation Info** |

- **Chrome**: solid surface per role — reference uses **`Semantic/Action/Success/Hover`**, **`Semantic/Action/Danger/Hover`**, and **`Semantic/Color/Primary`** (info) as full-bleed fills; title and body **`Semantic/Text/White`** (or **`Core/Color/Neutral/White`**).
- **Typography**: title **`Core/Typography/FontSize/16`**, **`Semibold`**; optional body **16**, **`Medium`** (body slot below title).
- **Elevation**: **`core.shadow.notificationToastr`** (**Shadows / Notification Toastr** from Guía — aligns to Figma **`Shadows/Notification Toastr`**; do **not** substitute **`core.shadow.card`** without review).
- **Radius**: **`Core/Border/Radius/Md`** (**8px**). Padding **`Core/Spacing/16`**; vertical gap **`Core/Spacing/16`** between title row, body, and actions **inside** the chip.

#### Layout & placement

- **Viewport**: **`position: fixed`**; **`top: 40px`**, **`right: 24px`** (LTR).
- **Width**: **500px** when viewport **>767px**. When **≤767px**, inset the stack container **`left: 24px`** and **`right: 24px`** so each toast spans the full width between those edges.
- **Stacking**: multiple toasts in a vertical column with **`Core/Spacing/12`** gap between chips; **`z-index`** above page chrome and **above modal overlays** when both exist briefly (e.g. toast after confirm — typical **1060–1100** vs modal **1050**).
- **Portal**: mount at **`document.body`** so **`sym-app-main`** **`overflow`** does not clip toasts (same rationale as **§5.10** viewport overlays).

#### Optional actions

- **Small**, **outlined**, **light**: transparent interior, **white** hairline border, **white** label (**14px** medium in reference) — Guía “Action Button” strip. Use for secondary outcomes (**Retry**, **View detail**, **Dismiss** alongside primary narrative). **Hover** fill on the solid role surface: **`semantic.overlay.whiteOnBrand.hover`** (optional actions); trailing **close** control **hover**: **`semantic.overlay.whiteOnBrand.emphasis`** — token-driven translucent white, not ad-hoc RGBA.

#### Autohide duration

- **Short copy** (e.g. “File saved”): **4 seconds** default.
- **Long copy** or **toast that includes actions**: **8 seconds** default.
- **Reading-time rule**: allow roughly **1 second per 12–15 words** (use **~14** words as a planning midpoint), then add a **2 second** safety margin; clamp sensibly (e.g. **4s–12s**) so dense UIs stay predictable.
- **Critical errors**: **do not autohide** — remain until the user **dismisses** (close control) or resolves the issue; optionally pair with **Retry** / **View logs** actions.

#### UX & technical rules

- **Pause on hover**: while the pointer is over the toast, **suspend** the autohide timer; **resume** when leave (keyboard-only users still get full duration unless product specifies focus-based pause).
- **Never block interaction**: no fullscreen backdrop; pointer events only on the toast chip — page remains clickable (**unlike `aria-modal`** dialogs).
- **Dismiss**: trailing **close** icon (**24px** touch target), **`aria-label`**; removing a toast from the stack must be keyboard-accessible.
- **Live regions**: **Success / Info** → **`role="status"`** + polite live behaviour where appropriate; **Error** → **`role="alert"`** for urgent failures.

#### Rules

- Do **not** replace **§5.1 Alerts** inline in forms with toasts for validation errors unless UX explicitly defines global toast errors.
- Do **not** stack unbounded toasts — cap concurrent visible count or queue.

---

### 5.12 Form controls — Bootstrap accents (Symphonica mapping)

Bootstrap **Reboot** ships **default blue** (`#0d6efd`, `#86b7fe` focus tints) on **`form-control`**, **`form-select`**, **`form-check-input`** (checkbox / radio / switch), and **`form-range`**. In Symphonica apps those accents **must** track **`semantic.color.primary`** and **`core.focus.ring`**, not stock Bootstrap.

**Implementation:** `symphonica-ui/src/styles/symphonica.css` — block comment **`Bootstrap form accents — Symphonica tokens (§5.12)`**. Rules load **after** `bootstrap.min.css` via `global.css`, so they apply **globally** (including **`document.body`** portaled modals).

| Bootstrap construct | Symphonica mapping |
|---------------------|-------------------|
| **`form-control` / `form-select` `:focus`** | Border **`semantic.color.primary.base`**; ring **`core.focus.ring`** (**width**, **offset**, **color** → primary base) — matches **`sym-form-control`** intent |
| **Checkbox / radio `border`** | Default **`core.color.neutral.400`**; surface **`core.color.neutral.white`** |
| **Checkbox / radio `:focus`** | Same ring as fields |
| **`:checked` / `:indeterminate`** | Fill + border **`semantic.color.primary.base`** (check / dash / radio dot SVGs stay white — Bootstrap defaults OK) |
| **Switch `:focus` thumb** | Replace Bootstrap blue thumb with **`semantic.color.primary.light`** (**`#DFE3FA`**) in the SVG data-URL so focus matches primary family |
| **`form-range` thumb** | **`semantic.color.primary.base`**; **`:active`** thumb → **`semantic.color.primary.light`** |
| **`form-range` `:focus` thumb halo** | **`core.focus.ring`** (doubled shadow pattern preserved from Bootstrap) |

Rules:

- Do **not** rely on Bootstrap’s compiled blue hex values for Symphonica branded surfaces.
- **Card Subtitle Label + switch** (§5.5): composes Bootstrap **`form-switch`**; styling inherits from this section — the switch track **`checked`** fill comes from **`:checked`** rules above; bar role (**info / success / error**) does **not** recolor the switch (see Card Subtitle Label rules).

---

## 6. Component Rules

All components must:

- Use tokens only
- Support states
- Match Figma variants
- Avoid hardcoded values

---

## 7. Component Ownership Rules

Ownership defines which component is responsible for structure, layout, content, and visual behavior.

Rules:
- Components must not assume responsibilities owned by another component
- Do not duplicate titles, actions, filters, navigation, or status indicators across nested components
- Parent components own layout and composition
- Child components own their own visual states and internal behavior
- If a component is rendered inside another component, the parent defines placement and spacing

### Ownership Map

#### Card
Cards own:
- Surface
- Container spacing
- Section title
- Section subtitle / metadata
- Header composition
- Placement of actions, filters, pills (Card Header), or **Tabs Top** (Secondary Card body nav), and status badges

Cards do not own:
- Table row states
- Table sorting behavior
- Badge colors
- Button interaction states

#### Card Header
Card Header owns:
- Header layout (top title band + bottom row)
- Title / subtitle placement; **conditional** **primary Create** on the **title band** (Button group + search + Create case)
- **Exactly one** of: **Pills** placement **or** **Filters** placement **or** **segmented Button Group** placement on the bottom-left
- Bottom-right placement: optional **primary Create**, **search + advanced**, or empty — per §5.5 variant
- Header-level icon-only actions placement (refresh / download / clear / advanced triggers)
- **Sticky scroll** in **`sym-app-body`** (§5.5): section chrome stays visible while page content scrolls — **`sym-card-primary--section-sticky`** or **`sym-card-header--sticky`** per layout shape

Card Header does not own:
- Table content
- Table row behavior
- Button visual styles
- Pill visual states

#### Table
Tables own:
- Data structure
- Header cells
- Sort interaction
- Row states
- Row selection
- Table footer behavior
- Action column behavior

Tables do not own:
- Section title
- Section subtitle
- Card layout
- External filters
- Page-level actions

#### Badge
Badges own:
- Status appearance
- Badge typography
- Badge color variant

Badges do not own:
- Placement inside cards or tables
- Entity state logic
- Navigation

#### Button
Buttons own:
- Visual variant
- Interaction states
- Icon size when defined by button tokens

Buttons do not own:
- Layout placement
- Card header structure
- Table action column rules

#### Modal Dialog

Modal Dialog owns:
- Overlay/backdrop and stacking above application chrome (Guía elevation)
- Panel shell (white surface, padding, **`Core/Border/Radius/Md`**, elevation **`core.shadow.modal`** from Guía); **scroll container** capped at **`min(90vh, 720px)`** so overflow scrolls **inside** the panel
- Header row (optional **Material Icons Outlined** + role-colored title, close affordance)
- Body composition (supporting copy, optional **featured item** strip, optional Bootstrap-styled short forms)
- Footer (**sm** **Cancel** outlined primary + **sm** filled primary aligned to modal **role**; dual primaries allowed when Guía shows paired submits sharing one role)

Modal Dialog does not own:
- Primary navigation or sidebar/header chrome underneath (those remain **`sym-app-*`** ownership — §§5.8–5.9, §8)
- Persistent **Alerts** inline on the page (§5.1)
- Full-page creation flows better modeled as routes unless explicitly framed as modal-only CRUD

#### Toast (Snackbar)

Toast owns:
- Fixed viewport placement (**`top: 40px`**, **`right: 24px`** LTR); **500px** chip width when viewport **>767px**; **≤767px**: stack container **`left`/`right` 24px**, full-width chips; stacking / queue policy
- Role surfaces (**Success**, **Error**, **Info**), title + optional body, optional **sm** **outlined light** actions
- Autohide timing (including pause-on-hover), persistent-dismiss behaviour for critical errors
- Close affordance and **`aria-live`** / **`role`** semantics (**§5.11**)

Toast does not own:
- Form field validation messages at point of edit (prefer inline patterns unless spec says otherwise)
- **`aria-modal`** blocking overlays — use **§5.10** Modals instead

---

#### Pills
Pills own:
- Navigation item visual state
- Active / hover / disabled styles
- Pill typography and shape

Pills do not own:
- Card header layout
- Page navigation routing
- Button behavior

---

### Implementation Rules

- A Table inside a Card must not render its own title
- A Card Header must not duplicate a Table title
- Pills inside a Card Header must not become Bootstrap nav tabs
- **Secondary Card** bodies: section navigation uses **Tabs Top** (Bootstrap `nav-tabs` + Symphonica tokens), not Pills
- Table action buttons must use icon button rules, not outlined icon-only button rules
- Outlined icon-only buttons in Card Headers must not use circular icon button rules
- **Modal dialogs:** confirmations and short forms use **§5.10** — role (**Info** | **Danger** | **Success**), **sm** footer buttons (**filled** primary vs role / **outlined.primary** cancel), optional featured strip + Bootstrap fields.
- **Toasts:** transient feedback uses **§5.11** — **`top: 40px`**, **`right: 24px`** (see **§5.11** for **500px** vs mobile full-width **≤767px**), autohide + pause-on-hover, **non-blocking** portal mount — **not** a substitute for modal confirmations when user must commit or cancel explicitly.

- **Card nesting:** do not place a **Primary Card** inside a **Secondary Card**; **Secondary inside Primary** is allowed, using **`component.card.secondary.nestedInPrimary.background`** for the nested surface (`LegacyNeutral/Subtle`). See **§5.5 — Card nesting and hierarchy**.

---

## 8. Layout & Structure

### Layout Model

Symphonica uses a structured layout:

- **App Header** — **§5.9**: **`position: fixed`**, **`top: 0`**, **main column only** (sidebar-aware **`left`** offset); **does not scroll** — **`sym-app-body`** scrolls instead; global search, utilities, user cluster, **Bootstrap breadcrumb**; variants **Large** (hero band + overlapping body) and **Small** (classic two-row stack).
- **Sidebar** — **§5.8**: **`position: fixed`**, **`top: 0`**, **`left: 0`**, **`bottom: 0`**, width expanded/collapsed — **does not scroll** with the page body; **`sym-app-main`** **`margin-left`** tracks **`--sym-shell-sidebar-width`**; nav list scrolls internally only (`component.nav.sidebar`; **`layout.apiExplorer.sidebarColumnWidth`** when expanded unless tokens change).
- **Main column scroll viewport** (`sym-app-body`) — **no `padding-top`** and **no positive `margin-top`** except the **Large** header overlap rule (**`layout.header.large.bodyOffsetTop` − `layout.header.large.shellHeight`**), which is layout geometry only. **Primary Card headers** (§5.5) **`position: sticky`** at **`top: 0`** within this viewport.
- **Page composition wrapper** (first child inside the viewport, e.g. `sym-page`) — **`padding-top: 0`** and **`margin-top: 0`** (**both** **Large** and **Small** App Header). Do **not** use negative **`margin-top`** on **`sym-page`** — it pulls cards **under** the nav/breadcrumb. **Large** proximity to the hero band is **only** from **`sym-app-body`** overlap (**`layout.header.large`**). Horizontal and bottom inset use **`layout.body.sectionGap`**.
- Body Content — positioning depends on **header variant** (see **§5.9** and **`layout.header`** tokens).
- Footer (fixed bottom)
- **Modal dialogs** — **§5.10**: overlay above the scrolling **main column** and fixed shell chrome; elevation and **`z-index`** above sidebar/header layers per Guía; scroll **inside** the dialog body when content exceeds viewport — **do not** scroll the page behind an open **`aria-modal`** dialog.
- **Toasts (snackbars)** — **§5.11**: **`position: fixed`**, **non-blocking**, **`document.body`** portal; **`z-index`** above modal layer when shown after dismiss (typical **1060+** vs modal **1050**). Placement, width (**500px** vs **≤767px** full width), and stacking gap — canonical detail in **§5.11**.
- Sidebar expand/collapse must use Motion tokens defined in `Core Tokens / Motion`.

#### Large header + body overlap

When the App Header uses the **Large** variant, the shell is **taller** than the vertical offset where main content starts: body content is positioned so it **rides over** the lower portion of the header band (visual “float”). The chrome stays **`position: fixed`**; **`sym-app-main`** reserves **`padding-top: layout.header.large.shellHeight`** so **`sym-app-body`** clears it before overlap math applies. Use **`layout.header.large.shellHeight`** and **`layout.header.large.bodyOffsetTop`**: the overlap depth is **`shellHeight − bodyOffsetTop`** (e.g. **156px** shell vs **94px** offset ⇒ **62px** overlap). Preserve **`z-index`** so scrollable body/content paints above the decorative header layer where specified. The scroll viewport (**`sym-app-body`**) keeps **`padding-top: 0`**; overlap uses **`margin-top`** only on the viewport. The page wrapper (**`sym-page`**) keeps **`padding-top: 0`** and **`margin-top: 0`** (**§8**).

#### Small header + stacked body

When the App Header uses the **Small** variant, the **nav band** (primary) stacks above the **breadcrumb band**. The breadcrumb band uses **`component.header.small.breadcrumbBarBackground`** (**alias of `layout.body.background`**, i.e. **`semantic.color.secondary`** in the default theme) so it **does not read as a separate white surface** — it should blend with the main column body (alternatively **`transparent`** only when the shell behind it already paints **`layout.body.background`**). Main content starts **below** the fixed header stack — **no** intentional overlap with the breadcrumb row; **`sym-app-main`** reserves **`padding-top: layout.header.small.stackHeight`**. The page wrapper (**`sym-page`**) uses **`padding-top: 0`** and **`margin-top: 0`** — **no negative `margin-top`** so primary cards stay **below** the header chrome (**§8**).

DIAGRAMA DE LAYOUT: SIDENAV EXPANDIDO (340px)

┌──────────┬──────────────────────────────────────────────────────────┐
│          │                                                          │
│ Sidenav (fixed) │  App Header (fixed top, main column) — `layout.header.large.shellHeight` (Large)   │
│  (340px) │──────────────────────────────────────────────────────────│
│  (Fixed) │                                                          │
│          │  +- - - - - - - - - - - - - - - - - - - - - - - - - -+   │
│          │  | Body Content (`layout.header.large.bodyOffsetTop` from top)            |   │
│          │  | (94px margin top — overlaps lower header band)                      |   │
│          │  | (sym-page `margin-top: 0` · `padding-top: 0` — both header variants)      |   │
│          │  | (24px padding left/right/bottom · `layout.body.sectionGap`)        |   │
│          │  | (section gap between blocks · `layout.body.sectionGap`)            |   │
│          │  +- - - - - - - - - - - - - - - - - - - - - - - - - -+   │
│          │                                                          │
│          │──────────────────────────────────────────────────────────│
│          │  Footer (Fixed bottom) Height: 48px                      │
└──────────┴──────────────────────────────────────────────────────────┘
DIAGRAMA DE LAYOUT: SIDENAV CERRADO (64px)
┌─────┬───────────────────────────────────────────────────────────────┐
│     │                                                               │
│Sid  │       App Header (fixed top, main column) — `layout.header.large.shellHeight` (Large)                  │
│enav │                                                               │ 
│64px │───────────────────────────────────────────────────────────────│
│Fixed│                                                               │
│     │     +- - - - - - - - - - - - - - - - - - - - - - - - - -+     │
│     │     | Body: offset `layout.header.large.bodyOffsetTop` (overlap)  |     │
│     │     | (sym-page margin-top 0 · 24px inset sides/bottom · section gap)     |     │
│     │     +- - - - - - - - - - - - - - - - - - - - - - - - - -+     │
│     │                                                               │
│     │───────────────────────────────────────────────────────────────│
│     │       Footer (Fixed bottom) Height: 48px                      │
└─────┴───────────────────────────────────────────────────────────────┘

---

### Base Surfaces

Symphonica defines a default background for the application layout.

- App / Body background: `Semantic/Color/Secondary`

Rules:

- The main application background must use `Semantic/Color/Secondary`
- Content components (cards, tables, panels) must sit on top of this background
- Cards must always use `Core/Color/Neutral/White` to create contrast
- Do not use white as global background unless explicitly required

Hierarchy:

- App background → `Semantic/Color/Secondary`
- Surfaces (cards, containers) → `Core/Color/Neutral/White`

---

### Body Content Composition

Top-level content inside the application body must use a consistent vertical gap and header inset.

#### Main column viewport vs page wrapper

- **`sym-app-main`**: **`max-height: 100vh`**, **`overflow: visible`**, flex column — **required** so **§5.5** **`position: sticky`** works in **`sym-app-body`** (see **Sticky scroll — implementation contract**).
- **`sym-app-body`** (scroll viewport): **`flex: 1`**, **`min-height: 0`**, **`overflow-y: auto`**; **`padding-top: 0`**; **`margin-top: 0`** except **Large** header overlap (**`margin-top` = `layout.header.large.bodyOffsetTop` − `layout.header.large.shellHeight`** only). **Primary Card header** section cards stick at **`top: 0`** within this viewport.
- **Page wrapper** (first composition layer inside the viewport, e.g. **`sym-page`**): **`padding-top: 0`**, **`margin-top: 0`** (**Large** and **Small**). Horizontal and bottom padding use **`layout.body.sectionGap`** (**24px**). **Vertical `gap` between siblings** (e.g. section header card → table card) must stay **`layout.body.sectionGap`** — sticky header cards **must not** cancel this gap with negative margins.

Rules:
- Direct child sections/cards inside Body Content must be separated by `Core/Spacing/24`
- This spacing applies between independent Primary Cards, Secondary Card groups, tables, and section header cards
- Do not manually stack components without spacing
- Do not use arbitrary margins between page sections
- Section spacing must be owned by the Body Content layout, not by individual components

Implementation:
- **`padding-top: 0`** and **`margin-top: 0`** on **`sym-page`** for **both** App Header variants — **never** negative **`margin-top`** on the page wrapper (cards must not slide **under** nav/breadcrumb).
- **Large** header: overlap is **only** **`sym-app-body`** **`margin-top`** from **`layout.header.large`**.
- Use **`layout.body.sectionGap`** for vertical spacing **between** top-level page elements (**`gap`** / sibling spacing) and for **left / right / bottom** padding of the page wrapper
- Prefer a single column flex layout with tokenized gap for page-level composition
- Individual components must not add external margins to create page layout spacing

---

### Spacing Rules

Use spacing tokens consistently:

- Small gaps → 8–12
- Standard spacing → 16
- Section spacing → 24–32
- Large separation → 40


### Containers

- Content must respect padding tokens
- Avoid edge-to-edge content unless intentional

---

### Positioning

- Prefer flex/grid.
- **Large App Header (§5.9)**: **`position: fixed`**, **`top: 0`** (main column); main body/content uses **`layout.header.large.bodyOffsetTop`** so content **overlaps** the lower hero band; keep stacking context explicit (`z-index`).
- **Small App Header**: same **fixed-top** rule over the main column; reserve **`layout.header.small.stackHeight`** on **`sym-app-main`**; body scrolls in **`sym-app-body`** only.
- **Primary Card header (§5.5)**: **`position: sticky`** at **`top: 0`** inside **`sym-app-body`** — **not** viewport **`fixed`**. Section header card → **`sym-card-primary--section-sticky`**; combined card → **`sym-card-header--sticky`**.
- **`sym-app-main`**: **`overflow: visible`** (never **`hidden`** here — breaks card-header sticky).
- Avoid ad-hoc absolute positioning elsewhere.

---

## 9. Usage Guidelines

### Buttons

- Filled → primary actions
- Outlined → secondary actions
- Icon → compact / contextual actions

---

### Alerts vs Badges

- Alert → system feedback / messages
- Badge → status indicators

---

### Visual Hierarchy

- Primary action → highest contrast
- Secondary → reduced emphasis
- Disabled → lowest contrast

---

## 10. Iconography

### Library

Symphonica uses Google Material Icons.

Source:
https://fonts.google.com/icons?icon.set=Material+Icons

- **Library**: Material Icons (Google Fonts)
- **Style**: Outlined (`material-icons-outlined`)
- **Implementation**: HTML `<span>` tags with class `material-icons-outlined`.
- **Constraint**: Never use MDI (Material Design Icons) or `@mdi/react` unless explicitly requested.

Rules:
- Use only Google Material Icons.
- Use the Material Icons font family/class required by the project implementation.
- Do not use MDI Icons.
- Do not use Bootstrap Icons.
- Do not use FontAwesome.
- Do not use emoji icons.
- Do not use Unicode characters as icons.
- Do not use inline SVG icons invented by the implementation.
- Do not mix icon libraries.

Implementation:
- Icons must render through the Google Material Icons font.
- Icon names must come from the official Google Material Icons catalog.

---

### Sizes

Use Core Size tokens:

- 16 → dense UI
- 20 → standard
- 24 → large actions

---

### Usage

- Icons must be meaningful
- Avoid decorative-only icons
- Always paired with clear interaction

---

### Common Icon Mapping

Use these mappings unless a component defines a more specific icon:

#### Actions
- **Refresh** → `refresh`
- **Download** → `file_download`
- **Upload** → `file_upload`
- **Add / Plus** → `add`
- **Delete** → `delete`
- **Edit** → `edit`
- **Copy / Clone** → `content_copy`
- **Open in new** → `open_in_new`
- **Save** → `save`
- **Search** → `search`
- **Filter** → `filter_list`
- **Settings** → `settings`

#### Navigation / UI
- **More (kebab)** → `more_vert`
- **Menu (hamburger)** → `menu`
- **Back** → `arrow_back`
- **Forward** → `arrow_forward`
- **Expand** → `expand_more`
- **Collapse** → `expand_less`

#### Status / Feedback
- **Success** → `check_circle`
- **Info** → `info`
- **Warning** → `warning`
- **Error** → `error`
- **Question** → `help_outline`

#### Data / Domain
- **Data object** → `storage`
- **Difference / compare** → `compare_arrows`
- **History** → `history`
- **Sync** → `sync`
- **Link** → `link`

---

### Icon Buttons

- Use for compact actions
- Must respect interaction states

---

## 11. Naming Convention

Figma → Code mapping:

- `Core/Color/Neutral/900`
  → `core.color.neutral.900`

- `Semantic/Color/Success/Dark`
  → `semantic.color.success.dark`

- `Semantic/Color/Primary/Light Alert`
  → `semantic.color.primary.lightAlert`

- `Semantic/Color/Primary/Border`
  → `semantic.color.primary.border`

- `Semantic/Color/Danger/Light Alert`
  → `semantic.color.danger.lightAlert`

- `Semantic/Color/Success/Border`
  → `semantic.color.success.border`

- `Component/Button/Icon/Primary/Icon/Active`
  → `component.button.icon.primary.icon.active`

- `Component/Card/Subtitle/Info/Text`
  → `component.card.subtitle.info.text`

- `Component/Card/Subtitle/Info/Icon`
  → `component.card.subtitle.info.icon`

- `Component/Header/Search/BorderColor`
  → `component.header.search.borderColor`

---

## 12. Constraints for AI / Cursor
- **Modal dialogs — §5.10**: Three **roles** — **Info** (ordinary actions → **`semantic.text.title`** + **`component.button.filled.primary`**), **Danger** (irrevocable → danger title ink + **`component.button.filled.danger`**), **Success** (e.g. publish → success title ink + **`component.button.filled.success`**). Footer **Cancel/Close** is **`component.button.outlined.primary`**, **`component.button.size.sm`**. Primary actions **`filled`**, **`sm`**. Footer button row: **`Core/Spacing/8`** gap between actions. Panel **`Core/Border/Radius/Md`**, elevation **`core.shadow.modal`** (not **`core.shadow.card`**); backdrop scrim from **`Core/Color/Neutral/900`** ~**45%** opacity (token-derived); scrollable panel **`max-height: min(90vh, 720px)`**. Optional **24px** header icon + **20 semibold** title; **featured item** strip defaults **`semantic.color.secondary`** / **`semantic.text.primary`** unless spec uses role lights. Short forms use Bootstrap **`form-control`** / **`form-select`** + Symphonica field tokens; **`aria-modal`**, focus management, **Escape** policy per flow. Reference: [Guía Modal Dialog](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7273-4192).
- **Toasts — §5.11**: **Success** | **Error** | **Info** roles; titles **Operation Successfully** / **Operation Failed** / **Operation Info** (templates); optional body **16** medium white; **sm** **outlined light** actions (white border + transparent fill); **`top: 40px`**, **`right: 24px`**; **500px** chip width when viewport **>767px**; **≤767px**: **`left`/`right` 24px** on stack, full-width chips; autohide **4s** short / **8s** long+actions; reading heuristic **~1s per 14 words + 2s** clamp; **critical Error** **no** autohide; **pause on hover**; never block page clicks; **`document.body`** portal; **`Core/Spacing/12`** between stacked chips; **`semantic.overlay.whiteOnBrand.emphasis`** (close **`:hover`**), **`semantic.overlay.whiteOnBrand.hover`** (outlined-light action **`:hover`**). Reference: [Guía Toasts](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=6621-29899).
- **App shell layout**: **`sym-app-shell`** exposes **`--sym-shell-sidebar-width`** (expanded vs collapsed). **`sym-sidebar`**: **`position: fixed`**, **`top: 0`**, **`left: 0`**, **`bottom: 0`** — **does not scroll** with the main column. **`sym-app-main`**: **`margin-left: var(--sym-shell-sidebar-width)`**, **`max-height: 100vh`**, **`overflow: visible`** (required for §5.5 sticky — do not set **`overflow: hidden`** here); **`padding-top`** reserves fixed App Header (**`layout.header.large.shellHeight`** / **`layout.header.small.stackHeight`**). **App Header**: **`position: fixed`**, **`top: 0`**, main column only (**`left`** after sidebar) — **never** nest inside **`sym-app-body`**. **`sym-app-body`** scrolls only (**`overflow-y: auto`**, **`min-height: 0`**, **`flex: 1`**); **`padding-top: 0`**; **`margin-top`** only for **Large** overlap (**`layout.header.large.bodyOffsetTop`** math). **`sym-page`**: **`padding-top: 0`**, **`margin-top: 0`**; **`layout.body.sectionGap`** between sections. Implement **Small** vs **Large** variants per §5.9; **`component.header.*`** for chrome.
- **Card nesting:** never nest a **Primary Card** inside a **Secondary Card**. **Secondary** may be nested **inside Primary**; use **`component.card.secondary.nestedInPrimary.background`** for nested default background (`LegacyNeutral/Subtle`). Standalone Secondary on app background keeps default white. See §5.5.
- **Primary Card header scroll — §5.5:** **`position: sticky`** in **`sym-app-body`**; **never** viewport **`fixed`**. **`sym-app-main`** **`overflow: visible`** ( **`overflow: hidden`** breaks sticky). Section header card → **`sym-card-primary--section-sticky`** on header-only **`<article>`**; preserve **`sym-page`** **`gap`** (no negative margin; no extra gap-cover **`box-shadow`**). Combined card → **`sym-card-header--sticky`**. Contract: **§5.5 — Sticky scroll — implementation contract (assistants / Cursor)**; notes **`primaryCardHeaderStickyScroll`**, **`cardHeaderStickyImplementationContract`**.
- **App sidebar** (primary Symphonica menu): **`aside.sym-sidebar`** is **viewport-fixed** per §5.8 — **do not** scroll the whole rail with page content; **nav list** scrolls internally only when expanded. Use **`component.nav.sidebar`** tokens and Material Icons Outlined; vertical rhythm = **`menuListGap`** (`Core/Spacing/16`) between rows plus **`itemPaddingY`** (`Core/Spacing/8`) inside each link/toggle; map each domain row’s leading icon color via **`itemIcon.*`** aliases — do not substitute ad-hoc colors or reuse Tabs Top / Card Header pill styles for this shell; **collapsed sidebar must not show a scrollbar** (overflow hidden per §5.8)
- Circular icon buttons inside **table** action columns and **table footer** load-more must use `component.button.icon.primary` / `danger` (default hover: white), not **`primaryCard`** / **`dangerCard`**
- **Table Actions column (body rows):** action buttons hidden by default, visible on **row hover**; keep keyboard access (e.g. **`:focus-within`**). Use motion tokens for `opacity` transitions; respect **`prefers-reduced-motion`**. Table footer load-more is not covered by this pattern. See **§5.4**, **Table Action Column**.
- Circular icon buttons on **white card surfaces** use `component.button.icon.primaryCard` / `dangerCard`; **both** use hover background **`Core/Color/Neutral/200`** (same as Pills hover)—variant choice follows icon semantic role only
- Inside **Secondary Card** bodies, use **Tabs Top** tokens (`component.nav.tabs.top`) for section navigation (**§5.7**); Card Header rows still use **Pills** (**§5.6**) where specified — do not mix `nav-tabs` and pills in the same Card Header row
- **Card Subtitle Label**: strip surface **`component.card.subtitleLabel.surface.{info|success|error}`**; label and optional leading icons **`component.card.subtitle.{state}.text`** and **`component.card.subtitle.{state}.icon`**; typography box **`subtitleLabel`** (`fontSize`, `fontWeight`, `height`, `borderRadius`). **Error** uses Danger semantics. Switch does not pick up bar tint. See **§5.5**, **Card Subtitle Label**.
- No hardcoded styles
- Use tokens always
- Never invent styles outside tokens
- Always map to components
- Prefer semantic over core
- Prefer component tokens for UI
- Preserve legacy tokens during migration
- Do not introduce visual inconsistencies
- Do not create instant open/close transitions for menus, dropdowns, sidebars or panels.
- Use Symphonica motion tokens for all UI transitions.

## 13. UI Framework Integration

Symphonica is built on top of a customized Bootstrap 5 implementation.

### Rules

- Bootstrap is used as a structural and behavioral base only
- Visual styles must always be overridden by Symphonica tokens
- Bootstrap default styles must not be used directly
- All components must match Symphonica definitions in Figma

### Border Radius Ownership

Symphonica preserves Bootstrap default border radius for standard controls.

Rules:

- Bootstrap defines border radius for:
  - Buttons
  - Inputs
  - Selects
  - Textareas
  - Form controls

- These values must not be overridden by Symphonica tokens.

- Symphonica only defines border radius for:
  - Cards
  - Badges
  - Icon buttons (circular)
  - Segmented **Button Group** outer shell (**`component.buttonGroup.borderRadius.container`**, aliasing **`Core/Border/Radius/Sm`**) — Symphonica-owned chrome on Bootstrap **`btn-group`**, distinct from applying arbitrary radius tokens to generic **`btn`** primitives
  - **Modal Dialog** panel shell (**§5.10** — **`Core/Border/Radius/Md`** / Guía frame **8px**)
  - **Toast / Snackbar** shell (**§5.11** — **`Core/Border/Radius/Md`**)

- Do not apply `core.border.radius` tokens to Bootstrap primitives unless explicitly defined (including per-component specs such as Button Group above).

- Never infer border radius from other components.

### Theming

- Bootstrap variables are mapped to Symphonica tokens
- No hardcoded Bootstrap colors are allowed
- All colors must come from:
  - Semantic tokens
  - Component tokens

### Component Usage

- Bootstrap components (buttons, inputs, selects, tabnavs, alerts, etc.) are allowed
- Only when styled through Symphonica tokens
- If a component is not aligned with Symphonica:
  → it must be overridden or replaced

### Constraint for AI / Cursor

- Never generate raw Bootstrap styles
- Always map Bootstrap components to Symphonica tokens
- Prefer Symphonica component definitions over Bootstrap defaults