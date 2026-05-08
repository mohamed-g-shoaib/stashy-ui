"use client"

import { useLocale, useTranslations } from "next-intl"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { CloseMonthAction } from "@/components/analytics/close-month-action"
import {
  formatAnalyticsCurrency,
  formatAnalyticsMonthLabel,
  formatAnalyticsMonthShort,
} from "@/components/analytics/formatters"
import type { AnalyticsData, LiveMonthAnalysis } from "@/components/analytics/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

interface TrendsCardProps {
  data: AnalyticsData
  selectedMonth: LiveMonthAnalysis
}

type SparklinePoint = {
  label: string
  rate: number
  isMtd: boolean
}

export function TrendsCard({ data, selectedMonth }: TrendsCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const isFirstMonth = data.snapshots.length === 0

  // First-month state — scaffolded preview
  if (isFirstMonth) {
    return (
      <Card size="sm" className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <div className="space-y-1">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("trends.title")}</h2>
          </div>

          <div className="flex items-end gap-2 opacity-50">
            <p
              dir="ltr"
              className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-text-tertiary"
            >
              —
            </p>
            <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              {t("trends.savingsRateMtdLabel")}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="relative h-[120px] overflow-hidden rounded-[var(--radius-sm)] bg-surface-offset/60"
          >
            <div className="absolute inset-x-3 inset-y-6">
              <div className="h-px w-full bg-border-subtle" />
              <div className="mt-6 h-px w-full bg-border-subtle" />
              <div className="mt-6 h-px w-full bg-border-subtle" />
            </div>
            <div
              className="absolute inset-y-1/2 inset-x-3 h-px"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--color-border) 0 4px, transparent 4px 8px)",
              }}
            />
          </div>

          <p className="text-sm leading-[1.5] text-text-secondary text-pretty">
            {t("trends.firstMonthPrompt", {
              month: formatAnalyticsMonthLabel(locale, selectedMonth.isoDate),
            })}
          </p>
          <CloseMonthAction monthLabel={formatAnalyticsMonthLabel(locale, selectedMonth.isoDate)} />
        </CardContent>
      </Card>
    )
  }

  // Build sparkline data: oldest → newest snapshots → current MTD trailing point
  const orderedSnapshots = [...data.snapshots].reverse()
  const chartData: SparklinePoint[] = [
    ...orderedSnapshots.map((s) => ({
      label: formatAnalyticsMonthShort(locale, s.isoDate),
      rate: s.variableSavingsRate,
      isMtd: false,
    })),
    {
      label: formatAnalyticsMonthShort(locale, selectedMonth.isoDate),
      rate: selectedMonth.variableSavingsRateMtd,
      isMtd: selectedMonth.status === "inProgress",
    },
  ]

  // The "previous" snapshot = newest snapshot
  const previousSnapshot = data.snapshots[0] ?? null
  const heroRate = selectedMonth.variableSavingsRateMtd
  const heroLabel =
    selectedMonth.status === "inProgress"
      ? t("trends.savingsRateMtdLabel")
      : t("trends.savingsRateLabel")

  const delta = previousSnapshot ? heroRate - previousSnapshot.variableSavingsRate : null
  const previousLabel = previousSnapshot
    ? formatAnalyticsMonthShort(locale, previousSnapshot.isoDate)
    : ""
  const showAutoBadge = previousSnapshot?.closedBy === "auto"

  const baseRateReason = previousSnapshot
    ? selectedMonth.fixedTotalBudget !== previousSnapshot.fixedTotalBudget
      ? t("trends.baseRateChangedReason", {
          delta: formatAnalyticsCurrency(
            locale,
            Math.abs(selectedMonth.fixedTotalBudget - previousSnapshot.fixedTotalBudget),
          ),
        })
      : t("trends.baseRateUnchangedReason")
    : null

  const deltaText =
    delta === null
      ? null
      : delta === 0
        ? t("trends.deltaNeutral", { month: previousLabel })
        : delta > 0
          ? t("trends.deltaPositive", { delta, month: previousLabel })
          : t("trends.deltaNegative", { delta, month: previousLabel })

  const deltaClass =
    delta === null || delta === 0
      ? "text-text-secondary"
      : delta > 0
        ? semanticTextClass.income
        : semanticTextClass.expense

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("trends.title")}</h2>
          {showAutoBadge ? (
            <Badge
              variant="quiet"
              className="h-auto rounded-full px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.1em]"
            >
              {t("trends.autoClosedBadge")}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-end gap-2">
          <p
            dir="ltr"
            className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground"
          >
            {heroRate}%
          </p>
          <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
            {heroLabel}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value}%`, t("trends.savingsRateLabel")]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--color-clay)"
              strokeWidth={2}
              dot={(props: { cx?: number; cy?: number; payload?: SparklinePoint }) => {
                const { cx = 0, cy = 0, payload } = props
                const isMtd = payload?.isMtd ?? false
                const key = payload?.label ?? String(cx)
                return isMtd ? (
                  <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="var(--color-card)"
                    stroke="var(--color-clay)"
                    strokeWidth={2}
                    strokeDasharray="3 2"
                  />
                ) : (
                  <circle key={key} cx={cx} cy={cy} r={3} fill="var(--color-clay)" />
                )
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {deltaText ? (
          <div className="flex flex-col gap-1">
            <p dir="ltr" className={cn("text-sm font-semibold tabular-nums", deltaClass)}>
              {deltaText}
            </p>
            {baseRateReason ? (
              <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">
                {baseRateReason}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
