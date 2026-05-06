"use client"

import * as React from "react"

import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { AnalyticsMonth, PaymentMethodFilter } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PaymentMethodCard({ month }: { month: AnalyticsMonth }) {
  const t = useTranslations("Analytics")
  const [filter, setFilter] = React.useState<PaymentMethodFilter>("all")

  const activeDataKey = filter === "all" ? "total" : filter
  const chartHeight = month.paymentMethods.length * 52

  const filters: { value: PaymentMethodFilter; label: string }[] = [
    { value: "all", label: t("methods.filterAll") },
    { value: "variable", label: t("methods.filterVariable") },
    { value: "fixed", label: t("methods.filterFixed") },
    { value: "major", label: t("methods.filterMajor") },
  ]

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="space-y-1">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("methods.title")}</h2>
          <p className="text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("methods.subtitle")}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "min-h-12 rounded-full px-4 text-sm font-medium transition-colors",
                filter === value
                  ? "border border-brand/30 bg-brand-subtle text-brand"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={chartHeight}>
          {/* TODO: RTL bar direction */}
          <BarChart
            layout="vertical"
            data={month.paymentMethods}
            margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--color-border-subtle)" />
            <YAxis
              dataKey="name"
              type="category"
              width={90}
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
              axisLine={false}
              tickLine={false}
            />
            <XAxis type="number" hide />
            <Tooltip
              formatter={(value) => [`${value} EGP`, activeDataKey]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey={activeDataKey}
              fill="var(--color-clay)"
              radius={[0, 4, 4, 0]}
              label={{
                position: "right",
                formatter: (v: unknown) => (Number(v) > 0 ? `${v} EGP` : ""),
                fill: "var(--color-text-tertiary)",
                fontSize: 11,
              }}
            />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-xs leading-[1.5] text-text-tertiary">{t("methods.fixedNote")}</p>
      </CardContent>
    </Card>
  )
}
