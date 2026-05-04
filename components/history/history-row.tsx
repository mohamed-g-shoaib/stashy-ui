import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import type {
  HistoryTransaction,
  HistoryTransactionType,
} from "@/components/history/types";
import { semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

type HistoryRowProps = {
  transaction: HistoryTransaction;
  showDate?: boolean;
  isStandalone?: boolean;
};

type TypeTone = "neutral" | "stability" | "pressure";

const typeSemanticMap: Record<HistoryTransactionType, TypeTone> = {
  variable: "neutral",
  monthly: "stability",
  budget: "stability",
  major: "pressure",
  transfer: "neutral",
};

export function HistoryRow({
  transaction,
  showDate = false,
  isStandalone = false,
}: HistoryRowProps) {
  const t = useTranslations("History");
  const locale = useLocale();
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

  const fixedTypeLabel = transaction.fixedTypeKey
    ? t(`fixedTypes.${transaction.fixedTypeKey}`)
    : transaction.fixedTypeLabel;

  // Variable transactions are one-time logs without specific budget categories
  const isVariable = transaction.typeCategory === "variable";

  // Deduplicate description and fixedTypeLabel, but only for non-variable entries
  const showFixedLabel =
    !isVariable &&
    fixedTypeLabel &&
    description &&
    fixedTypeLabel.toLowerCase().trim() !== description.toLowerCase().trim();

  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
    [locale],
  );

  const displayDate = React.useMemo(() => {
    const d = new Date(transaction.dateISO);
    return isNaN(d.getTime()) ? transaction.date : dateFormatter.format(d);
  }, [transaction.dateISO, transaction.date, dateFormatter]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 transition-all active:scale-[0.98]",
        isStandalone 
          ? "rounded-[var(--radius-lg)] p-4 shadow-soft ring-1 ring-border-subtle/50" 
          : "rounded-xl p-3",
        semanticSurfaceClass[typeTone],
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-background/80 shadow-ring-sm",
          semanticTextClass[typeTone],
        )}
      >
        <HugeiconsIcon
          icon={transaction.methodIcon}
          size={20}
          aria-hidden="true"
        />
      </span>
      <div className="min-w-0 flex-1 text-start">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              dir="ltr"
              className={cn(
                "min-w-0 break-words font-bold leading-tight tabular-nums",
                isStandalone ? "text-[1.125rem]" : "text-base",
                amountTone,
              )}
            >
              {transaction.amount}
            </p>
            {description ? (
              <p className="mt-0.5 truncate text-[0.8125rem] font-semibold text-text-secondary">
                {description}
              </p>
            ) : null}
            {transaction.note ? (
              <p className="mt-1 text-[0.75rem] leading-normal text-text-tertiary/80 text-pretty">
                {transaction.note}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {showDate && (
              <span className="mb-0.5 text-[0.625rem] font-bold text-text-tertiary uppercase tracking-wider">
                {displayDate}
              </span>
            )}
            {transaction.isAutoPay && (
              <div className="flex items-center gap-1 text-[0.625rem] font-bold text-success uppercase tracking-wider">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                {t("labels.autoPay")}
              </div>
            )}
            {showFixedLabel && (
              <span className="text-[0.625rem] font-bold text-text-tertiary uppercase tracking-wider">
                {fixedTypeLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
