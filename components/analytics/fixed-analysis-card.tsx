"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import {
  formatAnalyticsCurrency,
  formatAnalyticsSignedCurrency,
} from "@/components/analytics/formatters"
import type {
  AnalyticsData,
  FixedBucketType,
  LiveMonthAnalysis,
  MonthSnapshot,
} from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticProgressClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

interface FixedAnalysisCardProps {
  month: LiveMonthAnalysis
  data: AnalyticsData
}

const typeKeys: FixedBucketType[] = ["manual", "recurring", "installment"]

function getTypeSpent(
  month: Pick<LiveMonthAnalysis, "fixedBuckets" | "fixedBucketsActual">,
  type: FixedBucketType,
) {
  return month.fixedBuckets
    .filter((bucket) => bucket.type === type)
    .reduce((sum, bucket) => {
      const actual = month.fixedBucketsActual.find((item) => item.id === bucket.id)
      return sum + (actual?.spent ?? 0)
    }, 0)
}

function getTypeBudget(month: Pick<LiveMonthAnalysis, "fixedBuckets">, type: FixedBucketType) {
  return month.fixedBuckets
    .filter((bucket) => bucket.type === type)
    .reduce((sum, bucket) => sum + bucket.budget, 0)
}

function getTypeHistory(snapshot: MonthSnapshot, type: FixedBucketType) {
  return {
    spent: getTypeSpent(snapshot, type),
    budget: getTypeBudget(snapshot, type),
  }
}

export function FixedAnalysisCard({ month, data }: FixedAnalysisCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [selectedType, setSelectedType] = React.useState<FixedBucketType>("manual")

  const selectedTypeBudget = getTypeBudget(month, selectedType)
  const selectedTypeSpent = getTypeSpent(month, selectedType)
  const selectedTypeUsage = Math.round((selectedTypeSpent / Math.max(1, selectedTypeBudget)) * 100)
  const selectedTypeShare = Math.round(
    (selectedTypeSpent / Math.max(1, month.fixedTotalSpent)) * 100,
  )

  const selectedTypePrevious = data.snapshots[0] ? getTypeHistory(data.snapshots[0], selectedType) : null
  const previousDelta = selectedTypePrevious === null ? 0 : selectedTypeSpent - selectedTypePrevious.spent

  const selectedTypeHistory = data.snapshots.slice(0, 3).map((snapshot) => getTypeHistory(snapshot, selectedType))
  const selectedTypeAvg =
    selectedTypeHistory.length > 0
      ? Math.round(
          selectedTypeHistory.reduce((sum, item) => sum + item.spent, 0) /
            selectedTypeHistory.length,
        )
      : null
  const averageDelta = selectedTypeAvg === null ? 0 : selectedTypeSpent - selectedTypeAvg

  const transferSummary =
    selectedType === "manual"
      ? month.fixedTransfers?.find((transfer) => transfer.type === "manual" && transfer.total > 0) ?? null
      : null

  const manualBuckets = month.fixedBuckets
    .filter((bucket) => bucket.type === "manual")
    .map((bucket) => {
      const actual = month.fixedBucketsActual.find((item) => item.id === bucket.id)
      return {
        spent: actual?.spent ?? 0,
        budget: bucket.budget,
      }
    })
  const manualOver = manualBuckets.filter((bucket) => bucket.spent > bucket.budget).length

  const usageToneClass =
    selectedTypeUsage > 100
      ? semanticTextClass.expense
      : selectedTypeUsage >= 85
        ? semanticTextClass.warning
        : semanticTextClass.fixed
  const usageBarClass =
    selectedTypeUsage > 100
      ? semanticProgressClass.expense
      : selectedTypeUsage >= 85
        ? semanticProgressClass.warning
        : semanticProgressClass.fixed

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("fixed.title")}</h2>
          <p className="text-sm leading-[1.5] text-text-secondary">{t("fixed.subtitle")}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-md)] bg-surface-offset p-1 shadow-ring">
          {typeKeys.map((typeKey) => {
            const active = selectedType === typeKey
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => setSelectedType(typeKey)}
                className={cn(
                  "min-h-12 rounded-[calc(var(--radius-md)-4px)] px-3 py-2.5 text-center transition-colors active:scale-[0.96]",
                  active ? "bg-card shadow-[var(--shadow-soft)]" : "bg-transparent",
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

        <div className="rounded-[var(--radius-md)] bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.focusLabel", { type: t(`fixed.type.${selectedType}`) })}
              </p>
              <p
                dir="ltr"
                className="mt-1 text-[1.7rem] font-semibold leading-none tabular-nums text-foreground"
              >
                {formatAnalyticsCurrency(locale, selectedTypeBudget)}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">{t("fixed.heroCaption")}</p>
            </div>
            <div className="rounded-full bg-surface-offset px-3 py-1.5 shadow-ring">
              <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.spentLabel")}
              </p>
              <p
                dir="ltr"
                className={cn("mt-0.5 text-sm font-semibold tabular-nums", usageToneClass)}
              >
                {formatAnalyticsCurrency(locale, selectedTypeSpent)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-offset">
            <div
              className={cn("h-full rounded-full", usageBarClass)}
              style={{ width: `${Math.min(selectedTypeUsage, 100)}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[var(--radius-sm)] bg-surface-offset px-3 py-2">
              <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.usageLabel")}
              </p>
              <p dir="ltr" className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                {selectedTypeUsage}%
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] bg-surface-offset px-3 py-2">
              <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-text-tertiary">
                {t("fixed.shareLabel")}
              </p>
              <p dir="ltr" className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                {selectedTypeShare}%
              </p>
            </div>
          </div>
        </div>

        {selectedTypeAvg !== null ? (
          <div className="rounded-[var(--radius-md)] bg-surface-offset p-3 shadow-ring">
            <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-text-tertiary">
              {t("fixed.comparisonLabel")}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {selectedTypePrevious !== null ? (
                <div className="rounded-[var(--radius-sm)] bg-card px-3 py-2.5 shadow-ring">
                  <p className="text-xs text-text-tertiary">{t("fixed.previousMonthLabel")}</p>
                  <p
                    dir="ltr"
                    className={cn(
                      "mt-1 text-sm font-semibold tabular-nums",
                      previousDelta > 0
                        ? semanticTextClass.expense
                        : previousDelta < 0
                          ? semanticTextClass.income
                          : "text-foreground",
                    )}
                  >
                    {formatAnalyticsSignedCurrency(locale, previousDelta)}
                  </p>
                </div>
              ) : null}
              <div className="rounded-[var(--radius-sm)] bg-card px-3 py-2.5 shadow-ring">
                <p className="text-xs text-text-tertiary">{t("fixed.threeMonthLabel")}</p>
                <p
                  dir="ltr"
                  className={cn(
                    "mt-1 text-sm font-semibold tabular-nums",
                    averageDelta > 0
                      ? semanticTextClass.expense
                      : averageDelta < 0
                        ? semanticTextClass.income
                        : "text-foreground",
                  )}
                >
                  {formatAnalyticsSignedCurrency(locale, averageDelta)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {transferSummary ? (
          <div className="rounded-[var(--radius-md)] bg-transfer-subtle p-3 shadow-ring">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-transfer">
                  {t("fixed.transferLabel")}
                </p>
                <p dir="ltr" className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                  {formatAnalyticsCurrency(locale, transferSummary.total)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">{t("fixed.transferCaption")}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {transferSummary.sources.map((source) => (
                <div
                  key={source.bucketId}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] bg-card px-3 py-2 shadow-ring"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{source.name}</p>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {t("fixed.transferRouteCaption")}
                    </p>
                  </div>
                  <p dir="ltr" className="text-xs tabular-nums text-transfer">
                    {formatAnalyticsCurrency(locale, source.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {selectedType === "manual" ? (
          <div className="rounded-[var(--radius-md)] bg-card px-3 py-2.5 shadow-ring">
            <p className="text-sm text-text-secondary">
              {t("fixed.manualOverSummary", {
                over: manualOver,
                total: manualBuckets.length,
              })}
            </p>
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
