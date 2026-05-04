import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

type HistoryOverviewCardProps = {
  spent: string;
  received: string;
  count: number;
};

export function HistoryOverviewCard({
  spent,
  received,
  count,
}: HistoryOverviewCardProps) {
  const t = useTranslations("History");

  return (
    <Card size="sm" className="py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">
            {t("overview.title")}
          </h2>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-brand uppercase shadow-ring",
              "bg-brand-subtle",
            )}
          >
            {t("overview.count", { count })}
          </span>
        </div>
        <div className={cn("grid grid-cols-3 gap-2 p-3", heroSurfaceClass)}>
          <OverviewStat label={t("overview.spent")} value={spent} />
          <OverviewStat label={t("overview.received")} value={received} />
          <OverviewStat
            label={t("overview.transactions")}
            value={t("overview.count", { count })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", statTileClass)}>
      <span className="truncate text-[0.6875rem] font-semibold tracking-[0.14em] text-text-tertiary uppercase">
        {label}
      </span>
      <span
        dir="ltr"
        className="truncate text-[0.9375rem] font-semibold text-foreground tabular-nums"
      >
        {value}
      </span>
    </div>
  );
}
