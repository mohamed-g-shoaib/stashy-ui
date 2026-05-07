"use client"

import { useTranslations } from "next-intl"
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

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"

function getSpendingRhythmInsight(
  weeklySpend: number[],
  target: number,
  t: ReturnType<typeof useTranslations<"Analytics">>,
): string {
  const firstHalf = weeklySpend.slice(0, Math.floor(weeklySpend.length / 2))
  const secondHalf = weeklySpend.slice(Math.floor(weeklySpend.length / 2))
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  const allWithin20 = weeklySpend.every((w) => Math.abs(w - target) / target <= 0.2)
  const overWeeks = weeklySpend.filter((w) => w > target).length

  if (allWithin20) return t("rhythm.insightConsistent")
  if (overWeeks >= Math.ceil(weeklySpend.length / 2)) return t("rhythm.insightOverTarget")
  if (firstAvg > secondAvg * 1.15) return t("rhythm.insightHeavyStart")
  if (secondAvg > firstAvg * 1.15) return t("rhythm.insightHeavyEnd")
  return t("rhythm.insightConsistent")
}

export function SpendingRhythmCard({ month }: { month: AnalyticsMonth }) {
  const t = useTranslations("Analytics")

  // Real day-range labels: "1–7", "8–14", "15–21", "22–28", "29–30"
  const chartData = month.weeklySpend.map((spend, i) => ({
    week: `${i * 7 + 1}–${Math.min((i + 1) * 7, month.daysInMonth)}`,
    spend,
  }))

  const insight = getSpendingRhythmInsight(month.weeklySpend, month.weeklyBudgetTarget, t)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("rhythm.title")}</h2>
          <p className="text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("rhythm.subtitle")}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          {/* TODO: RTL axis reversal */}
          <BarChart data={chartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value} EGP`, "Spent"]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <ReferenceLine
              y={month.weeklyBudgetTarget}
              stroke="var(--color-text-tertiary)"
              strokeDasharray="4 3"
              label={{
                value: `${month.weeklyBudgetTarget} EGP`,
                position: "insideTopRight",
                fill: "var(--color-text-tertiary)",
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="spend"
              fill="var(--color-clay)"
              radius={[4, 4, 0, 0]}
              label={{
                position: "top",
                formatter: (v: unknown) => `${v}`,
                fill: "var(--color-text-secondary)",
                fontSize: 10,
              }}
            />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">{insight}</p>
      </CardContent>
    </Card>
  )
}
