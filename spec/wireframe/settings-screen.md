**Task**
Build the Settings screen at `app/(app)/settings.tsx` from scratch. All data is hardcoded mock constants at the top of the file. No API calls, no external state. Every value rendered on screen must trace to a mock constant.

---

**Context**

Settings is a single linear scroll divided into clearly separated card sections. Each card is a self-contained group with a title, subtitle, and its own internal rows or content. There are no nested navigators — actions that would open a form (Edit Profile, Change Budget, Add Payment Method) render a bottom sheet modal within the same screen file. No separate route is needed.

---

**Mock Constants**

```ts
// Profile
const PROFILE_USERNAME = "Mohamed Gamal";
const PROFILE_STATUS: "Active" | "Inactive" = "Active";
const PROFILE_EMAIL = "mohamed.g.shoaib@gmail.com";
const PROFILE_MEMBER_SINCE = "12/9/2025";

// Monthly Budget
const MONTHLY_BUDGET = 10000;
const CURRENCY = "EGP";

// Budget Management (temporary increases)
const BUDGET_BOOSTS: { label: string; amount: number; expiresOn: string }[] = [
  // empty by default — if populated, renders list; if empty, shows empty state
];

// Payment Methods
const PAYMENT_METHODS: {
  id: string;
  name: string;
  icon: "cash" | "card" | "bank";
  isDefault: boolean;
}[] = [
  { id: "1", name: "Cash", icon: "cash", isDefault: true },
  { id: "2", name: "Instapay", icon: "card", isDefault: false },
];

// Appearance
const THEME: "dark" | "light" | "system" = "dark";
const LANGUAGE: "English" | "Arabic" = "English";

// Plan
const PLAN: "free" | "pro" = "pro";

// App Info
const APP_NAME = "Stashy";
const APP_VERSION = "1.1.0";
const APP_DESCRIPTION =
  "Track spending, fixed costs, and goals across devices.";
```

---

**UI Description**

**Screen Header**

- Title: `"Settings"` aligned leading
- Sub-line: `"Manage your profile, security, and budgeting defaults."` — muted, one line below title
- No back button, no trailing action

---

**Card 1 — Profile**

- Card title: `"Profile"` with person icon, trailing `Edit` button (outlined, small)
- Sub-line: `"Username, email, and member info"`
- Divider below header row
- Content rows:
  - `USERNAME` label (muted caps), then `{PROFILE_USERNAME}` in bold large text with an `ACTIVE` / `INACTIVE` status badge inline
  - `EMAIL` label (muted caps), then `{PROFILE_EMAIL}`
  - `MEMBER SINCE` label (muted caps) with star icon, then `{PROFILE_MEMBER_SINCE}`
- Tapping `Edit` opens a bottom sheet with editable fields for username and email, a `Save` primary button and `Cancel` link. Bottom sheet is visual only — no save logic needed.

---

**Card 2 — Monthly Budget**

- Card title: `"Monthly Budget"`, trailing `Change` button (outlined, small)
- Sub-line: `"Set your target budget for the month"`
- Content row: calendar icon + `"{MONTHLY_BUDGET} {CURRENCY}"` in normal weight
- Tapping `Change` opens a bottom sheet with a numeric input pre-filled with `MONTHLY_BUDGET`, a `Save` primary button and `Cancel` link. Visual only.

---

**Card 3 — Budget Management**

- Card title: `"Budget Management"`, trailing `Add` button (outlined, small)
- Sub-line: `"Temporarily increase your monthly budget"`
- If `BUDGET_BOOSTS` is empty: muted centered line inside the card: `"No active boosts. Tap Add to create one."`
- If `BUDGET_BOOSTS` has entries: map each as a row showing label left, amount right, and a muted expiry sub-line: `"Expires {expiresOn}"`
- Tapping `Add` opens a bottom sheet with a label text input, an amount numeric input, a date picker row for expiry (visual only, show a placeholder date), a `Add Boost` primary button and `Cancel` link.

---

**Card 4 — Payment Methods**

- Card title: `"Payment Methods"` with card icon
- Sub-line: `"Manage how you pay expenses"`
- Map `PAYMENT_METHODS`, each as a row:
  - Left: card/cash icon + method name
  - Center: `Default` badge if `isDefault === true`
  - Right: star icon (filled accent if default, outlined if not) · `Edit` text button · `Delete` text button in red
  - Tapping star sets that method as default — visual toggle only
  - Tapping `Edit` opens a bottom sheet with a name text input, icon selector (cash / card / bank as pill options), a `Save` button and `Cancel` link. Visual only.
  - Tapping `Delete` shows an inline confirmation row replacing the method row: `"Delete {name}?"` with `Confirm` (red) and `Cancel` buttons — no actual deletion needed
- Below the list: full-width outlined `Add Payment Method` button. Tapping opens the same bottom sheet as Edit but with empty fields and title `"Add Payment Method"`.

---

**Card 5 — How to Use Stashy**

- Card title: `"How to Use Stashy"` with book/info icon
- Sub-line: `"Learn about budgeting with daily rates"`
- Full-width outlined `View Guide` button — tapping does nothing (no-op for now)

---

**Card 6 — Appearance & Account**

- Card title: `"Appearance & Account"` with palette/settings icon
- Sub-line: `"Customize your app experience"`
- Three rows:
  - `Theme` label left — right: a small segmented pill showing `Light` / `Dark` / `System`, current selection highlighted from `THEME` constant. Tapping changes selection visually only.
  - `Language` label with globe icon left — right: a dropdown-style pill showing current `LANGUAGE`, chevron down. Tapping toggles between `English` and `Arabic` visually only.
  - `Monthly Reports` label with document icon left — right: chevron right. Tapping does nothing (placeholder for future navigation).
- Below the three rows, full-width `Logout` button with red background and logout icon. Tapping does nothing.

---

**Card 7 — About**

- No card border — plain stacked text, muted, centered or leading:
  - `"{APP_NAME} PWA"` — label/caption weight
  - `"Version {APP_VERSION}"` — label weight
  - `"{APP_DESCRIPTION}"` — muted, wraps if needed

---

**ASCII Wireframe**

```
+--------------------------------------------------+
|  Settings                                        |
|  Manage your profile, security, and budgeting    |
|  defaults.                                       |
|--------------------------------------------------|
|                                                  |
|  +-- PROFILE --------------------------[ Edit ]-+|
|  | Username, email, and member info             ||
|  | ─────────────────────────────────────────   ||
|  | USERNAME                                    ||
|  | Mohamed Gamal          [ ACTIVE ]           ||
|  |                                             ||
|  | EMAIL                                       ||
|  | mohamed.g.shoaib@gmail.com                  ||
|  |                                             ||
|  | ☆ MEMBER SINCE                              ||
|  | 12/9/2025                                   ||
|  +----------------------------------------------+|
|                                                  |
|  +-- MONTHLY BUDGET ----------------[ Change ]-+|
|  | Set your target budget for the month        ||
|  | 📅 10,000.00 EGP                            ||
|  +----------------------------------------------+|
|                                                  |
|  +-- BUDGET MANAGEMENT ---------------[ Add ]--+|
|  | Temporarily increase your monthly budget    ||
|  | No active boosts. Tap Add to create one.    ||
|  +----------------------------------------------+|
|                                                  |
|  +-- PAYMENT METHODS ---------------------------+|
|  | Manage how you pay expenses                 ||
|  |                                             ||
|  | 💳 Cash  [ Default ]   ★  Edit  Delete      ||
|  | 💳 Instapay            ☆  Edit  Delete      ||
|  |                                             ||
|  | [    Add Payment Method    ]                ||
|  +----------------------------------------------+|
|                                                  |
|  +-- HOW TO USE STASHY -------------------------+|
|  | Learn about budgeting with daily rates      ||
|  | [         View Guide          ]             ||
|  +----------------------------------------------+|
|                                                  |
|  +-- APPEARANCE & ACCOUNT ----------------------+|
|  | Customize your app experience               ||
|  |                                             ||
|  | Theme              [ Light | Dark | System ]||
|  | 🌐 Language                    [ English ▾ ]||
|  | 📄 Monthly Reports                        > ||
|  |                                             ||
|  | [🚪         Logout          ] ← red bg      ||
|  +----------------------------------------------+|
|                                                  |
|  Stashy PWA                                      |
|  Version 1.1.0                                   |
|  Track spending, fixed costs, and goals          |
|  across devices.                                 |
|                                                  |
|--------------------------------------------------|
|  [Home]  [Tracker]  [Analytics]  [Settings]      |
+--------------------------------------------------+


— EDIT PROFILE BOTTOM SHEET —
+--------------------------------------------------+
|  ▬ (drag handle)                                 |
|  Edit Profile                                    |
|  ─────────────────────────────────────────       |
|  Username                                        |
|  [ Mohamed Gamal                       ]         |
|  Email                                           |
|  [ mohamed.g.shoaib@gmail.com          ]         |
|                                                  |
|  [           Save           ]  ← primary         |
|             Cancel                               |
+--------------------------------------------------+


— ADD BOOST BOTTOM SHEET —
+--------------------------------------------------+
|  ▬ (drag handle)                                 |
|  Add Budget Boost                                |
|  ─────────────────────────────────────────       |
|  Label                                           |
|  [                                     ]         |
|  Amount                                          |
|  [                                     ]         |
|  Expires On                                      |
|  [ May 31, 2026                    📅  ]         |
|                                                  |
|  [         Add Boost          ]  ← primary       |
|             Cancel                               |
+--------------------------------------------------+


— DELETE INLINE CONFIRMATION —
| 💳 Cash  [ Default ]   ★  Edit  Delete           |
|  → Delete Cash?         [ Confirm ]  Cancel      |
+--------------------------------------------------+
```

---

**Acceptance**

- Every rendered value traces to a mock constant — no hardcoded display strings in JSX
- `BUDGET_BOOSTS` empty state renders when array is empty; list renders when populated
- Default payment method shows filled star and `Default` badge; non-default shows outlined star and no badge
- Delete tap replaces the method row inline with a confirmation row — no modal, no toast
- Theme segmented pill reflects `THEME` constant; tapping cycles selection visually
- Language pill reflects `LANGUAGE` constant; tapping toggles between English and Arabic visually
- All bottom sheets are triggered by their respective buttons and dismissible by dragging down or tapping Cancel
- Logout button is red background, full width, with logout icon — tapping is a no-op
- About section has no card border — plain text only
- Settings tab is active in bottom navigation
- No FAB on this screen
- Single linear scroll — no tabs, no sub-navigation
