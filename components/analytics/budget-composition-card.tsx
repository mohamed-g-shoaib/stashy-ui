"use client"

import { useLocale, useTranslations } from "next-intl"

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"

import { formatAnalyticsCurrency } from "./formatters"

export function BudgetCompositionCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const { fixedEgp, totalBudget } = month.budgetComposition
  // Variable = everything that isn't locked in fixed (absorbs major into flexible budget)
  const variableEgp = totalBudget - fixedEgp
  const fixedPct = Math.round((fixedEgp / totalBudget) * 100)
  const variablePct = 100 - fixedPct

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header + total budget */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">
              {t("composition.title")}
            </h2>
            <p className="text-sm leading-[1.6] text-text-secondary text-pretty">
              {t("composition.subtitle")}
            </p>
          </div>
          <div className="shrink-0 text-end">
            <p dir="ltr" className="text-[1.125rem] font-semibold tabular-nums text-foreground">
              {formatAnalyticsCurrency(locale, totalBudget)}
            </p>
            <p className="text-xs text-text-tertiary">{t("composition.totalBudgetLabel")}</p>
          </div>
        </div>

        {/* Proportional split blocks — widths reflect the actual budget split */}
        {/* TODO: replace bg-*-subtle with --color-{role}-identity-bg tokens once defined in design system */}
        <div className="flex h-[88px] w-full gap-1 overflow-hidden rounded-xl">
          <div
            className="bg-fixed-subtle flex h-full flex-col justify-between p-3"
            style={{ width: `${fixedPct}%` }}
          >
            <p className="text-xs font-semibold text-fixed">{t("composition.fixedLabel")}</p>
            <div>
              <p dir="ltr" className="text-sm font-bold tabular-nums text-foreground">
                {formatAnalyticsCurrency(locale, fixedEgp)}
              </p>
              <p dir="ltr" className="text-xs tabular-nums text-text-tertiary">
                {fixedPct}%
              </p>
            </div>
          </div>

          <div
            className="bg-variable-subtle flex h-full flex-col justify-between p-3"
            style={{ width: `${variablePct}%` }}
          >
            <p className="text-xs font-semibold text-variable">{t("composition.variableLabel")}</p>
            <div>
              <p dir="ltr" className="text-sm font-bold tabular-nums text-foreground">
                {formatAnalyticsCurrency(locale, variableEgp)}
              </p>
              <p dir="ltr" className="text-xs tabular-nums text-text-tertiary">
                {variablePct}%
              </p>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div className="rounded-xl bg-surface-offset px-3 py-2">
          <p className="text-sm leading-[1.5] text-fixed text-pretty">
            {t("composition.committedAnnotation", { pct: fixedPct })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
