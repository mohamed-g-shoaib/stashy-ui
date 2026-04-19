> **LLM Context & Usage Guide**
> **File Purpose:** The authoritative source of truth for the visual identity and structural constraints of the Stashy interface.
> **How to Use:** Before writing _any_ UI code (CSS, Tailwind, or React components), agents MUST cross-reference this document to ensure colors, paddings, shadows, and fonts strictly align with these specifications. No arbitrary pixel values or tailwind default colors are permitted. You must map these token values exactly as described into the Web Sandbox (Next.js/Tailwind).
> **Constraint Reminder:** Stashy's web environment is a sandbox mimicking a mobile app. Stick strictly to mobile bounding boxes (`max-w-sm`).

# Stashy Mobile Design System

## 1. Visual Theme & Atmosphere

Stashy is a parchment-toned pocket ledger — warm, immediate, and unapologetically focused on one number. The canvas is a cream so warm it almost has a grain to it (`#f5f4ed`), the kind of surface that makes a financial figure feel less clinical and more personal. Every screen is organized around a single dominant hierarchy: the hero number sits at the top like a headline, the supporting data falls below it like a subheading, and nothing competes. Where most fintech apps reach for cold precision, Stashy reaches for warmth — the difference between a bank statement and a note from someone who actually wants you to be okay.

Depth is achieved without drama. Cards float on the parchment via ring shadows rather than drop shadows — a 1px warm halo rather than a lifted blur. Color is used sparingly: everything neutral is warm-toned, and the single chromatic accent (Terracotta `#c96442`) appears at most once per screen, always as the primary action. Financial distress states (Emergency Mode, overspend, budget pressure) break this calm deliberately — danger red and amber amber exist to interrupt, not to decorate.

**Core tone:** Warm authority. Like a financially savvy friend who gives you a straight answer.

**The two non-negotiables:**

1. The hero number (Remaining Today) must dominate every screen it appears on.
2. Emergency and warning states must never be subtle — financial distress demands visual urgency.

---

## 2. Color System

### 2.1 Light Theme — Parchment Canvas

- **Parchment** (`#f5f4ed`): The page background — warm cream, the emotional foundation of the entire app
- **Ivory** (`#faf9f5`): Card and container surface — barely lighter than Parchment, creates subtle elevation
- **Pure White** (`#ffffff`): Highest elevation only — modals, floating sheets
- **Warm Sand** (`#ede9e0`): Input fills, inactive tabs, offset surfaces
- **Border Warm** (`#e8e6dc`): Visible dividers and prominent containment
- **Border Cream** (`#f0eee6`): Ghost borders, subtle separation
- **Scrim** (`rgba(20, 20, 19, 0.48)`): Modal overlay

- **Near Black** (`#141413`): Primary text — warm, barely olive-tinted dark; never pure black
- **Olive Gray** (`#5e5d59`): Secondary text — distinctly warm medium dark
- **Stone Gray** (`#87867f`): Captions, metadata, de-emphasized content
- **Ivory** (`#faf9f5`): Text on dark surfaces and on brand (Terracotta) backgrounds

```
--color-bg:               #f5f4ed
--color-surface:          #faf9f5
--color-surface-2:        #ffffff
--color-surface-offset:   #ede9e0
--color-border:           #e8e6dc
--color-border-subtle:    #f0eee6
--color-overlay:          rgba(20, 20, 19, 0.48)
--color-text:             #141413
--color-text-secondary:   #5e5d59
--color-text-tertiary:    #87867f
--color-text-on-dark:     #faf9f5
--color-text-on-brand:    #faf9f5
```

### 2.2 Dark Theme — Deep Ink

- **Deep Ink** (`#141413`): Page background — warm near-black with an olive undertone
- **Warm Charcoal** (`#1e1e1c`): Card surface on dark
- **Elevated Dark** (`#252523`): Higher-elevation surfaces on dark
- **Dark Surface** (`#30302e`): Input fills, inactive tabs on dark
- **Dark Border** (`#3a3a38`): Visible borders on dark
- **Warm White** (`#f0ede6`): Primary text on dark
- **Warm Silver** (`#b0aea5`): Secondary text on dark — parchment-tinted light gray

```
--color-bg:               #141413
--color-surface:          #1e1e1c
--color-surface-2:        #252523
--color-surface-offset:   #30302e
--color-border:           #3a3a38
--color-border-subtle:    #30302e
--color-overlay:          rgba(0, 0, 0, 0.64)
--color-text:             #f0ede6
--color-text-secondary:   #b0aea5
--color-text-tertiary:    #6e6d68
--color-text-on-dark:     #f0ede6
--color-text-on-brand:    #faf9f5
```

### 2.3 Brand Accent — Terracotta

The single chromatic identity of Stashy. Earthy, warm, deliberately un-tech. Used only for the primary CTA and the single highest-signal brand moment per screen. Never diluted. Never doubled.

- **Terracotta Brand** (`#c96442`): Primary CTA button, key actions
- **Terracotta Pressed** (`#b05538`): Active / pressed state
- **Brand Subtle Light** (`#f2e0d8`): Tinted surface for brand context (light theme)
- **Brand Subtle Dark** (`#3d2218`): Tinted surface (dark theme)
- **Coral** (`#d97757`): Secondary emphasis, text accent on dark surfaces

```
--color-brand:            #c96442
--color-brand-hover:      #b05538
--color-brand-subtle:     #f2e0d8
--color-brand-subtle-dark:#3d2218
--color-coral:            #d97757
```

### 2.4 Semantic Colors — Financial States

These are the only non-neutral, non-terracotta colors permitted. They exist to communicate financial health — not for decoration.

#### Danger — Emergency Mode & Critical Errors

- **Error Crimson** (`#b53333`): Emergency mode, overspend, destructive confirms, form errors
- **Error Crimson Pressed** (`#8f2424`): Pressed state
- **Danger Subtle Light** (`#f5dcdc`): Danger tint surface (light)
- **Danger Subtle Dark** (`#3d1c1c`): Danger tint surface (dark)
- **Danger on Dark** (`#e06060`): Danger text/icon on dark backgrounds

```
--color-danger:           #b53333
--color-danger-hover:     #8f2424
--color-danger-subtle:    #f5dcdc
--color-danger-subtle-dark: #3d1c1c
--color-danger-dark:      #e06060
```

**Usage:** Emergency Mode banner; overspend values; destructive confirm dialogs; form validation errors.

#### Warning — Budget Pressure

- **Warm Amber** (`#c97d1a`): Major expense warnings, budget pressure signal
- **Amber Pressed** (`#a86415`): Pressed state
- **Warning Subtle Light** (`#f7ead4`): Amber tint surface (light)
- **Warning Subtle Dark** (`#3a2c10`): Amber tint (dark)
- **Warning on Dark** (`#e8a030`): Warning text/icon on dark backgrounds

```
--color-warning:          #c97d1a
--color-warning-hover:    #a86415
--color-warning-subtle:   #f7ead4
--color-warning-subtle-dark: #3a2c10
--color-warning-dark:     #e8a030
```

**Usage:** Major Expenses card progress bar; `major_warning: true` inline message; Tomorrow's Rate Impact card.

#### Success — On-Track Fixed Expenses

- **Forest Green** (`#4a7c3f`): Fixed expense on-track / paid status
- **Forest Green Pressed** (`#3a612f`): Pressed state
- **Success Subtle Light** (`#d8edcc`): Success tint surface (light)
- **Success Subtle Dark** (`#1e3316`): Success tint (dark)
- **Success on Dark** (`#6daa45`): Success text/icon on dark backgrounds

```
--color-success:          #4a7c3f
--color-success-hover:    #3a612f
--color-success-subtle:   #d8edcc
--color-success-subtle-dark: #1e3316
--color-success-dark:     #6daa45
```

**Usage:** Fixed Tracker item status (on-track / paid); progress bar fill at `progress_pct >= 95`; catch-up success confirmation.

#### Neutral Info

For non-critical contextual information: auto-pay labels, sync indicators.

- **Muted Teal-Blue** (`#3d7fa8`): Info state
- **Info Subtle Light** (`#daeef7`): Info tint (light)
- **Info Subtle Dark** (`#1a2e38`): Info tint (dark)
- **Info on Dark** (`#5ea8d4`): Info text/icon on dark backgrounds

```
--color-info:             #3d7fa8
--color-info-subtle:      #daeef7
--color-info-subtle-dark: #1a2e38
--color-info-dark:        #5ea8d4
```

### 2.5 Elevation & Shadow

Ring-shadow system. Depth through warm-toned halos, not drop shadows.

- **Shadow Ring** (`0 0 0 1px rgba(20, 20, 19, 0.10)`): Subtle ring — card borders
- **Shadow Ring Brand** (`0 0 0 1px rgba(201, 100, 66, 0.40)`): Active brand state
- **Shadow Ring Danger** (`0 0 0 1px rgba(181, 51, 51, 0.40)`): Danger input / card state
- **Shadow Soft** (`0 2px 8px rgba(20, 20, 19, 0.08), 0 0 0 1px rgba(20, 20, 19, 0.06)`): Elevated cards
- **Shadow Card** (`0 4px 16px rgba(20, 20, 19, 0.10), 0 1px 4px rgba(20, 20, 19, 0.06)`): Featured cards
- **Shadow Modal** (`0 16px 48px rgba(20, 20, 19, 0.20), 0 4px 16px rgba(20, 20, 19, 0.10)`): Modals, bottom sheets

Dark mode: replace `rgba(20, 20, 19, ...)` with `rgba(0, 0, 0, ...)` at ×1.5 opacity.

```
--shadow-ring:        0 0 0 1px rgba(20, 20, 19, 0.10)
--shadow-ring-brand:  0 0 0 1px rgba(201, 100, 66, 0.40)
--shadow-ring-danger: 0 0 0 1px rgba(181, 51, 51, 0.40)
--shadow-soft:        0 2px 8px rgba(20, 20, 19, 0.08), 0 0 0 1px rgba(20, 20, 19, 0.06)
--shadow-card:        0 4px 16px rgba(20, 20, 19, 0.10), 0 1px 4px rgba(20, 20, 19, 0.06)
--shadow-modal:       0 16px 48px rgba(20, 20, 19, 0.20), 0 4px 16px rgba(20, 20, 19, 0.10)
```

**React Native Implementation Note:**
Ring shadows map to `borderWidth` + `borderColor` on the container `View`. Soft/card/modal shadows use iOS `shadow*` props + Android `elevation` (2 / 4 / 12 respectively). `boxShadow` has no effect in React Native — never use it in StyleSheet.

---

## 3. Typography

### 3.1 Font Family: Google Sans Flex

A variable font with generous x-height, open apertures, and compressed numerals that read at speed — ideal for financial UIs. Used as a variable font in Stitch; for React Native, see the static font mapping in §3.2.

```
font-family: 'Google Sans Flex', system-ui, -apple-system, sans-serif;
```

### 3.2 React Native Static Font Strategy

Google Sans Flex ships as static `.ttf` instances per optical size and weight. Variable axes (`GRAD`, `ROND`, `opsz`, `wdth`, `slnt`) cannot be controlled at runtime in React Native. Apply this mapping when loading fonts via `expo-font`:

| Role                               | File                                                                                                    | Alias                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Hero Number (48–56pt)              | `GoogleSansFlex_72pt-Bold.ttf`                                                                          | `GoogleSansFlex-HeroNumber`                                               |
| Display / Title 1 (24–32pt)        | `GoogleSansFlex_24pt-SemiBold.ttf`                                                                      | `GoogleSansFlex-Display`                                                  |
| Title 2 / Title 3 / Body (15–20pt) | `GoogleSansFlex_24pt-Regular.ttf`, `GoogleSansFlex_24pt-Medium.ttf`, `GoogleSansFlex_24pt-SemiBold.ttf` | `GoogleSansFlex-Body`, `GoogleSansFlex-Medium`, `GoogleSansFlex-SemiBold` |
| Caption / Footnote (11–13pt)       | `GoogleSansFlex_9pt-Regular.ttf`, `GoogleSansFlex_9pt-Medium.ttf`                                       | `GoogleSansFlex-Caption`, `GoogleSansFlex-CaptionMedium`                  |

Axis rules that are Stitch/Figma design-tool-only — not enforceable in React Native:

- `GRAD -25` dark mode
- `ROND` values
- `opsz` matching

What IS enforceable in React Native:

- Font weight via separate family aliases (each weight = separate `fontFamily`)
- `fontVariantNumeric: 'tabular-nums'` on `Text` for tabular figures (iOS; Android depends on font compilation)
- `lineHeight`, `letterSpacing`, `writingDirection: 'rtl'`

### 3.3 Type Scale

All sizes in platform-agnostic pt/sp. Stitch design tool: apply `opsz` and `ROND` as specified. React Native: use the alias mapping above.

| Role                 | Size | wght | Line Height | Letter Spacing | Usage                                 |
| -------------------- | ---- | ---- | ----------- | -------------- | ------------------------------------- |
| **Hero Number**      | 56pt | 700  | 1.00        | -0.5pt         | Remaining Today — the dominant number |
| **Hero Number (lg)** | 48pt | 700  | 1.00        | -0.5pt         | Large dashboard values                |
| **Display**          | 32pt | 600  | 1.10        | -0.25pt        | Section hero headings                 |
| **Title 1**          | 24pt | 600  | 1.20        | -0.15pt        | Screen titles, card headers           |
| **Title 2**          | 20pt | 600  | 1.25        | -0.10pt        | Major section headings                |
| **Title 3**          | 17pt | 600  | 1.30        | 0              | Card subheadings                      |
| **Body**             | 17pt | 400  | 1.50        | 0              | Standard body text                    |
| **Callout**          | 16pt | 400  | 1.50        | 0              | Secondary body, descriptions          |
| **Subhead**          | 15pt | 500  | 1.40        | 0              | Navigation links, emphasized UI       |
| **Footnote**         | 13pt | 400  | 1.40        | 0.1pt          | Fine print, hints                     |
| **Caption 1**        | 12pt | 400  | 1.30        | 0.2pt          | Labels, metadata                      |
| **Caption 2**        | 11pt | 500  | 1.25        | 0.3pt          | **Absolute floor. Never smaller.**    |

**Minimum text size:** 11pt/sp — Apple HIG and Material Design 3 minimum.

### 3.4 Number Display Rules

Financial numbers have their own rendering rules.

- Use tabular figures (`fontVariantNumeric: 'tabular-nums'` in React Native; `font-feature-settings: "tnum" 1` in Stitch) on any number that changes dynamically — prevents layout shift as digits update
- EGP amounts: `"482 EGP"` — amount first, currency suffix in Caption 1 weight 500 color secondary
- Negative / overspent values: use `--color-danger` (light) or `--color-danger-dark` (dark theme)
- Rate numbers (Today's Rate, Base Rate): Title 2 size — not Hero size; hierarchy must be clear
- Progress percentages: Caption 1 size, weight 600

### 3.5 RTL / Arabic Rules

Google Sans Flex supports Arabic script natively. When rendered in Arabic (`dir="rtl"`):

- Body line-height increases to 1.70 (Arabic descenders and ascenders need more clearance)
- Label/Caption line-height increases to 1.50
- Letter-spacing: 0 for all Arabic text (tracking disrupts Arabic joining)
- Numbers (EGP amounts) remain in LTR direction within RTL layouts — use `writingDirection: 'ltr'` on number Text components
- `wght 400` for Arabic body (Arabic strokes appear heavier than Latin at the same weight)
- Stitch design note: `ROND 40` is recommended for Arabic display text — rounder terminals complement Arabic letterforms

**Shadcn/UI Native RTL Architecture:**

- The project's shadcn/ui installation has native RTL enabled.
- **Always use logical classes:** Never use physical classes (`left-*`, `right-*`, `pl-*`, `mr-*`, etc.). Always use their logical equivalents (`start-*`, `end-*`, `ps-*`, `me-*`, etc.). The framework automatically interprets these correctly based on `dir`.
- **Icons:** Directional icons must use the `rtl:rotate-180` tailwind class to flip properly in Arabic mode.
- **Portals & Animations:** Due to a known `tw-animate-css` bug, you MUST explicitly pass the `dir="rtl"` prop to portaled elements (like `<PopoverContent dir="rtl">` or `<TooltipContent dir="rtl">`). If you do not, logical slide animations (e.g., `slide-in-from-end`) will compute off physical boundaries and break.

---

## 4. Spacing System

### 4.1 Base Unit

**8pt/dp base unit.** All spacing is a multiple of 4pt for micro-adjustments. The effective floor for all interactive elements is **48pt/dp**.

```
--space-1:    4pt
--space-2:    8pt
--space-3:   12pt
--space-4:   16pt
--space-5:   20pt
--space-6:   24pt
--space-8:   32pt
--space-10:  40pt
--space-12:  48pt
--space-16:  64pt
```

### 4.2 Touch Target Rules

- **Minimum interactive size:** 48×48pt
- **Minimum spacing between targets:** 8pt — never closer
- **Recommended CTA height:** 52pt
- **Bottom navigation tab items:** min 48pt height
- **Icon-only buttons:** always 48×48pt hit area, even if icon is 24pt
- **List row height (transaction items):** min 56pt
- **Form input height:** 52pt
- **Destructive actions (delete):** min 44pt height, require confirmation dialog

### 4.3 Safe Area Insets

Never hardcode safe area values. Always use `safeAreaInsets` from the platform.

| Device zone             | Rule                               |
| ----------------------- | ---------------------------------- |
| Status bar / top inset  | Defer to `safeAreaInsets.top`      |
| Home indicator / bottom | Defer to `safeAreaInsets.bottom`   |
| Bottom tab bar total    | 49pt bar + `safeAreaInsets.bottom` |
| Keyboard avoidance      | Use `KeyboardAvoidingView`         |

### 4.4 Screen Layout Tokens

```
--screen-horizontal-margin:  16pt
--card-padding:              16pt
--card-gap:                  12pt
--section-gap:               24pt
--list-item-padding-v:       14pt
--list-item-padding-h:       16pt
--bottom-nav-height:         49pt
```

---

## 5. Border Radius

```
--radius-xs:     4pt    /* Badges, chips, small pills */
--radius-sm:     8pt    /* Buttons, input fields, small cards */
--radius-md:    12pt    /* Standard cards, list containers */
--radius-lg:    16pt    /* Featured cards, modal sheets */
--radius-xl:    20pt    /* Hero containers, bottom sheets */
--radius-full:  9999pt  /* Status pills, toggle tracks */
```

**Nested radius rule:** Inner element radius = outer radius − gap. If outer card is `--radius-md` (12pt) and inner content has 12pt padding, inner element radius = 0.

---

## 6. Component Tokens

### 6.1 Buttons

**Primary (Terracotta)**

- Background: Terracotta Brand (`#c96442`)
- Text: Ivory (`#faf9f5`), wght 600, 17pt
- Height: 52pt · Radius: 8pt · Shadow: `--shadow-ring-brand`
- Press state: background `#b05538`
- Used for: primary submit, add transaction, confirm actions

**Secondary (Warm Sand)**

- Background: Warm Sand (`#ede9e0`)
- Text: Near Black (`#141413`), wght 500, 17pt
- Height: 52pt · Radius: 8pt · Shadow: `--shadow-ring`
- Used for: secondary actions, filters, cancel (non-destructive)

**Ghost**

- Background: transparent · Text: Terracotta (`#c96442`), wght 500, 15pt
- Height: 44pt · No border, no shadow
- Used for: tertiary actions, inline links

**Destructive**

- Background: Error Crimson (`#b53333`) · Text: #ffffff, wght 600, 17pt
- Height: 52pt · Radius: 8pt
- Used for: hard delete, dangerous confirms only

**Dark theme:** Terracotta primary unchanged. Sand secondary becomes Dark Surface (`#30302e`). Text adjusts to Warm White (`#f0ede6`).

### 6.2 Cards

```
Background:  --color-surface (#faf9f5 / #1e1e1c)
Border:      1px solid --color-border-subtle
Radius:      --radius-md (12pt)
Padding:     --card-padding (16pt)
Shadow:      --shadow-soft
```

**Interactive card:** Add `--shadow-ring` on press; scale 0.98 on press.

**Danger card (Emergency Mode):**

```
Background:  --color-danger-subtle (#f5dcdc / #3d1c1c)
Border:      1.5px solid --color-danger
```

**Warning card (Major Expenses):**

```
Background:  --color-warning-subtle (#f7ead4 / #3a2c10)
Border:      1px solid --color-warning
```

### 6.3 Progress Bars

- Track: `--color-surface-offset` · Height: 6pt (standard) / 4pt (compact) · Radius: `--radius-full`
- Fill — Variable budget: Terracotta (`#c96442`)
- Fill — Fixed on-track: Forest Green (`#4a7c3f`)
- Fill — Fixed over budget: Error Crimson (`#b53333`)
- Fill — Major expenses: Warm Amber (`#c97d1a`)
- Animate fill on mount: 400ms ease-out from 0% to final value

### 6.4 Input Fields

```
Background:  --color-surface-offset
Border:      1px solid --color-border
Radius:      --radius-sm (8pt)
Height:      52pt
Padding:     0 16pt
Font:        Body (17pt, wght 400)
Placeholder: --color-text-tertiary
```

Focus: `1.5px solid --color-brand`, ring `--shadow-ring-brand`.
Error: `1.5px solid --color-danger`, ring `--shadow-ring-danger`.

### 6.5 List Rows (Transaction Items)

```
Height:      min 56pt
Padding:     14pt vertical / 16pt horizontal
Separator:   1px --color-border-subtle (leading inset 16pt)
Background:  --color-surface
Press state: --color-surface-offset, 100ms
```

No colored left-side border on list rows. Status is communicated via text color and type badges only.

### 6.6 Type Badges

```
Radius:   --radius-full
Padding:  2pt 8pt
Font:     Caption 2 (11pt, wght 500)
```

| Badge            | Light bg                 | Light text        | Dark bg                       | Dark text              |
| ---------------- | ------------------------ | ----------------- | ----------------------------- | ---------------------- |
| Variable         | `#ede9e0`                | `#5e5d59`         | `#30302e`                     | `#b0aea5`              |
| Fixed            | `--color-info-subtle`    | `--color-info`    | `--color-info-subtle-dark`    | `--color-info-dark`    |
| Major            | `--color-warning-subtle` | `--color-warning` | `--color-warning-subtle-dark` | `--color-warning-dark` |
| Budget Injection | `--color-success-subtle` | `--color-success` | `--color-success-subtle-dark` | `--color-success-dark` |
| Transfer         | `--color-brand-subtle`   | `--color-brand`   | `--color-brand-subtle-dark`   | `--color-coral`        |
| Received         | `--color-success-subtle` | `--color-success` | `--color-success-subtle-dark` | `--color-success-dark` |

### 6.7 Bottom Navigation Bar

```
Height:           49pt + safeAreaInsets.bottom
Background:       --color-surface (with blur/vibrancy on iOS)
Border-top:       1px --color-border-subtle
Tab icon size:    24pt
Tab label:        Caption 2 (11pt, wght 500)
Active color:     --color-brand
Inactive color:   --color-text-tertiary
Active indicator: small pill in --color-brand-subtle
```

### 6.8 Bottom Sheet / Modal

```
Background:  --color-surface
Radius top:  --radius-xl (20pt)
Handle:      4pt × 36pt, --color-border, centered, 8pt from top
Overlay:     --color-overlay
Safe area:   content clears safeAreaInsets.bottom
```

---

## 7. Motion Principles

- **Transitions:** 200–280ms, ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`)
- **Sheet presentation:** 320ms spring (damping 0.85)
- **Number changes:** Count-up or flip animation when dashboard values update
- **Progress bar fill:** 400ms ease-out on mount
- **Emergency banner:** Slide-in from top, 320ms spring — never fade-in (urgency requires motion)
- **Skeleton shimmer:** 1.4s ease-in-out infinite, horizontal sweep
- **Accessibility:** Respect `UIAccessibility.isReduceMotionEnabled` — disable all animations, use instant transitions

---

## 8. Iconography

- Library: **Hugeicons** (`@hugeicons/react-native` + `@hugeicons/core-free-icons`) — sole icon library
- Preferred variant: **Stroke Rounded** — consistent with Google Sans Flex's warm aesthetic
- Icon size: 24pt (standard) / 20pt (compact, inside badges) / 28pt (tab bar)
- `strokeWidth`: 1.5 (standard UI) / 2.0 (emphasis, active states)
- Color: match surrounding text role — primary, secondary, or tertiary
- No colored backgrounds, circles, or containers around icons
- Icon-only buttons: always provide `accessibilityLabel`
- Do not use emoji as interface icons

---

## 9. Do's ✓

- Use Parchment `#f5f4ed` as the default light background — it IS the Stashy personality
- Use Terracotta `#c96442` only for the single most important action on each screen
- Use tabular figures on all numeric values that change dynamically
- Use `--shadow-ring` (0 0 0 1px) for interactive card/button depth — never drop shadows
- Always account for `safeAreaInsets` — hardcode nothing
- Alternate light and dark screens across the app for visual variety
- Keep all neutral grays warm-toned — every gray has a yellow-brown undertone
- Use 8pt minimum spacing between all interactive elements

---

## 10. Don'ts ✗

- **Never** use a colored left-side border on cards or list rows
- **Never** use Terracotta for more than one element per screen
- **Never** introduce cool-tone grays — every neutral must have a yellow-brown undertone
- **Never** use pure black (`#000000`) or pure white (`#ffffff`) as page backgrounds
- **Never** design text smaller than 11pt/sp
- **Never** hardcode safe area values — use platform APIs
- **Never** place interactive elements with less than 8pt of separation
- **Never** use italic text in financial data displays
- **Never** use gradient buttons — solid Terracotta only for primary CTA
- **Never** use the danger color for anything other than genuinely dangerous states
- **Never** add icons or emoji to transaction type names or category labels

---

## 11. Agent Prompt Guide

Copy-paste-ready references for Stitch and AI generation tools.

### Core Palette (Light)

- Page background: `Parchment #f5f4ed`
- Card surface: `Ivory #faf9f5`
- Primary text: `Near Black #141413`
- Secondary text: `Olive Gray #5e5d59`
- Caption text: `Stone Gray #87867f`
- Border: `Border Warm #e8e6dc`
- Primary CTA: `Terracotta #c96442`
- CTA text: `Ivory #faf9f5`

### Core Palette (Dark)

- Page background: `Deep Ink #141413`
- Card surface: `Warm Charcoal #1e1e1c`
- Primary text: `Warm White #f0ede6`
- Secondary text: `Warm Silver #b0aea5`
- Border: `Dark Border #3a3a38`
- Primary CTA: `Terracotta #c96442` (unchanged in dark)

### Semantic Colors

- Emergency / Error: `Error Crimson #b53333` (light) / `#e06060` (dark)
- Warning / Pressure: `Warm Amber #c97d1a` (light) / `#e8a030` (dark)
- On-track / Success: `Forest Green #4a7c3f` (light) / `#6daa45` (dark)
- Info: `Muted Teal #3d7fa8` (light) / `#5ea8d4` (dark)

### Typography Reference

- Font: `Google Sans Flex`
- Hero number: `56pt, wght 700, tabular figures`
- Title 1: `24pt, wght 600`
- Body: `17pt, wght 400`
- Caption: `12pt, wght 400`
- Stitch design note: Hero uses `opsz 56, ROND 0`; Title uses `opsz 24, ROND 10`; dark mode add `GRAD -25` to all text; Arabic body: `ROND 40, line-height 1.70, letter-spacing 0`

### Example Stitch Screen Prompts

**Dashboard — Hero Number (light theme):**

```
Mobile portrait. Font: Google Sans Flex.
Background: Parchment (#f5f4ed). Card surface: Ivory (#faf9f5).
Hero number: 56pt Google Sans Flex wght 700 opsz 56 ROND 0, Near Black (#141413), tabular figures, letter-spacing -0.5pt.
Section title: 24pt wght 600 opsz 24 ROND 10, Olive Gray (#5e5d59).
Primary button: Terracotta (#c96442) background, Ivory (#faf9f5) text, 52pt height, 8pt radius, ring shadow (0 0 0 1px rgba(201,100,66,0.40)).
Cards: Ivory surface, 1px solid Border Cream (#f0eee6), 12pt radius, shadow-soft (0 2px 8px rgba(20,20,19,0.08)).
Touch targets minimum 48pt. No gradient fills. No colored left-side card borders. No cool-tone grays.
```

**Emergency Mode banner:**

```
Full-width banner on Danger Subtle (#f5dcdc) with 1.5px solid Error Crimson (#b53333) border.
Text: Error Crimson (#b53333), 17pt wght 600, urgent message copy.
Slide-in from top, 320ms spring animation — never fade.
```

**Fixed Expense Tracker card:**

```
Card on Ivory (#faf9f5), 1px Border Cream (#f0eee6), 12pt radius.
Title: 17pt wght 600 Near Black. Status badge pill: on-track uses Success Subtle (#d8edcc) background, Forest Green (#4a7c3f) text.
Progress bar: 6pt height, radius-full track in Warm Sand (#ede9e0), fill Forest Green (#4a7c3f), animate 400ms ease-out.
```

**Transaction list row:**

```
Row height 56pt, horizontal padding 16pt, vertical padding 14pt.
Background Ivory (#faf9f5). Separator: 1px Border Cream (#f0eee6), leading inset 16pt.
Amount: 17pt wght 600 Near Black tabular figures. Category: 15pt wght 400 Olive Gray.
Type badge: 11pt wght 500, radius-full pill, Variable badge background #ede9e0 text #5e5d59.
No left-side colored border.
```

**Bottom navigation bar:**

```
Height 49pt plus safe area bottom. Background Ivory (#faf9f5) with iOS blur vibrancy.
Top border 1px Border Cream (#f0eee6).
Active tab: icon and label Terracotta (#c96442), active indicator pill in Brand Subtle (#f2e0d8).
Inactive: icon and label Stone Gray (#87867f).
Icon size 28pt, label Caption 2 11pt wght 500.
```
