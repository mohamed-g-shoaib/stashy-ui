import { useTranslations } from "next-intl"

import { InstallmentCard } from "@/components/tracker/cards/installment-card"
import { TrackerProgress } from "@/components/tracker/tracker-progress"
import type { FixedExpenseItem, InstallmentOverview } from "@/components/tracker/types"
import { statTileClass } from "@/lib/design-system-classes"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type InstallmentsSectionProps = {
  items: FixedExpenseItem[]
  overview: InstallmentOverview
  onCardTap: (item: FixedExpenseItem) => void
}

export function InstallmentsSection({ items, overview, onCardTap }: InstallmentsSectionProps) {
  const t = useTranslations("Tracker.fixed")

  if (items.length === 0) return null

  const total = overview.totalPaidAllTime + overview.totalRemainingAllTime
  const pct = total > 0 ? Math.round((overview.totalPaidAllTime / total) * 100) : 0

  return (
    <section className="flex flex-col gap-3">
      {/* Overview summary — outside the item card */}
      <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-2 p-4 shadow-soft">
        <div className="grid grid-cols-3 gap-2">
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("installmentOverview.obligation")}
            </p>
            <p
              dir="ltr"
              className="mt-0.5 truncate text-xs font-semibold tabular-nums text-foreground"
            >
              {formatAmount(overview.monthlyObligation)}
            </p>
          </div>
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("installmentOverview.paidAllTime")}
            </p>
            <p
              dir="ltr"
              className={cn(
                "mt-0.5 truncate text-xs font-semibold tabular-nums",
                semanticTextClass.income,
              )}
            >
              {formatAmount(overview.totalPaidAllTime)}
            </p>
          </div>
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("installmentOverview.remainingAllTime")}
            </p>
            <p
              dir="ltr"
              className="mt-0.5 truncate text-xs font-semibold tabular-nums text-foreground"
            >
              {formatAmount(overview.totalRemainingAllTime)}
            </p>
          </div>
        </div>
        <TrackerProgress value={pct} tone="fixed" showPercent />
      </div>

      {/* Item list inside one big card */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-2 shadow-soft">
        <div className="px-4 pb-2 pt-3">
          <span
            className={cn(
              "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
              semanticTextClass.fixed,
            )}
          >
            {t("sections.installments")}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-1.5 pt-0">
          {items.map((item) => (
            <InstallmentCard key={item.id} item={item} onTap={onCardTap} />
          ))}
        </div>
      </div>
    </section>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
