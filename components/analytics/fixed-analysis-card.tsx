"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type {
  AnalyticsData,
  FixedBucketActual,
  FixedBucketPlan,
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

type BucketRow = {
  plan: FixedBucketPlan
  actual: FixedBucketActual | null
  pct: number
}

function getBucketStatus(pct: number): "ok" | "warning" | "over" {
  if (pct > 100) return "over"
  if (pct >= 90) return "warning"
  return "ok"
}

function getBucketTrend(snapshots: MonthSnapshot[], bucketId: string): number[] {
  return snapshots
    .map((s) => {
      const plan = s.fixedBuckets.find((b) => b.id === bucketId)
      const actual = s.fixedBucketsActual.find((a) => a.id === bucketId)
      if (!plan || !actual) return null
      return Math.round((actual.spent / Math.max(1, plan.budget)) * 100)
    })
    .filter((x): x is number => x !== null)
    .reverse()
}

export function FixedAnalysisCard({ month, data }: FixedAnalysisCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const manualRows: BucketRow[] = month.fixedBuckets
    .filter((b) => b.type === "manual")
    .map((plan) => {
      const actual = month.fixedBucketsActual.find((a) => a.id === plan.id) ?? null
      const spent = actual?.spent ?? 0
      const pct = Math.round((spent / Math.max(1, plan.budget)) * 100)
      return { plan, actual, pct }
    })

  const autoBuckets = month.fixedBuckets.filter((b) => b.type !== "manual")
  const autoSpent = autoBuckets.reduce((sum, b) => {
    const actual = month.fixedBucketsActual.find((a) => a.id === b.id)
    return sum + (actual?.spent ?? 0)
  }, 0)
  const autoCount = autoBuckets.length
  const manualCount = manualRows.length
  const overCount = manualRows.filter((r) => r.pct > 100).length

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("fixed.title")}</h2>
          <p className="text-sm leading-[1.55] text-text-secondary text-pretty">
            {t("fixed.subtitle")}
          </p>
        </div>

        <p className="text-xs leading-[1.5] text-text-tertiary">
          {t("fixed.manualOverSummary", { over: overCount, total: manualCount })}
        </p>

        <div className="flex flex-col gap-2">
          {manualRows.map((row) => {
            const status = getBucketStatus(row.pct)
            const dotClass =
              status === "over"
                ? "bg-expense"
                : status === "warning"
                  ? "bg-warning"
                  : "bg-text-tertiary/60"
            const barClass =
              status === "over"
                ? semanticProgressClass.expense
                : status === "warning"
                  ? semanticProgressClass.warning
                  : semanticProgressClass.fixed
            const expanded = expandedId === row.plan.id
            const trend = expanded ? getBucketTrend(data.snapshots, row.plan.id) : []

            return (
              <button
                key={row.plan.id}
                type="button"
                onClick={() => setExpandedId(expanded ? null : row.plan.id)}
                className="flex min-h-12 flex-col gap-1.5 rounded-[var(--radius-sm)] bg-surface-offset px-3 py-2.5 text-start shadow-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", dotClass)} aria-hidden="true" />
                    <span className="text-sm font-semibold text-foreground">{row.plan.name}</span>
                  </span>
                  <span dir="ltr" className="text-xs tabular-nums text-text-secondary">
                    {formatAnalyticsCurrency(locale, row.actual?.spent ?? 0)} /{" "}
                    {formatAnalyticsCurrency(locale, row.plan.budget)}
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-card">
                  <div
                    className={cn("absolute inset-y-0 start-0 rounded-full", barClass)}
                    style={{ width: `${Math.min(100, row.pct)}%` }}
                  />
                </div>
                {expanded && trend.length > 0 ? (
                  <p
                    dir="ltr"
                    className="text-[0.6875rem] tabular-nums text-text-tertiary text-pretty"
                  >
                    {t("fixed.bucketTrendLabel")}: {trend.map((p) => `${p}%`).join(" → ")} →{" "}
                    <span className="font-semibold text-foreground">{row.pct}%</span>
                  </p>
                ) : null}
              </button>
            )
          })}
        </div>

        {month.fixedOverspend > 0 ? (
          <div className="rounded-[var(--radius-sm)] bg-warning-subtle px-3 py-2 shadow-ring">
            <p className={cn("text-sm leading-[1.5]", semanticTextClass.warning)}>
              {t("fixed.leakageCallout", {
                amount: formatAnalyticsCurrency(locale, month.fixedOverspend),
              })}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
          <span className="flex items-center gap-2 text-xs text-text-tertiary">
            <HugeiconsIcon icon={ArrowDown01Icon} aria-hidden="true" size={14} />
            {t("fixed.autoRecap", {
              count: autoCount,
              amount: formatAnalyticsCurrency(locale, autoSpent),
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
