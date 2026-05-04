> **LLM Context & Usage Guide**
> **File Purpose:** The external mobile-direction research bridge for Stashy's design system.
> **How to Use:** Read this when shaping visual hierarchy, card layouts, accent strategy, chart behavior, or screen composition. It distills what current mobile platforms and modern money apps are doing well, then translates those patterns into Stashy-specific direction.
> **Constraint Reminder:** This is a principle source, not a copy source. Stashy must borrow methods, not costumes.

# Stashy Mobile Direction Research

## 1. Why This Exists

Stashy is no longer only auditing an existing UI. It is actively shaping its own product identity.

This file captures the external signals that matter for that work:

- what current mobile platforms reward
- what modern money apps emphasize
- what design patterns make financial interfaces feel more human, more glanceable, and more trustworthy

The goal is not trend compliance. The goal is better judgment.

## 2. Source Snapshot

### Platform Guidance

- Apple Human Interface Guidelines: clear visual hierarchy, legibility, glanceability, and restrained brand use
- Apple Widget guidance: strong typography, balanced density, glanceable information, and thoughtful brand signals
- Android / Material 3 guidance: separate accent, semantic, and surface colors; use semantic color consistently; reserve strong color for prominence
- Google Material 3 Expressive launch guidance: fluid interactions, more glanceable surfaces, emphasized typography, and responsive components

### Product Signals

- Monzo: budgeting as something personal, customizable, and easy to scan
- Revolut: “build your own bank” through configurable budgeting tools and strong control surfaces
- Cash App: directness, strong action clarity, humanized money movement, and contextual suggestions

## 3. What The Research Repeats

Across platform guidance and modern finance products, the same signals keep appearing:

1. **Glanceability wins.**
   A user should understand the main state of a screen in seconds.

2. **Hierarchy must do real work.**
   Large numbers, medium labels, and quiet support text outperform flat-card dashboards.

3. **Surfaces should rest the eye.**
   Most of the screen should be calm. Meaning should come from structure first, accent second.

4. **Color must be role-based.**
   Surface color, accent color, and semantic state color should not be mixed arbitrarily.

5. **Important actions should be obvious.**
   Strong action ownership is better than coloring every button as primary.

6. **Money products need emotional translation.**
   Users read “red = loss/risk,” “green = relief/gain,” “blue = intervention/info,” and “yellow = caution/review” almost automatically.

7. **Observability is a visual problem, not only a data problem.**
   If Stashy predicts consequences, the interface must make those consequences readable at a glance.

## 4. Stashy-Specific Direction

Stashy should feel like a **warm financial control surface**:

- more human than a trading terminal
- more disciplined than a lifestyle budgeting app
- more expressive than generic SaaS finance UI
- more observability-driven than traditional expense trackers

The right emotional blend is:

- warm
- trustworthy
- consequences-aware
- visibly organized
- quietly alive

## 5. Layout Direction

### 5.1 Screen Structure

Each screen should have one dominant read path:

1. hero state
2. consequence or explanation
3. supporting controls
4. detail/history layers

Do not let secondary cards compete with the hero number or primary decision.

### 5.2 Card Language

Stashy should prefer:

- grouped card stacks
- nested soft surfaces
- short explanatory strips
- compact stat tiles
- drawers and bottom sheets for branching actions

Avoid:

- equal-weight card grids
- noisy borders everywhere
- decorative color blocks with no semantic reason
- charts that dominate before the key number is understood

### 5.3 Navigation And Controls

- Bottom navigation should feel like a real product dock, not icon text floating over the page.
- Filters should use chips or segmented controls with clear selected state.
- Primary actions should be rare, warm, and intentional.
- Secondary actions should be quiet but still visibly tappable.

## 6. Visual Direction

### 6.1 Background And Surface Philosophy

- Main background: warm, long-session comfortable, never pure white
- Main cards: cleaner and slightly lighter than the page
- Nested surfaces: visibly distinct but still warm
- Overlays: grounded and soft, not cold black glass

### 6.2 Typography Philosophy

- Hero numbers are the product's loudest visual asset
- Titles should feel calm and confident, not marketing-heavy
- Secondary text should explain consequences, not compete with them
- Small labels should stay readable and quiet

### 6.3 Motion And Feedback

Borrow from current expressive mobile systems:

- soft state transitions
- responsive chip and sheet behavior
- lightweight depth cues
- subtle emphasis on changed numbers or status

Do not introduce motion for spectacle. Motion should support consequence awareness and control confidence.

## 7. Semantic Color Direction

The research supports a clearer split between two different jobs:

### 7.1 Structural Identity Colors

These answer: **what is this thing?**

- Variable
- Fixed
- Major
- Transfer

### 7.2 Consequence Colors

These answer: **what does this mean right now?**

- Income / received
- Expense / outcome
- Injection / intervention
- Warning / review
- Emergency / destructive
- Pending / inactive / archived

Stashy should never force one color to do both jobs at the same time without hierarchy.

Example:

- a fixed category may use teal as its identity color
- an overdue fixed payment may still show red for its current risk state

That is not a contradiction. It is correct visual layering.

## 8. Practical Implications For The Next Implementation Cycle

1. Rebuild semantic tokens around human expectation first, not around the current component colors.
2. Separate category identity from direction and status semantics in badges, rows, charts, and cards.
3. Keep charts quieter than hero states, then use semantic accents only where interpretation matters.
4. Use one branded primary action family and a small set of trustworthy secondary accents.
5. Audit every screen for “first read clarity”: what does the user understand in 3 seconds?

## 9. Source Links

- Apple HIG overview: https://developer.apple.com/design/human-interface-guidelines/?locale=en_us
- Apple HIG typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Apple HIG color: https://developer.apple.com/design/human-interface-guidelines/color
- Apple HIG widgets: https://developer.apple.com/design/human-interface-guidelines/widgets
- Android mobile color guidance: https://developer.android.google.cn/design/ui/mobile/guides/styles/color?hl=en
- Google Material 3 Expressive announcement: https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/
- Monzo budgeting overview: https://monzo.com/us/features/budget-with-monzo
- Monzo Pots: https://monzo.com/i/pots/
- Revolut mobile banking: https://www.revolut.com/en-FI/ways-to-bank/mobile-banking/
- Cash App product overview: https://cash.app/?os=v
