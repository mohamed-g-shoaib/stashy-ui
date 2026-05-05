# Fixed Tracker — UX Redesign Plan
**Target repo:** `stashy-ui` (mock/sandbox project)
**Scope:** Fixed tab of the Tracker page only. Major tab is untouched.
**Purpose:** Visual validation of UX decisions before implementation in the real mobile repo.
**Depth:** Medium — real component shapes, realistic mock data, meaningful states. No animations, no RTL implementation, no real API calls, no full edit logic.

---

## Agent Pre-Read Checklist

Before writing a single line of code, the agent must read:

1. `spec/DESIGN.md` — design system tokens, color rules, semantic surface classes
2. `spec/controlled-design-system.md` — governance rules, color layers, token-first policy
3. `lib/design-system-classes.ts` — available class helpers
4. `lib/semantic-styles.ts` — semantic surface mappings
5. `components/tracker/types.ts` — current tracker types (will be replaced)
6. `components/tracker/tracker-tab-bar.tsx` — tab structure (fixed tab is the only target)
7. `messages/en.json` — existing i18n keys under `Tracker` namespace
8. Any existing fixed-tab card or section components in `components/tracker/`

Do NOT infer component APIs from memory. Read the actual files.

---

## Background — What Changed and Why

The previous mock modelled the fixed tab with two sub-types:
- `monthlyPayment` — a fixed recurring charge
- `budgetTransaction` — a manual spending category

This is now replaced by the real backend model:

| Type | Mental Model | Who logs? | Frequency | Core question |
|---|---|---|---|---|
| `manual` | Budget envelope | User | Multiple times/month | How much have I consumed? |
| `recurring` | Subscription | System (auto) | Once/month (binary) | Was this charged yet? |
| `installment` | Loan / financed purchase | System (auto) | Once/month (binary) | How many months left? |

The tracker page fixed tab must now reflect this three-type model with a clear visual hierarchy, not a flat list.

---

## UX Decisions Locked In This Session

These are non-negotiable for this implementation:

1. **No tabs inside the fixed section.** Single scrollable page. Sections are separated by visual headers, not tab navigation.
2. **Three sections in order:** Subscriptions → Installments → Budgets. Each section only renders if the user has items of that type.
3. **Summary card at the top** covers all three types combined: total budgeted, total paid, total remaining, color-coded by health status.
4. **Summary card status logic:**
   - Green: paid% < 80% of budgeted (on track)
   - Amber: paid% between 80–100% (warning — spending close to limit, relevant for manual type)
   - Red: any expense is over_budget (overspent)
5. **Installments section has a mini-overview** above individual cards showing: combined monthly obligation, total paid across all months/all installments, total remaining across all installments.
6. **Tapping any card opens a detail sheet** (drawer). Cards themselves are status-at-a-glance only.
7. **Recurring and installment cards are binary** — paid or unpaid this month. No partial progress bar.
8. **Manual budget cards show a progress bar** — gradual fill from 0 to budget, with color states.
9. **Empty section states** must be handled — page adapts if a user has no items of a given type.

---

## Phase 1 — Data Types and Mock Data

### 1.1 Replace `types.ts`

Delete `MonthlyPayment`, `BudgetBucket`. Keep `MajorExpense` (major tab is untouched). Add:

```ts
// Fixed expense types matching the API model
export type FixedExpenseType = "manual" | "recurring" | "installment";
export type FixedExpenseStatus = "on_track" | "warning" | "over_budget";
export type PaymentStatus = "paid" | "unpaid"; // simplified for mock

export type FixedTransaction = {
  id: string;
  amount: number;
  direction: "expense" | "received";
  description: string | null;
  date: string; // display string e.g. "May 3"
  isAutoPayment: boolean;
};

export type FixedExpenseItem = {
  id: string;
  name: string;
  type: FixedExpenseType;
  budget: number;          // monthly amount
  paid: number;            // paid so far this month
  remaining: number;       // budget - paid
  progressPct: number;     // (paid / budget) * 100
  status: FixedExpenseStatus;
  // Recurring-specific
  nextPaymentDate: string | null;  // display string e.g. "May 15"
  // Installment-specific
  installmentsTotal: number | null;
  installmentsPaid: number | null;
  installmentsRemaining: number | null;
  endDate: string | null;  // display string e.g. "Dec 2026"
  isCompleted: boolean;
  // Transaction history (for detail sheet)
  transactions: FixedTransaction[];
};

export type FixedTrackerSummary = {
  totalBudgeted: number;
  totalPaid: number;
  totalRemaining: number;
  // Derived
  overallStatus: FixedExpenseStatus;
};

// Installment section mini-overview (computed from installment items)
export type InstallmentOverview = {
  monthlyObligation: number;  // sum of all installment budgets
  totalPaidAllTime: number;   // installmentsPaid * budget per item, summed
  totalRemainingAllTime: number; // installmentsRemaining * budget per item, summed
};
```

### 1.2 Create `data/fixed-tracker-mock.ts`

Create realistic mock data covering every meaningful state. Use these exact scenarios so all edge cases are visible in the mock:

**Subscriptions (recurring):**
- Netflix — 250 EGP — `paid` — was auto-charged May 3
- Spotify — 100 EGP — `unpaid` — due May 15 (upcoming, not yet fired)
- Adobe Creative Cloud — 899 EGP — `unpaid` — due May 28 (long name test)

**Installments:**
- Phone installment (iPhone) — 1,200 EGP/month — 4 of 12 paid — paid this month
- Laptop installment — 800 EGP/month — 11 of 12 paid — unpaid this month (almost done)
- Car downpayment plan — 3,500 EGP/month — 1 of 6 paid — paid this month

**Manual budgets:**
- Groceries — budget 2,000 EGP — paid 1,650 EGP — 82.5% (warning state)
- Coffee & Cafes — budget 500 EGP — paid 620 EGP — 124% (over budget)
- Gas & Transport — budget 800 EGP — paid 320 EGP — 40% (on track)
- Eating Out — budget 1,000 EGP — paid 0 EGP — 0% (untouched)

Each item should include 1–4 transactions in its `transactions` array for the detail sheet.

Also export a computed `FixedTrackerSummary` and `InstallmentOverview` derived from the mock items.

---

## Phase 2 — Summary Card

### Component: `components/tracker/fixed-summary-card.tsx`

Displays the aggregate health of all fixed expenses this month.

**Content to display:**
- "Fixed Budget" label
- Total budgeted amount (large, primary)
- Paid amount and remaining amount side by side (secondary)
- A progress bar or ring showing paid/budgeted ratio
- A color-coded status chip or border: green / amber / red

**Status color logic (use existing design system semantic tokens):**
- `on_track` → use `income`/success semantic color
- `warning` → use `warning` semantic color
- `over_budget` → use `expense`/critical semantic color

**Props:**
```ts
{ summary: FixedTrackerSummary }
```

**Notes for agent:**
- Use existing `elevatedPanelClass` or `surfacePanelClass` from `lib/design-system-classes.ts`
- Do not invent new color tokens — use what exists in the design system
- Amount formatting: follow the existing pattern in the codebase (check other cards for reference)

---

## Phase 3 — Section Components

### 3.1 Subscriptions Section

**Component: `components/tracker/sections/subscriptions-section.tsx`**

Section header: "Subscriptions" (i18n key: `Tracker.fixed.sections.subscriptions`)

Renders one `SubscriptionCard` per recurring item. Section is hidden entirely if no recurring items exist.

---

### 3.2 Installments Section

**Component: `components/tracker/sections/installments-section.tsx`**

Section header: "Installments" (i18n key: `Tracker.fixed.sections.installments`)

Structure:
1. `InstallmentOverviewRow` — mini-summary above the cards
2. One `InstallmentCard` per installment item

Section is hidden entirely if no installment items exist.

**InstallmentOverviewRow content:**
- Monthly obligation: "X EGP / month"
- Total paid across all installments all-time: "X EGP paid"
- Total remaining across all installments all-time: "X EGP left"
- Render as a compact horizontal row or small info strip, not a full card

---

### 3.3 Budgets Section

**Component: `components/tracker/sections/budgets-section.tsx`**

Section header: "Budgets" (i18n key: `Tracker.fixed.sections.budgets`)

Renders one `BudgetCard` per manual item. Section is hidden entirely if no manual items exist.

---

## Phase 4 — Individual Cards

All cards are tappable (onClick handler passed from parent — mock can log to console or toggle a state). They open the detail sheet. Cards are display-only — no inline actions except the tap.

### 4.1 `SubscriptionCard`

**Component: `components/tracker/cards/subscription-card.tsx`**

**Displays:**
- Name
- Amount (e.g., "250 EGP")
- Payment status pill: "Paid ✓" or "Due [date]"
  - If paid: use success/income semantic color
  - If unpaid and date upcoming: use quiet/neutral — not alarming
  - If unpaid and date has passed (overdue): use warning semantic color
- Payment method indicator (small, secondary — just a label like "Visa" or icon if available)

**What it does NOT show:**
- Progress bar (binary — paid or not)
- Transaction count

---

### 4.2 `InstallmentCard`

**Component: `components/tracker/cards/installment-card.tsx`**

**Displays:**
- Name
- Monthly amount (e.g., "1,200 EGP / month")
- Lifecycle progress: "4 of 12 months" — this is the primary progress indicator
- A progress bar showing installments_paid / installments_total (lifecycle, not monthly)
- End date: "Ends Dec 2026"
- This month's status: small "Paid" or "Due" indicator

**What it does NOT show:**
- The monthly progress bar from 0→budget (that's for manual only)

---

### 4.3 `BudgetCard`

**Component: `components/tracker/cards/budget-card.tsx`**

**Displays:**
- Name
- Spent amount vs budget: "1,650 / 2,000 EGP"
- Progress bar: fills gradually, color-coded by status
  - Green: < 80%
  - Amber: 80–100%
  - Red: > 100% (bar shows overflow or stays full + red)
- Remaining amount: "350 EGP left" (or "120 EGP over" if over_budget)
- Transaction count: "8 transactions" (tappable hint)

---

## Phase 5 — Detail Sheet (Drawer)

**Component: `components/tracker/fixed-detail-sheet.tsx`**

A single drawer component that renders different content based on the selected item's `type`.

**Trigger:** Passed `selectedItem: FixedExpenseItem | null`. Sheet opens when not null.

**All types share:**
- Header: item name + type badge ("Subscription" / "Installment" / "Budget")
- Monthly amount
- Transaction list: date, amount, direction (expense/received), auto-pay badge if `isAutoPayment`

**Recurring-specific additions:**
- Next payment date
- "Pay Now" button — renders but is non-functional in mock (disabled or console.log only)

**Installment-specific additions:**
- Lifecycle progress: X of Y months
- End date
- "Pay Now" button — same as above, non-functional in mock

**Manual-specific additions:**
- Progress bar + spent/remaining
- No "Pay Now" button

**Notes for agent:**
- Use the existing `Drawer` component from `components/ui/drawer` (already in the project)
- Keep the sheet simple — this is for layout validation, not full edit UX
- Edit functionality is explicitly out of scope for the mock. Show an "Edit" button if desired but it should be non-functional.

---

## Phase 6 — Wire Up the Fixed Tab

**File to update: the existing fixed tab content in the tracker page**

Replace the current fixed tab content (which renders `MonthlyPayment` and `BudgetBucket` lists) with:

```
<FixedSummaryCard summary={mockSummary} />
<SubscriptionsSection items={recurringItems} onCardTap={setSelectedItem} />
<InstallmentsSection items={installmentItems} onCardTap={setSelectedItem} />
<BudgetsSection items={manualItems} onCardTap={setSelectedItem} />
<FixedDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
```

State needed: `selectedItem: FixedExpenseItem | null` — local state in the fixed tab component.

---

## Phase 7 — i18n Keys

Add to `messages/en.json` under `Tracker.fixed`:

```json
"fixed": {
  "sections": {
    "subscriptions": "Subscriptions",
    "installments": "Installments",
    "budgets": "Budgets"
  },
  "status": {
    "paid": "Paid",
    "due": "Due {{date}}",
    "overdue": "Overdue"
  },
  "installmentProgress": "{{paid}} of {{total}} months",
  "endsDate": "Ends {{date}}",
  "monthlyObligation": "{{amount}} / month",
  "totalPaidAllTime": "{{amount}} paid",
  "totalRemainingAllTime": "{{amount}} left",
  "transactionCount": "{{count}} transactions",
  "remaining": "{{amount}} left",
  "over": "{{amount}} over",
  "payNow": "Pay Now",
  "edit": "Edit",
  "types": {
    "manual": "Budget",
    "recurring": "Subscription",
    "installment": "Installment"
  }
}
```

Add the same keys to `messages/ar.json` as placeholder English strings for now. RTL layout and Arabic copy are out of scope for the mock — flag with a `// TODO: RTL` comment on any layout that will need directional adjustment.

---

## Out of Scope for Mock — Handle in Real Mobile Repo

| Feature | Reason deferred |
|---|---|
| Pay Now action logic | Requires API call + idempotency — real repo only |
| Edit amount/name in drawer | Full form UX — real repo only |
| Arabic copy and RTL layout | Direction-aware spacing — real repo only |
| Animations / transitions | Rive + Reanimated — real repo only |
| Real API integration | Mock uses static data by design |
| Delete expense from tracker | Separate flow — real repo only |
| Catch-up mechanism feedback | System-level, not tracker UX |

---

## Definition of Done for Mock

The mock is complete when:

- [ ] All three section types render with the correct mock data
- [ ] Summary card shows correct totals and correct color state
- [ ] A user with only manual items sees only the Budgets section (no empty Subscriptions/Installments sections)
- [ ] A user with only recurring items sees only the Subscriptions section
- [ ] Tapping any card opens the detail sheet with that item's data
- [ ] The installment section shows the mini-overview row above the cards
- [ ] Budget cards show the correct color state (green/amber/red) based on progress
- [ ] Subscription cards distinguish between paid, upcoming, and overdue states
- [ ] Installment cards show lifecycle progress (X of Y months), not monthly progress
- [ ] Build passes: `pnpm typecheck` and `pnpm lint` both clean