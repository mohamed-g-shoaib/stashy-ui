> **LLM Context & Usage Guide**
> **File Purpose:** The authoritative source of truth for the visual identity and structural constraints of the Stashy interface.
> **How to Use:** Before writing _any_ UI code (CSS, Tailwind, or React components), agents MUST cross-reference this document to ensure colors, paddings, shadows, and typography strictly align with these specifications. No arbitrary palette drift, alternate theme branches, or generic Tailwind defaults are permitted.
> **Constraint Reminder:** Stashy remains a mobile sandbox. Even when inspired by desktop references, the implementation must preserve mobile spacing, touch targets, hero hierarchy, and RTL behavior.

# Stashy Mobile Design System

## 1. Visual Theme & Atmosphere

Stashy should feel like a **warm ledger desk**: calm, grounded, and competent. The interface sits somewhere between Slite’s eye-comfort parchment, Cursor’s precise software-studio discipline, and Convex’s product seriousness, but it should not read like any of them directly. This is a budgeting product, so the system must feel trustworthy and soothing without becoming lifeless, and branded without becoming loud.

The whole app should live inside a single identity. No dark mode. No alternate mood. No bright-white SaaS emptiness. No harsh charcoal IDE. The background is warm and soft enough to live on for long sessions, the cards are slightly lighter and cleaner so the product can breathe, and the accent palette is muted and deliberate.

**Core tone:** Warm precision.

**The non-negotiables:**

1. The hero number still dominates every screen it appears on.
2. The system must remain comfortable for sustained use because there is no dark mode escape hatch.
3. Financial states must be instantly legible even inside a restrained palette.

---

## 2. Color System

### 2.1 Core Identity Palette

This is a Stashy-owned palette, curated from the references but tailored for a budgeting product and governed by `spec/controlled-design-system.md` plus `spec/brand-color-audit.md`.

- **Oat** (`#f4eee6`): primary app background
- **Cream** (`#fcf8f2`): main card and sheet surface
- **Biscuit** (`#f0e6d8`): offset surface, inactive controls, soft grouped blocks
- **Clay Wash** (`#e3d7c6`): visible warm border
- **Walnut** (`#2f2a24`): primary text and strongest structural anchors
- **Mocha** (`#686055`): secondary text and explanatory copy
- **Fog** (`#968c7d`): tertiary text, metadata, placeholders
- **Clay** (`#9b654b`): primary brand color and single highest-signal action
- **Ledger Gray** (`#7a7266`): variable category identity
- **Teal Ledger** (`#5f7f78`): fixed category identity and stable structure
- **Ochre Ledger** (`#9a7a33`): major category identity and burden signal
- **Meadow** (`#5f8f59`): received income and healthy recovery
- **Mulberry Reserve** (`#8a657b`): budget injection and reserve intervention state
- **Brick** (`#b15d45`): expense, overdue, destructive, and emergency state
- **Amber** (`#b3883b`): warning, due-soon, and review state
- **Iris** (`#7b6f96`): transfer and movement state

### 2.2 Runtime Token Mapping

These are the implementation tokens used in CSS and Tailwind:

```css
--color-bg: #f4eee6;
--color-surface: #fcf8f2;
--color-surface-2: #f8f1e7;
--color-surface-offset: #f0e6d8;
--color-border: #e3d7c6;
--color-border-subtle: #ece2d4;
--color-overlay: rgba(47, 42, 36, 0.42);
--color-text: #2f2a24;
--color-text-secondary: #686055;
--color-text-tertiary: #968c7d;
--color-text-on-brand: #fcf8f2;
--color-brand: #9b654b;
--color-brand-hover: #875740;
--color-brand-subtle: #ead9cc;
--color-variable: #7a7266;
--color-variable-subtle: #ece4d8;
--color-fixed: #5f7f78;
--color-fixed-subtle: #dde8e4;
--color-major: #9a7a33;
--color-major-subtle: #f1e5c9;
--color-income: #5f8f59;
--color-income-subtle: #dfead9;
--color-injection: #8a657b;
--color-injection-subtle: #ecdee6;
--color-expense: #b15d45;
--color-expense-subtle: #f2ddd7;
--color-warning: #b3883b;
--color-warning-subtle: #f2e5c8;
--color-transfer: #7b6f96;
--color-transfer-subtle: #e8e2f0;
```

### 2.3 Structural And Semantic Accent System

The key product colors are not decorative categories. They communicate budgeting meaning, and their full governance lives in `spec/brand-color-audit.md`.

Stashy uses a **two-axis color model**:

- **Structural identity** answers: what is this thing?
- **Consequence meaning** answers: what does this mean right now?

If both are present, consequence meaning should own the high-signal element such as the amount, warning strip, or alert state. Structural identity may still appear in a chip, border, icon well, legend, or secondary label.

#### Structural Identity Colors

- **Variable**: **Ledger Gray** `#7a7266`
- **Fixed**: **Teal Ledger** `#5f7f78`
- **Major**: **Ochre Ledger** `#9a7a33`
- **Transfer**: **Iris** `#7b6f96`

These colors identify category or object type. They should not automatically imply good or bad.

#### Consequence Meaning Colors

- **Income / received / relief**: **Meadow** `#5f8f59`
- **Budget injection / reserve intervention**: **Mulberry Reserve** `#8a657b`
- **Expense / overdue / destructive / emergency**: **Brick** `#b15d45`
- **Warning / review / due-soon**: **Amber** `#b3883b`
- **Quiet status / inactive / archived / draft**: **Fog** `#968c7d`

These colors communicate what is happening, not what category the record belongs to.

#### Examples

- A **fixed overdue** item may use a teal category chip but a brick amount or alert.
- A **variable received** item may use a moss category marker but a meadow amount.
- A **budget injection** should not reuse normal income styling blindly; it should feel more like intervention than ordinary gain.

**Rule:** never force one color to perform both category identity and consequence meaning when the interface needs to communicate both.

### 2.4 Surfaces

| Level | Name              | Value                    | Purpose                               |
| ----- | ----------------- | ------------------------ | ------------------------------------- |
| 0     | Page Ground       | `#f4eee6`                | Full-screen background                |
| 1     | Main Surface      | `#fcf8f2`                | Cards, drawers, sheets                |
| 2     | Secondary Surface | `#f8f1e7`                | Nested groups, tabs, quiet sections   |
| 3     | Offset Surface    | `#f0e6d8`                | Inputs, inactive pills, preview areas |
| 4     | Overlay           | `rgba(47, 42, 36, 0.42)` | Drawer and modal scrim                |

---

## 3. Elevation & Shadow

The system should feel layered like papers and trays on a desk, not like floating glass.

- **Shadow Ring**: subtle structural outline
- **Shadow Soft**: standard card elevation
- **Shadow Card**: stronger hero or nav elevation
- **Shadow Modal**: drawer/sheet elevation

```css
--shadow-ring: 0 0 0 1px rgba(47, 42, 36, 0.08);
--shadow-ring-brand: 0 0 0 1px rgba(155, 101, 75, 0.28);
--shadow-ring-danger: 0 0 0 1px rgba(184, 92, 63, 0.28);
--shadow-soft:
  rgba(60, 42, 20, 0.04) 0 10px 24px -14px, rgba(47, 42, 36, 0.06) 0 4px 10px -8px,
  rgba(47, 42, 36, 0.08) 0 0 0 1px;
--shadow-card:
  rgba(60, 42, 20, 0.08) 0 18px 38px -18px, rgba(47, 42, 36, 0.08) 0 8px 16px -10px,
  rgba(47, 42, 36, 0.08) 0 0 0 1px;
--shadow-modal:
  rgba(47, 42, 36, 0.14) 0 24px 56px -22px, rgba(47, 42, 36, 0.1) 0 12px 24px -14px,
  rgba(47, 42, 36, 0.08) 0 0 0 1px;
```

**Design rule:** prefer soft stacked elevation over hard drop shadows or cold glows.

---

## 4. Typography

### 4.1 Font Family

The reference sources use several brand fonts, but the actual Stashy sandbox keeps **Google Sans Flex** for implementation continuity, Arabic support, and product readability.

```css
font-family:
  "Google Sans Flex",
  system-ui,
  -apple-system,
  sans-serif;
```

### 4.2 Type Scale

Stashy keeps its mobile hierarchy because it is already correct for the product:

| Role                 | Size | Weight | Line Height | Letter Spacing | Usage                  |
| -------------------- | ---- | ------ | ----------- | -------------- | ---------------------- |
| **Hero Number**      | 56pt | 700    | 1.00        | -0.5pt         | Remaining Today        |
| **Hero Number (lg)** | 48pt | 700    | 1.00        | -0.5pt         | Large totals           |
| **Display**          | 32pt | 600    | 1.10        | -0.25pt        | Top-level section hero |
| **Title 1**          | 24pt | 600    | 1.20        | -0.15pt        | Screen titles          |
| **Title 2**          | 20pt | 600    | 1.25        | -0.10pt        | Section titles         |
| **Title 3**          | 17pt | 600    | 1.30        | 0              | Card subheadings       |
| **Body**             | 17pt | 400    | 1.50        | 0              | Main body copy         |
| **Callout**          | 16pt | 400    | 1.50        | 0              | Secondary copy         |
| **Subhead**          | 15pt | 500    | 1.40        | 0              | Emphasized UI text     |
| **Footnote**         | 13pt | 400    | 1.40        | 0.1pt          | Hints                  |
| **Caption 1**        | 12pt | 400    | 1.30        | 0.2pt          | Labels                 |
| **Caption 2**        | 11pt | 500    | 1.25        | 0.3pt          | Minimum UI text        |

### 4.3 Number Rules

- Use tabular figures on dynamic numbers
- Amount first, currency suffix second: `482 EGP`
- Negative or overspent values use danger
- Today’s Rate and Base Rate stay below hero scale
- Category badges and progress labels live in caption territory

### 4.4 RTL / Arabic Rules

These remain mandatory:

- Arabic body line-height: `1.70`
- Arabic label/caption line-height: `1.50`
- Arabic letter spacing: `0`
- Numeric values remain visually LTR in RTL context
- Use logical classes only
- Directional icons still require `rtl:rotate-180`
- Portaled shadcn content still requires explicit `dir`

---

## 5. Spacing System

This system stays mobile-safe. We do not import desktop density from references just because it looks tidy.

### 5.1 Base Unit

```css
--space-1: 4pt;
--space-2: 8pt;
--space-3: 12pt;
--space-4: 16pt;
--space-5: 20pt;
--space-6: 24pt;
--space-8: 32pt;
--space-10: 40pt;
--space-12: 48pt;
--space-16: 64pt;
```

### 5.2 Touch Target Rules

- Minimum interactive size: `48×48pt`
- Minimum spacing between targets: `8pt`
- Recommended CTA height: `52pt`
- Bottom nav items: `48pt` minimum
- Inputs: `52pt`
- List rows: `56pt` minimum

### 5.3 Screen Layout Tokens

```css
--screen-horizontal-margin: 16pt;
--card-padding: 16pt;
--card-gap: 12pt;
--section-gap: 24pt;
--list-item-padding-v: 14pt;
--list-item-padding-h: 16pt;
--bottom-nav-height: 49pt;
```

---

## 6. Border Radius

The system should feel softer than Cursor, tighter than the earlier fully-rounded Stashy look.

```css
--radius-xs: 6pt;
--radius-sm: 12pt;
--radius-md: 16pt;
--radius-lg: 20pt;
--radius-xl: 24pt;
--radius-full: 9999pt;
```

**Interpretation rule:** cards are softly rounded, interactive chips can be full-pill, but the app should never feel bubbly or toy-like.

---

## 7. Component Tokens

### 7.1 Primary Button

- Background: **Clay** `#9b654b`
- Text: **Cream** `#fcf8f2`
- Height: `52pt`
- Radius: `12pt`
- Padding: horizontal `16pt`
- Font: `17pt`, weight `600`
- Shadow: `--shadow-ring-brand`

### 7.2 Secondary Button

- Background: **Biscuit**
- Text: **Walnut**
- Border: `1px solid Clay Wash`
- Height: `52pt`
- Radius: `12pt`

### 7.3 Outline / Tertiary Button

- Background: transparent
- Text: **Clay**
- Border: `1px solid rgba(155, 101, 75, 0.25)`
- Height: `52pt`
- Radius: `12pt`

### 7.4 Cards

```css
Background:  --color-surface
Border:      1px solid --color-border
Radius:      20pt
Padding:     16pt
Shadow:      --shadow-card
```

### 7.5 Inputs

```css
Background:  --color-surface-offset
Border:      1px solid --color-border
Radius:      12pt
Height:      52pt
Padding:     0 16pt
Font:        Body (17pt, 400)
Placeholder: --color-text-tertiary
```

### 7.6 Transaction Type Semantics

| Meaning or type | Background | Text |
| --- | --- | --- |
| Variable identity | `#ece4d8` | `#7a7266` |
| Fixed identity | `#dde8e4` | `#5f7f78` |
| Major identity | `#f1e5c9` | `#9a7a33` |
| Income / received | `#dfead9` | `#5f8f59` |
| Budget injection | `#ecdee6` | `#8a657b` |
| Warning / review | `#f2e5c8` | `#b3883b` |
| Expense / overdue / emergency | `#f2ddd7` | `#b15d45` |
| Transfer / movement | `#e8e2f0` | `#7b6f96` |

### 7.7 Bottom Navigation

- Height: `49pt + safe-area bottom`
- Background: **Cream**
- Border-top: `1px solid --color-border-subtle`
- Active color: **Clay**
- Inactive color: **Fog**
- Shadow: `--shadow-card`

### 7.8 Bottom Sheets / Drawers

- Background: **Cream**
- Top radius: `24pt`
- Overlay: `rgba(47, 42, 36, 0.42)`
- Footer actions stay visible while the body scrolls

---

## 8. Motion Principles

- Micro transitions: `200–280ms`, ease-out
- Sheet presentation: `320ms`
- Progress fill: `400ms`
- Emergency feedback should appear decisively
- Reduced motion must always be respected

The system should feel composed and tactile, not playful.

---

## 9. Iconography

- Library remains **Hugeicons**
- Use rounded stroke icons
- Standard size: `24pt`
- Compact size: `20pt`
- Tab bar size: `28pt`
- Icons inherit surrounding semantic text color

---

## 10. Do's ✓

- Use **Oat** as the page background everywhere
- Keep **Clay** as the brand accent and single strongest action color
- Let cards feel clean and slightly lifted against the warmer page ground
- Use muted semantic colors, not bright dashboard colors
- Preserve touch safety and RTL correctness
- Favor soft business warmth over cold fintech sharpness

---

## 11. Don'ts ✗

- **Never** reintroduce parallel theme variants for this identity
- **Never** use pure white or cool gray as the default app background
- **Never** let accent colors become neon or dominant
- **Never** use physical directional classes
- **Never** use arbitrary hardcoded shadows when token shadows exist
- **Never** shrink the system below mobile touch-safe interaction sizes

---

## 12. Agent Prompt Guide

### Quick Color Reference

- Background: `Oat #f4eee6`
- Main surface: `Cream #fcf8f2`
- Offset surface: `Biscuit #f0e6d8`
- Border: `Clay Wash #e3d7c6`
- Primary text: `Walnut #2f2a24`
- Secondary text: `Mocha #686055`
- Tertiary text: `Fog #968c7d`
- Primary action: `Clay #9b654b`
- Variable identity: `Ledger Gray #7a7266`
- Fixed identity: `Teal Ledger #5f7f78`
- Major identity: `Ochre Ledger #9a7a33`
- Income / recovery: `Meadow #5f8f59`
- Injection / reserve: `Mulberry Reserve #8a657b`
- Warning / review: `Amber #b3883b`
- Expense / emergency: `Brick #b15d45`
- Transfer / movement: `Iris #7b6f96`

### Governance Reminder

- For semantic accents and state meaning, consult `spec/brand-color-audit.md`
- For token/governance rules and anti-drift constraints, consult `spec/controlled-design-system.md`

### Example Mobile Prompt

```text
Mobile portrait budgeting app with a warm ledger-desk identity. Background Oat (#f4eee6). Cards in Cream (#fcf8f2) with warm borders (#e3d7c6) and soft paper-stack shadows. Typography uses Google Sans Flex with a dominant 56pt hero number in Walnut (#2f2a24). Primary CTA uses Clay (#9b654b) with cream text. Variable identity uses Ledger Gray, fixed identity uses Teal Ledger, major identity uses Ochre Ledger, positive income uses Meadow, budget injection uses Mulberry Reserve, warning states use Amber, expense and emergency states use Brick, and transfer states use Iris. Category identity and live consequence should not be collapsed into one color when both matter. The page should feel calm, branded, and easy on the eyes, not bright white and not dark. Mobile spacing remains 16pt horizontal with strong touch targets and strict RTL-safe logical layout behavior.
```
