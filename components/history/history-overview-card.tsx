import { useTranslations } from "next-intl";

import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes";
import { semanticTextClass } from "@/lib/semantic-styles";
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
    <div className={cn(heroSurfaceClass, "p-4")}>
      {/* Header row: title + subtle transaction count */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={cn("text-sm font-semibold", semanticTextClass.brand)}>
          {t("overview.title")}
        </p>
        <p className="text-[0.6875rem] tabular-nums text-text-tertiary">
          {t("overview.count", { count })}
        </p>
      </div>

      {/* Hero: total spent (primary figure) */}
      <p
        dir="ltr"
        className={cn(
          "mb-3 text-[1.375rem] font-semibold leading-none tabular-nums",
          semanticTextClass.expense,
        )}
      >
        {spent}
      </p>

      {/* Stat tiles: Spent | Received */}
      <div className="grid grid-cols-2 gap-2">
        <OverviewStat
          label={t("overview.spent")}
          value={spent}
          valueClass={semanticTextClass.expense}
        />
        <OverviewStat
          label={t("overview.received")}
          value={received}
          valueClass={semanticTextClass.income}
        />
      </div>
    </div>
  );
}

function OverviewStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1 text-start", statTileClass)}>
      <span className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </span>
      <span
        dir="ltr"
        className={cn(
          "truncate text-sm font-semibold tabular-nums text-foreground",
          valueClass,
        )}
      >
        {value}
      </span>
    </div>
  );
}
