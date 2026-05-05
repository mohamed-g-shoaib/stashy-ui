"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { TrackerProgress } from "@/components/tracker/tracker-progress"
import type {
  FixedExpenseStatus,
  FixedTrackerSummary,
} from "@/components/tracker/types"
import { Badge } from "@/components/ui/badge"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import {
  semanticProgressClass,
  semanticSurfaceClass,
  semanticTextClass,
} from "@/lib/semantic-styles"
import { cn, getCardTint } from "@/lib/utils"

type FixedSummaryCardProps = {
  summary: FixedTrackerSummary
}

const statusRole = {
  on_track: "income",
  warning: "warning",
  over_budget: "expense",
} as const satisfies Record<FixedExpenseStatus, keyof typeof semanticSurfaceClass>

const statusTintTone = {
  on_track: "success",
  warning: "warning",
  over_budget: "danger",
} as const satisfies Record<FixedExpenseStatus, "success" | "warning" | "danger">

export function FixedSummaryCard({ summary }: FixedSummaryCardProps) {
  const t = useTranslations("Tracker.fixed")
  const role = statusRole[summary.overallStatus]
  const [calloutOpen, setCalloutOpen] = React.useState(false)

  const budgetedFormatted = formatAmount(summary.totalBudgeted)
  const paidFormatted = formatAmount(summary.totalPaid)
  const remainingFormatted = formatAmount(Math.abs(summary.totalRemaining))

  const hasOverBudget = summary.overBudgetItems.length > 0

  return (
    <div className={cn(heroSurfaceClass, getCardTint(statusTintTone[summary.overallStatus]), "p-4")}>
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={cn("text-sm font-semibold", semanticTextClass.fixed)}>
          {t("summary.title")}
        </p>
        <Badge className="h-5 border-transparent px-2 text-[0.6875rem]" variant={role}>
          {t(`summary.statusLabel.${summary.overallStatus}`)}
        </Badge>
      </div>

      {/* Hero amount */}
      <p
        dir="ltr"
        className="mb-3 text-[1.375rem] font-semibold leading-none tabular-nums text-foreground"
      >
        {budgetedFormatted}
      </p>

      {/* Paid / Remaining tiles */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className={cn(statTileClass, "text-start")}>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            {t("summary.paid")}
          </p>
          <p
            dir="ltr"
            className={cn(
              "mt-0.5 text-sm font-semibold tabular-nums",
              semanticTextClass[role],
            )}
          >
            {paidFormatted}
          </p>
        </div>
        <div className={cn(statTileClass, "text-start")}>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            {t("summary.remaining")}
          </p>
          <p
            dir="ltr"
            className="mt-0.5 text-sm font-semibold tabular-nums text-foreground"
          >
            {summary.totalRemaining < 0
              ? `−${remainingFormatted}`
              : remainingFormatted}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <TrackerProgress
        value={Math.round(summary.totalBudgeted > 0 ? (summary.totalPaid / summary.totalBudgeted) * 100 : 0)}
        tone={role as keyof typeof semanticProgressClass}
        showPercent
      />

      {/* Over-budget envelope callout */}
      {hasOverBudget && (
        <div className="mt-3">
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-start transition-colors",
              semanticSurfaceClass.warning,
            )}
            onClick={() => setCalloutOpen((o) => !o)}
            aria-expanded={calloutOpen}
          >
            <p className="text-[0.6875rem] font-semibold">
              {t("overBudgetCallout.title", { count: summary.overBudgetItems.length })}
            </p>
            <span
              className={cn(
                "shrink-0 text-[0.625rem] transition-transform duration-200",
                calloutOpen ? "rotate-180" : "rotate-0",
              )}
              aria-hidden
            >
              ▾
            </span>
          </button>

          {calloutOpen && (
            <div className="mt-1.5 flex flex-col gap-1.5 rounded-[var(--radius-sm)] bg-surface-offset px-3 py-3">
              {summary.overBudgetItems.length === 1 ? (
                <p className="text-[0.6875rem] leading-relaxed text-text-secondary">
                  {t("overBudgetCallout.body", {
                    name: summary.overBudgetItems[0].name,
                    amount: formatAmount(summary.overBudgetItems[0].overageAmount),
                  })}
                </p>
              ) : (
                <>
                  <p className="text-[0.6875rem] leading-relaxed text-text-secondary">
                    {t("overBudgetCallout.bodyMulti")}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {summary.overBudgetItems.map((item) => (
                      <li key={item.name} className="flex items-center justify-between gap-2">
                        <span className="text-[0.6875rem] text-text-secondary">{item.name}</span>
                        <span
                          dir="ltr"
                          className={cn("text-[0.6875rem] font-semibold tabular-nums", semanticTextClass.warning)}
                        >
                          +{formatAmount(item.overageAmount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
