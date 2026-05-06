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

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

import { formatAnalyticsMonthLabel } from "./formatters"

interface TrendsCardProps {
  months: AnalyticsMonth[]
  selectedMonth: AnalyticsMonth
  previousMonth: AnalyticsMonth | null
}

export function TrendsCard({ months, selectedMonth, previousMonth }: TrendsCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const chartData = months.map((m) => ({
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(
      new Date(m.isoDate + "T00:00:00"),
    ),
    rate: m.savingsRate,
    isSelected: m.id === selectedMonth.id,
  }))

  const delta = previousMonth ? selectedMonth.savingsRate - previousMonth.savingsRate : null

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("trends.title")}</h2>
        </div>

        {/* Q8 hero savings rate */}
        <div className="flex items-end gap-2">
          <p
            dir="ltr"
            className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground"
          >
            <span dir="ltr">{selectedMonth.savingsRate}%</span>
          </p>
          <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
            {t("trends.savingsRateLabel")}
          </p>
        </div>

        {/* Sparkline */}
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value}%`, t("trends.savingsRateLabel")]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--color-clay)"
              strokeWidth={2}
              dot={(props: {
                cx?: number
                cy?: number
                payload?: { month: string; isSelected: boolean }
              }) => {
                const { cx = 0, cy = 0, payload } = props
                const isSelected = payload?.isSelected ?? false
                const key = payload?.month ?? String(cx)
                return isSelected ? (
                  <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="var(--color-clay)"
                    stroke="var(--color-card)"
                    strokeWidth={2}
                  />
                ) : (
                  <circle key={key} cx={cx} cy={cy} r={3} fill="var(--color-clay)" />
                )
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Q9 delta annotation or no-previous-month CTA */}
        {previousMonth ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p
                dir="ltr"
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  delta !== null && delta > 0
                    ? semanticTextClass.income
                    : delta !== null && delta < 0
                      ? semanticTextClass.expense
                      : "text-text-secondary",
                )}
              >
                {delta === null || delta === 0
                  ? t("trends.deltaNeutral")
                  : delta > 0
                    ? t("trends.deltaPositive", { delta })
                    : t("trends.deltaNegative", { delta })}
              </p>
            </div>
            <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">
              {selectedMonth.baseRateChangeReason}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-[1.5] text-text-secondary text-pretty">
              {t("trends.closeMonthPrompt", {
                month: formatAnalyticsMonthLabel(locale, selectedMonth.isoDate),
              })}
            </p>
            <Button type="button" size="sm" className="w-fit">
              {t("trends.closeMonthCta", {
                month: formatAnalyticsMonthLabel(locale, selectedMonth.isoDate),
              })}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
