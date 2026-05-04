import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { statTileClass } from "@/lib/design-system-classes";
import {
  semanticProgressClass,
  semanticSurfaceClass,
  semanticTextClass,
} from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

export function BudgetOverviewCard({
  majorScenario,
}: {
  majorScenario?: "active" | "none";
}) {
  const t = useTranslations("Home");
  const majorAmount = 3000;
  const variableBudget = 7960;
  const percentage = Math.round((majorAmount / variableBudget) * 100);

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className={cn("flex items-center", statTileClass)}>
          <BudgetTotal label={t("budget.total")} value="10,000 EGP" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <BudgetMetric
            label={t("budget.variable")}
            value="7,960 EGP"
            caption={t("budget.variableCaption")}
            markerClassName={semanticProgressClass.variable}
            valueClassName={semanticTextClass.variable}
          />
          <BudgetMetric
            label={t("budget.fixed")}
            value="1,240 EGP"
            caption={t("budget.fixedCaption")}
            markerClassName={semanticProgressClass.fixed}
            valueClassName={semanticTextClass.fixed}
          />
        </div>

        {majorScenario === "active" && (
          <div
            className={cn(
              "flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2.5 shadow-ring",
              semanticSurfaceClass.warning,
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  semanticProgressClass.major,
                )}
              />
              <p className="text-xs font-semibold">
                {majorAmount.toLocaleString()} EGP {t("major.title")}
              </p>
            </div>
            <p className="text-xs font-bold">{percentage}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BudgetTotal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 text-start">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-text-tertiary uppercase">
        {label}
      </p>
      <p
        dir="ltr"
        className="mt-2 truncate text-2xl font-semibold leading-[1.05] text-foreground tabular-nums"
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
    <div
      className={cn("flex min-w-0 flex-col gap-1 text-start", statTileClass)}
    >
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
