# Stashy Product UX Audit

**Date:** 2026-04-25  
**Purpose:** Evaluate Stashy across product truth, intended UX, and current sandbox reality without inventing unsupported behavior.  
**Primary artifact type:** Comparison audit + implementation-ready redesign backlog.

## Source Of Truth

### Source hierarchy

1. `docs/stashy-logics/*` overrides any invented UX or unsupported interaction.
2. `spec/wireframe/*` defines intended screen behavior and presentation goals.
3. Repo code defines the current implemented sandbox behavior.
4. Web research informs best-practice critique and prioritization, not product logic.

### Core repo sources used

- `docs/stashy-logics/Stashy_Documentation.md`
- `docs/stashy-logics/Stashy_Flows.md`
- `docs/stashy-logics/Stashy_Mobile_System_Flow.md`
- `spec/DESIGN.md`
- `spec/wireframe/home-screen.md`
- `spec/wireframe/tracker-screen.md`
- `spec/wireframe/analytics-screen.md`
- `spec/wireframe/settings-screen.md`
- `components/home-screen.tsx`
- `components/tracker-screen.tsx`
- `app/(app)/analytics.tsx`
- `app/(app)/settings.tsx`

## Original Request Summary

Run a large UX audit that treats Stashy as both a real product and a design system exercise:

- Evaluate the design itself, the intent behind the design, and how clearly that intent converts into user understanding.
- Simulate user journeys through the app and judge how easy it is to know where to go and how to complete actions.
- Critique the UI and UX as a designer, including hierarchy, information density, chart fitness, page organization, separation of concerns, and the balance between visuals and text.
- Respect `docs/stashy-logics` as the non-negotiable product and backend truth.
- Anchor recommendations to current mobile finance app patterns and platform guidance.

## Goals And Non-Goals

### Goals

- Determine whether Stashy’s sandbox communicates the real product model accurately.
- Judge whether first-time users can understand the app’s promise and core actions quickly.
- Identify logic/UI mismatches, navigation friction, and unnecessary cognitive load.
- Produce a decision-ready redesign backlog grouped by urgency.

### Non-goals

- Rewriting backend product rules.
- Inventing new transactions, states, or analytics behaviors not supported by `docs/stashy-logics`.
- Treating mock-only sandbox gaps as production bugs when they are clearly unimplemented placeholders.
- Producing code changes in this document.

## Benchmark Sources

### External references

- Apple HIG, Charts: https://developer.apple.com/design/human-interface-guidelines/charts
- Apple Developer, Copilot Money article: https://developer.apple.com/articles/copilot-money/
- YNAB App Store page: https://apps.apple.com/us/app/ynab/id1010865877
- Monarch App Store page: https://apps.apple.com/us/app/monarch-budget-track-money/id1459319842
- Rocket Money App Store page: https://apps.apple.com/us/app/rocket-money-bills-budgets/id1130616675
- Google Play budgeting editorial: https://play.google.com/store/apps/editorial?hl=en_US&id=mc_apps_top_k_microgenre_money_personal_budgeting_fcp
- Material bottom navigation: https://m1.material.io/components/bottom-navigation.html
- Material navigation guidance: https://m1.material.io/patterns/navigation.html

### Benchmark conclusions used in this audit

- Charts should summarize a point quickly, not force users to decode the product’s meaning.
- Critical information should be visible without extra taps or chart interaction.
- Top-level navigation must remain obvious, predictable, and stable.
- Strong finance apps reduce user work by exposing next actions clearly.
- Accessibility expectations are product-level requirements, not optional polish.
- Personal finance apps benefit from explicit progress, upcoming obligations, and readable summaries over raw data dumps.

## Audit Methodology

This audit uses one pass across four lenses:

### 1. User lens

- Simulate first-time and returning-user journeys step by step.
- Record confusion, hidden actions, weak affordances, unclear labels, and extra effort.

### 2. Product logic lens

- Verify UI behavior against documented rules for daily rate, fixed tracking, major expenses, received income, budget injection, plan gating, and monthly comparison.

### 3. Design/UX lens

- Judge hierarchy, clarity, content density, chart choice, visual storytelling, progressive disclosure, and separation of concerns.

### 4. Accessibility/RTL lens

- Check whether meaning depends on color alone.
- Check whether Arabic/RTL support is evident and credible in structure, copy, and interaction.
- Check whether interactions remain understandable without prior product knowledge.

## Severity Rubric

- `Critical`: Misrepresents product logic or blocks core understanding/action.
- `High`: User can continue, but is likely to choose the wrong path, miss a critical action, or misunderstand the product.
- `Medium`: User can recover, but effort, ambiguity, or density is too high.
- `Low`: Polish, consistency, or delight issue that weakens trust without breaking understanding.

## Journey Matrix

| Journey | Intended backend-supported flow | Current sandbox path | Current read |
| --- | --- | --- | --- |
| Understand the app’s promise from Home in under 10 seconds | Home should explain the dynamic daily-rate model and spending consequence loop | Open `/[locale]` | Weak |
| Understand `Daily Rate`, `Remaining Today`, and `Tomorrow’s Rate Impact` | Daily rate is the core product mechanic; tomorrow impact appears only in overspend and not in emergency mode | Home daily-rate card | Weak / logic mismatch |
| Find how to add a variable expense | Add transaction flow should make expense recording obvious | Home FAB drawer preview | Missing |
| Find how to add received income or budget injection | Separate supported transaction types with distinct budget effects | No direct sandbox path | Missing |
| Understand the difference between Variable, Fixed, and Major | Product logic depends on these distinctions | Home + Tracker tabs + labels | Partial |
| Review upcoming fixed payments and fixed tracker progress | Use dashboard preview and fixed tracker sections | Home fixed payments + Tracker fixed tab | Mostly clear |
| Record or inspect a major expense and understand its consequence | Major expense lowers effective variable budget and should explain rate impact | Tracker major tab + add drawer preview | Partial |
| Use history filters to answer a real question | History filters should help isolate type, direction, method, and date range | Tracker history pills + split drawers | Partial |
| Understand what Analytics is for and whether its numbers are actionable | Read-only monthly health report with meaningful comparisons | Analytics screen | Mixed |
| Use Settings to change language/theme and manage payment methods | Manage appearance and defaults clearly | Settings screen | Mostly clear, but not truly bilingual |

## Findings Template

- `ID`
- `Area`
- `Layer affected`
- `Severity`
- `What the user sees`
- `Why it hurts comprehension/conversion`
- `What system truth says`
- `Recommended fix`
- `Benchmark rationale`

## Recommendation Template

- `Priority`
- `Target screen or flow`
- `Problem being solved`
- `Supported system behavior`
- `Proposed UX change`
- `Why this is safer than alternatives`
- `Dependencies`

## Observed Strengths

- The bottom navigation matches the expected four-destination mobile structure and keeps top-level areas stable.
- Tracker’s split into `Fixed`, `Major`, and `History` is directionally correct and maps well to the documented product model.
- Analytics avoids gratuitous charts and mostly favors short summaries, which is appropriate for small screens.
- Settings uses bottom sheets and grouped cards, which keeps the management surface coherent inside one mobile screen.

## Immediate UX Risks

### F-001

- `ID`: F-001
- `Area`: Home / product promise
- `Layer affected`: Intended UX + current sandbox
- `Severity`: Critical
- `What the user sees`: Home leads with budget overview, then shows daily-rate information as just one card among several cards.
- `Why it hurts comprehension/conversion`: Stashy’s differentiator is not “budget overview”; it is “how much can I spend today, and what happens tomorrow if I don’t.” A first-time user can miss the core model before they understand why the app exists.
- `What system truth says`: `spec/index.md` and `spec/DESIGN.md` both treat the daily-rate mechanic and hero number as the core product output.
- `Recommended fix`: Rebuild Home so the hero number and its consequence model dominate the first viewport. Budget overview, major expenses, and history should become secondary support modules below that hero.
- `Benchmark rationale`: Apple’s chart guidance emphasizes quick summaries; Monarch and Rocket Money both foreground the most decision-relevant state before deeper detail.

### F-002

- `ID`: F-002
- `Area`: Home / daily-rate logic
- `Layer affected`: Current sandbox
- `Severity`: Critical
- `What the user sees`: The “Your Rate Tomorrow” line is always rendered in `components/home/daily-rate-card.tsx`, including the on-track state.
- `Why it hurts comprehension/conversion`: It teaches the wrong mental model. Users may infer tomorrow’s rate is always a primary surface instead of a consequence state tied to overspending.
- `What system truth says`: `docs/stashy-logics/Stashy_Documentation.md` says tomorrow’s rate impact should appear when the user overspends today and is not in emergency mode.
- `Recommended fix`: Show tomorrow-impact content only in overspend states, and replace the on-track footer with a calmer supportive message or no footer at all.
- `Benchmark rationale`: Critical insight should appear when relevant; hidden state logic should not be flattened into always-visible generic copy.

### F-003

- `ID`: F-003
- `Area`: Core transaction entry
- `Layer affected`: Current sandbox
- `Severity`: High
- `What the user sees`: The main FAB opens a preview drawer, but does not expose a concrete, understandable path to add variable expense, received income, or budget injection.
- `Why it hurts comprehension/conversion`: Users can identify that the app tracks money, but they cannot confidently answer “How do I log the thing I just did?” This blocks the highest-frequency action in the product.
- `What system truth says`: The docs support multiple transaction types with materially different consequences: variable expense, variable received, fixed, transfer, budget injection, and major.
- `Recommended fix`: Replace preview-only FAB behavior with a clear transaction-entry chooser organized by outcome, not internal jargon: spend, receive money, fixed payment, transfer, major purchase, budget injection.
- `Benchmark rationale`: Rocket Money and other finance apps win by reducing task effort and making top actions obvious in a few taps.

### F-004

- `ID`: F-004
- `Area`: Core terminology
- `Layer affected`: Current sandbox
- `Severity`: High
- `What the user sees`: The app uses terms like `Daily Rate`, `Variable`, `Fixed`, and `Major`, but the current UI rarely explains them in plain language where they first appear.
- `Why it hurts comprehension/conversion`: These terms are product-specific. Without onboarding or inline explanation, users must infer the model from scattered numbers and labels.
- `What system truth says`: The docs define strong distinctions between variable expenses, fixed budgets, and major purchases, and those distinctions change calculations.
- `Recommended fix`: Add one-line helper copy the first time a concept appears, and make the “How to Use Stashy” guidance reachable from Home rather than buried in Settings.
- `Benchmark rationale`: Leading finance apps translate internal categories into user-facing explanations early, especially when the budgeting model is novel.

### F-005

- `ID`: F-005
- `Area`: Major expense consequence
- `Layer affected`: Current sandbox
- `Severity`: High
- `What the user sees`: Tracker’s major tab lists major purchases, but does not connect those purchases back to lowered daily rate or effective variable budget.
- `Why it hurts comprehension/conversion`: Users can see that major items exist, but not why the category matters or how it changes the month. The screen behaves like a ledger instead of a consequence view.
- `What system truth says`: Major expenses immediately reduce effective variable budget and lower daily rate for remaining days; current-month entry should show a rate-impact confirmation.
- `Recommended fix`: Add a concise consequence summary at the top of the major tab and ensure future add flows preview the daily-rate impact before confirmation.
- `Benchmark rationale`: Charts and summaries should illuminate the decision, not leave users to do cross-screen inference.

### F-006

- `ID`: F-006
- `Area`: Bilingual credibility
- `Layer affected`: Current sandbox
- `Severity`: High
- `What the user sees`: Analytics and Settings are largely hardcoded in English inside screen files, even though the shell is locale-aware and the product is explicitly bilingual.
- `Why it hurts comprehension/conversion`: This weakens trust in RTL readiness and makes the bilingual product claim feel incomplete. It also makes future Arabic UX review unreliable.
- `What system truth says`: `AGENTS.md`, `spec/index.md`, and `spec/DESIGN.md` all treat English/Arabic and logical-direction support as core architectural requirements.
- `Recommended fix`: Move all remaining user-facing strings for Analytics and Settings into locale messages, then perform a dedicated RTL comprehension review after translation.
- `Benchmark rationale`: Navigation and product comprehension must work for both new and returning users; locale-aware structure without locale-aware copy is incomplete.

### F-007

- `ID`: F-007
- `Area`: Analytics actionability
- `Layer affected`: Current sandbox
- `Severity`: Medium
- `What the user sees`: Analytics explains pacing, projection, and month-over-month changes, but offers limited next-step guidance and no visible path to the `Close Month` behavior outside the empty comparison state.
- `Why it hurts comprehension/conversion`: Users can read the numbers but may not know what to do next. The report feels observational instead of behavior-shaping.
- `What system truth says`: Analysis and monthly snapshots are distinct backend concepts, and comparison depends on snapshot availability.
- `Recommended fix`: Add one explicit “what to do now” line per major section and connect the month-close concept more clearly to the comparison card.
- `Benchmark rationale`: Apple’s chart guidance stresses summarizing the key message; finance analytics should make insight actionable, not merely informative.

### F-008

- `ID`: F-008
- `Area`: History filtering
- `Layer affected`: Intended UX + current sandbox
- `Severity`: Medium
- `What the user sees`: The History tab uses two separate pills and two drawers for details and date, instead of one integrated filter control.
- `Why it hurts comprehension/conversion`: The split model increases decision overhead and weakens the sense that the user is refining one query.
- `What system truth says`: The intended tracker wireframe calls for one filter entry point with type, direction, payment method, and date range in one bottom sheet.
- `Recommended fix`: Merge the current split filters into a single “Filter” surface with one active-count badge and one mental model.
- `Benchmark rationale`: Navigation should be intuitive and predictable; users should not have to guess which filter bucket contains their intended action.

## Structural Redesign Opportunities

### R-001 Home should become a teaching surface

- Move Daily Rate to the first and visually dominant position.
- Pair the hero number with a one-line interpretation, not just raw values.
- Treat budget overview, fixed payments, and history as supporting modules.
- Promote a direct “log spending” path from the first viewport.

### R-002 Use progressive disclosure more aggressively

- Keep first views focused on summary and consequence.
- Move secondary explanation, transaction previews, and optional detail behind drawers or “view more” affordances.
- Avoid requiring the user to cross-reference multiple cards to understand one concept.

### R-003 Separate “state” from “action”

- State screens: Home and Analytics should explain where the month stands.
- Action screens: add flows, transfers, budget injection, and payment management should be framed as quick decisions.
- Tracker should sit between them: operational review plus entry points into corrective action.

### R-004 Make visuals earn their place

- Keep the analytics stack mostly chart-light unless a chart clearly beats summary text.
- Use progress bars, budget pressure indicators, and consequence deltas when they accelerate understanding.
- Avoid decorative charts that do not change the user’s next decision.

### R-005 Surface the guide earlier

- “How to Use Stashy” belongs near first-use education, not deep in Settings.
- The home header help action is a better place for daily-rate explanation, category definitions, and major-expense logic.

## Competitive Product Guidance

- **YNAB pattern**: product confidence comes from explicit accessibility support and clear mental models, not just category labels.
- **Monarch pattern**: users benefit from seeing dashboard state, upcoming expenses, and budget progress together, but with customization and hierarchy.
- **Rocket Money pattern**: high-frequency tasks are framed as obvious job-to-be-done actions, not hidden behind exploratory UI.
- **Copilot pattern**: charts can be rich, but only when the surrounding interface remains crystal clear and responsive.
- **Platform pattern**: bottom navigation should stay stable and top-level, while screen-local controls should not compete with it or blur hierarchy.

## Prioritized Backlog

### P0 — Logic and clarity fixes

- Make Daily Rate the first and dominant Home module.
- Stop rendering tomorrow-rate impact in non-overspend states.
- Expose a real transaction chooser for variable expense, received income, budget injection, and major expense.
- Localize remaining hardcoded Analytics and Settings copy.
- Add plain-language explanation for Variable, Fixed, Major, and Daily Rate near first exposure.

### P1 — IA and workflow redesign

- Redesign Home around “current allowance + next action + consequence.”
- Merge History filters into one coherent bottom sheet.
- Add major-expense consequence summaries to Tracker.
- Move first-use guidance from Settings into Home/help entry points.

### P2 — Visual and interaction polish

- Reduce cross-card mental stitching by adding clearer section summaries.
- Strengthen visual distinction between informational cards and actionable controls.
- Revisit where status is conveyed too heavily by color and add text/icon redundancy where needed.
- Tighten Arabic/RTL validation for Analytics and Settings after localization.

### P3 — Benchmark-inspired enhancements

- Add actionable recommendations to Analytics rather than summary-only reporting.
- Explore richer but still compact finance visuals only where they shorten comprehension time.
- Consider dashboard customization only after the core mental model is already easy to grasp.

## Acceptance Criteria For This Audit

- Every critique is traceable to docs, wireframes, repo code, or an external benchmark source.
- No recommendation invents unsupported backend behavior.
- Every top-level screen has at least one journey evaluation.
- Major number-heavy sections are judged for necessity, readability, and chart fitness.
- The audit distinguishes clearly between unimplemented sandbox behavior and poor existing UX.
- RTL and bilingual implications are included where they affect comprehension.
- The backlog is prioritized and implementation-ready.

