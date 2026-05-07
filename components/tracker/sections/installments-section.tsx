import { Layers01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
      <div className="flex items-center justify-between px-1">
        <div className={cn("flex items-center gap-2", semanticTextClass.fixed)}>
          <HugeiconsIcon icon={Layers01Icon} size={18} aria-hidden="true" />
          <span className="text-[1.0625rem] font-semibold">{t("sections.installments")}</span>
        </div>
        <span className="text-xs font-medium tabular-nums text-text-tertiary">
          {items.length}
        </span>
      </div>

      {/* Overview summary tile */}
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

      {/* Item cards — no wrapper */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <InstallmentCard key={item.id} item={item} onTap={onCardTap} />
        ))}
      </div>
    </section>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
