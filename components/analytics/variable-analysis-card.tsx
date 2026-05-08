"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatAnalyticsCurrency, formatAnalyticsDayLong } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Mode = "weekly" | "dayOfWeek"

function AxisTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value?: string }
}) {
  return (
    <text x={x} y={y + 12} textAnchor="middle" fontSize={11} fill="var(--color-text-tertiary)">
      {payload?.value ?? ""}
    </text>
  )
}

function getDotClass(index: number, daysTracked: number, overspentDaysMtd: number): string {
  const withinRateCount = daysTracked - overspentDaysMtd
  if (index < withinRateCount) return "bg-income/70"
  if (index < daysTracked) return "bg-expense/60"
  return "bg-surface-offset border border-border"
}

function getRhythmInsight(
  weeklySpend: number[],
  target: number,
  t: ReturnType<typeof useTranslations<"Analytics">>,
): string {
  if (weeklySpend.length === 0) return ""
  const firstHalf = weeklySpend.slice(0, Math.floor(weeklySpend.length / 2))
  const secondHalf = weeklySpend.slice(Math.floor(weeklySpend.length / 2))
  const firstAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0
  const secondAvg = secondHalf.length
    ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    : 0
  const allWithin20 = target > 0 && weeklySpend.every((w) => Math.abs(w - target) / target <= 0.2)
  const overWeeks = weeklySpend.filter((w) => w > target).length

  if (allWithin20) return t("variable.insightConsistent")
  if (overWeeks >= Math.ceil(weeklySpend.length / 2)) return t("variable.insightOverTarget")
  if (firstAvg > secondAvg * 1.15) return t("variable.insightHeavyStart")
  if (secondAvg > firstAvg * 1.15) return t("variable.insightHeavyEnd")
  return t("variable.insightConsistent")
}

export function VariableAnalysisCard({ month }: { month: LiveMonthAnalysis }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const [mode, setMode] = React.useState<Mode>("weekly")
  const isArabic = locale.startsWith("ar")

  const weeklyData = month.weeklySpend.map((spend, i) => ({
    label: `${i * 7 + 1}–${Math.min((i + 1) * 7, month.daysInMonth)}`,
    spend,
  }))

  const dowKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const
  const dowOrder = isArabic ? [6, 0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6]
  const dowData = dowOrder.map((dayIndex) => ({
    label: t(`variable.dow.${dowKeys[dayIndex] ?? "sun"}`),
    spend: month.dayOfWeekSpend[dayIndex] ?? 0,
  }))

  const dailyTargetForDow = month.baseDailyRate

  const heaviestDowIndex = month.dayOfWeekSpend.reduce(
    (maxIdx, val, idx, arr) => (val > arr[maxIdx]! ? idx : maxIdx),
    0,
  )
  const heaviestDowKey = dowKeys[heaviestDowIndex] ?? "sun"
  const heaviestDowSpend = month.dayOfWeekSpend[heaviestDowIndex] ?? 0

  const weeklyInsight = getRhythmInsight(month.weeklySpend, month.weeklyBudgetTarget, t)
  const dowInsight = t("variable.dowInsight", {
    day: t(`variable.dow.${heaviestDowKey}`),
    amount: formatAnalyticsCurrency(locale, heaviestDowSpend),
  })

  const showLargestDay =
    month.largestVariableDay !== null && month.largestVariableDay.amount > month.baseDailyRate * 1.5
  const largestDayRatio = showLargestDay
    ? (month.largestVariableDay!.amount / Math.max(1, month.baseDailyRate)).toFixed(1)
    : null

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">
              {t("variable.title")}
            </h2>
            <p className="text-sm leading-[1.55] text-text-secondary text-pretty">
              {t("variable.subtitle")}
            </p>
          </div>
          <div className="grid h-9 grid-cols-2 rounded-full bg-surface-offset p-0.5 text-xs font-medium shadow-ring">
            <button
              type="button"
              onClick={() => setMode("weekly")}
              className={cn(
                "min-h-8 rounded-full px-3 transition-colors",
                mode === "weekly" ? "bg-card text-foreground shadow-ring" : "text-text-secondary",
              )}
            >
              {t("variable.modeWeekly")}
            </button>
            <button
              type="button"
              onClick={() => setMode("dayOfWeek")}
              className={cn(
                "min-h-8 rounded-full px-3 transition-colors",
                mode === "dayOfWeek"
                  ? "bg-card text-foreground shadow-ring"
                  : "text-text-secondary",
              )}
            >
              {t("variable.modeDayOfWeek")}
            </button>
          </div>
        </div>

        <div dir="ltr">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={mode === "weekly" ? weeklyData : dowData}
              margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
            >
            <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="label"
                interval={0}
                minTickGap={0}
                height={30}
                tickMargin={6}
                tick={<AxisTick />}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => [formatAnalyticsCurrency(locale, Number(value)), ""]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={mode === "weekly" ? month.weeklyBudgetTarget : dailyTargetForDow}
                stroke="var(--color-text-tertiary)"
                strokeDasharray="4 3"
              />
              <Bar dataKey="spend" fill="var(--color-variable)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">
          {mode === "weekly" ? weeklyInsight : dowInsight}
        </p>

        <div className="space-y-2 border-t border-border-subtle pt-3">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
            {t("variable.dotGridLabel")}
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: month.daysInMonth }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-2.5 rounded-full",
                  getDotClass(i, month.daysTracked, month.overspentDaysMtd),
                )}
              />
            ))}
          </div>
          {month.overspentDaysMtd > 0 ? (
            <p className="text-xs text-text-tertiary">
              {t("variable.overspentDays", {
                overspent: month.overspentDaysMtd,
                tracked: month.daysTracked,
              })}
            </p>
          ) : null}
        </div>

        {showLargestDay && month.largestVariableDay ? (
          <p className="text-xs leading-[1.5] text-text-tertiary text-pretty">
            {t("variable.largestDayCallout", {
              date: formatAnalyticsDayLong(locale, month.largestVariableDay.date),
              amount: formatAnalyticsCurrency(locale, month.largestVariableDay.amount),
              ratio: largestDayRatio ?? "1",
            })}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
