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
    <section>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-surface-2 shadow-soft">
        <div className="px-4 pb-2 pt-3">
          <span
            className={cn(
              "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
              semanticTextClass.fixed,
            )}
          >
            {t("sections.budgets")}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-1.5 pt-0">
          {items.map((item) => (
            <BudgetCard key={item.id} item={item} onTap={onCardTap} />
          ))}
        </div>
      </div>
    </section>
  )
}
