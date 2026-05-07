"use client"

import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
            className={cn("mt-0.5 text-sm font-semibold tabular-nums", semanticTextClass[role])}
          >
            {paidFormatted}
          </p>
        </div>
        <div className={cn(statTileClass, "text-start")}>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            {t("summary.remaining")}
          </p>
          <p dir="ltr" className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
            {summary.totalRemaining < 0 ? `−${remainingFormatted}` : remainingFormatted}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <TrackerProgress
        value={Math.round(summary.totalBudgeted > 0 ? (summary.totalPaid / summary.totalBudgeted) * 100 : 0)}
        tone={role as keyof typeof semanticProgressClass}
        showPercent
      />

      {/* Over-budget items — always visible, no collapse */}
      {hasOverBudget && (
        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="flex flex-col gap-2">
            {summary.overBudgetItems.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={14}
                  aria-hidden="true"
                  className={semanticTextClass.expense}
                />
                <span className="flex-1 truncate text-xs font-medium text-text-secondary">
                  {item.name}
                </span>
                <span
                  dir="ltr"
                  className={cn("text-xs font-semibold tabular-nums", semanticTextClass.expense)}
                >
                  +{formatAmount(item.overageAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
