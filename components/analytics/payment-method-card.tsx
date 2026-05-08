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
  const [expandedRows, setExpandedRows] = React.useState<Record<"fixed" | "variable", boolean>>({
    fixed: false,
    variable: false,
  })

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
  const fixedManual =
    selectedMethod?.fixedByType?.manual ??
    month.paymentMethods.reduce((sum, method) => sum + (method.fixedByType?.manual ?? 0), 0)
  const fixedRecurring =
    selectedMethod?.fixedByType?.recurring ??
    month.paymentMethods.reduce((sum, method) => sum + (method.fixedByType?.recurring ?? 0), 0)
  const fixedInstallment =
    selectedMethod?.fixedByType?.installment ??
    month.paymentMethods.reduce((sum, method) => sum + (method.fixedByType?.installment ?? 0), 0)
  const displayTotal = variableWithMajor + fixed

  const fixedTypeRows = [
    { key: "recurring", label: t("fixed.type.recurring"), amount: fixedRecurring, barClass: "bg-fixed" },
    {
      key: "installment",
      label: t("fixed.type.installment"),
      amount: fixedInstallment,
      barClass: "bg-transfer",
    },
    { key: "manual", label: t("fixed.type.manual"), amount: fixedManual, barClass: "bg-warning" },
  ].filter((row) => row.amount > 0)

  const variableTypeRows = [
    { key: "variable", label: t("methods.variableLabel"), amount: variable, barClass: "bg-variable" },
    { key: "major", label: t("major.title"), amount: major, barClass: "bg-major" },
  ].filter((row) => row.amount > 0)

  const values = [fixed, variableWithMajor]
  const totalForPct = values.reduce((a, b) => a + b, 0)
  const shouldShowRow = (key: "fixed" | "variable") => (key === "fixed" ? fixed > 0 : variableWithMajor > 0)

  const toggleExpandedRow = (key: "fixed" | "variable") => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
              if (!shouldShowRow(key)) {
                return null
              }

            const pct = totalForPct > 0 ? Math.round((val / totalForPct) * 100) : 0
            const barWidthPct = totalForPct > 0 ? Math.round((val / totalForPct) * 100) : 0
              const detailRows = key === "fixed" ? fixedTypeRows : variableTypeRows
              const canToggleDetails = detailRows.length > 1
              const isExpanded = expandedRows[key]

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

                  {key === "fixed" ? (
                  <div className="space-y-1.5">
                    <div className="relative h-6 overflow-hidden rounded-[var(--radius-sm)] bg-surface-offset shadow-ring">
                      {val > 0 ? (
                        <div
                          className={cn(
                            "h-full overflow-hidden rounded-[var(--radius-sm)] transition-all duration-300",
                            barClass,
                          )}
                          style={{ width: `${barWidthPct}%` }}
                        />
                      ) : null}
                    </div>
                      {isExpanded && fixedTypeRows.length > 0 ? (
                      <div className="space-y-1">
                        {fixedTypeRows.map((row) => (
                          <div key={row.key} className="space-y-0.5">
                            <div className="flex items-center justify-between gap-2 text-[0.6875rem] text-text-tertiary">
                              <p>{row.label}</p>
                              <p dir="ltr" className="tabular-nums">
                                {formatAnalyticsCurrency(locale, row.amount)}
                              </p>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-surface-offset shadow-ring">
                              <div
                                className={cn("h-full rounded-full", row.barClass)}
                                style={{
                                    width: `${Math.round((row.amount / Math.max(1, fixed)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative h-6 overflow-hidden rounded-[var(--radius-sm)] bg-surface-offset shadow-ring">
                      {val > 0 ? (
                        <div
                          className="h-full overflow-hidden rounded-[var(--radius-sm)] bg-variable"
                          style={{ width: `${barWidthPct}%` }}
                        />
                      ) : null}
                    </div>
                      {isExpanded && variableTypeRows.length > 0 ? (
                      <div className="space-y-1">
                        {variableTypeRows.map((row) => (
                          <div key={row.key} className="space-y-0.5">
                            <div className="flex items-center justify-between gap-2 text-[0.6875rem] text-text-tertiary">
                              <p>{row.label}</p>
                              <p dir="ltr" className="tabular-nums">
                                {formatAnalyticsCurrency(locale, row.amount)}
                              </p>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-surface-offset shadow-ring">
                              <div
                                className={cn("h-full rounded-full", row.barClass)}
                                style={{
                                    width: `${Math.round((row.amount / Math.max(1, val)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 text-xs text-text-tertiary">
                  <div className="flex items-center gap-2">
                    {canToggleDetails ? (
                      <button
                        type="button"
                        onClick={() => toggleExpandedRow(key)}
                        aria-expanded={isExpanded}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[0.6875rem] font-medium transition-colors",
                          isExpanded
                            ? "border border-brand/30 bg-brand-subtle text-brand"
                            : "bg-surface-offset text-text-secondary",
                        )}
                      >
                        {isExpanded ? t("methods.hideDetails") : t("methods.showDetails")}
                      </button>
                    ) : null}
                  </div>
                  <p dir="ltr" className="tabular-nums text-foreground">
                    {pct}%
                  </p>
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
