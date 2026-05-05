import { useTranslations } from "next-intl"

import { InstallmentCard } from "@/components/tracker/cards/installment-card"
import { TrackerProgress } from "@/components/tracker/tracker-progress"
import type { FixedExpenseItem, InstallmentOverview } from "@/components/tracker/types"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
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

  // Overall lifecycle progress: how much of the total committed spend is done
  const total = overview.totalPaidAllTime + overview.totalRemainingAllTime
  const pct = total > 0 ? Math.round((overview.totalPaidAllTime / total) * 100) : 0

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader label={t("sections.installments")} />

      {/* Overview card — mirrors FixedSummaryCard structure */}
      <div className={cn(heroSurfaceClass, "flex flex-col gap-3 p-4")}>
        {/* Stat tiles */}
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
              className={cn("mt-0.5 truncate text-xs font-semibold tabular-nums", semanticTextClass.income)}
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

        {/* Overall lifecycle progress bar */}
        <TrackerProgress value={pct} tone="fixed" showPercent />
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <InstallmentCard key={item.id} item={item} onTap={onCardTap} />
        ))}
      </div>
    </section>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      className={`flex min-h-10 items-center rounded-[var(--radius-sm)] bg-surface-offset px-3 py-2 ${semanticTextClass.fixed}`}
    >
      <span className="text-sm font-semibold">{label}</span>
    </div>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
