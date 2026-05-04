import { Alert02Icon, PackageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { majorExpenses as initialMajorExpenses } from "@/components/tracker/tracker-data"
import type { MajorExpense } from "@/components/tracker/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { semanticProgressClass, semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type TrackerMajorTabProps = {
  items?: MajorExpense[]
}

export function TrackerMajorTab({ items = initialMajorExpenses }: TrackerMajorTabProps) {
  const t = useTranslations("Tracker")
  const totalAmount = items.reduce(
    (sum, expense) => sum + Number(expense.amount.replaceAll(/[^\d]/g, "")),
    0,
  )
  const largeCount = items.filter((expense) => expense.isLarge).length

  if (items.length === 0) {
    return (
      <Card size="sm" className="py-4 text-center">
        <CardContent className={cn("px-4", heroSurfaceClass)}>
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-major/35 bg-major-subtle text-major">
            <HugeiconsIcon icon={PackageIcon} aria-hidden="true" size={28} />
          </div>
          <h2 className="text-[1.0625rem] font-semibold text-foreground">
            {t("empty.majorTitle")}
          </h2>
          <p className="mt-2 text-sm leading-[1.5] text-text-secondary">
            {t("empty.majorDescription")}
          </p>
          <Button type="button" variant="secondary" size="sm" className="mt-4">
            {t("empty.addMajor")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] border px-card py-3",
          semanticSurfaceClass.warning,
        )}
      >
        <HugeiconsIcon icon={Alert02Icon} aria-hidden="true" size={20} />
        <p className="text-sm font-semibold">{t("major.warning")}</p>
      </div>
      <Card size="sm" className="border-major/35 py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <div className="space-y-1">
            <p className="text-[1.0625rem] font-semibold text-foreground">
              {t("major.summaryTitle")}
            </p>
            <p className="text-sm leading-[1.5] text-text-secondary text-pretty">
              {t("major.summaryDescription", {
                count: items.length,
                amount: `${new Intl.NumberFormat("en").format(totalAmount)} EGP`,
              })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SummaryTile
              label={t("major.totalLabel")}
              value={`${new Intl.NumberFormat("en").format(totalAmount)} EGP`}
              numeric
            />
            <SummaryTile
              label={t("major.largeLabel")}
              value={t("major.largeValue", { count: largeCount })}
            />
          </div>
        </CardContent>
      </Card>
      {items.map((expense) => (
        <Card key={expense.nameKey ?? expense.nameLabel} size="sm" className="py-3 shadow-ring">
          <CardContent className="flex items-center gap-3 px-4">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
                semanticSurfaceClass.major,
              )}
            >
              <span
                className={cn(
                  "size-2.5 rounded-full data-[large=false]:bg-border",
                  semanticProgressClass.major,
                )}
                data-large={expense.isLarge}
              />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-[1.0625rem] font-semibold leading-[1.25] text-foreground">
                  {expense.nameKey ? t(expense.nameKey) : expense.nameLabel}
                </p>
                <p
                  dir="ltr"
                  className="shrink-0 text-end text-[1.0625rem] font-semibold text-foreground tabular-nums"
                >
                  {expense.amount}
                </p>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-3">
                <p className="truncate text-sm text-text-secondary">
                  {expense.date} / {expense.methodKey ? t(expense.methodKey) : expense.methodLabel}
                </p>
                <p
                  dir="ltr"
                  className={cn("shrink-0 text-xs font-semibold tabular-nums", semanticTextClass.major)}
                >
                  {expense.percent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SummaryTile({
  label,
  value,
  numeric = false,
}: {
  label: string
  value: string
  numeric?: boolean
}) {
  return (
    <div className={statTileClass}>
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-text-tertiary uppercase">
        {label}
      </p>
      <p
        dir={numeric ? "ltr" : undefined}
        className="mt-1 text-sm font-semibold text-foreground tabular-nums"
      >
        {value}
      </p>
    </div>
  )
}
