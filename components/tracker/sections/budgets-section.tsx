import { useTranslations } from "next-intl"

import { BudgetCard } from "@/components/tracker/cards/budget-card"
import type { FixedExpenseItem } from "@/components/tracker/types"
import { semanticTextClass } from "@/lib/semantic-styles"

type BudgetsSectionProps = {
  items: FixedExpenseItem[]
  onCardTap: (item: FixedExpenseItem) => void
}

export function BudgetsSection({ items, onCardTap }: BudgetsSectionProps) {
  const t = useTranslations("Tracker.fixed")

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader label={t("sections.budgets")} />
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <BudgetCard key={item.id} item={item} onTap={onCardTap} />
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
