import { Wallet02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { BudgetCard } from "@/components/tracker/cards/budget-card"
import type { FixedExpenseItem } from "@/components/tracker/types"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type BudgetsSectionProps = {
  items: FixedExpenseItem[]
  onCardTap: (item: FixedExpenseItem) => void
}

export function BudgetsSection({ items, onCardTap }: BudgetsSectionProps) {
  const t = useTranslations("Tracker.fixed")

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className={cn("flex items-center gap-1.5", semanticTextClass.fixed)}>
          <HugeiconsIcon icon={Wallet02Icon} size={15} aria-hidden="true" />
          <span className="text-sm font-semibold">{t("sections.budgets")}</span>
        </div>
        <span className="text-xs font-medium tabular-nums text-text-tertiary">
          {items.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-2 shadow-soft">
        <div className="flex flex-col gap-1.5 p-1.5">
          {items.map((item) => (
            <BudgetCard key={item.id} item={item} onTap={onCardTap} />
          ))}
        </div>
      </div>
    </section>
  )
}
