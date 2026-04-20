import { useTranslations } from "next-intl"
import { Cell, Pie, PieChart } from "recharts"

import { budgetChartConfig, budgetChartData } from "@/components/home/home-data"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export function BudgetOverviewCard() {
  const t = useTranslations("Home")

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="grid grid-cols-[7rem_1fr_1fr] items-center gap-3 px-4">
        <BudgetDonutChart />
        <BudgetColumn
          label={t("budget.variable")}
          value="7,960 EGP"
          caption={t("budget.variableCaption")}
          markerClassName="bg-brand"
        />
        <BudgetColumn
          label={t("budget.fixed")}
          value="1,240 EGP"
          caption={t("budget.fixedCaption")}
          markerClassName="bg-info"
        />
      </CardContent>
    </Card>
  )
}

function BudgetDonutChart() {
  return (
    <div className="relative size-28">
      <ChartContainer
        config={budgetChartConfig}
        className="size-28 aspect-square"
        initialDimension={{ width: 112, height: 112 }}
      >
        <PieChart accessibilityLayer>
          <Pie
            data={budgetChartData}
            dataKey="value"
            nameKey="name"
            innerRadius={38}
            outerRadius={52}
            paddingAngle={2}
            stroke="var(--color-card)"
            strokeWidth={3}
          >
            {budgetChartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold leading-none text-foreground tabular-nums">10,000</span>
        <span className="text-[0.6875rem] font-medium text-text-tertiary">EGP</span>
      </div>
    </div>
  )
}

function BudgetColumn({
  label,
  value,
  caption,
  markerClassName,
}: {
  label: string
  value: string
  caption: string
  markerClassName: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 text-start">
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 shrink-0 rounded-full", markerClassName)} />
        <p className="truncate text-xs font-semibold text-text-secondary">{label}</p>
      </div>
      <p className="truncate text-[1.0625rem] font-semibold leading-[1.25] text-foreground tabular-nums">
        {value}
      </p>
      <p className="line-clamp-2 text-[0.6875rem] leading-[1.3] text-text-tertiary">{caption}</p>
    </div>
  )
}
