"use client"

import { useLocale, useTranslations } from "next-intl"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticProgressClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

export function PacingCard({ month }: { month: LiveMonthAnalysis }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const isAhead = month.rolloverEgp >= 0
  const rolloverAbs = Math.abs(month.rolloverEgp)
  const heroColorClass = isAhead ? semanticTextClass.income : semanticTextClass.expense
  const directionLabel = isAhead ? t("pacing.aheadLabel") : t("pacing.behindLabel")
  const fillColorClass =
    month.budgetUsedPct > month.monthProgressPct
      ? semanticProgressClass.expense
      : semanticProgressClass.fixed

  const showInjectionFootnote = month.injectionTotal > 0

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-end gap-3">
          <p
            dir="ltr"
            className={cn(
              "text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
              heroColorClass,
            )}
          >
            {isAhead ? "+" : "−"}
            {formatAnalyticsCurrency(locale, rolloverAbs)}
          </p>
          <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
            {directionLabel}
          </p>
        </div>

        <p className="text-sm leading-[1.55] text-text-secondary text-pretty">
          {t("pacing.contextSentence", {
            budgetUsed: month.budgetUsedPct,
            monthProgress: month.monthProgressPct,
          })}
        </p>

        <div
          aria-label={t("pacing.barLabel")}
          className="relative h-3 overflow-hidden rounded-full bg-surface-offset shadow-ring"
        >
          <div
            className={cn("absolute inset-y-0 start-0 rounded-full", fillColorClass)}
            style={{ width: `${Math.min(100, month.budgetUsedPct)}%` }}
          />
          <div
            className="absolute inset-y-[-2px] w-0.5 -translate-x-1/2 rounded-full bg-text-tertiary/75"
            style={{ insetInlineStart: `${Math.min(100, month.monthProgressPct)}%` }}
          />
        </div>

        {showInjectionFootnote ? (
          <p className="text-xs leading-[1.5] text-text-tertiary text-pretty">
            {t("pacing.injectionFootnote", {
              amount: formatAnalyticsCurrency(locale, month.injectionTotal),
            })}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
