# Stashy - Mobile API Contract and Flow Guide

> **Audience:** Mobile developers working on `stashy-mobile`.
> **Purpose:** Mobile-facing API contract plus flow notes that affect frontend integration.
> **Source of truth:** This document tracks the backend contract implemented in `stashy-api`, plus mobile-critical product decisions the app should enforce.
> **Last updated:** April 19, 2026

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [API Surface](#2-api-surface)
3. [Shared Logic References](#3-shared-logic-references)
4. [Dashboard](#4-dashboard)
5. [Transactions](#5-transactions)
6. [Fixed Expenses](#6-fixed-expenses)
7. [Fixed Tracker](#7-fixed-tracker)
8. [Payment Methods](#8-payment-methods)
9. [User Settings](#9-user-settings)
10. [User Profile](#10-user-profile)
11. [Analysis](#11-analysis)
12. [Monthly Snapshots](#12-monthly-snapshots)
13. [Offline Sync and Idempotency](#13-offline-sync-and-idempotency)
14. [Plan Gating](#14-plan-gating)
15. [Error Handling](#15-error-handling)
16. [Type Generation](#16-type-generation)
17. [System Status](#17-system-status)
18. [Mobile-Critical Decisions Summary](#18-mobile-critical-decisions-summary)
19. [RevenueCat Purchase Sync](#19-revenuecat-purchase-sync)

---

## 1. Authentication

Stashy uses **direct Firebase ID token verification** on every protected request. There is no backend-issued JWT.

Decision reference: `DL-014`

### Login endpoint

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "firebase_token": "eyJhbGciOiJSUzI1NiIs..."
}
```

Response `200`:

```json
{
  "user_id": "abc123FirebaseUID",
  "message": "ok"
}
```

Response `409` (email already belongs to another Firebase UID):

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "email_conflict"
}
```

Contract notes:

- This endpoint is unauthenticated.
- Rate limit: `20/minute` per IP.
- Mobile calls it after sign-in or sign-up so the backend can verify the token and upsert the user row.
- Do not call it on every app launch.
- If login returns `409` with `detail = "email_conflict"`, treat it as an account-linking conflict state and surface a clear user-facing error.

### Email/Password auth email verification contract

**Sign-up flow (mobile):**

1. Call `createUserWithEmailAndPassword(email, password)`.
2. Immediately call `sendEmailVerification()` on the returned user object.
3. Do not call `getIdToken()` and hit the backend yet; send the user to a check-your-inbox screen instead.
4. Only attempt backend login after the user verifies their email, or after app reopen once verification is complete.

**Login flow:**

- After `signInWithEmailAndPassword()`, call `getIdToken(true)` to force-refresh the token so the latest `email_verified` claim is present.
- If `POST /api/v1/auth/login` returns `403` with `detail = "Please verify your email before signing in."`, show a check-your-inbox state and offer resend via `sendEmailVerification()`.

**Password reset:**

- `sendPasswordResetEmail(email)` is handled entirely by Firebase; no backend call is required.

**Backend behavior:**

- `POST /api/v1/auth/login` returns `403` when `sign_in_provider == "password"` and `email_verified == false`.
- Google Sign-In and all other non-password providers are unaffected by this gate.

### Protected request rule

All protected endpoints require:

```http
Authorization: Bearer <firebase_id_token>
```

### Token lifecycle

- Firebase ID tokens expire about every 1 hour.
- Firebase SDK handles normal refresh silently.
- If the app returns from background after a long idle period, the first request may return `401`.
- Mobile should call `user.getIdToken(true)` on foreground or after a `401`, then retry once.

---

## 2. API Surface

**Base URL:** `{API_HOST}/api/v1`

All endpoints except `POST /auth/login`, `GET /health`, and `GET /system/status` require Firebase Bearer auth.

### Mobile endpoint map

| Method   | Path                                         | Auth | Purpose                                               |
| -------- | -------------------------------------------- | ---- | ----------------------------------------------------- |
| `POST`   | `/auth/login`                                | No   | Verify Firebase token and upsert user                 |
| `GET`    | `/system/status`                             | No   | App version and maintenance status                    |
| `POST`   | `/devices/register`                          | Yes  | Register or replace the caller's active push device   |
| `POST`   | `/notifications/send`                        | Yes  | Send notification to caller via stored device         |
| `GET`    | `/users/me`                                  | Yes  | Read current user profile                             |
| `PUT`    | `/users/me`                                  | Yes  | Update profile                                        |
| `GET`    | `/user-settings`                             | Yes  | Read settings                                         |
| `PUT`    | `/user-settings`                             | Yes  | Update settings                                       |
| `GET`    | `/payment-methods`                           | Yes  | List active payment methods                           |
| `POST`   | `/payment-methods`                           | Yes  | Create payment method                                 |
| `PUT`    | `/payment-methods/{id}`                      | Yes  | Update payment method                                 |
| `DELETE` | `/payment-methods/{id}`                      | Yes  | Delete payment method                                 |
| `GET`    | `/fixed-expenses`                            | Yes  | List active fixed expenses                            |
| `POST`   | `/fixed-expenses`                            | Yes  | Create fixed expense                                  |
| `PUT`    | `/fixed-expenses/{id}`                       | Yes  | Update fixed expense                                  |
| `DELETE` | `/fixed-expenses/{id}`                       | Yes  | Delete fixed expense with cascade flow                |
| `POST`   | `/fixed-expenses/catch-up`                   | Yes  | Run recurring auto-pay catch-up                       |
| `POST`   | `/fixed-expenses/{id}/pay-now`               | Yes  | Create or return current-month fixed payment          |
| `GET`    | `/fixed-tracker?today=YYYY-MM-DD`            | Yes  | Fixed expense tracking for requested day/month        |
| `POST`   | `/transactions`                              | Yes  | Create single transaction                             |
| `POST`   | `/transactions/sync`                         | Yes  | Batch sync offline transactions                       |
| `POST`   | `/transactions/transfer`                     | Yes  | Create transfer pair                                  |
| `DELETE` | `/transactions/transfer/{transfer_group_id}` | Yes  | Delete transfer pair                                  |
| `GET`    | `/transactions`                              | Yes  | Cursor-paginated history                              |
| `PUT`    | `/transactions/{id}`                         | Yes  | Partial update for editable current-month transaction |
| `DELETE` | `/transactions/{id}`                         | Yes  | Delete single non-transfer transaction                |
| `GET`    | `/dashboard?today=YYYY-MM-DD`                | Yes  | Dashboard snapshot                                    |
| `GET`    | `/analysis/current?today=YYYY-MM-DD`         | Yes  | Current month analysis                                |
| `POST`   | `/snapshots/close`                           | Yes  | Close one past month into snapshot                    |
| `GET`    | `/snapshots?limit=N`                         | Yes  | List snapshot history                                 |
| `GET`    | `/health`                                    | No   | Health check                                          |

Public endpoint rate-limit notes:

- `POST /auth/login` is limited to `20/minute` per IP.
- `GET /health` is explicitly exempt from SlowAPI rate limiting.
- `GET /system/status` is explicitly exempt from SlowAPI rate limiting.

### Notification contract updates

- `POST /devices/register` accepts `{ "fcm_token", "platform" }`.
- Re-registering for the same authenticated user overwrites the previous device.
- `POST /notifications/send` accepts `{ "title", "body" }` only.
- `device_token` is no longer accepted in `/notifications/send` bodies.
- If no device is registered, send returns success without dispatching.
- If Firebase marks the stored token unregistered, backend deletes it and returns success.

---

## 3. Shared Logic References

This file is **not** the full business-logic spec.

Use these shared docs for full budgeting formulas, narrative examples, and visual flows:

- `docs/Stashy_logics/Stashy_Documentation.md`
- `docs/Stashy_logics/Stashy_Flows.md`
- `docs/Stashy_logics/Mermaid_Diagrams.md`

This file keeps only the mobile-facing contract summary and the integration decisions the frontend must honor.

### Mobile-critical logic summary

- The core budgeting mechanic is daily-rate based.
- `fixed_total` reduces the variable budget pool.
- `variable received` and `budget_injection` increase the adjustable variable pool.
- `major` expenses and fixed overspend reduce `effective_variable_budget`.
- `major` expenses do **not** count toward `variable_spent_today`.
- `tomorrows_rate` is only shown when the user overspent today and is not in emergency mode.
- `today` is client-supplied for dashboard, fixed-tracker, and analysis.
- `dashboard`, `fixed-tracker`, and `analysis/current` validate `today` against the user's business-local current date resolved from `user_settings.timezone`, not against server-local `date.today()`.
- transactions write-path date checks (create/delete/transfer/sync) use the user's business-local current date for future-date and current-month decisions.
- fixed-expense delete/catch-up current-month windows and snapshot-close eligibility are evaluated against the user's business-local current date.

---

## 4. Dashboard

```http
GET /api/v1/dashboard?today=YYYY-MM-DD
```

Contract notes:

- `today` is required.
- The backend rejects future `today` values with `422`, using the user's configured timezone as the date boundary.
- If the user has no configured monthly budget, this endpoint returns `409`.

Response fields mobile commonly depends on:

- `monthly_budget`
- `fixed_total`
- `base_variable_budget`
- `adjusted_variable_budget`
- `effective_variable_budget`
- `fixed_overspend_total`
- `major_expenses_total`
- `major_expenses_count`
- `major_warning`
- `base_daily_rate`
- `todays_rate`
- `remaining_today`
- `tomorrows_rate`
- `variable_spent_today`
- `total_variable_spent`
- `is_emergency_mode`
- `fixed_budget_progress`
- `days_remaining`
- `days_in_month`
- `payment_method_totals[]`
- `today`

Important behavior:

- `tomorrows_rate` can be `null`.
- `payment_method_totals[]` may include soft-deleted payment methods via `is_deleted`.
- `major_warning` becomes `true` when major expenses are at least `25%` of `monthly_budget`.

When mobile should refresh dashboard data:

- after creating or deleting a transaction
- after updating a transaction
- after creating, updating, or deleting a fixed expense
- after running catch-up
- on app foreground
- on manual refresh

---

## 5. Transactions

### Type and direction rules

| `expense_type`     | Allowed directions    | Notes                                                                                            |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------ |
| `variable`         | `expense`, `received` | Variable received increases adjusted variable budget                                             |
| `fixed`            | `expense`, `received` | Requires `fixed_expense_id`; only `manual` fixed expenses accept user-created fixed transactions |
| `major`            | `expense` only        | Requires `description`                                                                           |
| `budget_injection` | `received` only       | Emergency top-up                                                                                 |

### Create transaction

```http
POST /api/v1/transactions
```

Required behavior:

- `client_id` is required and generated by mobile.
- `payment_method_id` is required.
- `fixed_expense_id` is required only for `fixed` transactions.
- If `fixed_expense_id` points to a `recurring` or `installment` fixed expense, backend rejects the request with `422`; those monthly payments are system-generated through catch-up or pay-now only.
- `description` is required for `major` transactions and optional otherwise.
- `amount` must be `> 0`.
- The backend rejects future dates with `422`, evaluated against the user's business-local current date.

Response behavior:

- `201` when a new row is created.
- `200` when the same `client_id` already exists for the same user.

### Major expense preview

Decision reference: `DL-010`

There is **no backend preview endpoint**.

When the user creates a current-month `major` expense for `date === today`, mobile should compute the preview client-side from cached dashboard data.

Preview rules:

- If `date` is today in the current month, show the rate-impact confirmation.
- If `date` is a past day in the current month, show a simple confirm.
- If `date` is in a past month, skip the preview dialog.

### Create transfer

```http
POST /api/v1/transactions/transfer
```

Contract notes:

- Creates two legs atomically.
- `client_id` is required and used to derive deterministic IDs for both legs.
- `source_fixed_expense_id` must be a **manual** fixed expense.
- `target` is either `"variable"` or another manual fixed expense ID.
- The backend requires the transfer date to be in the **user's current month** and not in the future (user-local timezone).

### Delete transfer

```http
DELETE /api/v1/transactions/transfer/{transfer_group_id}
```

Contract notes:

- Returns `204` on success.
- Deletes both legs atomically.
- Past-month transfers are sealed and cannot be deleted.

### Delete transaction

```http
DELETE /api/v1/transactions/{transaction_id}
```

Contract notes:

- Returns `204` on success.
- Transfer legs cannot be deleted through this endpoint.
- Only user-current-month, non-transfer transactions can be deleted.
- Past-month transactions are sealed history.

### Update transaction

```http
PUT /api/v1/transactions/{transaction_id}
```

Contract notes:

- Partial update.
- At least one field must be provided.
- Editable fields are only: `amount`, `description`, `payment_method_id`, `date`.
- `amount` must be `> 0` when provided.
- `description` is the only field that may be explicitly set to `null`.
- `description: null` is rejected for existing `major` transactions.
- Explicit `null` for `amount`, `payment_method_id`, and `date` is rejected.
- `payment_method_id` must be active and owned by the authenticated user.
- If `date` is provided, it must be in the user's current month and not in the future.
- The target transaction itself must already be in the user's current month (past-month transactions are sealed).
- Transfer transactions cannot be edited through this endpoint.
- Auto-pay transactions cannot be edited through this endpoint.

Locked/non-editable fields:

- `expense_type`
- `direction`
- `fixed_expense_id`
- `is_auto_payment`
- `is_transfer`
- `transfer_group_id`
- `client_id`

Response behavior:

- `200` on success with updated `TransactionResponse`.
- `404` if transaction is not found for the authenticated user.
- `422` for validation and business-rule failures.
- `TransactionResponse` includes nullable `updated_at` for last-modified metadata.

### Transaction history

```http
GET /api/v1/transactions?page_size=20&month=2026-04&expense_type=variable&direction=expense&include_transfers=false&cursor=<opaque>
```

Query parameters:

- `cursor: string | null`
- `page_size: 1..50`, default `20`
- `month: YYYY-MM | null`
- `expense_type: variable | fixed | major | budget_injection | null`
- `direction: expense | received | null`
- `include_transfers: boolean`, default `false`

Response shape:

```json
{
  "items": [],
  "next_cursor": "opaque-string-or-null"
}
```

Contract notes:

- `next_cursor === null` means no more pages.
- When showing merged transfers in mobile UI, pair legs by `transfer_group_id`.

---

## 6. Fixed Expenses

### List

```http
GET /api/v1/fixed-expenses
```

Returns only active, non-deleted fixed expenses.

### Create

```http
POST /api/v1/fixed-expenses
```

Validation rules:

| Field               | `manual`  | `recurring` | `installment`              |
| ------------------- | --------- | ----------- | -------------------------- |
| `type`              | Required  | Required    | Required                   |
| `payment_method_id` | Forbidden | Required    | Required                   |
| `start_date`        | Forbidden | Required    | Required                   |
| `end_date`          | Forbidden | Forbidden   | Required (`>= start_date`) |

Decision reference: `DL-008 Part 2`

Contract meaning:

- Recurring/installment fixed expenses are tied to one payment method.
- Manual fixed expenses are budget buckets that may have many manual transactions.
- Future-start recurring/installment expenses stay visible in fixed-expense lists, but they do not count in month-scoped fixed totals or tracker totals until their start month arrives.
- Legacy fields `is_auto_payment` and `day_of_month` are rejected with `422`.
- Free users with 3 or more active fixed expenses are denied with `403` and `code = PLAN_UPGRADE_REQUIRED`.
- The fixed-expense upgrade detail is: "Free plan is limited to 3 fixed expenses. Upgrade to Pro for unlimited."

### Update

```http
PUT /api/v1/fixed-expenses/{expense_id}
```

Contract notes:

- Partial update.
- `type` cannot be changed after creation.
- `start_date` change is rejected after linked transactions exist.
- `end_date` can be extended; shortening is rejected if it would move before latest linked transaction month.
- `is_auto_payment` and `day_of_month` are rejected legacy fields.

### Delete cascade flow

```http
DELETE /api/v1/fixed-expenses/{expense_id}
```

Decision reference: `DL-008 Part 1`

Request body:

```json
{
  "action": "move_to_variable"
}
```

`action` may be:

- omitted or `null` for step 1
- `move_to_variable`
- `hard_delete`

Step 2 precondition:

- `action` is valid only after step 1 has already soft-deleted the fixed expense and returned pending current-month manual transactions.
- Sending `action` on the first delete request is rejected with `422`.

Flow contract:

1. Backend soft-deletes the fixed expense.
2. Backend hard-deletes current-month auto-pay transactions for that expense.
3. Backend checks for current-month manual transactions.
4. If none exist, delete completes immediately.
5. If manual transactions exist, backend returns them and mobile must ask the user how to resolve them.

Pending response example:

```json
{
  "completed": false,
  "pending_transactions": [
    {
      "id": "uuid",
      "date": "2026-04-02",
      "amount": 50.0,
      "description": "Coffee beans"
    }
  ]
}
```

Second-step actions:

- `move_to_variable`: reclassify those manual fixed transactions as variable spending
- `hard_delete`: remove those manual transactions entirely

Past-month transactions are never touched.

### Auto-pay catch-up

```http
POST /api/v1/fixed-expenses/catch-up
```

Contract notes:

- Safe to call repeatedly.
- Works on active `recurring` and active `installment` fixed expenses for the user's current month (user-local timezone).
- Skips completed installments.
- Due date is derived from `start_date` day and month-clamped (e.g. day 31 in February).
- Inserts a missing current-month row only when the derived due date is on or before the user's current business-local date.
- If a current-month catch-up or pay-now row already exists for the deterministic monthly `client_id`, catch-up treats the month as already satisfied and does not delete or re-date that row.

Response shape:

```json
{
  "inserted_count": 1,
  "updated_count": 0,
  "deleted_count": 0,
  "inserted_names": ["Netflix"]
}
```

Additional field:

- `inserted_names` is always present and lists only the fixed-expense names inserted in the current catch-up run.
- When `inserted_count = 0`, `inserted_names` is an empty list.

Mobile flow note:

- If any count is non-zero, refresh dashboard and fixed-tracker data.

### Pay now

```http
POST /api/v1/fixed-expenses/{expense_id}/pay-now
```

Contract notes:

- No request body.
- Eligible only for `recurring` and non-completed `installment` expenses.
- Rejected with `422` if the current month is before the expense start month.
- Rejected for `manual` expenses with `422`.
- Rejected for completed installments with `422`.
- Idempotent for the same expense and month: first call creates, repeats return the same current-month transaction.
- The created transaction uses the user's current business-local date as the payment date so current-month paid totals reflect the early payment immediately.

---

## 7. Fixed Tracker

```http
GET /api/v1/fixed-tracker?today=YYYY-MM-DD
```

Contract notes:

- `today` is required.
- The backend rejects future `today` values with `422`, using the user's configured timezone as the date boundary.
- Returns fixed-expense tracking for the requested month context.

Key response fields:

- `items[]`
- `items[].id`
- `items[].name`
- `items[].budget`
- `items[].paid`
- `items[].remaining`
- `items[].progress_pct`
- `items[].status`
- `items[].type`
- `items[].start_date`
- `items[].end_date`
- `items[].is_completed`
- `items[].installments_total`
- `items[].installments_paid`
- `items[].installments_remaining`
- `items[].next_payment_date`
- `items[].transactions[]`
- `total_budgeted`
- `total_paid`
- `total_remaining`
- Expenses whose `start_date` month has not arrived yet are excluded from these totals, even though they may still appear in `items[]`.

Contract notes:

- `transactions[]` contains month transactions for that fixed expense.
- `payment_method_id` inside tracker transactions can be `null`.
- Completed installments remain visible in `items[]` but are excluded from active total budgeting surfaces.

---

## 8. Payment Methods

### List

```http
GET /api/v1/payment-methods
```

Returns only active, non-deleted payment methods.

### Create

```http
POST /api/v1/payment-methods
```

Contract notes:

- `name` must be non-blank after trimming.
- Active names must be unique per user.
- A deleted name can be reused.
- Free users with 2 or more active payment methods are denied with `403` and `code = PLAN_UPGRADE_REQUIRED`.
- The payment-method upgrade detail is: "Free plan is limited to 2 payment methods. Upgrade to Pro for unlimited."

### Update

```http
PUT /api/v1/payment-methods/{payment_method_id}
```

Contract notes:

- `name` can be changed.
- Setting `is_default: true` automatically unsets the previous default.
- `PaymentMethodResponse` includes nullable `updated_at` for last-modified metadata.

### Delete

```http
DELETE /api/v1/payment-methods/{payment_method_id}
```

Decision reference: `DL-007`

Response shape:

```json
{
  "deleted": true,
  "soft_deleted": false
}
```

Contract rules:

- Default payment methods cannot be deleted.
- If a method has transactions, backend soft-deletes it.
- If it has no transactions, backend hard-deletes it.
- Exactly one of `deleted` or `soft_deleted` is `true`.

Mobile handling for soft-deleted methods:

- hide them from selectors
- still show them in history if returned there
- if dashboard totals include them, use `is_deleted` to render the deleted state

---

## 9. User Settings

### Get settings

```http
GET /api/v1/user-settings
```

Fields mobile commonly depends on:

- `monthly_budget`
- `onboarding_completed`
- `currency`
- `timezone`
- `plan`

### Update settings

```http
PUT /api/v1/user-settings
```

Contract notes:

- Partial update.
- Only send fields to change.
- Explicit `null` values are rejected.
- `monthly_budget` must be `> 0`.
- `currency` must be one of `EGP`, `USD`, `EUR`, `GBP`, `SAR`, `AED`.
- `timezone` must be a valid IANA timezone identifier like `Africa/Cairo` or `America/New_York`.
- Timezone abbreviations and aliases without a region/city slash, such as `EST`, are rejected.
- `plan` is read-only from the client.

### Onboarding gate

Current backend behavior:

- If `monthly_budget <= 0`, dashboard and analysis return `409`.
- Mobile should route the user to onboarding in that state.
- `onboarding_completed` is still useful for frontend state, but it is not the backend gate for those endpoints.

---

## 10. User Profile

### Get profile

```http
GET /api/v1/users/me
```

### Update profile

```http
PUT /api/v1/users/me
```

Contract notes:

- Partial update.
- `username` must not be blank.
- `username` max length is `20`.

---

## 11. Analysis

```http
GET /api/v1/analysis/current?today=YYYY-MM-DD
```

Decision reference: `DL-011`

Contract notes:

- Mobile should treat this as a Pro-gated endpoint.
- `today` is required.
- Free-plan users always receive `403` with `code = PLAN_UPGRADE_REQUIRED` and detail: "Analysis is a Pro feature. Upgrade to access current-month analysis."
- For Pro users, if monthly budget is not configured, backend returns `409`.
- The free-plan gate runs before onboarding or budget checks.
- If `today` is later than the user's business-local current date, backend returns `422` with `detail = "today cannot be in the future"`.

Response areas mobile commonly uses:

- `month`
- `days_elapsed`
- `month_progress_pct`
- `pacing.variable_budget_used_pct`
- `pacing.pacing_delta_pct`
- `projection.avg_daily_spend_so_far`
- `projection.projected_end_spend`
- `projection.projected_savings_amount`
- `projection.projected_savings_rate`
- `variable_savings_rate_mtd`
- `overspent_days_mtd`
- `mom_comparison.available`
- `mom_comparison.prev_month`
- `mom_comparison.savings_rate_delta`
- `mom_comparison.base_rate_delta`
- `mom_comparison.base_rate_change_reason`
- `mom_comparison.major_expense_burden_delta`

Interpretation notes:

- positive `pacing_delta_pct` means overpaced spending
- negative `pacing_delta_pct` means underpaced spending
- `mom_comparison.available === false` means no snapshot exists for comparison

---

## 12. Monthly Snapshots

### Close a month

```http
POST /api/v1/snapshots/close
```

Request:

```json
{
  "month": "2026-03",
  "closed_by": "user"
}
```

Contract notes:

- `month` must be a past month in `YYYY-MM` format, relative to the user's business-local current month.
- `closed_by` is `user` or `skipped`.
- If the month is already closed, backend returns the existing snapshot with `200`.
- If the user has no configured monthly budget, backend returns `409`.

### List snapshots

```http
GET /api/v1/snapshots?limit=6
```

Contract notes:

- default limit is `6`
- larger values are capped to `12` server-side
- newest first

---

## 13. Offline Sync and Idempotency

### `client_id`

Every create flow from mobile must generate a UUID `client_id`.

Used by:

- `POST /transactions`
- `POST /transactions/transfer`
- `POST /transactions/sync`

Contract meaning:

- duplicate retries for the same user should return the existing row instead of creating duplicates

### Batch sync

```http
POST /api/v1/transactions/sync
```

Response example:

```json
{
  "results": [
    {
      "client_id": "uuid-1",
      "status": "created",
      "transaction_id": "uuid-server-generated",
      "error_detail": null
    },
    {
      "client_id": "uuid-2",
      "status": "duplicate",
      "transaction_id": "uuid-already-existed",
      "error_detail": null
    }
  ]
}
```

Status values:

- `created`
- `duplicate`
- `error`

Contract notes:

- max `30` items per batch
- per-item errors are returned in `error_detail`
- transfer items are not allowed in sync; transfers must use `POST /transactions/transfer`
- Mobile must enforce a local queue cap of 30 unsynced items and block recording a new transaction when the cap is reached (offline state). This is a product integrity boundary — a queue of 30+ means the daily rate is stale by 3+ days.
- Mobile must surface sync status visibly: in-progress indicator, success confirmation, and failure state with a manual retry trigger. Silent sync failure leaves the user with a stale daily rate and no indication why.
- When online, new transactions always go through POST /transactions directly — the sync queue is offline-only and never involved during online usage.

### Cursor pagination

History uses cursor pagination, not offset pagination.

Pattern:

```text
1. GET /transactions?page_size=20
2. GET /transactions?page_size=20&cursor=X
3. GET /transactions?page_size=20&cursor=Y
```

---

## 14. Plan Gating

Decision reference: `DL-011`

This section represents the intended mobile contract and product behavior. Mobile should enforce these gates in UI flow.

### Gate summary

| Feature          | Free       | Pro        |
| ---------------- | ---------- | ---------- |
| Transactions     | Unlimited  | Unlimited  |
| Fixed expenses   | 3 max      | Unlimited  |
| Payment methods  | 2 max      | Unlimited  |
| Analysis         | Locked     | Enabled    |
| Snapshot history | All stored | All stored |
| Dashboard        | Enabled    | Enabled    |

### Mobile behavior

1. Before creating a fixed expense, block create if the user is on `free` and already has `3` active fixed expenses.
2. Before creating a payment method, block create if the user is on `free` and already has `2` active payment methods.
3. For the analysis screen, show upgrade state instead of calling the endpoint when `plan === "free"`.
4. After downgrade, existing data stays visible and manageable; only new creates beyond limit are blocked.

### Plan source

- `plan` comes from `GET /user-settings`.
- Mobile should re-fetch settings after purchase completion.
- `plan` is server-managed and not writable by mobile.

### Server enforcement payloads

If mobile still calls a gated endpoint while user plan is `free`, backend responds with RFC 7807 shape plus `code = PLAN_UPGRADE_REQUIRED`.

| Endpoint                | Status | Detail                                                                     |
| ----------------------- | ------ | -------------------------------------------------------------------------- |
| `POST /fixed-expenses`  | `403`  | `Free plan is limited to 3 fixed expenses. Upgrade to Pro for unlimited.`  |
| `POST /payment-methods` | `403`  | `Free plan is limited to 2 payment methods. Upgrade to Pro for unlimited.` |
| `GET /analysis/current` | `403`  | `Analysis is a Pro feature. Upgrade to access current-month analysis.`     |

---

## 15. Error Handling

### Common HTTP statuses

| Code  | Meaning                               | Mobile action                            |
| ----- | ------------------------------------- | ---------------------------------------- |
| `200` | Success                               | Process payload                          |
| `201` | Created                               | Process payload                          |
| `204` | Success without body                  | Treat as success                         |
| `401` | Missing or invalid token              | Refresh token and retry once             |
| `403` | Forbidden                             | Show upgrade or access-blocked state     |
| `404` | Not found                             | Treat entity as missing                  |
| `409` | Conflict / blocked state              | Usually route or show contextual message |
| `422` | Validation or business-rule rejection | Show field or action error               |
| `429` | Rate limited                          | Back off and retry                       |
| `500` | Unexpected server error               | Show generic retryable error             |

### `401` retry flow

```text
API call -> 401
  -> user.getIdToken(true)
  -> retry once
  -> if still 401, treat session as invalid
```

### Validation envelope

Request-validation `422` example:

```json
{
  "type": "about:blank",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "Request validation failed",
  "errors": [
    {
      "field": "body.amount",
      "message": "Input should be greater than 0"
    }
  ]
}
```

Contract notes:

- Do not assume FastAPI's default `detail[{loc,msg,type}]` format.
- Some business-rule `422` responses may return a direct `detail` string instead of an `errors[]` array.
- Known conflict detail for auth login: `POST /auth/login` may return `409` with `detail = "email_conflict"`.
- Plan-gated `403` responses include `code = PLAN_UPGRADE_REQUIRED` and a feature-specific upgrade `detail` message.

---

## 16. Type Generation

Mobile types should come from backend OpenAPI, not hand-copied JSON examples.

```bash
# in stashy-mobile
npm run generate-types
```

Contract notes:

- reads from `{API_HOST}/openapi.json`
- `/openapi.json` is available in local or non-production environments
- `/openapi.json` is disabled in production
- regenerate after backend schema changes
- Regenerate after this change so mobile receives `CatchUpResponse.inserted_names` and any recent schema additions like `TransactionResponse.updated_at` and `PaymentMethodResponse.updated_at`.

---

## 17. System Status

```http
GET /api/v1/system/status
```

Public endpoint.

Rate limit: explicitly exempt from SlowAPI.

Response example:

```json
{
  "status": "ok",
  "min_supported_version": "1.0.0",
  "maintenance_mode": false
}
```

Mobile flow note:

- check this on startup
- if app version is below `min_supported_version`, block entry and require update
- if `maintenance_mode === true`, show maintenance state

---

## 18. Mobile-Critical Decisions Summary

These decisions directly affect mobile behavior and are intentionally kept visible here.

### `DL-007` Payment method delete strategy

- delete can be hard or soft
- default methods cannot be deleted
- soft-deleted methods must disappear from selectors but may still appear in history and dashboard totals

### `DL-008` Fixed expense delete cascade

- delete is a two-step mobile flow when current-month manual transactions exist
- mobile must handle the pending-transactions response and ask the user to resolve it

### `DL-010` Major expense preview is client-side only

- no preview endpoint exists
- mobile computes the preview from cached dashboard values

### `DL-011` Plan enforcement

- mobile should enforce free/pro product gates in frontend behavior

### `DL-014` Direct Firebase token verification

- always send Firebase Bearer token on protected requests
- `POST /auth/login` is login/upsert only

### `DL-015` Timezone-aware business date strategy

- `user_settings.timezone` stores the user's IANA timezone identifier
- `GET /user-settings` returns `timezone`
- `PUT /user-settings` accepts `timezone` updates with strict IANA validation
- `dashboard`, `fixed-tracker`, and `analysis/current` validate `today` against the user's timezone-aware business date
- transactions write-path checks (create/delete/transfer/sync), fixed-expense current-month windows, and snapshot close-month eligibility also use user-local business date semantics

---

## 19. RevenueCat Purchase Sync

Decision reference: `DL-016`

RevenueCat plan lifecycle changes are now server-managed through a backend webhook.
Mobile must never write `plan` directly.

Required mobile flow:

1. After Firebase authentication, call `Purchases.logIn(firebaseUID)` so RevenueCat events carry the same user identifier expected by backend plan matching.
2. Complete purchase/restore actions through RevenueCat SDK flows as usual.
3. After purchase success, immediately refresh `GET /api/v1/user-settings` and use the returned `plan` value as source of truth for entitlement UI.
4. Do not attempt plan upgrades/downgrades via `PUT /api/v1/user-settings`; backend ignores client-provided `plan`.

---

**Document Version:** 2.6
**Scope:** Mobile contract and mobile-critical flow notes
**Related docs:** `docs/Stashy_logics/*`, `/openapi.json`
