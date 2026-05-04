# Stashy — Core Logic & Business Rules Documentation

Stack-agnostic reference for core calculations, transaction rules, and data flows.
(Current runtime: FastAPI + PostgreSQL + Firebase Auth + React Native mobile client.)

---

## 1. Core Logic: Daily Rate System

### Problem Statement

Users need a dynamic daily spending limit that:

- Preserves a stable monthly baseline target
- Immediately shows consequences when overspending
- Adapts daily as spending patterns change
- Correctly accounts for variable income by increasing the budget pool

### Solution: Dual Rate Model with Income Adjustment

```
MONTH START
    ↓
Fixed Total = Sum of all fixed expense budgets
Base Variable Budget = Monthly Budget - Fixed Total
    ↓
    ├─ Sum all variable received transactions for the month
    ├─ Sum all budget injection transactions for the month
    └─ Adjusted Variable Budget = Base Variable Budget + Total Variable Received + Total Budget Injections
    └─ Effective Variable Budget = Adjusted Variable Budget - Fixed Overspend (manual fixed budgets) - Major Expenses
BASE RATE (constant) = Base Variable Budget ÷ Days in Month
    ↓
DAILY TRACKING
    └─ Today's Rate = (Effective Variable Budget - Yesterday's Spending) ÷ Days Remaining
       (Reality-based target from current budget state)
       (Variable spend today reduces Remaining Today; budget-state changes can recalculate Today's Rate)
    ↓
OVERSPENDING ALERT
    └─ IF Today's Spending > Today's Rate (and NOT in emergency mode):
       Show Tomorrow's Rate Impact Card
       Tomorrow's Rate = Remaining Budget ÷ (Days Remaining - 1)
       Display rate drop to motivate staying on track

EMERGENCY MODE
    └─ IF Total Variable Spent > Effective Variable Budget:
       Show "Over budget by X EGP" banner + Budget Injection action
       Hide Tomorrow's Rate Impact card
```

### Example Flow with Received Income

```
Month: December (31 days), Today: Dec 7 (25 days remaining)
Monthly Budget: 10,000 EGP
Fixed Expenses: 2,400 EGP (Rent, Subscriptions)
Base Variable Budget: 7,600 EGP

Variable Received Income This Month:
  Dec 2: +500 EGP (bonus)
  Dec 5: +300 EGP (refund)
  ─────────────────────────────
  Total Received: +800 EGP

Adjusted Variable Budget = 7,600 + 800 = 8,400 EGP
BASE RATE = 7,600 ÷ 31 = 245 EGP/day (immutable monthly baseline)
CURRENT/TODAY'S RATE = (8,400 - Yesterday's Spending) ÷ Days Remaining
    → Current rate can be higher than base rate when received income increases budget

SCENARIO 2: Overspending (spent 1,800 by Dec 7 noon)
        → Remaining Today drops immediately as you spend more variable expenses today
    → Tomorrow's Impact updates to show the next-day consequence
```

Variable received income is **added to your total monthly budget**, not just used to offset that day's spending:

- This 500 EGP is distributed across all remaining days via the daily rate calculation
- If received on Jan 5 with 26 days remaining: adds ~19 EGP to daily rate for those 26 days
- Result: Higher daily spending limit, better budget flexibility

---

## 2. Transaction Architecture

### Type × Direction Matrix

| Type                       | Expense                                                                                                        | Received                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Variable**               | Reduces total variable spending, affects daily rate negatively                                                 | **Increases adjusted monthly budget**, affects daily rate positively        |
| **Budget Injection**       | Not used                                                                                                       | Increases adjusted monthly budget separately from variable income           |
| **Fixed**                  | Tracked separately in fixed budget progress                                                                    | Offsets fixed budget progress (netted against fixed expenses)               |
| **Transfer (paired legs)** | Source leg: `fixed + expense` reduces source remaining                                                         | Target leg: `variable/fixed + received` increases destination pool/category |
| **Major**                  | Immediately reduces effective variable budget (like Fixed overspend), lowers daily rate for all remaining days | Not allowed - Major is expense-only                                         |

**Important**: Variable received income is **added to your total monthly variable budget**, not just subtracted from today's spending. This increases your daily rate for all remaining days of the month.

### Variable Received Income Flow

```
User adds: +500 EGP variable received income
    ↓
Adjusted Variable Budget increases by 500 EGP
    ↓
Daily Rate recalculates using new, higher adjusted budget
    ↓
Daily spending limit increases for all remaining days
    ↓
Example: 500 EGP received on Dec 10 with 21 days left
    increases daily rate by ~24 EGP/day for those 21 days
```

### Transfer Transaction Flow

Transfers are created as a paired operation:

```
Transfer Flow
    ↓
Select source manual fixed category (remaining > 0)
    ↓
Select target:
   ├─ Variable Budget
   └─ Another manual fixed category
    ↓
Insert two linked rows (single multi-row insert):
   Leg A: fixed + expense  (source)
   Leg B: variable/fixed + received (target)
    ↓
Both rows share transfer_group_id and set is_transfer=true
    ↓
Refresh client-side state / data caches
```

**Date Handling**:

- Transfer `date` uses local `YYYY-MM-DD` (e.g., `getLocalDateString`) to avoid timezone-shift issues near midnight.

### Fixed Expense Dual Tracking

**Auto-Payments (Subscriptions)**

- Fixed date each month (e.g., Spotify on 5th)
- Auto-inserted if missed
- Toggle: "Paid" or "Pending" checklist on Tracking page

**Manual Buckets (Coffee, Gas)**

- Variable spending within fixed budget
- Multiple transactions per month (e.g., 10 coffee purchases)
- Progress bar: Actual vs Budgeted
- Fixed income (refunds) reduces actual for the month and increases remaining

```
Fixed Expense: Coffee
Budget: 500 EGP/month
    ↓
Transactions in Dec:
  Dec 2: 50 EGP
  Dec 5: 50 EGP
  Dec 8: 60 EGP
  ...
    ↓
Total Actual: 480 EGP
Progress: 96% (yellow status)
```

### Major Expense: Large, Infrequent Purchases

**When to Use Major vs Variable vs Fixed**

- **Variable**: Daily recurring expenses (groceries, coffee, gas) - tracked against daily rate
- **Fixed**: Predictable monthly commitments (rent, subscriptions) - tracked against category budgets
- **Major**: Large, infrequent purchases (laptop, furniture, medical bills) - immediately reduces daily rate

**Key Behavior**: Major expenses follow the **same pattern as Fixed overspend** - they reduce your effective variable budget immediately, lowering your daily rate for all remaining days.

```
Major Expense: Laptop Purchase
Amount: 3,000 EGP
Date: Jan 7
    ↓
Effective Variable Budget reduces by 3,000 EGP
    ↓
Daily Rate drops from 200 → 100 EGP/day
    ↓
Impact: Lower daily spending limit for all 30 remaining days
    ↓
Result: No overspend stress - you've acknowledged this large purchase
```

**Important Characteristics**:

- **Expense-only**: Major expenses cannot be recorded as income (direction is always 'expense')
- **Not in "Spent Today"**: Major expenses don't count toward your daily variable spending
- **Affects rate indirectly**: Reduces effective budget → lowers daily rate → reduces "Remaining Today"
- **Confirmation for current month only**: System shows rate impact before recording for current-month major entries; past-month entries are saved without this dialog
- **Counted in payment totals**: Major expenses appear in payment method totals (always visible)
- **Monthly scope**: Calculations reset each month (major expenses don't carry over)
- **Past-month warning bypass**: For past-month entries, major confirmation and fixed over-budget alerts are skipped because they don't affect today's rate

**Example Flow**:

```
Month: January (31 days), Today: Jan 7 (25 days remaining)
Monthly Budget: 20,000 EGP
Fixed Expenses: 5,000 EGP
Base Variable Budget: 15,000 EGP
Effective Variable Budget: 15,000 EGP (no fixed overspend)
BASE RATE = 15,000 ÷ 31 = 484 EGP/day

USER RECORDS: 5,000 EGP Laptop (Major Expense)
    ↓
Confirmation Dialog Shows:
    "Today's Rate: 484 → 323 EGP (-161 EGP/day)"
    "Remaining Today: 484 → 323 EGP"
    ↓
User Confirms → Transaction Recorded
    ↓
New Effective Variable Budget: 15,000 - 5,000 = 10,000 EGP
Base Rate: 484 EGP/day (unchanged)
Today's Rate: recalculated from reduced effective budget
    ↓
Dashboard Updates:
  - "Today's Rate" shows 323 EGP (reduced)
  - "Remaining Today" shows 323 EGP (reduced)
  - "Major Expenses" card shows: 5,000 EGP (25% of budget) - 1 transaction
    ↓
No overspend alert - you can spend up to 323 EGP today without penalty
```

**Major Expense Warning System**:

- When major expenses exceed **25% of monthly budget**, an inline warning appears in the Major Expenses card
- Warning text: "⚠️ Major expenses are high this month"
- Purpose: Prevents over-reliance on major expense categorization

**Dashboard Display**:

```
Major Expenses Card (shown when majorExpensesTotal > 0)
├─ Title: "Major Expenses"
├─ Count: "3 transactions"
├─ Badge: "25.0%" (percentage of monthly budget)
├─ Warning: "⚠️ Major expenses are high this month" (if > 25%)
├─ Total: "Total: 5,000 EGP"
├─ Context: "of 20,000 EGP budget"
└─ Progress bar: Amber-colored visual indicator
```

**Calculation Formula**:

```javascript
// Major Expenses Total: Sum all major expense transactions
majorExpensesTotal = SUM(transactions WHERE expense_type='major' AND direction='expense')

// Effective Variable Budget: Reduced by major expenses (same as fixed overspend)
effectiveVariableBudget = adjustedVariableBudget - fixedOverspendTotal - majorExpensesTotal

// Base rate stays plan-based and immutable within the month
baseDailyRate = baseVariableBudget ÷ daysInMonth

// Current/Today's rate uses reduced effective budget
todaysDailyRate = (effectiveVariableBudget - variableSpentUntilYesterday) ÷ daysRemaining
```

---

## 3. User Data Isolation (Multi-User Architecture)

### Authentication Flow

```
User authenticates with Firebase
    ↓
[Client receives Firebase ID token]
    ↓
[Protected API request]
    ├─ Authorization: Bearer <firebase_id_token>
    ├─ get_current_user() verifies token via verify_firebase_token()
    └─ Extract user_id from verified token uid claim
    ↓
All DB queries filtered by user_id
(WHERE user_id = <verified_user_id>)
```

### Data Isolation Strategy

All tables include a user_id foreign key. Every query is scoped by user_id
at the service layer. No user can access, modify, or delete another user's data.

---

## 4. Database Schema with User Scoping

```
users
├─ id (TEXT, PK, Firebase UID)
├─ username (VARCHAR(20), non-unique, indexed)
├─ email (VARCHAR)
├─ first_name, last_name, avatar_url (optional)
├─ created_at, updated_at (TIMESTAMP)
└─ API-level user_id scoping enforces per-user access

payment_methods
├─ id (UUID, PK)
├─ name (TEXT, unique)
├─ user_id (TEXT, FK → users.id)
└─ created_at (TIMESTAMP)

fixed_expenses
├─ id (UUID, PK)
├─ name, amount
├─ type ('manual' | 'recurring' | 'installment')
├─ start_date (DATE, nullable)
├─ end_date (DATE, nullable)
├─ user_id (TEXT, FK → users.id)
└─ created_at (TIMESTAMP)

transactions
├─ id (UUID, PK)
├─ date, amount, description
├─ payment_method_id (FK)
├─ expense_type ('fixed' | 'variable' | 'major' | 'budget_injection')
├─ direction ('expense' | 'received')
├─ fixed_expense_id (FK, links to fixed budget)
├─ is_transfer (BOOLEAN, default false)
├─ transfer_group_id (UUID, nullable)
├─ user_id (TEXT, FK → users.id)
└─ created_at (TIMESTAMP)

settings
├─ id (UUID, PK)
├─ key (TEXT, e.g., 'monthly_budget')
├─ value (TEXT)
├─ user_id (TEXT, FK → users.id)
└─ created_at (TIMESTAMP)
```

---

## 5. Dashboard Data Flow

```
User Opens Dashboard
    ↓
[API Auth Dependency]
    ├─ Mobile sends Authorization: Bearer <firebase_id_token>
    ├─ get_current_user() verifies token via verify_firebase_token()
    └─ Extract user_id from verified token
    ↓
[Parallel Queries - all filtered by user_id]
    ├─ Settings (monthly_budget)
    ├─ Payment Methods
    ├─ Fixed Expenses
    └─ Transactions (current month)
    ↓
[Calculate Derived Values]
    ├─ Adjusted Budget = (monthly_budget - fixed_total) + total_variable_received + total_budget_injections
    ├─ Major Expenses Total = SUM(transactions WHERE expense_type='major' AND direction='expense')
    ├─ Effective Variable Budget = Adjusted Budget - fixed_overspend - major_expenses_total
    ├─ Remaining Variable Budget = Effective Variable Budget - SUM(variable expenses this month)
    ├─ Base Daily Rate = Base Variable Budget ÷ days_in_month (plan-based, immutable)
    ├─ Days Remaining = days_from_today_to_month_end
    ├─ Spent Today = SUM(variable expenses today)
    ├─ Current Daily Rate = logic from Section 1
    ├─ Tomorrow Rate (if overspent today AND not emergency mode) = Remaining Budget ÷ (days_remaining - 1)
    ├─ Fixed Budget Progress = paid_to_date ÷ budgeted
    ├─ Major Expenses Count = COUNT(transactions WHERE expense_type='major' AND direction='expense')
    ├─ Major Percentage = (major_expenses_total ÷ monthly_budget) × 100
    └─ Payment Method Totals = aggregated by method (includes major expenses)
    ↓
[Render Dashboard]
    ├─ Card: Budget Overview (Monthly, Fixed Paid, Variable Remaining, Days Left)
    ├─ Card: Daily Spending
    │   ├─ Hero: "Remaining Today" (today_rate - spent_today) [text-4xl]
    │   ├─ Subtitle: "Target: XX.XX EGP" (shows today's fixed rate)
    │   └─ 3-Column Grid:
    │       ├─ Base Rate [text-sm]
    │       ├─ Today's Rate [text-2xl, highlighted, primary color]
    │       └─ Spent Today [text-sm]
    ├─ Card: Tomorrow's Rate Impact (shows only if spent_today > today_rate and not in emergency mode)
    │   ├─ Overspent amount warning
    │   ├─ Tomorrow's rate calculation
    │   └─ Rate drop indicator
    ├─ Banner: Emergency Mode (only if variable spending exceeds effective budget)
    │   ├─ "Over budget by X EGP" message
    │   └─ "Inject budget funds" action
    ├─ Card: Fixed Budget Progress bar
    ├─ Card: Major Expenses (shown when major_expenses_total > 0)
    │   ├─ Title + transaction count
    │   ├─ Percentage badge (amber-colored)
    │   ├─ Inline warning (if major_percentage > 25%)
    │   ├─ Total amount display
    │   └─ Amber progress bar
    └─ Card: Payment Method Breakdown (includes major expenses)
```

---

## 6. Add Transaction Flow

```
User Opens Add Page
    ↓
User Action (e.g., Add Transaction)
    │
    └─→ [Request Auth]
        ├─ Client sends Authorization: Bearer <firebase_id_token>
        ├─ API verifies token via get_current_user()
        └─ user_id extracted from verified token uid claim
    ↓
[Select Type: Variable, Fixed, or Major]
    ↓
    ├─→ VARIABLE:
    │   ├─ Amount, Payment Method, Direction
    │   ├─ Description (optional)
    │   └─ Date (default: today)
    │
    ├─→ FIXED:
    │   ├─ Amount, Payment Method, Direction
    │   ├─ Category Dropdown (lists user's fixed expenses)
    │   │   ├─ Selection auto-populates description
    │   │   └─ Stores fixed_expense_id in transaction
    │   └─ Date (default: today)
    │
    └─→ MAJOR:
        ├─ Amount, Payment Method
        ├─ Direction: ALWAYS 'expense' (hidden/forced)
        ├─ Description (optional)
        ├─ Date (default: today)
        └─ Confirmation Dialog (current month only):
            ├─ "Daily Rate: 200 → 150 EGP (-50 EGP/day)"
            ├─ "Remaining Today: 200 → 150 EGP"
            └─ Confirm/Cancel buttons (past-month major entries bypass this step)
    ↓
[Insert Transaction]
    ├─ Fields: amount, payment_method_id, type, direction, description, date, user_id ✨
    ├─ If fixed: also add fixed_expense_id
    ├─ If major: direction always = 'expense'
    └─ Redirect to Dashboard
    ↓
[Dashboard Updates]
    ├─ Current Daily Rate recalculates immediately (reduced if major expense added)
    ├─ Spent Today updates (variable expenses only - major excluded)
    ├─ Fixed Budget Progress updates (if fixed expense)
    ├─ Major Expenses Card appears/updates (if major expense)
    └─ Payment Method Totals update (includes major expenses)
```

---

## 7. Fixed Expense Tracking Workflow

```
Setup Phase
    └─ Go to Fixed Expenses page
       ├─ Add: "Coffee" = 500 EGP/month
       │  └─ Type = manual
       ├─ Add: "Spotify" = 100 EGP/month
       │  ├─ Type = recurring
       │  └─ Set start_date day = 5
       └─ Catch-up auto-inserts current-month payment when due date passed

Tracking Phase
    └─ Go to Tracking page
       ├─ Summary Card: 600 EGP budgeted, X paid, progress bar
       └─ Per-Category Cards:
          ├─ Coffee: 500 budgeted, 480 paid (96%) → Yellow
          │  └─ 4 transactions showing: 50, 50, 60, ...
          └─ Spotify: 100 budgeted, 100 paid (100%) → Green

Monitoring
    └─ Dashboard has mini-card showing fixed budget %
       └─ Clickable → Full Tracking page

Analysis
    └─ Identify overspent categories (red)
       └─ Adjust next month's budget
```

---

## 7.1. Auto-Pay Catch-Up System

**Purpose**: Automatically create current-month transactions for eligible recurring/installment fixed expenses based on `start_date` when the month is not already satisfied.

**Important Constraints**:

- `type` is immutable after creation (`manual`, `recurring`, `installment`).
- Catch-up runs only for `recurring` and non-completed `installment` expenses.
- Installments are considered completed when evaluated month is after `end_date`.
- Due date is derived from `start_date.day` and clamped to the evaluated month length.
- User-created fixed transactions are allowed only for `manual` fixed expenses. Recurring/installment monthly payments are system-controlled through catch-up and pay-now.
- Future-start recurring/installment expenses are not eligible for current-month catch-up or pay-now before their start month arrives.

### Execution Flow

```
Dashboard Mount (Mobile)
    ↓
[Mobile Trigger]
    └─ POST /api/v1/fixed-expenses/catch-up
    ↓
[API Auth]
    ├─ Authorization: Bearer <firebase_id_token>
    └─ get_current_user() verifies token and resolves user_id
    ↓
[Server Catch-Up Service]
    └─ run_catch_up(db, user_id)
    ↓
[Current-Month Context]
    ├─ Resolve user-local today from timezone settings
    ├─ Load active recurring/installment fixed expenses for user
    └─ Early return zero counters when no eligible expenses exist
    ↓
[Transaction Processing]
    ├─ Load current-month fixed transactions for those expenses
    └─ Build map by fixed_expense_id
    ↓
[Monthly Satisfaction Logic]
    └─ For each eligible expense:
        ├─ If current-month auto-payment transaction already exists:
        │  └─ Skip (month already satisfied by catch-up or pay-now)
       ├─ If expense start month is still in the FUTURE:
       │  └─ Skip (expense has not started yet)
        │
        └─ If no transaction exists:
            ├─ Due date in FUTURE → Skip (payment not due yet)
            └─ Due date in PAST/TODAY → Create current-month payment transaction
    ↓
[Database Operations]
    └─ Insert missed current-month payments (batch insert)
    ↓
[API Response]
    └─ { inserted_count, updated_count, deleted_count, inserted_names }
       └─ Mobile shows alert only when inserted_count > 0
```

### Idempotency Guarantees

- Safe to call repeatedly for the same user and month.
- New catch-up inserts use deterministic `client_id` generation with `uuid.uuid5(...)` based on fixed expense + year-month.
- Re-runs do not duplicate already-created rows and treat an existing current-month catch-up/pay-now row as already satisfied.

### Pay-Now Interaction

- `POST /api/v1/fixed-expenses/{expense_id}/pay-now` creates the same deterministic monthly payment identity used by catch-up.
- Pay-now stores the user's current business-local date as the transaction date so dashboard and tracker surfaces reflect the payment immediately.
- Pay-now is rejected before the expense start month.
- A later catch-up run for the same month sees the existing deterministic row and skips it.

### Edge Case Handling

**Scenario 1: Adding Recurring Expense with Past Due Date**

```
User adds expense: Spotify, 100 EGP, recurring, start_date = 2026-02-01
Today: Feb 3
    ↓
Mobile calls POST /api/v1/fixed-expenses/catch-up
    ↓
Catch-up runs → Finds derived due date (1) < today (3)
    ↓
Creates transaction on 2026-02-01
    ↓
Alert: "1 past recurring payment was auto-logged"
    ↓
Dashboard shows transaction in history, marked "Paid" in tracker
```

**Scenario 2: Editing Start Date Before First Linked Payment**

```
Existing: Netflix, recurring, start_date day = 1, no linked transactions yet
User edits: Change start_date day from 1 → 25
Today: Feb 3
    ↓
Mobile calls POST /api/v1/fixed-expenses/catch-up
    ↓
Catch-up runs → Evaluates new derived due date
    ↓
Derived due date (25) > today (3) = FUTURE
    ↓
Skips creation for this month
    ↓
Tracker shows "Pending", history stays clean
```

**Scenario 3: Installment Completion Handling**

```
Existing installment: 300 EGP, start_date=2026-01-05, end_date=2026-03-05
Evaluated month: April 2026
    ↓
Catch-up runs
    ↓
Expense is completed for evaluated month
    ↓
No new April transaction is inserted
    ↓
Expense remains visible in list/tracker with `is_completed = true`
```

---

---

## 9. Application Diagram

Stashy V2 runs as a FastAPI application served by Uvicorn in the API container. Data is stored in Neon PostgreSQL and accessed through SQLAlchemy async + asyncpg, with Alembic managing schema migrations. Protected endpoints use Firebase ID tokens, verified per request before user-scoped queries execute. The client is a React Native mobile app that calls `/api/v1` endpoints over HTTPS. Background jobs run in a separate scheduler container (`python -m app.scheduler`) using the same codebase and database.

---

## 10. State Management Strategy

```
Client-Side State
├─ Form inputs (amount, description, etc.)
├─ Modal visibility (settings)
├─ Loading states (during API calls)
└─ Controlled local view state (filters, drawers, and non-destructive UI preferences)

Server-Side State (Database)
├─ User settings (monthly budget, language and profile preferences)
├─ Payment methods
├─ Fixed expenses (manual/recurring/installment lifecycle)
├─ Transactions (categorized, dated)
└─ Auth sessions

Derived State (Calculated)
├─ Daily rates (base + current)
├─ Budget progress percentages
├─ Spending aggregations (per method, per category)
└─ Status indicators (on-track, low, over)

All queries filtered by: user_id = <verified_user_id>
```

---

## 11. Security Model

```
Layer 1: Client-Side Auth Check
    ↓
Check: authenticated?
├─ No: Redirect to login
└─ Yes: Render App Shell

Layer 2: Row-Level Data Scoping
    ↓
Each query includes: WHERE user_id = user_id from verified token
├─ User A can only see A's data
├─ User B can only see B's data
└─ Prevents cross-user data access

Layer 3: Data Scoping
    ↓
All INSERTS include: user_id: user.id
All UPDATES check: WHERE user_id = ...
All DELETES check: WHERE user_id = ...
```

---

## 12. Performance Considerations

| Aspect             | Strategy                                                  |
| ------------------ | --------------------------------------------------------- |
| **DB Queries**     | RLS filters + indexed user_id columns reduce dataset      |
| **Calculations**   | Client-side aggregation OK for <100 transactions/month    |
| **Dashboard Load** | Parallel queries + caching                                |
| **Fixed Budgets**  | Uses transaction aggregation (no separate tracking table) |
| **Current Month**  | Filter queries by date to reduce dataset                  |

---

---

---

## 15. Transaction History Filtering System

### Filter Options

```
History Page Filter Dropdown
├─ Spent Only (default): Variable + Major expenses
│  └─ Matches Dashboard "Spent Today" logic
├─ All Transactions: Regular rows + merged transfer rows
├─ Variable Only: Variable rows only
├─ Fixed Only: Fixed rows only
├─ Major Only: Major rows only
└─ Transfers: Merged transfer rows only

Notes:
- Transfer rows appear in `All Transactions` and `Transfers`
- Transfer rows are excluded from `Spent`, `Variable`, `Fixed`, and `Major`
- Daily spent/received totals exclude transfer legs
```

### URL Parameter Navigation

```
Dashboard Major Card Click
    ↓
Navigate to: /transactions?filter=major
    ↓
History page initializes with "Major Only" filter
    ↓
User can manually change filter
    ↓
Page reload resets to default "Spent Only"
```

**Implementation Details**:

- Client-side filtering for performance
- URL parameter validation: `validFilters.includes(param) ? param : 'spent'` (includes `transfer`)
- Filter algorithmic state manages merging paired transfer legs before filtering
- Daily totals recalculate from regular transactions only (`!is_transfer`)
- Empty states show filter-specific messages

**Filter Logic Flow** (Stack-Agnostic Pseudocode):

```javascript
const regularTransactions = transactions.filter((txn) => !txn.is_transfer);
const mergedTransfers = buildMergedTransfers(transactions);

function computeFilteredTransactions(selectedFilter) {
  if (selectedFilter === "transfer") return mergedTransfers;
  if (selectedFilter === "all")
    return [...regularTransactions, ...mergedTransfers];

  return regularTransactions.filter((txn) => {
    switch (selectedFilter) {
      case "spent":
        return (
          txn.direction === "expense" &&
          (txn.expense_type === "variable" || txn.expense_type === "major")
        );
      case "variable":
        return txn.expense_type === "variable";
      case "fixed":
        return txn.expense_type === "fixed";
      case "major":
        return txn.direction === "expense" && txn.expense_type === "major";
      default:
        return (
          txn.direction === "expense" &&
          (txn.expense_type === "variable" || txn.expense_type === "major")
        );
    }
  });
}
```

**Dashboard Integration**:

- Major Expenses card wrapped in `<Link href="/transactions?filter=major">`
- Hover effects: border highlight, shadow, cursor pointer
- CardDescription shows "View history" with ChevronRight icon
- Provides one-click access to filtered transaction view

---

**Last Updated:** March 4, 2026
**Status:** Core Logic & Business Rules — stack-neutral reference ✅
