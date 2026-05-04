> **LLM Context & Usage Guide**
> **File Purpose:** The semantic color audit and accent philosophy for Stashy.
> **How to Use:** Read this before assigning any product accent color. It maps actions, states, risks, and financial meanings to consistent visual families so the interface feels human, readable, and branded.
> **Constraint Reminder:** This file is intentionally compact. Extend it by adding approved semantic roles and mappings instead of scattering new color choices across implementation files.

# Stashy Brand Color Audit

## 1. Color Philosophy

Stashy should feel like a **calm financial desk with human signals built in**. The base palette stays warm and quiet, while accents do the work of meaning:

- good outcomes should feel reassuring, not gamified
- risk should feel visible, not hostile
- intervention states should feel restorative, not generic
- structure states should distinguish category identity without pretending every category is an emotion

This is how Stashy stays colorful without becoming noisy.

## 2. Base Harmony Audit

| Layer | Role | Direction |
| --- | --- | --- |
| Page background | Long-session comfort | Warm, parchment-adjacent, never pure white |
| Cards and sheets | Main reading plane | Slightly lighter and cleaner than the page ground |
| Nested surfaces | Grouping and controls | Soft separation without gray SaaS coldness |
| Borders and dividers | Structure | Warm, visible, low-shout |
| Text tiers | Hierarchy | Strong walnut primary, softer brown-gray secondary, muted tertiary |
| Shadows and overlays | Depth | Paper-stack layering, not glass or neon |
| Charts and badges | Meaning | Must reuse semantic families from this audit |

## 3. Semantic Families

| Family | Meaning | Accent role | Typical use |
| --- | --- | --- | --- |
| Brand | Primary intentional action | Clay | Main CTA, active nav, strongest product-owned emphasis |
| Neutral | Operational/default | Biscuit and Mocha | Variable, unselected states, quiet chips, default rows |
| Stability | Reliable, paid, on-plan | Sage | Fixed budget structure, paid, healthy progress |
| Pressure | Large burden, caution, review | Amber | Major expenses, threshold warnings, pressure states |
| Critical | Loss, overdue, destructive, overspend | Burnt Clay | Expense danger, emergency mode, overdue, delete, sync failure |
| Recovery | Restorative positive inflow | Harbor | Income, received, budget injection, resolved/synced info |
| Muted info | Secondary system status | Fog-adjacent neutrals | Metadata, archived, inactive, draft, empty states |

## 4. Product Accent Matrix

| Product meaning | Semantic family | Notes |
| --- | --- | --- |
| Variable category | Neutral | Category identity only; direction still controls positive/negative meaning when needed |
| Fixed category | Stability | Structural identity; use Sage family for fixed context and paid/healthy progress |
| Major category | Pressure | Caution and budget burden, not automatic danger |
| Expense / outcome | Critical | Human expectation: money leaving should feel loss-aware |
| Received / income | Recovery | Human expectation: positive inflow should feel relieving and clear |
| Budget injection | Recovery | Distinct from normal income in copy, but same restorative family |
| Transfer | Mixed structural | Use structural styling with clear directional labels; do not color it as pure success or failure |
| Overspending today | Critical | Pair with explicit labels, not color alone |
| Emergency mode | Critical | Strongest non-destructive warning state in the product |
| Fixed paid | Stability | Reinforces reliability and completion |
| Pending | Muted info | Not success, not danger |
| Overdue | Critical | More severe than pending |
| Major warning >25% | Pressure | Threshold caution, still separate from emergency |
| Healthy pacing / recovered state | Stability or Recovery | Choose based on whether the state is structural stability or restored budget headroom |
| Sync in progress | Muted info or Recovery | Low-drama status until success/failure resolves |
| Sync success | Recovery | Small confirmation, not celebratory green |
| Sync failure | Critical | Must be visible because stale rate affects trust |
| Maintenance mode | Pressure or Critical | Use Pressure for planned maintenance, Critical if service is unavailable |
| Auth/session expired | Pressure | Needs user attention, but not a destructive action |
| Destructive actions | Critical | Delete, remove, irreversible confirmations |
| Archived / inactive / draft | Muted info | Quiet and intentionally low-emphasis |
| Plan upgrade required | Brand or Pressure | Prefer brand when upsell is product-led; Pressure only if it blocks a task and needs immediate attention |

## 5. Usage Rules By UI Pattern

| UI pattern | Allowed treatment |
| --- | --- |
| Text labels | Use the family's readable text color only when the label carries semantic meaning |
| Icons | May inherit semantic text color for status and transaction cues |
| Chips and badges | Preferred place for structural and transactional accent cues |
| Soft backgrounds | Use subtle family surfaces for cards, alerts, and grouped callouts |
| Borders | Use when a card needs semantic emphasis without full tinting |
| Strong backgrounds | Reserve for CTAs, critical pills, or high-signal confirmations |
| Charts | Reuse semantic families in a stable legend order; never invent separate chart-only meanings |

## 6. Misuse Constraints

- Do not use Recovery for generic “good looking” decoration.
- Do not use Critical for every negative number if the UI already communicates a structural category rather than risk.
- Do not use Pressure and Critical interchangeably.
- Do not color Variable as positive or negative by default; only the transaction direction should carry that meaning.
- Do not use bright fintech green or alarm red outside the approved muted families.
- Do not let chart palettes drift away from badge and alert semantics.

## 7. Implementation Rules For Follow-Up Cleanup

1. No hardcoded hex colors in feature components when a token exists.
2. Semantic roles must map through tokens, not inline business logic picking colors ad hoc.
3. Badges, charts, alerts, progress bars, and transaction rows must consume the same semantic families.
4. If a new product state appears, document it here before adding a new accent treatment.
