"use client"

import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import * as React from "react"

import {
  budgetBuckets as initialBudgetBuckets,
  monthlyPayments as initialMonthlyPayments,
} from "@/components/tracker/tracker-data"
import { TrackerProgress } from "@/components/tracker/tracker-progress"
import type {
  BudgetBucket,
  MonthlyPayment,
  PaymentStatus,
  WarningTone,
} from "@/components/tracker/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TrackerFixedTabProps = {
  items?: MonthlyPayment[]
  buckets?: BudgetBucket[]
}

export function TrackerFixedTab({
  items = initialMonthlyPayments,
  buckets = initialBudgetBuckets,
}: TrackerFixedTabProps) {
  return (
    <div className="flex flex-col gap-section">
      <MonthlySection items={items} />
      <BudgetsSection buckets={buckets} />
    </div>
  )
}

function MonthlySection({ items }: { items: MonthlyPayment[] }) {
  const t = useTranslations("Tracker")
  const [expanded, setExpanded] = React.useState(true)
  const visibleItems = expanded ? items : [items.at(-1)!]

  if (items.length === 0) {
    return (
      <EmptySection
        title={t("empty.monthlyTitle")}
        description={t("empty.monthlyDescription")}
        action={t("empty.addMonthly")}
      />
    )
  }

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader
        label={t("sections.monthly")}
        summary={t("sections.monthlySummary", {
          count: items.length,
          total: getMonthlyTotal(items),
        })}
        tone="danger"
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
      />
      <div className="flex flex-col gap-3">
        {visibleItems.map((item) => (
          <MonthlyRow key={item.nameKey ?? item.nameLabel} item={item} />
        ))}
      </div>
    </section>
  )
}

function BudgetsSection({ buckets }: { buckets: BudgetBucket[] }) {
  const t = useTranslations("Tracker")
  const [expanded, setExpanded] = React.useState(true)
  const visibleBuckets = expanded ? buckets : [buckets[0]]

  if (buckets.length === 0) {
    return (
      <EmptySection
        title={t("empty.budgetTitle")}
        description={t("empty.budgetDescription")}
        action={t("empty.addBudget")}
      />
    )
  }

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader
        label={t("sections.budgets")}
        summary={t("sections.budgetSummary", {
          count: buckets.length,
          total: getBudgetSummary(buckets),
        })}
        tone="warning"
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
      />
      <div className="flex flex-col gap-3">
        {visibleBuckets.map((bucket) => (
          <BudgetCard key={bucket.nameKey ?? bucket.nameLabel} bucket={bucket} />
        ))}
      </div>
    </section>
  )
}

function SectionHeader({
  label,
  summary,
  tone,
  expanded,
  onToggle,
}: {
  label: string
  summary: string
  tone: WarningTone
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-12 items-center gap-2 text-start text-[1.0625rem] font-semibold",
        tone === "danger" && "text-danger",
        tone === "warning" && "text-warning",
      )}
      onClick={onToggle}
      aria-expanded={expanded}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span dir="ltr" className="shrink-0 text-xs font-semibold text-current tabular-nums">
        {summary}
      </span>
      {tone !== "neutral" ? (
        <HugeiconsIcon icon={Alert02Icon} aria-hidden="true" size={18} />
      ) : null}
      <HugeiconsIcon
        icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
        aria-hidden="true"
        size={18}
      />
    </button>
  )
}

function MonthlyRow({ item }: { item: MonthlyPayment }) {
  const t = useTranslations("Tracker")

  return (
    <Card size="sm" className="py-3 shadow-ring">
      <CardContent className="flex items-center justify-between gap-4 px-4">
        <div className="min-w-0 text-start">
          <p className="truncate text-[1.0625rem] font-semibold text-foreground">
            {item.nameKey ? t(item.nameKey) : item.nameLabel}
          </p>
          <p className="text-sm text-text-secondary">{item.date}</p>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-[1.0625rem] font-semibold text-foreground tabular-nums">
            {item.amount}
          </p>
          <StatusBadge status={item.status} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const t = useTranslations("Tracker.status")

  return (
    <Badge
      className={cn(
        "h-5 border-transparent px-2 text-[0.6875rem]",
        status === "paid" && "bg-success-subtle text-success",
        status === "pending" && "bg-warning-subtle text-warning",
        status === "overdue" && "bg-danger-subtle text-danger",
      )}
      variant="secondary"
    >
      {t(status)}
    </Badge>
  )
}

function BudgetCard({ bucket }: { bucket: BudgetBucket }) {
  const t = useTranslations("Tracker")
  const [transactionsOpen, setTransactionsOpen] = React.useState(false)
  const tone = bucket.percent >= 100 ? "danger" : bucket.percent >= 90 ? "warning" : "brand"

  return (
    <Card size="sm" className="py-4">
      <CardContent className="px-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="min-w-0 flex-1 text-start">
            <h3 className="truncate text-[1.0625rem] font-semibold text-foreground">
              {bucket.nameKey ? t(bucket.nameKey) : bucket.nameLabel}
            </h3>
            <p dir="ltr" className="text-sm text-text-secondary tabular-nums">
              {bucket.spent}/{bucket.budgeted}
            </p>
          </div>
          <span
            dir="ltr"
            className={cn(
              "text-sm font-semibold tabular-nums",
              bucket.percent >= 90 ? "text-warning" : "text-text-secondary",
            )}
          >
            {bucket.percent}%
          </span>
        </div>
        <TrackerProgress valueClass={bucket.percentClass} tone={tone} />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="mt-2 h-10 min-h-10 px-0 text-xs text-text-secondary"
          onClick={() => setTransactionsOpen((value) => !value)}
          aria-expanded={transactionsOpen}
        >
          <HugeiconsIcon
            icon={transactionsOpen ? ArrowUp01Icon : ArrowDown01Icon}
            data-icon="inline-start"
            aria-hidden="true"
          />
          {t("budgets.transactionCount", { count: bucket.transactionCount })}
        </Button>
        {transactionsOpen ? (
          <div className="mt-2 rounded-[var(--radius-sm)] bg-surface-offset p-3 text-xs text-text-secondary shadow-ring">
            {t("budgets.transactionPreview")}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function EmptySection({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: string
}) {
  return (
    <Card size="sm" className="py-4 text-center">
      <CardContent className="px-4">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-border text-text-tertiary">
          <HugeiconsIcon icon={PackageIcon} aria-hidden="true" size={28} />
        </div>
        <h3 className="text-[1.0625rem] font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-[1.5] text-text-secondary">{description}</p>
        <Button type="button" variant="secondary" size="sm" className="mt-4">
          {action}
        </Button>
      </CardContent>
    </Card>
  )
}

function getMonthlyTotal(items: MonthlyPayment[]) {
  const total = items.reduce((sum, item) => sum + extractAmount(item.amount), 0)

  return `${new Intl.NumberFormat("en").format(total)} EGP`
}

function getBudgetSummary(buckets: BudgetBucket[]) {
  const spent = buckets.reduce((sum, bucket) => sum + extractAmount(bucket.spent), 0)
  const budgeted = buckets.reduce((sum, bucket) => sum + extractAmount(bucket.budgeted), 0)

  return `${new Intl.NumberFormat("en").format(spent)}/${new Intl.NumberFormat("en").format(budgeted)} EGP`
}

function extractAmount(value: string) {
  return Number(value.replaceAll(/[^\d]/g, "")) || 0
}
