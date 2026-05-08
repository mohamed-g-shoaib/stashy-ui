"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { AnalyticsData, LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticProgressClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

interface FixedAnalysisCardProps {
  month: LiveMonthAnalysis
  data: AnalyticsData
}

type FixedTypeKey = "manual" | "recurring" | "installment"

const typeKeys: FixedTypeKey[] = ["manual", "recurring", "installment"]

function getTypeSpent(month: LiveMonthAnalysis, type: FixedTypeKey): number {
  return month.fixedBuckets
    .filter((bucket) => bucket.type === type)
    .reduce((sum, bucket) => {
      const actual = month.fixedBucketsActual.find((item) => item.id === bucket.id)
      return sum + (actual?.spent ?? 0)
    }, 0)
}

function getTypeBudget(month: LiveMonthAnalysis, type: FixedTypeKey): number {
  return month.fixedBuckets
    .filter((bucket) => bucket.type === type)
    .reduce((sum, bucket) => sum + bucket.budget, 0)
}

export function FixedAnalysisCard({ month, data }: FixedAnalysisCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [selectedType, setSelectedType] = React.useState<FixedTypeKey>("manual")
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>("all")

  const totalFixed = month.fixedTotalSpent
  const selectedTypeSpent = getTypeSpent(month, selectedType)
  const selectedTypeBudget = getTypeBudget(month, selectedType)
  const selectedTypeShare = Math.round((selectedTypeSpent / Math.max(1, totalFixed)) * 100)
  const selectedTypeUsage = Math.round((selectedTypeSpent / Math.max(1, selectedTypeBudget)) * 100)

  const methodRows = month.paymentMethods
    .map((method) => ({
      id: method.id,
      name: method.name,
      amount: method.fixedByType?.[selectedType] ?? 0,
    }))
    .filter((method) => method.amount > 0)

  const visibleMethodRows =
    selectedMethodId === "all"
      ? methodRows
      : methodRows.filter((method) => method.id === selectedMethodId)

  const selectedMethodTotal =
    selectedMethodId === "all"
      ? selectedTypeSpent
      : (methodRows.find((method) => method.id === selectedMethodId)?.amount ?? 0)

  const manualBuckets = month.fixedBuckets
    .filter((bucket) => bucket.type === "manual")
    .map((bucket) => {
      const actual = month.fixedBucketsActual.find((item) => item.id === bucket.id)
      return {
        id: bucket.id,
        spent: actual?.spent ?? 0,
        budget: bucket.budget,
      }
    })

  const manualOver = manualBuckets.filter((bucket) => bucket.spent > bucket.budget).length
  const manualHistorySpent = data.snapshots.slice(0, 3).map((snapshot) =>
    snapshot.fixedBuckets
      .filter((bucket) => bucket.type === "manual")
      .reduce((sum, bucket) => {
        const actual = snapshot.fixedBucketsActual.find((item) => item.id === bucket.id)
        return sum + (actual?.spent ?? 0)
      }, 0),
  )
  const manualAvg =
    manualHistorySpent.length > 0
      ? Math.round(manualHistorySpent.reduce((sum, value) => sum + value, 0) / manualHistorySpent.length)
      : null
  const manualCurrent = getTypeSpent(month, "manual")
  const manualDelta = manualAvg === null ? 0 : manualCurrent - manualAvg

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("fixed.title")}</h2>
          <p className="text-sm leading-[1.5] text-text-secondary">{t("fixed.subtitle")}</p>
        </div>

        <div className="rounded-[var(--radius-md)] bg-surface-offset p-3 shadow-ring">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.totalLabel")}
              </p>
              <p dir="ltr" className="mt-1 text-[1.4rem] font-semibold leading-none tabular-nums text-foreground">
                {formatAnalyticsCurrency(locale, totalFixed)}
              </p>
            </div>
            <div className="text-end">
              <p dir="ltr" className="text-sm font-medium tabular-nums text-foreground">
                {formatAnalyticsCurrency(locale, selectedTypeSpent)}
              </p>
              <p className="text-xs text-text-tertiary">
                {t("fixed.selectedShare", {
                  type: t(`fixed.type.${selectedType}`),
                  share: selectedTypeShare,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {typeKeys.map((typeKey) => {
            const active = selectedType === typeKey
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => {
                  setSelectedType(typeKey)
                  setSelectedMethodId("all")
                }}
                className={cn(
                  "min-h-12 rounded-[var(--radius-sm)] px-3 py-2.5 text-start shadow-ring transition-colors active:scale-[0.96]",
                  active
                    ? "bg-card text-foreground shadow-[var(--shadow-soft)]"
                    : "bg-surface-offset text-text-secondary",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-brand" : "text-text-secondary",
                  )}
                >
                  {t(`fixed.type.${typeKey}`)}
                </p>
              </button>
            )
          })}
        </div>

        <div className="rounded-[var(--radius-md)] bg-card p-3 shadow-[var(--shadow-soft)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.focusLabel", { type: t(`fixed.type.${selectedType}`) })}
              </p>
              <p dir="ltr" className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                {formatAnalyticsCurrency(locale, selectedTypeSpent)}
              </p>
            </div>
            <div className="text-end">
              <p dir="ltr" className="text-sm tabular-nums text-text-secondary">
                {formatAnalyticsCurrency(locale, selectedTypeBudget)}
              </p>
              <p className="text-xs text-text-tertiary">{t("fixed.budgetLabel")}</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-offset">
            <div
              className={cn("h-full rounded-full", semanticProgressClass.fixed)}
              style={{ width: `${Math.min(selectedTypeUsage, 100)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-text-tertiary">
            <p>{t("fixed.usageSummary", { usage: selectedTypeUsage })}</p>
            <p dir="ltr" className="tabular-nums">
              {selectedTypeShare}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedMethodId("all")}
              className={cn(
                "min-h-12 shrink-0 rounded-full px-4 text-sm font-medium transition-colors active:scale-[0.96]",
                selectedMethodId === "all"
                  ? "border border-brand/30 bg-brand-subtle text-brand"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {t("methods.filterAll")}
            </button>
            {methodRows.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethodId(method.id)}
                className={cn(
                  "min-h-12 shrink-0 rounded-full px-4 text-sm font-medium transition-colors active:scale-[0.96]",
                  selectedMethodId === method.id
                    ? "border border-brand/30 bg-brand-subtle text-brand"
                    : "bg-surface-offset text-text-secondary",
                )}
              >
                {method.name}
              </button>
            ))}
          </div>

          <div className="rounded-[var(--radius-md)] bg-surface-offset p-3 shadow-ring">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {selectedMethodId === "all"
                  ? t("fixed.methodPanelTitle", { type: t(`fixed.type.${selectedType}`) })
                  : t("fixed.methodPanelFilteredTitle", {
                      method: methodRows.find((method) => method.id === selectedMethodId)?.name ?? "",
                    })}
              </p>
              <p dir="ltr" className="text-xs tabular-nums text-text-tertiary">
                {formatAnalyticsCurrency(locale, selectedMethodTotal)}
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {visibleMethodRows.map((method) => {
                const share = Math.round((method.amount / Math.max(1, selectedTypeSpent)) * 100)
                return (
                  <div key={method.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-foreground">{method.name}</p>
                      <p dir="ltr" className="text-xs tabular-nums text-text-tertiary">
                        {formatAnalyticsCurrency(locale, method.amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-card">
                        <div
                          className="h-full rounded-full bg-fixed"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <p dir="ltr" className="w-9 text-end text-xs tabular-nums text-text-tertiary">
                        {share}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {selectedType === "manual" ? (
          <div className="rounded-[var(--radius-md)] bg-card px-3 py-2.5 shadow-ring">
            <p className="text-sm text-text-secondary">
              {t("fixed.manualOverSummary", {
                over: manualOver,
                total: manualBuckets.length,
              })}
            </p>
            {manualAvg !== null ? (
              <p dir="ltr" className="mt-1 text-xs tabular-nums text-text-tertiary">
                {t("fixed.manualTrendVsHistory", {
                  delta: formatAnalyticsCurrency(locale, Math.abs(manualDelta)),
                  direction:
                    manualDelta > 0
                      ? t("fixed.trendDirection.up")
                      : manualDelta < 0
                        ? t("fixed.trendDirection.down")
                        : t("fixed.trendDirection.flat"),
                })}
              </p>
            ) : null}
          </div>
        ) : null}

        {month.fixedOverspend > 0 && selectedType === "manual" ? (
          <div className="rounded-[var(--radius-md)] bg-warning-subtle px-3 py-2 shadow-ring">
            <p className={cn("text-sm leading-[1.5]", semanticTextClass.warning)}>
              {t("fixed.leakageCallout", {
                amount: formatAnalyticsCurrency(locale, month.fixedOverspend),
              })}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
