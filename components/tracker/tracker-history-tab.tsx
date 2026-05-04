"use client"

import { FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { trackerTransactions as initialTrackerTransactions } from "@/components/tracker/tracker-data"
import type { TrackerTransaction } from "@/components/tracker/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TrackerHistoryTabProps = {
  filterCount: number
  filters: {
    type: string
    direction: string
    method: string
    preset: string
    from: string
    to: string
  }
  items?: TrackerTransaction[]
  onOpenFilter: () => void
}

export function TrackerHistoryTab({
  filterCount,
  filters,
  items = initialTrackerTransactions,
  onOpenFilter,
}: TrackerHistoryTabProps) {
  const t = useTranslations("Tracker")
  const appliedFilters = getAppliedFilters(t, filters)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-11 min-h-11 rounded-full px-3"
          onClick={onOpenFilter}
        >
          <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" aria-hidden="true" />
          {filterCount > 0
            ? t("history.filterActive", { count: filterCount })
            : t("history.filter")}
        </Button>
      </div>
      {filterCount > 0 ? (
        <Card size="sm" className="py-3 shadow-ring">
          <CardContent className="flex flex-col gap-3 px-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                {t("history.resultsSummary", { count: items.length })}
              </p>
              <button
                type="button"
                className="text-sm font-medium text-brand"
                onClick={onOpenFilter}
              >
                {t("history.adjustFilters")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-surface-offset px-2.5 py-1 text-[0.6875rem] font-medium text-text-secondary shadow-ring"
                >
                  {label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <div className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.map((transaction) => (
            <HistoryRow
              key={`${transaction.descriptionKey ?? transaction.descriptionLabel}-${transaction.amount}-${transaction.dateISO}`}
              transaction={transaction}
            />
          ))
        ) : (
          <Card size="sm" className="py-6 shadow-ring">
            <CardContent className="flex flex-col items-center gap-2 px-4 text-center">
              <p className="text-base font-semibold text-foreground">{t("history.emptyTitle")}</p>
              <p className="max-w-[26ch] text-sm leading-[1.6] text-text-secondary text-pretty">
                {t("history.emptyDescription")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {items.length > 0 ? (
        <Button type="button" variant="secondary" size="sm">
          {t("history.loadMore")}
        </Button>
      ) : null}
    </div>
  )
}

function HistoryRow({ transaction }: { transaction: TrackerTransaction }) {
  const t = useTranslations("Tracker")

  return (
    <Card size="sm" className="py-3 shadow-ring">
      <CardContent className="flex items-center gap-3 px-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
            transaction.methodTone === "cash" && "bg-surface-offset text-text-secondary",
            transaction.methodTone === "card" && "bg-info-subtle text-info",
            transaction.methodTone === "bank" && "bg-success-subtle text-success",
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
                transaction.direction === "received" ? "text-info" : "text-brand",
              )}
            >
              {transaction.amount}
            </p>
            <time className="shrink-0 text-end text-sm text-text-secondary">
              {transaction.date}
            </time>
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">
            {transaction.descriptionKey
              ? t(transaction.descriptionKey)
              : transaction.descriptionLabel}{" "}
            / {transaction.typeLabelKey ? t(transaction.typeLabelKey) : transaction.typeLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getAppliedFilters(
  t: ReturnType<typeof useTranslations<"Tracker">>,
  filters: TrackerHistoryTabProps["filters"],
) {
  const labels: string[] = []

  if (filters.type !== "all") {
    labels.push(t(`drawer.filter.typeOptions.${filters.type}`))
  }

  if (filters.direction !== "all") {
    labels.push(t(`drawer.filter.directionOptions.${filters.direction}`))
  }

  if (filters.method !== "all") {
    labels.push(t(`drawer.filter.methodOptions.${filters.method}`))
  }

  if (filters.from || filters.to) {
    labels.push(
      filters.from && filters.to
        ? t("history.rangeBetween", { from: filters.from, to: filters.to })
        : filters.from
          ? t("history.rangeFrom", { from: filters.from })
          : t("history.rangeTo", { to: filters.to }),
    )
  } else if (filters.preset !== "thisMonth") {
    labels.push(t(`drawer.filter.dateOptions.${filters.preset}`))
  }

  return labels
}
