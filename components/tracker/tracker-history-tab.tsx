"use client"

import { Calendar03Icon, FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { trackerTransactions } from "@/components/tracker/tracker-data"
import type { TrackerTransaction } from "@/components/tracker/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TrackerHistoryTabProps = {
  detailsFilterCount: number
  dateFilterCount: number
  onOpenDetailsFilter: () => void
  onOpenDateFilter: () => void
}

export function TrackerHistoryTab({
  detailsFilterCount,
  dateFilterCount,
  onOpenDetailsFilter,
  onOpenDateFilter,
}: TrackerHistoryTabProps) {
  const t = useTranslations("Tracker")

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-11 min-h-11 rounded-full px-3"
          onClick={onOpenDetailsFilter}
        >
          <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" aria-hidden="true" />
          {detailsFilterCount > 0
            ? t("history.detailsActive", { count: detailsFilterCount })
            : t("history.details")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-11 min-h-11 rounded-full px-3"
          onClick={onOpenDateFilter}
        >
          <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" aria-hidden="true" />
          {dateFilterCount > 0 ? t("history.dateActive") : t("history.date")}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {trackerTransactions.map((transaction) => (
          <HistoryRow
            key={`${transaction.descriptionKey}-${transaction.amount}`}
            transaction={transaction}
          />
        ))}
      </div>
      <Button type="button" variant="secondary" size="sm">
        {t("history.loadMore")}
      </Button>
    </div>
  )
}

function HistoryRow({ transaction }: { transaction: TrackerTransaction }) {
  const t = useTranslations("Tracker")

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-3 shadow-ring">
      <CardContent className="flex items-center gap-3 px-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
            transaction.methodTone === "cash" && "bg-surface-offset text-text-secondary",
            transaction.methodTone === "card" &&
              "bg-info-subtle text-info dark:bg-info-subtle-dark dark:text-info-dark",
            transaction.methodTone === "bank" &&
              "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark",
          )}
        >
          <HugeiconsIcon icon={transaction.methodIcon} aria-hidden="true" size={22} />
        </span>
        <div className="min-w-0 flex-1 text-start">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <p
              dir="ltr"
              className={cn(
                "min-w-0 flex-1 break-words text-[1.0625rem] font-semibold leading-[1.25] tabular-nums",
                transaction.direction === "received"
                  ? "text-success dark:text-success-dark"
                  : "text-brand dark:text-coral",
              )}
            >
              {transaction.amount}
            </p>
            <time className="shrink-0 text-end text-sm text-text-secondary">
              {transaction.date}
            </time>
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">
            {t(transaction.descriptionKey)} / {t(transaction.typeLabelKey)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
