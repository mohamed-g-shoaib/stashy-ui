"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const typeRows = [
  { key: "fixed" as const, barClass: "bg-fixed", labelKey: "methods.fixedLabel" },
  { key: "variable" as const, barClass: "bg-variable", labelKey: "methods.variableLabel" },
] as const

export function PaymentMethodCard({ month }: { month: LiveMonthAnalysis }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>("all")

  const selectedMethod =
    selectedMethodId === "all"
      ? null
      : (month.paymentMethods.find((m) => m.id === selectedMethodId) ?? null)

  const aggregate = (key: "variable" | "fixed" | "major") =>
    selectedMethod ? selectedMethod[key] : month.paymentMethods.reduce((sum, m) => sum + m[key], 0)

  const variable = aggregate("variable")
  const major = aggregate("major")
  const variableWithMajor = variable + major
  const fixed = aggregate("fixed")
  const displayTotal = variableWithMajor + fixed

  const values = [fixed, variableWithMajor]
  const totalForPct = values.reduce((a, b) => a + b, 0)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
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

        <div className="flex flex-col gap-3">
          {typeRows.map(({ key, barClass, labelKey }, i) => {
            const val = values[i] ?? 0
            const pct = totalForPct > 0 ? Math.round((val / totalForPct) * 100) : 0
            const barWidthPct = totalForPct > 0 ? Math.round((val / totalForPct) * 100) : 0
            const pctInside = barWidthPct >= 22 && val > 0
            const variableCorePct =
              key === "variable" && val > 0
                ? Math.round((variable / Math.max(1, val)) * 100)
                : 0
            const majorPct =
              key === "variable" && val > 0
                ? Math.max(0, 100 - variableCorePct)
                : 0

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
                  {val > 0 ? (
                    <p dir="ltr" className="text-xs text-text-tertiary tabular-nums">
                      {formatAnalyticsCurrency(locale, val)}
                    </p>
                  ) : null}
                </div>

                <div className="relative h-9 overflow-hidden rounded-[var(--radius-sm)] bg-surface-offset shadow-ring">
                  {val > 0 ? (
                    <div className="relative h-full" style={{ width: `${barWidthPct}%` }}>
                      {key === "variable" ? (
                        <div className="flex h-full overflow-hidden rounded-[var(--radius-sm)]">
                          <span
                            className="h-full bg-variable"
                            style={{ width: `${variableCorePct}%` }}
                          />
                          <span className="h-full bg-major" style={{ width: `${majorPct}%` }} />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "h-full overflow-hidden rounded-[var(--radius-sm)] transition-all duration-300",
                            barClass,
                          )}
                        />
                      )}
                      {pctInside ? (
                        <p
                          dir="ltr"
                          className="absolute inset-y-0 end-3 z-10 flex items-center text-xs font-medium tabular-nums"
                          style={{ color: "var(--color-text-on-brand)" }}
                        >
                          {pct}%
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs leading-[1.5] text-text-tertiary text-pretty">
          {t("methods.footerNote")}
        </p>
      </CardContent>
    </Card>
  )
}
