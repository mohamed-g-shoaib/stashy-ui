> **LLM Context & Usage Guide**
> This file establishes the chronological daily session tracking format for this project.
>
> - **How to use this directory (`spec/sessions/`)**: Read today's or the most recent day's log when starting a new conversation to quickly ingest the current daily state, established blockers, and past sessions for that day.
> - **How to update**: You must create a single file for each day (e.g., `DD-MMM-YY-topic.md`). Every newly created daily file MUST contain this exact LLM Context block and the `Unified Session Template` at the very top. As the day progresses, update the current active session while work is continuous. Create a new numbered session only when there is a meaningful time gap or restart of work, such as stopping in the morning and continuing 6 hours later.
>
> **Session boundary rule:** A session is a contiguous work block, not a single code edit or request. Do not create a new session for every task, fix, or verification pass. Append new facts to the active session's Completed, Decisions, and Open Blockers sections unless the work has clearly resumed after a substantial break.

## Unified Session Template

When appending to today's daily log, first decide whether the current work lift belongs to the active session. If it is the same continuous work block, update the existing session in place. If it follows a substantial break or restart, append a new session using this exact structure:

```markdown
# Session [N] — [Brief descriptor]

**Time:** [HH:MM-HH:MM]

---

## Status at Session Start

[One paragraph outlining state at the start of the session: active sprint goals, backend sync state, and any carried regressions or blockers from the prior session.]

---

## Completed This Session

[Bullet list of concrete deliverables shipped, fixed, or closed. Keep adding to this list during the same contiguous work block.]

---

## Decisions Made

[Bullet list of decisions locked this session. Formal decisions must also be logged to the explicit Decision Log (DL-NNN) if an SDR or architectural log exists.]\

---

## Open Blockers

[Numbered list of unresolved blockers with an owner. Strike through + date when resolved. Write "None" if clean.]
```

_(End of Template)_

---

# Session 1 — Centralize Sandbox State into Zustand Store

**Time:** ~planning + implementation block

---

## Status at Session Start

Analytics section 2 was complete. Home screen managed all sandbox state (`dailyScenario`, `plan`, `introCardVisible`, `majorScenario`) as local `useState` with localStorage sync. The analytics page consumed a hardcoded `ANALYTICS_PLAN` constant and a static `analyticsData` import with no reactivity to sandbox settings. Settings page had its own independent `plan` useState reading from the same localStorage key. Nothing outside the home page could react to sandbox state.

---

## Completed This Session

- Installed `zustand@5.0.13` as a new dependency.
- Created `store/sandbox-store.ts` at repo root with two independent state axes:
  - `monthlyBudgetState`: `"onTrack" | "atRisk" | "over"` — monthly budget horizon
  - `dailyRateState`: `"underRate" | "overRate"` — daily rate horizon
  - Plus `majorScenario`, `plan`, `introCardVisible` with setters
- Migrated `components/home-screen.tsx`:
  - Removed 4 `useState` calls + 1 `useEffect` for localStorage reads
  - Removed `PLAN` import and localStorage wrapper callbacks
  - Replaced `getDailyRate(scenario)` with `getDailyRate(monthlyBudgetState, dailyRateState)` two-axis derivation
  - Updated `majorScenario` override: `monthlyBudgetState === "over"` instead of `dailyScenario === "emergency"`
  - Removed all prop drilling of state/setters to `HomeDrawer`
  - `onPreviewAddAction` no longer writes any scenario state (drawer-local preview is not migrated to global state)
- Updated `components/home/home-drawer.tsx`:
  - `HomeDrawerProps` reduced to 4 fields: `kind`, `direction`, `onPreviewAddAction`, `onOpenChange`
  - `SettingsControls` reads/writes directly from store — zero props
  - Replaced single "Daily Scenario" 3-tab control with two independent controls:
    - **Monthly budget**: On track / At risk / Over → `setMonthlyBudgetState`
    - **Today's rate**: Under rate / Over rate → `setDailyRateState` (muted + disabled when monthly is "over")
  - `HelpContent` now reads from store directly instead of accepting `dailyScenario` prop
  - Removed `DailyScenario` type from imports (no longer needed in public API)
- Updated `components/analytics/data.ts`:
  - Added `analyticsDataOnTrack` (alias to existing `analyticsData`)
  - Added `analyticsDataAtRisk` with negative rollover (-320), +18% pacing delta, 9 overspent days, negative projected savings
  - Added `analyticsDataOver` with deeply negative rollover (-1840), +42% pacing delta, budgetUsedPct 113, 14 overspent days
  - All three datasets share `month: "2026-05"` and the same closed snapshots (Apr/Mar/Feb) to keep `selectedMonthId` valid across scenario switches
  - Added `getAnalyticsDataForScenario(monthlyBudgetState)` helper function
- Migrated `components/analytics/analytics-screen.tsx`:
  - Replaced `ANALYTICS_PLAN` constant and static `analyticsData` import with store reads
  - `analyticsData` is now dynamically derived via `getAnalyticsDataForScenario(monthlyBudgetState)` on each render
  - `plan` from store replaces the hardcoded `ANALYTICS_PLAN` constant for the free/pro gate
- Migrated `components/settings/settings-screen.tsx`:
  - Removed `plan` useState + localStorage initializer
  - Replaced with `const { plan } = useSandboxStore()`
  - Side effect: the settings-screen pre-existing lint error (unused `setPlan`) was also resolved
- Verification:
  - `pnpm typecheck` — clean
  - `pnpm lint` — 2 pre-existing errors remain (settings-sections.tsx, tracker-transfer-drawer.tsx); settings-screen.tsx error was resolved as side effect
  - `pnpm build` — fails on `/[locale]/tracker` with `useSearchParams()` suspense boundary error; confirmed pre-existing on unmodified baseline via `git stash` test

---

## Decisions Made

- `monthlyBudgetState` and `dailyRateState` are the two independent axes that replaced the single `DailyScenario` type (`"track" | "overspent" | "emergency"`)
- `onPreviewAddAction` is drawer-local preview only — the amount-based scenario toggle was removed without replacement; sandbox state is now only settable from the settings drawer
- All three analytics datasets share identical month ID strings so `selectedMonthId` remains valid across scenario switches
- `settings-sections.tsx` PLAN fallback (`(plan ?? PLAN) === "pro"`) was left untouched — it's dead code now but in a pre-existing lint error file
- The `tracker` build error (`useSearchParams()` missing Suspense) is a known pre-existing regression, not introduced by this session

---

## Open Blockers

1. `pnpm build` fails on `/[locale]/tracker` with `useSearchParams()` Suspense boundary error — pre-existing, not in scope for this session.
