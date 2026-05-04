> **LLM Context & Usage Guide**
> **File Purpose:** The governance layer for how Stashy's visual system is allowed to evolve.
> **How to Use:** Read this before changing any design tokens, semantic colors, chart colors, badge colors, or shared UI primitives. This file defines the rules that prevent drift back into multiple visual identities or ad hoc local styling.
> **Constraint Reminder:** Stashy is a mobile-first budget product with a single curated identity. The system must stay warm, trustworthy, touch-safe, RTL-safe, and semantically consistent.

# Stashy Controlled Design System

## 1. Policy

Stashy uses **one controlled design identity** across the product. The system is not theme-driven and should not branch into alternate light, dark, or screen-specific personas unless a future design transition is explicitly approved.

The design system exists to do three jobs at once:

1. Keep the interface comfortable for long budgeting sessions.
2. Make financial meaning legible without loud, exhausting color.
3. Preserve one recognizable Stashy brand mood across every screen.

## 2. Sources of Truth

The visual system must be governed in this order:

1. `spec/DESIGN.md` for tokens, spacing, typography, component defaults, and base visual language.
2. `spec/brand-color-audit.md` for semantic accent meanings and approved usage families.
3. Shared UI primitives and tokenized styles in implementation.

If a component conflicts with these specs, the component is wrong, not the spec.

## 3. Core Governance Rules

| Rule | Meaning |
| --- | --- |
| Single identity | No runtime theme branching, no alternate palettes, no one-off visual moods |
| Token-first styling | Components consume named tokens and semantic roles, not raw literals |
| Semantic color discipline | Colors communicate product meaning before they communicate decoration |
| Warm neutrality | Backgrounds and structural surfaces stay soft, calm, and non-clinical |
| Mobile fidelity | Any visual update must preserve touch targets, spacing rhythm, hero hierarchy, and RTL safety |

## 4. Allowed Color Layers

Use color through these layers, in this order:

1. **Foundation tokens**: backgrounds, surfaces, borders, text, overlay, shadow, brand action.
2. **Semantic families**: success, warning, danger, recovery, info, structure, neutral, premium if needed later.
3. **Product mappings**: income, expense, injection, fixed, variable, major, overdue, pending, sync, destructive, archived, and similar states.
4. **Component usage**: cards, chips, charts, pills, banners, tabs, rows, icons, progress indicators.

Do not skip directly from product meaning to a raw color choice.

## 5. Allowed Overrides

Overrides are allowed only when one of the following is true:

| Allowed override | Requirement |
| --- | --- |
| New product state | Add it to `spec/brand-color-audit.md` first |
| New chart/data need | Reuse an approved semantic family or add a documented secondary data accent |
| Accessibility fix | Prefer adjusting token pairings inside the approved family, not inventing a new hue |
| Temporary migration patch | Mark it as temporary and remove it once the token path exists |

## 6. Forbidden Patterns

- Reintroducing Light/Dark/System user choices or design language.
- Hardcoded hex values in feature components when a token exists.
- Local status colors that contradict the semantic audit.
- Using the same accent family for opposing meanings in the same context.
- Treating chart colors as separate from the product semantic system.
- Letting copied reference aesthetics override Stashy's approved brand identity.

## 7. Implementation Expectations

- Shared primitives should expose the system, not fight it.
- Feature screens should inherit tokens and semantic roles instead of redefining them locally.
- Badges, alerts, charts, progress bars, and callouts must map through the same semantic families described in `spec/brand-color-audit.md`.
- If a new UI pattern needs color, document the meaning first, then implement the token usage.

## 8. Migration Note

Stashy previously experimented with multiple borrowed directions and temporary theme-era structures. Future cleanup should remove leftover references to:

- theme switching
- local visual review controls presented as product features
- dormant dark-mode assumptions
- feature-level hardcoded accents that bypass semantic tokens

Treat those leftovers as migration debt, not as acceptable precedent.
