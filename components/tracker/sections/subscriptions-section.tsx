import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { SubscriptionCard } from "@/components/tracker/cards/subscription-card"
import { TrackerProgress } from "@/components/tracker/tracker-progress"
import type { FixedExpenseItem } from "@/components/tracker/types"
import { statTileClass } from "@/lib/design-system-classes"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type SubscriptionsSectionProps = {
  items: FixedExpenseItem[]
  onCardTap: (item: FixedExpenseItem) => void
}

export function SubscriptionsSection({ items, onCardTap }: SubscriptionsSectionProps) {
  const t = useTranslations("Tracker.fixed")

  if (items.length === 0) return null

  const totalPaid = items.reduce((sum, item) => sum + item.paid, 0)
  const totalObligation = items.reduce((sum, item) => sum + item.budget, 0)
  const paidCount = items.filter((item) => item.paymentStatus === "paid").length
  const paidPct = totalObligation > 0 ? (totalPaid / totalObligation) * 100 : 0

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className={cn("flex items-center gap-2", semanticTextClass.fixed)}>
          <HugeiconsIcon icon={RepeatIcon} size={18} aria-hidden="true" />
          <span className="text-[1.0625rem] font-semibold">{t("sections.subscriptions")}</span>
        </div>
        <span className="text-xs font-medium tabular-nums text-text-tertiary">
          {items.length}
        </span>
      </div>

      {/* Mini overview tile */}
      <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-2 p-4 shadow-soft">
        <div className="grid grid-cols-3 gap-2">
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("subscriptionOverview.paid")}
            </p>
            <p
              dir="ltr"
              className={cn(
                "mt-0.5 truncate text-xs font-semibold tabular-nums",
                semanticTextClass.income,
              )}
            >
              {formatAmount(totalPaid)}
            </p>
          </div>
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("subscriptionOverview.total")}
            </p>
            <p
              dir="ltr"
              className="mt-0.5 truncate text-xs font-semibold tabular-nums text-foreground"
            >
              {formatAmount(totalObligation)}
            </p>
          </div>
          <div className={cn(statTileClass, "col-span-1 text-start")}>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              {t("subscriptionOverview.settledLabel")}
            </p>
            <p dir="ltr" className="mt-0.5 truncate text-xs font-semibold tabular-nums text-foreground">
              {t("subscriptionOverview.settledValue", { paid: paidCount, total: items.length })}
            </p>
          </div>
        </div>
        <TrackerProgress value={paidPct} tone="fixed" showPercent />
      </div>

      {/* Item cards — no wrapper */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SubscriptionCard key={item.id} item={item} onTap={onCardTap} />
        ))}
      </div>
    </section>
  )
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("en").format(Math.round(value))} EGP`
}
