"use client"

import * as React from "react"

import { useLocale, useTranslations } from "next-intl"

import type { AnalyticsMonth, PaymentMethodFilter } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { formatAnalyticsCurrency } from "./formatters"

const filterBarClass: Record<PaymentMethodFilter, string> = {
  all: "bg-brand",
  variable: "bg-variable",
  fixed: "bg-fixed",
  major: "bg-major",
}

export function PaymentMethodCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [filter, setFilter] = React.useState<PaymentMethodFilter>("all")

  const activeDataKey = filter === "all" ? "total" : filter

  // Static — always the grand total regardless of active filter
  const overallTotal = month.paymentMethods.reduce((sum, m) => sum + m.total, 0)

  // Changes with filter — drives bar widths and percentages
  const valuesForFilter = month.paymentMethods.map(
    (m) => Number(m[activeDataKey as keyof typeof m]),
  )
  const maxForFilter = Math.max(...valuesForFilter, 1)
  const totalForFilter = valuesForFilter.reduce((a, b) => a + b, 0)

  const filters: { value: PaymentMethodFilter; label: string }[] = [
    { value: "all", label: t("methods.filterAll") },
    { value: "variable", label: t("methods.filterVariable") },
    { value: "fixed", label: t("methods.filterFixed") },
    { value: "major", label: t("methods.filterMajor") },
  ]

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header with static overall total */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("methods.title")}</h2>
            <p className="mt-0.5 text-sm text-text-secondary">{t("methods.subtitle")}</p>
          </div>
          <div className="shrink-0 text-end">
            <p dir="ltr" className="text-[1.125rem] font-semibold tabular-nums text-foreground">
              {formatAnalyticsCurrency(locale, overallTotal)}
            </p>
            <p className="text-xs text-text-tertiary">{t("methods.totalLabel")}</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "min-h-12 rounded-full px-4 text-sm font-medium transition-colors",
                filter === value
                  ? "border border-brand/30 bg-brand-subtle text-brand"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bar rows */}
        <div className="flex flex-col gap-3">
          {month.paymentMethods.map((method, i) => {
            const val = valuesForFilter[i]
            const pct = totalForFilter > 0 ? Math.round((val / totalForFilter) * 100) : 0
            const barWidthPct = Math.round((val / maxForFilter) * 100)
            const pctInside = barWidthPct >= 28 && val > 0

            return (
              <div key={method.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      val === 0 ? "text-text-tertiary" : "text-foreground",
                    )}
                  >
                    {method.name}
                  </p>
                  {val > 0 && (
                    <p dir="ltr" className="text-xs text-text-tertiary tabular-nums">
                      {formatAnalyticsCurrency(locale, val)}
                    </p>
                  )}
                </div>

                <div className="relative h-9 overflow-hidden rounded-[var(--radius-sm)] bg-surface-offset shadow-ring">
                  {val > 0 && (
                    <div
                      className={cn(
                        "flex h-full items-center justify-end rounded-[var(--radius-sm)] pe-3 transition-all duration-300",
                        filterBarClass[filter],
                      )}
                      style={{ width: `${barWidthPct}%` }}
                    >
                      {pctInside && (
                        <p
                          dir="ltr"
                          className="text-xs font-medium tabular-nums"
                          style={{ color: "var(--color-text-on-brand)" }}
                        >
                          {pct}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs leading-[1.5] text-text-tertiary">{t("methods.fixedNote")}</p>
      </CardContent>
    </Card>
  )
}
