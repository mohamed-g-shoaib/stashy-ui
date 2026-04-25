**Task**
Build the Analytics screen as a static, read-only page at `app/(app)/analytics.tsx`. All data is hardcoded mock constants at the top of the file. No API calls, no state management beyond what is local to this file.

---

**Context**

The Analytics screen gives Pro users a monthly spending health report. It is linear — no tabs, no pinned cards, just a clean top-to-bottom scroll. The screen is read-only with one exception: a "Close Month" button that appears only when month-over-month comparison data is unavailable because the previous month was never closed.

The screen has two states:

- **Pro user** — full screen renders
- **Free user** — entire content area is replaced by an upgrade gate; the header still shows

---

**UI Description**

**1. Screen Header**

- Title: `"Analytics"` aligned leading
- Current month label aligned trailing: `"April 2026"`
- Thin full-width divider below header

---

**2. Pacing Card**

The first and most prominent card. Answers: _"Am I spending too fast or too slow this month?"_

- Large primary metric at the top: the pacing delta as a signed percentage, e.g. `"−12%"`, followed by a plain-language label on the same line or directly beneath: `"Under pace"` or `"Over pace"` depending on sign
- One sentence of context below: e.g. `"You're spending slower than your budget pace for this point in the month"`
- Two supporting stats side-by-side below the sentence:
  - Left: `"Budget Used"` label + `"36%"` value
  - Right: `"Month Progress"` label + `"81%"` value (days elapsed out of total days)
- A single horizontal bar below the stats. The bar has two markers:
  - A solid fill representing budget used so far (36%)
  - A ghost tick or secondary marker at the expected pace position (81%) — representing where spending _should_ be at this point in the month
  - The gap between the two is the visual expression of the pacing delta
- Below the bar, a small muted pill: `"3 days overspent so far"` — omit entirely if zero

Mock values: `pacingDeltaPct = -12`, `budgetUsedPct = 36`, `monthProgressPct = 81`, `overspentDaysMtd = 3`

---

**3. Projection Card**

Answers: _"Where will I end up if I keep this pace?"_

- Three stat columns horizontally:
  - `"Avg Daily"` / `"160 EGP"`
  - `"Proj. Spend"` / `"4,960 EGP"`
  - `"Proj. Savings"` / `"1,040 EGP"`
- Projected Savings value is visually positive (favorable) or negative (warning) based on its sign
- Below the three columns, a small badge or label: `"~17% projected savings rate"`
- No bar, no chart — numbers only

Mock values: `avgDailySpend = 160`, `projectedEndSpend = 4960`, `projectedSavings = 1040`, `projectedSavingsRate = 17`

---

**4. Month-over-Month Card**

Answers: _"Am I improving compared to last month?"_

Two states:

**State A — Data available** (`momAvailable = true`):

- Card title: `"vs Last Month"`
- Three comparison rows, each showing: metric name on the left, last month value and this month value in the middle, delta badge on the right
  - Row 1 — `"Savings Rate"`: `18%` → `24%` · `▲ +6%`
  - Row 2 — `"Base Daily Rate"`: `278 EGP` → `278 EGP` · `—` (no change)
  - Row 3 — `"Large Purchases"`: `12%` → `8%` · `▼ −4%`
- Delta badge is visually favorable or unfavorable based on the metric's direction: for Savings Rate, up is good; for Large Purchases, down is good
- Below each non-zero delta row, a single muted sentence explaining the direction in plain language:
  - Below Savings Rate: `"Saving more than last month"`
  - Below Large Purchases: `"Fewer large purchases than last month"`
  - Row 2 has no sub-label since delta is zero
- Below the Base Daily Rate row specifically, if a reason string exists, render it as a muted italic line: e.g. `"Base rate unchanged — fixed expenses stayed the same"`

**State B — No snapshot available** (`momAvailable = false`):

- Card title: `"vs Last Month"`
- Centered inside the card: a short explanation — `"No previous month data yet. Close March to unlock comparison."`
- A single CTA button below: `"Close March"`

Mock values: `momAvailable = true`, `savingsRatePrev = 18`, `savingsRateCurr = 24`, `baseRatePrev = 278`, `baseRateCurr = 278`, `largePurchasesPrev = 12`, `largePurchasesCurr = 8`, `baseRateChangeReason = "Base rate unchanged — fixed expenses stayed the same"`

---

**5. Free User Gate**

When `plan = 'free'`, replace the entire content area (below the header) with:

- A centered lock icon
- Headline: `"Unlock Analytics"`
- Two to three lines of plain-language description of what Pro analytics offers
- A single CTA button: `"Upgrade to Pro"`

Mock value for development: `plan = 'pro'`

---

**ASCII Wireframe**

```
+--------------------------------------------------+
|  Analytics                         April 2026   |
|--------------------------------------------------|
|                                                  |
|  +----------------------------------------------+|
|  | −12%  Under pace                            ||
|  | You're spending slower than your budget     ||
|  | pace for this point in the month            ||
|  |                                             ||
|  |  Budget Used          Month Progress        ||
|  |    36%                   81%               ||
|  |                                             ||
|  |  [=====>  |·····················tick·····]  ||
|  |            ↑ actual        ↑ expected pace  ||
|  |                                             ||
|  |  [3 days overspent so far]                  ||
|  +----------------------------------------------+|
|                                                  |
|  +----------------------------------------------+|
|  |  Avg Daily     Proj. Spend    Proj. Savings  ||
|  |  160 EGP       4,960 EGP      1,040 EGP     ||
|  |                              ~17% rate       ||
|  +----------------------------------------------+|
|                                                  |
|  +----------------------------------------------+|
|  | vs Last Month                               ||
|  |                                             ||
|  | Savings Rate     18% → 24%          ▲ +6%  ||
|  | Saving more than last month                 ||
|  |                                             ||
|  | Base Daily Rate  278 → 278 EGP         —    ||
|  | Base rate unchanged — fixed expenses        ||
|  | stayed the same.                            ||
|  |                                             ||
|  | Large Purchases   12% → 8%          ▼ −4%  ||
|  | Fewer large purchases than last month       ||
|  +----------------------------------------------+|
|                                                  |
|  (no FAB)                                        |
|--------------------------------------------------|
|  [Home]    [Tracker]  [Analytics]  [Settings]    |
+--------------------------------------------------+


— FREE USER STATE —
+--------------------------------------------------+
|  Analytics                         April 2026   |
|--------------------------------------------------|
|                                                  |
|            [  lock icon  ]                       |
|                                                  |
|            Unlock Analytics                      |
|                                                  |
|   See your spending pace, monthly trends,        |
|   and savings projections — all in one place.   |
|                                                  |
|            [ Upgrade to Pro ]                    |
|                                                  |
+--------------------------------------------------+
|  [Home]    [Tracker]  [Analytics]  [Settings]    |
+--------------------------------------------------+


— MOM CARD: NO SNAPSHOT —
+--------------------------------------------------+
|  +----------------------------------------------+|
|  | vs Last Month                               ||
|  |                                             ||
|  |   No previous month data yet.              ||
|  |   Close March to unlock comparison.        ||
|  |                                             ||
|  |          [ Close March ]                   ||
|  +----------------------------------------------+|
+--------------------------------------------------+
```

---

**Acceptance**

- Pacing card renders with signed delta, plain-language label, two supporting stats, dual-marker bar, and overspent days pill
- Overspent days pill is absent when `overspentDaysMtd` is zero
- Projection card renders three stat columns and savings rate badge — no bar or chart
- MoM card renders three diff rows with correct delta direction badges
- Delta badges on MoM rows are visually favorable or unfavorable based on metric direction, not just numeric sign
- Plain-language sub-labels appear below non-zero delta rows only
- Base rate reason string renders as a muted line under the Base Daily Rate row
- MoM card empty state renders with explanation and `"Close March"` CTA when `momAvailable = false`
- Free user gate replaces content area entirely; header still shows
- No FAB anywhere on this screen
- No tabs, no pinned elements — single linear scroll
- Analytics tab is active in bottom navigation
