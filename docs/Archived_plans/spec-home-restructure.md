# Home Page Restructure — Implementation Plan

## Context & Goal

Restructure the home page of `stashy-ui` to reflect the locked UX decisions from the planning session. The current page leads with `BudgetOverviewCard` then `DailyRateCard`. The new page leads with a lean `BudgetStrip`, then a redesigned `DailyRateCard` that owns all three states (on-track / overspent / emergency), followed by a conditional `MajorExpensesRow`, then `UpcomingPayments`.

This is a mock-only pass. No real API calls. No animations. No RTL. Static data only. Run `pnpm typecheck` and `pnpm lint` after each phase.

---

## Locked Decisions (Do Not Re-Open)

- Daily Rate card is the hero. Budget Overview as a full card is gone from Home.
- Header shows greeting + date only. "12 Days Left" moves to the strip.
- Budget strip shows segmented composition bar (fixed | variable) + three numbers below it.
- Daily Rate card has three states: on-track, overspent, emergency.
- Tomorrow's rate is always inline inside the Daily Rate card — neutral on-track, red when overspent.
- Emergency state fully overrides the card: shows "Over by X" + Inject Budget button, no rate numbers.
- Major Expenses row is conditional (shows when majors exceed 15% of variable budget), amber-tinted, links to History with major filter pre-applied.
- Upcoming Payments shows exactly 3 items. Same-day and tomorrow due dates are visually distinguished from normal due dates.
- Payment method breakdown card is NOT added to home. It belongs in Analytics.
- Intro card (newcomer onboarding) is NOT touched in this pass.

---

## Visual Reference

The new card aesthetics match the mockup produced in the planning session:

**Daily Rate card:**
- Warm off-white card surface (`bg-card` or equivalent)
- State badge (small pill) at top-left: green "On track" / amber "Overspent" / red "Over budget"
- "Remaining today" label (small, muted) above a large hero number (dominant size, `text-4xl` or larger)
- Thin progress bar directly below the hero number
- Secondary row: Allowance (left) + Spent Today (right), both small and muted
- Tomorrow's rate row at the bottom, separated by a hairline divider — neutral label + value on-track, red label + red value when overspent
- Emergency state: badge + "Over by" label + large red number + "Variable budget exhausted" subtext + "Inject budget" action button — no rate numbers, no progress bar, no tomorrow row

**Budget strip:**
- Lighter surface than the card, no heavy card border (use `bg-surface-offset` or similar muted tone)
- Segmented bar: left segment = fixed (teal/harbor semantic color), right segment = variable (amber/coral semantic color), proportional to amounts
- Below the bar: three items in a space-between row — "Fixed left + value", "Variable left + value", "X days" — small labels, medium-weight values

**Major expenses row:**
- Amber-tinted surface (`bg-warning-subtle` + `border-warning`)
- Single line: left = "Major expenses: 3,000 EGP · 38% of variable", right = "View →" tap target
- No card weight — lean strip, same visual register as the budget strip

**Upcoming payments:**
- Compact card, no section header label above it
- Internal header row: "3 due this week" (left) + "View all →" (right)
- Three payment rows, each: name + urgency label (left) / amount + date (right)
- Urgency label colors: same-day = red text, tomorrow = amber text, 2+ days = muted text

---

## Phase 1 — Types and Data

### 1.1 Update `components/home/types.ts`

- Add `"emergency"` to `DailyScenario` union: `"track" | "overspent" | "emergency"`
- Update `DailyRate` type:
  - Remove `fill: string` and `spentFill: string` (progress bar will be computed from numbers, not from pre-baked basis classes)
  - Add `remainingAmount: number` — raw number for hero display and progress calculation
  - Add `allowanceAmount: number` — raw number for secondary display
  - Add `spentAmount: number` — raw number for secondary display
  - Add `tomorrowAmount: number | null` — null when on-track OR in emergency
  - Keep `status: string`, `statusTone`, `explanation` — used for accessibility and badge
  - Add `overByAmount: number | null` — non-null only in emergency state
- Add new type `BudgetStrip`:
  ```ts
  export type BudgetStrip = {
    fixedLeft: number;
    variableLeft: number;
    daysRemaining: number;
    fixedTotal: number;
    variableTotal: number;
  };
  ```
- Add new type `MajorExpensesRow`:
  ```ts
  export type MajorExpensesRow = {
    totalAmount: number;
    percentOfVariable: number;
  } | null;
  ```
- Add urgency level to payment data. Add `PaymentUrgency = "today" | "tomorrow" | "soon"` type.
- Update `DrawerKind` — no changes needed this phase.

### 1.2 Update `components/home/home-data.ts`

Replace the existing `fixedPayments` array with a new `upcomingPayments` array of 3 items using the new shape:

```ts
export type UpcomingPayment = {
  id: string;
  nameKey: string;
  amount: string;
  date: string;
  urgency: PaymentUrgency;
};

export const upcomingPayments: UpcomingPayment[] = [
  {
    id: "rent",
    nameKey: "fixedPayments.rent",
    amount: "3,000 EGP",
    date: "Sun, 19/Apr",
    urgency: "tomorrow",
  },
  {
    id: "internet",
    nameKey: "fixedPayments.internet",
    amount: "260 EGP",
    date: "Mon, 20/Apr",
    urgency: "soon",
  },
  {
    id: "spotify",
    nameKey: "fixedPayments.spotify",
    amount: "120 EGP",
    date: "Thu, 23/Apr",
    urgency: "soon",
  },
];
```

Add static mock data for the budget strip:

```ts
export const mockBudgetStrip: BudgetStrip = {
  fixedLeft: 1240,
  variableLeft: 7960,
  daysRemaining: 12,
  fixedTotal: 2400,
  variableTotal: 7600,
};
```

Add static mock for major expenses row (active scenario):

```ts
export const mockMajorExpensesRow: MajorExpensesRow = {
  totalAmount: 3000,
  percentOfVariable: 38,
};
```

### 1.3 Update i18n — `messages/en.json` and `messages/ar.json`

Add under `"Home"`:

```json
"strip": {
  "fixedLeft": "Fixed left",
  "variableLeft": "Variable left",
  "daysRemaining": "{count} days"
},
"major": {
  "rowLabel": "Major expenses",
  "ofVariable": "{percent}% of variable",
  "viewAction": "View"
},
"payments": {
  "title": "3 due this week",
  "viewAll": "View all",
  "urgencyToday": "Due today",
  "urgencyTomorrow": "Due tomorrow"
},
"fixedPayments": {
  "rent": "Rent",
  "internet": "Internet",
  "spotify": "Spotify"
},
"daily": {
  "remainingLabel": "Remaining today",
  "overByLabel": "Over by",
  "overBySubtext": "Variable budget exhausted for this month",
  "injectAction": "Inject budget",
  "allowanceLabel": "Allowance",
  "spentLabel": "Spent today",
  "tomorrowLabel": "Tomorrow's rate",
  "tomorrowDropLabel": "Tomorrow's rate drops to",
  "statusTrack": "On track",
  "statusOverspent": "Overspent",
  "statusEmergency": "Over budget"
}
```

Add equivalent Arabic translations in `messages/ar.json` following the existing Arabic translation patterns in that file.

Verification: `pnpm typecheck && pnpm lint`

---

## Phase 2 — New Components

### 2.1 Create `components/home/budget-strip.tsx`

This is a lean strip component. Not a full card. Uses a lighter surface tone.

**Props:**
```ts
type BudgetStripProps = {
  data: BudgetStrip;
};
```

**Structure:**
```
<div> (strip surface: bg-surface-offset, rounded-lg, px-4 py-3)
  <div> (segmented bar: h-1.5, rounded-full, flex, overflow-hidden, mb-3)
    <div style={{ flexBasis: `${fixedPct}%` }} (bg-fixed — harbor/teal semantic token)
    <div style={{ flexBasis: `${variablePct}%` }} (bg-variable — amber/warm semantic token)
  </div>
  <div> (three-item row: flex justify-between)
    <div> (fixed left)
      <p> label: t("strip.fixedLeft") — text-xs text-text-secondary
      <p> value: formatCurrency(fixedLeft) — text-sm font-medium text-foreground dir="ltr"
    </div>
    <div> (variable left — centered)
      <p> label: t("strip.variableLeft") — text-xs text-text-secondary text-center
      <p> value: formatCurrency(variableLeft) — text-sm font-medium text-foreground text-center dir="ltr"
    </div>
    <div> (days remaining — right-aligned)
      <p> label: t("strip.daysRemaining", { count: daysRemaining }) — text-xs text-text-secondary text-end
      <p> value: empty (days count is in the label itself)
    </div>
  </div>
</div>
```

**Logic:**
- `fixedPct = (fixedTotal / (fixedTotal + variableTotal)) * 100`
- `variablePct = 100 - fixedPct`
- Use the existing `formatCurrency` utility if one exists in the project, or format inline as `amount.toLocaleString() + " EGP"`
- The bar uses `style={{ flexBasis: ... }}` not Tailwind basis classes (dynamic values)
- For the semantic bar colors: use `bg-harbor` for fixed and `bg-warning` (amber) for variable if those tokens exist in the design system. If not, use the closest available teal and amber tokens from `globals.css`. Do not hardcode hex values.

### 2.2 Create `components/home/major-expenses-row.tsx`

A conditional amber strip. Only rendered when `data` is non-null.

**Props:**
```ts
type MajorExpensesRowProps = {
  data: MajorExpensesRow;
  onView: () => void;
};
```

**Structure:**
```
<div> (bg-warning-subtle border border-warning rounded-lg px-4 py-3 flex items-center justify-between)
  <p> (text-sm text-foreground)
    <span font-medium>{t("major.rowLabel")}: </span>
    <span dir="ltr">{formatCurrency(data.totalAmount)}</span>
    <span text-text-secondary> · {t("major.ofVariable", { percent: data.percentOfVariable })}</span>
  </p>
  <button> (text-sm font-medium text-warning-hover, tap target min 44px)
    {t("major.viewAction")} →
  </button>
</div>
```

- Guard: if `data` is null, return null immediately
- `onView` callback fires when the "View →" button is tapped — in this mock it can open the history drawer or navigate to the history tab. For now wire it to `onOpenDrawer("history")` if that DrawerKind exists, or add a no-op with a console note.

### 2.3 Rebuild `components/home/daily-rate-card.tsx`

This is a full component rebuild. The existing implementation is replaced.

**Props:**
```ts
type DailyRateCardProps = {
  rate: DailyRate;
  onInject: () => void;
};
```

**Three states — derive from `rate.overByAmount` and `rate.tomorrowAmount`:**
- Emergency: `rate.overByAmount !== null`
- Overspent: `rate.tomorrowAmount !== null && rate.overByAmount === null`
- On-track: `rate.tomorrowAmount === null && rate.overByAmount === null`

**Shared card wrapper:**
```
<Card> (bg-card, border, rounded-xl, p-4 — use existing Card primitive)
```

**State badge (all states):**
```
<span> small pill — top of card
  On-track: bg-success-subtle text-success-hover
  Overspent: bg-warning-subtle text-warning-hover
  Emergency: bg-danger-subtle text-danger-hover
```

---

**On-track state layout:**
```
[State badge: "On track"]

[Label: "Remaining today" — text-xs text-text-secondary mt-3]
[Hero number: remainingAmount formatted — text-4xl font-semibold text-foreground dir="ltr"]

[Progress bar — mt-3 mb-3]
  Full width, h-1.5, rounded-full
  bg-surface-offset (track)
  Fill: bg-brand or bg-success (remaining portion)
  Fill width: (remainingAmount / allowanceAmount) * 100%, clamped 0–100

[Secondary row — flex justify-between text-sm text-text-secondary]
  Left: Allowance label + value (dir="ltr")
  Right: Spent today label + value (dir="ltr")

[Divider — border-t border-border mt-3 pt-3]
[Tomorrow row — flex justify-between text-sm]
  Left: t("daily.tomorrowLabel") — text-text-secondary
  Right: tomorrowAmount formatted — font-medium text-foreground dir="ltr"
  Note: on-track tomorrowAmount is null, so hide the entire tomorrow row when null
  When on-track and tomorrowAmount is null, show a calm placeholder:
  "You're on pace for the rest of the month" — text-xs text-text-secondary text-center mt-3
```

---

**Overspent state layout:**
```
[State badge: "Overspent"]

[Label: "Remaining today" — text-xs text-text-secondary mt-3]
[Hero number: remainingAmount formatted as negative — text-4xl font-semibold text-danger dir="ltr"]
  Note: remainingAmount will be negative in overspent scenario (e.g. -84.62)
  Format as "−84.62 EGP" using a minus sign, not a hyphen

[Progress bar — full/capped, fill color bg-danger or bg-warning-hover]

[Secondary row — same as on-track]

[Divider — border-warning mt-3 pt-3]
[Tomorrow row — flex justify-between text-sm]
  Left: t("daily.tomorrowDropLabel") — text-warning-hover font-medium
  Right: tomorrowAmount formatted — font-semibold text-danger dir="ltr"
```

---

**Emergency state layout:**
```
[State badge: "Over budget"]

[Label: t("daily.overByLabel") — text-xs text-text-secondary mt-3]
[Hero number: overByAmount formatted — text-4xl font-semibold text-danger dir="ltr"]
[Subtext: t("daily.overBySubtext") — text-xs text-text-secondary mt-1 mb-4]

[Inject button — full width or auto]
  Appearance: solid danger/red button using existing Button primitive with variant="destructive" or closest equivalent
  Label: t("daily.injectAction")
  onClick: onInject prop

No progress bar. No allowance row. No tomorrow row.
```

### 2.4 Create `components/home/upcoming-payments.tsx`

Replace the old `FixedPaymentsSection` inline function. This is now a standalone component.

**Props:**
```ts
type UpcomingPaymentsProps = {
  payments: UpcomingPayment[];
  onViewAll: () => void;
};
```

**Structure:**
```
<Card> (bg-card border rounded-xl — same card surface as daily rate card)
  <div> (internal header: flex justify-between items-center px-4 pt-4 pb-2)
    <p font-medium text-sm>{t("payments.title")}</p>
    <button text-xs text-text-secondary onClick={onViewAll}>{t("payments.viewAll")} →</button>

  {payments.map(payment => (
    <div key={payment.id}> (payment row: flex justify-between items-center px-4 py-3 border-t border-border)
      <div>
        <p text-sm font-medium text-foreground>{t(payment.nameKey)}</p>
        <p text-xs urgency-colored>{urgencyLabel(payment.urgency)}</p>
      </div>
      <div text-end>
        <p text-sm font-medium text-foreground dir="ltr">{payment.amount}</p>
        <p text-xs text-text-secondary>{payment.date}</p>
      </div>
    </div>
  ))}
</Card>
```

**Urgency label logic:**
```ts
function urgencyLabel(urgency: PaymentUrgency, t: ...): { text: string; className: string } {
  switch (urgency) {
    case "today":    return { text: t("payments.urgencyToday"),    className: "text-danger" }
    case "tomorrow": return { text: t("payments.urgencyTomorrow"), className: "text-warning-hover" }
    case "soon":     return { text: "",                            className: "text-text-secondary" }
  }
}
```

When urgency is "soon", show no urgency label — just empty space so the layout stays consistent.

---

## Phase 3 — Update `home-screen.tsx`

### 3.1 Add emergency scenario to state and getDailyRate

- Change `DailyScenario` state initial value stays `"track"`
- Add emergency case to `getDailyRate`:

```ts
if (scenario === "emergency") {
  return {
    remaining: "−1,240 EGP",
    remainingAmount: -1240,
    allowance: "815.38 EGP",
    allowanceAmount: 815.38,
    spent: "2,055.38 EGP",
    spentAmount: 2055.38,
    explanation: "",
    tomorrow: null,
    tomorrowAmount: null,
    status: t("daily.statusEmergency"),
    statusTone: "expense",
    overByAmount: 1240,
  }
}
```

- Update `"track"` case in `getDailyRate` to use the new numeric fields:
  - Add `remainingAmount: 615.38`, `allowanceAmount: 815.38`, `spentAmount: 200`, `tomorrowAmount: null`, `overByAmount: null`
  - Remove `fill` and `spentFill`

- Update `"overspent"` case:
  - Add `remainingAmount: -84.62`, `allowanceAmount: 815.38`, `spentAmount: 900`, `tomorrowAmount: 742`, `overByAmount: null`
  - Remove `fill` and `spentFill`

### 3.2 Add emergency to the sandbox settings drawer

In `components/home/home-drawer.tsx`, in the daily scenario preview control, add a third option: `"emergency"`. The preview tabs currently show "On track" and "Overspent" — add "Emergency" as a third tab. Wire it to `setDailyScenario("emergency")`.

Also add `majorScenario` toggle: the existing "Show / Hide" major scenario toggle stays. In emergency state, force-show the major row regardless of the toggle (since emergency implies significant variable spending).

---

## Phase 4 — Rebuild `home-content.tsx`

Replace `BudgetOverviewSection` and `DailyRateSection` with the new structure.

### New `HomeContent` render order:

```tsx
<main className="flex flex-col gap-section px-screen pb-28 pt-5">
  <h1 className="sr-only">{t("nav.home")}</h1>

  {/* Intro card — unchanged, still conditionally rendered */}
  {introCardVisible ? <IntroCard ... /> : null}

  {/* Budget strip — always visible */}
  <BudgetStrip data={mockBudgetStrip} />

  {/* Daily rate hero card */}
  <DailyRateCard rate={dailyRate} onInject={() => onOpenDrawer("add")} />

  {/* Major expenses row — conditional */}
  {majorScenario === "active" ? (
    <MajorExpensesRow
      data={mockMajorExpensesRow}
      onView={() => onOpenDrawer("history")}
    />
  ) : null}

  {/* Upcoming payments */}
  <UpcomingPayments
    payments={upcomingPayments}
    onViewAll={() => onOpenDrawer("fixed")}
  />
</main>
```

### Remove:
- `BudgetOverviewSection` function (delete it)
- `BudgetOverviewCard` import
- `FixedPaymentsSection` function (replaced by `UpcomingPayments` component)
- `PaymentRow` import (no longer used directly in home-content)
- `fixedPayments` import from home-data (replaced by `upcomingPayments`)

### Update imports to add:
- `BudgetStrip` from `@/components/home/budget-strip`
- `MajorExpensesRow` from `@/components/home/major-expenses-row`
- `UpcomingPayments` from `@/components/home/upcoming-payments`
- `upcomingPayments`, `mockBudgetStrip`, `mockMajorExpensesRow` from `@/components/home/home-data`

Verification: `pnpm typecheck && pnpm lint`

---

## Phase 5 — Update `home-header.tsx`

The header subtitle currently renders `"Sat, 18/Apr 12 Days Left"`.

Remove "12 Days Left" from the subtitle. The subtitle should only show the date: `"Sat, 18/Apr"`.

- Locate the `Home.header.date` translation key in `messages/en.json` and `messages/ar.json`
- Update the value to just the date string, removing the days-left portion
- If days-left was dynamically injected via an interpolation variable in the header component, remove that variable and its usage
- The days remaining figure now lives exclusively in the budget strip

Verification: `pnpm typecheck && pnpm lint`

---

## Phase 6 — Cleanup

### 6.1 Remove or archive `budget-overview-card.tsx`

This component is no longer imported anywhere on home. Delete the file. If it is imported anywhere else in the project (e.g., a settings preview or a test), update those imports first.

Check: `grep -r "budget-overview-card" .` before deleting.

### 6.2 Check `payment-row.tsx`

The old `PaymentRow` component is no longer used in `home-content.tsx`. Check if it is used anywhere else (`grep -r "PaymentRow" .`). If it is only used on home, delete it. If used elsewhere, leave it.

### 6.3 Final scan

- No inline styles anywhere in touched files
- No hardcoded hex colors — use design system tokens only
- All financial amounts rendered with `dir="ltr"`
- No banned physical directional Tailwind utilities (`ml-`, `mr-`, `pl-`, `pr-` — use `ms-`, `me-`, `ps-`, `pe-` instead)

Final verification: `pnpm typecheck && pnpm lint && pnpm build`

---

## Component File Summary

| File | Action |
|---|---|
| `components/home/types.ts` | Modify — update types |
| `components/home/home-data.ts` | Modify — update mock data |
| `messages/en.json` | Modify — add new i18n keys |
| `messages/ar.json` | Modify — add Arabic translations |
| `components/home/budget-strip.tsx` | Create new |
| `components/home/major-expenses-row.tsx` | Create new |
| `components/home/daily-rate-card.tsx` | Rebuild |
| `components/home/upcoming-payments.tsx` | Create new |
| `components/home/home-content.tsx` | Modify — new section order |
| `components/home/home-screen.tsx` | Modify — add emergency scenario |
| `components/home/home-drawer.tsx` | Modify — add emergency preview tab |
| `components/home/home-header.tsx` | Modify — remove days-left from subtitle |
| `components/home/budget-overview-card.tsx` | Delete (after grep check) |
| `components/home/payment-row.tsx` | Delete if unused elsewhere |

---

## State Review Checklist

After implementation, verify all three home states are reviewable from the Settings sandbox drawer:

- [ ] On-track: strip shows budget numbers, card shows remaining + calm tomorrow row, no major row (if toggle off), payments show urgency colors
- [ ] Overspent: card shows negative remaining in red, tomorrow drop row in red/amber, rest unchanged
- [ ] Emergency: card fully transforms to over-budget view with inject button, major row always shown
- [ ] Major on/off toggle still works (except in emergency where it is always shown)
- [ ] Intro card dismiss and re-enable still works
- [ ] Arabic locale renders without layout breakage
- [ ] All financial numbers are LTR in both locales