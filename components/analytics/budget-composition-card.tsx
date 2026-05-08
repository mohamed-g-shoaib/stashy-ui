"use client"

import { useLocale, useTranslations } from "next-intl"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"

export function BudgetCompositionCard({ month }: { month: LiveMonthAnalysis }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const fixedEgp = month.fixedTotalBudget
  const totalBudget = month.monthlyBudget
  const variableEgp = totalBudget - fixedEgp
  const fixedPct = Math.round((fixedEgp / Math.max(1, totalBudget)) * 100)
  const variablePct = 100 - fixedPct

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">
              {t("composition.title")}
            </h2>
            <p className="max-w-[22ch] truncate text-xs leading-[1.35] text-text-tertiary">
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

        <div className="flex h-[88px] w-full gap-1 overflow-hidden rounded-xl">
          <div
            className="flex h-full flex-col justify-between bg-fixed-subtle p-3"
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
            className="flex h-full flex-col justify-between bg-variable-subtle p-3"
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
      </CardContent>
    </Card>
  )
}
