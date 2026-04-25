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
- Treat interactivity as part of the design scope, not a separate implementation afterthought.
- Treat interaction design as real product design: sheets, drawers, cards, tabs, and settings controls must show how the user acts, not only how the app explains itself.
- Guidance is not enough on its own. Where the product supports an action, the sandbox should also show the action structure itself: fields, toggles, choices, confirmation pattern, and immediate system response.
- Question whether introductory education should stay permanently visible or act as newcomer-only guidance that can be dismissed and recovered later.
- Keep dismissable preview surfaces re-toggleable from sandbox settings so design review can compare newcomer, returning-user, on-track, overspent, major-active, and major-inactive states intentionally.
- Respect `docs/stashy-logics` as the non-negotiable product and backend truth.
- Anchor recommendations to current mobile finance app patterns and platform guidance.

## Goals And Non-Goals

### Goals

- Determine whether Stashy’s sandbox communicates the real product model accurately.
- Judge whether first-time users can understand the app’s promise and core actions quickly.
- Identify logic/UI mismatches, navigation friction, and unnecessary cognitive load.
- Produce a decision-ready redesign backlog grouped by urgency.
- Ensure every major supported action is represented not only by explanatory copy, but by an interaction model the team can evaluate.
- Ensure dismissable and stateful UI remains previewable through explicit on/off controls when needed for design review.

### Non-goals

- Rewriting backend product rules.
- Inventing new transactions, states, or analytics behaviors not supported by `docs/stashy-logics`.
- Treating mock-only sandbox gaps as production bugs when they are clearly unimplemented placeholders.
- Accepting guidance-only placeholders as “good enough” when the product truth already implies a user action flow.

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
- Judge the look of the product itself, not only its task flow: visual hierarchy, typography, spacing rhythm, card composition, color usage, information grouping, atmosphere, and whether the app feels intentional rather than merely functional.

### 4. Accessibility/RTL lens

- Check whether meaning depends on color alone.
- Check whether Arabic/RTL support is evident and credible in structure, copy, and interaction.
- Check whether interactions remain understandable without prior product knowledge.

## Interaction Design Requirement

This spec now treats interaction design as a first-class deliverable, not optional garnish around static surfaces.

This is a global rule for the entire Stashy sandbox:

- It applies to every page.
- It applies to every major block within those pages.
- It applies to all previous redesign assessments and all future missions.
- It is not limited to Home, Tracker, add sheets, or any one surface.

### Required standard for interactive surfaces

If a screen section implies that the user can do something, the sandbox should aim to show all of the following:

- The trigger: how the user starts the action.
- The input structure: what fields, toggles, selectors, or grouped choices appear.
- The classification logic: how the user distinguishes between similar actions such as spending, received income, injection, fixed, and major.
- The consequence preview: what the user is told will change before confirming, when product logic supports that preview.
- The resulting product state: what the user sees after save, after cancel, after dismiss, or after switching state.
- The reversibility controls: where applicable, how designers can turn dismissable or review-critical states on and off again from settings or local controls.
- The component strategy: interactive controls should reuse the project’s shared primitives and patterns unless a justified product-level exception exists.
- The reading load: copy should be front-loaded, concise, and non-duplicative so the interaction does not become a reading exercise.
- The scroll behavior: any drawer or sheet with content taller than the available viewport must scroll internally.

### Prohibited weak pattern

The audit should flag this as insufficient:

- A drawer or sheet that only explains an action in prose but does not show the functional shape of the interaction.
- A preview card that teaches a concept but never demonstrates how the user would actually act on it.
- A dismissable state that cannot be restored for future review.
- A local one-off tab, toggle, or segmented control pattern that duplicates an existing shared component style without strong justification.
- Repeating guidance in multiple stacked blocks when one short instruction near the top would do the job.
- A bottom sheet that becomes unusable on a real mobile viewport because the content area does not scroll.

### Acceptable sandbox pattern

Even before backend wiring exists, the sandbox should still try to show:

- realistic field groupings
- segmented or tabbed choices when categorization matters
- confirmation and consequence copy tied to the real logic
- visible before/after states
- local state-review toggles for newcomer/returning and other review-critical modes
- one concise top-placed orientation line when the action needs context, instead of repeated explanatory panels throughout the sheet
- internally scrollable sheet content when the viewport is constrained

## Interaction Method Change

This section captures a methodology correction for all future execution work.

### 1. Design for the end user, not the implementer

- The app should not read like internal product documentation.
- Guidance should help a user act quickly, not explain the whole logic tree every time they open a sheet.
- Static data is fine, but interactions should feel like the end product users will actually use.

### 2. Shared component rule is mandatory

- If a tabs or segmented-control pattern already exists in the project, new interaction work should reuse that shared style and utility approach.
- Visual or behavioral drift between similar controls is an audit failure unless the product need clearly justifies it.
- This applies across drawers, forms, settings, trackers, and analytics controls.

### 3. Put orientation at the top, not buried at the bottom

- The task framing for a sheet should appear near the top where the user decides what to do next.
- The drawer or sheet header should be the primary source of task framing.
- Internal content should not repeat the same title/instruction again unless it adds genuinely new decision-critical information.
- Field-specific instructions should appear before the relevant field, not after it.
- Long “next step” or “what this changes” explanations placed after the whole interaction create unnecessary reading debt and are less likely to be noticed in time.
- If a consequence is crucial to the user’s decision, it should appear before the first relevant field, not after the whole form.

Validation note:
- Nielsen Norman guidance explicitly recommends putting instructions for a field before the field.
- Material bottom-sheet guidance supports internally scrollable bottom-sheet content for long lists and tall content.
- The shadcn/vaul drawer pattern also supports a constrained sheet shell where the header and footer stay stable while the body becomes the scroll region.

### 4. Avoid duplicated guidance

- Do not explain a choice once in its label/description and then restate the same idea again in separate heavy guidance blocks unless the second block adds new decision-critical information.
- Favor one concise orientation sentence, then let the controls and immediate consequence preview do the rest.
- If a user must read multiple stacked text blocks before acting, the interaction is probably over-explaining itself.

### 5. Do not add post-save explainer screens unless the product truly needs one

- After a user completes an action, the primary response should usually be the updated product state itself, not another teaching panel.
- Saving from a drawer should normally close the drawer and let the changed screen carry the feedback.
- Add a separate post-save state only when the real product requires a meaningful next decision, warning, or irreversible confirmation.
- “You just did X and here is what happened” should not become a default pattern across Stashy.

### 6. Use one explicit dismiss pattern per drawer mode

- Swipe-to-dismiss is expected for mobile sheets, but it should not be the only dismissal path for an interactive task flow.
- If a drawer already includes a visible `Cancel` action inside its main action row, do not also add a second `Close` action for the same mode by default.
- If a drawer is informational or read-only, a single `Close` action is appropriate.
- `Back` and `Cancel` are part of the task flow and should not be duplicated by a second footer dismiss button.
- Dismiss gestures and system back behavior should be treated as supporting affordances, not as replacements for one clear visible dismiss action.
- The product should avoid making users choose between two controls that both mean “leave this drawer.”

### 7. All drawers and sheets must survive real mobile inspection

- The audit must assume real mobile viewport constraints, not only desktop devtools screenshots.
- If a sheet cannot scroll on an inspected mobile viewport, it is a product UX failure and must be redesigned or fixed.
- The same expectation applies to all future drawers, bottom sheets, and modal forms.
- The root drawer component must enforce viewport-safe height, a non-growing header/footer, and an internal body scroll region so individual screens do not have to solve this repeatedly.
- The root drawer component must also enforce the vertical breathing room between the header separator and the first body element so this spacing does not drift from sheet to sheet.
- In task drawers, the primary and secondary action buttons belong in the fixed footer area, not inside the scrollable body.
- A long drawer may scroll through content, but the main action row should remain visible unless the product has a very unusual reason not to.

### 8. Editable-looking controls must change visible state

- If a sheet, picker, filter, or settings control looks editable, saving or selecting it should change the visible product state in the sandbox.
- “Visual only” editing is not an acceptable default once the interaction is presented as part of the end product.
- Good examples now include: month switching that changes Analytics, filters that change History results, and settings forms that update the card the user came from.
- If a control cannot yet change visible state, it should be clearly scoped as review tooling or be visually reduced so it does not impersonate finished product behavior.

## Global Audit Scope Reminder

The audit must keep applying this rule across the whole product:

- Home
- Tracker
- Analytics
- Settings
- every drawer
- every bottom sheet
- every card with an action
- every toggleable or dismissable state
- every future feature added under this spec

No section should be considered “done” merely because it explains itself well.  
It must also be judged on whether it shows how the user acts and how the system responds.

It must also be judged on:

- whether it reuses the right shared primitives
- whether it keeps reading load low enough for real users
- whether it works on an actual mobile viewport, including scroll behavior
- whether the header, consequence framing, and fields appear in the right order for fast comprehension
- whether the screen looks visually resolved as a product surface, not just logically correct
- whether the visuals feel calm, intentional, and on-brand instead of dense, generic, or purely utilitarian

## State-Based Design Methodology

This spec now explicitly adopts a state-based product design method for the entire Stashy app.

We are not only designing screens.  
We are designing how each screen behaves across its meaningful product states.

### Required design sequence

For every page, major block, and interactive flow, the team should think through this order:

1. The starting state
2. What happens when the user interacts
3. What happens when the user does not interact
4. What happens after the user adds, edits, confirms, or dismisses data
5. What happens when no data exists
6. What happens when data exists
7. What happens when data is deleted, cleared, or reset

Where relevant, this should also include:

- validation and incomplete-input states
- loading and syncing states
- error and recovery states
- offline or unavailable states
- first-use versus returning-user states
- dismissed versus restored guidance states

### Why this is the right method

- It prevents us from designing only the “happy-path screenshot.”
- It keeps the product honest by forcing us to show what changes after action, not only the action trigger.
- It ensures empty, filled, deleted, and inactive states are designed intentionally instead of becoming afterthoughts.
- It matches how real users experience a product over time: before action, during action, after action, and when data changes.
- It prevents the team from mistaking interaction correctness for full product quality; the visual design still has to carry trust, focus, and taste across all of those states.

## Full-App Visual Validation Requirement

This audit does not stop at interaction correctness, copy placement, or CSS defect fixing.

The whole app must be validated visually against the same standard, across all pages and states:

- Does this screen feel visually clear at a glance?
- Is the hierarchy obvious before the user starts reading?
- Are cards, charts, pills, and rows composed with enough breathing room?
- Does the page look calm and purposeful, or crowded and mechanical?
- Are the screens visually distinctive enough to feel like a designed product rather than a wireframe with live state?
- Are we using visuals to help understanding, or only stacking text and numbers?

This requirement is global:

- Home
- Tracker
- Analytics
- Settings
- every drawer
- every review state
- every future redesign mission

A screen is not complete just because it works.
It also has to look resolved.

### External rationale

This method is supported by established UX guidance:

- Material’s empty-state guidance treats “no content” as a deliberate design case, not an omission.
- Material’s error guidance treats incomplete, failed, and incompatible states as core UX states that must be designed clearly.
- Material’s text-field guidance explicitly calls out field states such as empty, filled, valid, and invalid.
- Material’s confirmation guidance says not all actions need extra acknowledgment, which supports designing the updated screen state itself as the primary feedback when possible.

### Stashy-specific rule

For Stashy, no page or block is complete until its state transitions are understood.

That means the audit and implementation should always ask:

- What does this look like before the user acts?
- What does it look like while the user is deciding?
- What changes after the user acts?
- What if the user never acts?
- What if there is nothing here yet?
- What if there is already data here?
- What if that data is removed?

If those questions are not answered, then we are still designing a partial artifact, not the full end product.

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
| Find how to add a variable expense | Add transaction flow should make expense recording obvious | Home add flow | Partial |
| Find how to add received income or budget injection | Separate supported transaction types with distinct budget effects | No direct sandbox path | Missing |
| Understand the difference between Variable, Fixed, and Major | Product logic depends on these distinctions | Home + Tracker tabs + labels | Partial |
| Review upcoming fixed payments and fixed tracker progress | Use dashboard preview and fixed tracker sections | Home fixed payments + Tracker fixed tab | Mostly clear |
| Record or inspect a major expense and understand its consequence | Major expense lowers effective variable budget and should explain rate impact | Tracker major tab + add drawer | Partial |
| Use history filters to answer a real question | History filters should help isolate type, direction, method, and date range | Tracker history filter drawer + filtered results card | Mostly clear |
| Understand what Analytics is for and whether its numbers are actionable | Read-only monthly health report with meaningful comparisons | Analytics screen | Stronger, but still mostly observational |
| Use Settings to change language/theme and manage payment methods | Manage appearance and defaults clearly | Settings screen | Mostly clear and now stateful |

## Interactive Coverage Matrix

Every major page should be audited for both explanation and action design.

| Screen | Guidance requirement | Functional interaction requirement | State-review requirement |
| --- | --- | --- | --- |
| Home | Explain daily rate, remaining today, overspend consequence, and category model | Show how to start adding spending, received income, injection, and major entries with meaningful field/choice structure | Allow review of newcomer vs returning, on-track vs overspent, and major shown vs hidden |
| Tracker / Fixed | Explain recurring obligations vs manual fixed buckets | Show how the user adds recurring fixed payments and budget transactions, and how progress/pressure updates | Allow review of paid/pending/overdue and active filter states where relevant |
| Tracker / Major | Explain why major differs from normal spend | Show how the user records a major expense and how the system previews reduced effective budget/daily rate | Allow review of major warning active/inactive and post-entry consequence state |
| Tracker / History | Explain what filters are for | Show a unified filtering interaction with actual type/direction/method/date controls | Allow review of filtered vs unfiltered states |
| Analytics | Explain what each summary means and what to do next | Where controls exist, show their purpose honestly and avoid fake depth without state meaning | Keep temporary static controls clearly separated until they gain real state change |
| Settings | Explain global and state-review controls clearly | Show usable controls for appearance, language, payment methods, and design-review toggles | Keep dismissable/stateful sandbox surfaces re-toggleable here when appropriate |

## Journey Evaluations

### J-001 Home promise in under 10 seconds

- **Intended backend-supported flow:** Home should immediately teach the daily-rate promise and show what the user can spend today.
- **Current sandbox path:** Open Home, read header, see Budget Overview first, then Daily Rate, then fixed payments and history.
- **Friction points:** The first scan emphasizes total budget composition more than the core daily decision model. The help icon exists, but the core promise should not require help.
- **Missing states or misleading mock behavior:** The most important concept is visually secondary.
- **Redesign recommendation:** Put the hero number and plain-language daily interpretation at the top, with a clear primary action to log money. Treat the intro card as newcomer guidance, not permanent chrome: it should be dismissible after first understanding and recoverable from Help.

### J-002 Understand Daily Rate, Remaining Today, and Tomorrow impact

- **Intended backend-supported flow:** Users should understand today’s allowance, what remains, and tomorrow impact only when overspent and not in emergency mode.
- **Current sandbox path:** Read the Daily Rate card and optionally switch state via the Home settings drawer.
- **Friction points:** The card requires users to infer the relationship between allowance, remaining, spent, and tomorrow. It uses concise labels but not a clear explanatory sentence.
- **Missing states or misleading mock behavior:** Tomorrow-rate content is always visible, which teaches the wrong logic.
- **Redesign recommendation:** Add one interpretation line on the card itself and gate tomorrow-impact strictly to the overspend state.

### J-003 Find how to add a variable expense

- **Intended backend-supported flow:** Users should have an obvious transaction-entry route for daily spending.
- **Current sandbox path:** Tap the FAB on Home and move through the add flow.
- **Friction points:** The main path now exists, but the broader app still needs the same level of interaction completeness in Tracker and related surfaces.
- **Missing states or misleading mock behavior:** Home is ahead of the rest of the product, which can create uneven expectations across sections.
- **Redesign recommendation:** Use the Home flow as the quality bar and bring Tracker and adjacent entry points up to the same level of field structure, state change, and consequence clarity.

### J-004 Find how to add received income or budget injection

- **Intended backend-supported flow:** Users should be able to distinguish ordinary received money from budget injections because they have different meaning in the product.
- **Current sandbox path:** Home add flow exposes both actions.
- **Friction points:** The distinction exists on Home, but the rest of the product still does not consistently reinforce the difference between the two actions.
- **Missing states or misleading mock behavior:** Cross-screen follow-up states and related summaries are still thinner than the entry interaction itself.
- **Redesign recommendation:** Keep the Home distinction and carry it into downstream state changes, summaries, and Tracker/history treatment so the model stays consistent after save.

### J-005 Understand Variable vs Fixed vs Major

- **Intended backend-supported flow:** Users should understand these categories because each changes the month differently.
- **Current sandbox path:** Users infer meaning from Home labels, Tracker tabs, and history rows.
- **Friction points:** The model is distributed across multiple screens, and there is little plain-language explanation where the terms first appear.
- **Missing states or misleading mock behavior:** History labels help, but they arrive too late in the learning curve.
- **Redesign recommendation:** Add category explainer copy or a short help sheet accessible from Home and Tracker.

### J-006 Review upcoming fixed payments and fixed tracker progress

- **Intended backend-supported flow:** Users should preview upcoming obligations on Home, then inspect monthly payments and budget buckets in Tracker.
- **Current sandbox path:** Home fixed-payments preview links into Tracker history, while Tracker Fixed shows monthly and budgets sections with warning tone.
- **Friction points:** The preview is reasonably understandable, but Home only offers `View All` without clarifying that fixed-tracker detail lives elsewhere.
- **Missing states or misleading mock behavior:** The Home preview does not strongly connect to the deeper fixed-tracking model.
- **Redesign recommendation:** Make the fixed preview link language more specific and add a short summary line that ties upcoming bills to the tracker overview.

### J-007 Record or inspect a major expense and understand its consequence

- **Intended backend-supported flow:** Major expense entry should preview its impact on rate, and the major area should explain why these purchases matter.
- **Current sandbox path:** Tracker Major lists items; add-entry interaction is still thinner than Home.
- **Friction points:** The list reads like a transaction archive more than a consequence view.
- **Missing states or misleading mock behavior:** No visible relationship between major purchases and lowered daily rate.
- **Redesign recommendation:** Add a consequence summary and a major-expense entry interaction that shows how the purchase changes allowance before save, then lets the updated Tracker/Home state carry the result.

### J-008 Use history filters to answer a real question

- **Intended backend-supported flow:** One bottom sheet should let users refine by type, direction, payment method, and date range.
- **Current sandbox path:** Two pills open separate drawers for details and date.
- **Friction points:** Users must decide which drawer to use before they know the full filter model.
- **Missing states or misleading mock behavior:** The split filter architecture is weaker than the intended wireframe and fragments one task into two.
- **Redesign recommendation:** Merge filters into one bottom sheet with one active-count badge and one Apply/Clear action row.

### J-009 Understand Analytics and whether it is actionable

- **Intended backend-supported flow:** Analytics should explain monthly health, projection, and month-over-month movement in a compact read-only report.
- **Current sandbox path:** Read header, pacing card, projection card, shaping card, and comparison card.
- **Friction points:** The pacing card is clear, but the remaining cards still require some interpretation work. The screen explains status better than it explains next steps.
- **Missing states or misleading mock behavior:** The month picker is visually present but intentionally non-functional, which can over-promise exploration.
- **Redesign recommendation:** Add explicit action-oriented summaries and either reduce the selector’s perceived power or make it produce a meaningful state change. Do not rely on explanatory “preview” labeling as the main fix.

### J-010 Use Settings to change language/theme and manage payment methods

- **Intended backend-supported flow:** Settings should manage appearance, defaults, and payment methods clearly.
- **Current sandbox path:** Use segmented theme control, language pill, payment method rows, and bottom sheets.
- **Friction points:** The interaction model is clear, but the language switch is only local visual state and the surrounding copy remains English.
- **Missing states or misleading mock behavior:** The language control implies a product-level locale change that the screen itself does not honor.
- **Redesign recommendation:** Treat language switching as a true locale test path or separate it clearly as a design-review control until it is wired. Do not let it masquerade as a complete product setting.

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
- Tracker correctly hides the FAB on History, which aligns with the read-only nature of that tab and avoids accidental action overload.

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
- `Recommended fix`: Replace weak or ambiguous FAB behavior with a clear transaction-entry chooser organized by outcome, not internal jargon: spend, receive money, fixed payment, transfer, major purchase, budget injection.
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

### F-009

- `ID`: F-009
- `Area`: Home help and onboarding placement
- `Layer affected`: Current sandbox
- `Severity`: Medium
- `What the user sees`: Home has a help icon, but the help drawer currently shows preview copy rather than concrete daily-rate education.
- `Why it hurts comprehension/conversion`: The product already has a plausible teaching entry point, but it is not being used to reduce onboarding friction.
- `What system truth says`: Stashy’s differentiator is the daily-rate model, so the app needs an explicit way to teach it without forcing users into Settings.
- `Recommended fix`: Turn Home help into a real explainer sheet with `Daily Rate`, `Remaining Today`, tomorrow impact, and category definitions.
- `Benchmark rationale`: Strong finance apps make their core model understandable at the point of need, not buried in a distant settings page.

### F-010

- `ID`: F-010
- `Area`: Analytics month control
- `Layer affected`: Current sandbox
- `Severity`: Low
- `What the user sees`: Analytics exposes a month picker trigger and month list that now update the visible report state across pacing, projection, shaping, and comparison.
- `Why it hurts comprehension/conversion`: This specific trust issue is largely resolved, but it remains a standing warning for any future report control that looks interactive without changing visible state.
- `What system truth says`: Analysis is month-based and snapshots matter, so month selection is a real future concept.
- `Recommended fix`: Keep the month picker stateful and apply the same honesty rule to any future report filters, toggles, or chart interactions.
- `Benchmark rationale`: Finance reports should feel dependable; controls that imply more power than they provide erode confidence.

## Implemented Vs Missing

### Implemented but currently weak

- Home hierarchy under-emphasizes the daily-rate promise.
- Daily-rate card teaches the wrong tomorrow-impact model.
- Major tab explains records more than consequences.
- History filtering is fragmented.
- Analytics is informative but not sufficiently action-oriented.

### Supported by product truth but not represented well in sandbox

- Variable received-income entry path.
- Budget injection entry path.
- Current-month major-expense consequence confirmation.
- Emergency-mode distinction in the daily-rate experience.
- True locale-driven Arabic copy on Analytics and Settings.

### Temporary sandbox-only controls that must stay honest

- Analytics month switching should not look more powerful than it is until it changes real report state.
- Any design-review-only toggle must be clearly separated from product-facing settings.
- Temporary static controls are acceptable only when they are visibly scoped as review tooling and not confused with finished product behavior.

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
- When an action is present, the sandbox should show the action mechanics themselves, not only a descriptive wrapper around them.

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
- Replace guidance-only action sheets with interaction-first flows that include input structure and resulting product states.

### P1 — IA and workflow redesign

- Redesign Home around “current allowance + next action + consequence.”
- Make the Home intro card newcomer-focused, dismissible, and recoverable from Help instead of always visible.
- Treat interaction design as part of the audit backlog itself: drawers, filters, state-review controls, and onboarding visibility should be judged as product UX, not deferred polish.
- Ensure design-review states for dismissable or stateful UI can be re-enabled from settings bottom sheets so review is reversible and intentional.
- Merge History filters into one coherent bottom sheet.
- Add major-expense consequence summaries to Tracker.
- Move first-use guidance from Settings into Home/help entry points.
- Add interactive forms or structured form previews across all major supported actions so every page contains both explanation and doing.

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
- Any surface that claims to support an action is judged not only for clarity of guidance but for the visibility of actual interaction structure.
- Dismissable or stateful review UI includes a clear way to turn those states on and off again when review requires it.
- All pages are evaluated for interaction coverage across their major sections and blocks, not only for static information hierarchy.
- Shared interaction primitives are reused consistently across similar controls unless the audit explicitly justifies a divergence.
- Sheet and drawer interactions are tested against mobile-height constraints and must remain internally scrollable when content exceeds the viewport.
- Guidance is concise, placed early, and not repeated in multiple blocks unless each block adds genuinely new user-critical information.
- Drawer and sheet headers act as the primary task introduction; internal content must not echo the same instruction block again by default.
- Action-critical consequences appear before the first relevant field when they affect the user’s decision to continue.
- Each drawer mode exposes one clear visible dismiss action pattern: either `Cancel`/`Back` for task flows or `Close` for informational flows, not both at once by default.
- Task-drawer footer actions remain visible while the drawer body scrolls.

## Audit Execution Status

- Comparison audit framework created.
- First-pass findings captured across Home, Tracker, Analytics, and Settings.
- Journey-by-journey evaluation captured for all required journeys.
- External benchmark rationale incorporated.
- Ready for the next implementation phase: convert `P0` backlog into product code and updated wireframes.

## Progress Retrospective

This retrospective re-reads the app after the stronger interaction rule was added.

### What improved already

- Home now teaches the daily-rate promise more clearly than before.
- Dismissable onboarding can now be turned on and off again from the Home settings sheet.
- Tracker history filtering is now consolidated into one entry point.
- Tracker major explains consequence better than a plain ledger list.
- Home and Tracker add surfaces now explain classification and consequence more clearly.

### What still fails the stronger rule

- Many interactive surfaces still explain the action without truly showing the working interaction shape.
- Several sheets do not yet contain realistic input fields, validation framing, confirmation behavior, or resulting filled/changed states.
- Analytics remains mostly observational and still lacks honest interaction framing around its controls.
- Settings contains real-looking controls, but not all of them are clearly separated into product settings versus sandbox preview controls.

## Block-By-Block Audit

Each block below is judged against the same audit criteria:

- clarity of purpose
- visibility of the actual interaction
- correctness of system response framing
- reversibility / state-review control
- overall severity

### Home

| Block | Current state | Rule application | Severity | Redo direction |
| --- | --- | --- | --- | --- |
| Header | Good entry point with Help and Settings access | Works structurally, but Help still carries too much teaching burden for the main product model | Medium | Keep actions, but reduce dependence on Help by making first-view state stronger |
| Intro card | Good newcomer framing and now dismissible/re-toggleable | Passes guidance and state-review requirements, but not an action requirement on its own | Low | Keep as guidance-only because it is onboarding, not core functionality |
| Daily Rate card | Stronger than before and closer to product truth | Still mostly informational; no direct corrective or transactional path attached to the state | Medium | Add adjacent action path such as log spend / add money tied to current state |
| Budget Overview | Readable summary | Explains state, but does not yet help the user act on pressure or category imbalance | Medium | Add clearer bridges to the relevant action flows or tracker destinations |
| Fixed Payments preview | Understandable list preview | Missing stronger action connection to the fixed tracker and to add-fixed behavior | Medium | Add clearer “review fixed tracker” and “add fixed” affordances |
| History preview | Reasonable recent-activity block | Mostly static summary; does not yet expose filtering or drill-in behavior locally | Low | Keep it lightweight, but connect it more clearly to History’s interactive value |
| Home add sheet | Real multi-step interaction with chooser, fields, and save behavior | Much closer to the stronger rule, but still needs broader cross-screen consistency and richer downstream state reinforcement | Medium | Use it as the reference pattern, then align Tracker and related surfaces to the same bar |
| Home help sheet | Good teaching surface | Acceptable as guidance, but should stay clearly separate from functional sheets | Low | Keep as education-only, with no ambiguity that it is not the action flow |
| Home settings sheet | Useful design-review control surface | Passes state-review logic well, but needs a cleaner distinction between design-review controls and product-facing settings | Medium | Group these controls under a clearly named design-review section |

### Tracker

| Block | Current state | Rule application | Severity | Redo direction |
| --- | --- | --- | --- | --- |
| Overview strip | Good top summary for the tracker area | Informational only, which is fine, but it does not yet guide the user toward the right corrective tab | Low | Add slightly clearer relationship between summary numbers and tab destinations |
| Tab bar | Clear separation of Fixed, Major, History | Structural success | Low | Preserve |
| Fixed tab / monthly section | Shows recurring obligations well | Missing add/edit interaction shape in-context; add flow still lives too abstractly compared with Home | High | Add realistic fixed-entry form states and clearer paid/pending resulting states |
| Fixed tab / budget buckets | Explains manual fixed tracking directionally | Missing direct editing or drill-in interaction model for bucket management | High | Show at least one bucket drill-in or add-budget flow with realistic inputs |
| Major warning banner | Good pressure signal | Fine as state-only UI | Low | Preserve |
| Major summary card | Big improvement over prior ledger-only state | Still needs the actual major-entry form and stronger resulting-state follow-through to satisfy the stronger rule fully | Medium | Keep summary, then attach real major-entry interaction flow |
| Major expense list | Understandable archive | Fine as supporting state, but not enough without action flow | Low | Preserve as secondary support |
| History filter button | Better than the old split model | Good trigger | Low | Preserve |
| History filter sheet | Now includes real date inputs and filtered-result feedback | Much closer to the intended product behavior and no longer stops at an active-count badge | Low | Preserve the pattern and extend it if History gains drill-in or export actions |
| Tracker add drawer / Fixed | Better consequence framing | Still guidance-first, not interaction-first; no realistic fields yet | High | Convert to actual monthly-payment vs budget-transaction form previews |
| Tracker add drawer / Major | Better than placeholder text | Still lacks amount/method/category fields and resulting-state consequence handling | High | Convert to full major-entry flow with before/after daily-rate consequence |

### Analytics

| Block | Current state | Rule application | Severity | Redo direction |
| --- | --- | --- | --- | --- |
| Header and month trigger | Clean and readable | Month control now produces an honest report-state change | Low | Preserve and keep future report controls at the same honesty bar |
| Pacing card | Strongest analytics block | Good explanation, but still not strongly connected to a corrective next step | Low | Add one next-step recommendation tied to pace state |
| Projection card | Readable summary | Informational only, which is acceptable, but it still lacks an action bridge | Low | Add “what to do now” guidance or a linked corrective path |
| Shaping card | Good summary of why the month looks the way it does | No drill-in or interaction bridge from each shaping factor | Medium | Add paths into Fixed, Major, or Home add flows |
| Month comparison card | Clear comparative summary | Close-month interaction exists only in one fallback state and not as a trustworthy core flow | Medium | Either expose honest close-month behavior or keep comparison purely read-only |
| Month picker drawer | Nicely designed visually | Now passes the stronger honesty rule because selection changes the report itself | Low | Preserve and keep report states coherent month to month |
| Upgrade gate | Strong focused block | Acceptable as a non-interactive conversion surface | Low | Preserve |

### Settings

| Block | Current state | Rule application | Severity | Redo direction |
| --- | --- | --- | --- | --- |
| Profile card + drawer | Reasonably complete interaction | Save now changes the visible profile state, which makes the pattern much more trustworthy | Low | Preserve and use as a quality bar for other sheets |
| Monthly Budget card + drawer | Strong input structure with visible save result | Now updates the budget summary directly after save | Low | Preserve |
| Budget boosts card + drawer | Stronger than before | Empty state now transitions into a filled list after save | Low | Preserve |
| Payment methods card | Strong functional block | Add, edit, delete, and default all change visible state and remain the best Settings reference pattern | Low | Preserve and use as reference |
| Guide card | Purely informational CTA | Acceptable as guidance-only because it is explicitly guidance | Low | Preserve |
| Appearance card | Useful settings grouping | Language/theme are still partly review-oriented and not fully honest as product settings | Medium | Distinguish real product controls from design-review controls |
| About block | Static informational footer | Fine | Low | Preserve |

## Re-Do Summary

The stronger rule applies most urgently to these blocks:

1. Home add sheet
2. Tracker add drawer for Fixed
3. Tracker add drawer for Major
4. Tracker fixed bucket interactions
5. Analytics actionability beyond read-only reporting
6. Settings separation between real product settings and sandbox preview controls where future review tooling appears

## Next Mission

The next mission should not be “more guidance.” It should be an interaction redesign pass focused on the weakest blocks above.

### Mission objective

Rebuild the app’s highest-frequency and highest-consequence action flows so they show:

- realistic inputs
- category-specific field structures
- save/cancel behavior
- clear consequence previews where supported by logic
- post-action resulting states
- reversible state-review toggles where needed for design review

### Recommended implementation order

1. Home `Log spending`, `Received income`, `Budget injection`, and `Major purchase` as a real multi-step add flow.
2. Tracker Fixed add/edit flows for recurring payments and budget transactions.
3. Tracker Major full entry flow with daily-rate consequence preview before save and updated state after save.
4. Analytics actionability pass so the strongest report states point toward the right next corrective action.
5. Tracker fixed bucket drill-in and edit behavior.
6. Settings cleanup to separate design-review controls from actual product settings whenever sandbox-only tooling expands there.

### Exit criteria for the next mission

- The user can see how to start each major action.
- The user can see the fields or structured inputs for each major action.
- The user can see what the system will change before confirming when the logic supports that.
- The user can see what changed after the action in the product state itself, without needing an extra explanatory drawer by default.
- Designers can turn relevant review states on and off again without losing review control.
- Each important surface is evaluated across its meaningful states: empty, populated, acted-on, unacted-on, and removed/reset where applicable.
