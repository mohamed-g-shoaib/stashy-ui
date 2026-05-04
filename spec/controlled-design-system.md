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

## 2. Working Mode

This system is being shaped through an active product-design cycle:

`audit -> create -> audit what was created -> redo`

That means the specs are not just for reviewing the current UI. They are also for building the intended Stashy identity, checking the outcome against product logic, then refining it until the result feels both branded and system-true.

When changing the design system:

1. Audit the current state against product logic and the governed identity.
2. Create or revise tokens, semantics, and component usage deliberately.
3. Audit the created result against real Stashy behavior, not only aesthetic preference.
4. Redo weak areas until the product meaning, comfort, and visual coherence align.

## 3. Sources of Truth

The visual system must be governed in this order:

1. `spec/DESIGN.md` for tokens, spacing, typography, component defaults, and base visual language.
2. `spec/brand-color-audit.md` for semantic accent meanings and approved usage families.
3. Shared UI primitives and tokenized styles in implementation.

If a component conflicts with these specs, the component is wrong, not the spec.

## 4. Reference Influence Policy

Stashy may borrow pressure, warmth, or discipline from external references, but it must not become a clone of them.

| Reference | What Stashy may borrow | What Stashy must not copy |
| --- | --- | --- |
| Slite | Warm parchment comfort, editorial calm, soft surfaces | Desktop editorial looseness or SaaS marketing layout assumptions |
| Cursor | Precise product seriousness, compact control discipline, trust-building restraint | Cold technical severity or code-editor mood as the product identity |
| Convex | Product confidence, operational sharpness, meaningful state color intent | Dark workbench atmosphere, sharp tool-like harshness, or code-palette literalism |

The rule is simple: **borrow principles, not costumes**.

## 5. Core Governance Rules

| Rule | Meaning |
| --- | --- |
| Single identity | No runtime theme branching, no alternate palettes, no one-off visual moods |
| Token-first styling | Components consume named tokens and semantic roles, not raw literals |
| Semantic color discipline | Colors communicate product meaning before they communicate decoration |
| Warm neutrality | Backgrounds and structural surfaces stay soft, calm, and non-clinical |
| Mobile fidelity | Any visual update must preserve touch targets, spacing rhythm, hero hierarchy, and RTL safety |

## 6. Allowed Color Layers

Use color through these layers, in this order:

1. **Foundation tokens**: backgrounds, surfaces, borders, text, overlay, shadow, brand action.
2. **Semantic families**: success, warning, danger, recovery, info, structure, neutral, premium if needed later.
3. **Product mappings**: income, expense, injection, fixed, variable, major, overdue, pending, sync, destructive, archived, and similar states.
4. **Component usage**: cards, chips, charts, pills, banners, tabs, rows, icons, progress indicators.

Do not skip directly from product meaning to a raw color choice.

## 7. Design-System Coverage Rule

The design system must cover the full Stashy product, not just its visible dashboard cards.

Coverage must include:

- core budgeting states
- transaction direction and category logic
- fixed-expense lifecycle states
- history filtering and transfer behaviors
- onboarding, auth, and blocked-entry states
- sync and stale-data trust states
- plan gating and upgrade blocks
- maintenance, forced update, and system availability states
- analysis, snapshots, and historical context states

If a subsystem has meaningful product status, that subsystem needs an intentional semantic treatment.

## 8. Allowed Overrides

Overrides are allowed only when one of the following is true:

| Allowed override | Requirement |
| --- | --- |
| New product state | Add it to `spec/brand-color-audit.md` first |
| New chart/data need | Reuse an approved semantic family or add a documented secondary data accent |
| Accessibility fix | Prefer adjusting token pairings inside the approved family, not inventing a new hue |
| Temporary migration patch | Mark it as temporary and remove it once the token path exists |

## 9. Forbidden Patterns

- Reintroducing Light/Dark/System user choices or design language.
- Hardcoded hex values in feature components when a token exists.
- Local status colors that contradict the semantic audit.
- Using the same accent family for opposing meanings in the same context.
- Treating chart colors as separate from the product semantic system.
- Letting copied reference aesthetics override Stashy's approved brand identity.

## 10. Implementation Expectations

- Shared primitives should expose the system, not fight it.
- Feature screens should inherit tokens and semantic roles instead of redefining them locally.
- Badges, alerts, charts, progress bars, and callouts must map through the same semantic families described in `spec/brand-color-audit.md`.
- If a new UI pattern needs color, document the meaning first, then implement the token usage.

## 11. Execution Order For Implementation

When the team moves from spec into code, prefer this order:

1. foundation tokens in `globals.css` / theme layer
2. shared primitives: button, card, badge, tabs, inputs, chart, nav
3. semantic components: alerts, status chips, progress, transaction rows
4. feature screens: dashboard, tracker, history, settings, analytics
5. audit pass against product logic
6. redo pass for any mismatched or weak semantics

## 12. Migration Note

Stashy previously experimented with multiple borrowed directions and temporary theme-era structures. Future cleanup should remove leftover references to:

- theme switching
- local visual review controls presented as product features
- dormant dark-mode assumptions
- feature-level hardcoded accents that bypass semantic tokens

Treat those leftovers as migration debt, not as acceptable precedent.
