> **LLM Context & Usage Guide**
> **File Purpose:** The semantic color audit and accent philosophy for Stashy.
> **How to Use:** Read this before assigning any product accent color. It defines how Stashy turns product meaning into human-readable color while staying inside one warm, controlled brand identity.
> **Constraint Reminder:** This file is part of an `audit -> create -> audit -> redo` system-building cycle. Do not treat the current UI as authority if it conflicts with this document.

# Stashy Brand Color Audit

## 1. Core Philosophy

Stashy should feel like a **warm money desk with readable consequences**.

The base UI stays quiet and comfortable. Accents do the work of meaning.

That meaning must follow human instinct:

- green reads as gain, relief, or healthy status
- red reads as loss, damage, overdue, or danger
- blue reads as intervention, trust, or system information
- yellow / ochre reads as caution, burden, or review
- teal reads as stability, structure, and reliability
- warm grey can represent variable day-to-day spending better than green when the category itself is not inherently positive

## 2. The Big Fix

The old mapping problem was simple:

- category colors were being asked to do emotional-state work
- emotional-state colors were being diluted by category styling

Stashy now uses a **two-axis semantic model**.

### Axis A — Structural Identity

This answers:

**What is this thing?**

- Variable
- Fixed
- Major
- Transfer

### Axis B — Consequence Meaning

This answers:

**What does this mean right now?**

- income / received
- expense / outcome
- injection / intervention
- warning / review
- emergency / destructive
- pending / inactive / archived

If both are present, consequence meaning wins for the high-signal element, while structural identity may still appear in a chip, border, icon well, or chart legend.

## 3. Brand Position

Stashy sits between:

- **Slite**: warm comfort and editorial calm
- **Cursor**: controlled product seriousness and precision
- **Convex**: strong state legibility and operational sharpness

But the destination is distinct:

**a warm, consequence-aware financial control surface**

## 4. Harmony Audit

| Layer | Role | Direction |
| --- | --- | --- |
| Page ground | Long-session comfort | Warm parchment, never white-white |
| Main card | Core reading plane | Cleaner and lighter than the page |
| Nested surface | Grouping and controls | Slightly darker or denser than main card, still warm |
| Borders | Structure | Warm visible separators, never cold gray |
| Text tiers | Hierarchy | Dark walnut primary, softer brown-gray secondary, dusty tertiary |
| Shadows | Depth | Paper-stack softness, not glass or neon |
| Charts | Interpretation | Quiet by default, semantic when meaning matters |

## 5. Accent Families

| Family | Role | Direction |
| --- | --- | --- |
| Brand | Primary product-owned emphasis | Clay / terracotta warmth |
| Variable structure | Day-to-day living bucket | Ledger Gray / warm mineral grey |
| Fixed structure | Stability and recurring order | Teal |
| Major structure | Heavy burden category | Deep Ochre |
| Income / recovery | Positive inflow and relief | Meadow green |
| Injection / intervention | Rescue, reserve support, budget rescue | Mulberry reserve |
| Expense / critical | Money leaving, overdue, destructive, emergency | Brick red |
| Warning / review | Attention, pressure, due-soon, deliberation | Amber / ochre |
| Transfer / movement | Reallocation, movement, non-win/non-loss | Iris / muted violet-slate |
| Quiet status | Inactive, archived, draft, historical, disabled | Fog neutrals |

## 6. Working Color Vocabulary

These names are design-facing semantic anchors. Final implementation tokens can map to them later.

| Name | Suggested character | Typical job |
| --- | --- | --- |
| Clay | Warm terracotta-brown | Brand CTA, active navigation, strongest owned emphasis |
| Ledger Gray | Warm mineral grey | Variable category identity |
| Teal Ledger | Soft blue-green | Fixed category identity, reliability |
| Ochre Ledger | Earthy dark yellow | Major category identity, burden |
| Meadow | Muted green | Income, received, healthy recovery |
| Mulberry Reserve | Muted plum-brown | Budget injection, reserve support, deliberate rescue |
| Brick | Warm red clay | Expense, overdue, destructive, emergency |
| Amber | Dusty amber | Warning, caution, preview, due-soon |
| Iris | Muted violet-slate | Transfer, movement, pair relationships |
| Fog | Warm dusty neutral | Draft, inactive, archived, secondary system states |

## 7. App-Wide Coverage Map

| Subsystem | Needs semantic coverage for |
| --- | --- |
| Auth and onboarding | verification, conflict, blocked entry, expired session, setup required |
| Dashboard | rate health, remaining today, overspend, emergency, tomorrow impact, major burden |
| Add transaction | type selection, direction, major preview, budget injection, transfer creation |
| Fixed expenses | manual vs recurring vs installment, pending, paid, overdue, low remaining, completed |
| Transactions / history | spent, all, variable, fixed, major, transfer, received, merged rows |
| Analytics | pacing, projections, deltas, comparison, gated insights |
| Payment methods | active, default, deleted, soft-deleted historical presence |
| Offline sync | queued, syncing, synced, duplicate, stale, failed, retry |
| System state | maintenance, forced update, version block, service unavailability |
| Plan state | free limit, Pro-required, upgrade path |
| Destructive flows | delete, cascade decision, hard delete confirmation |

## 8. Structural Identity Map

These colors identify category or object type. They should not automatically imply “good” or “bad.”

| Structural thing | Family | Why |
| --- | --- | --- |
| Variable category | Variable structure / Ledger Gray | Day-to-day living money; vague, flexible, and ongoing without implying success |
| Fixed category | Fixed structure / Teal Ledger | Stable, bounded, recurring, trustworthy |
| Major category | Major structure / Ochre Ledger | Significant burden, deliberate, weighty |
| Transfer | Transfer / Iris | Movement between buckets, neither gain nor loss |
| Payment method grouping | Brand or quiet neutral | Product-owned organization, not semantic emotion |

## 9. Consequence Meaning Map

These colors communicate what is happening, not what category the record belongs to.

| Meaning | Family | Why |
| --- | --- | --- |
| Income / received | Income / recovery / Meadow | Human expectation: gain, relief, added headroom |
| Expense / outcome | Expense / critical / Brick | Human expectation: money leaving, loss, cost |
| Budget injection | Injection / intervention / Mulberry Reserve | Rescue and support, distinct from normal income and distinct from transfer movement |
| Warning / review | Warning / Amber | Needs attention without reading as failure |
| Emergency mode | Expense / critical / Brick | Highest-stress budget state |
| Destructive action | Expense / critical / Brick | Irreversible or lossful action |
| Healthy / paid / completed | Income / recovery or Fixed structure | Choose by meaning: recovery for gain, teal for reliable completion |
| Pending / inactive / archived / draft | Quiet status / Fog | Low emotional temperature, still legible |

## 10. Literal Product Mapping

| Action or state | Primary family | Secondary family | Notes |
| --- | --- | --- | --- |
| Variable expense | Expense / Brick | Variable / Ledger Gray | Red amount or alert, warm-grey chip if category identity is needed |
| Variable received | Income / Meadow | Variable / Ledger Gray | Green value with variable identity support |
| Fixed expense | Expense / Brick | Fixed / Teal Ledger | Teal category, red consequence |
| Fixed received / refund | Income / Meadow | Fixed / Teal Ledger | Recovery inside a fixed bucket |
| Major expense | Warning / Amber | Major / Ochre Ledger | Deliberate and heavy before it becomes a crisis |
| Major overuse warning (>25%) | Warning / Amber | Major / Ochre Ledger | Consequence warning, not generic yellow decoration |
| Budget injection | Injection / Mulberry Reserve | none | Must feel distinct from ordinary income and from transfer |
| Transfer out/in pair | Transfer / Iris | Source/target labels | Movement, not win/loss |
| Paid fixed item | Fixed / Teal Ledger | Income / Meadow optional | Teal first, green only if explicitly emphasizing success |
| Pending fixed item | Warning / Amber or Fog | Fixed / Teal Ledger | Use amber if action is due soon, fog if merely waiting |
| Overdue fixed item | Expense / Brick | Fixed / Teal Ledger | Risk state overrides category calm |
| Low remaining fixed bucket | Warning / Amber | Fixed / Teal Ledger | Near limit, not yet failure |
| Over budget fixed bucket | Expense / Brick | Fixed / Teal Ledger | True overrun |
| Dashboard on track | Fixed / Teal Ledger or Meadow | none | Calm health, avoid confetti-green tone |
| Dashboard low remaining | Warning / Amber | none | Early caution |
| Overspent today | Expense / Brick | none | Immediate consequence |
| Emergency mode | Expense / Brick | Injection / Mulberry Reserve CTA | Crisis state plus clear intervention path |
| Tomorrow's rate impact | Warning / Amber | Expense / Brick if severe | Consequence preview |
| Sync in progress | Fog or Brand | none | Trust activity, not success yet |
| Sync success | Meadow or Brand | none | Trust restored, keep it restrained |
| Sync stale / failed | Expense / Brick | Warning / Amber optional | Trust problem; must be visible |
| Email verification required | Warning / Amber | none | Needs action, not danger |
| Session expired | Warning / Amber | none | Attention needed, not punitive |
| Maintenance planned | Warning / Amber | none | Controlled service interruption |
| Service unavailable | Expense / Brick | none | Hard availability problem |
| Plan upgrade required | Brand / Clay | Warning / Amber if blocking | Upsell should stay branded unless it interrupts a flow |
| Draft / archived / inactive | Fog | none | Quiet informational state |
| Delete transaction | Expense / Brick | none | Destructive |
| Fixed delete cascade review | Warning / Amber | Fixed / Teal Ledger | Review before irreversible choice |
| Hard delete in cascade | Expense / Brick | none | True destructive end state |

## 11. Layout And Component Rules

### 11.1 Rows

- Category chip can show structural identity.
- Amount should show consequence meaning.
- If both exist, do not force one color to carry both jobs.

### 11.2 Cards

- Most cards stay warm-neutral.
- Semantic tinting should appear only when the whole card is about a state, warning, or result.

### 11.3 Charts

- Structural comparisons may use Ledger Gray, Teal Ledger, Ochre Ledger, and Iris.
- Outcome overlays should use Meadow, Brick, Mulberry Reserve, and Amber only where interpretation depends on them.
- Charts must not invent a separate rainbow system.

### 11.4 Badges And Chips

- Structural chips identify type.
- Consequence chips identify status.
- Avoid mixing both into one ambiguous pill if the distinction matters.

### 11.5 Primary Actions

- Product-owned primary CTA stays in Brand / Clay.
- Injection-related CTA may use Mulberry Reserve if the action is specifically restorative.
- Destructive CTAs stay Brick.

## 12. Misuse Constraints

- Do not color fixed as green by default; teal is the better signal for stability.
- Do not color variable with green or orange by default if the app wants users to read it as a flexible spending structure rather than a positive state.
- Do not use the same green for normal income and emergency injection.
- Do not use red for every negative number if the UI is only identifying a category, not a consequence.
- Do not let transfer inherit success or danger colors unless a specific leg is being emphasized.
- Do not let charts become more colorful than the product logic deserves.
- Do not rely on color alone; pair status with labels, icons, wording, or placement.

## 13. Implementation Rules

1. No hardcoded hex values in feature components when a governed token exists.
2. Map structural identity and consequence meaning through separate helpers when both are needed.
3. Use one semantic system for badges, alerts, charts, rows, cards, and progress components.
4. Add new product states to this file before inventing a new accent treatment in code.
5. Audit “first read meaning” after implementation: can a user skim and understand the screen in seconds?
