import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

import { budgetChartData } from "@/components/home/home-data";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export function BudgetOverviewCard() {
  const t = useTranslations("Home");

  return (
    <Card
      size="sm"
      className="rounded-md border border-border bg-card py-4 shadow-soft"
    >
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between gap-4">
          <BudgetPieChart />
          <BudgetTotal label={t("budget.total")} value="10,000 EGP" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <BudgetMetric
            label={t("budget.variable")}
            value="7,960 EGP"
            caption={t("budget.variableCaption")}
            markerClassName="bg-brand"
            valueClassName="text-brand"
          />
          <BudgetMetric
            label={t("budget.fixed")}
            value="1,240 EGP"
            caption={t("budget.fixedCaption")}
            markerClassName="bg-info"
            valueClassName="text-info dark:text-info-dark"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetPieChart() {
  return (
    <ChartContainer
      config={{}}
      className="size-32 shrink-0"
      initialDimension={{ width: 128, height: 128 }}
    >
      <PieChart accessibilityLayer>
        <Pie
          data={budgetChartData}
          dataKey="value"
          nameKey="name"
          outerRadius={48}
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
  );
}

function BudgetTotal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 text-start">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className="mt-1 truncate text-2xl font-semibold leading-[1.1] text-foreground tabular-nums"
      >
        {value}
      </p>
    </div>
  );
}

function BudgetMetric({
  label,
  value,
  caption,
  markerClassName,
  valueClassName,
}: {
  label: string;
  value: string;
  caption: string;
  markerClassName: string;
  valueClassName: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-sm bg-surface-offset p-3 text-start shadow-ring">
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 shrink-0 rounded-full", markerClassName)} />
        <p className="text-xs font-semibold text-text-secondary">{label}</p>
      </div>
      <p
        dir="ltr"
        className={cn(
          "mt-0.5 truncate text-[1.0625rem] font-semibold leading-[1.25] tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </p>
      <p className="text-[0.6875rem] leading-[1.3] text-text-secondary">
        {caption}
      </p>
    </div>
  );
}
