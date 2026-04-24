### UI Description Breakdown

**1. Screen Header**

- Title: "Tracker" aligned leading
- No month switcher — this screen is always current month only
- Thin full-width divider below header

**2. Pinned Overview Card (always visible, never scrolls away)**

- Three stat columns: **Budgeted** / **Paid** / **Remaining**
- Example values: `6,200 EGP` / `4,100 EGP` / `2,100 EGP`
- A single horizontal progress bar below the stats showing paid/remaining ratio (66%)
- Card is always visible regardless of which tab is active

**3. Pinned Tab Bar (sits below overview card, also never scrolls away)**

- Three tabs: **Fixed · Major · History**

**4. Fixed Tab Content (scrollable below the pinned area)**

Two collapsible sections stacked vertically:

**Section A — Monthly**

- Section header row: label "Monthly" on left, item count + total on right, collapse chevron far right
- Warning state: if any item is overdue or unpaid past due date, header text turns **red** with a small warning icon. If approaching (within 2 days), header turns **amber**. Default is neutral.
- Shows **minimum 1 item** even when collapsed — the most urgent one (nearest due date or overdue)
- Full expanded list shows all items
- Each item row: name left, amount + status badge right, due date below name
- Status badge variants: `✓ Paid` (green), `Pending` (amber), `Overdue` (red)
- Mock data (7 items):
  - Rent — 3,000 EGP — Paid — Apr 1
  - Spotify — 100 EGP — Paid — Apr 5
  - Netflix — 80 EGP — Paid — Apr 8
  - Internet — 260 EGP — Pending — Apr 21 (2 days away → amber warning)
  - Gym — 200 EGP — Pending — Apr 24
  - iCloud — 15 EGP — Pending — Apr 26
  - Phone Bill — 300 EGP — Overdue — Apr 10 (overdue → red)

**Section B — Budgets**

- Section header row: label "Budgets" on left, total paid/budgeted on right, collapse chevron far right
- Warning state: if any bucket is ≥90% spent, header turns **amber**. If any bucket is over 100%, header turns **red**.
- Shows **minimum 1 item** when collapsed — the one closest to or over its limit
- Each bucket card: name + percentage right-aligned, progress bar below, transaction count tappable label (e.g. "▼ 4 transactions" — collapsed by default per DL-025)
- Mock data (5 buckets):
  - Coffee — 480/500 EGP — 96% ⚠️ — 4 transactions
  - Gas — 200/300 EGP — 67% — 3 transactions
  - Groceries — 950/1000 EGP — 95% ⚠️ — 7 transactions
  - Eating Out — 350/400 EGP — 87% — 5 transactions
  - Transport — 120/200 EGP — 60% — 3 transactions

**Empty state (if a section has no items):**

- Centered illustration placeholder (simple outlined box is fine)
- Primary text explaining the purpose, e.g.: _"No monthly payments yet. Add things like rent or subscriptions to track them automatically."_
- A secondary CTA button: `+ Add Monthly Payment` or `+ Add Budget`
- Do NOT just render an "Add" button with no context

**5. Major Tab Content**

- Warning banner at top if major total exceeds 25% of monthly budget: _"Major expenses are high this month"_ — amber background, warning icon, no emoji
- List of major expense items, each showing: name, amount, date, payment method, % of monthly budget
- Amber indicator dot on items exceeding 10% of budget individually
- Mock data (3 items):
  - Laptop — 3,000 EGP — Apr 7 — Cash — 15% 🟡
  - Dentist — 800 EGP — Apr 10 — Card — 4%
  - Furniture — 2,000 EGP — Apr 15 — Card — 10% 🟡
- Use colored dots or icons only — no emoji in the actual UI
- Empty state: _"No major expenses this month. Record large one-time purchases like appliances or medical bills here."_ + `+ Add Major Expense`

**6. History Tab Content**

- Full transaction list, filterable
- Each item row: payment method icon (circular, colored) on left · amount + description stacked in center · date on right · **transaction type + category label below description** (e.g. `Monthly · Rent`, `Budget · Coffee`, `Major`, `Variable`)
- Amounts: red for expense, green for received
- **Filter** pill button in header only — no "View All"
- Filter opens a **bottom sheet** with these options: Type (All / Variable / Monthly / Budget / Major), Direction (All / Expense / Received), Payment Method (All / Cash / Card / Bank), Date Range (From / To). Bottom sheet has Clear All + Apply buttons. Filter button shows active count badge when filters are applied e.g. `Filter (2)`
- Mock data (6 items, mix of types):
  - -200 EGP · Market run · **Variable** · Fri 17/Apr · bag icon
  - -800 EGP · Internet bill · **Monthly · Internet** · Fri 17/Apr · card icon
  - +1200 EGP · Wire transfer · **Variable** · Fri 17/Apr · bank icon
  - -150 EGP · Coffee run · **Budget · Coffee** · Thu 16/Apr · bag icon
  - -3,000 EGP · Laptop · **Major** · Wed 15/Apr · card icon
  - +500 EGP · Freelance pay · **Variable** · Tue 14/Apr · bank icon
- Load more button at bottom of list
- **No FAB on History tab** — tab is read-only

**7. Floating Action Button (FAB)**

- Outlined circular `+` button, bottom trailing corner, floats above content
- When **Fixed tab** is active: tapping opens a bottom sheet that says "Add to Fixed" with two options: "Monthly Payment" and "Budget Transaction"
- When **Major tab** is active: tapping opens a bottom sheet that says "Add Major Expense"
- When **History tab** is active: FAB is hidden

**8. Bottom Navigation**

- Full-width bar: **Home · Tracker · Analytics · Settings** with icons
- Tracker tab is active/highlighted

---

**ASCII Wireframe**

```
+--------------------------------------------------+
|  Tracker                                         |
|--------------------------------------------------|
|                                                  |
|  +----------------------------------------------+|
|  | Overview                                     ||
|  | Budgeted       Paid          Remaining       ||
|  | 6,200 EGP    4,100 EGP     2,100 EGP        ||
|  | [======================>................. 66%]||
|  +----------------------------------------------+|
|                                                  |
|  [ Fixed          Major          History ]       |
|  [  ─────                                ]       |
|--------------------------------------------------|
|  (scrollable area below)                         |
|                                                  |
|  Monthly  (7)  3,955 EGP           [!]  [^]     |
|  +----------------------------------------------+|
|  | Phone Bill      300 EGP     [Overdue] Apr 10 ||  ← most urgent, always visible
|  +----------------------------------------------+|
|  | Rent          3,000 EGP       [Paid]  Apr 1  ||
|  | Spotify         100 EGP       [Paid]  Apr 5  ||
|  | Netflix          80 EGP       [Paid]  Apr 8  ||
|  | Internet        260 EGP    [Pending] Apr 21  ||
|  | Gym             200 EGP    [Pending] Apr 24  ||
|  | iCloud           15 EGP    [Pending] Apr 26  ||
|  +----------------------------------------------+|
|                                                  |
|  Budgets  (5)  2,100/2,400 EGP     [!]  [^]    |
|  +----------------------------------------------+|
|  | Coffee     480/500 EGP    96%  [!!]          ||  ← most urgent, always visible
|  | [====================>  ]  ▼ 4 transactions  ||
|  +----------------------------------------------+|
|  | Gas        200/300 EGP    67%                ||
|  | [=============>          ]  ▼ 3 transactions ||
|  | Groceries  950/1000 EGP   95% [!!]           ||
|  | [===================>    ]  ▼ 7 transactions ||
|  | Eating Out 350/400 EGP    87%                ||
|  | [=================>      ]  ▼ 5 transactions ||
|  | Transport  120/200 EGP    60%                ||
|  | [============>           ]  ▼ 3 transactions ||
|  +----------------------------------------------+|
|                                                  |
|                                           ( + )  |
|--------------------------------------------------|
|  [Home]    [Tracker]    [Analytics]  [Settings]  |
+--------------------------------------------------+


— MAJOR TAB ACTIVE —
+--------------------------------------------------+
|  +----------------------------------------------+|
|  | Overview  (pinned, same as above)            ||
|  +----------------------------------------------+|
|  [ Fixed          •Major•         History ]      |
|--------------------------------------------------|
|  ! Major expenses are high this month  (amber)   |
|                                                  |
|  +----------------------------------------------+|
|  | Laptop      3,000 EGP   Apr 7    Cash   •15% ||
|  +----------------------------------------------+|
|  | Dentist       800 EGP   Apr 10   Card     4% ||
|  +----------------------------------------------+|
|  | Furniture   2,000 EGP   Apr 15   Card   •10% ||
|  +----------------------------------------------+|
|                                           ( + )  |
|--------------------------------------------------|
|  [Home]    [Tracker]    [Analytics]  [Settings]  |
+--------------------------------------------------+


— FIXED TAB, SECTIONS COLLAPSED —
+--------------------------------------------------+
|  +----------------------------------------------+|
|  | Overview  (pinned)                           ||
|  +----------------------------------------------+|
|  [ •Fixed•         Major          History ]      |
|--------------------------------------------------|
|                                                  |
|  Monthly  (7)  3,955 EGP      [!RED]  [v]       |  ← red = overdue item exists
|  +----------------------------------------------+|
|  | Phone Bill      300 EGP     [Overdue] Apr 10 ||  ← 1 item always visible
|  +----------------------------------------------+|
|                                                  |
|  Budgets  (5)  2,100/2,400 EGP [!AMB]  [v]      |  ← amber = near limit items
|  +----------------------------------------------+|
|  | Coffee     480/500 EGP    96% [!!]            ||  ← 1 item always visible
|  | [====================>  ]                    ||
|  +----------------------------------------------+|
|                                                  |
|                                           ( + )  |
|--------------------------------------------------|
|  [Home]    [Tracker]    [Analytics]  [Settings]  |
+--------------------------------------------------+

— HISTORY TAB ACTIVE —
+--------------------------------------------------+
|  +----------------------------------------------+|
|  | Overview  (pinned)                           ||
|  +----------------------------------------------+|
|  [ Fixed          Major         •History• ]      |
|--------------------------------------------------|
|                                    [v Filter]    |
|                                                  |
|  +----------------------------------------------+|
|  | (bag)  -200 EGP               Fri, 17/Apr   ||
|  |        Market run · Variable                 ||
|  +----------------------------------------------+|
|  | (card) -800 EGP               Fri, 17/Apr   ||
|  |        Internet bill · Monthly · Internet    ||
|  +----------------------------------------------+|
|  | (bank) +1200 EGP              Fri, 17/Apr   ||
|  |        Wire transfer · Variable              ||
|  +----------------------------------------------+|
|  | (bag)  -150 EGP               Thu, 16/Apr   ||
|  |        Coffee run · Budget · Coffee          ||
|  +----------------------------------------------+|
|  | (card) -3,000 EGP             Wed, 15/Apr   ||
|  |        Laptop · Major                        ||
|  +----------------------------------------------+|
|  | (bank) +500 EGP               Tue, 14/Apr   ||
|  |        Freelance pay · Variable              ||
|  +----------------------------------------------+|
|  |              [ Load more ]                   ||
|  +----------------------------------------------+|
|                                                  |
|  (no FAB)                                        |
|--------------------------------------------------|
|  [Home]    [Tracker]    [Analytics]  [Settings]  |
+--------------------------------------------------+

— EMPTY STATE EXAMPLE —
+--------------------------------------------------+
|  Monthly  (0)                           [v]      |
|  +----------------------------------------------+|
|  |                                              ||
|  |          [  outlined placeholder  ]          ||
|  |                                              ||
|  |   No monthly payments yet.                  ||
|  |   Add things like rent or subscriptions     ||
|  |   to track them here.                       ||
|  |                                              ||
|  |        [ + Add Monthly Payment ]            ||
|  |                                              ||
|  +----------------------------------------------+|
+--------------------------------------------------+
```

---

**Rules**

- All styles via `className` (Tailwind) or CSS modules — no inline styles
- No real API calls — all data is hardcoded mock constants at the top of the file
- RTL awareness: use `start`/`end` directional classes instead of `left`/`right` where possible — this will port to React Native RTL later
- No emoji in rendered UI — use colored dots, icons, or badges only
- Section collapse is local component state only — no global state
- Transaction sub-list inside Budget cards is also collapsed by default (DL-025 equivalent)
- FAB behavior is tab-aware — hide or disable on History tab
- The pinned overview card and tab bar must not scroll with content

---

**Acceptance**

- [ ] Overview card stays pinned when scrolling Fixed tab content
- [ ] Tab switching renders correct content for Fixed / Major / History
- [ ] Monthly section: all 7 mock items render, section collapses to 1 (most urgent — Phone Bill overdue), section header shows red warning indicator
- [ ] Budgets section: all 5 buckets render, collapses to 1 (Coffee at 96%), section header shows amber warning indicator
- [ ] Budget cards have collapsed transaction sub-lists by default, expandable on tap
- [ ] Major tab: amber warning banner visible (total > 25%), 3 items render with colored dot indicators
- [ ] Each transaction row shows type + category label below description
- [ ] Filter button opens bottom sheet with Type / Direction / Payment Method / Date Range options + Clear All + Apply
- [ ] Filter button shows active count badge when filters are applied
- [ ] "View All" button does not appear anywhere on History tab
- [ ] FAB is hidden on History tab
- [ ] Empty state renders correctly with contextual explanation and CTA
- [ ] FAB pre-fills context based on active tab
- [ ] No inline styles, no emoji in UI, no API calls
