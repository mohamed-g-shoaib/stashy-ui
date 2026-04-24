import { Alert02Icon, PackageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { majorExpenses } from "@/components/tracker/tracker-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function TrackerMajorTab() {
  const t = useTranslations("Tracker")

  if (majorExpenses.length === 0) {
    return (
      <Card
        size="sm"
        className="rounded-md border border-border bg-card py-4 text-center shadow-soft"
      >
        <CardContent className="px-4">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-md border border-dashed border-border text-text-tertiary">
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
      <div className="flex min-h-12 items-center gap-2 rounded-md border border-warning bg-warning-subtle px-card py-3 text-warning dark:border-warning-dark dark:bg-warning-subtle-dark dark:text-warning-dark">
        <HugeiconsIcon icon={Alert02Icon} aria-hidden="true" size={20} />
        <p className="text-sm font-semibold">{t("major.warning")}</p>
      </div>
      {majorExpenses.map((expense) => (
        <Card
          key={expense.nameKey}
          size="sm"
          className="rounded-md border border-border bg-card py-3 shadow-ring"
        >
          <CardContent className="flex items-center gap-3 px-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-warning-subtle text-warning shadow-ring dark:bg-warning-subtle-dark dark:text-warning-dark">
              <span
                className="size-2.5 rounded-full bg-warning data-[large=false]:bg-border"
                data-large={expense.isLarge}
              />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-[1.0625rem] font-semibold leading-[1.25] text-foreground">
                  {t(expense.nameKey)}
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
                  {expense.date} / {t(expense.methodKey)}
                </p>
                <p dir="ltr" className="shrink-0 text-xs font-semibold text-warning tabular-nums">
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
