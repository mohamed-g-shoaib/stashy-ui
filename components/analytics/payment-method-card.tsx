"use client"

import * as React from "react"

import { useLocale, useTranslations } from "next-intl"

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { formatAnalyticsCurrency } from "./formatters"

const typeRows = [
  { key: "variable" as const, barClass: "bg-variable", labelKey: "methods.filterVariable" },
  { key: "fixed" as const, barClass: "bg-fixed", labelKey: "methods.filterFixed" },
  { key: "major" as const, barClass: "bg-major", labelKey: "methods.filterMajor" },
] as const

export function PaymentMethodCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>("all")

  const selectedMethod =
    selectedMethodId === "all"
      ? null
      : (month.paymentMethods.find((m) => m.id === selectedMethodId) ?? null)

  const displayTotal = selectedMethod
    ? selectedMethod.total
    : month.paymentMethods.reduce((sum, m) => sum + m.total, 0)

  const typeValues = typeRows.map(({ key }) =>
    selectedMethod
      ? selectedMethod[key]
      : month.paymentMethods.reduce((sum, m) => sum + m[key], 0),
  )
  const maxValue = Math.max(...typeValues, 1)
  const totalForPct = typeValues.reduce((a, b) => a + b, 0)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header — total updates with selected method */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("methods.title")}</h2>
            <p className="mt-0.5 text-sm text-text-secondary">{t("methods.subtitle")}</p>
          </div>
          <div className="shrink-0 text-end">
            <p dir="ltr" className="text-[1.125rem] font-semibold tabular-nums text-foreground">
              {formatAnalyticsCurrency(locale, displayTotal)}
            </p>
            <p className="text-xs text-text-tertiary">{t("methods.totalLabel")}</p>
          </div>
        </div>

        {/* Method filter chips — horizontally swipeable */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setSelectedMethodId("all")}
            className={cn(
              "min-h-12 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
              selectedMethodId === "all"
                ? "border border-brand/30 bg-brand-subtle text-brand"
                : "bg-surface-offset text-text-secondary",
            )}
          >
            {t("methods.filterAll")}
          </button>
          {month.paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethodId(method.id)}
              className={cn(
                "min-h-12 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
                selectedMethodId === method.id
                  ? "border border-brand/30 bg-brand-subtle text-brand"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {method.name}
            </button>
          ))}
        </div>

        {/* Type bar rows — always Variable / Fixed / Major with their semantic colors */}
        <div className="flex flex-col gap-3">
          {typeRows.map(({ key, barClass, labelKey }, i) => {
            const val = typeValues[i]
            const pct = totalForPct > 0 ? Math.round((val / totalForPct) * 100) : 0
            const barWidthPct = Math.round((val / maxValue) * 100)
            const pctInside = barWidthPct >= 28 && val > 0

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      val === 0 ? "text-text-tertiary" : "text-foreground",
                    )}
                  >
                    {t(labelKey)}
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
                        barClass,
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
