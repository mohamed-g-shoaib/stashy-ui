# Stashy — Visual Diagrams & Flows

## Diagram 1: Daily Rate Calculation System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DAILY SPENDING RATE SYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────┘

MONTH START (Jan 1)
    │
    ├─→ Monthly Budget: 10,000 EGP
    │
    ├─→ Fixed Expenses: 2,400 EGP
    │   ├─ Rent: 1,500 EGP
    │   ├─ Subscriptions: 600 EGP
    │   └─ Insurance: 300 EGP
    │
    ├─→ Base Variable Budget: 10,000 - 2,400 = 7,600 EGP
    │
    ├─→ Variable Received Income This Month:
    │   ├─ Jan 5: +500 EGP (bonus)
    │   ├─ Jan 10: +300 EGP (refund)
    │   └─ Total: +800 EGP
    │
    ├─→ Budget Injections This Month:
    │   ├─ Jan 12: +200 EGP (emergency top-up)
    │   └─ Total: +200 EGP
    │
    ├─→ Adjusted Variable Budget: 7,600 + 800 + 200 = 8,600 EGP
    │   └─ This is the ACTUAL total budget for the month (received income + injections)
    │
    └─→ BASE RATE: 7,600 ÷ 31 days = 245 EGP/day (CONSTANT)
        └─ This is your monthly plan baseline (immutable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAILY TRACKING (Example: Jan 7 morning, 25 days remaining)

┌─────────────────────────────────────┐
│  SCENARIO 1: ON BUDGET              │
│  (Previous day end: spent 1,500)     │
└─────────────────────────────────────┘

    Today's Rate (Jan 7) = (Effective Variable Budget - 1,500) ÷ 25 = 276 EGP/day
    
    Status: 🟢 ON TRACK
    Target for Jan 7: 276 EGP (reality-based)
    
    ✓ Variable spending today lowers Remaining Today
    ✓ Budget-state changes (income/major/fixed overspend) can recalculate Today's Rate
    ✓ Day boundary updates also recalculate rates
    ✓ Higher than base rate due to received income

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────┐
│  SCENARIO 2: OVERSPENT TODAY                    │
│  (Jan 7: spent 300 EGP, rate was 276 EGP)       │
└─────────────────────────────────────────────────┘

    Today's Rate (Jan 7) = 276 EGP/day (UNCHANGED by variable spending today)
    Spent Today = 300 EGP
    Overspent = 24 EGP
    
    Status: 🔴 OVER BUDGET
    Remaining for Jan 7: -24 EGP (negative)
    
    ✓ Today's rate stays 276 EGP (your target)
    ✓ "Tomorrow's Rate Impact" card appears (if not in emergency mode)
    ✓ Shows tomorrow's rate: (8,400 - 1,800) ÷ 24 = 275 EGP/day
    ✓ Rate drop: 276 - 275 = 1 EGP lower
    ✓ Motivates staying on track tomorrow

    If you spend 50 more EGP at 3 PM (total 350):
        Today's Rate = 276 EGP/day (STILL UNCHANGED by variable spending today)
        Overspent = 74 EGP
        Tomorrow's rate recalculates: lower due to more overspending
        └─ Card updates to show new tomorrow's rate impact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY DIFFERENCE: How Received Income Affects Daily Rate

SCENARIO A: No Received Income
    Base Budget: 7,600 EGP ÷ 31 days = 245 EGP/day

SCENARIO B: Received 500 EGP on Jan 5 (with 26 days left)
    Adjusted Budget: 8,100 EGP
    Impact: +19 EGP/day for remaining 26 days
    ✓ Entire 500 EGP spread across remaining month
    ✓ Increases daily rate permanently
    ✓ Not just "off the budget today"
```

---

## Diagram 2: Fixed vs Variable Expense Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRANSACTION TYPE ROUTING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

ADD TRANSACTION PAGE
    │
    ├─ Type: VARIABLE
    │  │
    │  ├─→ Expense (Amount: 50 EGP)
    │  │   ├─→ Add to total variable spent
    │  │   ├─→ Dashboard: "Spent Today" increases ↑
    │  │   └─→ Daily Rate DECREASES ↓ (less budget left)
    │  │
    │  └─→ Received (Amount: 200 EGP)
    │      ├─→ Add to total variable received
    │      ├─→ Adjusted Variable Budget INCREASES ↑ (for entire month)
    │      ├─→ Dashboard: Daily Rate INCREASES ↑ (more budget for remaining days)
    │      └─→ Remaining Today increases ↑ (can spend more today and beyond)
    │
    ├─ Type: FIXED
    │  │
    │  ├─→ Category: "Coffee" (Budget: 500 EGP)
    │  │   │
    │  │   ├─→ Expense (Amount: 50 EGP)
    │  │   │   └─→ Tracking Page: Coffee progress bar 10% (50/500)
    │  │   │
    │  │   └─→ Received (Refund: 50 EGP)
    │  │       └─→ Tracking Page: Coffee progress bar decreases
    │  │           (Refunds are netted against fixed expenses for the month)
    │  │
    │  └─→ Category: "Spotify" (Budget: 100 EGP, Auto-Pay on 5th)
    │      └─→ Auto-inserted if date passed
    │          └─→ Tracking Page: Spotify shows "Paid" ✓
    │
    └─ Type: MAJOR
       │
       ├─→ Direction: ALWAYS "expense" (no received option)
       │
         ├─→ Confirmation Dialog (current month only, before recording):
       │   ├─ Calculate current daily rate: 200 EGP/day
       │   ├─ Calculate projected daily rate: 150 EGP/day (after 3,000 EGP purchase)
       │   ├─ Show impact: "Daily Rate: 200 → 150 EGP (-50 EGP/day)"
       │   ├─ Show remaining: "Remaining Today: 200 → 150 EGP"
         │   └─ User must confirm to proceed (past-month major entries skip this dialog)
       │
       └─→ Expense (Amount: 3,000 EGP - e.g., laptop)
           ├─→ Reduce Effective Variable Budget by 3,000 EGP
           │   (Same pattern as Fixed overspend reduction)
           ├─→ Dashboard: Daily Rate DECREASES ↓ (immediately, for all remaining days)
           ├─→ Dashboard: "Remaining Today" DECREASES ↓ (uses new lower rate)
           ├─→ Dashboard: "Major Expenses" card appears/updates
           │   ├─ Shows total: 3,000 EGP
           │   ├─ Shows percentage: 15% of budget
           │   ├─ Shows count: 1 transaction
           │   └─ Shows warning if > 25% of budget
           ├─→ Dashboard: Payment Method Totals INCREASE ↑ (major included)
           ├─→ History Page: Transaction shows amber "major" badge
           └─→ "Spent Today" UNCHANGED (major expenses excluded from daily tracking)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VARIABLE RECEIVED INCOME IMPACT

User adds: +300 EGP variable received (e.g., refund)
    ↓
Total Variable Received increases by 300 EGP
    ↓
Adjusted Variable Budget = Base Budget + Total Received + Total Budget Injections
    ↓ (increases by 300 EGP)
    ↓
Base Daily Rate stays plan-based: Base Variable Budget ÷ Days in Month
    ↓ (unchanged within month)
    ↓
Current Daily Rate increases for remaining days
    ↓
User has MORE to spend for rest of month
    ↓
Result: +300 EGP spread across remaining days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPACT ON DASHBOARD

Variable Transactions
    ├─ Expense:
    │   └─ IMMEDIATELY affects:
    │       ├─ Total Variable Spent
    │       ├─ Remaining Variable Budget (DECREASES)
    │       ├─ Remaining Today
    │       ├─ Tomorrow's Rate (if overspending)
    │       └─ Overall Budget Progress
    │       Note: Variable spending today affects Remaining Today; Today's Rate is reality-based from current budget state.
    │
    └─ Received:
        └─ IMMEDIATELY affects:
            ├─ Total Variable Received
            ├─ Adjusted Variable Budget (INCREASES)
            ├─ Remaining Variable Budget (INCREASES)
            ├─ Remaining Today
            ├─ Tomorrow's Rate (recalculates)
            └─ Overall Budget Progress
            Note: Today's Rate can update when budget-state inputs change.

Fixed Transactions
    └─→ Tracked separately on:
        ├─ Tracking Page (detailed)
        ├─ Fixed Expenses Page (inline)
        └─ Dashboard Mini-Card (quick view)
```IMPACT ON DASHBOARD

Variable Transactions
    └─→ IMMEDIATELY affect:
        ├─ Spent Today
        ├─ Current Daily Rate
        ├─ Remaining Today
        └─ Overall Budget Progress

Fixed Transactions
    └─→ Tracked separately on:
        ├─ Tracking Page (detailed)
        ├─ Fixed Expenses Page (inline)
        └─ Dashboard Mini-Card (quick view)
```

---

## Diagram 3: User Authentication & Data Isolation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 1. SIGNUP / LOGIN                                            │
└──────────────────────────────────────────────────────────────┘

User opens app
    │
User opens app
    │
    ├─→ Client-Side Check: Is user authenticated?
    │   │
    │   ├─ YES: Render dashboard
    │   │
    │   └─ NO: Redirect to login
    │
    ├─→ User enters email + password
    │
    ├─→ Submit to Auth Provider
    │   │
    │   ├─→ Signup:
    │   │   ├─ Check: Email exists?
    │   │   ├─ Hash password securely
    │   │   ├─ Create user record
    │   │   └─ Send verification email
    │   │
    │   └─→ Login:
    │       ├─ Check: Email registered?
    │       ├─ Compare password hash
    │       ├─ Issue ID token
    │       └─ Token sent to client
    │
    └─→ User verified → Redirect to dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────────────────────────┐
│ 2. DATA ISOLATION (user_id Scoping)                         │
└──────────────────────────────────────────────────────────────┘

All Database Tables have: user_id column (FK → users)

Query Example:
    User A: SELECT * FROM transactions
    │
    └─→ API scopes query:
        WHERE user_id = 'A'
        │
        └─→ Returns ONLY A's transactions

    User B: SELECT * FROM transactions
    │
    └─→ API scopes query:
        WHERE user_id = 'B'
        │
        └─→ Returns ONLY B's transactions

    User A tries: DELETE FROM transactions WHERE id = B's_transaction
    │
    └─→ Data scoping blocks: user_id mismatch
        Access DENIED ❌

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────────────────────────┐
│ 3. REQUEST LIFECYCLE                                         │
└──────────────────────────────────────────────────────────────┘

User Action (e.g., Add Transaction)
    │
User Action (e.g., Add Transaction)
    │
    └─→ [Client Request]
        └─ Send Authorization: Bearer <firebase_id_token>
    │
    └─→ [Server Auth Dependency]
        ├─ get_current_user() verifies Firebase ID token
        ├─ verify_firebase_token() validates claims
        └─ Extract user_id from verified token uid claim
    │
    └─→ [Client Component]
        ├─ Collect form data (amount, description, etc.)
        └─ Prepare insert: { amount, description, user_id, ... }
    │
    └─→ [API Insert]
        ├─ POST /transactions { user_id, ... }
        └─ Success: Transaction saved with user_id
    │
    └─→ [Dashboard Refresh]
        ├─ Query: WHERE user_id = <verified_user_id>
        └─ Display: Updated rates, balances, history
```

---

## Diagram 4: Fixed Expense Tracking Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   FIXED EXPENSE DUAL-TRACKING SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────────┘

SETUP PHASE
    │
    ├─ Open "Fixed Expenses" page
    │  │
    │  ├─→ Add Fixed Expense
    │  │   ├─ Name: "Coffee"
    │  │   ├─ Budget: 500 EGP/month
    │  │   ├─ Type: manual
    │  │   └─ Payment Method: none
    │  │
    │  └─→ Add Fixed Expense
    │      ├─ Name: "Spotify"
    │      ├─ Budget: 100 EGP/month
    │      ├─ Type: recurring
    │      ├─ Payment Method: Visa
    │      └─ start_date day: 5
    │
    └─→ Fixed Expenses Table:
        ├─ Coffee: 500 EGP, manual
        └─ Spotify: 100 EGP, recurring (due-day from start_date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRACKING PHASE
    │
    ├─ Open "Tracking" page
    │  │
    │  ├─→ Summary Card (across all fixed expenses)
    │  │   ├─ Total Budgeted: 600 EGP
    │  │   ├─ Total Paid: 480 EGP
    │  │   ├─ Total Remaining: 120 EGP
    │  │   └─ Progress: ████░░ 80% (yellow warning)
    │  │
    │  ├─→ Coffee Card
    │  │   ├─ Budget: 500 EGP
    │  │   ├─ Paid: 480 EGP
    │  │   ├─ Remaining: 20 EGP
    │  │   ├─ Progress: ███████░ 96%
    │  │   ├─ Status: ⚡ 20 EGP remaining
    │  │   └─ Transactions: 10 (50+50+60+...) ← Multiple payments tracked!
    │  │
    │  └─→ Spotify Card
    │      ├─ Budget: 100 EGP
    │      ├─ Paid: 100 EGP
    │      ├─ Remaining: 0 EGP
    │      ├─ Progress: ████████░ 100%
    │      ├─ Status: ✓ Budget fully spent
    │      └─ Next Due: Jan 5 (marked as Paid)
    │
    └─→ Color Coding:
        ├─ Green (< 90%): On track
        ├─ Yellow (90-100%): Warning
        └─ Red (> 100%): Over budget

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUTO-PAY MECHANISM
    │
    ├─ Mobile dashboard mount triggers POST /api/v1/fixed-expenses/catch-up
    │  │
    │  └─→ Server Auto-Pay Catch-Up runs:
    │      ├─ Derive due date from start_date for evaluated month
    │      ├─ Check: Is there a current-month fixed transaction for Spotify?
    │      ├─ If NO and due date <= today: Insert auto-payment transaction
    │      │  └─ Spotify | 100 EGP | Expense | Jan 5
    │      └─ If YES: Return existing (idempotent)
    │
    └─→ Tracking Page updates:
        └─ Spotify shows: ✓ Paid (Jan 5)

PAY-NOW MECHANISM
    │
    ├─ User taps "Pay now" on recurring/installment fixed expense
    │  │
    │  └─→ POST /api/v1/fixed-expenses/{id}/pay-now
    │      ├─ Reject manual expenses
    │      ├─ Reject completed installments
    │      └─ Create-or-return current-month transaction via deterministic client_id
    │
    └─→ Repeat tap in same month returns the same transaction (no duplicate insert)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANALYSIS PHASE
    │
    └─ Review spending patterns:
       ├─ Coffee: 96% spent → Adjust budget next month?
       ├─ Spotify: 100% spent → On schedule
       └─ Decision: Increase/decrease budgets based on actuals
```

---

## Diagram 5: Database Query Scoping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DATA SCOPING & QUERY FILTERING ARCHITECTURE             │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO: User A tries to fetch transactions

Frontend Code:
    // API call to fetch transactions
    const response = await api.get('/transactions')

Behind the scenes (API Layer):
    └─→ Step 1: Extract user_id from verified token
        user_id = 'A'
    │
    └─→ Step 2: Apply data scoping
        WHERE user_id = 'A'
    │
    └─→ Step 3: Execute filtered query
        SELECT * FROM transactions
        WHERE user_id = 'A'
    │
    └─→ Step 4: Return only A's transactions
        ✓ A's transaction 1
        ✓ A's transaction 2
        ✓ A's transaction 3
        ✗ B's transaction (blocked by data scoping)
        ✗ C's transaction (blocked by data scoping)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCHEMA: All tables follow this pattern

Table: transactions
├─ id (UUID, PK)
├─ amount (DECIMAL)
├─ description (TEXT)
├─ user_id (UUID, FK → users) ← CRITICAL FOR DATA SCOPING
├─ created_at (TIMESTAMP)
└─ Data Scoping Policy:
   └─ "Users can manage their own transactions"
      ├─ ON transactions
      ├─ FOR ALL (SELECT, INSERT, UPDATE, DELETE)
      ├─ TO authenticated
      └─ WHERE user_id = <verified_user_id>

This pattern repeats for:
├─ payment_methods
├─ fixed_expenses
└─ settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT OPERATION

User A adds transaction: 50 EGP coffee

Frontend:
    // Get current user from auth state
    const user = getCurrentUser()
    
    // Insert via API
    await api.post('/transactions', {
        amount: 50,
        description: 'Coffee',
        expense_type: 'fixed',
        direction: 'expense',
        payment_method_id: 'xyz',
        fixed_expense_id: 'coffee_id',
        date: today
    })

API Layer:
    └─→ Extract user_id from verified token
        ├─ user_id matches authenticated user? YES ✓
        └─ Insert allowed
    │
    └─→ Transaction saved:
        ├─ id: generated UUID
        ├─ user_id: 'A' (inserted by client)
        ├─ amount: 50
        └─ ... other fields

Future queries for User A:
    └─→ Will see this transaction ✓
    └─→ User B will NOT see it ✓
```

---

## Diagram 6: Dashboard Data Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD RENDER DEPENDENCY TREE                       │
└─────────────────────────────────────────────────────────────────────────────┘

Dashboard Component Mount
    │
    ├─→ [Auth Check]
    │   └─ Get user_id from verified token
    │      └─ If no auth: Redirect to login
    │
    ├─→ [Parallel API Calls - all filtered by user_id]
    │   │
    │   ├─ Query 1: settings WHERE key = 'monthly_budget'
    │   │
    │   ├─ Query 2: payment_methods (all)
    │   │
    │   ├─ Query 3: fixed_expenses (all)
    │   │
    │   └─ Query 4: transactions WHERE date_month = current_month
    │
    ├─→ [Calculate Derived Values]
    │   │
    │   ├─ Fixed Total
    │   │  └─ SUM(fixed_expenses.amount)
    │   │
    │   ├─ Variable Budget
    │   │  └─ monthly_budget - fixed_total
    │   │
    │   ├─ Total Variable Received
    │   │  └─ SUM(transactions WHERE type = 'variable' AND direction = 'received')
    │   │
    │   ├─ Adjusted Variable Budget
    │   │  └─ variable_budget + total_variable_received + total_budget_injections
    │   │
    │   ├─ Major Expenses Total
    │   │  └─ SUM(transactions WHERE type = 'major' AND direction = 'expense')
    │   │
    │   ├─ Fixed Overspend Total
    │   │  └─ MAX(0, SUM(fixed_transactions) - fixed_total)
    │   │
    │   ├─ Effective Variable Budget
    │   │  └─ adjusted_variable_budget - fixed_overspend - major_expenses_total
    │   │     (Major expenses reduce budget same as fixed overspend)
    │   │
    │   ├─ Base Daily Rate
    │   │  └─ base_variable_budget ÷ days_in_month (plan-based, immutable)
    │   │
    │   ├─ Spent Today
    │   │  └─ SUM(transactions WHERE date = today AND type = 'variable' AND direction = 'expense')
    │   │     (Major expenses excluded from daily tracking)
    │   │
    │   ├─ Yesterday's Spending
    │   │  └─ SUM(transactions WHERE date = yesterday AND type = 'variable' AND direction = 'expense')
    │   │
    │   ├─ Current Daily Rate
    │   │  └─ IF spent_today > effective_variable_budget:
    │   │     └─ (effective_variable_budget - total_spent_including_today) ÷ days_remaining
    │   │     ELSE:
    │   │     └─ (effective_variable_budget - yesterday_spent) ÷ days_remaining
    │   │
    │   ├─ Remaining Today
    │   │  └─ current_daily_rate - spent_today
    │   │
    │   ├─ Fixed Budget Progress
    │   │  └─ SUM(transactions WHERE fixed_expense_id IS NOT NULL) ÷ fixed_total
    │   │
    │   ├─ Major Expenses Count
    │   │  └─ COUNT(transactions WHERE type = 'major' AND direction = 'expense')
    │   │
    │   ├─ Major Percentage
    │   │  └─ (major_expenses_total ÷ monthly_budget) × 100
    │   │
    │   └─ Payment Method Totals
    │      └─ GROUP BY payment_method_id
    │         ├─ Fixed: SUM(transactions WHERE type = 'fixed')
    │         ├─ Variable: SUM(transactions WHERE type = 'variable' AND direction = 'expense')
    │         │           - SUM(transactions WHERE type = 'variable' AND direction = 'received')
    │         ├─ Major: SUM(transactions WHERE type = 'major' AND direction = 'expense')
    │         │         (Always counted, regardless of toggles)
    │         └─ Total: Fixed + Variable + Major
    │
    └─→ [Render Components]
        │
        ├─ Hero Card: "Remaining Today"
        │  └─ Display: Remaining Today
        │     Status: 🟢 On Track / 🟡 Low / 🔴 Over Budget
        │
        ├─ Daily Rate Card: Base vs Current
        │  ├─ Base Rate: 245 EGP/day
        │  ├─ Current Rate: 244 EGP/day
        │  └─ Difference: -1 EGP (ahead by 1 EGP)
        │
        ├─ Emergency Mode (only if variable spending exceeds effective budget)
        │  ├─ Banner: "Over budget by X EGP"
        │  ├─ Goal: "Stop spending this month"
        │  └─ Inject Budget Funds action
        │
        ├─ Tomorrow's Rate Impact (only if overspending AND not in emergency mode)
        │  ├─ Shows tomorrow's adjusted rate
        │  └─ Hidden during emergency mode
        │
        ├─ Fixed Budget Card: Progress
        │  ├─ 480 EGP paid of 600 budgeted
        │  ├─ Progress Bar: 80%
        │  └─ Link: "View Details" → Tracking page
        │
        ├─ Major Expenses Card (shown when major_expenses_total > 0)
        │  ├─ **Clickable**: Links to /transactions?filter=major
        │  ├─ Hover Effects: Border highlight, shadow, cursor pointer
        │  ├─ Title: "Major Expenses"
        │  ├─ Count: "3 transactions • View history →"
        │  ├─ Percentage Badge: "25.0%" (amber)
        │  ├─ Inline Warning (if > 25%): "⚠️ Major expenses are high this month"
        │  ├─ Total: "5,000 EGP of 20,000 EGP budget"
        │  └─ Amber Progress Bar
        │
        └─ Payment Methods Card: Breakdown
           ├─ Cash: 150 EGP (Fixed) + 100 EGP (Variable) + 1,000 EGP (Major) = 1,250 EGP
           ├─ Card: 80 EGP (Fixed) + 200 EGP (Variable) + 2,000 EGP (Major) = 2,280 EGP
           └─ E-Wallet: 250 EGP (Fixed) + 50 EGP (Variable) + 2,000 EGP (Major) = 2,300 EGP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REFRESH TRIGGER

User returns to Dashboard
    │
    ├─→ onFocus listener triggers
    │   └─ Refetch all data
    │      └─ Recalculate all values
    │      └─ Update display
    │
    └─ OR manual refresh button clicked
       └─ Same refresh logic
```

---

## Diagram 7: Transaction History Filtering System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRANSACTION HISTORY FILTER SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────────┘

USER NAVIGATION PATHS
    │
    ├─→ PATH 1: Direct History Page Access
    │   ├─ Navigate to /transactions
    │   ├─ No URL parameter provided
    │   └─ Filter initializes to: "Spent Only" (Variable + Major)
    │
    ├─→ PATH 2: Dashboard Major Card Click
    │   ├─ Click Major Expenses card on Dashboard
    │   ├─ Navigate to /transactions?filter=major
    │   └─ Filter initializes to: "Major Only"
    │
    └─→ PATH 3: Manual URL Navigation
        ├─ User types /transactions?filter=variable
        ├─ Validate parameter against allowed filters
        └─ Filter initializes to: "Variable Only" (or default if invalid)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILTER OPTIONS & BEHAVIOR

┌────────────────────────────────────────────────────────────┐
│  Filter Dropdown (Select Component)                       │
├────────────────────────────────────────────────────────────┤
│  • Spent Only (default)    → Variable + Major            │
│  • All Transactions         → Regular + merged transfers   │
│  • Variable Only            → Variable only                │
│  • Fixed Only               → Fixed only                   │
│  • Major Only               → Major only                   │
│  • Transfers                → Merged transfer rows only    │
└────────────────────────────────────────────────────────────┘

⚠️ CRITICAL:
    - Transfer rows are included in All + Transfers
    - Transfer rows are excluded from Spent/Variable/Fixed/Major
    - Daily spent/received totals exclude transfer legs

Filter Selection
    ↓
Client-Side Filter Logic (optimized)
    ├─ Input: All transactions from cached data
    ├─ Build regularTransactions + mergedTransfers
    ├─ Apply selected filter
    └─ Output: filteredTransactions array
    ↓
Group by Date (optimized)
    ├─ Input: filteredTransactions
    └─ Output: { "2026-01-31": [txn1, txn2], "2026-01-30": [txn3] }
    ↓
Calculate Daily Totals
    ├─ For each date group
    ├─ Sum all expense amounts (direction='expense')
    └─ Display total per day
    ↓
Render UI
    ├─ Filter dropdown shows current selection
    ├─ Date groups display with daily totals
    ├─ Empty state if no transactions match filter
    └─ Filter-specific empty message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMPTY STATE MESSAGES

Filter: "Spent Only"    → "No Variable or Major transactions this month"
Filter: "All"           → "No transactions this month"
Filter: "Variable Only" → "No Variable transactions this month"
Filter: "Fixed Only"    → "No Fixed transactions this month"
Filter: "Major Only"    → "No Major transactions this month"
Filter: "Transfers"     → "No transfers this month"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL PARAMETER VALIDATION

URL: /transactions?filter=<param>
    ↓
Read searchParams.get('filter')
    ↓
Validate against: ['spent', 'all', 'variable', 'fixed', 'major', 'transfer']
    ├─ Valid: Use parameter value
    └─ Invalid: Fallback to 'spent'
    ↓
Initialize selectedFilter state
    ↓
Page reload → Reset to 'spent' (no persistence)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DASHBOARD MAJOR CARD INTEGRATION

Major Expenses Card
    ├─ Wrapped in: clickable card linking to transactions?filter=major
    ├─ Hover Effects:
    │  ├─ Border: hover:border-primary
    │  ├─ Shadow: hover:shadow-md
    │  └─ Cursor: cursor-pointer
    ├─ CardDescription:
    │  └─ "3 transactions • View history →"
    └─ Click Action:
       └─ Navigate to History page with Major filter active

User Experience:
    1. User sees Major Expenses card on Dashboard
    2. Hover → Visual feedback (border, shadow)
    3. Click → Navigate to /transactions?filter=major
    4. History page loads with "Major Only" filter pre-selected
    5. User sees all Major expense transactions
    6. Can manually change filter to other options
```

---

---

## Summary: System Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE SYSTEM INTERACTION MAP                          │
└─────────────────────────────────────────────────────────────────────────────┘

User
    │
    ├─→ Open App → Auth Check → Dashboard
    │
    ├─→ Add Transaction → Form → API Insert (+ user_id from token) → Scoping ✓
    │                      └─ Calculate new rates → Dashboard updates
    │
    ├─→ View Tracking → Fixed Expenses Query (+user_id) → Aggregate data
    │                   └─ Show progress bars, status
    │
    ├─→ Change Theme → Local storage + style variables → Instant update
    │
    └─→ Logout → Clear session → Redirect to login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECURITY LAYERS:
1. Client-side auth check (token validation)
2. API-layer data scoping (query filtering by user_id)
3. user_id in all inserts (data scoping)
4. Token-based auth state

PERFORMANCE OPTIMIZATION:
1. Parallel queries (dashboard loads all data at once)
2. Indexed user_id columns (fast filtering)
3. Client-side calculations (no heavy server processing)
4. Current month filtering (reduces dataset size)

USER EXPERIENCE:
1. Real-time rate updates (feel consequences of spending)
2. Instant feedback (dashboard reflects changes)
3. Persistent dark mode (local storage)
4. Native mobile app experience
```

---

**Last Updated:** March 4, 2026
**Version:** 2.0 (Stack-neutral — Core Logic & Business Rules)
