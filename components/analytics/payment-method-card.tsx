"use client"

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis, PaymentMethodBreakdown } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentMethodCardProps {
  month: LiveMonthAnalysis
  prevPaymentMethods?: PaymentMethodBreakdown[] | null
}

// ─── Split item config ────────────────────────────────────────────────────────

const SPLIT_ITEMS = [
  {
    key: "fixed" as const,
    chipClass: "bg-fixed-subtle text-fixed",
    labelKey: "methods.fixedLabel",
  },
  {
    key: "variable" as const,
    chipClass: "bg-variable-subtle text-variable",
    labelKey: "methods.variableLabel",
  },
  {
    key: "major" as const,
    chipClass: "bg-major-subtle text-major",
    labelKey: "methods.majorLabel",
  },
] as const

// ─── Delta pill ───────────────────────────────────────────────────────────────

interface DeltaPillProps {
  delta: number
  locale: string
  labelNoChange: string
  labelVsPreviousMonth: string
}

function DeltaPill({ delta, locale, labelNoChange, labelVsPreviousMonth }: DeltaPillProps) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-surface-offset px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
        {labelNoChange}
      </span>
    )
  }

  const isIncrease = delta > 0
  const absAmount = formatAnalyticsCurrency(locale, Math.abs(delta))

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          isIncrease ? "bg-expense-subtle text-expense" : "bg-income-subtle text-income",
        )}
      >
        <HugeiconsIcon
          icon={isIncrease ? ArrowUp01Icon : ArrowDown01Icon}
          size={11}
          className="shrink-0 rtl:rotate-180"
        />
        <span dir="ltr" className="tabular-nums">
          {absAmount}
        </span>
      </span>
      <span className="text-xs text-text-tertiary">{labelVsPreviousMonth}</span>
    </span>
  )
}

// ─── Budget bar ───────────────────────────────────────────────────────────────

interface BudgetBarProps {
  grandTotal: number
  monthlyBudget: number
  injectionTotal: number
  locale: string
  t: ReturnType<typeof useTranslations<"Analytics">>
}

function BudgetBar({ grandTotal, monthlyBudget, injectionTotal, locale, t }: BudgetBarProps) {
  const hasInjection = injectionTotal > 0

  if (hasInjection) {
    // State 2 — two-segment bar
    const totalCapacity = monthlyBudget + injectionTotal
    const spentPct = Math.min((grandTotal / totalCapacity) * 100, 100)
    const injectionPct = Math.min((injectionTotal / totalCapacity) * 100, 100 - spentPct)
    const displayPct = Math.round((grandTotal / monthlyBudget) * 100)
    const formattedBudget = new Intl.NumberFormat(locale).format(monthlyBudget)
    const formattedInjection = new Intl.NumberFormat(locale).format(injectionTotal)

    return (
      <div className="flex flex-col gap-2">
        {/* Two-segment bar track */}
        <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-offset">
          <div
            className="h-full bg-foreground"
            style={{ width: `${spentPct}%` }}
          />
          <div
            className="h-full bg-injection opacity-60"
            style={{ width: `${injectionPct}%` }}
          />
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-text-tertiary">
            {t("methods.budgetUsedPctOriginal", { pct: displayPct })}
          </span>
          <span dir="ltr" className="shrink-0 text-xs tabular-nums text-text-tertiary">
            {t("methods.budgetTotal", { budget: formattedBudget })}
          </span>
        </div>

        {/* Injection note */}
        <div className="flex items-center gap-1.5">
          <span className="size-[7px] shrink-0 rounded-full bg-injection" />
          <span className="text-xs font-medium text-injection">
            {t("methods.injectionNote", { amount: formattedInjection })}
          </span>
        </div>
      </div>
    )
  }

  // State 1 — single-fill bar
  const fillPct = Math.min((grandTotal / monthlyBudget) * 100, 100)
  const displayPct = Math.round((grandTotal / monthlyBudget) * 100)
  const formattedBudget = new Intl.NumberFormat(locale).format(monthlyBudget)

  return (
    <div className="flex flex-col gap-2">
      {/* Single-fill bar track */}
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-offset">
        <div
          className="h-full rounded-full bg-foreground"
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-text-tertiary">
          {t("methods.budgetUsedPct", { pct: displayPct })}
        </span>
        <span dir="ltr" className="shrink-0 text-xs tabular-nums text-text-tertiary">
          {t("methods.budgetTotal", { budget: formattedBudget })}
        </span>
      </div>
    </div>
  )
}

// ─── Method row ───────────────────────────────────────────────────────────────

interface MethodRowProps {
  method: PaymentMethodBreakdown
  prevMethod: PaymentMethodBreakdown | null
  monthStatus: LiveMonthAnalysis["status"]
  locale: string
  t: ReturnType<typeof useTranslations<"Analytics">>
}

function MethodRow({ method, prevMethod, monthStatus, locale, t }: MethodRowProps) {
  const delta = prevMethod !== null ? method.total - prevMethod.total : null
  const showDelta = monthStatus === "closed" && delta !== null

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-3">
      <div className="flex flex-col gap-2">
        {/* Layer 1 — Method name + total */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[0.9375rem] font-medium text-foreground">{method.name}</span>
          <span dir="ltr" className="shrink-0 text-[1.0625rem] font-semibold tabular-nums text-foreground">
            {formatAnalyticsCurrency(locale, method.total)}
          </span>
        </div>

        {/* Layer 2 — Identity chips (only non-zero) */}
        <div className="flex flex-wrap gap-1.5">
          {SPLIT_ITEMS.map(({ key, chipClass, labelKey }) => {
            const amount = method[key]
            if (amount <= 0) return null
            return (
              <span
                key={key}
                className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", chipClass)}
              >
                {t(labelKey as Parameters<typeof t>[0])}
                <span dir="ltr" className="tabular-nums">
                  {formatAnalyticsCurrency(locale, amount)}
                </span>
              </span>
            )
          })}
        </div>

        {/* Layer 3 — Delta pill (closed months only, when prev data exists) */}
        {showDelta && (
          <div className="flex items-center">
            <DeltaPill
              delta={delta}
              locale={locale}
              labelNoChange={t("methods.deltaNoChange")}
              labelVsPreviousMonth={t("methods.deltaVsPreviousMonth")}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function PaymentMethodCard({ month, prevPaymentMethods }: PaymentMethodCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const activeMethods = month.paymentMethods.filter((m) => m.total > 0)
  const grandTotal = activeMethods.reduce((sum, m) => sum + m.total, 0)
  const isInProgress = month.status === "inProgress"
  const formattedHeroNumber = new Intl.NumberFormat(locale).format(grandTotal)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header */}
        <div className="flex flex-col gap-3">
          {/* Row 1: title + subtitle */}
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-medium text-foreground">{t("methods.title")}</h2>
            <span className="shrink-0 text-sm text-text-tertiary">{t("methods.subtitle")}</span>
          </div>

          {/* Row 2: hero number */}
          <div className="flex items-baseline gap-1.5">
            <span
              dir="ltr"
              className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-foreground"
            >
              {formattedHeroNumber}
            </span>
            <span className="text-[0.9375rem] font-medium text-text-tertiary">
              {t("methods.egpSpent")}
            </span>
          </div>

          {/* Row 3+: budget bar (in-progress only) */}
          {isInProgress && (
            <BudgetBar
              grandTotal={grandTotal}
              monthlyBudget={month.monthlyBudget}
              injectionTotal={month.injectionTotal}
              locale={locale}
              t={t}
            />
          )}
        </div>

        {/* Divider */}
        <div className="-mx-4 border-t border-border" />

        {/* Method tiles */}
        <div className="flex flex-col gap-1.5">
          {activeMethods.map((method) => {
            const prevMethod = prevPaymentMethods?.find((m) => m.id === method.id) ?? null
            return (
              <MethodRow
                key={method.id}
                method={method}
                prevMethod={prevMethod}
                monthStatus={month.status}
                locale={locale}
                t={t}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
