"use client"

import { useLocale, useTranslations } from "next-intl"
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis } from "@/components/analytics/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

export function ProjectionCard({ month }: { month: LiveMonthAnalysis }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const confidence = getProjectionConfidence(month.projectionConfidenceDay)
  const isEarly = confidence === "early"
  const isOverBudget = month.projectedEndSpend > month.effectiveVariableBudget

  const actualSpent = month.totalVariableSpent + month.fixedTotalSpent + month.majorTotal
  const dailyBudget = Math.round(month.effectiveVariableBudget / month.daysInMonth)
  const isOverDailyRate = month.avgDailySpend > dailyBudget

  const daysTracked = month.projectionConfidenceDay
  const dailyActualRate = daysTracked > 0 ? actualSpent / daysTracked : 0

  const trajectoryData = Array.from({ length: month.daysInMonth + 1 }, (_, day) => ({
    day,
    actual: day <= daysTracked ? Math.round(dailyActualRate * day) : null,
    projected:
      day >= daysTracked
        ? Math.round(actualSpent + (day - daysTracked) * month.avgDailySpend)
        : null,
  }))

  const savingsRate = Math.max(0, Math.min(100, month.projectedSavingsRate))
  const gaugeDeg = Math.round(savingsRate * 3.6)
  const gaugeColor = isOverBudget ? "var(--color-expense)" : "var(--color-income)"

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("projection.title")}</h2>

        {/* Chart 1 — Spend trajectory */}
        <div className="space-y-2">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trajectoryData} margin={{ top: 16, right: 4, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                ticks={[1, daysTracked, month.daysInMonth]}
                tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                hide
                domain={[
                  0,
                  Math.max(month.effectiveVariableBudget * 1.1, month.projectedEndSpend * 1.05),
                ]}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatAnalyticsCurrency(locale, Number(value)),
                  name === "actual"
                    ? t("projection.forecastSpent")
                    : t("projection.forecastProjected"),
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={month.effectiveVariableBudget}
                stroke="var(--color-text-tertiary)"
                strokeDasharray="4 3"
                label={{
                  value: formatAnalyticsCurrency(locale, month.effectiveVariableBudget),
                  position: "insideTopRight",
                  fill: "var(--color-text-tertiary)",
                  fontSize: 10,
                }}
              />
              {/* Actual spend — solid area up to today */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="var(--color-expense)"
                strokeWidth={1.5}
                fill="var(--color-expense-subtle)"
                fillOpacity={0.5}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
              {/* Projected spend — dashed extension from today to month end */}
              <Area
                type="monotone"
                dataKey="projected"
                stroke="var(--color-warning)"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                fill="var(--color-warning-subtle)"
                fillOpacity={0.35}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Two tiles: daily pace + savings gauge */}
        <div className="grid grid-cols-2 gap-2">
          {/* Daily pace */}
          <div className={cn(statTileClass, "flex flex-col gap-1.5")}>
            <p className="text-[0.6875rem] font-medium text-text-tertiary">
              {t("projection.dailyPaceLabel")}
            </p>
            <p
              dir="ltr"
              className={cn(
                "text-base font-bold tabular-nums",
                isOverDailyRate ? semanticTextClass.expense : semanticTextClass.income,
              )}
            >
              {formatAnalyticsCurrency(locale, month.avgDailySpend)}
            </p>
            <p dir="ltr" className="text-[0.6875rem] tabular-nums text-text-tertiary">
              {t("projection.dailyBudgetLine", {
                amount: formatAnalyticsCurrency(locale, dailyBudget),
              })}
            </p>
            <p
              className={cn(
                "text-[0.6875rem] font-semibold",
                isOverDailyRate ? semanticTextClass.expense : semanticTextClass.income,
              )}
            >
              {isOverDailyRate ? t("projection.overTarget") : t("projection.underTarget")}
            </p>
          </div>

          {/* Chart 2 — Savings rate gauge (CSS conic) */}
          <div className={cn(statTileClass, "flex flex-col items-center justify-center gap-2")}>
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                background: `conic-gradient(${gaugeColor} ${gaugeDeg}deg, var(--color-border) ${gaugeDeg}deg)`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full bg-surface-offset"
                style={{ width: 46, height: 46 }}
              >
                <p
                  dir="ltr"
                  className={cn(
                    "text-sm font-bold tabular-nums",
                    isOverBudget ? semanticTextClass.expense : semanticTextClass.income,
                  )}
                >
                  {savingsRate}%
                </p>
              </div>
            </div>
            <p className="text-center text-[0.6875rem] font-medium text-text-secondary">
              {t("projection.projectedSavingsLabel")}
            </p>
          </div>
        </div>

        {/* Low confidence warning */}
        {isEarly && (
          <Badge
            variant="warning"
            className="h-auto w-fit rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
          >
            {t("projection.lowConfidenceBadge")}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export function AnalyticsUpgradeGate() {
  const t = useTranslations("Analytics")
  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center gap-5 text-center">
      <LockIllustration />
      <div className={cn("w-full max-w-[20rem] p-5", heroSurfaceClass)}>
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-brand-subtle px-3 py-1 shadow-ring">
          <span className="size-2 rounded-full bg-brand" />
          <span className="h-2 w-12 rounded-full bg-brand/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-[1.375rem] font-semibold leading-[1.2] text-foreground text-balance">
            {t("upgrade.title")}
          </h2>
          <p className="mx-auto max-w-[26ch] text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("upgrade.description")}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-8 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-12 rounded-full bg-brand/45" />
          </div>
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-7 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-10 rounded-full bg-injection/40" />
          </div>
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-9 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-11 rounded-full bg-warning/45" />
          </div>
        </div>
        <Button type="button" className="mt-5 min-w-40">
          {t("upgrade.cta")}
        </Button>
      </div>
    </div>
  )
}

function LockIllustration() {
  return (
    <div className="relative flex size-24 items-center justify-center rounded-full bg-brand-subtle shadow-ring">
      <div className="absolute inset-3 rounded-full border border-brand/20" />
      <div className="relative h-12 w-10 rounded-sm border-2 border-brand bg-card shadow-ring">
        <div className="absolute start-1/2 top-[-1.2rem] h-7 w-6 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-brand" />
        <div className="absolute start-1/2 top-[1.05rem] size-2.5 -translate-x-1/2 rounded-full bg-brand" />
        <div className="absolute start-1/2 top-[1.5rem] h-3 w-1 -translate-x-1/2 rounded-full bg-brand" />
      </div>
    </div>
  )
}

function getProjectionConfidence(day: number): "early" | "sweet" | "late" {
  if (day <= 5) return "early"
  if (day >= 25) return "late"
  return "sweet"
}
