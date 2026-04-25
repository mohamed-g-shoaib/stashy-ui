"use client"

import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Invoice03Icon,
  MoneyBag02Icon,
  ShoppingBag02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Month
const MONTH_LABEL = "April 2026"
const DAYS_TRACKED = 25
const DAYS_REMAINING = 5
const MONTH_STATUS = "In Progress" as const

// Pacing
const PACING_DELTA_PCT = -12
const BUDGET_USED_PCT = 36
const MONTH_PROGRESS_PCT = 81
const OVERSPENT_DAYS_MTD = 3

// Projection
const AVG_DAILY_SPEND = 160
const PROJECTED_END_SPEND = 4960
const PROJECTED_SAVINGS = 1040
const PROJECTED_SAVINGS_RATE = 17

// Variable Spending Breakdown
const EFFECTIVE_BUDGET = 6000
const TOTAL_VARIABLE_SPENT = 700
const INCOME_RECEIVED = 300
const FIXED_OVERSPEND = 260
const MAJOR_PURCHASES_TOTAL = 2400
const REMAINING =
  EFFECTIVE_BUDGET -
  TOTAL_VARIABLE_SPENT +
  INCOME_RECEIVED -
  FIXED_OVERSPEND -
  MAJOR_PURCHASES_TOTAL

// Fixed Expenses
const FIXED_TOTAL_BUDGET = 1640
const FIXED_TOTAL_SPENT = 900
const FIXED_OVERSPEND_AMOUNT = FIXED_TOTAL_SPENT - FIXED_TOTAL_BUDGET
const FIXED_MANUAL_ITEMS = [
  { name: "Electricity", spent: 0, budget: 1000 },
  { name: "Internet", spent: 500, budget: 240 },
] as const
const FIXED_AUTO_ITEMS = [
  { name: "Netflix", amount: 300, scheduledDay: 12, paid: true },
  { name: "YouTube", amount: 100, scheduledDay: 1, paid: true },
] as const

// Major Purchases
const MAJOR_PURCHASE_ITEMS = [
  { name: "Mouse", date: "Sun, Apr 19", method: "Cash", amount: 1200 },
  { name: "Pepsi", date: "Sun, Apr 19", method: "Cash", amount: 1200 },
] as const

// Payment Methods
const PAYMENT_METHODS = [
  {
    name: "Cash",
    variable: 500,
    fixed: 600,
    major: 2400,
    received: 300,
  },
  {
    name: "Instapay",
    variable: 200,
    fixed: 300,
    major: 0,
    received: 0,
  },
] as const
const GRAND_TOTAL_SPENT = PAYMENT_METHODS.reduce(
  (total, method) => total + method.variable + method.fixed + method.major,
  0,
)
const TOTAL_RECEIVED = PAYMENT_METHODS.reduce((total, method) => total + method.received, 0)
const NET_AFTER_RECEIVED = GRAND_TOTAL_SPENT - TOTAL_RECEIVED

// Month-over-Month
const MOM_AVAILABLE = true
const SAVINGS_RATE_PREV = 18
const SAVINGS_RATE_CURR = 24
const BASE_RATE_PREV = 278
const BASE_RATE_CURR = 278
const LARGE_PURCHASES_PREV = 12
const LARGE_PURCHASES_CURR = 8
const BASE_RATE_CHANGE_REASON = "Base rate unchanged — fixed expenses stayed the same"

// Month Selector (static months, no navigation logic)
const AVAILABLE_MONTHS = [
  { label: "February 2026", status: "Closed" },
  { label: "March 2026", status: "Closed" },
  { label: "April 2026", status: "In Progress" },
] as const
const SELECTED_MONTH_INDEX = 2

// Plan
const PLAN: "free" | "pro" = "pro"

const FILL_WIDTH_CLASS = {
  [BUDGET_USED_PCT]: "w-[36%]",
  [MONTH_PROGRESS_PCT]: "w-[81%]",
} as const

const TICK_POSITION_CLASS = {
  [MONTH_PROGRESS_PCT]: "start-[81%]",
} as const

type ComparisonTone = "positive" | "negative" | "neutral"

export function AnalyticsScreen() {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(SELECTED_MONTH_INDEX)
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background px-screen pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">Analytics</h1>
            <p className="mt-2 max-w-[26ch] text-sm leading-[1.5] text-text-tertiary">
              {`${DAYS_TRACKED} days tracked · ${DAYS_REMAINING} days remaining · ${MONTH_STATUS}`}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full bg-card"
            onClick={() => setMonthPickerOpen(true)}
          >
            <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" aria-hidden="true" />
            {AVAILABLE_MONTHS[selectedMonthIndex]?.label ?? MONTH_LABEL}
          </Button>
        </div>
        <Separator className="mt-4 bg-border-subtle" />
      </header>

      <main className="flex-1 px-screen pb-32 pt-4">
        {PLAN === "free" ? (
          <AnalyticsUpgradeGate />
        ) : (
          <div className="flex flex-col gap-3">
            <PacingCard />
            <ProjectionCard />
            <ShapingCard />
            <MonthComparisonCard />
          </div>
        )}
      </main>

      <MonthPickerDrawer
        direction={direction}
        open={monthPickerOpen}
        selectedMonthIndex={selectedMonthIndex}
        onOpenChange={setMonthPickerOpen}
        onSelectMonth={setSelectedMonthIndex}
      />

      <AppBottomNavigation activeValue="analytics" items={navItems} />
    </div>
  )
}

function PacingCard() {
  const pacingLabel =
    PACING_DELTA_PCT < 0 ? "Under pace" : PACING_DELTA_PCT > 0 ? "Over pace" : "On pace"
  const pacingToneClass =
    PACING_DELTA_PCT < 0
      ? "text-success dark:text-success-dark"
      : PACING_DELTA_PCT > 0
        ? "text-danger dark:text-danger-dark"
        : "text-foreground"

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-5 px-4">
        <div className="space-y-3">
          <p className="text-[0.9375rem] font-medium leading-[1.6] text-foreground text-pretty">
            {getPacingNarrative()}
          </p>
          <div className="flex items-end gap-3">
            <p
              dir="ltr"
              className={cn(
                "text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
                pacingToneClass,
              )}
            >
              {formatSignedPercent(PACING_DELTA_PCT)}
            </p>
            <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
              {pacingLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <HeroStat label="Budget Used" value={formatPercent(BUDGET_USED_PCT)} />
          <HeroStat label="Month Progress" value={formatPercent(MONTH_PROGRESS_PCT)} />
        </div>

        <div className="space-y-3">
          <ProgressTrack
            ariaLabel="Budget pace compared with month progress"
            fillClassName={cn(
              PACING_DELTA_PCT < 0 ? "bg-success" : PACING_DELTA_PCT > 0 ? "bg-danger" : "bg-brand",
              FILL_WIDTH_CLASS[BUDGET_USED_PCT],
            )}
            tickClassName={TICK_POSITION_CLASS[MONTH_PROGRESS_PCT]}
          />

          {OVERSPENT_DAYS_MTD > 0 ? (
            <MutedPill label={`${OVERSPENT_DAYS_MTD} days overspent so far`} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectionCard() {
  const locale = useLocale()
  const projectedSavingsTone =
    PROJECTED_SAVINGS > 0
      ? "text-success dark:text-success-dark"
      : PROJECTED_SAVINGS < 0
        ? "text-danger dark:text-danger-dark"
        : "text-foreground"

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={Invoice03Icon}
          title="Projection"
          subtitle="Where this month is likely heading if nothing changes."
        />

        <div className="grid grid-cols-3 gap-2">
          <CompactStat label="Avg Daily" value={formatCurrency(locale, AVG_DAILY_SPEND)} />
          <CompactStat label="Proj. Spend" value={formatCurrency(locale, PROJECTED_END_SPEND)} />
          <CompactStat
            label="Proj. Savings"
            value={formatCurrency(locale, Math.abs(PROJECTED_SAVINGS))}
            valueClassName={projectedSavingsTone}
          />
        </div>

        <p className="text-[0.9375rem] leading-[1.6] text-text-secondary text-pretty">
          {getProjectionNarrative(locale)}
        </p>

        <MutedPill label={`~${PROJECTED_SAVINGS_RATE}% projected savings rate`} />
      </CardContent>
    </Card>
  )
}

function ShapingCard() {
  const locale = useLocale()
  const fixedManualOverBudgetCount = FIXED_MANUAL_ITEMS.filter(
    (item) => item.spent > item.budget,
  ).length
  const fixedAutoPaidCount = FIXED_AUTO_ITEMS.filter((item) => item.paid).length
  const fixedStatus =
    FIXED_OVERSPEND_AMOUNT > 0
      ? `Fixed spending is over budget by ${formatCurrency(locale, FIXED_OVERSPEND_AMOUNT)}, with ${fixedManualOverBudgetCount} manual bucket over limit and ${fixedAutoPaidCount}/${FIXED_AUTO_ITEMS.length} auto payments already cleared.`
      : `Fixed spending is within the ${formatCurrency(locale, FIXED_TOTAL_BUDGET)} plan, and ${fixedAutoPaidCount}/${FIXED_AUTO_ITEMS.length} auto payments are already cleared.`
  const majorStatus =
    MAJOR_PURCHASE_ITEMS.length > 0
      ? `${MAJOR_PURCHASE_ITEMS.length} major purchases are pulling ${formatCurrency(locale, MAJOR_PURCHASES_TOTAL)} out of the month.`
      : "No major purchases are dragging this month."

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={MoneyBag02Icon}
          title="What’s Shaping April"
          subtitle="A quick read on the few forces that matter most right now."
        />

        <div className="grid gap-3">
          <InsightRow
            icon={MoneyBag02Icon}
            title="Variable Budget Left"
            value={formatCurrency(locale, REMAINING)}
            tone={REMAINING >= 0 ? "positive" : "negative"}
            description={`After income, fixed pressure, and major purchases, you still have ${formatCurrency(
              locale,
              Math.abs(REMAINING),
            )} ${REMAINING >= 0 ? "left to work with." : "missing from plan."}`}
          />

          <InsightRow
            icon={Calendar03Icon}
            title="Fixed Pressure"
            value={
              FIXED_OVERSPEND_AMOUNT > 0
                ? formatCurrency(locale, FIXED_OVERSPEND_AMOUNT)
                : formatCurrency(locale, FIXED_TOTAL_SPENT)
            }
            tone={FIXED_OVERSPEND_AMOUNT > 0 ? "negative" : "neutral"}
            description={fixedStatus}
          />

          <InsightRow
            icon={ShoppingBag02Icon}
            title="Major Purchases"
            value={formatCurrency(locale, MAJOR_PURCHASES_TOTAL)}
            tone={MAJOR_PURCHASES_TOTAL > 0 ? "warning" : "neutral"}
            description={majorStatus}
          />
        </div>

        <Separator className="bg-border-subtle" />

        <div className="grid grid-cols-2 gap-3">
          <SummaryItem
            label="Grand Total Spent"
            value={formatCurrency(locale, GRAND_TOTAL_SPENT)}
          />
          <SummaryItem
            label="Net After Received"
            value={formatCurrency(locale, NET_AFTER_RECEIVED)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function MonthComparisonCard() {
  const locale = useLocale()
  const savingsDelta = SAVINGS_RATE_CURR - SAVINGS_RATE_PREV
  const baseDelta = BASE_RATE_CURR - BASE_RATE_PREV
  const largePurchasesDelta = LARGE_PURCHASES_CURR - LARGE_PURCHASES_PREV

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={CreditCardIcon}
          title="vs Last Month"
          subtitle={
            MOM_AVAILABLE
              ? getComparisonVerdict()
              : "No previous month data yet. Close last month to unlock comparison."
          }
        />

        {MOM_AVAILABLE ? (
          <div className="flex flex-col gap-4">
            <ComparisonRow
              label="Savings Rate"
              values={`${formatPercent(SAVINGS_RATE_PREV)} → ${formatPercent(SAVINGS_RATE_CURR)}`}
              delta={savingsDelta}
              tone={savingsDelta > 0 ? "positive" : savingsDelta < 0 ? "negative" : "neutral"}
              message={savingsDelta !== 0 ? "Saving more than last month" : undefined}
            />

            <Separator className="bg-border-subtle" />

            <ComparisonRow
              label="Base Daily Rate"
              values={`${formatCurrency(locale, BASE_RATE_PREV)} → ${formatCurrency(locale, BASE_RATE_CURR)}`}
              delta={baseDelta}
              tone="neutral"
              reason={BASE_RATE_CHANGE_REASON}
            />

            <Separator className="bg-border-subtle" />

            <ComparisonRow
              label="Large Purchases"
              values={`${formatPercent(LARGE_PURCHASES_PREV)} → ${formatPercent(LARGE_PURCHASES_CURR)}`}
              delta={largePurchasesDelta}
              tone={
                largePurchasesDelta < 0
                  ? "positive"
                  : largePurchasesDelta > 0
                    ? "negative"
                    : "neutral"
              }
              message={
                largePurchasesDelta !== 0 ? "Fewer large purchases than last month" : undefined
              }
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-2 text-center">
            <Button type="button" size="sm">
              Close Last Month
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MonthPickerDrawer({
  direction,
  open,
  selectedMonthIndex,
  onOpenChange,
  onSelectMonth,
}: {
  direction: "ltr" | "rtl"
  open: boolean
  selectedMonthIndex: number
  onOpenChange: (open: boolean) => void
  onSelectMonth: (index: number) => void
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>Select Month</DrawerTitle>
          <DrawerDescription>
            Jump to any saved month without scrubbing through a horizontal list.
          </DrawerDescription>
        </DrawerHeader>

        <div className="grid gap-2 px-4 pb-2">
          {AVAILABLE_MONTHS.map((month, index) => {
            const selected = index === selectedMonthIndex

            return (
              <DrawerClose asChild key={month.label}>
                <button
                  type="button"
                  className={cn(
                    "flex min-h-14 items-center justify-between rounded-md border border-border bg-surface-offset px-4 py-3 text-start shadow-ring transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96]",
                    selected && "bg-card text-foreground",
                  )}
                  onClick={() => onSelectMonth(index)}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{month.label}</p>
                    <p className="mt-1 text-xs font-medium text-text-secondary">{month.status}</p>
                  </div>
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      month.status === "In Progress" ? "bg-brand" : "bg-text-tertiary",
                    )}
                  />
                </button>
              </DrawerClose>
            )
          })}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ComparisonRow({
  label,
  values,
  delta,
  tone,
  message,
  reason,
}: {
  label: string
  values: string
  delta: number
  tone: ComparisonTone
  message?: string
  reason?: string
}) {
  const badgeLabel = delta === 0 ? "—" : formatSignedPercent(delta)
  const icon =
    delta < 0 ? (
      <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" size={12} className="rotate-90" />
    ) : delta > 0 ? (
      <HugeiconsIcon icon={ArrowUpRight01Icon} aria-hidden="true" size={12} />
    ) : null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p dir="ltr" className="mt-1 text-sm text-text-secondary tabular-nums">
            {values}
          </p>
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "h-auto rounded-full px-2.5 py-1 text-[0.6875rem] font-medium shadow-ring",
            tone === "positive" &&
              "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark",
            tone === "negative" &&
              "bg-danger-subtle text-danger dark:bg-danger-subtle-dark dark:text-danger-dark",
            tone === "neutral" && "bg-surface-offset text-text-secondary",
          )}
        >
          {icon}
          <span dir="ltr" className="tabular-nums">
            {badgeLabel}
          </span>
        </Badge>
      </div>

      {message ? (
        <p className="text-sm leading-[1.5] text-text-secondary text-pretty">{message}</p>
      ) : null}
      {reason ? (
        <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">{reason}</p>
      ) : null}
    </div>
  )
}

function AnalyticsUpgradeGate() {
  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center gap-5 text-center">
      <LockIllustration />
      <div className="space-y-2">
        <h2 className="text-[1.375rem] font-semibold leading-[1.2] text-foreground text-balance">
          Unlock Analytics
        </h2>
        <p className="max-w-[26ch] text-sm leading-[1.6] text-text-secondary text-pretty">
          See your spending pace, monthly trends, and savings projections — all in one place.
        </p>
      </div>
      <Button type="button" className="min-w-40">
        Upgrade to Pro
      </Button>
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  subtitle: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={icon} aria-hidden="true" size={18} className="text-text-secondary" />
        <h2 className="text-[1.0625rem] font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-sm leading-[1.6] text-text-secondary text-pretty">{subtitle}</p>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-sm bg-surface-offset p-3 shadow-ring">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className="text-[1.25rem] font-semibold leading-[1.1] text-foreground tabular-nums"
      >
        {value}
      </p>
    </div>
  )
}

function CompactStat({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-sm bg-surface-offset p-3 shadow-ring">
      <p className="text-[0.6875rem] font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className={cn(
          "text-[0.9375rem] font-semibold leading-[1.2] text-foreground tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}

function InsightRow({
  icon,
  title,
  value,
  tone,
  description,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  value: string
  tone: "positive" | "negative" | "warning" | "neutral"
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-sm bg-surface-offset p-3 shadow-ring">
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full shadow-ring",
          tone === "positive" &&
            "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark",
          tone === "negative" &&
            "bg-danger-subtle text-danger dark:bg-danger-subtle-dark dark:text-danger-dark",
          tone === "warning" &&
            "bg-warning-subtle text-warning dark:bg-warning-subtle-dark dark:text-warning-dark",
          tone === "neutral" && "bg-card text-text-secondary",
        )}
      >
        <HugeiconsIcon icon={icon} aria-hidden="true" size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p
            dir="ltr"
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums",
              tone === "positive" && "text-success dark:text-success-dark",
              tone === "negative" && "text-danger dark:text-danger-dark",
              tone === "warning" && "text-warning dark:text-warning-dark",
              tone === "neutral" && "text-foreground",
            )}
          >
            {value}
          </p>
        </div>
        <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">{description}</p>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-surface-offset p-3 shadow-ring">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p dir="ltr" className="mt-1 text-sm font-semibold text-foreground tabular-nums">
        {value}
      </p>
    </div>
  )
}

function MutedPill({ label }: { label: string }) {
  return (
    <Badge
      variant="secondary"
      className="h-auto w-fit rounded-full bg-surface-offset px-2.5 py-1 text-[0.6875rem] font-medium text-text-secondary shadow-ring"
    >
      {label}
    </Badge>
  )
}

function ProgressTrack({
  ariaLabel,
  fillClassName,
  tickClassName,
}: {
  ariaLabel: string
  fillClassName: string
  tickClassName?: string
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="relative h-3 overflow-hidden rounded-full bg-surface-offset shadow-ring"
    >
      <div className={cn("absolute inset-y-0 start-0 rounded-full", fillClassName)} />
      {tickClassName ? (
        <div
          className={cn(
            "absolute inset-y-[-2px] w-0.5 -translate-x-1/2 rounded-full bg-text-tertiary/75",
            tickClassName,
          )}
        />
      ) : null}
    </div>
  )
}

function LockIllustration() {
  return (
    <div className="relative flex size-20 items-center justify-center rounded-full bg-surface-offset shadow-ring">
      <div className="relative h-11 w-10 rounded-sm border-2 border-text-secondary bg-card shadow-ring">
        <div className="absolute start-1/2 top-[-1.25rem] h-7 w-6 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-text-secondary" />
        <div className="absolute start-1/2 top-4 size-2.5 -translate-x-1/2 rounded-full bg-text-secondary" />
        <div className="absolute start-1/2 top-[1.5rem] h-3 w-1 -translate-x-1/2 rounded-full bg-text-secondary" />
      </div>
    </div>
  )
}

function getPacingNarrative() {
  if (PACING_DELTA_PCT < 0) {
    return `You've used ${BUDGET_USED_PCT}% of your budget with ${MONTH_PROGRESS_PCT}% of the month gone — comfortably under pace.`
  }

  if (PACING_DELTA_PCT > 0) {
    return `You've used ${BUDGET_USED_PCT}% of your budget with only ${MONTH_PROGRESS_PCT}% of the month gone — you're spending ahead of pace.`
  }

  return "You're spending exactly on pace this month."
}

function getProjectionNarrative(locale: string) {
  if (PROJECTED_SAVINGS >= 0) {
    return `If nothing changes, you’ll finish ${MONTH_LABEL} about ${formatCurrency(locale, PROJECTED_SAVINGS)} under budget.`
  }

  return `At this rate, you’ll overspend by ${formatCurrency(locale, Math.abs(PROJECTED_SAVINGS))} by month end. Pulling back on variable spending would help.`
}

function getComparisonVerdict() {
  const savingsImproved = SAVINGS_RATE_CURR > SAVINGS_RATE_PREV
  const baseImproved = BASE_RATE_CURR <= BASE_RATE_PREV
  const largePurchasesImproved = LARGE_PURCHASES_CURR <= LARGE_PURCHASES_PREV
  const allImproved = savingsImproved && baseImproved && largePurchasesImproved
  const allWorse =
    SAVINGS_RATE_CURR < SAVINGS_RATE_PREV &&
    BASE_RATE_CURR > BASE_RATE_PREV &&
    LARGE_PURCHASES_CURR > LARGE_PURCHASES_PREV

  if (allImproved) {
    return "April is reading better than last month across the signals that matter."
  }

  if (allWorse) {
    return "This month is tracking below last month on all fronts."
  }

  return "Mixed month — some signals improved, while others still need attention."
}

function formatCurrency(locale: string, value: number) {
  return `${new Intl.NumberFormat(locale).format(value)} EGP`
}

function formatPercent(value: number) {
  return `${value}%`
}

function formatSignedPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`
}
