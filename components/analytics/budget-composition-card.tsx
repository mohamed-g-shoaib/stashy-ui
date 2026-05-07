"use client"

import { useLocale, useTranslations } from "next-intl"

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"

import { formatAnalyticsCurrency } from "./formatters"

export function BudgetCompositionCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const { fixedEgp, majorEgp, variableEgp, totalBudget } = month.budgetComposition
  const fixedPct = Math.round((fixedEgp / totalBudget) * 100)
  const majorPct = Math.round((majorEgp / totalBudget) * 100)
  const variablePct = 100 - fixedPct - majorPct

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">
            {t("composition.title")}
          </h2>
          <p className="text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("composition.subtitle")}
          </p>
        </div>

        {/* Q3 — Segmented bar */}
        {/* TODO: replace bg-*-subtle with --color-{role}-identity-bg tokens once defined in design system */}
        <div className="flex h-5 w-full overflow-hidden rounded-full">
          <div className="bg-fixed-subtle h-full" style={{ width: `${fixedPct}%` }} />
          <div className="bg-major-subtle h-full" style={{ width: `${majorPct}%` }} />
          <div className="bg-variable-subtle h-full" style={{ width: `${variablePct}%` }} />
        </div>

        {/* Legend */}
        <div className="flex gap-4">
          <LegendItem
            colorClass="bg-fixed-subtle"
            label={t("composition.fixedLabel")}
            amount={formatAnalyticsCurrency(locale, fixedEgp)}
          />
          <LegendItem
            colorClass="bg-major-subtle"
            label={t("composition.majorLabel")}
            amount={formatAnalyticsCurrency(locale, majorEgp)}
          />
          <LegendItem
            colorClass="bg-variable-subtle"
            label={t("composition.variableLabel")}
            amount={formatAnalyticsCurrency(locale, variableEgp)}
          />
        </div>

        {/* Q4 annotation */}
        <div className="rounded-xl bg-surface-offset px-3 py-2">
          <p className="text-sm leading-[1.5] text-fixed text-pretty">
            {t("composition.committedAnnotation", { pct: fixedPct })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function LegendItem({
  colorClass,
  label,
  amount,
}: {
  colorClass: string
  label: string
  amount: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className={`size-3 rounded-sm ${colorClass}`} />
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      </div>
      <p dir="ltr" className="text-sm font-semibold text-foreground tabular-nums">
        {amount}
      </p>
    </div>
  )
}
