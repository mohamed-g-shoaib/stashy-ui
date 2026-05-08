"use client"

import { useLocale, useTranslations } from "next-intl"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { formatAnalyticsMonthShort } from "@/components/analytics/formatters"
import type { AnalyticsData, LiveMonthAnalysis } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

interface MajorBehaviourCardProps {
  month: LiveMonthAnalysis
  data: AnalyticsData
}

export function MajorBehaviourCard({ month, data }: MajorBehaviourCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  // Build sparkline: oldest snapshot → newest snapshot → current MTD
  const orderedSnapshots = [...data.snapshots].reverse()
  const chartData = [
    ...orderedSnapshots.map((s) => ({
      label: formatAnalyticsMonthShort(locale, s.isoDate),
      pct: s.majorPctOfBudget,
      isMtd: false,
    })),
    {
      label: formatAnalyticsMonthShort(locale, month.isoDate),
      pct: month.majorPctOfBudget,
      isMtd: month.status === "inProgress",
    },
  ]

  const previousSnapshot = data.snapshots[0]
  const delta = previousSnapshot ? month.majorPctOfBudget - previousSnapshot.majorPctOfBudget : null
  const escapeValve =
    previousSnapshot && month.majorPctOfBudget >= 25 && previousSnapshot.majorPctOfBudget < 25

  const deltaClass =
    delta === null || delta === 0
      ? "text-text-secondary"
      : delta > 0
        ? semanticTextClass.expense
        : semanticTextClass.income

  const deltaText =
    delta === null
      ? null
      : delta === 0
        ? t("major.deltaNeutral")
        : delta > 0
          ? t("major.deltaPositive", { delta })
          : t("major.deltaNegative", { delta })

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("major.title")}</h2>
          <p className="text-sm leading-[1.55] text-text-secondary text-pretty">
            {t("major.subtitle")}
          </p>
        </div>

        <div className="flex items-end gap-3">
          <p
            dir="ltr"
            className="text-[2.25rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-major"
          >
            {month.majorPctOfBudget}%
          </p>
          <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
            {month.status === "inProgress" ? t("major.heroMtd") : t("major.heroFinal")}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value}%`, ""]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMtd ? "var(--color-major-subtle)" : "var(--color-major)"}
                  stroke={entry.isMtd ? "var(--color-major)" : "transparent"}
                  strokeDasharray={entry.isMtd ? "3 3" : "0"}
                  strokeWidth={entry.isMtd ? 1 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {deltaText ? (
          <p className={cn("text-sm font-semibold tabular-nums", deltaClass)}>{deltaText}</p>
        ) : null}

        {escapeValve ? (
          <p
            className={cn(
              "rounded-[var(--radius-sm)] bg-warning-subtle px-3 py-2 text-sm leading-[1.5] shadow-ring",
              semanticTextClass.warning,
            )}
          >
            {t("major.escapeValveHint")}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
