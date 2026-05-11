# Symphonica Design System — Base Specification (v1.0.0)

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
- Role variants (base / light / dark)
- Interaction states (hover / active / disabled)

---

### 2.3 Component Tokens
Component-specific tokens.

Includes:
- Alerts
- Badges
- Buttons
- Cards
  - Primary cards
  - Secondary cards
  - Card headers
  - Subtitle labels
- Tables
  - Header
  - Rows
  - Footer
- Pills

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
- 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40

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
- 4 / 6 / 8 / 12 / 14 / 16 / 18 / 20 / 24 / 26 / 28 / 30 / 32 / 38 / 40 / 50

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

---

### 5.1 Alerts

Structure:
- Background
- Foreground
- Border

Rules:
- Always use semantic variants
- Background → Light
- Foreground → Dark
- Border → Base

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

---

### 5.3 Buttons

### Button Ownership Rules

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
- Must use defined button sizes: sm / md / lg

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

### Filled Buttons

- Background → semantic base
- Foreground → white
- Border → semantic base
- States → semantic action

---

### Outlined Buttons

- Background → white
- Foreground → semantic base
- Border → semantic base
- States → semantic action

### Outlined Icon-Only Buttons

- Use Bootstrap outlined button structure
- Do not use Bootstrap Icons
- Do not use browser/default icon sizing
- Must use Google Material Icons only

### Button Border Radius

- Buttons use Bootstrap default border radius
- Do not apply `core.border.radius.md` to buttons
- Do not infer button radius from cards or badges
- Button radius is owned by Bootstrap unless explicitly overridden by the system


### Button Sizes

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

### Icon Buttons

Structure:
- Background/{State}
- Icon/{State}

Surface variants:
- **Default** (`component.button.icon.primary` / `danger`): for **table** action columns, table footer load-more, and any control chiefly used on `Semantic/Color/Secondary` (app) background or on table row surfaces.
- **On card** (`component.button.icon.primaryCard` / `dangerCard`): for circular icon buttons placed **inside Primary or Secondary card bodies** (white surface). Hover background uses `Semantic/Color/Secondary` instead of white so the hover state is visible and consistent with Symphonica surfaces.

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
## 5.4 Data Display — Tables

Tables are structured components used to display tabular data with multiple interaction states.

### Table Ownership

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

### Table Composition

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

### Table Header

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

### Table Row Anatomy

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


### Table Native Rendering Contract

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

### Table Action Column

Actions column must use compact circular Icon Buttons.

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

### Table Footer

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

### Accessibility

- Rows must support keyboard navigation when interactive
- Selected state must be perceivable without color only
- Sortable headers must expose sort state accessibly

---

## 5.5 Surface Components — Cards

Cards are surface containers used to group related content, actions, and data.

Symphonica defines two main card types:

- Primary Cards
- Secondary Cards

### Card Header Section

Primary cards may include a header section used for navigation, filters, or actions.


Variants:
- Navigation (Pills)
- Filters (inputs/selects)
- Actions (buttons / icon buttons)

Structure:

- Top section:
  - Title
  - Optional subtitle / metadata

- Bottom section:
  - Left group: contextual navigation, filters, or grouped controls
  - Right group: primary action

Rules:
- Only one variant must be active at a time:
  - Pills OR Filters
- Do not mix pills and filters in the same header
- Actions may coexist with either variant

Layout behavior:
- Pills must be horizontally aligned
- Filters must follow form layout rules
- Actions must align to the right

Spacing:
- Must use card internal spacing tokens
- Must not introduce custom spacing

Constraints:
- Header must not grow beyond content height
- Must remain consistent across screens

### Card Header Groups Usage

Card Header bottom row is divided into two groups:

- Left group: contextual navigation, filters, or grouped controls
- Right group: primary action

### Pattern Exclusivity Rules

The left group must use only ONE pattern at a time:

- Pills navigation pattern
- Filters pattern
- Button group pattern

Rules:
- Do not mix pills and filters
- Do not mix pills and button groups
- Do not mix filters and button groups
- Do not combine multiple patterns in the same header

If multiple interaction types are required:
- Use progressive disclosure (e.g. advanced filters expansion)
- Do not overload the header with multiple patterns

### Empty State Behavior

If the left group is empty:

- The right group must remain aligned to the right
- Do not center the primary action
- Do not stretch the action to fill available space

If both groups are empty:
- The header bottom row must not be rendered

#### Right Group

The right group is reserved for the main page/section action.

Typical pattern:
- Filled primary button
- Label format: `+ Create {entity}`
- Add icon positioned before the label
- Uses Material Icons "add" icon (class="material-icons-outlined").

Rules:
- If there is no primary action, the right group must remain empty
- Do not move secondary actions into the right group
- Do not place pills or filters in the right group

#### Left Group

The left group may use one of the following patterns.

### Left Group Order Rules

Elements inside the left group must follow a strict order:

- Actions (icon-only buttons)
- Navigation (pills)
- Filters (inputs/selects)
- Secondary actions (clear / advanced)

Rules:
- Do not place actions after navigation elements
- Do not place filters before primary navigation elements
- Maintain consistent ordering across all screens

##### 1. Pills navigation pattern

Structure:
- Refresh outlined icon-only button
- Download outlined icon-only button
- Pills navigation

Rules:
- Refresh and download buttons appear before pills
- Buttons must use `component.button.outlined.iconOnly`
- Pills must use `component.pill`
- Do not use Bootstrap nav tabs

##### 2. Filters pattern

Structure:
- Inputs and/or selects
- Clear filters outlined icon-only button
- Advanced search outlined icon-only button

Rules:
- Inputs and selects follow Bootstrap form structure styled with Symphonica rules
- Clear filters button appears after filter fields
- Advanced search button appears after clear filters
- Advanced search may reveal an additional row below with more filter fields
- Filter actions must use outlined icon-only buttons

#### Filters Layout Constraints

- Filter inputs must not overflow the header width
- Filters must wrap to next line if space is insufficient
- Do not shrink inputs below usable width

Rules:
- Prefer wrapping over compression
- Do not force horizontal scroll in header

---

##### 3. Button group pattern

Structure:
- Bootstrap Button Group

Rules:
- Use only when the header requires grouped mutually related controls
- Must follow Symphonica button rules
- Must not be mixed with pills or filters unless explicitly defined

Implementation mapping:

- Must use `component.card.header` layout tokens
- Top section must map to `header.top`
- Bottom action row must map to `header.bottom`
- Left group must map to `header.bottom.leftGroup`
- Right group must map to `header.bottom.rightGroup`

Rules:
- Do not create custom layout outside defined header structure
- Do not flatten header sections into a single row

### Primary Card Header with Pills

This pattern is used for main section headers inside Primary Cards.

Structure:
- Top area:
  - Title
  - Optional subtitle / metadata

- Bottom action row:
  - Left group:
    - Optional outlined icon-only action button
    - Optional secondary icon-only action button
    - Pills navigation

  - Right group:
    - Primary filled action button

Layout rules:
- Pills must be placed below the title/subtitle area
- Pills must not be placed inline with the title
- Pills belong to the bottom action row
- Bottom action row uses horizontal layout
- Left group is aligned to the left
- Right group is aligned to the right
- The primary action button must be pushed to the far right

Left group rules:
- The refresh action, when present, must be an outlined primary icon-only Bootstrap button
- Refresh icon must use Material Icons "refresh" (class="material-icons-outlined").
- Download action, when present, must be an outlined primary icon-only Bootstrap button
- Download icon must use Material Icons "file_download" (class="material-icons-outlined").
- Pills appear after the icon-only buttons

Right group rules:
- Main action uses Bootstrap filled primary button
- Main action label pattern: `+ Create {entity}`
- Add icon must be positioned to the left of the text
- Uses Material Icons "add" icon (class="material-icons-outlined").

Constraints:
- Do not create an extra title above this pattern
- Do not place pill navigation next to the title
- Do not center the pill navigation
- Do not replace pills with buttons


### Card Subtitle Label

Cards may include subtitle labels to separate groups of information inside the card content.

Variants:
- Text only
- Text with switch

Switch rules:

- Switch variant must use a toggle switch control
- Do not use standard checkboxes
- Use Bootstrap switch structure styled with Symphonica tokens
- Switch must be aligned to the right side of the subtitle label
- Switch height must not alter subtitle label height

Use cases:
- Grouping metadata
- Separating form/detail sections
- Labeling content blocks inside a card

Visual rules:
- Background: `Semantic/Color/Secondary`
- Border radius: `Core/Border/Radius/Sm`
- Height: `Core/Size/40`

Typography:
- Font family: Montserrat
- Font size: `Core/Typography/FontSize/14`
- Font weight: `Core/Typography/FontWeight/Semibold`
- Color: `Semantic/Text/Title`

Layout rules:
- Text must be vertically centered
- Text-only variant aligns title to the left
- Switch variant aligns title to the left and switch control to the right
- Switch must not override subtitle label height

---

### Primary Cards

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

### Secondary Cards

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

#### Default

- No shadow
- Border visible
- Border color: `Core/Color/Neutral/500`

#### Hover

- Applies card shadow

#### Active

- No shadow
- Border color: `Semantic/Color/Success/Base`

#### Selected

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

### Secondary Card Grid Variant

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

### Secondary Card Spacing (fixed)

- Padding: `Core/Spacing/24`
- Gap: `Core/Spacing/24`
- Footer/actions spacing: `Core/Spacing/24`

---

### Card Typography

#### Header / Title

- Font family: Montserrat
- Font size: `20px`
- Font weight: `600`
- Color: `Semantic/Text/Title`

#### Body

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

### Card Actions

Actions inside cards must use existing button definitions:

- Primary actions → Filled Button
- Secondary actions → Outlined Button
- Contextual actions → Icon Button

---

### Card Status Badge Placement

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

### Implementation Rules

- Do not hardcode border radius
- Do not hardcode shadow
- Do not hardcode spacing
- Primary cards must not have borders
- Secondary cards must not have shadow except on hover

---

## 5.6 Navigation Components — Pills

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

### Default
- Background: transparent
- Text: `Semantic/Text/Secondary`

### Hover
- Background: `Core/Color/Neutral/200`
- Text: `Semantic/Text/Secondary`

### Active
- Background: `Semantic/Color/Primary/Base`
- Text: `Semantic/Text/White`

### Disabled
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

## 5.7 Navigation — Tabs Top (Secondary Cards)

Tabs Top are Bootstrap `nav-tabs` used **inside Secondary Card bodies** to switch sections or views. They align with the [Bootstrap 5 UI Kit — Tabs top](https://www.figma.com/design/nxyHm0KrZLbBCr9Y8iC1km/Bootstrap-5-Design-System---UI-Kit?node-id=1-34210) component: primary theme border on the track and on the active tab, Montserrat 14 / medium, inactive labels use body text color on white card.

### Structure

- Markup: `ul.nav.nav-tabs` with Symphonica scope class (e.g. `sym-nav-tabs-top`), `li.nav-item`, `button.nav-link` (or anchor when routed).
- `role="tablist"` on the `ul`; each control `role="tab"`.

### When to use

- **Secondary Cards**: use Tabs Top for in-card section switching.
- **Primary Card Header** bottom row: keep **Pills** (or filters / button group) per Card Header rules — do not replace Card Header pills with Tabs Top unless product spec changes.

### Tokens

- Use `component.nav.tabs.top` for track border, tab typography, padding, radii, gap, and inactive / inactiveHover / active / disabled surfaces.

### Visual (summary)

- **Track**: bottom border `Semantic/Color/Primary` (`component.nav.tabs.top.track`).
- **Active tab**: white background, top/left/right border primary, label `Semantic/Text/Title`, top corner radius from tokens; bottom border meets the track using the white “cover” token so the tab connects to the content area.
- **Inactive tab**: transparent background and **transparent borders** (`component.nav.tabs.top.inactive.borderColor`); label `Semantic/Text/Primary`. Inactive must not look like a boxed tab until hover or active.
- **Inactive hover**: background `Core/Color/Neutral/100`; **primary border on top, left, and right** (`component.nav.tabs.top.inactiveHover.borderColor`); **bottom border uses `inactiveHover.borderBottomCover`** (same as hover background) to overlap the track—same pattern as active’s white cover. Do not map hover borders to `inactive.borderColor` or the outline stays invisible.
- **Disabled**: transparent background, `Core/Color/Neutral/500` label.

### Rules

- Do not use **Pills** for this in-card pattern when Tabs Top is required.
- Do not use default Bootstrap tab colors; override with Symphonica tokens.
- Tables and table footers do not use Tabs Top for row actions (use circular icon buttons per table rules).

---

## 5.8 Navigation — App Sidebar (Primary menu)

The **Symphonica primary navigation** is a **vertical sidebar** (logo / wordmark, global search field, domain list with leading Material Icons Outlined, labels, trailing `chevron_right`). Source: [Guía de Estilos — menú](https://www.figma.com/design/7JdlMVI0UphCTyuHFF9Fww/Guia-de-Estilos-de-Symphonica?node-id=7089-7392).

### Structure

- **Shell**: `aside` (or app-owned landmark) with scope class `sym-sidebar`; optional `sym-sidebar--collapsed` when width is collapsed.
- **Header**: wordmark **Symphonica** (typography from `component.nav.sidebar` wordmark tokens) + toggle control (`menu_open` when expanded, `menu` when collapsed).
- **Search**: single-line field, placeholder tone `component.nav.sidebar.searchPlaceholderColor`, border `searchBorderColor`, type size `searchFontSize`, suffix search icon (Material Outlined `search`).
- **Nav list**: `ul` / list with **`menuListGap`** = **`Core/Spacing/24`** — **24px between consecutive leading icons** (vertical). Use **`itemPaddingY`** = **`Core/Spacing/0`** so row height follows the 24px icon and the stack does not inflate vertical space between icons. Horizontal gap between leading icon and label: **`itemGap`** (`Core/Spacing/16`). Each row is a single interactive control (`button` or routed link) with:
  - Leading icon **24px** (`iconSize`), tinted per row using **`component.nav.sidebar.itemIcon.*`** (aliases to the semantic palette — e.g. Home → primary base, Service Domain → success base). Do **not** replace these with arbitrary hex outside tokens.
  - Label: Montserrat **`itemLabelFontSize` / `itemLabelFontWeight`**, `Semantic/Text/Primary`.
  - Trailing **`chevron_right`** in `chevronColor`.
- **Widths**: expanded → `component.nav.sidebar.widthExpanded` (aliases **`layout.apiExplorer.sidebarColumnWidth`**, 330px); collapsed → **`widthCollapsed`** (64px). Collapsed mode hides label, chevron, and search (visually / SR-friendly), centers row icons, tightens horizontal padding.

### States

- **Row hover**: background `itemHoverBackground` (`Core/Color/Neutral/100`).
- **Current / active route** (optional): background `itemActiveBackground` (`Semantic/Color/Primary/Light`); set `aria-current="page"` on the active control.
- **Motion**: width and row transitions use `Core/Motion` tokens (respect reduced motion).

### Rules

- Implement with **`component.nav.sidebar`** only for sizes, colors, and spacing — see `design_tokens.json` and generated CSS variables.
- Icons: **Material Icons Outlined** only, 24px row icons; toggle uses tokenized control styling (`toggleIconColor`).
- **Scroll / overflow**: expanded — overflow scrolls on the **nav list only** (header + search stay fixed). Collapsed — **no visible scrollbar** on the sidebar; use `overflow: hidden` on shell and nav so the narrow rail never shows a scroll track.
- Do not restyle sidebar rows as Bootstrap `nav-pills` or `nav-tabs`; this pattern is separate from Card Header pills and Secondary Card Tabs Top.
- Product logo asset may replace the text wordmark; keep dimensions and spacing token-driven.

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
- Header layout
- Title / subtitle placement
- Pills placement
- Filters placement
- Header-level actions placement

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
- Badge placement inside cards is owned by the Card, not by the Badge

---

## 8. Layout & Structure

### Layout Model

Symphonica uses a structured layout:

- Header (fixed top)
- Sidebar (fixed/collapsible) — visual and token spec: **§5.8** (`component.nav.sidebar`; expanded width follows `layout.apiExplorer.sidebarColumnWidth` unless product updates layout tokens)
- Body Content (absolute positioned, 94px from top, z-index above the Header)
- Footer (fixed bottom)
- Sidebar expand/collapse must use Motion tokens defined in `Core Tokens / Motion`.

DIAGRAMA DE LAYOUT: SIDENAV EXPANDIDO (340px)

┌──────────┬──────────────────────────────────────────────────────────┐
│          │                                                          │
│  Sidenav │  Header (Fixed top) Height: 156px                        │
│  (340px) │──────────────────────────────────────────────────────────│
│  (Fixed) │                                                          │
│          │  +- - - - - - - - - - - - - - - - - - - - - - - - - -+   │
│          │  | Body Content (Absolute Position)                  |   │
│          │  | (94px margin top)                                 |   │
│          │  | (32px padding left/right)                         |   │
│          │  | (16px margin bottom)                              |   │
│          │  +- - - - - - - - - - - - - - - - - - - - - - - - - -+   │
│          │                                                          │
│          │──────────────────────────────────────────────────────────│
│          │  Footer (Fixed bottom) Height: 48px                      │
└──────────┴──────────────────────────────────────────────────────────┘
DIAGRAMA DE LAYOUT: SIDENAV CERRADO (64px)
┌─────┬───────────────────────────────────────────────────────────────┐
│     │                                                               │
│Sid  │       Header (Fixed top) Height: 156px                        │
│enav │                                                               │ 
│64px │───────────────────────────────────────────────────────────────│
│Fixed│                                                               │
│     │     +- - - - - - - - - - - - - - - - - - - - - - - - - -+     │
│     │     | Body Content (Absolute Position)                  |     │
│     │     │ (94px margin top)                                 |     │
│     │     | (32px padding left/right)                         |     │
│     │     | (16px margin bottom)                              |     │
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

Top-level content inside the application body must use a consistent vertical gap.

Rules:
- Direct child sections/cards inside Body Content must be separated by `Core/Spacing/24`
- This spacing applies between independent Primary Cards, Secondary Card groups, tables, and section header cards
- Do not manually stack components without spacing
- Do not use arbitrary margins between page sections
- Section spacing must be owned by the Body Content layout, not by individual components

Implementation:
- Use `layout.body.sectionGap` for vertical spacing between top-level page elements
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

- Prefer flex/grid
- Avoid absolute positioning except Body Content (Absolute Position) 

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

- `Component/Button/Icon/Primary/Icon/Active`
  → `component.button.icon.primary.icon.active`

---

## 12. Constraints for AI / Cursor
- Body Content must use `layout.body.sectionGap` between top-level sections/cards
- **App sidebar** (primary Symphonica menu): use **`component.nav.sidebar`** tokens and Material Icons Outlined per §5.8; **24px vertical spacing between leading icons** via `menuListGap` with **`itemPaddingY` 0**; map each domain row’s leading icon color via **`itemIcon.*`** aliases — do not substitute ad-hoc colors or reuse Tabs Top / Card Header pill styles for this shell; **collapsed sidebar must not show a scrollbar** (overflow hidden per §5.8)
- Circular icon buttons inside **table** action columns and **table footer** load-more must use `component.button.icon.primary` (default hover: white), not `primaryCard`
- Circular icon buttons on **white card surfaces** use `component.button.icon.primaryCard` / `dangerCard` (hover: `Semantic/Color/Secondary`)
- Inside **Secondary Card** bodies, use **Tabs Top** tokens (`component.nav.tabs.top`) for section navigation; Card Header rows still use **Pills** where specified — do not mix `nav-tabs` and pills in the same Card Header row
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
  - Custom components

- Do not apply core.border.radius tokens to Bootstrap components unless explicitly defined.

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