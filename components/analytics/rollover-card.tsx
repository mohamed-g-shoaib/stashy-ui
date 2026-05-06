"use client"

import { useTranslations } from "next-intl"

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticProgressClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

import { formatAnalyticsCurrency } from "./formatters"

function getDotClass(index: number, daysTracked: number, overspentDaysMtd: number): string {
  const withinRateCount = daysTracked - overspentDaysMtd
  if (index < withinRateCount) return "bg-income/70"
  if (index < daysTracked) return "bg-danger/60"
  return "bg-surface-offset border border-border"
}

export function RolloverCard({ month }: { month: AnalyticsMonth }) {
  const t = useTranslations("Analytics")

  const isAhead = month.rolloverEgp >= 0
  const rolloverAbs = Math.abs(month.rolloverEgp)
  const rolloverColorClass = isAhead ? semanticTextClass.income : semanticTextClass.expense
  const rolloverLabel = isAhead ? t("rollover.aheadLabel") : t("rollover.deficitLabel")
  const fillColorClass =
    month.pacingDeltaPct < 0 ? semanticProgressClass.fixed : semanticProgressClass.expense

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-5 px-4">
        {/* Q2 hero — rollover cushion */}
        <div className="space-y-3">
          <div className="flex items-end gap-3">
            <p
              dir="ltr"
              className={cn(
                "text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
                rolloverColorClass,
              )}
            >
              {isAhead ? "+" : "-"}
              {formatAnalyticsCurrency("en", rolloverAbs)}
            </p>
            <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
              {rolloverLabel}
            </p>
          </div>

          <p className="text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("rollover.contextSentence", {
              budgetUsed: month.budgetUsedPct,
              monthProgress: month.monthProgressPct,
            })}
          </p>

          {/* Directional fill bar */}
          <div
            aria-label={t("rollover.title")}
            className="relative h-3 overflow-hidden rounded-full bg-surface-offset shadow-ring"
          >
            <div
              className={cn("absolute inset-y-0 start-0 rounded-full", fillColorClass)}
              style={{ width: `${month.budgetUsedPct}%` }}
            />
            <div
              className="absolute inset-y-[-2px] w-0.5 -translate-x-1/2 rounded-full bg-text-tertiary/75"
              style={{ insetInlineStart: `${month.monthProgressPct}%` }}
            />
          </div>
        </div>

        {/* Q1 — dot grid */}
        <div className="space-y-2">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
            {t("rollover.dotGridLabel")}
          </p>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: month.daysInMonth }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-2.5 rounded-full",
                  getDotClass(i, month.daysTracked, month.overspentDaysMtd),
                )}
              />
            ))}
          </div>

          {month.overspentDaysMtd > 0 ? (
            <p className="text-xs text-text-tertiary">
              {t("rollover.overspentDays", {
                overspent: month.overspentDaysMtd,
                tracked: month.daysTracked,
              })}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
