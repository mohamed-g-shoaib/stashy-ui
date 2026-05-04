import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type {
  HistoryTransaction,
  HistoryTransactionType,
} from "@/components/history/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { statTileClass } from "@/lib/design-system-classes";
import { semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

type HistoryRowProps = {
  transaction: HistoryTransaction;
};

type TypeTone = "neutral" | "stability" | "pressure";

const typeSemanticMap: Record<HistoryTransactionType, TypeTone> = {
  variable: "neutral",
  monthly: "stability",
  budget: "stability",
  major: "pressure",
  transfer: "neutral",
};

export function HistoryRow({ transaction }: HistoryRowProps) {
  const t = useTranslations("History");
  const typeTone = typeSemanticMap[transaction.typeCategory];
  const amountTone =
    transaction.direction === "received"
      ? semanticTextClass.recovery
      : transaction.direction === "expense"
        ? semanticTextClass.critical
        : semanticTextClass.neutral;

  const description = transaction.descriptionKey
    ? t(`transactions.${transaction.descriptionKey}`)
    : transaction.descriptionLabel;

  const budgetTypeLabel = transaction.budgetTypeKey
    ? t(`budgetTypes.${transaction.budgetTypeKey}`)
    : transaction.budgetTypeLabel;

  const fixedTypeLabel = transaction.fixedTypeKey
    ? t(`fixedTypes.${transaction.fixedTypeKey}`)
    : transaction.fixedTypeLabel;

  return (
    <Card size="sm" className="py-3 shadow-ring">
      <CardContent className="flex items-start gap-3 px-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
            semanticSurfaceClass[typeTone],
          )}
        >
          <HugeiconsIcon
            icon={transaction.methodIcon}
            size={22}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1 text-start">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p
                dir="ltr"
                className={cn(
                  "min-w-0 break-words text-[1.0625rem] font-semibold leading-[1.25] tabular-nums",
                  amountTone,
                )}
              >
                {transaction.amount}
              </p>
              {description ? (
                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  {description}
                </p>
              ) : null}
              {transaction.note ? (
                <p className="mt-1 text-xs leading-[1.5] text-text-tertiary text-pretty">
                  {transaction.note}
                </p>
              ) : null}
            </div>
            <time className={cn("shrink-0 text-end", statTileClass)}>
              <span className="block text-sm text-text-secondary">
                {transaction.date}
              </span>
            </time>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {budgetTypeLabel ? (
              <Badge variant={typeTone} className="text-[0.6875rem]">
                {budgetTypeLabel}
              </Badge>
            ) : null}
            {fixedTypeLabel ? (
              <Badge variant="neutral" className="text-[0.6875rem]">
                {fixedTypeLabel}
              </Badge>
            ) : null}
            {transaction.isAutoPay ? (
              <Badge variant="stability" className="text-[0.6875rem]">
                {t("labels.autoPay")}
              </Badge>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
